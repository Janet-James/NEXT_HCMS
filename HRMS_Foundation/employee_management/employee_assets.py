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
from HRMS_Foundation.employee_management.models import EmployeeInfo,HrSkillsInfo,HrCertificationsInfo,HrProfessionalExperiencesInfo,EducationDetailsInfo
from CommonLib.hcms_common import refitem_fetch,refitemlink_fetch
from CommonLib.hcms_common import record_validation
from django_countries import countries
import logging
import logging.handlers
import datetime
logger_obj = logging.getLogger('logit')

     
@csrf_exempt
def HRMSEmployeeAssetsList(request): #To show all employee related informations in a table
    ''' 
    03-May-2018 SYA To HRMS Employee Assets List Datatable function. 
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: SYA
    '''
    json_data ={}
    try:
       
        logger_obj.info('Employee datatable function by'+str(request.user.username))        
        cur = connection.cursor()
        table_id = request.POST.get(config.table_id)
        query = q.fetch_hcms_query(config.employee_management, config.hrms_assets_check)
        cur.execute(query,(table_id,))
        res =  dictfetchall(cur)  
        
        if res:
            query = q.fetch_hcms_query(config.employee_management, config.hrms_assets_list_for_employee)
            cur.execute(query.format(table_id))
            res =  cur.fetchall()
        else:
            query = q.fetch_hcms_query(config.employee_management, config.hrms_assets_list)
            cur.execute(query,(table_id,))   
            res =  cur.fetchall()             
        return HttpResponse(json.dumps({'results':res}))
    except Exception as e:
        logger_obj.error(e)
        json_data[config.status] = []
    return HttpResponse(json.dumps({'results':json_data}))



@csrf_exempt
def HRMSEmployeeInsertAssetsList(request): #To show all employee related informations in a table
    ''' 
    03-May-2018 SYA To HRMS Employee Assets List Datatable function. 
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: SYA
    '''
    json_data ={}
    try:
        logger_obj.info('Employee datatable function by'+str(request.user.username))        
        cur = connection.cursor()
        emp_id = request.POST.get(config.table_id)
        data = request.POST.get(config.datas) 
        input_data = json.loads(data)          
        cur.execute("update hrms_assets_info set asset_status = 'False' where emp_id_id = %s  returning id",(int(emp_id),))
        res = cur.fetchall();
        for i in range(len(input_data)):
            cur.execute("select id from hrms_assets_info where emp_id_id=%s and asset_id=%s",(int(emp_id),int(input_data[i][0]),));
            status_res = cur.fetchall();
            if status_res:
                 cur.execute("update hrms_assets_info set serial_no=%s,given_date=%s, asset_status=%s and is_active=%s where asset_id=%s and emp_id_id=%s returning id",(input_data[i][1],input_data[i][2],"True","True",input_data[i][0],emp_id,));
                 res =  dictfetchall(cur)  
                 if res:
                    json_data[config.status] = config.update_status
                 else:
                    json_data[config.status] = config.failure_status  
            else:
                 cur.execute("insert into hrms_assets_info(asset_id,serial_no,given_date,asset_status,emp_id_id,is_active) values(%s,%s,%s,%s,%s,%s) returning id",(input_data[i][0],input_data[i][1],input_data[i][2],"True",emp_id,"True",));
                 res =  dictfetchall(cur)  
                 if res:
                   json_data[config.status] = config.update_status
                 else:
                   json_data[config.status] = config.failure_status              
    except Exception as e:
        logger_obj.error(e)
        json_data[config.status] = []
    return HttpResponse(json.dumps(json_data))

#none values assign
def noneValuesAssign(dataValues):
    try:
        if dataValues in '':
            dataValues = None
        else:
            return dataValues
    except Exception as e:      
        print e
        

def dictfetchall(cursor):#Function to fetch all the rows from cursor as a dictionary

    """
            Returns all rows from a cursor as a dictionary
            @param cursor:cursor object
            @return: dictionary contains the details fetch from the cursor object
            @rtype: dictionary
    """
    desc = cursor.description  
    return [
        dict(zip([col[0] for col in desc], row))
        for row in cursor.fetchall()
    ]  

     