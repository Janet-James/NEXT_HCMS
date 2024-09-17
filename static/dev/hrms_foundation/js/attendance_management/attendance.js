var columns = [{"title":"ID"}, {"title":"No."} ,{"title":"Organization"} ,{"title":"Organization Unit"}, {"title":"Employee"}, {"title":"Clock In"},{"title":"Clock Out"} ];
var id = 0;
var att_id,org_count_status = 0;
var employeeListValues = []
var datas = getFormValues("#hrms_attendance");
var	csrf_data = datas.csrfmiddlewaretoken;
$(document).ready(function(){
	button_create(1)
	//table row click get id
	$("#attendance_table").on("click", "tr", function() { 
		if (!this.rowIndex) return; // skip first row
		id = $('#attendance_table').dataTable().fnGetData(this)[0];
		attendanceDataEvents(id);
		dataTableAcitveRowAdd('attendance_table',$(this).index());//active class add
		button_create(0)
	});
	attendanceData();
}); 

//form reset function here
function clearAttendanceConfirmation(){
	 $('#hrms_attendance')[0].reset();
	 $('#company').val('0').trigger("change");
	 att_id = 0;
	 employeeListValues = [];
	 $('#employee_list').multiselect('select', employeeListValues);
	 $('#emp_name').val('');
	 attendanceData();
}

//Employee data fetch
function employeeList(datas){
	$.ajax({
		url : "/hrms_employee_filter_list/",
		type : "GET",
		data : datas,
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		let datas = JSON.parse(json_data);
		employeeDropDownList(datas.results,'employee_list');
	});
}

//drop down list
function employeeDropDownList(data,id){
	console.log("---data-->",data)
	let strAppend = ''
		if(data.length>0){
			for(var i=0;i<data.length;i++){
				strAppend += '<option value="'+data[i].id+'">'+data[i].name+'</option>'
			}
			$('#'+id).html(strAppend).multiselect('rebuild');
		}else{
			$('#'+id).html(strAppend).multiselect('rebuild');
		}
	$('#'+id).multiselect({ nonSelectedText:'--Select Employee--'});
}

//cancel clear function call button
function attendance_clear_btn_refresh_call(){
	$('#hrms_attendance')[0].reset();
	$('#company').val('0').trigger("change");
	att_id = 0;
	employeeListValues = [];
	$('#employee_list').multiselect('select', employeeListValues);
	button_create(1);
	$('#emp_name').val('');
	attendanceData();
	$('#check_in,#check_out').val('');
	$(".date_input_class").trigger('change');
}

//employee on change values get
$('#employee_list').on('change', function(){
    var selected = $(this).find("option:selected");
    employeeListValues = [];
    selected.each(function(){
    	employeeListValues.push($(this).val());
    });
});

//cancel clear function call button
function attendance_clear_btn_refresh(){
	if(att_id != 0 ){
		var title = $('#employee_list option:selected').text();
		orgClearFuncton('attendance_clear_btn_refresh_call','',title);
	}else{
		attendance_clear_btn_refresh_call();
	}
	$('#check_in,#check_out').val('');
	$(".date_input_class").trigger('change');
}

//add confirmation function here.
function addAttendanceConfirmation(){
	id = 0;
	dataForm();
}

//update confirmation function here.
function updateAttendanceConfirmation(){
	id = 1;
	dataForm();
}

//remove confirmation function here.
function removeAttendanceConfirmation(){
	var status = attendance_form_validation();
	if(status){
		id = 3;
		var title = $('#employee_list option:selected').text();
		removeConfirmation('dataForm','',title);
	}
}

//org change
$("#company").change(function() {
		let org_id = $("#company  option:selected").val();
		org_unit(org_id)
		if(org_id !=0 ){
			org_count_status = 1;
			employeeList({ 'org_id':org_id,'status':'org' })
		}
});

//org unit
function org_unit(val){
	$.ajax({
		url : "/hrms_org_unit_change_structure_data/",
		type : "GET",
		data : {'id':val},
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		datas = JSON.parse(json_data);
		dropDownList(datas.results,'organization_unit_id');
	});
}

//org unit change
$("#organization_unit_id").change(function() {
		let org_unit_id = $("#organization_unit_id  option:selected").val();
		let org_id = $("#company  option:selected").val();
		if(org_unit_id != 0){
			divisionList(org_unit_id);
			employeeList({ 'org_id':org_id,'org_unit_id':org_unit_id,'status':'org_unit' });
		}else{
			if(org_count_status == 1){
				employeeList({ 'org_id':org_id,'status':'org' });
				org_count_status = 0;
			}
			$("#organization_division_id").empty();
			$("#organization_division_id").append("<option value='0' selected>--Select Division--</option>");
		}
});

//org change
$("#organization_division_id").change(function() {
		let org_unit_id = $("#organization_unit_id  option:selected").val();
		let org_id = $("#company  option:selected").val();
		let org_div_id = $("#organization_division_id  option:selected").val();
		if(org_div_id !=0 ){
			employeeList({ 'org_id':org_id,'org_unit_id':org_unit_id,'org_div_id':org_div_id,'status':'org_div' });
		}else{
			if(org_unit_id != 0){
				employeeList({ 'org_id':org_id,'org_unit_id':org_unit_id,'status':'org_unit' });
			}else{
				employeeList({ 'org_id':org_id,'status':'org' });
			}
		}
})

function divisionList(org_unit_id){
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
				$("#organization_division_id").empty();
				$("#organization_division_id").append("<option value='0' selected>--Select Division--</option>");
				for (var i=0;i<data.team_info.length;i++)
				{				
					$("#organization_division_id").append("<option value='"+data.team_info[i].id+"'>"+data.team_info[i].name+"</option>");
				}
		}
	});
}

//drop down list
function dropDownList(data,id){
		strAppend = '<option value="0">--Select Organization Unit--</option>'
		if(data.length>0){
			for(var i=0;i<data.length;i++){
				strAppend += '<option value="'+data[i].id+'">'+data[i].name+'</option>'
			}
			$('#'+id).html(strAppend).change();
		}else{
			$('#'+id).html(strAppend).change();
		}
}

//data form in object
function dataForm(){
	var status = attendance_form_validation();
	if(status){
		project_list = [];
		project_dict = {};
		var project_form_value = getFormValues("#hrms_attendance");
		project_form_value['check_in'] =  formatChange($('#check_in').val())
		project_form_value['check_out'] =  formatChange($('#check_out').val())
		project_form_value['employee'] = employeeListValues;
		project_list.push(project_form_value);
                console.log(project_list)
		project_dict['input_data'] = project_list;
		json_response = JSON.stringify(project_dict);
		method = 'POST';
		url = "/hrms_attendance_crud_operation/";
		crud_function(method, json_response, url);	
	}
}

//crud function here
function crud_function(methods, datas, urls) {
	if(id == 0){
		res_data = { "results":datas }
	}else if(id == 1){
		if(att_id != 0){
			res_data = { "results":datas,"update_id":att_id }
		}
	}else if(id == 3){
		if(att_id != 0){
			res_data = { "results":datas,"delete_id":att_id }
		}
	} 
	$.ajax({
		url : urls,
		type : methods,
		data : res_data,
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		var res_status = data['results']
		if(res_status != "NTE_04"){
			if(res_status == "NTE_03"){
				button_create(1)
			}
			alert_lobibox("success", sysparam_datas_list[res_status]);
		}else{
			alert_lobibox("success", sysparam_datas_list[res_status]);
			button_create(1)
		}
		clearAttendanceConfirmation();
	});
}

//attendance table data 
function attendanceData(){
	$.ajax({
		url : "/hrms_attendance_data/",
		type : "POST",
		data : {csrfmiddlewaretoken:csrf_data},  
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		plaindatatable_btn("attendance_table",data.results,columns,0,'NEXT_TRANSFORM_HCMS_DOW_EMPLOYEE_ATTENDANCE_'+currentDate());
	}); 
}
//attendance event table data 
function attendanceDataEvents(event_id){
//	clearAttendanceConfirmation();
	employeeListValues = [];
	$.ajax({
		url : "/hrms_attendance_data/",
		type : "POST",
		data : {'id':event_id,'search_name':'',csrfmiddlewaretoken:csrf_data}, 
		timeout : 10000,
		async:false,
	}).done( function(json_data) { 
		data = JSON.parse(json_data);
		if(data.results.length){ 
			att_id = data.results[0].aid;
			employeeListValues.push(data.results[0].eid);
			let ou_id = data.results[0].org_unt_id_id;
			let div_id = data.results[0].org_team_id_id;
			let emp_id = employeeListValues;
			$('#company').val(data.results[0].cid).trigger("change"); 
			$('#check_in').val(data.results[0].check_in);
			$('#check_out').val(data.results[0].check_out);
			$('#organization_unit_id').val(ou_id).trigger("change");
			//$('#organization_unit_id').val('8').trigger("change");
			$('#organization_division_id').val(div_id).trigger("change");
			/*setTimeout(orgUnitActive, 100); 
			function orgUnitActive(){
				$('#organization_unit_id').val(data.results[0].org_unit_id_id).trigger("change");
				setTimeout(divActive, 100);
			}
			function divActive(){
				$('#organization_division_id').val(div_id).trigger("change");
				setTimeout(empAcitve, 100);
			}*/
			function empAcitve(){
				$('#employee_list').multiselect('select', [emp_id]);
			}
			$(".date_input_class").trigger('change');
		}
	});
}



//button create function here
function button_create(status){
	var access_for_create = jQuery.inArray( "Manual Attendance", JSON.parse(localStorage.Create) );
	var access_for_write = jQuery.inArray( "Manual Attendance", JSON.parse(localStorage.Write) );
	var access_for_delete = jQuery.inArray( "Manual Attendance", JSON.parse(localStorage.Delete) );
	var strAppend = '';
	if(status == 1){
		if (access_for_create != -1){
			strAppend = "<button type='button' onclick='addAttendanceConfirmation()' class='btn-animate btn-eql-wid  btn btn-success'>Add</button>"
		}
			strAppend += " <button type='button' onclick='attendance_clear_btn_refresh()'  class='btn-animate btn-eql-wid  btn btn-warning '>Cancel / Clear</button>"
		$('#hrms_attendance_btn').html(strAppend);
	}else{ 
		if (access_for_write != -1){
			strAppend = "<button type='button' onclick='updateAttendanceConfirmation()' class='btn-animate btn-eql-wid  btn btn-primary '>Update</button>"
		}if (access_for_delete != -1){
			strAppend += " <button type='button' onclick='removeAttendanceConfirmation()' class='btn-animate btn-eql-wid  btn btn-danger '>Remove</button>"
		}
		strAppend += " <button type='button' onclick='attendance_clear_btn_refresh()' class='btn-animate btn-eql-wid  btn btn-warning '>Cancel / Clear</button>"
		$('#hrms_attendance_btn').html(strAppend);
	}
}


//jquery attendance validation
jQuery.validator.addMethod('valueNotEquals', function (value) {
  return (value != '0');
}, "year required");
$('.select2').select2().change(function(){
	$('.errorTxts').html('');
});
//jquery org unit validation 
jQuery.validator.addMethod('orgDivValidation', function (value) {
  return employeeListValues.length != 0 ? true : false;
}, "year required");


//date time picker validation
jQuery.validator.addMethod('datetime_picker_validation', function (value) {
	var fromDate = ($('#check_in').val()).split(' ')[0];
	var fromTime = ($('#check_in').val()).split(' ')[1];
	var toDate = ($('#check_out').val()).split(' ')[0];
	var toTime = ($('#check_out').val()).split(' ')[1];
	let fromDateTime = fromDate.split('-')[2]+'-'+fromDate.split('-')[1]+'-'+fromDate.split('-')[0]+' '+fromTime.split(':')[0]+':'+fromTime.split(':')[1];
	let toDateTime = toDate.split('-')[2]+'-'+toDate.split('-')[1]+'-'+toDate.split('-')[0]+' '+toTime.split(':')[0]+':'+toTime.split(':')[1];
	if(fromDateTime < toDateTime){
		return true;
	} else {  
	    return false;
	}
});

$('#hrms_attendance').submit(function(e) {  
  e.preventDefault();
}).validate({
 rules: {
	   check_in: {
		   required: true,
	   },
	   check_out: {
		   required: true,
		   datetime_picker_validation : true,
	   }, 
	   employee_list: {
		   orgDivValidation: true,
	   },  
	   company: {
		   required: true,
		   valueNotEquals:true,
	   },
	   
 },
 //For custom messages
 messages: {
	 check_in: {
		 required: "Select Check In",
	 },
	 check_out: {
		 required: "Select Check Out", 
		 datetime_picker_validation : 'Invalid Date',
	 },
	 employee_list: {
		 orgDivValidation: "Select Employee",
	 },  
	 company: {
		 valueNotEquals: "Select Valid Company",
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
function attendance_form_validation()
{
	return $('#hrms_attendance').valid();
}
