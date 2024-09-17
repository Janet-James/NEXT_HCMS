"""hcms_ta_assessment_schedule URL Configuration

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
from .views import *

urlpatterns = [
    url(r'^ta_schedule/', HCMSTalentAssessmentScheduleView.as_view(), name='ta_schedule'),  #Added- SAR -07Feb2018
    url(r'^fetch_selected_employee/',views.EmployeeNameFetch, name='EmployeeNameFetch'), #Added- SAR -14Feb2018
    url(r'^schedule_list_fetch/',views.ScheduleListFetch, name='ScheduleListFetch'), #Added- SAR -14Feb2018
    url(r'^management_schedule_list_fetch/',views.ManagementScheduleListFetch, name='ManagementScheduleListFetch'), #Added- SAR -14Feb2018
    url(r'^addupdate_assessment_schedule/',views.AddUpdateAssessmentSchedule, name='AddUpdateAssessmentSchedule'), #Added- SAR -15Feb2018
    url(r'^assessment_schedule_details_fetch/',views.AssessmentScheduleDetailFetch, name='AssessmentScheduleDetailFetch'), #Added- SAR -15Feb2018
    url(r'^schedule_detail_fetch_by_id/',views.ScheduleDetailFetchById, name='ScheduleDetailFetchById'), #Added- SAR -15Feb2018
    url(r'^remove_assessment_schedule/',views.ScheduleDetailRemove, name='ScheduleDetailRemove'), #Added- SAR -15Feb2018
   
]