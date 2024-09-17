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
from Talent_Assessment.talent_assessment.models import HCMS_TA_Assessment_Template,HCMS_TA_Assessment_Template_KPI,HCMS_TA_Assessment_Form
import config
from CommonLib.lib import *
# for decoder function
from django.core import serializers
from django.core.serializers.json import DjangoJSONEncoder
from django.views.decorators.csrf import csrf_protect
import HCMS.settings as status_keys
import logging
import logging.handlers
from CommonLib.hcms_common import record_validation 
logger_obj = logging.getLogger('logit')

def assessment_form_data_fetch(request):
     '''
        15-Feb-2018 || ESA || To fetch the employee based details
        @param request: Request Object
        @type request : Object
        @return: return the employee based details
     '''
     try:
         json_data={}
         cur = db_connection()
         employee_id=request.POST.get('employee_id')
         logger_obj.info("function name:assessment_form_data_fetch, requested data:selected employee id is "+ str(employee_id) +" attempted by "+str(request.user.username))
         if employee_id:
            cur.execute(query.fetch_hcms_query(config.assessment_module,config.employee_based_data),(str(employee_id),));
            employee_data=dictfetchall(cur)
            if employee_data:
               json_data['template_data']=employee_data
               role_id=employee_data[0]['role_id']
               if role_id:
                   cur.execute("""
select DISTINCT ref_item.refitems_desc as ref_name,assessment_category_refitem_id  from hcms_ta_assessment_template as asst_temp 
inner join reference_items as ref_item on ref_item.id=asst_temp.assessment_category_refitem_id
where ref_item.is_active='True' and asst_temp.is_active='True' and asst_temp.assessment_template_role_id="""+str(role_id),)
                   category_data=dictfetchall(cur)
                   if category_data:
                       json_data['category_data']=category_data
                   else:
                        json_data['category_data']=[]
            else:
                json_data['category_data']=[]
                json_data['template_data']=[]
     except Exception as e:
            result = e
            json_data={}
            json_data['template_data']=[]
            json_data['kpi_data']=[]
            json_data['Exception']=str(result)
     logger_obj.error("assessment_form_data_fetch,requested data:selected employee id is"+ str(employee_id) +" attempted by "+str(request.user.username) +"status" +str(json_data))
     return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value) 
    

def assessment_form_save(request):
    ''' 
                15-Feb-2018 || ESA || To save the template form details
                @param request: Request Object
                @type request : Object
                @return: return the success message
    '''    
    try:
        cur = db_connection()
        json_data={}
        current_user_id=request.user.id
        if current_user_id:
            employee_id=request.POST.get('employee_id')
            employee_role=request.POST.get('employee_role')
            employee_assessment_category=request.POST.get('employee_assessment_category')
            employee_template=request.POST.get('employee_template')
            kpi_table=request.POST.get('kpi')
            kpi_data=json.loads(kpi_table)
            kpi_list=kpi_data['kpi_data']
            logger_obj.info("function name:assessment_form_save, requested data:employee_id "+ str(employee_id) +" attempted by "+str(request.user.username))
            if employee_id and employee_role and employee_assessment_category and employee_template and current_user_id:
                cur.execute(query.fetch_hcms_query(config.assessment_module,config.form_data_save) ,(str(current_user_id),str(employee_id),str(employee_role),str(employee_template),str(employee_assessment_category),'True','True',))
                res = dictfetchall(cur)
                form_id=res[0]['id']
                if form_id:
                    kpi_return_id=''
                    for i in kpi_list:
                        if i['orgin']=='Cascaded':
                            cur.execute(query.fetch_hcms_query(config.assessment_module,config.kpi_form_save) ,(str(current_user_id),str(i['expected']),str(i['measurement']),str(i['weightage']),str(form_id),str(i['id']),'True',str(i['orgin'])),)
                            kpi_return = dictfetchall(cur)
                            kpi_return_id=kpi_return[0]['id']
                        if i['orgin']=='Role':
                            cur.execute(query.fetch_hcms_query(config.assessment_module,config.role_kpi_form_save) ,(str(current_user_id),str(i['expected']),str(i['measurement']),str(i['weightage']),str(form_id),str(i['id']),'True',str(i['orgin'])),)
                            kpi_return = dictfetchall(cur)
                            kpi_return_id=kpi_return[0]['id']
                    if kpi_return_id:
                        json_data['form_insert_status']=status_keys.SUCCESS_STATUS
                        json_data['inserted_id']=form_id
                        logger_obj.info("function name:assessment_form_save, requested data:employee_id "+ str(employee_id) +" attempted by "+str(request.user.username)+ "status:success"+str(json_data))
                    else:
                        json_data['form_insert_status']=status_key.FAILURE_STATUS
                        logger_obj.info("function name:assessment_form_save, requested data:employee_id "+ str(employee_id) +" attempted by "+str(request.user.username)+ "status:kpi_return_id missing"+str(json_data))
                else:
                    json_data['status']=status_key.FAILURE_STATUS
                    logger_obj.warning("function name:assessment_form_save, requested data:employee_id "+ str(employee_id) +" attempted by "+str(request.user.username)+ "status:form id missing"+str(json_data))
            else:
                json_data['status']=1
                logger_obj.warning("function name:assessment_form_save, requested data:employee_id "+ str(employee_id) +" attempted by "+str(request.user.username)+ "status:failed"+str(json_data))
        
        else:
            json_data['status']='NTE_00'
    except Exception as e:
       result = e
       json_data={}
       json_data['Exception']=str(result) 
    logger_obj.error("function name:assessment_form_save, requested data:employee_id "+ str(employee_id) +" attempted by "+str(request.user.username)+ "status:error"+str(json_data))
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)  
       

def assessment_form_view(request):
     ''' 
        15-Feb-2018 || ESA || To Display the assessment form data
        @param request: Request Object
        @type request : Object
        @return: return assessment form data
     '''
     try:
         cur = db_connection()
         json_data={}    
         cur.execute(query.fetch_hcms_query(config.assessment_module,config.assessment_table_view));  
         assessment_from_data=dictfetchall(cur)
         if assessment_from_data:
            json_data['assessment_form_data']=assessment_from_data
         else:
             json_data['assessment_form_data']=[]
     except Exception as e:
        result = e
        json_data={}
        json_data['Exception']=str(result) 
     return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)  
 
def assessment_form_delete(request):
     ''' 
                15-Feb-2018 || ESA || To remove the selected  template form details
                @param request: Request Object
                @type request : Object
                @return: return the success message
     '''
     try:
         cur = db_connection()
         json_data={}
         current_user_id=request.user.id
         if current_user_id:
             remove_id=request.POST.get('remove_id')
             logger_obj.info("function name:assessment_form_delete, requested data:remove_id is "+ str(remove_id) +" attempted by "+str(request.user.username))
             if remove_id:
                 referred_record = record_validation('reference_item_category', remove_id)
                 if referred_record==True:
                   cur.execute("""update hcms_ta_assessment_form set is_active=%s,modified_by_id=%s where id=%s""",('False',str(current_user_id),str(remove_id),))
                   cur.execute("""update hcms_ta_assessment_form_kpi set is_active=%s,modified_by_id=%s, where assessment_form_id=%s""",('False',str(current_user_id),str(remove_id),))
                   json_data['form_delete_status']=status_keys.REMOVE_STATUS
                   logger_obj.info("function name:assessment_form_delete, requested data:remove_id is "+ str(remove_id) +" attempted by "+str(request.user.username)+ "status:success"+str(json_data))
                 else:
                    json_data['delete_status']=status_keys.ERR0028
             else:
                   json_data['form_delete_status']=status_keys.FAILURE_STATUS
                   logger_obj.warning("function name:assessment_form_delete, requested data:remove_id is "+ str(remove_id) +" attempted by "+str(request.user.username)+ "status:request data miss"+str(json_data))
         else:
            json_data['status']='NTE_00'
     except Exception as e:
       result = e
       json_data={}
       json_data['Exception']=str(result) 
     logger_obj.error("function name:assessment_form_delete, requested data:remove_id is "+ str(remove_id) +" attempted by "+str(request.user.username)+ "status:failed"+str(json_data))
     return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value) 
 

def assessment_form_fetch(request):
    ''' 
            15-Feb-2018 || ESA || To fetch the selected template form details
            @param request: Request Object
            @type request : Object
            @return: return the success message
    '''
    try:
         cur = db_connection()
         json_data={}
         current_user_id=request.user.id
         selected_form_id=request.POST.get('selected_id')
         if selected_form_id:
             cur.execute(query.fetch_hcms_query(config.assessment_module,config.form_data),(str(selected_form_id),));
             form_data=dictfetchall(cur)
             if form_data:
                json_data['selected_row_data']=form_data
                role_id=form_data[0]['role_id']
                if role_id:
                   cur.execute("""select DISTINCT ref_item.refitems_desc as ref_name,assessment_category_refitem_id  from hcms_ta_assessment_template as asst_temp 
inner join reference_items as ref_item on ref_item.id=asst_temp.assessment_category_refitem_id
where ref_item.is_active='True' and asst_temp.is_active='True' and asst_temp.assessment_template_role_id="""+str(role_id),)
                   category_data=dictfetchall(cur)
                   if category_data:
                       json_data['category_data']=category_data
                   else:
                        json_data['category_data']=[]
                cur.execute(query.fetch_hcms_query(config.assessment_module,config.role_kpi_dict),(str(selected_form_id),));
                role_kpi_dict=dictfetchall(cur)
                cur.execute(query.fetch_hcms_query(config.assessment_module,config.cascade_kpi_dict),(str(selected_form_id),));
                cascade_kpi_dict=dictfetchall(cur)
                json_data['role_kpi']=role_kpi_dict
                json_data['cascade_kpi']=cascade_kpi_dict
             else:
                 json_data['selected_row_data']=[]
                 json_data['category_data']=[]
                 json_data['role_kpi']=[]
                 json_data['cascade_kpi']=[]
         else:
            json_data['selected_row_data']=[]
            json_data['category_data']=[]
            json_data['role_kpi']=[]
            json_data['cascade_kpi']=[]
    except Exception as e:
       result = e
       json_data={}
       json_data['Exception']=str(result) 
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)  
 
 
def assessment_form_update(request):
    ''' 
            19-Feb-2018 || ESA || To update the template form details
            @param request: Request Object
            @type request : Object
            @return: return the success message
    '''
    try:
         cur = db_connection()
         json_data={}
         current_user_id=request.user.id
         if current_user_id:
             employee_id=request.POST.get('employee_id')
             employee_assessment_category=request.POST.get('employee_assessment_category')
             employee_template=request.POST.get('employee_template')
             kpi_table=request.POST.get('kpi')
             kpi_data=json.loads(kpi_table)
             kpi_list=kpi_data['kpi_data']
             form_id=request.POST.get('update_id')
             logger_obj.info("function name:assessment_form_update, requested data:form_id "+ str(form_id) +" attempted by "+str(request.user.username))
             if form_id:
                    ta_assessment_form= HCMS_TA_Assessment_Form.objects.get(id=form_id)
                    if ta_assessment_form:
                        ta_assessment_form.is_active=True
                        ta_assessment_form.assessment_category_refitem_id=employee_assessment_category
                        ta_assessment_form.assessment_form_template_id=employee_template
                        ta_assessment_form.modified_by_id=current_user_id
                        ta_assessment_form.save()
                    for i in kpi_list:
                        if i['orgin']=='Cascaded':
                            cur.execute("select id from hcms_ta_assessment_form_kpi where assessment_form_cascaded_kpi_id=%s and assessment_form_id=%s",(str(i['id']),str(form_id),))
                            exsist_data=dictfetchall(cur)
                            if exsist_data:
                               exsist_id=exsist_data[0]['id']
                               if exsist_id:
                                  cur.execute("""update hcms_ta_assessment_form_kpi set modified_by_id=%s,assessment_form_kpi_expected=%s,assessment_form_kpi_measurement_criteria=%s,
                                  assessment_form_kpi_weightage=%s,assessment_form_id=%s,assessment_form_cascaded_kpi_id=%s,is_active=%s,
                                  assessment_form_kpi_type=%s,modified_date=now() where id=%s returning id""",(str(current_user_id),str(i['expected']),str(i['measurement']),
                                  str(i['weightage']),str(form_id),str(i['id']),'True',str(i['orgin']),str(exsist_id)),)
                                  kpi_return = dictfetchall(cur)
                                  kpi_return_id=kpi_return[0]['id']
                            else:
                              cur.execute(query.fetch_hcms_query(config.assessment_module,config.update_kpi_form) ,(str(current_user_id),str(i['expected']),str(i['measurement']),str(i['weightage']),str(form_id),str(i['id']),'True',str(i['orgin'])),)
                              kpi_return = dictfetchall(cur)
                              kpi_return_id=kpi_return[0]['id']
                        if i['orgin']=='Role':
                            cur.execute("select id from hcms_ta_assessment_form_kpi where assessment_form_role_kpi_id=%s and assessment_form_id=%s",(str(i['id']),str(form_id),))
                            exsist_data=dictfetchall(cur)
                            if exsist_data:
                               exsist_id=exsist_data[0]['id']
                               if exsist_id:
                                  cur.execute("""update hcms_ta_assessment_form_kpi set modified_by_id=%s,assessment_form_kpi_expected=%s,assessment_form_kpi_measurement_criteria=%s,
                                  assessment_form_kpi_weightage=%s,assessment_form_id=%s,assessment_form_role_kpi_id=%s,is_active=%s,
                                  assessment_form_kpi_type=%s,modified_date=now() where id=%s returning id""",(str(current_user_id),str(i['expected']),str(i['measurement']),
                                  str(i['weightage']),str(form_id),str(i['id']),'True',str(i['orgin']),str(exsist_id)),)
                                  kpi_return = dictfetchall(cur)
                                  kpi_return_id=kpi_return[0]['id']
                            else:
                                cur.execute(query.fetch_hcms_query(config.assessment_module,config.role_update_kpi_form) ,(str(current_user_id),str(i['expected']),str(i['measurement']),str(i['weightage']),str(form_id),str(i['id']),'True',str(i['orgin'])),)
                                kpi_return = dictfetchall(cur)
                                kpi_return_id=kpi_return[0]['id']
                    if kpi_return_id:
                       json_data['form_update_status']=status_keys.UPDATE_STATUS
                       logger_obj.info("function name:assessment_form_update, requested data:form_id "+ str(form_id) +" attempted by "+str(request.user.username)+ "status success"+str(json_data))
                    else:
                        json_data['form_update_status']=status_keys.FAILURE_STATUS
                        logger_obj.warning("function name:assessment_form_update, requested data:form_id "+ str(form_id) +" attempted by "+str(request.user.username)+ "status failed"+str(json_data))
         else:
            json_data['status']='NTE_00'
    except Exception as e:
       result = e
       json_data={}
       json_data['Exception']=str(result) 
    logger_obj.error("function name:assessment_form_update, requested data:form_id "+ str(form_id) +" attempted by "+str(request.user.username)+ "status error"+str(json_data))
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)  


def objective_type(request):
    ''' 
            20-Feb-2018 || ESA || To load data to objective settings form
            @param request: Request Object
            @type request : Object
            @return: return the dropdown data
    '''
    try:
        json_data={}
        cur = db_connection()
        cur.execute(query.fetch_hcms_query(config.assessment_module,config.objective_type));
        objective_type_data=dictfetchall(cur)
        cur.execute(query.fetch_hcms_query(config.assessment_module,config.currency_type));
        currency_type_data=dictfetchall(cur)
        cur.execute(query.fetch_hcms_query(config.assessment_module,config.target_type));
        target_type_data=dictfetchall(cur)
        cur.execute(query.fetch_hcms_query(config.assessment_module,config.tracking_type));
        tracking_type_data=dictfetchall(cur)
        if objective_type_data:
            json_data['objective_type_data']=objective_type_data
        else:
            json_data['objective_type_data']=[]
        if currency_type_data:
            json_data['currency_type_data']=currency_type_data
        else:
            json_data['currency_type_data']=[]
        if target_type_data:
            json_data['target_type_data']=target_type_data
        else:
            json_data['target_type_data']=[]
        if tracking_type_data:
            json_data['tracking_type_data']=tracking_type_data
        else:
            json_data['tracking_type_data']=[]
            
    except Exception as e:
       result = e
       json_data={}
       json_data['Exception']=str(result) 
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)  

def objective_ta_kpi(request):
    ''' 
            20-Feb-2018 || ESA || To load data to objective settings form
            @param request: Request Object
            @type request : Object
            @return: return the dropdown data
    '''
    try:
        cur = db_connection()
        json_data={}
        current_user_id=request.user.id
        kpi_table=request.POST.get('kpi')
        kpi_data=json.loads(kpi_table)
        if kpi_data:
            kpi_list=[]
            for i in kpi_data:
              cur.execute(query.fetch_hcms_query(config.assessment_module,config.objective_ta_kpi),(str(i),));
              assessment_role_kpi=dictfetchall(cur)
              if assessment_role_kpi:
                   for i in assessment_role_kpi:
                       kpi_dict={}
                       kpi_dict['id']=i['id']
                       kpi_dict['kpi_target_value']=i['kpi_target_value']
                       kpi_dict['kpi_description']=i['kpi_description']
                       kpi_dict['target']=i['target_type']
                       kpi_list.append(kpi_dict)
            json_data['kpi_data']=kpi_list
        else:
                   json_data['kpi_data']=[]
    except Exception as e:
        json_data[config.status] = e
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value) 

def org_unit_fetch(request):
    ''' 
            13-Mar-2018 || ESA || To Fetch the org unit based on employee
            @param request: Request Object
            @type request : Object
            @return: return the success message
    '''
    try:
        cur = db_connection()
        json_data={}
        current_user_id=request.user.id
        if current_user_id:
            employee_id=request.POST.get('selected_employee_id')
            cur.execute(query.fetch_hcms_query(config.assessment_module,config.employee_org_unit),(employee_id,));
            employee_org_unit=dictfetchall(cur)
            if employee_org_unit:
                json_data['org_data']=employee_org_unit
            else:
                json_data['org_data']=[]
        else:
           json_data['org_data']=[]
    except Exception as e:
        json_data[config.status] = e
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value) 


def form_template_fetch(request):
    ''' 
            24-Mar-2018 || ESA || To Fetch the template based on catgory
            @param request: Request Object
            @type request : Object
            @return: return the success message
    '''
    try:
         cur = db_connection()
         json_data={}
         kpi_list=[]
         current_user_id=request.user.id
         selected_category=request.POST.get('selected_category')
         selected_form_id=request.POST.get('clicked_row_id')
         selected_role_id=request.POST.get('role_id')
         if current_user_id and selected_category:
            if selected_form_id is None or selected_form_id=='':
                cur.execute("select assessment_template_name as template_name,id as template_id from hcms_ta_assessment_template where is_active='True' and assessment_category_refitem_id=%s and  assessment_template_role_id=%s",(str(selected_category),str(selected_role_id),))
                template_data=dictfetchall(cur)
                if template_data:
                    json_data['template_name']=template_data
                    template_id=template_data[0]['template_id']
                    if template_id:
                        cur.execute(query.fetch_hcms_query(config.assessment_module,config.template_based_data),(str(template_id),));
                        template_kpi_data=dictfetchall(cur)
                        if template_kpi_data:
                           for i in template_kpi_data:
                                kpi_dict={}
                                kpi_dict['expected']=i['expected']
                                kpi_dict['measurement']=i['measurement']
                                kpi_dict['type']=i['kpi_type']
                                kpi_dict['id']=i['kpi_id']
                                if i['kpi_type']=='Role':
                                    cur.execute(query.fetch_hcms_query(config.assessment_module,config.form_role_kpi),(str(i['kpi_id']),));
                                    kpi_data=dictfetchall(cur)
                                    if kpi_data:
                                        kpi_dict['kpi_description']=kpi_data[0]['kpi_description']
                                        kpi_dict['target']=kpi_data[0]['type']
                                if i['kpi_type']=='Cascaded':
                                      cur.execute(query.fetch_hcms_query(config.assessment_module,config.form_cascaded_kpi),(str(i['kpi_id']),));
                                      kpi_data=dictfetchall(cur)
                                      if kpi_data:
                                         kpi_dict['kpi_description']=kpi_data[0]['kpi_description']
                                         kpi_dict['target']=kpi_data[0]['type']
                                kpi_list.append(kpi_dict)
                        json_data['kpi_data']=kpi_list
                    else:
                        json_data['status']='template_id is missing'
                        json_data['template_name']=[]
                        json_data['kpi_data']=[]
                else:
                    json_data['status']="template data empty"
                    json_data['template_name']=[]
                    json_data['kpi_data']=[]
            if selected_form_id:
               cur.execute(""" select ass_form.assessment_form_role_id as role_id,role_kpi.kpi_units as target_type,role_kpi.kpi_definition,form_kpi.assessment_form_kpi_expected as expected,form_kpi.assessment_form_kpi_measurement_criteria as measurement,
        form_kpi.assessment_form_kpi_weightage as weightage,form_kpi.assessment_form_id as form_id,form_kpi.assessment_form_role_kpi_id as form_kpi_id,
        form_kpi.assessment_form_kpi_type as type
        from hcms_ta_assessment_form_kpi as form_kpi
        inner join hcms_ti_role_kpi as role_kpi on role_kpi.id=form_kpi.assessment_form_role_kpi_id
        inner join hcms_ta_assessment_form as ass_form on ass_form.id=form_kpi.assessment_form_id
        where form_kpi.is_active='True' and role_kpi.is_active='TRUE' and form_kpi.assessment_form_kpi_type='Role' 
        and form_kpi.assessment_form_id=%s and ass_form.assessment_category_refitem_id=%s""",(str(selected_form_id),str(selected_category),))
               role_kpi_dict=dictfetchall(cur)
               cur.execute("""select ta_kpi.kpi_target_type as target_type,ta_kpi.kpi_description,form_kpi.assessment_form_kpi_expected as expected,form_kpi.assessment_form_kpi_measurement_criteria as measurement,
        form_kpi.assessment_form_kpi_weightage as weightage,form_kpi.assessment_form_id as form_id,form_kpi.assessment_form_cascaded_kpi_id as form_kpi_id,
        form_kpi.assessment_form_kpi_type as type
        from hcms_ta_assessment_form_kpi as form_kpi
        inner join hcms_ta_kpi as ta_kpi on ta_kpi.id=form_kpi.assessment_form_cascaded_kpi_id
        inner join hcms_ta_assessment_form as ass_form on ass_form.id=form_kpi.assessment_form_id
        where form_kpi.is_active='True' and ta_kpi.is_active='TRUE' and form_kpi.assessment_form_kpi_type='Cascaded' 
        and form_kpi.assessment_form_id=%s and ass_form.assessment_category_refitem_id=%s""",(str(selected_form_id),str(selected_category),))
               cascade_kpi_dict=dictfetchall(cur)
               cur.execute("select assessment_template_name as template_name,id as template_id from hcms_ta_assessment_template where is_active='True' and assessment_category_refitem_id="+str(selected_category),)
               template_data=dictfetchall(cur)
               if template_data:
                    json_data['template_name']=template_data
               if cascade_kpi_dict or role_kpi_dict:
                  json_data['role_kpi']=role_kpi_dict
                  json_data['cascade_kpi']=cascade_kpi_dict
                  json_data['status']='NTE_01'
               else:
                 cur.execute("select assessment_template_name as template_name,id as template_id from hcms_ta_assessment_template where is_active='True' and assessment_category_refitem_id="+str(selected_category),)
                 template_data=dictfetchall(cur)
                 if template_data:
                    json_data['template_name_list']=template_data
                    template_id=template_data[0]['template_id']
                    if template_id:
                        cur.execute(query.fetch_hcms_query(config.assessment_module,config.template_based_data),(str(template_id),));
                        template_kpi_data=dictfetchall(cur)
                        if template_kpi_data:
                           for i in template_kpi_data:
                                kpi_dict={}
                                kpi_dict['expected']=i['expected']
                                kpi_dict['measurement']=i['measurement']
                                kpi_dict['type']=i['kpi_type']
                                kpi_dict['id']=i['kpi_id']
                                if i['kpi_type']=='Role':
                                    cur.execute(query.fetch_hcms_query(config.assessment_module,config.form_role_kpi),(str(i['kpi_id']),));
                                    kpi_data=dictfetchall(cur)
                                    if kpi_data:
                                        kpi_dict['kpi_description']=kpi_data[0]['kpi_description']
                                        kpi_dict['target']=kpi_data[0]['type']
                                if i['kpi_type']=='Cascaded':
                                      cur.execute(query.fetch_hcms_query(config.assessment_module,config.form_cascaded_kpi),(str(i['kpi_id']),));
                                      kpi_data=dictfetchall(cur)
                                      if kpi_data:
                                         kpi_dict['kpi_description']=kpi_data[0]['kpi_description']
                                         kpi_dict['target']=kpi_data[0]['type']
                                kpi_list.append(kpi_dict)
                        json_data['kpi_data_list']=kpi_list
                        json_data['status']='NTE_02'
                    else:
                        json_data['status']='template_id is missing'
                        json_data['template_name']=[]
                        json_data['kpi_data']=[]  
         else:
             json_data['status']="session expired"
             json_data['template_name']=[]
             json_data['kpi_data']=[]
    except Exception as e:
        json_data[config.status] = e
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value) 