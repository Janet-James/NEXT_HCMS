# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.shortcuts import render

import json
from django.views.decorators.csrf import csrf_exempt
from django.http.response import HttpResponse
from CommonLib import query
from django.db import connection
from CommonLib import query as q
import config1 as config
import HCMS.settings as settings
from CommonLib import lib
from Talent_Acquisition.talent_acquisition.models import OfferInfo,CandidateInfo
#template render html
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from CommonLib.hcms_common import refitem_fetch,refitemlink_fetch
from CommonLib.hcms_common import record_validation

from CommonLib.hcms_common import menu_access_control
from django_countries import countries
from django.views.decorators.csrf import csrf_exempt
import logging
import logging.handlers
import datetime
from datetime import date,timedelta
import base64
import pdfkit
import inflect
import shutil
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
import os
from operator import pos

logger_obj = logging.getLogger('logit')

# Offer Management  views here
class TAOfferManagement(TemplateView): 
    ''' 
    06-JULY-2018 PAR To Talent Acquisitions Offer Management page loaded. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: PAR
    '''
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(TAOfferManagement, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self): 
        macl = menu_access_control('Offer Management', self.request.user.id)
        if macl:
             template_name = "talent_acquisition/offer_management.html"
        else: 
            template_name = "tags/access_denied.html"   
        return [template_name]    
        
    def get(self, request, *args, **kwargs):
         context = super(TAOfferManagement, self).get_context_data(**kwargs)
         cur = connection.cursor()
         cur.execute(q.fetch_hcms_query(config.talent_acquisition, config.ta_job_title_drop_down))
         res = q.dictfetchall(cur)
         context[config.job_title_info] = res   
         return self.render_to_response(context)
     
#Operation crud operations function here     
@csrf_exempt
def TAOfferCrud(request):
    ''' 
    09-JULY-2018 PAR To Offer Management  CRUD operations
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse 
    @author: PAR
    '''
    #try:
    logger_obj.info('Offer management CRUD function by '+str(request.user.username))
    json_data = {}
    post = request.POST
    cur=lib.db_connection()
    candidate_id = post.get('candidate_id')
    job_id = post.get('job_title_id')
    # Fetch Candidate Status                
    cur.execute(q.fetch_hcms_query(config.talent_acquisition, config.ta_fetch_reference_id),("Offer",))
    res = q.dictfetchall(cur)
    candidate_status = res[0]['id']
    
    # Fetch Offer Declined id
    cur.execute(q.fetch_hcms_query(config.talent_acquisition, config.ta_fetch_reference_id),("Offer Declined",))
    res = q.dictfetchall(cur)
    offer_status = res[0]['id']
    
    try:
        input_data = request.POST.get(config.datas)
        delete_id = request.POST.get(config.delete_id)
        uid = request.user.id 
        if not uid: 
            uid = 1
        update_id = request.POST.get("update_id")
        if input_data:
            input_data = json.loads(input_data)
        if input_data and not delete_id : 
                    if not update_id  :
                        query=q.fetch_hcms_query(config.talent_acquisition,config.ta_check_offer_name)
                        cur.execute(query,(input_data.get("candidate"),))
                        status = cur.rowcount
                        if status > 0:
                                  json_data[config.results] =  config.status_already_exists
                        else:
                           status = OfferInfo(cost_to_employee_id=input_data.get("cost_to_employee"),offer_release_id=input_data.get("offer_release"),
                                    candidate_id=input_data.get("candidate"),job_title_id=input_data.get("job_title_id"),ctc=input_data.get("cost_to_company"),is_active=True,created_by_id=int(uid))
                           status.save()
                           json_data[config.results] = config.add_success
                           status_candidate_offer =  CandidateInfo.objects.filter(id=input_data.get("candidate"),job_opening_id=input_data.get("job_title_id")).update(candidate_status_id=candidate_status,offer_release_id=input_data.get("offer_release"),
                                                                                                                                                                screening_id=None,source_of_hire_id=None,referral_by_id=None,hired_id=None,interview_id=None)
                    else: 
                        status= OfferInfo.objects.filter(id=update_id).update(cost_to_employee_id=input_data.get("cost_to_employee"),offer_release_id=input_data.get("offer_release"),
                                    candidate_id=input_data.get("candidate"),job_title_id=input_data.get("job_title_id"),ctc=input_data.get("cost_to_company"),is_active=True,modified_by_id=int(uid))                            
                        json_data[config.results] = config.update_success
                        status_candidate_offer =  CandidateInfo.objects.filter(id=input_data.get("candidate"),job_opening_id=input_data.get("job_title_id")).update(candidate_status_id=candidate_status,offer_release_id=input_data.get("offer_release"),
                                                                                                                                                                screening_id=None,source_of_hire_id=None,referral_by_id=None,hired_id=None,interview_id=None)
                                    
        elif delete_id:
                referred_record = record_validation('ta_offer_info', delete_id)
                if referred_record:
                    status =  OfferInfo.objects.filter(id=delete_id).update(is_active="False",modified_by_id=int(uid))
                    json_data[config.results] = config.delete_success
                    status_candidate_offer =  CandidateInfo.objects.filter(id=candidate_id,job_opening_id=job_id).update(candidate_status_id=None,offer_release_id=offer_status,screening_id=None,source_of_hire_id=None,referral_by_id=None,hired_id=None,interview_id=None)
                else:
                    json_data[config.results] =status_keys.ERR0028
        elif org_unit_id:   
            cur.execute(""" 
                select ou.id,ou.orgunit_name,ou.address,ou.orgunit_code,ou.orgunit_type_id,ou.parent_orgunit_type,ou.parent_orgunit_id,fo.orgunit_name as parent_orgunit_name,ou.organization_id from organization_unit_info ou left join 
                (select id,orgunit_name from organization_unit_info) as fo  on ou.parent_orgunit_id=fo.id
                where is_active=true and ou.id=%s
                            """,(org_unit_id,))
            org_unit=lib.dictfetchall(cur)
            json_data[config.results] = org_unit 
        logger_obj.info('Job Opening CRUD response is'+str(json_data)+"attempted by"+str(request.user.username))         
    except Exception as e:
                logger_obj.error(e)
                json_data[config.results] =config.error
    return HttpResponse(json.dumps(json_data))

#Offer data get function here
@csrf_exempt
def TAOfferData(request): 
    ''' 
    09-JULY-2018 PAR To Offer Management candidate data for table
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse 
    @author: PAR
    '''
    try:
        logger_obj.info('Talent Acquisition TAOfferCandidateData function by'+str(request.user.username))
        if request.method=='GET' or request.method=='POST':
            post=request.POST
            type=post.get("type")
            table=post.get("table")
            cur=lib.db_connection()#to_char(hr_leave.created_date, 'MM-DD-YYYY HH24:MI:SS') AS raised_date,
            user_id = request.user.id
            dic = {}
            json_datas = {}   
            values=[];       
            if type=="all":  
                if user_id:
                    offer_candidate_table=query.fetch_hcms_query(config.talent_acquisition,config.offer_candidate_table_query)
                    if offer_candidate_table:
                        cur.execute(offer_candidate_table) 
                        values=cur.fetchall() 
                        keys =config.offer_table_key
                        dic = list(dict(zip(keys,j)) for j in values)  
                commit =lib.db_commit(cur) 
                close = lib.db_close(cur)
                json_datas['datas'] = values
                json_datas = json_datas#response data function call
                
            elif type=="row" and table=="offer": 
                 table_id=post.get("table_id") 
                 if user_id:
                    offer_candidate_table_row=query.fetch_hcms_query(config.talent_acquisition,config.offer_candidate_table_query_row)
                    if offer_candidate_table_row:
                        cur.execute(offer_candidate_table_row% (table_id,))
                        values=q.dictfetchall(cur)
                 close = lib.db_close(cur) 
                 json_datas['datas'] = values   
                 
            elif type=="row" and table=="candidate":    
                 table_id=post.get("table_id")
                 if user_id:
                    offer_candidate_table_row=query.fetch_hcms_query(config.talent_acquisition,config.offer_candidate_table_query_row_candidate)
                    if offer_candidate_table_row:
                        cur.execute(offer_candidate_table_row% (table_id,)) 
                        values=q.dictfetchall(cur)
                 close = lib.db_close(cur) 
                 json_datas['datas'] = values   
            
            elif type=="filter": 
                 filter_name=post.get("filter_name") 
                 if filter_name:
                    offer_candidate_table_row=query.fetch_hcms_query(config.talent_acquisition,config.offer_candidate_table_query)
                    if offer_candidate_table_row:
                        cur.execute(offer_candidate_table_row+" where a.candidate_name ilike '%"+str(filter_name)+"%'")
                        values=cur.fetchall() 
                 close = lib.db_close(cur) 
                 json_datas['datas'] = values   
            
            logger_obj.info('Talent Acquisition  TAOfferCandidateData response is'+str(json_datas)+"attempted by"+str(request.user.username))                 
    except Exception as e:
       logger_obj.error(e) 
       json_datas['datas'] = []
    return HttpResponse(json.dumps(json_datas))

#Offer Generate function here
@csrf_exempt
def TAGenerateOffer(request):
    ''' 
    10-JULY-2018 PAR To Offer Management Generate offer 
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse 
    @author: PAR
    '''
    #try:
    logger_obj.info('Offer management Generate offer  function by '+str(request.user.username))
    json_data = {}
    post = request.POST
    cur=lib.db_connection()
    try:
        row_id=request.POST.get("id")
        type= request.POST.get("type")
        uid = request.user.id
        values=[] 
        if not uid: 
            uid = 1
        if type:
            offer_candidate_details=query.fetch_hcms_query(config.talent_acquisition,config.offer_candidate_details)
            if offer_candidate_details:
                cur.execute(offer_candidate_details%(row_id,)) 
                values= query.dictfetchall(cur)
                #close = lib.db_close(cur)
            if values:
                if type=="EMAIL":
                       email=values[0]['primary_email']
                       mail_subject = "Offer Leter"
                       email_content = "Hi "+values[0]['name']+", "  
                       email_content += "\n"
                       email_content += "Please find attached your Offer Letter"  
                       file_name =values[0]['doc_download_name']
                       email_send(email,mail_subject,email_content,file_name)
                       json_data[config.results]="MAILSD"
                if type=="GENERATE":
                    contents=get_contents(values[0])
                    json_data["body_content"]=contents 
                    status=generate_pdf(contents,values[0]['name'])
                    if status is True:
                        file_name=save_offer(request.user.id,values[0]['id'],values[0]['name'])
                        json_data[config.results]=file_name
                    elif status is False:
                        json_data[config.results]="PDFER"
        logger_obj.info('Offer management Generate offer  function  response is'+str(json_data)+"attempted by"+str(request.user.username))         
    except Exception as e:
                logger_obj.error(e)   
                json_data[config.results] =config.error 
    return HttpResponse(json.dumps(json_data))

#Email send function here
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
              path = settings.MEDIA_ROOT + str('offer_document') +'/'
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
        return server
    except Exception as e:
            logger_obj.error(e) 
            
#Offer generate function here
def generate_pdf(bodyContent,name):
    try:
        options = {
        'page-size': 'A4',
        'margin-top': '0.55in',
        'margin-right': '0.75in',
        'margin-bottom': '0.75in',
        'margin-left': '0.75in',
        }
        css ='static/ui/css/Job_offer_template.css'
        path = settings.MEDIA_ROOT + str('offer_document') +'/'
        if not os.path.isdir(path): 
              os.mkdir(path) 
        pdfkit.from_string(bodyContent, path+name.replace(' ','_')+'_job_offer.pdf', css=css,options=options) #with --page-size=Legal and --orientation=Landscape
        return True
    except Exception as e:
        logger_obj.error(e)
        return False
    
#Offer save function here     
def save_offer(uid,update_id,name):
    json_data={}
    try:
        if not uid: 
            uid = 1
        doc_name=name.replace(' ','_')+"_job_offer.pdf"
        mail_status="send"
        status= OfferInfo.objects.filter(id=update_id).update(doc_download_name=doc_name,doc_mail_status=mail_status,is_active=True,modified_by_id=int(uid))
        json_data[config.results] = config.update_success
        return doc_name
    except Exception as e:
        logger_obj.error(e)

#Offer content function here        
def get_contents(vals):
        p = inflect.engine()  
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
                          <h5>"""+vals['name']+"""</h5>
                          <h5>"""+vals['address']+"""</h5>
                          <h5>"""+vals['primary_email']+"""</h5>
                          <h5>"""+vals['mobile_no']+"""</h5>
                          <br>
                          <p>
                            Dear """+vals['name']+"""  
                          <br> &nbsp; &nbsp; &nbsp; we are pleased to offer you employement at next inc. we feel that your skill and background will be valuable asset to our team
                          </p>
                       </body>
                    </html>
                    """
        return bodyContent

#Offer count details
@csrf_exempt
def TAOfferCount(request): 
    ''' 
    09-JULY-2018 PAR To Offer Management Tabs count and details 
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse 
    @author: PAR 
    '''
    try:
        logger_obj.info('Talent Acquisition TAOfferCount function by '+str(request.user.username))
        if request.method=='GET' or request.method=='POST':
            json_datas = {}   
            post=request.POST
            type=post.get('type')
            cur=lib.db_connection()#to_char(hr_leave.created_date, 'MM-DD-YYYY HH24:MI:SS') AS raised_date,
            user_id = request.user.id
            if type=="COUNT":  
                log_query = """  
                        select to_char(can.created_date+ interval '330' minute,'dd-mm-yyyy hh:mi:ss') as created_date,
                        to_char(can.modified_date+ interval '330' minute,'dd-mm-yyyy hh:mi:ss') as modified_date,
                        (case when (can.is_active is true ) then 'Active' else 'In Active' end) as status,
                        (select username from auth_user where id = can.created_by_id) as createdby_username,
                        coalesce((select username from auth_user where id = can.modified_by_id),'') as modify_username,
                        to_char(offer.created_date::timestamptz - interval '330' minute,'dd-mm-yyyy hh12:mi:ss') as created_datatime,
                        coalesce(can.first_name,'')||' '||coalesce(can.last_name,'') as title from ta_candidate_info can inner join ta_offer_info offer on can.id = offer.candidate_id order by created_datatime desc
                        """
                cur.execute(log_query)   
                log_details = q.dictfetchall(cur)    
                json_datas['log_details'] = log_details
                k=['all_Offer','Offer_Accepted','Offer_Declined','Offer_Made','Offer_Revised','Offer_Withdrawn'] 
                dic = {}
                values=[];       
                if user_id:
                    offer_head_count=query.fetch_hcms_query(config.talent_acquisition,config.ta_offer_count)
                    if offer_head_count:
                        for i in k:
                            if i=="all_Offer":
                                offer_head_count_query=offer_head_count.format(inner_qry="",condition= "")
                                cur.execute(offer_head_count_query)
                            else:
                                offer_head_count_query=offer_head_count.format(inner_qry="inner join reference_items ro on ro.id=oi.offer_release_id",condition="and oi.offer_release_id="+post.get(i))
                                cur.execute(offer_head_count_query)
                            values=query.dictfetchall(cur)  
                            if values:
                                values=values[0] 
                                dic[i]=values['count']  
                    commit =lib.db_commit(cur) 
                    close = lib.db_close(cur)
                    json_datas['datas'] = dic
                    json_datas = json_datas#response data function call
            elif type=="DETAIL":
                tab_id=post.get("tab_id")
                
                json_datas = {}   
                if user_id:
                    offer_details=query.fetch_hcms_query(config.talent_acquisition,config.ta_offer_details)
                    if tab_id=="all":
                        offer_details_query=offer_details.format(col=",(case when oi.offer_release_id IS NULL then 'Offer Created' else ( select rr.refitems_name  from reference_items rr where rr.id=oi.offer_release_id) end  )as offer_status",inr_join="",condition="")
                    else:
                        offer_details_query=offer_details.format(col=",coalesce(rs.refitems_name ,'')as offer_status",inr_join="inner join reference_items rs on rs.id=oi.offer_release_id",condition=" and rs.id="+tab_id)
                    if offer_details:
                        cur.execute(offer_details_query) 
                        values=query.dictfetchall(cur)
                        if values:    
                            json_datas['datas'] = values                              
                    commit =lib.db_commit(cur)  
                    close = lib.db_close(cur) 
            elif type=="CHOOSE":    
                json_datas = {}
                id=post.get('id')
                param=post.get("param")
                if id and param:
                    offer_details_row=query.fetch_hcms_query(config.talent_acquisition,config.ta_offer_details_row) 
                    if param=="all":
                        offer_details_row=offer_details_row.format(col=",(case when oi.offer_release_id IS NULL then 'Offer Created' else ( select rr.refitems_name  from reference_items rr where rr.id=oi.offer_release_id) end  )as offer_status",inr_join="")
                    else:
                        offer_details_row=offer_details_row.format(col=",rs.refitems_name as offer_status",inr_join="inner join reference_items rs on rs.id=oi.offer_release_id ")
                    if offer_details_row:
                        cur.execute(offer_details_row%(id,))  
                        values=query.dictfetchall(cur)
                        if values:
                            json_datas['datas'] = values                            
                    commit =lib.db_commit(cur) 
                    close = lib.db_close(cur)
                    
            logger_obj.info('Talent Acquisition  TAOfferCount response is'+str(json_datas)+"attempted by "+str(request.user.username))                 
    except Exception as e:
       logger_obj.error(e)
       json_datas['datas'] = []
    return HttpResponse(json.dumps(json_datas))
