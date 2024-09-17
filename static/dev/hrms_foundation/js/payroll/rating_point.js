var rating_table_id = 0;

$(document).ready(function(){
	button_create_rating_point(1);
	rating_point_table_dispaly();
});

//button create function here
function button_create_rating_point(status){
	var access_for_create = jQuery.inArray( "Payroll Setup", JSON.parse(localStorage.Create) );
	var access_for_write = jQuery.inArray( "Payroll Setup", JSON.parse(localStorage.Write) );
	var access_for_delete = jQuery.inArray( "Payroll Setup", JSON.parse(localStorage.Delete) );	
	if(status == 1){
		if (access_for_create != -1){
		strAppend = "<button type='button' onclick='rating_point_create()' class='btn btn-success btn-eql-wid btn-animate'>Add</button>"
		}strAppend += " <button type='button' onclick='rating_point_clear()' class='btn btn-warning btn-animate btn-eql-wid btn-animate'>Cancel / Clear</button>"
				$('#rating_btn').html(strAppend);
	}else{
		if (access_for_write != -1){
		strAppend = "<button type='button' onclick='rating_point_update()' class='btn btn-primary btn-eql-wid btn-animate '>Update</button>"
		}if (access_for_delete != -1){
			strAppend += " <button type='button' onclick='rating_point_delete()' class='btn btn-danger btn-eql-wid btn-animate '>Remove</button>"
		}
				strAppend += " <button type='button' onclick='rating_point_clear()' class='btn btn-warning btn-animate btn-eql-wid btn-animate'>Cancel / Clear</button>"
					$('#rating_btn').html(strAppend);
	}
}

function rating_point_table_dispaly(){
	$.ajax({	
		type  : 'POST',
		url   : '/rating_point_table_display/',
		async : false,
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		if(data){
			rating_point_datatable_function(data)
		}else{
			rating_point_datatable_function(data)
		}
		
	});

}

//Rating Point data table function here
function rating_point_datatable_function(data)
{
	datatable_list = []
	if(data.length > 0){
		datatable_list = []
		for(var i=0;i<data.length;i++){
			list = []
			var sno = i+1
			//if (data[i].minimum_range && data[i].maximum_range)
				//{
				var range = data[i].minimum_range +'-'+data[i].maximum_range
				/*}else if(data[i].minimum_range){
					var range = data[i].minimum_range
				}else{
					var range = data[i].maximum_range
				}*/
			list.push(data[i].id,sno,data[i].rating_date_from,data[i].rating_date_to,range,data[i].slab_title,data[i].fixed_return,data[i].variable_return);
			datatable_list.push(list);
		}
		var title = 'Basic Contribution'
		columns = [{'title':'ID'},{'title':'No.'},{'title':'Effective From Date'},{'title':'Effective To Date'},{'title':'Range'},{'title':'Categories Slab'},{'title':'Fixed Return'},{'title':'Variable Return(%)'}]
		plaindatatable_btn('rating_point_tbl_details', datatable_list, columns,0,'NEXT_TRANSFORM_HCMS_BASIC_CONTRIBUTION_'+currentDate(),title);
	}else{
		columns = [{'title':'ID'},{'title':'No.'},{'title':'Effective From Date'},{'title':'Effective To Date'},{'title':'Range'},{'title':'Categories Slab'},{'title':'Fixed Return'},{'title':'Variable Return(%)'}]
		plaindatatable_btn('rating_point_tbl_details', datatable_list, columns,0,'NEXT_TRANSFORM_HCMS_BASIC_CONTRIBUTION_'+currentDate(),title);
	}
	
	return false
}

//table row click get id
$("#rating_point_tbl_details").on("click", "tr", function() {   
	var id = $('#rating_point_tbl_details').dataTable().fnGetData(this)[0];
	$(this).parents('table').find('tr').removeClass('active');
	$(this).addClass('active');
	//reg_table_id = id
	if (id != 'No data available'){
		rating_point_table_row_click(id);
	}
});

//row click function in the table
function rating_point_table_row_click(el){
	button_create_rating_point(0);
	$.ajax(
			{
				type:"GET",
				url: "/rating_point_table_row_click/",
				async: false,
				data : {'id':el},
				success: function (json_data) {
					data=JSON.parse(json_data);
					for (i=0;i<data.length;i++){
						rating_table_id = data[i].id;
						$('#rating_from_date').val(data[i].rating_date_from); 
						$('#rating_to_date').val(data[i].rating_date_to); 
						$('#min_range').val(data[i].minimum_range);
						$("#max_range").val(data[i].maximum_range);
						$("#slab_value").val(data[i].slab_title);
						$("#fixed_return").val(data[i].fixed_return);
						$("#variable_return").val(data[i].variable_return);
					}
				}
			});
	return false;
}

//Rating Point details create function here 
function rating_point_create() {
	if(rating_point_form_validation())
	{
		rating_point_create_function();
	}
}

//update function
function rating_point_update(){
	rating_point_create();
}

//delete function
function rating_point_delete(){
	var slab_title = $('#slab_value').val();
	removeConfirmation('rating_details_delete_function','',slab_title);
}



//Rating Point create function here
function rating_point_create_function()
{
	var rating_point_form_value = getFormValues("#rating_form");
	var csrf_data = rating_point_form_value.csrfmiddlewaretoken;
	delete rating_point_form_value["csrfmiddlewaretoken"];
	rating_point_form_value['is_active'] = "True";

	rating_point_form_value['minimum_range'] = validationFields(rating_point_form_value['minimum_range']);
	rating_point_form_value['maximum_range'] = validationFields(rating_point_form_value['maximum_range']);
	rating_point_form_value['slab_title'] = validationFields(rating_point_form_value['slab_title']);
	rating_point_form_value['fixed_return'] = validationFields(rating_point_form_value['fixed_return']);
	rating_point_form_value['variable_return'] = validationFields(rating_point_form_value['variable_return']);
	rating_point_form_value['rating_date_from'] = dateFormatChange(validationFields(rating_point_form_value['rating_date_from']));
	rating_point_form_value['rating_date_to'] = dateFormatChange(validationFields(rating_point_form_value['rating_date_to']));

	rating_point_list = [];
	rating_point_dict = {};
	rating_point_list.push(rating_point_form_value);
	rating_point_dict['rating_data'] = rating_point_list;
	$.ajax({	
		type  : 'POST',
		url   : '/rating_point_create/',
		async : false,
		data: {
			'datas': JSON.stringify(rating_point_dict),
			"table_id": rating_table_id,
			csrfmiddlewaretoken: csrf_data,
		}
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		var res_status = data['status'];
		if(res_status == 'NTE_01') {	
			alert_lobibox("success", sysparam_datas_list[res_status]);
			button_create_rating_point(1)
			rating_point_clear();
			rating_point_table_dispaly();	
		}else if(res_status == 'NTE_03') {	
			alert_lobibox("success", sysparam_datas_list[res_status]);
			button_create_rating_point(1)
			rating_point_clear();
			rating_point_table_dispaly();	
		}
		else {
			alert_lobibox("error",sysparam_datas_list['ERR0040'])
		}
	});
}

//delete function
function rating_details_delete_function(){
	$.ajax({	
		type  : 'POST',
		url   : '/rating_point_create/',
		async : false,
		data: {
			"delete_id": rating_table_id,
			csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val(),
		},
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		var res_status = data['status'];
		if(res_status == 'NTE_04') {	
			alert_lobibox("success", sysparam_datas_list[res_status]);
			button_create_rating_point(1)
			rating_point_clear();
			rating_point_table_dispaly();	
		}
		else {
			alert_lobibox("error",sysparam_datas_list['ERR0028'])
		}
	});
}

function rating_point_clear(){
	button_create_rating_point(1);
	rating_table_id = 0
	$('.thumbnail').html("")
	$('.errormessage').html("");
	$('.rating_clear').val("");
}

//Rating Point form validation here
function rating_point_form_validation()
{
	return $('#rating_form').valid();
}

//date format change
function dateFormatChange(val){
	return val.split('-')[2]+'-'+val.split('-')[1]+'-'+val.split('-')[0]
}

//validation for the empty
function validationFields(val){
	return val==''  ?null:val 
}

$.validator.addMethod("alpha", function(value, element) {
    return this.optional(element) || value == value.match(/^[a-zA-Z\s]+$/);
});

//esi form point form validation
$('#rating_form').submit(function(e) {
	e.preventDefault();    
}).validate({
	rules: {
		minimum_range: {
			required: true,
			//maxlength: 50,	
			//alpha: true,
			number:true, 
		},
		maximum_range: {
			//alpha:true,
			required:true,
			//maxlength:5,
			//minlength:5,
			number:true, 
		},	  	   
		slab_title: {
			required: true,
			//valueNotEquals:true, 
		},   
		fixed_return: {
			required: true,
			number:true, 
		},	  
		variable_return: {
			required: true,
			number:true,
			//valueNotEquals:true, 
		},   
		rating_date_from: {
			required: true,
			//number:true, 
		},	  
		rating_date_to: {
			required: true,
			//valueNotEquals:true, 
		},
	},
	//For custom messages
	messages: {
		minimum_range: {
			required: "Enter Minimum Range",
			number: "Enter only a number",
			//maxlength: "Name cannot exceed 50 characters",
			//alpha: "Name cannot have numbers",
		},       
		maximum_range: {
			required: "Enter Maximum Range", 
			number: "Enter only a number",
			//alpha: "Code cannot have numbers",
			//maxlength: "Contribution register code cannot exceed 5 digits",
			//minlength: "Contribution register cannot lesser than 5 digits",    	  
		},	   
		slab_title: {
			required: "Enter Slab",
		},
		fixed_return: {
			required: "Enter Fixed Return",
			number: "Enter only a number", 
		},
		variable_return: {
			required: "Enter Variable Return",
			number: "Enter only a number", 
		},rating_date_from: {
			required: "Enter Effective From Date",
			//number: "Enter only a number", 
		},
		rating_date_to: {
			required: "Enter Effective To Date",
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

jQuery.validator.addMethod('valueNotEquals', function (value) {
	return (value != '0');
}, "");