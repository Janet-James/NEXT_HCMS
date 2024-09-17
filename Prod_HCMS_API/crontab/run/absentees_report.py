#!/usr/bin/python2.7
#
# Small script to show PostgreSQL and Pyscopg together
#

from email.MIMEMultipart import MIMEMultipart
from email.MIMEText import MIMEText
from datetime import date, timedelta
import smtplib
from email.mime.base import MIMEBase
from email import encoders
from email.header import Header
from email.utils import formataddr
from itertools import groupby
from operator import itemgetter
import logging
from datetime import datetime, timedelta
from time import gmtime, strftime
_logger = logging.getLogger(__name__) 
import psycopg2
mail_counts=0
import urllib,urllib2
import json, math
from datetime import timedelta 
from email.mime.text import MIMEText
import datetime as test1
import numpy
from jinja2 import Environment 
#scheduler class
class accounting(): 
    def __init__(self):
        self.fromaddress = "lumino@nexttechnosolutions.co.in"
        self.server = smtplib.SMTP('smtp.yandex.com', 587)
        self.server.starttls() 
        self.server.login(self.fromaddress, "welcome123")

    def content_merge(self,email_data,body):
        indian_today  = datetime.now().strftime('%d-%m-%Y')
    #indian_today = '28-11-2018'
        email_content1 = """<!DOCTYPE html> 
<html> 
  <head>
    <meta id="viewport" name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
    <title>Responsive Email Template</title>
    <style> 
    @import url(https://fonts.googleapis.com/css?family=Calibri);
    </style>
  </head> 
  <body leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" style="font-family:'Calibri'" bgcolor="#fff">
  {{body}}
    <!-- Wrapper -->
    <table bgcolor="#e9f5fb" align="center" cellpadding="0" style="font-family:'Calibri'" cellspacing="0" width="100%">
      <tr>
        <td>
          <table border="0" cellpadding="0" cellspacing="0" width="100%" >
            <tr>
              <td align="center" bgcolor="#726627" style="background-color:#e9f5fb;" valign="top">
                <br>
                  <br>
                    <table align="center" border="0" cellpadding="0" cellspacing="0" class="deviceWidth" style="margin-top: 0px" width="804px">
                      <tr>
                        <td bgcolor="#FFFFFF" width="100%">
                          <!-- Logo -->
                          <table align="left" border="0" cellpadding="0" cellspacing="0" class="deviceWidth" style="height:200px; background:url(http://npower.nexttechnosolutions.com/static/performance_dashboard/img/header.jpg) no-repeat;" width="100%; ">
                            <tr>
                              <td valign="Center" style="font-family:'Calibri';font-size: 27px; padding-left: 20px;font-weight: 500; ">Absentees Report
                                <br>
                                      {{indian_today}}
                                </td>
                              </tr>
                            </table>
                            <!--<tr><td valign="top"><span style="color:#7d7d7d; font-size:12px; float:right; padding:5px 5px">Vol.no.2017/27/4 &nbsp; 06 July 2017</span></td></tr></table>
                            <!-- End Logo -->
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <table align="center" cellpadding="0" cellspacing="0" border="0" width="800">
                        <tr>
                          <td bgcolor="#fff" valign="top" width="100%">
                            <table width="100%" cellpadding="0" cellspacing="0" height="60">
                              <tr>
                                <td width="800" align="center" bgcolor="" style="font-family:'Calibri';font-size: 18px; color: #00afff;font-weight: 500; text-align: left; vertical-align: top; padding:5px 20px">Absentees for the day {{indian_today}}</td>
                              </tr>
                            </table>
                            <table width="760" align="center" border="0">
                              <tbody>
                              {% for data in email_data %}
                                <tr>
                                  <td width="63" rowspan="2">
                                    <div>
                                      <img style="width: 50px; height: 50px; object-fit: cover;border-radius: 100%;" src="http://mynext.nexttechnosolutions.com/media/user_profile/{{data.employee_image}}"/>
                                    </div>
                                  </td>
                                  <td width="111" style="font-size:15px;font-weight: 500;font-family:'Calibri';">{{data.employee_name}}</td>
                                  <td width="101" align="center" style="font-size:15px;font-weight: 500;font-family:'Calibri';">Is it Approved</td>
                                  <td width="60" align="left" style=" color: #fff ">
                                      {%if data.state=="Open"%}
                                    <img src="http://npower.nexttechnosolutions.com/static/performance_dashboard/img/open.png"/>
                                    {%elif data.state=="-"%}
                                    <img src="http://npower.nexttechnosolutions.com/static/performance_dashboard/img/no.png"/>
                                    {%else%}
                                    <img src="http://npower.nexttechnosolutions.com/static/performance_dashboard/img/approved.png"/>
                                    {% endif %}
                                  </td>
                                  <td width="39" align="right">
                                    {%if data.reason=="Leave of Absence" %}
                                    <img src="http://npower.nexttechnosolutions.com/static/performance_dashboard/img/performance.png"/>
                                    {%elif data.state=="Sick Leave"%}
                                    <img src="http://npower.nexttechnosolutions.com/static/performance_dashboard/img/sick.png"/>
                                    {%elif data.state=="Casual Leave"%}
                                    <img src="http://npower.nexttechnosolutions.com/static/performance_dashboard/img/casual.png"/>
                                    {%elif data.state=="-"%}
                                    <img />
                                    {%else%}
                                    <img src="http://npower.nexttechnosolutions.com/static/performance_dashboard/img/performance.png"/>
                                    {%endif%}
                                  </td> 
                                  {%if data.reason=="-" %}
                                  <td width="89" align="center" style="font-size:12px; font-weight: 500;font-family:'Calibri';" ></td>
                                  {%else%}
                                  <td width="89" align="center" style="font-size:12px; font-weight: 500;font-family:'Calibri';" >{{data.reason}}</td>
                                  {%endif%}
                                  <td width="109" align="center" style="font-size:15px; font-weight: 500;font-family:'Calibri';" >Project Name</td>
                                  <td width="88" align="center" style="font-size:15px; font-weight: 500;font-family:'Calibri';">Impact</td>
                                  <td width="62" align="center" style="font-size: 14px; font-weight: 500;font-family:'Calibri';">Leaves so far</td>
                                </tr>
                                <tr>
                                  <td align="top" valign="top" style="color: #797474; font-size:15px;font-family:'Calibri';">{{data.team_name}}</td>
                                  {%if data.reason=="-" %}
                                  <td colspan="2" align="center" style="font-size:15px; color:#cd1212;font-family:'Calibri';">Leave Not Applied</td>
                                  {%else%}
                                  <td colspan="2" align="center" style="font-size:15px; color:#119c35;font-family:'Calibri';">Leave Applied</td>
                                  {%endif%}
                                  {%if data.reason=="-" %}
                                  <td colspan="2" align="center" style="font-size:15px; color:#cd1212;font-family:'Calibri';">HCMS Not Recorded</td>
                                  {%else%}
                                  <td colspan="2" align="center" style="font-size:15px; color:#119c35;font-family:'Calibri';">HCMS Recorded</td>
                                  {%endif%}
                                  <td width="109" align="center" style="font-size:15px; color:#ea9c33;font-family:'Calibri';">{{data.project_name}}</td>
                                  <td width="88" align="center">
                                   {%if data.impact=="H"%}
                                    <img src="http://npower.nexttechnosolutions.com/static/performance_dashboard/img/high.png"/>
                                    {%else%}
                                    <img src="http://npower.nexttechnosolutions.com/static/performance_dashboard/img/low.png"/>
                                    {%endif%}
                                  </td>
                                  <td width="62" align="center" style="font-size:15px; color:#cd1212;font-family:'Calibri';">{{data.nol}} Days</td>
                                </tr>
                                {% endfor %}
                              </tbody>
                            </table>
                            <table width="100%" height="60">
                              <tr>
                                <td width="800" align="center" style="font-size:15px; color: #000;; text-align: left;  padding:5px 25px;font-family:'Calibri';">Thanks</td>
                              </tr>
                              <tr>
                                <td width="800" align="center" style="font-size:15px; color: #000;; text-align: left;  valign:top; padding:0px 25px;font-family:'Calibri';">Business Services Team</td>
                              </tr>
                            </table>
                            <table width="723"  align="center" border="0">
                              <tbody>
                                <tr>&nbsp;</tr>
                                <tr>
                                  <td width="43" valign="top" rowspan="2">
                                    <img src="http://npower.nexttechnosolutions.com/static/performance_dashboard/img/tips.png"/>
                                  </td>
                                  <td width="188" style="font-size:15px;font-weight: 600;">TIPS</td>
                                  <td width="45" valign="top" rowspan="2">
                                    <img src="http://npower.nexttechnosolutions.com/static/performance_dashboard/img/tips.png"/>
                                  </td>
                                  <td width="188"  style="font-size:15px;font-weight: 600;">TIPS</td>
                                  <td width="45" valign="top" rowspan="2">
                                    <img src="http://npower.nexttechnosolutions.com/static/performance_dashboard/img/tips.png"/>
                                  </td>
                                  <td width="188" style="font-size:15px;font-weight: 600;">TIPS</td>
                                </tr>
                                <tr>
                                  <td style="font-size:10px;">All leaves must be raised through Mynext, so that leave request processed to next level. </td>
                                  <td style="font-size:10px;">You can view whether the leave is approved or rejected.</td>
                                  <td style="font-size:10px;">Displays the project in which employee is working and its impacts. Can view the details of the leaves so far.</td>
                                </tr>
                              </tbody>
                            </table>
                            <table width="800" border="0">
                              <tbody>
                                <tr>&nbsp;</tr>
                                <tr>
                                  <td width="100%" style="font-size:16px;font-weight: 600;color:#00afff; padding-left: 30px; text-decoration: underline;">Reply to transformaxis@nexttechnosolutions.co.in email to comment on this update</td>
                                 
                                        </tr>
                                        <tr>
                                          <td colspan="2">
                                            <table align="left" border="0" cellpadding="0" cellspacing="0" class="deviceWidth" style="height:42px; background:url(http://npower.nexttechnosolutions.com/static/performance_dashboard/img/footer.png) no-repeat;" width="800">
                                              <tr>
                                                <td width="216"  align="center" style="color:#fff;font-size:16px; font-weight: 500;">Mynext</td>
                                                <td width="411" style="font-size:15px;font-weight:300;color:#fff;">View this Updates in http://mynext.nexttechnosolutions.com</td>
                                                <td width="40" align="center" style="padding-top: 5px">
                                                  <img src="http://npower.nexttechnosolutions.com/static/performance_dashboard/img/notification.png"/>
                                                </td>
                                                <td width="40" align="center" style="padding-top: 5px">
                                                  <img src="http://npower.nexttechnosolutions.com/static/performance_dashboard/img/pin.png"/>
                                                </td>
                                                <td width="40" align="center" style="padding-top: 5px">
                                                  <img src="http://npower.nexttechnosolutions.com/static/performance_dashboard/img/like.png"/>
                                                </td>
                                                <td width="57">&nbsp;</td>
                                              </tr>
                                            </table>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <table align="center" bgcolor="#e9f5fb" cellpadding="0" cellspacing="0" class="deviceWidth"  style="margin-left:2px;" width="800" height="30">
                                      <tr>
                                        <td width="637"  align="center" valign="center" bgcolor="#e9f5fb" style="padding-left: 157px;font-size: 10px; font-weight: 500;"> @ 2018 Mynext All rights Reserved</td>
                                        <td width="40"  align="center" valign="center" style="padding-top: 5px">
                                          <img src="http://npower.nexttechnosolutions.com/static/performance_dashboard/img/facebook.png"/>
                                        </td>
                                        <td width="40"  align="center" valign="center" style="padding-top: 5px">
                                          <img src="http://npower.nexttechnosolutions.com/static/performance_dashboard/img/linkedin.png"/>
                                        </td>
                                        <td width="40"  align="center" valign="center" style="padding-top: 5px">
                                          <img src="http://npower.nexttechnosolutions.com/static/performance_dashboard/img/mail.png"/>
                                        </td>
                                        <td width="40"  align="center" valign="center" style="padding-top: 5px" >
                                          <img src="http://npower.nexttechnosolutions.com/static/performance_dashboard/img/youtube.png"/>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                              <span style="font-size: 10px"></span>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </body>
              </html>"""
        msg = MIMEText(
            Environment().from_string(email_content1).render(
            email_data=email_data,body=body,indian_today = indian_today
            ), "html"
        )
        return msg
    
    def appendInt(self,num):
        if num > 9:
            secondToLastDigit = str(num)[-2]
            if secondToLastDigit == '1':
                return 'th'
        lastDigit = num % 10
        if (lastDigit == 1):
            return 'st'
        elif (lastDigit == 2):
            return 'nd'
        elif (lastDigit == 3):
            return 'rd'
        else:  
            return 'th'
        
    #Returns all rows from a cursor as a dictionary
    def dictfetchall(self,cursor):
        "Returns all rows from a cursor as a dictionary."
        """
            Returns all rows from a cursor as a dictionary
            @param cursor:cursor object
            @return: dictionary contains the details fetch from the cursor object
            @rtype: dictionary
    """
        desc = cursor.description
        return [
        dict(zip([col[0] for col in desc], row))
        for row in cursor.fetchall()
        ]
     
    def accounting_email(self,email_content): 
            indian_today  = datetime.now().strftime('%d-%B-%Y')
        #indian_today = '28-November-2018' 
            day_format = indian_today.split('-')
            date_format = self.appendInt(int(day_format[0]))
            full_day = str(int(day_format[0]))+date_format+' '+day_format[1]+' '+day_format[2]
            fromaddr = formataddr((str(Header(u'Business Services Team', 'utf-8')), 'lumino@nexttechnosolutions.co.in'))
            #bccaddress = ['karthika.sokkalingam@nexttechnosolutions.com',"jahirhussain.abdulsalam@nexttechnosolutions.com"]
            bccaddress = ['karthika.sokkalingam@nexttechnosolutions.com']
#             if reporting_officer:
#                 ccaddress = ["hcm@nexttechnosolutions.com","finac@nexttechnosolutions.com"]
#                 ccaddress1 = ["Human Capital Management <hcm@nexttechnosolutions.com>","Finance <finac@nexttechnosolutions.com>"]
#             else:
#                 ccaddress = ["hcm@nexttechnosolutions.com","finac@nexttechnosolutions.com"]
#                 ccaddress1 = ["Human Capital Management <hcm@nexttechnosolutions.com>","Finance <finac@nexttechnosolutions.com>"]
            #bccaddress = "sivanesh.sivasami@nexttechnosolutions.co.in"
            msg = MIMEMultipart()
            toaddr = ["hcm@nexttechnosolutions.com","finac@nexttechnosolutions.com"]
            msg['From'] = fromaddr
            msg['To'] = ", ".join(toaddr)
#             msg['Cc'] = ", ".join(ccaddress1)
            msg['Bcc'] =   ", ".join(bccaddress)
            msg['Subject'] = "Who are all absent today, "+full_day+"?"  
            body = email_content
            msg.attach(body)
            text = msg.as_string()
            to_addrs = toaddr+bccaddress   
            print "Management  to_addrs =>",to_addrs
	    try:
            	  self.server.sendmail(fromaddr,to_addrs, text)
            	  
	    except Exception as e:
                   self.server = smtplib.SMTP('smtp.yandex.com', 587)
		   self.server.starttls()
		   self.server.login(self.fromaddress, "welcome123") 
		   self.server.sendmail(fromaddr,to_addrs, text)

        

    def team_wise_email(self,email_content,team,reporting_officer):
            indian_today  = datetime.now().strftime('%d-%B-%Y')
            day_format = indian_today.split('-')
            date_format = self.appendInt(int(day_format[0]))
            full_day = str(int(day_format[0]))+date_format+' '+day_format[1]+' '+day_format[2]
            fromaddr = formataddr((str(Header(u'Business Services Team', 'utf-8')), 'lumino@nexttechnosolutions.co.in'))
            bccaddress = ['karthika.sokkalingam@nexttechnosolutions.com']
            if reporting_officer:
                ccaddress = ["hcm@nexttechnosolutions.com","finac@nexttechnosolutions.com"]
                ccaddress1 = ["Human Capital Management <hcm@nexttechnosolutions.com>","Finance <finac@nexttechnosolutions.com>"]
            else:
                ccaddress = ["hcm@nexttechnosolutions.com","finac@nexttechnosolutions.com"]
                ccaddress1 = ["Human Capital Management <hcm@nexttechnosolutions.com>","Finance <finac@nexttechnosolutions.com>"]
            #bccaddress = "sivanesh.sivasami@nexttechnosolutions.co.in"
            msg = MIMEMultipart()
            toaddr = [reporting_officer] 
            msg['From'] = fromaddr
            msg['To'] = ", ".join(toaddr) 
            msg['Cc'] = ", ".join(ccaddress1)  
            msg['Bcc'] =   ", ".join(bccaddress)
            msg['Subject'] = "Team "+team+" Project Risk due to Resource Absence for "+full_day
            body = email_content 
            msg.attach(body)  
            text = msg.as_string()
            to_addrs = toaddr+ccaddress+bccaddress
            
            print " Team to_addrs =>",to_addrs
            try: 

            	  self.server.sendmail(fromaddr,to_addrs, text)
            	   
	    except Exception as e:
			self.server = smtplib.SMTP('smtp.yandex.com', 587)
			self.server.starttls()
			self.server.login(self.fromaddress, "welcome123")
			self.server.sendmail(fromaddr,to_addrs, text) 

	    
    def individual_email(self,email_content,reporting_officer):

            indian_today  = datetime.now().strftime('%d-%B-%Y')
            day_format = indian_today.split('-')
            date_format = self.appendInt(int(day_format[0])) 
            full_day = str(int(day_format[0]))+date_format+' '+day_format[1]+' '+day_format[2]
            fromaddr = formataddr((str(Header(u'Business Services Team', 'utf-8')), 'lumino@nexttechnosolutions.co.in'))
            bccaddress = ['karthika.sokkalingam@nexttechnosolutions.com']
            if reporting_officer:
                ccaddress = ["hcm@nexttechnosolutions.com","finac@nexttechnosolutions.com"]
                ccaddress1 = ["Human Capital Management <hcm@nexttechnosolutions.com>","Finance <finac@nexttechnosolutions.com>"]
            else:
                ccaddress = ["hcm@nexttechnosolutions.com","finac@nexttechnosolutions.com"]
                ccaddress1 = ["Human Capital Management <hcm@nexttechnosolutions.com>","Finance <finac@nexttechnosolutions.com>"]
            #bccaddress = "sivanesh.sivasami@nexttechnosolutions.co.in"
            msg = MIMEMultipart()
            toaddr = [reporting_officer]
            msg['From'] = fromaddr
            msg['To'] = ", ".join(toaddr)
            msg['Cc'] = ", ".join(ccaddress1)
            msg['Bcc'] =   ", ".join(bccaddress) 
            msg['Subject'] = "You have been / were absent on "+full_day
            body = email_content
            msg.attach(body)
            text = msg.as_string()
            to_addrs = toaddr+ccaddress+bccaddress
            print " Individual to_addrs =>",to_addrs
            try: 
            	  self.server.sendmail(fromaddr,to_addrs, text)
		  
	    except Exception as e:
                   self.server = smtplib.SMTP('smtp.yandex.com', 587)
		   self.server.starttls() 
		   self.server.login(self.fromaddress, "welcome123") 
		   self.server.sendmail(fromaddr,to_addrs, text)


    def management_report(self):    

        '''Scheduler function for generate daily task report based on particular period of time.
        Fetch all employee details who are need to enter the task report into transform portal
        except who are in Exclude user list and who are not in active state in Human Resource Employee'''
        try:
 
            today = datetime.now().strftime('%Y-%m-%d')
            indian_today  = datetime.now().strftime('%d-%m-%Y')
        #today = '2018-11-28'
        #indian_today = '28-11-2018' 
            today = today
            
                
            conn = psycopg2.connect("dbname='P5S_4' user='next' host='192.168.10.67' password='next'")
            cr = conn.cursor()

            
            hrms_conn = psycopg2.connect("dbname='live_hcms' user='next' host='192.168.10.42' password='N3XT@9966'")
            hrms_cr = hrms_conn.cursor()
            body_content = ''
            cr.execute("""select id as user_id,employee_name,team_name,employee_image from auth_user 
            where id not in(select user_id from p5s_attendance
            where check_in::date= %s and (check_in_time - interval '330' minute) :: time <= '08:16:00') and is_active and 
            employee_name is not null and id not in (246,22037,1,22024,22027,22025,22018,21998,22023,22026,22029,76)
             order  by team_name,employee_name""",(today,))
        #Bharathi id 22029  
#246 exos saravanan id
            result = self.dictfetchall(cr) 
            if result:  

                management_list = [] 
                for i in result:
                    management_dict = {}  
                    if i['team_name'] != '':    
                        team_name = str(i['team_name'])+' - '    
                    else: 
                        team_name = ''
                    hrms_cr.execute("""select * from leave_info  hl inner join employee_info he on he.id = hl.leave_employee_id_id inner join auth_user au on au.id = he.related_user_id_id 
                                        inner join  reference_items lt on lt.id=hl.type_id_id
                                        where  au.id =%s and hl.from_date::date= %s and lt.refitems_code='PEMSN' and hl.is_active and he.is_active and au.is_active and lt.is_active""",(i['user_id'],today,))
                    permission_check = self.dictfetchall(hrms_cr)
                    if permission_check:
                        continue   
                    hrms_cr.execute("""select * from employee_info he inner join  reference_items ri on ri.id = he.type_id_id 
                    inner join auth_user au on au.id = related_user_id_id where au.id = %s and ri.refitems_code!='NCNTR'  and au.is_active and he.is_active  """,(i['user_id'],)) #and he.type_id_id != 310
                    contract = self.dictfetchall(hrms_cr)   
                    if contract:
                        continue   
                    '''hrms_cr.execute("""select * from hr_employee he inner join  reference_items ri on ri.id = he.type_id_id 
                            inner join auth_user au on au.id = related_user_id where au.id = %s and he.employee_work_location_id = 339""",(i['user_id'],))
                            onsite = self.dictfetchall(hrms_cr)
                            if onsite:
                                continue
                    ''' 
                    hrms_cr.execute("""select description,st.refitems_name as state,to_char(hl.created_date,'DD-MM-YYYY')as applied_date,number_of_days,ri.refitems_name from leave_info hl 
                        inner join  employee_info he on he.id = hl.leave_employee_id_id
                        inner join reference_items ri on ri.id = hl.type_id_id
                        inner join reference_items st on st.id = hl.state_id
                        inner join auth_user au on au.id = he.related_user_id_id where au.id = %s and from_date::date<= %s and to_date>= %s
                        """,(i['user_id'],today,today,))  
                    hrms_result = self.dictfetchall(hrms_cr)
                    cr.execute("""select project_name  from work_summary_info wsi inner join project_task_info pti on pti.id = wsi.project_task_id
                                inner join project_info pi on pi.id = pti.project_id where wsi.created_by = %s 
                                order by wsi.created_date desc limit 1""",(i['user_id'],))
                    project_result = self.dictfetchall(cr) 
                    if project_result:
                        project_name = project_result[0]['project_name']
                    else: 
                        project_name = '-' 
                    cr.execute("select * from project_task_info where task_start_date::date>=%s and assigned_to_id = %s ",(today,i['user_id'],))
                    impact_result = self.dictfetchall(cr)  
                    if impact_result: 
                        impact = 'H' 
                        tr_bgcolor = """<tr style="background-color: #f443362e;">""" 
                    else:
                        tr_bgcolor = """<tr style="background-color: #f1fbff;">""" 
                        impact = 'L' 
                    hrms_cr.execute("""select sum(number_of_days) as nol_res,leave_employee_id_id from leave_info hl
                                    inner join  employee_info he on he.id = hl.leave_employee_id_id
                                    inner join auth_user au on au.id = he.related_user_id_id 
                                    inner join reference_items lt  on lt.id= hl.type_id_id
                                    where au.id =%s and au.is_active and lt.refitems_code !='PEMSN'
                                    and he.is_active and hl.is_active and au.is_active and lt.is_active and  date_part('year', hl.from_date) = date_part('year', CURRENT_DATE) group by leave_employee_id_id """,(i['user_id'],))
                    nol_res = self.dictfetchall(hrms_cr) 
                    if nol_res:  
                        nol = nol_res[0]['nol_res']  
                    else: 
                        nol = 0   
                    if numpy.isnan(nol):  
                        nol = 0
                    if hrms_result:
                        management_dict['colour']=tr_bgcolor
                        management_dict['user_id'] = i['user_id']
                        management_dict['employee_image'] = i['employee_image'] 
                        management_dict['team_name'] = team_name
                        management_dict['employee_name'] = i['employee_name']
                        management_dict['state'] = hrms_result[0]['state']
                        management_dict['applied_date'] = hrms_result[0]['applied_date']
                        management_dict['reason'] = hrms_result[0]['refitems_name']
                        management_dict['status'] = 'Yes'
                        management_dict['project_name'] = project_name 
                        management_dict['impact'] = impact
                        management_dict['number_of_days'] = hrms_result[0]['number_of_days']
                        management_dict['nol'] = nol
                        management_list.append(management_dict)
                    else:
                        management_dict['colour']=tr_bgcolor 
                        management_dict['user_id'] = i['user_id']
                        management_dict['employee_image'] = i['employee_image']
                        management_dict['team_name'] = i['team_name']
                        management_dict['employee_name'] = i['employee_name']
                        management_dict['state'] = '-' 
                        management_dict['applied_date'] = '-' 
                        management_dict['reason'] = '-'
                        management_dict['status'] = 'No'
                        management_dict['project_name'] = project_name
                        management_dict['impact'] = impact 
                        management_dict['number_of_days'] = '-'   
                        management_dict['nol'] = nol
                        management_list.append(management_dict) 
                value = self.content_merge(management_list,"""<p style="color:#262626;font-family:'Calibri'">Hi All,</p><p style="font-family:'Calibri';color:#262626;">Please find the Who are all absent Today Report """+indian_today+""".</p>""")
                self.accounting_email(value)

        except ValueError as test:
     
            print(test)
        finally:
            if conn:
                conn.commit()   
                conn.close()
        self.server.quit()
                 
    def teamwise_report(self):   
        '''Scheduler function for generate daily task report based on particular period of time.
        Fetch all employee details who are need to enter the task report into transform portal
        except who are in Exclude user list and who are not in active state in Human Resource Employee'''
        try:
            today = datetime.now().strftime('%Y-%m-%d')
            indian_today  = datetime.now().strftime('%d-%m-%Y')
            today = today  
            current_date = datetime.now()
            conn = psycopg2.connect("dbname='P5S_4' user='next' host='192.168.10.67' password='next'")
            cr = conn.cursor()
            
            hrms_conn = psycopg2.connect("dbname='live_hcms' user='next' host='192.168.10.42' password='N3XT@9966'")
            hrms_cr = hrms_conn.cursor() 
            cr.execute("""select id as user_id,employee_name,team_name,employee_image from auth_user where id not in(select user_id from p5s_attendance
            where check_in::date= %s and (check_in_time - interval '330' minute) :: time <= '08:16:00') and is_active and 
            employee_name is not null and team_name != '' and team_name != 'NEO' and id not in (246,22037,1,22024,22027,22025,22018,21998,22023,22026,22029,76)  order  by team_name,employee_name""",(today,))
        #22029 Bharathi id
#246 exos saravanan id
            result = self.dictfetchall(cr)
            if result:
                getState = itemgetter('team_name')
                for key, group in groupby(result, getState):
                    team = key 
                    management_list = []
                    project_list = []  
                    project_id = []
                    for i in group:
                        print i['user_id']
                        hrms_cr.execute("""select * from leave_info  hl inner join employee_info he on he.id = hl.leave_employee_id_id inner join auth_user au on au.id = he.related_user_id_id 
                                        inner join  reference_items lt on lt.id=hl.type_id_id
                                        where  au.id =%s and hl.from_date::date= %s and lt.refitems_code='PEMSN' and hl.is_active and he.is_active and au.is_active and lt.is_active """,(i['user_id'],today))
                        permission_check = self.dictfetchall(hrms_cr)
                        if permission_check:
                            continue
                        hrms_cr.execute("""select * from employee_info he inner join  reference_items ri on ri.id = he.type_id_id 
                        inner join auth_user au on au.id = related_user_id_id where au.id = %s  and ri.refitems_code!='NCNTR' and au.is_active and he.is_active """,(i['user_id'],))
                        contract = self.dictfetchall(hrms_cr)
                        if contract: 
                            continue
                        '''hrms_cr.execute("""select * from hr_employee he inner join  reference_items ri on ri.id = he.type_id_id 
                               inner join auth_user au on au.id = related_user_id where au.id = %s and he.employee_work_location_id = 339""",(i['user_id'],))
                               onsite = self.dictfetchall(hrms_cr)
                               if onsite:
                           continue
                          '''
                        management_dict = {} 
                        hrms_cr.execute("""select description,st.refitems_name as state,to_char(hl.created_date,'DD-MM-YYYY')as applied_date,number_of_days,ri.refitems_name from leave_info hl 
                        inner join  employee_info he on he.id = hl.leave_employee_id_id
                        inner join reference_items ri on ri.id = hl.type_id_id
                        inner join reference_items st on st.id = hl.state_id
                        inner join auth_user au on au.id = he.related_user_id_id where au.id = %s and from_date::date<= %s and to_date>= %s
                            """,(i['user_id'],today,today,))
                        hrms_result = self.dictfetchall(hrms_cr)
                        cr.execute("""select pi.id as project_id,project_name  from work_summary_info wsi inner join project_task_info pti on pti.id = wsi.project_task_id
                                    inner join project_info pi on pi.id = pti.project_id where wsi.created_by = %s 
                                    order by wsi.created_date desc limit 1""",(i['user_id'],))
                        project_result = self.dictfetchall(cr)
                        if project_result:
                            project_id.append(project_result[0]['project_id'])
                            project_list.append(project_result[0]['project_name'])
                            project_name = project_result[0]['project_name'] 
                        else: 
                            project_name = '-'
                        cr.execute("select * from project_task_info where task_start_date::date>=%s and assigned_to_id = %s ",(today,i['user_id'],))
                        impact_result = self.dictfetchall(cr)
                        if impact_result:
                            impact = 'H'
                            tr_bgcolor = """<tr style="background-color: #f443362e;">""" 
                        else:
                            tr_bgcolor = """<tr style="background-color: #f1fbff;">"""
                            impact = 'L'
                        hrms_cr.execute("""select sum(number_of_days) as nol_res,leave_employee_id_id from leave_info hl
                                    inner join  employee_info he on he.id = hl.leave_employee_id_id
                                    inner join auth_user au on au.id = he.related_user_id_id 
                                    inner join reference_items lt  on lt.id= hl.type_id_id
                                    where au.id =%s and au.is_active and lt.refitems_code !='PEMSN'
                                    and he.is_active and hl.is_active and au.is_active and lt.is_active and  date_part('year', hl.from_date) = date_part('year', CURRENT_DATE) group by leave_employee_id_id 
                                    """,(i['user_id'],))
                        nol_res = self.dictfetchall(hrms_cr)
                        if nol_res:
                            nol = nol_res[0]['nol_res']
                        else:
                            nol = 0
                        if numpy.isnan(nol):
                            nol = 0  
                        if hrms_result:
                            management_dict['colour']=tr_bgcolor
                            management_dict['user_id'] = i['user_id']
                            management_dict['employee_image'] = i['employee_image']
                            management_dict['team_name'] = key
                            management_dict['employee_name'] = i['employee_name'] 
                            management_dict['state'] = hrms_result[0]['state']
                            management_dict['applied_date'] = hrms_result[0]['applied_date']
                            management_dict['reason'] = hrms_result[0]['refitems_name']
                            management_dict['status'] = 'Yes'
                            management_dict['project_name'] = project_name
                            management_dict['impact'] = impact
                            management_dict['number_of_days'] = hrms_result[0]['number_of_days']
                            management_dict['nol'] = nol
                            management_list.append(management_dict)
                        else: 
                            management_dict['colour']=tr_bgcolor
                            management_dict['user_id'] = i['user_id']
                            management_dict['employee_image'] = i['employee_image']
                            management_dict['team_name'] = key
                            management_dict['employee_name'] = i['employee_name']
                            management_dict['state'] = '-'
                            management_dict['applied_date'] = '-'
                            management_dict['reason'] = '-'
                            management_dict['status'] = 'No'
                            management_dict['project_name'] = project_name
                            management_dict['impact'] = impact
                            management_dict['number_of_days'] = '-' 
                            management_dict['nol'] = nol
                            management_list.append(management_dict)
                    if team == 'Business Analyst':
                        title = 'Mrs'
                        name = "Madula Thamburaja"
                        reporting_officer = "madula.thamburaja@nexttechnosolutions.co.in"
                    elif team == 'TQA':  
                        title = 'Mr'
                        name = "Bernard George"
                        reporting_officer = "bernard@nexttechnosolutions.com"
                    elif team == 'Finance':
                        title = 'Mr'
                        name = "Bernard George"
                        reporting_officer = "bernard@nexttechnosolutions.com"
                    elif team == 'EXOS': 
                        title = 'Mr'
                        name = "Saravanakumar Doraiswami" 
                        reporting_officer = "saravanakumar.doraiswami@nexttechnosolutions.co.in" 
                    elif team == 'GEO':
                        title = 'Mr'
                        name = "Rajasekar Ganesan" 
                        reporting_officer = "rajasekar.ganesan@nexttechnosolutions.com"
                    elif team == 'GML':
                        title = 'Mr'
                        name = "Palraj Palanisamy"
                        reporting_officer = "palraj.palanisamy@greenmaestros.co.in"
                    elif team == 'HCM':
                        title = 'Mr'
                        name = "Bernard George"
                        reporting_officer = "bernard@nexttechnosolutions.com" 
                    elif team == 'MOVEO':
                        title = 'Mrs'
                        name = "Swapna Vinoj"
                        reporting_officer = "swapna.vinoj@nexttechnosolutions.co.in"
                    #elif team == 'NEO':
                     #   title = 'Mr'
                      #  name = "Sarathkumar Bhojan"   
                       # reporting_officer = "sarathkumar.bhojan@nexttechnosolutions.co.in"
                    #elif team == 'SecureON':
                     #   title = 'Mr'
                      #  name = "Praveen Josephmasilamani"
                       # reporting_officer = "praveen.josephmasilamani@nexttechnosolutions.co.in"
                    elif team == 'TRANSFORM' or  team == 'SecureON':
                        title = 'Mr'
                        name = "Ginu Santhark"
                        reporting_officer = "ginu.santhark@nexttechnosolutions.comm"
                    elif team == 'UI/UX':
                        title = 'Mr'
                        name = "Ginu Santhark"
                        reporting_officer = "ginu.santhark@nexttechnosolutions.com"
                    elif team =="EXOS Infra":
                        title = 'Mr'
                        name = 'Ginu Santhark'
                        reporting_officer = "ginu.santhark@nexttechnosolutions.com" 
                    elif team =="BigData":
                        title = 'Mr'
                        name = 'Ginu Santhark'
                        reporting_officer = "ginu.santhark@nexttechnosolutions.com"
                    projects = list(set(project_list))
                    project_ids = list(set(project_id))
                    project_value = ''
                    for data in project_ids:
                        cr.execute("""select * from (select pi.id as project_id,project_name,pi.team_name,to_char(max(task_start_date),'DD-MM-YYYY')::text as planned_start_date,
                        case when sum(case when task_stage_id not in (37,46) then 1 else 0 end)=0 then 'Completed' else 'In Progress' end as project_status,
                        to_char(max(e.last_date::date),'DD-MM-YYYY')::text as actual_end_date,to_char(max(e.first_date::date),'DD-MM-YYYY')::text as actual_start_date,sum(e.work_summary_duration::int) as actual_hours,
                        sum(planned_hours::int) as planned_hours,to_char(max(task_end_date),'DD-MM-YYYY')::text as planned_end_date,
                        case when (max(task_end_date) - max(task_start_date)) = 0 then 1 else  (max(task_end_date) - max(task_start_date)) end as planned_days,
                        case when (max(e.last_date::date) - max(e.first_date::date)) = 0 then 1 else (max(e.last_date::date) - max(e.first_date::date)) end as actual_days,
                        case when (max(e.first_date::date) - max(task_start_date)) = 0 then 1 else (max(e.first_date::date) - max(task_start_date)) end as start_variance from project_info  pi
                        left join (select id,task_stage_id,project_id,assigned_to_id,task_description,task_end_date,planned_hours,task_start_date,timebox_id
                        from project_task_info where is_active)  pti on pi.id  = pti.project_id
                        inner join auth_user au on au.id = pti.assigned_to_id
                        inner join (select min(work_summary_datetime)as first_date,max(work_summary_datetime) as last_date,project_task_id,sum(work_summary_duration) as work_summary_duration
                        from  work_summary_info where is_active
                        group by project_task_id) as e on pti.id = e.project_task_id
                        where pi.id = %s
                        group by project_name,pi.team_name,pi.id order by pi.team_name    
                        )aa inner join (select a.task_completed*100/b.total_task as completed,c.expected_completion*100/b.total_task as expected, b.project_id from
                        (select count(pti.task_stage_id  in (select id from task_stage where description SIMILAR TO '(Completed|Approved)')) as task_completed,pi.id
                        from project_task_info pti inner join project_info pi on pti.project_id = pi.id and pi.is_active and
                        case when pti.task_end_date is not null then pti.task_end_date::date<=now()::date else true end
                        and pti.task_stage_id  in (select id from task_stage where description SIMILAR TO '(Completed|Approved)') group by pi.id )a inner join
                        (select count(*) as total_task,project_id from project_task_info where is_active group by project_id )b on a.id = b.project_id inner join
                        (select count(*) as expected_completion,pi.id from project_task_info pti inner join project_info pi on pi.id = pti.project_id
                        where pti.project_id=pi.id and pi.is_active and
                        (pti.task_end_date::date<=now()::date or pti.task_end_date is null)group by pi.id) as c on c.id = b.project_id)bb on aa.project_id = bb.project_id """,(data,))
                        result=self.dictfetchall(cr)
                        if result:
                            planned_hours = result[0]['planned_hours']
                            effective_hours = result[0]['actual_hours']
                            planned_date = result[0]['planned_end_date']
                            planned_date = datetime.strptime(planned_date,'%d-%m-%Y')
                            start_date = result[0]['planned_start_date']
                            start_date = datetime.strptime(start_date,'%d-%m-%Y') 
                            if planned_hours < effective_hours and planned_date <= current_date and result[0]['project_status']=="In Progress":
                                predictive = 'Slippage'
                            elif result[0]['project_status']=="Completed" and planned_date > current_date and planned_date<(current_date+ datetime.timedelta(days=5)):
                                predictive = 'Going To Slippage'
                            elif result[0]['project_status']!="In Progress" and start_date<current_date and planned_date>current_date:
                                predictive = 'Active'
                            elif result[0]['project_status']=="Completed":
                                predictive = 'Closed'
                            elif result[0]['project_status']=="In Progress":  
                                predictive = 'Active'
                            schedule_variance_value = ((result[0]['planned_days']/result[0]['actual_days']-1))*100
                            effort_variance = (result[0]['actual_hours']-result[0]['planned_hours'])/result[0]['planned_hours']
                            effort_variance_value = math.ceil(abs(effort_variance))
                            project_value += """
                                <tr>
                                <td colspan="5" align="right" style="vertical-align: top;padding: 5px 10px;border: 1px solid #ddd;font-size:14px;color:#262626;"><b>"""+str(result[0]['project_name'])+"""</b></td>                                    
                                <td colspan="2" align="right" style="vertical-align: top;padding: 5px 10px;border: 1px solid #ddd;font-size:14px;color:#262626;"><b>"""+str(result[0]['project_status'])+"""</b></td>  
                                <td colspan="2" align="right" style="vertical-align: top;padding: 5px 10px;border: 1px solid #ddd;font-size:14px;color:#262626;"><b>"""+str(schedule_variance_value)+""" %</b></td>    
                                <td align="right" style="vertical-align: top;padding: 5px 10px;border: 1px solid #ddd;font-size:14px;color:#262626;"><b>"""+str(effort_variance_value)+"""</b></td> 
                                <td align="right" style="vertical-align: top;padding: 5px 10px;border: 1px solid #ddd;font-size:14px;color:#262626;"><b>"""+str(result[0]['completed'])+""" %</b></td>
                                <td align="right" style="vertical-align: top;padding: 5px 10px;border: 1px solid #ddd;font-size:14px;color:#262626;"><b>"""+str(result[0]['expected'])+""" %</b></td> 
                                <td align="right" style="vertical-align: top;padding: 5px 10px;border: 1px solid #ddd;font-size:14px;color:#262626;"><b>"""+str(result[0]['planned_end_date'])+"""</b></td>    
                                <td align="right" style="vertical-align: top;padding: 5px 10px;border: 1px solid #ddd;font-size:14px;color:#262626;"><b>"""+str(result[0]['actual_end_date'])+"""</b></td>
                                <td align="right" style="vertical-align: top;padding: 5px 10px;border: 1px solid #ddd;font-size:14px;color:#262626;">"""+str(predictive)+"""</td>
                                </tr>"""
                    
                    project_data = """<tr><td style="height:20px;border:0px;vertical-align: top;padding: 5px 10px;font-size:14px;color:#262626;"></td></tr>
                        <tr>
                        <td style="padding:0px;border:0px;vertical-align: top;font-size:14px;">
                        <table cellpadding="0" cellspacing="0" style="border:0px" width="100%">
                                <tr> 
                                   <td style="padding:0px;border:0px;vertical-align: top;font-size:14px;color:#262626;">
                        
                        <table width="100%" cellpadding="0" cellspacing="0" style="border:0px">
                        <thead style="background-color: #fafdff;">
                            <tr>
                                <th colspan="5" style="vertical-align: top;padding: 6px 10px;border: 1px solid #ddd;color: #262626;font-size: 14px;font-weight: 600;">Project Name</th>
                                <th colspan="2" style="vertical-align: top;padding: 6px 10px;border: 1px solid #ddd;color: #262626;font-size: 14px;font-weight: 600;">Present Status</th>
                                <th colspan="2" style="vertical-align: top;padding: 6px 10px;border: 1px solid #ddd;color: #262626;font-size: 14px;font-weight: 600;">Schedule Variance</th>
                                <th rowspan="3" style="vertical-align: top;padding: 6px 10px;border: 1px solid #ddd;color: #262626;font-size: 14px;font-weight: 600;">Effort Variance</th>
                                <th rowspan="3" style="vertical-align: top;padding: 6px 10px;border: 1px solid #ddd;color: #262626;font-size: 14px;font-weight: 600;">Actual Completion</th>
                                <th rowspan="3" style="vertical-align: top;padding: 6px 10px;border: 1px solid #ddd;color: #262626;font-size: 14px;font-weight: 600;">Expected Completion</th>
                                <th rowspan="3" style="vertical-align: top;padding: 6px 10px;border: 1px solid #ddd;color: #262626;font-size: 14px;font-weight: 600;">Planned End Date</th>
                                <th rowspan="3" style="vertical-align: top;padding: 6px 10px;border: 1px solid #ddd;color: #262626;font-size: 14px;font-weight: 600;">Estimated End Date</th>
                                <th rowspan="3" style="vertical-align: top;padding: 6px 10px;border: 1px solid #ddd;color: #262626;font-size: 14px;font-weight: 600;">Predictive Analysis</th>
                            </tr>
                        </thead>
                         <tfoot style="font-size:15px;background-color:#f1fbff;">
                                    """+project_value+"""     
                        </tfoot>
                        </table>
                        </td></tr></table>
                        </tr>"""
                    project_data = ',<br/>'.join(projects) 
            if management_list :
                    value = self.content_merge(management_list,'<p>'+str(key)+' Team has following absentees</p> <p> You would have to plan and take appropriate action for your team to have the delivery going for the impacting projects below, </p> '+project_data)
                    self.team_wise_email(value,key,reporting_officer)
        except ValueError as test:
            print(test)
        finally:  
            if conn: 
                conn.commit()  
                conn.close() 
        #self.server.quit() 
                
                
    def individual_report(self):   
        '''Scheduler function for generate daily task report based on particular period of time.
        Fetch all employee details who are need to enter the task report into transform portal
        except who are in Exclude user list and who are not in active state in Human Resource Employee'''
        try:
            today = datetime.now().strftime('%Y-%m-%d') 
            indian_today  = datetime.now().strftime('%d-%m-%Y')
            #today = today 
            conn = psycopg2.connect("dbname='P5S_4' user='next' host='192.168.10.67' password='next'")
            cr = conn.cursor()
            
            hrms_conn = psycopg2.connect("dbname='live_hcms' user='next' host='192.168.10.42' password='N3XT@9966'")
            hrms_cr = hrms_conn.cursor()
            cr.execute("""select id as user_id,employee_name,team_name,email,employee_image from auth_user where id not in(select user_id from p5s_attendance
            where check_in::date= %s and (check_in_time - interval '330' minute) :: time <= '08:16:00') and is_active and 
            employee_name is not null and id not in (246,22037,1,22024,22027,22025,22018,21998,22023,22026,22029,76) order  by team_name,employee_name""",(today,))
        #22029 Bharathi Thanasekaran  Id,because of his shift timings changed from 8 to 9
        #246 exos saravanan id
            result = self.dictfetchall(cr)
            if result:
                for i in result:
                    hrms_cr.execute("""select * from leave_info  hl inner join employee_info he on he.id = hl.leave_employee_id_id inner join auth_user au on au.id = he.related_user_id_id 
                                        inner join  reference_items lt on lt.id=hl.type_id_id
                                        where  au.id =%s and hl.from_date::date= %s and lt.refitems_code='PEMSN' and hl.is_active and he.is_active and au.is_active and lt.is_active """,(i['user_id'],today,))
                    permission_check = self.dictfetchall(hrms_cr)
                    if permission_check: 
                        continue
                    hrms_cr.execute("""select * from employee_info he inner join  reference_items ri on ri.id = he.type_id_id 
                    inner join auth_user au on au.id = related_user_id_id where au.id = %s and ri.refitems_code!='NCNTR' and he.is_active and ri.is_active and au.is_active """,(i['user_id'],))
                    contract = self.dictfetchall(hrms_cr) 
                    if contract:
                        continue
                    '''hrms_cr.execute("""select * from employee_info he inner join  reference_items ri on ri.id = he.type_id_id 
                            inner join auth_user au on au.id = related_user_id_id where au.id = %s and he.employee_work_location_id = 339""",(i['user_id'],))
                            onsite = self.dictfetchall(hrms_cr)
                            if onsite:
                    continue 
                    '''   
                    management_list = [] 
                    management_dict = {}
                    if i['team_name'] != '':
                        team_name = str(i['team_name'])+' - '
                    else: 
                        team_name = ''
                    hrms_cr.execute(""" 
                        select description,st.refitems_name as state,to_char(hl.created_date,'DD-MM-YYYY')as applied_date,number_of_days,ri.refitems_name from leave_info hl 
                        inner join  employee_info he on he.id = hl.leave_employee_id_id
                        inner join reference_items ri on ri.id = hl.type_id_id 
                        inner join reference_items st on st.id = hl.state_id
                        inner join auth_user au on au.id = he.related_user_id_id where au.id = %s and from_date::date<= %s and to_date>= %s
                        """,(i['user_id'],today,today,))
                    hrms_result = self.dictfetchall(hrms_cr) 
                    cr.execute("""select project_name  from work_summary_info wsi inner join project_task_info pti on pti.id = wsi.project_task_id
                                inner join project_info pi on pi.id = pti.project_id where wsi.created_by = %s 
                                order by wsi.created_date desc limit 1""",(i['user_id'],))
                    project_result = self.dictfetchall(cr)
                    if project_result: 
                        project_name = project_result[0]['project_name']  
                    else: 
                        project_name = '-'
                    cr.execute("select * from project_task_info where task_start_date::date>=%s and assigned_to_id = %s ",(today,i['user_id'],))
                    impact_result = self.dictfetchall(cr) 
                    if impact_result: 
                        impact = 'H'
                        tr_bgcolor = """<tr style="background-color: #f443362e;">"""
                    else:
                        tr_bgcolor = """<tr style="background-color: #f1fbff;">"""
                        impact = 'L'
                    hrms_cr.execute("""select sum(number_of_days) as nol_res,leave_employee_id_id from leave_info hl
                                    inner join  employee_info he on he.id = hl.leave_employee_id_id
                                    inner join auth_user au on au.id = he.related_user_id_id 
                                    inner join reference_items lt  on lt.id= hl.type_id_id
                                    where au.id =%s and au.is_active and lt.refitems_code !='PEMSN'
                                    and he.is_active and hl.is_active and au.is_active and lt.is_active and  date_part('year', hl.from_date) = date_part('year', CURRENT_DATE) group by leave_employee_id_id """,(i['user_id'],))
                    nol_res = self.dictfetchall(hrms_cr)
                    if nol_res:
                        nol = nol_res[0]['nol_res']
                    else: 
                        nol = 0
                    if numpy.isnan(nol):
                        nol = 0
                    if hrms_result:
                        management_dict['colour']=tr_bgcolor
                        management_dict['user_id'] = i['user_id']
                        management_dict['employee_image'] = i['employee_image'] 
                        management_dict['team_name'] = team_name
                        management_dict['employee_name'] = i['employee_name']
                        management_dict['state'] = hrms_result[0]['state']
                        management_dict['applied_date'] = hrms_result[0]['applied_date']
                        management_dict['reason'] = hrms_result[0]['refitems_name'] 
                        management_dict['status'] = 'Yes'
                        management_dict['project_name'] = project_name
                        management_dict['impact'] = impact
                        management_dict['number_of_days'] = hrms_result[0]['number_of_days']
                        management_dict['nol'] = nol
                        management_list.append(management_dict)
                    else:
                        management_dict['colour']=tr_bgcolor
                        management_dict['user_id'] = i['user_id']
                        management_dict['employee_image'] = i['employee_image']
                        management_dict['employee_name'] = i['employee_name']
                        management_dict['state'] = '-'
                        management_dict['applied_date'] = '-'
                        management_dict['reason'] = '-'
                        management_dict['status'] = 'No'
                        management_dict['project_name'] = project_name
                        management_dict['impact'] = impact
                        management_dict['number_of_days'] = '-'
                        management_dict['nol'] = nol
                        management_list.append(management_dict) 
                    if hrms_result:
                        if hrms_result[0]['state'] == 'Open':
                            leave_record = 'leave recorded'
                        else: 
                            leave_record = 'leave recorded / leave approved'
                    else:
                        leave_record = 'leave not recorded / LOP' 
                    value = self.content_merge(management_list,"""<p style="font-family:'Calibri'">You have been marked as absent with """+leave_record+""".</p>""")
                    self.individual_email(value,i['email'])
        except ValueError as test:
            print(test)
        finally:
            if conn: 
                conn.commit()
                conn.close()
        #self.server.quit()
    def hierarchy_wise_report(self):   
        '''Scheduler function for generate daily task report based on particular period of time.
        Fetch all employee details who are need to enter the task report into transform portal
        except who are in Exclude user list and who are not in active state in Human Resource Employee'''
        parent_result = []
        try:
            today = datetime.now().strftime('%Y-%m-%d')
            indian_today  = datetime.now().strftime('%d-%m-%Y')
            today = today  
            current_date = datetime.now()
            conn = psycopg2.connect("dbname='P5S_4' user='next' host='192.168.10.67' password='next'")
            cr = conn.cursor()
            
            hrms_conn = psycopg2.connect("dbname='live_hcms' user='next' host='192.168.10.42' password='N3XT@9966'")
            hrms_cr = hrms_conn.cursor() 
            
            cr.execute("""select id as parent_id,title as parent_title,
            employee_name as parent_employee_name,email as parent_email,team_name from auth_user  
            where id in (select distinct parent_id from auth_user  where
             parent_id  != 0 and parent_id is not null and is_active) and  is_active""")
            parent_result = self.dictfetchall(cr)
            print parent_result
            if len(parent_result) > 0:
                for i in parent_result:
                    team_name  = i['team_name']
                    parent_id = i['parent_id']
                    title = i['parent_title']
                    name = i['parent_employee_name']
                    reporting_officer = i['parent_email']
                    print 'parent_id',parent_id
                    cr.execute("""select id as user_id,employee_name,team_name,employee_image from auth_user where id not
             in(select user_id from p5s_attendance
            where check_in::date= %s and (check_in_time - interval '330' minute) :: time <= '08:16:00') 
            and is_active and 
            employee_name is not null and team_name != '' and team_name != 'NEO' 
            and id  in (WITH RECURSIVE nodes(id,username,parent_id,is_active) AS (
    SELECT s1.id, s1.username, s1.parent_id,s1.is_active
    FROM auth_user s1 WHERE parent_id =%s::int and is_active
        UNION
    SELECT s2.id, s2.username, s2.parent_id,s2.is_active
    FROM auth_user s2, nodes s1 WHERE s2.parent_id = s1.id and s1.is_active and s2.is_active
)SELECT id FROM nodes where is_active)  and id not in (246,22037,1,22024,22027,22025,22018,21998,22023,22026,22029,76)
             order  by team_name,employee_name""",(today,parent_id,))
            #22029 Bharathi id
            #246 exos saravanan id
                    result = self.dictfetchall(cr)
                    if result:
                            management_list = []
                            project_list = []  
                            project_id = []
#                         getState = itemgetter('team_name')
#                         for key, group in groupby(result, getState):
#                             team = key 
#                             management_list = []
#                             project_list = []  
#                             project_id = []
#                             print 'groupgroupgroupgroupgroupgroupgroupgroupgroupgroupgroupgroupgroup',group
                            for i in result:
                                print i
                                print i['user_id']
                                hrms_cr.execute("""select * from leave_info  hl inner join employee_info he on he.id = hl.leave_employee_id_id inner join auth_user au on au.id = he.related_user_id_id 
                                                inner join  reference_items lt on lt.id=hl.type_id_id
                                                where  au.id =%s and hl.from_date::date= %s and lt.refitems_code='PEMSN' and hl.is_active and he.is_active and au.is_active and lt.is_active """,(i['user_id'],today))
                                permission_check = self.dictfetchall(hrms_cr)
                                if permission_check:
                                    continue
                                hrms_cr.execute("""select * from employee_info he inner join  reference_items ri on ri.id = he.type_id_id 
                                inner join auth_user au on au.id = related_user_id_id where au.id = %s  and ri.refitems_code!='NCNTR' and au.is_active and he.is_active """,(i['user_id'],))
                                contract = self.dictfetchall(hrms_cr)
                                if contract: 
                                    continue
                                '''hrms_cr.execute("""select * from hr_employee he inner join  reference_items ri on ri.id = he.type_id_id 
                                       inner join auth_user au on au.id = related_user_id where au.id = %s and he.employee_work_location_id = 339""",(i['user_id'],))
                                       onsite = self.dictfetchall(hrms_cr)
                                       if onsite:
                                   continue
                                  '''
                                management_dict = {} 
                                hrms_cr.execute("""select description,st.refitems_name as state,to_char(hl.created_date,'DD-MM-YYYY')as applied_date,number_of_days,ri.refitems_name from leave_info hl 
                                inner join  employee_info he on he.id = hl.leave_employee_id_id
                                inner join reference_items ri on ri.id = hl.type_id_id
                                inner join reference_items st on st.id = hl.state_id
                                inner join auth_user au on au.id = he.related_user_id_id where au.id = %s and from_date::date<= %s and to_date>= %s
                                    """,(i['user_id'],today,today,))
                                hrms_result = self.dictfetchall(hrms_cr)
                                cr.execute("""select pi.id as project_id,project_name  from work_summary_info wsi inner join project_task_info pti on pti.id = wsi.project_task_id
                                            inner join project_info pi on pi.id = pti.project_id where 
                                            wsi.done_by_id =%s
                                            and wsi.work_summary_datetime::date >CURRENT_DATE - interval '1 month'
                                            order by wsi.created_date desc limit 1""",(i['user_id'],))
                                project_result = self.dictfetchall(cr)
                                print 'project_result',project_result
                                if project_result:
                                    if len(project_result) > 0:
                                        project_id.append(project_result[0]['project_id'])
                                        project_list.append(project_result[0]['project_name'])
                                        project_name = project_result[0]['project_name'] 
                                else: 
                                    project_name = '-'
                                cr.execute("select * from project_task_info where task_start_date::date>=%s and assigned_to_id = %s ",(today,i['user_id'],))
                                impact_result = self.dictfetchall(cr)
                                if impact_result:
                                    impact = 'H'
                                    tr_bgcolor = """<tr style="background-color: #f443362e;">""" 
                                else:
                                    tr_bgcolor = """<tr style="background-color: #f1fbff;">"""
                                    impact = 'L'
                                hrms_cr.execute("""select sum(number_of_days) as nol_res,leave_employee_id_id from leave_info hl
                                            inner join  employee_info he on he.id = hl.leave_employee_id_id
                                            inner join auth_user au on au.id = he.related_user_id_id 
                                            inner join reference_items lt  on lt.id= hl.type_id_id
                                            where au.id =%s and au.is_active and lt.refitems_code !='PEMSN'
                                            and he.is_active and hl.is_active and au.is_active and lt.is_active and  date_part('year', hl.from_date) = date_part('year', CURRENT_DATE) group by leave_employee_id_id 
                                            """,(i['user_id'],))
                                nol_res = self.dictfetchall(hrms_cr)
                                if nol_res:
                                    nol = nol_res[0]['nol_res']
                                else:
                                    nol = 0
                                if numpy.isnan(nol):
                                    nol = 0  
                                if hrms_result:
                                    management_dict['colour']=tr_bgcolor
                                    management_dict['user_id'] = i['user_id']
                                    management_dict['employee_image'] = i['employee_image']
                                    management_dict['team_name'] = i['team_name']
                                    management_dict['employee_name'] = i['employee_name'] 
                                    management_dict['state'] = hrms_result[0]['state']
                                    management_dict['applied_date'] = hrms_result[0]['applied_date']
                                    management_dict['reason'] = hrms_result[0]['refitems_name']
                                    management_dict['status'] = 'Yes'
                                    management_dict['project_name'] = project_name
                                    management_dict['impact'] = impact
                                    management_dict['number_of_days'] = hrms_result[0]['number_of_days']
                                    management_dict['nol'] = nol
                                    management_list.append(management_dict)
                                else: 
                                    management_dict['colour']=tr_bgcolor
                                    management_dict['user_id'] = i['user_id']
                                    management_dict['employee_image'] = i['employee_image']
                                    management_dict['team_name'] = i['team_name']
                                    management_dict['employee_name'] = i['employee_name']
                                    management_dict['state'] = '-'
                                    management_dict['applied_date'] = '-'
                                    management_dict['reason'] = '-'
                                    management_dict['status'] = 'No'
                                    management_dict['project_name'] = project_name
                                    management_dict['impact'] = impact
                                    management_dict['number_of_days'] = '-' 
                                    management_dict['nol'] = nol
                                    management_list.append(management_dict)
                                    
                            
                            
                            projects = list(set(project_list))
                            project_ids = list(set(project_id))
                            project_value = ''
                            for data in project_ids:
                                cr.execute("""select * from (select pi.id as project_id,project_name,pi.team_name,to_char(max(task_start_date),'DD-MM-YYYY')::text as planned_start_date,
                                case when sum(case when task_stage_id not in (37,46) then 1 else 0 end)=0 then 'Completed' else 'In Progress' end as project_status,
                                to_char(max(e.last_date::date),'DD-MM-YYYY')::text as actual_end_date,to_char(max(e.first_date::date),'DD-MM-YYYY')::text as actual_start_date,sum(e.work_summary_duration::int) as actual_hours,
                                sum(planned_hours::int) as planned_hours,to_char(max(task_end_date),'DD-MM-YYYY')::text as planned_end_date,
                                case when (max(task_end_date) - max(task_start_date)) = 0 then 1 else  (max(task_end_date) - max(task_start_date)) end as planned_days,
                                case when (max(e.last_date::date) - max(e.first_date::date)) = 0 then 1 else (max(e.last_date::date) - max(e.first_date::date)) end as actual_days,
                                case when (max(e.first_date::date) - max(task_start_date)) = 0 then 1 else (max(e.first_date::date) - max(task_start_date)) end as start_variance from project_info  pi
                                left join (select id,task_stage_id,project_id,assigned_to_id,task_description,task_end_date,planned_hours,task_start_date,timebox_id
                                from project_task_info where is_active)  pti on pi.id  = pti.project_id
                                inner join auth_user au on au.id = pti.assigned_to_id
                                inner join (select min(work_summary_datetime)as first_date,max(work_summary_datetime) as last_date,project_task_id,sum(work_summary_duration) as work_summary_duration
                                from  work_summary_info where is_active
                                group by project_task_id) as e on pti.id = e.project_task_id
                                where pi.id = %s
                                group by project_name,pi.team_name,pi.id order by pi.team_name    
                                )aa inner join (select a.task_completed*100/b.total_task as completed,c.expected_completion*100/b.total_task as expected, b.project_id from
                                (select count(pti.task_stage_id  in (select id from task_stage where description SIMILAR TO '(Completed|Approved)')) as task_completed,pi.id
                                from project_task_info pti inner join project_info pi on pti.project_id = pi.id and pi.is_active and
                                case when pti.task_end_date is not null then pti.task_end_date::date<=now()::date else true end
                                and pti.task_stage_id  in (select id from task_stage where description SIMILAR TO '(Completed|Approved)') group by pi.id )a inner join
                                (select count(*) as total_task,project_id from project_task_info where is_active group by project_id )b on a.id = b.project_id inner join
                                (select count(*) as expected_completion,pi.id from project_task_info pti inner join project_info pi on pi.id = pti.project_id
                                where pti.project_id=pi.id and pi.is_active and
                                (pti.task_end_date::date<=now()::date or pti.task_end_date is null)group by pi.id) as c on c.id = b.project_id)bb on aa.project_id = bb.project_id """,(data,))
                                result=self.dictfetchall(cr)
                                if result:
                                    planned_hours = result[0]['planned_hours']
                                    effective_hours = result[0]['actual_hours']
                                    planned_date = result[0]['planned_end_date']
                                    planned_date = datetime.strptime(planned_date,'%d-%m-%Y')
                                    start_date = result[0]['planned_start_date']
                                    start_date = datetime.strptime(start_date,'%d-%m-%Y') 
                                    if planned_hours < effective_hours and planned_date <= current_date and result[0]['project_status']=="In Progress":
                                        predictive = 'Slippage'
                                    elif result[0]['project_status']=="Completed" and planned_date > current_date and planned_date<(current_date+ datetime.timedelta(days=5)):
                                        predictive = 'Going To Slippage'
                                    elif result[0]['project_status']!="In Progress" and start_date<current_date and planned_date>current_date:
                                        predictive = 'Active'
                                    elif result[0]['project_status']=="Completed":
                                        predictive = 'Closed'
                                    elif result[0]['project_status']=="In Progress":  
                                        predictive = 'Active'
                                    schedule_variance_value = ((result[0]['planned_days']/result[0]['actual_days']-1))*100
                                    effort_variance = (result[0]['actual_hours']-result[0]['planned_hours'])/result[0]['planned_hours']
                                    effort_variance_value = math.ceil(abs(effort_variance))
                                    project_value += """
                                        <tr>
                                        <td colspan="5" align="right" style="vertical-align: top;padding: 5px 10px;border: 1px solid #ddd;font-size:14px;color:#262626;"><b>"""+str(result[0]['project_name'])+"""</b></td>                                    
                                        <td colspan="2" align="right" style="vertical-align: top;padding: 5px 10px;border: 1px solid #ddd;font-size:14px;color:#262626;"><b>"""+str(result[0]['project_status'])+"""</b></td>  
                                        <td colspan="2" align="right" style="vertical-align: top;padding: 5px 10px;border: 1px solid #ddd;font-size:14px;color:#262626;"><b>"""+str(schedule_variance_value)+""" %</b></td>    
                                        <td align="right" style="vertical-align: top;padding: 5px 10px;border: 1px solid #ddd;font-size:14px;color:#262626;"><b>"""+str(effort_variance_value)+"""</b></td> 
                                        <td align="right" style="vertical-align: top;padding: 5px 10px;border: 1px solid #ddd;font-size:14px;color:#262626;"><b>"""+str(result[0]['completed'])+""" %</b></td>
                                        <td align="right" style="vertical-align: top;padding: 5px 10px;border: 1px solid #ddd;font-size:14px;color:#262626;"><b>"""+str(result[0]['expected'])+""" %</b></td> 
                                        <td align="right" style="vertical-align: top;padding: 5px 10px;border: 1px solid #ddd;font-size:14px;color:#262626;"><b>"""+str(result[0]['planned_end_date'])+"""</b></td>    
                                        <td align="right" style="vertical-align: top;padding: 5px 10px;border: 1px solid #ddd;font-size:14px;color:#262626;"><b>"""+str(result[0]['actual_end_date'])+"""</b></td>
                                        <td align="right" style="vertical-align: top;padding: 5px 10px;border: 1px solid #ddd;font-size:14px;color:#262626;">"""+str(predictive)+"""</td>
                                        </tr>"""
                            
                            project_data = """<tr><td style="height:20px;border:0px;vertical-align: top;padding: 5px 10px;font-size:14px;color:#262626;"></td></tr>
                                <tr>
                                <td style="padding:0px;border:0px;vertical-align: top;font-size:14px;">
                                <table cellpadding="0" cellspacing="0" style="border:0px" width="100%">
                                        <tr> 
                                           <td style="padding:0px;border:0px;vertical-align: top;font-size:14px;color:#262626;">
                                
                                <table width="100%" cellpadding="0" cellspacing="0" style="border:0px">
                                <thead style="background-color: #fafdff;">
                                    <tr>
                                        <th colspan="5" style="vertical-align: top;padding: 6px 10px;border: 1px solid #ddd;color: #262626;font-size: 14px;font-weight: 600;">Project Name</th>
                                        <th colspan="2" style="vertical-align: top;padding: 6px 10px;border: 1px solid #ddd;color: #262626;font-size: 14px;font-weight: 600;">Present Status</th>
                                        <th colspan="2" style="vertical-align: top;padding: 6px 10px;border: 1px solid #ddd;color: #262626;font-size: 14px;font-weight: 600;">Schedule Variance</th>
                                        <th rowspan="3" style="vertical-align: top;padding: 6px 10px;border: 1px solid #ddd;color: #262626;font-size: 14px;font-weight: 600;">Effort Variance</th>
                                        <th rowspan="3" style="vertical-align: top;padding: 6px 10px;border: 1px solid #ddd;color: #262626;font-size: 14px;font-weight: 600;">Actual Completion</th>
                                        <th rowspan="3" style="vertical-align: top;padding: 6px 10px;border: 1px solid #ddd;color: #262626;font-size: 14px;font-weight: 600;">Expected Completion</th>
                                        <th rowspan="3" style="vertical-align: top;padding: 6px 10px;border: 1px solid #ddd;color: #262626;font-size: 14px;font-weight: 600;">Planned End Date</th>
                                        <th rowspan="3" style="vertical-align: top;padding: 6px 10px;border: 1px solid #ddd;color: #262626;font-size: 14px;font-weight: 600;">Estimated End Date</th>
                                        <th rowspan="3" style="vertical-align: top;padding: 6px 10px;border: 1px solid #ddd;color: #262626;font-size: 14px;font-weight: 600;">Predictive Analysis</th>
                                    </tr>
                                </thead>
                                 <tfoot style="font-size:15px;background-color:#f1fbff;">
                                            """+project_value+"""     
                                </tfoot>
                                </table>
                                </td></tr></table>
                                </tr>"""
                            project_data = ',<br/>'.join(projects) 
                            if management_list :
                                value = self.content_merge(management_list,'<p> Team '+team_name+' has following absentees</p> <p> You would have to plan and take appropriate action for your team to have the delivery going for the impacting projects below, </p> '+project_data)
                                self.team_wise_email(value,team_name,reporting_officer)
            else:
                print 'No hieararchy wise data found'
            
            
        except ValueError as test:
            print(test)
        finally:  
            if conn: 
                conn.commit()  
                conn.close() 
        #self.server.quit()   
if __name__ == '__main__':

    r1 = accounting()  
    hrms_conn = psycopg2.connect("dbname='live_hcms' user='next' host='192.168.10.42' password='N3XT@9966'")
    hrms_cr = hrms_conn.cursor()
    hrms_cr.execute("select * from holiday_list_info where holiday_date::date =  CURRENT_DATE")
    public_holiday = hrms_cr.fetchall()

    if not public_holiday:

        conn = psycopg2.connect("dbname='P5S_4' user='next' host='192.168.10.67' password='next'")
        cr = conn.cursor()
	cr.execute("select count(user_id)  from p5s_attendance  where check_in::date= CURRENT_DATE and (check_in_time - interval '330' minute) :: time >= '08:16:00' ")
        absentee_count= r1.dictfetchall(cr)
	if absentee_count and absentee_count[0].get('count')<=20:
	   #r1.management_report() 
           #r1.teamwise_report()
	   r1.hierarchy_wise_report()
      	   r1.individual_report()
