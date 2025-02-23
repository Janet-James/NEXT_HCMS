global_recommendation_id='';
$(document).ready(function(){
	gr_button_display('add')
	training_recommendation_detail_view();
});

$('#gr_organization').change(function(){
	var str_org_id=$('#gr_organization  option:selected').val()
	if(str_org_id!='0' && str_org_id!='')
	{  
		$('.errorTxt0').html('') 
		$.ajax({
			type:'GET',
			url: '/shift/org_unit_fetch/',
			async : false,
			data  : { 'str_org_id':str_org_id},
			success: function (json_data){
				var data=json_data
				$('#gr_organization_unit').html('')
				$('#gr_organization_unit').append($('<option>', {
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
							$('#gr_organization_unit').append($('<option>', {
								value : data.org_unit[i].id,
								text : data.org_unit[i].orgunit_name,
							}));
						}
					}
					else{ $('#gr_organization_unit').val('0').trigger("change"); }
				}
				else{ $('#gr_organization_unit').val('0').trigger("change"); }
			},
		})	
	}
	else {
		$('#gr_organization_unit').html('')
		$('#gr_organization_unit').append($('<option>', {
			value :'0',
			text :'--Select--'
		}));
		$('#gr_organization_unit').val('0').trigger("change");}
});

$('#gr_organization_unit').change(function(){
	var org_unit_id=$('#gr_organization_unit  option:selected').val()
	if(org_unit_id!='0' && org_unit_id!='')
	{   
		$('.errorTxt6').html('') 
		$.ajax({
			type:'GET',
			url: '/ld_division_data_fetch/',
			async : false,
			data  : { 'org_unit_id':org_unit_id},
			success: function (json_data){
				var data=json_data
				$('#gr_organization_division').html('')
				$('#gr_organization_division').append($('<option>', {
					value :'0',
					text :'--Select--'
				}));
				if(data)
				{
					console.log(data)
					var data_len=data.division_detail.length;
					if(data_len>=1)
					{  
						for(var i=0;i<data.division_detail.length;i++)
						{   

							$('#gr_organization_division').append($('<option>', {
								value : data.division_detail[i].department_id,
								text : data.division_detail[i].department_name,
							}));
						}
					}
					else{ $('#gr_organization_division').val('0').trigger("change"); }
				}
				else{ $('#gr_organization_division').val('0').trigger("change"); }
			},
		})	
	}
	else {
		$('#gr_organization_division').html('')
		$('#gr_organization_division').append($('<option>', {
			value :'0',
			text :'--Select--'
		}));
		$('#gr_organization_division').val('0').trigger("change"); }
});

//$('#gr_organization_unit').change(function(){
//	var org_unit_id=$('#gr_organization_unit  option:selected').val()
//	if(org_unit_id!='0' && org_unit_id!='')
//	{   
//		$('.errorTxt6').html('') 
//		$.ajax({
//			type:'GET',
//			url: '/ld_division_data_fetch/',
//			async : false,
//			data  : { 'org_unit_id':org_unit_id},
//			success: function (json_data){
//				var data=json_data
//				$('#gr_organization_division').html('')
//				$('#gr_organization_division').append($('<option>', {
//					value :'0',
//					text :'--Select--'
//				}));
//				if(data)
//				{
//					var data_len=data.division_detail.length;
//					if(data_len>=1)
//					{  
//						for(var i=0;i<data.division_detail.length;i++)
//						{   
//
//							$('#gr_organization_division').append($('<option>', {
//								value : data.division_detail[i].department_id,
//								text : data.division_detail[i].department_name,
//							}));
//						}
//					}
//					else{ $('#gr_organization_division').val('0').trigger("change"); }
//				}
//				else{ $('#gr_organization_division').val('0').trigger("change"); }
//			},
//		})	
//	}
//	else {
//		$('#gr_organization_division').html('')
//		$('#gr_organization_division').append($('<option>', {
//			value :'0',
//			text :'--Select--'
//		}));
//		$('#gr_organization_division').val('0').trigger("change"); }
//});


$('#gr_organization_division').change(function(){
	var division_id=$('#gr_organization_division  option:selected').val()
	$('#gr_employee').html('')
	$('#gr_training_name').html('')
	$('#gr_training_name').append($('<option>', {
		value :'0',
		text :'--Select--'
	}));
	if(division_id!='0' && division_id!='')
	{  
		$('.errorTxt1').html('') 
		$.ajax({
			type:'GET',
			url: '/ld_employee_training_data_fetch/',
			async : false,
			data  : { 'division_id':division_id},
			success: function (json_data){
				var data=json_data
				console.log(data)

				if(data)
				{
					if(data.employee_detail.length!=0)
					{  
						for(var i=0;i<data.employee_detail.length;i++)
						{   

							$('#gr_employee').append($('<option>', {
								value : data.employee_detail[i].employee_id,
								text : data.employee_detail[i].employee_name,
							}));
						}
					}
					else{$('#gr_employee').val('').trigger("change");}
					if(data.training_detail.length!=0)
					{  
						for(var i=0;i<data.training_detail.length;i++)
						{   

							$('#gr_training_name').append($('<option>', {
								value : data.training_detail[i].training_id,
								text : data.training_detail[i].training_name,
							}));
						}
					}
					else{ $('#gr_training_name').val('0').trigger("change"); }
				}
				else{
					$('#gr_training_name').val('0').trigger("change");
					$('#gr_employee').val('').trigger("change");}
			},
		})	
	}
});

$('#gr_training_name').change(function(){
	var training_id=$('#gr_training_name  option:selected').val()
	if (training_id!='0' && training_id!=''){
		$('.errorTxt8').html('') 
		$.ajax({
			type:'GET',
			url: '/ld_training_detail_fetch/',
			async : false,
			data  : { 'training_id':training_id},
			success: function (json_data){
				$('#gr_training_methodology').val(json_data.training_detail[0].training_methodology);
				$('#gr_training_type').val(json_data.training_detail[0].training_type);
				$('#gr_start_date').val(json_data.training_detail[0].start_date)
				$('#gr_end_date').val(json_data.training_detail[0].end_date)
			}
		});
	}
})

function gr_button_display(flag)
{
	$("#gr_view_btn_div").empty();
	if (flag=='add')
	{
		var btnstr = '<button type="button" class="btn btn-success btn-eql-wid btn-animate margin-right-3"  onclick="add_update_gr();">Add</button>';
	}
	else
	{
		var btnstr = '<button type="button" class="btn btn-primary btn-eql-wid btn-animate margin-right-3"  onclick="add_update_gr();">Update</button>';
		btnstr += '<button type="button" class=" btn btn-danger btn-eql-wid btn-animate margin-right-3" onclick="gr_remove_confirmation();">Remove</button>';
	}
	btnstr += '<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-3" onclick="training_recommendation_cancel_confirmation();">Cancel / Clear</button>';
	$("#gr_view_btn_div").append(btnstr);    
}

function gr_remove_confirmation() {  removeConfirmation('gr_remove',global_recommendation_id,'Training Recommendation'); } //remove confirmation function

function gr_remove()
{
	if(global_recommendation_id)
	{
		$.ajax({
			type:'GET',
			url: '/ld_training_recommendation_remove/',
			async : false,
			data  : {'recommendation_id':global_recommendation_id},
			success: function (json_data){
				data=json_data
				if(data.status == 'NTE_04'){
					alert_lobibox('success',sysparam_datas_list[data.status])
					gr_button_display('add');
					gr_clear_cancel();
					training_recommendation_detail_view();
				}
				else					{
					alert_lobibox('success',sysparam_datas_list[data.status])
				}
			}
		});
	}
}

function add_update_gr()
{
	recommendation_id=global_recommendation_id
	division_id=$('#gr_organization_division').val()
	employee_id=$('#gr_employee').val()
	console.log(employee_id)
	training_id=$('#gr_training_name').val()
	recommendation_type='G'
	validation_status=general_training_recommendation_form_validation()
	if(validation_status)
	{
		$('.errormessage').html('')
		$.ajax({
			type:'GET',
			url: '/ld_recommendation_add_update/',
			async : false,
			data  : {'recommendation_type':recommendation_type,'recommendation_id':recommendation_id,'training_id':training_id,'employee_id':JSON.stringify(employee_id),'division_id':division_id},
			success: function (json_data){
				if(json_data.status == 'NTE_01'){
					alert_lobibox("success", sysparam_datas_list[json_data.status]);
					gr_clear_cancel();
					training_recommendation_detail_view()
				}else if(json_data.status == 'NTE_02'){
					alert_lobibox('error',json_data.message)
					gr_clear_cancel();
					training_recommendation_detail_view()
				}else if(json_data.status == 'NTE_03'){
					alert_lobibox("success", sysparam_datas_list[json_data.status]);
					gr_clear_cancel();
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

function training_recommendation_detail_view()
{
	$.ajax({
		type:'GET',
		url: '/ld_training_recommendation_detail_fetch/',
		data: {'recommendation_type':'G'},
		async : false,
		success: function (json_data){
			console.log(json_data )
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
							value : data.search_detail[j].training_id,
							text : data.search_detail[j].training_name,
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
						verticalViewData += '<div class="col-md-12 EmployeeCard equhight employeeList ta_job_opening search_'+data.recommendation_detail[i].training_id+'"" id="recommendation_'+data.recommendation_detail[i].id+'" onclick="training_recommendation_details('+data.recommendation_detail[i].id+')">'
						
						verticalViewData += '<div class="col-md-12">'
							verticalViewData += '<table><tr><td class="tdwidth1">Training Name </td><td class="tdwidth2">:</td><td class="tdwidth3"><b>'+data.recommendation_detail[i].training_name+'</b></td></tr>';
						verticalViewData += '<tr><td class="tdwidth1">Division </td><td class="tdwidth2">:</td><td class="tdwidth3"><b> <b>'+data.recommendation_detail[i].division+'</b></td></tr>';
						verticalViewData += '<tr><td class="tdwidth1">Start Date </td><td class="tdwidth2">:</td><td class="tdwidth3"><b> <b>'+data.recommendation_detail[i].start_date+'</b></td></tr>';
						verticalViewData += '<tr><td class="tdwidth1">End Date </td><td class="tdwidth2">:</td><td class="tdwidth3"><b> <b>'+data.recommendation_detail[i].end_date+'</b></td></tr>';
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
		data  : {'recommendation_id':global_recommendation_id},
		success: function (json_data){
			console.log(json_data)
			gr_button_display('update')
			data=json_data.recommendation_detail
			$('#gr_organization').val(data[0].org_id).trigger('change')
			$('#gr_organization_unit').val(data[0].org_unit_id).trigger('change')
			$('#gr_organization_division').val(data[0].division_id).trigger('change')
			$('#gr_employee').val(data[0].employee).trigger('change')
			$('#gr_training_name').val(data[0].training_id).trigger('change')
		}
	})
}

$('#search_recommendation_training_data').change(function(){                         //search functio
	var search_id=$('#search_recommendation_training_data option:selected').val()
	$('.EmployeeCard').hide()
	if(search_id>0)
	{
		$('.search_'+search_id).show()
		$('#'+search_id).addClass('custom_dev_acitve');
	}
	else { $('.EmployeeCard').show(); $('.EmployeeCard').removeClass('custom_dev_acitve'); }

});

function training_recommendation_cancel_confirmation() {  orgClearFuncton('gr_clear_cancel','Cancel','Training Recommendation'); } //remove confirmation function


function gr_clear_cancel()
{
	document.forms['general_training_recommendation_form'].reset();
	$("#gr_organization,#gr_organization_unit,#gr_organization_division,#gr_employee,#gr_training_name").val(0).trigger('change');
	gr_button_display('add');
	global_recommendation_id='';
	$('.errormessage').html('');
	$('.EmployeeCard').removeClass('custom_dev_acitve');
}

$('#general_training_recommendation_form').submit(function(e) {  //form validation
	e.preventDefault();
}).validate({
	rules: {
		gr_organization: { valueNotEquals:true, },
		gr_organization_unit: { valueNotEquals:true, },
		gr_organization_division: { valueNotEquals:true, },
		gr_employee: { valueNotEquals:true, },
		gr_training_name : { valueNotEquals:true, },
		gr_experience: { valueNotEquals:true, },
	},
	//For custom messages
	messages: {
		gr_organization: { valueNotEquals: "The field is required", },
		gr_organization_unit: { valueNotEquals: "The field is required", },
		gr_organization_division: { valueNotEquals: "The field is required", },
		gr_employee: { valueNotEquals: "The field is required", },
		gr_training_name: { valueNotEquals: "The field is required", },
		gr_experience: { valueNotEquals: "The field is required", },
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

function general_training_recommendation_form_validation() {  return $('#general_training_recommendation_form').valid(); }