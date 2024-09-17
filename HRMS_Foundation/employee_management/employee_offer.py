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
import HCMS.settings as settting
import pdfkit,os
#template render html
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from CommonLib.hcms_common import record_validation 
import logging
import logging.handlers
import pdfkit
import datetime
logger_obj = logging.getLogger('logit')

# Employee Offer views here
class EmployeeOffer(TemplateView): # employee page
    ''' 
    21-Nov-2018 TRU to Employee Offer page loaded. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: TRU
    '''
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(EmployeeOffer, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Employee Offer Generation', self.request.user.id)
        if macl:
             template_name = "hrms_foundation/employee_management/employee_offer.html"
        else:
            template_name = "tags/access_denied.html"
        return [template_name]    
        
   
    def get(self, request, *args, **kwargs):
        context = super(EmployeeOffer, self).get_context_data(**kwargs)
        cur = connection.cursor()       
        cur.execute("select id,(name||' '||last_name) as name from employee_info where is_active order by name");
        employee_list = q.dictfetchall(cur)  
        context['employee_list'] = employee_list #Loading Employee Data     
        return self.render_to_response(context)

#get employee offer list    
def getEmployeeOfferList(request):
    ''' 
    21-Nov-2018 TRU To Employee Offer List page data loaded.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: TRU
    '''
    json_data = {}
    try:
            logger_obj.info('Employee offer listing function by'+str(request.user.username))
            cur = connection.cursor()  #create the database connection
            post = request.GET
            status = post.get('status')  #get table key 
            querys = '''select ei.id,(ei.name||' '||ei.last_name) as name,ai.name as profile,rd.role_title,
            to_char(ei.date_of_joining,'dd-mm-yyyy') jd,
            to_char(eoi.created_date,'dd-mm-yyyy') og,
            td.name as tname,ei.work_email,eoi.file_name
            from employee_info ei
            inner join emp_offer_info eoi on ei.id = eoi.employee_id
            inner join hcms_ti_role_details rd on rd.id=ei.role_id_id
            inner join attachment_info ai on ai.id = ei.image_id_id
            inner join team_details_info td on td.id = ei.team_name_id
            where ei.is_active'''  
            if status != 'all':
                print "-----not all----",status
                query = querys+" and ei.name ilike '%{}%'".format(str(status))
                cur.execute(query+" order by ei.name");
                values = q.dictfetchall(cur)
            else:
                print "------all---",status
                cur.execute(querys+" order by ei.name");
                values = q.dictfetchall(cur)
            if values:
                     json_data[config.results] = values
            else:
                     json_data[config.results] = []
    except Exception as e:
            print e
            json_data[config.results] = config.error   
    return HttpResponse(json.dumps(json_data))

#store offer function here
def employeeOfferGenerate(request):
    ''' 
    21-Nov-2018 TRU To Employee add Offer List page data loaded.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: TRU
    '''
    json_data = {}
    try:
            logger_obj.info('Employee add offer listing function by'+str(request.user.username))
            cur = connection.cursor()  #create the database connection
            post = request.POST
            employee_ids = post.get('employee_id').split(',')  #get table key 
            if employee_ids:
                for id in employee_ids:
                    cur.execute("select id from emp_offer_info where employee_id={}".format(int(id)));
                    find_res = cur.fetchall() 
                    file_name = 'NEXT-HCMS-NTE-EOL-{}'.format(id)
                    date = format(datetime.datetime.now()) #set current date time in created date field
                    if find_res:
                        print id,"-update->",find_res[0][0]
                        cur.execute("update emp_offer_info set file_name=%s,modified_by=%s,modified_date=%s where id=%s"
                                    ,(str(file_name+'.pdf'),int(1),str(date),int(find_res[0][0])))
                        htmlTemplate(id,file_name)
                    else:
                        print id,"-add->",find_res
                        cur.execute("insert into emp_offer_info (employee_id,file_name,created_by,created_date) values (%s,%s,%s,%s) returning id"
                                    ,(int(id),str(file_name+'.pdf'),int(1),str(date)))
                        htmlTemplate(id,file_name)
            json_data[config.results] = 'NTE-E01'
    except Exception as e:
            print e
            json_data[config.results] = 'NTE-E02'
            json_data[config.results] = config.error   
    return HttpResponse(json.dumps(json_data))

#template form function here
def htmlTemplate(emp_id,file_name):
    ''' 
    21-Nov-2018 TRU To Employee Offer Template page data loaded.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: TRU
    '''
    json_data = {}
    try:
            logger_obj.info('Employee Offer Template listing function')
            cur = connection.cursor()  #create the database connection
            if emp_id:
                print "---emp_id-->",emp_id
                cur.execute("""
                select ei.id,(ei.name||' '||ei.last_name) as name,ei.work_mobile,ei.work_email,to_char(ei.date_of_joining,'yyyy-mm-dd'),
                rd.role_title,ai.name as profile from employee_info ei
                inner join hcms_ti_role_details rd on rd.id=ei.role_id_id
                inner join attachment_info ai on ai.id = ei.image_id_id where ei.id={}""".format(int(emp_id)));
                find_res = cur.fetchall() 
                if find_res:
                    file_location = 'employee_offer'
                    if not os.path.isdir(settting.MEDIA_ROOT + str(file_location) +'/'): os.mkdir(settting.MEDIA_ROOT + str(file_location) +'/')
                    ipath = str(settting.MEDIA_ROOT +'user_profile/'+str(find_res[0][6]))
                    body = """
                    <!DOCTYPE html>
                    <html>
                    <body>
                    <title>
                    Offer Letter
                    </title>
                    <body>
                    <div style="text-align:center;"> <img src="/home/next/Prod_HCMS/NEXT-HCMS/static/id_card_images/next.png" hieght='50px' width='50px'></div>
                    <div style="text-align:left;"> <img src='"""+ipath+"""' hieght='50px' width='50px'></div>
                    <h4>"""+str(find_res[0][1])+"""</h4>
                    <h5>Contact : +91-"""+str(find_res[0][2])+"""</h5>
                    <h5>E-mail : """+str(find_res[0][3])+"""</h5>
                    <h5>Date : """+str(find_res[0][4])+"""</h5>
                    <hr></hr>
                    <h4>Dear """+str(find_res[0][1])+"""</h4>
                    <p>
                    We are pleased to inform you have been appointed for the position of <b>"""+str(find_res[0][5])+"""</b> at Next Techno Solutions,India.<br>
                    The terms of employment have been attached with this letter. It would be required of you to join us by """+str(find_res[0][4])+""".
                    </p>
                    <p>
                    You can discuss this offer and seek advice on the attached terms and can confirm your response by """+str(find_res[0][4])+""". In<br>
                    case, you wish to discuss the details of the employment terms, please contact with us at """+str(find_res[0][2])+""". In the even that<br>
                    we don not hear from you by the mentioned date, this offer will be automatically withdrawn on that date. We look <br>
                    forward to hearing from you on this subject.
                    </p>
                    <p>Yours sincerely,<p>
                    <p>NEXT HCMS</p>
                    </body>
                    </html>
                    """
                    css = str(settting.employee_offer_css)
                    path = str(str(settting.MEDIA_ROOT) + str(file_location) +'/'+ str(file_name) +'.pdf')
                    pdfkit.from_string(body, path, css=css) #with --page-size=Legal and --orientation=Landscape
                else:
                    print file_name,"-else->",emp_id
            return True
    except Exception as e:
            print e
            return False

#Employee Offer Lettter Email
def employeeOfferEmail(request):
    ''' 
    22-Nov-2018 TRU To Employee Offer Email List page data loaded.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: TRU
    '''
    json_data = {}
    try:
            logger_obj.info('Employee Offer Email listing function by'+str(request.user.username))
            cur = connection.cursor()  #create the database connection
            post = request.POST
            employee_ids = post.get('employee_id').split(',')  #get table key 
            if employee_ids:
                for id in employee_ids:
                    cur.execute("""select ei.id,eoi.file_name,ei.work_email,ei.name||' '||ei.last_name from emp_offer_info eoi
                    inner join employee_info ei on ei.id = eoi.employee_id
                    where ei.id={}""".format(int(id)));
                    from_address = settting.EMAIL_HOST_USER
                    sender_pwd = settting.EMAIL_HOST_PASSWORD 
                    sender_name = settting.SENDER_NAME
                    find_res = cur.fetchall() 
                    date = format(datetime.datetime.now()) #set current date time in created date field
                    attachment = settting.MEDIA_ROOT+'employee_offer/'+find_res[0][1]
                    to_address = find_res[0][2]
                    project_name = 'Transform HCMS'
                    module_name = 'Employee Offer Generation'
                    subject = 'Employee Offer Letter'
                    e_content = 'HCMS Offer Letter Generated Successfully and we attached your offer letter in this mail.kindly check it.<br><br><br><p>Regards,</p><p>HCMS Admin</p>'
                    e_status = 'waiting'
                    if attachment and to_address:
                        cur.execute("insert into asyn_email (project_name,module_name,subject,sender_name,sender_pwd,to_address,from_address,mail_content,mail_status,attachment,created_by,created_date,modified_by,modified_date) values (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) returning id"
                                ,(str(project_name),str(module_name),str(subject),str(sender_name),str(sender_pwd),str(to_address),str(from_address),str(e_content),str(e_status),str(attachment),int(1),str(date),str(1),str(date)))  
            json_data[config.results] = 'NTE-E01'
    except Exception as e:
            print e
            json_data[config.results] = 'NTE-E02'
    return HttpResponse(json.dumps(json_data))
