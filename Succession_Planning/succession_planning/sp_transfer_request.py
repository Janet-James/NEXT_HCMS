# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.shortcuts import render

import json
from django.views.decorators.csrf import csrf_exempt
from django.http.response import HttpResponse
from CommonLib import query
from django.db import connection
from CommonLib import query as q
import config
#template render html
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from CommonLib.hcms_common import refitem_fetch,refitemlink_fetch
from CommonLib.hcms_common import record_validation
from CommonLib.hcms_common import menu_access_control
from Succession_Planning.succession_planning.models import SP_Transfer
from django_countries import countries
import logging
import logging.handlers
import datetime
from random import randint
logger_obj = logging.getLogger('logit')
  
# Transfer CRUD Operations here
@csrf_exempt
def TransferRequestCRUDOperations(request): 
    ''' 
    10-September-2018 SYA Transfer Request CRUD Operations
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: SYA
    '''
    try:
        logger_obj.info('Transfer Request CRUD Operations by'+str(request.user.username))
        json_data = {}
        data = request.POST.get(config.datas)   
        uid=request.user.id     
        if not uid:
            uid = 1
        request_id = request.POST.get(config.table_id)
        revoke_status_id = request.POST.get(config.revoke_status_id)
        if data:
                data = json.loads(data)                 
                if not request_id and not revoke_status_id: 
                            status_exists = SP_Transfer.objects.filter(emp_id=data[0]['transfer_employee'],transfer_status=False).count()
                            if status_exists > 0:
                                json_data[config.status_key] = config.record_already_referred
                            else:     
                                status = SP_Transfer(emp_id=data[0]['transfer_employee'],reason_id=data[0]['reason_for_transfer'],category_id=data[0]['transfer_category'],
                                                     req_date=data[0]['expected_transfer_date'],type_id=data[0]['transfer_type'],emp_notes=data[0]['transfer_request_notes'],
                                                     org_id=data[0]['transfer_org'],org_unit_id=data[0]['transfer_org_unit'],org_unit_div_id=data[0]['transfer_org_division'],other_reason=data[0]['transfer_others_notes'],is_active="True")
                                status.save()
                                json_data[config.status_id] = status.id
                                json_data[config.status_key] = config.success_status
                else:
                            status = SP_Transfer.objects.filter(id=request_id).update(emp_id=data[0]['transfer_employee'],reason_id=data[0]['reason_for_transfer'],category_id=data[0]['transfer_category'],
                                                                                      req_date=data[0]['expected_transfer_date'],type_id=data[0]['transfer_type'],emp_notes=data[0]['transfer_request_notes'],
                                                                                      org_id=data[0]['transfer_org'],org_unit_id=data[0]['transfer_org_unit'],org_unit_div_id=data[0]['transfer_org_division'],other_reason=data[0]['transfer_others_notes'],is_active="True")
                            json_data[config.status_id] = request_id
                            json_data[config.status_key] = config.update_status   
        if revoke_status_id:
                            status = SP_Transfer.objects.filter(id=revoke_status_id).update(is_active="False")
                            json_data[config.status_id] = config.revoke_status
                            json_data[config.status_key] = config.revoke_status  
        logger_obj.info('Transfer Requests'+str(json_data)+"attempted by"+str(request.user.username))         
    except Exception as e:
            logger_obj.error(e)
            json_data[config.status_key] = e
    return HttpResponse(json.dumps(json_data))

#Recruitment data table function here
@csrf_exempt
def TransferRequestDataTable(request):
    ''' 
    11-September-2018 SYA To Transfer Request datatable function
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: SYA
    '''
    json_data ={}
    try:
        filter_name = request.POST.get('filter_name');
        cur = connection.cursor()
        logger_obj.info('Transfer Request datatable function by'+str(request.user.username))   
        log_query = """select coalesce(to_char(created_date,'dd-mm-yyyy hh:mm:ss'),'') as created_date,
                    coalesce(to_char(modified_date,'dd-mm-yyyy hh:mm:ss'),'') as modified_date,
                    (case when (is_active is true ) then 'Active' else 'In Active' end) as status,
                    coalesce((select username from auth_user where id = created_by_id),'') as createdby_username,
                    coalesce(to_char(created_date::timestamptz - interval '330' minute,'dd-mm-yyyy hh12:mi:ss'),'') as created_datatime,
                    coalesce((select username from auth_user where id = modified_by_id),'') as modify_username,
                    coalesce((select name||' '||last_name as title from employee_info  where id=emp_id),'') as title from sp_transfer_details order by created_datatime desc
          """
        cur.execute(log_query)   
        log_details = q.dictfetchall(cur)  
        json_data['log_details'] = log_details     
        if filter_name is None:
            cur.execute(q.fetch_hcms_query(config.succession_planning, config.sp_transfer_request_data_table))
        else:
            query = q.fetch_hcms_query(config.succession_planning, config.sp_transfer_request_data_table)
            cur.execute(query+" where a.emp_name ilike '%"+str(filter_name)+"%'")            
        res = cur.fetchall()  
        json_data[config.results] = res
    except Exception as e:
        logger_obj.error(e)
        json_data[config.results] = []
    return HttpResponse(json.dumps(json_data))

#Transfer Request data table click function
@csrf_exempt
def TransferRequestCRUDTableClick(request):
    ''' 
    11-JULY-2018 SYA To Transfer datatable click Operation
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: SYA
    '''
    json_data ={}
    try:
        logger_obj.info('Recruitment datatable click function by'+str(request.user.username))
        post = request.POST            
        table_id = request.POST.get(config.table_id)
        cur = connection.cursor()
        query = q.fetch_hcms_query(config.succession_planning, config.sp_transfer_request_table_click)
        cur.execute(query,(table_id,))
        res = q.dictfetchall(cur) 
        json_data[config.results] = res
    except Exception as e:
        logger_obj.error(e)
        json_data[config.results] = []
    return HttpResponse(json.dumps(json_data))

# Transfer Request Division link 
@csrf_exempt 
def divisionDropdownFunction(request):
         ''' 
         11-September-2018 SYA To division drop down function
         @param request: Request Object
         @type request : Object
         @return:   HttpResponse Employee Search Data
         @author: SYA
         '''
         try:
            logger_obj.info('division drop down function by'+str(request.user.username))
            json_data = {}
            post = request.POST
            org_unit_id = request.POST.get(config.org_unit_id)
            if org_unit_id:
                  cur = connection.cursor()
                  query=q.fetch_hcms_query(config.succession_planning, config.sp_fetch_division_drop_down)
                  cur.execute(query,(org_unit_id,))
                  res_emp = q.dictfetchall(cur)           
                  json_data['division_info'] = res_emp
            logger_obj.info('Employee fetching role details by'+str(json_data)+"attempted by"+str(request.user.username))                
         except Exception as e:      
            logger_obj.error(e)
            json_data[config.status_key] = e
         return HttpResponse(json.dumps(json_data))     

#none values assign
def noneValuesAssign(dataValues):
    try:
        if dataValues in '':
            dataValues = None
        else:
            return dataValues
    except Exception as e:      
        print e