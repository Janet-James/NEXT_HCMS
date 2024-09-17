# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.shortcuts import render

import json
import datetime
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.http.response import HttpResponse
from CommonLib import query
from django.db import connection
from CommonLib import query as q
from HRMS_Foundation.payroll_management.models import TdsDeclaration
from django_countries import countries
import config
from CommonLib.hcms_common import refitem_fetch
from CommonLib.hcms_common import menu_access_control
import HCMS.settings as setting
#template render html
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from CommonLib.hcms_common import record_validation 
import logging
import logging.handlers
logger_obj = logging.getLogger('logit')

class HRMSTaxCalculation(TemplateView):
    ''' 
        17-May-2018 VIJ To HR Payroll Tax Calculation page loaded. And also check the user authentication
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
        @author: VIJ
    '''
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HRMSTaxCalculation, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Organization', self.request.user.id)
        if macl:
            template_name = "hrms_foundation/payroll_management/payroll.html"  
        else:
            template_name = "tags/access_denied.html"
        return [template_name]
    
    def get(self, request, *args, **kwargs):
        context = super(HRMSTaxCalculation, self).get_context_data(**kwargs)
        cur = connection.cursor() 
        cur.execute(q.fetch_hcms_query(config.payroll_management,config.salary_category_select_id));
        salary_category_data = q.dictfetchall(cur) 
        if salary_category_data:
            salary_category_data = salary_category_data
        else:
            salary_category_data = []  
        context[config.tds_category_data] = salary_category_data #Loading salary category Data
        cur.execute(q.fetch_hcms_query(config.payroll_management, config.hrms_select_employee_info));
        employee_data = q.dictfetchall(cur)  
        if employee_data:
            employee_data = employee_data
        else:
            employee_data = []  
        context[config.employee_info] = employee_data #Loading Employee Data
        return self.render_to_response(context)
    
@csrf_exempt
def HRMSCreateTds(request): # employee details create function
    ''' 
    26-May-2018 VJY To HRMS Create Payment Advice function. 
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: VJY
    '''
    try:
        logger_obj.info('TDS details data insert by'+str(request.user.username))
        cur = connection.cursor() 
        json_data = {}
        data_value = request.POST.get(config.datas)   
        tds_id = request.POST.get(config.table_id) 
        delete_id = request.POST.get(config.delete_id)
        created_date = format(datetime.datetime.now().strftime ("%Y-%m-%d"))
        modified_date = format(datetime.datetime.now().strftime ("%Y-%m-%d"))
        if data_value:
            activity_log_data = json.loads(request.POST.get('log_data'))
        uid=request.user.id
        if not uid:
            uid = 1
        cur.execute("select name as user_name from employee_info where related_user_id_id = %s",(uid,)) 
        employee_name = q.dictfetchall(cur)
        if employee_name:
              user_name =  employee_name[0]['user_name']
        else:
            user_name = ''    
        if data_value :
                data = json.loads(data_value)
                if tds_id == '0': 
                    status = TdsDeclaration(tds_employee_id=data['tds_data'][0]['tds_employee_id'], tds_category_id=1,
                                             tds_amount=data['tds_data'][0]['tds_amount'],
                                            tds_from_date = data['tds_data'][0]['tds_from_date'],tds_to_date = data['tds_data'][0]['tds_to_date'],
                                          is_active="True",created_by_id=uid, modified_by_id=uid)
                    status.save()
                    json_data[config.status_id] = status.id
                    json_data[config.status_key] = config.success_status
                    cur.execute("select name as user_name from employee_info where id = %s",(data['tds_data'][0]['tds_employee_id'],)) 
                    employee_data = q.dictfetchall(cur)
                    if employee_data:
                          name =  employee_data[0]['user_name']
                    else:
                        name = ''
                    cur.execute("""insert into payroll_activity_log (user_name,user_id,field_name,form_name,status,created_date,created_by_id,is_active) 
                            values(%s,%s,%s,%s,%s,%s,%s,%s)""",(user_name,uid,name,'TDS','create',created_date,uid,'true'))  
                             
                else:
                    status = TdsDeclaration.objects.filter(id=tds_id).update(tds_employee_id=data['tds_data'][0]['tds_employee_id'], tds_category_id=1,
                                             tds_amount=data['tds_data'][0]['tds_amount'],
                                            tds_from_date = data['tds_data'][0]['tds_from_date'],tds_to_date = data['tds_data'][0]['tds_to_date'],
                                          is_active="True",created_by_id=uid, modified_by_id=uid)
                    json_data[config.status_key] = config.update_status   
                    if activity_log_data:
                        for a in activity_log_data:
                            cur.execute("""insert into payroll_activity_log (user_name,user_id,field_name,new_value,old_value,form_name,status,created_date,modified_date,modified_by_id,is_active) 
                            values(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)""",(user_name,uid,a['field_name'],a['new_value'],a['old_value'],'TDS','update',created_date,modified_date,uid,'true'))                                                        
                    logger_obj.info('TDS details update response is'+str(json_data)+"attempted by"+str(request.user.username)) 
        else:
            referred_record = record_validation('hr_tds', delete_id)
            if referred_record == True:
                status =  TdsDeclaration.objects.filter(id=delete_id).update(is_active="False")
                json_data[config.status_key] = config.remove_status
                cur.execute("""select employee_info.name as employee_name from employee_info  
                inner join hr_tds on hr_tds.tds_employee_id = employee_info.id
                where hr_tds.id = %s""",(delete_id,))
                delete_name = q.dictfetchall(cur)
                if delete_name:
                    name_data =  delete_name[0]['employee_name']
                else:
                    name_data = ''
                cur.execute("""insert into payroll_activity_log (user_name,user_id,field_name,form_name,status,modified_date,modified_by_id,is_active) 
                            values(%s,%s,%s,%s,%s,%s,%s,%s)""",(user_name,uid,name_data,'TDS','delete',created_date,uid,'true')) 
            elif referred_record == False:
                json_data[config.status_key] = config.record_already_referred                          
    except Exception as e:
            logger_obj.error(e)
            json_data[config.status_key] = e
    return HttpResponse(json.dumps(json_data))   

@csrf_exempt
def HRMSTdsTblDispaly(request):
    if request.method == config.request_post:
        cur = connection.cursor() 
        cur.execute(q.fetch_hcms_query(config.payroll_management,config.tds_table_display))
        table_data = q.dictfetchall(cur)
    return HttpResponse(json.dumps(table_data))   

@csrf_exempt
def HRMSTdsTblRowClick(request):
   #3 try:
    if request.method == config.request_get:
        cur = connection.cursor() 
        row_click_id = int(request.GET[config.id])
        if row_click_id:
            tds_tbl_click = {}
            tds_table_row_click = q.fetch_hcms_query(config.payroll_management,config.row_click_tds)
            if tds_table_row_click:
                cur.execute(tds_table_row_click%(row_click_id)) 
                tds_tbl_click = q.dictfetchall(cur)
#     except Exception as e: 
#             payment_advice_tbl_click = e
    return HttpResponse(json.dumps(tds_tbl_click))  