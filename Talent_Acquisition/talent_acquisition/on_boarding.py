# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.shortcuts import render
import json
from django.views.decorators.csrf import csrf_exempt
from django.http.response import HttpResponse
from CommonLib import query
from django.db import connection
from CommonLib import query as q
import config1 as  config
import HCMS.settings as settings
from CommonLib import lib
from Talent_Acquisition.talent_acquisition.models import OnBoardingInfo
#template render html
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from CommonLib.hcms_common import refitem_fetch,refitemlink_fetch
from CommonLib.hcms_common import record_validation 
from CommonLib.hcms_common import menu_access_control
from django_countries import countries
from django.views.decorators.csrf import csrf_exempt
import logging
import logging.handlers

logger_obj = logging.getLogger('logit')

# Offer On boarding   views here
class TAOnBoarding(TemplateView): 
    ''' 
    12-JULY-2018 PAR To Talent Acquisitions On boarding  page loaded. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: PAR
    '''
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(TAOnBoarding, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self): 
        macl = menu_access_control('Offer Management', self.request.user.id)
        if macl:
             template_name = "talent_acquisition/on_borading.html"
        else: 
            template_name = "tags/access_denied.html"   
        return [template_name]    
        
    def get(self, request, *args, **kwargs):
         context = super(TAOnBoarding, self).get_context_data(**kwargs)
         return self.render_to_response(context)
     
#On board operation function here     
@csrf_exempt
def TAOnboardCrud(request):
    ''' 
    13-JULY-2018 PAR To On board   CRUD operations
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse 
    @author: PAR
    '''
    #try:
    logger_obj.info('On board   CRUD function by '+str(request.user.username))
    json_data = {}
    post = request.POST
    cur=lib.db_connection()
    try:
        input_data = request.POST.get(config.datas)
        delete_id = request.POST.get(config.delete_id)
        uid = request.user.id 
        if not uid: 
            uid = 1 
        update_id = request.POST.get("update_id")  
        if input_data:  
            input_data = json.loads(input_data)
            connection=[str(item) for item in input_data.get("connection")]
            culture=[str(item) for item in input_data.get("culture")]
            clarification=[str(item) for item in input_data.get("clarification")]
            compliance=[str(item) for item in input_data.get("compliance")]
        if input_data and not delete_id : 
                if not update_id  : 
                   status = OnBoardingInfo(candidate_id=input_data.get("join_candidate"),connection=connection,
                            culture=culture,clarification=clarification,compiliance=compliance,is_active=True,created_by_id=int(uid))
                   status.save()
                   json_data[config.results] = config.add_success
                else: 
                       status= OnBoardingInfo.objects.filter(id=update_id).update(candidate_id=input_data.get("join_candidate"),connection=connection,
                            culture=culture,clarification=clarification,compiliance=compliance,is_active=True,modified_by_id=int(uid))
                       json_data[config.results] = config.update_success 
        elif delete_id:
                referred_record = record_validation('ta_offer_info', delete_id)
                if referred_record:  
                    status =  OfferInfo.objects.filter(id=delete_id).update(is_active="False",modified_by_id=int(uid))
                    json_data[config.results] = config.delete_success
                else:
                    json_data[config.results] =status_keys.ERR0028 
#         elif org_unit_id:   
#             cur.execute(""" 
#                 select ou.id,ou.orgunit_name,ou.address,ou.orgunit_code,ou.orgunit_type_id,ou.parent_orgunit_type,ou.parent_orgunit_id,fo.orgunit_name as parent_orgunit_name,ou.organization_id from organization_unit_info ou left join 
#                 (select id,orgunit_name from organization_unit_info) as fo  on ou.parent_orgunit_id=fo.id
#                 where is_active=true and ou.id=%s
#                             """,(org_unit_id,))
#             org_unit=lib.dictfetchall(cur)
#             json_data[config.results] = org_unit 
        logger_obj.info('On board   CRUD function  response is'+str(json_data)+"attempted by"+str(request.user.username))         
    except Exception as e:
                logger_obj.error(e)
                json_data[config.results] =config.error
    
    return HttpResponse(json.dumps(json_data))

#On board data function here
@csrf_exempt
def TAOnboardData(request): 
    ''' 
    12-JULY-2018 PAR To On board data  data for table
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse 
    @author: PAR
    '''
    try:
        logger_obj.info('Talent Acquisition TAOnboardData function by'+str(request.user.username))
        if request.method=='GET' or request.method=='POST':
            post=request.POST
            type=post.get("type")
            cur=lib.db_connection()#to_char(hr_leave.created_date, 'MM-DD-YYYY HH24:MI:SS') AS raised_date,
            user_id = request.user.id
            dic = {}
            json_datas = {}   
            values=[];       
            if type=="all":  
                if user_id:
                    on_boarding_table=query.fetch_hcms_query(config.talent_acquisition,config.on_boarding_table_query)
                    if on_boarding_table:
                        cur.execute(on_boarding_table) 
                        values=cur.fetchall()
                        keys =config.on_boarding_table_key
                        dic = list(dict(zip(keys,j)) for j in values)  
                commit =lib.db_commit(cur) 
                close = lib.db_close(cur)
                json_datas['datas'] = values
                json_datas = json_datas#response data function call
                
            elif type=="row": 
                 table_id=post.get("table_id") 
                 if user_id: 
                    candidate_dropdown=query.fetch_hcms_query(config.talent_acquisition,config.candidate_dropdown_query)
                    if candidate_dropdown:
                        cur.execute(candidate_dropdown,((table_id),))
                        board_values=q.dictfetchall(cur)
                        json_datas['datas'] = board_values  
                    candidate_asset_details=query.fetch_hcms_query(config.talent_acquisition,config.candidate_asset_details_query)
                    if candidate_asset_details:
                        cur.execute(candidate_asset_details,((table_id),))
                        asset_values=q.dictfetchall(cur)
                        json_datas['asset_details'] = asset_values 
                 close = lib.db_close(cur) 
            elif type=="choose":   
                 if user_id:
                    offer_candidate_table_row=query.fetch_hcms_query(config.talent_acquisition,config.offer_candidate_dropdown_query)
                    if offer_candidate_table_row:  
                        cur.execute(offer_candidate_table_row)  
                        values=q.dictfetchall(cur)
                 close = lib.db_close(cur) 
                 json_datas['datas'] = values   
            logger_obj.info('Talent Acquisition  TAOnboardData response is'+str(json_datas)+"attempted by"+str(request.user.username))                 
    except Exception as e:
       logger_obj.error(e) 
       json_datas['datas'] = []
    return HttpResponse(json.dumps(json_datas))
