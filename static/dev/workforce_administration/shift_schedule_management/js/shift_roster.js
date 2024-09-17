var shift_roster_clicked_id='';
function shift_roster(){
	$('#monthly_view').hide();
	$('#weekly_view').hide();
	$('#shift_no_div').hide();
	$('#sepcific_end_date_div').hide();
	shift_roster_detail();
	roster_button_show('add');
//	$("#start_time,end_time,allow_shift_start,half_day,full_day").DateTimePicker({  dateFormat: "dd-MMM-yyyy" 	});
}

//function roster_button_show(flag)
//{   
//	$("#shift_roster_button").empty();
//	if (flag==1)
//	{
//		var btnstr = '<button type="button" class="btn btn-success btn-eql-wid btn-animate margin-right-3"  onclick="shift_roster_save();">Add</button>';
//	}
//	else
//	{
//		var btnstr = '<button type="button" class="btn btn-primary btn-eql-wid btn-animate margin-right-3"  onclick="shift_roster_update()"";><i class="fa fa-green"></i> Update</button>';
//		btnstr += '<button type="button" class=" btn btn-danger btn-eql-wid btn-animate margin-right-3" onclick="shift_roster_remove_confirmation();">Remove</button>';
//	}
//	btnstr += '<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-3" onclick="shift_roster_cancel();">Cancel / Clear</button>';
//	$("#shift_roster_button").append(btnstr);	
//}

function roster_button_show(action_name){
    $("#shift_roster_button").html('');
    var btnstr = '';
    var access_for_create = jQuery.inArray( "Shift Roster", JSON.parse(localStorage.Create) );
    var access_for_write = jQuery.inArray( "Shift Roster", JSON.parse(localStorage.Write) );
    var access_for_delete = jQuery.inArray( "Shift Roster", JSON.parse(localStorage.Delete) );
    if (action_name == 'add') {
        if (access_for_create != -1){
            btnstr +='<button type="button" class="btn btn-success btn-eql-wid btn-animate margin-right-3"  onclick="shift_roster_save();">Add</button>';
        }
        btnstr += '<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-3" onclick="shift_roster_cancel();">Cancel / Clear</button>';
    } else if (action_name == 'update') {
        if (access_for_write != -1){
            btnstr += '<button type="button" class="btn btn-primary btn-eql-wid btn-animate margin-right-3"  onclick="shift_roster_update()"";><i class="fa fa-green"></i> Update</button>';
        }
        if (access_for_delete != -1){
            btnstr +=  '<button type="button" class=" btn btn-danger btn-eql-wid btn-animate margin-right-3" onclick="shift_roster_remove_confirmation();">Remove</button>';
        }
        btnstr += '<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-3" onclick="shift_roster_cancel();">Cancel / Clear</button>';
    }
    $("#shift_roster_button").append(btnstr);
}

function shift_roster_save()
{
	shift_roster_clicked_id='';
	shift_roster_add_update()
}

function shift_roster_update()
{
	shift_roster_add_update();
}

function shift_roster_remove_confirmation()
{
	removeConfirmation('shift_roster_remove',shift_roster_clicked_id);	
}

function shift_roster_remove(id){
	$.ajax({
		type:'POST',
		url: '/shift_roster/shift_roster_remove/',
		data  : { 'shift_roster_id':shift_roster_clicked_id ,csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()},
		success: function (json_data){
			if(json_data.status=='NTE_04')
			{
				alert_lobibox("success", sysparam_datas_list[json_data.status]);
				shift_roster_detail();
				shift_roster_cancel();
			}
			else{ alert_lobibox("error", sysparam_datas_list["ERR0034"]); 
			shift_roster_detail();
			shift_roster_cancel();}
		}
	})
}

function shift_roster_add_update()
{
	var roster_name=$("#roster_name").val()
	var roster_description=$("#roster_description").val()
	var roster_repeat_mode=$("input[name='roster_repeats']:checked").val()
	var roster_weekly_pattern = [];
	$("input[name='roster_weekly']:checked").each(function() {
		roster_weekly_pattern.push($(this).val());
	});
	var roster_monthly_pattern=[]
	$("#roster_monthly_calendar").find(' input[type="checkbox"].day_check:checked').each(function() {
		roster_monthly_pattern.push($(this).val());
	});
	var roster_end_mode=$("input[name='roster_end_option']:checked").val()
	var roster_end_shift_occurence=$("#roster_no_of_shift").val()
	var roster_end_date=$("#roster_specific_end_date").val()
	var roster_rotation_from=$("#roster_shift_rotation_from option:selected").val();
	var roster_rotation_to=$("#roster_shift_rotation_to option:selected").val();
	if(roster_name=='' || roster_repeat_mode==undefined ||roster_rotation_from==0||roster_rotation_to==0 || roster_end_mode==undefined)
	{
		alert_lobibox("info","Fill all Mandatory fields");
	}
	else if(roster_repeat_mode== "roster_week" && roster_weekly_pattern.length==0)
	{
		alert_lobibox("info","Select Weekly pattern");
	}
	else if(roster_repeat_mode== "roster_month" && roster_monthly_pattern.length==0)
	{
		alert_lobibox("info","Select Monthly pattern");
	}
	else if(roster_end_mode=="Occurence" && roster_end_shift_occurence=='' )
	{
		alert_lobibox("info","Select No of occurrence to end the roster");
	}
	else if(roster_end_mode=="Date" && roster_end_date=='' )
	{
		alert_lobibox("info","Select specific date to end the roster");
	}
	else
	{
		$.ajax({
			type:"POST",
			url: "/shift_roster/add_update_roster_detail/",
			data:{'roster_name':roster_name,'roster_description':roster_description,'roster_repeat_mode':roster_repeat_mode,
				'roster_weekly_pattern':JSON.stringify(roster_weekly_pattern),'roster_monthly_pattern':JSON.stringify(roster_monthly_pattern),
				'roster_end_mode':roster_end_mode,'roster_end_shift_occurence':roster_end_shift_occurence,'roster_end_date':roster_end_date,
				'roster_rotation_from':roster_rotation_from,'roster_rotation_to':roster_rotation_to,'shift_roster_id':shift_roster_clicked_id,csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()},
				success: function (json_data) {
					if(json_data.status=='NTE_01')
					{
						alert_lobibox("success", sysparam_datas_list[json_data.status]);
						shift_roster_detail();
						shift_roster_cancel();
					}
					else
					{
						alert_lobibox("success", sysparam_datas_list[json_data.status]);
						shift_roster_detail();
						shift_roster_cancel();
					}
				}
		})
	}	
}

function shift_roster_detail()  
{
	$.ajax({
		type:'POST',
		url: '/shift_roster/shift_roster_detail/',
		data  : { csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()},
		success: function (json_data){
			var columns = [{"title":"No."},{"title":"Shift Roster"}, {"title":"Description"}, {"title":"Repeat Mode"},{"title":"hidden Id","visible": false}]
			var data=json_data.shift_roster_detail;
			var data_list=[]
			for (var i=0; i<data.length; i++){
				data_list.push([i+1,data[i].roster_name,data[i].roster_description, data[i].roster_repeat_mode,
				                data[i].id]);
			}
			plaindatatable_btn('shift_roster_table', data_list, columns,[])
		},
	})	
}


$('#shift_roster_table').on('click', 'tbody tr', function(){
	shift_roster_cancel();
	var arr=$('#shift_roster_table').dataTable().fnGetData($(this)); 
	shift_roster_clicked_id=arr[4];
	$.ajax({
		type:"POST",
		url: "/shift_roster/shift_roster_detail_fetch/",
		data:{'shift_roster_id':shift_roster_clicked_id,csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()},
		success: function (json_data) {
			if(json_data.status=="Success")
			{
				roster_button_show('update')
				data=json_data.shift_roster_detail[0]
				$("#roster_name").val(data.roster_name)
				$("#roster_description").val(data.roster_description)
				$('input[name="roster_repeats"][value="'+data.roster_repeat_mode+'"]').prop("checked", true).change();
				$('input[name="roster_end_option"][value="'+data.roster_end_mode+'"]').prop("checked", true).change();
				$('#roster_shift_rotation_from').val(data.roster_rotation_from_id).trigger("change")
				$('#roster_shift_rotation_to').val(data.roster_rotation_to_id).trigger("change")
				if(data.roster_weekly_pattern && data.roster_repeat_mode=='Week')
				{
					var week_array = data.roster_weekly_pattern.split(',');
					for(var i = 0; i < week_array.length; i++) {
						$('input[name="roster_weekly"][value="'+week_array[i]+'"]').prop("checked", true)
					}
				}
				if(data.roster_monthly_pattern && data.roster_repeat_mode=='Month')
				{
					var month_array = data.roster_monthly_pattern.split(',');
					for(var j = 0; j < month_array.length; j++) {
						$('input[name="monthly_roster_pattern"][value="'+month_array[j]+'"]').prop("checked", true)
					}
				}
				$('#roster_specific_end_date').val(data.roster_end_date)
				$('#roster_no_of_shift').val(data.roster_end_shift_occurence)
			}
		}
	})

});

$('input[type=radio][name=roster_repeats]').change(function() {
	if (this.value == 'Month') {
		$('#monthly_view').show();
		$('#weekly_view').hide();
		$('input[name="roster_weekly"]').prop("checked", false)
		$('input[name="monthly_roster_pattern"]').prop("checked", false)
	}
	else
	{
		$('#monthly_view').hide();
		$('#weekly_view').show();
		$('input[name="roster_weekly"]').prop("checked", false)
		$('input[name="monthly_roster_pattern"]').prop("checked", false)
	}
})

$('input[type=radio][name=roster_end_option]').change(function() {
	if (this.value == 'Never') {
		$('#shift_no_div').hide();
		$('#sepcific_end_date_div').hide();
		$('#roster_no_of_shift').val('')
		$('#roster_specific_end_date').val('')

	}
	else if (this.value == 'Occurence') {
		$('#shift_no_div').show();
		$('#sepcific_end_date_div').hide();
		$('#roster_no_of_shift').val('')
		$('#roster_specific_end_date').val('')
	}
	else
	{
		$('#shift_no_div').hide();
		$('#sepcific_end_date_div').show();
		$('#roster_no_of_shift').val('')
		$('#roster_specific_end_date').val('')
		$("#roster_start_date").DateTimePicker({  dateFormat: "dd-MMM-yyyy" 	});
		$("#roster_specific_date").DateTimePicker({  dateFormat: "dd-MMM-yyyy" 	});
	}
})

$('#roster_monthly_calendar tbody tr').find('input[type="checkbox"]').change(function(){
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

function shift_roster_cancel()
{
	shift_roster_clicked_id='';
	$("#roster_name").val('');
	$('#roster_description').val('');
	$('input[name="roster_repeats"]').prop("checked", false)
	$('input[name="monthly_roster_pattern"]').prop("checked", false);
	$('input[name="roster_weekly"]').prop("checked", false);
	$('input[type=radio][name=roster_end_option]').prop("checked", false);
	$('#roster_no_of_shift').val('')
	$('#roster_specific_end_date').val('')
	$('#roster_shift_rotation_from').val('0').trigger("change");
	$('#roster_shift_rotation_to').val('0').trigger("change");
	roster_button_show('add');
}
