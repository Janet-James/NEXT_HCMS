var interview_columns = [{"title":"ID"}, {"title":"No."}, {"title":"Name"}, {"title":"Status"},{"title":"Rating"},{"title":"Interview Date"}];
$(document).ready(function(){
	plaindatatable_btn("interview_report_details",[],interview_columns,0);
});

//tags values 
function add_tags_interview_values(){
	$('.tab1f .bootstrap-tagsinput input').val('');
	$('#interview_searchtags').tagsinput('removeAll');
	var org =  $("#interview_organization_id  option:selected").val() != 0 ? $("#interview_searchtags").tagsinput('add', { id: 'interview_organization_id', label: 'Organization' }):'';
	var org_unit =  $("#interview_organization_unit_id  option:selected").val() != 0 ? $("#interview_searchtags").tagsinput('add', { id: 'interview_organization_unit_id', label: 'Organization Unit' }):'';
	var org_division =  $("#organization_interview_division_id  option:selected").val() != 0 ? $("#interview_searchtags").tagsinput('add', { id: 'organization_interview_division_id', label: 'Division' }):'';
	var interview_status =  $("#interview_status  option:selected").val() != 0 ? $("#interview_searchtags").tagsinput('add', { id: 'interview_status', label: 'Interview Status' }):'';
	var interview_date = $('#interview_date').val() ? $("#interview_searchtags").tagsinput('add', { id: 'interview_date', label: "Interview Date" }) : '';
	//employee_report_search(0);
}
$('#interview_searchtags').on('itemRemoved', function(event) {
	  $('.tab1f .bootstrap-tagsinput input').val('');
	  var status = 'interview_organization_id'== event.item.id ? $('#interview_organization_id').val('0').trigger("change"): 'interview_organization_unit_id'== event.item.id ? $('#interview_organization_unit_id').val('0').trigger("change"): 'organization_interview_division_id'== event.item.id ? $('#organization_interview_division_id').val('0').trigger("change"):'interview_status'== event.item.id ? $('#interview_status').val('0').trigger("change"):  $('#'+event.item.id).val('');
	});
//org unit
function interviewOrglUnitFunction(e){
	add_tags_interview_values();
}
//org division 
function interviewOrgDivisionFunction(e){
	let status = $("#organization_interview_division_id").val() !=0 ? add_tags_interview_values() : '';
}
//interview status
function interviewStatusFunction(e){
	add_tags_interview_values();
}
//interview date
function interviewDateFunction(e){
	add_tags_interview_values();
}

//employee report table data 
function jobInterviewReportData(urls,datas,id){
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
			plaindatatable_btn("interview_report_details",[],interview_columns,0);
		}else{
			plaindatatable_btn("interview_report_details",data.datas,interview_columns,0,'NEXT_TRANSFORM_HCMS_DOW_INTERVIEW_'+currentDate());
		}
		
	});
}

//org change
$("#interview_organization_id").change(function() {
		interview_org_unit($("#interview_organization_id  option:selected").val())
});

//org unit change
$("#interview_organization_unit_id").change(function() {
		let org_unit_id = $("#interview_organization_unit_id  option:selected").val();
		if(org_unit_id != 0){
			divisionInterviewList(org_unit_id);
		}else{
			$("#organization_interview_division_id").empty();
			$("#organization_interview_division_id").append("<option value='0' selected>--Select Division--</option>");
		}
});

function divisionInterviewList(org_unit_id){
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
				$("#organization_interview_division_id").empty();
				$("#organization_interview_division_id").append("<option value='0' selected>--Select Division--</option>");
				for (var i=0;i<data.team_info.length;i++)
				{				
					$("#organization_interview_division_id").append("<option value='"+data.team_info[i].id+"'>"+data.team_info[i].name+"</option>");
				}
		}
	});
}
//org unit
function interview_org_unit(val){
	$.ajax({
		url : "/hrms_org_unit_change_structure_data/",
		type : "GET",
		data : {'id':val},
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		datas = JSON.parse(json_data);
		dropDownInterviewList(datas.results,'interview_organization_unit_id');
	});
}

//drop down list
function dropDownInterviewList(data,id){
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
function interview_report_search(status){
	$('.lobibox-close').trigger('click');//close previous lobibox
	if(interview_report_form_validation() && $("#interview_organization_id  option:selected").val() != 0){
		var interview_date = $('#interview_date').val() != undefined ? $('#interview_date').val() : '';
		var interview_status = $('#interview_status option:selected').val() != '0' ? $('#interview_status option:selected').val() : '';
		var org_id = $('#interview_organization_id option:selected').val() != '0' ? $('#interview_organization_id option:selected').val() : '';
		var org_unit_id = $('#interview_organization_unit_id option:selected').val() != '0' ? $('#interview_organization_unit_id option:selected').val() : '';
		var org_division = $('#organization_interview_division_id option:selected').val() != '0' ? $('#organization_interview_division_id option:selected').val() : '';
		jobInterviewReportData("/interview_report_list_search/",{'date':interview_date,'status':interview_status,'org_id':org_id,'org_unit_id':org_unit_id,'org_div':org_division},1);
		alert_lobibox("success",sysparam_datas_list['NTE_58']);
	}else{
		plaindatatable_btn("interview_report_details",[],interview_columns,0);
	}
}

//clear function here
function interview_report_clear(){
	$('#interview_report_form')[0].reset();
	$('#interview_organization_id,#interview_organization_unit_id,#interviewOrgDivisionFunction,#interview_status').val(0).trigger('change');
	$('.errormessage').html('');
	plaindatatable_btn("interview_report_details",[],interview_columns,0);
}

//jquery attendance validation
jQuery.validator.addMethod('valueNotEquals', function (value) {
  return (value != '0');
}, "year required");
$('.select2').select2().change(function(){
	$('.errorTxts').html('');
});
$('#interview_report_form').submit(function(e) {
  e.preventDefault();
}).validate({
 rules: {
	 interview_organization_id: {
		   required: true,
		   valueNotEquals:true,
	   }, 
 },
 //For custom messages
 messages: {
	 interview_organization_id: {
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
function interview_report_form_validation(){
	return $('#interview_report_form').valid();
}
