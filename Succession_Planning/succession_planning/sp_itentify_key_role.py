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
from Succession_Planning.succession_planning.models import SP_KeyRoles as KR
from django_countries import countries
import logging
import logging.handlers
import datetime
from random import randint
logger_obj = logging.getLogger('logit')
  
# Role Add Operations here
def spKeyRoleCRUD(request): 
    ''' 
    21-September-2018 TRU Key & Role CRUD Operations
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: TRU
    '''
    try:
        logger_obj.info('Role CRUD Operations by'+str(request.user.username))
        json_data = {}
        org_id = request.POST.get('org_id')
        org_unit_id = request.POST.get('org_unit_id')
        emp_id = request.POST.get('org_emp_id')
        result_id = request.POST.get('result_id')
        uid=request.user.id     
        if not uid:
            uid = 1
        if result_id is None :
            roles = request.POST.get('role_id')
            role_ids = roles.split(",")
            for id in role_ids:
                status_exists = KR.objects.filter(emp_id=int(emp_id),key_role_id=int(id)).count()
                if status_exists == 0:
                    status = KR(emp_id=int(emp_id),key_role_id=int(id),org_id=int(org_id),org_unit_id=int(org_unit_id),created_by_id=int(uid),is_active="True")
                    status.save()
                    json_data[config.status_id] = status.id
                    json_data[config.status_key] = config.success_status
                else:
                    json_data[config.status_id] = 'NTE05'
        elif result_id == 'result':
            stage_id = request.POST.get('stage_id')
            avg = request.POST.get('avg')
            ques_answer = request.POST.get('ques_answer')
            status = KR.objects.filter(emp_id=int(emp_id),key_role_id=int(stage_id)).update(status=True,avg=int(avg),ques_answer=str(ques_answer),is_active="True",modified_by_id=int(uid))
            json_data[config.status_id] = 'NTE04'
        logger_obj.info('Role Add'+str(json_data)+"attempted by"+str(request.user.username))         
    except Exception as e:
            logger_obj.error(e)
            json_data[config.status_key] = e
    return HttpResponse(json.dumps(json_data))

# Role Details GEt
def roleDetailsGet(request):
    ''' 
    21-September-2018 TRU  Key & Role Details CRUD Operations
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: TRU
    '''
    try:
        logger_obj.info(' Key & Role Details by'+str(request.user.username))
        json_data = {}
        emp_id = request.POST.get('emp_id')
        if emp_id != '0':
            print "------------Emp ID--------------",emp_id
            query = """
                    select * from
                    (select array_to_json(array_agg(a)) as role_stage from 
                    (
                    select skrd.id,skrd.emp_id,skrd.key_role_id as role_id,rd.role_title as role_title from sp_key_roles_details  skrd
                    inner join hcms_ti_role_details rd on rd.id = skrd.key_role_id where skrd.status = False and emp_id = %s
                    order by role_title
                    )a)aa,
                    (select array_to_json(array_agg(b)) as role_question from 
                    (
                    select id,refitems_name as name from reference_items where refitems_category_id = 122
                    )b)bb,
                    (select array_to_json(array_agg(c)) as emp_details from 
                    (
                    select coalesce(ei.name||' '||ei.last_name) as name,coalesce(ei.work_email,'') as email,coalesce(ei.work_mobile,'') as mobile,
                    coalesce(ai.name,'no_data.png') as image,
                    coalesce((select role_title from hcms_ti_role_details  where id=ei.role_id_id),'') as role,
                    coalesce(to_char(date_of_joining,'DD-MM-YYYY'),'') as doj,
                    coalesce((select name from organization_info where id=ei.org_id_id),'') as org,
                    coalesce((select orgunit_name from organization_unit_info where id=ei.org_unit_id_id),'') as org_unit,
                    coalesce((select name from team_details_info where id=ei.team_name_id),'') as team,
                    coalesce((select country_name from country_info where id=ei.country_id),'') as county
                    from employee_info  ei
                    left join attachment_info ai on ai.id = image_id_id
                    where ei.id = %s
                    )c)cc
            """
            cur = connection.cursor()  # create the database connection
            cur.execute(query,(int(emp_id),int(emp_id),))  
        else:
            print "----------Chart Data-----------",emp_id
            query = """
                    SELECT 
                    trd.role_title,
                    key_role_id, 
                    array_to_json(array_agg(coalesce(avg,0))) AS avg,coalesce(round((sum(avg)::float/count(*))/10),0) as tot_avg
                    ,array_to_json(array_agg(coalesce((ei.name||' '||ei.last_name),''))) AS emp_name
                    FROM sp_key_roles_details rd
                    inner join employee_info ei on ei.id = rd.emp_id
                    inner join hcms_ti_role_details trd on trd.id = rd.key_role_id
                    GROUP BY key_role_id,trd.role_title order by tot_avg desc limit 6
             """
            cur = connection.cursor()  # create the database connection
            cur.execute(query) 
        job_data = q.dictfetchall(cur)    
        json_data['datas'] = job_data
        print "----------",json_data
        logger_obj.info('Role Add'+str(json_data)+"attempted by"+str(request.user.username))         
    except Exception as e:
        logger_obj.error(e)
        json_data[config.status_key] = e
    return HttpResponse(json.dumps(json_data))