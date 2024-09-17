# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.shortcuts import render

import json
from django.views.decorators.csrf import csrf_exempt
from django.http.response import HttpResponse
from CommonLib import query
from django.db import connection
import config
from HRMS_Foundation.attendance_management.models import AttandanceInfo as AI
from CommonLib import query as q

#template render html
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from CommonLib.hcms_common import menu_access_control
import logging
import logging.handlers
logger_obj = logging.getLogger('logit')

#Past Attendance views here
class HrmsPastAttendance(TemplateView):
    ''' 
     12-Feb-2018 TRU To HRMS Past Attendance page loaded. And also check the user authentication
     @param request: Request Object
     @type request : Object
     @return:   HttpResponse or Redirect the another URL
     @author: TRU
     '''

#     template_name = "hrms_foundation/attendance_management/past_attendance.html"
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HrmsPastAttendance, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control("Attendance Records", self.request.user.id)
        if macl:
            template_name = "hrms_foundation/attendance_management/past_attendance.html"
        else:
            template_name = "tags/access_denied.html"
        return [template_name]
    
    def get(self, request, *args, **kwargs):
         context = super(HrmsPastAttendance, self).get_context_data(**kwargs)
         cur = connection.cursor()  #create the database connection
         cur.execute(q.fetch_hcms_query(config.attendance_management, config.hrms_org_list));
         values = q.dictfetchall(cur)
         if values:
             org_data = values
         else:
             org_data = []
         context['org'] = org_data
         return self.render_to_response(context)

#Past Attendance Search function here
def hrmsPastSearchAttendance(request):
    ''' 
    12-Feb-2018 TRU To HRMS Past Attendance search page loaded. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: TRU
    '''
    json_data = {}
    try:
            logger_obj.info('Employee past attendance search function by'+str(request.user.username))
            post = request.POST
            input_data = json.loads(post.get(config.input_data))  
            company_id = input_data[0][config.c_id]  
            from_date = input_data[0][config.from_date]   
            to_date = input_data[0][config.to_date]   
            org_unit_id = input_data[0][config.org_unit_id]   
            emp_list = tuple(int(i) for i in input_data[0][config.emp_list]) 
            cur = connection.cursor()  #create the database connection
            querys =  q.fetch_hcms_query(config.attendance_management, config.hrms_attendance_list)   
            values = []
            from_date = from_date.split(' ')[0]
            to_date = to_date.split(' ')[0]
            if emp_list and company_id and from_date and to_date and org_unit_id:
                  querys = querys+" and  ai.check_in::date >= '"+str(from_date)+"' and ai.check_out::date <= '"+str(to_date)+"' and ei.org_id_id=%s and ei.org_unit_id_id=%s  and ei.id in %s"
                  cur.execute(querys+" order by ci.name",(int(company_id),int(org_unit_id),emp_list));
                  values = cur.fetchall()
            else:
                 querys = querys+" and  ai.check_in::date >= '"+str(from_date)+"' and ai.check_out::date <= '"+str(to_date)+"' and ei.org_id_id=%s and  ei.org_unit_id_id=%s "
                 cur.execute(querys+" order by ci.name",(int(company_id),int(org_unit_id),));
                 values = cur.fetchall()
            if values:
                     json_data[config.datas] = values
            else:
                     json_data[config.datas] = []
    except Exception as e:
            logger_obj.error(e)
            json_data[config.datas] = []
    return HttpResponse(json.dumps(json_data))


#Past Attendance Employee Search function here
def hrmsOrgtUnitListPastAttendance(request):
    ''' 
    09-Mar-2018 TRU To HRMS Past Attendance employee search page loaded. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: TRU
    '''
    json_data = {}
    try:
            logger_obj.info('Attendance Employee list search function by'+str(request.user.username))
            post = request.POST
            org_id = post.get(config.org_id)  
            org_unit_id = post.get(config.org_unit_id)   
            cur = connection.cursor()  #create the database connection
            div_list = post.get(config.div_list)  
            div_ids = json.loads(div_list)  
            querys =  q.fetch_hcms_query(config.attendance_management, config.hrms_attendance_employee_search_list)   
            if org_id and org_unit_id != '0' and int(len(div_ids)) == 0:
                  cur.execute(querys+' order by name',(int(org_id),int(org_unit_id)));
                  values = q.dictfetchall(cur)
                  json_data[config.datas] = values
            elif org_id and org_unit_id != '0' and len(div_ids) > 0:
                  cur.execute(querys+' and team_name_id in %s order by name',(int(org_id),int(org_unit_id),tuple(div_ids),));
                  values = q.dictfetchall(cur)
                  json_data[config.datas] = values
            else:
                  json_data[config.datas] = []
    except Exception as e:
            logger_obj.error(e)
            json_data[config.datas] = []
    return HttpResponse(json.dumps(json_data))
