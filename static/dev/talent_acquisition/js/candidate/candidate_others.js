var others_columns = [{'title':'Id'},{'title':'No'},{'title':'Candidate Name'},{'title':'Candidate Status'}];
//ready function here
$( document ).ready(function() {
	 $('#candidate_screening,#offer_release,#candidate_hired,#candidate_interview,#candidate_source_of_hire,#referral_by').attr("disabled", true);	
	 $('#candidate_other_update_button').hide();	
	 $('#candidate_other_cancel_button').hide();	
	 var candidate_status = '669'		 
});

//Candidate data table function here
function candidateOtherDataTable(){
	$.ajax({
		url : "/ta_candidate_other_data_table/",
		type : "POST",
		timeout : 10000,
		data:{"candidate_id":candidate_table_id,csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()},
		async:false,
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		plaindatatable_btn("candidate_other_details",data.results,others_columns,0);
	});
}

//validation for the empty
function validationFields_org(val){
	return val=='' || val =='0' ?null:val 
}

//data table row click get id
$("#candidate_other_details").on("click", "tr", function() { 
	if (!this.rowIndex) return; // skip first row
	button_create_other(0)
	id = $('#candidate_other_details').dataTable().fnGetData(this)[0];
	candidateOtherTableClick(id);
});

//candidate click event function here
function candidateOtherTableClick(id)
{
	$.ajax(
			{
				url : '/ta_candidate_other_table_click/',
				type : 'POST',
				timeout : 10000,
				data:{"candidate_id":id,csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()},
				async:false,
			}).done(
					function(json_data)
					{
						var data = JSON.parse(json_data)
						// Setting Values
						$('#candidate_status').val(data.results[0].candidate_status).trigger('change')
						$('#candidate_screening').val(data.results[0].screening).trigger('change')
						$('#candidate_interview').val(data.results[0].candidate_interview).trigger('change')
						$('#candidate_hired').val(data.results[0].candidate_hired).trigger('change')
						$('#candidate_source_of_hire').val(data.results[0].source_of_hire).trigger('change')
						$('#offer_release').val(data.results[0].offer_release).trigger('change')
					});
}

//Candidate basic details create function here 
function candidate_other_create_button() {
	if(candidate_other_form_validation())
	{
		candidate_details_other_create_function();
	}
}

//Candidate basic details delete function here 
function candidate_other_delete_button() {
	var title = $('#ta_candidate_list option:selected').text();
	removeConfirmation('candidate_other_details_delete_function','',title);
}

//Candidate other info clear function here
function clear_candidate_other_info() {
	if(candidate_table_id != 0 ){
		var title = $('#ta_candidate_list option:selected').text();
		orgClearFuncton('clear_function_other_candidate','',title);
	}else{
		clear_function_other_candidate();
	}
}

//clear other info  function here
function clear_function_other_candidate()
{ 
	$('.thumbnail').html("");
	$('.errormessage').html("");		
	document.getElementById('candidate_other_details_form').reset()
	$('#candidate_status,#candidate_screening,#candidate_interview,#candidate_hired,#offer_release,#candidate_source_of_hire,#referral_by').val('0').trigger('change');
	$('#candidate_screening,#candidate_interview,#offer_release,#candidate_hired,#candidate_source_of_hire,#candidate_screening,#referral_by').attr("disabled", true);
}

//candidate create function here
function candidate_details_other_create_function()
{		
				var project_form_value = getFormValues("#candidate_other_details_form");
				var    csrf_data = project_form_value.csrfmiddlewaretoken;
			    delete project_form_value["csrfmiddlewaretoken"];
			    project_form_value['is_active'] = "True";		    
			   
			    project_form_value['candidate_screening'] = project_form_value['candidate_screening'] != undefined ? validationFields(project_form_value['candidate_screening'])  :  '';
			    project_form_value['candidate_interview'] = project_form_value['candidate_interview'] != undefined ? validationFields(project_form_value['candidate_interview'])  :  '';
			    project_form_value['offer_release'] = project_form_value['offer_release'] != undefined ? validationFields(project_form_value['offer_release'])  :  '';
			    project_form_value['candidate_hired'] = project_form_value['candidate_hired'] != undefined ? validationFields(project_form_value['candidate_hired'])  :  '';
			    project_form_value['candidate_source_of_hire'] = project_form_value['candidate_source_of_hire'] != undefined ? validationFields(project_form_value['candidate_source_of_hire'])  :  '';
			    project_form_value['referral_by'] = project_form_value['referral_by'] != undefined ? validationFields(project_form_value['referral_by'])  :  '';
			    project_form_value['candidate_status'] = project_form_value['candidate_status'] != undefined ? validationFields(project_form_value['candidate_status'])  :  '';
			    
			    project_list = [];
				project_dict = {};
				project_list.push(project_form_value);
				project_dict['input_data'] = project_list;				
				
				if(candidate_table_id)
				{
						$.ajax({	
					         type  : 'POST',
					         url   : '/ta_candidate_other_create/',
					         async : false,
					         data: {
					              'datas': JSON.stringify(project_list),
					              "candidate_id": candidate_table_id,
					              "job_id": $('#job_opening').val(),
					              csrfmiddlewaretoken: csrf_data,
					         },
					     }).done( function(json_data) {					    	
					    	 data = JSON.parse(json_data);
						 	 var res_status = data['status'];
						 	 var new_emp_id = data['res_emp_id'];	
						 	
						 	 if(res_status == 'NTE_03') {	
						 		alert_lobibox("success", sysparam_datas_list[res_status]);	
						 		drawCandidateList();
						 		var candidate_status = $('#candidate_hired option:selected').text().toString();		
						 		var candidate_name = $('#ta_candidate_list option:selected').text().toString();
						 								 		
						 		if(candidate_status == 'Joined'){
						 			if(new_emp_id == undefined){
						 				candidateConfirmation('changeCandidatetoEmployee','',candidate_name);
						 			}else{
						 				if(new_emp_id != 0){
											localStorage.setItem('emp_id', new_emp_id);
											window.location = "/hrms_employee/";
										}
						 				$('#candidate_emp_status').html("Note : Candidate Moved to Employee")						 				
						 			}						 			
						 	    }
//						 		else if(candidate_status != 'Joined'){
//						 	    	if(new_emp_id != undefined){
//						 				employeeInactivateConfirmation('inactivateEmployeetoCandidate','',candidate_name);
//						 			}
//						 	    }	
						 		clear_function_other_candidate();
						 	    $('#ta_candidate_list').val(candidate_table_id).trigger('change');
						 	} else {
						 		alert_lobibox("error",sysparam_datas_list['ERR0040'])
						 	}
					     });				     
				}
}

//candidate status change function here
$('#candidate_status').change(function(){
	var candidate_status = $('#candidate_status option:selected').text().toString();	
	displayUpdateButton(candidate_status);	
});

//candidate button function here
function displayUpdateButton(status){
	if(status == 'Offer'){
		$("#candidate_status option[value=669]").attr('disabled','disabled');
		$("#candidate_status option[value=672]").removeAttr('disabled');
		$('#candidate_hired,#candidate_source_of_hire').attr("disabled", false);
		$('#candidate_screening').attr("disabled",true);
		$('#candidate_screening,#candidate_hired,#candidate_source_of_hire').val(0).trigger('change')
		showUpdateButton();
	}else if(status == 'Interview'){
		$("#candidate_status option[value=669]").attr('disabled','disabled');	
		$('#candidate_screening,#candidate_hired,#candidate_source_of_hire').attr("disabled",true);
		$('#candidate_screening').val(0).trigger('change')
		hideUpdateButton();
	}else if(status == 'Hired'){
		$('#candidate_status,#candidate_hired,#candidate_source_of_hire').attr("disabled", false);
		$('#candidate_hired,#candidate_source_of_hire').attr("disabled", false);
		showUpdateButton();
    }else if(status == 'Screening'){
    	$('#candidate_screening').attr("disabled",false);	
		$('#candidate_hired,#candidate_source_of_hire').val(0).trigger('change')
		$('#candidate_hired,#candidate_source_of_hire').attr("disabled", true);		
		showUpdateButton();
    }else{
    	$('#candidate_screening,#offer_release,#candidate_hired,#candidate_interview,#candidate_source_of_hire,#referral_by').attr("disabled", true);    	
    }
}

//show update btn function here
function showUpdateButton(){
	$('#candidate_other_update_button').show();
	$('#candidate_other_cancel_button').show();
}

//hide update btn function here
function hideUpdateButton(){
	$('#candidate_other_update_button').hide();
	$('#candidate_other_cancel_button').hide();
}

//source of hire function here
$('#source_of_hire').change(function(){
	var source_of_hire = $('#candidate_source_of_hire option:selected').text().toString();
	if(source_of_hire == 'Employee Referral'){	
		$('#referral_by').attr("disabled", false); 
	}else{
		$('#referral_by').val('0').trigger('change'); 
		$('#referral_by').attr("disabled", true); 
	}
});

//validation for the empty
function validationFields(val){
	return val=='' || val =='0' ?null:val 
}

//Organization delete function here
function candidate_other_details_delete_function(){
	
	if(candidate_table_id)
	{
		$.ajax({
		type  : 'POST',
		url   : '/ta_candidate_other_create/',
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
		} else{
			alert_lobibox("error","Error in Deleting Details")
		}
	});
	}else
	{
		alert_lobibox("info",sysparam_datas_list['NTE_66']);
	}	
}

jQuery.validator.addMethod('valueNotEquals', function (value) {
    return (value != '0');
}, "");

$('.select2').select2().change(function(){
	$('.errormessage').html('');
});

$.validator.addMethod("alpha", function(value, element) {
    return this.optional(element) || value == value.match(/^[a-zA-Z\s]+$/);
});

//candidate other details form validation here
$('#candidate_other_details_form').submit(function(e) {
    e.preventDefault();    
}).validate({
   rules: {
	   candidate_screening: {
		   valueNotEquals:true,
	   },
	   candidate_interview: {
		   valueNotEquals:true, 
       },
       offer_release:{
		   valueNotEquals:true,
	   },
	   candidate_hired:{
		   valueNotEquals:true,
	   },
	   candidate_source_of_hire: {
		   valueNotEquals:true,
	   },	 
	   referral_by:{
		   valueNotEquals:true,
	   }
   },
   //For custom messages
   messages: {
       candidate_screening: {
    	   valueNotEquals: "Select Candidate Screening",    	   
       }, 
       candidate_interview: {
    	   valueNotEquals: "Select Candidate Interview",  
       },	   	  
       offer_release: {
    	   valueNotEquals: "Select Offer Release",  
	   },
	   candidate_hired: {
		   valueNotEquals: "Select Candidate Hired",		 
	   },
	   candidate_source_of_hire: {
		   valueNotEquals: "Select Source of Hire",
       },	
       referral_by:{
    	   valueNotEquals: "Select Referral by Employee",
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

//Candidate candidate form validations here
function candidate_other_form_validation()
{
	return $('#candidate_other_details_form').valid();
}

//button create function here
function button_create_other(status){
	var access_for_create = jQuery.inArray( "Department", JSON.parse(localStorage.Create) );
	var access_for_write = jQuery.inArray( "Department", JSON.parse(localStorage.Write) );
	var access_for_delete = jQuery.inArray( "Department", JSON.parse(localStorage.Delete) );
	var strAppend = '';
	if(status == 1){
		if (access_for_create != -1){
			strAppend = "<button type='button' onclick='candidate_other_create_button()' class='btn btn-success btn-animate btn-eql-wid'>Add</button>"
		}strAppend += " <button type='button' onclick='clear_candidate_other_info()' class='btn btn-warning btn-animate btn-eql-wid'>Cancel / Clear</button>"
			$('#hrms_candidate_other_btn').html(strAppend);
	}else{
		if (access_for_write != -1){
			strAppend = "<button type='button' onclick='candidate_other_edit_button()' class=' btn-primary btn-animate btn-eql-wid  btn'>Update</button>"
		}if (access_for_delete != -1){
			strAppend += " <button type='button' onclick='candidate_other_delete_button()' class='btn-animate btn-eql-wid  btn btn-danger'>Remove</button>"
		}strAppend += " <button type='button' onclick='clear_candidate_other_info()' class='btn-warning btn-animate btn-eql-wid  btn'>Cancel / Clear</button>"
			$('#hrms_candidate_other_btn').html(strAppend);
	}
}


