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
logger_obj = logging.getLogger('logit')

class HCMSPerformanceassessment(TemplateView):  #Added- BAV-27AUG2018
    ''' 
    27-AUG-2018 || BAV || To HCMS Performance assessment form page loaded.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
        
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HCMSPerformanceassessment, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Performance Assessment', self.request.user.id)
        if macl:
            template_name = config.performance_assessment_template
        else:
            template_name = "tags/access_denied.html"
        return [template_name]
    
    
    def get(self, request, *args, **kwargs):
        cur=connection.cursor() 
        context = super(HCMSPerformanceassessment, self).get_context_data(**kwargs)
        try:
            cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.fetch_organization_details_view))
            org_info=dictfetchall(cur)
            context[config.organization]=org_info
            logger_obj.info("Performance Assessment form Page Load  attempted by "+str(request.user.username))    
        except Exception as e:
            context[config.exception] = e
            logger_obj.info("Performance Assessment form Load data exception"+ str(e) +" attempted by "+str(request.user.username))    
        cur.close()    
        return self.render_to_response(context)
    
    
def organization_unit(request):
    ''' 
    27-AUG-2018 || BAV || To HCMS Performance assessment  organization onchange form page loaded.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    try:
        cur=connection.cursor()
        cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.fetch_organization_unit_details_view),(request.GET.get('str_org_id')))
        json_data[config.status]=dictfetchall(cur)
        cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.fetch_org_employee_details_view),(request.GET.get('str_org_id')))
        json_data[config.employee_data]=dictfetchall(cur)
    except Exception as e:
            json_data[config.status] = e
            logger_obj.info("Performance Assessment form Load data exception"+ str(e) +" attempted by "+str(request.user.username))    
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def organization_unit_view(request):
    ''' 
    27-AUG-2018 || BAV || To HCMS Performance assessment  organization unit onchange form page loaded.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    try:
        cur=connection.cursor()
        cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.fetch_division_details_view),(request.GET.get('str_org_unit_id')))
        json_data[config.status]=dictfetchall(cur)
        cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.fetch_org_unit_employee_details),(request.GET.get('str_org_id'),request.GET.get('str_org_unit_id')))
        json_data[config.employee_data]=dictfetchall(cur) 
    except Exception as e:
            json_data[config.status] = e
            logger_obj.info("Performance Assessment form Load data exception"+ str(e) +" attempted by "+str(request.user.username))    
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def organization_division_view(request):
    ''' 
    28-AUG-2018 || BAV || To HCMS Performance assessment Division onchange form page loaded.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    try:
        cur=connection.cursor()
        cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.fetch_division_employee_details),(request.GET.get('str_org_id'),request.GET.get('str_org_unit_id'),request.GET.get('str_div_id'),))
        json_data[config.employee_data]=dictfetchall(cur) 
    except Exception as e:
            json_data[config.status] = e
            logger_obj.info("Performance Assessment form Load data exception"+ str(e) +" attempted by "+str(request.user.username))    
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)
    
def performance_assessment_table(request):
    ''' 
    28-AUG-2018 || BAV || To HCMS Performance assessment Table View loaded.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    try:
        cur=connection.cursor()
        if request.GET.get('year') !='0' and request.GET.get('year') =='0':
            cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.fetch_performance_assessment_table_view_year),(tuple(json.loads(request.GET.get('employee_name'))),request.GET.get('year'),))
            json_data[config.status]=dictfetchall(cur)
        elif request.GET.get('quarter') !='0':
            if request.GET.get('year') !='0':
                cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.fetch_performance_assessment_table_view_quarter),(tuple(json.loads(request.GET.get('employee_name'))),request.GET.get('year'),request.GET.get('quarter'),))
                json_data[config.status]=dictfetchall(cur)
            else:
                json_data[config.status]="year" 
        else:
            cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.fetch_performance_assessment_table_view),(tuple(json.loads(request.GET.get('employee_name'))),))
            json_data[config.status]=dictfetchall(cur) 
    except Exception as e:
            json_data[config.status] = e
            logger_obj.info("Performance Assessment form Load data exception"+ str(e) +" attempted by "+str(request.user.username))    
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def performance_kpi_kr_data(request):
    ''' 
    28-AUG-2018 || BAV || To HCMS Performance KPI and KR View loaded.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    result = []
    try:
        cur=connection.cursor()
        cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.fetch_assessor_id),(request.user.id,))
        json_data[config.rel_user]=dictfetchall(cur)
        if json_data[config.rel_user]:
            cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.fetch_performance_assessor_data),(request.GET.get('id'),json_data[config.rel_user][0]['id'],request.GET.get('id')))
            json_data[config.assessor_data]=dictfetchall(cur) 
            if json_data[config.assessor_data]:
                json_data[config.assessor_type_refitem_id]=json_data[config.assessor_data][0][config.assessor_type_refitem_id]
                json_data[config.employee_data]=json_data[config.assessor_data][0][config.assessment_form_employee_id]
                cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.fetch_performance_kr_data),(request.GET.get('id'),))
                json_data[config.kr_data]=dictfetchall(cur)
                cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.fetch_performance_kpi_data),(request.GET.get('id'),))
                json_data[config.kpi_data]=dictfetchall(cur) 
                cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.performance_kpi_rating_check),(request.GET.get('id'),json_data[config.rel_user][0]['id'],))
                json_data[config.status]=dictfetchall(cur) 
                cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.performance_kr_rating_check),(request.GET.get('id'),json_data[config.rel_user][0]['id'],))
                json_data[config.status_kr]=dictfetchall(cur)
                cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.fetch_ass_feedback),(request.GET.get('id'),json_data[config.rel_user][0]['id'],))
                json_data[config.feedback]=dictfetchall(cur)
                
                cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.fetch_info_viwer_role),(json_data[config.rel_user][0]['id'],request.GET.get('id'),))
                json_data[config.fetch_info_viwer_role]=dictfetchall(cur)
                if json_data[config.fetch_info_viwer_role]:
                    cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.fetch_matrix_viwer_role),(json_data[config.fetch_info_viwer_role][0]['ref_id'],request.GET.get('id'),))
                    json_data[config.fetch_matrix_viwer_role]=dictfetchall(cur)
            result.append("Success")
        else:
            result.append("Failed")
        json_data['user'] = result
    except Exception as e:
            json_data[config.status] = e
            logger_obj.info("Performance Assessment form Load data exception"+ str(e) +" attempted by "+str(request.user.username))   
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def assessment_rating_save(request):
    ''' 
    30-AUG-2018 || BAV || To HCMS Assessment Rating Save loaded.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    try:
        cur=connection.cursor()
        data = json.loads(request.GET.get('kpi_data'))
        if data:
            cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.fetch_assessor_id),(request.user.id,))
            json_data[config.rel_user]=dictfetchall(cur)
            for i in data:
                if i['ratingName'] == 'KPI':
                    cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.performance_ass_rating_insert),(i['rating'],
                                    i['form_id'],i['id'],i['ref_id'],json_data[config.rel_user][0]['id'],request.user.id,i['employee_id']))
                    json_data[config.kpi_data]=dictfetchall(cur) 
                    cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.ass_feedback_update),(json.loads(request.GET.get('feed_back')),json.loads(request.GET.get('learning_pointers')),request.user.id,i['form_id'],json_data[config.rel_user][0]['id'],))
                if i['ratingName'] == 'KR':
                    cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.performance_ass_kr_rating_insert),(i['rating'],
                                i['form_id'],i['id'],i['ref_id'],json_data[config.rel_user][0]['id'],json_data[config.rel_user][0]['id'],i['employee_id']))
                    json_data[config.kpi_data]=dictfetchall(cur)
                    cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.ass_feedback_update),(json.loads(request.GET.get('feed_back')),json.loads(request.GET.get('learning_pointers')),request.user.id,i['form_id'],json_data[config.rel_user][0]['id'],))
            json_data[config.status] = "Added successfully"
    except Exception as e:
        json_data[config.status] = e
        logger_obj.info("Performance Assessment form Load data exception"+ str(e) +" attempted by "+str(request.user.username))    
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def assessment_rating_update(request):
    ''' 
    30-AUG-2018 || BAV || To HCMS Assessment Rating Update loaded.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    try:
        cur=connection.cursor()
        data = json.loads(request.GET.get('kpi_data'))
        if data:
            cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.fetch_assessor_id),(request.user.id,))
            json_data[config.rel_user]=dictfetchall(cur)
            for i in data:
                if i['ratingName'] == 'KPI' and i['rating_id']!='':
                    cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.performance_ass_rating_update),(i['rating'],
                                    request.user.id,i['rating_id'],))
                    json_data[config.kpi_data]=dictfetchall(cur) 
                    cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.ass_feedback_update),(json.loads(request.GET.get('feed_back')),json.loads(request.GET.get('learning_pointers')),request.user.id,i['form_id'],json_data[config.rel_user][0]['id'],))
                    json_data['key'] = "Updated successfully"
                if i['ratingName'] == 'KR' and i['rating_id']!='':
                    cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.performance_ass_kr_rating_update),(i['rating'],
                                    request.user.id,i['rating_id'],))
                    json_data[config.kpi_data]=dictfetchall(cur)
                    cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.ass_feedback_update),(json.loads(request.GET.get('feed_back')),json.loads(request.GET.get('learning_pointers')),request.user.id,i['form_id'],json_data[config.rel_user][0]['id'],))
                    json_data['key'] = "Updated successfully"
    except Exception as e:
        json_data[config.status] = e
        logger_obj.info("Performance Assessment form Load data exception"+ str(e) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def pm_ass_employee_details(request):
    ''' 
    04-SEP-2018 || BAV || To HCMS Assessment Employee loaded.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    try:
        cur=connection.cursor()
        cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.fetch_pm_info_employee),(request.GET.get('over_id'),request.GET.get('id'),))
        json_data[config.fetch_pm_info_employee]=dictfetchall(cur)
    except Exception as e:
        json_data[config.status] = e
        logger_obj.info("Performance Assessment form Load data exception"+ str(e) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def pm_ass_employee_rating(request):
    ''' 
    05-SEP-2018 || BAV || To HCMS Assessment Employee Rating loaded.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    try:
        cur=connection.cursor()
        cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.fetch_assessor_id),(request.user.id,))
        json_data[config.rel_user]=dictfetchall(cur)
        cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.fetch_performance_assessor_data),(request.GET.get('id'),json_data[config.rel_user][0]['id'],request.GET.get('id')))
        json_data[config.assessor_data]=dictfetchall(cur) 
#         if json_data[config.assessor_data]:
        json_data[config.assessor_type_refitem_id]=json_data[config.assessor_data][0][config.assessor_type_refitem_id]
        json_data[config.employee_data]=json_data[config.assessor_data][0][config.assessment_form_employee_id]
        cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.fetch_performance_kr_data),(request.GET.get('id'),))
        json_data[config.kr_data]=dictfetchall(cur)
        cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.fetch_performance_kpi_data),(request.GET.get('id'),))
        json_data[config.kpi_data]=dictfetchall(cur) 
        cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.performance_kpi_rating_check),(request.GET.get('id'),request.GET.get('emp_id'),))
        json_data[config.status]=dictfetchall(cur) 
        cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.performance_kr_rating_check),(request.GET.get('id'),request.GET.get('emp_id'),))
        json_data[config.status_kr]=dictfetchall(cur)
        cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.fetch_ass_feedback),(request.GET.get('id'),request.GET.get('emp_id'),))
        json_data[config.feedback]=dictfetchall(cur)
        if json_data[config.rel_user]:
            if  str(json_data[config.rel_user][0]['id']) == str(request.GET.get('emp_id')):
                json_data["key"] = "Assessor"
            else:
                json_data["key"] = "Employee"
    except Exception as e:
            json_data[config.status] = e
            logger_obj.info("Performance Assessment form Load data exception"+ str(e) +" attempted by "+str(request.user.username))    
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)