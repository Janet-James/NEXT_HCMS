var request_columns = [{"title":"ID"}, {"title":"No."}, {"title":"First Name"},{"title":"Last Name"},{"title":"Resignation Date"},{"title":"Relieving Date"}];
$(document).ready(function(){
	plaindatatable_btn("request_report_details",[],request_columns,0);
	$('#exit_req_searchtags,#exit_approved_searchtags,#exit_reject_searchtags').tagsinput({
	    allowDuplicates: false,
	    itemValue: 'id',  // this will be used to set id of tag
	    itemText: 'label', // this will be used to set text of tag
	    freeInput: false,
	});
	$(".date_request").DateTimePicker({
		dateTimeFormat : "dd-MM-yyyy"
	});
});

//tags values 
function add_tags_request_values(){
	$('.tab1f .bootstrap-tagsinput input').val('');
	$('#exit_req_searchtags').tagsinput('removeAll');
	var org =  $("#request_organization_id  option:selected").val() != 0 ? $("#exit_req_searchtags").tagsinput('add', { id: 'request_organization_id', label: 'Organization' }):'';	
	var org_unit =  $("#request_organization_unit_id  option:selected").val() != 0 ? $("#exit_req_searchtags").tagsinput('add', { id: 'request_organization_unit_id', label: 'Organization Unit' }):'';
	var org_division =  $("#organization_request_division_id  option:selected").val() != 0 ? $("#exit_req_searchtags").tagsinput('add', { id: 'organization_request_division_id', label: 'Division' }):'';
	var first_name = $('#request_first_name').val() ? $("#exit_req_searchtags").tagsinput('add', { id: 'request_first_name', label: "First Name" }) : '';
	var last_name = $('#request_last_name').val() ? $("#exit_req_searchtags").tagsinput('add', { id: 'request_last_name', label: "Last Name" }) : '';
	var from_date = $('#request_from_date').val() ? $("#exit_req_searchtags").tagsinput('add', { id: 'request_from_date', label: "From Date" }) : '';
	var to_date = $('#request_to_date').val() ? $("#exit_req_searchtags").tagsinput('add', { id: 'request_to_date', label: "To Date" }) : '';	
}

$('#exit_req_searchtags').on('itemRemoved', function(event) {	  
	  $('.tab1f .bootstrap-tagsinput input').val('');
	  var status = 'request_organization_id'== event.item.id ? $('#request_organization_id').val('0').trigger("change"): 'request_organization_unit_id'== event.item.id ? $('#request_organization_unit_id').val('0').trigger("change"):'organization_request_division_id'== event.item.id ? $('#organization_request_division_id').val('0').trigger("change"):  $('#'+event.item.id).val('');	   
});


$('#request_from_date,#request_to_date').change(function(){
	var from_date = $('#request_from_date').val()
	var to_date = $('#request_to_date').val()
	
	if(from_date !='' && to_date !=''){
		var date_greater = compareTwoDates(from_date,to_date);
		if(date_greater==false){
			$('#request_to_date_error').html("To date cannot be lesser than or Equal to From Date")
		}else{
			$('.errormessage').html(" ")
		}
	}
});

function compareTwoDates(from_date,to_date){
	
	var from_year = new Date(DateformatChange(from_date)).getFullYear()
	var from_month = new Date(DateformatChange(from_date)).getMonth()
	var from_day = new Date(DateformatChange(from_date)).getDate()
	
	var to_year = new Date(DateformatChange(to_date)).getFullYear()
	var to_month = new Date(DateformatChange(to_date)).getMonth()
	var to_day = new Date(DateformatChange(to_date)).getDate()
	
	var from_date = new Date(from_year,from_month,from_day)
	var to_date = new Date(to_year,to_month,to_day)
	
	if(to_date<=from_date){
		return false;
	}else{
		return true;
	}
}

//org unit
function requestOrgUnitFunction(e){
	add_tags_request_values();
}
//org division 
function requestOrgDivisionFunction(e){
	let status = $("#organization_request_division_id").val() !=0 ? add_tags_request_values() : '';
}
//First Name
function requestFirstNameFunction(e){
	add_tags_request_values();
}
//Last Name
function requestLastNameFunction(e){
	add_tags_request_values();
}
// From Date
function requestFromDateFunction(e){
	add_tags_request_values();
}
//To Date
function requestToDateFunction(e){
	add_tags_request_values();
}

//employee report table data 
function requestReportData(urls,datas,id){
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
			plaindatatable_btn("request_report_details",[],request_columns,0);
		}else{
			plaindatatable_btn("request_report_details",res,request_columns,0,'NEXT_TRANSFORM_HCMS_DOW_REQUEST_'+currentDate());
		}		
	});
}

//org change
$("#request_organization_id").change(function() {
	request_org_unit($("#request_organization_id  option:selected").val())
});

//org unit
function request_org_unit(val){
	$.ajax({
		url : "/hrms_org_unit_change_structure_data/",
		type : "GET",
		data : {'id':val},
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		datas = JSON.parse(json_data);
		dropDownrequestList(datas.results,'request_organization_unit_id');
	});
}
//org unit change
$("#request_organization_unit_id").change(function() {
		let org_unit_id = $("#request_organization_unit_id  option:selected").val();
		if(org_unit_id != 0){
			divisionRequestList(org_unit_id);
		}else{
			$("#organization_request_division_id").empty();
			$("#organization_request_division_id").append("<option value='0' selected>--Select Division--</option>");
		}
});

function divisionRequestList(org_unit_id){
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
				$("#organization_request_division_id").empty();
				$("#organization_request_division_id").append("<option value='0' selected>--Select Division--</option>");
				for (var i=0;i<data.team_info.length;i++)
				{				
					$("#organization_request_division_id").append("<option value='"+data.team_info[i].id+"'>"+data.team_info[i].name+"</option>");
				}
		}
	});
}

//drop down list
function dropDownrequestList(data,id){
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
function request_report_search(status){
		$('.lobibox-close').trigger('click');//close previous lobibox
		if(request_report_form_validation() && $("#request_organization_id  option:selected").val() != 0){
			var fname = $('#request_first_name').val() != undefined ? $('#request_first_name').val() : '';
			var lname = $('#request_last_name').val() != undefined ? $('#request_last_name').val() : '';
			var org_id = $('#request_organization_id option:selected').val() != '0' ? $('#request_organization_id option:selected').val() : '';
			var org_unit_id = $('#request_organization_unit_id option:selected').val() != '0' ? $('#request_organization_unit_id option:selected').val() : '';
			var org_division = $('#organization_request_division_id option:selected').val() != '0' ? $('#organization_request_division_id option:selected').val() : '';
			var from_date = $('#request_from_date').val() != undefined ? DateformatChange($('#request_from_date').val()):'';
			var to_date = $('#request_to_date').val() != undefined ? DateformatChange($('#request_to_date').val()) : '';
			requestReportData("/request_report_list_search/",{'fname':fname,'lname':lname,'org_id':org_id,'org_unit_id':org_unit_id,'org_div':org_division,'from_date':from_date,'to_date':to_date},1);
			alert_lobibox("success",sysparam_datas_list['NTE_58']);
		}else{
			plaindatatable_btn("request_report_details",[],request_columns,0);
		}
}

//clear function here
function request_report_clear(){
	$('#request_report_form')[0].reset();
	$('#request_from_date,#request_to_date').val('');
	$(".date_input_class").trigger('change');
	$('#request_organization_id,#request_organization_unit_id,#organization_request_division_id').val(0).trigger('change');
	$('.errormessage').html('');
	plaindatatable_btn("request_report_details",[],request_columns,0);
}

//jquery attendance validation
jQuery.validator.addMethod('valueNotEquals', function (value) {
  return (value != '0');
}, "year required");

$('.select2').select2().change(function(){
	$('.errorTxts').html('');
});

$('#request_report_form').submit(function(e) {
  e.preventDefault();
}).validate({
 rules: {
	 request_organization_id: {
		   required: true,
		   valueNotEquals:true,
	   }, 
 },
 //For custom messages
 messages: {
	 request_organization_id: {
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
function request_report_form_validation(){
	return $('#request_report_form').valid();
}


function DateformatChange(val){
	if(val)
	{	
		return val.split('-')[2]+'-'+val.split('-')[1]+'-'+val.split('-')[0]
	}else
	{
		return null;
	}	
}
