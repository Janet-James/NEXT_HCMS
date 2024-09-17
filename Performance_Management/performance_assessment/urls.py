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
from . import balanced_scorecard
from balanced_scorecard import *
from .cascading_objectives import *
from .assessment_schedule import *
from performance_reviewer import *
from .performance_assessment import *
from .performance_dashboard import *
from .mynext_dashboard import *

urlpatterns = [
    url(r'^performance_assessment/$',HCMSPerformanceFormView.as_view(),name='performance_assessment'),
    url(r'^performance_assessment_schedule/$',HCMSPerformanceAssessmentScheduleView.as_view(),name='schedule'),
    url(r'^balanced_scorecard/$',HCMSBalancedScorecardView.as_view(),name='balanced_scorecard'),
    url(r'^performance_dashboard/$',HCMSPerformanceDashboard.as_view(),name='performance_dashboard'),
#     url(r'^mynext_dashboard/$',HCMSMyNEXTDashboard.as_view(),name='mynext_dashboard'),
#     url(r'^mynext_teamlead_dashboard/$',HCMSTeamLeadDashboard.as_view(),name='mynext_teamlead_dashboard'),
    url(r'^mynext_employee_dashboard/$',HCMSTEmployeeDashboard.as_view(),name='mynext_employee_dashboard'),
    url(r'^mynext_employee_teamlead_dashboard/$',HCMSTEmployeeTeamleadDashboard.as_view(),name='mynext_employee_teamlead_dashboard'),
#                        Performance assessment url
    url(r'^org_unit_employee/$',org_unit_employee,name='org_unit_employee'),
    url(r'^employee_role/$',employee_role,name='employee_role'),
    url(r'^assessment_form_save/$',assessment_form_save,name='assessment_form_save'),
    url(r'^assessment_form_view/$',assessment_form_view,name='assessment_form_view'),
    url(r'^assessment_form_fetch/$',assessment_form_fetch,name='assessment_form_fetch'),
    url(r'^assessment_form_delete/$',assessment_form_delete,name='assessment_form_delete'),
    url(r'^cascading_objectives/$',HCMSCascadingObjectiveFormView.as_view(),name='cascading_objectives'),
#     url(r'^cascading_objective_view/$',cascading_objectives_view,name='cascading_objectives_view'),
    url(r'^cascading_objective_view_quarter/$',cascading_objectives_view_quarter,name='cascading_objectives_view_quarter'),
    url(r'^cascading_orgunit_fetch/$',cascading_orgunit_fetch,name='cascading_orgunit_fetch'),
    url(r'^cascading_division_fetch/$',cascading_division_fetch,name='cascading_division_fetch'),
    url(r'^cascading_objective_view_quarter/$',cascading_objectives_view_quarter,name='cascading_objectives_view_quarter'),
    url(r'^role_kpi_fetch/$',role_kpi_fetch,name='role_kpi_fetch'),
    url(r'^selected_role_kpi/$',selected_role_kpi,name='selected_role_kpi'),
#                         Balance scorecad url
    url(r'^org_unit_division/$',org_unit_division,name='org_unit_division'),
    url(r'^filter_perspective_details/$',filter_perspective_details,name='filter_perspective_details'),
    url(r'^perspective_data/$',perspective_data,name='perspective_data'),
    url(r'^bsc_form_save/$',bsc_form_save,name='bsc_form_save'),
    url(r'^selected_objective/$',selected_objective,name='bsc_form_save'),
    url(r'^objective_form_delete/$',objective_form_delete,name='objective_form_delete'),
#                         Performance Assessment Schedule Url
    url(r'^pa_schedule_fetch/$',PAScheduleListFetch,name='pa_schedule_fetch'),   
    url(r'^pa_schedule_remove/',PAScheduleDetailRemove, name='pa_schedule_remove'),
    url(r'^pa_schedule_detail_fetch/',PAScheduleDetailFetch, name='pa_schedule_detail_fetch'), 
    url(r'^pa_schedule_detail_fetch_by_id/',PAScheduleDetailFetchById, name='pa_schedule_detail_fetch_by_id'), 
    url(r'^pa_schedule_addupdate/',PAAddUpdateAssessmentSchedule, name='pa_schedule_addupdate'), 
    url(r'^assessment_schedule_employee_org_unit/$',EmployeeOrgListFetch,name='assessment_schedule_employee_org_unit'),
    url(r'^assessment_schedule_employee_team/$',EmployeeDeptListFetch,name='assessment_schedule_employee_team'),
    url(r'^assessment_schedule_employee/$',EmployeeListFetch,name='assessment_schedule_employee'),
    url(r'^pa_schedule_employeeExistCheck/$',PAEmployeeExistCheck,name="pa_schedule_employeeExistCheck" ),
#                           performance reviewer
    url(r'^reviewer_assessor_fetch/',assessor_type_view,name="assessor_type_fetch" ),
    url(r'^assessment_form_detail/$', assessment_form_detail_fetch, name='assessment_form_detail_fetch'),
    url(r'^employee_reviewer_fetch/$', reviewer_employee_search, name='employee_reviewer_fetch'),
    url(r'^assessment_reviewer_access_insert/$', assessment_reviewer_access_insert, name='assessment_reviewer_access_insert'),
#                          Performance assessment view file url
    url(r'^performance_assessment_view/$',HCMSPerformanceassessment.as_view(),name="performance_assessment_view" ),
    url(r'^organization_unit/$',organization_unit,name="organization_unit" ),
    url(r'^organization_unit_view/$',organization_unit_view,name="organization_unit_view" ),
    url(r'^organization_division_view/$',organization_division_view,name="organization_division_view" ),
    url(r'^performance_assessment_table/$',performance_assessment_table,name="performance_assessment_table" ),
    url(r'^performance_kpi_kr_data/$',performance_kpi_kr_data,name="performance_kpi_kr_data" ),
    url(r'^assessment_rating_save/$',assessment_rating_save,name="assessment_rating_save" ),
    url(r'^assessment_rating_update/$',assessment_rating_update,name="assessment_rating_update" ),
    url(r'^pm_ass_employee_details/$',pm_ass_employee_details,name="pm_ass_employee_details" ),
    url(r'^pm_ass_employee_rating/$',pm_ass_employee_rating,name="pm_ass_employee_rating" ),
    url(r'^objectives_perspective/$',objectives_perspective,name="objectives_perspective" ),
    url(r'^objectives_perspective_click/$',objectives_perspective_click,name="objectives_perspective_click" ),
    
#                          Performance Assessment Dashboard

    url(r'^performance_rating_data/$',performance_rating_data,name="performance_rating_data" ),
#                          PerformanceDashboard  URL
    url(r'^pm_dashboard_employee_org/$',pm_dashboard_employee_org,name="pm_dashboard_employee_org" ),
    url(r'^pm_dashboard_organization_perspective/$',pm_dashboard_organization_perspective,name="pm_dashboard_organization_perspective" ),
#     url(r'^performance_organization_data/$',performance_organization_data,name="performance_organization_data" ),
    url(r'^performance_division_data/$',performance_division_data,name="performance_division_data" ),
    url(r'^pmd_organization_unit/$',pmd_organization_unit,name="pmd_organization_unit" ),
    url(r'^pmd_division_view/$',pmd_division_view,name="pmd_division_view" ),
    url(r'^pmd_division_change/$',pmd_division_change,name="pmd_division_change" ),
    url(r'^performance_rating_data_division/$',performance_rating_data_division,name="performance_rating_data_division" ),
    
#     url(r'^mynext_dashboard/$',HCMSMyNEXTDashboard.as_view(),name='mynext_dashboard'),
#                             User Dashboard
    url(r'^user_task_details/$',user_task_details,name='user_task_details'),
    url(r'^user_task_summary_details/$',user_task_summary_details,name='user_task_summary_details'),
    url(r'^timer_data_update/$',timer_data_update,name='timer_data_update'),
    url(r'^task_summary_insert/$',task_summary_insert,name='task_summary_insert'),
    url(r'^survey_guideline_data/$',survey_guideline_data,name='survey_guideline_data'),
    url(r'^survey_add_update/$',survey_add_update,name='survey_add_update'),
    url(r'^news_data_api/$',news_data_api,name='news_data_api'),
    url(r'^process_matrix_project/$',process_matrix_project,name='process_matrix_project'),
    url(r'^process_matrix_task/$',process_matrix_task,name='process_matrix_task'),
    url(r'^process_matrix_attendance/$',process_matrix_attendance,name='process_matrix_attendance'),
    url(r'^dev_talk_process/$',dev_talk_process,name='dev_talk_process'),
    url(r'^task_stage_update/$',task_stage_update,name='task_stage_updatess'),
    
#                          teamlead dashboard
     url(r'^team_lead_dashboard/$',team_lead_dashboard,name="team_lead_dashboard" ),
     url(r'^project_track/$',project_track,name="project_track" ),
     url(r'^today_scheduled_meeting/$',today_meeting_schedule,name="today_scheduled_meeting" ),
     url(r'^team_lead_dashboard_plans/$',team_lead_dashboard_plans,name="team_lead_dashboard_plans" ),
     url(r'^team_lead_dashboard_goals/$',team_lead_dashboard_goals,name="team_lead_dashboard_goals" ),
     url(r'^team_lead_dashboard_mem_plans/$',team_lead_dashboard_mem_plans,name="team_lead_dashboard_mem_plans" ),
     url(r'^team_member_plans/$',team_member_plans,name="team_member_plans" ),
     url(r'^mail_list/$',mail_list,name="mail_list" ),
     url(r'^birthday_wish/$',birthday_wish,name="birthday_wish" ),
     url(r'^total_count/$',total_count,name="total_count" ),
]