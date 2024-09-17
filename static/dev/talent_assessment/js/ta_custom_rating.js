$(document).ready(function() {
	$("#custom_rating_scheme_hidden_id").val('')
	var rating_detail_table = $('#rating_detail_table').DataTable({
		"dom": "<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-12'><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-6 col-sm-12'i><'col-md-6 col-sm-12'lp>>",
        "buttons": [],
		"columnDefs": [
		               {"className": "dt-center", "targets": "_all"},
		               
		               {
		            	   "orderDataType": "dom-text","type": "string",
		            	   "targets": 0, // Just the first column
		               },
		               {
		            	   "orderDataType": "dom-text-numeric",
		            	   "targets": 1, // Just the first column
		               },
		               ],
		               "language": {
		            	   "zeroRecords": "No data available",
		            	   "search": ""
		               },

	});
	custom_rating_scheme_datatable();
	rating_button_display('add');
});
/* Create an array with the values of all the input boxes in a column */
$.fn.dataTable.ext.order['dom-text'] = function  ( settings, col )
{
	return this.api().column( col, {order:'index'} ).nodes().map( function ( td, i ) {
		return $('input', td).val();
	} );
}
/* Create an array with the values of all the input boxes in a column, parsed as numbers */
$.fn.dataTable.ext.order['dom-text-numeric'] = function  ( settings, col )
{
	return this.api().column( col, {order:'index'} ).nodes().map( function ( td, i ) {
		return $('input', td).val() * 1;
	} );
}

//Function for adding empty row on clicking add button
$('#rating_detail_add_button').click( function() {
	var counter
	$('#rating_detail_table').dataTable().fnAddData([
	                                                 '<input type="text" class="form-control input-small" id="R_' + counter + '_2" />',
	                                                 '<input type="text" onkeypress="return IsNumeric(event)" ondrop="return false" onpaste="return false" class="form-control input-small" id="R_' + counter + '_3" />',
	                                                 '<i class="nf nf-trash-o rating_row_delete"></i><input type="hidden" class="form-control input-small"  id="R_' + counter + '_4" />'
	                                                 ]);
	counter++;
})
//Function for deleting selected row
var data_row
$('#rating_detail_table').on( 'click', '.rating_row_delete', function () {
	custom_rating_rel_id=$(this).parents('tr').find('td:eq(2) input[type=hidden]').val();
	data_row = $(this).parents('tr')[0];
	if (custom_rating_rel_id)
	{
		 removeConfirmation('rating_child_detail_remove',custom_rating_rel_id);
	}
	else
	{
		$('#rating_detail_table').dataTable().fnDeleteRow(data_row);
	}

} );
function rating_child_detail_remove(id)
{
	$.ajax({
		type:"POST",
		url: "/remove_custom_rating_rel_detail/",
		data:{'custom_rating_rel_id':id,csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()},
		success: function (json_data) {
			if(json_data.status=='NTE_04')
			{
//				alert_status(json_data.status)
				alert_lobibox("success", sysparam_datas_list[json_data.status]);
				$('#rating_detail_table').dataTable().fnDeleteRow(data_row);

			}
			else
			{
				alert_lobibox("error", sysparam_datas_list[json_data.status]);
			}
		}
	})	
}
function rating_button_display(flag)
{
	$("#custom_rating_button_div").empty();
	if (flag=='add')
	{
		var btnstr = '<button type="button" class="btn btn-success btn-eql-wid btn-animate margin-right-3" id="rating_scheme_add" onclick="custom_rating_scheme_add_update();">Add</button>';
	}
	else
	{
		var btnstr = '<button type="button" class="btn btn-primary btn-eql-wid btn-animate margin-right-3" id="rating_scheme_update" onclick="custom_rating_scheme_add_update();">Update</button>';
		btnstr += '<button type="button" class="btn btn-danger btn-eql-wid btn-animate margin-right-3" id="rating_scheme_remove" onclick="custom_rating_remove_confirmation();">Remove</button>';
	}
	btnstr += '<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-3" id="rating_schema_clear_cancel" onclick="custom_rating_date_clear_cancel();">Cancel / Clear</button>';
	$("#custom_rating_button_div").append(btnstr);	
}

//function rating_button_display(action_name){
//$("#custom_rating_button_div").html('');
//var btnstr = '';
//var access_for_create = jQuery.inArray( "assessment rating", JSON.parse(localStorage.Create) );
//var access_for_write = jQuery.inArray( "assessment rating", JSON.parse(localStorage.Write) );
//var access_for_delete = jQuery.inArray( "assessment rating", JSON.parse(localStorage.Delete) );
//if (action_name == 'add') {
//if (access_for_create != -1){
//    btnstr +='<button type="button" class="btn btn-success btn-eql-wid btn-animate margin-right-3" id="rating_scheme_add" onclick="custom_rating_scheme_add_update();">Add</button>';
//}
//btnstr += '<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-3" id="rating_schema_clear_cancel" onclick="custom_rating_date_clear_cancel();">Cancel / Clear</button>';
//} else if (action_name == 'update') {
//if (access_for_write != -1){
//    btnstr +='<button type="button" class="btn btn-primary btn-eql-wid btn-animate margin-right-3" id="rating_scheme_update" onclick="custom_rating_scheme_add_update();">Update</button>';
//}
//if (access_for_delete != -1){
//    btnstr +='<button type="button" class="btn btn-danger btn-eql-wid btn-animate margin-right-3" id="rating_scheme_remove" onclick="custom_rating_remove_confirmation();">Remove</button>';
//}
//btnstr +='<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-3" id="rating_schema_clear_cancel" onclick="custom_rating_date_clear_cancel();">Cancel / Clear</button>';
//}
//$("#custom_rating_button_div").append(btnstr);
//}
function custom_rating_remove_confirmation()
{
	custom_rating_scheme_hidden_id=$("#custom_rating_scheme_hidden_id").val();
	 removeConfirmation('custom_rating_remove',custom_rating_scheme_hidden_id,$('#custom_rating_scheme_name').val());
}

//Function for removing scheme details
function custom_rating_remove(id){
	custom_rating_scheme_hidden_id=id
	$.ajax({
		type:"POST",
		url: "/remove_custom_rating_detail/",
		data:{'custom_rating_scheme_id':custom_rating_scheme_hidden_id,csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()},
		success: function (json_data) {
			if(json_data.status=='NTE_04')
			{
//				alert_status(json_data.status)
				alert_lobibox("success", sysparam_datas_list[json_data.status]);
				custom_rating_date_clear_cancel();
				$("#custom_rating_scheme_detail_table").DataTable().destroy()
				custom_rating_scheme_datatable();
			}
			else
			{
//				alert_status(json_data.status)
				alert_lobibox("error", sysparam_datas_list[json_data.status]);
			}

		}
	});
}

//Function for cancel and clear function
function custom_rating_date_clear_cancel()
{
	rating_button_display('add');
	$('#custom_rating_scheme_hidden_id').val('')
	$('#custom_rating_scheme_name').val('')
	rating_detail_datatable=$('#rating_detail_table').DataTable();
	rating_detail_datatable.clear().draw();    
	$('.errormessage').html('');
}

//Function for adding and updating custom rating scheme detail
function custom_rating_scheme_add_update()
{
	var rating_input_status=''
		rating_detail_table = $('#rating_detail_table').dataTable()
		custom_rating_scheme_hidden_id=$("#custom_rating_scheme_hidden_id").val()
		custom_rating_scheme_name=$("#custom_rating_scheme_name").val()
		var rating_detail_list = []
	var rating_name_list =[]
	var rating_value_list = []
	var rating_name_list_length
	var rating_value_list_length
	$('#rating_detail_table tbody tr').each(function(row, tr){
		if($(tr).find('td:eq(0) input').val()=='')
		{
			rating_input_status="empty"
		}
		else if ($(tr).find('td:eq(1) input').val()=='')
		{
			rating_input_status="empty"
		}

		rating_detail_list[row]={
				"rating_name":$(tr).find('td:eq(0) input').val(), 
				"value":$(tr).find('td:eq(1) input').val(), 
				"rating_id":$(tr).find('td:eq(2) input[type=hidden]').val()
		}
		rating_name_list.push($(tr).find('td:eq(0) input').val());
		rating_name_list_length=rating_name_list.length
		rating_value_list.push($(tr).find('td:eq(1) input').val())
		rating_value_list_length=rating_value_list.length
	});
	var status = rating_form_validation();
	if(status){
		if(!custom_rating_scheme_name)
		{
			alert_lobibox("error", sysparam_datas_list["NTE_48"])
		}
		else if(rating_detail_table.fnSettings().aoData.length===0){
			alert_lobibox("error", sysparam_datas_list["NTE_49"])
		}
		else if(rating_detail_table.fnSettings().aoData.length<2){
			alert_lobibox("error",sysparam_datas_list["NTE_50"])
		}
		else if(rating_input_status=="empty")
		{
			alert_lobibox("error", sysparam_datas_list["NTE_51"])
		}
		else if(rating_name_list_length!=jQuery.unique( rating_name_list ).length)
		{
			alert_lobibox("error", sysparam_datas_list["NTE_52"])
		}
		else if(rating_value_list_length!=jQuery.unique( rating_value_list ).length)
		{
			alert_lobibox("error", sysparam_datas_list["NTE_53"])
		}
		else
		{
			$.ajax({
				type:"POST",
				url: "/add_update_custom_rating/",
				data:{'custom_rating_scheme_name':custom_rating_scheme_name,'custom_rating_scheme_update_id':custom_rating_scheme_hidden_id,
					'rating_detail_list':JSON.stringify(rating_detail_list),csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()},
					success: function (json_data) {
						if(json_data.status=='NTE_03')
						{
//							alert_status(json_data.status)
							alert_lobibox("success", sysparam_datas_list[json_data.status]);
							$("#custom_rating_scheme_detail_table").DataTable().destroy()
							custom_rating_date_clear_cancel()
							custom_rating_scheme_datatable()
						}
						else if(json_data.status=='NTE_01')
						{
//							alert_status(json_data.status)
														alert_lobibox("success", sysparam_datas_list[json_data.status]);
							$("#custom_rating_scheme_detail_table").DataTable().destroy()
							custom_rating_date_clear_cancel()
							custom_rating_scheme_datatable()
						}
						else
						{
							alert_lobibox("error", sysparam_datas_list["ERR0016"])
						}
					}
			});
		}
	}
}

//Function for creating data table to display rating scheme detail 
function custom_rating_scheme_datatable()
{
	columns = [{"title":"hidden Id","visible": false},{"title":"No."},{"title":"Rating Scheme Name" }, {"title":"Created By"}, {"title":"Created On"}]
	$.ajax({
		type:"POST",
		url: "/custom_rating_detail_fetch/",
		data:{ csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()},
		async: false,
		success: function (json_data) {
			data=json_data.rating_details
			data_list = [];
			for (var i=0; i<data.length; i++){
				data_list.push([data[i].custom_rating_id,i+1,data[i].scheme_name, data[i].created_by,
				                data[i].created_on]);
			}
			plaindatatable_btn('custom_rating_scheme_detail_table', data_list, columns,[])
		}
	});      
}

//Function to retrieve row id and to display custom rating and related details
$('#custom_rating_scheme_detail_table').on('click', 'tbody tr', function(){
	$('.errormessage').html('');
	var arr=$('#custom_rating_scheme_detail_table').dataTable().fnGetData($(this)); 
	var custom_rating_scheme_clicked_id=arr[0];
	var custom_rating_scheme_clicked_name=arr[2];
	$.ajax({
		type:"POST",
		url: "/custom_rating_detail_fetch_by_id/",
		async: false,
		data:{'custom_rating_scheme_id':custom_rating_scheme_clicked_id,csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()},
		success: function (json_data) {
			if(json_data.status=="Success")
			{
				rating_button_display('update');
				$('#custom_rating_scheme_hidden_id').val('')
				$('#custom_rating_scheme_name').val('')
				$('#custom_rating_scheme_hidden_id').val(custom_rating_scheme_clicked_id)
				$('#custom_rating_scheme_name').val(custom_rating_scheme_clicked_name)
				data=json_data.rating_relation_data
				rating_detail_datatable=$('#rating_detail_table').DataTable();
				rating_detail_datatable.clear().draw();
				for (var i=0; i<data.length; i++){
					$('#rating_detail_table').dataTable().fnAddData( ['<input type="text" class="form-control input-small" value="'+data[i].custom_rating_name+'"/>','<input type="text" onkeypress="return IsNumeric(event)" ondrop="return false" onpaste="return false" class="form-control input-small" value="'+data[i].custom_rating_value+'"/>','<i class="nf nf-trash-o rating_row_delete"></i><input type="hidden" class="form-control input-small"  value="'+data[i].custom_rating_rel_id+'"/>'])
				}
			}
		}
	})

});

//Validation for Drop Data
$.validator.addMethod("valueNotEquals", function(value, element, arg){
	if(value == 0) {
		return false
	} else {
		return true
	}
}, "Value must not equal arg.");

//Validation For assessment template 
$('#rating_form').submit(function(e) {
	e.preventDefault();
}).validate({
	rules: {
		custom_rating_scheme_name: {
			required: true,
		},  
	},
	//For custom messages
	messages: {

		custom_rating_scheme_name: {
			required: "Enter the rating name",
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

function rating_form_validation()
{
	return $('#rating_form').valid();
}

//Allow only numeric
var specialKeys = new Array();
specialKeys.push(8);
function IsNumeric(e) {
	var keyCode = e.which ? e.which : e.keyCode
			var ret = ((keyCode >= 48 && keyCode <= 57) || specialKeys.indexOf(keyCode) != -1);
	return ret;
}