# -*- coding: utf-8 -*-
from __future__ import unicode_literals
 
import json
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.http.response import HttpResponse
from CommonLib import query
from django.db import connection
from CSD.JenkinsAPI import jenkins_fetch
from CommonLib.lib import *
# for decoder function
from django.core import serializers
from django.core.serializers.json import DjangoJSONEncoder
import HCMS.settings as status_keys
import logging
import logging.handlers
import config as c
logger_obj = logging.getLogger('logit')
# from CommonLib.hcms_common import record_validation 
# from UAM.uam_session_sync import uam_sessions_sync
# from UAM.uam_func_data_sync import uam_func_sync
# from tracking.models import Visitor


# Transform HCMS Permission request Insert here
def permission_request_add(request):  #Added- Sindhuja-01Jun2018
    ''' 
    01-JUNE-2018 || SND || Permission Request Insert Function .
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    try:
        if current_user_id:
            division_id_list = request.POST.get(c.division_id_list,False)
            shift_name_list = request.POST.get(c.shift_name_list,False)
            permission_apply = request.POST.get(c.permission_apply,False)
            permission_period = request.POST.get(c.permission_period,False)
            request_allowed = request.POST.get(c.request_allowed,False)
            permission_per_day = request.POST.get(c.permission_per_day,False)
            max_hours_allowed = request.POST.get(c.max_hours_allowed,False)
            data_division_id = request.POST.get('data_division_id')
            permission_request_id = request.POST.get('permission_request_id')
            if data_division_id and permission_request_id:
                    division_id_id = json.loads(data_division_id)
                    permission_id_id = json.loads(permission_request_id)
                    for p in permission_id_id:
                        cur.execute("""select count(id) from hcms_permission_request_conf_div_rel hprcr where 
                        hprcr.permission_request_id = {0} and hprcr.is_active=true""".format(p))
                        permission_count_id = cur.fetchall()
                        if permission_count_id:
                            if permission_count_id[0][0] == len(division_id_id):
                                cur.execute("""update hcms_permission_request_conf set is_active=false,modified_date=now() 
                                where id = {0}""".format(p))
                            for i in division_id_id:
                                cur.execute("""update hcms_permission_request_conf_div_rel set is_active=false,modified_date=now()
                                where permission_request_id = {0} and division_id = {1} """.format(p,i))
            
            if shift_name_list and permission_apply and permission_period and request_allowed and permission_per_day and max_hours_allowed and division_id_list:
                division_id = json.loads(division_id_list)
                cur.execute(query.fetch_hcms_query(c.attendance,c.permission_request_save).format(shift_name_list,request_allowed,permission_apply,permission_per_day,
                permission_period,max_hours_allowed,True,current_user_id))
                return_data=dictfetchall(cur)
                if return_data:
                    permission_id = return_data[0]['id']
                    for i in division_id:
                        cur.execute(query.fetch_hcms_query(c.attendance,c.permission_request_division_rel_save).format(i,permission_id,current_user_id))
                    json_data[c.status] = status_keys.SUCCESS_STATUS
                else:
                    json_data[c.status] = status_keys.FAILURE_STATUS
                logger_obj.info("Permission Request Insert Function Status "+ str(json_data) +" attempted by "+str(request.user.username))  
            else:
                json_data[c.status] = c.NTE_08
                logger_obj.info("Permission Request Insert Function Status "+ str(json_data) +" attempted by "+str(request.user.username))  
        else:
            json_data[c.status]=c.NTE_08
    except Exception as e:
        json_data[c.status] = e
        logger_obj.info("Permission Request Insert Function Exception "+ str(e) +" attempted by "+str(request.user.username))  
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder),content_type=c.application_json)

# Transform HCMS Permission request Update here
def permission_request_update(request):  #Added- Sindhuja-01Jun2018
    ''' 
    01-JUNE-2018 || SND || Permission Request Update Function .
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    try:
        if current_user_id:
            division_id_list = request.POST.get(c.division_id_list,False)
            permission_id = request.POST.get(c.permission_id,False)
            shift_name_list = request.POST.get(c.shift_name_list,False)
            permission_apply = request.POST.get(c.permission_apply,False)
            permission_period = request.POST.get(c.permission_period,False)
            request_allowed = request.POST.get(c.request_allowed,False)
            permission_per_day = request.POST.get(c.permission_per_day,False)
            max_hours_allowed = request.POST.get(c.max_hours_allowed,False)
            data_division_id = request.POST.get('data_division_id')
            permission_request_id = request.POST.get('permission_request_id')
            if data_division_id and permission_request_id:
                    division_id_id = json.loads(data_division_id)
                    permission_id_id = json.loads(permission_request_id)
                    for p in permission_id_id:
                        cur.execute("""select count(id) from hcms_permission_request_conf_div_rel hprcr where 
                        hprcr.permission_request_id = {0} and hprcr.is_active=true""".format(p))
                        permission_count_id = cur.fetchall()
                        if permission_count_id:
                            if permission_count_id[0][0] == len(division_id_id):
                                cur.execute("""update hcms_permission_request_conf set is_active=false,modified_date=now(),modified_by_id={1} 
                                where id = {0}""".format(p,current_user_id))
                            for i in division_id_id:
                                cur.execute("""update hcms_permission_request_conf_div_rel set is_active=false,modified_date=now(),
                                modified_by_id={2} where permission_request_id = {0} and division_id = {1} """.format(p,i,current_user_id))
                                
            if permission_id and shift_name_list and permission_apply and permission_period and request_allowed and permission_per_day and max_hours_allowed and division_id_list:
                division_id = json.loads(division_id_list)
                cur.execute(query.fetch_hcms_query(c.attendance,c.permission_request_update).format(shift_name_list,request_allowed,permission_apply,permission_per_day,
                permission_period,max_hours_allowed,True,current_user_id,permission_id))
                return_data=dictfetchall(cur)
                cur.execute(query.fetch_hcms_query(c.attendance,c.permission_request_division_rel_delete),(str(current_user_id),str(permission_id),))
                for i in division_id:
                    cur.execute(query.fetch_hcms_query(c.attendance,c.permission_request_division_rel_save).format(i,permission_id,current_user_id))
                if return_data:
                    json_data[c.status] = status_keys.UPDATE_STATUS
                else:
                    json_data[c.status] = status_keys.FAILURE_STATUS
            else:
                json_data[c.status] = c.NTE_08
            logger_obj.info("Permission Request Update Function Status "+ str(json_data) +" attempted by "+str(request.user.username))  
        else:
            json_data[c.status]=c.NTE_08
    except Exception as e:
        json_data[c.status] = e
        logger_obj.info("Permission Request Update Function Exception "+ str(e) +" attempted by "+str(request.user.username))  
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder),content_type=c.application_json)

# Transform HCMS Permission request delete here
def permission_request_delete(request):  #Added- Sindhuja-01Jun2018
    ''' 
    01-JUNE-2018 || SND || Permission Request Delete Function .
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    try:
        if current_user_id:
            permission_id = request.POST.get(c.permission_id,False)
            if permission_id:
                cur.execute(query.fetch_hcms_query(c.attendance,c.permission_request_delete).format(permission_id,current_user_id))
                return_data=dictfetchall(cur)
                if return_data:
                    json_data[c.status] = status_keys.REMOVE_STATUS
                else:
                    json_data[c.status] = status_keys.FAILURE_STATUS
            else:
                json_data[c.status] = c.NTE_08
            logger_obj.info("Permission Request Remove Function Status "+ str(json_data) +" attempted by "+str(request.user.username))  
        else:
            json_data[c.status]=c.NTE_08
    except Exception as e:
        json_data[c.status] = e
        logger_obj.info("Permission Request Remove Function Exception "+ str(json_data) +" attempted by "+str(request.user.username)) 
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder),content_type=c.application_json)

# Transform HCMS Permission request View here
def permission_request_view(request):  #Added- Sindhuja-01Jun2018
    ''' 
    01-JUNE-2018 || SND || Permission Request View Function .
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    try:
        if current_user_id:
            permission_details_id = request.GET.get(c.permission_details_id,False)
            cur.execute(query.fetch_hcms_query(c.attendance,c.permission_details_table_view))
            json_data[c.return_data] = cur.fetchall()
            if permission_details_id and permission_details_id!=c.space and permission_details_id!=c.null:
                cur.execute(query.fetch_hcms_query(c.attendance,c.permission_details_view).format(permission_details_id))
                json_data[c.permission_details] = dictfetchall(cur)
            else:
                json_data[c.status]=c.NTE_08
            logger_obj.info("Permission Request View Function data "+ str(json_data) +" attempted by "+str(request.user.username))     
        else:
            json_data[c.status]=c.NTE_08
    except Exception as e:
        json_data[c.status] = e
        logger_obj.info("Permission Request View Function exception "+ str(json_data) +" attempted by "+str(request.user.username)) 
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder),content_type=c.application_json)

def permission_request_details_check(request):
    ''' 
            26-NOV-2018 || SND || To Check the Permission Request details exist
            @param request: Request Object
            @type request : Object
            @return:  return the Permission Request details exist
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
                update_conidtion = "and hprc.id != {0}".format(click_id)
            if division_id and shift_id:
                division_id_id = json.loads(division_id)
                if len(division_id_id) == 1:
                    condition = "= "+str(map(str,division_id_id)[0])
                    
                elif len(division_id_id) > 1:
                    condition = "in "+str(tuple(map(str,division_id_id)))
                    
                cur.execute(query.fetch_hcms_query(c.attendance,c.permission_request_data_check).format(condition,shift_id,update_conidtion))
                policy_data = dictfetchall(cur)
                if policy_data:
                    json_data['permission_request_exist']=policy_data
                else:
                    json_data['permission_request_exist']=[]
            else:
                json_data['permission_request_exist']=[]
        else:
            json_data['permission_request_exist']=[]
        logger_obj.info("Permission Request Details fetch data  attempted by "+str(request.user.username)) 
    except Exception as e:
        result = e
        json_data['permission_request_exist']=[]
        logger_obj.info("Permission Request Details fetch exception"+ str(e) +" attempted by "+str(request.user.username))  
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=c.content_type_value)

# Transform HCMS Shift Change Permission Request Details View here
def shift_change_details(request):
    ''' 
    01-JUNE-2018 || SND || Shift Change Permission Request Details View.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    try:
        if current_user_id:
            shift_name_id = request.GET.get(c.shift_name_id,False)
            if shift_name_id and shift_name_id!=c.space and shift_name_id!=c.null:
                cur.execute(query.fetch_hcms_query(c.attendance,c.shift_change_details).format(shift_name_id))
                json_data[c.shift_details] = dictfetchall(cur)
                cur.execute(query.fetch_hcms_query(c.attendance,c.division_details_shift_change).format(shift_name_id))
                json_data[c.shift_change] = dictfetchall(cur)
            else:
                json_data[c.status]=c.NTE_08
            logger_obj.info("Shift Change Permission Request Details data "+ str(json_data) +" attempted by "+str(request.user.username))     
        else:
            json_data[c.status]=c.NTE_08
    except Exception as e:
        logger_obj.info("Shift Change Permission Request Details exception "+ str(e) +" attempted by "+str(request.user.username))     
        json_data[c.status] = e
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder),content_type=c.application_json)