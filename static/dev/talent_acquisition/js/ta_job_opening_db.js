var result_data ;
$(document).ready(function(){
	dashboardJobOpeningDetails();
});

//job opening details
function dashboardJobOpeningDetails(){
	result_data = dbJobOpeningDetails();
	if(result_data){
		dataPase();
	}
}

//data parsing function here
function dataPase(){
	dbListViewTb(result_data.job_opening,2,'job_opening');
	dbListViewTb(result_data.job_full_time,3,'job_full_time');
	dbListViewTb(result_data.job_part_time,4,'job_part_time');
	dbListViewTb(result_data.job_contractual,5,'job_contractual');
	dbListViewTb(result_data.job_freelance,6,'job_freelance');
	dbListViewTb(result_data.job_intership,7,'job_intership');
	dbListViewTb(result_data.job_inprocess,8,'job_inprocess');
	dbListViewTb(result_data.job_filled,9,'job_filled');
	dbListViewTb(result_data.job_canceled,10,'job_canceled');
	dbListViewTb(result_data.job_onhold,11,'job_onhold');
	dbHeaderLabel(result_data);//header tab view
	calendarView(result_data.job_opening);//calendar view
	logInfo(result_data.log_details); //logger call in lib.js
}

//header count display
function dbHeaderLabel(data){
	$('#hopening').html(data.job_opening.length | 0);
	$('#hfulltime').html(data.job_full_time.length | 0);
	$('#hparttime').html(data.job_part_time.length | 0); 
	$('#hcontractual').html(data.job_contractual.length | 0);
	$('#hfreelance').html(data.job_freelance.length | 0);
	$('#hinternship').html(data.job_intership.length | 0);
	$('#hinprocess').html(data.job_inprocess.length | 0); 
	$('#hfilled').html(data.job_filled.length | 0);
	$('#hcancelled').html(data.job_canceled.length | 0);
	$('#honhod').html(data.job_onhold.length | 0);
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
	job_opening_rowclick(getID);
	$('#form_view,#left').trigger('click');
}

//edit the details function
function jobEvent(getID){
	job_opening_rowclick(getID);
	listViewPostJob(getID);
}

//post job in list view
function listViewPostJob(getID){
	jb_status = '1';
	var job_title = $('#job_title').val();
	publishConfirmation('jobPuslishStatus',getID, job_title,'')
}

/*//publish to server
function publishListToJobs(datas){
	$.ajax({
		url : '/ta_job_posting_data/',
		type : 'POST',
		timeout : 10000, 
		data:datas,
		async:false,
	}).done(function(json_data){
		data = JSON.parse(json_data);
		alert_lobibox("success", "Your Jobs Added.Later it will be Published.");
		$('.close').trigger('click');
	});
}*/

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
			list_content += '<div class="col-sm-3 job_title" data-toggle="tooltip" data-placement="left" title="Job Position">'+data[i].job_title+'</div>';
			list_content += '<div class="col-sm-3" data-toggle="tooltip" data-placement="left" title="Number of Vacancies">Number of Vacancies<span class="count">'+data[i].number_of_positions+'</span></div>';
			list_content += '<div class="col-sm-2" data-toggle="tooltip" data-placement="left" title="Job Opening Status">'+data[i].job_status+'</div>';
			list_content += '<div class="col-sm-4"><div class="col-sm-5" data-toggle="tooltip" data-placement="left" title="Job Type">'+data[i].job_type+'</div><div class="col-sm-5"  data-toggle="tooltip" data-placement="left" title="This Job Publish To Join Us (NEXT Website).Click to Publish" onclick="jobEvent('+data[i].id+')"><span><img style="margin-top: -5px;height: 30px;" src="/static/ui/images/fliplogo.png" alt="image not found"/></span></div><div class="col-sm-2" data-toggle="tooltip" data-placement="left" title="Job Opening Edit" onclick="editEvent('+data[i].id+')"> <a  class="taeditContent" href="#" ><i class="nf nf-update-1"></i></a></div></div></div>';
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
		$('#job_opening_list_db_tb_search_'+divId).html('<div class="col-sm-3" style="float: right;margin-bottom: 15px;margin-top: -50px;" id="'+key+'" data="'+divId+'" ><input class="form-control" placeholder="Search by Job Title" id="job_name_'+divId+'" type="text"></div>');
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
	var data = listViewEvent({'getId':getID,'tab':'tab'+divId});
	if(data.length > 0){
		var content = '';
		for(var i=0; i<data.length; i++){
			content += '<h2>Organization Name</h2>'+'<p>'+data[i].org_name+'</p>';
			content += '<h2>Job Name</h2>'+'<p>'+data[i].job_title+'</p>';
			content += '<h2>Key Skills</h2>'+'<p>'+data[i].key_skills+'</p>';
			content += '<h2>Number of Vacancies</h2>'+'<p>'+data[i].number_of_positions+'</p>';
			content += '<div id="readmore'+divId+'" class="readMore" style="display:none">';//read mored content here start
			content += '<h2>Created Date</h2>'+'<p>'+data[i].date_opened+'</p>';
			content += '<h2>Target Date</h2>'+'<p>'+data[i].target_date+'</p>';
			content += '<h2>Salary</h2>'+'<p>'+data[i].salary+'</p>'; 
			content += '<h2>Status</h2>'+'<p>'+data[i].job_status+'</p>';
			content += '<h2>Experience</h2>'+'<p>'+data[i].job_exp+'</p>';
			content += '<h2>Job Type</h2>'+'<p>'+data[i].job_type+'</p>';
			content += '<h2>Shift Type</h2>'+'<p>'+data[i].job_shift+'</p>';
			content += '<h2>Location</h2>'+'<p>'+data[i].job_location+'</p>';
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
		url : '/ta_job_openings_events/',
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
		url : '/ta_job_openings_details/',
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
				end: data[i].target_date,
				key1: data[i].job_title,
				key2: data[i].job_location,
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
$('#tab1').find('.spantext').addClass('taFirstTab');