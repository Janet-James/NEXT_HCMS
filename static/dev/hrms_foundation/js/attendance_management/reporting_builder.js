var emp_columns = [{"title":"ID"}, {"title":"No."}, {"title":"Name"}, {"title":"Email"},
                   {"title":"Mobile Number"},{"title":"Emergency Mobile Number"},{"title":"Permanent Address"},{"title":"Gender"},
                   {"title":"Date of Joining"},{"title":"Relieving Date"},{"title":"Employee Id"},{'title':'Status'}];
$(document).ready(function(){
		   employeeReportData("/hrms_employee_report_list/",{'id':0},0);
		   $('#employee_searchtags,#employee_asearchtags,#employee_lsearchtags,#employee_dsearchtags').tagsinput({
			    allowDuplicates: false,
			    itemValue: 'id',  // this will be used to set id of tag
			    itemText: 'label', // this will be used to set text of tag
			    freeInput: false,
			});
});

//tags values 
function add_tags_values(){
	$('.tab1f .bootstrap-tagsinput input').val('');
	$('#employee_searchtags').tagsinput('removeAll');
	var org =  $("#organization_id  option:selected").val() != 0 ? $("#employee_searchtags").tagsinput('add', { id: 'organization_id', label: 'Organization' }):'';
	var org_unit =  $("#organization_unit_id  option:selected").val() != 0 ? $("#employee_searchtags").tagsinput('add', { id: 'organization_unit_id', label: 'Organization Unit' }):'';
	var org_division =  $("#organization_emp_division_id  option:selected").val() != 0 ? $("#employee_searchtags").tagsinput('add', { id: 'organization_emp_division_id', label: 'Division' }):'';
	var fname = $('#employee_fname').val() ? $("#employee_searchtags").tagsinput('add', { id: 'employee_fname', label: "First Name" }) : '';
	var lname = $('#employee_lname').val() ? $("#employee_searchtags").tagsinput('add', { id: 'employee_lname', label: "Last Name" }) : '';
	var gener =  $("#employee_gender  option:selected").val() != '0' ? $("#employee_searchtags").tagsinput('add', { id: 'employee_gender', label: 'Gender' }):'';
	var emp_id = $('#employee_id').val() ? $("#employee_searchtags").tagsinput('add', { id: 'employee_id', label: "Employee ID" }) : '';
	var role =  $("#employee_role  option:selected").val() != 0 ? $("#employee_searchtags").tagsinput('add', { id: 'employee_role', label: 'Role' }):'';
	var emp_status =  $("#emp_status  option:selected").val() != 0 ? $("#employee_searchtags").tagsinput('add', { id: 'emp_status', label: 'Employee Status' }):'';
	//employee_report_search(0);
}
$('#employee_searchtags').on('itemRemoved', function(event) {
	  $('.tab1f .bootstrap-tagsinput input').val('');
	  var status = 'organization_id'== event.item.id ? $('#organization_id').val('0').trigger("change"): 'organization_unit_id'== event.item.id ? $('#organization_unit_id').val('0').trigger("change"):'organization_emp_division_id'== event.item.id ? $('#organization_emp_division_id').val('0').trigger("change"):'employee_gender'== event.item.id ? $('#employee_gender').val('0').trigger("change"): 'employee_role'== event.item.id ? $('#employee_role').val('0').trigger("change"): 'emp_status'== event.item.id ? $('#emp_status').val('0').trigger("change"):  $('#'+event.item.id).val('');
	  if(event.item.id != 'organization_id' && event.item.id != 'organization_unit_id' && event.item.id != 'employee_gender' && event.item.id != 'employee_role' && event.item.id != 'emp_status'){
		 // employee_report_search(0);
	  }
	});
//org unit
function employeeOrgUnitFunction(e){
	add_tags_values();
}
//org division 
function employeeOrgDivisionFunction(e){
	let status = $("#organization_emp_division_id").val() !=0 ? add_tags_values() : '';
}
//first name
function employeeFristFunction(e){
	add_tags_values();
}
//last name
function employeeLastFunction(e){
	add_tags_values();
}
//gender
function employeeGenderFunction(e){
	add_tags_values();
}
//address
function employeeRoleFunction(e){
	add_tags_values();
}
//employee id
function employeeIDFunction(e){
	add_tags_values();
}
//employee status
function employeeStatusFunction(e){
	add_tags_values();
}

//employee report table data 
function employeeReportData(urls,datas,id){
	$.ajax({
		url : urls,
		type : "GET",
		data : datas,
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		if(id == 0 ){
			plaindatatable_btn("employee_report_details",[],emp_columns,0);
		}else{
			plaindatatable_btn("employee_report_details",data.results,emp_columns,0,'NEXT_TRANSFORM_HCMS_EMPLOYEE_'+currentDate());
		}
		
	});
}

//navigation page
$("#employee_report_details").on("click", "tr", function() { 
	if (!this.rowIndex) return; // skip first row
	var emp_id = $('#employee_report_details').dataTable().fnGetData(this)[0];
	var emp_status_id = $('#employee_report_details').dataTable().fnGetData(this)[7];
	localStorage.setItem('emp_id', emp_id);
	if(emp_status_id == 'Active'){
		localStorage.setItem('emp_status', true);
	}else{
		localStorage.setItem('emp_status', false);
	}
	window.location = '/hrms_employee/';
});

//org change
$("#organization_id").change(function() {
		org_unit($("#organization_id  option:selected").val())
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
		if(org_unit_id != 0){
			divisionList(org_unit_id);
		}else{
			$("#organization_emp_division_id").empty();
			$("#organization_emp_division_id").append("<option value='0' selected>--Select Division--</option>");
		}
});

//division list function here
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
				$("#organization_emp_division_id").empty();
				$("#organization_emp_division_id").append("<option value='0' selected>--Select Division--</option>");
				for (var i=0;i<data.team_info.length;i++)
				{				
					$("#organization_emp_division_id").append("<option value='"+data.team_info[i].id+"'>"+data.team_info[i].name+"</option>");
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

//search function here
function employee_report_search(status){
	$('.lobibox-close').trigger('click');//close previous lobibox
	if(employee_report_form_validation() && $("#organization_id  option:selected").val() != 0){
		var fname = $('#employee_fname').val() != undefined ? $('#employee_fname').val() : '';
		var lname = $('#employee_lname').val() != undefined ? $('#employee_lname').val() : '';
		var emp_id = $('#employee_id').val() != undefined ? $('#employee_id').val() : '';
		var role = $('#employee_role option:selected').val() != '0' ? $('#employee_role option:selected').val() : '';
		var org_id = $('#organization_id option:selected').val() != '0' ? $('#organization_id option:selected').val() : '';
		var org_unit_id = $('#organization_unit_id option:selected').val() != '0' ? $('#organization_unit_id option:selected').val() : '';
		var org_division = $('#organization_emp_division_id option:selected').val() != '0' ? $('#organization_emp_division_id option:selected').val() : '';
		var gender_id = $('#employee_gender option:selected').val() != '0' ? $('#employee_gender option:selected').val() : '';
		var emp_status = $('#emp_status option:selected').val() != '0' ? $('#emp_status option:selected').val() : '';
		employeeReportData("/hrms_employee_report_list_search/",{'fname':fname,'lname':lname,'role':role,'org_id':org_id,'org_unit_id':org_unit_id,'org_div':org_division,'gender_id':gender_id,'emp_id':emp_id,'emp_status':emp_status},1);
		alert_lobibox("success",sysparam_datas_list['NTE_58']);
	}else{
		plaindatatable_btn("employee_report_details",[],emp_columns,0);
	}
}

//clear function here
function employee_report_clear(){
	$('#employee_report_form')[0].reset();
	$('#organization_id,#organization_emp_division_id,#employee_gender,#employee_gender').val(0).trigger('change');
	$('.errormessage').html('');
	employeeReportData("/hrms_employee_report_list/",{'id':0},0);
}

//jquery attendance validation
jQuery.validator.addMethod('valueNotEquals', function (value) {
  return (value != '0');
}, "year required");
$('.select2').select2().change(function(){
	$('.errorTxts').html('');
});
$('#employee_report_form').submit(function(e) {
  e.preventDefault();
}).validate({
 rules: {
	   organization_id: {
		   required: true,
		   valueNotEquals:true,
	   }, 
 },
 //For custom messages
 messages: {
	 organization_id: {
         required: "Select Organization",
         valueNotEquals: "Select Valid Organization",
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
function employee_report_form_validation()
{
	return $('#employee_report_form').valid();
}
