
var promotion_request_update_id="";
var result_data ;
$(document).ready(function(){
	button_create(1);
	promotionRequestDataTable();
	$('#right').trigger('click');
});

//Promotion create function here 
function promotion_request_create_button() {
	if(promotion_form_validation())
	{
		promotion_request_create_function(0);
	}
}

//Promotion edit function here 
function promotion_request_edit_button() {
	if(promotion_form_validation())
	{
		promotion_request_create_function(promotion_request_update_id);
	}
}

//Promotion cancel function here 
function promotion_request_cancel_button() {
	$('#promotion_request_details_form').trigger("reset");
	$('#organization_employee,#organization,#organization_unit,#organization_division').val('0').trigger('change');
	$('#promotion_org_unit').val('0').trigger('change');
	$('#promotion_division').val('0').trigger('change');
	$('#promotion_role').val('0').trigger('change');
	$('#nominated_date').val('');
	$(".date_input_class").trigger('change');
	$('#nominated_by').val('0').trigger('change');
}

//cancel clear function call button
function promotion_request_clear_btn_refresh(){
	if(promotion_request_update_id != '' ){
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
	$('#promotion_request_details_form').trigger("reset");
	$('#organization_employee,#organization,#organization_unit,#organization_division').val('0').trigger('change');
	$('#promotion_org').val('0').trigger('change');
	$('#promotion_org_unit').val('0').trigger('change');
	$('#promotion_division').val('0').trigger('change');
	$('#promotion_role').val('0').trigger('change');
	$('#nominated_date').val('');
	$(".date_input_class").trigger('change');
	$('#nominated_by').val('0').trigger('change');
	button_create(1);
	$('#promotion_request_details_form')[0].reset();	
	$('.EmployeeCard').removeClass('custom_dev_acitve');
}

//promotion organization change function here
$('#promotion_org').change(function(){
	org_unit_drop_down_function($('#promotion_org').val())
});

//promotion organization unit change function here
$('#promotion_org_unit').change(function(){
	divisionDropDownFunction($('#promotion_org_unit').val())
	role_drop_down_function($('#promotion_org_unit').val())
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
				$("#promotion_division").empty();
				$("#promotion_division").append("<option value='0' selected>--Select Promotion Division--</option>");				
				for (var i=0;i<data.division_info.length;i++)
				{
					$("#promotion_division").append("<option value='"+data.division_info[i].id+"'>"+data.division_info[i].name+"</option>");
					$('.errorTxt4').html('');
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
				$("#promotion_role").empty();
				$("#promotion_role").append("<option value='0' selected>--Select Promotion Role--</option>");
				for (var i=0;i<data.role_info.length;i++)
				{
					$('#promotion_role').append("<option value='"+data.role_info[i].id+"'>"+data.role_info[i].role_title+"</option>");
					$('.errorTxt2').html('')					
				}				
		}
	});
}

//organization drop down function here
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
				$("#promotion_org_unit").empty();
				$("#promotion_org_unit").append("<option value='0' selected>--Select Organization Unit--</option>");				
				for (var i=0;i<data.org_unit_info.length;i++)
				{
					$("#promotion_org_unit").append("<option value='"+data.org_unit_info[i].id+"'>"+data.org_unit_info[i].orgunit_name+"</option>");
					$('.errorTxt5').html('');
				}			
		}
	});
}


//Promotion create update function here
function promotion_request_create_function(id){	
	if($('#organization_employee').val()==$('#nominated_by').val()){
		alert_lobibox("success", "Employee and Nominated by cannot be same");
	}else{		
	var project_form_value = getFormValues("#promotion_request_details_form");
	var csrf_data = project_form_value.csrfmiddlewaretoken;
	delete project_form_value["csrfmiddlewaretoken"];	
	project_form_value['is_active'] = "True";
	project_form_value['promotion_employee'] = validationFields_org(project_form_value['organization_employee']);
	project_form_value['promotion_org'] =  validationFields_org(project_form_value['promotion_org']);
	project_form_value['promotion_org_unit'] = validationFields_org(project_form_value['promotion_org_unit']);
	project_form_value['promotion_division'] = validationFields_org(project_form_value['promotion_division']);
	project_form_value['promotion_role'] = validationFields_org(project_form_value['promotion_role']);
	project_form_value['nominated_by'] = validationFields_org(project_form_value['nominated_by']);
	project_form_value['nominated_date'] = DateformatChange(project_form_value['nominated_date']);
	
	project_list = [];
	project_dict = {};
	project_list.push(project_form_value);
	project_dict['input_data'] = project_list;
	if(id)
	{
		$.ajax({
			type  : 'POST',
			url   : '/sp_promotion_request_CRUD/',
			async : false,
			data: {
				'datas': JSON.stringify(project_list),
				"table_id":promotion_request_update_id,
				 csrfmiddlewaretoken: csrf_data
			},
		}).done( function(json_data) {
			data = JSON.parse(json_data);
			var res_status = data['status_key'];
			if(res_status == 'NTE_03') {
				alert_lobibox("success", sysparam_datas_list[res_status]);
				button_create(1)
				clearConformationEvent();
				promotionRequestDataTable();
			}else if(res_status == 'ERR0028'){
				alert_lobibox("success", "Promotion already requested for this Employee");
			}else{
				alert_lobibox("error", sysparam_datas_list[res_status]);
			}
		});

	}else
	{
		$.ajax({
			type  : 'POST',
			url   : '/sp_promotion_request_CRUD/',
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
				promotionRequestDataTable();
			}else if(res_status == 'ERR0028'){
				alert_lobibox("success", "Promotion already requested for this Employee");
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


//Job interview data table function here
function drawListView(data){
	var res_datas = data.results;
	var verticalViewData = '';
	if(res_datas.length){
	for(var i=0; i<res_datas.length; i++){
		verticalViewData += '<div class="col-md-12 EmployeeCard equhight employeeList ta_job_opening" id="'+res_datas[i][0]+'" onclick="promotionRequestTableClick('+res_datas[i][0]+')">'
		verticalViewData += '<div class="col-md-12">'
		verticalViewData += '<table><tr><td class="tdwidth1">Employee Name </td><td class="tdwidth2">:</td><td class="tdwidth3"><b>'+res_datas[i][1]+'</b></td></tr>';
		verticalViewData += '<tr><td class="tdwidth1">Nominated by </td><td class="tdwidth2">:</td><td class="tdwidth3"><b> <b>'+res_datas[i][2]+'</b></td></tr>';
		verticalViewData += '<tr><td class="tdwidth1">Nomination Date </td><td class="tdwidth2">:</td><td class="tdwidth3"><b> <b>'+res_datas[i][3]+'</b></td></tr>';
		verticalViewData += '<tr><td class="tdwidth1">Role </td><td class="tdwidth2">:</td><td class="tdwidth3"><b> <b>'+res_datas[i][4]+'</b></td></tr></table>';
		verticalViewData += '</div>'
		verticalViewData += '</div>'
	}}
	else{
		verticalViewData = "<p class='no_data_found'>No Data Found.</p>"
	}
	$('#promotion_request_details_vertical_view').html(verticalViewData);
}


//Promotion request click 
function promotionRequestTableClick(id)
{
	button_create(2);
	$('.EmployeeCard').removeClass('custom_dev_acitve');
	$('#'+id).addClass('custom_dev_acitve');
	$.ajax(
			{
				url : '/sp_promotion_request_table_click/',
				type : 'POST',
				timeout : 10000,
				data:{"table_id":id,csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()},
				async:false,
			}).done(
					function(json_data)
					{
						promotion_request_update_id = id;
						var data = JSON.parse(json_data)
						// Setting Values
						$('#organization').val(data.results[0].forg_id).trigger('change')
						$('#organization_unit').val(data.results[0].forg_unit_id).trigger('change')
						$('#organization_division').val(data.results[0].fdivi_id).trigger('change')
						$('#organization_employee').val(data.results[0].emp_id).trigger('change')
						$('#nominated_date').val(data.results[0].req_date)
						$('#promotion_org').val(data.results[0].org_id).trigger('change')
						$('#promotion_org_unit').val(data.results[0].org_unit_id).trigger('change')
						$('#promotion_division').val(data.results[0].org_unit_div_id).trigger('change')
						$('#promotion_role').val(data.results[0].role_id).trigger('change')
						$('#nominated_by').val(data.results[0].nominated_emp_id).trigger('change')	
						$(".date_input_class").trigger('change');
					});
}

//button create function here
function button_create(status){
	var access_for_create = jQuery.inArray( "Promotion Request", JSON.parse(localStorage.Create) );
	var access_for_write = jQuery.inArray( "Promotion Request", JSON.parse(localStorage.Write) );
	var access_for_delete = jQuery.inArray( "Promotion Request", JSON.parse(localStorage.Delete) );
	var strAppend = '';
	if(status == 1){
		if (access_for_create != -1){
			strAppend = "<button type='button' onclick='promotion_request_create_button()' class='btn btn-success btn-eql-wid btn-animate'>Add</button>"
		}
		strAppend += " <button type='button' onclick='promotion_request_clear_btn_refresh()' class='btn btn-warning btn-animate btn-eql-wid btn-animate'>Cancel / Clear</button>"
		$('#promotion_request_btn').html(strAppend);
	}else{
		if (access_for_write != -1){
			strAppend = "<button type='button' onclick='promotion_request_edit_button()' class='btn btn-primary btn-eql-wid btn-animate '>Update</button>"
		}		
		strAppend += " <button type='button' onclick='promotion_request_clear_btn_refresh()' class='btn btn-warning btn-animate btn-eql-wid btn-animate'>Cancel / Clear</button>"
		$('#promotion_request_btn').html(strAppend);
	}
}

//jquery attendance validation
jQuery.validator.addMethod('valueNotEquals', function (value) {
  return (value != '0');
}, "year required");


// Promotion Request validations here
$('#promotion_request_details_form').submit(function(e) {
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
	   promotion_org_unit: {
		   required: true,
		   valueNotEquals: true,
	   },
	   promotion_role: {
		   required: true,
		   valueNotEquals: true,
	   }, 
	   nominated_date: {
		   required: true,
	   }, 	  
	   nominated_by: {
		   required: true,
		   valueNotEquals:true,
	   },	   
	   promotion_org: {
		   required: true,
		   valueNotEquals:true,
	   },
	   promotion_division: {
		   required: true,
		   valueNotEquals: true,
		   prmotion_org_division_check: true,
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
	 promotion_org_unit: {
		 valueNotEquals: "Select Promotion Organization Unit",
	 },
	 promotion_role: {
		 valueNotEquals: "Select Promotion Role",
	 },
	 nominated_date: {
		 required: "Select Nominated Date",
	 }, 
	 nominated_by: {
		 valueNotEquals: "Select Nominated by",
	 },
	 promotion_org:{
		 valueNotEquals: "Select Promotion Organization",
	 },
	 promotion_division:{
		 valueNotEquals: "Select Promotion Organization Division",
		 prmotion_org_division_check : "Select Different Organization Division. Because Selected Division is Same Current Division",
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
function promotion_form_validation()
{
	return $('#promotion_request_details_form').valid();
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
var elem = document.getElementById('promotion_request_search');
elem.addEventListener('keypress', function(e){
if (e.keyCode == 13) {
	  var employee_name =  $('#promotion_request_search').val()
	  if(!employee_name=='')
	  {
		  promotionRequestSearchList(employee_name);
	  }else{
		  promotionRequestSearchList('');		 
	  }		 
}
});


//fetch the promotion datas
function promotionRequestSearchList(name){
	$.ajax({
		url : "/sp_promotion_request_data_table/",
		type : "POST",
		data : {'filter_name':name},
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		drawListView(data);
	});
}


//Promotion data table function here
function promotionRequestDataTable(){
	$.ajax({
		url : "/sp_promotion_request_data_table/",
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

//jquery transfer org division validation
jQuery.validator.addMethod('prmotion_org_division_check', function (value) {
  let org_div1 = $('#organization_division').val();
  let org_div2 = $('#promotion_division').val();
  if(org_div1 == org_div2){
	  return false
  }else{
	  return true
  }
}, "");