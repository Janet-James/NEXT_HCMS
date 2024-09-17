from __future__ import unicode_literals
from django.shortcuts import render
import json
from django.views.decorators.csrf import csrf_exempt
from django.http.response import HttpResponse
from CommonLib import lib
from django.db import connection
import config
from CommonLib import query
from CommonLib.hcms_common import refitem_fetch
#template render html
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from CommonLib.hcms_common import menu_access_control
import datetime
from Succession_Planning.succession_planning.models import SP_TalentProfiling
#logger function import
import logging
import logging.handlers
logger_obj = logging.getLogger('logit') 

#talent profiling operation function here
def sp_talent_profiling_crud(request):
    ''' 
    24-sep-2018 PAR To Talent profiling views CRUD Operations 
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse  
    @author: PAR  
    ''' 
    #try: 
    logger_obj.info('Talent profiling   CRUD function by'+str(request.user.username))
    json_data = {}
    post = request.POST  
    cur=lib.db_connection()
    try:
        input_data = request.POST.get('results')
        if input_data:  
                input_data = json.loads(input_data)
        key=[i for i in input_data] 
        delete_id = request.POST.get(config.delete_id)
        update_id = request.POST.get("update_id") 
        uid = request.user.id
        def update_role(role_id,emp_id):
            try:
              cur.execute('update employee_info  set role_id_id=%s where id=%s'%(role_id,emp_id))
            except Exception  as e: 
                logger_obj.error(e) 
        def career_aspirations():
            data=input_data.get("career_aspirations")  
            # Proposed role update to employee table  
            '''if data.get('proposed_role'):
                update_role(data.get('proposed_role'),data.get('emp'))''' 
                
            return { "emp_id":str(data.get('emp')),"career_id":data.get('carrer_direction'),"role_id":data.get('proposed_role'),"mobility":data.get("mobility"),"is_active":True,"created_by_id":int(uid)}
        def retention_plan():
            data=input_data.get("retention_plan")
            return { "activity":str(data.get('activity')),"description":data.get('activity_desc'),"completion_date":data.get("completion_date"),"completion_status":data.get("completion_status")}
        def flight_risk():
            data=input_data.get("flight_risk")
            return {"age_id":data.get('age_of_worker'),"time_id":data.get('current_role'),"salary_id":data.get('salary_level'),"work_load_id":data.get("workload"),
                             "finding_job_id":data.get("prospects"),"has_pay_id":data.get("pay_rise"),"displinary_id":data.get("displinary_actions"),"sick_id":data.get("too_sick_leave"),
                            "work_late_early_id":data.get("late_early_leaveing"),"not_received_id":data.get("recevied_promotions"),"dperformance_id":data.get("decreasing_perfomance"),
                             "disengagement_id":data.get("disengagement"),"poor_id":data.get("poor_attitude"),"problems_id":data.get("problems_managers"),"commuting_id":data.get("cummuting_problems"),
                             "avg":data.get("avg_risk")
                    }  
        def succession_planning():  
            data=input_data.get("succession_planning")  
            return {"criticality_id":str(data.get('role_criticality')),"promotion_id":data.get('next_role'),"readiness_id":data.get('ready_promotion'),"succeed_id":data.get("employes_succeed"),"successor_id":data.get("successor_readiness")} 
        if uid: 
            if not update_id and not delete_id :  
                data={} 
                if "career_aspirations" in key:    
                    data.update(career_aspirations())  
                if  "retention_plan" in key: 
                    data.update(retention_plan())  
                if  "flight_risk" in key:  
                    data.update(flight_risk()) 
                if  "succession_planning" in key: 
                    data.update(succession_planning()) 
                status=SP_TalentProfiling(**data)                            
                status.save()     
                json_data[config.results] = config.add_success       
            elif update_id and  not delete_id: 
                data={}
                if "career_aspirations" in key:  
                    data.update(career_aspirations())   
                if  "retention_plan" in key:
                    data.update(retention_plan())   
                if  "flight_risk" in key:    
                    data.update(flight_risk())  
                if  "succession_planning" in key:
                    data.update(succession_planning())
                tatus = SP_TalentProfiling.objects.filter(id=update_id).update(**data)
                json_data[config.results] = config.update_success
            elif delete_id and not update_id:   
                    referred_record = record_validation('sp_talent_profiling_details', delete_id)
                    if referred_record:
                        status =  SP_TalentProfiling.objects.filter(id=delete_id).update(is_active="False",modified_by_id=int(uid))
                        json_data[config.results] = config.delete_success
                    else:
                        json_data[config.results] =status_keys.ERR0028 
          
        logger_obj.info('Talent profiling  CRUD response is'+str(json_data)+"attempted by"+str(request.user.username))         
    except Exception as e:
                logger_obj.error(e)
                json_data[config.results] =[]
    return HttpResponse(json.dumps(json_data))

#talent profile data function here
def sp_talent_profiling_data(request): 
    ''' 
    21-sep-2018 PAR To Talent profiling views 
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse 
    @author: PAR  
    ''' 
    try:
        logger_obj.info('Succession planning  sp_talent_profiling_data function by'+str(request.user.username))
        json_datas={} 
        if request.method=='GET' or request.method=='POST':  
            post=request.POST
            type=post.get("type")  
            cur=lib.db_connection()#to_char(hr_leave.created_date, 'MM-DD-YYYY HH24:MI:SS') AS raised_date,
            user_id = request.user.id   
            dic = {}  
            values=[]  
            if type=="dropdown":     
                table_name=post.get("table")   
                if table_name=="role": 
                    table_name='HCMS_TI_Role_Details'
                    column="id,role_title as name" 
                    cond=""       
                if table_name=="EMP":  
                    table_name='employee_info'  
                    column="id,(name||' '||last_name) as name"
                    cond=" order by name desc"      
                if user_id:  
                    org_query=query.fetch_hcms_query(config.succession_planning,config.sp_dropdown_query)
                    if org_query:  
                        org_query=org_query.format(table=table_name,column=column,condition=cond)
                        cur.execute(org_query)  
                        values=query.dictfetchall(cur)    
                json_datas['datas'] = values  
            elif type=="reference": 
                code=json.loads(post.get("code"))
                code=tuple([str(code) for code in tuple(code)])
                ref_query="select ri.id, refitems_name,rc.refitem_category_code from reference_items  ri inner join reference_item_category rc on ri.refitems_category_id=rc.id where rc.refitem_category_code in {} and ri.is_active order by ri.refitems_name"
                ref_query=ref_query.format(tuple(code))
                cur.execute(ref_query)  
                res=query.dictfetchall(cur)   
                json_datas['datas'] = res   
            elif type=="EMP":  
                emp_id=post.get('emp_id')  
                if user_id:  
                    emp_query=query.fetch_hcms_query(config.succession_planning,config.employee_details)
                    if emp_query:
                        cur.execute(emp_query,(emp_id,)) 
                        res=query.dictfetchall(cur) 
                    if res:  
                        json_datas['emp'] = res
                    emp_talent_query=query.fetch_hcms_query(config.succession_planning,config.employee_talent_data)
                    if emp_talent_query: 
                        cur.execute(emp_talent_query,(emp_id,))
                        talent_res=query.dictfetchall(cur)
                    if talent_res:  
                        json_datas['talent'] = talent_res
                    else:
                        json_datas['talent'] = []
            elif type=="EXP":
                emp_id=post.get('emp_id')  
                emp_id=1 
                if user_id:  
                    professional_experience_query=query.fetch_hcms_query(config.succession_planning,config.professional_experience)
                    if professional_experience_query: 
                        cur.execute(professional_experience_query,(emp_id,)) 
                        res=query.dictfetchall(cur)
                    if res:
                        json_datas['datas'] =res    
                    else:
                        json_datas['datas'] = []
            elif type=="CERTIFICATE":
                emp_id=post.get('emp_id')
                emp_id=1  
                if user_id:  
                    certificate_details_query=query.fetch_hcms_query(config.succession_planning,config.certificate_details)
                    if certificate_details_query:
                        cur.execute(certificate_details_query,(emp_id,))
                        res=query.dictfetchall(cur) 
                    if res:
                        json_datas['datas'] =res   
                    else:
                        json_datas['datas'] = [] 
            elif type=="ACCOLADES":
                emp_id=post.get('emp_id')
                emp_id=1  
                if user_id:  
                    accolades_details_query=query.fetch_hcms_query(config.succession_planning,config.accolades_details)
                    if accolades_details_query:
                        cur.execute(accolades_details_query,(emp_id,)) 
                        res=query.dictfetchall(cur) 
                    if res: 
                        json_datas['datas'] =res    
                    else:
                        json_datas['datas'] = []
                        
            
            logger_obj.info(' Succession planning sp_talent_profiling_data  response is'+str(json_datas)+"attempted by"+str(request.user.username))                 
    except Exception as e:
       logger_obj.error(e)
       json_datas['datas'] = []
    return HttpResponse(json.dumps(json_datas))
