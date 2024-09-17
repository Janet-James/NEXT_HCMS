$(document).ready(function() {
	$('.loader-wrapper').show();
	$.ajax({
		url : 'http://192.168.11.38:8001/performance/monthly/landing/',
		type : 'GET', 
		data:{	'user_id':user_id},
				//'csrfmiddlewaretoken':$("input[name=csrfmiddlewaretoken]").val()},
		async:false,
		error:(function(error){
			$('.loader-wrapper').hide();
			alert_lobibox('error',error.statusText);
		})
	})
	.done(function(json_data){
	var data = JSON.parse(json_data);
	if("developer_data" in data){
	var developer_data = { target:data['developer_data'] };
	 var template = _.template( $("#developer-accordion-html").text() );
	 $('#performance_assessment_monthly_dev_content').before('<h4>Here is your current ratings</h4>')
	$('#performance_assessment_monthly_dev_content').html(template(developer_data));
	}
	if ("module_lead_selectbox" in data){
		$('#dev_list_section').before('<h4>Here is the ratings of your Team Members</h4>')
		$('#dev_list_section').html('<label>Select Employee to Rate your Team Members:</label><select class="form-control select2"><option value="0">Select</option></select>')
		$.each(data['module_lead_selectbox'],function(key,item){
		$('#dev_list_section>select').append('<option value='+item['user_id']+'>'+item['employee_name']+'</option>')
		});
	}
	
	if ("team_lead_dev_selectbox" in data){
		$('#dev_list_section').before('<h4>Here is the ratings of your Module Developers</h4>')
		$('#dev_list_section').html('<label>Select Employee to Rate your Developer:</label><select class="form-control select2"><option value="0">Select</option></select>')
		$.each(data['team_lead_dev_selectbox'],function(key,item){
		$('#dev_list_section>select').append('<option value='+item['user_id']+'>'+item['employee_name']+'</option>')
		});
	}
	if ("team_lead_ml_selectbox" in data){
		$('#ml_list_section').before('<h4>Here is the ratings of your Module Leads</h4>')
		$('#ml_list_section').html('<label>Select Employee to Rate your Module Leads</label><select class="form-control select2"><option value="0">Select</option></select>')
		$.each(data['team_lead_ml_selectbox'],function(key,item){
		$('#ml_list_section>select').append('<option value='+item['ml_id']+'>'+item['employee_name']+'</option>')
		});
	}
	if("is_manage" in data  ){
		$('#performance_assessment_monthly_dev_content').parent().remove();
	}
	$('select').select2({
		placeholder: 'Select',
		allowClear: true,
		minimumInputLength: 0,
	});
	
	rateyo_rating('#performance_assessment_monthly_dev_content');
	enable_writemode();
	 $('.summernote').summernote({
		 height: 100,
		 width: 300,
		  tabsize: 2,
	    toolbar:  [
	               ['bold', ['bold']], 
	               ['ul', ['ul']],
	               ['ol', ['ol']],
	             ]
	  });
	 $('.select2').select2();
	 //$(".project_section").css({'height':($(".assessment-div").height()+'px'))});
	$(".project_section").css({'height':($(".assessment-div").height()+'px')});
	 $('.user_ratings_div:even').addClass('even');
	});
	$('.loader-wrapper').hide();
//	$('.loader-wrapper').hide();
	//$(".project_section").css({'height':($(".assessment-div").height())});
});

$(document).on('click','#save_ml_rating',function(){
	$('.loader-wrapper').show();
	var overall_rating_list = []
	$('#dev_module_lead .ratings_section').each(function(){
		var rating_data={}
		rating_data['project_id'] = $(this).attr('data-id');
		rating_data['comments'] = $(this).find('.summernote').summernote('code');
		var rating_list = []
		var criteria_list = []
		$(this).find('.rating-panel').each(function(){
			criteria_list.push(parseFloat($(this).find('.criteria_div').attr('data-criteria')))
			rating_list.push($(this).find('.ratings').rateYo("option", "rating"))
		});
		rating_data['rating'] =  rating_list
		rating_data['criteria'] =  criteria_list
		overall_rating_list.push(rating_data)
	});
	$.ajax({
		url : 'http://192.168.11.38:8001/performance/monthly_rating_save/',
		type : 'POST', 
		data:{'rating_data':JSON.stringify(overall_rating_list),
			'user_id':$(this).parent().parent().prev('form').find('.user_ratings_div').attr('data-user'),
			'ml_id':user_id,
			'flag':'save_ml',
			'csrfmiddlewaretoken':$("input[name=csrfmiddlewaretoken]").val()},
		async:false,
		error:(function(error){
			$('.loader-wrapper').hide();
			alert_lobibox('error',error.statusText);
		})
	}) .done(function(json_data){
		$('.loader-wrapper').hide();
		var data = jQuery.parseJSON(json_data)
		alert_lobibox('success','Submitted successfully')
	});
});
$(document).on('click','#save_tl_rating',function(){
	$('.loader-wrapper').show();
	var overall_rating_list = []
	$('#dev_team_lead .ratings_section').each(function(){
		var rating_data={}
		rating_data['project_id'] = $(this).attr('data-id');
		rating_data['comments'] = $(this).find('.summernote').summernote('code');
		var rating_list = []
		var criteria_list = []
		$(this).find('.rating-panel').each(function(){
			criteria_list.push(parseFloat($(this).find('.criteria_div').attr('data-criteria')))
			rating_list.push($(this).find('.ratings').rateYo("option", "rating"))
		});
		rating_data['rating'] =  rating_list
		rating_data['criteria'] =  criteria_list
		overall_rating_list.push(rating_data)
	});
	$.ajax({
		url : 'http://192.168.11.38:8001/performance/monthly_rating_save/',
		type : 'POST', 
		data:{'rating_data':JSON.stringify(overall_rating_list),
			'user_id':$(this).parent().parent().prev('form').find('.user_ratings_div').attr('data-user'),
			'tl_id':user_id,
			'flag':'save_tl',
			'csrfmiddlewaretoken':$("input[name=csrfmiddlewaretoken]").val()},
		async:true,
		error:(function(error){
			$('.loader-wrapper').hide();
			alert_lobibox('error',error.statusText);
		})
	}) .done(function(json_data){
		$('.loader-wrapper').hide();
		var data = jQuery.parseJSON(json_data)
		alert_lobibox('success','Submitted successfully')
	});
	
});
$(document).on('click','#save_mgmt_rating',function(){
	$('.loader-wrapper').show();
	var overall_rating_list = []
	$('#dev_management .ratings_section').each(function(){
		var rating_data={}
		rating_data['project_id'] = $(this).attr('data-id');
		rating_data['comments'] = $(this).find('.summernote').summernote('code');
		var rating_list = []
		var criteria_list = []
		$(this).find('.rating-panel').each(function(){
			criteria_list.push(parseFloat($(this).find('.criteria_div').attr('data-criteria')))
			rating_list.push($(this).find('.ratings').rateYo("option", "rating"))
		});
		rating_data['rating'] =  rating_list
		rating_data['criteria'] =  criteria_list
		overall_rating_list.push(rating_data)
	});
	$.ajax({
		url : 'http://192.168.11.38:8001/performance/monthly_rating_save/',
		type : 'POST', 
		data:{'rating_data':JSON.stringify(overall_rating_list),
			'user_id':$(this).parent().parent().prev('form').find('.user_ratings_div').attr('data-user'),
			'mgmt_id':user_id,
			'flag':'save_mgmt',
			'csrfmiddlewaretoken':$("input[name=csrfmiddlewaretoken]").val()},
		async:true,
		error:(function(error){
			$('.loader-wrapper').hide();
			alert_lobibox('error',error.statusText);
		})
	}) .done(function(json_data){
		$('.loader-wrapper').hide();
		var data = jQuery.parseJSON(json_data)
		alert_lobibox('success','Submitted successfully')
	});
	
})
$(document).on('change',"#dev_list_section select",function(){
	
	var selected_user_id =  $("#dev_list_section select").val();
	if (selected_user_id  != '0'){
		$('.loader-wrapper').show();
		$("#ml_list_section select").select2('val','0');
//		$("#ml_list_section select").trigger('change');
	$.ajax({
		url : 'http://192.168.11.38:8001/performance/monthly/selectdata/',
		type : 'GET', 
		data:{	'user_id':selected_user_id,'logged_in_userid':user_id},
				//'csrfmiddlewaretoken':$("input[name=csrfmiddlewaretoken]").val()},
		async:true,
		error:(function(error){
			 $('.loader-wrapper').hide();
			alert_lobibox('error',error.statusText);
		})
	})
	.done(function(json_data){
	var data = JSON.parse(json_data);
	if("developer_data" in data){
		if(Object.keys(data['developer_data']).length > 0){
	var developer_data = { target:data['developer_data'] };
	 var template = _.template( $("#developer-accordion-html").text() );
	$('#performance_assessment_monthly_dev_list').html(template(developer_data));
		}
		else{
			$('#performance_assessment_monthly_dev_list').html('<img src="/static/ui/images/no_data.jpg"></img>');
		}
	}
	rateyo_rating('#performance_assessment_monthly_dev_list');
	enable_writemode();
	 $('.summernote').summernote({
		 height: 100,
		 width: 300,
		  tabsize: 2,
	    toolbar:  [
	               ['bold', ['bold']], 
	               ['ul', ['ul']],
	               ['ol', ['ol']],
	             ]
	  });
		/*$('#accordion1 .panel-heading').on('click', function () {
			
		    $(this).next().collapse('toggle');
		});*/
	 $('.loader-wrapper').hide();
	});
	}
	/*else{
		$('.loader-wrapper').hide();	
	}*/
	
});
$(document).on('change',"#ml_list_section select",function(){
	
	var selected_user_id =  $("#ml_list_section select").val();
	if(selected_user_id != '0'){
		$('.loader-wrapper').show();
	$("#dev_list_section select").select2('val','0');
//	$("#dev_list_section select").trigger('change');
	$.ajax({
		url : 'http://192.168.11.38:8001/performance/monthly/selectdata/',
		type : 'GET', 
		data:{	'user_id':selected_user_id,'logged_in_userid':user_id},
				//'csrfmiddlewaretoken':$("input[name=csrfmiddlewaretoken]").val()},
		async:false,
		error:(function(error){
			$('.loader-wrapper').hide();
			alert_lobibox('error',error.statusText);
		})
	})
	.done(function(json_data){
	var data = JSON.parse(json_data);
	if("developer_data" in data){
		if(Object.keys(data['developer_data']).length > 0){
	var developer_data = { target:data['developer_data'] };
	 var template = _.template( $("#developer-accordion-html").text() );
	$('#performance_assessment_monthly_dev_list').html(template(developer_data));
	}
	else
		{
		$('#performance_assessment_monthly_dev_list').html('<img src="/static/ui/images/no_data.jpg"></img>')
		}
	}
	rateyo_rating('#performance_assessment_monthly_dev_list');
	enable_writemode();
	 $('.summernote').summernote({
		 height: 100,
		 width: 300,
		  tabsize: 2,
	    toolbar:  [
	               ['bold', ['bold']], 
	               ['ul', ['ul']],
	               ['ol', ['ol']],
	             ]
	  });
		/*$('#accordion1 .panel-heading').on('click', function () {
			
		    $(this).next().collapse('toggle');
		});*/
	 $('.loader-wrapper').hide();
	});
	
}
	/*else{
	$('.loader-wrapper').hide();	
}*/
	
});
/*alert($('#performance_assessment_monthly_dev_content>form').length)
*/


$(document).on('click','#finish_ml_rating',function(){
	$('.loader-wrapper').show();
	pointer = $(this)
	 freeze_rating(finish_ml_rating,pointer,'ML');  
	    
});
$(document).on('click','#finish_tl_rating',function(){
	$('.loader-wrapper').show();
	pointer = $(this)
	freeze_rating(finish_tl_rating,pointer,'TL');  			
	    
});
$(document).on('click','#finish_mgmt_rating',function(){
	$('.loader-wrapper').show();
	  pointer = $(this)
	  freeze_rating(finish_management_rating,pointer,'Management');  		
	    
});
function finish_ml_rating(pointer){
	
	$.ajax({
		url : 'http://192.168.11.38:8001/performance/monthly_rating_freeze/',
		type : 'POST', 
		data:{'finish_ml':true,
			'user_id':pointer.parent().parent().prev('form').find('.user_ratings_div').attr('data-user'),
			'csrfmiddlewaretoken':$("input[name=csrfmiddlewaretoken]").val()},
		async:true,
		error:(function(error){
			$('.loader-wrapper').hide();
			alert_lobibox('error',error.statusText);
		})
	})
	.done(function(json_data){
		var data = jQuery.parseJSON(json_data)
		$('.loader-wrapper').hide();
		if(data['status'] == 'NTE-001'){
			alert_lobibox('success','Module Lead rating was sent successfully')
		pointer.prev().remove();
		pointer.remove();
		$('#dev_module_lead .ratings').rateYo("option", "readOnly", true);
		}
		else if (data['status'] == 'NTE-003'){
			alert_lobibox('error','Please Save Module Lead Rating before Send')}
		else if (data['status'] == 'NTE-002'){
			alert_lobibox('error','Module Lead rating was not sent successfully')}
		
	});
}
function finish_tl_rating(pointer){
	
	$.ajax({
		url : 'http://192.168.11.38:8001/performance/monthly_rating_freeze/',
		type : 'POST', 
		data:{'finish_tl':true,
			'user_id':pointer.parent().parent().prev('form').find('.user_ratings_div').attr('data-user'),
			'csrfmiddlewaretoken':$("input[name=csrfmiddlewaretoken]").val()},
		async:true,
		error:(function(error){
			$('.loader-wrapper').hide();
			alert_lobibox('error',error.statusText);
		})
	})
	.done(function(json_data){
		var data = jQuery.parseJSON(json_data)
		$('.loader-wrapper').hide();
		if(data['status'] == 'NTE-001'){
			alert_lobibox('success','Team Lead rating was sent successfully')
		pointer.prev().remove();
		pointer.remove();
		$('#dev_team_lead .ratings').rateYo("option", "readOnly", true);
		}
		else if (data['status'] == 'NTE-003'){
			alert_lobibox('error','Please Save Team Lead Rating before Send')}
		else if (data['status'] == 'NTE-002'){
			alert_lobibox('error','Team Lead rating was not sent successfully')}
	});
}

function finish_management_rating(pointer){
	$.ajax({
		url : 'http://192.168.11.38:8001/performance/monthly_rating_freeze/',
		type : 'POST', 
		data:{'finish_mgmt':true,
			'user_id':pointer.parent().parent().prev('form').find('.user_ratings_div').attr('data-user'),
			'csrfmiddlewaretoken':$("input[name=csrfmiddlewaretoken]").val()},
		async:true,
		error:(function(error){
			$('.loader-wrapper').hide();
			alert_lobibox('error',error.statusText);
		})
	})
	.done(function(json_data){
		var data = jQuery.parseJSON(json_data)
		$('.loader-wrapper').hide();
		if(data['status'] == 'NTE-001'){
			alert_lobibox('success','Management rating was sent successfully')
		pointer.prev().remove();
		pointer.remove();
		$('#dev_management .ratings').rateYo("option", "readOnly", true);
		}
		else if (data['status'] == 'NTE-003'){
			alert_lobibox('error','Please Save Management Rating before Send')}
		else if (data['status'] == 'NTE-002'){
			alert_lobibox('error','Management rating was not sent successfully')}
	});
}

//Delete confirmation function 
function freeze_rating(func_name, action_name, title) {
	var title = title == undefined ? '' :title;
	$('.popup_zindex').css({'z-index':'unset'});//search select btn zindex
	
	swal ({
		title: "Are you sure, you want to freeze this "+title+" rating?",
//		text: "Go ahead the removed",
		type: "warning",
		showCancelButton: true,
		confirmButtonClass: "btn btn-success btn-eql-wid btn-animate pull-left",
		cancelButtonClass: "btn btn-danger btn-eql-wid btn-animate pull-right",
		confirmButtonText: "Yes",
		cancelButtonText: "No",
		showConfirmButton : true,
		closeOnConfirm: true,
		closeOnCancel: true
	},
	function(isConfirm) {
		if (isConfirm) {
			if (action_name) {
				//NIAA CODE START
				if(func_name == 'employee_primary_details_delete_function'){
					let roomobj = findroomid($("#email").val());
					roomobj?ddpdeactivate(roomobj._id):'';
				}
				//NIAA CODE END
				func_name(action_name);
			} else {
				func_name();
			}
		} 
		else{
			$('.loader-wrapper').hide();
		}
	});
}
function enable_writemode(){
	if($('#save_ml_rating').length >0 ){
	$('#dev_module_lead .ratings').rateYo("option", "readOnly", false);
}
if($('#save_tl_rating').length >0 ){
	$('#dev_team_lead .ratings').rateYo("option", "readOnly", false);
}
if($('#save_mgmt_rating').length >0 ){
	$('#dev_management .ratings').rateYo("option", "readOnly", false);
}
}


$(function() {
$(document).on("rateyo.set",".ratings", function(e,data){
   $(this).next().text('('+data.rating+')');
   if($(this).parents('.overall_section_class').length)
   rateyo_rating_instant('#'+$(this).parents('.overall_section_class').attr('id'),'#'+$(this).parents('.panel-default').attr('id'))
});
});
function rateyo_rating_instant(overall_id,current_category_id){
	tl_count = 0
    tl_overall = 0
    ml_count = 0
    ml_overall = 0
    mgmt_count = 0
    mgmt_overall = 0
    overall_count = 0
    overall_avg = 0
	if (current_category_id == '#dev_team_lead'){
		$(overall_id).find(current_category_id).find(".ratings").each( function() {
			var rating = $(this).rateYo("option", "rating");
		    if($(this).parents('#dev_team_lead').length){
		    	tl_count = tl_count + 1;
		    	tl_overall = tl_overall + parseFloat(rating);
		    }
	});
		$(overall_id).find('#overall_average_lead').text((tl_overall/tl_count).toFixed(2));
	}
	else if (current_category_id == '#dev_module_lead'){
		$(overall_id).find(current_category_id).find(".ratings").each( function() {
			 var rating = $(this).rateYo("option", "rating");
		    if($(this).parents('#dev_module_lead').length){
		    	ml_count = ml_count + 1;
		    	ml_overall = ml_overall + parseFloat(rating);
		    }
	});
		$(overall_id).find('#overall_average_ml').text((ml_overall/ml_count).toFixed(2));
	
	}
	else if (current_category_id == '#dev_management'){
		$(overall_id).find(current_category_id).find(".ratings").each( function() {
		    var rating = $(this).rateYo("option", "rating");
		    if($(this).parents('#dev_management').length){
		    	mgmt_count = mgmt_count + 1;
		    	mgmt_overall = mgmt_overall + parseFloat(rating);
		    }
	});
		$(overall_id).find('#overall_average_mgmt').text((mgmt_overall/mgmt_count).toFixed(2));
	
	
	}
	$(overall_id).find('ul.SE-date>li').each(function(){
		overall_count = overall_count + 1
		overall_avg = overall_avg  + parseFloat($(this).find('span').text())
	});
	$(overall_id).find('#overall_average').text((overall_avg/overall_count).toFixed(2));

}

function rateyo_rating(id){
	 	tl_count = 0
	    tl_overall = 0
	    ml_count = 0
	    ml_overall = 0
	    mgmt_count = 0
	    mgmt_overall = 0
	    overall_count = 0
	    overall_avg = 0
	$(id).find(".ratings").each( function() {
	    var rating = $(this).attr("data-rating");
	    if(rating==0.0)
	    	rating= 0
	    else if(rating==0)
	    	rating = 0
	    else
	    	rating = rating
	    $(this).rateYo(
	        {
	            rating: rating,
//	            fullStar: true,
	            readOnly: true 
	        }
	    );
	    
	    $(this).next().text('('+rating+')');
	   
	    if($(this).parents('#dev_team_lead').length){
	    	tl_count = tl_count + 1;
	    	tl_overall = tl_overall + parseFloat(rating);
	    }
	    if($(this).parents('#dev_module_lead').length){
	    	ml_count = ml_count + 1;
	    	ml_overall = ml_overall + parseFloat(rating);
	    }
	    if($(this).parents('#dev_management').length){
	    	mgmt_count = mgmt_count + 1;
	    	mgmt_overall = mgmt_overall + parseFloat(rating);
	    }
	    
});
	 $(id).find('ul.SE-date').html('');
if(ml_count)
	$(id).find('ul.SE-date').append(" <li>Module Lead Average : <span id='overall_average_ml'>"+(ml_overall/ml_count).toFixed(2)+"</span></li>");
if(tl_count)	
	$(id).find('ul.SE-date').append(" <li>Team Lead Average : <span id='overall_average_lead'>"+(tl_overall/tl_count).toFixed(2)+"</span></li>");
if(mgmt_count)	
	$(id).find('ul.SE-date').append(" <li>Management Lead Average : <span id='overall_average_mgmt'>"+(mgmt_overall/mgmt_count).toFixed(2)+"</span></li>");
	 
//	$('#overall_average_lead').text((tl_overall/tl_count).toFixed(2));
//	$('#overall_average_ml').text((ml_overall/ml_count).toFixed(2));
//	$('#overall_average_mgmt').text((mgmt_overall/mgmt_count).toFixed(2));

	$(id).find('ul.SE-date>li').each(function(){
		overall_count = overall_count + 1
		overall_avg = overall_avg  + parseFloat($(this).find('span').text())
	});
	$(id).find('ul.SE-date').append(" <li>Overall Average : <span id='overall_average'>"+(overall_avg/overall_count).toFixed(2)+"</span></li>");

}