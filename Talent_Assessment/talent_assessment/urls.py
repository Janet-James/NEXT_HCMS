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
from .views import HCMStalentperformanceassessmentView
from . import views
from views import *

urlpatterns = [
    url(r'^ta_performance/$', HCMStalentperformanceassessmentView.as_view(), name='ta_performance'),  #Added- Esakkiprem-023-Feb2018
    url(r'^employe_search/$',views.report_employee_search,name="employee_search" ),
    url(r'^org_unit/$',views.org_unit,name="org_unit" ), #Added- Esakkiprem-026-Feb2018  
    url(r'^performance/data_table_view/$',views.performance_table_view,name="org_unit" ),  #Added- Esakkiprem-026-Feb2018  
    url(r'^performance/kpi_view/$',views.performance_kpi,name="performance_kpi" ),  #Added- Esakkiprem-026-Feb2018  
    url(r'^performance/assessor_view/$',views.performance_assessor_view,name="performance_assessor_view" ),
    url(r'^performance/rating_save/$',views.performance_rating_save,name="performance_rating_save" ),
    
#     filter function
 url(r'^performance/org_unit_role/$',views.org_unit_role,name="org_unit_role" ),
  url(r'^performance/filter_employee/$',views.filter_employee,name="filter_employee" ),
   url(r'^performance/search/$',views.performance_search,name="performance_search" )
]