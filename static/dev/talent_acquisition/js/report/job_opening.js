var job_opening_columns = [{"title":"ID"}, {"title":"No."}, {"title":"Name"}, {"title":"Open Date"},{"title":"Closed Date"},{"title":"Salary"},{"title":"Number of Position"}];
$(document).ready(function(){
	plaindatatable_btn("job_opening_report_details",[],job_opening_columns,0);
	$('#job_opening_searchtags,#candidate_searchtags,#interview_searchtags,#offer_searchtags,#candidate_hired_searchtags').tagsinput({
			    allowDuplicates: false,
			    itemValue: 'id',  // this will be used to set id of tag
			    itemText: 'label', // this will be used to set text of tag
			    freeInput: false,
			});
});

//tags values 
function add_tags_job_opening_values(){
	$('.tab1f .bootstrap-tagsinput input').val('');
	$('#job_opening_searchtags').tagsinput('removeAll');
	var org =  $("#job_organization_id  option:selected").val() != 0 ? $("#job_opening_searchtags").tagsinput('add', { id: 'job_organization_id', label: 'Organization' }):'';
	var org_unit =  $("#job_organization_unit_id  option:selected").val() != 0 ? $("#job_opening_searchtags").tagsinput('add', { id: 'job_organization_unit_id', label: 'Organization Unit' }):'';
	var org_division =  $("#organization_emp_division_id  option:selected").val() != 0 ? $("#job_opening_searchtags").tagsinput('add', { id: 'organization_emp_division_id', label: 'Division' }):'';
	var name = $('#job_name').val() ? $("#job_opening_searchtags").tagsinput('add', { id: 'job_name', label: "Job Name" }) : '';
	var key_name = $('#key_name').val() ? $("#job_opening_searchtags").tagsinput('add', { id: 'key_name', label: "Key Skills" }) : '';
	//employee_report_search(0);
}
$('#job_opening_searchtags').on('itemRemoved', function(event) {
	  $('.tab1f .bootstrap-tagsinput input').val('');
	  var status = 'job_organization_id'== event.item.id ? $('#job_organization_id').val('0').trigger("change"): 'job_organization_unit_id'== event.item.id ? $('#job_organization_unit_id').val('0').trigger("change"): 'organization_emp_division_id'== event.item.id ? $('#organization_emp_division_id').val('0').trigger("change"): $('#'+event.item.id).val('');
	});
//org unit
function jobOpeningOrgUnitFunction(e){
	add_tags_job_opening_values();
}
//org division 
function employeeOrgDivisionFunction(e){
	let status = $("#organization_emp_division_id").val() !=0 ? add_tags_job_opening_values() : '';
}
//job name
function jobOpeningNameFunction(e){
	add_tags_job_opening_values();
}
//skill name
function jobOpeningKeyNameFunction(e){
	add_tags_job_opening_values();
}

//org unit change
$("#job_organization_unit_id").change(function() {
		let org_unit_id = $("#job_organization_unit_id  option:selected").val();
		if(org_unit_id != 0){
			divisionList(org_unit_id);
		}else{
			$("#organization_emp_division_id").empty();
			$("#organization_emp_division_id").append("<option value='0' selected>--Select Division--</option>");
		}
});

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
//employee report table data 
function jobOpeningReportData(urls,datas,id){
	$.ajax({
		url : urls,
		type : "GET",
		data : datas,
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		res = data.results
		
		if(id == 0 ){
			plaindatatable_btn("job_opening_report_details",[],job_opening_columns,0);			
		}else{
			plaindatatable_btn("job_opening_report_details",data.datas,job_opening_columns,0,'NEXT_TRANSFORM_HCMS_DOW_JOB_OPENING_'+currentDate());
		}
		
	});
}

$("#job_opening_report_details").on("click", "tr", function() { 
	if (!this.rowIndex) return; // skip first row
	var emp_id = $('#job_opening_report_details').dataTable().fnGetData(this)[0];
	localStorage.setItem('emp_id', emp_id);
	window.location = '/ta_report/';
});

//org change
$("#job_organization_id").change(function() {
		job_opening_org_unit($("#job_organization_id  option:selected").val())
});

//org unit
function job_opening_org_unit(val){
	$.ajax({
		url : "/hrms_org_unit_change_structure_data/",
		type : "GET",
		data : {'id':val},
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		datas = JSON.parse(json_data);
		dropJobOpeningDownList(datas.results,'job_organization_unit_id');
	});
}

//drop down list
function dropJobOpeningDownList(data,id){
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
function job_opening_report_search(status){
	$('.lobibox-close').trigger('click');//close previous lobibox
	if(job_opening_report_form_validation() && $("#job_organization_id  option:selected").val() != 0){
		var name = $('#job_name').val() != undefined ? $('#job_name').val() : '';
		var key_name = $('#key_name').val() != undefined ? $('#key_name').val() : '';
		var org_id = $('#job_organization_id option:selected').val() != '0' ? $('#job_organization_id option:selected').val() : '';
		var org_unit_id = $('#job_organization_unit_id option:selected').val() != '0' ? $('#job_organization_unit_id option:selected').val() : '';
		var org_division = $('#organization_emp_division_id option:selected').val() != '0' ? $('#organization_emp_division_id option:selected').val() : '';
		jobOpeningReportData("/ta_job_opening_report_list_search/",{'name':name,'key':key_name,'org_id':org_id,'org_unit_id':org_unit_id,'org_div':org_division},1);
		alert_lobibox("success",sysparam_datas_list['NTE_58']);
	}else{
		plaindatatable_btn("job_opening_report_details",[],job_opening_columns,0);
	}
}

//clear function here
function job_opening_report_clear(){
	$('#job_opening_report_form')[0].reset();
	$('#job_organization_id,#job_organization_unit_id,#organization_emp_division_id').val(0).trigger('change');
	$('.errormessage').html('');
	plaindatatable_btn("job_opening_report_details",[],job_opening_columns,0);
}

//jquery attendance validation
jQuery.validator.addMethod('valueNotEquals', function (value) {
  return (value != '0');
}, "year required");
$('.select2').select2().change(function(){
	$('.errorTxts').html('');
});
$('#job_opening_report_form').submit(function(e) {
  e.preventDefault();
}).validate({
 rules: {
	 job_organization_id: {
		   required: true,
		   valueNotEquals:true,
	   }, 
 },
 //For custom messages
 messages: {
	 job_organization_id: {
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
function job_opening_report_form_validation(){
	return $('#job_opening_report_form').valid();
}
