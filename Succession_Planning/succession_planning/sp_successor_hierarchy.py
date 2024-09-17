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
from HRMS_Foundation.employee_management.models import EmployeeInfo as EI

#template render html
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from CommonLib.hcms_common import menu_access_control
import logging
import logging.handlers
logger_obj = logging.getLogger('logit')

#Org structure data get function here
def spSuccessorHierarchyDetails(request):
    ''' 
    18-Sep-2018 TRU To SP Successor Hierarchical data loaded
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: TRU
    '''
    json_data = {}
    try:
             logger_obj.info('Successor Hierarchical structure data function by'+str(request.user.username))
             cur = connection.cursor()  #create the database connection
             id = request.GET.get('id') 
             query = """
                    select ei.id,UPPER(coalesce(ei.name,'')||' '||coalesce(ei.last_name,'')) as name,coalesce(ei.work_email,'') email,coalesce(ei.employee_id,'') eid,
                    coalesce(ei.home_address,'') as address,(a.parentId)::int as "parentId",coalesce(ai.name,'no_data.png') as image,a.role_title as title   from 
                    ( 
                    select 
                    trd.role_title,
                    key_role_id, 
                    array_to_json(array_agg(coalesce(avg,0))) AS avg,coalesce(round((sum(avg)::float/count(*))/10),0) as tot_avg
                    ,array_to_json(array_agg(coalesce((ei.name||' '||ei.last_name),''))) AS emp_name,0 as parentId
                    FROM sp_key_roles_details rd
                    inner join employee_info ei on ei.id = rd.emp_id
                    inner join hcms_ti_role_details trd on trd.id = rd.key_role_id
                    GROUP BY key_role_id,trd.role_title order by tot_avg desc
                    )a
                    inner join employee_info ei on ei.role_id_id = a.key_role_id 
                    left join attachment_info ai on ai.id = ei.image_id_id where ei.org_id_id=%s
                    order by a.tot_avg
             """
             if id:
                 cur.execute(query,(int(id),));
                 values = q.dictfetchall(cur)
                 sub_querys = """
                        select ei.id,UPPER(coalesce(ei.name,'')||' '||coalesce(ei.last_name,'')) as name,coalesce(ei.work_email,'') email,coalesce(ei.employee_id,'') eid,
                        coalesce(ei.home_address,'') as address,(%s)::int as "parentId",coalesce(ai.name,'no_data.png') as image,trd.role_title as title   from 
                        employee_info ei 
                        left join attachment_info ai on ai.id = ei.image_id_id 
                        left join hcms_ti_role_details trd on trd.id = ei.role_id_id
                        where ei.reporting_officer_id = %s
                 """
                 for i in values:
                     cur.execute(sub_querys,(int(i['id']),int(i['id']),));
                     sub_values = q.dictfetchall(cur)
                     if sub_values:
                         for j in sub_values:
                              values.append(j)
                              cur.execute(sub_querys,(int(j['id']),int(j['id']),));
                              sub1_values = q.dictfetchall(cur)
                              if sub1_values:
                                  for k in sub1_values:
                                      values.append(k)
                                      cur.execute(sub_querys,(int(k['id']),int(k['id']),));
                                      sub2_values = q.dictfetchall(cur)
                                      if sub2_values:
                                          for qs in sub2_values:
                                              values.append(qs)
                                              cur.execute(sub_querys,(int(qs['id']),int(qs['id']),));
                                              sub3_values = q.dictfetchall(cur)
                 json_data['results'] = values
             else:
                 json_data['results'] = []
             logger_obj.info('Successor Hierarchical structure data response is'+str(json_data)+"attempted by"+str(request.user.username))     
    except Exception as e:
            logger_obj.error(e)
            json_data['results'] = [] 
    return HttpResponse(json.dumps(json_data))
