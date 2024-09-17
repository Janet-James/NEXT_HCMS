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
from HRMS_Foundation.payroll_management.models import ContributionRegister
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

class HRMSContributionRegister(TemplateView):
    ''' 
        17-May-2018 VIJ To HR Payroll contribution register page loaded. And also check the user authentication
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
        @author: VIJ
    '''
    
    #template_name = "hrms_foundation/payroll_management/contribution_register.html"  
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HRMSContributionRegister, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Organization', self.request.user.id)
        if macl:
            template_name = "hrms_foundation/payroll_management/contribution_register.html"  
        else:
            template_name = "tags/access_denied.html"
        return [template_name]
    
    def get(self, request, *args, **kwargs):
        context = super(HRMSContributionRegister, self).get_context_data(**kwargs)
        cur = connection.cursor() 
        cur.execute(q.fetch_hcms_query(config.payroll_management,config.salary_component_type));
        salary_component_data = q.dictfetchall(cur)  
        if salary_component_data:
            salary_component_data = salary_component_data
        else:
            salary_component_data = []  
        context[config.salary_component_data] = salary_component_data #Loading salary component Data
        return self.render_to_response(context)
    
@csrf_exempt
def HRMSCreateContributionRegister(request): # employee details create function
    ''' 
    26-May-2018 VJY To HRMS Create Salary Rule function. 
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: VJY
    '''
    try:
        logger_obj.info('Contribution Register details data insert by'+str(request.user.username))
        cur = connection.cursor() 
        json_data = {}
        created_date = format(datetime.datetime.now().strftime ("%Y-%m-%d"))
        modified_date = format(datetime.datetime.now().strftime ("%Y-%m-%d"))
        data_value = request.POST.get(config.datas)   
        reg_id = request.POST.get(config.table_id) 
        delete_id = request.POST.get(config.delete_id)
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
                if reg_id == '0': 
                            cur.execute("select code from hr_contribution_register  where code  = %s",(data[0]['contribution_register_code'],)) 
                            con_code = q.dictfetchall(cur)
                            if not con_code:
                                status = ContributionRegister(name=data[0]['contribution_register_name'], code=data[0]['contribution_register_code'],description=data[0]['description'], contributor=data[0]['contributor_id'],
                                                      contribution=data[0]['contribution'],salary_compontent_id=data[0]['salary_compontent_id'],is_active="True",created_by_id=uid)
                                status.save()
                                json_data[config.status_id] = status.id
                                json_data[config.status_key] = config.success_status
                                cur.execute("""insert into payroll_activity_log (user_name,user_id,field_name,form_name,status,created_date,created_by_id,is_active) 
                                values(%s,%s,%s,%s,%s,%s,%s,%s)""",(user_name,uid,data[0]['contribution_register_name'],'Contribution Register','create',created_date,uid,'true'))  
                            else:
                                 json_data[config.status_key] = 'Already Exist'  
                        
                else:
                    status = ContributionRegister.objects.filter(id=reg_id).update(name=data[0]['contribution_register_name'], code=data[0]['contribution_register_code'],description=data[0]['description'], contributor=data[0]['contributor_id'],
                                                  contribution=data[0]['contribution'],salary_compontent_id=data[0]['salary_compontent_id'],is_active="True",modified_by_id=uid)
                    json_data[config.status_key] = config.update_status             
                    if activity_log_data:
                        for a in activity_log_data:
                            cur.execute("""insert into payroll_activity_log (user_name,user_id,field_name,new_value,old_value,form_name,status,created_date,modified_date,modified_by_id,is_active) 
                            values(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)""",(user_name,uid,a['field_name'],a['new_value'],a['old_value'],'Contribution Register','update',created_date,modified_date,uid,'true'))                                         
                    logger_obj.info('Contribution Register details update response is'+str(json_data)+"attempted by"+str(request.user.username)) 
        else:
            referred_record = record_validation('hr_contribution_register', delete_id)
            if referred_record == True:
                status =  ContributionRegister.objects.filter(id=delete_id).update(is_active="False")
                json_data[config.status_key] = config.remove_status
                cur.execute("""select name from hr_contribution_register where id = %s""",(delete_id,))
                delete_name = q.dictfetchall(cur)
                if delete_name:
                    name_data =  delete_name[0]['name']
                else:
                    name_data = ''
                cur.execute("""insert into payroll_activity_log (user_name,user_id,field_name,form_name,status,modified_date,modified_by_id,is_active) 
                            values(%s,%s,%s,%s,%s,%s,%s,%s)""",(user_name,uid,name_data,'Contribution Register','delete',created_date,uid,'true'))  
            elif referred_record == False:
                json_data[config.status_key] = config.record_already_referred                          
    except Exception as e:
            logger_obj.error(e)
            json_data[config.status_key] = e
    return HttpResponse(json.dumps(json_data))    

@csrf_exempt
def HRMSCreateContributionRegTblDispaly(request):
    if request.method == config.request_post:
        cur = connection.cursor() 
        cur.execute(q.fetch_hcms_query(config.payroll_management,config.contributor_register_table_display))
        table_data = q.dictfetchall(cur)
    return HttpResponse(json.dumps(table_data)) 

@csrf_exempt
def HRMSContributorRegTblRowClick(request):
    try:
        if request.method == config.request_get:
            cur = connection.cursor() 
            row_click_id = int(request.GET[config.id])
            if row_click_id:
                contribution_register_tbl_click = {}
                contribution_register_table_row_click = q.fetch_hcms_query(config.payroll_management,config.contributions_register_table_row_click)
                if contribution_register_table_row_click:
                    cur.execute(contribution_register_table_row_click%(row_click_id)) 
                    contribution_register_tbl_click = q.dictfetchall(cur)
    except Exception as e: 
            contribution_register_tbl_click = e
    return HttpResponse(json.dumps(contribution_register_tbl_click))  
  
@csrf_exempt
def HCMSPayrollActivityData(request):
    cur = connection.cursor()
    tab_id = request.POST.get('tab_id')
    created_date = format(datetime.datetime.now().strftime ("%Y-%m-%d"))
    activity_log = ''
    if tab_id == 'tab_contribution':
        cur.execute("""select user_name,field_name,new_value,old_value,to_char(created_date,'DD-MM-YYYY') as created_date,
        to_char(modified_date,'DD-MM-YYYY') as modified_date,status,form_name  from payroll_activity_log where form_name = 'Contribution Register' order by created_date desc""")
        activity_log = q.dictfetchall(cur)
    elif tab_id == 'tab_salary_structure':  
        cur.execute("""select user_name,field_name,new_value,old_value,to_char(created_date,'DD-MM-YYYY') as created_date,
        to_char(modified_date,'DD-MM-YYYY') as modified_date,status,form_name  from payroll_activity_log where form_name = 'Salary Structure' order by created_date desc""")
        activity_log = q.dictfetchall(cur)    
    elif tab_id == 'tab_tds':  
        cur.execute("""select user_name,field_name,new_value,old_value,to_char(created_date,'DD-MM-YYYY') as created_date,
        to_char(modified_date,'DD-MM-YYYY') as modified_date,status,form_name  from payroll_activity_log where form_name = 'TDS' order by created_date desc""")
        activity_log = q.dictfetchall(cur)
    elif tab_id == 'tab_payment_advice':  
        cur.execute("""select user_name,field_name,new_value,old_value,to_char(created_date,'DD-MM-YYYY') as created_date,
        to_char(modified_date,'DD-MM-YYYY') as modified_date,status,form_name  from payroll_activity_log where form_name = 'Payment Advice' order by created_date desc""")
        activity_log = q.dictfetchall(cur)
    elif tab_id == 'tab_salary_contract':  
        cur.execute("""select user_name,field_name,new_value,old_value,to_char(created_date,'DD-MM-YYYY') as created_date,
        to_char(modified_date,'DD-MM-YYYY') as modified_date ,status,form_name from payroll_activity_log where form_name = 'Salary Contract' order by created_date desc""")
        activity_log = q.dictfetchall(cur)
    elif tab_id == 'salary_rule_tab':  
        cur.execute("""select user_name,field_name,new_value,old_value,to_char(created_date,'DD-MM-YYYY') as created_date,
        to_char(modified_date,'DD-MM-YYYY') as modified_date ,status,form_name from payroll_activity_log where form_name = 'Salary Rule' order by created_date desc""")
        activity_log = q.dictfetchall(cur) 
    elif tab_id == 'tab_payslip':  
        cur.execute("""select user_name,field_name,new_value,old_value,to_char(created_date,'DD-MM-YYYY') as created_date,
        to_char(modified_date,'DD-MM-YYYY') as modified_date ,status,form_name from payroll_activity_log where form_name = 'Payslip' order by created_date desc""")
        activity_log = q.dictfetchall(cur)                        
    if activity_log:
        return HttpResponse(json.dumps(activity_log))
    else:
        return HttpResponse(json.dumps([]))
     

# def HRMSContributorRegCode(request):
#     ''' 
#     20-Sep-2018 VJY To HRMS Create Contribution Register Code function. 
#     @param request: Request Object
#     @type request : Object
#     @return:   HttpResponse or Redirect the another URL
#     @author: VJY
#     '''
#     try:
#         json_data = {}
#         logger_obj.info("Contribution Register Code Generate function")
#         cur = connection.cursor()
#         cur.execute("select code from hr_contribution_register   order by code desc limit 1")
#         code_data = q.dictfetchall(cur)
#         if code_data:
#             code_val = code_data[0]['code']
#             code_letter = code_val[:2]
#             code_digit = code_val[-3:]
#             code = str(int(code_digit) + 1 )
#             code_length = len(code)
#             if code_length < 3: 
#                 code = "0" * (3 - code_length) + code
#                 salary_code = (code_letter + code)
#                 json_data['reg_code'] = salary_code
#         else:
#             json_data['reg_code'] = 'CR001'    
#     except Exception as e:
#         logger_obj.error(e) 
#         json_data['reg_code'] = e
#     return HttpResponse(json.dumps(json_data))   
