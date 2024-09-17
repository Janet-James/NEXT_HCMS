$(document).ready(function(){
	LDTableProcess();
});
var getUserID =''
var role_data =''

//job opening details
function LDTableProcess(){
	result_data = LDProcessDetails();
	if(result_data){ dataPase(); }
}

//list view event click
function LDProcessDetails(){
	var data;
	$.ajax({ 
		url : '/cost_evaluate_process_details/',
		type : 'GET',
		timeout : 10000,
		async : false,
	}).done(function(json_data){ 
		data = json_data
	});  
	return data
}

//details view
function budgetDetailView(){
	$('#hr_form_btn_view,#job_opening_content_tb3').show();
	$('#hrApproval,#hr_details_btn_view').hide()}

//form view
function budgetFormView(){
	if(role_data=='Reject'){
		$('#hr_form_btn_view').hide(),$('#hr_details_btn_view,#job_opening_content_tb').show()}
	else{
	$('#job_opening_content_tb3,#hr_form_btn_view').hide();
	$('#hr_details_btn_view,#hrApproval').show();}
}

//data parsing function here
function dataPase(){
	dbListViewTb(result_data.ld_request,1,'ld_request');
	dbListViewTb(result_data.ld_manager,3,'ld_manager');
	dbListViewTb(result_data.ld_approved,4,'ld_approved');
	dbListViewTb(result_data.ld_rejected,5,'ld_rejected');
	dbHeaderLabel(result_data);//header tab view
//	calendarView(result_data.ld_request);//calendar view
//	logInfo(result_data.log_details); //logger call in lib.js
}
//header count display
function dbHeaderLabel(data){
	$('#ld_request').html(data.ld_request.length | 0);
	$('#ld_approval').html(data.ld_manager.length | 0); 
	$('#ld_approved').html(data.ld_approved.length | 0);
	$('#ld_rejected').html(data.ld_rejected.length | 0);
}

$(".step").click(function(){
	LDTableProcess()
	$('#job_opening_list_db_tb1,#job_opening_list_db_tb3,#job_opening_list_db_tb4,#job_opening_list_db_tb5').addClass('col-md-12').removeClass('col-md-4'); 
	$('#job_pagination1,#job_pagination3,#job_pagination4,#job_pagination5').addClass('col-sm-2').removeClass('col-sm-3');
	$('#job_opening_tb1,#job_opening_tb3,#job_opening_tb4,#job_opening_tb5').hide();
})
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
			list_content += '<div class="col-sm-3 job_title" data-toggle="tooltip" data-placement="left" title="Training Name">'+data[i].training_name+'</div>';
			list_content += '<div class="col-sm-3" data-toggle="tooltip" data-placement="left" title="Start Date">'+data[i].start_date+'</div>';
			list_content += '<div class="col-sm-3" data-toggle="tooltip" data-placement="left" title="End Date">'+data[i].end_date+'</div>';
			list_content += '<div class="col-sm-3" data-toggle="tooltip" data-placement="left" title="Manager Approved Status">'+data[i].approval_status+'</div></div>';
			if(list_count == 5){
				list_content += '</li>';
				list_count = 0;
			}
		}
		list_content += '</ul><div class="col-sm-12" id="job_opening_list_db_tb_pag_'+divId+'"></div>';
		$('#job_opening_list_db_tb'+divId).html(list_content);
		pagination_content += '</ul></div><div class="col-sm-1 btn nextarrow next'+divId+'" style="padding: 10px;"><i class="fa fa-angle-right"></i></div></div>';
		if(pag_count != 1){ $('#job_opening_list_db_tb_pag_'+divId).html(pagination_content); }
		$('#job_opening_list_db_tb_search_'+divId).html('<div class="col-sm-3" style="float: right;margin-bottom: 15px;margin-top: -50px;" id="'+key+'" data="'+divId+'" ><input class="form-control" placeholder="Search by Training Name" id="job_name_'+divId+'" type="text"></div>');
		paginationDiv(divId);
//		$('#job_name_'+divId+'').on("keyup", function(e) {
////			if (e.keyCode == 13) {
//				var searchDivId = $(this).parent().attr('data');
//				var searchDataId = $(this).parent().attr('id');
//				var searchValue = this.value;
//				if(searchValue != ''){
//					var searchDatas = dbSearchList({'getValue':searchValue,'getKey':searchDataId})//search content call
//					if(searchDatas.length > 0){
//						dbListViewTb(searchDatas,searchDivId,searchDataId);//search value parse
//					}else{ $('#no_data_found_'+searchDivId).html('<p class="ta_no_data_found">No Data Found !</p>'); }
//				}else{ 	dataPase(); }				
////			}
//		});
	}else{ $('#job_opening_list_db_tb'+divId).html('<p class="ta_no_data_found">No Data Found<p>'); }	
	$('[data-toggle="tooltip"]').tooltip();   
}

var count = 0;
$(document).on("keyup",'#job_name_1,#job_name_3,#job_name_4,#job_name_5',function() {
    if (this.value.length) {
        var that = this;
        $(".tablist_wrap").hide().filter(function() {
            if($($(this).children()[0]).html().toLowerCase().indexOf(that.value.toLowerCase()) !== -1){
                count = count+1;
                $(".activeEmployeeList p").remove();
                return true;
            }
            else{
                $(".activeEmployeeList p").remove();
                if(count<1){
                    $(".activeEmployeeList").append('<p class="no_data_found">No Data Found.</p>');
                }
                else{
                    count = count -1;
                }
                return false;
            }
        }).show();
    } 
    else{
        $(".activeEmployeeList p").remove();
        $(".tablist_wrap").show();
    }
})

//search list in local data
function dbSearchList(data){
	var getData = result_data[data['getKey']];
	var searchDatas = []
	for(var i=0; i<getData.length; i++){
		var getNames = (getData[i].training_name).toString().toLowerCase();
		var searchValue = (data['getValue']).toString().toLowerCase();
		if (getNames.indexOf(searchValue) > -1) {
			  searchDatas.push(getData[i]);
			} 
	}return searchDatas;
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
	$('.pagination_list'+divId).removeClass('activeEmployeeList');
	$('#pagination_'+divId+id).addClass('activeEmployeeList');
	$('.paginationList'+divId).removeClass('active');
	$('#pag_'+divId+id).addClass('active');
}

//db job opening list event  
function tablistClickEvent(getID,divId){
	getUserID = getID;
	var data = listViewEvent({'getId':getID,'tab':'tab'+divId});
	if(data.length > 0) {   role_data = data[0].user_role   }
	else { role_data = []   }
	if(data.length > 0){
		var content = '';
		for(var i=0; i<data.length; i++){
			content += '<h2>Training Name</h2>'+'<p>'+data[i].training_name+'</p>';
			content += '<h2>Division Name</h2>'+'<p>'+data[i].name+'</p>';
			content += '<h2>Training Type</h2>'+'<p>'+data[i].description+'</p>';
			content += '<h2>Start Date</h2>'+'<p>'+data[i].start_date+'</p>';
			content += '<h2>End Date</h2>'+'<p>'+data[i].end_date+'</p>';
			content += '<h2>Requested By</h2>'+'<p>'+data[i].emp_name+' '+data[i].last_name+'</p>';
			content += '<h2>Requested On</h2>'+'<p>'+data[i].created_on+'</p>';
			content += '<h2>Request To</h2>'+'<p>'+data[i].role_title+'</p>';
			content += '<div id="readmore'+divId+'" class="readMore" style="display:none">';//read mored content here start
			content += '<h2>Training Hours</h2>'+'<p>'+data[i].training_hours.toFixed(2)+'</p>';
			content += '<h2>Cost Per Hour</h2>'+'<p>'+data[i].cost_per_hour+'</p>'; 
			if(data[i].approval_status=='R'){
				document.getElementById("rejected_by").checked = true;	
				document.getElementById("approved_by").checked = false;
				$('#remarks').val(data[i].rejection_reason)
				content += '<h2>Approval Status</h2>'+'<p>Rejected</p>';
				content += '<h2>Reject Reason</h2>'+'<p>'+data[i].rejection_reason+'</p>';
			}
			else if(data[i].approval_status=='A'){
				$('#remarks').val('')
				$('#reject_reason').hide()
				document.getElementById("rejected_by").checked = false;
				document.getElementById("approved_by").checked = true;
				content += '<h2>Approval Status</h2>'+'<p>Approved</p>';
			}
			else{ $('#reject_reason').hide() }
			content += '</div><a href="#readmore'+divId+'" class="readMore'+divId+' readMoreClass">Read More</a>';//read mored content here end
		}
		$('#job_opening_content_tb'+divId).html(content);
		readMore(divId);//read more function call
		if(data[0].user_role=='Reject'){ $('#hrApproval').hide(),budgetDetailView()}
		else{ $('#hrApproval').show(),budgetFormView()}
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
//list view job opening
function listViewEvent(putDatas){
	var  res_data;
	putDatas['csrfmiddlewaretoken'] = $("input[name=csrfmiddlewaretoken]").val();
	$.ajax({ 
		url : '/ld_cost_process_event_details/',
		type : 'GET',
		data : putDatas, 
		timeout : 10000,
		async : false,
	}).done(function(json_data){ 
		var data = json_data
		res_data = data.datas;
	});  
	return res_data
}

$('#approved_by').change(function(){ $('#reject_reason').hide() })
$('#rejected_by').change(function(){ $('#reject_reason').show() })

//Manager approval
function managerUpdate(){
	var approval_data = $('input[name=approval_status]:checked').val();
	if(approval_data == 'rejected'){
		if($('#remarks').val() != ''){update(approval_data)}
		else{$(".remarks").html("The Reject Reason is required"),alert_lobibox("error", "Give Remarks");}
	}if(approval_data == 'approved'){update(approval_data)}
}	
$(document).on("keyup",function() {
	if($('#remarks').val() != ''){$(".remarks").html(" ")}
	else{$(".remarks").html("The Reject Reason is required")}
})

function update(datas){
	$.ajax({
		url : "/ld_status_update/",
		type : "GET",
		data : {'data':datas,'id':getUserID,'remark':$('#remarks').val()},
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		var data = json_data
		if(data.datas=='Updated Successfully'){ alert_lobibox("success", "Budget Status Updated Successfully."),LDTableProcess(); }
		else{ alert_lobibox("error", "Updated Failed");}
		tablistClickEvent(getUserID,'3');
	});
}
