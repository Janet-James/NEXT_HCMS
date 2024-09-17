var columns = [{"title":"ID"}, {"title":"No."}, {"title":"Organization Name"}, {"title":"Organization Unit Name"} ,{"title":"Employee Name"},{"title":"Leave Type Name"}, {"title":"Leave days"} ];
var divisionListValues = []
var event_id = 0,gender="";
var id = 0;
var drop_down_id = 0;
var leave_type_data = '' ;
$(document).ready(function(){
	leaveBalanceListData();
	button_create(1)
	//table row click get id
	$("#levave_balance_table").on("click", "tr", function() { 
		if (!this.rowIndex) return; // skip first row
		button_create(0)
		id = $('#levave_balance_table').dataTable().fnGetData(this)[0];
		dataTableAcitveRowAdd('levave_balance_table',$(this).index());//active class add
		leavebalanceEventData(id);
	});
	leave_type_dropdown('all');
});
var organzaiton;
//org change
$("#company").change(function() {
		organzaiton= $('option:selected',this).val();
		org_unit(organzaiton)
});

//employee on change values get
$('#division_list').on('change', function(){
    var selected = $(this).find("option:selected");
    divisionListValues = [];
    selected.each(function(){
    	divisionListValues.push(parseInt($(this).val()));
    });
    divisionFilterEmployee(divisionListValues)
});

//division filter
function divisionFilterEmployee(divisionListValues){
	console.log("----------divisionListValues----",divisionListValues)
	$.ajax({
		url : "/hrms_employee_list_org_data/",
		type : "GET",
		data : {'id':organzaiton,'ouid':$('#organization_unit_id option:selected').val() != 0 ? $('#organization_unit_id option:selected').val():'','gender_id':gender_id,'div_list':JSON.stringify(divisionListValues)},
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		res_datas = data.results;
		if(res_datas){
			strAppend = ""
				for(var i=0;i<res_datas.length;i++){
					listEmployees.push(res_datas[i].id)
					strAppend += '<option value="'+res_datas[i].id+'">'+res_datas[i].name+'</option>'
				}
			$('#employees').html(strAppend);
			$('#employees').trigger("change");
		}
	});
}

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

$('#organization_unit_id').change(function() {
    var org_unit_id = this.value;
    if(org_unit_id != 0 ){
    	dropdownChange(0,organzaiton);
    	divisionList(org_unit_id);
    	$('#leave_bal_gender').val(0).trigger("change");
    }else{
    	$('#leave_bal_gender').val(0).trigger("change");
    }
});

//leave type dropdown
function leave_type_dropdown(status){
	if(leave_type_data != ''){
		$('#leave_type').html('');
		leavetypeAppend = '<option value="0">--Select Leave Type--</option>';
		if(status == 'all'){
			for(var i=0; i<leave_type_data.length;i++){
				if(leave_type_data[i].name != 'Maternity Leave' &&  leave_type_data[i].name != 'Paternity Leave'){
					leavetypeAppend +=  '<option value="'+leave_type_data[i].id+'">'+leave_type_data[i].name+'</option>';
				}
			}
		}else if(status == 'Male'){
			for(var i=0; i<leave_type_data.length;i++){
				if(leave_type_data[i].name != 'Maternity Leave'){
					leavetypeAppend +=  '<option value="'+leave_type_data[i].id+'">'+leave_type_data[i].name+'</option>';
				}
			}
		}else if(status == 'Female'){
			for(var i=0; i<leave_type_data.length;i++){
				if(leave_type_data[i].name != 'Paternity Leave'){
					leavetypeAppend +=  '<option value="'+leave_type_data[i].id+'">'+leave_type_data[i].name+'</option>';
				}
			}
		}else if(status == 'Others'){
			for(var i=0; i<leave_type_data.length;i++){
				leavetypeAppend +=  '<option value="'+leave_type_data[i].id+'">'+leave_type_data[i].name+'</option>';
			}
		}else{
			for(var i=0; i<leave_type_data.length;i++){
				if(leave_type_data[i].name != 'Maternity Leave' &&  leave_type_data[i].name != 'Paternity Leave'){
					leavetypeAppend +=  '<option value="'+leave_type_data[i].id+'">'+leave_type_data[i].name+'</option>';
				}
			}
		}
		$('#leave_type').html(leavetypeAppend);
		$('#leave_type').val('0').change();
	}
}

//gender change
$("#leave_bal_gender").change(function() {
	 var gender_text = $('option:selected', this).text();
	 var gender_id = $('option:selected', this).val();
	 leave_type_dropdown(gender_text);
	 dropdownChange(gender_id,organzaiton);
});


$('#leave_balance_check_status').change(function() {
    if($(this).is(":checked")) {
    	$('#employees').val(listEmployees).trigger("change");
    }else{
    	$('#employees').val([]).trigger("change");
    }
});
var listEmployees = []
//drop down changes
function dropdownChange(gender,val){
	if(gender == 0 ){
		gender_id = ''
	}else{
		gender_id = gender
	}
	$('#leave_balance_check_status').attr('checked',false);
	listEmployees = []
	$.ajax({
		url : "/hrms_employee_list_org_data/",
		type : "GET",
		data : {'id':val,'ouid':$('#organization_unit_id option:selected').val() != 0 ? $('#organization_unit_id option:selected').val():'','gender_id':gender_id},
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		res_datas = data.results;
		if(res_datas){
			strAppend = ""
				for(var i=0;i<res_datas.length;i++){
					listEmployees.push(res_datas[i].id)
					strAppend += '<option value="'+res_datas[i].id+'">'+res_datas[i].name+'</option>'
				}
			$('#employees').html(strAppend);
			$('#employees').trigger("change");
		}
	});
}
//leave List data function here
function leaveBalanceListData(){
	$.ajax({
		url : "/hrms_leave_balance_list_data/",
		type : "GET",
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		leave_type_data = data.leave_type;
		plaindatatable_btn("levave_balance_table",data.results,columns,0,'NEXT_TRANSFORM_HCMS_DOW_EMPLOYEE_LEAVE_BALANCE_'+currentDate());
	});
}
//leave List event data function here
function leavebalanceEventData(id){
	drop_down_id = 0;
	$.ajax({
		url : "/hrms_leave_balance_list_data/",
		type : "GET",
		data : {'id':id},
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		drop_data = JSON.parse(json_data);
		if(drop_data.results){
			event_id = drop_data.results[0].id;
			drop_down_id = drop_data.results[0].eid 
			$('#company').val(drop_data.results[0].oid).trigger("change");
			$('#organization_unit_id').val(drop_data.results[0].org_unit_id_id).trigger("change");
			$('#leave_bal_gender').val(drop_data.results[0].gender_id).trigger("change");
			$('#credit_days').val(drop_data.results[0].leave_days);
			$('#leave_type').val(drop_data.results[0].ltid).trigger("change");
			$('#lb_year').val(drop_data.results[0].year_id).trigger("change"); 
			if(drop_down_id != 0 ){
				$('#employees').val(drop_down_id).trigger("change");
				drop_down_id = 0;
			}
			$('#division_list').multiselect('select', [drop_data.results[0].team_name_id]);
		}
	});
} 
//operation past attendance
function opertionConfirmation(status){
	var company_value = $('#company option:selected').val();
	var organization_unit_id = $('#organization_unit_id option:selected').val();
	var lb_year = $('#lb_year option:selected').val();
	var leave_type = $('#leave_type option:selected').val();
	var credit_days = $('#credit_days').val();
	var search_employees = $('select#employees').val();
	if(search_employees == null){
		alert_lobibox("info",  sysparam_datas_list['NTE_40']);
	}else{
		data = {'c_id':company_value,'year_id':lb_year,'leave_type':leave_type,'credit_days':credit_days,'emp_list':search_employees,'organization_unit_id':organization_unit_id}
		if(status == 1){
			data['update_id'] = id 
			data['delete_id'] = '0';
			id = 0;
		}else if(status == 2){
			data['delete_id'] = id 
			data['update_id'] = '0' 
				id = 0;
		}else{
			data['delete_id'] = '0';
			data['update_id'] = '0' 
		}
		$.ajax({
			url : '/hrms_leave_balance_crud_operation/',
			type : 'POST',
			data : {"input_data":JSON.stringify([data])},
			timeout : 10000,
			async:false,
		}).done( function(json_data) {
			data = JSON.parse(json_data);
			var res_status = data['results']
			if(data['results'] == 'NTE_04'){
				button_create(1);
			}
			alert_lobibox("success", sysparam_datas_list[res_status]);
			clearLeaveBalanceConfirmation();
		});
	}
}
//add leave balance function here
function addLeaveBalanceConfirmation(){
	var leavebalance_status = leave_balance_validation();
	if(leavebalance_status){
		opertionConfirmation(0);
	}
}
//update leave balance function here
function updateLeaveBalanceConfirmation(){
	var leavebalance_status = leave_balance_validation();
	if(leavebalance_status){
		opertionConfirmation(1);
		button_create(1);
	}
}
//remove leave balance function here
function removeLeaveBalanceConfirmation(){
	var leavebalance_status = leave_balance_validation();
	if(leavebalance_status){
		var title = $('#leave_type option:selected').text();
		removeConfirmation('opertionConfirmation',2,title);
	}
}
//clear leave balance function here
function clearLeaveBalanceConfirmation(){
	leaveBalanceListData();
	event_id = 0;
	$('#hrms_leave_balance')[0].reset();
	$('#company').val('0').trigger("change");
	$('#leave_bal_gender,#lb_year').val(0).trigger("change");
	$('#leave_type').val('0').trigger("change");
	$('#employees').html('');
	$('#employees').trigger("change");
	$('#leave_balance_check_status').attr('checked',false);
	divisionListValues = [];
	$('#division_list').multiselect('select', divisionListValues);
}

//cancel clear function call button
function clearLeaveBalanceBtn(){
	if(event_id != 0 ){
		var title = $('#leave_type option:selected').text();
		orgClearFuncton('clearLeaveBalanceBtnCall','',title);
	}else{
		clearLeaveBalanceBtnCall();
	}
}

//cancel clear function call button
function clearLeaveBalanceBtnCall(){
	leaveBalanceListData();
	event_id = 0;
	$('#hrms_leave_balance')[0].reset();
	$('#company,#lb_year').val('0').trigger("change");
	$('#leave_bal_gender').val(0).trigger("change");
	$('#employees').html('');
	$('#employees').trigger("change");
	$('#leave_type').val('0').trigger("change");
	button_create(1);
	$('#leave_balance_check_status').attr('checked',false);
	divisionListValues = [];
	$('#division_list').multiselect('select', divisionListValues);
}
//button create function here
function button_create(status){
	var access_for_create = jQuery.inArray( "Leave Administration", JSON.parse(localStorage.Create) );
	var access_for_write = jQuery.inArray( "Leave Administration", JSON.parse(localStorage.Write) );
	var access_for_delete = jQuery.inArray( "Leave Administration", JSON.parse(localStorage.Delete) );
	var strAppend = '';
	if(status == 1){
		if (access_for_create != -1){
			strAppend = "<button type='button' onclick='addLeaveBalanceConfirmation()' class='btn-animate btn-eql-wid btn btn-success'>Add</button>"
		}
		strAppend += " <button type='button' onclick='clearLeaveBalanceBtn()' class='btn-animate btn-eql-wid btn btn-warning '>Cancel / Clear</button>"
		$('#leave_balance_btn').html(strAppend);
	}else{
		if (access_for_write != -1){
		strAppend = "<button type='button' onclick='updateLeaveBalanceConfirmation()' class='btn-animate btn-eql-wid btn btn-primary '>Update</button>"
		}if (access_for_delete != -1){
		strAppend += " <button type='button' onclick='removeLeaveBalanceConfirmation()' class='btn-animate btn-eql-wid  btn btn-danger '>Remove</button>"
		}
		strAppend += " <button type='button' onclick='clearLeaveBalanceBtn()' class='btn-animate btn-eql-wid  btn btn-warning '>Cancel / Clear</button>"
		$('#leave_balance_btn').html(strAppend);
	}
}

//date time picker validation
jQuery.validator.addMethod('year_validation', function (value) {
	var getYear = ($('#lb_year option:selected').text().trim());
	var currentYear = (new Date()).getFullYear();
	if(getYear >= currentYear){
		return true;
	} else {
	    return false;
	}
});

//jquery attendance validation
jQuery.validator.addMethod('valueNotEquals', function (value) {
	return (value != '0');
}, "year required");
$('.select2').select2().change(function(){
	$('.errorTxts').html('');
});
$('#hrms_leave_balance').submit(function(e) {
	e.preventDefault();
}).validate({
	rules: {
		company: {
			required: true,
			valueNotEquals:true,
		},
		credit_days: {
			required: true,
			maxlength:2,
			minlength:1,
			number: true
		}, 
		leave_type: {
			required: true,
			valueNotEquals:true,
		}, 
		lb_year: {
			required: true,
			valueNotEquals: true,
			year_validation: true,
		}, 
		organization_unit_id: {
			   required: true,
			   valueNotEquals:true,
		   }, 
	},
//	For custom messages
	messages: {
		company: {
			required: "Select Organization",
			valueNotEquals: "Select Valid Organization",
		},
		credit_days: {
			required: "Enter Credit Leave Days",
			maxlength: "Enter Credit Leave Days Valid",
			minlength: "Enter Credit Leave Days Valid",
			number : "Enter Credit Leave Days in Number",
		},
		leave_type: {
			required: "Select Leave Type",
			valueNotEquals: "Select Valid Leave Type",
		},
		organization_unit_id: {
			required: "Select Organization Unit",
			valueNotEquals: "Select Valid Organization Unit",
		},
		lb_year: {
			required: "Select Holiday Year",
			valueNotEquals: "Select Valid Holiday Year",
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
function leave_balance_validation()
{
	return $('#hrms_leave_balance').valid();
}

//called when key is pressed in textbox
$('#credit_days').keypress(function (e) {
	//if the letter is not digit then display error and don't type anything
	if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57) && (e.which != 46)) {
		return false;
	}
});
