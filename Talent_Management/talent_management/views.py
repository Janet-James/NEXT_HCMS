# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import json
import config
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.http.response import HttpResponse, JsonResponse
from CommonLib import query
from django.db import connection
from CSD.JenkinsAPI import jenkins_fetch

import datetime
from dateutil import relativedelta
from HCMS_System_Admin.system_admin.models import Reference_Item_Category, Reference_Items
# from .models import HCMS_TM_Competency_Assessment, HCMS_TM_CompAssess_Accolades
from CommonLib.hcms_common import refitem_fetch, record_validation

import HCMS.settings as status_keys
import logging
import logging.handlers
import requests
import time
logger_obj = logging.getLogger('logit')

class TMTalentProfiling(TemplateView):
    ''' 
    18-Sep-2018 || SMI || To load Talent Profiling page
    @param request: Request Object
    @type request : Object
    @return: HttpResponse or Redirect the another URL
    @author: SMI
    '''
    template_name = "talent_management/tm_talent_profile.html"
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(TMTalentProfiling, self).dispatch(request, *args, **kwargs)
    
    def get(self, request, *args, **kwargs):
        cur = connection.cursor()
        context = super(TMTalentProfiling, self).get_context_data(**kwargs)
        cur.execute(query.fetch_hcms_query(config.talent_management, config.tm_fetch_org_list))
        context['tm_org'] = query.dictfetchall(cur)
        return self.render_to_response(context)
    
class TMCompetencyAssessment(TemplateView):
    ''' 
    18-Sep-2018 || SMI || To load Competency Assessment page
    @param request: Request Object
    @type request : Object
    @return: HttpResponse or Redirect the another URL
    @author: SMI
    '''
    template_name = "talent_management/tm_competency_assessment.html"
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(TMCompetencyAssessment, self).dispatch(request, *args, **kwargs)
    
    def get(self, request, *args, **kwargs):
        cur = connection.cursor()
        context = super(TMCompetencyAssessment, self).get_context_data(**kwargs)
        cur.execute(query.fetch_hcms_query(config.talent_management, config.tm_fetch_org_list))
        context['tm_org'] = query.dictfetchall(cur)
        user_id = request.user.id
        cur.execute(query.fetch_hcms_query(config.talent_management, config.fetch_user_details),(int(user_id),))
        context['user_details'] = query.dictfetchall(cur)
        cur.execute(query.fetch_hcms_query(config.talent_management, config.fetch_emp_details),(int(user_id),))
        context['emp_details'] = query.dictfetchall(cur)
        return self.render_to_response(context)
    
class TMTalentMatrix(TemplateView):
    ''' 
    18-Sep-2018 || SMI || To load Talent Matrix page
    @param request: Request Object
    @type request : Object
    @return: HttpResponse or Redirect the another URL
    @author: SMI
    '''
    template_name = "talent_management/tm_talent_matrix.html"
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(TMTalentMatrix, self).dispatch(request, *args, **kwargs)
    
    def get(self, request, *args, **kwargs):
        cur = connection.cursor()
        context = super(TMTalentMatrix, self).get_context_data(**kwargs)
        cur.execute(query.fetch_hcms_query(config.talent_management, config.tm_fetch_org_list))
        context['tm_org'] = query.dictfetchall(cur)
        return self.render_to_response(context)
    
class TMManageAccolades(TemplateView):
    ''' 
    26-Sep-2018 || SMI || To load Manage Accolades page
    @param request: Request Object
    @type request : Object
    @return: HttpResponse or Redirect the another URL
    @author: SMI
    '''
    template_name = "talent_management/tm_manage_accolades.html"
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(TMManageAccolades, self).dispatch(request, *args, **kwargs)
    
    def get(self, request, *args, **kwargs):
        cur = connection.cursor()
        context = super(TMManageAccolades, self).get_context_data(**kwargs)
        cur.execute(query.fetch_hcms_query(config.talent_management, config.tm_fetch_org_list))
        context['tm_org'] = query.dictfetchall(cur)
        return self.render_to_response(context)
    
class TMMyTalentProfile(TemplateView):
    ''' 
    26-Sep-2018 || SMI || To load My Talent Profile page
    @param request: Request Object
    @type request : Object
    @return: HttpResponse or Redirect the another URL
    @author: SMI
    '''
    template_name = "talent_management/tm_my_talent_profile.html"
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(TMMyTalentProfile, self).dispatch(request, *args, **kwargs)
    
    def get(self, request, *args, **kwargs):
        cur = connection.cursor()
        context = super(TMMyTalentProfile, self).get_context_data(**kwargs)
        return self.render_to_response(context)

@csrf_exempt
def tm_org_unit(request):
    '''
        19-SEP-2018 || MST || To fetch the Org. Unit list
        @param request: Request Object
        @type request : Object
        @return: HttpResponse or Redirect the another URL
    '''
    json_data = {}
    cur = connection.cursor()
    uid = request.user.id
    if not uid:
        uid = 1
    if request.method == "POST":
        try:
            logger_obj.info("Fetching Org. Unit list initiated by "+str(request.user.username))
            org_id = request.POST.get("org_id")
            cur.execute(query.fetch_hcms_query(config.talent_management, config.tm_fetch_org_unit_list),(int(org_id),))
            json_data['sel_org_unit'] = query.dictfetchall(cur)
        except Exception as e:
            json_data["status"] = status_keys.FAILURE_STATUS
            logger_obj.error("Fetching Org. Unit list error is "+ str(e) +" and status is "+ str(json_data['status']) +" attempted by "+str(request.user.username))
        logger_obj.info("Fetching Org. Unit list response is "+ str(json_data) +" attempted by "+str(request.user.username))
        return HttpResponse(json.dumps(json_data))

@csrf_exempt
def tm_division(request):
    '''
        19-SEP-2018 || MST || To fetch the Departement list
        @param request: Request Object
        @type request : Object
        @return: HttpResponse or Redirect the another URL
    '''
    try:
        json_data = {}
        cur = connection.cursor()
        uid = request.user.id
        if not uid:
            uid = 1
        if request.method == "POST":
            logger_obj.info("Fetching Department/Division list initiated by "+str(request.user.username))
            org_id = request.POST.get("org_id")
            org_unit_id = request.POST.get("org_unit_id")
            cur.execute(query.fetch_hcms_query(config.talent_management, config.tm_fetch_dept_list),(org_id, org_unit_id,))
            json_data['sel_division'] = query.dictfetchall(cur)
    except Exception as e:
        json_data["status"] = status_keys.FAILURE_STATUS
        logger_obj.error("Fetching Department/Division list error is "+ str(e) +" and status is "+ str(json_data['status']) +" attempted by "+str(request.user.username))
    logger_obj.info("Fetching Department/Division list response is "+ str(json_data) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data))

@csrf_exempt
def tm_employee_list(request):
    '''
        19-SEP-2018 || MST || To fetch the Departement list
        @param request: Request Object
        @type request : Object
        @return: HttpResponse or Redirect the another URL
    '''
    try:
        json_data = {}
        cur = connection.cursor()
        uid = request.user.id
        if not uid:
            uid = 1
        if request.method == "POST":
            logger_obj.info("Fetching Employee list initiated by "+str(request.user.username))
            org_id = request.POST.get("org_id")
            org_unit_id = request.POST.get("org_unit_id")
            division_id = request.POST.get("division_id")
            cur.execute(query.fetch_hcms_query(config.talent_management, config.tm_fetch_emp_list),(org_id, org_unit_id, division_id, ))
            json_data['sel_employee'] = query.dictfetchall(cur)
    except Exception as e:
        json_data["status"] = status_keys.FAILURE_STATUS
        logger_obj.error("Fetching Employee list error is "+ str(e) +" and status is "+ str(json_data['status']) +" attempted by "+str(request.user.username))
    logger_obj.info("Fetching Employee list response is "+ str(json_data) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data))

@csrf_exempt
def tm_emp_profile(request):
    '''
        19-SEP-2018 || MST || To fetch the Department list
        @param request: Request Object
        @type request : Object
        @return: HttpResponse or Redirect the another URL
    '''
    try:
        json_data = {}
        cur = connection.cursor()
        uid = request.user.id
        if not uid:
            uid = 1
        cur.execute(query.fetch_hcms_query(config.talent_management, config.tm_tp_fetch_eid),(uid,))
        user_id = query.dictfetchall(cur)
        if request.method == "POST":
            logger_obj.info("Fetching Employee Profile list initiated by "+str(request.user.username))
            emp_id = request.POST.get("emp_id")
            if emp_id == None:
                emp_id = user_id[0]['id']
            cur.execute(query.fetch_hcms_query(config.talent_management, config.tm_emp_profile),(emp_id, ))
            json_data['emp_profile'] = query.dictfetchall(cur)
            cur_date = datetime.datetime.now()
            if json_data['emp_profile'][0]['joining_date'] != None:
                joining_date = json_data['emp_profile'][0]['joining_date'].split('/')
                json_data['joining_year'] = int(joining_date[2])
                joining_date = datetime.datetime(int(joining_date[2]),int(joining_date[1]), int(joining_date[0]))
                delta = relativedelta.relativedelta(cur_date, joining_date)
                json_data['total_years'] = delta.years
    except Exception as e:
        json_data["status"] = status_keys.FAILURE_STATUS
        logger_obj.error("Fetching Employee Profile list error is "+ str(e) +" and status is "+ str(json_data['status']) +" attempted by "+str(request.user.username))
    logger_obj.info("Fetching Employee Profile list response is "+ str(json_data) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data))

@csrf_exempt
def tm_get_year(request):
    '''
        26-SEP-2018 || SMI || To fetch the year for Talent Matrix
        @param request: Request Object
        @type request : Object
        @return: HttpResponse or Redirect the another URL
    '''
    try:
        json_data = {}
        cur = connection.cursor()
        uid = request.user.id
        if not uid:
            uid = 1
        if request.method == "POST":
            logger_obj.info("Fetching the year for Talent Matrix initiated by "+str(request.user.username))
            division_id = request.POST.get("division_id")
            cur.execute(query.fetch_hcms_query(config.talent_management, config.tm_fetch_matrix_years),(division_id,))
            json_data['tm_matrix_year'] = query.dictfetchall(cur)
    except Exception as e:
        json_data["status"] = status_keys.FAILURE_STATUS
        logger_obj.error("Fetching the year for Talent Matrix error is "+ str(e) +" and status is "+ str(json_data['status']) +" attempted by "+str(request.user.username))
    logger_obj.info("Fetching the year for Talent Matrix response is "+ str(json_data) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data))

@csrf_exempt
def tm_get_matrix_data(request):
    '''
        20-SEP-2018 || SMI || To fetch the Matrix data in Talent Matrix
        @param request: Request Object
        @type request : Object
        @return: HttpResponse or Redirect the another URL
    '''
    try:
        json_data = {}
        cur = connection.cursor()
        uid = request.user.id
        if not uid:
            uid = 1
        if request.method == "POST":
            logger_obj.info("Fetching Talent Matrix data initiated by "+str(request.user.username))
            division_id = request.POST.get("division_id")
            assess_year = request.POST.get("assess_year")
            assess_qtr = request.POST.get("assess_qtr")
            cur.execute(query.fetch_hcms_query(config.talent_management, config.tm_fetch_matrix_data),(division_id,division_id,assess_year,assess_qtr,))
            json_data['tm_matrix_data'] = query.dictfetchall(cur)
            cur.execute(query.fetch_hcms_query(config.talent_management, config.tm_per_pot_fetch), ('Performance', ))
            json_data['Perf_matrix_ranges'] = query.dictfetchall(cur)
            cur.execute(query.fetch_hcms_query(config.talent_management, config.tm_per_pot_fetch), ('Potential', ))
            json_data['Pot_matrix_ranges'] = query.dictfetchall(cur)
    except Exception as e:
        json_data["status"] = status_keys.FAILURE_STATUS
        logger_obj.error("Fetching Talent Matrix data error is "+ str(e) +" and status is "+ str(json_data['status']) +" attempted by "+str(request.user.username))
    logger_obj.info("Fetching Talent Matrix data response is "+ str(json_data) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data))

@csrf_exempt
def tm_tp_matrix_create(request):
    '''
        21-SEP-2018 || MST || To insert the Talent Profile Matrix data
        @param request: Request Object
        @type request : Object
        @return: HttpResponse or Redirect the another URL
    '''
    json_data = {}
    username = request.user.username
    uid = request.user.id
    cur = connection.cursor()
    if not uid:
        uid = 1
    try:
        tm_tp_modal_data = request.POST.get("tm_tp_modal_data")
        tm_tp_modal_data = json.loads(tm_tp_modal_data)
        range_2_from = request.POST.get("range_2_from")
        range_3_from = request.POST.get("range_3_from")
        sel_category_text = request.POST.get("sel_category_text")
        cur.execute(query.fetch_hcms_query(config.talent_management, config.tm_tp_cat_name), (str(sel_category_text), ))
        already_exists = query.dictfetchall(cur)
        if already_exists:
            cur.execute(query.fetch_hcms_query(config.talent_management, config.tm_tp_per_pot_update),
                            (int(tm_tp_modal_data['range_1_to']), int(range_2_from),
                             int(tm_tp_modal_data['range_2_to']), int(range_3_from), uid, sel_category_text, ))
        else:
            cur.execute(query.fetch_hcms_query(config.talent_management, config.tm_tp_per_pot_create),(str(sel_category_text), 
                            int(tm_tp_modal_data['range_1_to']),int(range_2_from), 
                            int(tm_tp_modal_data['range_2_to']), int(range_3_from),uid, uid, ))
            
        json_data['status'] = status_keys.SUCCESS_STATUS
    except Exception as e:
        json_data["status"] = status_keys.FAILURE_STATUS
    return HttpResponse(json.dumps(json_data))

@csrf_exempt
def tm_tp_matrix_fetch(request):
    '''
        04-OCT-2018 || MST || To View Performance and Potential Matrix values in modal
        @param request: Request Object
        @type request : Object
        @return: HttpResponse or Redirect the another URL
    '''
    json_data = {}
    username = request.user.username
    uid = request.user.id
    cur = connection.cursor()
    if not uid:
        uid = 1
    try:
        sel_category_text = request.POST.get("sel_category_text")
        cur.execute(query.fetch_hcms_query(config.talent_management, config.tm_tp_cat_name), (str(sel_category_text), ))
        json_data['matrix_fetched_values'] =  query.dictfetchall(cur)
        json_data['status'] = status_keys.SUCCESS_STATUS
    except Exception as e:
        json_data["status"] = status_keys.FAILURE_STATUS
    return HttpResponse(json.dumps(json_data))

@csrf_exempt
def tm_perf_pot_view(request):
    '''
        26-SEP-2018 || MST || To View Performance and Potential Matrix values
        @param request: Request Object
        @type request : Object
        @return: HttpResponse or Redirect the another URL
    '''
    json_data = {}
    username = request.user.username
    uid = request.user.id
    cur = connection.cursor()
    if not uid:
        uid = 1
    cur.execute(query.fetch_hcms_query(config.talent_management, config.tm_tp_fetch_eid),(uid,))
    user_id = query.dictfetchall(cur)
    try:
        division_val = request.POST.get("division_val")
        emp_id = request.POST.get("emp_id")
        if emp_id == None and division_val == None:
            emp_id = user_id[0]['id']
            division_val = user_id[0]['team_name_id']
        selected_year = request.POST.get("selected_year")
        cur.execute(query.fetch_hcms_query(config.talent_management, config.tm_fetch_per_pot_year_data), (division_val, division_val, selected_year, emp_id, ))
        json_data['matrix_values'] = query.dictfetchall(cur)
        cur.execute(query.fetch_hcms_query(config.talent_management, config.tm_per_pot_fetch), ('Performance', ))
        json_data['Perf_matrix_ranges'] = query.dictfetchall(cur)
        cur.execute(query.fetch_hcms_query(config.talent_management, config.tm_per_pot_fetch), ('Potential', ))
        json_data['Pot_matrix_ranges'] = query.dictfetchall(cur)
        json_data['status'] = status_keys.SUCCESS_STATUS
    except Exception as e:
        json_data["status"] = status_keys.FAILURE_STATUS
    return HttpResponse(json.dumps(json_data))

@csrf_exempt
def tm_comp_employee_list(request):
    '''19-SEP-2018 || KAV || To fetch the Competency Based Employee list
    @param request: Request Object@type request : Object
    @return: HttpResponse or Redirect the another URL'''
    try:
        json_data = {}
        cur = connection.cursor()
        uid = request.user.id
        if not uid:
            uid = 1
        if request.method == "POST":
            logger_obj.info("Fetching Competency Based Employee list initiated by "+str(request.user.username))
            org_id = request.POST.get("org_id")
            org_unit_id = request.POST.get("org_unit_id")
            division_id = request.POST.get("division_id") 
            cur.execute(query.fetch_hcms_query(config.talent_management, config.tm_fetch_comp_emp_list),(org_id, org_unit_id, division_id, ))
            json_data['sel_comp_employee'] = query.dictfetchall(cur)
    except Exception as e:
        json_data["status"] = status_keys.FAILURE_STATUS
        logger_obj.error("Fetching Competency Based Employee list error is "+ str(e) +" and status is "+ str(json_data['status']) +" attempted by "+str(request.user.username))
    logger_obj.info("Fetching Competency Based Employee list response is "+ str(json_data) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data))

@csrf_exempt
def tm_compt_emp_year(request):
    '''
        21-SEP-2018 || KAV || To fetch the Employee Year
        @param request: Request Object
        @type request : Object
        @return: HttpResponse or Redirect the another URL
    '''
    try:
        json_data = {}
        cur = connection.cursor()
        uid = request.user.id
        if not uid:
            uid = 1
        if request.method == "POST":
            logger_obj.info("Fetching Employee Year list initiated by "+str(request.user.username))
            emp_id = request.POST.get("emp_id")
            cur.execute(query.fetch_hcms_query(config.talent_management, config.tm_cmpt_emp_year),(emp_id, ))
            json_data['emp_year'] = query.dictfetchall(cur)
            cur_date = datetime.datetime.now()
            joining_date = json_data['emp_year'][0]['joining_date'].split('/')
            json_data['joining_year'] = int(joining_date[2])
            joining_date = datetime.datetime(int(joining_date[2]),int(joining_date[1]), int(joining_date[0]))
            delta = relativedelta.relativedelta(cur_date, joining_date)
            json_data['total_years'] = delta.years
    except Exception as e:
        json_data["status"] = status_keys.FAILURE_STATUS
        logger_obj.error("Fetching Employee Year list error is "+ str(e) +" and status is "+ str(json_data['status']) +" attempted by "+str(request.user.username))
    logger_obj.info("Fetching Employee Year list response is "+ str(json_data) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data))

@csrf_exempt
def tm_compt_emp_detail(request):
    '''
        20-SEP-2018 || KAV || To fetch the Selected Employee's Role Id and Details list
        @param request: Request Object
        @type request : Object
        @return: HttpResponse or Redirect the another URL
    '''
    try:
        json_data = {}
        cur = connection.cursor()
        uid = request.user.id
        if not uid:
            uid = 1
        if request.method == "POST":
            logger_obj.info("Fetching Selected Employee's Role Id and Details list initiated by "+str(request.user.username))
            employee_id = request.POST.get("emp_id")
            cur.execute(query.fetch_hcms_query(config.talent_management, config.tm_compt_emp_detail),(employee_id,))
            emp_detail = query.dictfetchall(cur)
            emp_role_id = emp_detail[0]["role_id_id"]
            if emp_role_id != 0:
                cur.execute(query.fetch_hcms_query(config.talent_management, config.tm_tech_compt_details),(emp_role_id,))
                json_data["tech_competency_summary"] = query.dictfetchall(cur)
                cur.execute(query.fetch_hcms_query(config.talent_management, config.tm_func_compt_details),(emp_role_id,))
                json_data["func_competency_summary"] = query.dictfetchall(cur)
                cur.execute(query.fetch_hcms_query(config.talent_management, config.tm_behav_compt_details),(emp_role_id,))
                json_data["behav_competency_summary"] = query.dictfetchall(cur)
              
    except Exception as e:
        json_data["status"] = status_keys.FAILURE_STATUS
        logger_obj.error("Fetching Selected Employee's Role Id and Details list list error is "+ str(e) +" and status is "+ str(json_data['status']) +" attempted by "+str(request.user.username))
    logger_obj.info("FetchingSelected Employee's Role Id and Details list list response is "+ str(json_data) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data))

@csrf_exempt
def tm_compt_detail_fetch(request):
    '''
        20-SEP-2018 || KAV || To Fetch Technical Competency Details list
        @param request: Request Object
        @type request : Object
        @return: HttpResponse or Redirect the another URL
    '''
    try:
        json_data = {}
        cur = connection.cursor()
        uid = request.user.id
        if not uid:
            uid = 1
        if request.method == "POST":
            logger_obj.info("Fetching Competency Assessment Details list initiated by "+str(request.user.username))
            emp_id = request.POST.get("emp_id")
            emp_year_val = request.POST.get("emp_year_val")
            emp_quarter_val= request.POST.get("emp_quarter_val")
            cur.execute(query.fetch_hcms_query(config.talent_management, config.tm_ca_details_fetch), (emp_id,emp_year_val,emp_quarter_val,))
            json_data["comp_assess_details"]=query.dictfetchall(cur)
    except Exception as e:
        json_data["status"] = status_keys.FAILURE_STATUS
        logger_obj.error("Fetching Competency Assessment Details list error is "+ str(e) +" and status is "+ str(json_data['status']) +" attempted by "+str(request.user.username))
    logger_obj.info("Fetching Competency Assessment Details list response is "+ str(json_data) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data))

@csrf_exempt
def tm_comp_assess_detail_submit(request):
    '''
        28-SEP-2018 || SMI || To Insert or Update Competency Assessment Details Function
        @param request: Request Object
        @type request : Object
        @return: HttpResponse or Redirect the another URL
    '''
    try:
        json_data = {}
        cur = connection.cursor()
        uid = request.user.id
        if not uid:
            uid = 1
        if request.method == "POST":
            tech_key_list = [];tech_values_list = [];tech_comp_assess = {}
            func_key_list = [];func_values_list = [];func_comp_assess = {}
            behv_key_list = [];behv_values_list = [];behv_comp_assess = {}
            final_comp_dict = {}
            logger_obj.info("Insert Competency Assessment Details Function initiated by "+str(request.user.username))
            action = request.POST.get("action")
            emp_id = request.POST.get("emp_id")
            emp_year_val = request.POST.get("emp_year_val")
            emp_quarter_val= request.POST.get("emp_quarter_val")
            tech_comp_assess_data= request.POST.get("tech_form_data")
            tech_code = request.POST.get("tech_code")
            tech_perf_history_data = request.POST.get("tech_perf_history_data")
            tech_work_areas = request.POST.get("tech_work_areas")
            tech_comp_assess_data = json.loads(tech_comp_assess_data)
            for key,value in tech_comp_assess_data.items():
                tech_key_list.append(int(key))
                tech_values_list.append(int(value))
            tech_comp_assess['comp_ids'] = tech_key_list
            tech_comp_assess['comp_vals'] = tech_values_list
            tech_comp_assess['code'] =  tech_code
            tech_comp_assess['history'] =  tech_perf_history_data
            tech_comp_assess['work_area'] =  tech_work_areas
            
            func_comp_assess_data= request.POST.get("func_form_data")
            func_code = request.POST.get("func_code")
            func_comp_assess_data = json.loads(func_comp_assess_data)
            func_perf_history_data = request.POST.get("func_perf_history_data")
            func_work_areas = request.POST.get("func_work_areas")
            for key,value in func_comp_assess_data.items():
                func_key_list.append(int(key))
                func_values_list.append(int(value))
            func_comp_assess['comp_ids'] = func_key_list
            func_comp_assess['comp_vals'] = func_values_list
            func_comp_assess['code'] =  func_code
            func_comp_assess['history'] =  func_perf_history_data
            func_comp_assess['work_area'] =  func_work_areas

            behv_comp_assess_data= request.POST.get("behv_form_data")
            behv_code = request.POST.get("behv_code")
            behv_comp_assess_data = json.loads(behv_comp_assess_data)
            behv_perf_history_data = request.POST.get("behv_perf_history_data")
            behv_work_areas = request.POST.get("behv_work_areas")

            for key,value in behv_comp_assess_data.items():
                behv_key_list.append(int(key))
                behv_values_list.append(int(value))
            behv_comp_assess['comp_ids'] = behv_key_list
            behv_comp_assess['comp_vals'] = behv_values_list
            behv_comp_assess['code'] =  behv_code
            behv_comp_assess['history'] =  behv_perf_history_data
            behv_comp_assess['work_area'] =  behv_work_areas

            final_comp_dict['tech_comp_assess'] = tech_comp_assess
            final_comp_dict['func_comp_assess'] = func_comp_assess
            final_comp_dict['behv_comp_assess'] = behv_comp_assess
            
            if action == 'add':
                for i in final_comp_dict:
                    cur.execute(query.fetch_hcms_query(config.talent_management, config.tm_ca_comp_id_fetch),(final_comp_dict[i]['code'],))
                    code = query.dictfetchall(cur)
                    cur.execute(query.fetch_hcms_query(config.talent_management, config.tm_ca_details_insert), (final_comp_dict[i]['history'],
                                                          final_comp_dict[i]['work_area'],emp_id, uid, 
                                                          uid, list(final_comp_dict[i]['comp_ids']), list(final_comp_dict[i]['comp_vals']), emp_quarter_val, 
                                                          emp_year_val, code[0]['id'],))
                json_data["status"] = status_keys.SUCCESS_STATUS      
            elif action == 'update':
                for i in final_comp_dict:
                    cur.execute(query.fetch_hcms_query(config.talent_management, config.tm_ca_comp_id_fetch),(final_comp_dict[i]['code'],))
                    code = query.dictfetchall(cur)
                    cur.execute(query.fetch_hcms_query(config.talent_management, config.tm_ca_details_update),(final_comp_dict[i]['history'],
                                                                   final_comp_dict[i]['work_area'],emp_id, uid,
                                                                   list(final_comp_dict[i]['comp_ids']), list(final_comp_dict[i]['comp_vals']),
                                                                   emp_id, emp_quarter_val, emp_year_val, code[0]['id'],))
                json_data["status"] = status_keys.UPDATE_STATUS
            else:
                json_data["status"] = status_keys.FAILURE_STATUS
    except Exception as e:
        json_data["status"] = status_keys.FAILURE_STATUS
        logger_obj.error("Insert Competency assessment Details Function error is "+ str(e) +" and status is "+ str(json_data['status']) +" attempted by "+str(request.user.username))
    logger_obj.info("Insert Competency assessment Details Function response is "+ str(json_data) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data))

@csrf_exempt
def tm_comp_assess_detail_remove(request):
    '''
        28-SEP-2018 || SMI || To Delete Competency Assessment Details Function
        @param request: Request Object
        @type request : Object
        @return: HttpResponse or Redirect the another URL
    '''
    try:
        json_data = {}
        cur = connection.cursor()
        uid = request.user.id
        if not uid:
            uid = 1
        if request.method == "POST":
            logger_obj.info("Delete Competency Assessment Details Function initiated by "+str(request.user.username))
            emp_id = request.POST.get("emp_id")
            emp_year_val = request.POST.get("emp_year_val")
            emp_quarter_val= request.POST.get("emp_quarter_val")
            cur.execute(query.fetch_hcms_query(config.talent_management, config.tm_ca_details_remove), (uid,emp_id,emp_quarter_val,emp_year_val,))
            json_data["status"] = status_keys.REMOVE_STATUS
    except Exception as e:
        json_data["status"] = status_keys.FAILURE_STATUS
        logger_obj.error("Delete Competency assessment Details Function error is "+ str(e) +" and status is "+ str(json_data['status']) +" attempted by "+str(request.user.username))
    logger_obj.info("Delete Competency assessment Details Function response is "+ str(json_data) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data))

@csrf_exempt
def tm_accolades_detail_submit(request):
    '''
        26-SEP-2018 || KAV || To Insert Modal Accolades Details Function
        @param request: Request Object
        @type request : Object
        @return: HttpResponse or Redirect the another URL
    '''
    try:
        json_data = {}
        cur = connection.cursor()
        uid = request.user.id
        if not uid:
            uid = 1
        if request.method == "POST":
            logger_obj.info(" Insert Modal Accolades Details initiated by "+str(request.user.username))
            accol_id = request.POST.get("accol_id")
            accolades_form_data = request.POST.get("accolades_form_data")
            accolades_form_data = json.loads(accolades_form_data)
            org_name = accolades_form_data["modal_accol_awarded_by"]
            cur.execute(""" select id from organization_info where name =%s """,(org_name,))
            org_id = query.dictfetchall(cur)
            org_id = org_id[0]['id']
            accol_title = accolades_form_data["modal_accol_title"]
            accol_year = accolades_form_data["modal_accol_year"]
            accol_awarded_by = org_id
            accol_desc = accolades_form_data["modal_accol_desc"]
            emp_id = accolades_form_data["modal_accol_employee"]
            if accol_id == "":
                cur.execute(query.fetch_hcms_query(config.talent_management, config.tm_insert_accol_details),
                              (accol_title,accol_year,accol_awarded_by,accol_desc,emp_id,uid,uid,))
                json_data["status"] = status_keys.SUCCESS_STATUS
            else:
                cur.execute(query.fetch_hcms_query(config.talent_management, config.tm_update_accol_details),
                              (accol_title,accol_year,accol_awarded_by,accol_desc,emp_id,uid,accol_id,))
                json_data["status"] = status_keys.UPDATE_STATUS 
    except Exception as e:
        json_data["status"] = status_keys.FAILURE_STATUS
        logger_obj.error(" Insert Modal Accolades Details error is "+ str(e) +" and status is "+ str(json_data['status']) +" attempted by "+str(request.user.username))
    logger_obj.info(" Insert Modal Accolades Details response is "+ str(json_data) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data))
        

@csrf_exempt
def accol_details_fetch(request):
    '''
        26-SEP-2018 || KAV || To fetch the Accolades list
        @param request: Request Object
        @type request : Object
        @return: HttpResponse or Redirect the another URL
    '''
    try:
        json_data = {}
        cur = connection.cursor()
        uid = request.user.id
        if not uid:
            uid = 1
        if request.method == "POST":
            logger_obj.info("Fetching Accolades list initiated by "+str(request.user.username))
            org_id = request.POST.get("org_id")
            org_unit_id = request.POST.get("org_unit_id")
            dept_id = request.POST.get("dept_id")
            cur.execute(query.fetch_hcms_query(config.talent_management, config.tm_accol_details_fetch),
                              (org_id,org_unit_id,dept_id,))
            json_data["accolades_details"] = query.dictfetchall(cur)
    except Exception as e:
        json_data["status"] = status_keys.FAILURE_STATUS
        logger_obj.error("Fetching Accolades list error is "+ str(e) +" and status is "+ str(json_data['status']) +" attempted by "+str(request.user.username))
    logger_obj.info("Fetching Accolades list response is "+ str(json_data) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data))

@csrf_exempt
def accol_cardclick_fetch(request):
    '''
        27-SEP-2018 || KAV || To Fetching Accolades Card Click Details
        @param request: Request Object
        @type request : Object
        @return: HttpResponse or Redirect the another URL
    '''
    try:
        json_data = {}
        cur = connection.cursor()
        uid = request.user.id
        if not uid:
            uid = 1
        if request.method == "POST":
            logger_obj.info("Fetching Accolades Card Click Details list initiated by "+str(request.user.username))
            accol_id = request.POST.get("accol_id")
            cur.execute(query.fetch_hcms_query(config.talent_management, config.tm_accol_cardclick_fetch),
                              (accol_id,))
            json_data["cardclick_accol_details"] = query.dictfetchall(cur)
    except Exception as e:
        json_data["status"] = status_keys.FAILURE_STATUS
        logger_obj.error("Fetching Accolades Card Click Details error is "+ str(e) +" and status is "+ str(json_data['status']) +" attempted by "+str(request.user.username))
    logger_obj.info("Fetching Accolades Card Click Details response is "+ str(json_data) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data))

@csrf_exempt
def tm_accol_remove(request):
    '''
        27-SEP-2018 || KAV || To Remove Accolades Details
        @param request: Request Object
        @type request : Object
        @return: HttpResponse or Redirect the another URL
    '''
    try:
        json_data = {}
        cur = connection.cursor()
        uid = request.user.id
        if not uid:
            uid = 1
        if request.method == "POST":
            logger_obj.info("Remove Accolades Details list initiated by "+str(request.user.username))
            accol_id = request.POST.get("accol_id")
            cur.execute(query.fetch_hcms_query(config.talent_management, config.tm_accol_remove),
                              (uid,accol_id,))
            json_data["status"] = status_keys.REMOVE_STATUS
    except Exception as e:
        json_data["status"] = status_keys.FAILURE_STATUS
        logger_obj.error("Remove Accolades Details error is "+ str(e) +" and status is "+ str(json_data['status']) +" attempted by "+str(request.user.username))
    logger_obj.info("Remove Accolades Details response is "+ str(json_data) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data))

@csrf_exempt
def my_accol_details_fetch(request):
    '''
        26-SEP-2018 || KAV || To fetch the Accolades list
        @param request: Request Object
        @type request : Object
        @return: HttpResponse or Redirect the another URL
    '''
    try:
        json_data = {}
        cur = connection.cursor()
        uid = request.user.id
        if not uid:
            uid = 1
        if request.method == "POST":
            logger_obj.info("Fetching Accolades list initiated by "+str(request.user.username))
            cur.execute(query.fetch_hcms_query(config.talent_management, config.my_accol_details_fetch),
                              (uid,))
            json_data["accolades_details"] = query.dictfetchall(cur)
    except Exception as e:
        json_data["status"] = status_keys.FAILURE_STATUS
        logger_obj.error("Fetching Accolades list error is "+ str(e) +" and status is "+ str(json_data['status']) +" attempted by "+str(request.user.username))
    logger_obj.info("Fetching Accolades list response is "+ str(json_data) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data))

@csrf_exempt
def tm_skills_values(request):
    '''
        03-OCT-2018 || MST || To Fetch data for My Skills Page
        @param request: Request Object
        @type request : Object
        @return: HttpResponse or Redirect the another URL
    '''
    try:
        json_data = {}
        cur = connection.cursor()
        uid = request.user.id
        if not uid:
            uid = 1
        cur.execute(query.fetch_hcms_query(config.talent_management, config.tm_tp_fetch_eid),(uid,))
        user_id = query.dictfetchall(cur)
        if request.method == "POST":
            skills_year_val = request.POST.get('skills_year_val')
            cur.execute(query.fetch_hcms_query(config.talent_management, config.tm_tp_comp_type_scores), (user_id[0]['id'], user_id[0]['id'], skills_year_val, ))
            json_data["skill_vals"] = query.dictfetchall(cur)
            cur.execute(query.fetch_hcms_query(config.talent_management, config.tm_tp_comp_scores), (user_id[0]['id'], skills_year_val, user_id[0]['id'], ))
            json_data["comp_skill_vals"] = query.dictfetchall(cur)
            json_data["status"] = status_keys.SUCCESS_STATUS
    except Exception as e:
        json_data["status"] = status_keys.FAILURE_STATUS
    return HttpResponse(json.dumps(json_data))

@csrf_exempt
def tm_my_perf_data(request):
    '''
        12-OCT-2018 || SMI || To Fetch data for My Performance Page
        @param request: Request Object
        @type request : Object
        @return: HttpResponse or Redirect the another URL
    '''
    try:
        json_data = {}
        cur = connection.cursor()
        uid = request.user.id
        if not uid:
            uid = 1
        cur.execute(query.fetch_hcms_query(config.talent_management, config.tm_tp_fetch_eid),(uid,))
        user_id = query.dictfetchall(cur)
        emp_id = user_id[0]['id']
        if request.method == "POST":
            perf_year = request.POST.get('perf_year')
            perf_quarter = request.POST.get('perf_quarter')
            cur.execute(query.fetch_hcms_query(config.talent_management, config.tm_my_perf_data), (perf_year, perf_quarter, emp_id, perf_year, perf_quarter, emp_id, ))
            json_data["my_perf_data"] = query.dictfetchall(cur)
            final_dict = {}; final_list = []
            for i in json_data["my_perf_data"]:
                final_dict = dict(zip(i['assessor_types'], i['ratings']))
                final_dict.update({'kra':i['kra']})
                final_list.append(final_dict)
            cur.execute(query.fetch_hcms_query(config.talent_management, config.tm_perf_assessors))
            val = cur.fetchall()
            val = [str(i[0]) for i in val]
            final_list2=[]
            for i in final_list:
                for j in val:
                    if not i.has_key(j):
                        i.update({j:0})
                final_list2.append(i)
            json_data["my_perf_data"] = final_list2
            
            cur_year = time.strftime("%Y")
            if perf_quarter > 1 :
                prev_perf_quarter = int(perf_quarter) - 1
                prev_perf_year = perf_year
            else:
                prev_perf_quarter = 4
                prev_perf_year = int(perf_year) - 1
            cur.execute(query.fetch_hcms_query(config.talent_management, config.tm_perf_comp_data), (emp_id, perf_year, perf_quarter, emp_id, prev_perf_year, prev_perf_quarter, emp_id, perf_year, perf_quarter, emp_id, prev_perf_year, prev_perf_quarter, ))
            json_data["my_perf_comp_data"] = query.dictfetchall(cur)
        else:
            json_data["status"] = status_keys.FAILURE_STATUS
    except Exception as e:
        json_data["status"] = status_keys.FAILURE_STATUS
    return HttpResponse(json.dumps(json_data))

@csrf_exempt
def tm_my_perf_sel_kra_data(request):
    '''
        12-OCT-2018 || SMI || To Fetch data for My Performance Page
        @param request: Request Object
        @type request : Object
        @return: HttpResponse or Redirect the another URL
    '''
    try:
        json_data = {}
        cur = connection.cursor()
        uid = request.user.id
        if not uid:
            uid = 1
        cur.execute(query.fetch_hcms_query(config.talent_management, config.tm_tp_fetch_eid),(uid,))
        user_id = query.dictfetchall(cur)
        emp_id = user_id[0]['id']
        if request.method == "POST":
            perf_year = request.POST.get('perf_year')
            perf_quarter = request.POST.get('perf_quarter')
            sel_kra = request.POST.get('sel_kra')
            sel_kra_id = request.POST.get('sel_kra_id')
            sel_kra_val = sel_kra.split('_')[0]
            sel_kra = sel_kra_val+'_%'
            cur.execute(query.fetch_hcms_query(config.talent_management, config.tm_my_perf_sel_kra_data), (perf_year, perf_quarter, emp_id, perf_year, perf_quarter, emp_id, sel_kra_id, sel_kra, ))
            values = query.dictfetchall(cur)
            final_dict = {}; final_list = []
            for i in values:
                final_dict = dict(zip(i['assessor_types'], i['ratings']))
                final_dict.update({'kra':i['kra']})
                final_list.append(final_dict)
            cur.execute(query.fetch_hcms_query(config.talent_management, config.tm_perf_assessors))
            val = cur.fetchall()
            val = [str(i[0]) for i in val]
            final_list2=[]
            for i in final_list:
                for j in val:
                    if not i.has_key(j):
                        i.update({j:0})
                final_list2.append(i)
            json_data["my_perf_data"] = final_list2
            
            cur_year = time.strftime("%Y")
            if perf_quarter > 1 :
                prev_perf_quarter = int(perf_quarter) - 1
                prev_perf_year = perf_year
            else:
                prev_perf_quarter = 4
                prev_perf_year = int(perf_year) - 1
            if sel_kra_val == 'OKR':
                cur.execute(query.fetch_hcms_query(config.talent_management, config.tm_my_perf_sel_kra_comp_okr_data), (perf_year, perf_quarter, emp_id, sel_kra_id, prev_perf_year, prev_perf_quarter, emp_id, sel_kra_id, ))
            if sel_kra_val == 'Role':
                cur.execute(query.fetch_hcms_query(config.talent_management, config.tm_my_perf_sel_kra_comp_role_data), (perf_year, perf_quarter, emp_id, sel_kra_id, prev_perf_year, prev_perf_quarter, emp_id, sel_kra_id, ))
            json_data["my_perf_comp_data"] = query.dictfetchall(cur)
        else:
            json_data["status"] = status_keys.FAILURE_STATUS
    except Exception as e:
        json_data["status"] = status_keys.FAILURE_STATUS
    return HttpResponse(json.dumps(json_data))

@csrf_exempt
def my_feedback_details_fetch(request):
    '''
        09-OCT-2018 || KAV || To fetch the Feedback list
        @param request: Request Object
        @type request : Object
        @return: HttpResponse or Redirect the another URL
    '''
    try:
        json_data={}
        cur = connection.cursor()
        uid = request.user.id
        if not uid:
            uid = 1
        if request.method == "POST":
            logger_obj.info("Fetching Feedback list initiated by "+str(request.user.username))
            my_fdbk_year_val = request.POST.get('my_feedback_year')
            my_fdbk_quarter_val = request.POST.get('my_feedback_quarter')
        cur.execute(query.fetch_hcms_query(config.talent_management, config.my_feedback_details_fetch),(uid,my_fdbk_year_val,my_fdbk_quarter_val,))
        details = query.dictfetchall(cur)
        final_list = []; final_dict = {}
        sub_list = []; peer_list = []; srrp_list = []; self_list = []; repo_list = []; dhed_list = []
        for i in details:
            if i['assessor_type'] == '2SUBO':
                sub_list.append(i)
            if i['assessor_type'] == '3PEER':
                peer_list.append(i)
            if i['assessor_type'] == '5SRRP':
                srrp_list.append(i)
            if i['assessor_type'] == '1SELF':
                self_list.append(i)
            if i['assessor_type'] == '4REPO':
                repo_list.append(i)
            if i['assessor_type'] == '6DHED':
                dhed_list.append(i)
        final_dict['subordinate'] = sub_list
        final_dict['peer'] = peer_list
        final_dict['senior'] = srrp_list
        final_dict['self'] = self_list
        final_dict['repo'] = repo_list
        final_dict['dept'] = dhed_list
        final_list.append(final_dict)
        return HttpResponse(json.dumps(final_list))
    except Exception as e:
        json_data["status"] = status_keys.FAILURE_STATUS
        logger_obj.error("Fetching Feedback list error is "+ str(e) +" and status is "+ str(json_data['status']) +" attempted by "+str(request.user.username))
    logger_obj.info("Fetching Feedback list response is "+ str(json_data) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data))