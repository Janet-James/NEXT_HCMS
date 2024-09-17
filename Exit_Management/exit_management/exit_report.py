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

# Report Search views here
def RequestsReportSearch(request):
         ''' 
         27-August-2018 SYA Requests report Search data loaded.
         @param request: Request Object
         @type request : Object
         @return:   HttpResponse Requests Search Data
         @author: SYA
         '''
         logger_obj.info('Exit Requests Report search function by'+str(request.user.username))
         json_data = {}
         cur=connection.cursor()  #create the database connection
         post = request.GET
         fname = post.get(config.fname)  #get table key 
         lname = post.get(config.lname)  #get table key 
         org_id = post.get(config.org_id)  #get table key 
         org_unit_id = post.get(config.org_unit_id)  #get table key
         from_date = post.get(config.from_date)
         to_date = post.get(config.to_date)
         org_division = post.get(config.org_div) #get table key 
         try:
                     query =  q.fetch_hcms_query(config.exit_management, config.exit_requests_report_search)
                     conditions = " ext.is_active=True and ext.emp_status=False and hr_emp_status=False and relieving_status=False and"
                     if fname != '':
                         conditions = conditions+" emp.name ilike '"'%'+str(fname)+'%'"' and"
                     if lname != '':
                         conditions = conditions+" emp.last_name ilike '"'%'+str(lname)+'%'"' and"
                     if org_unit_id != '':
                         conditions = conditions+" emp.org_unit_id_id = %s "%int(org_unit_id)
                         conditions = conditions+" and"    
                     if org_division != '':
                         conditions = conditions+" emp.team_name_id = %s "%int(org_division)
                         conditions = conditions+" and"
                     if from_date != '':
                         conditions = conditions+" ext.emp_resignation_date >= ('"+str(from_date)+"') and"
                     if to_date != '':
                         conditions = conditions+" ext.emp_resignation_date <= ('"+str(to_date)+"') and"
                     if from_date != '' and to_date != '':
                         conditions = conditions+" ext.emp_resignation_date >= ('"+str(from_date)+"') and  ext.emp_resignation_date <= ('"+str(to_date)+"') and"
                     conditions = conditions.rsplit(' ', 1)[0]
                     conditions =   conditions+ " and emp.org_id_id = %s"%int(org_id)
                     if cur and query and conditions:
                         querys = (query+str(conditions+" order by emp.name,emp.last_name"))
                         cur.execute(querys)  
                         values = cur.fetchall()
                         if values:
                            json_data[config.datas] = values
                         else:
                            json_data[config.datas] = []
                     else:
                         json_data[config.datas] = []
                     logger_obj.info('Exit Requests Report search response is'+str(json_data)+"attempted by"+str(request.user.username))   
         except Exception as e:
              logger_obj.error(e)
              json_data[config.datas] = []
         cur.close()
         return HttpResponse(json.dumps(json_data))
     
# Report Search views here
def ApprovedReportSearch(request):
         ''' 
         27-August-2018 SYA Approved report Search data loaded.
         @param request: Request Object
         @type request : Object
         @return:   HttpResponse Employee Search Data
         @author: SYA
         '''
         logger_obj.info('Exit Approved Report search function by'+str(request.user.username))
         json_data = {}
         cur=connection.cursor()  #create the database connection
         post = request.GET
         fname = post.get(config.fname)  #get table key 
         lname = post.get(config.lname)  #get table key 
         org_id = post.get(config.org_id)  #get table key 
         org_unit_id = post.get(config.org_unit_id)  #get table key
         from_date = post.get(config.from_date)
         to_date = post.get(config.to_date)
         department = post.get(config.department)
         hr = post.get(config.hr)
         org_division = post.get(config.org_div) #get table key 
         try:                   
                     query =  q.fetch_hcms_query(config.exit_management, config.exit_approved_report_search)
                     if department == 'true' and hr=='false':
                         conditions = " ext.is_active=True and (ext.department_approve_status=True and ext.hr_approve_status=False) "
                     elif department == 'false' and hr == 'true':
                         conditions = " ext.is_active=True and (ext.department_approve_status=True and ext.hr_approve_status=True) "
                     elif department == 'true' and hr == 'true':
                         conditions = " ext.is_active=True and (ext.department_approve_status and ext.emp_status) or (ext.hr_approve_status and ext.hr_emp_status) "                         
                     else:
                         conditions = " ext.is_active=True and (ext.department_approve_status=True and ext.emp_status) or (ext.hr_approve_status=True and ext.hr_emp_status) "
                     querys = query+ conditions+' )ext where '
                     querys = querys+ " ext.org_id_id = %s"%int(org_id)
                     querys = querys+ " and"
                     if fname != '':
                         querys = querys+" ext.name ilike '"'%'+str(fname)+'%'"' and"
                     if lname != '':
                         querys = querys+" ext.last_name ilike '"'%'+str(lname)+'%'"' and"
                     if org_unit_id != '':
                         querys = querys+" ext.org_unit_id_id = %s "%int(org_unit_id)
                         querys = querys+" and"  
                     if org_division != '':
                         querys = querys+" ext.team_name_id = %s "%int(org_division)
                         querys = querys+" and"  
                     if from_date != '':
                         querys = querys+" ext.emp_resignation_date >= ('"+str(from_date)+"') and"
                     if to_date != '':
                         querys = querys+" ext.emp_resignation_date <= ('"+str(to_date)+"') and"
                     if from_date != '' and to_date != '':
                         querys = querys+" ext.emp_resignation_date >= ('"+str(from_date)+"') and  ext.emp_resignation_date <= ('"+str(to_date)+"') and"
                     querys = querys.rsplit(' ', 1)[0]
                     if cur and querys and conditions:
                         querys = (querys+str(" order by ext.name,ext.last_name"))
                         cur.execute(querys)
                         values = cur.fetchall()
                         if values:
                            json_data[config.datas] = values
                         else:
                            json_data[config.datas] = []
                     else:
                         json_data[config.datas] = []
                     logger_obj.info('Exit Approved Report search response is'+str(json_data)+"attempted by"+str(request.user.username))
         except Exception as e:
              logger_obj.error(e)
              json_data[config.datas] = []
         cur.close()
         return HttpResponse(json.dumps(json_data))
     
# Report Search views here
def RejectedReportSearch(request):
         ''' 
         27-August-2018 SYA Approved report Search data loaded.
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
         from_date = post.get(config.from_date)
         to_date = post.get(config.to_date)
         department = post.get(config.department)
         hr = post.get(config.hr)
         org_division = post.get(config.org_div) #get table key 
         try:                   
                     query =  q.fetch_hcms_query(config.exit_management, config.exit_approved_report_search)
                     if department == 'true' and hr=='false':
                         conditions = " ext.is_active=True and (ext.department_approve_status=False and ext.hr_approve_status=False) and (ext.emp_status and ext.hr_emp_status=False) and (ext.relieving_status=False) "
                     elif department == 'false' and hr == 'true':
                         conditions = " ext.is_active=True and (ext.department_approve_status=True and ext.hr_approve_status=False) and (ext.emp_status and ext.hr_emp_status) and (ext.relieving_status=False) "
                     elif department == 'true' and hr == 'true':
                         conditions = " ext.is_active=True and (ext.department_approve_status=False and ext.hr_approve_status=False) and (ext.emp_status and ext.hr_emp_status) and (ext.relieving_status=False) "                         
                     else:
                         conditions = " ext.is_active=True and (ext.department_approve_status=False and ext.relieving_status=False and ext.emp_status and ext.hr_emp_status=False) or (ext.hr_approve_status=False and ext.relieving_status=False and ext.emp_status and ext.hr_emp_status) "
                     querys = query+ conditions+' )ext where '
                     querys = querys+ " ext.org_id_id = %s"%int(org_id)
                     querys = querys+ " and"
                     if fname != '':
                         querys = querys+" ext.name ilike '"'%'+str(fname)+'%'"' and"
                     if lname != '':
                         querys = querys+" ext.last_name ilike '"'%'+str(lname)+'%'"' and"
                     if org_unit_id != '':
                         querys = querys+" ext.org_unit_id_id = %s "%int(org_unit_id)
                         querys = querys+" and"    
                     if org_division != '':
                         querys = querys+" ext.team_name_id = %s "%int(org_division)
                         querys = querys+" and"
                     if from_date != '':
                         querys = querys+" ext.emp_resignation_date >= ('"+str(from_date)+"') and"
                     if to_date != '':
                         querys = querys+" ext.emp_resignation_date <= ('"+str(to_date)+"') and"
                     if from_date != '' and to_date != '':
                         querys = querys+" ext.emp_resignation_date >= ('"+str(from_date)+"') and  ext.emp_resignation_date <= ('"+str(to_date)+"') and"
                     querys = querys.rsplit(' ', 1)[0]
                     if cur and querys and conditions:
                         querys = (querys+str(" order by ext.name,ext.last_name"))
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
              print e
              logger_obj.error(e)
              json_data[config.datas] = []
         cur.close()
         return HttpResponse(json.dumps(json_data))
     
# Report Search views here
def ExitReportSearch(request):
         ''' 
         31-August-2018 SYA Exit report Search data loaded.
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
         from_date = post.get(config.from_date)
         to_date = post.get(config.to_date)
         department = post.get(config.department)
         hr = post.get(config.hr)
         org_division = post.get(config.org_div) #get table key 
         try:
                     query =  q.fetch_hcms_query(config.exit_management, config.exit_approved_report_search)  
                     conditions = " ext.is_active=True and ext.relieving_status=True "    
                     querys = query+ conditions+' )ext where ' 
                     querys = querys+ " ext.org_id_id = %s"%int(org_id)
                     querys = querys+ " and"                
                     if fname != '':
                         querys = querys+" ext.name ilike '"'%'+str(fname)+'%'"' and"
                     if lname != '':
                         querys = querys+" ext.last_name ilike '"'%'+str(lname)+'%'"' and"
                     if org_unit_id != '':
                         querys = querys+" ext.org_unit_id_id = %s "%int(org_unit_id)
                         querys = querys+" and"    
                     if org_division != '':
                         querys = querys+" ext.team_name_id = %s "%int(org_division)
                         querys = querys+" and"
                     if from_date != '':
                         querys = querys+" ext.emp_exp_relieving_date >= ('"+str(from_date)+"') and"
                     if to_date != '':
                         querys = querys+" ext.emp_exp_relieving_date <= ('"+str(to_date)+"') and"
                     if from_date != '' and to_date != '':
                         querys = querys+" ext.emp_exp_relieving_date >= ('"+str(from_date)+"') and  ext.emp_exp_relieving_date <= ('"+str(to_date)+"') and"
                     querys = querys.rsplit(' ', 1)[0]
                     querys =   querys+ " and ext.org_id_id = %s"%int(org_id)                     
                     if cur and querys and conditions:
                         querys = (querys+str(" order by ext.name,ext.last_name"))    
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
              print e
              logger_obj.error(e)
              json_data[config.datas] = []
         cur.close()
         return HttpResponse(json.dumps(json_data))