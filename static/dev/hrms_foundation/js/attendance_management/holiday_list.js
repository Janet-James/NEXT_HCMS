var columns = [{"title":"ID"}, {"title":"No."}, {"title":"Information"} ,{"title":"Date"}, {"title":"Organization Name"}, {"title":"Organization Unit Name"},{"title":"Holiday Type"} ];
var arrOrgUnitSelected = [];
var event_id = 0;
var id = 0;
$(document).ready(function(){
	holidayListData();
	button_create(1);
	//table row click get id
	$("#holiday_table").on("click", "tr", function() { 
		if (!this.rowIndex) return; // skip first row
		button_create(0)
		id = $('#holiday_table').dataTable().fnGetData(this)[0];
		holidayListEventData(id);
		dataTableAcitveRowAdd('holiday_table',$(this).index());
	});
});
//add confirmation function here.
function addHolidayListConfirmation(){ 
	id = 0;
	dataForm();
}
//update confirmation function here.
function updateHolidayListConfirmation(){
	id = 1;
	dataForm();
}
//form reset function here
function clearHolidayListConfirmation(){
	 $('#hrms_holiday_list')[0].reset();
	 $('#company,#holiday_type,#holiday_year').val('0').trigger("change");
	 $('#organization_unit_id').html('<option value="0">--Select Organization Unit--</option>').multiselect('rebuild');
	 $('organization_unit_id').multiselect('select', []);
	 arrOrgUnitSelected = [];
	 event_id = 0;
	 $("#date").val('');
	 $(".date_input_class").trigger('change');
}
//cancel clear function call button
function clearHolidayBtnCall(){
	$('#hrms_holiday_list')[0].reset();
	$('#company,#holiday_type,#holiday_year').val('0').trigger("change");
	$("#date").val('');
	event_id = 0;
	$('#organization_unit_id').html('<option value="0">--Select Organization Unit--</option>').multiselect('rebuild');
	$('organization_unit_id').multiselect('select', []);
	arrOrgUnitSelected = [];
	button_create(1);
	$("#date").val('');
	$(".date_input_class").trigger('change');
}

//cancel clear function call button
function clearHolidayBtn(){
	if(event_id != 0 ){
		var title = $('#holiday_info').val();
		orgClearFuncton('clearHolidayBtnCall','',title);
	}else{
		clearHolidayBtnCall();
	}
}

//org change
$("#company").change(function() {
		org_unit($("#company  option:selected").val())
});

//org unit onchange values get
$('#organization_unit_id').on('change', function(){
    var selected = $(this).find("option:selected");
    arrOrgUnitSelected = [];
    selected.each(function(){
    	arrOrgUnitSelected.push($(this).val());
    });
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
	strAppend = ''
		if(data.length>0){
			for(var i=0;i<data.length;i++){
				strAppend += '<option value="'+data[i].id+'">'+data[i].name+'</option>'
			}
			$('#'+id).html(strAppend).multiselect('rebuild');
		}else{
			$('#'+id).html(strAppend).multiselect('rebuild');
		}
	 $('#organization_unit_id').multiselect({ nonSelectedText:'--Select Oraganization Unit--'});
}
//remove confirmation function here.
function removeAttendanceConfirmation(){
	var status = holiday_form_validation();
	if(status){
		id = 3;
		var title = $('#holiday_info').val();
		removeConfirmation('dataForm','',title);
	}
}
//data form in object
function dataForm(){
	var status = holiday_form_validation();
	if(status){
		project_list = [];
		project_dict = {};
		var project_form_value = getFormValues("#hrms_holiday_list");
		project_form_value['date'] = dateFormatChange($('#date').val());
		project_list.push(project_form_value);
		project_dict['input_data'] = project_list;
		project_dict['org_unit_ids'] = arrOrgUnitSelected;
		json_response = JSON.stringify(project_dict);
		method = 'POST';
		url = "/hrms_holiday_crud_operation/";
		console.log("------json_response------------",json_response,event_id)
		crud_function(method, json_response, url);	
	}
}
//date format change
function dateFormatChange(val){
	return val.split('-')[2]+'-'+val.split('-')[1]+'-'+val.split('-')[0]
}
//create function here
function crud_function(methods, datas, urls) {
	if(id == 0){
		res_data = { "results":datas }
		input_status = true
	}else if(id == 1){
		if(event_id != 0){
			dataString1 = $('#hrms_holiday_list').serializeArray();//data get string
			input_status = UpdateReistriction(dataString,dataString1)
			res_data = { "results":datas,"update_id":event_id }
		}
	}else if(id == 3){
		if(event_id != 0){
			res_data = { "results":datas,"delete_id":event_id }
		}
		input_status = true
	} 
	if(input_status){
	$.ajax({
		url : urls,
		type : methods,
		data : res_data,
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		var res_status = data['results']
		if(res_status == "NTE_01"){
			alert_lobibox("success", sysparam_datas_list[res_status]);
		}else if(res_status == "NTE_03" || res_status == "NTE_14"){
			button_create(1);
			alert_lobibox("success", sysparam_datas_list[res_status]);
		}else{
			alert_lobibox("success", sysparam_datas_list[res_status]);
			button_create(1);
		}
		holidayListData();
		clearHolidayListConfirmation();
	});
	}else{
		alert_lobibox("error", 'Record not updated. No change has occurred');
	}
}

// holiday List data function here
function holidayListData(){
	$.ajax({
		url : "/hrms_holiday_list_data/",
		type : "GET",
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		plaindatatable_btn("holiday_table",data.results,columns,0,'NEXT_TRANSFORM_HCMS_DOW_HOLIDAY_'+currentDate());
	});
}

//holiday List data function here
function holidayListEventData(id){
	$.ajax({
		url : "/hrms_holiday_list_data/",
		type : "GET",
		data : {'id':id},
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		if(data.results){
			$('#company').val(data.results[0].org_id_id).trigger("change");
			$('#holiday_type').val(data.results[0].holiday_type_id).trigger("change");
			$('#holiday_info').val(data.results[0].holiday_information);
			$("#date").val(data.results[0].date);
			$(".date_input_class").trigger('change');
			$('#holiday_year').val(data.results[0].year_id).trigger("change");
			$('#organization_unit_id').multiselect('select', [data.results[0].org_unit_id_id]);
			arrOrgUnitSelected = [];
			arrOrgUnitSelected.push(data.results[0].org_unit_id_id);
			event_id = data.results[0].id;
			dataString = $('#hrms_holiday_list').serializeArray();//data get string
		}
	});
}
//button create function here
function button_create(status){
	var access_for_create = jQuery.inArray( "Holiday Administration", JSON.parse(localStorage.Create) );
	var access_for_write = jQuery.inArray( "Holiday Administration", JSON.parse(localStorage.Write) );
	var access_for_delete = jQuery.inArray( "Holiday Administration", JSON.parse(localStorage.Delete) );
	var strAppend = '';
	if(status == 1){
		if (access_for_create != -1){
			strAppend = "<button type='button' onclick='addHolidayListConfirmation()' class='btn-animate btn-eql-wid btn btn-success'>Add</button>"
		}
		strAppend += " <button type='button' onclick='clearHolidayBtn()' class='btn-animate btn-eql-wid btn btn-warning '>Cancel / Clear</button>"
		$('#holiday_list').html(strAppend);
	}else{
		if (access_for_write != -1){
			strAppend = "<button type='button' onclick='updateHolidayListConfirmation()' class='btn-animate btn-eql-wid  btn btn-primary '>Update</button>"
		}
		if (access_for_delete != -1){
		strAppend += " <button type='button' onclick='removeAttendanceConfirmation()' class='btn-animate btn-eql-wid  btn btn-danger '>Remove</button>"
		}
		strAppend += " <button type='button' onclick='clearHolidayBtn()' class='btn-animate btn-eql-wid btn btn-warning '>Cancel / Clear</button>"
		$('#holiday_list').html(strAppend);
	}
}

//jquery attendance validation
jQuery.validator.addMethod('valueNotEquals', function (value) {
  return (value != '0');
}, "year required");
//jquery org unit validation
jQuery.validator.addMethod('orgUnitValidation', function (value) {
	console.log("------------------arrOrgUnitSelected---------------------------------------------------",arrOrgUnitSelected)
  return arrOrgUnitSelected.length > 0 ? true : false;
}, "year required");

$('.select2').select2().change(function(){
	$('.errorTxts').html('');
});

//date time picker validation
jQuery.validator.addMethod('year_validation', function (value) {
	var getYear = ($('#holiday_year option:selected').text().trim());
	var currentYear = (new Date()).getFullYear();
	if(getYear >= currentYear){
		return true;
	} else {
	    return false;
	}
});

$('#hrms_holiday_list').submit(function(e) {
  e.preventDefault();
}).validate({
 rules: {
	   date: {
		   required: true,
	   },
	   holiday_info: {
		   required: true,
	   }, 
	   holiday_type: {
		   required: true,
		   valueNotEquals:true,
	   }, 
	   company: {
		   required: true,
		   valueNotEquals:true,
	   }, 
	   organization_unit_id: {
		   orgUnitValidation:true,
	   }, 
	   holiday_year: {
		   valueNotEquals:true,
		   year_validation: true
	   }, 
 },
 //For custom messages
 messages: {
	 date: {
		 required: "Select Date",
	 },
	 holiday_info: {
		 required: "Enter a Holiday Information",
	 },
	 company: {
		 required: "Select Organization",
		 valueNotEquals: "Select Valid Organization",
	 }, 
	 holiday_type: {
		 required: "Select Holiday Type",
		 valueNotEquals: "Select Valid Holiday Type",
	 }, 
	 organization_unit_id: {
         orgUnitValidation: "Select Valid Organization Unit",
     },
     holiday_year: {
		 valueNotEquals: "Select Valid Year",
		 year_validation: "Select Current Year or Future Year"
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
function holiday_form_validation()
{
	return $('#hrms_holiday_list').valid();
}

// date validation 
function DatePickerInputUpdate(){
	var input = $("#date").val();
	// var input = date.value;
    var cdate = getDate(input);
    console.log("input year", cdate.getFullYear());

  	var todaysDate = new Date();
	let yearr = todaysDate.getFullYear()
	console.log("current year", yearr, cdate)

    if(cdate.getFullYear() >= yearr) {
		$("#validate_date").text('')
		return true;

    } else {
		$("#date").val('');
		$("#validate_date").text("Invalid date please select current year!!!")
	  	return false;
    }
  }

  function getDate(input) {
    var arr = [];
    var seperator = ['/', '-'];
    var year, month, date;
    var yearIndex = 2;
    var result = undefined;

    seperator.forEach(function(s) {
        if (input.indexOf(s) > -1)
            arr = input.split(s);
    });

    if (arr.length > 1) {
        // Set year
        if (arr[0] > 1000) {
            year = arr[0]
            yearIndex = 0;
        } else if (arr[2] > 1000) {
            year = arr[2];
            yearIndex = 2;
        }

        // set month and date
        // If string starts with year, assume yyyy/mm/dd
        if (yearIndex === 0) {
            month = arr[1]
            date = arr[2]
        } else {
            // If value greater than 12, assume it as date and other one as month
            if (arr[0] > 12) {
                date = arr[0]
                month = arr[1]
            } else if (arr[1] > 12) {
                date = arr[1]
                month = arr[0]
            }
            // If none of the value is ggreater than 12, assume default format of dd/mm/yyyy
            else {
                date = arr[0]
                month = arr[1]
            }
        }

        result = new Date(year, month - 1, date);
    }
    return result;
}
