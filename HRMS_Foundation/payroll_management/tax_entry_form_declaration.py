# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.shortcuts import render

import xlwt
import json
import datetime
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.http.response import HttpResponse
from CommonLib import query
from django.db import connection
from CommonLib import query as q
#from HRMS_Foundation.payroll_management.models import TaxDeclarationEntryForm
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
import inflect
v = inflect.engine()
logger_obj = logging.getLogger('logit')

class HRMSPayslipTaxEntryFormDeclaration(TemplateView):
    ''' 
        06-Sep-2018 VIJ To HR Payroll Tax Declaration page loaded. And also check the user authentication
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
        @author: VIJ
    '''
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HRMSPayslipTaxEntryFormDeclaration, self).dispatch(request, *args, **kwargs)

    def get_template_names(self):
        macl = menu_access_control('Tax Declaration Form', self.request.user.id)
        if macl:
            template_name = "hrms_foundation/payroll_management/tax_declaration_entry_form.html"
        else:
            template_name = "tags/access_denied.html"
        return [template_name]
    
    def get(self, request, *args, **kwargs):
        context = super(HRMSPayslipTaxEntryFormDeclaration, self).get_context_data(**kwargs)
        return self.render_to_response(context)
    
def TaxFormCreateData(request):
    ''' 
        06-Sep-2018 VIJ To HR Payroll Tax Declaration Form Create page loaded. And also check the user authentication
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
        @author: VIJ
    '''
    json_data = {}
    try:
        cr = connection.cursor()
        post = request.POST
        tax_form_data = post.get('tax_table_data')
        data_form = str(tax_form_data)
        uid=request.user.id
        if not uid:
            uid = 1
        if tax_form_data:
            cr.execute(""" insert into tax_declaration_entry_form (tax_form_data,is_active,created_by_id,modified_by_id) 
            values(%s,%s,%s,%s)""",(data_form,'True',uid,uid))
            
            json_data['status'] = 'Added Successfully'
    except Exception as e:
       json_data['status'] = e
    return HttpResponse(json.dumps(json_data))    

         