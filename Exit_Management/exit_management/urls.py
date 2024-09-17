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
from .views import EM_Request, EM_Process, EM_Report, EM_Certificate
import exit_report
import exit_request
import exit_process
import exit_process,exit_certificate,exit_request
urlpatterns = [
    #24-Aug-2018 || TRU || Added the base URL for Exit Management - Exit Details
    url(r'^em_request/$', EM_Request.as_view(), name='em_request'),
    url(r'^em_process/$', EM_Process.as_view(), name='em_process'),
    url(r'^em_report/$', EM_Report.as_view(), name='em_report'),
    url(r'^em_certifcate/$', EM_Certificate.as_view(), name='em_certifcate'),
    #Exit Report
    url(r'^request_report_list_search/$', exit_report.RequestsReportSearch, name='em_request_report'),
    url(r'^approved_report_list_search/$', exit_report.ApprovedReportSearch, name='em_approved_report'),  
    url(r'^rejected_report_list_search/$', exit_report.RejectedReportSearch, name='em_rejected_report'),
    url(r'^exit_report_list_search/$', exit_report.ExitReportSearch, name='em_exit_report'),    
    #Exit Request
    url(r'^em_rquest_initial_data/$', exit_request.EMRequestInitialData, name='em_rquest_initial_data'),
    url(r'^em_rquest_crud/$', exit_request.ExitCRUDOpertion, name='em_rquest_crud'),
    #em Process
    url(r'^em_process_details/$',exit_process.emProcess,name='em_process_details'),
    url(r'^em_process_event_details/$',exit_process.emProcessEvent,name='em_process_event_details'),
    url(r'^em_process_update/$',exit_process.emProcessEventUpdate,name='em_process_update'),
    #em Certificate
    url(r'^em_certificate_list/$',exit_certificate.emCertificateList,name='em_certificate_list'),
    url(r'^em_certificate_generate/$',exit_certificate.emCertificateGenerate,name='em_certificate_generate'),
    url(r'^em_send_mail/$',exit_certificate.emCertificateSend,name='em_send_mail'),
]