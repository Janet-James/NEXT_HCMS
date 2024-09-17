"""hcms_ta_assessment_custom_rating URL Configuration

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
    url(r'^ta_custom_rating/', HCMSTalentAssessmentRatingView.as_view(), name='ta_custom_rating'),  #Added- SAR -07Feb2018
    url(r'^add_update_custom_rating/',views.AddUpdateCustomRatingScheme, name='add_update_custom_rating'),
    url(r'^custom_rating_detail_fetch/',views.CustomRatingDetailFetch, name='custom_rating_detail_fetch'),
    url(r'^custom_rating_detail_fetch_by_id/',views.CustomRatingDetailFetchById, name='custom_rating_detail_fetch_by_id'),
    url(r'^remove_custom_rating_detail/',views.CustomRatingDetailRemove, name='remove_custom_rating_detail'),
    url(r'^remove_custom_rating_rel_detail/',views.CustomRatingRelDetailRemove, name='remove_custom_rating_rel_detail')
]
 