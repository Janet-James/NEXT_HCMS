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
from CommonLib.hcms_common import menu_access_control
from datetime import datetime
#template render html
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
import logging
import logging.handlers
logger_obj = logging.getLogger('logit')

#Employee List views here
class HrmsEmployeeList(TemplateView):
    ''' 
     14-Feb-2018 TRU To Employee List page loaded. And also check the user authentication
     @param request: Request Object
     @type request : Object
     @return:   HttpResponse or Redirect the another URL
     @author: TRU
     '''
#     template_name = "hrms_foundation/employee_management/employee_list.html"
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HrmsEmployeeList, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Employee List', self.request.user.id)
        if macl:
            template_name = "hrms_foundation/employee_management/employee_list.html"
        else:
            template_name = "tags/access_denied.html"
        return [template_name]
    
    def get(self, request, *args, **kwargs):
         context = super(HrmsEmployeeList, self).get_context_data(**kwargs)
         cur = connection.cursor()  #create the database connection
         cur.execute("""select id,name from organization_info where is_active""")
         organization_info = q.dictfetchall(cur)  
         context['organization_info'] = organization_info #Loading Organization Data         
         return self.render_to_response(context)
     
#Employee List Search function here
@csrf_exempt
def hrmsKIOSKEmployeeList(request):
    ''' 
    14-Feb-2018 TRU To Employee List page data loaded.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: TRU
    '''
    json_data = {}
    try:
            logger_obj.info('Employee listing function by'+str(request.user.username))
            cur = connection.cursor()  #create the database connection
            post = request.GET
            company_id = post.get(config.id)  #get table key 
            unit_id = post.get(config.unit_id)  #get table key 
            emp_name = post.get(config.emp_name)  #get table key 
            emp_status = post.get('status')
            if emp_status == 'active':
                 emp_status = 'ei.is_active'
            else:
                 emp_status = 'ei.is_active=false'
            querys =  q.fetch_hcms_query(config.employee_management, config.hrms_employee_list) 
            querys =  querys+emp_status
            print "---------------------",querys
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
                     json_data[config.results] = values
            else:
                     json_data[config.results] = []
            logger_obj.info('Employee listing response is'+str(json_data)+"attempted by"+str(request.user.username))      
    except Exception as e:
            print e
            json_data[config.results] = config.error   
    return HttpResponse(json.dumps(json_data))
