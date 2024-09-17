# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.shortcuts import render

import json
from django.views.decorators.csrf import csrf_exempt
from django.http.response import HttpResponse
from CommonLib import query
from django.db import connection
import config
from CommonLib import query as q
from CommonLib.hcms_common import refitem_fetch

#template render html
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from CommonLib.hcms_common import menu_access_control
#logger function import
import logging
import logging.handlers
logger_obj = logging.getLogger('logit')

# HrmsReporting views here
class HrmsReporting(TemplateView):
    ''' 
         22-Feb-2018 TRU To HRMS Reporting page loaded. And also check the user authentication
         @param request: Request Object
         @type request : Object
         @return:   HttpResponse or Redirect the another URL
         @author: TRU
    '''

#     template_name = "hrms_foundation/attendance_management/reporting_builder.html"
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HrmsReporting, self).dispatch(request, *args, **kwargs)

    def get_template_names(self):
        macl = menu_access_control('Employee Report', self.request.user.id)
        if macl:
            template_name = "hrms_foundation/attendance_management/reporting_builder.html"
        else:
            template_name = "tags/access_denied.html"
        return [template_name]
    
    def get(self, request, *args, **kwargs):
         context = super(HrmsReporting, self).get_context_data(**kwargs)
         cur = connection.cursor()  #create the database connection
         cur.execute(q.fetch_hcms_query(config.attendance_management, config.hrms_org_list));
         values = q.dictfetchall(cur)
         if values:
             org_data = values
         else:
             org_data = []
         gender = refitem_fetch('GENDR')
         context['gender'] = gender
         leave = refitem_fetch('LEVTY')
         # Loading role details       
         cur.execute("""select id,role_title as name from hcms_ti_role_details where is_active""")
         role = q.dictfetchall(cur)
         context['leave'] = leave
         context['org'] = org_data
         context['role'] = role
         return self.render_to_response(context)
     
# Report Data views here
def hrmsEmployeeReport(request):
         ''' 
         22-Feb-2018 TRU To HRMS report Employee data page loaded.
         @param request: Request Object
         @type request : Object
         @return:   HttpResponse or Redirect the another URL
         @author: TRU
         '''
         post = request.GET
         id = post.get(config.id)  #get table key 
         cur = connection.cursor()  #create the database connection
         json_data = {}
         try:
             logger_obj.info('Report data function by'+str(request.user.username)) 
             condition = ''
             if int(id) != 0:
                 condition = " ei.org_id_id=%s"%int(id)
                 condition = condition+" and"
             else:
                 logger_obj.info('Id is empty')    
             query =  q.fetch_hcms_query(config.attendance_management, config.hrms_employee_report_list)
             cur.execute(query+condition+" ei.is_active order by ei.name");
             values = cur.fetchall()
             if values:
                 json_data[config.datas] = values
             else:
                 json_data[config.datas] = []
             logger_obj.info('Report data response is'+str(json_data)+"attempted by"+str(request.user.username))    
         except Exception as e:
              logger_obj.error(e)
              json_data[config.datas] = []
         cur.close()
         return HttpResponse(json.dumps(json_data))
     
# Employee Report Search views here
def hrmsEmployeeReportSearch(request):
         ''' 
         22-Feb-2018 TRU To HRMS Employee report Search data loaded.
         @param request: Request Object
         @type request : Object
         @return:   HttpResponse Employee Search Data
         @author: TRU
         '''
         logger_obj.info('Employee Report search function by'+str(request.user.username))
         json_data = {}
         cur=connection.cursor()  #create the database connection
         post = request.GET
         fname = post.get(config.fname)  #get table key 
         lname = post.get(config.lname)  #get table key 
         gender = post.get(config.gender_id)  #get table key 
         role = post.get(config.role)  #get table key 
         org_id = post.get(config.org_id)  #get table key 
         org_unit_id = post.get(config.org_unit_id)  #get table key 
         emp_id = post.get(config.emp_id)  #get table key 
         org_division = post.get(config.org_div) #get table key 
         emp_status = post.get('emp_status') #get table key 
         try:
                     query =  q.fetch_hcms_query(config.attendance_management, config.hrms_employee_report_list)
                     conditions = " ri.is_active  and"
                     if fname != '':
                         conditions = conditions+" ei.name ilike '"'%'+str(fname)+'%'"' and"
                     if lname != '':
                         conditions = conditions+" ei.last_name ilike '"'%'+str(lname)+'%'"' and"
                     if emp_id != '':
                         conditions = conditions+" ei.employee_id in ('"+str(emp_id)+"') and"
                     if role != '':
                         conditions = conditions+" ei.role_id_id=%s "%int(role)
                         conditions = conditions+" and"
                     if gender != '':
                         conditions = conditions+" ei.employee_gender_id=%s"%int(gender)
                         conditions = conditions+" and"
                     if org_unit_id != '':
                         conditions = conditions+" ei.org_unit_id_id=%s "%int(org_unit_id)
                         conditions = conditions+" and"
                     if org_division != '':
                         conditions = conditions+" ei.team_name_id = %s "%int(org_division)
                         conditions = conditions+" and"
                     if emp_status != '':
                         conditions = conditions+" ei.is_active=%s "%(emp_status)
                         conditions = conditions+" and"
                     conditions = conditions.rsplit(' ', 1)[0]
                     conditions =   conditions+ " and ei.org_id_id = %s"%int(org_id) 
                     if cur and query and conditions:
                         querys = (query+str(conditions+" order by ei.name")) 
                         print "==================",querys
                         cur.execute(querys)  
                         values = cur.fetchall()
                         if values:
                            json_data[config.datas] = values
                         else:
                             json_data[config.datas] = []
                     else:
                         json_data[config.datas] = []
                     logger_obj.info('Employee Report search response is'+str(json_data)+"attempted by"+str(request.user.username))   
         except Exception as e:
              logger_obj.error(e)
              json_data[config.datas] = []
         cur.close()
         return HttpResponse(json.dumps(json_data))
     
# Document Report Data views here
def hrmsEmployeeDocReport(request):
         ''' 
         09-May-2018 TRU To HRMS Employee doc report Search data loaded.
         @param request: Request Object
         @type request : Object
         @return:   HttpResponse or Redirect the another URL
         @author: TRU
         '''
         post = request.GET
         id = post.get(config.id)  #get table key 
         cur = connection.cursor()  #create the database connection
         json_data = {}
         try:
             logger_obj.info('Report data function by'+str(request.user.username)) 
             condition = ''
             if int(id) != 0:
                 condition = "where doc.org_id_id=%s"%int(id)
                 condition = condition+" and"
             else:
                 logger_obj.info('Id is empty')    
             query =  q.fetch_hcms_query(config.attendance_management, config.hrms_employee_doc_report_list)
             querys = (query+str(condition)) 
             cur.execute(querys);
             values = cur.fetchall()
             if values:
                 json_data[config.datas] = values
             else:
                 json_data[config.datas] = []
             logger_obj.info('Report data response is'+str(json_data)+"attempted by"+str(request.user.username))    
         except Exception as e:
              logger_obj.error(e)
              json_data[config.datas] = []
         cur.close()
         return HttpResponse(json.dumps(json_data))
     
# Document Employee Report Search views here
def hrmsEmployeeDocReportSearch(request):
         ''' 
         09-May-2018 TRU To HRMS Employee doc report Search data loaded.
         @param request: Request Object
         @type request : Object
         @return:   HttpResponse Employee Search Data
         @author: TRU
         '''
         logger_obj.info('Employee Report search function by'+str(request.user.username))
         json_data = {}
         cur=connection.cursor()  #create the database connection
         post = request.GET
         fname = post.get(config.fname)  #get table key 
         lname = post.get(config.lname)  #get table key 
         gender = post.get(config.gender_id)  #get table key 
         role = post.get(config.role)  #get table key 
         org_id = post.get(config.org_id)  #get table key 
         org_unit_id = post.get(config.org_unit_id)  #get table key 
         emp_id = post.get(config.emp_id)  #get table key 
         org_division = post.get(config.org_div) #get table key 
         try:
                     query =  q.fetch_hcms_query(config.attendance_management, config.hrms_employee_doc_report_list)
                     conditions = "where doc.org_id_id = %s"%int(org_id) 
                     conditions = conditions+ " and"
                     if fname != '':
                         conditions = conditions+" doc.names ilike '"'%'+str(fname)+'%'"' and"
                     if lname != '':
                         conditions = conditions+" doc.names ilike '"'%'+str(lname)+'%'"' and"
                     if emp_id != '':
                         conditions = conditions+" doc.employee_id in ('"+str(emp_id)+"') and"
                     if role != '':
                         conditions = conditions+" doc.role_id=%s "%int(role)
                         conditions = conditions+" and"
                     if gender != '':
                         conditions = conditions+" doc.employee_gender_id=%s"%int(gender)
                         conditions = conditions+" and"
                     if org_unit_id != '':
                         conditions = conditions+" doc.org_unit_id_id=%s "%int(org_unit_id)
                         conditions = conditions+" and"
                     if org_division != '':
                         conditions = conditions+" doc.team_name_id = %s "%int(org_division)
                         conditions = conditions+" and"
                     conditions = conditions.rsplit(' ', 1)[0]
                     if cur and query and conditions:
                         querys = (query+str(conditions)) 
                         cur.execute(querys)  
                         values = cur.fetchall()
                         if values:
                            json_data[config.datas] = values
                         else:
                             json_data[config.datas] = []
                     else:
                         json_data[config.datas] = []
                     logger_obj.info('Employee Report search response is'+str(json_data)+"attempted by"+str(request.user.username))   
         except Exception as e:
              logger_obj.error(e)
              json_data[config.datas] = []
         cur.close()
         return HttpResponse(json.dumps(json_data))
     

# Report Data views here
def hrmsEmployeeLeaveReport(request):
         ''' 
         22-Feb-2018 TRU To HRMS report Employee Leave data page loaded.
         @param request: Request Object
         @type request : Object
         @return:   HttpResponse or Redirect the another URL
         @author: TRU
         '''
         post = request.GET
         id = post.get(config.id)  #get table key 
         cur = connection.cursor()  #create the database connection
         json_data = {}
         try:
             logger_obj.info('Report Leave data function by'+str(request.user.username)) 
             condition = ''
             if int(id) != 0:
                 condition = " ei.org_id_id=%s"%int(id)
                 condition = condition+" and"
             else:
                 logger_obj.info('Id is empty')    
             query =  q.fetch_hcms_query(config.attendance_management, config.hrms_employee_leave_report_list)
             cur.execute(query+condition+" ei.is_active and li.is_active and ri.is_active order by ei.name");
             values = cur.fetchall()
             if values:
                 json_data[config.datas] = values
             else:
                 json_data[config.datas] = []
             logger_obj.info('Report Leave data response is'+str(json_data)+"attempted by"+str(request.user.username))    
         except Exception as e:
              logger_obj.error(e)
              json_data[config.datas] = []
         cur.close()
         return HttpResponse(json.dumps(json_data))
     
# Employee Leave Report Search views here
def hrmsEmployeeLeaveReportSearch(request):
         ''' 
         22-Feb-2018 TRU To HRMS Employee Leave report Search data loaded.
         @param request: Request Object
         @type request : Object
         @return:   HttpResponse Employee Search Data
         @author: TRU
         '''
         logger_obj.info('Employee Leave Report search function by'+str(request.user.username))
         json_data = {}
         cur=connection.cursor()  #create the database connection
         post = request.GET
         fname = post.get(config.fname)  
         lname = post.get(config.lname)  
         org_id = post.get(config.org_id) 
         org_unit_id = post.get(config.org_unit_id)  #get table key 
         leave_id = post.get(config.leave_id)  
         froms = post.get(config.froms)  
         to = post.get(config.to)  
         org_division = post.get(config.org_div) #get table key 
         try:
                     query =  q.fetch_hcms_query(config.attendance_management, config.hrms_employee_leave_report_list)
                     conditions = " ei.is_active and li.is_active  and"
                     if org_unit_id != '':
                         conditions = conditions+" ei.org_unit_id_id=%s "%int(org_unit_id)
                         conditions = conditions+" and"
                     if org_division != '':
                         conditions = conditions+" ei.team_name_id = %s "%int(org_division)
                         conditions = conditions+" and"
                     if fname != '':
                         conditions = conditions+" ei.name ilike '"'%'+str(fname)+'%'"' and"
                     if lname != '':
                         conditions = conditions+" ei.last_name ilike '"'%'+str(lname)+'%'"' and"
                     if leave_id != '':
                         conditions = conditions+" li.type_id_id in ('"+str(leave_id)+"') and"
                     if froms != '':
                         conditions = conditions+" li.from_date >= ('"+str(froms)+"') and"
                     if to != '':
                         conditions = conditions+" li.to_date <= ('"+str(to)+"') and"
                     conditions = conditions.rsplit(' ', 1)[0]
                     conditions =   conditions+ " and ei.org_id_id = %s"%int(org_id) 
                     if cur and query and conditions:
                         querys = (query+str(conditions+" order by ei.name,li.from_date")) 
                         cur.execute(querys)  
                         values = cur.fetchall()
                         if values:
                            json_data[config.datas] = values
                         else:
                             json_data[config.datas] = []
                     else:
                         json_data[config.datas] = []
                     logger_obj.info('Employee Leave Report search response is'+str(json_data)+"attempted by"+str(request.user.username))   
         except Exception as e:
              logger_obj.error(e)
              json_data[config.datas] = []
         cur.close()
         return HttpResponse(json.dumps(json_data))


# Report attendance Data views here
def hrmsEmployeeAttendanceReport(request):
         ''' 
         22-Feb-2018 TRU To HRMS report Employee Leave data page loaded.
         @param request: Request Object
         @type request : Object
         @return:   HttpResponse or Redirect the another URL
         @author: TRU
         '''
         post = request.GET
         id = post.get(config.id)  #get table key 
         cur = connection.cursor()  #create the database connection
         json_data = {}
         try:
             logger_obj.info('Report attendance data function by'+str(request.user.username)) 
             condition = ''
             if int(id) != 0:
                 condition = " ei.org_id_id=%s"%int(id)
                 condition = condition+" and"
             else:
                 logger_obj.info('Id is empty')    
             query =  q.fetch_hcms_query(config.attendance_management, config.hrms_employee_attendance_report_list)
             cur.execute(query+condition+" ei.is_active and ati.is_active order by ei.name");
             values = cur.fetchall()
             if values:
                 json_data[config.datas] = values
             else:
                 json_data[config.datas] = []
             logger_obj.info('Report attendance data response is'+str(json_data)+"attempted by"+str(request.user.username))    
         except Exception as e:
              logger_obj.error(e)
              json_data[config.datas] = []
         cur.close()
         return HttpResponse(json.dumps(json_data))
     
# Employee attendance Report Search views here
def hrmsEmployeeAttendanceReportSearch(request):
         ''' 
         22-Feb-2018 TRU To HRMS Employee Leave report Search data loaded.
         @param request: Request Object
         @type request : Object
         @return:   HttpResponse Employee Search Data
         @author: TRU
         '''
         logger_obj.info('Employee attendance Report search function by'+str(request.user.username))
         json_data = {}
         cur=connection.cursor()  #create the database connection
         post = request.GET
         fname = post.get(config.fname)  
         lname = post.get(config.lname)  
         org_id = post.get(config.org_id) 
         org_unit_id = post.get(config.org_unit_id)  #get table key 
         leave_id = post.get(config.leave_id)  
         froms = post.get(config.froms)  
         to = post.get(config.to)  
         org_division = post.get(config.org_div) #get table key 
         try:
                     query =  q.fetch_hcms_query(config.attendance_management, config.hrms_employee_attendance_report_list)
                     conditions = " ei.is_active and ati.is_active and"
                     if org_unit_id != '':
                         conditions = conditions+" ei.org_unit_id_id=%s "%int(org_unit_id)
                         conditions = conditions+" and"
                     if org_division != '':
                         conditions = conditions+" ei.team_name_id = %s "%int(org_division)
                         conditions = conditions+" and"
                     if fname != '':
                         conditions = conditions+" ei.name ilike '"'%'+str(fname)+'%'"' and"
                     if lname != '':
                         conditions = conditions+" ei.last_name ilike '"'%'+str(lname)+'%'"' and"
                     if froms != '':
                         conditions = conditions+" ati.check_in >= ('"+str(froms)+"') and"
                     if to != '':
                         conditions = conditions+" ati.check_out <= ('"+str(to)+"') and"
                     conditions = conditions.rsplit(' ', 1)[0]
                     conditions =   conditions+ " and ei.org_id_id = %s"%int(org_id) 
                     if cur and query and conditions:
                         querys = (query+str(conditions+" order by ei.name,check_in")) 
                         cur.execute(querys)  
                         values = cur.fetchall()
                         if values:
                            json_data[config.datas] = values
                         else:
                             json_data[config.datas] = []
                     else:
                         json_data[config.datas] = []
                     logger_obj.info('Employee attendance Report search response is'+str(json_data)+"attempted by"+str(request.user.username))   
         except Exception as e:
              logger_obj.error(e)
              json_data[config.datas] = []
         cur.close()
         return HttpResponse(json.dumps(json_data))
