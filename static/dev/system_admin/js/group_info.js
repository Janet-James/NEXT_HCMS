var grp_details_table_id =''; 

$(document).ready(function () {
	// Group detail data table load function
	grp_detail_table_function();
});

function action_for_grp(action_name){
	if (action_name == "add") {
		// Group added function
		grp_data_management('add');
		return false
	} else if (action_name == "update") {
		//Group updated function
		grp_data_management('update');
		return false
	} else if (action_name == "remove") {
		// Group deleted function
		removeConfirmation('grp_data_management', 'remove');
		return false
	} else if (action_name == "clear") {
		// Group form clear function
		form_inputs_clear('#grp_detail_form');
	} else if (action_name == "cancel") {
		// Group form cancel function
		form_inputs_clear('#grp_detail_form');
		$("#bottom_btns").html('');
		var btnstr = '<button type="button" class="btn btn-success btn-eql-wid btn-animate margin-right-3" onclick="action_for_grp(\''+"add"+'\')">Add</button>';
		btnstr += '<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-3" onclick="action_for_grp(\''+"clear"+'\')">Cancel / Clear</button>';
		$("#bottom_btns").append(btnstr);
	}
}

//Update form clear function
function update_clear_func(action_name) {
	orgClearFuncton('action_for_grp', action_name);
}

//Group details datatable load function
function grp_detail_table_function(){
	var currurl = window.location.href;
	var actionurl = currurl.replace('grp_details/','grp_record/');
	columns = [{'title':'ID','name':'id'}, {'title':'No.','name':'row_number'}, 
	           {'title':'Name','name':'name'}];
	$.ajax({
		url : actionurl,
		type : 'GET',
	}).done(function(json_data)	{
		var data = JSON.parse(json_data);
		var grp_details_list = []; 
		if (data.status == "NTE_01"){
			data = data.table_datas;
			$("#grp_details_table_tbody tr:gt(0)").remove(); 
			for (var i=0; i<data.length; i++){
				grp_details_list.push([data[i].id, data[i].row_number, data[i].name]);
			}
			plaindatatable_btn('grp_details_table', grp_details_list, columns, 0);
		} else {
			alert_lobibox("error", sysparam_datas_list[data.status]);
		}
	});
	return false
}

//Group details table row click get id
$("#grp_details_table tbody").on("click", "tr", function() {    
	var currurl = window.location.href;
	var actionurl = currurl.replace('grp_details/','grp_record/');
	grp_details_table_id = $('#grp_details_table').dataTable().fnGetData(this)[0];
	$.ajax({
		url : actionurl,
		type : 'GET',
		data: {
			'grp_id':grp_details_table_id
		}
	}).done(function(json_data)	{
		var temp = '';
		var data = JSON.parse(json_data);
		temp = data.table_datas;
		if (data.status == "NTE_01") {
			$("#bottom_btns").html('');
			var btnstr = '<button type="button" class="btn btn-primary btn-eql-wid btn-animate margin-right-3" onclick="action_for_grp(\''+"update"+'\')">Update</button>';
			btnstr += '<button type="button" class="btn btn-danger btn-eql-wid btn-animate margin-right-3" onclick="action_for_grp(\''+"remove"+'\')">Remove</button>';
			btnstr += '<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-3" onclick="update_clear_func(\''+"cancel"+'\')">Cancel / Clear</button>';
			formData = temp.filter(data=> {return temp[0].grp_id==grp_details_table_id})[0];
			var $inputs = $('#grp_detail_form :input');// get the form id value
			$inputs.each(function() {
				if (this.name in formData) {
					this.value = formData[this.name];
				} 
			});
			$("#bottom_btns").append(btnstr);
		} else {
			alert_lobibox("error", sysparam_datas_list[data.status]);
		}
	});
});

//Group details data management function
function grp_data_management(func_name, event){
	var currurl = window.location.href;
	var actionurl = currurl.replace('grp_details/','grp_datainsert/');
	if (func_name == "remove") {
		var datas = getFormValues("#grp_detail_form");
		var	csrf_data = datas.csrfmiddlewaretoken;
		if (datas.grp_id.length > 0){
			$.ajax({
				type  : 'POST',
				url   : actionurl,
				data: {
					'delete_id': datas.grp_id,
					csrfmiddlewaretoken: csrf_data
				},
			}).done( function(jsondata) {
				var data = JSON.parse(jsondata);
				if (data.status == "NTE_04"){
					$("#bottom_btns").html('');
					var btnstr = '<button type="button" class="btn btn-success btn-eql-wid btn-animate margin-right-3" onclick="action_for_grp(\''+"add"+'\')">Add</button>';
					btnstr += '<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-3" onclick="action_for_grp(\''+"clear"+'\')">Cancel / Clear</button>';
					grp_detail_table_function();
					$("#bottom_btns").append(btnstr);
					form_inputs_clear('#grp_detail_form');
					alert_lobibox("success", sysparam_datas_list[data.status]);
				} else {
					alert_lobibox("error", sysparam_datas_list[data.status]);
				}
			});
		}
	} else {
		if(grp_detail_form_validation()) {
			var datas = getFormValues("#grp_detail_form");
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
				if (data.status == "NTE_01"){
					grp_detail_table_function();
					form_inputs_clear('#grp_detail_form');
					alert_lobibox("success", sysparam_datas_list[data.status]);
				} else if (data.status == "NTE_03") {
					$("#bottom_btns").html('');
					var btnstr = '<button type="button" class="btn btn-success btn-eql-wid btn-animate margin-right-3" onclick="action_for_grp(\''+"add"+'\')">Add</button>';
					btnstr += '<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-3" onclick="action_for_grp(\''+"clear"+'\')">Cancel / Clear</button>';
					grp_detail_table_function();
					form_inputs_clear('#grp_detail_form');
					$("#bottom_btns").append(btnstr);
					alert_lobibox("success", sysparam_datas_list[data.status]);
				} else {
					alert_lobibox("error", sysparam_datas_list[data.status]);
				}
			});
		}
	}
}

//Group creation form validation
function grp_detail_form_validation(){
	return $('#grp_detail_form').valid();
}
$("#grp_detail_form").validate({
	rules: {
		grp_name:{
			required: true,
		},
		grp_code:{
			required: true,
		},
	},
	//For custom messages
	messages: {
		grp_name:{
			required:"Enter Group Name",
		}
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