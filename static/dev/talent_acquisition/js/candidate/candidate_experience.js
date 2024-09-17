var list_index_experience,list_id_experience;
var exp_delete_list=[];
var flag_current;
$( document ).ready(function() {	
});
var experience_update_flag=0,experience_add_flag=0,experience_remove_flag=0;
	
//Employee experience details temp create function here 
$( "#experience_details_create_button" ).click(function() {
	if(candidate_table_id)
	{
		if(employee_experience_form_validation())
		{
			experience_add_flag=1
			experience_remove_flag=0
			experience_update_flag=0
			experience_create_function_temp();
		}	
	}else
	{
		alert_lobibox("info","Employee Record not Selected")
	}	
});

//Employee experience details temp edit function here 
$( "#experience_details_edit_button" ).click(function() {
	if(list_index_experience!=undefined)
	{
		if(employee_experience_form_validation())
		{
			experience_add_flag=0
			experience_remove_flag=0
			experience_update_flag=1
			experience_create_function_temp();
		}
	}else
	{
		alert_lobibox("info","Experience not Selected")
	}	
});

//Employee experience details temp delete function here 
$( "#experience_details_delete_button" ).click(function() {
	
	if(list_index_experience!=undefined)
	{
		experience_remove_flag=1
		experience_add_flag=0
		experience_update_flag=0
		
		if(!(experience_list[list_index_experience][0]==""))
		{
			exp_delete_list.push(experience_list[list_index_experience][0])
		}
		experience_list.splice(list_index_experience, 1);	
		
		for(var i=0;i<experience_list.length;i++)
		{
			experience_list[i][1] = i+1;
		}
		
		$('#experience_table').show();
		plaindatatable('candidate_experience_details',experience_list, exp_columns,0);	
		clear_function_experience();
		alert_lobibox("success","Removed Successfully");
		exp_button_display();
		status_change = true;
	}else
	{
		alert_lobibox("info","Experience not Selected")
	}	
});

// cancel functions here
$("#experience_details_cancel_button").click(function() {	
	clear_function_experience();
});

$("#employee_experience_details_edit_button").click(function() {
	employee_experience_create_function();
});

$("#employee_experience_details_cancel_button").click(function() {
	clear_function_experience();		
});

// clear function experience here
function clear_function_experience()
{ 
	$('.errormessage').html("");	
	document.getElementById('employee_experience_details_form').reset()
	$('.exp_update').hide()
	$('.exp_add').show()	
}

// experience start date function here
$( "#experience_start_date" ).change(function() {
	var from = DateformatChange($("#experience_start_date").val());
	var to =  DateformatChange($("#experience_end_date").val());

	var sDate = new Date(from);
	var eDate = new Date(to);
	if(from!= null && to!= null && sDate> eDate)
	{
		  $("#exp_date_error").html("End Date cannot be lesser than start date")
	}else if(from!= null && to!= null && sDate == eDate){
		  $("#exp_date_error").html("End Date and Start Date cannot be same")	
	}else
	{
		  $("#exp_date_error").html("")		 
	}
});

// experience end date function here
$( "#experience_end_date" ).change(function() {
	var from = DateformatChange($("#experience_start_date").val());
	var to = DateformatChange($("#experience_end_date").val());

	var sDate = new Date(from);
	var eDate = new Date(to);
	if(from!= null && to!= null && sDate> eDate){
		  $("#exp_date_error").html("End Date cannot be lesser than start date")
	}else if(from!= null && to!= null && sDate == eDate){
		  $("#exp_date_error").html("End Date and Start Date cannot be same")	
	}else{
		  $("#exp_date_error").html("")		 
	}		
	start_date = $('#experience_start_date').val();
	if(flag_current == true){		
		end_date = new Date();
	}else{
		end_date = $('#experience_end_date').val();	
	}	
	calculateYearsofExperience(start_date,end_date);
});

//current experience function here
$('#current_exp').change(function() {
	  var flag_current = true;
	  if($(this).prop('checked') == true){	  
		  $('#experience_end_date').attr("disabled", true); 		  
		  $('#reason_for_relieving').attr("disabled", true);
		  $('#experience_end_date').val("");
		  $('#reason_for_relieving').val("");		  
		  $('.errorTxt28').html("");
	  }else{		 
		  $('#experience_end_date').attr("disabled", false); 		  
		  $('#reason_for_relieving').attr("disabled", false);
		  $('.errorTxt28').html("");
	  }	  
});

//calculate years of experience details function here
function calculateYearsofExperience(start_date,end_date){
	if(start_date == end_date){
		$('#candidate_experience').val("")
		$("#exp_date_error").html("End Date and Start Date cannot be same")	
	}else{
		$("#exp_date_error").html("")		
		var years;	
		years =  calculateYearsbetweenDates(DateformatChange(start_date),DateformatChange(end_date));
		$('#candidate_experience').val(years)
	}		
}

//calculate years between dates function here
function calculateYearsbetweenDates(start_date,end_date){
		if(start_date != null && end_date !=null) {
			start_date = new Date(start_date)
			end_date = new Date(end_date)	
			d1 = new Date(start_date.getYear(), start_date.getMonth(), start_date.getDay());               
			d2 = new Date(end_date.getYear(), end_date.getMonth(), end_date.getDay());               
			diff = new Date(
		    d2.getFullYear()-d1.getFullYear(), 
		    d2.getMonth()-d1.getMonth(), 
		    d2.getDate()-d1.getDate()
			);
			var diff_time = ""+diff.getYear()+" "+"Years"+" "+diff.getMonth()+" "+"Months";
			return diff_time
		}
}

//create experience function here
function experience_create_function_temp()
{	
		if(experience_add_flag==1)
		{	
			row_no_exp = experience_list.length + 1;
			employer = $('#employer').val();
			position = $('#position').val();
			start_date = $('#experience_start_date').val();
			end_date = $('#experience_end_date').val();	
			previous_employee_id = $('#previous_employee_id').val();
			hr_contact_number = $('#hr_contact_number').val();
			reason_for_relieving = $('#reason_for_relieving').val();
			candidate_exp = $('#candidate_experience').val();
			
			temp_list_experience = ["",row_no_exp,employer,position,start_date,end_date,previous_employee_id,hr_contact_number,reason_for_relieving,candidate_exp]			
				
			experience_list.push(temp_list_experience)
			$('#experience_table').show();
			plaindatatable('candidate_experience_details', experience_list, exp_columns, 0);
			clear_function_experience();
			alert_lobibox("success", "Added Successfully");
			exp_button_display();
			status_change = true;
			
		}else if(experience_update_flag==1)
		{
			row_no_exp = list_index_experience + 1;
			employer = $('#employer').val();
			position = $('#position').val();
			start_date = $('#experience_start_date').val();
			end_date =  $('#experience_end_date').val();
			previous_employee_id = $('#previous_employee_id').val();
			hr_contact_number = $('#hr_contact_number').val();
			reason_for_relieving = $('#reason_for_relieving').val();
			candidate_exp = $('#candidate_experience').val();
			
			temp_list_experience = [list_id_experience,row_no_exp,employer,position,start_date,end_date,previous_employee_id,hr_contact_number,reason_for_relieving,candidate_exp]
					
			if (list_index_experience >= 0 ) {
			    experience_list[list_index_experience] = temp_list_experience;
			}		
			
			$('#experience_table').show();
			plaindatatable('candidate_experience_details',experience_list, exp_columns,0);
			clear_function_experience();
			alert_lobibox("success","Updated Successfully");
			exp_button_display();
			status_change = true;
		}		
}

//candidate experience details function here
$('#candidate_experience_details').on('click','tr',function(){	
	
	if(experience_list.length>0){
	
		$('.exp_update').show()
		$('.exp_add').hide()
		$('.exp_clear').show()
		
		list_index_experience = $(this).closest("tr").index();	
		list_id_experience = $('#candidate_experience_details').dataTable().fnGetData(this)[0];		
		employer = this.cells[1].innerHTML;
		position = this.cells[2].innerHTML;
		start_date = this.cells[3].innerHTML;
		end_date = this.cells[4].innerHTML;
			
		$('#employer').val(employer);
		$('#position').val(position);
		$('#experience_start_date').val(start_date);
		$('#experience_end_date').val(end_date);
		$('#previous_employee_id').val(this.cells[5].innerHTML);
		$('#hr_contact_number').val(this.cells[6].innerHTML);
		$('#reason_for_relieving').val(this.cells[7].innerHTML);
		$('#candidate_experience').val(this.cells[8].innerHTML);
	}
});

//experience create function here
function employee_experience_create_function()
{
	if(candidate_table_id)
	{	
		for(var i=0;i<experience_list.length;i++){		
			experience_list[i][4] = DateformatChange(experience_list[i][4])
			experience_list[i][5] = DateformatChange(experience_list[i][5])
		}
		
		$.ajax({	
	         type  : 'POST',
	         url   : '/ta_create_candidate_experience/',
	         async : false,
	         data: {
	             'datas': JSON.stringify(experience_list),
	             'candidate_id':candidate_table_id,
	             'delete_list':JSON.stringify(exp_delete_list),
	              csrfmiddlewaretoken : $("input[name=csrfmiddlewaretoken]").val()
	         },
	     }).done( function(json_data) {
	    	 data = JSON.parse(json_data);
		 	 var res_status = data['status'];
		 	 if(res_status == 'NTE_03')  {
		 		status_change = false;
		 		alert_lobibox("success", sysparam_datas_list[res_status]);
		 		exp_delete_list = [];
		 		$('#ta_candidate_list').val(candidate_table_id).trigger('change');
		 		clear_function_experience();
		 		drawCandidateList();
		 		$('#employee_experience_details_edit_button').hide()
		 	 }else if(res_status == 'NTE_06')  {
		 		alert_lobibox("error",sysparam_datas_list['ERR0040']);
		 	 }else  {
		 		alert_lobibox("error",sysparam_datas_list['ERR0040']);
		 	 }
	     });	
	}else
	{
		alert_lobibox("info",sysparam_datas_list['NTE_70'])
	}	
}

//Employee experience form validations here
function employee_experience_form_validation()
{
	return $('#employee_experience_details_form').valid();
}

$.validator.addMethod("alpha", function(value, element) {
    return this.optional(element) || value == value.match(/^[a-zA-Z\s]+$/);
});

//employee experience details function here
$('#employee_experience_details_form').submit(function(e) {
    e.preventDefault();    
}).validate({
   rules: {
	  employer: {
		   required: true,
		   maxlength: 50,
		   alpha: true,
	   },
	   position: {
		   required: true,
		   maxlength: 30,
	   },
	   previous_employee_id: {
		   maxlength: 20,
	   },
	   hr_contact_number: {
		   number:true,
		   maxlength:8,
		   minlength:8,
	   },
	   experience_start_date: {
		   required: true,
	   },
	   experience_end_date: {
		   required: true,
	   }
   },
   //For custom messages
   messages: {
	  employer: {
		   required: "Enter Employer Name",
		   maxlength: "Employer Name cannot exceed 50 Characters",
		   alpha: "Employer Name cannot have numbers",
	   },
	   position: {
		   required: "Enter Designation",
		   maxlength: "Designation Name cannot exceed 30 Characters",
	   },
	   previous_employee_id:{
		   maxlength: "Previous Employee id cannot exceed 20 Characters",
	   },
	   hr_contact_number: {
		   number: "Contact Number cannot have Characters",
		   maxlength: "Contact Number cannot exceed 8 Digits",
		   minlength: "Contact Number cannot lesser than 8 Digits",		   
	   },
	   experience_start_date: {
		   required: "Enter Start Date",
	   },
	   experience_end_date: {
		   required: "Enter End Date",
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

//experience button display function here
function exp_button_display()
{
	if($('#employee_experience_details_edit_button').css('display') == 'none')
	{
		$('#employee_experience_details_edit_button').show()
	}
}



