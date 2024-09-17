var columnsShiftDetail=[{'title':'Id','visible':false},{'title':'No'},{'title':'Organization Name'},{'title':'WorkTime'},{'title':'Start Time'},{'title':'End Time'}];
var ti_role_def_table;
var shift_details_id;
var employee_name_id;
var shift_employee_id;
var organization;
var organization_unit;
var division;
shiftDetailView('')
var current_date;
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
function employee_mapping_button_show(action_name){
    $("#group_employee_mapping_btn").html('');
    var btnstr = '';
    var access_for_create = jQuery.inArray( "Work Time Management", JSON.parse(localStorage.Create) );
    var access_for_write = jQuery.inArray( "Work Time Management", JSON.parse(localStorage.Write) );
    var access_for_delete = jQuery.inArray( "Work Time Management", JSON.parse(localStorage.Delete) );
    if (action_name == 'add') {
        if (access_for_create != -1){
            btnstr +='<button type="button" class="btn btn-success btn-eql-wid btn-animate margin-right-3" id="employee_mapping_save" onclick="group_employee_mapping_save_confirmation();">Add</button>';
        }
        btnstr += '<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-3" id="employee_mapping_clear" onclick="group_employee_mapping_cancel();">Cancel / Clear</button>';
    } else if (action_name == 'update') {
        if (access_for_write != -1){
            btnstr += '<button type="button" class="btn btn-primary btn-eql-wid btn-animate margin-right-3" id="employee_mapping_updates" onclick="group_employee_mapping_update_confirmation()"";><i class="fa fa-green"></i> Update</button>';
        }
        if (access_for_delete != -1){
            btnstr +='<button type="button" class=" btn btn-danger btn-eql-wid btn-animate margin-right-3" id="employee_mapping_delete" onclick="group_employee_mapping_remove_confirmation();">Remove</button>';
        }
        btnstr += '<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-3" id="employee_mapping_clear" onclick="group_employee_mapping_cancel();">Cancel / Clear</button>';
    }
    $("#group_employee_mapping_btn").append(btnstr);
}
function group_employee_mapping_save_confirmation(){
	var employee_name = $("#employee_name").val();
	var status=employee_mapping_form_validation();
	if(status){
	$.ajax({
		url:'/employeeMappingEmployeeExist/',
		type:'GET',
		data:{'employee_name':JSON.stringify(employee_name)},
	}).done(function(json_data){
		if(json_data.status=='NTE_01'){
			employee_data_name = json_data['employee_name'].map(a=>a.name) 
			employee_data_id = json_data['employee_name'].map(a=>(a.id).toString())
			AddConfirmationEmployeeMapping('group_employee_mapping_save',employee_data_name,employee_data_id) }
		else { group_employee_mapping_save(); }
	})
	
	}
}

function group_employee_mapping_save(confirm,employee_name_common){
	var shift_name = $("#shift_name_list").val();
	var employee_name = $("#employee_name").val();
	var status=employee_mapping_form_validation();
	var employeeStatus;
	var employee_list_common = []
	if(status){
		if(confirm){
			employeeStatus = employee_mapping_form_validation();
			if(employeeStatus!=undefined && employeeStatus){
				data = {'shift_name':shift_name,'employee_name':JSON.stringify(employee_name),'employee_name_common':JSON.stringify(employee_name_common),csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()}
			}
		}
		else{
			employeeStatus = employee_mapping_form_validation();
			if(employee_name_common!=undefined){
				$.each(employee_name, function(index, value){
					if(!(jQuery.inArray(value, employee_name_common)>-1)){
						employee_list_common.push(value) 
				    }
				});
			}
			else{
				employee_list_common = employee_name
			}
			if(employee_list_common.length==0){
				$("#employee_name").val("").trigger('change');
				employeeStatus = employee_mapping_form_validation();
			}
			if(employeeStatus!=undefined && employeeStatus){
				data = {'shift_name':shift_name,'employee_name':JSON.stringify(employee_list_common),csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()}
			}
			
		}
		if(employeeStatus!=undefined && employeeStatus){
			$.ajax({
				url:'/employee_mapping_save/',
				type:'POST',
				data:data,
			}).done(function(json_data){
				if(json_data.status=='NTE_01'){  alert_lobibox("success", sysparam_datas_list[json_data.status]); group_employee_mapping_cancel(); shiftDetailView('');}
				else if(json_data.status=='NTE_00'){ alert_lobibox("info",sysparam_datas_list["ERR0033"]); }
				else if(json_data.status=='NTE_02'){ alert_lobibox("failed", sysparam_datas_list[json_data.status]); }
				else if(json_data.status=='NTE_03'){ alert_lobibox("success", sysparam_datas_list[json_data.status]);  group_employee_mapping_cancel(); shiftDetailView('');}
				else if(json_data.status=='NTE_04'){ alert_lobibox("success", sysparam_datas_list[json_data.status]);  group_employee_mapping_cancel(); shiftDetailView('');}
				else { alert_lobibox("No Data Found", sysparam_datas_list["ERR0034"]); }
			})
		} 
		else  {  alert_lobibox("info","Fill all the fields");  }
	}else  {  alert_lobibox("info","Fill all the fields");  }
	
}

function group_employee_mapping_remove_confirmation(){ 
	removeConfirmation('group_employee_mapping_remove',shift_name,$('#shift_name_list option:selected').text());
}

function group_employee_mapping_remove(){
	var shift_name = $("#shift_name_list").val();
	$.ajax({
		url:'/employeeMappingDelete/',
		type:'POST',
		data:{'shift_name':shift_name,csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()},
	}).done(function(json_data){
		if(json_data.status=='NTE_01'){  alert_lobibox("success", sysparam_datas_list[json_data.status]);}
		else if(json_data.status=='NTE_00'){ alert_lobibox("info",sysparam_datas_list["ERR0033"]); }
		else if(json_data.status=='NTE_02'){ alert_lobibox("failed", sysparam_datas_list[json_data.status]); }
		else if(json_data.status=='NTE_03'){ alert_lobibox("success", sysparam_datas_list[json_data.status]); }
		else if(json_data.status=='NTE_04'){ alert_lobibox("success", sysparam_datas_list[json_data.status]);
		shiftDetailView(''); group_employee_mapping_cancel();
		}
		else { alert_lobibox("No Data Found", sysparam_datas_list["ERR0034"]); }
	})
}

function unique(list) {
    var result = [];
    $.each(list, function(i, e) {
        if ($.inArray(e, result) == -1) result.push(e);
    });
    return result;
}

function shiftDetailView(shift_name_list_id){
//	shift_employee_id = [];
	$.ajax({
		url:'/employeeMappingView/',
		type:'GET',
		data:{'shift_name_id':shift_name_list_id},
	}).done(function(json_data){
		shift_employee_id = $("#employee_name").val();
		organization = $("#orgList").val();
		organization_unit = $("#orgUnitList").val();
		division = $("#division_name_list").val();
		if(json_data['shift_employee_id']!=undefined){
			shift_employee_id = unique($.merge(unique(json_data['shift_employee_id'].map(a=>parseInt(a.id))),(shift_employee_id!=null && shift_employee_id!='0') ? shift_employee_id : []))
			organization = unique($.merge(unique(json_data['shift_employee_id'].map(a=>parseInt(a.org_id_id))),(organization!=null && organization!='0') ? organization : []))
			organization_unit = unique($.merge(unique(json_data['shift_employee_id'].map(a=>parseInt(a.org_unit_id))),(organization_unit!=null && organization_unit!='0') ? organization_unit : []))
			division = unique($.merge(unique(json_data['shift_employee_id'].map(a=>parseInt(a.team_name_id))),(division!=null && division!='0') ? division : []))
//			role = unique(json_data['shift_employee_id'].map(a=>a.role_id_id))
			if(json_data['shift_employee_id'].length!=0){
				$('#orgList').val(organization).trigger("change");
				$('#orgUnitList').val(organization_unit).trigger("change");
//				$('#role_name_list').val(role).trigger("change");
				$('#division_name_list').val(division).trigger('change');
				$("#employee_name").val(shift_employee_id).trigger('change.select2');
				$("#shift_name_list").val(shift_name_list_id).trigger('change.select2');
				employee_mapping_button_show('update')
			}
			else{
//				$('#role_name_list').val("").trigger("change.select2");
				$('#division_name_list').val(division).trigger('change');
				$("#shift_name_list").val(shift_name_list_id).trigger('change.select2');
				$("#employee_name").val(shift_employee_id).trigger('change.select2');
				employee_mapping_button_show('add')
			}
		}
		else{
			shift_employee_id = ''
			plaindatatable_btn('shift_details_master_table', json_data.shift_detail, columnsShiftDetail,[],'NEXT_TRANSFORM_HCMS_DOW_EMPLOYEE_MAPPING_DETAILS_'+current_date);
//			$('#role_name_list').val("").trigger("change.select2");
			$('#division_name_list').val(division).trigger('change');
			$("#shift_name_list").val(shift_name_list_id).trigger('change.select2');
			$("#employee_name").val(shift_employee_id).trigger('change.select2');
			employee_mapping_button_show('add')
		}
		
			
	})
}

$("#shift_name_list").change(function(){
	$('.errormessage').html('')
	shift_details_id = $("#shift_name_list").val()
	shiftDetailView(shift_details_id)
})

$('#role_name_list').change(function(){
	var js;
	role_id = $('#role_name_list').val()
	$.ajax({
		url:'/employeeMappingRoleView/',
		type:'GET',
		data:{'role_id':JSON.stringify(role_id)},
	}).done(function(json_data){
		if(json_data.status=='NTE_01'){ 
			if(json_data['employee_details'].length!=0){
				$('#employee_name').html("")
				for(var i=0;i<json_data['employee_details'].length;i++){
					$('#employee_name').append($('<option>', {
	                    value : json_data.employee_details[i].id,
	                    text : json_data.employee_details[i].name,
	                }));
				}
				js = json_data['employee_details'].map(a=>a.id) 
				$("#employee_name").val(js).trigger('change.select2') 
			}
			else{
				$("#employee_name").val("").trigger('change.select2') 
			}
		}
		else{
			$("#employee_name").val("").trigger('change.select2') 
		}
	})
})

$('#orgList').change(function(){
	$('.errormessage').html('')
	orgId = $('#orgList').val()
	$.ajax({
			type:'GET',
			url: '/shift/org_unit_fetch/',
			async : false,
			data  : {'str_org_id':orgId},
			success: function (json_data){
				$('#orgUnitList').html('')
//				$('#orgUnitList').append($('<option>', {
//	                    value :'0',
//	                    text :'--Select--'
//				 }));
				if(json_data)
				{
					var data_len=json_data.org_unit.length;
					if(data_len>=1)
					{  
						for(var i=0;i<data_len;i++)
						{   
							$('#orgUnitList').append($('<option>', {
			                    value : json_data.org_unit[i].id,
			                    text : json_data.org_unit[i].orgunit_name,
			                }));
						}
					}
					else{ $('#orgUnitList').val('0').trigger("change.select2"); }
				}
				else{ $('#orgUnitList').val('0').trigger("change.select2"); }
			},
		})
})

$('#orgUnitList').change(function(){
	$('.errormessage').html('')
	orgUnitId = $('#orgUnitList').val()
	$.ajax({
			type:'GET',
			url: '/employeeMappingDivisionFetch/',
			async : false,
			data  : {'org_unit_id':JSON.stringify(orgUnitId)},
			success: function (json_data){
				$('#division_name_list').html('')

				if(json_data.status=="NTE_01"){
					var division_len=json_data.division_details.length;
					console.log("division_len",division_len)
					if(division_len>=1){  
						for(var i=0;i<division_len;i++){   
							$('#division_name_list').append($('<option>', {
			                    value : json_data.division_details[i].id,
			                    text : json_data.division_details[i].name,
			                }));
						}
					}
					else{
						$('#division_name_list').val('').trigger("change.select2");
					}
					
				}
				else{ 
					$('#division_name_list').val('').trigger("change.select2");
				}
			},
		})
})

$('#division_name_list').change(function(){
	$('.errormessage').html('')
	division_id = $('#division_name_list').val()
	$.ajax({
			type:'GET',
			url: '/shift/shift_fetch/',
			async : false,
			data  : { 'division_id':JSON.stringify(division_id)},
			success: function (json_data){
				
				$('#shift_name_list').html('')
				$('#shift_name_list').append($('<option>', {
	                    value :'0',
	                    text :'--Select--'
				 }));
				$('#employee_name').html('')
//				$('#employee_name').append($('<option>', {
//	                    value :'0',
//	                    text :'--Select--'
//				 }));
				
				if(json_data.status=="NTE_01"){
					var shift_len=json_data.shift_details.length;
					var employee_len=json_data.employee_details.length;
					
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
					
					
					if(employee_len>=1){
						for(var i=0;i<employee_len;i++){   
							$('#employee_name').append($('<option>', {
			                    value : json_data.employee_details[i].id,
			                    text : json_data.employee_details[i].name,
			                }));
						}
						employee_name_id = json_data['employee_details'].map(a=>a.id) 
						$('#employee_name').val(employee_name_id).trigger("change.select2")
					}
					
					else{
						$('#employee_name').val('').trigger("change.select2");
					}
				}
				else{ 
					$('#shift_name_list').val('0').trigger("change.select2"); 
					$('#employee_name').val('').trigger("change.select2");
				}
			},
		})
})

function group_employee_mapping_update_confirmation(){
	var shift_details = $("#shift_name_list").val();
	var employee_name = $("#employee_name").val();
	var status=employee_mapping_form_validation();
	if(status){
	$.ajax({
		url:'/employeeMappingEmployeeExist/',
		type:'GET',
		data:{'shift_id':shift_details,'employee_name':JSON.stringify(employee_name)},
	}).done(function(json_data){
		if(json_data.status=='NTE_01'){
			employee_data_name = json_data['employee_name'].map(a=>a.name) 
			employee_data_id = json_data['employee_name'].map(a=>(a.id).toString())
			AddConfirmationEmployeeMapping('group_employee_mapping_update',employee_data_name,employee_data_id) }
		else { group_employee_mapping_update(); }
	})
	
	}
}

function group_employee_mapping_update(confirm,employee_name_common){   
	var shift_details = $("#shift_name_list").val();
	var shift_name = $("#shift_name_list").val();
	var employee_name = $("#employee_name").val();
	var status=employee_mapping_form_validation();
	var employee_list_common = []
	if(status){
		if(confirm){
			employeeStatus = employee_mapping_form_validation();
			if(employeeStatus!=undefined && employeeStatus){
				data = {'shift_details_id':shift_details,'shift_name':shift_name,'employee_name':JSON.stringify(employee_name),'employee_name_common':JSON.stringify(employee_name_common),csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()}
			}
		}
		else{
			employeeStatus = employee_mapping_form_validation();
			if(employee_name_common!=undefined){
				$.each(employee_name, function(index, value){
					if(!(jQuery.inArray(value, employee_name_common)>-1)){
						employee_list_common.push(value) 
				    }
				});
			}
			else{
				employee_list_common = employee_name
			}
			if(employee_list_common.length==0){
				$("#employee_name").val("").trigger('change.select2');
				employeeStatus = employee_mapping_form_validation();
			}
			if(employeeStatus!=undefined && employeeStatus){
				data = {'shift_details_id':shift_details,'shift_name':shift_name,'employee_name':JSON.stringify(employee_list_common),csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()}
			}
			
		}
		if(employeeStatus!=undefined && employeeStatus){
			$.ajax({
				url:'/employeeMappingUpdate/',
				type:'POST',
				data:data,
			}).done(function(json_data){
				if(json_data.status=='NTE_01'){  alert_lobibox("success", sysparam_datas_list[json_data.status]); }
				else if(json_data.status=='NTE_00'){ alert_lobibox("info",sysparam_datas_list["ERR0033"]); }
				else if(json_data.status=='NTE_02'){ alert_lobibox("failed", sysparam_datas_list[json_data.status]); }
				else if(json_data.status=='NTE_03'){ alert_lobibox("success", sysparam_datas_list[json_data.status]); shiftDetailView(''); group_employee_mapping_cancel()}
				else if(json_data.status=='NTE_04'){ alert_lobibox("success", sysparam_datas_list[json_data.status]); }
				else { alert_lobibox("No Data Found", sysparam_datas_list["ERR0034"]); }
			})
		} else  {  alert_lobibox("info","Fill all the fields");  }
	} else  {  alert_lobibox("info","Fill all the fields");  }
}

function group_employee_mapping_cancel(){

	$('#orgList').val('0').trigger('change');
	$('#orgUnitList').val('0').trigger('change');
	$('#division_name_list').val('').trigger("change");
	$("#shift_name_list").val("0").trigger('change.select2');
	$("#employee_name").val('').trigger('change.select2');
//	$('#role_name_list').val('').trigger('change.select2');
	$('.errormessage').html('');
	$('#shift_details_master_table tbody tr').removeClass('selected');
	employee_mapping_button_show('add')
}

$("#shift_details_master_table").on("click", "tr", function() { 
	dataTableAcitveRowAdd('shift_details_master_table',$(this).index());
	$('.errormessage').html('');
	group_employee_mapping_cancel();
	if (!this.rowIndex) return; // skip first row
	shift_details_id = $('#shift_details_master_table').dataTable().fnGetData(this)[0];
	shiftDetailView(shift_details_id);
});