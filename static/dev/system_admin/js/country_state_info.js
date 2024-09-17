var country_details_table_id ='',
state_details_table_id = '';

$(document).ready(function () {
	countryList();
	// Country detail data table load function
	country_detail_table_function();
	// State detail data table load function
	state_detail_table_function();
	$("#country_active,#state_active").prop( "checked", false );
});

function countryList(){
	$.ajax({
		type  : 'GET',
		url   : '/country_record_active/',
	}).done( function(jsondata) {
		var data = JSON.parse(jsondata);
		if (data.status == "NTE_01"){
			let country_data = data.table_datas;
			$('#country_data').html('');
			let country_data_str = ''
			for(let i=0; i<country_data.length; i++){
				country_data_str += '<option value='+country_data[i].id+'>'+country_data[i].country_name+'</option>'
			}
			$('#country_data').html(country_data_str);
			$('select#country_data').select2({
				placeholder: 'Select Country',
				allowClear: true,
				minimumInputLength: 0,
			});
			$("select#country_data").val(0).trigger('change');
		} 
	});
}

function action_for_country(action_name){
	if (action_name == "add") {
		// Country added function
		country_data_management('add');
		return false 
	} else if (action_name == "update") {
		// Country updated function
		country_data_management('update');
		return false
	} else if (action_name == "remove") {
		// Country deleted function
		let title = $('#country_name').val() || '' ;
		removeConfirmation('country_data_management', 'remove', title);
		return false
	} else if (action_name == "clear") {
		// Country form clear function
		form_inputs_clear('#country_form');
		$("#country_active").prop( "checked", false );
	} else if (action_name == "cancel") {
		// Country form cancel function
		form_inputs_clear('#country_form');
		country_btns_draw('add');
		$("#country_active").prop( "checked", false );
	} 
}

//Country Buttons draw function  
function country_btns_draw(action_name){
	$("#country_btm_btns").html(''); 
	var country_btnstr = '';
	var access_for_create = jQuery.inArray( "Country & Province Master", JSON.parse(localStorage.Create) );
	var access_for_write = jQuery.inArray( "Country & Province Master", JSON.parse(localStorage.Write) );
	var access_for_delete = jQuery.inArray( "Country & Province Master", JSON.parse(localStorage.Delete) );
	if (action_name == 'add') {
		if (access_for_create != -1){ 
			country_btnstr += '<button type="button" class="btn btn-success btn-eql-wid btn-animate margin-right-3" onclick="action_for_country(\''+"add"+'\')">Add</button>';
		}
		country_btnstr += '<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-3" onclick="action_for_country(\''+"clear"+'\')">Cancel / Clear</button>';
	} else if (action_name == 'update') {
		if (access_for_write != -1){
			country_btnstr += '<button type="button" class="btn btn-primary btn-eql-wid btn-animate margin-right-3" onclick="action_for_country(\''+"update"+'\')">Update</button>';
		}
		if (access_for_delete != -1){
			country_btnstr += '<button type="button" class="btn btn-danger btn-eql-wid btn-animate margin-right-2" onclick="action_for_country(\''+"remove"+'\')">Remove</button>';
		}
		country_btnstr += '<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-1" onclick="update_clear_func(\''+"cancel"+'\')">Cancel / Clear</button>';
	}
	$("#country_btm_btns").append(country_btnstr);
}

//Update form clear function
function update_clear_func(action_name) {
	let title = $('#country_name').val() || '' ;
	orgClearFuncton('action_for_country', action_name, title);
}

//Country details datatable load function
function country_detail_table_function(){
	var currurl = window.location.href;
	var actionurl = currurl.replace('country_state/', 'country_record/');
	var columns = [{'title':'ID','name':'id'}, {'title':'No.','name':'row_number'}, 
	           {'title':'Country Name','name':'country_name'}, {'title':'Country Status','name':'country_status'}];
	$.ajax({
		url : actionurl,
		type : 'GET',
	}).done(function(json_data)	{
		var data = JSON.parse(json_data);
		var country_list = []; 
		if (data.status == "NTE_01"){
			data = data.table_datas;
			$("#country_table_tbody tr:gt(0)").remove(); 
			for (var i=0; i<data.length; i++){
				country_list.push([data[i].id, (i+1), data[i].country_name,data[i].country_active ]);
			}
			plaindatatable_btn('country_table', country_list, columns, 0,  'NEXT_TRANSFORM_NEXT-HCMS_Country_Details'+currentDate());
		} else {
			alert_lobibox("error", sysparam_datas_list[data.status]);
		}
	});
	return false
}

//Country details table row click get id
$("#country_table tbody").on("click", "tr", function() {    
	var currurl = window.location.href;
	var actionurl = currurl.replace('country_state/','country_record/');
	country_details_table_id = $('#country_table').dataTable().fnGetData(this)[0];
	$.ajax({
		url : actionurl,
		type : 'GET',
		data: {
			'country_id':country_details_table_id
		}
	}).done(function(json_data)	{
		var temp = '';
		var data = JSON.parse(json_data);
		temp = data.table_datas;
		if (data.status == "NTE_01") {
			country_btns_draw('update');
			formData = temp.filter(data=> {return temp[0].country_id==country_details_table_id})[0];
			var $inputs = $('#country_form :input');// get the form id value
			$inputs.each(function() { 
				if (this.name in formData) { 
					if (this.name== "country_active") {
						if (formData[this.name] == false){ 
							$("#"+this.name).prop( "checked", false ); 
						}else{
							$("#"+this.name).prop( "checked", true );
						}
					} else { 
						$("#"+this.name).val(formData[this.name]).trigger("change");
					}
				}  
			}); 
		} else {
			alert_lobibox("error", sysparam_datas_list[data.status]);
		}
	});
});

//Country details data management function
function country_data_management(func_name, event){
	var currurl = window.location.href;
	var actionurl = currurl.replace('country_state/','country_datainsert/');
	if (func_name == "remove") {
		var datas = getFormValues("#country_form");
		var	csrf_data = datas.csrfmiddlewaretoken;
		if (datas.country_id.length > 0){
			$.ajax({
				type  : 'POST',
				url   : actionurl,
				data: {
					'delete_id': datas.country_id,
					csrfmiddlewaretoken: csrf_data
				},
			}).done( function(jsondata) {
				var data = JSON.parse(jsondata);
				if (data.status == "NTE_04"){
					country_btns_draw('add');
					form_inputs_clear('#country_form');
					country_detail_table_function();
					countryList();
					$("#country_active,#state_active").prop( "checked", false );
					alert_lobibox("success", sysparam_datas_list[data.status]);
				} else {
					alert_lobibox("error", sysparam_datas_list[data.status]);
				}
			});
		}
	} else {
		if(country_form_validation()) {
			var datas = getFormValues("#country_form");
			var	csrf_data = datas.csrfmiddlewaretoken;
			if ($("#country_active").is(":checked")){
				datas['country_active'] = true;
			} else {
				datas['country_active'] = false;
			}
			$.ajax({
				type  : 'POST',
				url   : actionurl,
				data: {
					'datas': JSON.stringify(datas),
					csrfmiddlewaretoken: csrf_data
				},
			}).done( function(jsondata) {
				var data = JSON.parse(jsondata);
				if (data.status == "NTE_01"){
					country_detail_table_function();
					form_inputs_clear('#country_form');
					countryList();
					$("#country_active,#state_active").prop( "checked", false );
					alert_lobibox("success", sysparam_datas_list[data.status]);
				} else if (data.status == "NTE_03") {
					country_btns_draw('add');
					country_detail_table_function();
					form_inputs_clear('#country_form');
					countryList();
					$("#country_active,#state_active").prop( "checked", false );
					alert_lobibox("success", sysparam_datas_list[data.status]);
				} else {
					alert_lobibox("error", sysparam_datas_list[data.status]);
				}
			});
		}
	}
	
}

//Country creation form validation
function country_form_validation(){
	return $('#country_form').valid();
}

$("#country_form").validate({
	rules: {
		country_name:{
			required: true,
		},
	},
	//For custom messages
	messages: {
		country_name:{
			required:"Enter Country Name",
		},
	},
	errorElement: 'div',
	errorPlacement: function(error, element) {
		var placement = $(element).data('error');
		if (placement) {
			$(placement).append(error);
		} else {
			error.insertAfter(element);
		}
	}
});

//State details update function
function action_for_state(action_name){
	if (action_name == "add") {
		// State added function
		state_data_management('add');
		return false
	} else if (action_name == "update") {
		// State updated function
		state_data_management('update');
		return false
	} else if (action_name == "remove") {
		// State deleted function
		let title = $('#state_name').val() || '' ;
		removeConfirmation('state_data_management', 'remove', title);
		return false
	} else if (action_name == "clear") {
		// State form clear function
		form_inputs_clear('#state_form');
		$("#state_active").prop( "checked", false );
	} else if (action_name == "cancel") {
		// State form cancel function
		form_inputs_clear('#state_form');
		state_btns_draw('add');
		$("#state_active").prop( "checked", false );
	}
}

//State Buttons draw function
function state_btns_draw(action_name){
	$("#state_btm_btns").html('');
	var state_btnstr = '';
	var access_for_create = jQuery.inArray( "Country & Province Master", JSON.parse(localStorage.Create) );
	var access_for_write = jQuery.inArray( "Country & Province Master", JSON.parse(localStorage.Write) );
	var access_for_delete = jQuery.inArray( "Country & Province Master", JSON.parse(localStorage.Delete) );
	if (action_name == 'add') {
		if (access_for_create != -1){
			state_btnstr += '<button type="button" class="btn btn-success btn-eql-wid btn-animate margin-right-3" onclick="action_for_state(\''+"add"+'\')">Add</button>';
		}
		state_btnstr += '<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-3" onclick="action_for_state(\''+"clear"+'\')">Cancel / Clear</button>';
	} else if (action_name == 'update') {
		if (access_for_write != -1){
			state_btnstr += '<button type="button" class="btn btn-primary btn-eql-wid btn-animate margin-right-3" onclick="action_for_state(\''+"update"+'\')">Update</button>';
		}
		if (access_for_delete != -1){
			state_btnstr += '<button type="button" class="btn btn-danger btn-eql-wid btn-animate margin-right-3" onclick="action_for_state(\''+"remove"+'\')">Remove</button>';
		}
		state_btnstr += '<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-3" onclick="update_state_clear_func(\''+"cancel"+'\')">Cancel / Clear</button>';
	}
	$("#state_btm_btns").append(state_btnstr);
}

//State Update form clear function
function update_state_clear_func(action_name) {
	let title = $('#state_name').val() || '' ;
	orgClearFuncton('action_for_state', action_name, title);
}

//State details datatable load function
function state_detail_table_function(){
	var currurl = window.location.href;
	var actionurl = currurl.replace('country_state/', 'state_record/');
	var columns = [{'title':'ID','name':'id'}, {'title':'No.','name':'row_number'}, 
	           {'title':'Province Name','name':'state_name'},{'title':'Province Status','name':'state_status'}];
	$.ajax({
		url : actionurl,
		type : 'GET',
	}).done(function(json_data)	{
		var data = JSON.parse(json_data);
		var country_list = []; 
		if (data.status == "NTE_01"){
			data = data.table_datas;
			$("#state_table_tbody tr:gt(0)").remove(); 
			for (var i=0; i<data.length; i++){
				country_list.push([data[i].id, (i+1), data[i].state_name,data[i].state_active ]);
			}
			plaindatatable_btn('state_table', country_list, columns, 0,  'NEXT_TRANSFORM_NEXT-HCMS_State_Details'+currentDate());
		} else {
			alert_lobibox("error", sysparam_datas_list[data.status]);
		}
	});
	return false
}

//State details table row click get id
$("#state_table tbody").on("click", "tr", function() {    
	var currurl = window.location.href;
	var actionurl = currurl.replace('country_state/','state_record/');
	state_details_table_id = $('#state_table').dataTable().fnGetData(this)[0];
	$.ajax({
		url : actionurl,
		type : 'GET',
		data: {
			'state_id':state_details_table_id
		}
	}).done(function(json_data)	{
		var temp = '';
		var data = JSON.parse(json_data);
		temp = data.table_datas;
		if (data.status == "NTE_01") {
			state_btns_draw('update');
			formData = temp.filter(data=> {return temp[0].state_id==state_details_table_id})[0];
			var $inputs = $('#state_form :input');// get the form id value
			$inputs.each(function() {
				if (this.name in formData) {
					if (this.name== "state_active") {
						if (formData[this.name] == false){
							$("#"+this.name).prop( "checked", false );
						}else{
							$("#"+this.name).prop( "checked", true );
						}
					} else {
						$("#"+this.name).val(formData[this.name]).trigger("change");
					}
				} 
			});
		} else {
			alert_lobibox("error", sysparam_datas_list[data.status]);
		}
	});
});

//State details data management function
function state_data_management(func_name, event){
	var currurl = window.location.href;
	var actionurl = currurl.replace('country_state/','state_datainsert/');
	if (func_name == "remove") {
		var datas = getFormValues("#state_form");
		var	csrf_data = datas.csrfmiddlewaretoken;
		if (datas.state_id.length > 0){
			$.ajax({
				type  : 'POST',
				url   : actionurl,
				data: {
					'delete_id': datas.state_id,
					csrfmiddlewaretoken: csrf_data
				},
			}).done( function(jsondata) {
				var data = JSON.parse(jsondata);
				if (data.status == "NTE_04"){
					state_btns_draw('add');
					state_detail_table_function();
					form_inputs_clear('#state_form');
					$("#country_active,#state_active").prop( "checked", false );
					alert_lobibox("success", sysparam_datas_list[data.status]);
				} else {
					alert_lobibox("error", sysparam_datas_list[data.status]);
				}
			});
		}
	} else {
		if(state_form_validation()) {
			var datas = getFormValues("#state_form");
			var	csrf_data = datas.csrfmiddlewaretoken;
			if ($("#state_active").is(":checked")){
				datas['state_active'] = true;
			} else {
				datas['state_active'] = false;
			}
			$.ajax({
				type  : 'POST',
				url   : actionurl,
				data: {
					'datas': JSON.stringify(datas),
					csrfmiddlewaretoken: csrf_data
				},
			}).done( function(jsondata) {
				var data = JSON.parse(jsondata);
				if (data.status == "NTE_01"){
					state_detail_table_function();
					form_inputs_clear('#state_form');
					$("#country_active,#state_active").prop( "checked", false );
					alert_lobibox("success", sysparam_datas_list[data.status]);
				} else if (data.status == "NTE_03") {
					state_btns_draw('add');
					state_detail_table_function();
					form_inputs_clear('#state_form');
					$("#country_active,#state_active").prop( "checked", false );
					alert_lobibox("success", sysparam_datas_list[data.status]);
				} else {
					alert_lobibox("error", sysparam_datas_list[data.status]);
				}
			});
		}
	}
}

//State creation form validation
function state_form_validation(){
	return $('#state_form').valid();
}

//jquery attendance validation
jQuery.validator.addMethod('country_data_validate', function (value) {
	let val = $('#country_data_validate').val() || '0';
  return (val != '0');
}, "year required");

$("#state_form").validate({
	rules: {
		state_name:{
			required: true,
		},
		country_data:{
			valueNotEquals:true,
			country_data_validate:true
		},
	},
	//For custom messages
	messages: {
		state_name:{
			required:"Enter Province Name",
		},
		country_data:{
			valueNotEquals:"Select Country",
			country_data_validate:"Select Country",
		},
	},
	errorElement: 'div',
	errorPlacement: function(error, element) {
		var placement = $(element).data('error');
		if (placement) {
			$(placement).append(error);
		} else {
			error.insertAfter(element);
		}
	}
});