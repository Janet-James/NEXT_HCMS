# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.shortcuts import render

import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.http.response import HttpResponse
from CommonLib import query
from django.db import connection
from CommonLib import query as q
from django_countries import countries
import config
from datetime import datetime, timedelta
#template render html
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from CommonLib.hcms_common import record_validation 
import logging
import logging.handlers
logger_obj = logging.getLogger('logit')

# Demotion views here
class HCMSWorkforceDemotionView(TemplateView):
    ''' 
    17-May-2018 || SND || To load HCMS Workforce Administration Demotion
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''

    template_name = "workforce_administration/workforce_demotion.html"
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HCMSWorkforceDemotionView, self).dispatch(request, *args, **kwargs)
    
    def get(self, request, *args, **kwargs):
        context = super(HCMSWorkforceDemotionView, self).get_context_data(**kwargs)
        return self.render_to_response(context)