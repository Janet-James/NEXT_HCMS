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
import cascading_objectives_config as config
from django.utils import datastructures
logger_obj = logging.getLogger('logit')

class HCMSCascadingObjectiveFormView(TemplateView):  #Added- SND-21Aug2018
    ''' 
    21-AUG-2018 || SND || To HCMS Cascading Objectives page loaded.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HCMSCascadingObjectiveFormView, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Cascade Objectives', self.request.user.id)
        if macl:
            template_name = config.cascading_objectives_template
        else:
            template_name = "tags/access_denied.html"
        return [template_name]
    
    def get(self, request, *args, **kwargs):
        cur=connection.cursor()
        cur.execute("select id,name from organization_info where is_active = true") 
        organization_data = dictfetchall(cur)
        cur.execute("select org_id_id as org_id from employee_info where is_active = true and related_user_id_id = {0}".format(request.user.id)) 
        user_data = dictfetchall(cur)
        context = super(HCMSCascadingObjectiveFormView, self).get_context_data(**kwargs)
        context['organization_data']=organization_data
        if user_data:
		context['user_data']=user_data[0]
        return self.render_to_response(context)
    
def listFormation(data,string1):   
    org_data_list = [] 
    for i in data:
        for j in string1.keys() : 
            chid_dict = {}
            chid_dict[config.parent] = i[config.id]
            chid_dict[config.id] = j+str(i[config.id])
            chid_dict[config.text] = string1[j]
            org_data_list.append(chid_dict)
    return org_data_list

def kr_listFormation(data):
    cur = db_connection()
    kr_list = []
    kr_data_list = []
    for i in data:
        cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.cascading_objective_key_result).format((i['id'].split('obj'))[0]))
        obj_kr = dictfetchall(cur)
        if obj_kr:
            kr_list = kr_list + listFormation([i],{'kr':'KR'}) + obj_kr
    return kr_list

def cascading_orgunit_fetch(request):
    ''' 
            16-OCT-2018 || SND || To load the Organization Unit data
            @param request: Request Object
            @type request : Object
            @return:  return the success message and Organization Unit data
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    try:
        if current_user_id:
            cascading_org = request.GET.get(config.cascading_org,'')
            
            if cascading_org!='':
                cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.cascading_organization_unit).format(cascading_org,))   
                org_unit = dictfetchall(cur)
              
            json_data[config.org_unit_data] = org_unit
            json_data[config.status]='NTE-01'
        
        else:
            json_data[config.status]='001'
            
        logger_obj.info("Cascading Details Organization Unit fetch status"+ str(json_data[config.status]) +" attempted by "+str(request.user.username))  

    except Exception as e:
        result = e
        json_data[config.status]=[]
        logger_obj.info("Cascading Details Organization Unit fetch exception"+ str(e) +" attempted by "+str(request.user.username))  
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def cascading_division_fetch(request):
    ''' 
            16-OCT-2018 || SND || To load the Division data
            @param request: Request Object
            @type request : Object
            @return:  return the success message and Division data
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    try:
        if current_user_id:
            cascading_org_unit = request.GET.get(config.cascading_org_unit,'')
            
            if cascading_org_unit!='':
                cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.cascading_team).format(cascading_org_unit,))   
                org_unit = dictfetchall(cur)
              
            json_data[config.division_data] = org_unit
            json_data[config.status]='NTE-01'
        
        else:
            json_data[config.status]='001'
            
        logger_obj.info("Cascading Details Organization Unit fetch status"+ str(json_data[config.status]) +" attempted by "+str(request.user.username))  

    except Exception as e:
        result = e
        json_data[config.status]=[]
        logger_obj.info("Cascading Details Organization Unit fetch exception"+ str(e) +" attempted by "+str(request.user.username))  
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def organization_unit(cascading_org,cascading_org_unit,data_list,org_data_list,kr_list,cascading_year,cascading_quarter,org_unit_parent,obj_org_unit_parent):
    cur = db_connection()
    cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.cascading_objective_organization_unit).format("= "+cascading_org_unit if int(cascading_org_unit)!=0 else "is not null","= "+cascading_org if int(cascading_org)!=0 else "is not null",org_unit_parent,)) 
    org_unit = dictfetchall(cur);
    data_list = data_list + org_unit
    org_data_list = org_data_list + listFormation(org_unit,{'team':'Division','obj':'Objectives'})
    
    cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.cascading_objective_organizationUnit_objectives_quarter).format(cascading_year,cascading_quarter,"= "+cascading_org_unit if int(cascading_org_unit)!=0 else "is not null","= "+cascading_org if int(cascading_org)!=0 else "is not null",org_unit_parent,))
    org_unit_obj = dictfetchall(cur)
    data_list = data_list + org_unit_obj
    kr_list = kr_list + kr_listFormation(org_unit_obj)
    return data_list,org_data_list,kr_list

def organization(cascading_org,data_list,org_data_list,kr_list,cascading_year,cascading_quarter,org_parent,obj_org_parent):
    cur = db_connection()
    cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.cascading_objective_organization).format("= "+cascading_org if int(cascading_org)!=0 else "is not null",org_parent,))
    data_list = dictfetchall(cur)
    org_data_list = org_data_list + listFormation(data_list,{'orgunit':'Organization Unit','obj':'Objectives'})
    
    cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.cascading_objective_organization_objectives_quarter).format(cascading_year,cascading_quarter,"= "+cascading_org if int(cascading_org)!=0 else "is not null",obj_org_parent,))    
    org_obj = dictfetchall(cur)
    data_list = data_list + org_obj
    kr_list = kr_list + kr_listFormation(org_obj)
    return data_list,org_data_list,kr_list

def division(cascading_org,cascading_org_unit,cascading_division,data_list,org_data_list,kr_list,cascading_year,cascading_quarter,division_parent,obj_division_parent):
    cur = db_connection()
    cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.cascading_objective_team).format("= "+cascading_division if int(cascading_division)!=0 else "is not null","= "+cascading_org if int(cascading_org)!=0 else "is not null","= "+cascading_org_unit if int(cascading_org_unit)!=0 else "is not null",division_parent,))
    team = dictfetchall(cur)
    data_list = data_list + team
    org_data_list = org_data_list + listFormation(team,{'emp':'Employee','obj':'Objectives'})
      
    cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.cascading_objective_team_objectives_quarter).format(cascading_year,cascading_quarter,"= "+cascading_division if int(cascading_division)!=0 else "is not null","= "+cascading_org if int(cascading_org)!=0 else "is not null","= "+cascading_org_unit if int(cascading_org_unit)!=0 else "is not null",obj_division_parent,))
    team_obj = dictfetchall(cur) 
    data_list = data_list + team_obj
    kr_list = kr_list + kr_listFormation(team_obj)
    return data_list,org_data_list,kr_list

def cascading_objectives_view_quarter(request):
    ''' 
            06-Sep-2018 || ESA || To load the objectives data
            @param request: Request Object
            @type request : Object
            @return:  return the success message
    '''
    json_data={}
    org_data_list = []
    kr_list = []
    data_list = []
    current_user_id=request.user.id
    cur = db_connection()
    try:
        if current_user_id:
            cascading_year = request.GET.get(config.cascading_year,'')
            cascading_quarter = request.GET.get(config.cascading_quarter,'')
            cascading_org = request.GET.get(config.cascading_org,'')
            cascading_org_unit = request.GET.get(config.cascading_org_unit,'')
            cascading_division = request.GET.get(config.cascading_division,'')
            
            if int(cascading_division)!=0 and int(cascading_org_unit)!=0 and int(cascading_org)!=0:
                division_parent = "'#'" 
                obj_division_parent = "CONCAT('obj',tdi.id,'team')"
                data_list,org_data_list,kr_list = division(cascading_org,cascading_org_unit,cascading_division,data_list,org_data_list,kr_list,cascading_year,cascading_quarter,division_parent,obj_division_parent)
                
            elif int(cascading_org_unit)!=0 and int(cascading_org)!=0:
                org_unit_parent = "'#'"
                obj_org_unit_parent = "CONCAT('obj',oui.id,'orgunit')"
                division_parent = "CONCAT('team',oui.id,'orgunit')"
                obj_division_parent = "CONCAT('obj',tdi.id,'team')"
                data_list,org_data_list,kr_list = organization_unit(cascading_org,cascading_org_unit,data_list,org_data_list,kr_list,cascading_year,cascading_quarter,org_unit_parent,obj_org_unit_parent)
                data_list,org_data_list,kr_list = division(cascading_org,cascading_org_unit,cascading_division,data_list,org_data_list,kr_list,cascading_year,cascading_quarter,division_parent,obj_division_parent)
                
            else:
                org_parent = "'#'"
                obj_org_parent = "CONCAT('obj',oi.id,'org')"
                org_unit_parent = "CONCAT('orgunit',oi.id,'org')"
                obj_org_unit_parent = "CONCAT('obj',oui.id,'orgunit')"
                division_parent = "CONCAT('team',oui.id,'orgunit')"
                obj_division_parent = "CONCAT('obj',tdi.id,'team')"
                data_list,org_data_list,kr_list = organization(cascading_org,data_list,org_data_list,kr_list,cascading_year,cascading_quarter,org_parent,obj_org_parent)
                data_list,org_data_list,kr_list = organization_unit(cascading_org,cascading_org_unit,data_list,org_data_list,kr_list,cascading_year,cascading_quarter,org_unit_parent,obj_org_unit_parent)
                data_list,org_data_list,kr_list = division(cascading_org,cascading_org_unit,cascading_division,data_list,org_data_list,kr_list,cascading_year,cascading_quarter,division_parent,obj_division_parent)
            
            cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.cascading_objective_employee).format("= "+cascading_division if int(cascading_division)!=0 else "is not null","= "+cascading_org if int(cascading_org)!=0 else "is not null","= "+cascading_org_unit if int(cascading_org_unit)!=0 else "is not null"))   
            employee = dictfetchall(cur)
            data_list = data_list + employee
            org_data_list = org_data_list + listFormation(employee,{'obj':'Objectives'})
              
            cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.cascading_objective_employee_objectives_quarter).format(cascading_year,cascading_quarter,"= "+cascading_division if int(cascading_division)!=0 else "is not null","= "+cascading_org if int(cascading_org)!=0 else "is not null","= "+cascading_org_unit if int(cascading_org_unit)!=0 else "is not null"))          
            employee_obj = dictfetchall(cur)           
            data_list = data_list + employee_obj
            kr_list = kr_list + kr_listFormation(employee_obj)
             
            json_data[config.objective_data] = data_list + kr_list
            json_data[config.common_data] = org_data_list
            json_data[config.status]='NTE-01'
        
        else:
            json_data[config.status]='001'
            
        logger_obj.info("Assessment form  Details fetch status"+ str(json_data[config.status]) +" attempted by "+str(request.user.username))  

    except Exception as e:
        result = e
        json_data[config.status]=[]
        logger_obj.info("Assessment form  Details remove exception"+ str(e) +" attempted by "+str(request.user.username))  
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)
