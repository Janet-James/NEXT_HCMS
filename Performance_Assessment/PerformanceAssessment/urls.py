from django.conf.urls import url
from . import views
urlpatterns = [
       url(r'^criteria/$', views.performance_criteria, name='Performance Criteria'),
       url(r'^monthly/$', views.PerformanceAssessmentMonthlyView.as_view(), name='performance_monthly'),
#        url(r'^criteria_table/$', views.criteria_table, name='criteria table'),
#        url(r'^criteria_create/$', views.criteria_create, name='criteria create'),
#        url(r'^criteria_delete/$', views.criteria_delete, name='criteria delete'),
#        url(r'^data_monthly/$', views.performance_data_monthly, name='performance_data'),
#        url(r'^modal_data_monthly/$', views.performance_modal_data_monthly, name='performance_modal_data'),
#        url(r'^rating_save/$', views.rating_save, name='rating_save'),
#        url(r'^send_rating_monthly/$', views.send_rating_monthly, name='save_rating')
]