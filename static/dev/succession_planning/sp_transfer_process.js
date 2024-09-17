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
	dbListViewTb(result_data.sp_request,1,'sp_request');
	dbListViewTb(result_data.sp_depapproval,2,'sp_depapproval');
	dbListViewTb(result_data.sp_hrapproval,3,'sp_hrapproval');
	dbListViewTb(result_data.sp_exit,4,'sp_exit');
	dbListViewTb(result_data.sp_reject,5,'sp_reject');
	dbHeaderLabel(result_data);//header tab view
	calendarView(result_data.sp_request);//calendar view
	logInfo(result_data.log_details); //logger call in lib.js
}

//header count display
function dbHeaderLabel(data){
	$('#sp_hrequest').html(data.sp_request.length | 0);
	$('#sp_hdepapproval').html(data.sp_depapproval.length | 0);
	$('#sp_hhrapproval').html(data.sp_hrapproval.length | 0); 
	$('#sp_hexit').html(data.sp_exit.length | 0);
	$('#sp_hreject').html(data.sp_reject.length | 0);
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
			list_content += '<div class="col-sm-3" data-toggle="tooltip" data-placement="left" title="Transfer Date">'+data[i].resi_date+'</div>';
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
			content += '<h2>Exp. Transfer Date</h2>'+'<p>'+data[i].res_date+'</p>';
			content += '<div id="readmore'+divId+'" class="readMore" style="display:none">';//read mored content here start
			content += '<h2>Employee Transfer Organization Unit </h2>'+'<p>'+data[i].torg_unit_name+'</p>';
			content += '<h2>Employee Transfer Organization Divison </h2>'+'<p>'+data[i].tdivison_name+'</p>'; 
			content += '<h2>Employee Remarks</h2>'+'<p>'+data[i].emp_remarks+'</p>';
			content += '<h2>Department Status</h2>'+'<p>'+data[i].dep_status+'</p>';
			content += '<h2>Department Notes</h2>'+'<p>'+data[i].dep_remarks+'</p>';
			content += '<h2>HR Status</h2>'+'<p>'+data[i].hr_status+'</p>';
			content += '<h2>HR Notes</h2>'+'<p>'+data[i].hr_remarks+'</p>';
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
	if(divId == 2 || divId == 3 ){
		var dynamicAdd = divId == 2 ? departmentApproval(divId,data) : divId == 3 ? hrApproval(divId,data) : console.log('error');
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
			let emp_id = getEmployeeId(getUserID,'emp_id','sp_transfer_details');//get employee id 
			if(emp_id != dep_change_by){
				var dep_remark = $('#depart_remarks').val();
				var final_status = dep_app_status ? dep_app_status : dep_app_status
				datas = {csrfmiddlewaretoken:csrf_data,'final_status':final_status,'status':'department','dep_change_by':dep_change_by,'dep_remark':dep_remark,'id':getUserID};
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
		url : "/sp_transfer_process_update/",
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
    var ischecked = $(this).is(':checked');
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
			let emp_id = getEmployeeId(getUserID,'emp_id','sp_transfer_details');//get employee id 
			if(emp_id != hr_change_by){
				var hr_remark = $('#hr_remarks').val();
				var final_status = hr_app_status ? hr_app_status : hr_app_status
				datas = {csrfmiddlewaretoken:csrf_data,'final_status':final_status,'status':'hr','hr_change_by':hr_change_by,'hr_remark':hr_remark,'id':getUserID};
				updateStageApproval(datas); 
			}
			else{
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

//list view job opening
function listViewEvent(putDatas){
	var  res_data;
	putDatas['csrfmiddlewaretoken'] = $("input[name=csrfmiddlewaretoken]").val();
	$.ajax({ 
		url : '/sp_transfer_process_event_details/',
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
		url : '/sp_transfer_process_details/',
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
	console.log(data)
	if(data.length>0){
		var cal_datas = [];
		for(var i=0 ; i < data.length; i++){
			cal_datas.push({
				start: data[i].start_date,
				end: data[i].start_date,
				key1: data[i].job_title,
				key2: 'Transfer Status : '+data[i].rel_status,
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
	 },
	 //For custom messages
	 messages: {
		 depart_approved_id: {
			 valueNotEquals: "Select Employee",
		 },
		 depart_remarks: {
			 required: "Remark Must",
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
	 },
	 //For custom messages
	 messages: {
		 hr_approved_id: {
			 valueNotEquals: "Select Employee",
		 },
		 hr_remarks: {
			 required: "Remark Must",
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

