# -*- coding: utf-8 -*-
from __future__ import unicode_literals
 
import json
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from django.db.models.fields.related import ForeignKey 
from django.http.response import HttpResponse
from CommonLib import query
from django.db import connection
from CSD.JenkinsAPI import jenkins_fetch
from Talent_Assessment.talent_assessment.models import HCMS_TA_Assessment_Template,HCMS_TA_Assessment_Template_KPI,HCMS_TA_Assessment_Form,HCMS_TA_Assessor_Access_Matrix,HCMS_TA_Assessor_Info
from Talent_Inventory.talent_inventory.models import HCMS_TI_Role_Details
import config 
from CommonLib.lib import *
# for decoder function
from django.core import serializers
from django.core.serializers.json import DjangoJSONEncoder
from django.views.decorators.csrf import csrf_protect
import HCMS.settings as status_keys
import logging
import logging.handlers
logger_obj = logging.getLogger('logit')


def Assessor_type_view(request):
    '''
    24-Feb-2018 || JAN || To Fetch the assessor type List
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse to return the success or error message
    '''
    try:
        json_datas = {}    
        cur = connection.cursor()
        review_type=request.POST.get('review_type')
        assessment_form_id=request.POST.get('assessment_form_id')
        logger_obj.info("Assessor_type_view(), assessor type retrieval attempted by "+str(request.user.username))
        
        if assessment_form_id:
            form_instance=HCMS_TA_Assessment_Form.objects.get(id=assessment_form_id,is_active=True)
            json_datas['employee_name']=form_instance.assessment_form_employee.name
            json_datas['employee_id']=form_instance.assessment_form_employee.id
            json_datas['assessment_type']=form_instance.assessment_form_assessment_type
            cur.execute(query.fetch_hcms_query(config.assessment_module,config.assessor_info_detail),(assessment_form_id,)) 
            assessor_info_detail=dictfetchall(cur)
            json_datas['assessor_info_detail']=assessor_info_detail     
            cur.execute(query.fetch_hcms_query(config.assessment_module,config.assessor_matrix_detail),(assessment_form_id,))
            assessor_matrix_detail=dictfetchall(cur)
            json_datas['assessor_matrix_detail']=assessor_matrix_detail       
        else:
            json_datas['employee_name']= ''
            json_datas['employee_id']= ''
            json_datas['assessment_type']=''
            json_datas['assessor_info_detail']=''
            json_datas['assessor_matrix_detail']=''
        if review_type=="manager_review" or review_type=='':
            cur.execute(query.fetch_hcms_query(config.assessment_module,config.assessor_type_fetch)) 
        else:
            cur.execute(query.fetch_hcms_query(config.assessment_module,config.excluded_assessor_type_fetch)) 
        assessor_type_list=dictfetchall(cur)
        json_datas['status']="Success"
        json_datas['assessor_type_list']=assessor_type_list
        
        logger_obj.info("Assessor_type_view(), fetched response is"+ str(json_datas) +" attempted by "+str(request.user.username))
    except Exception as e:
        json_datas['status'] = e
        logger_obj.info("Assessor_type_view(), Exception occurs"+ str(json_datas) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_datas,cls=DjangoJSONEncoder), content_type="application/json")



def Assessment_access_insert(request):
    '''
    24-Feb-2018 || JAN || To insert access permission
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse to return the success or error message
    '''
    json_data = {} 
    try:
        cur = connection.cursor()
        logger_obj.info("Assessment_access_insert(), Access matrix and assessor info storage and update attempted by "+str(request.user.username))   
        access_data=request.POST.get('access_data')
        form_id=request.POST.get('form_id')
        assessor_data=json.loads(request.POST.get('assessor_info_list'))
        assessment_type=request.POST.get('assessment_type')
        form=HCMS_TA_Assessment_Form.objects.get(id=form_id)
        access_matrix=json.loads(access_data)
        if access_matrix:
            for content_role_id , content_values in access_matrix.iteritems():
                for role_id, role_value in content_values.iteritems():
                    if role_value == True:
                        assessor_access_info = HCMS_TA_Assessor_Access_Matrix.objects.filter(assessor_viewer_role_id=role_id, assessor_view_role_id=content_role_id,hcms_tm_assessment_form=form_id)
                        if not assessor_access_info:
                            HCMS_TA_Assessor_Access_Matrix.objects.create(assessor_viewer_role_id=role_id, assessor_view_role_id= content_role_id,assessor_access=True,hcms_tm_assessment_form=form,created_by_id=request.user.id, modified_by_id=request.user.id)
                    else:
                        assessor_access_info = HCMS_TA_Assessor_Access_Matrix.objects.filter(assessor_viewer_role_id= role_id, assessor_view_role_id= content_role_id,hcms_tm_assessment_form=form).values('id')
                        if assessor_access_info:
                            HCMS_TA_Assessor_Access_Matrix.objects.filter(id=assessor_access_info[0]['id']).delete()
        if assessor_data:
            for obj in assessor_data:
                assessor_exists_check=HCMS_TA_Assessor_Info.objects.filter(assessor_assessment_form=form,assessor_type_refitem=obj['assessor_type_id'])
                if assessor_exists_check:
                    cur.execute(query.fetch_hcms_query(config.assessment_module,config.assessor_info_update),(form_id,assessment_type,obj['assessor_type_id'],obj['assessor_id'],request.user.id,list(assessor_exists_check.values('id'))[0]['id'],))
                else:
                    cur.execute(query.fetch_hcms_query(config.assessment_module,config.assessor_info_insert),(form_id,assessment_type,obj['assessor_type_id'],obj['assessor_id'],request.user.id,)) 
            HCMS_TA_Assessment_Form.objects.filter(id=form_id).update(assessment_form_assessment_type=assessment_type)
        json_data["status"] = status_keys.SUCCESS_STATUS
        logger_obj.info("Assessment_access_insert(), Save/Edit of Access matrix and assessor info response is "+ str(json_data) +" attempted by "+str(request.user.username))
    except Exception as e:
        json_data['status'] = e
        logger_obj.info("Assessment_access_insert(), Save/Edit of Access matrix and assessor info exception occurred as "+ str(json_data) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data), content_type="application/json")


def assessment_form_detail_fetch(request):
    '''
    26-Feb-2018 || JAN || To Fetch the form and matrix data
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse to return the success or error message
    '''
    json_data = {} 
#     try:
    cur = connection.cursor()
    logger_obj.info("assessment_form_detail_fetch(), Access matrix detail fetch "+str(request.user.username))   
    assessment_form_id=request.POST.get('assessment_form_id');
    if assessment_form_id:
          form_exists_check=HCMS_TA_Assessment_Form.objects.filter(id=assessment_form_id).exists()
          if bool(form_exists_check):
              form_instance=HCMS_TA_Assessment_Form.objects.get(id=assessment_form_id)
#               print"--------------",form_instance.assessment_form_employee
              json_data['employee_name']=form_instance.assessment_form_employee.name
              json_data['employee_id']=form_instance.assessment_form_employee.id
              json_data['assessment_type']=form_instance.assessment_form_assessment_type
           
              cur.execute(query.fetch_hcms_query(config.assessment_module,config.role_detail_fetch)) 
              role_detail_list=dictfetchall(cur)
              json_data['role_detail_list']=role_detail_list
              json_data['status']=status_keys.SUCCESS_STATUS
#               print"foreign key fetch", [field.rel.to for field in HCMS_TA_Assessment_Form._meta.fields if isinstance(field, ForeignKey)]
              logger_obj.info("assessment_form_detail_fetch(), Access matrix detail fetch response is "+ str(json_data) +" attempted by "+str(request.user.username))   
#     except Exception as e:
#         json_data['status'] = e 
    return HttpResponse(json.dumps(json_data), content_type="application/json")                                      
    

# Attendance Search views here

def reviewer_employee_search(request):
    ''' 
    24-Feb-2018 JAN Employee Info Search data loaded.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse Employee Search Data
    author: SND
     '''
    json_datas = {}
    cur=connection.cursor()  #create the database connection
    post = request.GET
    fname = post.get(config.f_name)  #get table key 
    lname = post.get(config.l_name)  #get table key 
    gender = post.get(config.g_name)  #get table key 
    id_no = post.get(config.id_no)  #get table key 
    try:
        query =  """select ei.id,ROW_NUMBER () OVER (ORDER BY ei.name),'<img src="/static/ui/images/avatar.png" alt="No Image Found" style="height: 30px;width: 30px;"/>',ei.name,ei.father_name,ei.employee_gender_id,ci.name from organization_info ci
                   inner join employee_info  ei on ci.id = ei.org_id_id"""
        conditions = " where ei.is_active and"
        if fname != config.null:
            conditions = conditions+" ei.name ilike '"'%'+str(fname)+'%'"' and"
        if lname != config.null:
            conditions = conditions+" ei.father_name ilike '"'%'+str(lname)+'%'"' and"
        if id_no != config.null:
            conditions = conditions+" ei.identification_no ilike '"'%'+str(id_no)+'%'"' and"
        if gender != config.null:
            conditions = conditions+" ei.employee_gender_id in ('"+str(gender)+"') and"
        conditions = conditions.rsplit(config.space, 1)[0]
        if cur and query and conditions:
            querys = (query+str(conditions+" order by ei.name")) 
            cur.execute(querys)  
            values = cur.fetchall()
            if values:
                json_datas[config.results] = values
            else:
                json_datas[config.results] = []
        else:
            json_datas[config.results] = []
        logger_obj.info("The Searched Data of Employee "+ str(json_datas) +" attempted by "+str(request.user.username))
                    
    except Exception as e:
        json_datas[config.results] = e
        logger_obj.info("The Searched Data of Employee result in exception as "+ str(e) +" attempted by "+str(request.user.username))
    cur.close()
    return HttpResponse(json.dumps(json_datas))
