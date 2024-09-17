# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.shortcuts import render

import json
from django.views.decorators.csrf import csrf_exempt
from django.http.response import HttpResponse
from django.db import connection
from CommonLib.hcms_common import file_datainsert
from CommonLib import query as q
from CommonLib import lib
import HCMS.settings as setting
from CommonLib.asyn_mail import asyn_email, attachment_asyn_email
from datetime import datetime
from validate_email import validate_email
# Importing random to generate 
# random string sequence 
import random 
# Importing string library function 
import string 
import logging
import logging.handlers
logger_obj = logging.getLogger('logit')


#custom query function here
custom_query = '''
select joi.id,coalesce(joi.job_title,'') as title,to_char(joi.target_date,'DD-MM-YYYY ') as target_date,
to_char(joi.date_opened,'DD-MM-YYYY ') as date_opened,coalesce(joi.number_of_positions,0) as nop,
coalesce(joi.job_description,'') as job_description,coalesce(joi.job_short_description,'') as job_short_description,coalesce(joi.job_location,'') as job_location,
coalesce(
(select string_agg(aa.name,', ') from (
select refitems_name as name from reference_items where 
id = any(select unnest (string_to_array(key_skills, ',')::integer[]) 
from ta_job_openings_info where id=joi.id) order by name
)aa)
,'') as key_skills,
coalesce(joi.salary,'') as salary,
(select refitems_name from reference_items where id=joi.job_type_id) as job_type,
(select refitems_name from reference_items where id=joi.shift_id) as shift_type,
(select refitems_name from reference_items where id=joi.work_experience_id) as work_experience,
(select name from organization_info where id=joi.org_id) as org,
(select orgunit_name from organization_unit_info where id=joi.org_unit_id) as division, 
(select name from team_details_info where id=joi.department_id) as team,
(select coalesce(name||' '||last_name,'') from employee_info  where id=joi.assigned_recruiter_id) as assigned,
(select coalesce(name||' '||last_name,'') from employee_info  where id=joi.recruiter_id) as recruiter,
(select coalesce(name||' '||last_name,'') from employee_info  where id=joi.contact_no_id) as contact,joi.logo_type_id,joi.job_cat_id
from ta_job_openings_info joi
where job_publish='1' and joi.is_active
'''   

#job category details function here
@csrf_exempt
def job_category(request):
    ''' 
    18-Dec-2018 Tru To Talent Acquisitions Job Category Details. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL 
    @author: Tru
    '''   
    print('Job Category Details')
    json_data = {}
    cur=lib.db_connection()
    try:
            query = """
                select id,refitems_name as name,refitems_desc as image,
                (select count(*) from ta_job_openings_info where job_cat_id=ri.id and is_active and job_publish='1') as job_count from reference_items ri
                where is_active and refitems_category_id=137 order by job_count desc
            """
            cur.execute(query)
            job_category = q.dictfetchall(cur)
            json_data['data'] = job_category
            return HttpResponse(json.dumps(json_data),status=200)
    except Exception as e:
        return HttpResponse(json.dumps(json_data),status=400)
    
#job specific details function here
@csrf_exempt
def job_opening_login(request):
    ''' 
    18-Dec-2018 Tru To Talent Acquisitions Job Specific Details. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL 
    @author: Tru
    '''   
    print('Login Details')
    json_data = {}
    cur=lib.db_connection()
    try:
        login_details = json.loads(request.body)
        login_fields = login_details['data']
        query = "select id,job_opening_id from ta_candidate_info where primary_email='{0}' and pwd='{1}'".format(str(login_fields[0]['email']),str(login_fields[0]['mobile']))
        cur.execute(query)
        job_openings_login_details = q.dictfetchall(cur)
        if job_openings_login_details:
            json_data['status'] = 'NTE-11'
            cur.execute("""
                    select cand.id,job_opening_id,coalesce(first_name||' '||last_name) as name,ri.refitems_name as candidate_status,primary_email,mobile_no,address, 
		    coalesce((select job_title from ta_job_openings_info where id=job_opening_id),'') as job_title,coalesce((select job_short_description from ta_job_openings_info 
		    where id=job_opening_id),'') as job_short_desc,coalesce((select job_description from ta_job_openings_info where id=job_opening_id),'') as job_desc,
		    coalesce(to_char(cand.modified_date,'dd/mm/yyyy'),'') as applied_date from ta_candidate_info cand left join reference_items ri on 
                    cand.candidate_status_id = ri.id where cand.id = {0} and job_opening_id = {1}
            """.format(int(job_openings_login_details[0]['id']),int(job_openings_login_details[0]['job_opening_id'])))
            interview_details = q.dictfetchall(cur)
            json_data['interview_details'] = interview_details
            cur.execute("""
                    select to_char(interview_date,'dd/mm/yyyy') as interview_date from ta_interview_tracking_info 
                    where status = 1 and candidate_name_id = {0} and job_title_id = {1}
            """.format(int(job_openings_login_details[0]['id']),int(job_openings_login_details[0]['job_opening_id'])))
            interview_date_details = q.dictfetchall(cur)
            json_data['interview_date_details'] = interview_date_details
            query = '''
                    select status,coalesce(to_char(interview_date,'dd-mm-yyyy'),'') as interview_date,
                    case when is_active = true then 'Active' else 'In-Active' end as emp_status,
                    from_time::varchar,to_time::varchar,coalesce(comments,'') as comments,
                    coalesce((select first_name||' '||last_name from ta_candidate_info where id = ti.candidate_name_id),'') as candidate,
                    coalesce((select refitems_name from reference_items where id = ti.interview_status_id),'') as interview_status,
                    coalesce((select refitems_name from reference_items where id = ti.interview_type_id),'') as interview_type,
                    coalesce((select refitems_name from reference_items where id = ti.rating_id),'') as rating,
                    coalesce((select name||' '||last_name from employee_info where id = ti.interviewer_id),'') as interviewer,
                    is_active,job_title_id,
                    coalesce((select job_title from ta_job_openings_info where id=job_title_id),'') as job_title,
                    coalesce((select job_short_description from ta_job_openings_info where id = job_title_id),'') as job_short_desc,
                    coalesce((select job_description from ta_job_openings_info where id = job_title_id),'') as job_desc
                    from ta_interview_tracking_info ti
                    where candidate_name_id = %s and job_title_id = %s order by ti.status 
            '''
            cur.execute(query,(int(job_openings_login_details[0]['id']),int(job_openings_login_details[0]['job_opening_id']),))
            job_interview_status_details = q.dictfetchall(cur)
            json_data['interview_tracking_details'] = job_interview_status_details
            cur.execute("""
                    select id,coalesce(to_char(created_date,'dd-mm-yyyy'),'') as created_date,is_active,doc_download_name,ctc,doc_mail_status,candidate_id,cost_to_employee_id,created_by_id,job_title_id,modified_by_id,offer_release_id where candidate_id = {0} and job_title_id = {1}
            """.format(int(job_openings_login_details[0]['id']),int(job_openings_login_details[0]['job_opening_id'])))
            interview_refer_offer_details = q.dictfetchall(cur)
            json_data['interview_refer_offer_details'] = interview_refer_offer_details
            cur.execute("""
                    select id,coalesce(to_char(created_date,'dd-mm-yyyy'),'') as created_date,is_active,doc_download_name,ctc,doc_mail_status,candidate_id,cost_to_employee_id,created_by_id,job_title_id,modified_by_id,offer_release_id where candidate_id = {0} and job_title_id = {1} and offer_release_id=655
            """.format(int(job_openings_login_details[0]['id']),int(job_openings_login_details[0]['job_opening_id'])))
            interview_offer_details = q.dictfetchall(cur)
            json_data['interview_offer_details'] = interview_offer_details
            return HttpResponse(json.dumps(json_data),status=200)
        else:
            json_data['status'] = 'NTE-12'
            return HttpResponse(json.dumps(json_data),status=200)
    except Exception as e:
        return HttpResponse(json.dumps(json_data),status=400)
  
#attachment operations function here
def attachment_operations(*args):
    ''' 
    19-Dec-2018 Tru To Talent Acquisitions Attachment Operations. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL 
    @author: Tru'''
    try:
        print "---------",args
        file_name = args[1]+'.'+args[2]
        if args[3] == 'Insert':
                print "---att---insert"
                args[0].execute('insert into attachment_info (name,path,format,is_active) values(%s,%s,%s,true) returning id',(str(file_name),str('/Interview/'),str(args[2]),))
                insert_res = args[0].fetchone() 
                print "====Image Insert REturning ID========>",insert_res[0]
                return insert_res[0]
        elif args[3] == 'Update':
                print "---att---update"
                args[0].execute('update attachment_info set name=%s,path=%s,format=%s where id=%s returning id ',(str(file_name),str('/Interview/'),str(args[2]),str(args[4]),))
                update_res = args[0].fetchone() 
                print "====Image Update REturning ID========>",update_res[0]
                return update_res[0]
    except Exception as e:
        print e
        return False  
    
#interview operations function here
def interview_operation(*args):
    ''' 
    19-Dec-2018 Tru To Talent Acquisitions Interview Operation. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL 
    @author: Tru'''
    try:
        args[0].execute('select id,attachment_id from ta_interview_info where candidate_name_id={0}'.format(int(args[1])))
        job_interview_status = q.dictfetchall(args[0])
        if job_interview_status:
             att_status = 1
             if job_interview_status[0]['attachment_id']:
                 print "-0-----Attachment===Update",job_interview_status[0]['attachment_id']
                 att_status = attachment_operations(args[0],args[3],args[4],'Update',job_interview_status[0]['attachment_id'])
             else:
                 print "----1-----Attachmetn====Insert",job_interview_status[0]['attachment_id']
                 att_status = attachment_operations(args[0],args[3],args[4],'Insert')
             print "---------update job of interview----------",job_interview_status,att_status
             args[0].execute("update ta_interview_info set candidate_name_id={0},job_title_id={1},doc_name='{2}',attachment_id={3} where candidate_name_id={0} and job_title_id={1}".format(int(args[1]),int(args[2]),str(args[3]),int(att_status)))
        else:
             print "----3-----Attachmetn====Insert"
             att_status = attachment_operations(args[0],args[3],args[4],'Insert')
             print "---------insert job of interview----------",job_interview_status,att_status
             args[0].execute("insert into ta_interview_info (candidate_name_id,job_title_id,doc_name,attachment_id,is_active) values ({0},{1},'{2}',{3},true)".format(int(args[1]),int(args[2]),str(args[3]),int(att_status)))
        return True
    except Exception as e:
        print e
        return False    
    
#job details function here
@csrf_exempt
def job_opening_details(request,cat_id):
    ''' 
    17-Dec-2018 Tru To Talent Acquisitions Job Opening Details. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL 
    @author: Tru
    '''   
    print('Job Opening Details')
    json_data = {}
    cur=lib.db_connection()
    try:
            print "---------get cat datas---------",cat_id
            query = custom_query+' and joi.job_cat_id={}'.format(int(cat_id))
            cur.execute(str(query)+' order by title')
            job_openings_details = q.dictfetchall(cur)
            json_data['data'] = job_openings_details
            return HttpResponse(json.dumps(json_data),status=200)
    except Exception as e:
        print e
        return HttpResponse(json.dumps(json_data),status=400)
    
#job details function here
@csrf_exempt
def job_opening_data(request):
    ''' 
    17-Dec-2018 Tru To Talent Acquisitions Job Opening Details. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL 
    @author: Tru
    '''   
    print('Job Opening Details')
    json_data = {}
    cur=lib.db_connection()
    created_date = format(datetime.now())
    modified_date = format(datetime.now())
    try:
        if request.method == "GET":
            print "---------get----------"
            cur.execute(str(custom_query)+' order by title')
            job_openings_details = q.dictfetchall(cur)
            json_data['data'] = job_openings_details
            return HttpResponse(json.dumps(json_data),status=200)
        elif request.method == "POST":
            job_details = json.loads(request.body)
            file_details = job_details['file_upload_data']
            job_fields = job_details['data']
            print job_fields[0]['email'],"------data-----",job_fields
            if job_fields:
                is_valid = validate_email(str(job_fields[0]['email']),verify=True)
                print "===========================================>",is_valid
                if is_valid != None and is_valid : 
                    cur.execute("select id from ta_candidate_info where primary_email='{}'".format(str(job_fields[0]['email'])))
                    job_fetch_details = q.dictfetchall(cur)
                    print "-------------------job_fetch_details---------------",job_fetch_details
                    if job_fetch_details:
                        print "-------Update Candiate--------"
                        cur.execute("""
                        update ta_candidate_info set first_name=%s,last_name=%s,mobile_no=%s,date_of_birth=%s,address=%s,city=%s,country_id=%s,province_id=%s,gender_id=%s,job_opening_id=%s,postal_code=%s,pwd=%s,is_active=true,modified_date=%s where primary_email=%s and mobile_no=%s  
                        returning id""",
                        (str(job_fields[0]['fname']),str(job_fields[0]['lname']),str(job_fields[0]['mobile']),str(job_fields[0]['dob']),str(job_fields[0]['address']),str(job_fields[0]['location']),
                        str(job_fields[0]['country']),str(job_fields[0]['state']),str(job_fields[0]['gender']),str(job_fields[0]['job_id']),str(job_fields[0]['pin']),str(job_fields[0]['mobile']),str(modified_date),str(job_fields[0]['email']),str(job_fields[0]['mobile'])))
                        update_candidate_details = q.dictfetchall(cur)
                        print "======update details===============",update_candidate_details
                        canidate_id = update_candidate_details[0]['id']
                        print "--------",canidate_id,str(job_fields[0]['job_id'])
                        file_name = 'NTE-Candidate-00{0}.{1}'.format(str(canidate_id),str(file_details[0]['format']))
                        file_name_interview = 'NTE-Candidate-00{0}'.format(str(canidate_id))
                        print "---file Upload--",file_details[0]['format'],file_details[0]['folder_name'],file_name
                        file_status = file_datainsert(['Interview'], [{'file_name': file_name, 'file_binary': file_details[0]['img_str']}])
                        print "----file_status-------",file_status
                        status = interview_operation(cur,canidate_id,int(job_fields[0]['job_id']),str(file_name_interview),str(file_details[0]['format']))
                        json_data['data'] = 'NTE-02'
                        name = str(job_fields[0]['fname'])+' '+str(job_fields[0]['lname'])
                        applynotification_candidate(name,str(job_fields[0]['mobile']),str(job_fields[0]['email']),str(job_fields[0]['job_id']))
                        applynotification_hcm(name,str(job_fields[0]['mobile']),str(job_fields[0]['email']),str(job_fields[0]['job_id']))
                        return HttpResponse(json.dumps(json_data),status=200)
                    else:
                        print "-------Insert Candiate--------"
                        cur.execute("""
                        insert into ta_candidate_info(first_name,last_name,primary_email,mobile_no,date_of_birth,address,city,country_id,province_id,gender_id,job_opening_id,postal_code,pwd,is_active,created_date,modified_date)
                        values(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,true,%s,%s)
                        returning id""",(str(job_fields[0]['fname']),str(job_fields[0]['lname']),str(job_fields[0]['email']),str(job_fields[0]['mobile']),str(job_fields[0]['dob']),str(job_fields[0]['address']),str(job_fields[0]['location']),
                        str(job_fields[0]['country']),str(job_fields[0]['state']),str(job_fields[0]['gender']),str(job_fields[0]['job_id']),str(job_fields[0]['pin']),str(job_fields[0]['mobile']),str(created_date),str(modified_date),))
                        insert_candidate_details = q.dictfetchall(cur)
                        canidate_id = insert_candidate_details[0]['id']
                        print "--------",canidate_id,str(job_fields[0]['job_id'])
                        file_name = 'NTE-Candidate-00{0}.{1}'.format(str(canidate_id),str(file_details[0]['format']))
                        file_name_interview = 'NTE-Candidate-00{0}'.format(str(canidate_id))
                        print "---file Upload--",file_details[0]['format'],file_details[0]['folder_name'],file_name
                        file_status = file_datainsert(['Interview'], [{'file_name': file_name, 'file_binary': file_details[0]['img_str']}])
                        print "----file_status-------",file_status
                        status = interview_operation(cur,canidate_id,int(job_fields[0]['job_id']),str(file_name_interview),str(file_details[0]['format']))
                        json_data['data'] = 'NTE-01'
                        name = str(job_fields[0]['fname'])+' '+str(job_fields[0]['lname'])
                        applynotification_candidate(name,str(job_fields[0]['mobile']),str(job_fields[0]['email']),str(job_fields[0]['job_id']))
                        applynotification_hcm(name,str(job_fields[0]['mobile']),str(job_fields[0]['email']),str(job_fields[0]['job_id']))
                        return HttpResponse(json.dumps(json_data),status=201)
                else:
                    json_data['data'] = 'NTE-05'
                return HttpResponse(json.dumps(json_data),status=201)
    except Exception as e:
        print e
        json_data['data'] = 'NTE-05'
        return HttpResponse(json.dumps(json_data),status=400)

#mail data access
def applynotification_candidate(*args):
    try:
            print "---------------args--------------",int(args[3])
            cur=lib.db_connection()
            query = "select job_title as name from ta_job_openings_info where id={0}".format(int(args[3]))
            cur.execute(query)
            job_details = q.dictfetchall(cur)
            if job_details:
                name = str(args[0])
                mobile = str(args[1])
                email = str(args[2])
                job_name = str(job_details[0]['name'])
                mail = str(args[2])
                content = '''
                            <p>Dear {0},</p>
                            <p>Thank you very much for applying for <b>{3}</b> at NEXT Inc. We will be reviewing your application along with the others that we have received in the next couple of days. 
                            If you are shortlisted for the next phase of the Talent Acquisition process, you will be contacted for an interview session.</p>
                            <p>Please login using the given link http://nexttechnosolutions.com/joinus.html to your selection process status.</p><br>
                            <p><b>Login Details</b></p>
                            <p>User Name - <mark>{1}</mark></p>
                            <p>Password - <mark>{2}</mark></p><br>
                            <p>We appreciate your interest in our company and wish you all the best in this selection process.</p>
                            <p>Sincerely,</p> 
                            <p>HCM Team</p> 
                            <p>NEXT Inc.</p> 
                    '''.format(str(name),str(email),str(mobile),str(job_name))
                print "----------------",name,mail,content
                query_status = asyn_email(setting.SENDER_JOIN2,"Track Your Candidature Credentials Details",name,mail,str(content),'waiting')
            return True
    except Exception as e:
        print e     
        return False

#mail data access
def applynotification_hcm(*args):
    try:
            print "---------------args--------------",int(args[3])
            cur=lib.db_connection()
            query = "select job_title as name from ta_job_openings_info where id={0}".format(int(args[3]))
            cur.execute(query)
            job_details = q.dictfetchall(cur)
            if job_details:
                query = '''
                select coalesce(to_char(tci.modified_date,'dd/Mon/yyyy'),'') as date,coalesce(ai.name,'') as attachment from ta_candidate_info tci 
                inner join ta_interview_info tii on tci.id = tii.candidate_name_id
                left join attachment_info ai on ai.id = tii.attachment_id where tci.primary_email='{0}'
                '''.format(str(args[2]))
                cur.execute(query)
                job_attach_details = q.dictfetchall(cur)
                if job_attach_details:
                    print "---------job_attach_details---------",job_attach_details
                    name = str(args[0])
                    job_name = str(job_details[0]['name'])
                    print "-------------------------",name,job_name
                    applied_date = str(job_attach_details[0]['date'])
                    attachment = str(job_attach_details[0]['attachment'])
                    mail = 'hcm@nexttechnosolutions.com'
                    attachment_path = '/home/next/.hcms/uploads/Interview/'+attachment
                    print "===========>",attachment_path
                    subject = 'Reg - {2} applied for {0} on {1}'.format(str(job_name),str(applied_date),str(name))
                    print "---------------------------------",attachment_path,subject,applied_date
                    content = '''
                                <p>Dear HCM Team,</p>
                                <p>{0} applied for {1} on {2}, Profile has been attached for your references.<p>
                                <p><mark>Act fast. Candidates are most responsive within 3 days of their application.</mark></p><br>
                                <p>Please login to HCMS https://mynext.nexttechnosolutions.com to review the received application.</p>
                                <p>Regards,</p> 
                                <p>HCMS Admin</p> 
                                <p>NEXT Inc.</p> 
                        '''.format(str(name),str(job_name),str(applied_date))
                    print "----------------",name,mail,content
                    query_status = attachment_asyn_email(setting.SENDER_JOIN5,'Candidate Job Applied Status',subject,mail,str(content),'waiting',attachment_path,attachment)
            return True
    except Exception as e:
        print e     
        return False
    
#mail data access
def applynotification(*args):
    try:
            print "---------------args--------------",int(args[3])
            cur=lib.db_connection()
            query = "select job_title as name from ta_job_openings_info where id={0}".format(int(args[3]))
            cur.execute(query)
            job_details = q.dictfetchall(cur)
            if job_details:
                name = str(args[0])
                mobile = str(args[1])
                email = str(args[2])
                job_name = str(job_details[0]['name'])
                mail = str(args[2])
                content = '''
                            <p>Dear {0},</p>
                            <p>Candidate Name : <mark>{0}</mark></p>
                            <p>User Name : <mark>{1}</mark></p>
                            <p>Password : <mark>{2}</mark></p>
                            <p>Applied Job Name : <mark>{3}</mark></p>
                            <p>Kindly Login and check your status</p>
                            <p>Regards,</p> 
                            <p>HCMS Admin</p> 
                            <p>NEXT Inc.</p> 
                    '''.format(str(name),str(email),str(mobile),str(job_name))
                print "----------------",name,mail,content
                query_status = asyn_email(setting.SENDER_JOIN2,"Track Your Candidature Credentials Details",name,mail,str(content),'waiting')
            return True
    except Exception as e:
        print e     
        return False
           
           
#job specific details function here
@csrf_exempt
def job_opening_single_data(request,cat_id,id):
    ''' 
    17-Dec-2018 Tru To Talent Acquisitions Job Opening Single Details. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL 
    @author: Tru
    '''   
    print(cat_id,'Job Opening cat Single Details',id)
    json_data = {}
    cur=lib.db_connection()
    try:
        query = custom_query+' and joi.job_cat_id={}'.format(int(cat_id))
        fquery = query +' and joi.id={}'.format(int(id))
        cur.execute(fquery+' order by title')
        job_openings_details = q.dictfetchall(cur)
        json_data['data'] = job_openings_details
        return HttpResponse(json.dumps(json_data),status=200)
    except Exception as e:
        return HttpResponse(json.dumps(json_data),status=400)
    
#job name filter details function here
@csrf_exempt
def job_opening_filter_data(request,cat_id,name):
    ''' 
    17-Dec-2018 Tru To Talent Acquisitions Job Opening name filter Details. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL 
    @author: Tru
    '''   
    print(cat_id,'Job Opening  filter title Details',name)
    json_data = {}
    cur=lib.db_connection()
    try:
        query = custom_query+' and joi.job_cat_id={}'.format(int(cat_id))
        fquery = query +" and joi.job_title ilike '%{}%'".format(str(name))
        cur.execute(fquery+' order by title')
        job_openings_details = q.dictfetchall(cur)
        json_data['data'] = job_openings_details
        return HttpResponse(json.dumps(json_data),status=200)
    except Exception as e:
        print e
        return HttpResponse(json.dumps(json_data),status=400)
@csrf_exempt
def job_category_filter_data(request,name):  
    ''' 
    17-Dec-2018 Tru To Talent Acquisitions Job category name filter Details. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL 
    @author: PAR 
    '''    
    print('Job Opening Category filter title Details',name) 
    json_data = {}  
    cur=lib.db_connection()
    try:
        query = """   
                select id,refitems_name as name,refitems_desc as image,
                (select count(*) from ta_job_openings_info where job_cat_id=ri.id and is_active and job_publish='1') as job_count from reference_items ri
                where is_active and refitems_category_id=137 
            """
        fquery = query +"   and refitems_name ilike '%{}%'".format(str(name))
        cur.execute(fquery+' order by id desc') 
        job_openings_details = q.dictfetchall(cur)
        json_data['data'] = job_openings_details
        return HttpResponse(json.dumps(json_data),status=200)       
    except Exception as e:
        print e
        return HttpResponse(json.dumps(json_data),status=400)    
    
#job details function here
@csrf_exempt
def latest_job_opening_data(request):
    ''' 
    17-Dec-2018 Tru To Talent Acquisitions Job Opening Details. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL 
    @author: Tru
    '''   
    print('Job Opening latest Details')
    json_data = {}
    cur=lib.db_connection()
    try:
        cur.execute(str(custom_query)+' order by title limit 5')
        job_openings_details = q.dictfetchall(cur)
        json_data['data'] = job_openings_details
        return HttpResponse(json.dumps(json_data),status=200)
    except Exception as e:
        print e
        return HttpResponse(json.dumps(json_data),status=400)

#job specific details function here
@csrf_exempt
def latest_job_opening_single_data(request,id):
    ''' 
    17-Dec-2018 Tru To Talent Acquisitions Job Opening Single Details. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL 
    @author: Tru
    '''   
    print('Job Opening latest Single Details',id)
    json_data = {}
    cur=lib.db_connection()
    try:
        query = custom_query +' and joi.date_opened <= (select now()::date+10) and joi.id={}'.format(int(id))
        cur.execute(query+' order by title')
        job_openings_details = q.dictfetchall(cur)
        json_data['data'] = job_openings_details
        return HttpResponse(json.dumps(json_data),status=200)
    except Exception as e:
        return HttpResponse(json.dumps(json_data),status=400)
    
#job name filter details function here
@csrf_exempt
def latest_job_opening_filter_data(request,name):
    ''' 
    17-Dec-2018 Tru To Talent Acquisitions Latest Job Opening name filter Details. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL 
    @author: Tru
    '''   
    print('Job Opening  latest filter title Details',name)
    json_data = {}
    cur=lib.db_connection()
    try:
        query = custom_query +" and joi.date_opened <= (select now()::date+10) and joi.job_title ilike '%{}%'".format(str(name))
        cur.execute(query+' order by title')
        job_openings_details = q.dictfetchall(cur)
        json_data['data'] = job_openings_details
        return HttpResponse(json.dumps(json_data),status=200)
    except Exception as e:
        print e
        return HttpResponse(json.dumps(json_data),status=400)
    
#country details function here
@csrf_exempt
def country(request):
    ''' 
    18-Dec-2018 Tru To Talent Acquisitions Country Details. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL 
    @author: Tru
    '''   
    print('Country Details')
    json_data = {}
    cur=lib.db_connection()
    try:
        cur.execute("select id,country_name as name,ccode,cphone,lower(substr(ccode, 1, length(ccode) - 1))||'.png' as img from country_info where is_active order by status::int asc")
        job_openings_details = q.dictfetchall(cur)
        json_data['data'] = job_openings_details
        return HttpResponse(json.dumps(json_data),status=200)
    except Exception as e:
        print e
        return HttpResponse(json.dumps(json_data),status=400)

#country based state details function here
@csrf_exempt
def country_state(request,id):
    ''' 
    18-Dec-2018 Tru To Talent Acquisitions Country State Details. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL 
    @author: Tru
    '''   
    print('Sate Details',id)
    json_data = {}
    cur=lib.db_connection()
    try:
        query = 'select id,state_name as name from state_info where is_active and country_id={}'.format(int(id))
        print "-------------------",query
        cur.execute(query+' order by name')
        job_openings_details = q.dictfetchall(cur)
        json_data['data'] = job_openings_details
        return HttpResponse(json.dumps(json_data),status=200)
    except Exception as e:
        return HttpResponse(json.dumps(json_data),status=400)
    
#gender details function here
@csrf_exempt
def gender(request):
    ''' 
    18-Dec-2018 Tru To Talent Acquisitions Gender Details. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL 
    @author: Tru
    '''   
    print('Gender Details')
    json_data = {}
    cur=lib.db_connection()
    try:
        cur.execute('select id,refitems_name as name from reference_items  where refitems_category_id=20 order by name')
        job_openings_details = q.dictfetchall(cur)
        json_data['data'] = job_openings_details
        return HttpResponse(json.dumps(json_data),status=200)
    except Exception as e:
        print e
        return HttpResponse(json.dumps(json_data),status=400) 
def send_reachus_mail(name,candidate_email,mobile,message,to_mail):
    ''' 
    15-Apr-2019 PAR to generate mail content nad send mail for reach us 
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL 
    @author: Tru
    '''
    try:
        reachus_content = '''   
                    
                    <p>Dear HCMS,</p>
                    <p> 
                        You have received an email from {0} ,details received from website is as follows
                    </p>
                    <p>Name : <mark>{1}</mark></p>    
                    <p>Email : <mark>{2}</mark></p> 
                    <p>Mobile : <mark>{3}</mark></p> 
                    <p>Message : {4}</p>   
                    <p>Regards,</p> 
                    <p>HCMS Admin</p>  
                    <p>NEXT Inc.</p>  
                            '''.format(str(name),str(name),str(candidate_email),str(mobile),str(message))
        query_status = asyn_email(setting.REACH_US,setting.REACH_US,setting.REACH_US,to_mail,str(reachus_content),'waiting')
    except Exception as e: 
        print e
#gender details function here   
@csrf_exempt
def feedback(request):
    ''' 
    20-Dec-2018 Tru To Talent Acquisitions feedback Details. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL 
    @author: Tru
    '''   
    print('feedback Details') 
    json_data = {}
    cur=lib.db_connection()
    try:
        feedback_details = json.loads(request.body) 
        feedback_fields = feedback_details['data'] 
        mail_type=feedback_details.get('type')
        is_valid = validate_email(str(feedback_fields[0]['feedback_email']),verify=True)
        print "===========================================>",is_valid
        if is_valid != None and is_valid : 
            cur.execute("select id from feedback where feedback_email='{0}' and feed_mobile='{1}'".format(str(feedback_fields[0]['feedback_email']),str(feedback_fields[0]['phone'])))
            job_openings_details = q.dictfetchall(cur)
            if job_openings_details:
                print "-----------Already Registered--------"
                json_data['data'] = 'NTE-04'
                return HttpResponse(json.dumps(json_data),status=200)
            else:
                print "-----------Insert--------"
                cur.execute("insert into feedback (feed_name,feed_mobile,feed_type,feedback_email,feed_role,rating,comments) values (%s,%s,%s,%s,%s,%s,%s)",
                            (str(feedback_fields[0]['feed_name']),str(feedback_fields[0]['phone']),int(feedback_fields[0]['feed_type']),
                             str(feedback_fields[0]['feedback_email']),int(feedback_fields[0]['feed_role']),int(feedback_fields[0]['rating']),str(feedback_fields[0]['feed_comments']),))
                json_data['data'] = 'NTE-01'
                name = str(feedback_fields[0]['feed_name'])  
                email = str(feedback_fields[0]['feedback_email']) 
                mobile = str(feedback_fields[0]['phone'])      
                job_name = 'General Job Query'  
                rating = str(feedback_fields[0]['rating'])  
                feedback = str(feedback_fields[0]['feed_comments'])   
                mail = 'hcm@nexttechnosolutions.com'
                #mail = 'parthasarathi.venkatachalam@nexttechnosolutions.co.in' 
                if mail_type =='REACH':
                    send_reachus_mail(str(name),str(email),str(mobile),str(feedback),mail)
                    return HttpResponse(json.dumps(json_data),status=201)
                else:
                    content = '''  
                                <p>Dear HCMS,</p>
                                <p>Name : <mark>{0}</mark></p>   
                                <p>Email : <mark>{1}</mark></p> 
                                <p>Mobile : <mark>{2}</mark></p> 
                                <p>Query Type : <mark>{3}</mark></p> 
                                <p>Rating : <mark>{5}/5</mark></p>   
                                <p>Query : {4}</p>
                                <p>Regards,</p> 
                                <p>HCMS Admin</p> 
                                <p>NEXT Inc.</p> 
                        '''.format(str(name),str(email),str(mobile),str(job_name),str(feedback),str(rating))
                    query_status = asyn_email(setting.SENDER_JOIN1,"General Job Query",name,mail,str(content),'waiting')
        else:
                json_data['data'] = 'NTE-E05'
        return HttpResponse(json.dumps(json_data),status=201)
    except Exception as e:
        print e
        json_data['data'] = 'NTE-05'
        return HttpResponse(json.dumps(json_data),status=400)

#meet expertise details function here
@csrf_exempt
def meet_expertise(request):
    ''' 
    21-Dec-2018 Tru To Talent Acquisitions meet our expertise Details. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL 
    @author: Tru
    '''   
    print('Meet Expertise Details')
    json_data = {}
    cur=lib.db_connection()
    try:
        cur.execute('''
            select ei.id,coalesce(ei.name,'')||' '||coalesce(LEFT(ei.last_name,1),'') as name,coalesce(ai.name,'no_data.png') as profile,
            coalesce(to_char(date_of_joining,'YYYY'),'') as jd ,
            coalesce((select role_title from hcms_ti_role_details where id=ei.role_id_id),'') as role
            from employee_info ei
            left join attachment_info ai on ai.id=ei.image_id_id where ei.id in (select emp_id from meet_our_expertise where status = 1)
            and ei.is_active order by name 
        ''')
        job_openings_details = q.dictfetchall(cur)
        json_data['data'] = job_openings_details
        return HttpResponse(json.dumps(json_data),status=200)
    except Exception as e:
        print e
        return HttpResponse(json.dumps(json_data),status=400)
    
#Human Capital Augmentation details function here
@csrf_exempt
def hca_details(request):
    ''' 
    24-Dec-2018 Tru To Talent Acquisitions Human Capital Augmentation Details. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL 
    @author: Tru
    '''   
    print('Human Capital Augmentation Details')
    json_data = {}
    cur=lib.db_connection()
    try:
        cur.execute('''
          select id,refitems_name as name,coalesce(refitems_desc,'') as details from reference_items  where refitems_category_id  = 138 order by name
        ''')
        hca_details = q.dictfetchall(cur)
        json_data['data'] = hca_details
        return HttpResponse(json.dumps(json_data),status=200)
    except Exception as e:
        print e
        return HttpResponse(json.dumps(json_data),status=400)

#candidate password reset details function here
@csrf_exempt
def candidate_password_reset(request):
    ''' 
    27-Dec-2018 Tru To Talent Acquisitions Candidate Password Update Details. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL 
    @author: Tru
    '''   
    print('Candidate Password Update Details')
    json_data = {}
    cur=lib.db_connection()
    try:
      if request.method == "PUT":
            login_details = json.loads(request.body)
            login_fields = login_details['data']
            print login_fields[0]['login_email'],"------data-----",login_fields
            if login_fields:
                cur.execute("select id,first_name,last_name,primary_email,job_opening_id from ta_candidate_info where primary_email='{}' and otp='{}'".format(str(login_fields[0]['login_email']),str(login_fields[0]['otp'])))
                login_fetch_details = q.dictfetchall(cur)
                print "-------------------login_fields details---------------",login_fetch_details
                if login_fetch_details:
                    print "-------login_fields Update Candiate--------"
                    cur.execute("""
                    update ta_candidate_info set pwd=%s where primary_email=%s 
                    returning id""",(str(login_fields[0]['login_mobile2']),str(login_fields[0]['login_email']),))
                    update_candidate_details = q.dictfetchall(cur)
                    print "----------------update_candidate_details-",update_candidate_details
                    canidate_id = update_candidate_details[0]['id']
                    json_data['data'] = 'NTE-02'
                    name = str(login_fetch_details[0]['first_name'])+' '+str(login_fetch_details[0]['last_name'])
                    applynotification(name,str(login_fields[0]['login_mobile2']),str(login_fields[0]['login_email']),str(login_fetch_details[0]['job_opening_id']))
                    return HttpResponse(json.dumps(json_data),status=200)
                else:
                    json_data['data'] = 'NTE-03'
                    return HttpResponse(json.dumps(json_data),status=201)
    except Exception as e:
        print e
        json_data['data'] = 'NTE-04'
        return HttpResponse(json.dumps(json_data),status=400)
    
#Exit Employee details function here
@csrf_exempt
def exit_details(request):
    ''' 
    24-Jan-2019 Tru To Talent Acquisitions Exit Employee Details. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL 
    @author: Tru
    '''   
    print(' Exit Employee Details')
    json_data = {}
    cur=lib.db_connection()
    try:
        querys = '''select ei.id,(ei.name||' '||ei.last_name) as name,coalesce(ai.name,'no_data.png') as profile,rd.role_title,
            td.name as tname,ei.work_email,coalesce(moe.status,0) as status,coalesce(to_char(ei.date_of_joining,'dd-mm-yyyy'),'') as doj,
            coalesce(to_char(ei.date_of_releaving,'dd-mm-yyyy'),'') as dor
            from employee_info ei
            inner join hcms_ti_role_details rd on rd.id=ei.role_id_id
            left join attachment_info ai on ai.id = ei.image_id_id
            inner join team_details_info td on td.id = ei.team_name_id
            inner join exit_our_expertise moe on moe.emp_id = ei.id
            where ei.is_active=false and status=1
        '''  
        cur.execute(querys)
        exit_details = q.dictfetchall(cur)
        json_data['data'] = exit_details
        return HttpResponse(json.dumps(json_data),status=200)
    except Exception as e:
        print e
        return HttpResponse(json.dumps(json_data),status=400)
    
#random generate code
def rand_pass(size): 
    generate_pass = ''.join([random.choice( string.ascii_uppercase +
                                            string.ascii_lowercase +
                                            string.digits) 
                                            for n in range(size)]) 
                            
    return generate_pass 

#Exit Employee Request details function here
@csrf_exempt
def exit_request_register(request):
    ''' 
    05-Feb-2019 Tru To Talent Acquisitions Exit Request Register Details. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL 
    @author: Tru
    '''   
    print('Exit Request Register Details')
    json_data = {}
    cur=lib.db_connection()
    try:
        exit_details = json.loads(request.body)
        exit_fields = exit_details['data']
        rand_code = rand_pass(10) 
        print "-----------------exit_fields register--------",exit_fields,rand_code
        cur.execute("select id from employee_info where employee_id='{0}' and name ilike '{1}'".format(str(exit_fields[0]['emp_id']),str(exit_fields[0]['ename'])))
        employee_details = q.dictfetchall(cur)
        if employee_details :
            cur.execute("select id from ex_employee_details where hremail='{0}' and hrmobile='{1}'".format(str(exit_fields[0]['hremail']),str(exit_fields[0]['hrmobile'])))
            job_openings_details = q.dictfetchall(cur)
            if job_openings_details:
                cur.execute("""update ex_employee_details set emp_id='{0}',status='pending' where hremail='{1}' and hrmobile='{2}'""".format(str(exit_fields[0]['emp_id']),str(exit_fields[0]['hremail']),str(exit_fields[0]['hrmobile'])))
                print "-----------Already Registered and Update it--------"
                json_data['data'] = 'NTE-02'
                return HttpResponse(json.dumps(json_data),status=200)
            else:
                is_valid = validate_email(str(exit_fields[0]['hremail']),verify=True)
                print "=======================is_valid====================>",is_valid
                if is_valid != None and is_valid : 
                    print "-----------Insert--------"
                    cur.execute("insert into ex_employee_details (ename,emp_id,hrname,hremail,hrmobile,hrcompany,hrcomments,code,status) values (%s,%s,%s,%s,%s,%s,%s,%s,%s)",
                                (str(exit_fields[0]['ename']),str(exit_fields[0]['emp_id']),str(exit_fields[0]['hrname']),
                                 str(exit_fields[0]['hremail']),str(exit_fields[0]['hrmobile']),str(exit_fields[0]['hrcompany']),str(exit_fields[0]['hrcomments']),str(rand_code),str('pending')))
                    json_data['data'] = 'NTE-01'
                    name = str(exit_fields[0]['ename'])
                    hrname = str(exit_fields[0]['hrname'])
                    hremail = str(exit_fields[0]['hremail'])
                    hrcompany = str(exit_fields[0]['hrcompany'])
                    hrmobile = str(exit_fields[0]['hrmobile'])
                    mail = 'hcm@nexttechnosolutions.com'
                    content = '''
                                <p>Dear HCMS,</p>
                                <p>Request E-verification Name (Ex-Employee): <mark>{0}</mark>.</p>
                                <p>Request HR Details : </p>
                                <p>Name : <mark>{1}</mark></p>
                                <p>Email : <mark>{2}</mark></p>
                                <p>Mobile : <mark>{3}</mark></p>
                                <p>Company : <mark>{4}</mark></p>
                                <p>Regards,</p> 
                                <p>HCMS Admin</p> 
                                <p>NEXT Inc.</p> 
                        '''.format(str(name),str(hrname),str(hremail),str(hrmobile),str(hrcompany))
                    print "----------------",name,mail,content
                    otp_status = asyn_email(setting.SENDER_JOIN3,"E-Verification User name and Password Details",hrname,mail,str(content),'waiting')
                    return HttpResponse(json.dumps(json_data),status=201)
                else:
                    json_data['data'] = 'NTE-05'
                    return HttpResponse(json.dumps(json_data),status=200)
        else:
            json_data['data'] = 'NTE-06'
            return HttpResponse(json.dumps(json_data),status=200)
    except Exception as e:
        print "=====================",e
        json_data['data'] = 'NTE-05'
        return HttpResponse(json.dumps(json_data),status=400)
    
#Exit Employee Login details function here
@csrf_exempt
def exit_request_login(request):
    ''' 
    05-Feb-2019 Tru To Talent Acquisitions Exit Request Login Details. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL 
    @author: Tru
    '''   
    print('Ex Login Details')
    json_data = {}
    cur=lib.db_connection()
    try:
        exit_details = json.loads(request.body)
        exit_fields = exit_details['data']
        print "-----------------exit_fields login--------",exit_fields
        cur.execute("""
        select ei.id,ei.name,eed.code,eed.hrname as hrname from ex_employee_details eed 
        inner join employee_info ei on ei.employee_id = eed.emp_id
        where hremail='{0}' and code='{1}'
        and eed.status='approved' and ei.is_active=false
        """.format(str(exit_fields[0]['uname']),str(exit_fields[0]['pwd'])))
        job_openings_details = q.dictfetchall(cur)
        if job_openings_details:
            print "-----------Login--------"
            json_data['data'] = 'NTE-01'
            json_data['result'] = job_openings_details
            return HttpResponse(json.dumps(json_data),status=201)
        else:
            print "-----------Not Approved Login Registered--------"
            json_data['data'] = 'NTE-02'
            return HttpResponse(json.dumps(json_data),status=200)
           
    except Exception as e:
        print e
        json_data['data'] = 'NTE-05'
        return HttpResponse(json.dumps(json_data),status=400)
    
#Exit Employee Approved details function here
@csrf_exempt
def exit_request_approved(request,emp_id):
    ''' 
    24-Jan-2019 Tru To Talent Acquisitions Exit Approved Employee Details. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL 
    @author: Tru
    '''   
    print(' Exit Approved Employee Details')
    json_data = {}
    cur=lib.db_connection()
    try:
        querys1 = '''select ei.id,(ei.name||' '||ei.last_name) as name,coalesce(ai.name,'no_data.png') as profile,rd.role_title,
            td.name as tname,ei.work_email,coalesce(to_char(ei.date_of_joining,'dd-mm-yyyy'),'') as doj,
            coalesce(to_char(ei.date_of_releaving,'dd-mm-yyyy'),'') as dor,coalesce(ei.employee_id,'') as emp_id
            from employee_info ei
            inner join hcms_ti_role_details rd on rd.id=ei.role_id_id
            left join attachment_info ai on ai.id = ei.image_id_id
            inner join team_details_info td on td.id = ei.team_name_id
            where ei.is_active=false and ei.id={0}
        '''.format(int(emp_id))
        cur.execute(querys1)
        exit_emp_details = q.dictfetchall(cur)
        querys2 = """select id, user_id, emp_id, project_details, contribution, schedule_variance, effort_varience, 
            ontime_percent, overdue_percent as overdue_tasks, total_members, case when ratings_scored = 'NIL' then '0' else ratings_scored end as ratings_scored,
            project_status,actual_hours from exit_employee_project_details  where emp_id={0} and approve_status='approved' and project_type = 'Inhouse/Non Commercial'""".format(int(emp_id))
        cur.execute(querys2)
        exit_pro_incom_details = q.dictfetchall(cur)
        querys3 = """select id, user_id, emp_id, project_details, contribution, schedule_variance, effort_varience, 
            ontime_percent, overdue_percent as overdue_tasks, total_members, case when ratings_scored = 'NIL' then '0' else ratings_scored end as ratings_scored,
            project_status,actual_hours from exit_employee_project_details  where emp_id={0} and approve_status='approved' and project_type = 'Commercial'""".format(int(emp_id))
        cur.execute(querys3)
        exit_pro_com_details = q.dictfetchall(cur)
        json_data['exit_emp_details'] = exit_emp_details
        json_data['exit_pro_incom_details'] = exit_pro_incom_details
        json_data['exit_pro_com_details'] = exit_pro_com_details
        return HttpResponse(json.dumps(json_data),status=200)
    except Exception as e:
        print e
        return HttpResponse(json.dumps(json_data),status=400)
    
#interview status tracking details function here
@csrf_exempt
def interview_status_tracking(request,id):
    ''' 
    15-Feb-2018 Tru To Talent Acquisitions Interview Status Tracking Details. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL 
    @author: Tru
    '''   
    print('Interview Status Tracking Details',id)
    json_data = {}
    cur=lib.db_connection()
    try:
        print "------Candidate Id-------",id
        query = '''
            select status,coalesce(to_char(interview_date,'dd-mm-yyyy'),'') as interview_date,
            case when is_active = true then 'Active' else 'In-Active' end as status,
            from_time::varchar,to_time::varchar,coalesce(comments,'') as comments,
            coalesce((select first_name||' '||last_name from ta_candidate_info where id = ti.candidate_name_id),'') as candidate,
            coalesce((select refitems_name from reference_items where id = ti.interview_status_id),'') as interview_status,
            coalesce((select refitems_name from reference_items where id = ti.interview_type_id),'') as interview_type,
            coalesce((select refitems_name from reference_items where id = ti.rating_id),'') as rating,
            coalesce((select name||' '||last_name from employee_info where id = ti.interviewer_id),'') as interviewer,
            coalesce(comments,'') as comments,is_active
            from ta_interview_tracking_info ti
            where candidate_name_id = %s order by ti.status 
        '''
        cur.execute(query,(id,))
        job_interview_status_details = q.dictfetchall(cur)
        json_data['data'] = job_interview_status_details
        return HttpResponse(json.dumps(json_data),status=200)
    except Exception as e:
        return HttpResponse(json.dumps(json_data),status=400)
    
#join us feedback details function here
@csrf_exempt
def job_tracking_feedback(request):
    ''' 
    19-Feb-2019 Tru To Talent Acquisitions job tracking feedback Details. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL 
    @author: Tru
    '''   
    print('Join us feedback Details')
    json_data = {}
    cur=lib.db_connection()
    try:
        feedback_details = json.loads(request.body)
        feedback_fields = feedback_details['data']
        cur.execute("select candidate_id from job_tracking_feedback where candidate_id='{0}' and job_id='{1}'".format(str(feedback_fields[0]['candidate_id']),str(feedback_fields[0]['job_id'])))
        job_openings_details = q.dictfetchall(cur)
        if job_openings_details:
            print "-----------Already Registered--------"
            json_data['data'] = 'NTE-04'
            return HttpResponse(json.dumps(json_data),status=200)
        else:
            print "-----------Insert--------"
            cur.execute("insert into job_tracking_feedback(rating,candidate_id,job_id,comments) values (%s,%s,%s,%s)",
                        (str(feedback_fields[0]['job_ratings']),int(feedback_fields[0]['candidate_id']),int(feedback_fields[0]['job_id']),
                         str(feedback_fields[0]['comments']),))
            json_data['data'] = 'NTE-01'
            mail_content_query = '''
                select coalesce(tci.first_name||' '||tci.last_name,'') as name,coalesce(tci.primary_email,'') as email,
                coalesce(tci.mobile_no,'') as mobile,coalesce(tci.primary_email,'') as email,coalesce(tjo.job_title,'') as job_name,
                coalesce(jtf.comments,'') as feedback,coalesce(jtf.rating,'') as rating
                from job_tracking_feedback jtf
                inner join ta_candidate_info tci
                on jtf.candidate_id = tci.id
                inner join ta_job_openings_info tjo
                on tjo.id = jtf.job_id where jtf.candidate_id={0}
            '''.format(int(feedback_fields[0]['candidate_id']))
            cur.execute(mail_content_query)
            feedback_details = q.dictfetchall(cur)
            name = str(feedback_details[0]['name'])
            email = str(feedback_details[0]['email'])
            mobile = str(feedback_details[0]['mobile'])
            job_name = str(feedback_details[0]['job_name'])
            rating = str(feedback_details[0]['rating'])
            feedback = str(feedback_details[0]['feedback'])
            mail = 'hcm@nexttechnosolutions.com'
            content = '''
                        <p>Dear HCMS,</p>
                        <p>Candidate Name : <mark>{0}</mark></p>
                        <p>Email : <mark>{1}</mark></p>
                        <p>Mobile : <mark>{2}</mark></p>
                        <p>Applied Job Name : <mark>{3}</mark></p>
                        <p>Rating : <mark>{5}/5</mark></p>
                        <p>Query : {4}</p>
                        <p>Regards,</p> 
                        <p>HCMS Admin</p> 
                        <p>NEXT Inc.</p> 
                '''.format(str(name),str(email),str(mobile),str(job_name),str(feedback),str(rating))
            print "----------------",name,mail,content
            query_status = asyn_email(setting.SENDER_JOIN1,"Track Your Candidature Query",name,mail,str(content),'waiting')
            return HttpResponse(json.dumps(json_data),status=201)
    except Exception as e:
        print e
        json_data['data'] = 'NTE-05'
        return HttpResponse(json.dumps(json_data),status=400)
    
#join us forgot password otp details function here
@csrf_exempt
def job_candidate_otp(request):
    ''' 
    01-Mar-2019 Tru To Talent Acquisitions job candidate forgot password otp Details. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL 
    @author: Tru
    '''   
    print('Join us job candidate forgot password otp details')
    json_data = {}
    cur=lib.db_connection()
    try:
        candidate_email_details = json.loads(request.body)
        candidate_email = candidate_email_details['data']
        is_valid = validate_email(str(candidate_email[0]['email_id']),verify=True)
        print "===========================================>",is_valid
        if is_valid != None and is_valid : 
            cur.execute("select id,coalesce(first_name,'')||' '||coalesce(last_name,'') as name from ta_candidate_info where primary_email='{0}' and is_active".format(str(candidate_email[0]['email_id'])))
            candidate_details = q.dictfetchall(cur)
            if candidate_details:
                rand_otp = rand_pass(10)
                cur.execute("update ta_candidate_info set otp='{0}' where primary_email='{1}' and is_active".format(str(rand_otp),str(candidate_email[0]['email_id'])))
                print candidate_email,"---------------candidate_email---",candidate_details,rand_otp
                email = str(candidate_email[0]['email_id'])
                name = str(candidate_details[0]['name'])
                mail = email
                content = '''
                       <p>Dear {0},</p>
                       <p>Name : <mark>{0}</mark></p>
                       <p>Email : <mark>{1}</mark></p>
                       <p>OTP : <mark>{2}</mark></p>
                       <p>Regards,</p> 
                       <p>HCMS Admin</p> 
                       <p>NEXT Inc.</p> 
                '''.format(str(name),str(email),str(rand_otp))
                query_status = asyn_email(setting.SENDER_JOIN4,"Track Your Candidature OTP Query",name,mail,str(content),'waiting')
                json_data['data'] = 'NTE-01'
            else:
                print candidate_email,"---------------not candidate_email---",candidate_details
                json_data['data'] = 'NTE-02'
        else:
            json_data['data'] = 'NTE-02'
        return HttpResponse(json.dumps(json_data),status=200)
    except Exception as e:
        print e
        json_data['data'] = 'NTE-05'
        return HttpResponse(json.dumps(json_data),status=400)
        
#Email Validation function here
@csrf_exempt
def email_validation(request):
    ''' 
    08-Mar-2019 Tru To Talent Acquisitions Email Details. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL 
    @author: Tru
    '''   
    print('Email Validation Details')
    json_data = {}
    try:
        email_details = json.loads(request.body)
        email_fields = email_details['data']
        is_valid = validate_email(str(email_fields[0]['email']),verify=True)
        print email_fields[0]['email'],"===========================================>",is_valid
        if is_valid != None and is_valid : 
            json_data['data'] = 'NTE-01'
            return HttpResponse(json.dumps(json_data),status=200)
        else:
            json_data['data'] = 'NTE-02'
            return HttpResponse(json.dumps(json_data),status=200)
    except Exception as e:
        print e
	logger_obj.info(e)
        json_data['data'] = 'NTE-05'
        return HttpResponse(json.dumps(json_data),status=400)
    
#core register details function here
@csrf_exempt
def core_register(request):
    ''' 
    11-Mar-2018 Tru To Talent Acquisitions core Details. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL 
    @author: Tru
    '''   
    print('core Register Details')
    json_data = {}
    cur=lib.db_connection()
    try:
        core_details = json.loads(request.body)
        core_fields = core_details['data']
        is_valid = validate_email(str(core_fields[0]['email']),verify=True)
        print "===========================================>",is_valid
        if is_valid != None and is_valid : 
            cur.execute("select id from core_info where email='{0}' and mobile='{1}'".format(str(core_fields[0]['email']),str(core_fields[0]['mobile'])))
            job_openings_details = q.dictfetchall(cur)
            if job_openings_details:
                print "-----------Already Registered--------"
                json_data['data'] = 'NTE-04'
                return HttpResponse(json.dumps(json_data),status=200)
            else:
                print "-----------Insert--------"
                pwd = rand_pass(10)
                cur.execute("insert into core_info (name,mobile,email,company,pwd) values (%s,%s,%s,%s,%s)",
                            (str(core_fields[0]['name']),str(core_fields[0]['mobile']),
                             str(core_fields[0]['email']),str(core_fields[0]['company']),str(pwd),))
                json_data['data'] = 'NTE-01'
                name = str(core_fields[0]['name'])
                email = str(core_fields[0]['email'])
                content = '''
                            <p>Dear {0},</p>
                            <p>User Name : <mark>{1}</mark></p>
                            <p>Password : <mark>{2}</mark></p>
                            <p>Regards,</p> 
                            <p>HCMS Admin</p> 
                            <p>NEXT Inc.</p> 
                    '''.format(str(name),str(email),str(pwd))
                print "----------------",name,email,content
                query_status = asyn_email(setting.SENDER_JOIN6,"User name and Password Details",name,email,str(content),'waiting')
        else:
                json_data['data'] = 'NTE-E05'
        return HttpResponse(json.dumps(json_data),status=201)
    except Exception as e:
        print e
        json_data['data'] = 'NTE-05'
        return HttpResponse(json.dumps(json_data),status=400)
    
#core login details function here
@csrf_exempt
def core_login(request):
    ''' 
    12-Mar-2019 Tru To Core Login Details. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL 
    @author: Tru
    '''   
    print('Core Login Details')
    json_data = {}
    cur=lib.db_connection()
    try:
        login_details = json.loads(request.body)
        login_fields = login_details['data']
        query = "select id from core_info where email='{0}' and pwd='{1}'".format(str(login_fields[0]['lemail']),str(login_fields[0]['lpwd']))
        cur.execute(query)
        login_status = q.dictfetchall(cur)
        if login_status:
            json_data['data'] = 'NTE-01'
            json_data['login_details'] = login_status
            query = """select tcti.customer_id,tci.name as name,tcti.level1::json as level1,tcti.level2::json as level2,tcti.level3::json as level3,tcti.level4::json as level4,
            level1_per,level2_per,level3_per,level4_per,overall_per from core_test_info tcti
            inner join core_info tci on tci.id = tcti.customer_id
            where tcti.customer_id={0}""".format(int(login_status[0]['id']))
            cur.execute(query)
            test_data = q.dictfetchall(cur)
            json_data['dashboard_details'] = test_data
            return HttpResponse(json.dumps(json_data),status=200)
        else:
            json_data['data'] = 'NTE-02'
            json_data['login_details'] = []
            return HttpResponse(json.dumps(json_data),status=200)
    except Exception as e:
        print e
        json_data['data'] = 'NTE-02'
        json_data['login_details'] = []
        return HttpResponse(json.dumps(json_data),status=400)

#core test details function here
@csrf_exempt
def core_test(request):
    ''' 
    12-Mar-2019 Tru To Core test Details. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL 
    @author: Tru
    '''   
    print('Core test Details')
    json_data = {}
    cur=lib.db_connection()
    try:
        test_details = json.loads(request.body)
        test_fields = test_details['data']
        query = "select id from core_test_info where customer_id={0}".format(int(test_fields[0]['cus_id']))
        cur.execute(query)
        test_status = q.dictfetchall(cur)
        if test_status:
            json_data['data'] = 'NTE-02'
            return HttpResponse(json.dumps(json_data),status=200)
        else:
            print "-----------Insert----------"
            lvl1 = dict([(str(k), v) for k, v in (test_fields[0]['level1'][0]).items()])
            lvl1_sum = sum([v for k,v in lvl1.items()])
            lvl1_perc = round(float(lvl1_sum)/9*100)
            level1 = json.dumps(lvl1)
            lvl2 = dict([(str(k), v) for k, v in (test_fields[0]['level2'][0]).items()])
            lvl2_sum = sum([v for k,v in lvl2.items()])
            lvl2_perc = round(float(lvl2_sum)/9*100)
            level2 = json.dumps(lvl2)
            lvl3 = dict([(str(k), v) for k, v in (test_fields[0]['level3'][0]).items()])
            lvl3_sum = sum([v for k,v in lvl3.items()])
            lvl3_perc = round(float(lvl3_sum)/9*100)
            level3 = json.dumps(lvl3)
            lvl4 = dict([(str(k), v) for k, v in (test_fields[0]['level4'][0]).items()])
            lvl4_sum = sum([v for k,v in lvl4.items()])
            lvl4_perc = round(float(lvl4_sum)/9*100)
            level4 = json.dumps(lvl4)
            cus_id = int(test_fields[0]['cus_id'][0])
            overall = round((float(lvl1_sum+lvl2_sum+lvl3_sum+lvl4_sum)/36)*100)
            print "--------------------",level1,level2,level3,level4,cus_id,lvl1_sum,lvl1_perc,lvl2_sum,lvl2_perc,lvl3_sum,lvl3_perc,lvl4_sum,lvl4_perc,overall
            query = '''
            INSERT INTO core_test_info(
            customer_id, level1, level2, level3, level4,level1_per,level2_per,level3_per,level4_per,overall_per, status)
            VALUES (%s, %s, %s, %s, %s,%s, %s, %s, %s, %s, 'completed');
            '''
            cur.execute(query,(cus_id,level1,level2,level3,level4,lvl1_perc,lvl2_perc,lvl3_perc,lvl4_perc,overall))
            json_data['data'] = 'NTE-01'
            return HttpResponse(json.dumps(json_data),status=200)
    except Exception as e:
        print e
        json_data['data'] = 'NTE-03'
        json_data['login_details'] = []
        return HttpResponse(json.dumps(json_data),status=400)

#core password reset details function here
@csrf_exempt
def core_password_reset(request):
    ''' 
    13-Mar-2018 Tru To Talent Acquisitions Candidate Password Update Details. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL 
    @author: Tru
    '''   
    print('Core Password Update Details')
    json_data = {}
    cur=lib.db_connection()
    try:
      if request.method == "PUT":
            login_details = json.loads(request.body)
            login_fields = login_details['data']
            print login_fields[0]['femail'],"------data-----",login_fields
            if login_fields:
                cur.execute("select id,name from core_info where email='{}' and otp='{}'".format(str(login_fields[0]['femail']),str(login_fields[0]['fotp'])))
                login_fetch_details = q.dictfetchall(cur)
                print "-------------------login_fields details---------------",login_fetch_details
                if login_fetch_details:
                    print "-------login_fields Update Candiate--------"
                    cur.execute("""
                    update core_info set pwd=%s where email=%s 
                    returning id""",(str(login_fields[0]['fpwd1']),str(login_fields[0]['femail']),))
                    update_candidate_details = q.dictfetchall(cur)
                    print "----------------update_candidate_details-",update_candidate_details
                    canidate_id = update_candidate_details[0]['id']
                    json_data['data'] = 'NTE-02'
                    name = str(login_fetch_details[0]['name'])
                    applynotificationCore(name,str(login_fields[0]['fpwd1']),str(login_fields[0]['femail']))
                    return HttpResponse(json.dumps(json_data),status=200)
                else:
                    json_data['data'] = 'NTE-03'
                    return HttpResponse(json.dumps(json_data),status=201)
    except Exception as e:
        print e
        json_data['data'] = 'NTE-04'
        return HttpResponse(json.dumps(json_data),status=400)

#mail data access
def applynotificationCore(*args):
    try:
                name = str(args[0])
                pwd = str(args[1])
                mail = str(args[2])
                content = '''
                            <p>Dear {0},</p>
                            <p>Name : <mark>{0}</mark></p>
                            <p>User Name : <mark>{1}</mark></p>
                            <p>Password : <mark>{2}</mark></p>
                            <p>Kindly Login and check your status</p>
                            <p>Regards,</p> 
                            <p>HCMS Admin</p> 
                            <p>NEXT Inc.</p> 
                    '''.format(str(name),str(mail),str(pwd))
                print "----------------",name,mail,content
                query_status = asyn_email(setting.SENDER_JOIN6,"Take Your Digital Assessment Credentials Details",name,mail,str(content),'waiting')
                return True
    except Exception as e:
        print e     
        return False
    

#core forgot password otp details function here
@csrf_exempt
def core_otp(request):
    ''' 
    13-Mar-2019 Tru To Core forgot password otp Details. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL  
    @author: Tru
    '''   
    print('Core forgot password otp details')
    json_data = {}
    cur=lib.db_connection()
    try:
        candidate_email_details = json.loads(request.body) 
        customer_email = candidate_email_details['data']
        is_valid = validate_email(str(customer_email[0]['email_id']),verify=True)
        print "===========================================>",is_valid
        if is_valid != None and is_valid : 
            cur.execute("select id,name from core_info where email='{}'".format(str(customer_email[0]['email_id'])))
            customer_details = q.dictfetchall(cur)
            if customer_details:
                rand_otp = rand_pass(10)   
                cur.execute("update core_info set otp='{0}' where email='{1}'".format(str(rand_otp),str(customer_email[0]['email_id'])))
                print customer_email,"---------------candidate_email---",customer_details,rand_otp
                email = str(customer_email[0]['email_id']) 
                name = str(customer_details[0]['name']) 
                mail = email 
                content = '''   
                       <p>Dear {0},</p> 
                       <p>Name : <mark>{0}</mark></p> 
                       <p>Email : <mark>{1}</mark></p>   
                       <p>OTP : <mark>{2}</mark></p>
                       <p>Regards,</p> 
                       <p>HCMS Admin</p> 
                       <p>NEXT Inc.</p> 
                '''.format(str(name),str(email),str(rand_otp))
                query_status = asyn_email(setting.SENDER_JOIN6,"Take Your Digital Assessment  OTP",name,mail,str(content),'waiting')
                json_data['data'] = 'NTE-01'
            else:
                print candidate_email,"---------------not customer---",customer_details
                json_data['data'] = 'NTE-02'
        else:
            json_data['data'] = 'NTE-02'
        return HttpResponse(json.dumps(json_data),status=200)
    except Exception as e:
        print e
        json_data['data'] = 'NTE-05'
        return HttpResponse(json.dumps(json_data),status=400)