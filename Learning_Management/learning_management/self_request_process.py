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
import datetime
import logging
import logging.handlers
import config as config
from django.utils import datastructures
logger_obj = logging.getLogger('logit')

class HCMSEmployeeSelfRequestTrainingFormView(TemplateView):  #Added- SND-19Sep2018
    ''' 
    19-SEP-2018 || SND || Learning and Development - Employee Self Request - Request Training page loaded.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HCMSEmployeeSelfRequestTrainingFormView, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Raise Training Request', self.request.user.id)
        if macl:
           template_name = "learning_management/request_training.html"
        else:
            template_name = config.tags_access_denied_html
        return [template_name] 
    
    def get(self, request, *args, **kwargs):
        cur=connection.cursor()
        cur.execute(query.fetch_hcms_query(config.learning_development_module,config.ld_fetch_organization_detail))
        organization_detail = dictfetchall(cur)
        context = super(HCMSEmployeeSelfRequestTrainingFormView, self).get_context_data(**kwargs)
        context[config.organization_detail] = organization_detail
        return self.render_to_response(context)
    
class HCMSEmployeeSelfProcessTrainingFormView(TemplateView):  #Added- SND-19Sep2018
    ''' 
    19-SEP-2018 || SND || Learning and Development - Employee Self Request - Request Training page loaded.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HCMSEmployeeSelfProcessTrainingFormView, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Process Training Request', self.request.user.id)
        if macl:
           template_name = "learning_management/process_training.html"
        else:
            template_name = config.tags_access_denied_html
        return [template_name] 
    
    def get(self, request, *args, **kwargs):
        context = super(HCMSEmployeeSelfProcessTrainingFormView, self).get_context_data(**kwargs)
        return self.render_to_response(context)
    
def fetch_request_training_count_detail(request):
    '''
    24-Sep-2018 || SND || Fetch Requested Training Details in Employee Self Request
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse to return the data of Requested Training Details
    ''' 
    try:
        json_datas = {} 
        cur=connection.cursor()
        user_id = request.user.id
        if user_id  :
#         logger_obj.info("function name:PAAddUpdateAssessmentSchedule, attempted by "+str(request.user.username))
            cur.execute(query.fetch_hcms_query(config.learning_development_module,config.ld_fetch_request_training_count).format(request.user.id))
            json_datas[config.training_count_detail] = dictfetchall(cur)
            cur.execute(query.fetch_hcms_query(config.learning_development_module,config.ld_fetch_request_training_detail_search).format(request.user.id))
            json_datas[config.training_search_detail] = [dict(t) for t in {tuple(d.items()) for d in dictfetchall(cur)}]
            json_datas[config.status]=status_keys.SUCCESS_STATUS
#           logger_obj.info("function name:PAAddUpdateAssessmentSchedule, request data: schedule_update_id "+str(schedule_update_id)+" attempted by "+str(request.user.username)+"status"+str(json_datas))
        else:
            json_datas[config.status]=status_keys.FAILURE_STATUS
#           logger_obj.info("function name:AddUpdateAssessmentSchedule attempted by "+str(request.user.username)+"status"+str(json_datas))
    except Exception as e:
        json_datas[config.status] = e
#     logger_obj.info("function name:PAAddUpdateAssessmentSchedule attempted by "+str(request.user.username)+"status"+str(json_datas))
    return HttpResponse(json.dumps(json_datas), content_type=config.content_type_value)
    
def fetch_request_training_details(request):
    '''
    21-Sep-2018 || SND || Fetch Requested Training Details in Employee Self Request
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse to return the data of Requested Training Details
    ''' 
    try:
        json_datas = {} 
        cur=connection.cursor()
        user_id = request.user.id
        condition = ''
        approval_status = request.GET.get(config.approval_status)
        manager_id = request.GET.get(config.manager_id)
        id = request.GET.get(config.id)
        if approval_status != '' and approval_status !=None :
            condition = """ where ei.is_active = true and 
            au.is_active = true  and tdi.is_active = true and oui.is_active = true and oi.is_active = true 
            and CASE WHEN hlsr.request_type='N' Then hlsr.is_active = true 
            When hlsr.request_type='E' Then (hltd.is_active = true and hlsr.is_active = true) End and (au.id = """+ str(user_id) +""" or hlsr.manager_id = (select id from employee_info where related_user_id_id = """+str(user_id)+""")) and approval_status = '"""+approval_status+"""'"""
        elif approval_status == '':
            condition = """ where ei.is_active = true and 
            au.is_active = true and  tdi.is_active = true and oui.is_active = true and oi.is_active = true 
            and CASE WHEN hlsr.request_type='N' Then hlsr.is_active = true 
            When hlsr.request_type='E' Then (hltd.is_active = true and hlsr.is_active = true) End and (hlsr.approval_status = '' or hlsr.approval_status is null) and au.id = """+ str(user_id) +""""""
        elif manager_id :
            condition = """ where ei.is_active = true and 
            au.is_active = true and  tdi.is_active = true and oui.is_active = true and oi.is_active = true 
            and CASE WHEN hlsr.request_type='N' Then hlsr.is_active = true 
            When hlsr.request_type='E' Then (hltd.is_active = true and hlsr.is_active = true) End and (au.id = """+ str(user_id) +""" or hlsr.manager_id = """+manager_id+""")"""
        elif id :
            condition = """ where ei.is_active = true and 
            au.is_active = true and  tdi.is_active = true and oui.is_active = true and oi.is_active = true 
            and CASE WHEN hlsr.request_type='N' Then hlsr.is_active = true 
            When hlsr.request_type='E' Then (hltd.is_active = true and hlsr.is_active = true) End and hlsr.id = """+id
        else:
            condition = """ where ei.is_active = true and 
            au.is_active = true and  tdi.is_active = true and oui.is_active = true and oi.is_active = true and
            CASE WHEN hlsr.request_type='N' Then hlsr.is_active = true 
            When hlsr.request_type='E' Then (hltd.is_active = true and hlsr.is_active = true) End and (au.id = """+ str(user_id) +""" or hlsr.manager_id = (select id from employee_info where related_user_id_id = """+str(user_id)+"""))"""         
        if user_id  :
#         logger_obj.info("function name:PAAddUpdateAssessmentSchedule, attempted by "+str(request.user.username))
            cur.execute(query.fetch_hcms_query(config.learning_development_module,config.ld_fetch_self_training_details).format(condition,user_id))
            json_datas[config.training_detail] = dictfetchall(cur)
            json_datas[config.status]=status_keys.SUCCESS_STATUS
#           logger_obj.info("function name:PAAddUpdateAssessmentSchedule, request data: schedule_update_id "+str(schedule_update_id)+" attempted by "+str(request.user.username)+"status"+str(json_datas))
        else:
            json_datas[config.status]=status_keys.FAILURE_STATUS
#           logger_obj.info("function name:AddUpdateAssessmentSchedule attempted by "+str(request.user.username)+"status"+str(json_datas))
    except Exception as e:
        json_datas[config.status] = e
#     logger_obj.info("function name:PAAddUpdateAssessmentSchedule attempted by "+str(request.user.username)+"status"+str(json_datas))
    return HttpResponse(json.dumps(json_datas), content_type=config.content_type_value)
    
def request_training_exist_change(request):
    '''
    21-Sep-2018 || SND || On Change of Training Name in Employee Self Request
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse to return the data of Training Details
    ''' 
    try:
        json_datas = {} 
        cur = connection.cursor()
        user_id = request.user.id
        training_id = request.GET.get(config.training_id)
#         logger_obj.info("function name:PAAddUpdateAssessmentSchedule, attempted by "+str(request.user.username))
        if training_id and user_id:
            cur.execute(query.fetch_hcms_query(config.learning_development_module,config.ld_fetch_training_detail_based_id).format(training_id,))
            json_datas[config.training_detail] = dictfetchall(cur)
            json_datas[config.status]=status_keys.SUCCESS_STATUS
#           logger_obj.info("function name:PAAddUpdateAssessmentSchedule, request data: schedule_update_id "+str(schedule_update_id)+" attempted by "+str(request.user.username)+"status"+str(json_datas))
        else:
            json_datas[config.status]=status_keys.FAILURE_STATUS
#           logger_obj.info("function name:AddUpdateAssessmentSchedule attempted by "+str(request.user.username)+"status"+str(json_datas))
    except Exception as e:
        json_datas[config.status] = e
#     logger_obj.info("function name:PAAddUpdateAssessmentSchedule attempted by "+str(request.user.username)+"status"+str(json_datas))
    return HttpResponse(json.dumps(json_datas), content_type=config.content_type_value)

def organization_change(request):
    '''
    25-Sep-2018 || SND || On Change of Organization in Employee Self Request
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse to return the data of organization unit Details
    ''' 
    try:
        json_datas = {} 
        cur = connection.cursor()
        user_id = request.user.id
        org_id = request.GET.get(config.org_id)
#         logger_obj.info("function name:PAAddUpdateAssessmentSchedule, attempted by "+str(request.user.username))
        if org_id and user_id:
            cur.execute(query.fetch_hcms_query(config.learning_development_module,config.ld_fetch_organization_unit_detail_org).format(org_id,))
            json_datas[config.organization_unit_detail] = dictfetchall(cur)
            json_datas[config.status]=status_keys.SUCCESS_STATUS
#           logger_obj.info("function name:PAAddUpdateAssessmentSchedule, request data: schedule_update_id "+str(schedule_update_id)+" attempted by "+str(request.user.username)+"status"+str(json_datas))
        else:
            json_datas[config.status]=status_keys.FAILURE_STATUS
#           logger_obj.info("function name:AddUpdateAssessmentSchedule attempted by "+str(request.user.username)+"status"+str(json_datas))
    except Exception as e:
        json_datas[config.status] = e
#     logger_obj.info("function name:PAAddUpdateAssessmentSchedule attempted by "+str(request.user.username)+"status"+str(json_datas))
    return HttpResponse(json.dumps(json_datas), content_type=config.content_type_value)

def organization_unit_change(request):
    '''
    25-Sep-2018 || SND || On Change of Organization Unit in Employee Self Request
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse to return the data of division Details
    ''' 
    try:
        json_datas = {} 
        cur = connection.cursor()
        user_id = request.user.id
        orgunit_id = request.GET.get(config.orgunit_id)
#         logger_obj.info("function name:PAAddUpdateAssessmentSchedule, attempted by "+str(request.user.username))
        if orgunit_id and user_id:
            cur.execute(query.fetch_hcms_query(config.learning_development_module,config.ld_fetch_division_detail_orgunit).format(orgunit_id,))
            json_datas[config.division_detail] = dictfetchall(cur)
            json_datas[config.status]=status_keys.SUCCESS_STATUS
#           logger_obj.info("function name:PAAddUpdateAssessmentSchedule, request data: schedule_update_id "+str(schedule_update_id)+" attempted by "+str(request.user.username)+"status"+str(json_datas))
        else:
            json_datas[config.status]=status_keys.FAILURE_STATUS
#           logger_obj.info("function name:AddUpdateAssessmentSchedule attempted by "+str(request.user.username)+"status"+str(json_datas))
    except Exception as e:
        json_datas[config.status] = e
#     logger_obj.info("function name:PAAddUpdateAssessmentSchedule attempted by "+str(request.user.username)+"status"+str(json_datas))
    return HttpResponse(json.dumps(json_datas), content_type=config.content_type_value)

def division_change(request):
    '''
    25-Sep-2018 || SND || On Change of Division in Employee Self Request
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse to return the data of Training Details
    ''' 
    try:
        json_datas = {} 
        cur = connection.cursor()
        user_id = request.user.id
        division_id = request.GET.get(config.division_id)
#         logger_obj.info("function name:PAAddUpdateAssessmentSchedule, attempted by "+str(request.user.username))
        if division_id and user_id:
            cur.execute(query.fetch_hcms_query(config.learning_development_module,config.ld_fetch_training_detail_division).format(division_id))
            json_datas[config.division_detail] = dictfetchall(cur)
            cur.execute(query.fetch_hcms_query(config.learning_development_module,config.ld_fetch_employee_data_division).format(division_id))
            json_datas[config.employee_data] = dictfetchall(cur)
            json_datas[config.status]=status_keys.SUCCESS_STATUS
#           logger_obj.info("function name:PAAddUpdateAssessmentSchedule, request data: schedule_update_id "+str(schedule_update_id)+" attempted by "+str(request.user.username)+"status"+str(json_datas))
        else:
            json_datas[config.status]=status_keys.FAILURE_STATUS
#           logger_obj.info("function name:AddUpdateAssessmentSchedule attempted by "+str(request.user.username)+"status"+str(json_datas))
    except Exception as e:
        json_datas[config.status] = e
#     logger_obj.info("function name:PAAddUpdateAssessmentSchedule attempted by "+str(request.user.username)+"status"+str(json_datas))
    return HttpResponse(json.dumps(json_datas), content_type=config.content_type_value)

def fetch_request_training_details_id(request):
    '''
    21-Sep-2018 || SND || Fetch Requested Training Details in Employee Self Request
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse to return the data of Requested Training Details
    ''' 
    try:
        json_datas = {} 
        cur = connection.cursor()
        user_id = request.user.id
        id = request.GET.get(config.id)
                
        if user_id and id:
#         logger_obj.info("function name:PAAddUpdateAssessmentSchedule, attempted by "+str(request.user.username))
            cur.execute(query.fetch_hcms_query(config.learning_development_module,config.ld_fetch_request_training_detail_based_id).format(id,))
            json_datas[config.training_detail] = dictfetchall(cur)
            json_datas[config.status]=status_keys.SUCCESS_STATUS
#           logger_obj.info("function name:PAAddUpdateAssessmentSchedule, request data: schedule_update_id "+str(schedule_update_id)+" attempted by "+str(request.user.username)+"status"+str(json_datas))
        else:
            json_datas[config.status]=status_keys.FAILURE_STATUS
#           logger_obj.info("function name:AddUpdateAssessmentSchedule attempted by "+str(request.user.username)+"status"+str(json_datas))
    except Exception as e:
        json_datas[config.status] = e
#     logger_obj.info("function name:PAAddUpdateAssessmentSchedule attempted by "+str(request.user.username)+"status"+str(json_datas))
    return HttpResponse(json.dumps(json_datas), content_type=config.content_type_value)

     
def request_training_add_update(request):
    '''
    21-Sep-2018 || SND || To Add or Update the Employee Self Request
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse to return the success or error message
    '''  
    try:
        json_datas = {} 
        cur = connection.cursor()
        user_id = request.user.id
        training = ''
        request_for = request.POST.get(config.request_type,'')
        training_id = request.POST.get(config.training_id,'')
        training_name = request.POST.get(config.training_name,'')
        approval_status = request.POST.get(config.approval_status,'')
        manager_name = request.POST.get(config.manager_name,'')
        reason_for_training = request.POST.get(config.reason_for_training,'')
        division_id = request.POST.get(config.division_id,'')
        rejection_reason = request.POST.get(config.rejection_reason,'')
        if request_for == config.E:
            training = config.training_id
        elif request_for == config.N:
            training = config.training_name
            
        if approval_status == config.A:
            approved_on = 'now()'
            rejected_on = 'NULL'
        elif approval_status == config.R:
            approved_on = 'NULL'
            rejected_on = 'now()'
        else:
            approved_on = 'NULL'
            rejected_on = 'NULL'
#         logger_obj.info("function name:PAAddUpdateAssessmentSchedule, attempted by "+str(request.user.username))
        if training_id and user_id:
            if request_for and training_id and training_name and manager_name and reason_for_training and division_id :
                cur.execute(query.fetch_hcms_query(config.learning_development_module,config.ld_employee_request_training_update).format(user_id,training,training_name,request_for,reason_for_training,approval_status,manager_name,rejected_on,
                rejection_reason,approved_on,division_id,training_id))
                return_update_id = dictfetchall(cur)
                if return_update_id:
                    json_datas[config.status]=status_keys.UPDATE_STATUS
                else:
                    json_datas[config.status]=status_keys.FAILURE_STATUS
            else:
                json_datas[config.status]=status_keys.FAILURE_STATUS
#             logger_obj.info("function name:PAAddUpdateAssessmentSchedule, request data: schedule_update_id "+str(schedule_update_id)+" attempted by "+str(request.user.username)+"status"+str(json_datas))
        elif user_id:
            if request_for and training_name and manager_name and reason_for_training and division_id :
                cur.execute(query.fetch_hcms_query(config.learning_development_module,config.ld_employee_request_training_save).format(training,user_id,training_name,request_for,reason_for_training,manager_name,division_id))
                return_add_id = dictfetchall(cur)
                if return_add_id:
                    json_datas[config.status]=status_keys.SUCCESS_STATUS
                else:
                    json_datas[config.status]=status_keys.FAILURE_STATUS
            else:
                json_datas[config.status]=status_keys.FAILURE_STATUS
                
        else:
            json_datas[config.status]=status_keys.FAILURE_STATUS
#             logger_obj.info("function name:AddUpdateAssessmentSchedule attempted by "+str(request.user.username)+"status"+str(json_datas))
    except Exception as e:
        json_datas[config.status] = e
#     logger_obj.info("function name:PAAddUpdateAssessmentSchedule attempted by "+str(request.user.username)+"status"+str(json_datas))
    return HttpResponse(json.dumps(json_datas), content_type=config.content_type_value)


def request_training_delete(request):
    '''
    21-Sep-2018 || SND || To Add or Update the Employee Self Request
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse to return the success or error message
    '''  
    try:
        json_datas = {} 
        cur = connection.cursor()
        user_id = request.user.id
        training_id = request.GET.get(config.training_id)

#         logger_obj.info("function name:PAAddUpdateAssessmentSchedule, attempted by "+str(request.user.username))
        if training_id and user_id:
            cur.execute(query.fetch_hcms_query(config.learning_development_module,config.ld_delete_request_training_detail_based_id).format(user_id,training_id))
            return_delete_id = dictfetchall(cur)
            if return_delete_id:
                json_datas[config.status]=status_keys.REMOVE_STATUS
            else:
                json_datas[config.status]=status_keys.FAILURE_STATUS
        else:
            json_datas[config.status]=status_keys.FAILURE_STATUS
#             logger_obj.info("function name:AddUpdateAssessmentSchedule attempted by "+str(request.user.username)+"status"+str(json_datas))
        
    except Exception as e:
        json_datas[config.status] = e
#     logger_obj.info("function name:PAAddUpdateAssessmentSchedule attempted by "+str(request.user.username)+"status"+str(json_datas))
    return HttpResponse(json.dumps(json_datas), content_type=config.content_type_value)