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
from Succession_Planning.succession_planning.models import SP_Transfer as ST

from CommonLib.hcms_common import menu_access_control
import datetime
# logger function import
import logging
import logging.handlers
logger_obj = logging.getLogger('logit')

     
# SP Transfer Process details
def spTransferProcess(request):
         ''' 
         10-Sep-2018 TRU To SP Transfer Process report Search data loaded.
         @param request: Request Object
         @type request : Object
         @return:   HttpResponse Interview Search Data
         @author: TRU
         '''
         logger_obj.info('EM Process Report search function by' + str(request.user.username))
         json_data = {}
         cur = connection.cursor()  # create the database connection
         post = request.GET
         try:   
                query = """select id,coalesce((select name||' '||last_name as title from employee_info where id=emp_id),'') job_title,
                to_char(req_date,'dd-mm-yyyy') as resi_date,
                case when dep_appr_status = true then 'Approved' else 'Not Approved' end as dep_status ,
                case when hr_appr_status = true then 'Approved' else 'Not Approved' end as hr_status,
                case when transfer_status = true then 'Approved' else 'Not Approved' end as rel_status,
                to_char(req_date,'yyyy-mm-dd') as start_date
                from sp_transfer_details where is_active
                """
                log_query = """select to_char(created_date,'dd-mm-yyyy hh:mm:ss') as created_date,
                to_char(modified_date,'dd-mm-yyyy hh:mm:ss') as modified_date,
                (case when (is_active is true ) then 'Active' else 'In Active' end) as status,
                (select username from auth_user where id = created_by_id) as createdby_username,
                to_char(created_date::timestamptz - interval '330' minute,'dd-mm-yyyy hh12:mi:ss') as created_datatime,
                coalesce((select username from auth_user where id = modified_by_id),'') as modify_username,
                (select name||' '||last_name as title from employee_info where id=emp_id) as title from sp_transfer_details order by created_datatime desc
                """
                cur.execute(log_query)   
                log_details = q.dictfetchall(cur)  
                json_data['log_details'] = log_details
                cur.execute(query + ' and dep_appr_status=False and hr_appr_status=False and transfer_status=False and dep_status=False')   
                em_request_data = q.dictfetchall(cur)    
                json_data['sp_request'] = em_request_data
                cur.execute(query + ' and dep_appr_status=False and hr_appr_status=False and transfer_status=False and dep_status=False')   
                em_depapproval_data = q.dictfetchall(cur)    
                json_data['sp_depapproval'] = em_depapproval_data
                cur.execute(query + ' and dep_appr_status and hr_appr_status=False and transfer_status=False and dep_status and hr_status=False')   
                em_hrapproval_data = q.dictfetchall(cur)    
                json_data['sp_hrapproval'] = em_hrapproval_data
                cur.execute(query + ' and dep_appr_status and hr_appr_status and transfer_status and dep_status and hr_status')   
                em_exit_data = q.dictfetchall(cur)    
                json_data['sp_exit'] = em_exit_data
                cur.execute(query + ' and (dep_appr_status=False and transfer_status=False and dep_status and hr_status=False) or (hr_appr_status=False and transfer_status=False and dep_status and hr_status)')   
                em_reject_data = q.dictfetchall(cur)    
                json_data['sp_reject'] = em_reject_data
                print "----------------json_data------------",json_data
                logger_obj.info('SP Transfer Process Report search response is' + str(json_data) + "attempted by" + str(request.user.username))   
         except Exception as e:
              logger_obj.error(e)
              json_data['error'] = []
         cur.close()
         return HttpResponse(json.dumps(json_data))
    
# SP Transfer Process event details
def spTransferProcessEvent(request):
         ''' 
         10-Sep-2018 TRU To SP Transfer Process event report Search data loaded.
         @param request: Request Object
         @type request : Object
         @return:   HttpResponse Interview Search Data
         @author: TRU
         '''
         logger_obj.info('SP Transfer Process Report search function by' + str(request.user.username))
         json_data = {}
         post = request.GET
         getid = post.get('getId')  # get id key 
         tab = post.get('tab')  # get tab key
         print "--------------getId-", getid, tab
         cur = connection.cursor()  # create the database connection
         try:
             query = """select a.sp_id as sp_id,
                coalesce((select name from organization_info where id = a.org_id_id),'') org_name,
                coalesce((select orgunit_name from organization_unit_info where id = a.org_unit_id_id),'') org_unit_name,
                coalesce((select name from team_details_info where id = a.team_name_id),'') divison_name,
                coalesce((name||' '||last_name),'') as emp_name,
                to_char(a.req_date,'dd-mm-yyyy') as res_date,coalesce(a.emp_notes,'') as emp_remarks,
                case when dep_appr_status = true then 'Approved' else 'Not Approved' end as dep_status ,
                case when hr_appr_status = true then 'Approved' else 'Not Approved' end as hr_status,
                case when transfer_status = true then 'Approved' else 'Not Approved' end as rel_status,
                to_char(a.req_date,'dd-mm-yyyy') as exp_res_date,
                coalesce(dep_notes,'') as dep_remarks,
                coalesce(dep_emp_id,0) as dep_emp_id,
                coalesce(hr_emp_id,0) as hr_emp_id,
                coalesce(hr_notes,'') as hr_remarks,
                coalesce(a.sp_emp_id,0) as sp_emp_id,
                coalesce((select name from organization_info where id = a.std_org_id),'') torg_name,
                coalesce((select orgunit_name from organization_unit_info where id = a.org_unit_id),'') torg_unit_name,
                coalesce((select name from team_details_info where id = a.std_org_unit_div_id),'') tdivison_name
                from(select std.id sp_id,ei.id sp_emp_id,std.org_id std_org_id,std.org_unit_id std_org_unit_id,std.org_unit_div_id std_org_unit_div_id,* from sp_transfer_details std
                left join employee_info ei on std.emp_id = ei.id
                where std.is_active)a"""
             cur.execute(query + " where a.sp_id=%s" % int(getid))  
             job_data = q.dictfetchall(cur)    
             json_data['datas'] = job_data
             logger_obj.info('SP Transfer Process search response is' + str(json_data) + "attempted by" + str(request.user.username))   
         except Exception as e:
              print e
              logger_obj.error(e)
              json_data['error'] = []
         cur.close()
         return HttpResponse(json.dumps(json_data))

#Event update function here
def spProcessTransferEventUpdate(request):
         ''' 
         10-Sep-2018 TRU To SP Transfer Process event Update report Search data loaded.
         @param request: Request Object
         @type request : Object
         @return:   HttpResponse Interview Search Data
         @author: TRU
         '''
         logger_obj.info('SP Process Report search function by' + str(request.user.username))
         json_data = {}
         post = request.POST
         update_id = int(post.get('id'))  # get id key 
         status = post.get('status')  # get id key 
         cur = connection.cursor()  # create the database connection
         uid = request.user.id
         if not uid:
             uid = 1
         dep_status = post.get('final_status');
         if dep_status == 'true':
            dep_status = True
         else:
            dep_status = False 
         try:
             if status == 'department':
                 status = ST.objects.filter(id=update_id).update(dep_status=True,dep_appr_status=dep_status,dep_notes=str(post.get('dep_remark')),dep_emp_id=int(post.get('dep_change_by')), is_active="True",modified_by_id=int(uid))
                 json_data['results'] = '1'
             elif status == 'hr':
                 status = ST.objects.filter(id=update_id).update(hr_status=True,hr_appr_status=dep_status,transfer_status=dep_status,hr_notes=str(post.get('hr_remark')),hr_emp_id=int(post.get('hr_change_by')) ,is_active="True",modified_by_id=int(uid))
                 json_data['results'] = '2'
             logger_obj.info('SP Process update response is' + str(json_data) + "attempted by" + str(request.user.username))   
         except Exception as e:
              print e
              logger_obj.error(e)
              json_data['error'] = []
         cur.close()
         return HttpResponse(json.dumps(json_data))
