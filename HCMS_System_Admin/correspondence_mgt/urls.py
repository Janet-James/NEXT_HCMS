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
from django.conf.urls import url, include
from .views import CorrespondenceView,DataDictionary,entity_add_data,entity_fetch_data,entity_fetchdata_onclick,entity_update_data,entity_delete_data

urlpatterns = [
    url(r'^correspondence_page/$',CorrespondenceView.as_view(), name='correspondence_page'),
    url(r'^datadictionary_page/$',DataDictionary.as_view(), name='datadictionary_page'),
    url(r'^entity_add_data/$',entity_add_data, name='entity_add_data'),
    url(r'^entity_fetch_data/$',entity_fetch_data, name='entity_fetch_data'),
    url(r'^entity_fetchdata_onclick/$',entity_fetchdata_onclick, name='entity_fetchdata_onclick'),
    url(r'^entity_update_data/$',entity_update_data, name='entity_update_data'),
    url(r'^entity_delete_data/$',entity_delete_data, name='entity_delete_data'),
]
