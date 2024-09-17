# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.shortcuts import render

import json
from django.views.decorators.csrf import csrf_exempt
from django.http.response import HttpResponse
from CommonLib import query
from django.db import connection
from CommonLib import query as q
import config
#template render html
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from CommonLib.hcms_common import refitem_fetch,refitemlink_fetch
from CommonLib.hcms_common import record_validation
from CommonLib.hcms_common import menu_access_control
from Talent_Acquisition.talent_acquisition.models import InterviewInfo,CandidateInfo
from django_countries import countries
import logging
import logging.handlers
import datetime
from random import randint
logger_obj = logging.getLogger('logit')

#Recruitment views here
class TARecruitment(TemplateView): 
    ''' 
    09-JULY-2018 SYA To HRMS recruitment page loaded. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: SYA
    '''
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(TARecruitment, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Interview Management', self.request.user.id)
        if macl:
             template_name = "talent_acquisition/recruitment/recruitment.html"
        else:
            template_name = "tags/access_denied.html"
        return [template_name]    
        
   
    def get(self, request, *args, **kwargs):
         context = super(TARecruitment, self).get_context_data(**kwargs)
         
         cur = connection.cursor()    
         res = refitem_fetch('INTYP')
         context[config.interview_type_info] = res         
         # Candidate drop down
         cur.execute(q.fetch_hcms_query(config.talent_acquisition, config.ta_fetch_candidate_info))
         res = q.dictfetchall(cur)
         context[config.candidate_info] = res         
         # Job title drop down
         cur.execute(q.fetch_hcms_query(config.talent_acquisition, config.ta_job_title_drop_down))
         res = q.dictfetchall(cur)
         context[config.job_title_info] = res   
         # interviewer drop down
         cur.execute(q.fetch_hcms_query(config.talent_acquisition, config.ta_interviewer_drop_down))
         res = q.dictfetchall(cur)
         context[config.interviewer_info] = res 
         # interview status drop down
         cur = connection.cursor()    
         res = refitem_fetch('INSTS')
         context[config.interview_status_info] = res  
         # Interview Rating
         cur = connection.cursor()    
         res = refitem_fetch('INRAT')
         context[config.interview_rating_info] = res         
         return self.render_to_response(context)
     
#Recruitment CRUD Operations here
@csrf_exempt
def TARecruitmentDetails(request): 
    ''' 
    10-JULY-2018 SYA To HRMS Candidate Basic Details CRUD Operation
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: SYA
    '''
    try:
            logger_obj.info('Recruitment CRUD operations function by'+str(request.user.username))
            json_data = {}
            post = request.POST
            data = request.POST.get(config.datas)   
            delete_id = request.POST.get(config.delete_id)   
            uid = request.user.id  
            if not uid:
                uid = 1
            recruitment_id = request.POST.get(config.table_id)    
            candidate_id = request.POST.get(config.candidate_id)   
            job_id =  request.POST.get(config.job_id)       
            cur = connection.cursor()  # Fetch Candidate Status                
            cur.execute(q.fetch_hcms_query(config.talent_acquisition, config.ta_fetch_reference_id),("Interview",))
            res = q.dictfetchall(cur)
            candidate_status = res[0]['id']
            if data and not delete_id:
                    data = json.loads(data)  
                    doc_name = str(str(data[0]['doc_name']).strip())+'_INT'+str(randint(10000, 99999))
                    if data[0]['attachment_id'] == 0:
                       att_id = None 
                    else:
                       att_id = int(data[0]['attachment_id'])                       
                       
                    cur.execute(q.fetch_hcms_query(config.talent_acquisition, config.ta_interview_check_already_exists),(data[0]['candidate_name'],data[0]['job_title'],))
                    interview = cur.rowcount
                    cur.execute(q.fetch_hcms_query(config.talent_acquisition, config.ta_interview_check_offer_status),(data[0]['candidate_name'],data[0]['job_title'],))
                    offer = cur.rowcount
                    
                    if not recruitment_id:                         
                            if offer > 0:
                                json_data[config.status_key] = config.offer_given
                            elif interview > 0:
                                json_data[config.status_key] = config.record_already_referred                            
                            else:  
                                status_interview = InterviewInfo(interview_type_id=data[0]['interview_type'],doc_name=str(doc_name),attachment_id=(att_id), candidate_name_id=data[0]['candidate_name'], job_title_id=data[0]['job_title'] , 
                                                           interviewer_ids=data[0]['interviewer'], interview_status_id=data[0]['interview_status'], interview_date = data[0]['interview_date'],from_time=data[0]['from_time'],
                                                           to_time=data[0]['to_time'],comments=data[0]['comments'],rating_id = data[0]['interview_rating'],created_by_id=int(uid),is_active="True")
                               
                                status_interview.save()
                                status_candidate_insert =  CandidateInfo.objects.filter(id=candidate_id,job_opening_id=data[0]['job_title']).update(candidate_status_id=candidate_status,interview_id=data[0]['interview_type'],screening_id=None,offer_release_id=None,hired_id=None,source_of_hire_id=None)
                                json_data[config.status_id] = status_interview.id
                                json_data[config.status_key] = config.success_status  
                    else:        
                           if offer > 0:
                                json_data[config.status_key] = config.offer_given
                           else:                                           
                               doc_names = str(data[0]['doc_name']).strip();
                               results = InterviewInfo.objects.filter(id = recruitment_id,doc_name = str(doc_names)).values('doc_name');
                               if results:
                                   doc_name = doc_names
                               print "---------doc_names------",doc_names
                               status = InterviewInfo.objects.filter(id=recruitment_id).update(interview_type_id=data[0]['interview_type'],doc_name=str(doc_name),attachment_id=(att_id), candidate_name_id=data[0]['candidate_name'],
                                                               job_title_id=data[0]['job_title'], interviewer_ids=data[0]['interviewer'], interview_status_id=data[0]['interview_status'],interview_date = data[0]['interview_date'], 
                                                               from_time=data[0]['from_time'], to_time=data[0]['to_time'], comments=data[0]['comments'], rating_id = data[0]['interview_rating'], modified_by_id=int(uid))
                               json_data[config.status_key] = config.update_status    
                               status_candidate_update =  CandidateInfo.objects.filter(id=candidate_id,job_opening_id=data[0]['job_title']).update(candidate_status_id=candidate_status,interview_id=data[0]['interview_type'],screening_id=None,offer_release_id=None,hired_id=None,source_of_hire_id=None)
                    print "--------------------------------",int(data[0]['candidate_name']),int(data[0]['interview_status'])
                    cur.execute('select status from ta_interview_tracking_info where candidate_name_id={0} and interview_status_id={1} and is_active'.format(int(data[0]['candidate_name']),int(data[0]['interview_status'])))
                    tracking_res = q.dictfetchall(cur)
                    print "-------------------------tracking_res------------------",tracking_res
                    if tracking_res:
                        print "-------------------------Tracking Update------------------"
                    else:
                        cur.execute('select max(status) as status from ta_interview_tracking_info where candidate_name_id={0} and is_active'.format(int(data[0]['candidate_name'])))
                        tracking_result = q.dictfetchall(cur)
                        print "=====>",tracking_result
                        if tracking_result:
                            print "----->"
                            if tracking_result[0]['status']:
                                tracking_res_id = int(tracking_result[0]['status'])+1
                            else:
                                tracking_res_id = 1 
                            print "=======================================",tracking_res_id
                        else:
                            tracking_res_id = 1
                        print "-------------------------tracking_res_id------------------",tracking_res_id
                        #interview tracking info details
                        cur.execute('''
                                        INSERT INTO ta_interview_tracking_info(
                                        is_active, interview_date, from_time, 
                                        to_time, comments, doc_name, attachment_id, candidate_name_id, 
                                        interview_status_id, interview_type_id, interviewer_ids, 
                                        rating_id, status, job_title_id)
                                        VALUES (true, %s, %s,
                                        %s, %s, %s, %s, %s, 
                                        %s, %s, %s, 
                                        %s, %s, %s);
                                    ''',(str(data[0]['interview_date']),str(data[0]['from_time'])
                                         ,data[0]['to_time'],data[0]['comments'],doc_name,att_id,data[0]['candidate_name']
                                         ,data[0]['interview_status'],data[0]['interview_type'],data[0]['interviewer']
                                         ,data[0]['interview_rating'],tracking_res_id,data[0]['job_title']))
                         
            elif delete_id:
                        recruitment_status =  InterviewInfo.objects.filter(id=delete_id).update(is_active="False",modified_by_id=int(uid))
                        json_data[config.status_key] = config.remove_status         
                        status_candidate =  CandidateInfo.objects.filter(id=candidate_id,job_opening_id=job_id).update(interview_id=None)
                        cur.execute('''update ta_interview_tracking_info set is_active=false where candidate_name_id={}'''.format(candidate_id))
            logger_obj.info('Recruitment CRUD operations response is'+str(json_data)+"attempted by"+str(request.user.username))                       
    except Exception as e:
            logger_obj.error(e)
            json_data[config.status_key] = e
    return HttpResponse(json.dumps(json_data))


#Recruitment data get function here
@csrf_exempt
def TARecruitmentDataTable(request):
    ''' 
    10-JULY-2018 SYA To Recruitment datatable function
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: SYA
    '''
    json_data ={}
    try:
        filter_name = request.POST.get('filter_name');
        cur = connection.cursor()
        logger_obj.info('Recruitment datatable function by'+str(request.user.username))        
        if filter_name is None:
            cur.execute(q.fetch_hcms_query(config.talent_acquisition, config.ta_fetch_recruitment_info))
        else:
            query = q.fetch_hcms_query(config.talent_acquisition, config.ta_fetch_recruitment_info)
            cur.execute(query+" where a.candidate_name ilike '%"+str(filter_name)+"%'")
        res = cur.fetchall()  
        json_data[config.results] = res
    except Exception as e:
        logger_obj.error(e)
        json_data[config.results] = []
    return HttpResponse(json.dumps(json_data))

#Recruitment Tracking Details function
@csrf_exempt
def TAInterviewTrackingDetails(request):
    ''' 
    11-Feb-2019 TRU To Recruitment Tracking Details
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: TRU
    '''
    json_data ={}
    try:
        logger_obj.info('Recruitment Tracking Details click function by'+str(request.user.username))
        candidate_id = request.GET.get('candidate_id')
        print "===============candidate_id================================>",candidate_id
        cur = connection.cursor()
        query = '''
                select status,coalesce(to_char(interview_date,'dd-mm-yyyy'),'') as interview_date,
            case when is_active = true then 'Active' else 'In-Active' end as status,
            from_time::varchar,to_time::varchar,coalesce(comments,'') as comments,
            coalesce((select first_name||' '||last_name from ta_candidate_info where id = ti.candidate_name_id),'') as candidate,
            coalesce((select refitems_name from reference_items where id = ti.interview_status_id),'') as interview_status,
            coalesce((select refitems_name from reference_items where id = ti.interview_type_id),'') as interview_type,
            coalesce((select refitems_name from reference_items where id = ti.rating_id),'') as rating,
            coalesce(
            (select array_to_string(array
            (select coalesce(name, '') || coalesce(last_name, '') as name from employee_info  where id
            in (select unnest(string_to_array(interviewer_ids, ','))::int  from ta_interview_tracking_info where id=ti.id) order by name), ', ')),'') as interviewer,
            coalesce(comments,'') as comments,is_active
            from ta_interview_tracking_info ti
            where candidate_name_id = %s order by ti.status 
        '''
        cur.execute(query,(candidate_id,))
        res = q.dictfetchall(cur) 
        json_data[config.results] = res
    except Exception as e:
        logger_obj.error(e)
        json_data[config.results] = []
    return HttpResponse(json.dumps(json_data))

#Recruitment data table click function
@csrf_exempt
def TARecruitmentDataTableClick(request):
    ''' 
    10-JULY-2018 SYA To Recruitment datatable click Operation
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: SYA
    '''
    json_data ={}
    try:
        logger_obj.info('Recruitment datatable click function by'+str(request.user.username))
        post = request.POST            
        recruitment_id = request.POST.get(config.recruitment_id)
        cur = connection.cursor()
        query = q.fetch_hcms_query(config.talent_acquisition, config.ta_recruitment_table_click)
        cur.execute(query,(recruitment_id,))
        res = q.dictfetchall(cur) 
        json_data[config.results] = res
    except Exception as e:
        logger_obj.error(e)
        json_data[config.results] = []
    return HttpResponse(json.dumps(json_data))

#none values assign
def noneValuesAssign(dataValues):
    try:
        if dataValues in '':
            dataValues = None
        else:
            return dataValues
    except Exception as e:      
        print e



    