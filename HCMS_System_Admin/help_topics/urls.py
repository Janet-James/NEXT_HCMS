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
from .views import HelpContentDetailsView, HelpContentAppDetailsView, HelpContentAppSysAdminDetailsView, sub_module_data

urlpatterns = [
    url(r'^help_content/$', HelpContentDetailsView.as_view(), name='help_content_page'),
    url(r'^help_content_app/$', HelpContentAppDetailsView.as_view(), name='help_content_page1'),
    url(r'^help_content_details/(?P<module_name>\w{0,50})/$', HelpContentAppSysAdminDetailsView.as_view(), name='help_content_details'),
    url(r'^help_content_details/(?P<module_name>\w{0,50})/(?P<sub_module_name>\w{0,50})/$', sub_module_data, name='help_content_sub_module'),
]