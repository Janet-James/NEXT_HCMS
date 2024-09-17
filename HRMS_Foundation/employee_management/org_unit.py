# encoding: utf-8
from __future__ import unicode_literals
from django.shortcuts import render
import json
from django.views.decorators.csrf import csrf_exempt
from django.http.response import HttpResponse
from CommonLib import query 
from django.db import connection
from HRMS_Foundation.organization_management.models import OrganizationInfo,OrganizationUnit
from CommonLib import lib
import org_unit_config as config
import logging
import logging.handlers
from CommonLib.hcms_common import record_validation
from CommonLib.hcms_common import menu_access_control
from CommonLib import query as q
import urllib2
from decimal import Decimal
#template render html
import HCMS.settings as status_keys
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
import HCMS.settings as status_keys 
logger_obj = logging.getLogger('logit')

#organization unit class here
class HRMSOrganizationUnitPage(TemplateView):
    ''' 
    28-May-2018 PAR To HRMS Department  page loaded. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL 
    @author: PAR
    '''
#     template_name = "hrms_foundation/employee_management/employee_list.html"
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HRMSOrganizationUnitPage, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Organization Unit', self.request.user.id)
        if macl:
            template_name = "hrms_foundation/employee_management/org_unit.html" 
        else:
            template_name = "tags/access_denied.html"
        return [template_name]
    
    def get(self, request, *args, **kwargs):
         context = super(HRMSOrganizationUnitPage, self).get_context_data(**kwargs)
         company_result=OrganizationInfo.objects.values('id','name')
         context['data'] = company_result #Loading Organization Data         
         cur = connection.cursor()  #create the database connection
         cur.execute("""select id,name from organization_info where is_active""")
         organization_info = q.dictfetchall(cur)   
         context['organization_info'] = organization_info #Loading Organization Data      
         return self.render_to_response(context)  
def HRMSOrganizationUnit(request): 
    ''' 
    08-Feb-2018 PAR To HRMS Organization unit And also check the user authentication
    @param request: Request Object  
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: PAR  
    '''
    values={}
    cur=lib.db_connection()
    try:
        logger_obj.info('organization unit function by'+str(request.user.username))
        cur.execute("""select ri.id, refitems_name from reference_items  ri inner join reference_item_category rc on ri.refitems_category_id=rc.id where refitem_category_code='OUNTY' and ri.refitems_code != 'ORGNZ' order by ri.id""")
        org_unit=lib.dictfetchall(cur)
        if org_unit:
            values['org_unit']=org_unit
        cur.execute("""select id,name from organization_info where is_active order by id """)
        org=lib.dictfetchall(cur)
        if org_unit:
            values['org']=org    
        logger_obj.info('Organization unit response is'+str(values)+"attempted by"+str(request.user.username)) 
    except Exception as e:
        logger_obj.error(e)
        values['error']=e
    return HttpResponse(json.dumps(values))

@csrf_exempt
def ORGCRUDOpertion(request):
    ''' 
    22-Mar-2018 PAR To Organization unit CRUD operaitons
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse 
    @author: PAR
    '''
    #try:
    logger_obj.info('Organziation unit CRUD function by'+str(request.user.username))
    json_data = {}
    post = request.POST
    cur=lib.db_connection()
    try:
        input_data = request.POST.get(config.datas)
        delete_id = request.POST.get(config.delete_id)
        org_unit_id=request.POST.get(config.org_unit_id)
        uid = request.user.id
        
        if not uid: 
            uid = 1
        update_id = request.POST.get("update_id")
        if input_data: 
            input_data = json.loads(input_data)
            address=str(input_data.get("org_unit_address"))
            if address:
                lat = 0.0
                log = 0.0 
        if input_data and not delete_id and not org_unit_id:
                if not update_id and not org_unit_id :
                       status = OrganizationUnit(address=str(address),latitude=float(lat),longitude=float(log),orgunit_name=input_data.get("org_unit_name"),orgunit_code=input_data.get("org_code"),orgunit_type_id=input_data.get("org_organization_unit_type"),parent_orgunit_type=input_data.get("parent_org_unit_type"),parent_orgunit_id=input_data.get("parent_orgunit_id"),organization_id=input_data.get("organization"),is_active=True,created_by_id=int(uid))
                       status.save()
                       json_data[config.results] = config.add_success
                else:
                       status = OrganizationUnit.objects.filter(id=update_id).update(address=str(address),latitude=float(lat),longitude=float(log),orgunit_name=input_data.get("org_unit_name"),orgunit_code=input_data.get("org_code"),orgunit_type_id=input_data.get("org_organization_unit_type"),parent_orgunit_type=input_data.get("parent_org_unit_type"),parent_orgunit_id=input_data.get("parent_orgunit_id"),organization_id=input_data.get("organization"),is_active=True,created_by_id=int(uid))
                       json_data[config.results] = config.update_success
        elif delete_id:
                referred_record = record_validation('organization_unit_info', delete_id)
                if referred_record:
                    status =  OrganizationUnit.objects.filter(id=delete_id).update(is_active="False",modified_by_id=int(uid))
                    json_data[config.results] = config.delete_success
                else:
                    json_data[config.results] =status_keys.ERR0028
        elif org_unit_id:
            cur.execute(""" 
    select ou.id,ou.orgunit_name,ou.address,ou.orgunit_code,ou.orgunit_type_id,ou.parent_orgunit_type,ou.parent_orgunit_id,fo.orgunit_name as parent_orgunit_name,ou.organization_id from organization_unit_info ou left join 
    (select id,orgunit_name from organization_unit_info) as fo  on ou.parent_orgunit_id=fo.id
    where is_active=true and ou.id=%s
                            """,(org_unit_id,))
            org_unit=lib.dictfetchall(cur)
            json_data[config.results] = org_unit 
        logger_obj.info('Attendance CRUD response is'+str(json_data)+"attempted by"+str(request.user.username))         
    except Exception as e:
                logger_obj.error(e)
                json_data[config.results] =[]
    return HttpResponse(json.dumps(json_data))

@csrf_exempt 
def HRMSOrganizationSearch(request):
    ''' 
    08-Feb-2018 PAR To HRMS Organization Search 
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: PAR
    '''
    values={}
    if request.method =="POST":
        post = request.POST
        parent_org_unit = post.get("parent_org_unit") #
        org_id=post.get("org_id")
        cur=lib.db_connection()
    try:
        logger_obj.info('organization search function by'+str(request.user.username))
        cur.execute("""
            with recursive expression1 as ( select orgunit_name as text,id,parent_orgunit_id as parent  from organization_unit_info  where    orgunit_type_id= %s  and  organization_id= %s and is_active='True' 
        union all
        select   a.orgunit_name,a.id,a.parent_orgunit_id  from organization_unit_info as a  join expression1 on expression1.parent = a.id)
        select  * from expression1 group by text ,id,parent order by  id 
            """,(parent_org_unit,org_id,))
        org_unit=lib.dictfetchall(cur)
        if org_unit:
            values['vals']=org_unit
        logger_obj.info('Organization search response is'+str(values)+"attempted by"+str(request.user.username))     
    except Exception as e:
        logger_obj.error(e)
        values['error']=e
        return HttpResponse(e) 
    return HttpResponse(json.dumps(values)) 

@csrf_exempt 
def HRMSOrgSearch(request):
    ''' 
    08-Feb-2018 PAR To HRMS Organization Search 
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: PAR
    '''
    values={}
    if request.method =="POST":
        cur=lib.db_connection()
        post = request.POST
        parent_org_unit = post.get("parent_org_unit_type") #
        organization_id= post.get("organization") 
        type=post.get("type")
        if type:
            cur.execute("""select  coalesce (max(id+1),0)  as code from organization_unit_info""")
            org_unit_code=lib.dictfetchall(cur)
            if org_unit_code:
                values['code']=org_unit_code
            if str(type)=="all":
                try:
                    logger_obj.info('organization search function by'+str(request.user.username))
                    cur.execute("""
                            with recursive expression1 as ( select orgunit_name as text,orgu.id,orgu.parent_orgunit_id as parent  from organization_unit_info orgu inner join organization_info org on org.id=orgu.organization_id 
                            where org.id=%s and orgu.is_active=True
                            union all
                            select   a.orgunit_name,a.id,a.parent_orgunit_id from organization_unit_info as a  join expression1 on expression1.parent = a.id)
                            select  * from expression1 group by text ,id,parent order by  id   
                                """,(int(organization_id),))
                    org_unit=lib.dictfetchall(cur)
                    if org_unit:
                        values['vals']=org_unit
                    logger_obj.info('Organization search response is'+str(values)+"attempted by"+str(request.user.username))     
                except Exception as e:
                    logger_obj.error(e)
                    values['error']=e
        else:
            values['vals']="Parameter missing"
        
        if str(type)=="chose" and parent_org_unit and organization_id:
                try:
                    logger_obj.info('organization search function by'+str(request.user.username))
                    cur.execute("""
                    with recursive expression1 as ( select orgunit_name as text,orgu.id,orgu.parent_orgunit_id as parent  from organization_unit_info orgu inner join organization_info org on org.id=orgu.organization_id 
                    where   orgu.orgunit_type_id =%s  and org.id=%s and orgu.is_active=True
                    union all
                    select   a.orgunit_name,a.id,a.parent_orgunit_id from organization_unit_info as a  join expression1 on expression1.parent = a.id)
                    select  * from expression1 group by text ,id,parent order by  id  
                        """,(parent_org_unit,organization_id,))
                    org_unit=lib.dictfetchall(cur)
                    if org_unit:
                        values['vals']=org_unit
                    logger_obj.info('Organization search response is'+str(values)+"attempted by"+str(request.user.username))     
                except Exception as e:
                    logger_obj.error(e)
                    values['error']=e
                
        return HttpResponse(json.dumps(values)) 
