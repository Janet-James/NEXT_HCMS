var refitem_details_table_id ='';

$(document).ready(function () {
	$('select#refitemcat_id').select2({
		placeholder: 'Select Item Category',
		allowClear: true,
		minimumInputLength: 0,
	});
	// Reference Item detail data table load function
	refitem_detail_table_function();
});

function action_for_refitem(action_name){
	if (action_name == "add") {
		// Reference Item added function
		refitem_data_management('add');
		return false
	} else if (action_name == "update") {
		//Reference Item updated function
		refitem_data_management('update');
		return false
	} else if (action_name == "remove") {
		// Reference Item deleted function
		let title = $('#refitem_name').val() || '' ;
		removeConfirmation('refitem_data_management', 'remove',title);
		return false
	} else if (action_name == "clear") {
		// Reference Item form clear function
		$('.error').html(" ");
		form_inputs_clear('#refitem_form');
		document.getElementById("refitemcat_id").disabled = false;
	} else if (action_name == "cancel") {
		// Reference Item form cancel function
		form_inputs_clear('#refitem_form');
		document.getElementById("refitemcat_id").disabled = false;
		btns_draw('add');
	}
}

//Buttons draw function
function btns_draw(action_name){ 
	$("#bottom_btns").html('');
	var btnstr = '';
	var access_for_create = jQuery.inArray( "Manage Reference Item", JSON.parse(localStorage.Create) );
	var access_for_write = jQuery.inArray( "Manage Reference Item", JSON.parse(localStorage.Write) );
	var access_for_delete = jQuery.inArray( "Manage Reference Item", JSON.parse(localStorage.Delete) );
	if (action_name == 'add') {
		if (access_for_create != -1){
			btnstr += '<button type="button" class="btn btn-success btn-eql-wid btn-animate margin-right-3" onclick="action_for_refitem(\''+"add"+'\')">Add</button>';
		}
		btnstr += '<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-3" onclick="action_for_refitem(\''+"clear"+'\')">Cancel / Clear</button>';
	} else if (action_name == 'update') {
		if (access_for_write != -1){
			btnstr += '<button type="button" class="btn btn-primary btn-eql-wid btn-animate margin-right-3" onclick="action_for_refitem(\''+"update"+'\')">Update</button>';
		}
		if (access_for_delete != -1){
			btnstr += '<button type="button" class="btn btn-danger btn-eql-wid btn-animate margin-right-3" onclick="action_for_refitem(\''+"remove"+'\')">Remove</button>';
		}
		btnstr += '<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-3" onclick="update_clear_func(\''+"cancel"+'\')">Cancel / Clear</button>';
	}
	$("#bottom_btns").append(btnstr);
}

//Update form clear function
function update_clear_func(action_name) {
	let title = $('#refitem_name').val() || '' ;
	orgClearFuncton('action_for_refitem', action_name, title);
}

//Reference Item details datatable load function
function refitem_detail_table_function(){
	var currurl = window.location.href;
	var actionurl = currurl.replace('refitem_details/','refitem_record/');
	columns = [{'title':'ID','name':'id'}, {'title':'No.','name':'row_number'}, 
	           {'title':'Reference Item Category','name':'refitem_category_name'}, {'title':'Item Name','name':'refitem_name'}];
	$.ajax({
		url : actionurl,
		type : 'GET',
	}).done(function(json_data)	{
		var data = JSON.parse(json_data);
		var refitem_list = []; 
		if (data.status == "NTE_01"){
			data = data.table_datas;
			$("#refitem_table_tbody tr:gt(0)").remove(); 
			for (var i=0; i<data.length; i++){
				refitem_list.push([data[i].id, data[i].row_number, data[i].refitem_category_name, data[i].refitem_name]);
			}
			plaindatatable_btn('refitem_table', refitem_list, columns, 0, 'NEXT_TRANSFORM_NEXT-HCMS_Reference_Items_'+currentDate());
		} else {
			alert_lobibox("error", sysparam_datas_list[data.status]);
		}
	});
	return false
}

//Reference Item details table row click get id
$("#refitem_table tbody").on("click", "tr", function() {    
	var currurl = window.location.href;
	var actionurl = currurl.replace('refitem_details/','refitem_record/');
	refitem_details_table_id = $('#refitem_table').dataTable().fnGetData(this)[0];
	$.ajax({
		url : actionurl,
		type : 'GET',
		data: {
			'refitem_id':refitem_details_table_id
		}
	}).done(function(json_data)	{
		var temp = '';
		var data = JSON.parse(json_data);
		temp = data.table_datas;
		if (data.status == "NTE_01") {
			btns_draw('update');
			formData = temp.filter(data=> {return temp[0].refitem_id==refitem_details_table_id})[0];
			var $inputs = $('#refitem_form :input');// get the form id value
			$inputs.each(function() {
				if (this.name in formData) {
					$("#"+this.name).val(formData[this.name]).trigger("change");
				} 
			});
			$('#refitemcat_id').prop('disabled','true');
			dataString = $('#refitem_form').serializeArray();//data get string
//			document.getElementById("refitemcat_id").disabled = true;
		} else {
			alert_lobibox("error", sysparam_datas_list[data.status]);
		}
	});
});

//Reference Item details data management function
function refitem_data_management(func_name, event){
	var currurl = window.location.href;
	var actionurl = currurl.replace('refitem_details/','refitem_datainsert/');
	if (func_name == "remove") {
		var datas = getFormValues("#refitem_form");
		var	csrf_data = datas.csrfmiddlewaretoken;
		if (datas.refitem_id.length > 0){
			$.ajax({
				type  : 'POST',
				url   : actionurl,
				data: {
					'delete_id': datas.refitem_id,
					csrfmiddlewaretoken: csrf_data
				},
			}).done( function(jsondata) {
				var data = JSON.parse(jsondata);
				if (data.status == "NTE_04"){
					btns_draw('add');
					form_inputs_clear('#refitem_form');
					refitem_detail_table_function();
					alert_lobibox("success", sysparam_datas_list[data.status]);
				} else {
					alert_lobibox("error", sysparam_datas_list[data.status]);
				}
			});
		}
	} else {
		if(refitem_form_validation()) {
			//update status condition
			if(func_name == 'update'){
				dataString1 = $('#refitem_form').serializeArray();//data get string
				input_status = UpdateReistriction(dataString,dataString1)
			}else{
				input_status = true;
			}
			if(input_status){
				var datas = getFormValues("#refitem_form");
				if (datas.refitemcat_id == undefined || datas.refitemcat_id == null){
					datas.refitemcat_id = $('#refitemcat_id').val();
				}
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
						refitem_detail_table_function();
						form_inputs_clear('#refitem_form');
						alert_lobibox("success", sysparam_datas_list[data.status]);
					} else if (data.status == "NTE_03") {
						btns_draw('add');
						refitem_detail_table_function();
						form_inputs_clear('#refitem_form');
						document.getElementById("refitemcat_id").disabled = false;
						alert_lobibox("success", sysparam_datas_list[data.status]);
					} else {
						alert_lobibox("error", sysparam_datas_list[data.status]);
					}
				});
			}else{
				alert_lobibox("error", 'Record not updated. No change has occurred');
			}
		}
	}
}

//Reference Item creation form validation
function refitem_form_validation(){
	return $('#refitem_form').valid(); 
}

$("#refitem_form").validate({
	rules: {
		refitemcat_id:{
			valueNotEquals:true
		}, 
		refitem_name:{ 
			required: true,  
		    maxlength: 60 
		},
		refitem_description:{ 
			maxlength: 250
		},  
		refitem_code:{ 
			required: true,  
			maxlength: 5,
		},
	},
	//For custom messages
	messages: {
		refitemcat_id:{
			valueNotEquals:"Please select Item category",
		},
		refitem_name:{
			required:"Enter Reference Item Name",
		},
		refitem_code:{
			required:"Enter Item Code",
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