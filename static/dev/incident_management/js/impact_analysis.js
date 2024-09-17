function impactAnalysisClick(){
	$("#dtBox_impact").DateTimePicker({
		dateFormat : "DD-MM-yyyy"
	});
	$.ajax({
		type:'post',
		url: "/incident/impact_analysis_view/",
		async:false,
		data: {'record_id':kanban_clicked_id,csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()},
		success: function (json_data){
			console.log("console.log(json_data)",json_data)
			if(json_data['status']=="NTE_01"){
				if(json_data['impact_analysis_data'].length!=0){
					var data = json_data['impact_analysis_data']
					for(var i=0;i<data.length;i++){
						var analysisDate = new Date(data[i]['analysis_date']);
						var dd = analysisDate.getDate();
			            var mm = analysisDate.getMonth()+1; //January is 0!
			            var yyyy = analysisDate.getFullYear();
			            if(dd < 10){
				            dd = '0'+ dd;
			            }
			            if(mm < 10){
				            mm = '0' + mm;
			            }
						$('#environmental_finance').val(data[i]['environmental_financial_value']);
						$('#environmental_currency').val(data[i]['environmental_currency_id']).trigger('change');
						$('#hr_finance').val(data[i]['hr_financial_value']);
						$('#hr_currency').val(data[i]['hr_currency_id']).trigger('change');
						$('#materials_finance').val(data[i]['materials_financial_value']);
						$('#materials_currency').val(data[i]['materials_currency_id']).trigger('change');
						$('#machinery_finance').val(data[i]['machinery_financial_value']);
						$('#machinery_currency').val(data[i]['machinery_currency_id']).trigger('change');
						$('#analysis_date').val(dd+'-'+mm+'-'+yyyy);
						$('#minimum_recoverty_time').val(data[i]['minimum_recovery_time']);
						$('#environmental_impact_details').val(data[i]['environmental_impact_detail']);
						$('#hr_impact_details').val(data[i]['hr_impact_detail']);
						$('#materials_impact_details').val(data[i]['materials_impact_detail']);
						$('#machinery_impact_details').val(data[i]['machinery_impact_detail']);
						$('#other_risks').val(data[i]['other_risks']);
						$('#business_impact').val(data[i]['business_impact']);
						$('#business_activities_affected').val(data[i]['business_activities_affected']);
						
						$("#impact_analysis_update").show();
						$("#impact_analysis_add").hide();
					}
				}
				else{
					impactAnalysisReset();
					$("#impact_analysis_update").hide();
					$("#impact_analysis_add").show();
				}
			}
			else{
				impactAnalysisReset();
				$("#impact_analysis_update").hide();
				$("#impact_analysis_add").show();
			}

		}
	})
}

$('#impact_analysis_add').click(function(){
	var environmental_finance=$('#environmental_finance').val();
	var environmental_currency=$('#environmental_currency').val();
	var environmental_impact_details = $('#environmental_impact_details').val();
	var hr_finance=$('#hr_finance').val();
	var hr_currency=$('#hr_currency').val();
	var hr_impact_details = $('#hr_impact_details').val();
	var material_finance=$('#materials_finance').val();
	var material_currency=$('#materials_currency').val();
	var material_impact_details = $('#materials_impact_details').val();
	var machinery_finance=$('#machinery_finance').val();
	var machinery_currency=$('#machinery_currency').val();
	var machinery_impact_details = $('#machinery_impact_details').val();
	var analysis_date=$('#analysis_date').val();
	var other_risks=$('#other_risks').val();
	var business_impact=$('#business_impact').val();
	var business_activities_affected=$('#business_activities_affected').val();
	var minimum_recoverty_time=$('#minimum_recoverty_time').val();
	
	data = {'record_id':kanban_clicked_id,'environmental_finance':environmental_finance,'environmental_currency':environmental_currency,
			'environmental_impact_details':environmental_impact_details,'hr_finance':hr_finance,'hr_currency':hr_currency,'hr_impact_details':hr_impact_details,
			'material_finance':material_finance,'material_impact_details':material_impact_details,'material_currency':material_currency,
			'machinery_finance':machinery_finance,'machinery_impact_details':machinery_impact_details,'machinery_currency':machinery_currency,
			'analysis_date':analysis_date,'other_risks':other_risks,'business_impact':business_impact,'business_activities_affected':business_activities_affected,
			'minimum_recoverty_time':minimum_recoverty_time,csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()}
	returnVal = ajax_data('POST','/incident/impact_analysis_save/',data);
	if(returnVal){impactAnalysisClick()}
	
})

$('#impact_analysis_update').click(function(){
	var environmental_finance=$('#environmental_finance').val();
	var environmental_currency=$('#environmental_currency').val();
	var environmental_impact_details = $('#environmental_impact_details').val();
	var hr_finance=$('#hr_finance').val();
	var hr_currency=$('#hr_currency').val();
	var hr_impact_details = $('#hr_impact_details').val();
	var material_finance=$('#materials_finance').val();
	var material_currency=$('#materials_currency').val();
	var material_impact_details = $('#materials_impact_details').val();
	var machinery_finance=$('#machinery_finance').val();
	var machinery_currency=$('#machinery_currency').val();
	var machinery_impact_details = $('#machinery_impact_details').val();
	var analysis_date=$('#analysis_date').val();
	var other_risks=$('#other_risks').val();
	var business_impact=$('#business_impact').val();
	var business_activities_affected=$('#business_activities_affected').val();
	var minimum_recoverty_time=$('#minimum_recoverty_time').val();
	
	data = {'record_id':kanban_clicked_id,'environmental_finance':environmental_finance,'environmental_currency':environmental_currency,
			'environmental_impact_details':environmental_impact_details,'hr_finance':hr_finance,'hr_currency':hr_currency,'hr_impact_details':hr_impact_details,
			'material_finance':material_finance,'material_impact_details':material_impact_details,'material_currency':material_currency,'machinery_finance':machinery_finance,
			'machinery_impact_details':machinery_impact_details,'machinery_currency':machinery_currency,'analysis_date':analysis_date,'other_risks':other_risks,
			'business_impact':business_impact,'business_activities_affected':business_activities_affected,'minimum_recoverty_time':minimum_recoverty_time,
			csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()}
	returnVal = ajax_data('POST','/incident/impact_analysis_update/',data);
	if(returnVal){impactAnalysisClick()}
})

$('#impact_analysis_delete').click(function(){
	data = {'record_id':kanban_clicked_id,csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()}
	returnVal = ajax_data('POST','/incident/impact_analysis_remove/',data);
	if(returnVal){impactAnalysisClick()}
});

$('#impact_analysis_clear').click(function(){
	$('#myKanban').show();
	$('#accordion_view').hide();
	document.getElementById("impact_analysis_form").reset();
	impactAnalysisReset();
})

function impactAnalysisReset(){
	
	$('#environmental_finance').val('');
	$('#environmental_currency').val(0).trigger('change');
	$('#environmental_impact_details').val('');
	$('#hr_finance').val('');
	$('#hr_currency').val(0).trigger('change');
	$('#hr_impact_details').val('');
	$('#materials_finance').val('');
	$('#materials_currency').val(0).trigger('change');
	$('#materials_impact_details').val('');
	$('#machinery_finance').val('');
	$('#machinery_currency').val(0).trigger('change');
	$('#machinery_impact_details').val('');
	$('#analysis_date').val('');
	$('#other_risks').val('');
	$('#business_impact').val('');
	$('#business_activities_affected').val('');
	$('#minimum_recoverty_time').val('');
	
}