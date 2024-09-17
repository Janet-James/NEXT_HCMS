# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.shortcuts import render
from django.utils import timezone
import xlwt
import json
import datetime
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.http.response import HttpResponse
from CommonLib import query
from django.db import connection
from CommonLib import query as q
from HRMS_Foundation.payroll_management.models import TaxDeclaration
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
from CommonLib.hcms_common import refitem_fetch,refitemlink_fetch
import logging
import logging.handlers
logger_obj = logging.getLogger('logit')

class HRMSPayslipTaxDeclaration(TemplateView):
    ''' 
        06-Sep-2018 VIJ To HR Payroll Tax Declaration page loaded. And also check the user authentication
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
        @author: VIJ
    '''
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HRMSPayslipTaxDeclaration, self).dispatch(request, *args, **kwargs)

    def get_template_names(self):
        macl = menu_access_control('Tax Declaration Form', self.request.user.id)
        if macl:
            template_name = "hrms_foundation/payroll_management/tax_declaration.html"
        else:
            template_name = "tags/access_denied.html"
        return [template_name]
    
    def get(self, request, *args, **kwargs):
        context = super(HRMSPayslipTaxDeclaration, self).get_context_data(**kwargs)
        cur = connection.cursor() 
        #Loading reference items gender
        res = refitem_fetch('GENDR')
        context[config.gender_info] = res
        
        cur.execute(q.fetch_hcms_query(config.payroll_management, config.hrms_select_organization_info));
        organization_data = q.dictfetchall(cur)  
        if organization_data:
            organization_data = organization_data
        else:
            organization_data = []  
        context[config.organization_info] = organization_data #Loading Organization Data
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
        return self.render_to_response(context)
    

def TaxDeclarationHtmlData(request):
    json_data = {} 
    cur = connection.cursor()  #create the database connection
    cur.execute("select tax_form_data from tax_declaration_entry_form where is_active='true' order by id DESC  limit 1")
    values = cur.fetchall()
    if values:
        json_data['form_data'] = values
    else:
        json_data['form_data'] = []
    return HttpResponse(json.dumps(json_data))

def TaxDeclarationCreate(request):
    ''' 
    6-Sep-2018 VJY To Tax Declaration Create
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: VJY
    '''
    try:
        logger_obj.info('Tax Declaration details data insert by'+str(request.user.username))
        cur = connection.cursor() 
        json_data = {}
        data_value = request.POST.get(config.datas) 
        if data_value :
            data = json.loads(data_value)
        uid=request.user.id
        if not uid:
            uid = 1
        update_data = request.POST.get("update")
        if update_data:
            status = TaxDeclaration.objects.filter(employee_id_id=data['tax_data'][0]['employee_id_id']).update(tax_declaration_data=data['tax_data'][0]['tax_declaration_data'],
                            is_active="True",created_by_id=uid, modified_by_id=uid)
            json_data[config.status_key] = config.update_status                                                           
            logger_obj.info('Tax Declaration Employee details update response is'+str(json_data)+"attempted by"+str(request.user.username)) 
        else:    
            status = TaxDeclaration(organization_id=data['tax_data'][0]['organization_id'], organization_unit_id=data['tax_data'][0]['organization_unit_id'],
                            department_id=data['tax_data'][0]['department_id'], employee_id_id=data['tax_data'][0]['employee_id_id'],
                            employee_code=data['tax_data'][0]['employee_code'],gender_id=data['tax_data'][0]['gender_id'],
                            pan_number=data['tax_data'][0]['pan_number'],date_of_birth=data['tax_data'][0]['date_of_birth'],
                            tax_declaration_data=data['tax_data'][0]['tax_declaration_data'],is_active="True",created_by_id=uid, modified_by_id=uid
                                  )
            status.save()
            logger_obj.info('Tax Declaration Employee details insert response is'+str(json_data)+"attempted by"+str(request.user.username))
            json_data[config.status_id] = status.id
            json_data[config.status_key] = config.success_status
                        
                                        
    except Exception as e:
            logger_obj.error(e)
            json_data[config.status_key] = e
    return HttpResponse(json.dumps(json_data)) 

def TaxDeclarationEmployeeData(request):
    uid=request.user.id
    if not uid:
        uid = 1
    json_data = {} 
    cur = connection.cursor()  #create the database connection
    cur.execute("select id from employee_info where related_user_id_id = %s and is_active='True'",(uid,))
    employee_id = q.dictfetchall(cur)
    if employee_id:
        cur.execute("select tax_declaration_data from tax_declaration_form where employee_id_id =%s and is_active='true' order by id DESC limit 1",(employee_id[0]['id'],))
        values = cur.fetchall()
        if values:
            json_data['form_data_employee'] = values
        else:
            cur.execute("select tax_form_data from tax_declaration_entry_form  order by id DESC limit 1")
            values = cur.fetchall()
            json_data['form_data'] = values
    cur.execute("""select empinfo.id as emp_name_id,empinfo.employee_id,empinfo.employee_gender_id,to_char(empinfo.date_of_birth,'DD-MM-YYYY') as date_of_birth,
            empinfo.org_id_id,empinfo.org_unit_id_id,empinfo.team_name_id,taxdec.pan_number
            from employee_info empinfo
            left join tax_declaration_form taxdec on taxdec.employee_id_id = empinfo.id
            where empinfo.id = %s and empinfo.is_active = 'True'""",(employee_id[0]['id'],))   
    employee_data = q.dictfetchall(cur)  
    if employee_data:   
        json_data['employee_data'] = employee_data
    else:
        json_data['employee_data'] = []    
    return HttpResponse(json.dumps(json_data))
        
    
    