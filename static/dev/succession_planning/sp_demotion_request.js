var demotion_request_update_id="";
var result_data;
$(document).ready(function(){
	button_create(1);
	demotionRequestDataTable();
	$('#right').trigger('click');
});

//Promotion create function here 
function demotion_request_create_button() {
	if(demotion_form_validation())
	{
		demotion_request_create_function(0);
	}
}

//Demotion edit function here 
function demotion_request_edit_button() {
	if(demotion_form_validation())
	{
		demotion_request_create_function(demotion_request_update_id);
	}
}

//Demotion cancel function here 
function demotion_request_cancel_button() {
	$('#demotion_request_details_form').trigger("reset");
	$('#organization_employee,#organization,#organization_unit,#organization_division').val('0').trigger('change');
	$('#demotion_org_unit').val('0').trigger('change');
	$('#demotion_division').val('0').trigger('change');
	$('#demotion_role').val('0').trigger('change');
	$('#demotion_reason').val('0').trigger('change');
	$('#requested_by').val('0').trigger('change');
	$('#request_date').val('');
	$('#effective_date').val('');
	$(".date_input_class").trigger('change');
}

//cancel clear function call button
function demotion_request_clear_btn_refresh(){
	if(demotion_request_update_id != '' ){
		var title = $('#organization_employee option:selected').text().toString();
		orgClearFuncton('clearConformationEvent','',title);
	}else{
		clearConformationEvent();
	}
}

//Promotion clear confirmation
function clearConformationEvent(){
	promotion_request_update_id = '';
	$('.errormessage').val('');
	$('#demotion_request_details_form').trigger("reset");
	$('#organization_employee,#organization,#organization_unit,#organization_division').val('0').trigger('change');
	$('#demotion_org').val('0').trigger('change');
	$('#demotion_org_unit').val('0').trigger('change');
	$('#demotion_division').val('0').trigger('change');
	$('#demotion_role').val('0').trigger('change');
	$('#demotion_reason').val('0').trigger('change');
	$('#requested_by').val('0').trigger('change');
	$('#request_date').val('');
	$('#effective_date').val('');
	$(".date_input_class").trigger('change');
	demotion_request_update_id = '';
	button_create(1);
	$('.EmployeeCard').removeClass('custom_dev_acitve');
}

//demotion organization change function here
$('#demotion_org').change(function(){
	org_unit_drop_down_function($('#demotion_org').val())
});

//demotion organization unit change function here
$('#demotion_org_unit').change(function(){
	divisionDropDownFunction($('#demotion_org_unit').val())
	role_drop_down_function($('#demotion_org_unit').val())
});

//division change function here
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
				$("#demotion_division").empty();
				$("#demotion_division").append("<option value='0' selected>--Select Demotion Division--</option>");				
				for (var i=0;i<data.division_info.length;i++)
				{
					$("#demotion_division").append("<option value='"+data.division_info[i].id+"'>"+data.division_info[i].name+"</option>");
					$('.errorTxt8').html('');
				}			
		}
	});
}

//role drop down function here
function role_drop_down_function(org_unit_id)
{
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
				$("#demotion_role").empty();
				$("#demotion_role").append("<option value='0' selected>--Select Demotion Role--</option>");
				for (var i=0;i<data.role_info.length;i++)
				{
					$('#demotion_role').append("<option value='"+data.role_info[i].id+"'>"+data.role_info[i].role_title+"</option>");
					$('.errorTxt3').html('')
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
				$("#demotion_org_unit").empty();
				$("#demotion_org_unit").append("<option value='0' selected>--Select Organization Unit--</option>");				
				for (var i=0;i<data.org_unit_info.length;i++)
				{
					$("#demotion_org_unit").append("<option value='"+data.org_unit_info[i].id+"'>"+data.org_unit_info[i].orgunit_name+"</option>");
					$('.errorTxt2').html('');
				}			
		}
	});
}


//demotion create update function here
function demotion_request_create_function(id){	
	if($('#organization_employee').val()==$('#requested_by').val()){
		alert_lobibox("success", "Employee and Requested by Employee cannot be same");
	}else{		
	var project_form_value = getFormValues("#demotion_request_details_form");
	var csrf_data = project_form_value.csrfmiddlewaretoken;
	delete project_form_value["csrfmiddlewaretoken"];	
	project_form_value['is_active'] = "True";
	project_form_value['demotion_employee'] = validationFields_org(project_form_value['organization_employee']);
	project_form_value['demotion_org'] =  validationFields_org(project_form_value['demotion_org']);
	project_form_value['demotion_org_unit'] = validationFields_org(project_form_value['demotion_org_unit']);
	project_form_value['demotion_division'] = validationFields_org(project_form_value['demotion_division']);
	project_form_value['demotion_role'] = validationFields_org(project_form_value['demotion_role']);
	project_form_value['requested_by'] = validationFields_org(project_form_value['requested_by']);
	project_form_value['request_date'] = DateformatChange(project_form_value['request_date']);
	project_form_value['effective_date'] = DateformatChange(project_form_value['effective_date']);
	project_form_value['demotion_reason'] = validationFields_org(project_form_value['demotion_reason']);
	project_list = [];
	project_dict = {};
	project_list.push(project_form_value);
	project_dict['input_data'] = project_list;
	if(id)
	{
		$.ajax({
			type  : 'POST',
			url   : '/sp_demotion_request_CRUD/',
			async : false,
			data: {
				'datas': JSON.stringify(project_list),
				"table_id":demotion_request_update_id,
				 csrfmiddlewaretoken: csrf_data
			},
		}).done( function(json_data) {
			data = JSON.parse(json_data);
			var res_status = data['status_key'];
			if(res_status == 'NTE_03') {
				alert_lobibox("success", sysparam_datas_list[res_status]);
				button_create(1)
				clearConformationEvent();
				demotionRequestDataTable();
			}else if(res_status == 'ERR0028'){
				alert_lobibox("success", "Demotion already requested for this Employee");
			}else{
				alert_lobibox("error", sysparam_datas_list[res_status]);
			}
		});
	}else
	{
		$.ajax({
			type  : 'POST',
			url   : '/sp_demotion_request_CRUD/',
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
				clearConformationEvent();
				demotionRequestDataTable();
			}else if(res_status == 'ERR0028'){
				alert_lobibox("success", "Demotion already requested for this Employee");
			}else{
				alert_lobibox("error", sysparam_datas_list[res_status]);
			}
		});	
	}
	}
}

//validation for the empty
function validationFields_org(val){
	return val=='' || val =='0' ?null:val 
}

//Demotion Request data table function here
function drawListView(data){
	var res_datas = data.results;
	var verticalViewData = '';
	if(res_datas.length){
	for(var i=0; i<res_datas.length; i++){
		verticalViewData += '<div class="col-md-12 EmployeeCard equhight employeeList ta_job_opening" id="'+res_datas[i][0]+'" onclick="demotionRequestTableClick('+res_datas[i][0]+')">'
		verticalViewData += '<div class="col-md-12">'
		verticalViewData += '<table><tr><td class="tdwidth1">Employee Name </td><td class="tdwidth2">:</td><td class="tdwidth3"><b>'+res_datas[i][1]+'</b></td></tr>';
		verticalViewData += '<tr><td class="tdwidth1">Requested by </td><td class="tdwidth2">:</td><td class="tdwidth3"><b> <b>'+res_datas[i][2]+'</b></td></tr>';
		verticalViewData += '<tr><td class="tdwidth1">Demotion Reason </td><td class="tdwidth2">:</td><td class="tdwidth3"><b> <b>'+res_datas[i][3]+'</b></td></tr>';
		verticalViewData += '<tr><td class="tdwidth1">Demotion Status </td><td class="tdwidth2">:</td><td class="tdwidth3"><b> <b>'+res_datas[i][4]+'</b></td></tr></table>';
		verticalViewData += '</div>'
		verticalViewData += '</div>'
	}}
	else{
		verticalViewData = "<p class='no_data_found'>No Data Found.</p>"
	}
	$('#demotion_request_details_vertical_view').html(verticalViewData);
}


//Demotion request click 
function demotionRequestTableClick(id)
{
	button_create(2);
	$('.EmployeeCard').removeClass('custom_dev_acitve');
	$('#'+id).addClass('custom_dev_acitve');
	$.ajax(
			{
				url : '/sp_demotion_request_table_click/',
				type : 'POST',
				timeout : 10000,
				data:{"table_id":id,csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()},
				async:false,
			}).done(
					function(json_data)
					{
						demotion_request_update_id = id;
						var data = JSON.parse(json_data)
						// Setting Values
						$('#organization').val(data.results[0].forg_id).trigger('change')
						$('#organization_unit').val(data.results[0].forg_unit_id).trigger('change')
						$('#organization_division').val(data.results[0].fdivi_id).trigger('change')		
						$('#organization_employee').val(data.results[0].emp_id).trigger('change')
						$('#requested_by').val(data.results[0].request_emp_id).trigger('change')
						$('#request_date').val(data.results[0].request_date)
						$('#effective_date').val(data.results[0].effective_date)
						$('#demotion_org').val(data.results[0].org_id).trigger('change')
						$('#demotion_org_unit').val(data.results[0].org_unit_id).trigger('change')
						$('#demotion_division').val(data.results[0].org_unit_div_id).trigger('change')
						$('#demotion_role').val(data.results[0].role_id).trigger('change')
						$('#demotion_reason').val(data.results[0].reason_id).trigger('change')
						$('#actions_to_taken').val(data.results[0].emp_notes).trigger('change')
						$(".date_input_class").trigger('change');
						demotion_status = data.results[0].demotion_status;
					});
}

//button create function here
function button_create(status){
	var access_for_create = jQuery.inArray( "Demotion Request", JSON.parse(localStorage.Create) );
	var access_for_write = jQuery.inArray( "Demotion Request", JSON.parse(localStorage.Write) );
	var access_for_delete = jQuery.inArray( "Demotion Request", JSON.parse(localStorage.Delete) );
	var strAppend = '';
	if(status == 1){
		if (access_for_create != -1){
			strAppend = "<button type='button' onclick='demotion_request_create_button()' class='btn btn-success btn-eql-wid btn-animate'>Add</button>"
		}
		strAppend += " <button type='button' onclick='demotion_request_clear_btn_refresh()' class='btn btn-warning btn-animate btn-eql-wid btn-animate'>Cancel / Clear</button>"
		$('#demotion_request_btn').html(strAppend);
	}else{
		if (access_for_write != -1){
			strAppend = "<button type='button' onclick='demotion_request_edit_button()' class='btn btn-primary btn-eql-wid btn-animate '>Update</button>"
		}		
		strAppend += " <button type='button' onclick='demotion_request_clear_btn_refresh()' class='btn btn-warning btn-animate btn-eql-wid btn-animate'>Cancel / Clear</button>"
		$('#demotion_request_btn').html(strAppend);
	}
}

//jquery attendance validation
jQuery.validator.addMethod('valueNotEquals', function (value) {
  return (value != '0');
}, "year required");


// Demotion Request validations here
$('#demotion_request_details_form').submit(function(e) {
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
		organization_employee: {
			required: true,
			valueNotEquals: true,
		},
		requested_by: {
			required: true,
			valueNotEquals: true,
		},
		demotion_org: {
			required: true,
			valueNotEquals: true,
		},
		demotion_org_unit: {
			required: true,
			valueNotEquals: true,
		},
		demotion_role: {
			required: true,
			valueNotEquals: true,
		}, 
		request_date: {
			required: true,
		}, 	  
		effective_date: {
			required: true,
		},
		demotion_reason: {
			required: true,
			valueNotEquals: true,
		},
		demotion_division: {
			valueNotEquals: true,
			demotion_org_division_check: true
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
	 requested_by: {
		valueNotEquals: "Select Requested by",
	 },
	 demotion_org: {
		valueNotEquals: "Select Demotion Organization",
	 },
	 demotion_org_unit: {
		 valueNotEquals: "Select Demotion Organization Unit",
	 },
	 demotion_role: {
		 valueNotEquals: "Select Demotion Role",
	 },
	 request_date: {
		 required: "Select Request Date",
	 },
	 effective_date: {
		 required: "Select Effective Date",
	 }, 
	 demotion_reason: {
		 valueNotEquals: "Select Demotion Reason",
	 },
	 demotion_division: {
		 valueNotEquals: "Select Demotion Organization Division",
		 demotion_org_division_check: "Select Different Organization Division. Because Selected Division is Same Current Division",
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
function demotion_form_validation()
{
	return $('#demotion_request_details_form').valid();
}

$('.select2').select2().change(function(){
	$('.errormessage').html('');
});

//data format change 
function DateformatChange(val){
	if(val){	
		return val.split('-')[2]+'-'+val.split('-')[1]+'-'+val.split('-')[0]
	}else{
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
var elem = document.getElementById('demotion_request_search');
elem.addEventListener('keypress', function(e){
if (e.keyCode == 13) {
	  var employee_name =  $('#demotion_request_search').val()
	  if(!employee_name=='')
	  {
		  demotionRequestSearchList(employee_name);
	  }else{
		  demotionRequestSearchList('');		 
	  }		 
}
});

//fetch the promotion datas
function demotionRequestSearchList(name){
	$.ajax({
		url : "/sp_demotion_request_data_table/",
		type : "POST",
		data : {'filter_name':name},
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		drawListView(data);
	});
}

//Demotion data table function here
function demotionRequestDataTable(){
	$.ajax({
		url : "/sp_demotion_request_data_table/",
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

//jquery demotion org division validation
jQuery.validator.addMethod('demotion_org_division_check', function (value) {
  let org_div1 = $('#organization_division').val();
  let org_div2 = $('#demotion_division').val();
  if(org_div1 == org_div2){
	  return false
  }else{
	  return true
  }
}, "");