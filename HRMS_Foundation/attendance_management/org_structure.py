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
from HRMS_Foundation.employee_management.models import EmployeeInfo as EI

#template render html
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from CommonLib.hcms_common import menu_access_control
import logging
import logging.handlers
logger_obj = logging.getLogger('logit')

#Org structure  views here
class HrmsOrgStructure(TemplateView):
    ''' 
     14-Feb-2018 TRU To Org structure page loaded. And also check the user authentication
     @param request: Request Object
     @type request : Object
     @return:   HttpResponse or Redirect the another URL
     @author: TRU
     '''

#     template_name = "hrms_foundation/attendance_management/org_structure.html"
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HrmsOrgStructure, self).dispatch(request, *args, **kwargs)
       
    def get_template_names(self):
        macl = menu_access_control('Employee Hierarchy', self.request.user.id)
        if macl:
            template_name = "hrms_foundation/attendance_management/org_structure.html"
        else:
            template_name = "tags/access_denied.html"
        return [template_name]
    
    def get(self, request, *args, **kwargs):
         context = super(HrmsOrgStructure, self).get_context_data(**kwargs)
         cur = connection.cursor()  #create the database connection
         cur.execute("""select id,name from organization_info where is_active""")
         organization_info = q.dictfetchall(cur)  
         context['organization_info'] = organization_info #Loading Organization Data         
         return self.render_to_response(context)

#Org unit structure  views here
class HrmsOrgUnitStructure(TemplateView):
    ''' 
     09-Mar-2018 TRU To Org Unit structure page loaded. And also check the user authentication
     @param request: Request Object
     @type request : Object
     @return:   HttpResponse or Redirect the another URL
     @author: TRU
     '''
    template_name = "hrms_foundation/attendance_management/org_unit_structure.html"
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HrmsOrgUnitStructure, self).dispatch(request, *args, **kwargs)
    
    def get(self, request, *args, **kwargs):
         context = super(HrmsOrgUnitStructure, self).get_context_data(**kwargs)
         cur = connection.cursor()  #create the database connection
         cur.execute("""select id,name from organization_info where is_active""")
         organization_info = q.dictfetchall(cur)  
         context['organization_info'] = organization_info #Loading Organization Data         
         return self.render_to_response(context)

#Org structure data get function here
def hrmsOrgtSructureData(request):
    ''' 
    14-Feb-2018 TRU To HRMS Org structure data loaded
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: TRU
    '''
    json_data = {}
    try:
             logger_obj.info('Organization structure data function by'+str(request.user.username))
             cur = connection.cursor()  #create the database connection
             id = request.GET.get(config.id) 
             query =  q.fetch_hcms_query(config.attendance_management, config.hrms_org_struct_list)
             if id:
                 cur.execute(query,(int(id),));
                 values = q.dictfetchall(cur)
                 if values:
                         json_data[config.datas] = values
                 else:
                         json_data[config.datas] = []
                 cur.execute(q.fetch_hcms_query(config.attendance_management, config.hrms_org_employee_list),(int(id),));
                 values = q.dictfetchall(cur)
                 if values:
                     json_data[config.emp] = values
                 else:
                     json_data[config.emp] = []
             logger_obj.info('Organization structure data response is'+str(json_data)+"attempted by"+str(request.user.username))     
    except Exception as e:
            logger_obj.error(e)
            json_data[config.datas] = [] 
    return HttpResponse(json.dumps(json_data))

#Org structure data get function here
def hrmsOrgtSructureUnitData(request):
    ''' 
    28-Feb-2018 TRU To HRMS Org unit structure data loaded
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: TRU
    '''
    json_data = {}
    try:
             logger_obj.info('Organization unit structure data function by'+str(request.user.username))
             cur = connection.cursor()  #create the database connection
             o_id = request.GET.get(config.o_id) 
             ou_id = request.GET.get(config.ou_id) 
             query =  q.fetch_hcms_query(config.attendance_management, config.hrms_org_unit_data_employee_list)
             if id:
                 cur.execute(query,(int(o_id),int(ou_id),));
                 values = q.dictfetchall(cur)
                 if values:
                         json_data[config.datas] = values
                 else:
                         json_data[config.datas] = []
                 cur.execute(q.fetch_hcms_query(config.attendance_management, config.hrms_org_employee_list),(int(o_id),));
                 values = q.dictfetchall(cur)
                 if values:
                     json_data[config.emp] = values
                 else:
                     json_data[config.emp] = []
             logger_obj.info('Organization unit structure data response is'+str(json_data)+"attempted by"+str(request.user.username))     
    except Exception as e:
            logger_obj.error(e)
            json_data[config.datas] = []  
    return HttpResponse(json.dumps(json_data))

#Org unit structure data get function here
def hrmsOrgtUnitSructureData(request):
    ''' 
    28-Feb-2018 TRU To HRMS Org unit structure data loaded
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: TRU
    '''
    json_data = {}
    try:
             logger_obj.info('Organization unit change structure data function by'+str(request.user.username))
             cur = connection.cursor()  #create the database connection
             id = request.GET.get(config.id) 
             query =  q.fetch_hcms_query(config.attendance_management, config.hrms_org_unit_employee_list)
             if id:
                 cur.execute(query,(int(id),));
                 values = q.dictfetchall(cur)
                 if values:
                         json_data[config.datas] = values
                 else:
                         json_data[config.datas] = []
                 # sp potential successor
                 querys = """
                                select 
                                trd.role_title as name,
                                key_role_id as id, 
                                array_to_json(array_agg(coalesce(avg,0))) AS avg,coalesce(round((sum(avg)::float/count(*))/10),0) as tot_avg
                                ,array_to_json(array_agg(coalesce((ei.name||' '||ei.last_name),''))) AS emp_name,0 as parentId
                                FROM sp_key_roles_details rd
                                inner join employee_info ei on ei.id = rd.emp_id
                                inner join hcms_ti_role_details trd on trd.id = rd.key_role_id where ei.org_id_id = %s
                                GROUP BY key_role_id,trd.role_title order by tot_avg desc limit 5  
                 """
                 cur.execute(querys,(int(id),));
                 role_values = q.dictfetchall(cur)
                 json_data['role_values'] = role_values
    except Exception as e:
            logger_obj.error(e)
            json_data[config.datas] = [] 
    return HttpResponse(json.dumps(json_data))

# Attendance CRUD function here
@csrf_exempt
def hrmsOrgCRUDOpertion(request):
    ''' 
    08-Feb-2018 TRU To HRMS Attendance page loaded. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: TRU
    '''
    try:
            logger_obj.info('Organization CRUD function by'+str(request.user.username))
            json_data = {}
            post = request.POST
            input_data = request.POST.get(config.datas)   
            input_data = request.POST.get(config.datas) 
            delete_id = request.POST.get(config.delete_id)   
            uid = request.user.id  
            if not uid:
                uid = 1
            emp_id = request.POST.get(config.update_id)  
            if input_data and not delete_id:
                    input_data = json.loads(input_data)    
                    input_data = input_data['input_data']
                    if input_data:
                           status = EI.objects.filter(id=int(input_data[0]['event_id'])).update(parent_id=str(input_data[0]['poi_id']),home_address=str(input_data[0]['address']),work_email=str(input_data[0]['mail']),work_phone=str(input_data[0]['phone']),is_active="True",modified_by_id=int(uid))
                           json_data[config.results] = config.update_success
            else:
                    status =  EI.objects.filter(id=emp_id).update(is_active="False",modified_by_id=int(uid))
                    json_data[config.results] = config.delete_success    
            logger_obj.info('Organization CRUD response is'+str(json_data)+"attempted by"+str(request.user.username))
    except Exception as e:
            logger_obj.error(e)
            json_data[config.results] = []      
    return HttpResponse(json.dumps(json_data))


#Org unit list function here
def hrmsOrgtUnitListStructure(request):
    ''' 
    07-Mar-2018 TRU To HRMS Org unit List data loaded
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: TRU
    '''
    json_data = {}
    try:
             logger_obj.info('Organization unit List function by'+str(request.user.username))
             org_id = request.GET.get(config.org_id)   
             cur = connection.cursor()  #create the database connection
             query =  q.fetch_hcms_query(config.attendance_management, config.hrms_org_unit_list_strut)
             if query and org_id:
                 cur.execute(query.format(int(org_id)));
                 values = q.dictfetchall(cur)
                 json_data[config.datas] = values
             else:
                 json_data[config.datas] = []
             logger_obj.info('Organization unit structure data response is'+str(json_data)+"attempted by"+str(request.user.username))     
    except Exception as e:
            print e
            logger_obj.error(e)
            json_data[config.datas] = [] 
    return HttpResponse(json.dumps(json_data))