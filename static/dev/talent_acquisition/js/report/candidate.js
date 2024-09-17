var candidate_columns = [{"title":"ID"}, {"title":"No."}, {"title":"First Name"}, {"title":"Last Name"},{"title":"Primary Email"},{"title":"Job Position"},{"title":"Address"},{"title":"Resume"}];
$(document).ready(function(){
	plaindatatable_btn("candidate_report_details",[],candidate_columns,0);
});

//tags values 
function add_tags_candidate_values(){
	$('.tab1f .bootstrap-tagsinput input').val('');
	$('#candidate_searchtags').tagsinput('removeAll');
	var org =  $("#candidate_organization_id  option:selected").val() != 0 ? $("#candidate_searchtags").tagsinput('add', { id: 'candidate_organization_id', label: 'Organization' }):'';	
	var org_unit =  $("#candidate_organization_unit_id  option:selected").val() != 0 ? $("#candidate_searchtags").tagsinput('add', { id: 'candidate_organization_unit_id', label: 'Organization Unit' }):'';
	var org_division =  $("#organization_can_division_id  option:selected").val() != 0 ? $("#candidate_searchtags").tagsinput('add', { id: 'organization_can_division_id', label: 'Division' }):'';
	var name = $('#candidate_fname').val() ? $("#candidate_searchtags").tagsinput('add', { id: 'candidate_fname', label: "First Name" }) : '';
	var key_name = $('#candidate_lname').val() ? $("#candidate_searchtags").tagsinput('add', { id: 'candidate_lname', label: "Last Name" }) : '';
	//employee_report_search(0);
}
$('#candidate_searchtags').on('itemRemoved', function(event) {
	  $('.tab1f .bootstrap-tagsinput input').val('');
	  var status = 'candidate_organization_id'== event.item.id ? $('#candidate_organization_id').val('0').trigger("change"): 'candidate_organization_unit_id'== event.item.id ? $('#candidate_organization_unit_id').val('0').trigger("change"):'organization_can_division_id'== event.item.id ? $('#organization_can_division_id').val('0').trigger("change"):  $('#'+event.item.id).val('');
	});
//org unit
function candidateOrgUnitFunction(e){
	add_tags_candidate_values();
}
//org division 
function candidateOrgDivisionFunction(e){
	let status = $("#organization_can_division_id").val() !=0 ? add_tags_candidate_values() : '';
}
//job name
function candidateFristFunction(e){
	add_tags_candidate_values();
}
//skill name
function candidateLastFunction(e){
	add_tags_candidate_values();
}

//employee report table data 
function jobCandidateReportData(urls,datas,id){
	$.ajax({
		url : urls,
		type : "GET",
		data : datas,
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		let res_data = JSON.parse(json_data);
		res = res_data.results
		if(id == 0 ){
			plaindatatable_btn("candidate_report_details",[],candidate_columns,0);
		}else{
			
			let interview_candidate_data = []
			let data = res_data.datas;
			for(let i=0; i<data.length; i++){
				var row_datas = []
				var name = data[i][2]+'_'+data[i][3]+'_'+data[i][7];
				var document = '<a style="color: #4090fc;font-size: 18px;" class="resume_download" download="'+name+'" title="'+name+'"  href="'+ta_interview_doc_path+data[i][7]+'"><i class="nf nf-download"></i></a>';
				row_datas = [data[i][0],data[i][1],data[i][2],data[i][3],data[i][4],data[i][5],data[i][6],document]
				interview_candidate_data.push(row_datas)
			}
			plaindatatable_btn("candidate_report_details",interview_candidate_data,candidate_columns,0,'NEXT_TRANSFORM_HCMS_DOW_CANDIDATE_'+currentDate());
		}
	});
}

//org change
$("#candidate_organization_id").change(function() {
		candidate_org_unit($("#candidate_organization_id  option:selected").val())
});

//org unit
function candidate_org_unit(val){
	$.ajax({
		url : "/hrms_org_unit_change_structure_data/",
		type : "GET",
		data : {'id':val},
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		datas = JSON.parse(json_data);
		dropDownCandidateList(datas.results,'candidate_organization_unit_id');
	});
}

//org unit change
$("#candidate_organization_unit_id").change(function() {
		let org_unit_id = $("#candidate_organization_unit_id  option:selected").val();
		if(org_unit_id != 0){
			divisioncList(org_unit_id);
		}else{
			$("#organization_can_division_id").empty();
			$("#organization_can_division_id").append("<option value='0' selected>--Select Division--</option>");
		}
});

function divisioncList(org_unit_id){
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
				$("#organization_can_division_id").empty();
				$("#organization_can_division_id").append("<option value='0' selected>--Select Division--</option>");
				for (var i=0;i<data.team_info.length;i++)
				{				
					$("#organization_can_division_id").append("<option value='"+data.team_info[i].id+"'>"+data.team_info[i].name+"</option>");
				}
		}
	});
}

//drop down list
function dropDownCandidateList(data,id){
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
function candidate_report_search(status){
	$('.lobibox-close').trigger('click');//close previous lobibox
	if(candidate_report_form_validation() && $("#candidate_organization_id  option:selected").val() != 0){
		var fname = $('#candidate_fname').val() != undefined ? $('#candidate_fname').val() : '';
		var lname = $('#candidate_lname').val() != undefined ? $('#candidate_lname').val() : '';
		var org_id = $('#candidate_organization_id option:selected').val() != '0' ? $('#candidate_organization_id option:selected').val() : '';
		var org_unit_id = $('#candidate_organization_unit_id option:selected').val() != '0' ? $('#candidate_organization_unit_id option:selected').val() : '';
		var org_division = $('#organization_can_division_id option:selected').val() != '0' ? $('#organization_can_division_id option:selected').val() : '';
		jobCandidateReportData("/candidate_report_list_search/",{'fname':fname,'lname':lname,'org_id':org_id,'org_unit_id':org_unit_id,'org_div':org_division},1);
		alert_lobibox("success",sysparam_datas_list['NTE_58']);
	}else{
		plaindatatable_btn("candidate_report_details",[],candidate_columns,0);
	}
}

//clear function here
function candidate_report_clear(){
	$('#candidate_report_form')[0].reset();
	$('#candidate_organization_id,#candidate_organization_unit_id,#organization_can_division_id').val(0).trigger('change');
	$('.errormessage').html('');
	plaindatatable_btn("candidate_report_details",[],candidate_columns,0);
}

//jquery attendance validation
jQuery.validator.addMethod('valueNotEquals', function (value) {
  return (value != '0');
}, "year required");
$('.select2').select2().change(function(){
	$('.errorTxts').html('');
});
$('#candidate_report_form').submit(function(e) {
  e.preventDefault();
}).validate({
 rules: {
	 candidate_organization_id: {
		   required: true,
		   valueNotEquals:true,
	   }, 
 },
 //For custom messages
 messages: {
	 candidate_organization_id: {
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
function candidate_report_form_validation(){
	return $('#candidate_report_form').valid();
}
