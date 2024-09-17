# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.shortcuts import render

import json
from django.views.decorators.csrf import csrf_exempt
from django.http.response import HttpResponse
from CommonLib import query
from django.db import connection
import config
from HRMS_Foundation.attendance_management.models import HolidayListInfo as HI
from CommonLib import query as q
from CommonLib.hcms_common import record_validation 
from CommonLib.hcms_common import refitem_fetch,refitemlink_fetch
from CommonLib import lib,common_controller 


#template render html
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
import logging
import logging.handlers
from CommonLib.hcms_common import menu_access_control
logger_obj = logging.getLogger('logit')

# import packages for Mobile API's
import ast

# HolidayList views here
class HrmsHolidayList(TemplateView):
    ''' 
         13-Feb-2018 TRU To HRMS Holiday List page loaded. And also check the user authentication
         @param request: Request Object
         @type request : Object
         @return:   HttpResponse or Redirect the another URL
         @author: TRU
    '''

#     template_name = "hrms_foundation/attendance_management/holiday_list.html"

    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HrmsHolidayList, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Holiday Administration', self.request.user.id)
        if macl:
            template_name = "hrms_foundation/attendance_management/holiday_list.html"
        else:
            template_name = "tags/access_denied.html"
        return [template_name]
         
    def get(self, request, *args, **kwargs):
         context = super(HrmsHolidayList, self).get_context_data(**kwargs)
         cur = connection.cursor()  #create the database connection
         cur.execute(q.fetch_hcms_query(config.attendance_management, config.hrms_org_list));
         values = q.dictfetchall(cur)
         if values:
             org_data = values
         else:
             org_data = []
         context['org'] = org_data
         holiday_list = refitem_fetch('HOLDY')
         years_details = refitem_fetch('YEARS')
         context['holiday_type'] = holiday_list
         context['years_details'] = years_details
         return self.render_to_response(context)

#holiday calendar view function here
class HRMSHolidayCalendarView(TemplateView):
    ''' 
    17-Oct-2018 TRU To HRMS Holiday Calendar Page loaded. And also check the user authentication
    @param request: Request Object 
    @type request : Object   
    @return:   HttpResponse or Redirect the another URL
    ''' 
#     template_name = "hrms_foundation/attendance_management/leave.html"
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs): 
        return super(HRMSHolidayCalendarView, self).dispatch(request, *args, **kwargs)    
    
    def get_template_names(self):
        macl = menu_access_control('Holiday Details', self.request.user.id)
        if macl: 
             template_name = "hrms_foundation/attendance_management/holiday_calendar.html"
        else:
            template_name = "tags/access_denied.html" 
        return [template_name]
    def get(self, request, *args, **kwargs):
        context = super(HRMSHolidayCalendarView, self).get_context_data(**kwargs)
        cur =lib.db_connection()  
        company_result=[]
        json_data=[]
        user_id=request.user.id
        logged_emp=logged_employee(request)
        if not logged_emp==None:
            if logged_emp:
                result=[]
                context[config.employee] = result      
            else:
                logged_emp=0
        return self.render_to_response(context)
    
#logged emploee function here 
def logged_employee(request):
    """
            07-March-2018 PAR To HRMS  getting the logged employee with user id  
            @param request: Request Object
            @type request : Object
            @return:   Response result
    """
    try:
        cur =lib.db_connection()
        logged_user = request.user.id
       
        leave_logged_emp_query=query.fetch_hcms_query(config.leave,config.logged_emp)
        if leave_logged_emp_query:
            cur.execute(leave_logged_emp_query%(logged_user))
            employee=cur.fetchall()
        if employee:
            global logged_emp
            if employee[0][0]:
                logged_emp=employee[0][0]
            else:
                logged_emp=0
            return logged_emp
            
    except Exception as e:
           logger_obj.error(e)
           
# holiday list CRUD function here
@csrf_exempt
def HRMSHolidayCRUDOpertion(request):
    ''' 
    08-Feb-2018 TRU To HRMS holiday list page loaded. And also check the user authentication and crud operations
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: TRU
    '''
    try:
            logger_obj.info('Holiday CRUD function by'+str(request.user.username))
            json_data = {}
            post = request.POST
            input_data = request.POST.get(config.datas)   
            delete_id = request.POST.get(config.delete_id)   
            uid = request.user.id
            if not uid:
                uid = 1
            update_id = request.POST.get(config.update_id)  
            if input_data and not delete_id:
                    input_data = json.loads(input_data)  
                    org_unit_ids = input_data['org_unit_ids']
                    input_data = input_data['input_data']
                    if not update_id:
                           holiday_information = HI.objects.filter(holiday_information__icontains = str(input_data[0]['holiday_info']),org_id_id=int(input_data[0]['company']),org_unit_id_id=int(input_data[0]['organization_unit_id']),year_id=int(input_data[0]['holiday_year']),holiday_type_id=int(input_data[0]['holiday_type']),is_active='True').values_list('id')
                           if holiday_information:
                               json_data[config.results] = config.al_exit
                           else:
                               logger_obj.info("---------------Insert---------------")
                               for org_id in org_unit_ids:
                                    status = HI(org_id_id=int(input_data[0]['company']),org_unit_id_id=int(org_id), holiday_date=(input_data[0]['date']).split(' ')[0] , holiday_information=input_data[0]['holiday_info'],year_id=int(input_data[0]['holiday_year']),holiday_type_id=int(input_data[0]['holiday_type']),is_active="True",created_by_id=int(uid))
                                    status.save()
                               json_data[config.results] = config.add_success
                    else:
                           logger_obj.info("---------------Update---------------")
                           status = HI.objects.filter(id=update_id).update(org_id_id=int(input_data[0]['company']),org_unit_id_id=int(input_data[0]['organization_unit_id']),year_id=int(input_data[0]['holiday_year']), holiday_date=(input_data[0]['date']).split(' ')[0] , holiday_information=input_data[0]['holiday_info'],holiday_type_id=int(input_data[0]['holiday_type']),is_active="True",modified_by_id=int(uid))
                           json_data[config.results] = config.update_success
            else:
                    logger_obj.info("---------------Delete---------------")
                    referred_record = record_validation('holiday_list_info', int(delete_id))
                    logger_obj.info( "==================Holiday List Delete Status ====>"+str(referred_record) )
                    if referred_record:
                        status =  HI.objects.filter(id=delete_id).update(is_active="False",modified_by_id=int(uid))
                        json_data[config.results] = config.delete_success   
                    else:
                        json_data[config.results] = 'ERR0028'  
            logger_obj.info('Holiday CRUD function response is'+str(json_data)+"attempted by"+str(request.user.username))  
    except Exception as e:
            logger_obj.error(e)
            json_data[config.results] = config.error       
    return HttpResponse(json.dumps(json_data))

# holiday list Data views here
def hrmsHolidayListData(request):
         ''' 
         08-Feb-2018 TRU To HRMS holiday list data page loaded. And also check the user authentication
         @param request: Request Object
         @type request : Object
         @return:   HttpResponse or Redirect the another URL
         @author: TRU
         '''
         post = request.GET
         holiday_id = post.get(config.id)  #get table key 
         cur = connection.cursor()  #create the database connection
         json_data = {}
         try:
             logger_obj.info('Holiday List function by'+str(request.user.username))
             if not holiday_id :
                 query =  q.fetch_hcms_query(config.attendance_management, config.hrms_holiday_list)
                 cur.execute(query+"order by oi.name");
                 values = cur.fetchall()
             else:
                 query =  q.fetch_hcms_query(config.attendance_management, config.hrms_holiday_list_event)
                 cur.execute(query+" order by oi.name",(int(holiday_id),));
                 values = q.dictfetchall(cur)
             if values:
                 json_data[config.datas] = values
             else:
                 json_data[config.datas] = []
             logger_obj.info('Holiday CRUD function response is'+str(json_data)+"attempted by"+str(request.user.username))  
      
         except Exception as e:
              logger_obj.error(e)  
              json_data[config.datas] = []
         cur.close()
         return HttpResponse(json.dumps(json_data))

#holiday list mobile function here
@csrf_exempt
def HolidayList_mobile(request):
    response = ''
    try:
        body = request.body
        try:
            data = json.loads(body)
            data = ast.literal_eval(data)
        except:
            data = json.loads(body)
        else:
            data = json.loads(body)
            data = json.loads(data)
        if data:
            year = data["year"]
            org_id = data["organization"]
            org_unit_id = data["organization_unit"]
            if year:
                cur = connection.cursor()
                if cur:
                    cur.execute(""" select hi.holiday_information, to_char(hi.holiday_date,'DD-MM-YYYY')as holiday_date, 
                                        ri1.refitems_name as holiday_name from holiday_list_info hi
                                        left join reference_items ri on ri.id = hi.year_id
                                        left join reference_items ri1 on ri1.id = hi.holiday_type_id
                                        where ri.refitems_name=%s and hi.org_id_id=%s and hi.org_unit_id_id=%s 
                                        and hi.is_active = TRUE order by hi.holiday_date ASC; """,(year,org_id,org_unit_id,))
                    res=query.dictfetchall(cur)
                    if res == []:
                        return HttpResponse(json.dumps({'status':'Failure','message':'failed'}))
                    else:
                        return HttpResponse(json.dumps({'status':'Success','message':'Success','data':res}))
            else:
                return HttpResponse(json.dumps({'status':'Failure','message':'Failed'}))
        else:
            return HttpResponse(json.dumps({'status':'Failure','message':'Failed'}))
    except Exception as e:
        response = 'Invalid Type!Please Check It!!!'
        return HttpResponse(json.dumps({'status':'Failure','message':response}))
