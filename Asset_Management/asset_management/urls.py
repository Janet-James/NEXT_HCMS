"""HCMS_system_admin URL Configuration

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
from .views import AssetManagementHome, am_asset_list_fetch, gen_asset_id, asset_details_insert,am_asset_data_fetch,asset_details_remove,gen_expiry_date,am_get_org_unit_list, am_dept
urlpatterns = [
    url(r'^asset_list/$', AssetManagementHome.as_view(), name='asset_list'),
    #21-May-2018 || MST || Added URL for Asset List Fetch
    url(r'^am_asset_list_fetch/$', am_asset_list_fetch, name='am_asset_list_fetch'),
    #21-May-2018 || MST || Added URL for Asset List Fetch
    url(r'^gen_asset_id/$', gen_asset_id, name='gen_asset_id'),
    #22-May-2018 || MST || Added URL for Asset Details Insert
    url(r'^asset_details_insert/$', asset_details_insert, name='asset_details_insert'),
    #22-May-2018 || KAV || Added URL for Asset Data Fetch
    url(r'^am_asset_data_fetch/$', am_asset_data_fetch, name='am_asset_data_fetch'),
    #22-May-2018 || MST || Added URL for Asset Details Insert
    url(r'^asset_details_remove/$', asset_details_remove, name='asset_details_remove'),
    #13-Jun-2018 || MST || Added URL for Expiry Date Generation
    url(r'^gen_expiry_date/$', gen_expiry_date, name='gen_expiry_date'),
    #28-Jun-2018 || SMI || Added URL for getting Org Unit list
    url(r'^am_get_org_unit_list/$', am_get_org_unit_list, name='am_get_org_unit_list'),
    #15-Oct-2018 || MST || Added URL for getting Department/Division list
    url(r'^am_dept/$', am_dept, name='am_dept'),
]
