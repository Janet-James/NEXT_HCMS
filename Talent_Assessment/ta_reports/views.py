from __future__ import unicode_literals
from django.shortcuts import render

# Create your views here.
import json
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from CommonLib.common_controller import dictfetchall
from django.db import connection
from django.views.decorators.csrf import csrf_exempt
from django.http.response import HttpResponse
import datetime
import config as c
from CommonLib import query
import logging
import logging.handlers
from ast import literal_eval
logger_obj = logging.getLogger('logit')

class HCMSTalentAssessmentReportView(TemplateView):
    ''' 
    09-Feb-2018 || JAN || To load HCMS Talent assessment Reports page
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''

    template_name = "talent_assessment/ta_reports.html"
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HCMSTalentAssessmentReportView, self).dispatch(request, *args, **kwargs)
    
    def get(self, request, *args, **kwargs):
        cur=connection.cursor() 
        context = super(HCMSTalentAssessmentReportView, self).get_context_data(**kwargs)
        try:
            icon_name = ['nf nf-employee-portal','nf nf-attendane-1','nf nf-leave-days']
            cur.execute(query.fetch_hcms_query(c.ta_report, c.ta_reports_entity_info_fetch))
            result_value = dictfetchall(cur)
            count = 0;
            for i in result_value:
                result_value[count]['icon_name'] = icon_name[count]
                count = count+1;
            context[c.report_entity] = result_value
            logger_obj.info("Entity Data for the Report "+ str(context) +" attempted by "+str(request.user.username))
        except Exception as e:
            context[c.report_entity] = e
            logger_obj.info("Entity Data for the Report  result in exception as "+ str(e) +" attempted by "+str(request.user.username))
        cur.close()
        return self.render_to_response(context)

@csrf_exempt    
def report_filter_type_fetch(request):
    ''' 
    14-Feb-2018 || SND || To load the field type for the respective field Name
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse to return the field type for the respective field Name
    @author: SND
    '''  
    json_datas = {}
    report_entity_id = request.GET.get(c.filter_type_id)
    cur=connection.cursor() 
    try:
        cur.execute(query.fetch_hcms_query(c.ta_report, c.dynamic_field_data).format(report_entity_id))
        report_filter_type = dictfetchall(cur)
        json_datas[c.report_filter_type] = report_filter_type
        json_datas['status']='0'
        logger_obj.info("Field type Data for the respective field Name "+ str(json_datas) +" attempted by "+str(request.user.username))
    except Exception as e:
        json_datas[c.report_filter_type] = e
        json_datas['status']='1'
        logger_obj.info("Field type Data for the respective field Name result in exception as "+ str(e) +" attempted by "+str(request.user.username))
    cur.close()
    return HttpResponse(json.dumps(json_datas))

@csrf_exempt    
def report_filter_employee_type(request):
    ''' 
    16-Feb-2018 || SND || To load the employee type field 
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse to return the employee type field 
    @author: SND
    '''  
    json_datas = {}
    employee_type = request.GET.get(c.emp_type)
    cur=connection.cursor() 
    try:
        cur.execute(query.fetch_hcms_query(c.ta_report, c.reference_item_data_fetch).format(employee_type))
        employee_type = dictfetchall(cur)
        json_datas[c.return_employee_type] = employee_type
        json_datas['status']='0'
        logger_obj.info("The Searched Data of employee type "+ str(json_datas) +" attempted by "+str(request.user.username))
    except Exception as e:
            json_datas[c.return_employee_type] = e
            json_datas['status']='1'
            logger_obj.info("The Searched Data of employee type result in exception as "+ str(e) +" attempted by "+str(request.user.username))
    cur.close()
    return HttpResponse(json.dumps(json_datas))

def report_role_search(request):
    ''' 
    20-Feb-2018 || SND || To load the role type field 
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse to return the role type field 
    @author: SND
    '''  
    json_datas = {}
    role_name = request.GET.get(c.role_name)
    cur=connection.cursor() 
    try:
        cur.execute(query.fetch_hcms_query(c.ta_report, c.role_search_data_fetch).format(role_name))
        role_data = cur.fetchall()
        json_datas[c.role_data] = role_data
        json_datas['status']='0'
        logger_obj.info("The Searched Data of Role "+ str(json_datas) +" attempted by "+str(request.user.username))
    except Exception as e:
        json_datas[c.role_data] = e
        json_datas['status']='1'
        logger_obj.info("The Searched Data of Role result in exception as "+ str(e) +" attempted by "+str(request.user.username))
    cur.close()
    return HttpResponse(json.dumps(json_datas))

def report_schedule_datatable(request):
    ''' 
         20-Feb-2018 SND Report Schedule Search Data
         @param request: Request Object
         @type request : Object
         @return:   HttpResponse Report Schedule Search Data
         @author: SND
    '''
    json_datas = {}
    cur=connection.cursor()  #create the database connection
    post = request.GET
    employee_id_dict = post.get(c.employee_id)  #get table key
    employee_type_id = post.get(c.employee_type) #get table key 
    assessment_category_id = post.get(c.assessment_category)  #get table key 
    cycle_starts = post.get(c.From)  #get table key 
    cycle_ends = post.get(c.To)  #get table key 
    try:
        if employee_id_dict or employee_type_id or assessment_category_id or cycle_starts or cycle_ends:
            query =  """select distinct htas.assessment_schedule_name, ri.refitems_name,rit.refitems_name, to_char(htas.assessment_schedule_cycle_starts,'dd-Mon-YY')as cycle_starts,to_char(htas.assessment_schedule_cycle_ends,'dd-Mon-YY')as cycle_ends from hcms_ta_assessment_schedule_details htasd inner join hcms_ta_assessment_schedule htas on htas.id = htasd.assessment_schedule_id inner join employee_info ei on ei.id = htasd.assessment_schedule_employee_id
                        inner join reference_items ri on ri.id = htas.assessment_schedule_employee_type_id inner join reference_items rit  on rit.id = htas.assessment_schedule_assessment_category_refitem_id
                        """
            conditions = " where ri.is_active = true and rit.is_active = true and htasd.is_active = true and htas.is_active = true and"
            if employee_id_dict != c.null and employee_id_dict != None:
                employee_id = json.loads(employee_id_dict)
                employee_id_res = [str(n) for n in employee_id]
                if(len(employee_id_res)==1):
                    conditions = conditions+" htasd.assessment_schedule_employee_id = "+employee_id_res[0]+" and"
                else:
                    conditions = conditions+" htasd.assessment_schedule_employee_id in "+str(tuple(employee_id_res))+" and"
                
            if employee_type_id != c.null and employee_type_id != None:
                conditions = conditions+" htas.assessment_schedule_employee_type_id = "+employee_type_id+" and"
            if assessment_category_id != c.null and assessment_category_id != None:
                conditions = conditions+" htas.assessment_schedule_assessment_category_refitem_id =  "+assessment_category_id+" and"
            if cycle_starts != c.null and cycle_starts != None:
                cycle_start = datetime.datetime.strptime(cycle_starts, '%d-%m-%Y').strftime('%Y-%m-%d')
                conditions = conditions+" htas.assessment_schedule_cycle_starts = '"+cycle_start+"' and"
            if cycle_ends != c.null and cycle_ends != None:
                cycle_end = datetime.datetime.strptime(cycle_ends, '%d-%m-%Y').strftime('%Y-%m-%d')
                conditions = conditions+" htas.assessment_schedule_cycle_ends = '"+cycle_end+"' and"
            conditions = conditions.rsplit(c.space, 1)[0]
            if cur and query and conditions:
                querys = (query+str(conditions+" order by htas.assessment_schedule_name")) 
                cur.execute(querys)  
                values = cur.fetchall()
                if values:
                 json_datas[c.results] = values
                else:
                    json_datas[c.results] = []
            else:
                json_datas[c.results] = []
            json_datas['status']='0'
            logger_obj.info("Schedule Entity Data for Datatable"+ str(json_datas) +" attempted by "+str(request.user.username))
        else:
            json_datas[c.results] = []
            json_datas['status']='0'
            logger_obj.info("Schedule Entity Data for Datatable"+ str(json_datas) +" attempted by "+str(request.user.username))
    except Exception as e:
        json_datas[c.results] = e
        json_datas['status']='1'
        logger_obj.info("Schedule Entity Data for Datatable result in exception as "+ str(e) +" attempted by "+str(request.user.username))
    cur.close()
    return HttpResponse(json.dumps(json_datas))

def report_template_datatable(request):
    ''' 
         21-Feb-2018 SND Report Templates Search Data
         @param request: Request Object
         @type request : Object
         @return:   HttpResponse Report Templates Search Data
         @author: SND
    '''
    json_datas = {}
    cur=connection.cursor()  #create the database connection
    post = request.GET
    template_role_id_dict = post.get(c.role_id)  #get table key 
    assessment_category_id = post.get(c.assessment_category)  #get table key 
    created_from = post.get(c.From)  #get table key 
    created_to = post.get(c.To)  #get table key 
    try:
        if template_role_id_dict or assessment_category_id or created_from or created_to:
            query =  """select htat.assessment_template_name,htart.role_title,htat.assessment_template_code,ri.refitems_name,CASE WHEN htat.assessment_template_active_status=false THEN 'InActive'
                WHEN htat.assessment_template_active_status=true THEN 'Active' ELSE 'inactive' END from hcms_ta_assessment_template htat inner join hcms_ti_role_details htart on htart.id = htat.assessment_template_role_id inner join 
            reference_items ri on ri.id = htat.assessment_category_refitem_id"""
            conditions = " where ri.is_active = true and htart.is_active = true and htat.is_active = true and"
            if template_role_id_dict != c.null and template_role_id_dict != None:
                template_role_id = json.loads(template_role_id_dict)
                if(len(template_role_id)==1):
                    conditions = conditions = conditions+" htat.assessment_template_role_id = "+template_role_id[0]+" and"
                else:
                    conditions = conditions = conditions+" htat.assessment_template_role_id in "+str(tuple(template_role_id))+" and"
                    
            if assessment_category_id != c.null and assessment_category_id != None:
                conditions = conditions+" htat.assessment_category_refitem_id = "+assessment_category_id+" and"
                
            if created_from != c.null and created_from != None:
                created_from_date = datetime.datetime.strptime(created_from, '%d-%m-%Y').strftime('%Y-%m-%d')
                conditions = conditions+" htat.created_date::date >= '"+created_from_date+"' and"
                
            if created_to != c.null and created_to != None:
                created_to_date = datetime.datetime.strptime(created_to, '%d-%m-%Y').strftime('%Y-%m-%d')
                conditions = conditions+" htat.created_date::date <= '"+created_to_date+"' and"
                
            conditions = conditions.rsplit(c.space, 1)[0]
            if cur and query and conditions:
                querys = (query+str(conditions+" order by htat.assessment_template_name")) 
                cur.execute(querys)  
                values = cur.fetchall()
                if values:
                 json_datas[c.results] = values
                else:
                    json_datas[c.results] = []
            else:
                json_datas[c.results] = []
            json_datas['status']='0'
            logger_obj.info("Template Entity Data for Datatable"+ str(json_datas) +" attempted by "+str(request.user.username))
        else:
            json_datas[c.results] = []
            json_datas['status']='0'
            logger_obj.info("Schedule Entity Data for Datatable"+ str(json_datas) +" attempted by "+str(request.user.username))
    except Exception as e:
        json_datas[c.results] = e
        json_datas['status']='1'
        logger_obj.info("Template Entity Data for Datatable result in exception as "+ str(e) +" attempted by "+str(request.user.username))
    cur.close()
    return HttpResponse(json.dumps(json_datas))



def report_assessment_forms_datatable(request):
    ''' 
         21-Feb-2018 SND Report Assessment Forms Search Data
         @param request: Request Object
         @type request : Object
         @return:   HttpResponse Report Assessment Forms Search Data
         @author: SND
    '''
    json_datas = {}
    cur=connection.cursor()  #create the database connection
    post = request.GET
    employee_id_dict = post.get(c.employee_id)  #get table key 
    orgUnit_id_dict = post.get(c.orgUnit_id)  #get table key 
    role_id_dict = post.get(c.role_id)  #get table key 
    employee_type_id = post.get(c.employee_type) #get table key 
    assessment_category_id = post.get(c.assessment_category)  #get table key
    schedule_from = post.get(c.From)  #get table key 
    schedule_to = post.get(c.To)  #get table key 
    try:
        if employee_id_dict or orgUnit_id_dict or role_id_dict or employee_type_id or assessment_category_id or schedule_from or schedule_to:
            query =  """select distinct ei.name, htart.role_title, htat.assessment_template_name,ri.refitems_name from hcms_ta_assessment_template htat inner join 
                        hcms_ti_role_details htart on htart.id = htat.assessment_template_role_id inner join employee_info ei on ei.role_id_id = htart.id inner join 
                        reference_items ri on ri.id = htat.assessment_category_refitem_id"""
            conditions = " where ri.is_active = true and ei.is_active = true and htart.is_active = true and htat.is_active = true and"
            
            if employee_id_dict != c.null and employee_id_dict != None:
                employee_id = json.loads(employee_id_dict)
                employee_id_res = [str(n) for n in employee_id]
                if(len(employee_id_res)==1):
                    conditions = conditions+" ei.id = "+employee_id_res[0]+" and"
                else:
                    conditions = conditions+" ei.id in "+str(tuple(employee_id_res))+" and"
                    
            if orgUnit_id_dict != c.null and orgUnit_id_dict != None:
                orgUnit_id = [value for value in literal_eval(orgUnit_id_dict)]
                if(len(orgUnit_id)==1):
                    conditions = conditions+" ei.org_unit_id_id = "+orgUnit_id[0]+" and"
                else:
                    conditions = conditions+" ei.org_unit_id_id in "+str(tuple(orgUnit_id))+" and"
                    
            if role_id_dict != c.null and role_id_dict != None:
                role_id = json.loads(role_id_dict)
                if(len(role_id)==1):
                    conditions = conditions+" htat.assessment_template_role_id =  "+role_id[0]+" and"
                else:
                    conditions = conditions+" htat.assessment_template_role_id in "+str(tuple(role_id))+" and"
                    
            if assessment_category_id != c.null and assessment_category_id != None:
                conditions = conditions+" htat.assessment_category_refitem_id  = "+assessment_category_id+" and"
                
            if employee_type_id != c.null and employee_type_id != None:
                conditions = conditions+" ei.type_id_id = "+employee_type_id+" and"
                
            if schedule_from != c.null and schedule_from != None:
                schedule_from_date = datetime.datetime.strptime(schedule_from, '%d-%m-%Y').strftime('%Y-%m-%d')
                conditions = conditions+" htat.created_date::date >= '"+schedule_from_date+"' and"
                
            if schedule_to != c.null and schedule_to != None:
                schedule_to_date = datetime.datetime.strptime(schedule_to, '%d-%m-%Y').strftime('%Y-%m-%d')
                conditions = conditions+" htat.created_date::date <= '"+schedule_to_date+"' and"
                
            conditions = conditions.rsplit(c.space, 1)[0]
            if cur and query and conditions:
                querys = (query+str(conditions+" order by ei.name")) 
                cur.execute(querys)  
                values = cur.fetchall()
                if values:
                 json_datas[c.results] = values
                else:
                    json_datas[c.results] = []
            else:
                json_datas[c.results] = []
            json_datas['status']='0'
            logger_obj.info("Assessment Form Entity Data for Datatable"+ str(json_datas) +" attempted by "+str(request.user.username))
        else:
            json_datas[c.results] = []
            json_datas['status']='0'
            logger_obj.info("Assessment Form Entity Data for Datatable"+ str(json_datas) +" attempted by "+str(request.user.username))
    except Exception as e:
        json_datas[c.results] = e
        json_datas['status']='1'
        logger_obj.info("Assessment Form Entity Data for Datatable result in exception as "+ str(e) +" attempted by "+str(request.user.username))
    cur.close()
    return HttpResponse(json.dumps(json_datas))


