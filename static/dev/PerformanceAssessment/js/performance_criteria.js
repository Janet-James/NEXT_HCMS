var group_table_id=0
var group_table='';
var group_group_inner_dict={}
//group form create button functionality
$("#group_create_button").click(function(e){
	stages_alert_clear();
	e.preventDefault();
	group_validation_result= group_basic_validation()
	if (group_validation_result)
	{
		create_update_group(0)
	}
	return false
});

function create_update_group(create_update_status) {
	var group_form_value = {}
	group_form_value = getFormValues("#group_form");
	delete group_form_value.csrfmiddlewaretoken
	if(create_update_status) {
		if(group_table_id) {
			group_form_value.id = group_table_id
		} else {
			alert_lobibox('error','Please select a record to update')
			return
		}
	}

	$.ajax({
		url : 'http://192.168.11.38:8001/performance/criteria_create/',
		type : 'POST',
		data:{"data":JSON.stringify(group_form_value),'user_id':user_id},
		timeout : 10000,
		async:false,
		error:(function(error){
			alert_lobibox("error", error.statusText);
		})
	}).done( function(json_data) {
		var data = JSON.parse(json_data);
		if (data['status']=='Updated Successfully' || data['status']=='Added Successfully') {
			alert_lobibox('success',data['status'])
		} else if ((data['status']=='Already Exists')) {
			alert_lobibox('error','Code Already exists')
			return
		}
		$("#group_table").DataTable().destroy();
		group_table_function();
		group_table_clear();
	});
	return false
}

$( "#group_edit_button" ).click(function(e) {
	e.preventDefault();
	stages_alert_clear();
	  group_validation_result= group_basic_validation()
				if (group_validation_result)
				{
					create_update_group(1)
				}
	  $('#group_edit_button').hide();
	  $('#group_create_button').show();
return false;
});

//communication medium form table click to view particular records from a table
$('#group_table tbody').on('click','tr',function(){
	$('#group_edit_button').show();
	$('#group_create_button').hide();
	$('.labels').addClass('active'); $('input').removeClass('error');
	errortxt_clear();
	stages_alert_clear();
	group_table_id = this.cells[0].innerHTML;
	$.ajax({
		url : 'http://192.168.11.38:8001/performance/criteria_table/',
		type : 'POST',
		timeout : 10000,
		data:{'table_id':group_table_id},
		async:false,

	}).done(function(json_data){
		var data = JSON.parse(json_data);
		$("#template").val(data.data[0].template_name);
		$("#criteria").val(data.data[0].criteria);
		$("#sequence").val(data.data[0].sequence);
	})
})


function delete_confirm( delete_id) {
swal({
	  title: "Are you sure, you want to delete this record?",
	  type: "warning",
	  showCancelButton: true,
	  confirmButtonClass: "btn-success pull-left",
	  cancelButtonClass: "btn-danger pull-right",
	  confirmButtonText: "Yes",
	  cancelButtonText: "No",
	  closeOnConfirm: true,
	  closeOnCancel: true
	},
	function(isConfirm) {
	  if (isConfirm) {
			  $.ajax({
				  url : 'http://192.168.11.38:8001/performance/criteria_delete/',
				  type : 'POST',
				  data:{"id":group_table_id},
				  timeout : 10000,
				  async:false,
				  error:(function(error){
					  alert_lobibox("error", error.statusText);
				  })
			  }).done(function(json_data){
				  var data = JSON.parse(json_data);
				  alert_lobibox('success',data['status']);
				  $("#group_table").DataTable().destroy();
				  group_table_function();
				  group_table_clear();
			  });
	  } else {
	    swal("Cancelled", "Your file is safe :)", "error");
	  }
	  $('#group_edit_button').hide();
	  $('#group_create_button').show();
	});
}

//function to clear all fields in group form
function group_table_clear()
{
	$("#criteria").val('');
	$("#sequence").val('');
	group_table_id=''
	group_inner_dict={}
}
//function to show all group details in a table
function group_table_function() {
	$.ajax({
		url : 'http://192.168.11.38:8001/performance/criteria_table/',
		type : 'POST',
		error:(function(error){
			alert_lobibox("error", error.statusText);
		})
	}).done( function(json_data) {
		var data = JSON.parse(json_data);
		$('#group_table_tbody').html('');
		if (data.status=='success'){
			var data_val = data.data
			var str_append = ''
			for (var i=0;i<data_val.length;i++){
				str_append+='<tr><td>'+data_val[i].id+'</td><td>'+data_val[i].row_number+'</td><td>Developer</td><td>'+data_val[i].criteria+'</td><td>'+data_val[i].sequence+'</td><td><button type="button" class="btn btn-danger btn-xs" onclick="delete_confirm('+data_val[i].id+')"><i class="fa fa-times" aria-hidden="true" data-toggle="tooltip" data-placement="top" data-original-title="Remove"></i></button></td></tr>'
			}
			$('#group_table_tbody').append(str_append)
		} else {
			alert_lobibox('error','Datatable loading error')
		}
		group_table_clear();
		$("#group_table").DataTable({
			"order": [[ 1, 'asc' ]],
			"aoColumnDefs": [ { "sClass": "dpass", "aTargets": [0] } ],
			"language": {
				"aria": {
					"sortAscending": ": activate to sort column ascending",
					"sortDescending": ": activate to sort column descending" 
				},
				"emptyTable": "No data available in table",
				"info": "Showing _START_ to _END_ of _TOTAL_ entries",
				"infoEmpty": "No entries found",
				"infoFiltered": "(filtered1 from _MAX_ total entries)",
				"lengthMenu": "_MENU_ entries",
				"search": "",
				"zeroRecords": "No matching records found" 
			},
			
		  buttons: [ ],
            dom: "<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-12'><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-9 col-sm-12'i><'col-md-3 col-sm-12'lp>>",
		
		});
	});
}

$(document).ready(function() {
	$(".main_title").html("::NEXT::P5S-GROUP");
	$('.header_title').html('Group Registration');//header names changes
	group_table_function();
	/*$("body").tooltip({ selector: '[data-toggle=tooltip]' });
	$('[data-toggle="tooltip"]').tooltip(); */
	$("#group_delete_button").click(function(){
	delete_yes();
	return false;
	});
  });
//communication medium cancel button functionality
$("#group_cancel_button").click(function(){
	$('#group_edit_button').hide();
	$('#group_create_button').show();
	errortxt_clear();
	stages_alert_clear();
	group_table_clear();
	return false;
});

$("#group_form").submit(function(e) {
	e.preventDefault();
}).validate({
		rules : {
			criteria : {
				required : true,
			},
			sequence : {	
				required : true,
			},
		},
		//For custom messages
		messages : {
			name : {
				required : "Enter a Criteria Name",
			},
			sequence : {
				required : "Enter a Criteria Sequence",
			},
		},
		errorElement : 'div',
		errorPlacement : function(error, element) {
			var placement = $(element).data('error');
			if (placement) {
				$(placement).append(error)
			} else {
				error.insertAfter(element);
			}
		}
	});

function group_basic_validation()
{
	return $('#group_form').valid();	
	
}
function stages_alert_clear()
{
	$(".error_status").html('');
	$(".alert_lobibox").html('');
}
function errortxt_clear()
{
	$('[class^="errorTxt"]').html('');
}