# -*- coding: utf-8 -*-
from __future__ import unicode_literals
 
import json
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from django.http.response import HttpResponse
from CommonLib import query
from django.db import connection
from CommonLib.hcms_common import menu_access_control
from CommonLib.lib import *
# for decoder function
from django.core import serializers
from django.core.serializers.json import DjangoJSONEncoder
import HCMS.settings as status_keys

import logging
import logging.handlers
import config
from django.views.decorators.csrf import csrf_exempt
logger_obj = logging.getLogger('logit')

class HCMSLearningmanagement(TemplateView):  #Added- BAV-19SEP2018
    ''' 
    27-AUG-2018 || BAV || To HCMS Performance assessment form page loaded.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
        
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HCMSLearningmanagement, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Raise Budget Request', self.request.user.id)
        if macl:
           template_name = config.learning_form_template
        else:
            template_name = config.tags_access_denied_html
        return [template_name] 
    
    def get(self, request, *args, **kwargs):
        cur=connection.cursor() 
        context = super(HCMSLearningmanagement, self).get_context_data(**kwargs)
        try:
            cur.execute(query.fetch_hcms_query(config.learning_development_module,config.fetch_organization_details_view))
            org_info=dictfetchall(cur)
            context[config.organization]=org_info
            logger_obj.info("Performance Assessment form Page Load  attempted by "+str(request.user.username))    
        except Exception as e:
            context[config.exception] = e
            logger_obj.info("Performance Assessment form Load data exception"+ str(e) +" attempted by "+str(request.user.username))    
        cur.close()    
        return self.render_to_response(context)
    
def ldorganization_unit(request):
    ''' 
    19-SEP-2018 || BAV || To HCMS L&D  organization onchange form page loaded.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    try:
        cur=connection.cursor()
        cur.execute(query.fetch_hcms_query(config.learning_development_module,config.fetch_organization_unit_details_view),(request.GET.get('str_org_id')))
        json_data[config.status]=dictfetchall(cur)
    except Exception as e:
            json_data[config.status] = e
            logger_obj.info("Performance Assessment form Load data exception"+ str(e) +" attempted by "+str(request.user.username))    
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def ldorganization_unit_view(request):
    ''' 
    19-SEP-2018 || BAV || To HCMS L&D organization unit onchange form page loaded.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    try:
        cur=connection.cursor()
        if request.user.id:
            cur.execute(query.fetch_hcms_query(config.learning_development_module,config.fetch_division_details_view),(request.GET.get('str_org_unit_id')))
            json_data[config.status]=dictfetchall(cur)
    except Exception as e:
            json_data[config.status] = e
            logger_obj.info("Performance Assessment form Load data exception"+ str(e) +" attempted by "+str(request.user.username))    
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def ldorganization_division_view(request):
    ''' 
    19-SEP-2018 || BAV || To HCMS L&D Division onchange form page loaded.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    try:
        cur=connection.cursor()
        cur.execute(query.fetch_hcms_query(config.learning_development_module,config.fetch_role_details),(request.GET.get('str_div_id'),))
        json_data[config.role_details]=dictfetchall(cur)
        cur.execute(query.fetch_hcms_query(config.learning_development_module,config.ld_training_details),(request.GET.get('str_div_id'),))
        json_data[config.training_data]=dictfetchall(cur) 
    except Exception as e:
            json_data[config.status] = e
            logger_obj.info("Performance Assessment form Load data exception"+ str(e) +" attempted by "+str(request.user.username))  
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def cost_request_save(request):
    ''' 
    19-SEP-2018 || BAV || To HCMS L&D Cost request Save function.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    try:
        cur=connection.cursor()
        cur.execute(query.fetch_hcms_query(config.learning_development_module,config.employee_user),(request.user.id,))
        user_data = dictfetchall(cur)
        cur.execute(query.fetch_hcms_query(config.learning_development_module,config.cost_request_insert_check),(request.GET.get('division'),request.GET.get('training_id'),))
        result = dictfetchall(cur)
        if result:
            if result[0]['data'] == False:
                cur.execute(query.fetch_hcms_query(config.learning_development_module,config.cost_request_insert),(request.user.id,request.GET.get('training_id'),request.GET.get('request_to_role'),request.GET.get('training_hours'),request.GET.get('cost_per_hour'),request.GET.get('division'),))
                json_data[config.status]=status_keys.SUCCESS_STATUS
            else:
                json_data[config.status]="exists"
    except Exception as e:
            json_data[config.status] = e
            logger_obj.info("Performance Assessment form Load data exception"+ str(e) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def cost_request_update(request):
    ''' 
    20-SEP-2018 || BAV || To HCMS L&D Budget Update function.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    try:
        json_data = {}
        cur=connection.cursor()
        cur.execute(query.fetch_hcms_query(config.learning_development_module,config.employee_user),(request.user.id,))
        user_data = dictfetchall(cur)
        cur.execute(query.fetch_hcms_query(config.learning_development_module,config.cost_request_update),(request.GET.get('training_hours'),request.GET.get('cost_per_hour'),request.GET.get('training_id'),request.GET.get('request_to_role'),request.user.id,request.GET.get('division'),request.GET.get('budget_id'),))
        json_data[config.status]=status_keys.UPDATE_STATUS
    except Exception as e:
            json_data[config.status] = e
            logger_obj.info("Performance Assessment form Load data exception"+ str(e) +" attempted by "+str(request.user.username))    
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def ld_cost_request_data_table(request):
    ''' 
    19-SEP-2018 || BAV || To HCMS L&D Cost request Table function.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    try:
        cur=connection.cursor()
        cur.execute(query.fetch_hcms_query(config.learning_development_module,config.training_drop))
        json_data[config.training_drop]=dictfetchall(cur)
        cur.execute(query.fetch_hcms_query(config.learning_development_module,config.cost_request_table_view))
        json_data[config.status]=dictfetchall(cur)
    except Exception as e:
            json_data[config.status] = e
            logger_obj.info("Performance Assessment form Load data exception"+ str(e) +" attempted by "+str(request.user.username))    
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def ld_budget_table_click(request):
    ''' 
    20-SEP-2018 || BAV || To HCMS L&D Budget request Table click function.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    try:
        cur=connection.cursor()
        cur.execute(query.fetch_hcms_query(config.learning_development_module,config.budget_request_table_click),(request.POST.get('table_id'),))
        json_data[config.status]=dictfetchall(cur)
        
    except Exception as e:
            json_data[config.status] = e
            logger_obj.info("Performance Assessment form Load data exception"+ str(e) +" attempted by "+str(request.user.username))   
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)
 
def ldtraining_view(request):
    ''' 
    20-SEP-2018 || BAV || To HCMS L&D Training Name Table function.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    try:
        cur=connection.cursor()
        cur.execute(query.fetch_hcms_query(config.learning_development_module,config.training_details),(request.GET.get('training_name'),))
        json_data[config.status]=dictfetchall(cur)
    except Exception as e:
            json_data[config.status] = e
            logger_obj.info("Performance Assessment form Load data exception"+ str(e) +" attempted by "+str(request.user.username))    
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def cost_request_remove(request):
    ''' 
    20-SEP-2018 || BAV || To HCMS L&D Budget Remove function.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    try:
        cur=connection.cursor()
        cur.execute(query.fetch_hcms_query(config.learning_development_module,config.budget_remove),(request.GET.get('budget_id'),))
        json_data[config.status]="Removed successfully"
    except Exception as e:
            json_data[config.status] = e
            logger_obj.info("Performance Assessment form Load data exception"+ str(e) +" attempted by "+str(request.user.username))    
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

class LDCostevaluate(TemplateView):  #Added- BAV-19SEP2018
    ''' 
    27-AUG-2018 || BAV || To HCMS Performance assessment form page loaded.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
        
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(LDCostevaluate, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Process Budget Request', self.request.user.id)
        if macl:
           template_name = config.cost_evaluation_template
        else:
            template_name = config.tags_access_denied_html
        return [template_name] 
    
    def get(self, request, *args, **kwargs):
        cur=connection.cursor() 
        context = super(LDCostevaluate, self).get_context_data(**kwargs)
        try:
            cur.execute(query.fetch_hcms_query(config.learning_development_module,config.fetch_organization_details_view))
            org_info=dictfetchall(cur)
            context[config.organization]=org_info
            logger_obj.info("Performance Assessment form Page Load  attempted by "+str(request.user.username))    
        except Exception as e:
            context[config.exception] = e
            logger_obj.info("Performance Assessment form Load data exception"+ str(e) +" attempted by "+str(request.user.username))    
        cur.close()    
        return self.render_to_response(context)
    
def cost_evaluate_process_details(request):
    ''' 
    21-SEP-2018 || BAV || To HCMS L&D Cost Evaluation Table function.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    try:
        cur=connection.cursor()
        cur.execute(query.fetch_hcms_query(config.learning_development_module,config.budget_request_details))
        json_data[config.ld_request]=dictfetchall(cur)
        cur.execute(query.fetch_hcms_query(config.learning_development_module,config.budget_manager_details))
        json_data[config.ld_manager]=dictfetchall(cur)
        cur.execute(query.fetch_hcms_query(config.learning_development_module,config.budget_status_approved))
        json_data[config.ld_approved]=dictfetchall(cur)
        cur.execute(query.fetch_hcms_query(config.learning_development_module,config.budget_status_rejected))
        json_data[config.ld_rejected]=dictfetchall(cur)
    except Exception as e:
            json_data[config.status] = e
            logger_obj.info("Performance Assessment form Load data exception"+ str(e) +" attempted by "+str(request.user.username))    
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def ld_cost_process_event_details(request):
    ''' 
    21-SEP-2018 || BAV || To HCMS L&D Cost Evaluation Table Click function.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    try:
        cur=connection.cursor()
        cur.execute(query.fetch_hcms_query(config.learning_development_module,config.employee_user),(request.user.id,))
        json_data[config.employee_user_details]=dictfetchall(cur)
        cur.execute(query.fetch_hcms_query(config.learning_development_module,config.budget_request_table_click),(request.GET.get('getId'),))
        json_data[config.datas]=dictfetchall(cur)
        if json_data[config.datas]:
            if json_data[config.datas][0]['request_to_role_id']==json_data[config.employee_user_details][0]['role_id_id']:
                json_data[config.datas][0]['user_role'] = "Approval"
            else:
                json_data[config.datas][0]['user_role'] = "Reject"
        else:
            json_data[config.datas]=[]
    except Exception as e:
            json_data[config.status] = e
            logger_obj.info("Performance Assessment form Load data exception"+ str(e) +" attempted by "+str(request.user.username))    
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def ld_status_update(request):
    ''' 
    21-SEP-2018 || BAV || To HCMS L&D Budget status Update function.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    try:
        cur=connection.cursor()
        if request.GET.get('data') == 'rejected':
            cur.execute(query.fetch_hcms_query(config.learning_development_module,config.budget_status_update),('R',request.GET.get('remark'),request.GET.get('id'),))
            json_data[config.datas]="Updated Successfully"
        if request.GET.get('data') == 'approved':
            cur.execute(query.fetch_hcms_query(config.learning_development_module,config.budget_status_approval),('A',request.GET.get('id'),))
            json_data[config.datas]="Updated Successfully"
    except Exception as e:
            json_data[config.status] = e
            logger_obj.info("Performance Assessment form Load data exception"+ str(e) +" attempted by "+str(request.user.username))    
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def ld_request_list(request):
    ''' 
    22-SEP-2018 || BAV || To HCMS L&D Budget Search function.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    try:
        cur=connection.cursor()
        data = query.fetch_hcms_query(config.learning_development_module,config.cost_request_by_name)
        cur.execute(data+" where bug.is_active=True and tr.training_name ilike '%"+str(request.POST.get('filter_name'))+"%'")
        json_data[config.status]=dictfetchall(cur)
    except Exception as e:
            json_data[config.status] = e
            logger_obj.info("Performance Assessment form Load data exception"+ str(e) +" attempted by "+str(request.user.username))    
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def ld_data_load(request):
    ''' 
    09-NOV-2018 || BAV || To HCMS L&D Initial Data Load function.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    cur=connection.cursor()
    try:
        if request.user.id:
            cur.execute(query.fetch_hcms_query(config.learning_development_module,config.employee_user),(request.user.id,))
            json_data['result'] = dictfetchall(cur)
            json_data[config.status] = 'NTE_01'
        else:
            json_data[config.status]='NTE_02'
    except Exception as e:
            json_data[config.status] = e
            logger_obj.info("Performance Assessment form Load data exception"+ str(e) +" attempted by "+str(request.user.username))    
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)
        