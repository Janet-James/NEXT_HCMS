var option=''; var invest_remove_file_id=[]; var data_row;
//file upload
function uploadFileContent(input) {
	var strAppend = ''
		if (input.files && input.files[0]) {
			$(input.files).each(function () {
				var extension = (input.files[0]['name']).split('.')[1];
				var fname_status = fileNameValidation(input.files[0]['name']);
				if(fname_status == 0){
					if($.inArray(extension, ['doc','pdf','docx','gif','png','jpeg','mp4','mp3']) == -1){
						alert_lobibox("error", "Invalid extension.please select doc,docx,pdf,gif,jpeg,png,mp4,mp3");
					}else{
						var filename = (input.files[0]['name']).replace(/\s/g, '');
						var reader = new FileReader();
						reader.readAsDataURL(this);
						reader.onloadend = function (e) {
							var fileContent = e.target.result.split(',')[1];
							strAppend += '<li value="'+(fileContent)+'" class="'+filename+'"><span>'+input.files[0]['name']+'</span>  <button class="removeClass" style="color:red">x</button></li>'
							$('#file_upload_content').append(strAppend);
						}
					}
				}else{
					alert_lobibox("error",sysparam_datas_list['ERR0039']);
				}
			});
		}
}
//file name validation 
function fileNameValidation(fName){
	var val = 0;
	$('#file_upload_content li').each(function(element){// id of ul
		var fNames = $(this).attr("class");
		if(fNames == fName){
			val = 1
		}
	})
	return val;
}
//remove the file
$('ul').on('click','.removeClass' , function(el){
	$(this).parent().remove()
});

//data get function here
function getImageData(){
	file_datas_list = []
	$('#file_upload_content li').each(function(element){// id of ul
		file_data = {}
		file_data['name'] = $(this).attr("class");
		file_data['format'] = $(this).attr("class").split('.')[1];
		file_data['encode'] = $(this).attr("value");
		file_datas_list.push(file_data); 
	})
	return file_datas_list;
}
//update file upload
function update_uploadFileContent(input) {
	var strAppend = ''
		if (input.files && input.files[0]) {
			$(input.files).each(function () {
				var extension = (input.files[0]['name']).split('.')[1];
				var fname_status = update_fileNameValidation (input.files[0]['name']);
				if(fname_status == 0){
					if($.inArray(extension, ['doc','pdf','docx','gif','png','jpeg','mp4','mp3']) == -1){
						alert_lobibox("error", "Invalid extension.please select doc,docx,pdf,gif,jpeg,png,mp4,mp3");
					}else{
						var filename = (input.files[0]['name']).replace(/\s/g, '');
						var reader = new FileReader();
						reader.readAsDataURL(this);
						reader.onloadend = function (e) {
							var fileContent = e.target.result.split(',')[1];
							strAppend += '<li value="'+(fileContent)+'" class="'+filename+'"><span>'+input.files[0]['name']+'</span>  <button class="removeClass" style="color:red">x</button></li>'
							$('#update_file_upload_content').append(strAppend);
						}
					}
				}else{
					alert_lobibox("error",sysparam_datas_list['ERR0039']);
				}
			});
		}
}
//update file name validation 
function update_fileNameValidation(fName){
	var val = 0;
	$('#update_file_upload_content li').each(function(element){// id of ul
		var fNames = $(this).attr("class");
		if(fNames == fName){
			val = 1
		}
	})
	return val;
}
function update_getImageData(){
	update_file_datas_list = []
	$('#update_file_upload_content li').each(function(element){// id of ul
		file_data = {}
		file_data['name'] = $(this).attr("class");
		file_data['format'] = $(this).attr("class").split('.')[1];
		file_data['encode'] = $(this).attr("value");
		update_file_datas_list.push(file_data); 
	})
	return update_file_datas_list;
}
//investigation file upload
function investigation_uploadFileContent(input) {
	var strAppend = ''
		if (input.files && input.files[0]) {
			$(input.files).each(function () {
				var extension = (input.files[0]['name']).split('.')[1];
				var fname_status = investigation_fileNameValidation (input.files[0]['name']);
				if(fname_status == 0){
					if($.inArray(extension, ['doc','pdf','docx','gif','png','jpeg','mp4','mp3']) == -1){
						alert_lobibox("error", "Invalid extension.please select doc,docx,pdf,gif,jpeg,png,mp4,mp3");
					}else{
						var filename = (input.files[0]['name']).replace(/\s/g, '');
						var reader = new FileReader();
						reader.readAsDataURL(this);
						reader.onloadend = function (e) {
							var fileContent = e.target.result.split(',')[1];
							strAppend += '<li value="'+(fileContent)+'" class="'+filename+'"><span>'+input.files[0]['name']+'</span>  <button class="removeClass" style="color:red">x</button></li>'
							$('#investigation_file_upload_content').append(strAppend);
						}
					}
				}else{
					alert_lobibox("error",sysparam_datas_list['ERR0039']);
				}
			});
		}
}
//investigation file name validation 
function investigation_fileNameValidation(fName){
	var val = 0;
	$('#investigation_file_upload_content li').each(function(element){// id of ul
		var fNames = $(this).attr("class");
		if(fNames == fName){
			val = 1
		}
	})
	return val;
}
function investigation_getImageData(){
	investigation_file_datas_list = []
	$('#investigation_file_upload_content li').each(function(element){// id of ul
		file_data = {}
		file_data['name'] = $(this).attr("class");
		file_data['format'] = $(this).attr("class").split('.')[1];
		file_data['encode'] = $(this).attr("value");
		investigation_file_datas_list.push(file_data); 
	})
	return investigation_file_datas_list;
}
function details_form_submit(){       
	var details_subject=$('#details_subject').val(); var incident_date=$('#incident_date').val();
	var details_description = $('#details_description').val(); var incident_type=$('#incident_type').val();
	var incident_severity_type=$('#incident_severity_type').val(); var details_location=$('#details_location').val();
	var category=$('#category').val(); var trigger_info= $("#trigger_info").val(); var reported_by= $('#reported_by').val();
	var mode= $("#mode").val(); var victrim_id= $("#victrim_id").val(); var witness_id= $("#witness_id").val();
	var prepetrator_id= $("#prepetrator_id").val(); var risk_details= $("#risk_details").val(); var status= $("#status").val();
	var validation_status = incident_details_form_validation();
	var datas = getImageData();
	if(validation_status){
		if(details_subject!='' && incident_date!='' && prepetrator_id!=null && victrim_id!=null){
			var load_data={'details_subject':details_subject,'incident_date':incident_date,'details_description':details_description,
					'incident_type':incident_type,'incident_severity_type':incident_severity_type,
					'details_location':details_location,'category':category,'trigger_info':trigger_info,'reported_by':reported_by,
					'mode':mode,'victrim_id':JSON.stringify(victrim_id),'witness_id':JSON.stringify(witness_id),'prepetrator_id':JSON.stringify(prepetrator_id),'risk_details':risk_details,
					'status':status,'file':JSON.stringify(datas),
					csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()}

			//    	AJAX function call
			returnVal = ajax_data('post',"/incident/details_save/",load_data)
		}
		else { Lobibox.notify.closeAll(); 
		alert_lobibox("info",sysparam_datas_list["ERR0033"]); }
	}
	else
	{
		Lobibox.notify.closeAll(); 
		alert_lobibox("info",sysparam_datas_list["ERR0033"]);
	}
}
function kamban_view(){   
	$.ajax(
			{
				type:'post',
				url: "/incident/kamban_view/",
				success: function (json_data){
					var fetch_data=json_data.data;
					if(fetch_data!='')
					{  
						var len=fetch_data.length;
						for(var i=0;i<len;i++)
						{
							id = fetch_data[i].status
							KanbanTest.addElement(
									""+id+"",
									{ 
										"title":'<div id="'+fetch_data[i].id+'" onclick="get_data('+fetch_data[i].id+');" ><input type="hidden" value="'+fetch_data[i].id+'"><h2 contentEditable="true">Subject :'+fetch_data[i].subject+'</h2> <div contentEditable="true">location :'+fetch_data[i].location+'</div><p contentEditable="true">Incident Type :'+fetch_data[i].name+'</p></div>',
									}
							);	
						}
					}
					else { 
						id='Open'
						KanbanTest.addElement(
								""+id+"",
								{
									"title":'<h4 contentEditable="true">No Data Available</h4>',
								}
							);	
						id='Close'
							KanbanTest.addElement(
									""+id+"",
									{
										"title":'<h4 contentEditable="true">No Data Available</h4>',
									}
								);	
					}
				},
			})
}

function stage_change(i,e)
{
	if($(i)[0].element.id=="myKanban")
	{   
		var stage=$(e)[0].offsetParent.firstChild.firstChild.textContent
		var id=$(e)[0].firstElementChild.attributes[0]
		if (id!='' && stage!='')
		{
			var load_data={ 'id':id.value,'stage':stage,csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val() }
			ajax_data('post',"/incident/state_change/",load_data);		}
		else
		{
			Lobibox.notify.closeAll(); 
			alert_lobibox("info","Cannot Move");
		}
	}
}
var kanban_clicked_id;
function get_data(id)
{
	$("#injury_details_add").hide();
	$("#injury_details_update").show();
	kanban_clicked_id=id
	$($(".tabs-left li a")[0]).click()
	$('#myKanban').hide();
	$('#accordion_view').show();
	create_button();
	$.ajax({
		type:'post',
		url: "/incident/acc_details/",
		data: {'id':kanban_clicked_id,csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()},
		success: function (json_data){
			var record=json_data.record_data;
			var involed_person=json_data.involved_data;
			var mode=json_data.mode_data
			var file=json_data.file_data
			$('#update_victrim_id').html('');
			$('#update_prepetrator_id').html('');
			$('#update_witness_id').html('');
			$('#file_list').html('');
//			$('#update_incident_type').html('')
//			$('#update_category').html('')
//			$('#update_incident_severity_type').html('')
			$('#update_incident_type').val(0).trigger("change");
			$('#update_incident_severity_type').val(0).trigger("change");
			$('#update_category').val(0).trigger("change");
			$('#update_mode').val(0).trigger("change");
			$('#update_reported_by').html('')
			$('#update_reported_by').append($('<option>', {
				value :'0',
				text :'--Select--'
			}));
			$('#update_status').val('Open').trigger("change");
			if(record)
			{  
				$('#update_details_subject').val(record[0].incident_subject)
				$('#update_incident_date').val(record[0].incident_date)
				$('#update_details_description').val(record[0].incident_description)
				$('#update_details_location').val(record[0].location)
				$('#update_trigger_info').val(record[0].incident_trigger_info)
				$('#update_risk_details').val(record[0].incident_risk_details)
				$('#update_status').val(record[0].incident_resolution_status).trigger("change");
				$('#update_reported_by').append($('<option>', {
					value : record[0].reported_by_id,
					text : record[0].employee_name
				}));
				$('#update_category').append($('<option>', {
					value : record[0].cat_id,
					text : record[0].cat_name
				}));
				$('#update_incident_severity_type').append($('<option>', {
					value : record[0].incident_severity_type_id,
					text : record[0].incident_serverity
				}));
				$('#update_incident_type').append($('<option>', {
					value : record[0].incident_type_id,
					text : record[0].incident_type
				}));
				$('#update_reported_by').val(record[0].reported_by_id).trigger("change");
				$('#update_category').val(record[0].cat_id).trigger("change");
				$('#update_incident_severity_type').val(record[0].incident_severity_type_id).trigger("change");
				$('#update_incident_type').val(record[0].incident_type_id).trigger("change");
			}
			if(involed_person)
			{   
				var involed_person_len=involed_person.length;
				var victim_list=[]
				var prepetrator_list=[]
				var witness_list=[]

				for(var i=0;i<involed_person_len;i++)
				{   
					if(involed_person[i].incident_involved_party_type=='victim')
					{
						$('#update_victrim_id').append($('<option>', {
							value : involed_person[i].incident_involved_employee_id,
							text : involed_person[i].name
						}));
						victim_list.push(involed_person[i].incident_involved_employee_id)
					}
					if(involed_person[i].incident_involved_party_type=='perpetrator')
					{
						$('#update_prepetrator_id').append($('<option>', {
							value : involed_person[i].incident_involved_employee_id,
							text : involed_person[i].name
						}));
						prepetrator_list.push(involed_person[i].incident_involved_employee_id)
					}
					if(involed_person[i].incident_involved_party_type=='witness')
					{
						$('#update_witness_id').append($('<option>', {
							value : involed_person[i].incident_involved_employee_id,
							text : involed_person[i].name
						}));
						witness_list.push(involed_person[i].incident_involved_employee_id)
					}
				}
				$('#update_victrim_id').val(victim_list).trigger("change")
				$('#update_prepetrator_id').val(prepetrator_list).trigger("change");
				$('#update_witness_id').val(witness_list).trigger("change");
			}
			if(mode)
			{   
				$('#update_mode').append($('<option>', {
					value : mode[0].id,
					text : mode[0].refitems_name
				}));

				$('#update_mode').val(mode[0].id).trigger("change"); 
			}
			if(file)
			{   
				$('#file_list').html('')
				var file_len=file.length
				for(var i=0;i<file_len;i++)
				{
					var attached_file_list = "<li><a><i class='nf nf-document'></i>"+file[i].name+"</a>\
					<span onclick=\"remove_file(event,this.getAttribute('id'),this);\"id=\""+file[i].id+"\" class='remove-file'><i class='nf nf-close'></i></span></li>"
					$('#file_list').append(attached_file_list);
				}
			}
		},
	})
}
function acc_details_update(record_id)
{
	var update_id=record_id
	var details_subject=$('#update_details_subject').val(); var incident_date=$('#update_incident_date').val();
	var details_description = $('#update_details_description').val(); var incident_type=$('#update_incident_type').val();
	var incident_severity_type=$('#update_incident_severity_type').val(); var category=$('#update_category').val();
	var details_location=$('#update_details_location').val(); var trigger_info= $("#update_trigger_info").val();
	var reported_by= $('#update_reported_by').val(); var mode= $("#update_mode").val(); var witness_id= $("#update_witness_id").val();
	var victrim_id= $("#update_victrim_id").val(); var prepetrator_id= $("#update_prepetrator_id").val();
	var risk_details= $("#update_risk_details").val(); var status= $("#update_status").val();
	var validation_status = update_incident_details_form_validation();
	var datas = update_getImageData();
	if(validation_status){
		if(details_subject!='' && incident_date!='' && prepetrator_id!=null && victrim_id!=null){
			var load_data={'details_subject':details_subject,'incident_date':incident_date,'details_description':details_description,
					'incident_type':incident_type,'incident_severity_type':incident_severity_type,
					'details_location':details_location,'category':category,'trigger_info':trigger_info,'reported_by':reported_by,
					'mode':mode,'victrim_id':JSON.stringify(victrim_id),'witness_id':JSON.stringify(witness_id),'prepetrator_id':JSON.stringify(prepetrator_id),'risk_details':risk_details,
					'status':status,'file':JSON.stringify(datas),'update_id':update_id,'remove_file':JSON.stringify(remove_file_id),
					csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()}
			//    	AJAX function call
			ajax_data('post',"/incident/details_update/",load_data)
		}
		else { Lobibox.notify.closeAll(); 
		alert_lobibox("info",sysparam_datas_list["ERR0033"]); }
	}
	else
	{
		Lobibox.notify.closeAll(); 
		alert_lobibox("info",sysparam_datas_list["ERR0033"]);
	}

}
var remove_file_id=[];
function remove_file(event,id,el){
	remove_file_id.push(id)
	event.stopPropagation();
	$(el).parent().remove();
}

//function details_remove_confirmation(record_id)
//{    
//	var load_data={ 'record_remove_id':record_id,csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()}
//	ajax_data('DELETE',"/incident/details_remove/",load_data)
//}

function invest_remove_file(event,id,el)
{
	invest_remove_file_id.push(id)
	event.stopPropagation();
	$(el).parent().remove()
}

$("#option li").click(function() {
	/******** get id of clicked li***********/
	option=$(this).attr('id')
	if(option=='Investigation')
	{   
		investigation_table_create();
		$('#team_id').html('');
		var investigation_table = $('#investigation_details_table').DataTable();
		investigation_table.clear().draw();
		$('#investigation_file_upload_content').html('')
		investigation_button();
		if(kanban_clicked_id)
		{
		  $.ajax(
				{
				 type:'post',
				  url: "/incident/investigation_details/",
				  data: {'id':kanban_clicked_id,csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()},
				  success: function (json_data){
					    var team_details=json_data.team_details;
						var qa_details=json_data.qa_details;
						var file=json_data.attachment;
						if(team_details)
						{
						  var team_details_len=team_details.length;
						  var team_list=[]
						  $('#team_id').html('');
						  for(var i=0;i<team_details_len;i++)
						  {  
							$('#team_id').append($('<option>', {
							value : team_details[i].investigation_team_member_id,
							text : team_details[i].name
							}));
								team_list.push(team_details[i].investigation_team_member_id)
							}
						  $('#team_id').val(team_list).trigger("change");
						}
						if(file)
						{
							$('#investigation_file_list').html('')
							var file_len=file.length
							for(var i=0;i<file_len;i++)
							{
								var attached_file_list = "<li><a><i class='nf nf-document'></i>"+file[i].name+"</a>\
								<span onclick=\"invest_remove_file(event,this.getAttribute('id'),this);\"id=\""+file[i].id+"\" class='remove-file'><i class='nf nf-close'></i></span></li>"
								$('#investigation_file_list').append(attached_file_list);
							}
						}
					  if(qa_details)
					  {
						  var qa_len=qa_details.length;
						  for(var i=0;i<qa_len;i++)
						  {
							$('#investigation_details_table').dataTable().fnAddData( ['<input type="text" class="form-control input-small" value="'+qa_details[i].investigation_question+'"/>','<input type="text" class="form-control input-small" value="'+qa_details[i].investigation_answer+'"/>','<i class="nf nf-trash-o rating_row_delete"></i><input type="hidden" class="form-control input-small"  value="'+qa_details[i].id+'"/>'])

						}
					  }
					  if(team_details==undefined)
					  {
						  investigation_button(1);
					  }
 				  },
				})
		}
	}
	if(option=='Corrective Action')
	{ 
		corrective_action_view();
	}
	if(option=='Solution Proposal')
	{
		solution_proposal_view()
	}
});

function solution_proposal_view()
{
	$.ajax(
			{
			 type:'post',
			  url: "/incident/solution_proposal_view/",
			  data: {'id':kanban_clicked_id,csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()},
			  success: function (json_data){
				  var solution_data=json_data.data;
				  if(solution_data.length>0)
				  {   
					  $('#corrective_measure').val(solution_data[0].corrective_measure);
					  $('#preventive_masure').val(solution_data[0].preventive_measure);
					  aolution_proposal_button();
				  }
				  else {  aolution_proposal_button(1);  }
			  },
			})
}
function solution_proposal_save(kanban_record_id)
{
	var corrective_measure=$('#corrective_measure').val();
	var preventive_measure=$('#preventive_masure').val();
	var record_id=kanban_record_id;
	var status = solution_proposal_form_validation();
    if(status){
	if(corrective_measure!='' && preventive_measure!='')
	{
		var load_data={'corrective_measure':corrective_measure,"preventive_measure":preventive_measure,"record_id":record_id,csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()}
		//    	AJAX function call
		ajax_data('post',"/incident/solution_proposal_save/",load_data)
	}
	else{ Lobibox.notify.closeAll(); alert_lobibox("info",sysparam_datas_list["ERR0033"]) }
}
    else{ Lobibox.notify.closeAll(); alert_lobibox("info",sysparam_datas_list["ERR0033"]);}
}
var flag='';
function corrective_action_view()
{
	corrective_action_button(); corrective_action_reset();
	if(kanban_clicked_id)
	{
	 $.ajax({
		type:'post',
		url: "/incident/corrective_action_details/",
		data: {'id':kanban_clicked_id,csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()},
		success: function (json_data){
			var data=json_data.action_item;
			if(data.length>0)
			{ 
			  flag=0;
			  var len=data.length;
			  for(var i=0;i<len;i++)
			  {   
				  hidden_owner_id="<input type='hidden' class='form-control input-small'  value='" +data[i].employee_id+" '/>";
				  $('#corrective_action_table').dataTable().fnAddData( [data[i].action_item_summary,data[i].name+hidden_owner_id,data[i].status,
					 '<i class="nf nf-trash-o rating_row_delete"></i><input type="hidden" class="form-control input-small" value="'+data[i].action_iterm_id+'"/>'])
			  }
			}
			else
				{
				flag=1
				corrective_action_button(1)
				}
		},
	 });
	}
}
function add_data()   //corrective action function
{   
	var action_item=$('#action_item').val(); var owner=$('#owner_id').text(); var owner_id=$('#owner_id').val();
	var status=$('#action_item_status').val(); 
	hidden_owner_id="<input type='hidden' class='form-control input-small'  value='" +owner_id+" '/>";
	var exsist_action_item_id=clicked_row_id
	var status = corrective_action_form_validation();
    if(status){
	if(action_item!='' && owner!=null && status!='' && (exsist_action_item_id==undefined || exsist_action_item_id=='') )
	{   
		$('#corrective_action_table').dataTable().fnAddData( [action_item,owner+hidden_owner_id,status,
		                                           '<i class="nf nf-trash-o rating_row_delete"></i><input type="hidden" class="form-control input-small"  value=""/>'])
	   
		$('#action_item').val(''); $('#owner_id').html(''); $('#action_status').val('Open');
	}
	else if(action_item!='' && owner!=null && status!='' && exsist_action_item_id!='')
	{   
		var load_data={'record_id':kanban_clicked_id,'owner':owner_id,'status':status,'action_id':exsist_action_item_id,'action_item':action_item,csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()}
		//    	AJAX function call
		ajax_data('post',"/incident/corrective_action_update/",load_data);
		 setTimeout(corrective_action_view, 1000);
		 clicked_row_id='';
		$('#action_item').val(''); $('#owner_id').html(''); $('#action_status').val('Open');
	}
	else{ Lobibox.notify.closeAll();
	alert_lobibox("info",sysparam_datas_list["ERR0033"]) }
   }
}

function corrective_action_save(id)    //corrective  action  save
{
	var action_item_status; var owner_status; var status; var table_list=[]; var table_dict={};
	action_item_status='';
	owner_status='';
	status='';
	var correctvie_table=$('#corrective_action_table').DataTable();
	var exsist_action_item_save_id=clicked_row_id
	if(flag!=0)
	{   
		$('#corrective_action_table tbody tr').each(function(row, tr){
			if($(tr).find('td:eq(0)').text()=='')
			{
				action_item_status="empty"
			}
			if($(tr).find('td:eq(1)').text()=='')
			{
				owner_status="empty"
			}
			if($(tr).find('td:eq(2)').text()=='')
			{
				status="empty"
			}
			table_list.push({
				"action_item":$(tr).find('td:eq(0)').text(),
				"owner":$(tr).find('td:eq(1) input[type=hidden]').val(),
				"action_status":$(tr).find('td:eq(2)').text(),
		    })
		});
	}
	if(flag==0)
	{   
		$('#corrective_action_table tbody tr').each(function(row, tr){
		 if($(tr).find('td:eq(3) input[type=hidden]').val()==''){
			if($(tr).find('td:eq(0)').text()=='')
			{
				action_item_status="empty"
			}
			if($(tr).find('td:eq(1)').text()=='')
			{
				owner_status="empty"
			}
			if($(tr).find('td:eq(2)').text()=='')
			{
				status="empty"
			}
			table_list.push({
					"action_item":$(tr).find('td:eq(0)').text(),
					"owner":$(tr).find('td:eq(1) input[type=hidden]').val(),
					"action_status":$(tr).find('td:eq(2)').text(),
			})
		 }
		});
	}
	if ( ! correctvie_table.data().count() ) {
		alert_lobibox("info", sysparam_datas_list["ERR0033"]);
	}
	else if(action_item_status!="empty" &&  owner_status!="empty" && status!="empty" && id!=null) 
	{  
		var load_data={'record_id':id,'data':JSON.stringify(table_list),csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()}
		//    	AJAX function call
		ajax_data('post',"/incident/corrective_action_save/",load_data)
        setTimeout(corrective_action_view, 1000);		
		clicked_row_id='';
	}
	else{ Lobibox.notify.closeAll();  
	alert_lobibox("info",sysparam_datas_list["ERR0033"]) }
}

var clicked_row_id; var clicked_owner_id; var employee_name; var summary; var action_status;
//row clcik in datatable
$('#corrective_action_table').on('click', 'tbody tr', function(){
	$('.errormessage').html('');
	clicked_row_id=$(this)["0"].cells[3].childNodes[1].value;
	clicked_owner_id=$(this)["0"].cells[1].childNodes[1].value;
	owner=$(this)["0"].childNodes[1].innerText; 
	action_item=$(this)["0"].childNodes[2].innerText;
	summary=$(this)["0"].childNodes[0].innerText;
	$('#action_item').val(summary);
	$('#action_item_status').val(action_item).trigger("change");
	$('#owner_id').append($('<option>', {
		value : clicked_owner_id,
		text : owner
		}));
	$('#owner_id').val(clicked_owner_id).trigger("change");
	if(clicked_row_id=='')
	{   
		$('#corrective_action_table').dataTable().fnDeleteRow($(this));
	}
});

function remove_action_item(action_id){   
	$.ajax({
		type:'post',
		url: "/incident/corrective_action_item_remove/",
		data: {'action_id':action_id,'record_id':kanban_clicked_id,csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()},
		success: function (json_data){
			if(json_data.status=='NTE_04'){ alert_lobibox("success", sysparam_datas_list[json_data.status]); corrective_action_view(); clicked_row_id='';  }
			else if(json_data.status=='NTE_02'){ alert_lobibox("error", sysparam_datas_list[json_data.status]); }
			else if(json_data.status=='NTE_01'){ alert_lobibox("error",'Session is expired'); }
			else { alert_lobibox("error", sysparam_datas_list["ERR0034"]); }
		},
	})
}
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
						$('#notes_id').val(json_data['injury_details_data'][i]['injury_notes']);
						$.each(JSON.parse(json_data['injury_details_data'][i]['treatment']), function( j, val ){
							$('input:checkbox[name=treatment]').each(function(){
								if($(this)["0"].value==val)
								{
									$(this).prop("checked",true)
								}
							})
						})
						$("#injury_details_update").show(); $("#injury_details_add").hide();
					}
				}
				else{ $("#injury_details_update").hide(); $("#injury_details_add").show(); }
					
			}
			else{ $("#injury_details_update").hide(); $("#injury_details_add").show(); }
		}
	})
}
	function remove_file(event,id,el){
		remove_file_id.push(id)
		event.stopPropagation();
		$(el).parent().remove()
	}
	function invest_remove_file(event,id,el){
		invest_remove_file_id.push(id)
		event.stopPropagation();
		$(el).parent().remove()
	}
	function investigation_save(record_id){              //investigation save
		var team_id=$('#team_id').val();
		var form_table = $('#investigation_details_table').DataTable();
		var datas=investigation_getImageData();
		var question_status; var answer_status; var table_list=[]; var table_dict={};
		question_status=''
		answer_status=''
		var invest_table=$('#investigation_details_table').DataTable();
		$('#investigation_details_table tbody tr').each(function(row, tr){
			if($(tr).find('td:eq(0) input').val()=='')
			{
				question_status="empty"
			}
			if($(tr).find('td:eq(1) input').val()=='')
			{
				answer_status="empty"
			}
			table_list[row]={
					"question":$(tr).find('td:eq(0) input').val(),
					"answer":$(tr).find('td:eq(1) input').val()
			}
		});
		table_dict["table_data"] = table_list;
		if ( ! invest_table.data().count() ) {
			alert_lobibox("info", sysparam_datas_list["ERR0033"]);
		}
		else if(question_status!="empty" &&  answer_status!="empty" && team_id!=null) 
		{  
			var load_data={'remove_file':JSON.stringify(invest_remove_file_id),"file":JSON.stringify(datas),"id":record_id,"employee_id":JSON.stringify(team_id),'table_dict':JSON.stringify(table_dict),csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()}
			//    	AJAX function call
			ajax_data('post',"/incident/investigation_save/",load_data)
		}
		else{ Lobibox.notify.closeAll(); alert_lobibox("info",sysparam_datas_list["ERR0033"]) }
	}
//                   functions for data reomve
	function details_remove_confirmation(record_id){   
		var load_data={ 'record_remove_id':record_id,csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()}
		ajax_data('Post',"/incident/details_remove/",load_data)
	}
	function investigation_remove_confirmation(id){
		var load_data={ 'record_remove_id':id,csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()}
		ajax_data('Post',"/incident/invest_details_remove/",load_data);
		investigation_reset();
	}
	function corrective_action_remove_confirmation(id){
		var load_data={ 'record_remove_id':id,csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()}
		ajax_data('Post',"/incident/corrective_action_remove/",load_data);
	}
	function solution_proposal_remove_confirmation(id)
	{
		var load_data={ 'record_remove_id':id,csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()}
		ajax_data('Post',"/incident/solution_proposal_remove/",load_data);
		solution_proposal_reset(); aolution_proposal_button(1);
	}
//	Function for deleting selected row
	$('#investigation_details_table').on( 'click', '.rating_row_delete', function () {
		qa_id=$(this).parents('tr').find('td:eq(2) input[type=hidden]').val();
		data_row = $(this).parents('tr')[0];
		$('#investigation_details_table').dataTable().fnDeleteRow(data_row);
	} );
//	button hide show function
	function investigation_button(flag){   //  investigation button 
		$("#investigation_button_div").html('');
		if (flag==1)
		{   
			var btnstr= '<button type="button" class="btn btn-success animate_btn margin-right-3" id="incident_details_update" onclick="investigation_save('+kanban_clicked_id+')"";><i class="fa fa-green"></i>Save</button>';	}
		else
		{  
			var btnstr= '<button type="button" class="btn btn-success animate_btn margin-right-3" id="incident_details_update" onclick="investigation_save('+kanban_clicked_id+')"";><i class="fa fa-green"></i>Save</button>';	
			btnstr+='<button type="button" class="btn btn-danger animate_btn margin-right-3"  onclick="investigation_remove_confirmation('+kanban_clicked_id+');">Remove</button>';
		}
		btnstr += '<button type="button" class="btn btn-warning animate_btn margin-right-3"  onclick="investigation_reset();">Cancel / Clear</button>';
		$("#investigation_button_div").append(btnstr);	
	}
	function create_button() {  //Details recording button create
		$("#update_details_recording_button_div").html('')
		var btnstr= '<button type="button" class="btn btn-primary btn-eql-wid btn-animate margin-right-3" id="incident_details_update" onclick="acc_details_update('+kanban_clicked_id+')"";><i class="fa fa-green"></i> Update</button>';
		btnstr += '<button type="button" class="btn btn-danger animate_btn margin-right-3"  onclick="details_remove_confirmation('+kanban_clicked_id+');">Remove</button>';
		btnstr += '<button type="button" class="btn btn-warning animate_btn margin-right-3"  onclick="details_form_reset();">Cancel / Clear</button>';
		$("#update_details_recording_button_div").append(btnstr);
	}
	function corrective_action_button(flag){   //corrective action button 
		$("#corrective_action_button_div").html('');
		if (flag==1)
		{   
			var btnstr= '<button type="button" class="btn btn-success animate_btn margin-right-3"  onclick="corrective_action_save('+kanban_clicked_id+')"";><i class="fa fa-green"></i>Save</button>';	}
		else
		{  
			var btnstr= '<button type="button" class="btn btn-success animate_btn margin-right-3"  onclick="corrective_action_save('+kanban_clicked_id+')"";><i class="fa fa-green"></i>Save</button>';	
			btnstr+='<button type="button" class="btn btn-danger animate_btn margin-right-3"  onclick="corrective_action_remove_confirmation('+kanban_clicked_id+');">Remove</button>';
		}
		btnstr += '<button type="button" class="btn btn-warning animate_btn margin-right-3"  onclick="corrective_action_reset();">Cancel / Clear</button>';
		$("#corrective_action_button_div").append(btnstr);	
	}
	function aolution_proposal_button(flag){   //solution proposal button 
		$("#solution_proposal_btn_div").html('');
		if (flag==1)
		{   
			var btnstr= '<button type="button" class="btn btn-success animate_btn margin-right-3"  onclick="solution_proposal_save('+kanban_clicked_id+')"";><i class="fa fa-green"></i>Save</button>';	}
		else
		{  
			var btnstr= '<button type="button" class="btn btn-success animate_btn margin-right-3"  onclick="solution_proposal_save('+kanban_clicked_id+')"";><i class="fa fa-green"></i>Save</button>';	
			btnstr+='<button type="button" class="btn btn-danger animate_btn margin-right-3"  onclick="solution_proposal_remove_confirmation('+kanban_clicked_id+');">Remove</button>';
		}
		btnstr += '<button type="button" class="btn btn-warning animate_btn margin-right-3"  onclick="solution_proposal_reset();">Cancel / Clear</button>';
		$("#solution_proposal_btn_div").append(btnstr);	
	}
