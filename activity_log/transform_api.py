# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.db import connection
from django.http import HttpResponse
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
import json

# Create your views here.

def user_table(request): #to show all communication medium related informations in a table
    """
        Function to show display  User details in a table
        @param request:post request
        @return: JSON data contains all User related informations
        @rtype: JSON
        @raise e:Unable to fetch User details or unable to create a database connection 
    """
    try:
        post = request.GET #get post data from request
        flag = post.get('flag') #API call
        if flag:
            try:
                post = request.GET #get post data from request
                user_id_list = post.get('user_id_list')  #get user id list 
                cr = connection.cursor()  #create the database connection
                json_datas = {}
                if cr:
                    if user_id_list: #fetch single record in table
                        if int(flag) == 1:
                            cr.execute("""SELECT usr.id, usr.username AS user_name, usr.email AS email_id, role.role_title AS user_role, ei.name AS employee_name, 
                                            ai.name AS image
                                            FROM auth_user AS usr 
                                            INNER JOIN hcms_ti_role_details AS role ON role.id = usr.role_id AND role.is_active
                                            INNER JOIN employee_info AS ei ON ei.related_user_id_id = usr.id AND ei.is_active
                                            INNER JOIN attachment_info AS ai ON ai.id = ei.image_id_id AND ai.is_active
                                            WHERE usr.id IN %s AND usr.is_active""",(tuple(json.loads(user_id_list)),))
                        elif int(flag) == 2:
                            cr.execute("""SELECT usr.id, usr.username AS user_name, usr.email AS email_id, role.role_title AS user_role, ei.name AS employee_name, 
                                            ai.name AS image
                                            FROM auth_user AS usr 
                                            INNER JOIN hcms_ti_role_details AS role ON role.id = usr.role_id AND role.is_active
                                            INNER JOIN employee_info AS ei ON ei.related_user_id_id = usr.id AND ei.is_active
                                            INNER JOIN attachment_info AS ai ON ai.id = ei.image_id_id AND ai.is_active
                                            WHERE usr.id NOT IN %s AND usr.is_active""",(tuple(json.loads(user_id_list)),))
                        res = dictfetchall(cr) #fetch the result as dictionary
                        json_datas['datas'] = res
                        if res:
                            json_datas['status'] = 'pass'
                        else:
                            json_datas['status'] = 'No data Found'
                    connection.commit() #commit the database
                    cr.close() #close the connection
                else:
                    json_datas['status'] = 'fail'
                    json_datas['datas'] = [] 
            except Exception as e:
                json_datas['status'] = 'Invalid Format of Data'
                json_datas['datas'] = [] 
            return HttpResponse(json.dumps(json_datas)) #return response
              
        else:
            table_id = post.get('table_id')  #get table id 
            cr = connection.cursor()  #create the database connection
            if cr:
                if table_id: #fetch single record in table
                    cr.execute("""SELECT STRING_AGG(hr.id::varchar, ',') AS  group_ids, usr.id, row_number() OVER(), usr.email, usr.username, usr.first_name,
                                    usr.last_name, usr.is_active, r.id AS role 
                                    FROM auth_user AS usr 
                                    LEFT JOIN hcms_ti_role_details AS r ON r.id = usr.role_id AND r.is_active
                                    LEFT JOIN hcms_role AS hr ON hr.id = usr.group_id AND hr.is_active
                                    WHERE usr.id = %s AND usr.is_active
                                    GROUP BY usr.id,r.id""",(table_id,))
                else: #fetch all records in table
                    cr.execute("""SELECT STRING_AGG(hr.name, ', ') AS group_name, usr.id, row_number() OVER(), usr.email, usr.username, usr.first_name,
                                    usr.last_name, usr.is_active, r.role_title AS role FROM auth_user AS usr 
                                    LEFT JOIN hcms_ti_role_details AS r ON r.id = usr.role_id AND r.is_active 
                                    LEFT JOIN hcms_role AS hr ON hr.id = usr.group_id AND hr.is_active
                                    WHERE usr.is_active  GROUP BY usr.id,r.role_title ORDER BY email""")
                res = dictfetchall(cr) #fetch the result as dictionary
                connection.commit() #commit the database
                cr.close() #close the connection
            else:
                res = 'unable to create a connection' #raise an exception if unable to fetch communication medium details from table
            return HttpResponse(json.dumps(res)) #return response
    except Exception as e:
        res = {}
        res = 'Invalid Format'
        return HttpResponse(json.dumps(res)) #return response
    
#API Changes 13-02-2019 START
@csrf_exempt 
def team_details(request):
    post = request.POST
    cur = connection.cursor()
    json_data = {}
    try:
        post = request.POST
        data_value = post.get("datas") # Get JSON data from key value
        post = json.loads(request.body)
        data = post.get("datas") # Get JSON data from key value
        if data[0]['flag'] == 0:
            cur.execute("SELECT id, name AS description FROM team_details_info WHERE is_active GROUP BY id, name")
        elif data[0]['flag'] == 1:
            cur.execute("""SELECT au.id AS user_id, el.id AS emp_id,el.name, ht.id AS team_id, ht.name AS description 
                                FROM employee_info AS el
                                LEFT JOIN team_details_info AS ht ON ht.id=el.team_name_id 
                                INNER JOIN auth_user au ON au.id=el.related_user_id_id and au.is_active
                                WHERE ht.id=%s
                                ORDER BY el.name asc""",(int(data[0]['team_id']),))
        elif data[0]['flag'] == 2:
            cur.execute("""SELECT au.id AS user_id, el.id AS emp_id,el.name, ht.id AS team_id, ht.name AS description 
                                FROM employee_info AS el
                                LEFT JOIN team_details_info AS ht ON ht.id=el.team_name_id 
                                INNER JOIN auth_user au ON au.id=el.related_user_id_id and au.is_active
                                WHERE ht.id IN %s
                                ORDER BY ht.id, el.name asc""",(tuple(data[0]['team_id']),))
        datas = dictfetchall(cur)
        json_data['datas'] = datas
        if datas:
            json_data['status'] = 'ok'
        else:
            json_data['status'] = 'No Data Found'
    except Exception as e:
        json_data['status'] = 'Exception Error!!!'
    return HttpResponse(json.dumps(json_data)) 

#Returns all rows from a cursor as a dictionary
def dictfetchall(cursor):
    "Returns all rows from a cursor as a dictionary."
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