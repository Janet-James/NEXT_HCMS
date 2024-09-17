$( document ).ready(function() {
});

//Employee personal details create function here 
$( "#employee_personal_edit_button" ).click(function() {
	if(employee_table_id)
	{
		if(employee_personal_form_validation())
		{
			employee_personal_details_create_function();
		}
	}else
	{
		alert_lobibox("info",sysparam_datas_list['NTE_66'])
	}		
});

$( "#employee_personal_delete_button" ).click(function() {
	employee_personal_details_remove_function();	
});

$("#employee_personal_cancel_button").click(function() {
	clear_function_personal();
});

function clear_function_personal()
{ 
	$('.errormessage').html("");	
	document.getElementById('employee_personal_details_form').reset()
	$('#emp_martial_status').val('0').trigger('change');	
	$('#blood_group').val('0').trigger('change');	
	$('#disability_category').val('0').trigger('change');	
	$('#disability_percentage').val('0').trigger('change');	
}

// Hiding spouse details for marital status single
$("#emp_martial_status").change(function() {
	if($('#emp_martial_status option:selected').text().toLowerCase() == ('Single').toLowerCase())
	{
		  $("#spouse_name,#spouse_contact_no,#spouse_employer,#spouse_dob,#no_of_children").val("")	
		  $('#spouse_name,#spouse_contact_no,#spouse_employer,#spouse_dob,#no_of_children,#spouse_same_org').attr("disabled", true); 
		  
	}else if($('#emp_martial_status option:selected').val()=='0'){

		  $("#spouse_name,#spouse_contact_no,#spouse_employer,#spouse_dob,#no_of_children").val("")	
		  $('#spouse_name,#spouse_contact_no,#spouse_employer,#spouse_dob,#no_of_children,#spouse_same_org').attr("disabled", true);
		  
	}else
	{
		  $('#spouse_name,#spouse_contact_no,#spouse_employer,#spouse_dob,#no_of_children,#spouse_same_org').attr("disabled", false); 
	}	
});

$('#physically_challenged').change(function() {
	  if($(this).prop('checked') == true)
	  {
		  $('#disability_category').val('0').trigger('change');
		  $('#disability_category').attr("disabled", false); 	
		  
		  $('#disability_percentage').val('0').trigger('change');
		  $('#disability_percentage').attr("disabled", false); 	
	  }else
	  {
		  $('#disability_category').val('0').trigger('change');
		  $('#disability_category').attr("disabled", true); 
		  
		  $('#disability_percentage').val('0').trigger('change');
		  $('#disability_percentage').attr("disabled", true); 
	  }	  
})

$('#gender').change(function() {	  
	gender_val = $('#gender').val();
	load_title_from_gender(gender_val);
})	


//function load_title_from_gender(id)
//{
//	$.ajax({
//		url : "/reference_item_link_employee/",
//		type : "POST",
//		data : {"ref_id":id},
//		csrfmiddlewaretoken : $("input[name=csrfmiddlewaretoken]").val(),
//		timeout : 10000,
//		async:false,
//	}).done( function(json_data) {
//		data = JSON.parse(json_data);
//		if(data){
//				$("#title").empty();
//				$("#title").append("<option value='0' selected>--Select Title--</option>");
//				for (var i=0;i<data.length;i++)
//				{			
//					$("#title").append("<option value='"+data[i].id+"'>"+data[i].refitems_name+"</option>");
//					$('.errorTxt41').html('');					
//				}
//		}
//	});
//}

function load_title_from_gender(id)
{
	$.ajax({
		url : "/reference_item_link_employee/",
		type : "POST",
		data : {"ref_id":id},
		csrfmiddlewaretoken : $("input[name=csrfmiddlewaretoken]").val(),
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		if(data){
			$("#title").empty();
			$("#title").append("<option value='0' selected>--Select Title--</option>");
			for (var i=0;i<data.length;i++){        
				if(employee_table_id==0 || gender_flag==true){
					if(id!=0) {                    
						if(i==0)
						{
							$("#title").append("<option value='"+data[i].id+"' selected>"+data[i].refitems_name+"</option>");
						}else
						{
							$("#title").append("<option value='"+data[i].id+"'>"+data[i].refitems_name+"</option>");        
						}
						$('.errorTxt41').html('');    
					}
				}else{
					$("#title").append("<option value='"+data[i].id+"'>"+data[i].refitems_name+"</option>");
					$('.errorTxt41').html('');    
				}                            
			}
		}
	});
}

//spouse same organization check
$("#spouse_same_org").change(function() {
    if(this.checked) {
    	var org_name = $('#organization_id option:selected').text();
    	$('#spouse_employer').val(org_name).prop('disabled', true);
    }else{
    	$('#spouse_employer').val('').prop('disabled', false);
    }
});

function employee_personal_details_create_function()
{	
	var project_form_value = getFormValues("#employee_personal_details_form");
	var    csrf_data = project_form_value.csrfmiddlewaretoken;
    delete project_form_value["csrfmiddlewaretoken"];
    project_form_value['is_active'] = "True";
    project_form_value['uan'] = validationFields(project_form_value['uan']);
    project_form_value['emp_martial_status'] = project_form_value['emp_martial_status'] !=undefined ? project_form_value['emp_martial_status'] : '';
    project_form_value['spouse_dob'] = DateformatChange(validationFields(project_form_value['spouse_dob']));
    project_form_value['mother_dob'] = DateformatChange(validationFields(project_form_value['mother_dob']));
    project_form_value['father_dob'] = DateformatChange(validationFields(project_form_value['father_dob']));
    project_form_value['blood_group'] = validationFields(project_form_value['blood_group']);
    var children = project_form_value['no_of_children'] != undefined ? project_form_value['no_of_children']  :  '';
    var personal_email_id_status = project_form_value['personal_email_id'] != undefined ? project_form_value['personal_email_id']  :  '';
    project_form_value['no_of_children'] = children 
    var spouse_name = project_form_value['spouse_name'] != undefined ? project_form_value['spouse_name']  :  '';
    project_form_value['spouse_name'] = spouse_name 
    var spouse_contact_no = project_form_value['spouse_contact_no'] != undefined ? project_form_value['spouse_contact_no']  :  '';
    project_form_value['spouse_contact_no'] = spouse_contact_no
    var spouse_employer = $('#spouse_employer').val() != undefined ? $('#spouse_employer').val()  :  '';
    project_form_value['spouse_employer'] = spouse_employer
    
    if($("#physically_challenged").prop('checked') == true){       	
       	project_form_value['physically_challenged'] = true
       	project_form_value['disability_category'] = validationFields(project_form_value['disability_category']);
       	project_form_value['disability_percentage'] = validationFields(project_form_value['disability_percentage'])
       	
    }else {
       	project_form_value['physically_challenged'] = false
       	project_form_value['disability_category'] = validationFields(0);       	
    	project_form_value['disability_percentage'] = validationFields(0);
    }	
    
    if($("#spouse_same_org").prop('checked') == true){
    	project_form_value['spouse_same_org'] = true
    }else {
       	project_form_value['spouse_same_org'] = false
    }
      	
    project_list = [];
	project_dict = {};
	project_list.push(project_form_value);
	project_dict['input_data'] = project_list;	
		$.ajax({	
	         type  : 'POST',
	         url   : '/hrms_employee_personal_update/',
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
		 		clear_function_personal();
		 		alert_lobibox("success", sysparam_datas_list[res_status]);
		 		employee_datatable_function();
		 		$('#hrms_employee_list').val(employee_table_id).trigger('change');
		 	 } else {
		 		alert_lobibox("error",sysparam_datas_list['ERR0040'])
		 	 }
	     });    
}

function employee_personal_details_remove_function()
{
	if(employee_table_id)
	{
		$.ajax({	
	         type  : 'POST',
	         url   : '/hrms_employee_personal_update/',
	         async : false,
	         data: {
	             "delete_id":employee_table_id,
	              csrfmiddlewaretoken : $("input[name=csrfmiddlewaretoken]").val()
	         },
	     }).done( function(json_data) {
	    	 data = JSON.parse(json_data);
		 	 var res_status = data['status'];
		 	 if(res_status == 'NTE_04') {	 			
		 		clear_function_personal();
		 		alert_lobibox("success", sysparam_datas_list[res_status]);
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

/*jQuery.validator.addMethod("tin_number", function(value, element) {
    // allow any non-whitespace characters as the host part
	return this.optional( element ) || /^\d{3}([-])\d{3}([-])\d{3}$/.test( value );    
}, 'Please enter a valid TIN number.');*/

jQuery.validator.addMethod("custom_pfn_number", function(value, element) {
    // allow any non-whitespace characters as the host part
	if(value.length == 12){
		return pfNumberAlreadyExits(value);
	}else{
		return true;
	}
}, '');

//mobile number already exits validation
function pfNumberAlreadyExits(value){
	var status = 0;
	if(employee_table_id != 0){
		var datas =  {
				'emp_id' : employee_table_id,
				'pf_numbers':value,
				csrfmiddlewaretoken : $("input[name=csrfmiddlewaretoken]").val()
		}
		$.ajax({
			type  : 'POST',
			url   : '/hrms_employee_pf_number_validation/',
			async : false,
			data:datas,
		}).done( function(json_data) {
			data = JSON.parse(json_data);
			var res_status = data.datas;
			if(res_status.length != 0) { 	
				status = 1;
			}else{
				status = 0;
			}			
		});
	}else{
		return 0
	}
	return status == 0 ? true : false
}

$('#employee_personal_details_form').submit(function(e) {
    e.preventDefault();    
}).validate({
   rules: {
	  /* provident_fund_uan_no: {
		   number: true,
		   required: true,
		   maxlength: 12,	
		   minlength: 12,
		   custom_pfn_number  : true,
	   },*/
	   spouse_contact_no:{
		   number: true,
		   minlength:10,
		   maxlength:10,
	   },
	   no_of_children:{
		   number: true,
		   maxlength: 2,	
	   },
	 /*  pan_no:{
		  required: true, 
		  tin_number: true,		 
	   },*/
	   citizenship_no:{
		  maxlength: 12,
		  minlength: 12,
	   },	
	   spouse_name: {
		   maxlength: 50,
	   },
	   mother_name: {
		   maxlength: 50,
	   },
	   father_name: {
		   maxlength: 50,
	   },
	   no_of_dependents: {
		   number: true,
	   },
	   personal_email_id: {
		   email: true,
		   maxlength: 100,
	   }
	   /*license_no:{
		   minlength: 7,
		   maxlength: 7,
	   }*/
   },
   //For custom messages
   messages: {
      /* provident_fund_uan_no: {
    	   number: "PF Number cannot be a Character",
           required: "Enter PF Number",
           maxlength: "PF Number cannot cannot exceed 12 Digits",
           minlength: "PF Number cannot cannot be lesser than 12 Digits",
           custom_pfn_number : "PF Number Already Exits"
       },*/     
       spouse_contact_no: {
    	   required: "Enter Contact Number", 
    	   number: "Contact Number cannot be a Character",
    	   maxlength: "Contact Number cannot exceed 10 Digits",
    	   minlength: "Contact Number cannot lesser than 10 Digits",    
       },
       no_of_children: {
    	   number: "Number of Children cannot contain Characters",
    	   maxlength: "Number of Children cannot exceed more than two Digits",
       },
       /*pan_no: {
    	   required: "Enter TIN Number",
		   tin_number: "Enter valid TIN Number Ex.111-222-333",
	   },*/	
	   citizenship_no: {		   
		   maxlength: "Aadhar Number cannot exceed 12 Characters",
		   minlength: "Aadhar Number cannot be lesser than 12 Characters",
	   },
	   spouse_name: {
		   maxlength: "Name cannot exceed 50 Characters",  
	   },
	   mother_name: {
		   maxlength: "Name cannot exceed 50 Characters",  
	   },
	   father_name: {
		   maxlength: "Name cannot exceed 50 Characters",
	   },	   
	   no_of_dependents: {		   
		   number: "Number of Dependents cannot contain Characters",
	   },	
	   personal_email_id: {
		   email: "Email is Invalid",
		   maxlength: "Email cannot exceed 100 Characters",
	   }
	  /* license_no: {
		   maxlength: "License Number cannot exceed 7 Characters",
		   minlength: "License Number cannot be lesser than 7 Characters",
	   },*/
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
function employee_personal_form_validation()
{
	return $('#employee_personal_details_form').valid();
}

//auto - generate
/*$('#pan_no').keyup(function() {
	var $this = $(this);
	if($this.val()){
		if($this.val().length == 3 || $this.val().length == 7 ){
			$this.val($this.val()+'-');  
		}else{
			return true;
		}
	}
});*/

$('#pan_no').keyup(function(){
    $(this).val($(this).val().toUpperCase());
});