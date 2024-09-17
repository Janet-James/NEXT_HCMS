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
from CommonLib.hcms_common import refitem_fetch, record_validation, menu_access_control
import logging
import logging.handlers
from CommonLib import query
logger_obj = logging.getLogger('logit')

#Successors Hierarchy views here.
class SP_ItentifyKeyRoles(TemplateView):
    ''' 
    18-Sep-2018 || TRU || To load SP Indentify Key Roles Successors page
    @param request: Request Object
    @type request : Object
    @return: HttpResponse or Redirect the another URL
    @author: TRU
    '''
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(SP_ItentifyKeyRoles, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Identify Key Roles', self.request.user.id)
        if macl:
            template_name = "succession_planning/sp_itentify_key_role.html"
        else:
            template_name = "tags/access_denied.html"
        return [template_name]
    
    def get(self, request, *args, **kwargs):
        context = super(SP_ItentifyKeyRoles, self).get_context_data(**kwargs)
        cur = connection.cursor()  #create the database connection
        cur.execute("""select id,name from organization_info where is_active""")
        organization_info = query.dictfetchall(cur)  
        cur.execute("""select id,role_title as name from hcms_ti_role_details where is_active order by name""")
        ti_role_info = query.dictfetchall(cur)  
        context['organization_info'] = organization_info #Loading Organization Data    
        context['ti_role_info'] = ti_role_info #Loading Role Data              
        return self.render_to_response(context)  
    
#Successors Hierarchy views here.
class SP_SuccessorHierarchy(TemplateView):
    ''' 
    18-Sep-2018 || TRU || To load SP Potential Successors page
    @param request: Request Object
    @type request : Object
    @return: HttpResponse or Redirect the another URL
    @author: TRU
    '''
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(SP_SuccessorHierarchy, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Successor Hierarchy', self.request.user.id)
        if macl:
            template_name = "succession_planning/sp_successor_hierarchy.html"
        else:
            template_name = "tags/access_denied.html"
        return [template_name]
    
    def get(self, request, *args, **kwargs):
        context = super(SP_SuccessorHierarchy, self).get_context_data(**kwargs)
        cur = connection.cursor()  #create the database connection
        cur.execute("""select id,name from organization_info where is_active""")
        organization_info = query.dictfetchall(cur)  
        context['organization_info'] = organization_info #Loading Organization Data              
        return self.render_to_response(context)  
    
#Potential Successors views here.
class SP_PotentialSuccessor(TemplateView):
    ''' 
    18-Sep-2018 || TRU || To load SP Potential Successors page
    @param request: Request Object
    @type request : Object
    @return: HttpResponse or Redirect the another URL
    @author: TRU
    '''
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(SP_PotentialSuccessor, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Potential Successors', self.request.user.id)
        if  macl:
            template_name = "succession_planning/sp_potential_successors.html"
        else:
            template_name = "tags/access_denied.html"
        return [template_name]
    
    def get(self, request, *args, **kwargs):
        context = super(SP_PotentialSuccessor, self).get_context_data(**kwargs)
        cur = connection.cursor()  #create the database connection
        cur.execute("""select id,name from organization_info where is_active""")
        organization_info = query.dictfetchall(cur)  
        context['organization_info'] = organization_info #Loading Organization Data              
        return self.render_to_response(context)  
    
#Transfer Request views here. 
class SP_TransferRequest(TemplateView):
    ''' 
    07-Sep-2018 || TRU || To load SP Transfer Request page
    @param request: Request Object
    @type request : Object
    @return: HttpResponse or Redirect the another URL
    @author: TRU
    '''
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(SP_TransferRequest, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Transfer Request', self.request.user.id)
        if macl:
            template_name = "succession_planning/sp_transfer_request.html"
        else:
            template_name = "tags/access_denied.html"
        return [template_name]
    
    def get(self, request, *args, **kwargs):
        context = super(SP_TransferRequest, self).get_context_data(**kwargs)
        cur = connection.cursor()  #create the database connection
        cur.execute(query.fetch_hcms_query(config.succession_planning, config.hrms_org_list));
        org_data = query.dictfetchall(cur)       
        context['transfer_org_info'] = org_data        
        cur.execute(query.fetch_hcms_query(config.succession_planning, config.employee_list_fetch_sel))
        res = query.dictfetchall(cur)
        context['transfer_employee_info'] = res
#       Loading Transfer Type Info
        res = refitem_fetch('TRTYP')
        context['transfer_type_info'] = res
#       Loading Transfer Category Info
        res = refitem_fetch('TRCAT')
        context['transfer_category_info'] = res
#       Loading Transfer Reason info
        res = refitem_fetch('TRRSN')
        context['transfer_reason_info'] = res
        return self.render_to_response(context)
    
#Transfer Process views here.
class SP_TransferProcess(TemplateView):
    ''' 
    07-Sep-2018 || TRU || To load SP Process page
    @param request: Request Object
    @type request : Object
    @return: HttpResponse or Redirect the another URL
    @author: TRU
    '''
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(SP_TransferProcess, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Transfer Process', self.request.user.id)
        if macl:
            template_name = "succession_planning/sp_transfer_process.html"
        else:
            template_name = "tags/access_denied.html"
        return [template_name]
    
    def get(self, request, *args, **kwargs):
        context = super(SP_TransferProcess, self).get_context_data(**kwargs)
        cur = connection.cursor()
        querys = query.fetch_hcms_query(config.exit_management, config.employee_list_fetch_sel)
        cur.execute(query.fetch_hcms_query(config.exit_management, config.employee_list_fetch_sel))
        context['employee_list'] = query.dictfetchall(cur)
        return self.render_to_response(context)

#Promotion Request views here.
class SP_PromotionRequest(TemplateView):
    ''' 
    07-Sep-2018 || TRU || To load SP Request page
    @param request: Request Object
    @type request : Object
    @return: HttpResponse or Redirect the another URL
    @author: TRU
    '''
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(SP_PromotionRequest, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Promotion Request', self.request.user.id)
        if macl:
            template_name = "succession_planning/sp_promotion_request.html"
        else:
            template_name = "tags/access_denied.html"
        return [template_name]
    
    def get(self, request, *args, **kwargs):
        context = super(SP_PromotionRequest, self).get_context_data(**kwargs)
        cur = connection.cursor()  #create the database connection
        cur.execute(query.fetch_hcms_query(config.succession_planning, config.hrms_org_list));
        org_data = query.dictfetchall(cur)       
        context['promotion_org_info'] = org_data       
        cur.execute(query.fetch_hcms_query(config.succession_planning, config.hrms_org_list));
        values = query.dictfetchall(cur)        
        if values:
             org_data = values
        else:
             org_data = []        
        context['promotion_org_info'] = org_data        
        cur.execute(query.fetch_hcms_query(config.succession_planning, config.employee_list_fetch_sel))
        res = query.dictfetchall(cur)
        context['promotion_employee_info'] = res
        context['nominated_by_info'] = res       
        return self.render_to_response(context)
    
#Promotion Process views here.
class SP_PromotionProcess(TemplateView):
    ''' 
    07-Sep-2018 || TRU || To load SP Process page
    @param request: Request Object
    @type request : Object
    @return: HttpResponse or Redirect the another URL
    @author: TRU
    '''
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(SP_PromotionProcess, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Promotion Process', self.request.user.id)
        if macl:
            template_name = "succession_planning/sp_promotion_process.html"
        else:
            template_name = "tags/access_denied.html"
        return [template_name]
    
    def get(self, request, *args, **kwargs):
        context = super(SP_PromotionProcess, self).get_context_data(**kwargs)
        cur = connection.cursor()
        querys = query.fetch_hcms_query(config.exit_management, config.employee_list_fetch_sel)
        cur.execute(query.fetch_hcms_query(config.exit_management, config.employee_list_fetch_sel))
        context['employee_list'] = query.dictfetchall(cur)
        cur.execute('select id,role_title as name from hcms_ti_role_details where is_active order by role_title')
        context['role_list'] = query.dictfetchall(cur)
        return self.render_to_response(context)

#Demotion Request views here.
class SP_DemotionRequest(TemplateView):
    ''' 
    07-Sep-2018 || TRU || To load SP Request page
    @param request: Request Object
    @type request : Object
    @return: HttpResponse or Redirect the another URL
    @author: TRU
    '''
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(SP_DemotionRequest, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Demotion Request', self.request.user.id)
        if macl:
            template_name = "succession_planning/sp_demotion_request.html"
        else:
            template_name = "tags/access_denied.html"
        return [template_name]
    
    def get(self, request, *args, **kwargs):
        context = super(SP_DemotionRequest, self).get_context_data(**kwargs)
        cur = connection.cursor()  #create the database connection
        cur.execute(query.fetch_hcms_query(config.succession_planning, config.hrms_org_list));
        values = query.dictfetchall(cur)        
        if values:
             org_data = values
        else:
             org_data = []        
        context['promotion_org_info'] = org_data 
        cur.execute(query.fetch_hcms_query(config.succession_planning, config.employee_list_fetch_sel))
        res = query.dictfetchall(cur)
        context['demotion_employee_info'] = res
        context['request_by_info'] = res             
        # Demotion Reason
        res = refitem_fetch('DERSN')
        context['demotion_reason'] = res
        return self.render_to_response(context)
    
#Demotion Process views here.
class SP_DemotionProcess(TemplateView):
    ''' 
    07-Sep-2018 || TRU || To load SP Request page
    @param request: Request Object
    @type request : Object
    @return: HttpResponse or Redirect the another URL
    @author: TRU
    '''
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(SP_DemotionProcess, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Demotion Process', self.request.user.id)
        if macl:
            template_name = "succession_planning/sp_demotion_process.html"
        else:
            template_name = "tags/access_denied.html"
        return [template_name]
    
    def get(self, request, *args, **kwargs):
        context = super(SP_DemotionProcess, self).get_context_data(**kwargs)
        cur = connection.cursor()
        cur.execute(query.fetch_hcms_query(config.succession_planning, config.employee_list_fetch_sel))
        context['employee_list'] = query.dictfetchall(cur)
        cur.execute('select id,role_title as name from hcms_ti_role_details where is_active order by role_title')
        context['role_list'] = query.dictfetchall(cur)
        return self.render_to_response(context)
    
    
#Succession Planning  Reporting views here
class SP_Report(TemplateView):
    ''' 
         11-Sep-2018 PAR To Succession Planning  Reporting page loaded. And also check the user authentication
         @param request: Request Object
         @type request : Object
         @return:   HttpResponse or Redirect the another URL
         @author: PAR
    '''
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(SP_Report, self).dispatch(request, *args, **kwargs)

    def get_template_names(self):
        macl = menu_access_control('Employee Report', self.request.user.id)
        if macl:
            template_name = "succession_planning/sp_report.html"
        else:
            template_name = "tags/access_denied.html"
        return [template_name] 
    
    def get(self, request, *args, **kwargs): 
         context = super(SP_Report, self).get_context_data(**kwargs)
         cur = connection.cursor()  #create the database connection
         cur.execute(query.fetch_hcms_query(config.attendance_management, config.hrms_org_list));
         values = query.dictfetchall(cur)
         if values:
             org_data = values  
         else:
             org_data = []
         gender = refitem_fetch('GENDR')
         context['gender'] = gender
         leave = refitem_fetch('LEVTY')
         # Loading role details       
         cur.execute("""select id,name from hcms_role where is_active""")
         role = query.dictfetchall(cur)
         context['org'] = org_data 
         interview_status = refitem_fetch('INSTS')
         context['interview_status'] = interview_status
         job_status = refitem_fetch('OFFRE') 
         context['job_status'] = job_status
         return self.render_to_response(context)
     
#Organization, Unit, Division and Employee
def hcmsDropdownChange(request):
         ''' 
         14-Sep-2018 TRU To Organization, Unit, Division and Employee drop down function
         @param request: Request Object
         @type request : Object
         @return:   HttpResponse Organization, Unit, Division and Employee Search Data
         @author: TRU
         '''
         try:
            logger_obj.info('Organization, Unit, Division and Employee drop down function by'+str(request.user.username))
            json_data = {}
            get_value = request.GET.get('value')
            status = request.GET.get('status')
            print "-------get_query----------",status
            cur = connection.cursor()
            if status in 'organization_unit':
                  cur.execute('select id,orgunit_name as name from organization_unit_info where is_active and parent_orgunit_id !=0 and organization_id = {0} order by name'.format(get_value))
            elif status in 'organization_division':
                  cur.execute('select id,name from team_details_info where is_active and org_unit_id = {0} order by name'.format(get_value))
            elif status in 'organization_employee':
                  cur.execute("select id,coalesce((name||' '||last_name),'') as name from employee_info where is_active and team_name_id = {0} order by name".format(get_value))
            results = query.dictfetchall(cur)           
            json_data['results'] = results   
            logger_obj.info('Organization, Unit, Division and Employee fetching details by'+str(json_data)+"attempted by"+str(request.user.username))                
         except Exception as e:
            logger_obj.error(e)
            json_data[config.status_key] = e
         return HttpResponse(json.dumps(json_data)) 