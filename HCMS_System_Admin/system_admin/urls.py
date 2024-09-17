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
from django.conf.urls import url, include
from .views import RoleDetailsView, role_record, role_datainsert, GroupDetailsView, grp_record, grp_datainsert, RefItemCatView, \
                 refitemcat_record, refitemcat_datainsert, RefItemView, refitem_record, refitem_datainsert, RefItemLinkView, refitemlink_record, refitemlink_list, \
                 refitemlink_datainsert, PermissionDetailsView, permission_htmllist, permission_record, permission_datainsert, UserDetailsView, usr_record, role_details_fetch, usr_datainsert, usr_cp_management,\
                 UserAccessDetailsView, org_unit_fetch, usr_access_record, usr_access_datainsert, DataUploadDetailsView, data_mgt_classname, data_mgt_fieldsname, \
                 data_mgt_insert, SysAdminView, file_download, SystemParamView, sysparam_record, sysparam_data, sysparam_datainsert, CountryStateView, country_record, country_datainsert,\
                 state_record, state_datainsert, roles_sel_reload, user_group_fetch, role_details_get, usr_data_syn, country_record_active

urlpatterns = [
    url(r'^sysadmin_page/$',SysAdminView.as_view(), name='sysadmin_page'),
    url(r'^file_download/$',file_download, name='file_download'),
    url(r'^role_details/$', RoleDetailsView.as_view(), name='role_details'),
    url(r'^role_record/$', role_record, name='role_record'),
    url(r'^role_datainsert/$', role_datainsert, name='role_datainsert'),
    url(r'^grp_details/$', GroupDetailsView.as_view(), name='grp_details'),
    url(r'^grp_record/$', grp_record, name='grp_record'),
    url(r'^grp_datainsert/$', grp_datainsert, name='grp_datainsert'),
    url(r'^refitemcat_details/$', RefItemCatView.as_view(), name='refitemcat_details'),
    url(r'^refitemcat_record/$', refitemcat_record, name='refitemcat_record'),
    url(r'^refitemcat_datainsert/$', refitemcat_datainsert, name='refitemcat_datainsert'),
    url(r'^refitem_details/$', RefItemView.as_view(), name='refitem_details'),
    url(r'^refitem_record/$', refitem_record, name='refitem_record'),
    url(r'^refitem_datainsert/$', refitem_datainsert, name='refitem_datainsert'),
    url(r'^refitemlink_details/$', RefItemLinkView.as_view(), name='refitemlink_details'),
    url(r'^refitemlink_record/$', refitemlink_record, name='refitemlink_record'),
    url(r'^refitemlink_list/$', refitemlink_list, name='refitemlink_list'),
    url(r'^refitemlink_datainsert/$', refitemlink_datainsert, name='refitemlink_datainsert'),
    url(r'^permission_details/$', PermissionDetailsView.as_view(), name='permission_details'),
    url(r'^permission_htmllist/$', permission_htmllist, name='permission_htmllist'),
    url(r'^permission_record/$', permission_record, name='permission_record'),
    url(r'^permission_datainsert/$', permission_datainsert, name='permission_datainsert'),
    url(r'^usr_details/$', UserDetailsView.as_view(), name='usr_details'),
    url(r'^usr_record/$', usr_record, name='usr_record'),
    url(r'^role_details_fetch/$', role_details_fetch, name='role_details_fetch'),
    url(r'^usr_datainsert/$', usr_datainsert, name='usr_datainsert'),
    url(r'^usr_cp_management/$', usr_cp_management, name='usr_cp_management'),
    url(r'^usr_access_details/$', UserAccessDetailsView.as_view(), name='usr_access_details'),
    url(r'^org_unit_fetch/$', org_unit_fetch, name='org_unit_fetch'),
    url(r'^usr_access_record/$', usr_access_record, name='usr_access_record'),
    url(r'^usr_access_datainsert/$', usr_access_datainsert, name='usr_access_datainsert'),
    url(r'^data_mgt_details/$', DataUploadDetailsView.as_view(), name='data_mgt_details'),
    url(r'^data_mgt_classname/$', data_mgt_classname, name='data_mgt_classname'),
    url(r'^data_mgt_fieldsname/$', data_mgt_fieldsname, name='data_mgt_fieldsname'),
    url(r'^data_mgt_insert/$', data_mgt_insert, name='data_mgt_insert'),
    url(r'^sysparam_details/$', SystemParamView.as_view(), name='sysparam_details'),
    url(r'^sysparam_record/$', sysparam_record, name='sysparam_record'),
    url(r'^sysparam_data/$', sysparam_data, name='sysparam_data'),
    url(r'^sysparam_datainsert/$', sysparam_datainsert, name='sysparam_datainsert'),
    url(r'^country_state/$', CountryStateView.as_view(), name="country_state"),
    url(r'^country_record/$', country_record, name="country_record"),
    url(r'^country_datainsert/$', country_datainsert, name='country_datainsert'),
    url(r'^state_record/$', state_record, name="state_record"),
    url(r'^state_datainsert/$', state_datainsert, name='state_datainsert'),
    url(r'^roles_sel_reload/$', roles_sel_reload, name='roles_sel_reload'),
    url(r'^user_group_fetch/$', user_group_fetch, name='user_group_fetch'),
    url(r'^role_details_get/$', role_details_get, name='role_details_get'),
    url(r'^usr_data_syn/$', usr_data_syn, name='usr_data_syn'),
    url(r'^country_record_active/$', country_record_active, name="country_record_active"),
]