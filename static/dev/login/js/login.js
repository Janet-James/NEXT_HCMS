$(document).ready(function () {
	localStorage.clear();
	$(".loader-wrapper").hide();
});


//function niaa_logged_in(){
//	window.location.href = 'hcms/';
//}

$('#password').keydown(function(e) {
	var key = e.which;
	if (key == 13) {
		$( "#login_submit" ).trigger( "click" )
	}
	});

$('#username').keydown(function(e) {
	var key = e.which;
	if (key == 13) {
		$( "#username_btn" ).trigger( "click" )
	}
	});

$("#login_submit").click(function(event) {
	if($("#password").val()=='')
	{
		alert_lobibox("error", "Enter Valid Password");
	}
	else
	{
	event.preventDefault();
	localStorage.clear();
	var datas = getFormValues("#login_form");
	var	csrf_data = datas.csrfmiddlewaretoken;
	if (login_form_validation()){
		var actionurl = window.location.href;
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
			if (data.status == 'NTE_01'){
				console.log(data.access_datas)
				$.each(data.access_datas, function(key, value) {
					localStorage.setItem(key, JSON.stringify(value));
				});
				console.log(localStorage)
				var access_for_create = jQuery.inArray( "Employee Details", JSON.parse(localStorage.Create) );
				if (access_for_create != -1){
				localStorage.setItem('emp_id', '0');	
				localStorage.setItem('emp_status', true);	
				} 
                                window.location.href = 'hcms/';
				// EXOS NIAA CODE SURYA
//				window.login(datas.username, datas.password, niaa_logged_in)
			} else if(data.status == 'NTE_24') {
				$("#cp_user_id").val(datas.username);
				$("#change_password").modal("show");
			} else {
				alert_lobibox("error", sysparam_datas_list[data.status]);
			}
		});
	}}
});

//Login form validation
function login_form_validation(){
	return $('#login_form').valid();
}

$("#login_form").validate({
	rules: {
		username:{
			required: true,
		},
		password:{
			required: true,
		},
	},
	//For custom messages
	messages: {
		username:{
			required:"Enter user name",
		},
		password:{
			required:"Enter user password",
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

//Functions to be done on load
$(document).ready(function(){
	document.getElementById("otp_verification").style.display = "none";
});

$("#forgot_pwd").click(function() {
	var usr_name = $("#username").val();
	if (usr_name != '' && usr_name != undefined && usr_name != null) {
		var actionurl = 'usr_value_fetch/';
		$.ajax({
			type  : 'GET',
			url   : actionurl,
			async : false,
			data: {
				'usr_name': usr_name,
			},
		}).done( function(jsondata) {
			var data = JSON.parse(jsondata);
			if (data.status == "NTE_01") { 
				$("#otp_mail_id").val(data.usr_mail);
				$('#forgot_password').modal("show");
			} else if (data.status == "ERR0012") {
				alert_lobibox("error", sysparam_datas_list[data.status]);
			} else {
				alert_lobibox("error", "API method not allowed");
			}
		});
	} else {
		$('#forgot_password').modal("show");
	}
});

$(document).ajaxStart(function () {
	$(".loader-wrapper").show();
});
$(document).ajaxComplete(function(){
	$(".loader-wrapper").hide();
});

//Script for OTP Generation Functionality
function otp_generate() {
	if (otpgenerate_form_validation()) {
		var datas = getFormValues("#otp_generate_form");
		var	csrf_data = datas.csrfmiddlewaretoken;
		var actionurl = 'otp_generate/';
		$.ajax({
			type  : 'POST',
			url   : actionurl,
//			async : false,
			data: {
				'datas': JSON.stringify(datas),
				csrfmiddlewaretoken: csrf_data
			},
		}).done( function(jsondata) {
			var data = JSON.parse(jsondata);
			if (data.status == 'NTE_06') {
				alert_lobibox("success", sysparam_datas_list[data.status]);
				$("#otp_mail_id").attr("disabled", true);
				btn_changes('pwd_chg_form');
				/*OTP Countdown Script Start*/
				var COUNT_START = 10*5*60; // tenths * seconds * hours
				var count = "";
				var playing = "";

				count = COUNT_START;
				playing = false;

				if (playing) {
					playing = false; 
				} else if (!playing) {
					playing = true; 
				}

				function countdown(){
					displayTime(); 
					if (count == 0) {
						playing = false;
						$("#otp_mail_id").attr("disabled", false);
						document.getElementById("otp_verification").style.display = "none";
						btn_changes('resend_otp_form');
						alert_lobibox("warning", "Time Up. Re-Submit your e-mail to generate new OTP")
					} else if (playing) {
						setTimeout(countdown, 100);
						count--;
					} else {
						setTimeout(countdown, 100); 
					}
				}
				countdown();

				function displayTime() {
					var tenths = count;  
					var sec = Math.floor(tenths / 10);
					var hours = Math.floor(sec / 3600);
					sec -= hours * (3600);
					var mins = Math.floor(sec / 60);
					sec -= mins * (60);

					if (hours < 1) {
						document.getElementById('otpcountdown').innerHTML = LeadingZero(mins)+':'+LeadingZero(sec);
					}
					else {
						document.getElementById('otpcountdown').innerHTML = hours+':'+LeadingZero(mins)+':'+LeadingZero(sec);
					}
				}
				function LeadingZero(Time) {
					return (Time < 10) ? "0" + Time : + Time;
				}
				/*OTP Countdown Script End*/
				document.getElementById("otp_verification").style.display = "block";
			} else {
				alert_lobibox("error", data.status);
			}
		});
	}
	return false
}

//Function for forgot modal button changes
function btn_changes(btn_action) {
	$("#otp_buttons").html('');
	var btnstr = '';
	if (btn_action == 'pwd_chg_form') {
		btnstr += '<button class="btn btn-success btn-eql-wid btn-animate" onclick="password_update();">Submit</button>';
		btnstr += '<button class="btn btn-warning btn-eql-wid btn-animate" data-dismiss="modal" aria-hidden="true">Cancel / Clear</button>';
	} else if (btn_action == 'resend_otp_form') {
		btnstr += '<button class="btn btn-success btn-eql-wid btn-animate" onclick="otp_generate();">Resend</button>';
		btnstr += '<button class="btn btn-warning btn-eql-wid btn-animate" data-dismiss="modal" aria-hidden="true">Cancel / Clear</button>';
	} else if (btn_action == 'modal_close') {
		btnstr += '<button class="btn btn-success btn-eql-wid btn-animate" onclick="otp_generate();">Submit</button>';
		btnstr += '<button class="btn btn-warning btn-eql-wid btn-animate" data-dismiss="modal" aria-hidden="true">Cancel / Clear</button>';
	}
	$("#otp_buttons").append(btnstr);
}

//Script to update new password
function password_update() {
	if (pwd_chg_form){
		var datas = getFormValues("#otp_validate_form");
		var	csrf_data = datas.csrfmiddlewaretoken;
		var actionurl = 'forgot_pwd/';
		$.ajax({
			type  : 'POST',
			url   : actionurl,
			async : false,
			data: {
				'datas': JSON.stringify(datas),
				csrfmiddlewaretoken: csrf_data
			},
		}).done(function(jsondata) {
			var data = JSON.parse(jsondata);
			if (data.status == "NTE_05") { 
				$('#forgot_password').modal('hide');
				alert_lobibox("success", sysparam_datas_list[data.status]);
			} else {
				alert_lobibox("error", data.status);
			}
		});
	}
	return false
}

$('#forgot_password').on('hidden.bs.modal', function () {
	document.getElementById("otp_verification").style.display = "none";
	$("#otp_mail_id").attr("disabled", false);
	form_inputs_clear('#otp_generate_form');
	form_inputs_clear('#otp_validate_form');
	btn_changes('modal_close');
});

//OTP generate form validation
function otpgenerate_form_validation(){
	return $('#otp_generate_form').valid();
}

$("#otp_generate_form").validate({
	rules: {
		otp_mail_id:{
			required: true,
		},
	},
	//For custom messages
	messages: {
		otp_mail_id:{
			required:"Enter User Email",
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

//Password change form validation
function pwd_chg_form(){
	return $('#otp_validate_form').valid();
}

$("#otp_validate_form").validate({
	rules: {
		otp_val:{
			required: true,
		},
		usr_pwd:{
			required: true,
		},
		usr_cnf_pwd:{
			equalTo : "#usr_pwd",
		},
	},
	//For custom messages
	messages: {
		otp_val:{
			required:"Enter OTP",
		},
		usr_pwd:{
			required:"Enter Password",
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

//Change password function
function pwd_generate(){
	if (pwdgenerate_form_validation()) {
		var datas = getFormValues("#changepwd_form");
		var	csrf_data = datas.csrfmiddlewaretoken;
		var actionurl = 'change_pwd/';
		$.ajax({
			type  : 'POST',
			url   : actionurl,
			async : false,
			data: {
				'datas': JSON.stringify(datas),
				csrfmiddlewaretoken: csrf_data
			},
		}).done(function(jsondata) {
			var data = JSON.parse(jsondata);
			if (data.status == "NTE_05") { 
				$('#change_password').modal('hide');
				alert_lobibox("success", sysparam_datas_list[data.status]);
			} else {
				alert_lobibox("error", data.status);
			}
		});
	}
}

//Change password form validation
function pwdgenerate_form_validation(){
	return $('#changepwd_form').valid();
}

$("#changepwd_form").validate({
	rules: {
		cp_current_pwd: {
			required: true,
		},
		cp_usr_pwd:{
			required: true,
			minlength: 8
		},
		cp_cnf_pwd: {
			equalTo : "#cp_usr_pwd",
			minlength: 8
		},
	},
	//For custom messages
	messages: {
		cp_current_pwd: {
			required: "Enter the current password",
		},
		cp_usr_pwd:{
			required:"Enter the new password",
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

$('#change_password').on('hidden.bs.modal', function () {
	form_inputs_clear('#changepwd_form');
});

function change_pwd_clear(){
	$("#cp_current_pwd").val('');
	$("#cp_usr_pwd").val('');
	$("#cp_cnf_pwd").val('');
}
