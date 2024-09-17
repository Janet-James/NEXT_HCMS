var global_employee_id=5;
$(document).ready(function(){
	employee_details_click();

});

$("#demography").click(function(){
	$('#contact_details').show()
	$('#nationality_details').show()
	$('#personal_details').hide()
	$('#idendification_details').hide()
	$('#education_details').hide()
	$('#skill_details').hide()
	$('#certification_details').hide()
	$('#experience_details').hide()
	$('#assessment_details').hide()
	$('#employee_objective_view').hide()
	return false
});
$("#emp_personal_details").click(function(){
	$('#contact_details').hide()
	$('#nationality_details').hide()
	$('#personal_details').show()
	$('#idendification_details').show()
	$('#education_details').hide()
	$('#skill_details').hide()
	$('#certification_details').hide()
	$('#experience_details').hide()
	$('#assessment_details').hide()

	return false
});

$("#emp_education_details").click(function(){

	education_details_click();
	$('#contact_details').hide();
	$('#nationality_details').hide();
	$('#personal_details').hide();
	$('#idendification_details').hide();
	$('#education_details').show();
	$('#skill_details').hide();
	$('#certification_details').hide();
	$('#experience_details').hide();
	$('#assessment_details').hide()
	$('#employee_objective_view').hide()
	return false;
});

$("#skills_details").click(function(){
	skill_details_click();
	$('#contact_details').hide();
	$('#nationality_details').hide();
	$('#personal_details').hide();
	$('#idendification_details').hide();
	$('#education_details').hide();
	$('#skill_details').show();
	$('#certification_details').hide();
	$('#experience_details').hide();
	$('#assessment_details').hide()
	$('#employee_objective_view').hide()
	return false;
});

$("#profession_experience_details").click(function(){

	experience_details_click();
	$('#contact_details').hide();
	$('#nationality_details').hide();
	$('#personal_details').hide();
	$('#idendification_details').hide();
	$('#education_details').hide();
	$('#skill_details').hide();
	$('#certification_details').hide();
	$('#experience_details').show();		
	$('#assessment_details').hide()
	$('#employee_objective_view').hide()
	return false;
});

$("#certifications_details").click(function(){
	certfication_details_click();
	$('#contact_details').hide();
	$('#nationality_details').hide();
	$('#personal_details').hide();
	$('#idendification_details').hide();
	$('#education_details').hide();
	$('#skill_details').hide();
	$('#certification_details').show();
	$('#experience_details').hide();
	$('#assessment_details').hide()
	$('#employee_objective_view').hide()
	return false;
});

$("#emp_assessment_info").click(function(){
	$('#contact_details').hide()
	$('#nationality_details').hide()
	$('#personal_details').hide()
	$('#idendification_details').hide()
	$('#education_details').hide()
	$('#skill_details').hide()
	$('#certification_details').hide()
	$('#experience_details').hide()
	$('#assessment_details').show()
	$('#employee_objective_view').hide()

	assessment_detail_view();
	return false
});

$("#emp_objectives").click(function(){
	$('#contact_details').hide()
	$('#nationality_details').hide()
	$('#personal_details').hide()
	$('#idendification_details').hide()
	$('#education_details').hide()
	$('#skill_details').hide()
	$('#certification_details').hide()
	$('#experience_details').hide()
	$('#assessment_details').hide()
	$('#employee_objective_view').show()
	objective_detail_view();
	return false
});


function employee_details_click(){
	employee_id = global_employee_id;
	if(employee_id){
		$.ajax({
			type:"GET",
			url: "/employee_details/",
			data : {'employee_id':employee_id},
			success: function (json_data) {
				var data = JSON.parse(json_data);
				base_employee_div_call(data);
				$('#contact_details').show();
				$('#nationality_details').show();
				$('#personal_details').hide();
				$('#idendification_details').hide();
				$('#education_details').hide();
				$('#skill_details').hide();
				$('#certification_details').hide();
				$('#experience_details').hide();
			}
		})
	}
}

function education_details_click(){
	employee_id = global_employee_id;
	if(employee_id){
		$.ajax({
			type:"GET",
			url: "/education_details/",
			data : {'employee_id':employee_id},
			success: function (json_data) {
				var data = JSON.parse(json_data);
				education_details(data.education_result);
			}
		})
	}
}

function skill_details_click(){
	employee_id = global_employee_id;
	if(employee_id){
		$.ajax({
			type:"GET",
			url: "/skill_details/",
			data : {'employee_id':employee_id},
			success: function (json_data) {
				var data = JSON.parse(json_data);
				skill_details(data.skills);
			}
		})
	}
}

function experience_details_click(){
	employee_id = global_employee_id;
	if(employee_id){
		$.ajax({
			type:"GET",
			url: "/experience_details/",
			data : {'employee_id':employee_id},
			success: function (json_data) {
				var data = JSON.parse(json_data);
				experience_details(data.experience);
			}
		})
	}
}

function certfication_details_click(){
	employee_id = global_employee_id;
	if(employee_id){
		$.ajax({
			type:"GET",
			url: "/certfication_details/",
			data : {'employee_id':employee_id},
			success: function (json_data) {
				var data = JSON.parse(json_data);
				certification_details(data.certification);
			}
		})
	}
}


function education_details(data){
	var edu_columns = [{'title':'No'},{'title':'University Name'},{'title':'Pass Out Year'},{'title':'Campus Name'},{'title':'Duration'},{'title':'CGPA'},{'title':'Percentage'},{'title':'Course Name'},{'title':'Certificate Verification'}];
	var education_list=[]
	for(var i=0;i<data.length;i++){
		education_list.push([data[i].row_number,data[i].university,data[i].year_of_passed_out,data[i].institution_name,data[i].duration,data[i].cgpa,data[i].percentage,data[i].course_name,data[i].certificate_status])
	}
	plaindatatable('employee_education_details',education_list, edu_columns);	
}

function skill_details(data){
	var skill_columns = [{'title':'No'},{'title':'Description'},{'title':'Experience'},{'title':'Rating'}];
	var skill_details=[]
	for(var i=0;i<data.length;i++){
		skill_details.push([i+1,data[i].skill_name,data[i].experience,data[i].rating])
	}
	plaindatatable('skillDatatable',skill_details, skill_columns);	
}

function experience_details(data){
	var experience_columns = [{'title':'No'},{'title':'Employer'},{'title':'Position'},{'title':'Start Date'},{'title':'End Date'},{'title':'Certificate Verification'}];
	var experience_details=[]
	for(var i=0;i<data.length;i++){
		experience_details.push([i+1,data[i].employer,data[i].position,data[i].experience_start_date,data[i].experience_end_date,data[i].experience_certificate_status])
	}
	plaindatatable('experienceDatatable',experience_details, experience_columns);	
}

function certification_details(data){
	var certification_columns = [{'title':'No'},{'title':'Description'},{'title':'Certification No'},{'title':'Issued By'},{'title':'Start Date'},{'title':'End Date'},{'title':'Certificate Verification'}];
	var certification_details=[]
	for(var i=0;i<data.length;i++){
		certification_details.push([i+1,data[i].description,data[i].certification_no,data[i].issued_by,data[i].cerification_start_date,data[i].cerification_end_date,data[i].certification_status])
	}
	plaindatatable('certificationDatatable',certification_details, certification_columns);	
}

var base_employee_div=''
	function base_employee_div_call(data){
	base_employee_div +='<div class="row">\
		<div class="col-md-6">\
		<p><img src="http://tst-hcms.nexttechnosolutions.int/media/user_profile/'+data.status[0].image_url+'" style="width: 113px;height: 101px;"></p>\
		<p>'+data.status[0].employee_id+'</p> '
		if(data.status[0].work_email)
			{
			base_employee_div +='<p><i class="fa fa-email"></i> '+data.status[0].work_email+'</p>'
			}
			base_employee_div +='<p><i class="fa fa-phone"></i> '+data.status[0].work_mobile+'</p></div>\
		<div class="col-md-5">\
		<p>'+data.status[0].emp_name+'</p>\
		<p>'+data.status[0].role_title+'</p>\
		<p>'+data.status[0].ogr_unit+','+data.status[0].org+'</p></div>\
		<div class="col-md-1">\
		<i class="nf nf-blood-group"></i>\
		<i class="nf nf-star"></i>\
		</div>\
		</div>\
		<div id="contact_details">\
		<h3 class="form-section">Contact Details</h3>\
		<div class="row">\
		<div class="col-md-6">\
		<div class="form-group">\
		<label class="control-label col-md-3">present Address:</label>\
		<div class="col-md-9">\
		<p class="form-control-static">'+data.status[0].permanent_address+'</p>\
		</div>\
		</div>\
		</div>\
		</div>\
		<div class="row">\
		<div class="col-md-6">\
		<div class="form-group">\
		<label class="control-label col-md-3">permanent Address:</label>\
		<div class="col-md-9">\
		<p class="form-control-static">'+data.status[0].permanent_address+'</p>\
		</div>\
		</div>\
		</div>\
		</div>\
		<div class="row">\
		<div class="col-md-6">\
		<div class="form-group">\
		<label class="control-label col-md-3">Phone.No:</label>\
		<div class="col-md-9">\
		<p class="form-control-static">'+data.status[0].work_mobile+'</p>\
		</div>\
		</div>\
		</div>\
		</div>\
		</div>\
		<div id="nationality_details">\
		<h3 class="form-section">Nationality</h3>\
		<div class="row">\
		<div class="col-md-6">\
		<div class="form-group">\
		<label class="control-label col-md-3">Place of Birth:</label>\
		<div class="col-md-9">\
		<p class="form-control-static">'+data.status[0].place_of_birth+'</p>\
		</div>\
		</div>\
		</div>\
		</div>\
		<div class="row">\
		<div class="col-md-6">\
		<div class="form-group">\
		<label class="control-label col-md-3">Country of Birth:</label>\
		<div class="col-md-9">\
		<p class="form-control-static">'+data.status[0].country_of_birth+'</p>\
		</div>\
		</div>\
		</div>\
		</div>\
		</div>\
		<div id="personal_details">\
		<h3 class="form-section">Personal Details</h3>\
		<div class="row">\
		<div class="col-md-6">\
		<div class="form-group">\
		<label class="control-label col-md-3">Marriage Details:</label>\
		<div class="col-md-9">\
		<p class="form-control-static">'+data.status[0].marital_info+'</p>\
		</div>\
		</div>\
		</div>\
		</div>\
		<div class="row">\
		<div class="col-md-6">\
		<div class="form-group">\
		<label class="control-label col-md-3">Dependence:</label>\
		<div class="col-md-9">\
		<p class="form-control-static">'+data.status[0].no_of_dependents+'</p>\
		</div>\
		</div>\
		</div>\
		</div>\
		<div class="row">\
		<div class="col-md-6">\
		<div class="form-group">\
		<label class="control-label col-md-3">Spouse Information:</label>\
		<div class="col-md-9">\
		<p class="form-control-static">'+data.status[0].spouse_info+'</p>\
		</div>\
		</div>\
		</div>\
		</div>\
		<div class="row">\
		<div class="col-md-6">\
		<div class="form-group">\
		<label class="control-label col-md-3">Spouse Phone.no:</label>\
		<div class="col-md-9">\
		<p class="form-control-static">'+data.status[0].spouse_telephone+'</p>\
		</div>\
		</div>\
		</div>\
		</div>\
		<div class="row">\
		<div class="col-md-6">\
		<div class="form-group">\
		<label class="control-label col-md-3">Father Information:</label>\
		<div class="col-md-9">\
		<p class="form-control-static">'+data.status[0].father_info+'</p>\
		</div>\
		</div>\
		</div>\
		</div>\
		<div class="row">\
		<div class="col-md-6">\
		<div class="form-group">\
		<label class="control-label col-md-3">Mother Information:</label>\
		<div class="col-md-9">\
		<p class="form-control-static">'+data.status[0].mother_info+'</p>\
		</div>\
		</div>\
		</div>\
		</div>\
		<div class="row">\
		<div class="col-md-6">\
		<div class="form-group">\
		<label class="control-label col-md-3">Displanaria:</label>\
		<div class="col-md-9">\
		<p class="form-control-static">'+data.status[0].displanaria+'</p>\
		</div>\
		</div>\
		</div>\
		</div>\
		</div>\
		<div id="idendification_details">\
		<h3 class="form-section">Identification</h3>\
		<div class="row">\
		<div class="col-md-6">\
		<div class="form-group">\
		<label class="control-label col-md-3">National ID:</label>\
		<div class="col-md-9">\
		<p class="form-control-static">'+data.status[0].citizenship_no+'</p>\
		</div>\
		</div>\
		</div>\
		</div>\
		<div class="row">\
		<div class="col-md-6">\
		<div class="form-group">\
		<label class="control-label col-md-3">TIN:</label>\
		<div class="col-md-9">\
		<p class="form-control-static">'+data.status[0].citizenship_no+'</p>\
		</div>\
		</div>\
		</div>\
		</div>\
		<div class="row">\
		<div class="col-md-6">\
		<div class="form-group">\
		<label class="control-label col-md-3">PF Number:</label>\
		<div class="col-md-9">\
		<p class="form-control-static">'+data.status[0].provident_fund_no+'</p>\
		</div>\
		</div>\
		</div>\
		</div>\
		</div>\
		<div id="education_details">\
		<h3 class="form-section">Education Detail</h3>\
		<table\
		class="table table-striped table-bordered table-hover"\
		id="employee_education_details">\
		</table>\
		</div>'
		$("#base_employee_id").append(base_employee_div);
}

function assessment_detail_view()
{
	$.ajax({
		type:"Post",
		url: "/employee_assessment_info/",
		data : {'employee_id':global_employee_id},
		success: function (json_data) {
			data=json_data.assessment_info
			if (data)
			{
				$("#assessment_info_view").empty();
				var assessment_info_div=''
					for (var i=0; i<data.length; i++){
						assessment_info_div +='<div class="panel panel-default">\
							<div class="panel-heading">\
							<h4 class="panel-title"> <a class="accordion-toggle accordion-toggle-styled collapsed" data-toggle="collapse" data-parent="#assess_accord" href="#assess'+i+'">'+data[i].kpi_name+'</a></h4>\
							</div>\
							<div id="assess'+i+'" class="panel-collapse collapse"><div class="panel-body">'
							if(data[i].assessment_detail.length!=0)
							{
								for(var j=0;j<data[i].assessment_detail.length;j++)
								{
									assessment_info_div +='<div class="inbox-content">\
										<div class="col-md-9 scroll">\
										<table class="table table-striped table-advance table-hover">\
										<tbody>\
										<tr class="unread" data-messageid="1">\
										<td class="inbox-small-cells">\
										'+data[i].assessment_detail[j].assessor_image+'\
										</td>\
										<td class="view-message hidden-xs">'+data[i].assessment_detail[j].name+'</td>\
										<td class="view-message ">'+data[i].assessment_detail[j].assessment_process_remark+'</td>\
										<td class="view-message inbox-small-cells">\
										<span class="label label-success fullWidth">'+data[i].assessment_detail[j].custom_rating_value+'</span>\
										</td>\
										<td class="view-message text-right">'+data[i].assessment_detail[j].custom_rating_name+'</td>\
										<td>\
										<div class="CssArrow"></div>\
										</td>\
										</tr>\
										</tbody>\
										</table>\
										</div>\
										</div>'
								}}
							else
							{
								assessment_info_div +='<p>Not Yet Assessed</p>'
							}
						assessment_info_div +='</div>\
							</div>\
							</div>'
					}
				$("#assessment_info_view").append(assessment_info_div)
			}
		}
	});
}

function objective_detail_view(){
	$.ajax({
		type:"Post",
		url: "/employee_objective_info/",
		data : {'employee_id':global_employee_id},
		success: function (json_data) {
			data=json_data.objective_detail
			console.log(data)
			if(jQuery.isEmptyObject(data)!=true)
			{
				$('.nodata_objective').hide()
				var objective_columns = [{'title':'No'},{'title':'Description'},{'title':'Expected'},{'title':'Units'},{'title':'Measurement Criteria'}];
				if(data.cascaded_objective.length!=undefined)
					{
				var cascaded_objective=[]
				for(var i=0;i<data.cascaded_objective.length;i++){
					cascaded_objective.push([i+1,data.cascaded_objective[i].kpi_description,data.cascaded_objective[i].expected,data.cascaded_objective[i].target_type,data.cascaded_objective[i].measurement_criteria])
				}
				plaindatatable('cascaded_objective_table',cascaded_objective, objective_columns);
					}
				else
					{
					$("#nodata_cascade_obj").show()
					}
				if(data.role_objective.length!=undefined)
					{
				var role_objective=[]
				for(var i=0;i<data.role_objective.length;i++){
					role_objective.push([i+1,data.role_objective[i].kpi_description,data.role_objective[i].expected,data.role_objective[i].target_type,data.role_objective[i].measurement_criteria])
				}
				plaindatatable('role_objective_table',role_objective, objective_columns);
					}
				else
					{
					$("#nodata_role_obj").show()
					}
				if(data.employee_objective.length!=undefined)
				{
				var employee_objective=[]
				for(var i=0;i<data.employee_objective.length;i++){
					employee_objective.push([i+1,data.employee_objective[i].kpi_description,data.employee_objective[i].expected,data.employee_objective[i].target_type,data.employee_objective[i].measurement_criteria])
				}
				plaindatatable('individual_objective_table',employee_objective, objective_columns);}
				else
					{
					$("#nodata_individual_obj").show();
					}
			}
			else
				{
				$('.nodata_objective').show()
				}
		}
	});
}
