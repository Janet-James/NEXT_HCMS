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
from .self_request_process import *
from .cost_budget import *
from .training_recommendation import *
from . import views

from .training_creation import *
from .internship import *
from .training_results import *
urlpatterns = [
#                            <-- Employee Self Request URL Start -->
    url(r'^self_process_training/$',HCMSEmployeeSelfProcessTrainingFormView.as_view(),name="self_process_training" ),
    url(r'^self_request_training/$',HCMSEmployeeSelfRequestTrainingFormView.as_view(),name="self_request_training" ),
    url(r'^request_training_exist_change/$',request_training_exist_change,name="request_training_exist_change" ),
    url(r'^fetch_request_training_details/$',fetch_request_training_details,name="fetch_request_training_details" ),
    url(r'^fetch_request_training_details_id/$',fetch_request_training_details_id,name="fetch_request_training_details_id" ),
    url(r'^request_training_add_update/$',request_training_add_update,name="request_training_add_update" ),
    url(r'^request_training_delete/$',request_training_delete,name="request_training_delete" ),
    url(r'^fetch_request_training_count_detail/$',fetch_request_training_count_detail,name="fetch_request_training_count_detail" ),
    url(r'^ld_organization_change/$',organization_change,name="ld_organization_change" ),
    url(r'^ld_organization_unit_change/$',organization_unit_change,name="ld_organization_unit_change" ),
    url(r'^ld_division_change/$',division_change,name="ld_division_change" ),
#                            <-- Employee Self Request URL End -->

#                Budget & Cost
                   
#                    Page render url
    url(r'^cost_request/$',HCMSLearningmanagement.as_view(),name="cost_request" ),
    url(r'^training_form/$',HCMSTraining_creation.as_view(),name="training_form" ),
    url(r'^training/$',HCMSTraining_creation.as_view(),name="training" ),
    url(r'^internship/$',HCMSInternship.as_view(),name="internship" ),
    url(r'^ld_training_results/$',HCMSTrainingResults.as_view(),name="ld_training_results" ),
    url(r'^training_dashboard/$',HCMSLearning_development_dashboard.as_view(),name="training_dashboard" ),
#                Budget & Cost
    url(r'^evaluate_cost/$',LDCostevaluate.as_view(),name="evaluate_cost" ),
    url(r'^ldorganization_unit/$',ldorganization_unit,name="ldorganization_unit" ),
    url(r'^ldorganization_unit_view/$',ldorganization_unit_view,name="ldorganization_unit_view" ),
    url(r'^ldorganization_division_view/$',ldorganization_division_view,name="ldorganization_division_view" ),
    url(r'^cost_request_save/$',cost_request_save,name="cost_request_save" ),
    url(r'^ld_cost_request_data_table/$',ld_cost_request_data_table,name="ld_cost_request_data_table" ),
    url(r'^ldtraining_view/$',ldtraining_view,name="ldtraining_view" ),
    url(r'^ld_budget_table_click/$',ld_budget_table_click,name="ld_budget_table_click" ),
    url(r'^cost_request_update/$',cost_request_update,name="cost_request_update" ),
    url(r'^cost_evaluate_process_details/$',cost_evaluate_process_details,name="cost_evaluate_process_details" ),
    url(r'^ld_cost_process_event_details/$',ld_cost_process_event_details,name="ld_cost_process_event_details" ),
    url(r'^ld_status_update/$',ld_status_update,name="ld_status_update" ),
    url(r'^ld_request_list/$',ld_request_list,name="ld_request_list" ),
    url(r'^cost_request_remove/$',cost_request_remove,name="cost_request_remove" ),
    url(r'^ld_data_load/$',ld_data_load,name="ld_data_load"),
#                               Training Module   by ESA
    url(r'^training_form_save/$',training_creation_form_save,name="training_form_save" ),
    url(r'^training_details_view/$',training_details_view,name="training_details_view" ),
    url(r'^training_form_delete/$',training_form_delete,name="training_form_delete" ),  
    url(r'^selected_training_details/$',selected_training_details,name="selected_training_details" ),  
    url(r'^training_file_delete/$',training_file_delete,name="training_file_delete" ),
    url(r'^training_creation/$',HCMSTraining_creation.as_view(),name="training_creation" ),
    url(r'^internship/$',HCMSInternship.as_view(),name="internship" ),  
#     url(r'^org_unit_division_employee/$',org_unit_division_employee,name="org_unit_division_employee" ),  
    url(r'^division_training_view/$',division_training_view,name="division_training_view" ),  
    url(r'^internship_details_view/$',internship_details_view,name="internship_details_view" ),
    url(r'^internship_form_save/$',internship_form_save,name="internship_form_save" ),   
    url(r'^internship_form_delete/$',internship_form_delete,name="internship_form_delete" ),  
    #Training Recommendation URL's - JAN
    url(r'^ld_general_training_recommendation/$',HCMSGeneralTrainingRecommendation.as_view(),name="general_training_recommendation" ),
    url(r'^ld_management_training_recommendation/$',HCMSManagementTrainingRecommendation.as_view(),name="management_training_recommendation" ),
    url(r'^ld_tl_training_recommendation/$',HCMSTLTrainingRecommendation.as_view(),name="tl_training_recommendation" ),
    url(r'^ld_division_data_fetch/$', ld_division_data_fetch, name='ld_division_data_fetch'),
    url(r'^ld_employee_training_data_fetch/$', ld_employee_training_data_fetch, name='ld_employee_training_data_fetch'),
    url(r'^ld_training_detail_fetch/$', ld_training_detail_fetch, name='ld_training_detail_fetch'),
    url(r'^ld_recommendation_add_update/$', ld_recommendation_add_update, name='ld_recommendation_add_update'),
    url(r'^ld_training_recommendation_detail_fetch/$', ld_training_recommendation_detail_fetch, name='ld_training_recommendation_detail_fetch'),
    url(r'^ld_training_recommendation_retrieval/$', ld_training_recommendation_retrieval, name='ld_training_recommendation_retrieval'),
    url(r'^ld_training_recommendation_remove/$', ld_training_recommendation_remove, name='ld_training_recommendation_remove'),
    url(r'^ld_assessment_training_retrieval/$', ld_assessment_training_retrieval, name='ld_assessment_training_retrieval'), 
    url(r'^ld_assessment_training_detail_retrieval_id/$', ld_assessment_training_detail_retrieval_id, name='ld_assessment_training_detail_retrieval_id'), 
    url(r'^tl_recommendation_add_update/$', tl_recommendation_add_update, name='tl_recommendation_add_update'),   
    url(r'^tl_recommendation_training_creation/$', tl_recommendation_training_creation, name='tl_recommendation_training_creation'),      
#                                              dashboard ESA 26-09-2018
    url(r'^training_dashboard_view/$',training_dashboard_view,name="training_dashboard_view" ),  
    url(r'^current_user_details/$',current_user_details,name="current_user_details" ),  
]