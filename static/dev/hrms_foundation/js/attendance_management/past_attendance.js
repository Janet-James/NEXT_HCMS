var columns = [{"title":"ID"}, {"title":"No."},{"title":"Organization"},{"title":"Organization Unit"}, {"title":"Employee"} , {"title":"Clock In"},{"title":"Clock Out"} ];
var divisionListValues = []
//past attendance data function here
$(document).ready(function(){
	attendanceData();
});
//org change
$("#company").change(function() {
		org_unit($("#company  option:selected").val())
});
//org change
$("#organization_unit_id").change(function() {
	divisionList($("#organization_unit_id  option:selected").val())
	dropdownChange($("#company  option:selected").val(),$("#organization_unit_id  option:selected").val(),[])
});


//employee on change values get
$('#division_list').on('change', function(){
    var selected = $(this).find("option:selected");
    divisionListValues = [];
    selected.each(function(){
    	divisionListValues.push(parseInt($(this).val()));
    });
    dropdownChange($("#company  option:selected").val(),$("#organization_unit_id  option:selected").val(),divisionListValues)
});

//division list
function divisionList(org_unit_id){
	if(org_unit_id !=0 ){
		$.ajax({
			url : "/hrms_fetch_role_drop_down/",
			type : "POST",
			data : {"org_unit_id":org_unit_id},
			csrfmiddlewaretoken : $("input[name=csrfmiddlewaretoken]").val(),
			timeout : 10000,
			async:false, 
		}).done( function(json_data) {
			data = JSON.parse(json_data);
			divisionDropDownList(data.team_info,'division_list');
		});
	}
}

//drop down list
function divisionDropDownList(data,id){
	let strAppend = ''
		if(data.length>0){
			for(var i=0;i<data.length;i++){
				strAppend += '<option value="'+data[i].id+'">'+data[i].name+'</option>'
			}
			$('#'+id).html(strAppend).multiselect('rebuild');
		}else{
			$('#'+id).html(strAppend).multiselect('rebuild');
		}
	$('#'+id).multiselect({ nonSelectedText:'--Select Employee--'});
}

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
function dropdownChange(org,org_unit,div_list){
	var datas = getFormValues("#hrms_past_attendance");
	var	csrf_data = datas.csrfmiddlewaretoken;
	$.ajax({
		url : "/hrms_employee_list_org_unit/",
		type : "POST",
		data : {'org_id':org,'org_unit_id':org_unit,csrfmiddlewaretoken:csrf_data,'div_list':JSON.stringify(div_list)},
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
function searchPastAttendanceConfirmation(){
	$('.lobibox-close').trigger('click');//close previous lobibox
	var past_status = attendance_form_past_validation();
	if(past_status){
		var company_value = $('#company option:selected').val();
		var organization_unit_id = $('#organization_unit_id option:selected').val();
		var from_date = formatChange($('#from_date').val())
		var to_date = formatChange($('#to_date').val());
		var search_employees = $('select#employees').val();
		var datas = getFormValues("#hrms_past_attendance");
		var	csrf_data = datas.csrfmiddlewaretoken;
		if(search_employees == null){
			data = {'c_id':company_value,'org_unit_id':organization_unit_id,'from_date':from_date,'to_date':to_date,'emp_list':[]}
		}else{
			data = {'c_id':company_value,'org_unit_id':organization_unit_id,'from_date':from_date,'to_date':to_date,'emp_list':search_employees}
		}
		$.ajax({
			url : '/hrms_search_employee_attendance/',
			type : 'POST',
			data : {"input_data":JSON.stringify([data]),csrfmiddlewaretoken:csrf_data},
			timeout : 10000,
			async:false,
		}).done( function(json_data) {
			data = JSON.parse(json_data);
			alert_lobibox("success",sysparam_datas_list['NTE_57']);
			plaindatatable_btn("attendance_table",data.results,columns,0,'NEXT_TRANSFORM_HCMS_DOW_PAST_ATTENDANCE_'+currentDate());
		});
	}
}
//clear past attendance
function clearPastAttendanceConfirmation(){
	 $('#hrms_past_attendance')[0].reset();
	 $('#employees').val('').trigger("change");
	 $('#company').val('0').trigger("change");
	 $('#employees').html('');
	 $('#employees').trigger("change");
	 divisionListValues = [];
	 $('#division_list').multiselect('select', divisionListValues);
	 attendanceData();
}

//jquery attendance validation
jQuery.validator.addMethod('valueNotEquals', function (value) {
  return (value != '0');
}, "year required");
$('.select2').select2().change(function(){
	$('.errorTxts').html('');
});
$('#hrms_past_attendance').submit(function(e) {
  e.preventDefault();
}).validate({
 rules: {
	   from_date: {
		   required: true,
	   },
	   to_date: {
		   required: true,
	   }, 
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
	 from_date: {
		 required: "Select From Date",
	 },
	 to_date: {
		 required: "Select To Date",
	 },
	 company: {
		 required: "Select Organization",
		 valueNotEquals: "Select Valid Organization",
	 }, 
	 organization_unit_id: {
		 required: "Select Organization Unit",
		 valueNotEquals: "Select Valid Organization Unit",
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
function attendance_form_past_validation()
{
	return $('#hrms_past_attendance').valid();
}
//attendance table data 
function attendanceData(){
	$.ajax({
		url : "/hrms_attendance_data/",
		type : "GET",
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		plaindatatable_btn("attendance_table",data.results,columns,0,'NEXT_TRANSFORM_HCMS_DOW_EMPLOYEE_PAST_ATTENDANCE_'+currentDate());
	});
}

