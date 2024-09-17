//12-Feb-2018 || SMI || Function to check whether the entered value is only number

function isNumber(evt) {
	evt = (evt) ? evt : window.event;
	var charCode = (evt.which) ? evt.which : evt.keyCode;
	if (charCode > 31 && (charCode < 48 || charCode > 57)) {
		return false;
	}
	return true;
}

function reports_to_update()
{
	$('#rd_details_reps_to').empty().append($('<option>',{
		value:'0',
		text:'-Select-',
		hidden:'hidden',
		selected:'selected',
		disabled:'disabled'
	}));
	$.ajax({
		url : '/ti_reports_to_update/',
		type : 'POST',
		timeout : 10000,
	}).done(function(json_data){
		json_data = JSON.parse(json_data);
		for(i=0;i<json_data.role_reports_to.length;i++)
		{
			$('#rd_details_reps_to').append($('<option>',{
				value:json_data.role_reports_to[i].id,
				text:json_data.role_reports_to[i].role_title
			}))
		}
		var rd_rep_to_list = $('#rd_details_reps_to option').length;
		if (rd_rep_to_list > 1){
			$('#rd_details_reps_to').attr("disabled", false);
		} else if(rd_rep_to_list <= 1) {
			$('#rd_details_reps_to').attr("disabled", true);
		}
	});
	return true;
}