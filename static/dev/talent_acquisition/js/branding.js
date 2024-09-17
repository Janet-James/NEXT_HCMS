var columns = [{"title":"ID"}, {"title":"No."} ,{"title":"Organization"} ,{"title":"Name"}];
var branding_id = 0;
var status_id = 0;
var upload_id = 0;
var doc_names = '';
var document_names = 'policy_document';
var datas = getFormValues("#branding_form");
var	csrf_data = datas.csrfmiddlewaretoken;
$(document).ready(function(){
	button_create(1)
	brandingData();
	$('#right').trigger('click');
});

//cancel clear function call button
function branding_clear_btn_refresh_call(){
	$('.EmployeeCard').removeClass('custom_dev_acitve');
	$('#branding_form')[0].reset();
	$('#branding_org_name,#branding_org_polpro,#branding_org_standard').val('0').trigger("change");
	$('.fileinput-filename').html('');
	status_id = 0;
	branding_id = 0;
	doc_id = 0;
	doc_names = '';
	button_create(1);
	brandingData();
}

//cancel clear function call button
function clearBrandingConfirmation(){
	if(branding_id != 0 ){
		var title = $('#branding_name').val();
		orgClearFuncton('branding_clear_btn_refresh_call','',title);
	}else{
		branding_clear_btn_refresh_call();
	}
}

//add confirmation function here.
function addBrandingConfirmation(){
	status_id = 0;
	upload_id = saveDocAttachment();
	dataForm();
}

//update confirmation function here.
function updateBrandingConfirmation(){
	status_id = 1;
	upload_id = updateDocAttachment();
	dataForm();
}

//remove confirmation function here.
function removeBrandingConfirmation(){
	var status = branding_form_validation();
	if(status){
		status_id = 3;
		var title = $('#branding_name').val();
		removeConfirmation('dataForm','',title);
	}
}

//data form in object
function dataForm(){
	var status = branding_form_validation();
	var file_names = $('input[type=file][id$="certificate_doc"]').val().replace(/C:\\fakepath\\/i, '').split('.')[0].toString().toLowerCase();
	if(status && upload_id != 0){
		project_list = [];
		project_dict = {};
		if(status_id == 1){
			var file_name =  file_names ? file_names : doc_names;
		}else{
			var file_name =  file_names;
		}
		var project_form_value = getFormValues("#branding_form");
		project_form_value['attachment_id'] = upload_id;
		project_form_value['branding_doc_name'] = file_name;
		project_list.push(project_form_value);
		project_dict['input_data'] = project_list;
		json_response = JSON.stringify(project_dict);
		method = 'POST';
		url = "/ta_branding_crud_operation/";
		crud_function(method, json_response, url);	
	}else{
		alert_lobibox("error","Please upload doc,docx or pdf and file size should be less than 2MB ");
	}
}

//crud function here
function crud_function(methods, datas, urls) {
	if(status_id == 0){
		res_data = { "ta_results":datas, csrfmiddlewaretoken:csrf_data}
	}else if(status_id == 1){
		if(branding_id != 0){
			res_data = { "ta_results":datas,"ta_update_id":branding_id, csrfmiddlewaretoken:csrf_data }
		}
	}else if(status_id == 3){
		if(branding_id != 0){
			res_data = { "ta_results":datas,"ta_delete_id":branding_id, csrfmiddlewaretoken:csrf_data }
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
function brandingData(){
	$.ajax({
		url : "/ta_branding_data/",
		type : "POST",
		data : {csrfmiddlewaretoken:csrf_data},
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		var res_data = JSON.parse(json_data);
		var data = res_data.ta_datas;
		brandingListView(data);
		plaindatatable_btn("ta_branding_table",data,columns,0,'NEXT_TRANSFORM_HCMS_BRANDING_'+currentDate());
	});
}
//branding list view function here
function brandingListView(res_datas){
	var verticalViewData = "";
	if(res_datas.length){
		for(var i=0; i<res_datas.length; i++){
			verticalViewData += '<div class="col-md-12 EmployeeCard equhight employeeList ta_job_opening" id="'+res_datas[i][0]+'" onclick="brandingTableClick('+res_datas[i][0]+')">'
			verticalViewData += '<div class="col-md-10">'
			verticalViewData += '<table><tr><td class="tdwidth1">Organization </td><td class="tdwidth2">:</td><td class="tdwidth3">  <b>'+res_datas[i][2]+'</b></td></tr>';
			verticalViewData += '<tr><td class="tdwidth1">Branding </td><td class="tdwidth2">:</td><td class="tdwidth3"> <b>'+res_datas[i][3]+'</b></td></tr>';
			verticalViewData += '<tr><td class="tdwidth1">Description </td><td class="tdwidth2">:</td><td class="tdwidth3">  <b>'+res_datas[i][8]+'</b></td></tr></table>';
			verticalViewData += '</div>'
			verticalViewData += '<div class="col-md-2 ta_job_status_div_brand">'
			if (res_datas[i][5]){
				var download_filename = 'NEXT_TRANSFORM_HCMS_BRANDING_'+currentDate()+'_'+res_datas[i][5];
				var file_name = '<a href="'+ta_doc_path+res_datas[i][4]+'" download="'+download_filename+'"><i class="nf nf-download" title="Document Download" style="color: #d277fe;font-size: 20px;"></i></a>';
				var file_view = '<a onclick="documentView(\''+ta_doc_path+res_datas[i][4]+'\')"><i class="nf nf-preview" title="Document Viewer" style="color: #d277fe;font-size: 20px;"></i></a>';
			}else{
				var file_name,file_view = '';
			}
			verticalViewData += '<div class="">'+file_name+'</div>';
			verticalViewData += '<div class="">'+file_view+'</div>';
			verticalViewData += '</div>'
			verticalViewData += '</div>'
		}}
		else{
			verticalViewData = "<p class='no_data_found'>No Data Found.</p>"
		}
		$('#ta_branding_details_vertical_view').html(verticalViewData);
}

//document view function here
function documentView(path){
	var target = document.getElementById("targetDiv");
	var newFrame = document.createElement("iframe");
	newFrame.setAttribute("src", path);
	newFrame.setAttribute("title", "Document View");
	newFrame.setAttribute("height", "400px");
	newFrame.setAttribute("width", "100%");
	newFrame.setAttribute("alt", " <p>Your browser does not support iframes.</p>");
	target.appendChild(newFrame);
	if(myBrowserFunction().toString() == 'Chrome'){
		$('#documentView').modal('show');
	}else{
		alert_lobibox("info",'Your browser does not support. So Download here please check it.')
	}
}

//branding event table data 
function brandingTableClick(event_id){
//	clearBrandingConfirmation();
	button_create(2);
	$('.EmployeeCard').removeClass('custom_dev_acitve');
	$('#'+event_id).addClass('custom_dev_acitve');
	$.ajax({
		url : "/ta_branding_data/",
		type : "POST",
		data : {'ta_id':event_id,csrfmiddlewaretoken:csrf_data},
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		var res_datas = JSON.parse(json_data);
		var ta_datas = res_datas.ta_datas;
		if(ta_datas){
			$('#branding_org_name').val(ta_datas[0].org_id).trigger('change');
			$('#branding_org_polpro').val(ta_datas[0].proc_id).trigger('change');
			$('#branding_org_standard').val(ta_datas[0].standard_id).trigger('change');
			$('#branding_name').val(ta_datas[0].brand_name);
			$('#branding_description').val(ta_datas[0].description);
			$('.fileinput-filename').html(ta_datas[0].show_doc_name);
			doc_names = ta_datas[0].doc_name;
			doc_id = ta_datas[0].get_doc_id;
			branding_id = ta_datas[0].id;
		}
	});
}

//button create function here
function button_create(status){
	var access_for_create = jQuery.inArray( "Attendance", JSON.parse(localStorage.Create) );
	var access_for_write = jQuery.inArray( "Attendance", JSON.parse(localStorage.Write) );
	var access_for_delete = jQuery.inArray( "Attendance", JSON.parse(localStorage.Delete) );
	var strAppend = '';
	if(status == 1){
		if (access_for_create != -1){
			strAppend = "<button type='button' onclick='addBrandingConfirmation()' class='btn-animate btn-eql-wid  btn btn-success'>Add</button>"
		}
			strAppend += " <button type='button' onclick='clearBrandingConfirmation()'  class='btn-animate btn-eql-wid  btn btn-warning '>Cancel / Clear</button>"
		$('#ta_branding_btn').html(strAppend);
	}else{
		if (access_for_write != -1){
			strAppend = "<button type='button' onclick='updateBrandingConfirmation()' class='btn-animate btn-eql-wid  btn btn-primary '>Update</button>"
		}if (access_for_delete != -1){
			strAppend += " <button type='button' onclick='removeBrandingConfirmation()' class='btn-animate btn-eql-wid  btn btn-danger '>Remove</button>"
		}
		strAppend += " <button type='button' onclick='clearBrandingConfirmation()' class='btn-animate btn-eql-wid  btn btn-warning '>Cancel / Clear</button>"
		$('#ta_branding_btn').html(strAppend);
	}
}


//jquery attendance validation
jQuery.validator.addMethod('valueNotEquals', function (value) {
  return (value != '0');
}, "year required");
$('.select2').select2().change(function(){
	$('.errorTxts').html('');
});
$('#branding_form').submit(function(e) {
  e.preventDefault();
}).validate({
 rules: {
	   branding_org_name: {
		   valueNotEquals:true,
	   },
	   branding_name: {
		   required:true,
	   },
	   branding_description: {
		   required:true,
	   },
	   branding_org_standard: {
		   valueNotEquals:true,
	   },
	   branding_org_polpro: {
		   valueNotEquals:true,
	   },
		 
 },
 //For custom messages
 messages: {
	 branding_org_name: {
		 valueNotEquals: "Select Valid Organization",
	 }, 
	 branding_name: {
		 required:"Enter Name",
	 },
	 branding_description: {
		 required:"Enter Description",
	 },
	 branding_org_standard: {
		   valueNotEquals: "Select Valid Organization Standard",
	 },
	 branding_org_polpro: {
		   valueNotEquals: "Select Valid Organization Policy & Procedure",
	 }
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
	return $('#branding_form').valid();
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


//search job name based on job list
var elem = document.getElementById('branding_search');
elem.addEventListener('keypress', function(e){
if (e.keyCode == 13) {
	  var job_name =  $('#branding_search').val()
	  if(job_name != ''){
		  brandingSearchList(job_name);
	  }else{
		  brandingData();
	  }		 
}
});


//fetch the branding datas
function brandingSearchList(name){
	$.ajax({
		url : "/ta_branding_data/",
		type : "POST",
		data : {'filter_name':name,csrfmiddlewaretoken:csrf_data},
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		var res_data = JSON.parse(json_data);
		var data = res_data.ta_datas;
		brandingListView(data);
	});
}