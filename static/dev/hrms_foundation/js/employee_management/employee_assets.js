var list_index_asset,list_id_asset,id="",check_asset="";
var delete_list_asset=[];
var asset_columns = [{'title':'Id'},{'title':'No'},{'title':'Asset Type'},{'title':'Asset ID'},{'title':'Given Date'},{'title':'Asset Type ID'},{'title':'Asset Ref ID'}];
$( document ).ready(function() {
	
});
var asset_update_flag=0,asset_add_flag=0,asset_remove_flag=0;	
	
//Employee assets details temp create function here 
$( "#asset_create_button" ).click(function() {	
	if(employee_table_id)
	{
		if(employee_assets_form_validation())
		{
			asset_add_flag=1
			asset_remove_flag=0
			asset_update_flag=0
			asset_create_function_temp();
		}
	}else
	{
		alert_lobibox("info",sysparam_datas_list['NTE_66'])
	}	
});

//Employee assets details temp edit function here 
$( "#asset_edit_button" ).click(function() {
	if(list_index_asset!=undefined)
	{ 
		if(employee_assets_form_validation())
		{
			asset_add_flag=0
			asset_remove_flag=0
			asset_update_flag=1
			asset_create_function_temp();
		}
	}else
	{
		alert_lobibox("info",sysparam_datas_list['NTE_74'])
	}	
});

//Employee assets details temp delete function here 
$( "#asset_delete_button" ).click(function() {	
	if(list_index_asset!=undefined)
	{ 	
		asset_remove_flag=1
		asset_add_flag=0
		asset_update_flag=0	
		if(!(asset_list[list_index_asset][6]==""))
		{
			delete_list_asset.push(asset_list[list_index_asset][6])
		}
	    asset_list.splice(list_index_asset, 1);
	    
	    for(var i=0;i<asset_list.length;i++)
		{
	    	asset_list[i][1] = i+1;
		}
	    	    
		$('#assets_table').show();
		plaindatatable('employee_asset_details',asset_list, asset_columns,[0,5,6]);	
		clear_function_asset();
		alert_lobibox("success","Removed Successfully");
		asset_button_display();		
	 }else
	 {
		 alert_lobibox("info",sysparam_datas_list['NTE_74'])
	 }
});

// cancel functions here
$("#asset_cancel_button").click(function() {	
	clear_function_asset();
});

//cancel functions here
$("#employee_asset_cancel_button").click(function() {	
	clear_function_asset();	
});

$( "#employee_asset_edit_button" ).click(function() {
	employee_asset_create_function();
});

$('#asset_type').change(function() {	  
	asset_type_id = $('#asset_type').val();
	load_asset_id_from_type(asset_type_id);
})

function load_asset_id_from_type(asset_type_id)
{
	$.ajax({
		url : "/asset_id_drop_down/",
		type : "POST",
		data : {"asset_type_id":asset_type_id,"employee_id":employee_table_id},
		csrfmiddlewaretoken : $("input[name=csrfmiddlewaretoken]").val(),
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		if(data){
				$("#asset_id").empty();
				$("#asset_id").append("<option value='0' selected>--Select Asset ID--</option>");
				for (var i=0;i<data.length;i++)
				{			
					$("#asset_id").append("<option value='"+data[i].id+"'>"+data[i].asset_id+"</option>");
				}
		}
	});
}

function clear_function_asset()
{ 
	$('.errormessage').html("");
	document.getElementById('employee_asset_details_form').reset()
	$('.asset_update').hide()
	$('.asset_add').show()	
	$('#asset_type').val('0').trigger('change')
	$('#asset_id').val('0').trigger('change')
}

//var skills_list=[];
//var skills_temp_id="";
//var project_list = []

function asset_create_function_temp()
{
	if(asset_add_flag==1)
	{	
		row_no_asset = asset_list.length + 1;
		asset_type =  $('#asset_type option:selected').text().toString();
		asset_type_id = $('#asset_type').val();
		asset_given_date = $('#asset_given_date').val();
		asset_id = $('#asset_id option:selected').text().toString();
		asset_ref_id = $('#asset_id').val();
			
			temp_list_asset = ["",row_no_asset,asset_type,asset_id,asset_given_date,asset_type_id,asset_ref_id]	
			asset_list.push(temp_list_asset)			
			
			$('#asset_table').show();
			plaindatatable('employee_asset_details',asset_list, asset_columns,[0,5,6]);	
			clear_function_asset();
			alert_lobibox("success","Added Successfully");
			asset_button_display();		
		
	}else if(asset_update_flag==1)
	{
		row_no_asset = asset_list.length + 1;
		asset_type = $('#asset_type option:selected').text().toString();
		asset_type_id = $('#asset_type').val();
		asset_given_date = $('#asset_given_date').val();
		asset_id = $('#asset_id option:selected').text().toString();
		asset_ref_id = $('#asset_id').val();
	
			temp_list_asset = [list_id_asset,row_no_asset,asset_type,asset_id,asset_given_date,asset_type_id,asset_ref_id]
			
			if (list_index_asset >= 0 ) {
			    asset_list[list_index_asset] = temp_list_asset;
			}		
		
			$('#asset_table').show();
			plaindatatable('employee_asset_details',asset_list, asset_columns,[0,5,6]);	
			clear_function_asset();
			alert_lobibox("success","Updated Successfully");
			asset_button_display();	
	}	
}

$('#employee_asset_details').on('click','tr',function(){	
	
	if(asset_list.length>0){
	
		$('.asset_add').hide()
		$('.asset_update').show()		
		
		list_index_asset = $(this).closest("tr").index();	
		list_id_asset = $('#employee_asset_details').dataTable().fnGetData(this)[0];	
		asset_type_id = $('#employee_asset_details').dataTable().fnGetData(this)[5];
		asset_table_id = $('#employee_asset_details').dataTable().fnGetData(this)[6];
		
		asset_id = this.cells[2].innerHTML;
		given_date = this.cells[3].innerHTML;
		
		$('#asset_given_date').val(given_date)
		$('#asset_type').val(asset_type_id).trigger('change')	
		$("#asset_id").append("<option value="+asset_table_id+" selected>"+asset_id+"</option>");	
	//	$('#asset_id').val($("#asset_id option:contains('"+asset_id+"')").val()).change();	
	}
});

function check_asset_already_allocated(asset_id)
{
	$.ajax({
		url : "/check_asset_already_allocated/",
		type : "POST",
		data : {"asset_id":asset_id,"employee_id":employee_table_id},
		csrfmiddlewaretoken : $("input[name=csrfmiddlewaretoken]").val(),
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		alert(data.length)
		if(data.length >= 0){
			check_asset = false
		}else {
			check_asset = true
		}
	});
}


function employee_asset_create_function(employee_id,asset_update_flag)
{	
	changeDateFormat();
	if(employee_table_id)
	{
		$.ajax({	
	         type  : 'POST',
	         url   : '/hrms_employee_asset_create/',
	         async : false,
	         data: {
	             'datas': JSON.stringify(asset_list),
	             'employee_id':employee_table_id,
	             'delete_list':JSON.stringify(delete_list_asset),
	              csrfmiddlewaretoken : $("input[name=csrfmiddlewaretoken]").val()
	         },
	     }).done( function(json_data) {
	    	 data = JSON.parse(json_data);
		 	 var res_status = data['status'];
		 	 if(res_status == 'NTE_03')  {
		 		alert_lobibox("success", sysparam_datas_list[res_status]);
		 		asset_list_skills = [];
		 		$('#hrms_employee_list').val(employee_table_id).trigger('change');
		 		clear_function_skills();
		 		$('#employee_asset_edit_button').hide()		 		
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

function changeDateFormat()
{
	for(var i=0;i<asset_list.length;i++)
	{
		asset_list[i][4] = DateformatChange(asset_list[i][4])			
	}	
}

jQuery.validator.addMethod('valueNotEquals', function (value) {
    return (value != '0');
}, "")

$('#employee_asset_details_form').submit(function(e) {
    e.preventDefault();    
}).validate({
   rules: {
	   asset_type: {
		   required: true,
		   valueNotEquals:true, 
	   },	
	   asset_id: {
		   required: true,
		   valueNotEquals:true, 
	   },	  
	   asset_given_date: {
		   required: true,
	   },
   },
   //For custom messages
   messages: {
	   asset_type: {
		   required: "Select Asset Type",
		   valueNotEquals: "Select Valid Asset Type", 
	   },	
	   asset_id: {
		   required: "Select Asset ID",
		   valueNotEquals: "Select Valid Asset ID", 
	   },
	   asset_given_date: {
		   required: "Select Asset Given Date",
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
function employee_assets_form_validation()
{
	return $('#employee_asset_details_form').valid();
}

function asset_button_display()
{
	if($('#employee_asset_edit_button').css('display') == 'none')
	{
		$('#employee_asset_edit_button').show()
	}
}
