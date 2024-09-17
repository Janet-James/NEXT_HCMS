var img_id = 0;
var org_btn_status = 0;
var project_form_value = getFormValues("#organization_details_form");
var csrf_data = project_form_value.csrfmiddlewaretoken;
$( document ).ready(function() {
	$('.upload_click_data_img').html( 'Upload Image');
	$('[data-toggle="tooltip"]').tooltip();   
	$('#org_em_add_form_div').hide();
	button_create(1);
	var organization_table_id=''
	organization_datatable_function();
	$(".select2-selection").on("focus", function () {
        $(this).parent().parent().prev().select2("open");
    });	
});

//18-May-2018 || SAR || Toggle Button Function
$('.btn-toggle').click(function() {
    $(this).find('.btn').toggleClass('active');  
    if ($(this).find('.btn-info').length>0) {
    	$(this).find('.btn').toggleClass('btn-info');
    }
    $(this).find('.btn').toggleClass('btn-default');
});

//18-May-2018 || SAR || Add Exit Details Button Function
$("#org_em_add_btn").click(function(){
	org_btn_status = 1;
	clearConformationEvent()
	$('#org_em_main_div > .col-md-12').addClass('col-md-4').removeClass('col-md-12');
	$('#org_em_add_form_div').addClass('col-md-8').removeClass('col-md-3');
	$('#org_em_list_div .col-lg-3').addClass('col-lg-3_re').removeClass('col-lg-3');
	$('#org_em_list_div .col-lg-3_re').addClass('col-md-12').removeClass('col-md-6');
	$('#search_btn').addClass('col-md-12').removeClass('col-md-2');
	$('.dynamic_div_form').addClass('col-md-12').removeClass('col-md-3 col-xl-3 col-lg-4');
	$('.profileCard').addClass('employeeList-height')
	$('#org_em_add_form_div').show();
	$('#org_em_add_btn').hide();
	$('#organization_country').val('0').trigger('change');
	form_status = 0;
});

//21-June-2018 || TRU || Add Exit Details Close Button Function
$("#org_em_form_close").click(function(){
	if(form_status == 1){
		orgCloseFuncton('closeViewOrganization');
	}else{
		closeViewOrganization()
	}
});

//close view organization function here
function closeViewOrganization(){
	form_status = 0;
	$('#org_em_main_div > .col-md-4').addClass('col-md-12').removeClass('col-md-3');
	$('#org_em_list_div .col-lg-3_re').addClass('col-md-4').removeClass('col-md-12');
	$('#search_btn').addClass('col-md-2').removeClass('col-md-12');
	$('.dynamic_div_form').addClass('col-md-3 col-xl-3 col-lg-4').removeClass('col-md-12');
	$('.profileCard').removeClass('employeeList-height')
	$('#org_em_add_form_div').hide();
	$('#org_em_add_btn').show();
	$('.employeeList').removeClass('profileCardAcitve');
}

//dynamic form function here
function dynamicDivform(data){
	if(data.length>0){
		strAppend = '';
		for(var i=0; i<data.length; i++){
			let image_name = data[i][10];
			var d = new Date(); 
			if(org_btn_status == 0){
				strAppend += '<div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 dynamic_div_form row-eq-height" style="cursor:pointer;" onclick="org_event_data('+data[i][0]+')">';
				strAppend += '<div class="row panel-body profileCard equhight employeeList" id="'+data[i][0]+'">';
			}else{
				strAppend += '<div class="col-md-12 col-sm-12 dynamic_div_form row-eq-height" style="cursor:pointer;" onclick="org_event_data('+data[i][0]+')">';
				strAppend += '<div class="row panel-body profileCard equhight employeeList employeeList-height" id="'+data[i][0]+'">';
			}
			strAppend += '<div class="org_leftpart"><img class="img-org img-inline pic_ina" style="border-radius: 50% !important;" src="'+logo_path+data[i][10]+'?ver='+d.getTime()+'"  width="75px" height="75px"></div>';
			strAppend += '<div class="org_rightpart"><div class="con_ina">';
			strAppend += '<h5 class="dev_card" data-toggle="tooltip" data-placement="bottom" title="'+data[i][2]+'">'+data[i][2]+'</h5>';
			strAppend += '<p class="dev_card" data-toggle="tooltip" data-placement="bottom" title="'+data[i][4]+'"><b>Email</b> : '+data[i][4]+'</p>';
			strAppend += '<p class="dev_card" data-toggle="tooltip" data-placement="bottom" title="'+data[i][7]+'""><b>Country</b> : '+data[i][7]+'</p>';
			strAppend += '</div>';
			strAppend += '</div>';
			strAppend += '</div>';
			strAppend += '</div>'; 
		}
		$('#org_em_list_div').html(strAppend);
		$('[data-toggle="tooltip"]').tooltip();  
	}
	else{
		$('#org_em_list_div').html('<div class="col-md-12"><h3 style="text-align: center;color:#e73d4a;">No data available.</h3></div>');
	}
}

//search employee name based on employee list
var elem = document.getElementById('org_name_search');
if(elem){
	elem.addEventListener('keydown', function(e){
		  //if (e.keyCode == 13) {
			  var org_name =  $('#org_name_search').val() 
			  if(!org_name=='')
			  {
				  orgSearchList(org_name); 
			  }else{
				  orgSearchList('');		 
			  }		 
		//  }
		});	
}

//fetch the Employee datas
function orgSearchList(name){

	$.ajax({
		url : "/hrms_org_search_list_data/",
		type : "GET",
		data : {'org_name':name},
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		dynamicDivform(data.results);
	});
}

//organization country function here
$('#organization_country').change(function() {	
	country = $('#organization_country').val();
	load_province_from_country(country);
})	

//load province function here
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
				$("#organization_state").empty();
				$("#organization_state").append("<option value='0' selected>--Select State--</option>");
				for (var i=0;i<data.length;i++)
				{			
					$("#organization_state").append("<option value='"+data[i].id+"'>"+data[i].state_name+"</option>");					
				}
		}
	});
}

//button create function here
function button_create(status){
	var access_for_create = jQuery.inArray( "Organization", JSON.parse(localStorage.Create) );
	var access_for_write = jQuery.inArray( "Organization", JSON.parse(localStorage.Write) );
	var access_for_delete = jQuery.inArray( "Organization", JSON.parse(localStorage.Delete) );
	var strAppend = '';
	if(status == 1){
		if (access_for_create != -1){
			strAppend = "<button type='button' onclick='organization_create_button()' class='btn btn-success btn-eql-wid btn-animate'>Add</button>"
		}
		strAppend += " <button type='button' onclick='org_clear_btn_refresh()' class='btn btn-warning btn-animate btn-eql-wid btn-animate'>Cancel / Clear</button>"
			$('#hrms_organization_btn').html(strAppend);
	}else{
		if (access_for_write != -1){
			strAppend = "<button type='button' onclick='organization_edit_button()' class='btn btn-primary btn-eql-wid btn-animate '>Update</button>"
		}
		if (access_for_delete != -1){
			strAppend += " <button type='button' onclick='organization_delete_button()' class='btn btn-danger btn-eql-wid btn-animate '>Remove</button>"
		}
		strAppend += " <button type='button' onclick='org_clear_btn_refresh()' class='btn btn-warning btn-animate btn-eql-wid btn-animate'>Cancel / Clear</button>"
			$('#hrms_organization_btn').html(strAppend);
	}
}

// Organization create function here 
function organization_create_button() {
	if(organization_form_validation())
	{
		organization_create_function(0);
	}
}

//Organization edit function here 
function organization_edit_button() {
	if(organization_form_validation())
	{
		organization_create_function(organization_update_id);
	}
}

//Organization delete function here 
function organization_delete_button() {
	var title = $('#organization_name').val();
	removeConfirmation('orgDelete',organization_update_id,title);
}

//Organization cancel function here 
function organization_cancel_button() {
	$('#organization_details_form').trigger("reset");
	$('#organization_country').val('0').trigger('change');
	$('.thumbnail').html("");
	$('.employeeList').removeClass('profileCardAcitve');
	form_status = 0;
}

//cancel clear function call button
function org_clear_btn_refresh(){
	if(organization_update_id != '' ){
		var title = $('#organization_name').val();
		orgClearFuncton('clearConformationEvent','',title);
	}else{
		clearConformationEvent();
	}
}

//clear conformation
function clearConformationEvent(){
	organization_update_id = '';
	$('#organization_country').val('0').trigger('change');
	button_create(1);
	$('#organization_details_form')[0].reset();
	$('.thumbnail').html("");
	$('.upload_click_data_img').html( 'Upload Image');
	form_status = 0;
	$('.employeeList').removeClass('profileCardAcitve');
}

//Organization create update function here
function organization_create_function(id){
	if(!isEmail()){
		alert(0)
		$('#organization_email-error').val("Enter valid Email")
		return false
	}
	project_form_value = getFormValues("#organization_details_form");
	delete project_form_value["csrfmiddlewaretoken"];
	if(id == 0 || img_id == 0){
		logo_upload_status = saveAttachment();//create attachment function 
	}else{
		logo_upload_status = updateAttachment();//update attachment function 
	}
	if(logo_upload_status != 0){
		project_form_value['logo_id'] = logo_upload_status;
	}else{
		project_form_value['logo_id'] = '';
	}
	project_form_value['is_active'] = "True";
	project_form_value['organization_fax'] = $('#organization_fax').val();
	project_form_value['organization_address1'] = $('#organization_address1').val();
	project_form_value['organization_address2'] = $('#organization_address2').val();
	project_form_value['organization_website'] = $('#organization_website').val();
	project_form_value['organization_state'] = $('#organization_state').val();
	project_form_value['organization_country'] = validationFields_org(project_form_value['organization_country']);
	project_list = [];
	project_dict = {};
	project_list.push(project_form_value);
	project_dict['input_data'] = project_list;
	if(id)
	{
		$.ajax({
			type  : 'POST',
			url   : '/hrms_organization_create/',
			async : false,
			data: {
				'datas': JSON.stringify(project_list),
				"table_id":organization_update_id,
				csrfmiddlewaretoken: csrf_data
			},
		}).done( function(json_data) {
			data = JSON.parse(json_data);
			var res_status = data['status'];
			if(res_status == 'NTE_03') {	
				alert_lobibox("success", sysparam_datas_list[res_status]);
				img_id = 0;
				button_create(1)
				clearConformationEvent();
				organization_datatable_function();
			}			
			else{
				alert_lobibox("error", sysparam_datas_list[res_status]);
			}
		});

	}else
	{
		$.ajax({
			type  : 'POST',
			url   : '/hrms_organization_create/',
			async : false,
			data: {
				'datas': JSON.stringify(project_list),
				csrfmiddlewaretoken: csrf_data
			},
		}).done( function(json_data) {
			data = JSON.parse(json_data);
			var res_status = data['status'];
			if(res_status == 'NTE_01') {	
				alert_lobibox("success", sysparam_datas_list[res_status]);
				clearConformationEvent();
				organization_datatable_function();
			}else if(res_status == 'ERR0020') {	
				alert_lobibox("warning","Organization name already exists");
			}else if(res_status == 'ERR0032'){
				alert_lobibox("error","Parent Organization Unit Not Created");
			}else{
				alert_lobibox("error", sysparam_datas_list[res_status]);
			}
		});	
	}

}

//delete function here
function orgDelete(delete_id){
	$.ajax({
        type  : 'POST',
        url   : '/hrms_organization_create/',
        async : false,
        data: {
            'delete_id':delete_id,
             csrfmiddlewaretoken : $("input[name=csrfmiddlewaretoken]").val()
        },
    }).done( function(json_data) {
        data = JSON.parse(json_data);
		var res_status = data['status'];
		if(res_status == 'NTE_04') { 
			alert_lobibox("success", sysparam_datas_list[res_status]);
			img_id = 0;
			organization_datatable_function();
			clearConformationEvent();
			button_create(1);
		}else{
			alert_lobibox("error", sysparam_datas_list[res_status]);
		} 
		
    });
}

//validation for the empty
function validationFields_org(val){
	return val=='' || val =='0' ?null:val 
}

//Organization data table function here
function organization_datatable_function()
{
	columns = [{'title':'ID'},{'title':'No.'},{'title':'Name'},{'title':'Telephone Number'},{'title':'Email'},{'title':'Fax'},{'title':'Address'},{'title':'Country'}]
	$.ajax(
			{
				url : '/hrms_organization_table/',
				type : 'POST',
				timeout : 10000,
				data:{csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()},
				async:false,
			}).done(
					function(json_data)
					{
						var data = JSON.parse(json_data)
						dynamicDivform(data.results)
					});
	return false
}


//jquery attendance validation
jQuery.validator.addMethod('valueNotEquals', function (value) {
    return (value != '0');
}, "country required");

//Adding validator method for fax number
jQuery.validator.addMethod("fax_number", function(value, element) {
	  // allow any non-whitespace characters as the host part
	  return this.optional( element ) || /^[0-9-+]+$/.test( value );
	  
}, 'Enter a valid fax number.');


//Adding validator method for fax number
jQuery.validator.addMethod("website", function(value, element) {
	  var val = this.optional( element ) || /^(http|https):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i.test( value )
	  var val1 = this.optional( element ) || /^(www\.)[A-Za-z0-9_-]+\.+[A-Za-z0-9.\/%&=\?_:;-]+$/.test(value)
	  
	  if(val1)
	  {
		  return true
	  }else if(val)
	  {
		  return true
	  }else
	  {
		  return false
	  }	 	  
}, '');


//Adding validator method for fax number
jQuery.validator.addMethod("caps", function(value, element) {
	  // allow any non-whitespace characters as the host part
	  return this.optional( element ) || /^[A-Z ]{5,100}$/.test( value );	  
}, '');

jQuery.validator.addMethod("telephone_number", function(value, element) {
    // allow any non-whitespace characters as the host part
	return this.optional( element ) || /^\d{3}([-])\d{7}$/.test( value );     
}, '');

$.validator.addMethod("alpha", function(value, element) {
    return this.optional(element) || value == value.match(/^[a-zA-Z\s]+$/);
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

$('.select2').select2().change(function(){
//    $(this).valid();
	$('.errorTxts').html('');
});

jQuery.validator.addMethod("alphanumeric", function(value, element) {
    return this.optional(element) || /^[\w.]+$/i.test(value);
}, "");

jQuery.validator.addMethod("ipa_number", function(value, element) {
    // allow any non-whitespace characters as the host part
    return this.optional( element ) || /^\d{1}([-])\s*[a-zA-Z0-9\s]{5}$/.test( value );      
}, '');

//organization details form validation function here
$('#organization_details_form').submit(function(e) {
    e.preventDefault();    
}).validate({
   rules: {
	   organization_name: {
		   required: true,
		   maxlength: 100,
		   minlength: 5,
		   caps: true,
	   },
	   organization_telephone_number: {
		   required: true,
		   //telephone_number: true,
		   maxlength: 10,
		   minlength: 10,
	   },
	   organization_email:
	   {
		   required:true,
		   email:true
	   },	  
	   organization_country:
	   {
		   required: true,
           valueNotEquals:true,  
	   },	   
	   organization_address1:
	   {
		   required: true,
		   maxlength: 250,
	   },	   
	   organization_address2:
	   {
		   maxlength: 250,
	   },    		
	   organization_mobile_number:
	   {
		   number : true,
		   maxlength:10,
		   minlength:10,
	   },	   
	   organization_fax:
	   {
		   fax_number:true,
		   maxlength: 10,
		   minlength: 10,	   
	   },
	   organization_website:
	   {
		   website: true,
	   },	  
	   organization_branches:
	   {
		   number: true,		  
	   },	   
	   organization_legal_name:
	   {
		   maxlength: 50,
	   },
	   corporate_identity_number:
	   {
		  // ipa_number: true,
		   maxlength: 21,
		   minlength: 21,
	   },
	   organization_pin_code:
	   {
		   required: true,
		   number: true,
		   maxlength: 6,
		   minlength: 6,
	   },
	   organization_state:
	   {
		   required: true,
		   valueNotEquals:true,  
	   },
   },
   //For custom messages
   messages: {
	   organization_name: {
           required: "Enter Organization Name",
           maxlength: "Organization Name exceed 40 Characters",
		   minlength: "Organization Name should be 5 Characters",	
           caps: "Organization Name should be in Capital Letters",                 
       },
       organization_telephone_number: {
    	   required: "Enter Telephone Number",
    	   //telephone_number: "Telephone Number is Invalid.  Ex.111-1234567",
    	   maxlength: "Telephone Number cannot exceed 10 Digits",
    	   minlength: "Telephone Number cannot lesser than 10 Digits",
       },      
       organization_email:
	   {
    	   required: "Enter Organization Email",
    	   email: "Enter Valid Email",
	   },	   
	   organization_country:
	   {
		   required: "Select Country",
           valueNotEquals: "Select Valid Country",
	   },	
	   organization_address1:
	   {
		   required: "Enter Registered Address",
		   maxlength : "Address cannot exceed 250 Characters",	
	   },
	   organization_address2:
	   {
		   maxlength: "Address cannot exceed 250 Characters",	
	   },
	   organization_mobile_number:
	   {
		   number : "Mobile Number cannot have Characters",
    	   maxlength: "Mobile Number cannot exceed 10 Digits",
    	   minlength: "Mobile Number cannot lesser than 10 Digits",
	   },	 
	   organization_fax:
	   {
		   fax_number: "Enter Valid Fax Number",
		   maxlength: "Fax Number cannot exceed 10 Characters",
		   minlength: "Fax Number cannot be lesser than 10 Characters",	   
	   },	
	   organization_website:
	   {
		   website: "Enter Valid Website Address",
	   },
	   organization_branches:
	   {
		   number: "Organization Branches should be in Number",
	   },	  
	   organization_legal_name:
	   {
		   maxlength: "Legal Name cannot exceed 50 Characters",
	   },
	   corporate_identity_number:
	   {		   
		   //ipa_number: "IPA Number is Invalid. Ex.1-12345 or 1-abcde",
		   maxlength: "Postcode cannot exceed 21 Digits Number",
		   minlength: "Postcode can be 21 Digits Number Must",
	   },
	   organization_pin_code:
	   {
		   required: "Enter Postcode",
		   number: "Postcode should be Number",
		   maxlength: "Postcode cannot exceed 6 Digits Number",
		   minlength: "Postcode can be 6 Digits Number Must",
	   },
	   organization_state:
	   {
		   required: "Select State",
		   valueNotEquals: "Select Valid State",		     
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

//email validation
function isEmail(email) {
  var regex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  return regex.test(email);
}
//Organization form validations here
function organization_form_validation()
{	
	return $('#organization_details_form').valid();
}

//get form values function here
function getFormValues(formId)
{
	var formData= $(formId).serializeArray()
	var form_result_data ={} 
	formData.map(data => {form_result_data[data['name']] =data['value'] })
	return form_result_data
}
	
var organization_update_id="";
//organization event data function here
function org_event_data(company_table_id){
	$('#org_em_add_btn').trigger('click');
	$('.employeeList').removeClass('profileCardAcitve');
	$('#'+company_table_id).addClass('profileCardAcitve');
	button_create(0)
	$.ajax(
			{
				url : '/hrms_organization_table_click/',
				type : 'POST',
				timeout : 10000,
				data:{"table_id":company_table_id,csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()},
				async:false,
			}).done(
					function(json_data)
					{
						organization_update_id = company_table_id;
						var data = JSON.parse(json_data)
												
						$('#organization_name').val(data.results[0].name);
						$('#organization_mobile_number').val(data.results[0].mobile_number);
						$('#organization_telephone_number').val(data.results[0].telephone_number);
						$('#organization_fax').val(data.results[0].fax);
						$('#organization_email').val(data.results[0].email);
						$('#organization_address1').val(data.results[0].address1);
						$('#organization_address2').val(data.results[0].address2);					
						$('#organization_website').val(data.results[0].website);
						$('#organization_legal_name').val(data.results[0].legal_name);
						$('#organization_short_name').val(data.results[0].short_name);
						$('#organization_location').val(data.results[0].location);
						$('#organization_pin_code').val(data.results[0].pincode);
						$('#corporate_identity_number').val(data.results[0].corporate_identity_number);
						
						img_id = data.results[0].logo_id;
						img_name = data.results[0].logo_name;
						$('#organization_country').val(data.results[0].country).trigger('change');
						$('#organization_state').val(data.results[0].state).trigger('change');
						$('.upload_click_data_img').html( 'Change Upload Image');
						var d = new Date(); 
						$('.thumbnail').html('<img src="'+logo_path+img_name+'?ver='+d.getTime()+'" alt="Image" />').trigger('click');								
					});
}

//organization name should be upper case function here
$('#organization_name').keyup(function(){
    $(this).val($(this).val().toUpperCase());
});

//-------------------Attachment upload 14-03-2018 function start-----------------------//
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
			}}}else{
				alert_lobibox("info", "Image upload error.");
			}
}
//attachment save in server
function saveAttachment(){
	val = 0;
	console.log(image_data)
	if(image_data['img_str']){
		$.ajax({
			url : "/hrms_org_logo_attachment/",
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
				alert_lobibox("error", sysparam_datas_list['ERR0041']);
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
	console.log(image_data)
	if(image_data['img_str'] && img_id != 0){
		image_data['attachment_id'] = img_id;
		$.ajax({
			url : "/hrms_org_logo_attachment/",
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


