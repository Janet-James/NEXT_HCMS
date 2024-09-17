var list_index_experience,list_id_experience;
var exp_delete_list=[];
var exp_columns = [{'title':'Id'},{'title':'No'},{'title':'Company Name'},{'title':'Designation'},{'title':'Start Date'},{'title':'End Date'},
                   {'title':'Certificate Verification'},{'title':'Employee ID'},{'title':'Reason for Relieving'},{'title':'References'},{'title':'Upload Details'},{'title':"Upload ID"}];
$( document ).ready(function() {
});
var experience_update_flag=0,experience_add_flag=0,experience_remove_flag=0;
	
//Employee experience details temp create function here 
$( "#experience_details_create_button" ).click(function() {
	if(employee_table_id)
	{
		if(employee_experience_form_validation())
		{
			var doc_id = saveDocAttachment();
			experience_add_flag=1
			experience_remove_flag=0
			experience_update_flag=0
			experience_create_function_temp(doc_id);
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
			if(doc_id == 0 || doc_id == null)
			{
				doc_id = saveDocAttachment(); //For calling document upload function
			}else 
			{
				doc_id = updateDocAttachment();
			}
			experience_add_flag=0
			experience_remove_flag=0
			experience_update_flag=1
			experience_create_function_temp(doc_id);
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
		plaindatatable('employee_experience_details',experience_list, exp_columns,[0,10]);	
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

function clear_function_experience()
{ 
	$('.errormessage').html("");	
	document.getElementById('employee_experience_details_form').reset()
	$('.fileinput-filename').html('');//upload file update here
	$('.exp_update').hide()
	$('.exp_add').show()	
	$('#employee_experience_details tbody tr').removeClass('selected');
}

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

$( "#experience_end_date" ).change(function() {
	var from = DateformatChange($("#experience_start_date").val());
	var to = DateformatChange($("#experience_end_date").val());

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

function experience_create_function_temp(doc_id)
{
	var file_name = $('input[type=file][id$="exp_doc"]').val().replace(/C:\\fakepath\\/i, '').split('.')[0]+'_'+doc_id;
	var file_ext = $('input[type=file][id$="exp_doc"]').val().replace(/C:\\fakepath\\/i, '').split('.')[1];
	var full_file_name = file_name+'.'+file_ext;
	
	if(doc_id==0)
	{
		doc_id = null
	}
	
		if(experience_add_flag==1)
		{	
			row_no_exp = experience_list.length + 1;
			employer = $('#employer').val();
			position = $('#position').val();
			start_date = $('#experience_start_date').val();
			end_date = $('#experience_end_date').val();	
			previous_employee_id = $('#previous_employee_id').val();
			hr_reason = $('#hr_reason').val();
			references = $('#references').val();
			
			certificate_status_experience = $("input[name='verification_experience']:checked").val()
			
			if(!certificate_status_experience)
			{
				certificate_status_experience = "Not Verified"
			}
			
			if(file_ext==undefined)
			{
				var file_names = $('.fileinput-filename').html() != '' ? $('.fileinput-filename').html() : '' ;
				temp_list_experience = ["",row_no_exp,employer,position,start_date,end_date,certificate_status_experience,previous_employee_id,hr_reason,references,file_names,doc_id]
			}else
			{
				temp_list_experience = ["",row_no_exp,employer,position,start_date,end_date,certificate_status_experience,previous_employee_id,hr_reason,references,full_file_name,doc_id]		
			}
				
			experience_list.push(temp_list_experience)
			$('#experience_table').show();
			plaindatatable('employee_experience_details', experience_list, exp_columns, [0,10]);
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
			hr_reason = $('#hr_reason').val();
			references = $('#references').val();
			
			certificate_status_experience = $("input[name='verification_experience']:checked").val()
			
			if(!certificate_status_experience)
			{
				certificate_status_experience = "Not Verified"
			}			
						
			if(file_ext==undefined)
			{
				var file_names = $('.fileinput-filename').html() != '' ? $('.fileinput-filename').html() : '' ;
				temp_list_experience = [list_id_experience,row_no_exp,employer,position,start_date,end_date,certificate_status_experience,previous_employee_id,hr_reason,references,file_names,doc_id]	
			}else
			{
				temp_list_experience = [list_id_experience,row_no_exp,employer,position,start_date,end_date,certificate_status_experience,previous_employee_id,hr_reason,references,full_file_name,doc_id]
			}
			
			if (list_index_experience >= 0 ) {
			    experience_list[list_index_experience] = temp_list_experience;
			}		
			
			$('#experience_table').show();
			plaindatatable('employee_experience_details',experience_list, exp_columns,[0,10]);
			clear_function_experience();
			alert_lobibox("success","Updated Successfully");
			exp_button_display();
			status_change = true;
		}		
}

$('#employee_experience_details').on('click','tr',function(){	
	
	if(experience_list.length>0){
	
		$('.exp_update').show()
		$('.exp_add').hide()
		$('.exp_clear').show()
		
		list_index_experience = $(this).closest("tr").index();
		dataTableAcitveRowAdd('employee_experience_details',list_index_experience);
		list_id_experience = $('#employee_experience_details').dataTable().fnGetData(this)[0];		
		employer = this.cells[1].innerHTML;
		position = this.cells[2].innerHTML;
		start_date = this.cells[3].innerHTML;
		end_date = this.cells[4].innerHTML;
		var status = this.cells[5].innerHTML;
		doc_id = $('#employee_experience_details').dataTable().fnGetData(this)[10];
			
		$('#employer').val(employer);
		$('#position').val(position)
		$('#experience_start_date').val(start_date)
		$('#experience_end_date').val(end_date);
		$('#previous_employee_id').val(this.cells[6].innerHTML)
		$('#hr_reason').val(this.cells[7].innerHTML)
		$('#references').val(this.cells[8].innerHTML);
		$('.fileinput-filename').html(this.cells[9].innerHTML);//upload file update here
		if(status == "Verified")
		{
			$('#verified_exp').prop('checked', 'checked');
			
		}else if(status == "Not Verified")
		{
			$('#not_verified_exp').prop('checked', 'checked');
		}	
	}
});

function employee_experience_create_function(employee_id)
{
	if(employee_table_id)
	{	
		change_verification_status_experience();		
		$.ajax({	
	         type  : 'POST',
	         url   : '/hrms_employee_experience_create/',
	         async : false,
	         data: {
	             'datas': JSON.stringify(experience_list),
	             'employee_id':employee_table_id,
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
		 		$('#hrms_employee_list').val(employee_table_id).trigger('change');
		 		clear_function_experience();
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

function change_verification_status_experience()
{
	for(var i=0;i<experience_list.length;i++)
	{
		experience_list[i][4] = DateformatChange(experience_list[i][4])
		experience_list[i][5] = DateformatChange(experience_list[i][5])
		
		if(experience_list[i][9]==0)
		{
			experience_list[i][9] = null
		}
		if(experience_list[i][6] == "Verified")
		{
			experience_list[i][6] = true
			
		}else if(experience_list[i][6] == "Not Verified")
		{
			experience_list[i][6] = false	
		}
	}	
}

function change_experience_display_status()
{
	for(var i=0;i<experience_list.length;i++)
	{
		if(experience_list[i][6] == true)
		{
			experience_list[i][6] = "Verified"
			
		}else if(experience_list[i][6] == false)
		{
			experience_list[i][6] = "Not Verified"			
		}
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
	   hr_reason: {
		   maxlength:50,
	   },
	   references: {
		   maxlength:250,
	   }
   },
   //For custom messages
   messages: {
	  employer: {
		   required: "Enter Company name",
		   maxlength: "Company name cannot exceed 50 Characters",
		   alpha: "Company name cannot have numbers",
	   },
	   position: {
		   required: "Enter Designation",
		   maxlength: "Designation Name cannot exceed 30 Characters",
	   },
	   previous_employee_id:{
		   maxlength: "Employee id cannot exceed 20 Characters",
	   },
	   hr_reason: {
		   maxlength: "Reason for Relieving Name cannot exceed 50 Characters",
	   },
	   references: {
		   maxlength: "Name, Designation, Official Email ID, Contact Number is cannot exceed 250 Characters"
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

function exp_button_display()
{
	if($('#employee_experience_details_edit_button').css('display') == 'none')
	{
		$('#employee_experience_details_edit_button').show()
	}
}



