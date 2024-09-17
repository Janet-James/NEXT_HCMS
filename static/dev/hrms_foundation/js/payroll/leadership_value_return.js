var leadership_table_id = 0;

$(document).ready(function(){
	button_create_leadership(1);
	leadership_table_dispaly();
});

//button create function here
function button_create_leadership(status){
	var access_for_create = jQuery.inArray( "Payroll Setup", JSON.parse(localStorage.Create) );
	var access_for_write = jQuery.inArray( "Payroll Setup", JSON.parse(localStorage.Write) );
	var access_for_delete = jQuery.inArray( "Payroll Setup", JSON.parse(localStorage.Delete) );	
	if(status == 1){
		if (access_for_create != -1){
		strAppend = "<button type='button' onclick='leadership_create()' class='btn btn-success btn-eql-wid btn-animate'>Add</button>"
		}strAppend += " <button type='button' onclick='leadership_clear()' class='btn btn-warning btn-animate btn-eql-wid btn-animate'>Cancel / Clear</button>"
				$('#leadership_btn').html(strAppend);
	}else{
		if (access_for_write != -1){
		strAppend = "<button type='button' onclick='leadership_update()' class='btn btn-primary btn-eql-wid btn-animate '>Update</button>"
		}//if (access_for_delete != -1){
			strAppend += " <button type='button' onclick='leadership_delete()' class='btn btn-danger btn-eql-wid btn-animate '>Remove</button>"
		//}
				strAppend += " <button type='button' onclick='leadership_clear()' class='btn btn-warning btn-animate btn-eql-wid btn-animate'>Cancel / Clear</button>"
					$('#leadership_btn').html(strAppend);
	}
}

function leadership_table_dispaly(){
	$.ajax({	
		type  : 'POST',
		url   : '/leadership_table_display/',
		async : false,
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		if(data){
			leadership_datatable_function(data)
		}else{
			leadership_datatable_function(data)
		}
		
	});

}

//Rating Point data table function here
function leadership_datatable_function(data)
{
	datatable_list = []
	if(data.length > 0){
		datatable_list = []
		for(var i=0;i<data.length;i++){
			list = []
			var sno = i+1
			list.push(data[i].id,sno,data[i].lvr_name,data[i].leadership_date_from,data[i].leadership_date_to,data[i].slab_title,data[i].value_return);
			datatable_list.push(list);
		}

		columns = [{'title':'ID'},{'title':'No.'},{'title':'Name'},{'title':'Effective From Date'},{'title':'Effective To Date'},{'title':'Categories Slab'},{'title':'Value Return'}]
		plaindatatable_btn('leadership_tbl_details', datatable_list, columns,0,'NEXT_TRANSFORM_HCMS_LEADERSHIP_VALUE_RETURN_'+currentDate());
	}else{
		columns = [{'title':'ID'},{'title':'No.'},{'title':'Name'},{'title':'Effective From Date'},{'title':'Effective To Date'},{'title':'Categories Slab'},{'title':'Value Return'}]
		plaindatatable_btn('leadership_tbl_details', datatable_list, columns,0,'NEXT_TRANSFORM_HCMS_LEADERSHIP_VALUE_RETURN_'+currentDate());
	}
	
	return false
}

//table row click get id
$("#leadership_tbl_details").on("click", "tr", function() {   
	var id = $('#leadership_tbl_details').dataTable().fnGetData(this)[0];
	$(this).parents('table').find('tr').removeClass('active');
	$(this).addClass('active');
	//reg_table_id = id
	if (id != 'No data available'){
		leadership_table_row_click(id);
	}
});

//row click function in the table
function leadership_table_row_click(el){
	button_create_leadership(0);
	$.ajax(
			{
				type:"GET",
				url: "/leadership_table_row_click/",
				async: false,
				data : {'id':el},
				success: function (json_data) {
					data=JSON.parse(json_data);
					for (i=0;i<data.length;i++){
						leadership_table_id = data[i].id;
						$('#leadership_from_date').val(data[i].leadership_date_from); 
						$('#leadership_to_date').val(data[i].leadership_date_to); 
						$('#name_lvr').val(data[i].lvr_name);
						$("#leadership_slab").val(data[i].leadership_slab_id).trigger('change');
						$("#value_return").val(data[i].value_return);
					}
				}
			});
	return false;
}

//Leadership details create function here 
function leadership_create() {
	if(leadership_form_validation())
	{
		leadership_create_function();
	}
}

//update function
function leadership_update(){
	leadership_create();
}

//delete function
function leadership_delete(){
	var slab_title = $('#name_lvr').val();
	removeConfirmation('leadership_details_delete_function','',slab_title);
}

//Rating Point create function here
function leadership_create_function()
{
	var leadership_form_value = getFormValues("#leadership_form");
	var csrf_data = leadership_form_value.csrfmiddlewaretoken;
	delete leadership_form_value["csrfmiddlewaretoken"];
	leadership_form_value['is_active'] = "True";
	
	var from_date = new Date(datequartervalidate(leadership_form_value['leadership_date_from']));
	var to_date = new Date(datequartervalidate(leadership_form_value['leadership_date_to']));
	
	var total_mon_from = from_date.getMonth()
	var total_mon_to = to_date.getMonth()
	console.log("total month",total_mon_from,total_mon_to)
	
	if(total_mon_from == 0 && total_mon_to == 2){
		var lead_from_date = leadership_form_value['leadership_date_from']
		var lead_from_to = leadership_form_value['leadership_date_to']
	}else if(total_mon_from == 3 && total_mon_to == 5){
		var lead_from_date = leadership_form_value['leadership_date_from']
		var lead_from_to = leadership_form_value['leadership_date_to']
	}else if(total_mon_from == 6 && total_mon_to == 8){
		var lead_from_date = leadership_form_value['leadership_date_from']
		var lead_from_to = leadership_form_value['leadership_date_to']
	}else if(total_mon_from == 9 && total_mon_to == 12){
		var lead_from_date = leadership_form_value['leadership_date_from']
		var lead_from_to = leadership_form_value['leadership_date_to']
	}else if (total_mon_from == 0 && total_mon_to == 11){
		var lead_from_date = leadership_form_value['leadership_date_from']
		var lead_from_to = leadership_form_value['leadership_date_to']
	}else if (total_mon_from == 0 && total_mon_to == 5){
		var lead_from_date = leadership_form_value['leadership_date_from']
		var lead_from_to = leadership_form_value['leadership_date_to']
	}else if (total_mon_from == 0 && total_mon_to == 8){
		var lead_from_date = leadership_form_value['leadership_date_from']
		var lead_from_to = leadership_form_value['leadership_date_to']
	}else{
		alert_lobibox("error","This dates are not quarter based")
	}

	if(lead_from_date && lead_from_to){
		leadership_form_value['lvr_name'] = validationFields(leadership_form_value['lvr_name']);
		leadership_form_value['leadership_slab_id'] = validationFields(leadership_form_value['leadership_slab_id']);
		leadership_form_value['lvr_period_id'] = 1116;
		leadership_form_value['value_return'] = validationFields(leadership_form_value['value_return']);
		leadership_form_value['leadership_date_from'] = dateFormatChange(validationFields(lead_from_date));
		leadership_form_value['leadership_date_to'] = dateFormatChange(validationFields(lead_from_to));

		leadership_list = [];
		leadership_point_dict = {};
		leadership_list.push(leadership_form_value);
		leadership_point_dict['leadership_data'] = leadership_list;
		$.ajax({	
			type  : 'POST',
			url   : '/leadership_create/',
			async : false,
			data: {
				'datas': JSON.stringify(leadership_point_dict),
				"table_id": leadership_table_id,
				csrfmiddlewaretoken: csrf_data,
			}
		}).done( function(json_data) {
			data = JSON.parse(json_data);
			var res_status = data['status'];
			if(res_status == 'NTE_01') {	
				alert_lobibox("success", sysparam_datas_list[res_status]);
				button_create_leadership(1)
				leadership_clear();
				leadership_table_dispaly();	
			}else if(res_status == 'NTE_03') {	
				alert_lobibox("success", sysparam_datas_list[res_status]);
				button_create_leadership(1)
				leadership_clear();
				leadership_table_dispaly();	
			}
			else {
				alert_lobibox("error",sysparam_datas_list['ERR0040'])
			}
		});
	}
	
}

//date quarter validation format change
function datequartervalidate(val){
	return val.split('-')[1]+'/'+val.split('-')[0]+'/'+val.split('-')[2]
}

//delete function
function leadership_details_delete_function(){
	$.ajax({	
		type  : 'POST',
		url   : '/leadership_create/',
		async : false,
		data: {
			"delete_id": leadership_table_id,
			csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val(),
		},
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		var res_status = data['status'];
		if(res_status == 'NTE_04') {	
			alert_lobibox("success", sysparam_datas_list[res_status]);
			button_create_leadership(1)
			leadership_clear();
			leadership_table_dispaly();	
		}
		else {
			alert_lobibox("error",sysparam_datas_list['ERR0028'])
		}
	});
}

function leadership_clear(){
	button_create_leadership(1);
	leadership_table_id = 0
	$('.thumbnail').html("")
	$('.errormessage').html("");
	$('.rating_clear').val("");
	$("#leadership_slab").val('').trigger('change');
	//$("#lvr_period").val('').trigger('change');
}

//leadership  form validation here
function leadership_form_validation()
{
	return $('#leadership_form').valid();
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

//leadership form validation
$('#leadership_form').submit(function(e) {
	e.preventDefault();    
}).validate({
	rules: {
		value_return: {
			required: true,
			number:true, 
			//valueNotEquals:true, 
		},   
		lvr_name: {
			required: true,
		},	  
		leadership_slab_id: {
			required: true,
			valueNotEquals:true, 
		},   
		leadership_date_from: {
			required: true,
			//number:true, 
		},	  
		leadership_date_to: {
			required: true,
			//valueNotEquals:true, 
		},
		/*lvr_period_id: {
			required: true,
			valueNotEquals:true, 
		},*/ 
	},
	//For custom messages
	messages: {
		value_return: {
			required: "Enter Value Return",
			number: "Enter only a number",
		},
		lvr_name: {
			required: "Enter Name",
		},
		leadership_slab_id: {
			required: "Select Leadership Slab",
			valueNotEquals:"Select Leadership Slab",
			
		},leadership_date_from: {
			required: "Enter Effective From Date",
			//number: "Enter only a number", 
		},
		leadership_date_to: {
			required: "Enter Effective To Date",
			//number: "Enter only a number", 
		},	/*lvr_period_id: {
			required: "Select LVR Period",
			valueNotEquals:"Select LVR Period",
			
		}, */

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

$("#leadership_slab").change(function(){
	$("#leader_slab_clear").html('');
});
/*$("#lvr_period").change(function(){
	$("#lvr_slab_clear").html('');
});*/
