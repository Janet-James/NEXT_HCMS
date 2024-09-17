$( document ).ready(function() {
	button_create(1);
	//switcher function here
	
	$("#dtBox").DateTimePicker({
		dateFormat: "dd-MM-yyyy",
		maxDate: new Date(),
	});
});


//Candidate basic details create function here 
function candidate_primary_create_button() {
	if(candidate_primary_form_validation())
	{
		candidate_details_create_function(0);
	}
}

//Candidate basic details edit function here 
function candidate_primary_edit_button() {
	if(candidate_primary_form_validation())
	{
		candidate_details_create_function(1);
	}
}

//Candidate basic details delete function here 
function candidate_primary_delete_button() {
	var title = $('#ta_candidate_list option:selected').text();
	removeConfirmation('candidate_details_delete_function','',title);
}

//clear candidate function here
function clear_candidate_info() {
	if(candidate_table_id != 0 ){
		var title = $('#ta_candidate_list option:selected').text();
		orgClearFuncton('candidate_primary_cancel_button','',title);
	}else{
		clear_function_candidate();
	}
}

//candidate primary details clear function here 
function candidate_primary_cancel_button() {	
	candidate_table_id = 1;
	$('#ta_candidate_list').val(0).trigger('change');
}

//clear candidate function here
function clear_function_candidate()
{ 
	$('.thumbnail').html("");
	$('.errormessage').html("");	
	img_id = 0;
	document.getElementById('candidate_basic_details_form').reset()
	$('#gender,#title,#candidate_country,#candidate_province,#job_opening').val('0').trigger('change');	
	candidate_table_id = 0;	
	$('#candidate_dob').val('');
	$(".date_input_class").trigger('change');
}

//email function already exit function here
$('#primary_email,#secondary_email').keyup(function(){
	primary_email = $('#primary_email').val()
	secondary_email = $('#secondary_email').val()
	
	if(primary_email!='' && secondary_email!=''){
		if(primary_email == secondary_email){
			$('.errorTxt5').html("Primary Email and Secondary Email cannot be same")
		}else{
			$('.errorTxt5').html("")
		}
	}
});

//employee create function here
function candidate_details_create_function(status)
{		
				var project_form_value = getFormValues("#candidate_basic_details_form");
				var    csrf_data = project_form_value.csrfmiddlewaretoken;
			    delete project_form_value["csrfmiddlewaretoken"];
			    project_form_value['is_active'] = "True";		    
			    project_form_value['date_of_birth'] = DateformatChange(validationFields(project_form_value['candidate_dob']));
			    project_form_value['gender_id'] = validationFields(project_form_value['gender']);
			    project_form_value['title_id'] = validationFields(project_form_value['title']);
			    project_form_value['country_id'] = validationFields(project_form_value['candidate_country']);
			    project_form_value['province_id'] = validationFields(project_form_value['candidate_province']);
			    project_form_value['job_opening_id'] = validationFields(project_form_value['job_opening']);
//			    var experience = project_form_value['candidate_experience'] != '' ? project_form_value['candidate_experience']  :  0;
//			    project_form_value['candidate_experience'] = experience;
			    
			    project_list = [];
				project_dict = {};
				project_list.push(project_form_value);
				project_dict['input_data'] = project_list;
				
				if(candidate_table_id)
				{
						$.ajax({	
					         type  : 'POST',
					         url   : '/ta_candidate_create/',
					         async : false,
					         data: {
					              'datas': JSON.stringify(project_list),
					              "candidate_id": candidate_table_id,
					              csrfmiddlewaretoken: csrf_data,
					         },
					     }).done( function(json_data) {
					    	 data = JSON.parse(json_data);
						 	 var res_status = data['status'];
						 	var res_id = data['status_id'];
						 	 if(res_status == 'NTE_03') {	
						 		alert_lobibox("success", sysparam_datas_list[res_status]);
						 		button_create(1)
						 		clear_function_candidate();
						 		candidate_drop_down_function();		
					 			candidate_table_id = res_id;
						 		drawCandidateList();
						 		flag_insert = false;
						 		$('#ta_candidate_list').val(res_id).trigger('change');
						 	 } else {
						 		alert_lobibox("error",sysparam_datas_list['ERR0040'])
						 	 }
					     });				     
				}else
				{							
						$.ajax({
					         type  : 'POST',
					         url   : '/ta_candidate_create/',
					         async : false,
					         data: {
					             'datas': JSON.stringify(project_list),
					              csrfmiddlewaretoken: csrf_data
					         },
					     }).done( function(json_data) {
					    	data = JSON.parse(json_data);
					 		var res_status = data['status'];
					 		var res_id = data['status_id'];
					 		if(res_status == 'NTE_01') {
					 			alert_lobibox("success", sysparam_datas_list[res_status]);
					 			button_create(1)
					 			clear_function_candidate();
					 			candidate_drop_down_function();		
					 			candidate_table_id = res_id;
					 			drawCandidateList();
					 			$('#ta_candidate_list').val(res_id).trigger('change');
					 			$('#candidate_status').val('669').trigger('change');
					 		} else {
					 			alert_lobibox("error","Error in Inserting Details")		 			
					 		}
					     });					
				}		
			
}

//validation for the empty
function validationFields(val){
	return val=='' || val =='0' ?null:val 
}

//Organization delete function here
function candidate_details_delete_function(){
	
	if(candidate_table_id)
	{
		$.ajax({
		type  : 'POST',
		url   : '/ta_candidate_create/',
		async : false,
		data: {
			'delete_id':candidate_table_id,
			csrfmiddlewaretoken : $("input[name=csrfmiddlewaretoken]").val()
		},
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		var res_status = data['status'];
		if(res_status == 'NTE_04') { 	
			alert_lobibox("success", sysparam_datas_list[res_status]);
			drawCandidateList();
			button_create(1)
		} else{
			alert_lobibox("error","Error in Deleting Details")
		}
	});
	}else
	{
		alert_lobibox("info",sysparam_datas_list['NTE_66']);
	}
	$('#ta_candidate_list').val(0).trigger('change');
	candidate_drop_down_function();
}

//jquery attendance validation
//Adding validator method for tele phone number
jQuery.validator.addMethod("phone_number", function(value, element) {
      // allow any non-whitespace characters as the host part
	return this.optional( element ) || /^\d{3}([-])\d{7}$/.test( value );      
}, 'Please enter a valid phone number.');

jQuery.validator.addMethod("custom_mobile_number", function(value, element) {
    // allow any non-whitespace characters as the host part
	if(value.length == 8){
		return mobileNumberAlreadyExits(value);
	}else{
		return true;
	}
}, '');

//mobile number already exits validation
function mobileNumberAlreadyExits(value){
	var status = 0;
	if(candidate_table_id != 0){
		var datas =  {
				'candidate_id' : candidate_table_id,
				'mobile_numbers':value,
				csrfmiddlewaretoken : $("input[name=csrfmiddlewaretoken]").val()
		}
	}else{
		var datas =  {
				'mobile_numbers':value,
				csrfmiddlewaretoken : $("input[name=csrfmiddlewaretoken]").val()
		}
	}
	$.ajax({
		type  : 'POST',
		url   : '/hrms_candidate_mobile_number_validation/',
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
	return status == 0 ? true : false
}

//validation function here
jQuery.validator.addMethod('valueNotEquals', function (value) {
    return (value != '0');
}, "");

//gender function here
$('#gender').change(function(){
	$('.errorTxt2').html('');
	gender_val = $('#gender').val();
	load_title_from_gender(gender_val);
});

//candidate country change function here 
$('#candidate_country').change(function() {	
	country = $('#candidate_country').val();
	load_province_from_country(country);
	$('.errorTxt12').html('');
});

//load title from gender function here
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
				if(candidate_table_id==0 || gender_flag==true){
					if(id!=0) {                    
						if(i==0)
						{
							$("#title").append("<option value='"+data[i].id+"' selected>"+data[i].refitems_name+"</option>");
						}else
						{
							$("#title").append("<option value='"+data[i].id+"'>"+data[i].refitems_name+"</option>");        
						}
						$('.errorTxt3').html('');    
					}
				}else{
					$("#title").append("<option value='"+data[i].id+"'>"+data[i].refitems_name+"</option>");
					$('.errorTxt3').html('');    
				}                            
			}
		}
	});
}

//load province from country function here
function load_province_from_country(country_id)
{
	$.ajax({
		url : "/hrms_organization_list_province/",
		type : "POST",
		data : {"country_id":country_id},
		csrfmiddlewaretoken : $("input[name=csrfmiddlewaretoken]").val(),
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		if(data){			
				$("#candidate_province").empty();
				$("#candidate_province").append("<option value='0' selected>--Select Province--</option>");
				for (var i=0;i<data.length;i++)
				{			
					$("#candidate_province").append("<option value='"+data[i].id+"'>"+data[i].state_name+"</option>");					
				}
				$('.errorTxt13').html('');  
		}
	});
}

//job opening on change function here
$('#job_opening').change(function(){
	$('.errorTxt15').html('');
});

//title change function here
$('#title').change(function(){
	$('.errorTxt3').html('');
});

//select change function here
$('.select2').select2().change(function(){
	$('.errormessage').html('');
});

//candidate dob change function here
$('#candidate_dob').change(function(){
	age = calculateAge($('#candidate_dob').val())
	if(age<=18)
	{
		$('#dob_error').text("Age should be greater than 18");
	}else{
		$('#dob_error').text("");
	}
});

//email validation
$.validator.addMethod("email", function(value, element) {
var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
if( !emailReg.test( value ) ) {
    return false;
} else {
    return true;
}
});

//validator change function here
$.validator.addMethod("alpha", function(value, element) {
    return this.optional(element) || value == value.match(/^[a-zA-Z\s]+$/);
});
jQuery.validator.addMethod("phone_number", function(value, element) {
    // allow any non-whitespace characters as the host part
    return this.optional( element ) || /^\d{3}([-])\d{7}$/.test( value );     
}, '');
$('#candidate_basic_details_form').submit(function(e) {
    e.preventDefault();    
}).validate({
   rules: {
	   first_name: {
		   required: true,
		   maxlength: 50,
		   alpha: true,
	   },
	   last_name: {
		   required: true,
		   maxlength: 50,
		   alpha: true,
	   },
	   gender: {
    	   required: true,
		   valueNotEquals:true,
       },
       title:{
		   required:true,
		   valueNotEquals:true,
	   },
	  /* candidate_dob:{
		   required: true,
	   },*/
	   primary_email: {
		   required: true,
		   email: true,
		   maxlength: 100,
	   },
	   secondary_email: {
		   email: true,
		   maxlength: 100,
	   },
	   mobile_no: {
		   number:true,
		   required:true,
		   maxlength:10,
		   minlength:10,
	   },
	   phone_no: {
		//   phone_number:true,
		   maxlength:10,
		   minlength:10,
       },   
       candidate_country: {
    	   required: true,
		   valueNotEquals:true, 
       },  
       candidate_province: {
    	   required: true,
		   valueNotEquals:true,
       },
       job_opening:{
    	   required: true,
		   valueNotEquals:true,
       }
   },
   //For custom messages
   messages: {
	   first_name: {
           required: "Enter First Name",
           maxlength: "Name cannot exceed 50 Characters",
           alpha: "Name cannot have Numbers",
       },
       last_name: {
    	   required: "Enter Last Name",
           maxlength: "Name cannot exceed 50 Characters",
           alpha: "Name cannot have Numbers",
       },  
       mobile_no: {
    	   required: "Enter Mobile Number", 
    	   number: "Mobile Number cannot have Characters",
    	   maxlength: "Mobile Number cannot exceed 10 Digits",
    	   minlength: "Mobile Number cannot lesser than 10 Digits",    	  
       },	   	  
	   primary_email: {
		   required: "Enter Email Id",
		   email: "Email is Invalid",
		   maxlength: "Email cannot exceed 100 Characters",
	   },
	   secondary_email: {
		   email: "Email is Invalid",
		   maxlength: "Email cannot exceed 100 Characters",
	   },
	   email: {
		   email: "Email is Invalid",
		   maxlength: "Email cannot exceed 100 Characters",
	   },
	   phone_no: {
		   maxlength: "Phone Number cannot exceed 10 Digits",
    	   minlength: "Phone Number cannot lesser than 10 Digits",    	  
       },	  
       gender: {
		   valueNotEquals: "Select Gender", 
	   },   	  
	   title: {
		   valueNotEquals: "Select Title", 
	   },	  
	  /* candidate_dob : {
		   required : "Enter Candidate Date of Birth"
	   },*/
	   candidate_country:{
		   valueNotEquals:"Select Country",
	   },
	   candidate_province:{
		   valueNotEquals:"Select State",
	   },
	   job_opening:{
		   valueNotEquals:"Select Job Opening",
       }	   
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

//Employee candidate form validations here
function candidate_primary_form_validation()
{
	return $('#candidate_basic_details_form').valid();
}

//button create function here
function button_create(status){
	var access_for_create = jQuery.inArray( "Candidate Tracking System", JSON.parse(localStorage.Create) );
	var access_for_write = jQuery.inArray( "Candidate Tracking System", JSON.parse(localStorage.Write) );
	var access_for_delete = jQuery.inArray( "Candidate Tracking System", JSON.parse(localStorage.Delete) );
	var strAppend = '';
	if(status == 1){
		if (access_for_create != -1){
			strAppend = "<button type='button' onclick='candidate_primary_create_button()' class='btn btn-success btn-animate btn-eql-wid'>Add</button>"
		}strAppend += " <button type='button' onclick='clear_candidate_info()' class='btn btn-warning btn-animate btn-eql-wid'>Cancel / Clear</button>"
			$('#hrms_candidate_btn').html(strAppend);
	}else{
		if (access_for_write != -1){
			strAppend = "<button type='button' onclick='candidate_primary_edit_button()' class=' btn-primary btn-animate btn-eql-wid  btn'>Update</button>"
		}if (access_for_delete != -1){
			strAppend += " <button type='button' onclick='candidate_primary_delete_button()' class='btn-animate btn-eql-wid  btn btn-danger'>Remove</button>"
		}strAppend += " <button type='button' onclick='clear_candidate_info()' class='btn-warning btn-animate btn-eql-wid  btn'>Cancel / Clear</button>"
			$('#hrms_candidate_btn').html(strAppend);
	}
}


// Age calculation function
function calculateAge(birthday) { // birthday is a date
		var today = new Date();
	    var birthDate = new Date(birthday.replace(/(\d{2})[-/](\d{2})[-/](\d+)/, "$2/$1/$3"));
	
	    var age = today.getFullYear() - birthDate.getFullYear();
	    var m = today.getMonth() - birthDate.getMonth();
	    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
	        age--;
	    }	    	    
	    return age;
}


//first name and last name should be upper case function here
$('#first_name,#last_name').keyup(function(){
    $(this).val($(this).val().toUpperCase());
});