# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import json
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from django.http.response import HttpResponse
from CommonLib.lib import dictfetchall
from CommonLib import query
from CommonLib.hcms_common import record_validation
from django.db import connection
from django.core.serializers.json import DjangoJSONEncoder
from CSD.JenkinsAPI import jenkins_fetch
from datetime import datetime
from Talent_Assessment.talent_assessment.models import HCMS_TA_Assessment_Schedule,HCMS_TA_Assessment_Schedule_Details
from HCMS_System_Admin.system_admin.models import Reference_Items
import datetime
import config
import HCMS.settings as status_keys

import logging
import logging.handlers
logger_obj = logging.getLogger('logit')

class HCMSTalentAssessmentScheduleView(TemplateView):  #Added- Saaruki-07Feb2018
    ''' 
    08-Feb-2018 || SAR || To HCMS Talent assessment schedule module loaded 
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''

    template_name = "talent_assessment/ta_assessment_schedule.html"
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HCMSTalentAssessmentScheduleView, self).dispatch(request, *args, **kwargs)
    
    def get(self, request, *args, **kwargs):
        cur=connection.cursor()
        cur.execute(query.fetch_hcms_query(config.talent_assessment,config.employee_type_fetch)) 
        employee_type = dictfetchall(cur)
        cur.execute(query.fetch_hcms_query(config.talent_assessment,config.assessment_category_fetch)) 
        assessment_category = dictfetchall(cur)
        context = super(HCMSTalentAssessmentScheduleView, self).get_context_data(**kwargs)
        context['employee_type']=employee_type
        context['assessment_category']=assessment_category
        return self.render_to_response(context)
    
def EmployeeNameFetch(request):
    '''
    14-Feb-2018 || SAR || To Fetch the Employee Name
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse to return the success or error message
    ''' 
    try:
        json_datas = {}   
        cur = connection.cursor()
        cur.execute(query.fetch_hcms_query(config.talent_assessment,config.employee_detail_fetch),(request.GET.get('selected_data'),)) 
        employee=dictfetchall(cur)
        json_datas['status']="Success"
        json_datas['employee']=employee
    except Exception as e:
        json_datas['status'] = e
    return HttpResponse(json.dumps(json_datas,cls=DjangoJSONEncoder), content_type="application/json")

def ScheduleListFetch(request):
    '''
    14-Feb-2018 || SAR || To Fetch the Schedule List
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse to return the success or error message
    '''
    try:
        json_datas = {}    
        cur = connection.cursor()
        cur.execute(query.fetch_hcms_query(config.talent_assessment,config.assessor_type_fetch)) 
        schedule_list=dictfetchall(cur)
        json_datas['status']="Success"
        json_datas['schedule_list']=schedule_list
    except Exception as e:
        json_datas['status'] = e
    return HttpResponse(json.dumps(json_datas,cls=DjangoJSONEncoder), content_type="application/json")

def ManagementScheduleListFetch(request):
    '''
    14-Feb-2018 || SAR || To Fetch the Schedule List
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse to return the success or error message
    '''    
    try:
        json_datas = {} 
        cur = connection.cursor()
        cur.execute(query.fetch_hcms_query(config.talent_assessment,config.assessor_type_fetch)) 
        management_schedule_list=dictfetchall(cur)
        json_datas['status']="Success"
        json_datas['management_schedule_list']=management_schedule_list
    except Exception as e:
        json_datas['status'] = e
    return HttpResponse(json.dumps(json_datas,cls=DjangoJSONEncoder), content_type="application/json")

def AddUpdateAssessmentSchedule(request):
    '''
    15-Feb-2018 || SAR || To Add or Update the Assessment Schedule Function
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse to return the success or error message
    '''  
    try:
        json_datas = {} 
        cur = connection.cursor()
        assessment_schedule_name=request.POST.get('schedule_name')
        assessment_schedule_category=request.POST.get('assessment_category_id')
#         assessment_schedule_employee_type=request.POST.get('employee_type_id')
#         assessment_type=request.POST.get('assessment_type')
        objective_setting_day_count=request.POST.get('objective_setting_day_count')
        employee_id_list=json.loads(request.POST.get('employee_id_list'))
        assessment_schedule_list=json.loads(request.POST.get('assessment_schedule_list'))
        assessment_schedule_cycle_start=request.POST.get('cycle_start')
        assessment_schedule_cycle_end=request.POST.get('cycle_ends')
        schedule_cycle_start =datetime.datetime.strptime(assessment_schedule_cycle_start, "%d-%m-%Y").strftime("%Y-%m-%d")
        schedule_cycle_end =datetime.datetime.strptime(assessment_schedule_cycle_end, "%d-%m-%Y").strftime("%Y-%m-%d")
        schedule_update_id=request.POST.get('assessment_schedule_detail_id')
        logger_obj.info("function name:AddUpdateAssessmentSchedule, attempted by "+str(request.user.username))
        if schedule_update_id:
#             cur.execute(query.fetch_hcms_query(config.talent_assessment,config.assessment_schedule_update),(assessment_schedule_name,assessment_schedule_employee_type,assessment_schedule_category,schedule_cycle_start,schedule_cycle_end,objective_setting_day_count,schedule_cycle_start,True,request.user.id,schedule_update_id,))
            cur.execute(query.fetch_hcms_query(config.talent_assessment,config.assessment_schedule_update),(assessment_schedule_name,assessment_schedule_category,schedule_cycle_start,schedule_cycle_end,objective_setting_day_count,schedule_cycle_start,True,request.user.id,schedule_update_id,))
            cur.execute(query.fetch_hcms_query(config.talent_assessment,config.assessment_schedule_details_delete),(schedule_update_id,))
            for i in employee_id_list:
                for j in assessment_schedule_list:
                    start_date=datetime.datetime.strptime(j['schedule_date'], "%d-%m-%Y").strftime("%Y-%m-%d")
                    cur.execute(query.fetch_hcms_query(config.talent_assessment,config.assessment_schedule_detail_insert),(schedule_update_id,i,j['assessor_type_id'],j['schedule_day_count'],start_date,True,request.user.id,))
            json_datas['status']=status_keys.UPDATE_STATUS
            logger_obj.info("function name:AddUpdateAssessmentSchedule, request data: schedule_update_id "+str(schedule_update_id)+" attempted by "+str(request.user.username)+"status"+str(json_datas))
        else:
#             cur.execute(query.fetch_hcms_query(config.talent_assessment,config.assessment_schedule_insert),(assessment_schedule_name,assessment_schedule_employee_type,assessment_schedule_category,schedule_cycle_start,schedule_cycle_end,objective_setting_day_count,schedule_cycle_start,True,request.user.id,))
            cur.execute(query.fetch_hcms_query(config.talent_assessment,config.assessment_schedule_insert),(assessment_schedule_name,assessment_schedule_category,schedule_cycle_start,schedule_cycle_end,objective_setting_day_count,schedule_cycle_start,True,request.user.id,))
            schedule_id=cur.fetchall()
            for i in employee_id_list:
                for j in assessment_schedule_list:
                    start_date=datetime.datetime.strptime(j['schedule_date'], "%d-%m-%Y").strftime("%Y-%m-%d")
                    cur.execute(query.fetch_hcms_query(config.talent_assessment,config.assessment_schedule_detail_insert),(schedule_id[0][0],i,j['assessor_type_id'],j['schedule_day_count'],start_date,True,request.user.id,))        
            json_datas['status']=status_keys.SUCCESS_STATUS
            logger_obj.info("function name:AddUpdateAssessmentSchedule attempted by "+str(request.user.username)+"status"+str(json_datas))
    except Exception as e:
        json_datas['status'] = e
    logger_obj.info("function name:AddUpdateAssessmentSchedule attempted by "+str(request.user.username)+"status"+str(json_datas))
    return HttpResponse(json.dumps(json_datas), content_type="application/json")

def AssessmentScheduleDetailFetch(request):
    '''
    015-Feb-2018 || SAR || To Fetch the Rating Scheme
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse to return the success or error message
    '''   
    try:
        json_datas = {}  
        cur = connection.cursor()
        cur.execute(query.fetch_hcms_query(config.talent_assessment,config.assessment_schedule_detail_fetch))
        assessment_schedule_details=dictfetchall(cur)
        json_datas['status']='Success'
        json_datas['assessment_schedule_details']=assessment_schedule_details
    except Exception as e:
        json_datas['status'] = e   
    return HttpResponse(json.dumps(json_datas,cls=DjangoJSONEncoder), content_type="application/json")

def ScheduleDetailFetchById(request):
    '''
    15-Feb-2018 || SAR || To Fetch the Rating Name
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse to return the success or error message
    '''
    try:
        json_datas = {}
        cur = connection.cursor()
        schedule_id=request.POST.get('schedule_id')
        cur.execute(query.fetch_hcms_query(config.talent_assessment,config.assessment_schedule_fetch_by_id),(schedule_id,))
        schedule_details=dictfetchall(cur)
        assessment_detail=HCMS_TA_Assessment_Schedule_Details.objects.filter(assessment_schedule=schedule_id)[:1].values('assessment_schedule_employee')
        if assessment_detail:
            employee_id=list(assessment_detail)[0]['assessment_schedule_employee']
            cur.execute(query.fetch_hcms_query(config.talent_assessment,config.assessment_schedule_detail_fetch_by_id),(schedule_id,schedule_id,employee_id,))
            schedule_date_detail=dictfetchall(cur)
            cur.execute(query.fetch_hcms_query(config.talent_assessment,config.assessment_schedule_employee_detail),(schedule_id,))
            schedule_employee_detail=dictfetchall(cur)
            if schedule_details and schedule_date_detail:
                json_datas['status'] = 'Success' 
                json_datas['schedule_details'] = schedule_details 
                json_datas['schedule_date_detail']= schedule_date_detail  
                json_datas['schedule_employee_detail']=schedule_employee_detail
    except Exception as e:
        json_datas['status'] = e 
    return HttpResponse(json.dumps(json_datas,cls=DjangoJSONEncoder), content_type="application/json")
    
def ScheduleDetailRemove(request):
    '''
    16-Feb-2018 || SAR || To Remove the Schedule Detail
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse to return the success or error message
    '''
    try:
        json_datas = {}
        schedule_id=request.POST.get('assessment_schedule_detail_id')
        referred_record = record_validation('hcms_ta_assessment_schedule', schedule_id)
        if referred_record==True:
            cur = connection.cursor()
            cur.execute(query.fetch_hcms_query(config.talent_assessment,config.assessment_schedule_remove),(schedule_id,))
            cur.execute(query.fetch_hcms_query(config.talent_assessment,config.assessment_schedule_detail_remove),(schedule_id,))
            json_datas['status']=status_keys.REMOVE_STATUS
        else:
            json_datas['status']=status_keys.ERR0028
    except Exception as e:
        json_datas['status'] = e 
    logger_obj.info("function name:ScheduleDetailRemove, requested data : schedule_id is "+ str(schedule_id) +" attempted by "+str(request.user.username)+"status"+str(json_datas))
    return HttpResponse(json.dumps(json_datas,cls=DjangoJSONEncoder), content_type="application/json")