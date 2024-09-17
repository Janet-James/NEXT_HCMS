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
from .views import *
# from .mynext_dashboard import *

urlpatterns = [
    url(r'^communication_ticket_details/$',communication_ticket_details,name='communication_ticket_details'),
    url(r'^hcms_role_view/$',hcms_role_access,name='hcms_role_view'),
    url(r'^access_control_save/$',access_control_save,name='access_control_save'),
    url(r'^access_control_view/$',access_control_view,name='access_control_view'),
    url(r'^sla_config_save/$',sla_config_save,name='sla_config_save'),
    url(r'^sla_config_view/$',sla_config_view,name='sla_config_view'),
    url(r'^service_call_view/$',service_call_view,name='service_call_view'),
    url(r'^service_call_count/$',service_call_count,name='ticket_count'), 
    url(r'^ce_type_based_query/$',ce_type_based_query,name="ce_type_based_query" ),
    url(r'^ce_service_call_submit/$',ce_service_call_submit,name="ce_service_call_submit" ),
    url(r'^ce_communication_thread_details_display/$',ce_communication_thread_details_display,name='ce_communication_thread_details_display'),
    url(r'^ce_communication_response_submit/$',ce_communication_response_submit,name='ce_communication_response_submit'),
#                            configuration tab url
    url(r'^def_cat_save/$',def_cat_save,name="def_cat_save" ),
    url(r'^def_cat_delete/$',def_cat_delete,name="def_cat_delete" ),
    url(r'^def_cat_view/$',def_cat_view,name="def_cat_view" ),
    url(r'^doc_viewer/$',doc_viewer,name="doc_viewer" ),
]
