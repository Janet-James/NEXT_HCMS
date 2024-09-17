
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
import requests
import logging
import logging.handlers
import config
import urllib2
import urllib,re,pprint
import imaplib
from dateutil import tz
from datetime import datetime,tzinfo 
import performance_dashboard_config as dashboard_config
from django.views.decorators.csrf import csrf_exempt
import ast
logger_obj = logging.getLogger('logit')

# class HCMSTeamLeadDashboard(TemplateView):  #Added- ESA-8-OCt2018
#     ''' 
#     11-SEP-2018 || ESA || To HCMS MYNEXT Dashboard  page loaded.
#     @param request: Request Object
#     @type request : Object
#     @return:   HttpResponse or Redirect the another URL
#     '''
#         
#     @method_decorator(login_required)
#     def dispatch(self, request, *args, **kwargs):
#         return super(HCMSTeamLeadDashboard, self).dispatch(request, *args, **kwargs)
#     
#     def get_template_names(self):
#         macl = menu_access_control('Performance Management', self.request.user.id)
#         if macl:
#             template_name = 'mynext_dashboard/team_lead_dashboard.html'
#         else:
#             template_name = "tags/access_denied.html"
#         return [template_name]
#     
#     def get(self, request, *args, **kwargs):
#         cur=connection.cursor() 
#         context = super(HCMSTeamLeadDashboard, self).get_context_data(**kwargs)
#         current_user_id=request.user.id
#         cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.employee_user_rel_id_fetch).format(current_user_id))
#         employee_info=dictfetchall(cur)
#         if employee_info:
#            context['employee']=employee_info[0]['name']
#         else :
#             context['employee']='User'
#         return self.render_to_response(context)  
#     
# class HCMSMyNEXTDashboard(TemplateView):  #Added- BAV-27AUG2018
#     ''' 
#     11-SEP-2018 || BAV || To HCMS MYNEXT Dashboard  page loaded.
#     @param request: Request Object
#     @type request : Object
#     @return:   HttpResponse or Redirect the another URL
#     '''
#         
#     @method_decorator(login_required)
#     def dispatch(self, request, *args, **kwargs):
#         return super(HCMSMyNEXTDashboard, self).dispatch(request, *args, **kwargs)
#     
#     def get_template_names(self):
#         macl = menu_access_control('Performance Management', self.request.user.id)
#         if macl:
#             template_name = 'mynext_dashboard/individual_dashboard.html'
#         else:
#             template_name = "tags/access_denied.html"
#         return [template_name]
#     
#     def get(self, request, *args, **kwargs):
#         cur=connection.cursor() 
#         context = super(HCMSMyNEXTDashboard, self).get_context_data(**kwargs)
#         current_user_id=request.user.id
#         cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.employee_user_rel_id_fetch).format(current_user_id))
#         employee_info=dictfetchall(cur)
#         return self.render_to_response(context)

class HCMSTEmployeeDashboard(TemplateView):  #Added- ESA-8-OCt2018
    ''' 
    25-OCt-2018 || ESA || To HCMS MYNEXT Employee Dashboard  page loaded.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
        
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HCMSTEmployeeDashboard, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Performance Management', self.request.user.id)
        if macl:
            template_name = 'mynext_dashboard/employee_dashboard.html'
        else:
            template_name = "tags/access_denied.html"
        return [template_name]
    
    def get(self, request, *args, **kwargs):
        cur=connection.cursor() 
        context = super(HCMSTEmployeeDashboard, self).get_context_data(**kwargs)
        current_user_id=request.user.id
        cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.employee_user_rel_id_fetch).format(current_user_id))
        employee_info=dictfetchall(cur)
        if employee_info:
            context['employee']=employee_info[0]['name']
        else :
            context['employee']='User'
        return self.render_to_response(context)  
    
class HCMSTEmployeeTeamleadDashboard(TemplateView):  #Added- ESA-8-OCt2018
    ''' 
    25-OCt-2018 || ESA || To HCMS MYNEXT Employee Teamlead Dashboard  page loaded.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
        
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HCMSTEmployeeTeamleadDashboard, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Performance Management', self.request.user.id)
        if macl:
            template_name = 'mynext_dashboard/employee_teamlead_dashboard.html'
        else:
            template_name = "tags/access_denied.html"
        return [template_name]
    
    def get(self, request, *args, **kwargs):
        cur=connection.cursor() 
        context = super(HCMSTEmployeeTeamleadDashboard, self).get_context_data(**kwargs)
        current_user_id=request.user.id
        cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.employee_user_rel_id_fetch).format(current_user_id))
        employee_info=dictfetchall(cur)
        if employee_info:
            context['employee']=employee_info[0]['name']
        else :
            context['employee']='User'
        return self.render_to_response(context)  
    
                                        
                                        #  || BAV ||    MYNEXT User Individual Dashboard Timer Function 
    
@csrf_exempt
def news_data_api(request):
    ''' 
            01-NOV-2018 || BAV || To load CMS NEWSNOW Details.
            @param request: Request Object
            @type request : Object
            @return:   HttpResponse or Redirect the another URL
    '''
    newsnow_res={}
    try:
#        conn = psycopg2.connect("dbname='dev_cms1' user='next' host='192.168.10.66' password='next'")
#        cr = conn.cursor()
	cr = 0
        if cr:
            cr.execute("""select c.id,regexp_replace(c.content_value, E'<[^>]+>', '', 'gi') as content_value,c.content_image_url from content_info c left join section_info s on s.id=c.content_section_id where c.content_is_active=True  
        and s.section_type_name ilike 'Breaking News' order by c.id DESC limit 3""")
            newsnow_res['newsnow'] =  dictfetchall(cr)
            cr.execute("""select c.id,regexp_replace(c.content_value, E'<[^>]+>', '', 'gi') as content_value,c.content_image_url from content_info c left join section_info s on s.id=c.content_section_id where c.content_is_active=True  
        and s.section_type_name ilike 'In-House' order by c.id DESC limit 3""")
            newsnow_res['in_house'] =  d3kictfetchall(cr) 
            newsnow_res['status'] = 200
        else:
            newsnow_res['status'] = "Service Unavailable"
    except Exception as e:
        newsnow_res['status'] = e
        newsnow_res['status'] = "Exception occurs"
    return HttpResponse(json.dumps(newsnow_res))  

def user_task_details(request):
    ''' 
            09-OCT-2018 || BAV || To load user task Details.
            @param request: Request Object
            @type request : Object
            @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    current_user_id=request.user.id
    json_data['url_status']=[]
    try:
        if current_user_id:
            url_status= urllib.urlopen('http://10.0.1.5:9001/get_task_list/').getcode()
           # url_status=2
            if url_status== 200:
                user_details = {'user_id':current_user_id}
                url = 'http://10.0.1.5:9001/get_task_list/'
                data = urllib.urlencode(user_details)
                request = urllib2.Request(url, data)
                response = urllib2.urlopen(request)
                output = response.read()
                project_data = json.loads(output)
                json_data['data'] = project_data
                print"dsssssssssssssssssssssssssssssssssssssssssssss",project_data
                if project_data['status']=='NTE-01':
                    json_data['url_status']=1
                else:
                     json_data['url_status']=0
            else:
                json_data['url_status']="Service Unavailable"
        else:
            json_data['url_status'] = []
    except Exception as e:
            json_data['error'] = e
            logger_obj.info("6MYNEXT User Dashboard form Load data exception"+ str(e) +" attempted by "+str(request.user.username)) 
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def user_task_summary_details(request):
    ''' 
            09-OCT-2018 || BAV || To load user task summary Details.
            @param request: Request Object
            @type request : Object
            @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    current_user_id=request.user.id
    json_data['url_status']=[]
    try:
        if current_user_id:
            url_status= urllib.urlopen('http://10.0.1.5:9001/get_worksummary_list/').getcode()
        #    url_status=2
            if url_status== 200:
                user_details = {"task_id":request.POST.get('task_id')}
                url = 'http://10.0.1.5:9001/get_worksummary_list/'
                data = urllib.urlencode(user_details)
                request = urllib2.Request(url, data)
                response = urllib2.urlopen(request)
                output = response.read()
                project_data = json.loads(output)
                json_data['data'] = project_data
                if project_data['status']=='NTE-01' or project_data['progress_data']:
                    json_data['url_status']=1
                else:
                    json_data['url_status']=0
            else:
                json_data['url_status']="Service Unavailable"
        else:
            json_data['url_status'] = []
    except Exception as e:
            json_data['error'] = e
            logger_obj.info("7MYNEXT User Dashboard form Load data exception"+ str(e) +" attempted by "+str(request.user.username))  
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def timer_data_update(request):
    ''' 
            09-OCT-2018 || BAV || To load user task summary Details.
            @param request: Request Object
            @type request : Object
            @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    json_status ={}
    current_user_id=request.user.id
    try:
        if current_user_id:
            time_data = request.POST.get('timer_data')
            requst_data = json.loads(time_data)
#            requst_data = ''
            if requst_data:  
                app = 'application/json'
                content = 'Content-Type'
                if requst_data[0]['update_data']:
                    for i in requst_data[0]['update_data']:
                        task_data = []
                        task_data.append(i)
                        json_data['task_lists'] = task_data
                        json_data['user_id'] = current_user_id
                        url = 'http://10.0.1.5:9001/insert_task_timer/'
#                         json_data['device_name'] = "web"
#                         url = 'http://192.168.10.52:9001/insert_task_timer/'
                        req = urllib2.Request(url, json.dumps(json_data), {content: app})
                        f = urllib2.urlopen(req, timeout=10)
                        output = f.read()
                        state_data = json.loads(output)
                    if state_data['status']=='NTE-01':
                        del requst_data[0]['update_data']
                        json_data['task_lists'] = requst_data
                        json_data['user_id'] = current_user_id
                        url = 'http://10.0.1.5:9001/insert_task_timer/'
#                         json_data['device_name'] = "web"
#                         url = 'http://192.168.10.52:9001/insert_task_timer/'
                        req = urllib2.Request(url, json.dumps(json_data), {content: app})
                        f = urllib2.urlopen(req, timeout=10)
                        output = f.read()
                        state_data = json.loads(output)
                        json_status['status'] =state_data
                         
                else:
                    del requst_data[0]['update_data']
                    json_data['task_lists'] = requst_data
                    json_data['user_id'] = current_user_id
                    url = 'http://10.0.1.5:9001/insert_task_timer/'
#                     json_data['device_name'] = "web"
#                     url = 'http://192.168.10.52:9001/insert_task_timer/'
                    req = urllib2.Request(url, json.dumps(json_data), {content: app})
                    f = urllib2.urlopen(req, timeout=10)
                    output = f.read()
                    state_data = json.loads(output)
                    json_status['status'] =state_data
                    
            else:
                json_status['status'] ="No Data"
        else:
            json_status['status'] ="Not a user"
    except Exception as e:
        json_status['error'] = e
        logger_obj.info("1MYNEXT User Dashboard form Load data exception"+ str(e) +" attempted by "+str(request.user.username))    
    return HttpResponse(json.dumps(json_status), content_type=config.content_type_value)

def task_summary_insert(request):
    ''' 
            13-OCT-2018 || BAV || To insert task summary Details.
            @param request: Request Object
            @type request : Object
            @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    json_result = {}
    json_status = {}
    current_user_id=request.user.id
    try:
        print "iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii"
        if current_user_id:
            time_data = request.POST.get('timer_data')
#	    time_data = ''
            if time_data:
                requst_data = json.loads(time_data)
                app = 'application/json'
                content = 'Content-Type'
                time_update = requst_data[0]['timer_update']
                now = datetime.now().time()
                print"TIMEEEE",now
                print"DATAAA",requst_data[0]['work_summary_date']
                summary_date=datetime.strptime(requst_data[0]['work_summary_date'], "%Y-%m-%d").date()
                print"DATETTTTTTTTTT",datetime.combine(summary_date,now)
                json_result['task_lists'] = time_update
                json_result['user_id'] = current_user_id
                url = 'http://10.0.1.5:9001/insert_task_timer/'
#                 json_data['device_name'] = "web"
#                 url = 'http://192.168.10.52:9001/insert_task_timer/'
                req = urllib2.Request(url, json.dumps(json_result), {content: app})
                f = urllib2.urlopen(req, timeout=10)
                output = f.read()
                state_data = json.loads(output)
		print "Dattttttt",state_data
                json_status['status'] =state_data
                if state_data['status']=='NTE-01':
                    del requst_data[0]['timer_update']
                    url = 'http://10.0.1.5:9001/mynext_insert_work_summary/'
                    json_data['task_work_summary'] = requst_data
                    json_data['user_id'] = current_user_id
                    req = urllib2.Request(url, json.dumps(json_data), {content: app})
                    f = urllib2.urlopen(req, timeout=10)
                    output = f.read()
                    state_data = json.loads(output)
                    print 'ssssssssssssssss', state_data
                    json_status['status'] =state_data
            else:   
                json_status['status'] ="No Data"
        else:
            json_status['status'] ="Not a user"
    except Exception as e:
        json_status['error'] = e
        print"EEEEEEEEEE",e
        logger_obj.info("2MYNEXT User Dashboard form Load data exception"+ str(e) +" attempted by "+str(request.user.username))    
    return HttpResponse(json.dumps(json_status), content_type=config.content_type_value)

def process_matrix_project(request):
    ''' 
            27-OCT-2018 || BAV || To load user project Details.
            @param request: Request Object
            @type request : Object
            @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    user_details = {}
    current_user_id=request.user.id
    json_data['url_status']=[]
#     try:
    current_user_id = ''
    if current_user_id:
#         url_status= urllib.urlopen('http://192.168.11.25:8001/get/project_drop_down/').getcode()
        url_status= urllib.urlopen('http://10.0.1.5:9001/mynext_project_filter/').getcode()
#	url_status = 0
        if url_status== 200 or url_status!=200:
            app = 'application/json'
            content = 'Content-Type'
            user_details['user_id'] = current_user_id
            url = 'http://10.0.1.5:9001/mynext_project_filter/'
            req = urllib2.Request(url, json.dumps(user_details), {content: app})
            f = urllib2.urlopen(req, timeout=10)
            output = f.read()
            project_data = json.loads(output)
            json_data['data'] = project_data
            json_data['url_status']=1
        else:
            json_data['url_status']=0
    else:
        json_data['url_status'] = 0
#     except Exception as e:
#             json_data['error'] = e
#             logger_obj.info("MYNEXT User Dashboard form Load data exception"+ str(e) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data), content_type=config.content_type_value)

def process_matrix_attendance(request):
    ''' 
            27-OCT-2018 || BAV || To load user project Details.
            @param request: Request Object
            @type request : Object
            @return:   HttpResponse or Redirect the another URL
    '''
    attendance_res={}
    try:
        res_user = 0
        if request.GET:
            res_user = str(request.GET.get("user_id"))
            #logger_obj.info("Request Attendance information by "+res_user)
        elif request.user.id:
           # logger_obj.info("Request Attendance information by "+str(request.session['name']))
            res_user = request.user.id
        cr = connection.cursor() 
        cr.execute(""" select id from employee_info where related_user_id_id=%s""",(res_user,))
        user_id = dictfetchall(cr)
        if user_id[0]['id']:
            if cr:
                cr.execute("""
                select date,replace(to_char(check_in,'HH24:MI')::varchar,':','.') as check_in,replace(to_char(check_out,'HH24:MI')::varchar,':','.') as check_out from 
        (
        select employee_id_id,to_char(date(check_in),'YYYY-MM-DD') as date,
        to_char(check_in,'HH24:MI')::time
         as check_in,
        to_char(check_out,'HH24:MI')::time
         as check_out
          from attendance_info as hra
          left join employee_info hr on hr.related_user_id_id = hra.employee_id_id
          where extract(year from check_in)=extract(year from now()) 
          and hra.employee_id_id =%s
         group by date,employee_id_id,
        hra.check_in,hra.check_out
        )
         as a
        group by a.date,check_in,check_out order by a.date""",(str(user_id[0]['id']),))
                record_fetch =  dictfetchall(cr)
                if record_fetch:
                    attendance_res['status']=  1
                    attendance_res['message']=  "Record Fetch Successfully"
                    attendance_res['attendance_data']=  record_fetch
                else:
                    attendance_res['status']=  0
                    attendance_res['message'] = 'No Data Found'
                    logger_obj.info("Attendance Data Not Found")
        else:
            attendance_res['status']=  0
            attendance_res['message'] = 'Unable to create database connection'
    except Exception as e:
     #   #logger_obj.error(e)
        attendance_res['status']=  0
        attendance_res['message'] = 'Exception caused'
    logger_obj.info("Attendance information is "+str(attendance_res['message']))
    return HttpResponse(json.dumps(attendance_res,cls=DjangoJSONEncoder), content_type=config.content_type_value)


def process_matrix_task(request):
    ''' 
            27-OCT-2018 || BAV || To load user project Details.
            @param request: Request Object
            @type request : Object
            @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    current_user_id=request.user.id
    json_data['url_status']=[]
    try:
        if current_user_id:
            time_data = request.POST.get('process_matrix_task')
            request_data = json.loads(time_data)
            if request_data:
                app = 'application/json'
                content = 'Content-Type'
                url_status= urllib.urlopen('http://10.0.1.5:9001/project/task/mynext/list/').getcode()
#		url_status = 2
                if url_status== 200 or url_status== 500:
                    request_data[0]['user_id']=str(current_user_id)
                    request_data[0]['project_id']=str(request_data[0]['project_id'])
#                     url = 'http://192.168.11.25:8001/get/task_list/'
                    url = 'http://10.0.1.5:9001/project/task/mynext/list/'
                    req = urllib2.Request(url, json.dumps(request_data[0]), {content: app})
                    f = urllib2.urlopen(req, timeout=10)
                    output = f.read()
                    state_data = json.loads(output)
                    json_data['data'] = state_data
                    json_data['url_status']= 1
                else:
                    json_data['url_status']="Service Unavailable"
        else:
            json_data['url_status'] = 0
    except Exception as e:
            json_data['error'] = e
            logger_obj.info("3MYNEXT User Dashboard form Load data exception"+ str(e) +" attempted by "+str(request.user.username)) 
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def dev_talk_process(request):
    ''' 
            29-OCT-2018 || BAV || To load Dev Talk Details.
            @param request: Request Object
            @type request : Object
            @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    current_user_id=request.user.id
    json_data['url_status']=[]
    try:
        if current_user_id:
#             url_status= urllib.urlopen('http://192.168.10.246:8080/forum_record/?cat_id=0').getcode()
#            url_status= urllib.urlopen('http://192.168.10.66:8080/forum_record/?cat_id=0').getcode()
	    url_status = 0
            if url_status== 200:
                user_details = {'user_id':155}
                url = 'http://192.168.10.66:8080/forum_record/?cat_id=0'
                request = urllib2.Request(url)
                response = urllib2.urlopen(request)
                output = response.read()
                project_data = json.loads(output)
                json_data['data'] = project_data
                json_data['url_status']=200
            else:
                json_data['url_status']="Service Unavailable"
        else:
            json_data['url_status'] = []
    except Exception as e:
            json_data['error'] = e
            logger_obj.info("4MYNEXT User Dashboard form Load data exception"+ str(e) +" attempted by "+str(request.user.username)) 
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def task_stage_update(request):
    ''' 
            03-DEC-2018 || BAV || To load Stage Change Details.
            @param request: Request Object
            @type request : Object
            @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    json_result = {}
    current_user_id=request.user.id
    try:
        if current_user_id:
            json_data['task_id'] = request.POST.get('task_id')
            json_data['task_time'] = request.POST.get('time')
            app = 'application/json'
            content = 'Content-Type'
            url_status = urllib.urlopen('http://10.0.1.5:9001/task_stage_update/').getcode()
#	    url_status = 0
            if url_status== 200 or url_status!= 200:
                url = 'http://10.0.1.5:9001/task_stage_update/'
                req = urllib2.Request(url, json.dumps(json_data), {content: app})
                f = urllib2.urlopen(req, timeout=10)
                output = f.read()
                state_data = json.loads(output)
                json_result['result'] = state_data
                json_result['ststus'] = 1
            else:
                json_result['ststus'] = 0
    except Exception as e:
            json_result['ststus'] = e
            logger_obj.info("5MYNEXT User Dashboard form Load data exception"+ str(e) +" attempted by "+str(request.user.username)) 
    return HttpResponse(json.dumps(json_result,cls=DjangoJSONEncoder), content_type=config.content_type_value)

                                #  || BAV ||    MYNEXT User Individual Dashboard Timer Function End 
def team_lead_dashboard(request):
    ''' 
            8-OCt-2018 || ESA || To fetch team_lead_dashboard
            @param request: Request Object
            @type request : Object
            @return:  return the data
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    json_data['url_status']=[]
    json_data['general_rating']=[]
    try:
        if current_user_id:
             url_status= urllib.urlopen(config.dns+"/performance/employee/ratings/user/").getcode()
             url_status1= urllib.urlopen(config.rating_api_ip+"/performance/employee/ratings/user/").getcode()
#	     url_status=1
#	     url_status1=0
             if url_status==200:
                 req_url=config.dns+"/performance/employee/ratings/user/"
             else:
                 req_url=config.rating_api_ip+"/performance/employee/ratings/user/"
             if url_status==200 or url_status1==200:
                 user_details = {"user_id": current_user_id,'team_name':'ALL'}
                 data = urllib.urlencode(user_details)
                 request = urllib2.Request(req_url, data)
                 response = urllib2.urlopen(request)
                 output = response.read()
                 project_data = json.loads(output)
                 if project_data['category_ratings_status']!='NTE-000':
                     json_data['overall_rating']=float(project_data['employee_ratings'][0]['actual_percent'])/100*5
                     json_data['general_rating']=project_data['category_ratings']
                 else:
                     json_data['overall_rating']=[]
             else:
                json_data['overall_rating']=[]
                json_data['url_status']=url_status1
        else:
                json_data['overall_rating']=[]
    except Exception as e:
         result = e
         json_data['overall_rating']=[]
         json_data['general_rating']=[]
         json_data['url_status']=404
         logger_obj.info("team lead dashboard details details"+ str(e) +" attempted by "+str(request.user.username))  
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value) 

def project_track(request):
    ''' 
    8-OCt-2018 || ESA || To fetch team_lead_dashboard
    @param request: Request Object
    @type request : Object
    @return:  return the data
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    json_data['url_status']=[]
    json_data['project_track']=[]
    try:
        if current_user_id:
             url_status= urllib.urlopen(config.project_url+"/project/info/list/").getcode()
             url_status1= urllib.urlopen(config.dns+"/project/info/list/").getcode()
#	     url_status=1
#	     url_status1=0
             if url_status==200:
                 req_url=config.project_url+"/project/info/list/"
             else:
                 req_url=config.project_url+"/project/info/list/"
             if url_status==200 or url_status1==200:
                 cur.execute('select related_user_id_id as reporting_officer_id from employee_info where id=(select reporting_officer_id  from employee_info where related_user_id_id={0})'.format(str(current_user_id)))
                 reporting_officer=dictfetchall(cur)
                 if reporting_officer:
                    team_lead_id=reporting_officer[0]['reporting_officer_id']
                 else:
                    team_lead_id=current_user_id
                 user_details = {"team_lead_id": current_user_id,'user_id':current_user_id}
                 data = urllib.urlencode(user_details)
                 request = urllib2.Request(req_url, data)
                 response = urllib2.urlopen(request)
                 output = response.read()
                 project_details = json.loads(output)
                 if project_details['status_code']=='NTE-001':
                     json_data['project_track']=project_details['project_info']
                 else:
                     json_data['project_track']=[]
             else:
                json_data['project_track']=[]
                json_data['url_status']=400
        else:
                json_data['project_track']=[]
    except Exception as e:
         result = e
         json_data['project_track']=[]
         json_data['url_status']=404
         logger_obj.info("team lead dashboard details details"+ str(e) +" attempted by "+str(request.user.username))  
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value) 

def today_meeting_schedule(request):
    ''' 
            12-OCT-2018 || SND || To fetch today_meeting_schedule
            @param request: Request Object
            @type request : Object
            @return:  return the data
    '''
    json_data={}
    meeting_dict = {}
    complete_meeting_dict={}
    schedule_details_list = []
    complete_details_list = []
    current_user_id=request.user.id
    cur = db_connection()
    req_url = ''
    count = 0
    colors = ["#de4c4f","#d8854f","#eea638","#a7a737","#86a965","#8aabb0","#69c8ff","#cfd27e","#9d9888","#916b8a","#724887","#7256bc"]
#     try:
    if current_user_id:
          
          req_url="http://10.0.1.8:80/scheduled_meeting/"
          req_url1="http://10.0.1.8:80/completed_meeting/"
#	  req_url = ''
#	  req_url1 = ''
          if req_url!='':
              to_zone = request.GET.get('to_zone')
              user_details = {'meeting':{'user_id': current_user_id}}
              data = urllib.urlencode(user_details)
              request = urllib2.Request(req_url, data)
              response = urllib2.urlopen(request)
              output = response.read()
              schedule_details = json.loads(output)
              
              meeting_details = {'completed_meeting':{'user_id': current_user_id}}
              data = urllib.urlencode(meeting_details)
              request = urllib2.Request(req_url1, data)
              response = urllib2.urlopen(request)
              output = response.read()
              completed_details = json.loads(output)
              if schedule_details:  
                  if schedule_details['msg']=='Success':
                      for meeting in schedule_details['meeetinginfo']:
                          meeting_dict = {}
                          start_time = datetime.strptime(meeting['meeting_starts_at'],"%Y-%m-%dT%H:%M:%SZ").replace(tzinfo=tz.gettz('UTC')).astimezone(tz.gettz(str(to_zone))).strftime('%H:%M').replace(':','.') 
                          end_time = datetime.strptime(meeting['meeting_ends_at'],"%Y-%m-%dT%H:%M:%SZ").replace(tzinfo=tz.gettz('UTC')).astimezone(tz.gettz(str(to_zone))).strftime('%H:%M').replace(':','.') 
                          meeting_dict['start'] = start_time
                          meeting_dict['end'] = end_time
                          meeting_dict['task'] = meeting['meeting_name']
                          meeting_dict['color'] = colors[count]
                          count = count + 1;
                          if len(colors)==count:
                              count = 0
                          schedule_details_list.append(meeting_dict)
                      json_data['today_schedule']=schedule_details_list
                      json_data['status'] = status_keys.SUCCESS_STATUS
                  else:
                      json_data['status'] = status_keys.SUCCESS_STATUS
                      json_data['today_schedule']=[]
                      
              if completed_details:
                if completed_details['msg']=='Success':
                    for completed_meeting in completed_details['meeetinginfo']:
                        complete_meeting_dict={}
                        start_time = datetime.strptime(completed_meeting['meeting_starts_at'],"%Y-%m-%dT%H:%M:%SZ").replace(tzinfo=tz.gettz('UTC')).astimezone(tz.gettz(str(to_zone))).strftime('%H:%M').replace(':','.') 
                        end_time = datetime.strptime(completed_meeting['meeting_ends_at'],"%Y-%m-%dT%H:%M:%SZ").replace(tzinfo=tz.gettz('UTC')).astimezone(tz.gettz(str(to_zone))).strftime('%H:%M').replace(':','.') 
                        complete_meeting_dict['start'] = start_time
                        complete_meeting_dict['end'] = end_time
                        complete_meeting_dict['task'] = completed_meeting['meeting_name']
                        complete_meeting_dict['color'] = colors[count]
                        count = count + 1;
                        if len(colors)==count:
                            count = 0
                        complete_details_list.append(complete_meeting_dict)
                              
                    json_data['complete_schedule']=complete_details_list
                    json_data['status'] = status_keys.SUCCESS_STATUS
                else:
                    json_data['status'] = status_keys.SUCCESS_STATUS
                    json_data['complete_schedule']=[]
              else:
                    json_data['status'] = status_keys.SUCCESS_STATUS
                    json_data['complete_schedule']=[]
                      
          else:
              json_data['status'] = status_keys.FAILURE_STATUS
              json_data['today_schedule']=[]
              json_data['complete_schedule']=[]
    else:
          json_data['status'] = status_keys.FAILURE_STATUS
#     except Exception as e:
#         result = e
#         json_data['status'] = status_keys.FAILURE_STATUS
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value) 
 

def team_lead_dashboard_plans(request):
    ''' 
                11-OCt-2018 || ESA || To fetch team_lead_dashboard
                @param request: Request Object
                @type request : Object
                @return:  return the data
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    json_data['url_status']=[]
    json_data['project_task']=[]
    try:
      start_date=request.GET.get('start_date')
      end_date=request.GET.get('end_date')
      if current_user_id:
         url_status= urllib.urlopen(config.project_url+"/project/task_info/").getcode()
         url_status1= urllib.urlopen(config.dns+"/project/task_info/").getcode()
#	 url_status=1
#	 url_status1=0
         if url_status==200:
             req_url=config.project_url+"/project/task_info/"
         else:
             req_url=config.dns+"/project/task_info/"
         if url_status==200 or url_status1==200:
             user_details = {"user_id": current_user_id,'from_date':start_date,'to_date':end_date}
             data = urllib.urlencode(user_details)
             request = urllib2.Request(req_url, data)
             response = urllib2.urlopen(request)
             output = response.read()
             project_task_details = json.loads(output)
             if project_task_details['status_code']=='NTE-001':
                 json_data['project_task']=project_task_details['task_info']
             else:
                 json_data['project_task']=[]
         else:
            json_data['project_task']=[]
            json_data['url_status']=400
      else:
            json_data['project_task']=[]
    except Exception as e:
         result = e
         json_data['project_task']=[]
         json_data['url_status']=404
         logger_obj.info("team lead dashboard task details details"+ str(e) +" attempted by "+str(request.user.username))  
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value) 

def team_lead_dashboard_goals(request):
    ''' 
            11-OCt-2018 || ESA || To fetch team lead goals
            @param request: Request Object
            @type request : Object
            @return:  return the success message and data
    '''
    json_data={}
    if request.user.id:
        current_user_id=request.user.id
    else:
        current_user_id=request.GET.get('user_id')
    cur = db_connection()
    json_data['lead_goal_data']=[]
    json_data['members']=[]
    try:
        if current_user_id:
           json_data['lead_goal_data']=[]
           tab_id=request.GET.get('tab_id')
           member_id=request.GET.get('member_id')
           cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.employee_user_rel_id_fetch).format(current_user_id))
           employee_data=dictfetchall(cur)
           if tab_id=='team_lead':
               cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.team_lead_goal).format(employee_data[0]['id']))
               lead_goal_data=dictfetchall(cur)
#                cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.team_lead_goal).format(67))
#                lead_goal_data=dictfetchall(cur)
               cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.reporting_officer_members_fetch).format(current_user_id))
               members_details=dictfetchall(cur)
               if members_details:
                   json_data['members']=members_details
               else:
                    json_data['members']=[]
               if lead_goal_data:
                   json_data['lead_goal_data']=lead_goal_data
               else:
                    json_data['lead_goal_data']=[]
           if tab_id=='team_member' and member_id!='':
               cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.team_lead_goal).format(member_id))
               lead_goal_data=dictfetchall(cur)
               if lead_goal_data:
                   json_data['lead_goal_data']=lead_goal_data
               else:
                    json_data['lead_goal_data']=[]
            
    except Exception as e :
        result=e
        json_data['lead_goal_data']=[]
        json_data['members']=[]
        json_data['url_status']=404
        logger_obj.info("team lead dashboard goals Details "+ str(result) +" attempted by "+str(request.user.username)) 
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value) 

def survey_guideline_data(request):
    ''' 
            11-OCt-2018 || JAN || To fetch survey and guideline detail
            @param request: Request Object
            @type request : Object
            @return:  return the success message and data
    '''
    json_data={}
    user_data={}
    json_data['survey_data']=[]
    json_data['guideline_data']= []
    if request.user.id:
        current_user_id=request.user.id
    else:
        current_user_id=request.GET.get('user_id')
    cur = db_connection()
    try:
        if current_user_id:
            cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.employee_user_rel_id_fetch).format(current_user_id))
            employee_data=dictfetchall(cur)
            if employee_data:
                cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.survey_data_fetch).format(employee_data[0]['id']))
                survey_data=dictfetchall(cur)
                json_data['survey_data']=survey_data
#                cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.guidelines_data_fetch).format(employee_data[0]['id']))
#                guideline_data=dictfetchall(cur)     
                url_status= urllib.urlopen(config.dns+'/project/guideline/').getcode()
#		url_status=0
                if url_status== 200:
                    app = 'application/json'
                    content = 'Content-Type'
                    url = config.dns+'/project/guideline/'
                    user_data['user_id']  = current_user_id
                    req = urllib2.Request(url, json.dumps(user_data), {content: app})
                    f = urllib2.urlopen(req, timeout=10)
                    output = f.read()
                    state_data = json.loads(output)
                    if state_data['status_code']=="NTE-001":
                        
                        json_data['guideline_data']=state_data
    except Exception as e :
        result=e
        json_data['status']=status_keys.NTE_08
        logger_obj.info("team lead dashboard goals Details "+ str(result) +" attempted by "+str(request.user.username))  
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value) 

def survey_add_update(request):
    ''' 
            11-OCt-2018 || JAN || To add and update survey detail
            @param request: Request Object
            @type request : Object
            @return:  return the success message and data
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    if current_user_id:
        rating=request.GET.get('rating')
        comments=request.GET.get('comment')
        survey_id=request.GET.get('survey_id','')
        cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.employee_user_rel_id_fetch).format(current_user_id))
        employee_data=dictfetchall(cur)
        if employee_data:
            cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.employee_rating_exist_check),(employee_data[0]['id'],survey_id))
            rating_check=dictfetchall(cur)
            if rating_check:
                cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.survey_detail_update).format(rating,str(comments),current_user_id,survey_id,employee_data[0]['id']))
                json_data[config.status] = status_keys.UPDATE_STATUS
            else:
                cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.survey_detail_insert).format(rating,str(comments),employee_data[0]['id'],survey_id,current_user_id))
                survey_rating_id=dictfetchall(cur)
                if survey_rating_id:
                    json_data[config.status] = status_keys.SUCCESS_STATUS
        else:
            json_data[config.status]=status_keys.NTE_08
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def team_lead_dashboard_mem_plans(request):
    ''' 
            16-OCt-2018 || ESA || To fetch team lead goals
            @param request: Request Object
            @type request : Object
            @return:  return the success message and data
    '''
    json_data={}
    if request.user.id:
        current_user_id=request.user.id
    else:
        current_user_id=request.GET.get('user_id')
    cur = db_connection()
    json_data['members']=[]
    try:
        if current_user_id:
               cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.reporting_officer_members_fetch).format(current_user_id))
               members_details=dictfetchall(cur)
               if members_details:
                   json_data['members']=members_details
               else:
                    json_data['members']=[]
    except Exception as e :
        result=e
        json_data['lead_goal_data']=[]
        logger_obj.info("team lead dashboard members_details Details "+ str(result) +" attempted by "+str(request.user.username))  
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value) 

def team_member_plans(request):
    ''' 
                11-OCt-2018 || ESA || To fetch team_lead_dashboard
                @param request: Request Object
                @type request : Object
                @return:  return the data
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    json_data['url_status']=[]
    json_data['project_task']=[]
    try:
     start_date=request.GET.get('start_date')
     end_date=request.GET.get('end_date')
     member_id=request.GET.get('member_id')
#       if current_user_id:
     url_status= urllib.urlopen(config.project_url+"/project/task_info/").getcode()
     url_status1= urllib.urlopen(config.dns+"/project/task_info/").getcode()
#     url_status=1
#     url_status1=0
     if url_status==200:
         req_url=config.project_url+"/project/task_info/"
     else:
         req_url=config.dns+"/project/task_info/"
     if url_status==200 or url_status1==200:
         user_details = {"user_id": member_id,'from_date':start_date,'to_date':end_date}
         data = urllib.urlencode(user_details)
         request = urllib2.Request(req_url, data)
         response = urllib2.urlopen(request)
         output = response.read()
         project_task_details = json.loads(output)
         if project_task_details['status_code']=='NTE-001':
             json_data['project_task']=project_task_details['task_info']
         else:
             json_data['project_task']=[]
     else:
        json_data['project_task']=[]
        json_data['url_status']=400
#       else:
#             json_data['project_task']=[]
    except Exception as e:
         result = e
         json_data['project_task']=[]
         json_data['url_status']=404
         logger_obj.info("team lead dashboard task details"+ str(e) +" attempted by "+str(request.user.username))  
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value) 


""" mail list """
def mail_list(request):
    json_data={}
    mail_list =[]
    try:
        current_user_id=request.user.id
        if current_user_id:
#            url_status= urllib.urlopen('//http://192.168.10.194:1337/').getcode()
	    url_status = 0
            if url_status==200:
                M = imaplib.IMAP4_SSL('mail.next-exos.net')
                M.login('prabha@next-exos.net','welcome')
                M.select('Inbox')
                typ, data = M.search(None, 'ALL')
                for i in data[0].split()[:]:
                    tmp, data = M.fetch(i, '(RFC822)')
                    if 'FLAGS' in re.findall(r'(FLAGS)',data[0][0]):
                        data = re.findall(r'(From.*)',data[0][1],re.DOTALL)
                        org_data = data
                        if org_data:
                            list_data = org_data[0].splitlines()
                            json_data['from'] =list_data[0]
                            json_data['Date'] = list_data[5]
                            json_data['subject'] = list_data[2]
                            json_data['Condent'] = list_data[10]
                        json_data['status'] = 1
                        mail_list.append(json_data)
            else:
                json_data['status'] = 0
                mail_list.append(json_data)
    except Exception as e:
        result = e
        json_data['status'] =e
    return HttpResponse(json.dumps(mail_list,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def birthday_wish(request):
    ''' 
            16-OCt-2018 || ESA || To fetch birthday details
            @param request: Request Object
            @type request : Object
            @return:  return the success message and data
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    json_data['birthday_data']=[]
    try:
        if current_user_id:
               cur.execute(query.fetch_hcms_query(config.performance_assessment_module,config.birthday_wish))
               data=dictfetchall(cur)
               if data:
                   json_data['birthday_data']=data
               else:
                    json_data['birthday_data']=[]
    except Exception as e :
        result=e
        json_data['birthday_data']=[]
        logger_obj.info("birthday details "+ str(result) +" attempted by "+str(request.user.username))  
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value) 
    

def total_count(request):
    ''' 
                11-OCt-2018 || ESA || To fetch team_lead_dashboard
                @param request: Request Object
                @type request : Object
                @return:  return the data
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    json_data['url_status']=[]
    json_data['project_task']=[]
    try:
      start_date=request.GET.get('start_date')
      end_date=request.GET.get('end_date')
      if current_user_id:
         url_status= urllib.urlopen(config.project_url+"/project/task_info/").getcode()
         url_status1= urllib.urlopen(config.dns+"/project/task_info/").getcode()
# 	 url_status=1
#	 url_status1=0
         if url_status==200:
             req_url=config.dns+"/project/task_info/"
         else:
             req_url=config.project_url+"/project/task_info/"
         if url_status==200 or url_status1==200:
             user_details = {"user_id": current_user_id,'from_date':start_date,'to_date':end_date}
             data = urllib.urlencode(user_details)
             request = urllib2.Request(req_url, data)
             response = urllib2.urlopen(request)
             output = response.read()
             project_task_details = json.loads(output)
             if project_task_details['status_code']=='NTE-001':
                 json_data['project_task']=project_task_details['task_info']
             else:
                 json_data['project_task']=[]
         else:
            json_data['project_task']=[]
            json_data['url_status']=400
      else:
            json_data['project_task']=[]
    except Exception as e:
         result = e
         json_data['project_task']=[]
         json_data['url_status']=404
         logger_obj.info("team lead dashboard task details details"+ str(e) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value) 
