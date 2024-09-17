var refitemcat_details_table_id ='';
$(document).ready(function () {
	// Reference Item Category detail data table load function
	refitemcat_detail_table_function();
});

function action_for_refitemcat(action_name){
	if (action_name == "add") {
		// Reference Item Category added function
		refitemcat_data_management('add');
		return false
	} else if (action_name == "update") {
		//Reference Item Category updated function
		refitemcat_data_management('update');
		return false
	} else if (action_name == "remove") {
		// Reference Item Category deleted function
		removeConfirmation('refitemcat_data_management', 'remove');
		return false
	} else if (action_name == "clear") {
		// Reference Item Category form clear function
		form_inputs_clear('#refitemcat_form');
	} else if (action_name == "cancel") {
		// Reference Item Category form cancel function
		form_inputs_clear('#refitemcat_form');
		$("#bottom_btns").html('');
		var btnstr = '<button type="button" class="btn btn-success btn-eql-wid btn-animate margin-right-3" onclick="action_for_refitemcat(\''+"add"+'\')">Add</button>';
		btnstr += '<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-3" onclick="action_for_refitemcat(\''+"clear"+'\')">Cancel / Clear</button>';
		$("#bottom_btns").append(btnstr);
	}
}

// Update form clear function
function update_clear_func(action_name) {
	orgClearFuncton('action_for_refitemcat', action_name);
}

//Reference Item Category details datatable load function
function refitemcat_detail_table_function(){
	var currurl = window.location.href;
	var actionurl = currurl.replace('refitemcat_details/','refitemcat_record/');
	columns = [{'title':'ID','name':'id'}, {'title':'No.','name':'row_number'}, 
	           {'title':'Category Code','name':'refitemcat_code'}, {'title':'Category Name','name':'refitemcat_name'}];
	$.ajax({
		url : actionurl,
		type : 'GET',
	}).done(function(json_data)	{
		var data = JSON.parse(json_data);
		var refitemcat_list = []; 
		if (data.status == "NTE_01"){
			data = data.table_datas;
			$("#refitemcat_table_tbody tr:gt(0)").remove(); 
			for (var i=0; i<data.length; i++){
				refitemcat_list.push([data[i].id, data[i].row_number, data[i].refitemcat_code, String(data[i].refitemcat_name)]);
			}
			plaindatatable_btn('refitemcat_table', refitemcat_list, columns, 0);
		} else {
			alert_lobibox("error", sysparam_datas_list[data.status]);
		}
	});
	return false
}

//Reference Item Category details table row click get id
$("#refitemcat_table tbody").on("click", "tr", function() {    
	var currurl = window.location.href;
	var actionurl = currurl.replace('refitemcat_details/','refitemcat_record/');
	refitemcat_details_table_id = $('#refitemcat_table').dataTable().fnGetData(this)[0];
	$.ajax({
		url : actionurl,
		type : 'GET',
		data: {
			'refitemcat_id':refitemcat_details_table_id
		}
	}).done(function(json_data)	{
		var temp = '';
		var data = JSON.parse(json_data);
		temp = data.table_datas;
		if (data.status == "NTE_01") {
			$("#bottom_btns").html('');
			var btnstr = '<button type="button" class="btn btn-primary btn-eql-wid btn-animate margin-right-3" onclick="action_for_refitemcat(\''+"update"+'\')">Update</button>';
			btnstr += '<button type="button" class="btn btn-danger btn-eql-wid btn-animate margin-right-3" onclick="action_for_refitemcat(\''+"remove"+'\')">Remove</button>';
			btnstr += '<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-3" onclick="update_clear_func(\''+"cancel"+'\')">Cancel / Clear</button>';
			formData = temp.filter(data=> {return temp[0].refitemcat_id==refitemcat_details_table_id})[0];
			var $inputs = $('#refitemcat_form :input');// get the form id value
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

//Reference Item Category details data management function
function refitemcat_data_management(func_name, event){
	var currurl = window.location.href;
	var actionurl = currurl.replace('refitemcat_details/','refitemcat_datainsert/');
	if (func_name == "remove") {
		var datas = getFormValues("#refitemcat_form");
		var	csrf_data = datas.csrfmiddlewaretoken;
		if (datas.refitemcat_id.length > 0){
			$.ajax({
				type  : 'POST',
				url   : actionurl,
				data: {
					'delete_id': datas.refitemcat_id,
					csrfmiddlewaretoken: csrf_data
				},
			}).done( function(jsondata) {
				var data = JSON.parse(jsondata);
				if (data.status == "NTE_04"){
					$("#bottom_btns").html('');
					var btnstr = '<button type="button" class="btn btn-success btn-eql-wid btn-animate margin-right-3" onclick="action_for_refitemcat(\''+"add"+'\')">Add</button>';
					btnstr += '<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-3" onclick="action_for_refitemcat(\''+"clear"+'\')">Cancel / Clear</button>';
					refitemcat_detail_table_function();
					$("#bottom_btns").append(btnstr);
					alert_lobibox("success", sysparam_datas_list[data.status]);
					form_inputs_clear('#refitemcat_form');
				} else {
					alert_lobibox("error", sysparam_datas_list[data.status]);
				}
			});
		}
	} else {
		if(refitemcat_form_validation()) {
			var datas = getFormValues("#refitemcat_form");
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
					refitemcat_detail_table_function();
					form_inputs_clear('#refitemcat_form');
					alert_lobibox("success", sysparam_datas_list[data.status]);
				} else if (data.status == "NTE_03") {
					$("#bottom_btns").html('');
					var btnstr = '<button type="button" class="btn btn-success btn-eql-wid btn-animate margin-right-3" onclick="action_for_refitemcat(\''+"add"+'\')">Add</button>';
					btnstr += '<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-3" onclick="action_for_refitemcat(\''+"clear"+'\')">Cancel / Clear</button>';
					$("#bottom_btns").append(btnstr);
					refitemcat_detail_table_function();
					form_inputs_clear('#refitemcat_form');
					alert_lobibox("success", sysparam_datas_list[data.status]);
				} else {
					alert_lobibox("error", sysparam_datas_list[data.status]);
				}
			});
		}
	}
}

//Reference Item Category creation form validation
function refitemcat_form_validation(){
	return $('#refitemcat_form').valid();
}
$("#refitemcat_form").validate({
	rules: {
		refitemcat_name:{
			required: true,
		},
		refitemcat_code:{
			required: true,
			maxlength: 5,
		},
	},
	//For custom messages
	messages: {
		refitemcat_name:{
			required:"Enter Category Name",
		},
		refitemcat_code:{
			required:"Enter Category Code",
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