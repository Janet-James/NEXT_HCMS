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
from CommonLib.hcms_common import record_validation 
from HRMS_Foundation.employee_management.models import EmployeeInfo as EI
#template render html
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
import logging
import logging.handlers
from CommonLib.hcms_common import refitem_fetch
from CommonLib.hcms_common import menu_access_control

logger_obj = logging.getLogger('logit')

# hrmsAttendance views here
class HrmsAttendance(TemplateView):
    ''' 
         08-Feb-2018 TRU To HRMS Attendance page loaded. And also check the user authentication
         @param request: Request Object
         @type request : Object
         @return:   HttpResponse or Redirect the another URL
         @author: TRU
    '''
#     template_name = "hrms_foundation/attendance_management/attendance.html"    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HrmsAttendance, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Manual Attendance', self.request.user.id)
        if macl:
            template_name = "hrms_foundation/attendance_management/attendance.html"
        else:
            template_name = "tags/access_denied.html"
        return [template_name]
    
    def get(self, request, *args, **kwargs):
         context = super(HrmsAttendance, self).get_context_data(**kwargs)
         cur = connection.cursor()  #create the database connection
         cur.execute(q.fetch_hcms_query(config.attendance_management, config.hrms_org_list));
         values = q.dictfetchall(cur)
         if values:
             org_data = values
         else:
             org_data = []
         context['org'] = org_data
         res = refitem_fetch('GENDR')
         context['gender_info'] = res
         cur.execute("""select id,name as name from hcms_role where is_active""")
         role = q.dictfetchall(cur)
         context['role'] = role
         return self.render_to_response(context)
     
# Attendance CRUD function here
@csrf_exempt
def HRMSCRUDOpertion(request):
    ''' 
    08-Feb-2018 TRU To HRMS Attendance page loaded. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: TRU
    '''
    try:
            logger_obj.info('Attendance CRUD function by'+str(request.user.username))
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
                    input_data = input_data['input_data']
                    if not update_id:
                           print "---------------Insert---------------",input_data[0]['employee']
                           for data in input_data[0]['employee']:
                               #div_id = input_data[0]['organization_division_id']
                               attendance_type="WEB"
                               if data:
                                   div_id_status = EI.objects.filter(id=int(data)).values('team_name_id','org_id_id','org_unit_id_id');
                                   div_id = div_id_status[0]['team_name_id']
				   org_id = div_id_status[0]['org_id_id']
				   org_unit_id = div_id_status[0]['org_unit_id_id']
                               status = AI(employee_id_id=int(data),org_id_id=int(org_id),org_unit_id_id=int(org_unit_id),org_team_id_id=int(div_id),check_out=input_data[0]['check_out'] , check_in=input_data[0]['check_in'],is_active="True",created_by_id=int(uid),attendance_type=str(attendance_type))
                               status.save() 
                           json_data[config.results] = config.add_success
                    else:
                           print "---------------Update---------------",update_id
                           for data in input_data[0]['employee']:
                               #div_id = update_id 
                               if data:
                                   div_id_status = EI.objects.filter(id=int(data)).values('team_name_id','org_id_id','org_unit_id_id');
                                   div_id = div_id_status[0]['team_name_id']
				   org_id = div_id_status[0]['org_id_id']
				   org_unit_id = div_id_status[0]['org_unit_id_id']
                               status = AI.objects.filter(id=update_id).update(employee_id_id=int(data),org_id_id=int(org_id),org_unit_id_id=int(org_unit_id),org_team_id_id=int(div_id), check_out=input_data[0]['check_out'] , check_in=input_data[0]['check_in'],is_active="True",modified_by_id=int(uid))
                           json_data[config.results] = config.update_success
            else:
                    print "---------------Delete---------------",delete_id
                    referred_record = record_validation('attendance_info', int(delete_id))
                    logger_obj.info( "==================Attendance List Delete Status ====>"+str(referred_record) )
                    if referred_record:
                        status =  AI.objects.filter(id=delete_id).update(is_active="False",modified_by_id=int(uid))
                        json_data[config.results] = config.delete_success   
                    else:
                        json_data[config.results] = 'ERR0028'  
            logger_obj.info('Attendance CRUD response is'+str(json_data)+"attempted by"+str(request.user.username))         
    except Exception as e:
            logger_obj.error(e)
            json_data[config.results] = config.error       
    return HttpResponse(json.dumps(json_data))

# Employee drop down fpr Search views here
def hrmsAttendanceEmployeeSearchList(request):
         ''' 
         14-Mar-2018 TRU To HRMS Attendance Employee Search drop down list data loaded.
         @param request: Request Object
         @type request : Object
         @return:   HttpResponse Employee Search Data
         @author: TRU
         '''
         logger_obj.info('Attendance Employee search function by'+str(request.user.username))
         json_data = {}
         cur=connection.cursor()  #create the database connection
         try:
                 if cur:
                     res = refitem_fetch('GENDR')
                     json_data['gender'] = res
                     cur = connection.cursor()  #create the database connection
                     cur.execute(q.fetch_hcms_query(config.attendance_management, config.hrms_org_list));
                     org_data = q.dictfetchall(cur)
                     json_data['org'] = org_data
                     cur.execute("""select id,initcap(name) as refitems_name from hcms_role where is_active""")
                     role = q.dictfetchall(cur)
                     json_data['role'] = role
                 else:
                     json_data['role'] = []
                     json_data['gender'] = []
                     json_data['org'] = []
                     logger_obj.info('Attendance  Employee search response is'+str(json_data)+"attempted by"+str(request.user.username))   
         except Exception as e:
              logger_obj.error(e)
              json_data['role'] = []
              json_data['gender'] = []
              json_data['org'] = []
         cur.close()
         return HttpResponse(json.dumps(json_data))

# Attendance Search views here
def hrmsAttendanceEmployeeSearch(request):
         ''' 
         08-Feb-2018 TRU To HRMS Attendance Employee Search data loaded.
         @param request: Request Object
         @type request : Object
         @return:   HttpResponse Employee Search Data
         @author: TRU
         '''
         logger_obj.info('Attendance search function by'+str(request.user.username))
         json_data = {}
         cur=connection.cursor()  #create the database connection
         post = request.GET
         fname = post.get(config.f_name)  #get table key 
         lname = post.get(config.l_name)  #get table key 
         gender = post.get(config.g_name)  #get table key 
         id_no = post.get(config.id_no)  #get table key 
         org_id = post.get(config.org_ids)  #get table key 
         orgz_unit_id = post.get(config.orgz_unit_id)  #get table key 
         tbl_status = post.get(config.tbl_status)  #get table key 
         conditions = " where ci.is_active and  ei.is_active and rd.is_active and"
         try:
                     if tbl_status == 'NTE-MUL':
                         query =  q.fetch_hcms_query(config.attendance_management, config.hrms_employee_search_list_multi)
                         if org_id != '' and org_id != None:
                             conditions = conditions+" ei.org_id_id = %s"%int(org_id)
                             conditions = conditions+" and"
                         if orgz_unit_id != '' and orgz_unit_id != None:
                             conditions = conditions+" ei.org_unit_id_id = %s"%int(orgz_unit_id)
                             conditions = conditions+" and"
                         if fname != '' and fname != None:
                             conditions = conditions+" ei.name ilike '"'%'+str(fname)+'%'"' and"
                         if lname != '' and lname != None:
                             conditions = conditions+" ei.last_name ilike '"'%'+str(lname)+'%'"' and"
                         if id_no != '' and id_no != None:
                             conditions = conditions+" ei.role_id_id = %s"%int(id_no)
                             conditions = conditions+" and"
                         if gender != '' and gender != None:
                             conditions = conditions+" ei.employee_gender_id = %s"%int(gender)
                             conditions = conditions+" and"
                         conditions = conditions.rsplit(' ', 1)[0]
                     else:
                         query =  q.fetch_hcms_query(config.attendance_management, config.hrms_employee_search_list_single)
                         if org_id != '' and org_id != None:
                             conditions = conditions+" ei.org_id_id = %s"%int(org_id)
                             conditions = conditions+" and"
                         if orgz_unit_id != '' and orgz_unit_id != None:
                             conditions = conditions+" ei.org_unit_id_id = %s"%int(orgz_unit_id)
                             conditions = conditions+" and"
                         if fname != '' and fname != None:
                             conditions = conditions+" ei.name ilike '"'%'+str(fname)+'%'"' and"
                         if lname != '' and lname != None:
                             conditions = conditions+" ei.last_name ilike '"'%'+str(lname)+'%'"' and"
                         if id_no != '' and id_no != None:
                             conditions = conditions+" ei.role_id_id = %s"%int(id_no)
                             conditions = conditions+" and"
                         if gender != '' and gender != None:
                             conditions = conditions+" ei.employee_gender_id = %s"%int(gender)
                             conditions = conditions+" and"
                         conditions = conditions.rsplit(' ', 1)[0]
                     if cur and query and conditions:
                         querys = (query+str(conditions+" order by ei.name")) 
                         print"-----------------",querys
                         logger_obj.info('Attendance search response is'+str(tbl_status)+"attempted by"+str(request.user.username))   
                         cur.execute(querys)  
                         values = cur.fetchall()
                         if values:
                            json_data[config.datas] = values
                         else:
                             json_data[config.datas] = []
                     else:
                         json_data[config.datas] = []
                     logger_obj.info('Attendance search response is'+str(json_data)+"attempted by"+str(request.user.username))   
         except Exception as e:
              print e
              logger_obj.error(e)
              json_data[config.datas] = []
         cur.close()
         print "json.dumps(json_data=======>",json.dumps(json_data)
         return HttpResponse(json.dumps(json_data))

# Attendance Data views here
def hrmsAttendanceData(request):
         ''' 
         08-Feb-2018 TRU To HRMS Attendance Employee data page loaded. And also check the user authentication
         @param request: Request Object
         @type request : Object
         @return:   HttpResponse or Redirect the another URL
         @author: TRU
         '''
         post = request.POST
         att_id = post.get(config.id)  #get table key 
         cur = connection.cursor()  #create the database connection
         json_data = {}
         try:
             logger_obj.info('Attendance data function by'+str(request.user.username)) 
             query =  q.fetch_hcms_query(config.attendance_management, config.hrms_attendance_list)
             if not att_id and query:
                 query = query+" order by ai.id desc " 
                 cur.execute(query);
                 values = cur.fetchall()
                 if values: 
                     json_data[config.datas] = values
                 else: 
                     json_data[config.datas] = [] 
             else:
                 query =  q.fetch_hcms_query(config.attendance_management, config.hrms_event_attendance_list)
                 cur.execute(query,(int(att_id),));
                 values = q.dictfetchall(cur)
                 if values:
                     json_data[config.datas] = values
                 else:
                     json_data[config.datas] = []
                 logger_obj.info('Attendance data response is'+str(json_data)+"attempted by"+str(request.user.username))    
         except Exception as e:
              print e  
              logger_obj.error(e)  
              json_data[config.datas] = []
         cur.close()
         return HttpResponse(json.dumps(json_data))

#Employee filter 
def hrmsEmployeeFilterList(request):
    ''' 
    11-Oct-2018 TRU To HRMS Employee Search data loaded.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse Employee Search Data
    @author: TRU
    '''
    logger_obj.info('Employee search function by'+str(request.user.username))
    json_data = {}
    cur=connection.cursor()  #create the database connection
    post = request.GET
    status = post.get('status')  #get table key 
    query = "select id,coalesce(name||' '||last_name) as name from employee_info where is_active and"
    try:
        if status == 'org':
            org_id = post.get('org_id')  #get table key 
            query = query+" org_id_id = %s"%int(org_id)
        elif status == 'org_unit':
            org_id = post.get('org_id')  #get table key 
            org_unit_id = post.get('org_unit_id')  #get table key 
            query = query+" org_id_id = %s"%int(org_id)
            query = query+" and org_unit_id_id = %s"%int(org_unit_id)
        elif status == 'org_div':
            org_id = post.get('org_id')  #get table key 
            org_unit_id = post.get('org_unit_id')  #get table key 
            div_id = post.get('org_div_id')  #get table key 
            query = query+" org_id_id = %s"%int(org_id)
            query = query+" and org_unit_id_id = %s"%int(org_unit_id)
            query = query+" and team_name_id = %s"%int(div_id)
        print "-----------query----------",query
        cur.execute(query);
        values = q.dictfetchall(cur)
        json_data[config.datas] = values
    except Exception as e:
        print e
        logger_obj.error(e)
        json_data[config.datas] = []
        cur.close()
    return HttpResponse(json.dumps(json_data))