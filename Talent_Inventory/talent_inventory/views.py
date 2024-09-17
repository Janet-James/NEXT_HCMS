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
from HCMS_System_Admin.system_admin.models import Reference_Item_Category, Reference_Items
from .models import HCMS_TI_Role_Details, HCMS_TI_Role_SkillSet, HCMS_TI_Role_Critical_Success_Factors, HCMS_TI_Role_KPO, HCMS_TI_Role_KPI
from CommonLib.hcms_common import refitem_fetch, record_validation

import HCMS.settings as status_keys
import logging
import logging.handlers
logger_obj = logging.getLogger('logit')

# from UAM.uam_session_sync import uam_sessions_sync
# from UAM.uam_func_data_sync import uam_func_sync
# from tracking.models import Visitor

f=0

class TIRoleDefinition(TemplateView):
    ''' 
    08-Feb-2018 || SMI || To load role definition page
    @param request: Request Object
    @type request : Object
    @return: HttpResponse or Redirect the another URL
    @author: SMI
    '''
    template_name = "hcms_talent_inventory/ti_role_def.html"
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(TIRoleDefinition, self).dispatch(request, *args, **kwargs)
    
    def get(self, request, *args, **kwargs):
        cur = connection.cursor()
        context = super(TIRoleDefinition, self).get_context_data(**kwargs)
        context['role_type_data'] = refitem_fetch("ROTYP")
        cur.execute(query.fetch_hcms_query(config.talent_inventory, config.ti_reports_to_data))
        context['reports_to_data'] = query.dictfetchall(cur)
        cur.execute(query.fetch_hcms_query(config.talent_inventory, config.ti_fetch_org_list))
        context['role_org'] = query.dictfetchall(cur)
        context['role_grades'] = refitem_fetch("RLGRD")
        context['org_unit_type_data'] = refitem_fetch("OUNTY")
        context['tech_comp_summary'] = refitem_fetch("TECMP")
        context['func_comp_summary'] = refitem_fetch("FNCMP")
        context['behv_comp_summary'] = refitem_fetch("BHCMP")
        context['skill_set_level'] = refitem_fetch("SSLVL")
        for i in context['skill_set_level']:
            if i['refitems_code'] == 'BASIC':
                 context['ss_lvl_basic'] = i['id']
            elif i['refitems_code'] == 'INMDT':
                 context['ss_lvl_intermediate'] = i['id']
            elif i['refitems_code'] == 'ADVCD':
                 context['ss_lvl_advanced'] = i['id']
        return self.render_to_response(context)

class TIReports(TemplateView):
    '''
        12-Feb-2018 || MST || To load Reports page
        @param request: Request Object
        @type request : Object
        @return: HttpResponse or Redirect the another URL
        @author: MST
    '''
    template_name = "hcms_talent_inventory/ti_reports.html"
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(TIReports, self).dispatch(request, *args, **kwargs)
    
    def get(self, request, *args, **kwargs):
        cur = connection.cursor()
        context = super(TIReports, self).get_context_data(**kwargs)
        cur.execute(query.fetch_hcms_query(config.talent_inventory, config.ti_fetch_org_list))
        context['role_org'] = query.dictfetchall(cur)
        context['role_type_data'] = refitem_fetch("ROTYP")
        cur.execute(query.fetch_hcms_query(config.talent_inventory, config.ti_reports_to_data))
        context['reports_to_data'] = query.dictfetchall(cur)
        cur.execute(query.fetch_hcms_query(config.talent_inventory, config.ti_fetch_org_list))
        context['role_org'] = query.dictfetchall(cur)
        cur.execute(query.fetch_hcms_query(config.talent_inventory, config.ti_compt_type))
        context['compt_type'] = query.dictfetchall(cur)
        context['org_unit_type_data'] = refitem_fetch("OUNTY")
        context['tech_comp_summary'] = refitem_fetch("TECMP")
        context['func_comp_summary'] = refitem_fetch("FNCMP")
        context['behv_comp_summary'] = refitem_fetch("BHCMP")
        return self.render_to_response(context)

class HCMSTalentInventoryReportingStructureView(TemplateView):
    ''' 
        12-Feb-2018 || MST || To load Reports page
        @param request: Request Object
        @type request : Object
        @return: HttpResponse or Redirect the another URL
        @author: MST
    '''
    template_name = "hcms_talent_inventory/ti_reporting_structure.html"
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HCMSTalentInventoryReportingStructureView, self).dispatch(request, *args, **kwargs)
    
    def get(self, request, *args, **kwargs):
        cur = connection.cursor()
        context = super(HCMSTalentInventoryReportingStructureView, self).get_context_data(**kwargs)
        cur.execute(query.fetch_hcms_query(config.talent_inventory, config.ti_fetch_org_list))
        context['role_org'] = query.dictfetchall(cur)
        return self.render_to_response(context)

@csrf_exempt
def ti_role_details_fetch(request):
    '''
        15-Feb-2018 || MST || Role Details display function
        @param request: Request Object
        @type request : Object
        @return: HttpResponse of select
        @author: MST
    '''
    json_data = {}
    cur = connection.cursor()
    try:
        logger_obj.info("TI Role details data fetch by "+str(request.user.username))
        cur.execute(query.fetch_hcms_query(config.talent_inventory, config.ti_role_details_fetch))
        json_data["role_details"] = query.dictfetchall(cur)
        json_data["status"] = status_keys.SUCCESS_STATUS
    except Exception as e:
        json_data["status"] = status_keys.FAILURE_STATUS
        logger_obj.error("TI Role details data error is "+ str(e) +" and status is "+ str(json_data['status']) +" attempted by "+str(request.user.username))
    logger_obj.info("TI Role details data fetched response is "+ str(json_data) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data))

@csrf_exempt
def ti_role_details_view(request):
    '''
        15-Feb-2018 || MST || Role Details View function
        @param request: Request Object
        @type request : Object
        @return: HttpResponse of select
        @author: MST
    '''
    json_data = {}
    id_val = request.POST.get("id_val")
    cur = connection.cursor()
    try:
        logger_obj.info("TI Role details view in form by "+str(request.user.username))
        # Role details - Step 1 - Data fill
        cur.execute(query.fetch_hcms_query(config.talent_inventory, config.ti_role_details_view),(str(id_val),))
        json_data['ti_role_details'] = query.dictfetchall(cur)
        
        # Skill Sets - Step 2 - Data fill
        cur.execute(query.fetch_hcms_query(config.talent_inventory, config.ti_skill_set_view),(str(id_val),))
        json_data['ti_skill_sets'] = query.dictfetchall(cur)
        
        # Critical Success Factors - Step 3 - Data fill
        cur.execute(query.fetch_hcms_query(config.talent_inventory, config.ti_critical_suc_fac_view),(str(id_val),))
        json_data['ti_crit_succ_facts'] = query.dictfetchall(cur)
        
        # KPO - Step 4 - Data fill
        cur.execute(query.fetch_hcms_query(config.talent_inventory, config.ti_kpo_view),(str(id_val),))
        json_data['ti_kpo'] = query.dictfetchall(cur)
        
        # KPI - Step 5 - Data fill
        cur.execute(query.fetch_hcms_query(config.talent_inventory, config.ti_kpi_view),(str(id_val),))
        json_data['ti_kpi'] = query.dictfetchall(cur)
        
        json_data["status"] = status_keys.SUCCESS_STATUS
    except Exception as e:
        json_data["status"] = status_keys.FAILURE_STATUS
        logger_obj.error("TI Role details View error is "+ str(e) +" and status is "+ str(json_data['status']) +" attempted by "+str(request.user.username))
    logger_obj.info("TI Role details View final response is "+ str(json_data) +" attempted by "+str(request.user.username))  
    return HttpResponse(json.dumps(json_data))

@csrf_exempt
def ti_skill_set_comp(request):
    '''
        10-Feb-2018 || SMI || Competency Summary listing on selecting competency
        @param request: Request Object
        @type request : Object
        @return: HttpResponse or Redirect the another URL
    '''
    json_data = {}
    try:
        logger_obj.info("TI Skill set competencies fetch  by "+str(request.user.username))
        skill_set_competencies_name = request.POST.get('skill_set_competencies_name')
        competency_id = Reference_Item_Category.objects.filter(refitem_category_name=skill_set_competencies_name).values('id')
        if competency_id:
            competency_id = int(list(competency_id)[0]['id'])
            comp_summary_list = Reference_Items.objects.filter(refitems_category_id=competency_id).values('id', 'refitems_name')
            json_data['comp_summary_list'] = list(comp_summary_list)
        else:
            json_data['comp_summary_list'] = ""
        json_data["status"] = status_keys.SUCCESS_STATUS
    except Exception as e:
        json_data["status"] = status_keys.FAILURE_STATUS
        logger_obj.error("TI Skill set competencies error response is "+ str(e) +" and status is "+ str(json_data['status']) +" attempted by "+str(request.user.username))
    logger_obj.info("TI Skill set competencies fetch response is "+ str(json_data) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data), content_type="application/json")
    
@csrf_exempt
def ti_kpi_headers_fetch(request):
    ''' 
        20-Feb-2018 || MST || Listing Measure Frequency and Customer Rating Scheme in KPI
        @param request: Request Object
        @type request : Object
        @return: HttpResponse of select
        @author: MST
    '''
    json_data = {}
    try:
        logger_obj.info("TI KPI table selection headers fetch by "+str(request.user.username))
        cur = connection.cursor()
        measure_freq_headers = refitem_fetch("MFRNY")
        json_data['meas_heads'] = measure_freq_headers
        cur.execute(query.fetch_hcms_query(config.talent_inventory, config.ti_kpi_headers))
        rating_scheme_headers = query.dictfetchall(cur)
        json_data['rate_heads'] = rating_scheme_headers
        json_data["status"] = status_keys.SUCCESS_STATUS
        
    except Exception as e:
        json_data["status"] = status_keys.FAILURE_STATUS
        logger_obj.error("TI KPI table selection headers error response is "+ str(e) +" and status is "+ str(json_data['status']) +" attempted by "+str(request.user.username))
    logger_obj.info("TI KPI table selection headers fetch response is "+ str(json_data) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data))
    
@csrf_exempt
def ti_role_def_create(request):
    ''' 
        10-Feb-2018 || SMI || To insert the role definition data
        @param request: Request Object
        @type request : Object
        @return: HttpResponse or Redirect the another URL
    '''
    json_data = {}
    logger_obj.info("TI Role definition details save by "+str(request.user.username))
    username = request.user.username
    uid = request.user.id
    if not uid:
        uid = 1
    if request.method == "POST":
        try:
            ti_role_def_id = request.POST.get("ti_role_def_id")
            ti_rd_form_data = request.POST.get("ti_rd_form_data")
            ti_rd_form_data = json.loads(ti_rd_form_data)
            ti_rd_role_grades = request.POST.get("ti_rd_role_grades")
            ti_rd_role_grades = map(int, json.loads(ti_rd_role_grades))
            kpo_data_list = request.POST.get("kpo_data_list")
            kpo_data_list = json.loads(kpo_data_list)
            kpi_data_list = request.POST.get("kpi_data_list")
            kpi_data_list = json.loads(kpi_data_list)
            ti_rd_org_units = request.POST.get("ti_rd_org_units")
            ti_rd_org_units = map(int, json.loads(ti_rd_org_units))
            ti_rd_dept = request.POST.get("ti_rd_dept")
            ti_rd_dept = map(int, json.loads(ti_rd_dept))
            if ti_rd_form_data['rd_details_exp']:
                rd_details_exp = ti_rd_form_data['rd_details_exp']
            else:
                rd_details_exp = None
            cur = connection.cursor()
            try:
                if ti_role_def_id == "":
                    cur.execute(query.fetch_hcms_query(config.talent_inventory, config.ti_role_details_id),(ti_rd_form_data['rd_details_title'],))
                    role_exist = query.dictfetchall(cur)
                    if role_exist:
                        json_data["status"] = status_keys.ERR0016
                        logger_obj.error("TI Role already exists response status is "+ str(json_data['status']) +" attempted by "+str(username))
                    else:
                        if 'rd_details_reps_to' in ti_rd_form_data:
                            ti_rd_create = HCMS_TI_Role_Details.objects.create(role_title=ti_rd_form_data['rd_details_title'],
                                                                               role_req_work_exp=rd_details_exp,
                                                                               role_org_id=ti_rd_form_data['rd_details_org'],
                                                                               role_org_unit=ti_rd_org_units,
                                                                               role_req_no_of_resource=ti_rd_form_data['rd_details_req_res'],
                                                                               role_grade=ti_rd_role_grades,
                                                                               role_need=ti_rd_form_data['rd_details_need'],
                                                                               role_depts=ti_rd_dept,
                                                                               role_type_refitem_id=ti_rd_form_data['rd_details_type'],
                                                                               role_pref_edu=ti_rd_form_data['rd_details_pref_edu'],
                                                                               role_resp=ti_rd_form_data['rd_details_resp'],
                                                                               role_travel=ti_rd_form_data['rd_details_travel'],
                                                                               role_reports_to_id=ti_rd_form_data['rd_details_reps_to'],
                                                                               created_by_id=uid, 
                                                                               modified_by_id=uid
                                                                               )
                            ti_rd_create_id = ti_rd_create.id
                            ti_role_def_create_cmn_data = ti_role_def_create_cmn(ti_rd_form_data,kpo_data_list,kpi_data_list,ti_rd_create_id,uid,username)
                        else: 
                            ti_rd_create = HCMS_TI_Role_Details.objects.create(role_title=ti_rd_form_data['rd_details_title'],
                                                                               role_req_work_exp=rd_details_exp,
                                                                               role_org_id=ti_rd_form_data['rd_details_org'],
                                                                               role_org_unit=ti_rd_org_units,
                                                                               role_req_no_of_resource=ti_rd_form_data['rd_details_req_res'],
                                                                               role_grade=ti_rd_role_grades,
                                                                               role_need=ti_rd_form_data['rd_details_need'],
                                                                               role_depts=ti_rd_dept,
                                                                               role_type_refitem_id=ti_rd_form_data['rd_details_type'],
                                                                               role_pref_edu=ti_rd_form_data['rd_details_pref_edu'],
                                                                               role_resp=ti_rd_form_data['rd_details_resp'],
                                                                               role_travel=ti_rd_form_data['rd_details_travel'],
                                                                               role_reports_to_id=1,
                                                                               created_by_id=uid, 
                                                                               modified_by_id=uid)
                            ti_rd_create_id = ti_rd_create.id
                            ti_role_def_create_cmn_data = ti_role_def_create_cmn(ti_rd_form_data,kpo_data_list,kpi_data_list,ti_rd_create_id,uid,username)
                        json_data["status"] = ti_role_def_create_cmn_data["status"]
                        logger_obj.info("TI Role details create response is "+ str(json_data) +" attempted by "+str(request.user.username))
                else:
                    logger_obj.info("TI Role definition details update by "+ username)
                    cur.execute(query.fetch_hcms_query(config.talent_inventory, config.ti_role_details_id),(ti_rd_form_data['rd_details_title'],))
                    role_exist = query.dictfetchall(cur)
                    if role_exist:
                        if int(role_exist[0]['id']) == int(ti_role_def_id):
                            if 'rd_details_reps_to' in ti_rd_form_data:
                                ti_rd_update_role_details = HCMS_TI_Role_Details.objects.get(id=ti_role_def_id)
                                ti_rd_update_role_details.role_title=ti_rd_form_data['rd_details_title']
                                ti_rd_update_role_details.role_org_id=ti_rd_form_data['rd_details_org']
                                ti_rd_update_role_details.role_org_unit=ti_rd_org_units
                                ti_rd_update_role_details.role_req_no_of_resource=ti_rd_form_data['rd_details_req_res']
                                ti_rd_update_role_details.role_grade=ti_rd_role_grades
                                ti_rd_update_role_details.role_req_work_exp=rd_details_exp
                                ti_rd_update_role_details.role_need=ti_rd_form_data['rd_details_need']
                                ti_rd_update_role_details.role_depts=ti_rd_dept
                                ti_rd_update_role_details.role_type_refitem_id=ti_rd_form_data['rd_details_type']
                                ti_rd_update_role_details.role_pref_edu=ti_rd_form_data['rd_details_pref_edu']
                                ti_rd_update_role_details.role_resp=ti_rd_form_data['rd_details_resp']
                                ti_rd_update_role_details.role_travel=ti_rd_form_data['rd_details_travel']
                                ti_rd_update_role_details.role_reports_to_id=ti_rd_form_data['rd_details_reps_to']
                                ti_rd_update_role_details.modified_by_id=uid
                                ti_rd_update_role_details.save()
                                ti_role_def_update_cmn_data = ti_role_def_update_cmn(ti_rd_form_data,kpo_data_list,kpi_data_list,ti_role_def_id,uid,username)
                            else:
                                ti_rd_update_role_details = HCMS_TI_Role_Details.objects.get(id=ti_role_def_id)
                                ti_rd_update_role_details.role_title=ti_rd_form_data['rd_details_title']
                                ti_rd_update_role_details.role_org_id=ti_rd_form_data['rd_details_org']
                                ti_rd_update_role_details.role_org_unit=ti_rd_org_units
                                ti_rd_update_role_details.role_req_no_of_resource=ti_rd_form_data['rd_details_req_res']
                                ti_rd_update_role_details.role_grade=ti_rd_role_grades
                                ti_rd_update_role_details.role_req_work_exp=rd_details_exp
                                ti_rd_update_role_details.role_need=ti_rd_form_data['rd_details_need']
                                ti_rd_update_role_details.role_depts=ti_rd_dept
                                ti_rd_update_role_details.role_type_refitem_id=ti_rd_form_data['rd_details_type']
                                ti_rd_update_role_details.role_pref_edu=ti_rd_form_data['rd_details_pref_edu']
                                ti_rd_update_role_details.role_resp=ti_rd_form_data['rd_details_resp']
                                ti_rd_update_role_details.role_travel=ti_rd_form_data['rd_details_travel']
                                ti_rd_update_role_details.role_reports_to_id=1
                                ti_rd_update_role_details.modified_by_id=uid
                                ti_rd_update_role_details.save()
                                ti_role_def_update_cmn_data = ti_role_def_update_cmn(ti_rd_form_data,kpo_data_list,kpi_data_list,ti_role_def_id,uid,username)
                            json_data["status"] = ti_role_def_update_cmn_data["status"]
                            logger_obj.info("TI Role details update response is "+ str(json_data) +" attempted by "+username)
                        else:
                            json_data["status"] = status_keys.ERR0016
                            logger_obj.error("TI Role details update error response is "+ str(json_data['status']) +" attempted by "+ username)
                    else:
                        if 'rd_details_reps_to' in ti_rd_form_data:
                            ti_rd_update_role_details = HCMS_TI_Role_Details.objects.get(id=ti_role_def_id)
                            ti_rd_update_role_details.role_title=ti_rd_form_data['rd_details_title']
                            ti_rd_update_role_details.role_org_id=ti_rd_form_data['rd_details_org']
                            ti_rd_update_role_details.role_org_unit=ti_rd_org_units
                            ti_rd_update_role_details.role_req_no_of_resource=ti_rd_form_data['rd_details_req_res']
                            ti_rd_update_role_details.role_grade=ti_rd_role_grades
                            ti_rd_update_role_details.role_req_work_exp=rd_details_exp
                            ti_rd_update_role_details.role_need=ti_rd_form_data['rd_details_need']
                            ti_rd_update_role_details.role_depts=ti_rd_dept
                            ti_rd_update_role_details.role_type_refitem_id=ti_rd_form_data['rd_details_type']
                            ti_rd_update_role_details.role_pref_edu=ti_rd_form_data['rd_details_pref_edu']
                            ti_rd_update_role_details.role_resp=ti_rd_form_data['rd_details_resp']
                            ti_rd_update_role_details.role_travel=ti_rd_form_data['rd_details_travel']
                            ti_rd_update_role_details.role_reports_to_id=ti_rd_form_data['rd_details_reps_to']
                            ti_rd_update_role_details.modified_by_id=uid
                            ti_rd_update_role_details.save()
                            ti_role_def_update_cmn_data = ti_role_def_update_cmn(ti_rd_form_data,kpo_data_list,kpi_data_list,ti_role_def_id,uid,username)
                        else:
                            ti_rd_update_role_details = HCMS_TI_Role_Details.objects.get(id=ti_role_def_id)
                            ti_rd_update_role_details.role_title=ti_rd_form_data['rd_details_title']
                            ti_rd_update_role_details.role_org_id=ti_rd_form_data['rd_details_org']
                            ti_rd_update_role_details.role_org_unit=ti_rd_org_units
                            ti_rd_update_role_details.role_req_no_of_resource=ti_rd_form_data['rd_details_req_res']
                            ti_rd_update_role_details.role_grade=ti_rd_role_grades
                            ti_rd_update_role_details.role_req_work_exp=rd_details_exp
                            ti_rd_update_role_details.role_need=ti_rd_form_data['rd_details_need']
                            ti_rd_update_role_details.role_depts=ti_rd_dept
                            ti_rd_update_role_details.role_type_refitem_id=ti_rd_form_data['rd_details_type']
                            ti_rd_update_role_details.role_pref_edu=ti_rd_form_data['rd_details_pref_edu']
                            ti_rd_update_role_details.role_resp=ti_rd_form_data['rd_details_resp']
                            ti_rd_update_role_details.role_travel=ti_rd_form_data['rd_details_travel']
                            ti_rd_update_role_details.role_reports_to_id=1
                            ti_rd_update_role_details.modified_by_id=uid
                            ti_rd_update_role_details.save()
                            ti_role_def_update_cmn_data = ti_role_def_update_cmn(ti_rd_form_data,kpo_data_list,kpi_data_list,ti_role_def_id,uid,username)
                        json_data["status"] = ti_role_def_update_cmn_data["status"]
                        logger_obj.info("TI Role details update response 2 is "+ str(json_data) +" attempted by "+username)
            except Exception as e:
                json_data["status"] = status_keys.FAILURE_STATUS
                logger_obj.error("TI role details save error message is "+ str(e) +" and status is "+ str(json_data['status']) +" attempted by "+str(request.user.username))
        except Exception as e:
            json_data["status"] = status_keys.FAILURE_STATUS
            logger_obj.error("TI role details save error message is "+ str(e) +" and status is "+ str(json_data['status']) +" attempted by "+str(request.user.username))
    else:
        json_data["status"] = status_keys.FAILURE_STATUS
        logger_obj.error("TI role details save error response is "+ str(json_data['status']) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data))
        
def ti_role_def_create_cmn(ti_rd_form_data,kpo_data_list,kpi_data_list,ti_rd_create_id,uid,username):
    # 14-Feb-2018 || SMI || To insert Skill Set Data
    json_data = {}
    try:
        cur = connection.cursor()
        comp_data_dict = {}
        comp_dict = {}
        applicable_dict = {}
        tech_dept_dict = {}
        func_dept_dict = {}
        behv_dept_dict = {}
        for keys, values in ti_rd_form_data.iteritems():
            if keys.startswith("rd_ss_tech_lvl"):
                tech_comp_id = int(keys.split('rd_ss_tech_lvl')[1])
                comp_dict[tech_comp_id] = values
            if keys.startswith("rd_ss_func_lvl"):
                func_comp_id = int(keys.split('rd_ss_func_lvl')[1])
                comp_dict[func_comp_id] = values
            if keys.startswith("rd_ss_behv_lvl"):
                behv_comp_id = int(keys.split('rd_ss_behv_lvl')[1])
                comp_dict[behv_comp_id] = values
            if keys.startswith("rd_ss_tech_applicable"):
                tech_applic_comp_id = int(keys.split('rd_ss_tech_applicable')[1])
                applicable_dict[tech_applic_comp_id] = values
            if keys.startswith("rd_ss_func_applicable"):
                func_applic_comp_id = int(keys.split('rd_ss_func_applicable')[1])
                applicable_dict[func_applic_comp_id] = values
            if keys.startswith("rd_ss_behv_applicable"):
                behv_applic_comp_id = int(keys.split('rd_ss_behv_applicable')[1])
                applicable_dict[behv_applic_comp_id] = values
            if keys.startswith("rd_ss_tech_dept"):
                tech_dept_id = int(keys.split('rd_ss_tech_dept')[1])
                tech_dept_dict[tech_dept_id] = map(int, values)
            if keys.startswith("rd_ss_func_dept"):
                func_dept_id = int(keys.split('rd_ss_func_dept')[1])
                func_dept_dict[func_dept_id] = map(int, values)
            if keys.startswith("rd_ss_behv_dept"):
                behv_dept_id = int(keys.split('rd_ss_behv_dept')[1])
                behv_dept_dict[behv_dept_id] = map(int, values)
        tech_dept_dict.update(func_dept_dict)
        tech_dept_dict.update(behv_dept_dict)
        final_dept_dict = tech_dept_dict
        for keys, values in comp_dict.iteritems():
            if keys in applicable_dict:
                comp_data_dict[keys] = ['True', values]
            else:
                comp_data_dict[keys] = ['False', values]
        comp_data_dict = { k: [comp_data_dict.get(k, 0) , final_dept_dict.get(k, 0)] for k in set(comp_data_dict) | set(final_dept_dict) }
        for i in range(0,len(comp_data_dict)):
            data_key = comp_data_dict.keys()[i]
            HCMS_TI_Role_SkillSet.objects.create(skillset_role_id=ti_rd_create_id,
                                                 skillset_competency_id_id=int(data_key),
                                                 skillset_applicable=comp_data_dict[data_key][0][0],
                                                 skillset_skill_level_refitem_id=comp_data_dict[data_key][0][1],
                                                 skillset_depts=map(int, comp_data_dict[data_key][1]),
                                                 created_by_id=uid, 
                                                 modified_by_id=uid)
        # 14-Feb-2018 || KAV || To insert Critical Success Factor Data
        for keys, values in ti_rd_form_data.iteritems():
            if keys.startswith("rd_csf_text"):
                HCMS_TI_Role_Critical_Success_Factors.objects.create(factors_role_id=ti_rd_create_id,
                                                                     factors_crit_succ_fact=values,
                                                                     created_by_id=uid, 
                                                                     modified_by_id=uid)
        # 12-Feb-2018 || MST || KPO Role Insert function
        for i in range(0,len(kpo_data_list)):
            statement = kpo_data_list[i][0]
            outcome = kpo_data_list[i][1]
            target_date = kpo_data_list[i][2]
            perfor_stand = kpo_data_list[i][3]
            plan = kpo_data_list[i][4]
            HCMS_TI_Role_KPO.objects.create(kpo_statement=statement,
                                            kpo_outcome=outcome,
                                            kpo_target_date=target_date,
                                            kpo_performance_std=perfor_stand,
                                            kpo_plan=plan,
                                            kpo_role_id=ti_rd_create_id,
                                            created_by_id=uid,
                                            modified_by_id=uid)
        #14-Feb-2018 || MST || KPI Role Insert function
        for i in range(0,len(kpi_data_list)):
            key_performance = kpi_data_list[i][0]
            plan_target = kpi_data_list[i][1]
            target_type = kpi_data_list[i][2]
            start_perform = kpi_data_list[i][3]
            measure_freq = kpi_data_list[i][4]
            cust_rate_scheme = kpi_data_list[i][5]
            cur.execute(query.fetch_hcms_query(config.talent_inventory, config.kpi_measure_freq_id),(str(measure_freq),))
            measure_freq = query.dictfetchall(cur)
            cur.execute(query.fetch_hcms_query(config.talent_inventory, config.custom_rate_id),(str(cust_rate_scheme),))
            cust_rate_scheme = query.dictfetchall(cur)
            HCMS_TI_Role_KPI.objects.create(kpi_definition=key_performance,
                                            kpi_plan=plan_target,
                                            kpi_units=target_type,
                                            kpi_starting_perf=start_perform,
                                            kpi_measure_frequency_refitem_id=measure_freq[0]['kpi_measure_freq_id'],
                                            kpi_custom_rating_scheme_id_id=cust_rate_scheme[0]['custom_rate_id'],
                                            kpi_role_id=ti_rd_create_id,
                                            created_by_id=uid,
                                            modified_by_id=uid)
        json_data["status"] = status_keys.SUCCESS_STATUS
        logger_obj.info("TI Role definition details common create response is "+ str(json_data) +" attempted by "+username)
    except Exception as e:
        json_data["status"] = str(e)
        logger_obj.error("TI Role definition details common create error message is "+ str(e) +" and status is "+ str(json_data['status']) +" attempted by "+username)
    return json_data
         
def ti_role_def_update_cmn(ti_rd_form_data,kpo_data_list,kpi_data_list,ti_role_def_id,uid,username):
    json_data = {}
    try:
        cur = connection.cursor()
        # 21-Feb-2018 || SMI || To update Skill Set Data
        logger_obj.info("TI Role definition details update by "+username)
        comp_data_dict = {}
        comp_dict = {}
        applicable_dict = {}
        tech_dept_dict = {}
        func_dept_dict = {}
        behv_dept_dict = {}
        for keys, values in ti_rd_form_data.iteritems():
            if keys.startswith("rd_ss_tech_lvl"):
                tech_comp_id = int(keys.split('rd_ss_tech_lvl')[1])
                comp_dict[tech_comp_id] = values
            if keys.startswith("rd_ss_func_lvl"):
                func_comp_id = int(keys.split('rd_ss_func_lvl')[1])
                comp_dict[func_comp_id] = values
            if keys.startswith("rd_ss_behv_lvl"):
                behv_comp_id = int(keys.split('rd_ss_behv_lvl')[1])
                comp_dict[behv_comp_id] = values
            if keys.startswith("rd_ss_tech_applicable"):
                tech_applic_comp_id = int(keys.split('rd_ss_tech_applicable')[1])
                applicable_dict[tech_applic_comp_id] = values
            if keys.startswith("rd_ss_func_applicable"):
                func_applic_comp_id = int(keys.split('rd_ss_func_applicable')[1])
                applicable_dict[func_applic_comp_id] = values
            if keys.startswith("rd_ss_behv_applicable"):
                behv_applic_comp_id = int(keys.split('rd_ss_behv_applicable')[1])
                applicable_dict[behv_applic_comp_id] = values
            if keys.startswith("rd_ss_tech_dept"):
                tech_dept_id = int(keys.split('rd_ss_tech_dept')[1])
                tech_dept_dict[tech_dept_id] = map(int, values)
            if keys.startswith("rd_ss_func_dept"):
                func_dept_id = int(keys.split('rd_ss_func_dept')[1])
                func_dept_dict[func_dept_id] = map(int, values)
            if keys.startswith("rd_ss_behv_dept"):
                behv_dept_id = int(keys.split('rd_ss_behv_dept')[1])
                behv_dept_dict[behv_dept_id] = map(int, values)
        tech_dept_dict.update(func_dept_dict)
        tech_dept_dict.update(behv_dept_dict)
        final_dept_dict = tech_dept_dict
        for keys, values in comp_dict.iteritems():
            if keys in applicable_dict:
                comp_data_dict[keys] = ['True', values]
            else:
                comp_data_dict[keys] = ['False', values]
        comp_data_dict = { k: [comp_data_dict.get(k, 0) , final_dept_dict.get(k, 0)] for k in set(comp_data_dict) | set(final_dept_dict) }
        for i in range(0,len(comp_data_dict)):
            data_key = comp_data_dict.keys()[i]
            ti_rd_update_role_skillsets = HCMS_TI_Role_SkillSet.objects.filter(skillset_role_id=ti_role_def_id, skillset_competency_id_id=data_key)
            if HCMS_TI_Role_SkillSet.objects.filter(skillset_role_id=ti_role_def_id, skillset_competency_id_id=data_key):
                ti_rd_update_role_skillsets = HCMS_TI_Role_SkillSet.objects.get(skillset_role_id=ti_role_def_id, skillset_competency_id_id=data_key)
                ti_rd_update_role_skillsets.skillset_applicable=comp_data_dict[data_key][0][0]
                ti_rd_update_role_skillsets.skillset_skill_level_refitem_id=comp_data_dict[data_key][0][1]
                ti_rd_update_role_skillsets.skillset_depts=map(int, comp_data_dict[data_key][1])
                ti_rd_update_role_skillsets.modified_by_id=uid
                ti_rd_update_role_skillsets.save()
            else:
                HCMS_TI_Role_SkillSet.objects.create(skillset_role_id=ti_role_def_id,
                                                 skillset_competency_id_id=int(data_key),
                                                 skillset_applicable=comp_data_dict[data_key][0][0],
                                                 skillset_skill_level_refitem_id=comp_data_dict[data_key][0][1],
                                                 skillset_depts=map(int, comp_data_dict[data_key][1]),
                                                 created_by_id=uid, 
                                                 modified_by_id=uid)
        # 23-Feb-2018 || SMI || To update Critical Success Factor Data
        HCMS_TI_Role_Critical_Success_Factors.objects.filter(factors_role_id = ti_role_def_id).delete()
        for keys, values in ti_rd_form_data.iteritems():
            if keys.startswith("rd_csf_text"):
                HCMS_TI_Role_Critical_Success_Factors.objects.create(factors_role_id=ti_role_def_id,
                                                                     factors_crit_succ_fact=values,
                                                                     created_by_id=uid, 
                                                                     modified_by_id=uid)
        # 23-Feb-2018 || SMI || KPO Role Update function
        HCMS_TI_Role_KPO.objects.filter(kpo_role_id = ti_role_def_id).delete()
        for i in range(0,len(kpo_data_list)):
            statement = kpo_data_list[i][0]
            outcome = kpo_data_list[i][1]
            target_date = kpo_data_list[i][2]
            perfor_stand = kpo_data_list[i][3]
            plan = kpo_data_list[i][4]

            HCMS_TI_Role_KPO.objects.create(kpo_statement=statement,
                                            kpo_outcome=outcome,
                                            kpo_target_date=target_date,
                                            kpo_performance_std=perfor_stand,
                                            kpo_plan=plan,
                                            kpo_role_id=ti_role_def_id,
                                            created_by_id=uid,
                                            modified_by_id=uid)
        # 23-Feb-2018 || SMI || KPI Role Insert function
        cur.execute(query.fetch_hcms_query(config.talent_inventory, config.KPI_update_delete),(str(ti_role_def_id),))
        for i in range(0,len(kpi_data_list)):
            key_performance = kpi_data_list[i][0]
            plan_target = kpi_data_list[i][1]
            target_type = kpi_data_list[i][2]
            start_perform = kpi_data_list[i][3]
            measure_freq = kpi_data_list[i][4]
            cust_rate_scheme = kpi_data_list[i][5]
            
            cur.execute(query.fetch_hcms_query(config.talent_inventory, config.kpi_measure_freq_id),(str(measure_freq),))
            measure_freq = query.dictfetchall(cur)

            cur.execute(query.fetch_hcms_query(config.talent_inventory, config.custom_rate_id),(str(cust_rate_scheme),))
            cust_rate_scheme = query.dictfetchall(cur)
            HCMS_TI_Role_KPI.objects.create(kpi_definition=key_performance,
                                            kpi_plan=plan_target,
                                            kpi_units=target_type,
                                            kpi_starting_perf=start_perform,
                                            kpi_measure_frequency_refitem_id=measure_freq[0]['kpi_measure_freq_id'],
                                            kpi_custom_rating_scheme_id_id=cust_rate_scheme[0]['custom_rate_id'],
                                            kpi_role_id=ti_role_def_id,
                                            created_by_id=uid,
                                            modified_by_id=uid)
        json_data["status"] = status_keys.UPDATE_STATUS
        logger_obj.info("TI Role definition details update response is "+ str(json_data) +" attempted by "+username)
    except Exception as e:
        json_data["status"] = str(e)
        logger_obj.error("TI Role definition details update error message is "+ str(e) +" and status is "+ str(json_data['status']) +" attempted by "+username)
    return json_data
    
@csrf_exempt
def ti_role_def_delete(request):
    json_data = {}
    logger_obj.info("TI Role definition details delete initiated by "+str(request.user.username))
    username = request.user.username
    uid = request.user.id
    if not uid:
        uid = 1
    try:
        if request.method == "POST":
            cur = connection.cursor()
            ti_role_def_id = request.POST.get("ti_role_def_id")
            referred_record = record_validation('hcms_ti_role_details', ti_role_def_id)
            if referred_record == True:
                ti_rd_delete_role_details = HCMS_TI_Role_Details.objects.get(id=ti_role_def_id)
                ti_rd_delete_role_details.is_active='False'
                ti_rd_delete_role_details.modified_by_id=uid
                ti_rd_delete_role_details.save()
                json_data["status"] = status_keys.REMOVE_STATUS
            else:
                json_data["status"] = status_keys.ERR0028
            logger_obj.info("TI Role definition details delete response is "+ str(json_data) +" attempted by "+username)
    except Exception as e:
        json_data["status"] = status_keys.FAILURE_STATUS
        logger_obj.error("TI Role definition details delete error message is "+ str(e) + " and attempted by "+username)
    return HttpResponse(json.dumps(json_data))
        
def dateconverter(o):
    """
    15-Feb-2018 || MST || Date Convert
    @return: Returns instance of datetime
    """
    if isinstance(o, datetime.date):
        return o.__str__()
    
@csrf_exempt
def ti_report_role_details(request):
    '''
        14-Feb-2018 || KAV || To fetch the reporting structure details 
        @param request: Request Object
        @type request : Object
        @return: HttpResponse or Redirect the another URL
    '''
    cur = connection.cursor()
    post = request.POST
    org_id = request.POST.get("org_id")
    org_unit_id = request.POST.get("org_unit_id")
    cur.execute(query.fetch_hcms_query(config.talent_inventory, config.ti_reports_struct_data),(org_id,org_unit_id,))
    role_details = query.dictfetchall(cur)
    return HttpResponse(json.dumps(role_details))  

@csrf_exempt     
def ti_reports_to_update(request):
    '''
        23-Feb-2018 || KAV || To fetch the reporting to list 
        @param request: Request Object
        @type request : Object
        @return: HttpResponse or Redirect the another URL
    '''
    json_data={}
    cur = connection.cursor()
    cur.execute(query.fetch_hcms_query(config.talent_inventory, config.ti_reports_to_data))
    json_data['role_reports_to']=query.dictfetchall(cur)
    return HttpResponse(json.dumps(json_data))  

class TDDashboardView(TemplateView):
    ''' 
    28-Feb-2018 || ANT || To load talent inventory dashboard
    @param request: Request Object
    @type request : Object
    @return: HttpResponse or Redirect the another URL
    @author: ANT
    '''
    template_name = "hcms_talent_inventory/tdd_info.html"
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(TDDashboardView, self).dispatch(request, *args, **kwargs)
    
    def get(self, request, *args, **kwargs):
        cur = connection.cursor()
        context = super(TDDashboardView, self).get_context_data(**kwargs)
        cur.execute(query.fetch_hcms_query(config.talent_inventory, config.ti_org_unit_types_count))
        context['org_unit_types_count'] = query.dictfetchall(cur)
        cur.execute(query.fetch_hcms_query(config.talent_inventory, config.ti_uniq_emp_roles_count))
        context['uniq_emp_roles_count'] = query.dictfetchall(cur)
        cur.execute(query.fetch_hcms_query(config.talent_inventory, config.ti_tech_comp_count))
        context['tech_comp_count'] = query.dictfetchall(cur)
        cur.execute(query.fetch_hcms_query(config.talent_inventory, config.ti_func_comp_count))
        context['func_comp_count'] = query.dictfetchall(cur)
        cur.execute(query.fetch_hcms_query(config.talent_inventory, config.ti_behv_comp_count))
        context['behv_comp_count'] = query.dictfetchall(cur)
        context['org_unit_type_data'] = refitem_fetch("OUNTY")
        return self.render_to_response(context)
    
@csrf_exempt
def ti_dashboard_charts(request):
    '''
        07-MAR-2018 || SMI || To fetch value for role design chart in dashboard
        @param request: Request Object
        @type request : Object
        @return: HttpResponse of select
        @author: SMI
    '''
    global f
    if f == 1:
        f = 0
    username = str(request.user.username)
    json_data = {}
    if request.method == "POST":
        try:
            rd_chart_select = int(request.POST.get("rd_chart_select"))
            logger_obj.info("Role design chart data fetch by "+str(request.user.username))
            cur = connection.cursor()
            if rd_chart_select == 0:
                cur.execute(query.fetch_hcms_query(config.talent_inventory, config.dash_chart1_all))
                json_data["rd_chart1_data"] = query.dictfetchall(cur)
            else:
                cur.execute(query.fetch_hcms_query(config.talent_inventory, config.dash_chart1),(rd_chart_select,))
                json_data["rd_chart1_data"] = query.dictfetchall(cur)
            temp_dic = {}
            cur.execute(query.fetch_hcms_query(config.talent_inventory, config.tcc_dash_chart2))
            temp_dic["tcc_chart2_data"] = query.dictfetchall(cur)
            tcc_chart2_data = temp_dic["tcc_chart2_data"]
            cur.execute(query.fetch_hcms_query(config.talent_inventory, config.fcc_dash_chart2))
            temp_dic["fcc_chart2_data"] = query.dictfetchall(cur)
            fcc_chart2_data = temp_dic["fcc_chart2_data"]
            cur.execute(query.fetch_hcms_query(config.talent_inventory, config.bcc_dash_chart2))
            temp_dic["bcc_chart2_data"] = query.dictfetchall(cur)
            bcc_chart2_data = temp_dic["bcc_chart2_data"]
            res_list = []
            tcc_chart2_key = []
            tcc_chart2_value = []
            for i in tcc_chart2_data:
                tcc_chart2_key.append(i.values()[0]), tcc_chart2_value.append(i.values()[1])
            res_list.append(dict(zip(tcc_chart2_key,tcc_chart2_value)))
            fcc_chart2_key = []
            fcc_chart2_value = []
            for i in fcc_chart2_data:
                fcc_chart2_key.append(i.values()[0]), fcc_chart2_value.append(i.values()[1])
            res_list.append(dict(zip(fcc_chart2_key,fcc_chart2_value)))
            bcc_chart2_key = []
            bcc_chart2_value = []
            for i in bcc_chart2_data:
                bcc_chart2_key.append(i.values()[0]), bcc_chart2_value.append(i.values()[1])
            res_list.append(dict(zip(bcc_chart2_key,bcc_chart2_value)))
            keys_list = list(set([j  for i in res_list for j in i.keys()]))
            temp_dict = {}
            for i in keys_list:
                temp_list = []
                for j in res_list:
                    temp_list.append(j.get(i,0))
                temp_dict[str(i)] = temp_list
            result_dict = {}
            def res_form_fn(x,y):
                try:
                    global f;
                    result_list = []
                    if f==0:
                        x_list = temp_dict[x]
                        y_list = temp_dict[y]
                        result_dict[x] = x_list
                        f=1
                    else:
                        x_list = result_dict[x]
                        y_list = temp_dict[y]
                    
                    for i,j in zip(x_list,y_list):
                        if i==0:
                            result_list.append(j)
                        elif j==0:
                            result_list.append(i)
                        else:
                            result_list.append(j)
                    result_dict[y] = result_list
                    return y
                except Exception as e:
                    logger_obj.error("Role design chart data fetch - error message is "+ str(e) + " and attempted by "+username)
            dict_keys = sorted(temp_dict.keys())
            reduce((lambda x, y: res_form_fn(x,y)),dict_keys)
            json_data["rd_chart2_data"] = json.dumps(result_dict, sort_keys = True)
        except Exception as e:
            json_data["rd_chart1_data"] = "No data"
            json_data["rd_chart2_data"] = "No data"
            logger_obj.error("Role design chart data fetch - error message is "+ str(e) + " and attempted by "+username)
    return HttpResponse(json.dumps(json_data))

@csrf_exempt
def ti_role_details_reports(request):
    '''
        1-MAR-2018 || KAV || Report Role details display function
        @param request: Request Object
        @type request : Object
        @return: HttpResponse of select
        @author: KAV
    '''
    username = str(request.user.username)
    json_data = {}
    if request.method == "POST":
        try:
            logger_obj.info("Reports data fetch by "+str(request.user.username))
            role_type_val = request.POST.get("role_type_val")
            org_val = request.POST.get("role_org_val")
            org_unit_val = request.POST.get("role_org_unit_val")
            reports_to = request.POST.get("reports_to")
            if role_type_val == '': role_type_val = 0
            if org_val == '': org_val = 0
            if org_unit_val == '': org_unit_val = 0
            if reports_to == '': reports_to = 0
            
            cur = connection.cursor()
            query =  """select rd.id, rd.role_title, ri1.refitems_name as role_type, org.name as org_name,
                        rd1.role_title as reports_to
                        from hcms_ti_role_details rd inner join reference_items ri1 on rd.role_type_refitem_id = ri1.id
                        inner join organization_info org on org.id = rd.role_org_id
                        inner join hcms_ti_role_details rd1 on rd.role_reports_to_id = rd1.id where rd.is_active = True and """
            if role_type_val != 0 and org_unit_val != 0 and reports_to != 0:
                query = query + "rd.role_type_refitem_id = %s and %s = any(rd.role_org_unit)  and rd.role_reports_to_id = %s and rd.role_org_id = %s order by rd.id"
                cur.execute(query,(role_type_val, org_unit_val, reports_to,org_val,))
                json_data['reports_val'] = cur.fetchall()
            elif role_type_val != 0 and org_unit_val == 0 and reports_to == 0:
                query = query + "rd.role_type_refitem_id = %s order by rd.id"
                cur.execute(query,(role_type_val,))
                json_data['reports_val'] = cur.fetchall()
            elif role_type_val == 0 and org_unit_val != 0 and reports_to == 0:
                query = query + "%s = any(rd.role_org_unit) and rd.role_org_id = %s order by rd.id"
                cur.execute(query,(org_unit_val,org_val,))
                json_data['reports_val'] = cur.fetchall()
            elif role_type_val == 0 and org_unit_val == 0 and reports_to != 0:
                query = query + "rd.role_reports_to_id = %s order by rd.id"
                cur.execute(query,(reports_to,))
                json_data['reports_val'] = cur.fetchall()
            elif role_type_val != 0 and org_unit_val != 0 and reports_to == 0:
                query = query + "rd.role_type_refitem_id = %s and %s = any(rd.role_org_unit) and rd.role_org_id = %s order by rd.id"
                cur.execute(query,(role_type_val, org_unit_val,org_val,))
                json_data['reports_val'] = cur.fetchall()
            elif role_type_val != 0 and org_unit_val == 0 and reports_to != 0:
                query = query + "rd.role_type_refitem_id = %s and rd.role_reports_to_id = %s  order by rd.id"
                cur.execute(query,(role_type_val, reports_to,))
                json_data['reports_val'] = cur.fetchall()
            elif role_type_val == 0 and org_unit_val != 0 and reports_to != 0:
                query = query + "%s =any(rd.role_org_unit) and rd.role_reports_to_id = %s and rd.role_org_id = %s order by rd.id"
                cur.execute(query,(org_unit_val, reports_to,org_val,))
                json_data['reports_val'] = cur.fetchall()
            else:
                json_data['reports_val'] = ""
        except Exception as e:
            json_data["reports_val"] = status_keys.FAILURE_STATUS
            logger_obj.error("Reports data fetch - error message is "+ str(e) + " and attempted by "+username)
    return HttpResponse(json.dumps(json_data))
 
@csrf_exempt
def ti_compt_details_reports(request):
    '''
        1-MAR-2018 || KAV || Report Competencies details display function
        @param request: Request Object
        @type request : Object
        @return: HttpResponse of select
        @author: KAV
    '''
    username = str(request.user.username)
    json_data = {}
    if request.method == "POST":
        try:
            logger_obj.info("Reports data fetch by "+str(request.user.username))
            roles_val = request.POST.get("roles")
            competencies_val = request.POST.get("competencies")
            comp_org_id = request.POST.get("comp_org_id")
            comp_org_unit_id = request.POST.get("comp_org_unit_id")
            if roles_val == '': roles_val = 0
            if competencies_val == '': competencies_val = 0
            if comp_org_id == '': comp_org_id = 0
            if comp_org_unit_id == '' : comp_org_unit_id = 0
            cur = connection.cursor()
            query =  """select ric.refitem_category_name as comp_type, ri1.refitems_name as comp_summary, array_agg(rd.role_title) as role_title,org.name 
                        from reference_item_category ric, reference_items ri1, hcms_ti_role_details rd,organization_info org,
                        (select ri.refitems_category_id ,rs.skillset_competency_id_id,rs.skillset_role_id
                        from reference_items ri ,hcms_ti_role_skillset rs
                        where rs.skillset_competency_id_id = ri.id) a
                        where a.refitems_category_id = ric.id
                        and a.skillset_competency_id_id = ri1.id
                        and a.skillset_role_id = rd.id and org.id = rd.role_org_id """
            if roles_val != 0 and competencies_val != 0 and comp_org_unit_id != 0:
                query = query + "and rd.id = %s and ric.id = %s  and  %s = any(rd.role_org_unit) and org.id = %s and org.id = rd.role_org_id and rd.is_active = True  group by ric.refitem_category_name, ri1.refitems_name,org.name "
                cur.execute(query,(roles_val, competencies_val, comp_org_unit_id ,comp_org_id))
                json_data['reports_val'] = cur.fetchall()
            elif roles_val != 0 and competencies_val == 0 and comp_org_unit_id == 0:
                query = query + "and rd.id = %s and org.id = rd.role_org_id and rd.is_active = True  group by ric.refitem_category_name, ri1.refitems_name,org.name "
                cur.execute(query,(roles_val,))
                json_data['reports_val'] = cur.fetchall()
            elif roles_val == 0 and comp_org_unit_id != 0 and competencies_val == 0:
                query = query + "and %s = any(rd.role_org_unit) and org.id = %s and org.id = rd.role_org_id and rd.is_active = True  group by ric.refitem_category_name, ri1.refitems_name,org.name "
                cur.execute(query,(comp_org_unit_id,comp_org_id,))
                json_data['reports_val'] = cur.fetchall()
            elif roles_val == 0 and comp_org_unit_id == 0 and competencies_val != 0:
                query = query + "and ric.id = %s and org.id = rd.role_org_id and rd.is_active = True  group by ric.refitem_category_name, ri1.refitems_name,org.name "
                cur.execute(query,(competencies_val,))
                json_data['reports_val'] = cur.fetchall()
            elif roles_val != 0 and comp_org_unit_id != 0 and competencies_val == 0:
                query = query + "and rd.id = %s and %s = any(rd.role_org_unit) and org.id = %s and org.id = rd.role_org_id and rd.is_active = True  group by ric.refitem_category_name, ri1.refitems_name,org.name "
                cur.execute(query,(roles_val, comp_org_unit_id,comp_org_id,))
                json_data['reports_val'] = cur.fetchall()
            elif roles_val != 0 and comp_org_unit_id == 0 and competencies_val != 0:
                query = query + "and rd.id = %s and ric.id = %s  and org.id = rd.role_org_id and rd.is_active = True  group by ric.refitem_category_name, ri1.refitems_name,org.name "
                cur.execute(query,(roles_val, competencies_val,))
                json_data['reports_val'] = cur.fetchall()
            elif roles_val == 0 and comp_org_unit_id != 0 and competencies_val != 0:
                query = query + "and %s =any(rd.role_org_unit) and ric.id = %s and rd.role_org_id = %s and org.id = rd.role_org_id and rd.is_active = True  group by ric.refitem_category_name, ri1.refitems_name,org.name "
                cur.execute(query,(comp_org_unit_id, competencies_val,comp_org_id,))
                json_data['reports_val'] = cur.fetchall()
            else:
                json_data['reports_val'] = ""
        except Exception as e:
            json_data["reports_val"] = status_keys.FAILURE_STATUS
            logger_obj.error("Reports data fetch - error message is "+ str(e) + " and attempted by "+username)
    return HttpResponse(json.dumps(json_data))

@csrf_exempt
def ti_role_type_fetch(request):
    '''
        09-Mar-2018 || MST || Role Details with Title display function
        @param request: Request Object
        @type request : Object
        @return: HttpResponse of select
        @author: MST
    '''
    json_data = {}
    cur = connection.cursor()
    try:
        word = request.POST.get("search_word")
        logger_obj.info("TI Role type data fetch by "+str(request.user.username))
        queries = query.fetch_hcms_query(config.talent_inventory, config.ti_role_type_fetch)
        queries = queries+"  and rd_ri.role_title ilike '"'%'+str(word)+'%'"' "
        cur.execute(queries)
        role_type = query.dictfetchall(cur)
        if len(role_type) > 0:
            json_data["role_type"] = role_type
        else:
            json_data["role_type"] = []
        json_data["status"] = status_keys.SUCCESS_STATUS
    except Exception as e:
        json_data["status"] = status_keys.FAILURE_STATUS
        logger_obj.error("TI Role type data error is "+ str(e) +" and status is "+ str(json_data['status']) +" attempted by "+str(request.user.username))
    logger_obj.info("TI Role type data fetched response is "+ str(json_data) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data))

@csrf_exempt
def ti_role_title_check(request):
    '''
        13-Mar-2018 || MST || Role Title Already Exists Check function
        @param request: Request Object
        @type request : Object
        @return: HttpResponse of select
        @author: MST
    '''
    json_data = {}
    cur = connection.cursor()
    try:
        role_title_val = request.POST.get("role_title_val")
        cur.execute(query.fetch_hcms_query(config.talent_inventory, config.ti_role_title_check),(role_title_val,))
        role_title = query.dictfetchall(cur)
        if len(role_title) > 0:
            json_data["role_title_exist"] = role_title
        else:
            json_data["role_title_exist"] = []
    except Exception as e:
        json_data["status"] = status_keys.FAILURE_STATUS
    return HttpResponse(json.dumps(json_data))

@csrf_exempt
def ti_reports_map(request):
    '''
        26-Mar-2018 || MST || GIS Reports Map
        @param request: Request Object
        @type request : Object
        @return: HttpResponse of select
        @author: MST
    '''
    json_data = {}
    cur = connection.cursor()
    try:
        org_id = request.POST.get("org_id")
        org_unit_id = request.POST.get("org_unit_id")
        cur.execute(query.fetch_hcms_query(config.talent_inventory, config.ti_gis_reports),(org_id,org_unit_id,org_id,org_unit_id,))
        role_title = query.dictfetchall(cur)
        cur.execute(query.fetch_hcms_query(config.talent_inventory, config.ti_gis_reports_role_title),(org_id,org_unit_id,))
        role_dets = query.dictfetchall(cur)
        gen_dets = refitem_fetch("GENTY")
        final_list = []; 
        for vals in role_title:
            role_titles = [{str(v).strip(): 0} for title in role_dets for k,v in title.items()]
            gen_titles = [{str(v).strip(): 0} for title in gen_dets for k,v in title.items() if k == 'refitems_name']
            new_dict = {}
            role_key_list = []; role_value_list = [];
            gen_key_list = []; gen_value_list = [];
            lat_key_list = []; lat_val_list = [];
            final_role = []; final_gen_list = []
            for k,v in vals.items():
                if k == 'role_title' or k == 'role_count':
                    role_key_list.append(k)
                    role_value_list.append(v)
                if k == 'gen_xyz' or k == 'gen_count':
                    gen_key_list.append(k)
                    gen_value_list.append(v)
            final_role = [{str(i).strip(): int(j)} for i,j in zip(role_value_list[0],role_value_list[1])]
            final_gen_list = [{str(i).strip():int(j)} for i,j in zip(gen_value_list[0],gen_value_list[1])]
            new_role = role_titles
            [role_items.__setitem__(k,v) for items in final_role for k,v in items.items() for role_items in new_role for j,o in role_items.items() if k == j]
            new_role = [reduce(lambda r, d: r.update(d) or r, new_role, {})]
            new_gen = gen_titles
            [gen_items.__setitem__(k,v) for items in final_gen_list for k,v in items.items() for gen_items in new_gen for j,o in gen_items.items() if k == j]
            new_gen = [reduce(lambda r, d: r.update(d) or r, new_gen, {})]
            new_dict[str('coordinate')] = [{str('latitude'): vals['latitude'], str('longitude'): vals['longitude']}]
            new_dict[str('id')] = vals['id']
            new_dict[str('orgunit_name')] = vals['orgunit_name']
            new_dict[str('information')] = [{str('Generation'): new_gen , str('Role'): new_role}]
            final_list.append(new_dict)
            new_gen = []; new_role = []
        json_data["data"] = final_list
    except Exception as e:
        json_data["status"] = status_keys.FAILURE_STATUS
    return HttpResponse(json.dumps(json_data))

@csrf_exempt
def ti_org_unit(request):
    '''
        28-Aug-2018 || MST || To fetch the Org. Unit list
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
            cur.execute(query.fetch_hcms_query(config.talent_inventory, config.ti_fetch_org_unit_list),(int(org_id),))
            json_data['sel_org_unit'] = query.dictfetchall(cur)
        except Exception as e:
            json_data["status"] = status_keys.FAILURE_STATUS
            logger_obj.error("Fetching Org. Unit list error is "+ str(e) +" and status is "+ str(json_data['status']) +" attempted by "+str(request.user.username))
        logger_obj.info("Fetching Org. Unit list response is "+ str(json_data) +" attempted by "+str(request.user.username))
        return HttpResponse(json.dumps(json_data))

@csrf_exempt
def ti_dept(request):
    '''
        06-Sep-2018 || MST || To fetch the Departement list
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
            logger_obj.info("Fetching Dept. list initiated by "+str(request.user.username))
            org_unit_ids = request.POST.get("org_unit_ids")
            org_unit_ids = map(int, json.loads(org_unit_ids))
            cur.execute(query.fetch_hcms_query(config.talent_inventory, config.ti_fetch_dept_list),(tuple(org_unit_ids),))
            json_data['sel_dept'] = query.dictfetchall(cur)
    except Exception as e:
        json_data["status"] = status_keys.FAILURE_STATUS
        logger_obj.error("Fetching Dept. list error is "+ str(e) +" and status is "+ str(json_data['status']) +" attempted by "+str(request.user.username))
    logger_obj.info("Fetching Dept. list response is "+ str(json_data) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data))
