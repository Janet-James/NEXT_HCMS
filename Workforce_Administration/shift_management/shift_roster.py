# -*- coding: utf-8 -*-
from __future__ import unicode_literals
 
import json
from django.views.generic.base import TemplateView
from django.views.decorators.csrf import csrf_exempt
from django.http.response import HttpResponse
from CommonLib import query
from django.db import connection
from CommonLib.lib import *
# for decoder function
from django.core import serializers
from django.core.serializers.json import DjangoJSONEncoder
import HCMS.settings as status_keys

import logging
import logging.handlers
import config
logger_obj = logging.getLogger('logit')

def shift_roster_add_update(request):  #Added- Janet James-24MAY2018
    ''' 
    24-MAY-2018 || JAN || Shift Roster detail insert .
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    try:
        if current_user_id:
            roster_name=request.POST.get('roster_name',False)
            roster_description=request.POST.get('roster_description',False)
            roster_repeat_mode=request.POST.get('roster_repeat_mode',False)
            roster_week=request.POST.get('roster_weekly_pattern',False)
            roster_month=request.POST.get('roster_monthly_pattern',False)
            roster_end_mode=request.POST.get('roster_end_mode',False)
            roster_end_shift_occurence=request.POST.get('roster_end_shift_occurence',False)
            roster_end_date=request.POST.get('roster_end_date',False)
            roster_rotation_from=request.POST.get('roster_rotation_from',False)
            roster_rotation_to=request.POST.get('roster_rotation_to',False)
            shift_roster_id=request.POST.get('shift_roster_id',False)
            roster_weekly_pattern=','.join([str(item) for item in json.loads(roster_week)])
            roster_monthly_pattern=','.join([str(item) for item in json.loads(roster_month)])
            if roster_end_shift_occurence=='':
                roster_end_shift_occurence=None
            if roster_end_date=='':
                roster_end_date=None
            if shift_roster_id:
                cur.execute(query.fetch_hcms_query(config.shift_module,config.shift_roster_update),(roster_name,roster_description,roster_repeat_mode,roster_weekly_pattern,
                  roster_monthly_pattern,roster_end_mode,roster_end_shift_occurence,
                  roster_end_date,roster_rotation_from,roster_rotation_to,current_user_id,shift_roster_id))
                json_data['status']=status_keys.UPDATE_STATUS
            else:
                cur.execute(query.fetch_hcms_query(config.shift_module,config.shift_roster_insert),(roster_name,roster_description,roster_repeat_mode,roster_weekly_pattern,
                  roster_monthly_pattern,roster_end_mode,roster_end_shift_occurence,
                  roster_end_date,roster_rotation_from,roster_rotation_to,current_user_id,True))
                json_data['status']=status_keys.SUCCESS_STATUS
            logger_obj.info("Shift Roster detail insert function status "+ str(json_data) +" attempted by "+str(request.user.username)) 
        else:
            json_data['status']='NTE-08'
    except Exception as e:
        json_data['status'] = e
        logger_obj.info("Shift Roster detail insert function exception "+ str(json_data) +" attempted by "+str(request.user.username)) 
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)
    
def shift_roster_detail(request):
    ''' 
    25-MAY-2018 || JAN || Shift Roster detail fetch.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    json_datas = {} 
    current_user_id=request.user.id
    cur = db_connection()
    try:
        if current_user_id:
            cur.execute(query.fetch_hcms_query(config.shift_module,config.shift_roster_detail_fetch))
            shift_roster_detail=dictfetchall(cur)
            json_datas['shift_roster_detail']=shift_roster_detail
            json_datas['status']='Success'
            logger_obj.info("Shift Roster detail fetch data "+ str(json_datas) +" attempted by "+str(request.user.username)) 
        else:
            json_datas['status']='NTE-08'
    except Exception as e:
        json_datas['status'] = e
        logger_obj.info("Shift Roster detail fetch function exception "+ str(e) +" attempted by "+str(request.user.username)) 
    return HttpResponse(json.dumps(json_datas,cls=DjangoJSONEncoder), content_type="application/json")

def shift_roster_detail_fetch(request):
    ''' 
    25-MAY-2018 || JAN || Shift Roster detail fetch by ID.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    json_datas = {} 
    current_user_id=request.user.id
    cur = db_connection()
    try:
        if current_user_id:
            shift_roster_id=request.POST.get('shift_roster_id')
            cur.execute(query.fetch_hcms_query(config.shift_module,config.shift_roster_detail_fetch_by_id),(shift_roster_id))
            shift_roster_detail=dictfetchall(cur)
            json_datas['shift_roster_detail']=shift_roster_detail
            json_datas['status']='Success'
            logger_obj.info("Shift Roster detail fetch by ID data "+ str(json_datas) +" attempted by "+str(request.user.username)) 
        else:
            json_datas['status']='NTE-08'
    except Exception as e:
        json_datas['status'] = e
        logger_obj.info("Shift Roster detail fetch by ID exception "+ str(e) +" attempted by "+str(request.user.username)) 
    return HttpResponse(json.dumps(json_datas,cls=DjangoJSONEncoder), content_type="application/json")


def shift_roster_remove(request):
    ''' 
    25-MAY-2018 || JAN || Shift Roster detail remove.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    json_datas = {} 
    current_user_id=request.user.id
    cur = db_connection()
    try:
        if current_user_id:
            current_user_id=request.user.id
            shift_roster_id=request.POST.get('shift_roster_id')
            cur.execute(query.fetch_hcms_query(config.shift_module,config.shift_roster_detail_remove),(current_user_id,shift_roster_id))
            json_data['status']=status_keys.REMOVE_STATUS
            logger_obj.info("Shift Roster detail remove status "+ str(json_data) +" attempted by "+str(request.user.username)) 
        else:
            json_datas['status']='NTE-08'
    except Exception as e:
        json_data['status'] = e
        logger_obj.info("Shift Roster detail remove status "+ str(e) +" attempted by "+str(request.user.username)) 
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type="application/json")