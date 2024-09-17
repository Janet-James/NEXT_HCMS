"""hcms_ta_balanced_scorecard URL Configuration

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
from .views import HCMStaBalancedScorecardView
from . import views

urlpatterns = [
    url(r'^ta_balanced_scorecard/$', HCMStaBalancedScorecardView.as_view(), name='ta_balanced_scorecard'),  #Added- Bavya-23Feb2018
    url(r'^balanced_score_data/$', views.balanced_score_data, name='balanced_score_data'),  #Added- Bavya-23Feb2018
    url(r'^balanced_score_data_page/(?P<id>[0-9]{1,5})/$', views.balanced_score_data_page, name='balanced_score_data_page'),  #Added- Bavya-26Feb2018
]