"""ta_hr_dashboard_page URL Configuration

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
import views
from .views import HCMSAssessmentManagementDashboardView,HCMSAssessmentUserDashboardView

urlpatterns = [
    url(r'^ta_userd/$', HCMSAssessmentUserDashboardView.as_view(), name='ta_userd'), #Added- SND -07Mar2018 
    url(r'^objectives_fetch/',views.ObjectivesFetch, name='objectives_fetch'), #Added- SAR -27Feb2018
    url(r'^ta_mgmd/$', HCMSAssessmentManagementDashboardView.as_view(), name='ta_mgmd'),
    url(r'^businessObjectiveFetch/$', views.businessObjectiveFetch, name='businessObjectiveFetch'),#Added- SND -08Mar2018 
    url(r'^team_data_chart/$', views.team_data_chart, name='team_data_chart'),#Added- SND -27Mar2018 
    url(r'^talent_matrix_view/$', views.talent_matrix_view, name='talent_matrix_view'),#Added- SND -27Mar2018 
]