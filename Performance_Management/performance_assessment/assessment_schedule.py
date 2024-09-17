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
from Performance_Management.performance_assessment.models import HCMS_PM_Assessment_Schedule,HCMS_PM_Assessment_Schedule_Details
from HCMS_System_Admin.system_admin.models import Reference_Items
import datetime
import assessment_schedule_config as config
import HCMS.settings as status_keys
from CommonLib.hcms_common import menu_access_control


import logging
import logging.handlers
logger_obj = logging.getLogger('logit')

class HCMSPerformanceAssessmentScheduleView(TemplateView):  #Added- Saaruki-07Feb2018
    ''' 
    08-Feb-2018 || SND || To HCMS Talent assessment schedule module loaded 
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''

    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HCMSPerformanceAssessmentScheduleView, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Assessment Schedule Setup', self.request.user.id)
        if macl:
            template_name = "performance_management/assessment_schedule.html"
        else:
            template_name = "tags/access_denied.html"
        return [template_name]
    
    def get(self, request, *args, **kwargs):
        cur=connection.cursor()
        cur.execute("select id,name from organization_info where is_active") 
        organization_data = dictfetchall(cur)
        context = super(HCMSPerformanceAssessmentScheduleView, self).get_context_data(**kwargs)
        context['organization_data']=organization_data
        return self.render_to_response(context)
    
def EmployeeOrgListFetch(request):
    '''
    14-Feb-2018 || SND || To Fetch the Employee Name
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse to return the success or error message
    ''' 
    try:
        json_datas = {}   
        cur = connection.cursor()
        current_user_id = request.user.id
        if current_user_id:
            org_id = request.GET.get('org_id',None)
            if org_id:
                cur.execute("""select id,orgunit_name from organization_unit_info where organization_id = {0} and is_active = True and parent_orgunit_id!=0 order by orgunit_name""".format(org_id)) 
                org_unit = dictfetchall(cur)
                cur.execute("""select id,concat(name,' ',last_name) as name from employee_info where org_id_id = {0} and is_active = True order by name""".format(org_id)) 
                employee = dictfetchall(cur)
                json_datas[status_keys.STATUS_KEY]=status_keys.SUCCESS_STATUS
                json_datas['organization_unit']=org_unit
                json_datas['employee']=employee
            else:
                json_datas[status_keys.STATUS_KEY]=status_keys.FAILURE_STATUS
        else:
            json_datas[status_keys.STATUS_KEY]=status_keys.FAILURE_STATUS
    except Exception as e:
        json_datas[status_keys.STATUS_KEY] = e
    return HttpResponse(json.dumps(json_datas,cls=DjangoJSONEncoder), content_type="application/json")

def EmployeeDeptListFetch(request):
    '''
    14-Feb-2018 || SND || To Fetch the Employee Name
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse to return the success or error message
    ''' 
    try:
        json_datas = {}   
        cur = connection.cursor()
        current_user_id = request.user.id
        if current_user_id:
            org_unit_id = request.GET.get('orgunit_id',None)
            if org_unit_id:
                cur.execute("""select id,name from team_details_info where org_unit_id = {0} and is_active = True order by name""".format(org_unit_id)) 
                department = dictfetchall(cur)
                print """select id,name from team_details_info where org_unit_id = {0} and is_active = True order by name""".format(org_unit_id)
                cur.execute("""select id,concat(name,' ',last_name) as name from employee_info where org_unit_id_id = {0} and is_active = True order by name""".format(org_unit_id)) 
                employee = dictfetchall(cur)
                json_datas[status_keys.STATUS_KEY]=status_keys.SUCCESS_STATUS
                json_datas['department'] = department
                json_datas['employee'] = employee
            else:
                json_datas[status_keys.STATUS_KEY]=status_keys.FAILURE_STATUS
        else:
            json_datas[status_keys.STATUS_KEY]=status_keys.FAILURE_STATUS
    except Exception as e:
        json_datas[status_keys.STATUS_KEY] = e
    return HttpResponse(json.dumps(json_datas,cls=DjangoJSONEncoder), content_type="application/json")

def EmployeeListFetch(request):
    '''
    14-Feb-2018 || SND || To Fetch the Employee Name
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse to return the success or error message
    ''' 
    try:
        json_datas = {}   
        cur = connection.cursor()
        current_user_id = request.user.id
        if current_user_id:
            dept_id = request.GET.get('dept_id',None)
            if dept_id:
                cur.execute("""select id,concat(name,' ',last_name) as name from employee_info where team_name_id = {0} and is_active = True order by name""".format(dept_id)) 
                employee = dictfetchall(cur)
                json_datas[status_keys.STATUS_KEY]=status_keys.SUCCESS_STATUS
                json_datas['employee'] = employee
            else:
                json_datas[status_keys.STATUS_KEY]=status_keys.FAILURE_STATUS
        else:
            json_datas[status_keys.STATUS_KEY]=status_keys.FAILURE_STATUS
    except Exception as e:
        json_datas[status_keys.STATUS_KEY] = e
    return HttpResponse(json.dumps(json_datas,cls=DjangoJSONEncoder), content_type="application/json")

def PAScheduleListFetch(request):
    '''
    14-Feb-2018 || SND || To Fetch the Schedule List
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse to return the success or error message
    '''
    try:
        json_datas = {}    
        cur = connection.cursor()
        cur.execute("""select ri.id,ri.refitems_name from reference_items ri inner join reference_item_category ric on ric.id= ri.refitems_category_id
        where (ric.refitem_category_code = 'ASMTY' or ric.refitem_category_code = 'EXAST')  and ri.is_active=true and ric.is_active=true order by ri.refitems_code""") 
        schedule_list=dictfetchall(cur)
        json_datas['status']="Success"
        json_datas['schedule_list']=schedule_list
    except Exception as e:
        json_datas['status'] = e
    return HttpResponse(json.dumps(json_datas,cls=DjangoJSONEncoder), content_type="application/json")

def PAAddUpdateAssessmentSchedule(request):
    '''
    15-Feb-2018 || SND || To Add or Update the Assessment Schedule Function
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse to return the success or error message
    '''  
    try:
        json_datas = {} 
        cur = connection.cursor()
        assessment_schedule_name=request.POST.get('schedule_name')
        objective_setting_day_count=request.POST.get('objective_setting_day_count')
        employee_id_list=json.loads(request.POST.get('employee_id_list'))
        assessment_schedule_list=json.loads(request.POST.get('assessment_schedule_list'))
        assessment_schedule_cycle_start=request.POST.get('cycle_start')
        assessment_schedule_cycle_end=request.POST.get('cycle_ends')
        schedule_cycle_start =datetime.datetime.strptime(assessment_schedule_cycle_start, "%d-%m-%Y").strftime("%Y-%m-%d")
        schedule_cycle_end =datetime.datetime.strptime(assessment_schedule_cycle_end, "%d-%m-%Y").strftime("%Y-%m-%d")
        schedule_update_id=request.POST.get('assessment_schedule_detail_id')
        schedule_quarter = request.POST.get('schedule_quarter')
        schedule_year = request.POST.get('schedule_year')
        logger_obj.info("function name:PAAddUpdateAssessmentSchedule, attempted by "+str(request.user.username))
        if schedule_update_id:
#             cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.performance_assessment_schedule_update),(assessment_schedule_name,assessment_schedule_employee_type,schedule_cycle_start,schedule_cycle_end,objective_setting_day_count,schedule_cycle_start,True,request.user.id,schedule_update_id,))
            cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.performance_assessment_schedule_update).format(assessment_schedule_name,schedule_cycle_start,schedule_cycle_end,objective_setting_day_count,schedule_cycle_start,True,request.user.id,schedule_update_id,schedule_year,schedule_quarter))
            cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.performance_assessment_schedule_details_delete).format(schedule_update_id,))
            for i in employee_id_list:
                for j in assessment_schedule_list:
                    start_date=datetime.datetime.strptime(j['schedule_date'], "%d-%m-%Y").strftime("%Y-%m-%d")
                    cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.performance_assessment_schedule_detail_insert),(schedule_update_id,i,j['assessor_type_id'],j['schedule_day_count'],start_date,True,request.user.id,))
            json_datas['status']=status_keys.UPDATE_STATUS
            logger_obj.info("function name:PAAddUpdateAssessmentSchedule, request data: schedule_update_id "+str(schedule_update_id)+" attempted by "+str(request.user.username)+"status"+str(json_datas))
        else:
#             cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.performance_assessment_schedule_insert),(assessment_schedule_name,assessment_schedule_employee_type,,schedule_cycle_start,schedule_cycle_end,objective_setting_day_count,schedule_cycle_start,True,request.user.id,))
            cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.performance_assessment_schedule_insert).format(assessment_schedule_name,schedule_cycle_start,schedule_cycle_end,objective_setting_day_count,schedule_cycle_start,True,request.user.id,schedule_year,schedule_quarter))
            schedule_id=cur.fetchall()
            for i in employee_id_list:
                for j in assessment_schedule_list:
                    start_date=datetime.datetime.strptime(j['schedule_date'], "%d-%m-%Y").strftime("%Y-%m-%d")
                    cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.performance_assessment_schedule_detail_insert),(schedule_id[0][0],i,j['assessor_type_id'],j['schedule_day_count'],start_date,True,request.user.id,))        
            json_datas['status']=status_keys.SUCCESS_STATUS
            logger_obj.info("function name:AddUpdateAssessmentSchedule attempted by "+str(request.user.username)+"status"+str(json_datas))
    except Exception as e:
        json_datas['status'] = e
    logger_obj.info("function name:PAAddUpdateAssessmentSchedule attempted by "+str(request.user.username)+"status"+str(json_datas))
    return HttpResponse(json.dumps(json_datas), content_type="application/json")

def PAScheduleDetailFetch(request):
    '''
    15-Feb-2018 || SND || To Fetch the Rating Scheme
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse to return the success or error message
    '''   
    try:
        json_datas = {}  
        cur = connection.cursor()
        cur.execute("""select schedule_year as year,schedule_quarter as quarter,asd.id as schedule_id,asd.schedule_name as schedule_name,to_char(assessment_cycle_starts,'DD-MM-YYYY') as cycle_starts,to_char(assessment_cycle_ends,'DD-MM-YYYY') as cycle_ends from
        HCMS_PM_Assessment_Schedule asd where asd.is_active =TRUE order by asd.id desc""")
        assessment_schedule_details=dictfetchall(cur)
        json_datas['status']='Success'
        json_datas['assessment_schedule_details']=assessment_schedule_details
    except Exception as e:
        json_datas['status'] = e   
    return HttpResponse(json.dumps(json_datas,cls=DjangoJSONEncoder), content_type="application/json")

def PAScheduleDetailFetchById(request):
    '''
    15-Feb-2018 || SND || To Fetch the Rating Name
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse to return the success or error message
    '''
    try:
        json_datas = {}
        cur = connection.cursor()
        schedule_id=request.POST.get('schedule_id')
        cur.execute("""select schedule_year as year,schedule_quarter as quarter,schedule_name as schedule_name,objective_setting_day_count as objective_day_count,to_char(assessment_cycle_starts, 'DD-MM-YYYY') as cycle_starts from
        HCMS_PM_Assessment_Schedule where id={0} and is_active =TRUE""".format(schedule_id,))
        schedule_details=dictfetchall(cur)
        assessment_detail=HCMS_PM_Assessment_Schedule_Details.objects.filter(assessment_schedule=schedule_id)[:1].values('employee')
        if assessment_detail:
            employee_id=list(assessment_detail)[0]['employee']
            cur.execute("""select array(select distinct employee_id from hcms_pm_assessment_schedule_details where assessment_schedule_id={0} and is_active=true) 
            as employee_ids, ri.refitems_name,assessor_type_id,assess_type_day_count,to_char(schedule_start_date, 'DD-MM-YYYY') as schedule_start_date from 
            hcms_pm_assessment_schedule_details asd inner join reference_items ri on asd.assessor_type_id=ri.id where employee_id={1} and assessment_schedule_id = {2} and asd.is_active=true and ri.is_active=true""".format(schedule_id,employee_id,schedule_id,))
            schedule_date_detail=dictfetchall(cur)
            cur.execute("""select distinct sd.employee_id as id, ei.name,ei.org_id_id from hcms_pm_assessment_schedule_details sd left join employee_info ei on sd.employee_id=ei.id where sd.assessment_schedule_id={0} and 
            ei.is_active=true and sd.is_active=true""".format(schedule_id,))
            schedule_employee_detail=dictfetchall(cur)
            if schedule_details and schedule_date_detail:
                json_datas['status'] = 'Success' 
                json_datas['schedule_details'] = schedule_details 
                json_datas['schedule_date_detail']= schedule_date_detail  
                json_datas['schedule_employee_detail']=schedule_employee_detail
    except Exception as e:
        json_datas['status'] = e 
    return HttpResponse(json.dumps(json_datas,cls=DjangoJSONEncoder), content_type="application/json")

def PAEmployeeExistCheck(request):
    '''
    16-Feb-2018 || SND || To Check Employee Exist in the Schedule
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse to return the success or error message
    '''
    try:
        json_datas = {}
        schedule_id = request.GET.get('schedule_id','')
        employee_id_list=json.loads(request.GET.get('employee_id_list'))
        schedule_year = request.GET.get('schedule_year')
        schedule_quarter = request.GET.get('schedule_quarter')
        cur = connection.cursor()
        if len(employee_id_list)!=1:
            condition =  "in "+str(tuple(map(str,employee_id_list)))
        elif len(employee_id_list)==1:
             condition =  "= "+str(employee_id_list[0])
        print "schedule_id",schedule_id
        if schedule_id=='':
            schedule_id = "is not null"
        elif schedule_id!='':
            schedule_id = "!= "+str(schedule_id)
        if condition and schedule_year and schedule_quarter:
            cur.execute("""select hpas.schedule_year,hpas.schedule_quarter,concat(ei.name,' ',ei.last_name) as employee_name,ei.id as employee_id,hpas.id as schedule_id,hpas.schedule_name as schedule_name 
            from hcms_pm_assessment_schedule hpas inner join hcms_pm_assessment_schedule_details hpasd on hpas.id = hpasd.assessment_schedule_id inner join employee_info ei 
            on ei.id = hpasd.employee_id where ei.id {0} and hpas.schedule_year={1} and hpas.schedule_quarter={2} and hpasd.assessment_schedule_id {3} and hpas.is_active=True and hpasd.is_active=True and 
            ei.is_active=True""".format(condition,schedule_year,schedule_quarter,schedule_id))
            json_datas['employee_exist'] = [dict(t) for t in {tuple(d.items()) for d in dictfetchall(cur)}] 
            json_datas[status_keys.STATUS_KEY]=status_keys.SUCCESS_STATUS
        else:
            json_datas['status'] = status_keys.FAILURE_STATUS
    except Exception as e:
        json_datas['status'] = e 
    logger_obj.info("function name:ScheduleDetailEmployeeExist attempted by "+str(request.user.username)+"status"+str(json_datas))
    return HttpResponse(json.dumps(json_datas,cls=DjangoJSONEncoder), content_type="application/json")
    
def PAScheduleDetailRemove(request):
    '''
    16-Feb-2018 || SND || To Remove the Schedule Detail
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse to return the success or error message
    '''
    try:
        json_datas = {}
        schedule_id=request.POST.get('assessment_schedule_detail_id')
#         referred_record = record_validation('hcms_pm_assessment_schedule', schedule_id)
#         if referred_record==True:
        cur = connection.cursor()
        cur.execute("""UPDATE HCMS_PM_Assessment_Schedule SET is_active = FALSE WHERE id={0}""".format(schedule_id,))
        cur.execute("""UPDATE HCMS_PM_Assessment_Schedule_Details SET is_active=FALSE where assessment_schedule_id={0}""".format(schedule_id,))
        json_datas['status']=status_keys.REMOVE_STATUS
#         else:
#             json_datas['status']=status_keys.ERR0028
    except Exception as e:
        json_datas['status'] = e 
    logger_obj.info("function name:ScheduleDetailRemove, requested data : schedule_id is "+ str(schedule_id) +" attempted by "+str(request.user.username)+"status"+str(json_datas))
    return HttpResponse(json.dumps(json_datas,cls=DjangoJSONEncoder), content_type="application/json")