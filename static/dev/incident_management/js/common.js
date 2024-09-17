var global_button_name; var victim_employee_id=[]; var witness_employee_id=[]; var prepetrator_employee_id=[]; var update_victim_employee_id=[];
var update_witness_employee_id=[]; var update_prepetrator_employee_id=[]; var investigation_team=[];

$(document).ready(function(){ 
details_form_reset(); form_button_div(); kamban_view(); details_recording_button_div(1);
	$(".kanban-container a.add-links").hide();  $(".search-links").hide();
});

function onlyUnique(value, index, self){  return self.indexOf(value) === index; }
function form_button_div(){   
	$("#incident_mgmt_btn_div").empty();
	var btnstr = '<button type="button" class="btn btn-success btn-eql-wid btn-animate" id="form_button" onclick="form_div_show();">Add</button>';
	$("#incident_mgmt_btn_div").append(btnstr);	
}
function details_recording_button_div(flag){   
	$("#details_recording_button_div").empty();
	if (flag==1)
	{ 
		var btnstr = '<button type="button" class="btn btn-success animate_btn margin-right-3" id="assessment_form_save" onclick="details_form_submit();">Add</button>';
	}
	else
	{  
		var btnstr= '<button type="button" class="btn btn-primary btn-eql-wid btn-animate margin-right-3" id="assessment_form_updates" onclick="details_form_update()"";><i class="fa fa-green"></i> Update</button>';
		btnstr += '<button type="button" class="btn btn-danger animate_btn margin-right-3" id="assessment_form_delete" onclick="details_remove_confirmation();">Remove</button>';
	}
	btnstr += '<button type="button" class="btn btn-warning animate_btn margin-right-3" id="assessment_form_clear" onclick="details_form_reset();">Cancel / Clear</button>';
	$("#details_recording_button_div").append(btnstr);	
}
function form_div_show(){ $('#details_recording_div').show(); $('#myKanban').hide(); $('#accordion_view').hide(); }
function details_form_reset(){
	document.getElementById("incident_details_recording").reset();
	$('#incident_type').val(0).trigger("change"); $('#mode').val(0).trigger("change"); $('#reported_by').html('');
	$('#incident_severity_type').val(0).trigger("change"); $('#category').val(0).trigger("change");
	$('#reported_by').append($('<option>', {
		value :'0',
		text :'--Select--'
	}));
	$('#status').val('Open').trigger("change"); $('#details_recording_div').hide();
	$('#witness_id').html(''); $('#victrim_id').html(''); $('#prepetrator_id').html(''); $('.errormessage').html('');
	$('#myKanban').show(); $('#accordion_view').hide(); $('.errormessage').html(''); $('#reported_by').val(0).trigger("change");
}
function solution_proposal_reset()
{
	document.getElementById("solution_proposal_form").reset();
	$('.errormessage').html('');
}
//single search and select 
$("#attendance_popup_table").on("click", "tr", function(){ 
	if (!this.rowIndex) return; // skip first row
	id = $('#attendance_popup_table').dataTable().fnGetData(this)[0];
	name = $('#attendance_popup_table').dataTable().fnGetData(this)[3];
	strAppend = ''
		var resource_id=id;
	var resource_name=name
	if(global_button_name=='reported_by'){    
		if(resource_id>0){   
			$('#reported_by').html('')
			$('#reported_by').val(0).trigger("change")
			$('#reported_by').append($('<option>', {
				value :resource_id,
				text :name
			}));
			$('#reported_by').val(resource_id).trigger("change")
		}
		else{
			$('#reported_by').val(0).trigger("change")
		}
	}
	else if(global_button_name=='update_reported_by'){   
		if(resource_id>0){   
			$('#update_reported_by').html('')
			$('#update_reported_by').val(0).trigger("change")
			$('#update_reported_by').append($('<option>', {
				value :resource_id,
				text :name
			}));
			$('#update_reported_by').val(resource_id).trigger("change");
		}
		else{ $('#update_reported_by').val(0).trigger("change"); }
	}
	else{ return true; }
});
//Multiple search and select 
function incident_employee_search(fun_status,tbl_stat,name){
	status = fun_status;
	tbl_status = tbl_stat;
	clearPopupConfirmation();
	basicDropdown();
	global_button_name=name;
	if(status != 'NTE-HRMS'){
		if(status == 'NTE-EMP'){
			var org_id = $('#organization_id option:selected').val();
			var org_unit_id = $('#org_unit_id option:selected').val();
			if(org_id != 0 && org_unit_id != 0 ){
				$('.employeeAdvancedSearch').hide();
				$('#employeeSelect').modal('show');
			}else{
				alert_lobibox("info",sysparam_datas_list['NTE_55']);
			}
		}else{
			$('.employeeAdvancedSearch').show(); $('#employeeSelect').modal('show');
		}
	}else{
		var org_id = $('#company option:selected').val();
		var org_unit_id = $('#organization_unit_id option:selected').val();
		if(org_id != 0 && org_unit_id != 0 ){
			$('.employeeAdvancedSearch').hide();
			$('#employeeSelect').modal('show');
		}else{
			alert_lobibox("info",sysparam_datas_list['NTE_55']);
		}
	}
}
function investigation_reset() {
	$('#team_id').html('');
	var investigation_table = $('#investigation_details_table').DataTable();
	investigation_table.clear().draw();
	$('#investigation_file_list').html(''); $('#investigation_file_upload_content').html('');
	$('#accordion_view').hide(); $('#myKanban').show(); $('.errormessage').html('');
	
}
//employee_id=$("#victrim_id").val();
var tableControl= document.getElementById('attendance_popup_table');
$('#getMultiValues').click(function(){
	if(global_button_name =='victim'){
		arrayOfValues = [];
		strAppend = ''
			var oTable = $("#attendance_popup_table").dataTable();
		$("input:checkbox:checked", oTable.fnGetNodes()).each(function(){
			var status=victim_employee_id.includes($(this).closest('tr').find('td').eq(0).text())
			if(status==false)
			{  
				$('#victrim_id').append("<option value='"+$(this).closest('tr').find('td').eq(0).text()+"'>"+$(this).closest('tr').find('td').eq(3).text()+"</option")
				strAppend += $(this).closest('tr').find('td').eq(3).text()+','
				victim_employee_id.push(this.id);
			}
		}).get();
		$('#employee').val(strAppend.slice(0,-1));
		var victrm_employee_unique_id = victim_employee_id.filter( onlyUnique );
		$('#victrim_id').val(victrm_employee_unique_id).trigger('change');
		$('#employeeSelect').modal('hide');
	}
	else if(global_button_name =='witness'){
		arrayOfValues = [];
		strAppend = ''
			var oTable = $("#attendance_popup_table").dataTable();
		$("input:checkbox:checked", oTable.fnGetNodes()).each(function() {
			var status=witness_employee_id.includes($(this).closest('tr').find('td').eq(0).text())
			if(status==false)
			{  
				$('#witness_id').append("<option value='"+$(this).closest('tr').find('td').eq(0).text()+"'>"+$(this).closest('tr').find('td').eq(3).text()+"</option")
				strAppend += $(this).closest('tr').find('td').eq(3).text()+','
				witness_employee_id.push(this.id);
			}
		}).get();
		$('#employee').val(strAppend.slice(0,-1));
		var witness_employee_unique_id = witness_employee_id.filter( onlyUnique );
		$('#witness_id').val(witness_employee_unique_id).trigger('change');
		$('#employeeSelect').modal('hide');
	}
	else if(global_button_name =='prepetrator'){
		arrayOfValues = [];
		strAppend = ''
			var oTable = $("#attendance_popup_table").dataTable();
		$("input:checkbox:checked", oTable.fnGetNodes()).each(function() {
			var status=prepetrator_employee_id.includes($(this).closest('tr').find('td').eq(0).text())
			if(status==false)
			{  
				$('#prepetrator_id').append("<option value='"+$(this).closest('tr').find('td').eq(0).text()+"'>"+$(this).closest('tr').find('td').eq(3).text()+"</option")
				strAppend += $(this).closest('tr').find('td').eq(3).text()+','
				prepetrator_employee_id.push(this.id);
			}
		}).get();
		$('#employee').val(strAppend.slice(0,-1));
		var prepetrator_employee_unique_id = prepetrator_employee_id.filter( onlyUnique );
		$('#prepetrator_id').val(prepetrator_employee_unique_id).trigger('change');
		$('#employeeSelect').modal('hide');
	}
	else if(global_button_name =='update_victim'){   
		var update_victim_employee_id=$('#update_victrim_id').val();
		var oTable = $("#attendance_popup_table").dataTable();
		if(update_victim_employee_id==null)
		{	
			update_victim_employee_id=[]
		}
		$("input:checkbox:checked", oTable.fnGetNodes()).each(function() {
			update_victim_employee_id.push(this.id);
		}).get();
		var selected_victim_employee_id = update_victim_employee_id.filter( onlyUnique );
		$.ajax(
				{
					type:'post',
					url: "/incident/employee_name/",
					data: {'id':JSON.stringify(selected_victim_employee_id),csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()},
					success: function (json_data){
						var emp_data=json_data.data
						$('#update_victrim_id').html('')
						if(emp_data)
						{   
							var len=emp_data[0].length;
							for(var i=0;i<len;i++)
							{   
								$('#update_victrim_id').append($('<option>', {
									value : emp_data[0][i].id,
									text : emp_data[0][i].name
								}));
							}
							$('#update_victrim_id').val(selected_victim_employee_id).trigger("change")

						}

					},
				})	
	}
	else if(global_button_name =='update_prepetrator'){
		var update_prepetrator_employee_id=$('#update_prepetrator_id').val();
		var oTable = $("#attendance_popup_table").dataTable();
		if(update_prepetrator_employee_id==null)
		{	
			update_prepetrator_employee_id=[]
		}
		$("input:checkbox:checked", oTable.fnGetNodes()).each(function() {
			update_prepetrator_employee_id.push(this.id);
		}).get();
		var selected_victim_employee_id = update_prepetrator_employee_id.filter( onlyUnique );
		$.ajax(
				{
					type:'post',
					url: "/incident/employee_name/",
					data: {'id':JSON.stringify(selected_victim_employee_id),csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()},
					success: function (json_data){
						var emp_data=json_data.data
						$('#update_prepetrator_id').html('')
						if(emp_data)
						{ 
							var len=emp_data[0].length;
							for(var i=0;i<len;i++)
							{   
								$('#update_prepetrator_id').append($('<option>', {
									value : emp_data[0][i].id,
									text : emp_data[0][i].name
								}));
							}
							$('#update_prepetrator_id').val(selected_victim_employee_id).trigger("change")
						}
					},
				})	
	}
	else if(global_button_name =='update_witness'){
		var update_witness_employee_id=$('#update_witness_id').val();
		var oTable = $("#attendance_popup_table").dataTable();
		if(update_witness_employee_id==null)
		{	
			update_witness_employee_id=[]
		}
		$("input:checkbox:checked", oTable.fnGetNodes()).each(function() {
			update_witness_employee_id.push(this.id);
		}).get();
		var selected_victim_employee_id = update_witness_employee_id.filter( onlyUnique );
		$.ajax(
				{
					type:'post',
					url: "/incident/employee_name/",
					data: {'id':JSON.stringify(selected_victim_employee_id),csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()},
					success: function (json_data){
						var emp_data=json_data.data
						$('#update_witness_id').html('')
						if(emp_data)
						{ 
							var len=emp_data[0].length;
							for(var i=0;i<len;i++)
							{   
								$('#update_witness_id').append($('<option>', {
									value : emp_data[0][i].id,
									text : emp_data[0][i].name
								}));
							}
							$('#update_witness_id').val(selected_victim_employee_id).trigger("change")
						}
					},
				})	
	}
	else{ return true; }
});
function corrective_action_reset(){
	$('#qwner_id').html(''); 	$('#action_item').html('');
	var action_item_table = $('#corrective_action_table').DataTable();
	action_item_table.clear().draw();
	$('#action_item').html(''); $('#action_status_id').html('Open'); $('.errormessage').html('');
}
//common function for ajax call
function ajax_data(url_type,url,data)
{  
	var returnStatus=false;
	$.ajax(
			{
				type:url_type,
				url: url,
				async:false,
				data  : data,
				success: function (json_data){
					if(json_data.status=='NTE_01'){  alert_lobibox("success", sysparam_datas_list[json_data.status]); returnStatus = true;}
					else if(json_data.status=='NTE_02'){  alert_lobibox("error", sysparam_datas_list[json_data.status]); }
					else if(json_data.status=='NTE_00'){ alert_lobibox("info",sysparam_datas_list["ERR0033"]); }
					else if(json_data.status=='NTE_01'){ alert_lobibox("error",'Session is expired');}
					else if(json_data.status=='NTE_doc'){ alert_lobibox("Info",'The details are saved but the files are not propery saved'); }
					else if(json_data.status=='NTE_03'){ alert_lobibox("success", sysparam_datas_list[json_data.status]); returnStatus = true; }
					else if(json_data.status=='NTE_02'){ alert_lobibox("error", sysparam_datas_list[json_data.status]); }
					else if(json_data.status=='NTE_02'){ alert_lobibox("error", sysparam_datas_list[json_data.status]); }
					else if(json_data.status=='NTE_04'){ alert_lobibox("success", sysparam_datas_list[json_data.status]); returnStatus = true; }
					else { alert_lobibox("error", sysparam_datas_list["ERR0034"]); }
				},
				error: function () {
					alert_lobibox("error", sysparam_datas_list['NTE_02']);
	                Success = false;//doesnt goes here
	            }
			})	
		return returnStatus;
}
$('#injury_details_add').click(function(){
	var injury_type=$('#injury_type').val(); var illness=$('#illness_id').val();
	var body_type = $('#body_type').val(); var laterality_type=$('#laterality_type').val();
	var notes_id=$('#notes_id').val(); var treatment = [];
	$("input:checkbox[name=treatment]:checked").each(function () {
		field_value=$(this).val()
		treatment.push(field_value)
	});
	data = {'record_id':kanban_clicked_id,'treatment':JSON.stringify(treatment),'injury_type':injury_type,'illness_type':illness,'part_of_body_type':body_type,'laterality_type':laterality_type,'notes':notes_id,csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()}
	ajax_data('POST','/incident/injury_details_save/',data);
})
$('#injury_details_update').click(function(){
	var injury_type=$('#injury_type').val(); var illness=$('#illness_id').val();
	var body_type = $('#body_type').val(); var laterality_type=$('#laterality_type').val();
	var notes_id=$('#notes_id').val(); var treatment = [];
	$("input:checkbox[name=treatment]:checked").each(function () {
		field_value=$(this).val()
		treatment.push(field_value)
	});
	data = {'record_id':kanban_clicked_id,'treatment':JSON.stringify(treatment),'injury_type':injury_type,'illness_type':illness,'part_of_body_type':body_type,'laterality_type':laterality_type,'notes':notes_id,csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()}
	ajax_data('POST','/incident/injury_details_update/',data);
})
$('#injury_details_delete').click(function(){
	data = {'record_id':kanban_clicked_id,csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()}
	ajax_data('POST','/incident/injury_details_remove/',data);
	document.getElementById("injuries_details_recording").reset();
	$('#injury_type').val(0).trigger("change"); $('#illness_id').val(0).trigger("change");$('#body_type').val(0).trigger("change");
	$('#laterality_type').val(0).trigger("change"); $('#notes_id').val('');
});

$('#injury_details_clear').click(function(){ injuryReset(); })
function injuryReset(){
	document.getElementById("injuries_details_recording").reset();
	$('#injury_type').val(0).trigger("change");
	$('#illness_id').val(0).trigger("change");
	$('#body_type').val(0).trigger("change");
	$('#laterality_type').val(0).trigger("change");
	$('#notes_id').val(''); $('#myKanban').show(); $('#accordion_view').hide();
}
//Investigation details
function investigation_table_create(){   
	if ($.fn.DataTable.isDataTable('#investigation_details_table')) {
		$('#investigation_details_table').DataTable().destroy();
	}
	var investigation_table = $('#investigation_details_table').DataTable({
		"columnDefs": [
		               {"className": "dt-center", "targets": "_all"},
		               {
		            	   "orderDataType": "dom-text","type": "string",
		            	   "targets": 0, // Just the first column
		               },
		               {
		            	   "orderDataType": "dom-text-numeric",
		            	   "targets": 1, // Just the first column
		               },
		               ],
		               "language": {
		            	   "zeroRecords": "No data available"
		               },
	});
//	custom_rating_scheme_datatable();
	/* Create an array with the values of all the input boxes in a column */
	$.fn.dataTable.ext.order['dom-text'] = function  ( settings, col )
	{
		return this.api().column( col, {order:'index'} ).nodes().map( function ( td, i ) {
			return $('input', td).val();
		} );
	}
	/* Create an array with the values of all the input boxes in a column, parsed as numbers */
	$.fn.dataTable.ext.order['dom-text-numeric'] = function  ( settings, col )
	{
		return this.api().column( col, {order:'index'} ).nodes().map( function ( td, i ) {
			return $('input', td).val() * 1;
		} );
	}
}
//Function for adding empty row on clicking add button
$('#investigation_plus').click( function() {
	var counter
	$('#investigation_details_table').dataTable().fnAddData([
	                                                         '<input type="text" class="form-control input-large" id="R_' + counter + '_2" />',
	                                                         '<input type="text"  class="form-control input-large" id="R_' + counter + '_3" />',
	                                                         '<i class="nf nf-trash-o rating_row_delete"></i><input type="hidden" class="form-control input-small"  id="R_' + counter + '_4" />'
	                                                         ]);
	counter++;
	return false;
})
var data_row;
$('#corrective_action_table').on( 'click', '.rating_row_delete', function () {
	action_item_id=$(this).parents('tr').find('td:eq(3) input[type=hidden]').val();
	data_row = $(this).parents('tr')[0];
	if (action_item_id)
	{
		removeConfirmation('remove_action_item',action_item_id);
	}
	else { $('#corrective_action_table').dataTable().fnDeleteRow(data_row); };
});
