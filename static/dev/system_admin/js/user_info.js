var usr_details_table_id ='';

$(document).ready(function () {
	// Load the multiple select for group	
//	$('select#group_id').select2({
//	placeholder: 'Select Group',
//	allowClear: true
//	});

	$("select#role_id").select2({
		placeholder: 'Select Group',
		allowClear: true
	});
	$("select#org_id").select2({
		placeholder: 'Select Organization',
		allowClear: true
	});
	$("select#org_unit_id").select2({
		placeholder: 'Select Organization Unit',
		allowClear: true
	});
	$("select#group_id").select2({
		placeholder: 'Select Role',
		allowClear: true
	});

	$("#org_unit_id").on('change',function(){ 
		var org_unit_id = $(this).val(),
		org_id = $("#org_id").val();
		if (org_id != null && org_unit_id != null) {
			role_details_fetch(org_id, org_unit_id);
		} 
	});
	// User detail data table load function
	usr_detail_table_function();
	$("#usr_active").prop( "checked", false );
});

$("#role_id").on('change',function(){ 
	if(this.value !=''){
		$.ajax({
			type  : 'GET',
			url   : '/role_details_get/',
			async: false,
			data: {
				'group_id': this.value
			},
		}).done( function(jsondata) {
			let res = JSON.parse(jsondata);
			let data = res['results'];
			let org_unit_str = '<option value="0">--Select Role---</option>';
			$("#group_id").html('');
			for(let i=0; i<data.length; i++){
				org_unit_str += '<option value="'+data[i].id+'">'+data[i].name+'</option>';
			}
			$("#group_id").append(org_unit_str);
		});
	}
});

//Organization unit get function
function org_unit_fetch_function(org_id) {
	if (org_id != '') { 
		var currurl = window.location.href;
		var actionurl = currurl.replace('usr_details/','org_unit_fetch/');
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
				$("#org_unit_id").html('');
				var org_unit_str = '<option></option>';
				for (var i=0; i<data.org_unit_details.length; i++) { 
					org_unit_str += '<option value="'+data.org_unit_details[i].id+'">'+data.org_unit_details[i].orgunit_name+'</option>';
				}
				$("#org_unit_id").append(org_unit_str);
				$("#role_id").html('');
				var role_str = '<option></option>';
				$("#role_id").append(role_str);
			} else {
				alert_lobibox("error", sysparam_datas_list[data.status]);
			}
		});
	}
	return false
}

//Role Details Fetch function
function role_details_fetch(org_id, org_unit_id) {
	if (org_id != '' || org_unit_id != '') { 
		var currurl = window.location.href;
		var actionurl = currurl.replace('usr_details/','role_details_fetch/');
		$.ajax({
			type  : 'GET',
			url   : actionurl,
			async: false,
			data: {
				'org_id': org_id,
				'org_unit_id': org_unit_id,
			},
		}).done( function(jsondata) {
			var data = JSON.parse(jsondata);
			if (data.status == "NTE_01") {
				$("#role_id").html('');
				var role_str = '<option></option>';
				for (var i=0; i<data.usr_role_datas.length; i++) { 
					role_str += '<option value="'+data.usr_role_datas[i].id+'">'+data.usr_role_datas[i].name+'</option>';
				}
				$("#role_id").append(role_str);
			} else {
				alert_lobibox("error", sysparam_datas_list[data.status]);
			}
		});
	}
	return false
}

function action_for_usr(action_name){
	if (action_name == "add") {
		// User added function
		if(usr_form_validation()) {
			swal ({
				title: "Do you want to proceed the user registration?",
				type: "warning",
				showCancelButton: true,
				confirmButtonClass: "btn btn-success btn-eql-wid btn-animate pull-left",
				cancelButtonClass: "btn btn-danger btn-eql-wid btn-animate pull-right",
				confirmButtonText: "Yes",
				cancelButtonText: "No",
				showConfirmButton : true,
				closeOnConfirm: true,
				closeOnCancel: true
			},
			function(isConfirm) {
				if (isConfirm) {
					$("#usr_created_alert").modal("show");
					$("#notify_mail").html('');
					var company_email = $("#usr_email").val(),
					personal_email = $("#personal_email").val();
					var opt_select_email = "<option></option>"; 
					opt_select_email += "<option value="+company_email+">"+company_email+"</option>";
					opt_select_email += "<option value="+personal_email+">"+personal_email+"</option>";
					$("#notify_mail").append(opt_select_email).trigger("change");
					$("#notify_mail").select2({
						placeholder: 'Select Notify Email',
						allowClear: true
					});
				} 
			});
		}
		//usr_data_management('add');
		return false
	} else if (action_name == "update") {
		// User updated function
		if(usr_form_validation()){
			usr_data_management('update');
			return false
		}
	} else if (action_name == "remove") {
		// User deleted function
		let ftitle = $('#first_name').val() || '' ;
		let ltitle = $('#last_name').val() || '' ;
		let title = ftitle+' '+ltitle ;
		removeConfirmation('usr_data_management', 'remove', title);
		return false
	} else if (action_name == "clear") {
		// User form clear function
		$("#usr_name").val('');
		$("#usr_email").val('');
		$("#first_name").val('');
		$("#last_name").val('');
		$("#personal_email").val('');
		$("#org_id").val(null).trigger('change');
		$("#org_unit_id").val(null).trigger('change');
		$("#role_id").val(null).trigger('change');
		$("#group_id").val(0).trigger('change');
		$('.span-error').html('');
		$("#usr_name,#usr_email").prop('disabled', false);
		btns_draw('add');
	} else if (action_name == "cancel") {
		// User form cancel function
		$("#usr_name").val('');
		$("#usr_email").val('');
		$("#first_name").val('');
		$("#last_name").val('');
		$("#personal_email").val('');
		$("#org_id").val(null).trigger('change');
		$("#org_unit_id").val(null).trigger('change');
		$("#role_id").val(null).trigger('change');
		$("#group_id").val(0).trigger('change');
		$('.span-error').html('');
		$("#usr_name,#usr_email").prop('disabled', false);
		btns_draw('add');
		}
}

//Buttons draw function
function btns_draw(action_name){
	$("#bottom_btns").html('');
	var btnstr = '';
	var access_for_create = jQuery.inArray( "Manage Users", JSON.parse(localStorage.Create) );
	var access_for_write = jQuery.inArray( "Manage Users", JSON.parse(localStorage.Write) );
	var access_for_delete = jQuery.inArray( "Manage Users", JSON.parse(localStorage.Delete) );
	if (action_name == 'add') {
		if (access_for_create != -1){
			btnstr += '<button type="button" class="btn btn-success btn-eql-wid btn-animate margin-right-3" onclick="action_for_usr(\''+"add"+'\')">Add & Notify</button>';
		}
		btnstr += '<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-3" onclick="action_for_usr(\''+"clear"+'\')">Cancel / Clear</button>';
	} else if (action_name == 'update') {
		if (access_for_write != -1){
			btnstr += '<button type="button" class="btn btn-primary btn-eql-wid btn-animate margin-right-3" onclick="action_for_usr(\''+"update"+'\')">Update</button>';
		}
		if (access_for_delete != -1){
			btnstr += '<button type="button" class="btn btn-danger btn-eql-wid btn-animate margin-right-3" onclick="action_for_usr(\''+"remove"+'\')">Remove</button>';
		}
		btnstr += '<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-3" onclick="update_clear_func(\''+"cancel"+'\')">Cancel / Clear</button>';
	}
	$("#bottom_btns").append(btnstr);
}

//Update form clear function
function update_clear_func(action_name) {
	let ftitle = $('#first_name').val() || '' ;
	let ltitle = $('#last_name').val() || '' ;
	let title = ftitle+' '+ltitle ;
	orgClearFuncton('action_for_usr', action_name, title);
}

//User details datatable load function
function usr_detail_table_function(){
	var currurl = window.location.href;
	var actionurl = currurl.replace('usr_details/','usr_record/');
	columns = [{'title':'ID','name':'id'}, {'title':'No.','name':'row_number'}, 
	           {'title':'Login Name','name':'username'}, {'title':'First Name','name':'first_name'},
	           {'title':'Last Name','name':'last_name'}, {'title':'Role','name':'role_name'}, {'title':'User Status','name':'is_active'}];
	$.ajax({
		url : actionurl,
		type : 'GET',
		timeout : 10000,
		async:false,
	}).done(function(json_data)	{
		var data = JSON.parse(json_data);
		var usr_list = []; 
		if (data.status == "NTE_01") {
			data = data.table_datas;
			$("#usr_table_tbody tr:gt(0)").remove(); 
			for (var i=0; i<data.length; i++){
				usr_list.push([data[i].id, data[i].row_number, data[i].username, data[i].first_name, data[i].last_name, data[i].role_name, data[i].is_active]);
			}
			plaindatatable_btn('usr_table', usr_list, columns, 0, 'NEXT_TRANSFORM_NEXT_HCMS_Users_'+currentDate());
		} else {
			alert_lobibox("error", sysparam_datas_list[data.status]);
		}
	});
	return false
}

//User details table row click get id
$("#usr_table tbody").on("click", "tr", function() {  
	var currurl = window.location.href;
	var actionurl = currurl.replace('usr_details/','usr_record/');
	usr_details_table_id = $('#usr_table').dataTable().fnGetData(this)[0];
	$.ajax({
		url : actionurl,
		type : 'GET',
		timeout : 10000,
		async:false,
		data: {
			'usr_id':usr_details_table_id
		}
	}).done(function(json_data)	{
		var temp = '';
		var data = JSON.parse(json_data);
		temp = data.table_datas;
		if (data.status == "NTE_01") {
			action_for_usr('clear')
			btns_draw('update');
			formData = temp.filter(data=> {return temp[0].usr_id==usr_details_table_id})[0];
			var $inputs = $('#usr_form :input');// get the form id value
			$inputs.each(function() {
				if (this.name in formData) {
					if (this.name== "role_id" || this.name== "group_id" || this.name== "org_id" || this.name== "org_unit_id"){
						$("#"+this.name).val(formData[this.name]).trigger("change");
					} else if (this.name== "usr_active") {
						if (formData[this.name] == false){
							$("#"+this.name).prop( "checked", false );
						}else{
							$("#"+this.name).prop( "checked", true );
						}
					} else {
						this.value = formData[this.name];
					}
				} 
				$("#usr_name,#usr_email").prop('disabled', true);
			});
			$("#change_pwd_loc").html('');
			var change_pwd_loc_str = '<span class="pass_icon"><a href="#" data-toggle="tooltip" onclick="change_pwd_popup();" title="Change Passsword" data-placement="bottom">';
			change_pwd_loc_str += '<i class="nf nf-working-schedule"></i></a></span>';
			$("#change_pwd_loc").append(change_pwd_loc_str);
			$('#group_id').val(temp[0].grp_id).trigger('change');
		} else {
			alert_lobibox("error", sysparam_datas_list[data.status]);
		}
	});
});

//User data management function
function usr_data_management(func_name, event){
	var currurl = window.location.href;
	var actionurl = currurl.replace('usr_details/','usr_datainsert/');
	if (func_name == "remove") {
		var datas = getFormValues("#usr_form");
		var	csrf_data = datas.csrfmiddlewaretoken;
		if (datas.usr_id.length > 0){
			$.ajax({
				type  : 'POST',
				url   : actionurl,
				async : false,
				data: {
					'delete_id': datas.usr_id,
					csrfmiddlewaretoken: csrf_data
				},
			}).done( function(jsondata) {
				var data = JSON.parse(jsondata);
				if (data.status == "NTE_04"){
					alert_lobibox("success", sysparam_datas_list[data.status]);
					usr_detail_table_function();
					btns_draw('add');
					action_for_usr('clear');
				} else {
					alert_lobibox("error", sysparam_datas_list[data.status]);
				}
			});
		}
	} else {
		var notify_mail = $("#notify_mail").val();
		var datas = getFormValues("#usr_form");
		var	csrf_data = datas.csrfmiddlewaretoken;
		if ($("#usr_active").is(":checked")){
			datas['usr_active'] = true;
		} else {
			datas['usr_active'] = false;
		}
//		var group_ids = [];
//		$.each($("#group_id option:selected"), function(){            
//		group_ids.push($(this).val());
//		});
//		datas['group_id'] = group_ids;
		$.ajax({
			type  : 'POST',
			url   : actionurl,
//			async : false,
			data: {
				'datas': JSON.stringify(datas),
				'notify_mail': notify_mail,
				csrfmiddlewaretoken: csrf_data
			},
		}).done( function(jsondata) {
			var data = JSON.parse(jsondata);
			if (data.status == "NTE_01"){
				$("#usr_created_alert").modal("hide");
				alert_lobibox("success", sysparam_datas_list[data.status]);
				usr_detail_table_function();
				action_for_usr('clear');
				// NIAA Code Start
//				create_user({email:user_inner_dict.email, name:user_inner_dict.username.split('@')[0],username:user_inner_dict.username.split('@')[0], password:'welcome@123',imageid:data.id, roles:(($('#user_role :selected').text()=='HR Admin'||'Admin'||'GroupHr')?['admin']:['user'])});
				create_user({email:datas.usr_email, name:datas.usr_email.split('@')[0],username:datas.usr_email.split('@')[0], password:'welcome@123',imageid:data.auth_user_id, roles:(($('#role_id :selected').text()=='HCM' || 'Admin')?['admin']:['user'])});
				// NIAA Code End
				
			} else if (data.status == "NTE_03") {
				btns_draw('add');
				alert_lobibox("success", sysparam_datas_list[data.status]);
				usr_detail_table_function();
				//NIAA Code Start
				//var data = getCookie();
				//userupdateinfo({emailid:$('#related_user :selected').text(), authtoken: data.niaa_token, userid: data.niaa_uid, imageurl:'http://'+window.location.hostname+'/media/user_profile/'+$('#related_user :selected').val()+'.jpg'});
				//NIAA Code End
				action_for_usr('clear');
			} else {
				alert_lobibox("error", sysparam_datas_list[data.status]);
				action_for_usr('clear');
			}
		});
	}
}

//User creation form validation
function usr_form_validation(){
	return $('#usr_form').valid();
}

jQuery.validator.addMethod("lettersonly", function(value, element) {
	return this.optional(element) || /^[a-z\s]+$/i.test(value);
	}, "Only alphabetical characters");

//email validation
$.validator.addMethod("email", function(value, element) {
var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
if( !emailReg.test( value ) ) {
    return false;
} else {
    return true;
}
});

$("#usr_form").validate({
	rules: {
		first_name:{
			lettersonly: true,
		},
		last_name:{
			lettersonly: true,
		},
		usr_name:{
			required: true,
			noSpace: true,
		},
		usr_email:{
			required: true,
			email: true,
		},
		personal_email:{
			email: true,
		},
		org_id:{
			valueNotEquals:true
		},
		org_unit_id:{
			valueNotEquals:true
		},
		role_id:{
			valueNotEquals:true
		},
		group_id:{
			valueNotEquals:true
		},
	},
	//For custom messages
	messages: {
		first_name:{
			lettersonly: 'Only alphabetical characters',
		},
		last_name:{
			lettersonly: 'Only alphabetical characters ',
		},
		usr_name:{
			required:"Enter User Name",
		},
		usr_email:{
			required:"Enter User Email",
			email:"Enter Valid Email",
		},
		personal_email:{
			email:"Enter Valid Email",
		},
		org_id:{
			valueNotEquals:"Select Organization",
		},
		org_unit_id:{
			valueNotEquals:"Select Organization Unit",
		},
		role_id:{
			valueNotEquals:"Select User Groups",
		},
		group_id:{
			valueNotEquals:"Select User Role",
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

//Change Password modal open function
function change_pwd_popup() {
	var usr_name = $("#usr_name").val();
	$("#cp_usr_name").val(usr_name);
	$("#change_pwd_popup").modal('show');
}

//Change Password Management
function usr_change_pwd_management() {
	var currurl = window.location.href;
	var actionurl = currurl.replace('usr_details/','usr_cp_management/');
	var datas = getFormValues("#change_pwd_form");
	var	csrf_data = datas.csrfmiddlewaretoken;
	if (cp_form_validation()){
		$.ajax({
			type  : 'POST',
			url   : actionurl,
			async : false,
			data: {
				'datas': JSON.stringify(datas),
				csrfmiddlewaretoken: csrf_data
			},
		}).done( function(jsondata) {
			var data = JSON.parse(jsondata);
			if (data.status == "NTE_05") {
				form_inputs_clear("#change_pwd_form");
				$("#change_pwd_popup").modal('hide');
				btns_draw('add');
				alert_lobibox("success", sysparam_datas_list[data.status]);
				usr_detail_table_function();
				action_for_usr('clear');
				$("#change_pwd_loc").html('');
			} else if(data.status == "NTE_02") {
				alert_lobibox("error", sysparam_datas_list[data.status]);
			} else {
				alert_lobibox("error", data.status);
			}
		});
	}
}

//Change Password form validation
function cp_form_validation(){
	return $('#change_pwd_form').valid();
}

$("#change_pwd_form").validate({
	rules: {
		cp_usr_name:{
			required: true,
			noSpace: true,
		},
		cp_usr_pwd:{
			required: true,
		},
		cp_usr_new_pwd:{
			required: true,
		},
		cp_usr_confirm_pwd:{
			equalTo : "#cp_usr_new_pwd",
		},
	},
	//For custom messages
	messages: {
		cp_usr_name:{
			required:"Enter User Name",
		},
		cp_usr_pwd:{
			required:"Enter Current Password",
		},
		cp_usr_new_pwd:{
			required:"Enter New Password",
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