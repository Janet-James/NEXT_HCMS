from django.conf.urls import url, include
from django.views.generic import TemplateView
from .hcms_common import *
# from .mynext_dashboard import *

urlpatterns = [
    url(r'^hcm_org/$', hcm_organization_fetch, name='hcm_organization_fetch'),
    url(r'^hcm_org_unit/(?P<org_id>\d+)/$', hcm_organization_unit_fetch, name='hcm_organization_unit_fetch'),
    url(r'^hcm_division/(?P<org_unit_id>\d+)/$', hcm_organization_division_fetch, name='hcm_organization_division_fetch'),
]

