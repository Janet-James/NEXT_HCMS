from django.conf.urls import url
from .views import OKR_Tree_View
from . import views

urlpatterns = [
               url(r'^pm_okr_tree_view/$', views.OKR_Tree_View, name='pm_okr_tree_view'),
               url(r'^pm_process_view/$', views.ViewProcessing, name='pm_processing'),
               url(r'^pm_department_view/(\d+)/$', views.DepartmentView, name='department_view'),
               url(r'^pm_department_treeview/$',views.DepartmentTreeView,name='pm_department_treeview'),
               url(r'^pm_update_department/$',views.UpdateTeam,name='pm_update_department'),
               url(r'^pm_info_maxorderid/$',views.MaxOrderId,name='pm_info_maxorderid'),
               url(r'^pm_create_department/$',views.CreateDepartment,name='pm_create_department'),
               url(r'^pm_delete_department/$',views.DeleteDepartment,name='pm_delete_department'),
               url(r'^pm_department_wise_filter/$',views.DepartmentWise_filter,name='pm_department_wise_filter'),
               url(r'^pm_objective_view/(\d+)/$', views.ObjectiveView, name='pm_objective_view'),
               url(r'^pm_create_objective/$',views.CreateObjective,name='pm_create_objective'),
               url(r'^pm_edit_objective/$',views.EditObjective,name='pm_edit_objective'),
               url(r'^pm_delete_objective/$',views.DeleteObjective,name='pm_delete_objective'),
               url(r'^pm_member_list/$',views.Member_list,name='pm_member_list'),
               url(r'^pm_create_keyresults/$',views.CreateKeyResults,name='pm_create_keyresults'),
               url(r'^pm_teamview_page/$',views.PM_teamview_page,name='pm_teamview_page'),
               url(r'^pm_update_keyresults/$',views.UpdateKeyResults,name='pm_update_keyresults'),
               url(r'^objective_perspective_view/$',views.objective_perspective_view,name='objective_perspective_view'),
               url(r'^objective_perspective_retrieve/$',views.objective_perspective_retrieve,name='objective_perspective_retrieve'),
               url(r'^stratergicObjectivesInsert/$',views.stratergicObjectivesInsert,name='stratergicObjectivesInsert'),
               url(r'^pm_exp_cmp_chart/$',views.pm_exp_cmp_chart,name='pm_exp_cmp_chart'),
               url(r'^pm_objective_data_retrieval/$',views.pm_objective_data_retrieval,name='pm_objective_data_retrieval'),
               url(r'^pm_key_result_insert_update/$',views.key_result_insert_update,name='pm_key_result_insert_update'),
               url(r'^pm_keyresult_view/$',views.pm_keyresult_view,name='pm_keyresult_view'),
               url(r'^pm_delete_keyresults/$',views.key_result_delete,name='key_result_delete'),
               url(r'^pm_access_level/$',views.access_level,name='access_level'),

]