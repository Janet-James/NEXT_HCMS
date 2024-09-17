# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.shortcuts import render

import json
from django.views.decorators.csrf import csrf_exempt
from django.http.response import HttpResponse
from CommonLib import query
from django.db import connection
from CommonLib import query as q
from CommonLib import lib
from Talent_Acquisition.talent_acquisition.models import JobOpeningsInfo
#template render html
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from CommonLib.hcms_common import refitem_fetch,refitemlink_fetch
from CommonLib.hcms_common import record_validation
from CommonLib.hcms_common import menu_access_control
from django_countries import countries
from django.views.decorators.csrf import csrf_exempt

import config1 as config
import logging
import logging.handlers
import datetime
from random import randint
logger_obj = logging.getLogger('logit')

# Job openings  views here
class TAJobOpenings(TemplateView): 
    ''' 
    04-JULY-2018 PAR To Talent Acquisitions Job Openings page loaded. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: PAR
    '''
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(TAJobOpenings, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Job Openings', self.request.user.id)
        if macl:
             template_name = "talent_acquisition/job_openings.html"
        else:
            template_name = "tags/access_denied.html"   
        return [template_name]    
        
   
    def get(self, request, *args, **kwargs):
         context = super(TAJobOpenings, self).get_context_data(**kwargs)
         cur = connection.cursor()  #create the database connection
         cur.execute("select id,name from ta_tools_tech_info where is_active order by name");
         job_boards = q.dictfetchall(cur)
         cur.execute("""select htrd.id as id,htrd.role_title as name from hcms_wp_system_resource_request hwsrr
         left join hcms_ti_role_details htrd on htrd.id =  hwsrr.resource_request_role_id where htrd.is_active""");
         job_approve = q.dictfetchall(cur)
         query = "select id,refitems_name as name,refitems_desc as image from reference_items where is_active and refitems_category_id=137 order by name"
         cur.execute(query)
         job_category = q.dictfetchall(cur)
         cur.execute("""
            select ri.id as id,ri.refitems_name as name from reference_items ri 
            left join reference_items_link ril on 
            ri.id=ril.from_refitems_category_id where ri.refitems_category_id in (140,141,142,143,144,145,146,147)
            and ri.is_active order by name
         """);
         job_skills = q.dictfetchall(cur)
         context['job_category'] = job_category
         context['job_approve'] = job_approve
         context['job_boards'] = job_boards
         context['job_skills'] = job_skills
         return self.render_to_response(context)

#Job openings posting to Linked In views here
class TALinkedPosting(TemplateView): 
    ''' 
    16-Jan-2019 TRU To Talent Acquisitions Job Openings Posting to LikedIn page loaded. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: TRU
    '''
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(TALinkedPosting, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Linked In', self.request.user.id)
        if macl:
             template_name = "linked_in/linked_in.html"
        else:
            template_name = "tags/access_denied.html"   
        return [template_name]    
   
    def get(self, request, *args, **kwargs):
         context = super(TALinkedPosting, self).get_context_data(**kwargs)
         return self.render_to_response(context)
     
#job opening drop down
@csrf_exempt
def TAJobOpeningsDropdown(request):
    ''' 
    04-JULY-2018 PAR To Talent Acquisitions Dropdown. And also check the user authentication
    @param request: Request Object 
    @type request : Object
    @return:   HttpResponse or Redirect the another URL 
    @author: PAR
    '''   
    values={}
    post = request.POST
    cur=lib.db_connection()
    try:
        logger_obj.info(' TA Job Openings Dropdown function by'+str(request.user.username))
        if post:
            type=post.get("type")
        if not type:
            fields=post.get("fields")
            table=post.get("table_name")
            if table and fields:
                if table =="ta_candidate_info":
                    candidate_status=post.get("candidate_status")
                    query="select  {0} from {1} c inner join ta_interview_info ii on ii.candidate_name_id=c.id inner join   reference_items r on ii.interview_status_id=r.id where r.id={2} and c.is_active  and ii.is_active and r.is_active order by c.id"
                    query=query.format(fields,table,candidate_status)
                else:
                    if post.get("table_name") == 'organization_unit_info':
                        query="select {0} from {1} where is_active and parent_orgunit_id != 0 and organization_id = %s"%int(post.get("org_id"))
                        query+=" order by orgunit_name "  
                    elif post.get("table_name") == 'team_details_info':
                        query="select {0} from {1} where is_active and org_id = %s"%int(post.get("org_id"))
                        query+=" order by name "  
                    else:
                        query="select {0} from {1} where is_active order by id " 
                    query=query.format(fields,table)
                cur.execute(query) 
                res=lib.dictfetchall(cur) 
                values['vals']=res  
        elif type=="join":
            fields=post.get("fields")
            if str("employee_info.work_mobile") in fields: 
                fields="employee_info.id, coalesce(employee_info.name,'')||' '||coalesce(employee_info.last_name,'')||' ('|| coalesce(employee_info.work_mobile,'')||')' as name"
            query="select  {0} from employee_info left join hcms_role on hcms_role.id=employee_info.role_id_id where employee_info.is_active and org_id_id = %s"%int(post.get("org_id"))
            query+=" order by name "  
            query=query.format(fields)
            cur.execute(query)
            res=lib.dictfetchall(cur)
            values['vals']=res
        elif type=="reference":
            code=post.get("code")
            query="select ri.id, refitems_name from reference_items  ri inner join reference_item_category rc on ri.refitems_category_id=rc.id where refitem_category_code='{0}' and ri.is_active order by ri.refitems_name"
            query=query.format(code)
            cur.execute(query)
            res=lib.dictfetchall(cur)
            values['vals']=res
                
        logger_obj.info('TAJobOpeningsDropdown function response is'+str(values)+"attempted by"+str(request.user.username)) 
    except Exception as e:
        print e
        logger_obj.error(e)
        values['error']=e
    return HttpResponse(json.dumps(values))
 
#job opening operations
@csrf_exempt
def TAJobOpeningsCrud(request):
    ''' 
    05-JULY-2018 PAR To Job opening  CRUD operaitons
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse 
    @author: PAR
    '''
    #try:
    logger_obj.info('Job opening  CRUD function by'+str(request.user.username))
    json_data = {}
    post = request.POST
    cur=lib.db_connection()
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
                doc_name = str(str(input_data.get("doc_name")).strip())+'_JON'+str(randint(10000, 99999))
                if input_data.get("attachment_id") == 0:
                   att_id = None 
                else:
                   att_id = int(input_data.get("attachment_id"))
                if int(input_data.get("job_resource_config")) == 0:
                   job_resource_config = None 
                else:
                   job_resource_config = int(input_data.get("job_resource_config"))
                if int(input_data.get("job_status")) == 0:
                    job_status_id = None
                else:
                    job_status_id = int(input_data.get("job_status"))
                if not update_id  :
                       if job_resource_config:
                           already_exit_status = JobOpeningsInfo.objects.filter(job_resource_config_id = job_resource_config,is_active = True).values('id','job_resource_config_id');
                       else:
                           already_exit_status = JobOpeningsInfo.objects.filter(job_title=str(input_data.get("job_title")),is_active = True).values('id','job_resource_config_id');
                       print "--------------------",already_exit_status
                       if already_exit_status: 
                            json_data[config.results] = config.alreadyExit
                       else: 
                            status = JobOpeningsInfo(doc_name = doc_name,job_resource_config_id = job_resource_config,job_title=str(input_data.get("job_title")),contact_no_id=int(input_data.get("contact_number")),
                                     recruiter_id=int(input_data.get("recruiter")),key_skills=str(input_data.get("key_skills")),assigned_recruiter_id=int(input_data.get("assigned_recruiter")),target_date=input_data.get("target_date"),
                                     job_opening_status_id=job_status_id,org_id=int(input_data.get("organization")),org_unit_id=int(input_data.get("organization_unit")),
                                     department_id=int(input_data.get("department")),salary=str(input_data.get("salary")),date_opened=input_data.get("date_opened"),
                                     job_type_id=int(input_data.get("job_type")),work_experience_id=int(input_data.get("work_experience")),number_of_positions=int(input_data.get("no_positions")),
                                     job_description=str(input_data.get("job_description")),job_short_description=str(input_data.get("job_short_description")),attachment_id=att_id,
                                     shift_id=int(input_data.get("shifts")),job_location=str(input_data.get("job_location")),logo_type_id=str(input_data.get("logo_type_id")),job_cat_id=int(input_data.get("job_cat_id")),is_active=True,created_by_id=int(uid))
                            status.save()
                            json_data[config.results] = config.add_success
                else: 
                       doc_names = str(input_data.get("doc_name")).strip();
                       results = JobOpeningsInfo.objects.filter(id = update_id,doc_name = str(doc_names)).values('doc_name');
                       if results:
                           doc_name = str(input_data.get("doc_name"))
                       status= JobOpeningsInfo.objects.filter(id=update_id).update(doc_name = doc_name,job_resource_config_id = job_resource_config,job_title=str(input_data.get("job_title")),contact_no_id=int(input_data.get("contact_number")),
                                recruiter_id=int(input_data.get("recruiter")),key_skills=str(input_data.get("key_skills")),assigned_recruiter_id=int(input_data.get("assigned_recruiter")),target_date=input_data.get("target_date"),
                                job_opening_status_id=job_status_id,org_id=int(input_data.get("organization")),org_unit_id=int(input_data.get("organization_unit")),
                                department_id=int(input_data.get("department")),salary=str(input_data.get("salary")),date_opened=input_data.get("date_opened"),
                                job_type_id=int(input_data.get("job_type")),work_experience_id=int(input_data.get("work_experience")),number_of_positions=int(input_data.get("no_positions")),
                                job_description=str(input_data.get("job_description")),job_short_description=str(input_data.get("job_short_description")),attachment_id=att_id,
                                shift_id=int(input_data.get("shifts")),job_location=str(input_data.get("job_location")),logo_type_id=str(input_data.get("logo_type_id")),job_cat_id=int(input_data.get("job_cat_id")),is_active=True,modified_by_id=int(uid))
                       json_data[config.results] = config.update_success
        elif delete_id:
                status =  JobOpeningsInfo.objects.filter(id=delete_id).update(is_active="False",modified_by_id=int(uid))
                json_data[config.results] = config.delete_success
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
                print e
                logger_obj.error(e)
                json_data[config.results] =[]
    return HttpResponse(json.dumps(json_data))

#job opening data
@csrf_exempt
def TAJobOpeningsData(request): #to show all company related informations in a table
    ''' 
    05-JULY-2018 PAR To Job opening  data for table
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse 
    @author: PAR
    '''
    try:
        logger_obj.info('Talent Acquisition  table function by'+str(request.user.username))
        if request.method=='GET' or request.method=='POST':
            post=request.POST
            type=post.get("type")
            cur=lib.db_connection()#to_char(hr_leave.created_date, 'MM-DD-YYYY HH24:MI:SS') AS raised_date,
            
            user_id = request.user.id
            dic = {}
            json_datas = {}          
            if type=="all":  
                if user_id:
                    job_openings_table=query.fetch_hcms_query(config.talent_acquisition,config.job_openings_table_query)
                    if job_openings_table:
                        cur.execute(job_openings_table) 
                        values=cur.fetchall()
                        keys =config.job_openings_table_key
                        dic = list(dict(zip(keys,j)) for j in values) 
                commit =lib.db_commit(cur) 
                close = lib.db_close(cur)
                json_datas['datas'] = values
                json_datas = json_datas#response data function call
            elif type=="row":
                 table_id=post.get("table_id")
                 if user_id:
                    job_openings_table_row=query.fetch_hcms_query(config.talent_acquisition,config.job_openings_table_query_row)
                    if job_openings_table_row:
                        cur.execute(job_openings_table_row%(table_id,))
                        values=q.dictfetchall(cur)
                 close = lib.db_close(cur)
                 json_datas['datas'] = values
            elif type=="filter":
                 filter_name=post.get("filter_name")
                 if filter_name:
                    job_openings_table_row=query.fetch_hcms_query(config.talent_acquisition,config.job_openings_table_query)
                    if job_openings_table_row:
                        cur.execute(job_openings_table_row+" and jo.job_title ilike '%"+str(filter_name)+"%' order by jo.job_title")
                        values=cur.fetchall()
                 close = lib.db_close(cur)
                 json_datas['datas'] = values
            logger_obj.info('Talent Acquisition  table response is'+str(json_datas)+"attempted by"+str(request.user.username))                 
    except Exception as e:
       logger_obj.error(e) 
       json_datas['datas'] = []
    return HttpResponse(json.dumps(json_datas))

#Job update Status 
@csrf_exempt
def TAJobOpeningsUpdate(request):
    ''' 
    12-JULY-2018 TRU To Job opening  CRUD operaitons
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse 
    @author: TRU
    '''
    logger_obj.info('Job opening Update function by'+str(request.user.username))
    json_data = {}
    post = request.POST
    try:
        update_id = request.POST.get("update_id")
        job_publish_data = request.POST.get("job_publish_data")
        print "-----------update_id-------------------",update_id,job_publish_data
        status= JobOpeningsInfo.objects.filter(id = update_id).update(job_publish = str(job_publish_data))
        json_data[config.results] = config.update_success
    except Exception as e:
        logger_obj.error(e)
        json_data[config.results] =[]
    return HttpResponse(json.dumps(json_data))

#Job approve details fetch
@csrf_exempt
def TAJobApproveDetails(request):
    ''' 
    13-JULY-2018 Tru To Talent Acquisitions Dropdown. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL 
    @author: Tru
    '''   
    logger_obj.info('Job Approve details Update function by'+str(request.user.username))
    json_data = {}
    post = request.POST
    cur=lib.db_connection()
    try:
        job_approve_id = request.POST.get("job_approve_id")
        print "----------job_approve_id--------",job_approve_id
        cur.execute("select id,resource_request_request_reason as desc,resource_request_count as count from hcms_wp_system_resource_request where is_active and id=%s",(int(job_approve_id),))
        job_openings_request_approve_details = q.dictfetchall(cur)
        json_data[config.results] = job_openings_request_approve_details
    except Exception as e:
        logger_obj.error(e)
        json_data[config.results] =[]
    return HttpResponse(json.dumps(json_data))

#Job category based skilldetails fetch
@csrf_exempt
def TAJobCategorySkill(request):
    ''' 
    12-Feb-2018 Tru To Talent Acquisitions Skill Details Dropdown. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL 
    @author: Tru
    '''   
    logger_obj.info('Skill Details by'+str(request.user.username))
    json_data = {}
    cur=lib.db_connection()
    try:
        job_category_id = request.GET.get("job_category_id")
        print "----------job_category_id--------",job_category_id
        cur.execute("""
            select ri.id as id,ri.refitems_name as name from reference_items ri 
            left join reference_items_link ril on 
            ri.id=ril.to_refitems_category_id where ril.from_refitems_category_id = %s
            and ri.is_active order by name
        """,(int(job_category_id),))
        job_category_id_details = q.dictfetchall(cur)
        json_data[config.results] = job_category_id_details
    except Exception as e:
        logger_obj.error(e)
        json_data[config.results] =[]
    return HttpResponse(json.dumps(json_data))

#Job un published details function here
@csrf_exempt
def TAJobOpeningsUnPublished(request):
    ''' 
    03-Mar-2019 Tru To Talent Acquisitions Un Published. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL 
    @author: Tru
    '''   
    logger_obj.info('Job Un-Published function by'+str(request.user.username))
    json_data = {}
    cur=lib.db_connection()
    try:
        job_id = request.POST.get("job_id")
        job_status = request.POST.get("job_status")
        print "----------job_id--------",job_id
        cur.execute("update ta_job_openings_info set job_publish = %s where is_active and id=%s",(str(job_status),int(job_id),))
        json_data['data'] = 'NTE-03'
    except Exception as e:
        print "---------",e
        logger_obj.error(e)
        json_data['data'] = 'NTE-04'
        json_data[config.results] =[]
    return HttpResponse(json.dumps(json_data))