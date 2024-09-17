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
import datetime
logger_obj = logging.getLogger('logit')

def division_training_view(request):
    ''' 
        21-SEP-2018 || ESA || To Fetch the division based training data
        @param request: Request Object
        @type request : Object
        @return:   return the employee details
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    json_data['training_data']=[]
    json_data['training_details']=[]
    json_data['state_details']=[]
    json_data['org_unit_division']=[]
    json_data['employee_data']=[]
    try:
      if current_user_id:
         division_id=request.GET.get("division_id")
         training_id=request.GET.get("training_id")
         country_id=request.GET.get("country_id")
         org_unit_id=request.GET.get("str_org_unit_id")
         str_org_id=request.GET.get("str_org_id")
         if org_unit_id and str_org_id:
            cur.execute(query.fetch_hcms_query(config.learning_development_module,config.fetch_org_unit_division_details),(str(str_org_id),str(org_unit_id),))
            department_data = dictfetchall(cur)
            cur.execute(query.fetch_hcms_query(config.learning_development_module,config.fetch_org_unit_employee_details).format(str_org_id,org_unit_id))
            emp_data = dictfetchall(cur)
            json_data['org_unit_division']=department_data
            json_data['employee_data']=emp_data
         if division_id:
            cur.execute(query.fetch_hcms_query(config.learning_development_module,config.fetch_division_training_details).format(division_id))
            training_data = dictfetchall(cur)
            json_data['training_details']=training_data
         if training_id:
            cur.execute(query.fetch_hcms_query(config.learning_development_module,config.internship_training_details).format(training_id))
            training_data = dictfetchall(cur)
            json_data['training_data']=training_data
         if country_id:
             cur.execute(query.fetch_hcms_query(config.learning_development_module,config.internship_state_details).format(country_id))
             state_data = dictfetchall(cur)
             json_data['state_details']=state_data
    except Exception as e:    
        result = e
        json_data['training_data']=[]
        json_data['training_details']=[]
        json_data['state_details']=[]
        logger_obj.info("division Unit based training details exception as"+ str(result) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def internship_form_save(request):
    ''' 
            24-SEP-2018 || ESA || To save internship form data
            @param request: Request Object
            @type request : Object
            @return:  return the success message for save
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    try:
        if current_user_id:
            candidate_name=request.POST.get('candidate_name')
            institute_name=request.POST.get('institute_name')
            degree=request.POST.get('degree')
            year_of_passing=request.POST.get('year_of_passing')
            address=request.POST.get('address')
            zip=request.POST.get('zip')
            training_name=request.POST.get('training_name')
            country=request.POST.get('country')
            state=request.POST.get('state')
            division=request.POST.get('division')
            training_authority=request.POST.get('training_authority')
            update_id=request.POST.get('update_id')
            if candidate_name and institute_name and degree and year_of_passing and address and zip and training_name and country and state and division and training_authority:
               if update_id:
                   cur.execute("""update hcms_ld_internship_training set candidate_name = %s,institute_name = %s,
                         degree=%s,passed_out_year=%s,address=%s,zip_code=%s,training_id=%s,country_id=%s,state_id=%s,division_id=%s,reporting_authority_id=%s,is_active=%s,modified_by_id=%s,modified_date=now()  where id=%s returning id""",
                        (candidate_name,institute_name,degree,year_of_passing,address,zip,training_name,country,state,division,training_authority,True,current_user_id,update_id))
                   return_data=dictfetchall(cur)  
                   if return_data:
                       json_data['status'] = status_keys.UPDATE_STATUS  
               else:
                   cur.execute(query.fetch_hcms_query(config.learning_development_module,config.internship_form_save),(str(current_user_id),str(candidate_name),str(institute_name),str(degree),
                    str(year_of_passing),str(address),str(zip),str(training_name),str(country),str(state),str(division),str(training_authority),False,'TRUE'))
                   return_data=dictfetchall(cur)
                   if return_data:
                      json_data['status'] = status_keys.SUCCESS_STATUS  
            else:
                json_data['status']=status_keys.FAILURE_STATUS
        else:
            json_data['status']='001'
    except Exception as e:    
        result=e
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)    

def internship_details_view(request):
    ''' 
            24-SEP-2018 || ESA || To view internship details
            @param request: Request Object
            @type request : Object
            @return:  return the success message for save
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    json_data['internship_details']=[]
    json_data['selected_internship_details']=[]
    try:
        if current_user_id: 
           selected_id=request.GET.get('selected_id')
           if selected_id:
               cur.execute(query.fetch_hcms_query(config.learning_development_module,config.selected_internship_details).format(selected_id))
               internship_details=dictfetchall(cur)
               json_data['selected_internship_details']=internship_details
           else:
               cur.execute(query.fetch_hcms_query(config.learning_development_module,config.internship_details))
               internship_details=dictfetchall(cur)
               json_data['internship_details']=internship_details
    except Exception as e:
            json_data['internship_details']=[]
            json_data['selected_internship_details']=[]
            logger_obj.info("Learning & development-internship_details view data exception"+ str(e) +" attempted by "+str(request.user.username))    
    cur.close()   
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value) 

def internship_form_delete(request):
    ''' 
                24-SEP-2018 || ESA || To remove internship details
                @param request: Request Object
                @type request : Object
                @return:  return the success message for save
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    try:
        if current_user_id: 
           remove_id=request.GET.get('remove_id')
           selected_id=request.GET.get('selected_id')
           if remove_id:
               cur.execute(query.fetch_hcms_query(config.learning_development_module,config.internship_form_remove).format(current_user_id,remove_id))
               json_data['status']=status_keys.REMOVE_STATUS
           if selected_id:
               cur.execute(query.fetch_hcms_query(config.learning_development_module,config.convert_to_employee),(str(current_user_id),str(selected_id)))
               json_data['status']='NTE_001'
    except Exception as e:
            json_data[config.exception] = e
            logger_obj.info("Learning & development-Training remove  view data exception"+ str(e) +" attempted by "+str(request.user.username))    
    cur.close()   
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)