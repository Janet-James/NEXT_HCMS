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

def training_creation_form_save(request):
    ''' 
                20-SEP-2018 || ESA || To save training details form data
                @param request: Request Object
                @type request : Object
                @return:  return the success message for save
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    try:
        if current_user_id:
           training_name=request.POST.get('training_name')
           description=request.POST.get('description')
           training_type=request.POST.get('training_type')
           training_method=request.POST.get('training_method')
           training_category=request.POST.get('training_category')
           training_start_date=request.POST.get('training_start_date')
           training_end_date=request.POST.get('training_end_date')
           update_id=request.POST.get('update_id')
           division_data=request.POST.get('division')
           division=json.loads(division_data)
           document_id=request.POST.get('file_id')
           if document_id>'0':
               attachment_ids=document_id
           else :
               attachment_ids=None
           if training_name  and training_type and training_method and training_start_date and training_end_date and division and training_category:
              start_date =datetime.datetime.strptime(training_start_date, "%d-%m-%Y").strftime("%Y-%m-%d")
              end_date =datetime.datetime.strptime(training_end_date, "%d-%m-%Y").strftime("%Y-%m-%d")
              if update_id:
                 cur.execute("""update hcms_ld_training_detail set training_name = %s,description = %s,
                         start_date=%s,end_date=%s,training_methodology_id=%s,training_type_id=%s,training_category_id=%s,attachment_id=%s,is_active=%s,modified_by_id=%s,modified_date=now()  where id=%s returning id""",
                        (training_name,description,start_date,end_date,training_method,training_type,training_category,attachment_ids,True,current_user_id,update_id))
                 return_data=dictfetchall(cur)  
                 update_training_id=return_data[0]['id']
                 if update_training_id:
                     cur.execute(query.fetch_hcms_query(config.learning_development_module,config.training_division_delete).format(update_training_id))
                     for i in division:
                        cur.execute(query.fetch_hcms_query(config.learning_development_module,config.training_division_save),(str(current_user_id),str(i),str(update_training_id),'TRUE'))
                     return_division_data=dictfetchall(cur)
                     division_id=return_division_data[0]['id']
                     if division_id:
                          json_data['status'] = status_keys.UPDATE_STATUS  
                     else:
                          json_data['status'] = status_keys.FAILURE_STATUS
                 else:
                     json_data['status'] = status_keys.FAILURE_STATUS
              else:
                  cur.execute(query.fetch_hcms_query(config.learning_development_module,config.training_creation_save),(str(current_user_id),str(training_name),str(description),str(start_date),
                              str(end_date),str(training_method),str(training_type),str(training_category),attachment_ids,'TRUE'))
                  return_data=dictfetchall(cur)
                  training_id=return_data[0]['id']
                  if training_id:
                      for i in division:
                          cur.execute(query.fetch_hcms_query(config.learning_development_module,config.training_division_save),(str(current_user_id),str(i),str(training_id),'TRUE'))
                      return_division_data=dictfetchall(cur)
                      division_id=return_division_data[0]['id']
                      if division_id:
                         json_data['status'] = status_keys.SUCCESS_STATUS  
                      else:
                          json_data['status'] = status_keys.FAILURE_STATUS
                  else:
                     json_data['status'] = status_keys.FAILURE_STATUS  
        else:
            json_data['status'] ='001'
    except Exception as e:
            logger_obj.info("Learning & development-Training creation form Load data exception"+ str(e) +" attempted by "+str(request.user.username))    
    cur.close()   
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)       

def training_details_view(request):
    ''' 
            20-SEP-2018 || ESA || To view training details
            @param request: Request Object
            @type request : Object
            @return:  return the success message for save
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    try:
        if current_user_id: 
           cur.execute(query.fetch_hcms_query(config.learning_development_module,config.training_fetch_training_details))
           training_details=dictfetchall(cur)
           json_data['training_details']=training_details
    except Exception as e:
            json_data['training_details']=[]
            logger_obj.info("Learning & development-Training creation  view data exception"+ str(e) +" attempted by "+str(request.user.username))    
    cur.close()   
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def training_form_delete(request):
    ''' 
            20-SEP-2018 || ESA || To remove training details
            @param request: Request Object
            @type request : Object
            @return:  return the success message for save
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    try:
        if current_user_id: 
           remove_id=request.POST.get('remove_id')
           file_id=request.POST.get('exsist_attach_id')
           if remove_id:
               cur.execute(query.fetch_hcms_query(config.learning_development_module,config.training_detail_usage_check).format(remove_id))
               training_details=dictfetchall(cur)
               if training_details:
                    json_data[config.status] = status_keys.ERR0028
               else:
                    cur.execute(query.fetch_hcms_query(config.learning_development_module,config.training_form_remove),(str(current_user_id),str(remove_id)))
                    cur.execute(query.fetch_hcms_query(config.learning_development_module,config.training_division_remove),(str(current_user_id),str(remove_id)))
                    if file_id:
                       cur.execute(query.fetch_hcms_query(config.learning_development_module,config.training_attachment_remove),(str(current_user_id),str(file_id)))
                    json_data[config.status]=status_keys.REMOVE_STATUS
    except Exception as e:
            json_data[config.exception] = e
            logger_obj.info("Learning & development-Training remove  view data exception"+ str(e) +" attempted by "+str(request.user.username))    
    cur.close()   
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def selected_training_details(request):
    ''' 
                21-SEP-2018 || ESA || To view selected training details
                @param request: Request Object
                @type request : Object
                @return:  return the success message for save
    '''
    json_data={}
    json_data['attachment_info']=[]
    json_data['selected_training_details']=[]
    json_data['org_details']=[]
    current_user_id=request.user.id
    cur = db_connection()
    try:
        if current_user_id: 
           selected_id=request.GET.get('selected_id')
           if selected_id!='':
               cur.execute(query.fetch_hcms_query(config.learning_development_module,config.selected_training_details).format(selected_id))
               training_details=dictfetchall(cur)
               if training_details:
                   attachment_id=training_details[0]['attachment_id']
                   if attachment_id:
                       cur.execute(query.fetch_hcms_query(config.learning_development_module,config.selected_training_attachment_details).format(attachment_id))
                       attachment_details=dictfetchall(cur)
                       if attachment_details:
                           json_data['attachment_info']=attachment_details
               cur.execute(query.fetch_hcms_query(config.learning_development_module,config.division_org_fetch).format(selected_id))
               org_details=dictfetchall(cur)
               json_data['selected_training_details']=training_details
               json_data['org_details']=org_details
           else:
               json_data['selected_training_details']=[]  
               json_data['org_details']=[]
               json_data['attachment_info']=[]
        else:
            json_data['selected_training_details']=[] 
            json_data['org_details']=[]
            json_data['attachment_info']=[]
    except Exception as e:
            logger_obj.info("Learning & development-Training creation  view data exception"+ str(e) +" attempted by "+str(request.user.username))    
    cur.close()   
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def training_file_delete(request):
    ''' 
            22-SEP-2018 || ESA || To remove training file details
            @param request: Request Object
            @type request : Object
            @return:  return the success message for save
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    try:
        if current_user_id: 
           file_id=request.POST.get('file_remove_id')
           if file_id:
               cur.execute(query.fetch_hcms_query(config.learning_development_module,config.training_attachment_remove),(str(current_user_id),str(file_id)))
               json_data['status']=status_keys.REMOVE_STATUS
           else:
                json_data['status']=status_keys.FAILURE_STATUS
    except Exception as e:
            json_data[config.exception] = e
            logger_obj.info("Learning & development-Training remove  view data exception"+ str(e) +" attempted by "+str(request.user.username))    
    cur.close()   
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)