# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.shortcuts import render

import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.http.response import HttpResponse
from CommonLib import query
from django.db import connection
from CommonLib import  lib,common_controller,query as q
from django_countries import countries
from datetime import datetime, timedelta
# from Workforce_Administration.workforce_administration.models import TransferInfo
#template render html
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from CommonLib.hcms_common import record_validation 
import logging
import logging.handlers
logger_obj = logging.getLogger('logit')

# Transfer views here
class Transfer(TemplateView):
    
    ''' 
    03-Apr-2018 PAR To work force Transfer  page loaded. 
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: PAR  
    '''
    template_name = "workforce_administration/workforce_transfer.html"   
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(Transfer, self).dispatch(request, *args, **kwargs)
    def get(self, request, *args, **kwargs):
        context = super(Transfer, self).get_context_data(**kwargs)
        return self.render_to_response(context)
# Transfer evaluration views here
class TransferEvaluation(TemplateView):
    
    ''' 
    03-Apr-2018 PAR To work force Transfer  page loaded. 
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: PAR  
    '''
    template_name = "workforce_administration/workforce_transfer_eval.html"   
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(TransferEvaluation, self).dispatch(request, *args, **kwargs)
    def get(self, request, *args, **kwargs):
        context = super(TransferEvaluation, self).get_context_data(**kwargs)
        return self.render_to_response(context)
    

