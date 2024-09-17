# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from CommonLib.hcms_common import menu_access_control
from django.contrib.auth.decorators import login_required

# Create your views here.

def performance_criteria(request):
    template_name = 'performance_criteria.html'
    if request.user.id:
        return render(request, template_name, {}) 
    else:
        return render(request, 'login.html',{}) 
    
# Create your views here.
class PerformanceAssessmentMonthlyView(TemplateView):
#     template_name = 'performance_assessment_monthly.html'
#     def get(self, request,*args,**kwargs):
#         context = super(PerformanceAssessmentMonthlyView, self).get_context_data(**kwargs)
#         return self.render_to_response(context)
#     
#     
#     
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(PerformanceAssessmentMonthlyView, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        template_name = "performance_assessment_monthly.html"
        return [template_name]
    
    def get(self, request, *args, **kwargs):
        context = super(PerformanceAssessmentMonthlyView, self).get_context_data(**kwargs)
        return self.render_to_response(context)
    
