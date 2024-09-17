from django.conf.urls import url
from .views import NTree
from . import views

urlpatterns = [
               url(r'^Objective_Key_Result/$', NTree.as_view(), name='Objective_Key_Result'),
               url(r'^OKR/process_view/$', views.NTreeViewProcessing, name='NTreeViewProcessing'),
               url(r'^OKR/information-view/(\d+)/$', views.NTreeInformationView, name='ntree_information_view'),
               url(r'^OKR/team-view/(\d+)/$', views.NTreeTeamView, name='NTree Team View'),
               url(r'^create_objective/$',views.CreateObjective,name='NTree Create Objective'),
               url(r'^edit_objective/$',views.EditObjective,name='NTree Edit Objective'),
               url(r'^delete_objective/$',views.DeleteObjective,name='NTree Delete Objective'),
               url(r'^member_list/$',views.Member_list,name='NTree MemberList'),
               url(r'^create_keyresults/$',views.CreateKeyResults,name='NTree Create Key Results'),
               url(r'^update_keyresults/$',views.UpdateKeyResults,name='NTree Update Key Results'),
               url(r'^delete_keyresults/$',views.DeleteKeyResults,name='NTree Delete Key Results'),
               url(r'^Ntree_teamview_page/$',views.Ntree_teamview_page,name='NTree Team View page'),
               url(r'^update_team/$',views.UpdateTeam,name='NTree Update Team page'),
               url(r'^delete_team/$',views.DeleteTeam,name='NTree Delete Team page'),
               url(r'^team_treeview/$',views.TeamTreeView,name='NTree Team Tree View Page'),
               url(r'^info_maxorderid/$',views.MaxOrderId,name='NTree Maximum Order Id'),
               url(r'^create_team/$',views.CreateTeam,name='NTree Create Team'),
               url(r'^teamwise_filter/$',views.teamwise_filter,name='NTree Team Wise Filter '),
               url(r'^emp_details/$',views.Emp_details,name='NTree Employee Details'),
               url(r'^team_details/$',views.Team_details,name='NTree Team Details'),
               url(r'^okr_access_rights/$',views.access_rights,name='OKR Access Rights'),
               url(r'^okr_access_rights_view/$',views.access_rights_view,name='OKR Access Rights View'),
               url(r'^okr_access_rights_create/$',views.access_rights_create,name='OKR Access Rights Create'),
               url(r'^okr_access_rights_check/$',views.access_rights_check,name='OKR Access Rights Check'),
               #charts url start
               url(r'^exp_cmp_chart/$',views.exp_cmp_chart,name='NTree Expectation Completion Chart'),
               url(r'^team_click_chart/$',views.team_click_chart,name='Team click chart details'),
               url(r'^Not_authorized/$',views.Not_authorized,name='Not authorized '),
#                dashboard
               url(r'^ntree_dashboard/$',views.ntree_dashboard,name='ntree_dashboard '),
]
