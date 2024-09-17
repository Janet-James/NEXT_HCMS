var list_index_certification,list_id_certification;
var certification_delete_list=[];
var certification_columns = [{'title':'Id'},{'title':'No'},{'title':'Name'},{'title':'Certification Number'},{'title':'Issued By'},{'title':'Start Date'},{'title':'End Date'},
                             {'title':'Certificate Verification'},{'title':'Upload Details'},{'title':'Upload ID'}];

$( document ).ready(function() {
		
});
var certification_update_flag=0,certification_add_flag=0,certification_remove_flag=0;
	
//Employee certification details temp create function here 
$( "#certification_details_create_button" ).click(function() {
	
	if(employee_table_id)
	{
		if(employee_certification_form_validation())
		{
			var doc_id = saveDocAttachment();
			certification_add_flag=1
			certification_remove_flag=0
			certification_update_flag=0
			certification_create_function_temp(doc_id);
		}	
	}else
	{
		alert_lobibox("info",sysparam_datas_list['NTE_66'])
	}	
});

//Employee certification details temp edit function here 
$( "#certification_details_edit_button" ).click(function() {
	if(list_index_certification!=undefined)
	{
	if(employee_certification_form_validation())
	{
		if(doc_id == 0 || doc_id == null)
		{
			doc_id = saveDocAttachment(); //For calling document upload function
		}else 
		{
			doc_id = updateDocAttachment();
		}
		certification_add_flag=0
		certification_remove_flag=0
		certification_update_flag=1
		certification_create_function_temp(doc_id);
	}
	}else
	{
		alert_lobibox("info","Certification not Selected")
	}	
});

//Employee certification details temp delete function here 
$( "#certification_details_delete_button" ).click(function() {
	
	if(list_index_certification!=undefined)
	{	
		certification_remove_flag=1
		certification_add_flag=0
		certification_update_flag=0
		
		if(!(certification_list[list_index_certification][0]==""))
		{
			certification_delete_list.push(certification_list[list_index_certification][0])
		}
		certification_list.splice(list_index_certification, 1);		
		
		for(var i=0;i<certification_list.length;i++)
		{
			certification_list[i][1] = i+1;
		}		
		
		$('#certification_table').show();
		plaindatatable('employee_certification_details',certification_list, certification_columns,[0,9]);	
		clear_function_certification();	
		alert_lobibox("success","Removed Successfully");
		certificate_button_display();
		status_change = true;	
	}else
	{
		alert_lobibox("info",sysparam_datas_list['NTE_67'])
	}	
});

// cancel functions here
$("#certification_details_cancel_button").click(function() {	
	clear_function_certification();
});

$("#employee_certification_details_edit_button").click(function() {
	employee_certification_create_function();
});

$("#employee_certification_details_cancel_button").click(function() {
	clear_function_certification();	
});

function clear_function_certification()
{ 
	$('.errormessage').html("");	
	document.getElementById('employee_certification_details_form').reset();
	$('.fileinput-filename').html('');//upload file update here
	$('.certificate_update').hide()
	$('.certificate_add').show()
	$('#employee_certification_details tbody tr').removeClass('selected');
}

$( "#certification_start_date" ).change(function() {
	var from =   DateformatChange($("#certification_start_date").val());
	var to =  DateformatChange($("#certification_end_date").val());

	var sDate = new Date(from);
	var eDate = new Date(to);
	if(from!= null && to!= null && sDate> eDate)
	{
		  $("#certification_date_error").html("End Date cannot be lesser than start date")
	}
	else
	{
		  $("#certification_date_error").html("")		 
	}
});


$( "#certification_end_date" ).change(function() {
	var from = DateformatChange($("#certification_start_date").val());
	var to =  DateformatChange($("#certification_end_date").val());

	var sDate = new Date(from);
	var eDate = new Date(to);
	if(from!= null && to!= null && sDate> eDate)
	{
		  $("#certification_date_error").html("End Date cannot be lesser than start date")
	}
	else
	{
		  $("#certification_date_error").html("")		 
	}
});


function certification_create_function_temp(doc_id)
{
	var file_name = $('input[type=file][id$="certificate_doc"]').val().replace(/C:\\fakepath\\/i, '').split('.')[0]+'_'+doc_id;
	var file_ext = $('input[type=file][id$="certificate_doc"]').val().replace(/C:\\fakepath\\/i, '').split('.')[1];
	var full_file_name = file_name+'.'+file_ext;
	
	if(doc_id==0)
	{
		doc_id = null
	}
	
	if(certification_add_flag==1)
	{	
		row_no_certificate = certification_list.length + 1;
		decription = $('#certification_description').val();
		certification_no = $('#certification_no').val();
		certification_issued_by = $('#certification_issued_by').val();
		certification_start_date = $('#certification_start_date').val();
		certification_end_date = $('#certification_end_date').val();
		
		certificate_status = $("input[name='verification_certificate']:checked").val()
		
		if(!certificate_status)
		{
			certificate_status = "Not Verified"
		}	
		if(file_ext==undefined)
		{	
			var file_names = $('.fileinput-filename').html() != '' ? $('.fileinput-filename').html() : '' ;
			temp_list_certification = ["",row_no_certificate,decription,certification_no,certification_issued_by,certification_start_date,certification_end_date,certificate_status,file_names,doc_id]
		}else
		{
			temp_list_certification = ["",row_no_certificate,decription,certification_no,certification_issued_by,certification_start_date,certification_end_date,certificate_status,full_file_name,doc_id]
		}
				
		certification_list.push(temp_list_certification)		
		
		$('#certification_table').show();
		plaindatatable('employee_certification_details',certification_list, certification_columns,[0,9]);	
		clear_function_certification();
		alert_lobibox("success","Added Successfully");
		certificate_button_display();
		status_change = true;
		
	}else if(certification_update_flag==1)
	{
		row_no_certificate = list_index_certification + 1;
		decription = $('#certification_description').val();
		certification_no = $('#certification_no').val();
		certification_issued_by = $('#certification_issued_by').val();
		certification_start_date = $('#certification_start_date').val();
		certification_end_date = $('#certification_end_date').val();
		
		certificate_status = $("input[name='verification_certificate']:checked").val()
		
		if(!certificate_status)
		{
			certificate_status = "Not Verified"
		}	
		if(file_ext==undefined)
		{
			var file_names = $('.fileinput-filename').html() != '' ? $('.fileinput-filename').html() : '' ;
			temp_list_certification = [list_id_certification,row_no_certificate,decription,certification_no,certification_issued_by,certification_start_date,certification_end_date,certificate_status,file_names,doc_id]
		}else
		{
			temp_list_certification = [list_id_certification,row_no_certificate,decription,certification_no,certification_issued_by,certification_start_date,certification_end_date,certificate_status,full_file_name,doc_id]
		}
		
		if (list_index_certification >= 0 ) {
		    certification_list[list_index_certification] = temp_list_certification;
		}
		
		$('#certification_table').show();
		plaindatatable('employee_certification_details',certification_list, certification_columns,[0,9]);	
		clear_function_certification();
		alert_lobibox("success","Updated Successfully");
		certificate_button_display();	
		status_change = true;
	}	
}

$('#employee_certification_details').on('click','tr',function(){	
	
	if(certification_list.length>0){		
	
		$('.certificate_update').show()
		$('.certificate_add').hide()	
		$('.cettificate_clear').show()
		
		list_index_certification = $(this).closest("tr").index();	
		dataTableAcitveRowAdd('employee_certification_details',list_index_certification);
		list_id_certification = $('#employee_certification_details').dataTable().fnGetData(this)[0];	
		description = this.cells[1].innerHTML;
		certification_no = this.cells[2].innerHTML;
		issued_by = this.cells[3].innerHTML;
		start_date = this.cells[4].innerHTML;
		end_date = this.cells[5].innerHTML;
		var status = this.cells[6].innerHTML; 
		doc_id = $('#employee_certification_details').dataTable().fnGetData(this)[9]
		
		$('#certification_description').val(description);
		$('#certification_no').val(certification_no)
		$('#certification_issued_by').val(issued_by)
		$('#certification_start_date').val(start_date)
		$('#certification_end_date').val(end_date);	
		$('.fileinput-filename').html(this.cells[7].innerHTML);//upload file update here
		if(status == "Verified")
		{
			$('#verified_certificate').prop('checked', 'checked');
			
		}else if(status == "Not Verified")
		{
			$('#not_verified_certificate').prop('checked', 'checked');
		}	
	}
});


function employee_certification_create_function(employee_id)
{
	if(employee_table_id){
		
		change_verification_status_certificate()
			$.ajax({	
		         type  : 'POST',
		         url   : '/hrms_employee_certification_create/',
		         async : false,
		         data: {
		             'datas': JSON.stringify(certification_list),
		             'employee_id':employee_table_id,
		             'delete_list':JSON.stringify(certification_delete_list),
		              csrfmiddlewaretoken : $("input[name=csrfmiddlewaretoken]").val()
		         },
		     }).done( function(json_data) {
		    	 data = JSON.parse(json_data);
			 	 var res_status = data['status'];
			 	 if(res_status == 'NTE_03')  {
			 		status_change = false;
			 		alert_lobibox("success", sysparam_datas_list[res_status]);
			 		certification_delete_list = [];
			 		$('#hrms_employee_list').val(employee_table_id).trigger('change');
			 		clear_function_certification();
			 		$('#employee_certification_details_edit_button').hide()
			 	 }else if(res_status == 'NTE_06')  {
			 		alert_lobibox("error",sysparam_datas_list['ERR0040']);
			 	 }else  {
			 		alert_lobibox("error",sysparam_datas_list['ERR0040']);
			 	 }
		     });		
	}else
	{
		alert_lobibox("info",sysparam_datas_list['NTE_66'])
	}	
}

function change_verification_status_certificate()
{
	for(var i=0;i<certification_list.length;i++)
	{
		certification_list[i][5] = DateformatChange(certification_list[i][5])
		certification_list[i][6] = DateformatChange(certification_list[i][6])
		
		if(certification_list[i][9]==0)
		{
			certification_list[i][9] = null
		}
		if(certification_list[i][7] == "Verified")
		{
			certification_list[i][7] = true
			
		}else if(certification_list[i][7] == "Not Verified")
		{
			certification_list[i][7] = false	
		}
	}	
}

function change_certificate_display_status()
{
	for(var i=0;i<certification_list.length;i++)
	{
		if(certification_list[i][7] == true)
		{
			certification_list[i][7] = "Verified"
			
		}else if(certification_list[i][7] == false)
		{
			certification_list[i][7] = "Not Verified"			
		}
	}	
}

//Employee certification form validations here
function employee_certification_form_validation()
{
	return $('#employee_certification_details_form').valid();
}

$('#employee_certification_details_form').submit(function(e) {
    e.preventDefault();    
}).validate({
   rules: {
	  certification_description: {
		   required: true,
		   maxlength: 100,
	   },	
	  certification_no: {
		   required: true,
		   maxlength: 30,
	   },
	  certification_issued_by: {
		  maxlength: 100,
	  },
   },
   //For custom messages
   messages: {
	  certification_description: {
		   required: "Enter Certification Name",
		   maxlength: "Certification Name cannot exceed 100 Characters",
	   },
	  certification_no: {
		   required: "Enter Certification Number",
		   maxlength: "Certification Number cannot exceed 30 Charcters",
	   },  
	  certification_issued_by: {
		   maxlength: "Issued by cannot exceed 100 Charcters",
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

function certificate_button_display()
{
	if($('#employee_certification_details_edit_button').css('display') == 'none')
	{
		$('#employee_certification_details_edit_button').show()
	}
}

