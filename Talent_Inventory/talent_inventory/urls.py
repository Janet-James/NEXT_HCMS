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
from .views import TIRoleDefinition, TIReports, HCMSTalentInventoryReportingStructureView, \
                    ti_role_details_fetch, ti_role_def_create, ti_skill_set_comp, \
                    ti_kpi_headers_fetch,ti_role_details_view, ti_report_role_details, \
                    ti_reports_to_update, ti_role_def_delete, TDDashboardView, \
                    ti_role_details_reports, ti_compt_details_reports, ti_dashboard_charts, \
                    ti_role_type_fetch, ti_role_title_check, ti_reports_map, ti_org_unit, ti_dept

urlpatterns = [
    #08-Feb-2018 || SMI || Added the base URL for Role definition
    url(r'^ti_role_def/$', TIRoleDefinition.as_view(), name='ti_role_def'), 
    #12-Feb-2018 || MST || Added the base URL for Reports
    url(r'^ti_reports/$', TIReports.as_view(), name='ti_reports'),
    #12-Feb-2018 || MST || Added the base URL for Reporting Structure
    url(r'^ti_reporting_structure/$', HCMSTalentInventoryReportingStructureView.as_view(), name='reporting_structure_page'),
    #15-Feb-2018 || MST || Added URL for Role Details Fetch
    url(r'^ti_role_details_fetch/$', ti_role_details_fetch, name='ti_role_details_fetch'),
    #10-Feb-2018 || SMI || Added URL for Role Definition Insert
    url(r'^ti_role_def_create/$', ti_role_def_create, name='ti_role_def_create'), 
    #10-Feb-2018 || SMI || Added URL for Completency Summary listing on selecting competency
    url(r'^ti_skill_set_comp/$', ti_skill_set_comp, name='ti_skill_set_comp'), 
    #20-Feb-2018 || MST || Added URL for Listing Measure Frequency and Customer Rating Scheme in KPI
    url(r'^ti_kpi_headers_fetch/$', ti_kpi_headers_fetch, name='ti_kpi_headers_fetch'), 
    #15-Feb-2018 || MST || Added URL for View Role Details
    url(r'^ti_role_details_view/$', ti_role_details_view, name='ti_role_details_view'),
    #14-Feb-2018 || KAV || Added  URL for Listing Role Details in Reporting Structure 
    url(r'^ti_report_role_details/$', ti_report_role_details, name='ti_report_role_details'),
    #22-Feb-2018 || KAV || Added URL for listing Reports To Id 
    url(r'^ti_reports_to_update/$', ti_reports_to_update, name='ti_reports_to_update'),
    #23-Feb-2018 || SMI || Added URL for deleting role details
    url(r'^ti_role_def_delete/$', ti_role_def_delete, name='ti_role_def_delete'),
    #28-Feb-2018 || ANT || Added URL for dashboard
    url(r'^td_dashboard/$', TDDashboardView.as_view(), name='td_dashboard'),
    #28-Feb-2018 || KAV || Added URL for role details reports
    url(r'^ti_role_details_reports/$', ti_role_details_reports, name='ti_role_details_reports'),
    #1-Mar-2018 || KAV || Added URL for competencies details reports
    url(r'^ti_compt_details_reports/$', ti_compt_details_reports, name='ti_compt_details_reports'),
    #07-Mar-2018 || SMI || Added URL for dashboard charts data load
    url(r'^ti_dashboard_charts/$', ti_dashboard_charts, name='ti_dashboard_charts'),
    #09-Mar-2018 || MST || Added URL for Role Details Fetch
    url(r'^ti_role_type_fetch/$', ti_role_type_fetch, name='ti_role_type_fetch'),
    #13-Mar-2018 || MST || Added URL for Role Title check
    url(r'^ti_role_title_check/$', ti_role_title_check, name='ti_role_title_check'),
    #28-Mar-2018 || MST || Added URL for GIS Reports Map
    url(r'^ti_reports_map/$', ti_reports_map, name='ti_reports_map'),
    #28-Aug-2018 || MST || Added URL for Organization Unit List Fetch
    url(r'^ti_org_unit/$', ti_org_unit, name='ti_org_unit'),
    #06-Sep-2018 || MST || Added URL for Department List Fetch
    url(r'^ti_dept/$', ti_dept, name='ti_dept'),
]