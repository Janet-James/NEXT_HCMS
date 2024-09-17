# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.shortcuts import render
from CommonLib.hcms_common import menu_access_control
import json
import datetime
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.http.response import HttpResponse
from CommonLib import query
from django.db import connection
from CommonLib import query as q
from HRMS_Foundation.payroll_management.models import SalaryRule,SalaryRule_Conditions
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

class HRMSSalaryRule(TemplateView):
    ''' 
        17-May-2018 VJY To HR Payroll salary rule page loaded. And also check the user authentication
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
        @author: VJY
    '''
    
    #template_name = "hrms_foundation/payroll_management/salary_rule.html"  
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HRMSSalaryRule, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Organization', self.request.user.id)
        if macl:
            template_name = "hrms_foundation/payroll_management/salary_rule.html"  
        else:
            template_name = "tags/access_denied.html"
        return [template_name]

    def get(self, request, *args, **kwargs):
        context = super(HRMSSalaryRule, self).get_context_data(**kwargs)
        cur = connection.cursor()
        cur.execute(q.fetch_hcms_query(config.payroll_management,config.salary_category_select_id));
        salary_category_data = q.dictfetchall(cur)  
        if salary_category_data:
            salary_category_data = salary_category_data
        else:
            salary_category_data = []  
        context[config.salary_category_data] = salary_category_data #Loading salary category Data
        
        cur.execute(q.fetch_hcms_query(config.payroll_management,config.salary_calculation_type));
        salary_calculation_data = q.dictfetchall(cur)  
        if salary_calculation_data:
            salary_calculation_data = salary_calculation_data
        else:
            salary_calculation_data = []  
        context[config.salary_calculation_data] = salary_calculation_data #Loading salary calculation Data
        
        cur.execute(q.fetch_hcms_query(config.payroll_management,config.salary_component_type));
        salary_component_data = q.dictfetchall(cur)  
        if salary_component_data:
            salary_component_data = salary_component_data
        else:
            salary_component_data = []  
        context[config.salary_component_data] = salary_component_data #Loading salary component Data
        
        cur.execute(q.fetch_hcms_query(config.payroll_management,config.contribute_register_select));
        contribute_register_data = q.dictfetchall(cur)  
        if contribute_register_data:
            contribute_register_data = contribute_register_data
        else:
            contribute_register_data = []  
        context[config.contribute_register_value] = contribute_register_data #Loading salary component Data
        
        return self.render_to_response(context)
    
    
@csrf_exempt
def HRMSCreateSalaryRule(request): # employee details create function
    ''' 
    26-May-2018 VJY To HRMS Create Salary Rule function. 
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: VJY
    '''
    try:
        logger_obj.info('salary rule data insert by'+str(request.user.username))
        cur = connection.cursor()
        json_data = {}
        data_value = request.POST.get(config.datas) 
        delete_id = request.POST.get(config.delete_id)  
        salary_rule_id = request.POST.get(config.table_id) 
        created_date = format(datetime.datetime.now().strftime ("%Y-%m-%d"))
        modified_date = format(datetime.datetime.now().strftime ("%Y-%m-%d"))
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
            status = SalaryRule(salary_rule_name = data['salary_rule_data'][0]['salary_rule_name'], salary_rule_code = data['salary_rule_data'][0]['salary_rule_code'] , 
                                  salary_rule_category_id_id = data['salary_rule_data'][0]['salary_rule_category'],is_active = "True",created_by_id=uid)
            status.save()
            json_data[config.status_id] = status.id
            json_data[config.status_key] = config.success_status
            cur.execute("""insert into payroll_activity_log (user_name,user_id,field_name,form_name,status,created_date,created_by_id,is_active) 
                            values(%s,%s,%s,%s,%s,%s,%s,%s)""",(user_name,uid,data['salary_rule_data'][0]['salary_rule_name'],'Salary Rule','create',created_date,uid,'true'))
            if status.id:
                salary_rule_id = status.id
                for i in data['hr_salary_rule_conditions']:
                    status = SalaryRule_Conditions(salary_rule_validation = i['salary_rule_validation'],salary_rule_validation_code = i['salary_rule_validation_code'],
                                    salary_rule_value_assignment_code = i['salary_rule_value_assignment_code'],
                                      salary_rule_value_assignment = i['salary_rule_value_assignment'],contribution_id_id = i['contribution_id_id'],
                                      salary_rule_calculation_type_id_id = i['salary_rule_calculation_type_id_id'],salary_rule_id_id = salary_rule_id,is_active = "True")
                    status.save()
        else:
            #referred_record = record_validation('hr_salary_rule', delete_id)
           # print"===============referred_record===referred_record",referred_record
            if delete_id:
                #status =  SalaryRule_Conditions.objects.filter(salary_rule_id_id=delete_id).update(is_active="False")
                #status =  SalaryRule.objects.filter(id=delete_id).update(is_active="False")
                cur.execute("UPDATE hr_salary_rule_conditions set is_active=False where salary_rule_id_id = %s",(delete_id,))
                cur.execute("update hr_salary_rule set is_active=False,salary_rule_code='' where id = %s",(delete_id,))
                cur.execute("update hr_salary_structure_rule set is_active=False where salary_rule_id_id = %s",(delete_id,))
                json_data[config.status_key] = config.remove_status
                cur.execute("""select salary_rule_name from hr_salary_rule where id = %s""",(delete_id,))
                delete_name = q.dictfetchall(cur)
                if delete_name:
                    name_data =  delete_name[0]['salary_rule_name']
                else:
                    name_data = ''
                cur.execute("""insert into payroll_activity_log (user_name,user_id,field_name,form_name,status,modified_date,modified_by_id,is_active) 
                            values(%s,%s,%s,%s,%s,%s,%s,%s)""",(user_name,uid,name_data,'Salary Rule','delete',created_date,uid,'true'))
            #else:
                #json_data[config.status_key] = config.record_already_referred                          
    except Exception as e:
            logger_obj.error(e)
            json_data[config.status_key] = e
    return HttpResponse(json.dumps(json_data))

@csrf_exempt
def HRMSSalaryRuleRegTblDispaly(request):
    if request.method == config.request_post:
        cur = connection.cursor()
        cur.execute(q.fetch_hcms_query(config.payroll_management,config.salary_rule_table_data))
        table_data = q.dictfetchall(cur)
    return HttpResponse(json.dumps(table_data)) 

@csrf_exempt
def HRMSSalaryRuleTblRowClick(request):
    try:
        if request.method == config.request_get:
            cur = connection.cursor()
            row_click_id = int(request.GET[config.id])
            if row_click_id:
                salary_rule_tbl_click = {}
                salary_rule_table_row_click = q.fetch_hcms_query(config.payroll_management,config.salary_rule_table_row_click)
                if salary_rule_table_row_click:
                    cur.execute(salary_rule_table_row_click%(row_click_id)) 
                    salary_rule_tbl_click = q.dictfetchall(cur)
    except Exception as e: 
            salary_rule_tbl_click = e
    return HttpResponse(json.dumps(salary_rule_tbl_click)) 

def SalaryRuleContributionReg(request):
    """
            Function to show display  salary rule contribution register in a table
            @param request:post request
            @return: json data contains all salary rule related informations
            @rtype: json
            @raise e:Unable to fetch salary rule contribution register details or unable to create a database connection 
    """
    try:#try block
        post =  request.POST
        cur = connection.cursor()
        data = json.loads(post.get(config.contribute_id)) #get data from post method
        list_data=[]
        for k in data:
            json_result={}
            salary_rule_contribution_details_record=q.fetch_hcms_query(config.payroll_management,config.salary_rule_contribution_details_record)
            if salary_rule_contribution_details_record:
                cur.execute(salary_rule_contribution_details_record,(k,)) 
                json_result=q.dictfetchall(cur)
                list_data.append(json_result)
    except Exception as e: 
            logger_obj.error(e)
            list_data = e    
    return HttpResponse(json.dumps(list_data)) 

def HRMSSalaryRuleCode(request):
    ''' 
    20-Sep-2018 VJY To HRMS Create Contribution Register Code function. 
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: VJY
    '''
    try:
        json_data = {}
        logger_obj.info("Salary Rule Code Generate function")
        cur = connection.cursor()
        cur.execute("select salary_rule_code from hr_salary_rule   order by id desc limit 1")
        code_data = q.dictfetchall(cur)
        if code_data:
            code_val = code_data[0]['salary_rule_code']
            code_letter = code_val[:2]
            code_digit = code_val[-3:]
            code = str(int(code_digit) + 1 )
            code_length = len(code)
            if code_length < 3: 
                code = "0" * (3 - code_length) + code
                salary_code = (code_letter + code)
                json_data['reg_code'] = salary_code
        else:
            json_data['reg_code'] = 'SR001'   
    except Exception as e:
        logger_obj.error(e) 
        json_data['reg_code'] = e
    return HttpResponse(json.dumps(json_data))

def HRMSSalaryRuleDeleteCheck(request):
    json_data = {}
    post =  request.POST
    cur = connection.cursor()
    data = json.loads(post.get('delete_id')) #get data from post method
    if data:
        cur.execute("""select id from hr_salary_structure_rule  where salary_rule_id_id = %s """,(data,))
        delete_data = q.dictfetchall(cur)
        if delete_data:
            json_data['exist'] = 'exist'
        else:
            json_data['non-exist'] = 'no_data'   
    return HttpResponse(json.dumps(json_data))     

#salary rule Code Selection  
@csrf_exempt    
def hr_salary_code_selection(request):
 
    result={}
    try:#Try Block
        post = request.POST
        if post.get('code'):
            code = post.get('code')#Get the Table Id
        else:
            code=''
        cr=connection.cursor()
        if cr:
            if code:
                cr.execute("""SELECT id,salary_rule_code from hr_salary_rule where salary_rule_code=%s""",(code,)) 
                result_data=q.dictfetchall(cr)
                if result_data:
                   result['status']=1
                else:
                    result['status']=0
        else:
            result[config.status] = config.unable_to_create_connection_message
    except Exception as e:#Exception Block
        logger_obj.error(e)
        result['status'] = e
    return HttpResponse(json.dumps(result))#Return the Response   
 