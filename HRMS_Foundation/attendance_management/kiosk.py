from __future__ import unicode_literals
from django.shortcuts import render

import json
from django.views.decorators.csrf import csrf_exempt
from django.http.response import HttpResponse
from CommonLib import query
from django.db import connection
import config
from HRMS_Foundation.attendance_management.models import AttandanceInfo as AI
from CommonLib import query as q
from datetime import datetime
#template render html
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
import logging
import logging.handlers
logger_obj = logging.getLogger('logit')

#Employee kiosk views here
class HrmsKIOSK(TemplateView):
    ''' 
     12-Feb-2018 TRU To Kiosk Employee page loaded. And also check the user authentication
     @param request: Request Object
     @type request : Object
     @return:   HttpResponse or Redirect the another URL
     @author: TRU
     '''
    template_name = "hrms_foundation/attendance_management/kiosk_employee.html"
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HrmsKIOSK, self).dispatch(request, *args, **kwargs)
    
    def get(self, request, *args, **kwargs):
         context = super(HrmsKIOSK, self).get_context_data(**kwargs)
         cur = connection.cursor()  #create the database connection
         cur.execute("""select id,name from organization_info where is_active""")
         organization_info = q.dictfetchall(cur)  
         context['organization_info'] = organization_info #Loading Organization Data         
         return self.render_to_response(context)
     
#Past Attendance Search function here
@csrf_exempt
def hrmsKIOSKEmployeeList(request):
    ''' 
    13-Feb-2018 TRU To HRMS KIOSK Employee List page loaded. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: TRU
    '''
    json_data = {}
    try:
            logger_obj.info('HRMS KIOSK employee list function by'+str(request.user.username))
            cur = connection.cursor()  #create the database connection
            post = request.GET
            company_id = post.get(config.id)  #get table key 
            unit_id = post.get(config.unit_id)  #get table key 
            emp_name = post.get(config.emp_name)  #get table key 
            querys =  q.fetch_hcms_query(config.attendance_management, config.hrms_kiosk_employee_list)  
            if company_id and not unit_id and not emp_name:
                logger_obj.info( "-----------------  Company --------------------")
                query = querys+" and ei.org_id_id=%s"%int(company_id)
                cur.execute(query+" order by ei.name");
                values = q.dictfetchall(cur)
            elif company_id and unit_id and not emp_name:
                logger_obj.info( "----------------- Company & Unit --------------------")
                query = querys+" and ei.org_id_id=%s"%int(company_id)
                query = query+" and ei.org_unit_id_id=%s"%int(unit_id)
                cur.execute(query+" order by ei.name");
                values = q.dictfetchall(cur)
            elif company_id and unit_id and emp_name:
                logger_obj.info( "----------------- Company & Unit & Empl Name  --------------------")
                query = querys+" and ei.name ilike '%"+str(emp_name)+"%'"
                query = query+" and ei.org_id_id=%s"%int(company_id)
                query = query+" and ei.org_unit_id_id=%s"%int(unit_id)
                cur.execute(query+" order by ei.name");
                values = q.dictfetchall(cur)
            elif company_id and emp_name:
                logger_obj.info( "-----------------  Company & Empl Name   --------------------")
                query = querys+" and ei.name ilike '%"+str(emp_name)+"%'"
                query = query+" and ei.org_id_id=%s"%int(company_id)
                cur.execute(query+" order by ei.name");
                values = q.dictfetchall(cur)
            if values:
                     json_data[config.datas] = values
            else:
                     json_data[config.datas] = []
            logger_obj.info('Employee KIOSK list response is'+str(json_data)+"attempted by"+str(request.user.username))          
    except Exception as e:
            logger_obj.error(e)
            json_data[config.datas] = config.error   
    return HttpResponse(json.dumps(json_data))


#KIOSK Employee Event List CRUD function here
@csrf_exempt
def hrmsKIOSKEmployeeEventsList(request):
    ''' 
    13-Feb-2018 TRU To HRMS Employee Event loaded. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: TRU
    '''
    json_data = {}
    try:
            logger_obj.info('HRMS KIOSK employee events list function by'+str(request.user.username))
            post = request.POST
            id = request.POST.get(config.id)   
            aid = request.POST.get(config.aid)   
            org_id = request.POST.get(config.org_ids) 
            uid = request.user.id  
            if not uid:
                uid = 1
            cur = connection.cursor()
            if id and aid and org_id:
                    print "---------------Check OUT---------------",aid,id,datetime.now()
                    status =  AI.objects.filter(id=aid).update(employee_id_id=id,check_out=datetime.now(),modified_by_id=int(uid))
                    json_data[config.results] = config.check_out          
            else:
                querys =  q.fetch_hcms_query(config.attendance_management, config.hrms_kiosk_status_employee_list) 
                cur.execute(querys,(int(id),)) 
                atten_status =  q.dictfetchall(cur)
                if atten_status:
                    json_data[config.results] = config.check_exit         
                else:
                    print "----------------Check IN---------------",id,datetime.now()
                    status =  AI.objects.create(employee_id_id=id,check_in=datetime.now(),is_active="True",org_id_id=org_id,created_by_id=int(uid))
                    status.save()
                    json_data[config.results] = config.check_in   
                logger_obj.info('HRMS KIOSK employee events list response is'+str(json_data)+"attempted by"+str(request.user.username))            
    except Exception as e:
            logger_obj.error(e)
            json_data[config.results] = config.error       
    return HttpResponse(json.dumps(json_data))