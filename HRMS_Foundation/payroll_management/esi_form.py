# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.shortcuts import render

import json
import xlwt
import datetime
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.http.response import HttpResponse
from CommonLib import query
from django.db import connection
from CommonLib import query as q
from HRMS_Foundation.payroll_management.models import EsiValue
from django_countries import countries
import config
from CommonLib.hcms_common import refitem_fetch
from CommonLib.hcms_common import menu_access_control
import HCMS.settings as setting
import pdfkit,os
#template render html
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from CommonLib.hcms_common import record_validation 
import logging
import logging.handlers
logger_obj = logging.getLogger('logit')

# Employee views here
class HCMSEsiForm(TemplateView): # employee page
    ''' 
    13-Feb-2018 VIJ To HRMS Employee Id Card page loaded. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: VIJ
    '''

#     template_name = "hrms_foundation/employee_management/employee.html"
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HCMSEsiForm, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        #macl = menu_access_control('Employee', self.request.user.id)
        #if macl:
        template_name = "hrms_foundation/payroll_management/esi_form.html"
        #else:
            #template_name = "tags/access_denied.html"
        return [template_name]    
        
   
    def get(self, request, *args, **kwargs):
        context = super(HCMSEsiForm, self).get_context_data(**kwargs)
                
        cur = connection.cursor()       
        #cur.execute(q.fetch_hcms_query(config.payroll_management, config.hrms_select_employee_info));
        cur.execute("""select emp.id,emp.name as employee_name from employee_info  emp
            inner join hr_performance_rating_details hrsc on hrsc.user_id = emp.related_user_id_id
            where emp.is_active group by emp.name,emp.id order by emp.name""")
        employee_data = q.dictfetchall(cur)  
        if employee_data:
            employee_data = employee_data
        else:
            employee_data = []  
        context['employee_val'] = employee_data #Loading Employee Data     
             
        return self.render_to_response(context)
    
@csrf_exempt
def HCMSEsiCreate(request): # employee details create function
    ''' 
    17-OCT-2018 VJY To HRMS Create Esi Point function. 
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: VJY
    '''
    try:
        logger_obj.info('ESI details data insert by'+str(request.user.username))
        cur = connection.cursor() 
        json_data = {}
        data_value = request.POST.get(config.datas)   
        reg_id = request.POST.get(config.table_id) 
        delete_id = request.POST.get(config.delete_id)
        created_date = format(datetime.datetime.now().strftime ("%Y-%m-%d"))
        modified_date = format(datetime.datetime.now().strftime ("%Y-%m-%d"))
        uid=request.user.id
        #print"+++++++++++++++++delete_id",delete_id
        employee_list_data = request.POST.get("employee_id_list")
        if not uid:
            uid = 1
        if data_value :
                employee_list_value = json.loads(employee_list_data)
                data = json.loads(data_value)
                if employee_list_value:
                    for v in employee_list_value:
                        if reg_id == '0': 
                            cur.execute("""select esi_employee_id from esi_value where is_active and esi_employee_id = %s and (esi_date_from, esi_date_to) OVERLAPS 
                              (%s,%s)""",(v,data['esi_data'][0]['esi_date_from'],data['esi_data'][0]['esi_date_to'],))
                            employee_res = cur.fetchall()
                            if employee_res:
                                json_data[config.status_key] = "Already Exist"
                            else:      
                                status = EsiValue(esi_employee_id=v, esi_active=data['esi_data'][0]['esi_value'],
                                                      esi_date_from=data['esi_data'][0]['esi_date_from'],esi_date_to=data['esi_data'][0]['esi_date_to'],is_active="True",created_by_id = uid,created_date=created_date)
                                status.save()
                                json_data[config.status_id] = status.id
                                json_data[config.status_key] = config.success_status
                                
                        else:
                            status = EsiValue.objects.filter(id=reg_id).update(esi_employee_id=v, esi_active=data['esi_data'][0]['esi_value'],
                                                          esi_date_from=data['esi_data'][0]['esi_date_from'],esi_date_to=data['esi_data'][0]['esi_date_to'],is_active="True",modified_by_id = uid,modified_date=modified_date)
                            json_data[config.status_key] = config.update_status                                                           
                            logger_obj.info('Esi details update response is'+str(json_data)+"attempted by"+str(request.user.username)) 
        else:
            referred_record = record_validation('esi_value', delete_id)
            if referred_record == True:
                status =  EsiValue.objects.filter(id=delete_id).update(is_active="False")
                json_data[config.status_key] = config.remove_status
            elif referred_record == False:
                json_data[config.status_key] = config.record_already_referred                          
    except Exception as e:
            logger_obj.error(e)
            json_data[config.status_key] = e
    return HttpResponse(json.dumps(json_data))  

@csrf_exempt
def HCMSEsiTblDisplay(request):
    ''' 
    17-OCT-2018 VJY To HRMS Table Display ESIfunction. 
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: VJY
    '''
    try:
        json_data = {}
        logger_obj.info('ESI details table display by'+str(request.user.username))
        if request.method == config.request_post:
            cur = connection.cursor() 
            cur.execute(q.fetch_hcms_query(config.payroll_management,config.esi_table_display))
            table_data = q.dictfetchall(cur)
    except Exception as e:
            logger_obj.error(e)
            json_data[config.status_key] = e        
    return HttpResponse(json.dumps(table_data))  

@csrf_exempt
def HCMSEsiTblRowClick(request):
    try:
        if request.method == config.request_get:
            cur = connection.cursor() 
            row_click_id = int(request.GET[config.id])
            if row_click_id:
                esi_tbl_click = {}
                esi_table_row_click = q.fetch_hcms_query(config.payroll_management,config.esi_table_row_click)
                if esi_table_row_click:
                    cur.execute(esi_table_row_click%(row_click_id)) 
                    esi_tbl_click = q.dictfetchall(cur)
    except Exception as e: 
            esi_tbl_click = e
    return HttpResponse(json.dumps(esi_tbl_click))

