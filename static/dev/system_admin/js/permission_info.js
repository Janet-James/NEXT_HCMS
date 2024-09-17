var permission_details_table_id ='';

$(document).ready(function () {
	// Permission detail data table load function
	permission_detail_table_function();

	$("#module_name").on('change',function(){ 
		var module_name = $(this).val();
		html_name_fetch(module_name);
	});
});

//HTML name fetching function
function html_name_fetch(module_name) {
	var currurl = window.location.href;
	var actionurl = currurl.replace('permission_details/','permission_htmllist/');
	if (module_name !=0 && module_name != null) {
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
			html_data = data.html_namelist;
			if (data.status == "NTE_01") {
				$('#html_name')[0].options.length = 0;
				var html_str = '<option value="0">-Select HTML-</option>';
				for (var i=0; i<html_data.length; i++) {
					html_str += '<option value="'+html_data[i]+'">'+html_data[i]+'</option>';
				}
				$('#html_name').append(html_str);
			} else {
				alert_lobibox("error", sysparam_datas_list[data.status]);
			}
		});
	} else {
		$('#html_name')[0].options.length = 0;
		var html_str = '<option value="0">-Select HTML-</option>';
		$('#html_name').append(html_str);
	}
	return false
}

function action_for_permission(action_name){
	if (action_name == "add") {
		// Permission added function
		permission_data_management('add');
		return false
	} else if (action_name == "update") {
		// Permission updated function
		permission_data_management('update');
		return false
	} else if (action_name == "remove") {
		// Permission deleted function
		removeConfirmation('permission_data_management', 'remove');
		return false
	} else if (action_name == "clear") {
		// Permission form clear function
		form_inputs_clear('#permission_form');
	} else if (action_name == "cancel") {
		// Permission form cancel function
		form_inputs_clear('#permission_form');
		$("#bottom_btns").html('');
		var btnstr = '<button type="button" class="btn btn-success btn-eql-wid btn-animate margin-right-3" onclick="action_for_permission(\''+"add"+'\')">Add</button>';
		btnstr += '<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-3" onclick="action_for_permission(\''+"clear"+'\')">Cancel / Clear</button>';
		$("#bottom_btns").append(btnstr);
	}
}

//Update form clear function
function update_clear_func(action_name) {
	orgClearFuncton('action_for_permission', action_name);
}

//Permission details datatable load function
function permission_detail_table_function(){
	var currurl = window.location.href;
	var actionurl = currurl.replace('permission_details/','permission_record/');
	columns = [{'title':'ID','name':'id'}, {'title':'No.','name':'row_number'}, 
	           {'title':'Permission Name','name':'permisison_name'}, {'title':'Permission Code','name':'permission_code'},
	           {'title':'Module Name','name':'module_name'}, {'title':'HTML Name','name':'html_name'}];
	$.ajax({
		url : actionurl,
		type : 'GET',
		timeout : 10000,
		async:false,
	}).done(function(json_data)	{
		var data = JSON.parse(json_data);
		var permission_list = [];
		if (data.status == "NTE_01") {
			data = data.table_datas;
			$("#permission_table_tbody tr:gt(0)").remove(); 
			for (var i=0; i<data.length; i++){
				permission_list.push([data[i].id, data[i].row_number, data[i].permission_name, data[i].permission_code, data[i].module_name, data[i].html_name]);
			}
			plaindatatable_btn('permission_table', permission_list, columns, 0);
		} else {
			alert_lobibox("error", sysparam_datas_list[data.status]);
		}
	});
	return false
}

//Permission details table row click get id
$("#permission_table tbody").on("click", "tr", function() {    
	var currurl = window.location.href;
	var actionurl = currurl.replace('permission_details/','permission_record/');
	permission_details_table_id = $('#permission_table').dataTable().fnGetData(this)[0];
	$.ajax({
		url : actionurl,
		type : 'GET',
		timeout : 10000,
		async:false,
		data: {
			'permission_id':permission_details_table_id
		}
	}).done(function(json_data)	{
		var temp = '';
		var data = JSON.parse(json_data);
		temp = data.table_datas;
		if (data.status == "NTE_01") {
			$("#bottom_btns").html('');
			var btnstr = '<button type="button" class="btn btn-primary btn-eql-wid btn-animate margin-right-3" onclick="action_for_permission(\''+"update"+'\')">Update</button>';
			btnstr += '<button type="button" class="btn btn-danger btn-eql-wid btn-animate margin-right-3" onclick="action_for_permission(\''+"remove"+'\')">Remove</button>';
			btnstr += '<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-3" onclick="update_clear_func(\''+"cancel"+'\')">Cancel / Clear</button>';
			formData = temp.filter(data=> {return temp[0].permission_id==permission_details_table_id})[0];
			var $inputs = $('#permission_form :input');// get the form id value
			$inputs.each(function() {
				if (this.name in formData) {
					if (this.name== "module_name" || this.name== "html_name"){
						$("#"+this.name).val(formData[this.name]).trigger("change");
					} else {
						this.value = formData[this.name];
					}
				} 
			});
			$("#bottom_btns").append(btnstr);
		} else {
			alert_lobibox("error", sysparam_datas_list[data.status]);
		}
	});
});

//Permission data management function
function permission_data_management(func_name, event){
	var currurl = window.location.href;
	var actionurl = currurl.replace('permission_details/','permission_datainsert/');
	if (func_name == "remove") {
		var datas = getFormValues("#permission_form");
		var	csrf_data = datas.csrfmiddlewaretoken;
		if (datas.permission_id.length > 0){
			$.ajax({
				type  : 'POST',
				url   : actionurl,
				async : false,
				data: {
					'delete_id': datas.permission_id,
					csrfmiddlewaretoken: csrf_data
				},
			}).done( function(jsondata) {
				var data = JSON.parse(jsondata);
				if (data.status == "NTE_04"){
					$("#bottom_btns").html('');
					var btnstr = '<button type="button" class="btn btn-success btn-eql-wid btn-animate margin-right-3" onclick="action_for_permission(\''+"add"+'\')">Add</button>';
					btnstr += '<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-3" onclick="action_for_permission(\''+"clear"+'\')">Cancel / Clear</button>';
					permission_detail_table_function();
					form_inputs_clear('#permission_form');
					$("#bottom_btns").append(btnstr);
					alert_lobibox("success", sysparam_datas_list[data.status]);
				} else {
					alert_lobibox("error", sysparam_datas_list[data.status]);
				}
			});
		}
	} else {
		if(permission_form_validation()) {
			var datas = getFormValues("#permission_form");
			var	csrf_data = datas.csrfmiddlewaretoken;
			$.ajax({
				type  : 'POST',
				url   : actionurl,
				async : false,
				data: {
					'datas': JSON.stringify(datas),
					csrfmiddlewaretoken: csrf_data
				},
			}).done( function(jsondata) {
				var data = JSON.parse(jsondata);
				if (data.status == "NTE_01"){
					permission_detail_table_function();
					form_inputs_clear('#permission_form');
					alert_lobibox("success", sysparam_datas_list[data.status]);
				} else if (data.status == "NTE_03") {
					$("#bottom_btns").html('');
					var btnstr = '<button type="button" class="btn btn-success btn-eql-wid btn-animate margin-right-3" onclick="action_for_permission(\''+"add"+'\')">Add</button>';
					btnstr += '<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-3" onclick="action_for_permission(\''+"clear"+'\')">Cancel / Clear</button>';
					permission_detail_table_function();
					form_inputs_clear('#permission_form');
					$("#bottom_btns").append(btnstr);
					alert_lobibox("success", sysparam_datas_list[data.status]);
				} else {
					alert_lobibox("error", sysparam_datas_list[data.status]);
				}
			});
		}
	}
}

//Permission creation form validation
function permission_form_validation(){
	return $('#permission_form').valid();
}

$("#permission_form").validate({
	rules: {
		permission_name:{
			required: true,
		},
		permission_code:{
			required: true,
			minlength: 10,
			maxlength: 30,
		},
	},
	//For custom messages
	messages: {
		permission_name:{
			required:"Enter Permission Name",
		},
		permission_code:{
			required:"Enter Permission Code",
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