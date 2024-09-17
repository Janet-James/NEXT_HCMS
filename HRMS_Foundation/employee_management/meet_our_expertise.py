# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.shortcuts import render

import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.http.response import HttpResponse
from django.db import connection
from CommonLib import query as q
from HRMS_Foundation.payroll_management.models import ContributionRegister
from django_countries import countries
import config
from CommonLib.hcms_common import refitem_fetch
from CommonLib.hcms_common import menu_access_control
import HCMS.settings as settting
import pdfkit,os
#template render html
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from CommonLib.hcms_common import record_validation 
import logging
import logging.handlers
import pdfkit
import datetime
logger_obj = logging.getLogger('logit')

# Meet Our Expertise views here
class MeetOurExpertis(TemplateView): # employee page
    ''' 
    22-Dec-2018 TRU to Employee Expertise loaded. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: TRU
    '''
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(MeetOurExpertis, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Meet Our Expertise', self.request.user.id)
        if macl:
             template_name = "hrms_foundation/employee_management/meet_our_expertise.html"
        else:
            template_name = "tags/access_denied.html"
        return [template_name]    
        
   
    def get(self, request, *args, **kwargs):
        context = super(MeetOurExpertis, self).get_context_data(**kwargs)
        cur = connection.cursor()       
        cur.execute("select id,coalesce(name,'')||' '||coalesce(last_name,'') as name from employee_info where is_active order by name");
        employee_list = q.dictfetchall(cur)  
        context['employee_list'] = employee_list #Loading Employee Data     
        return self.render_to_response(context)

#Meet Our Expertise offer list    
def getEmployeeMeetExpertiseList(request):
    ''' 
    22-Dec-2018 TRU To Employee Expertise List page data loaded.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: TRU
    '''
    json_data = {}
    try:
            logger_obj.info('Employee Expertise function by'+str(request.user.username))
            cur = connection.cursor()  #create the database connection
            post = request.GET
            status = post.get('status')  #get table key 
            val = post.get('val')  #get table key 
            querys = '''select ei.id,coalesce(ei.name,'')||' '||coalesce(ei.last_name,'') as name,ai.name as profile,rd.role_title,
                td.name as tname,ei.work_email,coalesce(moe.status,0) as status
                from employee_info ei
                left join hcms_ti_role_details rd on rd.id=ei.role_id_id
                left join attachment_info ai on ai.id = ei.image_id_id
                left join team_details_info td on td.id = ei.team_name_id
                inner join meet_our_expertise moe on moe.emp_id = ei.id
                where ei.is_active'''  
            if status == 'name':
                print "-----not all----",status
                query = querys+" and ei.name ilike '%{}%'".format(str(val))
                cur.execute(query+" order by ei.name");
                values = q.dictfetchall(cur)
            elif status == 'all':
                print "------all---",status
                cur.execute(querys+" order by ei.name");
                values = q.dictfetchall(cur)
            else:
                print "------row---",val
                query = querys+" and ei.id={}".format(int(val))
                cur.execute(query+" order by ei.name");
                values = q.dictfetchall(cur)
            if values:
                     json_data[config.results] = values
            else:
                     json_data[config.results] = []
    except Exception as e:
            print e
            json_data[config.results] = ''
    return HttpResponse(json.dumps(json_data))

#Store Meet Our Expertise function here
def employeeMeetOurExpertiseOperation(request):
    ''' 
    22-Dec-2018 TRU To Employee Expertise List page data loaded.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: TRU
    '''
    json_data = {}
    try:
            logger_obj.info('Employee Expertise listing function by'+str(request.user.username))
            cur = connection.cursor()  #create the database connection
            post = request.POST
            employee_ids = post.get('employee_id').split(',')  #get table key 
            print "-----------",employee_ids
            if employee_ids:
                for id in employee_ids:
                    print "----->",id,post.get('status')
                    cur.execute("select id from meet_our_expertise where emp_id={}".format(int(id)));
                    find_res = cur.fetchall() 
                    if find_res:
                        print id,"-update->",find_res[0][0]
                        cur.execute("update meet_our_expertise set status=%s where emp_id=%s"
                                    ,(int(post.get('status')),int(id)))
                        json_data[config.results] = 'NTE-E02'
                    else:
                        print id,"-add->",id
                        cur.execute("insert into meet_our_expertise (emp_id,status) values (%s,%s)"
                                    ,(int(id),int(post.get('status'))))
                        json_data[config.results] = 'NTE-E01'
    except Exception as e:
            print e
            json_data[config.results] = 'NTE-E03'
            json_data[config.results] = config.error   
    return HttpResponse(json.dumps(json_data))
