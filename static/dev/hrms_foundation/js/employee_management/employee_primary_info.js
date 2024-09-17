var emp_auto_ids = '',org_name = '',org_unit_name = '';
$( document ).ready(function() {
	$('.thumbnail').html("")
	//employee_datatable_function();
	//switcher function here
	$("#form_wizard_1" ).click(function() {
		  $( "#switcher1" ).removeClass('open');
		});
	$("#dtBox").DateTimePicker({
		dateFormat: "dd-MM-yyyy",
		maxDate: new Date(),
	});
});

//select org unit function
$("#select_org").click(function() {
	var org_val = $('#organization_id option:selected').val();
	if(org_val == '0')
	{
		alert_lobibox("info","Organization not selected");
	}else
	{
		$('.popup_zindex').css({'opacity':'.7'});//search select btn zindex
		show_org_unit_popup(org_val);
	}	
});

//org unit popup
function show_org_unit_popup(org_val){
	$('#organization_id_popup').val(org_val).trigger('change');
	$('#organization_id_popup').prop("disabled", true); 
	$('#org_tree_single').parent().hide();
	$('#org_tree_multi').parent().hide();
	$('#orgModal').modal('show');
	
	$("#org_unit_save").click(function() {
		org_unit_names =  remove_duplicate_org_unit(org_unit_name);
		org_unit_ids =  remove_duplicate_org_unit(org_unit_id);	
		$("#org_unit_id").val(org_unit_ids[0]).trigger('change')
		role_drop_down_function(org_unit_ids[0]);
		$('.errorTxt4').html('');
		generate_emp_id();	
	});
}

//employee id generate here
function generate_emp_id(){
    $('#employee_id').val("")
    emp_auto_id = "";
    var emp_code_prefix = ""
    	
    var org_name = $('#organization_id option:selected').text().toString();
    var org_names = ''
    if(org_name != ''){
    	org_names = org_name.match(/\b(\w)/g).join('').substring(0,3);   
    }
	if(org_unit_name != ''){
		org_unit_names = org_unit_name.toString().match(/\b(\w)/g).join('').substring(0,3);
	}else{
		org_unit_names = '';
	}
	var res_org = check_dynamic_code('organization_id', org_names);
	var res_org_unit = check_dynamic_code('org_unit_id', org_unit_names);
		
	if(res_org==true)
	{
		name = org_names.substring(0, org_names.length - 1)
		var lastChar = org_name.substr(org_name.length - 1);
		org_names = name+lastChar;
	}
	
	if(res_org_unit==true)
	{
		var words = $.trim($(org_unit_name).val()).split(" ");
		if(words.length>1){
			name = org_unit_names.substring(0, org_unit_names.length - 1)
			var lastChar = org_unit_name.substr(org_unit_name.length - 1)
			org_unit_names = name+lastChar;
		}
	}
	
	emp_auto_id = (org_names+"-"+org_unit_names).toUpperCase();
    emp_auto_create_id = emp_auto_id.replace(/[`~!@#$%^&*()_|+\=?;:'",.<>\{\}\[\]\\\/]/gi,'');
    emp_auto_ids = emp_auto_create_id+'-'+emp_matrix_id;   
    $('#employee_id').val(emp_auto_ids)    
}

function check_dynamic_code(dropdown_id,code){
	var flag = 0;
	var vals = [];
	
	$(' #'+dropdown_id+' option').each(function() { 
		vals.push(this.text);
	});
	for (var i=0;i<vals.length;i++){
		temp = vals[i].match(/\b(\w)/g).join('').substring(0,3);
		if(temp==code){
			flag++;
		}			
	}
		
	if(flag>1){
		return true
	}else{
		return false
	}
}

function remove_duplicate_org_unit(list){
	var uniqueNames = [];
	$.each(list, function(i, el){
	    if($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
	});
	return uniqueNames;
}

//Employee primary details create function here 
function employee_primary_create_button() {
	if(employee_primary_form_validation())
	{
		employee_primary_details_create_function(0);
	}
}

//Employee primary details edit function here 
function employee_primary_edit_button() {
	if(employee_primary_form_validation())
	{
		employee_primary_details_create_function(1);
	}
}

//Employee primary details delete function here 
function employee_primary_delete_button() {
	var title = $('#hrms_employee_list option:selected').text();
	removeConfirmation('employee_primary_details_delete_function','',title);
}

function clear_primary_info() {
	if(employee_table_id != 0 ){
		var title = $('#hrms_employee_list option:selected').text();
		orgClearFuncton('employee_primary_cancel_button','',title);
	}else{
		employee_primary_cancel_button();
	}
}

//Employee primary details clear function here 
function employee_primary_cancel_button() {	
	employee_table_id = 1;
	$('#hrms_employee_list').val(0).trigger('change');
}

function clear_function_primary()
{ 
	emp_auto_ids = ""
	$('.thumbnail').html("");
	$('.errormessage').html("");	
	img_id = 0;
	document.getElementById('employee_primary_details_form').reset()
	$('#gender').val('0').trigger('change');
	$('#organization_id').val('0').trigger('change');	
	$("#org_unit_id").html("<option value='0' selected>--Select Org Unit--</option>");
	$("#reporting_officer").html("<option value='0' selected>--Select Reporting Officer--</option>");	
	$('#team_id').html("<option value='0' selected>--Select Division--</option>");
	$('#title').val(0).trigger('change');
	$('#country_of_birth').val('0').trigger('change');	
	$('#emp_id').val("");
	//<img style='border-radius: 50%;width: 35px;height: 35px;border-radius: 50px;' src='"+image_path+"no_data.png' title='Employee : No employee selected'  alt='Profile not found!!' />
	$('#profile_image,#profile_name').html("");
	$('.upload_click_data_img').html( 'Upload Image');
	employee_table_id = 0;
//	clear_function_personal();
}
//employee create function here
function employee_primary_details_create_function(status){
		if(status == 0 || img_id == 0){
			img_upload_status = saveAttachment();//create attachment function 
		}else{
			img_upload_status = updateAttachment();//update attachment function 
		}
		if(img_upload_status >= 0){
			var project_form_value = getFormValues("#employee_primary_details_form");
			var    csrf_data = project_form_value.csrfmiddlewaretoken;
		    delete project_form_value["csrfmiddlewaretoken"];
		    project_form_value['is_active'] = "True";
		    
		    project_form_value['employee_id'] = emp_auto_ids;
		    project_form_value['date_of_birth'] = DateformatChange(validationFields(project_form_value['date_of_birth']));
		    project_form_value['date_of_joining'] = DateformatChange(validationFields(project_form_value['date_of_joining']));
		    project_form_value['reporting_officer'] = validationFields(project_form_value['reporting_officer']);
		    project_form_value['organization_id'] = validationFields(project_form_value['organization_id']);
		    project_form_value['org_unit_id'] = validationFields(project_form_value['org_unit_id']);
		    project_form_value['gender'] = validationFields(project_form_value['gender']);
		    project_form_value['team_id'] = validationFields(project_form_value['team_id']);
		    project_form_value['country_of_birth'] = validationFields(project_form_value['country_of_birth']);
		    project_form_value['title'] = validationFields(project_form_value['title']); 
		    console.log(project_form_value['reporting_officer'])
		    if(img_upload_status != 0){project_form_value['image_id'] = img_upload_status;}
		    else{project_form_value['image_id'] = ''}
		    project_list = [];
			project_dict = {};
			project_list.push(project_form_value);
			project_dict['input_data'] = project_list;
			//NIAA CODE START
			var cookie_data = getCookie();
			//NIAA CODE END
			if(employee_table_id)
			{
				if(!(employee_table_id==$('#reporting_officer').val()))
				{
					$.ajax({	
				         type  : 'POST',
				         url   : '/hrms_employee_create/',
				         async : false, 
				         data: {
				              'datas': JSON.stringify(project_list),
				              "table_id": employee_table_id,
				              csrfmiddlewaretoken: csrf_data,
				         },
				     }).done( function(json_data) {
				    	 data = JSON.parse(json_data);
					 	 var res_status = data['status'];
					 	var res_id = data['status_id'];
					 	 if(res_status == 'NTE_03') {
					 		//NIAA CODE START
//						 	userupdateinfo({emailid:project_list[0].email, authtoken: cookie_data.niaa_token, userid: cookie_data.niaa_uid, imageurl:'http://'+window.location.hostname+'/media/user_profile/'+img_upload_status+'.jpg'});
					 	//	userupdateinfo({emailid:project_list[0].email, authtoken: cookie_data.niaa_token, userid: cookie_data.niaa_uid, imageurl:'http://'+window.location.hostname+'/media/user_profile/'+img_upload_status+'.jpg'});
					 		//NIAA CODE END
					 		alert_lobibox("success", sysparam_datas_list[res_status]);
					 		button_create(1)
					 		clear_function_primary();
					 		employee_datatable_function();	
					 		$('#hrms_employee_list').val(res_id).trigger('change');
					 	 } else {
					 		alert_lobibox("error",sysparam_datas_list['ERR0040'])
					 	 }
				     });
				}else
				{
					alert_lobibox("info",sysparam_datas_list['NTE_72'])
				}	
		     
			}else
			{
				if(!(emp_matrix_id==$('#reporting_officer').val()))
				{				
					$.ajax({
				         type  : 'POST',
				         url   : '/hrms_employee_create/',
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
				 			//NIAA CODE START
//				 			imageupdateinfo({emailid:project_list[0].email, authtoken: cookie_data.niaa_token, userid: cookie_data.niaa_uid, imageurl:'http://'+window.location.hostname+'/media/user_profile/'+img_upload_status+'.jpg'});
				 			imageupdateinfo({emailid:project_list[0].email, authtoken: cookie_data.niaa_token, userid: cookie_data.niaa_uid, imageurl:'http://'+window.location.hostname+'/media/user_profile/'+img_upload_status+'.jpg'});
				 			//NIAA CODE END
				 			alert_lobibox("success", sysparam_datas_list[res_status]);
				 			location.reload();
				 			button_create(1)
				 			employee_table_id = 0;
				 			clear_function_primary();
				 			employee_datatable_function();
//				 			employee_table_id = res_id;
				 			$('#hrms_employee_list').val(res_id).trigger('change');
				 		}else if(res_status == 'NTE_001') {
				 			alert_lobibox("error","This Employee details already exit. Kindly update it.")		 			
				 		}
				 		else {
				 			alert_lobibox("error","Error in Inserting Details")		 			
				 		}
				     });	
				}else
				{
					alert_lobibox("info",sysparam_datas_list['NTE_72'])
				}	
			}		
		}
	
}
//validation for the empty
function validationFields(val){
	return val=='' || val =='0' || val == undefined ?null:val 
}

//Organization delete function here
function  employee_primary_details_delete_function(){
	
	if(employee_table_id)
	{
		$.ajax({ 
		type  : 'POST', 
		url   : '/hrms_employee_create/',
		async : false,
		data: {
			'delete_id':employee_table_id,
			csrfmiddlewaretoken : $("input[name=csrfmiddlewaretoken]").val()
		}, 
	}).done( function(json_data) {
		data = JSON.parse(json_data); 
		var res_status = data['status'];
		if(res_status == 'NTE_04') { 	 
			alert_lobibox("success", sysparam_datas_list[res_status]);
			button_create(1)
		} else{
			alert_lobibox("error","Error in Deleting Details")
		}
	});
	}else
	{
		alert_lobibox("info",sysparam_datas_list['NTE_66']);
	}
	$('#hrms_employee_list').val(0).trigger('change');  
	employee_datatable_function();
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
	if(employee_table_id != 0){
		var datas =  {
				'emp_id' : employee_table_id,
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
		url   : '/hrms_employee_mobile_number_validation/',
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

jQuery.validator.addMethod('valueNotEquals', function (value) {
    return (value != '0');
}, "");

//$('.select2').select2().change(function(){
////  $(this).valid();
//	$('.errorTxt3').html('');
//	$('.errorTxt4').html('');
//});

$('#gender').change(function(){
	$('.errorTxt30').html('');
});

$('#organization_id').change(function(){
	$('.errorTxt3').html('');
	reporting_officer_drop_down_function($('#organization_id').val());	
	org_unit_drop_down_function($('#organization_id').val())	
	$('#employee_id').val("")
});

$('#org_unit_id').change(function(){
	org_unit_name = $('#org_unit_id option:selected').text().toString();	
	generate_emp_id();	
	role_drop_down_function($('#org_unit_id').val());	
	$('.errorTxt4').html('');	
});

$('#team_id').change(function(){
	$('.errorTxt43').html('');
});

$('#title').change(function(){
	$('.errorTxt41').html('');
});

$('#date_of_birth').change(function(){
	age = calculateAge($('#date_of_birth').val())
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


$.validator.addMethod("alpha", function(value, element) {
    return this.optional(element) || value == value.match(/^[a-zA-Z\s]+$/);
});

$('#employee_primary_details_form').submit(function(e) {
    e.preventDefault();    
}).validate({
   rules: {
	   employee_name: {
		   required: true,
		   maxlength: 50,	
		   alpha: true,
	   },
	   work_mobile: {
		   number:true,
		   required:true,
		   maxlength:10,
		   minlength:10,
		   custom_mobile_number:true,
	   },	  	   
	   organization_id: {
		   required: true,
		   valueNotEquals:true, 
	   },	  
	   org_unit_id: {
		   required: true,
		   valueNotEquals:true, 
	   },	   
	   email: {
		   email: true,
		   maxlength: 100,
	   },	
	   work_phone: {
           phone_number:true,
       },
       gender: {
    	   required: true,
		   valueNotEquals:true, 
       },
       team_id: {
    	   required:true,
		   valueNotEquals:true, 
	   },
	   work_location:{
		   maxlength: 100,
	   },
	   permanent_address:{
		   maxlength: 100,
	   },
	   working_address:{
		   maxlength: 100,
	   },
	   place_of_birth:{
		   maxlength: 50,
	   },
	   title:{
		   required:true,
		   valueNotEquals:true,
	   },
	   date_of_birth:{
		   required: true,
	   },
	   emergency_contact_no: {
		   number:true,
		   required:true,
		   maxlength:10,
		   minlength:5,
	   },
	   middle_name: {
		   maxlength : 50,
		   alpha: true,
	   },
	   last_name: {
		   required: true,
		   maxlength: 50,
		   alpha: true,
	   },
	   country_of_birth:{
		   required: true,
		   valueNotEquals:true,
	   },
	   date_of_joining:{
		   required: true,
	   },
   },
   //For custom messages
   messages: {
	   employee_name: {
           required: "Enter Employee Name",
           maxlength: "Name cannot exceed 50 Characters",
           alpha: "Name cannot have Numbers",
       },       
       work_mobile: {
    	   required: "Enter Mobile Number", 
    	   number: "Mobile Number cannot have Characters",
    	   maxlength: "Mobile Number cannot exceed 8 Digits",
    	   minlength: "Mobile Number cannot lesser than 8 Digits",    	  
    	   custom_mobile_number: "Mobile Number Already Exits",    
	   },	   
	   organization_id: {
		   required: "Select Organization",
		   valueNotEquals: "Select Valid Organization", 
	   },
	   org_unit_id: {
		   required: "Select Organization Unit",
		   valueNotEquals: "Select Valid Organization Unit", 
	   },	 
	   email: {
		   email: "Email is Invalid",
		   maxlength: "Email cannot exceed 100 Characters",
	   },
	   work_phone: {
           phone_number: "Phone Number is Invalid. Ex.111-1234567",
       },
	   pan_no: {
		   minlength: "PAN Number cannot be lesser than 10 Characters",
		   maxlength: "PAN Number cannot exceed 10 Characters",
	   },	  
	   gender: {
		   required: "Select Gender",
		   valueNotEquals: "Select Gender", 
	   },
	   team_id: {
    	   required: "Select Division",
		   valueNotEquals: "Select Valid Division", 
	   },	     
	   work_location: {
		   maxlength: "Location Name cannot exceed 100 Characters",
	   },
	   permanent_address: {
		   maxlength: "Permanent Address cannot exceed 100 Characters",
	   },	   
	   working_address: {
		   maxlength: "Present Address cannot exceed 100 Characters",
	   },   
	   place_of_birth: {
		   maxlength: "Place of Birth cannot exceed 50 Characters",
	   },
	   title: {
		   required: "Select Title",
		   valueNotEquals: "Select Valid Title", 
	   },	  
	   emergency_contact_no: {
		   required: "Enter Emergency Contact Number", 
    	   number: "Contact Number cannot be a Character",
    	   maxlength: "Contact Number cannot exceed 8 Digits",
    	   minlength: "Contact Number cannot lesser than 8 Digits",    
	   },
	   middle_name: {
		   maxlength: "Name cannot exceed 50 Characters",
           alpha: "Name cannot have a Numbers",
	   },
	   last_name: {
		   required: "Enter Last Name",
           maxlength: "Name cannot exceed 50 Characters",
           alpha: "Name cannot have a Numbers",
	   }, 
	   country_of_birth:{
		   required: "Select Country",
		   valueNotEquals:"Select Valid Country",
	   },
	   	   date_of_birth:{
		   required: "Select Date Of Birth",
	   },

	   date_of_joining:{
		   required: "Select Joining Date",
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
function employee_primary_form_validation()
{
	return $('#employee_primary_details_form').valid();
}

function org_unit_drop_down_function(org_id)
{
	$.ajax({
		url : "/hrms_fetch_org_unit_drop_down/",
		type : "POST",
		data : {"org_id":org_id},
		csrfmiddlewaretoken : $("input[name=csrfmiddlewaretoken]").val(),
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		if(data.org_unit_info){
				$("#org_unit_id").empty();
				$("#org_unit_id").append("<option value='0' selected>--Select Org Unit--</option>");				
				for (var i=0;i<data.org_unit_info.length;i++)
				{
					$("#org_unit_id").append("<option value='"+data.org_unit_info[i].id+"'>"+data.org_unit_info[i].orgunit_name+"</option>");
					$('.errorTxt4').html('');
				}			
		}
	});
}

function role_drop_down_function(org_unit_id){
	$.ajax({
		url : "/hrms_fetch_role_drop_down/",
		type : "POST",
		data : {"org_unit_id":org_unit_id},
		csrfmiddlewaretoken : $("input[name=csrfmiddlewaretoken]").val(),
		timeout : 10000,
		async:false, 
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		if(data.role_info){				
				$("#team_id,#employee_role_details").empty();
				$("#employee_role_details").append("<option value='0' selected>--Select Position--</option>");
				for (var i=0;i<data.role_info.length;i++)
				{
					$('#employee_role_details').append("<option value='"+data.role_info[i].id+"'>"+data.role_info[i].role_title+"</option>");
					$('.errorTxt29').html('')					
				}
				$("#team_id").append("<option value='0' selected>--Select Division--</option>");
				for (var i=0;i<data.team_info.length;i++)
				{				
					$("#team_id").append("<option value='"+data.team_info[i].id+"'>"+data.team_info[i].name+"</option>");
				}
		}
	});
}


function reporting_officer_drop_down_function(org_id)
{
	$.ajax({
		url : "/hrms_fetch_reporting_officer_drop_down/",
		type : "POST",
		data : {"org_id":org_id,"employee_id":employee_table_id},
		csrfmiddlewaretoken : $("input[name=csrfmiddlewaretoken]").val(),
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		if(data.reporting_officer_info){
				$("#reporting_officer").empty();
				$("#reporting_officer").append("<option value='0' selected>--Select Reporting Officer--</option>");
				for (var i=0;i<data.reporting_officer_info.length;i++)
				{				
					$("#reporting_officer").append("<option value='"+data.reporting_officer_info[i].id+"'>"+data.reporting_officer_info[i].name+"</option>");
				}
		}
	});
}

//button create function here
function button_create(status){
	var access_for_create = jQuery.inArray( "Employee Details", JSON.parse(localStorage.Create) );
	var access_for_write = jQuery.inArray( "Employee Details", JSON.parse(localStorage.Write) );
	var access_for_delete = jQuery.inArray( "Employee Details", JSON.parse(localStorage.Delete) );
	var strAppend = '';
	if(status == 1){
		if (access_for_create != -1){
			strAppend = "<button type='button' onclick='employee_primary_create_button()' class='employee_inactive_stage_button btn btn-success btn-animate btn-eql-wid'>Add</button>"
			strAppend += " <button type='button' onclick='clear_primary_info()' class='employee_inactive_stage_button btn btn-warning btn-animate btn-eql-wid'>Cancel / Clear</button>"
		}
			$('#hrms_employee_btn').html(strAppend);
	}else{
		if (access_for_write != -1){
			strAppend = "<button type='button' onclick='employee_primary_edit_button()' class=' btn-primary btn-animate btn-eql-wid  btn'>Update</button>"
		}if (access_for_delete != -1){
			strAppend += " <button type='button' onclick='employee_primary_delete_button()' class='employee_inactive_stage_button btn-animate btn-eql-wid  btn btn-danger'>Remove</button>"
			strAppend += " <button type='button' onclick='clear_primary_info()' class='employee_inactive_stage_button btn-warning btn-animate btn-eql-wid  btn'>Cancel / Clear</button>"
		}
		$('#hrms_employee_btn').html(strAppend);
	}
	if (hrcurrent_status != true){
		$('.employee_inactive_stage_button').hide();
	}
}

//-------------------Attachment upload 23-02-2018 function start-----------------------//
//image validation
function validate() {
		var ext = $('input[type=file]').val().replace(/C:\\fakepath\\/i, '').split('.')[1].toLowerCase();
	    if($.inArray(ext, ['png','jpg','jpeg']) == -1) {
	    	alert_lobibox("error", "Invalid image extension. Please upload a image in .jpg, .jpeg or .png");
	        return false
	    }else{
	    	return true
	    }
}

var image_data = {}
//image encode function here
function encodeImagetoBase64(element) {
	if(element){
        var FileSize = element.files[0].size / 1024 / 1024; // in MB
        if (FileSize > 1) {
            alert_lobibox("error", "Image size exceeds 1 MB. Please upload a valid image.");
           // $(file).val(''); //for clearing with Jquery
        } else {
        	if(validate()){
        		if($('input[type=file]').val().replace(/C:\\fakepath\\/i, '')){
        			image_data = {}
        			image_data['img_name'] = $('input[type=file]').val().replace(/C:\\fakepath\\/i, '')
        			image_data['folder_name'] = 'user_profile'	
        			var file = element.files[0];
        			var reader = new FileReader();
        			reader.onloadend = function() {
        				var img_str = reader.result
        				image_data['img_str'] = img_str.split(',')[1]
        				image_data['format'] = $('input[type=file]').val().replace(/C:\\fakepath\\/i, '').split('.')[1];
        			}
        			reader.readAsDataURL(file);
        		}
        	}else{
        		image_data = {};
        		$('.fileinput-exists').trigger('click'); 
        	}
        }
	}else{
		alert_lobibox("info", "Image upload error.");
	}
}
//attachment save in server
function saveAttachment(){
	val = 0;
	if(image_data['img_str']){
		$.ajax({
			url : "/hrms_attachment/",
			type : "POST",
			data : image_data,
			timeout : 10000,
			async:false,
		}).done( function(json_data) {
			data = JSON.parse(json_data);
			if(data['id'] != 0){
				val = data['id'];
				val_status = 1;
				image_data = {}
			}else{
				alert_lobibox("error",sysparam_datas_list['ERR0041']);
				val = 0;
			}
		});
	}else{
		val = 0;
	}
	return val
}
//attachment update in server
function updateAttachment(){
	val = img_id;
	if(image_data['img_str'] && img_id != 0){
		image_data['attachment_id'] = img_id;
		$.ajax({
			url : "/hrms_attachment/",
			type : "POST",
			data : image_data,
			timeout : 10000,
			async:false,
		}).done( function(json_data) {
			data = JSON.parse(json_data);
			if(data['id'] != 0){
				image_data = {}
				val == data['id'];
//			    $('.fileinput-preview').html("<img src='/static/ui/images/avatar.png' alt='Imgae' />").trigger('click');
			}else{
				alert_lobibox("error", sysparam_datas_list['ERR0041']);
				val = img_id;
			}
		});
	}else{
		val = img_id;
	}
	return val
}

//-------------------Attachment upload function end-----------------------//


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
$('#employee_name,#last_name,#emp_file_no,#emp_sys_no').keyup(function(){
    $(this).val($(this).val().toUpperCase());
});


/*TRU|12-OCT-18||Add Mobile Number Start*/
//modal show function
function addExtraMobileNumber(){
	if(employee_table_id != 0){
		document.getElementById('employee_emergency_contact_form').reset()
		let contact_number_map = getMoreDetailsMap(employee_table_id,'emergency');
		if(contact_number_map.length > 0) {
			$('#emp_emer_name1').val(contact_number_map[0].emer_name1);
			$('#emp_emer_name2').val(contact_number_map[0].emer_name2);
			$('#emp_emer_name3').val(contact_number_map[0].emer_name3);
			$('#emp_emer_no1').val(contact_number_map[0].emer_contact1);
			$('#emp_emer_no2').val(contact_number_map[0].emer_contact2);
			$('#emp_emer_no3').val(contact_number_map[0].emer_contact3);
		}
		$('#employeeEmergencyNo').modal('show');
	}else{
		alert_lobibox("info",'Please Select Employee');
	}
}

//get More Details Map 
function getMoreDetailsMap(emp_id,status){
	let data
	$.ajax({	
		type  : 'GET',
		url   : '/emp_get_more_details/',
		async : false,
		data: { "emp_id": emp_id,'status':status },
	}).done( function(json_data) {
		let res_data = JSON.parse(json_data);
		data = res_data.datas;
	});
	return data;
}

//add more contact number 
function addMoreContanctNumbers(){
	let validation_status = emp_emer_form_validation();
	if(validation_status){
		let emer_form_value = {};
		emer_form_value['emp_emer_name1'] = $('#emp_emer_name1').val() != '' ? $('#emp_emer_name1').val() : '';
		emer_form_value['emp_emer_name2'] = $('#emp_emer_name2').val() != '' ? $('#emp_emer_name2').val() : '';
		emer_form_value['emp_emer_name3'] = $('#emp_emer_name3').val() != '' ? $('#emp_emer_name3').val() : '';
		emer_form_value['emer_contact1'] = $('#emp_emer_no1').val() != '' ? $('#emp_emer_no1').val() : '';
		emer_form_value['emer_contact2'] = $('#emp_emer_no2').val() != '' ? $('#emp_emer_no2').val() : '';
		emer_form_value['emer_contact3'] = $('#emp_emer_no3').val() != '' ? $('#emp_emer_no3').val() : '';
		emer_form_value['emp_id'] = employee_table_id;
		emer_form_value['status'] = 'emergency';
	    let add_more_contact_status = processMoreContactNum(emer_form_value);//more contact numbers
	}else{
		return false;
	}
}

//add more contact numbers
function processMoreContactNum(datas){
	let project_form_value = getFormValues("#employee_emergency_contact_form");
	let csrf_data = project_form_value.csrfmiddlewaretoken;
	datas['csrfmiddlewaretoken'] = csrf_data;
	$.ajax({	
		type  : 'POST',
		url   : '/employee_process_details/',
		async : false,
		data: datas,
	}).done( function(json_data) {
		let res_data = JSON.parse(json_data);
		let data = res_data.datas;
		if(data['status'] == 'NTE02') {	
			alert_lobibox("success",'Added Successfully');
		}else if(data['status'] == 'NTE03'){
			alert_lobibox("success",'Updated Successfully');
		}else{
			alert_lobibox("error",'Process Faild');
		} 
	});
}

$('#employee_emergency_contact_form').submit(function(e) {
    e.preventDefault();    
}).validate({
   rules: {
	   emp_emer_name1: {
		   maxlength: 50,	
		   alpha: true,
	   },
	   emp_emer_mobile1: {
		   number:true,
		   maxlength:10,
		   minlength:10,
		   custom_mobile_number:true,
	   },
	   emp_emer_name2: {
		   maxlength: 50,	
		   alpha: true,
	   },
	   emp_emer_mobile2: {
		   number:true,
		   maxlength:10,
		   minlength:10,
		   custom_mobile_number:true,
	   },
	   emp_emer_name3: {
		   maxlength: 50,	
		   alpha: true,
	   },
	   emp_emer_mobile3: {
		   number:true,
		   maxlength:10,
		   minlength:10,
		   custom_mobile_number:true,
	   }
   },
   //For custom messages
   messages: {
	   emp_emer_name1: {
           maxlength: "Name cannot exceed 50 Characters",
           minlength: "Name cannot exceed 5 Characters",
           alpha: "Name cannot have Numbers",
       },       
       emp_emer_no1: {
    	   number: "Mobile Number cannot have Characters",
    	   maxlength: "Mobile Number cannot exceed 10 Digits",
    	   minlength: "Mobile Number cannot lesser than 10 Digits",    	  
    	   custom_mobile_number: "Mobile Number Already Exits",    
	   },
	   emp_emer_name2: {
           maxlength: "Name cannot exceed 50 Characters",
           minlength: "Name cannot exceed 5 Characters",
           alpha: "Name cannot have Numbers",
       },       
       emp_emer_no2: {
    	   number: "Mobile Number cannot have Characters",
    	   maxlength: "Mobile Number cannot exceed 10 Digits",
    	   minlength: "Mobile Number cannot lesser than 10 Digits",    	  
    	   custom_mobile_number: "Mobile Number Already Exits",    
	   },
	   emp_emer_name3: {
           maxlength: "Name cannot exceed 50 Characters",
           minlength: "Name cannot exceed 5 Characters",
           alpha: "Name cannot have Numbers",
       },       
       emp_emer_no3: {
    	   number: "Mobile Number cannot have Characters",
    	   maxlength: "Mobile Number cannot exceed 10 Digits",
    	   minlength: "Mobile Number cannot lesser than 10 Digits",    	  
    	   custom_mobile_number: "Mobile Number Already Exits",    
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

//Employee primary form validations here
function emp_emer_form_validation()
{
	return $('#employee_emergency_contact_form').valid();
}

/*TRU|12-OCT-18||Add Mobile Number End*/
/*TRU|13-OCT-18||Add Email Start*/
//modal show function
function addExtraEmailIds(){
	if(employee_table_id != 0){
		document.getElementById('employee_email_ids_form').reset()
		let email_id_map = getMoreDetailsMap(employee_table_id,'email');
		if(email_id_map.length > 0) {
			$('#emp_add_email_name1').val(email_id_map[0].emp_add_email_name1);
			$('#emp_add_email_name2').val(email_id_map[0].emp_add_email_name2);
			$('#emp_add_email_name3').val(email_id_map[0].emp_add_email_name3);
			$('#emp_add_email_id1').val(email_id_map[0].emp_add_email_id1);
			$('#emp_add_email_id2').val(email_id_map[0].emp_add_email_id2);
			$('#emp_add_email_id3').val(email_id_map[0].emp_add_email_id3);
		}
		$('#employeeEmailId').modal('show');
	}else{
		alert_lobibox("info",'Please Select Employee');
	}
}

//add more email number 
function addMoreEmailIds(){
	let validation_status = emp_add_email_form_validation();
	if(validation_status){
		let emer_form_value = {};
		emer_form_value['emp_add_email_name1'] = $('#emp_add_email_name1').val() != '' ? $('#emp_add_email_name1').val() : '';
		emer_form_value['emp_add_email_name2'] = $('#emp_add_email_name2').val() != '' ? $('#emp_add_email_name2').val() : '';
		emer_form_value['emp_add_email_name3'] = $('#emp_add_email_name3').val() != '' ? $('#emp_add_email_name3').val() : '';
		emer_form_value['emp_add_email_id1'] = $('#emp_add_email_id1').val() != '' ? $('#emp_add_email_id1').val() : '';
		emer_form_value['emp_add_email_id2'] = $('#emp_add_email_id2').val() != '' ? $('#emp_add_email_id2').val() : '';
		emer_form_value['emp_add_email_id3'] = $('#emp_add_email_id3').val() != '' ? $('#emp_add_email_id3').val() : '';
		emer_form_value['emp_id'] = employee_table_id;
		emer_form_value['status'] = 'email';
	    let add_more_contact_status = processMoreContactNum(emer_form_value);//more contact numbers
	}else{
		return false;
	}
}

$('#employee_email_ids_form').submit(function(e) {
  e.preventDefault();    
}).validate({
	rules: {
		emp_add_email_name1: {
			maxlength: 50,	
			minlength: 5,
			alpha: true,
		},
		emp_add_email_id1: {
			maxlength: 100,
			email: true,
		},
		emp_add_email_name2: {
			maxlength: 50,	
			minlength: 5,
			alpha: true,
		},
		emp_add_email_id2: {
			maxlength: 100,
			email: true,
		},
		emp_add_email_name3: {
			maxlength: 50,	
			minlength: 5,
			alpha: true,
		},
		emp_add_email_id3: {
			maxlength: 100,
			email: true,
		}
	},
 //For custom messages
 messages: {
	 emp_add_email_name1: {
		 maxlength: "Name cannot exceed 50 Characters",
		 minlength: "Name cannot exceed 5 Characters",
		 alpha: "Name cannot have Numbers",
	 },       
	 emp_add_email_id1: {
		 maxlength: "Name cannot exceed 100 Characters",
		 email: "Email is Invalid",
	 },
	 emp_add_email_name2: {
		 maxlength: "Name cannot exceed 50 Characters",
		 minlength: "Name cannot exceed 5 Characters",
		 alpha: "Name cannot have Numbers",
	 },       
	 emp_add_email_id2: {
		 maxlength: "Name cannot exceed 100 Characters",
		 email: "Email is Invalid",    
	 },
	 emp_add_email_name3: {
		 maxlength: "Name cannot exceed 100 Characters",
		 email: "Email is Invalid",
	 },       
	 emp_add_email_id3: {
		 number: "Mobile Number cannot have Characters",
		 maxlength: "Mobile Number cannot exceed 10 Digits",
		 minlength: "Mobile Number cannot lesser than 10 Digits",    	  
		 custom_mobile_number: "Mobile Number Already Exits",    
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

//Employee primary form validations here
function emp_add_email_form_validation()
{
	return $('#employee_email_ids_form').valid();
}

/*TRU|13-OCT-18||Add Mobile Number End*/
