$(document).ready(function(){
	//tax_declaration_table();
	button_create_tax(1);
	tax_invesment_form();
	tax_employee_details()

});

function tax_invesment_form(){
	$.ajax(
			{
				type:"GET",
				url: "/tax_declaration_table_data/",
				async: false,
			}).done(function(json_data) {
				var tax_table_data = JSON.parse(json_data);
				if (tax_table_data){
					$('#tax_declaration_tbl_details').html(tax_table_data.form_data[0])
				}
			});
}

function button_create_tax(status){
	var access_for_create = jQuery.inArray( "Tax Declaration Configuration", JSON.parse(localStorage.Create) );
	var access_for_write = jQuery.inArray( "Tax Declaration Configuration", JSON.parse(localStorage.Write) );
	var access_for_delete = jQuery.inArray( "Tax Declaration Configuration", JSON.parse(localStorage.Delete) );
	if(status == 1){
		if (access_for_create != -1){
			strAppend = "<button type='button' onclick='tax_create()' class='btn btn-success btn-eql-wid btn-animate'>Add</button>"
		}
		/*strAppend += " <button type='button' onclick='tax_clear()' class='btn btn-warning btn-animate btn-eql-wid btn-animate'>Cancel / Clear</button>"*/
			$('#tax_declaration_btn').html(strAppend);
	}else{
		if(access_for_write != -1){
			strAppend = "<button type='button' onclick='tax_update()' class='btn btn-primary btn-eql-wid btn-animate '>Update</button>"
		}/*if (access_for_delete != -1){
			strAppend += " <button type='button' onclick='tax_delete()' class='btn btn-danger btn-eql-wid btn-animate '>Remove</button>"
		}
		strAppend += " <button type='button' onclick='tax_clear()' class='btn btn-warning btn-animate btn-eql-wid btn-animate'>Cancel / Clear</button>"*/
			$('#tax_declaration_btn').html(strAppend);
	}
}


function onChangeamount(value){
	var amount_limit_id = $(value).attr('id');
	var tax_amount_value = $(value).val()
	var limit_amount = $(value).parent().prev().find('.amount_limit').val()
	console.log(typeof(tax_amount_value))
	if (parseInt(limit_amount) > parseInt(tax_amount_value)){
	}else{
		alert_lobibox('error',"Must be amount value less than or equal to amount limit value");
		$("#"+amount_limit_id).val('')
	}
}



//Tax Declaration details create function here 
function tax_create() {
	if(tax_create_form_validation())
	{
		tax_create_function();
	}
}

function tax_create_function(status){
	var tax_declaration_form_value = getFormValues("#tax_declaration_form");
	var csrf_data = tax_declaration_form_value.csrfmiddlewaretoken;
	delete tax_declaration_form_value["csrfmiddlewaretoken"];
	tax_declaration_form_value['is_active'] = "True";
	var pan_number = tax_declaration_form_value['pan_number'];
	if(pan_number){
		var regExp = /[a-zA-z]{5}\d{4}[a-zA-Z]{1}/; 
		if (pan_number.length == 10 ) { 
			if( pan_number.match(regExp) ){ 
				// alert('PAN match found');
				tax_declaration_form_value['pan_number'] = pan_number
			}
			else {
				$("#pan_error").html("Not a valid PAN number")
				return false 
			} 
		} 
		else { 
			$("#pan_error").html("Please enter 10 digits for a valid PAN number")
			return false
		} 
	}
	$("#tax_declaration_tbl_details td input").each(function(){
		$(this).attr('value',$(this).val())
	})
	var tax_declaration_table = $('#tax_declaration_tbl_details').html();
	tax_declaration_form_value['organization_id'] = validationFields($('#tax_organization').val());
	tax_declaration_form_value['organization_unit_id'] = validationFields($('#tax_organization_unit').val());
	tax_declaration_form_value['department_id'] = validationFields($('#tax_dep_name').val());
	tax_declaration_form_value['employee_id_id'] = validationFields($('#tax_employee_name').val());
	tax_declaration_form_value['employee_code'] = validationFields(tax_declaration_form_value['employee_code']);
	tax_declaration_form_value['gender_id'] = validationFields($('#tax_gender').val());
	tax_declaration_form_value['date_of_birth'] = dateFormatChange(validationFields(tax_declaration_form_value['date_of_birth']));
	tax_declaration_form_value['tax_declaration_data'] = tax_declaration_table;

	tax_declaration_list = [];
	tax_declaration_dict = {};
	tax_declaration_list.push(tax_declaration_form_value);
	tax_declaration_dict['tax_data'] = tax_declaration_list;
	$.ajax({	
		type  : 'POST',
		url   : '/tax_declaration_create/',
		async : false,
		data: {
			'datas': JSON.stringify(tax_declaration_dict),'update':status,
			csrfmiddlewaretoken: csrf_data,
		}
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		var res_status = data['status'];
		if(res_status == 'NTE_01') {	
			alert_lobibox("success", sysparam_datas_list[res_status]);
			button_create_tax(0)
			tax_clear();
			tax_employee_details();	
		}else if(res_status == 'NTE_03') {	
			alert_lobibox("success", sysparam_datas_list[res_status]);
			button_create_tax(0)
			tax_clear();
			tax_employee_details();	
		}
		else {
			alert_lobibox("error",sysparam_datas_list['ERR0040'])
		}
	});
}

function tax_update(){
	if(tax_create_form_validation())
	{
		tax_create_function(1);
	}
}

function tax_employee_details(){
	$('#tax_declaration_tbl_details').html("")
	$.ajax(
			{
				type:"GET",
				url: "/tax_declaration_employee_data/",
				async: false,
			}).done(function(json_data) {
				var tax_employee_data = JSON.parse(json_data);
				if(tax_employee_data.employee_data.length > 0){
					if(tax_employee_data.employee_data[0].pan_number){
						$("#tax_pan_number").val(tax_employee_data.employee_data[0].pan_number)
					}
					$("#tax_employee_code").val(tax_employee_data.employee_data[0].employee_id)
					$("#tax_dob").val(tax_employee_data.employee_data[0].date_of_birth)
					$("#tax_organization").val(tax_employee_data.employee_data[0].org_id_id).trigger('change')
					$("#tax_organization_unit").val(tax_employee_data.employee_data[0].org_unit_id_id).trigger('change')
					$("#tax_dep_name").val(tax_employee_data.employee_data[0].team_name_id).trigger('change')
					$("#tax_employee_name").val(tax_employee_data.employee_data[0].emp_name_id).trigger('change')
					$("#tax_gender").val(tax_employee_data.employee_data[0].employee_gender_id).trigger('change')
				}
				if (tax_employee_data.form_data_employee){
					button_create_tax(0)
					$('#tax_declaration_tbl_details').html(tax_employee_data.form_data_employee[0])
				}else{
					$('#tax_declaration_tbl_details').html(tax_employee_data.form_data[0])
				}
			});
}

//Tax Declaration form validation here
function tax_create_form_validation()
{
	return $('#tax_declaration_form').valid();
}

//validation for the empty
function validationFields(val){
	return val=='' || val =='0' ?null:val 
}

//date format change
function dateFormatChange(val){
	return val.split('-')[2]+'-'+val.split('-')[1]+'-'+val.split('-')[0]
}

//Tax Declaration form validation
$('#tax_declaration_form').submit(function(e) {
	e.preventDefault();    
}).validate({
	rules: {
		organization_id: {
			required: true,
			valueNotEquals:true,
		},
		employee_id_id: {
			required: true,
			valueNotEquals:true,
		},	  	   
		employee_code: {
			required: true,
			valueNotEquals:true, 
		},
		organization_unit_id: {
			required: true,
			valueNotEquals:true,
		},
		department_id: {
			required: true,
			valueNotEquals:true,
		},
		pan_number: {
			required: true,
		},
		gender_id: {
			required: true,
			valueNotEquals:true,
		},
		date_of_birth: {
			required: true,
		},
	},
	//For custom messages
	messages: {
		organization_id: {
			required: "Select Organization",
			valueNotEquals: "Select Organization", 
		},       
		employee_id_id: {
			required: "Select Employee",
			valueNotEquals: "Select Employee", 	  
		},	   
		employee_code: {
			required: "Enter the Employee Code",
			
		} ,
		organization_unit_id: {
			required: "Select Organization Unit",
			valueNotEquals: "Select Organization Unit", 
		},       
		department_id: {
			required: "Select Department",
			valueNotEquals: "Select Department", 	  
		},
		uan_number: {
			number: "UAN Number cannot be a Character",
			required: "Enter UAN Number",
			maxlength: "UAN Number cannot cannot exceed 12 Digits",
			minlength: "UAN Number cannot cannot be lesser than 12 Digits",
			//custom_pfn_number : "PF Number Already Exits"
		},
		pan_number:{
			required: "Enter PAN Number",
		},
		gender_id: {
			required: "Select Gender",
			valueNotEquals: "Select Gender", 	  
		},
		date_of_birth: {
			required: "Enter Effective From Date",
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

//Tax declaration clear function
function tax_clear(){
	button_create_tax(1);
	$('.thumbnail').html("");
	$('.errormessage').html("");	
	$('.tax_clear').val("");
	$("#tax_organization").val(0).trigger('change');
	$("#tax_organization_unit").val(0).trigger('change');	
	$("#tax_dep_name").val(0).trigger('change');
	$("#tax_employee_name").val(0).trigger('change');
	$("#tax_gender").val(0).trigger('change');
}

$("#tax_organization").change(function(){
	$(".clear1").html('')
});
$("#tax_organization_unit").change(function(){
	$(".clear6").html('')
});

$("#tax_dep_name").change(function(){
	$(".clear2").html('')
});
$("#tax_employee_name").change(function(){
	$(".clear3").html('')
});

$("#tax_gender").change(function(){
	$(".clear4").html('')
});

$('#tax_pan_number').keyup(function(){
	$(this).val($(this).val().toUpperCase());
});


