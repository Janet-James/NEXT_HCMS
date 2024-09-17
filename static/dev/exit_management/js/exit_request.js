var reason="",set_other=false,this_result="",result_data={};
$(document).ready(function(){
	$("#exit_reason").select2({
		placeholder: "--- Select Reasons---",
		width: '100%'
	});
	$(".select2-search__field").attr('placeholder',"-- Select Reasons--");
    getAllDetails();
})
//class for CRUD operations
class CRUD {
    constructor(...args) {
    	Object.assign(this, ...args); 
    }  
    add(){  
    	var vals = {   
    			'results' : JSON.stringify(this),
    			'delete_id' : '', 
    			'update_id' : '', 
    			csrfmiddlewaretoken : $("input[name=csrfmiddlewaretoken]").val(),
    		  } 
    	crudOperation(vals)
    } 
    update(){  
    	var vals = {
    			'results' : JSON.stringify(this), 
    			'delete_id' : '',
    			'update_id' : '',
    			csrfmiddlewaretoken : $("input[name=csrfmiddlewaretoken]").val()
    		  }
    	crudOperation(vals) 
    }
}
	let setReason=()=>{ 
		post_data = {};
		post_data['csrfmiddlewaretoken']=$("input[name=csrfmiddlewaretoken]").val();
		post_data["type"] = "reference";  
		post_data["code"] = "RFLEV"  
		res=DropdownValuesSet(post_data)  
		setDropdownValues((res?res:null), "exit_reason", "id","refitems_name"); 
	}
	const changeFormat=(first_date)=>{
		let dateArray = first_date.split('-');
		var first_date =( dateArray[2]+ '-' + dateArray[1] + '-' +dateArray[0] );
		return  first_date;
	} 
	let getAllDetails=()=>{  
		post_data['csrfmiddlewaretoken']=$("input[name=csrfmiddlewaretoken]").val() 
		post_data["type"] = "all";  
		let res=DropdownValues(post_data) 
		this_result=res;      
		drawDatatable(res);
		return false; 
	} 
	const getData=()=>{
		let data={};
		data["exit_employee"]=$("#exit_employee").val(); 
		data["exit_resignation"]=changeFormat($("#exit_resignation").val());
		data["exit_relieving"]=changeFormat($("#exit_relieving").val());
		data["reason"]=reason;
		if(set_other){	 
			data["other_reason"]=$("#exit_other_reason").val();	
		}
		data["remarks"]=$("#em_form_remarks").val();
		return data;
	 }
	const setData=(res)=>{   
		$("#exit_employee").val(res.emp_id).trigger("change"); 
		$("#exit_resignation").val(res.resignation_date); 
		$("#exit_relieving").val(res.relieving_date);
		$(".date_input_class").trigger('change');
		$("#exit_reason").val(res.emp_leaving_reason_refitem).trigger("change");
		$("#exit_other_reason").val(res.emp_leaving_reason_others);	  
		$("#em_form_remarks").val(res.emp_remarks);add_update("", "add");   
	}  
	const exitAdd =() => {     
	let valid=exitValidation();   
	if (valid){ 
		let crudObject=  new CRUD(getData())  
		crudObject.add()       
	} }   
	const exitCancel=(event)=>{
		let name=$("#exit_employee option:selected").text();
		orgClearFuncton('exitCancelCall', '', name); 
	} 
	function  exitCancelCall(){
		$('.EmployeeCard').removeClass('custom_dev_acitve');   
		$('#exit_form')[0].reset(); $('#exit_employee').val(0).trigger("change"); 
		$("#exit_reason").val(null).trigger("change");
		$('#exit_add').removeAttr('disabled');
		$('.EmployeeCard').removeClass('custom_dev_acitve');   
		$('#exit_resignation').val('');
		$(".date_input_class").trigger('change');
		$('#exit_form')[0].reset();
		
	}
//Filter functionality 
$('#exit_search').keypress(function(event){
	    var keycode = (event.keyCode ? event.keyCode : event.which);  
	    if(keycode == '13'){
	    	var search_query=$('#exit_search').val(); 
	    	if(this_result && search_query){
	    	var	filter_result=this_result.filter(function(cr){ 
	    		if(cr.name.toLowerCase().indexOf(search_query.toLowerCase()) != -1){
	    		    return cr;  
	    		} 
	    	}) 
	    	}
	    	else
	    		$('#exit_search').val("");
		    	drawDatatable(this_result);
	    	}   
	    	$('#exit_search').val("");    
	    	drawDatatable(filter_result);     
	    }   
	); 
	let crudOperation=(vals,id=0)=>{    
		if (vals) { 
			$.ajax({  
				url : '/em_rquest_crud/',         
				type : 'POST',  
				data : vals,
				timeout : 10000, 
				async : false,   
			}).done(function(json_data) {
						var data = JSON.parse(json_data);
						if (data.results == "ERR0503") {
							alert_lobibox("error", 
									sysparam_datas_list[data.results]); 
						} else if (data.results == 'NTE_01') {
							table_id = 0;
							alert_lobibox("success",  
									sysparam_datas_list[data.results]);
							getAllDetails();
							 exitCancelCall()
						} else if (data.results == 'ERR0020') {
							alert_lobibox("error","The Emploee  Alredy  Requested for Exit ");
						} else{
							alert_lobibox("error","Details Not Added");
						}
					}); 
	}
	}
	let exitRowClick=(id)=>{
	    $('#exit_add').attr('disabled','disabled');
		$('.EmployeeCard').removeClass('custom_dev_acitve');  
		$('#' + id).addClass('custom_dev_acitve');
		post_data['csrfmiddlewaretoken']=$("input[name=csrfmiddlewaretoken]").val() 
		post_data["type"] = "row"; 
		post_data["table_id"] =id;
		var res=DropdownValues(post_data)
		if(res){
			setData(res[0])	
		} 
	}
	var post_data = {};
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
	var  DropdownValues=(post_data)=> {res_data ="";  
		$.ajax({ 
			url : '/em_rquest_initial_data/',
			type : 'POST',   
			data : post_data,
			timeout : 10000,  
			async : false, 
		}).done(function(json_data) { 
			var data = JSON.parse(json_data);
			if (data.datas) {
				res_data = data.datas;  
			} 
			if(data.log_details){ 
				result_data["log_details"]=data.log_details;
				logInfo(data.log_details); //logger call in lib.js			
			}
		});  
		return res_data; 
	}
	var setDropdownValues=(res, id, key, value,value1)=> {
	    if(res){
		for (var i = 0; i < res.length; i++) { 
			$('#' + id).append($('<option>', { 
				value : res[i][key],
				text:(value1? res[i][value]+" "+res[i][value1] :res[i][value]), 
			}));} } }
	//List view of exit employee
	let drawDatatable=(data)=> {
		var res_datas = data;
		var verticalViewData = '';
		if (res_datas.length) {  
			for (var i = 0; i < res_datas.length; i++) {
				verticalViewData += '<div class="col-md-12 EmployeeCard equhight employeeList ta_job_opening" id="'
						+ res_datas[i].id
						+ '" onclick="exitRowClick('
						+ res_data[i].id + ')">' 
				verticalViewData += '<div class="col-md-8">'
				verticalViewData += '<table><tr><td class="etdwidth1">Name</td><td class="etdwidth2">:</td><td class="etdwidth3"> <b>' + res_datas[i].name
						+ '</b></td></tr> '; 
				verticalViewData += '<tr><td class="etdwidth1">Date of Resignation</td><td class="etdwidth2">:</td><td class="etdwidth3"> <b>'
						+ res_datas[i].resignation_date + '</b></td></tr>';
				
				verticalViewData += '<tr><td class="etdwidth1">Date of Relieving</td><td class="etdwidth2">:</td><td class="etdwidth3"> <b>'
					+  res_datas[i].relieving_date + '</b></td></tr></table>';
				verticalViewData += '</div>';
				verticalViewData += '<div class="col-md-4 ta_job_status_div">'
					verticalViewData += '<div class="">Status</div>';
					verticalViewData += ' <b>'+ res_datas[i].status + '</b></div>';
				verticalViewData += '</div>'  
			}
		} else { 
			verticalViewData = "<p class='no_data_found'>No Data Found.</p>" 
		}
		$('#ta_exit_details_vertical_view').html(verticalViewData);
		return false;
	}
	// Exit form validations here
	let  exitValidation=()=> {
		return $('#exit_form').valid();
	}
(function(){ 
setReason(); 
$("#exit_other_reason_div").hide();
post_data['csrfmiddlewaretoken']=$("input[name=csrfmiddlewaretoken]").val() 
post_data["type"] = "drop"; 
var res=DropdownValues(post_data)    
//setDropdownValues((res?res:null), "exit_employee", "id", "emp_name");
})();
// On change events 
$('#exit_reason').on('change',function () {
	reason=$('#exit_reason').val(); 
	if(reason== null){      
		$('#exit_reason').val([]) 
		$("#exit_other_reason_div").hide(); 
		 $("#exit_other_reason").rules("add",{required: false})
		set_other=false;
	}
	if(reason){
	reason.forEach(reas => {  
		if (reas==770) {  
			$("#exit_other_reason_div").show();
			reason.pop(reas);
			set_other=true;
		}
		else{
			$("#exit_other_reason_div").hide();
			 $("#exit_other_reason").rules("add",{required: false})
			set_other=false;
		}
		});
	}
	}); 
$("#exit_resignation").on('change',function(){  
	function getdate(tt,inc) {
	    var date = new Date(tt);
	    var newdate = new Date(date);
	    newdate.setDate(newdate.getDate() +inc);
	    var dd = newdate.getDate();
	    var mm = newdate.getMonth()+1;
	    var y = newdate.getFullYear();
	    var FormattedDate = mm + '/' + dd + '/' + y;
	    return FormattedDate;   
	}
	let add_months=(dt, n) =>{ 
		
	  return new Date(dt.setMonth(dt.getMonth() + n));      
	} 
	var first_date= $("#exit_resignation").val();
	var dateArray = first_date.split('-');
	var first_date = new Date(dateArray[1] + '/' + dateArray[0] + '/' + dateArray[2]);
	//var second_date=add_months(first_date,1)  
	
	const getDiff=(second_date)=>{
		var first_date=new Date(dateArray[1] + '/' + dateArray[0] + '/' + dateArray[2])
		var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
		var diffDays = Math.round(Math.abs((first_date.getTime() - second_date.getTime())/(oneDay)));
	  return diffDays;
	}
	var nbd=0,retrn=false;
	const reduceHoliday=(start,diffDays)=>{
			var working_day = [ 0, 1, 2, 3, 4, 5, 6 ];
			var non_business_day=0; 
			for (var i = 0; i <diffDays+1; i++) {    
				if (working_day[start] == 6 || working_day[start] == 0) { 
					non_business_day++;   	 
				}
				start++;      
				if (start == 7) {        
					start = 0;             
				}     
			 }    
			if(non_business_day>nbd){   
				second_date=new Date(second_date.setDate(second_date.getDate()+non_business_day-nbd));
				nbd=non_business_day; 
				diffDays=getDiff(second_date)
				start=first_date.getDay();
				reduceHoliday(start,diffDays)       //recursive function call until find business day
			} 
			else{
				retrn=true;
			}   
			if(retrn){return second_date;}
	}
	var second_date= new Date (getdate(first_date,60))
	diffDays=getDiff(second_date)
	start=first_date.getDay();
	//non_business_day=reduceHoliday(start,diffDays)
//	alert("non_business_day"+non_business_day)
	//second_date=new Date(second_date.setDate(second_date.getDate()+ non_business_day));
	 var second_date = new Date(reduceHoliday(start,diffDays));
	 let formatDate=(value)=>{
		 month=value.getMonth()+1;
	    return value.getDate()+ "-" + month+ "-" + value.getFullYear();
	 }
	 second_date=formatDate(second_date)
	$("#exit_relieving").val(second_date) 
	
})
	
// Validation part 
$('#exit_form').submit(function(e) {
	e.preventDefault();
}).validate({
	rules : {
		exit_employee : {
			required : true,
			valueNotEquals : true,
		},

		exit_relieving:{
			required : true,
			valueNotEquals : true,
		},
		exit_other_reason:{
			required : true,
		},
		exit_resignation:{ 
			required : true, 
			valueNotEquals : true, 
		},
		exit_reason:{
			required : true, 
			valueNotEquals : true,
		},
	}, 
	// For custom messages
	messages : {
		exit_employee : {

			required : "Select Employee",
			valueNotEquals : "Select Employee",
		},
		exit_relieving : {
			required  : "Select Exit Relieving Date",
		},
		exit_other_reason : {
			required : "Enter Other Reasons",
		},
		exit_resignation : {

			required  : "Select Exit Resignation Date",
		},
		exit_reason: {
			required : "Select Exit Reasons",
		},
	},
	errorElement : 'div',
	errorPlacement : function(error, element) {
		var placement = $(element).data('error');
		if (placement) {
			$(placement).append(error)
		} else {
			error.insertAfter(element);
		}
	},
	ignore : []
});
