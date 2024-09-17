var list_index_skills,list_id_skills,id="";
var delete_list_skills=[];
$( document ).ready(function() {

});
var skills_update_flag=0,skills_add_flag=0,skills_remove_flag=0;	
	
//Employee skills details temp create function here 
$( "#skills_create_button" ).click(function() {	
	if(candidate_table_id)
	{
		if(employee_skills_form_validation())
		{
			skills_add_flag=1
			skills_remove_flag=0
			skills_update_flag=0
			skills_create_function_temp();
		}
	}else
	{
		alert_lobibox("info",sysparam_datas_list['NTE_66'])
	}	
});

//Employee skills details temp edit function here 
$( "#skills_edit_button" ).click(function() {
	if(list_index_skills!=undefined)
	{ 
		if(employee_skills_form_validation())
		{
			skills_add_flag=0
			skills_remove_flag=0
			skills_update_flag=1
			skills_create_function_temp();
		}
	}else
	{
		alert_lobibox("info",sysparam_datas_list['NTE_74'])
	}	
});

//Employee skills details temp delete function here 
$( "#skills_delete_button" ).click(function() {	
	if(list_index_skills!=undefined)
	{ 	
		skills_remove_flag=1
		skills_add_flag=0
		skills_update_flag=0	
		if(!(skills_list[list_index_skills][0]==""))
		{
			delete_list_skills.push(skills_list[list_index_skills][0])
		}
	    skills_list.splice(list_index_skills, 1);
	    
	    for(var i=0;i<skills_list.length;i++)
		{
	    	skills_list[i][1] = i+1;
		}
	    
		$('#skills_table').show();
		plaindatatable('candidate_skill_details',skills_list, skills_columns,[0,6]);	
		clear_function_skills();
		alert_lobibox("success","Removed Successfully");
		skills_button_display();
		status_change=true;
	 }else
	 {
		 alert_lobibox("info",sysparam_datas_list['NTE_74'])
	 }
});

// cancel functions here
$("#skills_cancel_button").click(function() {	
	clear_function_skills();
});

//cancel functions here
$("#employee_skills_cancel_button").click(function() {	
	clear_function_skills();	
});

$( "#employee_skills_edit_button" ).click(function() {
	employee_skills_create_function();
});

//$( "#employee_skills_delete_button" ).click(function() {
//	employee_skills_create_function();
//});

//clear skills function here
function clear_function_skills()
{ 
	$('.errormessage').html("");
	document.getElementById('employee_skills_details_form').reset()
	$('.skill_update').hide()
	$('.skill_add').show()	
	$('#employee_skill_type').val('0').trigger('change')
}

//create skill function here
function skills_create_function_temp()
{
	
	if(skills_add_flag==1)
	{	
		row_no_skills = skills_list.length + 1;
		skill_name = $('#employee_skill_name').val();
		experience = $('#employee_experience').val();
		rating = $('#employee_skill_rating').val();
		skill_type = validationTypeFields("#employee_skill_type");
		skill_type_id = validationFields($("#employee_skill_type").val());
			
		temp_list_skills = ["",row_no_skills,skill_name,experience,rating,skill_type,skill_type_id]	
		
			
		skills_list.push(temp_list_skills)			
		$('#skills_table').show();
		plaindatatable('candidate_skill_details',skills_list, skills_columns,[0,6]);	
		clear_function_skills();
		alert_lobibox("success","Added Successfully");
		skills_button_display();
		status_change = true;
		
	}else if(skills_update_flag==1)
	{
		row_no_skills = list_index_skills + 1;
		skill_name = $('#employee_skill_name').val();
		experience = $('#employee_experience').val();
		rating = $('#employee_skill_rating').val();		
		skill_type = validationTypeFields("#employee_skill_type");
		skill_type_id = validationFields($("#employee_skill_type").val());		
		
		
		temp_list_skills = [list_id_skills,row_no_skills,skill_name,experience,rating,skill_type,skill_type_id]
				
		if (list_index_skills >= 0 ) {
		    skills_list[list_index_skills] = temp_list_skills;
		}		
		
		$('#skills_table').show();
		plaindatatable('candidate_skill_details',skills_list, skills_columns,[0,6]);	
		clear_function_skills();
		alert_lobibox("success","Updated Successfully");
		skills_button_display();
		status_change = true;
	}	
}

//candidate skill details click event function here
$('#candidate_skill_details').on('click','tr',function(){	
	
	if(skills_list.length>0)
	{
		$('.skill_add').hide()
		$('.skill_update').show()		
		
		list_index_skills = $(this).closest("tr").index();	
		list_id_skills = $('#candidate_skill_details').dataTable().fnGetData(this)[0];	
		skill_name = this.cells[1].innerHTML;
		experience = this.cells[2].innerHTML;
		rating = this.cells[3].innerHTML;
		skill_type_id = $('#candidate_skill_details').dataTable().fnGetData(this)[6];
		$('#employee_skill_type').val(skill_type_id).trigger('change')
		
	//	$('#employee_skill_type').val($("#employee_skill_type option:contains('"+skill_type+"')").val()).change();	
		
		$('#employee_skill_name').val(skill_name);
		$('#employee_experience').val(experience);
		$('#employee_skill_rating').val(rating);
	}
});

//employee skill create function here
function employee_skills_create_function(employee_id,skills_update_flag)
{	
	if(candidate_table_id)
	{
		$.ajax({	
	         type  : 'POST',
	         url   : '/ta_create_candidate_skills/',
	         async : false,
	         data: {
	             'datas': JSON.stringify(skills_list),
	             'candidate_id':candidate_table_id,
	             'delete_list':JSON.stringify(delete_list_skills),
	              csrfmiddlewaretoken : $("input[name=csrfmiddlewaretoken]").val()
	         },
	     }).done( function(json_data) {
	    	 data = JSON.parse(json_data);
		 	 var res_status = data['status'];
		 	 if(res_status == 'NTE_03')  {
		 		status_change = false;
		 		alert_lobibox("success", sysparam_datas_list[res_status]);
		 		delete_list_skills = [];
		 		$('#ta_candidate_list').val(candidate_table_id).trigger('change');
		 		clear_function_skills();
		 		drawCandidateList();
		 		$('#employee_skills_edit_button').hide()		 		
		 	 }else if(res_status == 'NTE_06')  {
		 		alert_lobibox("error",sysparam_datas_list['ERR0040']);
		 	 }
		 	 else  {
		 		alert_lobibox("error",sysparam_datas_list['ERR0040']);
		 	 }
	     });
	}else
	{
		alert_lobibox("info",sysparam_datas_list['NTE_66'])
	}	
}

$.validator.addMethod("custom_experience", function(value, element) {
    return value >= 0 && value < 1000 ? true :false;
 });

$.validator.addMethod("custom_rating", function(value, element) {
    return value >= 0 && value <= 10 ? true :false;
 });

//employee skills details form validation here
$('#employee_skills_details_form').submit(function(e) {
    e.preventDefault();    
}).validate({
   rules: {
	   employee_skill_name: {
		   required: true,	
		   maxlength: 100,		   
	   },
	   employee_experience: {
		   number:true,		  
		   custom_experience:true,
		   maxlength: 3,
           minlength: 1,
	   },	
	   employee_skill_rating: {
           required: true,
           number:true,
           custom_rating:true,
           maxlength: 2,
           minlength: 1,
       },   
   },
   //For custom messages
   messages: {
	   employee_skill_name: {
           required: "Enter Skill Name",
           maxlength: "Skill Name cannot exceed 100 Characters",          
       },
       employee_experience: {
    	   number: "Experience should be in Numbers",
           maxlength: "Month cannot exceed 3 Digits",
           custom_experience : "The Value should be valid",
           minlength: "Month cannot lesser than 1 Digit",             
       }, 
       employee_skill_rating: {
    	   required: "Enter Rating",
           number: "Rating should be in Numbers",
           custom_rating : "The Value should be 0 to 10",
           maxlength: "Rating should be out of 10",
           minlength: "Rating should be Minimum 0",  
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

//Employee primary form validations here
function employee_skills_form_validation()
{
	return $('#employee_skills_details_form').valid();
}

function skills_button_display()
{
	if($('#employee_skills_edit_button').css('display') == 'none')
	{
		$('#employee_skills_edit_button').show()
	}
}

//drop down validation
function validationTypeFields(id){
	var active_id = $(id+" option:selected").val();
	return active_id == "0" ? " " : $(id+" option:selected").text().toString();
}