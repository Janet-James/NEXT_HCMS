# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.shortcuts import render

import json
from django.views.decorators.csrf import csrf_exempt
from django.http.response import HttpResponse
from django.db import connection
from CommonLib import query as q
import config
#template render html
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from CommonLib.hcms_common import menu_access_control
import datetime
import re
import logging
import logging.handlers
import datetime
import requests
from job_posting_template import *
logger_obj = logging.getLogger('logit')

# Job Posting here
class TAJobPostingRequest(TemplateView): 
    ''' 
    02-Mar-2019 TRU To Job Posting page loaded. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: TRU
    '''
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(TAJobPostingRequest, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Job Posting Request', self.request.user.id)
        if macl:
             template_name = "talent_acquisition/job_posting_request.html"
        else:
            template_name = "tags/access_denied.html"
        return [template_name]    
        
   
    def get(self, request, *args, **kwargs):
         context = super(TAJobPostingRequest, self).get_context_data(**kwargs)
         cur = connection.cursor()    
         cur.execute('''select id,job_title as name from ta_job_openings_info  where is_active and id not in (select job_id from ta_job_posting  where status !='1' )
order by name''')
         job_details = q.dictfetchall(cur)
         context['jobs'] = job_details
         context['templates'] = template_list 
         return self.render_to_response(context)
     
#dynamic data function here
@csrf_exempt
def dynamic_date_get(request):
    ''' 
    02-Mar-2019 TRU To Job Posting page  function
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: TRU
    '''
    json_data ={}
    try:
        logger_obj.info('Job Posting function by'+str(request.user.username)) 
        status = request.GET.get('status')
        id = request.GET.get('id')
        cur = connection.cursor()
        if status == 'job':
            query = '''select id,job_title,to_char(target_date,'dd-mm-yyyy') as target_date,to_char(date_opened,'dd-mm-yyy') as date_opened,
            job_short_description,number_of_positions,job_location 
            from ta_job_openings_info where id={}'''.format(int(id))
            cur.execute(query)
            job_details = q.dictfetchall(cur)
            json_data['data'] = job_details
        elif status == 'template':
            job_id = request.GET.get('job_id')
            jsd = request.GET.get('jsd')
            nop = request.GET.get('nop')
            job_name = request.GET.get('job_name')
            job_location = request.GET.get('job_location')
            query = '''select id,job_title,to_char(target_date,'dd-mm-yyy') as target_date,to_char(date_opened,'dd-mm-yyy') as date_opened,
            job_short_description,number_of_positions,job_location 
            from ta_job_openings_info where id={}'''.format(int(job_id))
            cur.execute(query)
            job_details = q.dictfetchall(cur)
            print "==============job_details==",job_details
            if int(id) == 1:
                template = template1(str(job_name),str(job_details[0]['target_date']),str(jsd),str(job_location))
            elif int(id) == 2:
                template = template1(str(job_name),str(job_details[0]['target_date']),str(jsd),str(job_location))
            elif int(id) == 3:
                template = template1(str(job_name),str(job_details[0]['target_date']),str(jsd),str(job_location))
            else:
                template = template1(str(job_name),str(job_details[0]['target_date']),str(jsd),str(job_location))
            json_data['data'] = [{'template_name':template}]
    except Exception as e:
        print e
        logger_obj.error(e)
        json_data[config.results] = []
    return HttpResponse(json.dumps(json_data))


#dynamic data function here
@csrf_exempt
def job_post_operation(request):
    ''' 
    02-Mar-2019 TRU To Job Posting page  function
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: TRU
    '''
    json_data ={}
    try:
            logger_obj.info('Job Posting function by'+str(request.user.username)) 
            cur = connection.cursor()
            id = request.POST.get('id')
            job_id = request.POST.get('job_id')
            jsd = request.POST.get('jsd')
            nop = request.POST.get('nop')
            job_name = request.POST.get('job_name')
            job_location = request.POST.get('job_location')
            query = '''select id,job_title,to_char(target_date,'dd-mm-yyy') as target_date,to_char(date_opened,'dd-mm-yyy') as date_opened,
            job_short_description,number_of_positions,job_location 
            from ta_job_openings_info where id={}'''.format(int(job_id))
            cur.execute(query)
            job_details = q.dictfetchall(cur)
            print "==============job_details==",job_details
            if job_details:
                cur.execute("select * from ta_job_posting where job_id=%s and other='true'",(int(job_id),))
                job_post_details = q.dictfetchall(cur)
                print "==========job_post_details==",job_post_details
                if job_post_details:
                    print "-------Update-----"
                    cur.execute('''
                    Update ta_job_posting set
                    name=%s, nop=%s, jsd=%s, location=%s, template_id=%s, pdf=%s, img=%s, 
                    status='1' where job_id=%s and status='1'
                    ''',(str(job_name),str(nop),str(jsd),str(job_location),str(id),str(id),str(id),int(job_id),))
                    json_data['data'] = 'NTE-02'
                else:
                    print "-------------Insert-----------"
                    cur.execute('''
                    INSERT INTO ta_job_posting(
                    name, nop, jsd, location, job_id, template_id, pdf, img, 
                    status,other)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, 
                    '1','true');
                ''',(str(job_name),str(nop),str(jsd),str(job_location),int(job_id),str(id),str(id),str(id),))
                    json_data['data'] = 'NTE-01'
    except Exception as e:
        print e
        logger_obj.error(e)
        json_data['data'] = 'NTE-05'
    return HttpResponse(json.dumps(json_data))

#Job posting details function here
@csrf_exempt
def ta_job_post_details(request):
    ''' 
    03-Mar-2019 Tru To Talent Acquisitions posting details. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL 
    @author: Tru
    '''   
    logger_obj.info('Job Un-Published function by'+str(request.user.username))
    json_data = {}
    cur = connection.cursor()
    try:
        job_id = request.GET.get('job_id')
        name = request.GET.get('name')
        print "----",job_id,name
        if job_id is None and name is None :
            query = "select * from ta_job_posting where other='true' order by name"
        elif job_id is None and name:
            query = "select * from ta_job_posting where other='true' and name ilike '%{0}%'".format(str(name))
        else:
            query = "select * from ta_job_posting where other='true' and status='1' and id={0}".format(int(job_id))
        print "----query---",query
        cur.execute(query)
        job_post_details = q.dictfetchall(cur)
        print "------------------------job_post_details-------",job_post_details
        json_data['data'] = job_post_details
        json_data['job_id'] = job_id
    except Exception as e:
        logger_obj.error(e)
        json_data['data'] = 'NTE-04'
        json_data[config.results] =[]
    return HttpResponse(json.dumps(json_data))



#Job posting image details function here
@csrf_exempt
def ta_jp_post_img_details(request):
    ''' 
    08-Mar-2019 Tru To Talent Acquisitions posting details. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL 
    @author: Tru
    '''   
    logger_obj.info('Job Un-Published function by'+str(request.user.username))
    json_data = {}
    cur = connection.cursor()
    try:
        job_id = request.GET.get('job_id')
        query = "select * from ta_job_posting where id={0}".format(int(job_id))
        print "----approved query---",query
        cur.execute(query)
        job_post_details = q.dictfetchall(cur)
        json_data['data'] = job_post_details
    except Exception as e:
        logger_obj.error(e)
        json_data['data'] = 'NTE-04'
        json_data[config.results] =[]
    return HttpResponse(json.dumps(json_data))

#Job posting un published details function here
@csrf_exempt
def ta_jp_remove_post_details(request):
    ''' 
    08-Mar-2019 Tru To Talent Acquisitions posting details. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL 
    @author: Tru
    '''   
    logger_obj.info('Job Un-Published function by'+str(request.user.username))
    json_data = {}
    cur = connection.cursor()
    try:
        id = request.POST.get('id')
        query = "update ta_job_posting set status='1' where id={0}".format(int(id))
        cur.execute(query)
        json_data['data'] = 'NTE-01'
    except Exception as e:
        print e
        logger_obj.error(e)
        json_data['data'] = 'NTE-04'
        json_data[config.results] =[]
    return HttpResponse(json.dumps(json_data))