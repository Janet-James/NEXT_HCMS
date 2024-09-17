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
from Talent_Acquisition.talent_acquisition.models import BrandingInfo as TBI
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

# Candidate views here
class TQBranding(TemplateView): 
    ''' 
    04-JULY-2018 SAR To HRMS Candidate page loaded. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: SAR
    ''' 
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(TQBranding, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Organization Branding', self.request.user.id)
        if macl:
             template_name = "talent_acquisition/branding.html"
        else:
            template_name = "tags/access_denied.html"
        return [template_name]    
    def get(self, request, *args, **kwargs): 
         context = super(TQBranding, self).get_context_data(**kwargs)
         cur = connection.cursor()  #create the database connection
         cur.execute(q.fetch_hcms_query(config.attendance_management, config.hrms_org_list));
         org_data = q.dictfetchall(cur)
         context['org'] = org_data
         org_pol_pro = refitem_fetch('POLPR')
         context['org_pol_pro'] = org_pol_pro
         org_standard = refitem_fetch('ORGST')
         context['org_standard'] = org_standard
         return self.render_to_response(context)
    
# branding Data views here
def taBrandingData(request):
         ''' 
         06-July-2018 TRU To HRMS Branding data page loaded. And also check the user authentication
         @param request: Request Object
         @type request : Object
         @return:   HttpResponse or Redirect the another URL
         @author: TRU
         '''
         post = request.POST
         ta_id = post.get(config.ta_id)  #get table key 
         filter_name = post.get(config.filter_name)  #get table key
         cur = connection.cursor()  #create the database connection
         json_data = {}
         try:
             logger_obj.info('Branding data function by'+str(request.user.username)) 
             query =  q.fetch_hcms_query(config.talent_acquisition, config.ta_branding_list)
             if not ta_id and query and filter_name is None:
                 query = query+" order by tbi.name"
                 cur.execute(query);
                 values = cur.fetchall()
             elif filter_name and ta_id is None:
                 query = query+" and tbi.name ilike '%"+str(filter_name)+"%'"
                 cur.execute(query);
                 values = cur.fetchall()
             else:
                 query = query+" and tbi.id=%s"
                 cur.execute(query,(int(ta_id),));
                 values = q.dictfetchall(cur)
             if values:
                 json_data[config.ta_datas] = values
             else:
                 json_data[config.ta_datas] = []
             logger_obj.info('Branding data response is'+str(json_data)+"attempted by"+str(request.user.username))    
         except Exception as e:
              print e
              logger_obj.error(e)
              json_data[config.ta_datas] = []
         cur.close()
         return HttpResponse(json.dumps(json_data))

# Branding CRUD operation 
def taBrandingCrudOperation(request):
    ''' 
    06-July-2018 TRU To HRMS Branding page loaded. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: TRU
    '''
    try:
            logger_obj.info('Branding CRUD function by'+str(request.user.username))
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
                    doc_name = str(str(input_data[0]['branding_doc_name']).strip())+'_BN'+str(randint(10000, 99999))
                    print doc_name,"--------input_data============================--------",input_data
                    if not update_id:
                           print "---------------Insert---------------" 
                           status = TBI(name = str(input_data[0]['branding_name']),policy_procedure_id = int(input_data[0]['branding_org_polpro']),standard_id = int(input_data[0]['branding_org_standard']),doc_name=doc_name,description = str(input_data[0]['branding_description']),doc_id = int(input_data[0]['attachment_id']) ,org_id = int(input_data[0]['branding_org_name']),is_active = "True",created_by_id = int(uid))
                           status.save()
                           json_data[config.results] = config.add_success
                    else:
                           name = str(input_data[0]['branding_doc_name']).strip();
                           results = TBI.objects.filter(id = update_id,doc_name = str(name)).values('doc_name');
                           if results:
                               doc_name = str(results[0]['doc_name'])
                           print "---------------Update---------------",update_id,doc_name
                           status = TBI.objects.filter(id = update_id).update(name = str(input_data[0]['branding_name']),policy_procedure_id = int(input_data[0]['branding_org_polpro']),standard_id = int(input_data[0]['branding_org_standard']),doc_name=doc_name,description = str(input_data[0]['branding_description']),doc_id = int(input_data[0]['attachment_id']) ,org_id = int(input_data[0]['branding_org_name']),is_active = "True",modified_by_id = int(uid))
                           json_data[config.results] = config.update_success
            else:
                    print "---------------Delete---------------",delete_id
                    referred_record = record_validation('ta_branding_info', int(delete_id))
                    logger_obj.info( "==================Branding List Delete Status ====>"+str(referred_record) )
                    if referred_record:
                        status =  TBI.objects.filter(id=delete_id).update(is_active="False",modified_by_id=int(uid))
                        json_data[config.results] = config.delete_success   
                    else:
                        json_data[config.results] = 'ERR0028'  
            logger_obj.info('Attendance CRUD response is'+str(json_data)+"attempted by"+str(request.user.username))         
    except Exception as e:
            print e
            logger_obj.error(e)
            json_data[config.results] = config.error       
    return HttpResponse(json.dumps(json_data))