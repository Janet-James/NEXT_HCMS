# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.http import HttpResponse
from django.db import connection
import json 
import datetime
import requests
from django.views.decorators.csrf import csrf_exempt,csrf_protect
"""
To manage all Asynchronous Emails
@author: Thirumanikandan G
@version: 1.0
@project: P5S
"""        
#Asynchronous email send function here
def asyn_email(project_name,subject,sender_name,to_address,from_address,mail_content,e_status):
            """
                Function to email function call
                @param request:post request
                @return: json data for status of email
                @rtype: json
                @raise e:Unable to insert
            """
            status = 0
            try:
                if project_name and subject and sender_name and to_address and from_address and mail_content and e_status:
                        cur = connection.cursor()
                        date = format(datetime.datetime.now()) #set current date time in created date field
                        if cur: 
                            cur.execute("insert into asyn_email (project_name,subject,sender_name,to_address,from_address,mail_content,mail_status,created_by,created_date,modified_by,modified_date) values (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) returning id",(str(project_name),str(subject),str(sender_name),str(to_address),str(from_address),str(mail_content),str(e_status),int(1),str(date),str(1),str(date)))  
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
    
# AsynchronousEmail functions
@csrf_exempt
def mail(request):
            """
                Function to email function call
                @param request:post request
                @return: json data for status of email
                @rtype: json
                @raise e:Unable to insert
            """
            jons_result = {}
            try:
                if request.method == "GET":
                    status = asyn_email("Attain",'Welcome Address !!!','Sarmila Bhoominathan','sarmila.bhoominathan@nexttechnosolutions.com','servicedesktest@nexttechnosolutions.co.in','This Sample Email API','waiting')
                    if status == 0:
                        jons_result['flag'] = 0
                        jons_result['datas'] = "Mail Data Inserted"
                    else:
                        jons_result['flag'] = 1
                        jons_result['datas'] = 'Something Problem ! Please Try After Sometime!!!'
            except Exception as e:
                    jons_result['flag'] = 2
                    jons_result['datas'] = 'Server Error!!!'
            return HttpResponse(json.dumps(jons_result))  
                
