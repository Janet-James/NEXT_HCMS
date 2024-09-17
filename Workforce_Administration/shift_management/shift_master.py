# -*- coding: utf-8 -*-
from __future__ import unicode_literals
 
import json
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from django.http.response import HttpResponse
from CommonLib import query
from django.db import connection
from CommonLib.hcms_common import menu_access_control
from CommonLib.lib import *
# for decoder function
from django.core import serializers
from django.core.serializers.json import DjangoJSONEncoder
import HCMS.settings as status_keys

import logging
import logging.handlers
import config
from Workforce_Administration.time_attendance_management import config as c
logger_obj = logging.getLogger('logit')

# from UAM.uam_session_sync import uam_sessions_sync
# from UAM.uam_func_data_sync import uam_func_sync
# from tracking.models import Visitor
 
class HCMSShiftDetailView(TemplateView):  #Added- JAN-21May2018
    ''' 
    21-MAY-2018 || JAN || To HCMS employee shift master page loaded.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HCMSShiftDetailView, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Workforce Administration', self.request.user.id)
        if macl:
           template_name = config.shift_template_name
        else:
            template_name = config.tags_access_denied_html
        return [template_name]
     
    def get(self, request, *args, **kwargs):
        cur=connection.cursor() 
        context = super(HCMSShiftDetailView, self).get_context_data(**kwargs)
        try:
            cur.execute(query.fetch_hcms_query(config.shift_module,config.fetch_employee_details_view))
            employee_info = dictfetchall(cur)
            cur.execute(query.fetch_hcms_query(config.shift_module,config.fetch_shift_details_view))
            shift_info = dictfetchall(cur)
            cur.execute(query.fetch_hcms_query(config.shift_module,config.fetch_organization_details_view))
            org_info=dictfetchall(cur)
            context[config.organization]=org_info
            cur.execute(query.fetch_hcms_query(config.shift_module,config.fetch_role_details_view))
            role=dictfetchall(cur)
            context[config.shift_details]={config.employee_info:employee_info,config.shift_info:shift_info,config.role:role}
        except Exception as e:
            context[config.shift_details] = e
            logger_obj.info("Shift Master Page Load data exception"+ str(e) +" attempted by "+str(request.user.username))    
        cur.close()
        return self.render_to_response(context)
    
# Transform HCMS employee mapping insert here
def employeeMappingRoleView(request):  #Added- Sindhuja-07Feb2018
    ''' 
    21-MAY-2018 || SND || Employee Mapping Role View Function .
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    condition = ''
    try:
        if current_user_id:
            role_id = request.GET.get(config.role_id,False)
            if role_id and role_id!='' and role_id!=config.null:
                role_id_id = json.loads(role_id)
                role_common_tuple_list = tuple(map(str,role_id_id))
                if len(role_id_id) == 1:
                    condition = "= "+str(map(str,role_id_id)[0])
                    
                elif len(role_id_id) > 1:
                    condition = "in "+str(role_common_tuple_list)
                if condition != '':   
                    cur.execute(query.fetch_hcms_query(config.shift_module,config.role_based_employee_details).format(condition,))
                    employee_details=dictfetchall(cur)
                    if employee_details:
                        json_data[config.status] = status_keys.SUCCESS_STATUS
                        json_data[config.employee_details] = employee_details
                    else:
                        json_data[config.status] = status_keys.FAILURE_STATUS
                    logger_obj.info("Employee Mapping Role data  attempted by "+str(request.user.username))
                else:
                    json_data[config.status] = config.NTE_08
                    logger_obj.info("Employee Mapping Role data  attempted by "+str(request.user.username))
            else:
                    json_data[config.status] = config.NTE_08
                    logger_obj.info("Employee Mapping Role data  attempted by "+str(request.user.username))
        else:
            json_data[config.status]=config.NTE_08
    except Exception as e:
        json_data[config.status] = e
        logger_obj.info("Employee Mapping Role in exception as "+ str(e) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder),content_type=config.application_json)
    
# Transform HCMS employee mapping insert here
def employeeMappingInsert(request):  #Added- Sindhuja-07Feb2018
    ''' 
    21-MAY-2018 || SND || Employee Mapping Insert Function .
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    try:
        if current_user_id:
            shift_name_id = request.POST.get(config.shift_name,False)
            employee_name_id = request.POST.get(config.employee_name,False)
            employee_name_common_id = request.POST.get(config.employee_name_common,False)
            if employee_name_common_id :
                emp_name_common_id = json.loads(employee_name_common_id)
                emp_common_tuple_list = tuple(map(str,emp_name_common_id))
                if len(emp_name_common_id) == 1:
                    cur.execute(query.fetch_hcms_query(config.shift_module,config.delete_shift_based_employee).format(map(str,emp_name_common_id)[0],),)
                    return_id=dictfetchall(cur)
                elif len(emp_name_common_id) > 1:
                    cur.execute(query.fetch_hcms_query(config.shift_module,config.delete_shift_based_employees).format(emp_common_tuple_list,),)
                    return_id=dictfetchall(cur)
            if shift_name_id and employee_name_id:
                for i in json.loads(employee_name_id):
                    cur.execute(query.fetch_hcms_query(config.shift_module,config.insert_shift_employee_rel).format(shift_name_id,i,True,current_user_id),)
                    return_data=dictfetchall(cur)
                if return_data:
                    json_data[config.status] = status_keys.SUCCESS_STATUS
                else:
                    json_data[config.status] = status_keys.FAILURE_STATUS
                logger_obj.info("Shift Employee Relation table data insert status"+ str(json_data) +" attempted by "+str(request.user.username))
            else:
                logger_obj.info("Shift Employee Relation table data insert status"+ str(json_data) +" attempted by "+str(request.user.username))
                json_data[config.status] = config.NTE_08
        else:
            json_data[config.status]=config.NTE_08
    except Exception as e:
        json_data[config.status] = e
        logger_obj.info("Shift Employee Relation table data insert exception as"+ str(json_data) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder),content_type=config.application_json)

# Transform HCMS employee mapping update here
def employeeMappingUpdate(request):  #Added- Sindhuja-07Feb2018
    ''' 
    21-MAY-2018 || SND || Employee Mapping Update Function .
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    try:
        if current_user_id:
            shift_details_id = request.POST.get(config.shift_details_id,False)
            shift_name_id = request.POST.get(config.shift_name,False)
            employee_name_id = request.POST.get(config.employee_name,False)
            employee_name_common_id = request.POST.get(config.employee_name_common,False)
            if employee_name_common_id :
                emp_name_common_id = json.loads(employee_name_common_id)
                emp_common_tuple_list = tuple(map(str,emp_name_common_id))
                if len(emp_name_common_id) == 1:
                    cur.execute(query.fetch_hcms_query(config.shift_module,config.delete_shift_based_employee).format(map(str,emp_name_common_id)[0],),)
                    return_id=dictfetchall(cur)
                elif len(emp_name_common_id) > 1:
                    cur.execute(query.fetch_hcms_query(config.shift_module,config.delete_shift_based_employees).format(emp_common_tuple_list,),)
                    return_id=dictfetchall(cur)
            if shift_name_id and employee_name_id and shift_details_id:
                cur.execute(query.fetch_hcms_query(config.shift_module,config.delete_shift_rel_based_shift).format(shift_details_id))
                deleted_data=dictfetchall(cur)
                for i in json.loads(employee_name_id):
                    cur.execute(query.fetch_hcms_query(config.shift_module,config.insert_shift_employee_rel).format(shift_name_id,i,True,current_user_id),)
                    return_data=dictfetchall(cur)
                if return_data:
                    json_data[config.status] = status_keys.UPDATE_STATUS
                else:
                    json_data[config.status] = status_keys.FAILURE_STATUS
                logger_obj.info("Shift Employee Relation table data update status"+ str(json_data) +" attempted by "+str(request.user.username))
            else:
                json_data[config.status] = config.NTE_08
                logger_obj.info("Shift Employee Relation table data update status"+ str(json_data) +" attempted by "+str(request.user.username))
        else:
            json_data[config.status]=config.NTE_08
    except Exception as e:
        json_data[config.status] = e
        logger_obj.info("Shift Employee Relation table data update status exception as"+ str(json_data) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder),content_type=config.application_json)

# Transform HCMS employee mapping Information View here
def employeeMappingView(request):  #Added- Sindhuja-07Feb2018
    ''' 
    21-MAY-2018 || SND || Employee Mapping View Function .
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    condition = ''
    try:
        if current_user_id:
            shift_name_id = request.GET.get(config.shift_name_id,False)
            if shift_name_id and shift_name_id!='':
                cur.execute(query.fetch_hcms_query(config.shift_module,config.shift_details_view_based_shift).format(shift_name_id))
                json_data[config.shift_employee_id]=dictfetchall(cur)
                cur.execute(query.fetch_hcms_query(c.attendance,c.division_details_shift_change).format(shift_name_id))
                json_data[c.shift_change] = dictfetchall(cur)
                if json_data:
                    json_data[config.status] = status_keys.SUCCESS_STATUS
                else:
                    json_data[config.status] = status_keys.FAILURE_STATUS
                logger_obj.info("Shift Employee Relation table data View status"+ str(json_data) +" attempted by "+str(request.user.username))
            else:
                cur.execute(query.fetch_hcms_query(config.shift_module,config.fetch_shift_details_id))
                shift_master_id=cur.fetchall()
                shift_master_id_id = tuple(set(shift_master_id))
                shift_master_final_id = [x[0] for x in shift_master_id_id]
                if len(shift_master_final_id) > 1:
                    condition = "in "+str(tuple(shift_master_final_id))
                    
                elif len(shift_master_final_id) == 1:
                    condition = "= "+str(shift_master_final_id[0])
                    
                if condition!='':
                    cur.execute(query.fetch_hcms_query(config.shift_module,config.shift_details_table_view_based_shift).format(condition))
                    json_data[config.shift_detail] = cur.fetchall()
                    if json_data:
                        json_data[config.status] = status_keys.SUCCESS_STATUS
                    else:
                        json_data[config.status] = status_keys.FAILURE_STATUS
                else:
                    json_data[config.shift_detail] = []
                    json_data[config.status] = config.NTE_08
                logger_obj.info("Shift Employee Relation table data View status"+ str(json_data) +" attempted by "+str(request.user.username))
                    
        else:
            json_data[config.status]=config.NTE_08
    except Exception as e:
        json_data[config.status] = e
        logger_obj.info("Shift Employee Relation table data view exception"+ str(json_data) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder),content_type=config.application_json)

# Transform HCMS employee mapping Information Delete here
def employeeMappingDelete(request):  #Added- Sindhuja-07Feb2018
    ''' 
    21-MAY-2018 || SND || Employee Mapping Remove Function .
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    try:
        if current_user_id:
            shift_name_id = request.POST.get(config.shift_name,False)
            if shift_name_id:
                cur.execute(query.fetch_hcms_query(config.shift_module,config.delete_shift_rel_based_shift).format(shift_name_id))
                deleted_data=dictfetchall(cur)
                if deleted_data:
                    json_data[config.status] = status_keys.REMOVE_STATUS
                else:
                    json_data[config.status] = status_keys.FAILURE_STATUS
                logger_obj.info("Employee Mapping Remove Function status"+ str(json_data) +" attempted by "+str(request.user.username))
            else:
                json_data[config.status] = config.NTE_08
        else:
            json_data[config.status]=config.NTE_08
    except Exception as e:
        json_data[config.status] = e
        logger_obj.info("Employee Mapping Remove Function exception "+ str(json_data) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder),content_type=config.application_json)

# Transform HCMS employee mapping Employee Exist Check here
def employeeMappingEmployeeExist(request):  #Added- Sindhuja-15Jun2018
    ''' 
    15-JUN-2018 || SND || Employee Mapping Employee Exist Check Function .
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    try:
        if current_user_id:
            employee_name_id = request.GET.get(config.employee_name,False)
            shift_id = request.GET.get(config.shift_id,False)
            if employee_name_id and shift_id:
                emp_name_id = json.loads(employee_name_id)
                if len(emp_name_id) > 1:
                    condition = "in "+str(tuple(map(str,emp_name_id)))
                elif len(emp_name_id) == 1:
                    condition = "= "+str(map(str,emp_name_id)[0])
                if condition:
                    cur.execute(query.fetch_hcms_query(config.shift_module,config.shift_employee_based_employee_details).format(condition,shift_id))
                    employee_name_data = dictfetchall(cur)
                    if employee_name_data:
                        json_data[config.status] = status_keys.SUCCESS_STATUS
                        json_data[config.employee_name] = employee_name_data
                    else:
                        json_data[config.status] = status_keys.FAILURE_STATUS
                else:
                    json_data[config.status] = status_keys.FAILURE_STATUS
                logger_obj.info("Employee Mapping Employee Exist data with the shift and employee id "+ str(json_data) +" attempted by "+str(request.user.username))    
            elif employee_name_id:
                emp_name_id = json.loads(employee_name_id)
                if len(emp_name_id) > 1:
                    condition = "in "+str(tuple(map(str,emp_name_id)))
                elif len(emp_name_id) == 1:
                    condition = "= "+str(map(str,emp_name_id)[0])
                if condition:    
                    cur.execute(query.fetch_hcms_query(config.shift_module,config.employee_based_employee_details).format(condition,))
                    employee_name_data = dictfetchall(cur)
                    if employee_name_data:
                        json_data[config.status] = status_keys.SUCCESS_STATUS
                        json_data[config.employee_name] = employee_name_data
                    else:
                        json_data[config.status] = status_keys.FAILURE_STATUS
                else:
                    json_data[config.status] = status_keys.FAILURE_STATUS
                logger_obj.info("Employee Mapping Employee Exist data with the employee id "+ str(json_data) +" attempted by "+str(request.user.username))        
            else:
                json_data[config.status] = config.NTE_08
                logger_obj.info("Employee Mapping Employee Exist check function status "+ str(json_data) +" attempted by "+str(request.user.username))    
        else:
            json_data[config.status]=config.NTE_08
    except Exception as e:
        json_data[config.status] = e
        logger_obj.info("Employee Mapping Employee Exist check function exception "+ str(json_data) +" attempted by "+str(request.user.username))    
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder),content_type=config.application_json)

def employeeMappingDivisionFetch(request):
    '''
    18-OCT-2018 || SND || To Fetch Division Data 
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse to return the division data
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    try:
        if current_user_id:
            orgunit_id_list=request.GET.get(config.org_unit_id)
            if orgunit_id_list and orgunit_id_list!='null':
                orgunit_id = json.loads(orgunit_id_list)
                if len(orgunit_id) > 1:
                        condition = "in "+str(tuple(map(str,orgunit_id)))
                elif len(orgunit_id) == 1:
                    condition = "= "+str(map(str,orgunit_id)[0])
                cur.execute(query.fetch_hcms_query(config.shift_module,config.divison_fetch_based_org_unit).format(condition))
                division=dictfetchall(cur)
                json_data[config.status] = status_keys.SUCCESS_STATUS
                json_data[config.division_details]=division
            else:
                json_data[config.status] = status_keys.FAILURE_STATUS
        else:
            json_data[config.status] = status_keys.FAILURE_STATUS
    except Exception as e:
        json_data[config.status] = e
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

    
# def shif_master_save(request):
#     ''' 
#             21-MAY-2018 || ESA || To save shift master data
#             @param request: Request Object
#             @type request : Object
#             @return:  return the success message for save
#     '''
#     json_data={}
#     current_user_id=request.user.id
#     cur = db_connection()
#     try:
#       if current_user_id:
#             org_unit=request.POST.get(config.organization_unit)
#             shift_name=request.POST.get(config.shift_name)
#             shift_description=request.POST.get(config.shift_description)
#             shift_start=request.POST.get(config.shift_start)
#             shift_end=request.POST.get(config.shift_end)
#             work_half_day=request.POST.get(config.work_half_day)
#             work_full_day=request.POST.get(config.work_full_day)
# #             allow_shift_start=request.POST.get('allow_shift_start')
#             update_id=request.POST.get(config.clicked_row_id)
#             schedule_table=request.POST.get(config.schedule_details)
#             shift_active=request.POST.get(config.shift_active)
#             schedule_data=json.loads(schedule_table)
#             weekend_data = ','.join(map(str, schedule_data)) 
# #             if allow_shift_start=='':
# #                 allow_shift_start=None
#             if update_id:
#                 if org_unit and shift_name  and shift_start and  shift_end and work_half_day and work_full_day :
#                     cur.execute(query.fetch_hcms_query(config.shift_module,config.update_exsist_shift_details),(str(shift_name),str(org_unit),str(update_id)))
#                     exsist_data=dictfetchall(cur)
#                     if exsist_data:
#                          json_data[config.status]=status_keys.SUCCESS_STATUS
#                     else:
#                         cur.execute(query.fetch_hcms_query(config.shift_module,config.shift_master_update),(str(current_user_id),str(shift_name),str(shift_description),str(shift_start),str(shift_end),str(work_half_day),
#                                     str(work_full_day),str(org_unit),weekend_data,shift_active,'TRUE',str(update_id),))
#                        
#                         json_data[config.status]=status_keys.UPDATE_STATUS
#                 else:
#                    json_data[config.status]=status_keys.FAILURE_STATUS 
#                 logger_obj.info("Shift Master Data Save Status"+ str(json_data) +" attempted by "+str(request.user.username))    
#             else:
#                 if org_unit and shift_name  and shift_start and  shift_end and work_half_day and work_full_day :
#                     cur.execute(query.fetch_hcms_query(config.shift_module,config.exsist_shift_details),(str(shift_name),str(org_unit)))
#                     exsist_data=dictfetchall(cur)
#                     if exsist_data:
#                          json_data[config.status]=status_keys.SUCCESS_STATUS
#                     else:
#                         cur.execute(query.fetch_hcms_query(config.shift_module,config.shift_master_save),(str(current_user_id),str(shift_name),str(shift_description),str(shift_start),str(shift_end),str(work_half_day),
#                                     str(work_full_day),str(org_unit),shift_active,'TRUE',weekend_data,))
#                         res = dictfetchall(cur)
#                         inserted_id=res[0]['id']
#                         if inserted_id:
#                             json_data[config.status]=status_keys.SUCCESS_STATUS
#                         else:
#                             json_data[config.status]=status_keys.FAILURE_STATUS
#                 else:
#                    json_data[config.status]=status_keys.FAILURE_STATUS 
#                 logger_obj.info("Shift Master Data Save Status"+ str(json_data) +" attempted by "+str(request.user.username))  
#       else:
#             json_data[config.status]='001'
#     except Exception as e:
#          result = e
#          logger_obj.info("Shift Master Data Save exception"+ str(result) +" attempted by "+str(request.user.username))  
#          json_data[config.Exception]=str(result)
#     return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)


def shif_master_show(request):
    ''' 
            21-MAY-2018 || ESA || To fetch the shift details
            @param request: Request Object
            @type request : Object
            @return:  return the shift details
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    try:
        if current_user_id:
            cur.execute(query.fetch_hcms_query(config.shift_module,config.shift_master_details))
            shift_details = dictfetchall(cur)
            if shift_details:
                json_data[config.shift_data]=shift_details
            else:
                json_data[config.shift_data]=[]
            logger_obj.info("Shift Details fetch data  attempted by "+str(request.user.username))
        else:
            json_data[config.shift_data]=[]
    except Exception as e:
        result = e
        json_data[config.shift_data]=[]
        logger_obj.info("Shift Details fetch data in exception as"+ str(e) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)


def fetch_shift_details(request):
    ''' 
            21-MAY-2018 || ESA || To fetch the shift details
            @param request: Request Object
            @type request : Object
            @return:  return the shift details
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    json_data['division_details']=[]
    json_data['fetch_data']=[]
    try:
        if current_user_id:
            shift_id=request.POST.get(config.shift_id)
            if shift_id:
                cur.execute(query.fetch_hcms_query(config.shift_module,config.fetch_shift_details).format(shift_id))
                shift_details = dictfetchall(cur) 
                cur.execute(query.fetch_hcms_query(config.shift_module,config.fetch_shift_division_details).format(shift_id))
                shift_division_details = dictfetchall(cur) 
                if shift_details and shift_division_details:
                    json_data[config.fetch_data]=shift_details
                    json_data['division_details']=shift_division_details
                else:
                    json_data[config.fetch_data]=[]
                logger_obj.info("Shift Details fetch data with the respective id  attempted by "+str(request.user.username))
            else:
                json_data[config.fetch_data]=[]
                logger_obj.info("Shift Details fetch data with the respective id  attempted by "+str(request.user.username))
        else :
            json_data[config.fetch_data]=[]
            json_data[config.status]='001'
    except Exception as e:
        result = e
        logger_obj.info("Shift Details fetch data with the respective id in exception as "+ str(e) +" attempted by "+str(request.user.username))
        json_data[config.fetch_data]=[]
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def shift_master_remove(request):
    ''' 
            21-MAY-2018 || ESA || To remove the shift details
            @param request: Request Object
            @type request : Object
            @return:  return the status
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    try:
        if current_user_id:
            remove_id=request.POST.get(config.remove_id)
            if remove_id:
                cur.execute(query.fetch_hcms_query(config.shift_module,config.shift_master_remove),(str(current_user_id),str(remove_id)))
                cur.execute(query.fetch_hcms_query(config.shift_module,config.shift_master_division_remove),(str(current_user_id),str(remove_id)))
                json_data[config.status]=status_keys.REMOVE_STATUS
            else:
                json_data[config.status]=status_keys.FAILURE_STATUS
            logger_obj.info("Shift Details Remove status "+ str(json_data) +" attempted by "+str(request.user.username))
        else:
            json_data[config.status]='001'
    except Exception as e:
        result = e
        json_data[config.status]=[]
        logger_obj.info("Shift Details Remove exception as"+ str(e) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)   

def org_unit_fetch(request):
    ''' 
            22-MAY-2018 || ESA || To fetch the org unit  details
            @param request: Request Object
            @type request : Object
            @return:  return the org unit
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    try:
        if current_user_id:
            str_org_id=request.GET.get(config.str_org_id)
            if str_org_id:
                cur.execute(query.fetch_hcms_query(config.shift_module,config.org_unit_details).format(str_org_id))
                org_unit = dictfetchall(cur)
                if org_unit:
                    json_data[config.org_unit]=org_unit
                else:
                    json_data[config.org_unit]=[]
                logger_obj.info("Organization Unit details attempted by "+str(request.user.username))
            else:
                json_data[config.org_unit]=[]
                logger_obj.info("Organization Unit details attempted by "+str(request.user.username))
        else :
            json_data[config.org_unit]=[]
            json_data[config.status]='001' 
    except Exception as e:
        result = e
        json_data[config.org_unit]=[]
        logger_obj.info("Organization Unit details exception as"+ str(e) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def shift_fetch(request):
    ''' 
            18-OCT-2018 || SND || To fetch the Shift details based on  Division
            @param request: Request Object
            @type request : Object
            @return:  return the Shift detailed Information
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    try:
        if current_user_id:
            division_list_id=request.GET.get(config.division_id,False)
            if division_list_id and division_list_id!='null':
                division_id = json.loads(division_list_id)
                if len(division_id) > 1:
                    condition = "in "+str(tuple(map(str,division_id)))
                elif len(division_id) == 1:
                    condition = "= "+str(map(str,division_id)[0])
                cur.execute(query.fetch_hcms_query(config.shift_module,config.shift_division_based_shift_details).format(condition),)
                shift_details = dictfetchall(cur)
                cur.execute(query.fetch_hcms_query(config.shift_module,config.fetch_employee_details_based_division).format(condition),)
                employee_details = dictfetchall(cur)
                if shift_details :
                    json_data[config.status] = status_keys.SUCCESS_STATUS
                    json_data[config.employee_details]=employee_details
                    json_data[config.shift_details]=shift_details
                else:
                    json_data[config.status] = status_keys.FAILURE_STATUS
                logger_obj.info("Shift details based on division data attempted by "+str(request.user.username))
            else:
                json_data[config.status] = status_keys.FAILURE_STATUS
                logger_obj.info("Shift details based on division data  attempted by "+str(request.user.username))
        else :
           json_data[config.status] = status_keys.FAILURE_STATUS
    except Exception as e:
        result = e
        logger_obj.info("Shift details based on division exception as"+ str(e) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def division_dropdown(request):
    '''
    17-OCT-2018 || ESA || To Fetch Division Data 
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse to return the success or error message
    '''
    json_data = {} 
    json_data['division']=[]
    current_user_id=request.user.id
    cur = db_connection()
    if current_user_id:
      selected_id=json.loads(request.GET.get('str_org_unit_id'))
      if selected_id:
         cur.execute(query.fetch_hcms_query(config.shift_module,config.division_details),(tuple(selected_id),))
         divison=dictfetchall(cur)
         json_data['division']=divison
      else:
         json_data['division']=[]
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

def shif_master_save(request):
     ''' 
                17-OCT-2018 || ESA || To save shift master data
                @param request: Request Object
                @type request : Object
                @return:  return the success message for save
     '''
     json_data={}
     current_user_id=request.user.id
     cur = db_connection()
#     try:
     if current_user_id:
            org_unit=request.POST.get(config.organization_unit)
            org_id=request.POST.get('organization')
            division_id=request.POST.get('division')
            shift_name=request.POST.get(config.shift_name)
            shift_description=request.POST.get(config.shift_description)
            shift_start=request.POST.get(config.shift_start)
            shift_end=request.POST.get(config.shift_end)
            work_half_day=request.POST.get(config.work_half_day)
            work_full_day=request.POST.get(config.work_full_day)
            update_id=request.POST.get(config.clicked_row_id)
            schedule_table=request.POST.get(config.schedule_details)
            shift_active=request.POST.get(config.shift_active)
            schedule_data=json.loads(schedule_table)
            division_data=json.loads(division_id)
            org_unit_data=json.loads(org_unit)
            weekend_data = ','.join(map(str, schedule_data)) 
            if update_id:
                if org_unit and shift_name  and shift_start and  shift_end and work_half_day and work_full_day and org_id and division_id: 
                    query_value=query.fetch_hcms_query(config.shift_module,config.check_update_exsist_shift_details)
                    query_value =query_value.replace('{}',"'%%"+weekend_data+"%%'")
                    cur.execute(query_value,(str(org_id),str(shift_start),str(shift_end),str(work_half_day),str(work_full_day),str(update_id),tuple(division_data),))
                    exsist_data=dictfetchall(cur)
                    if exsist_data:
                         json_data[config.status]='NTE-01'
                         json_data['insert_exsist_data']=exsist_data
                    else:
                        cur.execute(query.fetch_hcms_query(config.shift_module,config.shift_master_update),(str(current_user_id),str(shift_name),str(shift_description),str(shift_start),str(shift_end),str(work_half_day),
                                    str(work_full_day),str(org_id),weekend_data,tuple(org_unit_data),shift_active,'TRUE',str(update_id),))
                        cur.execute(query.fetch_hcms_query(config.shift_module,config.shift_master_division_delete).format(update_id),)
                        for i in division_data:
                            cur.execute(query.fetch_hcms_query(config.shift_module,config.shift_master_division_save),(str(current_user_id),str(i),str(update_id),
                                    'TRUE',))
                        json_data[config.status]=status_keys.UPDATE_STATUS
                else:
                   json_data[config.status]=status_keys.FAILURE_STATUS 
                logger_obj.info("Shift Master Data Save Status"+ str(json_data) +" attempted by "+str(request.user.username))    
            else:
                if org_unit and shift_name  and shift_start and  shift_end and work_half_day and work_full_day and org_id and division_id: 
                   query_value=query.fetch_hcms_query(config.shift_module,config.check_exsist_shift_details_save)
                   query_value =query_value.replace('{}',"'%%"+weekend_data+"%%'")
                   cur.execute(query_value,(str(org_id),str(shift_start),str(shift_end),str(work_half_day),str(work_full_day),tuple(division_data),))
                   exsist_data=dictfetchall(cur)
                   if exsist_data:
                             json_data[config.status]='NTE-01'
                             json_data['insert_exsist_data']=exsist_data
                   else:
                     cur.execute(query.fetch_hcms_query(config.shift_module,config.shift_master_save),(str(current_user_id),str(shift_name),str(shift_description),str(shift_start),str(shift_end),str(work_half_day),
                                        str(work_full_day),str(org_id),shift_active,'TRUE',weekend_data,tuple(org_unit_data),))
                     res = dictfetchall(cur)
                     inserted_id=res[0]['id']
                     if inserted_id:
                         for i in division_data:
                           cur.execute(query.fetch_hcms_query(config.shift_module,config.shift_master_division_save),(str(current_user_id),str(i),str(inserted_id),
                                        'TRUE',))
                         json_data[config.status]=status_keys.SUCCESS_STATUS
                     else:
                         json_data[config.status]=status_keys.FAILURE_STATUS
                else:
                       json_data[config.status]=status_keys.FAILURE_STATUS 
                logger_obj.info("Shift Master Data Save Status"+ str(json_data) +" attempted by "+str(request.user.username))  
     else:
            json_data[config.status]='001'
#     except Exception as e:
#          result = e
#          logger_obj.info("Shift Master Data Save exception"+ str(result) +" attempted by "+str(request.user.username))  
#          json_data[config.Exception]=str(result)
     return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)
 
def exsist_data_insert(request):
     ''' 
                18-OCt-2018 || ESA || To save shift master exsist data
                @param request: Request Object
                @type request : Object
                @return:  return the success message for save
     '''
     json_data={}
     current_user_id=request.user.id
     cur = db_connection()
     if current_user_id:
        org_unit=request.POST.get(config.organization_unit)
        org_id=request.POST.get('organization')
        division_id=request.POST.get('division')
        exsist_division_rel_id=request.POST.get('exsist_division_rel_id')
        shift_name=request.POST.get(config.shift_name)
        shift_description=request.POST.get(config.shift_description)
        shift_start=request.POST.get(config.shift_start)
        shift_end=request.POST.get(config.shift_end)
        work_half_day=request.POST.get(config.work_half_day)
        work_full_day=request.POST.get(config.work_full_day)
        update_id=request.POST.get(config.clicked_row_id)
        schedule_table=request.POST.get(config.schedule_details)
        shift_active=request.POST.get(config.shift_active)
        schedule_data=json.loads(schedule_table)
        division_data=json.loads(division_id)
        exsist_division_rel_data=json.loads(exsist_division_rel_id)
        org_unit_data=json.loads(org_unit)
        weekend_data = ','.join(map(str, schedule_data)) 
        if update_id:
           if org_unit and shift_name  and shift_start and  shift_end and work_half_day and work_full_day and org_id and division_id and exsist_division_rel_id: 
              cur.execute(query.fetch_hcms_query(config.shift_module,config.shift_master_update),(str(current_user_id),str(shift_name),str(shift_description),str(shift_start),str(shift_end),str(work_half_day),
                                    str(work_full_day),str(org_id),weekend_data,tuple(org_unit_data),shift_active,'TRUE',str(update_id),))
              cur.execute(query.fetch_hcms_query(config.shift_module,config.shift_master_division_rel_delete),(tuple(exsist_division_rel_data),))
              for i in division_data:
                 cur.execute(query.fetch_hcms_query(config.shift_module,config.shift_master_division_save),(str(current_user_id),str(i),str(update_id),
                                    'TRUE',))
              json_data[config.status]=status_keys.UPDATE_STATUS
           else:
                   json_data[config.status]=status_keys.FAILURE_STATUS 
           logger_obj.info("Shift Master exsist Data update Status"+ str(json_data) +" attempted by "+str(request.user.username))    
        else:
            if org_unit and shift_name  and shift_start and  shift_end and work_half_day and work_full_day and org_id and division_id and exsist_division_rel_id: 
                cur.execute(query.fetch_hcms_query(config.shift_module,config.shift_master_save),(str(current_user_id),str(shift_name),str(shift_description),str(shift_start),str(shift_end),str(work_half_day),
                                        str(work_full_day),str(org_id),shift_active,'TRUE',weekend_data,tuple(org_unit_data),))
                res = dictfetchall(cur)
                inserted_id=res[0]['id']
                if inserted_id:
                   cur.execute(query.fetch_hcms_query(config.shift_module,config.shift_master_division_rel_delete),(tuple(exsist_division_rel_data),))
                   for i in division_data:
                        cur.execute(query.fetch_hcms_query(config.shift_module,config.shift_master_division_save),(str(current_user_id),str(i),str(inserted_id),
                                        'TRUE',))
                   json_data[config.status]=status_keys.SUCCESS_STATUS
                else:
                    json_data[config.status]=status_keys.FAILURE_STATUS
            else:
                json_data[config.status]=status_keys.FAILURE_STATUS 
        return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)