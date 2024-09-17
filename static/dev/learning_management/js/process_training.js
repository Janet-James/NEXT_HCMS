var updateData = {}
var valCheck;
var readclick = 0;
var nextMoveCount = 1; 
var	sizeVal = 0; 
var count=0;
$(document).ready(function(){
	$("#ld_tab1").trigger('click')
	tabcountShow();
	departmentHeadButtonForm();
})

$(document).on('click','.readMoreClass',function(e) {
	e.preventDefault();
	var id = $(this).attr('href');
	if ($(id).is(":visible")) {
		$(this).html("<p class='readMoreClass'>Read More</p>");
		$('#'+$(this).parent().attr('id')).removeClass('job_requisitions_content_active');
	} else {
		$(this).html("<p class='readMoreClass'>Read Less</p>");
		$('#'+$(this).parent().attr('id')).addClass('job_requisitions_content_active');
	}
	$(id).slideToggle(1);
});

function tabcountShow(){
	returnData = ajaxCall('get','/fetch_request_training_count_detail/',{},false)
	if(returnData.status=="NTE_01" && returnData.training_count_detail.length!=0){
		$('#ld_request').html(returnData.training_count_detail[0].request_count);
		$('#ld_depapproval').html(returnData.training_count_detail[0].manager_approve_count);
		$('#ld_approved').html(returnData.training_count_detail[0].approval_count);
		$('#ld_rejected').html(returnData.training_count_detail[0].rejected_count);
	}
	else{
		$('#ld_request').html('0');
		$('#ld_depapproval').html('0');
		$('#ld_approved').html('0');
		$('#ld_rejected').html('0');
	}
}

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

function tabClick(data,tab_no){
	closeDiv(tab_no)
	sizeVal = 0;
	returnData = ajaxCall('get','/fetch_request_training_details/',data,false);
	var htmlList = ''
		var totalHtml = ''
			var totalList = '' 
				var htmlList2 = ''
					var pageList = ''
						var paginationList = ''
							$('#no_data_found_'+tab_no).html("")
							var count = 1;
	var current_count = 1;
	var previous_count = 0
	if(returnData.status=="NTE_01" && returnData.training_detail.length!=0){
		totalHtml = totalHtml + '<li id="" class="pagination_list" style="display: block;"><div class="tablist_wrap tablist_wrap_tb1" id="1tb2"  style="cursor: default;"><div class="col-sm-3 table-header bold" >Training Name</div><div class="col-sm-3 table-header bold">Requested Date</div><div class="col-sm-3 table-header bold">Approval Status</div><div class="col-sm-3 table-header bold">Requested By</div></div></li><ul class="padding_0">'
		for(var i=0;i<returnData.training_detail.length;i++){
			$('#no_data_found_'+tab_no).html("")
			if(returnData.training_detail[i].training_exist_name != undefined){
				htmlList = htmlList + '<div\
				class="tablist_wrap tablist_wrap_tb'+tab_no+'" id="'+(i+1)+'tb'+tab_no+'"\
				onclick="rowclick('+returnData.training_detail[i].id+',\''+tab_no+'\',this)">\
				<div class="col-sm-3 job_title"\
				data-toggle="tooltip" data-placement="left"\
				title="" data-original-title="Training Name">\
				'+returnData.training_detail[i].training_exist_name+'</div>'
			}
			else if(returnData.training_detail[i].training_name != undefined){
				htmlList = htmlList + '<div\
				class="tablist_wrap tablist_wrap_tb'+tab_no+'" id="'+(i+1)+'tb'+tab_no+'"\
				onclick="rowclick('+returnData.training_detail[i].id+',\''+tab_no+'\',this)">\
				<div class="col-sm-3 job_title"\
				data-toggle="tooltip" data-placement="left"\
				title="" data-original-title="Training Name">\
				'+returnData.training_detail[i].training_name+'</div>'
			}
			htmlList = htmlList + '<div class="col-sm-3" data-toggle="tooltip"\
			data-placement="left" title=""\
			data-original-title="Request On">'+returnData.training_detail[i].requested_on+'</div>\
			<div class="col-sm-3" data-toggle="tooltip"\
			data-placement="left" title=""\
			data-original-title="Department Approved Status">'+returnData.training_detail[i].approval_status+'</div>\
			<div class="col-sm-3" data-toggle="tooltip"\
			data-placement="left" title=""\
			data-original-title="Requested By">'+returnData.training_detail[i].manager_name+'</div></div>'
			if(previous_count<(i+1) && (i+1)==current_count){
				paginationList = paginationList + '<li id="ld_pagination_'+tab_no+count+'"\
				class="pagination_list"\
				style="display: none;">'
				pageList = pageList + '<li class="paginationList" id="pag_'+tab_no+count+'"\
				onclick="paginationClick('+tab_no+','+count+')"><a>'+(count)+'</a></li>'
				previous_count = 5
				count = count + 1
				current_count = current_count + 5
				sizeVal = sizeVal + 3
			}
			if((i+1)%(5)==0 || (i+1)==returnData.training_detail.length){
				totalList = totalList + paginationList + htmlList +'</li>'
				htmlList = ""
					paginationList = ""
			}
		}

		totalHtml = totalHtml + totalList + '</ul><div class="col-sm-2 pull-right" id="process_training_pagination'+tab_no+'">\
		<div class="col-sm-1 btn prearrow prev'+tab_no+'"\
		style="padding: 10px;" onclick="previousMove('+tab_no+')" disabled="true">\
		<i class="fa fa-angle-left"></i>\
		</div>\
		<div class="col-sm-'+sizeVal+'" id="page_id'+tab_no+'">\
		<ul class="pagination pagination-sm">\
		'+pageList+'\
		</ul>\
		</div>\
		<div class="col-sm-1 btn nextarrow next'+tab_no+'"\
		style="padding: 10px;">\
		<i class="fa fa-angle-right" onclick="nextMove('+tab_no+')"></i>\
		</div>'
	}
	else{
		totalHtml = '<p class="no_data_found">No Data Avaliable</p>'
			$('#process_training_list_db_tb_search_'+tab_no).hide()
	}
	$('.tab-content>.tab-pane').css('display','none')
	$('.tab-content>#ld-tab'+tab_no).css('display','block')
	$('#no_data_found_'+tab_no).append(totalHtml)
	if(count==2){
		$("#process_training_pagination"+tab_no).hide()
	}
	else{
		$("#process_training_pagination"+tab_no).show()
	}
	$("#ld_pagination_11").addClass('activeEmployeeList')
	$("#no_data_found_"+tab_no).show();
	$('#pag_'+tab_no+1).addClass('active')
	$('#pag_'+tab_no+'1').trigger('click')
//	readMore(tab_no)
}

function departmentHeadButtonForm(){
	$("#departmentFormButton").append('<button type="button"\
			onclick="training_request_approval_update({},2)"\
			class="btn-animate btn-eql-wid  btn btn-success">Update</button>\
			<button type="button"\
			onclick="training_request_approval_clear()"\
	class="btn-animate btn-eql-wid  btn btn-warning">Clear</button>')
}
function nextMove(tabno){
	nextMoveCount = nextMoveCount + 1;
	if(tabno==nextMoveCount){
		paginationClick(tabno,nextMoveCount)
		if(nextMoveCount==1){
			$('#process_training_pagination'+tabno+'>prearrow').prop('disabled','false')
		}
		else{
			$('#process_training_pagination'+tabno+'>prearrow').prop('disabled','true')
		}
		$(".pagination>li").removeClass('active')
		$('#pag_'+tabno+nextMoveCount).addClass('active')
	}
	else { $('#process_training_pagination'+tabno+'>nextarrow').prop('disabled','true'); nextMoveCount=tabno }
}

function previousMove(tabno){
	nextMoveCount = nextMoveCount - 1;
	if(nextMoveCount==0)
	{
		nextMoveCount=1
	}
	paginationClick(tabno,nextMoveCount)
	if(nextMoveCount==1){
		$('#process_training_pagination'+tabno+'>prearrow').prop('disabled','false')
	}
	else{
		$('#process_training_pagination'+tabno+'>prearrow').prop('disabled','true')
	}
	$(".pagination>li").removeClass('active')
	$('#pag_'+tabno+nextMoveCount).addClass('active')
}
var rowClick = 0;
function rowclick(id,tabno,thisData){
	rowClick = rowClick + 1
	if(rowClick>=2){
		sizeVal = sizeVal - 2
	}
	training_request_approval_clear()
	$('.tablist_wrap').removeClass('tablist_active')
	$('#'+thisData.id).addClass('tablist_active')
	$("#page_id"+tabno).removeClass('col-sm-'+sizeVal)
	sizeVal = sizeVal + 2
	$("#page_id"+tabno).addClass('col-sm-'+sizeVal)
	var htmlList = ''
		var training_name;
	$('#process_training_tb'+tabno).show();
	$('#process_training_list_db_tb'+tabno).removeClass('col-md-12');
	$('#process_training_list_db_tb'+tabno).addClass('col-md-8');
	returnData = ajaxCall('get','/fetch_request_training_details/',{'id':id},false);
	$('#process_training_content_tb'+tabno).html("");
	if(returnData.status=="NTE_01" && returnData.training_detail.length!=0){
		if(returnData.training_detail[0].manager_id == returnData.training_detail[0].login_id){
			$("#departmentApprovalForm").show();
			$("#process_training_content_tb2").hide();
			iconView(0);
		}
		else{
			iconView(1);
			$("#process_training_content_tb2").show();
			$("#departmentApprovalForm").hide();
		}
		if(returnData.training_detail[0].training_id != undefined && returnData.training_detail[0].training_id != null){
			training_name = returnData.training_detail[0].training_id
			request_type = 'E'
		}
		else{
			training_name = returnData.training_detail[0].training_name
			request_type = 'N'
		}
		htmlList = htmlList + '<h2>Training Name</h2> \
		<p>'+returnData.training_detail[0].training_name+'</p>\
		<h2>Organization</h2>\
		<p>'+returnData.training_detail[0].organization_name+'</p>\
		<h2>Organization Unit</h2><p>'+returnData.training_detail[0].organization_unit_name+'</p>\
		<h2>Division</h2>\
		<p>'+returnData.training_detail[0].team_name+'</p>\
		<h2>Reason for Training</h2>\
		<p>'+returnData.training_detail[0].request_reason+'</p>\
		<div id="readmore'+tabno+'" class="readMore" style="display: none">\
		<h2>Approval Status</h2><p>'+returnData.training_detail[0].approval_status+'</p>\
		<h2>Manager</h2>\
		<p>'+returnData.training_detail[0].manager_name+'</p>\
		<h2>Requested By</h2>\
		<p>'+returnData.training_detail[0].requested_by+'</p>\
		<h2>Requested on</h2>\
		<p>'+returnData.training_detail[0].requested_on+'</p>'
		+ (returnData.training_detail[0].approve_status == "R" ? '<h2>Rejected Reason</h2>\
		<p>'+returnData.training_detail[0].rejection_reason+'</p>' : "")+ '</div>\
		<a href="#readmore'+tabno+'"\
		class="readMore'+tabno+' readMoreClass">Read More</a>'
		updateData = {'training_id':returnData.training_detail[0].id,'division_id':returnData.training_detail[0].team_id,'request_type':request_type,'training_name':training_name,'manager_name':returnData.training_detail[0].manager_id,'reason_for_training':returnData.training_detail[0].request_reason,'remarks':returnData.training_detail[0].remarks,csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()}
		if(returnData.training_detail[0].approve_status == 'A'){
			$('#dep_approved_by').trigger('click')
			$('#dep_rejected_by').prop('checked',false) 
			updateData['approval_status'] = returnData.training_detail[0].approve_status
		}
		else if(returnData.training_detail[0].approve_status == 'R'){
			$('#dep_rejected_by').trigger('click')
			$('#dep_approved_by').prop('checked',false) 
			$('#LDrejectreason').val(returnData.training_detail[0].rejection_reason)
			updateData['approval_status'] = returnData.training_detail[0].approve_status
			updateData['rejection_reason'] = returnData.training_detail[0].rejection_reason
		}

	}
	$('#process_training_content_tb'+tabno).append(htmlList);

	
}

//pagination div
function paginationDiv(divId){
	paginationClick(1,divId);
	$('#job_pagination'+divId).each(function () {
		var foo = $(this);
		$(this).find('#'+divId+' ul li:gt(4)').hide();
		$(this).find('.next'+divId).click(function () {
			var last = $('#'+divId+' ul',foo).children('li:visible:last');
			last.nextAll(':lt(5)').show();
			last.next().prevAll().hide();
		});
		$(this).find('.prev'+divId).click(function () {
			var first = $('#'+divId+' ul',foo).children('li:visible:first');
			first.prevAll(':lt(5)').show();
			first.prev().nextAll().hide()
		});
	});
}

//pagination event function here
function paginationClick(id,divId){
	if(divId > 1){
		$('#process_training_pagination'+divId+'>prearrow').prop('disabled','false')
	}
	else if(divId == 1){
		$('#process_training_pagination'+divId+'>prearrow').prop('disabled','true')
	}
	$('.pagination_list').removeClass('activeEmployeeList');
	$('#ld_pagination_'+id+divId).addClass('activeEmployeeList');
	$('.paginationList').removeClass('active');
	$('#pag_'+id+divId).addClass('active');
}

function closeDiv(tabno){
	$("#page_id"+tabno).removeClass('col-sm-'+sizeVal)
	sizeVal = sizeVal - 2
	$("#page_id"+tabno).addClass('col-sm-'+sizeVal)
	$('.tablist_wrap_tb'+tabno).removeClass('tablist_active')
	departmentFormView();
	training_request_approval_clear();
	$('#process_training_tb'+tabno).hide()
	$('#process_training_list_db_tb'+tabno).addClass('col-md-12')
	$('#process_training_list_db_tb'+tabno).removeClass('col-md-8')
}
/** Checkbox Click Functionality Start **/
$(document).on('click', 'input[type="checkbox"]', function() {
	valCheck = $(this).val() 
	$('.errormessage').html("")
	if(valCheck == 'A'){
		$('#dep_rejected_by').prop('checked',false) 
		$('#reasonRejection').hide()
		updateData['rejection_reason'] = ''
	}
	else if(valCheck == 'R'){
		$('#dep_approved_by').prop('checked',false) 
		if($(this).prop('checked')==true){
			$('#reasonRejection').show()
		}
		else{
			$('#reasonRejection').hide()
		}
	}
	updateData['approval_status'] = valCheck
});

$(document).on('keyup','#LDrejectreason',function(){
	$('.errorTxt1').html("")
})

function validationCheck(){
	$('.errorTxt1').html("")
	if(updateData['approval_status'] == 'R'){
		rejection_reason = $('#LDrejectreason').val()
		updateData['rejection_reason'] = rejection_reason
	}
	if(updateData['approval_status']=='R' && updateData['rejection_reason']==''){
		$('.errorTxt1').append('<div id="LDrejectreason-error" class="error">Enter the rejection reason</div>');
		return false;
	}
	else{
		return true;
	}
}
/** Checkbox Click Functionality End **/

function training_request_approval_update(data,id,tab_no){
	returnStatus = ld_department_submit_validation();
	approveCheck = validationCheck();
	if(returnStatus && approveCheck){
		returnData = ajaxCall('post','/request_training_add_update/',updateData,false)
		if(returnData.status == 'NTE_03'){
			alert_lobibox("success", sysparam_datas_list[returnData.status]);
			training_request_approval_clear();
			tabClick(data,id,tab_no);
			tabcountShow();
		}
		else{
			alert_lobibox("error", sysparam_datas_list[returnData.status]);
		}
	}
}

/**	Validation for Drop Data Start **/
$.validator.addMethod("valueNotEquals", function(value, element, arg){
	if(value == 0) {
		return false
	} else {
		return true
	}
}, "Value must not equal arg.");
/**	Validation for Drop Data End **/

/** Validation For Employee Self Process Training Form Start **/ 
$('#ld_department_submit').submit(function(e) {
	e.preventDefault();
}).validate({

	rules: {
		dep_approval_status: {
			required: true,
		}, 
	},
	//For custom messages
	messages: {

		dep_approval_status: {
			required: "Update Approval Status",
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
/** Validation For Employee Self Process Training Form End **/ 

/** Validation Function for Department Approval Form Start **/
function ld_department_submit_validation(){
	return $('#ld_department_submit').valid();
}
/** Validation Function for Department Approval Form End **/

function training_request_approval_clear(){
	$('#dep_approved_by').prop('checked',false) 
	$('#dep_rejected_by').prop('checked',false) 
	$('#LDrejectreason').val('')
	$('#reasonRejection').hide()
	$('#dep_approval_status-error').html('')
}

function departmentDetailView(){
	$("#dep_details_btn_view").hide();
	$('#dep_form_btn_view').show();
	$("#process_training_content_tb2").show();
	$("#departmentApproval").hide();
}

function departmentFormView(){
	$("#dep_details_btn_view").show();
	$('#dep_form_btn_view').hide();
	$("#process_training_content_tb2").hide();
	$("#departmentApproval").show();
}


function inputSearch(thisData){
	var noneCount = 0
	var tab_no = thisData.id.split('_')[2]
	if (thisData.value.length) {
		var data = $("#no_data_found_"+tab_no+" .tablist_wrap").hide().filter(function() {
			var parent = $(this).parent()[0].id.split('_')[2];
			if($($(this).children()[0]).html().toLowerCase().indexOf(thisData.value.toLowerCase()) !== -1){
				$(".activeEmployeeList p").remove();
				if(parent == tab_no+1){
					$("#process_training_pagination"+tab_no).hide();
				}
				else{
					$("#process_training_pagination"+tab_no).show();
				}
				return true;
			}
			else{
				return false;
			}
		}).show();
		if(data.length==0){
			$(".activeEmployeeList p").remove();
			$("#process_training_pagination"+tab_no).hide();
			$(".activeEmployeeList").append('<p class="no_data_found">No Data Avaliable</p>');
		}
	} 
	else{
		$(".activeEmployeeList p").remove();
		$(".tablist_wrap").show();
	}

}

function iconView(detailClick){
	if(detailClick==1){
		$("#managerFormDetailView").html("")
		$("#managerFormDetailView").append("<div class='em_hide_show' id='dep_details_btn_view'\
				data-toggle='tooltip' data-placement='left'\
				title='Detail View'>\
				<i class='nf nf-bank-details exitIcons'></i>\
		</div>")
	}
	else if(detailClick==0){
		$("#managerFormDetailView").html("")
		$("#managerFormDetailView").append("<div class='em_hide_show' id='dep_details_btn_view'\
				onclick='departmentDetailView()'\
				data-toggle='tooltip' data-placement='left'\
				title='Detail View'>\
				<i class='nf nf-bank-details exitIcons'></i>\
				</div><div class='em_hide_show' id='dep_form_btn_view'\
				onclick='departmentFormView()' data-toggle='tooltip'\
				data-placement='left' title='Form View' style='display:none'>\
				<i class='nf nf-apparisal-form exitIcons'></i>\
		</div>")
	}

}