# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.shortcuts import render

import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.http.response import HttpResponse
from CommonLib import query
from django.db import connection
from CommonLib import query as q
from HRMS_Foundation.payroll_management.models import SalaryContract
from django_countries import countries
import config
import datetime
from psycopg2.extras import DateTimeRange
from django.utils.dateparse import parse_date
from CommonLib.hcms_common import refitem_fetch
from CommonLib.hcms_common import menu_access_control
import HCMS.settings as setting
#template render html
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from CommonLib.hcms_common import record_validation 
from ekm.client import ekm_process
import logging
import logging.handlers
logger_obj = logging.getLogger('logit')

class HRMSSalaryContract(TemplateView):
    ''' 
        17-May-2018 VIJ To HR Payroll salary rule page loaded. And also check the user authentication
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
        @author: VIJ
    '''
    
    #template_name = "hrms_foundation/payroll_management/salary_contract.html"  
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HRMSSalaryContract, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Organization', self.request.user.id)
        if macl:
            template_name = "hrms_foundation/payroll_management/salary_contract.html"  
        else:
            template_name = "tags/access_denied.html"
        return [template_name]
    
    def get(self, request, *args, **kwargs):
        context = super(HRMSSalaryContract, self).get_context_data(**kwargs)
        cur = connection.cursor() 
        cur.execute(q.fetch_hcms_query(config.payroll_management, config.hrms_select_organization_info));
        organization_data = q.dictfetchall(cur)  
        if organization_data:
            organization_data = organization_data
        else:
            organization_data = []  
        context[config.organization_info] = organization_data #Loading Organization Unit Data
        
        cur.execute(q.fetch_hcms_query(config.payroll_management, config.hrms_select_organization_unit_info));
        organization_unit_data = q.dictfetchall(cur)  
        if organization_unit_data:
            organization_unit_data = organization_unit_data
        else:
            organization_unit_data = []  
        context[config.organization_unit_info] = organization_unit_data #Loading Organization Data
        
        cur.execute(q.fetch_hcms_query(config.payroll_management, config.hrms_select_team_info));
        team_data = q.dictfetchall(cur)  
        if team_data:
            team_data = team_data
        else:
            team_data = []  
        context[config.team_info] = team_data #Loading Organization Data
        
        cur.execute(q.fetch_hcms_query(config.payroll_management, config.hrms_select_employee_info));
        employee_data = q.dictfetchall(cur)  
        if employee_data:
            employee_data = employee_data
        else:
            employee_data = []  
        context[config.employee_info] = employee_data #Loading Employee Data  
        
        cur.execute(q.fetch_hcms_query(config.payroll_management, config.salary_contract_type_select));
        contract_type_data = q.dictfetchall(cur)  
        if contract_type_data:
            contract_type_data = contract_type_data
        else:
            contract_type_data = []  
        context[config.contract_type_info] = contract_type_data #Loading Contract Type Data 
        
        cur.execute(q.fetch_hcms_query(config.payroll_management, config.salary_structure_name_selection_data_record));
        structure_name_data = q.dictfetchall(cur)  
        if structure_name_data:
            structure_name_data = structure_name_data
        else:
            structure_name_data = []  
        context[config.structure_name_info] = structure_name_data #Loading salary structure Data 
        
        cur.execute(q.fetch_hcms_query(config.payroll_management, config.salary_currency_type_select));
        currency_type_data = q.dictfetchall(cur)  
        if currency_type_data:
            currency_type_data = currency_type_data
        else:
            currency_type_data = []  
        context[config.currency_type_info] = currency_type_data #Loading Contract Type Data  
        
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
        
        cur.execute(q.fetch_hcms_query(config.payroll_management,config.salary_periodicity_select));
        periodicity_data = q.dictfetchall(cur)  
        if periodicity_data:
            periodicity_data = periodicity_data
        else:
            periodicity_data = []  
        context[config.periodicity_data] = periodicity_data #Loading salary component Data
        
        return self.render_to_response(context)
    
#Org unit structure data get function here
def ContractOrgUnitChangeData(request):
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
def ContractDepartmentChangeData(request):
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
def ContractEmployeeChangeData(request):
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

def common_encrypt(data):
    try:
        logger_obj.info("EkM process for CTC Amount in Salary Contract")
        ekm_data_list = {}
        base_amount = data['salary_contract_data'][0]['base_amount']
        #ekm_data_list.update({"base_amount":data['salary_contract_data'][0]['base_amount']})
        #EKM// ekm_list_value = ekm_process('fb4a04a8b086e06c168d9c1d1fbd9aa9','string',base_amount,'encrypt')
	ekm_list_value = base_amount
        if ekm_list_value == 'None':
            data['salary_contract_data'][0]['base_amount'] = ''
        else: 
            data['salary_contract_data'][0]['base_amount'] = ekm_list_value
    except Exception as e:
        logger_obj.error(e)        
    #ekm_data = ekm_process('73b3b0367648ef80ea808d7817dd2781','string',ekm_list_value,'decrypt')
@csrf_exempt
def HRMSCreateSalaryContract(request): # employee details create function
        ''' 
        26-May-2018 VJY To HRMS Create Salary Contract function. 
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
        @author: VJY
        '''
    #try:
        logger_obj.info('Salary Contract details data insert by'+str(request.user.username))
        cur = connection.cursor() 
        json_data = {}
        post = request.POST
        data_value = request.POST.get(config.datas)   
        contract_tbl_id = request.POST.get(config.table_id) 
        delete_id = request.POST.get(config.delete_id)
        created_date = format(datetime.datetime.now().strftime ("%Y-%m-%d"))
        modified_date = format(datetime.datetime.now().strftime ("%Y-%m-%d"))
        if data_value:
            individual_benefit_data_value = request.POST.get("individual_benefit_data")
            employee_list_data = request.POST.get("employee_id_list")
            create_benefit_data = json.loads(individual_benefit_data_value)
            employee_list_value = json.loads(employee_list_data)
            activity_log_data = json.loads(request.POST.get('log_data'))
            if create_benefit_data:
                if len(create_benefit_data) > 0:
                    individual_benefit_data = create_benefit_data
                    insert_data = individual_benefit_data["hr_individual_employee_benefit"]
                else:
                    insert_data = ''
            else:   
                insert_data = ''     
            individual_benefit_update_data_value = post.get("individual_benefit_update_data")
            if individual_benefit_update_data_value:
                if individual_benefit_update_data_value != 'false' :
                    update_benefit_data = json.loads(individual_benefit_update_data_value)
                    individual_benefit_update_data = update_benefit_data
                    update_data = individual_benefit_update_data["hr_individual_employee_benefit"] 
                else:
                        update_data = ''   
            else:
                update_data = ''            
            individual_benft_del_data_list = post.get("individual_benft_del_data_list") 
            if individual_benft_del_data_list:
                if len(individual_benft_del_data_list) > 0:
                    delete_benefit_data = json.loads(individual_benft_del_data_list) 
                    individual_benefit_delete_data = delete_benefit_data  
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
                common_encrypt(data)
                if contract_tbl_id == '0': 
                    if employee_list_value:
                        for v in employee_list_value:
                            cur.execute("""select employee_id_id from hr_salary_contract where is_active and employee_id_id = %s and (contract_effective_from_date, contract_effective_to_date) OVERLAPS 
                              (%s, %s)""",(v,data['salary_contract_data'][0]['contract_effective_from_date'],data['salary_contract_data'][0]['contract_effective_to_date'],))
                            employee_res = cur.fetchall()
                            if employee_res:
                                json_data[config.status_key] = "Already Exist"
                            else:    
                                status = SalaryContract(company_id_id = data['salary_contract_data'][0]['company_id_id'],org_unit_id_id = data['salary_contract_data'][0]['organization_unit_id_id'], department_id_id = data['salary_contract_data'][0]['department_id_id'],
                                                    employee_id_id = v, contract_type_id_id = data['salary_contract_data'][0]['contract_type_id_id'],
                                                    job_title = data['salary_contract_data'][0]['job_title'],salary_structure_id_id = data['salary_contract_data'][0]['salary_structure_id_id'],base_amount = data['salary_contract_data'][0]['base_amount'],base_currency_id = data['salary_contract_data'][0]['base_currency_id']
                                                    ,contract_effective_from_date = data['salary_contract_data'][0]['contract_effective_from_date'],contract_effective_to_date = data['salary_contract_data'][0]['contract_effective_to_date'],is_active="True",created_by_id=uid)
                                status.save()
                                json_data[config.status_id] = status.id
                                if status.id:
                                    if insert_data :
                                        for v in insert_data:
                                            cur.execute("""insert into hr_individual_employee_benefit(benefit_name,validation,validation_code,value_assignment,value_assignment_code,calculation_type_id_id,periodicity_id,is_active,activate,benefit_effective_from_date,salary_rule_category_id,salary_contract_id_id,benefit_effective_to_date) values(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) """,(v['benefit_name'],v['validation'],v['validation_code'],v['value_assignment'],v['value_assignment_code'],v['calculation_type_id_id'],v['periodicity_id'],v['is_active'],v['activate'],v['effective_date'],v['salary_rule_category_id'],status.id,v['benefit_effective_to_date'],))
                                json_data[config.status_key] = config.success_status
                                cur.execute("select structure_name from hr_salary_structure where id = %s",(data['salary_contract_data'][0]['salary_structure_id_id'],)) 
                                structure_data = q.dictfetchall(cur)
                                if structure_data:
                                      structure_name =  structure_data[0]['structure_name']
                                else:
                                    structure_name = ''
                                cur.execute("""insert into payroll_activity_log (user_name,user_id,field_name,form_name,status,created_date,created_by_id,is_active) 
                            values(%s,%s,%s,%s,%s,%s,%s,%s)""",(user_name,uid,structure_name,'Salary Contract','create',created_date,uid,'true'))
                        
                else:
                    status = SalaryContract.objects.filter(id=contract_tbl_id).update(company_id_id = data['salary_contract_data'][0]['company_id_id'],org_unit_id_id = data['salary_contract_data'][0]['organization_unit_id_id'], department_id_id = data['salary_contract_data'][0]['department_id_id'],
                                                                                   employee_id_id = data['salary_contract_data'][0]['employee_id_id'], contract_type_id_id = data['salary_contract_data'][0]['contract_type_id_id'],
                                                  job_title = data['salary_contract_data'][0]['job_title'],salary_structure_id_id = data['salary_contract_data'][0]['salary_structure_id_id'],base_amount = data['salary_contract_data'][0]['base_amount'],base_currency_id = data['salary_contract_data'][0]['base_currency_id']
                                                  ,contract_effective_from_date = data['salary_contract_data'][0]['contract_effective_from_date'],contract_effective_to_date = data['salary_contract_data'][0]['contract_effective_to_date'],is_active="True",modified_by_id=uid)
                    if contract_tbl_id:    
                        if update_data:                
                            for v in update_data:    
                                if int(v['table_id']) == 0:
                                    cur.execute("""insert into hr_individual_employee_benefit(benefit_name,validation,validation_code,value_assignment,value_assignment_code,calculation_type_id_id,periodicity_id,is_active,activate,benefit_effective_from_date,salary_rule_category_id,salary_contract_id_id,benefit_effective_to_date) values(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) """,(v['benefit_name'],v['validation'],v['validation_code'],v['value_assignment'],v['value_assignment_code'],v['calculation_type_id_id'],v['periodicity_id'],v['is_active'],v['activate'],v['effective_date'],v['salary_rule_category_id'],contract_tbl_id,v['benefit_effective_to_date'],))
                                else:    
                                    cur.execute("""UPDATE hr_individual_employee_benefit set activate=%s,periodicity_id=%s,value_assignment_code=%s,benefit_name=%s,value_assignment=%s,calculation_type_id_id=%s, salary_rule_category_id=%s,validation_code=%s,benefit_effective_from_date=%s,validation=%s,benefit_effective_to_date=%s where id=%s""",(v['activate'],v['periodicity_id'],v['value_assignment_code'],v['benefit_name'],v['value_assignment'],v['calculation_type_id_id'],v['salary_rule_category_id'],v['validation_code'],v['effective_date'],v['validation'],v['benefit_effective_to_date'],v['table_id'],)) 
                            connection.commit()    
                            connection.close()
                    if individual_benefit_delete_data:
                        cur.execute("UPDATE hr_individual_employee_benefit set is_active='false' where id in %s",(tuple(individual_benefit_delete_data),))
                    json_data[config.status_key] = config.update_status  
                    if activity_log_data:
                        for a in activity_log_data:
                            cur.execute("""insert into payroll_activity_log (user_name,user_id,field_name,new_value,old_value,form_name,status,created_date,modified_date,modified_by_id,is_active) 
                            values(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)""",(user_name,uid,a['field_name'],a['new_value'],'','Salary Contract','update',created_date,modified_date,uid,'true'))                                                            
                    logger_obj.info('Salary Contract details update response is'+str(json_data)+"attempted by"+str(request.user.username)) 
        else:
            referred_record = record_validation('hr_salary_contract', delete_id)
            if referred_record == True:
                status =  SalaryContract.objects.filter(id=delete_id).update(is_active="False")
                json_data[config.status_key] = config.remove_status
                cur.execute("""select employee_info.name as employee_name from employee_info  
                inner join hr_salary_contract on hr_salary_contract.employee_id_id = employee_info.id
                where hr_salary_contract.id = %s""",(delete_id,))
                delete_name = q.dictfetchall(cur)
                if delete_name:
                    name_data =  delete_name[0]['employee_name']
                else:
                    name_data = ''
                cur.execute("""insert into payroll_activity_log (user_name,user_id,field_name,form_name,status,modified_date,modified_by_id,is_active) 
                            values(%s,%s,%s,%s,%s,%s,%s,%s)""",(user_name,uid,name_data,'Salary Contract','delete',created_date,uid,'true'))
            elif referred_record == False:
                json_data[config.status_key] = config.record_already_referred                          
#     except Exception as e:
#             logger_obj.error(e)
#             json_data[config.status_key] = e
        return HttpResponse(json.dumps(json_data))   

@csrf_exempt
def HRMSSalaryContractTblDispaly(request):
    try:
        json_data = {}
        if request.method == config.request_post:
            cur = connection.cursor() 
            cur.execute(q.fetch_hcms_query(config.payroll_management,config.salary_contract_table_view))
            table_data = q.dictfetchall(cur)
            if table_data:
                for i in table_data:
		    ekm_data = i['base_amount']
                    #EKM// ekm_data = ekm_process('fb4a04a8b086e06c168d9c1d1fbd9aa9','string',i['base_amount'],'decrypt')
                    #logger_obj.info("After EKM"+ekm_data)
                    i['base_amount'] =  ekm_data
    except Exception as e:
            logger_obj.error("Inside Table Display",+str(e));
            json_data[config.status_key] = e 
    return HttpResponse(json.dumps(table_data))  

@csrf_exempt
def HRMSSalaryContractTblRowClick(request):
    try:
        if request.method == config.request_get:
            cur = connection.cursor() 
            row_click_id = int(request.GET[config.id])
            if row_click_id:
                salary_contract_tbl_click = {}
                salary_contract_table_row_click = q.fetch_hcms_query(config.payroll_management,config.salary_contract_table_row_click)
                if salary_contract_table_row_click:
                    cur.execute(salary_contract_table_row_click%(row_click_id)) 
                    salary_contract_tbl_click['datas'] = q.dictfetchall(cur)
                    #print"**********************************",salary_contract_tbl_click
                    if salary_contract_tbl_click:
                        #ekm_data = ekm_process('fb4a04a8b086e06c168d9c1d1fbd9aa9','string',salary_contract_tbl_click['datas'][0]['base_amount'],'decrypt')
			ekm_data = salary_contract_tbl_click['datas'][0]['base_amount']
                        #print"$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$",ekm_data
                        salary_contract_tbl_click['datas'][0]['base_amount'] = ekm_data
    except Exception as e: 
            salary_contract_tbl_click['datas'] = e
            #print"eeeeeeeeeeeeeeeeeeeeee",e
    return HttpResponse(json.dumps(salary_contract_tbl_click))     

@csrf_exempt 
def EffectivePastDateValidation(request):
    try:
        if request.method==config.request_post:
            cur = connection.cursor() 
            active_status = {}
            post = request.POST #get post data from request
            effective_past_date = str(post.get(config.effective_past_date))
            current_date = datetime.datetime.now().date()
            if effective_past_date != 'None':
                date = datetime.datetime.strptime(effective_past_date, '%d-%m-%Y').strftime('%Y-%m-%d')
                compare_date = datetime.datetime.strptime(date,'%Y-%m-%d').date()
                if current_date > compare_date:
                    active_status[config.data_result] = config.success_date
                else:
                    active_status[config.data_result] = config.failure_date
    except Exception as e: 
            logger_obj.error(e)
            active_status[config.data_result] = e
    return HttpResponse(json.dumps(active_status))    

@csrf_exempt 
def HCMSSalaryRating(request):
    ''' 
        18-Oct-2018 VJY To HCMS performance rating function. 
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
        @author: VIJ
    '''
    cur = connection.cursor() 
    post = request.POST #get post data from request
    from_date = str(post.get('from_date'))
    to_date = str(post.get('to_date'))
    employee_id = post.get('employee_id')
    result_data = {}
    if from_date and to_date and employee_id:
        effective_from_date = datetime.datetime.strptime(from_date, '%d-%m-%Y').strftime('%Y-%m')
        effective_to_date = datetime.datetime.strptime(to_date, '%d-%m-%Y').strftime('%Y-%m')
        cur.execute("""select opr as overall_rating,user_id from hr_performance_rating_year_details hrprd
        inner join employee_info emp on emp.related_user_id_id = hrprd.user_id
        where emp.id = %s and emp.is_active and hrprd.yyyy_mm = %s  """,(employee_id,effective_from_date,))
        performance_data = q.dictfetchall(cur)
        if performance_data:
            overall_rating_val = performance_data[0]['overall_rating']
            cur.execute("select minimum_range,fixed_return from rating_point where is_active order by id ")
            range_data = q.dictfetchall(cur)  
            if range_data:
                for i in range_data:
                    if float(overall_rating_val) >= float(i['minimum_range']) :
                        result_data['fixed_return'] = i['fixed_return']
                        break 
                    else:
                        print"elseeeeeeeeeee"
            else:
                result_data['no_data'] = 'NTE-001'  
        else:
            result_data['no_performance_data'] = 'NTE-002'     
    return HttpResponse(json.dumps(result_data)) 
      
# def LogInfo(request):    
#     log_query = """
#             select to_char(created_date+ interval '330' minute,'dd-mm-yyyy hh:mi:ss') as created_date,
#             to_char(modified_date+ interval '330' minute,'dd-mm-yyyy hh:mi:ss') as modified_date,
#             (case when (is_active is true ) then 'Active' else 'In Active' end) as status,
#             (select username from auth_user where id = created_by_id) as createdby_username,
#             coalesce((select username from auth_user where id = modified_by_id),'') as modify_username,
#             to_char(created_date::timestamptz - interval '330' minute,'dd-mm-yyyy hh12:mi:ss') as created_datatime,
#             coalesce(first_name,'')||' '||coalesce(last_name,'') as title from hr_salary_contract order by created_datatime desc
#                 """
#     cur.execute(log_query)   
#     log_details = q.dictfetchall(cur)    
#     json_data['log_details'] = log_details           
                       
