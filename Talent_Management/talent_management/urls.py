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
from .views import TMTalentProfiling, TMCompetencyAssessment, TMTalentMatrix, TMManageAccolades, TMMyTalentProfile, \
                    tm_org_unit, tm_division, tm_employee_list, tm_get_matrix_data, tm_emp_profile, tm_tp_matrix_create, \
                    tm_perf_pot_view, tm_get_year, tm_comp_employee_list, tm_compt_emp_year, tm_compt_emp_detail, \
                    tm_compt_detail_fetch, tm_comp_assess_detail_submit, tm_comp_assess_detail_remove,tm_accolades_detail_submit, \
                    accol_details_fetch,accol_cardclick_fetch,tm_accol_remove, my_accol_details_fetch, tm_skills_values, tm_tp_matrix_fetch, \
                    tm_my_perf_data, my_feedback_details_fetch, tm_my_perf_sel_kra_data

urlpatterns = [
    #18-Sep-2018 || SMI || Added the base URL for Talent Profiling
    url(r'^talent_profiling/$', TMTalentProfiling.as_view(), name='talent_profiling'), 
    #18-Sep-2018 || SMI || Added the base URL for Competency Assessment
    url(r'^competency_assessment/$', TMCompetencyAssessment.as_view(), name='competency_assessment'),
    #18-Sep-2018 || SMI || Added the base URL for Talent matrix
    url(r'^talent_matrix/$', TMTalentMatrix.as_view(), name='talent_matrix'),
    #18-Sep-2018 || SMI || Added the base URL for Talent matrix
    url(r'^manage_accolades/$', TMManageAccolades.as_view(), name='manage_accolades'),
    #18-Sep-2018 || SMI || Added the base URL for Talent matrix
    url(r'^my_talent_profile/$', TMMyTalentProfile.as_view(), name='my_talent_profile'),
    #19-Sep-2018 || MST || Added URL for Organization Unit List Fetch
    url(r'^tm_org_unit/$', tm_org_unit, name='tm_org_unit'),
    #19-Sep-2018 || MST || Added URL for Organization Unit List Fetch
    url(r'^tm_division/$', tm_division, name='tm_division'),
    #19-Sep-2018 || MST || Added URL for Organization Unit List Fetch
    url(r'^tm_employee_list/$', tm_employee_list, name='tm_employee_list'),
    #26-Sep-2018 || SMI || Added URL to get the year for Talent Matrix Year Dropdown
    url(r'^tm_get_year/$', tm_get_year, name='tm_get_year'),
    #20-Sep-2018 || SMI || Added URL for Matrix data Fetch
    url(r'^tm_get_matrix_data/$', tm_get_matrix_data, name='tm_get_matrix_data'),
    #19-Sep-2018 || MST || Added URL for Talent Profile View
    url(r'^tm_emp_profile/$', tm_emp_profile, name='tm_emp_profile'),
    #19-Sep-2018 || MST || Added URL for Talent Profile View
    url(r'^tm_tp_matrix_create/$', tm_tp_matrix_create, name='tm_tp_matrix_create'),
    #26-Sep-2018 || MST || Added URL to view Performance and Potential view
    url(r'^tm_perf_pot_view/$', tm_perf_pot_view, name='tm_perf_pot_view'),
    #19-Sep-2018 || KAV || Added URL for Competency Based Employee List
    url(r'^tm_comp_employee_list/$', tm_comp_employee_list, name='tm_comp_employee_list'),
    #19-Sep-2018 || KAV || Added URL for Employee Joining Year
    url(r'^tm_compt_emp_year/$', tm_compt_emp_year, name='tm_compt_emp_year'),
    #20-Sep-2018 || KAV || Added URL for  Employee Detail for Competency Assessment  Fetch
    url(r'^tm_compt_emp_detail/$', tm_compt_emp_detail, name='tm_compt_emp_detail'),
    #24-Sep-2018 || KAV || Added URL for Fetch Technical details
    url(r'^tm_compt_detail_fetch/$', tm_compt_detail_fetch, name='tm_compt_detail_fetch'),
    #20-Sep-2018 || KAV || Added URL for Insert / Update Technical Competency Details
    url(r'^tm_comp_assess_detail_submit/$', tm_comp_assess_detail_submit, name='tm_comp_assess_detail_submit'),
    #28-Sep-2018 || SMI || Added URL for Remove Technical Competency Details
    url(r'^tm_comp_assess_detail_remove/$', tm_comp_assess_detail_remove, name='tm_comp_assess_detail_remove'),    
     #URL FOR ACCOLADES
     #26-Sep-2018 || KAV || Added URL for Insert Accolades details
    url(r'^tm_accolades_detail_submit/$', tm_accolades_detail_submit, name='tm_accolades_detail_submit'),
    #26-Sep-2018 || KAV || Added URL for Fetch Accolades details
    url(r'^accol_details_fetch/$', accol_details_fetch, name='accol_details_fetch'),
    #27-Sep-2018 || KAV || Added URL for Fetch Accolades details on Card Click
    url(r'^accol_cardclick_fetch/$', accol_cardclick_fetch, name='accol_cardclick_fetch'),
    #27-Sep-2018 || KAV || Added URL for Remove Accolades details 
    url(r'^tm_accol_remove/$', tm_accol_remove, name='tm_accol_remove'),
    #03-Oct-2018 || KAV || Added URL for fetching my Accolades details 
    url(r'^my_accol_details_fetch/$', my_accol_details_fetch, name='my_accol_details_fetch'),
    #03-Oct-2018 || MST || Added URL to fetch talent profile skills values 
    url(r'^tm_skills_values/$', tm_skills_values, name='tm_skills_values'),
    #04-Oct-2018 || MST || Added URL to fetch matrix values and show in modal 
    url(r'^tm_tp_matrix_fetch/$', tm_tp_matrix_fetch, name='tm_tp_matrix_fetch'),
    #12-Oct-2018 || SMI || Added URL to fetch My Performance data 
    url(r'^tm_my_perf_data/$', tm_my_perf_data, name='tm_my_perf_data'),
    #10-Oct-2018 || KAV || Added URL for fetching my Feedback details 
    url(r'^my_feedback_details_fetch/$', my_feedback_details_fetch, name='my_feedback_details_fetch'),
    #31-Oct-2018 || MST || Added URL for fetching My Performance Selected KRA details 
    url(r'^tm_my_perf_sel_kra_data/$', tm_my_perf_sel_kra_data, name='tm_my_perf_sel_kra_data'),
]
