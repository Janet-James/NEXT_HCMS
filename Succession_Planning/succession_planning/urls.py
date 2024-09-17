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
from .views import SP_TransferRequest, SP_TransferProcess, SP_PromotionRequest, SP_PromotionProcess, SP_DemotionRequest, SP_DemotionProcess, SP_Report, SP_PotentialSuccessor, SP_SuccessorHierarchy, SP_ItentifyKeyRoles
import sp_transfer_request,sp_transfer_process,sp_promotion_request,sp_promotion_process,sp_demotion_request,sp_demotion_process,sp_report,sp_potential_successors,sp_successor_hierarchy,sp_itentify_key_role,sp_talent_profiling,views
urlpatterns = [
    #07-Sep-2018 || TRU || Added the base URL for Succession Planning || all page render
    url(r'^sp_transfer_request/$', SP_TransferRequest.as_view(), name='sp_transfer_request'),
    url(r'^sp_transfer_process/$', SP_TransferProcess.as_view(), name='sp_transfer_process'),
    url(r'^sp_promotion_request/$', SP_PromotionRequest.as_view(), name='sp_promotion_request'),
    url(r'^sp_promotion_process/$', SP_PromotionProcess.as_view(), name='sp_promotion_process'),
    url(r'^sp_demotion_request/$', SP_DemotionRequest.as_view(), name='sp_demotion_request'),
    url(r'^sp_demotion_process/$', SP_DemotionProcess.as_view(), name='sp_demotion_process'),
    url(r'^sp_potential_successor/$', SP_PotentialSuccessor.as_view(), name='sp_potential_successor'),
    url(r'^sp_successor_hierarchy/$', SP_SuccessorHierarchy.as_view(), name='sp_successor_hierarchy'),
    url(r'^sp_identify_key_roles/$', SP_ItentifyKeyRoles.as_view(), name='sp_identify_key_roles'),
    #Transfer Request
    url(r'^sp_transfer_request_CRUD/$', sp_transfer_request.TransferRequestCRUDOperations, name='sp_transfer_request_CRUD'),
    url(r'^sp_transfer_request_data_table/$', sp_transfer_request.TransferRequestDataTable, name='sp_transfer_request_data_table'),
    url(r'^sp_transfer_request_table_click/$', sp_transfer_request.TransferRequestCRUDTableClick, name='sp_transfer_request_table_click'),
    url(r'^sp_transfer_division_drop_down/$', sp_transfer_request.divisionDropdownFunction, name='sp_transfer_request_division_drop_down'),
    
    # Promotion Request 
    url(r'^sp_promotion_request_CRUD/$', sp_promotion_request.PromotionRequestCRUDOperations, name='sp_transfer_request_CRUD'),
    url(r'^sp_promotion_request_data_table/$', sp_promotion_request.PromotionRequestDataTable, name='sp_transfer_request_data_table'),
    url(r'^sp_promotion_request_table_click/$', sp_promotion_request.PromotionRequestCRUDTableClick, name='sp_transfer_request_table_click'),
    
    # Demotion Request 
    url(r'^sp_demotion_request_CRUD/$', sp_demotion_request.DemotionRequestCRUDOperations, name='sp_demotion_request_CRUD'),
    url(r'^sp_demotion_request_data_table/$', sp_demotion_request.DemotionRequestDataTable, name='sp_demotion_request_data_table'),
    url(r'^sp_demotion_request_table_click/$', sp_demotion_request.DemotionRequestCRUDTableClick, name='sp_demotion_request_table_click'),
    
    #10-Sep-2018 || TRU || Added the base URL for Succession Planning || transfer process
    url(r'^sp_transfer_process_details/$',sp_transfer_process.spTransferProcess,name='sp_transfer_process_details'),
    url(r'^sp_transfer_process_event_details/$',sp_transfer_process.spTransferProcessEvent,name='sp_transfer_process_event_details'),
    url(r'^sp_transfer_process_update/$',sp_transfer_process.spProcessTransferEventUpdate,name='sp_transfer_process_update'),
    #10-Sep-2018 || TRU || Added the base URL for Succession Planning || promotion process
    url(r'^sp_promotion_process_details/$',sp_promotion_process.spPromotionProcess,name='sp_promotion_process_details'),
    url(r'^sp_promotion_process_event_details/$',sp_promotion_process.spPromotionProcessEvent,name='sp_promotion_process_event_details'),
    url(r'^sp_promotion_process_update/$',sp_promotion_process.spProcessPromotionEventUpdate,name='sp_promotion_process_update'),
    #11-Sep-2018 || TRU || Added the base URL for Succession Planning || Demotion process
    url(r'^sp_demotion_process_details/$',sp_demotion_process.spDemotionProcess,name='sp_demotion_process_details'),
    url(r'^sp_demotion_process_event_details/$',sp_demotion_process.spDemotionProcessEvent,name='sp_demotion_process_event_details'),
    url(r'^sp_demotion_process_update/$',sp_demotion_process.spProcessDemotionEventUpdate,name='sp_demotion_process_update'),
    # SP Reporting
    url(r'^sp_report/$', SP_Report.as_view(), name='sp_report'),
    url(r'^sp_report_data/$', sp_report.report_data, name='sp_report_data'),
    #14-Sep-2018 || TRU || Added the base URL for Succession Planning || dropdown process
    url(r'^hcms_dropdown_change/$', views.hcmsDropdownChange, name='hcms_dropdown_change'),
    #18-Sep-2018 || TRU || Added the base URL for Succession Planning || potential successors list
    url(r'^sp_potential_successors_list/$', sp_potential_successors.PotentialSuccessorsEmployeeList, name='sp_potential_successors_list'),
    url(r'^sp_successor_hierarchy_list/$', sp_successor_hierarchy.spSuccessorHierarchyDetails, name='sp_successor_hierarchy_list'),

    url(r'^sp_talent_profiling_data/$',sp_talent_profiling.sp_talent_profiling_data, name='sp_talent_profiling_data'),
    url(r'^sp_talent_profiling_crud/$',sp_talent_profiling.sp_talent_profiling_crud, name='sp_talent_profiling_crud'),
    #21-Sep-2018 || TRU || Added the base URL for Succession Planning || Identify Key Roles successors list
    url(r'^sp_key_role_add/$', sp_itentify_key_role.spKeyRoleCRUD, name='sp_key_role_add'),
    url(r'^sp_key_role_details/$', sp_itentify_key_role.roleDetailsGet, name='sp_key_role_details'),
    #24-Sep-2018 || TRU || Added the base URL for Succession Planning || Learning & Development list
    url(r'^sp_learning_development_list/$', sp_potential_successors.learningDevelopmentDetailsGet, name='sp_learning_development_list'),
    url(r'^sp_identify_development_list/$', sp_potential_successors.indentifyDevelopmentDetailsGet, name='sp_identify_development_list'),
    url(r'^sp_employee_profile_list/$', sp_potential_successors.profileList, name='sp_employee_profile_list'),
]