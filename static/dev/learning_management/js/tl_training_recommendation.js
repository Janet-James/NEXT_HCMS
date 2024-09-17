global_recommendation_id=''

	$('document').ready(function(){
		assessment_training_list();
		tl_button_display('add','')
		training_recommendation_detail_view();
	});

$('#tl_organization').change(function(){
	var str_org_id=$('#tl_organization  option:selected').val()
	if(str_org_id!='0' && str_org_id!='')
	{
		$.ajax({
			type:'GET',
			url: '/shift/org_unit_fetch/',
			async : false,
			data  : { 'str_org_id':str_org_id},
			success: function (json_data){
				var data=json_data
				$('#tl_organization_unit').html('')
				$('#tl_organization_unit').append($('<option>', {
					value :'0',
					text :'--Select--'
				}));
				if(data)
				{
					var data_len=data.org_unit.length;
					if(data_len>=1)
					{  
						for(var i=0;i<data_len;i++)
						{   
							$('#tl_organization_unit').append($('<option>', {
								value : data.org_unit[i].id,
								text : data.org_unit[i].orgunit_name,
							}));
						}
					}
					else{ $('#tl_organization_unit').val('0').trigger("change"); }
				}
				else{ $('#tl_organization_unit').val('0').trigger("change"); }
			},
		})	
	}
	else {
		$('#tl_organization_unit').html('')
		$('#tl_organization_unit').append($('<option>', {
			value :'0',
			text :'--Select--'
		}));
		$('#tl_organization_unit').val('0').trigger("change"); }
});

$('#tl_organization_unit').change(function(){
	var org_unit_id=$('#tl_organization_unit  option:selected').val()
	if(org_unit_id!='0' && org_unit_id!='')
	{
		$.ajax({
			type:'GET',
			url: '/ld_division_data_fetch/',
			async : false,
			data  : { 'org_unit_id':org_unit_id},
			success: function (json_data){
				var data=json_data
				$('#ld_organization_division').html('')
				$('#ld_organization_division').append($('<option>', {
					value :'0',
					text :'--Select--'
				}));
				if(data)
				{
					var data_len=data.division_detail.length;
					if(data_len>=1)
					{  
						for(var i=0;i<data.division_detail.length;i++)
						{   
							$('#ld_organization_division').append($('<option>', {
								value : data.division_detail[i].department_id,
								text : data.division_detail[i].department_name,
							}));
						}
					}
					else{ $('#ld_organization_division').val('0').trigger("change"); }
				}
				else{ $('#ld_organization_division').val('0').trigger("change"); }
			},
		})	
	}
	else {
		$('#ld_organization_division').html('')
		$('#ld_organization_division').append($('<option>', {
			value :'0',
			text :'--Select--'
		}));
		$('#ld_organization_division').val('0').trigger("change"); }
});

$('#ld_organization_division').change(function(){
	var division_id=$('#ld_organization_division').val()
	$('#mr_employee').html('')
	$('#mr_recommended_by').html('')
	$('#mr_recommended_by').append($('<option>', {
		value :'0',
		text :'--Select--'
	}));
	if(division_id!='0' && division_id!='')
	{
		$.ajax({
			type:'GET',
			url: '/ld_employee_training_data_fetch/',
			async : false,
			data  : { 'division_id':JSON.stringify(division_id)},
			success: function (json_data){
				var data=json_data
				if(data)
				{
					if(data.employee_detail.length!=0)
					{  
						for(var i=0;i<data.employee_detail.length;i++)
						{   
							$('#mr_employee').append($('<option>', {
								value : data.employee_detail[i].employee_id,
								text : data.employee_detail[i].employee_name,
							}));
							$('#mr_recommended_by').append($('<option>', {
								value : data.employee_detail[i].employee_id,
								text : data.employee_detail[i].employee_name,
							}));
						}
					}
					else{$('#mr_employee').val('').trigger("change");
					$('#mr_recommended_by').val('').trigger("change");}
				}
				else{
					$('#mr_recommended_by').val('0').trigger("change");
					$('#mr_employee').val('').trigger("change");}
			}
		})	
	}
});

function assessment_training_list()
{
	$.ajax({
		type:'GET',
		url: '/ld_assessment_training_retrieval/',
		async : false,
		success: function (json_data){
			data=json_data
			if(data.assessment_training_detail.length!=0)
			{  
				for(var i=0;i<data.assessment_training_detail.length;i++)
				{   
					$('#tl_training_name').append($('<option>', {
						value : data.assessment_training_detail[i].id,
						text : data.assessment_training_detail[i].learning_pointers,
					}));
				}
			}	
		}
	});
}

$('#tl_training_name').change(function(){	
	var training_id=$('#tl_training_name  option:selected').val()
	if(training_id!='0' && training_id!='')
	{
		$.ajax({
			type:'GET',
			url: '/ld_assessment_training_detail_retrieval_id/',
			async : false,
			data  : { 'training_id':training_id},
			success: function (json_data){
				data=json_data.assessment_employee_detail
				division_ids = data[0]['team_name_id'].split(',');
				$('#tl_organization').val(data[0]['org_id_id']).trigger('change')
				$('#tl_organization_unit').val(data[0]['org_unit_id_id']).trigger('change')
				$('#ld_organization_division').val(division_ids).trigger('change')
				$('#mr_employee').val(data[0]['employee_id']).trigger("change")
				$('#mr_recommended_by').val(data[0]['assessor_id']).trigger("change")
				if (json_data.exist == 'true')
				{
					global_recommendation_id=data[0]['recommendation_id']
					$('#tl_training_category').val(data[0]['training_category_id']).trigger('change')
					$('#tl_training_type').val(data[0]['training_type_id']).trigger('change')
					$('#tl_training_methodology').val(data[0]['training_methodology_id']).trigger('change')
					$('#tl_start_date').val(data[0]['start_date'])
					$('#tl_end_date').val(data[0]['end_date'])
					if(data[0]['training_status']==true){
						alert_lobibox("info", "Recommendation is Already Converted As Training");
					}
					tl_button_display('update',data[0]['training_status'])
				}
				else
				{
					tl_button_display('add','')
					global_recommendation_id=''
				}
				$(".date_input_class").trigger('change');
			}
		})	
	}
})

function tl_button_display(flag,status)
{
	$("#tl_view_btn_div").empty();
	if (flag=='add')
	{
		var btnstr = '<button type="button" class="btn btn-success btn-eql-wid btn-animate margin-right-3"  onclick="add_update_tl();">Add</button>';
	}
	else
	{
		if(status!=false)
		{
			var btnstr = '<button type="button" class="btn btn-primary btn-eql-wid btn-animate margin-right-3"  onclick="add_update_tl();">Update</button>';
			btnstr += '<button type="button" class=" btn btn-danger btn-eql-wid btn-animate margin-right-3" onclick="tl_remove_confirmation();">Remove</button>';
		}else
		{
			var btnstr = '<button type="button" class="btn btn-primary btn-eql-wid btn-animate margin-right-3"  onclick="recommendation_training_creation();">Convert As Training</button>';
			btnstr += '<button type="button" class="btn btn-primary btn-eql-wid btn-animate margin-right-3"  onclick="add_update_tl();">Update</button>';
			btnstr += '<button type="button" class=" btn btn-danger btn-eql-wid btn-animate margin-right-3" onclick="tl_remove_confirmation();">Remove</button>';	
		}
	}
	btnstr += '<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-3" onclick="tl_training_recommendation_cancel_confirmation();">Cancel / Clear</button>';
	$("#tl_view_btn_div").append(btnstr);    
}

function add_update_tl()
{
	training_id=$('#tl_training_name').val()
	org_id=$("#tl_organization").val()
	org_unit_id=$("#tl_organization_unit").val()
	division_ids=$("#ld_organization_division").val()
	employee_id=$("#mr_employee").val()
	training_category=$("#tl_training_category").val()
	training_type=$("#tl_training_type").val()
	training_methodology=$("#tl_training_methodology").val()
	recommended_by=$("#mr_recommended_by").val()
	start_date=$('#tl_start_date').val()
	end_date=$('#tl_end_date').val()
	validation_status=teamlead_training_recommendation_form_validation()
	if(validation_status)
	{
		$.ajax({
			type:'GET',
			url: '/tl_recommendation_add_update/',
			async : false,
			data  : {'recommendation_id': global_recommendation_id,'recommendation_type':'T','training_id':training_id,'org_id':org_id,'org_unit_id':org_unit_id,'division_ids':JSON.stringify(division_ids),'employee_id':JSON.stringify(employee_id),'training_category':training_category,'training_type':training_type,'training_methodology':training_methodology,'recommended_by':recommended_by,'start_date':start_date,'end_date':end_date},
			success: function (json_data){
				if(json_data.status == 'NTE_01'){
					alert_lobibox("success", sysparam_datas_list[json_data.status]);
					tl_clear_cancel();
					training_recommendation_detail_view()
				}else if(json_data.status == 'NTE_02'){
					alert_lobibox('error',json_data.message)
					tl_clear_cancel();
					training_recommendation_detail_view()
				}else if(json_data.status == 'NTE_03'){
					alert_lobibox("success", sysparam_datas_list[json_data.status]);
					tl_clear_cancel();
					training_recommendation_detail_view()
				}
			}
		})
	}
	else
	{
		alert_lobibox("info","Fill all required fields")
	}
}

function recommendation_training_creation()
{
	training_id=$('#tl_training_name').val()
	training_name=$('#tl_training_name option:selected').text()
	org_id=$("#tl_organization").val()
	org_unit_id=$("#tl_organization_unit").val()
	division_ids=$("#ld_organization_division").val()
	employee_id=$("#mr_employee").val()
	training_category=$("#tl_training_category").val()
	training_type=$("#tl_training_type").val()
	training_methodology=$("#tl_training_methodology").val()
	recommended_by=$("#mr_recommended_by").val()
	training_start_date=$('#tl_start_date').val()
	training_end_date=$('#tl_end_date').val()
	validation_status=teamlead_training_recommendation_form_validation()
	if(validation_status)
	{
		$.ajax({
			type:'GET',
			url: '/tl_recommendation_training_creation/',
			async : false,
			data  : {'training_id':training_id,'training_name':training_name,'description':'','training_type':training_type,'training_category':training_category,'employee_id':JSON.stringify(employee_id),
				'training_method':training_methodology,'training_start_date':training_start_date,'training_end_date':training_end_date,'division':JSON.stringify(division_ids)},
				success: function (json_data){
					if(json_data.status=='NTE_01'){ 
						alert_lobibox("success", "TL Recommendation is Converted as Training"); 
						tl_clear_cancel();
						training_recommendation_detail_view()
					}
					else if(json_data.status=='NTE_02'){ alert_lobibox("error", sysparam_datas_list[json_data.status]);}
				}
		})}
	else
	{
		alert_lobibox("info","Fill all required fields")
	}
}

function training_recommendation_detail_view()
{
	$.ajax({
		type:'GET',
		url: '/ld_training_recommendation_detail_fetch/',
		data: {'recommendation_type':'T'},
		async : false,
		success: function (json_data){
			var data=json_data
			var verticalViewData = '';
			$('#search_recommendation_training_data').html('');
			$('#search_recommendation_training_data').append($('<option>', {
				value : '0',
				text : 'Search by Training Name',
			}));
			if(data)
			{
				if(data.search_detail.length>0)
				{
					for (j=0;j<data.search_detail.length;j++)
					{
						$('#search_recommendation_training_data').append($('<option>', {
							value : data.search_detail[j].id,
							text : data.search_detail[j].learning_pointers,
						}));
					}
				}
				else
				{$('#search_recommendation_training_data option[value='+0+']').attr('selected','selected');}
				var len=data.recommendation_detail.length;
				if(len>0)
				{
					for(var i=0;i<len;i++)
					{
						verticalViewData += '<div class="col-md-12 EmployeeCard equhight employeeList ta_job_opening search_'+data.recommendation_detail[i].id+'"" id="recommendation_'+data.recommendation_detail[i].id+'" onclick="training_recommendation_details('+data.recommendation_detail[i].id+')">'
						verticalViewData += '<div class="col-md-12">'
							verticalViewData += '<table><tr><td class="tdwidth1">Training Name </td><td class="tdwidth2">:</td><td class="tdwidth3"><b>'+data.recommendation_detail[i].learning_pointers+'</b></td></tr>';
						verticalViewData += '<tr><td class="tdwidth1">Start Date </td><td class="tdwidth2">:</td><td class="tdwidth3"><b> <b>'+data.recommendation_detail[i].start_date+'</b></td></tr>';
						verticalViewData += '<tr><td class="tdwidth1">End Date </td><td class="tdwidth2">:</td><td class="tdwidth3"><b> <b>'+data.recommendation_detail[i].end_date+'</b></td></tr>';
						verticalViewData += '<tr><td class="tdwidth1">Recommended By </td><td class="tdwidth2">:</td><td class="tdwidth3"><b> <b>'+data.recommendation_detail[i].recommended_by+'</b></td></tr>';
						verticalViewData += '<tr><td class="tdwidth1">Recommended On </td><td class="tdwidth2">:</td><td class="tdwidth3"><b> <b>'+data.recommendation_detail[i].recommended_on+'</b></td></tr></table>';
						verticalViewData += '</div>'
							verticalViewData += '</div>'
					}
				}
				else { 
					verticalViewData="<p class='nodata_text'>No Data Available </p>"}
			}
			else {
				$('#search_recommendation_training_data option[value='+0+']').attr('selected','selected');
				verticalViewData="<p class='nodata_text'>No Data Available </p>"
			}
			$('#training_recommendation_detail_view').html(verticalViewData);
		}
	})
}

function training_recommendation_details(recommendation_id)
{
	$('.EmployeeCard').removeClass('custom_dev_acitve');
	$('#recommendation_'+recommendation_id).addClass('custom_dev_acitve');
	global_recommendation_id=recommendation_id
	$('.errormessage').html('')
	$.ajax({
		type:'GET',
		url: '/ld_training_recommendation_retrieval/',
		async : false,
		data  : {'recommendation_id':global_recommendation_id,'recommendation_type':'T'},
		success: function (json_data){
			data=json_data.recommendation_detail[0]
			$('#tl_training_name').val(data.assessment_training_id).trigger('change')
//			$('#tl_training_category').val(data.training_category_id).trigger('change')
//			$('#tl_training_type').val(data.training_type_id).trigger('change')
//			$('#tl_training_methodology').val(data.training_methodology_id).trigger('change')
//			$('#tl_start_date').val(data.start_date)
//			$('#tl_end_date').val(data.end_date)
		}
	})
}

function tl_training_recommendation_cancel_confirmation() {  orgClearFuncton('tl_clear_cancel','Cancel','TL Training Recommendation'); } //remove confirmation function

function tl_clear_cancel()
{
	document.forms['teamlead_training_recommendation_form'].reset();
	$("#tl_training_name,#tl_organization,#tl_organization_unit,#mr_employee,#tl_training_category,#tl_training_type,#tl_training_methodology,#mr_recommended_by").val(0).trigger('change');
	$("#ld_organization_division").html('');
	tl_button_display('add','');
	global_recommendation_id='';
	$('.errormessage').html('');
	$('#tl_start_date,#tl_end_date').val('');
	$(".date_input_class").trigger('change');
	$('.EmployeeCard').removeClass('custom_dev_acitve');
}

$('#teamlead_training_recommendation_form').submit(function(e) {  //form validation
	e.preventDefault();
}).validate({
	rules: {
		tl_training_name: { valueNotEquals:true, },
		tl_organization: { valueNotEquals:true, },
		tl_organization_unit: { valueNotEquals:true, },
		ld_organization_division: { valueNotEquals:true, },
		mr_employee: { valueNotEquals:true, },
		tl_training_category : { valueNotEquals:true, },
		tl_training_type: { valueNotEquals:true, },
		tl_training_methodology: { valueNotEquals:true, },
		mr_recommended_by: { valueNotEquals:true, },
		tl_start_date: { valueNotEquals:true, },
		tl_end_date: { valueNotEquals:true, },

	},
	//For custom messages
	messages: {
		tl_training_name: { valueNotEquals: "The field is required", },
		tl_organization: { valueNotEquals: "The field is required", },
		tl_organization_unit: { valueNotEquals: "The field is required", },
		ld_organization_division: { valueNotEquals: "The field is required", },
		mr_employee: { valueNotEquals: "The field is required", },
		tl_training_category: { valueNotEquals: "The field is required", },
		tl_training_type: { valueNotEquals: "The field is required", },
		tl_training_methodology: { valueNotEquals: "The field is required", },
		mr_recommended_by: { valueNotEquals: "The field is required", },
		tl_start_date: { valueNotEquals: "The field is required", },
		tl_end_date: { valueNotEquals: "The field is required", },

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

function teamlead_training_recommendation_form_validation() {  return $('#teamlead_training_recommendation_form').valid(); }