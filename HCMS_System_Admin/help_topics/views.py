# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import json
import os
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.http.response import HttpResponse
import HCMS.settings as status_keys
from django.template import loader
import logging
import logging.handlers
logger_obj = logging.getLogger('logit')

# from UAM.uam_session_sync import uam_sessions_sync
# from UAM.uam_func_data_sync import uam_func_sync
# from tracking.models import Visitor

class HelpContentDetailsView(TemplateView):
    ''' 
        15-Feb-2018 || ANT || To HCMS system admin help content details module loaded
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
    '''
    
    template_name = "help_topics/help_content_info.html"
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HelpContentDetailsView, self).dispatch(request, *args, **kwargs)
    
    def get(self, request, *args, **kwargs):
        context = super(HelpContentDetailsView, self).get_context_data(**kwargs)
        return self.render_to_response(context)
    
class HelpContentAppDetailsView(TemplateView):
    ''' 
        15-Feb-2018 || ANT || To HCMS system admin help content app details module loaded
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
    '''
    
    template_name = "help_topics/help_content_app_info.html"
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HelpContentAppDetailsView, self).dispatch(request, *args, **kwargs)
    
    def get(self, request, *args, **kwargs):
        context = super(HelpContentAppDetailsView, self).get_context_data(**kwargs)
        return self.render_to_response(context)
    
class HelpContentAppSysAdminDetailsView(TemplateView):
    ''' 
        15-Feb-2018 || ANT || To HCMS system admin help content app full details module loaded
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
    '''
    def get_template_names(self):
        module_name = self.kwargs['module_name']
        if module_name == "SysAdmin":
            template_name = "help_topics/SysAdmin/sysadmin_content_info.html"
        elif module_name == "HRMS":
            template_name = "help_topics/HRMS/hrms_content_info.html"
        elif module_name == "TalentDefinition":
			template_name = "help_topics/TalentDefinition/td_content_info.html"
        elif module_name == "TalentAssessment":
			template_name = "help_topics/TalentAssessment/ta_content_info.html"
        elif module_name == "WorkforcePlanning":
			template_name = "help_topics/WorkforcePlanning/wp_content_info.html"
        return [template_name]

    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HelpContentAppSysAdminDetailsView, self).dispatch(request, *args, **kwargs)
    
    def get(self, request, *args, **kwargs):
        context = super(HelpContentAppSysAdminDetailsView, self).get_context_data(**kwargs)
        return self.render_to_response(context)

def sub_module_data(request, **kwargs):
    ''' 
        02-Mar-2018 || ANT || To HCMS system admin help content sub module data fetch
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    if request.method == "GET":
        if kwargs['sub_module_name'] == "AppAdmin" or kwargs['sub_module_name'] == "HRMS":
            template_name = 'help_topics/' + kwargs['module_name'] + '/Introduction.html'
        else:
            template_name = 'help_topics/' + kwargs['module_name'] + '/' + kwargs['sub_module_name'] + '.html'
        json_data['posts'] = loader.render_to_string(template_name)
        json_data['status'] = "NTE_01"
    else:
        logger_obj.info("Data management data inserted api method not support " + str(request.user.username))
        json_data["status"] = status_keys.ERR0405
    return HttpResponse(json.dumps(json_data))