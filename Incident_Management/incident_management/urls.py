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
from .views import HCMSdetailsRecordingView
from . import views
from views import *

urlpatterns = [
#                Incident Management Details recording render URl   #ESA -05-APR-2018
     url(r'^incident_details/$', HCMSdetailsRecordingView.as_view(), name='incident_details'),
     url(r'^incident/details_save/$', views.details_save,name="details_save"),
     url(r'^incident/kamban_view/$', views.kamban_view,name="kamban_view"),
     url(r'^incident/state_change/$', views.state_change,name="kamban_view"),
     url(r'^incident/acc_details/$', views.details_view,name="acc_details"),
     url(r'^incident/employee_name/$', views.employee_name,name="employee_name"),
     url(r'^incident/details_update/$', views.details_update,name="details_update"),
     url(r'^incident/details_remove/$', views.details_remove,name="details_remove"),
#                Injury Details URL #SND -09-APR-2018
     url(r'^incident/injury_details_save/$', views.injury_details_save,name="injury_details_save"),
     url(r'^incident/injury_details_update/$', views.injury_details_update,name="injury_details_update"),
     url(r'^incident/injury_details_remove/$', views.injury_details_remove,name="injury_details_remove"),
     url(r'^incident/injury_details_view/$', views.injury_details_view,name="incident/injury_details_view"),
#                       investigation details  #ESA -09-APR-2018
     url(r'^incident/investigation_save/$', views.investigation_save,name="investigation_save"),
     url(r'^incident/investigation_details/$', views.investigation_details,name="investigation_details"),
     url(r'^incident/invest_details_remove/$', views.invest_details_remove,name="invest_details_remove"),
#                        corrective action details  #ESA -10-APR-2018
     url(r'^incident/corrective_action_save/$', views.corrective_action_save,name="corrective_action_save"),
     url(r'^incident/corrective_action_details/$', views.corrective_action_details,name="corrective_action_details"),
     url(r'^incident/corrective_action_item_remove/$', views.corrective_action_item_remove,name="corrective_action_item_remove"),

#                Imapact Analysis Details URL #SND -12-APR-2018     
     url(r'^incident/impact_analysis_save/$', views.impact_analysis_save,name="impact_analysis_save"),
     url(r'^incident/impact_analysis_update/$', views.impact_analysis_update,name="impact_analysis_update"),
     url(r'^incident/impact_analysis_remove/$', views.impact_analysis_remove,name="impact_analysis_remove"),
     url(r'^incident/impact_analysis_view/$', views.impact_analysis_view,name="incident/impact_analysis_view"),

     url(r'^incident/corrective_action_update/$', views.corrective_action_update,name="corrective_action_update"),
     url(r'^incident/corrective_action_remove/$', views.corrective_action_remove,name="corrective_action_remove"),
#                                Solution proposal details  #ESA -13-APR-2018
     url(r'^incident/solution_proposal_save/$', views.solution_proposal_save,name="solution_proposal_save"),
     url(r'^incident/solution_proposal_view/$', views.solution_proposal_view,name="solution_proposal_view"),
     url(r'^incident/solution_proposal_remove/$', views.solution_proposal_remove,name="solution_proposal_remove"),
]