var arrear_table_id = 0;

$(document).ready(function(){
	button_create_arrear(1);
	arrear_table_dispaly();
});

function arrear_table_dispaly(){
	$.ajax({	
		type  : 'POST',
		url   : '/arrear_table_display/',
		async : false,
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		if(data){
			arrear_datatable_function(data)
		}else{
			arrear_datatable_function(data)
		}
		
	});

}

function arrear_datatable_function(data)
{
	datatable_list = []
	if(data.length > 0){
		datatable_list = []
		for(var i=0;i<data.length;i++){
			list = []
			var sno = i+1
			list.push(data[i].id,sno,data[i].employee_name,data[i].arrear_type,data[i].arrear_from_date,data[i].arrear_to_date);
			datatable_list.push(list);
		}

		columns = [{'title':'ID'},{'title':'No.'},{'title':'Employee Name'},{'title':'Arrear Type'},{'title':'From date'},{'title':'To Date'}]
		plaindatatable_btn('arrear_tbl_details', datatable_list, columns,0);
	}else{
		columns = [{'title':'ID'},{'title':'No.'},{'title':'Employee Name'},{'title':'Arrear Type'},{'title':'From date'},{'title':'To Date'}]
		plaindatatable_btn('arrear_tbl_details', datatable_list, columns,0);
	}
	
	return false
}

$("#arrear_tbl_details").on("click", "tr", function() {   
	var id = $('#arrear_tbl_details').dataTable().fnGetData(this)[0];
	//reg_table_id = id
	if (id != 'No data available'){
		arrear_table_row_click(id);
	}
});

function arrear_table_row_click(el){
	button_create_arrear(0);
	$.ajax(
			{
				type:"GET",
				url: "/arrear_table_row_click/",
				async: false,
				data : {'id':el},
				success: function (json_data) {
					data=JSON.parse(json_data);
					for (i=0;i<data.length;i++){
						arrear_table_id = data[i].id;
						$('#arrear_amount').val(data[i].arrear_amount); 
						$('#arrear_dtimepicker1').val(data[i].arrear_from_date);
						$("#arrear_dtimepicker2").val(data[i].arrear_to_date)
						$('#arrear_employe_name').val(data[i].arrear_employee_id).trigger('change');
						$('#arrear_type_name').val(data[i].arrear_type_id).trigger('change');
						
						//get form value for field wise log list function
						//payroll_activity_log_attribute_value('#tds_form')
					}
				}
			});
	return false;
}

//button create function here
function button_create_arrear(status){
	var access_for_create = jQuery.inArray( "Payroll Setup", JSON.parse(localStorage.Create) );
	var access_for_write = jQuery.inArray( "Payroll Setup", JSON.parse(localStorage.Write) );
	var access_for_delete = jQuery.inArray( "Payroll Setup", JSON.parse(localStorage.Delete) );	
	if(status == 1){
		if (access_for_create != -1){
		strAppend = "<button type='button' onclick='arrear_create()' class='btn btn-success btn-eql-wid btn-animate'>Add</button>"
		}strAppend += " <button type='button' onclick='arrear_clear()' class='btn btn-warning btn-animate btn-eql-wid btn-animate'>Cancel / Clear</button>"
				$('#hcms_arrear_btn').html(strAppend);
	}else{
		if (access_for_write != -1){
		strAppend = "<button type='button' onclick='arrear_update()' class='btn btn-primary btn-eql-wid btn-animate '>Update</button>"
			strAppend += " <button type='button' onclick='arrear_delete()' class='btn btn-danger btn-eql-wid btn-animate '>Remove</button>"
		}/*if (access_for_delete != -1){
			alert(0)
			
		}*/
				strAppend += " <button type='button' onclick='arrear_clear()' class='btn btn-warning btn-animate btn-eql-wid btn-animate'>Cancel / Clear</button>"
					$('#hcms_arrear_btn').html(strAppend);
	}
}

function arrear_create() {
	if(arrear_form_validation())
	{
		arrear_create_function();
	}
}

function arrear_update(){
	arrear_create();
}

function arrear_create_function()
{
	var arrear_form_value = getFormValues("#arrear_form");
	var csrf_data = arrear_form_value.csrfmiddlewaretoken;
	delete arrear_form_value["csrfmiddlewaretoken"];
	arrear_form_value['is_active'] = "True";

	arrear_form_value['arrear_employee_id'] = validationFields(arrear_form_value['arrear_employee_id']);
	arrear_form_value['arrear_type_id'] = validationFields(arrear_form_value['arrear_type_id']);
	//tds_form_value['tds_category'] = 1;
	arrear_form_value['arrear_amount'] = validationFieldsamount(arrear_form_value['arrear_amount']);
	arrear_form_value['arrear_from_date'] = dateFormatChange(validationFields(arrear_form_value['arrear_from_date']));
	arrear_form_value['arrear_to_date'] = dateFormatChange(validationFields(arrear_form_value['arrear_to_date']));

	arrear_list = [];
	arrear_dict = {};
	arrear_list.push(arrear_form_value);
	arrear_dict['arrear_data'] = arrear_list;
	//var tds_activity_list = []
	//tds_activity_list = payroll_activity_log('#tds_form')
	
	$.ajax({	
		type  : 'POST',
		url   : '/arrear_create/',
		async : false,
		data: {
			'datas': JSON.stringify(arrear_dict),
			//'log_data':JSON.stringify(tds_activity_list),
			"table_id": arrear_table_id,
			csrfmiddlewaretoken: csrf_data,
		}
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		var res_status = data['status'];
		if(res_status == 'NTE_01') {	
			alert_lobibox("success", sysparam_datas_list[res_status]);
			button_create_arrear(1);
			arrear_clear();
			arrear_table_dispaly();
			//tds_activity_list = []
			//payroll_log_activity();
		}else if(res_status == 'NTE_03') {	
			alert_lobibox("success", sysparam_datas_list[res_status]);
			button_create_arrear(1)
			arrear_clear();
			arrear_table_dispaly();	
			//tds_activity_list = []
			//payroll_log_activity();
		}
		else {
			alert_lobibox("error",sysparam_datas_list['ERR0040'])
		}
	});
}

//delete function
function arrear_delete(){
	var arrear_title = $('#arrear_employe_name option:selected').text();
	removeConfirmation('arrear_details_delete_function','',arrear_title);
}

//delete function
function arrear_details_delete_function(){
	$.ajax({	
		type  : 'POST',
		url   : '/arrear_create/',
		async : false,
		data: {
			"delete_id": arrear_table_id,
			csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val(),
		},
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		var res_status = data['status'];
		if(res_status == 'NTE_04') {	
			alert_lobibox("success", sysparam_datas_list[res_status]);
			button_create_arrear(0)
			arrear_clear();
			arrear_table_dispaly();
			//tds_activity_list = []
			//payroll_log_activity();
		}
		else {
			alert_lobibox("error",sysparam_datas_list['ERR0028'])
		}
	});
}


function dateFormatChange(val){
	return val.split('-')[2]+'-'+val.split('-')[1]+'-'+val.split('-')[0]
}

function arrear_form_validation()
{
	return $('#arrear_form').valid();
}

//validation for the empty
function validationFields(val){
	return val=='' || val =='0' ?null:val 
}

$.validator.addMethod("alpha", function(value, element) {
    return this.optional(element) || value == value.match(/^[a-zA-Z\s]+$/);
});

//validation for the empty
function validationFieldsamount(val){
	return val==''  ?null:val 
}

//contribution register form validation
$('#arrear_form').submit(function(e) {
	e.preventDefault();    
}).validate({
	rules: {
		
		/*tds_category: {
			required: true,
			valueNotEquals:true, 
		}, */  
		arrear_amount: {
			required: true,
			number:true, 
		},	
		arrear_employee_id: {
			required: true,
			valueNotEquals:true, 
		},
		arrear_type_id: {
			required: true,
			valueNotEquals:true, 
		},
		arrear_from_date: {
			required: true,
			//number:true, 
		},	  
		arrear_to_date: {
			required: true,
			greaterThan: "From date"
			//valueNotEquals:true, 
		},
	},
	//For custom messages
	messages: {
		/*contribution_register_name: {
			required: "Enter contribution register name",
			maxlength: "Name cannot exceed 50 characters",
			alpha: "Name cannot have numbers",
		}, */      
		   
		/*tds_category: {
			required: "Select Category",
			valueNotEquals:"Select Category", 
		},*/
		arrear_amount: {
			required: "Enter Amount",
			number: "Enter only a number", 
		},
		arrear_employee_id: {
			required: "Select  Employee",
			valueNotEquals: "Select  Employee", 
		},	
		arrear_type_id: {
			required: "Select Arrear Type",
			valueNotEquals: "Select Arrear Type", 
		},
		arrear_from_date: {
			required: "Enter From Date",
			//number: "Enter only a number", 
		},
		arrear_to_date: {
			required: "Enter To Date",
			//number: "Enter only a number", 
		},

	},
	errorElement: 'div',
	errorPlacement: function(error, element) {
		var placement = $(element).data('error');
		if (placement) {
			$(placement).append(error)
		} else {
			error.insertAfter(element);
		}
	},
	ignore: []
});

$('#arrear_employe_name').change(function() {
	$('.errormessage').html("");
});
$('#arrear_type_name').change(function() {
	$('.errormessage').html("");
});

function arrear_clear(){
	button_create_arrear(1);
	arrear_table_id = 0
	$('.thumbnail').html("")
	$('.errormessage').html("");	
	$('#arrear_amount').val(''); 
	//$('#hr_contribution_register_code').val(''); 
	$('#arrear_dtimepicker1').val('');
	$("#arrear_dtimepicker2").val('');
	$("#arrear_employe_name").val(0).trigger('change');
	$("#arrear_type_name").val(0).trigger('change');
}