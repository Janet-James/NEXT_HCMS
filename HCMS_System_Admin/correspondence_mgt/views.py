# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import json
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.http.response import HttpResponse
from CommonLib import query
from django.db import connection
from CSD.JenkinsAPI import jenkins_fetch
import HCMS.settings as status_keys
from django.apps import apps
import logging
import logging.handlers
logger_obj = logging.getLogger('logit')
from HCMS_System_Admin.system_admin.models import Reference_Item_Category, Reference_Items
from CommonLib.hcms_common import refitem_fetch, record_validation
from .models import HCMS_CM_System_Entities

from CommonLib.hcms_common import file_datainsert
# from UAM.uam_session_sync import uam_sessions_sync
# from UAM.uam_func_data_sync import uam_func_sync
# from tracking.models import Visitor

class CorrespondenceView(TemplateView):
    ''' 
        26-Mar-2018 || KAV || To HCMS correspondence management landing page loaded
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
    '''
    
    template_name = "system_admin/correspondence_mgt/entities_info.html"
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(CorrespondenceView, self).dispatch(request, *args, **kwargs)
    
    def get(self, request, *args, **kwargs):
        context = super(CorrespondenceView, self).get_context_data(**kwargs)
        context['entity_type'] = refitem_fetch('SENTY')
        context['category'] = refitem_fetch('SENCT')
        context['sub_category'] = refitem_fetch('SSBCT')
        context['status'] = refitem_fetch('SENST')
        return self.render_to_response(context)
    
class DataDictionary(TemplateView):
    ''' 
        26-Mar-2018 || KAV || To HCMS correspondence management landing page loaded
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
    '''
    
    template_name = "system_admin/correspondence_mgt/data_dictionary.html"
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(DataDictionary, self).dispatch(request, *args, **kwargs)
    
    def get(self, request, *args, **kwargs):
        context = super(DataDictionary, self).get_context_data(**kwargs)
        return self.render_to_response(context)

def static_doc(status,folder_name,datas):
    try:
        image_name = datas[1]
        logger_obj.info("Correspondence Entities Image Upload details save by ")
        if image_name:

            file_location = file_datainsert([folder_name], [{'file_name': image_name, 'file_binary': datas[0].split(',')[1]}])
            file_location = file_location+image_name
            if file_location:
                cr = connection.cursor()
                if status == 'insert':
                    cs_entity_create = HCMS_CM_System_Entities.objects.create(entity_name=datas[2],
                                                                              entity_code=datas[3],
                                                                              entity_category_refitem_id=datas[4],
                                                                              entity_subcategory_refitem_id=datas[5],
                                                                              entity_type_refitem_id=datas[6],
                                                                              entity_type_content=str(file_location),
                                                                              entity_status_refitem_id=datas[7],
                                                                              created_by_id=datas[8], 
                                                                              modified_by_id=datas[8])
                if status == 'update':
                    cs_entity_update = HCMS_CM_System_Entities.objects.get(id=id)
                    cs_entity_update.entity_name=datas[2]
                    cs_entity_update.entity_code=datas[3]
                    cs_entity_update.entity_category_refitem_id=datas[4]
                    cs_entity_update.entity_subcategory_refitem_id=datas[5]
                    cs_entity_update.entity_type_refitem_id=datas[6]
                    cs_entity_update.entity_type_content=str(file_location)
                    cs_entity_update.entity_status_refitem_id=datas[7]
                    cs_entity_update.modified_by_id=datas[8]
                    cs_entity_update.save()

    except Exception as e:
        logger_obj.error("Correspondence Entities Image Upload error is "+ str(e) )
        
@csrf_exempt
def entity_add_data(request):
    '''
        27-MAR-2018 || KAV || Entity Data Insert Function
        @param request: Request Object
        @type request : Object
        @return: HttpResponse of select
        @author: KAV
    '''
    json_data = {}
    logger_obj.info("Correspondence Entities details save by "+str(request.user.username))
    username = request.user.username
    uid = request.user.id
    cr = connection.cursor()
    if not uid:
        uid = 1
    if request.method == "POST":
        try:
            entity_name = request.POST.get("entity_name")
            entity_code = request.POST.get("entity_code").upper()
            category_val = request.POST.get("category_val")
            sub_category_val = request.POST.get("sub_category_val")
            type_val = request.POST.get("type_val")
            cr.execute(""" select refitems_code from reference_items  where id = %s """, (type_val,))
            res = cr.fetchall()
            res = res[0][0]
            status_val = request.POST.get("status_val")
            type_text = request.POST.get("type_text")
            img_name = request.POST.get("img_name")
            datas = [type_text, img_name, entity_name, entity_code, category_val, sub_category_val, type_val, status_val, uid]
            if res == 'IMAGE':
                static_doc('insert','Manage_Entities_Images',datas);
            else:
                cs_entity_create = HCMS_CM_System_Entities.objects.create(entity_name=entity_name,
                                                                           entity_code=entity_code,
                                                                           entity_category_refitem_id=category_val,
                                                                           entity_subcategory_refitem_id=sub_category_val,
                                                                           entity_type_refitem_id=type_val,
                                                                           entity_type_content=type_text,
                                                                           entity_status_refitem_id=status_val,
                                                                           created_by_id=uid, 
                                                                           modified_by_id=uid)
            json_data["status"] = status_keys.SUCCESS_STATUS
        except Exception as e:
            if 'unique constraint' in e.message:
                json_data["status"] = status_keys.ERR0020
            else:
                json_data["status"] = status_keys.FAILURE_STATUS
            logger_obj.error("Correspondence Entities  error is "+ str(e) +" and status is "+ str(json_data['status']) +" attempted by "+str(request.user.username))
        logger_obj.info("Correspondence Entities final response is "+ str(json_data) +" attempted by "+str(request.user.username))    
    return HttpResponse(json.dumps(json_data))

@csrf_exempt
def entity_fetch_data(request):
    '''
        28-MAR-2018 || KAV || Entity Data Fetch Function
        @param request: Request Object
        @type request : Object
        @return: HttpResponse of select
        @author: KAV
    '''
    json_data = {}
    logger_obj.info("Correspondence Entities details save by "+str(request.user.username))
    username = request.user.username
    uid = request.user.id
    if not uid:
        uid = 1
    if request.method == "POST":
        try:
            datas = request.POST.get("datas")
            datas = json.loads(datas)
            if not datas['entity_name']:
                del datas['entity_name']
            if not datas['entity_type_refitem_id']:
                del datas['entity_type_refitem_id']
            else:
                datas['entity_type_refitem_id'] = [int(i) for i in datas['entity_type_refitem_id']]
            datas_keys = datas.keys()
            out_str = """select se.id,  rf.refitems_name as type,   se.entity_name,rf1.refitems_name as category, rf2.refitems_name as subcategory, 
                            rf3.refitems_name as status, se.entity_code  from hcms_cm_system_entities se  , 
                            reference_items rf ,reference_items rf1 , reference_items rf2 , reference_items rf3 where """
            count = 0
            for i in datas_keys:
                if i == "entity_type_refitem_id":
                    if count == 0:
                        out_str = out_str + "se." + i
                    else:
                        out_str = out_str + "and " + "se." + i 
                    if len(datas[i]) == 1:
                        out_str = out_str + " = " + str(datas[i][0]) + " "
                    else:
                        out_str = out_str + " in {0} " 
                        out_str = out_str.format(tuple(datas[i]))
                elif i == "entity_name":
                    if count == 0:
                        out_str = out_str + "se." + i + " ilike '%{0}%' "
                    else:
                        out_str = out_str + "and " + "se." + i + " ilike '%{0}%' "
                    out_str = out_str.format(str(datas[i]))
                else:
                    if count == 0:
                        out_str = out_str + "se." + i + " = " + datas[i] + " "
                    else:
                        out_str = out_str + "and " + "se." + i + " = " + datas[i] + " "
                count =count+1 
            cur = connection.cursor()
            refname_fetch = """ and rf.id  = se.entity_type_refitem_id and rf1.id = se.entity_category_refitem_id 
                                    and rf2.id = se.entity_subcategory_refitem_id
                                    and rf3. id = se.entity_status_refitem_id and se.is_active = 'True' """
            cur.execute(out_str + refname_fetch)
            result=cur.fetchall()
            json_data['datas'] = result
            json_data["status"] = status_keys.SUCCESS_STATUS

        except Exception as e:
            json_data["status"] = status_keys.FAILURE_STATUS
            logger_obj.error("Correspondence Entities  error is "+ str(e) +" and status is "+ str(json_data['status']) +" attempted by "+str(request.user.username))
        logger_obj.info("Correspondence Entities final response is "+ str(json_data) +" attempted by "+str(request.user.username))    
    return HttpResponse(json.dumps(json_data))

@csrf_exempt
def entity_fetchdata_onclick(request):
    '''
        28-MAR-2018 || KAV || Entity Data Fetch  Function on row Click
        @param request: Request Object
        @type request : Object
        @return: HttpResponse of select
        @author: KAV
    '''
    json_data = {}
    logger_obj.info("Correspondence Entities details save by "+str(request.user.username))
    username = request.user.username
    uid = request.user.id
    if not uid:
        uid = 1
    if request.method == "POST":
        try:
            id= request.POST.get("id")
            cur1 = connection.cursor()
            cur1.execute("""select hc.entity_name ,hc.entity_code, hc.entity_category_refitem_id, hc.entity_status_refitem_id, hc.entity_subcategory_refitem_id, hc.entity_type_refitem_id, hc.entity_type_content, ri.refitems_code as type_code
                 from hcms_cm_system_entities hc inner join  reference_items ri on ri.id=hc.entity_type_refitem_id where hc.id=%s  """,(str(id),))
            fetch_id=cur1.fetchall()
            json_data['id'] = fetch_id
        except Exception as e:
            json_data["status"] = status_keys.FAILURE_STATUS
            logger_obj.error("Correspondence Entities  error is "+ str(e) +" and status is "+ str(json_data['status']) +" attempted by "+str(request.user.username))
        logger_obj.info("Correspondence Entities final response is "+ str(json_data) +" attempted by "+str(request.user.username))    
    return HttpResponse(json.dumps(json_data))

@csrf_exempt
def entity_update_data(request):
    '''
        28-MAR-2018 || KAV || Entity Data Update Function
        @param request: Request Object
        @type request : Object
        @return: HttpResponse of select
        @author: KAV
    '''
    json_data = {}
    logger_obj.info("Correspondence Entities details save by "+str(request.user.username))
    username = request.user.username
    uid = request.user.id
    cr = connection.cursor()
    if not uid:
        uid = 1
    if request.method == "POST":
        try:
            id= request.POST.get("id")
            entity_name = request.POST.get("entity_name")
            entity_code = request.POST.get("entity_code").upper()
            category_val = request.POST.get("category_val")
            sub_category_val = request.POST.get("sub_category_val")
            type_val=request.POST.get("type_val")
            cr.execute(""" select refitems_code from reference_items  where id = %s """, (type_val,))
            res = cr.fetchall()
            res = res[0][0]
            type_text=request.POST.get("type_text")
            status_val = request.POST.get("status_val")
            img_name = request.POST.get("img_name")
            datas = [type_text, img_name, entity_name, entity_code, category_val, sub_category_val, type_val, status_val, uid]
            if res == 'IMAGE':
                static_doc('update','Manage_Entities_Images',datas);
            else:
                cs_entity_update = HCMS_CM_System_Entities.objects.get(id=id)
                cs_entity_update.entity_name=entity_name
                cs_entity_update.entity_code=entity_code
                cs_entity_update.entity_category_refitem_id=category_val
                cs_entity_update.entity_subcategory_refitem_id=sub_category_val
                cs_entity_update.entity_type_refitem_id=type_val
                cs_entity_update.entity_type_content=type_text
                cs_entity_update.entity_status_refitem_id=status_val
                cs_entity_update.modified_by_id=uid
                cs_entity_update.save()
            json_data["status"] = status_keys.UPDATE_STATUS
        except Exception as e:
            if 'unique constraint' in e.message:
                json_data["status"] = status_keys.ERR0020
            else:
                json_data["status"] = status_keys.FAILURE_STATUS
            logger_obj.error("Correspondence Entities  error is "+ str(e) +" and status is "+ str(json_data['status']) +" attempted by "+str(request.user.username))
        logger_obj.info("Correspondence Entities final response is "+ str(json_data) +" attempted by "+str(request.user.username))    
    return HttpResponse(json.dumps(json_data))

@csrf_exempt
def entity_delete_data(request):
    '''
        28-MAR-2018 || KAV || Entity Data Delete Function
        @param request: Request Object
        @type request : Object
        @return: HttpResponse of select
        @author: KAV
    '''
    json_data = {}
    logger_obj.info("Correspondence Entities details save by "+str(request.user.username))
    username = request.user.username
    uid = request.user.id
    if not uid:
        uid = 1
    if request.method == "POST":
        try:
            id= request.POST.get("id")
            is_active = request.POST.get("is_active")
            referred_record = record_validation('hcms_cm_system_entities', id)
            if referred_record == True:
                cs_entity_update = HCMS_CM_System_Entities.objects.get(id=id)
                cs_entity_update.is_active=is_active
                cs_entity_update.save()
                json_data["status"] = status_keys.REMOVE_STATUS
            else:
                json_data["status"] = status_keys.ERR0028
        except Exception as e:
            json_data["status"] = status_keys.FAILURE_STATUS
            logger_obj.error("Correspondence Entities  error is "+ str(e) +" and status is "+ str(json_data['status']) +" attempted by "+str(request.user.username))
        logger_obj.info("Correspondence Entities final response is "+ str(json_data) +" attempted by "+str(request.user.username))    
    return HttpResponse(json.dumps(json_data))