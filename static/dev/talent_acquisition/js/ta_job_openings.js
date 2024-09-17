var columns = [{title : "ID"},{title : "No."}, {title : "Job Title"    },{title : "Opened Date"}, {title : "Target Date"}, {title : "Number of Positions"}]
var res_data='',table_id=0;
var upload_id ,job_publish_id= 0;
var doc_names = '';
var document_names = 'job_opening_document';
$(document).ready(function(){
	var post_data={};
	post_data["table_name"]="organization_info";
	post_data["fields"]="id,name";
	DropdownValues(post_data,"organization","id","name");
	
	var post_data={};
	post_data["type"]="reference";
	post_data["code"]="JOBTY"
	DropdownValues(post_data,"job_type","id","refitems_name");
	post_data["code"]="WRKEX"
	DropdownValues(post_data,"work_experience","id","refitems_name");
	
	var post_data={};
	post_data["type"]="reference";
	post_data["code"]="SHTYP"
	DropdownValues(post_data,"shifts","id","refitems_name");

	var post_data={};
	post_data["type"]="reference";
	post_data["code"]="JOPEN"
	DropdownValues(post_data,"job_status","id","refitems_name");

	button_create(1)
	job_opening_datatable_function();
	
	$("#open_date").DateTimePicker({
		dateFormat: "dd-MM-yyyy",
	});
	
	$('#tr_date').DateTimePicker({
		dateFormat: "dd-MM-yyyy",
	});
	
	$('#job_borads').multiselect({ nonSelectedText:'--Select Job Borads Unit--'});
	$('#job_resource_config').prop('disabled',false);
	
	$('[data-toggle="tooltip"]').tooltip();  
	
	$('#right').trigger('click');
	let option_length = $("#job_resource_config option").length;
	if(option_length == 1){
		$('#job_resource_config').prop('disabled',true);
	}
})

//organization based org unit change function here
$("#organization").on("change", function() {
    var id = this.value;//get on change value
    var post_data={};
	post_data["table_name"]="organization_unit_info";
	post_data["fields"]="id,orgunit_name";
	post_data["org_id"]=id;
	DropdownValues(post_data,"organization_unit","id","orgunit_name");
	
	var post_data={};
	post_data["table_name"]="team_details_info";
	post_data["fields"]="id,name";
	post_data["org_id"]=id;
	DropdownValues(post_data,"department","id","name");
	
	var post_data={};
	post_data["type"]="join";
	post_data["org_id"]=id;
	post_data["fields"]="employee_info.id,coalesce(employee_info.name,'')||'  '|| coalesce(employee_info.last_name,'') as name";
	DropdownValues(post_data,"recruiter","id","name");
	DropdownValues(post_data,"assigned_recruiter","id","name");

	var post_data={};
	post_data["type"]="join";
	post_data["org_id"]=id;
	post_data["fields"]="employee_info.id,coalesce(employee_info.name,'')||'  '|| coalesce(employee_info.last_name,'') as name,employee_info.work_mobile";
	DropdownValues(post_data,"contact_number","id","name");
});

//drop down function here
function DropdownValues(post_data,id,key,value) { 
	$.ajax({ 
		url : '/ta_job_openings_dropdown/',
		type : 'POST',
		data:post_data, 
		timeout : 10000,
		async : false,
	}).done(  
			function(json_data)   
			{ 
				var data = JSON.parse(json_data);
				res_data=data.vals;
				if(res_data.length > 0){  
					setDropdownValues(res_data,id,key,value)
				}else{
					$('#'+id+' option').each(function() {
					    if ( $(this).val() != '0' ) {
					        $(this).remove();
					    }
					});
					}
			});  
}

//set drop down function here
function setDropdownValues(res,id,key,value){
	for (var i = 0; i < res.length; i++) { 
		$('#'+id).append($('<option>', {   
			value : res[i][key], 
			text : res[i][value]
		}));
	}
}

//job opening create function here
function job_opening_create() {
	var isvalid = job_opening_form_validation();
	if (isvalid) {
		add_update("", "add");
	}
}

//job opening update function here
function job_opening_update(){
	var isvalid = job_opening_form_validation();
	if (isvalid) {
	if(table_id !=0){
		add_update(table_id, "update");

	}
	}
}

//job opening delete function here
function job_opening_delete() {
	if (table_id != 0) {
		var title = $('#job_title').val();
		removeConfirmation('add_update',table_id,title);
	}
}

//cancel clear function call button
function job_opening_clear(){
	if(table_id != 0 ){
		var title = $('#job_title').val();
		orgClearFuncton('job_opening_clear_call','',title);
	}else{
		job_opening_clear_call();
	}
}

//job opening clear function here
function job_opening_clear_call(){
	dashboardJobOpeningDetails();
	$('.EmployeeCard').removeClass('custom_dev_acitve');
	$('#job_resource_config').prop('disabled',false);
	$('#date_opened').val('');
	$('#target_date').val('');
	$(".date_input_class").trigger('change');
	button_create(1);
	doc_id, job_publish_id, table_id= 0;
	doc_names = '';
	$('#job_opening_form')[0].reset();
	$('#job_resource_config,#shifts').val(0).trigger("change");
	$('#job_status').val(0).trigger("change");
	$('#job_type').val(0).trigger("change");
	$('#work_experience').val(0).trigger("change");
	$('#organization').val(0).trigger("change");
	$('#organization_unit').val(0).trigger("change")
	$('#department').val(0).trigger("change");
	$('#assigned_recruiter').val(0).trigger("change");
	$('#contact_number').val(0).trigger("change");  
	$('#logo_type_id').val(0).trigger("change");  
	$('#job_cat_id').val(0).trigger("change");
	$('.fileinput-filename').html('');
	$('#key_skills').multiselect('select', []);
}

//job opening data set function here
function setJobOpeningData(res){
	if(res.job_resource_config_id != null){
		$('#job_resource_config').prop('disabled',true);
	}else{
		$('#job_resource_config').prop('disabled',false);
	}
	$('#job_resource_config').val(res.job_resource_config_id).trigger("change"); 
	$('#job_title').val(res.job_title);
	let key_skills = (res.key_skills).split(',');
	$('#key_skills').multiselect('select', key_skills);
	$('#date_opened').val(res.date_opened) 
	$('#organization').val(res.org_id).trigger("change"); 
	$('#organization_unit').val(res.org_unit_id).trigger("change");
	$('#department').val(res.department_id).trigger("change");
	$('#recruiter').val(res.recruiter_id).trigger("change");
	$('#assigned_recruiter').val(res.assigned_recruiter_id).trigger("change");
	$('#contact_number').val(res.contact_no_id).trigger("change");
	$('#job_status').val(res.job_opening_status_id).trigger("change");
	$('#salary').val(res.salary);
	$('#target_date').val(res.target_date);
	$(".date_input_class").trigger('change');
	$('#job_type').val(res.job_type_id).trigger("change");
	$('#work_experience').val(res.work_experience_id).trigger("change");
	$('#no_positions').val(res.number_of_positions);
	$('#job_description').val(res.job_description);
	$('#shifts').val(res.shift_id).trigger("change");
	$('#job_location').val(res.job_location);
	$('#logo_type_id').val(res.logo_type_id).trigger("change");
	$('#job_cat_id').val(res.job_cat_id).trigger("change");
	$('#job_short_description').val(res.job_short_description);
	$('.fileinput-filename').html(res.show_doc_name);
	table_id=res.id;
	job_publish_id = res.job_publish;
	doc_id = res.attachment_id;
	doc_names = res.doc_name;
	console.log("===========key_skills=============",key_skills)
	console.log("------list_skills----------------",list_skills)
	list_skills = key_skills;
	$("#key_skills").multiselect('deselectAll', false);
	$('#key_skills').multiselect('select', list_skills);
	button_create();
}

//recruiter base get contact
$("#recruiter,#assigned_recruiter").change(function() {
	var getRecruiter = $('#recruiter').val();
	if(getRecruiter != 0){
		var assignRecruiter = $('#assigned_recruiter').val() != 0 ? $('#assigned_recruiter').val() : getRecruiter ;
		$('#contact_number').val(assignRecruiter).trigger("change");
	}else{
		$('#contact_number').val(0).trigger("change");
	}
});

//job opening row click function here
function job_opening_rowclick(id){
	$('.EmployeeCard').removeClass('custom_dev_acitve');
	$('#'+id).addClass('custom_dev_acitve');
	post_data={};
	post_data['type']="row"
		post_data['table_id']=id;
	var res =getTableData(post_data);
	if(res.datas){
		setJobOpeningData(res.datas[0]);	
	}

}

//job opening data put function here
function job_opening_datatable_function(){
	post_data={};
	post_data['type']="all"
		var res =	getTableData(post_data);
	drawDatatable(res);
	plaindatatable_btn("ta_job_opening_table",res.datas,columns,0,'NEXT_TRANSFORM_HCMS_TOOLS_TECH_'+currentDate());

}

//job opening data get function here
function getTableData(param){
	var data="";
	$.ajax({
		url : '/ta_job_openings_data/',
		type : 'POST',
		timeout : 10000, 
		data:param,
		async:false,
	}).done(function(json_data){
		data = JSON.parse(json_data)
	});
	return data;

}

//Job opening data table function here
function drawDatatable(data){
	var res_datas = data.datas;
	var verticalViewData = '';
	if(res_datas.length){
	for(var i=0; i<res_datas.length; i++){
		verticalViewData += '<div class="col-md-12 EmployeeCard equhight employeeList ta_job_opening " id="'+res_datas[i][0]+'">'
		verticalViewData += '<div class="col-md-9" onclick="job_opening_rowclick('+res_datas[i][0]+')">'
		verticalViewData += '<table><tr><td class="tdwidth1">Name</td><td class="tdwidth2">:</td><td class="tdwidth3"> <b>'+res_datas[i][2]+'</b></td></tr> ';
		verticalViewData += '<tr><td class="tdwidth1">Created </td><td class="tdwidth2">:</td> <td class="tdwidth3"><b>'+res_datas[i][3]+'</b></td></tr>';
		verticalViewData += '<tr><td class="tdwidth1">Target </td><td class="tdwidth2">:</td> <td class="tdwidth3"><b>'+res_datas[i][4]+'</b></td></tr>';
		verticalViewData += '<tr><td class="tdwidth1">Vacancies </td> <td class="tdwidth2">:</td><td class="tdwidth3"> <b>'+res_datas[i][5]+'</b></td></tr></table>';
		verticalViewData += '</div>'
		verticalViewData += '<div class="col-md-3 ta_job_status_div " style="margin-top: -15px;">'
		if(res_datas[i][6] != ''){
			verticalViewData += '<div data-toggle="tooltip" data-placement="bottom" title="This Job Already Published To Join Us. Removed Published (NEXT Website). Click to Un-Published." onclick="jobPublishBtn('+res_datas[i][0]+',\'' + res_datas[i][2] + '\',0)" ><div class="ta_job_status job_publish_status margintop5 margintop51" style="color:#red;" ><span><img style="height: 20px;margin-top: 18px;" src="/static/ui/images/fliplogo.png" alt="image not found"/></span></div>';
			verticalViewData += '<div class="" style="color:green;font-size: 8px;"><b>Job Published To Join Us. Removed Published (NEXT Webiste)</b></div></div>';
		}else{
			verticalViewData += '<div data-toggle="tooltip" data-placement="bottom" onclick="jobPublishBtn('+res_datas[i][0]+',\'' + res_datas[i][2] + '\',1)"  title="This Job Publish To Join Us (NEXT Website). Click to Publish."><div class="ta_job_status job_publish_status margintop5 margintop51"><span><img style="height: 40px;margin-top: 18px;" src="/static/ui/images/fliplogo.png" alt="image not found"/></span></div>';
			verticalViewData += '<div class="" style="color:red;font-size: 8px;"><b>Job Not Published To Join Us (NEXT Webiste)</b></div></div>';	
		}
		verticalViewData += '</div>'
		verticalViewData += '</div>'
	}}
	else{
		verticalViewData = "<p class='no_data_found'>No Data Found.</p>"
	}
	$('#ta_job_opening_details_vertical_view').html(verticalViewData);
	$('[data-toggle="tooltip"]').tooltip();  
}

var jb_status = ''
//job published in join funstion here
function jobPublishBtn(job_id,name,job_status){
	jb_status = job_status == 1 ? '1' : '';
	let job_status_name = jb_status == '1' ? '' : ' Un ';
	publishConfirmation('jobPuslishStatus',job_id, name,job_status_name)
}

//job publish or unpublish function here
function jobPuslishStatus(job_id){
	$.ajax({
		url : '/ta_job_opening_un_published/',
		type : 'POST',
		timeout : 10000, 
		data:{ 'job_id': job_id,'job_status':jb_status },
		async:false,
	}).done(function(json_data){
		let data = JSON.parse(json_data)
		if(data['data'] == 'NTE-03'){
			if(jb_status != '1'){
				alert_lobibox("success","This Job Un-Published Successfully. Check Join Us (NEXT Website)");
			}else{
				alert_lobibox("success","This Job Published Successfully. Check Join Us (NEXT Website)");
			}
			job_opening_datatable_function();			
		}else{
			alert_lobibox("error","This Job Un-Published Failed.");	
		}
	});
}


//job opening operation function here
function add_update(id, operation) {
	if (operation == undefined) {
		operation = "remove";
	}
	var job_resource_config = $('#job_resource_config').val();
	var job_title = $('#job_title').val();
	var key_skills = $('#key_skills').val();
	var date_opened = $('#date_opened').val();
	var assigned_recruiter = $('#assigned_recruiter').val();
	var contact_number = $('#contact_number').val();
	var job_status = $('#job_status').val();
	var organization = $('#organization').val();
	var organization_unit = $('#organization_unit').val();
	var department = $('#department').val(); 
	var salary = $('#salary').val() || '';
	var target_date = $('#target_date').val();
	var job_type = $('#job_type').val();
	var work_experience = $('#work_experience').val();
	var no_positions = $('#no_positions').val();
	var job_description = $('#job_description').val();
	var shifts = $('#shifts').val();
	var recruiter = $('#recruiter').val()
	var job_location = $('#job_location').val();
	var logo_type_id = $('#logo_type_id').val();
	var job_cat_id= $('#job_cat_id').val();
	var job_short_description = $('#job_short_description').val();
	if (date_opened) {
		var dateArray = date_opened.split('-');
		year_time=dateArray[2].split(' ');
		//var date_opened = dateArray[1] + '-' + dateArray[0] + '-' + dateArray[2];
		var date_opened=year_time[0] + '-' +dateArray[1]+ '-' + dateArray[0];
	}
	if (target_date) {
		var dateArray = target_date.split('-');
		year_time=dateArray[2].split(' ');  
		//var target_date = dateArray[1] + '-' + dateArray[0] + '-' + dateArray[2];
		var target_date=year_time[0] + '-' +dateArray[1]+ '-' + dateArray[0];
	}	
	
	//upload document 
	var file_names = $('input[type=file][id$="job_opening_doc"]').val().replace(/C:\\fakepath\\/i, '').split('.')[0].toString().toLowerCase();
	if(operation == "update"){
		var file_name =  file_names ? file_names : doc_names;
	}else if(operation == "add"){
		var file_name =  file_names;
	}
//	job_title date_opened assigned_recruiter contact_number job_status organization organization_unit department salary
//	target_date job_type work_experience no_positions job_borads shifts job_location
	key_skills = list_skills.toString();
	if (id && operation == "update") {
		upload_id = updateDocAttachment();
		job_create_data = {
				'job_title' : job_title,
				'key_skills' : key_skills,
				'date_opened' : date_opened,  
				'assigned_recruiter' : assigned_recruiter,
				'contact_number' : contact_number, 	
				'job_status' : job_status,
				'organization' : organization,
				'organization_unit' : organization_unit,
				'department' : department,
				'salary' : salary,
				'target_date' : target_date,
				'job_type' : job_type,
				'work_experience' : work_experience,
				'no_positions' : no_positions,
				'job_description':job_description,
				'shifts' : shifts,
				'job_location' : job_location,
				'recruiter' : recruiter,
				'job_resource_config' : job_resource_config,
				'logo_type_id' : logo_type_id,
				'job_cat_id':job_cat_id,
				'job_short_description':job_short_description

		}
		job_create_data['attachment_id'] =  upload_id ? upload_id : 0;
		job_create_data['doc_name'] = file_name;
		var vals = {
				'results' : JSON.stringify(job_create_data),
				'delete_id' : '',
				'update_id' : id,
				csrfmiddlewaretoken : $("input[name=csrfmiddlewaretoken]").val()
		}

	} else if (!id && operation == "add") {
		upload_id = saveDocAttachment();
		job_create_data = {
				'job_title' : job_title,
				'key_skills' : key_skills,
				'date_opened' : date_opened,
				'assigned_recruiter' : assigned_recruiter,
				'contact_number' : contact_number,
				'job_status' : job_status,
				'organization' : organization,
				'organization_unit' : organization_unit,
				'department' : department,
				'salary' : salary,
				'target_date' : target_date,
				'job_type' : job_type,
				'work_experience' : work_experience,
				'no_positions' : no_positions,
				'job_description':job_description,
				'shifts' : shifts,
				'job_location' : job_location,
				'recruiter' : recruiter,
				'job_resource_config' : job_resource_config,
				'logo_type_id' : logo_type_id,
				'job_cat_id':job_cat_id,
				'job_short_description':job_short_description
		}
		job_create_data['attachment_id'] = upload_id ? upload_id : 0;
		job_create_data['doc_name'] = file_name;
		var vals = {
				'results' : JSON.stringify(job_create_data),
				'delete_id' : '',
				'update_id' : '',
				csrfmiddlewaretoken : $("input[name=csrfmiddlewaretoken]").val()
		}
	} else if (id && operation == "remove") {
		if (table_id != 0) {
			var vals = {
					'results' : "",
					'delete_id' : table_id,
					'update_id' : '',
					csrfmiddlewaretoken : $("input[name=csrfmiddlewaretoken]").val()
			}
		}
	} 
	$.ajax({ 
		url : '/ta_job_openings_crud/',
		type : 'POST', 
		data : vals,
		timeout : 10000,
		async : false,
	}).done(function(json_data) {
		var data = JSON.parse(json_data);
		// alert_status(data.results)
		if (data.results=="ERR0503"){ 
			alert_lobibox("error", sysparam_datas_list[data.results]);		
		}else if(data.results == "ERR0101"){
			alert_lobibox("error","This Job Already Accepted.Try to Add Request Other Jobs.");	
		}
		else{
			if(data.results == 'NTE_03'){
				button_create(1);
			}
			table_id = 0;
			alert_lobibox("success", sysparam_datas_list[data.results]);
			job_opening_clear();
			job_opening_datatable_function();
		}

	});
}

var list_skills = []
$('#key_skills').on('change', function(){
    var selected = $(this).find("option:selected");
    list_skills = [];
    selected.each(function(){
    	list_skills.push(parseInt($(this).val()));
    });
});

//jquery job opening validation
jQuery.validator.addMethod('valueNotEquals', function(value) {
	return (value != '0');
}, "country required");

//jquery job opening validation
jQuery.validator.addMethod('key_skills_val', function(value) {
	return (list_skills.length > 0 ? true : false)  ;
}, "");


$('.select2').select2().change(function() {
	$('.errorTxts').html('');
});

$('#job_opening_form').submit(function(e) {
	e.preventDefault();
}).validate({
	rules : {
		job_title : {
			required : true,
		},
		/*key_skills : {
			key_skills_val : true,
		},*/
		date_opened : {
			required : true,	
		},
		assigned_recruiter: {
			required:true,
			valueNotEquals:true,
		},
		recruiter: {
			valueNotEquals:true,
		},
		contact_number : {
			required : true,
			valueNotEquals : true,
		},
		organization : {
			required : true,
			valueNotEquals : true,
		},
		organization_unit : {
			required : true,
			valueNotEquals : true,
		},
		department : {
			required : true,
			valueNotEquals : true,
		}, 
		target_date: {
			required : true,
		},
		job_type: {
			required:true,
			valueNotEquals:true,
		},
		work_experience: {
			required:true,
			valueNotEquals:true,
		},
		no_positions: {
			required:true,
		},
		shifts: {
			required:true,
			valueNotEquals:true,
		},
		logo_type_id: {
			valueNotEquals:true,
		},
		job_cat_id: {
			valueNotEquals:true,
		},
		job_short_description: {
			required:true,
		},
		job_description: {
			required:true,
		}
	},
	// For custom messages
	messages : {
		job_title : {
			required: "Enter Job Title",
		},
		/*key_skills : {
			key_skills_val: "Select Skill Atleast One"
		},*/
		date_opened : {
			required : "Enter Created Date",
		},
		assigned_recruiter: {
			required: "Select Assigned Recruiter",
			valueNotEquals : "Select Assigned Recruiter",
		},
		recruiter: {
			valueNotEquals : "Select Valid HR Contact Name",
		},
		contact_number: {
			required: "Select Recruiter Contact Number",
			valueNotEquals : "Select Recruiter Contact Number",
		},
		organization : {
			valueNotEquals : "Select Valid Organization",
			required: "Select Organization",
		},
		organization_unit : {
			required : "Select Organization Unit Name",
			valueNotEquals : "Select Organization Unit Name",
		},
		department : {
			valueNotEquals : "Select Valid Division",
			required: "Select Division",
		},
		target_date: {
			required: "Enter Target Date",
		},
		job_type: {
			required: "Select Job Type",
			valueNotEquals: "Select Job Type", 
		},
		work_experience: {
			required: "Select Work Experience",
			valueNotEquals: "Select Work Experience", 
		},
		no_positions: {
			required: "Enter Number of Vacancies",
		},
		shifts: {
			required: "Select Shift",
			valueNotEquals: "Select Shift", 
		},
		logo_type_id: {
			valueNotEquals: "Select Logo Type", 
		},
		job_cat_id: {
			valueNotEquals: "Select Job Category", 
		},
		job_short_description: {
			required: "Enter Job Short Description",
		},
		job_description: {
			required: "Enter Job Details Description",
		},
	},
	errorElement : 'div',
	errorPlacement : function(error, element) {
		var placement = $(element).data('error');
		if (placement) {
			$(placement).append(error)
		} else {
			error.insertAfter(element);
		}
	},
	ignore : []
});
//Job opening form validations here
function job_opening_form_validation() {
	return $('#job_opening_form').valid();
}
$('.select2').select2().change(function(){
	$('.errormessage').html('');
});
//button create function here
function button_create(status) {
	var access_for_create = jQuery.inArray( "Job Openings", JSON.parse(localStorage.Create) );
	var access_for_write = jQuery.inArray( "Job Openings", JSON.parse(localStorage.Write) );
	var access_for_delete = jQuery.inArray( "Job Openings", JSON.parse(localStorage.Delete) );
	var strAppend = '';
	if (status == 1) {
		if (access_for_create != -1){
			strAppend = "<button type='button' id='job_opening_add' onclick='job_opening_create()' class='btn btn-success btn-eql-wid btn-animate'>Add</button>"
		}
		strAppend += " <button type='button'id='job_opening_cancel' onclick='job_opening_clear()' class='btn btn-warning btn-animate btn-eql-wid btn-animate'>Cancel / Clear</button>"
			$('#job_opening_btn').html(strAppend);
	} else {
		if (access_for_write != -1){
			strAppend = "<button type='button' onclick='job_opening_update()' class='btn  btn-primary btn-eql-wid btn-animate '>Update</button>"
		}if (access_for_delete != -1){
			strAppend += " <button type='button' onclick='job_opening_delete()' class='btn btn-danger btn-eql-wid btn-animate '>Remove</button>"
		}
		strAppend += " <button type='button' onclick='job_opening_clear()' class='btn btn-warning btn-eql-wid btn-btn-animate'>Cancel / Clear</button>"
			$('#job_opening_btn').html(strAppend);
	}
}

/*//job publish function here
function jobPublishBtn(){
	if(table_id != 0){
		var job_title = $('#job_title').val();
		var date_opened = $('#date_opened').val();
		var contact_number = $('#contact_number').val();
		var job_status = $('#job_status option:selected').text();
		var organization = $('#organization option:selected').text();
		var organization_unit = $('#organization_unit option:selected').text();
		var salary = $('#salary').val();
		var target_date = $('#target_date').val();
		var work_experience = $('#work_experience').val();
		var no_positions = $('#no_positions').val();
		var job_short_description = $('#job_short_description').val();
		var job_location = $('#job_location').val();
		offer_content = '<ul class="list-group">';
		offer_content +='<li class="list-group-item">Title : '+job_title+'</li>';
		offer_content +='<li class="list-group-item">Organization : '+organization+'</li>';
		offer_content +='<li class="list-group-item">Organization Unit : '+organization_unit+'</li>';
		offer_content +='<li class="list-group-item">Salary : '+salary+'</li>';
		offer_content +='<li class="list-group-item">Opened : '+date_opened+'</li>';
		offer_content +='<li class="list-group-item">Closed : '+target_date+'</li>';
		offer_content +='<li class="list-group-item">Work Experience : '+work_experience+'</li>';
		offer_content +='<li class="list-group-item">Number of Positions : '+no_positions+'</li>';
		offer_content +='<li class="list-group-item">Contact Number : '+contact_number+'</li>';
		offer_content +='<li class="list-group-item">Status : '+job_status+'</li>';
		offer_content +='<li class="list-group-item">Short Description : '+job_short_description+'</li>';
		offer_content +='<li class="list-group-item">Location : '+job_location+'</li>';
		offer_content += '</ul>';
		offer_content = offer_content || "No Data Found.";
		$('#offer_content_generate_div').html(offer_content)
		var job_publish_get_ids = job_publish_id != "" ? job_publish_id.split(',') : [];
		if(job_publish_get_ids.length>0){
			$('#job_borads').multiselect('select', job_publish_get_ids);
			$('#jobPublishId').hide();
			$('#alreadyPublishId').html('Note : This Job Already Published To Join Us (NEXT Website)');
		}else{
			$('#jobPublishId').show();
			$("#job_borads").multiselect('deselectAll', false);
			$('#job_borads').multiselect('select', job_publish_get_ids);
			$('#alreadyPublishId').html('');
		}
		$('#publishModal').modal('show');
	}else{
		alert_lobibox("error", "Select Job Details.");
	}
	
}

var arrBoardSelected = [];
//job_borads values get
$('#job_borads').on('change', function(){
	arrBoardSelected = []
	var selected = $(this).find("option:selected");
	selected.each(function(){
		arrBoardSelected.push($(this).val());
	});
});

//job publish 
function jobPublish(){
	if(arrBoardSelected.length > 0){
		var job_title = $('#job_title').val();
		publishConfirmation('publishToJobs', arrBoardSelected, job_title);
	}else{
		alert_lobibox("error", "Select Job Boards.");
	}
}

//publish to server
function publishToJobs(){
	var datas = {'update_id' : table_id, 'job_publish_data' : arrBoardSelected.toString() } 
	$.ajax({
		url : '/ta_job_posting_data/',
		type : 'POST',
		timeout : 10000, 
		data:datas,
		async:false,
	}).done(function(json_data){
		data = JSON.parse(json_data);
		job_opening_datatable_function();
		alert_lobibox("success", "Your Jobs Added.Later it will be Published.");
		job_opening_clear_call();
		$('.close').trigger('click');
	});
}*/

//publish confirmation function 
function publishConfirmation(func_name, action_name, title, job_status_name) {
	var title = title == undefined ? '' :title;
	$('.popup_zindex').css({'z-index':'unset'});//search select btn zindex
	swal ({
		title: "Are you sure, you want to "+job_status_name+" publish this ("+title+") job?",
		type: "warning",
		showCancelButton: true,
		confirmButtonClass: "btn btn-success btn-eql-wid btn-animate pull-left",
		cancelButtonClass: "btn btn-danger btn-eql-wid btn-animate pull-right",
		confirmButtonText: "Yes",
		cancelButtonText: "No",
		showConfirmButton : true,
		closeOnConfirm: true,
		closeOnCancel: true
	},
	function(isConfirm) {
		if (isConfirm) {
			if (action_name) {
				window[func_name](action_name);
			} else {
				window[func_name]();
			}
		} 
	});
}

//job approve change event
$("#job_resource_config").on('change', function(){
	if(this.value != 0){
		jobApproveDatas(this.value);
	}else{
		$('#job_opening_form')[0].reset();
	}
})
	 
//publish to server
function jobApproveDatas(job_approve_id){
	$.ajax({
		url : '/ta_job_request_approve_data/',
		type : 'POST',
		timeout : 10000, 
		data : {'job_approve_id':job_approve_id},
		async : false,
	}).done(function(json_data){
		var data = JSON.parse(json_data)
		var approve_datas = data.results;
		var title = $('#job_resource_config option:selected').text() || '';
		$('#job_title').val(title)
		$('#no_positions').val(approve_datas[0].count);
		$('#job_description').val(approve_datas[0].desc);
	});
}

//search job name based on job list
var elem = document.getElementById('job_name_search');
elem.addEventListener('keypress', function(e){
  if (e.keyCode == 13) {
	  var job_name =  $('#job_name_search').val()
	  if(!job_name=='')
	  {
		  jobSearchList(job_name);
	  }else{
		  jobSearchList('');		 
		  job_opening_datatable_function();
	  }		 
  }
});


//fetch the job datas
function jobSearchList(name){
	$.ajax({
		url : "/ta_job_openings_data/",
		type : "POST",
		data : {'filter_name':name,'type':"filter"},
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		drawDatatable(data);
	});
}

//19-July-2018 || TRU || right Details Button Function
$("#right").click(function(){
	$('#left').css('display','block');
	$('#right').css('display','none');
	$('#ta_job_open_main_div1').addClass('col-md-12').removeClass('col-md-8');
	$('#ta_job_open_main_div2').removeClass('divActive');
});

//19-July-2018 || TRU || left Details Button Function
$("#left").click(function(){
	$('#left').css('display','none');
	$('#right').css('display','block');
	$('#ta_job_open_main_div1').addClass('col-md-8').removeClass('col-md-12');
	$('#ta_job_open_main_div2').addClass('divActive');
});

//26-July-2018 || TRU || Table view
$("#table_view").click(function(){
	$('#ta_job_open_main_div1').removeClass('col-md-12 col-md-8')
	$('#ta_job_open_main_div2').removeClass('col-md-4 divActive');
	$('#ta_job_open_main_div1,#ta_job_open_main_div2,#table_view').css('display','none');
	$('#ta_main_div2,#form_view').css('display','block');
	$('#ta_main_div2').addClass('col-md-12');
	
});
//26-July-2018 || TRU || Table view
$("#form_view").click(function(){
	$('#ta_main_div2,#form_view').css('display','none');
	$('#ta_job_open_main_div1,#ta_job_open_main_div2,#table_view').css('display','block');
	$('#ta_main_div2').removeClass('col-md-12');
	$('#ta_job_open_main_div1').addClass('col-md-12');
	$('#ta_job_open_main_div2').addClass('col-md-4').css('display','none');
	$('#right').trigger('click');
});

//job category change
$("#job_cat_id").change(function(){   // 1st
	let values = this.value;
	list_skills = [];
	if(values != 0){
		$.ajax({
			url : "/ta_job_category_skill_details/",
			type : "GET",
			data : {'job_category_id' : values},
			timeout : 10000,
			async:false,
		}).done( function(json_data) {
			data = JSON.parse(json_data);
			let res = data.results;
			for(let i=0; i<res.length; i++){
				list_skills.push(res[i].id)
			}
			$("#key_skills").multiselect('deselectAll', false);
			$('#key_skills').multiselect('select', list_skills);
		});
	}
});

//job description popup
function taJobDescription(){
	$('#ta_job_description_modal').modal({backdrop: 'static', keyboard: false})  
	$('#ta_job_description').summernote('reset');
	$('#ta_job_description_modal').modal('show');
}
//job description clear
function taJobDescriptionClear(){
	$('#ta_job_description').summernote('reset');
	$('.errorTxt1011').html("");
}
//validation
$('#ta_job_description').on('summernote.keyup', function(e) {
	var length = $(".note-editable").text().length
	var text = $(this).next('.note-editor').find('.note-editable').text();
	if(length > 50){   
		$('.errorTxt1011').html("");
	}else{
		$('.errorTxt1011').html("Job Description Minimum 50 and Maximum 5000 Characters");
	}
});
//apply the job description
function applyJobDescription(){
	let job_description=$('#ta_job_description').summernote('code');
	if(job_description){
		console.log("--------job_description-----",job_description);
		$('#job_description').val(job_description);
		$('.errorTxt1011').html("");
	}else{
		$('.errorTxt1011').html("Job Description Minimum 50 and Maximum 5000 Characters")
	}
}