"""hcms_ta_assessment_reports URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from .views import HCMSTalentAssessmentReportView
from . import views

urlpatterns = [
    url(r'^ta_reports/', HCMSTalentAssessmentReportView.as_view(), name='ta_report'),  #Added- JAN -07Feb2018
    url(r'^report_filter_type_fetch/', views.report_filter_type_fetch, name='report_filter_type_fetch'),  #Added- SND -14Feb2018
    url(r'^report_filter_employee_type/', views.report_filter_employee_type, name='report_filter_employee_type'),  #Added- SND -16Feb2018
    url(r'^report_role_search/', views.report_role_search, name='report_role_search'),  #Added- SND -20Feb2018
    url(r'^report_schedule_datatable/', views.report_schedule_datatable, name='report_schedule_datatable'),  #Added- SND -21Feb2018
    url(r'^report_template_datatable/', views.report_template_datatable, name='report_template_datatable'),  #Added- SND -21Feb2018
    url(r'^report_assessment_forms_datatable/', views.report_assessment_forms_datatable, name='report_assessment_forms_datatable'),  #Added- SND -21Feb2018
]