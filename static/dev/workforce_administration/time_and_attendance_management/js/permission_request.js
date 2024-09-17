$('#request_allowed').keypress(function(event) {
	$('.errormessage').html("")
	$('#request_allowed-error').html("")
	if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57) && event.which !=8) {
	    event.preventDefault();
	    $($(this)["0"].nextSibling.nextSibling).append("<div class='error'>This Field Should be in float</div>");
		  return false;
	}
	// this part is when left part of number is deleted and leaves a . in the leftmost position. For example, 33.25, then 33 is deleted
	  $('#request_allowed').keyup(function(eve) {
	    if ($(this).val().indexOf('.') == 0) {
	      $(this).val($(this).val().substring(1));
	    }
	  });
});

$('#permission_per_day').keypress(function(event) {
	$('.errormessage').html("")
	$('#permission_per_day-error').html("")
	if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)&& event.which !=8) {
	    event.preventDefault();
	    $($(this)["0"].nextSibling).append("<div class='error'>This Field Should be in float</div>");
		  return false;
	}
	// this part is when left part of number is deleted and leaves a . in the leftmost position. For example, 33.25, then 33 is deleted
	  $('#permission_per_day').keyup(function(eve) {
	    if ($(this).val().indexOf('.') == 0) {
	      $(this).val($(this).val().substring(1));
	    }
	  });
});

var perm_req_def_table;
var rowclickstatus = false;
var permission_details_id = '';
columns = [{'title':'No'},{'title':'ID','visible':false},{'title':'Employee WorkTime'},{'title':'Organization Name'},{'title':'Division'},{'title':'Permission Period'},{'title':'Permission Request per month'}];

var current_date;
function permission_request (){
	$("#hoursBox").DateTimePicker({
	    dateFormat: "dd-MMM-yyyy"
	});
	permission_request_clear()
	permission_view('')
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
}

function ajaxCall(url,data,type,async){
	var status = false;
	$.ajax({
		url:url,
		type:type,
		data:data,
		async:async,
		success:function(json_data){
			if(json_data.status=='NTE_01'){ alert_lobibox("success", sysparam_datas_list[json_data.status]);}
			else if(json_data.status=='NTE_02'){ alert_lobibox("error", sysparam_datas_list[json_data.status]);}
			else if(json_data.status=='NTE_03'){ alert_lobibox("success", sysparam_datas_list[json_data.status]);}
			else if(json_data.status=='NTE_04'){ alert_lobibox("success", sysparam_datas_list[json_data.status]);}
			else if(json_data.status=='001'){ alert_lobibox("info","Session Expired");}
			else{ alert_lobibox("error", sysparam_datas_list["ERR0034"]);}
			status = true;
		},
		error: function (jqXHR, exception) {
			status = false;
		},
	})
	return status;
}

function permission_request_button_show(action_name){
    $("#permission_request_btn").html('');
    var btnstr = '';
    var access_for_create = jQuery.inArray( "Permission Request", JSON.parse(localStorage.Create) );
    var access_for_write = jQuery.inArray( "Permission Request", JSON.parse(localStorage.Write) );
    var access_for_delete = jQuery.inArray( "Permission Request", JSON.parse(localStorage.Delete) );
    if (action_name == 'add') {
        if (access_for_create != -1){
            btnstr +='<button type="button" class="btn btn-success btn-eql-wid btn-animate margin-right-3" id="permission_request_save" onclick="permission_request_data_exist();">Add</button>';
        }
        btnstr += '<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-3" id="permission_request_clear" onclick="permission_request_clear();">Cancel / Clear</button>';
    } else if (action_name == 'update') {
        if (access_for_write != -1){
            btnstr += '<button type="button" class="btn btn-primary btn-eql-wid btn-animate margin-right-3" id="permission_request_update" onclick="permission_request_data_exist()"";><i class="fa fa-green"></i> Update</button>';
        }
        if (access_for_delete != -1){
            btnstr +='<button type="button" class=" btn btn-danger btn-eql-wid btn-animate margin-right-3" id="permission_request_delete" onclick="permission_request_delete();">Remove</button>';
        }
        btnstr += '<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-3" id="permission_request_clear" onclick="permission_request_clear();">Cancel / Clear</button>';
    }
    $("#permission_request_btn").append(btnstr);
}


//Validation for Drop Data
$.validator.addMethod("valueNotEquals", function(value, element, arg){
	if(value == 0) {
		return false
	} else {
		return true
	}
}, "Value must not equal arg.");


//validation for promotion form
$('#permission_request_form').submit(function(e) {
		e.preventDefault();
	}).validate({
		rules: {
			orgList: { valueNotEquals:true, }, 
			orgUnitList: { valueNotEquals:true, }, 
			shift_name_list: { valueNotEquals:true, },
			permission_apply: { valueNotEquals:true,},
			permission_period: { valueNotEquals:true,},
			request_allowed: { required: true, },
			permission_per_day: { required: true, },
			max_hours_allowed: { required: true, },
		},
		//For custom messages
		messages: {
			orgList: { valueNotEquals: "The organization  is required", },
			orgUnitList: { valueNotEquals: "The organization unit is required", },
			shift_name_list: { valueNotEquals: "The shift name is required", },
			permission_apply: { valueNotEquals: "The permission apply is required", },
			permission_period: { valueNotEquals: "The permission period is required", },
			request_allowed: { required: "The request allowed is required", },
			permission_per_day: { required: "The permission per day is required", },
			max_hours_allowed: { required: "The maximum hours allowed is required", },
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
function permission_request_form_validation(){
	return $('#permission_request_form').valid();
}
function permission_request_clear(){
	document.forms['permission_request_form'].reset();
	$('.errormessage').html('');
	$('#orgList').val('0').trigger("change");
	$('#orgUnitList').val('').trigger("change");
	$('#divisionList').val('').trigger('change');
	$('#shift_name_list').val('0').trigger('change');
	$('#permission_apply').val('0').trigger("change");
	$('#permission_period').val('0').trigger("change");
	permission_request_button_show('add')
	$('.errormessage').html('')
	permission_details_id = ''
	$('#permission_details_master_table tbody tr').removeClass('selected');
	$('#max_hours_allowed').val('')
	$(".date_input_class").trigger('change');
}


function permission_request_save(data_division_id,permission_request_id){
	division_id = $("#divisionList").val();
	shift_name_list = $("#shift_name_list").val();
	permission_apply = $("#permission_apply").val();
	permission_period = $("#permission_period").val();
	request_allowed = $("#request_allowed").val();
	permission_per_day = $("#permission_per_day").val();
	max_hours_allowed = $("#max_hours_allowed").val();
	var status=permission_request_form_validation();
	if(status)
	{
	var data = {'division_id_list':JSON.stringify(division_id),'shift_name_list' : shift_name_list,
			'permission_apply' : permission_apply,'permission_period' : permission_period,
			'request_allowed' : request_allowed, 'permission_per_day' : permission_per_day , 
			'max_hours_allowed' : max_hours_allowed,'data_division_id':JSON.stringify(data_division_id),
			'permission_request_id':JSON.stringify(permission_request_id),csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()}
	var url = '/permission_request_add/';
	var type = 'POST';
	var async = false;
	returnData = ajaxCall(url,data,type,async);
	if(returnData){
		permission_view('');
		permission_request_clear();
	}
	}else  {  alert_lobibox("info","Fill all the fields");  }
}

function permission_request_update(data_division_id,permission_request_id){
	division_id = $("#divisionList").val();
	shift_name_list = $("#shift_name_list").val();
	permission_apply = $("#permission_apply").val();
	permission_period = $("#permission_period").val();
	request_allowed = $("#request_allowed").val();
	permission_per_day = $("#permission_per_day").val();
	max_hours_allowed = $("#max_hours_allowed").val();
	var status=permission_request_form_validation();
	if(status)
	{
	var data = {'division_id_list':JSON.stringify(division_id),'permission_id':permission_details_id,'shift_name_list' : shift_name_list,
	'permission_apply' : permission_apply,'permission_period' : permission_period,'request_allowed' : request_allowed, 
	'permission_per_day' : permission_per_day , 'max_hours_allowed' : max_hours_allowed,
	'data_division_id':JSON.stringify(data_division_id),'permission_request_id':JSON.stringify(permission_request_id),
	csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()}
	
	var url = '/permission_request_update/';
	var type = 'POST';
	var async = false;
	returnData = ajaxCall(url,data,type,async);
	if(returnData){
		permission_view('');
		permission_request_clear();
	}
	}else  {  alert_lobibox("info","Fill all the fields");  }
}

function permission_request_delete(){
	removeConfirmation('permission_request_remove',permission_details_id,'Permission Request');
}

function permission_request_remove(){
	var data = {'permission_id':permission_details_id,csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()};
	var url = '/permission_request_delete/';
	var type = 'POST';
	var async = false;
	returnData = ajaxCall(url,data,type,async);
	if(returnData){
		permission_request_clear();
		permission_view('')
	}
}

function permission_view(permission_details_id){
	$.ajax({
		type:'GET',
		url: '/permission_request_view/',
		data: {'permission_details_id':permission_details_id},
		async : false,
		success: function (json_data){
			org_id = $("#orgList").val();
			org_unit_id = $("#orgUnitList").val();
			division_id = $('#divisionList').val();
			shift_id = $("#shift_name_list").val();
			if(json_data['permission_details']!=undefined){
				org_id = unique($.merge(unique(json_data['permission_details'].map(a=>parseInt(a.org_id))),(org_id!=null && org_id!='0') ? org_id : []));
				org_unit_id = unique($.merge(unique(json_data['permission_details'].map(a=>parseInt(a.org_unit_id))),(org_unit_id!=null && org_unit_id!='0') ? org_unit_id : []));
				division_id = unique($.merge(unique(json_data['permission_details'].map(a=>parseInt(a.team_id))),(division_id!=null && division_id!='0') ? division_id : []))
				shift_id = unique($.merge(unique(json_data['permission_details'].map(a=>parseInt(a.emp_shift_id))),(shift_id!=null && shift_id!='0') ? shift_id : []))
				$("#orgList").val(org_id).trigger('change');
				$("#orgUnitList").val(org_unit_id).trigger('change');
				$("#divisionList").val(division_id).trigger('change');
				$("#shift_name_list").val(shift_id).trigger('change');
				$("#permission_apply").val(json_data['permission_details'][0]['perm_period_id']).trigger('change.select2');
				$("#permission_period").val(json_data['permission_details'][0]['perm_start_month']).trigger('change.select2');
				$("#request_allowed").val(json_data['permission_details'][0]['perm_request_count']);
				$("#permission_per_day").val(json_data['permission_details'][0]['perm_request_per_day']);
				$("#max_hours_allowed").val(json_data['permission_details'][0]['perm_max_hour']);
				permission_request_button_show('update');
				$(".date_input_class").trigger('change');
			}
			plaindatatable_btn('permission_details_master_table',json_data['return_data'], columns,[],'NEXT_TRANSFORM_HCMS_DOW_EMPLOYEE_PERMISSION_REQUEST_DETAILS_'+current_date);
		},
	})
}

function permission_request_data_exist(){
	$.ajax({
		type:'GET',
		url: '/permission_request_details_check/',
		async : false,
		data  : {'shift_id':$('#shift_name_list').val(),'division_id':JSON.stringify($('#divisionList').val()),'click_id':permission_details_id},
		success: function (json_data){
			var data=json_data.permission_request_exist;
			if(data.length!=0){
				division_id = unique(data.map(a=>parseInt(a.division_id)))
				permission_request_id = unique(data.map(a=>parseInt(a.id)))
				division_name = unique(data.map(a=>a.team_name))
				shift_id = unique(data.map(a=>parseInt(a.shift_id)))
				shift_name = unique(data.map(a=>a.shift_name))
				AddConfirmationPermissionRequest(division_id,division_name,shift_id,shift_name,permission_request_id)
			}
			else{
				if(permission_details_id!=''){
					permission_request_update(); 
				}
				else{
					permission_request_save();
				}
			}
		},
	})
	return false;
}

$('#orgList').change(function(){
	var str_org_id=$('#orgList  option:selected').val();
	$('#divisionList').html("")
	if(str_org_id!='0' && str_org_id!=''){
		$.ajax({
			type:'GET',
			url: '/shift/org_unit_fetch/',
			data  : { 'str_org_id':str_org_id },
			async : false,
			success: function (json_data){
				var data=json_data;
				$('#orgUnitList').html('');
				$('#orgUnitList').val('').trigger("change");
//				$('#orgUnitList').append($('<option>', {
//	                    value :'0',
//	                    text :'--Select--'
//				 }));
				if(data){
					var data_len=data.org_unit.length;
					if(data_len>=1){  
						for(var i=0;i<data_len;i++){   
							$('#orgUnitList').append($('<option>', {
			                    value : data.org_unit[i].id,
			                    text : data.org_unit[i].orgunit_name,
			                }));
						}
					}
					else{ $('#orgUnitList').val('').trigger("change"); }
				}
				else{ $('#orgUnitList').val('').trigger("change"); }
			},
		})	
	}
	else {
		$('#orgUnitList').html('')
//		$('#orgUnitList').append($('<option>', {
//            value :'0',
//            text :'-Select-'
//	 }));
	$('#orgUnitList').val(''); }
});

$('#orgUnitList').change(function(){
	$('.errormessage').html('')
	var org_unit_id=$('#orgUnitList').val();
//	$('#shift_name_list').html('');
//	$('#shift_name_list').append($('<option>', {
//            value :'0',
//            text :'--Select--'
//	 }));
	if(org_unit_id!=null)
	{
		$.ajax({
			type:'GET',
			url: '/shift_dropdown/',
			async : false,
			data  : {'org_unit_id':JSON.stringify(org_unit_id)},
			success: function (json_data){
				var division_id_list = $('#divisionList').val();
				$('#divisionList').html('')
				if(json_data.status=="NTE_01"){
					var division_len=json_data.division_details.length;
					if(division_len>=1){  
						for(var i=0;i<division_len;i++){   
							$('#divisionList').append($('<option>', {
			                    value : json_data.division_details[i].id,
			                    text : json_data.division_details[i].name,
			                }));
						}
						if(division_id_list!='' && division_id_list!=null){
							$("#divisionList").val(division_id_list).trigger("change");
						}
					}
					else{
						$('#divisionList').val('').trigger("change");
					}
					
				}
				else{ 
					$('#divisionList').val('').trigger("change");
				}
			},
		})	
	}
	else {
		$('#divisionList').html('');
	}
	
})

$('#divisionList').change(function(){
	$('.errormessage').html('')
	division_id = $('#divisionList').val()
	if(division_id!=''){
	$.ajax({
			type:'GET',
			url: '/shift/shift_fetch/',
			async : false,
			data  : {'division_id':JSON.stringify(division_id)},
			success: function (json_data){
				
				$('#shift_name_list').html('')
				$('#shift_name_list').append($('<option>', {
	                    value :'0',
	                    text :'--Select--'
				 }));
				if(json_data.status=="NTE_01"){
					var shift_len=json_data.shift_details.length;
					
					if(shift_len>=1){  
						for(var i=0;i<shift_len;i++){   
							$('#shift_name_list').append($('<option>', {
			                    value : json_data.shift_details[i].id,
			                    text : json_data.shift_details[i].shift_name,
			                }));
						}
					}
					else{
						$('#shift_name_list').val('0').trigger("change.select2");
					}
				}
				else{ 
					$('#shift_name_list').val('0').trigger("change.select2"); 
				}
			},
		})
	}
	else {
		$('#shift_name_list').html('');
	}
})

//$('#orgUnitList').change(function(){
//	var org_unit_id=$('#orgUnitList  option:selected').val();
//	if(org_unit_id!='0' && org_unit_id!=''){
//		$.ajax({
//			type:'GET',
//			url: '/shift_dropdown/',
//			data  : { 'org_unit_id':org_unit_id},
//			async : false,
//			success: function (json_data){
//				var data=json_data;
//				$('#shift_name_list').html('');
//				$('#shift_name_list').append($('<option>', {
//	                    value :'0',
//	                    text :'--Select--'
//				 }));
//				if(data)
//				{
//					var data_len=data.shift_details.length;
//					if(data_len>=1)
//					{  
//						for(var i=0;i<data_len;i++)
//						{   
//							$('#shift_name_list').append($('<option>', {
//			                    value : data.shift_details[i].id,
//			                    text : data.shift_details[i].shift_name,
//			                }));
//						}
//					}
//					else{ $('#shift_name_list').val('0').trigger("change"); }
//				}
//				else{ $('#shift_name_list').val('0').trigger("change"); }
//			},
//		})	
//	}
//	else {
//		$('#shift_name_list').html('');
//		$('#shift_name_list').append($('<option>', {
//            value :'0',
//            text :'--Select--'
//	 }));
//	$('#shift_name_list').val('0').trigger("change"); }
//});

$('#shift_name_list').change(function(){
	var shift_name_id = $('#shift_name_list').val();
//	if(shift_name_id!='0' && shift_name_id!=''){
//		$.ajax({
//			type:'GET',
//			url: '/shift_change_details/',
//			data  : { 'shift_name_id':shift_name_id },
//			async : false,
//			success: function (json_data){
//				if(json_data['shift_change']!=undefined){
////					for(var i=0;i<json_data.shift_change.length;i++){   
////						$('#divisionList').append($('<option>', {
////		                    value : json_data.shift_change[i].division_id,
////		                    text : json_data.shift_change[i].name,
////		                }));
////					}
//					if( permission_details_id == '' || permission_details_id == undefined || rowclickstatus == false){
//						var division_id = unique(json_data.shift_change.map(a=>parseInt(a.division_id)))
//					    $('#divisionList').val(division_id).trigger('change.select2');
//					}
//					else{
////						if(json_data['shift_details'].length!=0){
//							rowclickstatus = false;
////							$("#permission_apply").val(json_data['shift_details'][0]['perm_period_id']).trigger('change.select2');
////							$("#permission_period").val(json_data['shift_details'][0]['perm_start_month']).trigger('change.select2');
////							$("#request_allowed").val(json_data['shift_details'][0]['perm_request_count']);
////							$("#permission_per_day").val(json_data['shift_details'][0]['perm_request_per_day']);
////							$("#max_hours_allowed").val(json_data['shift_details'][0]['perm_max_hour']);
////							permission_request_button_show('update');
////						}
////						else{
////							$("#permission_apply").val("0").trigger('change');
////							$("#permission_period").val("0").trigger('change');
////							$("#request_allowed").val("");
////							$("#permission_per_day").val("");
////							$("#max_hours_allowed").val("");
////							permission_request_button_show('add');
////						}
//					}
//				}
//				else{
//					$('#shift_name_list').val('0').trigger("change.select2");
//				}
//			},
//		})	
//	}
//	else{
//		$('#shift_name_list').val('0').trigger("change.select2");
//	}
})


$("#permission_details_master_table").on("click", "tr", function() { 
	$('.errormessage').html('')
	$("#orgList").val('0').trigger('change');
	$("#orgUnitList").val('').trigger('change');
	$("#divisionList").val('').trigger('change');
	$("#shift_name_list").val('0').trigger('change');
	rowclickstatus = true;
	dataTableAcitveRowAdd('permission_details_master_table',$(this).index());
	if (!this.rowIndex) return; // skip first row
	permission_details_id = $('#permission_details_master_table').dataTable().fnGetData(this)[1];
	permission_view(permission_details_id);
	permission_request_button_show('update');
});

function unique(list) {
    var result = [];
    $.each(list, function(i, e) {
        if ($.inArray(e, result) == -1) result.push(e);
    });
    return result;
}

//Add Employee Mapping confirmation function 
function AddConfirmationPermissionRequest(action_id,action_name,shift_id,shift_name,permission_request_id) {
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
			if(permission_details_id!=''){
				permission_request_update(action_id,permission_request_id);

			}
			else{
				permission_request_save(action_id,permission_request_id);
			}			
		}
	});
	
}