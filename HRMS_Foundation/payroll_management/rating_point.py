# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.shortcuts import render

import xlwt
import json
import datetime
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.http.response import HttpResponse
from CommonLib import query
from django.db import connection
from CommonLib import query as q
from HRMS_Foundation.payroll_management.models import RatingPoint
from django_countries import countries
import config
from CommonLib.hcms_common import refitem_fetch
from CommonLib.hcms_common import menu_access_control
import HCMS.settings as setting
#template render html
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from CommonLib.hcms_common import record_validation 
from CommonLib.hcms_common import refitem_fetch,refitemlink_fetch
import logging
import logging.handlers
import inflect
v = inflect.engine()
logger_obj = logging.getLogger('logit')

class HCMSRatingPoint(TemplateView):
    ''' 
        06-Sep-2018 VIJ To HR Payroll Rating point page loaded. And also check the user authentication
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
        @author: VIJ
    '''
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HCMSRatingPoint, self).dispatch(request, *args, **kwargs)

    def get_template_names(self):
        macl = menu_access_control('Employee Report', self.request.user.id)
        if macl:
            template_name = "hrms_foundation/payroll_management/rating_point.html"
        else:
            template_name = "tags/access_denied.html"
        return [template_name]
    
    def get(self, request, *args, **kwargs):
        context = super(HCMSRatingPoint, self).get_context_data(**kwargs)
        return self.render_to_response(context)
    
@csrf_exempt
def HCMSRatingPointCreate(request): # employee details create function
    ''' 
    17-OCT-2018 VJY To HRMS Create Rating Point function. 
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: VJY
    '''
    try:
        logger_obj.info('Rating Point details data insert by'+str(request.user.username))
        cur = connection.cursor() 
        json_data = {}
        data_value = request.POST.get(config.datas)   
        reg_id = request.POST.get(config.table_id) 
        delete_id = request.POST.get(config.delete_id)
        uid=request.user.id
        if not uid:
            uid = 1
        if data_value :
                data = json.loads(data_value)
                if reg_id == '0': 
                            status = RatingPoint(minimum_range=data['rating_data'][0]['minimum_range'], maximum_range=data['rating_data'][0]['maximum_range'],slab_title=data['rating_data'][0]['slab_title'], fixed_return=data['rating_data'][0]['fixed_return'],
                                                  variable_return=data['rating_data'][0]['variable_return'],rating_date_from=data['rating_data'][0]['rating_date_from'],rating_date_to=data['rating_data'][0]['rating_date_to'],is_active="True",created_by_id = uid)
                            status.save()
                            json_data[config.status_id] = status.id
                            json_data[config.status_key] = config.success_status
                        
                else:
                    status = RatingPoint.objects.filter(id=reg_id).update(minimum_range=data['rating_data'][0]['minimum_range'], maximum_range=data['rating_data'][0]['maximum_range'],slab_title=data['rating_data'][0]['slab_title'], fixed_return=data['rating_data'][0]['fixed_return'],
                                                  variable_return=data['rating_data'][0]['variable_return'],rating_date_from=data['rating_data'][0]['rating_date_from'],rating_date_to=data['rating_data'][0]['rating_date_to'],is_active="True",modified_by_id=uid)
                    json_data[config.status_key] = config.update_status                                                           
                    logger_obj.info('Rating Point details update response is'+str(json_data)+"attempted by"+str(request.user.username)) 
        else:
            referred_record = record_validation('rating_point', delete_id)
            if referred_record == True:
                status =  RatingPoint.objects.filter(id=delete_id).update(is_active="False")
                json_data[config.status_key] = config.remove_status
            elif referred_record == False:
                json_data[config.status_key] = config.record_already_referred                          
    except Exception as e:
            logger_obj.error(e)
            json_data[config.status_key] = e
    return HttpResponse(json.dumps(json_data))  

@csrf_exempt
def HCMSRatingPointTblDisplay(request):
    ''' 
    17-OCT-2018 VJY To HRMS Table Display Rating Point function. 
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: VJY
    '''
    try:
        json_data = {}
        logger_obj.info('Rating Point details table display by'+str(request.user.username))
        if request.method == config.request_post:
            cur = connection.cursor() 
            cur.execute(q.fetch_hcms_query(config.payroll_management,config.rating_point_table_display))
            table_data = q.dictfetchall(cur)
    except Exception as e:
            logger_obj.error(e)
            json_data[config.status_key] = e        
    return HttpResponse(json.dumps(table_data))  

@csrf_exempt
def HCMSRatingPointTblRowClick(request):
    try:
        if request.method == config.request_get:
            cur = connection.cursor() 
            row_click_id = int(request.GET[config.id])
            if row_click_id:
                rating_tbl_click = {}
                rating_point_table_row_click = q.fetch_hcms_query(config.payroll_management,config.rating_point_table_row_click)
                if rating_point_table_row_click:
                    cur.execute(rating_point_table_row_click%(row_click_id)) 
                    rating_tbl_click = q.dictfetchall(cur)
    except Exception as e: 
            rating_tbl_click = e
    return HttpResponse(json.dumps(rating_tbl_click))