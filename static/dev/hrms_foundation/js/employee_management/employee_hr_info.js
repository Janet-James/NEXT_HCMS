$( document ).ready(function() {
});

function hr_create_function(){
	if(employee_hr_form_validation())
	{
		employee_hr_details_create_function();
	}	
}


$( "#employee_hr_delete_button" ).click(function() {
	employee_hr_details_remove_function();
});


function clear_function_hr_skills()
{ 
	$('.errormessage').html("");	
	document.getElementById('employee_hr_details_form').reset()
	$('#emp_type_id').val('0').trigger('change');	
	$('#employee_role_details').val('0').trigger('change');
	$('#related_user').val('0').trigger('change');	
	$('#attendance_options').val('0').trigger('change');	
	$('#shift_type').val('0').trigger('change');		
}


function employee_hr_details_create_function()
{
	if(employee_table_id)
	{	
			var project_form_value = getFormValues("#employee_hr_details_form");
			var    csrf_data = project_form_value.csrfmiddlewaretoken;
		    delete project_form_value["csrfmiddlewaretoken"];
		    project_form_value['is_active'] = "True";
		    project_form_value['date_of_confirmation'] = DateformatChange(validationFields(project_form_value['date_of_confirmation']));
		    project_form_value['date_of_resignation'] = DateformatChange(validationFields(project_form_value['date_of_resignation']));
		    project_form_value['date_of_relieving'] = DateformatChange(validationFields(project_form_value['date_of_relieving']));
		    project_form_value['emp_type_id'] = validationFields(project_form_value['emp_type_id']);
		    project_form_value['employee_role_details'] = validationFields(project_form_value['employee_role_details']);
		    project_form_value['related_user'] = validationFields(project_form_value['related_user']);
		    project_form_value['attendance_options'] = validationFields(project_form_value['emp_attendance_options']);
		    project_form_value['shift_type'] = validationFields(project_form_value['shift_type']);
		    
		    if($("#id_card_status").prop('checked') == true){
		    	project_form_value['id_card_status'] = true
		    }else{
		    	project_form_value['id_card_status'] = false
		    }
		    
		    if($("#employee_active").prop('checked') == true){
		    	project_form_value['employee_active'] = true
		    }else{
		    	project_form_value['employee_active'] = false
		    }
		    
		    project_form_value['payroll_active'] = true
		    
		    project_list = [];
			project_dict = {};
			project_list.push(project_form_value);
			project_dict['input_data'] = project_list;	
			
						
				 $.ajax({	
			         type  : 'POST',
			         url   : '/hrms_employee_hr_update/',
			         async : false,
			         data: {
			             'datas': JSON.stringify(project_list),
			             "table_id":employee_table_id,
			              csrfmiddlewaretoken: csrf_data
			         },
			     }).done( function(json_data) {
			    	 data = JSON.parse(json_data);
				 	 var res_status = data['status'];
				 	 if(res_status == 'NTE_03') {	 
				 		alert_lobibox("success", sysparam_datas_list[res_status]);
				 		let emp_is_active = data['employee_status'];
				 		location.reload();
				 		employee_datatable_function();
				 		clear_function_hr_skills();
				 		$('#hrms_employee_list').val(employee_table_id).trigger('change');
				 	 }else if(res_status == 'ERR0020')				 		 
				 		alert_lobibox("info",sysparam_datas_list['NTE_71'])
				 	 else {
				 		alert_lobibox("error",sysparam_datas_list['ERR0040'])
				 	 }
			     });     
	}else
	{
		alert_lobibox("info",sysparam_datas_list['NTE_66'])
	}	
}

function employee_hr_details_remove_function()
{
	if(employee_table_id)
	{		
		$.ajax({	
	         type  : 'POST',
	         url   : '/hrms_employee_hr_update/',
	         async : false,
	         data: {
	             "delete_id":employee_table_id,
	              csrfmiddlewaretoken : $("input[name=csrfmiddlewaretoken]").val()
	         },
	     }).done( function(json_data) {
	    	 data = JSON.parse(json_data);
		 	 var res_status = data['status'];
		 	 if(res_status == 'NTE_04') {	 		
		 		clear_function_hr_skills();
		 		alert_lobibox("success", sysparam_datas_list[res_status]);
		 		let emp_is_active = data['employee_status'];
		 		location.reload();
		 		employee_datatable_function();
		 		$('#hrms_employee_list').val(employee_table_id).trigger('change');		 		
		 	 } else {
		 		alert_lobibox("error","Error in Removing Details")
		 	 }
	     });     
	
	}else
	{
		alert_lobibox("info",sysparam_datas_list['NTE_66'])
	}	
}

$('#related_user').change(function(){
	$('.errorTxt31').html('');
});

$('#emp_type_id').change(function(){
	$('.errorTxt42').html('');
});

$('#employee_role_details').change(function(){
	$('.errorTxt29').html('');
});

jQuery.validator.addMethod('valueNotEquals', function (value) {
    return (value != '0');
}, "");


$('#employee_hr_details_form').submit(function(e) {
    e.preventDefault();    
}).validate({
   rules: {
	   related_user: {
		   required: true,
		   valueNotEquals: true,
	   },
	   emp_type_id: {
		   required: true,
		   valueNotEquals: true,
	   },
	   employee_role_details: {
		   required: true,
		   valueNotEquals: true,
	   },
   },
   //For custom messages
   messages: {
	   related_user: {
           required: "Select Related User",
           valueNotEquals: "Select Valid Related User",
       }, 
       emp_type_id: {
    	   required: "Select Employee Type",
           valueNotEquals: "Select Valid Employee Type",
       },
       employee_role_details: {
    	   required: "Select Position",
           valueNotEquals: "Select Valid Position",
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


//Employee primary form validations here
function employee_hr_form_validation()
{
	return $('#employee_hr_details_form').valid();
}

//Load department details drop down
function load_deparment_details(org_id)
{
	$.ajax({
		url : "/hrms_fetch_department_drop_down/",
		type : "POST",
		data : {"org_id":org_id},
		csrfmiddlewaretoken : $("input[name=csrfmiddlewaretoken]").val(),
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		if(data){
				$("#related_user").empty();
				$("#related_user").append("<option value='0' selected>--Select Related User--</option>");
				hrcurrent_status = hrcurrent_status == null ? true : hrcurrent_status;
				for (var i=0;i<data.related_user_info.length;i++)
				{			
					if(data.related_user_info[i].is_active == hrcurrent_status){
						$("#related_user").append("<option value='"+data.related_user_info[i].id+"'>"+data.related_user_info[i].name+"</option>");
					}
				}
		}
	});
}

function button_create_hr(){
    var access_for_write = jQuery.inArray( "Employee Details", JSON.parse(localStorage.Write) );
    var strAppend = '';
    if (access_for_write != -1){
        strAppend = "<button type='button'  id='employee_hr_edit_button' onclick='hr_create_function();'  class=' btn-primary btn-animate btn-eql-wid  btn'>Update</button>"
        strAppend += " <button type='button' onclick='clear_function_hr_skills()' class='btn-warning btn-animate btn-eql-wid  btn'>Cancel / Clear</button>"
        $('#hrms_hr_setting_btn').html(strAppend);
    }
}
 
