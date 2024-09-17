import os
from django.db import connection
from CommonLib import query
from django.conf import settings as media_path
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import base64,os
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from CommonLib.lib import dictfetchall

#Reference Items data fetching
def refitem_fetch(refitemcat_code):
    cur = connection.cursor()
    cur.execute("""select ri.id, ri.refitems_name, ri.refitems_code from reference_items ri
                    inner join reference_item_category ric on ric.id = ri.refitems_category_id
                    where ric.refitem_category_code = %s and ri.is_active = True order by refitems_name""", (refitemcat_code, ))
    refitem_datas = query.dictfetchall(cur)
    return refitem_datas

#Reference Items data fetching with customized order by
def refitem_fetch_orderby(refitemcat_code, orderby_val):
    cur = connection.cursor()
    cur.execute("""select ri.id, ri.refitems_name, ri.refitems_code from reference_items ri
                    inner join reference_item_category ric on ric.id = ri.refitems_category_id
                    where ric.refitem_category_code = %s and ri.is_active = True order by """+orderby_val, (refitemcat_code,))
    refitem_datas = query.dictfetchall(cur)
    return refitem_datas

#Reference Items link data fetching
def refitemlink_fetch(refitem_code):
    cur = connection.cursor()
    cur.execute("""select ril.to_refitems_category_id as id, ri.refitems_name from reference_items_link ril
                        inner join reference_items ri on ri.id = ril.to_refitems_category_id
                        where ril.from_refitems_category_id = %s and ril.is_active = True order by ril.id""", (refitem_code, ))
    refitem_datas = query.dictfetchall(cur)
    return refitem_datas

#File storage function
def file_datainsert(*args):
    # from CommonLib.hcms_common import file_datainsert
    # file_datainsert(['file_datas', '1'], [{'file_name': 'sample.png', 'file_binary': 'binary string'}])
    try:
        file_location = ''
        for data in args[0]:
            file_location = file_location + str(data)
            if not os.path.isdir(media_path.MEDIA_ROOT + str(file_location) +'/'): os.mkdir(media_path.MEDIA_ROOT + str(file_location) +'/')
            file_location = file_location + '/'
        for data in args[1]:
            file_name = data['file_name']
            file_binary = data['file_binary']
            file_find_remove = media_path.MEDIA_ROOT+file_location+file_name
            if os.path.isfile(file_find_remove):
                os.remove(file_find_remove)
            else:    ## Show an error ##
                print "Error: %s file not found" % file_find_remove
            upload_file = default_storage.save(''.join(str(file_location) + str(file_name)), ContentFile(base64.b64decode(file_binary)))
        return media_path.MEDIA_ROOT+file_location
    except Exception as e:
        print 'File insert error ---->',e
        return False

# Record validation for delete.    
def record_validation(*args):
    # from CommonLib.hcms_common import record_validation
    # record_validation('hcms_role', 1) --> hcms_role is table name and 1 is table record id
    try:
        cur = connection.cursor()
        cur.execute("""select (select r.relname from pg_class r where r.oid = c.conrelid) as to_table, 
                        (select array_agg(attname) from pg_attribute 
                        where attrelid = c.conrelid and ARRAY[attnum] <@ c.conkey) as col_name, 
                        (select r.relname from pg_class r where r.oid = c.confrelid) as from_table 
                        from pg_constraint c 
                        where c.confrelid = (select oid from pg_class where relname = '{0}');""".format(args[0]))
        reffered_records = query.dictfetchall(cur)
        cur.execute("""select array_agg(check_table) as check_table from scan_table_info 
                        where is_active=True and source_table = '{0}' group by source_table""".format(args[0]))
        check_tables = query.dictfetchall(cur)
        if check_tables:
            temp_to_table_list = [data["to_table"] for data in reffered_records]
            check_table_list = check_tables[0]['check_table']
            final_to_table_list = list(set(temp_to_table_list) & set(check_table_list))
            if args[0] == 'organization_info':
                final_to_table_list = [list_table for list_table in final_to_table_list if list_table != 'organization_unit_info']
            temp_data_list = []
            for data in reffered_records:
                if data["to_table"] in final_to_table_list:
                    temp_data_list.append(data) 
            reffered_records = temp_data_list
        for data in reffered_records:
            cur.execute("""select count(*) from {0} where is_active=True and {1}={2}""".format(data['to_table'], data['col_name'][0], args[1]))
            temp_data = cur.fetchall()
            if temp_data[0][0]:
                return False
        return True
    except Exception as e:
        print 'Record validation error ---->',e
        return False

def search_result(*args):
    search_str = args[0]
    if search_str[0] == "@":
        search_str = search_str[1:]
        cur.execute("select id, name as employee_name from employee_info  where name ilike '%{0}%'".format(search_str))
        employee_datas = query.dictfetchall(cur)
        for data in employee_datas:
            data['employee_url'] = config.employee_url
        json_data['employee_datas'] = employee_datas
        json_data['status'] = status_keys.SUCCESS_STATUS
    else:
        how_help_is = filter(lambda x: 'how' in x.lower() or 'help' in x.lower(), search_str.split(" "))
        if how_help_is:
            search_str = word_tokenize(search_str)
            stopWords = set(stopwords.words('english'))
            to_search_str = [ w for w in search_str if w.lower() not in stopWords]
            to_search_str = " ".join(str(x) for x in to_search_str)
            cur.execute("""select search_data, search_link from search_table_info where is_active=True and search_type='HELP' 
                            and search_keyword ilike '%{0}%' group by search_data, search_link""".format(str(to_search_str)))
            search_out_datas = query.dictfetchall(cur)
            for data in search_out_datas:
                data['search_link'] = config.search_url + str(data['search_link'])
            json_data['help_content_datas'] = search_out_datas
            json_data['status'] = status_keys.SUCCESS_STATUS
            return json_data
        else:
            search_str = word_tokenize(search_str)
            stopWords = set(stopwords.words('english'))
            to_search_str = [ w for w in search_str if w.lower() not in stopWords]
            to_search_str = " ".join(str(x) for x in to_search_str)
            cur.execute("""select search_data, search_link from search_table_info where is_active=True and search_type='FORM' 
                            and search_keyword ilike '%{0}%' group by search_data, search_link""".format(str(to_search_str)))
            search_out_datas = query.dictfetchall(cur)
            for data in search_out_datas:
                data['search_link'] = config.search_url + str(data['search_link'])
            json_data['form_datas'] = search_out_datas
            json_data['status'] = status_keys.SUCCESS_STATUS
    return json_data 
  
def menu_access_control(*args):
    print  "=====>",args 
    cur = connection.cursor()
    cur.execute('select role_id,group_id from auth_user where id=%s',(int(args[1]),)) 
    group_id = cur.fetchall()
    cur.execute("""select rpr.access_datas, hp.name as menu_status from auth_user au
                inner join hcms_role hr on hr.id = au.role_id
                inner join role_permission_rel rpr on rpr.role_id = hr.id
                inner join hcms_permission hp on hp.id = rpr.permission_id
                where au.id = %s and rpr.role_id = %s and rpr.group_id = %s and hp.name = 'View'""", (args[1],group_id[0][0],group_id[0][1],))
    menu_lists = cur.fetchall()
    if menu_lists:
        menu_lists = list(menu_lists[0][0])
    if str(args[0]) in menu_lists: 
        return_value = True
    else:
        return_value = False
    return return_value

def access_data_mgt(*args):
    cur = connection.cursor()
    cur.execute("""select rpr.access_datas, hp.name from role_permission_rel rpr
                inner join auth_user au on au.role_id = rpr.role_id
                inner join hcms_permission hp on hp.id = rpr.permission_id
                where au.id = %s and au.group_id = %s  and hp.id in (2,3,4)""", (int(args[0]),int(args[1]),))
    access_datas = cur.fetchall()
    if access_datas:
        access_datas = list(access_datas)
    else:
        access_datas = []
    return access_datas

@api_view(['GET'])
def hcm_organization_fetch(request):
    json_data={}
    json_data['organization']=[]
    cur = connection.cursor()
    try:
         cur.execute('select id,name from organization_info where is_active=TRUE order by name')
         org_data = dictfetchall(cur)
         if org_data:
             json_data['organization']=org_data
             json_data['status']='NTE-001'
             json_data['msg']=200
    except Exception as e:
       error=exception_handling(500,type(e).__name__,str(e))
       json_data['data']=error
       json_data['status']='NTE-002'
       json_data['msg']=500
    return Response(json_data,status=status.HTTP_200_OK)

@api_view(['GET'])
def hcm_organization_unit_fetch(request,org_id):
    json_data={}
    json_data['organization_unit']=[]
    cur = connection.cursor()
    try:
      if org_id!='' and org_id is not None :
         cur.execute("""select id,orgunit_name from organization_unit_info where is_active='TRUE' 
         and organization_id=%s and parent_orgunit_id!=0 order by orgunit_name""",org_id)
         org_unit_data = dictfetchall(cur)
         if org_unit_data:
             json_data['organization_unit']=org_unit_data
             json_data['status']='NTE-001'
             json_data['msg']=200
    except Exception as e:
       error=exception_handling(500,type(e).__name__,str(e))
       json_data['data']=error
       json_data['status']='NTE-002'
       json_data['msg']=500
    return Response(json_data,status=status.HTTP_200_OK)

@api_view(['GET'])
def hcm_organization_division_fetch(request,org_unit_id):
    json_data={}
    json_data['division']=[]
    cur = connection.cursor()
    try:
      if org_unit_id!='' and org_unit_id is not None :
         cur.execute("""select id,name from team_details_info 
         where is_active=True and org_unit_id="""+org_unit_id+""" order by name""")
         division_data = dictfetchall(cur)
         if division_data:
             json_data['division']=division_data
             json_data['status']='NTE-001'
             json_data['msg']=200
    except Exception as e:
       error=exception_handling(500,type(e).__name__,str(e))
       json_data['data']=error
       json_data['status']='NTE-002'
       json_data['msg']=500
    return Response(json_data,status=status.HTTP_200_OK)

def exception_handling(code,msg,info):
    ''' 
21-FEB-2018 || ESA || Exception handling  @param request: Request Object  @type request : Object  @return: return the data as object'''
    error={}
    error['status']=code
    error['error_type']=msg
    error['error']=info
    return error

