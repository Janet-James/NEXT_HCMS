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
from Exit_Management.exit_management.models import EM_ExitDetails as ED
from HRMS_Foundation.employee_management.models import EmployeeAssetInfo as EAI

from CommonLib.hcms_common import menu_access_control
import datetime
# logger function import
import logging
import logging.handlers
logger_obj = logging.getLogger('logit')

     
# EM Process details
def emProcess(request):
         ''' 
         27-Aug-2018 TRU To EM Process report Search data loaded.
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
                to_char(emp_resignation_date,'dd-mm-yyyy') as resi_date,
                case when department_approve_status = true then 'Approved' else 'Not Approved' end as dep_status ,
                case when hr_approve_status = true then 'Approved' else 'Not Approved' end as hr_status,
                case when relieving_status = true then 'Approved' else 'Not Approved' end as rel_status,
                to_char(emp_resignation_date,'yyyy-mm-dd') as start_date
                from em_exit_details where is_active
                """
                log_query = """select to_char(created_date+ interval '330' minute,'dd-mm-yyyy hh:mi:ss') as created_date,
                to_char(modified_date+ interval '330' minute,'dd-mm-yyyy hh:mi:ss') as modified_date,
                (case when (is_active is true ) then 'Active' else 'In Active' end) as status,
                (select username from auth_user where id = created_by_id) as createdby_username,
                to_char(created_date::timestamptz - interval '330' minute,'dd-mm-yyyy hh12:mi:ss') as created_datatime,
                coalesce((select username from auth_user where id = modified_by_id),'') as modify_username,
                (select name||' '||last_name as title from employee_info where id=emp_id) as title from em_exit_details order by created_datatime desc
                """
                cur.execute(log_query)   
                log_details = q.dictfetchall(cur)  
                json_data['log_details'] = log_details
                cur.execute(query + ' and department_approve_status=False and hr_approve_status=False and relieving_status=False and emp_status=False')   
                em_request_data = q.dictfetchall(cur)    
                json_data['em_request'] = em_request_data
                cur.execute(query + ' and department_approve_status=False and hr_approve_status=False and relieving_status=False and emp_status=False')   
                em_depapproval_data = q.dictfetchall(cur)    
                json_data['em_depapproval'] = em_depapproval_data
                cur.execute(query + ' and department_approve_status and hr_approve_status=False and relieving_status=False and emp_status and hr_emp_status=False')   
                em_hrapproval_data = q.dictfetchall(cur)    
                json_data['em_hrapproval'] = em_hrapproval_data
                cur.execute(query + ' and department_approve_status and hr_approve_status and relieving_status=False and emp_status and hr_emp_status')   
                em_clearance_data = q.dictfetchall(cur)    
                json_data['em_clearance'] = em_clearance_data
                cur.execute(query + ' and department_approve_status and hr_approve_status and relieving_status and emp_status and hr_emp_status')   
                em_exit_data = q.dictfetchall(cur)    
                json_data['em_exit'] = em_exit_data
                cur.execute(query + ' and (department_approve_status=False and relieving_status=False and emp_status and hr_emp_status=False) or (hr_approve_status=False and relieving_status=False and emp_status and hr_emp_status)')   
                em_reject_data = q.dictfetchall(cur)    
                json_data['em_reject'] = em_reject_data
                logger_obj.info('EM Process Report search response is' + str(json_data) + "attempted by" + str(request.user.username))   
         except Exception as e:
              logger_obj.error(e)
              json_data['error'] = []
         cur.close()
         return HttpResponse(json.dumps(json_data))
    
# EM Process event details
def emProcessEvent(request):
         ''' 
         27-Aug-2018 TRU To EM Process event report Search data loaded.
         @param request: Request Object
         @type request : Object
         @return:   HttpResponse Interview Search Data
         @author: TRU
         '''
         logger_obj.info('EM Process Report search function by' + str(request.user.username))
         json_data = {}
         post = request.GET
         getid = post.get('getId')  # get id key 
         tab = post.get('tab')  # get tab key
         print "--------------getId-", getid, tab
         cur = connection.cursor()  # create the database connection
         try:
             query = """select a.em_exit_id as exit_id,a.exit_emp_id as emp_id,(select name from organization_info where id = a.org_id_id) org_name,
                (select orgunit_name from organization_unit_info where id = a.org_unit_id_id) org_unit_name,
                (select name from team_details_info where id = a.team_name_id) divison_name,
                (name||' '||last_name) as emp_name,
                to_char(a.emp_resignation_date,'dd-mm-yyyy') as res_date,coalesce(a.emp_leaving_reason_others,'') as emp_rel_reason,coalesce(a.emp_remarks,'') as emp_remarks,
                case when department_approve_status = true then 'Approved' else 'Not Approved' end as dep_status ,
                case when hr_approve_status = true then 'Approved' else 'Not Approved' end as hr_status,
                case when relieving_status = true then 'Approved' else 'Not Approved' end as rel_status,
                to_char(a.emp_exp_relieving_date,'dd-mm-yyyy') as exp_res_date,
                coalesce(department_remarks,'') as dep_remarks,
                coalesce(department_emp_id,0) as dep_emp_id,
                coalesce(hr_emp_id,0) as hr_emp_id,
                coalesce(hr_remarks,'') as hr_remarks
                from(select eed.id em_exit_id,ei.id exit_emp_id,* from em_exit_details eed
                left join employee_info ei on eed.emp_id = ei.id
                where eed.is_active)a"""
             cur.execute(query + " where a.em_exit_id=%s" % int(getid))  
             job_data = q.dictfetchall(cur)    
             json_data['datas'] = job_data
             if tab in 'tab4':
                 print "--------Cler-T4----------"
                 clr_query = """select * from 
                    (select array_to_json(array_agg(a)) as department from 
                    (
                    select sa.id as id,sa.name as name,(case when sb.id != 0 then True else False end) status from (select ri.id,ri.refitems_name as name from reference_item_category ric inner join reference_items ri on ric.id = ri.refitems_category_id 
                    where ric.refitem_category_code = 'DPTCL' order by id)sa left join (select id from reference_items where id = ANY ((select department_clearance from em_exit_details where id={0})::int[]))sb
                    on sa.id = sb.id order by name
                    )a)aa,
                    (
                    select array_to_json(array_agg(b)) as admins from (
                    select sa.id as id,sa.name as name,(case when sb.id != 0 then True else False end) status from (select ri.id,ri.refitems_name as name from reference_item_category ric inner join reference_items ri on ric.id = ri.refitems_category_id 
                    where ric.refitem_category_code = 'ADMCL' order by id)sa left join (select id from reference_items where id = ANY ((select adimn_clearance from em_exit_details where id={0})::int[]))sb
                    on sa.id = sb.id order by name
                    )b)bb,
                    (
                    select array_to_json(array_agg(c)) as account from (
                    select sa.id as id,sa.name as name,(case when sb.id != 0 then True else False end) status from (select ri.id,ri.refitems_name as name from reference_item_category ric inner join reference_items ri on ric.id = ri.refitems_category_id 
                    where ric.refitem_category_code = 'ACCCL' order by id)sa left join (select id from reference_items where id = ANY ((select account_clearance from em_exit_details where id={0})::int[]))sb
                    on sa.id = sb.id order by name
                    )c)cc,
                    (
                    select array_to_json(array_agg(d)) as network from (
                    select sa.id as id,sa.name as name,(case when sb.id != 0 then True else False end) status from (select ri.id,ri.refitems_name as name from reference_item_category ric inner join reference_items ri on ric.id = ri.refitems_category_id 
                    where ric.refitem_category_code = 'NTWCL' order by id)sa left join (select id from reference_items where id = ANY ((select network_clearance from em_exit_details where id={0})::int[]))sb
                    on sa.id = sb.id order by name
                    )d)dd,
                    (select array_to_json(array_agg(e)) as relieve from (
                    select id,'Relieved is conform' as name,relieving_status as status from em_exit_details where id={0} 
                    )e)ee,
                    (select array_to_json(array_agg(f)) as asset from (
                    select asset_id as id,ra.id as rid,ei.id as emp_id,ei.name||' '||ei.last_name as name,al.asset_serial as asset_serial,al.asset_model_code as asset_model,ra.refitems_name as asset_name,to_char(ai.given_date, 'DD-MM-YYYY') as given_date
                    from hcms_am_asset_list al inner join hrms_assets_info ai on ai.asset_id=al.id inner join employee_info ei on ei.id=ai.emp_id_id
                    inner join reference_items ra on ra.id=asset_model_type_refitem_id
                    inner join em_exit_details eed on eed.emp_id=ei.id
                    where eed.id={0} and al.is_active and ai.is_active order by refitems_name
                    )f)ff
                 """
                 cur.execute(clr_query.format(getid))
                 clr_data = q.dictfetchall(cur)
                 json_data['clr_datas'] = clr_data
             logger_obj.info('EM Process search response is' + str(json_data) + "attempted by" + str(request.user.username))   
         except Exception as e:
              print e
              logger_obj.error(e)
              json_data['error'] = []
         cur.close()
         return HttpResponse(json.dumps(json_data))

# event update function here
def emProcessEventUpdate(request):
         ''' 
         28-Aug-2018 TRU To EM Process event Update report Search data loaded.
         @param request: Request Object
         @type request : Object
         @return:   HttpResponse Interview Search Data
         @author: TRU
         '''
         logger_obj.info('EM Process Report search function by' + str(request.user.username))
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
                 status = ED.objects.filter(id=update_id).update(emp_status=True,department_approve_status=dep_status,department_remarks=str(post.get('dep_remark')),department_emp_id=int(post.get('dep_change_by')), emp_exp_relieving_date=str(post.get('rel_date')) ,is_active="True",modified_by_id=int(uid))
                 json_data['results'] = '1'
             elif status == 'hr':
                 status = ED.objects.filter(id=update_id).update(hr_emp_status=True,hr_approve_status=dep_status,hr_remarks=str(post.get('hr_remark')),hr_emp_id=int(post.get('hr_change_by')), emp_exp_relieving_date=str(post.get('rel_date')) ,is_active="True",modified_by_id=int(uid))
                 json_data['results'] = '2'
             elif status == 'clearance':
                 dep_status =  post.get('department');
                 if dep_status == '':
                     list_department = []
                 else:
                     list_department = [int(s) for s in dep_status.split(',')]
                 network =  post.get('network');
                 if network == '':
                     list_network = []
                 else:
                     list_network = [int(s) for s in network.split(',')]
                 account =  post.get('account');
                 if account == '':
                     list_account = []
                 else:
                     list_account = [int(s) for s in account.split(',')]
                 admin =  post.get('admin');
                 if admin == '':
                     list_admin = []
                 else:
                     list_admin = [int(s) for s in admin.split(',')]
                 relieved =  post.get('relieved');
                 if relieved == '': 
                    rel_status = 0
                 else:
                    rel_status = True
                 print rel_status
                 status = ED.objects.filter(id=update_id).update(department_clearance=list_department,adimn_clearance=list_admin,account_clearance=list_account,network_clearance=list_network,relieving_status=rel_status,is_active="True",modified_by_id=int(uid))
                 json_data['results'] = '3'
             elif status == 'assetverfy':
                asset_status =  post.get('asset');
                emp_id = int(post.get('emp_id'))
                list_asset = [int(s) for s in asset_status.split(',')]
                em_status = ED.objects.filter(id=update_id).update(hr_clearance=list_asset,is_active="True",modified_by_id=int(uid))
                print "--------------emp_id---======list_asset===============",emp_id,list_asset
                asset_status = EAI.objects.filter(emp_id_id=emp_id,asset_id__in=list_asset).update(is_active="False",modified_by_id=int(uid))
                json_data['results'] = '4'
             logger_obj.info('EM Process update response is' + str(json_data) + "attempted by" + str(request.user.username))   
         except Exception as e:
              print e
              logger_obj.error(e)
              json_data['error'] = []
         cur.close()
         return HttpResponse(json.dumps(json_data))
