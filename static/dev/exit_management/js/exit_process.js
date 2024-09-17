var result_data,clr_data ;
var getUserID = 0;
$(document).ready(function(){
	dashboardEMProcess();
});
var datas = getFormValues("#department_submit");
var	csrf_data = datas.csrfmiddlewaretoken;

//job opening details
function dashboardEMProcess(){
	result_data = dbEMProcessDetails();
	if(result_data){
		dataPase();
	}
}

//data parsing function here
function dataPase(){
	dbListViewTb(result_data.em_request,1,'em_request');
	dbListViewTb(result_data.em_depapproval,2,'em_depapproval');
	dbListViewTb(result_data.em_hrapproval,3,'em_hrapproval');
	dbListViewTb(result_data.em_clearance,4,'em_clearance');
	dbListViewTb(result_data.em_exit,5,'em_exit');
	dbListViewTb(result_data.em_reject,6,'em_reject');
	dbHeaderLabel(result_data);//header tab view
	calendarView(result_data.em_request);//calendar view
	logInfo(result_data.log_details); //logger call in lib.js
}

//header count display
function dbHeaderLabel(data){
	$('#em_hrequest').html(data.em_request.length | 0);
	$('#em_hdepapproval').html(data.em_depapproval.length | 0);
	$('#em_hhrapproval').html(data.em_hrapproval.length | 0); 
	$('#em_hclearance').html(data.em_clearance.length | 0);
	$('#em_hexit').html(data.em_exit.length | 0);
	$('#em_hreject').html(data.em_reject.length | 0);
}
//read more content toggle
function readMore(divId){ 
	$('.readMore'+divId).click(function(e) {
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
}

//tabs start
//db job opening list view
function dbListViewTb(data,divId,key){
	if(data.length > 0){
		var list_content = '<div class="col-sm-12" id="job_opening_list_db_tb_search_'+divId+'"></div><div id="no_data_found_'+divId+'"><ul class="padding_0">';
		var pagination_content = '<div class="col-sm-2 pull-right" id="job_pagination'+divId+'"><div class="col-sm-1 btn prearrow prev'+divId+'" style="padding: 10px;"><i class="fa fa-angle-left"></i></div><div class="col-sm-7" id="'+divId+'"><ul class="pagination pagination-sm">';
		var list_count = 0;
		var pag_count = 0;
		for(var i=0; i<data.length; i++){
			list_count = list_count+1;
			if(list_count == 1){
				pag_count = pag_count + 1;
				list_content += '<li id="pagination_'+divId+pag_count+'" class="pagination_list'+divId+'" style="display: none;">';
				pagination_content += '<li class="paginationList'+divId+'" id="pag_'+divId+pag_count+'" onclick="paginationClick('+pag_count+','+divId+')"><a>'+pag_count+'</a>	</li>';
			}
			list_content += '<div class="tablist_wrap tablist_wrap_tb'+divId+'" id="tb'+divId+'-'+data[i].id+'" onclick="tablistClickEvent('+data[i].id+','+divId+')">';
			list_content += '<div class="col-sm-3 job_title" data-toggle="tooltip" data-placement="left" title="Employee Name">'+data[i].job_title+'</div>';
			list_content += '<div class="col-sm-3" data-toggle="tooltip" data-placement="left" title="Resignation Date">'+data[i].resi_date+'</div>';
			list_content += '<div class="col-sm-3" data-toggle="tooltip" data-placement="left" title="Department Approved Status">'+data[i].dep_status+'</div>';
			list_content += '<div class="col-sm-3" data-toggle="tooltip" data-placement="left" title="HR Approved Status">'+data[i].hr_status+'</div></div>';
			if(list_count == 5){
				list_content += '</li>';
				list_count = 0;
			}
		}
		list_content += '</ul><div class="col-sm-12" id="job_opening_list_db_tb_pag_'+divId+'"></div>';
		$('#job_opening_list_db_tb'+divId).html(list_content);
		pagination_content += '</ul></div><div class="col-sm-1 btn nextarrow next'+divId+'" style="padding: 10px;"><i class="fa fa-angle-right"></i></div></div>';
		if(pag_count != 1){
			$('#job_opening_list_db_tb_pag_'+divId).html(pagination_content);
		}
		$('#job_opening_list_db_tb_search_'+divId).html('<div class="col-sm-3" style="float: right;margin-bottom: 15px;margin-top: -50px;" id="'+key+'" data="'+divId+'" ><input class="form-control" placeholder="Search by Employee Name" id="job_name_'+divId+'" type="text"></div>');
		paginationDiv(divId);
		$('#job_name_'+divId+'').on("keyup", function(e) {
			if (e.keyCode == 13) {
				var searchDivId = $(this).parent().attr('data');
				var searchDataId = $(this).parent().attr('id');
				var searchValue = this.value;
				if(searchValue != ''){
					var searchDatas = dbSearchList({'getValue':searchValue,'getKey':searchDataId})//search content call
					if(searchDatas.length > 0){
						dbListViewTb(searchDatas,searchDivId,searchDataId);//search value parse
					}else{
						$('#no_data_found_'+searchDivId).html('<p class="ta_no_data_found">No Data Found !</p>');
					}
				}else{
					dataPase();
				}				
			}
		});
		//more than five page then only show left and right arrow
		if(data.length > 25){
			$('.nextarrow, .prearrow').show();
		}else{
			$('.nextarrow, .prearrow').hide();
		}
		
	}else{
		$('#job_opening_list_db_tb'+divId).html('<p class="ta_no_data_found">No Data Found<p>');
	}	
	$('[data-toggle="tooltip"]').tooltip();   
}

//search list in local data
function dbSearchList(data){
	var searchDatas = []
	var getData = result_data[data['getKey']];
	for(var i=0; i<getData.length; i++){
		var getNames = (getData[i].job_title).toString().toLowerCase();
		var searchValue = (data['getValue']).toString().toLowerCase();
		if (getNames.indexOf(searchValue) > -1) {
			  console.log(getData[i]);
			  searchDatas.push(getData[i]);
			} 
	}
	console.log("----search results--------->",searchDatas)
	return searchDatas;
}

//pagination event function here
function paginationClick(id,divId){
	$('.pagination_list'+divId).removeClass('activeEmployeeList');
	$('#pagination_'+divId+id).addClass('activeEmployeeList');
	$('.paginationList'+divId).removeClass('active');
	$('#pag_'+divId+id).addClass('active');
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


//db job opening list event  
function tablistClickEvent(getID,divId){
	getUserID = getID;
	var data = listViewEvent({'getId':getID,'tab':'tab'+divId});
	if(data.length > 0){
		var content = '';
		for(var i=0; i<data.length; i++){
			content += '<h2>Employee Name</h2>'+'<p>'+data[i].emp_name+'</p>';
			content += '<h2>Organization Name</h2>'+'<p>'+data[i].org_name+'</p>';
			content += '<h2>Organization Unit Name</h2>'+'<p>'+data[i].org_unit_name+'</p>';
			content += '<h2>Divison Name</h2>'+'<p>'+data[i].divison_name+'</p>';
			content += '<h2>Resignation Date</h2>'+'<p>'+data[i].res_date+'</p>';
			content += '<div id="readmore'+divId+'" class="readMore" style="display:none">';//read mored content here start
			if(data[i].emp_rel_reason != ''){
			content += '<h2>Employee Reason</h2>'+'<p>'+data[i].emp_rel_reason+'</p>'; 
			}
			if(data[i].emp_remarks != ''){
				content += '<h2>Employee Remarks</h2>'+'<p>'+data[i].emp_remarks+'</p>';
			}
			content += '<h2>Department Status</h2>'+'<p>'+data[i].dep_status+'</p>';
			content += '<h2>HR Status</h2>'+'<p>'+data[i].hr_status+'</p>';
			content += '</div><a href="#readmore'+divId+'" class="readMore'+divId+' readMoreClass">Read More</a>';//read mored content here end
		}
		$('#job_opening_content_tb'+divId).html(content);
		readMore(divId);//read more function call
		  
	}else{
		$('#job_opening_content_tb'+divId).html('<p class="ta_no_data_found">No Data Found<p>');
	}
	$('.tablist_wrap_tb'+divId).removeClass('tablist_active');
	$('#tb'+divId+'-'+getID).addClass('tablist_active');
	$('#job_opening_list_db_tb'+divId).addClass('col-md-8').removeClass('col-md-12');
	$('#job_pagination'+divId).addClass('col-sm-3').removeClass('col-sm-2');
	$('#job_opening_tb'+divId).show();
	
	//close button click
	$("#job_opening_close_tb"+divId).click(function(){
	$('#job_opening_list_db_tb'+divId).addClass('col-md-12').removeClass('col-md-4'); 
	$('#job_pagination'+divId).addClass('col-sm-2').removeClass('col-sm-3');
	$('#job_opening_tb'+divId).hide();
	});
	if(divId == 2 || divId == 3 || divId == 4){
		var dynamicAdd = divId == 2 ? departmentApproval(divId,data) : divId == 3 ? hrApproval(divId,data) : divId == 4 ? clrDetails(divId) : console.log('error');
	}
	
}
//tabs end

//department approval
function departmentApproval(divId,data){
	console.log(data)
	$('#depart_approved_id').val(data[0].dep_emp_id).trigger("change");
	$('#depart_remarks').val(data[0].dep_remarks);
	$('#relieving_date').val(data[0].exp_res_date);
	departmentFormView();
}

//department approval
function departmentUpdate(){
	var status = department_form_validation();
	var dep_app_status = $('#dep_approved_by').is(":checked");
	var dep_rej_status = $('#dep_rejected_by').is(":checked");
	if(( dep_app_status || dep_rej_status )){
		if( status ){
			var dep_change_by = $('#depart_approved_id').val();
			let emp_id = getEmployeeId(getUserID,'emp_id','em_exit_details');//get employee id 
			if(emp_id != dep_change_by){
				var dep_remark = $('#depart_remarks').val();
				var rel_date = $('#relieving_date').val().split('-')[2]+'-'+$('#relieving_date').val().split('-')[1]+'-'+$('#relieving_date').val().split('-')[0];
				var final_status = dep_app_status ? dep_app_status : dep_app_status
				datas = {csrfmiddlewaretoken:csrf_data,'final_status':final_status,'status':'department','dep_change_by':dep_change_by,'dep_remark':dep_remark,'id':getUserID,'rel_date':rel_date};
				updateStageApproval(datas); 
			}else{
				alert_lobibox("error", "Please Select valid Change by (Exit Employee and Change Employee is Same)."); 
			}
		}
	}else{
		alert_lobibox("error", "Please Check Rejected or Approved.");
	}
	
}

//updated statge
function updateStageApproval(datas){
	$.ajax({
		url : "/em_process_update/",
		type : "POST",
		data : datas,
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		var data = JSON.parse(json_data); 
		if(data['results'] == 1){
			dashboardEMProcess();
			$('#job_opening_close_tb2').trigger('click');
			alert_lobibox("success", "Department Status Updated Successfully.");
			departmentClear();
		}else if(data['results'] == 2){
			dashboardEMProcess();
			$('#job_opening_close_tb3').trigger('click');
			alert_lobibox("success", "HR Status Updated Successfully.");
			hrClear();
		}else if(data['results'] == 3){
			dashboardEMProcess();
			$('#job_opening_close_tb4').trigger('click');
			alert_lobibox("success", "Clearance Updated Successfully.");
			clrDetails();
		}else if(data['results'] == 4){
			dashboardEMProcess();
			$('#job_opening_close_tb4').trigger('click');
			alert_lobibox("success", "Asset Updated Successfully.");
		}
	});
}	

//department clear
function departmentClear(){
	$('#dep_approved_by,#dep_rejected_by').attr('checked', false);  
	$('#depart_approved_id').val('0').trigger("change");
	$('#depart_remarks,#relieving_date').val('');
}

$("#dep_approved_by,#dep_rejected_by").change(function() {
    var ischecked= $(this).is(':checked');
    if(ischecked){
    	if('dep_approved_by' == $(this).val()){
    		$('#dep_rejected_by').attr('checked', false);  
    	}else{
    		$('#dep_approved_by').attr('checked', false);  
    	}
    }
}); 

//details view
function departmentDetailView(){
	$('#dep_form_btn_view,#job_opening_content_tb2').show();
	$('#departmentApproval,#dep_details_btn_view').hide()
}

//form view
function departmentFormView(){
	$('#job_opening_content_tb2,#dep_form_btn_view').hide();
	$('#dep_details_btn_view,#departmentApproval').show();
}

//hr approval
function hrApproval(divId,data){
	$('#hr_approved_id').val(data[0].hr_emp_id).trigger("change");
	$('#hr_remarks').val(data[0].hr_remarks);
	$('#hr_relieving_date').val(data[0].exp_res_date);
	hrFormView();
}

//hr approval
function hrUpdate(){
	var status = hr_form_validation();
	var hr_app_status = $('#hr_approved_by').is(":checked");
	var hr_rej_status = $('#hr_rejected_by').is(":checked");
	if(( hr_app_status || hr_rej_status )){
		if( status ){
			var hr_change_by = $('#hr_approved_id').val();
			let emp_id = getEmployeeId(getUserID,'emp_id','em_exit_details');//get employee id 
			if(emp_id != hr_change_by){
				var hr_remark = $('#hr_remarks').val();
				var hr_date = $('#hr_relieving_date').val().split('-')[2]+'-'+$('#hr_relieving_date').val().split('-')[1]+'-'+$('#hr_relieving_date').val().split('-')[0];
				var final_status = hr_app_status ? hr_app_status : hr_app_status
				datas = {csrfmiddlewaretoken:csrf_data,'final_status':final_status,'status':'hr','hr_change_by':hr_change_by,'hr_remark':hr_remark,'id':getUserID,'rel_date':hr_date};
				updateStageApproval(datas); 
			}else{
				alert_lobibox("error", "Please Select valid Change by (Exit Employee and Change Employee is Same)."); 
			}
		}
	}else{
		alert_lobibox("error", "Please Check Rejected or Approved.");
	}
	
}

//hr clear
function hrClear(){
	$('#hr_approved_by,#hr_rejected_by').attr('checked', false);  
	$('#hr_approved_id').val('0').trigger("change");
	$('#hr_remarks,#hr_relieving_date').val('');
}

$("#hr_approved_by,#hr_rejected_by").change(function() {
    var ischecked= $(this).is(':checked');
    if(ischecked){
    	if('hr_approved_by' == $(this).val()){
    		$('#hr_rejected_by').attr('checked', false);  
    	}else{
    		$('#hr_approved_by').attr('checked', false);  
    	}
    }
}); 

//details view
function hrDetailView(){
	$('#hr_form_btn_view,#job_opening_content_tb3').show();
	$('#hrApproval,#hr_details_btn_view').hide()
}

//form view
function hrFormView(){
	$('#job_opening_content_tb3,#hr_form_btn_view').hide();
	$('#hr_details_btn_view,#hrApproval').show();
}


//clearance
function clrDetails(divId){
	console.log(clr_data)
	clrContentAppend('department','Department Clearance',clr_data[0].department);
	clrContentAppend('network','Network Clearance',clr_data[0].network);
	clrContentAppend('account','Account Clearance',clr_data[0].account);
	clrContentAppend('admin','Admin Clearance',clr_data[0].admins);
	clrContentAppend('relieve_status','Are You Sure Exit/Not',clr_data[0].relieve);
	clrFormView();
}

//clearance content append
var clrContent = '';
clrContent += '';
function clrContentAppend(id,title,clrDatas){
	clrContent += '<div class="col-md-12 '+id+'"><div class="caption"><h3 class="caption-subject  bold uppercase">'+title+'</h3><span id="'+id+'"></span></div>';
	for(var i=0; i<clrDatas.length; i++){
		var check_box_status = clrDatas[i].status == true ? 'checked' : ''; 
		clrContent += '<div class="col-md-6 padding-0"><div class="form-group"><div class="mt-checkbox-inline" style="padding: 0;"><label class="label-cbx" style="font-size: 12px;">';
		clrContent += clrDatas[i].name+'<input id="'+id+'-'+clrDatas[i].status+'" value="'+clrDatas[i].id+'" class="invisible '+id+'" name="'+id+'-'+clrDatas[i].status+'" type="checkbox" '+check_box_status+'>'
		clrContent += '<div class="checkbox margin-checkbox">\
			\<svg width="20px" height="20px" viewBox="0 0 20 20">\
			\<path d="M3,1 L17,1 L17,1 C18.1045695,1 19,1.8954305 19,3 L19,17 L19,17 C19,18.1045695 18.1045695,19 17,19 L3,19 L3,19 C1.8954305,19 1,18.1045695 1,17 L1,3 L1,3 C1,1.89543051.8954305,1 3,1 Z"></path>\
			\<polyline points="4 11 8 15 16 6"></polyline>\
			\</svg>\
			\</div></label></div></div></div>'
	}
	clrContent += '</div>';
	if(id == 'relieve_status'){
		 $('#clrApproval').html(clrContent);
		 $('#relieve_status').html('<span class="emasset_exit" onclick="assetUpdateExit('+clrDatas[0].id+')" data-toggle="tooltip" data-placement="top" title="Asset Mapping After Then Access Exit Status" >Asset Check</span>');
		 var clrDatas = clr_data[0].asset;
		 if(clrDatas != null && clrDatas.length>0){
			 $("input.relieve_status").attr('disabled','disabled');
		 }else{
			 $('.relieve_status').prop('disabled', false);
		 }
		 clrContent = '';
		 $('[data-toggle="tooltip"]').tooltip();   
	}
}

//exit before asset update
function assetUpdateExit(getEmId){
	var clrDatas = clr_data[0].asset;
	if(clrDatas != null && clrDatas.length>0){
		var assetContent = '<div class="col-md-12"><div class="caption"><h3 class="caption-subject  bold uppercase ex_asset_emp_id" id="'+clrDatas[0].emp_id+'">Name : '+clrDatas[0].name+'</h3></div><br>';
		for(var i=0; i<clrDatas.length; i++){
			var check_status = '';
			assetContent += '<div class="col-md-3 padding-0" data-toggle="tooltip" data-placement="top" title="Asset Name">'+clrDatas[i].asset_name+'</div>';
			assetContent += '<div class="col-md-3 padding-0" data-toggle="tooltip" data-placement="top" title="Asset Serial">'+clrDatas[i].asset_serial+'</div>';
			assetContent += '<div class="col-md-3 padding-0" data-toggle="tooltip" data-placement="top" title="Asset Given Date">'+clrDatas[i].given_date+'</div>';
			assetContent += '<div class="col-md-3 padding-0" data-toggle="tooltip" data-placement="top" title="Asset Taken Status"><div class="form-group"><div class="mt-checkbox-inline" style="padding: 0;"><label class="label-cbx" style="font-size: 12px;">';
			assetContent += '<input value="'+clrDatas[i].id+'" class="invisible assetverify" type="checkbox" '+check_status+'>'
			assetContent += '<div class="checkbox margin-checkbox">\
				\<svg width="20px" height="20px" viewBox="0 0 20 20">\
				\<path d="M3,1 L17,1 L17,1 C18.1045695,1 19,1.8954305 19,3 L19,17 L19,17 C19,18.1045695 18.1045695,19 17,19 L3,19 L3,19 C1.8954305,19 1,18.1045695 1,17 L1,3 L1,3 C1,1.89543051.8954305,1 3,1 Z"></path>\
				\<polyline points="4 11 8 15 16 6"></polyline>\
				\</svg>\
				\</div></label></div></div></div>'
		}
		assetContent += '</div>';
		$('#em_asset_list').html(assetContent);
		$('[data-toggle="tooltip"]').tooltip();   
		$('#emAssetUpdateModal').modal('show');
	}else{
		alert_lobibox("info", "Asset is not Allocated this Employee.");
		$('.relieve_status').prop('disabled', false);
	}

}

//asset update 
function assetEmUpdate(){
	var asset = clrUpdateCheckedValues('assetverify').join(); 
	var emp_id = $('.ex_asset_emp_id').attr('id');
	var clr_asset_checked_datas = { csrfmiddlewaretoken:csrf_data,'status':'assetverfy','asset':asset,'id':getUserID,'emp_id':emp_id};
	console.log('clr_checked_datas-->',clr_asset_checked_datas);
	updateStageApproval(clr_asset_checked_datas);
	$('.modal').trigger('click');
}

//clear clearance 
function assetEmclear(){
	 $('.assetverify').prop("checked", false);
}

//update clearance 
function clrUpdate(){
	var department = clrUpdateCheckedValues('department').join(); 
	var network = clrUpdateCheckedValues('network').join();
	var account = clrUpdateCheckedValues('account').join();
	var admin = clrUpdateCheckedValues('admin').join();
	var relieved = clrUpdateCheckedValues('relieve_status').join();
	var clr_checked_datas = { csrfmiddlewaretoken:csrf_data,'department':department,'network':network,'account':account,'admin':admin,'relieved':relieved,'status':'clearance','id':getUserID};
	console.log('clr_checked_datas-->',clr_checked_datas);
	updateStageApproval(clr_checked_datas);
}

//clearance checked values
function clrUpdateCheckedValues(cls){
	var selectedDepartment = [];
    $("."+cls+":checked").each(function() {
    	selectedDepartment.push(parseInt(this.value));
    });
    return selectedDepartment;
}

//clear clearance 
function clrClear(){
	 $('.department,.network,.account,.admin').prop("checked", false);
}


//details view
function clrDetailView(){
	$('#clr_form_btn_view,#job_opening_content_tb4').show();
	$('#clrApproval,#clr_details_btn_view,#clrApprovalBtn').hide()
}

//form view
function clrFormView(){
	$('#job_opening_content_tb4,#clr_form_btn_view').hide();
	$('#clr_details_btn_view,#clrApproval,#clrApprovalBtn').show();
}


//list view job opening
function listViewEvent(putDatas){
	var  res_data;
	putDatas['csrfmiddlewaretoken'] = $("input[name=csrfmiddlewaretoken]").val();
	$.ajax({ 
		url : '/em_process_event_details/',
		type : 'GET',
		data : putDatas, 
		timeout : 10000,
		async : false,
	}).done(function(json_data){ 
		var data = JSON.parse(json_data);
		res_data = data.datas;
		clr_data = data.clr_datas;
	});  
	return res_data
}

//list view event click
function dbEMProcessDetails(){
	var data;
	$.ajax({ 
		url : '/em_process_details/',
		type : 'GET',
		timeout : 10000,
		async : false,
	}).done(function(json_data){ 
		data = JSON.parse(json_data);
	});  
	return data
}

//calendar view
$('#db_icon_canlendar_view').click(function(){
	$('#db_job_list_view,#db_icon_canlendar_view').hide();
	$('#db_calendar_view,#db_icon_list_view').show();
});

//list view
$('#db_icon_list_view').click(function(){
	$('#db_calendar_view,#db_icon_list_view').hide();
	$('#db_job_list_view,#db_icon_canlendar_view').show();
});

//calendar view
function calendarView(data){
	if(data.length>0){
		var cal_datas = [];
		for(var i=0 ; i < data.length; i++){
			cal_datas.push({
				start: data[i].start_date,
				end: data[i].start_date,
				key1: data[i].job_title,
				key2: 'Exit Status : '+data[i].rel_status,
				url: '#',
				class: 'events', 
				color: '#000',
				getid: data[i].id
			});
		}
		$('.event-calendar').equinox({ 
			events: cal_datas,
			});
	}else{
		$('.event-calendar').html('<p class="ta_no_data_found">No Data found</p>');
	}	 
}

//calendar event
function calendarEvent(id){
	console.log("---Calendar Event ID---------->",id);
}

//jquery attendance validation
jQuery.validator.addMethod('valueNotEquals', function (value) {
  return (value != '0');
}, "year required");
$('.select2').select2().change(function(){
	$('.errorTxts').html('');
});
 
//department submit function here
$('#department_submit').submit(function(e) {
	  e.preventDefault();
	}).validate({
	 rules: {
		   depart_approved_id: {
			   valueNotEquals:true,
		   },
		   depart_remarks: {
			   required: true,
		   }, 
		   relieving_date: {
			   required: true,
		   }, 
	 },
	 //For custom messages
	 messages: {
		 depart_approved_id: {
			 valueNotEquals: "Select Employee",
		 },
		 depart_remarks: {
			 required: "Remark Must",
		 },
		 relieving_date: {
			   required:  "Exit Date Must",
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

//form is valid or not
function department_form_validation(){
		return $('#department_submit').valid();
	}
 
$('#hr_submit').submit(function(e) {
	  e.preventDefault();
	}).validate({
	 rules: {
		   hr_approved_id: { 
			   valueNotEquals:true,
		   }, 
		   hr_remarks: {
			   required: true,
		   },
		   hr_relieving_date: {
			   required: true,
		   }, 
	 },
	 //For custom messages
	 messages: {
		 hr_approved_id: {
			 valueNotEquals: "Select Employee",
		 },
		 hr_remarks: {
			 required: "Remark Must",
		 },
		 hr_relieving_date: {
			   required:  "Exit Date Must",
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

//form is valid or not
function hr_form_validation(){
		return $('#hr_submit').valid();
	}

