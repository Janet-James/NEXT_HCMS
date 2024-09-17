var radioCheck="N";
var trainingId;
var training_update_id = {};
$(document).on('change','#LDorgname',function(){
	returnData = ajaxCall('get','/ld_organization_change/',{'org_id':$('#LDorgname').val()},false)
		selectBoxValAppend('LDorgunit',returnData.organization_unit_detail,returnData.status)
})

$(document).on('change','#LDorgunit',function(){
	returnData = ajaxCall('get','/ld_organization_unit_change/',{'orgunit_id':$('#LDorgunit').val()},false)
		selectBoxValAppend('LDdivisionname',returnData.division_detail,returnData.status)
})

$(document).on('change','#LDdivisionname',function(){
	returnData = ajaxCall('get','/ld_division_change/',{'division_id':$('#LDdivisionname').val()},false)
	if(radioCheck == "E"){
		selectBoxValAppend('LDtrainingname',returnData.division_detail,returnData.status)
	}
	selectBoxValAppend('LDmanagername',returnData.employee_data,returnData.status)
})

$(document).ready(function(){
	$("#requestfornew").trigger('click')
	rightClick();
	sideTrainingDataShow();
	searchValReturn();
	requestTrainingButtonShow(0)
	current_user_details();
/**	Validation for Drop Data Start **/
	$.validator.addMethod("valueNotEquals", function(value, element, arg){
		if(value == 0) {
			return false
		} else {
			return true
		}
	}, "Value must not equal arg.");
/**	Validation for Drop Data End **/
	
/** Validation For Employee Self Request Training Exist Form Start **/ 
	$('#self_request_process_form').submit(function(e) {
		e.preventDefault();
	}).validate({

		rules: {
			LDorgname:{
				valueNotEquals:true,
			},
			LDorgunit: {
				valueNotEquals: true,
			},  
			LDmanagername: {
				valueNotEquals:true,
			},
			LDdivisionname:{
				valueNotEquals:true,
			},
			LDreasonfortraining: {
				required: true,
			},  
		},
		//For custom messages
		messages: {
			LDorgname:{
				valueNotEquals:"Select the Organization",
			},
			LDorgunit: {
				valueNotEquals:"Select the Organization Unit",
			},
			LDdivisionname:{
				valueNotEquals: "Select the Division",
			},
			LDreasonfortraining: {
				required: "Enter the Reason for Training",
			},
			LDmanagername: {
				valueNotEquals: "Select the Manager Name",
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
/** Validation For Employee Self Request Training Exist Form End **/ 
	
	
	
/** Select Box Onchange Functionality Start **/
	
	$(document).on('change','#LDtrainingname',function(){
		if(this.tagName=="SELECT"){
			var training_id = $('#LDtrainingname').val()
			if(training_id!='0' && training_id!='' && training_id!=null){
//				$('#LDtrainingtype').parent().parent().remove()
//				$('#LDTrainingDateLabel').remove();
//				$('#LDdateField').remove();
				$('#sample,#sample2').remove();
				$('<div class="col-md-6 col-sm-12" id="sample"> \
						<label  id="LDTrainingDateLabel">Training Date <span class="asterisk"> *</span></label>\
						<div id="LDdateField" class="form-group">\
						<div class="input-icon" style="float: left">\
						<i class="nf nf-calendar"></i> <input id="LDstartdate"\
						name="LDstartdate" placeholder="Start Date"\
						class="form-control form-control-inline" data-field="date"\
						size="12" value="" type="text" data-error=".errorTxt17"\
						readonly> <span id="start_date_error"\
						class="errorTxt17 errormessage"></span>\
						</div>\
						<div class="input-icon" style="float: right">\
						<i class="nf nf-calendar"></i> <input id="LDenddate"\
						name="LDenddate" placeholder="End Date"\
						class="form-control form-control-inline" data-field="date"\
						size="12" value="" type="text" data-error=".errorTxt18"\
						readonly> <span id="end_date_error"\
						class="errorTxt18 errormessage"></span>\
						<div id="request_end_date"></div>\
						</div>\
				</div></div>').insertBefore($('#reasonfortrainingdiv'));
//				($('#trainingNameDiv').parent().next()).insertAfter($('#dateRow'));
				$('<div class="col-md-6 col-sm-12" id="sample2"><div class="form-group">\
						<label class="control-label black_font">Training Type\
						<span class="asterisk">*</span>\
						</label>\
						<div class="input-icon">\
						<i class="nf nf-training"></i> <input type="text"\
						id="LDtrainingtype" name="LDtrainingtype"\
						class="form-control" placeholder="Training Type"\
						data-error=".errorTxt16" readonly>\
						</div>\
						<span class="errorTxt16 errormessage"></span>\
						</div></div><div class="clearfix" id="spacefix"></div>').insertAfter($("#trainingNameDiv").parent());
						
				data = {'training_id':training_id}
				returnData = ajaxCall('get','/request_training_exist_change/',data,false)
				if (returnData.status == 'NTE_01'){
					$('#LDtrainingtype').val(returnData.training_detail[0].name)
					$('#LDstartdate').val(returnData.training_detail[0].start_date)
					$('#LDenddate').val(returnData.training_detail[0].end_date)
				}
			}
		}
		
	})
	
	$('#ld_employee_self_request_training_search').change(function(){
		var searchId = $('#ld_employee_self_request_training_search').val()
		if(searchId!='0'){
			if($('#ld_employee_self_request_training_details_vertical_view>div').hasClass('search_'+searchId)){
				$('#ld_employee_self_request_training_details_vertical_view p').remove()
				$('.ta_job_opening').hide();
				$('.search_'+searchId).show();
			}
			else{
				$('.ta_job_opening').hide();
				$('#ld_employee_self_request_training_details_vertical_view p').remove()
				$('#ld_employee_self_request_training_details_vertical_view').append("<p class='no_data_found'>No Data Avaliable</p>")
			}
		}
		else{
			$('#ld_employee_self_request_training_details_vertical_view p').remove()
			$('.ta_job_opening').show();
		}
	})
})

function selectBoxValAppend(id,returnData_detail,status){
	if (status == 'NTE_01'){
		$("#"+id).html("");
		if(id == "ld_employee_self_request_training_search"){
			$('#'+id).append($('<option>', {
	            value :'0',
	            text :'Search By Training'
			}));
		}
		else{
			$('#'+id).append($('<option>', {
	            value :'0',
	            text :'--Select--'
			}));
		}
		
		for(var i=0;i<returnData_detail.length;i++){
			$('#'+id).append($('<option>', {
				value :returnData_detail[i].id,
				text : returnData_detail[i].name
			}));
		}
	}
}

function requestTrainingButtonShow(buttonClick){
	if(buttonClick==0){
		$('#request_training_btn').html('<button type="button" class="btn btn-success btn-eql-wid btn-animate margin-right-3"\
				id="request_training_add" onclick="request_training_add()">Add</button>\
				<button type="button" class="btn yellow btn-eql-wid btn-animate"\
				id="request_training_clear_cancel"\
				onclick="request_training_cancel_confirmation()">Cancel /\
		Clear</button>')
	}
	else if(buttonClick==1){
		$('#request_training_btn').html('<button type="button" class="btn btn-primary btn-eql-wid btn-animate"\
				id="request_training_update" style="display: none"\
				onclick="request_training_update()">Update</button>\
				<button type="button" id="request_training_delete"\
				style="display: none"\
				onclick="request_training_remove_confirmation()"\
				class="btn btn-danger btn-eql-wid btn-animate ">Remove</button>\
				<button type="button" class="btn yellow btn-eql-wid btn-animate"\
				id="request_training_clear_cancel"\
				onclick="request_training_cancel_clear()">Cancel /\
		Clear</button>')
	}
}
function sideTrainingDataShow(){
	returnData = ajaxCall('get','/fetch_request_training_details/',{},false)
	var htmlList = ''
	if(returnData.status=="NTE_01" && returnData.training_detail.length!=0){
		for(var i=0;i<returnData.training_detail.length;i++){
			$('#ld_employee_self_request_training_details_vertical_view').html("")
			
			if(returnData.training_detail[i].training_id != undefined && returnData.training_detail[i].training_id != null){
				
				htmlList = htmlList + '<div id="search'+returnData.training_detail[i].search_id+'"\
				class="col-md-12 EmployeeCard equhight employeeList ta_job_opening search_'+returnData.training_detail[i].search_id+'" \
				onclick="trainingRequestTableClick(this,'+returnData.training_detail[i].id+')">\
				<div class="col-md-12"><table style="width:  100%;"><tbody>\
				<tr><td class="tdwidth1">Training Name</td><td class="tdwidth2">:</td>\
				<td class="tdwidth3"><b>'+returnData.training_detail[i].training_name+'</b></td></tr>'
			}
			else {
				
				htmlList = htmlList + '<div id="search'+returnData.training_detail[i].search_id+'"\
				class="col-md-12 EmployeeCard equhight employeeList ta_job_opening search_'+returnData.training_detail[i].search_id+'" \
				onclick="trainingRequestTableClick(this,'+returnData.training_detail[i].id+')">\
				<div class="col-md-12"><table style="width:  100%;"><tbody>\
				<tr><td class="tdwidth1">Training Name</td><td class="tdwidth2">:</td>\
				<td class="tdwidth3"><b>'+returnData.training_detail[i].training_name+'</b></td></tr>'
			}
			
			htmlList = htmlList + '<tr><td class="tdwidth1">Reason for Training </td><td class="tdwidth2">:</td>\
			<td class="tdwidth3"><b> <b>'+returnData.training_detail[i].request_reason+'</b></b></td></tr>\
			<tr><td class="tdwidth1">Approval Status </td>\
			<td class="tdwidth2">:</td><td class="tdwidth3"><b> <b>'+returnData.training_detail[i].approval_status+'</b></b></td></tr>\
			<tr><td class="tdwidth1">Division</td><td class="tdwidth2">:</td>\
			<td class="tdwidth3"><b> <b>'+returnData.training_detail[i].team_name+'</b></b></td></tr>\
			<td class="tdwidth1">Manager Name</td><td class="tdwidth2">:</td>\
			<td class="tdwidth3"><b> <b>'+returnData.training_detail[i].manager_name+'</b></b></td></tr><tr>\
			<td class="tdwidth1">Requested By</td><td class="tdwidth2">:</td>\
			<td class="tdwidth3"><b> <b>'+returnData.training_detail[i].requested_by+'</b></b></td></tr>\
			<tr><td class="tdwidth1">Requested on</td><td class="tdwidth2">:</td>\
			<td class="tdwidth3"><b> <b>'+returnData.training_detail[i].requested_on+'</b></b></td></tr>\
			</tbody></table></div></div>'
		}
	}
	else{
		htmlList = '<p class="no_data_found">No Data Avaliable</p>'
	}
	$('#ld_employee_self_request_training_details_vertical_view').html(htmlList)
}
/** Select Box Onchange Functionality End **/

/** Radio Button Click Functionality Start **/
$(document).on('click', 'input[name="optionsRequest"]', function() {
	radioCheck = $(this).val() 
	$("#LDmanagername").val('0').trigger('change.select2')
	$("#LDreasonfortraining").val('')
	var tagName = $('#trainingNameDiv').children()[1].tagName
	if(tagName=="SELECT" || tagName == "DIV"){
		if(tagName=="SELECT"){
			$("#LDtrainingname").select2('destroy')
		}
		$('#trainingNameDiv').children()[1].remove()
	}
	$('.errormessage').html("")
//	$('#LDtrainingtype').parent().parent().remove()
//	$('#LDTrainingDateLabel').remove();
//	$('#LDdateField').remove();
	$('#sample,#sample2').remove();
	if($(this).val() == "E"){
		$('<select id="LDtrainingname"\
				name="LDtrainingname" class="form-control select2"\
				data-error=".errorTxt12"\
				data-placeholder="Select Training Name">\
				<option value="0">--Select--</option>\
		</select>').insertAfter('#trainingNameDiv label')
		$("#LDtrainingname").select2()
		$("#LDdivisionname").trigger('change')
		$('#LDtrainingname').val($('#LDtrainingname').val()).trigger('change')
		if(training_update_id.type=="E"){
			trainingRequestTableClick(training_update_id.thisData,training_update_id.id);
		}
		else if(training_update_id.type=="N"){
			requestTrainingButtonShow(0);
		}
	}
	else if($(this).val() == "N"){
		$('#spacefix').remove();
		$('#LDtrainingname').select2('destroy');
		$('<div class="input-icon">\
				<i class="nf nf-training"></i> <input type="text"\
				id="LDtrainingname" name="LDtrainingname" maxlength="75"\
				class="form-control" placeholder="Training Name"\
				data-error=".errorTxt20">\
		</div>').insertAfter('#trainingNameDiv label')
		
		if(training_update_id.type=="N"){
			trainingRequestTableClick(training_update_id.thisData,training_update_id.id)
		}
		else if(training_update_id.type=="E"){
			requestTrainingButtonShow(0);
		}
	}
});
/** Radio Button Click Functionality End **/

/** Validation Function for Exist and New Form Start **/
function self_request_process_form_validation(){
	return $('#self_request_process_form').valid();
}

/** Validation Function for Exist and New Form End **/
$(document).on('keyup','#LDtrainingname',function(){
	$('.errorTxt20').html("")
})

function validationTraining(trainingVal,content){
	if(trainingVal=="0" || trainingVal=="" || trainingVal==null){
		$('.errorTxt20').append('<div class="error">'+content+'</div>');
		return false;
	}
	else{
		return true;
	}
}

/** Employee Self Request Add Ajax Call Start **/ 

function request_training_add(){
	var validStatus = false;
	var validTrainingName = false;
	var training_name = $('#LDtrainingname').val();
	var errorContent;
	var manager_name = $('#LDmanagername').val()
	var reason_for_training = $('#LDreasonfortraining').val()
	if(radioCheck == "E"){
		errorContent = 'Select Training Name'
	}
	else if(radioCheck=="N"){
		errorContent = 'Enter Training Name'
	}
	validStatus = self_request_process_form_validation();
	validTrainingName = validationTraining(training_name,errorContent);
	if(validStatus && validTrainingName){
		data = {'request_type':radioCheck,'training_name':training_name,'division_id':$('#LDdivisionname').val(),'manager_name':manager_name,'reason_for_training':reason_for_training,csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()}
		returnData = ajaxCall('post','/request_training_add_update/',data,false)
		if(returnData.status == 'NTE_01'){
			alert_lobibox("success", sysparam_datas_list[returnData.status]);
			request_training_cancel_clear();
			sideTrainingDataShow();
			searchValReturn();
		}
		else{
			alert_lobibox("error", sysparam_datas_list[returnData.status]);
		}
	}
}

/** Employee Self Request Add Ajax Call End **/ 

/** Employee Self Request Update Ajax Call Start **/ 

function request_training_update(){
	var validStatus = false;
	var validTrainingName = false;
	var training_name = $('#LDtrainingname').val();
	var errorContent;
	var manager_name = $('#LDmanagername').val()
	var reason_for_training = $('#LDreasonfortraining').val()
	if(radioCheck == "E"){
		errorContent = 'Select Training Name'
	}
	else if(radioCheck=="N"){
		errorContent = 'Enter Training Name'
	}
	validStatus = self_request_process_form_validation();
	validTrainingName = validationTraining(training_name,errorContent);
	if(validStatus && validTrainingName){
		data = {'training_id':trainingId,'request_type':radioCheck,'division_id':$('#LDdivisionname').val(),'training_name':training_name,'manager_name':manager_name,'reason_for_training':reason_for_training,csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()}
		returnData = ajaxCall('post','/request_training_add_update/',data,false)
		if(returnData.status == 'NTE_03'){
			alert_lobibox("success", sysparam_datas_list[returnData.status]);
			request_training_cancel_clear();
			sideTrainingDataShow();
			searchValReturn();
		}
		else{
			alert_lobibox("error", sysparam_datas_list[returnData.status]);
		}
	}
}
/** Employee Self Request Update Ajax Call End **/ 


function request_training_remove_confirmation() //remove confirmation function
{   
//	if($('#').val() == "E") { removeConfirmation('request_training_remove',trainingId,'Request Training'); }
//	else if{   }
	if(radioCheck == "E"){
		removeConfirmation('request_training_remove',trainingId,$('#LDtrainingname  option:selected').text());
	}
	else if(radioCheck=="N"){
		removeConfirmation('request_training_remove',trainingId,$('#LDtrainingname').val());
	}
	else {
		removeConfirmation('request_training_remove',trainingId,'Request Training');
	}
	
} 

function request_training_remove()
{
	if(trainingId!='')
	{
	   var load_data={'training_id':trainingId}	
	   returnData = ajaxCall('get','/request_training_delete/',load_data,false)
	   if (returnData.status == 'NTE_04'){
			alert_lobibox("success", sysparam_datas_list[returnData.status]);
			request_training_cancel_clear();
			sideTrainingDataShow();
			searchValReturn();
		}
	}
}

function request_training_cancel_confirmation() {  orgClearFuncton('request_training_cancel_clear','Cancel','Training Request'); } //remove confirmation function

function request_training_cancel_clear(){
	$('.ta_job_opening').removeClass('custom_dev_acitve')
	requestTrainingButtonShow(0)
	$('.errormessage').html("")
	if(radioCheck=="E"){
//		$('#LDtrainingtype').parent().parent().parent().remove()
//		$('#LDdateField').parent().remove();
		$('#sample,#sample2').remove();
		$('.errormessage').html("");
		$('#LDtrainingname').html("");
		$('#spacefix').remove();
//		($('#dateRow').children('div:first')).appendTo($('#trainingNameDiv').parent().parent());
		$('#LDtrainingname').append("<option value='0'>--Select--</option>");
		$('#LDtrainingname').val('0').trigger('change.select2');
	}
	else if(radioCheck=="N"){
		$('#LDtrainingname').val('')
		$('#spacefix').remove();
	}
	$('#LDorgunit').html("")
	$('#LDorgunit').append("<option value='0'>--Select--</option>")
	$('#LDdivisionname').html("")
	$('#LDdivisionname').append("<option value='0'>--Select--</option>")
	$('#LDmanagername').html("")
	$('#LDmanagername').append("<option value='0'>--Select--</option>")
	$('#LDorgname').val('0').trigger('change.select2')
	$('#LDorgunit').val('0').trigger('change.select2')
	$('#LDdivisionname').val('0').trigger('change.select2')
	$('#LDmanagername').val('0').trigger('change.select2')
	$('#LDreasonfortraining').val('')
	$('#request_training_update').hide()
	$('#request_training_delete').hide()
	$('#request_training_add').show()
	training_update_id = {}
	current_user_details();
}

/** Arrow Click Functionality for both Left and Right Start **/
function rightClick(){
	$('.blink_class').css({
		'float' : 'right',
		'margin-right' : '36px'
	});
	$('#LDleft').css('display', 'block');
	$('#LDright').css('display', 'none');
	$('#ld_open_main_div1').addClass('col-md-12').removeClass('col-md-8');
	$('#ld_open_main_div2').removeClass('divActive');
	$('#LDstartdate').attr('size','24')
	$('#LDenddate').attr('size','24')
}

function leftClick(){
	$('.blink_class').css({
		'float' : 'right',
		'margin-right' : '-8px'
	});
	$('#LDleft').css('display', 'none');
	$('#LDright').css('display', 'block');
	$('#ld_open_main_div1').addClass('col-md-8').removeClass('col-md-12');
	$('#ld_open_main_div2').addClass('divActive');
	$('#LDstartdate').attr('size','12')
	$('#LDenddate').attr('size','12')
}
/** Arrow Click Functionality for both Left and Right End **/

/** Common Ajax Call Functionality Start **/
function ajaxCall(type,url,data,async){
	var returnStatus;
	$.ajax({
		type: type,
		url: url,
		data: data,
		async: async,
		success: function (json_data) {
			returnStatus =  json_data;
		}
	})
	return returnStatus;
}
/** Common Ajax Call Functionality End **/

function trainingRequestTableClick(thisdata,id){
	requestTrainingButtonShow(1)
	training_update_id = {};
	$('.ta_job_opening').removeClass('custom_dev_acitve')
	tableReturnData = ajaxCall('get','/fetch_request_training_details_id/',{'id':id},false)
	if(tableReturnData.status == 'NTE_01'){
		$('#LDorgname').val(tableReturnData.training_detail[0].org_id).trigger('change')
		$('#LDorgunit').val(tableReturnData.training_detail[0].org_unit_id).trigger('change')
		$('#LDdivisionname').val(tableReturnData.training_detail[0].division_id).trigger('change')
		trainingId = id;
		if(tableReturnData.training_detail[0].training_id!=undefined && tableReturnData.training_detail[0].training_id!=null){
			$('input:radio[value="E"]').trigger('click')
			$('#LDtrainingname').val(tableReturnData.training_detail[0].training_id).trigger('change')
			training_update_id = {'thisData':thisdata,'type':'E','id':id};
		}
		else{
			$('input:radio[value="N"]').trigger('click')
			$('#LDtrainingname').val(tableReturnData.training_detail[0].training_name)
			$($('#dateRow').next()).insertAfter($('#trainingNameDiv').parent());
			training_update_id = {'thisData':thisdata,'type':'N','id':id};
		}
		$('#LDreasonfortraining').val(tableReturnData.training_detail[0].request_reason)
		$('#LDmanagername').val(tableReturnData.training_detail[0].manager_id).trigger('change.select2')
		$('#request_training_update').show()
		$('#request_training_delete').show()
		$('#request_training_add').hide()
	}
	$("#"+thisdata.id).addClass('custom_dev_acitve')
}


function searchValReturn(){
	returnData = ajaxCall('get','/fetch_request_training_count_detail/',{},false)
	selectBoxValAppend('ld_employee_self_request_training_search',returnData.training_search_detail,returnData.status)
}

function current_user_details()    // fetch current user organizations
{  
	$.ajax({
		type:'GET',
		url: '/current_user_details/',
		async : false,
		success: function (json_data){
			var data=json_data.user_detaills
			$('#LDorgname').val(data[0]['org_id_id']).trigger('change')
			$('#LDorgunit').val(data[0]['org_unit_id_id']).trigger('change')
			$('#LDdivisionname').val(data[0]['team_name_id']).trigger('change');
		},
	})	
}

