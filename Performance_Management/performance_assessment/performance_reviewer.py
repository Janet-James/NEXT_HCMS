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

def assessor_type_view(request):
    '''
    22-AUG-2018 || ESA || To Fetch the assessor type List
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse to return the success or error message
    '''
    json_data = {}    
    try:
        cur = connection.cursor()
        review_type=request.POST.get('review_type')
        assessment_form_id=request.POST.get('assessment_form_id')
        if assessment_form_id:
            cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.form_details).format(assessment_form_id))
            form_data = dictfetchall(cur)
            json_data['employee_data']=form_data
            cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.assessor_info_detail),(assessment_form_id,)) 
            assessor_info_detail=dictfetchall(cur)
            json_data['assessor_info_detail']=assessor_info_detail
            cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.assessor_matrix_detail),(assessment_form_id,))
            assessor_matrix_detail=dictfetchall(cur)
            json_data['assessor_matrix_detail']=assessor_matrix_detail
        else:
            json_data['employee_data']=''
            json_data['assessment_type']=''
            json_data['assessor_info_detail']=''
            json_data['assessor_matrix_detail']='' 
            
        if review_type=="360" or review_type=='':
            cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.excluded_assessor_type_fetch)) 
            assessor_type_list=dictfetchall(cur)
            json_data['status']="Success"
            json_data['assessor_type_list']=assessor_type_list
    except Exception as e:    
        result = e
        json_data['assessor_type_list']=[]
        json_data['employee_data']=''
        json_data['assessment_type']=''
        json_data['assessor_info_detail']=''
        json_data['assessor_matrix_detail']='' 
        logger_obj.info("assessor_type_view details exception as"+ str(result) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def assessment_form_detail_fetch(request):
    '''
    26-Feb-2018 || JAN || To Fetch the form and matrix data
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse to return the success or error message
    '''
    json_data = {} 
    try:
        cur = connection.cursor()
        assessment_form_id=request.POST.get('assessment_form_id');
        if assessment_form_id:
           cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.form_details).format(assessment_form_id))
           form_data = dictfetchall(cur)
           json_data['employee_data']=form_data
           json_data['status']=status_keys.SUCCESS_STATUS
    except Exception as e:    
        result = e
        logger_obj.info("assessment_form_detail_fetch exception as"+ str(result) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def reviewer_employee_search(request):
    '''
    23-AUG-2018 || ESA || To Fetch the employee search
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse to return the success or error message
    '''
    json_data = {} 
    try:
        cur = connection.cursor()
        org_id=request.GET.get('org_id');
        org_unit_id=request.GET.get('org_unit_id');
        dep_id=request.GET.get('dep');
#         if org_id!='0':
#            cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.org_employe_search).format(org_id))
#            employee_data = dictfetchall(cur)
#         if org_unit_id!='0':
#            cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.org_unit_employe_search).format(org_unit_id))
#            employee_data = dictfetchall(cur)
#         if dep_id!='0':
#            cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.dep_employe_search).format(dep_id))
#            employee_data = dictfetchall(cur)
        cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.employe_search))
        employee_data = dictfetchall(cur)
        json_data['employee']=employee_data
    except Exception as e:    
        result = e
        logger_obj.info("reviewer_employee_search exception as"+ str(result) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def assessment_reviewer_access_insert(request):
    '''
    24-AUG-2018 || ESA || To insert access permission
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
        access_matrix=json.loads(access_data) 
        if access_matrix:
           for content_role_id , content_values in access_matrix.iteritems():
                for role_id, role_value in content_values.iteritems():
                  if role_value == True:
                     cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.access_matrix_exsist),(content_role_id,role_id,form_id,))
                     exsist_matrix=dictfetchall(cur)
                     if not exsist_matrix:
                         cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.access_matrix_insert),(content_role_id,role_id,form_id,request.user.id,request.user.id,)) 
                     else:
                        cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.access_matrix_exsist),(content_role_id,role_id,form_id,))
                        exsist_matrix_data=dictfetchall(cur) 
                  else:
                      cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.access_matrix_exsist),(content_role_id,role_id,form_id,))
                      exsist_matrix_data=dictfetchall(cur) 
                      if exsist_matrix_data:
                          cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.access_matrix_remove),(str(request.user.id),str(exsist_matrix_data[0]['id']),))
        if assessor_data:
           cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.assesser_remove),(str(request.user.id),str(form_id)))
           for obj in assessor_data:
               for i in obj['assessor_id']:
                    cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.exsist_assesser_exsist),(form_id,obj['assessor_type_id'],i,))
                    assesser_exsist=dictfetchall(cur)
                    if assesser_exsist:
                       exsist_id=assesser_exsist[0]['id']
                       if exsist_id:
                         cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.assessor_info_update),(form_id,obj['assessor_type_id'],i,request.user.id,exsist_id,))
                    else:
                        cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.assessor_info_insert),(form_id,obj['assessor_type_id'],i,request.user.id,)) 
        json_data["status"] = status_keys.SUCCESS_STATUS
        logger_obj.info("Assessment_access_insert(), Save/Edit of Access matrix and assessor info response is "+ str(json_data) +" attempted by "+str(request.user.username))  
    except Exception as e:
        json_data['status'] = e
        logger_obj.info("Assessment_access_insert(), Save/Edit of Access matrix and assessor info exception occurred as "+ str(json_data) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data), content_type="application/json")            