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
from HRMS_Foundation.payroll_management.models import PaymentAdvices
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


class HRMSPaymentAdvice(TemplateView):
    ''' 
        17-May-2018 VIJ To HR Payroll payment advice page loaded. And also check the user authentication
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
        @author: VIJ
    '''
    
    #template_name = "hrms_foundation/payroll_management/payment_advices.html"  
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HRMSPaymentAdvice, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Organization', self.request.user.id)
        if macl:
            template_name = "hrms_foundation/payroll_management/payment_advices.html"  
        else:
            template_name = "tags/access_denied.html"
        return [template_name]
    
    def get(self, request, *args, **kwargs):
        context = super(HRMSPaymentAdvice, self).get_context_data(**kwargs)
        cur = connection.cursor() 
        cur.execute(q.fetch_hcms_query(config.payroll_management, config.hrms_select_organization_info));
        organization_data = q.dictfetchall(cur)  
        if organization_data:
            organization_data = organization_data
        else:
            organization_data = []  
        context[config.organization_info] = organization_data #Loading Organization Data
        
        cur.execute(q.fetch_hcms_query(config.payroll_management, config.hrms_select_employee_info));
        employee_data = q.dictfetchall(cur)  
        if employee_data:
            employee_data = employee_data
        else:
            employee_data = []  
        context[config.employee_info] = employee_data #Loading Employee Data
        
        cur.execute(q.fetch_hcms_query(config.payroll_management, config.hrms_select_payment_mode_info));
        payment_mode_data = q.dictfetchall(cur)  
        if payment_mode_data:
            payment_mode_data = payment_mode_data
        else:
            payment_mode_data = []  
        context[config.payment_mode_info] = payment_mode_data #Loading Employee Data 
        
        cur.execute(q.fetch_hcms_query(config.payroll_management, config.hrms_select_bank_info));
        bank_data = q.dictfetchall(cur)  
        if bank_data:
            bank_data = bank_data
        else:
            payment_mode_data = []  
        context[config.bank_info] = bank_data #Loading Employee Data hrms_select_bank_info
        return self.render_to_response(context)
    
#Org unit structure data get function here
def PaymentOrgUnitChangeData(request):
    ''' 
    6-July-2018 VJY To HRMS Org unit structure data loaded
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: TRU
    '''
    json_data = {}
    try:
             logger_obj.info('Organization unit change structure data function by'+str(request.user.username))
             cur = connection.cursor()  #create the database connection
             id = request.GET.get(config.id) 
             query =  q.fetch_hcms_query(config.payroll_management, config.hrms_org_unit_employee_list)
             if id:
                 cur.execute(query,(int(id),));
                 values = q.dictfetchall(cur)
                 if values:
                         json_data[config.datas] = values
                 else:
                         json_data[config.datas] = []
             logger_obj.info('Organization unit change structure data response is'+str(json_data)+"attempted by"+str(request.user.username))     
    except Exception as e:
            logger_obj.error(e)
            json_data[config.datas] = [] 
    return HttpResponse(json.dumps(json_data))    

#department data get function here
def PaymentDepartmentChangeData(request):
    ''' 
    6-July-2018 VJY To HRMS Org unit structure data loaded
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: VJY
    '''
    json_data = {}
    try:
             logger_obj.info('Department change structure data function by'+str(request.user.username))
             cur = connection.cursor()  #create the database connection
             id = request.GET.get(config.id) 
             query =  q.fetch_hcms_query(config.payroll_management, config.hrms_department_list)
             if id:
                 cur.execute(query,(int(id),));
                 values = q.dictfetchall(cur)
                 if values:
                         json_data[config.department_data] = values
                 else:
                         json_data[config.department_data] = []
             logger_obj.info('Department change structure data response is'+str(json_data)+"attempted by"+str(request.user.username))     
    except Exception as e:
            logger_obj.error(e)
            json_data[config.department_data] = [] 
    return HttpResponse(json.dumps(json_data))

# employee data get function here
def PaymentEmployeeChangeData(request):
    ''' 
    6-July-2018 VJY To HRMS Org unit structure data loaded
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: VJY
    '''
    json_data = {}
    try:
             logger_obj.info('Department change structure data function by'+str(request.user.username))
             cur = connection.cursor()  #create the database connection
             id = request.GET.get(config.id) 
             query =  q.fetch_hcms_query(config.payroll_management, config.hrms_employee_list)
             if id:
                 cur.execute(query,(int(id),));
                 values = q.dictfetchall(cur)
                 if values:
                         json_data[config.employee_data] = values
                 else:
                         json_data[config.employee_data] = []
             logger_obj.info('Department change structure data response is'+str(json_data)+"attempted by"+str(request.user.username))     
    except Exception as e:
            logger_obj.error(e)
            json_data[config.employee_data] = [] 
    return HttpResponse(json.dumps(json_data))    
    
    
def EmployeeIdCheck(request):
    ''' 
        17-May-2018 VIJ To HR Payroll payment advice page loaded. And also check the user authentication
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
        @author: VIJ
    '''
    try:
        if request.method == config.request_get:
            cur = connection.cursor() 
            emp_id = int(request.GET[config.id])
            result = []
            employee_id_check = q.fetch_hcms_query(config.payroll_management,config.employee_id_check) 
            if employee_id_check:
                cur.execute(employee_id_check%(emp_id))
                values=q.dictfetchall(cur)
            if values:
                result_data = {config.status_key:config.success}
            else:
               result_data = {config.status_key:config.value_empty}        
        else:
            result_data = {config.status_key:config.request_failed} 
    except Exception as e: 
            logger_obj.error(e)  
            result_data= e
    return HttpResponse(json.dumps(result_data))     

@csrf_exempt
def HRMSCreatePaymentAdvice(request): # employee details create function
    ''' 
    26-May-2018 VJY To HRMS Create Payment Advice function. 
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: 420
    '''
    try:
        logger_obj.info('Payment Advice details data insert by'+str(request.user.username))
        cur = connection.cursor() 
        json_data = {}
        data_value = request.POST.get(config.datas)   
        payment_id = request.POST.get(config.table_id) 
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
                if payment_id == '0': 
                            status = PaymentAdvices(company_id_id=data['payment_adivces'][0]['company_id_id'], employee_id_id=data['payment_adivces'][0]['employee_id_id'],payment_mode_id=data['payment_adivces'][0]['payment_mode'], account_holder_name=data['payment_adivces'][0]['account_holder_name'],
                                                    organization_unit_id = data['payment_adivces'][0]['organization_unit_id'],department_id = data['payment_adivces'][0]['department_id'],
                                                  bank_name_id=data['payment_adivces'][0]['bank_name_id'],branch_name=data['payment_adivces'][0]['branch_name'],account_no=data['payment_adivces'][0]['account_no'],
                                                  uan_number=data['payment_adivces'][0]['uan_number'],ifsc_code=data['payment_adivces'][0]['ifsc_code'],branch_code=data['payment_adivces'][0]['branch_code'],
                                                  pan_number=data['payment_adivces'][0]['pan_number'],pf_number=data['payment_adivces'][0]['pf_number'],pf_applicable=data['payment_adivces'][0]['pf_applicable'],is_active="True",created_by_id=uid)
                            status.save()
                            json_data[config.status_id] = status.id
                            json_data[config.status_key] = config.success_status
                            cur.execute("select name as employee_name from employee_info where id = %s",(data['payment_adivces'][0]['employee_id_id'],)) 
                            name = q.dictfetchall(cur)
                            if name:
                                  employee =  name[0]['employee_name']
                            else:
                                employee = ''
                            cur.execute("""insert into payroll_activity_log (user_name,user_id,field_name,form_name,status,created_date,created_by_id,is_active) 
                            values(%s,%s,%s,%s,%s,%s,%s,%s)""",(user_name,uid,employee,'Payment Advice','create',created_date,uid,'true'))
                        
                else:
                    status = PaymentAdvices.objects.filter(id=payment_id).update(company_id_id=data['payment_adivces'][0]['company_id_id'], employee_id_id=data['payment_adivces'][0]['employee_id_id'],payment_mode_id=data['payment_adivces'][0]['payment_mode'], account_holder_name=data['payment_adivces'][0]['account_holder_name'],
                                                                                 organization_unit_id = data['payment_adivces'][0]['organization_unit_id'],department_id = data['payment_adivces'][0]['department_id'],
                                                  bank_name_id=data['payment_adivces'][0]['bank_name_id'],branch_name=data['payment_adivces'][0]['branch_name'],account_no=data['payment_adivces'][0]['account_no'],
                                                  uan_number=data['payment_adivces'][0]['uan_number'],ifsc_code=data['payment_adivces'][0]['ifsc_code'],branch_code=data['payment_adivces'][0]['branch_code'],
                                                  pan_number=data['payment_adivces'][0]['pan_number'],pf_number=data['payment_adivces'][0]['pf_number'],pf_applicable=data['payment_adivces'][0]['pf_applicable'],is_active="True",modified_by_id=uid)
                    json_data[config.status_key] = config.update_status   
                    if activity_log_data:
                        for a in activity_log_data:
                            cur.execute("""insert into payroll_activity_log (user_name,user_id,field_name,new_value,old_value,form_name,status,created_date,modified_date,modified_by_id,is_active) 
                            values(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)""",(user_name,uid,a['field_name'],a['new_value'],a['old_value'],'Payment Advice','update',created_date,modified_date,uid,'true'))                                                         
                    logger_obj.info('Payment Advice details update response is'+str(json_data)+"attempted by"+str(request.user.username)) 
        else:
            referred_record = record_validation('hr_payment_advices', delete_id)
            if referred_record == True:
                status =  PaymentAdvices.objects.filter(id=delete_id).update(is_active="False")
                json_data[config.status_key] = config.remove_status
                cur.execute("""select employee_info.name as employee_name from employee_info  
                inner join hr_payment_advices on hr_payment_advices.employee_id_id = employee_info.id
                where hr_payment_advices.id = %s""",(delete_id,))
                delete_name = q.dictfetchall(cur)
                if delete_name:
                    name_data =  delete_name[0]['employee_name']
                else:
                    name_data = ''
                cur.execute("""insert into payroll_activity_log (user_name,user_id,field_name,form_name,status,modified_date,modified_by_id,is_active) 
                            values(%s,%s,%s,%s,%s,%s,%s,%s)""",(user_name,uid,name_data,'Payment Advice','delete',created_date,uid,'true'))
            elif referred_record == False:
                json_data[config.status_key] = config.record_already_referred                          
    except Exception as e:
            logger_obj.error(e)
            json_data[config.status_key] = e
    return HttpResponse(json.dumps(json_data))    

@csrf_exempt
def HRMSPaymentAdviceTblDispaly(request):
    if request.method == config.request_post:
        cur = connection.cursor() 
        cur.execute(q.fetch_hcms_query(config.payroll_management,config.payment_advice_table_display))
        table_data = q.dictfetchall(cur)
    return HttpResponse(json.dumps(table_data)) 

@csrf_exempt
def HRMSPaymentAdviceTblRowClick(request):
   #3 try:
    if request.method == config.request_get:
        cur = connection.cursor() 
        row_click_id = int(request.GET[config.id])
        if row_click_id:
            payment_advice_tbl_click = {}
            payment_advice_table_row_click = q.fetch_hcms_query(config.payroll_management,config.row_click_payment_advice)
            if payment_advice_table_row_click:
                cur.execute(payment_advice_table_row_click%(row_click_id)) 
                payment_advice_tbl_click = q.dictfetchall(cur)
#     except Exception as e: 
#             payment_advice_tbl_click = e
    return HttpResponse(json.dumps(payment_advice_tbl_click))  