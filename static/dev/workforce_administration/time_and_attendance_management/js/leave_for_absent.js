var lfa_detail_id=''
	var global_shift_id=1
	function leave_for_absent(){
		lfa_button_show('add');
		$("#div_lfa_effective_from").DateTimePicker({  dateFormat: "dd-MMM-yyyy" });
		leave_for_absent_detail()
	}

$('#lfa_orgList').change(function(){
	var lfa_org_id=$('#lfa_orgList  option:selected').val()
	if(lfa_org_id!='0' && lfa_org_id!='')
	{
		$.ajax({
			type:'GET',
			url: '/shift/org_unit_fetch/',
			data  : { 'str_org_id':lfa_org_id},
			async : false,
			success: function (json_data){
				var data=json_data
				$('#lfa_orgUnitList').html('')
				$('#lfa_orgUnitList').append($('<option>', {
					value :'0',
					text :'-Select-'
				}));
				if(data)
				{
					var data_len=data.org_unit.length;
					if(data_len>=1)
					{  
						for(var i=0;i<data_len;i++)
						{   
							$('#lfa_orgUnitList').append($('<option>', {
								value : data.org_unit[i].id,
								text : data.org_unit[i].orgunit_name,
							}));
						}
					}
					else{ $('#lfa_orgUnitList').val('0').trigger("change"); }
				}
				else{ $('#lfa_orgUnitList').val('0').trigger("change"); }
			}
		});
	}
});

$('#lfa_orgUnitList').change(function(){
	var org_unit_id=$('#lfa_orgUnitList  option:selected').val()
	if(org_unit_id!='0' && org_unit_id!='')
	{
		$.ajax({
			type:'GET',
			url: '/shift_dropdown/',
			data  : { 'org_unit_id':org_unit_id},
			async : false,
			success: function (json_data){
				var data=json_data
				$('#lfa_shift_name_list').html('')
				$('#lfa_shift_name_list').append($('<option>', {
					value :'0',
					text :'-Select-'
				}));
				if(data)
				{
					var data_len=data.shift_details.length;
					if(data_len>=1)
					{  
						for(var i=0;i<data_len;i++)
						{   
							$('#lfa_shift_name_list').append($('<option>', {
								value : data.shift_details[i].id,
								text : data.shift_details[i].shift_name,
							}));
						}
					}
					else{ $('#lfa_shift_name_list').val('0').trigger("change"); }
				}
				else{ $('#lfa_shift_name_list').val('0').trigger("change"); }
			},
		})	
	}
	else {
		$('#lfa_shift_name_list').html('')
		$('#lfa_shift_name_list').append($('<option>', {
			value :'0',
			text :'-Select-'
		}));
		$('#lfa_shift_name_list').val('0').trigger("change"); }
});

function  lfa_button_show(flag)
{   
	$("#lfa_button_layout").empty();
	if (flag=='add')
	{
		var btnstr = '<button type="button" class="btn btn-success btn-eql-wid btn-animate margin-right-3" id="lfa_save" onclick="lfa_save();">Add</button>';
	}
	else
	{
		var btnstr = '<button type="button" class="btn btn-primary btn-eql-wid btn-animate margin-right-3" id="lfa_update" onclick="lfa_update()"";><i class="fa fa-green"></i> Update</button>';
		btnstr += '<button type="button" class=" btn btn-danger btn-eql-wid btn-animate margin-right-3" id="lfa_delete" onclick="lfa_remove_confirmation();">Remove</button>';
	}
	btnstr += '<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-3" id="lfa_clear" onclick="lfa_cancel();">Cancel / Clear</button>';
	$("#lfa_button_layout").append(btnstr);	
}
//function lfa_button_show(action_name){
//$("#lfa_button_layout").html('');
//var btnstr = '';
//var access_for_create = jQuery.inArray( "Time Attendance", JSON.parse(localStorage.Create) );
//var access_for_write = jQuery.inArray( "Time Attendance", JSON.parse(localStorage.Write) );
//var access_for_delete = jQuery.inArray( "Time Attendance", JSON.parse(localStorage.Delete) );
//if (action_name == 'add') {
//  if (access_for_create != -1){
//      btnstr +='<button type="button" class="btn btn-success btn-eql-wid btn-animate margin-right-3" id="lfa_save" onclick="lfa_save();">Add</button>';
//  }
//  btnstr += '<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-3" id="lfa_clear" onclick="lfa_cancel();">Cancel / Clear</button>';
//} else if (action_name == 'update') {
//  if (access_for_write != -1){
//      btnstr +='<button type="button" class="btn btn-primary btn-eql-wid btn-animate margin-right-3" id="lfa_update" onclick="lfa_update()";><i class="fa fa-green"></i> Update</button>';
//  }
//  if (access_for_delete != -1){
//      btnstr +='<button type="button" class=" btn btn-danger btn-eql-wid btn-animate margin-right-3" id="lfa_delete" onclick="lfa_remove_confirmation();">Remove</button>';
//  }
//  btnstr += '<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-3" id="lfa_clear" onclick="lfa_cancel();">Cancel / Clear</button>';
//}
//$("#lfa_button_layout").append(btnstr);
//}
function lfa_save()
{
	lfa_detail_id=''
		lfa_save_update()
}

function lfa_update()
{
	lfa_save_update()
}

function lfa_save_update()
{
var lfa_shift_id=$("#lfa_shift_name_list option:selected").val()
var lfa_leave_type_ids=$("#lfa_leave_type").val()
var start_day=$("#lfa_start_day").val()
var end_day=$("#lfa_end_day").val()
var effective_date=$("#lfa_effective_from").val()
var status=leave_for_absent_form_validation()
if(status){
	$.ajax({
		type:"POST",
		url: "/leave_for_absent_add_update/",
		data:{'lfa_detail_id':lfa_detail_id,'shift_id':lfa_shift_id,'leave_type_ids':JSON.stringify(lfa_leave_type_ids),'start_day':start_day,
			'end_day':end_day,'effective_date':effective_date,'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val()},
			success: function (json_data) {
				if(json_data.status=='NTE_01')
				{
					alert_lobibox("success", sysparam_datas_list[json_data.status]);
					leave_for_absent_detail();
					lfa_cancel();
				}
				else
				{
					alert_lobibox("success", sysparam_datas_list[json_data.status]);
					leave_for_absent_detail();
					lfa_cancel();
				}
			}
	});
}  else  {  alert_lobibox("info","Fill all fields");  }
}
function leave_for_absent_detail()  
{
	$.ajax({
		type:'POST',
		url: '/leave_for_absent_detail/',
		data  : { csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()},
		success: function (json_data){
			var columns = [{"title":"No."},{"title":"Organization Name"},{"title":"Organization Unit "},{"title":"Shift Name"}, {"title":"Effective From"}, {"title":"Start Day"},{"title":"End Day"},{"title":"hidden Id","visible": false}]
			var data=json_data.leave_for_absent_detail;
			var data_list=[]
			for (var i=0; i<data.length; i++){
				data_list.push([i+1,data[i].org_name,data[i].orgunit_name,data[i].shift_name,data[i].effective_from,data[i].start_day,data[i].end_day,data[i].id]);
			}
			plaindatatable_btn('leave_for_absent_master_table', data_list, columns,[])
		},
	})	
}

$('#leave_for_absent_master_table').on('click', 'tbody tr', function(){
	$('.errormessage').html('')
	var arr=$('#leave_for_absent_master_table').dataTable().fnGetData($(this)); 
	global_shift_id=''
	lfa_detail_id=arr[5];
	$.ajax({
		type:"POST",
		url: "/leave_for_absent_detail_fetch/",
		data:{'lfa_detail_id':lfa_detail_id,'shift_id':'',csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()},
		success: function (json_data) {
//			lfa_cancel();
			form_inputs_clear('#leave_for_absent_form');
			lfa_button_show('update')
			data=json_data.leave_for_absent_detail
			$('#lfa_orgList').val(data[0].organization_id).trigger("change"); 
			$('#lfa_orgUnitList').val(data[0].orgunit_id).trigger("change"); 
			$('#lfa_shift_name_list').val(data[0].emp_shift_id).trigger("change"); 
			$('#lfa_leave_type').val(data[0].leave_type).trigger("change"); 
			$('#lfa_start_day').val(data[0].start_day).trigger("change"); 
			$('#lfa_end_day').val(data[0].start_day).trigger("change"); 
			$('#lfa_effective_from').val(data[0].effective_from)
			global_shift_id=1
		}
	})
})

$('#lfa_shift_name_list').change(function(){
	var shift_id=$('#lfa_shift_name_list  option:selected').val()
	if(shift_id!='0' && shift_id!='' && global_shift_id==1)
		{
		$.ajax({
			type:"POST",
			url: "/leave_for_absent_detail_fetch/",
			data:{'lfa_detail_id':'','shift_id':shift_id,csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()},
			success: function (json_data) {
				data=json_data.leave_for_absent_detail
				if(data.length!=0)
				{
					lfa_detail_id=data[0].id
					lfa_button_show('update');
					$('#lfa_leave_type').val(data[0].leave_type).trigger("change"); 
					$('#lfa_start_day').val(data[0].start_day).trigger("change"); 
					$('#lfa_end_day').val(data[0].start_day).trigger("change"); 
					$('#lfa_effective_from').val(data[0].effective_from)
				}
				else
					{lfa_detail_id=''
						lfa_button_show('add');
					$('#lfa_leave_type').val(0).trigger("change"); 
					$('#lfa_start_day').val(0).trigger("change"); 
					$('#lfa_end_day').val(0).trigger("change"); 
					$('#lfa_effective_from').val('')
					}
			}
		});
		}
		})

function lfa_cancel()
{
	form_inputs_clear('#leave_for_absent_form');
	lfa_detail_id='';
	lfa_button_show('add');
	$('.errormessage').html('')
}

function lfa_remove_confirmation()
{
	removeConfirmation('lfa_detail_remove',lfa_detail_id);	
}

function lfa_detail_remove(id){
	$.ajax({
		type:'POST',
		url: '/lfa_detail_remove/',
		data  : { 'lfa_detail_id':lfa_detail_id ,csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()},
		success: function (json_data){
			if(json_data.status=='NTE_04')
			{
				alert_lobibox("success", sysparam_datas_list[json_data.status]);
				leave_for_absent_detail();
				lfa_cancel();
			}
			else{ alert_lobibox("error", sysparam_datas_list["ERR0034"]); 
			leave_for_absent_detail();
			lfa_cancel();}
		}
	})
}

//validation
$.validator.addMethod("valueNotEquals", function(value, element, arg){
	if(value == 0 || value==' ') {
		return false
	} else {
		return true
	}
}, "Value must not equal arg.");

//validation for promotion form
$('#leave_for_absent_form').submit(function(e) {
		e.preventDefault();
	}).validate({
		rules: {
			lfa_orgList: { valueNotEquals:true, },
			lfa_orgUnitList: { valueNotEquals:true, },
			lfa_shift_name_list: { valueNotEquals: true, }, 
			lfa_leave_type: { valueNotEquals: true,  }, 
			start_day: { valueNotEquals: true, },
			lfa_end_day: { valueNotEquals: true,},
		},
		//For custom messages
		messages: {
			lfa_orgList: { valueNotEquals: "The field is required", },
			lfa_orgUnitList: { valueNotEquals: "The field is required", },
			lfa_shift_name_list: { valueNotEquals: "The field is required", },
			lfa_leave_type: { valueNotEquals: "The field is required", },
			start_day: { valueNotEquals: "The field is required", },
			lfa_end_day: { valueNotEquals: "The field is required", },
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
function leave_for_absent_form_validation()
{
	return $('#leave_for_absent_form').valid();
}