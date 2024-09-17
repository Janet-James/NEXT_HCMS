from __future__ import unicode_literals
from django.shortcuts import render

import json
from django.views.decorators.csrf import csrf_exempt
from django.http.response import HttpResponse
from CommonLib import query
from django.db import connection
import config
from CommonLib import query as q
from CommonLib.hcms_common import menu_access_control
from datetime import datetime
#template render html
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
import logging
import logging.handlers
import HCMS.settings as settings
import os
import pdfkit
import inflect
from Exit_Management.exit_management.models import EM_ExitDetailsCertification as EDC
from email.MIMEMultipart import MIMEMultipart
from email.MIMEText import MIMEText
import smtplib
from email.mime.base import MIMEBase
from email import encoders
from email.header import Header
from email.utils import formataddr
import urllib2,base64
from email.header import Header
from email.utils import formataddr
from email.mime.application import MIMEApplication
from email.mime.multipart import MIMEMultipart
logger_obj = logging.getLogger('logit')

#Exit Employee List Search function here
def emCertificateList(request):
    ''' 
    30-Aug-2018 TRU To Exit Employee List page data loaded.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: TRU
    '''
    json_data = {}
    try:
            logger_obj.info('Exit Employee listing function by'+str(request.user.username))
            cur = connection.cursor()  #create the database connection
            post = request.GET
            company_id = post.get('id')  #get table key 
            unit_id = post.get('unit_id')  #get table key 
            emp_name = post.get('emp_name')  #get table key 
            querys =  """
                select eed.id,ei.id as emp_id,ei.name||' '||ei.last_name as name,coalesce(rd.role_title,'') as title,coalesce(ai.name,'no_data.png') as image from em_exit_details eed
                inner join employee_info ei on ei.id = eed.emp_id
                left join attachment_info ai on ai.id = ei.image_id_id
                left join hcms_ti_role_details rd on rd.id = ei.role_id_id
                where eed.is_active and eed.department_approve_status and eed.hr_approve_status and
                eed.relieving_status and eed.emp_status and eed.hr_emp_status
            """
            if company_id and not unit_id and not emp_name:
                logger_obj.info( "-----------------  Company --------------------")
                query = querys+" and ei.org_id_id=%s"%int(company_id)
                cur.execute(query+" order by ei.name");
                values = q.dictfetchall(cur)
            elif company_id and unit_id and not emp_name:
                logger_obj.info( "----------------- Company & Unit --------------------")
                query = querys+" and ei.org_id_id=%s"%int(company_id)
                query = query+" and ei.org_unit_id_id=%s"%int(unit_id)
                cur.execute(query+" order by ei.name");
                values = q.dictfetchall(cur)
            elif company_id and unit_id and emp_name:
                logger_obj.info( "----------------- Company & Unit & Empl Name  --------------------")
                query = querys+" and ei.name ilike '%"+str(emp_name)+"%'"
                query = query+" and ei.org_id_id=%s"%int(company_id)
                query = query+" and ei.org_unit_id_id=%s"%int(unit_id)
                cur.execute(query+" order by ei.name");
                values = q.dictfetchall(cur)
            elif company_id and emp_name:
                logger_obj.info( "-----------------  Company & Empl Name   --------------------")
                query = querys+" and ei.name ilike '%"+str(emp_name)+"%'"
                query = query+" and ei.org_id_id=%s"%int(company_id)
                cur.execute(query+" order by ei.name");
                values = q.dictfetchall(cur)
            if values:
                     json_data['results'] = values
            else:
                     json_data['results'] = []
            logger_obj.info('Exit Employee listing response is'+str(json_data)+"attempted by"+str(request.user.username))      
    except Exception as e:
            print e
            json_data['results'] = 'error'   
    return HttpResponse(json.dumps(json_data))

#pdf generate
def generatePdf(bodyContent,fileName,path):
    try:
        options = {
        'page-size': 'A4',
        'margin-top': '0.55in',
        'margin-right': '0.75in',
        'margin-bottom': '0.75in',
        'margin-left': '0.75in',
        }
        css ='static/ui/css/Job_offer_template.css'
        if not os.path.isdir(path): 
              os.mkdir(path) 
        pdfkit.from_string(bodyContent, path+fileName, css=css,options=options) #with --page-size=Legal and --orientation=Landscape
        return True
    except Exception as e:
        logger_obj.error(e)
        return False

#pdf content generate        
def getContent(vals):
    try:
        bodyContent = """ 
                    <!DOCTYPE html>
                    <html>
                       <head>
                          <link rel="stylesheet" href="Job_offer_template.css"/>
                       </head>
                       <body style="text-align:center">
                          <table>
                             <tr>
                                <td> <!--<img src="/static/ui/images/nlogo.png" alt="NEXT" width="200" height="80">--></td>
                                <!--<td style="float:right; padding: 8px; font-size: 26px; color: darkgray;">&nbsp &nbsp &nbsp &nbsp &nbsp Payslip <br/> sp_monsp_yr</td>-->
                             </tr>
                          </table>
                          <h3>NEXT Inc.</h3>
                          <h5 style="background-color:#66b3ff;"><font color="white">  </font></h5>
                          <h5>"""+vals[0]['name']+"""</h5>
                          <h5>"""+vals[0]['title']+"""</h5>
                          <h5>"""+vals[0]['org_name']+"""</h5>
                          <br>
                          <p>
                            Dear """+vals[0]['name']+"""  
                          <br> &nbsp; &nbsp; &nbsp; 
                          To whom It may concern This is to certify that ("""+vals[0]['name']+""") 
                          was appointed in ("""+vals[0]['org_name']+""") as ("""+vals[0]['title']+""") on ("""+vals[0]['join_date']+""") 
                          and that he has worked here up to ("""+vals[0]['relieved_date']+""").
                           According to our knowledge ("""+vals[0]['name']+""") has an excellent track record 
                           and his work has been found satisfactory because of his sincerity,
                            dedication and hard work. We have no problem with him joining any other company. 
                            We wish him every success in his future. For ("""+vals[0]['org_name']+""") 
                            Authorized Signatory read more at: https://nexttechnosolutions.com
                          </p>
                       </body>
                    </html>
                    """
        return bodyContent
    except Exception as e:
        logger_obj.error(e)
        return ''
         
#report save in local server   
def reportGeneration(data,emp_id,exit_id,uid):
    try:
        getContentStatus = getContent(data);
        fileName = ('HCMS_EXIT_EMPLOYEE_ID_%s'%emp_id).replace(' ','_')+'_Exit_Offer.pdf'
        path = settings.MEDIA_ROOT + str('exit_offer') +'/'
        generatePdfStatus = generatePdf(getContentStatus,fileName,path);
        if generatePdfStatus:
               exitStatus= EDC.objects.filter(exit_emp_id=exit_id).values_list('id')
               if exitStatus : 
                   status= EDC.objects.filter(exit_emp_id=exit_id).update(exit_file_name=str(fileName),exit_file_path=str(path),is_active=True,modified_by_id=int(uid))
               else:
                   status= EDC(exit_emp_id=exit_id,exit_file_name=str(fileName),exit_file_path=str(path),is_active=True,modified_by_id=int(uid))
                   status.save()
               return True
        else:
            return False
    except Exception as e:
        logger_obj.error(e)
        return False
        
#Exit Employee Report Generate function here
def emCertificateGenerate(request):
    ''' 
    30-Aug-2018 TRU To Exit Document Generate page data loaded.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: TRU
    '''
    json_data = {}
    try:
            logger_obj.info('Exit Employee Generate listing function by'+str(request.user.username))
            cur = connection.cursor()  #create the database connection
            post = request.GET
            exit_id = post.get('exit_id')  #get table key 
            emp_id = post.get('emp_id')  #get table key 
            querys =  """
                select eed.id,ei.id as emp_id,ei.name||' '||ei.last_name as name,coalesce(rd.role_title,'') as title,coalesce(ai.name,'no_data.png') as image, 
                coalesce(eec.exit_file_name,'no_data.png') as file_name,to_char(eed.emp_resignation_date,'dd-mm-yyyy') resign_date,
                to_char(eed.emp_exp_relieving_date,'dd-mm-yyyy') relieved_date,coalesce(oi.name,'') as org_name,
                coalesce(to_char(ei.date_of_joining,'dd-mm-yyyy'),'') join_date  from em_exit_details eed
                inner join employee_info ei on ei.id = eed.emp_id
                left join attachment_info ai on ai.id = ei.image_id_id
                left join hcms_ti_role_details rd on rd.id = ei.role_id_id
                left join em_exit_certificate_details eec on eec.exit_emp_id = eed.id
                left join organization_info oi on oi.id = ei.org_id_id 
                where eed.is_active and eed.department_approve_status and eed.hr_approve_status and
                eed.relieving_status and eed.emp_status and eed.hr_emp_status
            """
            uid = request.user.id
            if not uid:
                uid = 1
            if exit_id and emp_id:
                logger_obj.info( "-----------------Emp ID & Exit ID--------------------")
                query_cond = querys+" and ei.id=%s"%int(emp_id)
                cur.execute(query_cond+" order by ei.name");
                values = q.dictfetchall(cur);
                report_details = reportGeneration(values,emp_id,exit_id,uid);
                if report_details:
                    cur.execute(query_cond+" order by ei.name");
                    final_values = q.dictfetchall(cur)
                else:
                    final_values = []
            if final_values:
                     json_data['results'] = final_values
            else:
                     json_data['results'] = []
            logger_obj.info('Exit Employee listing response is'+str(json_data)+"attempted by"+str(request.user.username))      
    except Exception as e:
            logger_obj.error(e)
            json_data['results'] = [] 
    return HttpResponse(json.dumps(json_data))

#email send function ehere
def email_send(email,mail_subject,email_content,file_name): 
    try:
        to_addr = email  
        subject = mail_subject
        fromaddress = "lumino@nexttechnosolutions.co.in" 
        fromaddr = formataddr((str(Header(u'HR Administrator', 'utf-8')), fromaddress))
        pwd = "welcome123"
        recipients = to_addr
        msg = MIMEMultipart()
        msg['From'] = fromaddr 
        msg['Subject'] = subject 
        body = email_content
        if file_name:
              path = settings.MEDIA_ROOT + str('exit_offer') +'/'
              part = MIMEApplication(open(os.path.join(path)+file_name,"rb").read())
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
        return True
    except Exception as e:
        logger_obj.error(e)
        return False
            
#certificate send function here
def emCertificateSend(request):
    ''' 
    30-Aug-2018 TRU To Exit Document Mail Send data loaded.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: TRU
    '''
    json_data = {}
    try:
        querys =  """
                select eed.id,ei.id as emp_id,ei.name||' '||ei.last_name as name,coalesce(rd.role_title,'') as title,coalesce(ai.name,'no_data.png') as image,ei.work_email as email, 
            coalesce(eec.exit_file_name,'no_data.png') as file_name,to_char(eed.emp_resignation_date,'dd-mm-yyyy') resign_date,to_char(eed.emp_exp_relieving_date,'dd-mm-yyyy') relieved_date  from em_exit_details eed
            inner join employee_info ei on ei.id = eed.emp_id
            left join attachment_info ai on ai.id = ei.image_id_id
            left join hcms_ti_role_details rd on rd.id = ei.role_id_id
            left join em_exit_certificate_details eec on eec.exit_emp_id = eed.id
            where eed.is_active and eed.department_approve_status and eed.hr_approve_status and
            eed.relieving_status and eed.emp_status and eed.hr_emp_status
            """
        mail_subject = "Exit Document From NEXT Inc."
        cur = connection.cursor()  #create the database connection
        post = request.GET
        emp_id = post.get('emp_id')  #get table key 
        query_cond = querys+" and ei.id=%s"%int(emp_id)
        cur.execute(query_cond+" order by ei.name");
        values = q.dictfetchall(cur);
        email_content = "Hi "+str(values[0]['name'])+", Your Exit letter we attached it.kindly check it."
        status = email_send(str(values[0]['email']),mail_subject,email_content,str(values[0]['file_name']))
        json_data['results'] = 'send';
    except Exception as e:
        logger_obj.error(e)
        json_data['results'] = 'error';
    return HttpResponse(json.dumps(json_data))