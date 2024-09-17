var result_data;
$(document).ready(function(){
	dashboardJobInterviewDetails();
});

//job opening details
function dashboardJobInterviewDetails(){
	result_data = dbJobOpeningDetails();
	if(result_data){
		dataPase();
	}
}

//data parsing function here
function dataPase(){
	dbListViewTb(result_data.interview,2,'interview');
	dbListViewTb(result_data.level1,3,'level1');
	dbListViewTb(result_data.level2,4,'level2');
	dbListViewTb(result_data.level3,5,'level3');
	dbListViewTb(result_data.level1clr,6,'level1clr');
	dbListViewTb(result_data.level2clr,7,'level2clr');
	dbListViewTb(result_data.level3clr,8,'level3clr');
	dbListViewTb(result_data.postponed,9,'postponed');
	dbListViewTb(result_data.canceled,10,'canceled');
	dbListViewTb(result_data.onhold,11,'job_onhold');
	dbHeaderLabel(result_data);//tab view
	calendarView(result_data.interview_calendar);//calendar view
	logInfo(result_data.log_details);//logger view call in lib.js
}

//header count display
function dbHeaderLabel(data){
	$('#interview').html(data.interview.length | 0);
	$('#level1').html(data.level1.length | 0);
	$('#level2').html(data.level2.length | 0);
	$('#level3').html(data.level3.length | 0);
	$('#level1clr').html(data.level1clr.length | 0);
	$('#level2clr').html(data.level2clr.length | 0);
	$('#level3clr').html(data.level3clr.length | 0);
	$('#postponed').html(data.postponed.length | 0);
	$('#cancelled').html(data.canceled.length | 0);
	$('#onhold').html(data.onhold.length | 0);
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

//edit the details function
function editEvent(getID){
	$('.tab_item_menu,.tab-pane,.step,.tab_item').removeClass('active activetab');
	$('#ex-tab1').addClass('active');
	recruitmentTableClick(getID);
	$('#form_view,#left').trigger('click');
}


//tabs start
//db job opening list view
function dbListViewTb(data,divId,key){
	console.log("---->",data)
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
				pagination_content += '<li class="pagenationList'+divId+'" id="pag_'+divId+pag_count+'" onclick="paginationClick('+pag_count+','+divId+')"><a>'+pag_count+'</a>	</li>';
			}
			list_content += '<div class="tablist_wrap tablist_wrap_tb'+divId+'" id="tb'+divId+'-'+data[i].id+'" onclick="tablistClickEvent('+data[i].id+','+divId+')">';
			list_content += '<div class="col-sm-3 job_title" data-toggle="tooltip" data-placement="left" title="Job Position">'+data[i].job_title+'</div>';
			list_content += '<div class="col-sm-3" data-toggle="tooltip" data-placement="left" title="Candidate Name">'+data[i].name+'</div>';
			list_content += '<div class="col-sm-3" data-toggle="tooltip" data-placement="left" title="Interview Type">'+data[i].type+'</div>';
			list_content += '<div class="col-sm-3"><span data-toggle="tooltip" data-placement="left" title="Interview Status">'+data[i].status+'</span><a data-toggle="tooltip" data-placement="left" title="Job Interview Tracking Details" class="taeditContent" href="#" onclick="trackingEvent('+data[i].candidate_id+')"><i class="nf nf-approve"></i></a><a data-toggle="tooltip" data-placement="left" title="Job Interview Edit" class="taeditContent" href="#" onclick="editEvent('+data[i].id+')"><i class="nf nf-update-1"></i></a></div></div>';
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
		$('#job_opening_list_db_tb_search_'+divId).html('<div class="col-sm-3" style="float: right;margin-bottom: 15px;margin-top: -50px;" id="'+key+'" data="'+divId+'" ><input class="form-control" placeholder="Search by Job Name" id="job_name_'+divId+'" type="text"></div>');
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
						$('#no_data_found_'+searchDivId).html('No Data Found !');
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

//interviwe tracking details
function trackingEvent(getId){
	let interview_details = listInterViewEvent({'candidate_id':getId});
	if(interview_details.length > 0){
		let tracking_details = '<div class="col-sm-12">';
		let tracking_len = interview_details.length;
		tracking_details += '<h4 class="tracking_heading">Final Stage : Level -'+(tracking_len)+'</h4>';
		for(i=0; i<tracking_len; i++){
			tracking_details += '<div class="col-sm-4 tracking_div">';
			tracking_details += '<h4>Level - '+(i+1)+'</h4>';
			tracking_details += '<p data-toggle="tooltip" data-placement="bottom" title="Candidate Name">Candidate Name : <b>'+interview_details[i].candidate+'</b></p>';
			tracking_details += '<p data-toggle="tooltip" data-placement="bottom" title="Interview Date">Interview Date : <b>'+interview_details[i].interview_date+'</b></p>';
			tracking_details += '<p data-toggle="tooltip" data-placement="bottom" title="Start Time">Start Time : <b>'+interview_details[i].from_time+'</b></p>';
			tracking_details += '<p data-toggle="tooltip" data-placement="bottom" title="End Time">End Time : <b>'+interview_details[i].to_time+'</b></p>';
			tracking_details += '<p data-toggle="tooltip" data-placement="bottom" title="Interview Status">Interview Status : <b>'+interview_details[i].interview_status+'</b></p>';
			tracking_details += '<p data-toggle="tooltip" data-placement="bottom" title="Interviewer">Interviewer : <b>'+interview_details[i].interviewer+'</b></p>';
			tracking_details += '<p data-toggle="tooltip" data-placement="bottom" title="Comments">Comments : <b>'+interview_details[i].comments+'</b></p>';
			tracking_details += '<p data-toggle="tooltip" data-placement="bottom" title="Rating">Rating : <b>'+interview_details[i].rating+'</b></p>';
			tracking_details += '</div>';
		}
		$('#tracking_details').html(tracking_details);
		$('[data-toggle="tooltip"]').tooltip();   
	}else{
		$('#tracking_details').html('<div class="col-sm-12"><p class="ta_no_data_found">No Data Found...<p></div>');
	}
	$('#interviewTrackingDetails').modal('show');
}

//list view interviwe tracking details
function listInterViewEvent(get_details){
	var  res_data;
	$.ajax({ 
		url : '/ta_interview_tracking_details/',
		type : 'GET',
		data : get_details, 
		timeout : 10000,
		async : false,
	}).done(function(json_data){ 
		var data = JSON.parse(json_data);
		res_data=data.results;
	});  
	return  res_data
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
	$('.pagenationList'+divId).removeClass('active');
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
	var data = listViewEvent({'getId':getID,'tab':'tab'+divId});
	if(data.length > 0){
		var content = '';
		for(var i=0; i<data.length; i++){
			content += '<h2>Name</h2>'+'<p>'+data[i].name+'</p>';
			content += '<h2>Interview Status</h2>'+'<p>'+data[i].status+'</p>';
			content += '<h2>Interview Date</h2>'+'<p>'+data[i].interview_date+'</p>';
			content += '<h2>From Time</h2>'+'<p>'+data[i].from_time+'</p>';
			content += '<div id="readmore'+divId+'" class="readMore" style="display:none">';//read mored content here start
			content += '<h2>To Time</h2>'+'<p>'+data[i].to_time+'</p>';
			content += '<h2>Interview Type</h2>'+'<p>'+data[i].type+'</p>';
			content += '<h2>Title</h2>'+'<p>'+data[i].job_title+'</p>';
			if (data[i].attach_name){
				var download_filename = 'NEXT_TRANSFORM_HCMS_BRANDING_'+currentDate()+'_'+data[i].doc_name;
				var file_name = '<a href="'+ta_interview_doc_path+data[i].attach_name+'" download="'+download_filename+'"><i class="nf nf-download" title="Document Download" style="color: #d277fe;font-size: 20px;"></i></a>';
				var file_view = '<a onclick="documentView(\''+ta_interview_doc_path+data[i].attach_name+'\')"><i class="nf nf-preview" title="Document Viewer" style="color: #d277fe;font-size: 20px;"></i></a>';
			}else{
				var file_name = 'No document found.Please upload it.',file_view = 'No document found.Please upload it.';
			}
			content += '<h2>Document Download: </h2>'+'<p><span>'+file_name+'</span></p>';
			content += '<h2>Document View: </h2>'+'<p><span>'+file_view+'</span></p>';
			content += '<h2>Interviewer Name</h2>'+'<p>'+data[i].interviewer_name+'</p>';
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
}
//tabs end

//list view job opening
function listViewEvent(putDatas){
	var  res_data;
	putDatas['csrfmiddlewaretoken'] = $("input[name=csrfmiddlewaretoken]").val();
	$.ajax({ 
		url : '/ta_job_interview_events/',
		type : 'GET',
		data : putDatas, 
		timeout : 10000,
		async : false,
	}).done(function(json_data){ 
		var data = JSON.parse(json_data);
		res_data=data.datas;
	});  
	return  res_data
}

//list view event click
function dbJobOpeningDetails(){
	var data;
	$.ajax({ 
		url : '/ta_job_interview_details/',
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


var counts = 0;
//calendar view
function calendarView(data){
	console.log("-------------Calendar View----------",data)
	if(data.length>0){
		counts += 1;
		$('.event-calendar').html('<div class="event-calendar'+counts+'"></div>')
		var cal_datas = [];
		for(var i=0 ; i < data.length; i++){
			cal_datas.push({
				start: data[i].interview_date,
				end: data[i].interview_date,
				key1: data[i].job_title,
				key2: 'Date : '+data[i].interview_date+'<br><br><span class="ta_interview_time">( Interview Head Count : '+data[i].count+' )</span>',
				key3: data[i].interview_date,
				url: '#',
				class: 'events',
				color: '#000',
				getid: data[i].id
			});
		}
		$('.event-calendar'+counts).equinox({
			events: cal_datas,
			});
	}else{
		$('.event-calendar').html('<p class="ta_no_data_found">No Data found</p>');
	}	
}

//calendar event
function calendarEvent(getID,date){
	console.log("---Calendar Event ID---------->",getID,date);
	var data = listViewEventInterview({'getId':getID,'date':date});
	var divId = 'Cal1'
	if(data.length > 0){
		var content = '';
		for(var i=0; i<data.length; i++){
			content += '<h2>Name</h2>'+'<p>'+data[i].name+'</p>';
			content += '<h2>Interview Status</h2>'+'<p>'+data[i].status+'</p>';
			content += '<h2>Interview Date</h2>'+'<p>'+data[i].interview_date+'</p>';
			content += '<h2>From Time</h2>'+'<p>'+data[i].from_time+'</p>';
			content += '<h2>To Time</h2>'+'<p>'+data[i].to_time+'</p>';
			content += '<h2>Interview Type</h2>'+'<p>'+data[i].type+'</p>';
			content += '<h2>Title</h2>'+'<p>'+data[i].job_title+'</p>';
			content += '<h2>Interviewer Name</h2>'+'<p>'+data[i].interviewer_name+'</p>';
			if(data.length > 1 && data.length != (i+1)){
				content += '<hr></hr>';
			}
		}
		$('#job_calendar_content_tb1').html(content);		  
	}else{
		$('#job_calendar_content_tb1').html('<p class="ta_no_data_found">No Data Found<p>');
	}
	
	$('#job_calendar_list').addClass('col-md-8').removeClass('col-md-12');
	$('.key1,.key2').addClass('devCalendarFontsActive');
	$('#job_calendar_des').show();
	
}

//calendar close button click
$("#job_calendar_close_tb").click(function(){
	$('#job_calendar_list').addClass('col-md-12').removeClass('col-md-8');
	$('.key1,.key2').removeClass('devCalendarFontsActive');
	$('#job_calendar_des').hide();
});


//document view function here
function documentView(path){
	var target = document.getElementById("targetDiv");
	var newFrame = document.createElement("iframe");
	newFrame.setAttribute("src", path);
	newFrame.setAttribute("title", "Document View");
	newFrame.setAttribute("height", "400px");
	newFrame.setAttribute("width", "100%");
	newFrame.setAttribute("alt", " <p>Your browser does not support iframes.</p>");
	target.appendChild(newFrame);
	if(myBrowserFunction().toString() == 'Chrome'){
		$('#documentView').modal('show');
	}else{
		alert_lobibox("info",'Your browser does not support. So Download here please check it.')
	}
}
//trigger calendar view
$('#db_icon_canlendar_view').trigger('click');

//list view event interview
function listViewEventInterview(putDatas){
	var  res_data;
	putDatas['csrfmiddlewaretoken'] = $("input[name=csrfmiddlewaretoken]").val();
	$.ajax({ 
		url : '/ta_job_interview_calendar_events/',
		type : 'GET',
		data : putDatas, 
		timeout : 10000,
		async : false,
	}).done(function(json_data){ 
		var data = JSON.parse(json_data);
		res_data=data.datas;
	});  
	return  res_data
}