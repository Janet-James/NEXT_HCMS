from django.conf.urls import url
from . import views
urlpatterns = [
            url(r'^project/mail/$', views.mail, name='Email List'),
            ]