from django import template
from django.contrib.auth.models import Group
from CommonLib import query
from django.db import connection
from datetime import datetime

register = template.Library()
@register.filter(name='has_group')
def has_group(user, group_name):
    group = Group.objects.get(name=group_name)
    return True if group in user.groups.all() else False
@register.inclusion_tag('tags/side_menu.html')
def side_nav(*args,**kwargs):  
    cur = connection.cursor()
    cur.execute(query.fetch_hcms_query('hcms_dashboard', 'usr_permission_data_fetch'),(kwargs['user'].id, ))
    usr_permission_data = query.dictfetchall(cur)[0]
    return {
            'user':kwargs['user'], 
            'menu_name':kwargs['menu_name'],
            'permission_codes': usr_permission_data,
            }  
@register.inclusion_tag('tags/nav_tags.html', takes_context=True)   
def nav_tags(context,*args,**kwargs):   
    request = context['request'] 
    cur = connection.cursor()      
    cur.execute("""select UPPER(coalesce(ei.name,'')||' '||coalesce(ei.last_name,'')) as name, ai.name as u_imgname from employee_info ei 
                    left join attachment_info ai on ai.id = ei.image_id_id
                    where ei.related_user_id_id = %s""",(int(request.user.id),))
    user_data = cur.fetchall()
    cur.execute(""" select rpr.access_datas, hp.name as menu_status from auth_user au 
                    inner join hcms_role hr on hr.id = au.role_id
                    inner join role_permission_rel rpr on rpr.role_id = hr.id
                    inner join hcms_permission hp on hp.id = rpr.permission_id
                    where au.id = %s and rpr.role_id = %s and rpr.group_id = %s and hp.name = 'View'""", (request.user.id,request.user.role_id,request.user.group_id,))
    menu_lists = cur.fetchall()
    print "==menu list==>",menu_lists 
    if str(kwargs["breadcrum_title"]) == "AccessDenied":
        tags_active = True 
    else: 
        tags_active = False
    if menu_lists:
        menu_lists = list(menu_lists[0][0])
    if user_data:
        user_name = user_data[0][0] if user_data[0][0] else ''
        user_img = user_data[0][1] if user_data[0][1] else 'no_data.png'
    else:
        user_name = 'NEXT ADMIN'
        user_img = 'no_data.png'
    return {
            'user': str(user_name),
            'uimage': str(user_img),
            'menu_lists': menu_lists,
            'breadcrum_title': kwargs['breadcrum_title'],
            'tags_active': tags_active,
            'build_no': request.session['build_no'],
            'build_date': datetime.strptime(request.session['build_date'].split(' ')[0], '%Y-%m-%d').strftime('%d %b %Y')
            }
    
@register.inclusion_tag('tags/mynext_nav_tags.html', takes_context=True)  
def mynext_nav_tags(context,*args,**kwargs):
    request = context['request']
    cur = connection.cursor()   
    cur.execute("""select UPPER(coalesce(ei.name,'')||' '||coalesce(ei.last_name,'')) as name, ai.name as u_imgname from employee_info ei 
                    left join attachment_info ai on ai.id = ei.image_id_id
                    where ei.related_user_id_id = %s""",(int(request.user.id),))
    user_data = cur.fetchall()
    cur.execute(""" select rpr.access_datas, hp.name as menu_status from auth_user au 
                    inner join hcms_role hr on hr.id = au.role_id
                    inner join role_permission_rel rpr on rpr.role_id = hr.id
                    inner join hcms_permission hp on hp.id = rpr.permission_id
                    where au.id = %s and rpr.role_id = %s and rpr.group_id = %s and hp.name = 'View'""", (request.user.id,request.user.role_id,request.user.group_id,))
    menu_lists = cur.fetchall()
    if str(kwargs["breadcrum_title"]) == "AccessDenied":
        tags_active = True
    else:
        tags_active = False
    if menu_lists:
        menu_lists = list(menu_lists[0][0])
    if user_data:
        user_name = user_data[0][0] if user_data[0][0] else ''
        user_img = user_data[0][1] if user_data[0][1] else 'no_data.png'
    else:
        user_name = 'NEXT ADMIN'
        user_img = 'no_data.png'
    return {
            'user': str(user_name),
            'uimage': str(user_img),
            'menu_lists': menu_lists,
            'breadcrum_title': kwargs['breadcrum_title'],
            'tags_active': tags_active,
            'build_no': request.session['build_no'],
            'build_date': datetime.strptime(request.session['build_date'].split(' ')[0], '%Y-%m-%d').strftime('%d %b %Y')
            }
    
