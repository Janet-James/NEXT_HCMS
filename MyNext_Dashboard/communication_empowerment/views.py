# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from CommonLib import query
from django.db import connection
from CommonLib.hcms_common import menu_access_control
from CommonLib.lib import *
import json
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from django.http.response import HttpResponse
from CommonLib import query
from django.db import connection
from CommonLib.hcms_common import menu_access_control,refitem_fetch
from CommonLib.lib import *
# for decoder function
from django.core import serializers
from django.core.serializers.json import DjangoJSONEncoder
import HCMS.settings as status_keys
import requests
import logging
import logging.handlers
import config
from models import HCMS_CE_Access_Setup,HCMS_CE_SLA
import threading
from django.views.decorators.csrf import csrf_exempt
import HCMS.settings as settings
from CommonLib.asyn_mail import asyn_email,communication_asyn_email
logger_obj = logging.getLogger('logit')

from django.core.files.uploadedfile import InMemoryUploadedFile
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from wsgiref.util import FileWrapper
from django.utils.encoding import smart_str


  #**************  || BAV ||    MYNEXT Communication Empowerment  Function  **************   
    
def communication_ticket_details(request):
    ''' 
            11-DEC-2018 || BAV || To load Communication Details View.
            @param request: Request Object
            @type request : Object
            @return:   HttpResponse or Redirect the another URL
    '''
    ticket_view={}
    try:
        if request.user.id:
            service_type=request.GET.get('service_type')
            cr = connection.cursor() 
            cr.execute("""select case when a.assigned_to_id is null and a.service_call_group=1 then 'HCM Group' 
            when a.assigned_to_id is null and a.service_call_group=2 then 'PMO Group' 
            when a.assigned_to_id is null and a.service_call_group=3 then 'GS Group'
            when a.assigned_to_id is not null then concat(eai.name,' ',eai.last_name) end as assigned_to,(concat(DATE_PART('day',now()::timestamp - a.created_date::timestamp),' Days:') ||
        concat(DATE_PART('hours',now()::timestamp - a.created_date::timestamp),' Hours:') ||
        concat(DATE_PART('minutes',now()::timestamp - a.created_date::timestamp),' Minutes')) as age,a.id,a.query_code as ticket_no,row_number() over() as s_no,
        a.created_date as date,a.query,a.service_call_status,ref.refitems_name as priority, concat(ei.name,' ',ei.last_name) as status_changed_by,concat(ei.name,' ',ei.last_name) as raised_by  from hcms_ce_service_call as a 
left join reference_items ref on ref.id=a.priority_id left join employee_info ei on a.opened_by_id = ei.id left join employee_info eai on a.assigned_to_id =eai.id
where a.is_active and (a.service_call_status=1 or a.service_call_status=6) and service_call_group={0} order by a.id desc""".format(service_type))
            ticket_view['opn_tik_fetch'] =  dictfetchall(cr)
            cr.execute("""select case when a.assigned_to_id is null and a.service_call_group=1 then 'HCM Group' 
            when a.assigned_to_id is null and a.service_call_group=2 then 'PMO Group' 
            when a.assigned_to_id is null and a.service_call_group=3 then 'GS Group'
            when a.assigned_to_id is not null then concat(eai.name,' ',eai.last_name) end as assigned_to,(concat(DATE_PART('day',now()::timestamp - a.created_date::timestamp),' Days:') ||
        concat(DATE_PART('hours',now()::timestamp - a.created_date::timestamp),' Hours:') ||
        concat(DATE_PART('minutes',now()::timestamp - a.created_date::timestamp),' Minutes')) as age,a.id,a.query_code as ticket_no,row_number() over() as s_no,
        a.created_date as date,a.query,a.service_call_status,ref.refitems_name as priority, concat(ei.name,' ',ei.last_name) as status_changed_by,concat(eri.name,' ',eri.last_name) as raised_by  from hcms_ce_service_call as a 
left join reference_items ref on ref.id=a.priority_id left join employee_info ei on a.answered_by_id = ei.id left join employee_info eai on a.assigned_to_id =eai.id left join employee_info eri on a.opened_by_id =eri.id
where a.is_active and a.service_call_status=2 and service_call_group={0} order by a.id desc""".format(service_type))
            ticket_view['ans_tik_fetch'] =  dictfetchall(cr)
            cr.execute(""" select case when a.assigned_to_id is null and a.service_call_group=1 then 'HCM Group' 
            when a.assigned_to_id is null and a.service_call_group=2 then 'PMO Group' 
            when a.assigned_to_id is null and a.service_call_group=3 then 'GS Group'
            when a.assigned_to_id is not null then concat(eai.name,' ',eai.last_name) end as assigned_to,(concat(DATE_PART('day',now()::timestamp - a.created_date::timestamp),' Days:') ||
        concat(DATE_PART('hours',now()::timestamp - a.created_date::timestamp),' Hours:') ||
        concat(DATE_PART('minutes',now()::timestamp - a.created_date::timestamp),' Minutes')) as age,a.id,a.query_code as ticket_no,row_number() over() as s_no,
        a.created_date as date,a.query,a.service_call_status,ref.refitems_name as priority, concat(ei.name,' ',ei.last_name) as status_changed_by,concat(eri.name,' ',eri.last_name) as raised_by  from hcms_ce_service_call as a 
left join reference_items ref on ref.id=a.priority_id left join employee_info ei on a.resolved_by_id = ei.id left join employee_info eai on a.assigned_to_id =eai.id left join employee_info eri on a.opened_by_id =eri.id
where a.is_active and a.service_call_status=3 and service_call_group={0} order by a.id desc""".format(service_type))
            ticket_view['res_tik_fetch'] =  dictfetchall(cr)
            cr.execute("""select case when a.assigned_to_id is null and a.service_call_group=1 then 'HCM Group' 
            when a.assigned_to_id is null and a.service_call_group=2 then 'PMO Group' 
            when a.assigned_to_id is null and a.service_call_group=3 then 'GS Group'
            when a.assigned_to_id is not null then concat(eai.name,' ',eai.last_name) end as assigned_to, (concat(DATE_PART('day',now()::timestamp - a.created_date::timestamp),' Days:') ||
        concat(DATE_PART('hours',now()::timestamp - a.created_date::timestamp),' Hours:') ||
        concat(DATE_PART('minutes',now()::timestamp - a.created_date::timestamp),' Minutes')) as age,a.id,a.query_code as ticket_no,row_number() over() as s_no,
        a.created_date as date,a.query,a.service_call_status,ref.refitems_name as priority, concat(ei.name,' ',ei.last_name) as status_changed_by,concat(eri.name,' ',eri.last_name) as raised_by  from hcms_ce_service_call as a 
left join reference_items ref on ref.id=a.priority_id left join employee_info ei on a.verified_by_id = ei.id left join employee_info eai on a.assigned_to_id =eai.id left join employee_info eri on a.opened_by_id =eri.id
where a.is_active and a.service_call_status=4 and service_call_group={0} order by a.id desc""".format(service_type))
            ticket_view['verf_tik_fetch'] =  dictfetchall(cr)
            cr.execute("""select case when a.assigned_to_id is null and a.service_call_group=1 then 'HCM Group' 
            when a.assigned_to_id is null and a.service_call_group=2 then 'PMO Group' 
            when a.assigned_to_id is null and a.service_call_group=3 then 'GS Group'
            when a.assigned_to_id is not null then concat(eai.name,' ',eai.last_name) end as assigned_to,(concat(DATE_PART('day',now()::timestamp - a.created_date::timestamp),' Days:') ||
        concat(DATE_PART('hours',now()::timestamp - a.created_date::timestamp),' Hours:') ||
        concat(DATE_PART('minutes',now()::timestamp - a.created_date::timestamp),' Minutes')) as age,a.id,a.query_code as ticket_no,row_number() over() as s_no,
        a.created_date as date,a.query,a.service_call_status,ref.refitems_name as priority, concat(ei.name,' ',ei.last_name) as status_changed_by,concat(eri.name,' ',eri.last_name) as raised_by  from hcms_ce_service_call as a 
left join reference_items ref on ref.id=a.priority_id left join employee_info ei on a.closed_by_id = ei.id left join employee_info eai on a.assigned_to_id =eai.id left join employee_info eri on a.opened_by_id =eri.id
where a.is_active and a.service_call_status=5 and service_call_group={0} order by a.id desc""".format(service_type))
            ticket_view['cls_tik_fetch'] =  dictfetchall(cr)
            ticket_view['status'] = 1
        else:
            ticket_view['status'] = 0
    except Exception as e:
        ticket_view['status'] = e
    return HttpResponse(json.dumps(ticket_view,cls=DjangoJSONEncoder), content_type='application/json')

def hcms_role_access(request):
    ''' 
            13-DEC-2018 || BAV || To load HCMS Role Details View.
            @param request: Request Object
            @type request : Object
            @return:   HttpResponse or Redirect the another URL
    '''
    hcms_role_view={}
    try:
        if request.user.id:
            cr = connection.cursor()
#             cr.execute(""" select id,name from hcms_role where is_active""") 
            cr.execute("select id,concat(name,' ',last_name) as employee_name from employee_info where is_active=True   order by employee_name")
            hcms_role_view['data'] =  dictfetchall(cr)
            hcms_role_view['status'] =1
        else:
            hcms_role_view['status'] =0
    except Exception as e:
        hcms_role_view['status'] = e
    return HttpResponse(json.dumps(hcms_role_view,cls=DjangoJSONEncoder), content_type='application/json')

def access_control_save(request):
    ''' 
            13-DEC-2018 || BAV || To load Access control save View.
            @param request: Request Object
            @type request : Object
            @return:   HttpResponse or Redirect the another URL
    '''
    role_access_save={}
#     try:
    if request.user.id:
        cr = connection.cursor()
        if request.POST.get('role') != 'null' and request.POST.get('group') !='null':
            num_results = HCMS_CE_Access_Setup.objects.filter(service_call_group = json.loads(request.POST.get('role'))).count()
            group_data = json.loads(request.POST.get('group'))
            if num_results ==0:
                for i in group_data:
                    cr.execute(""" insert into hcms_ce_access_setup (created_by_id,created_date,is_active,service_call_group,service_group_employee_id)
                values (%s,now(),%s,%s,%s)""",(request.user.id,True,json.loads(request.POST.get('role')),i))
                role_access_save['status'] =1
            else:
                cr.execute(""" update hcms_ce_access_setup set is_active=False where service_call_group=%s""",(json.loads(request.POST.get('role'))))
                for i in group_data:
                    cr.execute(""" insert into hcms_ce_access_setup (created_by_id,created_date,is_active,service_call_group,service_group_employee_id)
                values (%s,now(),%s,%s,%s)""",(request.user.id,True,json.loads(request.POST.get('role')),i))
                role_access_save['status'] =1
        else:
            role_access_save['status'] =0
    else:
        role_access_save['status'] =0
#     except Exception as e:
#         role_access_save['status'] = e
    return HttpResponse(json.dumps(role_access_save,cls=DjangoJSONEncoder), content_type='application/json')

def sla_config_save(request):
    ''' 
            14-DEC-2018 || BAV || To load SLA Config save View.
            @param request: Request Object
            @type request : Object
            @return:   HttpResponse or Redirect the another URL
    '''
    role_access_save={}
    try:
        if request.user.id:
            cr = connection.cursor()
            if json.loads(request.POST.get('group')) != 'null' and json.loads(request.POST.get('timetap1')) !='null'and json.loads(request.POST.get('timetap2')) !='null' and json.loads(request.POST.get('timetap3')) !='null':
                num_results = HCMS_CE_SLA.objects.filter(service_call_group = json.loads(request.POST.get('group'))).count()
                group_data = json.loads(request.POST.get('group'))
                if num_results ==0:
                    cr.execute(""" insert into hcms_ce_sla (created_by_id,created_date,is_active,service_call_group,timelap1,timelap2,timelap3)
                    values (%s,now(),%s,%s,%s,%s,%s)""",(request.user.id,True,json.loads(request.POST.get('group')),json.loads(request.POST.get('timetap1')),json.loads(request.POST.get('timetap2')),json.loads(request.POST.get('timetap3'))))
                    role_access_save['status'] =1
                else:
                    cr.execute(""" update hcms_ce_sla set is_active=False where service_call_group=%s""",(json.loads(request.POST.get('group'))))
                    cr.execute(""" insert into hcms_ce_sla (created_by_id,created_date,is_active,service_call_group,timelap1,timelap2,timelap3)
                    values (%s,now(),%s,%s,%s,%s,%s)""",(request.user.id,True,json.loads(request.POST.get('group')),json.loads(request.POST.get('timetap1')),json.loads(request.POST.get('timetap2')),json.loads(request.POST.get('timetap3'))))
                    role_access_save['status'] =1
            else:
                role_access_save['status'] =0
        else:
            role_access_save['status'] =0
    except Exception as e:
        role_access_save['status'] = e
    return HttpResponse(json.dumps(role_access_save,cls=DjangoJSONEncoder), content_type='application/json')

def access_control_view(request):
    ''' 
            13-DEC-2018 || BAV || To load Access control View.
            @param request: Request Object
            @type request : Object
            @return:   HttpResponse or Redirect the another URL
    '''
    role_access_view={}
    try:
        if request.user.id:
            cr = connection.cursor()
            if request.POST.get('role') != 'null':
                cr.execute("""select array_agg(service_group_employee_id)as role,array_agg(id),service_call_group from hcms_ce_access_setup where service_call_group =%s
and is_active=True GROUP BY service_call_group """,(request.POST.get('role')))
                role_access_view['data'] = dictfetchall(cr)
                role_access_view['status'] =1
            else:
                role_access_view['status'] =0
        else:
            role_access_view['status'] =0
    except Exception as e:
        role_access_view['status'] = e
    return HttpResponse(json.dumps(role_access_view,cls=DjangoJSONEncoder), content_type='application/json')

def sla_config_view(request):
    ''' 
            13-DEC-2018 || BAV || To load Access control View.
            @param request: Request Object
            @type request : Object
            @return:   HttpResponse or Redirect the another URL
    '''
    sla_conf_view={}
    try:
        if request.user.id:
            cr = connection.cursor()
            if request.POST.get('group') != 'null':
                cr.execute("""select id,service_call_group,timelap1,timelap2,timelap3 from hcms_ce_sla where service_call_group =%s
and is_active=True GROUP BY service_call_group,id """,(request.POST.get('group')))
                sla_conf_view['data'] = dictfetchall(cr)
                sla_conf_view['status'] =1
            else:
                sla_conf_view['status'] =0
        else:
            sla_conf_view['status'] =0
    except Exception as e:
        sla_conf_view['status'] = e
    return HttpResponse(json.dumps(sla_conf_view,cls=DjangoJSONEncoder), content_type='application/json')
    
############################# Service Call (JAN) #######################

def ce_type_based_query(request):
    ''' 
            11-DEC-2018 || JAN || To view default queries based on service type
            @param request: Request Object
            @type request : Object
            @return:  return the success message for retrieval
    '''
    json_data={}
    current_user_id=request.user.id
    service_type=request.GET.get('service_type')
    cur = db_connection()
    json_data['default_query']=[]
    json_data['priority']=[]
    json_data['group_member_list']=[]
    json_data['employee_group_check']=[]
    json_data['rating_check']= []
    try:
        if current_user_id: 
               cur.execute(query.fetch_hcms_query(config.ce_module,config.service_default_query).format(service_type))
               default_query=dictfetchall(cur)
               json_data['default_query']=default_query
               priority = refitem_fetch("SCPRI")
               json_data['priority']=priority
               cur.execute(query.fetch_hcms_query(config.ce_module,config.group_based_employee_fetch).format(service_type))
               group_member_list=dictfetchall(cur)
               json_data['group_member_list']= group_member_list
               cur.execute(query.fetch_hcms_query(config.ce_module,config.employee_group_check_query).format(service_type,current_user_id))
               employee_group_check=dictfetchall(cur)
               json_data['employee_group_check']= employee_group_check
               cur.execute(query.fetch_hcms_query(config.ce_module,config.rating_check_query).format(current_user_id,service_type))
               rating_check=dictfetchall(cur)
               json_data['rating_check']= rating_check
    except Exception as e:
            logger_obj.info(""+ str(e) +" attempted by "+str(request.user.username))    
    cur.close()   
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)
@csrf_exempt
def ce_service_call_submit(request):
    ''' 
            11-DEC-2018 || JAN || To submit service call
            @param request: Request Object
            @type request : Object
            @return:  return the success message for save
    '''
    json_data={}
    current_user_id=request.user.id
    default_query_id=request.POST.get('default_query_id',None)
    ce_service_query=request.POST.get('ce_service_query')
    ce_priority=request.POST.get('ce_priority')
    ce_description=request.POST.get('ce_description')
    ce_priority_text=request.POST.get('priority_text')
    attachment_id=request.POST.get('attachment_id')
    service_type=request.POST.get('service_type')
    cur = db_connection()
#     service_type=''
    ticket_number=''
    query_code=''
    if attachment_id=='0':
        attachment_id=None
    try:
        if current_user_id: 
           cur.execute(query.fetch_hcms_query(config.ce_module,config.employee_id_fetch).format(current_user_id)) 
           employee_id=dictfetchall(cur)
           cur.execute(query.fetch_hcms_query(config.ce_module,config.service_call_insert),(default_query_id,ce_service_query,str(ce_description),ce_priority,1,attachment_id,employee_id[0]['id'],service_type,current_user_id))
           service_call_id=dictfetchall(cur)
           if service_call_id:
                if service_type=='1':
                   service_group='HCM'
                   query_code='HCM00'+str(service_call_id[0]['id'])+'_'+ str(datetime.datetime.today().strftime('%d%b%y'))
                if service_type=='2':
                    service_group='Finance and Accounts'
                    query_code='FA00'+str(service_call_id[0]['id'])+'_'+ str(datetime.datetime.today().strftime('%d%b%y'))
                if service_type=='3':
                    service_group='General Service'
                    query_code='GS00'+str(service_call_id[0]['id'])+'_'+ str(datetime.datetime.today().strftime('%d%b%y'))
                cur.execute(query.fetch_hcms_query(config.ce_module,config.query_code_insert),(query_code,str(service_call_id[0]['id']),))
                json_data[config.status] = status_keys.SUCCESS_STATUS
                to_address=request.user.email
                mail_acknowledgement_body_content=config.mail_hcms_query_raised_acknowledgement.format(employee_id[0]['name'],service_group,query_code,ce_service_query,service_group,'Open',ce_priority_text,ce_description)
                if  attachment_id==None:
                    attach_info=None
                else:
                    cur.execute(query.fetch_hcms_query(config.ce_module,config.service_attachment_fetch).format(attachment_id))
                    attachment=dictfetchall(cur) 
                    attach_info=attachment[0]['path']
#                 communication_asyn_email(config.Transform_hcms,config.module_name,"HCMS-Communication Empowerment - Query Acknowledgment - "+query_code,to_address,mail_acknowledgement_body_content,config.waiting,'Communication Empowerment Group',attach_info)
                cur.execute(query.fetch_hcms_query(config.ce_module,config.service_group_member_mail_fetch),(service_type,))
                group_mail_detail=dictfetchall(cur)
                if group_mail_detail:
                    group_mail=" ,".join(group_mail_detail[0]['group_mail'])
                    mail_group_query_notification=config.mail_hcms_query_notification.format(service_group,employee_id[0]['name'],query_code,ce_service_query,service_group,'Open',ce_priority_text,ce_description)
#                     communication_asyn_email(config.Transform_hcms,config.module_name,"HCMS-Communication Empowerment - Query Notification - "+query_code,group_mail,mail_group_query_notification,config.waiting,employee_id[0]['name'],attach_info)
           else:
                json_data[config.status]=config.FAILURE_STATUS 
    except Exception as e:
            logger_obj.info(""+ str(e) +" attempted by "+str(request.user.username))    
    cur.close()   
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)


def ce_communication_thread_details_display(request):
    ''' 
            13-DEC-2018 || JAN || To retrieve communication_thread_details 
            @param request: Request Object
            @type request : Object
            @return:  return the communication thread details
    '''
    json_data={}
    json_data['service_call']=[]
    json_data['communication_thread']=[]
    json_data['employee']=[]
    current_user_id=request.user.id
    service_call_id=request.GET.get('service_call_id',None)
    
    cur = db_connection()
    if service_call_id:
        cur.execute(query.fetch_hcms_query(config.ce_module,config.employee_id_fetch).format(current_user_id)) 
        employee_id=dictfetchall(cur)
        cur.execute(query.fetch_hcms_query(config.ce_module,config.communication_thread_display).format(service_call_id))
        serice_call=dictfetchall(cur) 
        cur.execute(query.fetch_hcms_query(config.ce_module,config.response_thread_retrieval).format(service_call_id))
        communication_thread=dictfetchall(cur) 
        json_data['service_call']=serice_call
        json_data['communication_thread']=communication_thread
        json_data['employee']=employee_id
    cur.close()   
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)  

@csrf_exempt
def ce_communication_response_submit(request):
    ''' 
            13-DEC-2018 || JAN || To submit communication response
            @param request: Request Object
            @type request : Object
            @return:  return the communication thread details
    '''
    json_data={}
    current_user_id=request.user.id
    service_call_id=request.POST.get('service_call_id')
    response_content=request.POST.get('response_content')
    current_status=request.POST.get('current_status')
    status_changed_to=request.POST.get('status_changed_to')
    assigned_to=request.POST.get('assigned_to')
    opened_by_id=request.POST.get('opened_by_id')
    rating=request.POST.get('rating') 
    cur = db_connection()
    no_status_update=False
    cur.execute(query.fetch_hcms_query(config.ce_module,config.employee_id_fetch).format(current_user_id)) 
    employee_id=dictfetchall(cur)
    if status_changed_to=='' or status_changed_to=='0' or status_changed_to=='7':
        updated_status=current_status
    else:
        updated_status=status_changed_to
    if updated_status=='1':
        stage='Opened'
        status_date_field='modified_date'
        status_updated_by='opened_by_id'
    elif updated_status=='6':
        stage='Re-Opened'
        status_date_field='reopened_date'
        status_updated_by='reopened_by_id'
    elif updated_status=='2':
        status_date_field='answered_date'
        status_updated_by='answered_by_id'
        stage='Answered'
        if str(employee_id[0]['id'])==str(opened_by_id):
            no_status_update=True
    elif updated_status=='3':
        status_date_field='resolved_date'
        status_updated_by='resolved_by_id'
        stage='Resolved'
    elif updated_status=='4':
        status_date_field='verified_date'
        status_updated_by='verified_by_id'
        stage='Verified'
    elif updated_status=='5':
        status_date_field='closed_date'
        status_updated_by='closed_by_id'
        stage='Closed'
    if assigned_to=='':
        assigned_to=None
    if rating=='':
        rating=0
    if no_status_update==True:
        query_formation=''
    else:
        query_formation=","+status_date_field+" = now(),"+status_updated_by+" = "+str(employee_id[0]['id'])
    cur.execute(query.fetch_hcms_query(config.ce_module,config.communication_response_submit),(service_call_id,response_content,employee_id[0]['id'],current_status,updated_status,assigned_to,current_user_id))
    response_id=dictfetchall(cur)
    cur.execute("""update hcms_ce_service_call set service_call_status = %s,assigned_to_id = %s,rating = %s"""+query_formation+""",modified_by_id=%s where id=%s returning service_call_group,query_code""",(updated_status,assigned_to,rating,current_user_id,service_call_id))
    repsonse_update=dictfetchall(cur)
    if response_id:
        cur.execute(query.fetch_hcms_query(config.ce_module,config.employee_detail_fetch).format(opened_by_id)) 
        opened_by=dictfetchall(cur)
        if str(employee_id[0]['id'])==str(opened_by_id):
            cur.execute(query.fetch_hcms_query(config.ce_module,config.service_group_member_mail_fetch),(repsonse_update[0]['service_call_group'],))
            group_mail_detail=dictfetchall(cur)
            group_mail=" ,".join(group_mail_detail[0]['group_mail'])
            mail_group_query_notification=config.mail_hcms_response_notification_group.format(opened_by[0]['name'],stage,response_content)
            communication_asyn_email(config.Transform_hcms,config.module_name,"HCMS-Communication Empowerment - Response Alert - "+repsonse_update[0]['query_code'],group_mail,mail_group_query_notification,config.waiting,opened_by[0]['name'],None)
        else:
            mail_group_query_notification=config.mail_hcms_response_notification_raiser.format(opened_by[0]['name'],stage,response_content)
            communication_asyn_email(config.Transform_hcms,config.module_name,"HCMS-Communication Empowerment - Response Alert - "+repsonse_update[0]['query_code'],opened_by[0]['email'],mail_group_query_notification,config.waiting,'Communication Empowerment Group',None)
        json_data[config.status] = status_keys.SUCCESS_STATUS
    else:
        json_data[config.status]=config.FAILURE_STATUS 
    cur.close()   
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value) 

def def_cat_save(request):
    ''' 
            17-DEC-2018 || ESA || To submit default category
            @param request: Request Object
            @type request : Object
            @return:  return the success message for save
    '''
    json_data={}
    current_user_id=request.user.id
    group_id=request.POST.get('group_id')
    category=request.POST.get('category')
    update_id=request.POST.get('update_id')
    cur = db_connection()
    try:
        if current_user_id and category and group_id and update_id: 
           cur.execute(query.fetch_hcms_query(config.ce_module,config.def_cat_update_check).format(category,update_id))
           exsist_data=dictfetchall(cur)
           if exsist_data:
               json_data[config.status] =1
               json_data['data']=exsist_data
           else:
               cur.execute(query.fetch_hcms_query(config.ce_module,config.def_cat_update),(group_id,category,str(current_user_id),str(update_id)))
               json_data[config.status] = status_keys.UPDATE_STATUS  
           
        elif current_user_id and category and group_id: 
           cur.execute(query.fetch_hcms_query(config.ce_module,config.def_cat_insert_check).format(category))
           exsist_data=dictfetchall(cur)
           if exsist_data:
               json_data[config.status] =1
               json_data['data']=exsist_data
           else:
               cur.execute(query.fetch_hcms_query(config.ce_module,config.def_cat_insert),(group_id,category,current_user_id))
               return_id=dictfetchall(cur)
               if return_id[0]['id']:
                    json_data[config.status] = status_keys.SUCCESS_STATUS
               else:
                    json_data[config.status]=config.FAILURE_STATUS 
    except Exception as e:
            logger_obj.info(""+ str(e) +" attempted by "+str(request.user.username))    
    cur.close()   
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)


def def_cat_delete(request):
    ''' 
            30-AUG-2018 || ESA || To fetch BSC objective form data delete
            @param request: Request Object
            @type request : Object
            @return:  return the success message for save
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    try:
      if current_user_id:
        remove_id=request.POST.get('remove_id')
        if remove_id:
             cur.execute(query.fetch_hcms_query(config.ce_module,config.def_cat_remove),(str(current_user_id),str(remove_id)))
             json_data[config.status]=status_keys.REMOVE_STATUS
        else:
            json_data[config.status]=status_keys.FAILURE_STATUS
        logger_obj.info("default category remove status"+ str(json_data) +" attempted by "+str(request.user.username))  
      else:
            json_data['status']='001'
    except Exception as e:
         result = e
         json_data['status']=[]
         logger_obj.info("default category Details remove exception"+ str(result) +" attempted by "+str(request.user.username))  
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value) 


def def_cat_view(request):
    ''' 
            17-DEC-2018 || ESA || To Fetch default category
            @param request: Request Object
            @type request : Object
            @return:  return the success message for save
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    json_data['def_cat_data']=[]
    try:
        if current_user_id: 
           cur.execute(query.fetch_hcms_query(config.ce_module,config.fetch_def_cat_data))
           return_data=dictfetchall(cur)
           if return_data:
                json_data['def_cat_data'] = return_data
           else:
                json_data['def_cat_data']=[]
    except Exception as e:
            logger_obj.info("default category"+ str(e) +" attempted by "+str(request.user.username))    
    cur.close()   
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def service_call_view(request):
    ''' 
            19-DEC-2018 || ESA || To Fetch service call details
            @param request: Request Object
            @type request : Object
            @return:  return the success message for save
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    json_data['opn_tick_data']=[]
    json_data['ans_tick_data'] =[]
    json_data['resolve_tick_data']=[]
    json_data['verify_tick_data'] = []
    json_data['close_tick_data'] = []
    try:
        if current_user_id: 
           cur.execute(query.fetch_hcms_query(config.ce_module,config.employee_id_fetch).format(current_user_id)) 
           employee_id=dictfetchall(cur)
           if employee_id:
               emp_id=employee_id[0]['id']
               cur.execute(query.fetch_hcms_query(config.ce_module,config.open_service_call_details_fetch).format(emp_id)) 
               opn_tick_data=dictfetchall(cur)
               json_data['opn_tick_data'] = opn_tick_data
               cur.execute(query.fetch_hcms_query(config.ce_module,config.ans_service_call_details_fetch).format(emp_id)) 
               ans_tick_data=dictfetchall(cur)
               json_data['ans_tick_data'] = ans_tick_data
               cur.execute(query.fetch_hcms_query(config.ce_module,config.resolve_service_call_details_fetch).format(emp_id)) 
               resolve_tick_data=dictfetchall(cur)
               json_data['resolve_tick_data'] = resolve_tick_data
               cur.execute(query.fetch_hcms_query(config.ce_module,config.verify_service_call_details_fetch).format(emp_id)) 
               verify_tick_data=dictfetchall(cur)
               json_data['verify_tick_data'] = verify_tick_data
               cur.execute(query.fetch_hcms_query(config.ce_module,config.close_service_call_details_fetch).format(emp_id)) 
               close_tick_data=dictfetchall(cur)
               json_data['close_tick_data'] = close_tick_data
    except Exception as e:
            logger_obj.info("service_call_data"+ str(e) +" attempted by "+str(request.user.username))    
    cur.close()   
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def service_call_count(request):
    ''' 
            17-DEC-2018 || ESA || To Fetch default category
            @param request: Request Object
            @type request : Object
            @return:  return the success message for save
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    json_data['ticket_count']=[]
    try:
        if current_user_id: 
           cur.execute(query.fetch_hcms_query(config.ce_module,config.employee_id_fetch).format(current_user_id)) 
           employee_id=dictfetchall(cur)
           emp_id=employee_id[0]['id']
           cur.execute(query.fetch_hcms_query(config.ce_module,config.ticket_count).format(emp_id)) 
           return_data=dictfetchall(cur)
           b=(1,2,3,4)
           if return_data:
                json_data['ticket_count'] = return_data
                json_data['count']=b
           else:
                json_data['ticket_count']=[]
                json_data['count']=''
    except Exception as e:
            logger_obj.info("ticket_count"+ str(e) +" attempted by "+str(request.user.username))    
    cur.close()   
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)
  
def sla_plan():
     t=threading.Timer(60, sla_plan).start()
     cur = db_connection()
#      cur.execute("""select timelap1,timelap2,timelap3,service_call.id as service_call_id,service_call_status,sla_timelap,service_call.service_call_group, to_char(current_timestamp - service_call.created_date,'HH:mm') as over_due 
# from hcms_ce_service_call as service_call
# inner join hcms_ce_sla as ce_sla on ce_sla.service_call_group=service_call.service_call_group
# where service_call.is_active='True' and ce_sla.is_active='True' and service_call_status!=5 """)
     cur.execute("""select reference_items.refitems_name as priority,service_call.priority_id, employee_info.name, service_call.opened_by_id,service_call.query,service_call.description,to_char(service_call.opened_date,'dd-mm-yyyy') as opened_date,service_call.query_code,timelap1,timelap2,timelap3,
service_call.id as service_call_id,service_call.service_call_status,sla_timelap,
service_call.service_call_group, to_char(current_timestamp - service_call.created_date,'HH:mm') as over_due ,
case when service_call.service_call_group=1 then 'HCM' 
            when service_call.service_call_group=2 then 'PMO' 
            when service_call.service_call_group=3 then 'General Service' else 'no' END as service_group,
case when service_call.service_call_status=1 then 'Open' 
            when service_call.service_call_status=2 then 'Answered' 
            when service_call.service_call_status=3 then 'Resolved' 
            when service_call.service_call_status=4 then 'Verified'
            when service_call.service_call_status=5 then 'Closed'
            else 'no' END as service_status   
from hcms_ce_service_call as service_call
inner join hcms_ce_sla as ce_sla on ce_sla.service_call_group=service_call.service_call_group
inner join employee_info on employee_info.id=service_call.opened_by_id
inner join reference_items on reference_items.id=service_call.priority_id
where service_call.is_active='True' and ce_sla.is_active='True' and service_call_status!=5
""")
     service_data=dictfetchall(cur)
     if service_data:
        for i in service_data:
            service_group=i['service_call_group']
            service_call_id=i['service_call_id']
            service_call_status=i['service_call_status']
            time_diff=i['over_due']
            sla_timelap=i['sla_timelap']
            timelap1=i['timelap1']
            timelap2=i['timelap2']
            timelap3=i['timelap3']
            if time_diff >=str(timelap1)  and sla_timelap==None and service_call_status!=2:
                  cur.execute(query.fetch_hcms_query(config.ce_module,config.service_overdue_log_insert),(service_call_id,service_call_status,1,timelap1,))
                  return_service_call_id=dictfetchall(cur)
                  cur.execute(query.fetch_hcms_query(config.ce_module,config.update_service_timelap),(1,service_call_id,))
            if time_diff >=str(timelap2)  and sla_timelap==1 and service_call_status!=3:
                  cur.execute(query.fetch_hcms_query(config.ce_module,config.service_overdue_log_insert),(service_call_id,service_call_status,2,timelap1,))
                  return_service_call_id=dictfetchall(cur)
                  cur.execute(query.fetch_hcms_query(config.ce_module,config.update_service_timelap),(2,service_call_id,))
            if time_diff >=str(timelap3)  and sla_timelap==2:
                  cur.execute(query.fetch_hcms_query(config.ce_module,config.service_overdue_log_insert),(service_call_id,service_call_status,2,timelap1,))
                  return_service_call_id=dictfetchall(cur)
                  cur.execute(query.fetch_hcms_query(config.ce_module,config.update_service_timelap),(3,service_call_id,))
            cur.execute(query.fetch_hcms_query(config.ce_module,config.service_group_member_mail_fetch),(service_group,))
            group_mail_detail=dictfetchall(cur)
            if group_mail_detail[0]['group_mail'] is not None:
                group_mail=" ,".join(group_mail_detail[0]['group_mail'])
                mail_group_query_notification=config.mail_hcms_query_overdue_notification.format(i['service_group'],i['query'],i['query_code'],i['query_code'],i['query'],i['opened_date'],i['service_group'],i['service_status'],i['priority'],i['description'])



def doc_viewer(request):
    ''' 
            09-MAY-2019 || ESA || To load HCMS Role Details View.
            @param request: Request Object
            @type request : Object
            @return:   HttpResponse or Redirect the another URL
    '''
    hcms_role_view={}
    cur = db_connection()
    doc_id=request.GET.get('id')
    if request.user.id and doc_id:
           cur.execute("""select attach_info.name,attach_info.path,attach_info.format from attachment_info as attach_info 
           where attach_info.is_active and attach_info.id="""+str(doc_id))
           file_data=dictfetchall(cur)
           if file_data:
              file = open(file_data[0]['path'], 'rb')
              response = HttpResponse(FileWrapper(file), content_type=file_data[0]['format'])
              response['Content-Disposition'] = 'attachment; filename="{}"'.format(file_data[0]['name'])
              return response
           
