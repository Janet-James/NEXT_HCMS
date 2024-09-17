var list_index_education,list_id_education,status=false;
var edu_delete_list=[];
var edu_columns = [{'title':'Id'},{'title':'No'},{'title':'Board/University'},{'title':'Specialization/Major '},{'title':'Graduated Year'},{'title':'Institute/School'},{'title':'Duration'},
                   {'title':'Grade'},{'title':'Percentage'},{'title':'Degree'},{'title':'Certificate Verification'},
                   {'title':'Upload Details'},{'title':'Upload ID'}];

$( document ).ready(function() {
});
var education_update_flag=0,education_add_flag=0,education_remove_flag=0;
	
//Employee education details temp create function here 
$( "#education_details_create_button" ).click(function() {
	
	if(employee_table_id)
	{
		if(employee_education_form_validation())
		{
			var doc_id = saveDocAttachment();
			education_add_flag=1
			education_remove_flag=0
			education_update_flag=0
			education_create_function_temp(doc_id);
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
			if(doc_id == 0 || doc_id == null)
			{
				doc_id = saveDocAttachment(); //For calling document upload function
			}else 
			{
				doc_id = updateDocAttachment();
			}
			education_add_flag=0
			education_remove_flag=0
			education_update_flag=1
			education_create_function_temp(doc_id);
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
		plaindatatable('employee_education_details',education_list, edu_columns,[0,11]);	
		clear_function_education();	
		alert_lobibox("success","Removed Successfully");
		edu_button_display();
		status_change = true;		
	}else
	{
		alert_lobibox("info","Education not Selected")
	}	
});

// cancel functions here
$("#education_details_cancel_button").click(function() {	
	clear_function_education();
});

$("#employee_education_details_cancel_button").click(function() {		
	clear_function_education();
});

$("#employee_education_details_edit_button").click(function() {
	employee_education_create_function();
});

//$("#employee_education_details_delete_button").click(function() {
//	employee_education_create_function();
//});

function clear_function_education()
{ 
	$('.error').html("");
	$('.fileinput-filename').html('');//upload file update here
	$('#employee_education_details_form')[0].reset()
	$('.edu_update').hide()
	$('.edu_add').show()	
	$('#employee_education_details tbody tr').removeClass('selected');
}

function education_create_function_temp(doc_id)
{
	var file_name = $('input[type=file][id$="edu_doc"]').val().replace(/C:\\fakepath\\/i, '').split('.')[0]+'_'+doc_id;
	var file_ext = $('input[type=file][id$="edu_doc"]').val().replace(/C:\\fakepath\\/i, '').split('.')[1];
	var full_file_name = file_name+'.'+file_ext;
	
	if(doc_id==0)
	{
		doc_id = null
	}
	
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
		specialization = $('#specialization').val();
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
		if(file_ext==undefined)
		{	
			var file_names = $('.fileinput-filename').html() != '' ? $('.fileinput-filename').html() : '' ;
			temp_list_education = ["",row_no_edu,university,specialization,year_of_passed_out,institution_name,duration,cgpa,percentage,course_name,certificate_status_edu,file_names,doc_id]
			console.log(temp_list_education)
		}else
		{
			temp_list_education = ["",row_no_edu,university,specialization,year_of_passed_out,institution_name,duration,cgpa,percentage,course_name,certificate_status_edu,full_file_name,doc_id]
		}
		education_list.push(temp_list_education)
		$('#education_table').show();
		plaindatatable('employee_education_details',education_list, edu_columns,[0,11]);	
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
		specialization = $('#specialization').val();
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
		
		if(file_ext==undefined)
		{
			var file_names = $('.fileinput-filename').html() != '' ? $('.fileinput-filename').html() : '' ;
			temp_list_education = [list_id_education,row_no_edu,university,specialization,year_of_passed_out,institution_name,duration,cgpa,percentage,course_name,certificate_status_edu,file_names,doc_id]	
		}else
		{
			temp_list_education = [list_id_education,row_no_edu,university,specialization,year_of_passed_out,institution_name,duration,cgpa,percentage,course_name,certificate_status_edu,full_file_name,doc_id]
		}
		if (list_index_education >= 0 ) {
		    education_list[list_index_education] = temp_list_education;
		}		
		
		$('#education_table').show();
		plaindatatable('employee_education_details',education_list, edu_columns,[0,11]);	
		clear_function_education();
		alert_lobibox("success","Updated Successfully");
		edu_button_display();
		status_change = true;
		
	}	
}
$('#employee_education_details').on('click','tr',function(){	
	
	if(education_list.length>0){		
		 		
		$('.edu_add').hide()
		$('.edu_update').show()
		$('.edu_clear').show()
	
		list_index_education = $(this).closest("tr").index();	
		dataTableAcitveRowAdd('employee_education_details',list_index_education);
		list_id_education = $('#employee_education_details').dataTable().fnGetData(this)[0];	
		university = this.cells[1].innerHTML;
		specialization = this.cells[2].innerHTML;	
		year_of_passed_out = this.cells[3].innerHTML;
		institution_name = this.cells[4].innerHTML;
		duration = this.cells[5].innerHTML;
		cgpa = this.cells[6].innerHTML;
		percentage = this.cells[7].innerHTML;
		course_name = this.cells[8].innerHTML;	
		var status = this.cells[9].innerHTML; 
		doc_id = $('#employee_education_details').dataTable().fnGetData(this)[11];
	
		$('#university').val(university);
		$('#institution_name').val(institution_name)
		$('#duration').val(duration)
		$('#year_of_passed_out').val(year_of_passed_out);
		$('#cgpa').val(cgpa);
		$('#percentage').val(percentage);
		$('#course_name').val(course_name);
		$('#specialization').val(specialization);
		$('.fileinput-filename').html(this.cells[10].innerHTML);//upload file update here
		
		if(status == "Verified")
		{
			$('#verified_edu').prop('checked', 'checked');
			
		}else if(status == "Not Verified")
		{
			$('#not_verified_edu').prop('checked', 'checked');
		}	
		
	}
});


function employee_education_create_function(employee_id)
{
	if(employee_table_id)
	{				
		change_verification_status_education()		
		$.ajax({	
	         type  : 'POST',
	         url   : '/hrms_employee_education_create/',
	         async : false,
	         data: {
	             'datas': JSON.stringify(education_list),
	             'employee_id': employee_table_id,
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
		 		$('#hrms_employee_list').val(employee_table_id).trigger('change');
		 		clear_function_education();
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

function change_verification_status_education()
{
	for(var i=0;i<education_list.length;i++)
	{
		if(education_list[i][11] == 0)
		{	
			education_list[i][11] = null;
		}
		
		if(education_list[i][10] == "Verified")
		{
			education_list[i][10] = true
			
		}else if(education_list[i][10] == "Not Verified")
		{
			education_list[i][10] = false	
		}
	}	
}

function change_education_display_status()
{
	for(var i=0;i<education_list.length;i++)
	{
		if(education_list[i][10] == true)
		{
			education_list[i][10] = "Verified"
			
		}else if(education_list[i][10] == false)
		{
			education_list[i][10] = "Not Verified"			
		}
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
	   specialization: {
		   required: true,
	   }
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
    	   required: "Enter Board/University",
    	   maxlength: "Board/University cannot exceed 100 Characters",
    	   alpha: "Board/University cannot have Numbers", 	     
       },
       specialization: {
    	   required: "Enter Specialization/Major",
       }
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

function edu_button_display()
{
	if($('#employee_education_details_edit_button').css('display') == 'none')
	{
		$('#employee_education_details_edit_button').show()
	}
}

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
