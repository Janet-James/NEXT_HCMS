function injuriesClick(){
	$.ajax({
		type:'post',
		url: "/incident/injury_details_view/",
		data: {'record_id':kanban_clicked_id,csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()},
		success: function (json_data){
			if(json_data['status']=="NTE_01"){
				if(json_data['injury_details_data'].length!=0){
					for(var i=0;i<json_data['injury_details_data'].length;i++){
						$('#injury_type').val(json_data['injury_details_data'][i]['incident_injury_type_id']).trigger('change');
						$('#illness_id').val(json_data['injury_details_data'][i]['illness_id']).trigger('change');
						$('#body_type').val(json_data['injury_details_data'][i]['body_part_type_id']).trigger('change');
						$('#laterality_type').val(json_data['injury_details_data'][i]['body_part_laterality_id']).trigger('change');
						if(json_data['injury_details_data'][i]['injury_notes']!="null"){
							$('#notes_id').val(json_data['injury_details_data'][i]['injury_notes']);
						}
						else{
							$('#notes_id').val('');
						}
						$.each(JSON.parse(json_data['injury_details_data'][i]['treatment']), function( j, val ){
							$('input:checkbox[name=treatment]').each(function(){
								if($(this)["0"].value==val)
								{
									$(this).prop("checked",true)
								}
							})
						})
						$("#injury_details_update").show();
						$("#injury_details_add").hide();
					}
				}
				else{
					$("#injury_details_update").hide();
					$("#injury_details_add").show();
				}
			}
			else{
				$("#injury_details_update").hide();
				$("#injury_details_add").show();
			}

		}
	})
}

$('#injury_details_add').click(function(){
	var injury_type=$('#injury_type').val();
	var illness=$('#illness_id').val();
	var body_type = $('#body_type').val();
	var laterality_type=$('#laterality_type').val();
	var notes_id=$('#notes_id').val();
	var treatment = [];
	$("input:checkbox[name=treatment]:checked").each(function () {
		field_value=$(this).val()
		treatment.push(field_value)
	});
	data = {'record_id':kanban_clicked_id,'treatment':JSON.stringify(treatment),'injury_type':injury_type,'illness_type':illness,'part_of_body_type':body_type,'laterality_type':laterality_type,'notes':notes_id,csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()}
	ajax_data('POST','/incident/injury_details_save/',data);
})

$('#injury_details_update').click(function(){
	var injury_type=$('#injury_type').val();
	var illness=$('#illness_id').val();
	var body_type = $('#body_type').val();
	var laterality_type=$('#laterality_type').val();
	var notes_id=$('#notes_id').val();
	var treatment = [];
	$("input:checkbox[name=treatment]:checked").each(function () {
		field_value=$(this).val()
		treatment.push(field_value)
	});
	data = {'record_id':kanban_clicked_id,'treatment':JSON.stringify(treatment),'injury_type':injury_type,'illness_type':illness,'part_of_body_type':body_type,'laterality_type':laterality_type,'notes':notes_id,csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()}
	ajax_data('POST','/incident/injury_details_update/',data);
})

$('#injury_details_delete').click(function(){
	data = {'record_id':kanban_clicked_id,csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()}
	ajax_data('POST','/incident/injury_details_remove/',data);
	document.getElementById("injuries_details_recording").reset();
	$('#injury_type').val(0).trigger("change");
	$('#illness_id').val(0).trigger("change");
	$('#body_type').val(0).trigger("change");
	$('#laterality_type').val(0).trigger("change");
	$('#notes_id').val('');
});

$('#injury_details_clear').click(function(){
	injuryReset();
})

function injuryReset(){
	document.getElementById("injuries_details_recording").reset();
	$('#injury_type').val(0).trigger("change");
	$('#illness_id').val(0).trigger("change");
	$('#body_type').val(0).trigger("change");
	$('#laterality_type').val(0).trigger("change");
	$('#notes_id').val('');
	$('#myKanban').show();
	$('#accordion_view').hide();
}