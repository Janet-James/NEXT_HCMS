from __future__ import unicode_literals
from django.shortcuts import render,render_to_response
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from django.db import connection
import json
import re
import datetime
from django.core.cache import cache

def permission(user_id,role_id,permission_code): #common create controller to create records in table
    json_result={}
    try:
        if user_id and role_id and permission_code:
            cr=connection.cursor() #create database connection
            if cr:
                cr.execute("""select * from auth_user au
                        inner join role rl on rl.id=au.role_id
                        inner join role_permission_rel rpr on rl.id=rpr.role_id
                    inner join auth_role_permission arp on arp.id=rpr.permission_id
                    where au.id=%s and rl.id=%s and arp.code ilike '%s' """%(user_id,role_id,permission_code,))
                res = cr.fetchall()
                if res:
                    json_result['status'] =  'access afforded'
                    json_result['id'] = 1
                else:
                    json_result['status'] =  'access denied'
                    json_result['id'] = 0
                connection.commit()
                cr.close()
            else:
                json_result['status'] =  'Connection failed'
        else:
            json_result['status'] = "perameter missing"
    except Exception as e:  
         json_result['status']=e
    return json_result

