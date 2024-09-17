ce_module='MyNext_Dashboard/communication_empowerment'
content_type_value='application/json'
service_default_query='service_default_query'
status = "status"
NTE_08 = 'NTE-08'
service_call_insert='service_call_insert'
communication_thread_display='communication_thread_display'
response_thread_retrieval='response_thread_retrieval'
service_overdue_log_insert='service_overdue_log_insert'
update_service_timelap="update_service_timelap"
communication_response_submit="communication_response_submit"
group_based_employee_fetch='group_based_employee_fetch'
call_assigned_update='call_assigned_update'
employee_id_fetch="employee_id_fetch"
query_code_insert='query_code'
employee_group_check_query='employee_group_check_query'
service_attachment_fetch='service_attachment_fetch'
open_service_call_details_fetch='open_service_call_details_fetch'
ans_service_call_details_fetch='ans_service_call_details_fetch'
resolve_service_call_details_fetch='resolve_service_call_details_fetch'
verify_service_call_details_fetch='verify_service_call_details_fetch'
close_service_call_details_fetch='close_service_call_details_fetch'
ticket_count='ticket_count'
#     mail content
Transform_hcms='NEXT-HCMS' 
module_name="communication_empowerment"
waiting='waiting'
subject_content="HCMS-Communication Empowerment - Query Acknowledgment"
service_group_member_mail_fetch="service_group_member_mail_fetch"
mail_hcms_query_raised_acknowledgement="""<p>Dear {},</p>
<p>This is an automated response confirming the query that you have raised. 
Our <b>{}</b> group will get back to you as soon as possible.</p>
<table border="1">
<tbody><tr>
<td style="font-weight:bold;"> Query Code </td>
<td>{} </td>
</tr>  
<tr>
<td style="font-weight:bold;">Subject </td>
<td>{} </td>
</tr>
<tr>
<td style="font-weight:bold;"> Support Group </td>
<td>{}</td>
</tr>
<tr>
<td style="font-weight:bold;">Status</td>
<td>{} </td>
</tr>
<tr>
<td style="font-weight:bold;">Priority </td>
<td>{} </td>
</tr>
</tbody></table> 
<br>
<p><b><i>Ticket Description:</i></b> </p>
{}<br>
<p>Thank you very much for using NEXT's Communication Empowerment services. </p>"""

mail_hcms_query_notification="""
<p>Hello {} Team,</p>
<p>This is an automated response to notify that {} has raised a query. 
Do the needful as soon as possible.</p>
<table border="1">
<tbody><tr>
<td style="font-weight:bold;"> Query Code </td>
<td>{} </td>
</tr>  
<tr>
<td style="font-weight:bold;">Subject </td>
<td>{} </td>
</tr>
<tr>
<td style="font-weight:bold;"> Support Group </td>
<td>{}</td>
</tr>
<tr>
<td style="font-weight:bold;">Status</td>
<td>{} </td>
</tr>
<tr>
<td style="font-weight:bold;">Priority </td>
<td>{} </td>
</tr>
</tbody></table> 
<br>
<p><b><i>Ticket Description:</i></b> </p>
{}<br>
<p>Thank you very much for using NEXT's Communication Empowerment services. </p>
"""

mail_hcms_response_notification_raiser="""<p>Hello {},</p>
<p>This is an automated mail to notify the response. 
</p>
<br>
<p><b><i>Stage:</i></b> </p>{}<br>
<p><b><i>Response:</i></b> </p>
{}<br>
<p>Thank you very much for using NEXT's Communication Empowerment services. </p>"""
mail_hcms_response_notification_group="""<p>Hello Team,</p>
<p>This is an automated mail to notify the response from {}</b>. 
</p>
<br>
<p><b><i>Stage:</i></b> </p>{}<br>
<p><b><i>Response:</i></b> </p>
{}<br>
<p>Thank you very much for using NEXT's Communication Empowerment services. </p>"""
mail_hcms_query_overdue_notification="""<p>Hello {} Team,</p>
<p>This is an automated mail to notify that Query <b> {} ({})</b> is overdued</b>. 
</p>
<br>
<table border="1">
<tbody><tr>
<td style="font-weight:bold;"> Query Code </td>
<td>{} </td>
</tr>  
<tr>
<td style="font-weight:bold;">Subject </td>
<td>{} </td>
</tr>
<tr>
<td style="font-weight:bold;"> Opened On </td>
<td>{}</td>
</tr>
<tr>
<td style="font-weight:bold;"> Support Group </td>
<td>{}</td>
</tr>
<tr>
<td style="font-weight:bold;">Status</td>
<td>{} </td>
</tr>
<tr>
<td style="font-weight:bold;">Priority </td>
<td>{} </td>
</tr>
</tbody></table> 
<br>
<p><b><i>Ticket Description:</i></b> </p>
{}<br>
<p>Thank you very much for using NEXT's Communication Empowerment services. </p>"""
#                    configuration setup
def_cat_insert='def_cat_insert'
def_cat_remove='def_cat_remove'
fetch_def_cat_data='fetch_def_cat_data'
def_cat_update='def_cat_update'
rating_check_query='rating_check_query'
employee_detail_fetch='employee_detail_fetch'
api_thred_employee_fetch="api_thred_employee_fetch"
api_fetch_auth_user='api_fetch_auth_user'
api_employee_check='api_employee_check'
api_service_search='api_service_search'

api_open_service_call_details_fetch='api_open_service_call_details_fetch'
api_ans_service_call_details_fetch='api_ans_service_call_details_fetch'
api_resolve_service_call_details_fetch='api_resolve_service_call_details_fetch'
api_verify_service_call_details_fetch='api_verify_service_call_details_fetch'
api_close_service_call_details_fetch='api_close_service_call_details_fetch'


group_api_open_service_call_details_fetch='group_api_open_service_call_details_fetch'
group_api_ans_service_call_details_fetch='group_api_ans_service_call_details_fetch'
group_api_resolve_service_call_details_fetch='group_api_resolve_service_call_details_fetch'
group_api_verify_service_call_details_fetch='group_api_verify_service_call_details_fetch'
group_api_close_service_call_details_fetch='group_api_close_service_call_details_fetch'
api_hcm_group_query='api_hcm_group_query'
api_group_check_query='api_group_check_query'
def_cat_insert_check='def_cat_insert_check'
def_cat_update_check='def_cat_update_check'