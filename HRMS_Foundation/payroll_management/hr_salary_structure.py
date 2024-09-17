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
from HRMS_Foundation.payroll_management.models import SalaryStructure,SalaryStructureRule
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

class HRMSSalaryStructure(TemplateView):
    ''' 
        17-May-2018 VIJ To HR Payroll salary rule page loaded. And also check the user authentication
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
        @author: VIJ
    '''
    
    #template_name = "hrms_foundation/payroll_management/salary_structure.html"  
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HRMSSalaryStructure, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Organization', self.request.user.id)
        if macl:
            template_name = "hrms_foundation/payroll_management/salary_structure.html"  
        else:
            template_name = "tags/access_denied.html"
        return [template_name]
    
    def get(self, request, *args, **kwargs):
        context = super(HRMSSalaryStructure, self).get_context_data(**kwargs)
        cur = connection.cursor()
             
        cur.execute(q.fetch_hcms_query(config.payroll_management, config.hrms_select_organization_info));
        organization_data = q.dictfetchall(cur)  
        if organization_data:
            organization_data = organization_data
        else:
            organization_data = []  
        context[config.organization_info] = organization_data #Loading Organization Data  
        
        return self.render_to_response(context)
    
@csrf_exempt
def HRMSCreateSalaryStructure(request): # employee details create function
    ''' 
    26-May-2018 VJY To HRMS Create Salary Rule function. 
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: VJY
    '''
    try:
        logger_obj.info('Salary Structure details data insert by'+str(request.user.username))
        cur = connection.cursor()
        json_data = {}
        data_value = request.POST.get(config.datas)   
        structure_id = request.POST.get(config.table_id) 
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
                salary_table_id = json.loads(request.POST[config.salary_table_id])
                value = [x for x in salary_table_id if x]
                data = json.loads(data_value)
                if structure_id == '0': 
                            status = SalaryStructure(structure_name = data['input_data'][0]['structure_name'], structure_code = data['input_data'][0]['structure_code'], company_id_id = data['input_data'][0]['company_id'],
                                                     description = data['input_data'][0]['description'], is_active = "True",created_by_id=uid)
                            status.save()
                            json_data[config.status_id] = status.id
                            json_data[config.status_key] = config.success_status
                            cur.execute("""insert into payroll_activity_log (user_name,user_id,field_name,form_name,status,created_date,created_by_id,is_active) 
                            values(%s,%s,%s,%s,%s,%s,%s,%s)""",(user_name,uid,data['input_data'][0]['structure_name'],'Salary Structure','create',created_date,uid,'true'))
                            if status.id :
                                structure_id = status.id
                                for i in value:
                                    if i['salary_condition_id'] != '' and i['salary_rule_id'] != '':
                                        status = SalaryStructureRule(salary_rule_id_id = i['salary_rule_id'], structure_id_id = structure_id, 
                                                                     salary_rule_conditions_id_id = i['salary_condition_id'],
                                                      is_active = "True",created_by_id=uid)
                                        status.save()
                                    else:
                                        print"elseeeeeeeeeeeeee"    
                else:
                    status = SalaryStructure.objects.filter(id = structure_id).update(structure_name = data['input_data'][0]['structure_name'], structure_code = data['input_data'][0]['structure_code'],
                                                                        company_id_id = data['input_data'][0]['company_id'], description = data['input_data'][0]['description'], is_active = "True",modified_by_id=uid)
                    update_id = structure_id
                    
                    if update_id:
                        id = update_id
                        salary_structure_id = q.fetch_hcms_query(config.payroll_management,config.salary_structure_id)
                        if salary_structure_id:
                            cur.execute(salary_structure_id%(int(id))) 
                            res = cur.fetchall()
                        res_data = [i[0] for i in res]
                        for i in res_data:
                            if i not in value:
                                salary_structure_id_delete = q.fetch_hcms_query(config.payroll_management,config.salary_structure_id_delete)
                                if salary_structure_id_delete:
                                    cur.execute(salary_structure_id_delete%(int(i),id))
                        for j in value:
                            select_salary_rule_id = q.fetch_hcms_query(config.payroll_management,config.select_salary_rule_id)
                            if select_salary_rule_id:
                                cur.execute(select_salary_rule_id%(int(j)))
                                result_data = cur.fetchall() 
                                print"^^^^^^^^^^^^^^^^^^^^^^^^^^result_data",result_data
                            if result_data:
                                status = SalaryStructureRule(salary_rule_id_id = int(result_data[0][0]), structure_id_id = int(id), 
                                                             salary_rule_conditions_id_id = int(j),
                                              is_active = "True")
                                status.save()
                    json_data[config.status_key] = config.update_status  
                    if activity_log_data:
                        for a in activity_log_data:
                            cur.execute("""insert into payroll_activity_log (user_name,user_id,field_name,new_value,old_value,form_name,status,created_date,modified_date,modified_by_id,is_active) 
                            values(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)""",(user_name,uid,a['field_name'],a['new_value'],a['old_value'],'Salary Structure','update',created_date,modified_date,uid,'true'))                                                                
                    logger_obj.info('Salary Structure details update response is'+str(json_data)+"attempted by"+str(request.user.username)) 
        else:
            referred_record = record_validation('hr_salary_structure', delete_id)
            if referred_record == True:
                status =  SalaryStructure.objects.filter(id=delete_id).update(is_active="False")
                json_data[config.status_key] = config.remove_status
                cur.execute("""select structure_name from hr_salary_structure where id = %s""",(delete_id,))
                delete_name = q.dictfetchall(cur)
                if delete_name:
                    name_data =  delete_name[0]['structure_name']
                else:
                    name_data = ''
                cur.execute("""insert into payroll_activity_log (user_name,user_id,field_name,form_name,status,modified_date,modified_by_id,is_active) 
                            values(%s,%s,%s,%s,%s,%s,%s,%s)""",(user_name,uid,name_data,'Salary Structure','delete',created_date,uid,'true'))
            elif referred_record == False:
                json_data[config.status_key] = config.record_already_referred                          
    except Exception as e:
        logger_obj.error(e)
        json_data[config.status_key] = e
    return HttpResponse(json.dumps(json_data)) 

@csrf_exempt
def HRMSSalaryStructureRegTblDispaly(request):
    ''' 
    26-May-2018 VJY To HRMS Create Salary Rule function. 
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: VJY
    '''
    if request.method == config.request_post:
        cur = connection.cursor()
        cur.execute(q.fetch_hcms_query(config.payroll_management,config.salary_structure_table_display))
        table_data = q.dictfetchall(cur)
    return HttpResponse(json.dumps(table_data))  

@csrf_exempt
def HRMSSalaryStructureRuleTblRowClick(request):
    ''' 
    26-May-2018 VJY To HRMS Create Salary Rule function. 
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: VJY
    '''
    try:
        if request.method == config.request_get:
            cur = connection.cursor()
            row_click_id = int(request.GET[config.id])
            if row_click_id:
                salary_structure_tbl_click = {}
                salary_structure_table_row_click = q.fetch_hcms_query(config.payroll_management,config.salary_structure_table_row_click)
                if salary_structure_table_row_click:
                    cur.execute(salary_structure_table_row_click%(row_click_id)) 
                    salary_structure_tbl_click = q.dictfetchall(cur)
    except Exception as e: 
            salary_structure_tbl_click = e
    return HttpResponse(json.dumps(salary_structure_tbl_click)) 

def HRMSSalaryRulePopupTbl(request):
    ''' 
    26-May-2018 VJY To HRMS Create Salary Rule function. 
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: VJY
    '''
    try:
        if request.method == config.request_get:
            cur = connection.cursor()
            cur.execute(q.fetch_hcms_query(config.payroll_management,config.salary_rule_popup_table)) 
            salary_rule_pop_tbl = q.dictfetchall(cur)
    except Exception as e:
        logger_obj.error(e)   
        salary_rule_pop_tbl = e    
    return HttpResponse(json.dumps(salary_rule_pop_tbl))   

def HRMSSalaryRuleMainTbl(request):
    ''' 
    26-May-2018 VJY To HRMS Create Salary Rule function. 
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: VJY
    '''
    try:
        if request.method==config.request_get:
            cur = connection.cursor()
            salary_rule_id = json.loads(request.GET[config.id])
            salary_rule_condition_id = json.loads(request.GET[config.condition_id])
            id = (', '.join("'" + str(item) + "'" for item in salary_rule_id if item != 'null'))
            condition_id = (', '.join("'" + item + "'" for item in salary_rule_condition_id if item != 'null'))
            salary_rule_main_table = q.fetch_hcms_query(config.payroll_management,config.salary_rule_main_table)
            if salary_rule_main_table:
                    cur.execute(salary_rule_main_table%((id),(condition_id),)) 
                    slary_main_tbl = q.dictfetchall(cur)
    except Exception as e: 
        logger_obj.error(e)  
        slary_main_tbl = e    
    return HttpResponse(json.dumps(slary_main_tbl))  

def HRMSSalaryStructureCode(request):
    ''' 
    20-Sep-2018 VJY To HRMS Create Salary Rule function. 
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: VJY
    '''
    try:
        json_data = {}
        logger_obj.info("Salary Structure Code Generate function")
        cur = connection.cursor()
        cur.execute("select structure_code from hr_salary_structure  order by structure_code desc limit 1")
        code_data = q.dictfetchall(cur)
        if code_data:
            code_val = code_data[0]['structure_code']
            code_letter = code_val[:2]
            code_digit = code_val[-3:]
            code = str(int(code_digit) + 1 )
            code_length = len(code)
            if code_length < 3: 
                code = "0" * (3 - code_length) + code
                salary_code = (code_letter + code)
                json_data['code'] = salary_code
        else:
            json_data['code'] = 'SS001'    
    except Exception as e:
        logger_obj.error(e) 
        json_data['code'] = e
    return HttpResponse(json.dumps(json_data))   


            
    