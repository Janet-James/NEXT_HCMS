var candidate_table_id = 0
var gender_flag = true;
var flag_fresher = true;
var status_change;
var skills_list=[];
var education_list=[];
var experience_list=[];
var certification_list=[];
var skills_list=[];
var offer_status=false;
var edu_columns = [{'title':'Id'},{'title':'No'},{'title':'University Name'},{'title':'Graduated Year'},{'title':'Campus Name'},{'title':'Duration'},
                   {'title':'Grade'},{'title':'Percentage'},{'title':'Course Name'}];

var exp_columns = [{'title':'Id'},{'title':'No'},{'title':'Employer'},{'title':'Designation'},{'title':'Start Date'},{'title':'End Date'},
                   {'title':'Previous Employee ID'},{'title':'Reference'},{'title':'Reason for Relieving'},{'title':'Experience'}];

var certification_columns = [{'title':'Id'},{'title':'No'},{'title':'Name'},{'title':'Certification Number'},{'title':'Issued By'},{'title':'Start Date'},{'title':'End Date'}];

var skills_columns = [{'title':'Id'},{'title':'No'},{'title':'Skill Name'},{'title':'Experience'},{'title':'Rating'},{'title':'Skill Type'},{'title':'skill_type_id'}]

//ready function here
$( document ).ready(function() {
	candidate_drop_down_function();
	candidateListDetails();
	$('.resume_extracts').show();
	$('#candidate_emp_status').hide();
});

//candidate drop down function here
function candidate_drop_down_function(){

	$.ajax({
		url : "/ta_candidate_drop_down/",
		type : "POST",
		csrfmiddlewaretoken : $("input[name=csrfmiddlewaretoken]").val(),
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		if(data.candidate_info){			
				$("#ta_candidate_list").empty();
				$("#ta_candidate_list").append("<option value='0' selected>--Select Candidate--</option>");
				for (var i=0;i<data.candidate_info.length;i++)
				{			
					$("#ta_candidate_list").append("<option value='"+data.candidate_info[i].id+"'>"+data.candidate_info[i].candidate_name+"</option>");					
				}
				candidate_table_id = candidate_table_id != undefined ? candidate_table_id : 0;
		}
	});
}

//candidate list change
$("#ta_candidate_list").change(function() {
	if( $('option:selected', this).val() != 0 ){
		rowClickDataGet( $('option:selected', this).val() );
		$('.resume_extracts').hide();
		$('#candidate_emp_status').show();
	}else{
		clear_function_candidate();
		button_create(1);
		$('.nav-pills a[href="#pills-tab1"]').tab('show');
		$('.resume_extracts').show();
		$('#candidate_emp_status').hide();
	}
});


//row click data get function 
function rowClickDataGet(candidate_id){
	button_create(0);
	candidate_table_id = candidate_id;
	
	$.ajax({
				url : '/ta_change_candidate_info/',
				type : 'POST',
				timeout : 10000,
				data:{"candidate_id":candidate_table_id,csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()},
				async:false,
			}).done(
					function(json_data)
					{
						data = JSON.parse(json_data)	
										
						var edu_data=data.education
						var exp_data=data.experience
						var certification_data=data.certification
						var skills_data=data.skills
												
						gender_flag = true;
						
						var country = data.candidate_res[0].country_id;
						var province = data.candidate_res[0].province_id;
						var gender = data.candidate_res[0].gender_id;
						var job_opening = data.candidate_res[0].job_opening_id;
						var title = data.candidate_res[0].title_id
						
						var candidate_status = data.candidate_res[0].candidate_status
						var screening = data.candidate_res[0].screening
						var candidate_interview = data.candidate_res[0].candidate_interview
						var candidate_hired = data.candidate_res[0].candidate_hired
						var source_of_hire = data.candidate_res[0].source_of_hire
						var offer_release = data.candidate_res[0].offer_release
						var referral_by_id = data.candidate_res[0].referral_by_id
						var employee_id = data.candidate_res[0].employee_id
						var hire_status = data.candidate_res[0].hire_status		
						var experience = data.candidate_res[0].experience
						
											
						$('[data-toggle="tooltip"]').tooltip();   
						//primary info
						$('#first_name').val(data.candidate_res[0].first_name);
						$('#last_name').val(data.candidate_res[0].last_name);						
						$('#candidate_dob').val(data.candidate_res[0].date_of_birth);							
						$('#primary_email').val(data.candidate_res[0].primary_email);
						$('#secondary_email').val(data.candidate_res[0].secondary_email);
						$('#phone_no').val(data.candidate_res[0].phone_no);
						$('#mobile_no').val(data.candidate_res[0].mobile_no);
						$('#languages_known').val(data.candidate_res[0].languages_known)
						$('#street').val(data.candidate_res[0].street);
						$('#postal_code').val(data.candidate_res[0].postal_code);
						$('#city').val(data.candidate_res[0].city);
						$('#candidate_address').val(data.candidate_res[0].address)
						$('#candidate_experience').val(data.candidate_res[0].experience)
						$('#current_job_title').val(data.candidate_res[0].current_job_title)
						$('#current_employer').val(data.candidate_res[0].current_employer)
						$('#current_salary').val(data.candidate_res[0].current_salary)
						$('#expected_salary').val(data.candidate_res[0].expected_salary)
						$('#additional_info').val(data.candidate_res[0].additional_info)
						$('#skype_id').val(data.candidate_res[0].skype_id)
																	
						// Drop down values
						$('#candidate_country').val(country).trigger('change');
						$('#candidate_province').val(province).trigger('change');
						$('#gender').val(gender).trigger('change');
						$('#title').val(title).trigger('change');	
						$('#job_opening').val(job_opening).trigger('change');	
						
						// Candidate Others
						$("#candidate_status option[value='"+candidate_status+"']").removeAttr('disabled');
						$('#candidate_status').val(candidate_status).trigger('change')
						$('#candidate_screening').val(screening).trigger('change')
						$('#candidate_interview').val(candidate_interview).trigger('change')
						$('#candidate_hired').val(candidate_hired).trigger('change')
						$('#candidate_source_of_hire').val(source_of_hire).trigger('change')
						$('#offer_release').val(offer_release).trigger('change')	
						$('#referral_by').val(referral_by_id).trigger('change')
						
						//Employee Education						
						education_list = edu_data;   						
						$('#education_table').show();
						plaindatatable('candidate_education_details',edu_data, edu_columns,0);
						
						experience_list = exp_data;   						
						$('#experience_table').show();
						plaindatatable('candidate_experience_details',exp_data, exp_columns,0); 						
						
						certification_list = certification_data;   						
						$('#certification_table').show();
						plaindatatable('candidate_certification_details',certification_data, certification_columns,0); 						
						
						skills_list = skills_data;   						
						$('#skills_table').show();
						plaindatatable('candidate_skill_details',skills_data, skills_columns,[0,6]); 
						
						dynamicButtonDisplay();
//						checkCandidateOfferStatus();
//						
//						if(offer_status==false){
//							 $('#tab_others').hide();
//							 if(currentTarget == '#pills-tab6'){
//								 $('#candidate_last').hide();
//							 }
//						}else{
//							 $('#tab_others').show();
//							 if(currentTarget == '#pills-tab6'){
//								 $('#candidate_last').show();
//							 }
//						}
						if(hire_status=="Moved to Employee"){
							$('#candidate_emp_status').html("Note : Candidate Moved to Employee")							
						}else if(hire_status=="Inactivated"){
							$('#candidate_emp_status').html("Note : Candidate Inactivated from Employee")
						}else{
							$('#candidate_emp_status').html("Note : Candidate Not Moved to Employee")
						}
						
						if(experience == 0){
							flag_fresher = true
						}else{
							flag_fresher = false
						}							
													
					});
}

//dynamic button display function here
function dynamicButtonDisplay()
{
	$('.edu_update').hide()
	$('.skill_update').hide()
	$('.exp_update').hide()
	$('.certificate_update').hide()
}

//data format change 
function DateformatChange(val){
	if(val)
	{	
		return val.split('-')[2]+'-'+val.split('-')[1]+'-'+val.split('-')[0]
	}else
	{
		return null;
	}	
}

//change candidate to employee function here
function changeCandidatetoEmployee(){	
	if(candidate_table_id){
		$.ajax({
			url : "/ta_change_candidate_to_employee/",
			type : "POST",
			data: {
				'candidate_id':candidate_table_id,
				 csrfmiddlewaretoken : $("input[name=csrfmiddlewaretoken]").val()
			},
			timeout : 10000,
			async:false,
		}).done( function(json_data) {
			data = JSON.parse(json_data);
			var res_status = data['status'];
			var new_emp_id = data['res_emp_id'];			
			if(res_status == 'NTE_01') { 	
				alert_lobibox("success", sysparam_datas_list[res_status]);		
				drawCandidateList();
				//employee page
				if(new_emp_id != 0){
					localStorage.setItem('emp_id', new_emp_id);
					window.location = "/hrms_employee/";
				}
			}else{
				alert_lobibox("error","Error in Converting to Employee")
			}			
		});
	}else{
		alert_lobibox("warning","Candidate not selected")
	}
}

//in active employee function here
function inactivateEmployeetoCandidate(){	
	if(candidate_table_id){
		$.ajax({
			url : "/ta_candidate_inactive_employee/",
			type : "POST",
			data : {
				'candidate_id':candidate_table_id,
				 csrfmiddlewaretoken : $("input[name=csrfmiddlewaretoken]").val()
			},
			timeout : 10000,
			async:false,
		}).done( function(json_data) {
			data = JSON.parse(json_data);
			var res_status = data['status'];
			var new_emp_id = data['res_emp_id'];	
			if(res_status == 'NTE_01') { 	
				alert_lobibox("success", "Candidate Inactivated from Employee");	
				drawCandidateList();
				$('#candidate_emp_status').html("(Note : Candidate Inactivated from Employee)")
			}else{
				alert_lobibox("error","Error in Converting to Employee")
			}			
		});
	}else{
		alert_lobibox("warning","Candidate not selected")
	}
}


//function checkCandidateOfferStatus(){
//	offer_status = false;
//	if(candidate_table_id){
//		$.ajax({
//			url : "/ta_candidate_check_offer_status/",
//			type : "POST",
//			data: {
//				'candidate_id':candidate_table_id,
//				 csrfmiddlewaretoken : $("input[name=csrfmiddlewaretoken]").val()
//			},
//			timeout : 10000,
//			async:false,
//		}).done( function(json_data) {
//			data = JSON.parse(json_data);
//			var res_status = data['status'];
//			if(res_status == 'NTE_01') { 	
//				offer_status = true;
//			}			
//		});
//	}else{
//		alert_lobibox("warning","Candidate not selected")
//	}
//}



//resume parser modal function here 22-02-2019
function resumeParserModal(){
	clear_candidate_info()
	$('#extracted_content').html('');
	$('#resume_parser_pdfview').attr("src", '');
	$('.fileinput-exists').trigger('click');
	$('#resume_parser').modal('show');
}

//extract data
function resumeParserExtract(){
	if(document_form_validation()){
		resumeParserExtractContent(doc_data)
	}
}

var resume_parser_content = {};
//resume parser function
function resumeParserExtractContent(doc_data){	
	    $(".loader-wrapper").show();
		$.ajax({
			url : "/ta_resume_parser/",
			type : "POST",
			data : doc_data,
			timeout : 10000,
			async:false,
		}).done( function(json_data) {
			let data = JSON.parse(json_data);
			$(".loader-wrapper").hide();
			let file_name = resume_parser_path+data['resume_path'];
			$('#extracted_content').html('<h4>Extrated Content Here </h4>'+json_data);
			$('#resume_parser_pdfview').attr("src", file_name);
			resume_parser_content = json_data;
			alert_lobibox("success","Uploaded Resume Content Extrated Successfully.")
		});
		return false
}

//candidate apply get resume datas
function resumeParserExtractApply(){
	try{
		console.log("---------------resume_parser_content----------------",resume_parser_content)
		let data = JSON.parse(resume_parser_content);
		let split_data = data['resume_content'][0] || '';
		let get_name = split_data['get_name'][0] || '';
		let get_email = split_data['get_email'][0] || '';
		let get_phone = split_data['get_phone'][0] || '';
		let get_technical = split_data['get_technical'][0].toString() || '';
		let get_non_technical = split_data['get_non_technical'][0].toString() || '';
		let get_address = split_data['get_address'][0] || '';
		$('#first_name,#last_name').val(get_name);
		$('#primary_email,#secondary_email').val(get_email);
		$('#mobile_no').val(get_phone);
		$('#candidate_address').val(get_address);
		resume_parser_content = {};
		$('.close').trigger('click');
	}
	catch(err) {
		alert_lobibox("warning","Kindly Upload Resume. Because No Content Extrated.")
	}
}

//file size validation
jQuery.validator.addMethod(
    "filesize",
    function (value, element) {
        if (this.optional(element) || ! element.files || ! element.files[0]) {
            return true;
        } else {
            return element.files[0].size <= 1024 * 1024 * 2;
        }
        alert()
    },
    'The File Size Can Not Exceed 2MB.'
);


$('#document_basic_inform').submit(function(e) {
    e.preventDefault();    
}).validate({
   rules: {
	   ta_interview_doc: {
	   required:true,
	   filesize: true,    //max size 200 mb
	   extension: "pdf",

	},
   },
   //For custom messages
   messages: {
	   ta_interview_doc: {
		   required:"Please upload resume in pdf foramt",
	       extension:"Please upload .pdf file of notice.",
		   filesize:"The File Size Can Not Exceed 2MB",
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

//document form validation here
function document_form_validation(){
	return $('#document_basic_inform').valid();
}

var doc_data = {}
//upload file datas
function encodeDoctoBase64(element){
	if(element){
		if($('input[type=file][id$="'+element.id+'"]').val().replace(/C:\\fakepath\\/i, '')){
					doc_data = {}
					doc_data['doc_name'] = $('input[type=file][id$="'+element.id+'"]').val().replace(/C:\\fakepath\\/i, '')
					doc_data['folder_name'] = 'resume_parser'
					var file = element.files[0];
					var reader = new FileReader();
					reader.onloadend = function() {
						var img_str = reader.result
						doc_data['doc_str'] = img_str.split(',')[1]
						doc_data['format'] = $('input[type=file][id$="'+element.id+'"]').val().replace(/C:\\fakepath\\/i, '').split('.')[1];
					}
					reader.readAsDataURL(file);
				}
		}
	else{
		$("#document_error").html("File upload error.");
	}
}