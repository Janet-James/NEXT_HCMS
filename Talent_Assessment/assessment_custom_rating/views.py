# -*- coding: utf-8 -*-
from __future__ import unicode_literals
 
import json
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from django.http.response import HttpResponse
from CommonLib import query,lib
from django.db import connection
from CommonLib.lib import dictfetchall
from CommonLib.hcms_common import record_validation
from CSD.JenkinsAPI import jenkins_fetch
from django.core.serializers.json import DjangoJSONEncoder
from Talent_Inventory.talent_inventory.models import HCMS_TI_Custom_Rating_Scheme,HCMS_TI_Custom_Rating_Scheme_Relation
import config
import HCMS.settings as status_keys
import logging
import logging.handlers
logger_obj = logging.getLogger('logit')
import HCMS.settings as status_keys

class HCMSTalentAssessmentRatingView(TemplateView):  
    '''
    07-Feb-2018 || SAR || To HCMS Talent assessment Custom rating page loaded
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
 
    template_name = "talent_assessment/ta_custom_rating_schema.html"
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HCMSTalentAssessmentRatingView, self).dispatch(request, *args, **kwargs)
    
    def get(self, request, *args, **kwargs):
        context = super(HCMSTalentAssessmentRatingView, self).get_context_data(**kwargs)
        return self.render_to_response(context)
 
def AddUpdateCustomRatingScheme(request):
    '''
    09-Feb-2018 || SAR || To Add or Update the Rating Data Function
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse to return the success or error message
    '''  
    try:
        json_datas = {}
        cur = connection.cursor()
        status =''
        exist_check_flag=False
        custom_rating_scheme_name=request.POST.get('custom_rating_scheme_name')
        custom_rating_scheme_update_id=request.POST.get('custom_rating_scheme_update_id')
        custom_rating_detail_list=json.loads(request.POST.get('rating_detail_list'))
        logger_obj.info("function name:AddUpdateCustomRatingScheme, requested data : custom_rating_scheme_name  is "+ str(custom_rating_scheme_name) +" attempted by "+str(request.user.username))
        cur.execute(query.fetch_hcms_query(config.talent_assessment,config.custom_rating_name_existence_check),(custom_rating_scheme_name,))
        unique_check=dictfetchall(cur)
        if unique_check:
            if custom_rating_scheme_update_id:
                cur.execute(query.fetch_hcms_query(config.talent_assessment,config.custom_rating_update_name_existence_check),(custom_rating_scheme_name,custom_rating_scheme_update_id,))
                update_unique_check=cur.fetchall()
                if update_unique_check:
                    exist_check_flag=True
            else:
                exist_check_flag=True   
            logger_obj.info("function name:AddUpdateCustomRatingScheme, requested data : exist_check_flag is "+ str(exist_check_flag) +" attempted by "+str(request.user.username))
        if exist_check_flag==False:
            if custom_rating_scheme_update_id:
                rating_scheme=HCMS_TI_Custom_Rating_Scheme.objects.get(id=custom_rating_scheme_update_id,is_active=True)
                rating_scheme.custom_rating_scheme_name,rating_scheme.modified_by_id=custom_rating_scheme_name,request.user.id
                rating_scheme.save()
                for j in custom_rating_detail_list:
                    if j['rating_id']:
                        rating_scheme_rel=HCMS_TI_Custom_Rating_Scheme_Relation.objects.get(id=j['rating_id'],is_active=True)
                        rating_scheme_rel.custom_rating_name,rating_scheme_rel.custom_rating_value=j['rating_name'],j['value']
                        rating_scheme_rel.save()
                    else:
                        HCMS_TI_Custom_Rating_Scheme_Relation.objects.create(custom_rating_scheme=rating_scheme,custom_rating_name=j['rating_name'],custom_rating_value=j['value'],created_by_id=request.user.id)
                json_datas['status']=status_keys.UPDATE_STATUS
                logger_obj.info("function name:AddUpdateCustomRatingScheme, requested data : custom_rating_scheme_update_id is "+ str(custom_rating_scheme_update_id) +" attempted by "+str(request.user.username) +"status"+str(json_datas))
            else:
                custom_rating_scheme_insert=HCMS_TI_Custom_Rating_Scheme.objects.create(custom_rating_scheme_name=custom_rating_scheme_name,created_by_id=request.user.id)
                for i in custom_rating_detail_list:
                    custom_rating_detail_insert=HCMS_TI_Custom_Rating_Scheme_Relation.objects.create(custom_rating_scheme=custom_rating_scheme_insert,custom_rating_name=i['rating_name'],custom_rating_value=i['value'],created_by_id=request.user.id)
                json_datas['status']=status_keys.SUCCESS_STATUS
                logger_obj.info("function name:AddUpdateCustomRatingScheme, attempted by "+str(request.user.username) +"status"+str(json_datas))
        else:
            json_datas['status']='Exists'
    except Exception as e:
        json_datas['status'] = e
    logger_obj.error("function name:AddUpdateCustomRatingScheme, attempted by "+str(request.user.username) +"status"+str(json_datas))
    return HttpResponse(json.dumps(json_datas), content_type="application/json")
    
def CustomRatingDetailFetch(request):
    '''
    09-Feb-2018 || SAR || To Fetch the Rating Scheme
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse to return the success or error message
    '''   
    try:
        json_datas = {} 
        cur = connection.cursor()
        cur.execute(query.fetch_hcms_query(config.talent_assessment,config.custom_rating_detail_fetch))
        ratingdetails=dictfetchall(cur)
        json_datas['rating_details']=ratingdetails
        json_datas['status']='Success'
    except Exception as e:
        json_datas['status'] = e
    return HttpResponse(json.dumps(json_datas,cls=DjangoJSONEncoder), content_type="application/json")
 
def CustomRatingDetailFetchById(request):
    '''
    09-Feb-2018 || SAR || To Fetch the Rating Name
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse to return the success or error message
    '''
    try:
        json_datas = {} 
        cur = connection.cursor()
        custom_rating_scheme_id=request.POST.get('custom_rating_scheme_id')
        cur.execute(query.fetch_hcms_query(config.talent_assessment,config.custom_rating_detail_fetch_by_id),(custom_rating_scheme_id,))
        rating_rel_details=dictfetchall(cur)
        json_datas['rating_relation_data']=rating_rel_details
        json_datas['status'] = 'Success'
    except Exception as e:
        json_datas['status'] = e
    return HttpResponse(json.dumps(json_datas), content_type="application/json")
 
def CustomRatingDetailRemove(request):
    '''
    10-Feb-2018 || SAR || To Remove the Rating Scheme
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse to return the success or error message
    '''
    try:
        json_datas = {}
        custom_rating_scheme_id=request.POST.get('custom_rating_scheme_id')
        referred_record = record_validation('hcms_ti_custom_rating_scheme', custom_rating_scheme_id)
        if referred_record==True:
            rating_scheme=HCMS_TI_Custom_Rating_Scheme.objects.get(id=custom_rating_scheme_id)
            rating_scheme.is_active,rating_scheme.modified_by_id=False,request.user.id
            rating_scheme.save()
            json_datas['status'] = status_keys.REMOVE_STATUS
        else:
            json_datas['status'] = status_keys.ERR0028
        print"sdfsdfsdsdsd",json_datas
    except Exception as e:
        json_datas['status'] = e
    logger_obj.info("function name:CustomRatingDetailRemove, requested data : ccustom_rating_scheme_id  is "+ str(custom_rating_scheme_id) +" attempted by "+str(request.user.username)+"status"+str(json_datas))
    return HttpResponse(json.dumps(json_datas), content_type="application/json")
 
def CustomRatingRelDetailRemove(request):
    '''
    10-Feb-2018 || SAR || To Remove the Rating Relation Table Values
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse to return the success or error message
    '''
    try:
        json_datas = {}
        custom_rating_rel_id=request.POST.get('custom_rating_rel_id')
        referred_record = record_validation('hcms_ti_custom_rating_scheme_relation', custom_rating_rel_id)
        if referred_record==True:
            rating_rel=HCMS_TI_Custom_Rating_Scheme_Relation.objects.get(id=custom_rating_rel_id)
            rating_rel.is_active,rating_rel.modified_by_id=False,request.user.id
            rating_rel.save()
            json_datas['status'] = status_keys.REMOVE_STATUS
        else:
            json_datas['status'] = status_keys.ERR0028
    except Exception as e:
        json_datas['status'] = e
    logger_obj.info("function name:CustomRatingRelDetailRemove, requested data : custom_rating_rel_id  is "+ str(custom_rating_rel_id) +" attempted by "+str(request.user.username)+"status"+str(json_datas))
    return HttpResponse(json.dumps(json_datas), content_type="application/json")