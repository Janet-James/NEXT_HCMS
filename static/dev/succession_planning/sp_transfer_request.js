var transfer_request_update_id = "";
var result_data,transfer_status;
$(document).ready(function(){
	button_create(1);
	promotionRequestDataTable();
	$('#right').trigger('click');
	$('#others_div').hide();
});

//Recruitment create function here 
function transfer_request_create_button() {
	if(transfer_form_validation())
	{
		transfer_request_create_function(0);
	}
}

//Recruitment edit function here 
function transfer_request_edit_button() {
	if(transfer_form_validation())
	{
		transfer_request_create_function(transfer_request_update_id);
	}
}

//Transfer cancel function here 
function transfer_request_cancel_button() {
	$('#transfer_request_details_form').trigger("reset");
	$('#organization_employee,#organization,#organization_unit,#organization_division').val('0').trigger('change');
	$('#reason_for_transfer').val('0').trigger('change');
	$('#transfer_category').val('0').trigger('change');
	$('#transfer_type').val('0').trigger('change');
	$('#expected_transfer_date').val('');
	$(".date_input_class").trigger('change');
	$('#transfer_request_notes').val('');
	$('#transfer_others_notes').val('');
}

//cancel clear function call button
function transfer_request_clear_btn_refresh(){
	if(transfer_request_update_id != '' ){
		var title = $('#organization_employee option:selected').text().toString();
		orgClearFuncton('clearConfirmationEvent','',title);
	}else{
		clearConfirmationEvent();
	}
}

//Recruitment clear confirmation
function clearConfirmationEvent(){
	transfer_request_update_id = '';
	$('.errormessage').val('');
	$('#organization_employee,#organization,#organization_unit,#organization_division').val('0').trigger('change');
	$('#reason_for_transfer').val('0').trigger('change');
	$('#transfer_category').val('0').trigger('change');
	$('#transfer_type,#transfer_org,#transfer_org_unit,#transfer_org_division').val('0').trigger('change');
	$('#expected_transfer_date').val('');
	$(".date_input_class").trigger('change');
	$('#transfer_request_notes').val('');
	$('#transfer_others_notes').val('');
	button_create(1);
	$('#transfer_request_details_form')[0].reset();	
	$('.fileinput-filename').html('');
	$('.EmployeeCard').removeClass('custom_dev_acitve');
}

//organization change function here
$('#transfer_org').change(function(){
	org_unit_drop_down_function($('#transfer_org').val())
});

//organization unit change function here
$('#transfer_org_unit').change(function(){
	divisionDropDownFunction($('#transfer_org_unit').val())
});

//organization transfer function here
$('#reason_for_transfer').change(function(){
	if($('#reason_for_transfer').val()=='782'){
		$('#others_div').show();
	}else{
		$('#others_div').hide();
		$('#transfer_others_notes').val('')
	}
});

//division drop down function here
function divisionDropDownFunction(org_unit){
	$.ajax({
		url : "/sp_transfer_division_drop_down/",
		type : "POST",
		data : {"org_unit_id":org_unit},
		csrfmiddlewaretoken : $("input[name=csrfmiddlewaretoken]").val(),
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		if(data.division_info){
				$("#transfer_org_division").empty();
				$("#transfer_org_division").append("<option value='0' selected>--Select Transfer Organization Division--</option>");				
				for (var i=0;i<data.division_info.length;i++)
				{
					$("#transfer_org_division").append("<option value='"+data.division_info[i].id+"'>"+data.division_info[i].name+"</option>");
					$('.errorTxt4').html('');
				}			
		}
	});
}

//organization unit drop down function here
function org_unit_drop_down_function(org_id)
{
	$.ajax({
		url : "/hrms_fetch_org_unit_drop_down/",
		type : "POST",
		data : {"org_id":org_id},
		csrfmiddlewaretoken : $("input[name=csrfmiddlewaretoken]").val(),
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		if(data.org_unit_info){
				$("#transfer_org_unit").empty();
				$("#transfer_org_unit").append("<option value='0' selected>--Select Transfer Organization Unit--</option>");				
				for (var i=0;i<data.org_unit_info.length;i++)
				{
					$("#transfer_org_unit").append("<option value='"+data.org_unit_info[i].id+"'>"+data.org_unit_info[i].orgunit_name+"</option>");
					$('.errorTxt5').html('');
				}			
		}
	});
}


//Transfer create update function here
function transfer_request_create_function(id){
	var project_form_value = getFormValues("#transfer_request_details_form");
	var csrf_data = project_form_value.csrfmiddlewaretoken;
	delete project_form_value["csrfmiddlewaretoken"];	
	project_form_value['is_active'] = "True";
	project_form_value['transfer_employee'] = validationFields_org(project_form_value['organization_employee']);
	project_form_value['reason_for_transfer'] =  validationFields_org(project_form_value['reason_for_transfer']);
	project_form_value['transfer_category'] = validationFields_org(project_form_value['transfer_category']);
	project_form_value['transfer_type'] = validationFields_org(project_form_value['transfer_type']);
	project_form_value['expected_transfer_date'] = DateformatChange(project_form_value['expected_transfer_date']);
	project_form_value['transfer_org'] = validationFields_org(project_form_value['transfer_org']);
	project_form_value['transfer_org_unit'] = validationFields_org(project_form_value['transfer_org_unit']);
	project_form_value['transfer_org_division'] = validationFields_org(project_form_value['transfer_org_division']);
	project_list = [];
	project_dict = {};
	project_list.push(project_form_value);
	project_dict['input_data'] = project_list;
	if(id)
	{
		$.ajax({
			type  : 'POST',
			url   : '/sp_transfer_request_CRUD/',
			async : false,
			data: {
				'datas': JSON.stringify(project_list),
				"table_id":transfer_request_update_id,
				 csrfmiddlewaretoken: csrf_data
			},
		}).done( function(json_data) {
			data = JSON.parse(json_data);
			var res_status = data['status_key'];
			if(res_status == 'NTE_03') {
				alert_lobibox("success", sysparam_datas_list[res_status]);
				button_create(1)
				clearConfirmationEvent();
				promotionRequestDataTable();
			}else if(res_status == 'ERR0028'){
				alert_lobibox("success", "Transfer already requested for this Employee");
			}else{
				alert_lobibox("error", sysparam_datas_list[res_status]);
			}
		});

	}else
	{
		$.ajax({
			type  : 'POST',
			url   : '/sp_transfer_request_CRUD/',
			async : false,
			data: {
				'datas': JSON.stringify(project_list),
				 csrfmiddlewaretoken: csrf_data
			},
		}).done( function(json_data) {
			data = JSON.parse(json_data);
			var res_status = data['status_key'];
			if(res_status == 'NTE_01') {	
				alert_lobibox("success", sysparam_datas_list[res_status]);
				clearConfirmationEvent();
				promotionRequestDataTable();
			}else if(res_status == 'ERR0028'){
				alert_lobibox("success", "Transfer already requested for this Employee");
			}else{
				alert_lobibox("error", sysparam_datas_list[res_status]);
			}
		});	
	}
}


//validation for the empty
function validationFields_org(val){
	return val=='' || val =='0' ?null:val 
}


//Job interview data table function here
function drawListView(data){
	var res_datas = data.results;
	var verticalViewData = '';
	if(res_datas.length){
	for(var i=0; i<res_datas.length; i++){
		verticalViewData += '<div class="col-md-12 EmployeeCard equhight employeeList ta_job_opening" id="'+res_datas[i][0]+'" onclick="transferRequestTableClick('+res_datas[i][0]+')">'
		verticalViewData += '<div class="col-md-12">'
		verticalViewData += '<table style="width:  100%;"><tr><td class="tdwidth1">Employee Name </td><td class="tdwidth2">:</td><td class="tdwidth3"><b>'+res_datas[i][1]+'</b></td></tr>';
		verticalViewData += '<tr><td class="tdwidth1">Transfer Category </td><td class="tdwidth2">:</td><td class="tdwidth3"><b> <b>'+res_datas[i][2]+'</b></td></tr>';
		verticalViewData += '<tr><td class="tdwidth1">Transfer Type </td><td class="tdwidth2">:</td><td class="tdwidth3"><b> <b>'+res_datas[i][3]+'</b></td></tr>';
		verticalViewData += '<tr><td class="tdwidth1">Expected Transfer Date </td><td class="tdwidth2">:</td><td class="tdwidth3"><b> <b>'+res_datas[i][4]+'</b></td></tr>';
		verticalViewData += '<tr><td class="tdwidth1">Transfer Status </td><td class="tdwidth2">:</td><td class="tdwidth3"><b> <b>'+res_datas[i][5]+'</b></td></tr></table>';
		verticalViewData += '</div>'
		verticalViewData += '</div>'
	}}
	else{
		verticalViewData = "<p class='no_data_found'>No Data Found.</p>"
	}
	$('#transfer_request_details_vertical_view').html(verticalViewData);
}


//Transfer request click 
function transferRequestTableClick(id)
{
	$('.EmployeeCard').removeClass('custom_dev_acitve');
	$('#'+id).addClass('custom_dev_acitve');
	$.ajax(
			{
				url : '/sp_transfer_request_table_click/',
				type : 'POST',
				timeout : 10000,
				data:{"table_id":id,csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()},
				async:false,
			}).done(
					function(json_data)
					{
						transfer_request_update_id = id;
						var data = JSON.parse(json_data)		
						// Setting Values
						$('#organization').val(data.results[0].forg_id).trigger('change')
						$('#organization_unit').val(data.results[0].forg_unit_id).trigger('change')
						$('#organization_division').val(data.results[0].fdivi_id).trigger('change')
						$('#organization_employee').val(data.results[0].emp_id).trigger('change')
						$('#reason_for_transfer').val(data.results[0].reason_id).trigger('change')
						$('#transfer_category').val(data.results[0].category_id).trigger('change')
						$('#transfer_type').val(data.results[0].type_id).trigger('change')
						$('#expected_transfer_date').val(data.results[0].req_date)
						$('#transfer_request_notes').val(data.results[0].emp_notes)
						$('#transfer_org').val(data.results[0].org_id).trigger('change')
						$('#transfer_org_unit').val(data.results[0].org_unit_id).trigger('change')
						$('#transfer_org_division').val(data.results[0].org_unit_div_id).trigger('change')
						$('#transfer_others_notes').val(data.results[0].other_reason)
						$(".date_input_class").trigger('change');
						transfer_status = data.results[0].transfer_status;
						button_create(2);
					});
}

//button create function here
function button_create(status){
	var access_for_create = jQuery.inArray( "Transfer Request", JSON.parse(localStorage.Create) );
	var access_for_write = jQuery.inArray( "Transfer Request", JSON.parse(localStorage.Write) );
	var access_for_delete = jQuery.inArray( "Transfer Request", JSON.parse(localStorage.Delete) );
	var strAppend = '';
	if(status == 1){
		if (access_for_create != -1){
			strAppend = "<button type='button' onclick='transfer_request_create_button()' class='btn btn-success btn-eql-wid btn-animate'>Add</button>"
		}
		strAppend += " <button type='button' onclick='transfer_request_clear_btn_refresh()' class='btn btn-warning btn-animate btn-eql-wid btn-animate'>Cancel / Clear</button>"
		$('#transfer_request_btn').html(strAppend);
	}else{
		if (access_for_write != -1){
			strAppend = "<button type='button' onclick='transfer_request_edit_button()' class='btn btn-primary btn-eql-wid btn-animate '>Update</button>"
			if(transfer_status == false){
				strAppend += "<button type='button' onclick='transfer_request_revoke_button()' class='btn btn-primary btn-eql-wid btn-animate '>Revoke</button>"
			}
		}		
		strAppend += " <button type='button' onclick='transfer_request_clear_btn_refresh()' class='btn btn-warning btn-animate btn-eql-wid btn-animate'>Cancel / Clear</button>"
		$('#transfer_request_btn').html(strAppend);
	}
}

//revoke function here
function transfer_request_revoke_button(){
		$.ajax({
			type  : 'POST',
			url   : '/sp_transfer_request_CRUD/',
			async : false,
			data: {
				'revoke_status_id': transfer_request_update_id,
				 csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val(),
			},
		}).done( function(json_data) {
			data = JSON.parse(json_data);
			var res_status = data['status_key'];
			if(res_status == 'NTE_031') {	
				alert_lobibox("success", 'Revoked Successfully.');
				clearConfirmationEvent();
				promotionRequestDataTable();
			}else{
				alert_lobibox("error", sysparam_datas_list[res_status]);
			}
		});	
}

//jquery attendance validation
jQuery.validator.addMethod('valueNotEquals', function (value) {
  return (value != '0');
}, "year required");

//jquery transfer org division validation
jQuery.validator.addMethod('transfer_org_division_check', function (value) {
  let org_div1 = $('#organization_division').val();
  let org_div2 = $('#transfer_org_division').val();
  if(org_div1 == org_div2){
	  return false
  }else{
	  return true
  }
}, "");

// Transfer Request validations here
$('#transfer_request_details_form').submit(function(e) {
  e.preventDefault();
}).validate({
	rules: {
		organization:{
			valueNotEquals: true, 
		},
		organization_unit:{
			valueNotEquals: true, 
		},
		organization_division:{
			valueNotEquals: true,
		},
		organization_employee:{
			required: true,
			valueNotEquals: true,
		},
		transfer_category: {
			required: true,
			valueNotEquals: true,
		},
		transfer_type: {
			required: true,
			valueNotEquals: true,
		}, 
		reason_for_transfer: {
			required: true,
			valueNotEquals:true,
		}, 	  
		expected_transfer_date: {
			required: true,
		},	   
		transfer_org: {
			required: true,
			valueNotEquals:true,
		},
		transfer_org_unit: {
			required: true,
			valueNotEquals: true,
		},
		transfer_org_division: {
			valueNotEquals:true,
			transfer_org_division_check:true,
		},
	},
 //For custom messages
 messages: {
	 organization:{
		 valueNotEquals: "Select Organization", 
	 },
	 organization_unit:{
		 valueNotEquals: "Select Organization Unit", 
	 },
	 organization_division:{
		 valueNotEquals: "Select Organization Division", 
	 },
	 organization_employee:{
		 valueNotEquals: "Select Division Employee", 
	 },
	 transfer_category: {
		 valueNotEquals: "Select Transfer Category",
	 },
	 transfer_type: {
		 valueNotEquals: "Select Transfer Type",
	 },
	 reason_for_transfer: {
		 valueNotEquals: "Select Reason for Transfer",
	 }, 
	 expected_transfer_date: {
		 required: "Select Transfer Date",
	 },
	 transfer_org:{
		 valueNotEquals: "Select Transfer Organization",
	 },
	 transfer_org_unit:{
		 valueNotEquals: "Select Transfer Organization Unit",
	 },
	 transfer_org_division: {
		 valueNotEquals: "Select Transfer Organization Division", 
		 transfer_org_division_check: "Select Different Organization Division. Because Selected Division is Same Current Division"
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
function transfer_form_validation()
{
	return $('#transfer_request_details_form').valid();
}

$('.select2').select2().change(function(){
	$('.errormessage').html('');
});

//data format change 
function DateformatChange(val){
	if(val)
	{	
		return val.split('-')[2]+'-'+val.split('-')[1]+'-'+val.split('-')[0]
	}else
	{
		return null;
	}	
}

//20-July-2018 || TRU || right Details Button Function
$("#right").click(function(){
	$('#left').css('display','block');
	$('#right').css('display','none');
	$('#ta_open_main_div1').addClass('col-md-12').removeClass('col-md-8');
	$('#ta_open_main_div2').removeClass('divActive');
});

//20-July-2018 || TRU || left Details Button Function
$("#left").click(function(){
	$('#left').css('display','none');
	$('#right').css('display','block');
	$('#ta_open_main_div1').addClass('col-md-8').removeClass('col-md-12');
	$('#ta_open_main_div2').addClass('divActive');
});

//search employee name based on transfer list
var elem = document.getElementById('transfer_request_search');
elem.addEventListener('keypress', function(e){
if (e.keyCode == 13) {
	  var employee_name =  $('#transfer_request_search').val()
	  if(!employee_name=='')
	  {
		  promotionRequestSearchList(employee_name);
	  }else{
		  promotionRequestSearchList('');		 
	  }		 
}
});


//fetch the transfer datas
function promotionRequestSearchList(name){
	$.ajax({
		url : "/sp_transfer_request_data_table/",
		type : "POST",
		data : {'filter_name':name},
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		drawListView(data);
	});
}


//Transfer data table function here
function promotionRequestDataTable(){
	$.ajax({
		url : "/sp_transfer_request_data_table/",
		type : "GET",
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		result_data = data;
		logInfo(result_data.log_details); //logger call in lib.js
		drawListView(data)
	});
}
