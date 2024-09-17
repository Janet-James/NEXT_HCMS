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
from HRMS_Foundation.payroll_management.models import ArrearAmount
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

class HCMSArrearAmount(TemplateView):
    ''' 
        17-May-2018 VIJ To HR Payroll Tax Calculation page loaded. And also check the user authentication
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
        @author: VIJ
    '''
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HCMSArrearAmount, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Organization', self.request.user.id)
        if macl:
            template_name = "hrms_foundation/payroll_management/arrear_amount.html"  
        else:
            template_name = "tags/access_denied.html"
        return [template_name]
    
    def get(self, request, *args, **kwargs):
        context = super(HCMSArrearAmount, self).get_context_data(**kwargs)
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
        cur.execute("""select rftm.id,rftm.refitems_name,refitems_code from reference_items rftm
                inner join reference_item_category rftmc
                on rftm.refitems_category_id = rftmc.id where rftmc.refitem_category_code = 'ARRTP'""");
        arrear_data = q.dictfetchall(cur)  
        if arrear_data:
            arrear_data = arrear_data
        else:
            arrear_data = []  
        context['arrear_data'] = arrear_data
        return self.render_to_response(context)
    
    
@csrf_exempt
def HCMSArrearAmountCreate(request): # employee details create function
    ''' 
    17-OCT-2018 VJY To HRMS Create Arrear Amount function. 
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: VJY
    '''
    try:
        logger_obj.info('Arrear Amount details data insert by'+str(request.user.username))
        cur = connection.cursor() 
        json_data = {}
        data_value = request.POST.get(config.datas)   
        reg_id = request.POST.get(config.table_id) 
        delete_id = request.POST.get(config.delete_id)
        created_date = format(datetime.datetime.now().strftime ("%Y-%m-%d"))
        modified_date = format(datetime.datetime.now().strftime ("%Y-%m-%d"))
        uid=request.user.id
        if not uid:
            uid = 1
        if data_value :
                data = json.loads(data_value)
                if reg_id == '0': 
                            status = ArrearAmount(arrear_employee_id=data['arrear_data'][0]['arrear_employee_id'], arrear_type_id=data['arrear_data'][0]['arrear_type_id'],
                                                 arrear_category_id=3,arrear_amount=data['arrear_data'][0]['arrear_amount'], arrear_from_date=data['arrear_data'][0]['arrear_from_date'],
                                                  arrear_to_date=data['arrear_data'][0]['arrear_to_date'],is_active="True",created_by_id = uid,created_date = created_date)
                            status.save()
                            json_data[config.status_id] = status.id
                            json_data[config.status_key] = config.success_status
                        
                else:
                    status = ArrearAmount.objects.filter(id=reg_id).update(arrear_employee_id=data['arrear_data'][0]['arrear_employee_id'], arrear_type_id=data['arrear_data'][0]['arrear_type_id'],
                                                 arrear_category_id=3,arrear_amount=data['arrear_data'][0]['arrear_amount'], arrear_from_date=data['arrear_data'][0]['arrear_from_date'],
                                                  arrear_to_date=data['arrear_data'][0]['arrear_to_date'],is_active="True",modified_date = modified_date,modified_by_id=uid)
                    json_data[config.status_key] = config.update_status                                                           
                    logger_obj.info('Arrear Amount details update response is'+str(json_data)+"attempted by"+str(request.user.username)) 
        else:
            referred_record = record_validation('hr_arrear_amount', delete_id)
            if referred_record == True:
                status = ArrearAmount.objects.filter(id=delete_id).update(is_active="False")
                json_data[config.status_key] = config.remove_status
            elif referred_record == False:
                json_data[config.status_key] = config.record_already_referred                          
    except Exception as e:
            logger_obj.error(e)
            json_data[config.status_key] = e
    return HttpResponse(json.dumps(json_data))  

@csrf_exempt
def HRMSArrearTblDispaly(request):
    if request.method == config.request_post:
        cur = connection.cursor() 
        cur.execute(q.fetch_hcms_query(config.payroll_management,config.arrear_table_display))
        table_data = q.dictfetchall(cur)
    return HttpResponse(json.dumps(table_data))   

@csrf_exempt
def HRMSArrearTblRowClick(request):
   #3 try:
    if request.method == config.request_get:
        cur = connection.cursor() 
        row_click_id = int(request.GET[config.id])
        if row_click_id:
            arrear_tbl_click = {}
            arrear_table_row_click = q.fetch_hcms_query(config.payroll_management,config.row_click_arrear)
            if arrear_table_row_click:
                cur.execute(arrear_table_row_click%(row_click_id)) 
                arrear_tbl_click = q.dictfetchall(cur)
#     except Exception as e: 
#             payment_advice_tbl_click = e
    return HttpResponse(json.dumps(arrear_tbl_click))    