# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.shortcuts import render

import json
from django.views.decorators.csrf import csrf_exempt
from django.http.response import HttpResponse
from CommonLib import query
from django.db import connection
import config
from CommonLib import query as q
from CommonLib.hcms_common import refitem_fetch

#template render html
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from CommonLib.hcms_common import menu_access_control
import datetime
#logger function import
import logging
import logging.handlers
logger_obj = logging.getLogger('logit')

#Talent Acquisition Reporting views here
class TaReporting(TemplateView):
    ''' 
         25-July-2018 TRU To Talent Acquisition Reporting page loaded. And also check the user authentication
         @param request: Request Object
         @type request : Object
         @return:   HttpResponse or Redirect the another URL
         @author: TRU
    '''
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(TaReporting, self).dispatch(request, *args, **kwargs)

    def get_template_names(self):
        macl = menu_access_control('Employee Report', self.request.user.id)
        if macl:
            template_name = "talent_acquisition/report.html"
        else:
            template_name = "tags/access_denied.html"
        return [template_name]
    
    def get(self, request, *args, **kwargs):
         context = super(TaReporting, self).get_context_data(**kwargs)
         cur = connection.cursor()  #create the database connection
         cur.execute(q.fetch_hcms_query(config.attendance_management, config.hrms_org_list));
         values = q.dictfetchall(cur)
         if values:
             org_data = values
         else:
             org_data = []
         gender = refitem_fetch('GENDR')
         context['gender'] = gender
         leave = refitem_fetch('LEVTY')
         # Loading role details       
         cur.execute("""select id,name from hcms_role where is_active""")
         role = q.dictfetchall(cur)
         context['org'] = org_data
         interview_status = refitem_fetch('INSTS')
         context['interview_status'] = interview_status
         job_status = refitem_fetch('OFFRE')
         context['job_status'] = job_status
         cur = connection.cursor()
         cur.execute(q.fetch_hcms_query(config.talent_acquisition, config.ta_job_title_drop_down))
         job_name = q.dictfetchall(cur)
         context['job_name'] = job_name   
         return self.render_to_response(context)

# Job Opening Report Search views here
def hrmsOpeningReportSearch(request):
         ''' 
         25-July-2018 TRU To Job Opening report Search data loaded.
         @param request: Request Object
         @type request : Object
         @return:   HttpResponse Employee Search Data
         @author: TRU
         '''
         logger_obj.info('Job Opening Report search function by'+str(request.user.username))
         json_data = {}
         cur=connection.cursor()  #create the database connection
         post = request.GET
         name = post.get(config.name)  #get table key 
         key = post.get(config.key)  #get table key 
         org_id = post.get(config.org_id)  #get table key 
         org_unit_id = post.get(config.org_unit_id)  #get table key 
         org_div = post.get(config.org_div) #get table key 
         try:
                     query =  q.fetch_hcms_query(config.talent_acquisition, config.job_opening_report_list)
                     conditions = " is_active and"
                     if name != '':
                         conditions = conditions+" job_title ilike '"'%'+str(name)+'%'"' and"
                     if key != '':
                         conditions = conditions+" key_skills ilike '"'%'+str(key)+'%'"' and"
                     if org_unit_id != '':
                         conditions = conditions+" org_unit_id = %s "%int(org_unit_id)
                         conditions = conditions+" and"
                     if org_div != '':
                         conditions = conditions+" department_id = %s "%int(org_div)
                         conditions = conditions+" and"
                     conditions = conditions.rsplit(' ', 1)[0]
                     conditions =   conditions+ " and org_id = %s"%int(org_id) 
                     if cur and query and conditions:
                         querys = (query+str(conditions+" order by job_title"))
                         cur.execute(querys)  
                         values = cur.fetchall()
                         if values:
                            json_data[config.datas] = values
                         else:
                             json_data[config.datas] = []
                     else:
                         json_data[config.datas] = []
                     logger_obj.info('Job Opening Report search response is'+str(json_data)+"attempted by"+str(request.user.username))   
         except Exception as e:
              logger_obj.error(e)
              json_data[config.datas] = []
         cur.close()
         return HttpResponse(json.dumps(json_data))
     
# Job Candidate Report Search views here
def hrmsCandidateReportSearch(request):
         ''' 
         25-July-2018 TRU To Job Opening report Search data loaded.
         @param request: Request Object
         @type request : Object
         @return:   HttpResponse Employee Search Data
         @author: TRU
         '''
         logger_obj.info('Job Candidate Report search function by'+str(request.user.username))
         json_data = {}
         cur=connection.cursor()  #create the database connection
         post = request.GET
         fname = post.get(config.fname)  #get table key 
         lname = post.get(config.lname)  #get table key 
         org_id = post.get(config.org_id)  #get table key 
         org_unit_id = post.get(config.org_unit_id)  #get table key 
         org_div = post.get(config.org_div) #get table key 
         try:
                     query =  q.fetch_hcms_query(config.talent_acquisition, config.job_candidate_report_list)
                     conditions = " tci.is_active and"
                     if fname != '':
                         conditions = conditions+" tci.first_name ilike '"'%'+str(fname)+'%'"' and"
                     if lname != '':
                         conditions = conditions+" tci.last_name ilike '"'%'+str(lname)+'%'"' and"
                     if org_unit_id != '':
                         conditions = conditions+" tjoi.org_unit_id = %s "%int(org_unit_id)
                         conditions = conditions+" and"
                     if org_div != '':
                         conditions = conditions+" tjoi.department_id = %s "%int(org_div)
                         conditions = conditions+" and"
                     conditions = conditions.rsplit(' ', 1)[0]
                     conditions =   conditions+ " and tjoi.org_id = %s"%int(org_id) 
                     if cur and query and conditions:
                         querys = (query+str(conditions+" order by tci.first_name,tci.last_name"))
                         cur.execute(querys)  
                         values = cur.fetchall()
                         if values:
                            json_data[config.datas] = values
                         else:
                             json_data[config.datas] = []
                     else:
                         json_data[config.datas] = []
                     logger_obj.info('Job Candidate Report search response is'+str(json_data)+"attempted by"+str(request.user.username))   
         except Exception as e:
              logger_obj.error(e)
              json_data[config.datas] = []
         cur.close()
         return HttpResponse(json.dumps(json_data))

# Job Interview Report Search views here
def hrmsInterviewReportSearch(request):
         ''' 
         25-July-2018 TRU To Job Interview report Search data loaded.
         @param request: Request Object
         @type request : Object
         @return:   HttpResponse Interview Search Data
         @author: TRU
         '''
         logger_obj.info('Job Interview Report search function by'+str(request.user.username))
         json_data = {}
         cur=connection.cursor()  #create the database connection
         post = request.GET
         date = post.get(config.date)  #get table key 
         status = post.get(config.status)  #get table key 
         org_id = post.get(config.org_id)  #get table key 
         org_unit_id = post.get(config.org_unit_id)  #get table key 
         org_div = post.get(config.org_div) #get table key 
         try:
                     query =  q.fetch_hcms_query(config.talent_acquisition, config.job_interview_report_list)
                     conditions = " tci.is_active and"
                     if date != '':
                         change_date = date.split('-')[2]+'-'+date.split('-')[1]+'-'+date.split('-')[0]
                         conditions = conditions+" tii.interview_date in ('"+str(change_date)+"') and"
                     if status != '':
                         conditions = conditions+" tii.interview_status_id = %s "%int(status)
                         conditions = conditions+" and"
                     if org_unit_id != '':
                         conditions = conditions+" tjoi.org_unit_id = %s "%int(org_unit_id)
                         conditions = conditions+" and"
                     if org_div != '':
                         conditions = conditions+" tjoi.department_id = %s "%int(org_div)
                         conditions = conditions+" and"
                     conditions = conditions.rsplit(' ', 1)[0]
                     conditions =   conditions+ " and tjoi.org_id = %s"%int(org_id) 
                     if cur and query and conditions:
                         querys = (query+str(conditions+" order by tci.first_name,tci.last_name"))
                         cur.execute(querys)  
                         values = cur.fetchall()
                         if values:
                            json_data[config.datas] = values
                         else:
                             json_data[config.datas] = []
                     else:
                         json_data[config.datas] = []
                     logger_obj.info('Job Interview Report search response is'+str(json_data)+"attempted by"+str(request.user.username))   
         except Exception as e:
              logger_obj.error(e)
              json_data[config.datas] = []
         cur.close()
         return HttpResponse(json.dumps(json_data))
     
# Job Interview Report Search views here
def hrmsOfferReportSearch(request):
         ''' 
         25-July-2018 TRU To Job Interview report Search data loaded.
         @param request: Request Object
         @type request : Object
         @return:   HttpResponse Interview Search Data
         @author: TRU
         '''
         logger_obj.info('Job Interview Report search function by'+str(request.user.username))
         json_data = {}
         cur=connection.cursor()  #create the database connection
         post = request.GET
         job_name = post.get(config.job_name)  #get table key 
         job_status = post.get(config.job_status)  #get table key 
         org_id = post.get(config.org_id)  #get table key 
         org_unit_id = post.get(config.org_unit_id)  #get table key 
         org_div = post.get(config.org_div) #get table key 
         try:
                     query =  q.fetch_hcms_query(config.talent_acquisition, config.job_offer_report_list)
                     conditions = " toi.is_active and"
                     if job_name != '':
                         conditions = conditions+" tjoi.id = %s "%int(job_name)
                         conditions = conditions+" and"
                     if job_status != '':
                         conditions = conditions+" toi.offer_release_id = %s "%int(job_status)
                         conditions = conditions+" and"
                     if org_unit_id != '':
                         conditions = conditions+" tjoi.org_unit_id = %s "%int(org_unit_id)
                         conditions = conditions+" and"
                     if org_div != '':
                         conditions = conditions+" tjoi.department_id = %s "%int(org_div)
                         conditions = conditions+" and"
                     conditions = conditions.rsplit(' ', 1)[0]
                     conditions =   conditions+ " and tjoi.org_id = %s"%int(org_id) 
                     if cur and query and conditions:
                         querys = (query+str(conditions+" order by tci.first_name,tci.last_name")) 
                         cur.execute(querys)  
                         values = cur.fetchall()
                         if values:
                            json_data[config.datas] = values
                         else:
                             json_data[config.datas] = []
                     else:
                         json_data[config.datas] = []
                     logger_obj.info('Job Interview Report search response is'+str(json_data)+"attempted by"+str(request.user.username))   
         except Exception as e:
              logger_obj.error(e)
              json_data[config.datas] = []
         cur.close()
         return HttpResponse(json.dumps(json_data))
     
# Job Candidate Report Search views here
def hrmsCandidateHiredReportSearch(request):
         ''' 
         23-August-2018 SYA Hired Candidate report Search data loaded.
         @param request: Request Object
         @type request : Object
         @return:   HttpResponse Employee Search Data
         @author: SYA
         '''
         logger_obj.info('Hired Candidate Report search function by'+str(request.user.username))
         json_data = {}
         cur=connection.cursor()  #create the database connection
         post = request.GET
         fname = post.get(config.fname)  #get table key 
         lname = post.get(config.lname)  #get table key 
         org_id = post.get(config.org_id)  #get table key 
         org_unit_id = post.get(config.org_unit_id)  #get table key
         org_div = post.get(config.org_div) #get table key 
         try:
                     query =  q.fetch_hcms_query(config.talent_acquisition, config.candidate_hired_report_list)
                     conditions = " tci.is_active=False and"
                     if fname != '':
                         conditions = conditions+" tci.first_name ilike '"'%'+str(fname)+'%'"' and"
                     if lname != '':
                         conditions = conditions+" tci.last_name ilike '"'%'+str(lname)+'%'"' and"
                     if org_unit_id != '':
                         conditions = conditions+" tjoi.org_unit_id = %s "%int(org_unit_id)
                         conditions = conditions+" and"
                     if org_div != '':
                         conditions = conditions+" tjoi.department_id = %s "%int(org_div)
                         conditions = conditions+" and"
                     conditions = conditions.rsplit(' ', 1)[0]
                     conditions =   conditions+ " and tjoi.org_id = %s"%int(org_id) 
                     if cur and query and conditions:
                         querys = (query+str(conditions+" order by tci.first_name,tci.last_name"))
                         cur.execute(querys)  
                         values = cur.fetchall()
                         if values:
                            json_data[config.datas] = values
                         else:
                             json_data[config.datas] = []
                     else:
                         json_data[config.datas] = []
                     logger_obj.info('Candidate Hired Report search response is'+str(json_data)+"attempted by"+str(request.user.username))   
         except Exception as e:
              logger_obj.error(e)
              json_data[config.datas] = []
         cur.close()
         return HttpResponse(json.dumps(json_data))
     
# job opening details
def hrmsTAJobOpeningDetails(request):
         ''' 
         01-Aug-2018 TRU To Job opening report Search data loaded.
         @param request: Request Object
         @type request : Object
         @return:   HttpResponse Interview Search Data
         @author: TRU
         '''
         logger_obj.info('Job opening Report search function by'+str(request.user.username))
         json_data = {}
         cur=connection.cursor()  #create the database connection
         post = request.GET
         try:   
                query = """
                        select id,job_title,number_of_positions,job_location,coalesce((select refitems_name from reference_items where id=job_opening_status_id),'') job_status,
                        to_char(target_date,'yyyy-mm-dd hh:mm:ss') as target_date,
                        to_char(date_opened,'yyyy-mm-dd hh:mm:ss') as start_date,
                        coalesce((select refitems_name from reference_items where id=job_type_id),'') job_type from ta_job_openings_info where is_active
                """
                log_query = """
                        select to_char(created_date+ interval '330' minute,'dd-mm-yyyy hh:mi:ss') as created_date,
                        to_char(modified_date+ interval '330' minute,'dd-mm-yyyy hh:mi:ss') as modified_date,
                        (case when (is_active is true ) then 'Active' else 'In Active' end) as status,
                        (select username from auth_user where id = created_by_id) as createdby_username,
                        to_char(created_date::timestamptz - interval '330' minute,'dd-mm-yyyy hh12:mi:ss') as created_datatime,
                        coalesce((select username from auth_user where id = modified_by_id),'') as modify_username,
                        job_title as title from ta_job_openings_info order by created_datatime desc
                """
                cur.execute(log_query)   
                log_details = q.dictfetchall(cur)  
                json_data['log_details'] = log_details
                cur.execute(query)   
                job_opeing_data = q.dictfetchall(cur)    
                json_data['job_opening'] = job_opeing_data
                cur.execute(query +" and job_type_id=631")   
                job_full_time_data = q.dictfetchall(cur)    
                json_data['job_full_time'] = job_full_time_data
                cur.execute(query +" and job_type_id=632")   
                job_part_time_data = q.dictfetchall(cur)    
                json_data['job_part_time'] = job_part_time_data
                cur.execute(query +" and job_type_id=634")   
                job_contractual_data = q.dictfetchall(cur)    
                json_data['job_contractual'] = job_contractual_data
                cur.execute(query +" and job_type_id=635")   
                job_freelance_data = q.dictfetchall(cur)    
                json_data['job_freelance'] = job_freelance_data
                cur.execute(query +" and job_type_id=636")   
                job_intership_data = q.dictfetchall(cur)    
                json_data['job_intership'] = job_intership_data
                cur.execute(query +" and job_opening_status_id=648")   
                job_inprocess_data = q.dictfetchall(cur)    
                json_data['job_inprocess'] = job_inprocess_data
                cur.execute(query +" and job_opening_status_id=651")   
                job_filled_data = q.dictfetchall(cur)    
                json_data['job_filled'] = job_filled_data
                cur.execute(query +" and job_opening_status_id=652")   
                job_canceled_data = q.dictfetchall(cur)    
                json_data['job_canceled'] = job_canceled_data
                cur.execute(query +" and job_opening_status_id=650")   
                job_onhold_data = q.dictfetchall(cur)    
                json_data['job_onhold'] = job_onhold_data
                logger_obj.info('Job opening Report search response is'+str(json_data)+"attempted by"+str(request.user.username))   
         except Exception as e:
              logger_obj.error(e)
              json_data[config.datas] = []
         cur.close()
         return HttpResponse(json.dumps(json_data))
    
# Job opening event details
def hrmsTAJobOpeningEventDetails(request):
         ''' 
         01-Aug-2018 TRU To Job opening event report Search data loaded.
         @param request: Request Object
         @type request : Object
         @return:   HttpResponse Interview Search Data
         @author: TRU
         '''
         logger_obj.info('Job opening Report search function by'+str(request.user.username))
         json_data = {}
         post = request.GET
         getid = post.get('getId')  #get id key 
         tab = post.get('tab')  #get tab key
         print "--------------getId-",getid,tab
         cur=connection.cursor()  #create the database connection
         try:
             query = """select id,job_title,number_of_positions,job_location,to_char(date_opened,'DD-MM-YYYY') as date_opened,
                to_char(target_date,'DD-MM-YYYY') as target_date,key_skills,salary,coalesce((select refitems_name from reference_items where id=job_opening_status_id),'') job_status,
                coalesce((select refitems_name from reference_items where id=job_type_id),'') job_type,
                coalesce((select refitems_name from reference_items where id=work_experience_id),'') job_exp,
                coalesce((select refitems_name from reference_items where id=shift_id),'') job_shift,
                (select name from organization_info where id=org_id) org_name from ta_job_openings_info"""
             if tab == 'tab2' : 
                cur.execute(query+" where is_active and id=%s"%int(getid))   
             elif tab == 'tab3' :
                cur.execute(query+" where is_active and job_type_id=631 and id=%s"%int(getid))
             elif tab == 'tab4' :
                cur.execute(query+" where is_active and job_type_id=632 and id=%s"%int(getid))
             elif tab == 'tab5' :
                cur.execute(query+" where is_active and job_type_id=634 and id=%s"%int(getid))
             elif tab == 'tab6' :
                cur.execute(query+" where is_active and job_type_id=635 and id=%s"%int(getid))
             elif tab == 'tab7' :
                cur.execute(query+" where is_active and job_type_id=636 and id=%s"%int(getid))
             elif tab == 'tab8' :
                cur.execute(query+" where is_active and job_opening_status_id=648 and id=%s"%int(getid))
             elif tab == 'tab9' :
                cur.execute(query+" where is_active and job_opening_status_id=651 and id=%s"%int(getid))
             elif tab == 'tab10' :
                cur.execute(query+" where is_active and job_opening_status_id=652 and id=%s"%int(getid))
             elif tab == 'tab11' :
                cur.execute(query+" where is_active and job_opening_status_id=650 and id=%s"%int(getid))
             job_data = q.dictfetchall(cur)    
             json_data['datas'] = job_data
             logger_obj.info('Job opening Report search response is'+str(json_data)+"attempted by"+str(request.user.username))   
         except Exception as e:
              logger_obj.error(e)
              json_data[config.datas] = []
         cur.close()
         return HttpResponse(json.dumps(json_data))

# Job interview details
def hrmsTAJobInterviewDetails(request):
         ''' 
         02-Aug-2018 TRU To Job opening report Search data loaded.
         @param request: Request Object
         @type request : Object
         @return:   HttpResponse Interview Search Data
         @author: TRU
         '''
         logger_obj.info('Job opening Report search function by'+str(request.user.username))
         json_data = {}
         cur=connection.cursor()  #create the database connection
         post = request.GET
         try:   
                query = """
                        select ti.id,tj.job_title,coalesce(first_name||' '||last_name) as name,'From-'||from_time||',To-'||to_time as time, 
                        (select refitems_name from reference_items where id = ti.interview_type_id) as type,
                        (select refitems_name from reference_items where id = ti.interview_status_id) status,
                        to_char(ti.interview_date,'yyyy-mm-dd hh:mm:ss') as interview_date,tc.id as candidate_id
                        from ta_job_openings_info tj inner join ta_candidate_info tc on tj.id = tc.job_opening_id 
                        inner join ta_interview_info ti on ti.candidate_name_id = tc.id where tc.is_active and tj.is_active and ti.is_active
                """
                log_query = """
                        select to_char(created_date+ interval '330' minute,'dd-mm-yyyy hh:mi:ss') as created_date,
                        to_char(modified_date+ interval '330' minute,'dd-mm-yyyy hh:mi:ss') as modified_date,
                        (case when (is_active is true ) then 'Active' else 'In Active' end) as status,
                        coalesce((select username from auth_user where id = created_by_id),'') as createdby_username,
                        coalesce((select username from auth_user where id = modified_by_id),'') as modify_username,
                        to_char(created_date::timestamptz - interval '330' minute,'dd-mm-yyyy hh12:mi:ss') as created_datatime,
                        coalesce((select coalesce(first_name||' '||last_name) from ta_candidate_info where id=candidate_name_id),'') as title 
                        from ta_interview_info order by created_datatime desc
                """
                interview = """
                        select tj.id,tj.job_title,to_char(ti.interview_date,'yyyy-mm-dd') as interview_date,count(tc.id) as count
                        from ta_job_openings_info tj inner join ta_candidate_info tc on tj.id = tc.job_opening_id 
                        inner join ta_interview_info ti on ti.candidate_name_id = tc.id where tc.is_active and tj.is_active and ti.is_active
                        group by tj.id,interview_date
                """
                cur.execute(log_query)   
                log_details = q.dictfetchall(cur)    
                json_data['log_details'] = log_details
                cur.execute(query)   
                interview_data = q.dictfetchall(cur)    
                json_data['interview'] = interview_data
                cur.execute(interview)   
                interview_calendar = q.dictfetchall(cur)    
                json_data['interview_calendar'] = interview_calendar
                cur.execute(query +" and ti.interview_type_id=661")   
                level1 = q.dictfetchall(cur)    
                json_data['level1'] = level1
                cur.execute(query +" and ti.interview_type_id=662")   
                level2 = q.dictfetchall(cur)    
                json_data['level2'] = level2
                cur.execute(query +" and ti.interview_type_id=663")   
                level3 = q.dictfetchall(cur)    
                json_data['level3'] = level3
                cur.execute(query +" and ti.interview_status_id=740")   
                level1clr = q.dictfetchall(cur)    
                json_data['level1clr'] = level1clr
                cur.execute(query +" and ti.interview_status_id=741")   
                level2clr = q.dictfetchall(cur)    
                json_data['level2clr'] = level2clr
                cur.execute(query +" and ti.interview_status_id=742")   
                level3clr = q.dictfetchall(cur)    
                json_data['level3clr'] = level3clr
                cur.execute(query +" and ti.interview_status_id=664")   
                postponed = q.dictfetchall(cur)    
                json_data['postponed'] = postponed
                cur.execute(query +" and ti.interview_status_id=667")   
                canceled = q.dictfetchall(cur)    
                json_data['canceled'] = canceled
                cur.execute(query +" and ti.interview_status_id=668")   
                onhold = q.dictfetchall(cur)    
                json_data['onhold'] = onhold
                logger_obj.info('Job opening Report search response is'+str(json_data)+"attempted by"+str(request.user.username))   
         except Exception as e:
              logger_obj.error(e)
              json_data[config.datas] = []
         cur.close()
         return HttpResponse(json.dumps(json_data))
    
# Job interview event details
def hrmsTAInterviewEventDetails(request):
         ''' 
         02-Aug-2018 TRU To Job opening event report Search data loaded.
         @param request: Request Object
         @type request : Object
         @return:   HttpResponse Interview Search Data
         @author: TRU
         '''
         logger_obj.info('Job opening Report search function by'+str(request.user.username))
         json_data = {}
         post = request.GET
         getid = post.get('getId')  #get id key 
         tab = post.get('tab')  #get tab key
         print "--------------getId-",getid,tab
         cur=connection.cursor()  #create the database connection
         try:
             query = """
                select ti.id,tj.job_title,coalesce(first_name||' '||last_name) as name, 
                (select refitems_name from reference_items where id = ti.interview_type_id) as type,
                (select refitems_name from reference_items where id = ti.interview_status_id) status,
                to_char(ti.interview_date,'DD-MM-YYYY') as interview_date,
                to_char(ti.from_time,'HH-MM-SS') as from_time,
                to_char(ti.to_time,'HH-MM-SS') as to_time,
                (select refitems_name from reference_items where id = ti.rating_id) as rating,ti.comments,
                coalesce(
                (select array_to_string(array
                (select coalesce(name||' '||last_name,'') as name from employee_info  where id
                in (select unnest(string_to_array(interviewer_ids, ','))::int  from ta_interview_info where id=ti.id) order by name), ', ')),'') as interviewer_name,
                ti.doc_name,ai.name as attach_name
                from ta_job_openings_info tj inner join ta_candidate_info tc on tj.id = tc.job_opening_id 
                inner join ta_interview_info ti on ti.candidate_name_id = tc.id
                left join attachment_info ai on ai.id = ti.attachment_id
                where tc.is_active and tj.is_active and ti.is_active
             """
             if tab == 'tab2' : 
                cur.execute(query+" and ti.id=%s"%int(getid))   
             elif tab == 'tab3' :
                cur.execute(query+" and ti.interview_type_id=661 and ti.id=%s"%int(getid))
             elif tab == 'tab4' :
                cur.execute(query+" and ti.interview_type_id=662 and ti.id=%s"%int(getid))
             elif tab == 'tab5' :
                cur.execute(query+" and ti.interview_type_id=663 and ti.id=%s"%int(getid))
             elif tab == 'tab6' :
                cur.execute(query+" and ti.interview_status_id=740 and ti.id=%s"%int(getid))
             elif tab == 'tab7' :
                cur.execute(query+" and ti.interview_status_id=741 and ti.id=%s"%int(getid))
             elif tab == 'tab8' :
                cur.execute(query+" and ti.interview_status_id=742 and ti.id=%s"%int(getid))
             elif tab == 'tab9' :
                cur.execute(query+" and ti.interview_status_id=664 and ti.id=%s"%int(getid))
             elif tab == 'tab10' :
                cur.execute(query+" and ti.interview_status_id=667 and ti.id=%s"%int(getid))
             elif tab == 'tab11' :
                cur.execute(query+" and ti.interview_status_id=668 and ti.id=%s"%int(getid))
             job_data = q.dictfetchall(cur)    
             json_data['datas'] = job_data
             logger_obj.info('Job opening Report search response is'+str(json_data)+"attempted by"+str(request.user.username))   
         except Exception as e:
              logger_obj.error(e)
              json_data[config.datas] = []
         cur.close()
         return HttpResponse(json.dumps(json_data))

#Calendar event details function here    
def hrmsTAInterviewCalendarEventDetails(request):
         ''' 
         16-Oct-2018 TRU To Interview Calendar event report Search data loaded.
         @param request: Request Object
         @type request : Object
         @return:   HttpResponse Interview Search Data
         @author: TRU
         '''
         logger_obj.info('Interview Calendar Report search function by'+str(request.user.username))
         json_data = {}
         post = request.GET
         getid = post.get('getId')  #get id key 
         date = post.get('date')  #get tab key
         cur=connection.cursor()  #create the database connection
         try:
                query = """
                select ti.id,tj.job_title,coalesce(first_name||' '||last_name) as name, 
                (select refitems_name from reference_items where id = ti.interview_type_id) as type,
                (select refitems_name from reference_items where id = ti.interview_status_id) status,
                to_char(ti.interview_date,'DD-MM-YYYY') as interview_date,
                to_char(ti.from_time,'HH-MM-SS') as from_time,
                to_char(ti.to_time,'HH-MM-SS') as to_time,
                (select refitems_name from reference_items where id = ti.rating_id) as rating,ti.comments,
                coalesce(
                (select array_to_string(array
                (select coalesce(name||' '||last_name,'') as name from employee_info  where id
                in (select unnest(string_to_array(interviewer_ids, ','))::int  from ta_interview_info where id=ti.id) order by name), ', ')),'') as interviewer_name,
                ti.doc_name,ai.name as attach_name
                from ta_job_openings_info tj inner join ta_candidate_info tc on tj.id = tc.job_opening_id 
                inner join ta_interview_info ti on ti.candidate_name_id = tc.id
                left join attachment_info ai on ai.id = ti.attachment_id
                where tc.is_active and tj.is_active and ti.is_active and tj.id=%s and ti.interview_date in (%s)
                """
                cur.execute(query,(int(getid),str(date),))
                job_data = q.dictfetchall(cur)    
                json_data['datas'] = job_data
                logger_obj.info('Job opening Report search response is'+str(json_data)+"attempted by"+str(request.user.username))   
         except Exception as e:
              logger_obj.error(e)
              json_data[config.datas] = []
         cur.close()
         return HttpResponse(json.dumps(json_data))
     
#Fetch job title from candidate 
@csrf_exempt
def TAJobTitleforCandidate(request):
    ''' 
    17-AUG-2018 SYA Fetch Job Title from Candidate
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: SYA
    '''
    json_data ={}
    try:        
        logger_obj.info('Fetch Candidate Job Title by'+str(request.user.username))
        post = request.POST            
        candidate_id = request.POST.get(config.candidate_id)
        cur = connection.cursor()
        query = q.fetch_hcms_query(config.talent_acquisition, config.ta_fetch_candidate_job_opening)
        cur.execute(query,(candidate_id,))
        res = q.dictfetchall(cur)
        json_data[config.job_opening] = res
    except Exception as e:
        logger_obj.error(e)
        json_data[config.job_opening] = []
    return HttpResponse(json.dumps(json_data))