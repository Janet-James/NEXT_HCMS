var esi_table_id = 0;

$(document).ready(function(){
	button_create_esi(1);
	esi_form_table_dispaly();
});

//button create function here
function button_create_esi(status){
	var access_for_create = jQuery.inArray( "Payroll Setup", JSON.parse(localStorage.Create) );
	var access_for_write = jQuery.inArray( "Payroll Setup", JSON.parse(localStorage.Write) );
	var access_for_delete = jQuery.inArray( "Payroll Setup", JSON.parse(localStorage.Delete) );	
	if(status == 1){
		if (access_for_create != -1){
		strAppend = "<button type='button' onclick='esi_form_create()' class='btn btn-success btn-eql-wid btn-animate'>Add</button>"
		}strAppend += " <button type='button' onclick='esi_form_clear()' class='btn btn-warning btn-animate btn-eql-wid btn-animate'>Cancel / Clear</button>"
				$('#esi_btn').html(strAppend);
	}else{
		if (access_for_write != -1){
		strAppend = "<button type='button' onclick='esi_form_update()' class='btn btn-primary btn-eql-wid btn-animate '>Update</button>"
			strAppend += " <button type='button' onclick='esi_form_delete()' class='btn btn-danger btn-eql-wid btn-animate '>Remove</button>"
		}if (access_for_delete != -1){
			
		}
				strAppend += " <button type='button' onclick='esi_form_clear()' class='btn btn-warning btn-animate btn-eql-wid btn-animate'>Cancel / Clear</button>"
					$('#esi_btn').html(strAppend);
	}
}

function esi_form_table_dispaly(){
	$.ajax({	
		type  : 'POST',
		url   : '/esi_table_display/',
		async : false,
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		if(data){
			esi_datatable_function(data)
		}else{
			esi_datatable_function(data)
		}
		
	});

}

//Esi data table function here
function esi_datatable_function(data)
{
	datatable_list = []
	if(data.length > 0){
		datatable_list = []
		for(var i=0;i<data.length;i++){
			list = []
			var sno = i+1
			list.push(data[i].id,sno,data[i].employee_name,data[i].esi_from_date,data[i].esi_date_to,data[i].esi_active);
			datatable_list.push(list);
		}

		columns = [{'title':'ID'},{'title':'No.'},{'title':'Employee Name'},{'title':'Effective From Date'},{'title':'Effective To Date'},{'title':'ESI Active'}]
		plaindatatable_btn('esi_tbl_details', datatable_list, columns,0,'NEXT_TRANSFORM_HCMS_ESI_VALUE_'+currentDate());
	}else{
		columns = [{'title':'ID'},{'title':'No.'},{'title':'Employee Name'},{'title':'Effective From Date'},{'title':'Effective To Date'},{'title':'ESI Active'}]
		plaindatatable_btn('esi_tbl_details', datatable_list, columns,0,'NEXT_TRANSFORM_HCMS_ESI_VALUE_'+currentDate());
	}
	
	return false
}

//table row click get id
$("#esi_tbl_details").on("click", "tr", function() {   
	var id = $('#esi_tbl_details').dataTable().fnGetData(this)[0];
	//reg_table_id = id
	if (id != 'No data available'){
		esi_table_row_click(id);
	}
});

//row click function in the table
function esi_table_row_click(el){
	button_create_esi(0);
	$.ajax(
			{
				type:"GET",
				url: "/esi_table_row_click/",
				async: false,
				data : {'id':el},
				success: function (json_data) {
					data=JSON.parse(json_data);
					for (i=0;i<data.length;i++){
						esi_table_id = data[i].id;
						$('#esi_from_date').val(data[i].esi_date_from); 
						$('#esi_to_date').val(data[i].esi_date_to); 
						$("#select_esi").val(data[i].esi_active);
						document.getElementById("select_esi").checked = data[i].esi_active
						$('#employee_id_esi').val(data[i].esi_employee_id).trigger('change');
					}
				}
			});
	return false;
}

//esi form details create function here 
function esi_form_create() {
	if(esi_form_validation())
	{
		esi_form_create_function();
	}
}

//Esi Form create function here
function esi_form_create_function()
{
	var esi_form_value = getFormValues("#esi_form");
	var csrf_data = esi_form_value.csrfmiddlewaretoken;
	delete esi_form_value["csrfmiddlewaretoken"];
	esi_form_value['is_active'] = "True";
	var employee_id_list = [];
	 $.each($("#employee_id_esi option:selected"), function(){     
		 employee_id_list.push($(this).val());
    });
	var  esi_value = $("#select_esi").is(':checked')? true:false;
	esi_form_value["esi_value"] = esi_value
	esi_form_value['esi_date_from'] = dateFormatChange(validationFields(esi_form_value["esi_date_from"]));
	esi_form_value['esi_date_to'] = dateFormatChange(validationFields(esi_form_value["esi_date_to"]));

	esi_list = [];
	esi_dict = {};
	esi_list.push(esi_form_value);
	esi_dict['esi_data'] = esi_list;
	$.ajax({	
		type  : 'POST',
		url   : '/esi_create/',
		async : false,
		data: {
			'datas': JSON.stringify(esi_dict),
			"table_id": esi_table_id,
			"employee_id_list":JSON.stringify(employee_id_list),
			csrfmiddlewaretoken: csrf_data,
		}
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		var res_status = data['status'];
		if(res_status == 'NTE_01') {	
			alert_lobibox("success", sysparam_datas_list[res_status]);
			button_create_esi(1)
			esi_form_clear();
			esi_form_table_dispaly();	
		}else if(res_status == 'NTE_03') {	
			alert_lobibox("success", sysparam_datas_list[res_status]);
			button_create_esi(1)
			esi_form_clear();
			esi_form_table_dispaly();	
		}else if(res_status == 'Already Exist'){
			alert_lobibox("error","Employee Esi already exist");
		}
		else {
			alert_lobibox("error",sysparam_datas_list['ERR0040'])
		}
	});
}

//update function
function esi_form_update(){
	esi_form_create();
}

//delete function
function esi_form_delete(){
	//var slab_title = $('#slab_value').val();
	removeConfirmation('esi_details_delete_function','','');
}

//delete function
function esi_details_delete_function(){
	$.ajax({	
		type  : 'POST',
		url   : '/esi_create/',
		async : false,
		data: {
			"delete_id": esi_table_id,
			csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val(),
		},
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		var res_status = data['status'];
		if(res_status == 'NTE_04') {	
			alert_lobibox("success", sysparam_datas_list[res_status]);
			button_create_esi(1)
			esi_form_clear();
			esi_form_table_dispaly();	
		}
		else {
			alert_lobibox("error",sysparam_datas_list['ERR0028'])
		}
	});
}

//Rating Point form validation here
function esi_form_validation()
{
	return $('#esi_form').valid();
}

//date format change
function dateFormatChange(val){
	return val.split('-')[2]+'-'+val.split('-')[1]+'-'+val.split('-')[0]
}

//validation for the empty
function validationFields(val){
	return val==''  ?null:val 
}

$.validator.addMethod("alpha", function(value, element) {
    return this.optional(element) || value == value.match(/^[a-zA-Z\s]+$/);
});

//rating point form validation
$('#esi_form').submit(function(e) {
	e.preventDefault();    
}).validate({
	rules: {
		esi_employee_id: {
			required: true,
			valueNotEquals:true,  
		},   
		esi_date_from: {
			required: true,
			//number:true, 
		},	  
		esi_date_to: {
			required: true,
			greaterThan: "From date"
			//valueNotEquals:true, 
		},
	},
	//For custom messages
	messages: {
		      
			   
		esi_employee_id: {
			required: "Select Employee",
			valueNotEquals:"Select Employee", 
		},
	   esi_date_from: {
			required: "Enter Effective From Date",
			//number: "Enter only a number", 
		},
		esi_date_to: {
			required: "Enter Effective To Date",
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

jQuery.validator.addMethod('valueNotEquals', function (value) {
	return (value != '0');
}, "");

function esi_form_clear(){
	employee_id_list = []
	button_create_esi(1);
	esi_table_id = 0
	$('.thumbnail').html("")
	$('.errormessage').html("");
	$('.esi_clear').val("");
	document.getElementById("select_esi").checked = false
	 $('#employee_id_esi option').attr("selected", false).trigger('change');
}

$('#employee_id_esi').change(function(){
	$('.errormessage').html("");
});