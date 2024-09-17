//On ready actions
$(document).ready(function () {
	$(".loader-wrapper").hide();
	btn_access_data();
});

//btn access add 13-12-2018 
function btn_access_data(){
//	localStorage.clear();
	$.ajax({
		type : "GET",
		url : "/get_btn_access/",
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		let data = JSON.parse(json_data);
		if (data.status == 'NTE_01'){
		$.each(data.access_datas, function(key, value) {
			localStorage.setItem(key, JSON.stringify(value));
		});}
		
	});	   
}
 
/*$(document).ajaxStart(function () {
	$(".loader-wrapper").show();
});*/
$(document).ajaxComplete(function(){
	$(".loader-wrapper").hide();
});

//Alert message show function
function alert_lobibox(alert_class, alert_content){
	setTimeout(function(){ showLobiboxNotification(alert_class,alert_content); }, 170);
}

//lobibox delay notification
function showLobiboxNotification(alert_class,alert_content){
	Lobibox.notify(alert_class, {
		position: 'top right',
		msg: alert_content,
//		delay: 10000,
	});
}

//get current date 
function currentDate(){
	var month_names = ["Jan", "Feb", "Mar", 
	                   "Apr", "May", "Jun", "Jul", "Aug", "Sep", 
	                   "Oct", "Nov", "Dec"];
	var today = new Date();
	var day = today.getDate();
	var month_index = today.getMonth();
	var year = today.getFullYear();
	return (day + "-" + month_names[month_index] + "-" + year);
}
                   
//Alert generic validation
function alert_status(status_code) {
	if (status_code == "NTE_01") {
		alert_lobibox("success", "Details Added Successfully.");
	} else if (status_code == "NTE_02") {
		alert_lobibox("error", "Details not Created/Updated.");
	} else if (status_code == "NTE_03") {
		alert_lobibox("success", "Details Updated Successfully.");
	} else if (status_code == "NTE_04") {
		alert_lobibox("success", "Details Removed Successfully.");
	} else if (status_code == "ERR0001") {
		alert_lobibox("error", "Login Failed due to Invalid Credentials.");
	} else if (status_code == "ERR0002") {
		alert_lobibox("error", "Login Attempt Limit Reached.");
	} else if (status_code == "ERR0003") {
		alert_lobibox("error", "Permission to view this page is denied.");
	} else if (status_code == "ERR0004") {
		alert_lobibox("error", "Authorization Failed.");
	} else if (status_code == "ERR0005") {
		alert_lobibox("error", "Incorrect Data Type.");
	} else if (status_code == "ERR0006") {
		alert_lobibox("error", "Invalid Data Format.");
	} else if (status_code == "ERR0007") {
		alert_lobibox("error", "File size limit exceeded.");
	} else if (status_code == "ERR0008") {
		alert_lobibox("error", "File format not supported.");
	} else if (status_code == "ERR0009") {
		alert_lobibox("error", "Missing mandatory fields.");
	} else if (status_code == "ERR0010") {
		alert_lobibox("error", "Too many arguments.");
	} else if (status_code == "ERR0011") {
		alert_lobibox("error", "To date is less than from date.");
	} else if (status_code == "ERR0012") {
		alert_lobibox("error", "Data/Resource not found.");
	} else if (status_code == "ERR0013") {
		alert_lobibox("error", "Unknown Exeption.");
	} else if (status_code == "ERR0014") {
		alert_lobibox("error", "Error occured while sending email.");
	} else if (status_code == "ERR0015") {
		alert_lobibox("error", "Incorrect data supplied.");
	} else if (status_code == "ERR0016") {
		alert_lobibox("error", "Name/Title already exits.");
	} else if (status_code == "ERR0020") {
		alert_lobibox("warning", "Duplicates code cannot be added.");
	} else if (status_code == "ERR0400") {
		alert_lobibox("error", "Bad request.");
	} else if (status_code == "ERR0401") {
		alert_lobibox("error", "Unauthorized.");
	} else if (status_code == "ERR0403") {
		alert_lobibox("error", "Forbidden.");
	} else if (status_code == "ERR0404") {
		alert_lobibox("error", "Page Not Found.");
	} else if (status_code == "ERR0405") {
		alert_lobibox("error", "Method not allowed.");
	} else if (status_code == "ERR0408") {
		alert_lobibox("error", "Request Timeout.");
	} else if (status_code == "ERR0500") {
		alert_lobibox("error", "Internal Server Error.");
	} else if (status_code == "ERR0503") {
		alert_lobibox("error", "Service Unavailable.");
	} else if (status_code == "ERR0600") {
		alert_lobibox("error", "Error rendering template(Template syntax error).");
	} else if(status_code=="ERR0021"){
		alert_lobibox("error", "Please Map logged User And Employee.");
	} else if(status_code=="ERR0022"){
		alert_lobibox("error", "Leave Balance Not Allocated In This Leave Type.");
	} else if(status_code=="ERR0023"){
		alert_lobibox("error", "Please enter less than 100 characters in Name field");
	} else if(status_code=="ERR0024"){
		alert_lobibox("error", "Please enter less than 30 characters in First Name or Last Name.");
	} else if (status_code == "ERR0025") {
		alert_lobibox("warning", "Duplicates Username cannot be added.");
	} else if (status_code == "ERR0026") {
		alert_lobibox("warning", "The selected modules does not have any pages associated. Select any other module.");
	} else if (status_code == "ERR0027") {
		alert_lobibox("warning", "The selected category does not have any reference items. Select any other category.");
	} else if (status_code == "ERR0028") {
		alert_lobibox("error", "The selected data is in use and cannot be removed.");
	} else if (status_code == "ERR0029") {
		alert_lobibox("error", "System data cannot be removed.");
	} else if (status_code == "ERR0030") {
		alert_lobibox("error", "System data code cannot be modified.");
	} else if (status_code == "ERR0031") {
		alert_lobibox("error", "The selected modules and parameter type does not have any record. Select any other options.");
	} else if (status_code == "NTE_11") {
		alert_lobibox("success","Check IN Successfully.");
	} else if (status_code == "NTE_12") {
		alert_lobibox("success", "Check OUT Successfully.");
	} else if (status_code == "NTE_13") {
		alert_lobibox("error", "Already exits Check IN/OUT Today.");
	} else if (status_code == "NTE_14") {
		alert_lobibox("error", "Holiday name Already exits.");
	} else if (status_code == "NTE_15") {
		alert_lobibox("error", "Select the reasons for rejection.");
	} else if (status_code == "NTE_16") {
		alert_lobibox("error", "Cannot able to Add the Past Record.");
	} else if (status_code == "NTE_17") {
		alert_lobibox("error", "Fill the all KPI value.");
	} else if (status_code == "NTE_18") {
		alert_lobibox("error", "Objective Already Exist.");
	} else if (status_code == "NTE_19") {
		alert_lobibox("error", "Cannot able to Update the Past Record.");
	} else if (status_code == "NTE_20") {
		alert_lobibox("error", "Cannot able to Remove the Past Record.");
	} else if (status_code == "NTE_21") {
		alert_lobibox("error", "Start Date should greater than End Date Format.");
	} else if (status_code == "NTE_22") {
		alert_lobibox("error", "Select any Record to Remove.");
	} else if (status_code == "NTE_23") {
		alert_lobibox("error", "Select Strategic Objective.");
	}else {
		alert_lobibox("error", "Status code doesn't match.");
	}
}

//Delete confirmation function 
function removeConfirmation(func_name, action_name, title) {
	var title = title == undefined ? '' :title;
	$('.popup_zindex').css({'z-index':'unset'});//search select btn zindex
	swal ({
		title: "Are you sure, you want to remove this ("+title+") record?",
//		text: "Go ahead the removed",
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
			if (action_name) {
				//NIAA CODE START
				if(func_name == 'employee_primary_details_delete_function'){
					let roomobj = findroomid($("#email").val());
					roomobj?ddpdeactivate(roomobj._id):'';
				}
				//NIAA CODE END
				window[func_name](action_name);
			} else {
				window[func_name]();
			}
		} 
	});
}

//function for swal close
function dev_swal_close(){
	$( ".cancel" ).click();
}

var form_status = 0;
$('form input, form select').change(function() {
	form_status = 1;
});

//move tab confirmation function 
function empNavigationFuncton(func_name, index) {
	$('.popup_zindex').css({'z-index':'unset'});//search select btn zindex
	swal ({
		title: "Confirm Navigation? If you navigate without saving, the changes you have made will be lost.",
		type: "warning",
		showCancelButton: true,
		confirmButtonClass: "btn btn-success btn-eql-wid btn-animate pull-left",
		cancelButtonClass: "btn btn-danger btn-eql-wid btn-animate pull-right",
		confirmButtonText: "Yes",
		cancelButtonText: "No",
		closeOnConfirm: true,
		closeOnCancel: true,
	},
	function(isConfirm) {
		if (isConfirm) {
			if (index) {
				window[func_name](index);
			} else {
				window[func_name]();
			}
		} 
	});
}


//close confirmation function 
function orgCloseFuncton(func_name,action_name) {
	$('.popup_zindex').css({'z-index':'unset'});//search select btn zindex
	swal ({
		title: "Are you sure, you want to close a tab?",
		type: "warning",
		showCancelButton: true,
		confirmButtonClass: "btn btn-success btn-eql-wid btn-animate pull-left",
		cancelButtonClass: "btn btn-danger btn-eql-wid btn-animate pull-right",
		confirmButtonText: "Yes",
		cancelButtonText: "No",
		closeOnConfirm: true,
		closeOnCancel: true,
	},
	function(isConfirm) {
		if (isConfirm) {
			if (action_name) {
				window[func_name](action_name);
			} else {
				window[func_name]();
			}
		} 
	});
}


//Clear confirmation function 
function orgClearFuncton(func_name, action_name, title) {
	var title = title == undefined ? '' :title;
	$('.popup_zindex').css({'z-index':'unset'});//search select btn zindex
	swal ({
		title: "Are you sure, you want to clear all ("+title+") items?",
		type: "warning",
		showCancelButton: true,
		confirmButtonClass: "btn btn-success btn-eql-wid btn-animate pull-left",
		cancelButtonClass: "btn btn-danger btn-eql-wid btn-animate pull-right",
		confirmButtonText: "Yes",
		cancelButtonText: "No",
		closeOnConfirm: true,
		closeOnCancel: true,
	},
	function(isConfirm) { 
		if (isConfirm) {
			if (action_name) {
				window[func_name](action_name);
			} else {
				window[func_name]();
			}
		} 
	});
}

//Candidate confirmation function 
function candidateConfirmation(func_name, action_name, title) {
	var title = title == undefined ? '' :title;
	$('.popup_zindex').css({'z-index':'unset'});//search select btn zindex
	swal ({
		title: "Are you sure, you want to move the Candidate ("+title+") to Employee?",
		type: "warning",
		showCancelButton: true,
		confirmButtonClass: "btn btn-success btn-eql-wid btn-animate pull-left",
		cancelButtonClass: "btn btn-danger btn-eql-wid btn-animate pull-right",
		confirmButtonText: "Yes",
		cancelButtonText: "No",
		closeOnConfirm: true,
		closeOnCancel: true,
	},
	function(isConfirm) {
		if (isConfirm) {
			if (action_name) {
				window[func_name](action_name);
			} else {
				window[func_name]();
			}
		} 
	});
}

//Inactivate employee to candidate
function employeeInactivateConfirmation(func_name, action_name, title) {
	var title = title == undefined ? '' :title;
	$('.popup_zindex').css({'z-index':'unset'});//search select btn zindex
	swal ({
		title: "Are you sure, you want to Inactive the ("+title+") in Employee?",
		type: "warning",
		showCancelButton: true,
		confirmButtonClass: "btn btn-success btn-eql-wid btn-animate pull-left",
		cancelButtonClass: "btn btn-danger btn-eql-wid btn-animate pull-right",
		confirmButtonText: "Yes",
		cancelButtonText: "No",
		closeOnConfirm: true,
		closeOnCancel: true,
	},
	function(isConfirm) {
		if (isConfirm) {
			if (action_name) {
				window[func_name](action_name);
			} else {
				window[func_name]();
			}
		} 
	});
}


//Form fields clear function 
function form_inputs_clear (form_id){
	var $inputs = $(''+form_id+' :input');// get the form id value
	$inputs.each(function() {
		if (this.name != "csrfmiddlewaretoken") {
			$("#"+this.name).val('').trigger("change");
		} 
	});
	$(form_id).find("select").val(0).trigger('change');
	$(form_id).trigger("reset");
}
//Form value get Function
function getFormValues(formId) {
	var formData= $(formId).serializeArray()
	var form_result_data ={} 
	formData.map(data => {form_result_data[data['name']] =$.trim(data['value']) })
	return form_result_data
}

//File value fetching function
function readMultipleFiles(file) {
	var reader = new FileReader();
	reader.onload = function (e) {
		file['file_binary'] = e.target.result;
	}
	reader.readAsDataURL(file.rawFile);
};

function get_file_data(file_id, event){
	event.preventDefault();
	var upload = $("#"+file_id).data("kendoUpload");
	var files = upload.getFiles();
	$.each(files, function (index, value) {
		readMultipleFiles(value);
	});

	return files;
}

//File size validation
function files_validation(files){
	var a = 0, b = 0;
	for (var i=0; i<files.length;i++){
		if (files[i].size < 5242880){
			a = i+1;
		} else {
			b = i+1;
		}
	}
	if (b == 0){
		return true;
	} else {
		return false;
	}
}

//Popup show and hide function
function popup_func(popup_id, action_name){
	if(action_name == "show"){
		$("#"+popup_id).modal("show");
	} else if (action_name == "hide") {
		$("#"+popup_id).modal("hide");
	} 
}

//data format change 
function formatChange(val){
	var yr = val.split(' ')[0];
	var time = val.split(' ')[1];
	return yr.split('-')[2]+'-'+yr.split('-')[1]+'-'+yr.split('-')[0]+' '+time
}

//Select box error validation hide
$(".hide_error").change(function (){
	if (this.value != 0) {
		$(this).next("span").next("span.span-error").hide();
		$(this).next("span").next("span.error").hide();
	} else {
		$(this).next("span").next("span.span-error").show();
		$(this).next("span").next("span.error").show();
	}
});

//Search function
$("#search_form").submit(function( event ) {
	search_data_manage();
	return false
});


function search_data_manage()
{
		var datas = getFormValues("#search_form");
		var	csrf_data = datas.csrfmiddlewaretoken;
		if (datas.search_content) {
			$.ajax({
				type  : 'POST',
				url   : '/search_result/',
				data: {
					'datas': JSON.stringify(datas),
					csrfmiddlewaretoken: csrf_data
				},
			}).done( function(jsondata) {
				var data = JSON.parse(jsondata);
				var search_result_str = '';
				if (data.status == "NTE_01") {
					$("#search_result_str").html('');
					if (data.employee_datas != undefined) {
						if (data.employee_datas.length>0){
							for (var i=0; i<data.employee_datas.length; i++) {
								search_result_str += '<li><a class="image-wrapper" href="'+ data.employee_datas[i].employee_url +'">';
								search_result_str += '<img src="http://tst-hcms.nexttechnosolutions.com/media/user_profile/'+data.employee_datas[i].id+'.jpg"></a><h4>';
								search_result_str += '<a class="cd-nowrap" href="'+ data.employee_datas[i].employee_url +'">' + data.employee_datas[i].employee_name + '</a></h4></li>';
							}
						} else {
							search_result_str += '<p class="text-center" style="color:#ef2804;">Search result not found here</p>';
						}
					} else if (data.help_content_datas != undefined) {
						if (data.help_content_datas.length>0){
							for (var i=0; i<data.help_content_datas.length; i++) {
								search_result_str += '<li><a class="image-wrapper" href="'+ data.help_content_datas[i].search_link +'">';
//								search_result_str += '<img src="http://tst-hcms.nexttechnosolutions.com/media/user_profile/'+data.help_content_datas[i].id+'.jpg"></a><h4>';
								search_result_str += '<a class="cd-nowrap" href="'+ data.help_content_datas[i].search_link +'">' + data.help_content_datas[i].search_data + '</a></h4></li>';
							}
						} else {
							search_result_str += '<p class="text-center" style="color:#ef2804;">Search result not found here</p>';
						}
					} else if (data.form_datas != undefined) {
						if (data.form_datas.length>0) {
							for (var i=0; i<data.form_datas.length; i++) {
								search_result_str += '<li><a class="image-wrapper" href="'+ data.form_datas[i].search_link +'">';
//								search_result_str += '<img src="http://tst-hcms.nexttechnosolutions.com/media/user_profile/'+data.form_datas[i].id+'.jpg"></a><h4>';
								search_result_str += '<a class="cd-nowrap" href="'+ data.form_datas[i].search_link +'">' + data.form_datas[i].search_data + '</a></h4></li>';
							}
						} else {
							search_result_str += '<p class="text-center" style="color:#ef2804;">Search result not found here</p>';
						}
					} else {
						search_result_str += '<p class="text-center" style="color:#ef2804;">Search result not found here</p>';
					}
					$("#search_result_str").append(search_result_str);
				} else {
					alert_lobibox("error", sysparam_datas_list[data.status]);
				}
			});
		} 
	}

//Search result management function
function search_data_management(){
	var datas = getFormValues("#search_form");
	var	csrf_data = datas.csrfmiddlewaretoken;
	if (datas.search_content) {
		$.ajax({
			type  : 'POST',
			url   : '/search_result/',
			data: {
				'datas': JSON.stringify(datas),
				csrfmiddlewaretoken: csrf_data
			},
		}).done( function(jsondata) {
			var data = JSON.parse(jsondata);
			var search_result_str = '';
			if (data.status == "NTE_01") {
				$("#search_result_str").html('');
				if (data.employee_datas != undefined) {
					if (data.employee_datas.length>0){
						for (var i=0; i<data.employee_datas.length; i++) {
							search_result_str += '<li><a class="image-wrapper" href="'+ data.employee_datas[i].employee_url +'">';
							search_result_str += '<img src="http://tst-hcms.nexttechnosolutions.com/media/user_profile/'+data.employee_datas[i].id+'.jpg"></a><h4>';
							search_result_str += '<a class="cd-nowrap" href="'+ data.employee_datas[i].employee_url +'">' + data.employee_datas[i].employee_name + '</a></h4></li>';
						}
					} else {
						search_result_str += '<p class="text-center" style="color:#ef2804;">Search result not found here</p>';
					}
				} else if (data.help_content_datas != undefined) {
					if (data.help_content_datas.length>0){
						for (var i=0; i<data.help_content_datas.length; i++) {
							search_result_str += '<li><a class="image-wrapper" href="'+ data.help_content_datas[i].search_link +'">';
//							search_result_str += '<img src="http://tst-hcms.nexttechnosolutions.com/media/user_profile/'+data.help_content_datas[i].id+'.jpg"></a><h4>';
							search_result_str += '<a class="cd-nowrap" href="'+ data.help_content_datas[i].search_link +'">' + data.help_content_datas[i].search_data + '</a></h4></li>';
						}
					} else {
						search_result_str += '<p class="text-center" style="color:#ef2804;">Search result not found here</p>';
					}
				} else if (data.form_datas != undefined) {
					if (data.form_datas.length>0) {
						for (var i=0; i<data.form_datas.length; i++) {
							search_result_str += '<li><a class="image-wrapper" href="'+ data.form_datas[i].search_link +'">';
//							search_result_str += '<img src="http://tst-hcms.nexttechnosolutions.com/media/user_profile/'+data.form_datas[i].id+'.jpg"></a><h4>';
							search_result_str += '<a class="cd-nowrap" href="'+ data.form_datas[i].search_link +'">' + data.form_datas[i].search_data + '</a></h4></li>';
						}
					} else {
						search_result_str += '<p class="text-center" style="color:#ef2804;">Search result not found here</p>';
					}
				} else {
					search_result_str += '<p class="text-center" style="color:#ef2804;">Search result not found here</p>';
				}
				$("#search_result_str").append(search_result_str);
			} else {
				alert_lobibox("error", sysparam_datas_list[data.status]);
			}
		});
	} else {
		alert_lobibox("error", "Please give search string");
	}
}

//Search result form validation
function search_form_validation(){
	return $('#search_form').valid();
}

$("#search_form").validate({
	rules: {
		search_content:{
			required:true
		},
	},
	//For custom messages
	messages: {
		search_content:{
			required:"Please give search string",
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

$("#search_close").click(function (){
	$("#search_result_str").html('');
	form_inputs_clear('#search_form');
});

$(document).ready(function () {
	//22-Feb-2018 || SMI ||	Add Method to jQuery Validator to check no space
	$.validator.addMethod("noSpace", function(value, element) {
		return value == '' || value.trim().length != 0;
	}, "Do Not Use Space");

	//30-May-2018 || SMI ||	Add Method to jQuery Validator to check end is greater than start
	$.validator.addMethod("greaterThan", function(value, element, params) {
		if (!/Invalid|NaN/.test(new Date(value))) {
			return new Date(value) > new Date($(params).val());
		}
		return isNaN(value) && isNaN($(params).val()) || (Number(value) > Number($(params).val())); 
	},'Must be greater than {0}.');

	$.validator.addMethod("valueNotEquals", function(value, element, arg){
		if(value == 0 || value == null) {
			return false
		} else {
			return true
		}
	}, "Value must not equal arg.");
});

//error class changes in ux3.x based format(HRMS)
$('.errormessage').addClass('span-error');


//----------------25June18 Dev Start---------------------------//
//called when key is pressed in textbox
$("#provident_fund_uan_no,#spouse_contact_no,#work_mobile,#emergency_contact_no,#organization_mobile_number,#organization_pin_code,#year_of_passed_out,#employee_experience,#employee_skill_rating,#duration,#mobile_no,#cgpa,#payment_advice_uan_no,#emp_emer_no1,#emp_emer_no2,#emp_emer_no3").keypress(function (e) {
	//if the letter is not digit then display error and don't type anything
	if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
		return false;
	}
});

//called when key is pressed in textbox
$("#work_phone,#organization_telephone_number,#phone_no").keypress(function (e) {
	//if the letter is not digit then display error and don't type anything
	if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57) && (e.which != 45)) {
		return false;
	}
});

//called when key is pressed in textbox
$("#percentage").keypress(function (e) {
	//if the letter is not digit then display error and don't type anything
	if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57) && (e.which != 46)) {
		return false;
	}
});
//----------------26June18 Dev End---------------------------//

//get browser name dynamically
function myBrowserFunction() { 
	if((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1 ) 
	{
		return ('Opera');
	}
	else if(navigator.userAgent.indexOf("Chrome") != -1 )
	{
		return ('Chrome');
	}
	else if(navigator.userAgent.indexOf("Safari") != -1)
	{
		return ('Safari');
	}
	else if(navigator.userAgent.indexOf("Firefox") != -1 ) 
	{
		return ('Firefox');
	}
	else if((navigator.userAgent.indexOf("MSIE") != -1 ) || (!!document.documentMode == true )) //IF IE > 10
	{
		return ('IE'); 
	}  
	else 
	{
		return ('unknown');
	}
}
//logger dev - Talent Acquisition start - 06-Aug-2018  TRU  

//logger div toogle
$(".logswitcher-toggle").click(function() {
    $("#logswitcher").toggleClass("open");
});

//logger div
function logInfo(logData){
	loggerContent = '';
	if(logData.length > 0){
		for(var i = 0; i < logData.length; i++){
			loggerContent += '<li><h1>'+logData[i].title+'</h1>';
			loggerContent += '<p>Created by <b>'+logData[i].createdby_username+'</b><br>'
			loggerContent += 'Modified by <b>'+logData[i].modify_username+'</b><br>'
			loggerContent += 'Created date <b>'+logData[i].created_date+'</b><br>'
			loggerContent += 'Modified date <b>'+logData[i].modified_date+'</b><br>'
//			loggerContent += 'Status <b>'+logData[i].status+'</b></p></li><hr>'
			loggerContent += '</p></li><hr>';
		}
	}else{
		loggerContent += '<li><h1 class="no_data_found">No Data Found.</h1></li>'; 
	}
	$('#log_info_div').html(loggerContent);
}

//logger search
$('#logSearch').on("keyup", function(e) {
	if (e.keyCode == 13) {
		var logValue = this.value;
		if(logValue != ''){
			var searchDatas = logSearchList({'getValue':logValue,'getKey':'log_details'})//search content call
			if(searchDatas.length > 0){
				logInfo(searchDatas);//search value parse
			}else{
				$('#log_info_div').html('<li><h1 class="no_data_found">No Data Found !</h1></li>');
			}
		}else{
			logInfo(result_data.log_details);
		}
		
	}
});

//search list in local data
function logSearchList(data){
	var searchDatas = []
	var getData = result_data[data['getKey']];
	for(var i=0; i<getData.length; i++){
		var getNames = (getData[i].title).toString().toLowerCase(); 
		var searchValue = (data['getValue']).toString().toLowerCase();
		if (getNames.indexOf(searchValue) > -1) {
			  console.log(getData[i]);
			  searchDatas.push(getData[i]);
			} 
	}
	return searchDatas;
}

//logger dev - Talent Acquisition end - 06-Aug-2018  TRU 


//Payroll Activity log function start
//Get all form values compare function
function payroll_activity_log(form_name){
	var payroll_activity_log_list = []
	$(form_name).find('input[old-value]:visible,select[old-value]:visible,textarea[old-value]:visible').each(function(){
		if($(this).is('input,textarea')){
			if ($(this).val() != $(this).attr('old-value')) {
				payroll_activity_log_list.push({'field_name':$.trim($(this).parent().siblings('label').clone().children().remove().end().text()),
			'old_value':$(this).attr('old-value'),
			'new_value':$(this).val()})
	}
		}
		else if($(this).is('select')){
			if ($('option:selected',this).text() != $(this).attr('old-value')){
				payroll_activity_log_list.push({'field_name':$.trim($(this).siblings('label').clone().children().remove().end().text()),
			'old_value':$(this).attr('old-value'),
			'new_value':$('option:selected',this).text()})
			}
		}
		else{
			
		} 
	});
	return payroll_activity_log_list;
}

function payroll_activity_log_attribute_value(form_name){
	$(form_name).find('input:visible,select:visible,textarea:visible').each(function(){
		console.log($(this))
		if($(this).is('input,textarea')){
			$(this).attr('old-value',$(this).val());
		}
		else if($(this).is('select')){
			$(this).attr('old-value',$("option:selected",this).text())
		}
		else{
			
		}
	});
}

//Payroll Activity log function end

//user data syn start
function usr_data_syn_to_others(){
	$(".loader-wrapper").show();
	$.ajax({
		type  : 'GET',
		url   : '/usr_data_syn/',
		async : false,
	}).done( function(jsondata) {
		$(".loader-wrapper").hide();
		var data = JSON.parse(jsondata);
		if (data.status == true){
			alert_lobibox("success", 'Data Syn Successfully');
		} else {
			alert_lobibox("error", 'Data Syn Failured');
		}
	});
}

//date picker function

function DatePickerUpdate(val) {
	span_value=$(val).text()
	$(val).next().val(span_value)
	input_id=$(val).next().attr('id')
	var form_id = $(val).closest('form').attr('id');
	$("#"+form_id).validate().element('#'+input_id);
		$("#"+input_id).trigger('change')
	}

	function DatePickerInputUpdate(val){
		input_value=$(val).val()
		input_id=$(val).next().attr('id')
		$('#'+input_id).prev().prev().text(input_value)
	}