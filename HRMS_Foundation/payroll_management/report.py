# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.shortcuts import render

import json
import xlwt
#from xlwt import easyxf
import datetime
from datetime import timedelta
import calendar
import dateutil.relativedelta
from dateutil.rrule import rrule, MONTHLY
from time import strptime
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.http.response import HttpResponse
from CommonLib import query
from django.db import connection
from CommonLib import query as q
from HRMS_Foundation.payroll_management.models import Report
from django_countries import countries
import config
from CommonLib.hcms_common import refitem_fetch
from CommonLib.hcms_common import menu_access_control
import HCMS.settings as setting
import pdfkit,os
#template render html
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from CommonLib.hcms_common import record_validation 
from ekm.client import ekm_process
import logging
import logging.handlers
import inflect
v = inflect.engine()
logger_obj = logging.getLogger('logit')


# Employee views here
class HCMSReport(TemplateView): # employee page
    ''' 
    13-Feb-2018 VIJ To HRMS Employee Id Card page loaded. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: VIJ
    '''

#     template_name = "hrms_foundation/employee_management/employee.html"
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HCMSReport, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Employee', self.request.user.id)
        if macl:
             template_name = "hrms_foundation/employee_management/report.html"
        else:
            template_name = "tags/access_denied.html"
        return [template_name]    
        
   
    def get(self, request, *args, **kwargs):
        context = super(HCMSReport, self).get_context_data(**kwargs)
                
        cur = connection.cursor()       
        #cur.execute(q.fetch_hcms_query(config.payroll_management, config.hrms_select_employee_info));
        cur.execute("""select DISTINCT emp.name as employee_name,emp.id from employee_info  emp
            inner join hr_salary_contract hrsc on hrsc.employee_id_id = emp.id
            where hrsc.is_active and emp.is_active""")
        employee_data = q.dictfetchall(cur)  
        if employee_data:
            employee_data = employee_data
        else:
            employee_data = []  
        context['employee_val'] = employee_data #Loading Employee Data     
             
        return self.render_to_response(context)
@csrf_exempt    
def HCMSSelectReportEmployee(request):
    result_data = {}
    cur = connection.cursor()       
    #cur.execute(q.fetch_hcms_query(config.payroll_management, config.hrms_select_employee_info));
    cur.execute("""select DISTINCT emp.name as employee_name,emp.id from employee_info  emp
            inner join hr_salary_contract hrsc on hrsc.employee_id_id = emp.id
            where hrsc.is_active""")
    employee_id = q.dictfetchall(cur)  
    if employee_id:
        employee_id = employee_id
    else:
        employee_id = []  
    result_data['employee_val'] = employee_id #Loading Employee Data     
         
    return HttpResponse(json.dumps(result_data))
    
@csrf_exempt
def HRMSReport(request): # employee details create function
    ''' 
    26-May-2018 VJY To HRMS Create Salary Rule function. 
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: VJY
    '''
    #try:
    print '$$$$$$$$$$$$$$$$$$44'
    cur = connection.cursor() 
    json_data = {}
    data_value = request.POST.get('id')   
    from_date = request.POST.get('from_date')
    to_date = request.POST.get('to_date')
    if from_date:
        split_mon = from_date.split('-')[0]
    if to_date:
        split_year = int(from_date.split('-')[1])
    if split_mon:
        pay_month = int(strptime(split_mon,'%b').tm_mon)
    total_days = calendar.monthrange(split_year, pay_month)[1]
    period_from = datetime.date(split_year, pay_month, 1)
    period_to = datetime.date(split_year, pay_month, total_days)
    lvr_date = str(period_from)
    ctc_amount = 0
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
    worked_day,working_days=0,0
    result_rating = {}
    created_date = format(datetime.datetime.now().strftime ("%Y-%m-%d"))
    datas = 0
    new_join_date = ''
    
    uid=request.user.id
    if data_value :
        data = [str(i) for i in json.loads(data_value)]
        data_val = data
        if from_date:
            a_start_date = period_from#datetime.date(datetime.datetime.strptime(from_date, '%Y-%m-%d').year, datetime.datetime.strptime(from_date, '%Y-%m-%d').month, datetime.datetime.strptime(from_date, '%Y-%m-%d').day)
            year_mon_date  = datetime.datetime.strptime(lvr_date, '%Y-%m-%d').strftime('%Y-%m')
            process_year_val = datetime.datetime.strptime(str(period_from), '%Y-%m-%d').strftime('%Y')
        else:
            a_start_date = ''
            year_mon_date = ''
            new_join_date = ''
        if to_date:
            end_date = period_to#datetime.date(datetime.datetime.strptime(to_date, '%Y-%m-%d').year, datetime.datetime.strptime(to_date, '%Y-%m-%d').month, datetime.datetime.strptime(to_date, '%Y-%m-%d').day)
        else:
            end_date = ''

               
        if data_val:
            for i in range(len(data_val)):
               total_lvr_value = 0
               total_tl_value = 0.0
               total_ld_percentage = 0.0
               leadership_basic_percentage = 0.0
               leadership_total_percentage = 0.0
               leadership_slab_value = 0.0
               project_variance_value = 0
               mentor_value = 0
               percentage_divide = 0.0
               esi_ctc_amount = 0
               arrear_amount_val = 0
               perform_bonus_amount_val = 0
               variable_bonus = 0
               variable_amount = 0
               total_lvr_amount = 0
               total_pvr_value = 0
               lvr_ctc_duplicate = 0
               tot_employer_ded_pdf = 0
               total_yr_earnings = 0
               total_yr_deductions = 0
               esi_deduction_value = 0
               total_earnings_pdf = 0.0
               total_deductions_pdf = 0.0
               lop_count = 0
               employer_ded_pdf = 0
               lvr_ctc = 0
               non_atten_val = 0
               final_data = {}
               final_data_value = {}
               employee_id = data_val[i]
               new_join_date = ''
               report_ctc = 0
               grace_shift_name=''

               start_date = a_start_date
               if to_date:
                 end_date = period_to#datetime.date(datetime.datetime.strptime(to_date, '%Y-%m-%d').year, datetime.datetime.strptime(to_date, '%Y-%m-%d').month, datetime.datetime.strptime(to_date, '%Y-%m-%d').day)
               else:
                 end_date = ''
               #print 'employee_id-----------------',employee_id
               cur.execute("select to_char(date_of_joining,'YYYY-MM-DD') as date_of_join,to_char(date_of_releaving,'YYYY-MM-DD') as date_of_releaving from employee_info where id = %s",(employee_id,))
               joining_date_work = q.dictfetchall(cur)
               if joining_date_work and joining_date_work[0] and 'date_of_join' in joining_date_work[0]:
                    date_of_joining = joining_date_work[0]['date_of_join']
                    date_format = "%Y-%m-%d"
                    work_date = datetime.datetime.strptime(date_of_joining,date_format).date()
                    if work_date > a_start_date:
                        #print"============================",start_date,type(start_date)
                        #print 'work date',work_date,type(work_date)
                        #start_date = work_date   
                        new_join_date = work_date
                    else:
                        start_date = a_start_date   

               if joining_date_work and joining_date_work[0] and joining_date_work[0]['date_of_releaving']:
                    date_of_releaving = joining_date_work[0]['date_of_releaving']
                    date_of_releaving = datetime.datetime.strptime(date_of_releaving, "%Y-%m-%d")
                    print 'End Date for Relieved Employees-->',type(end_date)
                    if (period_from.year == date_of_releaving.year and period_from.month > date_of_releaving.month):
                        continue
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
                        continue
        #Skip when no attendance data for the employee
               if start_date and end_date:
                    total_working_days = end_date - start_date
                    #print"========================wwwwwwwwwww",total_working_days
               else:
                    total_working_days = ''
               if total_working_days:
                    working_days = total_working_days.days + 1
               else:
                    working_days = ''
               print "working_days==>",working_days
               
               
               cur.execute("""select tds_amount from hr_tds  where tds_employee_id = %s  and (tds_from_date,tds_to_date) overlaps (%s,%s) and is_active = 'True' """ , (employee_id,str(start_date),str(end_date),))
               tds_details = q.dictfetchall(cur)
               if tds_details:
                    tds_amount_data = tds_details[0]['tds_amount']
               else:
                    tds_amount_data = 0   
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

               cur.execute("""select COALESCE(sum(leave.number_of_days),0) as lop from leave_info leave
                inner join reference_items ref_items on ref_items.id=leave.type_id_id       
                where from_date::date >= %s and to_date::date <= %s and leave_employee_id_id = %s and leave.state_id=119  
                  and ref_items.refitems_name='Leave of Absence' and leave.is_active""",(start_date,end_date,employee_id,))
               leave_data = q.dictfetchall(cur) 
               if leave_data:
                   lop_days = leave_data[0]['lop']
                   
               ##new join grace time function in 30 days    
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
                            period_from_date = date_N_days_ago
                        else:
                            period_from_date = period_from
                            
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
                                where dd NOT IN (SELECT check_in :: date FROM attendance_info where employee_id_id = %s and check_in :: date >= %s :: date
                                and check_in :: date <= %s :: date) 
                                and dd NOT IN (SELECT holiday_date :: date FROM holiday_list_info where org_id_id = %s and  org_unit_id_id = %s and holiday_date :: date >= %s :: date and holiday_date :: date <=  %s :: date and is_active)
                                and dd NOT IN (SELECT generate_series(from_date::date, to_date::date, '1 day'::interval)::date from leave_info where is_active and state_id =119
and  leave_employee_id_id = %s)"""
                                ,(period_from_date,end_date,employee_id,period_from_date,end_date,org_data_val,org_unit_val,period_from_date,end_date,employee_id,))  
                           non_attendance_data = q.dictfetchall(cur)
                           if non_attendance_data:
                                non_atten_val = non_attendance_data[0]['count']
                           else:
                                non_atten_val = 0            
                           
                        cur.execute("""  select emp.id as emp_id,hr_project_details.username,hr_project_details.summary_hours,hr_project_details.hr_hours,leave_info.number_of_days,ri.refitems_code as leave_status,
                        hr_project_details.meeting_hours,to_char(hr_project_details.check_in,'DD/MM/YYYY') as check_in,hr_project_details.check_in_time from hr_project_details
                        inner join employee_info emp on emp.related_user_id_id = hr_project_details.user_id
                         left join leave_info  on leave_employee_id_id = emp.id   and  leave_info.from_date::date = hr_project_details.check_in::date  and leave_info.is_active
                         left join reference_items ri on ri.id = leave_info.type_id_id
                         where emp.id = %s and hr_project_details.check_in not in ('2019-04-09') and
                         hr_project_details.check_in  >= %s  and hr_project_details.check_in::date <= %s and hr_project_details.day_name not in ('Saturday','Sunday')
                        group by  emp.id ,hr_project_details.username,hr_project_details.summary_hours,hr_project_details.hr_hours,leave_info.number_of_days,ri.refitems_code,
                        hr_project_details.meeting_hours,to_char(hr_project_details.check_in,'DD/MM/YYYY') ,hr_project_details.check_in_time
                        order by check_in asc""",(employee_id,period_from_date,end_date,))        
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
                                #print"====================shift_data shift_data",shift_data
                                if shift_data:
                                    hr_shift_grace_time = shift_data[0]['late_grace_time']
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
                                else:
                                    check_in_val = datetime.datetime.strptime('08:16:00', '%H:%M:%S')
                                #print"=====================shift_data",check_in_val
                                hr_hour_con = datetime.datetime.strptime('12:00:00', '%H:%M:%S')
#                                 tot_project_hr_val = datetime.datetime.strptime('08:00:00', '%H:%M:%S')
                                tot_project_hr_val_per = datetime.datetime.strptime('07:00:00', '%H:%M:%S')
                                #check_in_val = datetime.datetime.strptime('08:16:00', '%H:%M:%S')
#                                 hr_hour_val = datetime.datetime.strptime('08:00:00', '%H:%M:%S')
                                hr_hour_val_per = datetime.datetime.strptime('07:00:00', '%H:%M:%S')
                                tot_project_hr_half = datetime.datetime.strptime('04:00:00', '%H:%M:%S')
                                hr_hour_half = datetime.datetime.strptime('04:00:00', '%H:%M:%S')
                                check_in_time = datetime.datetime.strptime(i['check_in_time'], '%H:%M:%S')
                                
        #                         hr_hour_con = datetime.datetime.strptime('12:00:00', '%H:%M:%S')
        #                         tot_project_hr_val = datetime.datetime.strptime('08:00:00', '%H:%M:%S')
        #                         tot_project_hr_val_per = datetime.datetime.strptime('07:00:00', '%H:%M:%S')
        #                         check_in_val = datetime.datetime.strptime('08:16:00', '%H:%M:%S')
        #                         hr_hour_val = datetime.datetime.strptime('08:00:00', '%H:%M:%S')
        #                         hr_hour_val_per = datetime.datetime.strptime('07:00:00', '%H:%M:%S')
        #                         tot_project_hr_half = datetime.datetime.strptime('04:00:00', '%H:%M:%S')
        #                         hr_hour_half = datetime.datetime.strptime('04:00:00', '%H:%M:%S')
        #                         check_in_time = datetime.datetime.strptime(i['check_in_time'], '%H:%M:%S')
                                #hr_hour_time = datetime.datetime.strptime(i['hr_hours'], '%H:%M:%S')
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
                                #hr_hour_time = datetime.datetime.strptime(i['hr_hours'], '%H:%M:%S')
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
                                        if tot_project_hrs < tot_project_hr_val:
                                            if permission_count < 2 and i['leave_status'] == 'PEMSN':
                                                if tot_project_hrs < tot_project_hr_val_per or hr_hour_time < hr_hour_val_per:
                                                    lop_count += 1
                                                else:
                                                    pass    
                                                permission_count += 1
                                                
                                            elif i['leave_status'] in ('SICKL','CASHL','MTNTL','PTNTL','CMPOF','LEABS'):
                                                half_day = i['number_of_days'] % 1
                                                if i['number_of_days'] <= half_day:
                                                    if tot_project_hrs < tot_project_hr_half or hr_hour_time < hr_hour_half:
                                                        lop_count += 0.5
                                                    else:
                                                        pass   
                                                else:
                                                    pass         
                                            else:
                                                lop_count += 1 
                                        else:
                                            if hr_hour_time < hr_hour_val:
                                                if i['leave_status'] == 'PEMSN':
                                                    if hr_hour_time < hr_hour_val_per:
                                                        lop_count += 1
                                                else:
                                                    if i['leave_status'] in ('SICKL','CASHL','MTNTL','PTNTL','CMPOF','LEABS'):
                                                        half_day = i['number_of_days'] % 1
                                                        if i['number_of_days'] <= half_day:
                                                            if tot_project_hrs < tot_project_hr_half or hr_hour_time < hr_hour_half:
                                                                lop_count += 0.5
                                                            else:
                                                                pass   
                                                        else:
                                                            pass
                                                    else:        
                                                        lop_count += 1
                                            else:    
                                                pass       
                                    else:
                                        if check_in_time > check_in_val:
                                            if permission_count < 2 and i['leave_status'] == 'PEMSN':
                                                if tot_project_hrs < tot_project_hr_val_per or hr_hour_time < hr_hour_val_per:
                                                        lop_count += 1
                                                else:
                                                    pass 
                                                permission_count += 1
                                                
                                                
                                            elif i['leave_status'] in ('SICKL','CASHL','MTNTL','PTNTL','CMPOF','LEABS'):
                                                half_day = i['number_of_days'] % 1
                                                if i['number_of_days'] <= 0.5:
                                                    if tot_project_hrs < tot_project_hr_half or hr_hour_time < hr_hour_half:
                                                            lop_count += 0.5 
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
                                                        else:
                                                           lop_count += 1   
                                                    else:  
                                                        if tot_project_hrs < tot_project_hr_val:
                                                           # print"=============================================",lop_count,i['check_in']
                                                            lop_count += 1  
                                                        late_count += 1
                                                    pass
                                                else:
                                                    lop_count += 1 
                                else:
                                    lop_count = 0    
                    else:
                        period_from_date = period_from       
                        
               lop_hr_count = lop_count  
               
               if lop_days:
                   lop_days =  lop_days + non_atten_val
               else:
                   lop_days = 0 + non_atten_val
               if lop_hr_count:
                   final_data_value['lop_hr_count'] = lop_hr_count
               else:
                   final_data_value['lop_hr_count'] = lop_hr_count    


               cur.execute("""select salary_structure_id_id from hr_salary_contract  where employee_id_id = %s and (contract_effective_from_date,contract_effective_to_date) overlaps (%s,%s) and is_active """,(employee_id,period_from,period_to,))
               structure_data = q.dictfetchall(cur)
               if structure_data:
                    structure_id = structure_data[0]['salary_structure_id_id']  # Get the Structure ID
               else:
                    structure_id = ''
               new_join_worked_days = 0
               if new_join_date:
                    #print"+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++aaaaaaaa",new_join_date,end_date
                       
                    
                    new_join_work_days = end_date - new_join_date
                    new_join_worked_days = new_join_work_days.days + 1
                    #print"assssssssssssssssssssssssss",new_join_worked_days
                    worked_day = new_join_worked_days - lop_days - lop_hr_count
               else:
                   if working_days:
                        worked_day = working_days - lop_days - lop_hr_count
                   else: 
                        worked_day = 0
               print "lop_days===>",lop_days     
               final_data_value['working_days'] = working_days
               final_data_value['worked_day'] = worked_day
               final_data_value['lop_days'] = lop_days
               
               cur.execute("SELECT base_amount from hr_salary_contract where  employee_id_id=%s and ( %s BETWEEN contract_effective_from_date and contract_effective_to_date) and is_active=True", (employee_id,period_from,))
               base_amount = q.dictfetchall(cur)
               if base_amount:
                    #EKM// ctc_amount = float(ekm_process('fb4a04a8b086e06c168d9c1d1fbd9aa9','string',base_amount[0]['base_amount'],'decrypt'))#basic_amount[0]['base_amount']  
		    ctc_amount = float(base_amount[0]['base_amount'])
                    if ctc_amount:
                        final_data_value['report_ctc'] = ctc_amount
                    else:
                        final_data_value['report_ctc'] = ctc_amount    
               if ctc_amount and working_days and worked_day:
                   if working_days > 0:
                       one_day_salary = ctc_amount / float(working_days)
                   else:
                       one_day_salary = 0.00
                   if worked_day > 0:
                       worked_ctc_amount = round(one_day_salary * float(worked_day))
                   else:
                       worked_ctc_amount = 0.00
               cur.execute("""select COALESCE(concat(upper(emp.name), ' ',upper(emp.last_name)),'') as employee_name,emp.employee_id as employee_id,
                    team.name as team_name,tirole.role_title,to_char(emp.date_of_joining,'DD/MM/YYYY') as date_of_joining,
                    hr_payment_advices.account_no,hr_payment_advices.ifsc_code,refitems_name as bank_name,hr_payment_advices.branch_name
                 from employee_info  emp
                left join team_details_info team on team.id = emp.team_name_id
                left join hcms_ti_role_details tirole on tirole.id = role_id_id
                left join hr_payment_advices on hr_payment_advices.employee_id_id = emp.id and hr_payment_advices.is_active
                left join reference_items on reference_items.id = hr_payment_advices.bank_name_id
                where emp.id = %s and emp.is_active""",(employee_id,)) 
               employee_data = q.dictfetchall(cur) 
               #variable pay calculation
               cur.execute("""select hrprd.user_id from hr_performance_rating_details hrprd
                     inner join employee_info emp on emp.related_user_id_id = hrprd.user_id
                     where emp.id = %s and emp.is_active """ % (employee_id))
               rating_user_id_details = q.dictfetchall(cur)
               emp_opr_percentage = 0
               if rating_user_id_details:
                     cur.execute("select variable_return from rating_point  where fixed_return = %s",(ctc_amount,))
                     fixed_amount_data = q.dictfetchall(cur)
                     cur.execute("select opr from hr_performance_rating_details  where user_id = %s and yyyy_mm =  %s",(rating_user_id_details[0]['user_id'],year_mon_date,))
                     variable_data = q.dictfetchall(cur)
                     if variable_data and fixed_amount_data:
                         emp_opr_percentage = variable_data[0]['opr']
                         percentage_divide = float(variable_data[0]['opr']) * float(fixed_amount_data[0]['variable_return']) /100
                         variable_amount = (float("{0:.1f}".format(percentage_divide)) * ctc_amount / 100)
                         final_data_value['variable_amount'] = round(variable_amount)
               # For Basic Amount Calculation Based on the Salary Structure and Employee 
               if emp_opr_percentage:
                   final_data_value['emp_opr_per'] = emp_opr_percentage
               else:
                   final_data_value['emp_opr_per'] = 0
                 
                   
               cur.execute("""select opr as overall_rating,user_id from hr_performance_rating_year_details hrprd
                            inner join employee_info emp on emp.related_user_id_id = hrprd.user_id
                            where emp.id = %s and emp.is_active """,(employee_id,))
               slab_data = q.dictfetchall(cur)
               #print"========================slab_data",slab_data
               if slab_data:
                    overall_rating_slab_val = slab_data[0]['overall_rating']
                    cur.execute("select id,minimum_range,fixed_return,slab_title,variable_return from rating_point where is_active order by id ")
                    slab_range_data = q.dictfetchall(cur)  
                    if slab_range_data:
                        for i in slab_range_data:
                            slab_title = ''
                            #print"WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",overall_rating_slab_val,i['minimum_range']
                            if float(overall_rating_slab_val) >= float(i['minimum_range']):
                                slab_title = i['slab_title']  
                                break
                                
                        if slab_title != '' :
                           final_data_value['slab_name'] = slab_title
                        else:
                            final_data_value['slab_name'] = ''                   
                       
               if start_date and end_date and employee_id:
                    lvr_period_mon = start_date.month
                    count = 0
                    """-------*****************Have to Change lvr_period_mon == 6--------------------------**********"""
                    if  lvr_period_mon == 3 or lvr_period_mon == 6  or lvr_period_mon == 10:
                        for a in range(3):
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
                           cur.execute("""select opr as overall_rating,user_id from hr_performance_rating_year_details hrprd
                            inner join employee_info emp on emp.related_user_id_id = hrprd.user_id
                            where emp.id = %s and emp.is_active and hrprd.yyyy_mm = %s  """,(employee_id,lvr_month,))
                           performance_data = q.dictfetchall(cur)
                           if performance_data:
                                overall_rating_val = performance_data[0]['overall_rating']
                                cur.execute("select id,maximum_range,minimum_range,fixed_return,slab_title,variable_return from rating_point where is_active order by id ")
                                range_data = q.dictfetchall(cur)
                                """-------*****************Have to Change--------------------------**********"""  
                                if range_data and overall_rating_val:
                                    for j in range_data:
                                        if (float(overall_rating_val) >= float(j['minimum_range']) and float(overall_rating_val) <= float(j['maximum_range'])):
                                            if j['slab_title'] == 'H1' or j['slab_title'] == 'H2':
                                                lvr_ctc_duplicate=(ctc_amount*0.20) * 3
                                else:
                                    lvr_ctc_duplicate=0
                                """-------*****************Have to Change--------------------------**********"""        
                                if range_data:
                                    for i in range_data:
                                        if float(overall_rating_val) >= float(i['minimum_range']):
                                            result_rating['slab_id'] = i['id']
                                            result_rating['slab_title'] = i['slab_title']
                                            lvr_max_per = i['variable_return']
                                            slab_title = i['slab_title']
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
                                    #if total_ld_percentage :
                                        #leadership_basic_percentage = float("{0:.1f}".format(total_ld_percentage)) * 5 / 100 
                                        
                            #  leadership_total_percentage calculation          
                           if total_ld_percentage and ctc_amount:
                                leadership_total_percentage =  total_ld_percentage *  lvr_ctc / 100     
                            # Leadership value return slab calculation            
                #                cur.execute("""select value_return from leadership_value_return where id in  ( select id from rating_point where fixed_return = %s ) """ , (ctc_amount,))
                #                leadership_value = q.dictfetchall(cur) 
                #                if leadership_value:
                #                     leadership_slab_value = float(leadership_value[0]['value_return']) * ctc_amount / 100    
                            #  Leadership value return project details calculation   
                           cur.execute("""select variance_status from hr_project_variance_details where user_id in 
                                (select user_id from hr_performance_rating_details
                                inner join employee_info on employee_info.related_user_id_id = hr_performance_rating_details.user_id 
                                where employee_info.id = %s and employee_info.is_active) 
                                and hr_project_variance_details.yyyy_mm = %s""" , (employee_id,lvr_month,))
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
#                            total_lvr_amount =  total_lvr_amount + total_lvr_value
                           total_lvr_amount=lvr_ctc_duplicate
#                final_data_value['lvr_value'] = round(total_lvr_amount)
               """-------*****************Have to Change--------------------------**********"""
               if employee_id!='65' and employee_id !='161':
                   final_data_value['lvr_value'] =lvr_ctc_duplicate
               else:
                   final_data_value['lvr_value'] =0
               """-------*****************Have to Change--------------------------**********"""
               print"-------------LVR-----------------------",total_lvr_amount
               
               if start_date and end_date and employee_id:
                    pvr_period_mon = start_date.month
                    pvr_count = 0
                    pvr_date_list = []
                    print"dfddddddddddddddd",pvr_period_mon
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
                        cur.execute("""select project_id,project_name,sum(contribution_percent)as total_contribution,current_value,pvr_value from pvr_project_rating   inner  join pvr_product_details on pvr_project_rating.project_id = pvr_product_details.product_project_id
                        inner join employee_info on employee_info.related_user_id_id = pvr_project_rating.employee_id
                        where employee_info.id = %s and yyyy_mm in %s
                        group by project_id,project_name,current_value,pvr_value""",(employee_id,tuple(pvr_date_list),))
                        pvr_percent_data_count = q.dictfetchall(cur)
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
                                        #print"&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&total_pvr_value",total_pvr_value
                        #print"+++++++++++++++++++++++++++++++++++++++++++++++++++++++total_pvr_value",total_pvr_value                
#                         final_data_value['pvr_value'] = round(total_pvr_value)
                        final_data_value['pvr_value'] = 0
                    else:
#                         final_data_value['pvr_value'] = round(total_pvr_value)
                        final_data_value['pvr_value'] = 0
                   
#                     pvr_period_mon = start_date.month
#                     pvr_count = 1
#                     if  pvr_period_mon == 3 or pvr_period_mon == 7 or pvr_period_mon == 10:
#                         hcms_product_value = 500000
#                         product_percent = 30
#                         product_bonuce_value = 30 * 500000 / 100
#                         cur.execute("""select pvr_product_type.project_percentage,pvr_project_rating.contribution_percent from pvr_product_type
#                             inner join pvr_project_rating on pvr_project_rating.project_type_id = pvr_product_type.project_type_id
#                             where pvr_project_rating.employee_id = %s""",(employee_id,))
#                         product_type_details = q.dictfetchall(cur)
#                         if product_type_details:
#                             product_type_value = product_type_details[0]['project_percentage'] * product_bonuce_value / 100
#                             if product_type_value:
#                                 total_pvr_value = product_type_details[0]['contribution_percent'] * product_type_value / 100
#                         final_data_value['pvr_value'] = total_pvr_value
#                     else:
#                         final_data_value['pvr_value'] = total_pvr_value 
               
               if structure_id and employee_id:
                   # Query For Search like Basic and Validation Code
                   payslip_salary_rule_basic_name_query = q.fetch_hcms_query(config.payroll_management, config.payslip_salary_rule_basic_name)
                   if payslip_salary_rule_basic_name_query:
                       ilike_value = '%Basic%'  or '%BASIC%' 
                       cur.execute(payslip_salary_rule_basic_name_query, (ilike_value, structure_id, employee_id,))
                       result_basic = q.dictfetchall(cur)
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
                        cur.execute(payslip_pf_applicable_query, (employee_id,))
                        pf_applicable_result = q.dictfetchall(cur)
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
                                               cur.execute("""select esi_active from esi_value where esi_employee_id = %s and (esi_date_from,esi_date_to) overlaps (%s,%s) and is_active and esi_active""" , (employee_id,str(start_date),str(end_date),))
                                               esi_value = q.dictfetchall(cur)
                                               if "MNCTC" in assignment_value:
                                                   assignment_value = assignment_value.replace("MNCTC", str(ctc_amount))
#                                                elif "ENCTC" in assignment_value:
#                                                    assignment_value = assignment_value.replace("ENCTC", str(ctc_amount))
                                               elif "BASIC" in assignment_value:  # IF Basic Salary Rule in Validation Code
                                                   assignment_value = assignment_value.replace("BASIC", str(basic_amount_value))
                                               elif "ENBSC" in assignment_value:  # IF Earned basic in validation or assignment
                                                   assignment_value = assignment_value.replace("ENBSC", str(earned_basic_amount_value)) 
                                               if  esi_value:
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
                                   val_dic['refitems_name'] = i['refitems_name']
                                   val_dic['refitem_code'] = i['salary_rule_code']
                                   if contribution_id:  # For the Employee Contribution Display the Text
                                       val_dic['salary_rule_name'] = i['salary_rule_name'] + "  Employee Contribution"
                                   else:
                                        val_dic['salary_rule_name'] = i['salary_rule_name']
                                   val_dic['condition_id'] = condition_id
                                   # If Avoiding Same Value For Allowance and Deduction Details
#                                    if contribution_id:  # For the Employee Contribution Display the Text
#                                        print"contribution_id==>",contribution_id
#                                        val_dic['salary_rule_name'] = i['salary_rule_name'] 
#                                        cur.execute("select code as contribution_code from hr_contribution_register where id = %s ", (contribution_id,))
#                                        contribution_code_result = q.dictfetchall(cur)
#                                        print"EMPLOYYYEEEE contribution_code_result",contribution_code_result
#                                        val_dic['contribution_code'] = contribution_code_result[0]['contribution_code']
#                                    else:
#                                         val_dic['salary_rule_name'] = i['salary_rule_name']
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
                                               cur.execute("""select esi_active from esi_value where esi_employee_id = %s and (esi_date_from,esi_date_to) overlaps (%s,%s) and is_active and esi_active""" , (employee_id,str(start_date),str(end_date),))
                                               esi_value = q.dictfetchall(cur)
                                               if "MNCTC" in assignment_value:
                                                   assignment_value = assignment_value.replace("MNCTC", str(ctc_amount))
#                                                elif "ENCTC" in assignment_value:
#                                                    assignment_value = assignment_value.replace("ENCTC", str(ctc_amount))
                                               elif "BASIC" in assignment_value:  # IF Basic Salary Rule in Validation Code
                                                   assignment_value = assignment_value.replace("BASIC", str(basic_amount_value))
                                               elif "ENBSC" in assignment_value:  # IF Earned basic in validation or assignment
                                                   assignment_value = assignment_value.replace("ENBSC", str(earned_basic_amount_value))  
                                               if  esi_value:
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
                                           val_dic['salary_rule_name'] = i['salary_rule_name'] + "  Employee Contribution"
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
                                   cur.execute("""select esi_active from esi_value where esi_employee_id = %s and (esi_date_from,esi_date_to) overlaps (%s,%s) and is_active and esi_active""" , (employee_id,str(start_date),str(end_date),))
                                   esi_value = q.dictfetchall(cur)
                                   if "MNCTC" in validation:
                                       validation_condition = validation.replace("MNCTC", str(ctc_amount))
                                   elif "ENCTC" in validation:
                                       validation_condition = validation.replace("ENCTC", str(ctc_amount))
                                   elif "BASIC" in validation:  # IF Basic Salary Rule in Validation Code
                                       validation_condition = validation.replace("BASIC", str(basic_amount_value))
                                   elif "ENBSC" in validation_condition:  # IF Earned basic in validation or assignment
                                       validation_condition = validation_condition.replace("ENBSC", str(earned_basic_amount_value))     
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
                                               cur.execute("""select esi_active from esi_value where esi_employee_id = %s and (esi_date_from,esi_date_to) overlaps (%s,%s) and is_active and esi_active""" , (employee_id,str(start_date),str(end_date),))
                                               esi_value = q.dictfetchall(cur)
                                               if "MNCTC" in assignment_value:
                                                   assignment_value = assignment_value.replace("MNCTC", str(ctc_amount))
#                                                elif "ENCTC" in assignment_value:
#                                                    assignment_value = assignment_value.replace("ENCTC", str(ctc_amount))
                                               elif "BASIC" in assignment_value:  # IF Basic Salary Rule in Validation Code
                                                   assignment_value = assignment_value.replace("BASIC", str(basic_amount_value))
                                               elif "ENBSC" in assignment_value:  # IF Earned basic in validation or assignment
                                                   assignment_value = assignment_value.replace("ENBSC", str(earned_basic_amount_value))   
                                               if  esi_value:
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
                                       val_dic['salary_rule_name'] = i['salary_rule_name'] + "  Employer Contribution"
                                       cur.execute("select code as contribution_code from hr_contribution_register where id = %s ", (contribution_id,))
                                       contribution_code_result = q.dictfetchall(cur)
                                       val_dic['contribution_code'] = contribution_code_result[0]['contribution_code']
                                   else:
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
                                               cur.execute("""select esi_active from esi_value where esi_employee_id = %s and (esi_date_from,esi_date_to) overlaps (%s,%s) and is_active and esi_active""" , (employee_id,str(start_date),str(end_date),))
                                               esi_value = q.dictfetchall(cur)
                                               if "MNCTC" in assignment_value:
                                                   assignment_value = assignment_value.replace("MNCTC", str(ctc_amount))
#                                                elif "ENCTC" in assignment_value:
#                                                    assignment_value = assignment_value.replace("ENCTC", str(ctc_amount))
                                               elif "BASIC" in assignment_value:  # IF Basic Salary Rule in Validation Code
                                                   assignment_value = assignment_value.replace("BASIC", str(basic_amount_value))
                                               elif "ENBSC" in assignment_value:  # IF Earned basic in validation or assignment
                                                   assignment_value = assignment_value.replace("ENBSC", str(earned_basic_amount_value))    
                                               if  esi_value:
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
                                   
                           final_data['salary_details'] = list_value
                           final_data['ctc_amount'] = ctc_amount
                       #Employer Contribution    
                       employer_deduction_amount = [] 
#                        if list_value_employer:
#                             for m in list_value_employer:
#                                 cur.execute("""select esi_active from esi_value where esi_employee_id = %s and (esi_date_from,esi_date_to) overlaps (%s,%s) and is_active and esi_active""" , (employee_id,str(start_date),str(end_date),))
#                                 esi_value = q.dictfetchall(cur)
#                                 if esi_value:
#                                     if m['contribution_code'] == 'EMRSI': 
#                                         m['assignment_value'] = round(float(m['assignment_value']) / float(working_days) * float(worked_day))
#                                         
#                                     else: 
#                                        m['assignment_value'] = round(float(m['assignment_value']) )
#                                 else:
#                                     if m['contribution_code'] == 'EMRSI': 
#                                         m['assignment_value'] = 0
                                        
                       if list_value_employer:
                            for m in list_value_employer:
                                employer_ded_pdf = 0
                                cur.execute("""select esi_active from esi_value where esi_employee_id = %s and (esi_date_from,esi_date_to) overlaps (%s,%s) and is_active and esi_active""" , (employee_id,str(period_from),str(period_to),))
                                esi_value = q.dictfetchall(cur)
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
                        # For the Actual Earnings for the Working days
                       Fixed_Earnings_list = []   
                       Fixed_Deduction_list = []
                       if len(final_data) != 0:
                           for j in final_data['salary_details']:
                               if j['refitems_name'] == "Earnings":
                                   Fixed_Earnings_list.append(j)
                                   if j['refitem_code'] == 'LEAVE':
                                       leave_travel_value = j['assignment_value']
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
                               s['assignment_value'] = round(float(s['assignment_value']) / float(working_days) * float(worked_day))
                               total_earnings_pdf = total_earnings_pdf + earnings_amount_value
                               actual_earning_amount.append(s)
                       actual_deduction_amount = []  
#                        if Fixed_Deduction_list:
#                             for a in Fixed_Deduction_list:
#                                 cur.execute("""select esi_active from esi_value where esi_employee_id = %s and (esi_date_from,esi_date_to) overlaps (%s,%s) and is_active and esi_active""" , (employee_id,str(start_date),str(end_date),))
#                                 esi_value = q.dictfetchall(cur)
#                                 if esi_value:
#                                     if a['salary_rule_name'] == 'ESI':
#                                         a['assignment_value'] = round(float(a['assignment_value']) / float(working_days) * float(worked_day))
#                                     else:                                   
#                                         a['assignment_value'] =  round(float(a['assignment_value']))
#                                 else:
#                                     if a['salary_rule_name'] == 'ESI':
#                                             a['assignment_value'] = 0
#                                 actual_deduction_amount.append(a) 
                       if Fixed_Deduction_list:
                            for a in Fixed_Deduction_list:
                                cur.execute("""select esi_active from esi_value where esi_employee_id = %s and (esi_date_from,esi_date_to) overlaps (%s,%s) and is_active and esi_active""" , (employee_id,str(period_from),str(period_to),))
                                esi_value = q.dictfetchall(cur)
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
#                        if Fixed_Deduction_list:
#                             for (index, t) in enumerate(Fixed_Deduction_list):
#                                 if pf_applicable_result:
#                                     if pf_applicable_result[0]['pf_applicable'] == False:
#                                         salary_rule_code = "PFPFF"
#                                         payslip_select_pf_salary_rule_query = q.fetch_hcms_query(config.payroll_management, config.payslip_select_pf_salary_rule_query)
#                                         if payslip_select_pf_salary_rule_query:
#                                             cur.execute(payslip_select_pf_salary_rule_query, (salary_rule_code,))
#                                             pf_salary_rule_result = q.dictfetchall(cur)
#                                         if pf_salary_rule_result:
#                                             if pf_salary_rule_result[0]['id'] == t['condition_id']:
#                                                 t['assignment_value'] = 0
                       if allowance_value:
                          earned_special_allowance = round(float(allowance_value) / float(working_days) * float(worked_day))
                       if earned_special_allowance:
                           final_data_value['special_allowance'] = earned_special_allowance  # For the Special Allowance
                       final_data_value['emp_actual_earning_list'] = actual_earning_amount  # For Earned List Amount
                       final_data_value['emp_actual_deduction_list'] = actual_deduction_amount  # For Deduction List Amount
                       #print"@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@",final_data_value
               final_data_value['employee_data_val'] = employee_data
               #final_data_value['payment_details'] = payment_details
               #final_data_value['company_data_val'] = company_data_val
               #final_data_value['leave_travel_value'] = leave_travel_value
               final_data_value['ctc_amount'] = ctc_amount
               final_data_value['tds_amount'] = tds_amount_data
               final_data_value['arrear_amount'] = arrear_amount_val
               #print"$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$",final_data_value
               #final_data_value['total_lvr_value'] = round(total_lvr_value)
               #final_data_value['total_pvr_value'] = 0
               
               total_yr_earnings = total_earnings_pdf + float(arrear_amount_val) + variable_amount + total_lvr_amount + total_pvr_value + earned_special_allowance
               total_yr_deductions = float(tot_employer_ded_pdf) + float(total_deductions_pdf) + float(tds_amount_data)
               yr_total_net_salary = total_yr_earnings - total_yr_deductions
               #function for financial year
               if period_from:
                    date = datetime.datetime.strptime(str(period_from), "%Y-%m-%d").date()
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
               
               cur.execute("select id,employee_id_id from total_year_salary where employee_id_id = %s and mm_yyyy = %s",(employee_id,year_mon_date,))
               yr_salary_data = q.dictfetchall(cur)
               if not yr_salary_data:
                   cur.execute("""insert into total_year_salary (employee_id_id,total_earnings,total_deductions,total_net_salary,mm_yyyy,year,is_active,created_by_id,created_date) 
                   values (%s,%s,%s,%s,%s,%s,%s,%s,%s)""",(employee_id,total_yr_earnings,total_yr_deductions,yr_total_net_salary,year_mon_date,process_year_val,'True',uid,created_date,))
               else:
                   cur.execute("""update total_year_salary set total_earnings = %s,total_deductions = %s,total_net_salary = %s where id = %s""",(total_yr_earnings,total_yr_deductions,yr_total_net_salary,yr_salary_data[0]['id']))
                               
               print_data.append(final_data_value)
            result_data['exp_details'] = print_data
            if result_data:
                result = excel_generate(request,result_data,worked_day,working_days,lop_days)
           #result_data['employee_data_val']=employee_data_list
        else:   
            result_data = config.unable_to_create_connection_message

    return HttpResponse(json.dumps(result))   

def excel_generate(request,dict_value,worked_day,working_days,lop):
    #print"********************dict_value",dict_value
    cr = connection.cursor()
    report_date = datetime.datetime.now()
    file_date = report_date.strftime("%Y-%m-%d %H:%m:%S.%f")[:-3]
    uid = request.user.id
    if not uid:
        uid = 1
    list_value = []
    book = xlwt.Workbook()
    
    sh = book.add_sheet('sheet')
    #sh.protect = True
    #read_only = easyxf("")  # "cell_locked true" is default
    #sh.title = "Locations"
    style = xlwt.XFStyle()
# font
    font = xlwt.Font()
    font.bold = True
    style.font = font
    n=0
    
    line = 1
    
    sh.write(0, 0, 'Employee Name',style=style)
    sh.write(0, 1, 'Department',style=style)
    sh.write(0, 2, 'Designation',style=style)
    sh.write(0, 3, 'Employee Id',style=style)
    sh.write(0, 4, 'Date of Joining',style=style)
    sh.write(0, 5, 'Account No',style=style)
    sh.write(0, 6, 'IFSC Code',style=style)
    sh.write(0, 7, 'Bank Name',style=style)
    sh.write(0, 8, 'Branch Name',style=style)
    #sh.write(0, 5, 'PF No',style=style)
    sh.write(0, 9, 'Total Worked Days',style=style)
    sh.write(0, 10, 'Leave of Absence',style=style)
    sh.write(0, 11, 'Non Compliance Days',style=style)
    sh.write(0, 12, 'Effective Work Days',style=style)
    sh.write(0, 13, 'Monthly CTC',style=style)
    sh.write(0, 14,'Basic',style=style)
    sh.write(0, 15,'Conveyance',style=style)
    sh.write(0, 16,'HRA',style=style)
    sh.write(0, 17,'Meal Card',style=style)
    #sh.write(0, 12,'Payment',style=style)
    sh.write(0, 18,'Leave Travel Allowance',style=style)
    sh.write(0, 19,'Medical Allowance',style=style)
    sh.write(0, 20,'Telephone Allowance',style=style)
    sh.write(0, 21,'Special Allowance',style=style)
    sh.write(0, 22,'Arrear',style=style)
    sh.write(0, 23,'Variable Return',style=style)
    sh.write(0, 24,'Leadership Value Rerturn',style=style)
    sh.write(0, 25,'Product Value Rerturn',style=style)
    sh.write(0, 26, 'EARNED CTC',style=style)
    sh.write(0, 27,'Professional Tax',style=style)
    sh.write(0, 28,'Provident Fund Employee Contribution',style=style)
    sh.write(0, 29, 'ESI Employee Contribution',style=style)
    sh.write(0, 30,'ESI Employer Contribution',style=style)
    sh.write(0, 31, 'Provident Fund Employer Contribution',style=style)
    sh.write(0, 32, 'TDS Amount',style=style)
    sh.write(0, 33, 'TOTAL DEDUCTION',style=style)
    sh.write(0, 34, 'NET SALARY',style=style)
    sh.write(0, 35, 'Employee Slab',style=style)
    sh.write(0, 36, 'Employee Performance(%)',style=style)
    #sh.write(0, 24, 'TOTAL',style=style)
        #emp_id = i['employee_id']
        #payslip_id_data = i['payslip_id']
        #report_result_data = calculation_data(emp_id,payslip_id_data)
        #list_value.append(report_result_data)
    earning_list = ['Basic','Conveyance','HRA','Meal Card','Leave Travel Allowance','Medical Allowance','Telephone Allowance']
    deduction_list = ['Professional Tax','Provident Fund  Employee Contribution','ESI']
    employer_deduction = ['ESI','Provident Fund']
    
    for j in dict_value['exp_details']:
        if len(dict_value['exp_details']) > 0:
            special_amt = 0.0
            tot_earning = 0.0
            net_salary = 0.0
            variable_amt = 0.0
            tot_deduction = 0.0 
            total_earnings = 0.0
            total_earning_variable = 0.0
            lvr_amt = 0.0
            pvr_amt = 0.0
            earning_value = 0.0
            deduction_val = 0.0
            deduction_val_employer = 0.0
            total_deduction_val = 0.0
            total_tds_amount = 0.0
            tot_deduction_amount = 0.0
            lvr_total_earnings = 0.0
            arrear_amount = 0.0
            if j['tds_amount']:
                total_tds_amount = float(j['tds_amount'])
            if j['arrear_amount']:
                arrear_amount = float(j['arrear_amount'])    
            if j['employee_data_val']:
                for l in j['employee_data_val']:
                    sh.write(n+line, 0, l['employee_name'])
                    sh.write(n+line, 1, l['team_name'])
                    sh.write(n+line, 2, l['role_title'])
                    sh.write(n+line, 3, l['employee_id'])
                    sh.write(n+line, 4, l['date_of_joining'])
                    sh.write(n+line, 5, l['account_no'])
                    sh.write(n+line, 6, l['ifsc_code'])
                    sh.write(n+line, 7, l['bank_name'])
                    sh.write(n+line, 8, l['branch_name'])
                    #sh.write(n+line, 5, l['provident_fund_no'])
            if j['working_days']:        
                sh.write(n+line, 9, j['working_days'])
            if j['lop_days']:    
                sh.write(n+line, 10, j['lop_days'])
            else:
                sh.write(n+line, 10, j['lop_days'])    
            if j['lop_hr_count']:    
                sh.write(n+line, 11, j['lop_hr_count'])  
            else:
                sh.write(n+line, 11, 0)      
            if j['worked_day']:    
                sh.write(n+line, 12, j['worked_day'])
            if j.get('report_ctc'):
                sh.write(n+line,13, j['report_ctc'],style=style) 
            if j.get('emp_actual_earning_list'):
                for z,m in enumerate(earning_list):
                    value_match = 0;
                    for o in j['emp_actual_earning_list']:
                         if o['salary_rule_name'] == m:
                             value_match = 1
                             sh.write(n+line,14+z,o['assignment_value'])
                             earning_value += o['assignment_value']
                             break;
                    if not value_match:
                        sh.write(n+line,14+z,0)
            if j.get('special_allowance'):
                sh.write(n+line,21, j['special_allowance'])
                special_amt = float(j['special_allowance'])
                tot_earning = earning_value + special_amt + arrear_amount
                
            if j['arrear_amount'] > 0:   
                sh.write(n+line,22,j['arrear_amount'])  
            else:
                sh.write(n+line,22,0,style=style)
                      
            if j.get('variable_amount'):
                sh.write(n+line,23, j['variable_amount'])
                variable_amt = float(j['variable_amount'])
                if variable_amt !=0.0 :
                    tot_earning += variable_amt
                    total_earnings = tot_earning
                    #total_earning_variable = tot_earning +  variable_amt
                    #total_earnings = total_earning_variable
                    #sh.write(n+line,17,total_earnings,style=style) 
                    #sh.write(n+line,18,total_earnings,style=style) 
                else:
                     total_earnings = 0.0
                     total_earnings =  tot_earning   
            else:
                total_earnings = 0.0
                total_earnings =  tot_earning     
                #sh.write(n+line,17,total_earnings,style=style)
                #sh.write(n+line,18,total_earnings,style=style)
            if j.get('lvr_value'):
                sh.write(n+line,24, j['lvr_value'])
                lvr_amt = float(j['lvr_value'])
                if lvr_amt !=0.0 :
                    tot_earning += lvr_amt
                    total_earnings = tot_earning
                    #sh.write(n+line,18,total_earnings,style=style) 
                else:
                     total_earnings = 0.0
                     total_earnings =  tot_earning    
            else:
                total_earnings = 0.0
                total_earnings =  tot_earning   
                
            if j.get('pvr_value'):
                sh.write(n+line,25, j['pvr_value'])
                pvr_amt = float(j['pvr_value'])
                if pvr_amt !=0.0 :
                    tot_earning += pvr_amt
                    total_earnings = tot_earning
                    #sh.write(n+line,18,total_earnings,style=style) 
                    #sh.write(n+line,20,total_earnings,style=style)
                else:
                     total_earnings = 0.0
                     total_earnings =  tot_earning    
            else:
                total_earnings = 0.0
                total_earnings =  tot_earning       
            sh.write(n+line,26,total_earnings,style=style)             
                
            if j.get('emp_actual_deduction_list'):
                for x,y in enumerate(deduction_list):
                    dect_match = 0;
                    for p in j['emp_actual_deduction_list']:
                         if p['salary_rule_name'] == y:
                             dect_match = 1
                             sh.write(n+line,27+x,p['assignment_value'])
                             deduction_val += p['assignment_value']
                             break;
                    if not dect_match:
                        sh.write(n+line,27+x,0)
            if j.get('employer_contribution_details'):
                for a,b in enumerate(employer_deduction):
                    dect_match = 0;
                    for s in j['employer_contribution_details']:
                         if s['salary_rule_name'] == b:
                             dect_match = 1
                             sh.write(n+line,30+a,s['assignment_value'])
                             deduction_val_employer += s['assignment_value']
                             break;
                    if not dect_match:
                        sh.write(n+line,30+a,0)  
            if  deduction_val > deduction_val_employer:
                tot_deduction = deduction_val +  deduction_val_employer
            else:                         
                tot_deduction =  deduction_val_employer +  deduction_val  
            if j['tds_amount'] > 0:   
                sh.write(n+line,32,j['tds_amount'],style=style)  
            else:
                sh.write(n+line,32,0,style=style)       
            tot_deduction_amount = tot_deduction +  total_tds_amount
            sh.write(n+line,33,tot_deduction_amount,style=style) 
            net_salary = tot_earning - tot_deduction_amount
            amount_words = v.number_to_words(int(net_salary))
            netsalary_letter = amount_words.title()
            net_salary_string = str(netsalary_letter) + ' only'
            sh.write(n+line, 34,net_salary ,style=style)
            if j.get('slab_name'):
                 sh.write(n+line,35, j['slab_name'])
            if j.get('emp_opr_per'):
                 sh.write(n+line,36, j['emp_opr_per'])    
            #sh.write(n+line, 24,net_salary ,style=style)
            #sh.write(n+line, 24,net_salary_string ,style=style)              
            n=n+1
    file_name_val = "Payroll_report"+"_"+file_date
    file_name_replace = file_name_val.replace(' ', '_')
    status = Report(file_name = file_name_replace, file_path = setting.MEDIA_ROOT+"payroll/",file_type = 'xls', 
                      file_full_path = setting.MEDIA_ROOT+'payroll/'+file_name_replace+".xls",created_by_id=uid, modified_by_id=uid)
    status.save()
    book.save(setting.MEDIA_ROOT+'payroll/'+file_name_replace+".xls")
    cr.execute("select file_name,file_full_path from report where id = %s",(status.id,));
    report_data = q.dictfetchall(cr)
    result = {}
    result['file_data'] = report_data
    result['success_data'] = 'Success'
    return result  
    
    
