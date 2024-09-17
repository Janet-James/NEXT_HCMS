# -*- coding: utf-8 -*-
from __future__ import unicode_literals
 
import json
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from django.http.response import HttpResponse
from CommonLib import query
from django.db import connection
from CommonLib.hcms_common import menu_access_control
from CommonLib.lib import *
# for decoder function
from django.core import serializers
from django.core.serializers.json import DjangoJSONEncoder
import HCMS.settings as status_keys

import logging
import logging.handlers
import config
logger_obj = logging.getLogger('logit')

class HCMSGeneralTrainingRecommendation(TemplateView):
    ''' 
    20-SEP-2018 || JAN || To Load General Training Recommendation Page
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
        
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HCMSGeneralTrainingRecommendation, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('General Recommendation', self.request.user.id)
        if macl:
           template_name = config.general_training_recommendation_template
        else:
            template_name = config.tags_access_denied_html
        return [template_name] 
    
    def get(self, request, *args, **kwargs):
        cur=connection.cursor() 
        context = super(HCMSGeneralTrainingRecommendation, self).get_context_data(**kwargs)
        try:
            cur.execute(query.fetch_hcms_query(config.learning_development_module,config.fetch_organization_details_view))
            org_info=dictfetchall(cur)
            context[config.organization]=org_info
        except Exception as e:
            context[config.exception] = e
        cur.close()    
        return self.render_to_response(context)
    
class HCMSManagementTrainingRecommendation(TemplateView):
    ''' 
    20-SEP-2018 || JAN || To Load Management Training Recommendation Page
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
        
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HCMSManagementTrainingRecommendation, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Management & TL Recommendation', self.request.user.id)
        if macl:
           template_name = config.management_training_recommendation_template
        else:
            template_name = config.tags_access_denied_html
        return [template_name] 
    
    def get(self, request, *args, **kwargs):
        cur=connection.cursor() 
        context = super(HCMSManagementTrainingRecommendation, self).get_context_data(**kwargs)
        try:
            cur.execute(query.fetch_hcms_query(config.learning_development_module,config.fetch_organization_details_view))
            org_info=dictfetchall(cur)
            context[config.organization]=org_info
        except Exception as e:
            context[config.exception] = e
        cur.close()    
        return self.render_to_response(context)
    
class HCMSTLTrainingRecommendation(TemplateView):
    ''' 
    20-SEP-2018 || JAN || To Load TL Training Recommendation Page
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
        
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HCMSTLTrainingRecommendation, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Management & TL Recommendation', self.request.user.id)
        if macl:
           template_name = config.tl_training_recommendation_template
        else:
            template_name = config.tags_access_denied_html
        return [template_name] 
    
    def get(self, request, *args, **kwargs):
        cur=connection.cursor() 
        context = super(HCMSTLTrainingRecommendation, self).get_context_data(**kwargs)
        try:
            cur.execute(query.fetch_hcms_query(config.learning_development_module,config.fetch_organization_details_view))
            org_info=dictfetchall(cur)
            cur.execute(query.fetch_hcms_query(config.learning_development_module,config.fetch_training_type))
            training_type=dictfetchall(cur)
            cur.execute(query.fetch_hcms_query(config.learning_development_module,config.fetch_training_method))
            training_method=dictfetchall(cur)
            cur.execute(query.fetch_hcms_query(config.learning_development_module,config.fetch_training_category))
            training_category=dictfetchall(cur)
            context[config.organization]=org_info
            context[config.training_type_data]=training_type
            context[config.training_method_data]=training_method
            context[config.training_category_data]=training_category
        except Exception as e:
            context[config.exception] = e
        cur.close()    
        return self.render_to_response(context)
    
def ld_division_data_fetch(request):
    ''' 
            20-SEP-2018 || JAN || To fetch the division detail on changing org unit
            @param request: Request Object
            @type request : Object
            @return:  return the org unit
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    json_data['division_detail']=[]
    try:
        if current_user_id:
            org_unit_id=request.GET.get('org_unit_id')
            if org_unit_id:
                cur.execute(query.fetch_hcms_query(config.learning_development_module,config.ld_division_load).format(org_unit_id))
                division_detail = dictfetchall(cur)
                if division_detail:
                    json_data['division_detail']=division_detail
                logger_obj.info("Division details"+ str(json_data) +" attempted by "+str(request.user.username))
    except Exception as e:
        result = e
        logger_obj.info("Division details exception as"+ str(e) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)    
    
def ld_employee_training_data_fetch(request):
    ''' 
            21-SEP-2018 || JAN || To fetch the employee and training detail on changing division
            @param request: Request Object
            @type request : Object
            @return:  return the org unit
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    division_id=json.loads(request.GET.get('division_id'))
    print"gggggggggggggggggggggg",division_id
    if current_user_id:
        div=tuple(division_id)
        print"ggggggggggggggggg",div
        if division_id:
            
            cur.execute(query.fetch_hcms_query(config.learning_development_module,config.ld_employee_fetch).format(tuple(division_id)))
            employee_detail = dictfetchall(cur)
#             cur.execute(query.fetch_hcms_query(config.learning_development_module,config.ld_training_fetch).format(division_id))
#             training_detail = dictfetchall(cur)
            json_data['employee_detail']=employee_detail
#             json_data['training_detail']=training_detail
        print"vvvvvvvvvvvvvv",json_data
        return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def ld_training_detail_fetch(request):
    ''' 
            21-SEP-2018 || JAN || To fetch training detail on changing training
            @param request: Request Object
            @type request : Object
            @return:  return the org unit
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    if current_user_id:
        training_id=request.GET.get('training_id')
        if training_id:
            cur.execute(query.fetch_hcms_query(config.learning_development_module,config.ld_training_detail_fetch).format(training_id))
            training_detail=dictfetchall(cur)
            json_data['training_detail']=training_detail
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)
           
def ld_recommendation_add_update(request):
    ''' 
            21-SEP-2018 || JAN || To add and update training recommendation detail
            @param request: Request Object
            @type request : Object
            @return:  return the org unit
    '''    
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    if current_user_id:
        training_recommendation_id=request.GET.get('recommendation_id')
        training_id=request.GET.get('training_id')
        employee_id=json.loads(request.GET.get('employee_id'))
        division_id=request.GET.get('division_id')
        recommendation_type=request.GET.get('recommendation_type')
        recommended_by=request.GET.get('recommended_by',None)
        if training_id and employee_id and division_id:
            if not training_recommendation_id:
                cur.execute(query.fetch_hcms_query(config.learning_development_module,config.ld_training_recommendation_insert),(recommendation_type,recommended_by,division_id,training_id,current_user_id),)
                recommendation_id=cur.fetchall()
                for i in employee_id:
                    cur.execute(query.fetch_hcms_query(config.learning_development_module,config.ld_training_recommendation_rel_insert),(i,recommendation_id[0][0],current_user_id),)
                if recommendation_id:
                    json_data[config.status] = status_keys.SUCCESS_STATUS
            else:
                cur.execute(query.fetch_hcms_query(config.learning_development_module,config.ld_training_recommendation_update),(recommendation_type,recommended_by,division_id,training_id,current_user_id,training_recommendation_id),)
                cur.execute(query.fetch_hcms_query(config.learning_development_module,config.ld_training_recommendation_rel_delete).format(training_recommendation_id))
                for i in employee_id:
                    cur.execute(query.fetch_hcms_query(config.learning_development_module,config.ld_training_recommendation_rel_insert),(i,training_recommendation_id,current_user_id),)
                json_data[config.status] = status_keys.UPDATE_STATUS
                
        else:
            json_data[config.status]=status_keys.NTE_08
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def ld_training_recommendation_detail_fetch(request):
    ''' 
            22-SEP-2018 || JAN || To retrieve training recommendation detail
            @param request: Request Object
            @type request : Object
            @return:  return the org unit
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    recommend_type=request.GET.get('recommendation_type')
    if current_user_id and recommend_type:
        if recommend_type=='T':
            cur.execute(query.fetch_hcms_query(config.learning_development_module,config.tl_training_recommendation_detail_fetch))
            recommendation_detail=dictfetchall(cur)
            cur.execute(query.fetch_hcms_query(config.learning_development_module,config.tl_training_recommendation_search_detail_fetch))
            search_detail=dictfetchall(cur)
        else:       
            cur.execute(query.fetch_hcms_query(config.learning_development_module,config.ld_training_recommendation_detail_fetch),(recommend_type,),)
            recommendation_detail=dictfetchall(cur)
            cur.execute(query.fetch_hcms_query(config.learning_development_module,config.ld_training_recommendation_search_detail_fetch),(recommend_type,),)
            search_detail=dictfetchall(cur)
    json_data['recommendation_detail']=recommendation_detail
    json_data['search_detail']=search_detail
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def ld_training_recommendation_retrieval(request):
    ''' 
            22-SEP-2018 || JAN || To retrieve training recommendation detail for update
            @param request: Request Object
            @type request : Object
            @return:  return the org unit
    '''
    json_data={}
    current_user_id=request.user.id
    recommendation_id=request.GET.get('recommendation_id',)
    recommendation_type=request.GET.get('recommendation_type')
    cur = db_connection()
    if current_user_id and recommendation_id:
        if recommendation_type:
            cur.execute(query.fetch_hcms_query(config.learning_development_module,config.tl_training_recommendation_detail_fetch_by_id).format(recommendation_id))
            recommendation_detail=dictfetchall(cur)
        else:
            cur.execute(query.fetch_hcms_query(config.learning_development_module,config.ld_training_recommendation_detail_fetch_by_id).format(recommendation_id))
            recommendation_detail=dictfetchall(cur)
        json_data['recommendation_detail']=recommendation_detail
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def ld_training_recommendation_remove(request):
    ''' 
            22-SEP-2018 || JAN || To retrieve training recommendation detail for update
            @param request: Request Object
            @type request : Object
            @return:  return the org unit
    '''
    json_data={}
    current_user_id=request.user.id
    recommendation_id=request.GET.get('recommendation_id',)
    cur = db_connection()
    if current_user_id and recommendation_id:
        cur.execute(query.fetch_hcms_query(config.learning_development_module,config.ld_training_recommendation_detail_remove),(current_user_id,recommendation_id),)
        cur.execute(query.fetch_hcms_query(config.learning_development_module,config.ld_training_recommendation_rel_detail_remove),(current_user_id,recommendation_id),)
        json_data[config.status] = status_keys.REMOVE_STATUS
    else:
        json_data[config.status] = status_keys.FAILURE_STATUS
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def ld_assessment_training_retrieval(request):
    ''' 
            22-SEP-2018 || JAN || To retrieve training recommendation detail from assessments
            @param request: Request Object
            @type request : Object
            @return:  return the org unit
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    cur.execute(query.fetch_hcms_query(config.learning_development_module,config.ld_tl_assessment_training_list))
    assessment_training_detail=dictfetchall(cur)
    json_data['assessment_training_detail']=assessment_training_detail
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def ld_assessment_training_detail_retrieval_id(request):
    ''' 
            09-NOV-2018 || JAN || To retrieve training recommendation detail from assessments by id
            @param request: Request Object
            @type request : Object
            @return:  return the org unit
    '''
    json_data={}
    current_user_id=request.user.id
    training_id=request.GET.get('training_id')
    cur = db_connection()
    cur.execute(query.fetch_hcms_query(config.learning_development_module,config.ld_tl_assessment_training_exist_check).format(training_id),)
    exist_check=dictfetchall(cur)
    print"sssssssssssss",exist_check
    if exist_check:
        cur.execute(query.fetch_hcms_query(config.learning_development_module,config.tl_training_recommendation_detail_fetch_by_id).format(exist_check[0]['id']))
        recommendation_detail=dictfetchall(cur)
        json_data['exist']='true'
        json_data['assessment_employee_detail']=recommendation_detail
    else:    
        cur.execute(query.fetch_hcms_query(config.learning_development_module,config.ld_tl_assessment_training_employee_details).format(training_id),)
        assessment_employee_detail=dictfetchall(cur)
        json_data['exist']='false'
        json_data['assessment_employee_detail']=recommendation_detail
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def tl_recommendation_add_update(request):
    ''' 
            13-NOV-2018 || JAN || To add and update TL training recommendation detail
            @param request: Request Object
            @type request : Object
            @return:  return the org unit
    '''    
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    if current_user_id:
        recommendation_type=request.GET.get('recommendation_type')
        recommendation_id =request.GET.get('recommendation_id')
        training_id=request.GET.get('training_id')
        org_id=request.GET.get('org_id')
        org_unit_id=request.GET.get('org_unit_id')
        employee_id=json.loads(request.GET.get('employee_id'))
        division_ids=json.loads(request.GET.get('division_ids'))
        training_category=request.GET.get('training_category')
        training_type=request.GET.get('training_type')
        training_methodology=request.GET.get('training_methodology')
        recommended_by=request.GET.get('recommended_by')
        start_date=datetime.datetime.strptime(request.GET.get('start_date'), "%d-%m-%Y").strftime("%Y-%m-%d")
        end_date=datetime.datetime.strptime(request.GET.get('end_date'), "%d-%m-%Y").strftime("%Y-%m-%d")
        division_id=','.join(str(x) for x in division_ids)
        print"ddddddddddddd",division_id
        if recommendation_id:
            cur.execute(query.fetch_hcms_query(config.learning_development_module,config.tl_training_recommendation_update),(recommendation_type,training_id,org_id,org_unit_id,division_id,training_category,training_type,training_methodology,recommended_by,start_date,end_date,current_user_id,recommendation_id),)
            cur.execute(query.fetch_hcms_query(config.learning_development_module,config.ld_training_recommendation_rel_delete).format(recommendation_id))
            for i in employee_id:
                cur.execute(query.fetch_hcms_query(config.learning_development_module,config.ld_training_recommendation_rel_insert),(i,recommendation_id,current_user_id),)
            json_data[config.status] = status_keys.UPDATE_STATUS
        else:
            cur.execute(query.fetch_hcms_query(config.learning_development_module,config.tl_training_recommendation_insert),(recommendation_type,training_id,org_id,org_unit_id,division_id,training_category,training_type,training_methodology,recommended_by,start_date,end_date,current_user_id),)
            recommendation=cur.fetchall()
            for i in employee_id:
                cur.execute(query.fetch_hcms_query(config.learning_development_module,config.ld_training_recommendation_rel_insert),(i,recommendation[0][0],current_user_id),)
            json_data[config.status] = status_keys.SUCCESS_STATUS
                
#         else:
#             json_data[config.status]=status_keys.NTE_08
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def tl_recommendation_training_creation(request):
    ''' 
            13-NOV-2018 || JAN || To add and update TL training recommendation detail
            @param request: Request Object
            @type request : Object
            @return:  return the org unit
    '''    
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    if current_user_id:
        training_recommendation_id=request.GET.get('training_id')
        training_name=request.GET.get('training_name')
        training_type=request.GET.get('training_type')
        training_method=request.GET.get('training_method')
        training_category=request.GET.get('training_category')
        training_start_date=request.GET.get('training_start_date')
        training_end_date=request.GET.get('training_end_date')
        division_data=request.GET.get('division')
        division=json.loads(division_data)
        if training_name  and training_type and training_method and training_start_date and training_end_date and division and training_category:
            start_date =datetime.datetime.strptime(training_start_date, "%d-%m-%Y").strftime("%Y-%m-%d")
            end_date =datetime.datetime.strptime(training_end_date, "%d-%m-%Y").strftime("%Y-%m-%d")
            cur.execute(query.fetch_hcms_query(config.learning_development_module,config.ld_tl_recommendation_training_creation),(str(current_user_id),str(training_name),str(start_date),
                              str(end_date),str(training_method),str(training_type),str(training_category)))
            return_data=dictfetchall(cur)
            training_id=return_data[0]['id']
            if training_id:
                for i in division:
                    cur.execute(query.fetch_hcms_query(config.learning_development_module,config.ld_tl_recommendation_training_division_update),(str(current_user_id),str(i),str(training_id)))
                    return_division_data=dictfetchall(cur)
                    division_id=return_division_data[0]['id']
                    if division_id:
                        json_data['status'] = status_keys.SUCCESS_STATUS  
                    else:
                        json_data['status'] = status_keys.FAILURE_STATUS
                cur.execute(query.fetch_hcms_query(config.learning_development_module,config.ld_tl_assessor_detail_update),(str(training_recommendation_id)))
            else:
                json_data['status'] = status_keys.FAILURE_STATUS  
        else:
                json_data['status'] = status_keys.FAILURE_STATUS  
    else:
                json_data['status'] = status_keys.FAILURE_STATUS  
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)