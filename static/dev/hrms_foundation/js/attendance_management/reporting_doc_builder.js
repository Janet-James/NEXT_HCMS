var doc_columns = [{"title":"ID"}, {"title":"No."},{"title":"Name"}, {"title":"Email"},{"title":"Type"},{"title":"Document Name"},{"title":"Download"} ];
$(document).ready(function(){
		   employeeDocReportData("/hrms_employee_doc_report_list/",{'id':0},0);
});

//tags values 
function add_tags_dvalues(){
	$('.tab4f .bootstrap-tagsinput input').val('');
	$('#employee_dsearchtags').tagsinput('removeAll');
	var org =  $("#organization_did  option:selected").val() != 0 ? $("#employee_dsearchtags").tagsinput('add', { id: 'organization_did', label: 'Organization' }):'';
	var org_unit =  $("#organization_unit_did  option:selected").val() != 0 ? $("#employee_dsearchtags").tagsinput('add', { id: 'organization_unit_did', label: 'Organization Unit' }):'';
	var org_division =  $("#organization_doc_division_id  option:selected").val() != 0 ? $("#employee_dsearchtags").tagsinput('add', { id: 'organization_doc_division_id', label: 'Division' }):'';
	var fname = $('#employee_dfname').val() ? $("#employee_dsearchtags").tagsinput('add', { id: 'employee_dfname', label: "First Name" }) : '';
	var lname = $('#employee_dlname').val() ? $("#employee_dsearchtags").tagsinput('add', { id: 'employee_dlname', label: "Last Name" }) : '';
	var gener =  $("#employee_dgender  option:selected").val() != '0' ? $("#employee_dsearchtags").tagsinput('add', { id: 'employee_dgender', label: 'Gender' }):'';
	var emp_id = $('#employee_did').val() ? $("#employee_dsearchtags").tagsinput('add', { id: 'employee_did', label: "Employee ID" }) : '';
	var role =  $("#employee_role  option:selected").val() != 0 ? $("#employee_dsearchtags").tagsinput('add', { id: 'employee_drole', label: 'Role' }):'';
	//employee_report_search(0);
}
$('#employee_dsearchtags').on('itemRemoved', function(event) {
	  $('.tab4f .bootstrap-tagsinput input').val('');
	  var status = 'organization_did'== event.item.id ? $('#organization_did').val('0').trigger("change"): 'organization_unit_did'== event.item.id ? $('#organization_unit_did').val('0').trigger("change"):'organization_doc_division_id'== event.item.id ? $('#organization_doc_division_id').val('0').trigger("change"):'employee_dgender'== event.item.id ? $('#employee_dgender').val('0').trigger("change"): 'employee_drole'== event.item.id ? $('#employee_drole').val('0').trigger("change"):  $('#'+event.item.id).val('');
	  if(event.item.id != 'organization_did' && event.item.id != 'organization_unit_did' && event.item.id != 'employee_dgender' && event.item.id != 'employee_role'){
		 // employee_report_search(0);
	  }
	});
//org unit
function employeeOrgUnitDocFunction(e){
	add_tags_dvalues();
}
//org division 
function employeeOrgDocFunction(e){
	let status = $("#organization_doc_division_id").val() !=0 ? add_tags_dvalues() : '';
}
//first name
function employeeFristDocFunction(e){
	add_tags_dvalues();
}
//last name
function employeeLastDocFunction(e){
	add_tags_dvalues();
}
//gender
function employeeGenderDocFunction(e){
	add_tags_dvalues();
}
//address
function employeeRoleDocFunction(e){
	add_tags_dvalues();
}
//employee id
function employeeIDDocFunction(e){
	add_tags_dvalues();
}
//employee report table data 
function employeeDocReportData(urls,datas,id){
	$.ajax({
		url : urls,
		type : "GET",
		data : datas,
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		var res_data = JSON.parse(json_data);
		var data = res_data.results;
		var res = [];
		for(var i=0;i<data.length;i++){
			strAppend = '<a href="'+doc_path+data[i][6]+'" download="'+data[i][5]+'"><i class="nf nf-download" title="'+data[i][5]+'" style="color: #4dae59;font-size: 20px;"></i></a>'
			res.push([data[i][0],data[i][1],data[i][2],data[i][3],data[i][4],data[i][5],strAppend])
		}
		if(id == 0 ){
			plaindatatable_btn("employee_doc_report_details",[],doc_columns,0);
		}else{
			plaindatatable_btn("employee_doc_report_details",res,doc_columns,0,'NEXT_TRANSFORM_HCMS_DOW_EMPLOYEE_DOCUMENT_'+currentDate());
		}
		
	});
}

//org change
$("#organization_did").change(function() {
		org_dunit($("#organization_did  option:selected").val())
});

//org unit
function org_dunit(val){
	$.ajax({
		url : "/hrms_org_unit_change_structure_data/",
		type : "GET",
		data : {'id':val},
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		datas = JSON.parse(json_data);
		dropDownList(datas.results,'organization_unit_did');
	});
}

//org unit change
$("#organization_unit_did").change(function() {
		let org_unit_id = $("#organization_unit_did  option:selected").val();
		if(org_unit_id != 0){
			divisionDocumentList(org_unit_id);
		}else{
			$("#organization_doc_division_id").empty();
			$("#organization_doc_division_id").append("<option value='0' selected>--Select Division--</option>");
		}
});

function divisionDocumentList(org_unit_id){
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
				$("#organization_doc_division_id").empty();
				$("#organization_doc_division_id").append("<option value='0' selected>--Select Division--</option>");
				for (var i=0;i<data.team_info.length;i++)
				{				
					$("#organization_doc_division_id").append("<option value='"+data.team_info[i].id+"'>"+data.team_info[i].name+"</option>");
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
function employee_report_doc_search(status){
	$('.lobibox-close').trigger('click');//close previous lobibox
	if(employee_doc_report_form_validation() && $("#organization_did  option:selected").val() != 0){
		var fname = $('#employee_dfname').val() != undefined ? $('#employee_dfname').val() : '';
		var lname = $('#employee_dlname').val() != undefined ? $('#employee_dlname').val() : '';
		var emp_id = $('#employee_did').val() != undefined ? $('#employee_did').val() : '';
		var role = $('#employee_drole option:selected').val() != '0' ? $('#employee_drole option:selected').val() : '';
		var org_id = $('#organization_did option:selected').val() != '0' ? $('#organization_did option:selected').val() : '';
		var org_unit_id = $('#organization_unit_did option:selected').val() != '0' ? $('#organization_unit_did option:selected').val() : '';
		var org_division = $('#organization_doc_division_id option:selected').val() != '0' ? $('#organization_doc_division_id option:selected').val() : '';
		var gender_id = $('#employee_dgender option:selected').val() != '0' ? $('#employee_dgender option:selected').val() : '';
		employeeDocReportData("/hrms_employee_doc_report_list_search/",{'fname':fname,'lname':lname,'role':role,'org_id':org_id,'org_unit_id':org_unit_id,'org_div':org_division,'gender_id':gender_id,'emp_id':emp_id},1);
		alert_lobibox("success",sysparam_datas_list['NTE_58']);
	}else{
		plaindatatable_btn("employee_doc_report_details",[],doc_columns,0);
	}
}

//clear function here
function employee_report_doc_clear(){
	$('#employee_doc_report_form')[0].reset();
	$('#organization_did,#organization_doc_division_id,#employee_dgender,#employee_drole').val(0).trigger('change');
	$('.errormessage').html('');
	employeeDocReportData("/hrms_employee_doc_report_list/",{'id':0},0);
}

//jquery attendance validation
jQuery.validator.addMethod('valueNotEquals', function (value) {
  return (value != '0');
}, "year required");
$('.select2').select2().change(function(){
	$('.errorTxts').html('');
});
$('#employee_doc_report_form').submit(function(e) {
  e.preventDefault();
}).validate({
 rules: {
	   organization_did: {
		   required: true,
		   valueNotEquals:true,
	   }, 
 },
 //For custom messages
 messages: {
	 organization_did: {
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
function employee_doc_report_form_validation()
{
	return $('#employee_doc_report_form').valid();
}

//download file 
function downloadFile(e){
	var file_path = e.id;
	var a = document.createElement('A');
	a.href = file_path;
	a.download = file_path.substr(file_path.lastIndexOf('/') + 1);
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
}