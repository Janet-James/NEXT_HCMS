# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.shortcuts import render

import xlwt
import json
import datetime
import calendar
from time import strptime
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.http.response import HttpResponse
from CommonLib import query
from django.db import connection
from CommonLib import query as q
from HRMS_Foundation.payroll_management.models import PayslipReport
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
import inflect
v = inflect.engine()
logger_obj = logging.getLogger('logit')

class HRMSPayslipReportGeneration(TemplateView):
    ''' 
        06-July-2018 VIJ To HR Payroll Payslip page loaded. And also check the user authentication
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
        @author: VIJ
    '''
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HRMSPayslipReportGeneration, self).dispatch(request, *args, **kwargs)

    def get_template_names(self):
        macl = menu_access_control('Employee Report', self.request.user.id)
        if macl:
            template_name = "hrms_foundation/payroll_management/payslip_report_generation.html"
        else:
            template_name = "tags/access_denied.html"
        return [template_name]
    
    def get(self, request, *args, **kwargs):
        context = super(HRMSPayslipReportGeneration, self).get_context_data(**kwargs)
        cur = connection.cursor() 
        cur.execute(q.fetch_hcms_query(config.payroll_management, config.hrms_select_organization_info));
        organization_data = q.dictfetchall(cur)  
        if organization_data:
            organization_data = organization_data
        else:
            organization_data = []  
        context[config.organization_info] = organization_data #Loading Organization Data
        cur.execute("""select DISTINCT emp.name as employee_name,emp.id from employee_info  emp
            inner join hr_salary_contract hrsc on hrsc.employee_id_id = emp.id
            where hrsc.is_active""")
        employee_data = q.dictfetchall(cur)  
        if employee_data:
            employee_data = employee_data
        else:
            employee_data = []  
        context['employee_val'] = employee_data #Loading Employee Data
        return self.render_to_response(context)
    
    
#Org unit structure data get function here
def hrmsOrgtUnitSructureData(request):
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
def hrmsDepartmentSructureData(request):
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
def hrmsEmployeeSructureData(request):
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

def hrmsPayslipReportData(request):
    ''' 
    6-July-2018 VJY To HRMS Org unit structure data loaded
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: VJY
    '''
    json_data = {}
    try:
        logger_obj.info('Payslip Report Table function by'+str(request.user.username))
        cur = connection.cursor()  #create the database connection
        post = request.GET
        emp_id = post.get(config.employee_id)  
        depart_id = post.get(config.department_id)  
        org_id = post.get(config.org_id) 
        org_unit_id = post.get(config.org_unit_id)  #get table key 
        from_date = post.get(config.from_date)  
        to_date = post.get(config.to_date)
        status = post.get(config.status_key)
        employee_ids = json.loads(emp_id)
        employee_list = [str(r) for r in employee_ids]
        if org_id:
             query = q.fetch_hcms_query(config.payroll_management, config.hrms_org_employee_list)
             conditions = " empinfo.is_active  and"
             if emp_id != '':
                 if len(employee_list) == 1:
                     conditions = conditions+" empinfo.id = "+str(employee_ids[0])+" and"
                 else:  
                     if len(employee_list)  :   
                         conditions = conditions+" empinfo.id in "+str(tuple(employee_list))+" and"
             if depart_id != '':
                 conditions = conditions+" teaminfo.id in ('"+str(depart_id)+"') and"
             if org_unit_id != '':
                 conditions = conditions+" org_unit_info.id in ('"+str(org_unit_id)+"') and"
                 #conditions = conditions+" and"
             if from_date != '':
                 conditions = conditions+" hrplp.accountingperiod_from ::date >= ('"+str(from_date)+"') and"
             if to_date != '':
                 conditions = conditions+" hrplp.accountingperiod_to ::date <= ('"+str(to_date)+"') and"
             conditions = conditions.rsplit(' ', 1)[0]
             conditions =   conditions+ " and orginfo.id = %s"%int(org_id) 
             if cur and query and conditions and not status :
                 querys = (query+str(conditions+" order by empinfo.name")) 
                 cur.execute(querys)
                 values = cur.fetchall()
                 if values:
                     json_data[config.org_employee_data] = values
                 else:
                     json_data[config.org_employee_data] = []
                     json_data['payslip_report_data'] = []
             else:
                querys = (query+str(conditions+" order by empinfo.name")) 
                cur.execute(querys)
                dict_value = q.dictfetchall(cur)  
                if dict_value:
                    payslip_report_data = excel_generate(request,dict_value)   
                    json_data['payslip_report_data'] = payslip_report_data
    except Exception as e:
        logger_obj.error(e)
        json_data[config.org_employee_data] = []
    return HttpResponse(json.dumps(json_data))
@csrf_exempt 
def PayslipReportPopUpData(request):
#             try:#Try Block
   cr = connection.cursor()
   if cr: 
       logger_obj.info('Payslip Report search function by'+str(request.user.username))
       post = request.GET
       emp_id = post.get(config.employee_id)  
       payslip_id_data = post.get('payslip_id') 
       result_data = calculation_data(emp_id,payslip_id_data)
#             except Exception as e:#Exception Block
#                 result_data = e
       return HttpResponse(json.dumps(result_data))  # Return the Response
             
def excel_generate(request,dict_value):
    cr = connection.cursor()
    report_date = datetime.datetime.now()
    file_date = report_date.strftime("%Y-%m-%d %H:%m:%S.%f")[:-3]
    uid = request.user.id
    if not uid:
        uid = 1
    list_value = []
    book = xlwt.Workbook()
    sh = book.add_sheet('sheet')
    #sh.title = "Locations"
    style = xlwt.XFStyle()
# font
    font = xlwt.Font()
    font.bold = True
    style.font = font
    n=0
    special_amt = 0.0
    tot_earning = 0.0
    net_salary = 0.0
    tot_deduction = 0.0 
    line = 1
    
    sh.write(0, 0, 'Employee Name',style=style)
    sh.write(0, 1, 'Department',style=style)
    sh.write(0, 2, 'Designation',style=style)
    sh.write(0, 3, 'Employee Id',style=style)
    sh.write(0, 4, 'Date of Joining',style=style)
    sh.write(0, 5, 'PF No',style=style)
    sh.write(0, 6, 'Total Worked Days',style=style)
    sh.write(0, 7, 'Lop Days',style=style)
    sh.write(0, 8, 'Effective Work Days',style=style)
    sh.write(0, 9,'Basic',style=style)
    sh.write(0, 10,'Conveyance',style=style)
    sh.write(0, 11,'HRA',style=style)
    sh.write(0, 12,'Leave Travel Allowance',style=style)
    sh.write(0, 13,'Payment',style=style)
    sh.write(0, 14,'Meal Card',style=style)
    sh.write(0, 15,'Medical Allowance',style=style)
    sh.write(0, 16,'Telephone Allowance',style=style)
    sh.write(0, 17,'Special Allowance',style=style)
    sh.write(0, 18, 'TOTAL EARNINGS',style=style)
    sh.write(0, 19,'Professional Tax',style=style)
    sh.write(0, 20,'Provident Fund',style=style)
    sh.write(0, 21, 'ESI',style=style)
    sh.write(0, 22, 'TOTAL DEDUCTION',style=style)
    sh.write(0, 23, 'NET SALARY',style=style)
    #sh.write(0, 24, 'TOTAL',style=style)
    for i in dict_value:
        emp_id = i['employee_id']
        payslip_id_data = i['payslip_id']
        report_result_data = calculation_data(emp_id,payslip_id_data)
        list_value.append(report_result_data)
    earning_list = ['Basic','Payment','Conveyance','Meal Card','Medical Allowance','Telephone Allowance','Leave Travel Allowance','HRA']
    deduction_list = ['Professional Tax','Provident Fund Employee Contribution','ESI Employee Contribution']
    for j in list_value:
        if j['exp_details']:
            for k in j['exp_details']:
                earning_value = 0.0
                deduction_val = 0.0
                for l in k['employee_data_val']:
                    sh.write(n+line, 0, l['employee_name'])
                    sh.write(n+line, 1, l['department_name'])
                    sh.write(n+line, 2, l['designation'])
                    sh.write(n+line, 3, l['matrix_id'])
                    sh.write(n+line, 4, l['date_of_joining'])
                    sh.write(n+line, 5, l['provident_fund_no'])
                    sh.write(n+line, 6, l['worked_days'])
                    sh.write(n+line, 7, l['lop_days'])
                    sh.write(n+line, 8, l['worked_days'])
                if k['emp_actual_earning_list']:
                    for z,m in enumerate(earning_list):
                        value_match = 0;
                        for o in k['emp_actual_earning_list']:
                             if o['salary_rule_name'] == m:
                                 value_match = 1
                                 sh.write(n+line,9+z,o['assignment_value'])
                                 earning_value += o['assignment_value']
                                 #print"=========name",o['salary_rule_name']
                                 #print"**************",o['assignment_value']
                                 break;
                        if not value_match:
                            sh.write(n+line,9+z,0)
                if k['special_allowance']:
                    sh.write(n+line,17, k['special_allowance'])
                    special_amt = float(k['special_allowance'])
                tot_earning = earning_value + special_amt    
                sh.write(n+line,18,tot_earning,style=style)
                if k['emp_actual_deduction_list']:
                    for x,y in enumerate(deduction_list):
                        dect_match = 0;
                        for p in k['emp_actual_deduction_list']:
                             if p['salary_rule_name'] == y:
                                 dect_match = 1
                                 sh.write(n+line,19+x,p['assignment_value'])
                                 deduction_val += p['assignment_value']
                                 break;
                        if not dect_match:
                            sh.write(n+line,19+x,0)
                tot_deduction =  deduction_val       
                sh.write(n+line,22,tot_deduction,style=style)       
                net_salary = tot_earning - tot_deduction
                amount_words = v.number_to_words(int(net_salary))
                netsalary_letter = amount_words.title()
                net_salary_string = str(netsalary_letter) + ' only'
                sh.write(n+line, 23,net_salary ,style=style)
                #sh.write(n+line, 24,net_salary ,style=style)
                #sh.write(n+line, 24,net_salary_string ,style=style)              
                n=n+1
    #sh.write(n+line+1, 0, 'TOTAL',style=style)    
    status = PayslipReport(file_name = "Payslip_report"+"_"+file_date, file_path = setting.MEDIA_ROOT+"payslip/",file_type = 'xls', 
                     file_full_path = setting.MEDIA_ROOT+'payslip/'+"Payslip_report"+"_"+file_date+".xls",created_by_id=uid, modified_by_id=uid)
    status.save()
    book.save(setting.MEDIA_ROOT+'payslip/'+"Payslip_report"+"_"+file_date+".xls")
    #book.save("/home/next/payslip/"+"Payslip_report"+"_"+file_date+".xls")
    #book.save("/home/next/demo_record.xls")
    cr.execute("select file_name,file_full_path from hr_payslip_report where id = %s",(status.id,));
    report_data = q.dictfetchall(cr)
    return report_data
   # return HttpResponse(json.dumps(json_data))
   
    
def calculation_data(emp_id,payslip_id_data):
    cr = connection.cursor()
    result_data = {}
    print_data = []
    ctc_amount = ''
    worked_ctc_amount = ''
    basic_amount_value = ''
    value_total_fixed_earning_amount = 0
    allowance_value = 0
    earned_special_allowance = 0
    if emp_id:
            query = q.fetch_hcms_query(config.payroll_management, config.hrms_employee_modal_list)
            cr.execute(query,(int(emp_id),));
            values = q.dictfetchall(cr)
            if values:
                payslip_employee_id = values[0]['emp_id']
                payslip_id_query = q.fetch_hcms_query(config.payroll_management, config.select_payslip_id)
                cr.execute(payslip_id_query,(int(payslip_employee_id),int(payslip_id_data),));
                payslip_values = cr.fetchall()
                if payslip_values:
                   # For CTC Amount Calculation Based on the Worked Days
                   # Query For Basic Amount Based on the Employeee From Salary Structure
                   select_payslip_data_record = q.fetch_hcms_query(config.payroll_management, config.select_payslip_data)
                   if select_payslip_data_record:
                            cr.execute(select_payslip_data_record, (tuple(payslip_values),))
                            employee_data = q.dictfetchall(cr)
                            if employee_data:
                               for i in employee_data:
                                   final_data = {}
                                   final_data_value = {}
                                   employee_id = i['employee_id_id']
                                   structure_id = i['salary_structure_id_id']
                                   period_from = i['accountingperiod_from']  # Get the Table Id
                                   period_to = i['accountingperiod_to']
                                   payslip_table_id = i['id']
                                   if period_from:
                                       start_date = datetime.date(datetime.datetime.strptime(period_from, '%m/%d/%Y').year, datetime.datetime.strptime(period_from, '%m/%d/%Y').month, datetime.datetime.strptime(period_from, '%m/%d/%Y').day)
                                   else:
                                       start_date = ''
                                   if period_to:
                                       end_date = datetime.date(datetime.datetime.strptime(period_to, '%m/%d/%Y').year, datetime.datetime.strptime(period_to, '%m/%d/%Y').month, datetime.datetime.strptime(period_to, '%m/%d/%Y').day)
                                   else:
                                       end_date = ''
                                   if start_date and end_date:
                                       total_working_days = end_date - start_date
                                   else:
                                       total_working_days = ''
                                   if total_working_days:
                                       working_days = total_working_days.days + 1
                                   else:
                                       working_days = ''
                                   worked_day = i['worked_days']
                                   
                                   select_payslip_company_details_record = q.fetch_hcms_query(config.payroll_management, config.select_payslip_company_details)
                                   if select_payslip_company_details_record:
                                       cr.execute(select_payslip_company_details_record % (employee_id))
                                       company_data_val = q.dictfetchall(cr)
                                   
                                   select_payslip_details_record = q.fetch_hcms_query(config.payroll_management, config.select_payslip_details)
                                   if select_payslip_details_record:
                                       cr.execute(select_payslip_details_record % (employee_id,payslip_table_id))
                                       employee_data_val = q.dictfetchall(cr)
                                       cr.execute("""select rfitms.refitems_name as bank_name,hrpa.account_no,hrpa.ifsc_code,hrpa.branch_name,
                                                hrcin.name as company_name,hrpa.pf_number,hrcin.address1 as company_address from hr_payment_advices hrpa
                                                inner join organization_info hrcin on hrpa.company_id_id = hrcin.id 
                                                inner join reference_items rfitms on rfitms.id = hrpa.bank_name_id
                                                where hrpa.employee_id_id = %s and hrpa.is_active = 'true' """ % (employee_id))
                                       payment_details = q.dictfetchall(cr)
                                   # employee_name=employee_name[0]['employee_name']
                                   payslip_emp_fixed_monthly_ctc_amount_query = q.fetch_hcms_query(config.payroll_management, config.payslip_emp_fixed_monthly_ctc_amount_query)
                                   if payslip_emp_fixed_monthly_ctc_amount_query:
                                       cr.execute(payslip_emp_fixed_monthly_ctc_amount_query, (employee_id,))
                                       basic_amount = q.dictfetchall(cr)
                                       if basic_amount:
                                           ctc_amount = basic_amount[0]['base_amount']
                                   if ctc_amount and working_days and worked_day:
                                       if working_days > 0:
                                           one_day_salary = ctc_amount / float(working_days)
                                       else:
                                           one_day_salary = 0.00
                                       if worked_day > 0:
                                           worked_ctc_amount = one_day_salary * float(worked_day)
                                       else:
                                           worked_ctc_amount = 0.00
                                   # For Basic Amount Calculation Based on the Salary Structure and Employee 
                                   if structure_id and employee_id:
                                       # Query For Search like Basic and Validation Code
                                       payslip_salary_rule_basic_name_query = q.fetch_hcms_query(config.payroll_management, config.payslip_salary_rule_basic_name)
                                       if payslip_salary_rule_basic_name_query:
                                           ilike_value = '%Basic%'  or '%BASIC%' 
                                           cr.execute(payslip_salary_rule_basic_name_query, (ilike_value, structure_id, employee_id,))
                                           result_basic = q.dictfetchall(cr)
                                           # For Replacing the BASIC Code to as Basic Amount
                                           if result_basic:
                                               for j in result_basic:
                                                   if j['salary_rule_validation_code']:
                                                       basic_validation_con = j['salary_rule_validation_code'].replace("ENCTC", str(worked_ctc_amount))
                                                   else :
                                                       basic_validation_con = j['salary_rule_value_assignment_code'].replace("ENCTC", str(worked_ctc_amount))
                                                   if "%" in basic_validation_con:  # For Find the % in Original String
                                                       basic_validation_con = eval(basic_validation_con.replace("%", "*"))  # For Replacing % as * and Divide By 100
                                                       basic_amount_value = eval(str(int(basic_validation_con) / 100))
                                                   else:  # If % not in String 
                                                       basic_amount_value = eval(basic_validation_con)
                                           else:
                                               basic_amount_value = ''
                                     # For the PF Applicable For payslip
                                   if employee_id:
                                        payslip_pf_applicable_query = q.fetch_hcms_query(config.payroll_management, config.payslip_pf_applicable_query)
                                        if payslip_pf_applicable_query:
                                            cr.execute(payslip_pf_applicable_query, (employee_id,))
                                            pf_applicable_result = q.dictfetchall(cr)
                                   # For Salary Computation Table
                                   if structure_id and employee_id and worked_ctc_amount:
                                       # Query For Getting the Payslip Details Based on the Rule Structure and Contract
                                       payslip_structure_salary_rule = q.fetch_hcms_query(config.payroll_management,config.payslip_structure_salary_rule)
                                       if payslip_structure_salary_rule:
                                           cr.execute(payslip_structure_salary_rule, (structure_id, employee_id,))
                                           result = q.dictfetchall(cr)
                                           list_value = []
                                           list_value_employer = []
                                           for i in result:
                                               val_dic = {}
                                               validation = i['salary_rule_validation_code']
                                               contribution_id = i['contribution_id_id']
                                               condition_id = i['rule_condition_id']
                                               contributor = ''
                                               if contribution_id:
                                                   payslip_contribution_details_query = q.fetch_hcms_query(config.payroll_management, config.payslip_contribution_details_query)
                                                   if payslip_contribution_details_query:
                                                       cr.execute(payslip_contribution_details_query, (contribution_id,))
                                                       result = q.dictfetchall(cr)
                                                       if result[0]['contributor'] == 1:
                                                            contributor = config.Employee
                                                       else:
                                                            contributor = config.Employer
                                               # For the Fixed Amount Calculation Only For the Employee
                                               if contributor != 'Employer':
                                                   if validation:
                                                       # For CTC in Salary Rule Validation Code
                                                       if "MNCTC" in validation:
                                                           validation_condition = validation.replace("MNCTC", str(ctc_amount))
                                                       elif "ENCTC" in validation:
                                                           validation_condition = validation.replace("ENCTC", str(ctc_amount))
                                                       elif "BASIC" in validation:  # IF Basic Salary Rule in Validation Code
                                                           validation_condition = validation.replace("BASIC", str(basic_amount_value))
                                                   # If No validation
                                                   else:
                                                       validation_condition = ''
                                                   # If Validation Condition
                                                   if validation_condition:
                                                       if "%" in validation_condition:  # For Find the % in Original String
                                                           validation_condition = eval(validation_condition.replace("%", "*"))  # For Replacing % as * and Divide By 100
                                                           validation_condition = eval(str(int(validation_condition) / 100))
                                                       else:
                                                           validation_condition = eval(validation_condition)
                                                   if validation_condition:
                                                       if i['cal_type_code'] == "NUMBR":
                                                           val_dic['assignment_value'] = round(float(i['salary_rule_value_assignment']))
                                                       else:
                                                           # Check the Assignment Value 
                                                           if i['salary_rule_value_assignment_code']:
                                                               assignment_value = i['salary_rule_value_assignment_code']
                                                               if assignment_value:
                                                                   # For Replacing the BASIC Code to as Basic Amount
                                                                   # For CTC in Salary Rule Validation Code
                                                                   if "MNCTC" in assignment_value:
                                                                       assignment_value = assignment_value.replace("MNCTC", str(ctc_amount))
                                                                   elif "ENCTC" in assignment_value:
                                                                       assignment_value = assignment_value.replace("ENCTC", str(ctc_amount))
                                                                   elif "BASIC" in assignment_value:  # IF Basic Salary Rule in Validation Code
                                                                       assignment_value = assignment_value.replace("BASIC", str(basic_amount_value))
                                                                   if "%" in assignment_value:  # For Find the % in Original String
                                                                       assignment_value = eval(assignment_value.replace("%", "*"))  # For Replacing % as * and Divide By 100
                                                                       val_dic['assignment_value'] = round(eval(str(float(assignment_value) / 100.0)))
                                                                   else:
                                                                      val_dic['assignment_value'] = round(float(eval(assignment_value)))
                                                               else:
                                                                   val_dic['assignment_value'] = ''
                                                           # Else the Assignment Value not Given
                                                           else:
                                                               val_dic['assignment_value'] = validation_condition
                                                                
                                                       val_dic['refitems_name'] = i['refitems_name']
                                                       if contribution_id:  # For the Employee Contribution Display the Text
                                                           val_dic['salary_rule_name'] = i['salary_rule_name'] + "  Employee Contribution"
                                                       else:
                                                            val_dic['salary_rule_name'] = i['salary_rule_name']
                                                       val_dic['condition_id'] = condition_id
                                                       # If Avoiding Same Value For Allowance and Deduction Details
                                                       count = 0
                                                       for k in list_value:
                                                           if k['salary_rule_name'] == val_dic['salary_rule_name']:
                                                               if k['assignment_value'] > val_dic['assignment_value']:
                                                                   val_dic['assignment_value'] = k['assignment_value']
                                                                   del list_value[count]
                                                               elif k['assignment_value'] < val_dic['assignment_value']:
                                                                   val_dic['assignment_value'] = val_dic['assignment_value']
                                                                   del list_value[count]
                                                               elif k['assignment_value'] == val_dic['assignment_value']:
                                                                   val_dic['assignment_value'] = val_dic['assignment_value']
                                                                   del list_value[count]
                                                           count = count + 1;
                                                       list_value.append(val_dic)
                                                   # If No Validation Only Assignment Value
                                                   elif i['salary_rule_validation_code'] == '':
                                                       if i['cal_type_code'] == "NUMBR":
                                                               val_dic['assignment_value'] = round(float(i['salary_rule_value_assignment']))
                                                       else:
                                                           # Check the Assignment Value 
                                                           if i['salary_rule_value_assignment_code']:
                                                               assignment_value = i['salary_rule_value_assignment_code']
                                                               if assignment_value:
                                                                   # For Replacing the BASIC Code to as Basic Amount
                                                                   # For CTC in Salary Rule Validation Code
                                                                   if "MNCTC" in assignment_value:
                                                                       assignment_value = assignment_value.replace("MNCTC", str(ctc_amount))
                                                                   elif "ENCTC" in assignment_value:
                                                                       assignment_value = assignment_value.replace("ENCTC", str(ctc_amount))
                                                                   elif "BASIC" in assignment_value:  # IF Basic Salary Rule in Validation Code
                                                                       assignment_value = assignment_value.replace("BASIC", str(basic_amount_value))
                                                                   if "%" in assignment_value:  # For Find the % in Original String
                                                                       assignment_value = eval(assignment_value.replace("%", "*"))  # For Replacing % as * and Divide By 100
                                                                       val_dic['assignment_value'] = round(eval(str(float(assignment_value) / 100.0)))
                                                                   else:
                                                                      val_dic['assignment_value'] = round(float(eval(assignment_value)))
                                                               else:
                                                                   val_dic['assignment_value'] = ''
                                                           # Else the Assignment Value not Given
                                                           else:
                                                               val_dic['assignment_value'] = validation_condition
                                                                
                                                       val_dic['refitems_name'] = i['refitems_name']
                                                       val_dic['salary_rule_name'] = i['salary_rule_name']
                                                       val_dic['condition_id'] = condition_id
                                                       # If Avoiding Same Value For Allowance and Deduction Details
                                                       count = 0
                                                       for k in list_value:
                                                           if k['salary_rule_name'] == val_dic['salary_rule_name']:
                                                               if k['assignment_value'] > val_dic['assignment_value']:
                                                                   val_dic['assignment_value'] = k['assignment_value']
                                                                   del list_value[count]
                                                               elif k['assignment_value'] < val_dic['assignment_value']:
                                                                   val_dic['assignment_value'] = val_dic['assignment_value']
                                                                   del list_value[count]
                                                               elif k['assignment_value'] == val_dic['assignment_value']:
                                                                   val_dic['assignment_value'] = val_dic['assignment_value']
                                                                   del list_value[count]
                                                           count = count + 1;
                                                       list_value.append(val_dic)
                                                   else:
                                                        val_dic['refitems_name'] = i['refitems_name']
                                                        if contribution_id:  # For the Employee Contribution Display the Text
                                                               val_dic['salary_rule_name'] = i['salary_rule_name'] + "  Employee Contribution"
                                                        else:
                                                            val_dic['salary_rule_name'] = i['salary_rule_name']
                                                        val_dic['condition_id'] = condition_id
                                                        val_dic['assignment_value'] = 0.00 
                                                        # If Avoiding Same Value For Allowance and Deduction Details
                                                        count = 0
                                                        for k in list_value:
                                                            if k['salary_rule_name'] == val_dic['salary_rule_name']:
                                                                if k['assignment_value'] > val_dic['assignment_value']:
                                                                    val_dic['assignment_value'] = k['assignment_value']
                                                                    del list_value[count]
                                                                elif k['assignment_value'] < val_dic['assignment_value']:
                                                                    val_dic['assignment_value'] = val_dic['assignment_value']
                                                                    del list_value[count]
                                                                elif k['assignment_value'] == val_dic['assignment_value']:
                                                                    val_dic['assignment_value'] = val_dic['assignment_value']
                                                                    del list_value[count]
                                                            count = count + 1;
                                                        list_value.append(val_dic)
                                                
                                               elif contributor != 'Employee':  # For the Employer Condition Checking
                                                    # For the Fixed Amount Calculation Only For the Employer:
                                                    
                                                    if validation:
                                                       # For CTC in Salary Rule Validation Code
                                                       if "MNCTC" in validation:
                                                           validation_condition = validation.replace("MNCTC", str(ctc_amount))
                                                       elif "ENCTC" in validation:
                                                           validation_condition = validation.replace("ENCTC", str(ctc_amount))
                                                       elif "BASIC" in validation:  # IF Basic Salary Rule in Validation Code
                                                           validation_condition = validation.replace("BASIC", str(basic_amount_value))
                                                   # If No validation
                                                    else:
                                                       validation_condition = ''
                                                    # If Validation Condition
                                                    if validation_condition:
                                                       if "%" in validation_condition:  # For Find the % in Original String
                                                           validation_condition = eval(validation_condition.replace("%", "*"))  # For Replacing % as * and Divide By 100
                                                           validation_condition = eval(str(int(validation_condition) / 100))
                                                       else:
                                                           validation_condition = eval(validation_condition)
                                                    if validation_condition:
                                                       if i['cal_type_code'] == "NUMBR":
                                                           val_dic['assignment_value'] = round(float(i['salary_rule_value_assignment']))
                                                       else:
                                                           # Check the Assignment Value 
                                                           if i['salary_rule_value_assignment_code']:
                                                               assignment_value = i['salary_rule_value_assignment_code']
                                                               if assignment_value:
                                                                   # For Replacing the BASIC Code to as Basic Amount
                                                                   # For CTC in Salary Rule Validation Code
                                                                   if "MNCTC" in assignment_value:
                                                                       assignment_value = assignment_value.replace("MNCTC", str(ctc_amount))
                                                                   elif "ENCTC" in assignment_value:
                                                                       assignment_value = assignment_value.replace("ENCTC", str(ctc_amount))
                                                                   elif "BASIC" in assignment_value:  # IF Basic Salary Rule in Validation Code
                                                                       assignment_value = assignment_value.replace("BASIC", str(basic_amount_value))
                                                                   if "%" in assignment_value:  # For Find the % in Original String
                                                                       assignment_value = eval(assignment_value.replace("%", "*"))  # For Replacing % as * and Divide By 100
                                                                       val_dic['assignment_value'] = round(eval(str(float(assignment_value) / 100.0)))
                                                                   else:
                                                                      val_dic['assignment_value'] = round(float(eval(assignment_value)))
                                                               else:
                                                                   val_dic['assignment_value'] = ''
                                                           # Else the Assignment Value not Given
                                                           else:
                                                               val_dic['assignment_value'] = validation_condition
                                                                
                                                       val_dic['refitems_name'] = 'Employer_Contribution'
                                                       if contribution_id:  # For the Employee Contribution Display the Text
                                                           val_dic['salary_rule_name'] = i['salary_rule_name'] + "  Employer Contribution"
                                                       else:
                                                            val_dic['salary_rule_name'] = i['salary_rule_name']
                                                       val_dic['condition_id'] = condition_id
                                                       # If Avoiding Same Value For Allowance and Deduction Details
                                                       count = 0
                                                       for k in list_value:
                                                           if k['salary_rule_name'] == val_dic['salary_rule_name']:
                                                               if k['assignment_value'] > val_dic['assignment_value']:
                                                                   val_dic['assignment_value'] = k['assignment_value']
                                                                   del list_value[count]
                                                               elif k['assignment_value'] < val_dic['assignment_value']:
                                                                   val_dic['assignment_value'] = val_dic['assignment_value']
                                                                   del list_value[count]
                                                               elif k['assignment_value'] == val_dic['assignment_value']:
                                                                   val_dic['assignment_value'] = val_dic['assignment_value']
                                                                   del list_value[count]
                                                           count = count + 1;
                                                       list_value_employer.append(val_dic)
                                                   # If No Validation Only Assignment Value
                                                    elif i['salary_rule_validation_code'] == '':
                                                       if i['cal_type_code'] == "NUMBR":
                                                               val_dic['assignment_value'] = round(float(i['salary_rule_value_assignment']))
                                                       else:
                                                           # Check the Assignment Value 
                                                           if i['salary_rule_value_assignment_code']:
                                                               assignment_value = i['salary_rule_value_assignment_code']
                                                               if assignment_value:
                                                                   # For Replacing the BASIC Code to as Basic Amount
                                                                   # For CTC in Salary Rule Validation Code
                                                                   if "MNCTC" in assignment_value:
                                                                       assignment_value = assignment_value.replace("MNCTC", str(ctc_amount))
                                                                   elif "ENCTC" in assignment_value:
                                                                       assignment_value = assignment_value.replace("ENCTC", str(ctc_amount))
                                                                   elif "BASIC" in assignment_value:  # IF Basic Salary Rule in Validation Code
                                                                       assignment_value = assignment_value.replace("BASIC", str(basic_amount_value))
                                                                   if "%" in assignment_value:  # For Find the % in Original String
                                                                       assignment_value = eval(assignment_value.replace("%", "*"))  # For Replacing % as * and Divide By 100
                                                                       val_dic['assignment_value'] = round(eval(str(float(assignment_value) / 100.0)))
                                                                   else:
                                                                      val_dic['assignment_value'] = round(float(eval(assignment_value)))
                                                               else:
                                                                   val_dic['assignment_value'] = ''
                                                           # Else the Assignment Value not Given
                                                           else:
                                                               val_dic['assignment_value'] = validation_condition
                                                                
                                                       val_dic['refitems_name'] = "Employer_Contribution"
                                                       val_dic['salary_rule_name'] = i['salary_rule_name']
                                                       val_dic['condition_id'] = condition_id
                                                       # If Avoiding Same Value For Allowance and Deduction Details
                                                       count = 0
                                                       for k in list_value:
                                                           if k['salary_rule_name'] == val_dic['salary_rule_name']:
                                                               if k['assignment_value'] > val_dic['assignment_value']:
                                                                   val_dic['assignment_value'] = k['assignment_value']
                                                                   del list_value[count]
                                                               elif k['assignment_value'] < val_dic['assignment_value']:
                                                                   val_dic['assignment_value'] = val_dic['assignment_value']
                                                                   del list_value[count]
                                                               elif k['assignment_value'] == val_dic['assignment_value']:
                                                                   val_dic['assignment_value'] = val_dic['assignment_value']
                                                                   del list_value[count]
                                                           count = count + 1;
                                                       list_value_employer.append(val_dic)       
                                               final_data_value['employer_contribution_details'] = list_value_employer
                                               final_data['salary_details'] = list_value
                                               final_data['ctc_amount'] = ctc_amount
                                            # For the Actual Earnings for the Working days
                                           Fixed_Earnings_list = []   
                                           Fixed_Deduction_list = []
                                           if len(final_data) != 0:
                                               for j in final_data['salary_details']:
                                                   if j['refitems_name'] == "Earnings":
                                                       Fixed_Earnings_list.append(j)
                                                   elif j['refitems_name'] == "Deduction":
                                                       Fixed_Deduction_list.append(j)
                                           if len(final_data) != 0:            
                                               if final_data['ctc_amount']:
                                                   value_total_fixed_earning_amount = 0.00
                                                   for a in Fixed_Earnings_list:
                                                       value_total_fixed_earning_amount = value_total_fixed_earning_amount + float(a['assignment_value'])
                                           if value_total_fixed_earning_amount:
                                               allowance_value = ctc_amount - value_total_fixed_earning_amount      
                                           actual_earning_amount = []
                                           if Fixed_Earnings_list:
                                               for s in Fixed_Earnings_list:
                                                   s['assignment_value'] = round(float(s['assignment_value']) / float(working_days) * float(worked_day))
                                                   actual_earning_amount.append(s)
                                           # For PF is Not Applicable 
                                           if Fixed_Deduction_list:
                                                for (index, t) in enumerate(Fixed_Deduction_list):
                                                    if pf_applicable_result:
                                                        if pf_applicable_result[0]['pf_applicable'] == False:
                                                            salary_rule_code = "PFPFF"
                                                            payslip_select_pf_salary_rule_query = q.fetch_hcms_query(config.payroll_management, config.payslip_select_pf_salary_rule_query)
                                                            if payslip_select_pf_salary_rule_query:
                                                                cr.execute(payslip_select_pf_salary_rule_query, (salary_rule_code,))
                                                                pf_salary_rule_result = q.dictfetchall(cr)
                                                            if pf_salary_rule_result:
                                                                if pf_salary_rule_result[0]['id'] == t['condition_id']:
                                                                    t['assignment_value'] = 0
                                           if allowance_value:
                                              earned_special_allowance = round(float(allowance_value) / float(working_days) * float(worked_day))
                                           if earned_special_allowance:
                                               final_data_value['special_allowance'] = earned_special_allowance  # For the Special Allowance
                                           final_data_value['emp_actual_earning_list'] = actual_earning_amount  # For Earned List Amount
                                           final_data_value['emp_actual_deduction_list'] = Fixed_Deduction_list  # For Deduction List Amount
                                   final_data_value['employee_data_val'] = employee_data_val
                                   final_data_value['payment_details'] = payment_details
                                   final_data_value['company_data_val'] = company_data_val
                                   print_data.append(final_data_value)
                               result_data['exp_details'] = print_data
                               #result_data['employee_data_val']=employee_data_list
                            else:   
                                result_data = config.unable_to_create_connection_message
    else:
       result_data = config.unable_to_create_connection_message    
    return result_data 

###### Non Compliance Report Data #####
def hrmsPayslipNonComplianceReportData(request):
        json_data = {}
        #overall_list = []
        total_data_val = {}
    
    #try:
        logger_obj.info('Non-Compliance Report Table function by'+str(request.user.username))
        cur = connection.cursor()  #create the database connection
        post = request.GET
        emp_id = post.get(config.employee_id)  
        from_date = post.get(config.from_date)  
        to_date = post.get(config.to_date)
        status = post.get(config.status_key)
        hr_hour = post.get('hr_hour')
        if emp_id:
            employee_ids = json.loads(emp_id)
            employee_list = [str(r) for r in employee_ids]
        else:
            employee_ids = []   
            employee_list = [] 
        if from_date != None:
            split_mon = from_date.split('-')[0]
        if to_date != None:
            split_year = int(from_date.split('-')[1])
            if split_mon:
                pay_month = int(strptime(split_mon,'%b').tm_mon)
                total_days = calendar.monthrange(split_year, pay_month)[1]
                period_from = datetime.date(split_year, pay_month, 1)
                period_to = datetime.date(split_year, pay_month, total_days)
        if from_date:
            start_date = period_from#datetime.date(datetime.datetime.strptime(from_date, '%Y-%m-%d').year, datetime.datetime.strptime(from_date, '%Y-%m-%d').month, datetime.datetime.strptime(from_date, '%Y-%m-%d').day)
        else:
            start_date = ''
            year_mon_date = ''
        if to_date:
            end_date = period_to#datetime.date(datetime.datetime.strptime(to_date, '%Y-%m-%d').year, datetime.datetime.strptime(to_date, '%Y-%m-%d').month, datetime.datetime.strptime(to_date, '%Y-%m-%d').day)
        else:
            end_date = ''
        #print"!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",emp_id,start_date,end_date,hr_hour
        if employee_ids and int(hr_hour) == 0:
            for a in employee_list:
                   report_data_dict = {}
                   check_in_time_list =[]
                   check_in_date_list =[]
                   hr_hour_list = []
                   project_hr_list = []
                   lop_count_data = []
                   
                   ##new join grace time function in 30 days    
                   cur.execute("select to_char(date_of_joining,'YYYY-MM-DD') as date_of_join from employee_info where id = %s",(a,))
                   joining_date = q.dictfetchall(cur)
                   if joining_date:
                        date_of_joining = joining_date[0]['date_of_join']
                        date_format = "%Y-%m-%d"
                        from_a = datetime.datetime.strptime(str(date_of_joining),date_format)
                        to_b = datetime.datetime.strptime(str(period_to), date_format)
                        delta = to_b - from_a
                        total_days_of_joining = delta.days 
                        if total_days_of_joining > 30:
                            n_days = total_days_of_joining - 30
                            if n_days < 30:
                                date_N_days_ago = period_to - timedelta(days = n_days)
                                start_date = date_N_days_ago
                            else:
                                start_date = period_from
                   
                   cur.execute("""  select emp.id as emp_id,hr_project_details.username,hr_project_details.summary_hours,hr_project_details.hr_hours,leave_info.number_of_days,ri.refitems_code as leave_status,
                    hr_project_details.meeting_hours,to_char(hr_project_details.check_in,'DD/MM/YYYY') as check_in,hr_project_details.check_in_time from hr_project_details
                    inner join employee_info emp on emp.related_user_id_id = hr_project_details.user_id
                     left join leave_info  on leave_employee_id_id = emp.id   and  leave_info.from_date::date = hr_project_details.check_in::date
                     left join reference_items ri on ri.id = leave_info.type_id_id
                     where emp.id = %s and
                     hr_project_details.check_in  >= %s  and hr_project_details.check_in::date <= %s and hr_project_details.day_name not in ('Saturday','Sunday')
                    group by  emp.id ,hr_project_details.username,hr_project_details.summary_hours,hr_project_details.hr_hours,leave_info.number_of_days,ri.refitems_code,
                    hr_project_details.meeting_hours,to_char(hr_project_details.check_in,'DD/MM/YYYY') ,hr_project_details.check_in_time
                    order by check_in asc""",(a,start_date,end_date,))        
                   emp_working_data = q.dictfetchall(cur)
                   #print"===============================emp_working_data",emp_working_data
                   lop_count = 0
                   if emp_working_data:
                        permission_count = 0
                        late_count = 0
                        lop_hr_count = 0
                        tot_meet_hrs = datetime.datetime.strptime('00:00:00','%H:%M:%S')
                        tot_hrs = 0
                        
                        for i in emp_working_data:
                            total_lvr_value = 0
                            total_tl_value = 0.0
                            total_ld_percentage = 0.0
                            leadership_basic_percentage = 0.0
                            leadership_total_percentage = 0.0
                            leadership_slab_value = 0.0
                            project_variance_value = 0
                            mentor_value = 0
                            percentage_divide = 0.0
                            hr_hour_con = datetime.datetime.strptime('12:00:00', '%H:%M:%S')
                            tot_project_hr_val = datetime.datetime.strptime('08:00:00', '%H:%M:%S')
                            tot_project_hr_val_per = datetime.datetime.strptime('07:00:00', '%H:%M:%S')
                            check_in_val = datetime.datetime.strptime('08:16:00', '%H:%M:%S')
                            hr_hour_val = datetime.datetime.strptime('08:00:00', '%H:%M:%S')
                            hr_hour_val_per = datetime.datetime.strptime('07:00:00', '%H:%M:%S')
                            tot_project_hr_half = datetime.datetime.strptime('04:00:00', '%H:%M:%S')
                            hr_hour_half = datetime.datetime.strptime('04:00:00', '%H:%M:%S')
                            check_in_time = datetime.datetime.strptime(i['check_in_time'], '%H:%M:%S')
                            time_zero = datetime.datetime.strptime('00:00:00', '%H:%M:%S')
                            #hr_hour_time = datetime.datetime.strptime(i['hr_hours'], '%H:%M:%S')
                            cur.execute("""select to_char(late_arrival_date,'DD/MM/YYYY') as late_date ,user_id from late_arrival
                            inner join employee_info emp on emp.related_user_id_id = late_arrival.user_id 
                            where late_arrival_date = to_date(%s,'DD-MM-YYYY') and emp.id = %s"""
                                        ,(i['check_in'],a,))
                            late_date_data = q.dictfetchall(cur)
                            #print"=========================================================late_date_data",check_in_time,i['check_in'],late_date_data
                            cur.execute("""SELECT to_char(check_out - check_in, 'HH24:MI:SS') AS time_diff 
                                FROM attendance_info  where employee_id_id = %s and 
                                check_in :: date = to_date(%s,'DD-MM-YYYY') and attendance_type = 'WEB'""",(a,i['check_in'],))
                            hr_time_diff = q.dictfetchall(cur)
                            if hr_time_diff:
                                hr_time_add = datetime.datetime.strptime(hr_time_diff[0]['time_diff'], '%H:%M:%S')
                            else:
                                hr_time_add = datetime.datetime.strptime('00:00:00', '%H:%M:%S')

                            if late_date_data:
                               check_in_date = datetime.datetime.strptime(i['check_in'], "%d/%m/%Y").date()
                               late_date = datetime.datetime.strptime(late_date_data[0]['late_date'], "%d/%m/%Y").date()
                               if check_in_date == late_date:
                                    late_arrival_time = datetime.datetime.strptime('01:00:00', '%H:%M:%S')
                                    check_in_time_late = check_in_time - late_arrival_time
                                    check_in_time = datetime.datetime.strptime(str(check_in_time_late), '%H:%M:%S')
                                    #print"************************************************************",check_in_time
                               else:
                                   print"eeeeeeeeeeeeeeeeeeeeeeee"
                            #hr_hour_time = datetime.datetime.strptime(i['hr_hours'], '%H:%M:%S')
                            if i['hr_hours'] >= '12:00:00':
                                hr_hour_time_first = datetime.datetime.strptime('08:00:00', '%H:%M:%S')
                                hr_hour_time_sec = str((hr_hour_time_first - time_zero + hr_time_add).time())
                                hr_hour_time = datetime.datetime.strptime(hr_hour_time_sec, '%H:%M:%S')
                            else:
                                hr_hour_time_first = datetime.datetime.strptime(i['hr_hours'], '%H:%M:%S')  
                                hr_hour_time_sec = str((hr_hour_time_first - time_zero + hr_time_add).time())
                                hr_hour_time = datetime.datetime.strptime(hr_hour_time_sec, '%H:%M:%S')   
                            if str(i['emp_id']) not in ('41','149','121','204','224'):
                                t1 = '00:00:00';
                                if float(i['summary_hours']) >= float('24.0'):
                                    work_summary_hr = '8.0'
                                else:
                                    work_summary_hr = i['summary_hours']
                                if work_summary_hr:
                                    summary_hrs = str(datetime.timedelta(hours=float(work_summary_hr)))
                                    summary_hours_time = str((summary_hrs).split('.')[0])
                                    tot_sum_hrs = datetime.datetime.strptime(str(summary_hours_time), '%H:%M:%S')
                                time_zero = datetime.datetime.strptime('00:00:00', '%H:%M:%S')
                                if i['meeting_hours']:
                                    tot_meet_hrs = datetime.datetime.strptime(str(i['meeting_hours']), '%H:%M:%S')
                                tot_project_hr = str((tot_sum_hrs - time_zero + tot_meet_hrs).time());
                                tot_proj_hr_time = datetime.datetime.strptime(tot_project_hr, '%H:%M:%S')
                                tot_project_hrs_first = str((tot_proj_hr_time - time_zero + hr_time_add).time());
                                tot_project_hrs = datetime.datetime.strptime(tot_project_hrs_first, '%H:%M:%S')
                                #print tot_project_hrs,i['check_in'],i['check_in_time'],i['hr_hours']
                                if check_in_time < check_in_val:
                                #print"@@@@@@@@@@@@@@@@@@@@@@@@@@",tot_project_hrs,hr_hour_con,tot_project_hr_val,check_in_val,hr_hour_val,hr_hour_val_per,tot_project_hr_half,check_in_time
                                #print 'tot_project_hrs',tot_project_hrs,'tot_project_hr_val',tot_project_hr_val
                                    if tot_project_hrs < tot_project_hr_val:
                                        if permission_count < 2 and i['leave_status'] == 'PEMSN':
                                            if tot_project_hrs < tot_project_hr_val_per or hr_hour_time < hr_hour_val_per:
                                                lop_count += 1
                                            else:
                                                pass    
                                            permission_count += 1
                                            
                                        elif i['leave_status'] in ('SICKL','CASHL','MTNTL','PTNTL','CMPOF','LEABS'):
                                            half_day = i['number_of_days'] % 1
                                            if i['number_of_days'] <= half_day:
                                                if tot_project_hrs < tot_project_hr_half or hr_hour_time < hr_hour_half:
                                                    lop_count += 0.5
                                                else:
                                                    pass   
                                            else:
                                                pass         
                                        else:
                                            #print '2232323'
                                            lop_count += 1
                                    else:
                                        #print"2222222222222222",type(hr_hour_time),type(hr_hour_val)
                                        if hr_hour_time < hr_hour_val:
                                            #print"=================================77777777777777777777",i['check_in']
                                            if i['leave_status'] == 'PEMSN':
                                                if hr_hour_time < hr_hour_val_per:
                                                    lop_count += 1
                                            else:
                                                if i['leave_status'] in ('SICKL','CASHL','MTNTL','PTNTL','CMPOF','LEABS'):
                                                    half_day = i['number_of_days'] % 1
                                                    if i['number_of_days'] <= half_day:
                                                        if tot_project_hrs < tot_project_hr_half or hr_hour_time < hr_hour_half:
                                                            lop_count += 0.5
                                                        else:
                                                            pass   
                                                    else:
                                                        pass
                                                else:    
                                                    lop_count += 1
                                        else: 
                                            pass       
                                else:
                                    if check_in_time > check_in_val:
                                        if permission_count < 2 and i['leave_status'] == 'PEMSN':
                                            if tot_project_hrs < tot_project_hr_val_per or hr_hour_time < hr_hour_val_per:
                                                    lop_count += 1
                                            else:
                                                pass 
                                            permission_count += 1
                                            
                                            
                                        elif i['leave_status'] in ('SICKL','CASHL','MTNTL','PTNTL','CMPOF','LEABS'):
                                            half_day = i['number_of_days'] % 1
                                            if i['number_of_days'] <= 0.5:
                                                if tot_project_hrs < tot_project_hr_half or hr_hour_time < hr_hour_half:
                                                        lop_count += 0.5 
                                                else:
                                                    pass   
                                            else:
                                                pass
                                                
                                        else:
                                            if late_count < 2 :
                                                if hr_hour_time < hr_hour_val:
                                                    if i['leave_status'] == 'PEMSN':
                                                        if hr_hour_time < hr_hour_val_per:
                                                            lop_count += 1
                                                    else:
                                                       lop_count += 1     
                                                else:    
                                                    late_count += 1
                                                pass
                                            else:
                                                lop_count += 1 
                                #print"================================lllllllllllllll",late_count                
                            else:
                                lop_count = 0
                            
                            if lop_count > 0:
                                #print"+++++++++++++++++++++++++++++++++++++++++++++",i['check_in_time'],i['check_in'],i['emp_id'],lop_count,str(tot_project_hr),str(i['hr_hours']),i['username']
                                check_in_time_list.append(str(i['check_in_time']))
                                check_in_date_list.append(str(i['check_in']))
                                hr_hour_list.append(str(i['hr_hours']))
                                project_hr_list.append(str(tot_project_hr))
                                if lop_count:
                                    lop_count_data.append(lop_count)
                                    lop_count = 0
                        emp_id = i['emp_id'] 
                        report_data_dict['check_in_time'] = check_in_time_list
                        report_data_dict['check_in_date'] = check_in_date_list
                        report_data_dict['hr_hour'] = hr_hour_list
                        report_data_dict['project_hr'] = project_hr_list
                        report_data_dict['lop_count_data'] = lop_count_data 
                        report_data_dict['employee_id'] = emp_id 
                        report_data_dict['employee_name'] = i['username'] 
                        total_data_val[emp_id] = report_data_dict   
                   #print"********************************************total_data_val",total_data_val    
            return HttpResponse(json.dumps(total_data_val))   
        else:
            hr_hour_list_data = []
            hr_all_data = {}
            for b in employee_list:
                #print"==========================bbbbbbbbbbbb",b,start_date,end_date
                cur.execute("""  select * from 
                    (select hrpdts.id, emp.id as emp_id,hrpdts.username,to_char(((hrpdts.summary_hours)::decimal|| ' hour')::interval,'HH24:MI:SS') as summary_hr,
                    hrpdts.summary_hours,hrpdts.meeting_hours,to_char(hrpdts.check_in,'DD-MM-YYYY') as check_in,hrpdts.check_in_time,
                    case when not hrpdts.meeting_hours = '' then to_char(((hrpdts.summary_hours)::decimal|| ' hour')::interval + hrpdts.meeting_hours::interval,'HH24:MI:SS')
                    else  to_char(((hrpdts.summary_hours)::decimal|| ' hour')::interval,'HH24:MI:SS') end as project_hrs,hrpdts.hr_hours
                    from hr_project_details hrpdts
                    inner join employee_info emp on emp.related_user_id_id = hrpdts.user_id
                    where hrpdts.check_in >= %s and hrpdts.check_in <= %s and  emp.id= %s
                    order by hrpdts.username)a
                    where hr_hours < '08:00:00'  """,(start_date,end_date,b,))        
                hr_hour_data = q.dictfetchall(cur)
                print 'hr_hour_data--------------',hr_hour_data
                hr_hour_list_data.append(hr_hour_data)
            hr_all_data['hr_hour_data'] = hr_hour_list_data
            #print"**************************************hr_all_data",hr_all_data
            return HttpResponse(json.dumps(hr_all_data))
                        #json_data['payslip_report_data'] = payslip_report_data
#     except Exception as e:
#         logger_obj.error(e)
#         json_data[config.org_employee_data] = []
#         print"eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",e
                #print 'overall_list------------',json.dumps(total_data_val)
                
######### HR Project Details ##########                
def hrmsPayslipHrProjectReportData(request):  
    
        json_data = {}
        project_data_list = []
    #try:
        logger_obj.info('HR Project Details Report Table function by'+str(request.user.username))
        cur = connection.cursor()  #create the database connection
        post = request.GET
        project_emp_id = post.get(config.employee_id)  
        project_from_date = post.get(config.from_date)  
        project_to_date = post.get(config.to_date)
        project_status = post.get(config.status_key)
        if project_emp_id:
            project_employee_ids = json.loads(project_emp_id)
            employee_list = [str(a) for a in project_employee_ids]
        else:
            project_employee_ids = []   
            employee_list = [] 
        if project_from_date != None:
            split_mon = project_from_date.split('-')[0]
        if project_to_date != None:
            split_year = int(project_from_date.split('-')[1])
            if split_mon:
                pay_month = int(strptime(split_mon,'%b').tm_mon)
                total_days = calendar.monthrange(split_year, pay_month)[1]
                period_from = datetime.date(split_year, pay_month, 1)
                period_to = datetime.date(split_year, pay_month, total_days)
        #print"++++++++++++++++++++++++++++++",period_to,period_from       
        if project_from_date:
            start_date = period_from
        else:
            start_date = ''
            year_mon_date = ''
        if project_to_date:
            end_date = period_to
        else:
            end_date = ''     
        if  project_emp_id:
            for m in employee_list:
                cur.execute("""  select * from 
    (select hrpdts.id, emp.id as emp_id,hrpdts.username,to_char(((hrpdts.summary_hours)::decimal|| ' hour')::interval,'HH24:MI:SS') as summary_hr,
    hrpdts.summary_hours,hrpdts.meeting_hours,to_char(hrpdts.check_in,'DD-MM-YYYY') as check_in,hrpdts.check_in_time,
    case when not hrpdts.meeting_hours = '' then to_char(((hrpdts.summary_hours)::decimal|| ' hour')::interval + hrpdts.meeting_hours::interval,'HH24:MI:SS')
    else  to_char(((hrpdts.summary_hours)::decimal|| ' hour')::interval,'HH24:MI:SS') end as project_hrs,hrpdts.hr_hours
    from hr_project_details hrpdts
    inner join employee_info emp on emp.related_user_id_id = hrpdts.user_id
    where  emp.id = %s and hrpdts.check_in >= %s and hrpdts.check_in <= %s  and hrpdts.day_name not in ('Saturday')
    order by hrpdts.username)a""",(m,start_date,end_date,))        
                emp_project_data = q.dictfetchall(cur) 
                project_data_list.append(emp_project_data)
            if emp_project_data:
                json_data['hr_project_data'] = project_data_list 
            else:
               json_data['hr_project_data'] = 'No Data Found' 
            
        return HttpResponse(json.dumps(json_data))                    
        
    


                 