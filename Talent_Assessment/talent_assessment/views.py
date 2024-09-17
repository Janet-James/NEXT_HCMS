# -*- coding: utf-8 -*-
from __future__ import unicode_literals
 
import json
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
# from django.views.decorators.csrf import csrf_exempt
from django.http.response import HttpResponse
from CommonLib import query
from django.db import connection
from CSD.JenkinsAPI import jenkins_fetch
import config 
from CommonLib.lib import *
# for decoder function
from django.core import serializers
from django.core.serializers.json import DjangoJSONEncoder
import HCMS.settings as status_keys

import logging
import logging.handlers
logger_obj = logging.getLogger('logit')


# from UAM.uam_session_sync import uam_sessions_sync
# from UAM.uam_func_data_sync import uam_func_sync
# from tracking.models import Visitor

class HCMStalentperformanceassessmentView(TemplateView):  #Added- Esakkiprem-07Feb2018
    ''' 
    09-Feb-2018 || ESA || To HCMS assessment performance page loaded.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
      
    template_name = "talent_assessment/performance_assessment.html"
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HCMStalentperformanceassessmentView, self).dispatch(request, *args, **kwargs)
     
    def get(self, request, *args, **kwargs):
        context = super(HCMStalentperformanceassessmentView, self).get_context_data(**kwargs)
        return self.render_to_response(context)
    
def report_employee_search(request):
        ''' 
        15-Feb-2018 SND Employee Info Search data loaded.
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
            query =  """select ei.id,ROW_NUMBER () OVER (ORDER BY ei.name),'<input type="checkbox" />','<img src="/static/ui/images/avatar.png" alt="No Image Found" style="height: 30px;width: 30px;"/>',ei.name,ei.father_name,ei.employee_gender_id,ci.name from organization_info ci
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
            json_datas['status']='0'
            logger_obj.info("The Searched Data of Employee "+ str(json_datas) +" attempted by "+str(request.user.username))
                        
        except Exception as e:
            json_datas[config.results] = e
            json_datas['status']='1'
            logger_obj.info("The Searched Data of Employee result in exception as "+ str(e) +" attempted by "+str(request.user.username))
        cur.close()
        return HttpResponse(json.dumps(json_datas))   
              
              
def org_unit(request):
    ''' 
         26-Feb-2018 ESA fetch data based on org unit
         @param request: Request Object
         @type request : Object
         @return:   HttpResponse Employee Search Data
         '''
    try:   
        json_datas = {}
        cur=connection.cursor() 
        org_unit_id = request.POST.get('organization_unit_type')
        selected_id=request.POST.get('selected_org')
        if selected_id is not None:
             selected_org_id=json.loads(selected_id)
             employee_list=[]
             for i in selected_org_id:
                 cur.execute(query.fetch_hcms_query(config.assessment_module,config.org_employee),(i,))
                 employee_name = dictfetchall(cur)
                 employee_dict={}
                 if employee_name:
                    employee_dict['id']=employee_name[0]['id']
                    employee_dict['name']=employee_name[0]['name']
                    employee_list.append(employee_dict)
             json_datas['employee_data'] = employee_list
        cur.execute(query.fetch_hcms_query(config.assessment_module,config.org_unit_role),(org_unit_id,))
        result_org = dictfetchall(cur)
        if result_org:
            json_datas[config.status] = result_org
            logger_obj.info("Objective Role Select"+ str(json_datas) +" attempted by "+str(request.user.username))
    except Exception as e:
        json_datas[config.status] = e
        logger_obj.info("Objective Role Select"+ str(e) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_datas))


def performance_table_view(request):
    ''' 
         26-Feb-2018 ESA fetch data for table view
         @param request: Request Object
         @type request : Object
         @return:   HttpResponse Employee Search Data
         '''
    try:
        json_data = {}
        cur=connection.cursor() 
        employee_id = request.POST.get('selected_employee_id')
        employee_data_list=[]
        if employee_id:
            employee_ids = json.loads(employee_id)
            for i in employee_ids:
                cur.execute(query.fetch_hcms_query(config.assessment_module,config.performance_form_table_view),(employee_ids[i]))
                employee_data=dictfetchall(cur)
                if employee_data:
                    employee_data_list.append(employee_data)
            json_data['employee_form_data']=employee_data_list
        else:
            json_data['employee_form_data']=[]
        print "ddddddddddddddd",json_data
    except Exception as e:
        json_datas[config.status] = e
        logger_obj.info("performance_table_view"+ str(e) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value) 


def performance_kpi(request):
    ''' 
         27-Feb-2018 ESA fetch kpi for list view
         @param request: Request Object
         @type request : Object
         @return:   HttpResponse Employee Search Data
         '''
    try:   
        json_data = {}
        cur=connection.cursor() 
        form_id = request.POST.get('clicked_row_id')
        employee_id = request.POST.get('employee_id')
        if form_id and employee_id:
            cur.execute(query.fetch_hcms_query(config.assessment_module,config.cascaded_kpi_details),(employee_id,form_id,))
            cascaded_kpi_data = dictfetchall(cur)
            cur.execute(query.fetch_hcms_query(config.assessment_module,config.role_kpi_details),(employee_id,form_id,))
            role_kpi_data = dictfetchall(cur)
            if cascaded_kpi_data:
                json_data['cascaded_data']=cascaded_kpi_data
            else:
                 json_data['cascaded_data']=[]
            if role_kpi_data:
                json_data['role_kpi_data']=role_kpi_data
            else:
                 json_data['role_kpi_data']=[]
        else:
            json_data['status']="data missing"
    except Exception as e:
        json_data[config.status] = e
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)


def performance_assessor_view(request):
    ''' 
             27-Feb-2018 ESA fetch assessor data based on form
             @param request: Request Object
             @type request : Object
             @return:   HttpResponse Employee Search Data
             '''
    try:   
       json_data = {}
       cur=connection.cursor() 
       form_id = request.POST.get('form_id')
       kpi_id = request.POST.get('kpi_id')
       kpi_type = request.POST.get('type_value')
       new_form_id = request.POST.get('new_form_id')
       current_user_id=request.user.id
       reference_id_list=[];
       ref_list=[];
       if current_user_id:
           cur.execute(query.fetch_hcms_query(config.assessment_module,config.current_user_role),(current_user_id,))
           current_employee_id = dictfetchall(cur)
           if form_id and current_employee_id:
               if current_employee_id:
                   current_user_employee_id=current_employee_id[0]['id']
                   cur.execute(query.fetch_hcms_query(config.assessment_module,config.assessor_data),(form_id,current_user_employee_id,))
                   assessor_details = dictfetchall(cur)
                   if assessor_details:
                       for i in assessor_details:
                           reference_id_list.append(i['refe_id'])
                   if reference_id_list:
                       cur.execute(query.fetch_hcms_query(config.assessment_module,config.hcms_ta_assessor_access_matrix),(current_user_employee_id,))
                       fetch_data=dictfetchall(cur)
                       if fetch_data:
                           for i in fetch_data:
                               ref_list.append(i['assessor_type_refitem_id'])
                       if ref_list:
#                            cur.execute(query.fetch_hcms_query(config.assessment_module,config.assessor_new_data),(form_id,tuple(reference_id_list),form_id,tuple(ref_list),))
                           cur.execute(query.fetch_hcms_query(config.assessment_module,config.access_assessor_new_data),(form_id,tuple(ref_list),))
                           new_assessor_details = dictfetchall(cur)
                           if new_assessor_details:
                               json_data['assessor_details']=new_assessor_details
                               json_data['user']=current_user_employee_id
                           else:
                               json_data['assessor_details']=[]
                               json_data['user']=current_user_employee_id
                   else:
                       json_data['assessor_details']=[]
                       json_data['user']=current_user_employee_id
               else:
                   json_data['assessor_details']=[]
                   json_data['user']=current_user_employee_id
                   
               if kpi_id and kpi_type:
                  if kpi_type=='0':
                      cur.execute(query.fetch_hcms_query(config.assessment_module,config.cascaded_schema_details),(kpi_id,))
                      cascaded_assessor_details = dictfetchall(cur)
                      cur.execute(query.fetch_hcms_query(config.assessment_module,config.view_cascaded_data),(form_id,new_form_id,))
                      cascaded_exsiste_data = dictfetchall(cur)
                      if cascaded_exsiste_data:
                           json_data['cascaded_exsiste_data']=cascaded_exsiste_data
                      else:
                           json_data['cascaded_exsiste_data']=[]
                      if cascaded_assessor_details:
                           json_data['cascaded_assessor_details']=cascaded_assessor_details
                      else:
                           json_data['cascaded_assessor_details']=[]
                  elif kpi_type=='1':
                      cur.execute(query.fetch_hcms_query(config.assessment_module,config.role_schema_details),(kpi_id,))
                      cascaded_assessor_details = dictfetchall(cur)
                      cur.execute(query.fetch_hcms_query(config.assessment_module,config.view_role_data),(form_id,new_form_id,))
                      role_exsist_data = dictfetchall(cur)
                      if role_exsist_data:
                           json_data['cascaded_exsiste_data']=role_exsist_data
                      else:
                           json_data['cascaded_exsiste_data']=[]
                      if cascaded_assessor_details:
                           json_data['cascaded_assessor_details']=cascaded_assessor_details
                      else:
                           json_data['cascaded_assessor_details']=[]
           else:
                json_data['status']='NTE_01'
                json_data['assessor_details']=[]
                json_data['cascaded_assessor_details']=[]
                json_data['cascaded_exsiste_data']=[]
       else:
            json_data['status']='NTE_00'
            json_data['assessor_details']=[]
            json_data['cascaded_assessor_details']=[]
            json_data['cascaded_exsiste_data']=[]
    except Exception as e:
        json_data[config.status] = e
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def performance_rating_save(request):
    ''' 
         28-Feb-2018 ESA save the performance rating data
         @param request: Request Object
         @type request : Object
         @return:   HttpResponse Employee Search Data
         '''
    try:
        json_data = {}
        cur=connection.cursor() 
        form_id = request.POST.get('form_id')
        kpi_id = request.POST.get('kpi_id')
        kpi_type = request.POST.get('type')
        assesser_id = request.POST.get('assesser_id')
        table_employee_id = request.POST.get('table_employee_id')
        scheme_rel_id = request.POST.get('scheme_rel_id')
        schema_id = request.POST.get('schema_id')
        feedback = request.POST.get('feedback')
        assessment_type_id = request.POST.get('assessment_type_id')
        selected_primary_id = request.POST.get('selected_primary_id')
        type_kpi=''
        if form_id and kpi_id and kpi_type and assesser_id and table_employee_id and scheme_rel_id and feedback and schema_id and assessment_type_id and selected_primary_id:
          if kpi_type=='0':
             type_kpi='Cascaded'
             cur.execute(query.fetch_hcms_query(config.assessment_module,config.performance_form_check),(selected_primary_id,form_id,assessment_type_id,'Cascaded',))
             exisit_id=dictfetchall(cur)
             if exisit_id:
                updated_id=exisit_id[0]['id']
                if updated_id:
                    cur.execute(query.fetch_hcms_query(config.assessment_module,config.update_performance_form),(selected_primary_id,type_kpi,feedback,form_id,assesser_id,schema_id,scheme_rel_id,table_employee_id,True,request.user.id,assessment_type_id,updated_id),)
                    json_data['success_status']=status_keys.UPDATE_STATUS
             else:
                cur.execute(query.fetch_hcms_query(config.assessment_module,config.performance_form_save),(selected_primary_id,type_kpi,feedback,form_id,assesser_id,schema_id,scheme_rel_id,table_employee_id,True,request.user.id,assessment_type_id),)
                json_data['success_status']=status_keys.SUCCESS_STATUS 
          if kpi_type=='1':
             type_kpi='role'
             cur.execute(query.fetch_hcms_query(config.assessment_module,config.performance_form_check),(selected_primary_id,form_id,assessment_type_id,type_kpi,))
             exisit_id=dictfetchall(cur)
             if exisit_id:
                 updated_id=exisit_id[0]['id']
                 if updated_id:
                    cur.execute(query.fetch_hcms_query(config.assessment_module,config.update_performance_form),(selected_primary_id,type_kpi,feedback,form_id,assesser_id,schema_id,scheme_rel_id,table_employee_id,True,request.user.id,assessment_type_id,updated_id),)
                    json_data['success_status']=status_keys.UPDATE_STATUS
             else:
                cur.execute(query.fetch_hcms_query(config.assessment_module,config.performance_form_save),(selected_primary_id,type_kpi,feedback,form_id,assesser_id,schema_id,scheme_rel_id,table_employee_id,True,request.user.id,assessment_type_id),)
                json_data['success_status']=status_keys.SUCCESS_STATUS 
        else:
            json_data['success_status']='NTE_00'
    except Exception as e:
        json_data[config.status] = e
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

# filter function
def org_unit_role(request):
    ''' 
    02-Mar-2018 || ESA || Load the Selected Role
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse to return the success or error message
    '''
    try:   
        json_datas = {}
        role_list = []
        cur=connection.cursor() 
        role_unique_id = request.POST.get('role_unique_id')
        data = json.loads(role_unique_id)
        for i in data:
            cur.execute("""select orgunit_type_id as orgunit_type from organization_unit_info  where id =%s and is_active='True'""",(i,))
            res_data = dictfetchall(cur)
            role_list.append(res_data[0]['orgunit_type'])
        data_value = tuple(role_list)
        cur.execute("""select re.id,re.role_title from hcms_ti_role_details re where re.role_org_unit_type_id in %s and re.is_active='True' """,(data_value,))
        result_org = dictfetchall(cur)
        json_datas[config.status] =  result_org
        logger_obj.info("Objective Role Select"+ str(json_datas) +" attempted by "+str(request.user.username))
    except Exception as e:
        json_datas[config.status] = e
        logger_obj.info("Objective Role Select"+ str(e) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_datas))

def filter_employee(request):
    ''' 
    02-Mar-2018 || ESA || Load the employee role
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse to return the success or error message
    '''
    try:   
        json_data = {}
        cur=connection.cursor() 
        employee_data_list=[]
        org_role_id = request.POST.get('role_id')
        role_data = json.loads(org_role_id)
        if role_data:
           cur.execute(query.fetch_hcms_query(config.assessment_module,config.filter_employee_data),(tuple(role_data),))
           employee_data=dictfetchall(cur)
           if employee_data:
              for j in employee_data:
                employee_data_dict={}
                if j:
                   employee_data_dict['employee_id']=j['id']
                   employee_data_dict['employee_name']=j['name']
                   employee_data_dict['employee_last_name']=j['last_name']
                   employee_data_list.append(employee_data_dict)
              if employee_data_list:  
                 json_data['employee_data']= employee_data_list       
           else:
              json_data['employee_data']=[]
        else:
          json_data['employee_data']=[]
    except Exception as e:
        json_data[config.status] = e
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)


def performance_search(request):
    ''' 
    05-Mar-2018 || ESA || search
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse to return the success or error message
    '''
    try:
        json_data = {}
        cur=connection.cursor() 
        org_unit_id = request.POST.get('unique_org_unit')
        org_role_id = request.POST.get('unique_role_id')
        org_employee_id = request.POST.get('unique_employee_id')
        search_data=''
        if org_unit_id is not None:
           org_unit_data = json.loads(org_unit_id)
        else:
           org_unit_data=''
        if org_role_id is not None:
           role_data = json.loads(org_role_id)
        else:
            role_data=''
        if org_employee_id is not None:
           employee_data = json.loads(org_employee_id)
        else:
            employee_data=''
        if  org_unit_data !='' and role_data!='' and employee_data!='':
              cur.execute("""select asset_temp.assessment_template_name as template_name,asset_form.id as form_id,ref_item.refitems_name as category_name,emp_info.id as employee_id,emp_info.name as employee_name,role_det.role_title as employee_role
            from employee_info as emp_info  
            inner join hcms_ti_role_details as role_det on role_det.id=emp_info.role_id_id
            inner join hcms_ta_assessment_form as asset_form on asset_form.assessment_form_employee_id=emp_info.id
            inner join reference_items as ref_item on ref_item.id=asset_form.assessment_category_refitem_id
            inner join hcms_ta_assessment_template as asset_temp on asset_temp.id=asset_form.assessment_form_template_id
            where  role_det.is_active='True' and ref_item.is_active='True' and asset_temp.is_active='True' and  asset_form.is_active='True' and emp_info.is_active='True' and asset_form.assessment_form_employee_id in %s """,(tuple(employee_data),))
              search_data=dictfetchall(cur)  
        elif org_unit_data !='' and role_data!='':
            cur.execute("""select asset_temp.assessment_template_name as template_name,asset_form.id as form_id,ref_item.refitems_name as category_name,emp_info.id as employee_id,emp_info.name as employee_name,role_det.role_title as employee_role
            from employee_info as emp_info  
            inner join hcms_ti_role_details as role_det on role_det.id=emp_info.role_id_id
            inner join hcms_ta_assessment_form as asset_form on asset_form.assessment_form_employee_id=emp_info.id
            inner join reference_items as ref_item on ref_item.id=asset_form.assessment_category_refitem_id
            inner join hcms_ta_assessment_template as asset_temp on asset_temp.id=asset_form.assessment_form_template_id
            where role_det.is_active='True' and ref_item.is_active='True' and asset_temp.is_active='True' and asset_form.is_active='True' and emp_info.is_active='True' and asset_form.assessment_form_employee_id in (select id  
            from employee_info where employee_info.is_active='True' and role_id_id in
            (select id from hcms_ti_role_details where hcms_ti_role_details.is_active='True' and  id in %s))""",(tuple(role_data),))
            search_data=dictfetchall(cur) 
        elif org_unit_data !='':
            cur.execute("""select asset_temp.assessment_template_name as template_name,asset_form.id as form_id,ref_item.refitems_name as category_name,emp_info.id as employee_id,emp_info.name as employee_name,role_det.role_title as employee_role
            from employee_info as emp_info  
            inner join hcms_ti_role_details as role_det on role_det.id=emp_info.role_id_id
            inner join hcms_ta_assessment_form as asset_form on asset_form.assessment_form_employee_id=emp_info.id
            inner join reference_items as ref_item on ref_item.id=asset_form.assessment_category_refitem_id
            inner join hcms_ta_assessment_template as asset_temp on asset_temp.id=asset_form.assessment_form_template_id
            where role_det.is_active='True' and ref_item.is_active='True' and asset_temp.is_active='True' and asset_form.is_active='True' and emp_info.is_active='True' and asset_form.assessment_form_employee_id in (select id from employee_info  
            where employee_info.is_active='True' and org_unit_id_id in %s) """,(tuple(org_unit_data),))
            search_data=dictfetchall(cur) 
        else:
            json_data['data']=[]
        json_data['data']=search_data
    except Exception as e:
        json_data[config.status] = e
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)