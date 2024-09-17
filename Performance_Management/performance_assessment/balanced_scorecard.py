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
import balanced_scorecard_config as balance_config
logger_obj = logging.getLogger('logit')

class HCMSBalancedScorecardView(TemplateView):    #Added- ESA-21AUG2018
    ''' 
    16-AUG-2018 || ESA || To HCMS Performance balance form page loaded.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HCMSBalancedScorecardView, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Balanced Scorecard', self.request.user.id)
        if macl:
            template_name = balance_config.balanced_scorecard_template
        else:
            template_name = "tags/access_denied.html"
        return [template_name]
    
    def get(self, request, *args, **kwargs):
        cur=connection.cursor() 
        context = super(HCMSBalancedScorecardView, self).get_context_data(**kwargs)
        try:
            cur.execute(query.fetch_hcms_query(balance_config.performance_assessment_module,balance_config.fetch_organization_details_view))
            org_info=dictfetchall(cur)
            cur.execute(query.fetch_hcms_query(balance_config.performance_assessment_module,balance_config.fetch_ref_bsc))
            bsc_info=dictfetchall(cur)
            context[balance_config.organization]=org_info
            context['bsc_info']=bsc_info
            logger_obj.info("balanced scorecard Page Load  attempted by "+str(request.user.username))    
        except Exception as e:
            context[balance_config.exception] = e
            logger_obj.info("balanced scorecard Load data exception"+ str(e) +" attempted by "+str(request.user.username))    
        cur.close()    
        return self.render_to_response(context)
    
def org_unit_division(request):
    ''' 
        21-AUG-2018 || ESA || To Fetch the org unit based division.
        @param request: Request Object
        @type request : Object
        @return:   return the employee details
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    try:
      if current_user_id:
         org_unit_id=request.GET.get("str_org_unit_id")
         str_org_id=request.GET.get("str_org_id")
         if org_unit_id and str_org_id:
            cur.execute(query.fetch_hcms_query(balance_config.performance_assessment_module,balance_config.fetch_org_unit_division_details),(str(str_org_id),str(org_unit_id),))
            department_data = dictfetchall(cur)
            json_data['org_unit_division']=department_data
         else:
            json_data['org_unit_division']=[]
      else:
           json_data['org_unit_division']=[]
    except Exception as e:    
        result = e
        json_data['org_unit_division']=[]
        logger_obj.info("Organization Unit based division details exception as"+ str(result) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=balance_config.content_type_value)

def filter_perspective_details(request):
    ''' 
        21-AUG-2018 || ESA || To Fetch the perspective details.
        @param request: Request Object
        @type request : Object
        @return:   return the employee details
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    try:
        if current_user_id:
           org_id=request.GET.get("org_id")
           org_unit_id=request.GET.get("org_unit_id")
           dep_id=request.GET.get("dep_id")
           if org_id!='0' :
              cur.execute(query.fetch_hcms_query(balance_config.performance_assessment_module,balance_config.FINAN),(str(org_id),))
              FINAN=dictfetchall(cur)
              if FINAN:
                 json_data['FINAN']=FINAN
              else:
                  json_data['FINAN']=[]
              cur.execute(query.fetch_hcms_query(balance_config.performance_assessment_module,balance_config.CSTMR),(str(org_id),))
              CSTMR=dictfetchall(cur)
              if CSTMR:
                 json_data['CSTMR']=CSTMR
              else:
                  json_data['CSTMR']=[]
              cur.execute(query.fetch_hcms_query(balance_config.performance_assessment_module,balance_config.IPRCS),(str(org_id),))
              IPRCS=dictfetchall(cur)
              if IPRCS:
                 json_data['IPRCS']=IPRCS
              else:
                  json_data['IPRCS']=[]
              cur.execute(query.fetch_hcms_query(balance_config.performance_assessment_module,balance_config.LRNGR),(str(org_id),))
              LRNGR=dictfetchall(cur)
              if LRNGR:
                 json_data['LRNGR']=LRNGR
              else:
                  json_data['LRNGR']=[]
           elif org_unit_id!='0' :
              cur.execute(query.fetch_hcms_query(balance_config.performance_assessment_module,balance_config.org_unit_FINAN),(str(org_unit_id),))
              FINAN=dictfetchall(cur)
              if FINAN:
                 json_data['FINAN']=FINAN
              else:
                  json_data['FINAN']=[]
              cur.execute(query.fetch_hcms_query(balance_config.performance_assessment_module,balance_config.org_unit_CSTMR),(str(org_unit_id),))
              CSTMR=dictfetchall(cur)
              if CSTMR:
                 json_data['CSTMR']=CSTMR
              else:
                  json_data['CSTMR']=[]
              cur.execute(query.fetch_hcms_query(balance_config.performance_assessment_module,balance_config.org_unit_IPRCS),(str(org_unit_id),))
              IPRCS=dictfetchall(cur)
              if IPRCS:
                 json_data['IPRCS']=IPRCS
              else:
                  json_data['IPRCS']=[]
              cur.execute(query.fetch_hcms_query(balance_config.performance_assessment_module,balance_config.org_unit_LRNGR),(str(org_unit_id),))
              LRNGR=dictfetchall(cur)
              if LRNGR:
                 json_data['LRNGR']=LRNGR
              else:
                  json_data['LRNGR']=[]
           elif dep_id!='0' :
              cur.execute(query.fetch_hcms_query(balance_config.performance_assessment_module,balance_config.division_FINAN),(str(dep_id),))
              FINAN=dictfetchall(cur)
              if FINAN:
                 json_data['FINAN']=FINAN
              else:
                  json_data['FINAN']=[]
              cur.execute(query.fetch_hcms_query(balance_config.performance_assessment_module,balance_config.division_CSTMR),(str(dep_id),))
              CSTMR=dictfetchall(cur)
              if CSTMR:
                 json_data['CSTMR']=CSTMR
              else:
                  json_data['CSTMR']=[]
              cur.execute(query.fetch_hcms_query(balance_config.performance_assessment_module,balance_config.division_IPRCS),(str(dep_id),))
              IPRCS=dictfetchall(cur)
              if IPRCS:
                 json_data['IPRCS']=IPRCS
              else:
                  json_data['IPRCS']=[]
              cur.execute(query.fetch_hcms_query(balance_config.performance_assessment_module,balance_config.division_LRNGR),(str(dep_id),))
              LRNGR=dictfetchall(cur)
              if LRNGR:
                 json_data['LRNGR']=LRNGR
              else:
                  json_data['LRNGR']=[]
           else:
                json_data['LRNGR']=[]
                json_data['IPRCS']=[]
                json_data['CSTMR']=[]
                json_data['FINAN']=[]
    except Exception as e:    
        result = e
        json_data['LRNGR']=[]
        json_data['IPRCS']=[]
        json_data['CSTMR']=[]
        json_data['FINAN']=[]
        logger_obj.info("perspective details exception as"+ str(result) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=balance_config.content_type_value)

def perspective_data(request):
    ''' 
        29-AUG-2018 || ESA || To Fetch the perspective details.
        @param request: Request Object
        @type request : Object
        @return:   return the employee details
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    year=request.GET.get("year")
    quarter=request.GET.get("quarter")
    try:
        if year and quarter:
               cur.execute(query.fetch_hcms_query(balance_config.performance_assessment_module,balance_config.prespective_FINAN).format(year,quarter))
               FINAN=dictfetchall(cur)
               if FINAN:
                  json_data['FINAN']=FINAN
               else:
                  json_data['FINAN']=[]
               cur.execute(query.fetch_hcms_query(balance_config.performance_assessment_module,balance_config.prespective_CSTMR).format(year,quarter))
               CSTMR=dictfetchall(cur)
               if CSTMR:
                   json_data['CSTMR']=CSTMR
               else:
                    json_data['CSTMR']=[]
               cur.execute(query.fetch_hcms_query(balance_config.performance_assessment_module,balance_config.prespective_IPRCS).format(year,quarter))
               IPRCS=dictfetchall(cur)
               if IPRCS:
                    json_data['IPRCS']=IPRCS
               else:
                    json_data['IPRCS']=[]
               cur.execute(query.fetch_hcms_query(balance_config.performance_assessment_module,balance_config.prespective_LRNGR).format(year,quarter))
               LRNGR=dictfetchall(cur)
               if LRNGR:
                   json_data['LRNGR']=LRNGR
               else:
                    json_data['LRNGR']=[] 
        else:
                 json_data['LRNGR']=[]
                 json_data['IPRCS']=[]
                 json_data['CSTMR']=[]
                 json_data['FINAN']=[]
    except Exception as e:    
        result = e
        json_data['LRNGR']=[]
        json_data['IPRCS']=[]
        json_data['CSTMR']=[]
        json_data['FINAN']=[]
        logger_obj.info("perspective details exception as"+ str(result) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=balance_config.content_type_value)

def bsc_form_save(request):
    ''' 
                30-AUG-2018 || ESA || To save BSC objective form data
                @param request: Request Object
                @type request : Object
                @return:  return the success message for save
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    try:
        if current_user_id:
            objective_name=request.POST.get('objective_name')
            bsc_perspective=request.POST.get('bsc_perspective')
            start_date=request.POST.get('start_date')
            end_date=request.POST.get('end_date')
            obj_plan_type=request.POST.get('obj_plan_type')
            obj_org_id=request.POST.get('obj_org_id')
            year=request.POST.get('year')
            month=request.POST.get('month')
            quarter=request.POST.get('quarter')
            update_id=request.POST.get('update_id')
            progress_data=request.POST.get('slider_data')
            if quarter == False or quarter == None or quarter == '':
               quarter = None
            if month == False or month == None or month == '':
                month = None
            if  obj_org_id =='0':
                obj_org_id = None
            if update_id:
                 if objective_name and bsc_perspective and start_date and end_date and obj_plan_type and year:
                   if progress_data is None:
                        cur.execute("""update hcms_pm_strategic_objectives set strategic_objective_description = %s,bsc_perspective_id = %s,
                         organization_id=%s,objective_plan_type=%s,is_active=%s,modified_by_id=%s,modified_date=now(),start_date=%s,end_date=%s,planned_year=%s,planned_month=%s,planned_quarter=%s,progress=NULL,assigned_type='Organization' where id=%s returning id""",
                        (objective_name,bsc_perspective,obj_org_id,obj_plan_type,True,current_user_id,start_date,end_date,year,month,quarter,update_id))
                        return_data=dictfetchall(cur)  
                        if return_data:
                          json_data['status'] = status_keys.UPDATE_STATUS  
                   else:
                       cur.execute("""update hcms_pm_strategic_objectives set strategic_objective_description = %s,bsc_perspective_id = %s,
                         organization_id=%s,objective_plan_type=%s,is_active=%s,modified_by_id=%s,modified_date=now(),start_date=%s,end_date=%s,planned_year=%s,planned_month=%s,planned_quarter=%s,progress=%s,assigned_type=NULL where id=%s returning id""",
                       (objective_name,bsc_perspective,obj_org_id,obj_plan_type,True,current_user_id,start_date,end_date,year,month,quarter,progress_data,update_id))
                       return_data=dictfetchall(cur)  
                       if return_data:
                          json_data['status'] = status_keys.UPDATE_STATUS  
                 else:
                    json_data['status']=status_keys.FAILURE_STATUS
            else:
                if objective_name and bsc_perspective and start_date and end_date and obj_plan_type and year:
                  if progress_data is None:
                       cur.execute("""insert into hcms_pm_strategic_objectives(strategic_objective_description,bsc_perspective_id,
                            organization_id,objective_plan_type,is_active,created_by_id,created_date,start_date,end_date,planned_year,planned_month,planned_quarter,assigned_type) values(%s,%s,%s,%s,%s,%s,now(),%s,%s,%s,%s,%s,%s) returning id""",
                            (objective_name,bsc_perspective,obj_org_id,obj_plan_type,True,current_user_id,start_date,end_date,year,month,quarter,'Organization'))
                       return_data=dictfetchall(cur)
                       if return_data:
                            json_data['status'] = status_keys.SUCCESS_STATUS  
                  else:
                      cur.execute("""insert into hcms_pm_strategic_objectives(strategic_objective_description,bsc_perspective_id,
                            organization_id,objective_plan_type,is_active,created_by_id,created_date,start_date,end_date,planned_year,planned_month,planned_quarter,progress,assigned_type) values(%s,%s,%s,%s,%s,%s,now(),%s,%s,%s,%s,%s,%s,NULL) returning id""",
                            (objective_name,bsc_perspective,obj_org_id,obj_plan_type,True,current_user_id,start_date,end_date,year,month,quarter,progress_data))
                      return_data=dictfetchall(cur)
                      if return_data:
                            json_data['status'] = status_keys.SUCCESS_STATUS 
                else:
                    json_data['status']=status_keys.FAILURE_STATUS
        else:
            json_data['status']='001'
    except Exception as e:    
        result=e
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=balance_config.content_type_value)       

def selected_objective(request):
    ''' 
            30-AUG-2018 || ESA || To fetch BSC objective form data
            @param request: Request Object
            @type request : Object
            @return:  return the success message for save
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    try:
        if current_user_id:
           objective_id=request.GET.get('selected_id')
           if objective_id:
               cur.execute(query.fetch_hcms_query(balance_config.performance_assessment_module,balance_config.objective_data_fetch),(str(objective_id),))
               objective_data=dictfetchall(cur)
               if objective_data:
                   json_data['objective_data']=objective_data
               else:
                    json_data['objective_data']=[]
           else:
                json_data['objective_data']=[]
    except Exception as e :
        result=e
        json_data['objective_data']=[]
        logger_obj.info("BSC form  selected objective Details "+ str(result) +" attempted by "+str(request.user.username))  
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=balance_config.content_type_value)       

def objective_form_delete(request):
    ''' 
            30-AUG-2018 || ESA || To fetch BSC objective form data delete
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
        if remove_id:
             cur.execute(query.fetch_hcms_query(balance_config.performance_assessment_module,balance_config.bsc_form_remove),(str(current_user_id),str(remove_id)))
             json_data['status']=status_keys.REMOVE_STATUS
        else:
            json_data['status']=status_keys.FAILURE_STATUS
        logger_obj.info("BSC form  Details remove status"+ str(json_data) +" attempted by "+str(request.user.username))  
      else:
            json_data['status']='001'
    except Exception as e:
         result = e
         json_data['status']=[]
         logger_obj.info("BSC  form  Details remove exception"+ str(result) +" attempted by "+str(request.user.username))  
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=balance_config.content_type_value) 