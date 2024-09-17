"""hcms_comprehensive_management URL Configuration

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
from .views import HCMSbaseEmployeeObjectiveView
from . import views

urlpatterns = [
    url(r'^base_employee/$',HCMSbaseEmployeeObjectiveView.as_view(), name='base_employee'), #Added- Bavya-02Apr2018
    url(r'^employee_details/$',views.employee_row_click, name='employee_row_click'), #Added- Bavya-02Apr2018
    url(r'^education_details/$',views.employee_education_click, name='employee_education_click'), #Added- Sindhuja-05Apr2018
    url(r'^skill_details/$',views.employee_skill_click, name='employee_skill_click'), #Added- Sindhuja-05Apr2018
    url(r'^experience_details/$',views.employee_experience_click, name='employee_experience_click'), #Added- Sindhuja-05Apr2018
    url(r'^certfication_details/$',views.employee_certification_click, name='employee_certification_click'), #Added- Sindhuja-05Apr2018
    url(r'^employee_assessment_info/$',views.employee_assessment_info, name='employee_assessment_info'), #Added- JAN-05Apr2018
    url(r'^employee_objective_info/$',views.employee_objective_info, name='employee_objective_info'), #Added- JAN-09Apr2018
]