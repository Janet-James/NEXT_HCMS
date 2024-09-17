"""hcms_dashboard URL Configuration

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
from django.conf.urls import url, include
from django.views.generic import TemplateView
from .views import HCMSTimeAndAttendanceView
from .early_policy import *
from .leave_for_absent import *
from .permission_request import *
from .attendance_report import *

urlpatterns = [
    #01-JUN-2018 || ESA || Base URL for Attendance
    url(r'^attendance/$',HCMSTimeAndAttendanceView.as_view(),name='employee_attendance'),
    url(r'^shift_dropdown/$',shift_dropdown,name='shift_dropdown'),
    url(r'^late_policy_save/$',late_policy_save,name='late_policy_save'),
    url(r'^early_policy_details/$',early_policy_details,name='early_policy_details'),
    url(r'^fetch_late_policy_details/$',fetch_late_policy_details,name='fetch_late_policy_details'),
    url(r'^fetch_late_policy_details_shift_change/$',fetch_late_policy_details_shift_change,name='fetch_late_policy_details_shift_change'),
    url(r'^leave_for_absent_add_update/$',leave_for_absent_add_update,name='leave_for_absent_add_update'),
    url(r'^leave_for_absent_detail/$',leave_for_absent_detail,name='leave_for_absent_detail'),
    url(r'^leave_for_absent_detail_fetch/$',leave_for_absent_detail_fetch,name='leave_for_absent_detail_fetch'),
    url(r'^early_policy_details_check/$',early_policy_details_check,name='early_policy_details_check'),
    url(r'^permission_request_details_check/$',permission_request_details_check,name='permission_request_details_check'),
    url(r'^lfa_detail_remove/$',leave_for_absent_detail_remove,name='leave_for_absent_detail_remove'),
    url(r'^late_policy_remove/$',late_policy_remove,name='late_policy_remove'),
    url(r'^permission_request_add/$',permission_request_add,name='permission_request_add'),
    url(r'^permission_request_view/$',permission_request_view,name='permission_request_view'),
    url(r'^permission_request_update/$',permission_request_update,name='permission_request_update'),
    url(r'^permission_request_delete/$',permission_request_delete,name='permission_request_delete'),
    url(r'^shift_change_details/$',shift_change_details,name='shift_change_details'),
    
    url(r'^attendance_report/$',HCMSAttendanceReportView.as_view(),name='attendance_report'),
    url(r'^org_unit_employee_fetch/$',org_unit_employee_fetch,name='org_unit_employee_fetch'),
    url(r'^search_attendance_report/$',search_attendance_report,name='search_attendance_report'),
]