var reject_columns = [{"title":"ID"}, {"title":"No."}, {"title":"First Name"},{"title":"Last Name"},{"title":"Resignation Date"},{"title":"Relieving Date"},{"title":"Relieving Status"}];
$(document).ready(function(){
	plaindatatable_btn("reject_report_details",[],reject_columns,0);
	$('#exit_req_searchtags,#exit_approved_searchtags,#exit_reject_searchtags').tagsinput({
	    allowDuplicates: false,
	    itemValue: 'id',  // this will be used to set id of tag
	    itemText: 'label', // this will be used to set text of tag
	    freeInput: false,
	});
	$(".date_reject").DateTimePicker({
		dateTimeFormat : "dd-MM-yyyy"
	});
});

//tags values 
function add_tags_reject_values(){
	$('.tab1f .bootstrap-tagsinput input').val('');
	$('#exit_reject_searchtags').tagsinput('removeAll');
	var org =  $("#reject_organization_id  option:selected").val() != 0 ? $("#exit_reject_searchtags").tagsinput('add', { id: 'reject_organization_id', label: 'Organization' }):'';	
	var org_unit =  $("#reject_organization_unit_id  option:selected").val() != 0 ? $("#exit_reject_searchtags").tagsinput('add', { id: 'reject_organization_unit_id', label: 'Organization Unit' }):'';
	var org_division =  $("#organization_rejected_division_id  option:selected").val() != 0 ? $("#exit_reject_searchtags").tagsinput('add', { id: 'organization_rejected_division_id', label: 'Division' }):'';
	var first_name = $('#reject_first_name').val() ? $("#exit_reject_searchtags").tagsinput('add', { id: 'reject_first_name', label: "First Name" }) : '';
	var last_name = $('#reject_last_name').val() ? $("#exit_reject_searchtags").tagsinput('add', { id: 'reject_last_name', label: "Last Name" }) : '';
	var from_date = $('#reject_from_date').val() ? $("#exit_reject_searchtags").tagsinput('add', { id: 'reject_from_date', label: "From Date" }) : '';
	var to_date = $('#reject_to_date').val() ? $("#exit_reject_searchtags").tagsinput('add', { id: 'reject_to_date', label: "To Date" }) : '';
}

$('#exit_reject_searchtags').on('itemRemoved', function(event) {	  
	$('.tab1f .bootstrap-tagsinput input').val('');
	var status = 'reject_organization_id'== event.item.id ? $('#reject_organization_id').val('0').trigger("change"): 'reject_organization_unit_id'== event.item.id ? $('#reject_organization_unit_id').val('0').trigger("change"):'organization_rejected_division_id'== event.item.id ? $('#organization_rejected_division_id').val('0').trigger("change"):  $('#'+event.item.id).val('');	   
});

//org unit
function rejectOrgUnitFunction(e){
	add_tags_reject_values();
}
//org division 
function rejectedOrgDivisionFunction(e){
	let status = $("#organization_rejected_division_id").val() !=0 ? add_tags_reject_values() : '';
}
//First Name
function rejectFirstNameFunction(e){
	add_tags_reject_values();
}
//Last Name
function rejectLastNameFunction(e){
	add_tags_reject_values();
}
//From Date
function rejectFromDateFunction(e){
	add_tags_reject_values();
}
//To Date
function rejectToDateFunction(e){
	add_tags_reject_values();
}

//employee report table data 
function rejectedReportData(urls,datas,id){
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
			plaindatatable_btn("reject_report_details",[],reject_columns,0);
		}else{
			plaindatatable_btn("reject_report_details",res,reject_columns,0,'NEXT_TRANSFORM_HCMS_DOW_REJECT_'+currentDate());
		}		
	});
}

//org change
$("#reject_organization_id").change(function() {
	reject_org_unit($("#reject_organization_id  option:selected").val())
});

//org unit
function reject_org_unit(val){
	$.ajax({
		url : "/hrms_org_unit_change_structure_data/",
		type : "GET",
		data : {'id':val},
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		datas = JSON.parse(json_data);
		dropDownrejectList(datas.results,'reject_organization_unit_id');
	});
}

//org unit change
$("#reject_organization_unit_id").change(function() {
		let org_unit_id = $("#reject_organization_unit_id  option:selected").val();
		if(org_unit_id != 0){
			divisionRejectedList(org_unit_id);
		}else{
			$("#organization_rejected_division_id").empty();
			$("#organization_rejected_division_id").append("<option value='0' selected>--Select Division--</option>");
		}
});

function divisionRejectedList(org_unit_id){
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
				$("#organization_rejected_division_id").empty();
				$("#organization_rejected_division_id").append("<option value='0' selected>--Select Division--</option>");
				for (var i=0;i<data.team_info.length;i++)
				{				
					$("#organization_rejected_division_id").append("<option value='"+data.team_info[i].id+"'>"+data.team_info[i].name+"</option>");
				}
		}
	});
}
//drop down list
function dropDownrejectList(data,id){
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
function reject_report_search(status){
		$('.lobibox-close').trigger('click');//close previous lobibox
		if(reject_report_form_validation() && $("#reject_organization_id  option:selected").val() != 0){
			var fname = $('#reject_first_name').val() != undefined ? $('#reject_first_name').val() : '';
			var lname = $('#reject_last_name').val() != undefined ? $('#reject_last_name').val() : '';
			var org_id = $('#reject_organization_id option:selected').val() != '0' ? $('#reject_organization_id option:selected').val() : '';
			var org_unit_id = $('#reject_organization_unit_id option:selected').val() != '0' ? $('#reject_organization_unit_id option:selected').val() : '';
			var org_division = $('#organization_rejected_division_id option:selected').val() != '0' ? $('#organization_rejected_division_id option:selected').val() : '';
			var from_date = $('#reject_from_date').val() != undefined ? DateformatChange($('#reject_from_date').val()):'';
			var to_date = $('#reject_to_date').val() != undefined ? DateformatChange($('#reject_to_date').val()) : '';
			var department_rejected = $('#department_rejected').prop("checked"); 
			var hr_rejected = $('#hr_rejected').prop("checked");
			rejectedReportData("/rejected_report_list_search/",{'fname':fname,'lname':lname,'org_id':org_id,'org_unit_id':org_unit_id,'org_div':org_division,'from_date':from_date,'to_date':to_date,'department':department_rejected,'hr':hr_rejected},1);			
			alert_lobibox("success",sysparam_datas_list['NTE_58']);
		}else{
			plaindatatable_btn("reject_report_details",[],reject_columns,0);
		}
}

//clear function here
function reject_report_clear(){
	$('#reject_report_form')[0].reset();
	$('#reject_organization_id,#reject_organization_unit_id,#organization_rejected_division_id').val(0).trigger('change');
	$('#reject_from_date,#reject_to_date').val('');
	$(".date_input_class").trigger('change');
	$('.errormessage').html('');
	plaindatatable_btn("reject_report_details",[],reject_columns,0);
}

$('#reject_from_date,#reject_to_date').change(function(){
	var from_date = $('#reject_from_date').val()
	var to_date = $('#reject_to_date').val()
	
	if(from_date !='' && to_date !=''){
		var date_greater = compareTwoDates(from_date,to_date);
		if(date_greater==false){
			$('#reject_to_date_error').html("To date cannot be lesser than or Equal to From Date")
		}else{
			$('#reject_to_date_error').html("")
		}
	}
});

//jquery attendance validation
jQuery.validator.addMethod('valueNotEquals', function (value) {
  return (value != '0');
}, "year required");

$('.select2').select2().change(function(){
	$('.errorTxts').html('');
});

$('#reject_report_form').submit(function(e) {
  e.preventDefault();
}).validate({
 rules: {
	 reject_organization_id: {
		   required: true,
		   valueNotEquals:true,
	   }, 
 },
 //For custom messages
 messages: {
	 reject_organization_id: {
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
function reject_report_form_validation(){
	return $('#reject_report_form').valid();
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
