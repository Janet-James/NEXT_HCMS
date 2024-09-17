//Global variables declaration
var payment_table_id = 0;

$(document).ready(function(){
	document.getElementById('div_payment_advice_uan_no').style.display = "none";
	document.getElementById('div_payment_advice_pf_no').style.display = "none";
	document.getElementById('div_payment_advice_pan_no').style.display = "none";
	$("#div_payment_advice_account_holder_name").hide()
	$("#div_payment_advice_bank_name").hide()
	$("#div_payment_advice_branch_name").hide()
	$("#div_payment_advice_account_no").hide()
	$("#div_payment_advice_ifsc_code").hide()
	$("#div_payment_advice_branch_code").hide()
	payment_advice_table_dispaly();
	button_create_payment(1);
});

//org change
$("#payment_advice_compnay_name").change(function() {
	org_unit_payment($("#payment_advice_compnay_name  option:selected").val())
});

//org unit
function org_unit_payment(val){
	$.ajax({
		url : "/payment_org_unit_change_structure_data/",
		type : "GET",
		data : {'id':val},
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		dropDownListPayment(data.datas,'payment_organization_unit');
	});
}

//drop down list
function dropDownListPayment(data,id){
	strAppend = '<option value="0">--Select Organization Unit--</option>'
		if(data.length>0){
			for(var i=0;i<data.length;i++){
				strAppend += '<option value="'+data[i].id+'">'+data[i].name+'</option>'
			}
			$('#'+id).html(strAppend).change();
		}else{
			$('#'+id).html(strAppend).change();
		}
}

//org unit change
$("#payment_organization_unit").change(function() {
	department_payment($("#payment_organization_unit  option:selected").val())
});

//org unit
function department_payment(val){
	$.ajax({
		url : "/payment_department_change/",
		type : "GET",
		data : {'id':val},
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		datas = JSON.parse(json_data);
		departmentdropDownListPayment(datas.department_data,'payment_dep_name');
	});
}

//drop down list
function departmentdropDownListPayment(data,id){
	strAppend = '<option value="0">--Select Department--</option>'
		if(data.length>0){
			for(var i=0;i<data.length;i++){
				strAppend += '<option value="'+data[i].depart_id+'">'+data[i].depart_name+'</option>'
			}
			$('#'+id).html(strAppend).change();
		}else{
			$('#'+id).html(strAppend).change();
		}
}

//department change
$("#payment_dep_name").change(function() {
	employee_select_payment($("#payment_dep_name  option:selected").val())
});


function employee_select_payment(val){
	$.ajax({
		url : "/payment_employee_change_data/",
		type : "GET",
		data : {'id':val},
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		datas = JSON.parse(json_data);
		employeedropDownListPayment(datas.employee_data,'payment_advice_employe_name');
	});
}

//drop down list
function employeedropDownListPayment(data,id){
	strAppend = '<option value="0">--Select Employee --</option>'
		if(data.length>0){
			for(var i=0;i<data.length;i++){
				strAppend += '<option value="'+data[i].employee_id+'">'+data[i].employee_name+'</option>'
			}
			$('#'+id).html(strAppend).change();
		}else{
			$('#'+id).html(strAppend).change();
		}
}

function payment_advice_table_dispaly(){
	$.ajax({	
		type  : 'POST',
		url   : '/payment_advice_table_dispaly/',
		async : false,
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		if(data){
			payment_advice_datatable_function(data)
		}else{
			payment_advice_datatable_function(data)
		}
	});
}



//payment advice data table function here
function payment_advice_datatable_function(data)
{
	datatable_list = []
	if(data.length > 0){
		datatable_list = []
		for(var i=0;i<data.length;i++){
			list = []
			var sno = i+1
			list.push(data[i].id,sno,data[i].company_name,data[i].employee_name,data[i].payment_mode);
			datatable_list.push(list);
		}
		var title_name = 'Payment Advice'
		columns = [{'title':'ID'},{'title':'No.'},{'title':'Organization Name'},{'title':'Employee Name'},{'title':'Payment Mode'}]
		plaindatatable_btn('payment_advice_tbl_details', datatable_list, columns,0,'NEXT_TRANSFORM_HCMS_PAYMENT_ADVICE_'+currentDate(),title_name);
	}else{
		columns = [{'title':'ID'},{'title':'No.'},{'title':'Organization Name'},{'title':'Employee Name'},{'title':'Payment Mode'}]
		plaindatatable_btn('payment_advice_tbl_details', datatable_list, columns,0,'NEXT_TRANSFORM_HCMS_PAYMENT_ADVICE_'+currentDate(),title_name);
	}
	return false
}

//table row click get id
$("#payment_advice_tbl_details").on("click", "tr", function() {   
	var id = $('#payment_advice_tbl_details').dataTable().fnGetData(this)[0];
	//$(this).addClass('active');
	$(this).parents('table').find('tr').removeClass('active');
	$(this).addClass('active');
	//reg_table_id = id
	if (id != 'No data available'){
		payment_advice_table_row_click(id);
	}
});

//row click function in the table
function payment_advice_table_row_click(el){
	button_create_payment(0);
	var paymode;
	$.ajax(
			{
				type:"GET",
				url: "/payment_advice_table_row_click/",
				async: false,
				data : {'id':el},
				success: function (json_data) {
					data=JSON.parse(json_data);
					payment_table_id = data[0].id;
					paymode = data[0].payment_code
					var org_unit_change_id = data[0].organization_unit_id
					var department_change_id = data[0].department_id
					var employee_change_id = data[0].employee_id_id
					var payment_mode_id_val = data[0].payment_mode
					var bank_change_id = data[0].bank_name_id
					var account_holder_name = data[0].account_holder_name
					var account_number = data[0].account_no
					var ifsc_code_val = data[0].ifsc_code
					var branch_name_val = data[0].branch_name
					var pan_number_val = data[0].pan_number
					var uan_number_val = data[0].uan_number
					var branch_code_val = data[0].branch_code
					var pf_val = data[0].pf_number
					var pf_applicable_val = data[0].pf_applicable
					$('#payment_advice_compnay_name').val(data[0].company_id_id).trigger('change'); 
					$('#payment_organization_unit').val(org_unit_change_id).trigger('change');
					$('#payment_dep_name').val(department_change_id).trigger('change');
					$('#payment_advice_employe_name').val(employee_change_id).trigger('change');
					$('#payment_advice_mode').val(payment_mode_id_val).trigger('change'); 
					$("#payment_advice_bank_name").val(bank_change_id).trigger('change');
					$('#payment_advice_account_holder_name').val(account_holder_name); 
					$("#payment_advice_account_no").val(account_number);
					$("#payment_advice_ifsc_code").val(ifsc_code_val);
					$("#payment_advice_branch_name").val(branch_name_val);
					$("#payment_advice_branch_code").val(branch_code_val);					
					//get form value for field wise log list function
					payroll_activity_log_attribute_value('#payment_advice_form')
					
					if(pf_applicable_val == true){
						document.getElementById("payment_advice_pf_applicable").checked = pf_applicable_val;
						document.getElementById('div_payment_advice_uan_no').style.display = "block";
						document.getElementById('div_payment_advice_pan_no').style.display = "block";
						document.getElementById('div_payment_advice_pf_no').style.display = "block";
						$('#payment_advice_uan_no').val(uan_number_val); 
						$('#payment_advice_pan_number').val(pan_number_val); 
						$('#payment_advice_pf_no').val(pf_val); 
					}
					if(pf_applicable_val == false){
						document.getElementById("payment_advice_pf_applicable").checked = pf_applicable_val;
						document.getElementById('div_payment_advice_uan_no').style.display = "none";
						document.getElementById('div_payment_advice_pf_no').style.display = "none";
						document.getElementById('div_payment_advice_pan_no').style.display = "none";
					}
					//company_onchange(data[0].employee_id_id)
				}
			});
	if (paymode == 'CASHH')
	{
		$("#payment_advice_account_holder_name").val('');
		$("#payment_advice_bank_name").val('');
		$("#payment_advice_account_no").val('');
		$("#payment_advice_ifsc_code").val('');
		$("#payment_advice_branch_code").val('');
		$("#payment_advice_branch_name").val('');
	}
	if (paymode == 'ONLIN'){
		$("#div_payment_advice_account_holder_name").show()
		$("#div_payment_advice_bank_name").show()
		$("#div_payment_advice_branch_name").show()
		$("#div_payment_advice_account_no").show()
		$("#div_payment_advice_ifsc_code").show()
		$("#div_payment_advice_branch_code").show()
	}
	else{
		$("#div_payment_advice_account_holder_name").hide()
		$("#div_payment_advice_bank_name").hide()
		$("#div_payment_advice_branch_name").hide()
		$("#div_payment_advice_account_no").hide()
		$("#div_payment_advice_ifsc_code").hide()
		$("#div_payment_advice_branch_code").hide()

	}
	return false;
}

//button create function here
function button_create_payment(status){
	var access_for_create = jQuery.inArray( "Payroll Setup", JSON.parse(localStorage.Create) );
	var access_for_write = jQuery.inArray( "Payroll Setup", JSON.parse(localStorage.Write) );
	var access_for_delete = jQuery.inArray( "Payroll Setup", JSON.parse(localStorage.Delete) );
	if(status == 1){
		if (access_for_create != -1){
			strAppend = "<button type='button' onclick='payment_advice_create()' class='btn btn-success btn-eql-wid btn-animate'>Add</button>"
		}
		strAppend += " <button type='button' onclick='payment_advice_clear()' class='btn btn-warning btn-animate btn-eql-wid btn-animate'>Cancel / Clear</button>"
			$('#hrms_payment_btn').html(strAppend);
	}else{
		if(access_for_write != -1){
			strAppend = "<button type='button' onclick='payment_advice_update()' class='btn btn-primary btn-eql-wid btn-animate '>Update</button>"
		}if (access_for_delete != -1){
			strAppend += " <button type='button' onclick='payment_advice_delete()' class='btn btn-danger btn-eql-wid btn-animate '>Remove</button>"
		}
		strAppend += " <button type='button' onclick='payment_advice_clear()' class='btn btn-warning btn-animate btn-eql-wid btn-animate'>Cancel / Clear</button>"
			$('#hrms_payment_btn').html(strAppend);
	}
}

//payment advice details create function here 
function payment_advice_create() {
	if(payment_advice_form_validation())
	{
		payment_advice_create_function();
	}
}

//update function
function payment_advice_update(){
	payment_advice_create_function();
}

//payment advice create function here
function payment_advice_create_function()
{
	var payment_advice_form_value = getFormValues("#payment_advice_form");
	var csrf_data = payment_advice_form_value.csrfmiddlewaretoken;
	delete payment_advice_form_value["csrfmiddlewaretoken"];
	payment_advice_form_value['is_active'] = "True";
	var payment_mode_code = $("#payment_advice_mode option:selected").attr("data-code");
	var  pf_applicable=$("#payment_advice_pf_applicable").is(':checked')? true:false;
	payment_advice_form_value["pf_applicable"]=pf_applicable
	if(pf_applicable == true){
		var uan_number = payment_advice_form_value['uan_number'];
		var pan_number = payment_advice_form_value['pan_number'];
		if(pan_number){
			var regExp = /[a-zA-z]{5}\d{4}[a-zA-Z]{1}/; 
			if (pan_number.length == 10 ) { 
				if( pan_number.match(regExp) ){ 
					// alert('PAN match found');
					payment_advice_form_value['pan_number'] = pan_number
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
	}

	payment_advice_form_value['company_id_id'] = validation(payment_advice_form_value['company_id_id']);
	payment_advice_form_value['employee_id_id'] = validation(payment_advice_form_value['employee_id_id']);
	payment_advice_form_value['payment_mode'] = validation(payment_advice_form_value['payment_mode']);
	payment_advice_form_value['organization_unit_id'] = validation(payment_advice_form_value['organization_unit_id']);
	payment_advice_form_value['department_id'] = validation(payment_advice_form_value['department_id']);

	/*if(document.getElementById("payment_advice_pf_applicable").checked==false){
		delete payment_advice_form_value.uan_number 
		delete payment_advice_form_value.pan_number 
		delete payment_advice_form_value.pf_number 
	}*/
	if(payment_mode_code == 'ONLIN'){
		/*payment_advice_form_value['account_holder_name'] = payment_advice_form_value['account_holder_name'];
		payment_advice_form_value['bank_name_id'] = payment_advice_form_value['bank_name_id'];
		payment_advice_form_value['branch_name'] = payment_advice_form_value['branch_name']; 
		payment_advice_form_value['account_no'] = account_no_validation(payment_advice_form_value['account_no']); 
		payment_advice_form_value['ifsc_code'] = payment_advice_form_value['ifsc_code']; */
		var account_number = payment_advice_form_value['account_no'];
		var acc_holder_name = payment_advice_form_value['account_holder_name'];
		var branch_name = payment_advice_form_value['branch_name'];
		var ifsc_code =  payment_advice_form_value['ifsc_code'];
		var branch_code =  payment_advice_form_value['branch_code'];
		var bank_name = payment_advice_form_value['bank_name_id'];
		if(account_number){
			if(isNaN(account_number)) {
				$("#acc_no_alert").html("Account number is not a number")
				return false
			}/*else if(account_number.length != 15 ){
				$("#acc_no_alert").html("Account number should be contain 15 digit")
				return false
			}*/else{
				payment_advice_form_value['account_no'] = account_number
			}
		}else{
			$("#acc_no_alert").html("Account number should not empty")
		}

		if(acc_holder_name){
			if(isNaN(acc_holder_name)) {
				payment_advice_form_value['account_holder_name'] = acc_holder_name
			}else{
				$("#acc_name_alert").html("Account holder name is not a string")
				return false
			}
		}else{
			$("#acc_name_alert").html("Account holder name should not empty")
		}
		if(branch_name){
			if(isNaN(branch_name)) {
				payment_advice_form_value['branch_name'] = branch_name
			}else{
				$("#branch_name_alert").html("Branch name should not empty")
				return false
			}
		}else{
			$("#branch_name_alert").html("Branch name should not empty")
			return false
		}
		if(bank_name == '0'){
			$("#bank_name_alert").html("Bank name should not empty")
			return false
		}else{
			payment_advice_form_value['bank_name_id'] = bank_name
		}
		if(ifsc_code){
			payment_advice_form_value['ifsc_code'] = ifsc_code
		}else{
			$("#ifsc_code_alert").html("IFSC code should not empty")
			return false
		}
		if(branch_code){
			payment_advice_form_value['branch_code'] = branch_code
		}else{
			$("#branch_code_alert").html("Branch code should not empty")
			return false
		}


	}else{
		//payment_advice_form_value['payment_mode'] = ''
			payment_advice_form_value['bank_name_id'] = ''
	}
	payment_advice_list = [];
	payment_advice_dict = {};
	payment_advice_list.push(payment_advice_form_value);
	payment_advice_dict['payment_adivces'] = payment_advice_list;
	//get form value for field wise log list function
	var payment_activity_list = []
	payment_activity_list = payroll_activity_log('#payment_advice_form')

	if(payment_table_id == 0){
		var employee_id_check_val = employee_id_check() 
		if (employee_id_check_val['status'] == 'Value is empty'){
			$.ajax({	
				type  : 'POST',
				url   : '/payment_advice_create/',
				async : false,
				data: {
					'datas': JSON.stringify(payment_advice_dict),
					'log_data':JSON.stringify(payment_activity_list),
					"table_id": payment_table_id,
					csrfmiddlewaretoken: csrf_data,
				},
			}).done( function(json_data) {
				data = JSON.parse(json_data);
				var res_status = data['status'];
				if(res_status == 'NTE_01') {	
					alert_lobibox("success", sysparam_datas_list[res_status]);
					button_create_payment(1)
					payment_advice_clear();
					payment_advice_table_dispaly();
					payment_activity_list = []
					payroll_log_activity();
				}
				else {
					alert_lobibox("error",sysparam_datas_list['ERR0040'])
				}
			});
		}
	}else{
		$.ajax({	
			type  : 'POST',
			url   : '/payment_advice_create/',
			async : false,
			data: {
				'datas': JSON.stringify(payment_advice_dict),
				'log_data':JSON.stringify(payment_activity_list),
				"table_id": payment_table_id,
				csrfmiddlewaretoken: csrf_data,
			},
		}).done( function(json_data) {
			data = JSON.parse(json_data);
			var res_status = data['status'];
			if(res_status == 'NTE_03') {	
				alert_lobibox("success", sysparam_datas_list[res_status]);
				button_create_payment(1)
				payment_advice_clear();
				payment_advice_table_dispaly();
				payment_activity_list = []
				payroll_log_activity();
			}
			else {
				alert_lobibox("error",sysparam_datas_list['ERR0040'])
			}
		});
	}
}

//delete function
function payment_advice_delete(){
	//var payment_title = $('#ta_candidate_list option:selected').text();
	removeConfirmation('payment_advice_delete_function','','This Payment Mode');
}

//delete function
function payment_advice_delete_function(){
	$.ajax({	
		type  : 'POST',
		url   : '/payment_advice_create/',
		async : false,
		data: {
			"delete_id": payment_table_id,
			csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val(),
		},
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		var res_status = data['status'];
		if(res_status == 'NTE_04') {	
			alert_lobibox("success", sysparam_datas_list[res_status]);
			button_create_payment(1)
			payment_advice_clear();
			payment_advice_table_dispaly();	
			payment_activity_list = []
			payroll_log_activity();
		}
		else {
			alert_lobibox("error",sysparam_datas_list['ERR0028'])
		}
	});
}

function employee_id_check (){
	var data_val=''
		var emp_id =$("#payment_advice_employe_name option:selected").val()
		$.ajax({
			url : '/employee_id_check/',
			type : 'GET',
			data:{"id":emp_id},
			async:false,}).done(
					function(json_data)
					{
						data_val = JSON.parse(json_data);
						if(data_val['status'] == 'value_success'){
							alert_lobibox("error",'Payment advice has been already defined for this employee');
						}
					});
	//console.log("data_val",data_val)
	return data_val
}

//payment advice form validation here
function payment_advice_form_validation()
{
	return $('#payment_advice_form').valid();
}

//payment advice form validation
$('#payment_advice_form').submit(function(e) {
	e.preventDefault();    
}).validate({
	rules: {
		company_id_id: {
			required: true,
			valueNotEquals:true,
		},
		employee_id_id: {
			required: true,
			valueNotEquals:true,
		},	  	   
		payment_mode: {
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
		/*uan_number: {
			number: true,
			required: true,
			maxlength: 12,	
			minlength: 12,
			//custom_pfn_number  : true,
		},
		pan_number: {
			required: true,
		},*/
		/*pf_applicable: {
			required: true,
		},*/
		/*pf_number:{
			required: true,
		}*/


	},
	//For custom messages
	messages: {
		company_id_id: {
			required: "Select Organization",
			valueNotEquals: "Select Organization", 
		},       
		employee_id_id: {
			required: "Select Employee",
			valueNotEquals: "Select Employee", 	  
		},	   
		payment_mode: {
			required: "Select Payment Mode",
			valueNotEquals:"Select Payment Mode", 
		} ,
		organization_unit_id: {
			required: "Select Organization Unit",
			valueNotEquals: "Select Organization Unit", 
		},       
		department_id: {
			required: "Select Department",
			valueNotEquals: "Select Department", 	  
		},
		/*uan_number: {
			number: "UAN Number cannot be a Character",
			required: "Enter UAN Number",
			maxlength: "UAN Number cannot cannot exceed 12 Digits",
			minlength: "UAN Number cannot cannot be lesser than 12 Digits",
			//custom_pfn_number : "PF Number Already Exits"
		},
		pan_number:{
			required: "Enter PAN Number",
		},
		pf_applicable:{
			required: "Select PF applicable ",
		},
		pf_number:{
			required: "Select PF applicable ",
		},
*/
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

//validation for the empty
function validation(val){
	return val=='' || val =='0' ?null:val 
}

//onchange function for payment mode to hide and show function 
$('#payment_advice_mode').change(function() {
	$('.errormessage').html("");
	var payment_mode = $("#payment_advice_mode option:selected").attr("data-code");
	if (payment_mode == 'ONLIN'){
		$("#div_payment_advice_account_holder_name").show()
		$("#div_payment_advice_bank_name").show()
		$("#div_payment_advice_branch_name").show()
		$("#div_payment_advice_account_no").show()
		$("#div_payment_advice_ifsc_code").show()
		$("#div_payment_advice_branch_code").show()
	}
	else if (payment_mode == 'CASHH'){
		$('.clear').val(""); 
		$("#payment_advice_bank_name").val(0).trigger('change');
		$("#div_payment_advice_account_holder_name").hide()
		$("#div_payment_advice_bank_name").hide()
		$("#div_payment_advice_branch_name").hide()
		$("#div_payment_advice_account_no").hide()
		$("#div_payment_advice_ifsc_code").hide()
		$("#div_payment_advice_branch_code").hide()
	}
	else{
		$('.clear').val(""); 
		$("#payment_advice_bank_name").val(0).trigger('change');
		$("#div_payment_advice_account_holder_name").hide()
		$("#div_payment_advice_bank_name").hide()
		$("#div_payment_advice_branch_name").hide()
		$("#div_payment_advice_account_no").hide()
		$("#div_payment_advice_ifsc_code").hide()
		$("#div_payment_advice_branch_code").hide()
	}

});

//PF Applicable Check Box On change
function PF_Applicable_Checkbox(pf_applicable_value) {
	if(pf_applicable_value.checked==true){
		document.getElementById('div_payment_advice_uan_no').style.display = "block";
		document.getElementById('div_payment_advice_pf_no').style.display = "block";
		document.getElementById('div_payment_advice_pan_no').style.display = "block";
	}
	if(pf_applicable_value.checked==false){
		$('.text_clear').val(""); 
		document.getElementById('div_payment_advice_uan_no').style.display = "none";
		document.getElementById('div_payment_advice_pf_no').style.display = "none";
		document.getElementById('div_payment_advice_pan_no').style.display = "none";
	}
}

//Payment Advice clear function
function payment_advice_clear(){
	button_create_payment(1);
	payment_table_id = 0;
	$('.thumbnail').html("");
	$('.errormessage').html("");	
	$('.payment_clear').val(""); 
	$("#payment_advice_compnay_name").val(0).trigger('change');
	$("#payment_advice_employe_name").val(0).trigger('change');	
	$("#payment_advice_bank_name").val(0).trigger('change');
	$("#payment_advice_mode").val(0).trigger('change');
	$('.text_clear').val(""); 
	document.getElementById("payment_advice_pf_applicable").checked = false
	document.getElementById('div_payment_advice_uan_no').style.display = "none";
	document.getElementById('div_payment_advice_pf_no').style.display = "none";
	document.getElementById('div_payment_advice_pan_no').style.display = "none";
}
$('#payment_advice_compnay_name').change(function() {
	$('.errormessage').html("");
});
$('#payment_advice_employe_name').change(function() {
	$('.errormessage').html("");
});
$('#payment_dep_name').change(function() {
	$('.errormessage').html("");
});
$('#payment_organization_unit').change(function() {
	$('.errormessage').html("");
});
$('#payment_advice_account_holder_name').keypress(function(event){
	$("#acc_name_alert").html('')
});

$('#payment_advice_bank_name').change(function() {
	$("#bank_name_alert").html('')
});

$('#payment_advice_branch_name').keypress(function(event){
	$("#branch_name_alert").html('')
});

$('#payment_advice_account_no').keypress(function(event){
	$("#acc_no_alert").html('')
});

$('#payment_advice_ifsc_code').keypress(function(event){
	$("#ifsc_code_alert").html('')
});

$('#payment_advice_branch_code').keypress(function(event){
	$("#branch_code_alert").html('')
});

$('#payment_advice_pan_number').keypress(function(event){
	$("#pan_error").html('')
});

$('#payment_advice_pan_number').keyup(function(){
	$(this).val($(this).val().toUpperCase());
});
