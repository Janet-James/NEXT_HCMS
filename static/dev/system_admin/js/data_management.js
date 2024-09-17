$(document).ready(function () {
	$('select#module_name').select2({
		placeholder: 'Select Module',
		allowClear: true,
		minimumInputLength: 0,
	});
	$('select#class_name').select2({
		placeholder: 'Select Table',
		allowClear: true,
		minimumInputLength: 0,
	});
	$('select#fileds_name').select2({
		placeholder: 'Select Field',
		allowClear: true,
		minimumInputLength: 0,
	});
	// Module name onchnage event for table name fetching	
	$("#module_name").on('change',function(){ 
		if ($(this).val() != null && $(this).val() != '') {
			var module_name = $(this).val();
			class_name_fetch(module_name);
		} else {
			$("#class_name").val(null).trigger('change');
		}
	});

	// Class name onchnage event for fileds name fetching
	$("#class_name").on('change',function(){ 
		if ($(this).val() != null && $(this).val() != '') {
			var module_name = $("#module_name").val();
			var class_name = $(this).find("option:selected").text();
			fields_name_fetch(module_name, class_name);
		} else {
			$("#fileds_name").val(null).trigger('change');
		}
	});
});

function action_for_query_execution(action_name) {
	if (action_name == "execute_query") {
		// Data management File upload add function
		data_management();
		return false
	} else if (action_name == "clear") {
		$("#module_name").val(null).trigger('change');
		$('#class_name')[0].options.length = 0;
		$('#fileds_name')[0].options.length = 0;
	}
}

//Class name fetching function
function class_name_fetch(module_name) {
	var currurl = window.location.href;
	var actionurl = currurl.replace('data_mgt_details/','data_mgt_classname/');
	$.ajax({
		url : actionurl,
		type : 'GET',
		timeout : 10000,
		async:false,
		data: {
			'module_name':module_name
		}
	}).done(function(json_data)	{
		var data = JSON.parse(json_data);
		class_data = data.class_namelist;
		if (data.status == "NTE_01") {
			$('#class_name')[0].options.length = 0;
			var class_str = '<option></option>';
			if (class_data.length > 0){
				for (var i=0; i<class_data.length; i++) {
					class_str += '<option value="'+class_data[i].table_name+'">'+class_data[i].cls_name+'</option>';
				}
			} 
			$('#class_name').append(class_str);
		} 
	});
	return false
}

//Fields name fetching function
function fields_name_fetch(module_name, class_name) {
	var currurl = window.location.href;
	var actionurl = currurl.replace('data_mgt_details/','data_mgt_fieldsname/');
	$.ajax({
		url : actionurl,
		type : 'GET',
		timeout : 10000,
		async:false,
		data: {
			'datas': JSON.stringify({'module_name': module_name, 'class_name': class_name})
		}
	}).done(function(json_data)	{
		var data = JSON.parse(json_data);
		field_data = data.field_namelist;
		if (data.status == "NTE_01") {
			$('#fileds_name')[0].options.length = 0;
			var field_str = '<option></option>';
			if (field_data.length > 0){
				for (var i=0; i<field_data.length; i++) {
					field_str += '<option value="'+field_data[i].column_name+'">'+field_data[i].column_name+'</option>';
				}
			} 
			$('#fileds_name').append(field_str);
		}
	});
	return false
}

//Data store in database function
function data_management() {
	var currurl = window.location.href;
	var actionurl = currurl.replace('data_mgt_details/','data_mgt_insert/');
	var form_datas = getFormValues("#data_mgt_detail_form");
	var csrf_data = form_datas.csrfmiddlewaretoken;
	var datas = new FormData();
	datas.append('csrfmiddlewaretoken', csrf_data);
	datas.append('form_datas', JSON.stringify(form_datas));
	var ext = $('#source_file').val().split('.').pop().toLowerCase();
	if ($.inArray(ext, ['csv']) != -1) {
		datas.append('file-0', $("#source_file").get(0).files[0]);
		$.ajax({
			type  : 'POST',
			url   : actionurl,
			data  : datas,
			cache : false,
			contentType: false,
			processData: false,
			async:false,
		}).done( function(jsondata) {
			var data = JSON.parse(jsondata);
			if (data.status == "NTE_01") {
				alert_lobibox("success", sysparam_datas_list[data.status]);
				action_for_query_execution("clear");
			} else {
				alert_lobibox("error", data.status);
			}
		});
	} else {
		alert_lobibox("warning", "Please select data file.");
	}
}