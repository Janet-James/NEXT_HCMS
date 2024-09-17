var columns = [{"title":"ID"}, {"title":"No."}, {"title":"Organization"},{"title":"Organization Unit"} ,{"title":"Employee"} ,{"title":"Profile"} , {"title":"Role"},{"title":"Team"},{"title":"Document Name"},{"title":"Document"},{"title":""}];
var datas = getFormValues("#hrms_past_document");
var	csrf_data = datas.csrfmiddlewaretoken;
//past documents data function here
$(document).ready(function(){
	documentTable();
});
//org change
$("#company").change(function() {
		org_unit($("#company  option:selected").val())
});
//org change
$("#organization_unit_id").change(function() {
	dropdownChange($("#company  option:selected").val(),$("#organization_unit_id  option:selected").val())
});
//org unit
function org_unit(val){
	$.ajax({
		url : "/hrms_org_unit_change_structure_data/",
		type : "GET",
		data : {'id':val},
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		datas = JSON.parse(json_data);
		dropDownList(datas.results,'organization_unit_id');
	});
}
//drop down list
function dropDownList(data,id){
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
//employee drop down changes
function dropdownChange(org,org_unit){
	$.ajax({
		url : "/hrms_employee_list_org_unit/",
		type : "POST",
		data : {'org_id':org,'org_unit_id':org_unit,csrfmiddlewaretoken:csrf_data},
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		res_datas = data.results;
		if(res_datas){
			strAppend = ""
				for(var i=0;i<res_datas.length;i++){
					strAppend += '<option value="'+res_datas[i].id+'">'+res_datas[i].name+'</option>'
				}
			$('#employees').html(strAppend);
			$('#employees').trigger("change");
		}
	});
}
//search past attendance
function searchPastDocumentConfirmation(){
	var past_status = past_docu_validation();
	if(past_status){
		var company_value = $('#company option:selected').val();
		var organization_unit_id = $('#organization_unit_id option:selected').val();
		var search_employees = $('select#employees').val();
		if(search_employees == null){
			data = {'org_id':company_value,'org_unit_id':organization_unit_id,'emp_list':[]}
		}else{
			data = {'org_id':company_value,'org_unit_id':organization_unit_id,'emp_list':search_employees}
		}
		console.log(data)
		$.ajax({
			url : '/hrms_past_doc_details/',
			type : 'POST',
			data : {"input_data":JSON.stringify([data]),csrfmiddlewaretoken:csrf_data},
			timeout : 10000,
			async:false,
		}).done( function(json_data) {
			data = JSON.parse(json_data);
			if(data.results.length>0){
				plaindatatable_btn("past_employee_doc_table",data.results,columns,0);
			}else{
				plaindatatable_btn("past_employee_doc_table",[],columns,0);
			}
			
		});
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

//clear past attendance
function clearPastDocumentConfirmation(){
	 $('#hrms_past_document')[0].reset();
	 $('#employees').val('').trigger("change");
	 $('#company').val('0').trigger("change");
	 $('#employees').html('');
	 $('#employees').trigger("change");
	 documentTable();
}

//jquery attendance validation
jQuery.validator.addMethod('valueNotEquals', function (value) {
  return (value != '0');
}, "year required");
$('.select2').select2().change(function(){
	$('.errorTxts').html('');
});
$('#hrms_past_document').submit(function(e) {
  e.preventDefault();
}).validate({
 rules: {
	   company: {
		   required: true,
		   valueNotEquals:true,
	   }, 
	   organization_unit_id: {
		   required: true,
		   valueNotEquals:true,
	   }, 
 },
 //For custom messages
 messages: {
	 company: {
		   valueNotEquals: "Select valid organization",
	   }, 
	 organization_unit_id: {
		   valueNotEquals: "Select valid organization unit",
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
function past_docu_validation()
{
	return $('#hrms_past_document').valid();
}
//document table
function documentTable(){
	plaindatatable_btn("past_employee_doc_table",[],columns,0);
}
