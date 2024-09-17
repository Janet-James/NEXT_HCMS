from django.conf.urls import url, include
from django.views.generic import TemplateView
from .ces_api import *
# from .mynext_dashboard import *

urlpatterns = [
    url(r'^ces/servicecalls/(?P<user_id>\d+)/$', service_call_details, name='user_service_call'),
    url(r'^ces/servicecalls/(?P<user_id>\d+)/baseinfo/(?P<service_type>[1-3])/$', service_base_details, name='service default details'),
    url(r'^ces/servicecalls/(?P<user_id>\d+)/communicationthread/$', ce_communication_thread_details, name='communicationthread'),
    url(r'^ces/servicecalls/push/$', ce_call_submit, name='service call submit'),
    url(r'^ces/servicecalls/(?P<user_id>\d+)/search/$', search, name='search'),
    url(r'^ces/servicecalls/communicationresponse/push/$', communication_response_submit, name='communication response submit'),
    url(r'^ces/servicegroupcalls/(?P<user_id>\d+)/$', service_group_details, name='service_group_details'),
  
]

