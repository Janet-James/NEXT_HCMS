payment_id = 0;
is_file_uploaded = 0;
$(document).on('click','#add',function(){
	if(check_validation()){
		name = $('#name').val();
		var data = new FormData();
		jQuery.each(jQuery('#input_file')[0].files, function(i, file) {
			is_file_uploaded = 1;
			data.append('input_file', file);
			var file_type = file.type;
			if ((file_type).indexOf('/') > -1){
				var file_type_array = file_type.split('/')
				type_of_file = file_type_array[file_type_array.length - 1]
				data.append('type_of_file', type_of_file)
			}
		});
		if (!(is_file_uploaded)){
			alert_lobibox('error','Please upload a file')
			return false
		}
		data.append('name', name)
		data.append('csrfmiddlewaretoken',$("input[name=csrfmiddlewaretoken]").val());
		
		jQuery.ajax({
			url: '/payment/manage/',
			data: data,
			cache: false,
			contentType: false,
			processData: false,
		  //  async:true,
			//method: 'POST',
			type: 'POST', // For jQuery < 1.9
			beforeSend: function() {
				$('#loading').show();
			 },
			success: function(parsed_data){
				$('#loading').hide();
				 if(parsed_data.status == 'NTE-001'){
					clear_page();
							$("#payment_table").DataTable().destroy();
							alert_lobibox('success','Details Saved Successfully')
							rerender_table();
				 }
				else
					alert_lobibox('success','Error Ocurred')
			},
			error:(function(error){
				
			})
		})
	}
	
});
$(document).ready(function(){
	$('#loading').show();
	$("#payment_table").DataTable({
		"order": [[ 1, 'asc' ]],
		"aoColumnDefs": [ { "sClass": "dt_col_hide", "aTargets": [0] } ],
		"language": {
			"aria": {
				"sortAscending": ": activate to sort column ascending",
				"sortDescending": ": activate to sort column descending" 
			},
			"emptyTable": "No data available in table",
			"info": "Showing _START_ to _END_ of _TOTAL_ entries",
			"infoEmpty": "No entries found",
			"infoFiltered": "(filtered1 from _MAX_ total entries)",
			"lengthMenu": "_MENU_",
			"search": "",
			"zeroRecords": "No matching records found" ,
		},
		lengthMenu: [[5, 10, 25, 50, 100], [5, 10, 25, 50, 100]],
		buttons: [ ],
		dom: "<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-12'><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-9 col-sm-12'i><'col-md-3 col-sm-12'lp>>",
	});
	payment_table();
});

function payment_table() {
	$.ajax({
		url : '/payment/manage/',
		type : 'GET',
		async : true,
		dataSrc: "Data", 
		error:(function(error){
			alert_lobibox("error", error.statusText);
		})
	}).done( function(data) {
		$('#payment_table_tbody').html('');
		if (data.status=='NTE-001'){
			var data_val = data.payment
			var str_append = ''
			for (var i=0;i<data_val.length;i++){
				str_append+='<tr><td class="dt_col_hide">'+data_val[i].id+'</td>\
				<td>'+(i+1)+'</td>\
				<td>'+data_val[i].name+'</td>\
				<td><u><a href='+data_val[i].input_file+'>Download Input File</a></u></td>\
				<td><u><a href='+data_val[i].output_file3+'>Download SBI Beneficiary</a></u></td>\
				<td><u><a href='+data_val[i].output_file6+'>Download SBI Transfer</a></u></td>\
				<td><u><a href='+data_val[i].output_file1+'>Download NEFT Beneficiary</a></u></td>\
				<td><u><a href='+data_val[i].output_file5+'>Download NEFT Transfer</a></u></td>\
				<td><u><a href='+data_val[i].output_file2+'>Download RTGS Beneficiary</a></u></td>\
				<td><u><a href='+data_val[i].output_file4+'>Download RTGS Transfer</a></u></td>\
				'
				str_append += '<td><button type="button" class="btn btn-danger btn-xs" onclick="delete_confirm('+data_val[i].id+')"><i class="fa fa-times" aria-hidden="true" data-toggle="tooltip" data-placement="top" data-original-title="Remove"></i></button></td>';
				str_append+='</tr>'
			}
			$('#payment_table_tbody').append(str_append)
		} else {
			alert_lobibox('error','Datatable loading error')
		}
	

	});
}


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
			$('#loading').show();
				$.ajax({
					url : '/payment/delete/',
					type : 'POST',
					data :{'id':delete_id,csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()},
					error:(function(error){
						alert(error.statusText);
					}),
					success:(function(json_data){
						var data  = JSON.parse(json_data)
						$('#loading').hide();
						if (data.status == 'NTE-004'){
							clear_page();
							$("#payment_table").DataTable().destroy();
							alert_lobibox('success','Details Removed Successfully')
							rerender_table();
						}
					}),
					complete:(function(){
						$('#loading').hide();
					})
				});
			 
		  } else {
		    swal("Cancelled", "Your file is safe :)", "error");
		  }
		});
	}
function clear_page(){
	is_file_uploaded  = 0;
	$('#name').val('');
	$('#input_file_encrypted').html('');
	$('.fileinput-exists').trigger('click');
}
$("#payment_form").submit(function(e) {
	e.preventDefault();
}).validate({
		rules : {
			name : {
				required : true,
			}
		},
		//For custom messages
		messages : {
			name : {
				required : "Enter a  Name",
			}
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
	function check_validation(){
		if($('#payment_form').valid()){
				return true
		}else{
			return false
		}
	}
	function rerender_table(){

		$("#payment_table").DataTable({
			"order": [[ 1, 'asc' ]],
			"aoColumnDefs": [ { "sClass": "dt_col_hide", "aTargets": [0] } ],
			"language": {
				"aria": {
					"sortAscending": ": activate to sort column ascending",
					"sortDescending": ": activate to sort column descending" 
				},
				"emptyTable": "No data available in table",
				"info": "Showing _START_ to _END_ of _TOTAL_ entries",
				"infoEmpty": "No entries found",
				"infoFiltered": "(filtered1 from _MAX_ total entries)",
				"lengthMenu": "_MENU_",
				"search": "",
				"zeroRecords": "No matching records found" ,
			},
			lengthMenu: [[5, 10, 25, 50, 100], [5, 10, 25, 50, 100]],
			buttons: [ ],
			dom: "<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-12'><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-9 col-sm-12'i><'col-md-3 col-sm-12'lp>>",
		});
		payment_table();
	}

	$(document).on('click','#clear',function(){
		clear_page();
	});