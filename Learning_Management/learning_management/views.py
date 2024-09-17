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
from itertools import groupby
from operator import itemgetter
logger_obj = logging.getLogger('logit')

class HCMSTraining_creation(TemplateView):  #Added- ESA-20SEP2018
    ''' 
    20-SEP-2018 || ESA || To HCMS Learning  & development training creation form page loaded.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
        
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HCMSTraining_creation, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Training Creation', self.request.user.id)
        if macl:
            template_name = config.training_creation_template
        else:
            template_name = "tags/access_denied.html"
        return [template_name] 
    
    def get(self, request, *args, **kwargs):
        cur=connection.cursor() 
        context = super(HCMSTraining_creation, self).get_context_data(**kwargs)
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
            logger_obj.info("Learning & development form Page Load  attempted by "+str(request.user.username))    
        except Exception as e:
            context[config.exception] = e
            logger_obj.info("Learning & development form Load data exception"+ str(e) +" attempted by "+str(request.user.username))    
        cur.close()    
        return self.render_to_response(context)

class HCMSInternship(TemplateView):  #Added- ESA-20SEP2018
    ''' 
    20-SEP-2018 || ESA || To HCMS Learning  & development Internship creation form page loaded.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HCMSInternship, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Internship Training', self.request.user.id)
        if macl:
           template_name = config.interrnship_template
        else:
            template_name = config.tags_access_denied_html
        return [template_name] 
    
    def get(self, request, *args, **kwargs):
        cur=connection.cursor() 
        context = super(HCMSInternship, self).get_context_data(**kwargs)
        try:
            cur.execute(query.fetch_hcms_query(config.learning_development_module,config.fetch_organization_details_view))
            org_info=dictfetchall(cur)
            cur.execute(query.fetch_hcms_query(config.learning_development_module,config.fetch_country_details_view))
            country_info=dictfetchall(cur)
            context[config.organization]=org_info
            context['country']=country_info
            logger_obj.info("Learning & development Internship form Page Load  attempted by "+str(request.user.username))    
        except Exception as e:
            context[config.exception] = e
            logger_obj.info("Learning & development Internship  form Load data exception"+ str(e) +" attempted by "+str(request.user.username))    
        cur.close()    
        return self.render_to_response(context)
    
class HCMSLearning_development_dashboard(TemplateView):  #Added- ESA-25SEP2018
    ''' 
    25-SEP-2018 || ESA || To HCMS Learning  & development dashboard page loaded.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    template_name = config.training_dashboard_template
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HCMSLearning_development_dashboard, self).dispatch(request, *args, **kwargs)
    
#     def get_template_names(self):
#         macl = menu_access_control(config.learning_developemnt, self.request.user.id)
#         if macl:
#            template_name = config.training_dashboard_template
#         else:
#             template_name = config.tags_access_denied_html
#         return [template_name] 
    
    def get(self, request, *args, **kwargs):
        cur=connection.cursor() 
        context = super(HCMSLearning_development_dashboard, self).get_context_data(**kwargs)
        try:
            cur.execute(query.fetch_hcms_query(config.learning_development_module,config.fetch_organization_details_view))
            org_info=dictfetchall(cur)
            context[config.organization]=org_info
            logger_obj.info("Learning & development Dashboard form Page Load  attempted by "+str(request.user.username))    
        except Exception as e:
            context[config.exception] = e
            logger_obj.info("Learning & development Dashboard  form Load data exception"+ str(e) +" attempted by "+str(request.user.username))    
        cur.close()    
        return self.render_to_response(context)


def training_dashboard_view(request):
    ''' 
                20-SEP-2018 || ESA || To view training dashboard view
                @param request: Request Object
                @type request : Object
                @return:  return the success message for save
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    json_data['training_details']=[]
    json_data['training_count']=[]
    json_data['cost_details']=[]
    json_data['rec_emp_details']=[]
    json_data['top_rec_person']=[]
    json_data['self_request']=[]
    json_data['gant_chart']=[]
    try:
        if current_user_id: 
           division_id=request.GET.get("division_id")
           if division_id:
               cur.execute(query.fetch_hcms_query(config.learning_development_module,config.calander_training_details).format(division_id))
               training_details=dictfetchall(cur)
               json_data['training_details']=training_details
               cur.execute(query.fetch_hcms_query(config.learning_development_module,config.cost_details).format(division_id))
               cost_details=dictfetchall(cur)
               json_data['cost_details']=cost_details
               cur.execute(query.fetch_hcms_query(config.learning_development_module,config.rec_emp_details).format(division_id))
               rec_emp_details=dictfetchall(cur)
               json_data['rec_emp_details']=rec_emp_details
               cur.execute(query.fetch_hcms_query(config.learning_development_module,config.top_rec_person).format(division_id))
               top_rec_person=dictfetchall(cur)
               json_data['top_rec_person']=top_rec_person
               cur.execute(query.fetch_hcms_query(config.learning_development_module,config.self_request).format(division_id))
               top_rec_person=dictfetchall(cur)
               json_data['self_request']=top_rec_person
               cur.execute(query.fetch_hcms_query(config.learning_development_module,config.gant_chart).format(division_id))
               gant_chart_data=dictfetchall(cur)
               main_list=[]
               if gant_chart_data:
                    getState1 = itemgetter('start_month')
                    for key, group in groupby(gant_chart_data, getState1):
                         main_dict={}
                         gant_chart_list=[]
                         for record in group:
                              gant_chart_dict={}
                              gant_chart_dict['task']=record['training_name']
                              gant_chart_dict['start']=record['start_date']
                              gant_chart_dict['end']=record['end_date']
                              gant_chart_list.append(gant_chart_dict)
                              main_dict['category']=''
                              main_dict['segments']=gant_chart_list
                         main_list.append(main_dict)
                    json_data['gant_chart']=main_list
#                cur.execute(query.fetch_hcms_query(config.learning_development_module,config.calander_training_details_count))
#                training_details=dictfetchall(cur)
#                training_count=dictfetchall(cur)
#                json_data['training_count']=training_count
    except Exception as e:
            json_data['training_details']=[]
            logger_obj.info("Learning & development-Training dashboard  view data exception"+ str(e) +" attempted by "+str(request.user.username))    
    cur.close()   
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def current_user_details(request):
    ''' 
            20-SEP-2018 || ESA || To view training dashboard view
            @param request: Request Object
            @type request : Object
            @return:  return the success message for save
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    json_data['user_detaills']=[]
    try:
        if current_user_id: 
               cur.execute(query.fetch_hcms_query(config.learning_development_module,config.current_user_detaills).format(current_user_id))
               user_detaills=dictfetchall(cur)
               json_data['user_detaills']=user_detaills
    except Exception as e:
            json_data['user_detaills']=[]
            logger_obj.info("Learning & development-Training dashboard  view data exception"+ str(e) +" attempted by "+str(request.user.username))    
    cur.close()   
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)