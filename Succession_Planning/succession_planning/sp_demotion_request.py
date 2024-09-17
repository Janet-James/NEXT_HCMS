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
from Succession_Planning.succession_planning.models import SP_Demotion
from django_countries import countries
import logging
import logging.handlers
import datetime
from random import randint
logger_obj = logging.getLogger('logit')
  
# Transfer CRUD Operations here
@csrf_exempt
def DemotionRequestCRUDOperations(request): 
    ''' 
    11-September-2018 SYA demotion Request CRUD Operations
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
        if data:
                data = json.loads(data)     
                if not request_id: 
                            status_exists = SP_Demotion.objects.filter(emp_id=data[0]['demotion_employee'],demotion_status=False).count()
                            if status_exists > 0:
                                json_data[config.status_key] = config.record_already_referred
                            else:                                  
                                status = SP_Demotion(emp_id=data[0]['demotion_employee'],request_emp_id=data[0]['requested_by'],    
                                                 request_date=data[0]['request_date'],effective_date=data[0]['effective_date'],org_id=data[0]['demotion_org'],org_unit_id=data[0]['demotion_org_unit'],
                                                 org_unit_div_id=data[0]['demotion_division'],role_id=data[0]['demotion_role'],reason_id=data[0]['demotion_reason'],
                                                 emp_notes=data[0]['actions_to_taken'],created_by_id=int(uid),is_active="True")
                                status.save()
                                json_data[config.status_id] = status.id
                                json_data[config.status_key] = config.success_status
                else:                        
                            status = SP_Demotion.objects.filter(id=request_id).update(emp_id=data[0]['demotion_employee'],request_emp_id=data[0]['requested_by'],    
                                                 request_date=data[0]['request_date'],effective_date=data[0]['effective_date'],org_id=data[0]['demotion_org'],
                                                 org_unit_id=data[0]['demotion_org_unit'],org_unit_div_id=data[0]['demotion_division'],role_id=data[0]['demotion_role'],reason_id=data[0]['demotion_reason'],
                                                 emp_notes=data[0]['actions_to_taken'],created_by_id=int(uid),is_active="True")
                            json_data[config.status_id] = request_id
                            json_data[config.status_key] = config.update_status                                                           
                logger_obj.info('demotion Requests'+str(json_data)+"attempted by"+str(request.user.username))         
    except Exception as e:
            logger_obj.error(e)
            json_data[config.status_key] = e
    return HttpResponse(json.dumps(json_data))

#Recruitment data table function here
@csrf_exempt
def DemotionRequestDataTable(request):
    ''' 
    11-September-2018 SYA To demotion Request datatable function
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: SYA
    '''
    json_data ={}
    try:
        filter_name = request.POST.get('filter_name');
        cur = connection.cursor()
        logger_obj.info('Demotion Request datatable function by'+str(request.user.username))   
        log_query = """select coalesce(to_char(created_date,'dd-mm-yyyy hh:mm:ss'),'') as created_date,
                    coalesce(to_char(modified_date,'dd-mm-yyyy hh:mm:ss'),'') as modified_date,
                    (case when (is_active is true ) then 'Active' else 'In Active' end) as status,
                    coalesce((select username from auth_user where id = created_by_id),'') as createdby_username,
                    coalesce(to_char(created_date::timestamptz - interval '330' minute,'dd-mm-yyyy hh12:mi:ss'),'') as created_datatime,
                    coalesce((select username from auth_user where id = modified_by_id),'') as modify_username,
                    coalesce((select name||' '||last_name as title from employee_info  where id=emp_id),'') as title from sp_demotion_details order by created_datatime desc
          """
        cur.execute(log_query)   
        log_details = q.dictfetchall(cur)  
        json_data['log_details'] = log_details      
        if filter_name is None:
            cur.execute(q.fetch_hcms_query(config.succession_planning, config.sp_demotion_request_data_table))
        else:
            query = q.fetch_hcms_query(config.succession_planning, config.sp_demotion_request_data_table)
            cur.execute(query+" where p.emp_name ilike '%"+str(filter_name)+"%'")
        res = cur.fetchall()  
        json_data[config.results] = res
    except Exception as e:
        logger_obj.error(e)
        json_data[config.results] = []
    return HttpResponse(json.dumps(json_data))

#Transfer Request data table click function
@csrf_exempt
def DemotionRequestCRUDTableClick(request):
    ''' 
    11-September-2018 SYA To demotion datatable click Operation
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: SYA
    '''
    json_data ={}
    try:
        logger_obj.info('demotion datatable click function by'+str(request.user.username))
        post = request.POST            
        table_id = request.POST.get(config.table_id)
        cur = connection.cursor()
        query = q.fetch_hcms_query(config.succession_planning, config.sp_demotion_request_table_click)
        cur.execute(query,(table_id,))
        res = q.dictfetchall(cur) 
        json_data[config.results] = res
    except Exception as e:
        logger_obj.error(e)
        json_data[config.results] = []
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