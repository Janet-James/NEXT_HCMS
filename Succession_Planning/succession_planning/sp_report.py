# -*- coding: utf-8 -*-
from __future__ import unicode_literals 
from django.shortcuts import render

import json
from django.views.decorators.csrf import csrf_exempt
from django.http.response import HttpResponse
from CommonLib import lib
from django.db import connection
import config
from CommonLib import query
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
#report data function here
def report_data(request): 
    ''' 
    11-sep-2018 PAR To sp_report data 
    @param request: Request Object
    @type request : Object 
    @return:   HttpResponse 
    @author: PAR  
    '''
    try:
        logger_obj.info('Succession planning  report_data function by'+str(request.user.username))
        json_datas={}
        if request.method=='GET' or request.method=='POST': 
            post=request.POST
            type=post.get("type")
            cur=lib.db_connection()#to_char(hr_leave.created_date, 'MM-DD-YYYY HH24:MI:SS') AS raised_date,
            user_id = request.user.id  
            dic = {} 
            json_datas = {}   
            values=[]       
            if type=="dropdown": 
                table_name=post.get("table")
                if table_name=="organization_unit_info":
                    org_id=post.get("org_id")
                    cond=" and  parent_orgunit_id!=0 and organization_id="+org_id   
                    column="id,orgunit_name"
                elif table_name=="team_details_info":
                    org_id=post.get("org_id")
                    org_unit_id=post.get("org_unit_id")
                    cond=" and  org_id="+org_id+" and org_unit_id="+org_unit_id  
                    column="id,name"     
                else:  
                    cond=""    
                    column="id,name" 
                if user_id:
                    org_query=query.fetch_hcms_query(config.succession_planning,config.sp_dropdown_query)
                    if org_query: 
                        org_query=org_query.format(table=table_name,column=column,condition=cond)
                        cur.execute(org_query)  
                        values=query.dictfetchall(cur)   
                commit =lib.db_commit(cur) 
                close = lib.db_close(cur)     
                json_datas['datas'] = values  
                json_datas = json_datas#response data function call 
            elif type=="filter": 
                 search_metrics=post.get("search_metrics")
                 search_metrics=json.loads(search_metrics)
                 if search_metrics:
                    d=[]
                    key={}
                    fname=search_metrics.get('fname')
                    lname=search_metrics.get('lname')    
                    org=search_metrics.get('org')
                    org_unit=search_metrics.get('org_unit')
                    division=search_metrics.get('division')
                    status=search_metrics.get('status')  
                    table= search_metrics.get('tab')
                    tab={}
                    tab['transfer']='sp_transfer_details'
                    tab['promotion']='sp_promotion_details'    
                    tab['demotion']='sp_demotion_details'
                     
                    key['REQD']='not dep_status and not dep_appr_status and not hr_status and not hr_appr_status'
                    key['DAPD']='dep_status and dep_appr_status and not hr_status and not hr_appr_status '
                    key['DRJD']='dep_status and not dep_appr_status and not hr_status '
                    key['HAPD']='dep_status and hr_status '
                    key['HRJD']='dep_status and hr_status and dep_status and not   hr_appr_status '
                    condition="" 
                    if fname:   
                        condition+= ' and ' 
                        condition+=" e.name ilike '"'%'+str(fname)+'%'"'" 
                    if lname:  
                        condition+= ' and '  
                        condition+=" e.last_name ilike '"'%'+str(lname)+'%'"' " 
                    if int(org) !=0:
                        condition+= ' and '        
                        condition+=" oi.id = %s "%int(org) 
                    if int(org_unit) !=0: 
                        condition+= ' and '   
                        condition+= "t.org_unit_id = %s "%int(org_unit)    
                    if int(division) !=0:  
                        condition+= ' and ' 
                        condition+= "t.org_unit_div_id = %s "%int(division)  
                    if status!="":
                        condition+= ' and '
                        condition+= key[status]
                    
                    search_query=query.fetch_hcms_query(config.succession_planning,config.report_search_query)
                    if search_query:
                        search_query=search_query.format(table=tab[table],condition=condition)
                        cur.execute(search_query) 
                        values=cur.fetchall() 
                 close = lib.db_close(cur)  
                 json_datas['datas'] = values   
            
            logger_obj.info(' Succession planning report_data  response is'+str(json_datas)+"attempted by"+str(request.user.username))                 
    except Exception as e:
       logger_obj.error(e)
       json_datas['datas'] = []
    return HttpResponse(json.dumps(json_datas))
