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

class HCMSPerformanceFormView(TemplateView):  #Added- ESA-17AUG2018
    ''' 
    16-AUG-2018 || ESA || To HCMS Performance assessment form page loaded.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HCMSPerformanceFormView, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Assessment Form Setup', self.request.user.id)
        if macl:
            template_name = "performance_management/performance_form.html"
        else:
            template_name = "tags/access_denied.html"
        return [template_name]
    
    def get(self, request, *args, **kwargs):
        cur=connection.cursor() 
        context = super(HCMSPerformanceFormView, self).get_context_data(**kwargs)
        try:
            cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.fetch_organization_details_view))
            org_info=dictfetchall(cur)
            context[config.organization]=org_info
            logger_obj.info("Assessment form Page Load  attempted by "+str(request.user.username))    
        except Exception as e:
            context[config.exception] = e
            logger_obj.info("Assessment form Load data exception"+ str(e) +" attempted by "+str(request.user.username))    
        cur.close()    
        return self.render_to_response(context)
    
def org_unit_employee(request):
    ''' 
    16-AUG-2018 || ESA || To Fetch the orgunit based employee.
    @param request: Request Object
    @type request : Object
    @return:   return the employee details
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    try:
        if current_user_id:
            org_unit_id=request.GET.get(config.org_unit_id)
            if org_unit_id:
                cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.fetch_org_unit_employee_details_view).format(org_unit_id))
                employee_data = dictfetchall(cur)
                if employee_data:
                    json_data[config.employee]=employee_data
                else:
                    json_data[config.employee]=[]
                logger_obj.info("Organization Unit based employee details  attempted by "+str(request.user.username))
            else:
                json_data[config.employee]=[]
                logger_obj.info("Organization Unit based employee details  attempted by "+str(request.user.username))
        else :
            json_data[config.employee]=[]
            json_data[config.status]='001' 
    except Exception as e:
        result = e
        json_data[config.employee]=[]
        logger_obj.info("Organization Unit based employee details exception as"+ str(result) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def employee_role(request):
    ''' 
    16-AUG-2018 || ESA || To Fetch the employee based role.
    @param request: Request Object
    @type request : Object
    @return:   return the employee details
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    try:
        if current_user_id:
            employee_id=request.GET.get(config.employee_id)
            year=request.GET.get('year')
            year_id=request.GET.get('year_id')
            quarter=request.GET.get('quarter')
            start_date=''
            end_date=''
            if quarter and year:
               if quarter=='1':
                   start_date=year+'-'+'01'+'-'+'01'
                   end_date=year+'-'+'03'+'-'+'31'
               if quarter=='2':
                   start_date=year+'-'+'04'+'-'+'01'
                   end_date=year+'-'+'06'+'-'+'30'
               if quarter=='3':
                   start_date=year+'-'+'07'+'-'+'01'
                   end_date=year+'-'+'09'+'-'+'30'
               if quarter=='4':
                   start_date=year+'-'+'10'+'-'+'01'
                   end_date=year+'-'+'12'+'-'+'31'
            if employee_id:
                cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.fetch_employee_exsist_KR_details),(str(employee_id),str(year_id),str(quarter),));
                exsist_kr_details = dictfetchall(cur)
                if exsist_kr_details:
                   json_data['exsist_kr']=exsist_kr_details
                   json_data['form_id']=exsist_kr_details[0]['form_id']
                else:
                   cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.fetch_employee_KR_details),(str(start_date),str(end_date),str(employee_id),));
                   kr_details = dictfetchall(cur)
                   if kr_details:
                       json_data['kr']=kr_details
                   else:
                       json_data['kr']=[]
                       # fetch employee role
                cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.fetch_employee_role_details).format(employee_id))
                employee_role_details = dictfetchall(cur)
                if employee_role_details:
                    json_data[config.employee_role]=employee_role_details
                else:
                    json_data[config.employee_role]=[]
                    json_data['kr']=[]
                    json_data['exsist_kr']=[]
                logger_obj.info("Employee based role details  attempted by "+str(request.user.username))
            else:
                json_data[config.employee_role]=[]
                json_data['kr']=[]
                json_data['exsist_kr']=[]
                logger_obj.info("Employee based role details attempted by "+str(request.user.username))
        else :
            json_data[config.employee_role]=[]
            json_data['kr']=[]
            json_data['exsist_kr']=[]
            json_data[config.status]='001' 
    except Exception as e:
        result = e
        json_data[config.employee_role]=[]
        logger_obj.info("Employee based role details exception as"+ str(result) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)
    
def assessment_form_save(request):
    ''' 
            16-AUG-2018 || ESA || To save assessment form data
            @param request: Request Object
            @type request : Object
            @return:  return the success message for save
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    try:
        if current_user_id:
            year=request.POST.get('year')
            quarter=request.POST.get('quarter')
            organizations=request.POST.get('organizations')
            org_unit=request.POST.get('org_unit')
            employee_name=request.POST.get('employee_name')
            update_id=request.POST.get('clicked_row_id')
            kpi_table=request.POST.get('kpi')
            kpi_data=json.loads(kpi_table)
            kpi_list=kpi_data['kpi_data']
            if update_id:
                if year and quarter  and organizations and  employee_name and org_unit:
                   cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.assessment_form_update),(str(current_user_id),str(year),str(quarter),str(organizations),
                                                    str(org_unit),str(employee_name),str(update_id),))
                   json_data['status']=status_keys.UPDATE_STATUS
                   cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.assessment_form_kpi_remove),(str(current_user_id),str(update_id)))
                   for i in kpi_list:
                     if  i['orgin']=='Cascaded':
                        cur.execute("select id from hcms_pm_assessment_form_kra where assessment_form_okr_kra_id=%s and assessment_form_id=%s",(str(i['id']),str(update_id),))
                        exsist_data=dictfetchall(cur)
                        if exsist_data:
                            exsist_id=exsist_data[0]['id']
                            if exsist_id:
                               cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.assessment_cascaded_kpi_update),(str(current_user_id),str(i['weightage']),str(exsist_id),))
                               return_kpi_update=dictfetchall(cur)
                        else:
                            cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.assessment_cascaded_kpi_save),(str(current_user_id),str(update_id),str(i['weightage']),str(i['id']),
                                            'TRUE'))
                            data = dictfetchall(cur)
                            cascaded_id=data[0]['id']
                     if  i['orgin']=='Role':
                        cur.execute("select id from hcms_pm_assessment_form_kra where assessment_form_role_kra_id=%s and assessment_form_id=%s",(str(i['id']),str(update_id),))
                        exsist_role_data=dictfetchall(cur)
                        if exsist_role_data:
                           exsist_kpi_id=exsist_role_data[0]['id']
                           if exsist_kpi_id:
                              cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.assessment_role_kpi_update),(str(current_user_id),str(i['weightage']),str(exsist_kpi_id),))
                              return_role_kpi_update=dictfetchall(cur)
                        else:
                            cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.assessment_role_kpi_save),(str(current_user_id),str(update_id),str(i['weightage']),str(i['id']),
                                            'TRUE'))
                            data = dictfetchall(cur)
                            cascaded_id=data[0]['id'] 
                               
                else:
                   json_data['status']=status_keys.FAILURE_STATUS 
                logger_obj.info("Assessment Form Data Update status attempted by "+str(request.user.username))  
                     
            else:
                if year and quarter  and organizations and  employee_name and org_unit:
                   cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.assessment_form_save),(str(current_user_id),str(year),str(quarter),str(organizations),str(org_unit),str(employee_name),
                                            'TRUE','TRUE'))
                   res = dictfetchall(cur)
                   inserted_id=res[0]['id']
                   cascaded_id=''
                   for i in kpi_list:
                       if  i['orgin']=='Cascaded':
                         cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.assessment_cascaded_kpi_save),(str(current_user_id),str(inserted_id),str(i['weightage']),str(i['id']),
                                            'TRUE'))
                         data = dictfetchall(cur)
                         cascaded_id=data[0]['id']
                       if  i['orgin']=='Role':
                         cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.assessment_role_kpi_save),(str(current_user_id),str(inserted_id),str(i['weightage']),str(i['id']),
                                            'TRUE'))
                         data = dictfetchall(cur)
                         cascaded_id=data[0]['id']
                   if inserted_id and cascaded_id:
                       json_data[config.status]=status_keys.SUCCESS_STATUS
                   else:
                        json_data[config.status]=status_keys.FAILURE_STATUS
                else:
                    json_data[config.status]=status_keys.FAILURE_STATUS 
                logger_obj.info("Assessment Form Data Save Status"+ str(json_data) +" attempted by "+str(request.user.username))  
        else:
            json_data[config.status]='001'  
    except Exception as e:
         result = e
         logger_obj.info("Assessment Form Data Save exception"+ str(result) +" attempted by "+str(request.user.username))  
         json_data[config.exception]=str(result)
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def assessment_form_view(request):
    ''' 
            16-AUG-2018 || ESA || To Show assessment form data
            @param request: Request Object
            @type request : Object
            @return:  return the form data
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    try:
        if current_user_id:
           cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.assessment_form_record))
           assessment_form_details = dictfetchall(cur)
           if assessment_form_details:
                json_data[config.assessment_form_data]=assessment_form_details
           else:
                json_data[config.assessment_form_data]=[]
           logger_obj.info("Assessment form fetch data  attempted by "+str(request.user.username))
        else:
            json_data[config.assessment_form_data]=[]
    except Exception as e:
        result = e
        json_data[config.assessment_form_data]=[]
        logger_obj.info("Assessment form  Details fetch data in exception as"+ str(result) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def assessment_form_fetch(request):
    ''' 
            16-AUG-2018 || ESA || To fetch assessment form data
            @param request: Request Object
            @type request : Object
            @return:  return the form data
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    form_id=request.POST.get('selected_id')
    try:
        if current_user_id and form_id:
            cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.assessment_selected_data_fetch).format(form_id))
            assessment_details = dictfetchall(cur)
            if assessment_details:
                json_data[config.assessment_record]=assessment_details
            else:
                json_data[config.assessment_record]=[]
            logger_obj.info("Assessment form fetch data  attempted by "+str(request.user.username))
        else:
            json_data[config.assessment_record]=[]
    except Exception as e:
        result = e
        json_data[config.assessment_record]=[]
        logger_obj.info("Assessment form  Details fetch data in exception as"+ str(result) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def assessment_form_delete(request):
    ''' 
            16-AUG-2018 || ESA || To remove assessment form data
            @param request: Request Object
            @type request : Object
            @return:  return the success message
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    try:
      if current_user_id:
        remove_id=request.POST.get('remove_id')
        if remove_id:
             cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.assessment_form_remove),(str(current_user_id),str(remove_id)))
             cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.assessment_form_kpi_remove),(str(current_user_id),str(remove_id)))
             json_data['status']=status_keys.REMOVE_STATUS
        else:
            json_data['status']=status_keys.FAILURE_STATUS
        logger_obj.info("Assessment form  Details remove status"+ str(json_data) +" attempted by "+str(request.user.username))  
      else:
            json_data['status']='001'
    except Exception as e:
         result = e
         json_data['status']=[]
         logger_obj.info("Assessment form  Details remove exception"+ str(result) +" attempted by "+str(request.user.username))  
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value) 

def cascading_objectives_view(request):
    ''' 
            20-AUG-2018 || ESA || To load the objectives data
            @param request: Request Object
            @type request : Object
            @return:  return the success message
    '''
    json_data={}
    org_data_list = []
    orgunit_data_list = []
    team_data_list = []
    current_user_id=request.user.id
    cur = db_connection()
    try:
        if current_user_id:
            cur.execute(""" select CONCAT(id, 'org') as id,name as text,'#' as parent from organization_info """)
            org_data = dictfetchall(cur)
            for i in org_data:
                chid_org_dict = {}
                chid_org_dict['parent'] = i['id']
                chid_org_dict['id'] = 'orgunit'+str(i['id'])
                chid_org_dict['text'] = 'Organization Unit'
                chid_obj_dict = {}
                chid_obj_dict['parent'] = i['id']
                chid_obj_dict['id'] = 'obj'+str(i['id'])
                chid_obj_dict['text'] = 'Objectives'
                org_data_list.append(chid_obj_dict)
                org_data_list.append(chid_org_dict)
             
            cur.execute(""" select CONCAT(id, 'orgunit') as id, CONCAT('orgunit' , organization_id, 'org') as parent, orgunit_name as text from organization_unit_info """)
            orgunit_data = dictfetchall(cur)
            for i in orgunit_data:
                chid_org_dict = {}
                chid_org_dict['parent'] = i['id']
                chid_org_dict['id'] = 'team'+str(i['id'])
                chid_org_dict['text'] = 'Division'
                chid_obj_dict = {}
                chid_obj_dict['parent'] = i['id']
                chid_obj_dict['id'] = 'obj'+str(i['id'])
                chid_obj_dict['text'] = 'Objectives'
                orgunit_data_list.append(chid_obj_dict)
                orgunit_data_list.append(chid_org_dict)
                        
            cur.execute(""" select CONCAT(hpso.id ,'obj') as id, CONCAT('obj', oui.organization_id, 'org') as parent, hpso.strategic_objective_description as text from hcms_pm_strategic_objectives hpso 
            inner join organization_unit_info oui on oui.id = hpso.organization_unit_id """)
            objectives_org_data = dictfetchall(cur)
            
            cur.execute(""" select CONCAT(id,'team') as id, CONCAT('team',org_unit_id, 'orgunit') as parent, name as text from team_details_info """)
            team_data = dictfetchall(cur)
            for i in team_data:
                chid_org_dict = {}
                chid_org_dict['parent'] = i['id']
                chid_org_dict['id'] = 'emp'+str(i['id'])
                chid_org_dict['text'] = 'Employee'
                chid_obj_dict = {}
                chid_obj_dict['parent'] = i['id']
                chid_obj_dict['id'] = 'obj'+str(i['id'])
                chid_obj_dict['text'] = 'Objectives'
                team_data_list.append(chid_obj_dict)
                team_data_list.append(chid_org_dict)
            
            cur.execute(""" select CONCAT(hpso.id ,'obj') as id, CONCAT('obj',ti.org_unit_id,'orgunit') as parent, hpso.strategic_objective_description as text from hcms_pm_strategic_objectives hpso 
            inner join team_details_info ti on ti.id = hpso.department_id """)
            objectives_team_data = dictfetchall(cur)    
                  
            cur.execute(""" select CONCAT(id,'emp') as id, CONCAT('emp',team_name_id,'team') as parent, name as text from employee_info """)
            employee_data = dictfetchall(cur)
            
            cur.execute(""" select CONCAT(hpso.id ,'obj') as id, CONCAT('obj',ei.team_name_id,'team') as parent, hpso.strategic_objective_description as text from hcms_pm_strategic_objectives hpso 
            inner join employee_info ei on ei.id = hpso.employee_id """)
            objectives_employee_data = dictfetchall(cur)
            
            json_data['objective_data'] = org_data + orgunit_data + team_data + employee_data + objectives_team_data + objectives_employee_data + objectives_org_data
            json_data['common_data'] = org_data_list + orgunit_data_list + team_data_list
            
            json_data['status']=status_keys.REMOVE_STATUS
        else:
            json_data['status']='001'
            
#         logger_obj.info("Assessment form  Details remove status"+ str(json_data) +" attempted by "+str(request.user.username))  

    except Exception as e:
        result = e
        json_data['status']=[]
        logger_obj.info("Assessment form  Details remove exception"+ str(e) +" attempted by "+str(request.user.username))  
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)     

def role_kpi_fetch(request):
    ''' 
            20-AUG-2018 || ESA || To fetch the role kpi details
            @param request: Request Object
            @type request : Object
            @return:  return the data
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    try:
      if current_user_id:
        role_id=request.POST.get('selected_role_id')
        if role_id:
             cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.role_kpi_fetch).format(role_id))
             role_kpi_data=dictfetchall(cur)
             if role_kpi_data:
                  json_data['role_kpi']=role_kpi_data
             else :
                json_data['role_kpi']=[]
        else:
            json_data['role_kpi']=[]
        logger_obj.info("Assessment form  role details attempted by "+str(request.user.username))  
      else:
            json_data['status']='001'
            json_data['role_kpi']=[]
    except Exception as e:
         result = e
         json_data['status']=[]
         json_data['role_kpi']=[]
         logger_obj.info("Assessment form  role details"+ str(e) +" attempted by "+str(request.user.username))  
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value) 

def selected_role_kpi(request):
    ''' 
            20-AUG-2018 || ESA || To fetch the selected role kpi  details
            @param request: Request Object
            @type request : Object
            @return:  return the data
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    try:
      if current_user_id:
        array=request.POST.get('arrayOfValues')
        kpi_data=json.loads(array)
        kpi_list=kpi_data['id']
        kpi_data_list=[]
        for i in kpi_list:
            kpi_data_dict={}
            cur.execute('select id,kpi_definition from hcms_ti_role_kpi where is_active=TRUE and id=%s',i)
            kpi_data=dictfetchall(cur)
            if kpi_data:
                kpi_data_dict['id']=kpi_data[0]['id']
                kpi_data_dict['kpi_definition']=kpi_data[0]['kpi_definition']
                kpi_data_list.append(kpi_data_dict)
        json_data['kpi']=kpi_data_list
    except Exception as e:
         result = e
         json_data['status']=[]
         json_data['kpi']=[]
         logger_obj.info("Assessment form  role details"+ str(e) +" attempted by "+str(request.user.username))  
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value) 
