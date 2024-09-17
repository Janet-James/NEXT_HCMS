var current_date;
$(document).ready(function (){
	$("#start_time,end_time,half_day,full_day").DateTimePicker({  dateFormat: "dd-MMM-yyyy" 	});
	shift_master_cancel();
	shift_details();
	var month_names = ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var today = new Date();
    var day = today.getDate();
    var month_index = today.getMonth();
    var year = today.getFullYear();
    current_date=day + "-" + month_names[month_index] + "-" + year
    if(current_date=='' || current_date==undefined )
    {
    	current_date=''
    }
  
});
//Validation for Drop Data
$.validator.addMethod("valueNotEquals", function(value, element, arg){
	if(value == 0) {
		return false
	} else {
		return true
	}
}, "Value must not equal arg.");

//validation for promotion form
$('#shift_master_form').submit(function(e) {
		e.preventDefault();
	}).validate({
		rules: {
			shift_name: { required: true, }, 
			start_time: { required: true, }, 
			end_time: { required: true, },
			work_full_day: { required: true,},
			half_full_day: { required: true,},
			organization: { valueNotEquals:true, },
			organization_unit: { valueNotEquals:true, },
		},
		//For custom messages
		messages: {
			shift_name: { required: "The shift name is required", },
			start_time: { required: "The start time is required", },
			end_time: { required: "The end time is required", },
			work_full_day: { required: "The hours to work full day is required", },
			half_full_day: { required: "The hours to work half day is required", },
			organization: { valueNotEquals: "The organization is required", },
			organization_unit: { valueNotEquals: "The organization unit is required", },
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
function shift_master_form_validation()
{
	return $('#shift_master_form').valid();
}
function shift_master_cancel()
{
	document.forms['shift_master_form'].reset();
	$('.errormessage').html('')
	$('#organization').val('0').trigger("change")
	$('#organization_unit').html('')
	$('#division').html('')
	button_show('add')
	clicked_row_id=''
	$('#work_full_day,#work_half_day,#shift_end,#shift_start').val('');
	$(".date_input_class").trigger('change');
	$('#shift_master_table tbody tr').removeClass('selected');
}

//function send_data(url_type,url,data)
//{  
//	$.ajax(
//			{
//				type:url_type,
//				url: url,
//				data  : data,
//			    async : false,
//				success: function (json_data){
//					if(json_data.status=='NTE_01'){ alert_lobibox("success", sysparam_datas_list[json_data.status]); shift_master_cancel(); shift_details(); clicked_row_id=''}
//					else if(json_data.status=='NTE_02'){ alert_lobibox("error", sysparam_datas_list[json_data.status]); shift_master_cancel(); }
//					else if(json_data.status=='NTE_03'){ alert_lobibox("success", sysparam_datas_list[json_data.status]); shift_master_cancel(); shift_details(); clicked_row_id=''}
//					else if(json_data.status=='NTE_04'){ alert_lobibox("success", sysparam_datas_list[json_data.status]); shift_master_cancel(); shift_details(); clicked_row_id=''}
//					else if(json_data.status=='001'){ alert_lobibox("info","Session Expired");}
//					else if(json_data.status=='NTE-01'){ alert_lobibox("info","Shift is already assigned to this organization unit");}
//					else{ alert_lobibox("error", sysparam_datas_list["ERR0034"]); }
//				},
//			})	
//}
$('#organization').change(function(){
	
	var str_org_id=$('#organization  option:selected').val()
	if(str_org_id!='0' && str_org_id!='')
	{
		$.ajax({
			type:'GET',
			url: '/shift/org_unit_fetch/',
			async : false,
			data  : { 'str_org_id':str_org_id},
			success: function (json_data){
				var data=json_data
				$('#organization_unit').html('')
				if(data)
				{
					var data_len=data.org_unit.length;
					if(data_len>=1)
					{  
						for(var i=0;i<data_len;i++)
						{   
							$('#organization_unit').append($('<option>', {
			                    value : data.org_unit[i].id,
			                    text : data.org_unit[i].orgunit_name,
			                }));
						}
					}
					else{ $('#organization_unit').html('') }
				}
				else{ $('#organization_unit').html('') }
			},
		})	
	}
	else {
		$('#organization_unit').html('')
	 }
});
//$('#organization_unit').change(function(){
//	var selected_org_unit=$('#organization_unit').val();
//	if(selected_org_unit!=null)
//	{   
//		$.ajax({
//			type:'GET',
//			url: '/shift/division_fetch/',
//			async : false,
//			data  : { 'str_org_unit_id':JSON.stringify(selected_org_unit)},
//			success: function (json_data){
//				var data=json_data
//				var id_list=[]
//				$('#division').html('')
//				if(data)
//				{
//					var data_len=data.division.length;
//					if(data_len>=1)
//					{  
//						for(var i=0;i<data_len;i++)
//						{   
//							$('#division').append($('<option>', {
//			                    value : data.division[i].id,
//			                    text : data.division[i].name,
//			                }));
//							id_list.push(data.division[i].id)
//						}
//						 $('#division').val(id_list)
//					}
//					else{ $('#division').html('') }
//				}
//				else{ $('#division').html('') }
//			},
//		})	
//	}
//	
//});

$('#schedule_table tbody tr').find('input[type="checkbox"]').change(function(){
    if($(this).hasClass('all_check') )
    {
        if(this.checked == true)
        {$(this).closest('tr').find('input[type="checkbox"]').each(function() {
                this.checked = true;})}
        else
        {$(this).closest('tr').find('input[type="checkbox"]').each(function(){
                this.checked = false;})}
    }
    else
    {
        if($(this).closest('tr').find(' input[type="checkbox"].day_check:checked').length == 5)
        {$(this).closest('tr').find('.all_check').prop('checked', true);}
        else{$(this).closest('tr').find('.all_check').prop('checked', false);}
    }
});