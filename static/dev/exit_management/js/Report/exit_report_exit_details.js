var exit_columns = [{"title":"ID"}, {"title":"No."}, {"title":"First Name"},{"title":"Last Name"},{"title":"Resignation Date"},{"title":"Relieving Date"},{"title":"Relieving Status"}];
$(document).ready(function(){
	plaindatatable_btn("exit_report_details",[],exit_columns,0);
	$('#exit_req_searchtags,#exit_approved_searchtags,#exit_reject_searchtags,#exit_searchtags').tagsinput({
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
function add_tags_exit_values(){
	$('.tab1f .bootstrap-tagsinput input').val('');
	$('#exit_searchtags').tagsinput('removeAll');
	var org =  $("#exit_organization_id  option:selected").val() != 0 ? $("#exit_searchtags").tagsinput('add', { id: 'exit_organization_id', label: 'Organization' }):'';	
	var org_unit =  $("#exit_organization_unit_id  option:selected").val() != 0 ? $("#exit_searchtags").tagsinput('add', { id: 'exit_organization_unit_id', label: 'Organization Unit' }):'';
	var org_division =  $("#organization_exit_division_id  option:selected").val() != 0 ? $("#exit_searchtags").tagsinput('add', { id: 'organization_exit_division_id', label: 'Division' }):'';
	var first_name = $('#exit_first_name').val() ? $("#exit_searchtags").tagsinput('add', { id: 'exit_first_name', label: "First Name" }) : '';
	var last_name = $('#exit_last_name').val() ? $("#exit_searchtags").tagsinput('add', { id: 'exit_last_name', label: "Last Name" }) : '';
	var from_date = $('#exit_from_date').val() ? $("#exit_searchtags").tagsinput('add', { id: 'exit_from_date', label: "From Date" }) : '';
	var to_date = $('#exit_to_date').val() ? $("#exit_searchtags").tagsinput('add', { id: 'exit_to_date', label: "To Date" }) : '';
}

$('#exit_searchtags').on('itemRemoved', function(event) {	  
	  $('.tab1f .bootstrap-tagsinput input').val('');
	  var status = 'exit_organization_id'== event.item.id ? $('#exit_organization_id').val('0').trigger("change"): 'exit_organization_unit_id'== event.item.id ? $('#exit_organization_unit_id').val('0').trigger("change"):'organization_exit_division_id'== event.item.id ? $('#organization_exit_division_id').val('0').trigger("change"):  $('#'+event.item.id).val('');	   
});

//org unit
function exitOrgUnitFunction(e){
	add_tags_exit_values();
}
//org division 
function exitOrgDivisionFunction(e){
	let status = $("#organization_exit_division_id").val() !=0 ? add_tags_exit_values() : '';
}
//First Name
function exitFirstNameFunction(e){
	add_tags_exit_values();
}
//Last Name
function exitLastNameFunction(e){
	add_tags_exit_values();
}
// From Date
function exitFromDateFunction(e){
	add_tags_exit_values();
}
//To Date
function exitToDateFunction(e){
	add_tags_exit_values();
}

//employee report table data 
function exitReportData(urls,datas,id){
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
			plaindatatable_btn("exit_report_details",[],exit_columns,0);
		}else{
			plaindatatable_btn("exit_report_details",res,exit_columns,0,'NEXT_TRANSFORM_HCMS_DOW_REQUEST_'+currentDate());
		}		
	});
}

//org change
$("#exit_organization_id").change(function() {
	exit_org_unit($("#exit_organization_id  option:selected").val())
});

//org unit
function exit_org_unit(val){
	$.ajax({
		url : "/hrms_org_unit_change_structure_data/",
		type : "GET",
		data : {'id':val},
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		datas = JSON.parse(json_data);
		dropDownExitList(datas.results,'exit_organization_unit_id');
	});
}

//org unit change
$("#exit_organization_unit_id").change(function() {
		let org_unit_id = $("#exit_organization_unit_id  option:selected").val();
		if(org_unit_id != 0){
			divisionExitList(org_unit_id);
		}else{
			$("#organization_exit_division_id").empty();
			$("#organization_exit_division_id").append("<option value='0' selected>--Select Division--</option>");
		}
});

function divisionExitList(org_unit_id){
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
				$("#organization_exit_division_id").empty();
				$("#organization_exit_division_id").append("<option value='0' selected>--Select Division--</option>");
				for (var i=0;i<data.team_info.length;i++)
				{				
					$("#organization_exit_division_id").append("<option value='"+data.team_info[i].id+"'>"+data.team_info[i].name+"</option>");
				}
		}
	});
}

//drop down list
function dropDownExitList(data,id){
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

$('#exit_from_date,#exit_to_date').change(function(){
	var from_date = $('#exit_from_date').val()
	var to_date = $('#exit_to_date').val()
	
	if(from_date !='' && to_date !=''){
		var date_greater = compareTwoDates(from_date,to_date);
		if(date_greater){
			$('#exit_to_date_error').html("To date cannot be lesser than or Equal to From Date")
		}else{
			$('#exit_to_date_error').html("")
		}
	}
});

//search function here
function exit_report_search(status){
		$('.lobibox-close').trigger('click');//close previous lobibox
		if(exit_report_form_validation() && $("#exit_organization_id  option:selected").val() != 0){
			var fname = $('#exit_first_name').val() != undefined ? $('#exit_first_name').val() : '';
			var lname = $('#exit_last_name').val() != undefined ? $('#exit_last_name').val() : '';
			var org_id = $('#exit_organization_id option:selected').val() != '0' ? $('#exit_organization_id option:selected').val() : '';
			var org_unit_id = $('#exit_organization_unit_id option:selected').val() != '0' ? $('#exit_organization_unit_id option:selected').val() : '';
			var org_division = $('#organization_exit_division_id option:selected').val() != '0' ? $('#organization_exit_division_id option:selected').val() : '';
			var from_date = $('#exit_from_date').val() != undefined ? DateformatChange($('#exit_from_date').val()):'';
			var to_date = $('#exit_to_date').val() != undefined ? DateformatChange($('#exit_to_date').val()) : '';
			exitReportData("/exit_report_list_search/",{'fname':fname,'lname':lname,'org_id':org_id,'org_unit_id':org_unit_id,'org_div':org_division,'from_date':from_date,'to_date':to_date},1);
			alert_lobibox("success",sysparam_datas_list['NTE_58']);
		}else{
			plaindatatable_btn("exit_report_details",[],exit_columns,0);
		}
}

//clear function here
function exit_report_clear(){
	$('#exit_report_form')[0].reset();
	$('#exit_organization_id,#exit_organization_unit_id,#organization_exit_division_id').val(0).trigger('change');
	$('#exit_from_date,#exit_to_date').val('');
	$(".date_input_class").trigger('change');
	$('.errormessage').html('');
	plaindatatable_btn("exit_report_details",[],exit_columns,0);
}

//jquery attendance validation
jQuery.validator.addMethod('valueNotEquals', function (value) {
  return (value != '0');
}, "year required");

$('.select2').select2().change(function(){
	$('.errorTxts').html('');
});

$('#exit_report_form').submit(function(e) {
  e.preventDefault();
}).validate({
 rules: {
	 exit_organization_id: {
		   required: true,
		   valueNotEquals:true,
	   }, 
 },
 //For custom messages
 messages: {
	 exit_organization_id: {
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
function exit_report_form_validation(){
	return $('#exit_report_form').valid();
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
