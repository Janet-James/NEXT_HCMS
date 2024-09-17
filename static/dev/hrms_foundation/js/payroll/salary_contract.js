//Global variable declaration
var contract_table_id = 0;
var validation_value='';
var individual_employee_data;
var myTable;
var salary_rule_category_id;
var ind_benft_tbl_id;
var individual_benft_del_data_list = [];
var employee_id_value;
var count = 0;

$(document).ready(function(){
    datatable_creation();
	salary_contract_table_dispaly();
	button_create_contract(1);

	
	$( "#individual_emp_ben_select" ).click(function() {    //create function button click event for payment advice
			form_validation = individual_emp_benefit_form_validation()
			if(form_validation){
		data_get_value = individual_emp_benefit_create_function(); 
		individual_employee_data = data_get_value
		individual_benefit_table_view(individual_employee_data)
		myTable.fnDeleteRow('.sample')
		//myTable.row('.sample').remove().draw( false );
	if(data_get_value){
		$('#individual_benefit_popup').modal('hide')
	}
		$("#hr_salary_periodicity").val(0).trigger('change');
		$("#computation_amount_type_benefit").val(0).trigger('change');
		$("#cal_salary_rule_component_ben").val(0).trigger('change');
			}
	return false;
});
});

//org change
$("#hr_salary_con_company_name").change(function() {
		org_unit($("#hr_salary_con_company_name  option:selected").val())
});

//org unit
function org_unit(val){
	$.ajax({
		url : "/contract_org_unit_change_structure_data/",
		type : "GET",
		data : {'id':val},
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		dropDownList(data.datas,'hr_salary_con_organization_unit');
	});
}

//drop down list
function dropDownList(data,id){
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
$("#hr_salary_con_organization_unit").change(function() {
		department($("#hr_salary_con_organization_unit  option:selected").val())
});

//org unit
function department(val){
	$.ajax({
		url : "/contract_department_change/",
		type : "GET",
		data : {'id':val},
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		datas = JSON.parse(json_data);
		departmentdropDownList(datas.department_data,'hr_salary_con_dep_name');
	});
}

//drop down list
function departmentdropDownList(data,id){
		strAppend = '<option value="0">--Select Division--</option>'
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
$("#hr_salary_con_dep_name").change(function() {
		employee_select($("#hr_salary_con_dep_name  option:selected").val())
});

//
function employee_select(val){
	$.ajax({
		url : "/contract_employee_change_data/",
		type : "GET",
		data : {'id':val},
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		datas = JSON.parse(json_data);
		employeedropDownList(datas.employee_data,'hr_salary_con_employee_name');
	});
}

//drop down list
function employeedropDownList(data,id){
		strAppend = '<option value="">--Select Employee --</option>'
		if(data.length>0){
			for(var i=0;i<data.length;i++){
				strAppend += '<option value="'+data[i].employee_id+'">'+data[i].employee_name+'</option>'
			}
			$('#'+id).html(strAppend).change();
		}else{
			$('#'+id).html(strAppend).change();
		}
}


function individual_emp_benefit_form_validation()
{
	return $('#individual_emp_benefit_formValidate').valid();
}


function salary_contract_table_dispaly(){
	$.ajax({	
		type  : 'POST',
		url   : '/salary_contract_table_view/',
		async : false,
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		if(data){
			salary_contract_datatable_function(data)
		}else{
			salary_contract_datatable_function(data)
		}
		
	});

}

//Salary Contract data table function here
function salary_contract_datatable_function()
{
	salary_contract_datatable = []
	var title_name = 'Salary Contract'
	if(data.length > 0){
		if(data.length){
			for(var i=0;i<data.length;i++){
				salary_contract_list = []
				salary_contract_list.push(data[i].id,i+1,data[i].company_id_id,data[i].orgunit_name,data[i].department_id_id,data[i].employee_id_id,data[i].job_title,
						data[i].contract_type_id_id,data[i].structure_name,data[i].base_amount,data[i].currency_type,data[i].contract_effective_from_date,data[i].contract_effective_to_date);
				salary_contract_datatable.push(salary_contract_list);
			}
		}
		columns = [{'title':'ID'},{'title':'No.'},{'title':'Organization'},{'title':'Organization Unit'},{'title':'Division'},{'title':'Employee'},{'title':'Job Title'},{'title':'Contract Type'},
		           {'title':'Salary Structure'},{'title':'Monthly CTC'},{'title':'Base Currency'},{'title':'Effective From Date'},{'title':'Effective To Date'}]

		plaindatatable_btn('salary_contract_details', salary_contract_datatable, columns,0,'NEXT_TRANSFORM_HCMS_SALARY_CONTRACT_'+currentDate(),title_name);
	}
	columns = [{'title':'ID'},{'title':'No.'},{'title':'Organization'},{'title':'Organization Unit'},{'title':'Division'},{'title':'Employee'},{'title':'Job Title'},{'title':'Contract Type'},
	           {'title':'Salary Structure'},{'title':'Monthly CTC'},{'title':'Base Currency'},{'title':'Effective From Date'},{'title':'Effective To Date'}]

		plaindatatable_btn('salary_contract_details', '', columns,0,'NEXT_TRANSFORM_HCMS_SALARY_CONTRACT_'+currentDate(),title_name);
	return false
}

//table row click get id
$("#salary_contract_details").on("click", "tr", function() {   
	var id = $('#salary_contract_details').dataTable().fnGetData(this)[0];
	$(this).parents('table').find('tr').removeClass('active');
	$(this).addClass('active');
	if (id != 'No data available'){
		salary_contract_table_row_click(id);
	}
});

//salary contract table row click function
function salary_contract_table_row_click(el){
	button_create_contract(0);
	$.ajax(
			{
				type:"GET",
				url: "/salary_contract_table_row_click/",
				async: false,
				data : {'id':el},
				success: function (json_data) {
					var data = JSON.parse(json_data);
					//employee_id_value = data[0].employee_id_id
					contract_table_id = data.datas[0].id
					$('#hr_salary_con_company_name').val(data.datas[0].company_id_id).trigger('change'); 
					$('#hr_salary_con_organization_unit').val(data.datas[0].org_unit_id_id).trigger('change'); 
					$('#hr_salary_con_dep_name').val(data.datas[0].department_id_id).trigger('change'); 
					$('#hr_salary_con_employee_name').val(data.datas[0].employee_id_id).trigger('change');
					$("#hr_salary_con_job_title").val(data.datas[0].job_title);
					$("#hr_salary_con_contract_type").val(data.datas[0].contract_type_id_id).trigger('change');
					$("#hr_salary_con_structure").val(data.datas[0].salary_structure_id_id).trigger('change');
					$('#hr_salary_con_basic').val(data.datas[0].base_amount); 
					$('#hr_salary_con_base_currency').val(data.datas[0].base_currency_id).trigger('change'); 
					$('#contract_dtimepicker1').val(data.datas[0].contract_effective_from_date);
					$("#contract_dtimepicker2").val(data.datas[0].contract_effective_to_date);
					//get form value for field wise log list function
					payroll_activity_log_attribute_value('#salary_contract_form')
					var effective_past_date = $('#contract_dtimepicker2').val();
					if (contract_table_id && effective_past_date){
				    	$.ajax({
				    		type:"POST",
				    		url:'/effective_past_date_validation/',
				    		data:{'effective_past_date':effective_past_date},
				    		async:false,
				    	}).done(function(json_data){
				    		effective_date_data = JSON.parse(json_data)
				    		if(effective_date_data.data_result == 'failure_date'){
				    			button_create_contract(0);
				    		}
				    		else if(effective_date_data.data_result== 'success_date'){
				    			contract_table_id = 0
				    			button_create_contract(1);
				    		}
				    	})
				    }
				    else{
				    	button_create_contract(0);
				    }
					//myTable.rows().remove().draw(false)
					myTable.fnDeleteRow()
					for(var j=0;j<data.datas.length;j++){
						if(data.datas[j].activate == true){
							activate = 'True'
						}
						else{
							activate = 'False'
						}
						if(data.datas[j].calculate_id){
							var calculated_values = data.datas[j].calculate_id + "|" + data.datas[j].calculate_value
						}
						if(data.datas[j].calculate_value == 'NUMBR'){
							var value_ass_value = data.datas[j].value_assignment
							var salary_value = ''
								var salary_component = ''
						}
						else if(data.datas[j].calculate_value == 'PERCT'){
							if(data.datas[j].value_assignment){
								var value_ass_value = data.datas[j].value_assignment.split("%")
								var salary_value = value_ass_value[0]
								var salary_component = value_ass_value[1]
							}
						}
						else{
							var value_ass_value = data.datas[j].value_assignment
							var salary_value = ''
								var salary_component = ''
						}
						 /*if (data.datas[j].benefit_effective_to_date){
						    	$.ajax({
						    		type:"POST",
						    		url:'/effective_past_date_validation/',
						    		data:{'ind_effective_past_date':data.datas[j].benefit_effective_to_date},
						    		async:false,
						    	}).done(function(json_data){
						    		individual_date_data = JSON.parse(json_data)
						    		if(individual_date_data.data_result == 'failure_date'){
						    			update_button = "<input type='button' id='salary_details_update' class='salary_updaterow' name='salary_update' value='Update' onclick='updateData1(this)'/>"
						    		}
						    		else if(individual_date_data.data_result== 'success_date'){
						    			update_button = ''
						    		}
						    	})
						    }
						    else{
						    	update_button = "<input type='button' id='salary_details_update' class='salary_updaterow' name='salary_update' value='Update' onclick='updateData1(this)'/>"
						    }*/
						update_button = "<input type='button' id='salary_details_update' class='salary_updaterow btn btn-primary btn-eql-wid btn-animate' name='salary_update' value='Update' onclick='updateData1(this)'/>"
						if(data.datas[j].individual_benefit_id){
						data_list = [data.datas[j].individual_benefit_id,j+1,data.datas[j].benefit_name,data.datas[j].allowance_type,update_button,"<input type='button' id='salary_details' class='salary_deleterow btn btn-danger btn-eql-wid btn-animate' name='salary_delete' value='Delete' onclick='benefitDeleteData(this)'/>",
					             activate,data.datas[j].salary_rule_category_id,value_ass_value,calculated_values,
					           '',data.datas[j].benefit_effective_from_date,data.datas[j].periodicity_id,salary_value,data.datas[j].validation,salary_component,data.datas[j].salary_rule_category_id,data.datas[j].benefit_effective_to_date]
					myTable.fnAddData(data_list)
					}
						else{
							datatable_creation()
						}
					}
				}
			});
	return false;
}


//button create function here
function button_create_contract(status){
	var access_for_create = jQuery.inArray( "Payroll Setup", JSON.parse(localStorage.Create) );
	var access_for_write = jQuery.inArray( "Payroll Setup", JSON.parse(localStorage.Write) );
	var access_for_delete = jQuery.inArray( "Payroll Setup", JSON.parse(localStorage.Delete) );	
	
	if(status == 1){
		if (access_for_create != -1){
		strAppend = "<button type='button' onclick='salary_contract_create()' class='btn btn-success btn-eql-wid btn-animate'>Add</button>"
		}strAppend += " <button type='button' onclick='salary_contract_clear()' class='btn btn-warning btn-animate btn-eql-wid btn-animate'>Cancel / Clear</button>"
				$('#salary_contract_btn').html(strAppend);
	}else{
		if (access_for_write != -1){
		strAppend = "<button type='button' onclick='salary_contract_update()' class='btn btn-primary btn-eql-wid btn-animate '>Update</button>"
			strAppend += " <button type='button' onclick='salary_contract_delete()' class='btn btn-danger btn-eql-wid btn-animate '>Remove</button>"
		}/*if (access_for_delete != -1){
			strAppend += " <button type='button' onclick='salary_contract_delete()' class='btn btn-danger btn-eql-wid btn-animate '>Remove</button>"*/
		//}
	strAppend += " <button type='button' onclick='salary_contract_clear()' class='btn btn-warning btn-animate btn-eql-wid btn-animate'>Cancel / Clear</button>"
					$('#salary_contract_btn').html(strAppend);
	}
}

//Salary Contract details create function here 
function salary_contract_create() {
	var individual_benefit_data = save_record()
	if(salary_contract_form_validation())
	{
		salary_contract_create_function('create',individual_benefit_data);
	}
}

//Salary Contract create function here
function salary_contract_create_function(status,individual_benefit_data,individual_benefit_update_data)
{
	var salary_contract_form_value = getFormValues("#salary_contract_form");
	var csrf_data = salary_contract_form_value.csrfmiddlewaretoken;
	delete salary_contract_form_value["csrfmiddlewaretoken"];
	salary_contract_form_value['is_active'] = "True";
	
	salary_contract_form_value['contract_effective_from_date'] = dateFormatChange(validationFields(salary_contract_form_value['contract_effective_from_date']));
	salary_contract_form_value['contract_effective_to_date'] = dateFormatChange(validationFields(salary_contract_form_value['contract_effective_to_date']));
/*	if (status == 'create'){
		salary_contract_form_value['contract_effective_from_date'] = dateFormatChange(validationFields(salary_contract_form_value['contract_effective_from_date']));
		salary_contract_form_value['contract_effective_to_date'] = dateFormatChange(validationFields(salary_contract_form_value['contract_effective_to_date']));
	}else{
		salary_contract_form_value['contract_effective_from_date'] = DateFormatChangeupd(validationFields(salary_contract_form_value['contract_effective_from_date']));
		salary_contract_form_value['contract_effective_to_date'] = DateFormatChangeupd(validationFields(salary_contract_form_value['contract_effective_to_date']));
	}*/
	 var employee_id_list = [];
	 $.each($("#hr_salary_con_employee_name option:selected"), function(){     
		 employee_id_list.push($(this).val());
     });
	salary_contract_form_value['company_id_id'] = validationFields(salary_contract_form_value['company_id_id']);
	salary_contract_form_value['organization_unit_id_id'] = validationFields(salary_contract_form_value['organization_unit_id_id']);
	salary_contract_form_value['department_id_id'] = validationFields(salary_contract_form_value['department_id_id']);
	//salary_contract_form_value['employee_id_id'] = validationFields(salary_contract_form_value['employee_id_id']);
	salary_contract_form_value['contract_type_id_id'] = validationFields(salary_contract_form_value['contract_type_id_id']);
	salary_contract_form_value['job_title'] = validationFields(salary_contract_form_value['job_title']);
	salary_contract_form_value['salary_structure_id_id'] = validationFields(salary_contract_form_value['salary_structure_id_id']);
	salary_contract_form_value['base_amount'] = validationFields(salary_contract_form_value['base_amount']);
	salary_contract_form_value['base_currency_id'] = validationFields(salary_contract_form_value['base_currency_id']);
	
	
	salary_contract_list = [];
	salary_contract_dict = {};
	salary_contract_list.push(salary_contract_form_value);
	salary_contract_dict['salary_contract_data'] = salary_contract_list;
	
	//get form value for field wise log list function
	var contract_activity_list = []
	contract_activity_list = payroll_activity_log('#salary_contract_form')
	
	$.ajax({	
		type  : 'POST',
		url   : '/salary_contract_create/',
		async : false,
		data: {
			'datas': JSON.stringify(salary_contract_dict),
			'log_data':JSON.stringify(contract_activity_list),
			"table_id": contract_table_id,
			"employee_id_list":JSON.stringify(employee_id_list),
			"individual_benefit_data":JSON.stringify(individual_benefit_data),
			"individual_benefit_update_data":JSON.stringify(individual_benefit_update_data),
			'individual_benft_del_data_list':JSON.stringify(individual_benft_del_data_list),
			csrfmiddlewaretoken: csrf_data,
		}
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		var res_status = data['status'];
		if(res_status == 'NTE_01') {	
			alert_lobibox("success", sysparam_datas_list[res_status]);
			button_create_contract(1)
			salary_contract_clear();
			salary_contract_table_dispaly();
			datatable_creation();
			contract_activity_list = []
			payroll_log_activity();
		}else if(res_status == 'NTE_03') {	
			alert_lobibox("success", sysparam_datas_list[res_status]);
			button_create_contract(1)
			salary_contract_clear();
			salary_contract_table_dispaly();	
			datatable_creation();
			contract_activity_list = []
			payroll_log_activity();
		}else if(res_status == 'Already Exist'){
			alert_lobibox("error","Employee contract date already exist");
		}
		else {
			alert_lobibox("error",sysparam_datas_list['ERR0040'])
		}
	});
}

//date format change
function dateFormatChange(val){
	return val.split('-')[2]+'-'+val.split('-')[1]+'-'+val.split('-')[0]
}

function DateFormatChangeupd(val){
	var reg = /(0[1-9]|[12][0-9]|3[01])[/](0[1-9]|1[012])[/](19|20)\d\d/;
  if (val.match(reg)) {
    return val.split('/')[2]+'-'+val.split('/')[1]+'-'+val.split('/')[0]
  }
  else {
    return val.split('-')[2]+'-'+val.split('-')[1]+'-'+val.split('-')[0]
  }
	
}

//Salary Contract form validation here
function salary_contract_form_validation()
{
	return $('#salary_contract_form').valid();
}

//Salary Contract update function
function salary_contract_update(){
	var individual_benefit_update_data = save_record('update')
	if(salary_contract_form_validation()){
		salary_contract_create_function('update','',individual_benefit_update_data);
}
}

//delete function
function salary_contract_delete(){
	var salary_contract_title = $('#hr_salary_con_employee_name option:selected').text();
	removeConfirmation('salary_contract_details_delete_function','',salary_contract_title+' Contract');
}

function salary_contract_details_delete_function(){
	$.ajax({	
		type  : 'POST',
		url   : '/salary_contract_create/',
		async : false,
		data: {
			"delete_id": contract_table_id,
			csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val(),
		},
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		var res_status = data['status'];
		if(res_status == 'NTE_04') {	
			alert_lobibox("success", sysparam_datas_list[res_status]);
			button_create_contract(1)
			salary_contract_clear();
			salary_contract_table_dispaly();
			contract_activity_list = []
			payroll_log_activity();
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

//Salary Contract form validation
$('#salary_contract_form').submit(function(e) {
	e.preventDefault();    
}).validate({
	rules: {
		company_id_id: {
			required: true,
			valueNotEquals:true,	
		},
		organization_unit_id_id: {
			required: true,
			valueNotEquals:true,	
		},
		department_id_id: {
			required:true,
			valueNotEquals:true,
		},	  	   
		employee_id_id: {
			required: true,
			valueNotEquals:true, 
		},   
		contract_type_id_id: {
			required: true,
			valueNotEquals:true,
		},	  
		job_title: {
			alpha:true,
			required: true,
			 
		},salary_structure_id_id: {
			required: true,
			valueNotEquals:true, 
		},   
		base_amount: {
			required: true,
			number:true, 
		},	  
		base_currency_id: {
			required: true,
			valueNotEquals:true, 
		},
		contract_effective_from_date: {
			required: true,
		},	  
		contract_effective_to_date: {
			required: true,
		},
	},
	//For custom messages
	messages: {
		company_id_id: {
			required: "Select Organization",
			valueNotEquals:"Select Organization",
		}, 
		organization_unit_id_id: {
			required: "Select Organization Unit",
			valueNotEquals:"Select Organization Unit",
		}, 
		department_id_id: {
			required: "Select Depertment", 
			valueNotEquals:"Select Depertment",
		},	   
		employee_id_id: {
			required: "Select Employee",
			valueNotEquals:"Select Employee", 
		},
		contract_type_id_id: {
			required: "Select Contract Type",
			valueNotEquals: "Select Contract Type", 
		},
		job_title: {
			required: "Enter Job Title",
			alpha: "Job Title cannot have numbers",
		},
		salary_structure_id_id: {
			required: "Select Salary Structure",
			valueNotEquals:"Select Salary Structure", 
		},
		base_amount: {
			required: "Enter Monthly CTC",
			number: "Enter only a number", 
		},
		base_currency_id: {
			required: "Select Currency Type",
			valueNotEquals: "Select Currency Type", 
		},	 
		contract_effective_from_date: {
			required: "Enter Effective From Date",
		},
		contract_effective_to_date: {
			required: "Enter Effective To Date",
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

//contribution clear function
function salary_contract_clear(){
	datatable_creation();
	button_create_contract(1);
	contract_table_id = 0
	$('.thumbnail').html("")
	$('.errormessage').html("");	
	$('#hr_salary_con_job_title').val(''); 
	$('#hr_salary_con_basic').val(''); 
	$('#contract_dtimepicker1').val(''); 
	$('#contract_dtimepicker2').val(''); 
	$('#hr_salary_con_company_name').val(0).trigger('change');
	$('#hr_salary_con_organization_unit').val(0).trigger('change');
	$("#hr_salary_con_dep_name").val(0).trigger('change');
	$("#hr_salary_con_employee_name").val(0).trigger('change');
	$("#hr_salary_con_contract_type").val(0).trigger('change');	
	$("#hr_salary_con_structure").val(0).trigger('change');
	$("#hr_salary_con_base_currency").val(0).trigger('change');
	individual_emp_benefit_clear();

}

$("#hr_salary_con_company_name").change(function(){
	$(".clear1").html('')
});
$("#hr_salary_con_organization_unit").change(function(){
	$(".clear6").html('')
});

$("#hr_salary_con_dep_name").change(function(){
	$(".clear2").html('')
});
$("#hr_salary_con_employee_name").change(function(){
	$(".clear3").html('')
});

$("#hr_salary_con_contract_type").change(function(){
	$(".clear4").html('')
});
$("#hr_salary_con_structure").change(function(){
	$(".clear5").html('')
});

$("#hr_salary_con_base_currency").change(function(){
	$(".clear6").html('')
});


//individual employee benefits function start

function individual_benefit(){
	document.getElementById('cal_salary_rule_ben_expressions_div').style.display = "none";
	document.getElementById('value_ass_criteria_view_benefit').style.display = "none";
	document.getElementById('individual_expressions_div').style.display = "none";
	document.getElementById('vaidation_criteria_view_benefit').style.display = "none";
	$("#percentage_div_benefit").hide()
	$("#salary_benefit_component_div").hide()
	$("#salary_rule_expressions_benefit").val('')
	$("#salary_rule_value_div_benefit").hide()
	$("#cal_salary_rule_expressions_ben").val('')
	$("#value_ass_salary_rule_exp_ben").val('')
	$("#salary_rule_validation_exp_benefit").val('')
	document.getElementById("individual_emp_benefit_formValidate").reset();
	$('#individual_benefit_popup').modal('show')
}

//OnChange of the Radio Button Event Functionality
$('input[type=radio][name=hr_salary_rule_benefit]').change(function() {
	if (this.value == 'Yes') {
		$("#benefit_validation_criteria_model").modal('show');

	}
	else if (this.value == 'No') {
		$("#benefit_validation_criteria_model").modal('hide')
		document.getElementById('individual_expressions_div').style.display = "none";
		document.getElementById('vaidation_criteria_view_benefit').style.display = "none";
	}
});

$('#computation_amount_type_benefit').change(function() {
	$('#rule_amt_type').html('');
	type_value = $("#computation_amount_type_benefit option:selected").attr("data-code");
	/*if(calculation_type){
		type_value_id=calculation_type.split("|")
	}if(type_value_id){
		type_value=type_value_id[1]
	}*/
	if (type_value == 'NUMBR'){
		$("#percentage_div_benefit").hide()
		$("#salary_benefit_component_div").hide()
		$("#value_criteria_model_benefit").modal('hide')
		$("#salary_rule_value_div_benefit").show()
		document.getElementById('cal_salary_rule_ben_expressions_div').style.display = "none";
		document.getElementById('value_ass_criteria_view_benefit').style.display = "none";
	}
	else if(type_value == 'CALVA')
	{
		$("#percentage_div_benefit").hide()
		$("#salary_benefit_component_div").hide()
		$("#salary_rule_value_div_benefit").hide()
		$("#value_criteria_model_benefit").modal('show')
		$("#comparator_div").hide()
	}else if(type_value == 0)
	{
		document.getElementById('salary_rule_value_div_benefit').style.display = "none";
		document.getElementById('percentage_div_benefit').style.display = "none";
		document.getElementById('salary_benefit_component_div').style.display = "none";
		$("#value_criteria_model_benefit").modal('hide')
	}
	else{
		$("#percentage_div_benefit").show()
		$("#salary_benefit_component_div").show()
		$("#salary_rule_value_div_benefit").show()
		$("#value_criteria_model_benefit").modal('hide')
		document.getElementById('cal_salary_rule_ben_expressions_div').style.display = "none";
		document.getElementById('value_ass_criteria_view_benefit').style.display = "none";
	}
});

//On click Validation Cancel Button
$('#hr_validation_criteria_cancel').click(function(){
	$("#benefit_validation_criteria_model").modal('hide')
	validation_value=''
		validation_criteria_benefit_clear();
	$("#salary_rule_validation_exp_benefit").val('')
	return false
});

//On click Validation Cancel Button
$('#hr_value_criteria_cancel').click(function(){
	$("#value_criteria_model_benefit").modal('hide')
	value_ass_value=''
		value_ass_criteria_clear_benefit();
	$("#value_ass_salary_rule_exp_ben").val('')
	return false
});

//Table Data Append Functionality For Saalry Contract Table
function individual_benefit_table(){
	datatable_creation()
}

//fetch Table data ajax function 
function individual_benefit_table_view(individual_employee_data){
	//myTable.rows().remove().draw()
					datatable_list = [];
					if(individual_employee_data){
					if(individual_employee_data.length > 0){
						var datatable_records = [];
						for(var i=0;i<individual_employee_data.length;i++)
							{
							var data_list = []
							if(ind_benft_tbl_id){
								var table_id_value = ind_benft_tbl_id
							}
							else{
								var table_id_value = i
							}
							
							var salary_rule_cat_type_id = individual_employee_data[i].salary_rule_category_id
							/*if (salary_rule_cat_type_id){
								salary_rule_cat_type = salary_rule_cat_type_id.split("|")
							}
							if(salary_rule_cat_type[1] == 'ALLWC'){
								var benefit_type = "Earnings"
							}
							else{
								var benefit_type = "Deduction"
							}*/
							var benefit_names = individual_employee_data[i].benefit_name
							if (benefit_names){
								benefit_name = benefit_names
							}
							else{
								benefit_name = ''
							}
							//var hr_salary_con_type = benefit_type
							var activate = individual_employee_data[i].activate
							if(activate == '1'){
								activate = 'True'
							}
							else{
								activate = "False"
							}
							var cal_salary_rule_components = individual_employee_data[i].cal_salary_rule_component
							if(cal_salary_rule_components){
								cal_salary_rule_component = cal_salary_rule_components
							}
							else{
								cal_salary_rule_component = ""
							}
							var cal_salary_rule_expressions = individual_employee_data[i].cal_salary_rule_expressions
							if (cal_salary_rule_expressions){
								cal_salary_rule_expressions = individual_employee_data[i].cal_salary_rule_expressions
							}
							else{
								cal_salary_rule_expressions = ''
							}
							var calculation_type_id = individual_employee_data[i].calculation_type_id
							if (calculation_type_id){
								calculation_type_id = individual_employee_data[i].calculation_type_id
							}
							else{
								calculation_type_id = ''
							}
							var effective_date = individual_employee_data[i].effective_date
							var hr_individual_contract_select = salary_rule_cat_type_id
							if (hr_individual_contract_select){
								hr_individual_contract_select = salary_rule_cat_type_id
							}
							else{
								hr_individual_contract_select = ''
							}
							var periodicity_id = individual_employee_data[i].periodicity_id
							var salary_rule_compute_quantity = individual_employee_data[i].salary_rule_compute_quantity
							if (salary_rule_compute_quantity){
								salary_rule_compute_quantity = individual_employee_data[i].salary_rule_compute_quantity
							}
							else{
								salary_rule_compute_quantity = ''
							}
							var salary_rule_validations = individual_employee_data[i].salary_rule_validation
							if (salary_rule_validations){
								
								salary_rule_validation = salary_rule_validations
							}
							else{
								salary_rule_validation = ''
							}
							var calculation_type_value = individual_employee_data[i].calculation_type_value
							if(calculation_type_value){
								 calculation_type_value = individual_employee_data[i].calculation_type_value
							}
							else{
								 calculation_type_value = ''
							}
							data_list = [table_id_value,i+1,benefit_name,individual_employee_data[i].benefit_type_txt_val,"<input type='button' id='salary_details_update' class='salary_updaterow btn btn-primary btn-eql-wid btn-animate' name='salary_update' value='Update' onclick='updateData1(this)'/>","<input type='button' id='salary_details' class='salary_deleterow btn btn-danger btn-eql-wid btn-animate' name='salary_delete' value='Delete' onclick='benefitDeleteData(this)'/>",
							             activate,cal_salary_rule_component,cal_salary_rule_expressions,calculation_type_id,
							             hr_individual_contract_select,individual_employee_data[i].benefit_effective_from_date,
							             periodicity_id,salary_rule_compute_quantity,salary_rule_validation,calculation_type_value,'',
							             individual_employee_data[i].benefit_effective_to_date]
							myTable.fnAddData(data_list)
							}
						ind_benft_tbl_id = ''
					}
					}
	
}

//Table creation for details
function datatable_creation()
{
		columns = [{'title':'ID'},{'title':'No.'},{'title':'Benefit Name'},{'title':'Benefit Type'},{'title':'Update'},{'title':'Delete'},{'title':'activate'},
		           {'title':'cal_salary_rule_component'},{'title':'cal_salary_rule_expressions'},{'title':'calculation_type_id'},{'title':'hr_individual_contract_select'},
		           {'title':'effective_date'},{'title':'periodicity_id'},{'title':'salary_rule_compute_quantity'},{'title':'salary_rule_validation'},
		           {'title':'calculation_type_value'},{'title':'benefit_type_value'},{'title':'effective_to_date'}]
		plaindatatable_benefit('individual_emp_benft_datatable',[], columns,[0]);

	return false
}


//json datas pass in ajax function for create and update function
function individual_emp_benefit_create_function(){
	var individual_employee_benefit_form_value = getFormValues("#individual_emp_benefit_formValidate");
	var csrf_data = individual_employee_benefit_form_value.csrfmiddlewaretoken;
	delete individual_employee_benefit_form_value["csrfmiddlewaretoken"];
	individual_employee_benefit_form_value['is_active'] = "True";
	var benefit_type_txt_val = $("#salary_rule_categorys option:selected").text();
	var calculation_type = $("#cal_salary_rule_component_ben option:selected").text();
	var calculation_type_value = $("#cal_salary_rule_component_ben option:selected").attr("data-code");
	var calculation_type_val = $("#computation_amount_type_benefit option:selected").attr("data-code");
	var calculation_type_val_id = $("#computation_amount_type_benefit").val();
	
	if (status == 'create'){
		individual_employee_benefit_form_value['benefit_effective_from_date'] = dateFormatChange(validationFields(individual_employee_benefit_form_value['benefit_effective_from_date']));
		individual_employee_benefit_form_value['benefit_effective_to_date'] = dateFormatChange(validationFields(individual_employee_benefit_form_value['benefit_effective_to_date']));
	}else{
		individual_employee_benefit_form_value['benefit_effective_from_date'] = DateFormatChangeupd(validationFields(individual_employee_benefit_form_value['benefit_effective_from_date']));
		individual_employee_benefit_form_value['benefit_effective_to_date'] = DateFormatChangeupd(validationFields(individual_employee_benefit_form_value['benefit_effective_to_date']));
	}
	if(benefit_type_txt_val){
		individual_employee_benefit_form_value['benefit_type_txt_val'] = benefit_type_txt_val
	}
	if(calculation_type_val && calculation_type_val_id){
		individual_employee_benefit_form_value['calculation_type_id'] = calculation_type_val_id +'|'+ calculation_type_val
	}
	if(calculation_type != '--Select Salary Component--'){
		individual_employee_benefit_form_value['cal_salary_rule_component'] = calculation_type
	}
	if(calculation_type_value){
		individual_employee_benefit_form_value['calculation_type_value'] = calculation_type_value
	}
	individual_employee_benefit_form_value['benefit_name'] = validationFields(individual_employee_benefit_form_value['benefit_name']);
	individual_employee_benefit_form_value['salary_rule_category_id'] = validationFields(individual_employee_benefit_form_value['salary_rule_category_id']);
	individual_employee_benefit_form_value['periodicity_id'] = validationFields(individual_employee_benefit_form_value['periodicity_id']);
	
	
	individual_emp_benefit_list = [];
	individual_emp_benefit_dict = {};
	individual_emp_benefit_list.push(individual_employee_benefit_form_value);
	if(individual_emp_benefit_list.length > 0){
		individual_emp_benefit_dict["hr_individual_employee_benefit"] = individual_emp_benefit_list
		return individual_emp_benefit_list
		}
	
}

$('#benefit_validation_criteria_create').click(function(){
	salary_compontent=$('#benefit_salary_rule_component').find(":selected").text()
	if(salary_compontent!=0 && salary_compontent!='--Select Salary Component--'){
		//salary_compontent=$('#salary_rule_component').find(":selected").text()
		if(salary_compontent != '--Select Salary Component--'){
			salary_compontent=' '+salary_compontent
			validation_value=validation_value+salary_compontent
		}else{
			salary_compontent=''
		}
		
	}else{
		salary_compontent=''
	}
	val_num=document.getElementById('salary_rule_validation_value').value
	if(val_num!=''){
		val_num=' '+val_num
		validation_value=validation_value+val_num
	}else{
		val_num=''
	}
	benefit_validation_criteria()
	validation_criteria_benefit_clear();
	return false
});

function benefit_validation_criteria(){
	document.getElementById('salary_rule_validation_exp_benefit').value=validation_value
	return false
}
//Validation Start

$(".benefit_validation_btn").click(function(e) {
	e.preventDefault()
	btn_value=$(this).val()
	btn_value=' '+btn_value
	validation_value=validation_value+btn_value
	benefit_validation_criteria()
	return false
});

function validation_criteria_benefit_clear(){
	//validation_value=''
	$("#benefit_salary_rule_component").val(0).trigger('change');
	$("#salary_rule_validation_value").val('');
	return false;
}

$('#validation_criteria_benefit_clear').click(function(e){
	e.preventDefault()
	validation_criteria_benefit_clear();
	validation_clearfunct_benefit();
	validation_value=document.getElementById('salary_rule_validation_exp_benefit').value;
	return false
});
//For Clear the TextBox Value By One by one Validation
function validation_clearfunct_benefit ()
{
	var exp_val = document.getElementById('salary_rule_validation_exp_benefit').value;
	document.getElementById('salary_rule_validation_exp_benefit').value = exp_val.substring(0,exp_val.length - 1);
}

//For Click the Selection Button Validation 

$('#hr_validation_criteria_benefit_select').click(function(){
	validation_criteria_benefit_clear();
	Validation_criteria=document.getElementById('salary_rule_validation_exp_benefit').value
	if(Validation_criteria!=''){
		document.getElementById('individual_expressions_div').style.display = "block";
		document.getElementById('vaidation_criteria_view_benefit').style.display = "block";
		document.getElementById('salary_rule_expressions_benefit').value=Validation_criteria
		$("#benefit_validation_criteria_model").modal('hide')
	}else{
		document.getElementById('individual_expressions_div').style.display = "none";
		document.getElementById('vaidation_criteria_view_benefit').style.display = "none";
		//$("#validation_criteria_model").modal('hide')
	}

})

//Click View Button Functionality

$('#hr_vaidation_criteria_view_benefit').click(function(){
	$("#benefit_validation_criteria_model").modal('show');
	exp_value=document.getElementById('salary_rule_expressions_benefit').value
	validation_value=exp_value;
	document.getElementById('salary_rule_validation_exp_benefit').value=exp_value
	return false
})

$('#benefit_salary_rule_component').on("change",function() {
	$("#salary_rule_validation_value").val('');
});
// Validation Criteria function  end

// calculated value function in value assignment start
var value_ass_value=''
	$(".value_ass_btn_benefit").click(function(e) {
		e.preventDefault()
		ass_btn_value=$(this).val()
		ass_btn_value=' '+ass_btn_value
		value_ass_value=value_ass_value+ass_btn_value
		value_ass_criteria_benefit()
	});

function value_ass_criteria_benefit(){
	document.getElementById('value_ass_salary_rule_exp_ben').value=value_ass_value
}
$('#value_ass_salary_rule_component_benefit').on("change",function() {
	$("#value_ass_salary_rule_validation_value_ben").val('');
});

//On click Value Assignment Add Button

$('#benefit_value_ass_criteria_create').click(function(){
	value_salary_compontent=$('#value_ass_salary_rule_component_benefit').find(":selected").text()
	if(value_salary_compontent!=0 && value_salary_compontent!='--Select Salary Component--'){
		//value_salary_compontent=$('#value_ass_salary_rule_component_benefit').find(":selected").text()
		if (value_salary_compontent != '--Select Salary Component--'){
			value_salary_compontent=' '+value_salary_compontent
			value_ass_value=value_ass_value+value_salary_compontent
		}else{
			value_salary_compontent=''
		}
	}else{
		value_salary_compontent=''
	}
	val_ass_num=document.getElementById('value_ass_salary_rule_validation_value_ben').value
	if(val_ass_num!=''){
		val_ass_num=' '+val_ass_num
		value_ass_value=value_ass_value+val_ass_num
	}else{
		val_ass_num=''
	}
	value_ass_criteria_benefit()
	value_ass_criteria_clear_benefit();
	return false
});

//For One by One  Clear Functionality Button  Click
$('#value_ass_criteria_clear_benefit').click(function(e){
	e.preventDefault()
	value_ass_criteria_clear_benefit();
	benefit_value_ass_clearfunct();
	value_ass_value=document.getElementById('value_ass_salary_rule_exp_ben').value;
	return false
});

//For Clear the TextBox Value By One by one Value Assignment
function benefit_value_ass_clearfunct ()
{
	var ass_exp_val = document.getElementById('value_ass_salary_rule_exp_ben').value;
	document.getElementById('value_ass_salary_rule_exp_ben').value = ass_exp_val.substring(0,ass_exp_val.length - 1);
}

function value_ass_criteria_clear_benefit(){
	//value_ass_value = ''
	$("#value_ass_salary_rule_component_benefit").val(0).trigger('change');
	$("#value_ass_salary_rule_validation_value_ben").val('');
	return false;
}

//For Click the Selection Button  Value Assignment

$('#hr_value_criteria_select_ben').click(function(){
	value_ass_criteria_clear_benefit();
	Value_ass_criteria=document.getElementById('value_ass_salary_rule_exp_ben').value
	if(Value_ass_criteria!=''){
		document.getElementById('cal_salary_rule_ben_expressions_div').style.display = "block";
		document.getElementById('value_ass_criteria_view_benefit').style.display = "block";
		document.getElementById('cal_salary_rule_expressions_ben').value=Value_ass_criteria
		$("#value_criteria_model_benefit").modal('hide')
	}else{
		document.getElementById('cal_salary_rule_ben_expressions_div').style.display = "none";
		document.getElementById('value_ass_criteria_view_benefit').style.display = "none";
	}

})

//Click View Button Functionality

$('#value_ass_criteria_view_benefit').click(function(){
	$("#value_criteria_model_benefit").modal('show');
	ass_exp_value=document.getElementById('cal_salary_rule_expressions_ben').value
	document.getElementById('value_ass_salary_rule_exp_ben').value=ass_exp_value
	return false
})

// calculated value function in value assignment end

function individual_emp_benefit_clear(){
	$('.errormessage').html('')
	$('.thumbnail').html("")
	$("#hr_salary_periodicity").val(0).trigger('change');
	$("#computation_amount_type_benefit").val(0).trigger('change');
	$("#cal_salary_rule_component_ben").val(0).trigger('change');
	document.getElementById("individual_emp_benefit_formValidate").reset();
}

//Delete button Functionality of row For Employee Benefit Details 
function benefitDeleteData(row_click_data) {
	
	/*var row = row_click_data.parentNode.parentNode;
	row.parentNode.removeChild(row);*/
	var table_name = document.getElementById('individual_emp_benft_datatable');
	var delete_data = $(row_click_data).parents('tr').find('td:eq(0)').text();
	individual_benft_del_data_list.push(delete_data)
	$(row_click_data).parents('tr').addClass('del_sample')
	myTable.fnDeleteRow( $(row_click_data).parents('tr'), null, true ); 
	//myTable.row('.del_sample').remove().draw( false );
}

function updateData1(el){
	$(el).parents('tr').addClass('sample')
		  var currentRow = $(el).closest('tr')[0];
		  $(currentRow).each(function () {
			  var $tds = $(this).find('td'),
		        tbl_id = $tds.eq(0).text();
			    serial_no = $tds.eq(1).text();
		        benefit_name = $tds.eq(2).text();
		        hr_salary_con_type =  $tds.eq(3).text();
		        activate = $tds.eq(6).text();
		        cal_salary_rule_component = $tds.eq(7).text();
		        cal_salary_rule_expressions = $tds.eq(8).text();
		        calculation_type_id =  $tds.eq(9).text();
		        hr_individual_contract_select =  $tds.eq(10).text();
		        effective_date =  $tds.eq(11).text();
		        periodicity_id =  $tds.eq(12).text().trim();
		        salary_rule_compute_quantity = $tds.eq(13).text().trim();
		        salary_rule_validation = $tds.eq(14).text().trim();
		        calculation_type_value = $tds.eq(15).text().trim();
		        benefit_type_value = $tds.eq(16).text().trim();
		        benefit_efft_to_date = $tds.eq(17).text();
		        if(activate == "True"){
		    		$('#individual_emp_benft_act').prop('checked',true); 
		    	}
		    	else{
		    		$('#individual_emp_benft_act').prop('checked',false); 
		    	}
		        ind_benft_tbl_id = tbl_id
		   	if (salary_rule_validation){
		   	 document.getElementById('individual_expressions_div').style.display = "block";
		   	document.getElementById('vaidation_criteria_view_benefit').style.display = "block";
		   	}
		   	if(calculation_type_id){
	    		calculation_type_ids_updt = calculation_type_id.split("|")
	    		calculation_type_text_values = calculation_type_ids_updt[1]
	    	}if(calculation_type_ids_updt){
	    		calculations_type_ids = calculation_type_ids_updt[0]
	    	}
		  /* 	if(cal_salary_rule_expressions){
		   		
		   	}*/
	    	$("#computation_amount_type_benefit").val(calculations_type_ids).trigger('change')
		   	if (calculation_type_text_values == 'NUMBR'){
		   		document.getElementById('cal_salary_rule_ben_expressions_div').style.display = "none";
			   	document.getElementById('value_ass_criteria_view_benefit').style.display = "none";
		   		$("#salary_rule_value_div_benefit").show()
		   		$("#percentage_div_benefit").hide()
				$("#salary_benefit_component_div").hide()
		   		$("#computation_quantity_benefit").val(cal_salary_rule_expressions)
		   	}
		   	else if(calculation_type_text_values == 'PERCT'){
		   		document.getElementById('cal_salary_rule_ben_expressions_div').style.display = "none";
			   	document.getElementById('value_ass_criteria_view_benefit').style.display = "none";
		   		$("#percentage_div_benefit").show()
				$("#salary_benefit_component_div").show()
				$("#salary_rule_value_div_benefit").show()
		   		$("#computation_quantity_benefit").val(salary_rule_compute_quantity)
		   		$("#cal_salary_rule_component_ben option").each(function () {
		   	        if ($(this).html() == calculation_type_value) {
		   	            $(this).attr("selected", "selected").trigger('change');
		   	        }});
		   	}
		   	else{
		   		$("#salary_rule_value_div_benefit").hide()
		   		$("#percentage_div_benefit").hide()
				$("#salary_benefit_component_div").hide()
		   		document.getElementById('cal_salary_rule_ben_expressions_div').style.display = "block";
			   	document.getElementById('value_ass_criteria_view_benefit').style.display = "block";
			   	$("#cal_salary_rule_expressions_ben").val(cal_salary_rule_expressions)
			    $("#value_criteria_model_benefit").modal('hide');
		   	}
		   	if (hr_individual_contract_select){
		   		$("#salary_rule_categorys").val('')
		   		$("#salary_rule_categorys").val(hr_individual_contract_select).trigger('change')
		   	}
		   	else{
		   		$("#salary_rule_categorys").val('')
		   		$("#salary_rule_categorys").val(benefit_type_value).trigger('change')
		   	}
		        $("#emp_benefit_name").val(benefit_name)
		        //alert("cal_salary_rule_component"+cal_salary_rule_component)
		        //$("#cal_salary_rule_component").val(cal_salary_rule_component).trigger('change')
		        //$("#salary_rule_categorys").val(hr_individual_contract_select)
		        $("#benefit_dtimepicker1").val(effective_date)
		        $("#benefit_dtimepicker2").val(benefit_efft_to_date)
		        $("#hr_salary_periodicity").val(periodicity_id).trigger('change')
		        //$("#computation_quantity_benefit").val(salary_rule_compute_quantity)
		        $("#salary_rule_expressions_benefit").val(salary_rule_validation)
		        $('#individual_benefit_popup').modal('show')
		  });
}

//Onclick Function for visitors Save Button 
function save_record(update){
		var table = $("#individual_emp_benft_datatable tbody");
		var individual_beneft_insert_dict = {}
		var individual_beneft_insert_list = []
		var individual_beneft_update_dict = {}
		var individual_beneft_update_list = []
		//var count = table.find("tr").size();
	    table.find('tr').each(function (i) {    //function for Get the table value
	        var $tds = $(this).find('td'),
	        tbl_id = $tds.eq(0).text();
	        if(tbl_id != "No data available"){
	        serial_no = $tds.eq(1).text();
	        benefit_name = $tds.eq(2).text();
	        hr_salary_con_type =  $tds.eq(3).text();
	        activate = $tds.eq(6).text();
	        cal_salary_rule_component = $tds.eq(7).text();
	        cal_salary_rule_expressions = $tds.eq(8).text();
	        calculation_type_id =  $tds.eq(9).text();
	        hr_individual_contract_select =  $tds.eq(10).text();
	        effective_date =  $tds.eq(11).text();
	        periodicity_id =  $tds.eq(12).text().trim();
	        salary_rule_compute_quantity = $tds.eq(13).text().trim();
	        salary_rule_validation = $tds.eq(14).text().trim();
	        calculation_type_value = $tds.eq(15).text().trim();
	        benefit_type_id = $tds.eq(16).text();
	        benefit_efft_to_date = $tds.eq(17).text();
	        
	        var ben_eff_start_date = effective_date
	    	var ben_from_date = ben_eff_start_date
	    	/*if(ben_eff_start_date){
	    		var effdateArray = ben_eff_start_date.split('/');
	    		var effective_date = effdateArray[1]+'/'+effdateArray[0]+'/'+effdateArray[2];
	    	}
	    	var ben_eff_end_date = benefit_efft_to_date;
	    	var ben_to_date = ben_eff_end_date
	    	if(ben_eff_end_date){
	    		var dateArray = ben_eff_end_date.split('/');
	    		var benefit_efft_to_date = dateArray[1]+'/'+dateArray[0]+'/'+dateArray[2];
	    	}*/
	    	
	    	
	    	if(calculation_type_id){
	    		calculation_type_ids = calculation_type_id.split("|")
	    		calculation_type_text_value = calculation_type_ids[1]
	    	}if(calculation_type_ids){
	    		calculation_type_ids = calculation_type_ids[0]
	    	}
	    	
	        if (activate == "True"){
	        	activate = true
	        }
	        else{
	        	activate = false
	        }
	        var mapObj_rule = {
	        		"Fixed Basic":"BASIC",
					"Fixed Gross":"GROSS",
					"Net Salary":"NETTT",
					"Monthly CTC":"MNCTC",
					"Earned CTC":"ENCTC",
					"LOP":"LOSOP",
					"Earned Basic":"ENBSC"
	    		};
	        var exp_codevalue_ass = cal_salary_rule_expressions
	    	exp_codevalue_ass_result = exp_codevalue_ass.replace(/Fixed Basic|Fixed Gross|Net Salary|Monthly CTC|Earned CTC|LOP|Earned Basic/gi, function(matched){
	    		return mapObj_rule[matched];
	    	});
	    		
	    	var exp_codevalue = salary_rule_validation
	    	exp_codevalue_result = exp_codevalue.replace(/Fixed Basic|Fixed Gross|Net Salary|Monthly CTC|Earned CTC|LOP|Earned Basic/gi, function(matched){
	    		return mapObj_rule[matched];
	    	});
	    	
	    	if(calculation_type_ids != '0'){
	    		contribution_id_id = ''
	    		if (calculation_type_text_value == 'NUMBR'){//Value
	    			salary_rule_calculation_type_id_id = calculation_type_ids
	    			salary_rule_value_assignment_code = salary_rule_compute_quantity
	    			salary_rule_value_assignment = salary_rule_compute_quantity
	    		}else if(calculation_type_text_value == 'CALVA')//Calculated Value
	    		{
	    			salary_rule_calculation_type_id_id = calculation_type_ids
	    			salary_rule_value_assignment_code = exp_codevalue_ass_result
	    			salary_rule_value_assignment = cal_salary_rule_expressions
	    		}
	    		else{//Percentage
	    			cal_salary_rule_id = cal_salary_rule_component
	    			var percentage_code = salary_rule_compute_quantity+" % "+calculation_type_value
	    			cal_salary_rule_value = cal_salary_rule_component;
	    			var percentage_value = salary_rule_compute_quantity+" % "+cal_salary_rule_component
	    			salary_rule_calculation_type_id_id = calculation_type_ids
	    			salary_rule_value_assignment_code = percentage_code
	    			salary_rule_value_assignment = percentage_value
	    		}
	    		
	    	}
	    	if (hr_individual_contract_select){
		   		var Salary_rule_id = hr_individual_contract_select
		   	}
		   	else{
		   		var Salary_rule_id = benefit_type_id
		   	}
	    	if(update == 'update'){
	        	update_data = {};
	    		update_data["table_id"] = tbl_id
	        	update_data["benefit_name"] = benefit_name
	        	update_data["validation"] = salary_rule_validation
	        	update_data["validation_code"] = exp_codevalue
	        	update_data["value_assignment"] = salary_rule_value_assignment
	        	update_data["value_assignment_code"] = salary_rule_value_assignment_code
	        	update_data["calculation_type_id_id"] = calculation_type_ids
	        	update_data["periodicity_id"] = periodicity_id
	        	update_data["is_active"] = true
	        	update_data["activate"] = activate
	        	update_data["effective_date"] = effective_date
	        	update_data["salary_rule_category_id"] = Salary_rule_id
	        	update_data["benefit_effective_to_date"] = benefit_efft_to_date
	        	//insert_data["allowance_type"] = hr_salary_con_type
	        	individual_beneft_update_list.push(update_data)
	    	}
	    	else{
	    		insert_data = {};
	        	insert_data["benefit_name"] = benefit_name
	        	insert_data["validation"] = salary_rule_validation
	        	insert_data["validation_code"] = exp_codevalue
	        	insert_data["value_assignment"] = salary_rule_value_assignment
	        	insert_data["value_assignment_code"] = salary_rule_value_assignment_code
	        	insert_data["calculation_type_id_id"] = calculation_type_ids
	        	insert_data["periodicity_id"] = periodicity_id
	        	insert_data["is_active"] = true
	        	insert_data["activate"] = activate
	        	insert_data["effective_date"] = effective_date
	        	insert_data["salary_rule_category_id"] = Salary_rule_id
	        	insert_data["benefit_effective_to_date"] = benefit_efft_to_date
	        	//insert_data["allowance_type"] = hr_salary_con_type
	        	individual_beneft_insert_list.push(insert_data)
	    	}
	        
	        }     
	    });
		
		if (individual_beneft_insert_list.length>0)
			{
			individual_beneft_insert_dict["hr_individual_employee_benefit"] = individual_beneft_insert_list
			return individual_beneft_insert_dict
			}
		
		if (individual_beneft_update_list.length>0)
		{
			individual_beneft_update_dict["hr_individual_employee_benefit"] = individual_beneft_update_list
		return individual_beneft_update_dict
		}
	return false;
}

function individual_emp_basic_validation(){
	return $('#individual_emp_benefit_formValidate').valid();	

}
//OnChange 
$('#salary_rule_categorys').on("change",function() {
		$('#salary_category_validation').html('');
});

$('#hr_salary_periodicity').on("change",function() {
	$('#periodicity_validation').html('');
});

var now = new Date();
var jsDate = now.getDate()+'-'+(now.getMonth()+1)+'-'+now.getFullYear();
//Datatable with button function
function plaindatatable_benefit(tbl_name, data_list, tbl_columns, hidden_col) {
	if ($.fn.DataTable.isDataTable('#'+tbl_name)) {
		$('#'+tbl_name).DataTable().destroy();
	} 
	if (hidden_col.length != undefined) {
		hidden_col_colvis = hidden_col.length -1;
	} else {
		hidden_col_colvis = hidden_col
	}
	myTable = $("#"+tbl_name).dataTable({
		autoWidth: false,
		columns: tbl_columns,
		data: data_list,
		"bDestroy": true,
		language: {
			aria: {
				sortAscending: ": activate to sort column ascending",
				sortDescending: ": activate to sort column descending"
			},
			emptyTable: "No data available",
			info: "Showing _START_ to _END_ of _TOTAL_ entries",
			infoEmpty: "No entries found",
			infoFiltered: "(filtered1 from _MAX_ total entries)",
			lengthMenu: "_MENU_ entries",
			search: "",
			zeroRecords: "No matching records found"
		},
		buttons: [{
			extend: 'collection',
			className: "exporticon",
			text: 'Export',
			buttons: [{
				extend: "pdf",
				className: "pdficon",
				exportOptions: {
					columns: ':visible'
				},
				customize: function (doc) { pageNumberPDF(doc) }
			}, {
				extend: "excel",
				className: "excelicon",
				exportOptions: {
					columns: ':visible'
				},
				customize: function(xlsx) { pageHeaderExcel(xlsx,myTable.fnGetData().length) }
			}, {
				extend: "csv",
				className: "csvicon",
				exportOptions: {
					columns: ':visible'
				},
				customize: function (csv) {
					return "My header NEXT Inc.\n\n NEXT Inc.\n"+  csv;
				}
			}],
		},{
			extend: "print",
			className: "printicon",
			exportOptions: {
				columns: ':visible'
			},
			message: '<p style="text-align:center;"><img src="data:image/png;base64,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/GMzLdsAAERIaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/Pgo8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzA2NyA3OS4xNTc3NDcsIDIwMTUvMDMvMzAtMjM6NDA6NDIgICAgICAgICI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgICAgICAgICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICAgICAgICAgICB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIKICAgICAgICAgICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgICAgICAgICAgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiCiAgICAgICAgICAgIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIj4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNSAoV2luZG93cyk8L3htcDpDcmVhdG9yVG9vbD4KICAgICAgICAgPHhtcDpDcmVhdGVEYXRlPjIwMTUtMTAtMTVUMTQ6NTQ6MDIrMDU6MzA8L3htcDpDcmVhdGVEYXRlPgogICAgICAgICA8eG1wOk1ldGFkYXRhRGF0ZT4yMDE4LTAxLTA1VDEyOjE0OjEzKzA1OjMwPC94bXA6TWV0YWRhdGFEYXRlPgogICAgICAgICA8eG1wOk1vZGlmeURhdGU+MjAxOC0wMS0wNVQxMjoxNDoxMyswNTozMDwveG1wOk1vZGlmeURhdGU+CiAgICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2UvcG5nPC9kYzpmb3JtYXQ+CiAgICAgICAgIDx4bXBNTTpJbnN0YW5jZUlEPnhtcC5paWQ6MGRiNTUxYjgtMzBkMC02YTQyLTllMDAtZTQwODQzYTNhNTcxPC94bXBNTTpJbnN0YW5jZUlEPgogICAgICAgICA8eG1wTU06RG9jdW1lbnRJRD5hZG9iZTpkb2NpZDpwaG90b3Nob3A6YzFiZTU2N2ItZTU4NC0xMWU3LWJkYWMtZjZhNTBlMjg1MTg5PC94bXBNTTpEb2N1bWVudElEPgogICAgICAgICA8eG1wTU06T3JpZ2luYWxEb2N1bWVudElEPnhtcC5kaWQ6YzQ2ZjQyMWEtYWZhYi1lYjQ5LWE3NmItNmU2MmUxMzg3ZGI3PC94bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpIaXN0b3J5PgogICAgICAgICAgICA8cmRmOlNlcT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+Y3JlYXRlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOmM0NmY0MjFhLWFmYWItZWI0OS1hNzZiLTZlNjJlMTM4N2RiNzwvc3RFdnQ6aW5zdGFuY2VJRD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OndoZW4+MjAxNS0xMC0xNVQxNDo1NDowMiswNTozMDwvc3RFdnQ6d2hlbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnNvZnR3YXJlQWdlbnQ+QWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKTwvc3RFdnQ6c29mdHdhcmVBZ2VudD4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6YWN0aW9uPnNhdmVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDppbnN0YW5jZUlEPnhtcC5paWQ6ODA3NjRjMGMtZGMxNi05YTRjLTljOWItODI5NjE5NTk5ZGY5PC9zdEV2dDppbnN0YW5jZUlEPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6d2hlbj4yMDE1LTEwLTE1VDE1OjAwOjM4KzA1OjMwPC9zdEV2dDp3aGVuPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6c29mdHdhcmVBZ2VudD5BZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpPC9zdEV2dDpzb2Z0d2FyZUFnZW50PgogICAgICAgICAgICAgICAgICA8c3RFdnQ6Y2hhbmdlZD4vPC9zdEV2dDpjaGFuZ2VkPgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+c2F2ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0Omluc3RhbmNlSUQ+eG1wLmlpZDplMmQxMzE5Mi1mOTQ0LWI1NGMtYTAwNy1kZGE1OGE1ZGMzMTY8L3N0RXZ0Omluc3RhbmNlSUQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDp3aGVuPjIwMTYtMDUtMjVUMTk6NDk6MjgrMDU6MzA8L3N0RXZ0OndoZW4+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpzb2Z0d2FyZUFnZW50PkFkb2JlIFBob3Rvc2hvcCBDQyAoV2luZG93cyk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpjaGFuZ2VkPi88L3N0RXZ0OmNoYW5nZWQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5jb252ZXJ0ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnBhcmFtZXRlcnM+ZnJvbSBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIHRvIGltYWdlL3BuZzwvc3RFdnQ6cGFyYW1ldGVycz4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6YWN0aW9uPmRlcml2ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnBhcmFtZXRlcnM+Y29udmVydGVkIGZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9wbmc8L3N0RXZ0OnBhcmFtZXRlcnM+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5zYXZlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOjM5OWQ1NWI1LTZlMTctMTg0ZC04YTI1LTNmMGJjZDE4ZTk2YTwvc3RFdnQ6aW5zdGFuY2VJRD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OndoZW4+MjAxNi0wNS0yNVQxOTo0OToyOCswNTozMDwvc3RFdnQ6d2hlbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnNvZnR3YXJlQWdlbnQ+QWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKTwvc3RFdnQ6c29mdHdhcmVBZ2VudD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmNoYW5nZWQ+Lzwvc3RFdnQ6Y2hhbmdlZD4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6YWN0aW9uPnNhdmVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDppbnN0YW5jZUlEPnhtcC5paWQ6MGRiNTUxYjgtMzBkMC02YTQyLTllMDAtZTQwODQzYTNhNTcxPC9zdEV2dDppbnN0YW5jZUlEPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6d2hlbj4yMDE4LTAxLTA1VDEyOjE0OjEzKzA1OjMwPC9zdEV2dDp3aGVuPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6c29mdHdhcmVBZ2VudD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNSAoV2luZG93cyk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpjaGFuZ2VkPi88L3N0RXZ0OmNoYW5nZWQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICA8L3JkZjpTZXE+CiAgICAgICAgIDwveG1wTU06SGlzdG9yeT4KICAgICAgICAgPHhtcE1NOkRlcml2ZWRGcm9tIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgPHN0UmVmOmluc3RhbmNlSUQ+eG1wLmlpZDplMmQxMzE5Mi1mOTQ0LWI1NGMtYTAwNy1kZGE1OGE1ZGMzMTY8L3N0UmVmOmluc3RhbmNlSUQ+CiAgICAgICAgICAgIDxzdFJlZjpkb2N1bWVudElEPnhtcC5kaWQ6YzQ2ZjQyMWEtYWZhYi1lYjQ5LWE3NmItNmU2MmUxMzg3ZGI3PC9zdFJlZjpkb2N1bWVudElEPgogICAgICAgICAgICA8c3RSZWY6b3JpZ2luYWxEb2N1bWVudElEPnhtcC5kaWQ6YzQ2ZjQyMWEtYWZhYi1lYjQ5LWE3NmItNmU2MmUxMzg3ZGI3PC9zdFJlZjpvcmlnaW5hbERvY3VtZW50SUQ+CiAgICAgICAgIDwveG1wTU06RGVyaXZlZEZyb20+CiAgICAgICAgIDxwaG90b3Nob3A6Q29sb3JNb2RlPjM8L3Bob3Rvc2hvcDpDb2xvck1vZGU+CiAgICAgICAgIDxwaG90b3Nob3A6SUNDUHJvZmlsZT5zUkdCIElFQzYxOTY2LTIuMTwvcGhvdG9zaG9wOklDQ1Byb2ZpbGU+CiAgICAgICAgIDxwaG90b3Nob3A6RG9jdW1lbnRBbmNlc3RvcnM+CiAgICAgICAgICAgIDxyZGY6QmFnPgogICAgICAgICAgICAgICA8cmRmOmxpPjI3OTVCQ0Y1MjZBMEQ1ODI0MkVDRkI4MUM5QTEzMjA0PC9yZGY6bGk+CiAgICAgICAgICAgICAgIDxyZGY6bGk+eG1wLmRpZDo5MTI1N2VkYy00OTdjLTk0NDEtYWZhMS03NTVhODQxM2I2NzM8L3JkZjpsaT4KICAgICAgICAgICAgICAgPHJkZjpsaT54bXAuZGlkOmM0NmY0MjFhLWFmYWItZWI0OS1hNzZiLTZlNjJlMTM4N2RiNzwvcmRmOmxpPgogICAgICAgICAgICA8L3JkZjpCYWc+CiAgICAgICAgIDwvcGhvdG9zaG9wOkRvY3VtZW50QW5jZXN0b3JzPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpYUmVzb2x1dGlvbj43MjAwMDAvMTAwMDA8L3RpZmY6WFJlc29sdXRpb24+CiAgICAgICAgIDx0aWZmOllSZXNvbHV0aW9uPjcyMDAwMC8xMDAwMDwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6UmVzb2x1dGlvblVuaXQ+MjwvdGlmZjpSZXNvbHV0aW9uVW5pdD4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT4xPC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDxleGlmOlBpeGVsWERpbWVuc2lvbj42OTwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj42MDwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgIAo8P3hwYWNrZXQgZW5kPSJ3Ij8+V0IgzQAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAARu0lEQVR42uSbfaykVX3HP+ecZ95n7vsuLOCuhcKiWAEj2Koh9sVUTEwES2ippLFW/9CyuGBVRKJVY0w1sW1MaEzaGmMaggK7S3mzCIIUq5SXvQvsK8uy7y935869M3fuzDwvp3+c88yceeaZ+6Jla+okJ8/cyZ25z/nO7/f9fn+/37lCa83t9z/LUo8cIS0U/xi+lQUyQ38vIyEjICchKyGnoKSgYFcxXp55Pb7GzyselLze7xUUFKS55mTvc7P272QkKEAKEM59hJEm1Bo/Aj/StENNy652CG3nNT+CZhAxkZOXqdHCjze/wITHb+BD26sUEGk9eVYpc2e1FV73ibsOcKQW1eVvIijSALLWD7lzLJ+Zqbai6z75o2McqQYwnuM3JlJEnGaCqyLNpxq+vqaY85hphWx65AiHZwOYLADi/zcoAhACT8C7NVwXRFzTCvS6Wjsin/WotUNufuQwB6s+TBZBC5BnABTtXPWQn4etYZ+1xGME+G0JF4dwmYa3hxFXdCLKC4Gm4Wtm2xEjhQzVVsCmhw/x2owPUzEg0qC4ko1FCHJEVPBZ0BkQVIBrbXoGaQAstRm9zLebAoYAlAAPyAIFoCSg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"></p><p style="text-align:center;">Date : '+jsDate.toString()+' </p>',
			customize: function (win) {
				$body = $(win.document.body);
				$body.find('h1').css('text-align', 'center');
			}
		}, {
			extend: "copy",
			className: "copyicon",
			exportOptions: {
				columns: ':visible'
			}
		},  {
			extend: "colvis",
			className: "colvisicon",
			text: "Columns",
			columns: ':gt('+hidden_col_colvis+')'
		}],
		"aoColumnDefs": [ {"sClass": "dt_col_hide", "aTargets": [0,6,7,8,9,10,11,12,13,14,15,16,17]}],//Hiding the Column,6,7,8,9,10,11,12,13,14,15,16,17
		responsive: !0,
		order: [[0, "asc"]],
		lengthMenu: [[5, 10, 15, 20, -1], [5, 10, 15, 20, "All"]],
		pageLength: 5,
		//dom: "<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>"
		dom: "<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-12'><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-6 col-sm-12'i><'col-md-6 col-sm-12'lp>>",
	});

	if (!myTable.fnGetData().length) {
		$("#"+tbl_name).dataTable().fnDestroy();
		$("#"+tbl_name).DataTable( {
			autoWidth: false,
			columns: tbl_columns,
			searching: false,
			lengthChange: false,
			language: {
				emptyTable: "No data available"
			},
			//columnDefs: [{ "visible": false, "targets": hidden_col }],
			"aoColumnDefs": [ {"sClass": "dt_col_hide", "aTargets": [0,6,7,8,9,10,11,12,13,14,15,16,17]}],//Hiding the Column ,6,7,8,9,10,11,12,13,14,15,16,17
		});
	}
}

//Salary Contract form validation
$('#individual_emp_benefit_formValidate').submit(function(e) {
	e.preventDefault();    
}).validate({
	rules: {
		benefit_name: {
			required: true,
			maxlength: 50,	
			alpha: true,	
		},
		salary_rule_category_id: {
			required:true,
			valueNotEquals:true,
		},	  	   
		periodicity_id: {
			required: true,
			valueNotEquals:true, 
		},   
	    computation_amount_type_benefit: {
			required: true,
			valueNotEquals:true, 
		},   
		benefit_effective_from_date: {
			required: true,
		},	  
		benefit_effective_to_date: {
			required: true,
		},
	},
	//For custom messages
	messages: {
		benefit_name: {
			required: "Enter Benefit Name",
			alpha: "Benefit Name cannot have numbers",
		},       
		salary_rule_category_id: {
			required: "Select Rule Category", 
			valueNotEquals:"Select Rule Category",
		},	   
		periodicity_id: {
			required: "Select Periodicity",
			valueNotEquals:"Select Periodicity", 
		},
		computation_amount_type_benefit: {
			required: "Select Computation Amount Type",
			valueNotEquals: "Select Computation Amount Type", 
		},
		benefit_effective_from_date: {
			required: "Enter Effective From Date",
		},
		benefit_effective_to_date: {
			required: "Enter Effective To Date",
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

//upper case change first letter for job title
$('#hr_salary_con_job_title').keyup(function(){
    $(this).val($(this).val().charAt(0).toUpperCase() + $(this).val().slice(1));
});

// Salary Contract Date onchnage function
$('#contract_dtimepicker2').on("change", function (e) {
var from_date = $("#contract_dtimepicker1").val()
var to_date = $("#contract_dtimepicker2").val()
var employee_id = $("#hr_salary_con_employee_name option:selected").val()
if (employee_id){
	$.ajax({	
		type  : 'POST',
		url   : '/performance_rating_data/',
		data  : {"from_date":from_date,"to_date":to_date,"employee_id":employee_id},
		async : false,
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		if(data){
			$("#hr_salary_con_basic").val(data.fixed_return)
		}else if(data.no_data == 'NTE-001'){
			alert_lobibox("error","No Range Information")
			$("#hr_salary_con_basic").val('')
		}else if(data.no_performance_data == 'NTE-002'){
			$("#hr_salary_con_basic").val('')
			alert_lobibox("error","No Performance Rating Information")
		}
	});
}else{
	alert_lobibox("error","Select Employee")
	$("#contract_dtimepicker1").val('')
	$("#contract_dtimepicker2").val('')
}

});

////amount split comma format in indian rupees
//$('#hr_salary_con_basic').keyup(function(){
//	var x=$("#hr_salary_con_basic").val();
//	//var res= x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
//	x=x.toString();
//	var lastThree = x.substring(x.length-3);
//	var otherNumbers = x.substring(0,x.length-3);
//	if(otherNumbers != '')
//	    lastThree = ',' + lastThree;
//	var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
//	$("#hr_salary_con_basic").val(res);
//});


