var columns = [{"title":"ID"}, {"title":"No."}, {"title":"Organization"},{"title":"Organization Unit"} ,{"title":"Employee"} ,{"title":"Profile"} , {"title":"Role"},{"title":"Team"},{"title":"Document Name"},{"title":"Document"},{"title":""},{"title":""}  ];
var datas = getFormValues("#hrms_document_list");
var	csrf_data = datas.csrfmiddlewaretoken;
var currentDate = new Date()
var day = currentDate.getDate()
var month = currentDate.getMonth() + 1
var year = currentDate.getFullYear()
var id = 0;
$(document).ready(function(){
	$('.employeeAdvancedUploadOn,.employeeAdvancedUploadBy').attr("disabled", true); 
	documentTable();
	doc_button_create(1)
	//table row click get id
	$("#document_table").on("click", "tr", function() { 
		if (!this.rowIndex) return; // skip first row
		id = $('#document_table').dataTable().fnGetData(this)[0];
		doc_emp_name = $('#document_table').dataTable().fnGetData(this)[4];
		doc_emp_profile = $('#document_table').dataTable().fnGetData(this)[5];
		doc_type = $('#document_table').dataTable().fnGetData(this)[8];
		doc_name = $('#document_table').dataTable().fnGetData(this)[9];
		$('#popup_emp_name').html(doc_emp_name);
		$('#popup_profile_name').html(doc_emp_profile);
		$('#popup_doc_type').html(doc_type);
		$('#popup_doc_name').html(doc_name);
	});
});
//button create function here
function doc_button_create(status){
	if(status == 1){
		strAppend = "<button type='button' onclick='addDocumentConfirmation()' class='btn-animate btn-eql-wid  btn btn-success'>Add</button>"
			strAppend += " <button type='button' onclick='employeeDocumentRefresh()' class='btn-animate btn-eql-wid  btn btn-warning '>Cancel / Clear</button>"
				$('#hrms_document_btn').html(strAppend);
	}
}

//remove function 
function removeDocumentConfirmation(){
	if(id != 0){
		$('#reason_type').val(0).change();
	}else{
		alert_lobibox("error", sysparam_datas_list['NTE_61']);
	}
}
//download file 
function downloadFile(e){
	var file_path = e.id;
	var a = document.createElement('A');
	a.href = file_path;
	a.download = file_path.substr(file_path.lastIndexOf('/') + 1);
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
}

//delete file
function deleteFile(e){
	if(e.id != 0){
		$('#reason_type').val(0).change();
		$('#document_remove_modal').modal('show');
	}else{
		alert_lobibox("error", sysparam_datas_list['NTE_62']);
	}
}


//document delete function call
function proceedPopupConfirmation(){
	if(document_popup_form_validation()){
		$('#document_remove_modal').modal('hide');
		var doc_type_id = $('#reason_type option:selected').val();
		if(doc_type_id != 0 && id != 0){
			$.ajax({
				url : "/hrms_employee_document_create/",
				type : "POST",
				data : {"del_id":id,'doc_type_id':doc_type_id,csrfmiddlewaretoken:csrf_data},
				timeout : 10000,
				async:false,
			}).done( function(json_data) {
				data = JSON.parse(json_data);
				var res_status = data['results']
				alert_lobibox("success", sysparam_datas_list[res_status]);
				if(res_status == "NTE_04"){
					documentTable();
					employeeDocumentRefresh();
					}
			});
		}else{
			alert_lobibox("error", sysparam_datas_list['NTE_63']);
		}
	}
}

//employee select change
$( "#employee" ).on( "click", function() {
	if(arrayOfValues.length > 0){
		$.ajax({
			url : "/hrms_employee_details_data/",
			type : "POST",
			data : {'id':arrayOfValues[0],csrfmiddlewaretoken:csrf_data},
			timeout : 10000,
			async:false,
		}).done( function(json_data) {
			data = JSON.parse(json_data);
			employeeDocDetails(data.datas,data.user);
		});
	}else{
		return true
	}
});

//employee details show
function employeeDocDetails(data,val){
	var strAppend1 = '';
	var strAppend2 = '';
	if(data.length>0){
		$('#uploaded_on').val(day+'-'+month+'-'+year);
		strAppend1 += '<img class="" src="'+image_path+data[0].image+'" alt="No Image Found" title="'+data[0].name+'" style="margin-top: 15px;width: 100px;height: 100px;" />'
		strAppend2 += '<span> <b>Name : </b>'+data[0].name+'</span></br>';
		strAppend2 += '<span> <b>ID : </b>'+data[0].employee_id+'</span></br>';
		strAppend2 += '<span> <b>Role : </b>'+data[0].role_title+'</span></br>';
		strAppend2 += '<span> <b>Organization : </b>'+data[0].org_name+'</span></br>';
		strAppend2 += '<span> <b>Organization Unit : </b>'+data[0].org_unit_name+'</span></br>';
		strAppend2 += '<span> <b>Team : </b>'+data[0].tname+'</span></br>';
	}else{
		strAppend1 += '<p style="text-align: center;margin-top: 65px;font-size: 16px;">Select employee.saw employee profile<p>';
		strAppend2 += '<p style="text-align: center;margin-top: 75px;font-size: 16px;">Select employee.saw employee details<p>';
		$('#uploaded_by,#uploaded_on').val('');
	}
	
	$('#uploaded_by').val(val);
	$('#employee_img').html(strAppend1);
	$('#employee_details').html(strAppend2);
}

//upload files content get
function uploadFileContent(input) {
	var strAppend = ''
		if (input.files && input.files[0]) {
			$(input.files).each(function () {
				var extension = (input.files[0]['name']).split('.')[1];
				var fname_status = fileNameValidation(input.files[0]['name']);
				if(fname_status == 0){
					if($.inArray(extension, ['doc','pdf','docx']) == -1){
						alert_lobibox("error", "Invalid extension.please select doc,docx,pdf");
					}else{
						var filename = (input.files[0]['name']).replace(/\s/g, '');
						var reader = new FileReader();
						reader.readAsDataURL(this);
						reader.onloadend = function (e) {
							var fileContent = e.target.result.split(',')[1];
							strAppend += '<li value="'+(fileContent)+'" class="'+filename+'"><span>'+input.files[0]['name']+'</span>  <button class="removeClass"><i class="nf nf-close"></i></button></li>'
							$('#file_upload_content').append(strAppend);
						}
					}
				}else{
					alert_lobibox("error",sysparam_datas_list['ERR0039']);
				}
			});
		}
}

//file name validation 
function fileNameValidation(fName){
	var val = 0;
	$('#file_upload_content li').each(function(element){// id of ul
		var fNames = $(this).attr("class");
		if(fNames == fName){
			val = 1
		}
	})
	return val;
}
//remove the file
$('ul').on('click','.removeClass' , function(el){
    $(this).parent().remove()
});

//image data get function here
function getImageData(){
	file_datas_list = []
	$('#file_upload_content li').each(function(element){// id of ul
		file_data = {}
		file_data['name'] = $(this).attr("class");
		file_data['format'] = $(this).attr("class").split('.')[1];
		file_data['encode'] = $(this).attr("value");
		file_datas_list.push(file_data); 
	})
	return file_datas_list;
}


//upload files in server
function addDocumentConfirmation(){
	var datas = getImageData();
	if(document_form_validation()){
		if(datas.length > 0){
			console.log(datas); 
			project_list = [];
			project_dict = {};
			project_form_value = {};
			project_form_value['uploaded_on'] =  $('#uploaded_on').val();
			project_form_value['uploaded_by'] =  $('#uploaded_by').val();
			project_form_value['notes'] =  $('#notes').val();
			project_form_value['employee_id'] =  arrayOfValues[0];
			project_form_value['org_id'] =  $('#organization option:selected').val();
			project_form_value['unit_id'] =  $('#organization_unit option:selected').val();
			project_form_value['doc_id'] =  $('#document_type option:selected').val();
			project_form_value['image_data'] = datas;
			project_list.push(project_form_value);
			project_dict['input_data'] = project_list;
			json_response = JSON.stringify(project_dict);
			console.log(json_response); 
			$.ajax({
				url : "/hrms_employee_document_create/",
				type : "POST",
				data : {"results":json_response,csrfmiddlewaretoken:csrf_data},
				timeout : 10000,
				async:false,
			}).done( function(json_data) {
				data = JSON.parse(json_data);
				var res_status = data['results']
				alert_lobibox("success", sysparam_datas_list[res_status]);
				if(res_status == "NTE_01"){
					documentTable();
					employeeDocumentRefresh();
					}
			});
		}else{
			alert('Add Attachment!!!')
		}
	}else{
		return false;
	}
	
}

//cancel clear function call button
function employeeDocumentRefresh(){
	$('#hrms_document_list')[0].reset();
	$('#document_type').val('0').trigger("change");
	$('#file_upload_content').html('');
	employeeDocDetails([],'');
	doc_button_create(1)
}

//document table
function documentTable(){
	$.ajax({
		url : "/hrms_attachment_doc_details/",
		type : "GET",
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		datas = JSON.parse(json_data);
		if(datas.results.length > 0){
			plaindatatable_btn("document_table",datas.results,columns,0);
		}else{
			plaindatatable_btn("document_table",[],columns,0);
		}
	});	
}


//jquery attendance validation
jQuery.validator.addMethod('valueNotEquals', function (value) {
  return (value != '0');
}, "year required");
$('.select2').select2().change(function(){
	$('.errorTxts').html('');
});
$('#hrms_document_list').submit(function(e) {
  e.preventDefault();
}).validate({
 rules: {
	   employee: {
		   required: true,
	   },
	   notes: {
		   required: true,
	   },  
	   document_type: {
		   required: true,
		   valueNotEquals:true,
	   },
 },
 //For custom messages
 messages: {
	   employee: {
		   required: "Select valid Employee",
	   },  
	   notes: {
		   required: "Enter notes about document",
	   },  
	   document_type: {
	         required: "Select document type",
	         valueNotEquals: "Select valid document type",
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
function document_form_validation()
{
	return $('#hrms_document_list').valid();
}

$('#hrms_document_popup').submit(function(e) {
  e.preventDefault();
}).validate({
 rules: {
	 reason_type: {
		   required: true,
		   valueNotEquals:true,
	   },
 },
 //For custom messages
 messages: {
	 reason_type: {
	         required: "Select reason type",
	         valueNotEquals: "Select valid reason type",
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
function document_popup_form_validation()
{
	return $('#hrms_document_popup').valid();
}
