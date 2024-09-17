var employee_user_id = user_id
var emp_role_id = role_id

$(document).ready(function(){
	employee_payroll_report_table_dispaly()
	$("#reason_div").hide();
});
console.log("------------eee---",emp_role_id)
function employee_payroll_report_table_dispaly(){
	// hr view data table view function 
	if(emp_role_id == 24){
		$.ajax({	
			type  : 'POST',
			url   : '/all_employee_report_approved_tbl_dispaly/',
			data : {'user_id':employee_user_id},
			async : false,
		}).done( function(json_data) {
			data = JSON.parse(json_data);
			/*console.log("***********",data.employee_total_data[0].hr_data)
			if(data){
				employee_payroll_report_datatable_function(data.employee_total_data[0].hr_data)
			}else{
				employee_payroll_report_datatable_function(data)
			}
			employee_data_form(data.employee_total_data[0].emp_data,data.employee_total_data[0].working_days,data.employee_total_data[0].total_lop_count)
			leave_data_form(data.employee_total_data[0].leave_data);*/
		});
	}else{
		$.ajax({	
			type  : 'POST',
			url   : '/employee_payroll_report_table_dispaly/',
			data : {'user_id':employee_user_id},
			async : false,
		}).done( function(json_data) {
			data = JSON.parse(json_data);
			console.log("***********",data.employee_total_data[0].hr_data)
			if(data){
				employee_payroll_report_datatable_function(data.employee_total_data[0].hr_data)
			}else{
				employee_payroll_report_datatable_function(data)
			}
			employee_data_form(data.employee_total_data[0].emp_data,data.employee_total_data[0].working_days,data.employee_total_data[0].total_lop_count)
			leave_data_form(data.employee_total_data[0].leave_data);
		});
	}
	

}

//Employee time record  data table function here
function employee_payroll_report_datatable_function(data)
{
	datatable_list = []
	if(data.length > 0){
		datatable_list = []
		for(var i=0;i<data.length;i++){
			list = []
			var sno = i+1
			list.push(data[i].id,sno,data[i].check_in,data[i].summary_hr,data[i].meeting_hours,data[i].project_hrs,data[i].hr_hours);
			datatable_list.push(list);
		}

		columns = [{'title':'ID'},{'title':'No.'},{'title':'Date'},{'title':'Summary Hours'},{'title':'Meeting Hours'},{'title':'Project Hours'},{'title':'HR Hours'}]
		plaindatatable_btn('employee_payroll_tbl_details', datatable_list, columns,0);
	}else{
		columns = [{'title':'ID'},{'title':'No.'},{'title':'Date'},{'title':'Summary Hours'},{'title':'Meeting Hours'},{'title':'Project Hours'},{'title':'HR Hours'}]
		plaindatatable_btn('employee_payroll_tbl_details', datatable_list, columns,0);
	}
	return false
}

// Display in employee data and working days function
function employee_data_form(employee_value,woking_val,lop_val){
	var worked_days = 0;
	worked_days = woking_val - lop_val
	$('#profile_image').html("<img class='img-circle img-inline pic_ina' style='border-radius: 50%;width: 50px;height: 50px;border-radius: 50px;' src='"+image_path+employee_value[0].image_name+"' data-toggle='tooltip' data-placement='bottom' data-placement='top'   />");
	$("#employee_name").html(employee_value[0].employee_name)
	$("#team_name").html(employee_value[0].team_name)
	$("#designation_id").html(employee_value[0].role_title)
	$("#working_days").html(woking_val)
	$("#worked_days").html(worked_days)
	$("#lop_days").html(lop_val)
}

//Display leave data and permission data function
function leave_data_form(leave_data){
	leave_status = true
	permission_status = true
	//Display permission data condition dynamic append value ul and li list
	if(leave_data.length > 0){
		permAppend = '<ul>'
			for(i=0;i<leave_data.length;i++){
				if(leave_data[i].refitems_code == 'PEMSN'){
					permission_status = false
					console.log("***************8",leave_data[i].refitems_name)
					permAppend += "<li><span style='color: #0857F4;font-size: 14px;'>Date</span> <span style='padding: 22px;font-size: 14px;' id='perm_date'>"+leave_data[i].from_date+"</span> <span style='color: #0857F4;font-size: 14px;'>Leave</span> <span style='padding: 22px;font-size: 14px;' id='perm_name'>"+leave_data[i].refitems_name+"</span></li>"
				}
				
				if(leave_status){
					permAppend = "<p>No Data Found</p>"
				}
			}
		permAppend += '</ul>'
			$("#permission_div").append(permAppend)
	}else{
		permAppend = "<p>No Data Found</p>"
			$("#permission_div").append(permAppend)
	}
	
	//Display leave data condition dynamic append value ul and li list
	if(leave_data.length > 0){
		leaveAppend = '<ul>'
			for(i=0;i<leave_data.length;i++){
				if(leave_data[i].refitems_code != 'PEMSN'){
					leave_status = false
					if(leave_data[i].from_date == leave_data[i].to_date){
					console.log("***************8",leave_data[i].refitems_name)
					leaveAppend += "<li><span style='color: #0857F4;font-size: 14px;'>Date</span> <span style='padding: 22px;font-size: 14px;' id='perm_date'>"+leave_data[i].from_date+"</span> <span style='color: #0857F4;font-size: 14px;'>Leave</span> <span style='padding: 22px;font-size: 14px;' id='perm_name'>"+leave_data[i].refitems_name+"</span></li>"
				}else{
					leaveAppend += "<li><span style='color: #0857F4;font-size: 14px;'>Date</span> <span style='padding: 22px;font-size: 14px;' id='perm_date'>"+leave_data[i].from_date +"-"+leave_data[i].to_date+"</span> <span style='color: #0857F4;font-size: 14px;'>Leave</span> <span style='padding: 22px;font-size: 14px;' id='perm_name'>"+leave_data[i].refitems_name+"</span></li>"
				}
				}
				if(leave_status){
					leaveAppend = "<p>No Data Found</p>"
				}
			}
	leaveAppend += '</ul>'
		$("#leave_div").append(leaveAppend)
	}else{
		leaveAppend = "<p>No Data Found</p>"
			$("#leave_div").append(leaveAppend)
	}
}

// onchange function for reject reason 
$('#status').on('change', function() {
	payroll_details = []
	var status_type_value = $("#status option:selected").attr("data-code");
	if(status_type_value == 'REJET'){
		$('#button_div').html('')
		$("#reason_div").show();
	}else{
		strAppend = "<button type='button' onclick='submit_button()' class='btn btn-primary btn-eql-wid btn-animate ' style='float: right;top: 29px;'>Submit</button>"
			$('#button_div').html(strAppend)
			$("#reason_div").hide();
		$("#reason").val('')
	}
	$("#status_error").html(" ")
});

// save function
function submit_button(){
	var status_data = $("#status option:selected").text()
	if (status_data != '--Select Status--'){
		var status_type = $("#status option:selected").attr("data-code");
		var status_val = $("#status option:selected").val()
		if(status_type == 'REJET'){
			var reject_val = $("#status option:selected").val()
			if(reject_val != ''){
				var reject_data = $("#reason").val()
			}else{
				$("#reason_error").html("Enter Reason")
				return false
			}
		}else{
			reject_data = ''
		}
	}else{
		$("#status_error").html("Select Status")
		return false
	}
	var payroll_details  = {}
	payroll_details['reject_reason'] = reject_data
	payroll_details['status_id'] = status_val
	payroll_details['user_id'] = employee_user_id
	console.log(payroll_details)
	$.ajax({	
		type  : 'POST',
		url   : '/payroll_report_creation/',
		data  : {'report_data':JSON.stringify(payroll_details),'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val()},
		async : false,
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		if(data['status'] =='NTE-001'){
			alert_lobibox("success",'Added Successfully');
			payroll_report_clear();
		}else if(data['status'] =='NTE-003'){
			alert_lobibox("error","Already Approved")
		}else{
			alert_lobibox("error","Insert Failure")
		}

	});

}

//function report_create_function(payroll_data_dict){
//	console.log(payroll_data_dict)
//	console.log("*************8",JSON.stringify(payroll_data_dict))
//	$.ajax({	
//		type  : 'POST',
//		url   : '/payroll_report_creation/',
//		data  : {'report_data':JSON.stringify(payroll_data_dict),'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val()},
//		async : false,
//	}).done( function(json_data) {
//		data = JSON.parse(json_data);
//		if(data){
//			contribution_register_datatable_function(data)
//		}else{
//			contribution_register_datatable_function(data)
//		}
//
//	});
//}

//hide & show submit button function
$('#reason').keyup(function(){
	var reason_val = $(this).val()
	if(reason_val != ''){
		strAppend = "<button type='button' onclick='submit_button()' class='btn btn-primary btn-eql-wid btn-animate ' style='float: right;top: 29px;'>Submit</button>"
			$('#button_div').html(strAppend)
	}else{
		$('#button_div').html('')
	}
	$("#reason_error").html(" ")
});

//Clear function 
function payroll_report_clear(){
	$("#reason").val('')
	$("#status").val(0).trigger('change');
}