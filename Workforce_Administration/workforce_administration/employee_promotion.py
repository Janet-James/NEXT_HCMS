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
 
from CommonLib.lib import *
# for decoder function
from django.core import serializers
from django.core.serializers.json import DjangoJSONEncoder
import HCMS.settings as status_keys

import logging
import logging.handlers
logger_obj = logging.getLogger('logit')
from CommonLib.hcms_common import record_validation 
# from UAM.uam_session_sync import uam_sessions_sync
# from UAM.uam_func_data_sync import uam_func_sync
# from tracking.models import Visitor
 
# Transform HCMS Promotion views here
class HCMSWorkforcePromotionView(TemplateView):  #Added- Esakkiprem-07Feb2018
    ''' 
    17-MAY-2018 || ESA || To HCMS employee promotion page loaded.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
     
    template_name = "workforce_administration/employee_promotion.html"
     
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HCMSWorkforcePromotionView, self).dispatch(request, *args, **kwargs)
    
    def get(self, request, *args, **kwargs):
        context = super(HCMSWorkforcePromotionView, self).get_context_data(**kwargs)
        return self.render_to_response(context)
    

# Transform CMS dashboard views here
class HCMSWorkforceEvaluatePromotionView(TemplateView):  #Added- Esakkiprem-07Feb2018
    ''' 
    17-MAY-2018 || ESA || To HCMS employee evaluate promotion page loaded.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
     
    template_name = "workforce_administration/evaluate_promotion.html"
     
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HCMSWorkforceEvaluatePromotionView, self).dispatch(request, *args, **kwargs)
    
    def get(self, request, *args, **kwargs):
        context = super(HCMSWorkforceEvaluatePromotionView, self).get_context_data(**kwargs)
        return self.render_to_response(context)