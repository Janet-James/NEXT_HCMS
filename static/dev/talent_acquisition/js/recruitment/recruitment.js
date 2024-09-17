var interviewerListValues = [];
var recruitment_update_id="";
var document_names = "Interview";
var upload_id = 0;
var doc_names = '';
var recruitment_job_title_id;

//column detail function here
var columns = [{"title":"ID"}, {"title":"No."}, {"title":"Interview Type"},{"title":"Candidate Name"},{"title":"Interviewer Name"},{"title":"Interview Date"},{"title":"Job Title"}, {"title":"Interview Status"},{"title":"Rating"}];
$(document).ready(function(){
	button_create(1);
	recruitmentDataTable();
	$('#job_title').attr("disabled", true);
	$('#right').trigger('click');
});

//Recruitment create function here 
function recruitment_create_button() {
	if(recruitment_form_validation())
	{
		recruitment_create_function(0);
	}
}

//Recruitment edit function here 
function recruitment_edit_button() {
	if(recruitment_form_validation())
	{
		recruitment_create_function(recruitment_update_id);
	}
}

//Recruitment delete function here 
function recruitment_delete_button() {
	var title = $('#candidate_name option:selected').text().toString();
	removeConfirmation('recruitmentDelete',recruitment_update_id,title);
}

//Recruitment cancel function here 
function recruitment_cancel_button() {
	$('#recruitment_details_form').trigger("reset");
	$('#interview_type').val('0').trigger('change');
	$('#candidate').val('0').trigger('change');
	$('#job_title').val('0').trigger('change');
	$('#interview_status').val('0').trigger('change');	
	interviewerListValues = [];
	$('#interviewer').multiselect('select', interviewerListValues);
}

//cancel clear function call button
function recruitment_clear_btn_refresh(){
	if(recruitment_update_id != '' ){
		var title = $('#candidate_name option:selected').text().toString();
		orgClearFuncton('clearConformationEvent','',title);
	}else{
		clearConformationEvent();
	}
}

//Recruitment clear confirmation
function clearConformationEvent(){
	recruitment_update_id = '';
	upload_id = 0;
	$('.errormessage').val('');
	$('#interview_type').val('0').trigger('change');
	$('#candidate_name').val('0').trigger('change');
	$('#job_title').val('0').trigger('change');
	$('#interview_status').val('0').trigger('change');	
	$('#rating').val('0').trigger('change')
	button_create(1);
	$('#recruitment_details_form')[0].reset();	
	$('.fileinput-filename').html('');
	$('.EmployeeCard').removeClass('custom_dev_acitve');
	dashboardJobInterviewDetails();
	interviewerListValues = [];
	$('#interviewer').multiselect('select', interviewerListValues);
}

//interview type change function here
$('#interview_type').change(function(){
	$('.errorTxt0').html('');
});

//candidate name change function here
$('#candidate_name').change(function(){
	$('.errorTxt1').html('');
	job_title_drop_down($('#candidate_name').val())
});

//job title change function here
$('#job_title').change(function(){
	$('.errorTxt2').html('');
});

//interviewer change function here
$('#interviewer').change(function(){
	$('.errorTxt3').html('');
});

//interview status function here
$('#interview_status').change(function(){
	$('.errorTxt4').html('');
});

//from time change function here
$('#from_time').change(function(){
	if($('#to_time').val()!=''){
		if($('#from_time').val() > $('#to_time').val()){
			$('#frm_time_err').text("From time cannot be greater than To time")
		}else if($('#from_time').val() == $('#to_time').val()){
			$('#frm_time_err').text("From time and To time cannot be same")
		}else{
			$('#frm_time_err').text("")
		}		
	}
});

//to time change function here
$('#to_time').change(function(){
	if($('#to_time').val()!=''){
		if($('#from_time').val() > $('#to_time').val()){
			$('#to_time_err').text("From time cannot be greater than To time")
		}else if($('#from_time').val() == $('#to_time').val()){
			$('#to_time_err').text("From time and To time cannot be same")
		}else{
			$('#to_time_err').text("")
		}
	}
});

//job title dropdown change function here
function job_title_drop_down(candidate_id){
	$.ajax({
		url : "/ta_job_title_drop_down/",
		type : "POST",
		data : {"candidate_id":candidate_id},
		csrfmiddlewaretoken : $("input[name=csrfmiddlewaretoken]").val(),
		timeout : 10000,
		async:false, 
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		if(data.job_opening){				
			 	for (var i=0;i<data.job_opening.length;i++)
				{
			 		recruitment_job_title_id = data.job_opening[i].job_opening_id;
					$('#job_title').val(data.job_opening[i].job_opening_id).trigger('change')
					$('#job_title').attr("disabled", true);
					$('.errorTxt2').html('')					
				}				
		}
	});
}

//recruitment create update function here
function recruitment_create_function(id){
	var project_form_value = getFormValues("#recruitment_details_form");
	var csrf_data = project_form_value.csrfmiddlewaretoken;
	delete project_form_value["csrfmiddlewaretoken"];	
	project_form_value['is_active'] = "True";
	project_form_value['interview_type'] = validationFields_org(project_form_value['interview_type']);
	project_form_value['candidate_name'] =  validationFields_org(project_form_value['candidate_name']);
	project_form_value['interviewer'] = interviewerListValues.toString();
	project_form_value['interview_status'] = validationFields_org(project_form_value['interview_status']);
	project_form_value['interview_date'] = DateformatChange(project_form_value['interview_date']);
	project_form_value['interview_rating'] = validationFields_org(project_form_value['rating']);	    
	project_form_value['job_title'] = recruitment_job_title_id;
//    project_form_value['job_title'] = $('#job_title option[disabled]:selected').val(); // result is string
	
	//upload document 
	var file_names = $('input[type=file][id$="ta_interview_doc"]').val().replace(/C:\\fakepath\\/i, '').split('.')[0].toString().toLowerCase();
	if(id != 0){
		upload_id = updateDocAttachment();
		var file_name =  file_names ? file_names : doc_names;
	}else if(id == 0){
		upload_id = saveDocAttachment();
		var file_name =   file_names ? file_names : '';
	}
	
	project_form_value['attachment_id'] =  upload_id ? upload_id : 0;
	project_form_value['doc_name'] = file_name;
	
	project_list = [];
	project_dict = {};
	project_list.push(project_form_value);
	project_dict['input_data'] = project_list;
	if(id)
	{
		$.ajax({
			type  : 'POST',
			url   : '/ta_recruitment_create/',
			async : false,
			data: {
				'datas': JSON.stringify(project_list),
				"table_id":recruitment_update_id,
				"candidate_id":$('#candidate_name').val(),
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
				recruitmentDataTable();
			}else if(res_status == 'ERR0028'){
				alert_lobibox("success", "Interview already added for this Job to Candidate");
			}else if(res_status == 'NTE_06'){
				alert_lobibox("success", "Candidate already in a Offer Stage for this Job");
			}else{
				alert_lobibox("error", sysparam_datas_list[res_status]);
			}
		});

	}else
	{
		$.ajax({
			type  : 'POST',
			url   : '/ta_recruitment_create/',
			async : false,
			data: {
				'datas': JSON.stringify(project_list),
				"candidate_id": $('#candidate_name').val(),
				 csrfmiddlewaretoken: csrf_data
			},
		}).done( function(json_data) {
			data = JSON.parse(json_data);
			var res_status = data['status'];
			if(res_status == 'NTE_01') {	
				alert_lobibox("success", sysparam_datas_list[res_status]);
				clearConformationEvent();
				recruitmentDataTable();
			}else if(res_status == 'ERR0028'){
				alert_lobibox("success", "Interview already added for this Job to Candidate");
			}else if(res_status == 'NTE_06'){
				alert_lobibox("success", "Candidate already in a Offer Stage for this Job");
			}else{
				alert_lobibox("error", sysparam_datas_list[res_status]);
			}
		});	
	}
}

//Recruitment delete function here
function recruitmentDelete(delete_id){
	$.ajax({
        type  : 'POST',
        url   : '/ta_recruitment_create/',
        async : false,
        data: {
            'delete_id':delete_id,
             'job_id':$('#job_title').val(),
             csrfmiddlewaretoken : $("input[name=csrfmiddlewaretoken]").val()
        },
    }).done( function(json_data) {
        data = JSON.parse(json_data);
		var res_status = data['status'];
		if(res_status == 'NTE_04') {
			alert_lobibox("success", sysparam_datas_list[res_status]);
			recruitmentDataTable();
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

// Recruitment data table function here
function recruitmentDataTable(){
	$.ajax({
		url : "/ta_recruitment_data_table/",
		type : "GET",
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		plaindatatable_btn("ta_interview_table",data.results,columns,0,'NEXT_TRANSFORM_HCMS_INTERVIEW_'+currentDate());
		drawListView(data)
	});
}

//Job interview data table function here
function drawListView(data){
	var res_datas = data.results;
	var verticalViewData = '';
	if(res_datas.length){
	for(var i=0; i<res_datas.length; i++){
		verticalViewData += '<div class="col-md-12 EmployeeCard equhight employeeList ta_job_opening" id="'+res_datas[i][0]+'" onclick="recruitmentTableClick('+res_datas[i][0]+')">'
		verticalViewData += '<div class="col-md-8">'
		verticalViewData += '<table><tr><td class="tdwidth1">Name </td><td class="tdwidth2">:</td><td class="tdwidth3"><b>'+res_datas[i][3]+'</b></td></tr>';
		verticalViewData += '<tr><td class="tdwidth1">Job Title </td><td class="tdwidth2">:</td><td class="tdwidth3"><b> <b>'+res_datas[i][6]+'</b></td></tr>';
		verticalViewData += '<tr><td class="tdwidth1">Interview Status </td><td class="tdwidth2">:</td><td class="tdwidth3"><b> <b>'+res_datas[i][7]+'</b></td></tr>';
		verticalViewData += '<tr><td class="tdwidth1">Interviewer </td><td class="tdwidth2">:</td><td class="tdwidth3"><b> <b>'+res_datas[i][2]+'</b></td></tr></table>';
		verticalViewData += '</div>'
		verticalViewData += '<div class="col-md-4 ta_job_status_div">'
		verticalViewData += '<div style="font-size: 12px;padding: 5px;">Rating</div>';
		if(res_datas[i][8]) {
			verticalViewData += '<div style="color:green;font-size: 11px;padding: 5px;" class=""><b>'+res_datas[i][8]+'</b></div>';
		}else{
			verticalViewData += '<div style="color:green;font-size: 11px;padding: 5px;" class=""><b>'+res_datas[i][8]+'</b></div>';
		}
		verticalViewData += '</div>'
		verticalViewData += '</div>'
	}}
	else{
		verticalViewData = "<p class='no_data_found'>No Data Found.</p>"
	}
	$('#ta_job_interview_details_vertical_view').html(verticalViewData);
}

// Recruitment data table click 
function recruitmentTableClick(id)
{
	clearConformationEvent();
	button_create(2);
	$('.EmployeeCard').removeClass('custom_dev_acitve');
	$('#'+id).addClass('custom_dev_acitve');
	$.ajax(
			{
				url : '/ta_recruitment_table_click/',
				type : 'POST',
				timeout : 10000,
				data:{"recruitment_id":id,csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()},
				async:false,
			}).done(
					function(json_data)
					{
						recruitment_update_id = id;
						var data = JSON.parse(json_data)
						// Setting Values
						$('#interview_type').val(data.results[0].interview_type_id).trigger('change')
						$('#candidate_name').val(data.results[0].candidate_id).trigger('change')
						$('#job_title').val(data.results[0].job_title_id).trigger('change')
						var get_ids = (data.results[0].interviewer_ids);
						interviewerListValues = get_ids.split(',');
						$('#interview_status').val(data.results[0].interview_status_id).trigger('change')
						$('#from_time').val(data.results[0].from_time)
						$('#to_time').val(data.results[0].to_time)
						$('#comments').val(data.results[0].comments)
						let rating = data.results[0].rating == null ? 0 : data.results[0].rating;
						$('#rating').val(rating).trigger('change')		
						$('#interview_date').val(data.results[0].interview_date)
						$('.fileinput-filename').html(data.results[0].show_doc_name);
						doc_id = data.results[0].attachment_id;
						doc_names = data.results[0].doc_name;
						console.log('-interviewerListValues--',interviewerListValues)
						$('#interviewer').multiselect('select', interviewerListValues);
					});

}

//button create function here
function button_create(status){
	var access_for_create = jQuery.inArray( "Interview Management", JSON.parse(localStorage.Create) );
	var access_for_write = jQuery.inArray( "Interview Management", JSON.parse(localStorage.Write) );
	var access_for_delete = jQuery.inArray( "Interview Management", JSON.parse(localStorage.Delete) );
	var strAppend = '';
	if(status == 1){
		if (access_for_create != -1){
			strAppend = "<button type='button' onclick='recruitment_create_button()' class='btn btn-success btn-eql-wid btn-animate'>Add</button>"
		}
		strAppend += " <button type='button' onclick='recruitment_clear_btn_refresh()' class='btn btn-warning btn-animate btn-eql-wid btn-animate'>Cancel / Clear</button>"
			$('#ta_recruitment_btn').html(strAppend);
	}else{
		if (access_for_write != -1){
			strAppend = "<button type='button' onclick='recruitment_edit_button()' class='btn btn-primary btn-eql-wid btn-animate '>Update</button>"
		}
		if (access_for_delete != -1){
			strAppend += " <button type='button' onclick='recruitment_delete_button()' class='btn btn-danger btn-eql-wid btn-animate '>Remove</button>"
		}
		strAppend += " <button type='button' onclick='recruitment_clear_btn_refresh()' class='btn btn-warning btn-animate btn-eql-wid btn-animate'>Cancel / Clear</button>"
			$('#ta_recruitment_btn').html(strAppend);
	}
}

//jquery attendance validation
jQuery.validator.addMethod('valueNotEquals', function (value) {
  return (value != '0');
}, "year required");

//$.validator.addMethod("custom_rating", function(value, element) {
//    return value >= 0 && value <= 10 ? true :false;
// });

// Recruitment validations here
$('#recruitment_details_form').submit(function(e) {
  e.preventDefault();
}).validate({
 rules: {
	   interview_type: {
		   required: true,
		   valueNotEquals: true,
	   },
	   candidate_name: {
		   required: true,
		   valueNotEquals: true,
	   }, 
	   job_title: {
		   required: true,
		   valueNotEquals:true,
	   }, 
	   interviewer: {
		   valueNotEqualsInterview:true,
	   }, 
	   interview_status: {
		   required: true,
		   valueNotEquals:true,
	   }, 
	   from_time: {
		   required: true,		   
	   }, 
	   to_time: {
		   required: true,	
	   },
	   comments: {
		   maxlength: 200,
	   },
	   interview_date: {
		   required: true,
	   },	   
 },
 //For custom messages
 messages: {
	 interview_type: {
		 valueNotEquals: "Select Interview Type",
	 },
	 candidate_name: {
		 valueNotEquals: "Select Candidate Name",
	 },
	 job_title: {
		 valueNotEquals: "Select Job Title",
	 }, 
	 interviewer: {
		 valueNotEqualsInterview: "Select Interviewer Atleast One",
	 }, 
	 interview_status: {
		 valueNotEquals: "Select Interview Status",
     },
     from_time: {
		 required: "Select From Time",
	 }, 	
	 to_time : {
		 required: "Select To Time",
	 },
     comments: {
    	 maxlength: "Comments cannot exceed 200 characters",
     },
     interview_date: {
    	 required: "Enter Interview Date",
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

//form is valid or not
function recruitment_form_validation()
{
	return $('#recruitment_details_form').valid();
}

$('.select2').select2().change(function(){
	$('.errormessage').html('');
});

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

//20-July-2018 || TRU || right Details Button Function
$("#right").click(function(){
	$('#left').css('display','block');
	$('#right').css('display','none');
	$('#ta_open_main_div1').addClass('col-md-12').removeClass('col-md-8');
	$('#ta_open_main_div2').removeClass('divActive');
});

//20-July-2018 || TRU || left Details Button Function
$("#left").click(function(){
	$('#left').css('display','none');
	$('#right').css('display','block');
	$('#ta_open_main_div1').addClass('col-md-8').removeClass('col-md-12');
	$('#ta_open_main_div2').addClass('divActive');
});

//search job name based on job list
var elem = document.getElementById('job_interview_search');
elem.addEventListener('keypress', function(e){
if (e.keyCode == 13) {
	  var job_name =  $('#job_interview_search').val()
	  if(!job_name=='')
	  {
		  jobSearchList(job_name);
	  }else{
		  jobSearchList('');		 
		  recruitmentDataTable();
	  }		 
}
});

//fetch the job datas
function jobSearchList(name){
	$.ajax({
		url : "/ta_recruitment_data_table/",
		type : "POST",
		data : {'filter_name':name},
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		drawListView(data);
	});
}

//interviewer on change values get
$('#interviewer').on('change', function(){
    var selected = $(this).find("option:selected");
    interviewerListValues = [];
    selected.each(function(){
    	interviewerListValues.push(parseInt($(this).val()));
    });
});

//jquery attendance validation
jQuery.validator.addMethod('valueNotEqualsInterview', function (value) {
	return (interviewerListValues.length > 0);
}, "year required");