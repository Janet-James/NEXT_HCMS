# -*- coding: utf-8 -*-
from __future__ import unicode_literals
 
import json
# from django.views.generic.base import TemplateView
# from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from django.http.response import HttpResponse
from CommonLib import query
from CommonLib import common_controller 
from django.db import connection
from CSD.JenkinsAPI import jenkins_fetch
 
from CommonLib.lib import *
# for decoder function
from django.core import serializers
from django.core.serializers.json import DjangoJSONEncoder
import HCMS.settings as status_keys

import logging
import logging.handlers
logger_obj = logging.getLogger('logit')
import config
# from CommonLib.hcms_common import record_validation 
# from UAM.uam_session_sync import uam_sessions_sync
# from UAM.uam_func_data_sync import uam_func_sync
# from tracking.models import Visitor

def shift_dropdown(request):
    ''' 
            31-MAY-2018 || ESA || To fetch the shift  details based on org unit
            @param request: Request Object
            @type request : Object
            @return:  return the shift details
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    try:
        if current_user_id:
            org_unit_id_list=request.GET.get('org_unit_id',False)
            if org_unit_id_list:
                org_unit_id = json.loads(org_unit_id_list)
                if len(org_unit_id) == 1:
                    condition = "= "+str(map(str,org_unit_id)[0])
                    
                elif len(org_unit_id) > 1:
                    condition = "in "+str(tuple(map(str,org_unit_id)))
                
                cur.execute(query.fetch_hcms_query(config.attendance,config.shift_details_based_org_unit).format(condition))
                shift_details = dictfetchall(cur)
                cur.execute(query.fetch_hcms_query(config.attendance,config.division_details_based_org_unit).format(condition))
                division_details = dictfetchall(cur)
                json_data['status']=status_keys.SUCCESS_STATUS
                json_data['shift_details'] = shift_details 
                json_data['division_details'] = division_details
            else:
                json_data['shift_details']=[]
                json_data['division_details'] = []
                json_data['status']=status_keys.FAILURE_STATUS
            logger_obj.info("Shift details based on org unit data  attempted by "+str(request.user.username)) 
        else :
            json_data['shift_details']=[]
            json_data['division_details'] = []
            json_data['status']=status_keys.FAILURE_STATUS
    except Exception as e:
        result = e
        logger_obj.info("function name:shift_drpdown, requested data: attempted by "+str(request.user.username)+ "status:failed"+str(result))
        json_data['shift_details']=[]
        json_data['division_details'] = []
        json_data['status']=status_keys.FAILURE_STATUS
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value) 

def late_policy_save(request):
    ''' 
            01-JUN-2018 || ESA || To save late policy data
            @param request: Request Object
            @type request : Object
            @return:  return the success message for save
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    try:
        if current_user_id:
            division_id_list = request.POST.get('division_id_list')
            shift_name=request.POST.get('shift_name')
            policy_period=request.POST.get('policy_period')
            effective_form=request.POST.get('effective_form')
            grace_time=request.POST.get('grace_time')
            data_division_id = request.POST.get('data_division_id')
            data_policy_id = request.POST.get('data_policy_id')
    #             total_late_comming=request.POST.get('total_late_comming')
    #             day_for_deduct=request.POST.get('day_for_deduct')
    #             early_deduct=request.POST.get('early_deduct')
    #             early_deduct_day=request.POST.get('early_deduct_day')  process_begin=request.POST.get('process_begin')
            early_period=request.POST.get('early_period')
            update_id=request.POST.get('clicked_row_id')
            if effective_form=='':
                effective_form=None
            if grace_time=='':
                grace_time=None
            if early_period=='':
                early_period=None
                
            if data_division_id and data_policy_id:
                    division_id_id = json.loads(data_division_id)
                    policy_id_id = json.loads(data_policy_id)
                    for p in policy_id_id:
                        cur.execute("""select count(id) from hcms_attendance_late_early_policy_div_rel hapdr where hapdr.late_early_policy_id = {0} 
                        and hapdr.is_active=true""".format(p))
                        policy_count_id = cur.fetchall()
                        if policy_count_id:
                            if policy_count_id[0][0] == len(division_id_id):
                                cur.execute("""update hcms_attendance_late_early_policy set is_active=false,modified_date=now(),modified_by_id={1} where id = {0}
                                """.format(p,current_user_id))
                            for i in division_id_id:
                                cur.execute("""update hcms_attendance_late_early_policy_div_rel set is_active=false,modified_date=now(),modified_by_id={2}
                                where late_early_policy_id = {0} and division_id = {1} 
                                """.format(p,i,current_user_id))
                            
            if update_id:
                if shift_name and  policy_period and grace_time and early_period and division_id_list:
                    division_id = json.loads(division_id_list)
                    cur.execute(query.fetch_hcms_query(config.attendance,config.late_policy_update),(str(current_user_id),grace_time,early_period
                                    ,effective_form,str(shift_name),str(policy_period),str(update_id),))
                    cur.execute(query.fetch_hcms_query(config.attendance,config.late_policy_division_rel_delete),(str(current_user_id),str(update_id),))
                    for i in division_id:
                        cur.execute(query.fetch_hcms_query(config.attendance,config.late_policy_division_rel_save).format(i,update_id,current_user_id))
                        
                    json_data['status']=status_keys.UPDATE_STATUS
                else:
                   json_data['status']=status_keys.FAILURE_STATUS 
                logger_obj.info("Late Policy Data Update status"+ str(json_data) +" attempted by "+str(request.user.username)) 
            else:
                if shift_name and  policy_period and grace_time and early_period and division_id_list:
                    division_id = json.loads(division_id_list)
                    cur.execute(query.fetch_hcms_query(config.attendance,config.late_policy_save),(str(current_user_id),grace_time,early_period,
                                    effective_form,str(shift_name),str(policy_period),'TRUE',))
                    res = dictfetchall(cur)
                    inserted_id=res[0]['id']
                    if inserted_id:
                        for i in division_id:
                            cur.execute(query.fetch_hcms_query(config.attendance,config.late_policy_division_rel_save).format(i,inserted_id,current_user_id))
                        
                        json_data['status']=status_keys.SUCCESS_STATUS
                    else:
                        json_data['status']=status_keys.FAILURE_STATUS
                else:
                       json_data['status']=status_keys.FAILURE_STATUS 
                logger_obj.info("Late Policy Data Insert status"+ str(json_data) +" attempted by "+str(request.user.username)) 
        else:
            json_data['status']='001'
    except Exception as e:
        result = e
        json_data['Exception']=str(result)
        logger_obj.info("Late Policy Data Update/Insert exception"+ str(e) +" attempted by "+str(request.user.username)) 
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def early_policy_details(request):
    ''' 
            01-JUN-2018 || ESA || To fetch the Late policy details
            @param request: Request Object
            @type request : Object
            @return:  return the Late Policy details
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    try:
        if current_user_id:
            cur.execute(query.fetch_hcms_query(config.attendance,config.late_policy_details))
            policy_data = dictfetchall(cur)
            if policy_data:
                json_data['policy_data']=policy_data
            else:
                json_data['policy_data']=[]
        else:
            json_data['policy_data']=[]
        logger_obj.info("Late Policy Details fetch data  attempted by "+str(request.user.username)) 
    except Exception as e:
        result = e
        json_data['policy_data']=[]
        logger_obj.info("Late Policy Details fetch exception"+ str(e) +" attempted by "+str(request.user.username))  
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def early_policy_details_check(request):
    ''' 
            26-NOV-2018 || SND || To Check the Late policy details exist
            @param request: Request Object
            @type request : Object
            @return:  return the Late Policy details exist
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    try:
        if current_user_id:
            update_conidtion = ''
            division_id = request.GET.get('division_id',False)
            shift_id = request.GET.get('shift_id',False)
            click_id = request.GET.get('click_id',False)
            if click_id:
                update_conidtion = "and halp.id != {0}".format(click_id)
            if division_id and shift_id:
                division_id_id = json.loads(division_id)
                if len(division_id_id) == 1:
                    condition = "= "+str(map(str,division_id_id)[0])
                    
                elif len(division_id_id) > 1:
                    condition = "in "+str(tuple(map(str,division_id_id)))
                    
                cur.execute(query.fetch_hcms_query(config.attendance,config.late_policy_data_check).format(condition,shift_id,update_conidtion))
                policy_data = dictfetchall(cur)
                if policy_data:
                    json_data['policy_data_exist']=policy_data
                else:
                    json_data['policy_data_exist']=[]
            else:
                json_data['policy_data_exist']=[]
        else:
            json_data['policy_data_exist']=[]
        logger_obj.info("Late Policy Details fetch data  attempted by "+str(request.user.username)) 
    except Exception as e:
        result = e
        json_data['policy_data_exist']=[]
        logger_obj.info("Late Policy Details fetch exception"+ str(e) +" attempted by "+str(request.user.username))  
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def fetch_late_policy_details(request):
    ''' 
                01-MAY-2018 || ESA || To fetch the Policy details
                @param request: Request Object
                @type request : Object
                @return:  return the policy details
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    try:
        if current_user_id:
            policy_id=request.GET.get('policy_id')
#             shift_id=request.GET.get('shift_name_id')
            if policy_id:
                cur.execute(query.fetch_hcms_query(config.attendance,config.policy_details_show).format(policy_id))
                policy_details = dictfetchall(cur) 
                if policy_details:
                    json_data['fetch_data']=policy_details
                else:
                    json_data['fetch_data']=[]
#             logger_obj.info("Late Policy Details fetch based on policy id data"+ str(json_data) +" attempted by "+str(request.user.username))  
            else:
                json_data['fetch_data']=[]    
#             if shift_id:
#                 cur.execute(query.fetch_hcms_query(config.attendance,config.policy_shift_details_show).format(shift_id))
#                 policy_details = dictfetchall(cur)
#                 if policy_details:
#                     json_data['fetch_data']=policy_details
#                 else:
#                     json_data['fetch_data']=[]
#             logger_obj.info("Late Policy Details fetch based on shift id data"+ str(json_data) +" attempted by "+str(request.user.username))  
        else:
            json_data['fetch_data']=[]
    except Exception as e:
        result = e
        json_data['fetch_data']=[]
# #         logger_obj.info("Late Policy Details fetch exception"+ str(e) +" attempted by "+str(request.user.username))  
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def late_policy_remove(request):
    ''' 
            01-MAY-2018 || ESA || To remove the late policy details
            @param request: Request Object
            @type request : Object
            @return:  return the status
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    try:
      if current_user_id:
        remove_id=request.POST.get('remove_id')
        if remove_id:
             cur.execute(query.fetch_hcms_query(config.attendance,config.late_policy_remove),(str(current_user_id),str(remove_id)))
             json_data['status']=status_keys.REMOVE_STATUS
        else:
            json_data['status']=status_keys.FAILURE_STATUS
        logger_obj.info("Late Policy Details remove status"+ str(json_data) +" attempted by "+str(request.user.username))  
      else:
            json_data['status']='001'
    except Exception as e:
         result = e
         json_data['status']=[]
         logger_obj.info("Late Policy Details remove exception"+ str(e) +" attempted by "+str(request.user.username))  
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value) 

# Transform HCMS Shift Change Permission Request Details View here
def fetch_late_policy_details_shift_change(request):
    ''' 
    01-JUNE-2018 || ESA || Shift Change Leave Early Policy Details View.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    try:
        if current_user_id:
            shift_name_id = request.GET.get(config.shift_name_id,False)
            if shift_name_id and shift_name_id!=config.space and shift_name_id!=config.null:
                cur.execute(query.fetch_hcms_query(config.attendance,config.division_details_shift_change).format(shift_name_id))
                json_data[config.shift_change] = dictfetchall(cur)
            else:
                json_data[config.status]=config.NTE_08
            logger_obj.info("Shift Change Permission Request Details data "+ str(json_data) +" attempted by "+str(request.user.username))     
        else:
            json_data[config.status]=config.NTE_08
    except Exception as e:
        logger_obj.info("Shift Change Permission Request Details exception "+ str(e) +" attempted by "+str(request.user.username))     
        json_data[config.status] = e
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder),content_type=config.application_json)