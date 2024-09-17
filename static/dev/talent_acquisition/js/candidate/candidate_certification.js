var list_index_certification,list_id_certification;
var certification_delete_list=[];

$( document ).ready(function() {		
});
var certification_update_flag=0,certification_add_flag=0,certification_remove_flag=0;
	
//Employee certification details temp create function here 
$( "#certification_details_create_button" ).click(function() {
	
	if(candidate_table_id)
	{
		if(employee_certification_form_validation())
		{
			certification_add_flag=1
			certification_remove_flag=0
			certification_update_flag=0
			certification_create_function_temp();
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
		certification_add_flag=0
		certification_remove_flag=0
		certification_update_flag=1
		certification_create_function_temp();
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
		plaindatatable('candidate_certification_details',certification_list, certification_columns,0);	
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

//candidate certification edit function here
$("#employee_certification_details_edit_button").click(function() {
	employee_certification_create_function();
});

//candidate certification cancel function here
$("#employee_certification_details_cancel_button").click(function() {
	clear_function_certification();	
});

//candidate clear function here
function clear_function_certification()
{ 
	$('.errormessage').html("");	
	document.getElementById('employee_certification_details_form').reset();
	$('.certificate_update').hide()
	$('.certificate_add').show()	
}

//certification start date validation function here
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

//certification end date validation function here
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

//certification create function here
function certification_create_function_temp(doc_id)
{
	if(certification_add_flag==1)
	{	
		row_no_certificate = certification_list.length + 1;
		decription = $('#certification_description').val();
		certification_no = $('#certification_no').val();
		certification_issued_by = $('#certification_issued_by').val();
		certification_start_date = $('#certification_start_date').val();
		certification_end_date = $('#certification_end_date').val();
		
		temp_list_certification = ["",row_no_certificate,decription,certification_no,certification_issued_by,certification_start_date,certification_end_date]					
		certification_list.push(temp_list_certification)	
		
		$('#certification_table').show();
		plaindatatable('candidate_certification_details',certification_list, certification_columns,0);	
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
		
		temp_list_certification = [list_id_certification,row_no_certificate,decription,certification_no,certification_issued_by,certification_start_date,certification_end_date]		
		
		if (list_index_certification >= 0 ) {
		    certification_list[list_index_certification] = temp_list_certification;
		}
		
		$('#certification_table').show();
		plaindatatable('candidate_certification_details',certification_list, certification_columns,0);	
		clear_function_certification();
		alert_lobibox("success","Updated Successfully");
		certificate_button_display();	
		status_change = true;
	}	
}

//candidate certification row click function here
$('#candidate_certification_details').on('click','tr',function(){	
	
	if(certification_list.length>0){		
	
		$('.certificate_update').show()
		$('.certificate_add').hide()	
		$('.cettificate_clear').show()
		
		list_index_certification = $(this).closest("tr").index();	
		list_id_certification = $('#candidate_certification_details').dataTable().fnGetData(this)[0];	
		description = this.cells[1].innerHTML;
		certification_no = this.cells[2].innerHTML;
		issued_by = this.cells[3].innerHTML;
		start_date = this.cells[4].innerHTML;
		end_date = this.cells[5].innerHTML;
		
		$('#certification_description').val(description);
		$('#certification_no').val(certification_no)
		$('#certification_issued_by').val(issued_by)
		$('#certification_start_date').val(start_date)
		$('#certification_end_date').val(end_date);	
	}
});

//candidate certification create function here
function employee_certification_create_function()
{
	if(candidate_table_id){
		
		for(var i=0;i<certification_list.length;i++)
		{
			certification_list[i][5] = DateformatChange(certification_list[i][5])
			certification_list[i][6] = DateformatChange(certification_list[i][6])			
		}	
		
			$.ajax({	
		         type  : 'POST',
		         url   : '/ta_create_candidate_certification/',
		         async : false,
		         data: {
		             'datas': JSON.stringify(certification_list),
		             'candidate_id':candidate_table_id,
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
			 		$('#ta_candidate_list').val(candidate_table_id).trigger('change');
			 		clear_function_certification();
			 		drawCandidateList();
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

//certification button display function here
function certificate_button_display()
{
	if($('#employee_certification_details_edit_button').css('display') == 'none')
	{
		$('#employee_certification_details_edit_button').show()
	}
}

