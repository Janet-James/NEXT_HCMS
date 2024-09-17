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

class HRMSPayrollMenus(TemplateView):
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
        return super(HRMSPayrollMenus, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Payroll Setup', self.request.user.id)
        if macl:
            template_name = "hrms_foundation/payroll_management/payroll.html"  
        else:
            template_name = "tags/access_denied.html"
        return [template_name]
    
    def get(self, request, *args, **kwargs):
        context = super(HRMSPayrollMenus, self).get_context_data(**kwargs)
        cur = connection.cursor() 
        ### contribution Register Start
        cur.execute(q.fetch_hcms_query(config.payroll_management,config.salary_component_type));
        salary_component_data = q.dictfetchall(cur)  
        if salary_component_data:
            salary_component_data = salary_component_data
        else:
            salary_component_data = []  
        context[config.salary_component_data] = salary_component_data #Loading salary component Data
        ## contribution register end
        
        ### Payment Advice start
        cur.execute(q.fetch_hcms_query(config.payroll_management, config.hrms_select_organization_info));
        organization_data = q.dictfetchall(cur)  
        if organization_data:
            organization_data = organization_data
        else:
            organization_data = []  
        context[config.organization_info] = organization_data #Loading Organization Data
        
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
        ###payment advice end
        ###Salary Rule Start
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
        ###Salary Rule End 
        ###Salary Structure Start
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
        ###Salary Structure End
        ### Payslip
        cur.execute(q.fetch_hcms_query(config.payroll_management, config.hrms_select_employee_info_payslip));
        employee_data = q.dictfetchall(cur)  
        if employee_data:
            employee_data = employee_data
        else:
            employee_data = []  
        context[config.employee_info] = employee_data #Loading Employee Data
        ## TDS
        cur.execute(q.fetch_hcms_query(config.payroll_management, config.hrms_select_employee_info));
        tds_employee = q.dictfetchall(cur)  
        if tds_employee:
            tds_employee = tds_employee
        else:
            tds_employee = []  
        context[config.employee_tds] = tds_employee #Loading Employee Data
        
        #cur.execute(q.fetch_hcms_query(config.payroll_management, config.hrms_select_employee_info));
        cur.execute("""select DISTINCT COALESCE(concat(upper(emp.name), ' ',upper(emp.last_name)),'') as employee_name,emp.id from employee_info  emp
            inner join hr_salary_contract hrsc on hrsc.employee_id_id = emp.id
            where hrsc.is_active and emp.is_active""")
        employee_data_val = q.dictfetchall(cur)  
        if employee_data_val:
            employee_data_val = employee_data_val
        else:
            employee_data_val = []  
        context['employee_val'] = employee_data_val #Loading Employee Data  

	cur.execute("""Select id,bank_type from bank_type where is_active """)
        bank_type_val = q.dictfetchall(cur)  
        if bank_type_val:
            bank_type_val = bank_type_val
        else:
            bank_type_val = []  
        context['bank_type_val'] = bank_type_val #Loading Bank Type Data 
        
        return self.render_to_response(context)
    ## tds