var assessment_schedule_detail_id='';
var employee_ids = [];
var rowClick = 0;
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
$(document).ready(function() {
	assessment_schedule_date_clear_cancel();
	assessment_schedule_datatable();
	$.ajax({
		type:"GET",
		url: "/pa_schedule_fetch/",
		data:{ csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()},
		async: false,
		success: function (json_data) {
			if(json_data.status=="Success")
			{   
				$('#assessment_schedule_div').empty();
				$('#schedule_div').show();
				var template=''
					var template='<div class="form-group col-md-12"><div class="form-group col-md-4"> <h3 class="res-hide-name">Assessment Target</h3></div><div class="form-group col-md-4"> <h3 class="res-hide-name">Scheduled Days</h3></div><div class="form-group col-md-4"> <h3 class="res-hide-name">Estimated Date</h3></div><div class="form-group col-md-4 objectives"><h3 class="desk-hide-names">Assessment Target</h3><label>Objective Settings</label></div><div class="form-group col-md-4"><h3 class="desk-hide-names">Scheduled Days</h3><input type="text" onkeypress="return IsNumeric(event)" ondrop="return false" onpaste="return false" class="form-control datefinder day_count" placeholder=" "  id="objective_setting_day_count"></div><div class="form-group col-md-4"><div class="col-md-12 input-icon padding-0 "><h3 class="desk-hide-names">Estimated Date</h3><i class="fa fa-calendar cicon icon_mar"></i> <input class="  form-control form-control-inline date-input-field  schedule_date_field" type="text" data-field="date" readonly="" id="objective_setting_start_date"><div id="schedule_start_date" class=" dtpicker-overlay dtpicker-mobile" style="display: none;"> <div class="dtpicker-bg"><div class="dtpicker-cont"><div class="dtpicker-content"><div class="dtpicker-subcontent"></div></div></div></div></div></div></div></div>'
						var schedule_list_data = json_data.schedule_list
						for(var i=0; i<schedule_list_data.length; i++){
							template+='<div class="form-group col-md-12 schedule_time_div"><div class="form-group col-md-4 objectives" ><h3 class="desk-hide-names">Assessment Target</h3><label class="schedule_label" id="'+schedule_list_data[i].id+'">'+schedule_list_data[i].refitems_name+'</label></div><div class="form-group col-md-4"><h3 class="desk-hide-names">Scheduled Days</h3><input id='+i+' type="text" onkeypress="return IsNumeric(event)" ondrop="return false" onpaste="return false" class=" form-control datefinder schedule_day_count day_count" placeholder=""></div><div class="form-group col-md-4"><div class=" col-md-12 input-icon padding-0"><h3 class="desk-hide-names">Estimated Date</h3><i class="fa fa-calendar cicon icon_mar"></i><input class="  form-control form-control-inline date-input-field schedule_date schedule_date_field" type="text" data-field="date" readonly="" id="date_'+i+'"><div id="schedule_start_date" class="  dtpicker-overlay dtpicker-mobile" style="display: none;"> <div class="dtpicker-bg"><div class="dtpicker-cont"><div class="dtpicker-content"><div class="dtpicker-subcontent"></div></div></div></div></div></div></div></div>'
						}
				$('#assessment_schedule_div').html(template)
			}
		}
	});       
	$('#schedule_start_date').DateTimePicker({
		dateFormat: "dd-MM-yyyy"

	});
	$(".datefinder").keyup(function(){
		var parent_id=$(this).parent().next().find('.date-input-field').attr('id')
		dateLoopChange(parent_id)
	});
	$('.schedule_date_field').on('change dp.change', function(e){
		var parent_id=$(this).attr('id')
		dateLoopChange(parent_id)
	})
	
	$("#assessment_org").change(function(){
		org_id = $("#assessment_org").val()
		if(org_id!=''){
			$.ajax({
				type:"GET",
				url: "/assessment_schedule_employee_org_unit/",
				data:{ 'org_id' :  org_id },
				async: false,
				success: function (json_data) {
					if(json_data.status=="NTE_01"){
						$("#assessment_orgunit").html("");
						$('#assessment_orgunit').append($('<option>', {
		                    value :'',
		                    text :''
						}));
						for(var i=0;i<json_data.organization_unit.length;i++){
							$('#assessment_orgunit').append($('<option>', {
								value :json_data.organization_unit[i].id,
								text : json_data.organization_unit[i].orgunit_name
							}));
						}
						$("#selected_employee").html("");
						for(var i=0;i<json_data.employee.length;i++){
							$('#selected_employee').append($('<option>', {
								value : json_data.employee[i].id,
								text : json_data.employee[i].name
							}));
						}
						if(employee_ids.length!=0){
							$('#selected_employee').val(employee_ids).trigger('change')
						}
						
					}
				}
			}); 
		}
	})
	
	$("#assessment_orgunit").change(function(){
		orgunit_id = $("#assessment_orgunit").val()
		if(orgunit_id!=''){
			$.ajax({
				type:"GET",
				url: "/assessment_schedule_employee_team/",
				data:{ 'orgunit_id' :  orgunit_id },
				async: false,
				success: function (json_data) {
						if(json_data.status=="NTE_01"){
							$("#assessment_dept").html("");
							$('#assessment_dept').append($('<option>', {
			                    value :'0',
			                    text :'--Select--'
						 }));
						for(var i=0;i<json_data.department.length;i++){
							$('#assessment_dept').append($('<option>', {
								value :json_data.department[i].id,
								text : json_data.department[i].name
							}));
						}
						$("#selected_employee").html("");
						for(var i=0;i<json_data.employee.length;i++){
							$('#selected_employee').append($('<option>', {
								value :json_data.employee[i].id,
								text : json_data.employee[i].name
							}));
						}
						if(employee_ids.length!=0){
							$('#selected_employee').val(employee_ids).trigger('change')
						}
					}
				}
			}); 
		}
	})
	
	$("#assessment_dept").change(function(){
		dept_id = $("#assessment_dept").val()
		if(dept_id!=''){
			$.ajax({
				type:"GET",
				url: "/assessment_schedule_employee/",
				data:{ 'dept_id' :  dept_id },
				async: false,
				success: function (json_data) {
						if(json_data.status=="NTE_01"){
						$("#selected_employee").html("");
						for(var i=0;i<json_data.employee.length;i++){
							$('#selected_employee').append($('<option>', {
								value : json_data.employee[i].id,
								text : json_data.employee[i].name
							}));
						}
						if(employee_ids.length!=0){
							$('#selected_employee').val(employee_ids).trigger('change')
						}
					}
				}
			});
		}
	})
});
function dateLoopChange(date_picker_id){
	parent_id=date_picker_id
	$('.datefinder').each(function(row, data){
		if(parent_id=='objective_setting_start_date'){
			if($(data).attr('id')=="objective_setting_day_count"){
				loop_date=$('#objective_setting_start_date').val();
				loop_day=$('#objective_setting_day_count').val();
			}
			else{
				loop_date=$(data).parent().next().find('.date-input-field').val()
				loop_day=$(data).val()
			}
		}
		else{
			loop_date_id=parent_id.split('_')
			if($(data).attr('id')>=loop_date_id[1] && $(data).attr('id')!="objective_setting_day_count"){
				loop_date=$(data).parent().next().find('.date-input-field').val()
				loop_day=$(data).val()
			}
			else{
				loop_date="Null"
				loop_day="Null"
			}
		}
		if(loop_date!="Null" && loop_day!="Null"){
			var loopresultDate = addDays(loop_date,loop_day);
			if(loopresultDate=='NaN-NaN-NaN'){
				$(data).parents('.col-md-12').next().find('.date-input-field').val('');}
			else{
				$(data).parents('.col-md-12').next().find('.date-input-field').val(loopresultDate);
			}
		}
	});	
}

function addDays(date, days) {
	var dateArray = date.split('-');
	var date = dateArray[2]+'-'+dateArray[1]+'-'+dateArray[0];
	var result = new Date(date);
	nu_days = parseInt(days)
	result.setDate(result.getDate() + nu_days);
	var month = 0;
	if (result.getMonth() < 9){
		month = '0' + (result.getMonth()+1);
	}
	else{
		month = result.getMonth()+1;
	}
	var date_field=0;
	if (result.getDate() <= 9){
		date_field = '0' + (result.getDate());
	}
	else{
		date_field = result.getDate();
	}
	var format_date = date_field + '-' + month + '-' + result.getFullYear();
	return format_date;
}

function button_display(flag)
{
	$("#schedule_btns").empty();
	if (flag=='add'){
		var btnstr = '<button type="button" class="btn btn-success btn-eql-wid btn-animate margin-right-3" id="assessment_schedule_add" onclick="add_schedule_data();">Add</button>';
	}
	else{
		var btnstr = '<button type="button" class="btn btn-primary btn-eql-wid btn-animate margin-right-3" id="assessment_schedule_update" onclick="add_update_schedule_data_check();">Update</button>';
		btnstr += '<button type="button" class=" btn btn-danger btn-eql-wid btn-animate margin-right-3" id="assessment_schedule_remove" onclick="remove_assessment_schedule_confirmation();">Remove</button>';
	}
	btnstr += '<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-3" id="assessment_schedule_clear_cancel" onclick="assessment_schedule_date_clear_cancel();">Cancel / Clear</button>';
	$("#schedule_btns").append(btnstr);    
}

//function button_display(action_name){
//	$("#schedule_btns").html('');
//	var btnstr = '';
//	var access_for_create = jQuery.inArray( "assessment schedule", JSON.parse(localStorage.Create) );
//	var access_for_write = jQuery.inArray( "assessment schedule", JSON.parse(localStorage.Write) );
//	var access_for_delete = jQuery.inArray( "assessment schedule", JSON.parse(localStorage.Delete) );
//	if (action_name == 'add') {
//		if (access_for_create != -1){
//		  btnstr +='<button type="button" class="btn btn-success btn-eql-wid btn-animate margin-right-3"  onclick="reviewer_add_update();">Save</button>';
//		}
//		btnstr +='<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-3" id="assessment_schedule_clear_cancel" onclick="assessment_schedule_date_clear_cancel();">Cancel / Clear</button>';
//	} else if (action_name == 'update') {
//		if (access_for_write != -1){
//		  btnstr += '<button type="button" class="btn btn-primary btn-eql-wid btn-animate margin-right-3" id="assessment_schedule_update" onclick="add_update_schedule_data();">Update</button>';
//		}
//		if (access_for_delete != -1){
//		  btnstr +='<button type="button" class=" btn btn-danger btn-eql-wid btn-animate margin-right-3" id="assessment_schedule_remove" onclick="remove_assessment_schedule_confirmation();">Remove</button>';
//		}
//		btnstr +='<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-3" id="assessment_schedule_clear_cancel" onclick="assessment_schedule_date_clear_cancel();">Cancel / Clear</button>';
//	}
//	$("#schedule_btns").append(btnstr);
//}
//
function add_schedule_data(){
	assessment_schedule_detail_id='';
	add_update_schedule_data_check();
}
//
function remove_assessment_schedule_confirmation(){
	removeConfirmation("remove_assessment_schedule",assessment_schedule_detail_id,$('#schedule_name').val())	
}
//
function remove_assessment_schedule(id){
	$.ajax({
		type:"POST",
		url: "/pa_schedule_remove/",
		data:{'assessment_schedule_detail_id':id,csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()},
		success: function (json_data) {
			if(json_data.status=='NTE_04')
			{
//				alert_status(json_data.status);
				alert_lobibox("success", sysparam_datas_list[json_data.status]);
				assessment_schedule_date_clear_cancel();
				assessment_schedule_datatable();
			}
			else
			{
//				alert_status(json_data.status);
				alert_lobibox("error", sysparam_datas_list[json_data.status]);

			}
		}
	});
}

////Function for cancel and clear function
function assessment_schedule_date_clear_cancel(){
	employee_ids = [];
	$('#dateschedule-error').remove()
	rowClick = 0;
	$('#schedule_div').hide();
	$("#schedule_name").val('');
	$("#assessment_org").val('').trigger("change");
	$("#assessment_orgunit").val('').trigger("change");
	$("#assessment_dept").val('').trigger("change");
	schedule_year = $("#assessment_year").val('').trigger("change");
	schedule_quarter = $("#assessment_quarter").val('').trigger("change");
	/*	$("#employee_type").select2('val','0');
	 	$("#assessment_category").select2('val','0');*/
	 $('input:radio').each(function () {
		 $(this).removeAttr("checked");
	 });
	 $("#selected_employee").html("");
//		$('#permission_search_id').val('').trigger("keyup")
	$('#selected_employee').val('').trigger("change")
	$('.schedule_time_div').each(function(index, elem) {
		$($(this)["0"].children[1].children["0"].children[2]).removeAttr('value');
    	$($(this)["0"].children[2].children[1]).removeAttr('value');
    });
//    $('.datefinder').each(function(index, elem) {
//    	$(elem)[0].value = ""
//    });
	 $('.day_count').val('')
	 $('.schedule_date_field').val('')
	 $('.errormessage').html('');
	 document.getElementById("employe_alert").style.display = "none";
	 button_display('add');
}

function schedule_div_check(){
	$('#dateschedule-error').remove()
	$('.schedule_time_div').each(function(index, elem) {
		dateFieldSchedule = $(this)["0"].children[2].children["0"].children[2].value
		datefinder = $(this)["0"].children[1].children[1].value
		if((dateFieldSchedule == '' || dateFieldSchedule == undefined) && (datefinder == '' || datefinder == undefined)){
			$('#schedule_div').show();
    		return ;
    	}
		else if(dateFieldSchedule == '' || dateFieldSchedule == undefined){
			$('#schedule_div').show();
    		return ;
    	}
		else if(datefinder == '' || datefinder == undefined){
			$('#schedule_div').show();
    		return ;
    	}
    });
	
	
	if ((dateFieldSchedule == '') && (datefinder == '')) {
		$('#schedule_div').append('<div id="dateschedule-error" style="display: block;text-align:center;padding-left:70px;">Please add the date and day count</div>')
		return false;
	}
	else if(dateFieldSchedule == '') {
		$('#schedule_div').append('<div id="dateschedule-error" style="display: block;text-align:center;padding-left:70px;" >Please add the date</div>')
		return false;
	}
	else if(datefinder == '') {
		$('#schedule_div').append('<div id="dateschedule-error" style="display: block;text-align:center;padding-left:70px;" >Please add the day count</div>')
		return false;
	}
	return true;
}
//Add Employee Mapping confirmation function 
function warningPerformanceSchedule(func_name, action_name,schedule_name,year,quarter) {
	title = ''
	for(var i=0;i<action_name.length;i++){
		if(i<action_name.length-1){
			title = title + action_name[i] + ', '
		}
		else if(i==action_name.length-1){
			title = title + action_name[i]
		}
		
	}
	title = title + " are allocated to the schedule <strong>"+ schedule_name +"</strong> with the same Year <strong>"+ year +"</strong> and Quarter <strong>"+quarter+"</strong>."
	$('.popup_zindex').css({'z-index':'unset'});//search select btn zindex
	swal ({
		title: title,
//		text: "Go ahead the removed",
		type: "warning",
		showCancelButton: false,
		showConfirmButton : false,
		closeOnConfirm: true,
		html : true,
	});
//	function(isConfirm) {
//		if (action_id) {
//			window[func_name](isConfirm,action_id);
//		} else {
//			window[func_name]();
//		}
//	});
}

function employee_exist_check(employeeSelect,schedule_year,schedule_quarter){
	schedule_quarter_name=$("#assessment_quarter :selected").text();
	schedule_year_name = $("#assessment_year :selected").text();
	$.ajax({
		type:"GET",
		url: "/pa_schedule_employeeExistCheck/",
//		data:{'assessment_schedule_detail_id':assessment_schedule_detail_id,'schedule_name':schedule_name,'employee_type_id':employee_type_id,'assessment_category_id':assessment_category_id,'employee_id_list':JSON.stringify(employee_id_list),'objective_setting_day_count':objective_setting_day_count,'cycle_start':cycle_start,'cycle_ends':cycle_ends,'assessment_schedule_list':JSON.stringify(assessment_schedule_list)},
		data:{'schedule_id':assessment_schedule_detail_id,'employee_id_list':JSON.stringify(employee_id_list),'schedule_year':schedule_year,'schedule_quarter':schedule_quarter},
		async: false,
		success: function (json_data) {
			if(json_data.status=='NTE_01' && json_data['employee_exist'].length!=0){
				warningPerformanceSchedule('add_update_schedule_data',json_data['employee_exist'].map(data=>data.employee_name),Array.from(new Set(json_data['employee_exist'].map(data=>data.schedule_name))),schedule_year_name,schedule_quarter_name)
				return false;
			}
			else{
				add_update_schedule_data()
			}
		}
	});  
}
function add_update_schedule_data_check(){
	schedule_year = $("#assessment_year").val();
	schedule_quarter = $("#assessment_quarter").val()
	employee_id_list=$("#selected_employee").val();
	var check = schedule_div_check();
	var status = assessment_schedule_form_validation();
	if($('#dateschedule-error') !=undefined){
		$('#dateschedule-error').addClass('error')
	}
	if(status && check){
		employee_exist_check(employee_id_list,schedule_year,schedule_quarter);
	}
	else{
		return false;
	}
}
function add_update_schedule_data(){
	schedule_year = $("#assessment_year").val();
	schedule_quarter = $("#assessment_quarter").val()
	employee_id_list=$("#selected_employee").val();
	schedule_input_status='';
	schedule_name=$("#schedule_name").val();
	cycle_start=$("#objective_setting_start_date").val();
	objective_setting_day_count=$("#objective_setting_day_count").val();
	var assessment_schedule_list=[];
	$('.schedule_time_div').each(function(i, obj) {
		if($(obj).find('.schedule_day_count').val()==''){
			schedule_input_status="empty"
		}
		else if($(obj).find('.schedule_date').val()==''){
			schedule_input_status="empty"
		}
		else{
			assessment_schedule_list[i]={
					"assessor_type_id":$(obj).find('.schedule_label').prop('id'), 
					"schedule_day_count":$(obj).find('.schedule_day_count').val(), 
					"schedule_date":$(obj).find('.schedule_date').val()
			}
		}
	});
	var check = schedule_div_check();
	var status = assessment_schedule_form_validation();
	if($('#dateschedule-error') !=undefined){
		$('#dateschedule-error').addClass('error')
	}
	if(status && check){
		if(schedule_name==''){
			alert_lobibox("error", sysparam_datas_list["NTE_43"]);
		}
//		else if(assessment_category_id==0)
//		{
//			alert_lobibox("error", sysparam_datas_list["NTE_44"]);
//		}
		else if(employee_id_list==null){
			alert_lobibox("error", sysparam_datas_list["NTE_40"]);
		}
		else if(cycle_start==''||objective_setting_day_count==''||schedule_input_status=="empty"){
			alert_lobibox("error",  sysparam_datas_list["NTE_45"])
		}
		else{
			last_schedule_date=$("#assessment_schedule_div .schedule_time_div:last-child").find('.schedule_date').val()
			last_schedule_count=$("#assessment_schedule_div .schedule_time_div:last-child").find('.schedule_day_count').val()
			cycle_ends=addDays(last_schedule_date,last_schedule_count)
			$.ajax({
				type:"POST",
				url: "/pa_schedule_addupdate/",
//				data:{'assessment_schedule_detail_id':assessment_schedule_detail_id,'schedule_name':schedule_name,'employee_type_id':employee_type_id,'assessment_category_id':assessment_category_id,'employee_id_list':JSON.stringify(employee_id_list),'objective_setting_day_count':objective_setting_day_count,'cycle_start':cycle_start,'cycle_ends':cycle_ends,'assessment_schedule_list':JSON.stringify(assessment_schedule_list)},
				data:{csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),'assessment_schedule_detail_id':assessment_schedule_detail_id,'schedule_year':schedule_year,'schedule_quarter':schedule_quarter,'schedule_name':schedule_name,'employee_id_list':JSON.stringify(employee_id_list),'objective_setting_day_count':objective_setting_day_count,'cycle_start':cycle_start,'cycle_ends':cycle_ends,'assessment_schedule_list':JSON.stringify(assessment_schedule_list)},
				async: false,
				success: function (json_data) {
					if(json_data.status=='NTE_01')
					{
//						alert_status(json_data.status);
						alert_lobibox("success", sysparam_datas_list[json_data.status]);

						assessment_schedule_date_clear_cancel();
						assessment_schedule_datatable();
					}
					else
					{
//						alert_status(json_data.status);
						alert_lobibox("success", sysparam_datas_list[json_data.status]);
						assessment_schedule_date_clear_cancel();
						assessment_schedule_datatable();
					}
				}
			});  
		}
	}
}
//Function for creating data table to display rating scheme detail 
function assessment_schedule_datatable(){
	columns = [{"title":"hidden Id","visible": false},{"title":"No."},{"title":"Schedule Name"},{"title":"Cycle Start"},{"title":"Cycle End"}]
	$.ajax({
		type:"POST",
		url: "/pa_schedule_detail_fetch/",
		data:{ csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()},
		async: false,
		success: function (json_data) {
			if(json_data.status=="Success")
			{
				data=json_data.assessment_schedule_details
				data_list = [];
				for (var i=0; i<data.length; i++){
					data_list.push([data[i].schedule_id,i+1,data[i].schedule_name,data[i].cycle_starts,data[i].cycle_ends]);
				}
				plaindatatable_btn('assessment_schedule_table', data_list, columns,[],'NEXT_TRANSFORM_HCMS_DOW_EMPLOYEE_ASSESSMENT_SCHEDULE_DETAILS_'+current_date)
			}
		}
	});      
}
//Function to retrieve row id and to display custom rating and related details
$('#assessment_schedule_table').on('click', 'tbody tr', function(){
	var org_id;
	var arr=$('#assessment_schedule_table').dataTable().fnGetData($(this)); 
	var schedule_clicked_id=arr[0];
	$.ajax({
		type:"POST",
		url: "/pa_schedule_detail_fetch_by_id/",
		async: false,
		data:{'schedule_id':schedule_clicked_id,csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()},
		success: function (json_data) {
			assessment_schedule_detail_id=schedule_clicked_id
			data=json_data
			if(data.status=="Success")
			{
				schedule_data=data.schedule_date_detail
				assessment_schedule_date_clear_cancel();
				$("#schedule_name").val(data.schedule_details["0"].schedule_name)
//				$("#employee_type").val(data.schedule_details["0"].employee_type).trigger("change")
//				$("#assessment_category").val(data.schedule_details["0"].assessment_category).trigger("change")
				var template=''
					template='<div class="form-group col-md-12"><div class="form-group col-md-4"><h3 class="res-hide-name">Assessment Target</h3></div><div class="form-group col-md-4"> <h3 class="res-hide-name">Scheduled Days</h3></div><div class="form-group col-md-4"> <h3 class="res-hide-name">Estimated Date</h3></div><div class="form-group col-md-4 objectives"><h3 class="desk-hide-names">Assessment Target</h3><label>Objective Settings</label></div><div class="form-group col-md-4"><h3 class="desk-hide-names">Scheduled Days</h3><input type="text" onkeypress="return IsNumeric(event)" ondrop="return false" onpaste="return false" class="form-control datefinder day_count" placeholder=" " value="'+data.schedule_details["0"].objective_day_count+'" id="objective_setting_day_count"></div><div class="form-group col-md-4"><div class="col-md-12 input-icon padding-0 "><h3 class="desk-hide-names">Estimated Date</h3><i class="fa fa-calendar cicon icon_mar"></i> <input class=" form-control form-control-inline date-input-field schedule_date_field" type="text" data-field="date" readonly id="objective_setting_start_date" value="'+data.schedule_details["0"].cycle_starts+'"><div id="schedule_start_date" class="dtpicker-overlay dtpicker-mobile" style="display: none;"> <div class="dtpicker-bg"><div class="dtpicker-cont"><div class="dtpicker-content"><div class="dtpicker-subcontent"></div></div></div></div></div></div></div></div>'
					$('#schedule_div').show();
				for(var i=0; i<schedule_data.length; i++){
					template+='<div class="form-group col-md-12 schedule_time_div"><div class="form-group col-md-4 objectives" ><h3 class="desk-hide-names">Assessment Target</h3><label class="schedule_label" id="'+schedule_data[i].assessor_type_id+'">'+schedule_data[i].refitems_name+'</label></div><div class="form-group col-md-4"><h3 class="desk-hide-names">Scheduled Days</h3><input id='+i+' type="text" onkeypress="return IsNumeric(event)" ondrop="return false" onpaste="return false" class="form-control datefinder schedule_day_count day_count" placeholder=" " value="'+schedule_data[i].assess_type_day_count+'"></div><div class="form-group col-md-4"><div class="col-md-12 input-icon padding-0 "><h3 class="desk-hide-names">Estimated Date</h3><i class="fa fa-calendar cicon icon_mar"></i> <input class="form-control form-control-inline date-input-field schedule_date schedule_date_field" type="text" data-field="date" readonly="" id="date_'+i+'" value="'+schedule_data[i].schedule_start_date+'"><div id="schedule_start_date" class=" dtpicker-overlay dtpicker-mobile" style="display: none;"> <div class="dtpicker-bg"><div class="dtpicker-cont"><div class="dtpicker-content"><div class="dtpicker-subcontent"></div></div></div></div></div></div></div></div>'
				}
				$('#assessment_schedule_div').html(template)
				$('#schedule_start_date').DateTimePicker({
					dateFormat: "dd-MM-yyyy"
				});
				$(".datefinder").keyup(function(){
					var parent_id=$(this).parent().next().find('.date-input-field').attr('id')
					dateLoopChange(parent_id)
				});
				$('.schedule_date_field').on('change dp.change', function(e){
					var parent_id=$(this).attr('id')
					dateLoopChange(parent_id)
				})
				rowClick = 1;
				employee_ids=data.schedule_date_detail["0"].employee_ids  
				employee_detail=data.schedule_employee_detail
				$("#assessment_org").val(employee_detail[0].org_id_id).trigger('change')
				schedule_quarter = $("#assessment_quarter").val(data.schedule_details["0"].quarter).trigger('change');
				schedule_year = $("#assessment_year").val(data.schedule_details["0"].year).trigger('change');
//				$('#permission_search_id').val('').trigger("keyup")
				$('#selected_employee').val(employee_ids).trigger("change")
				button_display('update');
			}
		}
	})
});
//
////Validation for Drop Data
$.validator.addMethod("valueNotEquals", function(value, element, arg){
	if(value == 0) {
		return false
	} else {
		return true
	}
}, "Value must not equal arg.");
//
////Validation For assessment template 
$('#assessment_schedule_form').submit(function(e) {
	e.preventDefault();
}).validate({

	rules: {
		assessment_org: {
			valueNotEquals:true,
		}, 
		schedule_name: {
			required: true,
		},  
		selected_employee_type: {
			valueNotEquals:true,
		}, 
		assessment_year: {
			valueNotEquals:true,
		},
		assessment_quarter: {
			valueNotEquals:true,
		},
	},
	//For custom messages
	messages: {

		assessment_org: {
			valueNotEquals: "Select the Organization",
		},
		schedule_name: {
			required: "Enter the Schedule Name",
		},
		selected_employee_type: {
			valueNotEquals: "Select the Employee",
		},
		assessment_year: {
			valueNotEquals: "Select the Year",
		},
		assessment_quarter: {
			valueNotEquals: "Select the Quarter",
		},
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
function assessment_schedule_form_validation(){
	return $('#assessment_schedule_form').valid();
}
//
////Allow only numeric
var specialKeys = new Array();
specialKeys.push(8);
function IsNumeric(e) {
	var keyCode = e.which ? e.which : e.keyCode
			var ret = ((keyCode >= 48 && keyCode <= 57) || specialKeys.indexOf(keyCode) != -1);
	return ret;
}
$('#getMultiValues').click(function() {
	arrayOfValues = [];
	strAppend = ''
		var oTable = $("#attendance_popup_table").dataTable();
	$("input:checkbox:checked", oTable.fnGetNodes()).each(function() {
		emp_name= $(this).closest('tr').find('td').eq(3).text()
		arrayOfValues.push({id:this.id,name:emp_name});
	}).get();
	$("#selected_employee").html("");
	if(arrayOfValues.length!=0)
	{
		for(var i=0;i<arrayOfValues.length;i++){
			employee_ids.push(arrayOfValues[i].id)
			$('#selected_employee').append($('<option>', {
				value :arrayOfValues[i].id,
				text : arrayOfValues[i].name
			}));
		}
//		$('#permission_search_id').val('').trigger("keyup")
		$('#selected_employee').val(employee_ids).trigger("change")
	}
	else					{   
		document.getElementById("employe_alert").style.display = "block";
		document.getElementById("employe_alert").style.color="red";

	}
});