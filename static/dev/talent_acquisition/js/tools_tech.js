var columns = [{"title":"ID"}, {"title":"No."} ,{"title":"Organization"} ,{"title":"Tools Type"}, {"title":"Name"}, {"title":"Key"}];
var tools_tech_id = 0;
var status_id = 0;
var datas = getFormValues("#tools_tech_form");
var	csrf_data = datas.csrfmiddlewaretoken;
$(document).ready(function(){
	button_create(1)
	//table row click get id
	$("#tt_table").on("click", "tr", function() { 
		if (!this.rowIndex) return; // skip first row
		tools_tech_id = $('#tt_table').dataTable().fnGetData(this)[0];
		toolTechDataEvents(tools_tech_id);
		dataTableAcitveRowAdd('tt_table',$(this).index());//active class add
		button_create(0)
	});
	toolsTechData();
});

//cancel clear function call button
function branding_clear_btn_refresh_call(){
	$('#tools_tech_form')[0].reset();
	$('#tt_org_id,#tt_type_id').val('0').trigger("change");
	status_id = 0;
	tools_tech_id = 0;
	button_create(1);
	toolsTechData();
}
//cancel clear function call button
function clearToolsTechConfirmation(){
	if(tools_tech_id != 0 ){
		var title = $('#tt_name').val();
		orgClearFuncton('branding_clear_btn_refresh_call','',title);
	}else{
		branding_clear_btn_refresh_call();
	}
}

//add confirmation function here.
function addToolsTechConfirmation(){
	status_id = 0;
	dataForm();
}

//update confirmation function here.
function updateToolsTechConfirmation(){
	status_id = 1;
	dataForm();
}

//remove confirmation function here.
function removeBrandingConfirmation(){
	var status = branding_form_validation();
	if(status){
		status_id = 3;
		var title = $('#tt_name').val();
		removeConfirmation('dataForm','',title);
	}
}

//data form in object
function dataForm(){
	var status = branding_form_validation();
	if(status){
		project_list = [];
		project_dict = {};
		var project_form_value = getFormValues("#tools_tech_form");
		project_list.push(project_form_value);
		project_dict['input_data'] = project_list;
		json_response = JSON.stringify(project_dict);
		method = 'POST';
		url = "/ta_tools_tech_crud_operation/";
		crud_function(method, json_response, url);	
	}else{
		return true;
	}
}

//crud function here
function crud_function(methods, datas, urls) {
	if(status_id == 0){
		res_data = { "ta_results":datas, csrfmiddlewaretoken:csrf_data}
	}else if(status_id == 1){
		if(tools_tech_id != 0){
			res_data = { "ta_results":datas,"ta_update_id":tools_tech_id, csrfmiddlewaretoken:csrf_data }
		}
	}else if(status_id == 3){
		if(tools_tech_id != 0){
			res_data = { "ta_results":datas,"ta_delete_id":tools_tech_id, csrfmiddlewaretoken:csrf_data }
		}
	} 
	$.ajax({
		url : urls,
		type : methods,
		data : res_data,
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		var res_status = data['results']
		if(res_status != "NTE_04"){
			if(res_status == "NTE_03"){
				button_create(1)
			}
			alert_lobibox("success", sysparam_datas_list[res_status]);
		}else{
			alert_lobibox("success", sysparam_datas_list[res_status]);
			button_create(1)
		}
		branding_clear_btn_refresh_call();
	});
}

//attendance table data 
function toolsTechData(){
	$.ajax({
		url : "/ta_tools_tech_data/",
		type : "POST",
		data : {csrfmiddlewaretoken:csrf_data},
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		var res_data = JSON.parse(json_data);
		var data = res_data.ta_datas;
		plaindatatable_btn("tt_table",data,columns,0,'NEXT_TRANSFORM_HCMS_TOOLS_TECH_'+currentDate());
	});
}
//attendance event table data 
function toolTechDataEvents(event_id){
//	clearToolsTechConfirmation();
	$.ajax({
		url : "/ta_tools_tech_data/",
		type : "POST",
		data : {'ta_id':event_id,csrfmiddlewaretoken:csrf_data},
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		var res_datas = JSON.parse(json_data);
		var ta_datas = res_datas.ta_datas;
		if(ta_datas){
			$('#tt_org_id').val(ta_datas[0].org_id).trigger('change');
			$('#tt_type_id').val(ta_datas[0].type_id).trigger('change');
			$('#tt_name').val(ta_datas[0].name);
			$('#tt_description').val(ta_datas[0].description);
			$('#tt_api').val(ta_datas[0].api);
			tools_tech_id = ta_datas[0].id;
		}
	});
}

//button create function here
function button_create(status){
	var access_for_create = jQuery.inArray( "Tools & Technology", JSON.parse(localStorage.Create) );
	var access_for_write = jQuery.inArray( "Tools & Technology", JSON.parse(localStorage.Write) );
	var access_for_delete = jQuery.inArray( "Tools & Technology", JSON.parse(localStorage.Delete) );
	var strAppend = '';
	if(status == 1){
		if (access_for_create != -1){
			strAppend = "<button type='button' onclick='addToolsTechConfirmation()' class='btn-animate btn-eql-wid  btn btn-success'>Add</button>"
		}
			strAppend += " <button type='button' onclick='clearToolsTechConfirmation()'  class='btn-animate btn-eql-wid  btn btn-warning '>Cancel / Clear</button>"
		$('#ta_tt_btn').html(strAppend);
	}else{
		if (access_for_write != -1){
			strAppend = "<button type='button' onclick='updateToolsTechConfirmation()' class='btn-animate btn-eql-wid  btn btn-primary '>Update</button>"
		}if (access_for_delete != -1){
			strAppend += " <button type='button' onclick='removeBrandingConfirmation()' class='btn-animate btn-eql-wid  btn btn-danger '>Remove</button>"
		}
		strAppend += " <button type='button' onclick='clearToolsTechConfirmation()' class='btn-animate btn-eql-wid  btn btn-warning '>Cancel / Clear</button>"
		$('#ta_tt_btn').html(strAppend);
	}
}


//jquery attendance validation
jQuery.validator.addMethod('valueNotEquals', function (value) {
  return (value != '0');
}, "year required");
$('.select2').select2().change(function(){
	$('.errorTxts').html('');
});
$('#tools_tech_form').submit(function(e) {
  e.preventDefault();
}).validate({
 rules: {
	 tt_org_id: {
		   valueNotEquals:true,
	   },
	   tt_type_id: {
		   valueNotEquals: true
		 },
	   tt_name: {
		   required:true,
	   },
	   tt_description: {
		   required:true,
	   },
	   tt_api: {
			 required:true,
	   },
 },
 //For custom messages
 messages: {
	 tt_org_id: {
		 valueNotEquals: "Select Valid Organization",
	 }, 
	 tt_type_id: {
		 valueNotEquals: "Select Valid Tools Types"
	 },
	 tt_name: {
		 required:"Enter Name",
	 },
	 tt_description: {
		 required:"Enter Description",
	 },
	 tt_api: {
		 required:"Enter API Key",
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
function branding_form_validation()
{
	return $('#tools_tech_form').valid();
}
