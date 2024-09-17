# -*- coding: utf-8 -*-
from __future__ import unicode_literals

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
from django.http.response import HttpResponse
from django.template.context_processors import request
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic.base import TemplateView

from CSD.JenkinsAPI import jenkins_fetch
from CommonLib import query
from CommonLib.common_controller import dictfetchall
from CommonLib.hcms_common import record_validation 
import HCMS.settings as status_keys
from Talent_Assessment.talent_assessment.models import HCMS_TA_Linked_Objectives, HCMS_TA_Strategic_Objectives, HCMS_TA_KPI, HCMS_TA_Objective_OrgUnit_Rel
import config


# import logging
logger_obj = logging.getLogger('logit')


# import config
# from UAM.uam_session_sync import uam_sessions_sync
# from UAM.uam_func_data_sync import uam_func_sync
# from tracking.models import Visitor


class HCMStaObjectiveView(TemplateView):  #Added- Bavya-07Feb2018
    ''' 
    07-Feb-2018 || BAV || To Load the Strategic Objective page 
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    template_name = "talent_assessment/ta_objective_setting.html"
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HCMStaObjectiveView, self).dispatch(request, *args, **kwargs)
        
    def get(self, request, *args, **kwargs):
        cur=connection.cursor() 
        cur.execute(query.fetch_hcms_query(config.talent_assessment,config.objective_drop_down1))
        result_value = dictfetchall(cur)
        cur.execute(query.fetch_hcms_query(config.talent_assessment,config.objective_drop_down2))
        objective_driver = dictfetchall(cur)
        cur.execute(query.fetch_hcms_query(config.talent_assessment,config.refitems_data_objtyp))
        objective_result = dictfetchall(cur)
        cur.execute(query.fetch_hcms_query(config.talent_assessment,config.refitems_data_assign))
        assign_result = dictfetchall(cur)
        cur.execute(query.fetch_hcms_query(config.talent_assessment,config.refitems_data_cury))
        currency_result = dictfetchall(cur)
        context = super(HCMStaObjectiveView, self).get_context_data(**kwargs)
        context['objective'] = result_value
        context['objective_result'] = objective_result
        context['assign_result'] = assign_result
        context['currency_result'] = currency_result
        context['objective_driver'] = objective_driver
        return self.render_to_response(context)

# KPI drop down value
def drop_down_value(request):
    ''' 
    12-Feb-2018 || BAV || To load the KPI data Drop down Function 
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse to return the success or error message
    '''  
    try:
        logger_obj.info("KPI Drop down Value "+str(request.user.username))
        json_datas = {}
        cur=connection.cursor() 
        cur.execute(query.fetch_hcms_query(config.talent_assessment,config.custom_rating))
        scheme_data = dictfetchall(cur)
        json_datas['scheme_data']=scheme_data
        cur.execute(query.fetch_hcms_query(config.talent_assessment,config.refitems_data_tark))
        reference_items_role = dictfetchall(cur)
        json_datas['reference_items_role'] = reference_items_role
        cur.execute(query.fetch_hcms_query(config.talent_assessment,config.refitems_data_track))
        reference_items_shc = dictfetchall(cur)
        json_datas[config.status] = reference_items_shc
        logger_obj.info("KPI Drop down data "+ str(json_datas) +" attempted by "+str(request.user.username))
    except Exception as e:
        json_datas[config.status] = e
        logger_obj.info("KPI html data load "+ str(e) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_datas))
    
# Linked objective create function
def linked_obj_create(request):
    ''' 
    08-Feb-2018 || BAV || To Add the linked objective data function 
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse to return the success or error message
    '''
    try:
        json_datas = {}
        linked_objective = request.GET.get('linked_objective')
        linked_data = json.loads(linked_objective)
        strategic_objective = request.GET.get('strategic_objective')
        strategic_data = json.loads(strategic_objective)
        created_by = request.user.id
        if linked_objective:
            for i in linked_data:
                HCMS_TA_Linked_Objectives.objects.create(is_active=True,created_by_id=created_by,modified_by_id=created_by,strategic_objective_parent_id =int(strategic_data),strategic_objective_child_id=int(i))
                json_datas[config.status] = status_keys.SUCCESS_STATUS
                logger_obj.info("Objective Data Link "+ str(json_datas) +" attempted by "+str(request.user.username))
        else:
            json_datas[config.status] = status_keys.ERR0012
            logger_obj.info("Objective Data Link "+ str(json_datas) +" attempted by "+str(request.user.username))
    except Exception as e:
        json_datas[config.status] = e
        logger_obj.info("Objective Data Link"+ str(e) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_datas))

# Linked Objective update function
def linked_obj_update(request): 
    ''' 
    09-Feb-2018 || BAV || To Update the linked objective data function 
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse to return the success or error message
    '''    
    try:
        json_datas = {}
        strategic_objectives = request.GET.get('strategic_objectives')
        if strategic_objectives:
            cur=connection.cursor()
            cur.execute(query.fetch_hcms_query(config.talent_assessment,config.linked_obj_update1),(strategic_objectives,)) 
            linked_obj_result = dictfetchall(cur)
            json_datas['linked_obj_result'] = linked_obj_result
            cur.execute(query.fetch_hcms_query(config.talent_assessment,config.linked_obj_update2),(strategic_objectives,))
            result_value = dictfetchall(cur)
            json_datas['result_value'] = result_value
            cur.execute("""select id,strategic_objective_description from HCMS_TA_Strategic_Objectives where id = %s""",(strategic_objectives,))
            json_datas['current_data'] = dictfetchall(cur)
            json_datas[config.status] = status_keys.UPDATE_STATUS
            logger_obj.info("Objective Data Link Update"+ str(json_datas) +" attempted by "+str(request.user.username))
    except Exception as e:
        json_datas[config.status] = e
        logger_obj.info("Objective Data Link Update"+ str(e) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_datas))

# Linked Objective update id
def linked_obj_update_id(request):
    ''' 
    09-Feb-2018 || BAV || To Load the linked objective data function Onchange 
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse to return the success or error message
    '''  
    try:
        json_datas ={}
        strategic_objectives = request.GET.get('strategic_objectives')
        linked_objective = request.GET.get('linked_objective')
        linked_objective_data = json.loads(linked_objective)
        cur=connection.cursor()
        cur.execute(query.fetch_hcms_query(config.talent_assessment,config.linked_obj_update_id),(strategic_objectives,))
        if linked_objective_data !=None:
            for i in linked_objective_data:
                HCMS_TA_Linked_Objectives.objects.create(is_active=True,strategic_objective_parent_id =strategic_objectives,strategic_objective_child_id=int(i))
            json_datas[config.status] = status_keys.UPDATE_STATUS
            logger_obj.info("Objective Data Onchange"+ str(json_datas) +" attempted by "+str(request.user.username))
    except Exception as e:
        json_datas[config.status] = e
        logger_obj.info("Objective Data Onchange"+ str(e) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_datas))

# Linked Objective Delete Function
def linked_obj_delete(request):
    ''' 
    08-Feb-2018 || BAV || To Delete Linked Data  
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse to return the success or error message
    '''  
    try:
        json_datas ={}
        cur=connection.cursor()
        strategic_objectives = request.GET.get('strategic_objectives')
        if strategic_objectives:
            cur.execute(query.fetch_hcms_query(config.talent_assessment,config.linked_obj_delete),(strategic_objectives,))
            json_datas[config.status] = status_keys.REMOVE_STATUS
            logger_obj.info("Objective Data Delete"+ str(json_datas) +" attempted by "+str(request.user.username))
        else:
             json_datas[config.status] = status_keys.ERR0012
             logger_obj.info("Objective Data Delete"+ str(json_datas) +" attempted by "+str(request.user.username))
    except Exception as e:
        json_datas[config.status] = e
        logger_obj.info("Objective Data Delete"+ str(e) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_datas)) 

# Objective Data Load
def strategic_obj_data(request):
    ''' 
    09-Feb-2018 || BAV || To Load Strategic Data Table function 
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse to return the success or error message
    ''' 
    try:
        json_datas = {}
        cur=connection.cursor()
        cur.execute(query.fetch_hcms_query(config.talent_assessment,config.strategic_obj_data))
        objective_data = dictfetchall(cur)
        json_datas[config.status] =  objective_data
        logger_obj.info("Objective Data"+ str(json_datas) +" attempted by "+str(request.user.username))
    except Exception as e:
        json_datas[config.status] = e
        logger_obj.info("Objective Data "+ str(e) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_datas))
#     return HttpResponse(json.dumps(json_datas, cls=DjangoJSONEncoder), content_type="application/json")

# Objective Create Function
def str_obj_create(request):
    ''' 
        09-Feb-2018 || BAV || To Add the Strategic Objective Data Function 
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse to return the success or error message
    '''
    try:
        json_datas = {}
        strategic_objectives_data = request.POST.get('data')
        data = json.loads(strategic_objectives_data)
        end_date = datetime.datetime.strptime(data['datas']['end_date'], '%d-%m-%Y').strftime('%Y-%m-%d')
        start_date  =datetime.datetime.strptime(data['datas']['start_date'], '%d-%m-%Y').strftime('%Y-%m-%d')
        created_by = request.user.id
        cur=connection.cursor()
        cur.execute(query.fetch_hcms_query(config.talent_assessment,config.obj_update_str_comparition),(data['datas']['strategic_objective'],start_date,end_date))
        strategic_value = dictfetchall(cur)
        if not strategic_value:
                if data['kpi'][0]:
                    if start_date < end_date:
                        today = datetime.date.today()
                        effective_end_date = datetime.datetime.strptime(end_date, '%Y-%m-%d').date()
                        if effective_end_date >= today:
                            if data['datas']['objective_driver_drop'] != '0':
                                with transaction.atomic():
                                    cur.execute(query.fetch_hcms_query(config.talent_assessment,config.obj_update_str_except_str),(data['datas']['objective_driver_drop'],))
                                    result_data = dictfetchall(cur)
                                    if result_data:
                                        objective_result_id = HCMS_TA_Strategic_Objectives.objects.create(is_active=True,created_by_id=created_by,modified_by_id=created_by,strategic_objective_driver =result_data[0]['strategic_objective_driver'],strategic_objective_description=data['datas']['strategic_objective'],
                                            strategic_objective_action_to_achieve=data['datas']['action_to_achieve'],strategic_objective_start_date= start_date,strategic_objective_end_date=end_date,strategic_bsc_perspective_type_refitem_id=data['datas']['objective_type'],
                                            strategic_objective_expected_outcome=data['datas']['expected_outcome'],strategic_objective_budget=data['datas']['set_budget'],strategic_objective_budget_currency_type_ref_id= data['datas']['currency_type'],
                                            strategic_objective_driver_exist_id =data['datas']['objective_driver_drop'])
                                        objective_result_id.save()
                                        if objective_result_id.id:
                                            new_kpi_list=[]
                                            for i in data['kpi']:
                                                kpi_result = HCMS_TA_KPI.objects.create(is_active=True,created_by_id=created_by,modified_by_id=created_by,hcms_tm_strategic_objectives_id=objective_result_id.id,kpi_description=i['summary'],kpi_target_value=float(i['target']),
                                                                        kpi_tracking_type_id=i['tracking_type'],kpi_target_type=i['target_type'],kpi_custom_rating_scheme_id=i['rating_schema'])
                                                kpi_result.save()
                                                returning_id=kpi_result.id
                                                new_kpi_list.append(returning_id)
                                        if data['role']:
                                            for j in data['role']:
                                                cur.execute(query.fetch_hcms_query(config.talent_assessment,config.obj_kpi_add),
                                                                (j['org_id'],objective_result_id.id,j['role_id'],True))
                                            json_datas[config.status] = status_keys.SUCCESS_STATUS
                                            json_datas['id'] = objective_result_id.id
                                            logger_obj.info("Strategic Objective Data Create"+ str(json_datas) +" attempted by "+str(request.user.username))
                                            json_datas['kpi_id']=new_kpi_list
                                    else:
                                            json_datas[config.status] = status_keys.ERR0012
                                            logger_obj.info("Strategic Objective Data Create"+ str(json_datas) +" attempted by "+str(request.user.username))
                            else:
                                with transaction.atomic():
                                    objective_result_id = HCMS_TA_Strategic_Objectives.objects.create(is_active=True,created_by_id=created_by,modified_by_id=created_by,strategic_objective_driver =data['datas']['objective_driver'],strategic_objective_description=data['datas']['strategic_objective'],
                                        strategic_objective_action_to_achieve=data['datas']['action_to_achieve'],strategic_objective_start_date= start_date,strategic_objective_end_date=end_date,strategic_bsc_perspective_type_refitem_id=data['datas']['objective_type'],
                                        strategic_objective_expected_outcome=data['datas']['expected_outcome'],strategic_objective_budget=data['datas']['set_budget'],strategic_objective_budget_currency_type_ref_id= data['datas']['currency_type'])
                                    objective_result_id.save()
                                    if objective_result_id.id:
                                        new_kpi_list=[]
                                        for i in data['kpi']:
                                            kpi_result = HCMS_TA_KPI.objects.create(is_active=True,created_by_id=created_by,modified_by_id=created_by,hcms_tm_strategic_objectives_id=objective_result_id.id,kpi_description=i['summary'],kpi_target_value=float(i['target']),
                                                            kpi_tracking_type_id=i['tracking_type'],kpi_target_type=i['target_type'],kpi_custom_rating_scheme_id=i['rating_schema'])
                                            kpi_result.save()
                                            returning_id=kpi_result.id
                                            new_kpi_list.append(returning_id)
                                    if data['role']:
                                        for j in data['role']:
                                            cur.execute(query.fetch_hcms_query(config.talent_assessment,config.obj_kpi_add),
                                                                (j['org_id'],objective_result_id.id,j['role_id'],True))
                                        json_datas[config.status] = status_keys.SUCCESS_STATUS
                                        json_datas['id'] = objective_result_id.id
                                        logger_obj.info("Strategic Objective Data Create"+ str(json_datas) +" attempted by "+str(request.user.username))
                                        json_datas['kpi_id']=new_kpi_list
                                    else:
                                        json_datas[config.status] = status_keys.ERR0012
                                        logger_obj.info("Strategic Objective Data Create"+ str(json_datas) +" attempted by "+str(request.user.username))
                        else:
                            json_datas[config.status] = config.add
                    else:
                        json_datas[config.status] = config.start_date_should_greater_than_end_date_format
                else:
                    json_datas[config.status] = config.fill_the_all_kpi_value
        else:
            json_datas[config.status] = config.objective_already_exist
    except Exception as e:
        json_datas[config.status] = e
        logger_obj.info("Strategic Objective Data Create"+ str(e) +" attempted by "+str(request.user.username))
#     return HttpResponse(json.dumps(json_datas))
    return HttpResponse(json.dumps(json_datas,cls=DjangoJSONEncoder), content_type=config.content_type_value)

# Objective Row click function
def obj_row_click(request):
    ''' 
    09-Feb-2018 || BAV || Row Click Data For Strategic and KPI Function
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse to return Row clicked data
    '''
    try:
        json_datas = {}
        row_id = request.GET.get('id')
        cur=connection.cursor() 
        cur.execute(query.fetch_hcms_query(config.talent_assessment,config.obj_row_click_objective),(row_id,))
        result = dictfetchall(cur)
        json_datas['data'] = result
        cur.execute(query.fetch_hcms_query(config.talent_assessment,config.obj_row_click_kpi),(row_id,))
        kpi_result = dictfetchall(cur)
        json_datas['kpi_data'] = kpi_result
        cur.execute(query.fetch_hcms_query(config.talent_assessment,config.obj_row_click_rel),(row_id,))
        org_unit_result = dictfetchall(cur)
        json_datas['org_unit_result'] = org_unit_result
        
        logger_obj.info("Strategic Objective Row Data"+ str(json_datas) +" attempted by "+str(request.user.username))
    except Exception as e:
        json_datas[config.status] = e
        logger_obj.info("Strategic Objective Row Data"+ str(e) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_datas)) 

# Objective Update Function
def str_obj_update(request):
    ''' 
    09-Feb-2018 || BAV || Update the Selective Data for Objective and KPI 
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse to return the success or error message
    '''
    try:
        json_datas = {}
        cur=connection.cursor()
        created_by = request.user.id
        strategic_objectives_data = request.POST.get('data')
        data = json.loads(strategic_objectives_data)
        end_date = datetime.datetime.strptime(data['datas']['end_date'], '%d-%m-%Y').strftime('%Y-%m-%d')
        start_date  =datetime.datetime.strptime(data['datas']['start_date'], '%d-%m-%Y').strftime('%Y-%m-%d')
        cur=connection.cursor()
        cur.execute(query.fetch_hcms_query(config.talent_assessment,config.obj_update_str_comparition_except),(data['datas']['strategic_objective'],data['datas']['id'],start_date,end_date,))
        strategic_value = dictfetchall(cur)
        if not strategic_value:
            if data['kpi'][0]:
                    if start_date < end_date:
                        today = datetime.date.today()
                        effective_end_date = datetime.datetime.strptime(end_date, '%Y-%m-%d').date()
                        if effective_end_date >= today:
                            if data['datas']['objective_driver_drop'] != '0':
                                cur.execute(query.fetch_hcms_query(config.talent_assessment,config.str_obj_update_obj_id),(data['datas']['objective_driver_drop'],))
                                result_data = dictfetchall(cur)
                                if result_data:
                                    ta = HCMS_TA_Strategic_Objectives.objects.get(id=data['datas']['id'])
                                    if ta:
                                        ta.is_active=True
                                        ta.strategic_objective_driver =result_data[0]['strategic_objective_driver']
                                        ta.strategic_objective_description=data['datas']['strategic_objective']
                                        ta.strategic_objective_action_to_achieve=data['datas']['action_to_achieve']
                                        ta.strategic_objective_start_date= start_date
                                        ta.strategic_objective_end_date=end_date
                                        ta.strategic_bsc_perspective_type_refitem_id=data['datas']['objective_type']
                                        ta.strategic_objective_expected_outcome=data['datas']['expected_outcome']
                                        ta.strategic_objective_budget=data['datas']['set_budget']
                                        ta.strategic_objective_budget_currency_type_ref_id= data['datas']['currency_type']
                                        ta.strategic_objective_driver_exist_id= data['datas']['objective_driver_drop']
                                        ta.save()
                                        if data['role']:
                                            cur.execute("""delete from hcms_ta_objective_orgunit_rel where strategic_objective_id=%s""",(data['datas']['id'],))
                                            for j in data['role']:
                                                if j['id'] in 'undefined' or j['id'] in '':
                                                    cur.execute(query.fetch_hcms_query(config.talent_assessment,config.obj_kpi_add),(j['org_id'],ta.id,j['role_id'],True))
                                                else:
                                                    cur.execute(query.fetch_hcms_query(config.talent_assessment,config.obj_update_assign_exist_old),(j['org_id'],ta.id,j['role_id'],j['id']))
                                        for i in data['kpi']:
                                            if i['id'] !='':
                                                kpi_data = HCMS_TA_KPI.objects.get(id=i['id'])
                                                if kpi_data:
                                                    kpi_data.kpi_description =i['summary']
                                                    kpi_data.kpi_target_value =float(i['target'])
                                                    kpi_data.kpi_tracking_type_id =i['tracking_type']
                                                    kpi_data.kpi_target_type =i['target_type']
                                                    kpi_data.kpi_custom_rating_scheme_id =i['rating_schema']
                                                    kpi_data.save()
                                                    json_datas[config.status] = status_keys.UPDATE_STATUS
                                                    json_datas['id'] = data['datas']['id']
                                                    logger_obj.info("Strategic Objective Data Update"+ str(json_datas) +" attempted by "+str(request.user.username))
                                            else:
                                                kpi_result = HCMS_TA_KPI.objects.create(is_active=True,created_by_id=created_by,modified_by_id=created_by,hcms_tm_strategic_objectives_id=ta.id,kpi_description=i['summary'],kpi_target_value=i['target'],
                                                                    kpi_tracking_type_id=i['tracking_type'],kpi_target_type=i['target_type'],kpi_custom_rating_scheme_id=i['rating_schema'])
                                                kpi_result.save()
                                                json_datas[config.status] = status_keys.UPDATE_STATUS
                                                json_datas['id'] = data['datas']['id']
                                                logger_obj.info("Strategic Objective Data Update"+ str(json_datas) +" attempted by "+str(request.user.username))
                                    else:
                                        json_datas[config.status] = status_keys.ERR0012
                                        logger_obj.info("Strategic Objective Data Update"+ str(json_datas) +" attempted by "+str(request.user.username))
                            else:
                                ta = HCMS_TA_Strategic_Objectives.objects.get(id=data['datas']['id'])
                                if ta:
                                    ta.is_active=True
                                    ta.strategic_objective_driver =data['datas']['objective_driver']
                                    ta.strategic_objective_description=data['datas']['strategic_objective']
                                    ta.strategic_objective_action_to_achieve=data['datas']['action_to_achieve']
                                    ta.strategic_objective_start_date= start_date
                                    ta.strategic_objective_end_date=end_date
                                    ta.strategic_bsc_perspective_type_refitem_id=data['datas']['objective_type']
                                    ta.strategic_objective_expected_outcome=data['datas']['expected_outcome']
                                    ta.strategic_objective_budget=data['datas']['set_budget']
                                    ta.strategic_objective_budget_currency_type_ref_id= data['datas']['currency_type']
                                    ta.save()
                                    if data['role']:
                                        cur.execute("""delete from hcms_ta_objective_orgunit_rel where strategic_objective_id=%s""",(data['datas']['id'],))
                                        for j in data['role']:
                                            if j['id'] in 'undefined' or j['id'] in '':
                                                cur.execute(query.fetch_hcms_query(config.talent_assessment,config.obj_kpi_add),(j['org_id'],ta.id,j['role_id'],True))
                                            else:
                                                cur.execute(query.fetch_hcms_query(config.talent_assessment,config.obj_update_assign_exist_old),(j['org_id'],ta.id,j['role_id'],j['id']))
                                    for i in data['kpi']:
                                        if i['id'] !='':
                                            kpi_data = HCMS_TA_KPI.objects.get(id=i['id'])
                                            if kpi_data:
                                                kpi_data.kpi_description =i['summary']
                                                kpi_data.kpi_target_value =float(i['target'])
                                                kpi_data.kpi_tracking_type_id =i['tracking_type']
                                                kpi_data.kpi_target_type =i['target_type']
                                                kpi_data.kpi_custom_rating_scheme_id =i['rating_schema']
                                                kpi_data.save()
                                                json_datas[config.status] = status_keys.UPDATE_STATUS
                                                json_datas['id'] = data['datas']['id']
                                                logger_obj.info("Strategic Objective Data Update"+ str(json_datas) +" attempted by "+str(request.user.username))
                                        else:
                                            kpi_result = HCMS_TA_KPI.objects.create(is_active=True,created_by_id=created_by,modified_by_id=created_by,hcms_tm_strategic_objectives_id=ta.id,kpi_description=i['summary'],kpi_target_value=i['target'],
                                                                kpi_tracking_type_id=i['tracking_type'],kpi_target_type=i['target_type'],kpi_custom_rating_scheme_id=i['rating_schema'])
                                            kpi_result.save()
                                            json_datas[config.status] = status_keys.UPDATE_STATUS
                                            json_datas['id'] = data['datas']['id']
                                            logger_obj.info("Strategic Objective Data Update"+ str(json_datas) +" attempted by "+str(request.user.username))
                                else:
                                    json_datas[config.status] = status_keys.ERR0012
                                    logger_obj.info("Strategic Objective Data Update"+ str(json_datas) +" attempted by "+str(request.user.username))
                        else:
                            json_datas[config.status] = config.update
                    else:
                        json_datas[config.status] = config.start_date_should_greater_than_end_date_format
            else:
                json_datas[config.status] = config.fill_the_all_kpi_value
        else:
            json_datas[config.status] = config.objective_already_exist
    except Exception as e:
        json_datas[config.status] = e
        logger_obj.info("Strategic Objective Data Update"+ str(e) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_datas))
    
# Objective Delete Function    
def objective_delete(request):
    ''' 
    09-Feb-2018 || BAV || Soft Delete for Strategic Objective and Kpi function
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse to return the success or error message
    '''
    try:
        json_datas = {}
        cur=connection.cursor()
        table_id = request.GET.get('id')
        end_date_date = request.GET.get('end_date')
        if end_date_date:
            end_date = datetime.datetime.strptime(end_date_date, '%d-%m-%Y').strftime('%Y-%m-%d')
            effective_end_date = datetime.datetime.strptime(end_date, '%Y-%m-%d').date()
        else:
            cur.execute(query.fetch_hcms_query(config.talent_assessment,config.objective_delete_data),(table_id,))
            result = dictfetchall(cur)
            effective_end_date = datetime.datetime.strptime(result[0]['end_date'], '%Y-%m-%d').date()
        today = datetime.date.today()
        if table_id:
            if effective_end_date >= today:
                with transaction.atomic():
                    cur.execute(query.fetch_hcms_query(config.talent_assessment,config.objective_delete),(table_id,))
                    kpi_result_data = dictfetchall(cur)
                    if kpi_result_data:
                        for i in kpi_result_data:
                            kpi_delete = HCMS_TA_KPI.objects.get(id=i['id'])
                            kpi_delete.is_active=False
                            kpi_delete.save()
                            cur.execute(query.fetch_hcms_query(config.talent_assessment,config.obj_update_assign_delete),(table_id,))
                        ta = HCMS_TA_Strategic_Objectives.objects.get(id=table_id)
                        if ta:
                            referred_record = record_validation('hcms_ta_strategic_objectives',table_id)
                            if  referred_record==True:
                                ta.is_active=False
                                ta.save()
                                json_datas[config.status] = status_keys.REMOVE_STATUS
                                logger_obj.info("Strategic Objective Data Delete"+ str(json_datas) +" attempted by "+str(request.user.username))
                            else:
#                                 pass
                                json_datas[config.status] = status_keys.ERR0028
#                                 transaction.commit()
                                transaction.rollback()
            else:
                json_datas[config.status] = config.remove              
        else:
            json_datas[config.status] = status_keys.ERR0012
            logger_obj.info("Strategic Objective Data Delete"+ str(json_datas) +" attempted by "+str(request.user.username))
    except Exception as e:
        json_datas[config.status] = e
        logger_obj.info("Strategic Objective Data Delete"+ str(e) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_datas))

# KPI Data remove Function
def remove_kpi_data(request):
    ''' 
    12-Feb-2018 || BAV || Soft Delete for  Kpi function
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse to return the success or error message
    '''
    try:
        json_datas = {}
        cur=connection.cursor()
        table_id = request.POST.get('kpi_delete_id')
        row_id = request.POST.get('table_id')
        if table_id:
            cur.execute("""delete from  hcms_ta_kpi where id=%s""",(table_id,))
            cur.execute(query.fetch_hcms_query(config.talent_assessment,config.obj_row_click_kpi),(row_id,))
            kpi_result = dictfetchall(cur)
            json_datas['datas'] = kpi_result 
            json_datas[config.status] = status_keys.REMOVE_STATUS
            logger_obj.info("KPI Data Delete"+ str(json_datas) +" attempted by "+str(request.user.username))
        else:
            json_datas[config.status] = status_keys.ERR0012
            logger_obj.info("KPI Data Delete"+ str(json_datas) +" attempted by "+str(request.user.username))
    except Exception as e:
        json_datas[config.status] = e
        logger_obj.info("KPI Data Delete"+ str(e) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_datas))

#  Cascading Objective View
class HCMStaCascadeObjectiveView(TemplateView):  #Added- Bavya-14Feb2018
    ''' 
    14-Feb-2018 || BAV || To Load the Strategic Objective page 
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    template_name = "talent_assessment/ta_cascading_objectives.html"
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HCMStaCascadeObjectiveView, self).dispatch(request, *args, **kwargs)
        
    def get(self, request, *args, **kwargs):
        cur=connection.cursor() 
        cur.execute(query.fetch_hcms_query(config.talent_assessment,config.cascading_date))
        result_value = dictfetchall(cur)
        cur.execute(query.fetch_hcms_query(config.talent_assessment,config.cascading_date_date))
        result_month = dictfetchall(cur)
        
        cur.execute(query.fetch_hcms_query(config.talent_assessment,config.objective_drop_down2))
        objective_driver = dictfetchall(cur)
        cur.execute(query.fetch_hcms_query(config.talent_assessment,config.refitems_data_objtyp))
        objective_result = dictfetchall(cur)
        cur.execute(query.fetch_hcms_query(config.talent_assessment,config.refitems_data_assign))
        assign_result = dictfetchall(cur)
        cur.execute(query.fetch_hcms_query(config.talent_assessment,config.refitems_data_cury))
        currency_result = dictfetchall(cur)
        context = super(HCMStaCascadeObjectiveView, self).get_context_data(**kwargs)
        context['objective'] = result_value
        context['result_month'] = result_month
        context['objective_result'] = objective_result
        context['assign_result'] = assign_result
        context['currency_result'] = currency_result
        context['objective_driver'] = objective_driver
        return self.render_to_response(context)

# cascade objective data Load
def cascade_objective_select(request):
    ''' 
    15-Feb-2018 || BAV || View Cascade Objective data
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse to return the success or error message
    '''
    try:
        json_datas = {}
        child_data_list = []
        parent_data_list = []
        cur=connection.cursor() 
        select_date = request.POST.get('select_date')
        cur.execute(query.fetch_hcms_query(config.talent_assessment,config.cascading_obj_select),(select_date,))
        result_date = dictfetchall(cur)
        cur.execute(query.fetch_hcms_query(config.talent_assessment,config.select_exits_id_date),(select_date,))
        test_result = dictfetchall(cur)
        if test_result:
            for i in test_result:
                child_data_list.append(i['strategic_objective_driver_exist_id'])
        if result_date:
            for j in result_date:
                parent_data_list.append(j['id'])
        no_parent =  set([c for c in child_data_list if c not in parent_data_list])
        for g in result_date:
            if g['strategic_objective_driver_exist_id'] in no_parent:
                g['strategic_objective_driver_exist_id'] = None 
        json_datas[config.status] = result_date
#         if result_date:
#             for i in result_date:
#                 child_data_list.append(i['id'])
#             cur.execute("""select id,strategic_objective_driver,strategic_objective_description,strategic_objective_driver_exist_id from HCMS_TA_Strategic_Objectives where is_active=True
#     and strategic_objective_driver_exist_id in %s""",(tuple(child_data_list),))
#             json_datas['child_data_result'] = dictfetchall(cur)
#         else:
#             json_datas['status'] = 'no child_data'
        logger_obj.info("Cascade Date Select"+ str(json_datas) +" attempted by "+str(request.user.username))
    except Exception as e:
        json_datas[config.status] = e
        logger_obj.info("Cascade Date Select"+ str(e) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_datas))

# Cascade data Load
def ta_cascading(request):
    ''' 
    15-Feb-2018 || BAV || Cascade Objective Function
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse to return the success or error message
    '''
    try:
        child_data_list = []
        parent_data_list = []
        json_datas = {}
        cur=connection.cursor() 
        cur.execute(query.fetch_hcms_query(config.talent_assessment,config.ta_cascading))
        strategic_objective = dictfetchall(cur)
        cur.execute(query.fetch_hcms_query(config.talent_assessment,config.select_exits_id))
        test_result = dictfetchall(cur)
        if test_result:
            for i in test_result:
                child_data_list.append(i['strategic_objective_driver_exist_id'])
        if strategic_objective:
            for j in strategic_objective:
                parent_data_list.append(j['id'])
        no_parent =  set([c for c in child_data_list if c not in parent_data_list])
        for g in strategic_objective:
            if g['strategic_objective_driver_exist_id'] in no_parent:
                g['strategic_objective_driver_exist_id'] = None 
        json_datas[config.status] = strategic_objective
        logger_obj.info("Cascade Date Change"+ str(json_datas) +" attempted by "+str(request.user.username))
    except Exception as e:
        json_datas[config.status] = e
        logger_obj.info("Cascade Date Change"+ str(e) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_datas))

def org_unit_role(request):
    ''' 
    16-Feb-2018 || BAV || Load the Selected Role
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse to return the success or error message
    '''
    try:   
        json_datas = {}
        role_list = []
        cur=connection.cursor() 
        role_unique_id = request.POST.get('role_unique_id')
        data = json.loads(role_unique_id)
        for i in data:
            cur.execute("""select orgunit_type_id as orgunit_type from organization_unit_info  where id =%s""",(i,))
            res_data = dictfetchall(cur)
            role_list.append(res_data[0]['orgunit_type'])
        data_value = tuple(role_list)
        cur.execute("""select re.id,re.role_title from hcms_ti_role_details re where re.role_org_unit_type_id in %s""",(data_value,))
        result_org = dictfetchall(cur)
        json_datas[config.status] =  result_org
        logger_obj.info("Objective Role Select"+ str(json_datas) +" attempted by "+str(request.user.username))
    except Exception as e:
        json_datas[config.status] = e
        logger_obj.info("Objective Role Select"+ str(e) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_datas))

#  Role Data Call function       
def role_data_list(request):
    ''' 
    06-Mar-2018 || BAV || Load the Selected Role Data
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse to return the success or error message
    '''
    try:
        json_datas = {}
        assign_list = []
        cur=connection.cursor() 
        role_list =request.POST.get('role_list')
        data = json.loads(role_list)
        if data:
            for i in data:
                cur.execute("""select orgunit_name,id from organization_unit_info where is_active=True and id=%s""",(i['org_data'],))
                org_data_list = dictfetchall(cur)
                cur.execute("""select role_title,id from hcms_ti_role_details where is_active=True and id=%s""",(i['role_data'],))
                role_data_list = dictfetchall(cur)
                if org_data_list[0]['id']:
                    assign_list.append({'org_id':org_data_list[0]['id'],'org_data':org_data_list[0]['orgunit_name'],'role_id':role_data_list[0]['id'],'role_data':role_data_list[0]['role_title']})
            json_datas[config.status] = assign_list
    except Exception as e:
        json_datas[config.status] = e
    return HttpResponse(json.dumps(json_datas))

def role_data_list_remove(request):
    ''' 
    06-Mar-2018 || BAV || Load the Selected Role Data
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse to return the success or error message
    '''
    try:
        json_datas = {}
        cur=connection.cursor() 
        table_id = json.loads(request.POST.get('hidden_table_id'))
        row_id = json.loads(request.POST.get('table_id'))
        cur.execute("""delete from hcms_ta_objective_orgunit_rel where id=%s""",(table_id,))
        cur.execute(query.fetch_hcms_query(config.talent_assessment,config.obj_row_click_rel),(row_id,))
        org_unit_result = dictfetchall(cur)
        json_datas['org_unit_result'] = org_unit_result
        json_datas[config.status] = status_keys.REMOVE_STATUS
    except Exception as e:
        json_datas[config.status] = e
    return HttpResponse(json.dumps(json_datas))

def role_comparition(request):
    ''' 
    07-Mar-2018 || BAV || Load the Selected Role Data Comparition
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse to return the success or error message
    '''
    
    seen = set()
    new_l = []
    try:
        json_datas = {}
        cur=connection.cursor()
        role_data = json.loads(request.POST.get('assign_role_list'))
        json_datas[config.status] = [dict(t) for t in set([tuple(d.items()) for d in role_data])]
    except Exception as e:
        json_datas[config.status] = e
    return HttpResponse(json.dumps(json_datas))
# Objective Create Function
def assessment_obj_create(request):
     ''' 
            09-Feb-2018 || BAV || To Add the Strategic Objective Data Function 
            @param request: Request Object
            @type request : Object
            @return:   HttpResponse to return the success or error message
    '''
     try:
        json_datas = {}
        strategic_objectives_data = request.POST.get('data')
        data = json.loads(strategic_objectives_data)
        created_by = request.user.id
        cur=connection.cursor()
        new_kpi_list=[]
        for i in data['kpi']:
            kpi_result = HCMS_TA_KPI.objects.create(is_active=True,created_by_id=created_by,modified_by_id=created_by,kpi_target_type=i['target_type'],kpi_description=i['summary'],kpi_target_value=float(i['target']),
                                                                        kpi_tracking_type_id=i['tracking_type'],kpi_custom_rating_scheme_id=i['rating_schema'])
            kpi_result.save()
            returning_id=kpi_result.id
            new_kpi_list.append(returning_id)
        json_datas['kpi_id']=new_kpi_list
        json_datas[config.status] = status_keys.SUCCESS_STATUS
     except Exception as e:
        json_datas[config.status] = e
        logger_obj.info("Strategic Objective Data Create"+ str(e) +" attempted by "+str(request.user.username))
     return HttpResponse(json.dumps(json_datas))
 

def load_date(request):
    ''' 
        27-Mar-2018 || BAV || To Load Date Function
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse to return date
    '''
    try:
        json_datas = {}
        cur=connection.cursor()
        cur.execute(query.fetch_hcms_query(config.talent_assessment,config.cascading_date_date))
        result_month = dictfetchall(cur)
        json_datas[config.status] = result_month 
        logger_obj.info("Strategic Objective Date Load"+ str(result_month) +" attempted by "+str(request.user.username))
    except Exception as e:
        json_datas[config.status] = e
        logger_obj.info("Strategic Objective Date Load"+ str(e) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_datas))

