
# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.shortcuts import render

import json
from django.views.decorators.csrf import csrf_exempt
from django.http.response import HttpResponse
from CommonLib import query
from django.db import connection
import config
from HRMS_Foundation.attendance_management.models import LeaveBalanceInfo as LBI
from CommonLib import query as q,lib
from CommonLib.hcms_common import record_validation 

#template render html
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
import logging
import logging.handlers
from CommonLib.hcms_common import refitem_fetch
from CommonLib.hcms_common import menu_access_control
logger_obj = logging.getLogger('logit')

# import packages for Mobile API's
from HRMS_Foundation.attendance_management.leave import get_organization
import ast
# Leave Balance views here
class LeaveBalance(TemplateView):
    ''' 
         15-Feb-2018 TRU To Leave Balance page loaded. And also check the user authentication
         @param request: Request Object
         @type request : Object
         @return:   HttpResponse or Redirect the another URL
         @author: TRU
    '''

#     template_name = "hrms_foundation/attendance_management/leave_balance.html"

    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(LeaveBalance, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Leave Administration', self.request.user.id)
        if macl:
            template_name = "hrms_foundation/attendance_management/leave_balance.html"
        else:
            template_name = "tags/access_denied.html"
        return [template_name]
    
    def get(self, request, *args, **kwargs):
         context = super(LeaveBalance, self).get_context_data(**kwargs)
         cur = connection.cursor()  #create the database connection
         cur.execute(q.fetch_hcms_query(config.attendance_management, config.hrms_org_list));
         values = q.dictfetchall(cur)
         if values:
             org_data = values
         else:
             org_data = []
         cur.execute(q.fetch_hcms_query(config.attendance_management, config.leave_type));
         values = q.dictfetchall(cur)
         if values:
             leave_data = values
         else:
             leave_data = []
         cur.execute(q.fetch_hcms_query(config.attendance_management, config.hrms_employee_list));
         values = q.dictfetchall(cur)
         if values:
             emp_data = values
         else:
             emp_data = []
         gender_details = refitem_fetch('GENDR')
         years_details = refitem_fetch('YEARS')
         context['gender_info'] = gender_details
         context['employees'] = emp_data
         context['org'] = org_data
         context['leave_type'] = leave_data
         context['years_details'] = years_details
         return self.render_to_response(context)
     
# Leave Balance CRUD function here
@csrf_exempt
def leaveBalanceCRUDOpertion(request):
    ''' 
    08-Feb-2018 TRU To HRMS Attendance page loaded. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: TRU
    '''
    json_data = {}
    try:
            logger_obj.info('Leave balance CRUD operation function is by'+str(request.user.username))
            post = request.POST
            input_data = request.POST.get(config.input_data)   
            uid = request.user.id  
            if not uid:
                uid = 1
            input_data = json.loads(input_data)  
            if input_data and input_data[0]['delete_id'] == '0' :
                    if input_data[0]['update_id'] == '0':
                           for data in input_data[0]['emp_list']:
                               find_status = LBI.objects.filter(employee_id_id = int(data),leave_type_id_id = int(input_data[0]['leave_type']),year_id = int(input_data[0]['year_id']),is_active = "True").values();
                               if len(find_status) == 0:
                                   status = LBI(employee_id_id=int(data),leave_company_id_id=int(input_data[0]['c_id']),org_unit_id_id=int(input_data[0]['organization_unit_id']), leave_days=float(input_data[0]['credit_days']) , allocated_leave_days=float(input_data[0]['credit_days'])  , leave_type_id_id=int(input_data[0]['leave_type']),year_id=int(input_data[0]['year_id']),is_active="True",created_by_id=int(uid))
                                   status.save()
                               else:
                                   status = LBI.objects.filter(employee_id_id = int(data),leave_type_id_id = int(input_data[0]['leave_type']),year_id = int(input_data[0]['year_id']),is_active='True').update(employee_id_id=int(data),leave_company_id_id=int(input_data[0]['c_id']),org_unit_id_id=int(input_data[0]['organization_unit_id']), leave_days=float(float(find_status[0]['leave_days'])+float(input_data[0]['credit_days'])),allocated_leave_days=float(input_data[0]['credit_days']) ,year_id=int(input_data[0]['year_id']) , leave_type_id_id=int(input_data[0]['leave_type']),is_active="True",modified_by_id=int(uid))
                           json_data[config.results] = config.add_success
                    else:
                           for data in input_data[0]['emp_list']:
                               status = LBI.objects.filter(id=int(input_data[0]['update_id'])).update(employee_id_id=int(data),leave_company_id_id=int(input_data[0]['c_id']),org_unit_id_id=int(input_data[0]['organization_unit_id']), leave_days=float(input_data[0]['credit_days']),allocated_leave_days=float(input_data[0]['credit_days']),year_id=int(input_data[0]['year_id']) , leave_type_id_id=int(input_data[0]['leave_type']),is_active="True",modified_by_id=int(uid))
                               json_data[config.results] = config.update_success
            else:
                    referred_record = record_validation('leave_balance_info', int(input_data[0]['delete_id']))
                    logger_obj.info( "==================Leave Balance Delete Status ====>"+str(referred_record) )
                    if referred_record:
                        status =  LBI.objects.filter(id=int(input_data[0]['delete_id'])).update(is_active="False",modified_by_id=int(uid))
                        json_data[config.results] = config.delete_success   
                    else:
                        json_data[config.results] = 'ERR0028'  
            logger_obj.info('Leave balance CRUD function response is'+str(json_data)+"attempted by"+str(request.user.username))                   
    except Exception as e:
            logger_obj.error(e)
            json_data[config.results] = config.error       
    return HttpResponse(json.dumps(json_data))

# Leave Balance Data views here
def leaveBalanceData(request):
         ''' 
         15-Feb-2018 TRU To HRMS Leave balance data loaded. 
         @param request: Request Object
         @type request : Object
         @return:   HttpResponse or Redirect the another URL
         @author: TRU
         '''
         post = request.GET
         leave_id = post.get(config.id)  #get table key 
         cur = connection.cursor()  #create the database connection
         json_data = {}
         try:
             logger_obj.info('Leave balance data function is by'+str(request.user.username))
             query =  q.fetch_hcms_query(config.attendance_management, config.hrms_leave_balalance_list)
             if not leave_id and query:
                 cur.execute(query);
                 values = cur.fetchall()
                 if values:
                     json_data[config.datas] = values
                 else:
                     json_data[config.datas] = []
                 cur.execute(q.fetch_hcms_query(config.attendance_management, config.leave_type));
                 leave_type = q.dictfetchall(cur)
                 json_data[config.leave_type] = leave_type
                 
             else:
                 query =  q.fetch_hcms_query(config.attendance_management, config.hrms_leave_event_balalance_list)
                 cur.execute(query,(int(leave_id),));
                 values = q.dictfetchall(cur)
                 if values:
                     json_data[config.datas] = values
                 else:
                     json_data[config.datas] = []
         except Exception as e:
              logger_obj.error(e)  
              json_data[config.datas] = []
         cur.close()
         return HttpResponse(json.dumps(json_data))
# Leave Balance Employee Data views here
def hrmsEmployeeData(request):
         ''' 
         13-June-2018 TRU To HRMS Leave balance employee based on company data loaded. 
         @param request: Request Object
         @type request : Object
         @return:   HttpResponse or Redirect the another URL
         @author: TRU
         '''
         post = request.GET
         id = post.get(config.id)  #get table key 
         ouid = post.get(config.ouid)  #get table key 
         gender=post.get(config.gender_id)  #get gender id
         div_list = post.get(config.div_list)  
         cur = connection.cursor()  #create the database connection
         json_data = {}
         try:
             logger_obj.info('hrms employee data function is by'+str(request.user.username))
             if div_list is None :
                 if id and gender and ouid != '':
                     query =  q.fetch_hcms_query(config.attendance_management, config.leave_employee_list_org)
                     cur.execute(query,(int(id),int(gender),int(ouid)))
                     values = q.dictfetchall(cur)
                     if values:
                         json_data[config.datas] = values
                     else:
                         json_data[config.datas] = []
                 else:
                      query =  q.fetch_hcms_query(config.attendance_management, config.leave_employee_list_org_unit)
                      cur.execute(query+' order by name',(int(id),int(ouid)))
                      values = q.dictfetchall(cur)
                      if values:
                         json_data[config.datas] = values
                      else:
                         json_data[config.datas] = []   
             else:
                div_ids = json.loads(div_list)  
                query =  q.fetch_hcms_query(config.attendance_management, config.leave_employee_list_org_unit)
                cur.execute(query+' and team_name_id in %s  order by name',(int(id),int(ouid),tuple(div_ids),))
                values = q.dictfetchall(cur)
                json_data[config.datas] = values            
         except Exception as e:
              logger_obj.error(e)  
              json_data[config.datas] = []
         cur.close()
         
         return HttpResponse(json.dumps(json_data))
def get_refitems(coulmn,refid,where_cond):
    
    try: 
        cur = connection.cursor()
        ref_query="select {}  from reference_items where {}= '%s'"
        ref_query=ref_query.format(coulmn,where_cond) 
        cur.execute(ref_query%(refid,))
        state_name=lib.dictfetchall(cur)
         
        if state_name:
            state=state_name[0][coulmn]
        return state  
    except Exception as e:
           return 0   
           logger_obj.error(e)  

@csrf_exempt
def leave_bal_mobile(request):
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
            uid = data["user_id"]
            org_values=get_organization(uid)
            if org_values:
                emp_id=org_values.get('emp_id')
            else:
                emp_id=0
            print 'empppppppppppppppppppp', emp_id
            cur = connection.cursor()
            cur.execute(""" select a.id as leave_id, a.refitems_name as leave_type, coalesce(leave_days,'0')as leave_balance from
                                (select id, refitems_name from reference_items where refitems_category_id = (select id 
                                from reference_item_category where refitem_category_code = 'LEVTY'))a left join
                                (select leave_days, leave_type_id_id from leave_balance_info where employee_id_id=%s and is_active)b on 
                                b.leave_type_id_id = a.id """,(emp_id,))
            values=q.dictfetchall(cur)
            print values
            if values:
                return HttpResponse(json.dumps({'status':'Success','message':'Available Leave Balance', 'data':values}))
            else:
                return HttpResponse(json.dumps({'status':'Failure','message':'No Leave Balance for this leave type'}))
        else:
            return HttpResponse(json.dumps({'status':'Failure','message':'Failed to Get Leave Balance'}))
    except Exception as e:
        return HttpResponse(json.dumps({'status':'Failure','Error Message':e}))
