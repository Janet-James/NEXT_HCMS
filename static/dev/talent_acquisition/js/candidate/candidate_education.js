var list_index_education,list_id_education,status=false;
var edu_delete_list=[];
var cand_id;
$( document ).ready(function() {
	
});
var education_update_flag=0,education_add_flag=0,education_remove_flag=0;
	
//Employee education details temp create function here 
$( "#education_details_create_button" ).click(function() {
	
	if(candidate_table_id)
	{
		if(employee_education_form_validation())
		{
			education_add_flag=1
			education_remove_flag=0
			education_update_flag=0
			education_create_function_temp();
		}	
	}else
	{
		alert_lobibox("info","Employee Record not Selected")
	}
});

//Employee education details temp edit function here 
$( "#education_details_edit_button" ).click(function() {
	if(list_index_education!=undefined)
	{	
		if(employee_education_form_validation())
		{
			education_add_flag=0
			education_remove_flag=0
			education_update_flag=1
			education_create_function_temp();
		}
	}else
	{
		alert_lobibox("info","Education not Selected")
	}	
});

//Employee skills details temp delete function here 
$( "#education_details_delete_button" ).click(function() {	
	if(list_index_education!=undefined)
	{	
		education_remove_flag=1
		education_add_flag=0
		education_update_flag=0
		
		if(!(education_list[list_index_education][0]==""))
		{
			edu_delete_list.push(education_list[list_index_education][0])
		}
		education_list.splice(list_index_education, 1);		
		
		for(var i=0;i<education_list.length;i++)
		{
			education_list[i][1] = i+1;
		}
		
		$('#education_table').show();
		plaindatatable('candidate_education_details',education_list, edu_columns,0);	
		clear_function_education();	
		alert_lobibox("success","Removed Successfully");
		edu_button_display();
		status_change = true;		
	}else
	{
		alert_lobibox("info","Education not Selected")
	}	
});

// cancel details functions here
$("#education_details_cancel_button").click(function() {	
	clear_function_education();
});

// cancel details function here
$("#employee_education_details_cancel_button").click(function() {		
	clear_function_education();
});

// education details function here
$("#employee_education_details_edit_button").click(function() {
	employee_education_create_function();
});

//$("#employee_education_details_delete_button").click(function() {
//	employee_education_create_function();
//});
//clear education function here
function clear_function_education()
{ 
	$('.error').html("");
	$('#employee_education_details_form')[0].reset()
	$('.edu_update').hide()
	$('.edu_add').show()	
}

//education create function here
function education_create_function_temp()
{	
	if(education_add_flag==1)
	{	
		row_no_edu = education_list.length + 1;
		university = $('#university').val();
		institution_name = $('#institution_name').val();
		duration = $('#duration').val();
		year_of_passed_out = $('#year_of_passed_out').val();
		cgpa = $('#cgpa').val();
		percentage = $('#percentage').val();
		course_name = $('#course_name').val();
		certificate_status_edu = $("input[name='verification_education']:checked").val()
		
		if(!certificate_status_edu)
		{
			certificate_status_edu = "Not Verified"
		}
		
		if(!cgpa){
			cgpa = 0;
		}
		if(!percentage){
			percentage = 0;
		}
		
		temp_list_education = ["",row_no_edu,university,year_of_passed_out,institution_name,duration,cgpa,percentage,course_name]
		
		education_list.push(temp_list_education)
		$('#education_table').show();
		plaindatatable('candidate_education_details',education_list, edu_columns,0);	
		clear_function_education();
		alert_lobibox("success","Added Successfully");
		edu_button_display();
		status_change = true;
		
	}else if(education_update_flag==1)
	{
		row_no_edu = list_index_education + 1;
		university = $('#university').val();
		institution_name = $('#institution_name').val();
		duration = $('#duration').val();
		year_of_passed_out = $('#year_of_passed_out').val();
		cgpa = $('#cgpa').val();
		percentage = $('#percentage').val();
		course_name = $('#course_name').val();

		if(!cgpa){
			cgpa = 0;
		}
		if(!percentage){
			percentage = 0;
		}

		temp_list_education = [list_id_education,row_no_edu,university,year_of_passed_out,institution_name,duration,cgpa,percentage,course_name]	
		
		if (list_index_education >= 0 ) {
		    education_list[list_index_education] = temp_list_education;
		}		
		
		$('#education_table').show();
		plaindatatable('candidate_education_details',education_list, edu_columns,0);	
		clear_function_education();
		alert_lobibox("success","Updated Successfully");
		edu_button_display();
		status_change = true;
	}	
}

//candidate education details row click function here
$('#candidate_education_details').on('click','tr',function(){	
	
	if(education_list.length>0){		
		 		
		$('.edu_add').hide()
		$('.edu_update').show()
		$('.edu_clear').show()
	
		list_index_education = $(this).closest("tr").index();	
		list_id_education = $('#candidate_education_details').dataTable().fnGetData(this)[0];	
		university = this.cells[1].innerHTML;
		year_of_passed_out = this.cells[2].innerHTML;
		institution_name = this.cells[3].innerHTML;
		duration = this.cells[4].innerHTML;
		cgpa = this.cells[5].innerHTML;
		percentage = this.cells[6].innerHTML;
		course_name = this.cells[7].innerHTML;
		
		$('#university').val(university);
		$('#institution_name').val(institution_name);
		$('#duration').val(duration);
		$('#year_of_passed_out').val(year_of_passed_out);
		$('#cgpa').val(cgpa);
		$('#percentage').val(percentage);
		$('#course_name').val(course_name);
	}
});

//candidate education create function here
function employee_education_create_function()
{	
	if(candidate_table_id)
	{				
		$.ajax({	
	         type  : 'POST',
	         url   : '/ta_create_candidate_education/',
	         async : false,
	         data: {
	             'datas': JSON.stringify(education_list),
	             'candidate_id': candidate_table_id,
	             'delete_list':JSON.stringify(edu_delete_list),
	              csrfmiddlewaretoken : $("input[name=csrfmiddlewaretoken]").val()
	          },
	     }).done( function(json_data) {
	    	 data = JSON.parse(json_data);
		 	 var res_status = data['status'];
		 	 if(res_status == 'NTE_03')  {
		 		status_change = false;
		 		alert_lobibox("success", sysparam_datas_list[res_status]);
		 		edu_delete_list = [];
		 		$('#ta_candidate_list').val(candidate_table_id).trigger('change');
		 		clear_function_education();
		 		drawCandidateList();
		 		$('#employee_education_details_edit_button').hide()
		 	 }else if(res_status == 'NTE_06')  {
		 		alert_lobibox("error", sysparam_datas_list['ERR0040']);
		 	 }else  {
		 		alert_lobibox("error", sysparam_datas_list['ERR0040']);
		 	 }
	     });
	}else
	{
		alert_lobibox("info",sysparam_datas_list['NTE_69'])
	}	
}


$.validator.addMethod("alpha", function(value, element) {
    return this.optional(element) || value == value.match(/^[a-zA-Z\s]+$/);
});
$.validator.addMethod("grade", function(value, element) {
    return this.optional(element) || value == value.match(/^[a-zA-Z0-9+\s]+$/);
});
$.validator.addMethod("year_of_passed_out_check", function(value, element) {
	var thisYear = (new Date()).getFullYear()+5;  
    return value >= 1950 && value <= thisYear ? true :false;
});
$.validator.addMethod("percentage_number", function(value, element) {
    // allow any non-whitespace characters as the host part
	return this.optional( element ) || /^\d{2}([.])\d{2}$/.test( value );    
}, '');

//form validation function here
$('#employee_education_details_form').submit(function(e) {
    e.preventDefault();    
}).validate({
   rules: {
	   cgpa: {
		   grade: true,		   
	   },
	   percentage: {
		   percentage_number: true,
	   },
	   year_of_passed_out: {
           required: true,
           number:true,
           year_of_passed_out_check:true,
           minlength:4,
       },
	   university: {
		    required: true,
		    maxlength: 100,
		    alpha: true,
	   },
   },
   //For custom messages
   messages: {
	   cgpa: {
		   grade: "Grade should be Correct format",
       },
       percentage: {
    	   percentage_number: "Percentage format 00.00 to 99.99",
       },
       year_of_passed_out: {
           required: "Enter Year of Passed Out",
           number: "Year of passed out cannot be a Characters",
           year_of_passed_out_check : "Year should be 1950 to Future 5 Years only",
           minlength: "Pass out year is Invalid",
       },
       university: {
    	   required: "Enter University Name",
    	   maxlength: "University name cannot exceed 100 Characters",
    	   alpha: "University Name cannot have Numbers", 	     
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

//Employee education form validations here
function employee_education_form_validation()
{
	return $('#employee_education_details_form').valid();
}

//education button display function here
function edu_button_display()
{
	if($('#employee_education_details_edit_button').css('display') == 'none')
	{
		$('#employee_education_details_edit_button').show()
	}
}

//percentage function here
$('#percentage').keyup(function() {
	var $this = $(this);
	if($this.val()){
		if($this.val().length == 2 ){
			$this.val($this.val()+'.');  
		}else{
			return true;
		}
	}
});
