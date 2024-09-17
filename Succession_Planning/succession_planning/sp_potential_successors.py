from __future__ import unicode_literals
from django.shortcuts import render

import json
from django.views.decorators.csrf import csrf_exempt
from django.http.response import HttpResponse
from CommonLib import query
from django.db import connection
import config
from HRMS_Foundation.attendance_management.models import AttandanceInfo as AI
from CommonLib import query as q
from CommonLib.hcms_common import menu_access_control
from datetime import datetime
#template render html
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
import logging
import logging.handlers
logger_obj = logging.getLogger('logit')

     
#Potential Successors List Search function here
def PotentialSuccessorsEmployeeList(request):
    ''' 
    18-Sep-2018 TRU To Potential Successors  page data loaded.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: TRU 
    '''
    json_data = {}
    try:
            logger_obj.info('Potential Successors  listing function by'+str(request.user.username))
            cur = connection.cursor()  #create the database connection
            post = request.GET
            company_id = post.get('id')  #get table key 
            unit_id = post.get('unit_id')  #get table key 
            emp_name = post.get('emp_name')  #get table key 
            role_status = post.get('role_status')  #get table key 
            successor_query = """
                                select id from employee_info where reporting_officer_id in 
                                (
                                select ei.id from
                                (select 
                                trd.role_title,
                                key_role_id, 
                                array_to_json(array_agg(coalesce(avg,0))) AS avg,coalesce(round((sum(avg)::float/count(*))/10),0) as tot_avg
                                ,array_to_json(array_agg(coalesce((ei.name||' '||ei.last_name),''))) AS emp_name,0 as parentId
                                FROM sp_key_roles_details rd
                                inner join employee_info ei on ei.id = rd.emp_id
                                inner join hcms_ti_role_details trd on trd.id = rd.key_role_id
                                GROUP BY key_role_id,trd.role_title order by tot_avg desc limit 5) roles
                                inner join employee_info ei on ei.role_id_id = roles.key_role_id
                                )
            """
            cur.execute(successor_query);
            successor_values = q.dictfetchall(cur)
            if successor_values:
                successor_query1 = """
                 select id from employee_info where reporting_officer_id in 
                 ("""+successor_query+""")"""
                cur.execute(successor_query1);
                successor_values += q.dictfetchall(cur)
            emp_id = list(int(id['id']) for id in successor_values)
            query =  """
                        (select ei.id as rk_id,ei.id,(coalesce(ri.refitems_name,'')||''||coalesce(TRIM(ei.name),'')||' '||coalesce(ei.last_name,'')) as name ,coalesce(ei.work_email,'') as email,
                        coalesce(ei.work_phone,'') as phone,coalesce(ai.name,'no_data.png') as profile ,coalesce(hrd.name,'') as role,0 as tot_avg,ei.org_id_id,ei.role_id_id  
                        from employee_info ei left join attachment_info ai on ai.id = ei.image_id_id
                        left join hcms_role hrd on hrd.id = ei.role_id_id
                        left join reference_items ri on ri.id = ei.title_id
                        inner join sp_key_roles_details rd on rd.emp_id = ei.id
                        inner join hcms_ti_role_details trd on trd.id = rd.key_role_id
                        where ei.is_active 
                """  
            if emp_id:
                #query = query+' and ei.id in {0}'.format(tuple(emp_id))
                query = query+' and ei.id in (26)'
            querys = """
                    select * from
                    (select a.emp_id as rk_id,a.emp_id as id,
                    (select coalesce(ri.refitems_name,'')||''||coalesce(TRIM(name),'')||' '||coalesce(last_name,'') from employee_info ei 
                    left join reference_items ri on ri.id = ei.title_id
                    where ei.id = a.emp_id) as name,
                    (select coalesce(work_email,'') from employee_info where id = a.emp_id) as email,
                    (select coalesce(work_phone,'') from employee_info where id = a.emp_id) as phone,
                    (select coalesce((ai.name),'no_data.png') from employee_info ei inner join attachment_info ai on ei.image_id_id = ai.id where ei.id = a.emp_id ) as profile,
                    '' as role,a.tot_avg,
                    (select org_id_id from employee_info where id = a.emp_id) as org_id_id,
                    (select role_id_id from employee_info where id = a.emp_id) as role_id_id
                    from (
                    select ((sum(a.sum)::decimal/(sum(a.question)*6))*100)::int tot_avg,a.emp_id from
                    (select id,coalesce((select count(t) from unnest(comp_assess_competency) as t),0)::int as question,
                    coalesce((select sum(t) from unnest(comp_assess_score) as t),0)::int as sum,coalesce(comp_assess_comp_type_id) as type,
                    comp_assess_employee_id as emp_id,comp_assess_year as year,comp_assess_quarter as quarter
                    from hcms_tm_competency_assessment where comp_assess_year in ((select to_char(now(),'YYYY'))::int) and is_active)a
                    group by emp_id,year,quarter)a 
                    union all 
            """+query+"""))ei where """    
            if company_id and not unit_id and not emp_name and role_status is None: 
                query = querys+" ei.org_id_id=%s"%int(company_id)
                print "---------------query----->",query
                cur.execute(query+" order by ei.name");
                values = q.dictfetchall(cur) 
            elif company_id and role_status:
                logger_obj.info( "-----------------  Company Role_status --------------------",role_status)
                query = querys+" ei.org_id_id=%s"%int(company_id)
                query = query+" rd.key_role_id=%s"%int(role_status)
                cur.execute(query+" order by ei.name");
                values = q.dictfetchall(cur)
            elif company_id and unit_id and not emp_name:
                logger_obj.info( "----------------- Company & Unit --------------------")
                query = querys+" ei.org_id_id=%s"%int(company_id)
                query = query+" ei.org_unit_id_id=%s"%int(unit_id)
                cur.execute(query+" order by ei.name");
                values = q.dictfetchall(cur)
            elif company_id and unit_id and emp_name:
                logger_obj.info( "----------------- Company & Unit & Empl Name  --------------------")
                query = querys+" ei.name ilike '%"+str(emp_name)+"%'"
                query = query+" ei.org_id_id=%s"%int(company_id)
                query = query+" ei.org_unit_id_id=%s"%int(unit_id)
                cur.execute(query+" order by ei.name");
                values = q.dictfetchall(cur)
            elif company_id and emp_name:
                logger_obj.info( "-----------------  Company & Empl Name   --------------------")
                query = querys+" ei.name ilike '%"+str(emp_name)+"%'" 
                query = query+" and ei.org_id_id=%s"%int(company_id)
                cur.execute(query+" order by ei.name");
                values = q.dictfetchall(cur)
            if values:
                     json_data['results'] = values
            else:
                     json_data['results'] = []
    except Exception as e:
            print e
            json_data['results'] = []
    return HttpResponse(json.dumps(json_data))

# Learning Development Details GEt
def learningDevelopmentDetailsGet(request):
    ''' 
    24-September-2018 TRU Learning & Development Details CRUD Operations
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: TRU
    '''
    try:
        logger_obj.info(' Learning & developement Details by'+str(request.user.username))
        json_data = {}
        emp_id = request.GET.get('emp_id')
        if emp_id != '0':
            print "------------Emp ID--------------",emp_id
            query = """
                    select coalesce(training_details,'[]') as training_details ,coalesce(emp_details,'[]') as emp_details from
                    (select array_to_json(array_agg(a)) as training_details from 
                    (
                    select trr.id,coalesce(td.training_name,'') as name,coalesce(td.description,'') as des,
                    coalesce(to_char(start_date,'dd-mm-yyyy'),'') as sdate,
                    coalesce(to_char(end_date,'dd-mm-yyyy'),'') as edate,
                    coalesce((select refitems_name from reference_items where id = td.training_methodology_id),'') as training_method,
                    coalesce((select refitems_name from reference_items where id = td.training_type_id),'') as training_type,
                    coalesce(tr.recommendation_type,'') as recommendation_type,
                    coalesce((select name from team_details_info where id = tr.division_id),'') as division,
                    coalesce((select coalesce(name||' '||last_name) as name from employee_info where id = trr.training_recommendation_id),'') as emp_name
                    from hcms_ld_training_recommendation_rel trr
                    inner join hcms_ld_training_recommendation tr on trr.training_recommendation_id = tr.id
                    inner join hcms_ld_training_detail td on td.id = tr.training_id where trr.employee_id = {0} and trr.is_active
                    )a)aa,
                    (select array_to_json(array_agg(b)) as emp_details from 
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
                    where ei.id = {0}
                    )b)bb
            """
            cur = connection.cursor()  # create the database connection
            cur.execute(query.format(int(emp_id)))  
        learning_dev_datas = q.dictfetchall(cur)    
        json_data['datas'] = learning_dev_datas
        logger_obj.info('Role Add'+str(json_data)+"attempted by"+str(request.user.username))         
    except Exception as e:
        logger_obj.error(e)
        json_data[config.status_key] = e
    return HttpResponse(json.dumps(json_data))

# Profile Details GEt
def profileList(request):
    ''' 
    24-September-2018 TRU Profile Details CRUD Operations
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: TRU
    '''
    try:
        logger_obj.info(' Profile Details by'+str(request.user.username))
        json_data = {}
        emp_id = request.GET.get('emp_id')
#         emp_id = 254
        if emp_id != '0':
            print "------------Emp ID--------------",emp_id
            query = """
                    select coalesce(emp_details,'[]') as emp_details from
                    (select array_to_json(array_agg(a)) as emp_details from 
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
                    where ei.id = {0}
                    )a)aa
            """
            cur = connection.cursor()  # create the database connection
            cur.execute(query.format(int(emp_id)))  
        learning_dev_datas = q.dictfetchall(cur)    
        json_data['datas'] = learning_dev_datas
        logger_obj.info('Role Add'+str(json_data)+"attempted by"+str(request.user.username))         
    except Exception as e:
        logger_obj.error(e)
        json_data[config.status_key] = e
    return HttpResponse(json.dumps(json_data))

#Identify data fetch function here
def indentifyDevelopmentDetailsGet(request):
    ''' 
    26-September-2018 TRU Identify & Development Details CRUD Operations
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: TRU
    '''
    try:
        logger_obj.info(' Identify & developement Details by'+str(request.user.username))
        json_data = {}
        emp_id = request.GET.get('emp_id')
#         emp_id = 254
        if emp_id != '0':
            print "------------Emp ID--------------",emp_id
            query = """
                        select coalesce(emp_details,'[]') as emp_details,coalesce(skill_type_details,'[]') as skill_type_details ,coalesce(skill_details,'[]') as skill_details from
                        (select array_to_json(array_agg(a)) as skill_type_details from 
                        (
                        select a.type as skill_type_id,(((a.skill_sum)::decimal/(a.skill_ques))*100)::int as skill_type_avg,
                        (select refitems_name as name from reference_items where id = a.type) as sname from
                        (select id,coalesce((select count(t) from unnest(comp_assess_competency) as t)*6,0)::int as skill_ques,
                        coalesce((select sum(t) from unnest(comp_assess_score) as t),0)::int as skill_sum,coalesce(comp_assess_comp_type_id) as type,
                        comp_assess_employee_id as emp_id,comp_assess_year as year,comp_assess_quarter as quarter
                        from hcms_tm_competency_assessment where comp_assess_year in ((select to_char(now(),'YYYY'))::int) and comp_assess_employee_id = {0} and is_active)a 
                        )a)aa,
                        (select array_to_json(array_agg(b)) as skill_details from 
                        (
                        select qad.stid,json_agg(row_to_json( (SELECT r FROM (SELECT qad.stid,qad.sname,qad.savg,qad.stname) r) )) as skills_list from
                        (select (select refitems_name as name from reference_items where id = qa.skill_id) as sname,coalesce(skill_avg,0) savg,
                        (select refitems_name as name from reference_items where id = qa.skill_type_id) as stname,qa.skill_type_id as stid
                        from 
                        (
                        select unnest(comp_assess_competency) as skill_id,unnest(comp_assess_score) as skill_score,
                        ((unnest(comp_assess_score)::decimal/6)*100)::int as skill_avg,comp_assess_comp_type_id as skill_type_id,
                        comp_assess_competency,comp_assess_score,comp_assess_employee_id
                        from hcms_tm_competency_assessment where comp_assess_year in ((select to_char(now(),'YYYY'))::int) and comp_assess_employee_id = 254 and is_active
                        )qa)qad
                        group by qad.stid
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
                        where ei.id = {0}
                        )c)cc
            """
            cur = connection.cursor()  # create the database connection
            cur.execute(query.format(int(emp_id)))  
        identify_dev_datas = q.dictfetchall(cur)    
        json_data['datas'] = identify_dev_datas
        logger_obj.info('Role Add'+str(json_data)+"attempted by"+str(request.user.username))         
    except Exception as e:
        logger_obj.error(e)
        json_data['datas'] = []
    return HttpResponse(json.dumps(json_data))