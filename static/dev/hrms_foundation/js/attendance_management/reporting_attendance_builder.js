var att_columns = [{"title":"ID"}, {"title":"No."},{"title":"Name"},{"title":"Clock In"},{"title":"Clock Out"},{"title":"Working Hours"}];
$(document).ready(function(){
	employeeAttendanceReportData("/hrms_employee_attendance_report_list/",{'id':0},0);
});
//tags values 
function add_atags_values(){
	$('.tab2f .bootstrap-tagsinput input').val('');
	$('#employee_asearchtags').tagsinput('removeAll');
	var org =  $("#organization_aid  option:selected").val() != 0 ? $("#employee_asearchtags").tagsinput('add', { id: 'organization_aid', label: 'Organization' }):'';
	var org_unit =  $("#organization_aunit_id  option:selected").val() != 0 ? $("#employee_asearchtags").tagsinput('add', { id: 'organization_aunit_id', label: 'Organization Unit' }):'';
	var org_division =  $("#organization_att_division_id  option:selected").val() != 0 ? $("#employee_asearchtags").tagsinput('add', { id: 'organization_att_division_id', label: 'Division' }):'';
	var fname = $('#employee_afname').val() != '' ? $("#employee_asearchtags").tagsinput('add', { id: 'employee_afname', label: 'First Name' }) : '';
	var lname = $('#employee_alname').val() != '' ? $("#employee_asearchtags").tagsinput('add', { id: 'employee_alname', label: 'Last Name' }): '';
	var lname = $('#afrom').val() != '' ? $("#employee_asearchtags").tagsinput('add', { id: 'afrom', label: 'From Date' }): '';
	var lname = $('#ato').val() != '' ? $("#employee_asearchtags").tagsinput('add', { id: 'ato', label: 'To Date' }): '';
	//employee_report_attendance_search(0);
}
$('#employee_asearchtags').on('itemRemoved', function(event) {
	  $('.tab2f .bootstrap-tagsinput input').val('');
	  var status = 'organization_aid'== event.item.id ? $('#organization_aid').val(0).trigger("change"): 'organization_aunit_id'== event.item.id ? $('#organization_aunit_id').val('0').trigger("change"):'organization_att_division_id'== event.item.id ? $('#organization_att_division_id').val('0').trigger("change"):  $('#'+event.item.id).val('');
	  if(event.item.id != 'organization_aid' && event.item.id != 'organization_aunit_id'){
		  //employee_report_attendance_search(0);
	  }
	});
//org unit
function employeeOrgaUnitFunction(e){
	add_atags_values();
}
//org division 
function employeeOrgAttFunction(e){
	let status = $("#organization_att_division_id").val() !=0 ? add_atags_values() : '';
}
//first name
function employeeaFristFunction(e){
	add_atags_values();
}
//last name
function employeeaLastFunction(e){
	add_atags_values();
}
//function employee attendance to change
function employeeOrgafromFunction(e){
	add_atags_values();
}
//function employee attendance to change
function employeeOrgatoFunction(e){
	add_atags_values();
}

//employee report table data 
function employeeAttendanceReportData(urls,datas,id){
	$.ajax({
		url : urls,
		type : "GET",
		data : datas,
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		if(id == 0 ){
			plaindatatable_btn("employee_report_attendance_details",[],att_columns,0);
		}else{
			plaindatatable_btn("employee_report_attendance_details",data.results,att_columns,0,'NEXT_TRANSFORM_HCMS_DOW_EMPLOYEE_ATTENDANCE_'+currentDate());	
		}
	});
}
//org change
$("#organization_aid").change(function() {
		org_aunit($("#organization_aid  option:selected").val())
});

//org unit
function org_aunit(val){
	$.ajax({
		url : "/hrms_org_unit_change_structure_data/",
		type : "GET",
		data : {'id':val},
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		datas = JSON.parse(json_data);
		dropaDownList(datas.results,'organization_aunit_id');
	});
}

//org unit change
$("#organization_aunit_id").change(function() {
		let org_unit_id = $("#organization_aunit_id  option:selected").val();
		if(org_unit_id != 0){
			divisionAttendanceList(org_unit_id);
		}else{
			$("#organization_att_division_id").empty();
			$("#organization_att_division_id").append("<option value='0' selected>--Select Division--</option>");
		}
});

function divisionAttendanceList(org_unit_id){
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
				$("#organization_att_division_id").empty();
				$("#organization_att_division_id").append("<option value='0' selected>--Select Division--</option>");
				for (var i=0;i<data.team_info.length;i++)
				{				
					$("#organization_att_division_id").append("<option value='"+data.team_info[i].id+"'>"+data.team_info[i].name+"</option>");
				}
		}
	});
}

//drop down list
function dropaDownList(data,id){
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
function employee_report_attendance_search(status){
	$('.lobibox-close').trigger('click');//close previous lobibox
	if(employee_report_attendance_form_validation() && $('#organization_aid option:selected').val()!=0 ){
			var fname = $('#employee_afname').val() != undefined ? $('#employee_afname').val() : '';
			var lname = $('#employee_alname').val() != undefined ? $('#employee_alname').val() : '';
			var from = ($('#afrom').val() != undefined && $('#afrom').val() != '')? formatChange($('#afrom').val()) : '';
			var to = ($('#ato').val() != undefined && $('#ato').val() != '' ) ? formatChange($('#ato').val()) : '';
			var org_id = $('#organization_aid option:selected').val() != '0' ? $('#organization_aid option:selected').val() : '';
			var org_unit_id = $('#organization_aunit_id option:selected').val() != '0' ? $('#organization_aunit_id option:selected').val() : '';
			var org_division = $('#organization_att_division_id option:selected').val() != '0' ? $('#organization_att_division_id option:selected').val() : '';
			employeeAttendanceReportData("/hrms_employee_attendance_report_list_search/",{'fname':fname,'lname':lname,'froms':from,'to':to,'org_id':org_id,'org_unit_id':org_unit_id,'org_div':org_division},1);
			alert_lobibox("success",sysparam_datas_list['NTE_57']);
	}else{
		plaindatatable_btn("employee_report_attendance_details",[],att_columns,0);
	}
}

//date format change
function formatChangeDate(date){
	var date = date.split('-');
	return date[2]+'-'+date[1]+'-'+date[0];
}

//clear function here
function employee_report_attendance_clear(){
	$('#employee_asearchtags').tagsinput('removeAll');
	$('#employee_report_attendance_form')[0].reset();
	$('.errorTxts').html('');
	$('#organization_aid,#organization_aunit_id,#organization_att_division_id').val(0).trigger('change');
	employeeAttendanceReportData("/hrms_employee_attendance_report_list/",{'id':0},0);
}

//jquery attendance validation
jQuery.validator.addMethod('valueNotEquals', function (value) {
  return (value != '0');
}, "year required");
$('.select2').select2().change(function(){
	$('.errorTxts').html('');
});
$('#employee_report_attendance_form').submit(function(e) {
  e.preventDefault();
}).validate({
 rules: {
	   organization_aid: {
		   required: true,
		   valueNotEquals:true,
	   }, 
 },
 //For custom messages
 messages: {
	 organization_aid: {
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
function employee_report_attendance_form_validation()
{
	return $('#employee_report_attendance_form').valid();
}
