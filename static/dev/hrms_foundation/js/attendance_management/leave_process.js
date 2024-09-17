var table_id='',employee_id=0,number_of_days=0;
var leave_type_id='',status="Approved",state="119",other_reason="",year=0;
var approval_url="/hrms_leave_process_data/";//global variable for dynamic url to selecet data
var open_table="leave_process_details_open"
var past_table="leave_process_details_past"
	
$('#reject_reason').hide()
$('#open_request').hide();
$('#Leave_process_form').show();
$('#other_reasons_div').hide();
//$('input[type=radio][name=approve_reject]').prop('checked', false);
var table="";
var myTable;

$(document).ready(function() {
  $('[name="process_switch"]').bootstrapSwitch();
	open_request_columns = [{ title: "ID"},{ title: "No." },{title: "Employee"},{title: " Raised Date "},{title: "Leave Type" },{ title: "From Date" },{title: "To Date" }, { title: "Duration"},{title: "Leave Reasons"}]
	past_request_columns = [{
		title: "ID"
	},{
		title: "No."  
	},{
		title: "Employee"
	},{
		title: " Raised Date " 
	}, {
		title: "Leave Type"  
	}, { 
		title: "Duration"  
	}, {
		title: "Status" 
	},{   
		title: "Leave Reasons"
	},{
		title: " From Date " 
	},{
		title: " To Date " 
	}
	,{   
		title: "From Date"
	}
	,{   
		title: "To Date"
	}
	]
	//body tag add class dynamic
	leave_view_table(open_table,open_request_columns,approval_url,"open");
	// drop down for reject reason rule
	$.ajax(
			{
				type:"GET",
				url: "/hrms_leave_type_select/",
				data:{"reject_reason_select":"reject_reason_select"},
				async: false,	
				success: function (json_data) {
					data = JSON.parse(json_data); 
					for(var i=0;i<data.length;i++){
						var refitems_id = data[i].refitems_id
						var refitems_code = data[i].refitems_code
						var refitems_name = data[i].refitems_name
						$('#rejected_reason').append($('<option>', { 
							value : refitems_id ,
							text : refitems_name
						})); 
					}
				}  
			});
	//Getting the approve status details to create dynamic check boxes 
	$.ajax({
		type:"GET", 
		url: "/hrms_leave_type_select/",	 
		async: false,
		success: function (json_data) {	
			if(json_data != "Value is empty"){ 
				data=JSON.parse(json_data);  
				if(data.length){
					var approve_status_list='' 
						var str="";
					for(var i=0;i<data.length;i++) {
						
						if (data[i].refitems_name!='Open' && data[i].refitems_name !='Cancelled'){
//							str+= '<div class="radio"><label>  <input name="approve_reject" id="'+data[i].refitems_id+'" value="'+data[i].refitems_name+'" type="radio">'+data[i].refitems_name+'<span></span></div>'
							str+= '<div class="radio"><label> <input name="approve_reject" id="'+data[i].refitems_id+'" value="'+data[i].refitems_name+'" type="radio"><span class="cr"><i class="cr-icon fa fa-circle"></i><div></div></span>'+data[i].refitems_name+'</label></div>'
						}
					}					
					$('#process_action_radio').html(str);
				}
			} 
		}
	});
	/*
	$('input[type=radio][name=approve_reject]').change(function() {
		 state=this.id;
		 
		if (this.value=="Rejected") {
			$('#reject_reason').show()   
		}
		else if (this.value=="Approved") {
			$('#reject_reason').hide()
		}
	});
	*/
	
});//ready

$('#accept_reject').change(function(e,data) {
	 if($(this).is(":checked")) {
		 status="Approved";
			$('#reject_reason').hide()
			$('#other_reasons_div').hide();
			$('#rejected_reason').val(0).trigger("change");
			$('.pro-btn1').addClass('pro-btn').removeClass('pro-btn1');
			state="119";
	 }else{
		 $('.pro-btn').addClass('pro-btn1').removeClass('pro-btn');
			status="Rejected";
			state="120";
			$('#reject_reason').show()
		 }  
});
$('#rejected_reason').change(function(e,data) {
	  other_reason=$('#rejected_reason option:selected').text()
	if (other_reason =='Others(Please specify)'){
		$('#other_reasons_div').show();
	} 
		
});

/*
//search employee name based on employee list
var elem = document.getElementById('leave_emp_name');
elem.addEventListener('keypress', function(e){
if (e.keyCode == 13) {
	search_employee();
} 
});*/
function search_employee(){
 	var table_type=$("#open_or_past").val()
	var employee_name=$('#leave_emp_name').val();
 	if(table_type==0){
	$.ajax({
			type:"POST",
			url:"/hrms_leave_employee_list/",
			data:{"employee_name":employee_name,"type":"open",csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()}
          }).done(function(json_data){ 
        	var data=JSON.parse(json_data)
			plaindatatable_btn(open_table, data.values, open_request_columns,0,'NEXT_TRANSFORM_HCMS_DOW_EMPLOYEE_LEAVE_PROCESS_'+currentDate());
          })
 	}
 	else if(table_type==1){
 		$.ajax({ 
			type:"POST",  
			url:"/hrms_leave_employee_list/",
			data:{"employee_name":employee_name,"type":"past",csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()}
          }).done(function(json_data){
        	var data=JSON.parse(json_data)
        	
			plaindatatable_btn(past_table, data.values, past_request_columns,0,'NEXT_TRANSFORM_HCMS_DOW_EMPLOYEE_LEAVE_PROCESS_'+currentDate());
        	
          })
 	}	
 	}

//table row click get id
$("#leave_process_details_open").on("click", "tr", function() {
	if (!this.rowIndex) return; // skip first row
	id = $('#leave_process_details_open').dataTable().fnGetData(this)[0];
	dataTableAcitveRowAdd('leave_process_details_open',$(this).index());//active class add
	if (id != 0) {
		process_leave_row(id);
	}
});
//row click function in the table
function process_leave_row(el){
	if(el!="No Open Requests")
	{ 
		$.ajax(
				{
					type:"GET",
					url: "/hrms_leave_process_row/",	
					data : {'id':el},
					success: function (json_data)  
					{ 
						data=JSON.parse(json_data);
						var leave_type = data[0].leave_type;
						if (leave_type == 'Permission'){ 
							from_date = data[0].from_date
							end_date = data[0].to_date
						}
						else{ 
							var date1 = data[0].from_date.split(' ')
							var date2 = data[0].to_date.split(' ')
							from_date = date1[0] 
							end_date = date2[0]
						}
						
						$('#leave_discription').val(data[0].description); 
						$('#from_date').val(from_date);
						$('#to_date').val(end_date);
						$('#leave_balance').val(data[0].leave_balance); 
						$('#leave_duration').val(data[0].duration);  
						$('#leave_employee').val(data[0].employee); 
						$('#leave_company').val(data[0].company_name);
						$('#leave_type').val(data[0].leave_type);
						var dateArray = data[0].from_date.split('-'); 
						 from = dateArray[1] + '/' + dateArray[0] + '/' + dateArray[2];
						from =new Date(from);
						year=from.getFullYear();
						table_id = data[0].id;
						leave_type_id=data[0].leave_type_id
						employee_id=data[0].leave_employee_id_id 
						let dat; 
						if(data[0].leave_type_id && data[0].leave_employee_id_id){
						dat={
								"id" :data[0].leave_type_id,
								'emp':data[0].leave_employee_id_id, 
								'year':year,
								csrfmiddlewaretoken :$("input[name=csrfmiddlewaretoken]").val()
						          } 
						}
						leave_calculation(dat);
					},
					/*done:function(result) 
					{
						alert_status(result)
					}*/
				}); 
			/*var scrollPos =  $(".transformNav-wrapper").offset().top;
			$(window).scrollTop(scrollPos);*/
	}
	else 
	{  
		error_status(el) 
	}
}//row click
function radio_fns(){ 
	$("#rejects_reasons").hide();
	var leave_approve_status = $('input[name=radio]:checked + label').text();  
	if (leave_approve_status == 'Rejected'){
		$("#rejects_reasons").show();
	} 
}
$( "#leave_allocation_upate").click(function() {
//	var status = $("input[name='approve_reject']:checked").val();
	if (status =="Approved") {
		var leave_approve="Approved";	   
	}
	if (status=="Rejected") {
		var leave_reject="Rejected";
		
			
	}
		if (leave_approve  == '' && leave_reject == '')
		{
			error_status("Select the action type") 
			return false; 
		}
		else
		{
			if(leave_approve=="Approved"){
				leave_allocation_update_funtion(state);
				leave_view_table(open_table,open_request_columns,approval_url,"open");
			}
			else if(leave_reject=="Rejected") 
			{
				if($("#rejected_reason").val()==0)
					{
					alert_lobibox("error","Select Reject Reasons")
					}
				var reject="reject"
					if (other_reason=='Others(Please specify)'){  
					  if(!$("#other_reasons").val())
						  {
						  alert_lobibox("error","Fill all values")
						  }
					}
					
			leave_allocation_update_funtion(state,reject);
				leave_view_table(open_table,open_request_columns,approval_url,"open");
			}
		}
	return false;
});	
$( "#leave_allocation_cancel" ).click(function() {
	leave_allocation_clear();
	
	return false
});
$( "#show_past_request" ).click(function() {
	$('#leave_process_details_open').parents('div.dataTables_wrapper').first().hide();
	leave_view_table(past_table,past_request_columns,approval_url,"past");
	$('#Leave_process_form').hide();
	$("#open_request").show()
	$("#past_request").hide()
	$("#open_or_past").val(1);
	$('#leave_process_form').attr('class', 'col-md-0')
	$('#leave_process_table').attr('class', 'col-md-12')
	$('.leave_process_title').html('Past Leave Requests');
});	
$( "#show_open_request" ).click(function() {
	$('#leave_process_details_past').parents('div.dataTables_wrapper').first().hide();
	leave_view_table(open_table,open_request_columns,approval_url,"open");
	$('#Leave_process_form').show();
	$("#open_request").hide()
	$("#past_request").show()
	$("#open_or_past").val(0);
	$('.leave_process_title').html('Open Leave Requests');
});	
$( "#leave_allocation_cancel").click(function() {
	$('#leave_process_details_past').parents('div.dataTables_wrapper').first().hide();
	leave_view_table(open_table,open_request_columns,approval_url,"open");
	$('#leave_process_details_open').show();
});	
/*$('#leave_type').on('change', function() {
	var id=this.value 
	if(id){
		leave_calculation(id)   
	}
})*/
function leave_calculation(dat) 
{ 
	if(dat){
		$.ajax({ 
			type : "POST",
			url : "/hrms_leave_balance_calculation/",
			data:dat, 
			success: function (json_data)  
			{ 
				data=JSON.parse(json_data);
				if(data !="ERR0022" && data !="ERR0021") 
				$('#leave_balance').val(data) 
			} 
		}); 
	}
} 
//Leave data table function here 
function leave_view_table(tabel,columns,url,type)
{
	plaindatatable_btn(tabel, [], columns,0);
	$.ajax( 
			{ 
				type : "POST",
				url :url,
				timeout : 10000, 
				data : {'type':type,csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()},
				async:false,
			}).done(  
					function(json_data)  
					{	  
						var data = JSON.parse(json_data)      
						if(data.length){   
						 dat=data;      
						 var data_list=[]     
						if(type=='open'){  
						for(let i=0;i<dat.length;i++){    
							//id  row_number name raised_date leave_type from_date to_date number_of_days description
							data_list.push([dat[i].id,dat[i].row_number,dat[i].name,dat[i].raised_date,dat[i].leave_type,dat[i].from_date,dat[i].to_date,dat[i].number_of_days,dat[i].description])
						}
						}else if(type=='past'){
							for(let i=0;i<dat.length;i++){  
								//id row_number name raised_date type number_of_days  state_id description
								data_list.push([dat[i].id,dat[i].row_number,dat[i].name,dat[i].raised_date,dat[i].type,dat[i].number_of_days,dat[i].state_id,dat[i].description,dat[i].from_date,dat[i].to_date])
							} 
						}
						}  
						plaindatatable_btn(tabel,data_list, columns,0,'NEXT_TRANSFORM_HCMS_DOW_EMPLOYEE_LEAVE_PROCESS_'+currentDate());
						/*else{      
						}*/
					}); 
	return false
}
//view table functions call 
function view_table_past(url){ 
	$.ajax(
			{
				type:"GET",
				url: url,
				async: false,
				success: function (json_data)  
				{	
					data=JSON.parse(json_data);
					table_generated_past(data.datas); 
				},
			}); 
}
//table row click get id
$("#leave_allocation_table").on("click", "tr", function() {   
	leave_allocation_clear();
	var id = $(this).children(":first").text();
	if (!this.rowIndex) return; // skip first row
	id = $('#leave_allocation_table').dataTable().fnGetData(this)[0];
	if (id != 0){
		leave_allocation_row_click(id);   
	} 
});   
//row click function in the table
function leave_allocation_row_click(el){
	if(el!="No Open Requests")
	{ 
		$.ajax(    
				{ 
					type:"GET", 
					url: "/leave_allocation_row_click/",	  
					async: false,
					data : {'id':el},   
					success: function (json_data)          
					{  
						data=JSON.parse(json_data);    
						var leave_type = data[0].leave_type;   
						if (leave_type == 'Permission'){
							from_date = data[0].from_date
							end_date = data[0].to_date   
						}  
						else{  
							
							var date1 = data[0].from_date.split(' ') 
							var date2 = data[0].to_date.split(' ')  
							
							from_date = date1[0]
							end_date = date2[0]      
						}  
						$('#leave_discriptions').val(data[0].description); 	
						$('#from_date').val(from_date);
						$('#to_date').val(end_date); 
						$('#leave_balance').val(data[0].number_of_days);
						$('#leave_duration').val(data[0].duration); 
						$('#leave_employee').val(data[0].employee); 
						$('#leave_company').val(data[0].company_name);   
						$('#leave_type').val(data[0].leave_type);
						table_id = data[0].id;
						leave_type_id=data[0].leave_type_id
						let data;
						if(data[0].leave_type_id && data[0].employee){ 
						data={
								"id" :data[0].leave_type_id,
								'emp':data[0].employee,
								csrfmiddlewaretoken :$("input[name=csrfmiddlewaretoken]").val()
						          }
						}
						leave_calculation(data); 
					},
					/*done:function(result)
					{
						alert_status(result)
					}*/
				});
		var scrollPos =  $(".transformNav-wrapper").offset().top;
		$(window).scrollTop(scrollPos);
	}
	else
	{
		error_status(el)          
	}
}//row click
function getFormatedDate(){
	var dates=[]
	var start_date = $('#from_date').val();
	if (start_date) {
		var dateArray = start_date.split('-');
		year_time=dateArray[2].split(' ');
		var from_date = dateArray[1] + '-' + dateArray[0] + '-' + dateArray[2];
		let from_yr=year_time[1] ?' '+year_time[1]:"";
		var db_from_date=year_time[0] + '-' +dateArray[1]+ '-' + dateArray[0] +from_yr;
		dates.push(db_from_date)
	}
	
	
	var end_date = $('#to_date').val();
	if (end_date) {
		var dateArray = end_date.split('-'); 
		year_time=dateArray[2].split(' ');  
		var to_date = dateArray[1] + '-' + dateArray[0] + '-' + dateArray[2];
		let to_yr=year_time[1] ?' '+year_time[1]:"";
		var db_to_date=year_time[0] + '-' +dateArray[1]+ '-' + dateArray[0] +to_yr;
		dates.push(db_to_date)
	}	
	return dates
	}
let permissionHourCheck=()=>{
	
	 var start_date = $('#from_date').val();
		var end_date = $('#to_date').val();
		if (start_date) {
			var dateArray = start_date.split('-');
			year_time=dateArray[2].split(' ');
			var from_date = dateArray[1] + '-' + dateArray[0] + '-' + dateArray[2]; 
		}
		var end_date = $('#to_date').val();
		if (end_date) {
			var dateArray = end_date.split('-');
			year_time=dateArray[2].split(' ');   
			var to_date = dateArray[1] + '-' + dateArray[0] + '-' + dateArray[2];
		}	
		var leave_type =$('#leave_type').val()
		if (leave_type == "Permission") {
			var from = from_date.split(' ')[1]; 
			var to = to_date.split(' ')[1];
			var d1 = new Date(from_date);
			var d2 = new Date(to_date);
			var seconds = (d2 - d1) / 1000 / 60;
			if (seconds > 90) { 
				alert_lobibox("error", sysparam_datas_list['NTE_54']);  
				return false;
			}  
			else {  
				number_of_days=parseFloat(seconds); 
				number_of_days=60;
				
			}
			
		} 
		else{
			number_of_days = $('#leave_duration').val();
		}
		return true; 
}
function leave_allocation_update_funtion(state,reason){
	data={}	
	leave_process_data = []
	var type_id_id=leave_type_id;
	//var number_of_days=$('#leave_duration').val();
	var description=$('#leave_discription').val(); 
	var leave_employee_id_id=$('#Employee_id').val(); 
	var leave_reject_id_id=$('#rejected_reason').val(); 
	var leave_company_id_id=$('#company_id').val(); 
	/*var start_date = $('#from_date').val();
	var end_date = $('#to_date').val();
	if (start_date) {
		var dateArray = start_date.split('-');
		year_time=dateArray[2].split('-');
		var from_date = dateArray[1] + '/' + dateArray[0] + '/' + dateArray[2];
		var db_from_date=year_time[0] + '-' +dateArray[1]+ '-' + dateArray[0];
	}
	if (end_date) {
		var dateArray = end_date.split('-');
		year_time=dateArray[2].split(' ');
		var to_date = dateArray[1] + '/' + dateArray[0] + '/' + dateArray[2];
		var db_to_date=year_time[0] + '-' +dateArray[1]+ '-' + dateArray[0];
	}*/
	var dates=getFormatedDate(); 
	db_from_date=dates[0]; 
	db_to_date=dates[1]; 
//	/var state=state;     
	//if ( !( leave_type == 'Permission' || leave_type == 'Leave of Absence' )) 
	if(permissionHourCheck())
	{  
		if (reason=="reject") // Rejected 
		{
			if(leave_reject_id_id == '0'){
				alert_lobibox("error", sysparam_datas_list["NTE_15"]);
				return false; 
			}
			else{
				var leave_reject_id = leave_reject_id_id
			}
			var reason=$('#other_reasons').val();  
			if(!reason)
			{ 
				 var reason=" ";
			}
			leave_process_data.push({"type_id_id":type_id_id,
				"number_of_days":number_of_days, 
				"state":state,
				"reason":reason, 
				"description":description,
				"reject_reason_id_id":leave_reject_id,
				"id":table_id,
				"from_date":db_from_date,  
				"to_date":db_to_date
			})
			
			if ( !( leave_type == 'Permission' || leave_type == 'Leave of Absence' )){
				let dat={"emp":employee_id,"number_of_days":number_of_days,"type_id":leave_type_id,"leave_year":year,csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()}
				$.ajax( 
						{ 
							type:"POST", 
							url: "/hrms_leave_process_balance_update/", 
							async: false,
							data:dat, 
							success: function (json_data)   
							{  
								data=JSON.parse(json_data);   
								//alert_status(data['status']) 	 
							}
						}); 
				} 
		}
		else //Approved 
		{ 
			leave_process_data.push({"type_id_id":type_id_id,
				"number_of_days":number_of_days,
				"state":state, 
				"description":description,
				"id":table_id,  
				"from_date":db_from_date, 
				"to_date":db_to_date
			})  
			 
		}//check is rejection    
	}  
	if (basic_validation()) 
	{ 	 
		data={} 
		data["hr_leave"] = leave_process_data
		$.ajax(
				{
					type:"POST",
					url : "/hrms_leave_create/",   
					async: false,
					data : {
						"table_id":table_id,
						"datas" : JSON.stringify(leave_process_data),
						csrfmiddlewaretoken : $("input[name=csrfmiddlewaretoken]").val()
					},
					success: function (json_data)    
					{
						data=JSON.parse(json_data);
						leave_allocation_clear(); 
						alert_lobibox("success", sysparam_datas_list[data.results]);
					},  
					error:function(error)
					{  
						alert_lobibox("error", sysparam_datas_list["NTE_02"]); 
					}
				});   
	}
	return false;
} 
function basic_validation(){
	/*Name*/
	leave_employee_id = $('#leave_employee_id').val();
	leave_discription =$('#leave_discription').val();
	leave_duration = $('#leave_duration').val();
	leave_type =$('#leave_type').val();
	if (leave_employee_id != '' && leave_discription !='' && leave_duration !='' && leave_type!= '')
	{ 
		return 1;
	}
	else
	{
		alert_lobibox("error","Fill all values")
	}
}
function leave_allocation_clear(){  
	$('.error_status').html('')	
	$('.alert_status').html('')
	$('#leave_employee,#leave_company,#leave_type,#leave_balance,#leave_duration,#from_date,#to_date,#leave_discription').val('');
	$("#rejects_reasons").hide();
	$('#rejected_reason').val(0).trigger("change");
	$('#reject_reason').hide()
	$('#other_reasons_div').hide();
	}