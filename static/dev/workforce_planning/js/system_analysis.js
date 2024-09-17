//04-JUL-2018 || KAV || Resource Request - On Ready Functions
var team_id = '';
var role_id = '';
var priority_id  = '';
var priority_name ='';
var resource_request_priority_id= '';
var json_data_table = '';
var resourcecost_avail = '';
var resourcecount_avail = '';
var resourcecost_need = '';
var resourcecount_need = '';
var grade_resourcecount = '';
var role_title = '';
var sys_step3_columns = [{"title":"No."}, {"title":"Department/Team"}, {"title":"Position"}, {"title":"Grade"},  {"title":"Resource Need"}, {"title":"Priority"}];
$(document).ready(function(){
	$("#wfp_sys_org").select2({
		placeholder: "-Select Organization-",
		width: '100%',
	});
	$("#wfp_sys_org_unit").select2({
		placeholder: "-Select Org. Unit-",
		width: '100%',
	});
	$("#sys_asr_team").select2({
		placeholder: "-Select Team-",
		width: '100%',
	});
	$("#sys_asr_role").select2({
		placeholder: "-Select Role-",
		width: '100%',
	});
	$("#sys_asr_grade").select2({
		placeholder: "-Select Grade-",
		width: '100%',
	});
	$("#sys_asr_req_type").select2({
		placeholder: "-Select Requirement Type-",
		width: '100%',
	});
	$("#sys_asr_req_reason").select2({
		placeholder: "-Select Requirement Reason-",
		width: '100%',
	});
	$("#wfp_bar_sel_role").select2({
		placeholder: "-Select Role-",
		width: '100%',
	});
	$("#wfp_bar_multisel_role").select2({
		placeholder:"-Select Roles-",
		width: '100%',
	});
	$("#wfp_bar_grade").select2({
		placeholder:"-Select Grade-",
		width: '100%',
	});
	$("#sys_asr_role").prop('disabled', true);
	$("#sys_asr_grade").prop('disabled', true);
	$("#sys_asr_req_type").prop('disabled', true);
	$("#sys_asr_req_reason").prop('disabled', true);
	$('#acc_main').html('<h3 class="no-data">No data available</h3>');
	sytem_step3_table=$('#sytem_step3_table').DataTable();
	sytem_step3_table.clear().draw();
	$("#sytem_step3_table").DataTable().destroy();
	empty_datatable('sytem_step3_table',[]);
	sytem_step4_table=$('#sytem_step4_table').DataTable();
	sytem_step4_table.clear().draw();
	$("#sytem_step4_table").DataTable().destroy();
	empty_datatable('sytem_step4_table',[]);

});
//04-JUL-2018 || KAV || Sytem Analysis  Details form validation
function sys_step2_form_validation(){
	return $('#sys_step2_details').valid();
}
$("#sys_step2_details").validate({
	rules: {
		sys_asr_analysis_details:{
			required:true,
		},
	},
	//For custom messages
	messages: {
		sys_asr_analysis_details:{
			required:"Enter Valid Analysed Details",
		},
	},
	errorElement: 'div',
	errorPlacement: function(error, element) {
		var placement = $(element).data('error');
		if (placement) {
			$(placement).append(error);
		} else {
			error.insertAfter(element);
		}
	}
});

//31-JUL-2018 || KAV || View System Analysis Organization - On select function
function wfp_sys_org_change_view(org_id)
{
	$.ajax({
		type: 'POST',
		url: '/resreq_get_org_unit_list/',
		timeout : 10000,
		data: {
			'org_id': org_id,
		},
		async: false,
	}).done(function(json_data){
		data = JSON.parse(json_data);
		if (data.resreq_org_unit != undefined){
			if (data.resreq_org_unit.length > 0){
				$('#wfp_sys_org_unit').prop("disabled",false);
				for(i=0;i<data.resreq_org_unit.length;i++)
				{
					$('#wfp_sys_org_unit').append($('<option>',{
						value:data.resreq_org_unit[i].id,
						text:data.resreq_org_unit[i].orgunit_name
					}))
				}
			} else {
				$('#wfp_sys_org_unit').prop("disabled",true);
				alert_lobibox("warning","Please select an organization with at least one Org. Unit");
			}
		}
	});
}
//19-JUL-2018 || KAV || Org.Unit Change Function - Click Function
$("#wfp_sys_org_unit").change(function(){
	var org_id = $("#wfp_sys_org").val();
	var org_unit_id = $("#wfp_sys_org_unit").val();
	wfp_syst_step1_acc_load(org_id,org_unit_id);
	wfp_step2_team_name(org_id,org_unit_id);
	wfp_step3_details(org_id,org_unit_id);
	wfp_step4_detail_table_function(org_id,org_unit_id);
	wfp_step5_summarized_report(org_id,org_unit_id);

});

//22-AUG-2018 || KAV || View System Analysis Organization - Tab1 On select function
$("#SYST1").click(function(){
	var org_id = $("#wfp_sys_org").val();
	var org_unit_id = $("#wfp_sys_org_unit").val();
	wfp_syst_step1_acc_load(org_id,org_unit_id);
});

//22-AUG-2018 || KAV || View System Analysis Organization - Tab2 On select function
$("#SYST2").click(function(){
	var org_id = $("#wfp_sys_org").val();
	var org_unit_id = $("#wfp_sys_org_unit").val();
	wfp_step2_team_name(org_id,org_unit_id);
});

//22-AUG-2018 || KAV || View System Analysis Organization - Tab3 On select function
$("#SYST3").click(function(){
	var org_id = $("#wfp_sys_org").val();
	var org_unit_id = $("#wfp_sys_org_unit").val();
	wfp_step3_details(org_id,org_unit_id);
});

//22-AUG-2018 || KAV || View System Analysis Organization - Tab4 On select function
$("#SYST4").click(function(){
	var org_id = $("#wfp_sys_org").val();
	var org_unit_id = $("#wfp_sys_org_unit").val();
	wfp_step3_details(org_id,org_unit_id);
});

//22-AUG-2018 || KAV || View System Analysis Organization - Tab5 On select function And Map Function
var map_flag = true;
$("#SYST5").click(function(){
	setTimeout(function(){
		if(map_flag){
			map_dashbaord();
			map_flag = false;
		}
	}, 200);
	var org_id = $("#wfp_sys_org").val();
	var org_unit_id = $("#wfp_sys_org_unit").val();
	wfp_step5_summarized_report(org_id,org_unit_id)

});

//31-JUL-2018 || KAV || Step 2 - Fetch Team name  Function
function wfp_step2_team_name(org_id,org_unit_id)
{
	var text = "system_step2";
	$.ajax({
		url:"/wfp_syst_step2_details/",
		type:"POST",
		timeout : 10000,
		data:
		{
			'text':text,
			'org_id':org_id,
			'org_unit_id':org_unit_id,
		}
	}).done(function(json_data){
		var json_data = JSON.parse(json_data);
		$('#sys_asr_team').empty();
		if (json_data.team_name_details != undefined){
			if(json_data.team_name_details.length > 0){
				for(var i=0;i<json_data.team_name_details.length;i++){
					$('#sys_asr_team').append($('<option>',{
						value:json_data.team_name_details[i].id,
						text:json_data.team_name_details[i].team_name
					}))}
			}
		}
		$('#sys_asr_team').val(null).trigger("change");
	});
}

//18-JUL-2018 || SMI || Step 1 - Accordion Load Function
function wfp_syst_step1_acc_load(org_id,org_unit_id){
	$('#acc_main').html('');
	if (org_id != '' && org_unit_id != ''){
		$.ajax({
			url:"/wfp_syst_step1_details/",
			type:"POST",
			timeout : 10000,
			data:
			{
				'org_id':org_id,
				'org_unit_id':org_unit_id,
			}
		}).done(function(json_data){
			var json_data = JSON.parse(json_data);
			var strAppend='';
			if (json_data.resreq_team_role_details.length == 0){
				strAppend+='<h3 class="no-data">No data available</h3>';
			} else {
				var data = json_data.resreq_team_role_details;
				for(var i=0; i<data.length; i++){
					strAppend+='<div class="panel panel-default">';
					strAppend+='<div class="panel-heading">';
					strAppend+='<h4 class="panel-title">';
					if(i==0){
						strAppend+='<a class="accordion-toggle accordion-toggle-styled" data-toggle="collapse" data-parent="#acc_main" href="#acc_role_'+i+'">'+data[i].team_name+'</a>';
					} else {
						strAppend+='<a class="accordion-toggle accordion-toggle-styled collapsed" data-toggle="collapse" data-parent="#acc_main" href="#acc_role_'+i+'">'+data[i].team_name+'</a>';
					}
					strAppend+='</h4></div>';
					if(i==0){
						strAppend+='<div id="acc_role_'+i+'" class="panel-collapse in">';
					} else {
						strAppend+='<div id="acc_role_'+i+'" class="panel-collapse collapse">';
					}
					strAppend+='<div class="panel-body">';
					strAppend+='<div class="panel-group accordion" id="acc_role_'+i+'_main">';
					for(j=0; j<data[i].role_name.length; j++){
						strAppend+='<div class="panel panel-default">';
						strAppend+='<div class="panel-heading">';
						strAppend+='<h4 class="panel-title">';
						strAppend+='<a class="accordion-toggle accordion-toggle-styled collapsed" data-toggle="collapse" data-parent="#acc_role_'+i+'_main" href="#acc_role_'+i+'_sub_'+j+'">'+data[i].role_name[j]+' </a>';
						strAppend+='</h4></div>';
						strAppend+='<div id="acc_role_'+i+'_sub_'+j+'" class="panel-collapse collapse">';
						strAppend+='<div class="panel-body">';
						strAppend+='<p><b>Requested Reason : </b>'+data[i].request_reason[j]+'</p>';
						strAppend+='<p><b>Requested By : </b>'+data[i].requested_by_ids[j]+'</p>';
						strAppend+='<p><b>Requested On : </b>'+data[i].requested_on[j]+'</p>';
						strAppend+='<p><b>Requirement Type : </b>'+data[i].requirement_type_ids[j]+'</p>';
						strAppend+='<p><b>Resource Count : </b>'+data[i].requirement_count[j]+'</p>';
						strAppend+='<p><b>Grade : </b>'+data[i].grade[j]+'</p>';
						strAppend+='</div></div></div>';
					}
					strAppend+='</div></div></div></div>';
				}
			}
			$('#acc_main').html(strAppend);
		});
	} else {
		$('#acc_main').html('<h3 class="no-data">No data available</h3>');
	}
}

//23-JUL-2018 || KAV || Step 2 - System Analysis Team Select function
$("#sys_asr_team").change(function(){
	var text = "team";
	team_id  = $("#sys_asr_team").val();
	$.ajax({
		url:"/wfp_syst_step2_details/",
		type:"POST",
		timeout : 10000,
		data:{
			'team_id':team_id,
			'text':text,
		},
	}).done(function(json_data){

		var json_data = JSON.parse(json_data);

		$('#sys_asr_role').empty();
		if (json_data.resreq_role_details != undefined){
			if(json_data.resreq_role_details.length > 0)
			{
				$("#sys_asr_role").prop('disabled', false);
				for(var i=0;i<json_data.resreq_role_details.length;i++)
				{
					$('#sys_asr_role').append($('<option>',{
						value:json_data.resreq_role_details[i].role_id,
						text:json_data.resreq_role_details[i].role_title
					}))
				}
			} else {
				$('#sys_asr_role').prop("disabled",true);
				alert_lobibox("warning","Please select an organization with at least one Org. Unit");
			}
		}
		$('#sys_asr_role').val(null).trigger("change");
	});
});

//23-JUL-2018 || KAV || Step 2 - System Analysis Role Select function
$("#sys_asr_role").change(function(){
	var text = "role";
	role_id  = $("#sys_asr_role").val();
	$.ajax({
		url:"/wfp_syst_step2_details/",
		type:"POST",
		timeout : 10000,
		data:{
			'role_id':role_id,
			'text':text,
			'team_id':team_id,
		},
	}).done(function(json_data){
		resreq_grade_change_view(role_id)
		var json_data = JSON.parse(json_data);
		if(json_data.wfp_syst_step2_details != undefined)
		{
			if(json_data.wfp_syst_step2_details.length > 0)
			{
				for(var i=0;i<json_data.wfp_syst_step2_details.length;i++)
				{
					$('#sys_asr_req_by').val(json_data.wfp_syst_step2_details[i].created_by_id);
					$("#sys_asr_grade").val(json_data.wfp_syst_step2_details[i].resource_request_grade_id).trigger("change");
					$("#sys_asr_req_reason").val(json_data.wfp_syst_step2_details[i].resource_request_request_reason_id).trigger("change");
					$("#sys_asr_res_count").val(json_data.wfp_syst_step2_details[i].resource_request_count);
					$("#sys_asr_req_type").val(json_data.wfp_syst_step2_details[i].resource_request_requirement_type_id).trigger("change");
					$("#sys_asr_analysis_details").val(json_data.wfp_syst_step2_details[i].resource_request_analysis_details);
					$("#sys_asr_req_on").val(json_data.wfp_syst_step2_details[i].requested_on);
				}
			}
		}
	});
});

//23-JUL-2018 || KAV || Step 2 - System Analysis Save function
function sys_step2_save()
{
	if (sys_step2_form_validation()){
		var text = "save";
		var status =  $('input[type=radio][name=sys_analy_status]:checked').val();
		var analyzed_details = $("#sys_asr_analysis_details").val();
		var update_team_id = $("#sys_asr_team").val();
		var update_role_id = $("#sys_asr_role").val();
		var update_grade_id = $("#sys_asr_grade").val();
		var update_res_type_id = $("#sys_asr_req_type").val();
		$.ajax({
			url:"/wfp_syst_step2_details/",
			type:"POST",
			timeout:10000,
			data:{
				'analyzed_details':analyzed_details,
				'text':text,
				'update_team_id':update_team_id,
				'update_role_id':update_role_id,
				'update_grade_id':update_grade_id,
				'update_res_type_id':update_res_type_id,
				'status':status,
			}
		}).done(function(json_data){
			json_data = JSON.parse(json_data);
			if(json_data.status == 'NTE_03'){
				alert_lobibox("success", sysparam_datas_list[json_data.status]);  
				sys_cancel_clear();
			}
			else {
				alert_lobibox("error", sysparam_datas_list[json_data.status]);
			}
			$("#sys_asr_role").prop('disabled', true);
		});
	}
}

//23-JUL-2018 || KAV || Step 3 - System Analysis Table Detail function
function wfp_step3_details(org_id,org_unit_id){
	var strAppend ='';
	strAppend += '<div class="form-group">';
	strAppend += '<select class="sys_step3_priority" name="sys_step3_priority" class="form-control select2 hide_error" required="required" data-error=".errorTxt4">';
	strAppend += '<option value="0">-Select-</option>';
	$.ajax({
		url:"/wfp_syst_step3_details/",
		type:"POST",
		data:
		{
			'org_id':org_id,
			'org_unit_id':org_unit_id,
		},
		timeout:10000,
	}).done(function(json_data){
		json_data = JSON.parse(json_data);
		$("#sytem_step3_table").dataTable().fnDestroy();
		$("#sytem_step3_table").empty();
		var data_list = [];
		if(json_data.step3_details.length>0){
			json_data_table = json_data.step3_details
			for(var i=0;i<json_data['ref_priority_id'].length;i++)
			{
				priority_id = json_data['ref_priority_id'][i].id
				priority_name = json_data['ref_priority_id'][i].refitems_name
				strAppend += '<option value="'+priority_id+'" > '+priority_name+' </option>'
			}
			strAppend += '</select><span class="errorTxt4 error val_message"></span> </div>';
			priority_list = [];
			for(var i=0;i<json_data.step3_details.length;i++)
			{   
				data_list.push([i+1,json_data.step3_details[i].name, json_data.step3_details[i].role_title,json_data.step3_details[i].grade,
				                json_data.step3_details[i].resource_request_count,strAppend]);
				priority_list.push(json_data.step3_details[i].resource_request_priority_id);
			}
			wfp_editable_datatable('sytem_step3_table', data_list, '', sys_step3_columns)
			for(i=0;i<priority_list.length;i++){
				if(priority_list[i] != null){
					$(".sys_step3_priority:eq("+i+")").val(priority_list[i]);
				} else {
					$(".sys_step3_priority:eq("+i+")").val('0');
				}
			}
		}
		else{
			wfp_editable_datatable('sytem_step3_table', data_list, '', sys_step3_columns)
		}
	});
}

//23-JUL-2018 || KAV || Step 2 - System Analysis Cancel / Clear function
function sys_cancel_clear()
{
	$("#sys_asr_team").val(null).trigger("change");
	$("#sys_asr_role").val(null).trigger("change");
	$("#sys_asr_req_type").val(null).trigger("change");
	$("input[name='sys_analy_status'][value='Approved']").prop('checked', true);
	$('#sys_step2_details :input').val('');
}

//23-JUL-2018 || KAV || Step 2 - System Analysis Cancel / Clear form confirmation function
function sys_cancel_clear_confirm(func_name,action_name) {
	var sys_asr_res_count = $("#sys_asr_res_count").val();
	var sys_asr_req_by = $("#sys_asr_req_by").val();
	var sys_asr_req_on = $("#sys_asr_req_on").val();
	var sys_asr_req_reason = $("#sys_asr_req_reason").val();
	var sys_asr_analysis_details = $("#sys_asr_analysis_details").val();
	var status_approved = $("#status_approved").val();
	var status_rejected = $("#status_rejected").val();

	if ( sys_asr_res_count != '' || sys_asr_req_by != '' ||  sys_asr_req_on != ""
		|| sys_asr_req_reason != "" || sys_asr_analysis_details != "" || status_approved != ""  || status_rejected != "" ){
		swal ({
			title: "Are you sure, you want to cancel?",
			type: "warning",
			showCancelButton: true,
			confirmButtonClass: "btn btn-success btn-eql-wid btn-animate pull-left",
			cancelButtonClass: "btn btn-danger btn-eql-wid btn-animate pull-right",
			confirmButtonText: "Yes",
			cancelButtonText: "No",
			showConfirmButton : true,
			closeOnConfirm: true,
			closeOnCancel: true
		},
		function(isConfirm) {
			if (isConfirm) {
				if (action_name) {
					window[func_name](action_name);
				} else {
					window[func_name]();
				}
			}
		});
	} else {
		sys_cancel_clear();
	}
}

//23-JUL-2018 || KAV || Step 3 - System Analysis Table Detail Save function
function sys_step3_save()
{
	var table_id = [];
	for(var i=0;i<json_data_table.length;i++)
	{   
		table_id.push( json_data_table[i].id);
	}
	var priority_select_len = $(".sys_step3_priority").length;
	var priority_id = [];
	for(i=0;i<priority_select_len;i++){
		priority_id_sel = $(".sys_step3_priority:eq("+i+")").val()
		priority_id.push(priority_id_sel);
	}
	$.ajax({
		url: '/sys_step3_save_form/',
		type: 'POST',
		timeout: 10000,
		data: {
			'table_id': JSON.stringify(table_id),
			'priority_id_sel':JSON.stringify(priority_id),
		},
		async: false,
	}).done(function(json_data){
		var json_data = JSON.parse(json_data);
		if(json_data.status == 'NTE_03'){
			alert_lobibox("success", sysparam_datas_list[json_data.status]);  
		}
		else {
			alert_lobibox("error", sysparam_datas_list[json_data.status]);
		}
	});
}

//18-Jul-2018 || KAV ||System Analysis Step4 Priority/Criteria View Datatable load function
function wfp_step4_detail_table_function(org_id,org_unit_id){
	var strAppend ='';
	strAppend += '<div class="form-group">';
	strAppend += '<select class="sys_step4_priority" name="sys_step4_priority" class="form-control select2 hide_error" required="required" data-error=".errorTxt4">';
	strAppend += '<option value="0">-Select-</option>';
	$.ajax({
		url:"/wfp_syst_step3_details/",
		type:"POST",
		data:
		{
			'org_id':org_id,
			'org_unit_id':org_unit_id,
		},
		timeout:10000,
	}).done(function(json_data){
		json_data = JSON.parse(json_data);
		$("#sytem_step4_table").dataTable().fnDestroy();
		$("#sytem_step4_table").empty();
		var data_list = [];
		if(json_data.step3_details.length>0){
			json_data_table = json_data.step3_details
			for(var i=0;i<json_data['ref_priority_id'].length;i++)
			{
				priority_id = json_data['ref_priority_id'][i].id
				priority_name = json_data['ref_priority_id'][i].refitems_name
				strAppend += '<option value="'+priority_id+'" > '+priority_name+' </option>'
			}
			strAppend += '</select><span class="errorTxt4 error val_message"></span> </div>';
			priority_list = [];
			for(var i=0;i<json_data.step3_details.length;i++)
			{   
				data_list.push([i+1,json_data.step3_details[i].name, json_data.step3_details[i].role_title,json_data.step3_details[i].grade,
				                json_data.step3_details[i].resource_request_count,strAppend]);
				priority_list.push(json_data.step3_details[i].resource_request_priority_id);
			}
			wfp_editable_datatable('sytem_step4_table', data_list, '', sys_step3_columns)
			for(i=0;i<priority_list.length;i++){
				if(priority_list[i] != null){
					$(".sys_step4_priority:eq("+i+")").val(priority_list[i]);
				} else {
					$(".sys_step4_priority:eq("+i+")").val('0');
				}
			}
		}
		else{
			wfp_editable_datatable('sytem_step4_table', data_list, '', sys_step3_columns)
		}
	});
	$('.sys_step4_priority').prop('disabled',true);
}

//07-AUG-2018 || KAV || Grade Option Append - On select function
function resreq_grade_change_view(role_id)
{
	$.ajax({
		type: 'POST',
		url: '/fetch_grade_details/',
		timeout : 10000,
		data: {
			'role_id': role_id,
		},
		async: false,
	}).done(function(json_data){
		json_data = JSON.parse(json_data);
		$('#sys_asr_grade').empty();
		if (json_data.grade_details_headers != undefined){
			if(json_data.grade_details_headers.length > 0)
			{
				for(var i=0;i<json_data.grade_details_headers.length;i++)
				{
					$('#sys_asr_grade').append($('<option>',{
						value:json_data.grade_details_headers[i].id,
						text:json_data.grade_details_headers[i].refitems_name
					}))
				}
			}
		}
		$('#sys_asr_grade').val(null).trigger("change");
	});
}

//30-JUL-2018 || KAV || Step 5 - Donut Chart Data Load Function
function wfp_step5_summarized_report(org_id,org_unit_id){
	$.ajax({
		url : '/wfp_system_step5_piechart_details/',
		type : 'POST',
		timeout : 10000,
		data: {
			'org_id': org_id,
			'org_unit_id': org_unit_id,
		},
		async: false,
	}).done(function(json_data){
		var json_data = JSON.parse(json_data);
		if(json_data != undefined){
			for(var i=0;i<json_data.system_donut_chart_data.length;i++){
				if (json_data.system_donut_chart_data[i].minrange != null && json_data.system_donut_chart_data[i].midrange != null &&json_data.system_donut_chart_data[i].maxrange != null){
					minrange = json_data.system_donut_chart_data[i].minrange
					midrange = json_data.system_donut_chart_data[i].midrange
					maxrange = json_data.system_donut_chart_data[i].maxrange
					system_donut_chart_data = [{
						"title": "0 to 5k",
						"value": minrange,
						"color": "#53c6fa",
						"pullOut": true
					}, {
						"title": "6k to 10k",
						"value": midrange,
						"color": "#d97df0",
					}, {
						"title": "Above 10k",
						"value":  maxrange,
						"color": "#fcaa7d"
					}];
					var system_donut_chart = AmCharts.makeChart("system_donut_chart", {
						"type": "pie",
						"fontFamily": "'Poppins', sans-serif",
						"theme": "light",
						"outlineColor": "",
						"color": "#000",
						"colorField": "color",
						"legend": {
							"equalWidths": false,
							"position": "top",
							"valueAlign": "right",
							"align": "right",
							"valueText": "",
							"color": "#000",
							"valueWidth": 100
						},
						"dataProvider": system_donut_chart_data,
						"titleField": "title",
						"valueField": "value",
						"pulledField": "pullOut",
						"radius": "42%",
						"innerRadius": "60%",
						"labelText": "[[title]]",
						"export": {
							"enabled": false
						}
					});
					system_donut_chart.addListener("clickSlice", handleClick);
				}

				else{
					$("#system_donut_chart").html('<h3 class="no-data">No data available</h3>');
					$('#wfp_bar_sel_role').empty();
					$('#wfp_bar_sel_role').prop("disabled",true);
					$('#wfp_bar_multisel_role').empty();
					$('#wfp_bar_multisel_role').prop("disabled",true);
				}
			}
		}
	});
	$('#wfp_bar_multisel_role').empty();
	$('#wfp_bar_multisel_role').prop("disabled",false);
	$('#wfp_bar_multisel_role').empty().append($('<option>',{
		value:'0',
		text:'-Select Roles-',
		hidden:'hidden',
		selected:'selected',
		disabled:'disabled'
	}));
	$.ajax({
		url : '/wfp_sysstep5_fetch_multirole_details/',
		type : 'POST',
		timeout : 10000,
		data: {
			'org_id': org_id,
			'org_unit_id': org_unit_id,
		},
		async: false,
	}).done(function(json_data){
		var json_data = JSON.parse(json_data);
		for(i=0;i<json_data.role_details.length;i++)
		{
			$('#wfp_bar_multisel_role').append($('<option>',{
				value:json_data.role_details[i].role_id,
				text:json_data.role_details[i].role_title,
			}))
		}
	});
	$('#wfp_bar_multisel_role').prop("disabled", false);
	var first5_roles = $('#wfp_bar_multisel_role').val($('#wfp_bar_multisel_role option:first').val());
	if (first5_roles["0"].length < 6) {
		var len = first5_roles["0"].length - 1;
	} else {
		var len = 5;
	}
	var first5_roles_list = [];
	for(var i=1; i<=len; i++){
		first5_roles_list.push(first5_roles["0"][i].value);
	}
	$("#wfp_bar_multisel_role").val(first5_roles_list).trigger("change");
	$('#wfp_bar_grade').prop("disabled", false);
	var first5_roles = $('#wfp_bar_grade').val($('#wfp_bar_grade option:first').val());
	var first5_roles_list = [];
	for(var i=1; i<=5; i++){
		first5_roles_list.push(first5_roles["0"][i].value);
	}
	$("#wfp_bar_grade").val(first5_roles_list).trigger("change");

	handleClick("0 to 5k");
}
//31-JUL-2018 || KAV || Step 5 - Donut Chart Slice Click Function
function handleClick(event)
{
	var org_id = $('#wfp_sys_org').val();
	var org_unit_id = $('#wfp_sys_org_unit').val();
	if(event != "0 to 5k"){
		var system_donut_chart_title = event.dataItem.dataContext.title;
	} else {

		var system_donut_chart_title = event;
	}
	$('#wfp_bar_sel_role').empty();
	$('#wfp_bar_sel_role').prop("disabled",false);
	$.ajax({
		url : '/wfp_system_step5_chart_click/',
		type : 'POST',
		timeout : 10000,
		data: {
			'org_id': org_id,
			'org_unit_id': org_unit_id,
			'system_donut_chart_title': system_donut_chart_title,
		},
		async: false,
	}).done(function(json_data){
		var json_data = JSON.parse(json_data);
		if(json_data != undefined){
			for(i=0;i<json_data.data.length;i++)
			{
				$('#wfp_bar_sel_role').append($('<option>',{
					value:json_data.data[i].id,
					text:json_data.data[i].role_title,
				}))
			}
			if(event != "0 to 5k"){
				$('#wfp_bar_sel_role').val(null).trigger("change");
			} else {
				$('#wfp_bar_sel_role').val($('#wfp_bar_sel_role option:first-child').val()).trigger("change");
			}
		}
	});
}
//22-AUG-2018 || KAV || Step 5 - Role Select and Bar Chart Data Load Function
function get_role_val_bar(role_id){
	var text = 'single_role'
		if(role_id != null){
			var org_id = $('#wfp_sys_org').val();
			var org_unit_id = $('#wfp_sys_org_unit').val();
			$.ajax({
				url : '/wfp_system_step5_role_sel/',
				type : 'POST',
				timeout : 10000,
				data: {
					'org_id': org_id,
					'org_unit_id': org_unit_id,
					'role_id': role_id,
					'text':text,
				},
				async: false,
			}).done(function(json_data){
				var json_data = JSON.parse(json_data);
				if(json_data.data.length != undefined){
					if(json_data.data[0] != undefined){
						var system_bar_chart_data = [{
							"label": "Existing Resources",
							"count": json_data.data[0].available_cost,
							"color": "#53c6fa",
							"pullOut": true
						}, {
							"label": "Required Resources",
							"count": json_data.data[0].required_cost,
							"color": "#d97df0"
						}];
						AmCharts.makeChart("wpf_system_bar_chart", {
							"type": "serial",
							"fontFamily": "'Poppins', sans-serif",
							"theme": "light",
							"marginRight": 70,
							"dataProvider": system_bar_chart_data,
							"valueAxes": [{
								"axisAlpha": 0,
								"position": "left",
								"title": "Cost"
							}],
							"startDuration": 1,
							"graphs": [{
								"balloonText": "<b>[[category]]: [[value]]</b>",
								"fillColorsField": "color",
								"fillAlphas": 0.9,
								"lineAlpha": 0.2,
								"type": "column",
								"valueField": "count"
							}],
							"categoryField": "label",
							"categoryAxis": {
								"gridPosition": "start",
								"autoWrap": true
							},
							"export": {
								"enabled": false
							}
						});
					}
					else
					{
						$("#wpf_system_bar_chart").html('<h3 class="no-data">No data available</h3>');
					}
				}
				else{
					$("#wpf_system_bar_chart").html('<h3 class="no-data">No data available</h3>');
				}
			});

		} else{
			$("#wpf_system_bar_chart").html('<h3 class="no-data">No data available</h3>');
		}
}

//22-AUG-2018 || KAV || Step 5 - MultiRole Select and Bar Chart Data Load Function
$("#wfp_bar_multisel_role").change(function(){
	var first5_roles = $('#wfp_bar_multisel_role').val();
	var text = "multi_role"
		if(first5_roles != null)
		{
			var first5_roles_list = [];
			for(var i=1; i<=5; i++){
				var result = JSON.stringify(first5_roles)
			}
			var org_id = $('#wfp_sys_org').val();
			var org_unit_id = $('#wfp_sys_org_unit').val();
			$.ajax({
				url : '/wfp_system_step5_role_sel/',
				type : 'POST',
				timeout : 10000,
				data: {
					'org_id': org_id,    
					'org_unit_id': org_unit_id,
					'multi_role_id': result,
					'text':text,
				},
				async: false,
			}).done(function(json_data){
				var json_data = JSON.parse(json_data);
				var chartData = [];
				if(json_data.data.length != undefined){
					for(var i=0; i<json_data.data.length; i++){
						if(json_data.data[i] != undefined){
							var dt = {};
							dt = {
									"role": json_data.data[i].role_title,
									"available": json_data.data[i].available_count,
									"required": json_data.data[i].required_count
							};
							chartData.push(dt);

							AmCharts.makeChart("wpf_system_bar_chart_multi", {
								"type": "serial",
								"fontFamily": "'Poppins', sans-serif",
								"theme": "light",
								"categoryField": "role",
								"rotate": false,
								"startDuration": 1,
								"categoryAxis": {
									"gridPosition": "start",
									"autoWrap": true
								},
								"trendLines": [],
								"graphs": [{
									"balloonText": "Available Resources:[[value]]",
									"fillAlphas": 0.8,
									"id": "AmGraph-1",
									"lineAlpha": 0.2,
									"title": "Available Resources",
									"type": "column",
									"valueField": "available",
									"fillColors": "#53c6fa"
								},
								{
									"balloonText": "Required Resources:[[value]]",
									"fillAlphas": 0.8,
									"id": "AmGraph-4",
									"lineAlpha": 0.2,
									"title": "Required Resources",
									"type": "column",
									"valueField": "required",
									"fillColors": "#d97df0"
								}
								],
								"guides": [],
								"valueAxes": [{
									"axisAlpha": 0,
									"position": "left",
									"title": "Resources"
								}],
								"allLabels": [],
								"balloon": {},
								"titles": [],
								"dataProvider": chartData,
								"export": {
									"enabled": false
								}
							});}

						else{
							$("#wpf_system_bar_chart_multi").html('<h3 class="no-data">No data available</h3>');
						}}}
				else{
					$("#wpf_system_bar_chart_grade").html('<h3 class="no-data">No data available</h3>');
				}
			});}
		else{
			$("#wpf_system_bar_chart_multi").html('<h3 class="no-data">No data available</h3>');
		}
});

//22-AUG-2018 || KAV || Step 5 - MultiGrade Select and Bar Chart Data Load Function
$("#wfp_bar_grade").change(function(){
	var grade_val = $('#wfp_bar_grade').val();
	var text = "grade"
		if(grade_val != null)
		{
			for(var i=1; i<=5; i++){
				var garde_result = JSON.stringify(grade_val)
			}
			var org_id = $('#wfp_sys_org').val();
			var org_unit_id = $('#wfp_sys_org_unit').val();
			$.ajax({
				url : '/wfp_system_step5_role_sel/',
				type : 'POST',
				timeout : 10000,
				data: {
					'org_id': org_id,    
					'org_unit_id': org_unit_id,
					'garde_id': garde_result,
					'text':text,
				},
				async: false,
			}).done(function(json_data){
				var json_data = JSON.parse(json_data);
				var system_grade_chart_data = [];
				if(json_data.rescount_details.length != undefined){
					for(var i=0;i<json_data.rescount_details.length;i++){
						if(json_data.rescount_details[i] != undefined){
							system_grade_chart_data.push({
								"label": json_data.rescount_details[i].grade,
								"count": json_data.rescount_details[i].resource_request_count,
								"color": "#53c6fa"
							})    
							AmCharts.makeChart("wpf_system_bar_chart_grade", {
								"type": "serial",
								"fontFamily": "'Poppins', sans-serif",
								"theme": "light",
								"marginRight": 70,
								"dataProvider": system_grade_chart_data,
								"valueAxes": [{
									"axisAlpha": 0,
									"position": "left",
									"title": "Resources"
								}],
								"startDuration": 1,
								"graphs": [{
									"balloonText": "<b>[[category]]: [[value]]</b>",
									"fillColorsField": "color",
									"fillAlphas": 0.9,
									"lineAlpha": 0.2,
									"type": "column",
									"valueField": "count"
								}],
								"categoryField": "label",
								"categoryAxis": {
									"gridPosition": "start",
									"autoWrap": true
								},
								"export": {
									"enabled": false
								}
							});}
						else{
							$("#wpf_system_bar_chart_grade").html('<h3 class="no-data">No data available</h3>');
						}}}
				else{
					$("#wpf_system_bar_chart_grade").html('<h3 class="no-data">No data available</h3>');
				}
			});
		}else{
			$("#wpf_system_bar_chart_grade").html('<h3 class="no-data">No data available</h3>');
		}
});
