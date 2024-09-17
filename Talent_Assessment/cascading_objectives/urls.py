"""hcms_ta_cascading_objective URL Configuration

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
from .views import HCMStaObjectiveView,HCMStaCascadeObjectiveView
from . import views

urlpatterns = [
    url(r'^ta_objective/$', HCMStaObjectiveView.as_view(), name='ta_objective'),  #Added- Bavya-07Feb2018
    url(r'^linked_obj_create/$', views.linked_obj_create, name='linked_obj_create'),  #Added- Bavya-08Feb2018
    url(r'^linked_obj_update/$', views.linked_obj_update, name='linked_obj_update'),  #Added- Bavya-09Feb2018
    url(r'^strategic_obj_data/$', views.strategic_obj_data, name='linked_obj_update'),  #Added- Bavya-09Feb2018
    url(r'^linked_obj_update_id/$', views.linked_obj_update_id, name='linked_obj_update'),  #Added- Bavya-09Feb2018
    url(r'^linked_obj_delete/$', views.linked_obj_delete, name='linked_obj_delete'),  #Added- Bavya-12Feb2018
    url(r'^drop_down_value/$', views.drop_down_value, name='drop_down_value'),  #Added- Bavya-12Feb2018
    
    url(r'^str_obj_create/$', views.str_obj_create, name='strategic_obj_create'),  #Added- Bavya-09Feb2018
    url(r'^obj_row_click/$', views.obj_row_click, name='str_obj_rowclick'),  #Added- Bavya-10Feb2018
    url(r'^str_obj_update/$', views.str_obj_update, name='str_obj_update'),  #Added- Bavya-10Feb2018
    url(r'^objective_delete/$', views.objective_delete, name='str_obj_delete'),  #Added- Bavya-12Feb2018
    url(r'^remove_kpi_data/$', views.remove_kpi_data, name='remove_kpi_data'),  #Added- Bavya-12Feb2018
    
    url(r'^ta_cascading_objectives/$', HCMStaCascadeObjectiveView.as_view(), name='ta_cascading_objective'),  #Added- Bavya-14Feb2018
    url(r'^cascade_objective_select/$', views.cascade_objective_select, name='ta_cascading_view'),  #Added- Bavya-14Feb2018
    url(r'^ta_cascading/$', views.ta_cascading, name='ta_cascading'),  #Added- Bavya-14Feb2018
    url(r'^org_unit_role/$', views.org_unit_role, name='org_unit_role'),  #Added- Bavya-16Feb2018
    url(r'^role_data_list/$',views.role_data_list, name='role_data_list'), #Added- Bavya-06Mar2018
    url(r'^role_data_list_remove/$',views.role_data_list_remove, name='role_data_list_remove'), #Added- Bavya-06Mar2018
    url(r'^role_comparition/$',views.role_comparition, name='role_comparition'), #Added- Bavya-07Mar2018
    
    url(r'^assessment_obj_create/$',views.assessment_obj_create, name='assessment_obj_create'), #Added- Esakkiprem-13Mar2018
    url(r'^load_date/$',views.load_date, name='load_date'), #Added- Bavya-27Mar2018
]