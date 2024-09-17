from __future__ import unicode_literals
from django.shortcuts import render

import json
from django.views.decorators.csrf import csrf_exempt
from django.http.response import HttpResponse
from django.db import connection
import config
from CommonLib import query as q
from datetime import datetime
import base64
from CommonLib.lib import path 
import logging
import logging.handlers
logger_obj = logging.getLogger('logit')
from CommonLib.hcms_common import file_datainsert

#API Static Image convert to stored
def static_image(id,img_str,format,img_name,cur,status,folder_name):
    ''' 
    19-Feb-2018 TRU To Attachment insert data.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: TRU
    '''
    try:
            logger_obj.info('Employee image storing in attachment function by'+str(id))
            image_name = str(str(id)+'.'+str(format))
            if img_str:
                logger_obj.info('Employee image storing in attachment function call'+str(id))
                file_location = file_datainsert([folder_name], [{'file_name': image_name, 'file_binary': img_str}])
                file_location = file_location+image_name
                if file_location:
                        cr = connection.cursor()
                        if status == 'insert':
                            querys =  q.fetch_hcms_query(config.employee_management, config.hrms_attachment_insert)  
                            print "==============================Query",querys
                            if querys:
                                cr.execute(querys,(str(image_name),str(file_location),str(format),))
                                insert_res = cr.fetchone() 
                                print "====Image Insert REturning ID========>",insert_res[0]
                                connection.commit()
                                return insert_res[0]
                        elif status == 'update':
                            querys =  q.fetch_hcms_query(config.employee_management, config.hrms_attachment_update)  
                            if querys:
                                cr.execute(querys,(str(image_name),str(file_location),str(format),int(id),))
                                update_res = cr.fetchone() 
                                print "====Image Update REturning ID========>",update_res[0]
                                connection.commit()
                                return update_res[0]
    except Exception as e:
        logger_obj.error(e)
        return 0  
    
#Attachment function here
@csrf_exempt
def attachmentOperation(request):
    ''' 
    19-Feb-2018 TRU To Attachment data loaded.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: TRU
    '''
    json_data = {}
    try:
            logger_obj.info('Employee image storing attachment function by'+str(request.user.username))
            cur = connection.cursor()  #create the database connection
            post = request.POST
            format = post.get(config.format)  
            img_name = post.get(config.img_name)  
            img_str = post.get(config.img_str)  
            attachment_id = post.get(config.attachment_id)  
            folder_name = post.get(config.folder_name)  
            print "-------------------------Folder--------------------",folder_name
            querys =  q.fetch_hcms_query(config.employee_management, config.hrms_attachment_max_id)  
            if not attachment_id:
                if querys and format and img_name and img_str:
                    cur.execute(querys);
                    values = q.dictfetchall(cur)
                    if values:
                        print "------------Insert-------------------",attachment_id
                        status = static_image(values[0]['id'],img_str,format,img_name,cur,'insert',folder_name);
                        json_data[config.id] = status
                else:
                    json_data[config.id] = []
            else:
                print "------------Update-------------------",attachment_id 
                status = static_image(attachment_id,img_str,format,img_name,cur,'update',folder_name);
                json_data[config.id] = status
    except Exception as e:
            print "-----------IMAGE Uploda------",e
            logger_obj.error(e)
            json_data[config.id] = 0  
    return HttpResponse(json.dumps(json_data))


#Org Logo Attachment function here
@csrf_exempt
def orgLogoOperation(request):
    ''' 
    14-Mar-2018 TRU To Logo Attachment data loaded.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: TRU
    '''
    json_data = {}
    try:
            logger_obj.info('Org logo image storing attachment function by'+str(request.user.username))
            cur = connection.cursor()  #create the database connection
            post = request.POST
            format = post.get(config.format)  
            img_name = post.get(config.img_name)  
            img_str = post.get(config.img_str)  
            attachment_id = post.get(config.attachment_id)  
            querys =  q.fetch_hcms_query(config.employee_management, config.hrms_attachment_max_id)  
            print "=================",attachment_id
            if not attachment_id:
                if querys and format and img_name and img_str:
                    cur.execute(querys);
                    values = q.dictfetchall(cur)
                    if values:
                        print "------------Insert-------------------",attachment_id
                        status = static_image(values[0]['id'],img_str,format,img_name,cur,'insert','logo');
                        json_data[config.id] = status
                else:
                    json_data[config.id] = []
            else:
                print "------------Update-------------------",attachment_id
                status = static_image(attachment_id,img_str,format,img_name,cur,'update','logo');
                json_data[config.id] = status
    except Exception as e:
            print "====================Org Logo --------------------",e
            logger_obj.error(e)
            json_data[config.id] = 0  
    return HttpResponse(json.dumps(json_data))
