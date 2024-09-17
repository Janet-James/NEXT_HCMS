var tid="",tabId="",current_result="",dis_lenth=5;
var offer_made_ref_id=655,offer_accept_ref_id=656,offer_devlined_ref_id=657,offer_withdrawn_ref_id=658,offer_revised_ref_id=659;
var result_data ;
let cache={},prv_state={};
$(document).ready(function(){
offerHeaderCount()

//tab click id
$(".nav-pills li").click(function() {
	tid=this.id;
	title = $(this).attr('data-id') || '';
	tabShowStatus(tabId,tid,title)
	//$(".loader-wrapper").show();
});

//nav click event here
$(".nav-pills li>a").click(function() {
	$("#job-requisitions").empty();
	$('#job-requisitions').addClass('col-md-12').removeClass('col-md-4');
	$('#offer_search').addClass('col-md-12').removeClass('col-md-8');
	$("#job_requisitions_form").hide();
	tabId=this.id;
});

//tab show condition
function tabShowStatus(tabId,tid,title){
	$('.job_offer_title').html(title)
	var ref_items={};  
	ref_items['all']="all";
	ref_items['offer_made']=offer_made_ref_id; 
	ref_items['offer_accept']=offer_accept_ref_id;  
	ref_items['offer_declined']=offer_devlined_ref_id;  
	ref_items['offer_withdrawn']=offer_withdrawn_ref_id; 
	ref_items['offer_revised']=offer_revised_ref_id;   
	$('.tab-pane,.tab_item_menu,.tab_item').removeClass('active activetab');
	$('#ex-'+tabId).addClass('active'); 
	$('#'+tabId).addClass('active');  
	$('#'+tid).find('.tab_item').addClass('activetab');   
	if(!jQuery.isEmptyObject(cache[tid])){  
		 current_result=cache[tid]; 
		 setJobRequestDetails(0,cache[tid],tid)
	}else{
		var res=jobRequestDetails(ref_items[tid],"tab"); 
	    cache[tid]=res; 
	    setJobRequestDetails(0,res,tid)		
	} 
}

//default trigger function 
$('#tab2').trigger('click'); 
//close button click 
$("#job_requisitions_close").click(function(){
$('#job-requisitions').addClass('col-md-12').removeClass('col-md-4'); 
$('#offer_search').addClass('col-md-12').removeClass('col-md-8');
$('#job_requisitions_form').hide();
});
$("#job-requisitions").click(function(event){ 
	$('#job-requisitions').addClass('col-md-8').removeClass('col-md-12'); 
	$('#offer_search').addClass('col-md-8').removeClass('col-md-12');
	$('#job_requisitions_form').show();   
})  
})  
	
//offer header count function here
function offerHeaderCount(){
		var post_data = {};
		post_data["type"] = "reference"; 
		post_data["code"] = "OFFRE"
		res=DropdownValues(post_data)      
		var data = {};
		if(res){  
			res.map(function(r){ 
			data[r.refitems_name.replace(" ",'_')]=r.id;
			})
		}                   
		data['type']='COUNT';	
		data['all_Offer']='all';
		$.ajax({
			url : '/ta_offer_tabs_details/', 
			type : 'POST',   
			data : data,   
			timeout : 10000,
			async : false,
		}).done(function(json_data) {
			var data = JSON.parse(json_data); 
			if (data.datas) {   
				res_data = data.datas;
				result_data = data;
				logInfo(data.log_details);  
				set_count(res_data)
			} 
		});	
	}

//set count function here
function set_count(res){
		key=['all_Offer','Offer_Accepted','Offer_Declined','Offer_Made','Offer_Revised','Offer_Withdrawn']
		key.map(function(k){
		str='<span class="activecount">'+res[k]+'</span>'
		$('#'+k).html(str)	  
		}) 
	}

//job request details function here
function  jobRequestDetails(id,type){ // for getting all offer details of row click and tab change
		var rtn=0;
		var data={};
		prv_state[tid]=id;
		if(id && type=="row"){
			data["type"]="CHOOSE";
			data["id"]=id;
			data["param"]=tid;
			$('.tablist_wrap').removeClass('tablist_active')
			$('#offer_'+id).addClass("tablist_active");
		}else if (type=="tab"){
			data["type"]="DETAIL";
			data["tab_id"]=id 
		}   
		if(data){
		$.ajax({ 
			url : '/ta_offer_tabs_details/', 
			type : 'POST',
			data : data,      
			timeout : 10000, 
			async : false,
		}).done(function(json_data) {
			var data = JSON.parse(json_data);
			res_data={};
			if (data) { 
				res_data= (data.datas ? data.datas :undefined);
				if(type=="row"){
					setMoreOfferDetails(res_data)
				}
				else{
					current_result=res_data;
			        rtn=1 
					//setJobRequestDetails(0,res_data)	
				} 
			}
			}); 
		} 
		if(rtn==1){		return res_data;}  
	}

//set pagination function here
function setPagination(page_id,length){
		 var content=""; 
		 var page_param=-dis_lenth;
		 if(length> 0 && length>dis_lenth ){
		 content='<li><a href="javascript:;"> <i class="fa fa-angle-left"></i></a></li>';
		 for(var i=0;i<length/dis_lenth;i++){
			 var page=i+1; 
			 page_param+=dis_lenth; 
			 content+='<li class="pagenationList'+page_param+'"id="page_'+page+'" onclick="paginationMoveTo('+page_param+')"><a>'+page+'</a></li>'
		 }
		 content+='<li><a href="javascript:;"> <i class="fa fa-angle-right"></i></a></li>'
		 $("#pagination_space").html(content);
		 }
		 else{
			 $("#pagination_space").html("");
		 }
		 $('#pagination_space').find('.pagenationList'+page_id).addClass('active');
	} 

//pagination move to function here
function paginationMoveTo(page_id){
		$("#job_requisitions_form").hide();
		$('#offer_search').addClass('col-md-12').removeClass('col-md-8');
		setJobRequestDetails(page_id,current_result,tid) 
	}  

//set job request details function here
function setJobRequestDetails(start,res,tid){   
		
		var limit=start+dis_lenth;  
		data_count=(res ? res.length :0) 
		setPagination(start,data_count) 
		if(res==undefined || res.length==0 ||res==={}){
			$('#job-requisitions').html('<p class="ta_no_data_found">No Offers Found !</p>')
			$('#offer_pagination').hide();
			$('#offer_search').addClass('col-md-12').removeClass('col-md-8');
		}else {
				$('#offer_pagination').show();
				var first='<div class="col-sm-3" style="float: right;margin-bottom: 15px;margin-top: -50px;" id="2"><input class="form-control" placeholder="Search by Job Title" id="job_name" type="text"></div>';
				//$('#job-requisitions').html(first);
				$('#job-requisitions').html(res.map(function(r,i){ 
				if(i<limit && i>=start)
				return '<div class="tablist_wrap"onclick="jobRequestDetails('+r.id+','+"'row'"+')" id="offer_'+r.id+'">'+
				'<div class="col-sm-4 job_title"  data-toggle="tooltip" data-placement="left" title="" data-original-title="Job Position">'+r.job_title+'</div>'+
				'<div class="col-sm-4"  data-toggle="tooltip" data-placement="left" title="" data-original-title="Candidate Name">'+r.name+'</div>'+
				'<div class="col-sm-4"><span data-toggle="tooltip" data-placement="left" title="" data-original-title="Offer Status">'+r.offer_status+'</span><a data-toggle="tooltip" data-placement="left" title="" class="taeditContent" href="#" onclick="rowDoubleClick('+r.id+')"data-original-title="Job Offer Edit"><i class="nf nf-update-1"></i></a></div>'+
		        '</div>';  
			}))  
		}
		$('#offer_'+prv_state[tid]).trigger('click');  
		$('[data-toggle="tooltip"]').tooltip();
	}

//read more less details function here
function readMoreLess(id){
	   state=$('#more_less'+id).text().replace(" ","_");
	   if(state=="Read_More"){
	   $('#job_offer_content').addClass("job_requisitions_content_active"); 
	   $("#readmore").addClass("lo-active");
	   $('#more_less'+id).text("Read Less")
	   //$('#job_offer_content').html("")  
	   }
	   else if(state=="Read_Less"){
		   $("#readmore").removeClass("lo-active");
		   $('#job_offer_content').removeClass("job_requisitions_content_active");
		   $('#more_less'+id).text("Read More")
	   }
   }

//set more offer details function here
function setMoreOfferDetails(res){
	   var rid=0;
	   if(res){
	   $('#job_offer_content').html(res.map(function(r){
		   rid=r.id; 
		   return '<h2>Job Title</h2>'+     
           '<p>'+r.job_title+'</p>'+ 
           '<h2>Candidate Name</h2>'+
           '<p>'+r.name+'</p>'+  
           '<h2>Offer Status</h2>'+ 
           '<p>'+r.offer_status+'</p>'+
           '<h2>Cost To Employee</h2>'+  
           '<p>'+r.cost_to_employee+'</p>'+
           "<div id='readmore'  style='display:none' onclick='readMoreLess("+rid+")'>"+
           '<h2>Candidate Email</h2>'+  
           '<p>'+r.primary_email+'</p>'+
           '<h2>Candidate Mobile No</h2>'+  
           '<p>'+r.mobile_no+'</p></div>'+
           "<p class='readMoreClass' onclick='readMoreLess("+rid+")'><a class='readMore2 readMoreClass' id='more_less"+rid+"'>Read More</a></p>";
       }))
	   }
   }

//filter functionality
$('#job_name').keypress(function(event){
	    var keycode = (event.keyCode ? event.keyCode : event.which);
	    if(keycode == '13'){
	    	var search_query=$('#job_name').val();
	    	if(current_result){
	    	var	filter_result=current_result.filter(function(cr){
	    		if(cr.job_title.toLowerCase().indexOf(search_query.toLowerCase()) != -1){
	    		    return cr; 
	    		}
	    	})
	    	}
	    	$('#job_name').val("");
	    	$("#job_requisitions_form").hide();
	    	$('#offer_search').addClass('col-md-12').removeClass('col-md-8');
	    	$('#job-requisitions').addClass('col-md-12').removeClass('col-md-4');
	    	setJobRequestDetails(0,filter_result)
	    }
	});

//row double function here
function rowDoubleClick(row_id){
	  offer_management_rowclick1(row_id)
	  $('#tab1').trigger('click');
	  
  }
$('#tab1').find('.spantext').css('margin-top','6px');

