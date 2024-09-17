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
logger_obj = logging.getLogger('logit')

class HCMSTrainingResults(TemplateView):
    ''' 
    20-SEP-2018 || JAN || To Load General Training Recommendation Page
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
        
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HCMSTrainingResults, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Training Results', self.request.user.id)
        if macl:
           template_name = config.training_results_template
        else:
            template_name = config.tags_access_denied_html
        return [template_name] 
    
    def get(self, request, *args, **kwargs):
        cur=connection.cursor() 
        context = super(HCMSTrainingResults, self).get_context_data(**kwargs)
        try:
            cur.execute(query.fetch_hcms_query(config.learning_development_module,config.fetch_organization_details_view))
            org_info=dictfetchall(cur)
            context[config.organization]=org_info
        except Exception as e:
            context[config.exception] = e
        cur.close()    
        return self.render_to_response(context)