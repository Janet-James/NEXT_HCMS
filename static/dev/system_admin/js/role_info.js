var role_details_table_id =''; 

$(document).ready(function () {
	$('select#org_id').select2({
		placeholder: 'Select Organization',
		minimumInputLength: 0,
	});
	$('select#org_unit_id').select2({
		placeholder: 'Select Organization Unit',
	});
	$("#group_roles").select2({ // 22-OCT-2018 || SMI || Added Roles field
		width: '100%',
	});
	// Role detail data table load function
	role_detail_table_function();
});

function action_for_role(action_name){
	if (action_name == "add") {
		// Role added function
		role_data_management('add');
		return false
	} else if (action_name == "update") {
		//Role updated function
		role_data_management('update');
		return false
	} else if (action_name == "remove") {
		// Role deleted function
		let title = $('#role_name').val() || '' ;
		removeConfirmation('role_data_management', 'remove',title);
		return false
	} else if (action_name == "clear") {
		// Role form clear function
		thisform_clear(); 
	} else if (action_name == "cancel") {
		// Role form cancel function
		btns_draw('add');
		thisform_clear(); 
	}
}

// Form clear function 
function thisform_clear(){
	$("#role_name").val('').trigger("change");
	$("#role_description").val('').trigger("change");
	$("#org_id").val(null).trigger("change");
	$("#role_id").val("");
	$("#org_unit_id").val(null).trigger("change");
	$("#group_roles").val(null).trigger("change"); // 22-OCT-2018 || SMI || Added Clear Fn. for Roles field
	role_details_table_id ='';
	roles_sel_reload();
	$("#group_roles").prop('disabled',true);
	$('.span-error').html('');
}

//Buttons draw function
function btns_draw(action_name){
	$("#bottom_btns").html('');
	var btnstr = '';
	var access_for_create = jQuery.inArray( "User Roles", JSON.parse(localStorage.Create) );
	var access_for_write = jQuery.inArray( "User Roles", JSON.parse(localStorage.Write) );
	var access_for_delete = jQuery.inArray( "User Roles", JSON.parse(localStorage.Delete) );
	if (action_name == 'add') {
		if (access_for_create != -1){
			btnstr += '<button type="button" class="btn btn-success btn-eql-wid btn-animate margin-right-3" onclick="action_for_role(\''+"add"+'\')">Add</button>';
		}
		btnstr += '<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-3" onclick="action_for_role(\''+"clear"+'\')">Cancel / Clear</button>';
	} else if (action_name == 'update') {
		if (access_for_write != -1){
			btnstr += '<button type="button" class="btn btn-primary btn-eql-wid btn-animate margin-right-3" onclick="action_for_role(\''+"update"+'\')">Update</button>';
		}
		if (access_for_delete != -1){
			btnstr += '<button type="button" class="btn btn-danger btn-eql-wid btn-animate margin-right-3" onclick="action_for_role(\''+"remove"+'\')">Remove</button>';
		}
		btnstr += '<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-3" onclick="update_clear_func(\''+"cancel"+'\')">Cancel / Clear</button>';
	}
	$("#bottom_btns").append(btnstr);
}

//Organization unit get function
function org_unit_fetch_function(org_id) {
	if (org_id != ''){
		var currurl = window.location.href;
		var actionurl = currurl.replace('role_details/','org_unit_fetch/');
		$.ajax({
			type  : 'GET',
			url   : actionurl,
			async: false,
			data: {
				'org_id': org_id
			},
		}).done( function(jsondata) {
			var data = JSON.parse(jsondata);
			if (data.status == "NTE_01") {
				$('select#org_unit_id').empty().append($('<option>',{
					placeholder: 'Select Organization Unit',
				}));
				var org_unit_str = '';
				for (var i=0; i<data.org_unit_details.length; i++) { 
					org_unit_str += '<option value="'+data.org_unit_details[i].id+'">'+data.org_unit_details[i].orgunit_name+'</option>';
				}
				$("#org_unit_id").append(org_unit_str);
			} else {
				alert_lobibox("error", sysparam_datas_list[data.status]);
			} 
		});
	}
	return false;
}

//Update form clear function
function update_clear_func(action_name) {
	let title = $('#role_name').val() || '' ;
	orgClearFuncton('action_for_role', action_name, title);
}

//Role details datatable load function
function role_detail_table_function(){
	var currurl = window.location.href;
	var actionurl = currurl.replace('role_details/','role_record/');
	columns = [{'title':'ID','name':'id'}, {'title':'No.','name':'row_number'}, 
	           {'title':'Group Name','name':'name'}, {'title':'Group Description','name':'description'}];
	$.ajax({
		url : actionurl,
		type : 'GET',
	}).done(function(json_data)	{
		var data = JSON.parse(json_data);
		var role_details_list = []; 
		if (data.status == "NTE_01"){
			data = data.table_datas;
			$("#role_details_table_tbody tr:gt(0)").remove(); 
			for (var i=0; i<data.length; i++){
				role_details_list.push([data[i].id, data[i].row_number, data[i].name, data[i].description]);
			}
			plaindatatable_btn('role_details_table', role_details_list, columns, 0, 'NEXT_TRANSFORM_NEXT-HCMS_User_Role_'+currentDate());
		} else {
			alert_lobibox("error", sysparam_datas_list[data.status]);
		}
	});
	return false
}

//Role details table row click get id
$("#role_details_table tbody").on("click", "tr", function() {    
	var currurl = window.location.href;
	var actionurl = currurl.replace('role_details/','role_record/');
	role_details_table_id = $('#role_details_table').dataTable().fnGetData(this)[0];
	$.ajax({
		url : actionurl,
		type : 'GET',
		data: {
			'role_id':role_details_table_id
		}
	}).done(function(json_data)	{
		var temp = '';
		var data = JSON.parse(json_data);
		temp = data.table_datas;
		if (data.status == "NTE_01") {
			btns_draw('update');
			formData = temp.filter(data=> {return temp[0].role_id==role_details_table_id})[0];
			var $inputs = $('#role_detail_form :input');// get the form id value
			$inputs.each(function() {
				if (this.name in formData) {
					if (this.name== "org_id" || this.name== "org_unit_id" || this.name== "group_roles"){
						$("#"+this.name).val(formData[this.name]).trigger("change");
					} else {
						this.value = formData[this.name];
					}
				}
			}); 
			$("#group_roles option").removeAttr("disabled");
			for(var i = 0; i < data.exclude_roles.length; i++){
				$("#group_roles option[value=" + data.exclude_roles[i].id + "]").prop('disabled',true);
			}
			$("#group_roles").select2();
		} else { 
			alert_lobibox("error", sysparam_datas_list[data.status]);
		}  
	});
});

//Role details data management function
function role_data_management(func_name, event){
	var currurl = window.location.href;
	var actionurl = currurl.replace('role_details/','role_datainsert/');
	if (func_name == "remove") {
		var datas = getFormValues("#role_detail_form");
		var	csrf_data = datas.csrfmiddlewaretoken;
		if (datas.role_id.length > 0){
			$.ajax({
				type  : 'POST',
				url   : actionurl,
				data: {
					'delete_id': datas.role_id,
					csrfmiddlewaretoken: csrf_data
				},
			}).done( function(jsondata) {
				var data = JSON.parse(jsondata);
				if (data.status == "NTE_04"){
					btns_draw('add');
					role_detail_table_function();
					thisform_clear();
					alert_lobibox("success", sysparam_datas_list[data.status]);
				} else {
					alert_lobibox("error", sysparam_datas_list[data.status]);
				}
			});
		}
	} else {
		if(role_detail_form_validation()) {
			var datas = getFormValues("#role_detail_form");
			var group_roles = $("#group_roles").val();
			var	csrf_data = datas.csrfmiddlewaretoken;
			$.ajax({
				type  : 'POST',
				url   : actionurl,
				data: {
					'datas': JSON.stringify(datas),
					'group_roles': JSON.stringify(group_roles),
					csrfmiddlewaretoken: csrf_data
				},
			}).done( function(jsondata) {
				var data = JSON.parse(jsondata);
				if (data.status == "NTE_01"){
					role_detail_table_function();
					alert_lobibox("success", sysparam_datas_list[data.status]);
					thisform_clear();
				} else if (data.status == "NTE_03") {
					btns_draw('add');
					role_detail_table_function();
					alert_lobibox("success", sysparam_datas_list[data.status]);
					thisform_clear();
				} else {
					alert_lobibox("error", sysparam_datas_list[data.status]);
				}
			});
		}
	}
}

//Role creation form validation
function role_detail_form_validation(){
	return $('#role_detail_form').valid();
}
$("#role_detail_form").validate({
	rules: {
		role_name:{
			required: true,
		},
		org_id:{
			valueNotEquals:true
		},
		org_unit_id:{
			valueNotEquals:true
		},
		group_roles:{ // 22-OCT-2018 || SMI || Added Validation for Roles field
			valueNotEquals:true
		},
	},
	//For custom messages
	messages: {
		role_name:{
			required:"Enter Group Name",
		},
		org_id:{
			valueNotEquals:"Select Organization",
		},
		org_unit_id:{
			valueNotEquals:"Select Organization Unit",
		},
		group_roles:{ // 22-OCT-2018 || SMI || Added Validation for Roles field
			valueNotEquals:"Select Roles",
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

//23-OCT-2018 || SMI || Function to fetch Roles
function fetch_roles(){
	
}

//23-OCT-2018 || SMI || Function for reloading Roles Dropdown
function roles_sel_reload(){
	var org_id = $("#org_id").val();
	var org_unit_id = $("#org_unit_id").val();
	$.ajax({
		type : 'POST',
		url : '/roles_sel_reload/',
		data : {
			'org_id' : org_id,
			'org_unit_id' : org_unit_id,
		},
		async : false,
	}).done( function(jsondata) {
		var data = JSON.parse(jsondata);
		$('#group_roles').empty().append($('<option>',{
			placeholder:'Select Roles',
		}));
		if(data.roles_list != undefined){
			if(data.roles_list.length>0){
				$("#group_roles").prop('disabled',false);
				for(var i = 0; i < data.roles_list.length; i++){
					$('#group_roles').append($('<option>',{
						value:data.roles_list[i].id,
						text:data.roles_list[i].role_title
					}));
				}
				$("#group_roles").select2();
			}
		}
		if(data.sel_roles_list != undefined){
			if(data.sel_roles_list.length>0){
				$("#group_roles option").removeAttr("disabled");
				for(var i = 0; i < data.sel_roles_list.length; i++){
					$("#group_roles option[value=" + data.sel_roles_list[i] + "]").prop('disabled',true);
				}
				$("#group_roles").select2();
			}
		}
	});
}