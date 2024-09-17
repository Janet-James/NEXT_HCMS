var payroll_app_admin_table_id = 0
$(document).ready(function(){
	button_create_payroll_app_admin(1);
	//payroll_app_admin_table_dispaly();
});

//button create function here
function button_create_payroll_app_admin(status){
	var access_for_create = jQuery.inArray( "Payroll Setup", JSON.parse(localStorage.Create) );
	var access_for_write = jQuery.inArray( "Payroll Setup", JSON.parse(localStorage.Write) );
	var access_for_delete = jQuery.inArray( "Payroll Setup", JSON.parse(localStorage.Delete) );	
	if(status == 1){
		if (access_for_create != -1){
		strAppend = "<button type='button' onclick='payroll_app_admin_create()' class='btn btn-success btn-eql-wid btn-animate'>Add</button>"
		}strAppend += " <button type='button' onclick='payroll_app_admin_clear()' class='btn btn-warning btn-animate btn-eql-wid btn-animate'>Cancel / Clear</button>"
				$('#payroll_app_admin_btn').html(strAppend);
	}else{
		if (access_for_write != -1){
		strAppend = "<button type='button' onclick='payroll_app_admin_update()' class='btn btn-primary btn-eql-wid btn-animate '>Update</button>"
		}if (access_for_delete != -1){
			strAppend += " <button type='button' onclick='payroll_app_admin_delete()' class='btn btn-danger btn-eql-wid btn-animate '>Remove</button>"
		}
				strAppend += " <button type='button' onclick='payroll_app_admin_clear()' class='btn btn-warning btn-animate btn-eql-wid btn-animate'>Cancel / Clear</button>"
					$('#payroll_app_admin_btn').html(strAppend);
	}
}

function payroll_app_admin_create() {
	if(payroll_app_admin_form_validation())
	{
		payroll_app_admin_create_function();
	}
}

function payroll_app_admin_create_function()
{
	var payroll_app_admin_form_value = getFormValues("#payroll_app_admin");
	var csrf_data = rating_point_form_value.csrfmiddlewaretoken;
	delete payroll_app_admin_form_value["csrfmiddlewaretoken"];
	payroll_app_admin_form_value['is_active'] = "True";

	payroll_app_admin_form_value['app_salary_category'] = validationFields(payroll_app_admin_form_value['app_salary_category']);
	payroll_app_admin_form_value['app_salary_rule_name'] = validationFields(payroll_app_admin_form_value['app_salary_rule_name']);
	payroll_app_admin_form_value['app_salary_rule_code'] = validationFields(payroll_app_admin_form_value['app_salary_rule_code']);

	payroll_app_admin_list = [];
	payroll_app_admin_dict = {};
	payroll_app_admin_list.push(payroll_app_admin_form_value);
	payroll_app_admin_dict['payroll_app_admin_data'] = payroll_app_admin_list;
	$.ajax({	
		type  : 'POST',
		url   : '/payroll_app_admin_create/',
		async : false,
		data: {
			'datas': JSON.stringify(payroll_app_admin_dict),
			"table_id": payroll_app_admin_table_id,
			csrfmiddlewaretoken: csrf_data,
		}
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		var res_status = data['status'];
		if(res_status == 'NTE_01') {	
			alert_lobibox("success", sysparam_datas_list[res_status]);
			button_create_payroll_app_admin(1)
			payroll_app_admin_clear();
			//rating_point_table_dispaly();	
		}else if(res_status == 'NTE_03') {	
			alert_lobibox("success", sysparam_datas_list[res_status]);
			button_create_rating_point(1)
			rating_point_clear();
			rating_point_table_dispaly();	
		}
		else {
			alert_lobibox("error",sysparam_datas_list['ERR0040'])
		}
	});
}

function payroll_app_admin_form_validation()
{
	return $('#payroll_app_admin').valid();
}

$('#payroll_app_admin').submit(function(e) {
	e.preventDefault();    
}).validate({
	rules: {	  
		app_salary_category: {
			required: true,
			valueNotEquals:true, 
		},  
		app_salary_rule_name: {
			required: true,
			valueNotEquals:true, 
		},  
		app_salary_rule_code: {
			required: true,
			valueNotEquals:true, 
		},  
	
	
	},
	//For custom messages
	messages: {
	
		app_salary_category: {
			required: "Select Salary Category",
			valueNotEquals:"Select Salary Category",
			
		},
		app_salary_rule_name: {
			required: "Select Salary Rule Name",
			valueNotEquals:"Select Salary Rule Name",
			
		},
		app_salary_rule_code: {
			required: "Select Salary Rule Code",
			valueNotEquals:"Select Salary Rule Code",
			
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

function payroll_app_admin_clear(){
	button_create_payroll_app_admin(1);
	payroll_app_admin_table_id = 0
	$('.thumbnail').html("")
	$('.errormessage').html("");
	$('.app_clear').val("");
}