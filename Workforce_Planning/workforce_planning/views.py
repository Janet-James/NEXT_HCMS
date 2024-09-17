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
from CommonLib.hcms_common import refitem_fetch, record_validation, menu_access_control, refitem_fetch_orderby
import HCMS.settings as status_keys
import logging
import logging.handlers
import requests
logger_obj = logging.getLogger('logit')
import datetime

# Create your views here.
class WFP_Strategy_Main(TemplateView):
    ''' 
    12-July-2018 || SMI || To load Strategy Analysis page
    @param request: Request Object
    @type request : Object
    @return: HttpResponse or Redirect the another URL
    @author: SMI
    '''
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(WFP_Strategy_Main, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Strategy Analysis', self.request.user.id)
        if macl:
            template_name = "workforce_planning/strategy_analysis.html"
        else:
            template_name = "tags/access_denied.html"
        return [template_name]
    
    def get(self, request, *args, **kwargs):
        cur = connection.cursor()
        context = super(WFP_Strategy_Main, self).get_context_data(**kwargs)
        cur.execute(query.fetch_hcms_query(config.wf_planning, config.wfp_stg_emp_data))
        context['approval_board'] = query.dictfetchall(cur)
        cur.execute(query.fetch_hcms_query(config.wf_planning, config.stg_select_query))
        context['strategy_select'] = query.dictfetchall(cur)
        context['strategy_analysis'] = refitem_fetch_orderby("WFPA1", "id")
        cur.execute(query.fetch_hcms_query(config.wf_planning, config.wfp_fetch_org_list))
        context['strategy_org'] = query.dictfetchall(cur)
        context['role_grades'] = refitem_fetch_orderby("RLGRD", "id")
        return self.render_to_response(context)
    
class WFP_Structure_Main(TemplateView):
    ''' 
    12-July-2018 || SMI || To load Structure Analysis page
    @param request: Request Object
    @type request : Object
    @return: HttpResponse or Redirect the another URL
    @author: SMI
    '''
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(WFP_Structure_Main, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Structure Analysis', self.request.user.id)
        if macl:
            template_name = "workforce_planning/structure_analysis.html"
        else:
            template_name = "tags/access_denied.html"
        return [template_name]
    
    def get(self, request, *args, **kwargs):
        cur = connection.cursor()
        context = super(WFP_Structure_Main, self).get_context_data(**kwargs)
        context['structure_analysis'] = refitem_fetch_orderby("WFPA2", "id")
        cur.execute(query.fetch_hcms_query(config.wf_planning, config.wfp_fetch_org_list))
        context['structure_org'] = query.dictfetchall(cur)
        context['role_grades'] = refitem_fetch_orderby("RLGRD", "id")
        return self.render_to_response(context)
    
class WFP_System_Main(TemplateView):
    '''
    12-July-2018 || SMI || To load System Analysis Page
    @param request: Request Object
    @type request : Object
    @return: HttpResponse or Redirect the another URL
    @author: SMI
    '''
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(WFP_System_Main, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('job Requisition Analysis', self.request.user.id)
        if macl:
            template_name = "workforce_planning/system_analysis.html"
        else:
            template_name = "tags/access_denied.html"
        return [template_name]
    
    def get(self, request, *args, **kwargs):
        cur = connection.cursor()
        context = super(WFP_System_Main, self).get_context_data(**kwargs)
        context['system_analysis'] = refitem_fetch_orderby("WFPA3", "id")
        cur.execute(query.fetch_hcms_query(config.wf_planning,config.sys_fetch_team_name))
        context['sysana_team_details'] = query.dictfetchall(cur)
        context['reason_requisition'] = refitem_fetch("JBRSN")
        cur.execute(query.fetch_hcms_query(config.wf_planning, config.wfp_fetch_org_list))
        context['system_org'] = query.dictfetchall(cur)
        context['recruit_inst'] = refitem_fetch("REINS")
        context['grade'] = refitem_fetch("RLGRD")
        return self.render_to_response(context)

class WFP_Resource_Request_Main(TemplateView):
    '''
    12-July-2018 || SMI || To load System Analysis Page
    @param request: Request Object
    @type request : Object
    @return: HttpResponse or Redirect the another URL
    @author: SMI
    '''
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(WFP_Resource_Request_Main, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Workforce Request', self.request.user.id)
        if macl:
            template_name = "workforce_planning/resource_request.html"
        else:
            template_name = "tags/access_denied.html"
        return [template_name]
    
    def get(self, request, *args, **kwargs):
        cur = connection.cursor()
        role_id = request.user.role_id
        user_id = request.user.id
        cur.execute(query.fetch_hcms_query(config.wf_planning, config.fetch_user_details),(int(user_id),))
        user_details = query.dictfetchall(cur)
        context = super(WFP_Resource_Request_Main, self).get_context_data(**kwargs)
        cur.execute(query.fetch_hcms_query(config.wf_planning, config.fetch_role_name),(int(role_id),))
        role_name=query.dictfetchall(cur)
        context['Role_Name'] = role_name[0]['name']
        context['user_details'] = user_details
        context['strategy_analysis'] = refitem_fetch("WFPA1")
        context['structure_analysis'] = refitem_fetch("WFPA2")
        context['system_analysis'] = refitem_fetch("WFPA3")
        context['job_type'] = refitem_fetch("JOBTY")
        context['reason_requisition'] = refitem_fetch("JBRSN")
        cur.execute(query.fetch_hcms_query(config.wf_planning, config.fetch_role_details))
        context['roles'] = query.dictfetchall(cur)
        cur.execute(query.fetch_hcms_query(config.wf_planning, config.fetch_team_info))
        context['team_info'] = query.dictfetchall(cur)
        cur.execute(query.fetch_hcms_query(config.wf_planning, config.wfp_fetch_org_list))
        context['resreq_org'] = query.dictfetchall(cur)
        cur.execute(query.fetch_hcms_query(config.wf_planning, config.resreq_shifts_qry))
        context['resreq_shifts'] = query.dictfetchall(cur)
        context['recruit_inst'] = refitem_fetch("REINS")
        return self.render_to_response(context)
@csrf_exempt
def wfp_org_unit(request):
    '''
        26-July-2018 || MST || To fetch the Org. Unit list
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
            org_unit_id = request.POST.get("org_unit_id")
            cur.execute(query.fetch_hcms_query(config.wf_planning, config.wfp_fetch_org_unit_list),(int(org_id),))
            json_data['sel_org_unit'] = query.dictfetchall(cur)
            if org_unit_id != None:
                cur.execute(query.fetch_hcms_query(config.wf_planning, config.wfp_fetch_stg_sel_query),(int(org_id), int(org_unit_id),))
                json_data['wfp_strategy_sel'] = query.dictfetchall(cur)
        except Exception as e:
            json_data["status"] = status_keys.FAILURE_STATUS
            logger_obj.error("Fetching Org. Unit list error is "+ str(e) +" and status is "+ str(json_data['status']) +" attempted by "+str(request.user.username))
        logger_obj.info("Fetching Org. Unit list response is "+ str(json_data) +" attempted by "+str(request.user.username))
        return HttpResponse(json.dumps(json_data))
    
@csrf_exempt
def stg_analysis_step1(request):
    ''' 
    05-Jul-2018 || MST || Strategy Analysis Step1 Insert form
    @param request: Request Object
    @type request : Object
    @return: HttpResponse of select
    @author: MST
    '''
    json_data = {}
    username = request.user.username
    uid = request.user.id
    cur = connection.cursor()
    if not uid:
        uid = 1
    try:
        text = request.POST.get("text")
        remove_text = request.POST.get("remove")
        step1_form_data = request.POST.get("strategy_analysis_step1_form_data")
        step1_form_data = json.loads(step1_form_data)
        stg_org = step1_form_data['stg_org']
        stg_org_unit = step1_form_data['stg_org_unit']
        stg_approval_board = request.POST.get("stg_approval_board")
        stg_approval_board = map(int, json.loads(stg_approval_board))
        stg_summary = step1_form_data['stg_summary']
        stg_details = step1_form_data['stg_details']
        stg_from_date = step1_form_data['stg_period_from_date']
        stg_to_date = step1_form_data['stg_period_to_date']
        stg_defined = step1_form_data['stg_defined_on']
        steeple_social_vals = step1_form_data['range_1'].split(';')
        steeple_tech_vals = step1_form_data['range_2'].split(';')
        steeple_economy_vals = step1_form_data['range_3'].split(';')
        steeple_env_vals = step1_form_data['range_4'].split(';')
        steeple_political_vals = step1_form_data['range_5'].split(';')
        steeple_legal_vals = step1_form_data['range_6'].split(';')
        steeple_ethic_vals = step1_form_data['range_7'].split(';')
        if text == 'Add':
            cur.execute(query.fetch_hcms_query(config.wf_planning, config.wfp_stg_step1_insert),(stg_summary, stg_details, stg_from_date, stg_to_date,
                                    stg_defined, stg_approval_board, uid, uid, stg_org, stg_org_unit, ))
            fetch_id = cur.fetchone()
            fetch_id = fetch_id[0]
            cur.execute(query.fetch_hcms_query(config.wf_planning, config.wfp_stg_step1_steeple_insert), (step1_form_data['steeple_exec'], step1_form_data['steeple_workforce'],
                                    step1_form_data['stp_social'], step1_form_data['stp_tech'],
                                    step1_form_data['stp_economy'], step1_form_data['stp_env'], step1_form_data['stp_political'],
                                    step1_form_data['stp_legal'], step1_form_data['stp_ethic'], steeple_social_vals[0], steeple_social_vals[1],
                                    steeple_tech_vals[0], steeple_tech_vals[1], steeple_economy_vals[0], steeple_economy_vals[1],
                                    steeple_env_vals[0], steeple_env_vals[1], steeple_political_vals[0],
                                    steeple_political_vals[1], steeple_legal_vals[0], steeple_legal_vals[1],
                                    steeple_ethic_vals[0], steeple_ethic_vals[1], uid,
                                    uid, fetch_id, ))
            json_data['status'] = status_keys.SUCCESS_STATUS
        if text == 'Update':
            stg_id = request.POST.get('stg_id') 
            cur.execute(query.fetch_hcms_query(config.wf_planning, config.wfp_stg_step1_update),(stg_summary, stg_details, stg_from_date, stg_to_date, 
                                stg_defined, stg_approval_board, uid, stg_org, stg_org_unit, stg_id, ))
            cur.execute(query.fetch_hcms_query(config.wf_planning, config.wfp_stg_step1_steeple_update),(step1_form_data['steeple_exec'], step1_form_data['steeple_workforce'],
                                    step1_form_data['stp_social'], step1_form_data['stp_tech'],
                                    step1_form_data['stp_economy'], step1_form_data['stp_env'], step1_form_data['stp_political'],
                                    step1_form_data['stp_legal'], step1_form_data['stp_ethic'], steeple_social_vals[0], steeple_social_vals[1],
                                    steeple_tech_vals[0], steeple_tech_vals[1], steeple_economy_vals[0], steeple_economy_vals[1],
                                    steeple_env_vals[0], steeple_env_vals[1], steeple_political_vals[0],
                                    steeple_political_vals[1], steeple_legal_vals[0], steeple_legal_vals[1],
                                    steeple_ethic_vals[0], steeple_ethic_vals[1], uid, stg_id, ))
            json_data['status'] = status_keys.UPDATE_STATUS
        if remove_text == 'remove':
            stg_id = request.POST.get('stg_id')
            cur.execute(query.fetch_hcms_query(config.wf_planning, config.wfp_stg_step1_remove),(uid, stg_id,uid, stg_id,))
            json_data['status'] = status_keys.REMOVE_STATUS
    except Exception as e:
        json_data["status"] = status_keys.FAILURE_STATUS
    return HttpResponse(json.dumps(json_data))

@csrf_exempt
def stg_analysis_step1_table(request):
    ''' 
    06-Jul-2018 || MST || Strategy Analysis Step1 Datatable data fetch
    @param request: Request Object
    @type request : Object
    @return: HttpResponse of select
    @author: MST
    '''
    json_data = {}
    username = request.user.username
    uid = request.user.id
    cur = connection.cursor()
    if not uid:
        uid = 1
    try:
        table_id = request.POST.get('table_id')
        if table_id != None: 
            cur.execute(query.fetch_hcms_query(config.wf_planning, config.wfp_stg_step1_fetch),(str(table_id),))
            json_data["step1_form_data"] = query.dictfetchall(cur)
            cur.execute(query.fetch_hcms_query(config.wf_planning, config.wfp_stg_step1_steeple_fetch),(str(table_id),))
            json_data["steeple_form_data"] = query.dictfetchall(cur)
            cur.execute(query.fetch_hcms_query(config.wf_planning, config.wfp_stg_step2_fetch),(table_id,))
            json_data['cur_wf_analysis_data'] = query.dictfetchall(cur)
            cur.execute(query.fetch_hcms_query(config.wf_planning, config.wfp_stg_step3_gap),(table_id,))
            json_data['gap_data'] = query.dictfetchall(cur)
            cur.execute(query.fetch_hcms_query(config.wf_planning, config.wfp_stg_step4_cost),(table_id,))
            json_data['cost_view_data'] = query.dictfetchall(cur)
            json_data["status"] = status_keys.SUCCESS_STATUS
    except Exception as e:
        json_data["status"] = status_keys.FAILURE_STATUS
    return HttpResponse(json.dumps(json_data))

@csrf_exempt
def step2_save_form(request):
    ''' 
        10-JUL-2018 || MST || To fetch role details
        @param request: Request Object
        @type request : Object
        @return: HttpResponse or Redirect the another URL
    '''
    json_data = {}
    cur = connection.cursor()
    username = request.user.username
    uid = request.user.id
    if not uid:
        uid = 1
    try:
        text = request.POST.get("text")
        strategy_select_id = request.POST.get('strategy_select_id')
        workforce_form_data = request.POST.get('workforce_form_data')
        workforce_form_data = json.loads(workforce_form_data)
        if text == 'Add':
            for i in range(0,len(workforce_form_data)):
                task_summary = workforce_form_data[i][0]
                wf_required = workforce_form_data[i][1]
                role = workforce_form_data[i][2]
                if '&amp;' in role:
                    role = role.replace("&amp;","&")
                cur.execute(query.fetch_hcms_query(config.wf_planning, config.wfp_stg_step2_role_id),(str(role),))
                role_id = query.dictfetchall(cur)
                role_id = role_id[0]['id']
                grade = workforce_form_data[i][3]
                cur.execute(query.fetch_hcms_query(config.wf_planning, config.wfp_stg_step2_grade_id),(str(grade),))
                grade_id = query.dictfetchall(cur)
                grade_id = grade_id[0]['id']
                cur.execute(query.fetch_hcms_query(config.wf_planning, config.wfp_stg_step2_insert),(str(task_summary), wf_required, uid, uid, 
                                        role_id, strategy_select_id, grade_id))
            json_data['status'] = status_keys.SUCCESS_STATUS
        if text == 'Update':
            cur.execute(query.fetch_hcms_query(config.wf_planning, config.wfp_stg_step2_delete), (strategy_select_id,))
            for i in range(0,len(workforce_form_data)):
                task_summary = workforce_form_data[i][0]
                wf_required = workforce_form_data[i][1]
                role = workforce_form_data[i][2]
                if '&amp;' in role:
                    role = role.replace("&amp;","&")
                cur.execute(query.fetch_hcms_query(config.wf_planning, config.wfp_stg_step2_role_id),(str(role),))
                role_id = query.dictfetchall(cur)
                role_id = role_id[0]['id']
                grade = workforce_form_data[i][3]
                cur.execute(query.fetch_hcms_query(config.wf_planning, config.wfp_stg_step2_grade_id),(str(grade),))
                grade_id = query.dictfetchall(cur)
                grade_id = grade_id[0]['id']
                cur.execute(query.fetch_hcms_query(config.wf_planning, config.wfp_stg_step2_insert),(str(task_summary), wf_required, uid, uid, 
                                        role_id, strategy_select_id, grade_id))
            json_data['status'] = status_keys.UPDATE_STATUS
        if text == 'remove':
            cur.execute(query.fetch_hcms_query(config.wf_planning, config.wfp_stg_step2_delete), (strategy_select_id,))
            json_data['status'] = status_keys.REMOVE_STATUS
    except Exception as e:
        json_data['status'] = status_keys.FAILURE_STATUS
    return HttpResponse(json.dumps(json_data))

@csrf_exempt
def fetch_role_details(request):
    ''' 
        10-JUL-2018 || MST || To fetch role details
        @param request: Request Object
        @type request : Object
        @return: HttpResponse or Redirect the another URL
    '''
    json_data = {}
    cur = connection.cursor() 
    if request.method == "POST":
        try:
            org_id = request.POST.get("org_id")
            org_unit_id = request.POST.get("org_unit_id")
            cur.execute(query.fetch_hcms_query(config.wf_planning, config.wfp_stg_step2_role_fetch),(org_id, org_unit_id,))
            json_data['role_details_headers'] = query.dictfetchall(cur)
        except Exception as e:
            json_data['status'] = status_keys.FAILURE_STATUS
    return HttpResponse(json.dumps(json_data))

@csrf_exempt
def fetch_grade_details(request):
    ''' 
        06-AUG-2018 || MST || To fetch grade details
        @param request: Request Object
        @type request : Object
        @return: HttpResponse or Redirect the another URL
    '''
    json_data = {}
    cur = connection.cursor() 
    if request.method == "POST":
        try:
            role_id = request.POST.get('role_id')
            cur.execute(query.fetch_hcms_query(config.wf_planning, config.fetch_grade_details),(str(role_id), ))
            json_data['grade_details_headers'] = query.dictfetchall(cur)
        except Exception as e:
            json_data['status'] = status_keys.FAILURE_STATUS
    return HttpResponse(json.dumps(json_data))

@csrf_exempt
def fetch_selected_grade_details(request):
    ''' 
        07-AUG-2018 || MST || To fetch selected grade details
        @param request: Request Object
        @type request : Object
        @return: HttpResponse or Redirect the another URL
    '''
    json_data = {}
    cur = connection.cursor() 
    if request.method == "POST":
        try:
            role_selected_val = request.POST.get('role_selected_val')
            cur.execute(query.fetch_hcms_query(config.wf_planning, config.fetch_selected_grade_details),(str(role_selected_val), ))
            json_data['grade_selected_headers'] = query.dictfetchall(cur)
        except Exception as e:
            json_data['status'] = status_keys.FAILURE_STATUS
    return HttpResponse(json.dumps(json_data))

@csrf_exempt
def fetch_strategy_select(request):
    ''' 
        10-JUL-2018 || MST || To fetch strategy select data
        @param request: Request Object
        @type request : Object
        @return: HttpResponse or Redirect the another URL
    '''
    json_data = {}
    cur = connection.cursor()
    if request.method == "POST":
        try:
            text = request.POST.get("action")
            if text == 'step_2_select_fetch':
                cur.execute(query.fetch_hcms_query(config.wf_planning, config.wfp_stg_select))
                json_data['strategy_select_vals'] = query.dictfetchall(cur)
            if text == 'add_click':
                cur.execute(query.fetch_hcms_query(config.wf_planning, config.stg_select_query))
                json_data['strategy_select_vals'] = query.dictfetchall(cur)
        except Exception as e:
            json_data['status'] = status_keys.FAILURE_STATUS
    return HttpResponse(json.dumps(json_data))

@csrf_exempt
def wf_report_role_details(request):
    '''
        30-July-2018 || SMI || To fetch the reporting structure details 
        @param request: Request Object
        @type request : Object
        @return: HttpResponse or Redirect the another URL
    '''
    cur = connection.cursor()
    post = request.GET
    org_id = request.POST.get("org_id")
    org_unit_id = request.POST.get("org_unit_id")
    cur.execute(query.fetch_hcms_query(config.wf_planning, config.ti_reports_struct_data),(org_id,org_unit_id,))
    role_details = query.dictfetchall(cur)
    for i in role_details:
        id=i[config.id]
        role_title=i[config.role_title]
        role_type=i[config.role_type]
        role_reports_to_id=i[config.role_reports_to_id]
    return HttpResponse(json.dumps(role_details))  

@csrf_exempt
def wfp_struct_step2_details(request):
    ''' 
        05-JUL-2018 || SMI || To fetch the planned, existing and excess count of resource per role
        @param request: Request Object
        @type request : Object
        @return: HttpResponse or Redirect the another URL
    '''
    json_data = {}
    cur = connection.cursor()
    org_id = request.POST.get("org_id")
    org_unit_id = request.POST.get("org_unit_id")
    logger_obj.info("Planned, existing and excess count of resource per role fetch initiated by "+str(request.user.username))
    if request.method == "POST":
        try:
            cur.execute(query.fetch_hcms_query(config.wf_planning, config.wfp_struct_step2_details_fetch),(org_id,org_unit_id,))
            json_data['data'] = query.dictfetchall(cur)
        except Exception as e:
            json_data["status"] = status_keys.FAILURE_STATUS
            logger_obj.error("Planned, existing and excess count of resource per role fetch error is "+ str(e) +" and status is "+ str(json_data['status']) +" attempted by "+str(request.user.username))
        logger_obj.info("Planned, existing and excess count of resource per role fetch response is "+ str(json_data) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data))

@csrf_exempt
def wfp_struct_step3_details(request):
    ''' 
        09-JUL-2018 || SMI || To fetch the planned, existing and excess count of resource per role and org. unit type
        @param request: Request Object
        @type request : Object
        @return: HttpResponse or Redirect the another URL
    '''
    json_data = {}
    cur = connection.cursor()
    org_id = request.POST.get("org_id")
    org_unit_id = request.POST.get("org_unit_id")
    logger_obj.info("Planned, existing and excess count of resource per role and org. unit type fetch initiated by "+str(request.user.username))
    if request.method == "POST":
        try:
            cur.execute(query.fetch_hcms_query(config.wf_planning, config.wfp_struct_step3_details_fetch),(org_id,org_unit_id,))
            json_data['data'] = query.dictfetchall(cur)
        except Exception as e:
            json_data["status"] = status_keys.FAILURE_STATUS
            logger_obj.error("Planned, existing and excess count of resource per role and org. unit type fetch error is "+ str(e) +" and status is "+ str(json_data['status']) +" attempted by "+str(request.user.username))
        logger_obj.info("Planned, existing and excess count of resource per role and org. unit type fetch response is "+ str(json_data) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data))

@csrf_exempt
def wfp_struct_step4_details(request):
    ''' 
        10-JUL-2018 || SMI || To fetch the planned, existing and excess costs of resource per role and org. unit type
        @param request: Request Object
        @type request : Object
        @return: HttpResponse or Redirect the another URL
    '''
    json_data = {}
    cur = connection.cursor()
    org_id = request.POST.get("org_id")
    org_unit_id = request.POST.get("org_unit_id")
    logger_obj.info("Planned, existing and excess costs of resource per role and org. unit type fetch initiated by "+str(request.user.username))
    if request.method == "POST":
        try:
            cur.execute(query.fetch_hcms_query(config.wf_planning, config.wfp_struct_step4_details_fetch),(org_id,org_unit_id,))
            json_data['data'] = query.dictfetchall(cur)
        except Exception as e:
            json_data["status"] = status_keys.FAILURE_STATUS
            logger_obj.error("Planned, existing and excess costs of resource per role and org. unit type fetch error is "+ str(e) +" and status is "+ str(json_data['status']) +" attempted by "+str(request.user.username))
        logger_obj.info("Planned, existing and excess costs of resource per role and org. unit type fetch response is "+ str(json_data) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data))

@csrf_exempt
def wfp_struct_step5_details(request):
    ''' 
        10-JUL-2018 || SMI || To fetch data for Structure Analysis - Summarized Report
        @param request: Request Object
        @type request : Object
        @return: HttpResponse or Redirect the another URL
    '''
    json_data = {}
    cur = connection.cursor()
    org_id = request.POST.get("org_id")
    org_unit_id = request.POST.get("org_unit_id")
    logger_obj.info("Data for Structure Analysis - Summarized Report fetch initiated by "+str(request.user.username))
    if request.method == "POST":
        try:
            cur.execute(query.fetch_hcms_query(config.wf_planning, config.wfp_struct_step5_details_fetch),(org_id,org_unit_id,))
            json_data['data'] = query.dictfetchall(cur)
            cur.execute(query.fetch_hcms_query(config.wf_planning, config.wfp_stg_step2_role_fetch),(org_id,org_unit_id,))
            json_data['role_data'] = query.dictfetchall(cur)
        except Exception as e:
            json_data["status"] = status_keys.FAILURE_STATUS
            logger_obj.error("Data for Structure Analysis - Summarized Report fetch error is "+ str(e) +" and status is "+ str(json_data['status']) +" attempted by "+str(request.user.username))
        logger_obj.info("Data for Structure Analysis - Summarized Report fetch response is "+ str(json_data) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data))

@csrf_exempt
def wfp_struct_step5_chart_click(request):
    ''' 
        31-JUL-2018 || SMI || To fetch data for Structure Analysis - Donut Chart Slice Click
        @param request: Request Object
        @type request : Object
        @return: HttpResponse or Redirect the another URL
    '''
    json_data = {}
    cur = connection.cursor()
    org_id = request.POST.get("org_id")
    org_unit_id = request.POST.get("org_unit_id")
    struct_donut_chart_title = request.POST.get("struct_donut_chart_title")
    logger_obj.info("Data for Structure Analysis - Donut Chart Slice Click initiated by "+str(request.user.username))
    if request.method == "POST":
        try:
            if struct_donut_chart_title == '0 to 5k':
                range_from = 0
                range_to = 5000
            elif struct_donut_chart_title == '6k to 10k':
                range_from = 5001
                range_to = 10000
            elif struct_donut_chart_title == 'Above 10k':
                range_from = 10001
                range_to = 9999999999
            cur.execute(query.fetch_hcms_query(config.wf_planning, config.wfp_struct_slice_click_fetch),(org_id,org_unit_id,range_from,range_to,))
            json_data['data'] = query.dictfetchall(cur)
        except Exception as e:
            json_data["status"] = status_keys.FAILURE_STATUS
            logger_obj.error("Data for Structure Analysis - Donut Chart Slice Click error is "+ str(e) +" and status is "+ str(json_data['status']) +" attempted by "+str(request.user.username))
        logger_obj.info("Data for Structure Analysis - Donut Chart Slice Click response is "+ str(json_data) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data))

@csrf_exempt
def wfp_struct_step5_role_sel(request):
    ''' 
        31-JUL-2018 || SMI || To fetch data for Structure Analysis - Bar Chart when selecting role
        @param request: Request Object
        @type request : Object
        @return: HttpResponse or Redirect the another URL
    '''
    json_data = {}
    cur = connection.cursor()
    org_id = request.POST.get("org_id")
    org_unit_id = request.POST.get("org_unit_id")
    role_id = request.POST.get("role_id")
    logger_obj.info("Data for Structure Analysis - Bar Chart when selecting role initiated by "+str(request.user.username))
    if request.method == "POST":
        try:
            cur.execute(query.fetch_hcms_query(config.wf_planning, config.wfp_struct_role_sel_fetch),(org_id,org_unit_id,role_id,))
            json_data['data'] = query.dictfetchall(cur)
        except Exception as e:
            json_data["status"] = status_keys.FAILURE_STATUS
            logger_obj.error("Data for Structure Analysis - Bar Chart when selecting role error is "+ str(e) +" and status is "+ str(json_data['status']) +" attempted by "+str(request.user.username))
        logger_obj.info("Data for Structure Analysis - Bar Chart when selecting role response is "+ str(json_data) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data))

@csrf_exempt
def wfp_bar_msel_roles_chng(request):
    ''' 
        16-AUG-2018 || SMI || To fetch data for Structure Analysis - Stacked bar chart by selected roles
        @param request: Request Object
        @type request : Object
        @return: HttpResponse or Redirect the another URL
    '''
    json_data = {}
    cur = connection.cursor()
    org_id = request.POST.get("org_id")
    org_unit_id = request.POST.get("org_unit_id")
    wfp_bar_msel_roles_val = map(int, json.loads(request.POST.get("wfp_bar_msel_roles_val")))
    logger_obj.info("Data for Structure Analysis - Stacked bar chart by selected roles initiated by "+str(request.user.username))
    if request.method == "POST":
        try:
            cur.execute(query.fetch_hcms_query(config.wf_planning, config.wfp_multi_bar_data_qry),(org_id,org_unit_id,tuple(wfp_bar_msel_roles_val),))
            json_data['data'] = query.dictfetchall(cur)
        except Exception as e:
            json_data["status"] = status_keys.FAILURE_STATUS
            logger_obj.error("Data for Structure Analysis - Stacked bar chart by selected roles error is "+ str(e) +" and status is "+ str(json_data['status']) +" attempted by "+str(request.user.username))
        logger_obj.info("Data for Structure Analysis - Stacked bar chart by selected roles is "+ str(json_data) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data))

@csrf_exempt
def wfp_bar_msel_grades_chng(request):
    ''' 
        17-AUG-2018 || SMI || To fetch data for Structure Analysis - Stacked bar chart by selected grades
        @param request: Request Object
        @type request : Object
        @return: HttpResponse or Redirect the another URL
    '''
    json_data = {}
    cur = connection.cursor()
    wfp_bar_msel_grades_val = map(int, json.loads(request.POST.get("wfp_bar_msel_grades_val")))
    logger_obj.info("Data for Structure Analysis - Stacked bar chart by selected grades initiated by "+str(request.user.username))
    if request.method == "POST":
        try:
            cur.execute(query.fetch_hcms_query(config.wf_planning, config.wfp_multi_grade_data_qry),(tuple(wfp_bar_msel_grades_val),))
            json_data['data'] = query.dictfetchall(cur)
        except Exception as e:
            json_data["status"] = status_keys.FAILURE_STATUS
            logger_obj.error("Data for Structure Analysis - Stacked bar chart by selected grades error is "+ str(e) +" and status is "+ str(json_data['status']) +" attempted by "+str(request.user.username))
        logger_obj.info("Data for Structure Analysis - Stacked bar chart by selected grades is "+ str(json_data) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data))

@csrf_exempt
def wfp_syst_step1_details(request):
    '''
        06-July-2018 || KAV || To Fetch the Resource Request details For System Analysis
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
            org_id =  request.POST.get('org_id')
            org_unit_id = request.POST.get('org_unit_id')
            cur.execute(query.fetch_hcms_query(config.wf_planning, config.wfp_syst_step1_details_fetch),(org_id,org_unit_id,))
            resreq_team_role_details=query.dictfetchall(cur)
            json_data['resreq_team_role_details']= resreq_team_role_details
            json_data['status']= status_keys.SUCCESS_STATUS
        except Exception as e:
            json_data['status']= status_keys.FAILURE_STATUS
    return HttpResponse(json.dumps(json_data))
 
 
@csrf_exempt
def wfp_syst_step2_details(request):
    '''
        06-July-2018 || KAV || To Fetch the Resource Request details
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
            sys_select_team_id = request.POST.get('team_id')
            sys_select_role_id = request.POST.get('role_id')
            text = request.POST.get('text')
            status = request.POST.get('status')
            if text == "system_step2":
                org_id = request.POST.get('org_id')
                org_unit_id = request.POST.get('org_unit_id')
                cur.execute(query.fetch_hcms_query(config.wf_planning, config.sys_fetch_team_name),(str(org_id),str(org_unit_id),))
                team_name=query.dictfetchall(cur)
                json_data['team_name_details']= team_name
            if text == "team":
                cur.execute(query.fetch_hcms_query(config.wf_planning, config.sys_fetch_role_name),(str(sys_select_team_id),))
                resreq_role_details=query.dictfetchall(cur)
                json_data['resreq_role_details']= resreq_role_details
            if text == "role":
                team_id = request.POST.get('team_id')
                cur.execute(query.fetch_hcms_query(config.wf_planning, config.wfp_syst_step2_details_fetch),(str(sys_select_team_id),str(sys_select_role_id),))
                wfp_syst_step2_details=query.dictfetchall(cur)
                json_data['wfp_syst_step2_details']= wfp_syst_step2_details
            if text == "save":
                analyzed_details = request.POST.get('analyzed_details')
                update_team_id = request.POST.get('update_team_id')
                update_role_id = request.POST.get('update_role_id')
                update_grade_id = request.POST.get('update_grade_id')
                update_res_type_id = request.POST.get('update_res_type_id')
                if status == 'Rejected':
                      cur.execute(query.fetch_hcms_query(config.wf_planning, config.sys_update_reject_status),
                                  (str(uid),str(analyzed_details), str(update_grade_id),str(update_res_type_id),str(update_team_id),str(update_role_id),))
                elif status == 'Approved':
                    cur.execute(query.fetch_hcms_query(config.wf_planning, config.sys_update_approved_status),
                                (str(uid),str(analyzed_details),str(update_grade_id),str(update_res_type_id),str(update_team_id),str(update_role_id),))
                json_data['status']= status_keys.UPDATE_STATUS
        except Exception as e:
            json_data['status']= status_keys.FAILURE_STATUS
    return HttpResponse(json.dumps(json_data))
 
 
@csrf_exempt
def wfp_syst_step3_details(request):
    '''
        06-July-2018 || KAV || Sytem Analysis Step3 Function
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
            org_id = request.POST.get("org_id")
            org_unit_id = request.POST.get("org_unit_id")
            json_data['ref_priority_id'] = refitem_fetch_orderby("ISVTY", "id")
            cur.execute(query.fetch_hcms_query(config.wf_planning, config.wfp_syst_step3_details_fetch),(org_id,org_unit_id,))
            step3_details=query.dictfetchall(cur)
            json_data['step3_details']= step3_details
            json_data['status']= status_keys.SUCCESS_STATUS
        except Exception as e:
            json_data['status']= status_keys.FAILURE_STATUS
    return HttpResponse(json.dumps(json_data))
 
@csrf_exempt
def resreq_details_submit(request):
    '''
        05-July-2018 || KAV || To insert the Resource Request details
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
            logger_obj.info("Resource Request Details Insert Update Operations initiated by "+str(request.user.username))
            resreq_org = request.POST.get("resreq_org")
            resreq_org_unit = request.POST.get("resreq_org_unit")
            resreq_dept = request.POST.get("resreq_dept")
            resreq_role = request.POST.get("resreq_role")
            resreq_grade = request.POST.get("resreq_grade")
            request_reason = request.POST.get("request_reason")
            requested_on = request.POST.get("requested_on")
            resource_deployment_date = request.POST.get("resource_deployment_date")
            resource_count = request.POST.get("resource_count")
            resreq_job_type = request.POST.get("resreq_job_type")
            resreq_eduqua = request.POST.get("resreq_eduqua")
            resreq_jobdesc = request.POST.get("resreq_jobdesc")
            resreq_certif = request.POST.get("resreq_certif")
            resreq_lang = request.POST.get("resreq_lang")
            resreq_shift = request.POST.get("resreq_shift")
            requirement_type = request.POST.get("requirement_type")
            resreq_skills = request.POST.get("resreq_skills")
            text = request.POST.get("text")
            resreq_analyzed_by_id=None
            resreq_priority_id=None
            resreq_analysed_details=None
            resreq_priority_number=None
            id= request.POST.get("id")
            if text == 'Add':
                cur.execute(query.fetch_hcms_query(config.wf_planning,config.resreq_already_exists),(str(resreq_dept),str(resreq_role),))
                data_exist = query.dictfetchall(cur)
                if data_exist:
                    json_data["status"] = status_keys.ERR0016
                else:
                    cur.execute(query.fetch_hcms_query(config.wf_planning,config.insert_resreq_data),(str(resource_count),str(resource_deployment_date),
                                                        str(requested_on),str(request_reason), resreq_analysed_details,resreq_priority_number,
                                                        str(uid),str(uid),resreq_analyzed_by_id,resreq_priority_id,str(requirement_type),
                                                        str(resreq_role),str(resreq_dept),str(resreq_org),str(resreq_org_unit),str(resreq_certif),
                                                        str(resreq_eduqua),str(resreq_jobdesc),str(resreq_job_type),str(resreq_lang),str(resreq_shift),
                                                        str(resreq_skills),str(resreq_grade)))
                    json_data["status"] = status_keys.SUCCESS_STATUS
            if text == 'Update':
                cur.execute(query.fetch_hcms_query(config.wf_planning,config.update_resreq_data),
                                      (str(resource_count),str(resource_deployment_date),
                                                        str(requested_on),str(request_reason), resreq_analysed_details,resreq_priority_number,
                                                        str(uid),resreq_analyzed_by_id,resreq_priority_id,str(requirement_type),
                                                        str(resreq_role),str(resreq_dept),str(resreq_org),str(resreq_org_unit),str(resreq_certif),
                                                        str(resreq_eduqua),str(resreq_jobdesc),str(resreq_job_type),str(resreq_lang),str(resreq_shift),
                                                        str(resreq_skills),str(resreq_grade),str(id),))
                json_data["status"] = status_keys.UPDATE_STATUS
        except Exception as e:
            json_data["status"] = status_keys.FAILURE_STATUS
            logger_obj.error("Resource Request Details Insert Update Operations error is "+ str(e) +" and status is "+ str(json_data['status']) +" attempted by "+str(request.user.username))
        logger_obj.info("Resource Request Details Insert Update Operations response is "+ str(json_data) +" attempted by "+str(request.user.username))
        return HttpResponse(json.dumps(json_data))
    
@csrf_exempt
def resreq_details_fetch(request):
    '''
        05-July-2018 || KAV || To Fetch the Resource Request details
        @param request: Request Object
        @type request : Object
        @return: HttpResponse or Redirect the another URL
    '''
    json_data = {}
    cur = connection.cursor()
    uid = request.user.id
    if not uid:
        uid = 1
    if request.method == "GET":
        try:
            cur.execute(query.fetch_hcms_query(config.wf_planning,config.resreq_details_fetch),(int(uid),))
            resreq_details=query.dictfetchall(cur)
            json_data['resreq_details']= resreq_details
            json_data['status']= status_keys.SUCCESS_STATUS
        except Exception as e:
            json_data['status']= status_keys.FAILURE_STATUS
            logger_obj.error("Resource Request Details Fetch Operations error is "+ str(e) +" and status is "+ str(json_data['status']) +" attempted by "+str(request.user.username))
        logger_obj.info("Resource Request Details Fetch Operations response is "+ str(json_data) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data))
 
@csrf_exempt
def resreq_details_fetch_id(request):
    '''
        06-July-2018 || KAV || To Fetch the Resource Request details based on id
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
            table_id = request.POST.get("table_id")
            cur.execute(query.fetch_hcms_query(config.wf_planning,config.resreq_details_fetch_id),(int(table_id),))
            resreq_row_details=query.dictfetchall(cur)
            json_data['resreq_row_details']= resreq_row_details
            json_data['status']= status_keys.SUCCESS_STATUS
        except Exception as e:
            json_data['status']= status_keys.FAILURE_STATUS
            logger_obj.error("Resource Request Details Fetch By Id Operations error is "+ str(e) +" and status is "+ str(json_data['status']) +" attempted by "+str(request.user.username))
        logger_obj.info("Resource Request Details Fetch By Id Operations response is "+ str(json_data) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data))

@csrf_exempt
def resreq_details_remove(request):
    '''
        20-July-2018 || KAV || Resource Request Cancel Function
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
            id = request.POST.get('id')
            cur.execute(query.fetch_hcms_query(config.wf_planning,config.resreq_details_remove),(str(id),))
            json_data['status']= status_keys.REMOVE_STATUS
        except Exception as e:
            json_data['status']= status_keys.FAILURE_STATUS
            logger_obj.error("Resource Request Details Remove Operations error is "+ str(e) +" and status is "+ str(json_data['status']) +" attempted by "+str(request.user.username))
        logger_obj.info("Resource Request Details Remove Operations response is "+ str(json_data) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data))

@csrf_exempt
def resreq_get_org_unit_list(request):
    '''
        26-July-2018 || KAV || Resource Request Fetch Org.Unit List Function
        @param request: Request Object
        @type request : Object
        @return: HttpResponse or Redirect the another URL
    '''
    json_data = {}
    username = request.user.username
    uid = request.user.id
    if not uid:
        uid = 1
    try:
        cur = connection.cursor()
        org_id = request.POST.get("org_id")
        cur.execute(query.fetch_hcms_query(config.wf_planning, config.orgunit_fetch),(int(org_id),))
        json_data['resreq_org_unit'] = query.dictfetchall(cur)
        cur.execute(query.fetch_hcms_query(config.wf_planning, config.org_location),(int(org_id),))
        json_data['org_location'] = query.dictfetchall(cur)
    except Exception as e:
        json_data["status"] = status_keys.FAILURE_STATUS
        logger_obj.error("Get Org Unit List on selecting Organization error is "+ str(e) +" and status is "+ str(json_data['status']) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data))

@csrf_exempt
def wfp_sys_step3_save_form(request):
    '''
        31-July-2018 || KAV || System Analysis Step3 Save Form Function
        @param request: Request Object
        @type request : Object
        @return: HttpResponse or Redirect the another URL
    '''
    json_data = {}
    username = request.user.username
    uid = request.user.id
    if not uid:
        uid = 1
    try:
        cur = connection.cursor()
        table_id = request.POST.get('table_id')
        priority_id_sel = request.POST.get('priority_id_sel')
        
        table_id=json.loads(table_id)
        priority_id_sel = json.loads(priority_id_sel)
        priority_val = [int(i) for i in priority_id_sel]
        value_dict = zip(table_id, priority_val)
        for i in value_dict:
            cur.execute(""" update hcms_wp_system_resource_request set resource_request_priority_id = %s  where id =%s """,(str(i[1]),str(i[0]),))
        json_data['org_location'] = 'jjj'
    except Exception as e:
        json_data["status"] = status_keys.FAILURE_STATUS
        logger_obj.error("Get Org Unit List on selecting Organization error is "+ str(e) +" and status is "+ str(json_data['status']) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data))

@csrf_exempt
def fetch_grade_details(request):
    ''' 
        06-AUG-2018 || MST || To fetch grade details
        @param request: Request Object
        @type request : Object
        @return: HttpResponse or Redirect the another URL
    '''
    json_data = {}
    cur = connection.cursor() 
    if request.method == "POST":
        try:
            role_id = request.POST.get('role_id')
            cur.execute(""" SELECT ri.id, ri.refitems_name from (select unnest(role_grade) as grade 
                                    from hcms_ti_role_details where id = %s)a 
                                    inner join reference_items ri on ri.id = a.grade """,(str(role_id), ))
            json_data['grade_details_headers'] = query.dictfetchall(cur)
        except Exception as e:
            json_data['status'] = status_keys.FAILURE_STATUS
    return HttpResponse(json.dumps(json_data))

@csrf_exempt
def wfp_system_map_details(request):
    '''
        22-August-2018 || KAV || To Fetch the Resource Request details For Map
        @param request: Request Object
        @type request : Object
        @return: HttpResponse or Redirect the another URL
    '''
    json_data = {}
    dictionary = {}
    cur = connection.cursor() 
    if request.method == "POST":
        try:
            cur.execute(query.fetch_hcms_query(config.wf_planning, config.wfp_system_step5_map_details))
            json_data['org_value_map'] = query.dictfetchall(cur)
            list_dict = []
            for i in json_data['sys_ana_details']:
                dict_total = {}
                role_name =  i['role_name']
                resreq_count =  i['resreq_count']
                dictionary = dict(zip(role_name, resreq_count))
                dictionary = (dict([(str(k), v) for k, v in dictionary.items()]))
                dict_total[str('Org')] = str(i['org_name'])
                dict_total[str('Org Unit')] = str(i['orgunit_name'])
                dict_total[str('Count')] = int(i['resreq_total_count'])
                dict_total[str('Information')] = dictionary
                list_dict.append(dict_total)
                
        except Exception as e:
            json_data['status'] = status_keys.FAILURE_STATUS
    return HttpResponse(json.dumps(json_data))

@csrf_exempt
def wfp_system_step5_piechart_details(request):
    '''
        22-August-2018 || KAV || To Fetch the Resource Request details For Pie Chart
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
            org_id = request.POST.get('org_id')
            org_unit_id = request.POST.get('org_unit_id')
            cur.execute(query.fetch_hcms_query(config.wf_planning, config.wfp_system_step5_piechart_details),(str(org_id),str(org_unit_id),))
            system_donut_chart_data=query.dictfetchall(cur)
            json_data['system_donut_chart_data']= system_donut_chart_data
            json_data['status']= status_keys.SUCCESS_STATUS
        except Exception as e:
            json_data['status']= status_keys.FAILURE_STATUS
            logger_obj.error("Resource Request Donut Chart Details Fetch Operations error is "+ str(e) +" and status is "+ str(json_data['status']) +" attempted by "+str(request.user.username))
        logger_obj.info("Resource Request Donut Chart Details Fetch Operations response is "+ str(json_data) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data))


@csrf_exempt
def wfp_system_step5_chart_click(request):
    '''
        22-August-2018 || KAV || To Fetch the Resource Request details For Pie Chart Click
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
            org_id = request.POST.get('org_id')
            org_unit_id = request.POST.get('org_unit_id')
            system_donut_chart_title = request.POST.get('system_donut_chart_title')
            logger_obj.info("Data for Sytem Analysis - Donut Chart Slice Click initiated by "+str(request.user.username))
            if system_donut_chart_title == '0 to 5k':
                range_from = 0
                range_to = 5
            elif system_donut_chart_title == '6k to 10k':
                range_from = 6
                range_to = 10
            elif system_donut_chart_title == 'Above 10k':
                range_from = 10
                range_to = 9999999999
            cur.execute(query.fetch_hcms_query(config.wf_planning, config.sys_step5_chart_click_details),
                        (org_id,org_unit_id,range_from,range_to,org_id,org_unit_id,range_from,range_to,))
            data =query.dictfetchall(cur)
            json_data['data']=data
            json_data['status']= status_keys.SUCCESS_STATUS
        except Exception as e:
                json_data['status']= status_keys.FAILURE_STATUS
                logger_obj.error("System Analysis  Donut Chart Click  Operations error is "+ str(e) +" and status is "+ str(json_data['status']) +" attempted by "+str(request.user.username))
        logger_obj.info("System Analysis Donut Chart Click  Operations response is "+ str(json_data) +" attempted by "+str(request.user.username))
        return HttpResponse(json.dumps(json_data))

@csrf_exempt
def wfp_system_step5_role_sel(request):
    '''
        22-August-2018 || KAV || To Fetch the Resource Request Role,MultiRole,Grade Details 
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
            org_id = request.POST.get('org_id')
            org_unit_id = request.POST.get('org_unit_id')
            text = request.POST.get('text')
            if text == "single_role":
                role_id = request.POST.get('role_id')
                logger_obj.info("Data for Sytem Analysis - Donut Chart Slice Click and fetch role details by "+str(request.user.username))
                if role_id:
                    cur.execute(query.fetch_hcms_query(config.wf_planning, config.sys_step5_bar_singlerole_details)
                                ,(org_id,org_unit_id,role_id,org_id,org_unit_id,role_id,))
                    data =query.dictfetchall(cur)
                    json_data['data']= data
            if text == "multi_role":  
                multi_role_id = request.POST.get('multi_role_id')
                multi_role_id_array = tuple( map(int,json.loads(multi_role_id)))
                if multi_role_id_array:
                    cur.execute(query.fetch_hcms_query(config.wf_planning, config.sys_step5_bar_multilerole_details),
                        (org_id,org_unit_id,multi_role_id_array,org_id,org_unit_id,multi_role_id_array,))
                    data = query.dictfetchall(cur)
                    json_data['data']= data
            if text == "grade":
                garde_id = request.POST.get('garde_id')
                garde_id_array = tuple(map(int,json.loads(garde_id)))
                if garde_id_array:
                    cur.execute(query.fetch_hcms_query(config.wf_planning, config.sys_step5_bar_grade_details),
                                            (org_id,org_unit_id,garde_id_array,))
                    rescount_details =query.dictfetchall(cur)
                    if rescount_details == []:
                        rescount_details  = 0
                        json_data['rescount_details']= rescount_details
                    else:
                        json_data['rescount_details']= rescount_details
                
            json_data['status']= status_keys.SUCCESS_STATUS
        except Exception as e:
                json_data['status']= status_keys.FAILURE_STATUS
                logger_obj.error("Resource Request Details Fetch Operations error is "+ str(e) +" and status is "+ str(json_data['status']) +" attempted by "+str(request.user.username))
        logger_obj.info("Resource Request Details Fetch Operations response is "+ str(json_data) +" attempted by "+str(request.user.username))
        return HttpResponse(json.dumps(json_data)) 

@csrf_exempt
def wfp_sysstep5_fetch_multirole_details(request):
    ''' 
        06-AUG-2018 || KAV || To fetch role details
        @param request: Request Object
        @type request : Object
        @return: HttpResponse or Redirect the another URL
    '''
    json_data = {}
    cur = connection.cursor() 
    if request.method == "POST":
        try:
            org_id = request.POST.get('org_id')
            org_unit_id = request.POST.get('org_unit_id')
            cur.execute(query.fetch_hcms_query(config.wf_planning, config.sys_step5_multirole_details),
                                            (org_id,org_unit_id, ))
            json_data['role_details'] = query.dictfetchall(cur)
        except Exception as e:
            json_data['status'] = status_keys.FAILURE_STATUS
            logger_obj.error("Resource Request Details Fetch Operations error is "+ str(e) +" and status is "+ str(json_data['status']) +" attempted by "+str(request.user.username))
        logger_obj.info("Resource Request Details Fetch Operations response is "+ str(json_data) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data))
def stg_analysis_gap_table(request):
    ''' 
    17-Aug-2018 || MST || Strategy Analysis Gap Analysis Datatable data fetch
    @param request: Request Object
    @type request : Object
    @return: HttpResponse of select
    @author: MST
    '''
    json_data = {}
    username = request.user.username
    uid = request.user.id
    cur = connection.cursor()
    if not uid:
        uid = 1
    try:
        table_id = request.POST.get('table_id')
        if table_id != None: 
            cur.execute(query.fetch_hcms_query(config.wf_planning, config.wfp_stg_step3_gap),(table_id,))
            json_data['gap_data'] = query.dictfetchall(cur)
            cur.execute(query.fetch_hcms_query(config.wf_planning, config.wfp_stg_step4_cost),(table_id,))
            json_data['cost_view_data'] = query.dictfetchall(cur)
            json_data["status"] = status_keys.SUCCESS_STATUS
    except Exception as e:
        json_data["status"] = status_keys.FAILURE_STATUS
    return HttpResponse(json.dumps(json_data))

@csrf_exempt
def wfp_stgy_step5_details(request):
    ''' 
        21-AUG-2018 || SMI || To fetch data for Strategy Analysis - Summarized Report
        @param request: Request Object
        @type request : Object
        @return: HttpResponse or Redirect the another URL
    '''
    json_data = {}
    cur = connection.cursor()
    logger_obj.info("Data for Strategy Analysis - Summarized Report fetch initiated by "+str(request.user.username))
    if request.method == "POST":
        try:
            org_id = request.POST.get("org_id")
            org_unit_id = request.POST.get("org_unit_id")
            wfp_strategy_sel_id = request.POST.get('wfp_strategy_sel_id')
            cur.execute(query.fetch_hcms_query(config.wf_planning, config.wfp_stgy_step5_details_fetch),(wfp_strategy_sel_id,))
            json_data['data'] = query.dictfetchall(cur)
            cur.execute(query.fetch_hcms_query(config.wf_planning, config.wfp_stg_step5_role_fetch),(org_id,org_unit_id,wfp_strategy_sel_id,))
            json_data['role_data'] = query.dictfetchall(cur)
        except Exception as e:
            json_data["status"] = status_keys.FAILURE_STATUS
            logger_obj.error("Data for Strategy Analysis - Summarized Report fetch error is "+ str(e) +" and status is "+ str(json_data['status']) +" attempted by "+str(request.user.username))
        logger_obj.info("Data for Strategy Analysis - Summarized Report fetch response is "+ str(json_data) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data))

@csrf_exempt
def wfp_stgy_step5_chart_click(request):
    ''' 
        21-AUG-2018 || SMI || To fetch data for Strategy Analysis - Donut Chart Slice Click
        @param request: Request Object
        @type request : Object
        @return: HttpResponse or Redirect the another URL
    '''
    json_data = {}
    cur = connection.cursor()
    strgy_donut_chart_title = request.POST.get("strgy_donut_chart_title")
    wfp_strategy_sel_id = request.POST.get("wfp_strategy_sel_id")
    logger_obj.info("Data for Strategy Analysis - Donut Chart Slice Click initiated by "+str(request.user.username))
    if request.method == "POST":
        try:
            if strgy_donut_chart_title == '0 to 5k':
                range_from = 0
                range_to = 5000
            elif strgy_donut_chart_title == '6k to 10k':
                range_from = 5001
                range_to = 10000
            elif strgy_donut_chart_title == 'Above 10k':
                range_from = 10001
                range_to = 9999999999
            cur.execute(query.fetch_hcms_query(config.wf_planning, config.wfp_strgy_slice_click_fetch),(wfp_strategy_sel_id,range_from,range_to,))
            json_data['data'] = query.dictfetchall(cur)
        except Exception as e:
            json_data["status"] = status_keys.FAILURE_STATUS
            logger_obj.error("Data for Strategy Analysis - Donut Chart Slice Click error is "+ str(e) +" and status is "+ str(json_data['status']) +" attempted by "+str(request.user.username))
        logger_obj.info("Data for Strategy Analysis - Donut Chart Slice Click response is "+ str(json_data) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data))

@csrf_exempt
def wfp_strgy_step5_role_sel(request):
    ''' 
        21-AUG-2018 || SMI || To fetch data for Strategy Analysis - Bar Chart when selecting role
        @param request: Request Object
        @type request : Object
        @return: HttpResponse or Redirect the another URL
    '''
    json_data = {}
    cur = connection.cursor()
    wfp_strategy_sel_id = request.POST.get("wfp_strategy_sel_id")
    role_id = request.POST.get("role_id")
    logger_obj.info("Data for Strategy Analysis - Bar Chart when selecting role initiated by "+str(request.user.username))
    if request.method == "POST":
        try:
            cur.execute(query.fetch_hcms_query(config.wf_planning, config.wfp_strgy_role_sel_fetch),(role_id,wfp_strategy_sel_id,role_id,))
            json_data['data'] = query.dictfetchall(cur)
        except Exception as e:
            json_data["status"] = status_keys.FAILURE_STATUS
            logger_obj.error("Data for Strategy Analysis - Bar Chart when selecting role error is "+ str(e) +" and status is "+ str(json_data['status']) +" attempted by "+str(request.user.username))
        logger_obj.info("Data for Strategy Analysis - Bar Chart when selecting role response is "+ str(json_data) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data))

@csrf_exempt
def wfp_stgy_bar_msel_roles_chng(request):
    ''' 
        21-AUG-2018 || SMI || To fetch data for Strategy Analysis - Stacked bar chart by selected roles
        @param request: Request Object
        @type request : Object
        @return: HttpResponse or Redirect the another URL
    '''
    json_data = {}
    cur = connection.cursor()
    wfp_strategy_sel_id = request.POST.get("wfp_strategy_sel_id")
    wfp_stg_bar_msel_roles_val = map(int, json.loads(request.POST.get("wfp_stg_bar_msel_roles_val")))
    logger_obj.info("Data for Strategy Analysis - Stacked bar chart by selected roles initiated by "+str(request.user.username))
    if request.method == "POST":
        try:
            cur.execute(query.fetch_hcms_query(config.wf_planning, config.wfp_stgy_multi_bar_data_qry),(tuple(wfp_stg_bar_msel_roles_val),wfp_strategy_sel_id,tuple(wfp_stg_bar_msel_roles_val),))
            json_data['data'] = query.dictfetchall(cur)
        except Exception as e:
            json_data["status"] = status_keys.FAILURE_STATUS
            logger_obj.error("Data for Strategy Analysis - Stacked bar chart by selected roles error is "+ str(e) +" and status is "+ str(json_data['status']) +" attempted by "+str(request.user.username))
        logger_obj.info("Data for Strategy Analysis - Stacked bar chart by selected roles is "+ str(json_data) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data))

@csrf_exempt
def wfp_stgy_bar_msel_grades_chng(request):
    ''' 
        21-AUG-2018 || SMI || To fetch data for Structure Analysis - Stacked bar chart by selected grades
        @param request: Request Object
        @type request : Object
        @return: HttpResponse or Redirect the another URL
    '''
    json_data = {}
    cur = connection.cursor()
    wfp_stg_bar_msel_grades_val = map(int, json.loads(request.POST.get("wfp_stg_bar_msel_grades_val")))
    logger_obj.info("Data for Strategy Analysis - Stacked bar chart by selected grades initiated by "+str(request.user.username))
    if request.method == "POST":
        try:
            cur.execute(query.fetch_hcms_query(config.wf_planning, config.wfp_stgy_multi_grade_data_qry),(tuple(wfp_stg_bar_msel_grades_val),))
            json_data['data'] = query.dictfetchall(cur)
        except Exception as e:
            json_data["status"] = status_keys.FAILURE_STATUS
            logger_obj.error("Data for Strategy Analysis - Stacked bar chart by selected grades error is "+ str(e) +" and status is "+ str(json_data['status']) +" attempted by "+str(request.user.username))
        logger_obj.info("Data for Strategy Analysis - Stacked bar chart by selected grades is "+ str(json_data) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data))

@csrf_exempt
def wfp_system_map_details(request):
    '''
        22-August-2018 || KAV || To Fetch the Resource Request details For Map
        @param request: Request Object
        @type request : Object
        @return: HttpResponse or Redirect the another URL
    '''
    json_data = {}
    dictionary = {}
    cur = connection.cursor()
    if request.method == "POST":
        try:
            cur.execute(query.fetch_hcms_query(config.wf_planning, config.wfp_system_step5_map_details))
            json_data['org_value_map'] = query.dictfetchall(cur)
            list_dict = []
            for i in json_data['sys_ana_details']:
                dict_total = {}
                role_name =  i['role_name']
                resreq_count =  i['resreq_count']
                dictionary = dict(zip(role_name, resreq_count))
                dictionary = (dict([(str(k), v) for k, v in dictionary.items()]))
                dict_total[str('Org')] = str(i['org_name'])
                dict_total[str('Org Unit')] = str(i['orgunit_name'])
                dict_total[str('Count')] = int(i['resreq_total_count'])
                dict_total[str('Information')] = dictionary
                list_dict.append(dict_total)
                
        except Exception as e:
            json_data['status'] = status_keys.FAILURE_STATUS
    return HttpResponse(json.dumps(json_data))
 
@csrf_exempt
def wfp_system_step5_piechart_details(request):
    '''
        22-August-2018 || KAV || To Fetch the Resource Request details For Pie Chart
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
            org_id = request.POST.get('org_id')
            org_unit_id = request.POST.get('org_unit_id')
            cur.execute(query.fetch_hcms_query(config.wf_planning, config.wfp_system_step5_piechart_details),(str(org_id),str(org_unit_id),))
            system_donut_chart_data=query.dictfetchall(cur)
            json_data['system_donut_chart_data']= system_donut_chart_data
            json_data['status']= status_keys.SUCCESS_STATUS
        except Exception as e:
            json_data['status']= status_keys.FAILURE_STATUS
            logger_obj.error("Resource Request Donut Chart Details Fetch Operations error is "+ str(e) +" and status is "+ str(json_data['status']) +" attempted by "+str(request.user.username))
        logger_obj.info("Resource Request Donut Chart Details Fetch Operations response is "+ str(json_data) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data))
 
 
@csrf_exempt
def wfp_system_step5_chart_click(request):
    '''
        22-August-2018 || KAV || To Fetch the Resource Request details For Pie Chart Click
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
            org_id = request.POST.get('org_id')
            org_unit_id = request.POST.get('org_unit_id')
            system_donut_chart_title = request.POST.get('system_donut_chart_title')
            logger_obj.info("Data for Sytem Analysis - Donut Chart Slice Click initiated by "+str(request.user.username))
            if system_donut_chart_title == '0 to 5k':
                range_from = 0
                range_to = 5000
            elif system_donut_chart_title == '6k to 10k':
                range_from = 6
                range_to = 10000
            elif system_donut_chart_title == 'Above 10k':
                range_from = 10
                range_to = 9999999999
            cur.execute(query.fetch_hcms_query(config.wf_planning, config.sys_step5_chart_click_details),
                        (org_id,org_unit_id,range_from,range_to,org_id,org_unit_id,range_from,range_to,))
            data =query.dictfetchall(cur)
            json_data['data']=data
            json_data['status']= status_keys.SUCCESS_STATUS
        except Exception as e:
                json_data['status']= status_keys.FAILURE_STATUS
                logger_obj.error("System Analysis  Donut Chart Click  Operations error is "+ str(e) +" and status is "+ str(json_data['status']) +" attempted by "+str(request.user.username))
        logger_obj.info("System Analysis Donut Chart Click  Operations response is "+ str(json_data) +" attempted by "+str(request.user.username))
        return HttpResponse(json.dumps(json_data))
 
@csrf_exempt
def wfp_system_step5_role_sel(request):
    '''
        22-August-2018 || KAV || To Fetch the Resource Request Role,MultiRole,Grade Details
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
            org_id = request.POST.get('org_id')
            org_unit_id = request.POST.get('org_unit_id')
            text = request.POST.get('text')
            if text == "single_role":
                role_id = request.POST.get('role_id')
                logger_obj.info("Data for System Analysis - Donut Chart Slice Click and fetch role details by "+str(request.user.username))
                if role_id:
                    cur.execute(query.fetch_hcms_query(config.wf_planning, config.sys_step5_bar_singlerole_details)
                                ,(org_id,org_unit_id,role_id,org_id,org_unit_id,role_id,))
                    data =query.dictfetchall(cur)
                    json_data['data']= data
            if text == "multi_role":  
                multi_role_id = request.POST.get('multi_role_id')
                multi_role_id_array = tuple( map(int,json.loads(multi_role_id)))
                if multi_role_id_array:
                    cur.execute(query.fetch_hcms_query(config.wf_planning, config.sys_step5_bar_multilerole_details),
                        (org_id,org_unit_id,multi_role_id_array,org_id,org_unit_id,multi_role_id_array,))
                    data = query.dictfetchall(cur)
                    json_data['data']= data
            if text == "grade":
                garde_id = request.POST.get('garde_id')
                garde_id_array = tuple(map(int,json.loads(garde_id)))
                if garde_id_array:
                    cur.execute(query.fetch_hcms_query(config.wf_planning, config.sys_step5_bar_grade_details),
                                            (org_id,org_unit_id,garde_id_array,))
                    rescount_details =query.dictfetchall(cur)
                    if rescount_details == []:
                        rescount_details  = 0
                        json_data['rescount_details']= rescount_details
                    else:
                        json_data['rescount_details']= rescount_details
                
            json_data['status']= status_keys.SUCCESS_STATUS
        except Exception as e:
                json_data['status']= status_keys.FAILURE_STATUS
                logger_obj.error("Resource Request Details Fetch Operations error is "+ str(e) +" and status is "+ str(json_data['status']) +" attempted by "+str(request.user.username))
        logger_obj.info("Resource Request Details Fetch Operations response is "+ str(json_data) +" attempted by "+str(request.user.username))
        return HttpResponse(json.dumps(json_data))
 
@csrf_exempt
def wfp_sysstep5_fetch_multirole_details(request):
    '''
        06-AUG-2018 || KAV || To fetch role details
        @param request: Request Object
        @type request : Object
        @return: HttpResponse or Redirect the another URL
    '''
    json_data = {}
    cur = connection.cursor()
    if request.method == "POST":
        try:
            org_id = request.POST.get('org_id')
            org_unit_id = request.POST.get('org_unit_id')
            cur.execute(query.fetch_hcms_query(config.wf_planning, config.sys_step5_multirole_details),(org_id,org_unit_id,org_id,org_unit_id,))
            json_data['role_details'] = query.dictfetchall(cur)
        except Exception as e:
            json_data['status'] = status_keys.FAILURE_STATUS
            logger_obj.error("Resource Request Details Fetch Operations error is "+ str(e) +" and status is "+ str(json_data['status']) +" attempted by "+str(request.user.username))
        logger_obj.info("Resource Request Details Fetch Operations response is "+ str(json_data) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data))
