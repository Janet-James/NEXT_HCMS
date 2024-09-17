//Global variable declaration
var payslip_id = ''
	var worked_day = 0.00
	var working_days = 0.00
	var lop_days = 0
	var total_basic_amount = 0.00
	var payslip_data = [];
var employer_contribution_list = []

$(document).ready(function(){
	payslip_table_dispaly()
	payslip_button_create(1)
	view_button_create()
});


function payslip_table_dispaly(){
	$.ajax({	
		type  : 'POST',
		url   : '/hr_payslip_table_view/',
		async : false,
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		if(data){
			payslip_datatable_function(data)
		}else{
			payslip_datatable_function(data)
		}

	});
}

//payslip data table function here
function payslip_datatable_function(data)
{
	payslip_datatable = []
	if(data.length>0){
		datatable_list = []
		for(var i=0;i<data.length;i++){
			payslip_list = []
			payslip_list.push(data[i].id,i+1,'<input type="checkbox" id="payslip_check" class="checkbox" name="payslip_chkbox"/>',data[i].employee_id_id,data[i].name,data[i].accountingperiod_from,
					data[i].accountingperiod_to,data[i].salary_structure_id_id,data[i].worked_days,data[i].lop_days);
			payslip_datatable.push(payslip_list);
		}
		var title = "PAYSLIP"
		columns = [{'title':'ID'},{'title':'No.'},{'title':'Select'},{'title':'Employee'},{'title':'Payslip Name'},{'title':'Period From'},{'title':'Period To'},{'title':'Salary Structure'},{'title':'worked Days'},{'title':'LOP Days'}]
		plaindatatable_in_payslip('payslip_details', payslip_datatable, columns,[],'NEXT_TRANSFORM_HCMS_PAYSLIP_'+currentDate(),title);
	}else{
		columns = [{'title':'ID'},{'title':'No.'},{'title':'Select'},{'title':'Employee'},{'title':'Payslip Name'},{'title':'Period From'},{'title':'Period To'},{'title':'Salary Structure'},{'title':'worked Days'},{'title':'LOP Days'}]
		plaindatatable_in_payslip('payslip_details', payslip_datatable, columns,[],'NEXT_TRANSFORM_HCMS_PAYSLIP_'+currentDate(),title);
	}
	return false
}

//button create function here
function payslip_button_create(status){
	var access_for_create = jQuery.inArray( "Payroll Setup", JSON.parse(localStorage.Create) );
	var access_for_write = jQuery.inArray( "Payroll Setup", JSON.parse(localStorage.Write) );
	var access_for_delete = jQuery.inArray( "Payroll Setup", JSON.parse(localStorage.Delete) );
	if(status == 1){
		if (access_for_create != -1){
		PaystrAppend = "<button type='button' onclick='payslip_compute_button()' class='btn btn-success btn-eql-wid btn-animate'>Compute</button>"
			PaystrAppend += " <button type='button' onclick='payslip_confirm_button()' class='btn btn-primary btn-eql-wid btn-animate '>Confirm</button>"
		}
		PaystrAppend += " <button type='button' onclick='payslip_clear()' class='btn btn-warning btn-animate btn-eql-wid btn-animate'>Cancel Payslip</button>"
		$('#payslip_btn').html(PaystrAppend);
	}else{
		/*if (access_for_write != -1){
		strAppend = "<button type='button' onclick='payslip_update_button()' class='btn btn-primary btn-eql-wid btn-animate '>Update</button>"
		}*/
		//if (access_for_delete != -1){
			PaystrAppend = ''
				PaystrAppend += " <button type='button' onclick='payslip_email_button()' class='btn btn-success btn-eql-wid btn-animate'>Send Email</button>"
				PaystrAppend += " <button type='button' onclick='payslip_delete_button()' class='btn btn-danger btn-eql-wid btn-animate '>Remove</button>"
		//}
				//strAppend += " <button type='button' onclick='payslip_clear()' class='btn btn-warning btn-animate btn-eql-wid btn-animate'>Cancel / Clear</button>"
				$('#payslip_btn').html(PaystrAppend);
	}
}

function view_button_create(){
	strAppend = "<button type='button' onclick='payslip_view_button()' class='btn btn-success btn-eql-wid btn-animate'>View</button>"
		strAppend += " <button type='button' onclick='payslip_print_button()' class='btn btn-primary btn-eql-wid btn-animate'>Print</button>"
			$('#payslip_view_btn').html(strAppend);
}
/*$('#salary_computation_click').click(function () {
	salary_computation_datatable_function();
});

function salary_computation_datatable_function()
{
	columns = [{'title':'ID'},{'title':'No.'},{'title':'Earnings'},{'title':'Amount'},{'title':'Deductions'},{'title':'Amount'}]

		plaindatatable_btn('hr_details_payslip_datatable', '', columns,0);
	return false
}*/

function payslip_print_button(){
	$("#payslip_view_salary_computation").empty()
	$('#payslip_view_div').html('')
	var print_value = $("input[name='payslip_chkbox']:checked").closest("tr").find('td:eq(0)').text();
	if(print_value){
		payslip_print_button_function();
	}else{
		alert_lobibox("error","Please Select One Record For Print")
	}
	
}

function payslip_view_button(){
	$('#payslip_view_modal').modal('show')
	$("#payslip_view_salary_computation").empty()
	$('#payslip_view_div').html('')
	payslip_view_button_function();
}

function payslip_view_button_function(){
	var view_values = [];
	var view_payslip_data=[];
	$('#payslip_view_div').html('')
	//Function For Checkbox Checked Value For Deletion
	$.each($("input[name='payslip_chkbox']:checked").closest("tr").find('td:eq(0)'),
			function () {
		view_values.push($(this).text());
	});
	view_values.forEach(function(value,index)
			{
		view_payslip_data.push(view_values[index])
			})
			if(view_payslip_data.length==1)
			{
				table_id=Array.from(new Set(view_payslip_data))
				if(table_id){
					$.ajax(
							{
								url : '/hr_payslip_view_button/',
								type : 'POST',
								timeout : 10000,
								data:{'payslip_id':JSON.stringify(table_id),csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()},
								async:false,

							}).done(
									function(json_data)
									{
										var data = JSON.parse(json_data);
										earning_list=[]
										deduction_list=[]
										Employer_Contribution_list=[]
										TableContent=''
											list_length=''
												ModelContent=''
													var totalAllowance = 0.00;
										var totalDeduction = 0.00;
										var empr_pf_contrb = 0;
//										Employee Allowance and Deduction Details
										if(data.payslip_details.length > 0){
											if(data.payslip_details.length){
												for(var i=0;i<data.payslip_details.length;i++){
													if(data.payslip_details[i].type=="ALLWC"){
														earning_list.push(data.payslip_details[i])
													}
													else if(data.payslip_details[i].type=="DEDCN"){
														deduction_list.push(data.payslip_details[i])
													}
													else if(data.payslip_details[i].type=="EMPCR"){
														Employer_Contribution_list.push(data.payslip_details[i])
													}
												}
											}
										}
										var working_days_view=0
										ModelContent += "<img src='/static/ui/images/Login-Logo.png' style='width:300px;height:50px;margin-bottom: 40px;'>"
											ModelContent += "<p style='display: inline-block;float: right;'> <font size='5' face='verdana' color='#808080'><b >Payslip <br />"+data.payslip_emp_details[0].payslip_date+"</b></font></p>"
											ModelContent += '<table class="employee-info" width="100%" border="0">'
												ModelContent += "<tr  style='background-color:#1aa3ff;'><th colspan=4> <b>Employee Information</b></th></tr>"
													ModelContent +="<tr><td><b>Employee Name	:</b> </td><td>"+data.payslip_emp_details[0].employee_name+"</td><td><b>Department Name	:</b></td><td>"+data.payslip_emp_details[0].department_name+"</td></tr>"
													ModelContent +="<tr><td><b>Designation	    :</b></td><td>"+data.payslip_emp_details[0].designation+" </td><td><b>Employee Id	    :</b></td><td>"+parseInt(data.payslip_emp_details[0].matrix_id)+"</td></tr>"
													if(data.payment_advice_details.length>0){
							pf_number=data.payment_advice_details[0].pf_number
						}else{
							pf_number=''
						}
													ModelContent +="<tr><td><b>Date Of Joining	:</b></td><td>"+data.payslip_emp_details[0].date_of_joining+" </td><td><b>Cost Center	        :</b></td><td>"+"NTE-IN-CBE"+"</td></tr>"
													ModelContent +="<tr><td><b>UAN Number	    :</b></td><td>"+data.payslip_emp_details[0].uan_number+" </td><td><b>PAN	    :</b></td><td>"+data.payslip_emp_details[0].pan_number+"</td></tr>"
													ModelContent += '</table></br>'
														ModelContent += '<table width="100%" border="0">'
															ModelContent += "<tr  style='background-color:#1aa3ff;'><th colspan=3> <b>Work Days</b></th></tr>"
																working_days_view=+data.payslip_emp_details[0].worked_days + +data.payslip_emp_details[0].lop_days
																ModelContent +="<tr><td style='float: left;'><b>Total Work Days	    :</b>"+working_days_view+"</td><td style='float: center;'><b>LOP Days	: </b>"+data.payslip_emp_details[0].lop_days+"</td><td style='float: right;'><b>Effective Work Days   	:</b>"+data.payslip_emp_details[0].worked_days+"</td></tr></br>"
																ModelContent += '</table></br>'
																	//ModelContent+="<p><b class='space-payslip_1'>Payslip Name	:</b>" +data[0].payslip_name+"<span class='space-payslip'></span><b class='space-payslip_1'>Employee Name	: </b>"+data[0].employee_name+"<span class='space-payslip'></span><b class='space-payslip_1'>Structure Name	: </b>"+data[0].structure_name+"</br></br><b class='space-payslip_1'>Period From: </b>"+data[0].period_from+"<span class='space-payslip'></span><b class='space-payslip_1'>Period To: </b>"+data[0].period_to+"</p>"
//																	Common List For Earning List
																	if(earning_list.length >= deduction_list.length){
																		list_length=earning_list.length
																	}else{
																		list_length=deduction_list.length
																	}
//										Table Append Functionality
										ModelContent += "<table width='100%' border='0'>"
											ModelContent +="<tr>"
												ModelContent += "<p><th  style='background-color:#1aa3ff;'>Earnings</th><th style='background-color:#1aa3ff;'>Amount</th><th style='background-color:#1aa3ff;'>Deductions</th><th style='background-color:#1aa3ff;'>Amount</th></p>"
													ModelContent +="</tr>"

														for(var i=0;i<list_length;i++){
															ModelContent +="<tr>"
																if(earning_list.length>i){
																	ModelContent +="<td><b>" +earning_list[i].details+ "</b></td><td>"+earning_list[i].amount+ "</td>"
																	totalAllowance = totalAllowance + earning_list[i].amount
																	if(earning_list[i].details == 'Basic'){
																		if(parseInt(earning_list[i].amount) >= 15000){
																			empr_pf_contrb = 1800
																		}else{
																			empr_pf_contrb = (12 * parseInt(earning_list[i].amount)) / 100
																		}
																	}
																}else{
																	ModelContent += "<td>" +''+ "</td><td>"+''+ "</td>"
																}
															if(deduction_list.length>i){
																ModelContent += "</td><td><b>" +deduction_list[i].details+ "</b></td><td>"+deduction_list[i].amount+ "</td>"
																totalDeduction = totalDeduction + deduction_list[i].amount
															}else{
																ModelContent += "<td>" +''+ "</td><td>"+''+ "</td>"
															}
															ModelContent +="</tr>"

														}
										/*var table_name = document.getElementById('payslip_view_salary_computation');

						for(var i=1;i<table_name.rows.length;i++)
						{
							if(table_name.rows[i].cells[1].innerHTML)
							{
								totalAllowance = totalAllowance +parseFloat(table_name.rows[i].cells[1].innerHTML)
							}
							else{

								totalAllowance=totalAllowance + 0.00
							}
							if(table_name.rows[i].cells[3].innerHTML)
							{
								totalDeduction = totalDeduction + parseFloat(table_name.rows[i].cells[3].innerHTML)
							}else{
								totalDeduction = totalDeduction +0.00
							}
						}*/

										total = totalAllowance - totalDeduction
										totalValue = Number((total).toFixed(2));
										//ModelContent +="<tr>"
										ModelContent +="<td><b>EARNED CTC</b></td><td><b>"+totalAllowance+"</b></td><td><b>TOTAL DEDUCTION</b></td><td><b>"+totalDeduction+"</b></td>"
										//ModelContent +="</tr>"
										//ModelContent +="<tr>"
										//ModelContent += "<td ></td><td></td><td style='background-color:#1aa3ff;'><b>Net Salary</b></td><td style='background-color:#1aa3ff;'><b>"+totalValue+" "+" Rupees "+" "+numberToWords.toWordsOrdinal(totalValue)+" Only </b></td>"
										ModelContent += "</table><br>"
											ModelContent += "<td ></td><td></td><td style='background-color:#1aa3ff;'><b>Net Salary (Rs) </b></td><td><b> "+totalValue+"</b></td><br>"
											ModelContent += "<td ></td><td></td><td style='background-color:#1aa3ff;'><b>Net Salary (in words) </b></td><td><b> "+numberToWords.toWordsOrdinal(totalValue)+" Only </b></td><br>"
											ModelContent += '<table width="100%" border="0">'
												ModelContent += "<tr style='background-color:#1aa3ff;'><th colspan=3> <b>Employer Direct Contributions</b></th></tr>"
													if(Employer_Contribution_list.length==1){
														ModelContent +="<tr><td style='float: left;'><b>PF Contribution	    :</b>"+parseInt(empr_pf_contrb)+"</td><td style='float: right;'><b>ESI Contribution:	 </b>0</td></tr></br>"
													}else if(Employer_Contribution_list.length==2) {
														ModelContent +="<tr><td style='float: left;'><b>PF Contribution	    :</b>"+parseInt(empr_pf_contrb)+"</td><td style='float: right;'><b>ESI Contribution:	 </b>"+Employer_Contribution_list[1].amount+"</td></tr></br>"
													}else{
														ModelContent +="<tr><td style='float: left;'><b>PF Contribution	    :</b>"+parseInt(empr_pf_contrb)+"</td><td style='float: right;'><b>ESI Contribution:	 </b>0</td></tr></br>"

													}
										ModelContent += '</table></br>'
											ModelContent += "<table  width='100%' border='0'>"
												ModelContent += "<tr style='background-color:#1aa3ff;'> <th colspan=3><b>Your Performance Rewards (YTD)</b></th></tr>"
													ModelContent +="<tr><td style='float: left;'><b>Earned	: </b>"+"0"+" </td><td style='float: center;'><b>Paid	: </b>"+"0"+"</td><td style='float: right;'><b>Unpaid	: </b>"+"0"+"</td></tr></br>"
													ModelContent += "</table></br>"
														ModelContent += "<table  width='100%' border='0'>"
															ModelContent += "<tr style='background-color:#1aa3ff;'> <th colspan=3><b>Year to Date Emoluments</b></th></tr>"
																ModelContent +="<tr><td style='float: left;'><b>Earnings	: </b>"+"1500"+" </td><td style='float: center;'><b>Deduction	: </b>"+"0"+"</td><td style='float: right;'><b>Net Salary	: </b>"+"0"+"</td></tr></br>"
																ModelContent += "</table></br>"
																	ModelContent += '<table width="100%" border="0">'
																		ModelContent += "<tr style='background-color:#1aa3ff;'><th colspan=2> <b>Bank Transfer Details</b></th></tr>"
																			if(data.payment_advice_details.length > 0){
																	ModelContent +="<tr><td style='float: left;'><b>Account No	    :</b>"+data.payment_advice_details[0].account_no+"</td><td style='float: right;width: 250px;'><b>Account Name	 :</b>"+data.payslip_emp_details[0].employee_name+"</td></tr></br>"
																	//For the next Month of 7th
																var actualDate = new Date(data.payment_advice_details[0].period_from); 
																var new_Month = actualDate.getMonth()+1
																actualDate.setMonth(new_Month)
																actualDate.setDate(7)
																if(actualDate.getDay()==0){
																	actualDate.setDate(actualDate.getDate()+1)

																}
																if(actualDate.getMonth()<10){
																	var value=actualDate.getMonth()+1
																	var date="0"+value

																}else{
																	var date=actualDate.getMonth()+1
																}
																var date_transfer = actualDate.getDate()+'/'+date+'/'+actualDate.getFullYear(); 
																ModelContent +="<tr><td style='float: left;'><b>Bank Name 	    :</b>"+data.payment_advice_details[0].bank_name+"</td><td style='float: right;width: 250px;'><b>IFSC	 :</b>"+data.payment_advice_details[0].ifsc_code+"</td></tr></br>"
																ModelContent +="<tr><td style='float: left;'><b>Date Of Transfer	    :</b>"+date_transfer+"</td><td style='float: right;width: 250px;'><b>Amount Transferred	: </b>"+totalValue+"</td></tr></br>"
																ModelContent += '</table><br>'
																	}
																			ModelContent += '<table width="100%" border="0">'
																				ModelContent += "<tr><td style='text-align: center;'>* This is a computer generated Payslip,hence signature not required </td></tr>"
																					if(data.company_details.length > 0){
																						ModelContent += "<tr><td style='text-align: center;'><b>"+data.company_details[0].name+  "</b></td></tr>"
																						ModelContent += "<tr><td style='text-align: center;'>"+data.company_details[0].address+" </td></tr>"
																						ModelContent += '</table>'
																					}	

										$('#payslip_view_div').append(ModelContent)
										//$("#payslip_view_salary_computation").append(TableContent)


										//ModelContent=''
										/*ModelContent +="<tr>"
								ModelContent +="<td><b>TOTAL EARNINGS</b></td><td><b>"+totalAllowance+"</b></td><td><b>TOTAL DEDUCTION</b></td><td><b>"+totalDeduction+"</b></td>"
								ModelContent +="</tr>"
									ModelContent +="<tr>"
										ModelContent += "<td ></td><td></td><td style='background-color:#1aa3ff;'><b>Net Salary</b></td><td style='background-color:#1aa3ff;'><b>"+totalValue+" "+" Rupees "+" "+numberToWords.toWordsOrdinal(totalValue)+" Only </b></td>"*/
										//ModelContent +="</tr>"
										//$("#payslip_view_salary_computation").append(TableContent)
									})
				}
			}else{
				$('#payslip_view_modal').modal('hide')
				alert_lobibox("error","Please Select One Record For View")
			}
}

function payslip_confirm_button() {
	if(payslip_form_validation())
	{
		payslip_create_function();
	}
}

function payslip_compute_button(){
	if(payslip_form_validation())
	{
		payslip_compute_function();
	}
}

function payslip_create_function(){
	var payslip_form_value = getFormValues("#payslip_form");
	var csrf_data = payslip_form_value.csrfmiddlewaretoken;
	var create_worked_days_form_value = getFormValues("#worked_days_form");
	delete create_worked_days_form_value.csrfmiddlewaretoken;
	delete payslip_form_value["csrfmiddlewaretoken"];
	payslip_form_value['is_active'] = "True";

	payslip_form_value['employee_id_id'] = validationFields(payslip_form_value['employee_id_id']);
	payslip_form_value['name'] = validationFields(payslip_form_value['name']);
	payslip_form_value['salary_structure_id_id'] = validationFields($('#hr_payslip_salary_structure').val());
	payslip_form_value['accountingperiod_from'] = dateFormat(payslip_form_value['accountingperiod_from']);
	payslip_form_value['accountingperiod_to'] = dateFormat(payslip_form_value['accountingperiod_to']);
	payslip_form_value['worked_days'] =$("#hr_worked_days").val();
	payslip_form_value['lop_days'] =$("#hr_leave_lop").val();

	payslip_details_list = [];
	payslip_dict = {};
	payslip_details_list.push(payslip_form_value);
	payslip_dict['payslip_data'] = payslip_details_list;
	//if((period_to>period_from) || (period_to==period_from) ){
	$.ajax({	
		type  : 'POST',
		url   : '/hr_payslip_create/',
		async : false,
		data: {
			'datas': JSON.stringify(payslip_dict),
			"table_id": payslip_id,
			csrfmiddlewaretoken: csrf_data,
		},
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		var res_status = data['status'];
		if(res_status == 'NTE_01') {
			payslip_id = data['status_id']
			alert_lobibox("success", sysparam_datas_list[res_status]);
			payslip_line = payslipline_create_funtion();
			if(payslip_line['status'] == 'NTE_01'){
				payslip_button_create(1)
				payslip_clear();
				payslip_table_dispaly();	
				employer_contribution_list = []
				payroll_log_activity();
			}
			else{
				alert_lobibox("error",sysparam_datas_list['ERR0040'])
			}

		}else if(res_status == 'NTE-003'){
			alert_lobibox("error","Payslip Already Exist Employee For This Month ")
		}
		/*else if(res_status == 'NTE_03') {	
			alert_lobibox("success", sysparam_datas_list[res_status]);
			payslip_button_create(1)
			payslip_clear();
			payslip_table_dispaly();	
			employer_contribution_list = []
		}*/
		else {
			alert_lobibox("error",sysparam_datas_list['ERR0040'])
		}
	});
//	}
//	else{
//	error_status("Period To greater than the Period From");
//	}
}

//Create Function For Payslip Line

function payslipline_create_funtion(){
	var line_data=''
		employee_id=$('#hr_payslip_employee_name').val()
		var payslip_line=GetTableValues_computation();
	$.ajax({
		type:"POST",
		url:'/hr_payslipline_create/',
		timeout : 10000,
		data:{"employee_id":employee_id,"payslip_line":JSON.stringify(payslip_line),"payslip_id":payslip_id,'is_active':true,csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()},
		async:false,
	}).done(function(json_data){
		line_data=JSON.parse(json_data);
	});
	return line_data
}


//Get Table Values Details For contract Details
function GetTableValues_computation() {
	compute_dict=''
		var table_name = document.getElementById('hr_details_payslip_datatable');
	var result_array_allowance = []
	var result_array_deduction=[]
	var result_array_employer_contribution=[]
	var row_length = table_name.rows.length 
	for (var r = 1 ; r < row_length-1; r++) {
		var allowance_arr = []
		for (var c = 0; c < 2 ; c++) {
			allowance_arr.push(table_name.rows[r].cells[c].innerHTML)
		}
		result_array_allowance.push({"type":"ALLWC","name":allowance_arr[0],"amount":parseFloat(allowance_arr[1])})
		var deduction_arr = []
		for (var c = 2; c < 4 ; c++) {
			deduction_arr.push(table_name.rows[r].cells[c].innerHTML)
		}
		result_array_deduction.push({"type":"DEDCN","name":deduction_arr[0],"amount":parseFloat(deduction_arr[1])})

	}
	for(r=0;r<employer_contribution_list.length;r++){
		result_array_employer_contribution.push({"type":"EMPCR","name":employer_contribution_list[r].name,"amount":parseFloat(employer_contribution_list[r].value)})
	}
	compute_dict=({"allowance":result_array_allowance,"deduction":result_array_deduction,"employer_contribution":result_array_employer_contribution})
	return compute_dict
}

//date format change
function dateFormat(val){
	return val.split(' ')[0]+'-'+val.split(' ')[1]
}

//function DateFormatChangeupd(val){
//	var reg = /(0[1-9]|[12][0-9]|3[01])[/](0[1-9]|1[012])[/](19|20)\d\d/;
//	if (val.match(reg)) {
//		return val.split('/')[2]+'-'+val.split('/')[1]+'-'+val.split('/')[0]
//	}
//	else {
//		return val.split('-')[2]+'-'+val.split('-')[1]+'-'+val.split('-')[0]
//	}
//
//}

//compute function Of Period To
function payslip_compute_function(){
	$("#hr_details_payslip_databody").empty()
	$('#hr_payslip_gross_salary').val('')
	$('#hr_payslip_net_salary').val('')
	document.getElementById("Employer_contribution_div").innerHTML = "";
	employer_contribution_list = []//For the Contribution Details Empty
	employee_id = $('#hr_payslip_employee_name').val()
	structure_id = $('#hr_payslip_salary_structure').val()
	period_from_date = $('#dtimepicker1').val()
	var dateArray = period_from_date.split(' ');
	var period_from = dateArray[0]+'-'+dateArray[1];
	period_to_date = $('#dtimepicker2').val()
	var dateArray = period_to_date.split(' ');
	var period_to = dateArray[0]+'-'+dateArray[1];
	if(structure_id && employee_id && period_from && period_to){
		if((period_to > period_from) || (period_to == period_from) ){
			//$('.error_status').html('')
			//For Worked Days and Working Days and LOP Days Calculation
			worked_days_calculation(employee_id,period_from,period_to)
			//For Salary Computation Functionality
			structure_salary_rule(employee_id,structure_id,worked_day,working_days,lop_days,period_from,period_to)
			//For Gross Salary and Net Salary Calculation
			compute_button_calculation();
			if(structure_id && employee_id){
				payslip_salaryrule_table_view(employee_id,structure_id);
			}
		}
		else{
			alert_lobibox("error","Period To greater than the Period From");
		}
	}
}

//Table View Functionality For Salary Rule Based on the salary Structure
function payslip_salaryrule_table_view(employee_id,structure_id){
	$.ajax({
		type:"POST",
		url:'/hr_payslip_salaryrule_table_view/',
		timeout : 10000,
		async:false,
		data:{'employee_id':employee_id,'structure_id':structure_id,csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()},
	}).done(function(json_data){
		data=JSON.parse(json_data)
		payslip_salaryrule_table(data)
	})
}

//Table Data Append Functionality For Salary Rule Based on the salary Structure

function payslip_salaryrule_table(data){
	payslip_salaryrule_datatable = []
	if(data.length > 0){
		for(var i=0;i<data.length;i++){
			payslip_salaryrule_list = []
			payslip_salaryrule_list.push(data[i].id,i+1,data[i].refitems_name,data[i].code,data[i].name,data[i].salary_rule_validation,data[i].salary_rule_value_assignment);
			payslip_salaryrule_datatable.push(payslip_salaryrule_list);
		}

		columns = [{'title':'ID'},{'title':'No.'},{'title':'Category'},{'title':'Rule Code'},{'title':'Rule Name'},{'title':'Validate'},{'title':'Value'}]
		plaindatatable_btn('hr_salaryrule_payslip_datatable', payslip_salaryrule_datatable, columns,0);
	}else{
		columns = [{'title':'ID'},{'title':'No.'},{'title':'Category'},{'title':'Rule Code'},{'title':'Rule Name'},{'title':'Validate'},{'title':'Value'}]
		plaindatatable_btn('hr_salaryrule_payslip_datatable', payslip_salaryrule_datatable, columns,0);
	}
	
	return false

}

//Worked Days Calculation Function
function worked_days_calculation(employee_id,period_from,period_to)
{
	$.ajax({
		type:"POST",
		url:'/hr_payslip_worked_days/',
		data:{"period_from":period_from,"period_to":period_to,'employee_id':employee_id,csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()},
		async:false,	
	}).done(function(json_data){
		data = JSON.parse(json_data);
		document.getElementById('hr_worked_days_total').value = data.total_working_days
		if(data.leave_lop){
			lop_days = data.leave_lop
			lop_count = data.lop_count
			total_lop_days = lop_days + lop_count
			document.getElementById('hr_leave_lop').value = total_lop_days
		}else{
			lop_count = data.lop_count
			lop_days = 0
			total_lop_days = lop_days + lop_count
			document.getElementById('hr_leave_lop').value = total_lop_days
		}
		document.getElementById('hr_worked_days').value = data.worked_days
		worked_day = data.worked_days
		working_days = data.total_working_days

	});
	return false
}

//View the Salary Rule Based On the Salary Structure
var esi_value = 0
var pf_value = 0
var tds_amount_value = 0
var total_earnings_salary = 0
function structure_salary_rule(employee_id,structure_id,worked_day,working_days,lop_days,period_from,period_to){
	tds_amount_value = 0
	$.ajax({
		type:"POST",
		url:'/hr_payslip_structure_salary_rule/',
		timeout : 10000,
		async:false,
		data:{'employee_id':employee_id,'structure_id':structure_id,'working_days':working_days,'worked_day':worked_day,'lop_days':lop_days,"period_from":period_from,"period_to":period_to,csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()},
	}).done(function(json_data){
		data=JSON.parse(json_data)
		var earning_list = []
		var deduction_list = []
		var contribution_list = []
		TableContent = ''
			var DivContent = ''
				var data_length = ''	
					var special_allow = 0.00
					//TDS amount calculation
					if(data.tds_amount.length > 0){
						tds_amount_value = parseInt(data.tds_amount)
						if(tds_amount_value){
							tds_amount_value = tds_amount_value
						}else{
							tds_amount_value = 0
						}
					}
//					Employee Allowance and Deduction Details
					if(data.emp_actual_earning_list.length > 0){
						if(data.emp_actual_earning_list.length){
							for(var i=0;i<data.emp_actual_earning_list.length;i++){
								if(data.emp_actual_earning_list[i].rule_category_code == "ALLWC"){
									total_earnings_salary += data.emp_actual_earning_list[i].assignment_value
									earning_list.push({'name': data.emp_actual_earning_list[i].salary_rule_name,'value':data.emp_actual_earning_list[i].assignment_value})
								}

							}

						}
					}
		if(data.emp_actual_deduction_list.length > 0){
			if(data.emp_actual_deduction_list.length){
				for(var i=0;i<data.emp_actual_deduction_list.length;i++){
					if(data.emp_actual_deduction_list[i].rule_category_code == "DEDCN"){
						deduction_list.push({'name': data.emp_actual_deduction_list[i].salary_rule_name,'value':data.emp_actual_deduction_list[i].assignment_value})
					}

				}

			}
		}
		//Special Allowance Calcualtion
		if(data.special_allowance){
			//Special Allowance Pushed into Earning List
			earning_list.push({'name': 'Special Allowance','value':Math.round(data.special_allowance)})
		}
		
		//Variable amount calculation
		if(data.variable_amount){
			//Variable amount Pushed into Earning List
			earning_list.push({'name': 'Variable Return','value':Math.round(data.variable_amount)})
		}
		
		//Leadership value return amount calculation
		if(data.lvr_value){
			//Leadership value return amount Pushed into Earning List
			earning_list.push({'name': 'Leadership Value Return','value':Math.round(data.lvr_value)})
		}
		
		//product value return amount calculation
		if(data.pvr_value){
			//product value return amount Pushed into Earning List
			earning_list.push({'name': 'Product Value Return','value':Math.round(data.pvr_value)})
		}
		
		//Arrear amount calculation
		if(data.arrear_amount){
			//Variable amount Pushed into Earning List
			earning_list.push({'name': 'Arrear','value':Math.round(data.arrear_amount)})
		}

		//For the Employer Contribution Details
		if(data.employer_contribution_details.length > 0){
			if(data.employer_contribution_details.length){
				/*for(var i=0;i<data.employer_contribution_details.length;i++){
					if(data.employer_contribution_details[i].rule_category_code == "DEDCN"){
						if (data.employer_contribution_details[i].salary_rule_name == 'ESI'){
							esi_value = data.employer_contribution_details[i].assignment_value
						}
						if (data.employer_contribution_details[i].salary_rule_name == 'Provident Fund'){
							pf_value = data.employer_contribution_details[i].assignment_value
						}
						employer_contribution_list.push({'name': data.employer_contribution_details[i].salary_rule_name,'value':data.employer_contribution_details[i].assignment_value})
					}

				}*/
				for(var i=0;i<data.employer_contribution_details.length;i++){
					if(data.employer_contribution_details[i].contribution_code == 'EMRPF'){
						pf_value = data.employer_contribution_details[i].assignment_value
						contribution_list.push({'name':'Employer Provident Fund','value':data.employer_contribution_details[i].assignment_value})
					}
					if(data.employer_contribution_details[i].contribution_code == 'EMRSI'){
						esi_value = data.employer_contribution_details[i].assignment_value
						contribution_list.push({'name':'Employer ESI','value':data.employer_contribution_details[i].assignment_value})
					}
				}

			}
		}
		//For Salary Computation Table Length Calculation
		if(earning_list.length == deduction_list.length){
			data_length = earning_list.length
		}else if(earning_list.length >deduction_list.length){
			data_length = earning_list.length
		}else{
			data_length = deduction_list.length
		}
//		Table Append Functionality
		for(var i=0;i<data_length;i++){
			TableContent += "<tr>"
				if(earning_list.length>i){
					TableContent += "<td>" +earning_list[i].name+ "</td><td>"+earning_list[i].value+ "</td>"
				}else{
					TableContent += "<td>" +''+ "</td><td>"+''+ "</td>"
				}
			if(deduction_list.length>i){
				if (deduction_list[i].name == 'Provident Fund'){
					TableContent += "<td>" +deduction_list[i].name+ "</td><td>"+(deduction_list[i].value)+ "</td>"
				}
				if(deduction_list[i].name == 'ESI'){
					TableContent += "<td>" +deduction_list[i].name+ "</td><td>"+(deduction_list[i].value)+ "</td>"
				}if(deduction_list[i].name == 'Professional Tax'){
					TableContent += "<td>" +deduction_list[i].name+ "</td><td>"+(deduction_list[i].value)+ "</td>"
				}
				
			}else{
				if(parseInt(esi_value) > 0){
					TableContent += "<td>Employer ESI</td><td>"+(esi_value)+ "</td>"
					esi_value = 0
				}else if(parseInt(pf_value) > 0){
					TableContent += "<td>Employer Provident Fund</td><td>"+(pf_value)+ "</td>"
					pf_value = 0
				}else if(parseInt(tds_amount_value) > 0 ){
					TableContent += "<td>Income Tax</td><td>"+(tds_amount_value)+ "</td>"
					tds_amount_value = 0
				}
				TableContent += "<td>" +''+ "</td></br><td>"+''+ "</td></br>"
			}
			TableContent += "</tr>"
		}
		$("#hr_details_payslip_datatable").append(TableContent)
		/*DivContent += '<table class="employer_contribution_table" width="100%" border="0" id="employer_contribution_table">'
			for(var i=0;i<2;i++){
				DivContent += "<tr>"
					DivContent += "<td style='float: left;'>" +contribution_list[i].name +": " +contribution_list[i].value+ "</td>"
					DivContent += "</tr>"
			}
		DivContent += "</table>"
			$("#Employer_contribution_div").append(DivContent)*/
	})
	return false
}

function compute_button_calculation(){
	var worked_day = 0.00
	var working_days = 0.00
	var table_name = document.getElementById('hr_details_payslip_datatable');
	var totalAllowance = 0.00;
	var totalDeduction = 0.00;
	for(var i=1;i<table_name.rows.length;i++)
	{
		if(table_name.rows[i].cells[1].innerHTML)
		{
			totalAllowance = totalAllowance +parseFloat(table_name.rows[i].cells[1].innerHTML)
		}
		else{
			totalAllowance=totalAllowance + 0.00
		}
		if(table_name.rows[i].cells[3].innerHTML)
		{
			totalDeduction = totalDeduction + parseFloat(table_name.rows[i].cells[3].innerHTML)
		}else{
			totalDeduction = totalDeduction +0.00
		}
	}


	total = totalAllowance - totalDeduction
	TableContent=''
		TableContent += "<tr>"
			TableContent += "<td><b>EARNED CTC</b></td><td>"+totalAllowance+"</td><td><b>TOTAL DEDUCTION</b></td><td>"+(totalDeduction+tds_amount_value)+"</td>"
			TableContent += "</tr>"
				$("#hr_details_payslip_datatable").append(TableContent)
				totalValue = Number((total).toFixed(2));
	if (totalValue > tds_amount_value){
		var total_net_salary_amt = (totalValue - tds_amount_value)
	}else{
		var total_net_salary_amt = (tds_amount_value + totalValue)
	}
	//Net Salary And Gross Salary Button
	$('#hr_payslip_net_salary').val(total_net_salary_amt)
	$('#hr_payslip_gross_salary').val(Number(totalAllowance).toFixed(2))

}

//Salary Contract form validation here
function payslip_form_validation()
{
	return $('#payslip_form').valid();
}

//validation for the empty
function validationFields(val){
	return val=='' || val =='0' ?null:val 
}

$.validator.addMethod("alpha", function(value, element) {
    return this.optional(element) || value == value.match(/^[a-zA-Z\s]+$/);
});

//Salary Contract form validation
$('#payslip_form').submit(function(e) {
	e.preventDefault();    
}).validate({
	rules: {
		employee_id_id: {
			required: true,
			valueNotEquals:true, 
		},   
		/*name: {
			required: true,
			 alpha: true,

		},*/salary_structure_id_id: {
			required: true,
			valueNotEquals:true, 
		},   
		accountingperiod_from: {
			required: true,
			//number:true, 
		},	  
		accountingperiod_to: {
			required: true,
			//valueNotEquals:true, 
		},
	},
	//For custom messages
	messages: {
		employee_id_id: {
			required: "Select Employee",
			valueNotEquals:"Select Employee", 
		},
		/*name: {
			required: "Enter Name",
			alpha: "Name cannot have numbers",
		},*/
		salary_structure_id_id: {
			required: "Select Salary Structure",
			valueNotEquals:"Select Salary Structure", 
		},
		accountingperiod_from: {
			required: "Enter Effective From Date",
			//number: "Enter only a number", 
		},
		accountingperiod_to: {
			required: "Enter Effective To Date",
			//number: "Enter only a number", 
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

jQuery.validator.addMethod('valueNotEquals', function (value) {
	return (value != '0');
}, "");

//payslip clear function
function payslip_clear(){
	payslip_button_create(1);
	$('.thumbnail').html("")
	$('.errormessage').html("");	
	$('#hr_payslip_name').val(''); 
	$('#dtimepicker1').val(''); 
	$('#dtimepicker2').val(''); 
	$('#hr_worked_days_total').val(''); 
	$('#hr_leave_lop').val(''); 
	$('#hr_worked_days').val(''); 
	$('#hr_payslip_salary_structure').val(0).trigger('change');
	$("#hr_payslip_employee_name").val(0).trigger('change');
	$("#hr_payslip_gross_salary").val('')
	$("#hr_payslip_net_salary").val('')
	//$('#payslip_emp_validation').html('');
	//$('#payslip_structure_validation').html('');
	$("#hr_emp_benefit_payslip_databody").empty()
	$("#hr_details_payslip_databody").empty()
	//$("#hr_salaryrule_payslip_databody").empty()

}

$("#hr_payslip_salary_structure").change(function(){
	$(".clear1").html('')
});

/*function getMonth(monthStr){
    return new Date(monthStr+'-1-01').getMonth()+1
}*/

/// payslip date name change function
$("#dtimepicker1").change(function(){
	var payslip_date = $("#dtimepicker1").val()
	var month_names =["January","February","March",
                      "April","May","June",
                      "July","August","September",
                      "October","November","December"];
	var today = new Date(payslip_date);
	var dd = today.getDate();
	var mm = today.getMonth(); //January is 0!
	var yyyy = today.getFullYear();
	//$('#hr_payslip_salary_structure').val(0).trigger('change')
	var emp_ids = $('#hr_payslip_employee_name option:selected').val()
	if(emp_ids !=0){
		if(mm == -1){
			mm = 0
		}
		var emp_name = $('#hr_payslip_employee_name option:selected').text()
		$("#hr_payslip_name").val(emp_name+"-"+month_names[mm]+"-"+yyyy)
	}
});

// select employee salary structure function
$("#hr_payslip_employee_name").change(function(){
	$(".clear2").html('')
	 $('#hr_payslip_salary_structure').empty();
	var emp_id = $('#hr_payslip_employee_name option:selected').val()
	/*var month_names =["January","February","March",
                      "April","May","June",
                      "July","August","September",
                      "October","November","December"];
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()-1; //January is 0!
	var yyyy = today.getFullYear();
	//$('#hr_payslip_salary_structure').val(0).trigger('change')
	
	if(emp_id !=0){
		if(mm == -1){
			mm = 0
		}
		var emp_name = $('#hr_payslip_employee_name option:selected').text()
		$("#hr_payslip_name").val(emp_name+"-"+month_names[mm]+"-"+yyyy)
	}*/
	var structure_id = ''
	$.ajax({
		type:"POST",
		url:'/hr_select_emp_salary_structure/',
		data:{"employee_id":emp_id},
		async:false,	
	}).done(function(json_data){
		data = JSON.parse(json_data);
		for(i=0;i<data.length;i++){
			structure_id = data[i].id;
			$('#hr_payslip_salary_structure').append($('<option>',{
				value:data[i].id,
				text:data[i].structure_name
			}))
		}
	});
	
	$('#hr_payslip_salary_structure').val(structure_id).trigger('change')
	return false
});

//Delete change function  
$(document).on('change','#payslip_check',function(){
	var payslip_check = $('#payslip_check:checked').val();
	if(payslip_check == 'on'){
		payslip_button_create(0)
	}else{
		payslip_button_create(1)
	}
	//payslip_button_create(0)
})

function payslip_delete_button(){
	//var payment_title = $('#ta_candidate_list option:selected').text();
	removeConfirmation('payslip_delete_function','','This Payslip');
}

function payslip_delete_function(){
	var delete_values = []
	var Table = $("#payslip_details").dataTable();
	//Function For Checkbox Checked Value For Deletion
	$("input:checkbox:checked", Table.fnGetNodes()).each(function() {
				var delete_list = ''
					delete_list = $(this).closest('tr').find('td').eq(0).text()+','
					delete_values.push(delete_list.slice(0,-1));
			}).get();
	
	if(delete_values.length > 0){
		$.ajax({	
			type  : 'POST',
			url   : '/payslip_delete/',
			async : false,
			data: {
				"delete_id": JSON.stringify(delete_values),
				csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val(),
			},
		}).done( function(json_data) {
			data = JSON.parse(json_data);
			var res_status = data['status'];
			if(res_status == 'NTE_04') {	
				alert_lobibox("success", sysparam_datas_list[res_status]);
				payslip_button_create(1)
				payslip_clear();
				payslip_table_dispaly();	
				//payment_activity_list = []
				payroll_log_activity();
			}
			else {
				alert_lobibox("error",sysparam_datas_list['ERR0028'])
			}
		});
	}
}



var payments_detail_data = '';
//For Function Payslip Print Functionality
function payslip_print_button_function(){
	//$(document).find(".loader-wrapper").show()
	var print_values = [];
	var print_payslip_data=[];
	$('#payslip_view_div').html('')
	var oTable = $("#payslip_details").dataTable();
	//Function For Checkbox Checked Value For Deletion
	$("input:checkbox:checked", oTable.fnGetNodes()).each(function() {
				var strAppend = ''
					strAppend = $(this).closest('tr').find('td').eq(0).text()+','
					print_values.push(strAppend.slice(0,-1));
			}).get();
//	$.each($("input[name='payslip_chkbox']:checked").closest("tr").find('td:eq(0)'),
//			function () {
//		print_values.push($(this).text());
//	});
	print_values.forEach(function(value,index)
			{
		print_payslip_data.push(print_values[index])
			})
			table_id=Array.from(new Set(print_payslip_data))
			if(table_id){
				$.ajax(
						{
							url : '/hr_payslip_print/',
							type : 'POST',
							timeout : 10000,
							data:{'payslip_id':JSON.stringify(table_id),csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()},
							async:false,

						}).done(
								function(json_data)
								{
									var data = JSON.parse(json_data);
									if(data){
										for(i=0;i<data.length;i++)
											{
										alert_lobibox("success", "Payslip Generation Successfully")
										let path = payslip_path+data[i]
										var file_name = '<a  title="Download Offer" id="payslip_report_download" class="btn btn-success btn-eql-wid btn-animate" href="'
											+ path
											+ '" download="'
											+ data[i]
											+ '"><i class="offer_report nf nf-download"></i></a>';
										$('#payslip_download').html(file_name);
										//alert_lobibox("success", "Payroll Report Generated Successfully. Please wait few seconds.");
										//setTimeout(function(){$('#payroll_report_download')[0].click(); }, 1000);
										$('#payslip_report_download')[0].click();
										//report_clear()
											}
									}else{
										alert_lobibox("error", "Report Generation Failure");
									}
									
									/*data_value=[]
									list_length=''
										var base_amount_emp = 0
										var total_earning_val = 0
//										Employee Allowance and Deduction Details
										if(data.exp_details.length > 0){
											if(data.exp_details.length){
												for(var i=0;i<data.exp_details.length;i++){
													//console.log("$$$$$",data.exp_details[i].image_value)
													earning_list=[]
													deduction_list=[]
													var rating_image = data.exp_details[i].yearly_image_value
													var mon_rating_image = data.exp_details[i].monthly_image_value
													//console.log("@@@@@@@@@@",mon_rating_image)
													var employee_name_list = []
													var department_name_list = []
													var matrix_id_list = []
													var provident_fund_no_list = []
													var payslip_date_list = []
													var designation_list = []
													var date_of_joining_list = []
													var worked_days_list = []
													var lop_days_list = []
													var pan_no_list = []
													var uan_no_list = []
													var special_allowance = []
													var ifsc_code_list = []
													var bank_name_list = []
													var company_name_list = []
													var company_address_list = []
													var branch_name_list = []
													var account_no_list = []
													var pf_no_list = []
													var payment_code_list = []
													var payslip_from_date_list = []
													var pf_employer_value = 0;
													var esi_employer_value = 0;
													var lta_value = 0;
													var tds_amount = 0;
													var total_employer_value = 0;
													var special_allowance = 0;
													var variable_return = 0;
													var leadership_value_return = 0;
													var arrear_amount = 0;
													special_allowance = data.exp_details[i].special_allowance
													variable_return = data.exp_details[i].variable_amount
													leadership_value_return = data.exp_details[i].lvr_value
													product_value_return = data.exp_details[i].pvr_value
													arrear_amount = data.exp_details[i].arrear_amount
													if (variable_return){
														variable_return = data.exp_details[i].variable_amount
													}else{
														variable_return = 0
													}
													if (leadership_value_return){
														leadership_value_return = data.exp_details[i].lvr_value
													}else{
														leadership_value_return = 0
													}
													if (product_value_return){
														product_value_return = data.exp_details[i].pvr_value
													}else{
														product_value_return = 0
													}
													if (arrear_amount){
														arrear_amount = parseInt(data.exp_details[i].arrear_amount)
													}else{
														arrear_amount = 0
													}
													payments_detail_data = data.exp_details[i].payment_details
													for (var j=0;j<data.exp_details[i].emp_actual_earning_list.length;j++){
														if(data.exp_details[i].emp_actual_earning_list[j].refitems_name=="Earnings"){
															earning_list.push(data.exp_details[i].emp_actual_earning_list[j])
														}
													}for (var j=0;j<data.exp_details[i].emp_actual_deduction_list.length;j++){
														if(data.exp_details[i].emp_actual_deduction_list[j].refitems_name=="Deduction"){
															deduction_list.push(data.exp_details[i].emp_actual_deduction_list[j])
														}
													}
													for (var v=0;v<data.exp_details[i].employee_data_val.length;v++){
														employee_name_list.push(data.exp_details[i].employee_data_val[v].employee_name)
														department_name_list.push(data.exp_details[i].employee_data_val[v].department_name)
														matrix_id_list.push(data.exp_details[i].employee_data_val[v].matrix_id)
														provident_fund_no_list.push(data.exp_details[i].employee_data_val[v].provident_fund_no)
														payslip_date_list.push(data.exp_details[i].employee_data_val[v].payslip_date)
														designation_list.push(data.exp_details[i].employee_data_val[v].designation)
														date_of_joining_list.push(data.exp_details[i].employee_data_val[v].date_of_joining)
														worked_days_list.push(data.exp_details[i].employee_data_val[v].worked_days)
														lop_days_list.push(data.exp_details[i].employee_data_val[v].lop_days)
														payslip_from_date_list.push(data.exp_details[i].employee_data_val[v].payslip_from_date)
														pan_no_list.push(data.exp_details[i].employee_data_val[v].pan_number)
														uan_no_list.push(data.exp_details[i].employee_data_val[v].uan_number)

													}
													for (var s=0;s<data.exp_details[i].company_data_val.length;s++){
														console.log("ggggggggggggggg",data.exp_details[i].company_data_val)
														company_name_list.push(data.exp_details[i].company_data_val[s].company_name)
														company_address_list.push(data.exp_details[i].company_data_val[s].company_address)

													}
												//	if (data.exp_details[i].payment_details != 'No payment details'){
													for (var s=0;s<data.exp_details[i].payment_details.length;s++){
														ifsc_code_list.push(data.exp_details[i].payment_details[s].ifsc_code)
														bank_name_list.push(data.exp_details[i].payment_details[s].bank_name)
														company_name_list.push(data.exp_details[i].payment_details[s].company_name)
														company_address_list.push(data.exp_details[i].payment_details[s].company_address)
														branch_name_list.push(data.exp_details[i].payment_details[s].branch_name)
														account_no_list.push(data.exp_details[i].payment_details[s].account_no)
														pf_no_list.push(data.exp_details[i].payment_details[s].pf_number)
														payment_code_list.push(data.exp_details[i].payment_details[s].payment_code)
														worked_days_list.push(data.exp_details[i].employee_data_val[v].worked_days)
														lop_days_list.push(data.exp_details[i].employee_data_val[v].lop_days)

													}
													}else{
														alert_lobibox("error","Please enter bank details for this employee")
													}
													for (var z=0;z<data.exp_details[i].employer_contribution_details.length;z++){
														if(data.exp_details[i].employer_contribution_details[z].contribution_code == 'EMRPF'){
															pf_employer_value = data.exp_details[i].employer_contribution_details[z].assignment_value
														}
														if(data.exp_details[i].employer_contribution_details[z].contribution_code == 'EMRSI'){
															esi_employer_value = data.exp_details[i].employer_contribution_details[z].assignment_value
														}
													}
													lta_value = data.exp_details[i].leave_travel_value
													base_amount_emp = data.exp_details[i].ctc_amount
													tds_amount = parseInt(data.exp_details[i].tds_amount)
													data_value.push({'earning_list':earning_list,'deduction_list':deduction_list,'ctc_amount':data.exp_details[i].ctc_amount,
														'employee_name_list':employee_name_list,'department_name_list':department_name_list,'matrix_id_list':matrix_id_list,
														'provident_fund_no_list':provident_fund_no_list,'payslip_date_list':payslip_date_list,'designation_list':designation_list,
														'date_of_joining_list':date_of_joining_list,'worked_days_list':worked_days_list,'lop_days_list':lop_days_list,
														'payslip_from_date_list':payslip_from_date_list,'company_name_list':company_name_list,'company_address_list':company_address_list,
														'ifsc_code_list':ifsc_code_list,'bank_name_list':bank_name_list,'branch_name_list':branch_name_list,'account_no_list':account_no_list,
														'pf_no_list':pf_no_list,'payment_code_list':payment_code_list,'pan_no_list':pan_no_list,'uan_no_list':uan_no_list})
												}
											}
										}
										else{
											$("#payslip_print_salary_computation").append("No Data Available")
										}
									var payslip_print_data=[]
									total_employer_value = pf_employer_value + esi_employer_value
									for(k=0;k<data_value.length;k++){
										var payslip_emp_name = '';
										var payslip_name_print = ''
											TableContent=''
												var special_allw_amt=0
												var earnings_total_value = 0
												var deduction_total_value = 0
												var net_salary = 0
												var tot_special_allw_amt = 0
												var total_deduction_amt = 0
												TableContent += "<div id='Table_export'>"
													TableContent += "<table id='payslip_print_table_emp' width='100%' border='1'>"
														for(m=0;m<data_value[k].employee_name_list.length;m++)
														{
															payslip_emp_name = data_value[k].employee_name_list[m]
															payslip_name_print = data_value[k].payslip_date_list[m]
															payslip_from_date = data_value[k].payslip_from_date_list[m]
															//TableContent += "<tr><td></td><td><p style='text-align: center;'> <b>Payslip for :"+data_value[k].payslip_date_list[m] +"</b></p></td><td></td><td></td></tr>"
															TableContent += "<tr><td><p style='text-align: center;'> <b>Employee Information</b></p></td><td></td><td></td><td></td></tr>"
																TableContent+="<tr><td><b>Employee Name	 </b>"+data_value[k].employee_name_list[m]+" </td><td></td><td></td> <td><b>Department Name     </b>"+data_value[k].department_name_list[m]+"</td></tr></br>"
																TableContent+="<tr><td><b>Designation	         </b>"+data_value[k].designation_list[m]+" </td><td></td><td></td>  <td><b>Employee ID	      </b>"+parseInt(data_value[k].matrix_id_list[m])+"</td></tr></br>"
																TableContent+="<tr><td><b>Date of Joining	   </b>"+data_value[k].date_of_joining_list[m]+" </td> <td></td><td></td> <td><b>Cost Center	       </b>"+"NTE-IN-CBE"+"</td></tr></br>"
																TableContent+="<tr><td><b>UAN Number	      </b>"+data_value[k].uan_no_list[m]+" </td><td></td><td></td>  <td><b>PAN                           </b>"+data_value[k].pan_no_list[m]+"</td></tr></br>"

														}
										var actualDate = new Date(payslip_from_date);
										var new_Month = actualDate.getMonth()+1
										actualDate.setMonth(new_Month)
										actualDate.setDate(7)
										if(actualDate.getDay()==0){
											actualDate.setDate(actualDate.getDate()+1)

										}
										if(actualDate.getMonth()<10){
											var value=actualDate.getMonth()+1
											var date="0"+value
										}else{
											var date=actualDate.getMonth()+1
										}
										var fund_transfer_date = actualDate.getDate()+'/'+date+'/'+actualDate.getFullYear();
										var total_work_days = 0
										//TableContent += "<tr></tr>"
										TableContent += "</table>"
											TableContent += "<table id='payslip_print_table_emp_work_days' width='100%' border='1'>"
												for(var n=0;n<data_value[k].worked_days_list.length;n++){
													total_work_days = parseInt(data_value[k].worked_days_list[n]) + parseInt(data_value[k].lop_days_list[n])
													TableContent += "<tr><td>Work Days</td><td></td><td></td><td></td></tr>"
														TableContent+="<tr><td><b>Total Worked Days	 </b>"+total_work_days+" </td><td></td><td><b>LOP Days	 </b>"+data_value[k].lop_days_list[n]+"</td><td><b>No.of Payable Days	 </b>"+data_value[k].worked_days_list[n]+"</td></tr></br>"
												}
										TableContent += "</table>"
//											Common List For Earning List
											if(data_value[k].earning_list.length >= data_value[k].deduction_list.length){
												list_length=data_value[k].earning_list.length
											}else{
												list_length=data_value[k].deduction_list.length
											}
//										Table Append Functionality
										TableContent += "<table id='payslip_print_table_calc' width='100%' border='1'>"
											TableContent +="<tr>"
												TableContent += "<th>Earnings</th><th>Amount</th><th>Deductions</th><th>Amount</th>"
													TableContent +="</tr>"
														for(var i=0;i<list_length;i++){
															TableContent +="<tr>"
																if(data_value[k].earning_list.length>i){
																	TableContent +="<td>" +data_value[k].earning_list[i].salary_rule_name+ "</td><td>"+data_value[k].earning_list[i].assignment_value+"</td>"
																	earnings_total_value = earnings_total_value + data_value[k].earning_list[i].assignment_value
																}else{
																	TableContent += "<td>" +''+ "</td><td>"+''+ "</td>"
																}
															if(data_value[k].deduction_list.length>i){
																
																if(data_value[k].deduction_list[i].salary_rule_name == 'Provident Fund'){
																	TableContent += "</td><td>" +data_value[k].deduction_list[i].salary_rule_name+ "</td><td>"+(data_value[k].deduction_list[i].assignment_value + pf_employer_value)+"</td>"
																}
																else if(data_value[k].deduction_list[i].salary_rule_name == 'ESI'){
																	TableContent += "</td><td>" +data_value[k].deduction_list[i].salary_rule_name+ "</td><td>"+(data_value[k].deduction_list[i].assignment_value + esi_employer_value)+"</td>"
																}
																else if(true){
																	TableContent += "</td><td>Income Tax</td><td>"+tds_amount+"</td>"
																}
																else{
																	TableContent += "</td><td>" +data_value[k].deduction_list[i].salary_rule_name+ "</td><td>"+data_value[k].deduction_list[i].assignment_value+"</td>"
																}
																
																deduction_total_value = deduction_total_value + data_value[k].deduction_list[i].assignment_value 
															}else{
																TableContent += "<td>" +''+ "</td><td>"+''+ "</td>"
															}
															TableContent +="</tr>"

														}
										special_allw_amt = Math.round(special_allowance)
										//tot_special_allw_amt = base_amount_emp - earnings_total_value //special_allw_amt + lta_value - pf_employer_value - esi_employer_value
										total_earning_val = earnings_total_value + special_allw_amt + variable_return + leadership_value_return + arrear_amount + product_value_return
										if (deduction_total_value > tds_amount){
											total_deduction_amt = (deduction_total_value + tds_amount)
										}else{
											total_deduction_amt = (tds_amount + deduction_total_value)
										}
										TableContent +="<tr><td><b>Special Allowance </b></td><td><b>"+special_allw_amt +"</b></td></tr>"
										//TableContent +="<tr><td><b>Arrear </b></td><td><b>"+special_allw_amt +"</b></td></tr>"
										TableContent +="<tr><td><b>Arrear </b></td><td><b>"+arrear_amount +"</b></td></tr>"
										TableContent +="<tr><td><b>Variable Return </b></td><td><b>"+variable_return +"</b></td></tr>"
										TableContent +="<tr><td><b>Leadership Value Return </b></td><td><b>"+leadership_value_return +"</b></td></tr>"
										TableContent +="<tr><td><b>Product Value Return </b></td><td><b>"+product_value_return +"</b></td></tr>"
										TableContent +="<tr><td><b>EARNED CTC  </b></td><td><b>"+total_earning_val +"</b></td><td><b>TOTAL DEDUCTION  </b></td><td><b>"+(total_deduction_amt + total_employer_value) +"</b></td></tr>"
										//TableContent += "</table>"
										net_salary = total_earning_val - total_deduction_amt - total_employer_value
										//TableContent += "<tr></tr>"
										//TableContent += "<tr><td><b>NET SALARY            "+net_salary +" "+" Rupees "+" "+numberToWords.toWordsOrdinal(net_salary)+" Only </b></td></tr>"
										TableContent += "</table>"
											TableContent += "<table id='payslip_print_table_net' width='100%' border='1'>"
												//TableContent += "<tr><td><b>NET SALARY (Rs)      "+net_salary +" </b></td></tr>"
												//TableContent += "<tr><td><b>NET SALARY (in words)     "+numberToWords.toWordsOrdinal(net_salary)+" Only </b></td></tr>"
												//TableContent += "<tr><td><p style='text-align: center;'> <b>Net Salary</b></p></td><td></td><td></td><td></td></tr>"
												TableContent += "<tr><td><b>NET SALARY            "+net_salary +" "+" Rupees "+" "+numberToWords.toWordsOrdinal(net_salary)+" Only </b></td></tr>"
												TableContent += "</table>"
													TableContent += "<table id='payslip_print_table_emp_pf' width='100%' border='1'>"
														TableContent += "<tr><td><p style='text-align: center;'> <b>Employer Direct Contributions</b></p></td><td></td><td></td><td></td></tr>"
															TableContent+="<tr><td><b>PF Contribution	  </b>"+pf_employer_value+" </td><td></td><td></td>  <td><b>ESI Contribution	  </b>"+esi_employer_value+"</td></tr></br>"
															TableContent += "</table>"
																TableContent += "<table id='payslip_print_table_emp_ytd' width='100%' border='1'>"
																	TableContent += "<tr><td style='width:100%;'><p style='text-align: center;'> <b>Your Performance Rewards (YTD)</b></p></td><td></td><td></td><td></td></tr>"
																		TableContent+="<tr><td><b>Earned	  </b>"+"0"+" </td><td><b>Paid	  </b>"+"0"+"</td><td></td><td><b>Unpaid	  </b>"+"0"+"</td></tr></br>"
																		TableContent += "</table>"
																			//TableContent += "</table>"
																			
																						//Monthly performance
																						TableContent += "<table id='payslip_print_table_emp_emo' width='100%' border='1'>"
																							TableContent += "<tr><td><p style='text-align: center;'> <b>Monthly Performance</b></p></td><td></td><td></td><td></td></tr>"
																								//TableContent+="<tr><td><b>Earnings	  </b>"+"0"+" </td><td></td><td><b>Deductions	  </b>"+"0"+"</td><td><b>Net Salary	  </b>"+"0"+"</td></tr></br>"
																								TableContent += "</table>"
																									//yearly performance
																									TableContent += "<table id='payslip_print_table_emp_emo' width='100%' border='1'>"
																										TableContent += "<tr><td><p style='text-align: center;'> <b>Yearly Performance</b></p></td><td></td><td></td><td></td></tr>"
																											//TableContent+="<tr><td><b>Earnings	  </b>"+"0"+" </td><td></td><td><b>Deductions	  </b>"+"0"+"</td><td><b>Net Salary	  </b>"+"0"+"</td></tr></br>"
																											TableContent += "</table>"
																												TableContent += "<table id='payslip_print_table_emp_emo' width='100%' border='1'>"
																													TableContent += "<tr><td><p style='text-align: center;'> <b>Year to Date Emoluments</b></p></td><td></td><td></td><td></td></tr>"
																														TableContent+="<tr><td><b>Earnings	  </b>"+"0"+" </td><td></td><td><b>Deductions	  </b>"+"0"+"</td><td><b>Net Salary	  </b>"+"0"+"</td></tr></br>"
																														TableContent += "</table>"
																						TableContent += "<table id='payslip_print_table_bank' width='100%' border='1'>"
																		var bank_name = ''
																			if (payments_detail_data.length > 0){
																		for(b=0;b<data_value[k].account_no_list.length;b++){
																			if(data_value[k].payment_code_list[b] == "ONLIN"){
																				TableContent += "<tr><td><p style='text-align: center;'> <b>Bank Transfer Details</b></p></td><td></td><td></td><td></td></tr>"
																					TableContent+="<tr><td><b>Account No	        </b>"+data_value[k].account_no_list[b]+" </td><td></td><td></td> <td><b>Account Name                  </b>"+payslip_emp_name+"</td></tr></br>"
																					TableContent+="<tr><td><b>Bank Name	         </b>"+data_value[k].bank_name_list[b]+" </td><td></td><td></td>  <td><b>IFSC	                            </b>"+data_value[k].ifsc_code_list[b]+"</td></tr></br>"
																					TableContent+="<tr><td><b>Date of Transfer	 </b>"+fund_transfer_date+" </td> <td></td><td></td> <td><b>Amount Transferred	 </b>"+net_salary+"</td></tr></br>"
																			}else{
																				TableContent += "<tr><td><p style='text-align: center;'> <b>Bank Transfer Details</b></p></td><td></td><td></td><td></td></tr>"
																					//TableContent+="<tr><td><b>Account No	        </b>"+data_value[k].account_no_list[b]+" </td><td></td><td></td> <td><b>Account Name                  </b>"+payslip_emp_name+"</td></tr></br>"
																					//TableContent+="<tr><td><b>Bank Name	         </b>"+data_value[k].bank_name_list[b]+" </td><td></td><td></td>  <td><b>IFSC	                            </b>"+data_value[k].ifsc_code_list[b]+"</td></tr></br>"
																					TableContent+="<tr><td><b>Date of Transfer	 </b>"+fund_transfer_date+" </td> <td></td><td></td> <td><b>Amount Transferred	 </b>"+net_salary+"</td></tr></br>"
																			}
																			
																		}
																			}else{
																				alert_lobibox("error","Please insert payment advice details for this employee");
																				return false
																			}
																			TableContent += "</table>"
																						TableContent += "<table id='payslip_print_table_address' width='100%' border='1'>"
																			for(c=0;c<data_value[k].company_name_list.length;c++){
																			TableContent += "<tr><td>* This is a computer generated Payslip,hence signature not required </td></tr>"
																				TableContent += "<tr><td> "+data_value[k].company_name_list[c]+" </td></tr>"
																					TableContent += "<tr><td>"+data_value[k].company_address_list[c]+" </td></tr>"
																				//TableContent += "<tr><td><p style='text-align: center;'> <b>Net Salary</b></p></td><td></td><td></td><td></td></tr>"
																			}
																			TableContent += "</table>"
																						TableContent += "</div>"
																							payslip_print_data += TableContent
																							//$('#payslip_print_div').append(TableContent)
																							//$("#payslip_print_salary_computation").append(TableContent)
																							//PDF(TableContent,payslip_emp_name,payslip_name_print,rating_image,mon_rating_image)
									}*/
								})
			}
}


function PDF(tablecontent,payslip_emp_name,payslip_name_print)     
{  
	var doc = new jsPDF('p', 'pt', 'a4');

	var imgData = 'data:image/PNG;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAABQCAYAAAD7sIxLAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKT2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89+bN/rXXPues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz/SMBAPh+PDwrIsAHvgABeNMLCADATZvAMByH/w/qQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAtAGAnf+bTAICd+Jl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dXLh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA/g88wAAKCRFRHgg/P9eM4Ors7ONo62Dl8t6r8G/yJiYuP+5c+rcEAAAOF0ftH+LC+zGoA7BoBt/qIl7gRoXgugdfeLZrIPQLUAoOnaV/Nw+H48PEWhkLnZ2eXk5NhKxEJbYcpXff5nwl/AV/1s+X48/Pf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H/LcL//wd0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s+wM+3zUAsGo+AXuRLahdYwP2SycQWHTA4vcAAPK7b8HUKAgDgGiD4c93/+8//UegJQCAZkmScQAAXkQkLlTKsz/HCAAARKCBKrBBG/TBGCzABhzBBdzBC/xgNoRCJMTCQhBCCmSAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD/phCJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8+Q8cwwOgYBzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8+xdwQSgUXACTYEd0IgYR5BSFhMWE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR+cQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMyJ7mQAkmxpFTSEtJG0m5SI+ksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG+Qh8lsKnWJAcaT4U+IoUspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdpr+h0uhHdlR5Ol9BX0svpR+iX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK+YTKYZ04sZx1QwNzHrmOeZD5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI+pXlN9rkZVM1PjqQnUlqtVqp1Q61MbU2epO6iHqmeob1Q/pH5Z/YkGWcNMw09DpFGgsV/jvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY/R27iz2qqaE5QzNKM1ezUvOUZj8H45hx+Jx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllirSKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4/OBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79up+6Ynr5egJ5Mb6feeb3n+hx9L/1U/W36p/VHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6VhlWGX4YSRudE8o9VGjUYPjGnGXOMk423GbcajJgYmISZLTepN7ppSTbmmKaY7TDtMx83MzaLN1pk1mz0x1zLnm+eb15vft2BaeFostqi2uGVJsuRaplnutrxuhVo5WaVYVVpds0atna0l1rutu6cRp7lOk06rntZnw7Dxtsm2qbcZsOXYBtuutm22fWFnYhdnt8Wuw+6TvZN9un2N/T0HDYfZDqsdWh1+c7RyFDpWOt6azpzuP33F9JbpL2dYzxDP2DPjthPLKcRpnVOb00dnF2e5c4PziIuJS4LLLpc+Lpsbxt3IveRKdPVxXeF60vWdm7Obwu2o26/uNu5p7ofcn8w0nymeWTNz0MPIQ+BR5dE/C5+VMGvfrH5PQ0+BZ7XnIy9jL5FXrdewt6V3qvdh7xc+9j5yn+M+4zw33jLeWV/MN8C3yLfLT8Nvnl+F30N/I/9k/3r/0QCngCUBZwOJgUGBWwL7+Hp8Ib+OPzrbZfay2e1BjKC5QRVBj4KtguXBrSFoyOyQrSH355jOkc5pDoVQfujW0Adh5mGLw34MJ4WHhVeGP45wiFga0TGXNXfR3ENz30T6RJZE3ptnMU85ry1KNSo+qi5qPNo3ujS6P8YuZlnM1VidWElsSxw5LiquNm5svt/87fOH4p3iC+N7F5gvyF1weaHOwvSFpxapLhIsOpZATIhOOJTwQRAqqBaMJfITdyWOCnnCHcJnIi/RNtGI2ENcKh5O8kgqTXqS7JG8NXkkxTOlLOW5hCepkLxMDUzdmzqeFpp2IG0yPTq9MYOSkZBxQqohTZO2Z+pn5mZ2y6xlhbL+xW6Lty8elQfJa7OQrAVZLQq2QqboVFoo1yoHsmdlV2a/zYnKOZarnivN7cyzytuQN5zvn//tEsIS4ZK2pYZLVy0dWOa9rGo5sjxxedsK4xUFK4ZWBqw8uIq2Km3VT6vtV5eufr0mek1rgV7ByoLBtQFr6wtVCuWFfevc1+1dT1gvWd+1YfqGnRs+FYmKrhTbF5cVf9go3HjlG4dvyr+Z3JS0qavEuWTPZtJm6ebeLZ5bDpaql+aXDm4N2dq0Dd9WtO319kXbL5fNKNu7g7ZDuaO/PLi8ZafJzs07P1SkVPRU+lQ27tLdtWHX+G7R7ht7vPY07NXbW7z3/T7JvttVAVVN1WbVZftJ+7P3P66Jqun4lvttXa1ObXHtxwPSA/0HIw6217nU1R3SPVRSj9Yr60cOxx++/p3vdy0NNg1VjZzG4iNwRHnk6fcJ3/ceDTradox7rOEH0x92HWcdL2pCmvKaRptTmvtbYlu6T8w+0dbq3nr8R9sfD5w0PFl5SvNUyWna6YLTk2fyz4ydlZ19fi753GDborZ752PO32oPb++6EHTh0kX/i+c7vDvOXPK4dPKy2+UTV7hXmq86X23qdOo8/pPTT8e7nLuarrlca7nuer21e2b36RueN87d9L158Rb/1tWeOT3dvfN6b/fF9/XfFt1+cif9zsu72Xcn7q28T7xf9EDtQdlD3YfVP1v+3Njv3H9qwHeg89HcR/cGhYPP/pH1jw9DBY+Zj8uGDYbrnjg+OTniP3L96fynQ89kzyaeF/6i/suuFxYvfvjV69fO0ZjRoZfyl5O/bXyl/erA6xmv28bCxh6+yXgzMV70VvvtwXfcdx3vo98PT+R8IH8o/2j5sfVT0Kf7kxmTk/8EA5jz/GMzLdsAAEEraVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/Pgo8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjUtYzAxNCA3OS4xNTE0ODEsIDIwMTMvMDMvMTMtMTI6MDk6MTUgICAgICAgICI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgICAgICAgICAgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iCiAgICAgICAgICAgIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiCiAgICAgICAgICAgIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIKICAgICAgICAgICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgICAgICAgICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iPgogICAgICAgICA8eG1wOkNyZWF0b3JUb29sPkFkb2JlIFBob3Rvc2hvcCBDQyAoV2luZG93cyk8L3htcDpDcmVhdG9yVG9vbD4KICAgICAgICAgPHhtcDpDcmVhdGVEYXRlPjIwMTctMTItMjJUMTM6NTg6MjQrMDU6MzA8L3htcDpDcmVhdGVEYXRlPgogICAgICAgICA8eG1wOk1ldGFkYXRhRGF0ZT4yMDE3LTEyLTIyVDEzOjU4OjI0KzA1OjMwPC94bXA6TWV0YWRhdGFEYXRlPgogICAgICAgICA8eG1wOk1vZGlmeURhdGU+MjAxNy0xMi0yMlQxMzo1ODoyNCswNTozMDwveG1wOk1vZGlmeURhdGU+CiAgICAgICAgIDx4bXBNTTpJbnN0YW5jZUlEPnhtcC5paWQ6NjkyMWUyMDctYjczMC04MzRjLTg1YzQtMDQ0ZDk3MzA4YWUwPC94bXBNTTpJbnN0YW5jZUlEPgogICAgICAgICA8eG1wTU06RG9jdW1lbnRJRD54bXAuZGlkOmUxNmVmNGZlLWE1MDctNjY0Yy1hMzQ0LTg3NWY2ZTIzNTFmODwveG1wTU06RG9jdW1lbnRJRD4KICAgICAgICAgPHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD54bXAuZGlkOmUxNmVmNGZlLWE1MDctNjY0Yy1hMzQ0LTg3NWY2ZTIzNTFmODwveG1wTU06T3JpZ2luYWxEb2N1bWVudElEPgogICAgICAgICA8eG1wTU06SGlzdG9yeT4KICAgICAgICAgICAgPHJkZjpTZXE+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6YWN0aW9uPmNyZWF0ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0Omluc3RhbmNlSUQ+eG1wLmlpZDplMTZlZjRmZS1hNTA3LTY2NGMtYTM0NC04NzVmNmUyMzUxZjg8L3N0RXZ0Omluc3RhbmNlSUQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDp3aGVuPjIwMTctMTItMjJUMTM6NTg6MjQrMDU6MzA8L3N0RXZ0OndoZW4+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpzb2Z0d2FyZUFnZW50PkFkb2JlIFBob3Rvc2hvcCBDQyAoV2luZG93cyk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5zYXZlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOjY5MjFlMjA3LWI3MzAtODM0Yy04NWM0LTA0NGQ5NzMwOGFlMDwvc3RFdnQ6aW5zdGFuY2VJRD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OndoZW4+MjAxNy0xMi0yMlQxMzo1ODoyNCswNTozMDwvc3RFdnQ6d2hlbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnNvZnR3YXJlQWdlbnQ+QWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKTwvc3RFdnQ6c29mdHdhcmVBZ2VudD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmNoYW5nZWQ+Lzwvc3RFdnQ6Y2hhbmdlZD4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgIDwvcmRmOlNlcT4KICAgICAgICAgPC94bXBNTTpIaXN0b3J5PgogICAgICAgICA8cGhvdG9zaG9wOkRvY3VtZW50QW5jZXN0b3JzPgogICAgICAgICAgICA8cmRmOkJhZz4KICAgICAgICAgICAgICAgPHJkZjpsaT4wMDM3MkQxM0Q0NTNGQTMxODcyMkIyRUI1OUY0OUQ3QjwvcmRmOmxpPgogICAgICAgICAgICAgICA8cmRmOmxpPjI5NEY4Mjg5MTNCMDJCQTU5Mzk0NjkyRUFGN0E5RDI2PC9yZGY6bGk+CiAgICAgICAgICAgICAgIDxyZGY6bGk+NTAxMTU3NzEyRERDRTZDNEIzRTNGMkU3ODZCNDM4MDU8L3JkZjpsaT4KICAgICAgICAgICAgICAgPHJkZjpsaT43QzM4NERFMDY1RjQzNzY3MzFERjRCMjU5QUM2RDAyMDwvcmRmOmxpPgogICAgICAgICAgICAgICA8cmRmOmxpPkM3OTREQzMxRjI1Mzc1OTBENDdDMUI1QUM1QTk1ODYwPC9yZGY6bGk+CiAgICAgICAgICAgICAgIDxyZGY6bGk+eG1wLmRpZDowMDBkNjMxMC01MTIyLWM0NDQtOTc0Zi03NGVhZTljMjU0Njg8L3JkZjpsaT4KICAgICAgICAgICAgICAgPHJkZjpsaT54bXAuZGlkOjBENTQwMTVBRjMzQTExRTNBRThBRTA1MDZBOEEwMUZDPC9yZGY6bGk+CiAgICAgICAgICAgICAgIDxyZGY6bGk+eG1wLmRpZDowY2JiODQyZS02NDZjLTQzNGUtYWQ0NC1kYjBmMDZlMzk5YTg8L3JkZjpsaT4KICAgICAgICAgICAgICAgPHJkZjpsaT54bXAuZGlkOjJGRkY2RDk0RDU3RTExRTFCQTNDODBBQTdDRTA1RERBPC9yZGY6bGk+CiAgICAgICAgICAgICAgIDxyZGY6bGk+eG1wLmRpZDoyYjNkNGMwMy1mZTQ4LWI3NGItOThiMi0wOTFkYTQ0OGZmMTY8L3JkZjpsaT4KICAgICAgICAgICAgICAgPHJkZjpsaT54bXAuZGlkOjNhNGNmNzBhLTRhYzAtYTU0MS1iNmQ5LTllZjc0NmUwZWQ4YzwvcmRmOmxpPgogICAgICAgICAgICAgICA8cmRmOmxpPnhtcC5kaWQ6NDBDOTJFNzNFMDM1MTFFMjlEN0VGMzcwNzIxNkQ0RTM8L3JkZjpsaT4KICAgICAgICAgICAgICAgPHJkZjpsaT54bXAuZGlkOjQzMTllY2VjLWUzMWYtOTA0NS04ODlhLTIyMTM2M2YzOTQzZDwvcmRmOmxpPgogICAgICAgICAgICAgICA8cmRmOmxpPnhtcC5kaWQ6Njc3NTVjYjEtZjNiMy02NzRmLWE5ZjctMTU0OTFlZTMxMmI4PC9yZGY6bGk+CiAgICAgICAgICAgICAgIDxyZGY6bGk+eG1wLmRpZDo2QjlCOTU1MjE1QjExMUUzQjNGMkFDOEZEM0M0NTQ4NjwvcmRmOmxpPgogICAgICAgICAgICAgICA8cmRmOmxpPnhtcC5kaWQ6NzY3OWYxYjEtNmNjMC03NTQ3LWJmOWMtM2I2YzFjMzM5NDhmPC9yZGY6bGk+CiAgICAgICAgICAgICAgIDxyZGY6bGk+eG1wLmRpZDo3YmU0YjY0Ny02YTVmLWY5NGQtODdhNi01NDA1YzhlM2QwODY8L3JkZjpsaT4KICAgICAgICAgICAgICAgPHJkZjpsaT54bXAuZGlkOjdkYzRkOGMxLTk5NWEtMmQ0Zi04ZjNhLTY3ZTQ4NjZjMmM3MTwvcmRmOmxpPgogICAgICAgICAgICAgICA8cmRmOmxpPnhtcC5kaWQ6ODcyMWQ2N2QtNDAwZi1mYjQ1LThjN2MtZDFlNWQ2NmNlOGYyPC9yZGY6bGk+CiAgICAgICAgICAgICAgIDxyZGY6bGk+eG1wLmRpZDo4ZGE0OTI0Mi04YTI5LWRjNGYtOTk3ZS02ZDFkZmZhMmUwYWY8L3JkZjpsaT4KICAgICAgICAgICAgICAgPHJkZjpsaT54bXAuZGlkOjk1ZmI0NzJhLTRhNzUtNjA0Zi05ODkyLWNjZTZlOWY2NGZjNDwvcmRmOmxpPgogICAgICAgICAgICAgICA8cmRmOmxpPnhtcC5kaWQ6OTgyMjM4MjMtZTVmZi05YjQyLWIwZWYtMzAxMWI1OTFiYzAzPC9yZGY6bGk+CiAgICAgICAgICAgICAgIDxyZGY6bGk+eG1wLmRpZDpCM0QwQUQ0MjVEMzJFNDExQkYyQkFFMURBQTdGRERBMjwvcmRmOmxpPgogICAgICAgICAgICA8L3JkZjpCYWc+CiAgICAgICAgIDwvcGhvdG9zaG9wOkRvY3VtZW50QW5jZXN0b3JzPgogICAgICAgICA8cGhvdG9zaG9wOkNvbG9yTW9kZT4zPC9waG90b3Nob3A6Q29sb3JNb2RlPgogICAgICAgICA8cGhvdG9zaG9wOklDQ1Byb2ZpbGU+c1JHQiBJRUM2MTk2Ni0yLjE8L3Bob3Rvc2hvcDpJQ0NQcm9maWxlPgogICAgICAgICA8ZGM6Zm9ybWF0PmltYWdlL3BuZzwvZGM6Zm9ybWF0PgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpYUmVzb2x1dGlvbj43MjAwMDAvMTAwMDA8L3RpZmY6WFJlc29sdXRpb24+CiAgICAgICAgIDx0aWZmOllSZXNvbHV0aW9uPjcyMDAwMC8xMDAwMDwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6UmVzb2x1dGlvblVuaXQ+MjwvdGlmZjpSZXNvbHV0aW9uVW5pdD4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT4xPC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDxleGlmOlBpeGVsWERpbWVuc2lvbj4xNTA8L2V4aWY6UGl4ZWxYRGltZW5zaW9uPgogICAgICAgICA8ZXhpZjpQaXhlbFlEaW1lbnNpb24+ODA8L2V4aWY6UGl4ZWxZRGltZW5zaW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/Pj/4TVUAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAADW1JREFUeNrsnWm4VVUZx3+Xyw0wEBARnB7DQFMcQhFLS0ANw/HklPNANjikOCRaaaY9mpI4lJmVZg6pOeQsakY5hiMqIILiNS1QEwQFuUynD+vdz913s9e71tpnn8vTZf0/3XvWPuu8e+//Xuudd0O1WiUiomw0RGJFRGJFRGJFRGLFqxARiRURiRURiRUREYkV8f9CrIa7ncdtAXwb2DD12XLgHeAmYGoJsnQDxgFDgO4yfzMwAXg9cK4dgaOBPiVfr2eBSxX5zwd2AtYBGoClco1uA24o4ffHAaOA9YFOwBLgDWA8MDl13O7AMUBTO/OpBZhQrTDFh1hfBx5yTHgocGuNQv0NGJnz+VxgI2CF5zyHALfU8eKNBP6e8/k5QiwbtgNequF3LwdOsYwtBHrK35sCb67Gxaq5WmGAi1idgP8CvT0mXAeYX1CYXsp3F8rcPsTqDCwA1qrjhTtVbnIW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'
		doc.setFontSize(30)
		doc.addImage(imgData, 'PNG', 48, 0, 150, 40)
		doc.setFont("times");
	doc.setFontType("italic");
	doc.setFontSize(15)
	doc.setTextColor("#808080")
	doc.text("PAYSLIP"+'\n'+payslip_name_print, 450,25);

//	doc.text('Col and row span', 40, 50);
	var html = "<div>"+tablecontent+"</div>";
	var wrapper = document.createElement("div");

	wrapper.innerHTML = html;
	var table = wrapper.getElementsByTagName("table")[0];
	var res = doc.autoTableHtmlToJson(table);
	doc.autoTable(res.columns, res.data, {
		startY: 60,
		styles: {
			//font: "courier",
			fontSize: 8,
			// overflow: "linebreak",
			rowHeight: 18,
			cellPadding: 4,
			halign: "left",
			// autoSize : true
		},

		/*drawHeaderRow: function () {
          return true;
      },*/
		drawCell: function (cell, data) {
			// if (data.column.index == 1) {                    
			//   cell.styles.halign = 'center';
			//}     
			if(data.row.index<4){       
				doc.setFontStyle('bold');
			}
			doc.setFillColor(255, 255, 255);
			/*  if (data.row.index == data.table.rows.length - 7) {
  		doc.setFontStyle('bold');
  		   doc.setFillColor(33, 150, 243);
              }
  if (data.row.index == data.table.rows.length - 1) {
  		doc.setFontStyle('bold'); 
  		 columnStyles: {
         }
  		//doc.setFontSize(8);
              }
  if (data.row.index == data.table.rows.length - 2) {
		doc.setFontStyle('bold');                
            }*/

		}      

	});

	var table = wrapper.getElementsByTagName("table")[1];
	var res = doc.autoTableHtmlToJson(table);
	doc.autoTable(res.columns, res.data, {
		startY: doc.autoTableEndPosY() + 20,
		styles: {
			//font: "courier",
			fontSize: 8,
			// overflow: "linebreak",
			rowHeight: 18,
			cellPadding: 4,
			halign: "left",
			//columnWidth: 190,
			// autoSize : true
		},
		
		

		drawCell: function (cell, data) {
			if(data.row.index<4){       
				doc.setFontStyle('bold');
			}
			doc.setFillColor(255, 255, 255);
		}      

	});

	var table = wrapper.getElementsByTagName("table")[2];
	var res = doc.autoTableHtmlToJson(table);
	doc.autoTable(res.columns, res.data, {
		startY: doc.autoTableEndPosY() + 20,
		styles: {
			//font: "courier",
			fontSize: 8,
			// overflow: "linebreak",
			rowHeight: 18,
			cellPadding: 4,
			halign: "left",
			// fillColor :250,
			// autoSize : true
		},
		drawHeaderCell: function (cell, data) {
			if (data.column.dataKey == 1 || data.column.dataKey == 3) {
            cell.styles.halign = 'right';
    }
           
        },
		drawCell: function (cell, data) {
			if(data.row.index<8){       
				doc.setFontStyle('bold');
				//cell.styles.halign = 'right'
			}
			var col = data.column.index;
            if(col==1 || col==3){
                cell.styles.halign = 'right';
            }
			doc.setFillColor(255, 255, 255);
			/*if (data.row.index == data.table.rows.length - 10) {
  		doc.setFontStyle('bold');
  		   doc.setFillColor(33, 150, 243);
              }*/

			if (data.row.index == data.table.rows.length - 1) {
				doc.setFontStyle('bold'); 
				columnStyles: {
				}
				//doc.setFontSize(8);
			}
			if (data.row.index == data.table.rows.length - 2) {
				doc.setFontStyle('bold');                
			}
			if (data.row.index == data.table.rows.length - 3) {
				doc.setFontStyle('bold');                
			}
			if (data.row.index == data.table.rows.length - 4) {
				doc.setFontStyle('bold');                
			}
			if (data.row.index == data.table.rows.length - 5) {
				doc.setFontStyle('bold');                
			}

		}      

	}); 
	//var res2 = doc.autoTableHtmlToJson(document.getElementById("tbl2"), true);
	//doc.autoTable(res2.columns, res2.data, {margin: {top: 80}});
	var calc_table = wrapper.getElementsByTagName("table")[3];
	var calc_res = doc.autoTableHtmlToJson(calc_table);
	doc.autoTable(calc_res.columns, calc_res.data, {
		theme: 'plain',
		startY: doc.autoTableEndPosY() + 20,
		styles: {
			//font: "courier",
			fontSize: 8,
			// overflow: "linebreak",
			rowHeight: 18,
			cellPadding: 4,
			halign: "left",
			// autoSize : true
		},
		headerStyles: {
			//lineWidth: 1,
			// lineColor: [255, 0, 0]
		},

		drawHeaderRow: function () {
			return true;
		},
		drawCell: function (cell, data) {
			// if (data.column.index == 1) {                    
			//   cell.styles.halign = 'center';
			//}     
			
			if(data.row.index<4){       
				doc.setFontStyle('bold');
			}
			doc.setFillColor(255, 255, 255);
			if (data.row.index == data.table.rows.length - 7) {
				doc.setFontStyle('bold');
				doc.setFillColor(33, 150, 243);
			}
			if (data.row.index == data.table.rows.length - 1) {
				doc.setFontStyle('bold'); 
				columnStyles: {
				}
				//doc.setFontSize(8);
			}
			if (data.row.index == data.table.rows.length - 2) {
				doc.setFontStyle('bold');                
			}
			

		}          

	});

	var table = wrapper.getElementsByTagName("table")[4];
	var res = doc.autoTableHtmlToJson(table);
	doc.autoTable(res.columns, res.data, {
		startY: doc.autoTableEndPosY() + 20,
		styles: {
			//font: "courier",
			fontSize: 8,
			// overflow: "linebreak",
			rowHeight: 18,
			cellPadding: 4,
			halign: "left",
			// autoSize : true
		},

		/*drawHeaderRow: function () {
          return true;
      },*/
		drawCell: function (cell, data) {
			// if (data.column.index == 1) {                    
			//   cell.styles.halign = 'center';
			//}     
			if(data.row.index<4){       
				doc.setFontStyle('bold');
			}
			doc.setFillColor(255, 255, 255);
		}      

	}); 
	var table = wrapper.getElementsByTagName("table")[5];
	var res = doc.autoTableHtmlToJson(table);
	doc.autoTable(res.columns, res.data, {
		startY: doc.autoTableEndPosY() + 20,
		styles: {
			//font: "courier",
			fontSize: 8,
			// overflow: "linebreak",
			rowHeight: 18,
			cellPadding: 4,
			halign: "left",
			// autoSize : true
		},

		/*drawHeaderRow: function () {
          return true;
      },*/
		drawCell: function (cell, data) {
			// if (data.column.index == 1) {                    
			//   cell.styles.halign = 'center';
			//}     
			if(data.row.index<4){       
				doc.setFontStyle('bold');
			}
			doc.setFillColor(255, 255, 255);
		}      

	});
	var table = wrapper.getElementsByTagName("table")[6];
	var res = doc.autoTableHtmlToJson(table);
	doc.autoTable(res.columns, res.data, {
		startY: doc.autoTableEndPosY() + 20,
		styles: {
			//font: "courier",
			fontSize: 8,
			// overflow: "linebreak",
			rowHeight: 18,
			cellPadding: 4,
			halign: "left",
			// autoSize : true
		},

		/*drawHeaderRow: function () {
          return true;
      },*/
		drawCell: function (cell, data) {
			// if (data.column.index == 1) {                    
			//   cell.styles.halign = 'center';
			//}     
			if(data.row.index<4){       
				doc.setFontStyle('bold');
			}
			doc.setFillColor(255, 255, 255);
		}      

	});
	 var table = wrapper.getElementsByTagName("table")[7];
    var res = doc.autoTableHtmlToJson(table);
    doc.autoTable(res.columns, res.data, {
    	startY: doc.autoTableEndPosY() + 20,
  	styles: {
         //font: "courier",
         fontSize: 8,
         // overflow: "linebreak",
         rowHeight: 18,
         cellPadding: 4,
         halign: "left",
        	// autoSize : true
       },


   drawHeaderRow: function () {
          return true;
      },
     drawCell: function (cell, data) {
             // if (data.column.index == 1) {                    
               //   cell.styles.halign = 'center';
              //}     
  if(data.row.index<4){       
  doc.setFontStyle('bold');
  }
  doc.setFillColor(255, 255, 255);
          }      

      });
	  var table = wrapper.getElementsByTagName("table")[8];
    var res = doc.autoTableHtmlToJson(table);
    doc.autoTable(res.columns, res.data, {
    	theme: 'plain',
    	startY: doc.autoTableEndPosY() + 20,
    	styles: {
            //font: "courier",
            fontSize: 8,
            // overflow: "linebreak",
            rowHeight: 18,
            cellPadding: 4,
            halign: "center",
            fontStyle: '0',
           	// autoSize : true
          },

   /*drawHeaderRow: function () {
          return true;
      },*/
     drawCell: function (cell, data) {
             // if (data.column.index == 1) {                    
               //   cell.styles.halign = 'center';
              //}     
  if(data.row.index<4){       
  //doc.setFontStyle('bold');
  }
  if (data.row.index == data.table.rows.length - 2) {
		doc.setFontStyle('bold'); 
		doc.setFontSize(10);
  }
  doc.setFillColor(255, 255, 255);
          }      

      });
	doc.save('Payslip of '+payslip_emp_name+' for '+payslip_name_print+'.pdf');
}

var now = new Date();
var jsDate = now.getDate()+'-'+(now.getMonth()+1)+'-'+now.getFullYear();
//Datatable with button function
function plaindatatable_in_payslip(tbl_name, data_list, tbl_columns, hidden_col,filename,title_name) {
	if ($.fn.DataTable.isDataTable('#'+tbl_name)) {
		$('#'+tbl_name).DataTable().destroy();
	} 
	if (hidden_col.length != undefined) {
		hidden_col_colvis = hidden_col.length -1;
	} else {
		hidden_col_colvis = hidden_col
	}
	var table = $("#"+tbl_name);
	mytable = table.dataTable({
		autoWidth: false,
		columns: tbl_columns,
		data: data_list,
		"bDestroy": true,
		language: {
			aria: {
				sortAscending: ": activate to sort column ascending",
				sortDescending: ": activate to sort column descending"
			},
			emptyTable: "No data available",
			info: "Showing _START_ to _END_ of _TOTAL_ entries",
			infoEmpty: "No entries found",
			infoFiltered: "(filtered1 from _MAX_ total entries)",
			lengthMenu: "_MENU_ entries",
			search: "",
			zeroRecords: "No matching records found"
		},
		buttons: [{
			extend: 'collection',
			className: "exporticon",
			title: filename,
			text: 'Export',
			buttons: [{
				extend: "pdf",
				className: "pdficon",
				exportOptions: {
					columns: ':visible'
				},
				customize: function (doc) { pageNumberPDF(doc,tbl_columns,title_name) }
			}, {
				extend: "excel",
				className: "excelicon",
				title: filename,
				exportOptions: {
					columns: ':visible'
				},
				customize: function(xlsx) { pageHeaderExcel(xlsx,table.fnGetData().length) }
			}, {
				extend: "csv",
				className: "csvicon",
				title: filename,
				exportOptions: {
					columns: ':visible'
				},
				customize: function (csv) {
					return "My header NEXT Inc.\n\n NEXT Inc.\n"+  csv;
				}
			}],
		},{
			extend: "print",
			className: "printicon",
			exportOptions: {
				columns: ':visible'
			},
			message: '<p style="text-align:center;"><img src="data:image/png;base64,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/GMzLdsAAERIaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/Pgo8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzA2NyA3OS4xNTc3NDcsIDIwMTUvMDMvMzAtMjM6NDA6NDIgICAgICAgICI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgICAgICAgICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICAgICAgICAgICB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIKICAgICAgICAgICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgICAgICAgICAgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiCiAgICAgICAgICAgIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIj4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNSAoV2luZG93cyk8L3htcDpDcmVhdG9yVG9vbD4KICAgICAgICAgPHhtcDpDcmVhdGVEYXRlPjIwMTUtMTAtMTVUMTQ6NTQ6MDIrMDU6MzA8L3htcDpDcmVhdGVEYXRlPgogICAgICAgICA8eG1wOk1ldGFkYXRhRGF0ZT4yMDE4LTAxLTA1VDEyOjE0OjEzKzA1OjMwPC94bXA6TWV0YWRhdGFEYXRlPgogICAgICAgICA8eG1wOk1vZGlmeURhdGU+MjAxOC0wMS0wNVQxMjoxNDoxMyswNTozMDwveG1wOk1vZGlmeURhdGU+CiAgICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2UvcG5nPC9kYzpmb3JtYXQ+CiAgICAgICAgIDx4bXBNTTpJbnN0YW5jZUlEPnhtcC5paWQ6MGRiNTUxYjgtMzBkMC02YTQyLTllMDAtZTQwODQzYTNhNTcxPC94bXBNTTpJbnN0YW5jZUlEPgogICAgICAgICA8eG1wTU06RG9jdW1lbnRJRD5hZG9iZTpkb2NpZDpwaG90b3Nob3A6YzFiZTU2N2ItZTU4NC0xMWU3LWJkYWMtZjZhNTBlMjg1MTg5PC94bXBNTTpEb2N1bWVudElEPgogICAgICAgICA8eG1wTU06T3JpZ2luYWxEb2N1bWVudElEPnhtcC5kaWQ6YzQ2ZjQyMWEtYWZhYi1lYjQ5LWE3NmItNmU2MmUxMzg3ZGI3PC94bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpIaXN0b3J5PgogICAgICAgICAgICA8cmRmOlNlcT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+Y3JlYXRlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOmM0NmY0MjFhLWFmYWItZWI0OS1hNzZiLTZlNjJlMTM4N2RiNzwvc3RFdnQ6aW5zdGFuY2VJRD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OndoZW4+MjAxNS0xMC0xNVQxNDo1NDowMiswNTozMDwvc3RFdnQ6d2hlbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnNvZnR3YXJlQWdlbnQ+QWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKTwvc3RFdnQ6c29mdHdhcmVBZ2VudD4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6YWN0aW9uPnNhdmVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDppbnN0YW5jZUlEPnhtcC5paWQ6ODA3NjRjMGMtZGMxNi05YTRjLTljOWItODI5NjE5NTk5ZGY5PC9zdEV2dDppbnN0YW5jZUlEPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6d2hlbj4yMDE1LTEwLTE1VDE1OjAwOjM4KzA1OjMwPC9zdEV2dDp3aGVuPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6c29mdHdhcmVBZ2VudD5BZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpPC9zdEV2dDpzb2Z0d2FyZUFnZW50PgogICAgICAgICAgICAgICAgICA8c3RFdnQ6Y2hhbmdlZD4vPC9zdEV2dDpjaGFuZ2VkPgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+c2F2ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0Omluc3RhbmNlSUQ+eG1wLmlpZDplMmQxMzE5Mi1mOTQ0LWI1NGMtYTAwNy1kZGE1OGE1ZGMzMTY8L3N0RXZ0Omluc3RhbmNlSUQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDp3aGVuPjIwMTYtMDUtMjVUMTk6NDk6MjgrMDU6MzA8L3N0RXZ0OndoZW4+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpzb2Z0d2FyZUFnZW50PkFkb2JlIFBob3Rvc2hvcCBDQyAoV2luZG93cyk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpjaGFuZ2VkPi88L3N0RXZ0OmNoYW5nZWQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5jb252ZXJ0ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnBhcmFtZXRlcnM+ZnJvbSBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIHRvIGltYWdlL3BuZzwvc3RFdnQ6cGFyYW1ldGVycz4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6YWN0aW9uPmRlcml2ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnBhcmFtZXRlcnM+Y29udmVydGVkIGZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9wbmc8L3N0RXZ0OnBhcmFtZXRlcnM+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5zYXZlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOjM5OWQ1NWI1LTZlMTctMTg0ZC04YTI1LTNmMGJjZDE4ZTk2YTwvc3RFdnQ6aW5zdGFuY2VJRD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OndoZW4+MjAxNi0wNS0yNVQxOTo0OToyOCswNTozMDwvc3RFdnQ6d2hlbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnNvZnR3YXJlQWdlbnQ+QWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKTwvc3RFdnQ6c29mdHdhcmVBZ2VudD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmNoYW5nZWQ+Lzwvc3RFdnQ6Y2hhbmdlZD4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6YWN0aW9uPnNhdmVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDppbnN0YW5jZUlEPnhtcC5paWQ6MGRiNTUxYjgtMzBkMC02YTQyLTllMDAtZTQwODQzYTNhNTcxPC9zdEV2dDppbnN0YW5jZUlEPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6d2hlbj4yMDE4LTAxLTA1VDEyOjE0OjEzKzA1OjMwPC9zdEV2dDp3aGVuPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6c29mdHdhcmVBZ2VudD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNSAoV2luZG93cyk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpjaGFuZ2VkPi88L3N0RXZ0OmNoYW5nZWQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICA8L3JkZjpTZXE+CiAgICAgICAgIDwveG1wTU06SGlzdG9yeT4KICAgICAgICAgPHhtcE1NOkRlcml2ZWRGcm9tIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgPHN0UmVmOmluc3RhbmNlSUQ+eG1wLmlpZDplMmQxMzE5Mi1mOTQ0LWI1NGMtYTAwNy1kZGE1OGE1ZGMzMTY8L3N0UmVmOmluc3RhbmNlSUQ+CiAgICAgICAgICAgIDxzdFJlZjpkb2N1bWVudElEPnhtcC5kaWQ6YzQ2ZjQyMWEtYWZhYi1lYjQ5LWE3NmItNmU2MmUxMzg3ZGI3PC9zdFJlZjpkb2N1bWVudElEPgogICAgICAgICAgICA8c3RSZWY6b3JpZ2luYWxEb2N1bWVudElEPnhtcC5kaWQ6YzQ2ZjQyMWEtYWZhYi1lYjQ5LWE3NmItNmU2MmUxMzg3ZGI3PC9zdFJlZjpvcmlnaW5hbERvY3VtZW50SUQ+CiAgICAgICAgIDwveG1wTU06RGVyaXZlZEZyb20+CiAgICAgICAgIDxwaG90b3Nob3A6Q29sb3JNb2RlPjM8L3Bob3Rvc2hvcDpDb2xvck1vZGU+CiAgICAgICAgIDxwaG90b3Nob3A6SUNDUHJvZmlsZT5zUkdCIElFQzYxOTY2LTIuMTwvcGhvdG9zaG9wOklDQ1Byb2ZpbGU+CiAgICAgICAgIDxwaG90b3Nob3A6RG9jdW1lbnRBbmNlc3RvcnM+CiAgICAgICAgICAgIDxyZGY6QmFnPgogICAgICAgICAgICAgICA8cmRmOmxpPjI3OTVCQ0Y1MjZBMEQ1ODI0MkVDRkI4MUM5QTEzMjA0PC9yZGY6bGk+CiAgICAgICAgICAgICAgIDxyZGY6bGk+eG1wLmRpZDo5MTI1N2VkYy00OTdjLTk0NDEtYWZhMS03NTVhODQxM2I2NzM8L3JkZjpsaT4KICAgICAgICAgICAgICAgPHJkZjpsaT54bXAuZGlkOmM0NmY0MjFhLWFmYWItZWI0OS1hNzZiLTZlNjJlMTM4N2RiNzwvcmRmOmxpPgogICAgICAgICAgICA8L3JkZjpCYWc+CiAgICAgICAgIDwvcGhvdG9zaG9wOkRvY3VtZW50QW5jZXN0b3JzPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpYUmVzb2x1dGlvbj43MjAwMDAvMTAwMDA8L3RpZmY6WFJlc29sdXRpb24+CiAgICAgICAgIDx0aWZmOllSZXNvbHV0aW9uPjcyMDAwMC8xMDAwMDwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6UmVzb2x1dGlvblVuaXQ+MjwvdGlmZjpSZXNvbHV0aW9uVW5pdD4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT4xPC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDxleGlmOlBpeGVsWERpbWVuc2lvbj42OTwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj42MDwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgIAo8P3hwYWNrZXQgZW5kPSJ3Ij8+V0IgzQAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAARu0lEQVR42uSbfaykVX3HP+ecZ95n7vsuLOCuhcKiWAEj2Koh9sVUTEwES2ippLFW/9CyuGBVRKJVY0w1sW1MaEzaGmMaggK7S3mzCIIUq5SXvQvsK8uy7y935869M3fuzDwvp3+c88yceeaZ+6Jla+okJ8/cyZ25z/nO7/f9fn+/37lCa83t9z/LUo8cIS0U/xi+lQUyQ38vIyEjICchKyGnoKSgYFcxXp55Pb7GzyselLze7xUUFKS55mTvc7P272QkKEAKEM59hJEm1Bo/Aj/StENNy652CG3nNT+CZhAxkZOXqdHCjze/wITHb+BD26sUEGk9eVYpc2e1FV73ibsOcKQW1eVvIijSALLWD7lzLJ+Zqbai6z75o2McqQYwnuM3JlJEnGaCqyLNpxq+vqaY85hphWx65AiHZwOYLADi/zcoAhACT8C7NVwXRFzTCvS6Wjsin/WotUNufuQwB6s+TBZBC5BnABTtXPWQn4etYZ+1xGME+G0JF4dwmYa3hxFXdCLKC4Gm4Wtm2xEjhQzVVsCmhw/x2owPUzEg0qC4ko1FCHJEVPBZ0BkQVIBrbXoGaQAstRm9zLebAoYAlAAPyAIFoCSg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"></p><p style="text-align:center;">Date : '+jsDate.toString()+' </p>',
			customize: function (win) {
				$body = $(win.document.body);
				$body.find('h1').css('text-align', 'center');
			}
		}, {
			extend: "copy",
			className: "copyicon",
			exportOptions: {
				columns: ':visible'
			}
		},  {
			extend: "colvis",
			className: "colvisicon",
			text: "Columns",
			columns: ':gt('+2+')'
		}],
		"aoColumnDefs": [ {"sClass": "dt_col_hide", "aTargets": [0,8,9]}],//Hiding the Column
		responsive: false,
		//responsive: !0,
		order: [[0, "desc"]],
		lengthMenu: [[5, 10, 15, 20, -1], [5, 10, 15, 20, "All"]],
		pageLength: 5,
		//dom: "<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>"
		dom: "<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-12'><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-6 col-sm-12'i><'col-md-6 col-sm-12'lp>>",
	});

	if (!table.fnGetData().length) {
		$("#"+tbl_name).dataTable().fnDestroy();
		$("#"+tbl_name).DataTable( {
			autoWidth: false,
			columns: tbl_columns,
			searching: false,
			lengthChange: false,
			language: {
				emptyTable: "No data available"
			},
			//columnDefs: [{ "visible": false, "targets": hidden_col }],
			"aoColumnDefs": [ {"sClass": "dt_col_hide", "aTargets": [0,8,9]}],//Hiding the Column
		});
	}
	$('.exporticon').attr('title','EXPORT');
	$('.printicon').attr('title','Print');
	$('.copyicon').attr('title','Copy to clipboard');
	$('.colvisicon').attr('title','Column Visibility');
	$('.dataTables_length').addClass('dateTables_length_custom');
	$('.dataTables_paginate').addClass('dateTables_pagination_custom');
	
}

// Payslip Email functionality
function payslip_email_button(){
	var email_values = [];
	var print_email_data = [];
	var oTable = $("#payslip_details").dataTable();
	//Function For Checkbox Checked Value For Deletion
	$("input:checkbox:checked", oTable.fnGetNodes()).each(function() {
				var strAppend = ''
					strAppend = $(this).closest('tr').find('td').eq(0).text()+','
					email_values.push(strAppend.slice(0,-1));
			}).get();
//	$.each($("input[name='payslip_chkbox']:checked").closest("tr").find('td:eq(0)'),
//			function () {
//		print_values.push($(this).text());
//	});
	email_values.forEach(function(value,index)
			{
		print_email_data.push(email_values[index])
			})
			var email_table_id = Array.from(new Set(print_email_data))
			if(email_table_id){
				$.ajax({	
					type  : 'GET',
					url   : '/hr_payslip_email_send/',
					data:{'email_payslip_id':JSON.stringify(email_table_id),csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()},
					async : false,
				}).done( function(json_data) {
					data = JSON.parse(json_data);
					if(data.email_response.response == 'Email Success'){
						alert_lobibox("success", "Email Send Successfully")
					}else{
						alert_lobibox("error", "Email Send Failure")
					}

				});
			}else{
				alert_lobibox("error", "Please Select One Record For Send Email")
			}
	
	
}



