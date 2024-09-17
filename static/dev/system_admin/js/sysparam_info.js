var sysparam_details_table_id ='';
var drop_down_data = [];

$(document).ready(function () {
	$('select#module_name').select2({
		placeholder: 'Select Module',
		allowClear: true,
		minimumInputLength: 0,
	});
	$('select#sys_param_var_type').select2({
		placeholder: 'Select Parameter Type',
		allowClear: true,
		minimumInputLength: 0,
	});
	$('select#sysparam_name').select2({
		placeholder: 'Select Parameter Name',
		allowClear: true,
		minimumInputLength: 0,
	});
	// System Parameters detail data table load function
	sysparam_detail_table_function();

	$("#module_name").on('change',function(){ 
		var module_name = $(this).val();
		if (module_name != 0) {
			drop_down_data = [];
			drop_down_data.push({
				'module_name':module_name,
			});
			sysparam_fetch(drop_down_data, 'sysparam_type');
		} 
	});

	$("#sys_param_var_type").on('change',function(){ 
		var sysparam_type = $(this).val(),
		module_name = $("#module_name").val();
		if (module_name !=0 && sysparam_type !=0) {
			drop_down_data = [];
			drop_down_data.push({
				'module_name':module_name,
				'sysparam_type':sysparam_type,
			});
			sysparam_fetch(drop_down_data, 'sysparam_name');
		}
	});

	$("#sysparam_name").on('change',function(){ 
		var sysparam_name = $(this).val(),
		sysparam_type = $("#sys_param_var_type").val(),
		module_name = $("#module_name").val();
		if (sysparam_name !=0 && sysparam_name != null) {
			drop_down_data = [];
			drop_down_data.push({
				'module_name':module_name,
				'sysparam_type':sysparam_type,
				'sysparam_name':sysparam_name
			});
			sysparam_fetch(drop_down_data, 'sysparam_datas');
		} 
	});
});

//System parameter data fetching for onchange time
function sysparam_fetch(datas, action_name) {
	var currurl = window.location.href;
	var actionurl = currurl.replace('sysparam_details/','sysparam_data');
	$.ajax({
		url : actionurl,
		type : 'GET',
		timeout : 10000,
		async:false,
		data: {
			'datas':JSON.stringify(datas),
			action_name: action_name
		}
	}).done(function(json_data)	{
		var data = JSON.parse(json_data);
		html_str = '';
		if (data.status == "NTE_01") {
			if (action_name == 'sysparam_type') {
				$('#sys_param_var_type')[0].options.length = 0;
				var html_str = '<option></option>';
				for (var i=0; i<data.result.length; i++) {
					html_str += '<option value="'+data.result[i].sys_param_type+'">'+data.result[i].sys_param_type+'</option>';
				}
				$('#sys_param_var_type').append(html_str);
			} else if (action_name == 'sysparam_name') {
				$('#sysparam_name')[0].options.length = 0;
				var html_str = '<option></option>';
				for (var i=0; i<data.result.length; i++) {
					html_str += '<option value="'+data.result[i].sys_param_name+'">'+data.result[i].sys_param_name+'</option>';
				}
				$('#sysparam_name').append(html_str);
			} else if (action_name == 'sysparam_datas') {
				$("#sys_param_var_name").val(data.result[0].sys_param_var_name).trigger("change");
				$("#sys_param_val").val(data.result[0].sys_param_val).trigger("change");
				$("#sysparam_id").val(data.result[0].id).trigger("change");
			}
		} else {
			alert_lobibox("error", sysparam_datas_list[data.status]);
		}
	});
	return false  
}

function action_for_sysparam(action_name){ 
	if (action_name == "update") {  
		// Sysparam form updated function
		sysparam_data_management('update');  
		return false
	} else if (action_name == "clear") {
		// Sysparam form clear function 
		$("#module_name").val(null).trigger('change');   
		$('#sys_param_var_type')[0].options.length = 0;
		$('#sysparam_name')[0].options.length = 0;
		$('.error').html('') 
		form_inputs_clear('#sysparam_form');
	} else if (action_name == "cancel") {
		// Sysparam form cancel function
		$("#module_name").val(null).trigger('change');
		$('#sys_param_var_type')[0].options.length = 0;
		$('#sysparam_name')[0].options.length = 0;
		form_inputs_clear('#sysparam_form');
	}
}

//System parameter details datatable load function
function sysparam_detail_table_function(){
	var currurl = window.location.href;
	var actionurl = currurl.replace('sysparam_details/','sysparam_record/');
	columns = [{'title':'ID','name':'id'}, {'title':'No.','name':'row_number'}, 
	           {'title':'Module Name','name':'module_name'}, {'title':'System Parameter Name','name':'sys_param_name'}, {'title':'Variable Name','name':'sys_param_var_name'},
	           {'title':'Value','name':'sys_param_val'}, {'title':'System Parameter Type','name':'sys_param_type'}];
	$.ajax({
		url : actionurl,
		type : 'GET',
	}).done(function(json_data)	{
		var data = JSON.parse(json_data);
		var sysparam_list = []; 
		if (data.status == "NTE_01"){
			data = data.table_datas;
			$("#sysparam_table_tbody tr:gt(0)").remove(); 
			for (var i=0; i<data.length; i++){
				sysparam_list.push([data[i].id, data[i].row_number, data[i].module_name, data[i].sys_param_name, data[i].sys_param_var_name, data[i].sys_param_val, 
				                    data[i].sys_param_type]);
			}
			plaindatatable_btn('sysparam_table', sysparam_list, columns, 0);
		} else {
			alert_lobibox("error", sysparam_datas_list[data.status]);
		}
	});
	return false
}

//System parameter details table row click get id
$("#sysparam_table tbody").on("click", "tr", function() {    
	var currurl = window.location.href;
	var actionurl = currurl.replace('sysparam_details/','sysparam_record/');
	sysparam_details_table_id = $('#sysparam_table').dataTable().fnGetData(this)[0];
	$.ajax({
		url : actionurl,
		type : 'GET',
		data: {
			'sysparam_id':sysparam_details_table_id 
		}
	}).done(function(json_data)	{
		var temp = '';
		var data = JSON.parse(json_data);
		temp = data.table_datas;
		if (data.status == "NTE_01") {
			formData = temp.filter(data=> {return temp[0].sysparam_id==sysparam_details_table_id})[0];
			var $inputs = $('#sysparam_form :input');// get the form id value
			$inputs.each(function() {
				if (this.name in formData) {
						$("#"+this.name).val(formData[this.name]).trigger("change");
				} 
			});
		} else {
			alert_lobibox("error", sysparam_datas_list[data.status]);
		}
	});
});

//System parameter details data management function
function sysparam_data_management(func_name, event){
	var currurl = window.location.href;
	var actionurl = currurl.replace('sysparam_details/','sysparam_datainsert/');
	if(sysparam_form_validation()) {
		var datas = getFormValues("#sysparam_form");
		var	csrf_data = datas.csrfmiddlewaretoken;
		$.ajax({
			type  : 'POST',
			url   : actionurl,
			data: {
				'datas': JSON.stringify(datas),
				csrfmiddlewaretoken: csrf_data
			},
		}).done( function(jsondata) {
			var data = JSON.parse(jsondata);
			if (data.status == "NTE_03") {
				sysparam_detail_table_function();
				action_for_sysparam("clear");
				alert_lobibox("success", sysparam_datas_list[data.status]);
			} else {
				alert_lobibox("error", sysparam_datas_list[data.status]);
			}
		});
	}
}

// System parameter updation form validation
function sysparam_form_validation(){
	return $('#sysparam_form').valid();
}

$("#sysparam_form").validate({
	rules: {
		module_name:{
			valueNotEquals: true,
		},
		sys_param_var_type:{
			valueNotEquals: true,
		},
		sysparam_name:{
			valueNotEquals: true,
		},
		sys_param_var_name:{
			required:true
		},
		sys_param_val:{
			required:true
		},
	},
	//For custom messages
	messages: {
		module_name:{
			valueNotEquals:"Select Module Name",
		},
		sys_param_var_type:{
			valueNotEquals:"Select System Parameter Type",
		},
		sysparam_name:{
			valueNotEquals:"Select System Parameter Name",
		},
		sys_param_var_name:{
			required:"Enter System Parameter Variable Name",
		},
		sys_param_val:{
			required:"Enter System Parameter Variable Value",
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