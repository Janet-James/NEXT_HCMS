# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import json
import config
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.http.response import HttpResponse, JsonResponse
from django.db import connection
from CSD.JenkinsAPI import jenkins_fetch
from CommonLib.hcms_common import refitem_fetch, record_validation, menu_access_control
import HCMS.settings as status_keys
import logging
import logging.handlers
from CommonLib import query
logger_obj = logging.getLogger('logit')

# Create Request views here.
class EM_Request(TemplateView):
    ''' 
    24-Aug-2018 || TRU || To load Exit Management page
    @param request: Request Object
    @type request : Object
    @return: HttpResponse or Redirect the another URL
    @author: TRU
    '''
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(EM_Request, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Raise Exit Request', self.request.user.id)
        if macl:
            template_name = "exit_management/exit_request.html"
        else: 
            template_name = "tags/access_denied.html"
        return [template_name] 
     
    def get(self, request, *args, **kwargs):
        cur = connection.cursor()
        context = super(EM_Request, self).get_context_data(**kwargs)
        uid=request.user.id
        querys = "select id, employee_id,(name||' '||last_name) as emp_name, is_active from employee_info where is_active and related_user_id_id=%s order by emp_name"
        cur.execute(querys,(int(uid),))
        exit_employee_list = query.dictfetchall(cur)
        context['exit_employee_list'] = exit_employee_list
        return self.render_to_response(context)

# Create Process views here.
class EM_Process(TemplateView):
    ''' 
    24-Aug-2018 || TRU || To load Exit Management page
    @param request: Request Object
    @type request : Object
    @return: HttpResponse or Redirect the another URL
    @author: TRU
    '''
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(EM_Process, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Process Exit Request', self.request.user.id)
        if macl:
            template_name = "exit_management/exit_process.html"
        else:
            template_name = "tags/access_denied.html"
        return [template_name]
    
    def get(self, request, *args, **kwargs):
        cur = connection.cursor()
        context = super(EM_Process, self).get_context_data(**kwargs)
        cur.execute(query.fetch_hcms_query(config.exit_management, config.employee_list_fetch_sel))
        context['employee_list'] = query.dictfetchall(cur)
        context['exit_checklist'] = refitem_fetch("EXTCL")
        return self.render_to_response(context)

# Create Report views here.
class EM_Report(TemplateView):
    ''' 
    24-Aug-2018 || TRU || To load Exit Management page
    @param request: Request Object
    @type request : Object
    @return: HttpResponse or Redirect the another URL
    @author: TRU
    '''
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(EM_Report, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Exit Employee Report Details', self.request.user.id)
        if macl:
            template_name = "exit_management/exit_report.html"
        else:
            template_name = "tags/access_denied.html"
        return [template_name]
    
    def get(self, request, *args, **kwargs):
        cur = connection.cursor()
        context = super(EM_Report, self).get_context_data(**kwargs)
        cur = connection.cursor()  #create the database connection
        cur.execute(query.fetch_hcms_query(config.exit_management, config.hrms_org_list));
        values = query.dictfetchall(cur)
        if values:
             org_data = values
        else:
             org_data = []        
        context['org'] = org_data
        return self.render_to_response(context)

# Create Certificate views here.
class EM_Certificate(TemplateView):
    ''' 
    24-Aug-2018 || TRU || To load Exit Management page
    @param request: Request Object
    @type request : Object
    @return: HttpResponse or Redirect the another URL
    @author: TRU
    '''
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(EM_Certificate, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Generate Exit Certificate', self.request.user.id)
        if macl:
            template_name = "exit_management/exit_certificate.html"
        else:
            template_name = "tags/access_denied.html"
        return [template_name]
    
    def get(self, request, *args, **kwargs):
        cur = connection.cursor()
        context = super(EM_Certificate, self).get_context_data(**kwargs)
        cur.execute("""select id,name from organization_info where is_active""")
        organization_info = query.dictfetchall(cur)  
        context['organization_info'] = organization_info #Loading Organization Data
        return self.render_to_response(context)
