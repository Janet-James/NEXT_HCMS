$(document).ready(function(){
	created_document_list();
	var access_for_create = jQuery.inArray( "Correspondance Management Document Creation", JSON.parse(localStorage.Create) );
	if(access_for_create != -1){
		$('#document_generation_section').html(`<button type="button" id='generate_document' class="btn btn-info">Preview Document</button>
		<button type="button" id='sync_user' class="btn btn-info">Sync Exit Employee Details</button>
`);
		$('#document_popup_section').html(`<button type="button" id='save_previewed_document' class="btn btn-info">Save Preview Document</button>
		<button type="button" id='generate_saved_document' class="btn btn-info">Generate Document</button> `);
		
		$('#sync_data_section').html(`<button type="button" id='sync_data_to_hcms' class="btn btn-info pull-left">Sync Data</button>`);
	}
});
output_html = ''
$('#template_message,#preview_template').summernote({
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

$(document).on('change',"#template_name",function(){

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var data = JSON.parse(this.responseText);
			$.each(data.data,function(key,item){
				$('#template_message').summernote('code',item['template_message']);
				$('#changed_category_name').val(item['table_name'])
			});
		}
	}

	var template_name = $(this).val()
	xhttp.open("GET", "/cs/get_template?template_id="+template_name, true);
	xhttp.send();
});

$(document).on('change',"#preview_selection",function(){
			var selected_id = $(this).val();
			$.each(output_html,function(key,item){
				if (item['id'] == selected_id){
					$('#preview_template').summernote('code',item['template']);
				}
			});
});

$(document).on('click','#save_previewed_document',function(){
	var selected_id = $('#preview_selection').val();
	$.each(output_html,function(key,item){
		if (item['id'] == selected_id){
			item['template'] =  $('#preview_template').summernote('code');
			alert_lobibox('success','Details Saved Successfully')
		}
	});
});
$(document).on('click','#generate_saved_document',function(){
	$.ajax({
		url : '/cs/generate_saved_document/',
		type : 'POST',
		data :{'data':JSON.stringify(output_html),csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()},
		error:(function(error){
			error_status_group(error.statusText);
		}),
		success:(function(json_data){
			var data = jQuery.parseJSON(json_data)
			if (data.status == 'NTE-001'){
				output_html = data.output_file_lists
				$.each(data.output_file_lists,function(key,value){
					$('#generated_document_list').append('<li><a target="_blank" data-title="CS-" href='+value['file_name']+'>'+value['output_file']+'</a></li>');
				});
				$("#created_templates_list").DataTable().destroy();
				created_document_list();
				$('#CS_preview').modal('hide');
				alert_lobibox('success','Document Generated Successfully')
			}
		}),
		complete:(function(){
//			$('#loading').hide();
		})
	});
});
$(document).on('click','#generate_document',function(){
	$('#CS_preview').modal('show');
	$('#generated_document_list').html('');
	var save_template = {}
	save_template['template_id'] = $('#template_name').val();
	save_template['template_name'] = $("#template_name option:selected").text();
	save_template['employee_list'] = $('#employee_list').val()
	save_template['template_message'] = $('#template_message').summernote('code')
	save_template['changed_category_name'] = $('#changed_category_name').val();
	$.ajax({
		url : '/cs/generate_document/',
		type : 'POST',
		data :{'data':JSON.stringify(save_template),csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()},
		error:(function(error){
			error_status_group(error.statusText);
		}),
		success:(function(json_data){
			var data = jQuery.parseJSON(json_data)
			if (data.status == 'NTE-001'){
				$('#preview_selection').html('')
				output_html = data.output_file_lists
				$.each(data.output_file_lists,function(key,value){
					$('#preview_selection').append('<option value='+value['id']+'>'+value['name']+'</option>');
					//$('#generated_document_list').append('<li><a target="_blank" data-title="CS-" href='+value['file_name']+'>'+value['output_file']+'</a></li>');
				});
				$("#preview_selection").val($("#preview_selection option:first").val()).change();
				/*$("#created_templates_list").DataTable().destroy();
				created_document_list();*/
			//	alert_lobibox('success','Generated Successfully')
			}
		}),
		complete:(function(){
//			$('#loading').hide();
		})
	});
	
	return false;
});


function created_document_list(){
	$.ajax({
		url : '/cs/created_document_list/',
		type : 'GET',
		error:(function(error){
			alert_lobibox("error", error.statusText);
		})
	}).done( function(json_data) {
		var data = JSON.parse(json_data);
		$('#created_templates_list_tbody').html('');
		if (data.status=='NTE-001'){
			var data_val = data.data
			var str_append = ''
			for (var i=0;i<data_val.length;i++){
				str_append+='<tr><td>'+(i+1)+'</td><td>'+data_val[i].template_name+'</td><td><a data-title="CS-" target="_blank" href="'+data_val[i].file_name+'">'+data_val[i].file_path+'</a></td><td>'+data_val[i].created_date_time+'</td></tr>'
			}
			$('#created_templates_list_tbody').append(str_append)
		} else {
			alert_lobibox('error','Datatable loading error')
		}
		$("#created_templates_list").DataTable({
			"order": [[ 0, 'asc' ]],
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

$(document).on('click','#sync_user',function(){
	 $('#sync_employee_list').val('0').trigger('change');
	 $('#date_of_relieving').val('');
	 $('#date_of_relieving').next().text('');
	$('#Data_Sync_Modal').modal('show');
	/*$.ajax({
		url : '/cs/sync_employee_list/',
		type : 'GET',
		error:(function(error){
			alert_lobibox("error", error.statusText);
		})
	}).done( function(json_data) {
		var data = JSON.parse(json_data);
		alert(data);
	});*/
});
$(document).on('click','#sync_data_to_hcms',function(){
	if(syn_data_validation()){
		var sync_data = {}
		sync_data['employee_list'] = $('#sync_employee_list').val();
		sync_data['relieving_date'] = $('#date_of_relieving').val();
		$.ajax({
			url : '/cs/sync_employee_list/',
			type : 'POST',
			data :{'data':JSON.stringify(sync_data),csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()},
			error:(function(error){
				error_status_group(error.statusText);
			}),
			success:(function(json_data){
				var data = jQuery.parseJSON(json_data)
				if (data.status == 'NTE-001'){
					alert_lobibox('success',data.message);
					console.log('list',data.sync_employee_dropdown)
					$('#sync_employee_list').html('');
					$.each(data.sync_employee_dropdown,function(key,item){
						$('#sync_employee_list').append('<option value='+item['id']+'>'+item['name']+'</option>')
			});
					
					$('#sync_employee_list').val('').trigger('change');
					$('#date_of_relieving').val('');
					$('#date_of_relieving').next().text('');
					
				}
			}),
			complete:(function(){
//				$('#loading').hide();
			})
		});
	}

});
function syn_data_validation(){
	if($('#sync_employee_list').val() == null)
		alert_lobibox('error','Select any Employee to Sync Data')
	else if($('#date_of_relieving').val()  == '')
		alert_lobibox('error','Select Date of relieving')
	else
		return true
}
$('#preview_close').click(function(){
	$('.note-popover').hide();
});