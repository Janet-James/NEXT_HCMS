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
from HRMS_Foundation.payroll_management.models import LeadershipReturnValue
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

class HCMSLeadershipReturn(TemplateView):
    ''' 
        06-Sep-2018 VIJ To HR Payroll Rating point page loaded. And also check the user authentication
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
        @author: VIJ
    '''
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HCMSLeadershipReturn, self).dispatch(request, *args, **kwargs)

    def get_template_names(self):
        macl = menu_access_control('Employee Report', self.request.user.id)
        if macl:
            template_name = "hrms_foundation/payroll_management/leadership_value_return.html"
        else:
            template_name = "tags/access_denied.html"
        return [template_name]
    
    def get(self, request, *args, **kwargs):
        context = super(HCMSLeadershipReturn, self).get_context_data(**kwargs)
        cur = connection.cursor() 
        cur.execute("select id,slab_title from rating_point");
        slab_data = q.dictfetchall(cur)  
        if slab_data:
            slab_data = slab_data
        else:
            slab_data = []  
        context['slab'] = slab_data #Loading Organization Unit Data
        cur.execute("""select rftm.id,rftm.refitems_name,refitems_code from reference_items rftm
                inner join reference_item_category rftmc
                on rftm.refitems_category_id = rftmc.id where rftmc.refitem_category_code = 'LVRPD'""");
        lvr_data = q.dictfetchall(cur)  
        if lvr_data:
            lvr_data = lvr_data
        else:
            lvr_data = []  
        context['lvr_data'] = lvr_data #Loading Organization Unit Data
        return self.render_to_response(context)
    
    
@csrf_exempt
def HCMSLeadershipCreate(request): # employee details create function
    ''' 
    17-OCT-2018 VJY To HRMS Create Rating Point function. 
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: VJY
    '''
    #try:
    logger_obj.info('Leadership Value Return details data insert by'+str(request.user.username))
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
                        status = LeadershipReturnValue(lvr_name=data['leadership_data'][0]['lvr_name'], leadership_slab_id=data['leadership_data'][0]['leadership_slab_id'],
                                             lvr_period_id=data['leadership_data'][0]['lvr_period_id'],value_return=data['leadership_data'][0]['value_return'], leadership_date_from=data['leadership_data'][0]['leadership_date_from'],
                                              leadership_date_to=data['leadership_data'][0]['leadership_date_to'],is_active="True",created_by_id = uid)
                        status.save()
                        json_data[config.status_id] = status.id
                        json_data[config.status_key] = config.success_status
                    
            else:
                status = LeadershipReturnValue.objects.filter(id=reg_id).update(lvr_name=data['leadership_data'][0]['lvr_name'], leadership_slab_id=data['leadership_data'][0]['leadership_slab_id'],
                                             value_return=data['leadership_data'][0]['value_return'], leadership_date_from=data['leadership_data'][0]['leadership_date_from'],
                                             lvr_period_id=data['leadership_data'][0]['lvr_period_id'], leadership_date_to=data['leadership_data'][0]['leadership_date_to'],is_active="True",modified_by_id=uid)
                json_data[config.status_key] = config.update_status                                                           
                logger_obj.info('Leadership Value Return details update response is'+str(json_data)+"attempted by"+str(request.user.username)) 
    else:
        referred_record = record_validation('leadership_value_return', delete_id)
        if referred_record == True:
            status =  LeadershipReturnValue.objects.filter(id=delete_id).update(is_active="False")
            json_data[config.status_key] = config.remove_status
        elif referred_record == False:
            json_data[config.status_key] = config.record_already_referred                          
#     except Exception as e:
#             logger_obj.error(e)
#             json_data[config.status_key] = e
    return HttpResponse(json.dumps(json_data)) 

@csrf_exempt
def HCMSLeadershipTblDisplay(request):
    ''' 
    17-OCT-2018 VJY To HRMS Table Display Rating Point function. 
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: VJY
    '''
    try:
        json_data = {}
        logger_obj.info('Leadership Value Return details table display by'+str(request.user.username))
        if request.method == config.request_post:
            cur = connection.cursor() 
            cur.execute(q.fetch_hcms_query(config.payroll_management,config.leadership_table_display))
            table_data = q.dictfetchall(cur)
            if table_data:
                table_data = table_data
            else:
                table_data =[]    
    except Exception as e:
            logger_obj.error(e)
            json_data[config.status_key] = e        
    return HttpResponse(json.dumps(table_data))  

@csrf_exempt
def HCMSLeadershipTblRowClick(request):
    try:
        if request.method == config.request_get:
            cur = connection.cursor() 
            row_click_id = int(request.GET[config.id])
            if row_click_id:
                leadership_tbl_click = {}
                leadership_table_row_click = q.fetch_hcms_query(config.payroll_management,config.leadership_table_row_click)
                if leadership_table_row_click:
                    cur.execute(leadership_table_row_click%(row_click_id)) 
                    leadership_tbl_click = q.dictfetchall(cur)
    except Exception as e: 
            leadership_tbl_click = e
    return HttpResponse(json.dumps(leadership_tbl_click))
    