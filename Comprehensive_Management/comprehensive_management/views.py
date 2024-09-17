# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from _ast import Load
import datetime
import json
import logging.handlers

from django.contrib.auth.decorators import login_required
from django.core import serializers
from django.core.serializers.json import DjangoJSONEncoder
from django.core.serializers.json import DjangoJSONEncoder
from django.db import connection
from django.db import transaction
from django.db.models import Max
from django.http.response import HttpResponse
from django.template.context_processors import request
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic.base import TemplateView

from CSD.JenkinsAPI import jenkins_fetch
from CommonLib import query
from CommonLib.common_controller import dictfetchall
from CommonLib.hcms_common import record_validation 
from Talent_Assessment.talent_assessment.models import HCMS_TA_Assessment_Form
import HCMS.settings as status_keys
import config as c
# Create your views here.
class HCMSbaseEmployeeObjectiveView(TemplateView):  #Added- Bavya-14Feb2018
    ''' 
    14-Feb-2018 || BAV || To Load the Strategic Objective page 
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    template_name = c.template_name
     
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HCMSbaseEmployeeObjectiveView, self).dispatch(request, *args, **kwargs)
         
    def get(self, request, *args, **kwargs):
        context = super(HCMSbaseEmployeeObjectiveView, self).get_context_data(**kwargs)
        return self.render_to_response(context)

def employee_row_click(request):
    ''' 
    02-April-2018 || BAV || To Load the Employee Personal Details
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    try:
        json_datas = {}
        employee_id = request.GET.get(c.employee_id)
        cur=connection.cursor()
        if employee_id:
            cur.execute(query.fetch_hcms_query(c.comprehensive_management, c.comprehensive_employee_personal_fetch).format(employee_id))
            employee_result = dictfetchall(cur)
            if  employee_result[0]:
                if(employee_result[0][c.spouse_name]==c.empty and employee_result[0][c.sdob]==None):
                    employee_result[0][c.spouse_info] = c.empty
                elif(employee_result[0][c.spouse_name]==c.empty and employee_result[0][c.sdob]!=None):
                    employee_result[0][c.spouse_info] = employee_result[0][c.sdob]
                elif(employee_result[0][c.spouse_name]!=c.empty and employee_result[0][c.sdob]==None):
                    employee_result[0][c.spouse_info] = employee_result[0][c.spouse_name]
                elif(employee_result[0][c.spouse_name]!=c.empty and employee_result[0][c.sdob]!=None):
                    employee_result[0][c.spouse_info] = employee_result[0][c.spouse_name]+c.comma+employee_result[0][c.sdob]
                
                if(employee_result[0][c.father_name]==c.empty and employee_result[0][c.fdob]==None):
                    employee_result[0][c.father_info] = c.empty
                elif(employee_result[0][c.father_name]==c.empty and employee_result[0][c.fdob]!=None):
                    employee_result[0][c.father_info] = employee_result[0][c.fdob]
                elif(employee_result[0][c.father_name]!=c.empty and employee_result[0][c.fdob]==None):
                    employee_result[0][c.father_info] = employee_result[0][c.father_name]
                elif(employee_result[0][c.father_name]!=c.empty and employee_result[0][c.fdob]!=None):
                    employee_result[0][c.father_info] = employee_result[0][c.father_name]+c.comma+employee_result[0][c.fdob]
                
                if(employee_result[0][c.mother_name]==c.empty and employee_result[0][c.mdob]==None):
                    employee_result[0][c.mother_info] = c.empty
                elif(employee_result[0][c.mother_name]==c.empty and employee_result[0][c.mdob]!=None):
                    employee_result[0][c.mother_info] = employee_result[0][c.mdob]
                elif(employee_result[0][c.mother_name]!=c.empty and employee_result[0][c.mdob]==None):
                    employee_result[0][c.mother_info] = employee_result[0][c.mother_name]
                elif(employee_result[0][c.mother_name]!=c.empty and employee_result[0][c.mdob]!=None):
                    employee_result[0][c.mother_info] = employee_result[0][c.mother_name]+c.comma+employee_result[0][c.mdob]
                
                if(employee_result[0][c.marital_status]==None and (employee_result[0][c.no_of_children]==None or employee_result[0][c.no_of_children]==c.zero)):
                    employee_result[0][c.marital_info] = c.empty
                elif(employee_result[0][c.marital_status]==None and employee_result[0][c.no_of_children]!=None):
                    employee_result[0][c.marital_info] = employee_result[0][c.no_of_children]+c.children
                elif(employee_result[0][c.marital_status]!=None and employee_result[0][c.no_of_children]==None):
                    employee_result[0][c.marital_info] = employee_result[0][c.marital_status]
                elif(employee_result[0][c.marital_status]!=None and employee_result[0][c.no_of_children]!=None):
                    employee_result[0][c.marital_info] = employee_result[0][c.marital_status]+c.comma+employee_result[0][c.no_of_children]+c.children
                
                for k,v in employee_result[0].iteritems():
                    if v==None:
                        employee_result[0][k] = c.empty
            json_datas[c.status] = employee_result
        else:
            json_datas[c.status] = c.no_data_found
    except Exception as e:
        json_datas[c.status] = e
    return HttpResponse(json.dumps(json_datas))

def employee_education_click(request):
    ''' 
    04-April-2018 || SND || To Load the Employee's Education Details 
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    try:
        json_datas = {}
        employee_id = request.GET.get(c.employee_id)
        cur=connection.cursor()
        if employee_id:
            cur.execute(query.fetch_hcms_query(c.comprehensive_management, c.comprehensive_employee_education_fetch).format(employee_id))
            education_result = dictfetchall(cur)
            json_datas[c.education_result] = education_result  
        else:
            json_datas[c.education_result] = c.no_data_found
    except Exception as e:
        json_datas[c.education_result] = e
    return HttpResponse(json.dumps(json_datas))

def employee_skill_click(request):
    ''' 
    04-April-2018 || SND || To Load the Employee's Skill Details
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    try:
        json_datas = {}
        employee_id = request.GET.get(c.employee_id)
        cur=connection.cursor()
        if employee_id:
            cur.execute(query.fetch_hcms_query(c.comprehensive_management, c.comprehensive_employee_skill_fetch).format(employee_id))
            skill_details = dictfetchall(cur)
            json_datas[c.skills] = skill_details
        else:
            json_datas[c.skills] = c.no_data_found
    except Exception as e:
        json_datas[c.skills] = e
    return HttpResponse(json.dumps(json_datas))

def employee_experience_click(request):
    ''' 
    04-Feb-2018 || SND || To Load the Employee's Experience Details
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    try:
        json_datas = {}
        employee_id = request.GET.get(c.employee_id)
        cur=connection.cursor()
        if employee_id:
            cur.execute(query.fetch_hcms_query(c.comprehensive_management, c.comprehensive_employee_experience_fetch).format(employee_id))
            experience_details = dictfetchall(cur)
            json_datas[c.experience] = experience_details
        else:
            json_datas[c.experience] = c.no_data_found
    except Exception as e:
        json_datas[c.experience] = e
    return HttpResponse(json.dumps(json_datas))

def employee_certification_click(request):
    ''' 
    04-Feb-2018 || SND || To Load the Employee's Certification Details
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    try:
        json_datas = {}
        employee_id = request.GET.get(c.employee_id)
        cur=connection.cursor()
        if employee_id:
            cur.execute(query.fetch_hcms_query(c.comprehensive_management, c.comprehensive_employee_certification_fetch).format(employee_id))
            certification_details = dictfetchall(cur)
            json_datas[c.certification] = certification_details
        else:
            json_datas[c.certification] = c.no_data_found
    except Exception as e:
        json_datas[c.certification] = e
    return HttpResponse(json.dumps(json_datas))

@csrf_exempt       
def employee_assessment_info(request):
    ''' 
    07-APR-2018 || JAN || To Load the Employee's Assessment Details
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    try:
        json_datas = {}
        employee_id = request.POST.get('employee_id')
        cur=connection.cursor()
        if employee_id:
            cur.execute(query.fetch_hcms_query(c.comprehensive_management, c.comprehensive_assessment_form_id_fetch).format(employee_id))
            employee_form_list=cur.fetchall()
            if employee_form_list:
                form_id=max(employee_form_list)
                cur.execute(query.fetch_hcms_query(c.comprehensive_management, c.comprehensive_assessment_kpi_detail_fetch).format(5,1))
#                 cur.execute(query.fetch_hcms_query(c.comprehensive_management, c.comprehensive_assessment_kpi_detail_fetch).format(employee_id,int(form_id[0])))
                kpi_detail=dictfetchall(cur)
                assessment_list=[]
                for i in kpi_detail:
                    assessment_dict={}
                    assessment_dict["kpi_name"]=i['kpi_description']
                    cur.execute(query.fetch_hcms_query(c.comprehensive_management, c.comprehensive_assessment_process_detail_fetch).format(i['form_kpi_id']))
                    process_detail=dictfetchall(cur)
                    assessment_dict['assessment_detail']=process_detail
                    assessment_list.append(assessment_dict)
                json_datas['assessment_info']=assessment_list 
    except Exception as e:
        json_datas['exception'] = e   
    return HttpResponse(json.dumps(json_datas),content_type="application/json")
            
@csrf_exempt       
def employee_objective_info(request):
    ''' 
    09-APR-2018 || JAN || To Load the Employee's Objective Details
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    try:
        json_datas = {}
        employee_id = request.POST.get('employee_id')
        cur=connection.cursor()
        objective_dict={}
        if employee_id:
            cur.execute(query.fetch_hcms_query(c.comprehensive_management,c.comprehensive_employee_objective_form_id_fetch).format(employee_id))
            employee_form_list=cur.fetchall()
            if employee_form_list:
                form_id=max(employee_form_list)
                cur.execute(query.fetch_hcms_query(c.comprehensive_management,c.comprehensive_employee_cascaded_objective_fetch).format(int(form_id[0])))
                objective_dict['cascaded_objective']=dictfetchall(cur)
                cur.execute(query.fetch_hcms_query(c.comprehensive_management,c.comprehensive_employee_role_objective_fetch).format(int(form_id[0])))
                objective_dict['role_objective']=dictfetchall(cur)
                cur.execute(query.fetch_hcms_query(c.comprehensive_management,c.comprehensive_employee_objective_fetch).format(int(form_id[0])))
                objective_dict['employee_objective']=dictfetchall(cur)
            json_datas['objective_detail']=objective_dict  
    except Exception as e:
        json_datas['exception'] = e    
    return HttpResponse(json.dumps(json_datas),content_type="application/json")