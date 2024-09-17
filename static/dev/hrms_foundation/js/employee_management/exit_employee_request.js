var get_emp_id = 0;
var hr_email = '';
var employee_list_values = [];
var employee_pro_list = [];
var datas = getFormValues("#employee_exit_btn_form");
var	csrf_data = datas.csrfmiddlewaretoken;
//offer details load area
$(document).ready(function(){
	let eog_btn_status = button_generate(1);
	let eog_list = employeeOfferList();
	$('[data-toggle="tooltip"]').tooltip();
});

//button create function here
function button_generate(status){
	let strAppend = '';
	let access_for_create = jQuery.inArray( "Exit Employee", JSON.parse(localStorage.Create) );
	if(status == 1){
		strAppend += "<button type='button' onclick='generateExpertise()' class='btn-animate btn-eql-wid btn btn-success'>Add</button>"
	}else{
		strAppend += "<button type='button' onclick='generateExpertise()' class='btn-animate btn-eql-wid btn btn-success'>Update</button>"
	}
	strAppend += " <button type='button' onclick='clearExpertise()' class='btn-animate btn-eql-wid  btn btn-warning '>Cancel / Clear</button>"
	$('#employee_exit_btn').html(strAppend);
}

//employee offer list
function employeeOfferList(){
	let res_data = getEmployeeList('all','');
	if( res_data.length > 0 ){
		dynamicEmployeeList(res_data,'employee_exit_details');
		$('#emp_name_filter').show();
	}else{
		$('#employee_exit_details').html('<div class="col-md-12"><h3 style="text-align: center;color:#e73d4a;">No data available.</h3></div>');
		$('#emp_name_filter').hide();
	}
}

//search functionality
$('#emp_name').keypress(function(event) {
	    var keycode = event.keyCode || event.which;
	    if(keycode == '13') {
	    	let search_name = $('#emp_name').val();
	    	let search_data = getEmployeeList('name',search_name); 
	    	if(search_data.length > 0){
	    		dynamicEmployeeList(search_data,'employee_exit_details');
	    	}else{
	    		$('#employee_exit_details').html('<div class="col-md-12"><h3 style="text-align: center;color:#e73d4a;">No data found.</h3></div>');
	    	}
	    }
	});

//Employee List Append in function here
function dynamicEmployeeList(data,id){
	let empList = '';
	let count = 0; 
	for(let i=0; i<data.length; i++){
		let status = data[i].status == 'approved' ? 'Approved' : 'Pending'
		empList += '<div class="col-lg-6 col-md-8 col-sm-12 row-eq-height exit_employee_list_view" id="'+data[i].emp_id+'" onclick="employeeSelect(\''+data[i].id+'\',\''+data[i].emp_id+'\',\''+data[i].hremail+'\')">'; 
		empList += '<div class="EmployeeCard equhight employeeList" style="height: 220px;overflow: auto;"> ';
		empList += '<div class="col-sm-3 eoi_align_img" >';
		empList += '<div class="col-sm-12"><div class="ep_img">';
		empList += '<img alt="not found" class="" src="'+image_path+data[i].profile+'">';
		empList += '</div></div>'
		empList += '</div>'
		empList += '<div class="col-sm-8 eoi_align_txt">';
		empList += '<p class="ep_name" data-toggle="tooltip" data-placement="left" title="Request Company" >'+data[i].hrcompany+'</p>';
		empList += '<p class="ep_designation" data-toggle="tooltip" data-placement="left" title="Request HR" >'+data[i].hrname+'</p>';
		empList += '<p class="ep_email" data-toggle="tooltip" data-placement="left" title="Request HR Email" >'+data[i].hremail+'</p>';

		empList += '<p class="ep_name" data-toggle="tooltip" data-placement="left" title="Ex-Employee Name" >'+data[i].name+'</p>';
		empList += '<p class="ep_email" data-toggle="tooltip" data-placement="left" title="Ex-Employee Company Email" >'+data[i].work_email+'</p>';
		empList += '<p class="ep_designation" data-toggle="tooltip" data-placement="left" title="Ex-Employee Role" >'+data[i].role_title+'</p>';
		empList += '<p class="ep_team" data-toggle="tooltip" data-placement="left" title="Ex-Employee Team Name" >'+data[i].tname+'</p>';
		empList += '<p class="ep_join" data-toggle="tooltip" data-placement="left" title="Ex-Employee Access Status" >'+status+'</p>';
		//empList += '<p>Joined Date : <b>'+data[i].jd+'</b>&nbsp&nbsp&nbsp Generated Date : <b>'+data[i].og+'</b></p>';
		empList += '</div>'
		empList += '<div class="col-sm-1">';
		empList += '</div>'	
		empList += '</div>'
		empList += '</div>'
	}
	$('#'+id).html(empList);
}

//Employee Select
function employeeSelect(id,empid,hremail){
	get_emp_id = empid;
	hr_email = hremail;
	exitProjectDetailsApproved(empid)
	let data = getEmployeeList('id',id);
	clearExpertise();
	button_generate(2);
	let status = data[0].status == 'pending' ? 2 : 1
		if(status == 1){
			$('#exit_employee_project_details_approved').show();
		}else{
			$('#exit_employee_project_details_approved').hide();
		}
	$('#status').val(status).trigger("change");
	employee_list_values = [data[0].id]
	$("#employee_list").val(employee_list_values).multiselect('rebuild');
}


//get data function
function getEmployeeList(status,val){
	let res_data = []
	$.ajax({
		url : "/exit_employee_reqeust_details/",
		type : "GET",
		data : {'status':status,'val':val},
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		let res = JSON.parse(json_data);
		res_data = res.results;
		console.log(res_data)
	});
	return res_data
}

//employee on change values get
$('#employee_list').on('change', function(){
	$('.errorTxt0').html('');
    var selected = $(this).find("option:selected");
    employee_list_values = [];
    selected.each(function(){
    	employee_list_values.push(parseInt($(this).val()));
    });
    if(employee_list_values.length > 1){
        $('#exit_employee_project_details_approved').hide();
    }else{
        $('#exit_employee_project_details_approved').show();
    }
});

//generate function here
function generateExpertise(){
	let form_status = employee_meet_expertise_form_validation();
	console.log("-----------------------------exit_emp_projects----------------------------",employee_pro_list)
	if(form_status){
		let status_val = $('#status').val();
		let status = status_val == 1 ? 'approved' : 'pending'
		if(status == 'approved'){
			$.ajax({
				url : "/exit_employee_reqeust_details_operation/",
				type : "POST",
				data : { 'get_emp_id':get_emp_id,'hr_email':hr_email,'employee_id':employee_list_values.toString(),'employee_pro_list':employee_pro_list.toString(),'status':status,csrfmiddlewaretoken:csrf_data },
				timeout : 10000,
				async : false,
			}).done( function(json_data) {
				let res = JSON.parse(json_data);
				let res_data = res.results;
				if( res_data == 'NTE-E02'){
					alert_lobibox("success", "Ex-Employee Profile Details Approved (Level-1) Successfully. Kindly Approved Project/Product Details (Level-2)");
					employeeOfferList();
				}else if( res_data == 'NTE-E03'){
					alert_lobibox("success", "Ex-Employee Project/Product Details Approved (Level-2) Successfully.");
					employeeOfferList();
				}else{
					alert_lobibox("error", "Ex-Employee Approved Error.");
				}
				clearExpertise();
			});
		}else{
			alert_lobibox("error", "Select Approved in Ex-Employee Status");
		}
	}else{
		if(employee_list_values.length ==0){
			$('.errorTxt0').html('Select Atleast One Ex-Employee');
		}
	}
}

//clear function here
function clearExpertise(){
	button_generate(1);
	$("#employee_list").multiselect("deselectAll", false);
	$("#employee_list").multiselect('rebuild');
	employee_list_values = [];
	employee_pro_list = [];
	$('.errormessage').html('');
	$('#status').val("0").trigger("change");
	$('#exit_employee_project_details_approved').hide();
}

//jquery leave validation
jQuery.validator.addMethod('valueNotEquals', function(value) {
	return (value != '0');
}, "status required");


//jquery attendance validation
jQuery.validator.addMethod('groupvalueNotEquals', function (value) {
	return (employee_list_values.length != 0);
}, "year require");

$('#employee_exit_btn_form').submit(function(e) {
	e.preventDefault();
}).validate({
	rules: {
		employee_list: {
			groupvalueNotEquals:true,
		},
		status:{
			valueNotEquals:true,
		}
	},
//	For custom messages
	messages: {
		employee_list: {
			groupvalueNotEquals: "Select Atleast Ex-Employee",
		},
		status:{
			valueNotEquals:"Select Ex-Employee Status",
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

//form is valid or not
function employee_meet_expertise_form_validation()
{
	return $('#employee_exit_btn_form').valid();
}

//project details syn
function exitEmployeeProjectDetailsSyn(){
	$.ajax({
		url : "/exit_employee_project_details/",
		type : "GET",
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		let res = JSON.parse(json_data);
		res_data = res.results;
		if(res.results == 'NTE-E01'){
			alert_lobibox("success", "Ex-Employee Project Details Sync.");
		}else{
			alert_lobibox("error", "Ex-Employee Project Details Sync Error.");
		}
	});
}

//exit project details
function exitProjectDetailsApproved(emp_id){
	$.ajax({
		url : "/exit_employee_pro_list/",
		type : "GET",
		data: {'id':emp_id},
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		let res = JSON.parse(json_data);
		res_data = res.results;
		console.log(res_data)
		let active_pro_list = [];
		let pro_details = ''
		for(let i=0; i<res_data.length; i++){
			pro_details += '<option value='+res_data[i].id+'>'+res_data[i].project_details+'</option>';
			if(res_data[i].approve_status != 'pending'){
				active_pro_list.push(res_data[i].id);
			}
		}
		$('#employee_pro_list').html(pro_details).multiselect('rebuild');
		console.log("---acitve---project---",active_pro_list)
		employee_pro_list = active_pro_list;
		$('#employee_pro_list').multiselect('select', active_pro_list);
	});
}

//employee on change values get
$('#employee_pro_list').on('change', function(){
	$('.errorTxt0').html('');
    var selected = $(this).find("option:selected");
    employee_pro_list = [];
    selected.each(function(){
    	employee_pro_list.push(parseInt($(this).val()));
    });
});