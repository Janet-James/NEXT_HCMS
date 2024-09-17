var lve_columns = [{"title":"ID"}, {"title":"No."}, {"title":"Name"},{"title":"Status"},{"title":"Number of Days"},{"title":"Type"}, {"title":"From"},{"title":"To"} ];
$(document).ready(function(){
	employeeLeaveReportData("/hrms_employee_leave_report_list/",{'id':0},0);
});
//tags values 
function add_tags_lvalues(){
	$('.tab3f .bootstrap-tagsinput input').val('');
	$('#employee_lsearchtags').tagsinput('removeAll');
	var org =  $("#organization_lid  option:selected").val() != 0 ? $("#employee_lsearchtags").tagsinput('add', { id: 'organization_lid', label: 'Organization' }):'';
	var org_unit =  $("#organization_lunit_id  option:selected").val() != 0 ? $("#employee_lsearchtags").tagsinput('add', { id: 'organization_lunit_id', label: 'Organization Unit' }):'';
	var org_division =  $("#organization_lev_division_id  option:selected").val() != 0 ? $("#employee_lsearchtags").tagsinput('add', { id: 'organization_lev_division_id', label: 'Division' }):'';
	var ltype =  $("#employee_ltype  option:selected").val() != 0 ? $("#employee_lsearchtags").tagsinput('add', { id: 'employee_ltype', label: 'Leave Type' }):'';
	var fname = $('#employee_lfname').val() != '' ? $("#employee_lsearchtags").tagsinput('add', { id: 'employee_lfname', label: 'First Name' }) : '';
	var lname = $('#employee_llname').val() != '' ? $("#employee_lsearchtags").tagsinput('add', { id: 'employee_llname', label: 'Last Name' }): '';
	var lname = $('#lfrom').val() != '' ? $("#employee_lsearchtags").tagsinput('add', { id: 'lfrom', label: 'From Date' }): '';
	var lname = $('#lto').val() != '' ? $("#employee_lsearchtags").tagsinput('add', { id: 'lto', label: 'To Date' }): '';
	//employee_report_leave_search(0);
}
$('#employee_lsearchtags').on('itemRemoved', function(event) {
	  $('.tab3f .bootstrap-tagsinput input').val('');
	  var status = 'organization_lid'== event.item.id ? $('#organization_lid').val('0').trigger("change"): 'organization_lunit_id'== event.item.id ? $('#organization_lunit_id').val('0').trigger("change"): 'organization_lev_division_id'== event.item.id ? $('#organization_lev_division_id').val('0').trigger("change"):'employee_ltype'== event.item.id ? $('#employee_ltype').val('0').trigger("change"):  $('#'+event.item.id).val('');
	  if(event.item.id != 'organization_lid' && event.item.id != 'organization_lunit_id' && event.item.id != 'employee_ltype'){
		 // employee_report_leave_search(0);
	  }
	});

//org unit
function employeeOrglUnitFunction(e){
	add_tags_lvalues();
}
//org division 
function employeeOrgLevFunction(e){
	let status = $("#organization_lev_division_id").val() !=0 ? add_tags_lvalues() : '';
}
//first name
function employeelFristFunction(e){
	add_tags_lvalues();
}
//last name
function employeelLastFunction(e){
	add_tags_lvalues();
}
//type
function employeelTypeFunction(e){
	add_tags_lvalues();
}
//function employee leave to change
function employeeOrglfromFunction(e){
	add_tags_lvalues();
}
//function employee leave to change
function employeeOrgltoFunction(e){
	add_tags_lvalues();
}

//org unit
function org_lunit(val){
	$.ajax({
		url : "/hrms_org_unit_change_structure_data/",
		type : "GET",
		data : {'id':val},
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		datas = JSON.parse(json_data);
		droplDownList(datas.results,'organization_lunit_id');
	});
}

//org unit change
$("#organization_lunit_id").change(function() {
		let org_unit_id = $("#organization_lunit_id  option:selected").val();
		if(org_unit_id != 0){
			divisionLeaveList(org_unit_id);
		}else{
			$("#organization_lev_division_id").empty();
			$("#organization_lev_division_id").append("<option value='0' selected>--Select Division--</option>");
		}
});

function divisionLeaveList(org_unit_id){
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
				$("#organization_lev_division_id").empty();
				$("#organization_lev_division_id").append("<option value='0' selected>--Select Division--</option>");
				for (var i=0;i<data.team_info.length;i++)
				{				
					$("#organization_lev_division_id").append("<option value='"+data.team_info[i].id+"'>"+data.team_info[i].name+"</option>");
				}
		}
	});
}

//drop down list
function droplDownList(data,id){
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

//employee report table data 
function employeeLeaveReportData(urls,datas,id){
	$.ajax({
		url : urls,
		type : "GET",
		data : datas,
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		if(id == 0 ){
			plaindatatable_btn("employee_report_leave_details",[],lve_columns,0);
		}else{
			plaindatatable_btn("employee_report_leave_details",data.results,lve_columns,0,'NEXT_TRANSFORM_HCMS_DOW_EMPLOYEE_LEAVE_'+currentDate());		
		}
	});
}
//org change
$("#organization_lid").change(function() {
	org_lunit($("#organization_lid  option:selected").val())
});

//search function here
function employee_report_leave_search(status){
	$('.lobibox-close').trigger('click');//close previous lobibox
	if(employee_report_leave_form_validation() && $("#organization_lid  option:selected").val() != 0 ){
			var fname = $('#employee_lfname').val() != undefined ? $('#employee_lfname').val() : '';
			var lname = $('#employee_llname').val() != undefined ? $('#employee_llname').val() : '';
			var from = ($('#lfrom').val() != undefined && $('#lfrom').val() != '')? formatChangeDate($('#lfrom').val()) : '';
			var to = ($('#lto').val() != undefined && $('#lto').val() != '')? formatChangeDate($('#lto').val()) : '';
			var org_unit_id = $('#organization_lunit_id option:selected').val() != '0' ? $('#organization_lunit_id option:selected').val() : '';
			var org_id = $('#organization_lid option:selected').val() != '0' ? $('#organization_lid option:selected').val() : '';
			var org_division = $('#organization_lev_division_id option:selected').val() != '0' ? $('#organization_lev_division_id option:selected').val() : '';
			var leave_id = $('#employee_ltype option:selected').val() != '0' ? $('#employee_ltype option:selected').val() : '';
			employeeLeaveReportData("/hrms_employee_leave_report_list_search/",{'fname':fname,'lname':lname,'froms':from,'to':to,'org_id':org_id,'leave_id':leave_id,'org_unit_id':org_unit_id,'org_div':org_division},1);
			alert_lobibox("success",sysparam_datas_list['NTE_59']);
	}else{
		employeeLeaveReportData("/hrms_employee_leave_report_list/",{'id':0},0);
	}
}

//clear function here
function employee_report_leave_clear(){
	$('#employee_report_leave_form')[0].reset();
	$('#organization_lid').val(0).trigger('change');
	$('#employee_ltype').val(0).trigger('change');
	$('#organization_lev_division_id').val(0).trigger('change');
	$('#employee_lsearchtags').tagsinput('removeAll');
	$('.errorTxts').html('');
	employeeLeaveReportData("/hrms_employee_leave_report_list/",{'id':0},0);
}

//jquery attendance validation
jQuery.validator.addMethod('valueNotEquals', function (value) {
  return (value != '0');
}, "year required");
$('.select2').select2().change(function(){
	$('.errorTxts').html('');
});
$('#employee_report_leave_form').submit(function(e) {
  e.preventDefault();
}).validate({
 rules: {
	   organization_lid: {
		   required: true,
		   valueNotEquals:true,
	   }, 
 },
 //For custom messages
 messages: {
	 organization_lid: {
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
function employee_report_leave_form_validation()
{
	return $('#employee_report_leave_form').valid();
}
