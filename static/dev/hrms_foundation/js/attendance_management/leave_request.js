var table_id = 0,number_of_days=0;
var state = "",day_type_default=0,leave_year=0;
$(document).ready(function() {
		leave_datatable_function();
		$('#duration_text').html("Days");
	    button_create(1)
		$.ajax({
			type : "GET", 
			url : "/hrms_leave_type_select/",
			data : {
				"leave_type_select" : "leave_type_select"
			}, 
			async : false,
			success : function(json_data) {  
				data = JSON.parse(json_data);
				console.log("aaaaaaaaaa",data)
				//$('#leave_type').empty(); 
				for (var i = 0; i < data.length; i++) {    
					var refitems_id = data[i].refitems_id    
					var refitems_code = data[i].refitems_code      
					var refitems_name = data[i].refitems_name  
					$('#leave_type').append($('<option>', {  
						value : refitems_id,         
						text : refitems_name    
					}));       
				}     
			}           
	});
	    setdefault();
	     
})   	 
		var setDropdownValues=(res, id, key, value,)=> {
	    if(res){
		for (var i = 0; i < res.length; i++) {   
			$('#' + id).append($('<option>', {   
				value : res[i][key],
				text:res[i][value], 
			}));} } } 
		let DropdownValuesSet=(post_data)=> {  
			res_data ="";   
			$.ajax({ 
				url : '/ta_job_openings_dropdown/', 
				type : 'POST',    
				data : post_data,     
				timeout : 10000, 
				async : false, 
			}).done(function(json_data) {    
				var data = JSON.parse(json_data);   
				if (data.vals) {  
					res_data = data.vals;   
				} 
			});
			return res_data; 
		} 
		let fillDropdownValues=()=>{
			post_data = {};
			post_data['csrfmiddlewaretoken']=$("input[name=csrfmiddlewaretoken]").val();
			post_data["type"] = "reference";   
			post_data["code"] = "DTYPE";  
			let res=DropdownValuesSet(post_data)
			setDropdownValues(res,'from_date_type',"id","refitems_name")
			setDropdownValues(res,'to_date_type',"id","refitems_name")	
		}
		fillDropdownValues();  
		
	    var loadPermissionDateField=()=>{
	    	$('#from_to_date_div').html(`<div class="col-md-12 input-icon" style="padding-left: 0px;">
			<label>From Date<span class="asterisk"> *</span></label> <i class="fa fa-calendar cicon"></i> <input
				placeholder="From Date"
				class="form-control form-control-inline" type="text"
				data-field="datetime" id="from_leave" name="from_leave"
				readonly="" required data-format="dd-MM-yyyy hh:mm AA" data-error=".errorTxt0">
			<span class="errorTxt0 errormessage"></span> <span 
				id="from_date_invalid" class="errorTxt0 errormessage"></span>
			<div id="leave_from"
				class="dtpicker-overlay dtpicker-mobile"
				style="display: none;">  
				<div class="dtpicker-bg">
							<div class="dtpicker-cont">  
						<div class="dtpicker-content">   
							<div class="dtpicker-subcontent"></div> 
						</div> 
					</div>  
				</div>   
			</div> 
			<label>To Date<span class="asterisk"> *</span></label> <i class="fa fa-calendar cicon"
				style="margin-right: 10px !important;"></i> <input
				placeholder="To Date" class="form-control form-control-inline"
				type="text" data-field="datetime" id="to_leave" 
				name="to_leave" readonly=""  required data-format="dd-MM-yyyy hh:mm AA" 
				data-error=".errorTxt1" > <span
				class="errorTxt1 errormessage"></span>
			<div id="leave_to"
				class="dtpicker-overlay dtpicker-mobile"   
				style="display: none;">   
				<div class="dtpicker-bg">  
					<div class="dtpicker-cont">      
						<div class="dtpicker-content"> 
							<div class="dtpicker-subcontent"></div>
						</div>  
					</div>
				</div>                                                                                                                                                             
			</div> 
		</div>`);       
	    	
	    $('#day_type_id').hide();
	    }
	    var loadNonPermisisonDateField=()=>{
	    	$('#from_to_date_div').html(`<div class="col-md-6 input-icon" style="padding-left: 0px;">
			<label>From Date<span class="asterisk"> *</span></label> <i class="fa fa-calendar cicon"></i> <input
				placeholder="From Date"
				class="form-control form-control-inline" type="text"
				data-field="date" id="from_leave" name="from_leave"
				readonly="" required data-error=".errorTxt0">
			<span class="errorTxt0 errormessage"></span> <span 
				id="from_date_invalid" class="errorTxt0 errormessage"></span>
			<div id="leave_from"
				class="dtpicker-overlay dtpicker-mobile"
				style="display: none;">  
				<div class="dtpicker-bg">
							<div class="dtpicker-cont">    
						<div class="dtpicker-content">    	
							<div class="dtpicker-subcontent"></div> 
						</div>
					</div>  
				</div>   
			</div> 
			<label>To Date<span class="asterisk"> *</span></label> <i class="fa fa-calendar cicon"
				style="margin-right: 10px !important;"></i> <input
				placeholder="To Date" class="form-control form-control-inline"
				type="text" data-field="date" id="to_leave" 
				name="to_leave" readonly=""  required  
				data-error=".errorTxt1" > <span
				class="errorTxt1 errormessage"></span> 
			<div id="leave_to"
				class="dtpicker-overlay dtpicker-mobile"    
				style="display: none;">    
				<div class="dtpicker-bg">  
					<div class="dtpicker-cont"> 
						<div class="dtpicker-content">
							<div class="dtpicker-subcontent"></div>
						</div> 
					</div>
				</div>
			</div>
		</div>`);
	    	$('#day_type_id').show();
	    	$('#day_type_id').html(`<div class="col-md-6 input-icon" style="padding-left: 0px;">
			<div>														
			<label for="single" class="control-label ">
			         Day Type </label> <select id="from_date_type" name="from_date_type" required 
				class="form-control select2 select2-hidden-accessible1 select_from_type"
				tabindex="-1" aria-hidden="true">
				<option value="0">--Select Day Type--</option>
			</select> 
			</div>
			<div>														
			<label for="single" class="control-label ">
			         Day Type </label> <select id="to_date_type" name="to_date_type" required 
				class="form-control select2 select2-hidden-accessible1 select_to_type"
				tabindex="-1" aria-hidden="true">
				<option value="0">--Select Day Type--</option> 
			</select>  	
			</div> 
			</div>`);  
	    }
	   let trigger_dateField=()=>{
		   
		 $("#leave_from").DateTimePicker({
				
		    	//dateTimeFormat: "dd-mm-YYYY hh:mm:ss",
		    		timeFormat: "HH:mm",
		     
		}); 
		$("#leave_to").DateTimePicker({
				dateTimeFormat: "dd-mm-YYYY hh:mm:ss"
		});
		
	   }
       let ajaxCall=(url,param)=>{
    	   var data="";
    	   $.ajax({ 
				url : url, 
				type : 'POST',   
				data : param,          
				timeout : 10000, 
				async : false, 
			}).done(function(json_data) {    
			  data = JSON.parse(json_data);
			});
    	   return data;
       } 
	   let getRefCode=(...args)=>{
		  from_to=[];  
		  var param={"column":"refitems_code","ref_id":args[0],'condition':'id'}
		  from_to.push(ajaxCall("/hrms_leave_reference_data/",param))
		  var param={"column":"refitems_code","ref_id":args[1],'condition':'id'} 
		  from_to.push(ajaxCall("/hrms_leave_reference_data/",param))
		  return from_to; 
	   } 
	   const getRefName=(param)=> ajaxCall("/hrms_leave_reference_data/",param); 
	   let calculateDuration =()=> { 
		$('#from_date_invalid').html('');     
	  	var start_date = $('#from_leave').val(); 
	  	if(!start_date){
	  	$('#to_leave').val(""); 
	  	$('#from_date_invalid').html('Enter From Date First');		
	  	}   
	  	if (start_date) {   
	  		var dateArray = start_date.split('-'); 
	  		var from_date = dateArray[1] + '/' + dateArray[0] + '/' + dateArray[2];
	  	} 
	  	var end_date = $('#to_leave').val(); 
	  	if (end_date) { 
	  		var dateArray = end_date.split('-');
	  		var to_date = dateArray[1] + '/' + dateArray[0] + '/' + dateArray[2];
	  	}
	  	if (from_date && to_date) {
	  		var leave_type = $('#leave_type option:selected').text()// option  
	  		// selected
	  		if (leave_type == "Permission") {
	  			var d1 = new Date(from_date);
	  			var d2 = new Date(to_date);  
	  			var seconds = (d2 - d1) / 1000 / 60; 
	  			var time = secondsToHms(seconds * 60)   
	  			if(seconds>60){    
	  			permission_hour=1.5	  
	  			}
	  			else if(seconds<=60){ 
	       			permission_hour=1     
	  			}
	  			if(time==""){
	  				$(".errorTxt1").html("Enter Valid Time"); 
	  				$('#leave_duration_days').val("") 
	  			}else{  
	  				$(".errorTxt1").html("");   
	  			}  
	  			$('#leave_duration_days').val(time)    
	  		} else {
	  			let day_type=0;
	  			var duration = showDays(from_date,to_date);    
	  			if (duration!=0){
	            var fromDayType= $('#from_date_type').val();
	            var toDayType= $('#to_date_type').val();
	            
	            let from_to=getRefCode(fromDayType,toDayType); 
	            from_day=from_to[0]
	            to_day=from_to[1]
	  			if(from_day && to_day){
	  				let from=$('#to_leave').val();
	  				let to=$('#from_leave').val();  
	  			if (from==to && (from_day =="AFTNN" && to_day=="FORNN")){
	  				alert_lobibox("error", "InValid Selection");
	  				 $('#to_date_type').val(0).trigger('change');  
	  			}
	  			if (from_day=="AFTNN"){  
	  				day_type+=0.5;
	  			}
	  			if (to_day=="FORNN"){
	  				day_type+=0.5;
	  			}  
	  			duration=duration-day_type;
	  			}
	  			if (duration <0) {   
	  				alert_lobibox("error", sysparam_datas_list['ERR0037']);  
	  				$('#from_leave').val('');    
	  			} else {  
	  				if(isNaN(duration)){  
	  					alert_lobibox("error","Ivalid Date Format");   
	  					$('#leave_duration_days').val("")    
	  				}    
	  				else{ 
	  					$('#leave_duration_days').val(duration)
	  				}  
	  			} 
	  			}
	  			
	  		}
	  	}
	  	$('#dtimepicker2-error').html('')
	}
	 $(document).on("change", "#to_leave" , function() {
	    	calculateDuration();
	 });
	 $(document).on("change", "#to_date_type" , function() {
		 if (day_type_default_to!=1){
			 calculateDuration();	 
		 }
		 else{
			 day_type_default_to=0;
		 } 
		 
     });   
	 $(document).on("change", "#from_date_type" , function() { 
		 if(day_type_default_from!=1){
			 calculateDuration();  
		 }
		 else{
			 day_type_default_from=0;
		 }  
	    }); 
    $(document).on("change", "#from_leave" , function() { 
  	$('#from_date_invalid').html('');  
  	var start_date = $('#from_leave').val();
  	if(!start_date){  
  		$('#to_leave').val("");   
  		$('#from_date_invalid').html('Enter From Date First');		 
  		}
  	if (start_date) { 
  		var dateArray = start_date.split('-'); 
  		var from_date = dateArray[1] + '/' + dateArray[0] + '/' + dateArray[2];
  	}
  	var to_date = $('#to_leave').val();
  	if (to_date) {
  		var dateArray = to_date.split('-');  
  		var to_date = dateArray[1] + '/' + dateArray[0] + '/' + dateArray[2];
  	}
  	if (from_date && to_date) {
  		var leave_type = $('#leave_type option:selected').text()// option selected
  		if (leave_type == "Permission") {
  			var d1 = new Date(from_date);   
  			var d2 = new Date(to_date); 
  			var seconds = (d2 - d1) / 1000 / 60; 
  			var time = secondsToHms(seconds * 60)
  			$('#leave_duration_days').val(time)
  		} else {
  			var duration = showDays(from_date, to_date);
  			if (duration < 0) { 
  				alert_lobibox("error", sysparam_datas_list['ERR0037']); 
  				$('#from_leave').val(''); 
  				$('#leave_duration_days').val("")
  			} 
  			if(isNaN(duration)){
  				alert_lobibox("error","Invalid Date Fomrat");
  				$('#leave_duration_days').val("")
  			}
  			else{
  				$('#leave_duration_days').val(duration)
  			}			
  		}
  	}
  }); 
   let permissionCheck=(type_id,fromDate)=>{
	   let rtn=true;
	   $.ajax({    
			url : '/hrms_leave_details/', 
			type : 'POST', 
			timeout : 10000,
			data:{csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val(),'type':'PER','type_id':type_id,'from_date':fromDate},  
			async:false,  
		}).done(function(json_data){    
					var data = JSON.parse(json_data) 
					if(data.datas.length>0){
						dat=data.datas[0]
					if(dat['permission_count']>=2){ 
						alert_lobibox("error", "You have already Availed the Maximum Number of Permissions in the Month.");
						rtn=false;
					}
					}
				});   
	   return rtn; 
   }
$('#onbehalf_employee').on('change',function(){
	$('#leave_type').val(0).trigger('change');
}) 
let setdefault=() => {
	day_type_default_from=1;
	day_type_default_to=1;
	try{
		var param={"column":"id","ref_id":'WHODY','condition':'refitems_code'}
		whole_day_id=ajaxCall("/hrms_leave_reference_data/",param)
		$('#from_date_type').val(whole_day_id).trigger('change'); 
		$('#to_date_type').val(1117).trigger('change');	
	}
	catch(err){
		$('#from_date_type').val(1117).trigger('change');
		$('#to_date_type').val(1117).trigger('change');
	}
	}

$('#leave_type').on('change', function() {   	   
	if(this.value !=0){   
		var leave_type = $('#leave_type option:selected').text()// option      
		if(leave_type=="Permission"){ 
			loadPermissionDateField(); 
			trigger_dateField();
			$('#duration_text').html("Hours");
			//permissionCheck(this.value);  
		}    
		else{ 
			$('#duration_text').html("Days"); 
			loadNonPermisisonDateField();
			trigger_dateField(); 
			fillDropdownValues();  
			setdefault();
			$('.select_from_type').select2().change(function(){ 
			});
			$('.select_to_type').select2().change(function(){
			});  
			
			//dateSettings('date');
		} 
		if(leave_type == "Leave of Absence" || leave_type=="Permission"){ 
				$('#leave_balance_input').val(0);  
		} 
		else {
			leave_balance_calc(this.value); 		   
		}     
	}  
});  
function leave_balance_calc(id,year=null){
	$('#leave_type_select').html('');  
	$('#from_date_invalid').html(''); 
	$('#leave_balance_error').html('');
	$("#leave_balance_input").val('');
	$("#leave_duration").val('');
	let on_behalf=0;
	if($('#onbehalf_employee').length){ 
		on_behalf=$('#onbehalf_employee').val();	
	} 
	var curnt_year = new Date();
	if(year!=null){
		var year_param=year;
	} 
	else{
		var year_param=curnt_year.getFullYear();	
	} 
	if (id) {
	let pay_data={};
	
    if(on_behalf !=0){  
    	pay_data={  
			   "id" : id, 
			   'emp':on_behalf,
			   'year':year_param,
			    csrfmiddlewaretoken :$("input[name=csrfmiddlewaretoken]").val()
	          } 
    }
    else{
    	
    	pay_data={ 
 			   "id" : id,  
 			   'emp':'SELF', 
 			   'year':year_param,
 			    csrfmiddlewaretoken :$("input[name=csrfmiddlewaretoken]").val()
 	          } 
    	
    }
	leave_balance_calculation(pay_data);  
	}    
}           
//Leave data table function here 
function leave_datatable_function(){ 
	columns = [{title : "ID"},{title : "No."}, {title : "Leave Type"	},{title : "From Date"}, {title : "To Date"}, {title : "Duration"}, {title : "Approval Status"}, {title : "Reject Reasons"}]
	$.ajax({
				url : '/hrms_leave_details/',  
				type : 'POST', 
				timeout : 10000,
				data:{csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val(),'type':'TABLE'},  
				async:false,    
			}).done(function(json_data){      
						var data = JSON.parse(json_data) 
						if(data.datas.length>0){   
							dat=data.datas    
							let data_list=[] 
							for(let i=0;i<dat.length;i++){  
								//id rno  refitems_desc from_date to_date number_of_days state reject_reason
								data_list.push([dat[i].id,dat[i].rno,dat[i].refitems_desc,dat[i].from_date,dat[i].to_date,dat[i].number_of_days,dat[i].state,dat[i].reject_reason])
							}
							plaindatatable_btn('leave_details',data_list, columns,0,'NEXT_TRANSFORM_HCMS_DOW_EMPLOYEE_LEAVE_REQUEST_'+currentDate());
						}else{   
							plaindatatable_btn('leave_details', [], columns,0);
						}
					}); 	
	return false 
}
//table row click get id
$("#leave_details").on("click", "tr", function() { 
	if (!this.rowIndex) return; // skip first row
	id = $('#leave_details').dataTable().fnGetData(this)[0];
	dataTableAcitveRowAdd('leave_details',$(this).index());//active class add
	//button_create(0)
	if (id != 0) {
		leave_row_click(id); 
	} 
});
//row click funtions in the table
function leave_row_click(el) { 
	$.ajax({
		type : "GET",
		url : "/hrms_leave_row_click/", 
		async : false,
		data : {
			'id' : el
		},
		success : function(json_data) {
			data = JSON.parse(json_data);
			$('#leave_balance_input').val(data[0])
			state=data[0].state; 
			table_id = data[0].id; 
			$('#Employee_id').val(data[0].leave_employee_id_id);
			$('#company_id').val(data[0].org_id);
			$('#leave_discription').val(data[0].description);  
			$('#onbehalf_employee').val(data[0].leave_employee_id_id).trigger("change"); 
			
			var type_id=data[0].type_id_id
			var start_date=data[0].from_date 
			var end_date=data[0].to_date 
			if (start_date) { 
				var dateArray = start_date.split('/');  
				year_time=dateArray[2].split(' '); 
				let yr_from=year_time[1]!="00:00"?year_time[1] :"";
				var from_date = dateArray[0] + '-' + dateArray[1] + '-' + year_time[0] +' '+yr_from;
				var db_from_date=year_time[0] + '-' +dateArray[1]+ '-' + dateArray[0];  
			}
			if (end_date) {
				var dateArray = end_date.split('/');  
 				year_time=dateArray[2].split(' ');	 
 				let yr_to=year_time[1]!="00:00" ?year_time[1] :"";
				var to_date = dateArray[0] + '-' + dateArray[1] + '-' +year_time[0]+' '+yr_to;
				var db_to_date=year_time[0] + '-' +dateArray[1]+ '-' + dateArray[0];
			}
			$('#leave_duration_days').val(data[0].number_of_days);
			$('#leave_type').val(data[0].type_id_id).trigger("change");
			{
				$('#from_leave').val(from_date);      
				$('#to_leave').val(to_date);
				$(".date_input_class").trigger('change');
				$('#from_date_type').val(data[0].from_type_id);      
				$('#to_date_type').val(data[0].to_type_id); 
			}
			if (state == "Approved"||state == "Rejected") { 
				button_create(3) 
				$('#leave_create_btn').attr("disabled", true);
				$("#leave_update").hide();  
				$("#leave_delete").hide();   
			} else { 
				button_create(0)      
				$("#leave_update").show();  
				$("#leave_delete").show();
			}
		}, 
		/*done : function(result) {
			alert_status(result)
		}*/ 
	});  
}// row click

function leave_balance_calculation(dat) {
	if (dat) {
		$.ajax({
			type : "POST",
			url : "/hrms_leave_balance_calculation/", 
			async : false,
			data : dat,
			success : function(json_data) {
				balance_data = JSON.parse(json_data);
				if (balance_data=="ERR0021") 
				{
					alert_lobibox("error", sysparam_datas_list[balance_data]);
					$('#leave_balance_input').val(0)
				} 
				else if(balance_data=="ERR0022"){
					alert_lobibox("error", sysparam_datas_list[balance_data]); 
					$('#leave_balance_input').val(0) 
				}   
				else{
					$('#leave_balance_input').val(balance_data[0])
				} 
			},
			/*done : function(result) {
				alert_status(result)
			},*/   
			error : function(error) {
				alert_lobibox("error", sysparam_datas_list[error]);
			}
		});
	}
}// balance calculation
function create_leave() {
	var leave_status=levae_form_validation();
	if (leave_status){
		if (table_id == 0) {
			leave_create_funtion();
			leave_clear()   
			leave_datatable_function(); 
		} else {
			leave_clear();
			//alert_status("ERR0020");
			alert_lobibox("warning", sysparam_datas_list["ERR0020"]); 
		} 
	}
	return false;
}
function leave_cancel() {
	clearLeaveBtn()
} 

//cancel clear function call button
function clearLeaveBtn(){
	var text = "leave"
	if(table_id == 0){

		$('#from_date_invalid').remove();
		orgClearFuncton('leave_clear','', text);
		leave_clear();
	}
	else{
		var title = $('#leave_type option:selected').text()// option selelctd
		$('#from_date_invalid').remove();
		orgClearFuncton('leave_clear','',title);
		leave_clear();
		orgClearFuncton('leave_clear','', text);
	}
}

function leave_clear(){
	button_create(1);
	$('#leave_request')[0].reset(); 
	$('#leave_type').val('0').trigger("change"); 
	$('#onbehalf_employee').val("0").trigger("change");
	$('#leave_details tbody tr').removeClass('selected');
	$('#to_leave').val('');
	$('#from_leave').val('');
	$(".date_input_class").trigger('change');
}

function leave_update() {
	
	var leave_status=levae_form_validation();
	 leave_status=true;
	if (leave_status){
		if (table_id != 0) {
			leave_update_funtion(table_id); 
			leave_clear();
			leave_datatable_function();
		 } else { 
			leave_clear(); 
			alert_lobibox("error", sysparam_datas_list['ERR0036']);
		}
	}
	return false
}
//Leave delete function here 
function delete_leave() {
	if (table_id != 0) {
		var title = $('#leave_discription').val();
		removeConfirmation('leave_delete_function',table_id,title);
	}
}
//Organization delete function here
function leave_delete_function(delete_id){
	dat=[];
	dat.push( {
			'delete_id':delete_id 
	});
	$.ajax({ 
		type  : 'POST', 
		url : "/hrms_leave_create/",
		async : false,
		data:{"datas" :JSON.stringify(dat),csrfmiddlewaretoken : $("input[name=csrfmiddlewaretoken]").val()},
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		var res_status = data['results'];
		alert_lobibox("success", sysparam_datas_list[res_status]);
		if(res_status == 'NTE_04') { 	
			button_create(1)
			leave_datatable_function();
			leave_clear();
		} else  
		{
			alert_lobibox("success", sysparam_datas_list["NTE_03"]);
		}
});	
}
function leave_update_funtion(tid) {
	
	var type_id_id = $('#leave _type').val();
	var description = $('#leave_discription').val();
	var start_date = $('#from_leave').val(); 
	var end_date = $('#to_leave').val();
	var from_type= $('#from_date_type').val();
	var to_type= $('#to_date_type').val();
	from_type=from_type==0?null:from_type;
	to_type=to_type==0?null:to_type;
	
	var employee=0;
	if($('#onbehalf_employee').length){
		 employee = $('#onbehalf_employee').val();	
	}
	var dates=getFormatedDate(); 
	start_date=dates[0]; 
	end_date=dates[1];
	state="121";   
	permissionHourCheck();
	if(employee ==0){
		employee ="SELF";
	   employee_type="SELF";
	}
	from =new Date(start_date);
	year=from.getFullYear();
	if (basic_validation()&& permissionHourCheck()) {   
		data = {} 
		attendance_data = []
		attendance_data.push({   
			"type_id_id" : type_id_id,
			"number_of_days" : number_of_days,
			"state" : state,  
			"description" : description,    
			"from_date" : start_date,      
			"to_date" : end_date,
			"emp":employee,  
			"from_type":from_type,    
		    "to_type":to_type, 
		    "leave_year":year,  
		})   
		data["hr_leave"] = attendance_data
		$.ajax({ 
			type : "POST",
			url : "/hrms_leave_create/",  
			async : false, 
			data : {	 
				"table_id":table_id, 
				"datas" : JSON.stringify(attendance_data),
				csrfmiddlewaretoken : $("input[name=csrfmiddlewaretoken]").val()
			}, 
			success : function(json_data) { 
				button_create(1)    
				data = JSON.parse(json_data);   
				//alert_status(data.results)     
				alert_lobibox("success", sysparam_datas_list[data.results]);  
				leave_clear();			    
			},  
			/*done : function(result) {    
				alert_status(data.results)
			}*/      
		});     
	} else {
		return false;  
	}   
}  
	setNewLeaveBalance=(year)=>{
		let type_id=$('#leave_type').val();
		var leave_type = $('#leave_type option:selected').text()// option
		if(leave_type == "Leave of Absence" || leave_type=="Permission"){ 
				$('#leave_balance_input').val(0);  
		}else{
			leave_balance_calc(type_id,year); 	
		}
		
	} 	
let checkYear=()=>{ 
	try{
		let from=$('#from_leave').val();
		let to= $('#to_leave').val();   
		if(from &&to ){
		var dateArray = from.split('-');  
		 from = dateArray[1] + '/' + dateArray[0] + '/' + dateArray[2]; 
		var dateArray = to.split('-');  
		 to = dateArray[1] + '/' + dateArray[0] + '/' + dateArray[2]; 
		from =new Date(from); 
		to =new Date(to);
		if(from.getFullYear()!= to.getFullYear()){   
			alert_lobibox("error","Please Apply Leave  Year Seprately ");
			$('#from_leave').val(""); 
			$('#to_leave').val(""); 
		} 
	else{ 
		setNewLeaveBalance(from.getFullYear());
		 leave_year=from.getFullYear();
			//let d = new Date();
			//if(from.getFullYear()!= d.getFullYear()){  
				//let year_id=getRefName({"column":"id","ref_id":from.getFullYear(),'condition':'refitems_name'});	
				  
			//}
		}
		}
	}   
	catch(err){ 
		console.log(err);
	}
}
 $(document).on("change", "#to_leave" , function() {  
	checkYear(); 
	$('#from_date_invalid').html(''); 
	var start_date = $('#from_leave').val();
	if(!start_date){
	$('#to_leave').val("");
	$('#from_date_invalid').html('Enter From Date First');		
	}
	if (start_date) { 
		var dateArray = start_date.split('-');
		var from_date = dateArray[1] + '/' + dateArray[0] + '/' + dateArray[2];
	}
	var end_date = $('#to_leave').val();
	if (end_date) { 
		var dateArray = end_date.split('-');
		var to_date = dateArray[1] + '/' + dateArray[0] + '/' + dateArray[2];  
	}
	if (from_date && to_date) {
		var leave_type = $('#leave_type option:selected').text()// option
		// selected
		if (leave_type == "Permission") {
			var d1 = new Date(from_date);
			var d2 = new Date(to_date);
			var seconds = (d2 - d1) / 1000 / 60; 
			var time = secondsToHms(seconds * 60)
			if(seconds>60){   
			permission_hour=1.5	  
			} 
			else if(seconds<=60){    
     			permission_hour=1  
			}  
			if(time==""){ 
				$(".errorTxt1").html("Enter Valid Time"); 
				$('#leave_duration_days').val("")
			}else{
				$(".errorTxt1").html("");  
			}
			
			$('#leave_duration_days').val(time)
		} else {
			var duration = showDays(from_date,to_date);
			if (duration < 0) { 
				alert_lobibox("error", sysparam_datas_list['ERR0037']);  
				$('#from_leave').val('');    
			} else if(isNaN(duration)) {  
				//	alert_lobibox("error","Ivalid Date Format");
					$('#leave_duration_days').val("")   
			}else{
					$('#leave_duration_days').val(duration)  
				} 
			}  
	}
	$('#dtimepicker2-error').html('')
});
$(document).on("change", "#from_leave" , function() {
	$('#from_date_invalid').html('');
	var start_date = $('#from_leave').val();
	if(!start_date){  
		$('#to_leave').val(""); 
		$('#from_date_invalid').html('Enter From Date First');		 
		}
	if (start_date) { 
		var dateArray = start_date.split('-'); 
		var from_date = dateArray[1] + '/' + dateArray[0] + '/' + dateArray[2];
	}
	var to_date = $('#to_leave').val();
	if (to_date) {
		var dateArray = to_date.split('-');
		var to_date = dateArray[1] + '/' + dateArray[0] + '/' + dateArray[2];
	}
	if (from_date && to_date) {
		var leave_type = $('#leave_type option:selected').text()// option selected
		if (leave_type == "Permission") {
			var d1 = new Date(from_date); 
			var d2 = new Date(to_date); 
			var seconds = (d2 - d1) / 1000 / 60;
			var time = secondsToHms(seconds * 60)
			$('#leave_duration_days').val(time)
		} else {
			var duration = showDays(from_date, to_date);
			if (duration < 0) { 
				alert_lobibox("error", sysparam_datas_list['ERR0037']);
				$('#from_leave').val(''); 
				$('#leave_duration_days').val("")
			} 
			if(isNaN(duration)){ 
				alert_lobibox("error","Invalid Date Fomrat");
				$('#leave_duration_days').val("")
			}
			else{ 
				$('#leave_duration_days').val(duration)
			}			
		} 
	} 
}); 
function getFormatedDate(){
var dates=[] 
var start_date = $('#from_leave').val();
if (start_date) { 
	var dateArray = start_date.split('-');
	year_time=dateArray[2].split(' '); 
	var from_date = dateArray[1] + '-' + dateArray[0] + '-' + dateArray[2];
	let from_yr=year_time[1] ?' '+year_time[1]:"";
	var db_from_date=year_time[0] + '-' +dateArray[1]+ '-' + dateArray[0] +from_yr; 
	dates.push(db_from_date)   
}
var end_date = $('#to_leave').val();
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
	 var start_date = $('#from_leave').val();
		var end_date = $('#to_leave').val();
		if (start_date) {
			var dateArray = start_date.split('-');
			year_time=dateArray[2].split(' ');
			var from_date = dateArray[1] + '-' + dateArray[0] + '-' + dateArray[2];
			var db_from_date=year_time[0] + '-' +dateArray[1]+ '-' + dateArray[0];
		}
		var end_date = $('#to_leave').val();
		if (end_date) { 
			var dateArray = end_date.split('-');
			year_time=dateArray[2].split(' '); 
			var to_date = dateArray[1] + '-' + dateArray[0] + '-' + dateArray[2];
		}	
		var leave_type = $('#leave_type option:selected').text()// option selelctd
		var type_id_id = $('#leave_type').val() // option selelctd
		if (leave_type == "Permission") {
			var from = from_date.split(' ')[1];   
			var to = to_date.split(' ')[1];
			var d1 = new Date(from_date); 
			var d2 = new Date(to_date);
			var seconds = (d2 - d1) / 1000 / 60; 
			if (seconds >60) {  
				alert_lobibox("error", sysparam_datas_list['NTE_54']);  
				return false; 
			}  
			else {
				seconds=60;
				number_of_days=parseFloat(seconds);
			}  
			var time_validate = validateTime(from, to)  
			if (!time_validate) {
				alert_lobibox("error", sysparam_datas_list['ERR0037']); 
				return false;  
			} 
			let res=permissionCheck(type_id_id,db_from_date)   	
			if(!res){
				return false;
			}
			
			
		} 
		else{
			if ($('#from_date_type').val()==0 ||$('#to_date_type').val()==0)
			{
		    alert_lobibox("error","Select Day type");
			return false;
			}
			number_of_days = $('#leave_duration_days').val(); 
		} 
		
		return true;     
 }      
 let updateLeaveBalance=(dict)=>{ 
	 let leave_type=dict['leave_type']; 
	 let leave_type_id=dict['leave_type_id'];  
	 let number_of_days=dict['leave_days']; 
	 let emp=dict['emp'];
	 let type=dict['type'];
	 let leave_year=dict['leave_year']
	 if ( !( leave_type == 'Permission' || leave_type == 'Leave of Absence' )){ 
		 let dat={"emp":emp,"type":type,"number_of_days":number_of_days,"type_id":leave_type_id,"leave_year":leave_year,csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()}
			$.ajax( 
					{
						type:"POST",
						url: "/hrms_leave_process_balance_update/", 
						async: false,
						data:dat,   
						success: function (json_data)   
						{  
							balence_data=JSON.parse(json_data);  
							//alert_status(data['status']) 	  
						} 
					});  
			}
 } 
//create functions  
function leave_create_funtion() { 	
	var type_id_id = $('#leave_type').val();
	if (type_id_id == '0') {
		$('#leave_type_select').html('Select the leave type'); 
	} 
	//var type_id_id = $('#leave_type').val();
	//var number_of_days = $('#leave_duration_days').val();  
	var description = $('#leave_discription').val(); 
	var leave_balance = $('#leave_balance_input').val();
	var from_type= $('#from_date_type').val();
	var to_type= $('#to_date_type').val();
	from_type=from_type==0?null:from_type;
	to_type=to_type==0?null:to_type;
	var employee=0; 
	if($('#onbehalf_employee').length){
		 employee = $('#onbehalf_employee').val();	
	}
	
	var dates=getFormatedDate(); 
	db_from_date=dates[0]; 
	db_to_date=dates[1];    
	var leave_type_check = $('#leave_type option:selected').text().trim() 
	if (leave_balance && leave_balance != '0') { 
		var balance = parseFloat(leave_balance);
	} else {
		if (leave_type_check == 'Leave of Absence'   
			|| leave_type_check == 'Permission'){
			 
		} else {  
			$('#leave_balance_error').html(    
			'Leave is not allocated for this type');  
			return false;   
		}   
	} 
	 
	leaverequest_basic_validation_validate = leaverequest_basic_validation();
	if (leaverequest_basic_validation_validate)  
	{ 
		var leave_type = $('#leave_type option:selected').text().trim()// option 
		// selelctd   
		if (!(leave_type == 'Permission' || leave_type == 'Leave of Absence')&& nod > balance) {
			alert_lobibox("error",sysparam_datas_list['ERR0022']); 
		} else { 
			if (leave_type == 'Permission' || leave_type == 'Leave of Absence') {
				//number_of_days = 0.1   
			}
			if (basic_validation() && permissionHourCheck()) {
				var nod = parseFloat(number_of_days); 
				if (!(leave_type == 'Permission' || leave_type == 'Leave of Absence')&& nod > balance) {
					alert_lobibox("error",sysparam_datas_list['ERR0022']);
					return false ;   
				} 	   
				data = {};
				/*var mydate = new Date(from_date);   
				var str = mydate.toString("dd-MM-yyyy HH:mm");*/  
				leave_data = []   
				leave_balance={}      
				employee_type="BEHALF";
				if(employee ==0){ 
					employee ="SELF"; 
				   employee_type="SELF";
				}
				leave_data.push({    	 
					"type_id_id" : type_id_id,  
					"number_of_days" : number_of_days,      
					"from_date" : db_from_date,  
					"to_date" : db_to_date,     
					"state" : state,     
					"description" : description,  
					"emp":employee, 
                    "from_type":from_type, 
                    "to_type":to_type,
				});  
				leave_balance['emp']=employee;  
				leave_balance['type']=employee_type;  
				leave_balance['leave_type_id']=type_id_id;       
				leave_balance['leave_days']=number_of_days;                 
				leave_balance['leave_type']=leave_type;
				leave_balance['leave_year']=leave_year;
				$.ajax({                  
					type : "POST",    
					url : "/hrms_leave_create/",        
					async : false,    
					data : {      
						"datas" : JSON.stringify(leave_data),        
						csrfmiddlewaretoken : $(   
						"input[name=csrfmiddlewaretoken]").val()   
					},
					success : function(json_data) {  
						data = JSON.parse(json_data);    
						if(data.results=="ERR0032"){ 
							alert_lobibox("error", "Leave not applicable for you."); 
						}   
						else if(data.results=="NOEMP"){ 
							alert_lobibox("error", "Employee Not Mapped to User");
						}else if(data.results=="HALFONLY"){
							alert_lobibox("error", "You have already Availed the Permissions for the Day");
						}else if(data.results=="NTE_01"){
							updateLeaveBalance(leave_balance);
							alert_lobibox("success", sysparam_datas_list[data.results]);
						} 
						leave_clear(); 
					}, 
					error : function(error) { 
						alert_lobibox("error", sysparam_datas_list[data.results]);  
					}  
				});
			} else {
				return false;  
			}
		}// leave balance check  
	}
}
var hrs = 0;
function validate_current(date1, secondDate) {
	var now = new Date();
	date1 = new Date(date1);
	date2 = new Date(secondDate);
	now.setHours(0, 0, 0, 0);
	date1.setHours(0, 0, 0, 0);
	date2.setHours(0, 0, 0, 0); 
	/*if (now > date1) {
		return 0;
	}*/
	if (date1 > date2) {
		return 0;
	} else {
		return 1;  
	}  

}
function leave_mode(days){ 
var start_date = $('#from_leave').val();
var end_date = $('#to_leave').val();
if (start_date) {
	var dateArray = start_date.split('-');  
	year_time=dateArray[2].split(' ');
	start_time=year_time[1];
}
if (end_date) {
	var dateArray = end_date.split('-');
	year_time=dateArray[2].split(' '); 
	end_time=year_time[1];  
}
if(start_time =="00:00:00" && end_time=="00:00:00"){
	return days+1;  
}  
else{ 
	return days;     
}
} 
function showDays(firstDate, secondDate) { 
	if (validate_current(firstDate, secondDate)){
		var startDay = new Date(firstDate);
		var endDay = new Date(secondDate);
		var holiday_list = []
		$('#from_date_invalid').html(" "); 
		var day = []; 
		var non_business_day = 0;
		var millisecondsPerDay = 1000 * 60 * 60 * 24;
		var millisBetween = endDay.getTime() - startDay.getTime();
		// var days = millisBetween/millisecondsPerDay;

		var t = dhm(millisBetween)
		function dhm(t) { 
			var cd = 24 * 60 * 60 * 1000, ch = 60 * 60 * 1000, d = Math.floor(t
					/ cd), h = Math.floor((t - d * cd) / ch), m = Math.round((t
							- d * cd - h * ch) / 60000), pad = function(n) {
				return n < 10 ? '0' + n : n;
			}; 
			if (m === 60) { 
				h++;     
				m = 0;  
			}  
			if (h === 24) { 
				d++;
				h = 0;  
			}
			days = d;
			// return [d, pad(h), pad(m)].join(':'); 
			return [ d, pad(h), pad(m) ]; 
		}

		day = startDay.getDay();
		day[1] = endDay.getDay(); 
		days = days + 1;
		
		working_day = [ 0, 1, 2, 3, 4, 5, 6 ] 
		var start = day;
		for (var i = 0; i < days; i++) {
			if (working_day[start] == 6 || working_day[start] == 0) {
				non_business_day++;
			}
			start++;
			if (start == 7) { 
				start = 0;
			}
		}
		$.ajax({  
			type : "GET",
			url : "/hrms_holiday_list_date/",
			async : false, 
			data : {
				"firstDate" : firstDate,
				"secondDate" : secondDate
			}, 
			success : function(json_data) {
				day = startDay.getDay();
				data = JSON.parse(json_data);
				for (var i = 0; i < data.length; i++) {
					var holiday = new Date(data[i].holiday_date)
					holiday_list.push(holiday.getDay())
				}
			},
			done : function(result) {
				//alert_status(result)
			} 
		});
		if (data['status'] != 'Value is empty') {
			for (var i = 0; i < holiday_list.length; i++) {
				if (holiday_list[i] in working_day) { 
					non_business_day++
				}
			}
			/* 
			 * for(var i=0;i<days;i++) { for( var j=0;j<data.length;j++) { var
			 * Q_startDay = new Date(data[j].holiday_date); }
			 * if(working_day[start] == Q_startDay.getDay()){
			 * non_business_day++; } start++; if(start==7) { start=0; } }
			 */
		}
		if (t[1] >= 04) {
			hrs = 0;
		}
		if (t[1] != 0 && t[1] <= 04) {
			hrs = 0.5;
		} else if (t[1] == 0) {  
			hrs = 1;
		}
		days = days - non_business_day; 
		days = days - hrs;
		
		days=leave_mode(days)+1;
		if(days==0){
			alert_lobibox("error", "Selected Date is Holiday"); 
			$('#from_leave').val("");
			$('#to_leave').val("");
		    //$('#leave_duration_days').val("").trigger('change');
			
		}
		return days;// return it to create function 
	} else {
		$('#from_date_invalid').html('End Date must be greater than or equal to Start Date');
		//$('#from_leave').val(''); 
	}  
}
function validateTime(from, to) {
	if (!from && !to) {      
		return false;  
	} 
	else if (from == "00:00" && to == "00:00") { 
		return false;
	} 
	else {   
		return true;  
	}
}
function secondsToHms(d) {
	d = Number(d); 
	var h = Math.floor(d / 3600);  
	var m = Math.floor(d % 3600 / 60);
	var s = Math.floor(d % 3600 % 60);
	var hDisplay = h > 0 ? h + (h == 1 ? " hour " : " hours ") : ""; 
	var mDisplay = m > 0 ? m + (m == 1 ? " minute " : " minutes") : "";
	var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
	return hDisplay + mDisplay + sDisplay;
}
//function for basic company validation
function leaverequest_basic_validation() {
	return $('#leave_request').valid();
}
function basic_validation() {
	leave_employee_id = $('#leave_employee_id').val();
	leave_discription = $('#leave_discription').val();
	leave_duration = $('#leave_duration_days').val();
	leave_type = $('#leave_type').val();
	var from_date = $('#dtimepicker1').val();
	var to_date = $('#dtimepicker2').val();
	if (leave_employee_id != '' && leave_discription != ''
		&& leave_duration != '' && leave_type != '' && from_date != ''
			&& to_date != '') {
		return true; 
	} else {
		return false;
	}
}// validation end 
//jquery leave validation
jQuery.validator.addMethod('valueNotEquals', function (value) {
	return (value != '0');
}, "country required");

$('.select2').select2().change(function(){
	//$(this).valid();
	 $('.errormessage').html('');
});
$('#leave_request').submit(function(e) {
	e.preventDefault();    
}).validate({
	rules: { 
		from_leave: {
			required: true,
		},
		to_leave: {
			required: true,
		},
		leave_type:
		{
			required:true,
			valueNotEquals:true,
		},
		leave_discription:
		{
			required:true,
		}	 
	},
	//For custom messages 
	messages: { 
		from_leave: {
			required: "Enter From Date",
		},
		to_leave: {
			required: "Enter To Date",
		},
		leave_type:
		{
			required:"Select Leave Type",
			valueNotEquals: "Select Valid Leave Type",
		},
		leave_discription:
		{
			required: "Enter Leave Reason",
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
//leave form validations here   
function levae_form_validation()        
{  	  
	return $('#leave_request').valid(); 
} 
//button create function here 
function button_create(status){  
	var access_for_create = jQuery.inArray( "Raise Leave Request", JSON.parse(localStorage.Create) );
	var access_for_write = jQuery.inArray( "Raise Leave Request", JSON.parse(localStorage.Write) );
	var access_for_delete = jQuery.inArray( "Raise Leave Request", JSON.parse(localStorage.Delete) );
	var strAppend = '';
	access_for_create=1;
	access_for_write=1;
	access_for_delete=1;
	if(status == 1){
		if (access_for_create != -1){
		strAppend = "<button type='button' onclick='create_leave()' id='leave_create_btn' class='btn btn-success btn-eql-wid btn-animate'>Add</button>"
		}
		strAppend += " <button type='button' onclick='clearLeaveBtn()' class='btn btn-warning btn-eql-wid btn-animate'>Cancel / Clear</button>"
		$('#leave_request_btn').html(strAppend);
	}else if(status==3){
			strAppend += " <button type='button' onclick='clearLeaveBtn()' class='btn btn-warning btn-eql-wid btn-animate'>Cancel / Clear</button>"
			$('#leave_request_btn').html(strAppend);
	}
	else{
		if (access_for_write != -1){
		strAppend = "<button type='button' onclick='leave_update()' class='btn btn-primary btn-eql-wid btn-animate '>Update</button>"
		}if (access_for_delete != -1){
			strAppend += " <button type='button' onclick='delete_leave()' class='btn btn-danger btn-eql-wid btn-animate'>Remove</button>"
		}
		strAppend += " <button type='button' onclick='clearLeaveBtn()' class='btn btn-warning btn-eql-wid btn-animate'>Cancel / Clear</button>"
		$('#leave_request_btn').html(strAppend);
	}
}
