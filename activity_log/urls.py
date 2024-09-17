"""hcms_activity_log URL Configuration

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
from . import transform_api
from .views import LoginView, logout, usr_value_fetch, otp_generate, forgot_pwd, change_pwd, check_login_mobile, forgot_pwd_mobile, update_pwd_mobile, change_pwd_mobile, get_user_image,ActivityTracking

urlpatterns = [
    url(r'^$', LoginView.as_view(), name="login_page"),
    url(r'^otp_generate/', otp_generate, name="otp_generate"),
    url(r'^usr_value_fetch/', usr_value_fetch, name="usr_value_fetch"),
    url(r'^forgot_pwd/', forgot_pwd, name="forgot_pwd"),   
    url(r'^change_pwd/', change_pwd, name="change_pwd"), 
    url(r'^logout/', logout, name="logout"),
        
    url(r'^check_login_mobile/', check_login_mobile, name="check_login_mobile"), 
    url(r'^forgot_pwd_mobile/', forgot_pwd_mobile, name="forgot_pwd_mobile"),  
    url(r'^change_pwd_mobile/', change_pwd_mobile, name="change_pwd_mobile"),
    url(r'^update_pwd_mobile/', update_pwd_mobile, name="update_pwd_mobile"), 
    
    #TRANSFORM API 
    url(r'^user_table/$', transform_api.user_table, name='User Table List'),#USER TABLE LIST API 
    url(r'^team/details/$', transform_api.team_details, name='Team Details Listing View'),#TEAM DETAILS LIST
    
    url(r'^get_user_image/', get_user_image, name="get_user_image"), #13-MAY-2019 || SMI || API to get user image
    url(r'^sync_activity/', ActivityTracking.as_view(), name="sync_activity"), #07-AUG-2020 || ANI || API to get sync_activity

]  
 