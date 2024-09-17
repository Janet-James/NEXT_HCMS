from __future__ import unicode_literals
from django.shortcuts import render

import json
from django.views.decorators.csrf import csrf_exempt
from django.http.response import HttpResponse
from CommonLib import query
from django.db import connection
import config
from HRMS_Foundation.employee_management.models import EmployeeDocumentAttachment as DI
from CommonLib import query as q
from datetime import datetime
from CommonLib.hcms_common import refitem_fetch
from CommonLib.hcms_common import file_datainsert
from CommonLib.hcms_common import record_validation 

#template render html
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
import logging
import logging.handlers
logger_obj = logging.getLogger('logit')

#Employee Document views here
class HrmsDocumentList(TemplateView):
    ''' 
     19-Mar-2018 TRU To Employee Document page loaded. And also check the user authentication
     @param request: Request Object
     @type request : Object
     @return:   HttpResponse or Redirect the another URL
     @author: TRU
     '''
    template_name = "hrms_foundation/employee_management/employee_document.html"
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HrmsDocumentList, self).dispatch(request, *args, **kwargs)
    
    def get(self, request, *args, **kwargs):
         context = super(HrmsDocumentList, self).get_context_data(**kwargs)
         res = refitem_fetch('EDCTY')
         context['document_type'] = res
         context['document_reason'] = res
         return self.render_to_response(context)
     
#Employee Past Document views here
class HrmsPastDocumentList(TemplateView):
    ''' 
     21-Mar-2018 TRU To Employee Past Document page loaded. And also check the user authentication
     @param request: Request Object
     @type request : Object
     @return:   HttpResponse or Redirect the another URL
     @author: TRU
     '''
    template_name = "hrms_foundation/employee_management/past_employee_document.html"
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HrmsPastDocumentList, self).dispatch(request, *args, **kwargs)
    
    def get(self, request, *args, **kwargs):
         context = super(HrmsPastDocumentList, self).get_context_data(**kwargs)
         cur = connection.cursor()  #create the database connection
         cur.execute(q.fetch_hcms_query(config.attendance_management, config.hrms_org_list));
         values = q.dictfetchall(cur)
         context['org'] = values
         return self.render_to_response(context)
     
     
     
#Employee Event 
def hrmsEmployeeDocumentListEvent(request):
         ''' 
         19-Mar-2018 TRU To HRMS Employee event data page loaded. And also check the user authentication
         @param request: Request Object
         @type request : Object
         @return:   HttpResponse or Redirect the another URL
         @author: TRU
         '''
         post = request.POST
         att_id = post.get(config.id)  #get table key 
         cur = connection.cursor()  #create the database connection
         json_data = {}
         try:
             logger_obj.info('Employee data event function by'+str(request.user.username)) 
             query =  q.fetch_hcms_query(config.employee_management, config.hrms_doc_employee_event_list)
             if att_id and query :
                 cur.execute(query,(int(att_id),));
                 values = q.dictfetchall(cur)
                 if values:
                     json_data[config.datas] = values
                     json_data[config.user] = request.user.username
                 else:
                     json_data[config.datas] = []
                     json_data[config.user] = request.user.username
                 logger_obj.info('Employee data event response is'+str(json_data)+"attempted by"+str(request.user.username))    
         except Exception as e:
              logger_obj.error(e)
              json_data[config.datas] = []
              json_data[config.user] = request.user.username
         cur.close()
         return HttpResponse(json.dumps(json_data))
     
#Employee doc details 
def hrmsEmployeePastDocumentList(request):
         ''' 
         20-Mar-2018 TRU To HRMS Employee data page loaded. And also check the user authentication
         @param request: Request Object
         @type request : Object
         @return:   HttpResponse or Redirect the another URL
         @author: TRU
         '''
         cur = connection.cursor()  #create the database connection
         json_data = {}
         try:
                 logger_obj.info('Employee past data event function by'+str(request.user.username)) 
                 post = request.POST.get
                 input_data = post(config.input_data) 
                 input_data = json.loads(input_data)
                 org_id = input_data[0][config.org_id]
                 org_unit_id = input_data[0][config.org_unit_id]
                 emp_list = tuple(int(i) for i in input_data[0][config.emp_list]) 
                 query =  q.fetch_hcms_query(config.employee_management, config.hrms_past_doc_details)
                 if emp_list:
                     print "====== If Employee search ids=======",emp_list
                     query = query +' and ei.id in %s '
                     cur.execute(query +' and oi.id=%s and oui.id=%s order by ei.name',(emp_list,int(org_id),int(org_unit_id),));
                     values = cur.fetchall()
                 else:
                     print "====== Else Employee search ids=======",emp_list
                     cur.execute(query +' and oi.id=%s and oui.id=%s order by ei.name',(int(org_id),int(org_unit_id),));
                     values = cur.fetchall()
                 if values:
                     json_data[config.results] = values
                 else:
                     json_data[config.results] = []
                 logger_obj.info('Employee past data event response is'+str(json_data)+"attempted by"+str(request.user.username))
         except Exception as e:
              print e
              logger_obj.error(e)
              json_data[config.results] = []
         cur.close()
         return HttpResponse(json.dumps(json_data))    
     
#hrms employee past documents search 
def hrmsEmployeeDocumentList(request):
         ''' 
         21-Mar-2018 TRU To HRMS Employee past data page loaded. And also check the user authentication
         @param request: Request Object
         @type request : Object
         @return:   HttpResponse or Redirect the another URL
         @author: TRU
         '''
         cur = connection.cursor()  #create the database connection
         json_data = {}
         try:
             logger_obj.info('Employee data event function by'+str(request.user.username)) 
             query =  q.fetch_hcms_query(config.employee_management, config.hrms_attachment_doc_details)
             if query :
                 cur.execute(query);
                 values = cur.fetchall()
                 if values:
                     json_data[config.results] = values
                 else:
                     json_data[config.results] = []
                 logger_obj.info('Employee data event response is'+str(json_data)+"attempted by"+str(request.user.username))    
         except Exception as e:
              print e
              logger_obj.error(e)
              json_data[config.results] = []
         cur.close()
         return HttpResponse(json.dumps(json_data))    
     
#API Static dpc convert to stored
def static_doc(status,folder_name,font_datas):
    ''' 
    20-Mar-2018 TRU To Attachment insert data.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: TRU
    '''
    try:
            logger_obj.info('Employee document storing in attachment function by'+str(id))
            image_name = font_datas[1]
            if image_name:
                logger_obj.info('Employee document storing in attachment function call'+str(font_datas[1]))
                file_location = file_datainsert([folder_name], [{'file_name': image_name, 'file_binary': font_datas[0]}])
                file_location = file_location+image_name
                if file_location:
                        cr = connection.cursor()
                        if status == 'insert':
                            querys =  q.fetch_hcms_query(config.employee_management, config.hrms_attachment_doc_insert)  
                            if querys:
                                print "===========querys================="
                                dates = font_datas[8].split('-')[2]+'-'+font_datas[8].split('-')[1]+'-'+font_datas[8].split('-')[0]
                                cr.execute(querys,(True,str(image_name),str(file_location),str(font_datas[2]),int(font_datas[9]),int(font_datas[6]),int(font_datas[3]),int(font_datas[9]),int(font_datas[4]),int(font_datas[5]),str(font_datas[7]),))
                                insert_res = cr.fetchone() 
                                print "====docu Insert REturning ID========>",insert_res[0]
                                connection.commit()
                                return insert_res[0]
    except Exception as e:
        logger_obj.error(e)
        return 0  
    
#Employee Document List Insert
def hrmsEmployeeDocumentListInsert(request):
    ''' 
    20-Mar-2018 TRU To HRMS Employee document create page loaded. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: TRU
    '''
    try:
            logger_obj.info('Attendance CRUD function by'+str(request.user.username))
            json_data = {}
            post = request.POST.get
            input_data = post(config.results)   
            delete_id = post(config.del_id)  
            doc_type_id = post(config.doc_type_id)  
            uid = request.user.id
            if not uid:
                uid = 1
            if input_data and not delete_id and not doc_type_id :
                    input_data = json.loads(input_data)    
                    input_data = input_data['input_data']
                    if input_data:
                           print "---------------Insert---------------"
                           for data in input_data[0]['image_data']:
                               imgName = ''
                               if data['name']:
                                    cur = connection.cursor()  #create the database connection
                                    cur.execute("select 'EMP00'||id||'_'||name as name from document_info where name ilike '%"+str(data['name'])+"%'");
                                    img_data = q.dictfetchall(cur)
                                    if img_data:
                                        imgName = img_data[0]['name']
                                    else:
                                        imgName = str(data['name'])
                               else:
                                   imgName = 'EMP_SAM_'+str(data['name'])
                               print "---------------",imgName
                               font_datas = [ data['encode'], imgName, data['format'],input_data[0]['employee_id'],input_data[0]['org_id'],input_data[0]['unit_id'],input_data[0]['doc_id'],input_data[0]['notes'],input_data[0]['uploaded_on'],uid]
                               status = static_doc('insert','documents',font_datas);
                               json_data[config.results] = 'NTE_01'
                    else:
                        json_data[config.results] = 'NTE_02'
            else:
                    print "---------------Delete---------------",delete_id,doc_type_id
                    referred_record = record_validation('document_info', int(delete_id))
                    logger_obj.info( "==================Document List Delete Status ====>"+str(referred_record) )
                    if referred_record:
                        status =  DI.objects.filter(id=delete_id).update(is_active="False",reason=int(doc_type_id),modified_by_id=int(uid))
                        json_data[config.results] = 'NTE_04'
                    else:
                        json_data[config.results] = 'ERR0028'  
            logger_obj.info('Attendance CRUD response is'+str(json_data)+"attempted by"+str(request.user.username))         
    except Exception as e:
            print e
            logger_obj.error(e)
            json_data[config.results] = 'NTE_02'
    return HttpResponse(json.dumps(json_data))