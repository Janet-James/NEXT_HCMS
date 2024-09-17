# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.http import HttpResponse
from django.db import connection
import json 
import datetime
import requests
import HCMS.settings as s
from django.views.decorators.csrf import csrf_exempt,csrf_protect
"""
To manage all Asynchronous Emails
@author: Thirumanikandan G
@version: 1.0
@project: P5S
"""        
#Asynchronous email send function here
def asyn_email(project_name_title,module_name,subject,to_address,mail_content,e_status):
    """
        Function to email function call
        @param request:post request
        @return: json data for status of email
        @rtype: json
        @raise e:Unable to insert 
    """ 
    status = 0  
    from_address = s.EMAIL_HOST_USER
    sender_pwd = s.EMAIL_HOST_PASSWORD 
    project_name = s.SENDER_NAME
    sender_name = project_name_title
    try: 
        if project_name and module_name and subject and sender_name and sender_pwd and to_address and from_address and mail_content and e_status:
                cur = connection.cursor()
                date = format(datetime.datetime.now()) #set current date time in created date field
                if cur: 
                    cur.execute("insert into asyn_email (project_name,module_name,subject,sender_name,sender_pwd,to_address,from_address,mail_content,mail_status,created_by,created_date,modified_by,modified_date) values (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) returning id",(str(project_name),str(module_name),str(subject),str(sender_name),str(sender_pwd),str(to_address),str(from_address),str(mail_content),str(e_status),int(1),str(date),str(1),str(date)))  
                    values=cur.fetchall()
                    if values: 
                        if values[0][0]:
                            status = 0
                        else:
                            status = 1
                    else:
                        status = 1
                else:
                    status = 1
                cur.close() 
        else:
                status = 1
    except Exception as e:
        status = 1
        print e
    return status 

def communication_asyn_email(project_name,module_name,subject,to_address,mail_content,e_status,sender_name,attachment_path):
    """
        Function to email function call
        @param request:post request
        @return: json data for status of email
        @rtype: json
        @raise e:Unable to insert 
    """ 
    status = 0
    from_address = s.EMAIL_HOST_USER
    sender_pwd = s.EMAIL_HOST_PASSWORD 
    sender_name = sender_name
    try:
        if project_name and module_name and subject and sender_name and sender_pwd and to_address and from_address and mail_content and e_status:
                cur = connection.cursor()
                date = format(datetime.datetime.now()) #set current date time in created date field
                if cur: 
                    cur.execute("insert into asyn_email (project_name,module_name,subject,sender_name,sender_pwd,to_address,from_address,mail_content,mail_status,created_by,created_date,modified_by,modified_date,attachment) values (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) returning id",(str(project_name),str(module_name),str(subject),str(sender_name),str(sender_pwd),str(to_address),str(from_address),str(mail_content),str(e_status),int(1),str(date),str(1),str(date),str(attachment_path)))  
                    values=cur.fetchall()
                    if values:
                        if values[0][0]:
                            status = 0
                        else:
                            status = 1
                    else:
                        status = 1
                else:
                    status = 1
                cur.close()
        else:
                status = 1
    except Exception as e:
        status = 1
        print e
    return status 

def attachment_asyn_email(project_name_title,module_name,subject,to_address,mail_content,e_status,attachment_path,file_name):
    """
        Function to email function call
        @param request:post request
        @return: json data for status of email
        @rtype: json
        @raise e:Unable to insert 
    """ 
    status = 0
    from_address = s.EMAIL_HOST_USER
    sender_pwd = s.EMAIL_HOST_PASSWORD 
    project_name = s.SENDER_NAME
    sender_name = project_name_title
    try:
        if project_name and module_name and subject and sender_name and sender_pwd and to_address and from_address and mail_content and e_status:
                cur = connection.cursor()
                date = format(datetime.datetime.now()) #set current date time in created date field
                if cur: 
                    cur.execute("insert into asyn_email (project_name,module_name,subject,sender_name,sender_pwd,to_address,from_address,mail_content,mail_status,created_by,created_date,modified_by,modified_date,attachment,file_name) values (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) returning id",(str(project_name),str(module_name),str(subject),str(sender_name),str(sender_pwd),str(to_address),str(from_address),str(mail_content),str(e_status),int(1),str(date),str(1),str(date),str(attachment_path),str(file_name)))  
                    values=cur.fetchall()
                    if values:
                        if values[0][0]:
                            status = 0
                        else:
                            status = 1
                    else:
                        status = 1
                else:
                    status = 1
                cur.close()
        else:
                status = 1
    except Exception as e:
        status = 1
        print e
    return status 
