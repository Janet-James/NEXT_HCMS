//Global variables declaration
var reg_table_id = 0;

$(document).ready(function(){
	contribution_register_table_dispaly();
	button_create_contribution(1);
	//payroll_log_activity();
	//con_code_auto_generate();
});

function contribution_register_table_dispaly(){
	$.ajax({	
		type  : 'POST',
		url   : '/contribution_register_table_display/',
		async : false,
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		if(data){
			contribution_register_datatable_function(data)
		}else{
			contribution_register_datatable_function(data)
		}
		
	});

}

//contribution_register data table function here
function contribution_register_datatable_function(data)
{
	datatable_list = []
	if(data.length > 0){
		datatable_list = []
		for(var i=0;i<data.length;i++){
			list = []
			var sno = i+1
			if (data[i].contributor == '1')
				{
				var contributor = 'Employee'
				}else{
					var contributor = 'Employer'
				}
			list.push(data[i].id,sno,data[i].contribution_register_name,data[i].contribution_register_code,contributor,data[i].contribution,data[i].refitems_name);
			datatable_list.push(list);
		}
        var title_name = 'Contribution Register'
		columns = [{'title':'ID'},{'title':'No.'},{'title':'Name'},{'title':'Code'},{'title':'Contributor'},{'title':'Contribution'},{'title':'Salary Component'}]
		plaindatatable_btn('contribution_register_details', datatable_list, columns,0,'NEXT_TRANSFORM_HCMS_CONTRIBUTION_REGISTER_'+currentDate(),title_name);
	}else{
		columns = [{'title':'ID'},{'title':'No.'},{'title':'Name'},{'title':'Code'},{'title':'Contributor'},{'title':'Contribution'},{'title':'Salary Component'}]
		plaindatatable_btn('contribution_register_details', datatable_list, columns,0,'NEXT_TRANSFORM_HCMS_CONTRIBUTION_REGISTER_'+currentDate(),title_name);
	}
	
	return false
}

//table row click get id
$("#contribution_register_details").on("click", "tr", function() {   
	var id = $('#contribution_register_details').dataTable().fnGetData(this)[0];
	$(this).parents('table').find('tr').removeClass('active');
	$(this).addClass('active');
	//reg_table_id = id

	if (id != 'No data available'){
		contributor_reg_table_row_click(id);
	}
});

//row click function in the table
function contributor_reg_table_row_click(el){
	button_create_contribution(0);
	$.ajax(
			{
				type:"GET",
				url: "/contributor_reg_table_row_click/",
				async: false,
				data : {'id':el},
				success: function (json_data) {
					data=JSON.parse(json_data);
					for (i=0;i<data.length;i++){
						reg_table_id = data[i].id;
//						$('#hr_contribution_register_name').attr("old-value",data[i].contribution_register_name); 
//						$('#hr_contribution_register_code').attr("old-value",data[i].contribution_register_code);
//						$('#hr_con_reg_contribution').attr("old-value",data[i].contribution);
						
						$('#hr_contribution_register_name').val(data[i].contribution_register_name); 
						$('#hr_contribution_register_code').val(data[i].contribution_register_code); 
						$('#hr_contribution_register_description').val(data[i].description);
						$("#hr_con_reg_contributor").val(data[i].contributor).trigger('change');
						
//						$('#hr_con_reg_contributor').attr("data-code",$("#hr_con_reg_contributor option:selected").text());
						$("#hr_con_reg_contribution").val(data[i].contribution);
						$("#contribution_salary_rule_component").val(data[i].salary_compontent_id).trigger('change');
//						$('#contribution_salary_rule_component').attr("data-code",$("#contribution_salary_rule_component option:selected").text());
						
						//get form value for field wise log list function
						payroll_activity_log_attribute_value('#contribution_register_form')
					}
				}
			});
	return false;   
} 
//button create function here 
function button_create_contribution(status){
	var access_for_create = jQuery.inArray( "Payroll Setup", JSON.parse(localStorage.Create) );
	var access_for_write = jQuery.inArray( "Payroll Setup", JSON.parse(localStorage.Write) );
	var access_for_delete = jQuery.inArray( "Payroll Setup", JSON.parse(localStorage.Delete) );	
	if(status == 1){
		if (access_for_create != -1){
		strAppend = "<button type='button' onclick='contribution_reg_create()' class='btn btn-success btn-eql-wid btn-animate'>Add</button>"
		}strAppend += " <button type='button' onclick='contribution_reg_clear()' class='btn btn-warning btn-animate btn-eql-wid btn-animate'>Cancel / Clear</button>"
				$('#hrms_contribution_btn').html(strAppend);
	}else{
		if (access_for_write != -1){
		strAppend = "<button type='button' onclick='contribution_reg_update()' class='btn btn-primary btn-eql-wid btn-animate '>Update</button>"
		}//if (access_for_delete != -1){
			strAppend += " <button type='button' onclick='contribution_reg_delete()' class='btn btn-danger btn-eql-wid btn-animate '>Remove</button>"
		//}
				strAppend += " <button type='button' onclick='contribution_reg_clear()' class='btn btn-warning btn-animate btn-eql-wid btn-animate'>Cancel / Clear</button>"
					$('#hrms_contribution_btn').html(strAppend);
	}
}

//Contribution Register details create function here 
function contribution_reg_create() {
	if(contribution_register_form_validation())
	{
		contribution_register_create_function();
	}
}

//Contribution Register form validation here
function contribution_register_form_validation()
{
	return $('#contribution_register_form').valid();
}

//Contribution Register create function here
function contribution_register_create_function()
{
	var contribution_register_form_value = getFormValues("#contribution_register_form");
	var csrf_data = contribution_register_form_value.csrfmiddlewaretoken;
	delete contribution_register_form_value["csrfmiddlewaretoken"];
	contribution_register_form_value['is_active'] = "True";

	contribution_register_form_value['contribution_register_name'] = validationFields(contribution_register_form_value['contribution_register_name']);
	contribution_register_form_value['contribution_register_code'] = validationFields(contribution_register_form_value['contribution_register_code']);
	contribution_register_form_value['description'] = validationFields(contribution_register_form_value['description']);
	contribution_register_form_value['contributor_id'] = validationFields(contribution_register_form_value['contributor_id']);
	contribution_register_form_value['contribution'] = validationFields(contribution_register_form_value['contribution']);
	contribution_register_form_value['salary_compontent_id'] = validationFields(contribution_register_form_value['salary_compontent_id']);

	contribution_register_list = [];
	contribution_register_dict = {};
	contribution_register_list.push(contribution_register_form_value);
	contribution_register_dict['input_data'] = contribution_register_list;
	var contribution_activity_list = []
/*	if ($('#hr_contribution_register_name').val() != $('#hr_contribution_register_name').attr('old-value')) {
		contribution_activity_list.push({'field_name':$.trim($('#hr_contribution_register_name').parent().siblings('label').clone().children().remove().end().text()),
			'old_value':$('#hr_contribution_register_name').attr('old-value'),
			'new_value':$('#hr_contribution_register_name').val()})
	}
	if ($('#hr_contribution_register_code').val() != $('#hr_contribution_register_code').attr('old-value')) {
		contribution_activity_list.push({'field_name':$.trim($('#hr_contribution_register_code').parent().siblings('label').clone().children().remove().end().text()),
			'old_value':$('#hr_contribution_register_code').attr('old-value'),
			'new_value':$('#hr_contribution_register_code').val()})
	}
	if ($('#hr_con_reg_contributor option:selected').text() != $('#hr_con_reg_contributor').attr('data-code')){
		contribution_activity_list.push({'field_name':$.trim($('#hr_con_reg_contributor').siblings('label').clone().children().remove().end().text()),
	'old_value':$('#hr_con_reg_contributor').attr('data-code'),
	'new_value':$('#hr_con_reg_contributor option:selected').text()})
	}
	if ($('#hr_con_reg_contribution').val() != $('#hr_con_reg_contribution').attr('old-value')) {
		contribution_activity_list.push({'field_name':$.trim($('#hr_con_reg_contribution').parent().siblings('label').clone().children().remove().end().text()),
			'old_value':$('#hr_con_reg_contribution').attr('old-value'),
			'new_value':$('#hr_con_reg_contribution').val()})
	}
	if ($('#contribution_salary_rule_component').val() != $('#contribution_salary_rule_component').attr('data-code')){
		contribution_activity_list.push({'field_name':$.trim($('#contribution_salary_rule_component').siblings('label').clone().children().remove().end().text()),
	'old_value':$('#contribution_salary_rule_component').attr('data-code'),
	'new_value':$('#contribution_salary_rule_component option:selected').text()})
	}
	*/
	//get form value for field wise log list
	contribution_activity_list = payroll_activity_log('#contribution_register_form')
	
	$.ajax({	
		type  : 'POST',
		url   : '/contribution_register_create/',
		async : false,
		data: {
			'datas': JSON.stringify(contribution_register_list),
			'log_data':JSON.stringify(contribution_activity_list),
			"table_id": reg_table_id,
			csrfmiddlewaretoken: csrf_data,
		}
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		var res_status = data['status'];
		if(res_status == 'NTE_01') {	
			alert_lobibox("success", sysparam_datas_list[res_status]);
			button_create_contribution(1)
			contribution_reg_clear();
			contribution_register_table_dispaly();	
			$('#hr_contribution_register_code').val(''); 
			contribution_activity_list = []
			payroll_log_activity();
			//con_code_auto_generate();
		}else if(res_status == 'NTE_03') {	
			alert_lobibox("success", sysparam_datas_list[res_status]);
			button_create_contribution(1)
			contribution_reg_clear();
			contribution_register_table_dispaly();
			contribution_activity_list = []
			payroll_log_activity();
		}else if(res_status == 'Already Exist') {
			alert_lobibox("error",'Contribution Register Code Already Exist')
		}
		else {
			alert_lobibox("error",sysparam_datas_list['ERR0040'])
		}
	});
}

//update function
function contribution_reg_update(){
	contribution_reg_create();
}

//delete function
function contribution_reg_delete(){
	var contribution_title = $('#hr_contribution_register_name').val();
	removeConfirmation('contribution_reg_details_delete_function','',contribution_title);
}

//delete function
function contribution_reg_details_delete_function(){
	$.ajax({	
		type  : 'POST',
		url   : '/contribution_register_create/',
		async : false,
		data: {
			"delete_id": reg_table_id,
			csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val(),
		},
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		var res_status = data['status'];
		if(res_status == 'NTE_04') {	
			alert_lobibox("success", sysparam_datas_list[res_status]);
			button_create_contribution(1)
			contribution_reg_clear();
			contribution_register_table_dispaly();
			$('#hr_contribution_register_code').val(''); 
			contribution_activity_list = []
			payroll_log_activity();
			//con_code_auto_generate();
		}
		else {
			alert_lobibox("error",sysparam_datas_list['ERR0028'])
		}
	});
}

//validation for the empty
function validationFields(val){
	return val=='' || val =='0' ?null:val 
}

$.validator.addMethod("alpha", function(value, element) {
    return this.optional(element) || value == value.match(/^[a-zA-Z\s]+$/);
});

//contribution register form validation
$('#contribution_register_form').submit(function(e) {
	e.preventDefault();    
}).validate({
	rules: {
		contribution_register_name: {
			required: true,
			maxlength: 50,	
			alpha: true,
		},
		contribution_register_code: {
			//alpha:true,
			required:true,
			maxlength:5,
			minlength:5,
		},	  	   
		contributor_id: {
			required: true,
			valueNotEquals:true, 
		},   
		contribution: {
			required: true,
			number:true, 
		},	  
		salary_compontent_id: {
			required: true,
			valueNotEquals:true, 
		},
	},
	//For custom messages
	messages: {
		contribution_register_name: {
			required: "Enter contribution register name",
			maxlength: "Name cannot exceed 50 characters",
			alpha: "Name cannot have numbers",
		},       
		contribution_register_code: {
			required: "Enter contribution register code", 
			//alpha: "Code cannot have numbers",
			maxlength: "Contribution register code cannot exceed 5 digits",
			minlength: "Contribution register cannot lesser than 5 digits",    	  
		},	   
		contributor_id: {
			required: "Select an contributor",
			valueNotEquals:"Select an contributor", 
		},
		contribution: {
			required: "Enter contribution",
			number: "Enter only a number", 
		},
		salary_compontent_id: {
			required: "Select a salary compontent",
			valueNotEquals: "Select a salary compontent", 
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


// contribution clear function
function contribution_reg_clear(){
	button_create_contribution(1);
	reg_table_id = 0
	$('.thumbnail').html("")
	$('.errormessage').html("");	
	$('#hr_contribution_register_name').val(''); 
	//$('#hr_contribution_register_code').val(''); 
	$('#hr_contribution_register_description').val('');
	$("#hr_con_reg_contribution").val('');
	$("#hr_con_reg_contributor").val(0).trigger('change');
	$("#contribution_salary_rule_component").val(0).trigger('change');	

}

$("#contribution_salary_rule_component").change(function(){
	$("#salary_compontent_id_clear").html('')
});

$("#hr_con_reg_contributor").change(function(){
	$("#contributor_clear").html('')
});

$('#hr_contribution_register_code').keyup(function(){
    $(this).val($(this).val().toUpperCase());
});

$('#hr_contribution_register_name').keyup(function(){
    $(this).val($(this).val().charAt(0).toUpperCase() + $(this).val().slice(1));
});


/*function con_code_auto_generate() {
	$.ajax(
			{
				type:"GET",
				url: "/contribution_code_generate/",
				async: false,
			}).done(function(json_data) {
				var contribution_code = JSON.parse(json_data);
				if (contribution_code){
					$("#hr_contribution_register_code").val(contribution_code.reg_code)
				}
			});
}*/

//logger div toogle
$(".logswitcher-toggle").click(function() {
    $("#logpayrollswitcher").toggleClass("open");
});

//logger div
function logpayrollInfo(logData){
	loggerContent = '';
	createLogger = ''
	if(logData.length > 0){
		for(var i = 0; i < logData.length; i++){
			if (logData[i].status == 'create'){
				loggerContent += '<li><h1>'+logData[i].status.toUpperCase()+'</h1>';
				loggerContent += '<table>'
					if(logData[i].form_name == 'Salary Rule'){
						loggerContent += '<tr><td class="firststyle"> This ('+logData[i].field_name+') Salary Rule created by '+logData[i].user_name+' </td></tr>'
					}else if(logData[i].form_name == 'Payslip'){
						loggerContent += '<tr><td class="firststyle"> This ('+logData[i].field_name+') Payslip created by '+logData[i].user_name+' </td></tr>'
					}else if(logData[i].form_name == 'Contribution Register'){
						loggerContent += '<tr><td class="firststyle"> This ('+logData[i].field_name+') Contribution Register created by '+logData[i].user_name+' </td></tr>'
					}else if(logData[i].form_name == 'Salary Contract'){
						loggerContent += '<tr><td class="firststyle"> This ('+logData[i].field_name+') Salary Contract created by '+logData[i].user_name+' </td></tr>'
					}else if(logData[i].form_name == 'TDS'){
						loggerContent += '<tr><td class="firststyle"> This ('+logData[i].field_name+') TDS created by '+logData[i].user_name+' </td></tr>'
					}else if(logData[i].form_name == 'Salary Structure'){
						loggerContent += '<tr><td class="firststyle"> This ('+logData[i].field_name+') Salary Structure created by '+logData[i].user_name+' </td></tr>'
					}else if(logData[i].form_name == 'Payment Advice'){
						loggerContent += '<tr><td class="firststyle"> This ('+logData[i].field_name+') Payment Advice created by '+logData[i].user_name+' </td></tr>'
					}
				
				loggerContent += '<tr><td class="firststyle">Created date </td><td class="secondstyle"><b>'+logData[i].created_date+'</b></td></tr>'
				loggerContent += '</table></li><hr>';
				
			}else if (logData[i].status == 'delete'){
				loggerContent += '<li><h1>'+logData[i].status.toUpperCase()+'</h1>';
				loggerContent += '<table>'
					//console.log("ccccccc",logData[i].form_name)
					if(logData[i].form_name == 'Salary Rule'){
						loggerContent += '<tr><td class="firststyle"> This ('+logData[i].field_name+') Salary Rule deleted by '+logData[i].user_name+' </td></tr>'
					}else if(logData[i].form_name == 'Payslip'){
						loggerContent += '<tr><td class="firststyle"> This ('+logData[i].field_name+') Payslip deleted by '+logData[i].user_name+' </td></tr>'
					}else if(logData[i].form_name == 'Contribution Register'){
						loggerContent += '<tr><td class="firststyle"> This ('+logData[i].field_name+') Contribution Register deleted by '+logData[i].user_name+' </td></tr>'
					}else if(logData[i].form_name == 'Salary Contract'){
						loggerContent += '<tr><td class="firststyle"> This ('+logData[i].field_name+') Salary Contract deleted by '+logData[i].user_name+' </td></tr>'
					}else if(logData[i].form_name == 'TDS'){
						loggerContent += '<tr><td class="firststyle"> This ('+logData[i].field_name+') TDS deleted by '+logData[i].user_name+' </td></tr>'
					}else if(logData[i].form_name == 'Salary Structure'){
						loggerContent += '<tr><td class="firststyle"> This ('+logData[i].field_name+') Salary Structure deleted by '+logData[i].user_name+' </td></tr>'
					}else if(logData[i].form_name == 'Payment Advice'){
						loggerContent += '<tr><td class="firststyle"> This ('+logData[i].field_name+') Payment Advice deleted by '+logData[i].user_name+' </td></tr>'
					}
				
				loggerContent += '<tr><td class="firststyle">Modified date </td><td class="secondstyle"><b>'+logData[i].modified_date+'</b></td></tr>'
				loggerContent += '</table></li><hr>';
				
			}else{
				loggerContent += '<li><h1>'+logData[i].status.toUpperCase()+'</h1>';
				loggerContent += '<table>'
				loggerContent += '<tr><td class="firststyle">Field Name </td><td class="secondstyle"><b>'+logData[i].field_name+'</b></td></tr>'
				loggerContent += '<tr><td class="firststyle">Original Data </td><td class="secondstyle"><b>'+logData[i].old_value+'</b></td></tr>'
				loggerContent += '<tr><td class="firststyle">Change Data</td><td class="secondstyle"> <b>'+logData[i].new_value+'</b></td></tr>'
				//loggerContent += '<tr><td class="firststyle">Created by </td><td class="secondstyle"><b>'+logData[i].user_name+'</b></td></tr>'
				loggerContent += '<tr><td class="firststyle">Modified by </td><td class="secondstyle"><b>'+logData[i].user_name+'</b></td></tr>'
				//loggerContent += '<tr><td class="firststyle">Created date </td><td class="secondstyle"><b>'+logData[i].created_date+'</b></td></tr>'
				loggerContent += '<tr><td class="firststyle">Modified date </td><td class="secondstyle"><b>'+logData[i].modified_date+'</b></td></tr>'
//				loggerContent += 'Status <b>'+logData[i].status+'</b></p></li><hr>'
				loggerContent += '</table></li>';
				loggerContent += '<hr>'
			}
			
		}
	}else{
		loggerContent += '<li><h1 class="no_data_found">No Data Found.</h1></li>';
	}
	//$('#log_pay_roll_info_div').html(createLogger);
	$('#log_pay_roll_info_div').html(loggerContent);
}

//logger search
$('#logpayrollSearch').on("keyup", function(e) {
	if (e.keyCode == 13) {
		var logValue = this.value;
		if(logValue != ''){
			var searchDatas = logSearchList({'getValue':logValue,'getKey':'log_details'})//search content call
			if(searchDatas.length > 0){
				logInfo(searchDatas);//search value parse
			}else{
				$('#log_pay_roll_info_div').html('<li><h1 class="no_data_found">No Data Found !</h1></li>');
			}
		}else{
			logInfo(result_data.log_details);
		}
		
	}
});

//search list in local data
function logSearchList(data){
	var searchDatas = []
	var getData = result_data[data['getKey']];
	for(var i=0; i<getData.length; i++){
		var getNames = (getData[i].title).toString().toLowerCase();
		var searchValue = (data['getValue']).toString().toLowerCase();
		if (getNames.indexOf(searchValue) > -1) {
			  searchDatas.push(getData[i]);
			} 
	}
	return searchDatas;
}

function payroll_log_activity(){
	$.ajax({	
		type  : 'POST',
		url   : '/payroll_activity_data/',
		data  : {tab_id : get_tab_id},
		async : false,
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		if(data){
			logpayrollInfo(data);
		}
	});
}

//end function call for this page
payroll_log_activity()
