# -*- coding: utf-8 -*-
#'{"fusion_username":"transform","fusion_password":"transform123","dbname":"ServiceDesk_v1_dev","user":"next","host":"localhost","password":"next","project":"ServiceDesk_v1-Transform-WebApp-Test,ServiceDesk_v1-Transform-WebApp-Prod,Test_Project_Transform_WebApp_Test,Test_Project_Transform_WebApp_Test"}'
from __future__ import unicode_literals
from django.db import connection
import json 
import datetime 
import ast

# Create your views here.
"""    
To get latest build nymber and date 
"""        
#Getting build information here 
def get_build(project_name):
    """
        Function to get build Information  
        @param request:post request
        @return: json data for status of build information
        @rtype: json
        @raise e:Unable to fetch
    """
    try:
        cur = connection.cursor()
        if cur: 
            if project_name:
                if len(project_name)>1:
                    project_name = str(project_name)  
                    cur.execute("""select j.id,j.project_name,j.last_build_date ,j.last_build_number from jenkins_api  j
                                join (select MAX(last_build_number) as last_build_number from jenkins_api where project_name = %s group by project_name) max on j.last_build_number=max.last_build_number""",(project_name,))
                    values = dictfetchall(cur)
                else:
                    cur.execute("""select  MAX(last_build_number)as last_build_number,project_name,last_build_date  from
                                 (select id,last_build_number,project_name,last_build_date from jenkins_api where project_name=%s) as all_build_info
                                 group  by project_name,last_build_date""",(project_name[0].strip(),))
                    values = dictfetchall(cur)
            else:
                jenkins_data = "Project name is empty"
            if values:
                def myconverter(o):
                    if isinstance(o, datetime.datetime):
                        return o.__str__()
                jenkins_data = json.dumps(values, default = myconverter)
                jenkins_data = ast.literal_eval(jenkins_data)
            else:
                jenkins_data = "No value in jenkins table"
        else:
            jenkins_data = 'Unable to create database connection'         
    except Exception as e:
        jenkins_data=e
    return jenkins_data 

# Common Dictionary Format Conversation             
def dictfetchall(cursor):
    "Return all rows from a cursor as a dict"
    columns = [col[0] for col in cursor.description]
    return [
        dict(zip(columns, row))
        for row in cursor.fetchall()
    ]