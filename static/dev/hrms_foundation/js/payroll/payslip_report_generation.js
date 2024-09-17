var emp_columns = [{"title":"ID"}, {"title":"No."}, {"title":"Employee Name"}, {"title":"Organization"},{"title":"payslip_id"}];
$(document).ready(function(){
	employee_details_table("/payslip_report_list/",{'id':0},0);
		//   employeeReportData("/hrms_employee_report_list/",{'id':0},0);
			$('#employee_searchtags').tagsinput({
			    allowDuplicates: false,
			    itemValue: 'id',  // this will be used to set id of tag
			    itemText: 'label', // this will be used to set text of tag
			    freeInput: false,
			});
			
});

//employee report table data 
function employee_details_table(urls,datas,id){
	$.ajax({
		url : urls,
		type : "GET",
		data : datas,
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		if(data.payslip_report_data){
			if(data.payslip_report_data.length > 0){
				for(var i=0;i<data.payslip_report_data.length;i++){
					console.log("hrms_payslip_path",hrms_payslip_path)
					var file_name = '<span id="report_download"><a  title="Download Offer" class="btn btn-success btn-eql-wid btn-animate" id="report_export" href="'
						+hrms_payslip_path+'Payslip_report_2018-08-14 03:08:41.976.xls' //hrms_payslip_path+data.payslip_report_data[i].file_name//data.payslip_report_data[i].file_full_path
						//+ data.payslip_report_data[i].file_name
						+ '" download="'
						+ "Payslip_report_2018-08-14 03:08:41.976.xls"//data.payslip_report_data[i].file_name
						+ '"><i class="offer_report nf nf-download"></i></a></span>';
					console.log("file_name",file_name)
					$('#payslip_export').html(file_name);
					$('#report_export')[0].click(); // Works too!!!
				}
			}
		}
		
		if(id == 0 ){
			plaindatatable_btn("payslip_report_details",[],emp_columns,[0,4]);
		}else{
			plaindatatable_btn("payslip_report_details",data.org_employee_data,emp_columns,[0,4],'NEXT_TRANSFORM_HCMS_DOW_EMPLOYEE_'+currentDate());
		}
	});
}

//table row click get id
$("#payslip_report_details").on("click", "tr", function() {   
	
	//reg_table_id = id
	if (id != 'No data available'){
		var id = $('#payslip_report_details').dataTable().fnGetData(this)[0];
		var payslip_id = $('#payslip_report_details').dataTable().fnGetData(this)[4];
		payslip_report_table_row_click(id,payslip_id);
	}
});

function payslip_report_table_row_click(id,payslip_id){
	$("#payslip_report_div").empty()
	if (payslip_id != null){
	$('#payslip_report_add_modal').modal('show');
	$.ajax(
			{
				url : '/payslip_report_table_row_click/',
				type : 'GET',
				timeout : 10000,
				data:{'employee_id':id,'payslip_id':payslip_id},
				async:false,
			}).done(
					function(json_data)
					{
						var data = JSON.parse(json_data);
						data_value=[]
						list_length=''
							var base_amount_emp = 0
							var total_earning_val = 0

//							Employee Allowance and Deduction Details
							if(data.exp_details.length > 0){
								if(data.exp_details.length){
									for(var i=0;i<data.exp_details.length;i++){
										earning_list=[]
										deduction_list=[]
										var employee_name_list = []
										var department_name_list = []
										var matrix_id_list = []
										var provident_fund_no_list = []
										var payslip_date_list = []
										var designation_list = []
										var date_of_joining_list = []
										var worked_days_list = []
										var lop_days_list = []
										var special_allowance = [];
										var ifsc_code_list = []
										var bank_name_list = []
										var company_name_list = []
										var company_address_list = []
										var branch_name_list = []
										var account_no_list = []
										var pf_no_list = []
										var payslip_from_date_list = []
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

										}
										/*for (var s=0;s<data.exp_details[i].company_data_val.length;s++){
											console.log("ggggggggggggggg",data.exp_details[i].company_data_val)
											company_name_list.push(data.exp_details[i].company_data_val[s].company_name)
											company_address_list.push(data.exp_details[i].company_data_val[s].company_address)

										}*/
										for (var s=0;s<data.exp_details[i].payment_details.length;s++){
											ifsc_code_list.push(data.exp_details[i].payment_details[s].ifsc_code)
											bank_name_list.push(data.exp_details[i].payment_details[s].bank_name)
											company_name_list.push(data.exp_details[i].payment_details[s].company_name)
											company_address_list.push(data.exp_details[i].payment_details[s].company_address)
											branch_name_list.push(data.exp_details[i].payment_details[s].branch_name)
											account_no_list.push(data.exp_details[i].payment_details[s].account_no)
											pf_no_list.push(data.exp_details[i].payment_details[s].pf_number)
											/*date_of_joining_list.push(data.exp_details[i].employee_data_val[v].date_of_joining)
											worked_days_list.push(data.exp_details[i].employee_data_val[v].worked_days)
											lop_days_list.push(data.exp_details[i].employee_data_val[v].lop_days)*/

										}
										base_amount_emp = data.exp_details[i].ctc_amount
										data_value.push({'earning_list':earning_list,'deduction_list':deduction_list,'ctc_amount':data.exp_details[i].ctc_amount,
											'employee_name_list':employee_name_list,'department_name_list':department_name_list,'matrix_id_list':matrix_id_list,
											'provident_fund_no_list':provident_fund_no_list,'payslip_date_list':payslip_date_list,'designation_list':designation_list,
											'date_of_joining_list':date_of_joining_list,'worked_days_list':worked_days_list,'lop_days_list':lop_days_list,
											'payslip_from_date_list':payslip_from_date_list,'company_name_list':company_name_list,'company_address_list':company_address_list,
											'ifsc_code_list':ifsc_code_list,'bank_name_list':bank_name_list,'branch_name_list':branch_name_list,'account_no_list':account_no_list,'pf_no_list':pf_no_list})
									}
								}
							}
							else{
								$("#payslip_report_div").append("No Data Available")
							}
						var payslip_print_data=[]
						for(k=0;k<data_value.length;k++){
							var payslip_emp_name = '';
							var payslip_name_print = ''
								TableContent=''
									var special_allw_amt=0
									var earnings_total_value = 0
									var deduction_total_value = 0
									var net_salary = 0
									TableContent += "<div id='Table_export'>"
										TableContent += "<table id='payslip_print_table_emp' width='100%' border='0'>"
											for(m=0;m<data_value[k].employee_name_list.length;m++)
											{
												payslip_emp_name = data_value[k].employee_name_list[m]
												payslip_name_print = data_value[k].payslip_date_list[m]
												payslip_from_date = data_value[k].payslip_from_date_list[m]
												//TableContent += "<tr><td></td><td><p style='text-align: center;'> <b>Payslip for :"+data_value[k].payslip_date_list[m] +"</b></p></td><td></td><td></td></tr>"
												TableContent += '<table class="table employee-info" width="100%" border="0">'
												/*TableContent += "<tr><td><p style='text-align: center;'> <b>Employee Information</b></p></td><td></td><td></td><td></td></tr>"*/
												TableContent += "<tr  style='background-color:#1aa3ff;color:#fafafa'><th colspan=4> <b>Employee Information</b></th></tr>"
												TableContent+="<tr><td><b>Employee Name	  </b>"+data_value[k].employee_name_list[m]+" </td><td></td><td></td> <td><b>Department Name     </b>"+data_value[k].department_name_list[m]+"</td></tr></br>"
													TableContent+="<tr><td><b>Designation	         </b>"+data_value[k].designation_list[m]+" </td><td></td><td></td>  <td><b>Employee ID	      </b>"+data_value[k].matrix_id_list[m]+"</td></tr></br>"
													TableContent+="<tr><td><b>Date of Joining	   </b>"+data_value[k].date_of_joining_list[m]+" </td> <td></td><td></td> <td><b>PF No	                 </b>"+"9787"+"</td></tr></br>"
													//TableContent+="<tr><td><b>Worked Days	: </b>"+data_value[k].worked_days_list[m]+" </td><td></td><td></td>  <td><b>LOP Days	: </b>"+data_value[k].lop_days_list[m]+"</td></tr></br>"

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
								//TableContent += "<table id='payslip_print_table_emp_work_days' width='100%' border='1'>"
								TableContent += '<table class="table" width="100%" border="0">'
									TableContent += "<tr  style='background-color:#1aa3ff;color:#fafafa'><th colspan=4> <b>Work Days</b></th></tr>"
									for(var n=0;n<data_value[k].worked_days_list.length;n++){
										total_work_days = parseInt(data_value[k].worked_days_list[n]) + parseInt(data_value[k].lop_days_list[n])
										//TableContent += "<tr><td>Work Days</td><td></td><td></td><td></td></tr>"
											TableContent+="<tr><td><b>Total Worked Days	 </b>"+total_work_days+" </td><td></td><td><b>LOP Days	 </b>"+data_value[k].lop_days_list[n]+"</td><td><b>Effective Work Days	 </b>"+data_value[k].worked_days_list[n]+"</td></tr></br>"
									}
							TableContent += "</table>"
//								Common List For Earning List
								if(data_value[k].earning_list.length >= data_value[k].deduction_list.length){
									list_length=data_value[k].earning_list.length
								}else{
									list_length=data_value[k].deduction_list.length
								}
//							Table Append Functionality
							TableContent += "<table class='table' width='100%' border='0'>"
								TableContent +="<tr>"
									TableContent += "<p><th  style='background-color:#1aa3ff;color:#fafafa'>Earnings</th><th style='background-color:#1aa3ff;color:#fafafa'>Amount</th><th style='background-color:#1aa3ff;color:#fafafa'>Deductions</th><th style='background-color:#1aa3ff;color:#fafafa'>Amount</th></p>"
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
													TableContent += "</td><td>" +data_value[k].deduction_list[i].salary_rule_name+ "</td><td>"+data_value[k].deduction_list[i].assignment_value+"</td>"
													deduction_total_value = deduction_total_value + data_value[k].deduction_list[i].assignment_value
												}else{
													TableContent += "<td>" +''+ "</td><td>"+''+ "</td>"
												}
												TableContent +="</tr>"

											}
							special_allw_amt = Math.round(data.exp_details[k].special_allowance)
							total_earning_val = earnings_total_value + special_allw_amt
							TableContent +="<tr><td><b>Special Allowance </b></td><td><b>"+special_allw_amt +"</b></td><</tr>"
							TableContent +="<tr><td><b>TOTAL EARNINGS  </b></td><td><b>"+total_earning_val +"</b></td><td><b>TOTAL DEDUCTION  </b></td><td><b>"+deduction_total_value +"</b></td></tr>"
							//TableContent += "</table>"
							net_salary = total_earning_val - deduction_total_value
							//TableContent += "<tr></tr>"
							//TableContent += "<tr><td><b>NET SALARY            "+net_salary +" "+" Rupees "+" "+numberToWords.toWordsOrdinal(net_salary)+" Only </b></td></tr>"
							TableContent += "</table><br>"
								TableContent += "<table id='payslip_print_table_net' width='100%' border='0'>"
									TableContent += "<tr><td><b>NET SALARY            "+net_salary +" "+"        Rupees "+" "+numberToWords.toWordsOrdinal(net_salary)+" Only </b></td></tr>"
									//TableContent += "<tr><td><p style='text-align: center;'> <b>Net Salary</b></p></td><td></td><td></td><td></td></tr>"
									TableContent += "</table>"
										/*TableContent += "<table id='payslip_print_table_emp_pf' width='100%' border='1'>"
											TableContent += "<tr><td><p style='text-align: center;'> <b>Employer Direct Contributions</b></p></td><td></td><td></td><td></td></tr>"
												TableContent+="<tr><td><b>PF Contribution	  </b>"+"0"+" </td><td></td><td></td>  <td><b>ESI Contribution	  </b>"+"0"+"</td></tr></br>"
												TableContent += "</table>"
													TableContent += "<table id='payslip_print_table_emp_ytd' width='100%' border='1'>"
														TableContent += "<tr><td style='width:100%;'><p style='text-align: center;'> <b>Your Performance Rewards (YTD)</b></p></td><td></td><td></td><td></td></tr>"
															TableContent+="<tr><td><b>Earned	  </b>"+"0"+" </td><td><b>Paid	  </b>"+"0"+"</td><td></td><td><b>Unpaid	  </b>"+"0"+"</td></tr></br>"
															TableContent += "</table>"
																//TableContent += "</table>"
																TableContent += "<table id='payslip_print_table_emp_emo' width='100%' border='1'>"
																	TableContent += "<tr><td><p style='text-align: center;'> <b>Year to Date Emoluments</b></p></td><td></td><td></td><td></td></tr>"
																		TableContent+="<tr><td><b>Earnings	  </b>"+"0"+" </td><td></td><td><b>Deductions	  </b>"+"0"+"</td><td><b>Net Salary	  </b>"+"0"+"</td></tr></br>"
																		TableContent += "</table>"
																			TableContent += "<table id='payslip_print_table_bank' width='100%' border='1'>"
															var bank_name = ''
															for(b=0;b<data_value[k].account_no_list.length;b++){
																TableContent += "<tr><td><p style='text-align: center;'> <b>Bank Transfer Details</b></p></td><td></td><td></td><td></td></tr>"
																TableContent+="<tr><td><b>Account No	        </b>"+data_value[k].account_no_list[b]+" </td><td></td><td></td> <td><b>Account Name                  </b>"+payslip_emp_name+"</td></tr></br>"
																if (data_value[k].bank_name_list[b] == '1'){
																	bank_name = 'IOB'
																}
																else if (data_value[k].bank_name_list[b] == '2'){
																	bank_name = 'SBI'
																}
																else
																	{
																	bank_name = 'AXIS'
																	}
																TableContent+="<tr><td><b>Bank Name	         </b>"+bank_name+" </td><td></td><td></td>  <td><b>IFSC	                            </b>"+data_value[k].ifsc_code_list[b]+"</td></tr></br>"
																TableContent+="<tr><td><b>Date of Transfer	 </b>"+fund_transfer_date+" </td> <td></td><td></td> <td><b>Amount Transferred	 </b>"+net_salary+"</td></tr></br>"
															}
																TableContent += "</table>"
																			TableContent += "<table id='payslip_print_table_address' width='100%' border='1'>"
																for(c=0;c<data_value[k].company_name_list.length;c++){
																TableContent += "<tr><td>* This is a computer generated Payslip,hence signature not required </td></tr>"
																	TableContent += "<tr><td> "+data_value[k].company_name_list[c]+" </td></tr>"
																		TableContent += "<tr><td "+data_value[k].company_address_list[c]+" </td></tr>"
																	//TableContent += "<tr><td><p style='text-align: center;'> <b>Net Salary</b></p></td><td></td><td></td><td></td></tr>"
																}
																TableContent += "</table>"*/
																			TableContent += "</div>"
																				payslip_print_data += TableContent
																				//$('#payslip_print_div').append(TableContent)
																				//$("#payslip_print_salary_computation").append(TableContent)
																				$('#payslip_report_div').append(TableContent)
																				//PDF(TableContent,payslip_emp_name,payslip_name_print)
						}
					})
}else{
	$('#payslip_report_add_modal').modal('show');
	$('#payslip_report_div').append("No data found")
}
}

//tags values 
function add_tags_values(){
	$('.tab1f .bootstrap-tagsinput input').val('');
	$('#employee_searchtags').tagsinput('removeAll');
	var org =  $("#organization_id  option:selected").val() != 0 ? $("#employee_searchtags").tagsinput('add', { id: 'organization_id', label: 'Organization' }):'';
	var org_unit =  $("#organization_unit_id  option:selected").val() != 0 ? $("#employee_searchtags").tagsinput('add', { id: 'organization_unit_id', label: 'Organization Unit' }):'';
	var fname = $('#employee_department').val() ? $("#employee_searchtags").tagsinput('add', { id: 'employee_department', label: "Department" }) : '';
	var lname = $('#report_employee_name').val() ? $("#employee_searchtags").tagsinput('add', { id: 'report_employee_name', label: "Employee" }) : '';
	//var gener =  $("#employee_gender  option:selected").val() != '0' ? $("#employee_searchtags").tagsinput('add', { id: 'employee_gender', label: 'Gender' }):'';
	//var emp_id = $('#employee_id').val() ? $("#employee_searchtags").tagsinput('add', { id: 'employee_id', label: "Employee ID" }) : '';
	//var role =  $("#employee_role  option:selected").val() != 0 ? $("#employee_searchtags").tagsinput('add', { id: 'employee_role', label: 'Role' }):'';
	//employee_report_search(0);
}

//org change
$("#organization_id").change(function() {
		org_unit($("#organization_id  option:selected").val())
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

//org unit change
$("#organization_unit_id").change(function() {
		department($("#organization_unit_id  option:selected").val())
});

//org unit
function department(val){
	$.ajax({
		url : "/hrms_department_change_structure_data/",
		type : "GET",
		data : {'id':val},
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		datas = JSON.parse(json_data);
		departmentdropDownList(datas.department_data,'employee_department');
	});
}

//drop down list
function departmentdropDownList(data,id){
		strAppend = '<option value="0">--Select Department--</option>'
		if(data.length>0){
			for(var i=0;i<data.length;i++){
				strAppend += '<option value="'+data[i].depart_id+'">'+data[i].depart_name+'</option>'
			}
			$('#'+id).html(strAppend).change();
		}else{
			$('#'+id).html(strAppend).change();
		}
}

//department change
$("#employee_department").change(function() {
		employee_select($("#employee_department  option:selected").val())
});

//
function employee_select(val){
	$.ajax({
		url : "/hrms_employee_change_data/",
		type : "GET",
		data : {'id':val},
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		datas = JSON.parse(json_data);
		employeedropDownList(datas.employee_data,'report_employee_name');
	});
}

//drop down list
function employeedropDownList(data,id){
		strAppend = '<option value="">--Select Employee --</option>'
		if(data.length>0){
			for(var i=0;i<data.length;i++){
				strAppend += '<option value="'+data[i].employee_id+'">'+data[i].employee_name+'</option>'
			}
			$('#'+id).html(strAppend).change();
		}else{
			$('#'+id).html(strAppend).change();
		}
}
//org unit
function employeeOrgUnitFunction(e){
	//add_tags_values();
}
//first name
function employeeDepartmentFunction(e){
	add_tags_values();
}
//last name
function employeeFunction(e){
	add_tags_values();
}
//gender
function employeeGenderFunction(e){
	add_tags_values();
}
//address
function employeeRoleFunction(e){
	add_tags_values();
}
//employee id
function employeeIDFunction(e){
	add_tags_values();
}

function payslip_report_search(status){
	if (payslip_report_form_validation() && $("#organization_id  option:selected").val() != 0){
		var employee_report_id_list = [];
		 $.each($("#report_employee_name option:selected"), function(){     
			 employee_report_id_list.push($(this).val());
	    });
		//var employee_id = $('#report_employee_name option:selected').val() != '0' ? $('#report_employee_name option:selected').val() : '';
		var department_id = $('#employee_department option:selected').val() != '0' ? $('#employee_department option:selected').val() : '';
		var org_unit_id = $('#organization_unit_id option:selected').val() != '0' ? $('#organization_unit_id option:selected').val() : '';
		var org_id = $('#organization_id option:selected').val() != '0' ? $('#organization_id option:selected').val() : '';
		var from = ($('#payslip_from').val() != undefined && $('#payslip_from').val() != '')? dateFormatChange($('#payslip_from').val()) : '';
		var to = ($('#payslip_to').val() != undefined && $('#payslip_to').val() != '')? dateFormatChange($('#payslip_to').val()) : '';
		employee_details_table("/payslip_report_list/",{'employee_id':JSON.stringify(employee_report_id_list),'department_id':department_id,'org_unit_id':org_unit_id,'from':from,'org_id':org_id,'to':to,'status':status},1);
		//alert_lobibox("success",sysparam_datas_list['NTE_58']);
	}else{
		plaindatatable_btn("payslip_report_details",[],emp_columns,[0,4]);
	}
}

//date format change
function dateFormatChange(val){
	return val.split('-')[2]+'-'+val.split('-')[1]+'-'+val.split('-')[0]
}

//form is valid or not
function payslip_report_form_validation()
{
	return $('#payslip_report_form').valid();
}

//Salary Contract form validation
$('#payslip_report_form').submit(function(e) {
	e.preventDefault();    
}).validate({
	rules: {
		organization_id: {
			required: true,
			valueNotEquals:true, 
		},   
		
	},
	//For custom messages
	messages: {
		organization_id: {
			required: "Select Organization",
			valueNotEquals:"Select Organization", 
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

$("#organization_id").change(function(){
	$(".errormessage").html('')
});

function payslip_report_clear(){
	document.getElementById("payslip_report_form").reset();
	$(".select2").val(0).trigger('change');
	plaindatatable_btn("payslip_report_details",[],emp_columns,[0,4]);
}

function report_generate(status){
	$("#payslip_export").hide();
	payslip_report_search(status)
}

//onload get values local storage
if((localStorage.getItem('id') != null) && (localStorage.getItem('id') != '')){
	var activeTabId = localStorage.getItem('id');
	
	var activeTabHeaderID = localStorage.getItem('data');
	get_tab_id = activeTabHeaderID
	$('.dBox').removeClass('active');
	var parentClass = $('#'+activeTabHeaderID).parent().addClass("active");
	localStorage.setItem('id', '');
	$('.report').removeClass('active');
	$('#'+activeTabId).addClass('active');
	console.log("+++++++++++++",activeTabHeaderID)
	if(activeTabHeaderID != 'project_hr_tab'){
		/*$(".payslip_to_dt").DateTimePicker({
			dateFormat: "dd-MM-yyyy",
			//minDate: new Date(),
		});*/
		$(".non_com_date").DateTimePicker({
			dateFormat: "MMM yyyy",
			//minDate: new Date(),
		});
	}/*else if(activeTabHeaderID == 'non_com_report_tab'){
		$(".non_com_date").DateTimePicker({
			dateFormat: "MMM yyyy",
			//minDate: new Date(),
		});
	}*/
	else if(activeTabHeaderID == 'project_hr_tab'){
		$(".project_hr_date").DateTimePicker({
			dateFormat: "MMM yyyy",
		});
	}
	
	
}else{
	$('.report').removeClass('active');
	$('.dBox').addClass('active');
	$('#pills-tab2').addClass('active');
}
//tab click event
$('.payslip_report_tab li a').click(function(){
	localStorage.setItem('id', $(this).attr('data'));
	localStorage.setItem('data', $(this).attr('id'));
	window.location.reload();
	});


	


