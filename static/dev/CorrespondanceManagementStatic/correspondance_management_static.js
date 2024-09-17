var template_old_data = ''
var access_for_create_cs = jQuery.inArray( "Correspondance Management Template Configuration", JSON.parse(localStorage.Create) );
var access_for_delete_cs = jQuery.inArray( "Correspondance Management Template Configuration", JSON.parse(localStorage.Delete) );
if (access_for_delete_cs == -1){
	$('#template_table>thead>tr>th:last,#header_table>thead>tr>th:last,#footer_table>thead>tr>th:last').remove()
}
$('#template_message').summernote({
	 height: 500,
	 toolbar: [
	           ['style', ['style']],
	           ['font', ['bold', 'italic', 'underline', 'clear']],
	           ['fontname', ['fontname']],
	           ['color', ['color']],
	           ['para', ['ul', 'ol', 'paragraph']],
	           ['height', ['height']],
	           ['table', ['table']],
	           ['insert', ['link', 'picture', 'hr']],
	           ['view', ['fullscreen', 'codeview']],
	         ],
});
table_id = 0;
header_footer_table_id = 0;
var lastCaretPos = 0;
var parentNode; 
var range;
var selection;
$('.note-editable').on('keyup mouseup',function (e){
	selection = window.getSelection();
	range = selection.getRangeAt(0);
	parentNode = range.commonAncestorContainer.parentNode;
});

/*$('.summernote').summernote({
	 height: 300,
	  tabsize: 2,
    toolbar: [
      ['bold', ['bold']], 
      ['italic', ['italic']], 
      ['underline', ['underline']], 
      ['clear', ['clear']],
      ['strikethrough', ['strikethrough']],
      ['fontsize', ['fontsize']],
      ['color', ['color']],
      ['ul', ['ul']],
      ['ol', ['ol']],
      ['paragraph', ['paragraph']],
      ['height', ['height']]
    ]
  });*/
$(document).ready(function(){
	template_table_function();
	if(access_for_create_cs != -1){
		$('#save_header_section').prepend(`<button type="button" id='save_header' class="btn btn-info">Save Header</button>`);
		$('#save_footer_section').prepend(`<button type="button" id='save_footer' class="btn btn-info">Save Footer</button>`);
		$('#save_template_section').html(`<button type="button" id='save_template' class="btn btn-info pull-left">Save Template</button>`);
	}
});
$(document).on('change',"#table_name",function(){
	var table_name = $(this).val()
	$('#message_insert').html($('<option>', { //Device type by select box data
		value: '0',
		text: 'Select Dynamic Data',
	}));
	if (table_name == 'employee_info'){
		var employee_info_key_list =['Title','Name','Mail Id','Designation','Address','Employee Id','Date of Joining','Date of Relieving',
		                             'Objectives and Compliances','Commercial Project Contribution Table','Inhouse/Non Commercial Project Contribution Table']
		var employee_info_value_list =['[[title]]','[[name]]','[[work_email]]','[[designation]]','[[address]]','[[employee_id]]','[[date_of_joining]]','[[date_of_releaving]]',
		                               '[[objectives_and_compliances]]','[[project_and_contribution_commercial]]','[[project_and_contribution_inhouse]]'
		                              ]
		$.each(employee_info_key_list,function(index,value){
			$('#message_insert').append($('<option>', { //Device type by select box data
				value: employee_info_value_list[index],
				text: employee_info_key_list[index],
			}));
		});
	}
	else
		if (table_name == 'basic_info'){
			var employee_info_key_list =['Current Year','Current Month','Current Month Name','Current Abbreviated Month Name','Current Day',
			                             'Current Day Name','Current Hour','Currrent Minute','Current Second','Unique Document ID']
			var employee_info_value_list =['[[year]]','[[month]]','[[name_of_month]]','[[abbreviated_name_of_month]]','[[day]]',
			                              '[[day_name]]' ,'[[hour]]','[[minute]]','[[second]]','[[document_id]]'
			                              ]
			$.each(employee_info_key_list,function(index,value){
				$('#message_insert').append($('<option>', { //Device type by select box data
					value: employee_info_value_list[index],
					text: employee_info_key_list[index],
				}));
			});
		}
	 /*var xhttp = new XMLHttpRequest();
	  xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	    	var data = JSON.parse(this.responseText);
	    	console.log('datadatadatadatadatadata',data)
	    	$('#message_insert').html($('<option>', { //Device type by select box data
					value: '0',
					text: 'Select',
				}));
	    	$.each(data.data,function(key,item){
	    		$('#message_insert').append($('<option>', { //Device type by select box data
					value: '$'+item['column_name'],
					text: item['column_name_text'],
				}));
	    	});
	    }
	  };
	  var table_name = $(this).val()
	  xhttp.open("GET", "/correspondance/get_columnname?column_name="+table_name, true);
	  xhttp.send();*/
});
//onchange function of insert text in email message
$("#message_insert").bind("change",function(){	
	var value = $(this).val();
	if($(parentNode).parents().is('.note-editable') || $(parentNode).is('.note-editable') ){
    	var span = document.createElement('span');	    
    	span.innerHTML=value;
		
		range.deleteContents();        
        range.insertNode(span);  
        //cursor at the last with this
        range.collapse(false);
        selection.removeAllRanges();
		selection.addRange(range);

	}else{
		return;
	}
});

//Email Configuration Save
$(document).on('click',"#save_template",function(){

	if($('#template_form').valid()){
	var save_template = {}
	save_template['description'] = $('#template_name').val()
	save_template['table_name'] = $('#table_name').val()
	save_template['header_id'] = $('#header_id').val()
	save_template['footer_id'] = $('#footer_id').val()
	save_template['template_message'] = $('#template_message').summernote('code')
	watermark_list= []
	$.each($("input[name=watermark]:checked"), function(){            
		watermark_list.push($(this).val());
	});
	save_template['watermark'] = watermark_list
	
	if (table_id!=0)
		save_template['id'] = table_id
	$.ajax({
		url : '/cs/save_template/',
		type : 'POST',
		data :{'data':JSON.stringify(save_template),csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()},
		error:(function(error){
			error_status_group(error.statusText);
		}),
		success:(function(json_data){
			var data = jQuery.parseJSON(json_data)
			if (data.status == 'NTE-001'){
				alert_lobibox('success','Details Added Successfully')
				recall_template_function();
			}
			else if (data.status == 'NTE-003'){
				alert_lobibox('success','Details Updated Successfully')
				recall_template_function();
			}
			
			else if (data.status == 'NTE-002'){
				alert_lobibox('success','Details Updated Successfully')
				recall_template_function();
			
			}
			else if (data.status == 'NTE-004'){
				alert_lobibox('error','Template already exists')
			
			}
			
		}),
		complete:(function(){
//			$('#loading').hide();
		})
	});
	}
	
	return false;
});

function recall_template_function(){
	$("#template_table").DataTable().destroy();
	template_table_function();
	clear_page();
}
//function to show all group details in a table
function template_table_function() {
	$.ajax({
		url : '/cs/template_table/',
		type : 'GET',
		error:(function(error){
			alert_lobibox("error", error.statusText);
		})
	}).done( function(json_data) {
		var data = JSON.parse(json_data);
		$('#templates_tbody').html('');
		if (data.status=='NTE-001'){
			var data_val = data.data
			template_old_data = data_val
			var str_append = ''
			for (var i=0;i<data_val.length;i++){
				str_append+='<tr><td>'+data_val[i].id+'</td><td>'+data_val[i].row_number+'</td><td>'+data_val[i].template_name+'</td>'
				if (access_for_delete_cs != -1)
					str_append += '<td><button type="button" class="btn btn-danger btn-xs" onclick="delete_confirm('+data_val[i].id+')"><i class="fa fa-times" aria-hidden="true" data-toggle="tooltip" data-placement="top" data-original-title="Remove"></i></button></td>';
				str_append+='</tr>'
			}
			$('#templates_tbody').append(str_append)
		} else {
			alert_lobibox('error','Datatable loading error')
		}
		$("#template_table").DataTable({
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
	});
}
$('#template_table').on('click', 'tbody tr', function(){
	$('#template_name-error').remove()
	var arr=$('#template_table').dataTable().fnGetData($(this)); 
	table_id  = arr[0]
	$.ajax({
		url : '/cs/template_table/',
		type : 'GET',
		data :{'id':table_id},
		error:(function(error){
			alert_lobibox("error", error.statusText);
		})
	}).done( function(json_data) {
		var data = JSON.parse(json_data);
		if (data.status=='NTE-001'){
				var data_val = data.data
				$('#template_name').val(data_val[0].template_name);
				$('#table_name').val(data_val[0].table_name);
				$('#template_message').summernote('code',data_val[0].template_message);
				$('#header_id').val(data_val[0].header_id);
				$('#footer_id').val(data_val[0].footer_id);
				$("input[name=watermark]").prop("checked",false)
				for (i in data_val[0].watermark){
		$("input[name=watermark][value="+data_val[0].watermark[i]+"]").prop('checked', true)
	}
				/*$('.myCheckbox').prop('checked', true);
				$('.myCheckbox').prop('checked', true);
				$('.myCheckbox').prop('checked', true);*/
		} else {
			alert_lobibox('error','Datatable loading error')
		}
	});
});

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
			  var save_template = {}
				if (table_id!=0)
					save_template['id'] = table_id 
					save_template['delete_flag'] = true
				$.ajax({
					url : '/cs/save_template/',
					type : 'POST',
					data :{'data':JSON.stringify(save_template),csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()},
					error:(function(error){
						error_status_group(error.statusText);
					}),
					success:(function(json_data){
						var data = jQuery.parseJSON(json_data)
						if (data.status == 'NTE-004'){
							 $("#template_table").DataTable().destroy();
							  template_table_function();
							  clear_page();
							alert_lobibox('success','Details Removed Successfully')
						}
					}),
					complete:(function(){
//						$('#loading').hide();
					})
				});
			 
		  } else {
		    swal("Cancelled", "Your file is safe :)", "error");
		  }
		});
	}

function clear_page(){
	table_id = 0;
	$('#table_name').val('0');
	$('#table_name').trigger('change');
	$('#message_insert').val('0');
	$('#message_insert').trigger('change');
	$('#template_message').summernote('code','');
	$('#template_name').val('');
	$('#header_id,#footer_id').val('0').trigger('change');
}
$('#clear_template').click(function(){
	clear_page();
	return false;
});


$("#template_form").submit(function(e) {
	e.preventDefault();
}).validate({
		rules : {
			template_name : {
				required : true,
			}
		},
		//For custom messages
		messages : {
			template_name : {
				required : "Enter a Template Name",
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


function cs_header_footer(flag){
header_footer_table_id = 0;
	if(flag == 'header'){
		$('#CS_Header').modal('show');
		 $("#header_table").DataTable().destroy();
		display_header_table('header');
	}
	else{
		$('#CS_Footer').modal('show');
		 $("#footer_table").DataTable().destroy();
		display_header_table('footer');
	}
}

//header pop up function
$('#header_table,#footer_table').on('click', 'tbody tr', function(){
	
	var current_table = $(this).parents('table').attr('id');
	if(current_table == 'header_table'){
		var arr=$('#header_table').dataTable().fnGetData($(this)); 
		var flag = 'header';
	}
	else{
		var arr=$('#footer_table').dataTable().fnGetData($(this)); 
		var flag = 'footer';
	}
	header_footer_table_id  = arr[0];
	$.ajax({
		url : '/cs/list_header_footer/',
		type : 'GET',
		data :{'id':header_footer_table_id,'flag':flag},
		error:(function(error){
			alert_lobibox("error", error.statusText);
		})
	}).done( function(json_data) {
		var data = JSON.parse(json_data);
		if (data.status=='NTE-001'){
				var data_val = data.data;
				if(current_table == 'header_table'){
				$('#header_name').val(data_val[0].header_name);
				$('#header_encrypted_image').html("<img src='"+data_val[0].encrypt_image+"' alt='Image' />").trigger('click');	
				}
				else{
					$('#footer_name').val(data_val[0].header_name);
					$('#footer_encrypted_image').html("<img src='"+data_val[0].encrypt_image+"' alt='Image' />").trigger('click');	
				}
		} else {
			alert_lobibox('error','Datatable loading error')
		}
	});
});
$(document).on('click','#save_header,#save_footer',function(){
	var flag_id = $(this).attr('id')
	var header_image= '';
	var is_file_uploaded = 0;
	if(flag_id == 'save_header'){
		if($('#header_form').valid()){
		}
			else 
				return
	}
	else if(flag_id == 'save_footer'){
		if($('#footer_form').valid()){}
			else 
				return
	}
	
	if(flag_id == 'save_header'){
		header_image = '#header_image';
		header_name = $('#header_name').val();
	}
	else if(flag_id == 'save_footer'){
		header_image = '#footer_image';
		header_name = $('#footer_name').val()
	}
	
	var data = new FormData();
	jQuery.each(jQuery(header_image)[0].files, function(i, file) {
		is_file_uploaded = 1;
	    data.append('header_image', file);
	    var file_type = file.type;
	    if ((file_type).indexOf('/') > -1){
	    	var file_type_array = file_type.split('/')
	    	type_of_file = file_type_array[file_type_array.length - 1]
	    	data.append('type_of_file', type_of_file)
	    }
	});
	data.append('header_name', header_name)
	if(header_footer_table_id){
	data.append('id', header_footer_table_id);
	}
	else
		{
		if (!(is_file_uploaded)){
			alert_lobibox('error','Please upload a file')
			return
		}
		}
	if(flag_id == 'save_header'){
		data.append('flag', 'header');
	}
	else if(flag_id == 'save_footer'){
		data.append('flag', 'footer');
	}
	
	data.append('csrfmiddlewaretoken',$("input[name=csrfmiddlewaretoken]").val());
	
	jQuery.ajax({
	    url: '/cs/save_header_footer/',
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
	    success: function(data){
	    	 var parsed_data = JSON.parse(data);
	    	// $('#loading').hide();
	   
	    	 if(flag_id == 'save_header'){
	    		 $("#header_table").DataTable().destroy();
	    	 	 display_header_table('header');
	    	 	clear_header_footer();
	    	 }
	    	else if(flag_id == 'save_footer'){
	    		$("#footer_table").DataTable().destroy();
	    		display_header_table('footer');
	    		clear_header_footer();
	    	}
	    	 if(parsed_data.status == 'NTE-001')
	    		 alert_lobibox('success','Details Saved Successfully')
	    	else  if(parsed_data.status == 'NTE-003')
	    		 alert_lobibox('success','Details Updated Successfully')
	    	else
	    		alert_lobibox('success','Error Ocurred')
	    },
	    error:(function(error){
	    	
		})
	})
});

function display_header_table(flag){
	if (flag == 'header'){
		table_tbody = '#header_table_tbody';
		table_name = '#header_table';
	}
	else{
		table_tbody = '#footer_table_tbody';
		table_name = '#footer_table';
	}
	$.ajax({
		url : '/cs/list_header_footer/',
		type : 'GET',
		data:{'flag':flag},
		error:(function(error){
			alert_lobibox("error", error.statusText);
		})
	}).done( function(json_data) {
		var data = JSON.parse(json_data);
		$(table_tbody).html('');
		if (data.status=='NTE-001'){
			if (flag == 'header'){
				$('#header_id').html('<option disabled="disabled" value="0"  selected="selected">-Select Header Image-</option>');
				
			}
			else if (flag == 'footer'){
				$('#footer_id').html('<option disabled="disabled" value="0"  selected="selected">-Select Footer Image-</option>');
			}
			var data_val = data.data
			var str_append = ''
			for (var i=0;i<data_val.length;i++){
				str_append+='<tr><td>'+data_val[i].id+'</td><td>'+data_val[i].row_number+'</td><td>'+data_val[i].name+'</td>';
				if (access_for_delete_cs != -1)
					str_append +='<td><button type="button" class="btn btn-danger btn-xs" onclick="header_delete_confirm('+data_val[i].id+',\''+flag+'\')"><i class="fa fa-times" aria-hidden="true" data-toggle="tooltip" data-placement="top" data-original-title="Remove"></i></button></td>';
				str_append += '</tr>'
				if (flag == 'header'){
					$('#header_id').append('<option value='+data_val[i].id+'>'+data_val[i].name+'</option>');
				}
				else if (flag == 'footer'){
					$('#footer_id').append('<option value='+data_val[i].id+'>'+data_val[i].name+'</option>');
				}
			}
			$(table_tbody).append(str_append)
		} else {
			alert_lobibox('error','Datatable loading error')
		}
		$(table_name).DataTable({
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
	});

}

function header_delete_confirm(delete_id,flag) {
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
			  var save_template = {}
				if (header_footer_table_id!=0)
					save_template['id'] = header_footer_table_id 
					save_template['delete_flag'] = true
				$.ajax({
					url : '/cs/update_header_footer/',
					type : 'POST',
					data :{'data':JSON.stringify(save_template),csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()},
					error:(function(error){
						error_status_group(error.statusText);
					}),
					success:(function(json_data){
						var data = jQuery.parseJSON(json_data)
						if (data.status == 'NTE-004'){
							 if(flag == 'header'){
								  $("#header_table").DataTable().destroy();
								  display_header_table('header');
							  }
							  else{
								  $("#footer_table").DataTable().destroy();
								  display_header_table('footer');
							  }
							  clear_header_footer();
							alert_lobibox('success','Details Deleted Successfully')
						}
						else{
							alert_lobibox('success','Error Occured')
						}
					}),
					complete:(function(){
//						$('#loading').hide();
					})
				});
			 
		  } else {
		    swal("Cancelled", "Your file is safe :)", "error");
		  }
		});
	}

function clear_header_footer(){
	$('#CS_Header div.error,#CS_Footer div.error').remove();
	header_footer_table_id = 0;
	$('#header_name').val('');
	$('#footer_name').val('');
	$('#header_encrypted_image').html('');
	$('#footer_encrypted_image').html('');
	$('.fileinput-exists').trigger('click');
}

$('.clear_header_footer').click(function(){
	clear_header_footer();
});
if ($('select').data('select2')) {
	   $('select').select2('destroy');
	 }

$("#header_form").submit(function(e) {
	e.preventDefault();
}).validate({
		rules : {
			header_name : {
				required : true,
			}
		},
		//For custom messages
		messages : {
			header_name : {
				required : "Enter a Header Name",
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

$("#footer_form").submit(function(e) {
	e.preventDefault();
}).validate({
		rules : {
			footer_name : {
				required : true,
			}
		},
		//For custom messages
		messages : {
			footer_name : {
				required : "Enter a Footer Name",
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
