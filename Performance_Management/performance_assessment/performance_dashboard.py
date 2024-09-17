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
import performance_dashboard_config as dashboard_config
logger_obj = logging.getLogger('logit')


class HCMSPerformanceDashboard(TemplateView):  #Added- BAV-27AUG2018
    ''' 
    11-SEP-2018 || ESA || To HCMS Performance Dashboard  page loaded.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
        
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HCMSPerformanceDashboard, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Performance Dashboard', self.request.user.id)
        if macl:
            template_name = dashboard_config.performance_dashboard
        else:
            template_name = "tags/access_denied.html"
        return [template_name]
    
    def get(self, request, *args, **kwargs):
        cur=connection.cursor() 
        context = super(HCMSPerformanceDashboard, self).get_context_data(**kwargs)
        try:
            cur.execute(query.fetch_hcms_query(dashboard_config.performance_assessment_module,dashboard_config.fetch_organization_details_view))
            org_info=dictfetchall(cur)
            context[dashboard_config.organization]=org_info
            logger_obj.info("performance dashboard Page Load  attempted by "+str(request.user.username))    
        except Exception as e:
            context[config.exception] = e
            logger_obj.info("performance dashboard Load data exception"+ str(e) +" attempted by "+str(request.user.username))    
        cur.close()  
        return self.render_to_response(context)
    
    
def pmd_organization_unit(request):
    '''
    22-SEP-2018 || BAV || To Fetch Org Unit Data 
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse to return the success or error message
    '''
    json_data = {} 
    if request.method=='GET' :
        try:
            if request.user.id:
                cur = connection.cursor()
                cur.execute(query.fetch_hcms_query(dashboard_config.performance_assessment_module,config.fetch_organization_unit_details_view),(request.GET.get('str_org_id'),))
                json_data[config.status]=dictfetchall(cur)
        except Exception as e:    
            result = e
            logger_obj.info("performance dashboard employee org data fetch exception as"+ str(result) +" attempted by "+str(request.user.username))
        cur.close()  
        return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=dashboard_config.content_type_value)

def pmd_division_view(request):
    '''
    22-SEP-2018 || BAV || To Fetch Division Data 
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse to return the success or error message
    '''
    json_data = {} 
    if request.method=='GET' :
        try:
            if request.user.id:
                cur = connection.cursor()
                cur.execute(query.fetch_hcms_query(dashboard_config.performance_assessment_module,config.fetch_division_details_view),(request.GET.get('str_org_unit_id'),))
                json_data[config.status]=dictfetchall(cur)
        except Exception as e:    
            result = e
            logger_obj.info("performance dashboard employee org data fetch exception as"+ str(result) +" attempted by "+str(request.user.username))
        cur.close()  
        return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=dashboard_config.content_type_value)


def pm_dashboard_employee_org(request):
    '''
    12-SEP-2018 || ESA || To Fetch the employee org data 
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse to return the success or error message
    '''
    json_data = {} 
    json_data['emp_org']=[]
    json_data['org']=[]
    print "sssssssssssss",request.user.id
    if request.method=='GET' :
        try:
            if request.user.id:
                cur = connection.cursor()
                cur.execute(query.fetch_hcms_query(dashboard_config.performance_assessment_module,dashboard_config.employee_org_id).format(request.user.id))
                employee_org_info=dictfetchall(cur)
                cur.execute(query.fetch_hcms_query(dashboard_config.performance_assessment_module,dashboard_config.fetch_organization_details_view))
                org_info=dictfetchall(cur)
                json_data['emp_org']=employee_org_info
                json_data['org']=org_info
            else:
                json_data[dashboard_config.status]=status_keys.SUCCESS_STATUS
                json_data['emp_org']=[]
                json_data['org']=[]
        except Exception as e:    
            result = e
            json_data['emp_org']=[]
            json_data['org']=[]
            logger_obj.info("performance dashboard employee org data fetch exception as"+ str(result) +" attempted by "+str(request.user.username))
        cur.close()  
        return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=dashboard_config.content_type_value)
    
def pm_dashboard_organization_perspective(request):
    '''
    11-SEP-2018 || ESA || To Fetch the perspective chart data 
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse to return the success or error message
    '''
    json_data = {} 
    try:
     if request.user.id:
         if request.method=='GET':
            year=request.GET.get(dashboard_config.year)
            quarter=request.GET.get(dashboard_config.quarter)
            organization=request.GET.get('org')
            cur = connection.cursor()
            if year!='0' and quarter!='0' and organization!='0':
                cur.execute(query.fetch_hcms_query(dashboard_config.performance_assessment_module,dashboard_config.org_perspective_data).format(organization,quarter,year,))
                perspective_data = dictfetchall(cur)
                json_data['perspctive_info']=perspective_data
            else:
                json_data['perspctive_info']=[]
           
     else:
          json_data[dashboard_config.status]=status_keys.SUCCESS_STATUS
          json_data['perspctive_info']=[]
    except Exception as e:    
        result = e
        json_data['perspctive_info']=[]
        logger_obj.info("performance dashboard perspective fetch exception as"+ str(result) +" attempted by "+str(request.user.username))

    cur.close()  
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=dashboard_config.content_type_value)


def performance_rating_data(request):
    ''' 
    11-SEP-2018 || BAV || To HCMS Employee Top Performance Rating .
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    json_result = {}
    try:
        cur=connection.cursor()
        cur.execute(query.fetch_hcms_query(dashboard_config.performance_assessment_module,dashboard_config.performance_employee_data),(request.GET.get('year'),request.GET.get('org'),request.GET.get('quarter'),))
        json_data[config.status]=dictfetchall(cur)
        if json_data[config.status]:
            if not(json_data[config.status][0]['id'] is None):
                cur.execute(query.fetch_hcms_query(dashboard_config.performance_assessment_module,dashboard_config.performance_employee_top_rating),(tuple(json_data[config.status][0]['id']),))
                json_result[config.status]=dictfetchall(cur)
    except Exception as e:
            json_data[config.status] = e
            logger_obj.info("Performance Assessment form Load data exception"+ str(e) +" attempted by "+str(request.user.username)) 
    return HttpResponse(json.dumps(json_result,cls=DjangoJSONEncoder), content_type=config.content_type_value)

    
def performance_division_data(request):
    ''' 
    14-SEP-2018 || BAV || To HCMS Division Data Load.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    try:
        cur=connection.cursor()
        cur.execute(query.fetch_hcms_query(dashboard_config.performance_assessment_module,dashboard_config.orgunit_org_division),(request.GET.get('org'),))
        json_data[dashboard_config.status]=dictfetchall(cur)
        cur.execute(query.fetch_hcms_query(dashboard_config.performance_assessment_module,dashboard_config.org_division),(tuple(json_data[dashboard_config.status][0]['id']),))
        json_data[dashboard_config.organization]=dictfetchall(cur)
        if json_data[dashboard_config.organization]:
            json_list=[]
            for i in json_data[dashboard_config.organization]:
                json_result = {}
                cur.execute(query.fetch_hcms_query(dashboard_config.performance_assessment_module,dashboard_config.org_division_complition).format(i['id'],request.GET.get('year'),request.GET.get('quarter')))
                json_data[dashboard_config.status_objective]=dictfetchall(cur)
                cur.execute(query.fetch_hcms_query(dashboard_config.performance_assessment_module,dashboard_config.perfor_division_complition).format(i['id'],request.GET.get('year'),request.GET.get('quarter')))
                json_data[dashboard_config.status_org]=dictfetchall(cur)
                if json_data[dashboard_config.status_objective]:
                    json_result['orgunit_name']  = json_data[dashboard_config.status_objective][0]['name']
                    json_result['orgunit_div_count']  = json_data[dashboard_config.status_objective][0]['org_count']
                    json_result['competition'] = json_data[dashboard_config.status_org][0]['competition']
                    str_obj_id = json_data[dashboard_config.status_objective][0]['id']
                    cur.execute(query.fetch_hcms_query(dashboard_config.performance_assessment_module,dashboard_config.performance_orgunit_expect),(tuple(str_obj_id),))
                    json_data[dashboard_config.status_complition]=dictfetchall(cur)
                    json_result['expect']=json_data[dashboard_config.status_complition][0]['expect']
                    json_list.append(json_result)
    except Exception as e:
            json_data[dashboard_config.status] = e
            logger_obj.info("Performance Assessment form Load data exception"+ str(e) +" attempted by "+str(request.user.username)) 
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=dashboard_config.content_type_value)

def performance_rating_data_division(request):
    ''' 
    24-SEP-2018 || BAV || To HCMS Division Data Load.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    json_result = {}
    try:
        cur=connection.cursor()
        if request.GET.get('division_id'):
            #                   Employee Rating data
            cur.execute(query.fetch_hcms_query(dashboard_config.performance_assessment_module,dashboard_config.performance_employee_data),(request.GET.get('year'),request.GET.get('org'),request.GET.get('quarter'),))
            json_data[config.status]=dictfetchall(cur)
            if json_data[config.status]:
                if not(json_data[config.status][0]['id'] is None):
                    if request.GET.get('org_unit') !='0' and request.GET.get('division_id') =='0':
                        cur.execute(query.fetch_hcms_query(dashboard_config.performance_assessment_module,dashboard_config.performance_employee_top_rating_org),(tuple(json_data[config.status][0]['id']),tuple(request.GET.get('org_unit')),))
                        json_result[config.status]=dictfetchall(cur)
                    else:
                        cur.execute(query.fetch_hcms_query(dashboard_config.performance_assessment_module,dashboard_config.performance_employee_top_rating_division),(tuple(json_data[config.status][0]['id']),request.GET.get('org_unit'),request.GET.get('division_id'),))
                        json_result[config.status]=dictfetchall(cur)
    except Exception as e:
            json_data[config.status] = e
            logger_obj.info("Performance Assessment form Load data exception"+ str(e) +" attempted by "+str(request.user.username)) 
    return HttpResponse(json.dumps(json_result,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def pmd_division_change(request):
    ''' 
    24-SEP-2018 || BAV || To HCMS Division Data Load.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    try:
        cur=connection.cursor()
        json_list=[]
        if request.GET.get('org_unit') !='0' and request.GET.get('division_id') =='0':
            cur.execute(query.fetch_hcms_query(dashboard_config.performance_assessment_module,dashboard_config.org_division),(tuple(request.GET.get('org_unit')),))
            json_data[dashboard_config.organization]=dictfetchall(cur)
            if json_data[dashboard_config.organization]:
                for i in json_data[dashboard_config.organization]:
                    json_result = {}
                    cur.execute(query.fetch_hcms_query(dashboard_config.performance_assessment_module,dashboard_config.org_division_complition).format(i['id'],request.GET.get('year'),request.GET.get('quarter')))
                    json_data[dashboard_config.status_objective]=dictfetchall(cur)
                    cur.execute(query.fetch_hcms_query(dashboard_config.performance_assessment_module,dashboard_config.perfor_division_complition).format(i['id'],request.GET.get('year'),request.GET.get('quarter')))
                    json_data[dashboard_config.status_org]=dictfetchall(cur)
                    if json_data[dashboard_config.status_objective]:
                        json_result['orgunit_name']  = json_data[dashboard_config.status_objective][0]['name']
                        json_result['orgunit_div_count']  = json_data[dashboard_config.status_objective][0]['org_count']
                        json_result['competition'] = json_data[dashboard_config.status_org][0]['competition']
                        str_obj_id = json_data[dashboard_config.status_objective][0]['id']
                        cur.execute(query.fetch_hcms_query(dashboard_config.performance_assessment_module,dashboard_config.performance_orgunit_expect),(tuple(str_obj_id),))
                        json_data[dashboard_config.status_complition]=dictfetchall(cur)
                        json_result['expect']=json_data[dashboard_config.status_complition][0]['expect']
                        json_list.append(json_result)
        else:
            json_result = {}
#                     Emplopyee Division data
            cur.execute(query.fetch_hcms_query(dashboard_config.performance_assessment_module,dashboard_config.org_division_complition).format(request.GET.get('division_id'),request.GET.get('year'),request.GET.get('quarter')))
            json_data[dashboard_config.status_objective]=dictfetchall(cur)
            cur.execute(query.fetch_hcms_query(dashboard_config.performance_assessment_module,dashboard_config.perfor_division_complition).format(request.GET.get('division_id'),request.GET.get('year'),request.GET.get('quarter')))
            json_data[dashboard_config.status_org]=dictfetchall(cur)
            if json_data[dashboard_config.status_objective]:
                json_result['orgunit_name']  = json_data[dashboard_config.status_objective][0]['name']
                json_result['orgunit_div_count']  = json_data[dashboard_config.status_objective][0]['org_count']
                json_result['competition'] = json_data[dashboard_config.status_org][0]['competition']
                str_obj_id = json_data[dashboard_config.status_objective][0]['id']
                cur.execute(query.fetch_hcms_query(dashboard_config.performance_assessment_module,dashboard_config.performance_orgunit_expect),(tuple(str_obj_id),))
                json_data[dashboard_config.status_complition]=dictfetchall(cur)
                json_result['expect']=json_data[dashboard_config.status_complition][0]['expect']
                json_list.append(json_result)
    except Exception as e:
            json_data[dashboard_config.status] = e
            logger_obj.info("Performance Assessment form Load data exception"+ str(e) +" attempted by "+str(request.user.username)) 
    return HttpResponse(json.dumps(json_list,cls=DjangoJSONEncoder), content_type=dashboard_config.content_type_value)
def objectives_perspective(request):
    '''
    11-SEP-2018 || SND || To Fetch the Objectives perspective data 
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse to return the success or error message
    '''
    jsonData = {} 
    user_id = request.user.id
    try:
        if user_id:
            cur = connection.cursor()
            year = request.GET.get(dashboard_config.year)
            quarter = request.GET.get(dashboard_config.quarter)
            organization = request.GET.get(dashboard_config.organization)
            if year and quarter and organization:    
                cur.execute(query.fetch_hcms_query(dashboard_config.performance_assessment_module,dashboard_config.obj_perspective_data).format(int(year),int(quarter),int(organization),''))
                perspective_data = dictfetchall(cur)
                jsonData[dashboard_config.perspective_data] = perspective_data
                if perspective_data:
                    jsonData[dashboard_config.status] = status_keys.SUCCESS_STATUS
                else:
                    jsonData[dashboard_config.status] = status_keys.FAILURE_STATUS
            else:
                jsonData[dashboard_config.status] = status_keys.FAILURE_STATUS
        else:
            jsonData[dashboard_config.status] = status_keys.FAILURE_STATUS
    except Exception as e:    
        result = e
        logger_obj.info("Performance dashboard perspective fetch exception as"+ str(result) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(jsonData,cls=DjangoJSONEncoder), content_type=dashboard_config.content_type_value)

def objectives_perspective_click(request):
    '''
    11-SEP-2018 || SND || To Fetch the Objectives perspective data 
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse to return the success or error message
    '''
    jsonData = {} 
    user_id = request.user.id
    try:
        if user_id:
            cur = connection.cursor()
            year = request.GET.get(dashboard_config.year)
            quarter = request.GET.get(dashboard_config.quarter)
            organization = request.GET.get(dashboard_config.organization)
            bsc_perspective = request.GET.get(dashboard_config.bsc_perspective)
            condition = ''
            if bsc_perspective:
                condition = dashboard_config.condition.format(bsc_perspective) 
            if year and quarter and organization and condition!='':
                cur.execute(query.fetch_hcms_query(dashboard_config.performance_assessment_module,dashboard_config.obj_perspective_data).format(int(year),int(quarter),int(organization),condition))
                respective_perspective_data = dictfetchall(cur)
                jsonData[dashboard_config.bsc_perspective_data] = respective_perspective_data
                if respective_perspective_data:
                    jsonData[dashboard_config.status] = status_keys.SUCCESS_STATUS
                else:
                    jsonData[dashboard_config.status] = status_keys.FAILURE_STATUS
            else:
                jsonData[dashboard_config.status] = status_keys.FAILURE_STATUS
        else:
            jsonData[dashboard_config.status] = status_keys.FAILURE_STATUS
    except Exception as e:  
        result = e
        logger_obj.info("performance dashboard perspective fetch exception as"+ str(result) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(jsonData,cls=DjangoJSONEncoder), content_type=dashboard_config.content_type_value)
