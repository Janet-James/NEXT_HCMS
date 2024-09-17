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
from django.conf.urls import url
from .views import HCMSTalentAssessmentView
from .views import HCMSTalentAssessmentTemplateView
from . import views
from views import *
from . import assessment_form
from assessment_form import *
from assessment_reviewer import *

urlpatterns = [
#                Assessment HTML render URl
    url(r'^ta_assessment_form/$', HCMSTalentAssessmentView.as_view(), name='ta_assessment_form'),  #ESA -07Feb2018
    url(r'^ta_assessment_template/$', HCMSTalentAssessmentTemplateView.as_view(), name='ta_assessment_template'),
    
#                   assessment template urls
    url(r'^assessment/Kpi_fetch/$', views.Kpi_fetch, name='Kpi_fetch'),
    url(r'^assessment/assessment_table_view/$', views.assessment_table_view, name='assessment_table_view'),
    url(r'^assessment/save/',views.assessment_template_save,name="assessment_template_save" ),
    url(r'^assessment/delete/',views.assessment_template_delete,name="assessment_template_delete" ),
    url(r'^assessment/template_fetch/',views.assessment_template_fetch,name="assessment_template_fetch" ),
    url(r'^assessment/role_kpi/',views.assessment_role_kpi,name="assessment_role_kpi" ),
    url(r'^assessment/selected_role_kpi/',views.assessment_selected_role_kpi,name="assessment_selected_role_kpi" ),
    url(r'^assessment/update/',views.assessment_template_update,name="assessment_template_update" ),
#         assessment form urls
    url(r'^assessment/form_data_fetch/',assessment_form.assessment_form_data_fetch,name="assessment_form_data_fetch" ),
    url(r'^assessment/form_save/',assessment_form.assessment_form_save,name="assessment_form_save" ),
    url(r'^assessment/form_view/',assessment_form.assessment_form_view,name="assessment_form_view" ),
    url(r'^assessment/form_delete/',assessment_form.assessment_form_delete,name="assessment_form_delete" ),
    url(r'^assessment/form_fetch/',assessment_form.assessment_form_fetch,name="assessment_form_fetch" ),
    url(r'^assessment/form_update/',assessment_form.assessment_form_update,name="assessment_form_update" ),
    url(r'^assessment/org_unit_fetch/',assessment_form.org_unit_fetch,name="org_unit_fetch" ),
    url(r'^assessment/form_template_fetch/',assessment_form.form_template_fetch,name="form_template_fetch" ),
     
#            objective settings url
    url(r'^assessment/objective_type/',objective_type,name="objective_type" ),
    url(r'^assessment/objective_kpi/',objective_ta_kpi,name="objective_ta_kpi" ),
#            assessment reviewer url
    url(r'^reviewer_assessor_type_fetch/',Assessor_type_view,name="assessor_type_fetch" ),
    url(r'^reviewer_employee_search/$', reviewer_employee_search, name='reviewer_employee_search'),  
    url(r'^assessment_access_insert/$', Assessment_access_insert, name='assessment_access_insert'),
    url(r'^assessment_form_detail_fetch/$', assessment_form_detail_fetch, name='assessment_form_detail_fetch'),
#        category and rolecheck
     url(r'^assessment/role_check/$', views.assessment_role_check, name='assessment_role_check'),
]