var employee_table_id = 0,img_name = "",emp_matrix_id="";
var skills_list,education_list,experience_list,certification_list,asset_list=[];
var img_id = 0;
var data;
var emp_id_flag = true;
var gender_flag = true;
var status_change;
var hrcurrent_status = true;

$( document ).ready(function() {
	$('.upload_click_data_img').html( 'Upload Image');
	var select_emp_id = localStorage.getItem('emp_id');
	var select_emp_status = localStorage.getItem('emp_status');
	var access_for_create = jQuery.inArray( "Employee Details", JSON.parse(localStorage.Create) );
	if (access_for_create != -1){
		$('#hrms_employee_btn').html('');
		localStorage.setItem('emp_id', '0');	
		localStorage.setItem('emp_status', true);
	}
	hrcurrent_status = select_emp_status;
	employee_datatable_function();
	button_create(1);
	button_create_hr();
	if(select_emp_id != '0' && select_emp_id != null){
		display_employee_data(select_emp_id);
		}
	else{
		quick_access_btns(select_emp_id);
		}
});

//Organization data table function here
function employee_datatable_function()
{
	$('a[data-toggle="tab"]').on( 'shown.bs.tab', function (e) {
		$($.fn.dataTable.tables( true ) ).css('width', '100%');
		$($.fn.dataTable.tables( true ) ).DataTable().columns.adjust().draw();
	} ); 
	columns = [{'title':'ID'},{'title':'No'},{'title':'Name'},{'title':'Email'},{'title':'Address'}]
	$.ajax(
			{
				url : '/hrms_employee_table/',
				type : 'POST',
				timeout : 10000,
				data:{csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()},
				async:false,
			}).done(
					function(json_data)
					{
						var tble_data = JSON.parse(json_data)						
						employee_list_drowdown(tble_data.results);
						set_employee_id(tble_data.emp_id[0][0]);
						//employee toggle view
						if(employee_table_id == 0){
							var strAppend = ""
							for (var i=0;i<tble_data.results.length;i++)
							{
								if(tble_data.results[i][7] == hrcurrent_status){
										strAppend +=  '<li onclick="display_employee_data('+tble_data.results[i][0]+')"> <a href="#"><div class="userprofile"> <img src="'+image_path+tble_data.results[i][5]+'" class="img-circle"> <span style="font-size: 10px;">'+tble_data.results[i][2]+'</span> </div></a> </li>';								
								}
							}
							$('#vcarousel').html(strAppend);
							$('#vcarousel').elastislide({
								orientation: 'vertical'
							});
							$(".switcher-toggle1").click(function () {
								$("#switcher1").toggleClass("open");
							});	
						}
					});
	return false
}
//employee id trigger
function display_employee_data(emp_id)
{
	$('#hrms_employee_list').val(emp_id).trigger('change');
}

//employee list drowdown
function employee_list_drowdown(res_data){
	hrcurrent_status = hrcurrent_status == 'true' ? true : hrcurrent_status == 'false' ? false : hrcurrent_status;
	if(hrcurrent_status == true){
		$('.emp_list_icons1').addClass('animated fadeIn infinite');
		$('.emp_list_icons2').removeClass('animated fadeIn infinite');
	}else{
		$('.emp_list_icons2').addClass('animated fadeIn infinite');
		$('.emp_list_icons1').removeClass('animated fadeIn infinite');
	}
	let cstatus = hrcurrent_status == true ? 'Active' : 'In-Active';
	$('#emp_current_status').html(cstatus).addClass('emp_'+cstatus);
	strAppend = '<option value="0">--Select Employee--</option>';
	for(var i=0;i<res_data.length;i++){
		if(res_data[i][7] == hrcurrent_status){
			strAppend += '<option value='+res_data[i][0]+'>'+res_data[i][2]+'</option>';
		}
	}
	$('#hrms_employee_list').html(strAppend);
	employee_table_id = employee_table_id != undefined ? employee_table_id : 0;
}

//setting employee id
function set_employee_id(emp_id){  
    if(emp_id.length == 1){
        emp_matrix_id = "000"+emp_id;
    }else if(emp_id.length == 2){
        emp_matrix_id = "00"+emp_id;
    }else if(emp_id.length == 3){
        emp_matrix_id = "0"+emp_id;
    }else{
    	emp_matrix_id = emp_id;
    }
}

//employee list change
$("#hrms_employee_list").change(function() {
	if( $('option:selected', this).val() != 0 ){
		rowClickDataGet( $('option:selected', this).val() );
		var ref_this = ('#'+$('#tab_formwizard').find('li.active').attr('class').split(' ')[0]).toString();
		$(ref_this).DateTimePicker({
			dateFormat: "dd-MM-yyyy",
			maxDate: new Date(),
		});
	}else{
		clear_function_primary();
		button_create(1);
		employee_datatable_function();
		$('.nav-pills a[href="#pills-tab1"]').tab('show');
	}
});

//employee table click event here
$('#employee_details').on('click','tr',function(){
	if (!this.rowIndex) return; // skip first row
	emp_id = $('#employee_details').dataTable().fnGetData(this)[0];
	$('#hrms_employee_list').val(emp_id).trigger('change');
});

//quick access buttons 
function quick_access_btns(emp_current_id){
	strAppend = '<span class="quick-access" ><a href="#"  data-toggle="tooltip" data-placement="bottom" title="Leave" onclick=employee_edit('+emp_current_id+',"/hrms_leave/")><i class="nf nf-leave-request"></i></a></span>';
	strAppend += '<i></i>';
	strAppend += '<span class="quick-access" ><a href="#"  data-toggle="tooltip" data-placement="bottom" title="Attendance" onclick=employee_edit('+emp_current_id+',"/hrms_attendance/")><i class="nf nf-attendane-1"></i></a></span>';
	strAppend += '<i></i>';
	strAppend += '<span class="quick-access" ><a href="#"  data-toggle="tooltip" data-placement="bottom" title="Asset" onclick=employee_edit('+emp_current_id+',"/asset_list/")><i class="nf nf-assess-behavioral-completencies"></i></a></span>';
	strAppend += '<i></i>';
	strAppend += '<span class="quick-access" ><a href="#"  data-toggle="tooltip" data-placement="bottom" title="Report" onclick=employee_edit('+emp_current_id+',"/hrms_reports/")><i class="nf nf-hr-report"></i></a></span>';
	strAppend += '<i></i>';
	strAppend += '<span class="quick-access" ><a href="#"  data-toggle="tooltip" data-placement="bottom" data-placement="top" title="Employee Deactivation" onclick=employee_edit('+emp_current_id+',"/em_employees/")><i class="nf nf-customer"></i></a></span>';
	$('#employee_quick_access').html(strAppend);
	$('[data-toggle="tooltip"]').tooltip();   
}
//employee edit
function employee_edit(emp_id,url){
	localStorage.setItem('emp_id', emp_id);
	window.location = url;
}

//row click data get function 
function rowClickDataGet(emp_id){
	if(emp_id != undefined ){
	button_create(0);
	employee_table_id = emp_id;
	quick_access_btns(emp_id);
	$.ajax({
				url : '/hrms_employee_table_click/',
				type : 'POST',
				timeout : 10000,
				data:{"table_id":employee_table_id,csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()},
				async:false,
			}).done(
					function(json_data)
					{
						data = JSON.parse(json_data)
												
						gender_flag = true;
						clear_function_skills();
						clear_function_education();
						clear_function_experience();
						clear_function_certification();
						skill_type = data.skill_type;
						skillTypeGenerate(skill_type); //skill type generate function call					
						//Attachment values
						img_name = data.results[0].img_name;
						img_id = data.results[0].img_id;
						var d = new Date();
						$('.thumbnail').html("<img src='"+image_path+img_name+"?ver="+d.getTime()+"' alt='Imgae' />").trigger('click');
						$('.upload_click_data_img').html( 'Change Upload Image');
						$('#profile_image').html("<img class='img-circle img-inline pic_ina' style='border-radius: 50%;width: 35px;height: 35px;border-radius: 50px;' src='"+image_path+img_name+"?ver="+d.getTime()+"' data-toggle='tooltip' data-placement='bottom' data-placement='top'  title='"+data.results[0].name+' '+data.results[0].last_name+"' />");
						$('#profile_name').html(data.results[0].emp_name);
						$('[data-toggle="tooltip"]').tooltip();   
						//primary info
						$('#employee_name').val(data.results[0].name);
						gender_val = data.results[0].employee_gender
						title = data.results[0].title
						country_val = data.results[0].country_of_birth
						award_id = data.results[0].award_id
						
											
						$('#date_of_birth').val(data.results[0].date_of_birth);
						$('#place_of_birth').val(data.results[0].place_of_birth);
						$('#working_address').val(data.results[0].working_address);
						$('#work_mobile').val(data.results[0].work_mobile);
						$('#permanent_address').val(data.results[0].permanent_address);
						$('#work_location').val(data.results[0].work_location);
						$('#work_phone').val(data.results[0].work_phone);
						$('#email').val(data.results[0].work_email);
						$('#date_of_joining').val(data.results[0].date_of_joining);	
						$('#short_name').val(data.results[0].short_name);					
						$('#emergency_contact_no').val(data.results[0].emergency_contact_no).trigger('change');
						$('#middle_name').val(data.results[0].middle_name)
						$('#last_name').val(data.results[0].last_name)
						$('#emp_file_no').val(data.results[0].file_no)
						$('#uan').val(data.results[0].system_no)
						
						var org_id = data.results[0].org_id_id;
						var role_id = data.results[0].role_id_id;
						var reporting_officer_id = data.results[0].reporting_officer_id;
						var org_unit_id = data.results[0].org_unit_id_id;
						var team_id = data.results[0].team_name_id;
						var rel_user_id =  data.results[0].related_user_id_id;
						var id_emp = data.results[0].employee_id;
																																			
						//personal info
						$('#emp_martial_status').val(data.results[0].marital_status).trigger('change');
						$('#no_of_children').val(data.results[0].no_of_children);
						$('#citizenship_no').val(data.results[0].citizenship_no);
						$('#license_no').val(data.results[0].license_number);
						$('#spouse_name').val(data.results[0].spouse_name);
						$('#spouse_contact_no').val(data.results[0].spouse_telephone);
						$('#pan_no').val(data.results[0].pan_no);
						$('#passport_no').val(data.results[0].passport_no);
						$('#spouse_employer').val(data.results[0].spouse_employer);
						$('#spouse_dob').val(data.results[0].spouse_date_of_birth);
						$('#aadhaar_no').val(data.results[0].aadhar_no);
						$('#provident_fund_uan_no').val(data.results[0].provident_fund_no);
						$('#mother_name').val(data.results[0].mother_name);						
						$('#mother_dob').val(data.results[0].mother_date_of_birth);
						$('#father_name').val(data.results[0].father_name);	
						$('#father_dob').val(data.results[0].father_date_of_birth);	
						$('#no_of_dependents').val(data.results[0].no_of_dependents);	
						$('#blood_group').val(data.results[0].blood_group).trigger('change');
					    $('#license_number').val(data.results[0].license_number);
					    $('#personal_email_id').val(data.results[0].personal_email_id);
						if(data.results[0].physically_challenged == true){
							$('#physically_challenged').prop('checked',true)
							$('#disability_category').attr("disabled", false); 
							$('#disability_percentage').attr("disabled", false); 
							
							$('#disability_category').val(data.results[0].disability_category).trigger('change');
							$('#disability_percentage').val(data.results[0].disability_percentage).trigger('change');							
						}else{
							$('#physically_challenged').prop('checked',false);
							$('#disability_category').val('0').trigger('change');
							$('#disability_category').attr("disabled", true);
							
							$('#disability_percentage').val('0').trigger('change');
							$('#disability_percentage').attr("disabled", true);
						}	
					    
					    if(data.results[0].is_spouse_same_org == true){
					    	$('#spouse_same_org').prop('checked',true);
					    }else{
					    	$('#spouse_same_org').prop('checked',false)
					    }
					    						
						if(data.results[0].is_employee_active == true){
							$('#employee_active').prop('checked',true)
						}else {
							$('#employee_active').prop('checked',false)
						}
						
						if(data.results[0].is_id_card_provided == true){
							$('#id_card_status').prop('checked',true)
						}else {
							$('#id_card_status').prop('checked',false)
						}
									
						// HR Settings
						$('#date_of_confirmation').val(data.results[0].date_of_confirmation);
						$('#date_of_resignation').val(data.results[0].date_of_resignation);
						$('#emp_type_id').val(data.results[0].type_id_id).trigger('change');	
						$('#date_of_relieving').val(data.results[0].date_of_releaving);
						$('#work_experience').val(data.results[0].total_work_experience);	
						$('#attendance_options').val(data.results[0].attendance_options);
						let type = data.results[0].shift_type_id;
						let type_lenth = $('select#shift_type option').length
						let type_id = type_lenth >1 ? type : '0';
						$('#shift_type').val(type_id).trigger('change');
						//Employee Skills
						skills_list = data.skills;
						column_skills = [{'title':'Id'},{'title':'No'},{'title':'Skill Name'},{'title':'Experience'},{'title':'Rating'},{'title':'Skill Type'},{'title':'Upload Details'},{'title':'Upload ID'},{'title':'skill_type_id'}]
						$('#skills_table').show();
						plaindatatable('employee_skill_details',data.skills, column_skills,[0,7,8]);    
						
						//Employee Education
						education_list = data.education;   
						var column_education = [{'title':'Id'},{'title':'No'},{'title':'Board/University'},{'title':'Specialization/Major '},{'title':'Graduated Year'},{'title':'Institute/School'},{'title':'Duration'},{'title':'Grade'},{'title':'Percentage'},{'title':'Degree'},
						                        {'title':'Certificate Verification'},{'title':'Upload Details'},{'title':'Upload ID'}];
						$('#education_table').show();
						change_education_display_status();
						plaindatatable('employee_education_details',data.education, column_education,[0,11]);        

						//Employee Experience
						experience_list = data.experience
						var column_experience = [{'title':'Id'},{'title':'No'},{'title':'Company Name'},{'title':'Designation'},{'title':'Start Date'},{'title':'End Date'},
						                         {'title':'Certificate Verification'},{'title':'Employee ID'},{'title':'Reason for Relieving'},{'title':'References'},{'title':'Upload Details'},{'title':'Upload ID'}];
						$('#experience_table').show();
						change_experience_display_status();
						plaindatatable('employee_experience_details',data.experience, column_experience,[0,10]);
						
						//Employee Certification
						certification_list = data.certification
						var column_certificate = [{'title':'Id'},{'title':'No'},{'title':'Name'},{'title':'Certification Number'},{'title':'Issued By'},{'title':'Start Date'},{'title':'End Date'},
						                          {'title':'Certificate Verification'},{'title':'Upload Details'},{'title':'Upload ID'}];
						$('#certification_table').show();
						change_certificate_display_status();
						plaindatatable('employee_certification_details',data.certification, column_certificate,[0,9]);
												
						//Employee Assets
						asset_list = data.assets
						var asset_columns = [{'title':'Id'},{'title':'No'},{'title':'Asset Type'},{'title':'Asset ID'},{'title':'Given Date'},{'title':'Asset Type ID'},{'title':'Asset Ref ID'}];
						$('#asset_table').show();
						plaindatatable('employee_asset_details',data.assets, asset_columns,[0,5,6]);
																		
						if(org_id=="0"){
							$('#organization_id').val('0').trigger('change');
						}else {
							$('#organization_id').val(org_id).trigger('change');
							load_deparment_details(org_id);							
						}
						
						if(org_unit_id=="0"){
							$('#org_unit_id').val('0').trigger('change');
						}else {
							$('#org_unit_id').val(org_unit_id).trigger('change');
						}	
						
						if(role_id=="0"){
							$('#employee_role_details').val('0').trigger('change');
						}else{
							$('#employee_role_details').val(role_id).trigger('change');
						}
						
						if(reporting_officer_id=="0"){
							$('#reporting_officer').val('0').trigger('change');
						}else{
							$('#reporting_officer').val(reporting_officer_id).trigger('change');
						}	
															
						$('#gender').val(gender_val).trigger('change');
						$('#title').val(title).trigger('change');
						$('#country_of_birth').val(country_val).trigger('change');
						$('#team_id').val(team_id).trigger('change');
						$('#related_user').val(rel_user_id).trigger('change');		
						$('#employee_id').val(id_emp)
												
						dynamicButtonDisplay();						
					});
}else{
	console.log("-----Invalid Employee Id-------");
}
	}

//skill type generate
function skillTypeGenerate(skill_type){
	console.log("====skill_type==>",skill_type)
	let skill_type_str = '<option value="0">--Select Shift Type--</option>';
	if(skill_type.length > 0){
		for(let i=0; i<skill_type.length; i++){
			skill_type_str += '<option value="'+skill_type[i].id+'">'+skill_type[i].refitems_name+'</option>';
		}
	}
	$('#shift_type').html(skill_type_str);
	$('#shift_type').val('0').trigger('change');
}

function dynamicButtonDisplay()
{
		if(skills_list.length==0)
		{
			$('.skill_update').hide()
			$('.skill_add').show()	
			$('.skill_clear').show()
		}		
		if(education_list.length==0)
		{
			$('.edu_update').hide()
			$('.edu_add').show()
			$('.edu_clear').show()
		}		
		if(experience_list.length==0)
		{
			$('.exp_update').hide()
			$('.exp_add').show()
			$('.exp_clear').show()
		}		
		if(certification_list.length==0)
		{
			$('.certificate_update').hide()
			$('.certificate_add').show()
			$('.certificate_clear').show()
		}
		if(asset_list.length==0)
		{
			$('.asset_update').hide()
			$('.asset_add').show()
			$('.asset_clear').show()
		}
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


$('.temp_table').on('click','tr',function(){
	
});


//active employee click
function hrEmployeeActive(){
	localStorage.setItem('emp_id', 0);
	localStorage.setItem('emp_status', true);
	location.reload();
}

//inactive employee click
function hrEmployeeInActive(){
	localStorage.setItem('emp_id', 0);
	localStorage.setItem('emp_status', false);
	location.reload();
}