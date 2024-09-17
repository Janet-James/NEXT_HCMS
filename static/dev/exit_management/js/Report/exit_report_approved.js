var approved_columns = [{"title":"ID"}, {"title":"No."}, {"title":"First Name"},{"title":"Last Name"},{"title":"Resignation Date"},{"title":"Relieving Date"},{"title":"Relieving Status"}];
$(document).ready(function(){
	plaindatatable_btn("approved_report_details",[],approved_columns,0);
	$('#exit_approved_searchtags').tagsinput({
	    allowDuplicates: false,
	    itemValue: 'id',  // this will be used to set id of tag
	    itemText: 'label', // this will be used to set text of tag
	    freeInput: false,
	});
	$("#date1,#date2").DateTimePicker({
		dateTimeFormat : "dd-MM-yyyy"
	});
});

//tags values 
function add_tags_approved_values(){
	$('.tab1f .bootstrap-tagsinput input').val('');
	$('#exit_approved_searchtags').tagsinput('removeAll');
	var org =  $("#approved_organization_id  option:selected").val() != 0 ? $("#exit_approved_searchtags").tagsinput('add', { id: 'approved_organization_id', label: 'Organization' }):'';	
	var org_unit =  $("#approved_organization_unit_id  option:selected").val() != 0 ? $("#exit_approved_searchtags").tagsinput('add', { id: 'approved_organization_unit_id', label: 'Organization Unit' }):'';
	var org_division =  $("#organization_approved_division_id  option:selected").val() != 0 ? $("#exit_approved_searchtags").tagsinput('add', { id: 'organization_approved_division_id', label: 'Division' }):'';
	var first_name = $('#approved_first_name').val() ? $("#exit_approved_searchtags").tagsinput('add', { id: 'approved_first_name', label: "First Name" }) : '';
	var last_name = $('#approved_last_name').val() ? $("#exit_approved_searchtags").tagsinput('add', { id: 'approved_last_name', label: "Last Name" }) : '';
	var from_date = $('#approved_from_date').val() ? $("#exit_approved_searchtags").tagsinput('add', { id: 'approved_from_date', label: "From Date" }) : '';
	var to_date = $('#approved_to_date').val() ? $("#exit_approved_searchtags").tagsinput('add', { id: 'approved_to_date', label: "To Date" }) : '';
}

$('#exit_approved_searchtags').on('itemRemoved', function(event) {	  
	  $('.tab1f .bootstrap-tagsinput input').val('');
	  var status = 'approved_organization_id'== event.item.id ? $('#approved_organization_id').val('0').trigger("change"): 'approved_organization_unit_id'== event.item.id ? $('#approved_organization_unit_id').val('0').trigger("change"): 'organization_approved_division_id'== event.item.id ? $('#organization_approved_division_id').val('0').trigger("change"): $('#'+event.item.id).val('');	   
});

//org unit
function approvedOrgUnitFunction(e){
	add_tags_approved_values();
}
//org division 
function approvedOrgDivisionFunction(e){
	let status = $("#organization_approved_division_id").val() !=0 ? add_tags_approved_values() : '';
}
//First Name
function approvedFirstNameFunction(e){
	add_tags_approved_values();
}
//Last Name
function approvedLastNameFunction(e){
	add_tags_approved_values();
}
//From Date
function approvedFromDateFunction(e){
	add_tags_approved_values();
}
// To Date
function approvedToDateFunction(e){
	add_tags_approved_values();
}

//employee report table data 
function approvedReportData(urls,datas,id){
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
			plaindatatable_btn("approved_report_details",[],approved_columns,0);			
		}else{
			plaindatatable_btn("approved_report_details",res,approved_columns,0,'NEXT_TRANSFORM_HCMS_DOW_APPROVED_'+currentDate());
		}		
	});
}

//org change
$("#approved_organization_id").change(function() {
	approved_org_unit($("#approved_organization_id  option:selected").val())
});

//org unit
function approved_org_unit(val){
	$.ajax({
		url : "/hrms_org_unit_change_structure_data/",
		type : "GET",
		data : {'id':val},
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		datas = JSON.parse(json_data);
		dropDownapprovedList(datas.results,'approved_organization_unit_id');
	});
}

//org unit change
$("#approved_organization_unit_id").change(function() {
		let org_unit_id = $("#approved_organization_unit_id  option:selected").val();
		if(org_unit_id != 0){
			divisionApprovedList(org_unit_id);
		}else{
			$("#organization_approved_division_id").empty();
			$("#organization_approved_division_id").append("<option value='0' selected>--Select Division--</option>");
		}
});

function divisionApprovedList(org_unit_id){
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
				$("#organization_approved_division_id").empty();
				$("#organization_approved_division_id").append("<option value='0' selected>--Select Division--</option>");
				for (var i=0;i<data.team_info.length;i++)
				{				
					$("#organization_approved_division_id").append("<option value='"+data.team_info[i].id+"'>"+data.team_info[i].name+"</option>");
				}
		}
	});
}

//drop down list
function dropDownapprovedList(data,id){
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
function approved_report_search(status){
	$('.lobibox-close').trigger('click');//close previous lobibox
	if(approved_report_form_validation() && $("#approved_organization_id  option:selected").val() != 0){
		var fname = $('#approved_first_name').val() != undefined ? $('#approved_first_name').val() : '';
		var lname = $('#approved_last_name').val() != undefined ? $('#approved_last_name').val() : '';
		var org_id = $('#approved_organization_id option:selected').val() != '0' ? $('#approved_organization_id option:selected').val() : '';
		var org_unit_id = $('#approved_organization_unit_id option:selected').val() != '0' ? $('#approved_organization_unit_id option:selected').val() : '';
		var org_division = $('#organization_approved_division_id option:selected').val() != '0' ? $('#organization_approved_division_id option:selected').val() : '';
		var from_date = $('#approved_from_date').val() != undefined ? DateformatChange($('#approved_from_date').val()):'';
		var to_date = $('#approved_to_date').val() != undefined ? DateformatChange($('#approved_to_date').val()) : '';
		var department_approved = $('#department_approved').prop("checked");
		var hr_approved = $('#hr_approved').prop("checked");
		approvedReportData("/approved_report_list_search/",{'fname':fname,'lname':lname,'org_id':org_id,'org_unit_id':org_unit_id,'org_div':org_division,'from_date':from_date,'to_date':to_date,'department':department_approved,'hr':hr_approved},1);
		alert_lobibox("success",sysparam_datas_list['NTE_58']);
	}else{
		plaindatatable_btn("approved_report_details",[],approved_columns,0);
	}
}

//clear function here
function approved_report_clear(){
	$('#approved_report_form')[0].reset();
	$('#approved_from_date,#approved_to_date').val('');
	$(".date_input_class").trigger('change');
	$('#approved_organization_id,#approved_organization_unit_id,#organization_approved_division_id').val(0).trigger('change');
	$('.errormessage').html('');
	plaindatatable_btn("approved_report_details",[],approved_columns,0);
}

//jquery attendance validation
jQuery.validator.addMethod('valueNotEquals', function (value) {
  return (value != '0');
}, "year required");

$('.select2').select2().change(function(){
	$('.errorTxts').html('');
});

$('#approved_from_date,#approved_to_date').change(function(){
	var from_date = $('#approved_from_date').val()
	var to_date = $('#approved_to_date').val()
	
	if(from_date !='' && to_date !=''){
		var date_greater = compareTwoDates(from_date,to_date);
		if(date_greater==false){
			$('#approved_to_date_error').html("To date cannot be lesser than or Equal to From Date")
		}else{
			$('#approved_to_date_error').html("")
		}
	}
});


$('#approved_report_form').submit(function(e) {
  e.preventDefault();
}).validate({
 rules: {
	 approved_organization_id: {
		   required: true,
		   valueNotEquals:true,
	   }, 
 },
 //For custom messages
 messages: {
	 approved_organization_id: {
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
function approved_report_form_validation(){
	return $('#approved_report_form').valid();
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
