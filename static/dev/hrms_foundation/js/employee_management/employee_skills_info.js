var list_index_skills,list_id_skills,id="";
var delete_list_skills=[];
var skill_columns = [{'title':'Id'},{'title':'No'},{'title':'Skill Name'},{'title':'Experience'},{'title':'Rating'},{'title':'Skill Type'},{'title':'Upload Details'},{'title':'Upload ID'},{'title':'skill_type_id'}];
$( document ).ready(function() {

});
var skills_update_flag=0,skills_add_flag=0,skills_remove_flag=0;	
	
//Employee skills details temp create function here 
$( "#skills_create_button" ).click(function() {	
	if(employee_table_id)
	{
		if(employee_skills_form_validation())
		{
			var doc_id = saveDocAttachment(); //For calling document upload function
			skills_add_flag=1
			skills_remove_flag=0
			skills_update_flag=0
			skills_create_function_temp(doc_id);
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
			if(doc_id == 0 || doc_id == null)
			{
				doc_id = saveDocAttachment(); //For calling document upload function
			}else 
			{
				doc_id = updateDocAttachment();
			}
			skills_add_flag=0
			skills_remove_flag=0
			skills_update_flag=1
			skills_create_function_temp(doc_id);
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
		plaindatatable('employee_skill_details',skills_list, skill_columns,[0,6]);	
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

function clear_function_skills()
{ 
	$('.errormessage').html("");
	$('.fileinput-filename').html('');//upload file update here
	document.getElementById('employee_skills_details_form').reset()
	$('#employee_skill_details tbody tr').removeClass('selected');
	$('.skill_update').hide()
	$('.skill_add').show()	
	$('#employee_skill_type').val('0').trigger('change')
}

//var skills_list=[];
//var skills_temp_id="";
//var project_list = []

function skills_create_function_temp(doc_id)
{
	var file_name = $('input[type=file][id$="skill_doc"]').val().replace(/C:\\fakepath\\/i, '').split('.')[0]+'_'+doc_id;
	var file_ext = $('input[type=file][id$="skill_doc"]').val().replace(/C:\\fakepath\\/i, '').split('.')[1];
	var full_file_name = file_name+'.'+file_ext;
	//assign the empty values null reason is backend
	if(doc_id == 0)
	{
		doc_id=null
	}
	if(skills_add_flag==1)
	{	
		row_no_skills = skills_list.length + 1;
		skill_name = $('#employee_skill_name').val();
		experience = $('#employee_experience').val();
		rating = $('#employee_skill_rating').val();
		skill_type = validationTypeFields("#employee_skill_type");
		skill_type_id = validationFields($("#employee_skill_type").val());
		if(file_ext==undefined){
			var file_names = $('.fileinput-filename').html() != '' ? $('.fileinput-filename').html() : '' ;
			temp_list_skills = ["",row_no_skills,skill_name,experience,rating,skill_type,file_names,doc_id,skill_type_id]	
		}else{
			temp_list_skills = ["",row_no_skills,skill_name,experience,rating,skill_type,full_file_name,doc_id,skill_type_id]
		}
			
		skills_list.push(temp_list_skills)			
		$('#skills_table').show();
		plaindatatable('employee_skill_details',skills_list, skill_columns,[0,7,8]);	
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
		
		if(file_ext==undefined)
		{	
			var file_names = $('.fileinput-filename').html() != '' ? $('.fileinput-filename').html() : '' ;
			temp_list_skills = [list_id_skills,row_no_skills,skill_name,experience,rating,skill_type,file_names,doc_id,skill_type_id]
		}else
		{
			temp_list_skills = [list_id_skills,row_no_skills,skill_name,experience,rating,skill_type,full_file_name,doc_id,skill_type_id]
		}
		
		if (list_index_skills >= 0 ) {
		    skills_list[list_index_skills] = temp_list_skills;
		}		
		
		$('#skills_table').show();
		plaindatatable('employee_skill_details',skills_list, skill_columns,[0,7,8]);	
		clear_function_skills();
		alert_lobibox("success","Updated Successfully");
		skills_button_display();
		status_change = true;
	}	
}

$('#employee_skill_details').on('click','tr',function(){	
	
	if(skills_list.length>0)
	{
		$('.skill_add').hide()
		$('.skill_update').show()		
		
		list_index_skills = $(this).closest("tr").index();	
		dataTableAcitveRowAdd('employee_skill_details',list_index_skills)
		list_id_skills = $('#employee_skill_details').dataTable().fnGetData(this)[0];	
		skill_name = this.cells[1].innerHTML;
		experience = this.cells[2].innerHTML;
		rating = this.cells[3].innerHTML;
		skill_type_id = $('#employee_skill_details').dataTable().fnGetData(this)[8];
		$('#employee_skill_type').val(skill_type_id).trigger('change')
		
	//	$('#employee_skill_type').val($("#employee_skill_type option:contains('"+skill_type+"')").val()).change();	
		
		doc_id = $('#employee_skill_details').dataTable().fnGetData(this)[7];
		$('#employee_skill_name').val(skill_name);
		$('#employee_experience').val(experience);
		$('#employee_skill_rating').val(rating);
		$('.fileinput-filename').html(this.cells[5].innerHTML);////upload file update here
	}
});

function employee_skills_create_function(employee_id,skills_update_flag)
{	
	if(employee_table_id)
	{
		$.ajax({	
	         type  : 'POST',
	         url   : '/hrms_employee_skills_create/',
	         async : false,
	         data: {
	             'datas': JSON.stringify(skills_list),
	             'employee_id':employee_table_id,
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
		 		$('#hrms_employee_list').val(employee_table_id).trigger('change');
		 		clear_function_skills();
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
		   required: true,
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
           required: "Enter Experience",
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