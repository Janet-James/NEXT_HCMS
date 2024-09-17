# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.shortcuts import render

import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.http.response import HttpResponse
from django.db import connection
from CommonLib import query as q
from HRMS_Foundation.payroll_management.models import ContributionRegister
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
from CommonLib import exit_employee_project_details as eepd 
import logging
import logging.handlers
import pdfkit
import datetime
from CommonLib.asyn_mail import asyn_email 
logger_obj = logging.getLogger('logit')


# Meet Our Expertise views here
class ExitOurExpertis(TemplateView): # employee page
    ''' 
    24-Jan-2019 TRU to Employee Expertise loaded. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: TRU
    '''
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(ExitOurExpertis, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Exit Employee', self.request.user.id)
        if macl:
             template_name = "hrms_foundation/employee_management/exit_our_expertise.html"
        else:
            template_name = "tags/access_denied.html"
        return [template_name]    
        
   
    def get(self, request, *args, **kwargs):
        context = super(ExitOurExpertis, self).get_context_data(**kwargs)
        cur = connection.cursor()       
        cur.execute("select id,(name||' '||last_name) as name from employee_info where is_active=false order by name");
        employee_list = q.dictfetchall(cur)  
        context['employee_list'] = employee_list #Loading Employee Data     
        return self.render_to_response(context)

#Exit Our Expertise offer list    
def getEmployeeExitExpertiseList(request):
    ''' 
    24-Jan-2019 TRU To Exit Employee Expertise List page data loaded.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: TRU
    '''
    json_data = {}
    try:
            logger_obj.info('Exit Employee Expertise function by'+str(request.user.username))
            cur = connection.cursor()  #create the database connection
            post = request.GET
            status = post.get('status')  #get table key 
            val = post.get('val')  #get table key 
            querys = '''select ei.id,(ei.name||' '||ei.last_name) as name,coalesce(ai.name,'no_data.png') as profile,rd.role_title,
            td.name as tname,ei.work_email,coalesce(moe.status,0) as status
            from employee_info ei
            inner join hcms_ti_role_details rd on rd.id=ei.role_id_id
            left join attachment_info ai on ai.id = ei.image_id_id
            inner join team_details_info td on td.id = ei.team_name_id
            inner join exit_our_expertise moe on moe.emp_id = ei.id
            where ei.is_active=false'''  
            if status == 'name':
                print "-----not all----",status
                query = querys+" and ei.name ilike '%{}%'".format(str(val))
                cur.execute(query+" order by ei.name");
                values = q.dictfetchall(cur)
            elif status == 'all':
                print "------all---",status
                cur.execute(querys+" order by ei.name");
                values = q.dictfetchall(cur)
            else:
                print "------row---",val
                query = querys+" and ei.id={}".format(int(val))
                cur.execute(query+" order by ei.name");
                values = q.dictfetchall(cur)
            if values:
                     json_data[config.results] = values
            else:
                     json_data[config.results] = []
    except Exception as e:
            print e
            json_data[config.results] = ''
    return HttpResponse(json.dumps(json_data))

#Store Exit Our Expertise function here
def employeeExitOurExpertiseOperation(request):
    ''' 
    24-Jan-2019 TRU To Exit Employee Expertise List page data loaded.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: TRU
    '''
    json_data = {}
    try:
            logger_obj.info('Exit Employee Expertise listing function by'+str(request.user.username))
            cur = connection.cursor()  #create the database connection
            post = request.POST
            employee_ids = post.get('employee_id').split(',')  #get table key 
            print "-----------",employee_ids
            if employee_ids:
                for id in employee_ids:
                    print "----->",id,post.get('status')
                    cur.execute("select id from exit_our_expertise where emp_id={}".format(int(id)));
                    find_res = cur.fetchall() 
                    if find_res:
                        print id,"-update->",find_res[0][0]
                        cur.execute("update exit_our_expertise set status=%s where emp_id=%s"
                                    ,(int(post.get('status')),int(id)))
                        json_data[config.results] = 'NTE-E02'
                    else:
                        print id,"-add->",id
                        cur.execute("insert into exit_our_expertise (emp_id,status) values (%s,%s)"
                                    ,(int(id),int(post.get('status'))))
                        json_data[config.results] = 'NTE-E01'
    except Exception as e:
            print e
            json_data[config.results] = 'NTE-E03'
            json_data[config.results] = config.error   
    return HttpResponse(json.dumps(json_data))

# Exit Request Our Expertise views here
class ExitRequestOurExpertis(TemplateView): # employee page
    ''' 
    24-Jan-2019 TRU to Employee Exit Request Expertise loaded. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: TRU
    '''
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(ExitRequestOurExpertis, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Exit Request Employee', self.request.user.id)
        if macl:
             template_name = "hrms_foundation/employee_management/exit_employee_request.html"
        else:
            template_name = "tags/access_denied.html"
        return [template_name]    
   
    def get(self, request, *args, **kwargs):
        context = super(ExitRequestOurExpertis, self).get_context_data(**kwargs)
        cur = connection.cursor()       
        cur.execute("""select eed.id,(ei.name||' '||ei.last_name ||' - ( '||eed.hrcompany||' )') as name from employee_info ei
        inner join ex_employee_details eed
        on ei.employee_id = eed.emp_id
        where is_active=false order by name
        """);
        employee_list = q.dictfetchall(cur)  
        context['employee_list'] = employee_list #Loading Employee Data     
        return self.render_to_response(context)
    
#Exit Request Employee Expertise offer list    
def getEmployeeExitRequestExpertiseList(request):
    ''' 
    24-Jan-2019 TRU To Exit Request Employee Expertise List page data loaded.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: TRU
    '''
    json_data = {}
    try:
            logger_obj.info('Exit Employee Expertise function by'+str(request.user.username))
            cur = connection.cursor()  #create the database connection
            post = request.GET
            status = post.get('status')  #get table key 
            val = post.get('val')  #get table key 
            querys = '''select moe.id,ei.id as emp_id,(ei.name||' '||ei.last_name) as name,coalesce(ai.name,'no_data.png') as profile,rd.role_title,
            td.name as tname,ei.work_email,coalesce(moe.status,'') as status,moe.hrname,moe.hremail,moe.hrcompany
            from employee_info ei
            inner join hcms_ti_role_details rd on rd.id=ei.role_id_id
            left join attachment_info ai on ai.id = ei.image_id_id
            inner join team_details_info td on td.id = ei.team_name_id
            inner join ex_employee_details moe on moe.emp_id = ei.employee_id
            where ei.is_active=false
            '''  
            if status == 'name':
                print "-----not all----",status
                query = querys+" and ei.name ilike '%{}%'".format(str(val))
                cur.execute(query+" order by ei.name");
                values = q.dictfetchall(cur)
            elif status == 'all':
                print "------all---",status
                cur.execute(querys+" order by ei.name");
                values = q.dictfetchall(cur)
            else:
                print "------row---",val
                query = querys+" and moe.id={}".format(int(val))
                cur.execute(query+" order by ei.name");
                values = q.dictfetchall(cur)
            if values:
                     json_data[config.results] = values
            else:
                     json_data[config.results] = []
    except Exception as e:
            print e
            json_data[config.results] = ''
    return HttpResponse(json.dumps(json_data))

#Exit Request Our Expertise function here
def employeeExitRequestExpertiseOperation(request):
    ''' 
    24-Jan-2019 TRU To Exit Request Employee Expertise List page data loaded.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: TRU
    '''
    json_data = {}
    try:
            logger_obj.info('Exit Employee Expertise listing function by'+str(request.user.username))
            cur = connection.cursor()  #create the database connection
            post = request.POST
            employee_ids = post.get('employee_id').split(',')  #get table key 
            employee_pro_list = post.get('employee_pro_list').split(',')  #get table key 
            get_emp_id = post.get('get_emp_id')
            hr_email = post.get('hr_email')
            print "--------employee_pro_list---",employee_ids,employee_pro_list,hr_email
            if employee_ids:
                for id in employee_ids:
                    print "----->",id,post.get('status')
                    cur.execute("select id from ex_employee_details where id={}".format(int(id)));
                    find_res = cur.fetchall() 
                    if find_res:
                        print id,"-update->",find_res[0][0]
                        cur.execute("update ex_employee_details set status=%s where id=%s"
                                    ,(str(post.get('status')),int(id)))
                        json_data[config.results] = 'NTE-E02'
                print "----------employee_ids-----------------------",get_emp_id
                cur.execute("update exit_employee_project_details set approve_status='pending' where emp_id=%s"
                                        ,(int(get_emp_id),))
                for exit_id in employee_pro_list:
                    print "--------Exit id-----------------",exit_id
                    if exit_id != '':
                        cur.execute("update exit_employee_project_details set approve_status='approved' where id=%s"
                                        ,(int(exit_id),))
                        json_data[config.results] = 'NTE-E03'
                cur.execute("""
                        select eed.ename,
                        eed.hrname,eed.hremail,eed.hrcompany,eed.code,eed.status
                        from employee_info  ei
                        inner join ex_employee_details eed
                        on ei.employee_id = eed.emp_id where ei.id=%s and hremail=%s
                         """,(int(get_emp_id),str(hr_email),))
                getemail_values = q.dictfetchall(cur)
                print "-------------getemail_values--------",getemail_values
                for email_data in getemail_values:
                    print "------------------",email_data
                    name = email_data['ename']
                    hrname = email_data['hrname']
                    mail = email_data['hremail']
                    content = '''
                                <p>Dear {0},</p>
                                <p>The NEXT Ex-Employee E-verification Name : <mark>{1}</mark>.</p>
                                <p>Your Login Details</p>
                                <p>User Name : <mark>{2}</mark></p>
                                <p>Password : <mark>{3}</mark></p>
                                <p>Regards,</p> 
                                <p>HCMS Admin</p> 
                                <p>NEXT Inc.</p> 
                        '''.format(str(hrname),str(name),str(email_data['hremail']),str(email_data['code']))
                    print "----------------",name,mail,content
                    otp_status = asyn_email(setting.SENDER_NAME,"E-Verification User name and Password Details",name,mail,str(content),'waiting')
    except Exception as e:
            print e
            json_data[config.results] = 'NTE-E05'
            json_data[config.results] = config.error   
    return HttpResponse(json.dumps(json_data))
    
#Exit Employee Project Details Sync    
def exitEmployeeProjectDetails(request):
    ''' 
    25-Jan-2019 TRU To Exit Employee Project List page data loaded.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: TRU
    '''
    json_data = {}
    try:
            logger_obj.info(' Exit Employee Project listing function by'+str(request.user.username))
            cur = connection.cursor()  #create the database connection
            print "---Exit Employee Project List"
            r1 = eepd.ExitProjectDetails()
            status = r1.exit_project_details()
            if status:
                json_data[config.results] = 'NTE-E01'
            else:
                json_data[config.results] = 'NTE-E02'
    except Exception as e:
            json_data[config.results] = 'NTE-E03'
    return HttpResponse(json.dumps(json_data))

#Exit Request Employee Project list    
def exitEmployeeProjectList(request):
    ''' 
    25-Jan-2019 TRU To Exit Request Employee Project List page data loaded.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: TRU
    '''
    json_data = {}
    try:
            logger_obj.info('Exit Employee Expertise function by'+str(request.user.username))
            cur = connection.cursor()  #create the database connection
            post = request.GET
            emp_id = post.get('id')  #get table key 
            querys = ("select id,approve_status,project_details from exit_employee_project_details where emp_id={}".format(emp_id))  
            cur.execute(querys+" order by project_details");
            values = q.dictfetchall(cur)
            if values:
                     json_data[config.results] = values
            else:
                     json_data[config.results] = []
    except Exception as e:
            print e
            json_data[config.results] = ''
    return HttpResponse(json.dumps(json_data))
    