

# -*- coding: utf-8 -*-
from __future__ import unicode_literals                             
from django.shortcuts import render
from django.shortcuts import redirect
import json 
from django.views.decorators.csrf import csrf_exempt
from django.http.response import HttpResponse 
from CommonLib import query
from CommonLib import lib,common_controller 
  
from django.db import connection  
import leave_config as config
from HRMS_Foundation.attendance_management.models import LeaveInfo
import datetime 
from datetime import date     
global logged_emp 
from django.views.generic.base import TemplateView 
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
import logging  
import logging.handlers    
import HCMS.settings as status_code 
from CommonLib.hcms_common import record_validation
#from CSD.AsynchronousEmail.views import asyn_email    
from CommonLib.asyn_mail import asyn_email      
from CommonLib.hcms_common import menu_access_control,access_data_mgt         
from collections import OrderedDict        
 
# import packages for Mobile API's   
import ast
from django.core import serializers   
from django.core.serializers.json import DjangoJSONEncoder 
import base64 
import requests 
logger_obj = logging.getLogger('logit')    
#hrms leave render views here  
class HRMSLeave(TemplateView):  
    '''   
    09-Feb-2018 PAR To HRMS Leave Page loaded. And also check the user authentication
    @param request: Request Object
    @type request : Object    
    @return:   HttpResponse or Redirect the another URL
    ''' 
#     template_name = "hrms_foundation/attendance_management/leave.html" 
     
    @method_decorator(login_required) 
    def dispatch(self, request, *args, **kwargs): 
        return super(HRMSLeave, self).dispatch(request, *args, **kwargs)     
    
    def get_template_names(self):
        macl = menu_access_control('Raise Leave Request', self.request.user.id)
        if macl:
             template_name = "hrms_foundation/attendance_management/leave.html"
        else: 
            template_name = "tags/access_denied.html" 
        return template_name
   
    def get(self, request, *args, **kwargs): 
        context = super(HRMSLeave, self).get_context_data(**kwargs)
        cur =lib.db_connection()    
        company_result=[]   
        json_data=[]   
        user_id=request.user.id 
        logged_emp=logged_employee(request)  
        if not logged_emp==None:
            if logged_emp:  
                result=[] 
                if logged_emp:
                    cur.execute(query.fetch_hcms_query(config.leave,config.leave_employee_query)) 
                    #values=cur.fetchall() 
                    values=lib.dictfetchall(cur) 
                    if values: 
                        result.append(values)
                        result=result[0] 
                    else:     
                        result="No Employee"   
                    json_data=config.No_employee
                    if user_id:
                        role_query=query.fetch_hcms_query(config.leave,config.leave_employee_role_query)
                        cur.execute(role_query%(user_id,))
                        role=lib.dictfetchall(cur)
                        if role[0]:  
                            role=role[0].get("name")
                    company_data=[1]      
                    if company_data:  
                        company_result.append(company_data)  
                        company_result=company_result[0][0]
                    else:        
                            json_data=config.company_name 
                    context[config.employee] = result      
                    context[config.current_employee_key] = logged_emp 
                    context[config.leave_status] = json_data
                    context["role"] = role 
                    #context[config.company_id] = org_data 
            else:
                logged_emp=0 
        return self.render_to_response(context) 
    
#calendar view function here    
class HRMSCalendarView(TemplateView):  
    '''  
    12-Oct-2018 PAR To HRMS Calendar Page loaded. And also check the user authentication
    @param request: Request Object  
    @type request : Object    
    @return:   HttpResponse or Redirect the another URL        
    '''   
#     template_name = "hrms_foundation/attendance_management/leave.html" 
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):   
        return super(HRMSCalendarView, self).dispatch(request, *args, **kwargs)     
    
    def get_template_names(self):
        macl = menu_access_control('Holiday/Leave Calendar', self.request.user.id)
        if macl: 
             template_name = "hrms_foundation/attendance_management/leave_calendar.html" 
        else: 
            template_name = "tags/access_denied.html" 
        return [template_name]
    def get(self, request, *args, **kwargs):
        context = super(HRMSCalendarView, self).get_context_data(**kwargs)  
        cur =lib.db_connection()  
        company_result=[] 
        json_data=[]   
        user_id=request.user.id  
        logged_emp=logged_employee(request)
        if not logged_emp==None: 
            if logged_emp:
                result=[] 
                context[config.employee] = result      
            else:
                logged_emp=0 
        #admin access check
        uid=request.user.id
        query = "select role_id,group_id from auth_user where id=%s"
        cur.execute(query,(int(uid),))    
        role_data = cur.fetchall()
        role_id = role_data[0][0]; 
        get_records = access_data_mgt(uid,role_data[0][1])#create access control using to find status of employee or not
        context['get_add_records'] = get_records[0][0] 
        return self.render_to_response(context)  
    
# process leave request 
class HRMSLeaveProcess(TemplateView):
    """
            13-Feb-2018 PAR To HRMS Process leave Page loaded. And also check the user authentication 
            @param request: Request Object
            @type request : Object 
            @return:   HttpResponse or Redirect the another URL
    """
    @method_decorator(login_required)     
    def dispatch(self, request, *args, **kwargs):  
        return super(HRMSLeaveProcess, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):  
        macl = menu_access_control('Process Leave Request', self.request.user.id) 
        if macl: 
             template_name = "hrms_foundation/attendance_management/process_leave.html" 
        else: 
            template_name = "tags/access_denied.html" 
        return [template_name]     
    def get(self, request, *args, **kwargs): 
        context = super(HRMSLeaveProcess, self).get_context_data(**kwargs)
        cur =lib.db_connection()     
        result = []
        logged_user = request.user.id 
        org_data = ''
        leave_logged_emp_query=query.fetch_hcms_query(config.leave,config.logged_emp)
        if leave_logged_emp_query:
            cur.execute(leave_logged_emp_query%(logged_user)) 
            employee=cur.fetchall()
        if employee:#employee:
            global logged_emp
            if employee[0][0]:
                logged_emp=employee[0][0] 
        else:
                logged_emp=0
        if cur: 
            cur.execute(query.fetch_hcms_query(config.leave,config.leave_employee_query)) 
            values=cur.fetchall() 
            result.append(values)
            
            leave_org_query=query.fetch_hcms_query(config.leave,config.hrms_org_list_current)
            if leave_org_query:
                cur.execute(leave_org_query%(logged_user))
                #  cur.execute(query.fetch_hcms_query(config.leave, config.hrms_org_list));
                values = query.dictfetchall(cur)
                if values:
                    org_data = values[0] 
        else: 
            json_data=config.leave_connection_error
        commit = lib.db_commit(cur)
        context[config.employee] = result[0]  
        context[config.company_id] = org_data
        context[config.current_employee_key] = logged_emp
        return self.render_to_response(context)
   
#get employee details function here    
def get_emp(id,key):
    
    """ 
            07-March-2018 PAR To HRMS  get logged in employee name and email id 
            @param request: Request Object
            @type request : Object
            @return:   HttpResponse or Redirect the another URL 
             
    """
    try:
        cur =lib.db_connection() 
        leave_emp_email=query.fetch_hcms_query(config.leave,config.leave_employee_query_email)
        leave_emp_email=leave_emp_email.format(key)
        if leave_emp_email:
            cur.execute(leave_emp_email%(id))
            requested_by_email=cur.fetchall()
            return requested_by_email[0][0]
    except Exception as e:
           logger_obj.error(e) 
            
#get organization details function here
def get_organization(user_id):
    try:
        cur =lib.db_connection() 
        leave_org_query=query.fetch_hcms_query(config.leave,config.hrms_org_list_current)  
        if leave_org_query:
            cur.execute(leave_org_query%(user_id))
            #  cur.execute(query.fetch_hcms_query(config.leave, config.hrms_org_list));
            values = query.dictfetchall(cur)
        if values:  
            org_data = values[0]  
        else: 
            org_data = []
        return org_data
    except Exception as e:
           logger_obj.error(e) 
           
#get reference item function here
def get_refitems(coulmn,refid,where_cond):
    try: 
        cur =lib.db_connection()
        ref_query="select {}  from reference_items where {}= %s"
        ref_query=ref_query.format(coulmn,where_cond)
        cur.execute(ref_query,(refid,))
        state_name=lib.dictfetchall(cur) 
        if state_name:
            state=state_name[0][coulmn]
            return state  
    except Exception as e:
           logger_obj.error(e) 
           return 0    
       
#leave reference data function here
@csrf_exempt
def HRMSLeave_reference_data(request): 
    try:
        column=request.POST.get("column") 
        ref_id=request.POST.get("ref_id")
        where_cond=request.POST.get("condition")
        ref_result=get_refitems(column,ref_id,where_cond) 
        if not ref_result:  
            ref_result=0  
    except Exception as e:  
        logger_obj.error(e)
    return HttpResponse(json.dumps(ref_result))     

#send mail function here
def send_mail(subject_content,leave_type,leave_description,state,requested_by,process_by,from_date,to_date,mail_reason,app_mode):
    """
            07-March-2018 PAR To HRMS  Sending mail while leave request is processed   
            @param request: Request Object 
            @type request : Object
            @return:   Response result    
    """   
    try:    
        state=get_refitems("refitems_name",state,'id')  
        if state==0:      
            state=""     
        to_address=get_emp(requested_by,"work_email")  
        name=get_emp(requested_by,"coalesce(name||' '||last_name) as name").lower().title()     
        title_id=get_emp(requested_by,"title_id")
        title=get_refitems('refitems_name',int(title_id),'id')   
        first_name=get_emp(requested_by,"coalesce(name) as first_name").lower().title()
        first_name=title+" "+first_name 
        process_by=get_name(process_by)        
        subject=subject_content+" "+state+" - "+name   
        if to_address and process_by: 
                mail_body_content_process=config.mail_body_content_process.format(first_name,leave_type,leave_description,from_date,to_date,state,process_by,mail_reason)
                stats=asyn_email(config.Transform_hcms,config.module_name,subject,to_address,mail_body_content_process,config.waiting) 
    except Exception as e:      
           logger_obj.error(e)         
           
#logged employee function here 
def logged_employee(request):     
    """ 
            07-March-2018 PAR To HRMS  getting the logged employee with user id   
            @param request: Request Object  
            @type request : Object 
            @return:   Response result  
    """    
    try:  
        cur =lib.db_connection()
        logged_user = request.user.id
        leave_logged_emp_query=query.fetch_hcms_query(config.leave,config.logged_emp)
        if leave_logged_emp_query:
            cur.execute(leave_logged_emp_query%(logged_user))
            employee=cur.fetchall()   
        if employee: 
            global logged_emp  
            if employee[0][0]: 
                logged_emp=employee[0][0]
            else: 
                logged_emp=0
            return logged_emp
            
    except Exception as e:
           logger_obj.error(e) 
       
#get state function here    
def get_state():
    """
            07-March-2018 PAR To HRMS  getting the currtent state of leave details  
            @param request: Request Object
            @type request : Object
            @return:   Response result
    """
    try:
        cur =lib.db_connection() 
        cur.execute("""select rf.id from reference_items rf inner join  reference_item_category  refc on refc.id=rf.refitems_category_id where rf.refitems_code='OPENN' and refc.refitem_category_code='LEVST'""")
        state_result=lib.dictfetchall(cur)
        if state_result: 
            state=state_result[0]['id']
            return state
        else:
            return ""
    except Exception as e: 
           logger_obj.error(e)
           
#leave balance update function here
def update_leave_balance(leave_id,employee_id,No_of_days,leave_type_id,leave_year):
    """
            07-March-2018 PAR To HRMS Updating leave balance   
            @param request: Request Object 
            @type request : Object 
            @return:   Response result
    """
    try:
        cur =lib.db_connection()
        cur.execute("""select number_of_days from leave_info where id =%s and is_active """,(leave_id,))
        old_res=lib.dictfetchall(cur)
        if old_res:   
            past_duration=old_res[0].get('number_of_days')  
            if past_duration:   
                HRMSLeaveBalanceUpdate(employee_id,No_of_days,leave_type_id,float(past_duration),"UPDATE",leave_year)# updating leave balanace
    except Exception as e: 
           logger_obj.error(e)  
           
           
def formated_date(date,mode):
    try:
        dstr='%Y-%m-%d'
        ds='%H~:%M~:%S'.split('~')
        space=" "
        if len(str(str(date).split('-')[2]).split(' '))>1:
            d= str(str(str(date).split('-')[2]).split(' ')[1]).split(':')
            for i in range(0,len(d)): 
                dstr+=space+ds[i]
                space=""
        if mode=='date':
            return datetime.datetime.strptime(date.strip(),dstr).strftime('%d/%m/%Y') 
        elif mode=='time': 
            return datetime.datetime.strptime(date.strip(),dstr).strftime('%d/%m/%Y %H:%M') 
             
        '''if mode=='date':
            return datetime.datetime.strptime(date, '%Y-%m-%d %H:%M:%S').strftime('%d/%m/%Y')
        elif mode=='time':
            return datetime.datetime.strptime(date, '%Y-%m-%d %H:%M:%S').strftime('%d/%m/%Y %H:%M')  
'''  
    except Exception as e:   
          logger_obj.error(e)  
          return date
def get_name(eid): 
    
    try:
       title_id=get_emp(eid,"title_id")
       title=get_refitems('refitems_name',int(title_id),'id') 
       first_name=get_emp(eid,"coalesce(name) as first_name")
       first_name=title+" "+first_name
       return first_name
    except Exception as e:
           logger_obj.error(e)
           return None
                               
def get_emp_id(column,table,tid): 
    
    try: 
       cur =lib.db_connection()
       get_emp_query="select {} from  {} where id =%s and is_active"
       get_emp_query=get_emp_query.format(column,table)
       cur.execute(get_emp_query,(tid,))
       emp_res=lib.dictfetchall(cur)
       if emp_res[0]:
           return emp_res[0]
    except Exception as e:
           logger_obj.error(e)
           return None
                                                         
#leave operations
@csrf_exempt
def HRMSCURDLeave(request): 
    ''' 
    02-Feb-2018 PAR To HRMS Leave create     
    @param request: Request Object       
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    ''' 
    try:
        logger_obj.info('HRMS leave CURD function by'+str(request.user.username))
        json_data = {}
        post = request.POST 
        
        data = post.get(config.datas)  
        leave_id =post.get(config.table_id) 
        data = json.loads(data) 
        delete_id =data[0].get(config.delete_id)    
        uid = request.user.id  
        if not uid:  
            uid = 1   
        
        org_values=get_organization(uid)    
        
        if org_values:
            org_id=org_values.get('id')
            emp_id=org_values.get('emp_id')   
        else:  
            org_id=0 
            emp_id=0 
          
        emp_type=data[0].get('emp') 
        if emp_type!="SELF" and emp_type !=None:    
            emp_id=data[0].get('emp')   
        cur=lib.db_connection() 
        if org_id and emp_id:    
            if data and not delete_id:  
                    reason=data[0].get('reason')       
                    reason_id=data[0].get('reject_reason_id_id')
                    if not leave_id:   
                               if data:     
                                    '''ur.execute("""     
                                    select rod.id, rod.role_title from  employee_info emp inner join leave_info lli  on leave_employee_id_id=emp.id inner join hcms_ti_role_details rod on rod.id=emp.role_id_id where emp.id=%s and rod.id in (
                                    select rd.id from  employee_info ei inner join leave_info li on leave_employee_id_id=ei.id  inner join hcms_ti_role_details rd on rd.id=ei.role_id_id 
                                    inner join reference_items ri on ri.id=li.state_id
                                    where  ri.refitems_code='OPENN' and 
                                    (li.from_date::DATE,li.to_date::DATE) OVERLAPS (%s ::DATE, %s::DATE)) group  by rod.id,rod.role_title
                                       """,(uid, data[0]['from_date'] ,data[0]['to_date'],)) 
                                    role_result=lib.dictfetchall(cur)    
                                    if role_result:     
                                        json_data[config.results]=config.ERR0032              
                                        return HttpResponse(json.dumps(json_data))'''     
                                    if emp_id:     
                                        cur.execute("""select li.id,li.description,li.from_date,li.to_date,lt.refitems_code  as leave_type_code from leave_info li
                                                    inner join organization_info  oi on oi.id=li.leave_org_id_id
                                                    inner join  reference_items lt on lt.id=li.type_id_id 
                                                     where (li.from_date::DATE >= %s::DATE or li.to_date::DATE >= %s::DATE )and (li.from_date::DATE <= %s::DATE or li.to_date::DATE <= %s::DATE)
                                                    and leave_employee_id_id=%s and li.is_active  and oi.is_active  and  li.reject_reason_id_id IS NULL 
                                                    --and lt.refitems_code !='PEMSN'
                                                        """,(data[0]['from_date'],data[0]['from_date'],data[0]['to_date'],data[0]['to_date'],emp_id,))
                                        leave_exits=lib.dictfetchall(cur)     
                                        permission=0     
                                        leave=0      
                                        if leave_exits:        
                                            for exist_leave in leave_exits:     
                                                if exist_leave.get("leave_type_code")=="PEMSN":
                                                     permission=1         
                                                else:           
                                                    leave=1             
                                            if leave==1:    
                                                json_data[config.results]=config.ERR0032            
                                                return HttpResponse(json.dumps(json_data))    
                                            elif permission==1: 
                                                permission_code=get_refitems('refitems_code',int(data[0].get('type_id_id')),'id')
                                                if permission_code=="PEMSN":      
                                                    json_dcata[config.results]="HALFONLY"             
                                                    return HttpResponse(json.dumps(json_data))     
                               state=get_state()       
                           #status = OrganizationInfo.objects.filter(name__icontains=data[0]['organization_name']).count()
                           #if status > 0:  
                           #    json_data[config.status_key] = config.status_already_exists  
                               status =LeaveInfo(type_id_id=int(data[0].get('type_id_id')), number_of_days=data[0].get('number_of_days'), from_date=data[0].get('from_date') , to_date=data[0].get('to_date'),
                                                        description=data[0].get('description'),leave_employee_id_id=emp_id,from_type_id=data[0].get('from_type'),to_type_id=data[0].get('to_type'),leave_org_id_id=int(org_id),is_active=True,state_id=state,created_by_id=int(uid))
                               status.save()   
                               json_data[config.results] = config.add_success 
                               leave_type=get_refitems('refitems_name',data[0].get('type_id_id'),'id')
                               subject=config.subject_content 
                               name=get_emp(emp_id,"coalesce(name||' '||last_name) as name")
                               first_name=get_name(emp_id)
                               
                               permission_code=get_refitems('refitems_code',int(data[0].get('type_id_id')),'id')
                               if permission_code=="PEMSN":  
                                   subject="Permission Request"
                                   formated_from=formated_date(data[0]['from_date'],'time') 
                                   formated_to=formated_date(data[0]['to_date'],'time')
                               else:
                                   formated_from=formated_date(data[0]['from_date'],'date')
                                   formated_to=formated_date(data[0]['to_date'],'date') 
                               subject_content=subject+" - "+name    
                               if leave_type ==0:     
                                   leave_type=""        
                               
                               if not formated_from:
                                   formated_from=data[0]['from_date']
                               if not formated_to:
                                   formated_t=data[0]['to_date']  
                               mail_body_content=config.mail_body_content.format(first_name,subject,"Web",leave_type,data[0]['description'],formated_from,formated_to)
                               if emp_id:       
                                   to_address=get_emp(emp_id,"work_email")    
                               try:
                                 stats=asyn_email(config.Transform_hcms,config.module_name,subject,to_address,mail_body_content,config.waiting)
                               except Exception as e:       
                                    logger_obj.error(e)          
                    else:           
                           state=get_state()         
                           if emp_id and data[0]['number_of_days'] and int(data[0]['type_id_id']):
                               if int(state)==int(data[0]['state']):   
                                   update_leave_balance(leave_id,emp_id,data[0]['number_of_days'],int(data[0]['type_id_id']),data[0].get("leave_year"))
                           
                           if reason and reason_id:
                                status = LeaveInfo.objects.filter(id=leave_id).update(type_id_id=int(data[0]['type_id_id']), number_of_days=data[0]['number_of_days'], from_date=data[0]['from_date'] , to_date=data[0]['to_date'],
                                                        description=data[0]['description'],leave_org_id_id=int(org_id),is_active=True ,state_id=data[0]['state'],from_type_id=data[0].get('from_type'),to_type_id=data[0].get('to_type'),reason=reason,reject_reason_id_id=reason_id,modified_by_id=int(uid))
                                m_reason=get_refitems('refitems_code',reason_id,'id') 
                                if m_reason == "OTHPS":
                                    mail_reason= "Reject Reason: "+reason  
                                else:
                                    mail_reason= "Reject Reason: "+get_refitems('refitems_name',reason_id,'id')
                                      
                           if not reason and not reason_id:
                                mail_reason="" 
                                status = LeaveInfo.objects.filter(id=leave_id).update(type_id_id=int(data[0]['type_id_id']), number_of_days=data[0]['number_of_days'], from_date=data[0]['from_date'] , to_date=data[0]['to_date'],
                                                       description=data[0]['description'],leave_org_id_id=int(org_id),is_active=True ,state_id=data[0]['state'],from_type_id=data[0].get('from_type'),to_type_id=data[0].get('to_type'),modified_by_id=int(uid))
                                #mail_reason=get_refitems('refitems_name',data[0].get('type_id_id'),'id')
                           json_data[config.results] = config.update_success
                           process_by=logged_employee(request)             
                           leave_type=get_refitems('refitems_name',data[0].get('type_id_id'),'id')   
                           if leave_type ==0:     
                               leave_type=""      
                           if int(state)!=int(data[0]['state']): 
                               subject=config.subject_content   
                               permission_code=get_refitems('refitems_code',int(data[0].get('type_id_id')),'id')
                               if permission_code=="PEMSN":
                                   formated_from=formated_date(data[0]['from_date'],'time') 
                                   formated_to=formated_date(data[0]['to_date'],'time')
                                   subject="Permission Request"  
                               else:  
                                   formated_from=formated_date(data[0]['from_date'],'date')      
                                   formated_to=formated_date(data[0]['to_date'],'date')    
                               process_mail_emp=get_emp_id('leave_employee_id_id','leave_info',leave_id)
                               if process_mail_emp:
                                   mail_emp_id=process_mail_emp.get("leave_employee_id_id")
                               else:
                                   mail_emp_id=0   
                               subject_content=subject              
                               send_mail(subject_content,leave_type,data[0]['description'],data[0]['state'],mail_emp_id,process_by,formated_from,formated_to,mail_reason,"Web") 
            else:  
                    referred_record = record_validation('leave_info', delete_id) 
                    if referred_record:
                        try: 
                            cur.execute("""select leave_employee_id_id,type_id_id,number_of_days,to_char(from_date, 'DD-MM-YYYY') AS from_date from leave_info where id=%s""",(delete_id,))
                            balance_update=lib.dictfetchall(cur)
                            if balance_update: 
                                b_u=balance_update[0] 
                                from_date=b_u.get("from_date") 
                                from_d=from_date.split("-")
                                HRMSLeaveBalanceUpdate(b_u.get('leave_employee_id_id'),b_u.get('number_of_days'),b_u.get('type_id_id'),"NOT","RJT",str(from_d[2]))
                        except Exception as e:
                            logger_obj.error(e)
                        status =  LeaveInfo.objects.filter(id=delete_id).update(is_active="False",modified_by_id=int(uid))
                        json_data[config.results] = config.delete_success
                    else:  
                        json_data[config.results] = status_code.ERR0028     
            logger_obj.info('HRMS leave CURD function response is'+str(json_data)+"attempted by"+str(request.user.username))
        else:   
            json_data[config.results] ="NOEMP"
                                   
    except Exception as e:
        logger_obj.error(e)  
        json_data[config.results] = e
    return HttpResponse(json.dumps(json_data)) 

#get time function here
def GetTime(sec):
    try:
        if sec:   
            dis=""
            permission=str(datetime.timedelta(seconds=sec))
            perm=permission.split(':')
            if 0 < int(perm[0]):
                dis+= perm[0] + '  Day '
            else:
                dis+=""
            if 0 < int(perm[1]):
                dis+= perm[1]+ '  Hour '   
            else:
                dis+=""
            if 0< int(perm[2]):
                dis+= perm[2]+ '  Minutes '
            else:
                dis+=""
            return dis
    except Exception as e:
            logger_obj.error(e)
            return sec
        
#leave row click function here
@csrf_exempt 
def HRMSLeaveRowClick(request): #to show all company related informations in a table
    ''' 
    09-Feb-2018 PAR To HRMS Row click for leave table
    @param request: Request Object 
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    try:
        json_data={}
        logger_obj.info('HRMS leave row click function by'+str(request.user.username))  
        leave_row_id=int(request.GET[config.leave_id])
        if request.method=='GET':
            cur=lib.db_connection()
            leave_request_table_row_click=query.fetch_hcms_query(config.leave,config.leave_request_table_row_click)
            if leave_request_table_row_click:
                cur.execute(leave_request_table_row_click%(leave_row_id))
            values=cur.fetchall()
            keys = config.leave_request_table_row_click_key
            dic = {}  
            dic = list(dict(zip(keys,j)) for j in values) 
            try:
                if dic[0].get('leave_type')=='Permission':
                    dic[0].update({'number_of_days':GetTime(dic[0].get('number_of_days'))})
            except Exception as e:
                    logger_obj.error(dic) 
            commit = lib.db_commit(cur) 
            close = lib.db_close(cur)    
            logger_obj.info('HRMS leave row click function response is'+str(dic)+"attempted by"+str(request.user.username)) 
        return HttpResponse(json.dumps(dic))   
    except Exception as e:   
        logger_obj.error(e)         
        json_data[config.status] = e   
    return HttpResponse(json.dumps({'results':json_data}))  

#leave data function here    
@csrf_exempt   
def HRMSLeavetable(request): #to show all company related informations in a table 
    '''   
    12-Feb-2018 PAR To HRMS leave deatails    
    @param request: Request Object  
    @type request : Objects   
    @return:   HttpResponse or Redirect the another URL
    '''
    try:
        logger_obj.info('HRMS leave table function by'+str(request.user.username))
        json_datas = {}         
        if request.method=='GET' or request.method=='POST':
            type=request.POST.get('type')
            cur=lib.db_connection()#to_char(hr_leave.created_date, 'MM-DD-YYYY HH24:MI:SS') AS raised_date,
            user_id = request.user.id
            if type=="TABLE": 
                role_id=1
                dic = {}
                if user_id:
                    leave_request_table=query.fetch_hcms_query(config.leave,config.leave_request_table_user)
                    if leave_request_table: 
                        cur.execute(leave_request_table %(user_id,user_id,))   
                        #values=cur.fetchall()  
                        dicv=lib.dictfetchall(cur) 
                        try:
                            for d in dicv: 
                                if d.get('refitems_desc')=='Permission':  
                                    d.update({'number_of_days':GetTime(d.get('number_of_days'))})  
                        except Exception as e: 
                            logger_obj.error(e)                                                                      
                json_datas['datas'] = dicv                                                                                                                                                                                                    
            elif type=="PER":   
                type_id=request.POST.get('type_id')
                from_date=request.POST.get('from_date')   
                if user_id:    
                    emp_id=logged_employee(request) 
                    cur.execute('''select count(li.id) permission_count from leave_info li
                                   inner join reference_items st on st.id=li.state_id
                                   where leave_employee_id_id=%s and type_id_id=%s and li.is_active
                                   and date_part('year',li.from_date) = date_part('year','%s'::date)
                                   and date_part('month',li.from_date) = date_part('month','%s'::date)  '''%(emp_id,type_id,from_date,from_date,))
                    per_res=lib.dictfetchall(cur)  
                json_datas['datas'] = per_res   
            commit =lib.db_commit(cur)  
            close = lib.db_close(cur) 
            logger_obj.info('HRMS leave table response is'+str(json_datas)+"attempted by"+str(request.user.username))
             
            return HttpResponse(json.dumps(json_datas)) 
    except Exception as e:     
       logger_obj.error(e)  
       json_datas['datas'] = []
    return HttpResponse(json.dumps(json_datas))

#get leave types function here
def gender_leave_types(request,leave_type_res):
    ''' 
    82-june-2018 PAR To HRMS Leave type based on Gender 
    @param request: Request Object 
    @type request : Object  
    @return:   HttpResponse or Redirect the another URL
    '''
    try:
        user_id = request.user.id
        cur =lib.db_connection()
        cur.execute(" select r.refitems_code from auth_user a inner join employee_info e on e.related_user_id_id= a.id inner join reference_items r on r.id=e.employee_gender_id where a.id=%s",(user_id,))
        values=cur.fetchall()
        if values:
            gender=values[0][0]
            if gender=="MALEE":
                for i in leave_type_res:
                    if i.get("refitems_code")=="MTNTL":
                        leave_type_res.remove(i) 
                        return leave_type_res
            elif gender=="FMALE":
                for i in leave_type_res:
                    if i.get("refitems_code")=="PTNTL":
                        leave_type_res.remove(i)
                        return leave_type_res   
            else:
                 return leave_type_res
    except  Exception as e:
        logger_obj.error(e)
        
#leave drop down function here
def HRMSLeaveDropdown(request):
    ''' 
    09-Feb-2018 PAR To HRMS Leave type drop down
    @param request: Request Object
    @type request : Object 
    @return:   HttpResponse or Redirect the another URL
    ''' 
    try:
        logger_obj.info('HRMS leave drop down function by'+str(request.user.username))
        user_id = request.user.id
        get = request.GET
        reject_reason_value = get.get("reject_reason_select")
        leave_type_value = get.get("leave_type_select")
        if request.method == config.request_id:
            
            cur =lib.db_connection()
            leave_approval_status_result = {} 
            if reject_reason_value: 
                 leave_approval_status_query = loadRefItems(request,config.leave_rejected_reason) 
            elif leave_type_value:
                leave_approval_status_query = loadRefItems(request,config.leave_type_status)
                if leave_approval_status_query:
                    leave_approval_status_query=gender_leave_types(request,leave_approval_status_query)
            else:
                leave_approval_status_query = loadRefItems(request,config.leave_approval_status)    
            if leave_approval_status_query:
                leave_approval_status_result = leave_approval_status_query
            else:  
                leave_approval_status_result = {config.status:config.value_empty}
            commit = lib.db_commit(cur)
            close = lib.db_close(cur)       
        else:
            leave_approval_status_result = {config.status:config.request_failed}
    except Exception as e: 
        logger_obj.error(e) 
        leave_approval_status_result = str(e)   
    return HttpResponse(json.dumps(leave_approval_status_result))     

# holiday_list_date view functions
def holiday_list_date(request):
    """
    09-Feb-2018 PAR To HRMS Function to get value from leave balance table
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    """  
    try:
        logger_obj.info('HRMS holiday list date function by'+str(request.user.username))
        if request.method==config.request_id:
            first_date = request.GET[config.firstDate]
            second_date = request.GET[config.secondDate]
            
            first_data = first_date.split(' ')
            second_data = second_date.split(' ')
            if first_date and second_date:
                cur =lib.db_connection()
                holiday_list_date = {}
                uid=request.user.id
                if uid:
                    org_values=get_organization(uid)
                    if org_values:
                        org_id=org_values.get('id')
                        emp_id=org_values.get('emp_id')
                        org_unit_id=org_values.get('org_unit_id') 
                        leave_days_list = query.fetch_hcms_query(config.leave,config.leave_days_list)
                        if leave_days_list:
                            cur.execute(leave_days_list%(str(first_data[0]),str(second_data[0]),org_id,org_unit_id )) 
                            values = cur.fetchall()
                            if values:
                                keys = config.leave_days_list_key  
                                holiday_list_date = list(dict(zip(keys,j)) for j in values)  
                                commit = lib.db_commit(cur)
                                close = lib.db_close(cur)
                            else:
                                holiday_list_date = {config.status:config.value_empty}
                        else:
                            holiday_list_date = {config.status:config.value_empty}          
            else:
                holiday_list_date = {config.status:config.value_empty}            
        else:
            holiday_list_date = {config.status:config.request_failed} 
    except Exception as e:
         logger_obj.error(e)   
         holiday_list_date = e
    return HttpResponse(json.dumps(holiday_list_date))    

#load reference item details here
def loadRefItems(request,ref_ctg_code):
    try:
        logger_obj.info('reference item loading function by'+str(request.user.username))
        if ref_ctg_code:
            ref_ctg_code=ref_ctg_code
            cur=connection.cursor()
            result_data = {}
            cur.execute("""select rfitm.refitems_name,rfitm.refitems_code,rfitm.id from reference_items  rfitm inner join
                        reference_item_category rfctg on rfitm.refitems_category_id = rfctg.id  where rfctg.refitem_category_code = %s""",(ref_ctg_code,))  
            values = cur.fetchall()
            if values:
                keys = ['refitems_name','refitems_code','refitems_id']
                result_data = list(dict(zip(keys,j)) for j in values)
            else:
                result_data = "Value is empty"
            logger_obj.info('reference item loading response is'+str(result_data)+"attempted by"+str(request.user.username))      
        else:
            dic = {"Request Failed"}               
    except Exception as e:   
            logger_obj.error(e)   
            result_data= e
    return result_data

# to get leave remaining days for particular leave type
@csrf_exempt 
def HRMSLeaveBalanceCalculation(request):
    ''' 
        10-Feb-2018 PAR To HRMS Leave balance calculation
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL  
    ''' 
    leave=[]   
    #global logged_emp 
    limit=[]
    json_data=[]
    try:
        logger_obj.info('Leave balance calculation function by'+str(request.user.username))
        if request.method=='POST':
            emp=request.POST.get('emp')
            if emp=="SELF": 
                employee_id=logged_employee(request)  
            else:
                employee_id=emp 
            leave_type_id=str(request.POST[config.leave_id])  
            year=request.POST.get('year')
            year_id=get_refitems('id',year,'refitems_name') 
            if year_id !=0:
                if employee_id !=0 and employee_id:
                    cur=lib.db_connection()    
                    if cur:  
                        leave_balance_query=query.fetch_hcms_query(config.leave,config.leave_balance_query)
                        if leave_balance_query:
                            cur.execute(leave_balance_query%(employee_id,leave_type_id,year_id)) 
                        values=cur.fetchall()  
                    else:
                        jsnon_data=config.leave_connection_error
                    if values:  
                       for s in values:
#                         if s[0]==0: 
#                             leave=status_code.ERR0022  
#                         else: 
                            limit=str(s[0])
                            leave.append(limit)   
                            if len(values)>1:
                                logger_obj.error("Duplicate Entry In Leave Balance") 
                                del leave[-1] 
                    else:  
                        leave=status_code.ERR0022 
                    commit = lib.db_commit(cur) 
                    close = lib.db_close(cur) 
            if employee_id==0: 
               leave=status_code.ERR0021  
            logger_obj.info('Leave balance calculation response is'+str(leave)+"attempted by"+str(request.user.username))
        if not leave:
            leave=status_code.ERR0022
        return HttpResponse(json.dumps(leave))    
    except Exception as e: 
         logger_obj.error(e)   
         json_data= e   
    return HttpResponse(json.dumps(json_data))

#leave employee list function here
def HRMSLeaveEmployeeList(request):
    """
            09-March-2018 PAR To Search by employee name  
            @param request: Request Object
            @type request : Object
            @return:   HttpResponse or Redirect the another URL
            @author: PAR 
             
    """
    try:
        logger_obj.info('Leave Employee search function by'+str(request.user.username))
        user_id=request.user.id
        cur=lib.db_connection()
        res={}
        if request.method=='POST': 
            emp_name=str(request.POST["employee_name"]).strip()
            type=str(request.POST["type"])
            if emp_name:
                emp_name="%"+emp_name+"%"
        if cur:
            if type=="open":
                leave_employee_query=query.fetch_hcms_query(config.leave,config.leave_employee_list)
                if leave_employee_query:
                    cur.execute(leave_employee_query %(user_id,emp_name))
                    values=cur.fetchall()
                    res["values"]=values
            elif type=="past":
                leave_employee_query=query.fetch_hcms_query(config.leave,config.leave_employee_list_past)
                if leave_employee_query:
                    cur.execute(leave_employee_query %(user_id,emp_name))
                    values=cur.fetchall()
                    res["values"]=values
        return HttpResponse(json.dumps(res))  
        logger_obj.info('Leave Employee search response is'+str(leave)+"attempted by"+str(request.user.username))
    except Exception as e:
        logger_obj.error(e) 
        res["error"]=e
        return HttpResponse(json.dumps(res))  
def get_role(employee_id):
    try:
        cur = connection.cursor() 
        role_query=query.fetch_hcms_query(config.leave,config.leave_employee_role_query)
        cur.execute(role_query%(employee_id,)) 
        role=lib.dictfetchall(cur)
        if role:
            role=role[0].get("name")
        else:
            role=None
        return role
    except Exceptio as e:
        logger_obj.error(e) 
#leave process data function here
def HRMSLeaveProcessData(request):
    """
            13-Feb-2018 PAR To HRMS Process leave data. And also check the user authentication 
            @param request: Request Object
            @type request : Object
            @return:   HttpResponse or Redirect the another URL
            @author: PAR 
             
    """ 
    json_dat=[]
    json_data={}
    dic = {} 
    company_result=[]
    if request.method=='POST':  
            type=str(request.POST[config.type])   
    if request:  
        logger_obj.info('Leave process data function by'+str(request.user.username))
        cur=lib.db_connection()   
        user_id = request.user.id 
        emp_id=logged_employee(request) 
        print"EMP_IDDDDDDDD",emp_id  
        raw_query=query.fetch_hcms_query(config.leave,config.leave_allocation_data_company)
        role_title=get_role(user_id)
        print"ROLEE",role_title  
        if cur: 
            if user_id:
                cur.execute(query.fetch_hcms_query(config.leave,config.leave_process_org),(user_id,))
                org_value=lib.dictfetchall(cur)  
                if org_value:
                    company_result=org_value[0]['org_id_id'] 
            if company_result:
                    
                    if str(type)=="open":
                        
                        #raw_query=query.fetch_hcms_query(config.leave,config.leave_allocation_data_company)
                        raw_query=query.fetch_hcms_query(config.leave,config.leave_allocation_data_all_company)
                        role_title=get_role(user_id)
                        print"ROLEE",role_title
                        if role_title: 
                           if role_title=="HCM" or role_title=="Employee GML": 
                               cond=""
                           else: 
                               cond='and employee_info.reporting_officer_id='+str(emp_id)
                        process_query=raw_query.format(str(cond))
                        #cur.execute(process_query,(company_result,))
                        cur.execute(process_query)
                    elif str(type)=="past": 
                       #raw_query= query.fetch_hcms_query(config.leave,config.leave_all_request_data_company)
                       raw_query=query.fetch_hcms_query(config.leave,config.leave_allocation_data_all_company)
                       role_title=get_role(user_id) 
                       print"ROLEE",role_title
                       if role_title: 
                           if role_title=="HCM" or role_title=="Employee GML":
                               cond="" 
                           else:
                               cond='and employee_info.reporting_officer_id='+str(emp_id)   
                       process_query=raw_query.format(cond)  
                       #cur.execute(process_query,(company_result,)) 
                       cur.execute(process_query)  
            else:    
                if str(type)=="open": 
                    leave_allocation_query=query.fetch_hcms_query(config.leave,config.leave_allocation_data) 
                    cur.execute(leave_allocation_query%(emp_id,))  
                elif str(type)=="past": 
                        leave_all_request_query=query.fetch_hcms_query(config.leave,config.leave_all_request_data)
                        cur.execute(leave_all_request_query%(emp_id,))  

            	
            #values=cur.fetchall()   
            dicv=lib.dictfetchall(cur)
            try:
                 
                for d in dicv: 
                    if d.get('leave_type')=='Permission' or d.get('type')=='Permission'  :
                         d.update({'number_of_days':GetTime(d.get('number_of_days'))}) 
                if not  dicv:
                    #  keys = config.leave_allocation_data_key
        #                 dic = list(dict(zip(keys,j)) for j in values)
        #             else:
                    json_dat=config.no_leave_approvel
            except Exception as e:
                logger_obj.error(e) 
                 
        else: 
            json_dat=config.leave_connection_error 
        logger_obj.info('Leave process data response is'+str(json_dat)+"attempted by"+str(request.user.username))        
        commit =lib.db_commit(cur)
        close =lib.db_close(cur)
    #except Exception as e:
     #   logger_obj.error(e)   
      #  print"EEEEEEEEEE",e
        #return HttpResponse(json.dumps({config.leave_status:str(e)}))
    return HttpResponse(json.dumps(dicv))    

# Table row click view functions
def HRMSLeaveProcessRowClick(request):
            """
            13-Feb-2018 PAR To HRMS Process leave row click 
            @param request: Request Object 
            @type request : Object
            @return:   HttpResponse or Redirect the another URL
    """
            if request.method=='GET':
               leave_id= int(request.GET[config.leave_id])
               try:
                    logger_obj.info('Leave process row click function by'+str(request.user.username))
                    cur=lib.db_connection()
                    if cur:
                        cur.execute("(select  ly.id from leave_info li inner join reference_items ly on li.type_id_id=ly.id  where li.id=%s and ly.refitems_name  in ('Permission','Leave of Absence'))"%(leave_id))
                        leave_type_check=cur.fetchall() 
                        if leave_type_check:
                            leave_allocation_row_click=query.fetch_hcms_query(config.leave,config.leave_allocation_row_click_permission)
                        elif not leave_type_check:
                            leave_allocation_row_click=query.fetch_hcms_query(config.leave,config.leave_allocation_row_click)
                        if leave_allocation_row_click:  
                            cur.execute(leave_allocation_row_click%(leave_id))
                    values=cur.fetchall()     
                    if values:   
                        keys =config.leave_allocation_row_click_key  
                        dic = {}   
                        dic = list(dict(zip(keys,j)) for j in values)  
                    else:
                        dic=config.leave_process_delete_id_mismatch  
                        logger_obj.error(dic)
                    try:
                        if dic[0].get('leave_type')=='Permission':  
                            dic[0].update({'duration':GetTime(dic[0].get('duration'))})
                    except Exception as e:  
                        logger_obj.error(dic)
                    commit = lib.db_commit(cur) 
                    close = lib.db_close(cur) 
                    logger_obj.info('Leave process row click response is'+str(dic)+"attempted by"+str(request.user.username)) 
               except Exception as e:
                   logger_obj.error(e)
                   return HttpResponse(json.dumps({config.leave_status:e}))
            return HttpResponse(json.dumps(dic))     
        
#leave balance update function here
def HRMSLeaveBalanceUpdate(employee_id,No_of_days,leave_type_id,past_duration,type,leave_year):
    result=[] 
    json_data=[]
    try:
        cur=lib.db_connection()      
        if cur:  
            year_id=get_refitems('id',str(leave_year),'refitems_name')
            leave_balance_query=query.fetch_hcms_query(config.leave,config.leave_balance_query)
            if leave_balance_query:     
                cur.execute(leave_balance_query%(employee_id,leave_type_id,year_id))      
                values=cur.fetchall()  
            if values:
                day=values[0][0]  
                if type=="SELF": 
                    remaing_day=day-float(No_of_days)
                elif type=="RJT":  
                    remaing_day=float(day)+float(No_of_days)     
                elif type=="UPDATE":  
                    no_day=float(past_duration)-float(No_of_days)
                    if no_day>0:     
                        remaing_day=float(day)+float(No_of_days)      
                    elif no_day<0:   
                        No_of_days=float(no_day)-(no_day+no_day)    
                        remaing_day=float(day)-float(No_of_days)     
                    elif no_day==0:      
                        return True    
                created_date = format(datetime.datetime.now())   
                modified_date = format(datetime.datetime.now())   
                tble_name = config.hr_leave_balance      
                keys=[]        
                val=[]     
                keys.append(config.leave_days)    
                val.append(str(remaing_day)) 
                keys.append(config.employee_id_id)    
                val.append(str(employee_id))     
                keys.append(config.leave_type_id_id)   
                val.append(str(leave_type_id))
                try:  
                    if tble_name and keys and val:
                        table_val=[] 
                        count = 0  
                        for key in range(len(keys)):#Fetching key and Value
                            table_val.append(keys[count]+"='" + val[count]+"'")
                            count += 1
                        s=(",".join(str(i) for i in table_val))  
                        cur.execute(query.fetch_hcms_query(config.leave,config.leave_balance_update)%(s,int(employee_id),int(leave_type_id)))
                        json_data=config.Updated_Success
                    else:    
                        json_data=config.leave_update_error                          
                        return HttpResponse(json.dumps({config.leave_status:json_data,config.leave_id:uid}))  
                except Exception as e:
                    logger_obj.error(e) 
                    return json_data# HttpResponse(json.dumps({config.leave_result:e,config.leave_status:json_data}))  
        else:   
            json_data=config.leave_connection_error 
    except Exception as e: 
       logger_obj.error(e)
    return json_data#HttpResponse(json.dumps(json_data))

# Table row click view functions 
def HRMSLeaveProcessBalanceUpdate(request): 
    """ 
            13-Feb-2018 PAR To HRMS Process leave balance update 
            @param request: Request Object   
            @type request : Object    
            @return:   HttpResponse or Redirect the another URL  
    """  
    json_data=[] 
    logger_obj.info('Leave process balance update function by'+str(request.user.username))
    if request.method=='POST':  
            leave_type_id=str(request.POST[config.type_id]) 
            No_of_days=request.POST[config.number_of_days] 
            emp=request.POST.get('emp')  
            type=request.POST.get('type')   
            leave_year=request.POST.get('leave_year')
            if emp =="SELF":    
                employee_id=logged_employee(request)  
                type='SELF'
            elif type=="BEHALF":
                employee_id=emp       
                type='SELF' 
            else:   
                type="RJT"
                employee_id=emp  
            if employee_id and No_of_days and leave_type_id:
                HRMSLeaveBalanceUpdate(employee_id,No_of_days,leave_type_id,"NOT",type,leave_year)
    logger_obj.info('Leave balance update response is'+str(json_data)+"attempted by"+str(request.user.username))
    return HttpResponse(json.dumps(json_data))
    
#get date function here     
def get_date(date): 
    if date:   
        day=date.split('-')  
        del day[2]   
    if day:
        return day     
    
#leave calendar function here   
def HRMSLeaveCalendar(request): 
    """ 
            12-oct-2018 PAR To HRMS Leave history calendar And also check the user authentication  
            @param request: Request Object  
            @type request : Object  
            @return:   HttpResponse or Redirect the another URL  
            @author: PAR 
    """     
    json_dat=[]   
    json_data={}     
    dic = {}  
    company_result=[] 
    if request.method=='POST':   
            type=str(request.POST[config.type])     
    try:  
        logger_obj.info('Leave History calendar function by'+str(request.user.username)) 
        
        icon={'SICKL':'nf nf-bed leave-sick','CASHL':'nf nf-rest leave-casual','MTNTL':'nf nf-maternity-leave leave-Maternity','PTNTL':'nf nf-paternity-leave leave-paternity ','CMPOF':'nf nf-alarm leave-combo','PEMSN':'nf nf-duration-1 leave-permission','LEABS':'nf nf-attendance-detail leave-absebce','ERNLV':'nf nf-challange leave-earned '}
        cur=lib.db_connection()    
        user_id = request.user.id    
        emp_id=""  
        if type=='ADMIN':       
            emp_id=request.POST.get('emp_id')    
        if type=='USER':      
            emp_id=logged_employee(request)      
        if emp_id:      
            if cur and user_id:     
                cur.execute("""  
                        select li.id ,li.leave_employee_id_id,to_char(generate_series((li.from_date ),(li.to_date), '1 day'::interval),'DD-MM-YYYY')as leave_days,ly.refitems_name as leave_type,
                        ly.refitems_code as leave_code,li.number_of_days  from leave_info li
                        inner join reference_items ly on ly.id=li.type_id_id 
                        inner join reference_items st on st.id=li.state_id 
                        where li.leave_employee_id_id=%s and   (st.refitems_code='APPRV' or st.refitems_code='OPENN') and li.is_active and ly.is_active and date_part('year',li.from_date) = date_part('year', CURRENT_DATE) and date_part('year',li.to_date) = date_part('year', CURRENT_DATE) """%(str(emp_id)))
                leave_history=lib.dictfetchall(cur) 
                leave_days=[]         
                if leave_history: 
                    data_list=[]    
                    for lv in leave_history:  
                        data_list=get_date(lv.get('leave_days'))  
                        data_list.append(lv.get('leave_type')) 
                        data_list.append(icon.get(lv.get('leave_code')))  
                        data_list.append(lv.get('leave_code'))         
                        leave_days.append(data_list)                                                                                                                                                                 
                    if leave_days: 
                        json_data['vals']=leave_days  
                else:      
                    json_data['vals']=[]
                
               
            else: 
                json_data['vals']=config.leave_connection_error   
        elif type=='drop':  
            if user_id:
                leave_employee=query.fetch_hcms_query(config.leave,config.employee_list_fetch_sel)
                if leave_employee:
                    cur.execute(leave_employee)      
                    values=lib.dictfetchall(cur)   
            json_data['vals'] = values  
        elif type=='CHART':    
            emp=request.POST.get('emp')
            user_id=request.user.id
            final_dict={} 
            emp_id=""    
            if emp !='USER': 
                emp_id=emp    
            elif emp=='USER':       
                emp_id=logged_employee(request)      
            if user_id and emp_id:   
                    leave_type={'LEABS':'LA','CASHL':'CL','SICKL':'SL','CMPOF':'CO','ERNLV':'EL'} 
                    color={'LEABS':'#d783fd','CASHL':'#28e8c3','SICKL':'#5dc1ff','CMPOF':'#fda283','ERNLV':'#fad666'}  
                    color1={'LEABS':'#eac1fd','CASHL':'#89ffe7','SICKL':'#bbe5fe','CMPOF':'#fdd2c2','ERNLV':'#faeab9'}
                    year=date.today().year   
                    d=date.today()       
                    quater=[str(year)+'-'+'01-01',str(year)+'-'+'03-31',str(year)+'-'+'04-01',str(year)+'-'+'06-30' ,str(year)+'-'+'07-01',str(year)+'-'+'09-30' ,str(year)+'-'+'10-01',str(year)+'-'+'12-31']
                    que='''select ly.id,ly.refitems_name,ly.refitems_code,coalesce(gs.leave_days,'0') leave_days,coalesce(sum(lb.allocated_leave_days)/4,'0') allocated_leave_days from reference_items  ly left join
                            reference_item_category lyc on ly.refitems_category_id = lyc.id  
                            left join leave_balance_info lb on lb.leave_type_id_id=ly.id and lb.employee_id_id={}
                            left join reference_items yr on yr.id=lb.year_id 
                            left join employee_info e on e.id={}  
                            left join (   
                                 select count(*) as leave_days,li.type_id_id,li.description from leave_info li,generate_series(li.from_date,li.to_date, '1 day'::interval) as d 
                                 where extract(QUARTER from d::date)={} and li.leave_employee_id_id={}  and date_part('year',li.from_date) = date_part('year', CURRENT_DATE) and date_part('year',li.to_date) = date_part('year', CURRENT_DATE)
                                 
                                 group by li.type_id_id  ,li.description
                                 ) as gs on gs.type_id_id=ly.id 
                            where lyc.refitem_category_code = 'LEVTY' and ly.refitems_code not in ('PTNTL','MTNTL','PEMSN')  and  ( extract(year from  e.date_of_confirmation)< extract(year from now())   
                            or extract(QUARTER from  e.date_of_confirmation ) <={})
                            and date_part('year', CURRENT_DATE)=cast(yr.refitems_name as float) and yr.is_active
                            group by ly.id,gs.leave_days, e.date_of_confirmation order by ly.id  
                        '''       
                    inc=0            
                    for i in range(1,5):               
                        #chart_dict={}         
                        chart_val=[]      
                        chart_dict= OrderedDict()         
                        q=que.format(emp_id,emp_id,i,emp_id,i)      
                        cur.execute(q)
                        res=lib.dictfetchall(cur)   
                        for r in res: 
                            chart_dict={'category':leave_type.get(r.get('refitems_code')),'column-1':r.get('allocated_leave_days'),'color':color.get(r.get('refitems_code')),'column-2':r.get('leave_days'),'color1':color1.get(r.get('refitems_code'))}
                            chart_val.append(chart_dict)       
                        final_dict['quater_'+str(i)]=chart_val   
            json_data['vals'] =final_dict   
        elif type=='HOLYDAY':       
            emp_id=logged_employee(request)  
            if cur and user_id and emp_id:   
                icon={'common':'nf nf-car-1 leave-public'}
                emp_id=logged_employee(request)     
                cur.execute(""" 
                            select hli.id,ei.name,hli.holiday_information, to_char(hli.holiday_date,'DD-MM-YYYY') holiday_date,yr.id from holiday_list_info hli 
                            inner join organization_info   oi on oi.id=hli.org_id_id 
                            inner join organization_unit_info  oui on oui.id=hli.org_unit_id_id
                            inner join employee_info ei on ei.id=%s
                            inner join reference_items yr on yr.id=hli.year_id
                            where hli.is_active and oi.is_active and oui.is_active and ei.is_active and ei.org_id_id=oi.id and ei.org_unit_id_id=oui.id and date_part('year', CURRENT_DATE)=cast(yr.refitems_name as float)
                            """%(emp_id))  
                holiday_history=lib.dictfetchall(cur)
                holi_days=[]   
        
                if holiday_history:    
                    data_list=[]     
                    for hd in holiday_history:      
                        data_list=get_date(hd.get('holiday_date'))   
                        data_list.append(hd.get('holiday_information'))   
                        data_list.append(icon.get('common'))      
                        holi_days.append(data_list)                                                                                                                                                            
                    if holi_days:    
                        json_data['vals']=holi_days 
                else:   
                    json_data['vals']=[] 
        
            else:  
                json_data['vals']=config.leave_connection_error 
        
        elif type=='LATE':
            icon={'common':'nf nf-circle-1 leave-late'} 
            emp_id=logged_employee(request) 
            if emp_id:
                cur.execute("select id, employee_id_id, to_char(check_in ,'DD-MM-YYYY') as check_in from attendance_info  where check_in::time >'08:15:00'::time and employee_id_id=%s and date_part('year',CURRENT_DATE) =date_part('year',check_in) and EXTRACT(DOW FROM check_in::date) NOT IN (0, 6) and is_active "%(str(emp_id)))  
                late_arival=lib.dictfetchall(cur)
                late_days=[]   
                if late_arival:     
                    data_list=[]    
                    for la in late_arival:
                        data_list=get_date(la.get('check_in'))    
                        data_list.append('Late Arrival')      
                        data_list.append(icon.get('common'))     
                        late_days.append(data_list) 
                # For getting project hours and HR hours 
                cur.execute(""" 
                            select * from
                            (select hrpdts.id,to_char(hrpdts.check_in,'DD-MM-YYYY') as check_in,hrpdts.check_in_time,
                            case when not hrpdts.meeting_hours = '' then to_char(((hrpdts.summary_hours)::decimal|| ' hour')::interval + hrpdts.meeting_hours::interval,'HH24:MI:SS')
                            else  to_char(((hrpdts.summary_hours)::decimal|| ' hour')::interval,'HH24:MI:SS') end as project_hrs,hrpdts.hr_hours
                            from hr_project_details hrpdts
                            inner join employee_info emp on emp.related_user_id_id = hrpdts.user_id
                            where 
                            date_part('year',hrpdts.check_in) = date_part('year', CURRENT_DATE)and 
                            hrpdts.day_name not in ('Saturday','Sunday') and hrpdts.user_id = %s
                            order by hrpdts.username)a
                            where a.project_hrs < '08:00:00'
                            or hr_hours < '08:00:00'
                 """%(user_id))
                try:
                    icon={'task_hours':'nf nf-working-time leave-combo-project'}   
                    task_hours=lib.dictfetchall(cur)
                    if task_hours:     
                        data_list=[]    
                        for th in task_hours:   
                            data_list=get_date(th.get('check_in'))    
                            data_list.append('Project Hours:'+th.get('project_hrs')+" "+'HR Hours:'+th.get('hr_hours'))      
                            data_list.append(icon.get('task_hours'))     
                            late_days.append(data_list)
                except Exception as e:  
                    logger_obj.error(e)    
                if late_days:  
                    json_data['vals']=late_days
                else:    
                    json_data['vals']=[]
                        
                        
                        
        logger_obj.info('Leave History calendar  data response is'+str(json_dat)+"attempted by"+str(request.user.username))        
        close =lib.db_close(cur) 
    except Exception as e: 
           logger_obj.error(e)    
           return HttpResponse(json.dumps({config.leave_status:str(e)}))
    return HttpResponse(json.dumps(json_data))

#leave type function here 
@csrf_exempt
def Leave_Type_mobile(request):     
    try:
        cur = connection.cursor()
        cur.execute(""" select ri.id as Leave_Type_ID, ri.refitems_name as Leave_Type from reference_items ri
        inner join reference_item_category ric on ric.id = ri.refitems_category_id
        where ric.refitem_category_code = 'LEVTY' and ri.is_active = True order by refitems_name; """)
        res=query.dictfetchall(cur)
        cur.execute(""" select ri.id as Day_Type_ID, ri.refitems_name as Day_Type from reference_items ri
        inner join reference_item_category ric on ric.id = ri.refitems_category_id
        where ric.refitem_category_code = 'DTYPE' and ri.is_active = True order by refitems_name; """)
        results=query.dictfetchall(cur)
        return HttpResponse(json.dumps({'status':'success','message':'Success','data':res, 'Day_Type_Data':results}))
    except Exception as e:
        return HttpResponse(json.dumps({'status':'failure','message':e}))

#leave status mobile funtion here
@csrf_exempt
def Leave_Status_mobile(request): 
    response = ''
    print"RESSSSSSSSSSSS",request.body
    try:
        body = request.body
        print"BODY+++++++++++++++++", body
        try:
            data = json.loads(body)
            data = ast.literal_eval(data)
        except:  
            data = json.loads(body)
        else:
            data = json.loads(body)
            data = json.loads(data)   
        print"DATA===================",data 
        if data: 
            user_id = data['user_id']
            print"USER_ID___________________________________",user_id
            cur = connection.cursor()
            cur.execute("""   
select a.id,a.refitems_desc as leave_type,a.description as reason,a.from_date,a.to_date,round( CAST(float8 (a.number_of_days::text) as numeric), 1)as number_of_days,a.state as leave_status,
        a.to_date_id, a.from_date_id, 
                CASE
                  WHEN (a.reject_reason_name = 'Others(Please specify)') THEN initcap(a.reason)
                ELSE a.reject_reason_name    
                 END AS reject_reason
                from  
                (select leave_info.id,row_number() over(order by leave_info.id asc) rno,coalesce(leave_info.description,'') descr,coalesce(leave_info.description,'') description,
                to_char(leave_info.created_date, 'YYYY-MM-DD HH24:MI:SS') AS raised_date, 
                rftms.refitems_desc,to_char(leave_info.from_date, 'YYYY-MM-DD HH24:MI:SS') AS from_date,
                to_char(leave_info.to_date, 'YYYY-MM-DD HH24:MI:SS') AS to_date,leave_info.number_of_days::text , ref.refitems_name as state,
                a.refitems_name as reject_reason_name,leave_info.reason, leave_info.to_type_id as to_date_id, leave_info.from_type_id as from_date_id
                from leave_info inner join      
                employee_info on employee_info.id=leave_info.leave_employee_id_id 
                inner join reference_items rftms on leave_info.type_id_id=rftms.id
                left join (select id,refitems_name from reference_items)a on a.id=leave_info.reject_reason_id_id 
                inner join reference_items ref on leave_info.state_id::int=ref.id
                where employee_info.related_user_id_id = %s and  
                leave_info.is_active=True order by leave_info.created_date DESC
                )a order by a.from_date desc; """,(user_id,)) 
            res=query.dictfetchall(cur) 
            print"RES======================",res
            if res == []:
                print"11111111111111111RES" 
                return HttpResponse(json.dumps({'status':'failure','Message':'Failed to get Leave status'}))
            else:
                print"++++++++++++++++++"
                json_data = {'status':'success','message':'Success with user id','data':res}
                return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder),content_type='application/json')
        else: 
            print"ELSE============"
            return HttpResponse(json.dumps({'status':'Failure','Message':'Failed to get Leave status'}))
    except Exception as e:
        print"EEEEEEEEEEEEEEEE",e
        response = 'Invalid Type!Please Check It!!!' 
        return HttpResponse(json.dumps({'status':'failure','message':response, 'Error Message':e}))

#leave history mobile function here
@csrf_exempt 
def view_leave_history_mobile(request):
    response = ''
    try:  
        body = request.body
        try:
            data = json.loads(body)
            data = ast.literal_eval(data)  
        except: 
            data = json.loads(body)
        else:
            data = json.loads(body)
            data = json.loads(data)
        if data:
            from_date = data["from_date"]
            to_date = data["to_date"]
            user_id = data["user_id"]
            cur = connection.cursor()
            cur.execute(""" select a.id,a.refitems_desc as leave_type,a.from_date,a.to_date,a.number_of_days,a.state as status,
        a.to_date_id, a.from_date_id,
                CASE
                  WHEN (a.reject_reason_name = 'Others(Please specify)') THEN initcap(a.reason)
                ELSE a.reject_reason_name
                 END AS reject_reason
                from
                (select leave_info.id,row_number() over(order by leave_info.id asc) rno,coalesce(leave_info.description,'') descr,coalesce(leave_info.description,'') description,
                to_char(leave_info.created_date, 'YYYY-MM-DD HH24:MI:SS') AS raised_date,
                rftms.refitems_desc,to_char(leave_info.from_date, 'YYYY-MM-DD HH24:MI:SS') AS from_date,
                to_char(leave_info.to_date, 'YYYY-MM-DD HH24:MI:SS') AS to_date,leave_info.number_of_days , ref.refitems_name as state,
                a.refitems_name as reject_reason_name,leave_info.reason, leave_info.to_type_id as to_date_id, leave_info.from_type_id as from_date_id
                from leave_info inner join       
                employee_info on employee_info.id=leave_info.leave_employee_id_id
                inner join reference_items rftms on leave_info.type_id_id=rftms.id     
                left join (select id,refitems_name from reference_items)a on a.id=leave_info.reject_reason_id_id
                inner join reference_items ref on leave_info.state_id::int=ref.id 
                where employee_info.related_user_id_id = %s and (leave_info.from_date::DATE,leave_info.to_date::DATE) 
            OVERLAPS (%s::DATE, %s::DATE) and leave_info.is_active=True order by leave_info.created_date DESC
                )a order by a.from_date DESC; """,(user_id, from_date, to_date, ))
            res=query.dictfetchall(cur)
            final_list = []  
            final_dict = {}
            open_list = []; appr_list = []; rej_list = []  
            for i in res: 
                if i['status'] == 'Open':  
                    open_list.append(i)
                if i['status'] == 'Approved':
                    appr_list.append(i)
                if i['status'] == 'Rejected':  
                    rej_list.append(i)
            final_dict['Open'] = open_list 
            final_dict['Approved'] = appr_list
            final_dict['Rejected'] = rej_list
            final_list.append(final_dict)
            return HttpResponse(json.dumps({'status':'Success','message':'Displayed Leave History','data':final_list}))
    except Exception as e:
        response = 'Invalid Type!Please Check It!!!'
        return HttpResponse(json.dumps({'status':'Failure','message':response, 'Error Message':e}))

#raise leave request mobile function here
@csrf_exempt
def Raise_leave_request_mobile(request):
#     try:
        body = request.body
        print"Leave---------------",body
        try: 
            data = json.loads(body)
            data = ast.literal_eval(data)  
        except:
            data = json.loads(body) 
        else:
            data = json.loads(body)
            data = json.loads(data)  
        if data:
            description = data["description"]
            from_date = data["from_date"] 
            
            to_date = data["to_date"] 
            number_of_days = data["number_of_days"]
            type_id_id = data["type_id_id"] 
            uid = data["user_id"] 
            try:   
                to_day_id = data['to_date_id'] 
                from_day_id = data['from_date_id'] 
            except: 
                to_day_id = '' 
                from_day_id = ''  
            org_values=get_organization(uid)  
            if org_values:
                org_id=org_values.get('id')    
                emp_id=org_values.get('emp_id')  
            else:   
                org_id=0   
                emp_id=0    
            if org_id and emp_id:   
                cur = connection.cursor()  
                cur.execute(""" select refitems_code from reference_items where id=%s """,(type_id_id,))
                leav_type = query.dictfetchall(cur) 
                leav_type = leav_type[0]['refitems_code'] 
                ''' cur.execute("""    
                            select rod.id, rod.role_title from  employee_info emp inner join leave_info lli  on leave_employee_id_id=emp.id inner join hcms_ti_role_details rod on rod.id=emp.role_id_id where emp.id=%s and rod.id in (
                            select rd.id from  employee_info ei inner join leave_info li on leave_employee_id_id=ei.id  inner join hcms_ti_role_details rd on rd.id=ei.role_id_id 
                            inner join reference_items ri on ri.id=li.state_id
                            where  ri.refitems_code='OPENN' and  
                            (li.from_date::DATE,li.to_date::DATE) OVERLAPS (%s ::DATE, %s::DATE)) group  by rod.id,rod.role_title 
                               """,(emp_id, from_date ,to_date,))
                role_result=query.dictfetchall(cur)   
                if role_result:  
                    return HttpResponse(json.dumps({'status':'Failure','message':'Leave cannot be applied as you already applied leave for the same date.'}))'''
                cur.execute("""select li.id,li.description,li.from_date,li.to_date, lt.refitems_code as leave_type_code from leave_info li
                            inner join organization_info  oi on oi.id=li.leave_org_id_id  inner join  reference_items lt on lt.id=li.type_id_id  where
                            (li.from_date::DATE >= %s::DATE or li.to_date::DATE >= %s::DATE ) and (li.from_date::DATE <= %s::DATE or li.to_date::DATE <= %s::DATE)
                            and leave_employee_id_id=%s and li.is_active  and oi.is_active and  li.reject_reason_id_id IS NULL
                                """,(from_date,from_date,to_date,to_date,emp_id,))  
                leave_exits=query.dictfetchall(cur) 
                permission=0 
                leave=0  
                if leave_exits:  
     #           return HttpResponse(json.dumps({'status':'Failure','message':'Leave cannot be applied as you already applied leave for the same date.'}))
                    for exist_leave in leave_exits:
                        if exist_leave.get("leave_type_code")=="PEMSN":     
                             permission=1   
                        else:
                            leave=1            
                    if leave==1:        
                        #json_data[config.results]=config.ERR0032                 
                        return HttpResponse(json.dumps({'status':'Failure','message':'Leave cannot be applied as you already applied leave for the same date.'}))
                        #return HttpResponse(json.dumps(json_data)) 
                    elif permission==1:
                        permission_code=get_refitems('refitems_code',type_id_id,'id')
                        if permission_code=="PEMSN":
                            return HttpResponse(json.dumps({'status':'Failure','message':'You have already Availed the Permissions for the Day.'}))
                def internal_mail_content():
                    if emp_id: 
                        leave_type=get_refitems('refitems_name',type_id_id,'id')
                        subject=config.subject_content 
                        name=get_emp(emp_id,"coalesce(name||' '||last_name) as name").lower().title()
                        title_id=get_emp(emp_id,"title_id")
                        title=get_refitems('refitems_name',int(title_id),'id')
                        first_name=get_emp(emp_id,"coalesce(name) as first_name").lower().title()
                        first_name=title+" "+first_name
                        permission_code=get_refitems('refitems_code',int(type_id_id),'id') 
                        if permission_code=="PEMSN":   
                            subject="Permission Request" 
                            formated_from=formated_date(from_date,'time')
                            formated_to=formated_date(to_date,'time') 
                        else:
                            formated_from=formated_date(from_date,'date')   
                            formated_to=formated_date(to_date,'date') 
                               
                        subject_content=subject+" - "+name  
                        if leave_type ==0:         
                            leave_type=""       
                        mail_body_content=config.mail_body_content.format(first_name,subject,"Mobile",leave_type,description,formated_from,formated_to)
                        if emp_id:       
                            to_address=get_emp(emp_id,"work_email")  
                            try:  
                                 stats=asyn_email(config.Transform_hcms,config.module_name,subject_content,to_address,mail_body_content,config.waiting)
                            except Exception as e:        
                                    logger_obj.error(e)   
                if leav_type == 'PEMSN': 
                    cur.execute('''select count(li.id) permission_count from leave_info li
                                           inner join reference_items st on st.id=li.state_id 
                                           where leave_employee_id_id=%s and type_id_id=%s and li.is_active 
                                            and date_part('year',li.from_date) = date_part('year',%s::date)                                   
                                           and date_part('month',li.from_date) = date_part('month',%s::date)''',(emp_id,type_id_id,from_date,from_date,))
                    results = query.dictfetchall(cur)    
                    results = results[0]['permission_count']  
                    if results >= 2: 
                        return HttpResponse(json.dumps({'status':'Failure','message':'Permission can be applied only 2 times in a month.'}))
                    else:
                        state=get_state()  
                        Insert_Query = LeaveInfo(type_id_id=int(type_id_id), number_of_days=number_of_days, from_date=from_date , to_date=to_date,
                                            description=description,leave_employee_id_id=emp_id,leave_org_id_id=int(org_id),
                                            is_active=True,state_id=state,created_by_id=int(uid))
                        Insert_Query.save() 
                        internal_mail_content()
                        #HRMSLeaveBalanceUpdate(emp_id,number_of_days,type_id_id,"NOT","SELF") 
                        return HttpResponse(json.dumps({'status':'Success','message':'Permission request placed'}))
                state=get_state() 
                Insert_Query = LeaveInfo(type_id_id=int(type_id_id), number_of_days=number_of_days, from_date=from_date , to_date=to_date,
                                    description=description,leave_employee_id_id=emp_id,leave_org_id_id=int(org_id),
                                    to_type_id = to_day_id, from_type_id = from_day_id,
                                    is_active=True,state_id=state,created_by_id=int(uid))
                Insert_Query.save()
                from_d=from_date.split("-")  
                HRMSLeaveBalanceUpdate(emp_id,number_of_days,type_id_id,"NOT","SELF",str(from_d[0]))
                internal_mail_content()
                return HttpResponse(json.dumps({'status':'Success','message':'Leave request placed','leave_id':Insert_Query.id }))
            else:
                return HttpResponse(json.dumps({'status':'Failure','message':'Failed to place Leave request'}))
        else:
            return HttpResponse(json.dumps({'status':'Failure','Failure':'Failed to place Leave request'}))
#     except Exception as e:
        return HttpResponse(json.dumps({'status':'Failure','Error Message':e}))
    
#leave request update function here 
@csrf_exempt
def leave_request_update_mobile(request):
    try:
        body = request.body  
        try: 
            data = json.loads(body)  
            data = ast.literal_eval(data)
        except:
            data = json.loads(body)
        else:
            data = json.loads(body)
            data = json.loads(data) 
        if data:
            description = data["description"] 
            from_date = data["from_date"]
            to_date = data["to_date"] 
            number_of_days = data["number_of_days"]
            type_id_id = data["type_id_id"]
            table_id = data["table_id"]
            uid = data["user_id"] 
            try:
                to_day_id = data['to_date_id']
                from_day_id = data['from_date_id']
            except:
                to_day_id = ''
                from_day_id = ''
            
            org_values=get_organization(uid)  
            if org_values:
                org_id=org_values.get('id')
                emp_id=org_values.get('emp_id')
            else:
                org_id=0
                emp_id=0 
            if org_id and emp_id:   
                state=get_state()
                from_d=from_date.split("-") 
                update_leave_balance(table_id,emp_id,number_of_days,type_id_id,str(from_d[0]))
                cur = connection.cursor()
                cur.execute(""" select refitems_code from reference_items where id=%s """,(type_id_id,))
                leav_type = query.dictfetchall(cur)
                leav_type = leav_type[0]['refitems_code']
                if leav_type == 'PEMSN':   
                    status = LeaveInfo.objects.filter(id=table_id).update(type_id_id=int(type_id_id), number_of_days=number_of_days, from_date=from_date , to_date=to_date,
                                        description=description,leave_employee_id_id=emp_id,leave_org_id_id=int(org_id),is_active=True ,state_id=state,modified_by_id=int(uid))
                    return HttpResponse(json.dumps({'status':'Success','message':'Permission request Updated'}))
                else:
                    status = LeaveInfo.objects.filter(id=table_id).update(type_id_id=int(type_id_id), number_of_days=number_of_days, from_date=from_date , to_date=to_date,
                                                                      to_type_id = to_day_id, from_type_id = from_day_id,
                                            description=description,leave_employee_id_id=emp_id,leave_org_id_id=int(org_id),is_active=True ,state_id=state,modified_by_id=int(uid))
                    return HttpResponse(json.dumps({'status':'Success','message':'Leave request Updated'}))
            else:
                return HttpResponse(json.dumps({'status':'Failure','message':'Failed to Update Leave request'}))
        else:
            return HttpResponse(json.dumps({'status':'Failure','message':'Failed to Update Leave request'}))
    except Exception as e:
        return HttpResponse(json.dumps({'status':'Failure','Error Message':e}))

#leave request delete mobile function here
@csrf_exempt
def leave_request_delete_mobile(request):
    try:
        body = request.body 
        try:    
            data = json.loads(body)
            data = ast.literal_eval(data)
        except:   
            data = json.loads(body)
        else:   
            data = json.loads(body)  
            data = json.loads(data)   
        if data:  
            table_id = data["table_id"] 
            uid = data["user_id"]
            cur = connection.cursor()
            cur.execute(""" select number_of_days,type_id_id,to_char(leave_info.from_date, 'DD-MM-YYYY')as from_date from leave_info where id = %s;""",(table_id,))
            result = query.dictfetchall(cur)
            number_of_days = result[0]['number_of_days']
            from_date=result[0].get('from_date') 
            type_id_id = result[0]['type_id_id']   
            org_values=get_organization(uid)
            if org_values:
                org_id=org_values.get('id')
                emp_id=org_values.get('emp_id')  
            else:    
                org_id=0 
                emp_id=0
            status = LeaveInfo.objects.filter(id=table_id,leave_employee_id_id=emp_id).update(is_active=False)
            from_d=from_date.split("-") 
            HRMSLeaveBalanceUpdate(emp_id,number_of_days,type_id_id,"NOT","RJT",str(from_d[2]))
            return HttpResponse(json.dumps({'status':'Success','message':'Leave request Deleted'}))
        else:
            return HttpResponse(json.dumps({'status':'Failure','message':'Failed to Delete Leave request'}))
    except Exception as e:
        return HttpResponse(json.dumps({'status':'Failure','Error Message':e}))
 
#leave manager mobile function here
@csrf_exempt
def view_leave_manager_mobile(request):
    try:
        body = request.body
        try: 
            data = json.loads(body)  
            data = ast.literal_eval(data)
        except:
            data = json.loads(body)
        else:
            data = json.loads(body) 
            data = json.loads(data) 
        if data:
            manager_id = data["user_id"] 
            image_path = status_code.image_path 
            cur = connection.cursor() 
            role_query=query.fetch_hcms_query(config.leave,config.leave_employee_role_query)
            cur.execute(role_query%(manager_id,)) 
            role=lib.dictfetchall(cur) 
            res=[] 
            if role:
                role=role[0].get("name")  
                if role=="HCM":
                    cur.execute(""" select leave_info.id,emp.name, emp.related_user_id_id as user_id,to_char(leave_info.created_date, 'DD-MM-YYYY HH24:MI:SS') 
                                    AS raised_date,rftms.refitems_desc as leave_type,to_char(leave_info.from_date, 'DD-MM-YYYY HH24:MI:SS') 
                                    AS from_date,to_char(leave_info.to_date, 'DD-MM-YYYY HH24:MI:SS') AS to_date,round( CAST(float8 (leave_info.number_of_days::text) as numeric), 1)as number_of_days,
                                    rfid.refitems_desc as leave_status,
                                    leave_info.description , 
                                    concat(%s,coalesce(ai.name, 'no_data.png')) as image_url,
                                    leave_info.to_type_id, leave_info.from_type_id, 
                                    CASE
                                    WHEN (rftms_1.refitems_name = 'Others(Please specify)') THEN initcap(leave_info.reason)
                                    ELSE rftms_1.refitems_name
                                    END AS reject_reason  
                                    from employee_info emp inner join  leave_info on emp.id=leave_info.leave_employee_id_id inner join reference_items rftms on leave_info.type_id_id=rftms.id 
                                    left join reference_items rftms_1 on leave_info.reject_reason_id_id=rftms_1.id
                                    left join attachment_info ai on ai.id=emp.image_id_id
                                   inner join reference_items rfid on rfid.id=leave_info.state_id 
                                    inner join reference_items ref on state_id=ref.id 
                                   inner join (select oi.id as org_id ,oui.id as org_unit_id from employee_info e inner join auth_user a on e.related_user_id_id=%s inner join organization_info oi on oi.id=e.org_id_id inner join organization_unit_info oui on oui.id=e.org_unit_id_id group by org_id,org_unit_id) as oi_oui
                                    on oi_oui.org_id=emp.org_id_id and oi_oui.org_unit_id=emp.org_unit_id_id 
                                    where 
                                    leave_info.type_id_id=rftms.id  and leave_info.is_active=True group  by leave_info.id,emp.name,
                                    rftms.refitems_desc,image_url,leave_status,emp.related_user_id_id,rftms_1.refitems_name order by leave_info.from_date desc; """,(image_path, manager_id,))
                    res=query.dictfetchall(cur)
                else:
                    cur.execute(""" select role_id_id from employee_info where related_user_id_id =%s """,(manager_id,)) 
                    role_id = query.dictfetchall(cur) 
                    role_id = role_id[0]['role_id_id']
                    cur.execute(""" select leave_info.id,emp.name, emp.related_user_id_id as user_id,to_char(leave_info.created_date, 'DD-MM-YYYY HH24:MI:SS') 
                                        AS raised_date,rftms.refitems_desc as leave_type,to_char(leave_info.from_date, 'DD-MM-YYYY HH24:MI:SS') 
                                        AS from_date,to_char(leave_info.to_date, 'DD-MM-YYYY HH24:MI:SS') AS to_date,round( CAST(float8 (leave_info.number_of_days::text) as numeric), 1)as number_of_days,
                        rfid.refitems_desc as leave_status,
                                        leave_info.description , 
                                        concat(%s,coalesce(ai.name, 'no_data.png')) as image_url, 
                                        leave_info.to_type_id, leave_info.from_type_id, 
                                        CASE  
                                            WHEN (rftms_1.refitems_name = 'Others(Please specify)') THEN initcap(leave_info.reason)
                                        ELSE rftms_1.refitems_name 
                                            END AS reject_reason  
                                        from employee_info emp inner join  leave_info on emp.id=leave_info.leave_employee_id_id inner join reference_items rftms on leave_info.type_id_id=rftms.id 
                                        left join reference_items rftms_1 on leave_info.reject_reason_id_id=rftms_1.id
                                        left join attachment_info ai on ai.id=emp.image_id_id
                        inner join reference_items rfid on rfid.id=leave_info.state_id 
                                        inner join 
                                        (select rd.id as role_id,ei.id,ei.name,oi.id as org_id,oui.id as org_unit_id from employee_info ei inner join auth_user au on 
                                        au.id=ei.related_user_id_id inner join organization_info oi on oi.id=ei.org_id_id  
                                        inner join organization_unit_info oui on oui.id=ei.org_unit_id_id
                                        inner join hcms_ti_role_details rd on rd.id=ei.role_id_id
                                        where  au.id=%s and rd.id=%s ) as s
                                        on s.org_unit_id=emp.org_unit_id_id and s.org_id=emp.org_id_id  inner join reference_items ref on state_id=ref.id 
                                        where emp.reporting_officer_id =(select e.id from employee_info e where e.related_user_id_id =%s) and 
                                        leave_info.type_id_id=rftms.id  and leave_info.is_active=True group  by leave_info.id,emp.name,
                                        rftms.refitems_desc,role_id,image_url,leave_status,emp.related_user_id_id,rftms_1.refitems_name order by leave_info.from_date desc; """,(image_path, manager_id, role_id, manager_id,))
                    res=query.dictfetchall(cur)
            cur.execute(""" select ri.id as status_id, ri.refitems_name as status_name from reference_items ri
                    inner join reference_item_category ric on ric.id = ri.refitems_category_id
                    where ric.refitem_category_code = 'LEVST' and ri.is_active = True order by refitems_name """)
            leave_accept_reject = query.dictfetchall(cur)
            if res == []:
                return HttpResponse(json.dumps({'status':'Failure','message':'Leave Information does not exist'}))
            else:
                final_list = []
                final_dict = {}
                open_list = []; appr_list = []; rej_list = []
                for i in res: 
                    if i['leave_status'] == 'Open': 
                        open_list.append(i)
                    if i['leave_status'] == 'Approved': 
                        appr_list.append(i)   
                    if i['leave_status'] == 'Rejected':
                        rej_list.append(i)
                final_dict['Open'] = open_list
                final_dict['Approved'] = appr_list 
                final_dict['Rejected'] = rej_list
                final_dict['Status_Ids'] = leave_accept_reject
                final_list.append(final_dict)
                json_data = {'status':'Success','message':'List history view for Manager','data':final_list}
                return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder),content_type='application/json')
        else: 
            return HttpResponse(json.dumps({'status':'Failure','message':'Failed to List history view for Manager'}))
    except Exception as e: 
        return HttpResponse(json.dumps({'status':'Failure','Error Message':e})) 

#approve leave mobile information here
@csrf_exempt
def appr_leave_mobile(request): 
    try: 
        body = request.body  
        try:
            data = json.loads(body)
            data = ast.literal_eval(data)  
        except:
            data = json.loads(body)    
        else: 
            data = json.loads(body)        
            data = json.loads(data) 
        if data: 
            leave_id = data["leave_id"]    
            status_id = data["status_id"]  
            user_id = data["user_id"]
            cur = connection.cursor() 
            cur.execute(""" UPDATE leave_info SET state_id=%s, modified_date=now(), modified_by_id=%s where id=%s returning id""",(status_id, user_id, leave_id, ))
            res=query.dictfetchall(cur)
            if res != []:
                  
                org_values=get_organization(user_id)  
                if org_values:
                    org_id=org_values.get('id')  
                    emp_id=org_values.get('emp_id') 
                else:   
                    org_id=0 
                    emp_id=0   
                try:  
                    process_by=emp_id     
                    subject=config.subject_content      
                    cur.execute(""" select li.id,li.type_id_id ,li.leave_employee_id_id,li.description,to_char(li.from_date, 'DD/MM/YYYY HH24:MI') AS from_date,to_char(li.to_date, 'DD/MM/YYYY HH24:MI') AS to_date  from leave_info li where id=%s """,(leave_id, ))
                    leave_res=query.dictfetchall(cur)[0]
                    if leave_res:
                        leave_type=get_refitems('refitems_name',leave_res.get('type_id_id'),'id')
                       
                    if leave_type==0: 
                        leave_type=""  
                    permission_code=get_refitems('refitems_code',int(leave_res.get('type_id_id')),'id')
                    
                    if permission_code=="PEMSN":   
                        subject="Permission Request"     
                        formated_from=leave_res.get('from_date') 
                        formated_to=leave_res.get('to_date') 
                    else: 
                        formated_from=leave_res.get('from_date').split(" ")[0]  
                        formated_to=leave_res.get('to_date').split(" ")[0]
                    subject_content=subject
                    send_mail(subject_content,leave_type,leave_res.get('description'),status_id,leave_res.get('leave_employee_id_id'),process_by,leave_res.get('from_date'),leave_res.get('to_date'),"","Mobile") 
                except Exception as e:  
                    logger_obj.error(e) 
                return HttpResponse(json.dumps({'status':'Success','message':'Leave request Approved By Manager'}))
            else:
                return HttpResponse(json.dumps({'status':'Failure','message':'Failed to Approve Leave request, Leave ID doest not exist'}))
        else:
            return HttpResponse(json.dumps({'status':'Failure','message':'Failed to Approve Leave request'}))
    except Exception as e:
        return HttpResponse(json.dumps({'status':'Failure','Error Message':e}))
 
#reject leave mobile function here
@csrf_exempt
def reject_leave_mobile(request):
    try:  
        body = request.body  
        try:  
            data = json.loads(body) 
            data = ast.literal_eval(data)
        except:   
            data = json.loads(body)  
        else:
            data = json.loads(body)  
            data = json.loads(data)
        if data:  
            user_id = data["user_id"]
            leave_id = data["leave_id"]
            status_id = data["status_id"] 
            reject_reason_id = data["reject_reason_id"]   
            try: 
                reject_reason_desc = data["reject_reason_desc"]
            except: 
                reject_reason_desc = ''  
            cur = connection.cursor()
            cur.execute(""" select leave_employee_id_id, number_of_days,type_id_id,to_char(leave_info.from_date, 'DD-MM-YYYY')as from_date from leave_info where id = %s""",(leave_id, ))
            result=query.dictfetchall(cur) 
            emp_id = result[0]['leave_employee_id_id']  
            number_of_days = result[0]['number_of_days']  
            type_id_id = result[0]['type_id_id']  
            from_date=result[0].get('from_date')   
            from_d=from_date.split("-")   
            cur.execute(""" UPDATE leave_info SET state_id=%s, reject_reason_id_id=%s, reason=%s, modified_date=now(), modified_by_id=%s where id=%s returning id""",(status_id, reject_reason_id, reject_reason_desc, user_id, leave_id, ))
            res=query.dictfetchall(cur) 
            if res != []: 
                HRMSLeaveBalanceUpdate(emp_id,number_of_days,type_id_id,"NOT","RJT",from_d[2])
                try:  
                    process_by=logged_employee(request)  
                    subject=config.subject_content           
                    cur.execute(""" select li.id,li.type_id_id ,li.leave_employee_id_id,li.description,to_char(li.from_date, 'DD-MM-YYYY HH24:MI:SS') AS from_date,to_char(li.to_date, 'DD-MM-YYYY HH24:MI:SS') AS to_date  from leave_info li where id=%s """,(leave_id, ))
                    leave_res=query.dictfetchall(cur)[0] 
                    if leave_res:  
                        leave_type=get_refitems('refitems_name',leave_res.get('type_id_id'),'id')    
                    if leave_type ==0:
                        leave_type=""  
                    permission_code=get_refitems('refitems_code',int(leave_res.get('type_id_id')),'id')  
                    if permission_code=="PEMSN":   
                        subject="Permission Request"     
                        formated_from=formated_date(data[0]['from_date'],'time')
                        formated_to=formated_date(data[0]['to_date'],'time')
                    else:   
                        formated_from=formated_date(data[0]['from_date'],'date') 
                        formated_to=formated_date(data[0]['to_date'],'date') 
                    subject_content=subject         
                    m_reason=get_refitems('refitems_code',reject_reason_id,'id') 
                    if m_reason == "OTHPS":
                        mail_reason= "Reject Reason: "+reason 
                    else: 
                        mail_reason= "Reject Reason: "+get_refitems('refitems_name',reject_reason_id,'id')
                    send_mail(subject_content,leave_type,leave_res.get('description'),status_id,leave_res.get('leave_employee_id_id'),process_by,leave_res.get('from_date'),leave_res.get('to_date'),mail_reason,"Mobile") 
                except Exception as e:   
                    logger_obj.error(e)   
                return HttpResponse(json.dumps({'status':'Success','message':'Leave request Rejected By Manager'}))
            else:
                return HttpResponse(json.dumps({'status':'Failure','message':'Failed to Reject Leave request, Leave ID doest not exist'}))
        else:
            return HttpResponse(json.dumps({'status':'Failure','message':'Failed to Reject Leave request'}))
    except Exception as e:
       return HttpResponse(json.dumps({'status':'Failure','Error Message':e}))

#get user image details
@csrf_exempt
def get_user_image(request):
    try:    
        body = request.body     
        try:
            data = json.loads(body) 
            data = ast.literal_eval(data)        
        except:
            data = json.loads(body)
        else:
            data = json.loads(body) 
            data = json.loads(data)
        if data: 
            user_id = data["user_id"]  
            cur = connection.cursor()
            cur.execute(""" select ai.name from employee_info ei
                                left join attachment_info ai on ai.id=ei.image_id_id
                                where ei.related_user_id_id =%s;""",(user_id, ))
            res=query.dictfetchall(cur) 
            if res == []:
                return HttpResponse(json.dumps({'status':'Failure','message':'Failed to Get User Image'}))
            else:
                res=res[0]['name']
                image_path = status_code.image_path
                if res != None: 
                    image = image_path+res
                else:
                    image = image_path+'no_data.png' 
                encoded_image = base64.b64encode(requests.get(image).content)
                return HttpResponse(json.dumps({'status':'Success','message':'Encoded Image String', 'image':encoded_image}))
        else:
            return HttpResponse(json.dumps({'status':'Failure','message':'Failed to Get User Image'}))
    except Exception as e:
        return HttpResponse(json.dumps({'status':'Failure','Error Message':e}))
    
#reject dropdown mobile function here
@csrf_exempt
def reject_dropdown_mobile(request): 
    try:
        cur = connection.cursor()
        cur.execute(""" select ri.id as reject_id, ri.refitems_name as reject_reason_name from reference_items ri
                    inner join reference_item_category ric on ric.id = ri.refitems_category_id
                    where ric.refitem_category_code = 'LEVRS' and ri.is_active = True order by refitems_name """)
        res=query.dictfetchall(cur)
        return HttpResponse(json.dumps({'status':'Success','message':'Reject Dropdown List', 'data':res}))
    except Exception as e:
        return HttpResponse(json.dumps({'status':'Failure','message':'Failed to get Reject Dropdown List', 'Error Message':e}))

#get organization function here
def get_organization_details(param,table,condition):
    
    try:
        cur = connection.cursor()
        org_query="""select {} from {}  where is_active {}"""
        org_query=org_query.format(param,table,condition)
        cur.execute(org_query) 
        res=query.dictfetchall(cur)
        if res:
            return res
        else:
            return 0    
    except Exception as e:
        logger_obj.error(e)
        
#organization details function here        
@csrf_exempt 
def organization_details_mobile(request):
    try:
        body=request.body
        try:
            data=json.loads(body)
            data=ast.literal_eval(data) 
        except:   
            data=json.loads(body) 
        else: 
            data=json.loads(body)
            data=json.loads(data)   
        if data: 
            msg=[]    
            user_id=data.get('user_id')  
            organisation_id=data.get('organisation_id')   
            organisation_unit_id=data.get('organisation_unit_id')  
            division_id=data.get('division_id') 
            if user_id and organisation_id and organisation_unit_id and division_id: 
                message="Team list" 
                param=" related_user_id_id as user_id ,concat(name||' '||coalesce(last_name, '')) as name,id as employee_id"  
                table="employee_info"    
                condition="and  org_id_id="+str(organisation_id)+"and  org_unit_id_id="+str(organisation_unit_id)+"  and  team_name_id="+str(division_id)
                if len(data)==4:  
                    res=get_organization_details(param,table,condition)
                    if res:
                        status="Success"  
                        msg=["data",res]   
                    else:    
                        status="Failure"   
                        msg=["Error Message","Failed to get"+message]   
                else:
                    message="Parameter Missing"  
                    status="Failure"    
                    msg=["Error Message","Parameter Missing"]  
            elif  user_id and organisation_id and organisation_unit_id: 
                message="Division list"
                param="name as division_name ,id as division_id"
                table="team_details_info"
                condition="and  org_id="+str(organisation_id)+"and  org_unit_id="+str(organisation_unit_id)
                if len(data)==3:
                    res=get_organization_details(param,table,condition)
                    if res:
                        status="Success"  
                        msg=["data",res]
                    else:       
                        status="Failure"   
                        msg=["Error Message","Failed to get"+message] 
                else: 
                    status="Failure"     
                    message="Parameter Missing" 
                    msg=["Error Message","Parameter Missing"]   
            elif user_id and organisation_id: 
                message="Organisation unit list"
                param="orgunit_name as name,id as oragnisation_unit_id"  
                table="organization_unit_info" 
                condition="and  organization_id="+str(organisation_id)+" and parent_orgunit_id!=0"
                if len(data)==2:
                    res=get_organization_details(param,table,condition)
                    if res:
                        status="Success" 
                        msg=["data",res] 
                    else:
                        status="Failure"
                        msg=["Error Message","Failed to get"+message]
                else:
                    status="Failure"    
                    message="Parameter Missing"
                    msg=["Error Message","Parameter Missing"] 
            elif user_id:  
                message="Organisationl list"
                param="name,id as organisation_id"  
                table="organization_info" 
                condition=""   
                if len(data)==1:
                    res=get_organization_details(param,table,condition)
                    if res:  
                        status="Success"
                        msg=["data",res]   
                    else:  
                        status="Failure"    
                        msg=["Error Message","Failed to get"+message]
                else:
                    status="Failure"
                    message="Parameter Missing"   
                    msg=["Error Message","Parameter Missing"]
            else: 
                message="Parameter Missing" 
                status="Failure"   
                msg=["Error Message",message] 
            return HttpResponse(json.dumps({'status':status,'message':message,msg[0]:msg[1]}))
        else:
            message="Parameter Missing"
            status="Failure"
            msg=["Error Message",message] 
            return HttpResponse(json.dumps({'status':status,'message':message,msg[0]:msg[1]}))
    except Exception as e:
        logger_obj.error(e)
        return HttpResponse(json.dumps({'status':'Failure','message':'Failed to Fetch Details', 'Error Message':str(e)}))

#leave history function here
@csrf_exempt
def filter_leave_history_mobile(request):
    try: 
        body=request.body
        try: 
            data=json.loads(body)  
            data=ast.literal_eval(data) 
        except:   
            data=json.loads(body)   
        else:   
            data=json.loads(body)    
            data=json.loads(data)     
        if data: 
            msg=[]          
            organisation_id=data.get('organisation_id')      
            organisation_unit_id=data.get('organisation_unit_id')    
            division_id=data.get('division_id') 
            employee_id=data.get('employee_id') 
            from_date=data.get('from_date')   
            to_date=data.get('to_date')    
            if organisation_id or organisation_unit_id or  division_id or employee_id or from_date or to_date:  
                dynamic_query="""select st.refitems_name as leave_status, 
                                CASE WHEN (rgt.refitems_name = 'Others(Please specify)') THEN initcap(li.reason) WHEN (  rgt.refitems_name='' ) THEN NULL
                                ELSE rgt.refitems_name END AS reject_reason,to_char(li.from_date,  'DD-MM-YYYY HH24:MI:SS') AS from_date,
                                ly.refitems_name as leave_type, to_char(li.to_date, 'DD-MM-YYYY HH24:MI:SS') AS to_date,li.number_of_days,li.id,li.from_type_id as from_type_id,li.to_type_id as to_type_id,e.related_user_id_id as user_id,
                                coalesce(e.name) as name,concat('{}'    ,coalesce(ai.name, 'no_data.png')) as image_url,li.description, to_char(li.created_date,  'DD-MM-YYYY HH24:MI:SS') AS  raised_date {}  
                                from leave_info li  
                                inner join employee_info e on e.id=li.leave_employee_id_id
                                inner join reference_items st on st.id=li.state_id  
                                left  join reference_items rgt on rgt.id=li.reject_reason_id_id
                                inner join reference_items ly on ly.id=li.type_id_id   
                                left join attachment_info ai on ai.id=e.image_id_id
                                {}    
                                where  li.is_active and  st.is_active and ly.is_active {} order by li.from_date desc """  
                cur = connection.cursor()
                cond={'org':{'param':'','join':' inner join organization_info oi on oi.id=li.leave_org_id_id ','cond':' and oi.id=%s '},
                      'org_unit':{'param':'','join':' inner join  organization_unit_info  oui on oui.id=e.org_unit_id_id ','cond':' and oui.id=%s '},
                      'division':{'param':'','join':' inner join team_details_info  td on td.id=e.team_name_id ','cond':' and td.id= %s'},
                      'employee':{'param':'','join':'','cond':' and e.related_user_id_id= %s'},
                      'date':{'param':'','join':'','cond':" and (li.from_date::DATE,li.to_date::DATE) OVERLAPS ('%s'::DATE, '%s'::DATE)"} 
                      } 
                param=join=where_cond =''
                param_values=[]   
                if organisation_id: 
                    res=cond.get('org') 
                    param +=res.get('param') 
                    join +=res.get('join')  
                    where_cond +=res.get('cond')
                    param_values.append(organisation_id)  
                if organisation_unit_id: 
                    param_values.append(organisation_unit_id)
                    res=cond.get('org_unit')
                    param +=res.get('param') 
                    join +=res.get('join') 
                    where_cond +=res.get('cond')
                if division_id: 
                    param_values.append(division_id) 
                    res=cond.get('division')
                    param +=res.get('param')
                    join +=res.get('join') 
                    where_cond +=res.get('cond')
                if employee_id: 
                    param_values.append(employee_id) 
                    res=cond.get('employee')   
                    param +=res.get('param')  
                    join +=res.get('join')  
                    where_cond +=res.get('cond') 
                if from_date and to_date: 
                    param_values.append(from_date)
                    param_values.append(to_date)
                    res=cond.get('date') 
                    param +=res.get('param')
                    join +=res.get('join')  
                    where_cond +=res.get('cond')
                image_path = status_code.image_path
                fileter_query=dynamic_query.format(image_path,param,join,where_cond)
                cur.execute(fileter_query %tuple(map(str,param_values)))
                res=query.dictfetchall(cur)
                cur.execute(""" select ri.id as status_id, ri.refitems_name as status_name from reference_items ri
                    inner join reference_item_category ric on ric.id = ri.refitems_category_id
                    where ric.refitem_category_code = 'LEVST' and ri.is_active = True order by refitems_name """)
                leave_accept_reject = query.dictfetchall(cur)
                if res:
                    final_list = []
                    final_dict = {}
                    open_list = []; appr_list = []; rej_list = []
                    for i in res:
                        if i.get('leave_status') == 'Open': 
                            open_list.append(i) 
                        if i.get('leave_status') == 'Approved': 
                            appr_list.append(i)   
                        if i.get('leave_status') == 'Rejected':
                            rej_list.append(i)
                    final_dict['Open'] = open_list
                    final_dict['Approved'] = appr_list 
                    final_dict['Rejected'] = rej_list
                    final_dict['Status_Ids'] = leave_accept_reject
                    final_list.append(final_dict)  
                    return HttpResponse(json.dumps({'status':"Success",'message':"Team list","data":final_list}))
                else:  
                    status="Failure"     
                    return HttpResponse(json.dumps({'status':status,'message':"Failed to Fetch Team list"}))    
            else:   
                message="Parameter Missing"  
                status="Failure"     
                msg=["Error Message",message] 
            return HttpResponse(json.dumps({'status':status,'message':message,msg[0]:msg[1]}))
        else: 
            message="Parameter Missing"
            status="Failure" 
            msg=["Error Message",message] 
            return HttpResponse(json.dumps({'status':status,'message':message,msg[0]:msg[1]}))
    except Exception as e: 
        logger_obj.error(e)  
        return HttpResponse(json.dumps({'status':'Failure','message':'Failed to Fetch Team List ', 'Error Message':str(e)}))
 
#rejected leave function here 
@csrf_exempt 
def rejected_leave_mobile(request):
    try:    
        body=request.body 
        try:    
            data=json.loads(body)     
            data=ast.literal_eval(data)   
        except:     
            data=json.loads(body)    
        else:      
            data=json.loads(body)   
            data=json.loads(data)        
        if data:           
            msg=[]           
            user_id=data.get('user_id')             
            from_date=data.get('from_date')  
            to_date=data.get('to_date')   
            if user_id and from_date and to_date:         
                cur = connection.cursor()    
                cur.execute(""" select st.refitems_name as status,li.reject_reason_id_id, 
                                CASE WHEN (rgt.refitems_name = 'Others(Please specify)') THEN initcap(li.reason) WHEN (  rgt.refitems_name='' ) THEN NULL
                                ELSE rgt.refitems_name END AS reject_reason,to_char(li.from_date, 'YYYY-MM-DD HH24:MI:SS') AS from_date,
                                ly.refitems_name as leave_type, to_char(li.to_date, 'YYYY-MM-DD HH24:MI:SS') AS to_date,li.number_of_days,li.id,li.from_type_id as from_date_id,li.to_type_id as to_date_id,
                                to_char(li.modified_date, 'YYYY-MM-DD HH24:MI:SS')  as rejected_date,re.name as rejected_by_name,li.modified_by_id rejected_by_user_id
                                from leave_info li  
                                inner join reference_items st on st.id=li.state_id
                                left  join reference_items rgt on rgt.id=li.reject_reason_id_id   
                                inner join reference_items ly on ly.id=li.type_id_id  
                                inner join employee_info e on e.id=li.leave_employee_id_id   
                                inner join employee_info re on re.related_user_id_id=li.modified_by_id   
                                where  li.is_active and st.is_active and ly.is_active   
                                and (li.from_date::DATE,li.to_date::DATE) OVERLAPS (%s::DATE,%s::DATE)    
                                and li.reject_reason_id_id IS NOt NULL    
                                and e.related_user_id_id=%s     
                                """,(from_date,to_date,user_id,))   
                res=query.dictfetchall(cur)      
                if res:  
                     return HttpResponse(json.dumps({'status':"Success",'message':"Rejected leave history list","data":res}))
                else:
                    status="Failure"  
                    return HttpResponse(json.dumps({'status':status,'message':"Failed to Fetch Rejected leave history list"}))    
            else:
                message="Parameter Missing" 
                status="Failure"   
                msg=["Error Message",message] 
            return HttpResponse(json.dumps({'status':status,'message':message,msg[0]:msg[1]})) 
        else:
            message="Parameter Missing"
            status="Failure"  
            msg=["Error Message",message]  
            return HttpResponse(json.dumps({'status':status,'message':message,msg[0]:msg[1]}))
    except Exception as e:
        logger_obj.error(e)
        return HttpResponse(json.dumps({'status':'Failure','message':'Failed to Fetch Rejected Leave History List', 'Error Message':str(e)}))

@csrf_exempt  
def leave_details(request):
     json_data={}
     try: 
        body=request.body
        try: 
            data=json.loads(body)  
            data=ast.literal_eval(data) 
        except:   
            data=json.loads(body)   
        else:   
            data=json.loads(body)    
            data=json.loads(data)  
        if data: 
            leave_id=data.get('leave_id') 
            if leave_id:         
                cur = connection.cursor()    
                cur.execute("""

select work_email as req_employee_mail,leave_employee_id_id,leave.type_id_id as leave_type_id, ref1.refitems_name as leave_type, leave.id,reason,from_date,to_date,state_id as leave_status_id,ref.refitems_name as leave_status from leave_info as leave
inner join reference_items as ref on ref.id=leave.state_id
inner join reference_items as ref1 on ref1.id=leave.type_id_id
inner join employee_info as emp_info on emp_info.id=leave.leave_employee_id_id
where leave.is_active and ref.is_active and emp_info.is_active and leave.id=%s     
                                """,(leave_id,))   
                res=query.dictfetchall(cur) 
                if res:
                   json_data['leave_details']=res
                   json_data['status']='NTE_01'
                   json_data['msg']='success'
                else:
                   json_data['leave_details']=[]
                   json_data['status']='NTE_01'
                   json_data['msg']='success'
                      
     except Exception as e:
        error=exception_handling(500,type(e).__name__,str(e))
        json_data['leave_details']=error
        json_data['status']='NTE_02'
        json_data['msg']='fail'
     return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)

@csrf_exempt   
def leave_status_info(request):
    json_data={}
    try:
      cur = connection.cursor()    
      cur.execute("""select id,refitems_name as leave_status from reference_items where is_active and  
                    refitems_category_id =(select id from reference_item_category where refitem_category_code='LEVST' and is_active )""");
      leave_status=query.dictfetchall(cur) 
      if leave_status:
         json_data['leave_status']=leave_status
         json_data['status']='NTE_01'
         json_data['msg']='success'
      else:
         json_data['leave_status']=[]
         json_data['status']='NTE_01'
         json_data['msg']='success'
    except Exception as e:
        error=exception_handling(500,type(e).__name__,str(e))
        json_data['leave_details']=error
        json_data['status']='NTE_02'
        json_data['msg']='fail'
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder), content_type=config.content_type_value)
 
def exception_handling(code,msg,info):
    ''' 
21-FEB-2018 || ESA || Exception handling  @param request: Request Object  @type request : Object  @return: return the data as object'''
    error={}
    error['status']=code
    error['error_type']=msg
    error['error']=info
    return error
