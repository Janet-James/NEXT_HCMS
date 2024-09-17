from __future__ import unicode_literals
from django.shortcuts import render
import datetime
from datetime import timedelta
import math
import json
#import datetime
import calendar
import glob
import os
import base64
import pdfkit
import inflect
import shutil
import dateutil.relativedelta
from dateutil.rrule import rrule, MONTHLY
from time import strptime
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.http.response import HttpResponse
from CommonLib import query
from django.db import connection
from CommonLib import query as q
from HRMS_Foundation.payroll_management.models import Payslip
from django_countries import countries
import config
from CommonLib.hcms_common import refitem_fetch
from CommonLib.hcms_common import menu_access_control
import HCMS.settings as setting
from dateutil import tz
from email.MIMEMultipart import MIMEMultipart
from email.MIMEText import MIMEText
import smtplib
from email.mime.base import MIMEBase
from email import encoders
from email.header import Header
from email.utils import formataddr
import urllib2
from email.header import Header
from email.utils import formataddr
from email.mime.application import MIMEApplication
from email.mime.multipart import MIMEMultipart
#template render html
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from CommonLib.hcms_common import record_validation 
from ekm.client import ekm_process
import logging
import logging.handlers
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
logger_obj = logging.getLogger('logit')
from django.template import loader
p = inflect.engine()
import PyPDF2

#import matplotlib
#matplotlib.use('Agg')
#import matplotlib.pyplot as plt
#import pandas as pd
#import numpy as np
import dateutil.relativedelta
 


class HRMSPayslip(TemplateView):
    ''' 
        17-May-2018 VIJ To HR Payroll Payslip page loaded. And also check the user authentication
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
        @author: VIJ
    '''
    
    #template_name = "hrms_foundation/payroll_management/payslip.html"  
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HRMSPayslip, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Organization', self.request.user.id)
        if macl:
            template_name = "hrms_foundation/payroll_management/payslip.html"  
        else:
            template_name = "tags/access_denied.html"
        return [template_name]
    
    def get(self, request, *args, **kwargs):
        context = super(HRMSPayslip, self).get_context_data(**kwargs)
        cur = connection.cursor()
        cur.execute(q.fetch_hcms_query(config.payroll_management, config.hrms_select_employee_info_payslip));
        employee_data = q.dictfetchall(cur)  
        if employee_data:
            employee_data = employee_data
        else:
            employee_data = []  
        context[config.employee_info] = employee_data #Loading Employee Data
        
        return self.render_to_response(context)

# class HRMSMyPayslip(TemplateView):
#     ''' 
#         01-Nov-2018 VIJ To HR My Payslip page loaded. And also check the user authentication
#         @param request: Request Object
#         @type request : Object
#         @return:   HttpResponse or Redirect the another URL
#         @author: TRU
#     '''
#     @method_decorator(login_required)
#     def dispatch(self, request, *args, **kwargs):
#         return super(HRMSMyPayslip, self).dispatch(request, *args, **kwargs)
#     
#     def get_template_names(self):
#         macl = menu_access_control('My Payslip', self.request.user.id)
#         if macl:
#             template_name = "hrms_foundation/payroll_management/my_payslip.html"  
#         else:
#             template_name = "tags/access_denied.html"
#         return [template_name]
#     
#     def get(self, request, *args, **kwargs):
#         context = super(HRMSMyPayslip, self).get_context_data(**kwargs)
#         return self.render_to_response(context)
    
# Hr Payslip Worked Days Data    
@csrf_exempt
def PayslipWorkedDays(request):
    ''' 
        17-May-2018 VIJ To HR Payroll Payslip page loaded. And also check the user authentication
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
        @author: VIJ
    '''
    result = {}
    #try:  # Try Block
    print"0000000000000000000000000000000yyyyyyyyyyyyyyyyyyyyyyyyyyy000000000000000000"
    cur = connection.cursor()
    post = request.POST
    period_from_val = post.get(config.period_from)  # Get the Table Id
    period_to_val = post.get(config.period_to)
    employee_id = post.get(config.employee_id)
    lop_count = 0
    if period_from_val:
        split_mon = period_from_val.split('-')[0]
    if period_to_val:
        split_year = int(period_from_val.split('-')[1] )
    if split_mon:
        pay_month = int(strptime(split_mon,'%b').tm_mon)
    total_days = calendar.monthrange(split_year, pay_month)[1]
    period_from = datetime.date(split_year, pay_month, 1)
    period_to = datetime.date(split_year, pay_month, total_days)
    non_atten_val = 0
    new_join_date = ''
    no_exist_employee,no_attendance_employee =0,0
    if period_from:
        start_date = period_from#datetime.date(datetime.datetime.strptime(period_from, '%Y-%m-%d').year, datetime.datetime.strptime(period_from, '%Y-%m-%d').month, datetime.datetime.strptime(period_from, '%Y-%m-%d').day)
    else:
        start_date = ''
        new_join_date = ''
    if period_to:
        end_date = period_to#datetime.date(datetime.datetime.strptime(period_to, '%Y-%m-%d').year, datetime.datetime.strptime(period_to, '%Y-%m-%d').month, datetime.datetime.strptime(period_to, '%Y-%m-%d').day)
    else:
        end_date = ''
        
    ## New join exception function   
    cur.execute("""select to_char(date_of_joining,'YYYY-MM-DD') as date_of_join ,to_char(date_of_releaving,'YYYY-MM-DD') as date_of_releaving 
    from employee_info where id = %s""",(employee_id,))
    joining_date_work = q.dictfetchall(cur)
    if joining_date_work and joining_date_work[0] and 'date_of_join' in joining_date_work[0]:
        date_of_joining = joining_date_work[0]['date_of_join']
        date_format = "%Y-%m-%d"
        work_date = datetime.datetime.strptime(str(date_of_joining),date_format)
        #print 'work_date--------------------',work_date,type(work_date)
        #print 'start_date--------------------',datetime.datetime.strptime(str(start_date),date_format),type(datetime.datetime.strptime(str(start_date),date_format))
        #print 'condition------------------',work_date < datetime.datetime.strptime(str(start_date),date_format)
        if work_date > datetime.datetime.strptime(str(start_date),date_format):
            new_join_date = work_date.date()
    if joining_date_work and joining_date_work[0] and joining_date_work[0]['date_of_releaving']:
            date_of_releaving = joining_date_work[0]['date_of_releaving']
            date_of_releaving = datetime.datetime.strptime(date_of_releaving, "%Y-%m-%d")
            print 'eeeeeeeeeeeeeeeebeefe',type(end_date)
            if (period_from.year == date_of_releaving.year and period_from.month > date_of_releaving.month):
                no_exist_employee = 1
            if (end_date.year == date_of_releaving.year and end_date.month == date_of_releaving.month):
                end_date = datetime.date(date_of_releaving.year,date_of_releaving.month,date_of_releaving.day)
            print type(end_date),type(date_of_releaving)
                        #print 'agfeterrrr---',start_date,type(start_date)
        
        #Skip when no attendance data for the employee
    cur.execute("""
SELECT count(*) FROM attendance_info where employee_id_id = %s and check_in :: date >= %s :: date
                                and check_in :: date <= %s :: date""",(employee_id,start_date,end_date,))
    skipon_noattendance_data = q.dictfetchall(cur)
    print 'skipon_noattendance_data------------',skipon_noattendance_data
    if not skipon_noattendance_data[0]['count']:
            cur.execute(""" select count(*) from leave_info  where state_id=119  and  
((from_date::date>=%s and from_date::date<=%s)
       or (from_date::date<%s and to_date::date>=%s) )
                                and leave_employee_id_id = %s and is_active""",(start_date,end_date,start_date,start_date,employee_id,))
            skipon_noleave_data = q.dictfetchall(cur)
            if not skipon_noleave_data[0]['count']:
                no_attendance_employee = 1
        #Skip when no attendance data for the employee
    #print"=================================start_date",start_date
    if start_date and end_date:
        total_working_days = end_date - start_date
    else:
        total_working_days = ''
    if total_working_days:
        total_working_days = total_working_days.days + 1
    else:
        total_working_days = ''
    #now = datetime.datetime.now()
    #num_days = calendar.monthrange(now.year, now.month-1)
    #week_days = len([2 for i in calendar.monthcalendar(now.year,now.month) if i[5] != 0])
#     daygenerator = (period_from + timedelta(x + 1) for x in xrange((period_to - period_from).days))
#     week_days = sum(1 for day in daygenerator if day.weekday() < 5)
#     print"==============================total_days",total_days
#     total_week_days = week_days + 1    
#     print"==============================week_days",total_week_days
#     
#     print"@@@@@@@@@@@@@@@@@@@@@@@@@@@@@",period_from,period_to,employee_id
#     cur.execute("""select COALESCE(count(a.check_in),0) as count from (select *,extract(dow from check_in) as day_num from attendance_info  where   
#                     check_in >=  %s
#              and check_out <=  %s and employee_id_id = %s  order by check_in)a where a.day_num not in (6,0)""",(period_from,period_to,employee_id,))
#     attandance_data_count = q.dictfetchall(cur)
#     print"===============================================%%%%%%%%%%%%%%%%%%%%%%%",attandance_data_count
#     saturday_sun = int(total_days) - int(total_week_days)
#     print"++++++++++++++++&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&",saturday_sun
#     cur.execute("""select COALESCE(count(*),0) as holiday from holiday_list_info    where holiday_date >=  %s 
#               and holiday_date <= %s""",(period_from,period_to,))
#     holiday_data_count = q.dictfetchall(cur)
#     print"===============================================%%%%%%%%%%%%%%%%%%%%%%%",holiday_data_count
       
    
    if total_working_days and start_date and end_date:
        if cur:
            if id:
                if total_working_days:
                    result[config.total_working_days] = total_working_days
                else:
                    result[config.total_working_days] = config.data_empty_key
                cur.execute(q.fetch_hcms_query(config.payroll_management, config.leave_status));
                leave_status_id = q.dictfetchall(cur)  
                payslip_leave_lop_query = q.fetch_hcms_query(config.payroll_management, config.payslip_leaveof_lop_record_key)
                if payslip_leave_lop_query:
                    cur.execute(payslip_leave_lop_query, (str(period_from), str(period_to), leave_status_id[1]['id'],int(str( employee_id)), config.leave_of_absence_key,))
                    result_data_lop = q.dictfetchall(cur)
                    if result_data_lop[0][config.leave_lop]:
                        result[config.leave_lop] = result_data_lop[0][config.leave_lop]
                    else:
                        result_data_lop = []
                        result[config.leave_lop] = result_data_lop.append({'leave_lop': int("0")})
                        
                      
#                 if total_working_days and result[config.leave_lop] != '':
#                         result[config.worked_days] = total_working_days - result_data_lop[0][config.leave_lop]
#                 else:
#                         result[config.worked_days] = config.data_empty_key
#                 cur.execute("""select emp.id as emp_id,hrpdts.username,hrpdts.summary_hours,hrpdts.hr_hours,hrpdts.meeting_hours,to_char(hrpdts.check_in,'DD/MM/YYYY') as check_in,hrpdts.check_in_time,
#                     (
#                     select ri.refitems_code from leave_info li 
#                     inner join reference_items ri on ri.id = li.type_id_id
#                     where li.from_date::date >= hrpdts.check_in and li.from_date::date <= hrpdts.check_in::date and leave_employee_id_id = emp.id
#                     ) as leave_status,
#                 (
#                     select li.number_of_days from leave_info li 
#                     inner join reference_items ri on ri.id = li.type_id_id
#                     where li.from_date::date >= hrpdts.check_in and li.from_date::date <= hrpdts.check_in::date and leave_employee_id_id = emp.id
#                     ) as number_of_days
#                     from hr_project_details hrpdts
#                     inner join employee_info emp on emp.related_user_id_id = hrpdts.user_id
#                     where emp.id = %s  and 
#                     hrpdts.check_in::date >= %s and hrpdts.check_in::date <= %s order by check_in""",(employee_id,period_from,period_to,))  
                ## New join exception function 
                cur.execute("select to_char(date_of_joining,'YYYY-MM-DD') as date_of_join from employee_info where id = %s",(employee_id,))
                joining_date = q.dictfetchall(cur)
                if joining_date:
                    date_of_joining = joining_date[0]['date_of_join']
                    date_format = "%Y-%m-%d"
                    a = datetime.datetime.strptime(str(date_of_joining),date_format)
                    b = datetime.datetime.strptime(str(period_to), date_format)
                    delta = b - a
                    total_days_of_joining = delta.days 
                    
                    if total_days_of_joining > 30:
                        n_days = total_days_of_joining - 30
                        if n_days < 30:
                            date_N_days_ago = period_to - timedelta(days = n_days)
                            print"@@@@@@@@@@@@@@@@@@@@@@@@@@"
                            print"===========================date_N_days_ago",date_N_days_ago
                            period_from = date_N_days_ago
                    ## New join exception function end
                    ## attendance leave function         
                        cur.execute("select org_id_id,org_unit_id_id from employee_info where id = %s ",(employee_id,))
                        org_data = q.dictfetchall(cur)
                        if org_data:
                            org_data_val = org_data[0]['org_id_id']
                            org_unit_val = org_data[0]['org_unit_id_id']
                            cur.execute("""select count(dd) from 
                                (with days as
                                (
                                    select dd :: date, extract(DOW from dd) dw
                                    from generate_series(%s::date, %s::date, '1 day'::interval) dd
                                )
                                select *
                                from   days where dw not in (0,6))datequery 
                                where dd NOT IN (SELECT check_in :: date FROM attendance_info where employee_id_id = %s and check_in :: date >=  %s :: date
                                and check_in :: date <= %s :: date) 
                                and dd NOT IN (SELECT holiday_date :: date FROM holiday_list_info where org_id_id = %s and  org_unit_id_id = %s and holiday_date :: date >=  %s :: date and holiday_date :: date <= %s :: date and is_active)
                                and dd NOT IN (SELECT generate_series(from_date::date, to_date::date, '1 day'::interval)::date from leave_info where is_active and state_id =119 and leave_employee_id_id = %s)"""
                                ,(period_from,end_date,employee_id,period_from,end_date,org_data_val,org_unit_val,period_from,end_date,employee_id,))  
                            non_attendance_data = q.dictfetchall(cur)
                            print"NON__________",period_from,end_date,employee_id,period_from,end_date,org_data_val,org_unit_val,period_from,end_date,employee_id
                            if non_attendance_data:
                                non_atten_val = non_attendance_data[0]['count']
                            else:
                                non_atten_val = 0
                            ## attendance leave function end
                            
                             ## non compliance function  start    
            
                        cur.execute("""
                        select emp.id as emp_id,hr_project_details.username,hr_project_details.summary_hours,hr_project_details.hr_hours,leave_info.number_of_days,ri.refitems_code as leave_status,
                        hr_project_details.meeting_hours,to_char(hr_project_details.check_in,'DD/MM/YYYY') as check_in,hr_project_details.check_in_time from hr_project_details
                        inner join employee_info emp on emp.related_user_id_id = hr_project_details.user_id
                         left join leave_info  on leave_employee_id_id = emp.id   and  leave_info.from_date::date = hr_project_details.check_in::date and leave_info.is_active
                         left join reference_items ri on ri.id = leave_info.type_id_id
                         where emp.id = %s and
                         hr_project_details.check_in  >= %s  and hr_project_details.check_in::date <= %s and hr_project_details.day_name not in ('Saturday','Sunday')
                        group by  emp.id ,hr_project_details.username,hr_project_details.summary_hours,hr_project_details.hr_hours,leave_info.number_of_days,ri.refitems_code,
                        hr_project_details.meeting_hours,to_char(hr_project_details.check_in,'DD/MM/YYYY') ,hr_project_details.check_in_time
                        order by check_in asc""",(employee_id,period_from,end_date,))      
                        emp_working_data = q.dictfetchall(cur)
                        lop_count = 0
                        if emp_working_data:
                            permission_count = 0
                            late_count = 0
                            lop_hr_count = 0
                            tot_meet_hrs = datetime.datetime.strptime('00:00:00', '%H:%M:%S')
                            tot_hrs = 0
                            
                            for i in emp_working_data:
                                total_lvr_value = 0
                                total_tl_value = 0.0
                                total_ld_percentage = 0.0
                                leadership_basic_percentage = 0.0
                                leadership_total_percentage = 0.0
                                leadership_slab_value = 0.0
                                project_variance_value = 0
                                mentor_value = 0
                                percentage_divide = 0.0
                                time_zero = datetime.datetime.strptime('00:00:00', '%H:%M:%S')
                                cur.execute("""select to_char(hcms_shift_master.shift_start_time,'HH:MM:SS') as shift_start_time,
                                to_char(hcms_attendance_late_early_policy.late_grace_time, 'HH24:MI:SS') as late_grace_time,hcms_shift_master.shift_name,to_char(hcms_shift_master.shift_full_day_time, 'HH:MM:SS') as shift_full_day_time
                                from hcms_shift_master 
                                inner join hcms_shift_employee_rel on hcms_shift_master.id = hcms_shift_employee_rel.shift_master_id
                                left join hcms_attendance_late_early_policy on hcms_attendance_late_early_policy.emp_shift_id = hcms_shift_employee_rel.shift_master_id
                                where hcms_shift_employee_rel.shift_employee_id = %s""",(employee_id,))
                                shift_data = q.dictfetchall(cur)
				print"SHHHHHHHHH",shift_data
                                if shift_data:
                                    hr_shift_grace_time = shift_data[0]['late_grace_time']
                                    print"============================@@@@@@@@@@@@@@@@@@@@@@",hr_shift_grace_time
                                    if hr_shift_grace_time != None:
                                        hr_shift_grace_time_conv = datetime.datetime.strptime(hr_shift_grace_time, '%H:%M:%S') 
                                    else:
                                        hr_shift_grace_time = '00:00:00' 
                                    hr_shift_grace_time_conv = datetime.datetime.strptime(hr_shift_grace_time, '%H:%M:%S')   
                                    shift_time = shift_data[0]['shift_start_time']
                                    hr_shift_time_conv = datetime.datetime.strptime(shift_time, '%H:%M:%S')  
                                    hr_total_shift_time = str((hr_shift_time_conv - time_zero + hr_shift_grace_time_conv).time())
                                    check_in_val = datetime.datetime.strptime(hr_total_shift_time, '%H:%M:%S')
                                    grace_shift_name = shift_data[0]['shift_name']
                                    hr_hour_val = datetime.datetime.strptime(shift_data[0]['shift_full_day_time'], '%H:%M:%S')
                                    tot_project_hr_val = datetime.datetime.strptime(shift_data[0]['shift_full_day_time'], '%H:%M:%S')
                                    #print"=====================shift_data",check_in_val
                                else:
                                    check_in_val = datetime.datetime.strptime('08:16:00', '%H:%M:%S')
                                    tot_project_hr_val = datetime.datetime.strptime('08:00:00', '%H:%M:%S')
                                    hr_hour_val = datetime.datetime.strptime('08:00:00', '%H:%M:%S')
                                    grace_shift_name = ''
                                hr_hour_con = datetime.datetime.strptime('12:00:00', '%H:%M:%S')
#                                 tot_project_hr_val = datetime.datetime.strptime('08:00:00', '%H:%M:%S')
                                tot_project_hr_val_per = datetime.datetime.strptime('07:00:00', '%H:%M:%S')
                                #check_in_val = datetime.datetime.strptime('08:16:00', '%H:%M:%S')
#                                 hr_hour_val = datetime.datetime.strptime('08:00:00', '%H:%M:%S')
                                hr_hour_val_per = datetime.datetime.strptime('07:00:00', '%H:%M:%S')
                                tot_project_hr_half = datetime.datetime.strptime('04:00:00', '%H:%M:%S')
                                hr_hour_half = datetime.datetime.strptime('04:00:00', '%H:%M:%S')
                                check_in_time = datetime.datetime.strptime(i['check_in_time'], '%H:%M:%S')
                                hr_hour_time = datetime.datetime.strptime(i['hr_hours'], '%H:%M:%S')
                                cur.execute("""select to_char(late_arrival_date,'DD/MM/YYYY') as late_date ,user_id from late_arrival
                                inner join employee_info emp on emp.related_user_id_id = late_arrival.user_id 
                                where late_arrival_date = to_date(%s,'DD-MM-YYYY') and emp.id = %s"""
                                            ,(i['check_in'],employee_id,))
                                late_date_data = q.dictfetchall(cur)
                                
                                cur.execute("""SELECT to_char(check_out - check_in, 'HH24:MI:SS') AS time_diff 
                                FROM attendance_info  where employee_id_id = %s and 
                                check_in :: date = to_date(%s,'DD-MM-YYYY') and attendance_type = 'WEB'""",(employee_id,i['check_in'],))
                                hr_time_diff = q.dictfetchall(cur)
                                if hr_time_diff:
                                    hr_time_add = datetime.datetime.strptime(hr_time_diff[0]['time_diff'], '%H:%M:%S')
                                else:
                                    hr_time_add = datetime.datetime.strptime('00:00:00', '%H:%M:%S')  
                                    
                                #print"=========================================================late_date_data",check_in_time,i['check_in'],late_date_data
                                if late_date_data:
                                   check_in_date = datetime.datetime.strptime(i['check_in'], "%d/%m/%Y").date()
                                   late_date = datetime.datetime.strptime(late_date_data[0]['late_date'], "%d/%m/%Y").date()
                                   if check_in_date == late_date:
                                        late_arrival_time = datetime.datetime.strptime('01:00:00', '%H:%M:%S')
                                        check_in_time_late = check_in_time - late_arrival_time
                                        check_in_time = datetime.datetime.strptime(str(check_in_time_late), '%H:%M:%S')
                                        #print"************************************************************",check_in_time
                                   else:
                                       print"eeeeeeeeeeeeeeeeeeeeeeee"   
                                if i['hr_hours'] >= '12:00:00':
                                    hr_hour_time_first = datetime.datetime.strptime('08:00:00', '%H:%M:%S')
                                    hr_hour_time_sec = str((hr_hour_time_first - time_zero + hr_time_add).time())
                                    hr_hour_time = datetime.datetime.strptime(hr_hour_time_sec, '%H:%M:%S')
                                else:
                                    hr_hour_time_first = datetime.datetime.strptime(i['hr_hours'], '%H:%M:%S')  
                                    hr_hour_time_sec = str((hr_hour_time_first - time_zero + hr_time_add).time())
                                    hr_hour_time = datetime.datetime.strptime(hr_hour_time_sec, '%H:%M:%S')
                                if grace_shift_name != 'No Conflict':
                                #if str(i['emp_id']) not in ('41','149','121','204'):
                                    t1 = '00:00:00';
                                    if float(i['summary_hours']) >= float('24.0'):
                                        work_summary_hr = '8.0'
                                    else:
                                        work_summary_hr = i['summary_hours']
                                    if work_summary_hr:
                                        summary_hrs = str(datetime.timedelta(hours=float(work_summary_hr)))
                                        summary_hours_time = str((summary_hrs).split('.')[0])
                                        tot_sum_hrs = datetime.datetime.strptime(str(summary_hours_time), '%H:%M:%S')
                                    
                                    if i['meeting_hours']:
                                        tot_meet_hrs = datetime.datetime.strptime(str(i['meeting_hours']), '%H:%M:%S')
                                    tot_project_hr = str((tot_sum_hrs - time_zero + tot_meet_hrs).time());
                                    tot_proj_hr_time = datetime.datetime.strptime(tot_project_hr, '%H:%M:%S')
                                    tot_project_hrs_first = str((tot_proj_hr_time - time_zero + hr_time_add).time());
                                    tot_project_hrs = datetime.datetime.strptime(tot_project_hrs_first, '%H:%M:%S')
                                    #print tot_project_hrs,i['check_in'],i['check_in_time'],i['hr_hours']
                                    if check_in_time < check_in_val:
                                        #print"@@@@@@@@@@@@@@@@@@@@@@@@@@",tot_project_hrs,hr_hour_con,tot_project_hr_val,check_in_val,hr_hour_val,hr_hour_val_per,tot_project_hr_half,check_in_time
                                        #print 'tot_project_hrs',tot_project_hrs,'tot_project_hr_val',tot_project_hr_val
                                        if tot_project_hrs < tot_project_hr_val:
                                            if permission_count < 2 and i['leave_status'] == 'PEMSN':
                                                if tot_project_hrs < tot_project_hr_val_per or hr_hour_time < hr_hour_val_per:
                                                    lop_count += 1
						    print"11111111111"
                                                else:
                                                    pass    
                                                permission_count += 1
                                                
                                            elif i['leave_status'] in ('SICKL','CASHL','MTNTL','PTNTL','CMPOF','LEABS'):
                                                half_day = i['number_of_days'] % 1
                                                if i['number_of_days'] <= half_day:
                                                    if tot_project_hrs < tot_project_hr_half or hr_hour_time < hr_hour_half:
                                                        lop_count += 0.5
							print"22222222"
                                                    else:
                                                        pass   
                                                else:
                                                    pass         
                                            else:
                                                print '2232323'
                                                lop_count += 1
                                        else:
                                            #print"2222222222222222",type(hr_hour_time),type(hr_hour_val)
                                            if hr_hour_time < hr_hour_val:
                                                #print"=================================77777777777777777777",i['check_in']
                                                if i['leave_status'] == 'PEMSN':
                                                    if hr_hour_time < hr_hour_val_per:
                                                        lop_count += 1
							print"44444444"
                                                else:
                                                    if i['leave_status'] in ('SICKL','CASHL','MTNTL','PTNTL','CMPOF','LEABS'):
                                                        half_day = i['number_of_days'] % 1
                                                        if i['number_of_days'] <= half_day:
                                                            if tot_project_hrs < tot_project_hr_half or hr_hour_time < hr_hour_half:
                                                                lop_count += 0.5
								print"55555555"
                                                            else:
                                                                pass   
                                                        else:
                                                            pass
                                                    else:    
                                                        lop_count += 1
							print"6666666"
                                            else: 
                                                pass       
                                    else:
                                        if check_in_time > check_in_val:
                                            if permission_count < 2 and i['leave_status'] == 'PEMSN':
                                                if tot_project_hrs < tot_project_hr_val_per or hr_hour_time < hr_hour_val_per:
                                                        lop_count += 1
							print"7777777"
                                                else:
                                                    pass 
                                                permission_count += 1
                                                
                                                
                                            elif i['leave_status'] in ('SICKL','CASHL','MTNTL','PTNTL','CMPOF','LEABS'):
                                                half_day = i['number_of_days'] % 1
                                                if i['number_of_days'] <= 0.5:
                                                    if tot_project_hrs < tot_project_hr_half or hr_hour_time < hr_hour_half:
                                                            lop_count += 0.5 
							    print"888888"
                                                    else:
                                                        pass   
                                                else:
                                                    pass 
                                                    
                                            else:
                                                if late_count < 2 :
                                                    if hr_hour_time < hr_hour_val:
                                                        if i['leave_status'] == 'PEMSN':
                                                            if hr_hour_time < hr_hour_val_per:
                                                                lop_count += 1
								print"999999"
                                                        else:
                                                           lop_count += 1  
						           print"10101010101"   
                                                    else:    
                                                        if tot_project_hrs < tot_project_hr_val:
                                                            print"+++++++++++++",lop_count
                                                            lop_count += 1 
                                                        late_count += 1
                                                    pass
                                                else:
                                                    lop_count += 1 
                                                    print"================================lllllllllllllll"            
                                else:
                                    lop_count = 0
                                    print"000000LOPLOP"
                                print"=====================================",lop_count,i['check_in'],i['check_in_time'],non_atten_val     
                    else:
                        print"eeeeeeeeeeeeeeeeeeeeeeeeeeeeee"  
                    
                if non_atten_val:
                      lop_count =  lop_count + non_atten_val     
                                   
                result['lop_count'] = lop_count  
                ## non compliance function  end  
                total_new_join_work_days = 0  
                new_join_worked_days = 0          
                if new_join_date:
                    print"+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++",new_join_date,end_date
                    new_join_work_days = end_date - new_join_date
                    new_join_worked_days = new_join_work_days.days + 1
                    print"assssssssssssssssssssssssss",new_join_worked_days
                    total_new_join_work_days = new_join_worked_days - result_data_lop[0][config.leave_lop] - lop_count
                    #total_working_days.days + 1
                    print"@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@",total_new_join_work_days
                    result[config.worked_days] = total_new_join_work_days
                else:    
                    if total_working_days and result[config.leave_lop] != '':
                        result[config.worked_days] = total_working_days - result_data_lop[0][config.leave_lop] - lop_count
                    else:
                        result[config.worked_days] = config.data_empty_key  
        if no_attendance_employee or no_exist_employee:                
             result = {'leave_lop': 0, 'lop_count': 0, 'total_working_days': 0, 'worked_days': 0}
        print 'result-------------',result
    else:
        result[config.status] = config.unable_to_create_connection_message
#     except Exception as e:  # Exception Block
#         result[config.status] = e
    return HttpResponse(json.dumps(result))  # Return the Response    

# Structure Details Based on the Salary Rule
@csrf_exempt
def PayslipStructureSalaryRule(request):
        ''' 
            17-May-2018 VIJ To HR Payroll Payslip page loaded. And also check the user authentication
            @param request: Request Object
            @type request : Object
            @return:   HttpResponse or Redirect the another URL
            @author: VIJ
        '''
    #try:#Try Block
        logger_obj.info("Payslip Structure Salary Rule Function")
        cur = connection.cursor()
        if cur: 
            post = request.POST
            employee_id = post.get(config.employee_id)  # Get the Employee ID
            structure_id = post.get(config.structure_id)  # Get the Structure ID
            working_days = post.get(config.working_days)  # Get the Working Days
            worked_day = post.get(config.worked_day)  # Get the Worked Day
            lop_days = post.get(config.lop_days)  # Get the LOP Days
            period_from_val = post.get(config.period_from)  # Get the Table Id
            period_to_val = post.get(config.period_to)
            created_date = format(datetime.datetime.now().strftime ("%Y-%m-%d"))
            datas = 0
            if period_from_val:
                split_mon = period_from_val.split('-')[0]
            if period_to_val:
                split_year = int(period_from_val.split('-')[1] )
            if split_mon:
                pay_month = int(strptime(split_mon,'%b').tm_mon)
            total_days = calendar.monthrange(split_year, pay_month)[1]
            period_from = datetime.date(split_year, pay_month, 1)
            period_to = datetime.date(split_year, pay_month, total_days)
            lvr_date = str(period_from)
            if period_from:
                start_date = period_from#datetime.date(datetime.datetime.strptime(period_from, '%Y-%m-%d').year, datetime.datetime.strptime(period_from, '%Y-%m-%d').month, datetime.datetime.strptime(period_from, '%Y-%m-%d').day)
                year_mon_date  = datetime.datetime.strptime(lvr_date, '%Y-%m-%d').strftime('%Y-%m')
            else:
                start_date = ''
                year_mon_date = ''
            if period_to:
                end_date = period_to#datetime.date(datetime.datetime.strptime(period_to, '%Y-%m-%d').year, datetime.datetime.strptime(period_to, '%Y-%m-%d').month, datetime.datetime.strptime(period_to, '%Y-%m-%d').day)
            else:
                end_date = ''
            if lop_days:
                lop_days = lop_days
            else:
                lop_days = 0
	    print"period from--",period_from
            result_data = {}
            list_value_earnings = []
            list_value_deduction = []
            list_value_employer = []
            ctc_amount = ''
            worked_ctc_amount = ''
            fixed_basic_amount_value = ''
            earned_basic_amount_value = ''
            tds_amount_val = 0
            variable_amount = 0
            arrear_amount_val = 0
            perform_bonus_amount_val = 0
            variable_bonus = 0
            total_lvr_value = 0
            total_lvr_amount = 0
            product_bonuce_value = 0
            product_type_value = 0
            total_pvr_value = 0
            result_rating = {}
            cur.execute("""select tds_amount from hr_tds  where tds_employee_id = %s  and (tds_from_date,tds_to_date) overlaps (%s,%s) and is_active = 'True' """ , (employee_id,str(period_from),str(period_to),))
            tds_details = q.dictfetchall(cur)
            if tds_details:
                tds_amount_val = tds_details[0]['tds_amount']
                
            cur.execute("""select arrear_amount,reference_items.refitems_code from hr_arrear_amount
                 inner join reference_items on reference_items.id = hr_arrear_amount.arrear_type_id
                 where arrear_employee_id = %s and hr_arrear_amount.is_active and (hr_arrear_amount.arrear_from_date,hr_arrear_amount.arrear_to_date) overlaps (%s,%s) """ , (employee_id,str(period_from),str(period_to),))
            arrear_details = q.dictfetchall(cur)
            if arrear_details:
                for a in arrear_details:
                    if a['refitems_code'] == 'ARRER':
                        arrear_amount_val = arrear_details[0]['arrear_amount'] 
                    elif a['refitems_code'] == 'PERBS':
                        perform_bonus_amount_val = arrear_details[0]['arrear_amount']
                    elif a['refitems_code'] == 'VARPY':
                        variable_bonus = arrear_details[0]['arrear_amount']    
            # For CTC Amount Calculation Based on the Worked Days
            # Query For Basic Amount Based on the Employee From Salary Structure
            payslip_emp_fixed_monthly_ctc_amount_query = q.fetch_hcms_query(config.payroll_management, config.payslip_emp_fixed_monthly_ctc_amount_query)
            if payslip_emp_fixed_monthly_ctc_amount_query:
                cur.execute(payslip_emp_fixed_monthly_ctc_amount_query, (employee_id,period_from,))
                base_amount = q.dictfetchall(cur)
                if base_amount:
                    #ctc_amount = 18750
                   #EKM// ttc=ekm_process('fb4a04a8b086e06c168d9c1d1fbd9aa9','string',base_amount[0]['base_amount'],'decrypt')
		   ttc = base_amount[0]['base_amount']
                   print"TTTTTTTTT",ttc,base_amount[0]['base_amount']
                   #EKM// ctc_amount = float(ekm_process('fb4a04a8b086e06c168d9c1d1fbd9aa9','string',base_amount[0]['base_amount'],'decrypt'))#base_amount[0]['base_amount']
		   ctc_amount = float(base_amount[0]['base_amount'])
                   #ctc_amount = ctc_amount + float(arrear_amount_val)
            #print"==========================ctc_amount",ctc_amount ,working_days,worked_day
            print"ffffffffffffffffffffffffffffffffffffffffffff",ctc_amount, working_days, worked_day
            if ctc_amount and working_days and worked_day:
                if working_days > 0:
                    one_day_salary = ctc_amount / float(working_days)
                else:
                    one_day_salary = 0.00
                if worked_day > 0:
                    worked_ctc_amount = one_day_salary * float(worked_day)
                else:
                    worked_ctc_amount = 0.00
            if ctc_amount:
		result_data['fixed_ctc_amount'] = ctc_amount
           # Variable amount calculation
            cur.execute("""select hrprd.user_id from hr_performance_rating_details hrprd
                    inner join employee_info emp on emp.related_user_id_id = hrprd.user_id
                    where emp.id = %s and emp.is_active """ % (employee_id))
            rating_user_id_details = q.dictfetchall(cur)
            if rating_user_id_details:
                cur.execute("select variable_return from rating_point  where fixed_return = %s",(ctc_amount,))
                fixed_amount_data = q.dictfetchall(cur)
                cur.execute("select opr from hr_performance_rating_details  where user_id = %s and yyyy_mm =  %s",(rating_user_id_details[0]['user_id'],year_mon_date,))
                variable_data = q.dictfetchall(cur)
                if variable_data and fixed_amount_data:
		     percentage_divide = float(variable_data[0]['opr']) * float(fixed_amount_data[0]['variable_return']) /100
                     #variable_amount = (float(percentage_divide) * ctc_amount / 100)
                     variable_amount = (float("{0:.1f}".format(percentage_divide)) * ctc_amount / 100)
                     result_data['variable_amount'] = variable_amount
                else:
                     result_data['variable_amount'] = 0
            if start_date and end_date and employee_id:
                lvr_period_mon = start_date.month
                count = 0
                if lvr_period_mon == 3 or lvr_period_mon == 6 or lvr_period_mon == 10:
                    for a in range(3): 
                        total_tl_value = 0.0
                        total_ld_percentage = 0.0
                        leadership_basic_percentage = 0.0
                        leadership_total_percentage = 0.0
                        leadership_slab_value = 0.0
                        project_variance_value = 0
                        mentor_value = 0
                        now = datetime.datetime.now()
                        cur_day = datetime.date(now.year, now.month, 1)
                        last_month = now.month #if now.month > 1 else 12
                        today =  start_date
                        #dateutil.relativedelta.relativedelta(months=-1)
                        last_month = today - dateutil.relativedelta.relativedelta(months = count)
                        lvr_month  = datetime.datetime.strptime(str(last_month), '%Y-%m-%d').strftime('%Y-%m')
                #effective_from_date = datetime.datetime.strptime(start_date, '%d-%m-%Y').strftime('%Y-%m')
                #effective_to_date = datetime.datetime.strptime(to_date, '%d-%m-%Y').strftime('%Y-%m')
                    #for a in range(1):
                        cur.execute("""select opr as overall_rating,user_id from hr_performance_rating_year_details hrprd
                        inner join employee_info emp on emp.related_user_id_id = hrprd.user_id
                        where emp.id = %s and emp.is_active and hrprd.yyyy_mm = %s  """,(employee_id,lvr_month,))
                        performance_data = q.dictfetchall(cur)
                        if performance_data:
                            overall_rating_val = performance_data[0]['overall_rating']
                            cur.execute("select id,minimum_range,fixed_return,slab_title,variable_return from rating_point where is_active order by id ")
                            range_data = q.dictfetchall(cur)  
                            if range_data:
                                for i in range_data:
                                    if float(overall_rating_val) >= float(i['minimum_range']):
                                        result_rating['slab_id'] = i['id']
                                        result_rating['slab_title'] = i['slab_title']
                                        lvr_max_per = 5#i['variable_return']
                                        break 
                        if result_rating:
                             if result_rating['slab_title'] == 'H1' or result_rating['slab_title'] == 'H2':
                                lvr_ctc = lvr_max_per * ctc_amount / 100
                                 #leadership value return calculation for technical,functional,ontime,quality
                                cur.execute("""select tl as technical,fl as functional,od as ontime_delivery,cs as customer  from hr_performance_rating_details 
                                    inner join employee_info on employee_info.related_user_id_id = hr_performance_rating_details.user_id
                                    where employee_info.id = %s and yyyy_mm = %s """ , (employee_id,str(lvr_month),))
                                leadership_details = q.dictfetchall(cur)
                                
                                if leadership_details:
                                    fl = leadership_details[0]['functional']
                                    tl = leadership_details[0]['technical']
                                    otd = leadership_details[0]['ontime_delivery']
                                    cs = leadership_details[0]['customer']
                                    total_tl_value = float(fl) + float(tl) +float(otd) +float(cs)
                                    if total_tl_value:
                                        total_ld_percentage = float("{0:.1f}".format(total_tl_value)) / 4
                                    else:
                                        total_ld_percentage = 0   
                                            
                                #  leadership_total_percentage calculation          
                                if total_ld_percentage and lvr_ctc:
                                    leadership_total_percentage =  total_ld_percentage * lvr_ctc / 100    
                                # Leadership value return slab calculation            
                    #             cur.execute("""select value_return from leadership_value_return where id in  ( select id from rating_point where fixed_return = %s ) """ , (ctc_amount,))
                    #             leadership_value = q.dictfetchall(cur) 
                    #             if leadership_value:
                    #                 leadership_slab_value = float(leadership_value[0]['value_return']) * ctc_amount / 100    
                                #  Leadership value return project details calculation   
                                cur.execute("""select variance_status from hr_project_variance_details where user_id in 
                                    (select user_id from hr_performance_rating_details
                                    inner join employee_info on employee_info.related_user_id_id = hr_performance_rating_details.user_id 
                                    where employee_info.id = %s and employee_info.is_active) 
                                    and hr_project_variance_details.yyyy_mm = %s""" , (employee_id,year_mon_date,))
                                leadership_project_details = q.dictfetchall(cur)
                                if leadership_project_details:
                                    if int(leadership_project_details[0]['variance_status']) != 0:
                                        project_variance_value = 100 * lvr_ctc / 100
                                    else:
                                        project_variance_value = 0
                                
                                #leadership value return calculation for technical,functional,ontime,quality
                                cur.execute("""select mentor_value from hr_attain_trainee_details 
                                    inner join employee_info on employee_info.related_user_id_id = hr_attain_trainee_details.user_id
                                    where employee_info.id = %s and attain_yyyy_mm = %s """ , (employee_id,str(year_mon_date),))
                                attain_details = q.dictfetchall(cur)
                                if attain_details:
                                    mentor_value = float(attain_details[0]['mentor_value']) * lvr_ctc / 100  
                                total_lvr_value = leadership_total_percentage + project_variance_value + mentor_value
                        count = count + 1
                        total_lvr_amount =  total_lvr_amount + total_lvr_value
                    result_data['lvr_value'] = total_lvr_amount
                else:
                    result_data['lvr_value'] = 0    
            if start_date and end_date and employee_id:
                pvr_period_mon = start_date.month
                pvr_count = 0
                pvr_date_list = []
                if pvr_period_mon == 3 or pvr_period_mon == 6 or pvr_period_mon == 10:
                    for a in range(3): 
                        total_pvr_value = 0
                        now = datetime.datetime.now()
                        cur_day = datetime.date(now.year, now.month, 1)
                        last_month = now.month #if now.month > 1 else 12
                        today =  start_date
                        #dateutil.relativedelta.relativedelta(months=-1)
                        last_month = today - dateutil.relativedelta.relativedelta(months = pvr_count)
                        #print '0000000000000000----------------',  (last_month),count
                        pvr_month  = datetime.datetime.strptime(str(last_month), '%Y-%m-%d').strftime('%Y-%m')
                        pvr_count += 1
                        pvr_date_list.append(pvr_month)
                    cur.execute("""select project_id,project_name,sum(contribution_percent)as total_contribution,current_value,pvr_value from pvr_project_rating   inner  join pvr_product_details on pvr_project_rating.project_id = pvr_product_details.product_project_id
                    inner join employee_info on employee_info.related_user_id_id = pvr_project_rating.employee_id
                    where employee_info.id = %s and yyyy_mm in %s
                    group by project_id,project_name,current_value,pvr_value""",(employee_id,tuple(pvr_date_list),))
                    pvr_percent_data_count = q.dictfetchall(cur)
                    if pvr_percent_data_count:
                        for b in pvr_percent_data_count:
                            if b['current_value']:
                                hcms_product_value = b['current_value']
                                product_percent = 30
                                product_bonuce_value = 30 * float(hcms_product_value) / 100
                            else:
                                hcms_product_value = 0
                                product_percent = 30
                                product_bonuce_value = 30 * float(hcms_product_value) / 100
                                    
#                     cur.execute("""select pvr_product_type.project_percentage,pvr_project_rating.contribution_percent from pvr_product_type
#                         inner join pvr_project_rating on pvr_project_rating.project_type_id = pvr_product_type.project_type_id
#                         where pvr_project_rating.employee_id = %s""",(employee_id,))
#                     product_type_details = q.dictfetchall(cur)
                            if product_bonuce_value:
                                product_type_value = float(b['pvr_value']) * product_bonuce_value / 100
                                if product_type_value:
                                    enp_total_contribution = float(b['total_contribution']) / 3
                                    total_pvr_value += enp_total_contribution * product_type_value / 100
                    result_data['pvr_value'] = total_pvr_value
                else:
                    result_data['pvr_value'] = total_pvr_value
            print"0000000000000000000000))))))))))))))))))))))))",result_data['lvr_value'],result_data['pvr_value']        
            if structure_id and employee_id:
                # Query For Search like Basic and Validation Code
                payslip_salary_rule_basic_name_query = q.fetch_hcms_query(config.payroll_management, config.payslip_salary_rule_basic_name)
                if payslip_salary_rule_basic_name_query:
                    ilike_value = '%Basic%' or '%BASIC%' 
                    cur.execute(payslip_salary_rule_basic_name_query, (ilike_value, structure_id, employee_id,))
                    result_basic = q.dictfetchall(cur)
                    # Calculation of Fixed Basic Amount
                    # For Replacing the BASIC Code to as Basic Amount
                    if result_basic:
                        for j in result_basic:
                            if j['salary_rule_validation_code'] != '':
                                basic_validation_con = j['salary_rule_validation_code'].replace("ENCTC", str(ctc_amount))
                            else :
                                basic_validation_con = j['salary_rule_value_assignment_code'].replace("ENCTC", str(ctc_amount))
                            if "%" in basic_validation_con:  # For Find the % in Original String
                                basic_validation_con = basic_validation_con.replace("%", "/ 100.0 * ")
                                fixed_basic_amount_value = eval(str(basic_validation_con))  # For Replacing % as * and Divide By 100
                                
                            else:  # If % not in String 
                                fixed_basic_amount_value = eval(basic_validation_con)
                    else:
                        fixed_basic_amount_value = ''
                    # Calculation of Earned Basic Amount:
                    if result_basic:
                        for t in result_basic:
                            if t['salary_rule_validation_code']:
                                earned_basic_validation_con = t['salary_rule_validation_code'].replace("ENCTC", str(ctc_amount))
                            else :
                                earned_basic_validation_con = t['salary_rule_value_assignment_code'].replace("ENCTC", str(ctc_amount))
                            if "%" in earned_basic_validation_con:  # For Find the % in Original String
                                earned_basic_validation_con = earned_basic_validation_con.replace("%", "/ 100.0 * ")
                                earned_basic_amount_value = eval(str(earned_basic_validation_con))  # For Replacing % as * and Divide By 100
                                if earned_basic_amount_value and working_days and worked_day:
                                    earned_basic_amount_value = earned_basic_amount_value / float(working_days) * float(worked_day)
                            else:  # If % not in String 
                                earned_basic_amount_value = eval(earned_basic_validation_con)
                                if earned_basic_amount_value and working_days and worked_day:
                                    earned_basic_amount_value = earned_basic_amount_value / float(working_days) * float(worked_day)
                    else:
                        earned_basic_amount_value = ''
              
            # For the PF Applicable For payslip
            if employee_id:
                payslip_pf_applicable_query = q.fetch_hcms_query(config.payroll_management, config.payslip_pf_applicable_query)
                if payslip_pf_applicable_query:
                    cur.execute(payslip_pf_applicable_query, (employee_id,))
                    pf_applicable_result = q.dictfetchall(cur)
            # For Salary Computation Table For Earnings
            if structure_id and employee_id:
                # For Earnings Salary Rule 
                list_value_earnings = fixed_earnings_calculation(result_data, structure_id, employee_id, list_value_earnings, ctc_amount, fixed_basic_amount_value, lop_days, earned_basic_amount_value)
                result_data['emp_fixed_earnings'] = list_value_earnings
            if result_data['emp_fixed_earnings'] and result_data['fixed_ctc_amount']:
                # For the Fixed Earnings into list
                Fixed_Earnings_list = [] 
                result_data = fixed_gross_calculation(Fixed_Earnings_list,result_data,result_data['emp_fixed_earnings'],result_data['fixed_ctc_amount'], ctc_amount)
            # For Salary Computation Table For Earnings with Benefits
            if structure_id and employee_id:
                # For Earnings  with benefits of Salary Rule 
                list_value_earnings_benefits = calculation_of_benefits(result_data, structure_id, employee_id, list_value_earnings, ctc_amount, fixed_basic_amount_value, lop_days, earned_basic_amount_value)
                result_data['emp_fixed_earnings_benefits'] = list_value_earnings_benefits
           
            # For the Fixed Earnings into list
            Fixed_Earnings_Benefits_list = [] 
            result_data = fixed_gross_benefits_calculation(Fixed_Earnings_Benefits_list, result_data, ctc_amount)
            
            # For Salary Computation Table For Deduction
            if structure_id and employee_id:
                if int(variable_amount) > 0:
                #ctc_amount = 0
                    ctc_amount = variable_amount + ctc_amount
                else:  
                    ctc_amount = 0 + ctc_amount
                # For the Deduction Salary Rule 
                list_value_deduction = fixed_deduction_calculation(result_data, structure_id, employee_id, list_value_deduction, ctc_amount, fixed_basic_amount_value, lop_days, earned_basic_amount_value)
                result_data['emp_fixed_deduction'] = list_value_deduction
            # For the Fixed Deduction into list
            Fixed_Deduction_list = []
            for t in result_data['emp_fixed_deduction']:
                if t['refitems_name'] == "Deduction":
                    Fixed_Deduction_list.append(t)
            # For Salary Computation Table For Employer Contribution
            if structure_id and employee_id:
                # For Only Employer Contribution Details Fetch Query
                # Query For Getting the Payslip Details Based on the Rule Structure and Contract
#                 employer_payslip_structure_salary_rule = q.fetch_hcms_query(config.payroll_management, config.employer_payslip_structure_salary_rule)
#                 if employer_payslip_structure_salary_rule:
#                     cur.execute(employer_payslip_structure_salary_rule,(structure_id,employee_id,))
#                     employer_result = q.dictfetchall(cur) 
#                     #emp_data = [] 
#                     for j in employer_result:
#                         val_dic = {}
#                        # print"===================================jjjj",j['rule_code_employer']
#                         validation = j['salary_rule_validation_code']
#                         contribution_id = j['contribution_id_id']
#                         condition_id = j['rule_condition_id']
#                         print"=============contribution_id",contribution_id
#                         #employer_contribution_data = j['rule_code_employer']
#                         #emp_data.append(employer_contribution_data)
#                         # For Common Function of Salary Rule Execution
#                         list_value_employer = common_salary_rule_function(result_data, j, val_dic, validation, contribution_id, condition_id, list_value_employer, ctc_amount, fixed_basic_amount_value, lop_days, earned_basic_amount_value)
#             print"=========================list_value_employer",list_value_employer
#             result_data['employer_contribution_details'] = list_value_employer
               payslip_structure_salary_rule = q.fetch_hcms_query(config.payroll_management,config.payslip_structure_salary_rule)
               if payslip_structure_salary_rule:
                   cur.execute(payslip_structure_salary_rule, (structure_id, employee_id,))
                   result = q.dictfetchall(cur)
                   #print"==========================rrrrrrrrrrrrrRRRRRRRRRRRR",result
                   list_value = []
                   list_value_employer = []
                   for i in result:
                       val_dic = {}
                       validation = i['salary_rule_validation_code']
                       contribution_id = i['contribution_id_id']
                       condition_id = i['rule_condition_id']
                       contributor = ''
                       if contribution_id:
                           payslip_contribution_details_query = q.fetch_hcms_query(config.payroll_management, config.payslip_contribution_details_query)
                           if payslip_contribution_details_query:
                               cur.execute(payslip_contribution_details_query, (contribution_id,))
                               result = q.dictfetchall(cur)
                               if result[0]['contributor'] == 1:
                                    contributor = config.Employee
                               else:
                                    contributor = config.Employer
                       # For the Fixed Amount Calculation Only For the Employee
                       if contributor != 'Employer':
                           if validation:
#                                cur.execute("""select esi_active from esi_value where esi_employee_id = %s and (esi_date_from,esi_date_to) overlaps (%s,%s) and is_active and esi_active""" , (employee_id,str(period_from),str(period_to),))
#                                esi_value = q.dictfetchall(cur)
                               # For CTC in Salary Rule Validation Code
                               if "MNCTC" in validation:
                                   validation_condition = validation.replace("MNCTC", str(ctc_amount))
#                                elif "ENCTC" in validation:
#                                    validation_condition = validation.replace("ENCTC", str(ctc_amount))
                               elif "BASIC" in validation:  # IF Basic Salary Rule in Validation Code
                                   validation_condition = validation.replace("BASIC", str(fixed_basic_amount_value))
                               elif "ENBSC" in validation_condition:  # IF Earned basic in validation or assignment
                                    validation_condition = validation.replace("ENBSC", str(earned_basic_amount_value))
#                                if  esi_value:
#                                    if esi_value[0]['esi_active'] == 'true':   
#                                        if "ENCTC" in validation_condition:  # IF Earned basic in validation or assignment
#                                            validation_condition = validation.replace("ENCTC", str(ctc_amount)) 
#                                    else:
#                                        if "ENCTC" in validation_condition:  # IF Earned basic in validation or assignment
#                                            validation_condition = validation.replace("ENCTC", str(ctc_amount)) 
#                                else:   
#                                    if "ENCTC" in validation_condition:  # IF Earned basic in validation or assignment
#                                            validation_condition = validation.replace("ENCTC", str(ctc_amount))                 
                           # If No validation
                           else:
                               validation_condition = ''
                           # If Validation Condition
                           if validation_condition:
                               if "%" in validation_condition:  # For Find the % in Original String
                                   validation_condition = eval(validation_condition.replace("%", "*"))  # For Replacing % as * and Divide By 100
                                   validation_condition = eval(str(int(validation_condition) / 100))
                               else:
                                   validation_condition = eval(validation_condition)
                           if validation_condition:
                               if i['cal_type_code'] == "NUMBR":
                                   val_dic['assignment_value'] = round(float(i['salary_rule_value_assignment']))
                               else:
                                   # Check the Assignment Value 
                                   if i['salary_rule_value_assignment_code']:
                                       assignment_value = i['salary_rule_value_assignment_code']
                                       if assignment_value:
                                           cur.execute("""select esi_active from esi_value where esi_employee_id = %s and (esi_date_from,esi_date_to) overlaps (%s,%s) and is_active and esi_active""" , (employee_id,str(period_from),str(period_to),))
                                           esi_value = q.dictfetchall(cur)
                                           # For Replacing the BASIC Code to as Basic Amount
                                           # For CTC in Salary Rule Validation Code
                                           if "MNCTC" in assignment_value:
                                               assignment_value = assignment_value.replace("MNCTC", str(ctc_amount))
#                                            elif "ENCTC" in assignment_value:
#                                                assignment_value = assignment_value.replace("ENCTC", str(ctc_amount))
                                           elif "BASIC" in assignment_value:  # IF Basic Salary Rule in Validation Code
                                               assignment_value = assignment_value.replace("BASIC", str(fixed_basic_amount_value))
                                           elif "ENBSC" in assignment_value:  # IF Earned basic in validation or assignment
                                               assignment_value = assignment_value.replace("ENBSC", str(earned_basic_amount_value))     
                                           if  esi_value:
                                               if esi_value[0]['esi_active'] == True:
                                                   if "ENCTC" in assignment_value:  # IF Earned basic in validation or assignment
                                                        assignment_value = assignment_value.replace("ENCTC", str(ctc_amount)) 
                                               else :
                                                   if "ENCTC" in assignment_value:  # IF Earned basic in validation or assignment
                                                        assignment_value = assignment_value.replace("ENCTC", str(ctc_amount))  
                                           else:
                                               if "ENCTC" in assignment_value:  # IF Earned basic in validation or assignment
                                                        assignment_value = assignment_value.replace("ENCTC", str(ctc_amount))  
                                           if "%" in assignment_value:  # For Find the % in Original String
                                               assignment_value = eval(assignment_value.replace("%", "*"))  # For Replacing % as * and Divide By 100
                                               val_dic['assignment_value'] = round(eval(str(float(assignment_value) / 100.0)))
                                           else:
                                              val_dic['assignment_value'] = round(float(eval(assignment_value)))
                                       else:
                                           val_dic['assignment_value'] = ''
                                   # Else the Assignment Value not Given
                                   else:
                                       val_dic['assignment_value'] = validation_condition
                               val_dic['refitems_name'] = i['refitems_name']
                               val_dic['refitem_code'] = i['salary_rule_code']

                               if contribution_id:  # For the Employee Contribution Display the Text
                                   val_dic['salary_rule_name'] = i['salary_rule_name'] 
                               else:
                                    val_dic['salary_rule_name'] = i['salary_rule_name']
                               val_dic['condition_id'] = condition_id
                               # If Avoiding Same Value For Allowance and Deduction Details
                               count = 0
                               for k in list_value:
                                   if k['salary_rule_name'] == val_dic['salary_rule_name']:
                                       if k['assignment_value'] > val_dic['assignment_value']:
                                           val_dic['assignment_value'] = k['assignment_value']
                                           del list_value[count]
                                       elif k['assignment_value'] < val_dic['assignment_value']:
                                           val_dic['assignment_value'] = val_dic['assignment_value']
                                           del list_value[count]
                                       elif k['assignment_value'] == val_dic['assignment_value']:
                                           val_dic['assignment_value'] = val_dic['assignment_value']
                                           del list_value[count]
                                   count = count + 1;
                               list_value.append(val_dic)
                           # If No Validation Only Assignment Value
                           elif i['salary_rule_validation_code'] == '':
                               if i['cal_type_code'] == "NUMBR":
                                       val_dic['assignment_value'] = round(float(i['salary_rule_value_assignment']))
                               else:
                                   # Check the Assignment Value 
                                   if i['salary_rule_value_assignment_code']:
                                       assignment_value = i['salary_rule_value_assignment_code']
                                       if assignment_value:
                                           cur.execute("""select esi_active from esi_value where esi_employee_id = %s and (esi_date_from,esi_date_to) overlaps (%s,%s) and is_active and esi_active""" , (employee_id,str(period_from),str(period_to),))
                                           esi_value = q.dictfetchall(cur)
                                           # For Replacing the BASIC Code to as Basic Amount
                                           # For CTC in Salary Rule Validation Code
                                           if "MNCTC" in assignment_value:
                                               assignment_value = assignment_value.replace("MNCTC", str(ctc_amount))
#                                            elif "ENCTC" in assignment_value:
#                                                assignment_value = assignment_value.replace("ENCTC", str(ctc_amount))
                                           elif "BASIC" in assignment_value:  # IF Basic Salary Rule in Validation Code
                                               assignment_value = assignment_value.replace("BASIC", str(fixed_basic_amount_value))
                                           elif "ENBSC" in assignment_value:  # IF Earned basic in validation or assignment
                                               assignment_value = assignment_value.replace("ENBSC", str(earned_basic_amount_value))   
                                           if  esi_value:    
                                               if esi_value[0]['esi_active'] == True:
                                                   if "ENCTC" in assignment_value:  # IF Earned basic in validation or assignment
                                                        assignment_value = assignment_value.replace("ENCTC", str(ctc_amount)) 
                                               else :
                                                   if "ENCTC" in assignment_value:  # IF Earned basic in validation or assignment
                                                        assignment_value = assignment_value.replace("ENCTC", str(ctc_amount))
                                           else:
                                               if "ENCTC" in assignment_value:  # IF Earned basic in validation or assignment
                                                        assignment_value = assignment_value.replace("ENCTC", str(ctc_amount))            
                                           if "%" in assignment_value:  # For Find the % in Original String
                                               assignment_value = eval(assignment_value.replace("%", "*"))  # For Replacing % as * and Divide By 100
                                               val_dic['assignment_value'] = round(eval(str(float(assignment_value) / 100.0)))
                                           else:
                                              val_dic['assignment_value'] = round(float(eval(assignment_value)))
                                       else:
                                           val_dic['assignment_value'] = ''
                                   # Else the Assignment Value not Given
                                   else:
                                       val_dic['assignment_value'] = validation_condition
                                        
                               val_dic['refitems_name'] = i['refitems_name']
                               val_dic['salary_rule_name'] = i['salary_rule_name']
                               val_dic['refitem_code'] = i['salary_rule_code']
                               val_dic['condition_id'] = condition_id
                               # If Avoiding Same Value For Allowance and Deduction Details
                               if contribution_id:  # For the Employee Contribution Display the Text
                                   val_dic['salary_rule_name'] = i['salary_rule_name'] 
                                   cur.execute("select code as contribution_code from hr_contribution_register where id = %s ", (contribution_id,))
                                   contribution_code_result = q.dictfetchall(cur)
                                   val_dic['contribution_code'] = contribution_code_result[0]['contribution_code']
                                  
                               else:
                                    val_dic['salary_rule_name'] = i['salary_rule_name']
                               count = 0
                               for k in list_value:
                                   if k['salary_rule_name'] == val_dic['salary_rule_name']:
                                       if k['assignment_value'] > val_dic['assignment_value']:
                                           val_dic['assignment_value'] = k['assignment_value']
                                           del list_value[count]
                                       elif k['assignment_value'] < val_dic['assignment_value']:
                                           val_dic['assignment_value'] = val_dic['assignment_value']
                                           del list_value[count]
                                       elif k['assignment_value'] == val_dic['assignment_value']:
                                           val_dic['assignment_value'] = val_dic['assignment_value']
                                           del list_value[count]
                                   count = count + 1;
                               list_value.append(val_dic)
                           else:
        
                                val_dic['refitems_name'] = i['refitems_name']
                                val_dic['refitem_code'] = i['salary_rule_code']
                                if contribution_id:  # For the Employee Contribution Display the Text
                                       val_dic['salary_rule_name'] = i['salary_rule_name'] 
                                else:
                                    val_dic['salary_rule_name'] = i['salary_rule_name']
                                val_dic['condition_id'] = condition_id
                                val_dic['assignment_value'] = 0.00 
                                # If Avoiding Same Value For Allowance and Deduction Details
                                count = 0
                                for k in list_value:
                                    if k['salary_rule_name'] == val_dic['salary_rule_name']:
                                        if k['assignment_value'] > val_dic['assignment_value']:
                                            val_dic['assignment_value'] = k['assignment_value']
                                            del list_value[count]
                                        elif k['assignment_value'] < val_dic['assignment_value']:
                                            val_dic['assignment_value'] = val_dic['assignment_value']
                                            del list_value[count]
                                        elif k['assignment_value'] == val_dic['assignment_value']:
                                            val_dic['assignment_value'] = val_dic['assignment_value']
                                            del list_value[count]
                                    count = count + 1;
                                list_value.append(val_dic)
                       elif contributor != 'Employee':  # For the Employer Condition Checking
                            # For the Fixed Amount Calculation Only For the Employer:
                            if validation:
#                                cur.execute("""select esi_active from esi_value where esi_employee_id = %s and (esi_date_from,esi_date_to) overlaps (%s,%s) and is_active and esi_active""" , (employee_id,str(period_from),str(period_to),))
#                                esi_value = q.dictfetchall(cur)
                               # For CTC in Salary Rule Validation Code
                               if "MNCTC" in validation:
                                   validation_condition = validation.replace("MNCTC", str(ctc_amount))
#                                elif "ENCTC" in validation:
#                                    validation_condition = validation.replace("ENCTC", str(ctc_amount))
                               elif "BASIC" in validation:  # IF Basic Salary Rule in Validation Code
                                   validation_condition = validation.replace("BASIC", str(fixed_basic_amount_value))
                               elif "ENBSC" in validation_condition:  # IF Earned basic in validation or assignment   
                                   validation_condition = validation.replace("ENBSC", str(earned_basic_amount_value)) 
#                                if  esi_value:    
#                                    if esi_value[0]['esi_active'] == 'true':   
#                                        if "ENCTC" in validation_condition:  # IF Earned basic in validation or assignment
#                                            validation_condition = validation.replace("ENCTC", str(ctc_amount)) 
#                                    else:
#                                        if "ENCTC" in validation_condition:  # IF Earned basic in validation or assignment
#                                            validation_condition = validation.replace("ENCTC", str(ctc_amount))
#                                else:
#                                    if "ENCTC" in validation_condition:  # IF Earned basic in validation or assignment
#                                            validation_condition = validation.replace("ENCTC", str(ctc_amount))                
                           # If No validation
                            else:
                               validation_condition = ''
                            # If Validation Condition
                            if validation_condition:
                               if "%" in validation_condition:  # For Find the % in Original String
                                   validation_condition = eval(validation_condition.replace("%", "*"))  # For Replacing % as * and Divide By 100
                                   validation_condition = eval(str(int(validation_condition) / 100))
                               else:
                                   validation_condition = eval(validation_condition)
                            if validation_condition:
                               if i['cal_type_code'] == "NUMBR":
                                   val_dic['assignment_value'] = round(float(i['salary_rule_value_assignment']))
                               else:
                                   # Check the Assignment Value 
                                   if i['salary_rule_value_assignment_code']:
                                       assignment_value = i['salary_rule_value_assignment_code']
                                       if assignment_value:
                                           cur.execute("""select esi_active from esi_value where esi_employee_id = %s and (esi_date_from,esi_date_to) overlaps (%s,%s) and is_active and esi_active""" , (employee_id,str(period_from),str(period_to),))
                                           esi_value = q.dictfetchall(cur)
                                           # For Replacing the BASIC Code to as Basic Amount
                                           # For CTC in Salary Rule Validation Code
                                           if "MNCTC" in assignment_value:
                                               assignment_value = assignment_value.replace("MNCTC", str(ctc_amount))
#                                            elif "ENCTC" in assignment_value:
#                                                assignment_value = assignment_value.replace("ENCTC", str(ctc_amount))
                                           elif "BASIC" in assignment_value:  # IF Basic Salary Rule in Validation Code
                                               assignment_value = assignment_value.replace("BASIC", str(fixed_basic_amount_value))
                                           elif "ENBSC" in assignment_value:  # IF Earned basic in validation or assignment    
                                               assignment_value = assignment_value.replace("ENBSC", str(earned_basic_amount_value))
                                           if  esi_value:    
                                               if esi_value[0]['esi_active'] == True:
                                                   if "ENCTC" in assignment_value:  # IF Earned basic in validation or assignment
                                                        assignment_value = assignment_value.replace("ENCTC", str(ctc_amount)) 
                                               else :
                                                   if "ENCTC" in assignment_value:  # IF Earned basic in validation or assignment
                                                        assignment_value = assignment_value.replace("ENCTC", str(ctc_amount))     
                                           else:
                                                if "ENCTC" in assignment_value:  # IF Earned basic in validation or assignment
                                                        assignment_value = assignment_value.replace("ENCTC", str(ctc_amount))            
                                           if "%" in assignment_value:  # For Find the % in Original String
                                               assignment_value = eval(assignment_value.replace("%", "*"))  # For Replacing % as * and Divide By 100
                                               val_dic['assignment_value'] = round(eval(str(float(assignment_value) / 100.0)))
                                           else:
                                              val_dic['assignment_value'] = round(float(eval(assignment_value)))
                                       else:
                                           val_dic['assignment_value'] = ''
                                   # Else the Assignment Value not Given
                                   else:
                                       val_dic['assignment_value'] = validation_condition
                                        
                               val_dic['refitems_name'] = 'Employer_Contribution'
                               val_dic['refitem_code'] = i['salary_rule_code']
                               val_dic['condition_id'] = condition_id
                               if contribution_id:  # For the Employee Contribution Display the Text
                                   val_dic['salary_rule_name'] = i['salary_rule_name'] 
                                   cur.execute("select code as contribution_code from hr_contribution_register where id = %s ", (contribution_id,))
                                   contribution_code_result = q.dictfetchall(cur)
                                   val_dic['contribution_code'] = contribution_code_result[0]['contribution_code']
                               else:
                                    val_dic['salary_rule_name'] = i['salary_rule_name']
                               
                               # If Avoiding Same Value For Allowance and Deduction Details
                               count = 0
                               
                               for k in list_value_employer:
                                   if k['salary_rule_name'] == val_dic['salary_rule_name']:
                                       if k['assignment_value'] > val_dic['assignment_value']:
                                           val_dic['assignment_value'] = k['assignment_value']
                                           del list_value_employer[count]
                                       elif k['assignment_value'] < val_dic['assignment_value']:
                                           val_dic['assignment_value'] = val_dic['assignment_value']
                                           del list_value_employer[count]
                                       elif k['assignment_value'] == val_dic['assignment_value']:
                                           val_dic['assignment_value'] = val_dic['assignment_value']
                                           del list_value_employer[count]
                                   count = count + 1;
                               list_value_employer.append(val_dic)
                           # If No Validation Only Assignment Value
                            elif i['salary_rule_validation_code'] == '':
                               if i['cal_type_code'] == "NUMBR":
                                       val_dic['assignment_value'] = round(float(i['salary_rule_value_assignment']))
                               else:
                                   # Check the Assignment Value 
                                   if i['salary_rule_value_assignment_code']:
                                       assignment_value = i['salary_rule_value_assignment_code']
                                       if assignment_value:
                                           cur.execute("""select esi_active from esi_value where esi_employee_id = %s and (esi_date_from,esi_date_to) overlaps (%s,%s) and is_active and esi_active""" , (employee_id,str(period_from),str(period_to),))
                                           esi_value = q.dictfetchall(cur)
                                           # For Replacing the BASIC Code to as Basic Amount
                                           # For CTC in Salary Rule Validation Code
                                           if "MNCTC" in assignment_value:
                                               assignment_value = assignment_value.replace("MNCTC", str(ctc_amount))
#                                            elif "ENCTC" in assignment_value:
#                                                assignment_value = assignment_value.replace("ENCTC", str(ctc_amount))
                                           elif "BASIC" in assignment_value:  # IF Basic Salary Rule in Validation Code
                                               assignment_value = assignment_value.replace("BASIC", str(fixed_basic_amount_value))
                                           elif "ENBSC" in assignment_value:  # IF Earned basic in validation or assignment
                                               assignment_value = assignment_value.replace("ENBSC", str(earned_basic_amount_value))    
                                           if esi_value:
                                               if esi_value[0]['esi_active'] == True:
                                                   if "ENCTC" in assignment_value:  # IF Earned basic in validation or assignment
                                                        assignment_value = assignment_value.replace("ENCTC", str(ctc_amount)) 
                                               else :
                                                   if "ENCTC" in assignment_value:  # IF Earned basic in validation or assignment
                                                        assignment_value = assignment_value.replace("ENCTC", str(ctc_amount)) 
                                           else:
                                               if "ENCTC" in assignment_value:  # IF Earned basic in validation or assignment
                                                        assignment_value = assignment_value.replace("ENCTC", str(ctc_amount))                 
                                           if "%" in assignment_value:  # For Find the % in Original String
                                               assignment_value = eval(assignment_value.replace("%", "*"))  # For Replacing % as * and Divide By 100
                                               val_dic['assignment_value'] = round(eval(str(float(assignment_value) / 100.0)))
                                           else:
                                              val_dic['assignment_value'] = round(float(eval(assignment_value)))
                                       else:
                                           val_dic['assignment_value'] = ''
                                   # Else the Assignment Value not Given
                                   else:
                                       val_dic['assignment_value'] = validation_condition
                                        
                               val_dic['refitems_name'] = "Employer_Contribution"
                               val_dic['refitem_code'] = i['salary_rule_code']
                               val_dic['salary_rule_name'] = i['salary_rule_name']
                               val_dic['condition_id'] = condition_id
                               # If Avoiding Same Value For Allowance and Deduction Details
                               if contribution_id:  # For the Employee Contribution Display the Text
                                   val_dic['salary_rule_name'] = i['salary_rule_name'] 
                                   cur.execute("select code as contribution_code from hr_contribution_register where id = %s ", (contribution_id,))
                                   contribution_code_result = q.dictfetchall(cur)
                                   val_dic['contribution_code'] = contribution_code_result[0]['contribution_code']
                               else:
                                    val_dic['salary_rule_name'] = i['salary_rule_name']
                               count = 0
                               for k in list_value_employer:
                                   if k['salary_rule_name'] == val_dic['salary_rule_name']:
                                       if k['assignment_value'] > val_dic['assignment_value']:
                                           val_dic['assignment_value'] = k['assignment_value']
                                           del list_value_employer[count]
                                       elif k['assignment_value'] < val_dic['assignment_value']:
                                           val_dic['assignment_value'] = val_dic['assignment_value']
                                           del list_value_employer[count]
                                       elif k['assignment_value'] == val_dic['assignment_value']:
                                           val_dic['assignment_value'] = val_dic['assignment_value']
                                           del list_value_employer[count]
                                   count = count + 1;
                               list_value_employer.append(val_dic)   
            employer_deduction_amount = [] 
            if list_value_employer:
                for m in list_value_employer:
                    cur.execute("""select esi_active from esi_value where esi_employee_id = %s and (esi_date_from,esi_date_to) overlaps (%s,%s) and is_active and esi_active""" , (employee_id,str(period_from),str(period_to),))
                    esi_value = q.dictfetchall(cur)
                    if esi_value:
                        if m['contribution_code'] == 'EMRSI': 
                            m['assignment_value'] = round(float(m['assignment_value']) / float(working_days) * float(worked_day))
                            
                        else: 
                           m['assignment_value'] = round(float(m['assignment_value']) )
                    else:
                        if m['contribution_code'] == 'EMRSI': 
                            m['assignment_value'] = 0
                               
                    employer_deduction_amount.append(m)            
            result_data['employer_contribution_details'] = employer_deduction_amount
                      # final_data['salary_details'] = list_value
           # result_data['employer_contribution_data'] = emp_data
            # For the Actual Earnings List Calculation Start
            actual_earning_amount = []
            if Fixed_Earnings_list:
                for s in Fixed_Earnings_list:
                    s['assignment_value'] = round(float(s['assignment_value']) / float(working_days) * float(worked_day))
                    actual_earning_amount.append(s)
            actual_deduction_amount = []  
            if Fixed_Deduction_list:
                for a in Fixed_Deduction_list:
                    cur.execute("""select esi_active from esi_value where esi_employee_id = %s and (esi_date_from,esi_date_to) overlaps (%s,%s) and is_active and esi_active""" , (employee_id,str(period_from),str(period_to),))
                    esi_value = q.dictfetchall(cur)
                    if esi_value:
                        if a['salary_rule_name'] == 'ESI':
                            a['assignment_value'] = round(float(a['assignment_value']) / float(working_days) * float(worked_day))
                        else:                                   
                            a['assignment_value'] =  round(float(a['assignment_value']))
                    else:
                        if a['salary_rule_name'] == 'ESI':
                                a['assignment_value'] = 0
                    actual_deduction_amount.append(a) 
    #         for benefits_value in Fixed_Earnings_Benefits_list:
    #             if benefits_value not in Fixed_Earnings_list:
    #                 actual_earning_amount.append(benefits_value)
            # For PF is Not Applicable 
#             if Fixed_Deduction_list:
#                 for (index, t) in enumerate(Fixed_Deduction_list):
#                     if pf_applicable_result:
#                         if pf_applicable_result[0]['pf_applicable'] == False:
#                             salary_rule_code = "PFPFF"
#                             payslip_select_pf_salary_rule_query = q.fetch_hcms_query(config.payroll_management, config.payslip_select_pf_salary_rule_query)
#                             if payslip_select_pf_salary_rule_query:
#                                 cur.execute(payslip_select_pf_salary_rule_query, (salary_rule_code,))
#                                 pf_salary_rule_result = q.dictfetchall(cur)
#                             if pf_salary_rule_result:
#                                     if pf_salary_rule_result[0]['id'] == t['condition_id']:
#                                         t['assignment_value'] = 0
            # For the Earned Special Allowances Value
            if result_data['fixed_special_allowance_value']:
               earned_special_allowance = round(float(result_data['fixed_special_allowance_value'])  / float(working_days) * float(worked_day))
            else:
                earned_special_allowance = 0.00
            if earned_special_allowance:
                result_data['special_allowance'] = earned_special_allowance   # For the Special Allowance
            result_data['emp_actual_earning_list'] = actual_earning_amount  # For Earned List Amount
            result_data['emp_actual_deduction_list'] = actual_deduction_amount  # For Deduction List Amount
            result_data['tds_amount'] = tds_amount_val
            result_data['arrear_amount'] = arrear_amount_val
            #connection.commit()
            #cur.close()
        else:
            result_data = config.unable_to_create_connection_message
#     except Exception as e:#Exception Block
#         logger_obj.error(e)
#         print"eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",e
#         result_data = e
        #print"**************************************************result_data",result_data
        return HttpResponse(json.dumps(result_data))  # Return the Response

# For Fixed earning calculation 
def fixed_earnings_calculation(result_data, structure_id, employee_id, list_value_earnings, ctc_amount, fixed_basic_amount_value, lop_days, earned_basic_amount_value):
    ''' 
        17-May-2018 VJY To HR Payroll Payslip page loaded. And also check the user authentication
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
        @author: VJY
    '''
    try:
        logger_obj.info("Payslip Structure Salary Rule Function")
        cr = connection.cursor()
        if cr: 
            # Query For Getting the Payslip Details Based on the Rule Structure and Contract
            earnings_payslip_structure_salary_rule = q.fetch_hcms_query(config.payroll_management, config.earnings_payslip_structure_salary_rule)
            if earnings_payslip_structure_salary_rule:
                cr.execute(earnings_payslip_structure_salary_rule, (structure_id, employee_id,))
                earnings_result = q.dictfetchall(cr)
                for i in earnings_result:
                    val_dic = {}
                    validation = i['salary_rule_validation_code']
                    contribution_id = i['contribution_id_id']
                    condition_id = i['rule_condition_id']
                    contributor = ''
                    if contribution_id:
                        contributor = common_check_contributor(contribution_id)
                    # For the Fixed Amount Calculation Only For the Employee
                    if contributor != 'Employer':
                        # For Common Function of Salary Rule Execution
                        list_value_earnings = common_salary_rule_function(result_data, i, val_dic, validation, contribution_id, condition_id, list_value_earnings, ctc_amount, fixed_basic_amount_value, lop_days, earned_basic_amount_value)
    except Exception as e:#Exception Block
        logger_obj.error(e)
        result = e    
    return list_value_earnings
    
    
# For Common validation and Value Assignment Functionality
def common_salary_rule_function(result_data, i, val_dic, validation, contribution_id, condition_id, list_value, ctc_amount, fixed_basic_amount_value, lop_days, earned_basic_amount_value):
    ''' 
        17-May-2018 VIJ To HR Payroll Payslip page loaded. And also check the user authentication
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
        @author: VIJ
    '''
    try:
        logger_obj.info("Common Salary Rule Function")
        if validation:
            validation_condition = ''
            # For CTC in Salary Rule Validation Code
            validation_condition = common_replace_code(result_data,i, validation_condition, validation, ctc_amount, fixed_basic_amount_value, lop_days, earned_basic_amount_value)
        # If No validation
        else:
            validation_condition = ''
        # If Validation Condition
        if validation_condition:
            if "%" in validation_condition:  # For Find the % in Original String
                validation_condition = validation_condition.replace("%", "/ 100.0 * ")
                validation_condition = eval(str(validation_condition))  # For Replacing % as * and Divide By 100
            else:
                validation_condition = eval(validation_condition)
        if validation_condition:
            if i['cal_type_code'] == "NUMBR":
                val_dic['assignment_value'] = round(float(i['salary_rule_value_assignment']))
            else:
                # Check the Assignment Value 
                if i['salary_rule_value_assignment_code']:
                    assignment_value = i['salary_rule_value_assignment_code']
                    if assignment_value:
                        # For Replacing the BASIC Code to as Basic Amount
                        # For CTC in Salary Rule Validation Code
                        assignment_value = common_replace_code(result_data,i, assignment_value, assignment_value, ctc_amount, fixed_basic_amount_value, lop_days, earned_basic_amount_value)
                        if "%" in assignment_value:  # For Find the % in Original String
                            assignment_value = eval(assignment_value.replace("%", "/ 100.0 * "))  # For Replacing % as * and Divide By 100
                            val_dic['assignment_value'] = round(eval(str(assignment_value)))
                        else:
                           val_dic['assignment_value'] = round(eval(assignment_value))
                    else:
                        val_dic['assignment_value'] = ''
                # Else the Assignment Value not Given
                else:
                    val_dic['assignment_value'] = validation_condition
            if 'rule_code' in i:
                val_dic['rule_category_code'] = i['rule_code']
            elif i['refitems_name']=='Earnings':
                val_dic['rule_category_code'] = "ALLWC"
            else:
                val_dic['rule_category_code'] = ''
            val_dic['refitems_name'] = i['refitems_name']
            if contribution_id:  # For the Employee Contribution Display the Text
                   val_dic['salary_rule_name'] = i['salary_rule_name'] 
            else:
                val_dic['salary_rule_name'] = i['salary_rule_name']
            val_dic['condition_id'] = condition_id
            # If Avoiding Same Value For Allowance and Deduction Details
            val_dic = common_delete_same_value(list_value, val_dic)
            list_value.append(val_dic)
        # If No Validation Only Assignment Value
        elif i['salary_rule_validation_code'] == '':
            if i['cal_type_code'] == "NUMBR":
                val_dic['assignment_value'] = round(float(i['salary_rule_value_assignment']))
            else:
                # Check the Assignment Value 
                if i['salary_rule_value_assignment_code']:
                    assignment_value = i['salary_rule_value_assignment_code']
                    if assignment_value:
                        # For Replacing the BASIC Code to as Basic Amount
                        # For CTC in Salary Rule Validation Code
                        assignment_value = common_replace_code(result_data,i, assignment_value, assignment_value, ctc_amount, fixed_basic_amount_value, lop_days, earned_basic_amount_value)
                        if "%" in assignment_value:  # For Find the % in Original String
                            assignment_value = eval(assignment_value.replace("%", "/ 100.0 * "))  # For Replacing % as * and Divide By 100
                            val_dic['assignment_value'] = round(eval(str(assignment_value)))
                        else:
                           val_dic['assignment_value'] = round(float(eval(assignment_value)))
                    else:
                        val_dic['assignment_value'] = ''
                # Else the Assignment Value not Given
                else:
                    val_dic['assignment_value'] = validation_condition
            val_dic['refitems_name'] = i['refitems_name']
            if  'rule_code' in i:
                val_dic['rule_category_code'] = i['rule_code']
            elif i['refitems_name']=='Earnings':
                val_dic['rule_category_code'] = "ALLWC"
            else:
                val_dic['rule_category_code'] = ''
            val_dic['salary_rule_name'] = i['salary_rule_name']
            val_dic['condition_id'] = condition_id
            # If Avoiding Same Value For Allowance and Deduction Details
            val_dic = common_delete_same_value(list_value, val_dic)
            list_value.append(val_dic)
        else:
            if 'rule_code' in i:
                val_dic['rule_category_code'] = i['rule_code']
            elif i['refitems_name']=='Earnings':
                val_dic['rule_category_code'] = "ALLWC"
            else:
                val_dic['rule_category_code'] = ''
            val_dic['refitems_name'] = i['refitems_name']
            if contribution_id:  # For the Employee Contribution Display the Text
                   val_dic['salary_rule_name'] = i['salary_rule_name'] 
            else:
                val_dic['salary_rule_name'] = i['salary_rule_name']
            val_dic['condition_id'] = condition_id
            val_dic['assignment_value'] = 0.00 
            # If Avoiding Same Value For Allowance and Deduction Details
            val_dic = common_delete_same_value(list_value, val_dic)
            list_value.append(val_dic)
    except Exception as e:#Exception Block
        logger_obj.error(e)
        result = e        
    return list_value    

 # For Replacing the code value in Salary Rule 
def common_replace_code(result_data,i,validation_condition, validation, ctc_amount, fixed_basic_amount_value, lop_days, earned_basic_amount_value):
    ''' 
        17-May-2018 VIJ To HR Payroll Payslip page loaded. And also check the user authentication
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
        @author: VIJ
    '''
    try:
        if "MNCTC" in validation:  # IF Monthly CTC in Validation or Assignment
            validation_condition = validation.replace("MNCTC", str(ctc_amount))
        elif "ENCTC" in validation:  # IF Earned CTC in Validation or Assignment
            validation_condition = validation.replace("ENCTC", str(ctc_amount))
        elif "BASIC" in validation:  # IF Fixed Basic in Validation or Assignment
          validation_condition = validation.replace("BASIC", str(fixed_basic_amount_value))
          if "LOSOP" in validation_condition:  # IF Loss Of pay in validation or assignment
              validation_condition = validation_condition.replace("LOSOP", str(lop_days))
          if "ENBSC" in validation_condition:  # IF Earned basic in validation or assignment
              validation_condition = validation_condition.replace("ENBSC", str(earned_basic_amount_value))
          if "GROSS" in validation_condition:  # IF Fixed gross in validation or assignment
            if result_data['fixed_gross_value'] and i['salary_rule_code']!='INCOM':
                validation_condition = validation.replace("GROSS", str(result_data['fixed_gross_value'])) 
            elif result_data['fixed_gross_benefits_value'] and i['salary_rule_code']=='INCOM' :
                validation_condition = validation.replace("GROSS", str(result_data['fixed_gross_benefits_value'])) 
            else:
                result_data['fixed_gross_benefits_value'] = 0.0
                validation_condition = validation_condition.replace("GROSS", str(result_data['fixed_gross_benefits_value']))
          if "PERSC" in validation_condition:   # IF Performance Score in Validation or assignment
              validation_condition = validation_condition.replace("PERSC", str('7'))
        elif "LOSOP" in validation:  # IF Loss Of pay in validation or assignment
              validation_condition = validation.replace("LOSOP", str(lop_days)) 
        elif "ENBSC" in validation:  # IF Earned basic in validation or assignment
              validation_condition = validation.replace("ENBSC", str(earned_basic_amount_value))  
        elif "GROSS" in validation:  # IF Fixed gross in validation or assignment
            if result_data['fixed_gross_value'] and i['salary_rule_code']!='INCOM':
                validation_condition = validation.replace("GROSS", str(result_data['fixed_gross_value'])) 
            elif result_data['fixed_gross_benefits_value'] and i['salary_rule_code']=='INCOM' :
                validation_condition = validation.replace("GROSS", str(result_data['fixed_gross_benefits_value'])) 
            else:
                result_data['fixed_gross_benefits_value'] = 0.0
                validation_condition = validation_condition.replace("GROSS", str(result_data['fixed_gross_benefits_value']))
        elif "PERSC" in validation:  # IF Performance Score in Validation or assignment
              validation_condition = validation.replace("PERSC", str('7'))  
    except Exception as e:#Exception Block
        result = e          
    return validation_condition

# Delete the Same Salary Rule Value  For Allowance and Deduction Details 
def common_delete_same_value(list_value, val_dic):
    ''' 
        17-May-2018 VIJ To HR Payroll Payslip page loaded. And also check the user authentication
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
        @author: VIJ
    '''
    try:
        count = 0
        for k in list_value:
            if k['salary_rule_name'] == val_dic['salary_rule_name']:
                if k['assignment_value'] > val_dic['assignment_value']:
                    val_dic['assignment_value'] = k['assignment_value']
                    del list_value[count]
                elif k['assignment_value'] < val_dic['assignment_value']:
                    val_dic['assignment_value'] = val_dic['assignment_value']
                    del list_value[count]
                elif k['assignment_value'] == val_dic['assignment_value']:
                    val_dic['assignment_value'] = val_dic['assignment_value']
                    del list_value[count]
            count = count + 1;
    except Exception as e:#Exception Block
        result = e        
    return val_dic

# For the Fixed Gross Salary Calculation    
def fixed_gross_calculation(Fixed_Earnings_list,result_data, emp_fixed_earnings,fixed_ctc_amount, ctc_amount):
    ''' 
        17-May-2018 VIJ To HR Payroll Payslip page loaded. And also check the user authentication
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
        @author: VIJ
    '''
    try:
        logger_obj.info("Fixed Gross Calculation")
        for j in emp_fixed_earnings:
            if j['refitems_name'] == "Earnings":
                Fixed_Earnings_list.append(j) 
        # For Earning Values Addition 
        if fixed_ctc_amount:
            value_total_fixed_earning_amount = 0.00
            for a in Fixed_Earnings_list:
                value_total_fixed_earning_amount = value_total_fixed_earning_amount + float(a['assignment_value'])
        # For the Fixed Special Allowance Calculation
        if value_total_fixed_earning_amount:
            fixed_special_allowance_value = round(ctc_amount - value_total_fixed_earning_amount)
        else:
            fixed_special_allowance_value = 0.00
        # For Total Fixed Gross Values
        if value_total_fixed_earning_amount and fixed_special_allowance_value:
            fixed_gross_value = value_total_fixed_earning_amount + fixed_special_allowance_value
        else:
            fixed_gross_value = 0.00
        result_data['fixed_gross_value'] = fixed_gross_value
        result_data['fixed_special_allowance_value'] = fixed_special_allowance_value
    except Exception as e:#Exception Block
        logger_obj.error(e)
        result = e    
    return result_data

# For Fixed Deduction calculation 
def fixed_deduction_calculation(result_data, structure_id, employee_id, list_value_deduction, ctc_amount, fixed_basic_amount_value, lop_days, earned_basic_amount_value):
    """
        17-May-2018 VIJ To HR Payroll Payslip page loaded. And also check the user authentication
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
        @author: VIJ 
    """
    try:
        logger_obj.info("Fixed Deduction Calculation Function")
        cr = connection.cursor()
        if cr: 
            # Query For Getting the Payslip Details Based on the Rule Structure and Contract
            deduction_payslip_structure_salary_rule = q.fetch_hcms_query(config.payroll_management, config.deduction_payslip_structure_salary_rule)
            if deduction_payslip_structure_salary_rule:
                cr.execute(deduction_payslip_structure_salary_rule, (structure_id, employee_id,))
                deduction_result = q.dictfetchall(cr)
                for k in deduction_result:
                    val_dic = {}
                    validation = k['salary_rule_validation_code']
                    contribution_id = k['contribution_id_id']
                    condition_id = k['rule_condition_id']
                    contributor = ''
                    if contribution_id:
                        contributor = common_check_contributor(contribution_id)
                    # For the Fixed Amount Calculation Only For the Employee
                    if contributor != 'Employer':
                        # For Common Function of Salary Rule Execution
                        list_value_deduction = common_salary_rule_function(result_data, k, val_dic, validation, contribution_id, condition_id, list_value_deduction, ctc_amount, fixed_basic_amount_value, lop_days, earned_basic_amount_value)
    except Exception as e:#Exception Block
        logger_obj.error(e)
        result = e
    return list_value_deduction

# For Checking the Contributor as Employee or Employer
def common_check_contributor(contribution_id):
    """
                Function to fetch the contributor name
                @param request:post request
                @return: json data contains the contributor name
                @rtype: json
                @raise e:Unable to fetch  contributor name or unable to create a database connection 
    """
    try:
        logger_obj.info("Common Check Contributor Function")
        cr = connection.cursor()
        if cr: 
            payslip_contribution_details_query = q.fetch_hcms_query(config.payroll_management, config.payslip_contribution_details_query)
            if payslip_contribution_details_query:
                cr.execute(payslip_contribution_details_query, (contribution_id,))
                result = q.dictfetchall(cr)
                if result[0]['contributor'] == 1:
                     contributor = config.Employee
                else:
                     contributor = config.Employer
    except Exception as e:#Exception Block
        logger_obj.error(e)
        result = e                 
    return contributor    

# For Employee Benefits Calculation
def calculation_of_benefits(result_data, structure_id, employee_id, list_value_earnings, ctc_amount, fixed_basic_amount_value, lop_days, earned_basic_amount_value):
    ''' 
        17-May-2018 VIJ To HR Payroll Payslip page loaded. And also check the user authentication
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
        @author: VIJ
    '''
    try:
        logger_obj.info("Calculation Of Benefits Function")
        cr = connection.cursor()
        if cr: 
            # Query For Getting the Payslip Details Based on the Rule Structure and Contract For Individual Benefits
            payslip_emp_benefit_rule_query = q.fetch_hcms_query(config.payroll_management, config.payslip_emp_benefit_rule_query)
            if payslip_emp_benefit_rule_query:
                cr.execute(payslip_emp_benefit_rule_query, (structure_id, employee_id,))
                benefits_result = q.dictfetchall(cr)
                for l in benefits_result:
                    val_dic = {}
                    validation = l['salary_rule_validation_code']
                    contribution_id = ''
                    condition_id = ''
                    # For Common Function of Salary Rule Execution
                    list_value_earnings = common_salary_rule_function(result_data, l, val_dic, validation, contribution_id, condition_id, list_value_earnings, ctc_amount, fixed_basic_amount_value, lop_days, earned_basic_amount_value)
    except Exception as e:#Exception Block
        logger_obj.error(e)
        result_data = e    
    return list_value_earnings

#  # For the Fixed Gross Salary Calculation with Benefits
def fixed_gross_benefits_calculation(Fixed_Earnings_Benefits_list, result_data, ctc_amount):
    """
                Function to fetch calculation of fixed Gross 
                @param request:post request
                @return: json data contains calculation of fixed Gross
                @rtype: json
                @raise e:Unable to fetch calculation of fixed gross or unable to create a database connection 
    """
    try:
        logger_obj.info("Fixed Gross Benefits Calculation")
        for m in result_data['emp_fixed_earnings_benefits']:
            if m['refitems_name'] == "Earnings":
                Fixed_Earnings_Benefits_list.append(m)
        # For Earning Values Addition 
        if result_data['fixed_ctc_amount']:
            value_total_fixed_earning_benefit_amount = 0.00
            for b in Fixed_Earnings_Benefits_list:
                value_total_fixed_earning_benefit_amount = value_total_fixed_earning_benefit_amount + float(b['assignment_value'])
        # For the Fixed Special Allowance Calculation
        if value_total_fixed_earning_benefit_amount:
            fixed_special_allowance_benefit_value = ctc_amount - value_total_fixed_earning_benefit_amount 
        else:
            fixed_special_allowance_benefit_value = 0.00
        # For Total Fixed Gross Values
        if value_total_fixed_earning_benefit_amount and fixed_special_allowance_benefit_value:
            fixed_gross_benefits_value = value_total_fixed_earning_benefit_amount + fixed_special_allowance_benefit_value
        else:
            fixed_gross_benefits_value = 0.00
        result_data['fixed_gross_benefits_value'] = fixed_gross_benefits_value
        result_data['fixed_special_allowance_benefit_value'] = fixed_special_allowance_benefit_value
    except Exception as e:#Exception Block
        logger_obj.error(e)
        result_data = e
    return result_data 
    
@csrf_exempt
def HRMSCreatePayslip(request): # employee details create function
    ''' 
    26-May-2018 VJY To HRMS Create Payslip function. 
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: VJY
    '''
    try:
        logger_obj.info('Payslip details data insert by'+str(request.user.username))
        json_data = {}
        cur = connection.cursor()
        created_date = format(datetime.datetime.now().strftime ("%Y-%m-%d"))
        modified_date = format(datetime.datetime.now().strftime ("%Y-%m-%d"))
        data_value = request.POST.get(config.datas)   
        #payslip_id = request.POST.get(config.table_id) 
        delete_id = request.POST.get(config.delete_id)
        uid=request.user.id
        if not uid:
            uid = 1
        cur.execute("select name as user_name,id as employee_id from employee_info where related_user_id_id = %s",(uid,)) 
        employee_name = q.dictfetchall(cur)
        if employee_name:
              user_name =  employee_name[0]['user_name']
              employee_id_salary = employee_name[0]['employee_id']
        else:
            user_name = ''    
        if data_value :
                data = json.loads(data_value)
                split_mon = data['payslip_data'][0]['accountingperiod_from'].split('-')[0]
                split_year = int(data['payslip_data'][0]['accountingperiod_from'].split('-')[1])
                if split_mon:
                    pay_month = int(strptime(split_mon,'%b').tm_mon)
                total_days = calendar.monthrange(split_year, pay_month)[1]
                period_from = datetime.date(split_year, pay_month, 1)
                period_to = datetime.date(split_year, pay_month, total_days)
                cur.execute("""select id from hr_payslip where employee_id_id = %s and (accountingperiod_from,accountingperiod_to) overlaps (%s,%s) and is_active""",
                            (data['payslip_data'][0]['employee_id_id'],period_from,period_to,))
                payslip_data = q.dictfetchall(cur)
                cur.execute("""select base_amount from hr_salary_contract  where employee_id_id = %s and ( %s BETWEEN contract_effective_from_date and contract_effective_to_date) and is_active""",
                            (data['payslip_data'][0]['employee_id_id'],period_from,))
                employee_salary = q.dictfetchall(cur)
                if employee_salary:
                    employee_ctc_amount = employee_salary[0]['base_amount']
                else:
                    employee_ctc_amount = ''
                if not payslip_data:
                #if payslip_id == '0': 
                    status = Payslip(employee_id_id = data['payslip_data'][0]['employee_id_id'], name = data['payslip_data'][0]['name'],
                                        salary_structure_id_id = data['payslip_data'][0]['salary_structure_id_id'], accountingperiod_from = period_from,
                                        accountingperiod_to = period_to,worked_days = data['payslip_data'][0]['worked_days'],employee_ctc = employee_ctc_amount,
                                        lop_days = data['payslip_data'][0]['lop_days'],is_active="True",created_by_id=uid)
                    status.save()
                    json_data[config.status_id] = status.id
                    json_data[config.status_key] = config.success_status
                    cur.execute("""insert into payroll_activity_log (user_name,user_id,field_name,form_name,status,created_date,created_by_id,is_active) 
                                values(%s,%s,%s,%s,%s,%s,%s,%s)""",(user_name,uid,data['payslip_data'][0]['name'],'Payslip','create',created_date,uid,'true'))
                else:
                    
                     json_data[config.status_key] = 'NTE-003'  
                        
#                 else:
#                     status = SalaryContract.objects.filter(id=contract_tbl_id).update(company_id_id = data['salary_contract_data'][0]['company_id_id'], department_id_id = data['salary_contract_data'][0]['department_id_id'],
#                                                                                    employee_id_id = data['salary_contract_data'][0]['employee_id_id'], contract_type_id_id = data['salary_contract_data'][0]['contract_type_id_id'],
#                                                   job_title = data['salary_contract_data'][0]['job_title'],salary_structure_id_id = data['salary_contract_data'][0]['salary_structure_id_id'],base_amount = data['salary_contract_data'][0]['base_amount'],base_currency_id = data['salary_contract_data'][0]['base_currency_id']
#                                                   ,contract_effective_from_date = data['salary_contract_data'][0]['contract_effective_from_date'],contract_effective_to_date = data['salary_contract_data'][0]['contract_effective_to_date'],is_active="True")
#                     json_data[config.status_key] = config.update_status                                                           
#                     logger_obj.info('Salary Contract details update response is'+str(json_data)+"attempted by"+str(request.user.username)) 
        else:
            referred_record = record_validation('hr_payslip', delete_id)
            if referred_record == True:
                status =  SalaryContract.objects.filter(id=delete_id).update(is_active="False")
                json_data[config.status_key] = config.remove_status
            elif referred_record == False:
                json_data[config.status_key] = config.record_already_referred                          
    except Exception as e:
            logger_obj.error(e)
            json_data[config.status_key] = e
    return HttpResponse(json.dumps(json_data)) 

@csrf_exempt
def HRMSCreatePayslipLine(request): # Payslip line create function
    ''' 
    26-May-2018 VJY To HRMS Create Payslip Line function. 
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: VJY
    '''
    json_result = {}
    json_data = config.data_empty_key
    post = request.POST
    if post.get(config.employee_id):
        employee_id = post.get(config.employee_id)  # Get json data from post request
    else:
        employee_id = config.data_empty_key
    if post.get(config.payslip_line):
        payslip_line = post.get(config.payslip_line)  # Get json data from post request
    else:
        payslip_line = config.data_empty_key
    if post.get(config.payslip_id):
        payslip_id = post.get(config.payslip_id)  # Get json data from post request
    else:
        payslip_id = config.data_empty_key
    if post.get(config.is_active):
        is_active = post.get(config.is_active)  # Get json data from post request
    else:
        is_active = config.data_empty_key
    try:
        logger_obj.info("Payslip Line Create Function")
        if employee_id and payslip_line and payslip_id:
            payslip_line = json.loads(payslip_line)  # Load the json data
            cr = connection.cursor() 
            if cr:
                if payslip_line:
                    if  payslip_line[config.allowance]:
                        for i in payslip_line[config.allowance]:
                            payslipline_insert_query_record = q.fetch_hcms_query(config.payroll_management, config.payslipline_insert_query_record_key)
                            if payslipline_insert_query_record:
                                #ekm_data_list.update({"base_amount":data['salary_contract_data'][0]['base_amount']})
                                #EKM// amount_value = ekm_process('fb4a04a8b086e06c168d9c1d1fbd9aa9','string',i[config.amount],'encrypt')
				amount_value = i[config.amount]
                                if amount_value == 'None':
                                    amount = ''
                                else: 
                                    amount = amount_value
                                #ekm_data = ekm_process('fb4a04a8b086e06c168d9c1d1fbd9aa9','string',ekm_list_value,'decrypt')
                                if(i[config.name] != ""):
                                    cr.execute(payslipline_insert_query_record, (employee_id, payslip_id, i[config.type], i[config.name], amount, is_active,))
                                    res = cr.fetchall()
                                    json_result[config.status_key] = config.success_status
                                    json_result[config.status_id] = res[0][0]
                    if payslip_line[config.deduction]:
                        for j in payslip_line[config.deduction]:
                            payslipline_insert_query_record = q.fetch_hcms_query(config.payroll_management, config.payslipline_insert_query_record_key)
                            if payslipline_insert_query_record:
                                if(j[config.name] != ""):
                                    #EKM// amount_value = ekm_process('fb4a04a8b086e06c168d9c1d1fbd9aa9','string',j[config.amount],'encrypt')
				    amount_value = j[config.amount]
                                    if amount_value == 'None':
                                        amount = ''
                                    else: 
                                        amount = amount_value
                                    #ekm_data = ekm_process('73b3b0367648ef80ea808d7817dd2781','string',ekm_list_value,'decrypt')
                                    cr.execute(payslipline_insert_query_record, (employee_id, payslip_id, j[config.type], j[config.name], amount, is_active, )) 
                                    res = cr.fetchall()
                                    json_result[config.status_key] = config.success_status
                                    json_result[config.status_id] = res[0][0]
                    if payslip_line[config.employer_contribution]:
                        for k in payslip_line[config.employer_contribution]:
                            payslipline_insert_query_record = q.fetch_hcms_query(config.payroll_management, config.payslipline_insert_query_record_key)
                            if payslipline_insert_query_record:
                                if(k[config.name] != ""):
                                    #EKM// amount_value = ekm_process('fb4a04a8b086e06c168d9c1d1fbd9aa9','string',k[config.amount],'encrypt')
                                    amount_value = k[config.amount]
                                    if amount_value == 'None':
                                        amount = ''
                                    else: 
                                        amount = amount_value
                                    #ekm_data = ekm_process('73b3b0367648ef80ea808d7817dd2781','string',ekm_list_value,'decrypt')
                                    cr.execute(payslipline_insert_query_record, (employee_id, payslip_id, k[config.type], k[config.name], amount, is_active,)) 
                                    res = cr.fetchall()
                                    json_result[config.status_key] = config.success_status
                                    json_result[config.status_id] = res[0][0]
                connection.commit() 
                cr.close()  # close database connection
            else:
                json_result[config.status_key] = config.unable_to_create_connection_message
                 
        else:
            json_result[config.status_key] = config.nodata_passed_message
    except Exception as e:  
        logger_obj.error(e)
        json_result[config.status_key] = e
    return HttpResponse(json.dumps(json_result))  # return the  http response 

# Payslip Table View Query 
@csrf_exempt
def PayslipTableView(request):
    ''' 
    26-May-2018 VJY To HRMS Create Payslip Line function. 
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: VJY
    '''
    try:  # Try Block
        cr = connection.cursor()
        if cr: 
            #post = request.POST
           # id = post.get(config.table_id_key)  # Get the Table ID
            result = {}
    #             if id:
    #                 payslip_select_record_query = query.fetch_query(config.payslip, config.payslip_select_particular_all_record_key)
    #                 if payslip_select_record_query:
    #                     cr.execute(payslip_select_record_query, (id,))
    #                 result = common_controller.dictfetchall(cr)
    #             else:
            payslip_all_query = q.fetch_hcms_query(config.payroll_management, config.payslip_select_all_record_key)
            if payslip_all_query:
                cr.execute(payslip_all_query)
                result = q.dictfetchall(cr)
        else:
            result = config.unable_to_create_connection_message
    except Exception as e:  # Exception Block
        result = e
    return HttpResponse(json.dumps(result))  # Return the Response

# Payslip Table View Button Functionality 
@csrf_exempt
def PayslipViewButton(request):
    ''' 
    26-May-2018 VJY To HRMS Create Payslip Line function. 
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: VJY
    '''
    try:  # Try Block
        logger_obj.info("Payslip View Button Function")
        cr = connection.cursor()
        if cr: 
            post = request.POST
            id = json.loads(post.get(config.payslip_id))  # Get the Table ID
            result = {}
            if id:
                for i in id:
                    # For the Details of the payslip
                    payslip_line_details_query_record = q.fetch_hcms_query(config.payroll_management, config.payslip_line_details_query_record)
                    if payslip_line_details_query_record:
                        cr.execute(payslip_line_details_query_record, (i,))
                    #result[config.payslip_details] = q.dictfetchall(cr)
                    data = q.dictfetchall(cr)
                    for j in data:
                        logger_obj.info("EkM process for CTC Amount in payslip")
                        #EKM// ekm_data = float(ekm_process('73b3b0367648ef80ea808d7817dd2781','string',j['amount'],'decrypt'))
			ekm_data = float(j['amount'])
                        #ekm_data = '18750'
                        j['amount'] = ekm_data
                    result[config.payslip_details] = data
                    # For the Details of the Employee Benefits
                    payslip_view_button_query_record = q.fetch_hcms_query(config.payroll_management, config.payslip_view_button_query_record)
                    if payslip_view_button_query_record:
                        cr.execute(payslip_view_button_query_record, (i,))
                    result[config.payslip_emp_details] = q.dictfetchall(cr)
                    # To View the Payment Advice Details
                    paymentadvice_query_record = q.fetch_hcms_query(config.payroll_management, config.paymentadvice_query_record)
                    if paymentadvice_query_record:
                        cr.execute(paymentadvice_query_record, (i,))
                    result[config.payment_advice_details] = q.dictfetchall(cr)
                    # To View the Details of the company 
                    company_details_payslipview_query_record = q.fetch_hcms_query(config.payroll_management, config.company_details_payslipview_query_record)
                    if company_details_payslipview_query_record:
                        cr.execute(company_details_payslipview_query_record, (i,))
                    result[config.company_details] = q.dictfetchall(cr)
        else:
            result = config.unable_to_create_connection_message
    except Exception as e:  # Exception Block
        logger_obj.error(e)
        result = e
    return HttpResponse(json.dumps(result))  # Return the Response

@csrf_exempt 
def PayslipPrint(request):
    #try:#Try Block
       logger_obj.info("Payslip Print Functionality")
       cr = connection.cursor()
       if cr: 
           created_date = format(datetime.datetime.now().strftime ("%Y-%m-%d"))
           uid=request.user.id
           if not uid:
               uid = 1
           report_date = datetime.datetime.now()
           file_date = report_date.strftime("%Y-%m-%d %H:%m:%S.%f")[:-3]
           post = request.POST
           payslip_id = json.loads(post.get(config.payslip_id))  # Get the Employee ID
           # structure_id = post.get(config.structure_id)#Get the Structure ID
           result_data = {}
           print_data = []
           ctc_amount = ''
           worked_ctc_amount = ''
           basic_amount_value = ''
           value_total_fixed_earning_amount = 0
           allowance_value = 0
           earned_special_allowance = 0
           leave_travel_value = 0
           tds_amount_data = 0
           lop_days = 0
           
           # For CTC Amount Calculation Based on the Worked Days
           # Query For Basic Amount Based on the Employeee From Salary Structure
           select_payslip_data_record = q.fetch_hcms_query(config.payroll_management, config.select_payslip_data)
           if select_payslip_data_record:
                    cr.execute(select_payslip_data_record, (tuple(payslip_id),))
                    employee_data = q.dictfetchall(cr)
                    if employee_data:
                       for i in employee_data:
                           total_lvr_value = 0
                           total_tl_value = 0.0
                           total_ld_percentage = 0.0
                           leadership_basic_percentage = 0.0
                           leadership_total_percentage = 0.0
                           leadership_slab_value = 0.0
                           project_variance_value = 0
                           mentor_value = 0
                           esi_ctc_amount = 0
                           arrear_amount_val = 0
                           perform_bonus_amount_val = 0
                           variable_bonus = 0
                           variable_amount = 0
                           total_lvr_amount = 0
                           total_pvr_value = 0
                           lvr_ctc = 0
                           pro_variance_per = 0
                           mentor_per = 0
                           tot_employer_ded_pdf = 0
                           total_yr_earnings = 0
                           total_yr_deductions = 0
                           esi_deduction_value = 0
                           total_leader_per = 0
                           final_data = {}
                           final_data_value = {}
                           employee_id = i['employee_id_id']
                           structure_id = i['salary_structure_id_id']
                           period_from = i['accountingperiod_from']  # Get the Table Id
                           period_to = i['accountingperiod_to']
                           payslip_table_id = i['id']
                           result_rating = {}
                           total_earnings_pdf = 0.0
                           total_deductions_pdf = 0.0
                           employer_ded_pdf = 0
                           if period_from:
                               date_list = []
                               start_date = datetime.date(datetime.datetime.strptime(period_from, '%m/%d/%Y').year, datetime.datetime.strptime(period_from, '%m/%d/%Y').month, datetime.datetime.strptime(period_from, '%m/%d/%Y').day)
                               year_mon_date  = datetime.datetime.strptime(period_from, '%m/%d/%Y').strftime('%Y-%m')
                               process_year_val = datetime.datetime.strptime(period_from, '%m/%d/%Y').strftime('%Y')
                               date_list.append(year_mon_date)
                               monthy_rating_date = start_date - dateutil.relativedelta.relativedelta(months=1)
                               rating_mon_date  = datetime.datetime.strptime(str(monthy_rating_date), '%Y-%m-%d').strftime('%Y-%m')
                               date_list.append(rating_mon_date)
                               datem = datetime.datetime.strptime(str(period_from), "%m/%d/%Y").strftime('%Y-%B-%d')
                               if datem:
                                    date_split = datem.split("-")
                                    sp_mon = date_split[1]
                                    sp_yr = date_split[0]
                               #d2 = year_mon_date.replace(month=year_mon_date.month-1)
                           else:
                               start_date = ''
                               year_mon_date = ''
                           if period_to:
                               end_date = datetime.date(datetime.datetime.strptime(period_to, '%m/%d/%Y').year, datetime.datetime.strptime(period_to, '%m/%d/%Y').month, datetime.datetime.strptime(period_to, '%m/%d/%Y').day)
                           else:
                               end_date = ''
                           if start_date and end_date:
                               total_working_days = end_date - start_date
                           else:
                               total_working_days = ''
                           if total_working_days:
                               working_days = total_working_days.days + 1
                           else:
                               working_days = ''
                           worked_day = i['worked_days']
                           
                           
                           cr.execute("""select worked_days from hr_payslip where accountingperiod_from >= %s and accountingperiod_to <= %s and employee_id_id = %s order by id desc limit 1""",(period_from,period_to,employee_id,))
                           worked_data = q.dictfetchall(cr) 
                           if worked_data:
                               worked_day = worked_data[0]['worked_days']
                           else:    
                               worked_day = 0
                           cr.execute("""select COALESCE(sum(leave.number_of_days),0) as lop from leave_info leave
                            inner join reference_items ref_items on ref_items.id=leave.type_id_id       
                            where from_date::date >= %s and to_date::date <= %s and leave_employee_id_id = %s and leave.state_id=119  
                              and ref_items.refitems_name='Leave of Absence'""",(period_from,period_to,employee_id,))
                           leave_data = q.dictfetchall(cr) 
                           if leave_data:
                               lop_days = leave_data[0]['lop']
                           #if worked_day:
                                  #worked_day = float(working_days) -  lop_days 
                           
                           select_payslip_company_details_record = q.fetch_hcms_query(config.payroll_management, config.select_payslip_company_details)
                           if select_payslip_company_details_record:
                               cr.execute(select_payslip_company_details_record % (employee_id))
                               company_data_val = q.dictfetchall(cr)
                           cr.execute("""select tds_amount from hr_tds  where tds_employee_id = %s  and (tds_from_date,tds_to_date) overlaps (%s,%s) and is_active = 'True' """ , (employee_id,str(period_from),str(period_to),))    
                           tds_details = q.dictfetchall(cr)
                           if tds_details:
                               tds_amount_data = float(tds_details[0]['tds_amount'])
                           else:
                                tds_amount_data = 0   
                           cr.execute("""select arrear_amount,reference_items.refitems_code from hr_arrear_amount
                                 inner join reference_items on reference_items.id = hr_arrear_amount.arrear_type_id
                                 where arrear_employee_id = %s and hr_arrear_amount.is_active and (hr_arrear_amount.arrear_from_date,hr_arrear_amount.arrear_to_date) overlaps (%s,%s) """ , (employee_id,str(period_from),str(period_to),))
                           arrear_details = q.dictfetchall(cr)
                           if arrear_details:
                                for a in arrear_details:
                                    if a['refitems_code'] == 'ARRER':
                                        arrear_amount_val = arrear_details[0]['arrear_amount'] 
                                    elif a['refitems_code'] == 'PERBS':
                                        perform_bonus_amount_val = arrear_details[0]['arrear_amount']
                                    elif a['refitems_code'] == 'VARPY':
                                        variable_bonus = arrear_details[0]['arrear_amount']    
                           select_payslip_details_record = q.fetch_hcms_query(config.payroll_management, config.select_payslip_details)
                           if select_payslip_details_record:
                               cr.execute(select_payslip_details_record % (employee_id,payslip_table_id))
                               employee_data_val = q.dictfetchall(cr)
                               cr.execute("""select rfitms.refitems_name as bank_name,hrpa.account_no,hrpa.ifsc_code,hrpa.branch_name,
                                        hrcin.name as company_name,hrpa.pf_number,hrcin.address1 as company_address,rfitms1.refitems_code as payment_code from hr_payment_advices hrpa
                                        inner join organization_info hrcin on hrpa.company_id_id = hrcin.id 
                                        left join reference_items rfitms on rfitms.id = hrpa.bank_name_id
                                        left join reference_items rfitms1 on rfitms1.id = hrpa.payment_mode_id
                                        where hrpa.employee_id_id = %s and hrpa.is_active = 'true' """ % (employee_id))
                               payment_details = q.dictfetchall(cr)
                           # employee_name=employee_name[0]['employee_name']
                           payslip_emp_fixed_monthly_ctc_amount_query = q.fetch_hcms_query(config.payroll_management, config.payslip_emp_fixed_monthly_ctc_amount_query)
                           if payslip_emp_fixed_monthly_ctc_amount_query:
                               cr.execute(payslip_emp_fixed_monthly_ctc_amount_query, (employee_id,start_date,))
                               basic_amount = q.dictfetchall(cr)
                               if basic_amount:
                                   logger_obj.info("EkM process for CTC Amount in payslip calculation")
                                   print"EK_____________________",basic_amount[0]['base_amount']
                                   #EKM// ctc_amount = float(ekm_process('fb4a04a8b086e06c168d9c1d1fbd9aa9','string',basic_amount[0]['base_amount'],'decrypt'))#basic_amount[0]['base_amount']
				   ctc_amount = float(basic_amount[0]['base_amount'])
                           if ctc_amount and working_days and worked_day:
                               if working_days > 0:
                                   one_day_salary = ctc_amount / float(working_days)
                               else:
                                   one_day_salary = 0.00
                               if worked_day > 0:
                                   worked_ctc_amount = one_day_salary * float(worked_day)
                               else:
                                   worked_ctc_amount = 0.00
                           #variable pay calculation 
                           cr.execute("""select hrprd.user_id from hr_performance_rating_details hrprd
                                     inner join employee_info emp on emp.related_user_id_id = hrprd.user_id
                                     where emp.id = %s and emp.is_active """ % (employee_id))
                           rating_user_id_details = q.dictfetchall(cr)
                           if rating_user_id_details:
                                cr.execute("select variable_return from rating_point  where fixed_return = %s",(ctc_amount,))
                                fixed_amount_data = q.dictfetchall(cr)
                                cr.execute("select opr from hr_performance_rating_details  where user_id = %s and yyyy_mm =  %s",(rating_user_id_details[0]['user_id'],year_mon_date,))
                                variable_data = q.dictfetchall(cr)
                                cr.execute("""select opr,process,process_year from hr_performance_rating_details where user_id = %s and process_year = %s and yyyy_mm= %s""",(rating_user_id_details[0]['user_id'],process_year_val,year_mon_date,))
                                rating_chart_data = q.dictfetchall(cr)
                                if rating_chart_data:
                                    rating_mon_list = []
                                    rating_individual_per = []
                                    for a in rating_chart_data:
                                        rating_mon  = datetime.datetime.strptime(a['process'], '%Y-%m-%d').strftime('%b')
                                        rating_mon_list.append(rating_mon)
                                        rating_individual_per.append(a['opr'])
                                        
                                    height = rating_individual_per
                                    bars = tuple(rating_mon_list)
                                    y_pos = np.arange(len(bars)) 
    #                                 fig = plt.figure()
    #                                 fig.set_figheight(2)
    #                                 fig.set_figwidth(7)
                                    plt.bar(y_pos, height, 0.25,align='center',alpha = 0.5,color=['#57c4ff'],linewidth=0)
                                    plt.xticks(y_pos, bars,rotation=30,fontsize=15, fontweight='bold')
                                    
                                    x = np.linspace(0, 2*np.pi, 100)
                                    y = np.sin(x)
                                    ax = plt.subplot(111)
                                    #ax.plot(x, y)
                                    ax.spines['right'].set_visible(False)
                                    ax.spines['top'].set_visible(False)
                                    ax.yaxis.set_ticks_position('left')
                                    ax.xaxis.set_ticks_position('bottom')
                                    #plt.xticks(y_pos, bars, fontsize=10, rotation=30, fontweight='bold')
                                     
                                    for a,b in zip(y_pos, rating_individual_per):
                                        if float(b) != 0:
                                            plt.text(a, float(b)-5, str(round(float(b),2))+'%', color='black', fontweight='bold',rotation=90)
                                          
                                    file_date_replace = file_date.replace(' ', '_')
                                    month_image_name = '/home/nextaps/.hcms/uploads/payslip_images/mon_rating_chart_'+str(employee_id)+'_'+file_date_replace+''
                                    plt.savefig(month_image_name, dpi=600, format='png', bbox_inches='tight')
                                    plt.close()
                                
                                    final_data_value['month_image_name'] = month_image_name
                                if variable_data and fixed_amount_data:
                                    mon_variable_amount = 0
                                    percentage_divide = float(variable_data[0]['opr']) * float(fixed_amount_data[0]['variable_return']) /100
                                     #variable_amount = (float(percentage_divide) * ctc_amount / 100)
                                    variable_amount = (float("{0:.1f}".format(percentage_divide)) * ctc_amount / 100)
                                    final_data_value['variable_amount'] = variable_amount
                                    if rating_chart_data:
                                        count = 0
                                        variable_amount_list = []
                                        basic_amount_list = []
                                        for b in rating_chart_data: 
                                            mon_variable_amount = float(b['opr']) * float(fixed_amount_data[0]['variable_return']) /100
                                            variable_amount_bvr = (float("{0:.1f}".format(mon_variable_amount)) * ctc_amount / 100)
                                            variable_amount_list.append(variable_amount_bvr)
                                            basic_amount_list.append(ctc_amount)
                                            count = count + 1
                                    if 1:
                                            if 1:
                                                index=rating_mon_list
                                                team_performance = basic_amount_list
                                                individual_performance = variable_amount_list
                                                df = pd.DataFrame({'Basic Pay': team_performance,
                                                    'Variable Pay': individual_performance}, index=index)
                                                axes = df.plot.bar(rot=0,color=['#eea4d5', '#2ce7c8'],linewidth=0)
                                                axes.set_ylim(bottom=None, top=None, emit=True, auto=False, ymin=None, ymax=None)
                                                #axes.set_ylim(0,0)
                                                axes.set_xticklabels(index,rotation='vertical')
                                                totals = []
                                                ax = plt.subplot(111)
                                #ax.plot(x, y)
                                                ax.spines['right'].set_visible(False)
                                                ax.spines['top'].set_visible(False)
                                                ax.yaxis.set_ticks_position('left')
                                                ax.xaxis.set_ticks_position('bottom')
                                                # find the values and append to list
                                                for i in axes.patches:
                                                    totals.append(i.get_height())
                                
                                                # set individual bar lables using above list
                                                total = sum(totals)
                                                for i in axes.patches:
                                                    # get_x pulls left or right; get_height pushes up or down
                                                    axes.text(i.get_x()+0.09, i.get_height()-1000, \
                                                            str(round(i.get_height(),2)), fontsize=15,
                                                                color='black',rotation=90, fontweight='bold')
                                    axes.legend(loc='upper center', bbox_to_anchor=(0.5, -0.10),
                                          fancybox=True, ncol=5)
                                    file_date_replace = file_date.replace(' ', '_')
                                    bvr_image_name = '/home/nextaps/.hcms/uploads/payslip_images/bvr_chart_'+str(employee_id)+'_'+file_date_replace+''
                                    plt.savefig(bvr_image_name, dpi=600, format='png', bbox_inches='tight')
                                    plt.close()
                                    final_data_value['bvr_image_name'] = bvr_image_name
                                else:
                                   final_data_value['variable_amount'] = 0     
                           else:
                                final_data_value['variable_amount'] = 0
                                     
                           if start_date and end_date and employee_id:
                                lvr_period_mon = start_date.month
                                count = 0
                                if  lvr_period_mon == 3 or lvr_period_mon == 6 or lvr_period_mon == 10:
                                    for a in range(3): 
                                       total_lvr_value = 0
                                       total_tl_value = 0.0
                                       total_ld_percentage = 0.0
                                       leadership_basic_percentage = 0.0
                                       leadership_total_percentage = 0.0
                                       leadership_slab_value = 0.0
                                       project_variance_value = 0
                                       mentor_value = 0
                                       total_lvr_value = 0
                                       now = datetime.datetime.now()
                                       cur_day = datetime.date(now.year, now.month, 1)
                                       last_month = now.month #if now.month > 1 else 12
                                        
                                       today =  start_date
                                        #dateutil.relativedelta.relativedelta(months=-1)
                                       last_month = today - dateutil.relativedelta.relativedelta(months = count)
                                        #print '0000000000000000----------------',  (last_month),count
                                       lvr_month  = datetime.datetime.strptime(str(last_month), '%Y-%m-%d').strftime('%Y-%m')  
                                       cr.execute("""select opr as overall_rating,user_id from hr_performance_rating_year_details hrprd
                                        inner join employee_info emp on emp.related_user_id_id = hrprd.user_id
                                        where emp.id = %s and emp.is_active and hrprd.yyyy_mm = %s  """,(employee_id,lvr_month,))
                                       performance_data = q.dictfetchall(cr)
                                       if performance_data:
                                            overall_rating_val = performance_data[0]['overall_rating']
                                            cr.execute("select id,minimum_range,fixed_return,slab_title,variable_return from rating_point where is_active order by id ")
                                            range_data = q.dictfetchall(cr)  
                                            if range_data:
                                                for i in range_data:
                                                    if float(overall_rating_val) >= float(i['minimum_range']):
                                                        result_rating['slab_id'] = i['id']
                                                        result_rating['slab_title'] = i['slab_title']
                                                        lvr_max_per = i['variable_return']
                                                        break 
                                       if result_rating:
                                             if result_rating['slab_title'] == 'H1' or result_rating['slab_title'] == 'H2':
                                                lvr_ctc = lvr_max_per * ctc_amount / 100       
                               #leadership value return calculation for technical,functional,ontime,quality
                                       cr.execute("""select tl as technical,fl as functional,od as ontime_delivery,cs as customer  from hr_performance_rating_details 
                                            inner join employee_info on employee_info.related_user_id_id = hr_performance_rating_details.user_id
                                            where employee_info.id = %s and yyyy_mm = %s """ , (employee_id,str(lvr_month),))
                                       leadership_details = q.dictfetchall(cr)
                                        
                                       if leadership_details:
                                            fl = leadership_details[0]['functional']
                                            tl = leadership_details[0]['technical']
                                            otd = leadership_details[0]['ontime_delivery']
                                            cs = leadership_details[0]['customer']
                                            total_tl_value = float(fl) + float(tl) +float(otd) +float(cs)
                                            if total_tl_value:
                                                total_ld_percentage = float("{0:.1f}".format(total_tl_value)) / 4
                                                total_leader_per = total_ld_percentage / 2
                                            else:
                                                total_ld_percentage = 0
                                                total_leader_per = 0
                                                #if total_ld_percentage :
                                                    #leadership_basic_percentage = float("{0:.1f}".format(total_ld_percentage)) * 5 / 100  
                                                    
                                        #  leadership_total_percentage calculation          
                                       if total_ld_percentage and lvr_ctc:
                                            leadership_total_percentage =  total_ld_percentage * lvr_ctc / 100     
                                        # Leadership value return slab calculation            
#                                        cr.execute("""select value_return from leadership_value_return where id in  ( select id from rating_point where fixed_return = %s ) """ , (ctc_amount,))
#                                        leadership_value = q.dictfetchall(cr) 
#                                        if leadership_value:
#                                             leadership_slab_value = float(leadership_value[0]['value_return']) * ctc_amount / 100    
                                        #  Leadership value return project details calculation   
                                       cr.execute("""select variance_status from hr_project_variance_details where user_id in 
                                            (select user_id from hr_performance_rating_details
                                            inner join employee_info on employee_info.related_user_id_id = hr_performance_rating_details.user_id 
                                            where employee_info.id = %s and employee_info.is_active) 
                                            and hr_project_variance_details.yyyy_mm = %s""" , (employee_id,lvr_month,))
                                       leadership_project_details = q.dictfetchall(cr)
                                       if leadership_project_details:
                                            if int(leadership_project_details[0]['variance_status']) != 0:
                                                project_variance_value = 100 * lvr_ctc / 100
                                                pro_variance_per = 50
                                            else:
                                                project_variance_value = 0
                                                pro_variance_per = 0
                                        
                                        #leadership value return calculation for technical,functional,ontime,quality
                                       cr.execute("""select mentor_value from hr_attain_trainee_details 
                                            inner join employee_info on employee_info.related_user_id_id = hr_attain_trainee_details.user_id
                                            where employee_info.id = %s and attain_yyyy_mm = %s """ , (employee_id,str(year_mon_date),))
                                       attain_details = q.dictfetchall(cr)
                                       if attain_details:
                                            mentor_value = float(attain_details[0]['mentor_value']) * lvr_ctc / 100 
                                            mentor_per =  attain_details[0]['mentor_value']
                                       total_lvr_value = leadership_total_percentage + project_variance_value + mentor_value
                                       count = count + 1
                                       total_lvr_amount =  total_lvr_amount + total_lvr_value

                                    if total_lvr_amount > 0:
                                        data = [total_leader_per,
                                                  pro_variance_per,
                                                  mentor_per
                                                  ]
                                        labels = ['Leadership','Assurance','Mentor']
    
                                        
                                        plt.pie(data, autopct='%1.1f%%',colors=['#eea4d5','#ffbeaa','#6aeed7'])
                                        plt.axis('equal')
                                        leg = plt.legend(labels=labels,bbox_to_anchor=(1, 1), loc=2, borderaxespad=0,frameon=False)
                                        #leg.get_frame().set_edgecolor('w')
                                        file_date_replace = file_date.replace(' ', '_')
                                        lvr_image_name = '/home/nextaps/.hcms/uploads/payslip_images/lvr_rating_chart_'+str(employee_id)+'_'+file_date_replace+''
                                        plt.savefig(lvr_image_name, dpi=600, format='png', bbox_inches='tight')
                                        plt.close()
                                        final_data_value['lvr_image_name'] = lvr_image_name
                           final_data_value['lvr_value'] = round(total_lvr_amount) 
                           if start_date and end_date and employee_id:
                                pvr_period_mon = start_date.month
                                pvr_count = 0
                                pvr_date_list = []
                                if pvr_period_mon == 3 or pvr_period_mon == 6 or pvr_period_mon == 10:
                                    for a in range(3): 
                                        total_pvr_value = 0
                                        now = datetime.datetime.now()
                                        cur_day = datetime.date(now.year, now.month, 1)
                                        last_month = now.month #if now.month > 1 else 12
                                        today =  start_date
                                        #dateutil.relativedelta.relativedelta(months=-1)
                                        last_month = today - dateutil.relativedelta.relativedelta(months = pvr_count)
                                        #print '0000000000000000----------------',  (last_month),count
                                        pvr_month  = datetime.datetime.strptime(str(last_month), '%Y-%m-%d').strftime('%Y-%m')
                                        pvr_count += 1
                                        pvr_date_list.append(pvr_month)
                                    print"******************************************************pvr_month",pvr_date_list,employee_id
                                    cr.execute("""select project_id,project_name,sum(contribution_percent)as total_contribution,current_value,pvr_value from pvr_project_rating   inner  join pvr_product_details on pvr_project_rating.project_id = pvr_product_details.product_project_id
                                    inner join employee_info on employee_info.related_user_id_id = pvr_project_rating.employee_id
                                    where employee_info.id = %s and yyyy_mm in %s
                                    group by project_id,project_name,current_value,pvr_value""",(employee_id,tuple(pvr_date_list),))
                                    pvr_percent_data_count = q.dictfetchall(cr)
                                    print"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",pvr_percent_data_count
                                    if pvr_percent_data_count:
                                        for b in pvr_percent_data_count:
                                            print"cccccccccccccccccccccccccccccc",b['current_value']
                                            if b['current_value']:
                                                hcms_product_value = b['current_value']
                                                product_percent = 30
                                                product_bonuce_value = 30 * float(hcms_product_value) / 100
                                            else:
                                                hcms_product_value = 0
                                                product_percent = 30
                                                product_bonuce_value = 30 * float(hcms_product_value) / 100
                                                    
                #                     cur.execute("""select pvr_product_type.project_percentage,pvr_project_rating.contribution_percent from pvr_product_type
                #                         inner join pvr_project_rating on pvr_project_rating.project_type_id = pvr_product_type.project_type_id
                #                         where pvr_project_rating.employee_id = %s""",(employee_id,))
                #                     product_type_details = q.dictfetchall(cur)
                                            if product_bonuce_value:
                                                enp_total_contribution = float(b['total_contribution']) / 3
                                                product_type_value = float(b['pvr_value']) * product_bonuce_value / 100
                                                if product_type_value:
                                                    total_pvr_value += enp_total_contribution * product_type_value / 100
                                                    print"&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&total_pvr_value",total_pvr_value
                                    print"+++++++++++++++++++++++++++++++++++++++++++++++++++++++total_pvr_value",total_pvr_value                
                                    final_data_value['pvr_value'] = total_pvr_value
                                else:
                                    final_data_value['pvr_value'] = total_pvr_value
                               
                               
                               
#                                 pvr_period_mon = start_date.month
#                                 pvr_count = 1
#                                 if  pvr_period_mon == 4 or pvr_period_mon == 7 or pvr_period_mon == 10:
#                                     hcms_product_value = 500000
#                                     product_percent = 30
#                                     product_bonuce_value = 30 * 500000 / 100
#                                     cr.execute("""select pvr_product_type.project_percentage,pvr_project_rating.contribution_percent from pvr_product_type
#                                         inner join pvr_project_rating on pvr_project_rating.project_type_id = pvr_product_type.project_type_id
#                                         where pvr_project_rating.employee_id = %s""",(employee_id,))
#                                     product_type_details = q.dictfetchall(cr)
#                                     if product_type_details:
#                                         product_type_value = product_type_details[0]['project_percentage'] * product_bonuce_value / 100
#                                         if product_type_value:
#                                             total_pvr_value = product_type_details[0]['contribution_percent'] * product_type_value / 100
#                                     final_data_value['pvr_value'] = total_pvr_value
#                                 else:
#                                     final_data_value['pvr_value'] = total_pvr_value  
#                            cr.execute("select total_earnings,total_deductions,total_net_salary,mm_yyyy,year from total_year_salary where employee_id_id = %s and year = %s",(employee_id,process_year_val,))   
#                            year_total_salary = q.dictfetchall(cr)
#                            total_earn_yearly = 0
#                            total_ded_yearly = 0
#                            toatal_net_yearly = 0
#                            if year_total_salary:
#                                for v in year_total_salary:
#                                        total_earn_yearly = year_total_salary[0]['total_earnings']
#                                        total_ded_yearly = year_total_salary[0]['total_deductions']
#                                        toatal_net_yearly = year_total_salary[0]['total_net_salary']
#                            rating_mon_list =  ['jan']        
#                            index=rating_mon_list
#                            monthly_net_salary = toatal_net_yearly
#                            monthly_earnings = total_earn_yearly 
#                            monthly_deductions = total_ded_yearly
#                            x = [u'Total Net Salary', u'Total Deductions', u'Total Earnings']
#                            y = [monthly_net_salary, monthly_deductions, monthly_earnings]
#                             
#                            fig, ax = plt.subplots()    
#                            width = 0.75 # the width of the bars 
#                            ind = np.arange(len(y))  # the x locations for the groups
#                            print"===============================================",y
#                            ax.barh(ind, y, width, color=["#6aeed7","#57c4ff","#f8d77a"],align='center')
#                            for i, v in enumerate(y):
#                                ax.text(v + 3, i + (-.00), str(v), color='black', fontweight='bold')
#                            ax.set_yticks(ind+width/60)
#                            ax.set_yticklabels(x, minor=False)
#                            
#                            ax.spines['right'].set_visible(False)
#                            ax.spines['top'].set_visible(False)
#                            ax.yaxis.set_ticks_position('left')
#                            ax.xaxis.set_ticks_position('bottom')
#                             
# 
#                            print"@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"
#                            file_date_replace = file_date.replace(' ', '_')
#                            year_date_image_name = '/home/nextaps/Desktop/payroll_rating/year_date_chart_'+str(employee_id)+'_'+file_date_replace+''
#                            plt.savefig(year_date_image_name, dpi=600, format='png', bbox_inches='tight')
#                            
#                            plt.close()   
#                            final_data_value['year_date_image_name'] = year_date_image_name        
                           
                           # For Basic Amount Calculation Based on the Salary Structure and Employee    
                           if structure_id and employee_id:
                               # Query For Search like Basic and Validation Code
                               payslip_salary_rule_basic_name_query = q.fetch_hcms_query(config.payroll_management, config.payslip_salary_rule_basic_name)
                               if payslip_salary_rule_basic_name_query:
                                   ilike_value = '%Basic%'  or '%BASIC%' 
                                   cr.execute(payslip_salary_rule_basic_name_query, (ilike_value, structure_id, employee_id,))
                                   result_basic = q.dictfetchall(cr)
                                   # For Replacing the BASIC Code to as Basic Amount
                                   
                                   if result_basic:
                                       for j in result_basic:
                                           if j['salary_rule_validation_code']:
                                               basic_validation_con = j['salary_rule_validation_code'].replace("ENCTC", str(ctc_amount))
                                           else :
                                               basic_validation_con = j['salary_rule_value_assignment_code'].replace("ENCTC", str(ctc_amount))
                                           if "%" in basic_validation_con:  # For Find the % in Original String
                                               basic_validation_con = eval(basic_validation_con.replace("%", "*"))  # For Replacing % as * and Divide By 100
                                               basic_amount_value = eval(str(int(basic_validation_con) / 100))
                                           else:  # If % not in String 
                                               basic_amount_value = eval(basic_validation_con)
                                   else:
                                       basic_amount_value = ''
                                   if result_basic:
                                        for t in result_basic:
                                            if t['salary_rule_validation_code']:
                                                earned_basic_validation_con = t['salary_rule_validation_code'].replace("ENCTC", str(ctc_amount))
                                            else :
                                                earned_basic_validation_con = t['salary_rule_value_assignment_code'].replace("ENCTC", str(ctc_amount))
                                            if "%" in earned_basic_validation_con:  # For Find the % in Original String
                                                earned_basic_validation_con = earned_basic_validation_con.replace("%", "/ 100.0 * ")
                                                earned_basic_amount_value = eval(str(earned_basic_validation_con))  # For Replacing % as * and Divide By 100
                                                if earned_basic_amount_value and working_days and worked_day:
                                                    earned_basic_amount_value = earned_basic_amount_value / float(working_days) * float(worked_day)
                                            else:  # If % not in String 
                                                earned_basic_amount_value = eval(earned_basic_validation_con)
                                                if earned_basic_amount_value and working_days and worked_day:
                                                    earned_basic_amount_value = earned_basic_amount_value / float(working_days) * float(worked_day)
                                   else:
                                        earned_basic_amount_value = ''  
                             # For the PF Applicable For payslip
                           if employee_id:
                                payslip_pf_applicable_query = q.fetch_hcms_query(config.payroll_management, config.payslip_pf_applicable_query)
                                if payslip_pf_applicable_query:
                                    cr.execute(payslip_pf_applicable_query, (employee_id,))
                                    pf_applicable_result = q.dictfetchall(cr)
                           # For Salary Computation Table
                           if structure_id and employee_id and worked_ctc_amount:
                               if int(variable_amount) > 0:
                                    #ctc_amount = 0
                                    esi_ctc_amount = variable_amount + ctc_amount
                               else:  
                                    esi_ctc_amount = 0 + ctc_amount
                               # Query For Getting the Payslip Details Based on the Rule Structure and Contract
                               payslip_structure_salary_rule = q.fetch_hcms_query(config.payroll_management,config.payslip_structure_salary_rule)
                               if payslip_structure_salary_rule:
                                   cr.execute(payslip_structure_salary_rule, (structure_id, employee_id,))
                                   result = q.dictfetchall(cr)
                                   #print"==========================rrrrrrrrrrrrrRRRRRRRRRRRR",result
                                   list_value = []
                                   list_value_employer = []
                                   for i in result:
                                       val_dic = {}
                                       validation = i['salary_rule_validation_code']
                                       contribution_id = i['contribution_id_id']
                                       condition_id = i['rule_condition_id']
                                       contributor = ''
                                       if contribution_id:
                                           payslip_contribution_details_query = q.fetch_hcms_query(config.payroll_management, config.payslip_contribution_details_query)
                                           if payslip_contribution_details_query:
                                               cr.execute(payslip_contribution_details_query, (contribution_id,))
                                               result = q.dictfetchall(cr)
                                               if result[0]['contributor'] == 1:
                                                    contributor = config.Employee
                                               else:
                                                    contributor = config.Employer
                                       # For the Fixed Amount Calculation Only For the Employee
                                       if contributor != 'Employer':
                                           if validation:
                                               # For CTC in Salary Rule Validation Code
                                               if "MNCTC" in validation:
                                                   validation_condition = validation.replace("MNCTC", str(ctc_amount))
                                               elif "ENCTC" in validation:
                                                   validation_condition = validation.replace("ENCTC", str(ctc_amount))
                                               elif "BASIC" in validation:  # IF Basic Salary Rule in Validation Code
                                                   validation_condition = validation.replace("BASIC", str(basic_amount_value))
                                               elif "ENBSC" in validation_condition:  # IF Earned basic in validation or assignment
                                                   validation_condition = validation.replace("ENBSC", str(earned_basic_amount_value))    
                                           # If No validation
                                           else:
                                               validation_condition = ''
                                           # If Validation Condition
                                           if validation_condition:
                                               if "%" in validation_condition:  # For Find the % in Original String
                                                   validation_condition = eval(validation_condition.replace("%", "*"))  # For Replacing % as * and Divide By 100
                                                   validation_condition = eval(str(int(validation_condition) / 100))
                                               else:
                                                   validation_condition = eval(validation_condition)
                                           if validation_condition:
                                               if i['cal_type_code'] == "NUMBR":
                                                   val_dic['assignment_value'] = round(float(i['salary_rule_value_assignment']))
                                               else:
                                                   # Check the Assignment Value 
                                                   if i['salary_rule_value_assignment_code']:
                                                       assignment_value = i['salary_rule_value_assignment_code']
                                                       if assignment_value:
                                                           # For Replacing the BASIC Code to as Basic Amount
                                                           cr.execute("""select esi_active from esi_value where esi_employee_id = %s and (esi_date_from,esi_date_to) overlaps (%s,%s) and is_active and esi_active""" , (employee_id,str(period_from),str(period_to),))
                                                           esi_value = q.dictfetchall(cr)
                                                           # For CTC in Salary Rule Validation Code
                                                           if "MNCTC" in assignment_value:
                                                               assignment_value = assignment_value.replace("MNCTC", str(ctc_amount))
#                                                            elif "ENCTC" in assignment_value:
#                                                                assignment_value = assignment_value.replace("ENCTC", str(ctc_amount))
                                                           elif "BASIC" in assignment_value:  # IF Basic Salary Rule in Validation Code
                                                               assignment_value = assignment_value.replace("BASIC", str(basic_amount_value))
                                                           elif "ENBSC" in assignment_value:  # IF Earned basic in validation or assignment
                                                               assignment_value = assignment_value.replace("ENBSC", str(earned_basic_amount_value)) 
                                                           if esi_value:
                                                               if esi_value[0]['esi_active'] == True and i['salary_rule_name'] == 'ESI':
                                                                   if "ENCTC" in assignment_value:  # IF Earned basic in validation or assignment
                                                                        assignment_value = assignment_value.replace("ENCTC", str(esi_ctc_amount)) 
                                                               else :
                                                                   if "ENCTC" in assignment_value:  # IF Earned basic in validation or assignment
                                                                        assignment_value = assignment_value.replace("ENCTC", str(ctc_amount)) 
                                                           else:
                                                               if "ENCTC" in assignment_value:  # IF Earned basic in validation or assignment
                                                                        assignment_value = assignment_value.replace("ENCTC", str(ctc_amount))       
                                                           if "%" in assignment_value:  # For Find the % in Original String
                                                               assignment_value = eval(assignment_value.replace("%", "*"))  # For Replacing % as * and Divide By 100
                                                               val_dic['assignment_value'] = round(eval(str(float(assignment_value) / 100.0)))
                                                           else:
                                                              val_dic['assignment_value'] = round(float(eval(assignment_value)))
                                                       else:
                                                           val_dic['assignment_value'] = ''
                                                   # Else the Assignment Value not Given
                                                   else:
                                                       val_dic['assignment_value'] = validation_condition
                                               val_dic['refitems_name'] = i['refitems_name']
                                               val_dic['refitem_code'] = i['salary_rule_code']
                                               if contribution_id:  # For the Employee Contribution Display the Text
                                                   val_dic['salary_rule_name'] = i['salary_rule_name'] 
                                               else:
                                                    val_dic['salary_rule_name'] = i['salary_rule_name']
                                               val_dic['condition_id'] = condition_id
                                               # If Avoiding Same Value For Allowance and Deduction Details
                                               count = 0
                                               for k in list_value:
                                                   if k['salary_rule_name'] == val_dic['salary_rule_name']:
                                                       if k['assignment_value'] > val_dic['assignment_value']:
                                                           val_dic['assignment_value'] = k['assignment_value']
                                                           del list_value[count]
                                                       elif k['assignment_value'] < val_dic['assignment_value']:
                                                           val_dic['assignment_value'] = val_dic['assignment_value']
                                                           del list_value[count]
                                                       elif k['assignment_value'] == val_dic['assignment_value']:
                                                           val_dic['assignment_value'] = val_dic['assignment_value']
                                                           del list_value[count]
                                                   count = count + 1;
                                               list_value.append(val_dic)
                                           # If No Validation Only Assignment Value
                                           elif i['salary_rule_validation_code'] == '':
                                               if i['cal_type_code'] == "NUMBR":
                                                       val_dic['assignment_value'] = round(float(i['salary_rule_value_assignment']))
                                               else:
                                                   # Check the Assignment Value 
                                                   if i['salary_rule_value_assignment_code']:
                                                       assignment_value = i['salary_rule_value_assignment_code']
                                                       if assignment_value:
                                                           # For Replacing the BASIC Code to as Basic Amount
                                                           # For CTC in Salary Rule Validation Code
                                                           cr.execute("""select esi_active from esi_value where esi_employee_id = %s and (esi_date_from,esi_date_to) overlaps (%s,%s) and is_active and esi_active""" , (employee_id,str(period_from),str(period_to),))
                                                           esi_value = q.dictfetchall(cr)
                                                           if "MNCTC" in assignment_value:
                                                               assignment_value = assignment_value.replace("MNCTC", str(ctc_amount))
#                                                            elif "ENCTC" in assignment_value:
#                                                                assignment_value = assignment_value.replace("ENCTC", str(ctc_amount))
                                                           elif "BASIC" in assignment_value:  # IF Basic Salary Rule in Validation Code
                                                               assignment_value = assignment_value.replace("BASIC", str(basic_amount_value))
                                                           elif "ENBSC" in assignment_value:  # IF Earned basic in validation or assignment
                                                               assignment_value = assignment_value.replace("ENBSC", str(earned_basic_amount_value))    
                                                           if esi_value:
                                                               if ((esi_value[0]['esi_active'] == True or esi_value[0]['esi_active'] == 'true')) and i['salary_rule_name'] == 'ESI':
                                                                   if "ENCTC" in assignment_value:  # IF Earned basic in validation or assignment
                                                                        assignment_value = assignment_value.replace("ENCTC", str(esi_ctc_amount)) 
                                                               else :
                                                                   if "ENCTC" in assignment_value:  # IF Earned basic in validation or assignment
                                                                        assignment_value = assignment_value.replace("ENCTC", str(ctc_amount)) 
                                                           else:
                                                               if "ENCTC" in assignment_value:  # IF Earned basic in validation or assignment
                                                                        assignment_value = assignment_value.replace("ENCTC", str(ctc_amount))  
                                                           if "%" in assignment_value:  # For Find the % in Original String
                                                               assignment_value = eval(assignment_value.replace("%", "*"))  # For Replacing % as * and Divide By 100
                                                               val_dic['assignment_value'] = round(eval(str(float(assignment_value) / 100.0)))
                                                           else:
                                                              val_dic['assignment_value'] = round(float(eval(assignment_value)))
                                                       else:
                                                           val_dic['assignment_value'] = ''
                                                   # Else the Assignment Value not Given
                                                   else:
                                                       val_dic['assignment_value'] = validation_condition
                                                        
                                               val_dic['refitems_name'] = i['refitems_name']
                                               val_dic['salary_rule_name'] = i['salary_rule_name']
                                               val_dic['refitem_code'] = i['salary_rule_code']
                                               val_dic['condition_id'] = condition_id
                                               # If Avoiding Same Value For Allowance and Deduction Details
                                               if contribution_id:  # For the Employee Contribution Display the Text
                                                   val_dic['salary_rule_name'] = i['salary_rule_name'] 
                                                   cr.execute("select code as contribution_code from hr_contribution_register where id = %s ", (contribution_id,))
                                                   contribution_code_result = q.dictfetchall(cr)
                                                   val_dic['contribution_code'] = contribution_code_result[0]['contribution_code']
                                               else:
                                                    val_dic['salary_rule_name'] = i['salary_rule_name']
                                               count = 0
                                               for k in list_value:
                                                   if k['salary_rule_name'] == val_dic['salary_rule_name']:
                                                       if k['assignment_value'] > val_dic['assignment_value']:
                                                           val_dic['assignment_value'] = k['assignment_value']
                                                           del list_value[count]
                                                       elif k['assignment_value'] < val_dic['assignment_value']:
                                                           val_dic['assignment_value'] = val_dic['assignment_value']
                                                           del list_value[count]
                                                       elif k['assignment_value'] == val_dic['assignment_value']:
                                                           val_dic['assignment_value'] = val_dic['assignment_value']
                                                           del list_value[count]
                                                   count = count + 1;
                                               list_value.append(val_dic)
                                               
                                           else:
                                                val_dic['refitems_name'] = i['refitems_name']
                                                val_dic['refitem_code'] = i['salary_rule_code']
                                                if contribution_id:  # For the Employee Contribution Display the Text
                                                       val_dic['salary_rule_name'] = i['salary_rule_name'] 
                                                else:
                                                    val_dic['salary_rule_name'] = i['salary_rule_name']
                                                val_dic['condition_id'] = condition_id
                                                val_dic['assignment_value'] = 0.00 
                                                # If Avoiding Same Value For Allowance and Deduction Details
                                                count = 0
                                                for k in list_value:
                                                    if k['salary_rule_name'] == val_dic['salary_rule_name']:
                                                        if k['assignment_value'] > val_dic['assignment_value']:
                                                            val_dic['assignment_value'] = k['assignment_value']
                                                            del list_value[count]
                                                        elif k['assignment_value'] < val_dic['assignment_value']:
                                                            val_dic['assignment_value'] = val_dic['assignment_value']
                                                            del list_value[count]
                                                        elif k['assignment_value'] == val_dic['assignment_value']:
                                                            val_dic['assignment_value'] = val_dic['assignment_value']
                                                            del list_value[count]
                                                    count = count + 1;
                                                list_value.append(val_dic)
                                                 
                                       elif contributor != 'Employee':  # For the Employer Condition Checking
                                            # For the Fixed Amount Calculation Only For the Employer:
                                            if validation:
                                               # For CTC in Salary Rule Validation Code
                                               if "MNCTC" in validation:
                                                   validation_condition = validation.replace("MNCTC", str(ctc_amount))
                                               elif "ENCTC" in validation:
                                                   validation_condition = validation.replace("ENCTC", str(ctc_amount))
                                               elif "BASIC" in validation:  # IF Basic Salary Rule in Validation Code
                                                   validation_condition = validation.replace("BASIC", str(basic_amount_value))
                                               elif "ENBSC" in validation_condition:  # IF Earned basic in validation or assignment
                                                   validation_condition = validation.replace("ENBSC", str(earned_basic_amount_value))    
                                           # If No validation
                                            else:
                                               validation_condition = ''
                                            # If Validation Condition
                                            if validation_condition:
                                               if "%" in validation_condition:  # For Find the % in Original String
                                                   validation_condition = eval(validation_condition.replace("%", "*"))  # For Replacing % as * and Divide By 100
                                                   validation_condition = eval(str(int(validation_condition) / 100))
                                               else:
                                                   validation_condition = eval(validation_condition)
                                            if validation_condition:
                                               if i['cal_type_code'] == "NUMBR":
                                                   val_dic['assignment_value'] = round(float(i['salary_rule_value_assignment']))
                                               else:
                                                   # Check the Assignment Value 
                                                   if i['salary_rule_value_assignment_code']:
                                                       assignment_value = i['salary_rule_value_assignment_code']
                                                       if assignment_value:
                                                           # For Replacing the BASIC Code to as Basic Amount
                                                           # For CTC in Salary Rule Validation Code
                                                           cr.execute("""select esi_active from esi_value where esi_employee_id = %s and (esi_date_from,esi_date_to) overlaps (%s,%s) and is_active and esi_active""" , (employee_id,str(period_from),str(period_to),))
                                                           esi_value = q.dictfetchall(cr)
                                                           if "MNCTC" in assignment_value:
                                                               assignment_value = assignment_value.replace("MNCTC", str(ctc_amount))
#                                                            elif "ENCTC" in assignment_value:
#                                                                assignment_value = assignment_value.replace("ENCTC", str(ctc_amount))
                                                           elif "BASIC" in assignment_value:  # IF Basic Salary Rule in Validation Code
                                                               assignment_value = assignment_value.replace("BASIC", str(basic_amount_value))
                                                           elif "ENBSC" in assignment_value:  # IF Earned basic in validation or assignment
                                                               assignment_value = assignment_value.replace("ENBSC", str(earned_basic_amount_value))  
                                                           if esi_value:
                                                               if (esi_value[0]['esi_active'] == True or esi_value[0]['esi_active'] == 'true') and i['salary_rule_name'] == 'ESI':
                                                                   if "ENCTC" in assignment_value:  # IF Earned basic in validation or assignment
                                                                        assignment_value = assignment_value.replace("ENCTC", str(esi_ctc_amount)) 
                                                               else :
                                                                   if "ENCTC" in assignment_value:  # IF Earned basic in validation or assignment
                                                                        assignment_value = assignment_value.replace("ENCTC", str(ctc_amount)) 
                                                           else:
                                                               if "ENCTC" in assignment_value:  # IF Earned basic in validation or assignment
                                                                        assignment_value = assignment_value.replace("ENCTC", str(ctc_amount))       
                                                           if "%" in assignment_value:  # For Find the % in Original String
                                                               assignment_value = eval(assignment_value.replace("%", "*"))  # For Replacing % as * and Divide By 100
                                                               val_dic['assignment_value'] = round(eval(str(float(assignment_value) / 100.0)))
                                                           else:
                                                              val_dic['assignment_value'] = round(float(eval(assignment_value)))
                                                       else:
                                                           val_dic['assignment_value'] = ''
                                                   # Else the Assignment Value not Given
                                                   else:
                                                       val_dic['assignment_value'] = validation_condition
                                                        
                                               val_dic['refitems_name'] = 'Employer_Contribution'
                                               val_dic['refitem_code'] = i['salary_rule_code']
                                               if contribution_id:  # For the Employee Contribution Display the Text
                                                   val_dic['salary_rule_name'] = i['salary_rule_name'] 
                                                   cr.execute("select code as contribution_code from hr_contribution_register where id = %s ", (contribution_id,))
                                                   contribution_code_result = q.dictfetchall(cr)
                                                   val_dic['contribution_code'] = contribution_code_result[0]['contribution_code']
                                               else:
                                                    val_dic['salary_rule_name'] = i['salary_rule_name']
                                               val_dic['condition_id'] = condition_id
                                               # If Avoiding Same Value For Allowance and Deduction Details
                                               count = 0
                                               for k in list_value_employer:
                                                   if k['salary_rule_name'] == val_dic['salary_rule_name']:
                                                       if k['assignment_value'] > val_dic['assignment_value']:
                                                           val_dic['assignment_value'] = k['assignment_value']
                                                           del list_value_employer[count]
                                                       elif k['assignment_value'] < val_dic['assignment_value']:
                                                           val_dic['assignment_value'] = val_dic['assignment_value']
                                                           del list_value_employer[count]
                                                       elif k['assignment_value'] == val_dic['assignment_value']:
                                                           val_dic['assignment_value'] = val_dic['assignment_value']
                                                           del list_value_employer[count]
                                                   count = count + 1;
                                               list_value_employer.append(val_dic)
                                           # If No Validation Only Assignment Value
                                            elif i['salary_rule_validation_code'] == '':
                                               if i['cal_type_code'] == "NUMBR":
                                                       val_dic['assignment_value'] = round(float(i['salary_rule_value_assignment']))
                                               else:
                                                   # Check the Assignment Value 
                                                   if i['salary_rule_value_assignment_code']:
                                                       assignment_value = i['salary_rule_value_assignment_code']
                                                       if assignment_value:
                                                           # For Replacing the BASIC Code to as Basic Amount
                                                           # For CTC in Salary Rule Validation Code
                                                           cr.execute("""select esi_active from esi_value where esi_employee_id = %s and (esi_date_from,esi_date_to) overlaps (%s,%s) and is_active and esi_active""" , (employee_id,str(period_from),str(period_to),))
                                                           esi_value = q.dictfetchall(cr)
                                                           if "MNCTC" in assignment_value:
                                                               assignment_value = assignment_value.replace("MNCTC", str(ctc_amount))
#                                                            elif "ENCTC" in assignment_value:
#                                                                assignment_value = assignment_value.replace("ENCTC", str(ctc_amount))
                                                           elif "BASIC" in assignment_value:  # IF Basic Salary Rule in Validation Code
                                                               assignment_value = assignment_value.replace("BASIC", str(basic_amount_value))
                                                           elif "ENBSC" in validation_condition:  # IF Earned basic in validation or assignment
                                                               assignment_value = assignment_value.replace("ENBSC", str(earned_basic_amount_value))  
                                                           if esi_value:
                                                               if (esi_value[0]['esi_active'] == True or esi_value[0]['esi_active'] == 'true') and i['salary_rule_name'] == 'ESI':
                                                                   if "ENCTC" in assignment_value:  # IF Earned basic in validation or assignment
                                                                        assignment_value = assignment_value.replace("ENCTC", str(esi_ctc_amount)) 
                                                               else :
                                                                   if "ENCTC" in assignment_value:  # IF Earned basic in validation or assignment
                                                                        assignment_value = assignment_value.replace("ENCTC", str(ctc_amount)) 
                                                           else:
                                                               if "ENCTC" in assignment_value:  # IF Earned basic in validation or assignment
                                                                        assignment_value = assignment_value.replace("ENCTC", str(ctc_amount))       
                                                           if "%" in assignment_value:  # For Find the % in Original String
                                                               assignment_value = eval(assignment_value.replace("%", "*"))  # For Replacing % as * and Divide By 100
                                                               val_dic['assignment_value'] = round(eval(str(float(assignment_value) / 100.0)))
                                                           else:
                                                              val_dic['assignment_value'] = round(float(eval(assignment_value)))
                                                       else:
                                                           val_dic['assignment_value'] = ''
                                                   # Else the Assignment Value not Given
                                                   else:
                                                       val_dic['assignment_value'] = validation_condition
                                                        
                                               val_dic['refitems_name'] = "Employer_Contribution"
                                               val_dic['refitem_code'] = i['salary_rule_code']
                                               val_dic['salary_rule_name'] = i['salary_rule_name']
                                               val_dic['condition_id'] = condition_id
                                               # If Avoiding Same Value For Allowance and Deduction Details
                                               if contribution_id:  # For the Employee Contribution Display the Text
                                                   val_dic['salary_rule_name'] = i['salary_rule_name'] 
                                                   cr.execute("select code as contribution_code from hr_contribution_register where id = %s ", (contribution_id,))
                                                   contribution_code_result = q.dictfetchall(cr)
                                                   val_dic['contribution_code'] = contribution_code_result[0]['contribution_code']
                                               else:
                                                    val_dic['salary_rule_name'] = i['salary_rule_name']
                                               count = 0
                                               for k in list_value_employer:
                                                   if k['salary_rule_name'] == val_dic['salary_rule_name']:
                                                       if k['assignment_value'] > val_dic['assignment_value']:
                                                           val_dic['assignment_value'] = k['assignment_value']
                                                           del list_value_employer[count]
                                                       elif k['assignment_value'] < val_dic['assignment_value']:
                                                           val_dic['assignment_value'] = val_dic['assignment_value']
                                                           del list_value_employer[count]
                                                       elif k['assignment_value'] == val_dic['assignment_value']:
                                                           val_dic['assignment_value'] = val_dic['assignment_value']
                                                           del list_value_employer[count]
                                                   count = count + 1;
                                               list_value_employer.append(val_dic)   
                                   employer_deduction_amount = []                   
                                   if list_value_employer:
                                        for m in list_value_employer:
                                            employer_ded_pdf = 0
                                            cr.execute("""select esi_active from esi_value where esi_employee_id = %s and (esi_date_from,esi_date_to) overlaps (%s,%s) and is_active and esi_active""" , (employee_id,str(period_from),str(period_to),))
                                            esi_value = q.dictfetchall(cr)
                                            if esi_value:
                                                if m['contribution_code'] == 'EMRSI': 
                                                    employer_ded_pdf = round(float(m['assignment_value']) / float(working_days) * float(worked_day))
                                                    m['assignment_value'] = employer_ded_pdf
                                                    
                                                else: 
                                                   employer_ded_pdf =  round(float(m['assignment_value']) )
                                                   m['assignment_value'] = round(float(m['assignment_value']) )
                                            else:
                                                if m['contribution_code'] == 'EMRSI': 
                                                    m['assignment_value'] = 0
                                                    employer_ded_pdf = 0
                                                else:
                                                    employer_ded_pdf =round(float(m['assignment_value']) )   
                                            tot_employer_ded_pdf = tot_employer_ded_pdf + employer_ded_pdf        
                                                       
                                            employer_deduction_amount.append(m)    
                                   final_data_value['employer_contribution_details'] = employer_deduction_amount
                                   final_data['salary_details'] = list_value
                                   final_data['ctc_amount'] = ctc_amount
                                    # For the Actual Earnings for the Working days
                                   Fixed_Earnings_list = []   
                                   Fixed_Deduction_list = []
                                   if len(final_data) != 0:
                                       for j in final_data['salary_details']:
                                           if j['refitems_name'] == "Earnings":
                                               Fixed_Earnings_list.append(j)
                                               #if j['refitem_code'] == 'LEAVE':
                                                   #leave_travel_value = j['assignment_value']
                                           elif j['refitems_name'] == "Deduction":
                                               Fixed_Deduction_list.append(j)
                                   if len(final_data) != 0:            
                                       if final_data['ctc_amount']:
                                           value_total_fixed_earning_amount = 0.00
                                           for a in Fixed_Earnings_list:
                                               value_total_fixed_earning_amount = value_total_fixed_earning_amount + float(a['assignment_value'])
                                   if value_total_fixed_earning_amount:
                                       allowance_value = ctc_amount - value_total_fixed_earning_amount    
                                   actual_earning_amount = []
                                   if Fixed_Earnings_list:
                                       for s in Fixed_Earnings_list:
                                           earnings_amount_value = round(float(s['assignment_value']) / float(working_days) * float(worked_day))
                                           s['assignment_value'] = earnings_amount_value
                                           total_earnings_pdf = total_earnings_pdf + earnings_amount_value
                                           actual_earning_amount.append(s)
                                   actual_deduction_amount = []
                                   if Fixed_Deduction_list:
                                        for a in Fixed_Deduction_list:
                                            cr.execute("""select esi_active from esi_value where esi_employee_id = %s and (esi_date_from,esi_date_to) overlaps (%s,%s) and is_active and esi_active""" , (employee_id,str(period_from),str(period_to),))
                                            esi_value = q.dictfetchall(cr)
                                            if esi_value:
                                                if a['salary_rule_name'] == 'ESI':
                                                    a['assignment_value'] = round(float(a['assignment_value']) / float(working_days) * float(worked_day))
                                                    esi_deduction_value = round(float(a['assignment_value']) / float(working_days) * float(worked_day))
                                                else:
                                                    a['assignment_value'] =  round(float(a['assignment_value']))
                                                    esi_deduction_value = round(float(a['assignment_value']))
                                            else:
                                                if a['salary_rule_name'] == 'ESI':
                                                        a['assignment_value'] = 0
                                                        esi_deduction_value = 0
                                                else:
                                                    esi_deduction_value = round(float(a['assignment_value']))        
                                            total_deductions_pdf = total_deductions_pdf + esi_deduction_value          
                                            actual_deduction_amount.append(a) 
                                   # For PF is Not Applicable 
#                                    if Fixed_Deduction_list:
#                                         for (index, t) in enumerate(Fixed_Deduction_list):
#                                             if pf_applicable_result:
#                                                 if pf_applicable_result[0]['pf_applicable'] == False:
#                                                     salary_rule_code = "PFPFF"
#                                                     payslip_select_pf_salary_rule_query = q.fetch_hcms_query(config.payroll_management, config.payslip_select_pf_salary_rule_query)
#                                                     if payslip_select_pf_salary_rule_query:
#                                                         cr.execute(payslip_select_pf_salary_rule_query, (salary_rule_code,))
#                                                         pf_salary_rule_result = q.dictfetchall(cr)
#                                                     if pf_salary_rule_result:
#                                                         if pf_salary_rule_result[0]['id'] == t['condition_id']:
#                                                             t['assignment_value'] = 0
                                   if allowance_value:
                                      earned_special_allowance = round(float(allowance_value)  / float(working_days) * float(worked_day))
                                   if earned_special_allowance:
                                       final_data_value['special_allowance'] = earned_special_allowance   # For the Special Allowance
                                   final_data_value['emp_actual_earning_list'] = actual_earning_amount  # For Earned List Amount
                                   final_data_value['emp_actual_deduction_list'] = actual_deduction_amount  # For Deduction List Amount
                           final_data_value['employee_data_val'] = employee_data_val
                           final_data_value['payment_details'] = payment_details
                           final_data_value['company_data_val'] = company_data_val
                           #final_data_value['leave_travel_value'] = leave_travel_value
                           final_data_value['ctc_amount'] = ctc_amount
                           final_data_value['tds_amount'] = tds_amount_data
                           final_data_value['arrear_amount'] = arrear_amount_val
                           final_data_value['payslip_month'] = sp_mon
                           final_data_value['payslip_year'] = sp_yr
                           total_yr_earnings = total_earnings_pdf + float(arrear_amount_val) + variable_amount + total_lvr_amount + total_pvr_value + earned_special_allowance
                           total_yr_deductions = tot_employer_ded_pdf + total_deductions_pdf + tds_amount_data
                           yr_total_net_salary = total_yr_earnings - total_yr_deductions
                           #function for financial year
                           if period_from:
                                date = datetime.datetime.strptime(period_from, "%m/%d/%Y").date()
                                #initialize the current year
                                year_of_date = date.year
                                #initialize the current financial year start date
                                financial_year_start_date = datetime.datetime.strptime(str(year_of_date)+"-04-01","%Y-%m-%d").date()
                                if date < financial_year_start_date:
                                        fin_year_start_date = str(financial_year_start_date.year-1) + '-04'
                                        fin_year_end_date =  str(financial_year_start_date.year) + '-03'
                                else:
                                        fin_year_start_date = str(financial_year_start_date.year) + '-04'
                                        fin_year_end_date = str(financial_year_start_date.year+1) + '-03'
#                                process_year_val = datetime.datetime.strptime(period_from, '%m/%d/%Y').strftime('%m')
#                                if process_year_val:
#                                    current_date = datetime.datetime.today().strftime("%d/%m/%Y")
                           cr.execute("select id,employee_id_id from total_year_salary where employee_id_id = %s and mm_yyyy = %s",(employee_id,year_mon_date,))
                           yr_salary_data = q.dictfetchall(cr)
                           if not yr_salary_data:
                               cr.execute("""insert into total_year_salary (employee_id_id,total_earnings,total_deductions,total_net_salary,mm_yyyy,year,is_active,created_by_id,created_date) 
                               values (%s,%s,%s,%s,%s,%s,%s,%s,%s)""",(employee_id,total_yr_earnings,total_yr_deductions,yr_total_net_salary,year_mon_date,process_year_val,'True',uid,created_date,))
                           else:
                               cr.execute("""update total_year_salary set total_earnings = %s,total_deductions = %s,total_net_salary = %s where id = %s""",(total_yr_earnings,total_yr_deductions,yr_total_net_salary,yr_salary_data[0]['id']))    
                           
                           cr.execute("""select sum(total_earnings) as total_earnings,sum(total_deductions) as total_deductions,sum(total_net_salary) as total_net_salary 
                           from total_year_salary where employee_id_id = %s and mm_yyyy >= %s and mm_yyyy <= %s """,(employee_id,fin_year_start_date,fin_year_end_date,))   
                           year_total_salary = q.dictfetchall(cr)
                           total_earn_yearly = 0
                           total_ded_yearly = 0
                           toatal_net_yearly = 0
                           if year_total_salary:
                               for v in year_total_salary:
                                       total_earn_yearly = year_total_salary[0]['total_earnings']
                                       total_ded_yearly = year_total_salary[0]['total_deductions']
                                       toatal_net_yearly = year_total_salary[0]['total_net_salary']
                           rating_mon_list =  ['jan']        
                           index = rating_mon_list
                           monthly_net_salary = toatal_net_yearly
                           monthly_earnings = total_earn_yearly 
                           monthly_deductions = total_ded_yearly
                           x = [u'Total Net Salary', u'Total Deductions', u'Total Earnings']
                           y = [monthly_net_salary, monthly_deductions, monthly_earnings]
                            
                           fig, ax = plt.subplots()    
                           width = 0.75 # the width of the bars 
                           ind = np.arange(len(y))  # the x locations for the groups
                           ax.barh(ind, y, width, color=["#6aeed7","#57c4ff","#f8d77a"],align='center',linewidth=0)
                           for i, v in enumerate(y):
                               ax.text(v + 3, i + (-.00), str(v), color='black', fontweight='bold')
                           ax.set_yticks(ind+width/60)
                           ax.set_yticklabels(x, minor=False)
                           
                           ax.spines['right'].set_visible(False)
                           ax.spines['top'].set_visible(False)
                           ax.yaxis.set_ticks_position('left')
                           ax.xaxis.set_ticks_position('bottom')
                            

                           file_date_replace = file_date.replace(' ', '_')
                           year_date_image_name = '/home/nextaps/.hcms/uploads/payslip_images/year_date_chart_'+str(employee_id)+'_'+file_date_replace+''
                           plt.savefig(year_date_image_name, dpi=600, format='png', bbox_inches='tight')
                           plt.close()   
                           final_data_value['year_date_image_name'] = year_date_image_name
                           final_data_value['year_total_salary'] = ctc_amount * 12
                           
                           cr.execute("""select project_name,project_contribution_percent,contribution_percent as employee_contribution_percent from pvr_project_rating 
                           inner join employee_info on employee_info.related_user_id_id = pvr_project_rating.employee_id
                            where yyyy_mm = %s and process_date = %s and employee_info.id = %s """,(year_mon_date,process_year_val,employee_id,))
                           project_contribution_details = q.dictfetchall(cr)
                           if project_contribution_details:
                               
                               final_data_value['project_contribution_details'] = project_contribution_details
                           
                           
                           print_data.append(final_data_value)
                           
                           
                           
                       result_data['exp_details'] = print_data
                       #result_data['employee_data_val']=employee_data_list
                    else:   
                        result_data = config.unable_to_create_connection_message
       else:
           result_data = config.unable_to_create_connection_message
#     except Exception as e:#Exception Block
#         logger_obj.error(e)
#         result_data = e
#         print"EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE",e
       pdf_data = demo_pdf(result_data)
       return HttpResponse(json.dumps(pdf_data))  # Return the Response
   
def demo_pdf(result_data):
    cur = connection.cursor()
    payslip_file = []
    for a in result_data["exp_details"]:
        tot_earnings = 0
        earn_value = 0
        total_earnings = 0
        tot_deduction = 0
        ded_value = 0
        total_deduction = 0
        emplyr_ded_value = 0
        emplyr_tot_deduction = 0
        emplyr_total_deduction = 0
        net_salary = 0
        special_allow = 0
        arrear_amount = 0
        variable_amount = 0
        lvr_value = 0
        pvr_value = 0
        totals_earnings = 0
        total_year_net_salary = 0
        for i in a['employee_data_val']:
            empl_id = i['id']
        for b in a['emp_actual_earning_list']:
            earn_value = int(b["assignment_value"])
            tot_earnings = tot_earnings + earn_value   
        special_allow = round(a['special_allowance'])
        arrear_amount = round(float(a['arrear_amount']))
        variable_amount = round(a['variable_amount'])
        lvr_value = round(a['lvr_value'])
        pvr_value = round(a['pvr_value'])
        tax_amount = round(a['tds_amount'])
        total_year_net_salary = int(a['year_total_salary'])
        total_earnings = tot_earnings + special_allow +arrear_amount + variable_amount + lvr_value + pvr_value
        payslip_month = a['payslip_month']
        payslip_year = a['payslip_year']
        
        for c in a['emp_actual_deduction_list']:
            ded_value = int(c["assignment_value"])
            tot_deduction = tot_deduction + ded_value
        total_deduction = tot_deduction + tax_amount
        
        for d in a['employer_contribution_details']:
            emplyr_ded_value = int(d["assignment_value"])
            emplyr_tot_deduction = emplyr_tot_deduction + emplyr_ded_value
        emplyr_total_deduction = emplyr_tot_deduction
        emp_empr_deduction = emplyr_tot_deduction + total_deduction 
        net_salary = total_earnings - emp_empr_deduction 
        if net_salary:
            amount_words = p.number_to_words(int(net_salary))
            netsalary_letter = amount_words.title()
         #print bodyContent
        #template    
        posts_html = loader.render_to_string('tags/payslip-V1.html', {'payslip_data':a,'total_earnings':total_earnings,'total_deduction':total_deduction,
                                                'net_salary':int(net_salary),'netsalary_letter':netsalary_letter,'total_year_net_salary':total_year_net_salary,'payslip_month':payslip_month,'payslip_year':payslip_year})
        options = {
        'page-size': 'A4',
        'margin-top': '0.55in',
        'margin-right': '0.75in',
        'margin-bottom': '0.75in',
        'margin-left': '0.75in',
    }
        print"SSSSSSSSSSSSS",setting
        #css = str(setting.employee_payslip_css)
        css = '/home/nextaps/NEXT_HCMS/static/ui/css/payslip.css'
        pdf_file_name = 'Payslip_of_'+a["employee_data_val"][0]["employee_name"]+'_'+str(empl_id)+'_for_' +payslip_month+'_'+payslip_year+'.pdf'
        payslip_file.append(pdf_file_name)
        pdfkit.from_string(posts_html, '/home/nextaps/.hcms/uploads/payslip/temp_Payslip_of_'+a["employee_data_val"][0]["employee_name"]+'_'+str(empl_id)+ '_for_' +payslip_month+'_'+payslip_year+'.pdf',css=css,options=options) #with --page-size=Legal and --orientation=Landscape   
        
        cur.execute("select COALESCE(LEFT(pan_no, 4),'') as emp_name,date_of_birth,* from  employee_info where id = %s",(empl_id,))
        emp_details = q.dictfetchall(cur)
        print"DSFFFFFFFFFFF",emp_details
        if emp_details:
            emp_name = emp_details[0]['emp_name'] 
            emp_dob = emp_details[0]['date_of_birth']
            if emp_dob:
                emp_dob_split = str(emp_dob).replace('-', '')
            if emp_dob_split:
                emp_password = emp_name + emp_dob_split   
            pdffile = open(r'/home/nextaps/.hcms/uploads/payslip/temp_Payslip_of_'+a["employee_data_val"][0]["employee_name"]+'_'+str(empl_id)+ '_for_' +payslip_month+'_'+payslip_year+'.pdf', "rb")
            pdfReader = PyPDF2.PdfFileReader(pdffile)
            pdfWriter = PyPDF2.PdfFileWriter()
            for pageNum in range(pdfReader.numPages):
                pdfWriter.addPage(pdfReader.getPage(pageNum))
            pdfWriter.encrypt(emp_password.encode('utf-8'))
            resultPDF = open(r'/home/nextaps/.hcms/uploads/payslip/Payslip_of_'+a["employee_data_val"][0]["employee_name"]+'_'+str(empl_id)+ '_for_' +payslip_month+'_'+payslip_year+'.pdf', "wb")
            pdfWriter.write(resultPDF)
            resultPDF.close()
            os.remove('/home/nextaps/.hcms/uploads/payslip/temp_Payslip_of_'+a["employee_data_val"][0]["employee_name"]+'_'+str(empl_id)+ '_for_' +payslip_month+'_'+payslip_year+'.pdf')
    print"==============payslip_file",payslip_file
    return payslip_file
   

# Payslip Salary Rule Table View Query
@csrf_exempt  
def PayslipSalaryRuleTableView(request):
    ''' 
    26-May-2018 VJY To HRMS Create Payslip function. 
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: VJY
    '''
    try:  # Try Block
        post = request.POST
        cur = connection.cursor()
        employee_id = post.get(config.employee_id)  # Get the Employee ID
        structure_id = post.get(config.structure_id)  # Get the Structure ID
        result = {}
        if id:
            payslip_salaryrule_query_record = q.fetch_hcms_query(config.payroll_management, config.payslip_salaryrule_query_record_key)
            if payslip_salaryrule_query_record:
                cur.execute(payslip_salaryrule_query_record, (structure_id, employee_id,))
                result = q.dictfetchall(cur)
    except Exception as e:  # Exception Block
        result = e
    return HttpResponse(json.dumps(result))  # Return the Response

@csrf_exempt 
def SelectEmployeeSalaryStructure(request):
    ''' 
    26-May-2018 VJY To HRMS Create Payslip function. 
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: VJY
    '''
    try:  # Try Block
        post = request.POST
        cur = connection.cursor()
        employee_id = post.get(config.employee_id)  # Get the Employee ID
        created_date = format(datetime.datetime.now().strftime ("%Y-%m-%d"))
        result = {}
        if employee_id:
            payslip_salary_structure_query_record = q.fetch_hcms_query(config.payroll_management, config.payslip_salary_structure_name_selection_data)
            if payslip_salary_structure_query_record:
                cur.execute(payslip_salary_structure_query_record, (employee_id,created_date,created_date,))
                result = q.dictfetchall(cur)
    except Exception as e:  # Exception Block
        result = e
    return HttpResponse(json.dumps(result))  # Return the Response

@csrf_exempt 
def HRMSDeletePayslip(request):
    ''' 
    12-Nov-2018 VJY To HRMS Delete Payslip function. 
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: VJY
    '''
    post = request.POST
    cur = connection.cursor()
    payslip_id = post.get("delete_id")  # Get the delete ID
    json_data = {}
    created_date = format(datetime.datetime.now().strftime ("%Y-%m-%d"))
    modified_date = format(datetime.datetime.now().strftime ("%Y-%m-%d"))
    uid=request.user.id
    if not uid:
        uid = 1
    cur.execute("select name as user_name from employee_info where related_user_id_id = %s",(uid,)) 
    employee_name = q.dictfetchall(cur)
    if employee_name:
        user_name =  employee_name[0]['user_name']
    else:
        user_name = ''
    if payslip_id:
        data = json.loads(payslip_id)
        cur.execute("update hr_payslip_line set is_active = 'false' where payslip_id_id in %s returning id",(tuple(data),))
        payslip_line = cur.fetchall()
        cur.execute("update hr_payslip set is_active = 'false' where id in %s returning id",(tuple(data),))
        payslip = cur.fetchall()
        if payslip_line and payslip:
            for i in payslip:
                cur.execute("""select name from hr_payslip where id = %s""",(i))
                delete_name = q.dictfetchall(cur)
                if delete_name:
                    name_data =  delete_name[0]['name']
                else:
                    name_data = ''
                cur.execute("""insert into payroll_activity_log (user_name,user_id,field_name,form_name,status,modified_date,modified_by_id,is_active) 
                            values(%s,%s,%s,%s,%s,%s,%s,%s)""",(user_name,uid,name_data,'Payslip','delete',created_date,uid,'true'))  
            json_data[config.status_key] = config.remove_status 
        else:
            json_data[config.status_key] = 'not remove'   
    return HttpResponse(json.dumps(json_data))  # Return the Response           

# cur.execute(q.fetch_hcms_query(config.payroll_management, config.salary_structure_name_selection_data_record))
#         structure_name_data = q.dictfetchall(cur)  
#         if structure_name_data:
#             structure_name_data = structure_name_data
#         else:
#             structure_name_data = []  
#         context[config.structure_name_info] = structure_name_data #Loading Salary Structure Type Data 

@csrf_exempt 
def PayslipEmailSend(request):
    mail_data = {}
    cur = connection.cursor()
    post = request.GET
    payslip_id = json.loads(post.get('email_payslip_id'))
    if payslip_id:
        cur.execute("""select employee_id_id,rtrim(to_char(accountingperiod_from,'Month'))||'_'||to_char(accountingperiod_from,'YYYY') as payslip_month,employee_info.name,
        COALESCE(concat(upper(employee_info.name), ' ',upper(employee_info.last_name)),'') as full_name,
        employee_info.work_email,reference_items.refitems_name from hr_payslip
        inner join employee_info on employee_info.id = hr_payslip.employee_id_id
        inner join reference_items on reference_items.id = employee_info.title_id
        where hr_payslip.id in %s and hr_payslip.is_active""",(tuple(payslip_id),))
        payslip_email_data = q.dictfetchall(cur)
        if payslip_email_data:
            for i in payslip_email_data:
                employee_id = i['employee_id_id']
                payslip_month_year = i['payslip_month']  # Get the Table Id
                employee_name = i['name']
                employee_full_name = i['full_name']
                email = i['work_email']
                title_name = i['refitems_name']
                if payslip_month_year:
                    month_year = payslip_month_year.split("_")
                    split_month = month_year[0]
                    split_year = month_year[1]
                    mail_subject = "Payslip for "+split_month+" "+split_year+""
                    email_content = """<html><head>
                    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
                    <title>html title</title>
                    </head><body class="matrix-difference">
                    <p style="color:#262626;">Hello """+title_name+employee_full_name+"""<p>
                    <p style="color:#262626;">Please find attached your Payslip for the """+split_month+"""-"""+split_year+"""
                    </p>
                    <p style="color:#262626;"><b>Note:</b> The password for your payslip is XXXXYYYYMMDD (XXXX - your PAN first four letters & YYYYMMDD - your date of birth).</p>
                    <p style="color:#262626;"><b>Sincerely,</p><p style="color:#262626;">HCM</p></b></body></html>"""
                    #email_content = "Hi "+title_name+" "+employee_full_name+", " 
                    #email_content += "\n"
                    #email_content += "Please find attached your Payslip for the "+split_month+", "+split_year+"."
                    file_name = 'Payslip_of_'+employee_name+'_'+str(employee_id)+ '_for_' +split_month+'_'+split_year+'.pdf'
                    email_reponse = email_send(email,mail_subject,email_content,file_name)
                    if email_reponse['response'] == 'Email Success':
                        logger_obj.info("Email Send Success"+employee_name)
                    else:
                        logger_obj.info("Email Send Failure"+employee_name)    
                else:
                    email_reponse = 'No Data Found' 
        else:
            email_reponse = 'No Data Found'    
    else:
        email_reponse = 'No Data Found' 
    mail_data['email_response'] = email_reponse                   
                       
    return HttpResponse(json.dumps(mail_data))          

def email_send(email,mail_subject,email_content,file_name):
    try:
        email_dict = {}
        to_addr = email
        subject = mail_subject
        fromaddress = "lumino@nexttechnosolutions.co.in"
        fromaddr = formataddr((str(Header(u'Team HCM', 'utf-8')), fromaddress))
        pwd = "N3xt@Lumin0"
        recipients = to_addr
        msg = MIMEMultipart()
        msg['From'] = fromaddr
        msg['Subject'] = subject
        body = email_content
        if file_name:
              part = MIMEApplication(open(os.path.join("/home/nextaps/.hcms/uploads/payslip/")+file_name,"rb").read())
              part1=part
              part.add_header('Content-Disposition', 'attachment', filename=file_name)
              msg.attach(part1)
        msg.attach(MIMEText(body, 'html'))
        server = smtplib.SMTP('smtp.yandex.com', 587)
        server.starttls()
        server.login(fromaddress,pwd)
        text = msg.as_string()
        server.sendmail(fromaddr,recipients, text)
        server.quit()
        email_dict['response'] = 'Email Success'
        #return server
    except Exception as e:
        print e
        logger_obj.info("Email Failure"+ str(e))
        email_dict['response'] = 'Email Failure'
            
    return email_dict        
