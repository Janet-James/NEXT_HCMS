var result_data;
$( document ).ready(function() {
	// Candidate Details Listing
	drawCandidateList();
});

// Function call to retrieve all candidate details
function candidateListDetails(key,tab){
	$.ajax({
		url : "/ta_candidate_list_details/",
		type : "POST",
		data: {
			 "tab":tab,
			 "key":key,
			 csrfmiddlewaretoken : $("input[name=csrfmiddlewaretoken]").val()
		},
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		data = JSON.parse(json_data);
	});
	return data
}

//setting candidate details in tabs
function drawCandidateList(){		
		result_data = candidateListDetails();	    
		var res_datas = data.candidate_res;
		var res_screening = data.candidate_screening;
		var res_hired = data.candidate_hired;
		var res_offer = data.candidate_offer;
		var res_interview = data.candidate_interview;
		var emp_referral = data.employee_referral;
		var external_referral = data.external_referral;
		var website = data.candidate_website;
		var walkin = data.candidate_walkin;
		
		
		listCandidateDetails(res_datas,2,'candidate_res','candidate_count');
		listCandidateDetails(res_screening,3,'candidate_screening','screening_count');
		listCandidateDetails(res_hired,6,'candidate_hired','hired_count');
		listCandidateDetails(res_offer,5,'candidate_offer','offer_count');
		listCandidateDetails(res_interview,4,'candidate_interview','interview_count');
		listCandidateDetails(emp_referral,7,'employee_referral','employee_referral_count')
		listCandidateDetails(external_referral,8,'external_referral','external_referral_count');
		listCandidateDetails(website,9,'candidate_website','website_count');
		listCandidateDetails(walkin,10,'candidate_walkin','walkin_count');
		listCandidateDetails(website,11,'candidate_website','job_board_count');
		logInfo(result_data.log_details); //logger call in lib.js
}

//edit the details function
function editEvent(getID){
	$('.tab_item_menu,.lo-tab-pane,.step,.tab_item').removeClass('lo-active activetab');
	$('#ex-tab1').addClass('lo-active');
	$('#ta_candidate_list').val(getID).trigger('change');
}

//setting candidate details in tabs 
function listCandidateDetails(data,divId,key,count){	
	var verticalViewData = '';
	if(data.length>0){		
		verticalViewData = '<div class="col-sm-12" id="candidate_list_db_tb_search_'+divId+'"></div><div id="no_data_found_'+divId+'"><ul class="padding_0">';		
		var pagination_content = '<div class="col-sm-2 pull-right" id="candidate_pagination'+divId+'"><div class="col-sm-1 btn prearrow prev'+divId+'" style="padding: 10px;"><i class="fa fa-angle-left"></i></div><div class="col-sm-7" id="'+divId+'"><ul class="pagination pagination-sm">';
		var list_count = 0;
		var pag_count = 0;
		for(var i=0; i<data.length; i++){	
			var experience;
			if(data[i].experience > 0)
			{
				experience = "Experienced";
			}else{
				experience = "Fresher";
			}
			
			list_count = list_count+1;
			if(list_count == 1){
				pag_count = pag_count + 1;
				verticalViewData += '<li id="pagination_'+divId+pag_count+'" class="pagination_list'+divId+'" style="display: none;">';
				pagination_content += '<li class="pagenationList'+divId+'" id="pag_'+divId+pag_count+'" onclick="paginationClick('+pag_count+','+divId+')"><a>'+pag_count+'</a>	</li>';
			}
			verticalViewData += '<div class="tablist_wrap tablist_wrap_tb'+divId+'" id="tb'+divId+'-'+data[i].id+'" onclick="candidateDetailsClick('+data[i].id+','+divId+')">';																																		
			verticalViewData += '<div class="col-sm-3 job_title" data-toggle="tooltip" data-placement="left" title="Candidate Name">'+data[i].candidate_name+'</div>';
			verticalViewData += '<div class="col-sm-3" data-toggle="tooltip" data-placement="left" title="Job Position">'+data[i].job_title+'</div>';
			verticalViewData += '<div class="col-sm-3" data-toggle="tooltip" data-placement="left" title="Candidate Status">'+data[i].candidate_status+'</div>';
			verticalViewData += '<div class="col-sm-3" ><span  data-toggle="tooltip" data-placement="left" title="Candidate Experience">'+experience+'</span><a data-toggle="tooltip" data-placement="left" title="Edit Details" class="taeditContent" href="#" onclick="editEvent('+data[i].id+')"><i class="nf nf-update-1"></i></a></div>';
			verticalViewData += '</div>';
			if(list_count == 5){
				verticalViewData += '</li>';
				list_count = 0;
			}
		}
		verticalViewData += '</ul><div class="col-sm-12" id="candidate_list_db_tb_pag_'+divId+'"></div>';
		$('#candidate_list'+'_'+divId).html(verticalViewData);
		$('#'+count).html(data.length)
		pagination_content += '</ul></div><div class="col-sm-1 btn nextarrow next'+divId+'" style="padding: 10px;"><i class="fa fa-angle-right"></i></div></div>';
		if(pag_count != 1){
			$('#candidate_list_db_tb_pag_'+divId).html(pagination_content);
		}
		
		$('#candidate_list_db_tb_search_'+divId).html('<div class="col-sm-3" style="float: right;margin-bottom: 15px;margin-top: -50px;" id="'+key+'" data="'+divId+'" ><input class="form-control" placeholder="Search by Candidate Name" id="candidate_name_'+divId+'" type="text"></div>');

		paginationDiv(divId);
		$('#candidate_name_'+divId+'').on("keyup", function(e) {
			if (e.keyCode == 13) {
				var searchDivId = $(this).parent().attr('data');
				var searchDataId = $(this).parent().attr('id');
				var searchValue = this.value;
				
				if(searchValue != ''){
					var searchDatas = dbSearchListCandidate({'getValue':searchValue,'getKey':searchDataId})//search content call
					if(searchDatas.length > 0){
						listCandidateDetails(searchDatas,searchDivId,searchDataId);//search value parse
					}else{
						$('#no_data_found_'+searchDivId).html('No Data Found !');
					}
				}else{
					drawCandidateList();
				}				
			}
		});
	}
	else{
		$('#'+count).html(data.length)
		verticalViewData = "<p class='ta_no_data_found'>No Data Found.</p>"
		$('#candidate_list'+'_'+divId).html(verticalViewData);
	}
	
	// job_boards
	verticalViewData = "<p class='ta_no_data_found'>No Data Found.</p>"
	$('[data-toggle="tooltip"]').tooltip();   
}

//search list in local data
function dbSearchListCandidate(data){
	var searchDatas = []
	var getData = result_data[data['getKey']];
	for(var i=0; i<getData.length; i++){
		var getNames = (getData[i].candidate_name).toString().toLowerCase();
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
	$('#candidate_pagination'+divId).each(function () {
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

// Candidate details click function
function candidateDetailsClick(id,divId,key){
	var candidate_data = fetchCandidateDetails(id,divId,key);
	data = candidate_data.candidate_details;
	var data_education = candidate_data.education;
	var data_experience = candidate_data.experience;
	
	if(data.length > 0){
		var content = '';
		for(var i=0; i<data.length; i++){
			content += '<h2 class="caption-subject  bold uppercase">Basic Details</h2>'
			content += '<h2>First Name</h2>'+'<p>'+data[i].first_name+'</p>';
			content += '<h2>Last Name</h2>'+'<p>'+data[i].last_name+'</p>';
			content += '<h2>Gender</h2>'+'<p>'+data[i].gender+'</p>';
			content += '<div id="readmore'+divId+'" class="readMore" style="display:none">';//read mored content here start
			content += '<h2>Title</h2>'+'<p>'+data[i].title+'</p>';
			content += '<h2>Primary Email</h2>'+'<p>'+data[i].primary_email+'</p>';
			content += '<h2>Secondary Email</h2>'+'<p>'+data[i].secondary_email+'</p>';
			content += '<h2>Phone Number</h2>'+'<p>'+data[i].phone_no+'</p>';
			content += '<h2>Mobile Number</h2>'+'<p>'+data[i].mobile_no+'</p>';
			content += '<h2>Languages Known</h2>'+'<p>'+data[i].languages_known+'</p>';			
			content += '<h2 class="caption-subject  bold uppercase">Address Information</h2>'
			content += '<h2>Street</h2>'+'<p>'+data[i].street+'</p>';			
			content += '<h2>Zip/Postal Code</h2>'+'<p>'+data[i].postal_code+'</p>';
			content += '<h2>City</h2>'+'<p>'+data[i].city+'</p>';
			content += '<h2>State/Province</h2>'+'<p>'+data[i].province+'</p>';
			content += '<h2>Country</h2>'+'<p>'+data[i].country+'</p>';		
			content += '<h2 class="caption-subject  bold uppercase">Professional Details</h2>'
			content += '<h2>Expected Salary (per annum)</h2>'+'<p>'+data[i].expected_salary+'</p>';
			content += '<h2>Additional Info</h2>'+'<p>'+data[i].additional_info+'</p>';
			content += '<h2>Skype ID</h2>'+'<p>'+data[i].skype_id+'</p>';
		}
	}else{
		content += '<p class="ta_no_data_found">No Data Found<p>';
	}
		if(data_education.length > 0){
			content += '<h2 class="caption-subject  bold uppercase">Educational Qualification</h2>'
			for(var i=0; i<data_education.length; i++){
				count = i+1;
				content += '<h2>'+count+'. Board/University</h2>'+'<p>'+data_education[i].university+'</p>';			
			    content += '<h2>Institute/School</h2>'+'<p>'+data_education[i].institution_name+'</p>';
			    content += '<h2>Degree</h2>'+'<p>'+data_education[i].course_name+'</p>';
			    content += '<h2>Duration</h2>'+'<p>'+data_education[i].duration+'</p>';
			}
		}else{
			content += '<h2 class="caption-subject  bold uppercase">Educational Qualification</h2>'
			content += '<p class="ta_no_data_found">No Data Found<p>';
		}
		
		if(data_experience.length > 0){
			content += '<h2 class="caption-subject  bold uppercase">Experience Details</h2>'
			for(var i=0; i<data_experience.length; i++){
				count = i+1;
				content += '<h2>'+count+'. Job Title</h2>'+'<p>'+data_experience[i].position+'</p>';			
				content += '<h2>Company Name</h2>'+'<p>'+data_experience[i].employer+'</p>';
				content += '<h2>Start Date</h2>'+'<p>'+data_experience[i].start_date+'</p>';
				content += '<h2>End Date</h2>'+'<p>'+data_experience[i].end_date+'</p>';
				content += '<h2>Reason for Relieving</h2>'+'<p>'+data_experience[i].reason_for_relieving+'</p>';
			}
		}else{
			content += '<h2 class="caption-subject  bold uppercase">Experience Details</h2>'
			content += '<p class="ta_no_data_found">No Data Found<p>';
		}
		
		if(data.length > 0){
			for(var i=0;i<data.length;i++){
				content += '<h2 class="caption-subject  bold uppercase">Candidate Status</h2>'
				content += '<p>'+data[i].candidate_status+'</p>';	
			    content += '</div><a href="#readmore'+divId+'" class="readMore'+divId+' readMoreClass">Read More</a>';//read mored content here end
			}
		}else{
			content += '<h2 class="caption-subject  bold uppercase">Candidate Status</h2>'
			content += '<p class="ta_no_data_found">No Data Found<p>';
		}
		
		$('#candidate_content_tb'+divId).html(content);
		readMore(divId); //read more function call		  
	
		$('.tablist_wrap_tb'+divId).removeClass('tablist_active');
		$('#tb'+divId+'-'+id).addClass('tablist_active');
		$('#candidate_list_'+divId).addClass('col-md-8').removeClass('col-md-12');
		$('#candidate_pagination'+divId).addClass('col-sm-3').removeClass('col-sm-2');
		$('#candidate_tb'+divId).show();
		
		//close button click
		$("#candidate_close_tb"+divId).click(function(){
			$('#candidate_list_'+divId).addClass('col-md-12').removeClass('col-md-4');
			$('#candidate_pagination'+divId).addClass('col-sm-2').removeClass('col-sm-3');
			$('#candidate_tb'+divId).hide();
		});
}

// Retrieving Candidate details on click
function fetchCandidateDetails(id,tab,key){
	$.ajax({
		url : "/ta_candidate_view_details/",
		type : "POST",
		data: {
			 "candidate_id":id,			 
			  csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()
		},
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		data = JSON.parse(json_data);
	});
	return data;
}

// Read more function
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
$('#tab1').find('.spantext').addClass('taFirstTab');