from django.conf.urls import url, include
from django.views.generic import TemplateView
from .views import *
from .import views

urlpatterns = [
        url(r'^payment/$', PaymentView.as_view(), name='payment_view'),
        url(r'^payment/manage/$', ManagePayment.as_view(), name='manage_payment'),
        url(r'^payment/delete/$',views.delete,name='selected_manage_payment'),
      ]