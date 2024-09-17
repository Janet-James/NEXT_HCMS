# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.shortcuts import render

import json
from datetime import date,timedelta
import datetime
import calendar
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.http.response import HttpResponse
from CommonLib import query
from django.db import connection
from CommonLib import query as q
from HRMS_Foundation.payroll_management.models import PaymentAdvices
from django_countries import countries
import config
from CommonLib.hcms_common import refitem_fetch
from CommonLib.hcms_common import menu_access_control
import HCMS.settings as setting
#template render html
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from CommonLib.hcms_common import record_validation 
import logging
import logging.handlers
logger_obj = logging.getLogger('logit')


class HRMSEmployeePayrollReport(TemplateView):
    ''' 
        17-May-2018 VIJ To HR Payroll payment advice page loaded. And also check the user authentication
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
        @author: VIJ
    '''
    
    #template_name = "hrms_foundation/payroll_management/payment_advices.html"  
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HRMSEmployeePayrollReport, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Payroll Report', self.request.user.id)
        if macl:
            template_name = "hrms_foundation/payroll_management/employee_payroll_report.html"  
        else:
            template_name = "tags/access_denied.html"
        return [template_name]
    
    def get(self, request, *args, **kwargs):
        context = super(HRMSEmployeePayrollReport, self).get_context_data(**kwargs)
        cur = connection.cursor() 
        res = refitem_fetch('JBOST')
        context['status_info'] = res
        user_id = kwargs.get('user_id',None)
        if user_id:
            context['user_id'] = user_id
        else:
            context['user_id'] = []   
            
        cur.execute("""select role_id from auth_user where id = %s and is_active """,(user_id,))  
        role_id = q.dictfetchall(cur)
        if role_id:
            context['role_id'] = role_id[0]['role_id']
        else:
            context['role_id'] = []    
            
        cur.execute("""select refitems_code from payroll_monthly_report pmrt
        inner join reference_items rftm on rftm.id = pmrt.employee_status_id
        where pmrt.employee_id = %s """,(user_id,))  
        report_status = q.dictfetchall(cur)  
        if report_status:
            context['report_status'] = report_status[0]['refitems_code']
        else:
            context['report_status'] = []   
        
        print"============================",user_id,context
        return self.render_to_response(context)
    
#Employee Payroll Table data get function here
@csrf_exempt
def EmployeePayrollTblDispaly(request):
    ''' 
    6-July-2018 VJY To HRMS Org unit structure data loaded
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: TRU
    '''
    
    json_data = {}
    #try:
    logger_obj.info('Employee Payroll Report Table data function by'+str(request.user.username))
    cur = connection.cursor()  #create the database connection
    id = request.POST.get('user_id') 
    now = datetime.datetime.now()
    total_days = calendar.monthrange(now.year, now.month-1)[1]
    #num_days = calendar.monthrange(now.year, now.month-1)
    first_day = datetime.date(now.year, now.month-1, 1)
    last_day = datetime.date(now.year, now.month-1, total_days)
    #week_days = len([2 for i in calendar.monthcalendar(now.year,now.month) if i[5] != 0])
    daygenerator = (first_day + timedelta(x + 1) for x in xrange((last_day - first_day).days))
    week_days = sum(1 for day in daygenerator if day.weekday() < 5)
    lop_count = 0
    total_lop_count = 0
    total_data_list = []
    total_data_dict = {}
    if id:
        cur.execute("""select hrpdts.id, emp.id as emp_id,hrpdts.username,to_char(((hrpdts.summary_hours)::decimal|| ' hour')::interval,'HH24:MI:SS') as summary_hr,
            hrpdts.summary_hours,hrpdts.hr_hours,hrpdts.meeting_hours,to_char(hrpdts.check_in,'DD-MM-YYYY') as check_in,hrpdts.check_in_time,
            case when not hrpdts.meeting_hours = '' then to_char(((hrpdts.summary_hours)::decimal|| ' hour')::interval + hrpdts.meeting_hours::interval,'HH24:MI:SS')
            else  to_char(((hrpdts.summary_hours)::decimal|| ' hour')::interval,'HH24:MI:SS') end as project_hrs,
            (
            select ri.refitems_code from leave_info li 
            inner join reference_items ri on ri.id = li.type_id_id
            where li.from_date::date >= hrpdts.check_in and li.from_date::date <= hrpdts.check_in and leave_employee_id_id = emp.id
            ) as leave_status,
            
            (
            select ri.refitems_name from leave_info li 
            inner join reference_items ri on ri.id = li.type_id_id
            where li.from_date::date >= hrpdts.check_in and li.from_date::date <= hrpdts.check_in and leave_employee_id_id = emp.id
            ) as leave_name
            from hr_project_details hrpdts
            inner join employee_info emp on emp.related_user_id_id = hrpdts.user_id
            where hrpdts.user_id = %s  and 
            hrpdts.check_in >= %s and hrpdts.check_in <= %s order by check_in
           """,(id,first_day,last_day,));
        hr_values = q.dictfetchall(cur)
        if hr_values:
                json_data['hr_data'] = hr_values
        else:
                json_data['hr_data'] = []
                
        if hr_values:
            permission_count = 0
            late_count = 0
            tot_meet_hrs = datetime.datetime.strptime('00:00:00', '%H:%M:%S')
            tot_hrs = 0
            for i in hr_values:
                if str(i['emp_id']) not in ('41','149'):
                    if i['check_in_time'] < '08:31:00':
                        t1 = '00:00:00';
                        if float(i['summary_hours']) >= float('24.0'):
                            work_summary_hr = '8.0'
                        else:
                            work_summary_hr = i['summary_hours']
                        if work_summary_hr:
                            summary_hrs = str(datetime.timedelta(hours=float(work_summary_hr)))
                            
                            summary_hours_time = str((summary_hrs).split('.')[0])
                            tot_sum_hrs = datetime.datetime.strptime(str(summary_hours_time), '%H:%M:%S')
                        time_zero = datetime.datetime.strptime('00:00:00', '%H:%M:%S')
                        if i['meeting_hours']:
                            tot_meet_hrs = datetime.datetime.strptime(str(i['meeting_hours']), '%H:%M:%S')
                        tot_project_hrs = str((tot_sum_hrs - time_zero + tot_meet_hrs).time());
                        if tot_project_hrs < '08:00:00':
                            if permission_count < 2 and i['leave_status'] == 'PEMSN':
                                permission_count += 1
                            elif i['leave_status'] in ('SICKL','CASHL','MTNTL','PTNTL','CMPOF','LEABS'):
                                pass     
                            else:
                                lop_count += 1 
                    else:
                        if permission_count < 2 and i['leave_status'] == 'PEMSN':
                            permission_count += 1
                            pass
                        elif i['leave_status'] in ('SICKL','CASHL','MTNTL','PTNTL','CMPOF','LEABS'):
                            pass
                        else:
                            if late_count < 2 :
                                late_count += 1
                                pass
                            else:
                               lop_count += 1 
                else:
                    lop_count = 0  
                json_data['hr_lop_count'] = lop_count        
                     
        cur.execute("""select emp.id as emp_id,COALESCE(concat(upper(emp.name), ' ',upper(emp.last_name)),'') as employee_name,
            COALESCE(team.name,'') as team_name,COALESCE(attch.name,'no_data.png') as image_name,role.role_title
            from employee_info emp 
            inner join team_details_info team on team.id = emp.team_name_id
            left join attachment_info attch on attch.id = emp.image_id_id
             left join hcms_ti_role_details role on role.id = emp.role_id_id
            where emp.related_user_id_id = %s""",(id,));
        employee_data = q.dictfetchall(cur)
        if employee_data:
                json_data['emp_data'] = employee_data
        else:
                json_data['emp_data'] = [] 
                
        cur.execute("""select lvinfo.id,to_char(lvinfo.from_date,'DD-MM-YYYY') as from_date,to_char(lvinfo.to_date,'DD-MM-YYYY') as to_date,
                reftems.refitems_name,reftems.refitems_code
                 from leave_info lvinfo 
                inner join employee_info emp on emp.id = lvinfo.leave_employee_id_id and emp.is_active
                inner join reference_items reftems on reftems.id = lvinfo.type_id_id and reftems.is_active
                where emp.related_user_id_id = %s and from_date >= %s and to_date <= %s order by lvinfo.from_date """,(id,first_day,last_day,));
        leave_data = q.dictfetchall(cur)
        if leave_data:
                json_data['leave_data'] = leave_data
        else:
                json_data['leave_data'] = []
                
        cur.execute("""
                    select COALESCE(sum(leave.number_of_days),0) as lop_days from leave_info leave
                    inner join reference_items ref_items on ref_items.id=leave.type_id_id  
                    inner join  employee_info emp on  emp.id = leave.leave_employee_id_id
                    where from_date >= %s and to_date <= %s and emp.related_user_id_id = %s 
                    and leave.state_id=119  
                  and ref_items.refitems_name='Leave of Absence'""",(first_day,last_day,id,));
        lop_data = q.dictfetchall(cur)
        if lop_data:
                json_data['lop_data'] = lop_data[0]['lop_days']
        else:
                json_data['lop_data'] = []  
                
        total_lop_count = lop_data[0]['lop_days'] + lop_count
            
        json_data['total_lop_count'] = total_lop_count 
        json_data['working_days'] = total_days        
        total_data_list.append(json_data)
        total_data_dict['employee_total_data'] = total_data_list    
                
        logger_obj.info('Employee Payroll Report Table data response is'+str(json_data)+"attempted by"+str(request.user.username))     
        
        
#     except Exception as e:
#         
#             logger_obj.error(e)
#             json_data[config.datas] = [] 
    return HttpResponse(json.dumps(total_data_dict))     

def CreatePayrollReport(request):
    CreatePayrollReport_status = {}
    uid=request.user.id
    created_date = format(datetime.datetime.now())  # set current date time in created date field
    modified_date = format(datetime.datetime.now())  # set current date time in modified date field
    if not uid:
        uid = 1
    try:
        report_data = json.loads(request.POST.get('report_data'))
        now = datetime.datetime.now()
        total_days = calendar.monthrange(now.year, now.month-1)[1]
        #num_days = calendar.monthrange(now.year, now.month-1)
        first_day = datetime.date(now.year, now.month-1, 1)
        cur = connection.cursor()  #create the database connection
        
        cur.execute(""" select refitems_code from payroll_monthly_report pmrt
        left join reference_items rftm on rftm.id = pmrt.employee_status_id
        where pmrt.employee_id = %s and date >= %s""",(report_data['user_id'],first_day))
        approved_result = q.dictfetchall(cur)
        if approved_result:
            if approved_result[0]['refitems_code'] == 'APROW':
                CreatePayrollReport_status['status'] = 'NTE-003'
            else:
                cur.execute(""" select count(*)  as record_count from payroll_monthly_report where employee_id = %s and date::date = %s""",(report_data['user_id'],first_day))
                count_result = q.dictfetchall(cur)
                if not count_result[0]['record_count']:
                    cur.execute("""insert into payroll_monthly_report (employee_id,date,employee_reason,employee_status_id,is_active,created_by_id,created_date) values(%s,%s,%s,%s,True,%s,%s)""",
                            (report_data['user_id'],first_day,report_data['reject_reason'],report_data['status_id'],uid,created_date,))
                else:
                    cur.execute("""update payroll_monthly_report set employee_reason= %s,employee_status_id =%s,modified_by_id = %s,modified_date = %s where employee_id = %s""",
                            (report_data['reject_reason'],report_data['status_id'],uid,modified_date,report_data['user_id'],)) 
                CreatePayrollReport_status['status'] = 'NTE-001'       
        else:
            cur.execute(""" select count(*)  as record_count from payroll_monthly_report where employee_id = %s and date::date = %s""",(report_data['user_id'],first_day))
            count_result = q.dictfetchall(cur)
            if not count_result[0]['record_count']:
                cur.execute("""insert into payroll_monthly_report (employee_id,date,employee_reason,employee_status_id,is_active,created_by_id,created_date) values(%s,%s,%s,%s,True,%s,%s)""",
                        (report_data['user_id'],first_day,report_data['reject_reason'],report_data['status_id'],uid,created_date,))
            else:
                cur.execute("""update payroll_monthly_report set employee_reason= %s,employee_status_id =%s,modified_by_id = %s,modified_date = %s where employee_id = %s""",
                        (report_data['reject_reason'],report_data['status_id'],uid,modified_date,report_data['user_id'],))
            
            
        #mail table insert
            CreatePayrollReport_status['status'] = 'NTE-001'
    except Exception as e:
        print e
        CreatePayrollReport_status['status'] = 'NTE-002'
    finally:
        return HttpResponse(json.dumps(CreatePayrollReport_status))
    
    
#def AllEmployeePayrollApprovedTblDispaly(request) :   