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
from .views import WFP_Strategy_Main, WFP_Structure_Main, WFP_System_Main, wf_report_role_details, stg_analysis_step1, stg_analysis_step1_table, wfp_struct_step2_details, \
                    wfp_struct_step3_details, wfp_struct_step4_details, wfp_struct_step5_details, fetch_role_details, fetch_strategy_select, step2_save_form, \
                    wfp_syst_step1_details,wfp_syst_step2_details,wfp_syst_step3_details,WFP_Resource_Request_Main,resreq_details_submit,resreq_details_fetch,\
                    resreq_details_fetch_id, resreq_details_remove, wfp_org_unit,resreq_get_org_unit_list, wfp_struct_step5_chart_click, wfp_struct_step5_role_sel,\
                    wfp_sys_step3_save_form, fetch_grade_details, fetch_selected_grade_details, wfp_bar_msel_roles_chng, wfp_bar_msel_grades_chng, stg_analysis_gap_table,\
                    wfp_stgy_step5_details, wfp_stgy_step5_chart_click, wfp_strgy_step5_role_sel, wfp_stgy_bar_msel_roles_chng, wfp_stgy_bar_msel_grades_chng,\
                    wfp_system_map_details,wfp_system_step5_piechart_details,wfp_system_step5_chart_click,wfp_system_step5_role_sel,wfp_sysstep5_fetch_multirole_details
urlpatterns = [
    #12-July-2018 || SMI || Added the base URL for Workforce Planning - Strategy Analysis
    url(r'^wfp_strategy_analysis/$', WFP_Strategy_Main.as_view(), name='wfp_strategy_analysis'),
    #12-July-2018 || SMI || Added the base URL for Workforce Planning - Structure Analysis
    url(r'^wfp_structure_analysis/$', WFP_Structure_Main.as_view(), name='wfp_structure_analysis'),
    #12-July-2018 || SMI || Added the base URL for Workforce Planning - System Analysis
    url(r'^wfp_system_analysis/$', WFP_System_Main.as_view(), name='wfp_system_analysis'),
    #18-July-2018 || KAV || Added the base URL for Workforce Planning - Resource Request
    url(r'^wfp_resource_request/$', WFP_Resource_Request_Main.as_view(), name='wfp_resource_request'),
    #30-July-2018 || SMI || Added  URL for Listing Role Details in Reporting Structure 
    url(r'^wf_report_role_details/$', wf_report_role_details, name='wf_report_role_details'),
    #05-July-2018 || MST || Step1 Strategy Analysis Insert URL
    url(r'^stg_analysis_step1/$', stg_analysis_step1, name='stg_analysis_step1'),
    #09-July-2018 || SMI || Added the URL for fetching resource counts
    url(r'^fetch_role_details/$', fetch_role_details, name='fetch_role_details'),
    #12-Jul-2018 || MST || Added URL for fetching strategy list for current workforce planning analysis
    url(r'^fetch_strategy_select/$', fetch_strategy_select, name='fetch_strategy_select'),
    #06-July-2018 || MST || Step1 Strategy Analysis Datatable
    url(r'^stg_analysis_step1_table/$', stg_analysis_step1_table, name='stg_analysis_step1_table'),
    #12-Jul-2018 || MST || Step2 Strategy Analysis Insert URL
    url(r'^step2_save_form/$', step2_save_form, name='step2_save_form'),
    #05-July-2018 || SMI || Added the URL for fetching resource counts
    url(r'^wfp_struct_step2_details/$', wfp_struct_step2_details, name='wfp_struct_step2_details'),
    #09-July-2018 || SMI || Added the URL for fetching resource counts based on roles and org. unit type
    url(r'^wfp_struct_step3_details/$', wfp_struct_step3_details, name='wfp_struct_step3_details'),
    #10-July-2018 || SMI || Added the URL for fetching resource costs based on roles and org. unit type
    url(r'^wfp_struct_step4_details/$', wfp_struct_step4_details, name='wfp_struct_step4_details'),
    #10-July-2018 || SMI || Added the URL for fetching data for Structure Analysis - Summarized Report
    url(r'^wfp_struct_step5_details/$', wfp_struct_step5_details, name='wfp_struct_step5_details'),
    #06-July-2018 || KAV || Added the URL to Fetch the Resource Request details
    url(r'^wfp_syst_step1_details/$', wfp_syst_step1_details, name='wfp_syst_step1_details'),
    #06-July-2018 || KAV || Added the URL to Fetch the Resource Request details
    url(r'^wfp_syst_step2_details/$', wfp_syst_step2_details, name='wfp_syst_step2_details'),
    #06-July-2018 || KAV || Added the URL to Sytem Analysis Step3 Details Fetch
    url(r'^wfp_syst_step3_details/$', wfp_syst_step3_details, name='wfp_syst_step3_details'),
    #31-July-2018 || SMI || Added the URL to Sytem Analysis Step4 Details Fetch
    url(r'^wfp_syst_step4_details/$', wfp_syst_step3_details, name='wfp_syst_step4_details'),
    #05-July-2018 || KAV || Added URL for Inserting Resource Request Details
    url(r'^resreq_details_submit/$', resreq_details_submit, name='resreq_details_submit'),
    #05-July-2018 || KAV || Added URL for Fetching Resource Request Details
    url(r'^resreq_details_fetch/$',resreq_details_fetch,name='resreq_details_fetch'),
    #06-July-2018 || KAV || Added URL for Fetching Resource Request Details By Id
    url(r'^resreq_details_fetch_id/$',resreq_details_fetch_id,name='resreq_details_fetch_id'),
    #12-July-2018 || KAV || Added URL for Remove Resource Request Details By Id
    url(r'^resreq_details_remove/$',resreq_details_remove,name='resreq_details_remove'),
    #26-July-2018 || MST || Added URL for Fetching Org Unit List
    url(r'^wfp_org_unit/$',wfp_org_unit,name='wfp_org_unit'),
    #26-July-2018 || KAV || Added URL for Organization Unit List Fetch
    url(r'^resreq_get_org_unit_list/$',resreq_get_org_unit_list,name='resreq_get_org_unit_list'),
    #31-July-2018 || SMI || Added URL for fetching data on donut chart slice click
    url(r'^wfp_struct_step5_chart_click/$',wfp_struct_step5_chart_click,name='wfp_struct_step5_chart_click'),
    #31-July-2018 || SMI || Added URL for fetching data on select role for bar chart load
    url(r'^wfp_struct_step5_role_sel/$',wfp_struct_step5_role_sel,name='wfp_struct_step5_role_sel'),
    #16-Aug-2018 || SMI || Added URL to fetch data for stacked bar chart by selected roles
    url(r'^wfp_bar_msel_roles_chng/$',wfp_bar_msel_roles_chng,name='wfp_bar_msel_roles_chng'),
    #17-Aug-2018 || SMI || Added URL to fetch data for stacked bar chart by selected grades
    url(r'^wfp_bar_msel_grades_chng/$',wfp_bar_msel_grades_chng,name='wfp_bar_msel_grades_chng'),
    #31-July-2018 || KAV || Added URL for Step 3 Save
    url(r'^wfp_sys_step3_save_form/$',wfp_sys_step3_save_form,name='wfp_sys_step3_save_form'),
    #06-August-2018 || MST || Added URL to fetch grade details
    url(r'^fetch_grade_details/$',fetch_grade_details,name='fetch_grade_details'),
    #07-August-2018 || MST || Added URL to fetch selected grade details
    url(r'^fetch_selected_grade_details/$',fetch_selected_grade_details,name='fetch_selected_grade_details'),
    #17-August-2018 || MST || Added URL to fetch Strategy Analysis Gap Datatable
    url(r'^stg_analysis_gap_table/$',stg_analysis_gap_table,name='stg_analysis_gap_table'),
    #21-August-2018 || SMI || Added the URL for fetching data for Strategy Analysis - Summarized Report
    url(r'^wfp_stgy_step5_details/$', wfp_stgy_step5_details, name='wfp_stgy_step5_details'),
    #21-August-2018 || SMI || Added URL for fetching data on donut chart slice click - Strategy Analysis
    url(r'^wfp_stgy_step5_chart_click/$',wfp_stgy_step5_chart_click,name='wfp_stgy_step5_chart_click'),
    #21-August-2018 || SMI || Added URL for fetching data on select role for bar chart load - Strategy Analysis 
    url(r'^wfp_strgy_step5_role_sel/$',wfp_strgy_step5_role_sel,name='wfp_strgy_step5_role_sel'),
    #21-Aug-2018 || SMI || Added URL to fetch data for stacked bar chart by selected roles - Strategy Analysis
    url(r'^wfp_stgy_bar_msel_roles_chng/$',wfp_stgy_bar_msel_roles_chng,name='wfp_stgy_bar_msel_roles_chng'),
    #21-Aug-2018 || SMI || Added URL to fetch data for stacked bar chart by selected grades - Strategy Analysis
    url(r'^wfp_stgy_bar_msel_grades_chng/$',wfp_stgy_bar_msel_grades_chng,name='wfp_stgy_bar_msel_grades_chng'),
      #16-August-2018 || KAV || Added URL to fetch  details for Map
    url(r'^wfp_system_step5_map_details/$',wfp_system_map_details,name='wfp_system_step5_map_details'),
    #16-August-2018 || KAV || Added URL to fetch  details for piechart
    url(r'^wfp_system_step5_piechart_details/$',wfp_system_step5_piechart_details,name='wfp_system_step5_piechart_details'),
    #16-August-2018 || KAV || Added URL to fetch  details for piechart click
    url(r'^wfp_system_step5_chart_click/$',wfp_system_step5_chart_click,name='wfp_system_step5_chart_click'),
    #17-August-2018 || KAV || Added URL to fetch  details for barchart  click
    url(r'^wfp_system_step5_role_sel/$',wfp_system_step5_role_sel,name='wfp_system_step5_role_sel'),
    #17-August-2018 || KAV || Added URL to fetch  multi role details for barchart  click
    url(r'^wfp_sysstep5_fetch_multirole_details/$',wfp_sysstep5_fetch_multirole_details,name='wfp_sysstep5_fetch_multirole_details'),

]
