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
import config
from CommonLib.lib import *
from datetime import datetime, date, time
# for decoder function
from django.core import serializers
from django.core.serializers.json import DjangoJSONEncoder
from django.views.decorators.csrf import csrf_protect
import HCMS.settings as status_keys
import logging
import logging.handlers
from CommonLib.hcms_common import record_validation,refitem_fetch
logger_obj = logging.getLogger('logit')
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.conf import settings
import os
import base64
import random
from wsgiref.util import FileWrapper
from django.utils.encoding import smart_str


# HCMS Incident details  
class HCMSdetailsRecordingView(TemplateView):  #Added- Esakkiprem-03-04-2018
    ''' 
    03-April-2018 || ESA || To HCMS details recording form page loaded.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
     
    template_name = "incident_management/details_recording.html"
     
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HCMSdetailsRecordingView, self).dispatch(request, *args, **kwargs)
    
    def get(self, request, *args, **kwargs):
        context = super(HCMSdetailsRecordingView, self).get_context_data(**kwargs)
        cur = db_connection()
        incident_type = refitem_fetch("INCTY")
        incident_sev = refitem_fetch("ISVTY")
        incident_cat = refitem_fetch("INCCT")
        mode = refitem_fetch("RPMOD")
        injury_type = refitem_fetch("INJTY")
        illness_type = refitem_fetch("ILLTY")
        part_of_body_type = refitem_fetch("BODTY")
        laterality_type = refitem_fetch("LATTY")
        currency = refitem_fetch("CUREN")
        context['incident_type']=incident_type
        context['incident_sev']=incident_sev
        context['incident_cat']=incident_cat
        context['mode']=mode
        context['currency']=currency
        context['injury_type']=injury_type
        context['illness_type']=illness_type
        context['part_of_body_type']=part_of_body_type
        context['laterality_type']=laterality_type
        return self.render_to_response(context)
    
def details_save(request):
    ''' 
            04-APR-2018 || ESA || To save incident details.
            @param request: Request Object
            @type request : Object
            @return:  return the success message for save
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    try:
        if current_user_id:
            details_subject=request.POST.get('details_subject')
            incident_date=request.POST.get('incident_date')
            details_description=request.POST.get('details_description')
            incident_type=request.POST.get('incident_type')
            incident_severity_type=request.POST.get('incident_severity_type')
            details_location=request.POST.get('details_location')
            category=request.POST.get('category')
            trigger_info=request.POST.get('trigger_info')
            reported_by=request.POST.get('reported_by')
            mode=request.POST.get('mode')
            victrim_id=request.POST.get('victrim_id')
            witness_id=request.POST.get('witness_id')
            prepetrator_id=request.POST.get('prepetrator_id')
            risk_details=request.POST.get('risk_details')
            status=request.POST.get('status')
            victrim_data = json.loads(victrim_id)
            witness_data = json.loads(witness_id)
            prepetrator_data = json.loads(prepetrator_id)
            content=request.POST.get("file")
            file_list=json.loads(content)
            if mode=='0':
               mode=None
            if trigger_info=='':
                trigger_info=None
            if risk_details=='':
                risk_details=None
            if details_subject and incident_date and details_description and incident_type and incident_severity_type and details_location and reported_by and prepetrator_data is not None and victrim_data is not None:
                cur.execute(query.fetch_hcms_query(config.detail_recording_module,config.details_save),(details_subject,incident_date,
                details_description,incident_type,incident_severity_type,details_location,category,trigger_info,reported_by,mode,risk_details,True,current_user_id,status),)
                return_data=dictfetchall(cur)
                if return_data:
                   record_id=return_data[0]['id']
                   incident_code='INC'+str(record_id)
                   cur.execute("""update hcms_im_incident_record set incident_code=%s where id=%s""",(str(incident_code),str(record_id),))
                   if victrim_data is not None and prepetrator_data is not None:
                      for i in victrim_data:
                        cur.execute(query.fetch_hcms_query(config.detail_recording_module,config.involver_partie_save),(record_id,i,'victim',current_user_id,True),)
                      for j in prepetrator_data:
                          cur.execute(query.fetch_hcms_query(config.detail_recording_module,config.involver_partie_save),(record_id,j,'perpetrator',current_user_id,True),)
                   if witness_data is not None:
                      for k in witness_data:
                         cur.execute(query.fetch_hcms_query(config.detail_recording_module,config.involver_partie_save),(record_id,k,'witness',current_user_id,True),) 
                   json_data['status']=status_keys.SUCCESS_STATUS
                   if file_list:
                      for data in file_list:
                        file_name =str(record_id)+'_'+data['name']
                        file_exsist=os.path.isfile(settings.MEDIA_ROOT+file_name)
                        if file_exsist is True:
                           pre_num=random.randint(1,101)
                           file_name=str(record_id)+'('+pre_num+')'+'_'+data['name']
                        file_type = data['format']
                        file_binary = str(data['encode'].split(',')[0].decode('base64')) 
                        upload_dir = default_storage.save(
                        file_name, ContentFile(file_binary))
                        path=os.path.join(settings.MEDIA_ROOT, upload_dir)
                        file_save=os.path.isfile(path)
                        if file_save is True:
                            cur.execute(query.fetch_hcms_query(config.detail_recording_module,config.file_details),(record_id,file_name,path,file_type,current_user_id,True,'incident'),)
                        else:
                           json_data['status']='NTE_doc'
                else:
                    json_data['status']=status_keys.FAILURE_STATUS
            else:
                json_data['status']='NTE_00'
        else:
            json_data['status']='NTE_01'
    except Exception as e:
        json_data['status'] = e
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

@csrf_exempt       
def kamban_view(request):
    ''' 
            05-APR-2018 || ESA || For kamban view
            @param request: Request Object
            @type request : Object
            @return:  return the success message for view
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    try:
        if current_user_id:
           cur.execute(query.fetch_hcms_query(config.detail_recording_module,config.kamban_view))
           data=dictfetchall(cur)
           if data:
              json_data['data']=data
           else:
               json_data['data']=[] 
        else:
           json_data['data']=[] 
    except Exception as e:
        json_data['status'] = e
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def state_change(request):
    ''' 
            05-APR-2018 || ESA || For state change view
            @param request: Request Object
            @type request : Object
            @return:  return the success message for state change
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    try:
        if current_user_id:
          record_id=request.POST.get('id')
          stage=request.POST.get('stage')
          if record_id !=''and stage!='' and record_id is not None and stage is not None:
             cur.execute(query.fetch_hcms_query(config.detail_recording_module,config.stage_update),(str(stage),current_user_id,record_id),)
             json_data['status']=status_keys.UPDATE_STATUS
          else:
             json_data['status']=status_keys.FAILURE_STATUS
        else:
            json_data['status']='NTE_01'
    except Exception as e:
        json_data['status'] = e
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def details_view(request):
    ''' 
            05-APR-2018 || ESA || For accordtion details view
            @param request: Request Object
            @type request : Object
            @return:  return the data
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    try:
        if current_user_id:
          record_id=request.POST.get('id') 
          cur.execute(query.fetch_hcms_query(config.detail_recording_module,config.acc_details_view),(record_id,))
          record_data=dictfetchall(cur)
          if record_data:
              json_data['record_data']=record_data
              if record_data:
                cur.execute(query.fetch_hcms_query(config.detail_recording_module,config.involved_person),(record_id,))
                data=dictfetchall(cur)
                if data:
                     json_data['involved_data']=data
                else:
                    json_data['involved_data']=[]
                if record_data[0]['mode']:
                    mode_id=record_data[0]['mode']
                    cur.execute('select id, refitems_name from reference_items where is_active=True and id='+str(mode_id),)
                    mode_list=dictfetchall(cur)
                    if mode_list:
                        json_data['mode_data']=mode_list
                    else:
                        json_data['mode_data']=[]
                cur.execute('select id,name,path,incident_detail_record_id from hcms_im_incident_evidence_attachments where is_active=True  and incident_detail_record_id='+str(record_id),)
                file_data=dictfetchall(cur)
                if file_data:
                    json_data['file_data']=file_data
                else:
                     json_data['file_data']=[]
          else:
              json_data['involved_data']=[]
              json_data['record_data']=[]
              json_data['mode_data']=[]
              json_data['file_data']=[]
        else:
            json_data['status']='NTE_01'
            json_data['record_data']=[]
            json_data['involved_data']=[]
            json_data['mode_data']=[]
            json_data['file_data']=[]
    except Exception as e:
        json_data['status'] = e
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def employee_name(request):
    ''' 
            05-APR-2018 || ESA || For accordtion details view
            @param request: Request Object
            @type request : Object
            @return:  return the data
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    try:
        if current_user_id:
          employee_id=request.POST.get('id')
          victrim_data = json.loads(employee_id)
          if victrim_data:
              cur.execute("""select id,name from employee_info where id in %s and is_active='True'""",(tuple(victrim_data),))
              employe_data=dictfetchall(cur)
              if employe_data:
                  json_data['data']=[employe_data]
    except Exception as e:
        json_data['status'] = e
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def details_update(request):
    ''' 
            04-APR-2018 || ESA || To save incident details.
            @param request: Request Object
            @type request : Object
            @return:  return the success message for save
    '''
    json_data={}
    current_user_id=request.user.id
    try:
        cur = db_connection()
        if current_user_id:
            details_subject=request.POST.get('details_subject')
            incident_date=request.POST.get('incident_date')
            details_description=request.POST.get('details_description')
            incident_type=request.POST.get('incident_type')
            incident_severity_type=request.POST.get('incident_severity_type')
            details_location=request.POST.get('details_location')
            category=request.POST.get('category')
            trigger_info=request.POST.get('trigger_info')
            reported_by=request.POST.get('reported_by')
            mode=request.POST.get('mode')
            victrim_id=request.POST.get('victrim_id')
            witness_id=request.POST.get('witness_id')
            prepetrator_id=request.POST.get('prepetrator_id')
            risk_details=request.POST.get('risk_details')
            status=request.POST.get('status')
            victrim_data = json.loads(victrim_id)
            witness_data = json.loads(witness_id)
            prepetrator_data = json.loads(prepetrator_id)
            content=request.POST.get("file")
            record_id=request.POST.get("update_id")
            file_list=json.loads(content)
            remove_file_id=request.POST.get("remove_file")
            remove_file_list=json.loads(remove_file_id)
            if mode=='0':
               mode=None
            if trigger_info=='':
                trigger_info=None
            if risk_details=='':
                risk_details=None
            if details_subject and incident_date and details_description and incident_type and incident_severity_type and details_location and reported_by and prepetrator_data is not None and victrim_data is not None:
                cur.execute(query.fetch_hcms_query(config.detail_recording_module,config.details_update),(details_subject,incident_date,
                details_description,incident_type,incident_severity_type,details_location,category,trigger_info,reported_by,mode,risk_details,True,current_user_id,status,record_id),)
                cur.execute("delete  from hcms_im_incident_involved_parties where incident_detail_record_id="+record_id)
                if victrim_data is not None and prepetrator_data is not None:
                      for i in victrim_data:
                        cur.execute(query.fetch_hcms_query(config.detail_recording_module,config.involver_partie_save),(record_id,i,'victim',current_user_id,True),)
                      for j in prepetrator_data:
                          cur.execute(query.fetch_hcms_query(config.detail_recording_module,config.involver_partie_save),(record_id,j,'perpetrator',current_user_id,True),)
                if witness_data is not None:
                      for k in witness_data:
                         cur.execute(query.fetch_hcms_query(config.detail_recording_module,config.involver_partie_save),(record_id,k,'witness',current_user_id,True),) 
                if remove_file_list:
                    cur.execute(query.fetch_hcms_query(config.detail_recording_module,config.remove_file),(current_user_id,record_id,tuple(remove_file_list),))
                json_data['status']=status_keys.UPDATE_STATUS
                if file_list:
                      for data in file_list:
                        file_name =str(record_id)+'_'+data['name']
                        file_exsist=os.path.isfile(settings.MEDIA_ROOT+file_name)
                        if file_exsist is True:
                           pre_num=random.randint(1,101)
                           file_name=str(record_id)+'('+pre_num+')'+'_'+data['name']
                        file_type = data['format']
                        file_binary = str(data['encode'].split(',')[0].decode('base64')) 
                        upload_dir = default_storage.save(
                        file_name, ContentFile(file_binary))
                        path=os.path.join(settings.MEDIA_ROOT, upload_dir)
                        file_save=os.path.isfile(path)
                        if file_save is True:
                            cur.execute(query.fetch_hcms_query(config.detail_recording_module,config.file_details),(record_id,file_name,path,file_type,current_user_id,True,'incident'),)
                        else:
                           json_data['status']='NTE_doc'
            else:
               json_data['status']=status_keys.FAILURE_STATUS
        else:
            json_data['status']='NTE_01'
    except Exception as e:
        json_data['status'] = e
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)  

def details_remove(request):
    ''' 
            09-APR-2018 || ESA || For remove
            @param request: Request Object
            @type request : Object
            @return:  return the success data
    '''
    json_data={}
    current_user_id=request.user.id
    try:
        cur = db_connection()
        if current_user_id:
          remove_record_id=request.POST.get('record_remove_id')
          if remove_record_id:
             cur.execute(query.fetch_hcms_query(config.detail_recording_module,config.record_remove_stage_change),(current_user_id,remove_record_id,))
             cur.execute(query.fetch_hcms_query(config.detail_recording_module,config.involed_remove_stage_change),(current_user_id,remove_record_id,))
             cur.execute(query.fetch_hcms_query(config.detail_recording_module,config.remove_stage_change),(current_user_id,remove_record_id,))
             json_data['status']=status_keys.REMOVE_STATUS
          else:
             json_data['status']=status_keys.FAILURE_STATUS
        else:
             json_data['status']='NTE_01'
    except Exception as e:
        json_data['status'] = e         
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def injury_details_save(request):
    ''' 
            09-APR-2018 || SND || To save injury details.
            @param request: Request Object
            @type request : Object
            @return:  return the success message for save
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    if current_user_id:
        incident_record_id = request.POST.get(config.record_id)
        injury_type = request.POST.get(config.injury_type)
        illness_type = request.POST.get(config.illness_type)
        part_of_body_type = request.POST.get(config.part_of_body_type)
        laterality_type = request.POST.get(config.laterality_type)
        treatment = request.POST.get(config.treatment)
        notes = request.POST.get(config.notes)
        words = treatment.replace('[',"'[")
        finalword = words.replace(']',"]'")
        if notes == config.zero or notes == None or notes == config.empty:
            notes = config.null
        if injury_type and illness_type and part_of_body_type and laterality_type and treatment and incident_record_id:
            cur.execute(query.fetch_hcms_query(config.detail_recording_module,config.injury_details_save)
                .format(injury_type,part_of_body_type,laterality_type,illness_type,finalword,notes,incident_record_id,True,current_user_id,datetime.now()))
            return_data=dictfetchall(cur)
            if return_data:
                json_data[config.status]=status_keys.SUCCESS_STATUS
            else:
                json_data[config.status]=status_keys.FAILURE_STATUS
        else:
           json_data[config.status]=status_keys.FAILURE_STATUS
    else:
        json_data[config.status]=status_keys.FAILURE_STATUS
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)  


def injury_details_update(request):
    ''' 
            09-APR-2018 || SND || To update injury details.
            @param request: Request Object
            @type request : Object
            @return:  return the success message for update
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    if current_user_id:
        incident_record_id = request.POST.get(config.record_id)
        injury_type = request.POST.get(config.injury_type)
        illness_type = request.POST.get(config.illness_type)
        part_of_body_type = request.POST.get(config.part_of_body_type)
        laterality_type = request.POST.get(config.laterality_type)
        treatment = request.POST.get(config.treatment)
        notes = request.POST.get(config.notes)
        words = treatment.replace('[',"'[")
        finalword = words.replace(']',"]'")
        if notes == config.zero or notes == None or notes == config.empty:
            notes = config.null
        if injury_type and illness_type and part_of_body_type and laterality_type and treatment and incident_record_id:
            cur.execute(query.fetch_hcms_query(config.detail_recording_module,config.injury_details_update)
                .format(injury_type,part_of_body_type,laterality_type,illness_type,finalword,notes,True,current_user_id,datetime.now(),incident_record_id))
            return_data=dictfetchall(cur)
            if return_data:
                json_data[config.status]=status_keys.UPDATE_STATUS
            else:
                json_data[config.status]=status_keys.FAILURE_STATUS
        else:
           json_data[config.status]=status_keys.FAILURE_STATUS
    else:
        json_data[config.status]=status_keys.FAILURE_STATUS
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)  

def injury_details_remove(request):
    ''' 
            09-APR-2018 || SND || To remove injury details.
            @param request: Request Object
            @type request : Object
            @return:  return the success message for remove
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    if current_user_id:
      incident_record_id = request.POST.get(config.record_id)
      if incident_detail_record_id:
        cur.execute(query.fetch_hcms_query(config.detail_recording_module,config.injury_details_delete).format(incident_detail_record_id))
        json_data[config.status]=status_keys.REMOVE_STATUS
      else:
        json_data[config.status]=status_keys.FAILURE_STATUS
    else:
        json_data[config.status]=status_keys.FAILURE_STATUS
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def injury_details_view(request):
    ''' 
            10-APR-2018 || SND || To view injury details.
            @param request: Request Object
            @type request : Object
            @return:  return the success message for view
    '''
    json_data={}
    current_user_id = request.user.id
    cur = db_connection()
    if current_user_id:
      incident_record_id = request.POST.get(config.record_id)
      if incident_detail_record_id:
        cur.execute(query.fetch_hcms_query(config.detail_recording_module,config.injury_details_view).format(incident_detail_record_id))
        injury_details_data = dictfetchall(cur)
        json_data[config.injury_details_data] = injury_details_data
        json_data[config.status] = status_keys.SUCCESS_STATUS
      else:
        json_data[config.injury_details_data] = []
        json_data[config.status] = status_keys.FAILURE_STATUS
    else:
        json_data[config.status] = status_keys.FAILURE_STATUS
        json_data[config.injury_details_data] = []
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def investigation_save(request):
    ''' 
                09-APR-2018 || ESA || To save investigation details.
                @param request: Request Object
                @type request : Object
                @return:  return the success message for save
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    try:
      if current_user_id:
        employee_id=request.POST.get('employee_id')
        record_id=request.POST.get('id')
        employee_list=json.loads(employee_id)
        table_dict=request.POST.get('table_dict')
        table_data=json.loads(table_dict)
        question_list=table_data['table_data']
        content=request.POST.get("file")
        file_list=json.loads(content)
        remove_file_id=request.POST.get("remove_file")
        remove_file_list=json.loads(remove_file_id)
        if employee_list!='' and table_data and record_id:
           if employee_list:
              cur.execute("delete  from hcms_im_investigation_team_info where incident_detail_record_id="+record_id)
              for i in  employee_list:
                  cur.execute(query.fetch_hcms_query(config.detail_recording_module,config.investigation_save),(record_id,i,current_user_id,'True',),)  
           if table_data:
              cur.execute("delete  from hcms_im_investigation_question_answer where incident_detail_record_id="+record_id)
              for j in  question_list:
                  cur.execute(query.fetch_hcms_query(config.detail_recording_module,config.investigation_question_save),(record_id,j['question'],j['answer'],current_user_id,'True',),) 
           if file_list:
                  for data in file_list:
                    file_name =str(record_id)+'_'+data['name']
                    file_exsist=os.path.isfile(settings.MEDIA_ROOT+file_name)
                    if file_exsist is True:
                       pre_num=random.randint(1,101)
                       file_name=str(record_id)+'('+str(pre_num)+')'+'_'+data['name']
                    file_type = data['format']
                    file_binary = str(data['encode'].split(',')[0].decode('base64')) 
                    upload_dir = default_storage.save(
                    file_name, ContentFile(file_binary))
                    path=os.path.join(settings.MEDIA_ROOT, upload_dir)
                    file_save=os.path.isfile(path)
                    if file_save is True:
                        cur.execute(query.fetch_hcms_query(config.detail_recording_module,config.file_details),(record_id,file_name,path,file_type,current_user_id,True,'investigation'),)
                    else:
                       json_data['status']='NTE_doc'
           if remove_file_list:
                cur.execute(query.fetch_hcms_query(config.detail_recording_module,config.invest_remove_file),(current_user_id,record_id,tuple(remove_file_list),))
           json_data['status']=status_keys.SUCCESS_STATUS
      else:
          json_data['status']=status_keys.FAILURE_STATUS
    except Exception as e:
        json_data['status'] = e
        json_data['status']=status_keys.FAILURE_STATUS
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def investigation_details(request):
    ''' 
                09-APR-2018 || ESA || To save investigation details.
                @param request: Request Object
                @type request : Object
                @return:  return the success message for save
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    try:
     if current_user_id:
        record_id=request.POST.get('id')
        if record_id:
            cur.execute(query.fetch_hcms_query(config.detail_recording_module,config.team_details),(record_id,))
            team_details=dictfetchall(cur)
            cur.execute(query.fetch_hcms_query(config.detail_recording_module,config.qa_details),(record_id,))
            qa_details=dictfetchall(cur)
            cur.execute(query.fetch_hcms_query(config.detail_recording_module,config.attachment_details),(record_id,))
            attachment_details=dictfetchall(cur)
            if attachment_details:
                json_data['attachment']=attachment_details
            else:
                json_data['attachment']=[]
            if qa_details:
                json_data['qa_details']=qa_details
            else:
                json_data['qa_details']=[]
            if team_details:
                json_data['team_details']=team_details
            else:
                json_data['attachment']=[]
    except Exception as e:
        json_data['status'] = e
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)


def invest_details_remove(request):
    ''' 
            10-APR-2018 || ESA || For remove
            @param request: Request Object
            @type request : Object
            @return:  return the success data
    '''
    json_data={}
    current_user_id=request.user.id
    try:
        cur = db_connection()
        if current_user_id:
          remove_record_id=request.POST.get('record_remove_id')
          if remove_record_id:
             cur.execute(query.fetch_hcms_query(config.detail_recording_module,config.remove_invest_team_infotable),(current_user_id,remove_record_id,))
             cur.execute(query.fetch_hcms_query(config.detail_recording_module,config.remove_qa),(current_user_id,remove_record_id,))
             cur.execute(query.fetch_hcms_query(config.detail_recording_module,config.remove_invest_file),(current_user_id,remove_record_id,))
             json_data['status']=status_keys.REMOVE_STATUS
          else:
             json_data['status']=status_keys.FAILURE_STATUS
        else:
             json_data['status']='NTE_01'
    except Exception as e:
        json_data['status'] = e
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)


def corrective_action_save(request):
    ''' 
                10-APR-2018 || ESA || To save corretive action details.
                @param request: Request Object
                @type request : Object
                @return:  return the success message for save
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()  
    try:
        if current_user_id:
            record_id=request.POST.get('record_id')
            table_dict=request.POST.get('data')
            table_data=json.loads(table_dict)
            if table_data and record_id:
              for i in  table_data:
                 cur.execute(query.fetch_hcms_query(config.detail_recording_module,config.corrective_action_item_insert),
                             (str(record_id),i['action_item'],str(i['owner']),i['action_status'],current_user_id,'True'),)
              json_data['status']=status_keys.SUCCESS_STATUS
            else:
                json_data['status']=status_keys.FAILURE_STATUS
        else:
          json_data['status']='NTE_01'
    except Exception as e:
         json_data['status'] = e
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value) 

def corrective_action_details(request):
    ''' 
                10-APR-2018 || ESA || To fetch corrective action details.
                @param request: Request Object
                @type request : Object
                @return:  return the success message
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    try:
      if current_user_id:
        record_id=request.POST.get('id')
        if record_id:
          cur.execute(query.fetch_hcms_query(config.detail_recording_module,config.corrective_action_details),(record_id,))
          data=dictfetchall(cur) 
          if data:
             json_data['action_item']=data
          else:
              json_data['action_item']=[]
      else:
         json_data['status']='NTE_01'
    except Exception as e:
        json_data['status'] = e
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def corrective_action_item_remove(request):
    ''' 
                10-APR-2018 || ESA || To remove corrective action details.
                @param request: Request Object
                @type request : Object
                @return:  return the success message 
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    try:
      if current_user_id:
        action_id=request.POST.get('action_id')
        record_id=request.POST.get('record_id')
        if action_id and record_id:
            cur.execute(query.fetch_hcms_query(config.detail_recording_module,config.remove_action_data),(current_user_id,action_id,record_id,))
            json_data['status']=status_keys.REMOVE_STATUS
        else:
          json_data['status']=status_keys.FAILURE_STATUS
      else:
         json_data['status']='NTE_01'
    except Exception as e:
        json_data['status'] = e
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def impact_analysis_save(request):
    ''' 
            12-APR-2018 || SND || To save impact analysis.
            @param request: Request Object
            @type request : Object
            @return:  return the success message for save
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    if current_user_id:
        incident_record_id = request.POST.get(config.record_id) if request.POST.get(config.record_id)!=config.empty else 0
        environmental_financial_value = request.POST.get(config.environmental_finance) if request.POST.get(config.environmental_finance)!=config.empty else 0
        environmental_currency = request.POST.get(config.environmental_currency) if request.POST.get(config.environmental_currency)!=config.empty else 0
        environmental_impact_analysis =  config.singleQuotes+request.POST.get(config.environmental_impact_details)+config.singleQuotes if request.POST.get(config.environmental_impact_details)!=config.empty else config.null
        hr_financial_value = request.POST.get(config.hr_finance) if request.POST.get(config.hr_finance)!=config.empty else 0
        hr_currency = request.POST.get(config.hr_currency) if request.POST.get(config.hr_currency)!=config.empty else 0
        hr_impact_analysis =  config.singleQuotes+request.POST.get(config.hr_impact_details)+config.singleQuotes if request.POST.get(config.hr_impact_details)!=config.empty else config.null
        materials_financial_value = request.POST.get(config.material_finance) if request.POST.get(config.material_finance)!=config.empty else 0
        materials_currency = request.POST.get(config.material_currency) if request.POST.get(config.material_currency)!=config.empty else 0
        materials_impact_analysis =  config.singleQuotes+request.POST.get(config.material_impact_details)+config.singleQuotes if request.POST.get(config.material_impact_details)!=config.empty else config.null
        machinery_financial_value = request.POST.get(config.machinery_finance) if request.POST.get(config.machinery_finance)!=config.empty else 0
        machinery_currency = request.POST.get(config.machinery_currency) if request.POST.get(config.machinery_currency)!=config.empty else 0
        machinery_impact_analysis =  config.singleQuotes+request.POST.get(config.machinery_impact_details)+config.singleQuotes if request.POST.get(config.machinery_impact_details)!=config.empty else config.null
        analysis_date = config.singleQuotes+datetime.strptime(request.POST.get(config.analysis_date), config.normalDateFormat).strftime(config.convertDateFormat)+config.singleQuotes if request.POST.get(config.analysis_date)!=config.empty else config.null
        other_risks =  config.singleQuotes+request.POST.get(config.other_risks)+config.singleQuotes if request.POST.get(config.other_risks)!=config.empty else config.null
        business_impact =  config.singleQuotes+request.POST.get(config.business_impact)+config.singleQuotes if request.POST.get(config.business_impact)!=config.empty else config.null
        business_activities_affected =  config.singleQuotes+request.POST.get(config.business_activities_affected)+config.singleQuotes if request.POST.get(config.business_activities_affected)!=config.empty else config.null
        minimum_recovery_time = request.POST.get(config.minimum_recoverty_time) if request.POST.get(config.minimum_recoverty_time)!=config.empty else 0
        if incident_record_id!=0:
            cur.execute(query.fetch_hcms_query(config.detail_recording_module,config.impact_analysis_save)
                .format(environmental_financial_value,environmental_impact_analysis,hr_financial_value,hr_impact_analysis,
                materials_financial_value,materials_impact_analysis,machinery_financial_value,machinery_impact_analysis,analysis_date,other_risks,
                business_impact,business_activities_affected,minimum_recovery_time,environmental_currency,hr_currency,machinery_currency,materials_currency,
                incident_record_id,True,current_user_id,datetime.now()))
            return_data=dictfetchall(cur)
            if return_data:
                json_data[config.status]=status_keys.SUCCESS_STATUS
            else:
                json_data[config.status]=status_keys.FAILURE_STATUS
        else:
           json_data[config.status]=status_keys.FAILURE_STATUS
    else:
        json_data[config.status]=status_keys.FAILURE_STATUS
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)  


def impact_analysis_update(request):
    ''' 
            12-APR-2018 || SND || To update impact analysis.
            @param request: Request Object
            @type request : Object
            @return:  return the success message for update
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    if current_user_id:
        incident_record_id = request.POST.get(config.record_id) if request.POST.get(config.record_id)!=config.empty else 0
        environmental_financial_value = request.POST.get(config.environmental_finance) if request.POST.get(config.environmental_finance)!=config.empty else 0
        environmental_currency = request.POST.get(config.environmental_currency) if request.POST.get(config.environmental_currency)!=config.empty else 0
        environmental_impact_analysis =  config.singleQuotes+request.POST.get(config.environmental_impact_details)+config.singleQuotes if request.POST.get(config.environmental_impact_details)!=config.empty else config.null
        hr_financial_value = request.POST.get(config.hr_finance) if request.POST.get(config.hr_finance)!=config.empty else 0
        hr_currency = request.POST.get(config.hr_currency) if request.POST.get(config.hr_currency)!=config.empty else 0
        hr_impact_analysis =  config.singleQuotes+request.POST.get(config.hr_impact_details)+config.singleQuotes if request.POST.get(config.hr_impact_details)!=config.empty else config.null
        materials_financial_value = request.POST.get(config.material_finance) if request.POST.get(config.material_finance)!=config.empty else 0
        materials_currency = request.POST.get(config.material_currency) if request.POST.get(config.material_currency)!=config.empty else 0
        materials_impact_analysis =  config.singleQuotes+request.POST.get(config.material_impact_details)+config.singleQuotes if request.POST.get(config.material_impact_details)!=config.empty else config.null
        machinery_financial_value = request.POST.get(config.machinery_finance) if request.POST.get(config.machinery_finance)!=config.empty else 0
        machinery_currency = request.POST.get(config.machinery_currency) if request.POST.get(config.machinery_currency)!=config.empty else 0
        machinery_impact_analysis =  config.singleQuotes+request.POST.get(config.machinery_impact_details)+config.singleQuotes if request.POST.get(config.machinery_impact_details)!=config.empty else config.null
        analysis_date = config.singleQuotes+datetime.strptime(request.POST.get(config.analysis_date), config.normalDateFormat).strftime(config.convertDateFormat)+config.singleQuotes if request.POST.get(config.analysis_date)!=config.empty else config.null
        other_risks =  config.singleQuotes+request.POST.get(config.other_risks)+config.singleQuotes if request.POST.get(config.other_risks)!=config.empty else config.null
        business_impact =  config.singleQuotes+request.POST.get(config.business_impact)+config.singleQuotes if request.POST.get(config.business_impact)!=config.empty else config.null
        business_activities_affected =  config.singleQuotes+request.POST.get(config.business_activities_affected)+config.singleQuotes if request.POST.get(config.business_activities_affected)!=config.empty else config.null
        minimum_recovery_time = request.POST.get(config.minimum_recoverty_time) if request.POST.get(config.minimum_recoverty_time)!=config.empty else 0
        if incident_record_id!=0:
            cur.execute(query.fetch_hcms_query(config.detail_recording_module,config.impact_analysis_update).
                format(environmental_financial_value,environmental_impact_analysis,hr_financial_value,hr_impact_analysis,
                materials_financial_value,materials_impact_analysis,machinery_financial_value,machinery_impact_analysis,analysis_date,other_risks,
                business_impact,business_activities_affected,minimum_recovery_time,environmental_currency,hr_currency,machinery_currency,materials_currency,
                True,current_user_id,datetime.now(),incident_record_id))
            return_data=dictfetchall(cur)
            if return_data:
                json_data[config.status]=status_keys.UPDATE_STATUS
            else:
                json_data[config.status]=status_keys.FAILURE_STATUS
        else:
           json_data[config.status]=status_keys.FAILURE_STATUS
    else:
        json_data[config.status]=status_keys.FAILURE_STATUS
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)  

def impact_analysis_remove(request):
    ''' 
            12-APR-2018 || SND || To remove impact analysis.
            @param request: Request Object
            @type request : Object
            @return:  return the success message for remove
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    if current_user_id:
      incident_detail_record_id = request.POST.get(config.record_id)
      if incident_detail_record_id:
        cur.execute(query.fetch_hcms_query(config.detail_recording_module,config.impact_analysis_delete).format(incident_detail_record_id))
        json_data[config.status]=status_keys.REMOVE_STATUS
      else:
        json_data[config.status]=status_keys.FAILURE_STATUS
    else:
        json_data[config.status]=status_keys.FAILURE_STATUS
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def impact_analysis_view(request):
    ''' 
            12-APR-2018 || SND || To view impact analysis.
            @param request: Request Object
            @type request : Object
            @return:  return the success message for view
    '''
    json_data={}
    current_user_id = request.user.id
    cur = db_connection()
    if current_user_id:
      incident_detail_record_id = request.POST.get(config.record_id)
      if incident_detail_record_id:
        cur.execute(query.fetch_hcms_query(config.detail_recording_module,config.impact_analysis_view).format(incident_detail_record_id))
        injury_details_data = dictfetchall(cur)
        json_data[config.impact_analysis_data] = injury_details_data
        json_data[config.status] = status_keys.SUCCESS_STATUS
      else:
        json_data[config.impact_analysis_data] = []
        json_data[config.status] = status_keys.FAILURE_STATUS
    else:
        json_data[config.status] = status_keys.FAILURE_STATUS
        json_data[config.impact_analysis_data] = []
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def corrective_action_update(request):
    ''' 
                11-APR-2018 || ESA || To update action details.
                @param request: Request Object
                @type request : Object
                @return:  return the success message 
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    try:
        if current_user_id:
            action_id=request.POST.get('action_id')
            record_id=request.POST.get('record_id')
            owner=request.POST.get('owner')
            status=request.POST.get('status')
            action_item=request.POST.get('action_item')
            if action_id and record_id:
                cur.execute(query.fetch_hcms_query(config.detail_recording_module,config.update_action_data),(action_item,owner,status,current_user_id,action_id,record_id,))
                json_data['status']=status_keys.UPDATE_STATUS
            else:
              json_data['status']=status_keys.FAILURE_STATUS
        else:
             json_data['status']='NTE_01'
    except Exception as e:
         json_data['status'] = e
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)


def corrective_action_remove(request):
    ''' 
                10-APR-2018 || ESA || To remove corrective action details.
                @param request: Request Object
                @type request : Object
                @return:  return the success message 
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    try:
      if current_user_id:
        record_id=request.POST.get('record_remove_id')
        if  record_id:
            cur.execute(query.fetch_hcms_query(config.detail_recording_module,config.remove_corrective_action),(current_user_id,record_id,))
            json_data['status']=status_keys.REMOVE_STATUS
        else:
          json_data['status']=status_keys.FAILURE_STATUS
      else:
         json_data['status']='NTE_01'
    except Exception as e:
        
        json_data['status'] = e
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def solution_proposal_save(request):
    ''' 
                10-APR-2018 || ESA || To save solution proposal details.
                @param request: Request Object
                @type request : Object
                @return:  return the success message 
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    try:
     if current_user_id:
        record_id=request.POST.get('record_id')
        corrective_measure=request.POST.get('corrective_measure')
        preventive_measure=request.POST.get('preventive_measure')
        if record_id and preventive_measure!='' and preventive_measure!='':
            cur.execute(query.fetch_hcms_query(config.detail_recording_module,config.solution_proposal_check),(record_id,))
            exsist_data=dictfetchall(cur) 
            if exsist_data:
               cur.execute(query.fetch_hcms_query(config.detail_recording_module,config.solution_proposal_update),
                           (corrective_measure,preventive_measure,current_user_id,exsist_data[0]['id'],record_id,))
               json_data['status']=status_keys.UPDATE_STATUS
            else:
              cur.execute(query.fetch_hcms_query(config.detail_recording_module,config.solution_proposal_save),(record_id,corrective_measure,preventive_measure,current_user_id,'True',))
            json_data['status']=status_keys.SUCCESS_STATUS
        else:
          json_data['status']=status_keys.FAILURE_STATUS
     else:
         json_data['status']='NTE_01'
    except Exception as e:
        json_data['status'] = e
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def solution_proposal_view(request):
    ''' 
                10-APR-2018 || ESA || To save solution proposal details.
                @param request: Request Object
                @type request : Object
                @return:  return the success message 
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    try:
      if current_user_id:
        record_id=request.POST.get('id') 
        if record_id:
           cur.execute(query.fetch_hcms_query(config.detail_recording_module,config.solution_proposal_details),(record_id,))
           exsist_data=dictfetchall(cur)
           if exsist_data:
               json_data['data']=exsist_data
           else:
               json_data['data']=[]
        else:
               json_data['data']=[]
      else:
               json_data['data']=[]
    except Exception as e:
        json_data['status'] = e
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)
    
def solution_proposal_remove(request):
    ''' 
                10-APR-2018 || ESA || To remove solution proposal details.
                @param request: Request Object
                @type request : Object
                @return:  return the success message 
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    try:
      if current_user_id:
        record_id=request.POST.get('record_remove_id')
        if record_id:
            cur.execute(query.fetch_hcms_query(config.detail_recording_module,config.remove_solution_proposal),(current_user_id,record_id,))
            json_data['status']=status_keys.REMOVE_STATUS
        else:
          json_data['status']=status_keys.FAILURE_STATUS
      else:
         json_data['status']='NTE_01'
    except Exception as e:
        json_data['status'] = e
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)
            
