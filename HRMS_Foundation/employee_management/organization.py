# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.shortcuts import render

import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.http.response import HttpResponse
from CommonLib import query,lib
from django.db import connection
from CommonLib import query as q
from HRMS_Foundation.organization_management.models import OrganizationInfo,OrganizationUnit
from HCMS_System_Admin.system_admin.models import  Reference_Items

from django_countries import countries
import config
from datetime import datetime, timedelta
#template render html
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from CommonLib.hcms_common import record_validation 
from CommonLib.hcms_common import menu_access_control
from CommonLib.hcms_common import refitem_fetch,refitemlink_fetch
import logging
import logging.handlers
logger_obj = logging.getLogger('logit')
#lat long get here
import urllib2
from decimal import Decimal

# Organization views here
class HRMSOrganization(TemplateView):
    ''' 
    15-Feb-2018 ANT To HRMS Organization page loaded. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: TRU
    '''
   
#     template_name = "hrms_foundation/employee_management/organization.html"  
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HRMSOrganization, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Organization', self.request.user.id)
        if macl:
            template_name = "hrms_foundation/employee_management/organization.html"  
        else:
            template_name = "tags/access_denied.html"
        return [template_name]
    
    def get(self, request, *args, **kwargs):
         context = super(HRMSOrganization, self).get_context_data(**kwargs)
          # Countries
         cur = connection.cursor()
         cur.execute(q.fetch_hcms_query(config.employee_management, config.hrms_country_drop_down))
         res = q.dictfetchall(cur)
         context[config.country_key] = res
         return self.render_to_response(context)
     
#lat log get in api
def latlongGet(loc):
        try:
                if loc:
                    url = 'https://photon.komoot.de/api/?q='+loc
                    req = urllib2.Request(url)#,{'Content_Type': 'application/json'}
                    f = urllib2.urlopen(req)
                    output =f.read()
                    geo_data = json.loads(output)
                    if geo_data:
                        geo_data=geo_data.get("features")
                        if geo_data:
                            coordinates=geo_data[0].get("geometry")
                            coordinates=coordinates["coordinates"]
                            lat=coordinates[1]
                            log=coordinates[0]
                            return {"lat":lat,"log":log}
                    else:
                        return {"lat":"","log":""}
        except Exception as e:
                return {"lat":"","log":""}
            
#organization unit details            
def HRMSSetOrganizationUnit(request,org_name,address,org_id):# Add organization in to organization unit
    ''' 
    12-jun-2018 PAR To HRMS Organization page loaded. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: PAR
    '''
    try:
        json_data = {}
        uid = request.user.id  
        lat = 0.0
        log = 0.0
        code=""
        org_type=178
        cur = connection.cursor()
        cur.execute("""select  coalesce (max(id+1),0)  as code from organization_unit_info""")
        org_unit_code=lib.dictfetchall(cur)
        org_unit_code=org_unit_code[0].get("code")
        if org_unit_code:
              org_unit_code=org_name[0]  
        else:
              org_unit_code='org'
        code=org_name[0]
        for i in  range(0,len(org_name)):
           if org_name[i]==" ":
                code+=org_name[i+1]
        if org_unit_code:
            code=code+"-"+str(org_unit_code)
            org_unit_type = Reference_Items.objects.filter(refitems_code = 'ORGNZ').values('id');
            if org_unit_type[0]['id']:
                status = OrganizationUnit(address=str(address),latitude=float(lat),longitude=float(log),orgunit_name=org_name,orgunit_code=code,orgunit_type_id=int(org_unit_type[0]['id']),parent_orgunit_type=0,parent_orgunit_id=0,organization_id=org_id,is_active=True,created_by_id=int(uid))
                status.save()
                return True
        else:
            return False
    except Exception as e:
        logger_obj.error(e)
        json_data[config.status_key] = e
        return False
           
#organization details here 
def HRMSCRUDOrganization(request): # Organization CRUD views here
    ''' 
    14-Mar-2018 ANT To HRMS Organization page loaded. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: SYA
    '''
    try:
            org_unit_type = Reference_Items.objects.filter(refitems_code = 'ORGNZ').values('id');
            print org_unit_type[0]['id']
            logger_obj.info('Organization CRUD operations function by'+str(request.user.username))
            json_data = {}
            post = request.POST
            data = request.POST.get(config.datas)   
            delete_id = request.POST.get(config.delete_id)   
            uid = request.user.id  
            lat = '' 
            log = ''
            if not uid:
                uid = 1
            organization_id = request.POST.get(config.table_id)   
            if data and not delete_id:
                    data = json.loads(data)   
                    lat = ''
                    log = ''
                    if not organization_id:
#                            status = OrganizationInfo.objects.filter(name__icontains=data[0]['organization_name']).count()
                           cur = connection.cursor() 
                           query=q.fetch_hcms_query(config.employee_management, config.hrms_check_organization_name)
                           cur.execute(query,(data[0]['organization_name'],))
                           status = cur.rowcount
                           if status > 0:
                                   json_data[config.status_key] = config.status_already_exists
                           else:
                                   status = OrganizationInfo(name=data[0]['organization_name'], mobile_number=data[0]['organization_mobile_number'], telephone_number=data[0]['organization_telephone_number'] , 
                                                           email=data[0]['organization_email'], fax=data[0]['organization_fax'],
                                                           address1=data[0]['organization_address1'],address2=data[0]['organization_address2'],website=data[0]['organization_website'],
                                                           logo_id=data[0]['logo_id'],country_id=data[0]['organization_country'],
                                                           legal_name=data[0]['organization_legal_name'],short_name=data[0]['organization_short_name'],state_id=data[0]['organization_state'],
                                                           location=data[0]['organization_location'],pincode=data[0]['organization_pin_code'],
                                                           corporate_identity_number=data[0]['corporate_identity_number'],created_by_id=int(uid),is_active="True")
                                   status.save()
                                   if status.id:
                                       org_unit_res=HRMSSetOrganizationUnit(request,data[0]['organization_name'],data[0]['organization_address1'],status.id)
                                       if org_unit_res:
                                           json_data[config.status_key] = config.success_status
                                       else:
                                           json_data[config.status_key] =config.status_already_exists
                                   else:
                                       json_data[config.status_key] = config.status_already_exists
                    else:
                           status = OrganizationInfo.objects.filter(id=organization_id).update(name=data[0]['organization_name'], mobile_number=data[0]['organization_mobile_number'], telephone_number=data[0]['organization_telephone_number'] , 
                                                                                               email=data[0]['organization_email'], fax=data[0]['organization_fax'],address1=data[0]['organization_address1'],
                                                                                               address2=data[0]['organization_address2'],country_id=data[0]['organization_country'],website=data[0]['organization_website'],logo_id=data[0]['logo_id'],
                                                                                               legal_name=data[0]['organization_legal_name'],short_name=data[0]['organization_short_name'],state_id=data[0]['organization_state'],
                                                                                               location=data[0]['organization_location'],pincode=data[0]['organization_pin_code'],
                                                                                               corporate_identity_number=data[0]['corporate_identity_number'],created_by_id=int(uid),is_active="True",modified_by_id=int(uid))
                           org_unit_status = OrganizationUnit.objects.filter(organization_id = organization_id,parent_orgunit_id = 0).update(orgunit_name=data[0]['organization_name'])
                           json_data[config.status_key] = config.update_status      
            else:
                    referred_record = record_validation('organization_info', delete_id)
                    logger_obj.info( "==================Org Delete Status ====>"+str(referred_record)) 
                    if referred_record:
                        org_unit_status =  OrganizationUnit.objects.filter(organization_id=delete_id).update(is_active="False",modified_by_id=int(uid))
                        org_status =  OrganizationInfo.objects.filter(id=delete_id).update(is_active="False",modified_by_id=int(uid))
                        json_data[config.status_key] = config.remove_status   
                    else:
                        json_data[config.status_key] = 'ERR0028'
            logger_obj.info('Organization CRUD operations response is'+str(json_data)+"attempted by"+str(request.user.username))                       
    except Exception as e:
            logger_obj.error(e)
            json_data[config.status_key] = e
    return HttpResponse(json.dumps(json_data))
   
#organization data details here        
@csrf_exempt
def HRMSOrganizationtable(request): #to show all company related informations in a table
    ''' 
    08-Feb-2018 ANT To HRMS Organization page loaded. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: SYA
    '''
    try:
        logger_obj.info('Organization table function by'+str(request.user.username))
        json_data ={}
        cur = connection.cursor()
        cur.execute(q.fetch_hcms_query(config.employee_management, config.hrms_fetch_organization_details) +" order by org.name")
        res = cur.fetchall()        
        return HttpResponse(json.dumps({'results':res}))
        logger_obj.info('Organization table response is'+str(res)+"attempted by"+str(request.user.username))
    except Exception as e:
        logger_obj.error(e)
        json_data[config.status] = []
    return HttpResponse(json.dumps({'results':json_data}))

#organization table click details here
def HRMSOrganizationtableclick(request): #to show all company related informations in a table
    ''' 
    09-Feb-2018 ANT To HRMS Organization page loaded. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: SYA
    '''
    try:
        logger_obj.info('Organization table click function by'+str(request.user.username))
        json_data ={}
        post = request.POST
        table_id = request.POST.get(config.table_id) 
        cur = connection.cursor()
        query=q.fetch_hcms_query(config.employee_management, config.hrms_organization_row_click)
        cur.execute(query,(table_id,))
        res = dictfetchall(cur)  
        return HttpResponse(json.dumps({'results':res}))
        logger_obj.info('Organization table click response is'+str(res)+"attempted by"+str(request.user.username))
    except Exception as e:
        logger_obj.error(e)
        json_data[config.status] = []
    return HttpResponse(json.dumps({'results':json_data}))

#organization search list function here
def HRMSOrganizationSearchList(request):
    ''' 
    18-May-2018 ANT To HRMS Organization search listing
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: SYA
    '''
    try:
                logger_obj.info('Organization listing function by'+str(request.user.username))
                json_data ={}
                cur = connection.cursor()  #create the database connection
                post = request.GET
                org_name  = post.get(config.org_name)  #get org_name           
                querys =  q.fetch_hcms_query(config.employee_management, config.hrms_fetch_organization_details)  
                if org_name is not '':           
                    logger_obj.info( "-----------------  Company --------------------")
                    query = querys+" and org.name ilike '%"+str(org_name)+"%'"
                    cur.execute(query+" order by org.name");
                    values = cur.fetchall() 
                else:
                    
                    cur.execute(querys+" order by org.name");
                    values = cur.fetchall() 
                if values:
                         json_data[config.results] = values
                else:
                         json_data[config.results] = []
                logger_obj.info('Organization listing response is'+str(json_data)+"attempted by"+str(request.user.username))      
    except Exception as e:
                json_data[config.results] = []   
    return HttpResponse(json.dumps(json_data))


# Reference item link 
@csrf_exempt 
def referenceItemLinkProvince(request):
         ''' 
         24-May-2018 SYA To HRMS Reference item link  Province function
         @param request: Request Object
         @type request : Object
         @return:   HttpResponse Employee Search Data
         @author: SYA
         '''
         json_data = ""    
         try:
             #Loading reference items gender             
             post = request.POST
             country_id = request.POST.get(config.country_id)
             cur = connection.cursor()
             query=q.fetch_hcms_query(config.employee_management, config.hrms_organization_list_province)
             cur.execute(query,(country_id,))
             json_data = dictfetchall(cur)       
         except Exception as e:
             logger_obj.error(e)
             json_data = []
         return HttpResponse(json.dumps(json_data))

#data fetch details here
def dictfetchall(cursor):#Function to fetch all the rows from cursor as a dictionary

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