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
from django.views.generic import TemplateView
import attendance,past_attendance,kiosk,holiday_list,org_structure,leave_balance,leave,reporting_builder
from .holiday_list import *
from .attendance import * 
from .kiosk import *  
from .past_attendance import * 
from .org_structure import *     
from .leave_balance import *   
from .leave import *
from .reporting_builder import *    
from .views import HRMSHRDashboard, HRMSMGMDashboard 
urlpatterns = [
    url(r'^hrms_attendance/$', HrmsAttendance.as_view(), name='attendance_page'),
    url(r'^hrms_attendance_employee_search/$', attendance.hrmsAttendanceEmployeeSearch, name='employee_search_page'),
    url(r'^hrms_attendance_crud_operation/$', attendance.HRMSCRUDOpertion, name='attendance_crud_operation'),
    url(r'^hrms_attendance_data/$', attendance.hrmsAttendanceData, name='attendance_table_data'),
    url(r'^hrms_employee_filter_list/$', attendance.hrmsEmployeeFilterList, name='hrms_employee_filter_list'),
    #Past Attendance 
    url(r'^hrms_past_attendance/$', HrmsPastAttendance.as_view(), name='hrms_past_attendance'),
    url(r'^hrms_search_employee_attendance/$', past_attendance.hrmsPastSearchAttendance, name='hrms_search_employee_attendance'),
    #Employee Kiosk mode
    url(r'^hrms_kiosk_employee/$', HrmsKIOSK.as_view(), name='hrms_kiosk_employee'),
    url(r'^hrms_kiosk_employee_list/$', kiosk.hrmsKIOSKEmployeeList, name='hrms_kiosk_employee_list'),
    url(r'^hrms_kiosk_employee_events_list/$', kiosk.hrmsKIOSKEmployeeEventsList, name='hrms_kiosk_employee_events_list'),
    #Holiday list
    url(r'^hrms_holiday_list/$', HrmsHolidayList.as_view(), name='holiday_list'), 
    url(r'^holiday_details/$', HRMSHolidayCalendarView.as_view(), name='holiday_details'), 
    url(r'^hrms_holiday_crud_operation/$', holiday_list.HRMSHolidayCRUDOpertion, name='holiday_crud_operation'),
    url(r'^hrms_holiday_list_data/$', holiday_list.hrmsHolidayListData, name='holiday_list_data'),
    #Org structure
    url(r'^hrms_org_structure/$', HrmsOrgStructure.as_view(), name='hrms_org_structure'), 
    url(r'^hrms_org_update_operation/$', org_structure.hrmsOrgCRUDOpertion, name='hrms_org_update_operation'),
    url(r'^hrms_org_structure_data/$', org_structure.hrmsOrgtSructureData, name='hrms_org_structure_data'),
    url(r'^hrms_org_unit_change_structure_data/$', org_structure.hrmsOrgtUnitSructureData, name='hrms_org_unit_change_structure_data'),
    url(r'^hrms_org_unit_structure_data/$', org_structure.hrmsOrgtSructureUnitData, name='hrms_org_unit_structure_data'),
    #leave balance
    url(r'^hrms_leave_balance/$', LeaveBalance.as_view(), name='hrms_leave_balance'), 
    url(r'^hrms_leave_balance_crud_operation/$', leave_balance.leaveBalanceCRUDOpertion, name='hrms_leave_balance_crud_operation'),
    url(r'^hrms_leave_balance_list_data/$', leave_balance.leaveBalanceData, name='hrms_leave_balance_data'),
    url(r'^hrms_employee_list_org_data/$', leave_balance.hrmsEmployeeData, name='hrms_employee_list_data'),
    #Leave start
    url(r'^hrms_leave/$',HRMSLeave.as_view(),name='hrms_leave'),
    url(r'^hrms_leave_calendar/$',HRMSCalendarView.as_view(),name='hrms_leave_calendar'),
    url(r'^hrms_leave_type_select/$',leave.HRMSLeaveDropdown, name='hrms_leave_type_select'),
    url(r'^hrms_holiday_list_date/$', leave.holiday_list_date, name='hrms_holiday_list_date'),
    url(r'^hrms_leave_create/$',leave.HRMSCURDLeave, name='hrms_leave_create'),
    url(r'^hrms_leave_details/$',leave.HRMSLeavetable, name='hrms_leave_details'),
    url(r'^hrms_leave_row_click/$',leave.HRMSLeaveRowClick, name='hrms_leave_row_click'),
    url(r'^hrms_leave_balance_calculation/$',leave.HRMSLeaveBalanceCalculation, name='hrms_leave_balance_calculation'),
    url(r'^hrms_leave_employee_list/$',leave.HRMSLeaveEmployeeList, name='hrms_leave_employee_list'),
    url(r'^hrms_leave_calendar_data/$',leave.HRMSLeaveCalendar, name='hrms_leave_calendar_data'),
    url(r'^hrms_leave_reference_data/$',leave.HRMSLeave_reference_data, name='HRMSLeave_reference_data'),
    #Process Leave 
    url(r'^hrms_leave_process/$',HRMSLeaveProcess.as_view(), name='hrms_leave_process'),
    url(r'^hrms_leave_process_data/$',leave.HRMSLeaveProcessData, name='hrms_leave_process_data'),
    url(r'^hrms_leave_process_row/$',leave.HRMSLeaveProcessRowClick, name='hrms_leave_process_row'),
    url(r'^hrms_leave_process_balance_update/$', leave.HRMSLeaveProcessBalanceUpdate, name='hrms_leave_process_balance_update'), 
    #reporting
    url(r'^hrms_reports/$',HrmsReporting.as_view(), name='hrms_reports'),   
    url(r'^hrms_employee_report_list/$',reporting_builder.hrmsEmployeeReport, name='hrms_employee_report_list'),
    url(r'^hrms_employee_report_list_search/$',reporting_builder.hrmsEmployeeReportSearch, name='hrms_employee_report_list_search'),
    #attendance
    url(r'^hrms_employee_attendance_report_list/$',reporting_builder.hrmsEmployeeAttendanceReport, name='hrms_employee_attendance_report_list'),
    url(r'^hrms_employee_attendance_report_list_search/$',reporting_builder.hrmsEmployeeAttendanceReportSearch, name='hrmsEmployeeAttendanceReportSearch'),
    #leave
    url(r'^hrms_employee_leave_report_list/$',reporting_builder.hrmsEmployeeLeaveReport, name='hrms_employee_leave_report_list'),
    url(r'^hrms_employee_leave_report_list_search/$',reporting_builder.hrmsEmployeeLeaveReportSearch, name='hrms_employee_leave_report_list_search'),
    #leave
    url(r'^hrms_employee_doc_report_list/$',reporting_builder.hrmsEmployeeDocReport, name='hrms_employee_doc_report_list'),
    url(r'^hrms_employee_doc_report_list_search/$',reporting_builder.hrmsEmployeeDocReportSearch, name='hrms_employee_doc_report_list_search'),
    #dashboard 
    url(r'^hrms_hrd/$',HRMSHRDashboard.as_view(), name='hrms_page'),
    url(r'^hrms_mgmd/$',HRMSMGMDashboard.as_view(), name='hrms_mgmd'),    
    #org unit structure view  
    url(r'^hrms_unit_structure/$',HrmsOrgUnitStructure.as_view(), name='hrms_unit_structure'), 
    url(r'^hrms_unit_structure_list_data/$',org_structure.hrmsOrgtUnitListStructure, name='hrms_employee_leave_report_list'), 
    url(r'^hrms_employee_list_org_unit/$',past_attendance.hrmsOrgtUnitListPastAttendance, name= 'hrms_past_attendance_org_org_unit_employees'),
    url(r'^hrms_employee_search_list_dropdown/$', attendance.hrmsAttendanceEmployeeSearchList, name='hrms_employee_search_list_dropdown'),
    
    #holiday_list_mobile  
    url(r'^HolidayList_mobile/$', holiday_list.HolidayList_mobile, name='holiday_list_mobile'),
    #Leave_mobile 
    url(r'^Leave_Type_mobile/$', leave.Leave_Type_mobile, name='Leave_Type_mobile'),
    url(r'^Leave_Status_mobile/$', leave.Leave_Status_mobile, name='Leave_Status_mobile'),
    url(r'^view_leave_history_mobile/$', leave.view_leave_history_mobile, name='view_leave_history_mobile'),
    url(r'^Raise_leave_request_mobile/$', leave.Raise_leave_request_mobile, name='Raise_leave_request_mobile'), 
    url(r'^leave_request_update_mobile/$', leave.leave_request_update_mobile, name='leave_request_update_mobile'),
    url(r'^leave_request_delete_mobile/$', leave.leave_request_delete_mobile, name='leave_request_delete_mobile'),
    url(r'^appr_leave_mobile/$', leave.appr_leave_mobile, name='appr_leave_mobile'),
    url(r'^reject_leave_mobile/$', leave.reject_leave_mobile, name='reject_leave_mobile'),
    url(r'^view_leave_manager_mobile/$', leave.view_leave_manager_mobile, name='view_leave_manager_mobile'),    
    url(r'^get_user_image/$', leave.get_user_image, name='get_user_image'),
    url(r'^reject_dropdown_mobile/$', leave.reject_dropdown_mobile, name='reject_dropdown_mobile'),
    url(r'organization/$',leave.organization_details_mobile,name='organization_details'),
    url(r'leave_filter/$',leave.filter_leave_history_mobile,name='leave_filter'),
    url(r'rejected_leave_history/$',leave.rejected_leave_mobile,name='rejected_leave_filter'),
    
    #Leave_balance_mobile
    url(r'^leave_bal_mobile/$', leave_balance.leave_bal_mobile, name='leave_bal_mobile'),
    url(r'leave_details/$',leave.leave_details,name='leave_details'),
    url(r'leave_status_info/$',leave.leave_status_info,name='leave_status_info'),
]