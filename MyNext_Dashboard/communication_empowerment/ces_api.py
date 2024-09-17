# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.views.decorators.csrf import csrf_exempt
import HCMS.settings as settings
import requests
import logging
import logging.handlers
from django.shortcuts import render
import json
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.http.response import HttpResponse
from django.core import serializers
from django.core.serializers.json import DjangoJSONEncoder
from django.views.decorators.csrf import csrf_exempt
import HCMS.settings as status_keys
""" Custom Modules import """
from CommonLib.asyn_mail import asyn_email,communication_asyn_email
import config
from CommonLib import query
from django.db import connection
from CommonLib.lib import *
from CommonLib.hcms_common import refitem_fetch
logger_obj = logging.getLogger('logit')
"""import for rest framework"""
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.renderers import JSONRenderer
 
def active_user(func):
    json_data={}
    def check(*args,**kwargs):
        cur = connection.cursor() 
        cur.execute(query.fetch_hcms_query(config.ce_module,config.api_employee_check).format(kwargs['user_id']))
        active_employee=dictfetchall(cur)
        if active_employee:
            returned_value = func(*args, **kwargs)
            return returned_value
        else:
            response = Response(
            {"data": "This user is not authorized", "status":'NTE_02', "msg":'fail'  },
            content_type="application/json",
            )
            response.accepted_renderer = JSONRenderer()
            response.accepted_media_type = "application/json"
            response.renderer_context = {}
            return response
    return check

@active_user
@csrf_exempt
@api_view(['GET'])
def service_call_details(request,user_id):
    ''' 
21-FEB-2018 || ESA || To return service call details  @param request: Request Object   @type request : Object  @return:HttpResponse and return data '''
    service_group= request.query_params.get('group', None)
    assign= request.query_params.get('type', None)
    cur = connection.cursor() 
    return_data={}
    json_data={}
    try:
      if user_id !='' and user_id != 'null' and user_id !='0' and service_group and assign=='by_me':
            cur.execute(query.fetch_hcms_query(config.ce_module,config.api_open_service_call_details_fetch).format(service_group,user_id)) 
            opn_tick_data=dictfetchall(cur)
            return_data['opn_tick_data'] = opn_tick_data
            return_data['open_ticket_count'] = len(opn_tick_data)
            cur.execute(query.fetch_hcms_query(config.ce_module,config.api_ans_service_call_details_fetch).format(service_group,user_id)) 
            ans_tick_data=dictfetchall(cur)
            return_data['ans_tick_data'] = ans_tick_data
            return_data['answer_ticket_count'] = len(ans_tick_data)
            cur.execute(query.fetch_hcms_query(config.ce_module,config.api_resolve_service_call_details_fetch).format(service_group,user_id)) 
            resolve_tick_data=dictfetchall(cur)
            return_data['resolve_tick_data'] = resolve_tick_data
            return_data['resolve_ticket_count'] = len(resolve_tick_data)
            cur.execute(query.fetch_hcms_query(config.ce_module,config.api_verify_service_call_details_fetch).format(service_group,user_id)) 
            verify_tick_data=dictfetchall(cur)
            return_data['verify_tick_data'] = verify_tick_data
            return_data['verify_ticket_count'] = len(verify_tick_data)
            cur.execute(query.fetch_hcms_query(config.ce_module,config.api_close_service_call_details_fetch).format(service_group,user_id)) 
            close_tick_data=dictfetchall(cur)
            return_data['close_tick_data'] = close_tick_data
            return_data['close_ticket_count'] = len(close_tick_data)
            json_data['data']=return_data
            json_data['status']='NTE_01'
            json_data['msg']='success'
      elif user_id !='' and user_id != 'null' and user_id !='0' and service_group and assign=='to_me':
           cur.execute(query.fetch_hcms_query(config.ce_module,config.api_group_check_query).format(user_id))
           employee_group=dictfetchall(cur)
           if employee_group:
               for i in employee_group:
                   if str(i['service_call_group'])==str(service_group):
                        cur.execute(query.fetch_hcms_query(config.ce_module,config.group_api_open_service_call_details_fetch).format(service_group,user_id)) 
                        opn_tick_data=dictfetchall(cur)
                        return_data['opn_tick_data'] = opn_tick_data
                        return_data['open_ticket_count'] = len(opn_tick_data)
                        cur.execute(query.fetch_hcms_query(config.ce_module,config.group_api_ans_service_call_details_fetch).format(service_group,user_id)) 
                        ans_tick_data=dictfetchall(cur)
                        return_data['ans_tick_data'] = ans_tick_data
                        return_data['answer_ticket_count'] = len(ans_tick_data)
                        cur.execute(query.fetch_hcms_query(config.ce_module,config.group_api_resolve_service_call_details_fetch).format(service_group,user_id)) 
                        resolve_tick_data=dictfetchall(cur)
                        return_data['resolve_tick_data'] = resolve_tick_data
                        return_data['resolve_ticket_count'] = len(resolve_tick_data)
                        cur.execute(query.fetch_hcms_query(config.ce_module,config.group_api_verify_service_call_details_fetch).format(service_group,user_id)) 
                        verify_tick_data=dictfetchall(cur)
                        return_data['verify_tick_data'] = verify_tick_data
                        return_data['verify_ticket_count'] = len(verify_tick_data)
                        cur.execute(query.fetch_hcms_query(config.ce_module,config.group_api_close_service_call_details_fetch).format(service_group,user_id)) 
                        close_tick_data=dictfetchall(cur)
                        return_data['close_tick_data'] = close_tick_data
                        return_data['close_ticket_count'] = len(close_tick_data)
           json_data['data']=return_data
           json_data['status']='NTE_01'
           json_data['msg']='success'
                       
      else:
           error=exception_handling(422,'required input field is missing.','@param : user_id or type')
           json_data['data']=error
           json_data['status']='NTE_02'
           json_data['msg']='fail'
    except Exception as e:
        print 'tesssssssssssss',e
        error=exception_handling(500,type(e).__name__,str(e))
        json_data['data']=error
        json_data['status']='NTE_02'
        json_data['msg']='fail'
    return Response(json_data,status=status.HTTP_200_OK)

@active_user
@csrf_exempt
@api_view(['GET'])
def ce_communication_thread_details(request,user_id):
    service_call_id= request.query_params.get('service_call_id', None)
    employee_id=user_id
    return_data={}
    json_data={}
    try:
        if employee_id!='' and employee_id !='null' and  service_call_id != None:
                cur = connection.cursor() 
                cur.execute(query.fetch_hcms_query(config.ce_module,config.api_thred_employee_fetch).format(employee_id)) 
                employee_info=dictfetchall(cur)
                cur.execute(query.fetch_hcms_query(config.ce_module,config.communication_thread_display).format(service_call_id))
                serice_call=dictfetchall(cur) 
                cur.execute(query.fetch_hcms_query(config.ce_module,config.response_thread_retrieval).format(service_call_id))
                communication_thread=dictfetchall(cur) 
                return_data['service_call']=serice_call
                return_data['communication_thread']=communication_thread
                return_data['employee']=employee_info
                json_data['data']=return_data
                json_data['status']='NTE_01'
                json_data['msg']='success'
        else:
           error=exception_handling(422,'required input field is missing.','@param : service_call_id')
           json_data['data']=error
           json_data['status']='NTE_02'
           json_data['msg']='fail'
    except Exception as e:
        error=exception_handling(500,type(e).__name__,str(e))
        json_data['data']=error
        json_data['status']='NTE_02'
        json_data['msg']='fail'
    return Response(json_data,status=status.HTTP_200_OK)

@active_user
@csrf_exempt
@api_view(['GET'])
def service_base_details(request,service_type,user_id):
    return_data={}
    json_data={}
    try:
        if service_type!='' and user_id !='' and  service_type != None and user_id != None:
              cur = connection.cursor()
              cur.execute(query.fetch_hcms_query(config.ce_module,config.api_fetch_auth_user).format(user_id))
              auth_user_details=dictfetchall(cur)
              if auth_user_details:
                 auth_user_id=auth_user_details[0]['id']
              else :
                  auth_user_id=0
              cur.execute(query.fetch_hcms_query(config.ce_module,config.service_default_query).format(service_type))
              default_query=dictfetchall(cur)
              return_data['default_query']=default_query
              priority = refitem_fetch("SCPRI")
              return_data['priority']=priority
              cur.execute(query.fetch_hcms_query(config.ce_module,config.group_based_employee_fetch).format(service_type))
              group_member_list=dictfetchall(cur)
              return_data['group_member_list']= group_member_list
              cur.execute(query.fetch_hcms_query(config.ce_module,config.employee_group_check_query).format(service_type,auth_user_id))
              employee_group_check=dictfetchall(cur)
              return_data['employee_group_check']= employee_group_check
              json_data['data']=return_data
              json_data['status']='NTE_01'
              json_data['msg']='success'
        else:
               error=exception_handling(422,'required input field is missing.','@param : service_type or user_id')
               json_data['data']=error
               json_data['status']='NTE_02'
               json_data['msg']='fail'
    except Exception as e:
        error=exception_handling(500,type(e).__name__,str(e))
        json_data['data']=error
        json_data['status']='NTE_02'
        json_data['msg']='fail'
    return Response(json_data,status=status.HTTP_200_OK)

@csrf_exempt
@api_view(['POST'])
def ce_call_submit(request):
    ''' 
    22-FEB-2018 || ESA || To insert service call details  @param request: Request Object   @type request : Object  @return:HttpResponse and return data 
    '''
    post = request.data
    cur = db_connection()
    return_data={}
    json_data={}
    ticket_number=''
    data = post.get("service_data")  
    try:
        if data:
           user_id= data['user_id']
           default_query_id=data["default_query_id"]
           ce_service_query=data["ce_service_query"]
           ce_priority=data["ce_priority"]
           ce_priority_text=data["priority_text"]
           ce_description=data["ce_description"]
           attachment_id=data["attachment_id"]
           service_type=data["service_type"]
           if attachment_id==0:
                 attachment_id=None
           if user_id:
              cur.execute(query.fetch_hcms_query(config.ce_module,config.api_fetch_auth_user).format(user_id))
              active_auth_user=dictfetchall(cur)
              if active_auth_user :
                cur.execute(query.fetch_hcms_query(config.ce_module,config.service_call_insert),(default_query_id,ce_service_query,str(ce_description),ce_priority,1,attachment_id,user_id,service_type,active_auth_user[0]['id']))
                service_call_id=dictfetchall(cur)
                if service_call_id:
                     if service_type==1:
                        service_group='HCM'
                        query_code='HCM00'+str(service_call_id[0]['id'])+'_'+ str(datetime.datetime.today().strftime('%d%b%y'))
                     if service_type==2:
                        service_group='Finance and Accounts'
                        query_code='FA00'+str(service_call_id[0]['id'])+'_'+ str(datetime.datetime.today().strftime('%d%b%y'))
                     if service_type==3:
                        service_group='General Service'
                        query_code='GS00'+str(service_call_id[0]['id'])+'_'+ str(datetime.datetime.today().strftime('%d%b%y'))
                     cur.execute(query.fetch_hcms_query(config.ce_module,config.query_code_insert),(query_code,str(service_call_id[0]['id']),))
                     json_data['status']='NTE_01'
                     json_data['msg']='success'
                     to_address=active_auth_user[0]['email']
                     mail_acknowledgement_body_content=config.mail_hcms_query_raised_acknowledgement.format(active_auth_user[0]['employee_name'],service_group,query_code,ce_service_query,service_group,'Open',ce_priority_text,ce_description)  
                     if attachment_id==None:
                        attach_info=None
                     else:
                        cur.execute(query.fetch_hcms_query(config.ce_module,config.service_attachment_fetch).format(attachment_id))
                        attachment=dictfetchall(cur) 
                        attach_info=attachment[0]['path']
                     communication_asyn_email(config.Transform_hcms,config.module_name,"HCMS-Communication Empowerment - Query Acknowledgment - "+query_code,to_address,mail_acknowledgement_body_content,config.waiting,'Communication Empowerment Group',attach_info)
                     cur.execute(query.fetch_hcms_query(config.ce_module,config.service_group_member_mail_fetch),(service_type,))
                     group_mail_detail=dictfetchall(cur)
                     if group_mail_detail:
                       group_mail=" ,".join(group_mail_detail[0]['group_mail'])
                       mail_group_query_notification=config.mail_hcms_query_notification.format(service_group,active_auth_user[0]['employee_name'],query_code,ce_service_query,service_group,'Open',ce_priority_text,ce_description)
                       communication_asyn_email(config.Transform_hcms,config.module_name,"HCMS-Communication Empowerment - Query Notification - "+query_code,group_mail,mail_group_query_notification,config.waiting,active_auth_user[0]['employee_name'],attach_info)
                else:
                    json_data['status']='NTE_02'
                    json_data['msg']='fail'
              else:
                 error=exception_handling(422,'Invalid value.','@param : employee ID')
                 json_data['data']=error
                 json_data['status']='NTE_02'
                 json_data['msg']='fail'
           else:
             error=exception_handling(422,'required input field is missing.','@param : user id')
             json_data['data']=error
             json_data['status']='NTE_02'
             json_data['msg']='fail'
        else:
             error=exception_handling(422,'required input field is missing.','@param : empty vale')
             json_data['data']=error
             json_data['status']='NTE_02'
             json_data['msg']='fail'
    except Exception as e:
        error=exception_handling(500,type(e).__name__,str(e))
        json_data['data']=error
        json_data['status']='NTE_02'
        json_data['msg']='fail'
    return Response(json_data,status=status.HTTP_200_OK)
    
@csrf_exempt
@api_view(['GET'])
def search(request,user_id):
    search_string= request.query_params.get('search_query', None)
    return_data={}
    json_data={}
    try:
        if user_id and search_string!='' and search_string!=None:
          cur = db_connection()
          cur.execute(query.fetch_hcms_query(config.ce_module,config.api_fetch_auth_user).format(user_id))
          active_auth_user=dictfetchall(cur)
          if active_auth_user:
             cur.execute(query.fetch_hcms_query(config.ce_module,config.api_service_search).format(search_string,active_auth_user[0]['id']))
             search_result=dictfetchall(cur) 
             return_data['search_result']=search_result
             json_data['data']=return_data
             json_data['status']='NTE_01'
             json_data['msg']='success'
          else:
             error=exception_handling(422,'Invalid value.','@param : employee ID')
             json_data['data']=error
             json_data['status']='NTE_02'
             json_data['msg']='fail'
        else:
            error=exception_handling(422,'required input field is missing.','@param : user id or search string')
            json_data['data']=error
            json_data['status']='NTE_02'
            json_data['msg']='fail'
    except Exception as e:
        error=exception_handling(500,type(e).__name__,str(e))
        json_data['data']=error
        json_data['status']='NTE_02'
        json_data['msg']='fail'
    return Response(json_data,status=status.HTTP_200_OK)
    
@csrf_exempt
@api_view(['POST'])
def communication_response_submit(request):
    ''' 
    22-FEB-2018 || ESA || To insert communication response details  @param request: Request Object   @type request : Object  @return:HttpResponse and return data 
    '''
    post = request.data
    cur = db_connection()
    return_data={}
    json_data={}
    ticket_number=''
    data = post.get("communication_response")  
    try:
        if data:
           user_id= data['user_id']
           service_call_id=data["service_call_id"]
           response_content=data["response_content"]
           current_status=data["current_status"]
           status_changed_to=data["status_changed_to"]
           opened_by_id=data["opened_by_id"]
           assigned_to=data["assigned_to"]
           rating=data["rating"]
           cur = db_connection()
           no_status_update=False
           if user_id:
            cur.execute(query.fetch_hcms_query(config.ce_module,config.api_fetch_auth_user).format(user_id))
            active_auth_user=dictfetchall(cur)
            if active_auth_user :
                if status_changed_to==" " or status_changed_to=='0' or status_changed_to=='7':
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
                    if str(user_id)==str(opened_by_id):
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
                if assigned_to==" ":
                    assigned_to=None
                if rating==" ":
                    rating=0
                if no_status_update==True:
                    query_formation=''
                else:
                    query_formation=","+status_date_field+" = now(),"+status_updated_by+" = "+str(user_id)
                cur.execute(query.fetch_hcms_query(config.ce_module,config.communication_response_submit),(service_call_id,response_content,user_id,current_status,updated_status,assigned_to,active_auth_user[0]['id']))
                response_id=dictfetchall(cur) 
                cur.execute("""update hcms_ce_service_call set service_call_status = %s,assigned_to_id = %s,rating = %s"""+query_formation+""",modified_by_id=%s where id=%s returning service_call_group,query_code""",(updated_status,assigned_to,rating,active_auth_user[0]['id'],service_call_id))
                repsonse_update=dictfetchall(cur)
                if response_id:
                    cur.execute(query.fetch_hcms_query(config.ce_module,config.employee_detail_fetch).format(opened_by_id)) 
                    opened_by=dictfetchall(cur)
                    if str(user_id)==str(opened_by_id):
                        cur.execute(query.fetch_hcms_query(config.ce_module,config.service_group_member_mail_fetch),(repsonse_update[0]['service_call_group'],))
                        group_mail_detail=dictfetchall(cur)
                        group_mail=" ,".join(group_mail_detail[0]['group_mail'])
                        mail_group_query_notification=config.mail_hcms_response_notification_group.format(opened_by[0]['name'],stage,response_content)
                    else:
                       mail_group_query_notification=config.mail_hcms_response_notification_raiser.format(opened_by[0]['name'],stage,response_content)
                    json_data['status']='NTE_01'
                    json_data['msg']='success'
            else:
              error=exception_handling(422,'Invalid value.','@param : employee ID')
              json_data['data']=error
              json_data['status']='NTE_02'
              json_data['msg']='fail'
           else:
             error=exception_handling(422,'required input field is missing.','@param : user id')
             json_data['data']=error
             json_data['status']='NTE_02'
             json_data['msg']='fail'
        else:
             error=exception_handling(422,'required input field is missing.','@param : empty vale')
             json_data['data']=error
             json_data['status']='NTE_02'
             json_data['msg']='fail'
    except Exception as e:
        error=exception_handling(500,type(e).__name__,str(e))
        json_data['data']=error
        json_data['status']='NTE_02'
        json_data['msg']='fail'
    return Response(json_data,status=status.HTTP_200_OK)   

@csrf_exempt
@api_view(['GET'])
def service_group_details(request,user_id):
    ''' 
21-FEB-2018 || ESA || To return service group call details  @param request: Request Object   @type request : Object  @return:HttpResponse and return data '''
    return_data={}
    json_data={}
    json_data['hcm']=[]
    json_data['pmo']=[]
    json_data['gs']=[]
    try:
      if user_id !='' and user_id != 'null' and user_id !='0':
        cur = connection.cursor() 
        cur.execute(query.fetch_hcms_query(config.ce_module,config.api_employee_check).format(user_id))
        active_employee=dictfetchall(cur)
        if active_employee :
           cur.execute(query.fetch_hcms_query(config.ce_module,config.api_group_check_query).format(user_id))
           employee_group=dictfetchall(cur)
           if employee_group:
               for i in employee_group:
                   if i['service_call_group']==1:
                       cur.execute(query.fetch_hcms_query(config.ce_module,config.api_hcm_group_query).format(i['service_call_group']))
                       hcm_group=dictfetchall(cur)
                       json_data['hcm']=hcm_group
                   if i['service_call_group']==2:
                       cur.execute(query.fetch_hcms_query(config.ce_module,config.api_hcm_group_query).format(i['service_call_group']))
                       pmo_group=dictfetchall(cur)
                       json_data['pmo']=pmo_group
                   if i['service_call_group']==3:
                       cur.execute(query.fetch_hcms_query(config.ce_module,config.api_hcm_group_query).format(i['service_call_group']))
                       gs_group=dictfetchall(cur)
                       json_data['gs']=gs_group
                       
           json_data['status']='NTE_01'
           json_data['msg']='success'
        else:
            error=exception_handling(422,'Invalid value.','@param : employee ID')
            json_data['data']=error
            json_data['status']='NTE_02'
            json_data['msg']='fail'
      else:
           error=exception_handling(422,'required input field is missing.','@param : user_id')
           json_data['data']=error
           json_data['status']='NTE_02'
           json_data['msg']='fail'
    except Exception as e:
        error=exception_handling(500,type(e).__name__,str(e))
        json_data['data']=error
        json_data['status']='NTE_02'
        json_data['msg']='fail'
    return Response(json_data,status=status.HTTP_200_OK)


def exception_handling(code,msg,info):
    ''' 
21-FEB-2018 || ESA || Exception handling  @param request: Request Object  @type request : Object  @return: return the data as object'''
    error={}
    error['status']=code
    error['error_type']=msg
    error['error']=info
    return error
