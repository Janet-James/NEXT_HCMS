var offer_columns = [{"title":"ID"}, {"title":"No."}, {"title":"Name"}, {"title":"Job Name"},{"title":"Offer Status"}];
$(document).ready(function(){
	plaindatatable_btn("offer_report_details",[],offer_columns,0);
});

//tags values 
function add_tags_offer_values(){
	$('.tab1f .bootstrap-tagsinput input').val('');
	$('#offer_searchtags').tagsinput('removeAll');
	var org =  $("#offer_organization_id  option:selected").val() != 0 ? $("#offer_searchtags").tagsinput('add', { id: 'offer_organization_id', label: 'Organization' }):'';
	var org_unit =  $("#offer_organization_unit_id  option:selected").val() != 0 ? $("#offer_searchtags").tagsinput('add', { id: 'offer_organization_unit_id', label: 'Organization Unit' }):'';
	var org_division =  $("#organization_offer_division_id  option:selected").val() != 0 ? $("#offer_searchtags").tagsinput('add', { id: 'organization_offer_division_id', label: 'Division' }):'';
	var job_opening_name =  $("#job_opening_name  option:selected").val() != 0 ? $("#offer_searchtags").tagsinput('add', { id: 'job_opening_name', label: 'Job Name' }):'';
	var job_status =  $("#job_status  option:selected").val() != 0 ? $("#offer_searchtags").tagsinput('add', { id: 'job_status', label: 'Job Status' }):'';
	//employee_report_search(0);
}
$('#offer_searchtags').on('itemRemoved', function(event) {
	  $('.tab1f .bootstrap-tagsinput input').val('');
	  var status = 'offer_organization_id'== event.item.id ? $('#offer_organization_id').val('0').trigger("change"): 'offer_organization_unit_id'== event.item.id ? $('#offer_organization_unit_id').val('0').trigger("change"):'organization_offer_division_id'== event.item.id ? $('#organization_offer_division_id').val('0').trigger("change"):'job_opening_name'== event.item.id ? $('#job_opening_name').val('0').trigger("change"):'job_status'== event.item.id ? $('#job_status').val('0').trigger("change"):  $('#'+event.item.id).val('');
	});
//org unit
function offerOrglUnitFunction(e){
	add_tags_offer_values();
}
//org division 
function offerOrgDivisionFunction(e){
	let status = $("#organization_offer_division_id").val() !=0 ? add_tags_offer_values() : '';
}
//job status
function offerJobStatusFunction(e){
	add_tags_offer_values();
} 
//job name
function offerJobNameFunction(e){
	add_tags_offer_values();
}

//employee report table data 
function jobOfferReportData(urls,datas,id){
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
			plaindatatable_btn("offer_report_details",[],offer_columns,0);
		}else{
			plaindatatable_btn("offer_report_details",data.datas,offer_columns,0,'NEXT_TRANSFORM_HCMS_DOW_OFFER_'+currentDate());
		}
		
	});
}

//org change
$("#offer_organization_id").change(function() {
		offer_org_unit($("#offer_organization_id  option:selected").val())
});

//org unit
function offer_org_unit(val){
	$.ajax({
		url : "/hrms_org_unit_change_structure_data/",
		type : "GET",
		data : {'id':val},
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		datas = JSON.parse(json_data);
		dropDownOfferList(datas.results,'offer_organization_unit_id');
	});
}
//org unit change
$("#offer_organization_unit_id").change(function() {
		let org_unit_id = $("#offer_organization_unit_id  option:selected").val();
		if(org_unit_id != 0){
			divisionOfferList(org_unit_id);
		}else{
			$("#organization_offer_division_id").empty();
			$("#organization_offer_division_id").append("<option value='0' selected>--Select Division--</option>");
		}
});

function divisionOfferList(org_unit_id){
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
				$("#organization_offer_division_id").empty();
				$("#organization_offer_division_id").append("<option value='0' selected>--Select Division--</option>");
				for (var i=0;i<data.team_info.length;i++)
				{				
					$("#organization_offer_division_id").append("<option value='"+data.team_info[i].id+"'>"+data.team_info[i].name+"</option>");
				}
		}
	});
}
//drop down list
function dropDownOfferList(data,id){
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
function offer_report_search(status){
	$('.lobibox-close').trigger('click');//close previous lobibox
	if(offer_report_form_validation() && $("#offer_organization_id  option:selected").val() != 0){
		var org_id = $('#offer_organization_id option:selected').val() != '0' ? $('#offer_organization_id option:selected').val() : '';
		var org_unit_id = $('#offer_organization_unit_id option:selected').val() != '0' ? $('#offer_organization_unit_id option:selected').val() : '';
		var job_opening_name = $('#job_opening_name option:selected').val() != '0' ? $('#job_opening_name option:selected').val() : '';
		var job_status = $('#job_status option:selected').val() != '0' ? $('#job_status option:selected').val() : '';
		var org_division = $('#organization_offer_division_id option:selected').val() != '0' ? $('#organization_offer_division_id option:selected').val() : '';
		jobOfferReportData("/offer_report_list_search/",{'job_name':job_opening_name,'job_status':job_status,'org_id':org_id,'org_unit_id':org_unit_id,'org_div':org_division},1);
		alert_lobibox("success",sysparam_datas_list['NTE_58']);
	}else{
		plaindatatable_btn("offer_report_details",[],offer_columns,0);
	}
}

//clear function here
function offer_report_clear(){
	$('#offer_report_form')[0].reset();
	$('#offer_organization_id,#offer_organization_unit_id,#job_opening_name,#job_status,#organization_offer_division_id').val(0).trigger('change');
	$('.errormessage').html('');
	plaindatatable_btn("offer_report_details",[],offer_columns,0);
}

//jquery attendance validation
jQuery.validator.addMethod('valueNotEquals', function (value) {
  return (value != '0');
}, "year required");
$('.select2').select2().change(function(){
	$('.errorTxts').html('');
});
$('#offer_report_form').submit(function(e) { 
  e.preventDefault();
}).validate({
 rules: {
	 offer_organization_id: {
		   required: true,
		   valueNotEquals:true,
	   }, 
 },
 //For custom messages
 messages: {
	 offer_organization_id: {
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
function offer_report_form_validation(){
	return $('#offer_report_form').valid();
}
