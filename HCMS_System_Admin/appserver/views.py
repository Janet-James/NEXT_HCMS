# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import json
import config
import os
import re
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from CommonLib import query
from django.db import connection
from  django.apps import apps
from CommonLib.hcms_common import access_data_mgt
from django.conf import settings
from django.http import HttpResponseRedirect, HttpResponse
import logging
import logging.handlers
logger_obj = logging.getLogger('logit')

# from UAM.uam_session_sync import uam_sessions_sync
# from UAM.uam_func_data_sync import uam_func_sync
# from tracking.models import Visitor

class AppServerView(TemplateView):
    ''' 
        03-APR-2018 || ANT || To HCMS app server page loading
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
    '''
    
    template_name = "appserver/appserver_info.html"
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(AppServerView, self).dispatch(request, *args, **kwargs)
    
    def get(self, request, *args, **kwargs):
        context = super(AppServerView, self).get_context_data(**kwargs)
        return self.render_to_response(context)

#btn access function here
def get_btn_access(request):
    try:
        tempt_dict = {}
        access_data = access_data_mgt(request.user.id,request.user.group_id)
        for data in access_data:
            request.session[data[1]] = list(data[0])
        temp_access_data = {}
        for data in access_data:
            temp_access_data[data[1]] = list(data[0])
        tempt_dict['access_datas'] = temp_access_data
        tempt_dict[settings.STATUS_KEY] = settings.SUCCESS_STATUS
        return HttpResponse(json.dumps(tempt_dict))
    except Exception as e:
        return HttpResponse(json.dumps(tempt_dict))