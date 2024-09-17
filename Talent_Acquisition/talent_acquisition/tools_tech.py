# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.shortcuts import render

import json
from django.views.decorators.csrf import csrf_exempt
from django.http.response import HttpResponse
from CommonLib import query
from django.db import connection
from CommonLib import query as q
import config
from Talent_Acquisition.talent_acquisition.models import ToolsTechInfo as TTI
#template render html
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from CommonLib.hcms_common import refitem_fetch,refitemlink_fetch
from CommonLib.hcms_common import record_validation
from CommonLib.hcms_common import menu_access_control
from django_countries import countries
import logging
import logging.handlers
import datetime
from random import randint
logger_obj = logging.getLogger('logit')

# Tools & Tech views here
class TQToolsTech(TemplateView): 
    ''' 
    09-JULY-2018 SAR To Talent Acquisition page loaded. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: TRU
    '''
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(TQToolsTech, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Tools & Technology', self.request.user.id)
        if macl:
             template_name = "talent_acquisition/tools_tech.html"
        else:
            template_name = "tags/access_denied.html"
        return [template_name]    
        
   
    def get(self, request, *args, **kwargs):
         context = super(TQToolsTech, self).get_context_data(**kwargs)
         cur = connection.cursor()  #create the database connection
         cur.execute(q.fetch_hcms_query(config.attendance_management, config.hrms_org_list));
         org_data = q.dictfetchall(cur)
         res = refitem_fetch('TATS1')
         context['org'] = org_data
         context['tools_type'] = res
         return self.render_to_response(context)
 
#Tools and Tech datas function here
def taToolsTechData(request):
        ''' 
        09-July-2018 TRU To Tools Tech data page loaded. And also check the user authentication
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
        @author: TRU
        '''
        post = request.POST
        ta_id = post.get(config.ta_id)  #get table key 
        cur = connection.cursor()  #create the database connection
        json_data = {}
        try:
            logger_obj.info('Tools & Tech data function by'+str(request.user.username)) 
            query =  q.fetch_hcms_query(config.talent_acquisition, config.ta_tt_list)
            if not ta_id and query:
                query = query+" order by tti.name"
                cur.execute(query);
                values = cur.fetchall()
                if values:
                    json_data[config.ta_datas] = values
                else:
                    json_data[config.ta_datas] = []
            else:
                query = query+" and tti.id=%s"
                cur.execute(query,(int(ta_id),));
                values = q.dictfetchall(cur)
                if values:
                    json_data[config.ta_datas] = values
                else:
                    json_data[config.ta_datas] = []
                logger_obj.info('Tools & Tech data response is'+str(json_data)+"attempted by"+str(request.user.username))    
        except Exception as e:
             print e
             logger_obj.error(e)
             json_data[config.ta_datas] = []
        cur.close()
        return HttpResponse(json.dumps(json_data))

#Tools and Tech CRUD operation 
def taToolsTechCrudOperation(request):
    ''' 
    06-July-2018 TRU To Tools Tech page loaded. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: TRU
    '''
    try:
            logger_obj.info('Tools Tech CRUD function by'+str(request.user.username))
            json_data = {}
            post = request.POST
            input_data = request.POST.get(config.ta_results)   
            update_id = request.POST.get(config.ta_update_id)  
            delete_id = request.POST.get(config.ta_delete_id)   
            uid = request.user.id
            if not uid:
                uid = 1
            if input_data and not delete_id:
                    input_data = json.loads(input_data)    
                    input_data = input_data['input_data']
                    print "--------input_data============================--------",input_data,"----------",input_data[0]['tt_name']
                    if not update_id:
                           print "---------------Insert---------------"
                           status = TTI(name = str(input_data[0]['tt_name']),description = str(input_data[0]['tt_description']),api = str(input_data[0]['tt_api']),org_id = int(input_data[0]['tt_org_id']) ,type_id = int(input_data[0]['tt_type_id']),is_active = "True",created_by_id = int(uid))
                           status.save()
                           print status.id
                           json_data[config.results] = config.add_success
                    else:
                           print "---------------Update---------------",update_id
                           status = TTI.objects.filter(id = update_id).update(name = str(input_data[0]['tt_name']),description = str(input_data[0]['tt_description']),api = str(input_data[0]['tt_api']),org_id = int(input_data[0]['tt_org_id']) ,type_id = int(input_data[0]['tt_type_id']),is_active = "True",modified_by_id = int(uid))
                           json_data[config.results] = config.update_success
            else:
                    print "---------------Delete---------------",delete_id
                    referred_record = record_validation('ta_tools_tech_info', int(delete_id))
                    logger_obj.info( "==================Tools Tech List Delete Status ====>"+str(referred_record) )
                    if referred_record:
                        status =  TTI.objects.filter(id=delete_id).update(is_active="False",modified_by_id=int(uid))
                        json_data[config.results] = config.delete_success   
                    else:
                        json_data[config.results] = 'ERR0028'  
            logger_obj.info(' Tools Tech CRUD response is'+str(json_data)+"attempted by"+str(request.user.username))         
    except Exception as e:
            print "=============>",e
            logger_obj.error(e)
            json_data[config.results] = config.error       
    return HttpResponse(json.dumps(json_data))