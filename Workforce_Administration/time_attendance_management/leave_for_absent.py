# -*- coding: utf-8 -*-
from __future__ import unicode_literals
 
import json
from django.views.generic.base import TemplateView
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

def leave_for_absent_add_update(request):  #Added- Esakkiprem-07Feb2018
    ''' 
    01-JUN-2018 || JAN || Leave for absent detail insert .
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    try:
        if current_user_id:
            shift_id=request.POST.get('shift_id',False)
            leave_type_ids=json.loads(request.POST.get('leave_type_ids',False))
            start_day=request.POST.get('start_day',False)
            end_day=request.POST.get('end_day',False)
            effective_date=request.POST.get('effective_date',False)
            lfa_detail_id=request.POST.get('lfa_detail_id',False)
            if effective_date=='':
                effective_date=None
            if lfa_detail_id:
                cur.execute(query.fetch_hcms_query(config.attendance,config.lfa_update),(shift_id,start_day,end_day,effective_date,current_user_id,lfa_detail_id))
                cur.execute(query.fetch_hcms_query(config.attendance,config.lfa_leave_deduct_remove),(lfa_detail_id))
                for i in leave_type_ids:
                    cur.execute(query.fetch_hcms_query(config.attendance,config.lfa_leave_deduct_add),(i,lfa_detail_id,current_user_id))
                json_data['status']=status_keys.UPDATE_STATUS
                logger_obj.info("Leave for absent detail update status "+ str(json_datas) +" attempted by "+str(request.user.username)) 
            else:
                cur.execute(query.fetch_hcms_query(config.attendance,config.lfa_add),(shift_id,start_day,end_day,effective_date,current_user_id))
                leave_for_absent_id=cur.fetchall();
                for i in leave_type_ids:
                    cur.execute(query.fetch_hcms_query(config.attendance,config.lfa_leave_deduct_add),(i,current_user_id,leave_for_absent_id[0][0]))
                json_data['status']=status_keys.SUCCESS_STATUS
                logger_obj.info("Leave for absent detail insert status "+ str(json_datas) +" attempted by "+str(request.user.username)) 
        else:
            json_datas['status']='NTE-08'
    except Exception as e:
        json_datas['status'] = e
        logger_obj.info("Leave for absent detail insert/update exception "+ str(json_datas) +" attempted by "+str(request.user.username)) 
        return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)
    
def leave_for_absent_detail(request):
    ''' 
    4-JUN-2018 || JAN || Leave for Absent detail fetch.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    json_datas = {} 
    current_user_id=request.user.id
    cur = db_connection()
    try:
        if current_user_id:
            cur.execute(query.fetch_hcms_query(config.attendance,config.leave_for_absent_detail_fetch))
            leave_for_absent_detail=dictfetchall(cur)
            json_datas['leave_for_absent_detail']=leave_for_absent_detail
            json_datas['status']='Success'
            logger_obj.info("Leave for Absent detail fetch data "+ str(json_datas) +" attempted by "+str(request.user.username)) 
        else:
            json_datas['status']='NTE-08'
    except Exception as e:
        json_datas['status'] = e
        logger_obj.info("Leave for Absent detail fetch exception "+ str(json_datas) +" attempted by "+str(request.user.username)) 
    return HttpResponse(json.dumps(json_datas,cls=DjangoJSONEncoder), content_type="application/json")

def leave_for_absent_detail_fetch(request):
    ''' 
    04-JUN-2018 || JAN || Leave for Absent detail fetch by id.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    json_datas = {} 
    current_user_id=request.user.id
    cur = db_connection()
    try:
        if current_user_id:
            lfa_detail_id=request.POST.get('lfa_detail_id')
            shift_id=request.POST.get('shift_id')
            if lfa_detail_id:
                cur.execute(query.fetch_hcms_query(config.attendance,config.leave_for_absent_detail_fetch_by_id),(lfa_detail_id,lfa_detail_id))
            else:
                cur.execute(query.fetch_hcms_query(config.attendance,config.leave_for_absent_detail_fetch_by_shift),(shift_id,shift_id))            
            leave_for_absent_detail=dictfetchall(cur)
            json_datas['leave_for_absent_detail']=leave_for_absent_detail
            json_datas['status']='Success'
            logger_obj.info("Leave for Absent detail fetch by id data "+ str(json_datas) +" attempted by "+str(request.user.username)) 
        else:
            json_datas['status']='NTE-08'
        
    except Exception as e:
        json_datas['status'] = e
        logger_obj.info("Leave for Absent detail fetch by id exception "+ str(json_datas) +" attempted by "+str(request.user.username)) 
    return HttpResponse(json.dumps(json_datas,cls=DjangoJSONEncoder), content_type="application/json")

def leave_for_absent_detail_remove(request):
    ''' 
    04-JUN-2018 || JAN || Leave for absent detail remove.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {} 
    current_user_id=request.user.id
    cur = db_connection()
    try:
        if current_user_id:
            current_user_id=request.user.id
            lfa_detail_id=request.POST.get('lfa_detail_id')
            cur.execute(query.fetch_hcms_query(config.attendance,config.lfa_detail_remove),(current_user_id,lfa_detail_id))
            json_data['status']=status_keys.REMOVE_STATUS
            logger_obj.info("Leave for absent detail remove status "+ str(json_datas) +" attempted by "+str(request.user.username)) 
        else:
            json_datas['status']='NTE-08'
    except Exception as e:
        json_data['status'] = e
        logger_obj.info("Leave for absent detail remove exception "+ str(json_datas) +" attempted by "+str(request.user.username)) 
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type="application/json")