$(document).ready(function ()
		{
	  $('#weightage_cal').hide();  
	  $('#assessment_objective_button').hide();
	assessment_form_view();  assessment_form_cancel(); 
	multiselect_placeholer();     //Function for update the placeholder in Multiselect
		});
//global variable declaration
var hidden_employee_role;var hidden_employee_template;var hidden_employee_assessment_category;
var update_hidden_employee_role;var update_hidden_employee_assessment_category;var update_hidden_employee_template;
var clicked_row_id='';var onchange_id='';var update_id=''; var hidden_role=''
//	global variable declaration

	$('#employee_id').change(function(){
		if (clicked_row_id=='')
		{       
			var employee_id=$('#employee_id  option:selected').val()
			if(employee_id!='0')
			{   
				$('#assessment_objective_button').show()
				$.ajax(
						{
							type:"POST",
							url: "/assessment/form_data_fetch/",
							async : false,
							data:{"employee_id":employee_id,
								csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()},
								success: function (json_data) 
								{   
									$('#assessment_total_weightage').html('')
									$('#employee_assessment_category').html('')
									if(json_data.template_data) 
									{   
										var template_len=json_data.template_data.length;
										if(template_len>0)
										{
											hidden_employee_role=json_data.template_data[0].role_id;
											hidden_role=json_data.template_data[0].role_id;
											$('#assessment_employee_role').val(json_data.template_data[0].employee_role)
											if(json_data.category_data)
											{   
												var category_len=json_data.category_data.length;
												var category_list=[]
												if(category_len>0)
												{   
													$('#employee_assessment_category').append($('<option>', {
														value :'0',
														text :'-Select-'
													}));
													for(var i=0;i<category_len;i++){
														$('#employee_assessment_category').append($('<option>', {
															value : json_data.category_data[i].assessment_category_refitem_id,
															text : json_data.category_data[i].ref_name
														}));
														category_list.push(json_data.category_data[i].assessment_category_refitem_id)
													}
												}
											}
										}
										else{ alert_lobibox("info",sysparam_datas_list["NTE_38"]);assessment_form_cancel();}
									} 

								},
						})	
			}
			else
			{
				$('#assessment_objective_button').hide()
			}
		}
		if (onchange_id=='0')
		{   
			var employee_id=$('#employee_id  option:selected').val()
			if(employee_id!='0')
			{   
				$('#assessment_objective_button').show()
				$.ajax(
						{
							type:"POST",
							url: "/assessment/form_data_fetch/",
							async : false,
							data:{"employee_id":employee_id,
								csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()},
								success: function (json_data) 
								{   
									$('#assessment_total_weightage').html('')
									if(json_data.template_data) 
									{   
										var template_len=json_data.template_data.length;
										if(template_len>0)
										{
											hidden_employee_role=json_data.template_data[0].role_id;
											hidden_role=json_data.template_data[0].role_id;
											$('#assessment_employee_role').val(json_data.template_data[0].employee_role)
											if(json_data.category_data)
											{   
												var category_len=json_data.category_data.length;
												var category_list=[]
												if(category_len>0)
												{   
													$('#employee_assessment_category').html('')
													$('#employee_assessment_category').append($('<option>', {
														value :'0',
														text :'-Select-'
													}));
													for(var i=0;i<category_len;i++){
														$('#employee_assessment_category').append($('<option>', {
															value : json_data.category_data[i].assessment_category_refitem_id,
															text : json_data.category_data[i].ref_name
														}));
														category_list.push(json_data.category_data[i].assessment_category_refitem_id)
													}
												}
											}
										}
										else{ alert_lobibox("info",sysparam_datas_list["NTE_38"]);  assessment_form_cancel();}
									} 
								},
						})	
			}
			else
			{
				$('#assessment_objective_button').hide()
			}
		}
	});

$('#employee_assessment_category').change(function(){
	if (clicked_row_id=='')
	{       
		var selected_category=$('#employee_assessment_category  option:selected').val()
		if(selected_category!='0'  && selected_category!=undefined)
		{   
			$('#assessment_objective_button').show()
			$.ajax(
					{
						type:"POST",
						url: "/assessment/form_template_fetch/",
						async : false,
						data:{"selected_category":selected_category,"role_id":hidden_employee_role,
							csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()},
							success: function (json_data) 
							{   
								$('#assessment_total_weightage').html('')
								if(json_data.kpi_data)
								{
									$('#employee_template').val(json_data.template_name[0].template_name)
									hidden_employee_template=json_data.template_name[0].template_id
									hidden_employee_assessment_category=selected_category;
									$('#form_kpi_view').show()
									data_list = [];
									var columns = [{"title":"KPI Summary"}, {"title":"Expected"},{"title":"Units"}, {"title":"Measurement Criteria"},{"title":"Orgin KPI"},{"title":"Weightage"}]
									var table_data=json_data.kpi_data
									var kpi_len=json_data.kpi_data.length;
									if(kpi_len>0)
									{   
										$('#weightage_cal').show()
										for(var i=0;i<kpi_len;i++)
										{   
											$('#weightage_cal').show()
											for(var i=0;i<kpi_len;i++)
											{   
												if(table_data[i].target==null || table_data[i].target==' ')
												{
													target_value='No Data'
												}
												else
												{
													target_value=table_data[i].target
												}
												hidden_id="<input type='hidden' class='form-control input-small'  value='" +table_data[i].id+" '/>";
												cell_datas ="<input type='text' id='"+i+1+" 'class='form-control' placeholder='Weightage' value='' onkeyup=total_weightage()>";
												expected_datas ="<input type='text' onkeypress='return IsNumeric(event);' ondrop='return false;' onpaste='return false;' id='"+i+1+" 'class='form-control' placeholder='Expected' value='" +table_data[i].expected+"'>";
												data_list.push([table_data[i].kpi_description, expected_datas,target_value,
												                table_data[i].measurement,table_data[i].type+hidden_id,cell_datas]);
											}
											plaindatatable1('assessment_form_kpi_table', data_list, columns)
										}}
									else{ plaindatatable1('assessment_form_kpi_table', data_list, columns) }
								}
								else { plaindatatable1('assessment_form_kpi_table', data_list, columns); }
							},
					})	
		}
		else
		{
			$('#assessment_objective_button').hide()
		}
	}
	if (onchange_id=='0')
	{       
		var selected_category=$('#employee_assessment_category  option:selected').val()
		if(selected_category!='0' && selected_category!=undefined)
		{     
			$('#assessment_objective_button').show()
			$.ajax(
					{
						type:"POST",
						url: "/assessment/form_template_fetch/",
						async : false,
						data:{"selected_category":selected_category,'clicked_row_id':clicked_row_id,
							csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()},
							success: function (json_data) 
							{  
								$('#assessment_total_weightage').html('')
								var columns = [{"title":"KPI Summary"}, {"title":"Expected"},{"title":"Units"}, {"title":"Measurement Criteria"},{"title":"Orgin KPI"},{"title":"Weightage"}]
								if(json_data.kpi_data)
								{    
									$('#employee_template').val(json_data.template_name[0].template_name)
									hidden_employee_template=json_data.template_name[0].template_id
									hidden_employee_assessment_category=selected_category;
									$('#form_kpi_view').show()
									data_list = [];
									var kpi_len=json_data.kpi_data.length;
									var table_data=json_data.kpi_data
									if(kpi_len>0)
									{   
										$('#weightage_cal').show()
										for(var i=0;i<kpi_len;i++)
										{   
											if(table_data[i].target==null || table_data[i].target==' ')
											{
												target_value='No Data'
											}
											else
											{
												target_value=table_data[i].target
											}
											hidden_id="<input type='hidden' class='form-control input-small'  value='" +table_data[i].id+" '/>";
											cell_datas ="<input type='text' id='"+i+1+" 'class='form-control' placeholder='Weightage' value='' onkeyup=total_weightage()>";
											expected_datas ="<input type='text' onkeypress='return IsNumeric(event);' ondrop='return false;' onpaste='return false;' id='"+i+1+" 'class='form-control' placeholder='Expected' value='" +table_data[i].expected+"'>";
											data_list.push([table_data[i].kpi_description, expected_datas,target_value,
											                table_data[i].measurement,table_data[i].type+hidden_id,cell_datas]);
										}
										plaindatatable1('assessment_form_kpi_table', data_list, columns)
									}
									else{ plaindatatable1('assessment_form_kpi_table', data_list, columns) }
								}
								else if(json_data.status=='NTE_01')
								{
									var kpi_data=json_data.cascade_kpi
									var role_data=json_data.role_kpi
									$('#employee_template').val(json_data.template_name[0].template_name)
									hidden_employee_template=json_data.template_name[0].template_id
									hidden_employee_assessment_category=selected_category;
									$('#assessment_total_weightage').val('')
									assessment_form_kpi(kpi_data,role_data);
								}
								else if(json_data.status=='NTE_02')
								{    
									var datas_list=[]
									$('#employee_template').val(json_data.template_name_list[0].template_name)
									hidden_employee_template=json_data.template_name_list[0].template_id
									hidden_employee_assessment_category=selected_category;
									$('#assessment_total_weightage').val('')
									if(json_data.kpi_data_list)
									{  
										var kpi_data_len=json_data.kpi_data_list.length;
										var table_data=json_data.kpi_data_list 
										if(kpi_data_len>0)
										{   
											$('#weightage_cal').show()
											for(var i=0;i<kpi_data_len;i++)
											{   
												if(table_data[i].target==null || table_data[i].target==' ')
												{
													target_value='No Data'
												}
												else
												{
													target_value=table_data[i].target
												}
												hidden_id="<input type='hidden' class='form-control input-small'  value='" +table_data[i].id+" '/>";
												cell_datas ="<input type='text' id='"+i+1+" 'class='form-control' placeholder='Weightage' value='' onkeyup=total_weightage()>";
												expected_datas ="<input type='text' onkeypress='return IsNumeric(event);' ondrop='return false;' onpaste='return false;' id='"+i+1+" 'class='form-control' placeholder='Expected' value='" +table_data[i].expected+"'>";
												datas_list.push([table_data[i].kpi_description, expected_datas,target_value,
												                 table_data[i].measurement,table_data[i].type+hidden_id,cell_datas]);
											}
											plaindatatable1('assessment_form_kpi_table', datas_list, columns)
										}
										else{ plaindatatable1('assessment_form_kpi_table', datas_list, columns);  $('#assessment_total_weightage').val(''); }
									}
								}
								else
								{
									plaindatatable1('assessment_form_kpi_table', data_list, columns);
									$('#assessment_total_weightage').val('');
								}

							},
					})	
		}
		else
		{
			$('#assessment_objective_button').hide()
		}
	}
});
function assessment_form_submit()
{   
//	function for fetch the selected rows in table
	var template_kpi = []
	var template_kpi_dict = {}
	var measurement; 
	var measurement_data;
	var expected_value_status;
	var weightage_value_status;
	expected_value_status=''
	weightage_value_status=''
	var form_table = $('#assessment_form_kpi_table').DataTable();
	$('#assessment_form_kpi_table tbody tr').each(function(row, tr){
		measurement=$(tr).find('td:eq(3)').text()
		if(measurement){
			measurement_data=measurement
		}
		else{
			measurement_data=$(tr).find('td:eq(3) input').val()
		}
		if($(tr).find('td:eq(1) input').val()=='')
		{
			expected_value_status="empty"
		}
		if($(tr).find('td:eq(5) input').val()=='')
		{
			weightage_value_status="empty"
		}
		template_kpi[row]={
				"weightage":$(tr).find('td:eq(5) input').val(),
				"orgin":$(tr).find('td:eq(4)').text(),
				"measurement":measurement_data,
				"id":$(tr).find('td:eq(4) input[type=hidden]').val(),
				"expected":$(tr).find('td:eq(1) input').val()
		}
	});
	//remove the empty values from array end
	template_kpi_dict["kpi_data"] = template_kpi;
	var employee_id=$('#employee_id  option:selected').val()
	var employee_role=$('#assessment_employee_role').val();
	var employee_template = $('#employee_template').val();
	var employee_assessment_category=$('#employee_assessment_category:selected').val()
	var status = assessment_form_validation();
	if(status){
		if(employee_id!='' && employee_role!='' && employee_template!='' && employee_assessment_category!='') 
		{   
			if ( ! form_table.data().count() ) {
				alert_lobibox("info", sysparam_datas_list["ERR0033"]);
			}
			else if($('#assessment_total_weightage').val()>100 || $('#assessment_total_weightage').val()<100)
			{
				alert_lobibox("info", sysparam_datas_list["NTE_75"]);
			}
			else if(expected_value_status!="empty" &&  weightage_value_status!="empty") 
			{  
				var load_data={"employee_id":employee_id,"employee_role":hidden_employee_role,'employee_template':hidden_employee_template,
						'employee_assessment_category':hidden_employee_assessment_category,'kpi':JSON.stringify(template_kpi_dict),csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()}

				//    	AJAX function call
				send_data('post',"/assessment/form_save/",load_data)
			}
			else{ alert_lobibox("info",sysparam_datas_list["NTE_39"]); }
		}
		else{ Lobibox.notify.closeAll();
		alert_lobibox("info",sysparam_datas_list["ERR0033"]) }
	}
}
var columns = [{"title":"No."},{"title":"Employee Name"}, {"title":"Role"}, {"title":"Template Name"},{"title":"Assessment Category"},{"title":"hidden Id","visible": false}]
function assessment_form_view()
{   
	$.ajax(
			{
				type:"GET",
				url: "/assessment/form_view/",
				data:{ csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val() },
				success: function (json_data) 
				{   
					var data_value=json_data.assessment_form_data
					data_list = [];
					for (var i=0; i<data_value.length; i++){
						data_list.push([i+1,data_value[i].employee_name +" "+data_value[i].last_name, data_value[i].employee_role,
						                data_value[i].template_name,data_value[i].category_name,data_value[i].form_id]);
					}
					plaindatatable_btn('assessment_form_view', data_list, columns,[])
				},
			})	
}
//row clcik in datatable
$('#assessment_form_view').on('click', 'tbody tr', function(){
	$('.errormessage').html('');
	var arr=$('#assessment_form_view').dataTable().fnGetData($(this)); 
	clicked_row_id=arr[5];
	assessment_form_id_load(clicked_row_id);
	$.ajax(
			{
				type:"POST",
				url: "/assessment/form_fetch/",
				data:{"selected_id":clicked_row_id,
					csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()},
					success: function (json_data) 
					{   
						form_button_show('update');
						var data_value=json_data.selected_row_data
						var kpi_data=json_data.cascade_kpi
						var role_data=json_data.role_kpi
						hidden_employee_role=data_value[0].role_id;
						hidden_employee_template=data_value[0].template_id;
						$('#employee_template').val(data_value[0].template_name)
						$('#assessment_employee_role').val(data_value[0].employee_role)
						$('#employee_id').val(data_value[0].employee_id).trigger("change")
						$('#assessment_total_weightage').val('')
						if(json_data.category_data)
						{   
							var category_len=json_data.category_data.length;
							var category_list=[]
							if(category_len>0)
							{   
								$('#employee_assessment_category').html('')
								for(var i=0;i<category_len;i++){
									$('#employee_assessment_category').append($('<option>', {
										value : json_data.category_data[i].assessment_category_refitem_id,
										text : json_data.category_data[i].ref_name
									}));
									category_list.push(json_data.category_data[i].assessment_category_refitem_id)
								}
								$('#employee_assessment_category').val(data_value[0].category_id)
							}
						}
						assessment_form_kpi(kpi_data,role_data);
						onchange_id='0'
					},
			})	
});
//table view function
function assessment_form_kpi(kpi_data,role_data)
{  
	$('#form_kpi_view').show();
	$('#weightage_cal').show();
	var columns = [{"title":"KPI Summary"}, {"title":"Expected"},{"title":"Target Type"}, {"title":"Measurement Criteria"},{"title":"Orgin KPI"},{"title":"Weightage"}]
	var data=kpi_data;
	var role_kpi=role_data
	var role_len=role_kpi.length;
	var len=data.length;
	var data_list = [];
	var total_cascaded_weightage=0
	var total_role_weightage=0
	$('#assessment_total_weightage').val('')
	$('#assessment_objective_button').show();
	plaindatatable1('assessment_form_kpi_table', data_list, columns)
	if(len>0)
	{  
		for(var i=0;i<len;i++)
		{   
			if(data[i].target_type==null || data[i].target_type==' ')
			{
				target_value=''
			}
			else
			{
				target_value=data[i].target_type
			}
			hidden_id="<input type='hidden' class='form-control input-small'  value='" +data[i].form_kpi_id+" '/>";
			cell_datas ="<input type='text' id='"+i+1+" 'class='form-control' placeholder='Weightage' value='"+data[i].weightage+"' onkeyup=total_weightage()>";
			expected_datas ="<input type='text'  onkeypress='return IsNumeric(event);' ondrop='return false;' onpaste='return false;' id='"+i+1+" 'class='form-control' placeholder='Expected' value='"+data[i].expected+"'>";
			data_list.push([data[i].kpi_description, expected_datas,target_value,
			                data[i].measurement,data[i].type+hidden_id,cell_datas]);
			total_cascaded_weightage += data[i].weightage
		}
		plaindatatable1('assessment_form_kpi_table', data_list, columns)
	}
	if(role_len>0)
	{   
		var t = $('#assessment_form_kpi_table').DataTable();
		for(var i=0;i<role_len;i++)
		{    
			if(role_kpi[i].target_type==null || role_kpi[i].target_type==' ')
			{
				target_value=''
			}
			else
			{
				target_value=role_kpi[i].target_type
			}
			hidden_id="<input type='hidden' class='form-control input-small'  value='" +role_kpi[i].form_kpi_id+" '/>";
			t.row.add( [
			            role_kpi[i].kpi_definition,
			            "<input type='text' onkeypress='return IsNumeric(event);' ondrop='return false;' onpaste='return false;'  id='"+i+1+" 'class='form-control' placeholder='Expected' value='"+role_kpi[i].expected+"'>",
			            target_value,
			            role_kpi[i].measurement,
			            role_kpi[i].type+hidden_id,
			            "<input type='text' id='"+i+1+" 'class='form-control' placeholder='Weightage' value='"+role_kpi[i].weightage+"' onkeyup=total_weightage()>",
			            ] ).draw( false );
			total_role_weightage += role_kpi[i].weightage
		}
	}     
	else
	{
		plaindatatable1('assessment_form_kpi_table', data_list, columns)
	}
	total_kpi_weightage=total_cascaded_weightage+total_role_weightage
	if(total_kpi_weightage>100)
	{$("#assessment_total_weightage").val(total_kpi_weightage)
		alert_lobibox("info", sysparam_datas_list["NTE_75"]);
	}
	else
	{
		$("#assessment_total_weightage").val(total_kpi_weightage)}
}
//function for remove

function assessment_remove_confirmation()
{
	removeConfirmation('assessment_form_remove',clicked_row_id,$('#employee_id option:selected').text());
}
function assessment_form_remove()
{   

	var remove_form_table = $('#assessment_form_kpi_table').DataTable();
	var remove_id=clicked_row_id;
	var load_data={"remove_id":remove_id,csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()}
	if ( ! remove_form_table.data().count() ) {
		alert_lobibox("info", sysparam_datas_list["ERR0033"]);
	}
	else{
//		AJAX function call
		send_data('post',"/assessment/form_delete/",load_data)
	}
}
//function for update
function assessment_form_update()
{
	update_id=clicked_row_id;
	var template_kpi = []
	var template_kpi_dict = {}
	var measurement; 
	var measurement_data;
	var expected_value_status;
	var weightage_value_status;
	expected_value_status=''
		weightage_value_status=''
			var kpi_table = $('#assessment_form_kpi_table').DataTable();
	$('#assessment_form_kpi_table tbody tr').each(function(row, tr){
		if($(tr).find('td:eq(1) input').val()=='')
		{
			expected_value_status="empty"
		}
		if($(tr).find('td:eq(5) input').val()=='')
		{
			weightage_value_status="empty"
		}
		measurement=$(tr).find('td:eq(3)').text()
		if(measurement){
			measurement_data=measurement
		}
		else{
			measurement_data=$(tr).find('td:eq(3) input').val()
		}
		template_kpi[row]={
				"weightage":$(tr).find('td:eq(5) input').val(),
				"orgin":$(tr).find('td:eq(4)').text(),
				"measurement":measurement_data,
				"id":$(tr).find('td:eq(4) input[type=hidden]').val(),
				"expected":$(tr).find('td:eq(1) input').val()
		}
	});
	//remove the empty values from array end
	template_kpi_dict["kpi_data"] = template_kpi;
	var employee_id=$('#employee_id  option:selected').val()
	var employee_role=$('#assessment_employee_role').val();
	var employee_template = $('#employee_template').val();
	var employee_assessment_category=$('#employee_assessment_category').val()
	var status = assessment_form_validation();
	if(status){
		if(employee_id!='' && employee_role!='' && employee_template!='' && employee_assessment_category!='') 
		{   
			if ( ! kpi_table.data().count() ) {

				alert_lobibox("info",sysparam_datas_list["ERR0033"]);
			}
			else if($('#assessment_total_weightage').val()>100 || $('#assessment_total_weightage').val()<100 )
			{
				alert_lobibox("info", sysparam_datas_list["NTE_75"]);

			}
			else if (expected_value_status!="empty" &&  weightage_value_status!="empty") 
			{  
				var load_data={"employee_id":employee_id,'employee_template':hidden_employee_template,
						'employee_assessment_category':employee_assessment_category,'kpi':JSON.stringify(template_kpi_dict),'update_id':update_id,csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()}

				//    	AJAX function call
				send_data('post',"/assessment/form_update/",load_data)
			}
			else
			{
				alert_lobibox("info", sysparam_datas_list["NTE_39"]);
			}
		}
		else
		{
			alert_lobibox("info", sysparam_datas_list["ERR0033"])
		}
	}
}

function assessment_form_cancel()
{
	$('#form_kpi_view').hide();$('#weightage_cal').hide(); $('#assessment_employee_role').val('');$('#employee_template').val('');

	$('#employee_id').val(0).trigger("change"); 
	assessment_form_id_load('clear');
	$('.errormessage').html(''); $("#assessment_total_weightage").val('');
	form_button_show('add')
	clicked_row_id=''
		hidden_role='';
	update_hidden_employee_role='';
	hidden_employee_role='';
	$('#employee_assessment_category').append($('<option>', {
		value :0,
		text :'-Select-'
	}));
	$('#employee_assessment_category').val(0).trigger("change");
}

function objective_kpi(data)
{ 
	if(data)
	{
		$.ajax(
				{
					type:"POST",
					data:{"kpi":JSON.stringify(data), csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()},
					url: "/assessment/objective_kpi/",
					success: function (json_data) 
					{   
						var kpi_data=json_data.kpi_data
						var len=kpi_data.length;
						if(len>0)
						{
							var t = $('#assessment_form_kpi_table').DataTable();
							for(var i=0;i<len;i++)
							{  
								if(kpi_data[i].target==null || kpi_data[i].target==' ')
								{
									target_type=''
								}
								else
								{
									target_type=kpi_data[i].target
								}
								hidden_id="<input type='hidden' class='form-control input-small'  value='"+kpi_data[i].id+"'/>";
								t.row.add( [
								            kpi_data[i].kpi_description,
								            "<input type='text' onkeypress='return IsNumeric(event);' ondrop='return false;' onpaste='return false;' id='"+i+1+" 'class='form-control' placeholder='Expected' value='"+kpi_data[i].kpi_target_value+"'>",
								            target_type,
								            "<input type='text' id='"+i+1+" 'class='form-control' placeholder='Measurement' value=''>",
								            'Cascaded'+hidden_id,
								            "<input type='text' id='"+i+1+" 'class='form-control' placeholder='Weightage' value='' onkeyup=total_weightage()>",
								            ] ).draw( false );
							}
						}     
					},
				})	
	}
}
//popup page for talent assessment objective
var selected_role_id; var selected_role_name;
function assessment_objective()
{       
	var selected_employee_id=$('#employee_id  option:selected').val()
	if(selected_employee_id>0)
	{
		$('#objective_setting_popup').modal('show');
	}
	else
	{
		alert_lobibox("info", "Select Employee to add KPI.")
	}
}
//search and select 
$("#attendance_popup_table").on("click", "tr", function() { 
	if($(".form_reviewer_tab li.active").attr('id')=="assessment_form_tab")
	{   
		if (!this.rowIndex) return; // skip first row
		id = $('#attendance_popup_table').dataTable().fnGetData(this)[0];
		name = $('#attendance_popup_table').dataTable().fnGetData(this)[3];
		var resource_id=id;
		if(resource_id>0)
		{
			$('#employee_id').val(resource_id).trigger("change")
//			$('#employee_id').val(resource_id)
		}
		else
		{
			$('#employee_id').val(0).trigger("change")
		}
	}
});
function form_button_show(flag)
{   
	$("#assessment_form_button").empty();
	if (flag=='add')
	{ 
		var btnstr = '<button type="button" class="btn btn-success btn-eql-wid btn-animate margin-right-3" id="assessment_form_save" onclick="assessment_form_submit();">Add</button>';
	}
	else
	{  

		var btnstr= '<button type="button" class="btn btn-primary btn-eql-wid btn-animate margin-right-3" id="assessment_form_updates" onclick="assessment_form_update()"";><i class="fa fa-green"></i> Update</button>';
		btnstr += '<button type="button" class="btn btn-danger btn-eql-wid btn-animate margin-right-3" id="assessment_form_delete" onclick="assessment_remove_confirmation();">Remove</button>';
	}
	btnstr += '<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-3" id="assessment_form_clear" onclick="assessment_form_cancel();">Cancel / Clear</button>';
	$("#assessment_form_button").append(btnstr);	
}

//function form_button_show(action_name){
//$("#assessment_form_button").html('');
//var btnstr = '';
//var access_for_create = jQuery.inArray( "assessment form", JSON.parse(localStorage.Create) );
//var access_for_write = jQuery.inArray( "assessment form", JSON.parse(localStorage.Write) );
//var access_for_delete = jQuery.inArray( "assessment form", JSON.parse(localStorage.Delete) );
//if (action_name == 'add') {
//  if (access_for_create != -1){
//      btnstr += '<button type="button" class="btn btn-success btn-eql-wid btn-animate margin-right-3" id="assessment_form_save" onclick="assessment_form_submit();">Add</button>';
//  }
//  btnstr +=  '<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-3" id="assessment_form_clear" onclick="assessment_form_cancel();">Cancel / Clear</button>';
//} else if (action_name == 'update') {
//  if (access_for_write != -1){
//      btnstr += '<button type="button" class="btn btn-primary btn-eql-wid btn-animate margin-right-3" id="assessment_form_updates" onclick="assessment_form_update()"";><i class="fa fa-green"></i> Update</button>';
//  }
//  if (access_for_delete != -1){
//      btnstr +='<button type="button" class="btn btn-danger btn-eql-wid btn-animate margin-right-3" id="assessment_form_delete" onclick="assessment_remove_confirmation();">Remove</button>';
//  }
//  btnstr +=  '<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-3" id="assessment_form_clear" onclick="assessment_form_cancel();">Cancel / Clear</button>';
//}
//$("#assessment_form_button").append(btnstr);
//}
function multiselect_placeholer()
{
	$("#organization_unit_select").attr("data-placeholder","Assigned To");
	$("#organization_unit_select").select2();	

	$("#assessment_objective_role").attr("data-placeholder","Role");
	$("#assessment_objective_role").select2();
}


//$('#assessment_form_kpi_table').DataTable( {
//    responsive: false
//} );
