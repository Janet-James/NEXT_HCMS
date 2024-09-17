var employee_list_values = [];
var datas = getFormValues("#employee_meet_expertise_form");
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
	let access_for_create = jQuery.inArray( "Leave Administration", JSON.parse(localStorage.Create) );
	if(status == 1){
		strAppend += "<button type='button' onclick='generateExpertise()' class='btn-animate btn-eql-wid btn btn-success'>Add</button>"
	}else{
		strAppend += "<button type='button' onclick='generateExpertise()' class='btn-animate btn-eql-wid btn btn-success'>Update</button>"
	}
	strAppend += " <button type='button' onclick='clearExpertise()' class='btn-animate btn-eql-wid  btn btn-warning '>Cancel / Clear</button>"
	$('#employee_meet_expertise_btn').html(strAppend);
}

//employee offer list
function employeeOfferList(){
	let res_data = getEmployeeList('all','');
	if( res_data.length > 0 ){
		dynamicEmployeeList(res_data,'meet_our_expertise_details');
		$('#emp_name_filter').show();
	}else{
		$('#meet_our_expertise_details').html('<div class="col-md-12"><h3 style="text-align: center;color:#e73d4a;">No data available.</h3></div>');
		$('#emp_name_filter').hide();
	}
}

//search functionality
$('#emp_name').keypress(function(event) {
	    var keycode = event.keyCode || event.which;
	    if(keycode == '13') {
	    	let search_name = $('#emp_name').val();
	    	let search_data = getEmployeeList('name',search_name); 
	    	dynamicEmployeeList(search_data,'meet_our_expertise_details');
	    }
	});

//Employee List Append in function here
function dynamicEmployeeList(data,id){
	let empList = '';
	let count = 0; 
	for(let i=0; i<data.length; i++){
		let status = data[i].status == 1 ? 'Active' : 'In Active'
		empList += '<div class="col-lg-6 col-md-8 col-sm-12 row-eq-height" onclick="employeeSelect('+data[i].id+')">';
		empList += '<div class="EmployeeCard equhight employeeList" style="height: 155px;overflow: auto;"> ';
		empList += '<div class="col-sm-3 eoi_align_img" >';
		empList += '<div class="col-sm-12"><div class="ep_img">';
		empList += '<img alt="not found" class="" src="'+image_path+data[i].profile+'">';
		empList += '</div></div>'
		empList += '</div>'
		empList += '<div class="col-sm-8 eoi_align_txt">';
		empList += '<p class="ep_name" data-toggle="tooltip" data-placement="left" title="Name" >'+data[i].name+'</p>';
		empList += '<p class="ep_email" data-toggle="tooltip" data-placement="left" title="Company Email" >'+data[i].work_email+'</p>';
		empList += '<p class="ep_designation" data-toggle="tooltip" data-placement="left" title="Role" >'+data[i].role_title+'</p>';
		empList += '<p class="ep_team" data-toggle="tooltip" data-placement="left" title="Team Name" >'+data[i].tname+'</p>';
		empList += '<p class="ep_join" data-toggle="tooltip" data-placement="left" title="Meet Our Expertise Status" >'+status+'</p>';
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
function employeeSelect(id){
	let data = getEmployeeList('id',id);
	clearExpertise();
	button_generate(2);
	$('#status').val(data[0].status).trigger("change");
	employee_list_values = [data[0].id]
	$("#employee_list").val(employee_list_values).multiselect('rebuild');
}


//get data function
function getEmployeeList(status,val){
	let res_data = []
	$.ajax({
		url : "/meet_our_expertise_details/",
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
});

//generate function here
function generateExpertise(){
	let form_status = employee_meet_expertise_form_validation();
	if(form_status){
		let status = $('#status').val();
		$.ajax({
			url : "/meet_our_expertise_operation/",
			type : "POST",
			data : { 'employee_id':employee_list_values.toString(),'status':status,csrfmiddlewaretoken:csrf_data },
			timeout : 10000,
			async : false,
		}).done( function(json_data) {
			let res = JSON.parse(json_data);
			let res_data = res.results;
			if( res_data == 'NTE-E01'){
				alert_lobibox("success", "Expertise Added Successfully.");
				employeeOfferList();
				clearExpertise();
			}else if( res_data == 'NTE-E02'){
				alert_lobibox("success", "Expertise Updated Successfully.");
				employeeOfferList();
				clearExpertise();
			}else{
				alert_lobibox("error", "Expertise Added Error.");
				clearExpertise();
			}
		});
	}else{
		if(employee_list_values.length ==0){
			$('.errorTxt0').html('Select Atleast One Employee')
		}
	}
}

//clear function here
function clearExpertise(){
	button_generate(1);
	$("#employee_list").multiselect("deselectAll", false);
	$("#employee_list").multiselect('rebuild');
	employee_list_values = [];
	$('.errormessage').html('');
	$('#status').val("0").trigger("change");
}

//jquery leave validation
jQuery.validator.addMethod('valueNotEquals', function(value) {
	return (value != '0');
}, "status required");


//jquery attendance validation
jQuery.validator.addMethod('groupvalueNotEquals', function (value) {
	return (employee_list_values.length != 0);
}, "year require");

$('#employee_meet_expertise_form').submit(function(e) {
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
			groupvalueNotEquals: "Select Atleast Employee",
		},
		status:{
			valueNotEquals:"Select Status",
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
	return $('#employee_meet_expertise_form').valid();
}