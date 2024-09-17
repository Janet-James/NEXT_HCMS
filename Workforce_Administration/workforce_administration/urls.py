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
from .demotion import *
from .employee_promotion import *
from .transfer import *

urlpatterns = [
    #17-May-2018 || JAN || Base URL for Workforce Transfer
    url(r'^workforce_transfer/$',Transfer.as_view(),name='workforce_transfer'),
    #17-May-2018 || JAN || Base URL for Workforce Transfer Evaluation
    url(r'^workforce_transfer_evaluation/$',TransferEvaluation.as_view(),name='workforce_transfer_eval'),
    url(r'^employee_promotion/$',HCMSWorkforcePromotionView.as_view(),name='employee_promotion'),
    url(r'^employee_promotion_evaluate/$',HCMSWorkforceEvaluatePromotionView.as_view(),name='employee_promotion_evaluate'),
    url(r'^workforce_demotion/$',HCMSWorkforceDemotionView.as_view(),name='workforce_demotion'),
    
]
