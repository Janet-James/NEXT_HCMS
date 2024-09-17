var tds_table_id = 0;

$(document).ready(function(){
	button_create_tds(1);
	tds_table_dispaly();
});

function tds_table_dispaly(){
	$.ajax({	
		type  : 'POST',
		url   : '/tds_table_display/',
		async : false,
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		if(data){
			tds_datatable_function(data)
		}else{
			tds_datatable_function(data)
		}
		
	});

}

function tds_datatable_function(data)
{
	datatable_list = []
	if(data.length > 0){
		datatable_list = []
		for(var i=0;i<data.length;i++){
			list = []
			var sno = i+1
			list.push(data[i].id,sno,data[i].employee_name,data[i].tds_from_date,data[i].tds_to_date);
			datatable_list.push(list);
		}

		columns = [{'title':'ID'},{'title':'No.'},{'title':'Employee Name'},{'title':'From date'},{'title':'To Date'}]
		plaindatatable_btn('tds_details', datatable_list, columns,0);
	}else{
		columns = [{'title':'ID'},{'title':'No.'},{'title':'Employee Name'},{'title':'From date'},{'title':'To Date'}]
		plaindatatable_btn('tds_details', datatable_list, columns,0);
	}
	
	return false
}

$("#tds_details").on("click", "tr", function() {   
	var id = $('#tds_details').dataTable().fnGetData(this)[0];
	$(this).parents('table').find('tr').removeClass('active');
	$(this).addClass('active');
	//reg_table_id = id
	if (id != 'No data available'){
		tds_table_row_click(id);
	}
});

function tds_table_row_click(el){
	button_create_tds(0);
	$.ajax(
			{
				type:"GET",
				url: "/tds_reg_table_row_click/",
				async: false,
				data : {'id':el},
				success: function (json_data) {
					data=JSON.parse(json_data);
					for (i=0;i<data.length;i++){
						tds_table_id = data[i].id;
						$('#tds_amount').val(data[i].tds_amount); 
						$('#tds_dtimepicker1').val(data[i].tds_from_date);
						$("#tds_dtimepicker2").val(data[i].tds_to_date)
						$('#tds_employe_name').val(data[i].tds_employee_id).trigger('change');
						
						//get form value for field wise log list function
						payroll_activity_log_attribute_value('#tds_form')
					}
				}
			});
	return false;
}

//button create function here
function button_create_tds(status){
	var access_for_create = jQuery.inArray( "Payroll Setup", JSON.parse(localStorage.Create) );
	var access_for_write = jQuery.inArray( "Payroll Setup", JSON.parse(localStorage.Write) );
	var access_for_delete = jQuery.inArray( "Payroll Setup", JSON.parse(localStorage.Delete) );	
	if(status == 1){
		if (access_for_create != -1){
		strAppend = "<button type='button' onclick='tds_create()' class='btn btn-success btn-eql-wid btn-animate'>Add</button>"
		}strAppend += " <button type='button' onclick='tds_clear()' class='btn btn-warning btn-animate btn-eql-wid btn-animate'>Cancel / Clear</button>"
				$('#hrms_tds_btn').html(strAppend);
	}else{
		if (access_for_write != -1){
		strAppend = "<button type='button' onclick='tds_update()' class='btn btn-primary btn-eql-wid btn-animate '>Update</button>"
			strAppend += " <button type='button' onclick='tds_delete()' class='btn btn-danger btn-eql-wid btn-animate '>Remove</button>"
		}/*if (access_for_delete != -1){
			alert(0)
			
		}*/
				strAppend += " <button type='button' onclick='tds_clear()' class='btn btn-warning btn-animate btn-eql-wid btn-animate'>Cancel / Clear</button>"
					$('#hrms_tds_btn').html(strAppend);
	}
}

function tds_create() {
	if(tds_form_validation())
	{
		tds_create_function();
	}
}

function tds_create_function()
{
	var tds_form_value = getFormValues("#tds_form");
	var csrf_data = tds_form_value.csrfmiddlewaretoken;
	delete tds_form_value["csrfmiddlewaretoken"];
	tds_form_value['is_active'] = "True";

	tds_form_value['tds_employee_id'] = validationFields(tds_form_value['tds_employee_id']);
	//tds_form_value['tds_category'] = 1;
	tds_form_value['tds_amount'] = validationFieldsamount(tds_form_value['tds_amount']);
	tds_form_value['tds_from_date'] = dateFormatChange(validationFields(tds_form_value['tds_from_date']));
	tds_form_value['tds_to_date'] = dateFormatChange(validationFields(tds_form_value['tds_to_date']));

	tds_list = [];
	tds_dict = {};
	tds_list.push(tds_form_value);
	tds_dict['tds_data'] = tds_list;
	var tds_activity_list = []
	tds_activity_list = payroll_activity_log('#tds_form')
	
	$.ajax({	
		type  : 'POST',
		url   : '/tds_create/',
		async : false,
		data: {
			'datas': JSON.stringify(tds_dict),
			'log_data':JSON.stringify(tds_activity_list),
			"table_id": tds_table_id,
			csrfmiddlewaretoken: csrf_data,
		}
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		var res_status = data['status'];
		if(res_status == 'NTE_01') {	
			alert_lobibox("success", sysparam_datas_list[res_status]);
			button_create_tds(1);
			tds_clear();
			tds_table_dispaly();
			tds_activity_list = []
			payroll_log_activity();
		}else if(res_status == 'NTE_03') {	
			alert_lobibox("success", sysparam_datas_list[res_status]);
			button_create_tds(1)
			tds_clear();
			tds_table_dispaly();	
			tds_activity_list = []
			payroll_log_activity();
		}
		else {
			alert_lobibox("error",sysparam_datas_list['ERR0040'])
		}
	});
}

function tds_update(){
	tds_create();
}

//delete function
function tds_delete(){
	var tds_title = $('#tds_employe_name option:selected').text();
	removeConfirmation('tds_details_delete_function','',tds_title);
}

//delete function
function tds_details_delete_function(){
	$.ajax({	
		type  : 'POST',
		url   : '/tds_create/',
		async : false,
		data: {
			"delete_id": tds_table_id,
			csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val(),
		},
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		var res_status = data['status'];
		if(res_status == 'NTE_04') {	
			alert_lobibox("success", sysparam_datas_list[res_status]);
			button_create_tds(0)
			tds_clear();
			tds_table_dispaly();
			tds_activity_list = []
			payroll_log_activity();
		}
		else {
			alert_lobibox("error",sysparam_datas_list['ERR0028'])
		}
	});
}

function dateFormatChange(val){
	return val.split('-')[2]+'-'+val.split('-')[1]+'-'+val.split('-')[0]
}

function tds_form_validation()
{
	return $('#tds_form').valid();
}

//contribution register form validation
$('#tds_form').submit(function(e) {
	e.preventDefault();    
}).validate({
	rules: {
		
		/*tds_category: {
			required: true,
			valueNotEquals:true, 
		}, */  
		tds_amount: {
			required: true,
			number:true, 
		},	
		tds_employee_id: {
			required: true,
			valueNotEquals:true, 
		},
		tds_from_date: {
			required: true,
           // date: true,
            //maxDate: true
			//number:true, 
		},	  
		tds_to_date: {
			required: true,
			greaterThan: "From date" 
            //date: true,
			//valueNotEquals:true, 
		},
	},
	//For custom messages
	messages: {
		contribution_register_name: {
			required: "Enter contribution register name",
			maxlength: "Name cannot exceed 50 characters",
			alpha: "Name cannot have numbers",
		},       
		   
		/*tds_category: {
			required: "Select Category",
			valueNotEquals:"Select Category", 
		},*/
		tds_amount: {
			required: "Enter Amount",
			number: "Enter only a number", 
		},
		tds_employee_id: {
			required: "Select  Employee",
			valueNotEquals: "Select  Employee", 
		},	 
		tds_from_date: {
			required: "Enter From Date",
			//maxDate: 'Must be today date or less',
			//number: "Enter only a number", 
		},
		tds_to_date: {
			required: "Enter To Date",
			//number: "Enter only a number", 
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

function tds_clear(){
	button_create_tds(1);
	tds_table_id = 0
	$('.thumbnail').html("")
	$('.errormessage').html("");	
	$('#tds_amount').val(''); 
	//$('#hr_contribution_register_code').val(''); 
	$('#tds_dtimepicker1').val('');
	$("#tds_dtimepicker2").val('');
	$("#tds_employe_name").val(0).trigger('change');
}

$("#tds_employe_name").change(function(){
	$("#clear3").html('')
});

//validation for the empty
function validationFields(val){
	return val=='' || val =='0' ?null:val 
}

//validation for the empty
function validationFieldsamount(val){
	return val==''  ?null:val 
}

$.validator.addMethod("alpha", function(value, element) {
    return this.optional(element) || value == value.match(/^[a-zA-Z\s]+$/);
});

jQuery.validator.addMethod('valueNotEquals', function (value) {
	return (value != '0');
}, "");
