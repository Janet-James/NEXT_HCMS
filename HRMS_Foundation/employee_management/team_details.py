# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.shortcuts import render
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.http.response import HttpResponse
from django.db import connection
from CommonLib import query as q,lib
from HRMS_Foundation.organization_management.models import TeamDetails,OrganizationInfo
from django_countries import countries
import team_config as config
from CommonLib.hcms_common import record_validation
from datetime import datetime, timedelta
from CommonLib.hcms_common import menu_access_control
#template render html
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
import logging
import logging.handlers
logger_obj = logging.getLogger('logit')

# HRMSTeamDetails views here
class HRMSTeamDetails(TemplateView):
    ''' 
    13-March-2018 PAR To HRMS Team details page loaded And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: PAR
    '''
#     template_name = "hrms_foundation/employee_management/team_details.html"
      
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HRMSTeamDetails, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Division', self.request.user.id)
        if macl: 
            template_name = "hrms_foundation/employee_management/team_details.html"
        else:
            template_name = "tags/access_denied.html"
        return [template_name]
    
    def get(self, request, *args, **kwargs):
         context = super(HRMSTeamDetails, self).get_context_data(**kwargs)
         context[config.country_key] = countries
         company_result = OrganizationInfo.objects.filter(is_active=True).values('id','name');
         if company_result:
             context[config.data]=company_result
         return self.render_to_response(context)
     
@csrf_exempt
def HRMSCRUDTeam(request): # Team CRUD views here
    ''' 
    13-March-2018 PAR To HRMS Team details CRUD operaion  
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: PAR
    '''
    try:
        logger_obj.info('Team deatails CRUD operations function by'+str(request.user.username))
        json_data = {}
        post = request.POST
        data = request.POST.get(config.datas)   
        delete_id = request.POST.get(config.delete_id)   
        uid = request.user.id  
        if not uid:
            uid = 1
        team_id= request.POST.get(config.table_id)   
        if data and not delete_id:
                data = json.loads(data)    
                if not team_id:
                    data_status = TeamDetails.objects.filter(org_id=data[0]['organization'],org_unit_id=data[0]['org_unit_id'],name__icontains=data[0]['team_name']).count()
                    if data_status != 0:
                        json_data[config.status_key] = 'EARE'
                    else:
                       status = TeamDetails(org_id=data[0]['organization'],org_unit_id=data[0]['org_unit_id'],name=data[0]['team_name'],code=data[0]['team_code'],description=data[0]['team_description'],is_active=True,created_by_id=int(uid))#modified_by_id=int(uid)
                       status.save()
                       json_data[config.status_key] = config.success_status
                else:
                           status = TeamDetails.objects.filter(id=team_id).update(org_id=data[0]['organization'],org_unit_id=data[0]['org_unit_id'],name=data[0]['team_name'],code=data[0]['team_code'],description=data[0]['team_description'],is_active=True,modified_by_id=int(uid))#
                           json_data[config.status_key] = config.update_status 
        else:
                referred_record = record_validation('team_details_info', delete_id)
                if referred_record:
                    status =  TeamDetails.objects.filter(id=delete_id).update(is_active="False",modified_by_id=int(uid))
                    json_data[config.status_key] = config.remove_status
                else:
                    json_data[config.results] =status_keys.ERR0028        
        logger_obj.info('Team Details CRUD operations response is'+str(json_data)+"attempted by"+str(request.user.username))                       
    except Exception as e:
        logger_obj.error(e)
        json_data[config.status_key] = e
    return HttpResponse(json.dumps(json_data))

@csrf_exempt
def HRMSTeamtable(request): #to show all Team related informations in a table
    ''' 
    13-March-2018 PAR To HRMS to show all Team related informations in a table
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: PAR
    '''
    try:
        logger_obj.info('Team table function by'+str(request.user.username))
        post = request.POST
        value=post.get('value')
        json_data ={}
        cur = connection.cursor()
        team_query=q.fetch_hcms_query(config.employee_management, config.hrms_fetch_team_details)
        
        if not value:
            query=team_query.format("")
        elif value:
            param="and td.name ilike '%"+value+"%'"
            query=team_query.format(param)
        cur.execute(query)
        res = cur.fetchall()
        if res:
            json_data['value']=res
        cur.execute("""select MAX(id) as code from team_details_info """)
        team_code=lib.dictfetchall(cur)
        if team_code:
            json_data['code']=team_code
        return HttpResponse(json.dumps({'results':json_data}))
        logger_obj.info('Team table response is'+str(res)+"attempted by"+str(request.user.username))
    except Exception as e:
        logger_obj.error(e)
        json_data[config.status] = []
    return HttpResponse(json.dumps({'results':json_data}))

#table row click function here
@csrf_exempt
def HRMSTeamtableclick(request):
    ''' 
    13-March-2018 PAR To HRMS Team details rowclick
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: PAR
    '''
    try:
        logger_obj.info('Team table click function by'+str(request.user.username))
        json_data ={}
        post = request.POST
        table_id = request.POST.get(config.table_id) 
        cur = connection.cursor()
        query=q.fetch_hcms_query(config.employee_management, config.hrms_fetch_team_details_rowclick)
        cur.execute(query,(table_id,))
        res = cur.fetchall()
        return HttpResponse(json.dumps({'results':res}))
        logger_obj.info('Team table click response is'+str(res)+"attempted by"+str(request.user.username))
    except Exception as e:
        logger_obj.error(e)
        json_data[config.status] = []
    return HttpResponse(json.dumps({'results':json_data}))

#get team id function here
@csrf_exempt
def HRMSGetTeamId(request):
    ''' 
    03-May-2018 PAR To HRMS Team details get max id
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: PAR
    '''
    try:
        print "===================================team"
        logger_obj.info('Team table click function by'+str(request.user.username))
        json_data ={}
        post = request.POST      
        cur = connection.cursor()
        query=q.fetch_hcms_query(config.employee_management, config.hrms_fetch_team_details_max_id)
        cur.execute(query)
        res = lib.dictfetchall(cur)
        print "==================res",res
        return HttpResponse(json.dumps({'results':res}))
        logger_obj.info('Team table click response is'+str(res)+"attempted by"+str(request.user.username))
    except Exception as e:
        logger_obj.error(e)
        json_data[config.status] = []
    return HttpResponse(json.dumps({'results':json_data}))

