from django.http.response import HttpResponse
from CommonLib import query,common_controller as cc
from django.db import connection
from CommonLib import query as q
import config as config
import HCMS.settings as settings
from CommonLib.asyn_mail import asyn_email  
from CommonLib import lib
from Exit_Management.exit_management.models import EM_ExitDetails
import logging
import json
import datetime

logger_obj = logging.getLogger('logit')

#logged employee function here
def logged_employee(request,option):
    """
            07-March-2018 PAR To HRMS  getting the logged employee with user id  
            @param request: Request Object
            @type request : Object
            @return:   Response result
    """
    try:
        cur =lib.db_connection()
        logged_user = request.user.id
        leave_logged_emp_query="select {param} from employee_info where related_user_id_id=%s and is_active=True"
        leave_logged_emp_query=leave_logged_emp_query.format(param=option)#id,name,work_email
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
 
#request data get function here 
def EMRequestInitialData(request): 
    ''' 
    27-Aug-2018 PAR To Exit management Initial data
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse 
    @author: PAR
    '''
    try:
        logger_obj.info('Exit management initial data  function by'+str(request.user.username))
        if request.method=='GET' or request.method=='POST':
            post=request.POST
            type=post.get("type")
            cur=lib.db_connection()#to_char(hr_leave.created_date, 'MM-DD-YYYY HH24:MI:SS') AS raised_date,
            user_id = request.user.id
            emp_id=logged_employee(request,'id')
            dic = {} 
            json_datas = {}   
            values=[];
            if type=="all":  
                 if user_id:
                    log_query = """select to_char(can.created_date+ interval '330' minute,'dd-mm-yyyy hh:mi:ss') as created_date,
                        to_char(can.modified_date+ interval '330' minute,'dd-mm-yyyy hh:mi:ss') as modified_date,
                        (case when (can.is_active is true ) then 'Active' else 'In Active' end) as status,
                        coalesce((select username from auth_user where id = can.created_by_id),'') as createdby_username,
                        coalesce((select username from auth_user where id = can.modified_by_id),'') as modify_username,
                        to_char(ee.created_date::timestamptz - interval '330' minute,'dd-mm-yyyy hh12:mi:ss') as created_datatime,
                        coalesce(can.name,'')||' '||coalesce(can.last_name,'') as title from employee_info   can inner join em_exit_details  ee on can.id = ee.emp_id order by created_datatime 
                        """
                    cur.execute(log_query)   
                    log_details = q.dictfetchall(cur)    
                    json_datas['log_details'] = log_details
                    all_exit_emp=query.fetch_hcms_query(config.exit_management,config.all_exit_employee)
                    if all_exit_emp:
                        cur.execute(all_exit_emp%(emp_id,))  
                        values=q.dictfetchall(cur) 
                 close = lib.db_close(cur)  
                 json_datas['datas'] = values 
            if type=="row":  
                 table_id=post.get("table_id")      
                 if user_id: 
                    row_exit_employee=query.fetch_hcms_query(config.exit_management,config.row_exit_employee)
                    if row_exit_employee:
                        cur.execute(row_exit_employee % (table_id,)) 
                        values=q.dictfetchall(cur) 
                 close = lib.db_close(cur) 
                 json_datas['datas'] = values        
            elif type=="drop":  
                if user_id:  
                    exit_employee=query.fetch_hcms_query(config.exit_management,config.employee_list_fetch_sel)
                    if exit_employee:
                        cur.execute(exit_employee)   
                        values=q.dictfetchall(cur)  
                commit =lib.db_commit(cur)  
                close = lib.db_close(cur) 
                json_datas['datas'] = values
                json_datas = json_datas#response data  function call
            logger_obj.info('Exit management initial data  function by response is'+str(json_datas)+"attempted by"+str(request.user.username))                 
    except Exception as e:
       logger_obj.error(e) 
       json_datas['datas'] = []
    return HttpResponse(json.dumps(json_datas)) 

#get reference items function here
def get_refitems(code):
    try:
        res=""
        cur=connection.cursor()
        result_data = {}
        cur.execute(""" select id,refitems_name from reference_items where id in %s""",(code,))  
        values =q.dictfetchall(cur)
        if values:
            for i in values:
                res+=i.get("refitems_name")+ ','
        res=res[:-1]                
        return res     
    except Exception as e:
        logger_obj.error(e)
        
#send mail function here        
def send_mail(emp_name,reasons,relieving_date,to_address):
    
    try:
        exit_mail_content= config.exit_mail_body_content.format(emp_name,reasons,relieving_date)
        stats=asyn_email(config.Transform_hcms,config.module_name,config.subject_content,to_address,exit_mail_content,config.waiting)
    except Exception as e: 
        logger_obj.error(e)
        
#exit operation function here
def ExitCRUDOpertion(request):
    '''  
    29-AUG-2018 PAR To Exit management  CRUD operations 
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse 
    @author: PAR
    ''' 
    logger_obj.info('Exit management CRUD function by'+str(request.user.username))
    json_data = {}
    post = request.POST
    cur=lib.db_connection() 
    try: 
        input_data = request.POST.get(config.datas)
        delete_id = request.POST.get(config.delete_id)
        uid = request.user.id   
        if uid: 
            update_id = request.POST.get("update_id")
            if input_data:  
                input_data = json.loads(input_data) 
            if input_data and not delete_id: 
                    if not update_id: 
                        query=q.fetch_hcms_query(config.exit_management, config.exit_employee_check)
                        cur.execute(query,(input_data['exit_employee'],))
                        status = cur.rowcount 
                        if status > 0:
                            json_data[config.results]= config.status_already_exists
                        else: 
                            reasons=""
                            if input_data.get('other_reason'):  
                                status = EM_ExitDetails(emp_id=input_data['exit_employee'],emp_resignation_date=input_data['exit_resignation'],
                                emp_leaving_reason_refitem =input_data['reason'],emp_remarks=input_data['remarks'] , emp_exp_relieving_date=input_data['exit_relieving'],emp_leaving_reason_others=input_data['other_reason'],emp_status=False,hr_emp_status=False,is_active=True,created_by_id=int(uid))
                                reasons= input_data.get('other_reason')
                            else: 
                                status = EM_ExitDetails(emp_id=input_data['exit_employee'],emp_resignation_date=input_data['exit_resignation'],
                                emp_leaving_reason_refitem =input_data['reason'],emp_remarks=input_data['remarks'] , emp_exp_relieving_date=input_data['exit_relieving'],emp_status=False,hr_emp_status=False,is_active=True,created_by_id=int(uid))
                            #status.save()
                            json_data[config.results] = config.add_success
                            emp_name=logged_employee(request,'name')
                            emp_email=logged_employee(request,'work_email')
                            reas =get_refitems(tuple(input_data['reason']))  
                            if reasons:
                                reas=reas+','+reasons 
                            dt = datetime.datetime.strptime(input_data['exit_relieving'], '%Y-%m-%d')
                            relieving_date='{0}-{1}-{2}'.format(dt.day,dt.month, dt.year)
                            send_mail(emp_name,reas,relieving_date,emp_email)   
            logger_obj.info('Exit management CRUD function response is'+str(json_data)+"attempted by"+str(request.user.username))         
    except Exception as e:  
                logger_obj.error(e) 
                json_data[config.results] =[]
    return HttpResponse(json.dumps(json_data))

