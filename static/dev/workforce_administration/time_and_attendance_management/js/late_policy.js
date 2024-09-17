var current_date;
var rowclickstatus = false;
$(document).ready(function (){
	$("#time_grace,div_early_period,div_effective_from").DateTimePicker({  dateFormat: "dd-MMM-yyyy" });
	$("#organization_unit").select2({  placeholder: "Organization Unit" });
	$("#division").select2({  placeholder: "Division" });
	button_show('add')
	early_policy_details()
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
function early_policy()
{
	$("#time_grace,div_early_period,div_effective_from").DateTimePicker({  dateFormat: "dd-MMM-yyyy" });
}
$('#day_for_deduct,#total_late_comming,#early_deduct,#early_deduct_day').keypress(function(event) {
	$('.errormessage').html("")
	$('#day_for_deduct-error').html("")
	$('#total_late_comming-error').html("")
	$('#early_deduct-error').html("")
	$('#early_deduct_day-error').html("")
	if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57) && event.which !=8) {
		event.preventDefault();
		$($(this)["0"].nextSibling.nextSibling).append("<div class='error'>This Field Should be in float</div>");
		return false;
	}
	// this part is when left part of number is deleted and leaves a . in the leftmost position. For example, 33.25, then 33 is deleted
	$('#day_for_deduct,#total_late_comming,#early_deduct,#early_deduct_day').keyup(function(eve) {
		if ($(this).val().indexOf('.') == 0) {
			$(this).val($(this).val().substring(1));
		}
	});
});


$('#organization').change(function(){
	var str_org_id=$('#organization  option:selected').val();
	if(str_org_id!='0' && str_org_id!='')
	{
		$.ajax({
			type:'GET',
			url: '/shift/org_unit_fetch/',
			data  : { 'str_org_id':str_org_id},
			async : false,
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
							$('#organization_unit').val('').trigger("change");
						}
					}
					else{ $('#organization_unit').val('').trigger("change"); }
				}
				else{ $('#organization_unit').val('').trigger("change"); }
			},
		})	
	}
	else {
		$('#organization_unit').html('')
	}
});

$('#organization_unit').change(function(){
	var org_unit_id=$('#organization_unit').val();
	if(org_unit_id!=null)
	{
		$.ajax({
			type:'GET',
			url: '/shift_dropdown/',
			async : false,
			data  : {'org_unit_id':JSON.stringify(org_unit_id)},
			success: function (json_data){
				var division_id_list = $('#division').val();
				$('#division').html('')
				if(json_data.status=="NTE_01"){
					var division_len=json_data.division_details.length;
					if(division_len>=1){  
						for(var i=0;i<division_len;i++){   
							$('#division').append($('<option>', {
			                    value : json_data.division_details[i].id,
			                    text : json_data.division_details[i].name,
			                }));
						}
						if(division_id_list!='' && division_id_list!=null){
							$("#division").val(division_id_list).trigger("change");
						}
					}
					else{
						$('#division').val('').trigger("change");
					}
					
				}
				else{ 
					$('#division').val('').trigger("change");
				}
			},
		})	
	}
	else {
		$('#division').html('');
	}
});

$('#division').change(function(){
	$('.errormessage').html('')
	division_id = $('#division').val();
	if(division_id!=''){
	$.ajax({
			type:'GET',
			url: '/shift/shift_fetch/',
			async : false,
			data  : {'division_id':JSON.stringify(division_id)},
			success: function (json_data){
				
				$('#shift_name').html('')
				$('#shift_name').append($('<option>', {
	                    value :'0',
	                    text :'--Select--'
				 }));
				if(json_data.status=="NTE_01"){
					var shift_len=json_data.shift_details.length;
					
					if(shift_len>=1){  
						for(var i=0;i<shift_len;i++){   
							$('#shift_name').append($('<option>', {
			                    value : json_data.shift_details[i].id,
			                    text : json_data.shift_details[i].shift_name,
			                }));
						}
					}
					else{
						$('#shift_name').val('0').trigger("change");
					}
				}
				else{ 
					$('#shift_name').val('0').trigger("change"); 
				}
			},
		})
	}
	else {
		$('#shift_name').html('');
	}
})


$('#shift_name').change(function(){
	var shift_id=$('#shift_name').val()
//	$('#division').html('');
//	if(shift_id!='0')
//	{
//		$.ajax({
//			type:'GET',
//			url: '/fetch_late_policy_details_shift_change/',
//			data  : { 'shift_name_id':shift_id },
//			async : false,
//			success: function (json_data){
//				for(var i=0;i<json_data.shift_change.length;i++){   
//					$('#division').append($('<option>', {
//						value : json_data.shift_change[i].division_id,
//						text : json_data.shift_change[i].name,
//					}));
//				}
//				if( clicked_row_id == '' || clicked_row_id == undefined || rowclickstatus == false){
//					var division_id_id = unique(json_data.shift_change.map(a=>parseInt(a.division_id)))
//					$('#division').val(division_id_id).trigger('change.select2');
//				}
//				else{
//					rowclickstatus = false;
//				}
//			},
//		})	
//	}
//	else{
//		$('#division').html('');
//	}
});

function late_policy_data_exist(row_click_id){
	var policyStatus = false;
	$.ajax({
		type:'GET',
		url: '/early_policy_details_check/',
		async : false,
		data  : {'shift_id':$('#shift_name').val(),'division_id':JSON.stringify($('#division').val()),'click_id':row_click_id},
		success: function (json_data){
			var data=json_data.policy_data_exist;
			if(data.length!=0){
				division_id = unique(data.map(a=>parseInt(a.division_id)))
				policy_id = unique(data.map(a=>parseInt(a.id)))
				division_name = unique(data.map(a=>a.team_name))
				shift_id = unique(data.map(a=>parseInt(a.shift_id)))
				shift_name = unique(data.map(a=>a.shift_name))
				AddConfirmationLatePolicy(division_id,division_name,shift_id,shift_name,policy_id)
			}
			else{
				late_policy_save();
			}
		},
	})
	return policyStatus;
}

var clicked_row_id;
function late_policy_save(data_division_id,data_policy_id){
	var status = late_policy_form_validation();
	if(status){
		var str_organization_unit=$('#organization_unit  option:selected').val(); 
		var str_organization=$('#organization  option:selected').val();
		var str_shift_name=$('#shift_name option:selected').val();
		var grace_time=$('#grace_time').val();   
		var early_period=$('#early_period').val();
		var division_id_list = $('#division').val();
		var policy_period=$('#policy_period option:selected').val();  
		var effective_form=$('#effective_form').val();
		if(str_organization_unit!='0' && str_organization!='0' && str_shift_name!='' && policy_period!='0' && grace_time!='' && early_period!='')
		{   
			var load_data={'shift_name':str_shift_name,'policy_period':policy_period,'effective_form':effective_form,
					'grace_time':grace_time,'early_period':early_period,'division_id_list':JSON.stringify(division_id_list),
					'clicked_row_id':clicked_row_id,'data_division_id':JSON.stringify(data_division_id),'data_policy_id':JSON.stringify(data_policy_id),csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()}
			send_data('post',"/late_policy_save/",load_data)
		}	 
	}
	else  {  alert_lobibox("info","Fill all the fields");  }
}
//update function
function late_policy_update()
{
	late_policy_data_exist(clicked_row_id)

}
function early_policy_details()
{   
	$.ajax({
		type:'GET',
		url: '/early_policy_details/',
		success: function (json_data){
			var columns = [{"title":"hidden Id","visible": false},{"title":"No."},{"title":"Organization Name"},{"title":"WorkTime"},{"title":"Division"},{"title":"Early Grace Time"}, {"title":"Late Grace Time"}]
			var data=json_data.policy_data;
			var data_list=[]
			if(data.length>0){   
				var data_len=data.length
				for(var i=0;i<data_len;i++){
					data_list.push([data[i].id,i+1,data[i].org_name,data[i].shift_name,data[i].team_names,data[i].early_grace_time,data[i].late_grace_time]);
				}
				plaindatatable_btn('early_policy_table', data_list, columns,[],'NEXT_TRANSFORM_HCMS_DOW_EMPLOYEE_POLICY_DETAILS_'+current_date)
			}
			else {  plaindatatable_btn('early_policy_table', data_list, columns,[],'NEXT_TRANSFORM_HCMS_DOW_EMPLOYEE_POLICY_DETAILS_'+current_date); }
		},
	})	
}
//row clcik in datatable
$('#early_policy_table').on('click', 'tbody tr', function(){
	late_policy_cancel();
	$('.errormessage').html('');
	var arr=$('#early_policy_table').dataTable().fnGetData($(this)); 
	clicked_row_id=arr[0];
	var shift_id=$('#shift_name').val()
	dataTableAcitveRowAdd('early_policy_table',$(this).index());
	if(clicked_row_id!='')
	{    
		$.ajax({
			type:'GET',
			url: '/fetch_late_policy_details/',
			async:'false',
			data  : { 'policy_id':clicked_row_id },
			success: function (json_data){
				var data=json_data.fetch_data
				organization_id = $('#organization').val(); 
				org_unit_id = $('#organization_unit').val(); 
				division_id = $('#division').val();
				shift_id = $('#shift_name').val(); 
				if(data)
				{   
					shift_id = unique($.merge(unique(data.map(a=>parseInt(a.shift_id))),(shift_id!=null && shift_id!='0') ? shift_id : []))
					organization_id = unique($.merge(unique(data.map(a=>parseInt(a.organization_id))),(organization_id!=null && organization_id!='0') ? organization_id : []))
					org_unit_id = unique($.merge(unique(data.map(a=>parseInt(a.org_unit_id))),(org_unit_id!=null && org_unit_id!='0') ? org_unit_id : []))
					division_id = unique($.merge(unique(data.map(a=>parseInt(a.division_id))),(division_id!=null && division_id!='0') ? division_id : []))
					$('#organization').val(organization_id).trigger("change"); 
					$('#organization_unit').val(org_unit_id).trigger("change");
					$('#division').val(division_id).trigger("change");
					$('#shift_name').val(shift_id).trigger("change"); 
					$('#policy_period').val(data[0].policy_period_id).trigger("change");
					$('#effective_form').val(data[0].effective_from);
					$('#grace_time').val(data[0].late_grace_time);
					$('#early_period').val(data[0].early_grace_time);
					clicked_row_id=data[0].id
					button_show('update')
				}
				$(".date_input_class").trigger('change');

			},
		})	
	}
});

function late_policy_cancel()
{
	document.forms['late_policy_form'].reset();
	$('.errormessage').html('')
	$('#organization').val(0).trigger("change")
	$('#organization_unit').val('').trigger("change")
	$('#division').val('').trigger("change")
	$('#policy_period').val('0').trigger("change")
	$('#shift_name').val('0').trigger("change")
	$("#division").select2({  placeholder: "Division" });
	clicked_row_id = ''
	button_show('add');
	$('#grace_time,#early_period,#effective_form').val('');
	$('.date_input_class').trigger('change');
	$('#early_policy_table tbody tr').removeClass('selected');
}

function late_policy_remove_confirmation() {  removeConfirmation('late_policy_remove',clicked_row_id,'Late/Early Policy'); } //remove confirmation function

function late_policy_remove()
{
	if(clicked_row_id!='')
	{
		var load_data={"remove_id":clicked_row_id,csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()}	
		send_data('post',"/late_policy_remove/",load_data);
	}
}
//Ajax function
function send_data(url_type,url,data)
{  
	$.ajax(
			{
				type:url_type,
				url: url,
				data  : data,
				async : false,
				success: function (json_data){
					if(json_data.status=='NTE_01'){ alert_lobibox("success", sysparam_datas_list[json_data.status]); late_policy_cancel(); early_policy_details(); }
					else if(json_data.status=='NTE_02'){ alert_lobibox("error", sysparam_datas_list[json_data.status]); late_policy_cancel(); clicked_row_id=''}
					else if(json_data.status=='NTE_03'){ alert_lobibox("success", sysparam_datas_list[json_data.status]); late_policy_cancel(); early_policy_details(); clicked_row_id=''}
					else if(json_data.status=='NTE_04'){ alert_lobibox("success", sysparam_datas_list[json_data.status]); late_policy_cancel(); early_policy_details(); clicked_row_id=''}
					else if(json_data.status=='001'){ alert_lobibox("info","Session Expired");}
					else{ alert_lobibox("error", sysparam_datas_list["ERR0034"]); }
				},
			})	
}

//button show
function button_show(flag)
{   
	$("#early_policay_button").empty();
	if (flag=='add')
	{
		var btnstr = '<button type="button" class="btn btn-success btn-eql-wid btn-animate margin-right-3" id="late_policy_save" onclick="late_policy_data_exist();">Add</button>';
	}
	else
	{
		var btnstr = '<button type="button" class="btn btn-primary btn-eql-wid btn-animate margin-right-3" id="late_policy_updates" onclick="late_policy_update()"";><i class="fa fa-green"></i> Update</button>';
		btnstr += '<button type="button" class=" btn btn-danger btn-eql-wid btn-animate margin-right-3" id="late_policy_delete" onclick="late_policy_remove_confirmation();">Remove</button>';
	}
	btnstr += '<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-3" id="late_policy_clear" onclick="late_policy_cancel();">Cancel / Clear</button>';
	$("#early_policay_button").append(btnstr);	
}
//function button_show(action_name){
//$("#early_policay_button").html('');
//var btnstr = '';
//var access_for_create = jQuery.inArray( "Time Attendance", JSON.parse(localStorage.Create) );
//var access_for_write = jQuery.inArray( "Time Attendance", JSON.parse(localStorage.Write) );
//var access_for_delete = jQuery.inArray( "Time Attendance", JSON.parse(localStorage.Delete) );
//if (action_name == 'add') {
//if (access_for_create != -1){
//btnstr += '<button type="button" class="btn btn-success btn-eql-wid btn-animate margin-right-3" id="late_policy_save" onclick="late_policy_save();">Add</button>';
//}
//btnstr += '<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-3" id="late_policy_clear" onclick="late_policy_cancel();">Cancel / Clear</button>';
//} else if (action_name == 'update') {
//if (access_for_write != -1){
//btnstr += '<button type="button" class="btn btn-primary btn-eql-wid btn-animate margin-right-3" id="late_policy_updates" onclick="late_policy_update()"";><i class="fa fa-green"></i> Update</button>';
//}
//if (access_for_delete != -1){
//btnstr +='<button type="button" class=" btn btn-danger btn-eql-wid btn-animate margin-right-3" id="late_policy_delete" onclick="late_policy_remove_confirmation();">Remove</button>';
//}
//btnstr += '<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-3" id="late_policy_clear" onclick="late_policy_cancel();">Cancel / Clear</button>';
//}
//$("#early_policay_button").append(btnstr);
//}

//form validation
$.validator.addMethod("valueNotEquals", function(value, element, arg){
	if(value == 0) {
		return false
	} else {
		return true
	}
}, "Value must not equal arg.");

//validation for late policy form
$('#late_policy_form').submit(function(e) {
	e.preventDefault();
}).validate({
	rules: {
		organization: { valueNotEquals:true, },
		organization_unit: { valueNotEquals:true, },
		shift_name: { valueNotEquals: true, }, 
		grace_time: { required: true, }, 
		early_period: { required: true, },
		policy_period: { valueNotEquals:true, },

	},
	//For custom messages
	messages: {
		organization: { valueNotEquals: "The organization is required", },
		organization_unit: { valueNotEquals: "The organization unit is required", },
		shift_name: { valueNotEquals: "The shift name is required", },
		grace_time: { required: "The grace time is required", },
		early_period: { required: "The early period is required", },
		policy_period: { valueNotEquals: "The policy period is required", },
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
	ignore: [],
	onkeyup: false,
	onfocusout:false,
});
function late_policy_form_validation()
{
	return $('#late_policy_form').valid();
}

//Add Employee Mapping confirmation function 
function AddConfirmationLatePolicy(action_id,action_name,shift_id,shift_name,policy_id) {
	title = ''
		for(var i=0;i<action_name.length;i++){
			if(i<action_name.length-1){
				title = title + action_name[i] + ', '
			}
			else if(i==action_name.length-1){
				title = title + action_name[i]
			}

		}
	title = title + " of "+shift_name+" worktime is already allocated to another record.\n Do you want to update this record?"
	$('.popup_zindex').css({'z-index':'unset'});//search select btn zindex
	swal ({
		title: title,
		type: "warning",
		showCancelButton: true,
		confirmButtonClass: "btn btn-success btn-eql-wid btn-animate pull-left",
		cancelButtonClass: "btn btn-danger btn-eql-wid btn-animate pull-right",
		confirmButtonText: "Yes",
		cancelButtonText: "No",
		showConfirmButton : true,
		closeOnConfirm: true,
		closeOnCancel: true
	},
	function(isConfirm) {
		if(isConfirm){
			late_policy_save(action_id,policy_id);
		}
	});

}

function unique(list) {
	var result = [];
	$.each(list, function(i, e) {
		if ($.inArray(e, result) == -1) result.push(e);
	});
	return result;
}

function validation(id,value)
{  
   if(value!='') { $('#'+id).html('') }   
}