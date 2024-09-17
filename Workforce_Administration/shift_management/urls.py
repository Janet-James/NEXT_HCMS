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
from .shift_master import *
from .shift_roster import *

urlpatterns = [
#     url(r'^shift_master/$',HCMSShiftMasterView.as_view(),name='shift_master'),
#     url(r'^shift_group_master/$',HCMSShiftGroupMasterView.as_view(),name='shift_group_master'),
    url(r'^shift_detail/$',HCMSShiftDetailView.as_view(),name='shift_detail'),
    url(r'^employee_mapping_save/$',employeeMappingInsert,name='employee_mapping_save'),
    url(r'^employeeMappingUpdate/$',employeeMappingUpdate,name='employee_mapping_save'),
    url(r'^employeeMappingView/$',employeeMappingView,name='employeeMappingView'),
    url(r'^employeeMappingDelete/$',employeeMappingDelete,name='employeeMappingDelete'),
    url(r'^employeeMappingRoleView/$',employeeMappingRoleView,name='employeeMappingRoleView'),
    url(r'^employeeMappingEmployeeExist/$',employeeMappingEmployeeExist,name='employeeMappingEmployeeExist'),
    url(r'^employeeMappingDivisionFetch/$',employeeMappingDivisionFetch,name='employeeMappingDivisionFetch'),
    url(r'^shift/shift_master_save/$',shif_master_save,name='shift_master_save'),
    url(r'^shift/shift_details/$',shif_master_show,name='shift_details'),
    url(r'^shift/fetch_shift_details/$',fetch_shift_details,name='fetch_shift_details'),
    url(r'^shift/shift_master_remove/$',shift_master_remove,name='shift_master_remove'),
    url(r'^shift/org_unit_fetch/$',org_unit_fetch,name='org_unit_fetch'),
    url(r'^shift/shift_fetch/$',shift_fetch,name='shift_fetch'),    
    url(r'^shift_roster/add_update_roster_detail/$',shift_roster_add_update,name='shift_roster_add_update'),
    url(r'^shift_roster/shift_roster_detail/$',shift_roster_detail,name='shift_roster_detail'),
    url(r'^shift_roster/shift_roster_detail_fetch/$',shift_roster_detail_fetch,name='shift_roster_detail_fetch'),
    url(r'^shift_roster/shift_roster_remove/$',shift_roster_remove,name='shift_roster_remove'),
    
    url(r'^shift/division_fetch/$',division_dropdown,name='division_dropdown'),
    url(r'^shift/exsist_data_insert/$',exsist_data_insert,name='exsist_data_insert')

]