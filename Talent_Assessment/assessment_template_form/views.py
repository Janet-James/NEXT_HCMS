# -*- coding: utf-8 -*-
from __future__ import unicode_literals
 
import json
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from django.http.response import HttpResponse
from CommonLib import query
from django.db import connection
from CSD.JenkinsAPI import jenkins_fetch
from Talent_Assessment.talent_assessment.models import HCMS_TA_Assessment_Template,HCMS_TA_Assessment_Template_KPI
import config
 
from CommonLib.lib import *
# for decoder function
from django.core import serializers
from django.core.serializers.json import DjangoJSONEncoder
import HCMS.settings as status_keys

import logging
import logging.handlers
logger_obj = logging.getLogger('logit')
from CommonLib.hcms_common import record_validation 
# from UAM.uam_session_sync import uam_sessions_sync
# from UAM.uam_func_data_sync import uam_func_sync
# from tracking.models import Visitor
 
# Transform CMS dashboard views here
class HCMSTalentAssessmentView(TemplateView):  #Added- Esakkiprem-07Feb2018
    ''' 
    08-Feb-2018 || ESA || To HCMS assessment form page loaded.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
     
    template_name = "talent_assessment/ta_assessment_form.html"
     
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HCMSTalentAssessmentView, self).dispatch(request, *args, **kwargs)
    
    def get(self, request, *args, **kwargs):
        context = super(HCMSTalentAssessmentView, self).get_context_data(**kwargs)
        cur = db_connection()
        cur.execute(query.fetch_hcms_query(config.assessment_module,config.employee_list));
        employe_data=dictfetchall(cur)
        if employe_data:
            context['employee_details']=employe_data
        else:
             context['employee_details']=[]
        return self.render_to_response(context)
    
class HCMSTalentAssessmentTemplateView(TemplateView):  #Added- Esakkiprem-07Feb2018
    ''' 
    09-Feb-2018 || ESA || To HCMS assessment Template page loaded.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
      
    template_name = "talent_assessment/ta_assessment_template.html"
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HCMSTalentAssessmentTemplateView, self).dispatch(request, *args, **kwargs)
     
    def get(self, request, *args, **kwargs):
        context = super(HCMSTalentAssessmentTemplateView, self).get_context_data(**kwargs)
        cur = db_connection()
        cur.execute(query.fetch_hcms_query(config.assessment_module,config.assessment_category_list));
        assessment_category=dictfetchall(cur)
        cur.execute(query.fetch_hcms_query(config.assessment_module,config.assessment_ti_role_details));
        role_data=dictfetchall(cur)
        cur.execute(query.fetch_hcms_query(config.assessment_module,config.assessment_ta_kpi_details));
        hcms_ta_kpi=dictfetchall(cur)
        context['role']=role_data
        context['assessment_category']=assessment_category
        context['hcms_ta_kpi']=hcms_ta_kpi
        return self.render_to_response(context)
    

#            function for assessment template

def assessment_template_save(request):
    ''' 
            09-Feb-2018 || ESA || To save assessment Template data save.
            @param request: Request Object
            @type request : Object
            @return:  return the success message for save
    '''
    try:
        json_data={}
        current_user_id=request.user.id
        cur = db_connection()
        if current_user_id:
            assessment_template_name=request.POST.get('assessment_template_name')
            assessment_template_code=request.POST.get('assessment_template_code')
            assessment_template_active_status=request.POST.get('assessment_template_active_status')
            assessment_category=request.POST.get('assessment_category')
            role=request.POST.get('assessment_role')
            kpi_table=request.POST.get('kpi')
            kpi_data=json.loads(kpi_table)
            kpi_list=kpi_data['kpi_data']
            logger_obj.info("function name:assessment_template_save, requested data:selected assessment_template_name  is "+ str(assessment_template_name) +" attempted by "+str(request.user.username))
            cur.execute(query.fetch_hcms_query(config.assessment_module,config.template_exsist_check),(assessment_template_name,assessment_template_code,))
            unique_check=dictfetchall(cur)
            if unique_check:
                json_data['status']='NTE_UNIQUE'
            else:
                key=HCMS_TA_Assessment_Template.objects.create(is_active=True,assessment_template_name =assessment_template_name,assessment_template_code=assessment_template_code,created_by_id=current_user_id,
                                 assessment_template_publish_status=True,assessment_template_role_id=role,assessment_category_refitem_id=assessment_category,assessment_template_active_status=assessment_template_active_status)
                key.save()
                returning_id=key.id
                if returning_id:
                    logger_obj.info("function name:assessment_template_save, requested data:returning id  is "+ str(returning_id) +" attempted by "+str(request.user.username))
                    ta_assessment_template_id=''
                    for i in kpi_list:
                        if i['orgin']=='Role':
                            ta_assessment_template_id=HCMS_TA_Assessment_Template_KPI.objects.create(is_active=True,assessment_template_kpi_measurement_criteria =i['measurement'],assessment_template_id=returning_id,
                                                    assessment_template_kpi_expected=i['expected'],assessment_template_kpi_type=i['orgin'],assessment_template_role_kpi_id=i['id'])
                            ta_assessment_template_id.save()
                        if  i['orgin']=='Cascaded':
                            ta_assessment_template_id=HCMS_TA_Assessment_Template_KPI.objects.create(is_active=True,assessment_template_kpi_measurement_criteria =i['measurement'],assessment_template_id=returning_id,
                                                    assessment_template_kpi_expected=i['expected'],assessment_template_kpi_type=i['orgin'],assessment_template_cascaded_kpi_id=i['id'])
                            ta_assessment_template_id.save()
                    if ta_assessment_template_id:
                       json_data['success_status']=status_keys.SUCCESS_STATUS
                       json_data['inserted_id']=returning_id
                       logger_obj.info("function name:assessment_template_save, requested ta_assessment_template_id data is "+ str(ta_assessment_template_id) +" attempted by "+str(request.user.username)+ "status:success"+str(json_data))
                    else:
                        json_data['inserted_id']=returning_id
                        json_data['success_status']="return id is missing"
                        logger_obj.info("function name:assessment_template_save, requested data: missing and attempted by "+str(request.user.username)+ "status:failed"+str(json_data))
                else:
                    json_data['success_status']=status_key.FAILURE_STATUS
        else:
            json_data['status']='NTE_00'
    except Exception as e:
       result = e
       json_data={}
       json_data['Exception']=str(result)
    logger_obj.info("function name:assessment_template_save, requested data:selected assessment_template_name  is  attempted by "+str(request.user.username)+ "status"+str(json_data))
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)



def Kpi_fetch(request):
    ''' 
    10-Feb-2018 || ESA || To fetch the KPI Details
    @param request: Request Object
    @type request : Object
    @return: return the KPI Details for dropdown
    '''
    try:
        json_data={}
        cur = db_connection()
        role=request.POST.get('assessment_role')
        cascad_assessment_role=request.POST.get('cascad_assessment_role')
        template_id=request.POST.get('template_id')
        template_category=request.POST.get('assesset_category')
        if role:
            cur.execute("""select id, kpi_definition as kpi_description,kpi_units as target_type from hcms_ti_role_kpi where kpi_role_id="""+role+""" and is_active='True'""")
            kpi_data=dictfetchall(cur)
            if kpi_data:
                json_data['kpi']=kpi_data
        if template_category:
            if template_id is None or template_id=='':
#                cur.execute("select id from hcms_ta_assessment_template where is_active='True' and assessment_template_role_id="+cascad_assessment_role+"and  assessment_category_refitem_id="+template_category+"")
#                temp_cat=dictfetchall(cur)
#                if temp_cat:
#                  json_data['status']='NTE_cat'
#                else:
                    if template_id is None or template_id=='':
                        template_id='0'
                    if cascad_assessment_role and template_id:
                        if template_id=='0':
                           cur.execute("select id from hcms_ta_assessment_template where is_active='True' and assessment_template_role_id="+cascad_assessment_role+" and assessment_category_refitem_id="+template_category+"")
                           exsit_role=dictfetchall(cur)
                           if exsit_role:
                               json_data['status']='NTE'
                           else:
                              cur.execute(query.fetch_hcms_query(config.assessment_module,config.cascad_template_Kpi_fetch),(str(cascad_assessment_role),));
                              kpi_data=dictfetchall(cur)
                              if kpi_data:
                                json_data['kpi']=kpi_data
                              else:
                                  json_data['kpi']=[]
                        else:
                            cur.execute("select id from hcms_ta_assessment_template where is_active='True' and assessment_template_role_id="+cascad_assessment_role+"and assessment_category_refitem_id="+template_category+"and id!="+str(template_id)+"")
                            exist_temp=dictfetchall(cur)
                            if exist_temp:
                                json_data['status']='NTE_exist_cat'
                            else:
                                cur.execute("select id from hcms_ta_assessment_template where is_active='True' and assessment_template_role_id="+cascad_assessment_role+"and id!="+str(template_id)+"")
                                update_id=dictfetchall(cur)
                                if update_id:
                                   json_data['status']='NTE'
                                cur.execute("select id from hcms_ta_assessment_template where is_active='True' and assessment_template_role_id="+cascad_assessment_role+"and id="+str(template_id)+"")
                                exsist_data=dictfetchall(cur)
                                if exsist_data:
                                    json_data['status']='NTE_01'
                                else:
                                  cur.execute(query.fetch_hcms_query(config.assessment_module,config.cascad_template_Kpi_fetch),(str(cascad_assessment_role),));
                                  kpi_data=dictfetchall(cur)
                                  if kpi_data:
                                    json_data['kpi']=kpi_data
                                  else:
                                      json_data['kpi']=[]
    except Exception as e:
        result = e
        json_data={}
        json_data['Exception']=str(result) 
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def assessment_table_view(request):
    ''' 
    10-Feb-2018 || ESA || To fetch the KPI Details for table view
    @param request: Request Object
    @type request : Object
    @return:  return the KPI data for table view
    '''
    try:
        json_data={}
        cur = db_connection()
        cur.execute(query.fetch_hcms_query(config.assessment_module,config.template_table_view));
        assessment_table_data=dictfetchall(cur)
        if assessment_table_data:
            json_data['data']=assessment_table_data
        else:
             json_data['data']=[]
    except Exception as e:
        result = e
        json_data={}
        json_data['Exception']=str(result) 
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)   

def assessment_template_delete(request):
    ''' 
     12-Feb-2018 || ESA || To delete the assessment template based on id
     @param request: Request Object
     @type request : Object
     @return:    Return the success statement
    '''
    try:
        json_data={}
        cur = db_connection()
        current_user_id=request.user.id
        if current_user_id:
            template_id=request.POST.get('remove_id')
            existing_template_id=request.POST.get('exist_id')
            logger_obj.info("function name:assessment_template_delete, requested data: template_id  is "+ str(template_id) +" attempted by "+str(request.user.username))
            if template_id is not None:
                referred_record = record_validation('reference_item_category', template_id)
                if referred_record==True:
                   ta_assessment_template = HCMS_TA_Assessment_Template.objects.get(id=template_id)
                   if ta_assessment_template:
                      ta_assessment_template.is_active=False
                      ta_assessment_template.modified_by_id=current_user_id
                      ta_assessment_template.save()
                      cur.execute("""update hcms_ta_assessment_template_kpi set is_active=False ,modified_by_id="""+str(current_user_id)+""" where assessment_template_id="""+str(template_id)+"""""")
                      json_data['delete_status']=status_keys.REMOVE_STATUS
                      logger_obj.info("function name:assessment_template_delete, requested data: template_id  is "+ str(template_id) +" attempted by "+str(request.user.username)+"status:success"+str(json_data))
                   else:
                     json_data['delete_status']=status_key.FAILURE_STATUS
                     logger_obj.info("function name:assessment_template_delete, requested data: template_id  is "+ str(template_id) +" attempted by "+str(request.user.username)+"status:Failed"+str(json_data))
                else:
                    json_data['delete_status']=status_keys.ERR0028
            if existing_template_id!='':
                 referred_record = record_validation('reference_item_category', existing_template_id)
                 if referred_record==True:
                    ta_assessment_template = HCMS_TA_Assessment_Template.objects.get(id=existing_template_id)
                    if ta_assessment_template:
                       ta_assessment_template.is_active=False
                       ta_assessment_template.modified_by_id=current_user_id
                       ta_assessment_template.save()
                       cur.execute("""update hcms_ta_assessment_template_kpi set is_active=False ,modified_by_id="""+str(current_user_id)+""" where assessment_template_id="""+str(existing_template_id)+"""""")
                       json_data['delete_status']=status_keys.REMOVE_STATUS
                       logger_obj.info("function name:assessment_template_delete, requested data: existing_template_id  is "+ str(existing_template_id) +" attempted by "+str(request.user.username)+"status:success"+str(json_data))
                    else:
                      json_data['delete_status']=status_key.FAILURE_STATUS
                      logger_obj.info("function name:assessment_template_delete, requested data: existing_template_id  is "+ str(existing_template_id) +" attempted by "+str(request.user.username)+"status:Failed"+str(json_data))
                 else:
                     json_data['delete_status']=status_keys.ERR0028
        else:
            json_data['status']='NTE_00' 
    except Exception as e:
       result = e
       json_data={}
       json_data['Exception']=str(result) 
    logger_obj.info("function name:assessment_template_delete,  attempted by "+str(request.user.username)+"status"+str(json_data))
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)


def assessment_template_fetch(request):
    ''' 
    12-Feb-2018 || ESA || To fetch the assessment template based on id
    @param request: Request Object
    @type request : Object
    @return:   Return the assessment template data
    '''
    try:
        json_data={}
        cur = db_connection()
        template_id=request.POST.get('remove_id')
        cur.execute(query.fetch_hcms_query(config.assessment_module,config.assessment_template_data),(str(template_id),));
        assessment_template_data=dictfetchall(cur)
        if assessment_template_data:
              cur.execute(query.fetch_hcms_query(config.assessment_module,config.template_role_kpi_dict),(str(template_id),));
              role_kpi_dict=dictfetchall(cur)
              cur.execute(query.fetch_hcms_query(config.assessment_module,config.template_cascade_kpi_dict),(str(template_id),));
              cascade_kpi_dict=dictfetchall(cur)
        else:
             json_data['data']=[]
        json_data['data']=assessment_template_data
        json_data['role_kpi']=role_kpi_dict
        json_data['cascade_kpi']=cascade_kpi_dict
    except Exception as e:
        result = e
        json_data={}
        json_data['Exception']=str(result) 
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)  


def assessment_role_kpi(request):
    ''' 
    12-Feb-2018 || ESA || To fetch the assessment role based KPI template based on KPI id
    @param request: Request Object
    @type request : Object
    @return:   Return the assessment template data
    '''
    try:
        json_data={}
        cur = db_connection()
        assessment_kpi=request.POST.get('assessment_kpi')
        if assessment_kpi:
          cur.execute('select id,kpi_description,kpi_target_value ,kpi_units as type from hcms_ta_kpi where is_active=True and id='+assessment_kpi)
          assessment_role_kpi=dictfetchall(cur)
          if assessment_role_kpi:
               json_data['kpi_data']=assessment_role_kpi
          else:
               json_data['kpi_data']=[]
        else:
             json_data['status']=0
    except Exception as e:
        result = e
        json_data={}
        json_data['Exception']=str(result) 
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value) 



def assessment_selected_role_kpi(request):
    ''' 
    13-Feb-2018 || ESA || To fetch the role KPI Details
    @param request: Request Object
    @type request : Object
    @return: return the KPI Details for dropdown
    '''
    try:
        json_data={}
        cur = db_connection()
        kpi_table=request.POST.get('arrayOfValues')
        kpi_data=json.loads(kpi_table)
        kpi_list=kpi_data['id']
        kpi_data_list=[]
        for i in kpi_list:
            kpi_data_dict={}
            cur.execute("""select id, kpi_definition as kpi_description,kpi_plan as kpi_target_value,kpi_units as target_type  from hcms_ti_role_kpi where id="""+i+""" and is_active='True'""")
            kpi_data=dictfetchall(cur)
            if kpi_data:
                kpi_data_dict['id']=kpi_data[0]['id']
                kpi_data_dict['kpi_target_value']=kpi_data[0]['kpi_target_value']
                kpi_data_dict['kpi_description']=kpi_data[0]['kpi_description']
                kpi_data_dict['target_type']=kpi_data[0]['target_type']
                kpi_data_list.append(kpi_data_dict)
        json_data['kpi']=kpi_data_list
    except Exception as e:
        result = e
        json_data={}
        json_data['Exception']=str(result) 
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value) 


def assessment_template_update(request):
    ''' 
    09-Feb-2018 || ESA || To save assessment Template data save.
    @param request: Request Object
    @type request : Object
    @return:  return the success message for save
    '''
    try:
        json_data={}
        current_user_id=request.user.id
        if current_user_id:
            cur = db_connection()
            assessment_template_name=request.POST.get('assessment_template_name')
            assessment_template_code=request.POST.get('assessment_template_code')
            assessment_template_active_status=request.POST.get('assessment_template_active_status')
            assessment_category=request.POST.get('assessment_category')
            role=request.POST.get('assessment_role')
            kpi_table=request.POST.get('kpi')
            kpi_data=json.loads(kpi_table)
            kpi_list=kpi_data['kpi_data']
            template_id=request.POST.get('update_id')
            existing_template_id=request.POST.get('exist_id')
            logger_obj.info("function name:assessment_template_update, requested data:  is "+ str(template_id) +" attempted by "+str(request.user.username))
            if template_id is not None:
               cur.execute(query.fetch_hcms_query(config.assessment_module,config.update_template_exsist_check),(assessment_template_name,assessment_template_code,template_id,))
               unique_check=dictfetchall(cur)
               if unique_check:
                    json_data['status']='NTE_UNIQUE'
               else:
                    ta_assessment_template = HCMS_TA_Assessment_Template.objects.get(id=template_id)
                    if ta_assessment_template:
                        ta_assessment_template.is_active=True
                        ta_assessment_template.assessment_template_name=assessment_template_name
                        ta_assessment_template.assessment_template_code=assessment_template_code
                        ta_assessment_template.assessment_template_role_id=role
                        ta_assessment_template.assessment_category_refitem_id=assessment_category
                        ta_assessment_template.assessment_template_active_status=assessment_template_active_status
                        ta_assessment_template.assessment_template_publish_status=True
                        ta_assessment_template.modified_by_id=current_user_id
                        ta_assessment_template.save()
                    if template_id:
                        cur.execute(query.fetch_hcms_query(config.assessment_module,config.template_remove),(str(template_id),));
                        for i in kpi_list:
                            if i['orgin']=='Role':
                              ta_assessment_template_id=HCMS_TA_Assessment_Template_KPI.objects.create(is_active=True,assessment_template_kpi_measurement_criteria =i['measurement'],assessment_template_id=template_id,
                                                assessment_template_kpi_expected=i['expected'],assessment_template_kpi_type=i['orgin'],assessment_template_role_kpi_id=i['id'])
                              ta_assessment_template_id.save()
                            if  i['orgin']=='Cascaded':
                               ta_assessment_template_id=HCMS_TA_Assessment_Template_KPI.objects.create(is_active=True,assessment_template_kpi_measurement_criteria =i['measurement'],assessment_template_id=template_id,
                                                assessment_template_kpi_expected=i['expected'],assessment_template_kpi_type=i['orgin'],assessment_template_cascaded_kpi_id=i['id'])
                               ta_assessment_template_id.save()
                            if ta_assessment_template_id:
                                json_data['update_status']=status_keys.UPDATE_STATUS
                            else:
                                json_data['update_status']=status_key.FAILURE_STATUS
               logger_obj.info("function name:assessment_template_update, requested data: template_id is "+ str(template_id) +" attempted by "+str(request.user.username) +"status"+str(json_data)) 
            if existing_template_id!='':
               cur.execute(query.fetch_hcms_query(config.assessment_module,config.update_template_exsist_check),(assessment_template_name,assessment_template_code,existing_template_id,))
               unique_check=dictfetchall(cur)
               if unique_check:
                    json_data['status']='NTE_UNIQUE'
               else:
                    ta_assessment_template = HCMS_TA_Assessment_Template.objects.get(id=existing_template_id)
                    if ta_assessment_template:
                        ta_assessment_template.is_active=True
                        ta_assessment_template.assessment_template_name=assessment_template_name
                        ta_assessment_template.assessment_template_code=assessment_template_code
                        ta_assessment_template.assessment_template_role_id=role
                        ta_assessment_template.assessment_category_refitem_id=assessment_category
                        ta_assessment_template.assessment_template_active_status=assessment_template_active_status
                        ta_assessment_template.assessment_template_publish_status=True
                        ta_assessment_template.modified_by_id=current_user_id
                        ta_assessment_template.save()
                    if existing_template_id:
                        cur.execute(query.fetch_hcms_query(config.assessment_module,config.template_remove),(str(existing_template_id),));
                        json_data['update_status']=status_keys.UPDATE_STATUS
                        for i in kpi_list:
                           if i['orgin']=='Role':
                              ta_assessment_template_id=HCMS_TA_Assessment_Template_KPI.objects.create(is_active=True,assessment_template_kpi_measurement_criteria =i['measurement'],assessment_template_id=existing_template_id,
                                                assessment_template_kpi_expected=i['expected'],assessment_template_kpi_type=i['orgin'],assessment_template_role_kpi_id=i['id'])
                              ta_assessment_template_id.save()
                           if  i['orgin']=='Cascaded':
                               ta_assessment_template_id=HCMS_TA_Assessment_Template_KPI.objects.create(is_active=True,assessment_template_kpi_measurement_criteria =i['measurement'],assessment_template_id=existing_template_id,
                                                assessment_template_kpi_expected=i['expected'],assessment_template_kpi_type=i['orgin'],assessment_template_cascaded_kpi_id=i['id'])
                               ta_assessment_template_id.save()
                           if ta_assessment_template_id:
                                    json_data['update_status']=status_keys.UPDATE_STATUS
                           else:
                                    json_data['update_status']=status_key.FAILURE_STATUS
                    else:
                        json_data['update_status']=status_key.FAILURE_STATUS
               logger_obj.info("function name:assessment_template_update, requested data: existing_template_id is "+ str(existing_template_id) +" attempted by "+str(request.user.username) +"status"+str(json_data)) 
        else:
            json_data['status']='NTE_00'
    except Exception as e:
       result = e
       json_data={}
       json_data['Exception']=str(result)   
    logger_obj.info("function name:assessment_template_update, requested data:existing_template_id is attempted by "+str(request.user.username) +"status"+str(json_data)) 
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def assessment_role_check(request):
    ''' 
    23-Mar-2018 || ESA || To check the exsist category and role data
    @param request: Request Object
    @type request : Object
    @return:  return the success message
    '''
    try:
        json_data={}
        cur = db_connection()
        template_id=request.POST.get('clicked_row_id')
        assesset_category=request.POST.get('assesset_category')
        assesst_role=request.POST.get('assesst_role')
        if template_id and assesset_category and assesst_role:
            cur.execute("select id from hcms_ta_assessment_template where is_active='True' and assessment_template_role_id="+assesst_role+"and assessment_category_refitem_id="+assesset_category+"and id!="+str(template_id)+"")
            exist_temp=dictfetchall(cur)
            if exist_temp:
                json_data['status']='NTE_exist_data'
            else:
                cur.execute(query.fetch_hcms_query(config.assessment_module,config.checked_assessment_template_data),(str(template_id),str(assesst_role),str(assesset_category),));
                assessment_template_data=dictfetchall(cur)
                if assessment_template_data:
                   cur.execute(query.fetch_hcms_query(config.assessment_module,config.template_role_kpi_dict),(str(template_id),));
                   role_kpi_dict=dictfetchall(cur)
                   cur.execute(query.fetch_hcms_query(config.assessment_module,config.template_cascade_kpi_dict),(str(template_id),));
                   cascade_kpi_dict=dictfetchall(cur)
                   if cascade_kpi_dict or role_kpi_dict:
                     json_data['status']='NTE_001'
                     json_data['role_kpi']=role_kpi_dict
                     json_data['cascade_kpi']=cascade_kpi_dict
                else:
                  cur.execute(query.fetch_hcms_query(config.assessment_module,config.cascad_template_Kpi_fetch),(str(assesst_role),));
                  kpi_data=dictfetchall(cur)
                  if kpi_data:
                     json_data['kpi']=kpi_data
                     json_data['status']='NTE_002'
                  else:
                      json_data['status']='NTE_002'
                      json_data['kpi']=[]
        else:
            json_data['status']='NTE_00'
    except Exception as e:
        json_data[config.status] = e
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)