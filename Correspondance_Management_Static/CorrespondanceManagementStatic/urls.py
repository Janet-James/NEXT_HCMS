from django.conf.urls import url
from . import views
urlpatterns = [
#      url(r'^parameter/$', views.parameter_configuration, name='parameter_configuration'),
       url(r'^$', views.CorrespondanceView.as_view(), name='correspondance_view'),
       url(r'^document/$', views.ParameterConfigurationView.as_view(), name='parameter_configuration_view'),
#        url(r'^get_columnname/$', views.get_columnname_of_table, name='get_columnname'),
       url(r'^get_template/$', views.get_template, name='get_template'),
       url(r'^save_template/$', views.save_template, name='save_template'),
       url(r'^generate_document/$', views.generate_document, name='generate_document'),
       url(r'^generate_saved_document/$', views.generate_saved_document, name='generate_saved_document'),
       url(r'^template_table/$', views.template_table, name='template_table'),
       url(r'^created_document_list/$', views.created_document_list, name='created_document_list'),
       url(r'^save_header_footer/$', views.save_header_footer, name='save_header_footer'),
        url(r'^update_header_footer/$', views.update_header_footer, name='update_header_footer'),
       url(r'^list_header_footer/$', views.list_header_footer, name='list_header_footer'),
        url(r'^sync_employee_list/$', views.sync_employee_list, name='sync_employee_list'),
       
       ]
