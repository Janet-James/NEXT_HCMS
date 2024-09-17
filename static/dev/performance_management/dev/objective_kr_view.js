var user_id='';
var flag_value=0;
var orgUnit_id ;
var global_filter_name;
var global_filter_subname;
var global_filter_image;
var global_access_level;
$(document).ready(function(){
	function formatState(state) {
		if (!state.id) {
			return state.text;
		}
		var baseUrl = "css";
		var a=state.element.text.toLowerCase()
		if(a!='--select--') {
			var $state = $(
					'<span><img src="/static/dev/performance_management/dev/css/'+a+'.png"  class="quarter-icon" /> ' + state.text + '</span>'
			);
		}
		return $state;
	};
	$("#obj_set_quarterlist").select2({
		templateResult: formatState
	});
	team_treeview();
	access_level();
	team_view_page_render(team_id,'department_id');
	common_chart(team_id,'department_id');
	tree_click(team_id,'')
	$(document).on( "click",'ul.userprofile li',function(e) 
			{ 
		flag_value=1;
		user_id= $(this).attr("data-index");
		emp_userid_details(user_id);
		team_view_page_render(user_id,'employee_id');
		common_chart(user_id,'employee_id');
			});

	$(document).on('show.bs.modal','#Add_objective_Modal', function (event) {
//		var validator = $("#add_objective_form").validate();
//		validator.resetForm();
	});
})

function access_level()
{
	$.ajax({	
		url:'/pm_access_level/',
		type:'GET',
			error:(function(error){
				alert_lobibox('error',error.statusText);
			})
	}).done(function(json_data){
		if(json_data)
			{
			global_access_level=json_data.access_level
			if (json_data.access_level=='level3')
				{
				flag_value=1;
				user_id= json_data.filter_id;
				emp_userid_details(user_id);
				team_view_page_render(user_id,'employee_id');
				common_chart(user_id,'employee_id');
				}
			}
	})
}
//teamwise filter search
$('.teamwise_filter ').click(function(e){ 
	team_id= $(this).attr("data-index");
	team_name=$(this).attr("data-value");
	tree_click(team_id,team_name);
});

$('ul.objective_filter li').click(function(e){ 
	filter= $(this).attr("data-index");
	if (filter=="organization_id" || filter=="organization_unit_id")
	{
		team_view_page_render($(this).attr("data-filter-id"),$(this).attr("data-index"));	
		common_chart($(this).attr("data-filter-id"),$(this).attr("data-index"));
	}
})

function emp_userid_details(user_id){
	var csrftoken = getCookie('csrftoken');
	$.ajax({	
		url:'/emp_details/',
		type:'POST',
		data:{'user_id':user_id,
			csrfmiddlewaretoken:csrftoken},
			error:(function(error){
				alert_lobibox('error',error.statusText);
			})
	}).done(function(json_data){
		var data=JSON.parse(json_data);
		$('.user_details').html("");
		if(data.status == 'NTE-001'){
			if(data.employee_info.length>0){
				for(i=0;i<data.employee_info.length;i++){
					if(data.employee_info[i].employee_image){
						image_name=image_path+data.employee_info[i].employee_image
					}else{
						image_name=image_path+'no_data.png'
					}
					if(data.employee_info[i].designation != '' & data.employee_info[i].designation != null){
						designation=data.employee_info[i].designation
					}else{
						designation=''
					}
					if(data.employee_info[i].team_name != '' & data.employee_info[i].team_name != null){
						var team_name=' '+designation
					}else{
						var team_name=''
					}
					$('.user_details').append('<li><img src="'+image_name+'" class="staff-photo"></li>'+
							'<li><p class="main-name">'+data.employee_info[i].employee_name+'<span class="sub-name"> '+team_name+'</span></p>'+
							'<p class="designation">'+data.employee_info[i].team_name+'</p>'+
							'<p class="update-date">( Last updated on '+data.employee_info[i].last_update+')</p>'
					)
					global_filter_image=image_name
					global_filter_name=data.employee_info[i].employee_name
					global_filter_subname=team_name
				}
			}
		}if(data.status == 'NTE-002'){
			alert_lobibox('error',data.message)
		}if(data.status == 'NTE-003'){
			alert_lobibox('error',data.message)
		}
	})
}

//team tree view details 
function team_treeview(){
	org_unit_id=$('#ntree_org_unit_id').attr('name')
	$.ajax({
		url:'/team_treeview/',
		type:'GET',
		data:{'org_unit_id':org_unit_id},
		error:(function(error){
			alert_lobibox('error',error.statusText);
		})
	}).done(function(json_data){
		var data=JSON.parse(json_data);
		StrContent_Team=''
			var MobileContent_Team=''
				if(data.status == 'NTE-001'){
					for(i=0;i<data.tree_details.length;i++){
						image_name=data.tree_details[i].visual_type
						var image_tree_path="/static/dev/NTree/ui/images/"+image_name
						StrContent_Team+='<li class="draggable-cloud" data-index='+data.tree_details[i].order_id+' style="left: '+data.tree_details[i].position_left+'px; top: '+data.tree_details[i].position_top+'px;" ">'
//						if(data.user_group == 'PMNGR' && data.team_name == ''){
						StrContent_Team+='<a onclick="tree_click(\''+data.tree_details[i].id+'\',\''+data.tree_details[i].name+'\');">'+
						'<img src="'+image_tree_path+'" data-imagename="'+image_name+'" style="height: '+data.tree_details[i].height+'px; width: '+data.tree_details[i].width+'px;">'+
						'<span class="teamname" data-index="'+data.tree_details[i].id+'">'+data.tree_details[i].name+'</span></a></li>'
						MobileContent_Team+='<li><a onclick="tree_click(\''+data.tree_details[i].id+'\',\''+data.tree_details[i].name+'\');">'+data.tree_details[i].name+'</a> </li>'

//						}else if(data.tree_details[i].name == data.team_name && (data.user_group == 'USSER' || data.user_group == 'MNGER' || data.user_group == 'TMLDS')){
//						if(data.user_group == 'USSER'){
//						StrContent_Team+='<a href="">'+
//						'<img src="'+image_path+'" data-imagename="'+image_name+'" style="height: '+data.tree_details[i].height+'px; width: '+data.tree_details[i].width+'px;">'+
//						'<span class="teamname" data-index="'+data.tree_details[i].id+'">'+data.tree_details[i].name+'</span></a></li>'
//						MobileContent_Team+='<li><a>'+data.tree_details[i].name+'</a> </li>'

//						}else if(data.user_group == 'MNGER' || data.user_group == 'TMLDS'){
//						StrContent_Team+='<a onclick="tree_click(\''+data.tree_details[i].id+'\',\''+data.tree_details[i].name+'\');">'+
//						'<img src="'+image_path+'" data-imagename="'+image_name+'" style="height: '+data.tree_details[i].height+'px; width: '+data.tree_details[i].width+'px;">'+
//						'<span class="teamname" data-index="'+data.tree_details[i].id+'">'+data.tree_details[i].name+'</span></a></li>'
//						MobileContent_Team+='<li><a onclick="tree_click(\''+data.tree_details[i].id+'\',\''+data.tree_details[i].name+'\');">'+data.tree_details[i].name+'</a> </li>'
//						}

//						}else{
//						StrContent_Team+='<a href="/Not_authorized/">'+
//						'<img src="'+image_path+'" data-imagename="'+image_name+'" style="height: '+data.tree_details[i].height+'px; width: '+data.tree_details[i].width+'px;">'+
//						'<span class="teamname" data-index="'+data.tree_details[i].id+'">'+data.tree_details[i].name+'</span></a></li>'
//						MobileContent_Team+='<li><a href="/Not_authorized/">'+data.tree_details[i].name+'</a> </li>'
//						}
					}
					$('#team_tree_addcloud_ul').append(StrContent_Team)
					MobileContent_Team+='<li><a href="/OKR/information-view/">NTree</a> </li>'
						$('#mobilemenu').append(MobileContent_Team)
				}if(data.status == 'NTE-002'){
					alert_lobibox('error',data.message)
				}if(data.status == 'NTE-003'){
					alert_lobibox('error',data.message)
				}
	})
}

function tree_click(team_id,team_name){
	team_id=team_id
	var csrftoken = getCookie('csrftoken');
	$('#filter_employee_name').empty()
	$('#vcarousel').remove(); 
	$.ajax({
		url:'/pm_department_wise_filter/',
		type:'POST',
		async:false,
		data:{'team_id':team_id,
			csrfmiddlewaretoken:csrftoken},
			error:(function(error){
				alert_lobibox('error',error.statusText);
			})
	}).done(function(json_data){
		var data=JSON.parse(json_data);
		var StrContent_profile=''
			StrContent_profile+='<ul id="vcarousel" class="elastislide-list userprofile">'

				if(data.status == 'NTE-001'){
					if(data.team_detail.team_name)
					{
						team_name=data.team_detail.team_name
					}
					else
					{
						team_name=team_name
					}
					$('#filter_employee_name').append('<option value="0"></option>');
					if(data.team_emp_details.length>0){

						for(i=0;i<data.team_emp_details.length;i++){
							$('#filter_employee_name').append($('<option>',{
								value:data.team_emp_details[i].id,
								text:data.team_emp_details[i].employee_name
							}));
							StrContent_profile+='<li style="width: 100%; max-width: 110px; max-height: 110px;" data-index='+data.team_emp_details[i].id+'><a href="#"><div class="userprofile">'
							if(data.team_emp_details[i].employee_image)
							{
								StrContent_profile+='<img src="'+image_path+data.team_emp_details[i].employee_image+'" class="img-circle">'
							}
							else
							{
								StrContent_profile+='<img src="'+image_path+'no_data.png" class="img-circle">'
							}
							StrContent_profile+='<span data-toggle="tooltip" data-placement="bottom" title='+data.team_emp_details[i].employee_name+'>'+data.team_emp_details[i].employee_name+'</span></div></a></li>'
						}
					}
					StrContent_profile+='</ul>'
						$('#profile_search_div').html(StrContent_profile)
						window_height=$( window ).height()
						var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
						var isFirefox = typeof InstallTrigger !== 'undefined';
						var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
						var isIE =false || !!document.documentMode;
						var isEdge = !isIE && !!window.StyleMedia;
						var isChrome = !!window.chrome && !!window.chrome.webstore;
						var isBlink = (isChrome || isOpera) && !!window.CSS;
						if(window_height <= 600){
							var count = $(".elastislide-list").children().length; 
							if(count < 3 ){
								$("#profile_search_div").addClass("min-item");
							}else{
								$("#profile_search_div").removeClass("min-item");
							}
							var minItems=1
							$('.OKR-Wizard #switcher1').css('bottom','115px')
						}else if(window_height >= 601 && window_height <= 660){
							var count = $(".elastislide-list").children().length; 
							if(count < 3 ){
								$("#profile_search_div").addClass("min-item");
							}else{
								$("#profile_search_div").removeClass("min-item");
							}
							var minItems=2
							$('.OKR-Wizard #switcher1').css('bottom','170px')

						}else if(window_height >= 661 && window_height <= 750){
							var count = $(".elastislide-list").children().length; 
							if(count < 3 ){
								$("#profile_search_div").addClass("min-item");
							}else{
								$("#profile_search_div").removeClass("min-item");
							}
							var minItems=2
							if(isIE== true && window_height >= 661 && window_height <= 680){
								$('.OKR-Wizard #switcher1').css('bottom','185px')
							}else if(isIE== true && window_height >= 681 && window_height <= 750){
								$('.OKR-Wizard #switcher1').css('bottom','265px')
							}else{
								$('.OKR-Wizard #switcher1').css('bottom','185px')
							}

						}else if(window_height >= 751 && window_height <= 767){
							var count = $(".elastislide-list").children().length; 
							if(count < 3 ){
								$("#profile_search_div").addClass("min-item");
							}else{
								$("#profile_search_div").removeClass("min-item");
							}
							var minItems=2
							$('.OKR-Wizard #switcher1').css('bottom','275px')
						}else if(window_height >= 768 &&  window_height < 800){
							var count = $(".elastislide-list").children().length; 
							if(count <= 3 ){
								$("#profile_search_div").addClass("min-item");
							}else{
								$("#profile_search_div").removeClass("min-item");
							}
							$('.OKR-Wizard #switcher1').css('bottom','195px')
							var minItems=3
						}else if(window_height >= 801 &&  window_height <= 860){
							$("#profile_search_div").removeClass("min-item");
							var minItems=4
							if(isIE== true){
								$('.OKR-Wizard #switcher1').css('bottom','105px')
							}else{
								$('.OKR-Wizard #switcher1').css('bottom','150px')
							}
							vcarousel_userprofile()
						}else if(window_height >= 861 &&  window_height <= 900){
							$("#profile_search_div").removeClass("min-item");
							var minItems=4
							$('.OKR-Wizard #switcher1').css('bottom','120px')
							vcarousel_userprofile()
						}else if (window_height >= 901 &&  window_height <= 930){
							var minItems=5
							$('.OKR-Wizard #switcher1').css('bottom','100px')
							vcarousel_userprofile()
						}else if (window_height >= 931 &&  window_height <= 940){
							var minItems=5
							$('.OKR-Wizard #switcher1').css('bottom','125px')
							vcarousel_userprofile()
						}else if (window_height >= 941 &&  window_height <= 980){
							var minItems=5
							if(isIE== true){
								$('.OKR-Wizard #switcher1').css('bottom','145px')
							}else if(isChrome==true && window_height >= 941 &&  window_height <= 950){
								$('.OKR-Wizard #switcher1').css('bottom','140px')
							}
							else{
								$('.OKR-Wizard #switcher1').css('bottom','160px')
							}
							vcarousel_userprofile()
						}else if (window_height >= 981  && window_height <= 1200){
							var minItems=5
							if(isIE== true){
								$('.OKR-Wizard #switcher1').css('bottom','175px')
							}else{
								$('.OKR-Wizard #switcher1').css('bottom','235px')
							}
							vcarousel_userprofile()
						}else{
							var minItems=1
						}
						var carousel = $('#vcarousel').elastislide({
							orientation: 'vertical',
							autoSlide: true,
							minItems:minItems
						});
						$.ajax({
							url:'/team_click_chart/',
							type:'POST',
							async:false,
							data:{'team_id':team_id,
								csrfmiddlewaretoken:csrftoken},
								error:(function(error){
									alert_lobibox('error',error.statusText);
								})
						}).done(function(json_data){
							var data=JSON.parse(json_data);
							chart_detaills(data)	 
						});
						$('.user_details').html("");
						image_name=image_path+'no_data.png'
						designation='Division'
							team_name=team_name
							$('.user_details').append('<li><img src="'+image_name+'" class="staff-photo"></li>'+
									'<li><p class="main-name">'+team_name+'<span class="sub-name">   '+designation+'</span></p>'+
									'<p class="designation">'+team_name+'</p>'+
									'<p class="update-date">( Last updated on '+'06/11/2018'+')</p>'
							)
							global_filter_image=image_name
							global_filter_name=team_name
							global_filter_subname=designation
				}if(data.status == 'NTE-002'){
					alert_lobibox('error',data.message)	
				}if(data.status == 'NTE-003'){
					alert_lobibox('error',data.message)	
				}
				$('.nav_trigger').removeClass('active')
				team_view_page_render(team_id,'department_id')
				common_chart(team_id,'department_id')
	})
}
//add objective submit functionality
$('#update_objective_submit').click(function(){
	var csrftoken = getCookie('csrftoken');
	objective_id=$('#update_objective_name').attr('data-objectiveid')
	team_id=$('#update_objective_name').attr('data-teamid')
	user_id=$('#update_objective_name').attr('data-userid')
	objective=$('#update_objective_name').val()
	var validation_result=$('#update_objective_form').valid()
	if(validation_result){
		$.ajax({
			url:'/edit_objective/',
			type:'POST',
			data:{'objective_id':objective_id,'team_id':team_id,'user_id':user_id,'objective':objective,
				csrfmiddlewaretoken:csrftoken},
				error:(function(error){
					alert_lobibox('error',error.statusText);
				})
		}).done(function(json_data){
			var data=JSON.parse(json_data);
			if(data.status == 'NTE-001'){
				$('#Update_objective_Modal').modal('toggle')
				team_view_page_render(data.team_id,'user');
				alert_lobibox('success',data.message)
			}if(data.status == 'NTE-002'){
				alert_lobibox('error',data.message)
			}if(data.status == 'NTE-003'){
				alert_lobibox('error',data.message)
			}
		})
	}
	return false
})

function remove_objective_setting_confirmation()
{
	delete_objective($('#org_set_objective_name').attr('data-orgobjectiveid'),'')
}
//Delete Functionality Model Box for Objective
function delete_objective(objective_id,objective_text){
	swal({
		title: "Are you sure you want to delete this "+objective_text+" ?",
		text: "",
		type: "warning",
		showCancelButton: true,
		confirmButtonClass: "btn-success pull-left btn-eql-wid btn-animate",
		cancelButtonClass: "btn-danger pull-right btn-eql-wid btn-animate",
		confirmButtonText: "Yes",
		cancelButtonText: "No",
		closeOnConfirm: true,
		closeOnCancel: true
	},
	function(isConfirm) {
		if(isConfirm){
			confirm_delete_objective(objective_id)
		}
	});
}

function confirm_delete_objective(objective_id){
	var csrftoken = getCookie('csrftoken');
	$.ajax({
		url:'/pm_delete_objective/',
		type:'POST',
		data:{'objective_id':objective_id,'team_id':team_id,
			csrfmiddlewaretoken:csrftoken},
			error:(function(error){
				alert_lobibox('error',error.statusText);
			})
	}).done(function(json_data){
		var data=JSON.parse(json_data);
		if(data.status == 'NTE-001'){
			team_view_page_render($('#hidden_objective_filter_id').text(),$('#hidden_objective_filter_type').text())
			common_chart($('#hidden_objective_filter_id').text(),$('#hidden_objective_filter_type').text())
			alert_lobibox('success',data.message)
		}else{
			alert_lobibox('error',data.message)	
		}
	})
}

//Assign Member List
function assign_member(){
	var csrftoken = getCookie('csrftoken');
	var selectData = ''
		$.ajax({
			url:'/pm_member_list/',
			type:'POST',
			data:{'user_id':user_id,csrfmiddlewaretoken:csrftoken},
			async:false,
			error:(function(error){
				alert_lobibox('error',error.statusText);
			})
		}).done(function(json_data){
			data=JSON.parse(json_data);
			for(var i=0;i<data.member_list.length;i++){
				if(data.member_list[i]['employee_name']!='' && data.member_list[i]['employee_name']!= null){
					selectData = selectData + '<option value="'+data.member_list[i]['id']+'">'+data.member_list[i]['employee_name']+'</option>'
				}
			}
		})
		return selectData
}

//add key-results functionality

function add_keyresults(objective_id,start_date,end_date){
	var csrftoken = getCookie('csrftoken');
	kr_set_clear_cancel();
	$('#org_set_key_result').attr("data-orgobjectiveid",objective_id)
	$("#add_keyresult_modal").modal('show')
	$("#kr_set_start_date").val(start_date);
	$("#kr_set_end_date").val(end_date);
	$("#kr_start_date").DateTimePicker({dateFormat: "dd-MMM-yyyy",minDate:new Date(start_date),maxDate:new Date(end_date)});
	$("#kr_end_date").DateTimePicker({dateFormat: "dd-MMM-yyyy",minDate:new Date(start_date),maxDate:new Date(end_date)});
	kr_setting_button_display('add');
	$('.errormessage').html('')
}

//common function for view the objective and key results
function team_view_page_render(filter_id,filter_type){
	var permission_access
	var csrftoken = getCookie('csrftoken');
	$.ajax({
		url:'/pm_teamview_page/',
		type:'POST',
		async:false,
		data:{'filter_id':filter_id,'user_id':user_id,'filter_type':filter_type,
			csrfmiddlewaretoken:csrftoken},
			error:(function(error){
				alert_lobibox('error',error.statusText);
			})
	}).done(function(json_data){
		var data=JSON.parse(json_data);
		var strContent = '';
		if(data.hierarchy_detail!=undefined)
		{
			$('.user_details').empty();
			$('.user_details').append('<li><img src="'+image_path+'no_data.png" class="staff-photo"></li>'+
					'<li><p class="main-name">'+data.hierarchy_detail[0].name+'<span class="sub-name"> </span></p>'+
					'<p class="designation">'+data.hierarchy_detail[0].sub_name+'</p>'+
					'<p class="update-date">( Last updated on '+data.hierarchy_detail[0].last_update+')</p>'
			)
		}
		$("#dynamic_addobjective_div").empty();
		if(data.status == 'NTE-001'){
			permission_access=data.permission_access[0].permission_id
			$('#hidden_objective_filter_type').text(filter_type)
			$('#hidden_objective_filter_id').text(filter_id)
			for(i=0;i<data.team_details.length;i++){
				if(data.team_details[i].objective.length>10){
					var objective_text=data.team_details[i].objective.substring(0,8)+'...'
				}else{
					var objective_text=data.team_details[i].objective
				}
				strContent+='<div class="panel panel-default objective_heading" data-index='+data.team_details[i].objective_id+'><div class="panel-heading">'+
				'<h4 class="panel-title"> <a class="accordion-toggle accordion-toggle-styled" data-toggle="collapse" data-parent="#dynamic_addobjective_div" href="#'+data.team_details[i].objective_id+'">Objective - '+(i+1)+' : '+data.team_details[i].objective+'</a> </h4>'+
				'<div class="objective-options">'+
				'<span class="total-KR">KR<span>'+data.team_details[i].keyresult_count+'</span></span>'+
				'<label class="padding-right-30"><span class="actual-value">'+data.team_details[i].completion+'%</span> / <span class="planned-value"> '+data.team_details[i].expectation+'%</span></label>'
				if(global_access_level != 'level3')
				{
					strContent+='<div class="btn-group btn-hide-arrow">'
					strContent+='<button class="dropdown-toggle transparent-btn" type="button" data-toggle="dropdown" aria-expanded="false"> <i class="fa fa-ellipsis-v" aria-hidden="true"></i></button>'
					strContent+='<ul class="dropdown-menu objective-dropdown" role="menu">'	
					strContent+='<li onclick="edit_objective(\''+data.team_details[i].objective_id+'\',\''+data.team_details[i].team_id+'\',\'' + user_id + '\',\'' + data.team_details[i].objective + '\')"><a>Edit Objective</a></li>'
				    strContent+='<li onclick="delete_objective(\''+data.team_details[i].objective_id+'\',\''+objective_text+ '\')"><a>Delete Objective</a></li>'
					strContent+='<li onclick=add_keyresults("'+data.team_details[i].objective_id+'","'+data.team_details[i].obj_start_date+'","'+data.team_details[i].obj_end_date+'")><a>Add KR</a></li>'
					strContent+='</ul></div>'
				}
				strContent+='</div></div>'
				strContent+='<div id="'+data.team_details[i].objective_id+'" class="panel-collapse in keyresult_div" data-index="'+data.team_details[i].objective_id+'" data-team="'+data.team_details[i].team_id+'">'
				for(var j=0; j<data.team_details[i].keyresult_id.length; j++){
					var count=j+1;
					if(data.team_details[i].key_result[j]){
						keyresult_name= data.team_details[i].key_result[j];
					}else{
						keyresult_name='Enter KeyResult';
					}
					if(data.team_details[i].keyresult_id[j]!='0'){
						var class_name='';
						var image_Content='';
						//Calculation For Key result On Track,Off track,Completed,At Risk
						var today = new Date();
						var day = today.getDate();
						var month = today.getMonth()+1;
						var year = today.getFullYear();
						var current_date=year + '-' +((''+month).length<2 ? '0' : '') + month + '-' +((''+day).length<2 ? '0' : '') + day;
						var current_date= new Date(current_date)
						var due_date =  new Date(data.team_details[i].due_date_format[j])
						var timeDiff = Math.abs(current_date.getTime() - due_date.getTime());
						var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
						if(data.team_details[i].progress[j] == 100){
							class_name='kr_completed'
						}else if(current_date>=due_date){
							if(diffDays >= 3 & data.team_details[i].progress[j] < 100){
								class_name='kr_risk'
							}else if((diffDays >= 1  & diffDays < 3) && data.team_details[i].progress[j] < 100){
								class_name='kr_exceeded'
							}else if(diffDays==0 && data.team_details[i].progress[j] < 100){
								class_name='kr_ontrack'
							}
						}else if(current_date<=due_date & data.team_details[i].progress[j] < 100){
							class_name='kr_ontrack'
						}
						assigned_type=data.team_details[i].assigned_type[j]
						if(assigned_type=='Organization')
						{
							assigned_to=data.team_details[i].organization[j]
						}
						else if(assigned_type=='Organization Unit')
						{
							assigned_to=data.team_details[i].organization_unit[j]
						}
						else if(assigned_type=='Division')
						{
							assigned_to=data.team_details[i].department[j]
						}
						else
						{
							assigned_to=data.team_details[i].employee_name[j]
						}
						strContent+='<div data-index="'+data.team_details[i].keyresult_id[j]+'" class="keyresult_sub_div '+class_name+'">'+
						'<div class="row OKR-Title">'+
						'<div class="col-sm-12">'+
						'<label>'+image_Content+' <label>KR:'+count+'</label><span class="change_keyresult" data-column_name="key_result" id="keyresult_span'+data.team_details[i].keyresult_id[j]+'" > '+keyresult_name+'</span>'+
//						'<input placeholder="Enter Keyresult" class="form-control edit_kr change_keyresult_details" data-column_name="key_result" type="text" id="keyresult_edit'+data.team_details[i].keyresult_id[j]+'" value="'+data.team_details[i].key_result[j]+'" style="display:none" data-index="'+data.team_details[i].keyresult_id[j]+'" maxlength="50"/>' +
						'</label>'+
						'</div></div>'+
						'<div class="row OKR-fields">'+
						'<div class="col-sm-12">'+
						'<form class="form-horizontal form-bordered" method="post">'+
						'<div class="form-body">'+
						'<div class="row">'+
						'<div class="col-sm-6 col-lg-3">'+
						'<div class="form-group">'+
						'<input type="text" value="" class="objective_progress" data-column_name="progress" data-value="'+data.team_details[i].progress[j]+'"/>'+
						'</div></div>'+
						'<div class="col-sm-6 col-lg-3">'+
						'<div class="form-group">'+
						'<label >Assigned '+assigned_type+'</label><div class="">' +
						'<span type="text" class="form-control form-control-inline "  id="kr_set_9" >'+assigned_to+'</span>'+
//						'<input type="text" class="form-control form-control-inline " placeholder="'+assigned_to+'" id="kr_set_'+data.team_details[i].keyresult_id[j]+'" readonly/></div>'+
//						'<option value=""  disabled="disabled">-Select-</option><option value="'+data.team_details[i].assigned_id[j]+'">'+data.team_details[i].assigned_name[j]+'</option>'+
						'</div></div></div>'+
						'<div class="col-sm-6 col-lg-2">'+
						'<div class="form-group">'+
						'<label class="control-label">Start date</label>'+
						'<div class="input-icon ">'+
						'<i class="fa fa-calendar cicon"></i>'+
						'<input class="form-control form-control-inline objective_startdate change_keyresult"  type="text" placeholder="Start date" data-column_name="start_date" data-field="date" data-value="'+data.team_details[i].start_date[j]+'" readonly>'+
						'<div class="kr_date"></div>'+
						'</div></div></div>'+		
						'<div class="col-sm-6 col-lg-2">'+
						'<div class="form-group">'+
						'<label class="control-label">Due date</label>'+
						'<div class="input-icon">'+
						'<i class="fa fa-calendar"></i>'+
//						'<input class="form-control date-picker objective_duedate change_keyresult" size="16" type="text" placeholder="Due date" data data-column_name="due_date" data-date-start-date="'+data.team_details[i].start_date[j]+'" data-value="'+data.team_details[i].due_date[j]+'" readonly>'+
						'<input class="form-control form-control-inline objective_duedate change_keyresult"  type="text" placeholder="Due date" data-column_name="due_date" data-field="date" data-date-start-date="'+data.team_details[i].start_date[j]+'"  data-value="'+data.team_details[i].due_date[j]+'" readonly>'+
						'<div class="kr_date"></div>'+
						'</div></div></div>'+
						'<div class="col-sm-6 col-lg-2 comments-icon">'
						if(global_access_level != 'level3')
						{
								strContent+='<button class=" btn btn-sm btn-success edit-icon keyresult_edit_button" title="edit" ><i class="nf nf-pencil-square-o"></i></button>'
								strContent+='<button class=" btn btn-sm btn-danger remove_keyresult" title="Delete"><i class="fa fa-trash "></i></button>'
						}
						strContent+='</div></div></div></form></div></div></div>';

					}
				}
				strContent+='</div></div>'
			}
		}
		$('#dynamic_addobjective_div').append(strContent);
		console.log(strContent)
		/*$(".kr_date").DateTimePicker({
			dateFormat: "dd-MMM-yyyy"
		});*/
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = "/static/dev/NTree/ui/plugins/select2/js/components-select2.min.js"; 
		document.getElementsByTagName("head")[0].appendChild(script);
		if(global_access_level != 'level3'){
				$(".objective_progress").ionRangeSlider({type:"single",grid:!0,min:0,max:100,from:0,to:0,
					onChange: function (data) {
						keyresult_change(data.input)
					}
				});	
			}
		else{
			$(".objective_progress").ionRangeSlider({type:"single",grid:!0,min:0,max:100,from:0,to:0,
				onChange: function (data) {
					keyresult_change(data.input)
				},
				disable:true
			});}
		$('.date-picker').datepicker({
			format:"dd-M-yyyy"
		});
		$('select').each(function(){
			value = $(this).attr('data-value')
			if (value && value != 'null') {
				$(this).val(value);}
			else{
				$(this).val("0");	}
		});
		$('input').each(function(){
			value = $(this).attr('data-value')
			if (value && value != 'null') {
				$(this).val(value);}
			else{
				$(this).val("");	}
		});
		$('.objective_progress').each(function(){
			progress_value = $(this).attr('data-value')
			if(progress_value && progress_value!='null'){
				progress_value = progress_value.split(';')
				var slider = $(this).data("ionRangeSlider");
				slider.update({
					from: progress_value[0],
					to: progress_value[1]
				});
			}else{
				$(".objective_progress").ionRangeSlider({type:"single",grid:!0,min:0,max:100,from:0,to:0});
			}
		});
		$(".change_keyresult").change( function() {
			keyresult_change($(this));
		});
		if(user_id){
			$("#filter_employee_name").val(user_id)
		}else{
			$("#filter_employee_name").val('0')
		}
	});
}

//Delete Functionality Model Box for Key result 
function remove_key_result_confirmation()
{
	delete_keyresult_function($('#org_set_key_result').attr('data-orgkrid'),$('#org_set_key_result').val(),$("#org_set_key_result").attr('data-orgobjectiveid'))
}

function delete_keyresult_function(keyresult_id,keyresult_text,objective_id){
	swal({
		title: "Are you sure you want to delete this "+keyresult_text+" ?",
		text: "",
		type: "warning",
		showCancelButton: true,
		confirmButtonClass: "btn-success pull-left btn-eql-wid btn-animate",
		cancelButtonClass: "btn-danger pull-right btn-eql-wid btn-animate",
		confirmButtonText: "Yes",
		cancelButtonText: "No",
		closeOnConfirm: true,
		closeOnCancel: true
	},
	function(isConfirm) {
		if(isConfirm){
			confirm_delete_keyresult(keyresult_id,objective_id)
		}
	});
}

function confirm_delete_keyresult(keyresult_id,objective_id){
	var csrftoken = getCookie('csrftoken');
	$.ajax({
		url:'/pm_delete_keyresults/',
		type:'POST',
		data:{'keyresult_id':keyresult_id,'objective_id':objective_id,
			csrfmiddlewaretoken:csrftoken},
			error:(function(error){
				alert_lobibox('error',error.statusText);
			})
	}).done(function(json_data){
		var data=json_data
		if(data.status == 'NTE_04'){
			team_view_page_render($('#hidden_objective_filter_id').text(),$('#hidden_objective_filter_type').text())
			common_chart($('#hidden_objective_filter_id').text(),$('#hidden_objective_filter_type').text())
			alert_lobibox('success',sysparam_datas_list[data.status])
		}
		if(data.status=='ERR0028')
		{
			alert_lobibox('success',sysparam_datas_list[data.status])
		}
		if(data.status == 'NTE-002'){
			alert_lobibox('error',data.message)
		}if(data.status == 'NTE-003'){
			alert_lobibox('error',data.message)
		}
	})
}

//delete functionality of key results
$(document).on("click",".remove_keyresult", function(){
	keyresult_id=$(this).parents(".keyresult_sub_div").attr('data-index')
	objective_id=$(this).parents(".keyresult_div").attr('data-index')
	team_id=$(this).parents(".keyresult_div").attr('data-team')
	keyresult_text=$(this).parents(".OKR-fields").siblings('.OKR-Title').find('label > label').text()
	delete_keyresult_function(keyresult_id,keyresult_text,objective_id)
	return false;
})

$(document).on("click",".keyresult_edit_button",function(){
	keyresult_id=$(this).parents(".keyresult_sub_div").attr('data-index')
	$.ajax({
		url:'/pm_keyresult_view/',
		type:'POST',
		async:false,
		data:{'keyresult_id':keyresult_id,csrfmiddlewaretoken:getCookie('csrftoken')}
	}).done(function(json_data){
		data=json_data.kr_data
		kr_set_clear_cancel()
		$('#add_keyresult_modal').modal('show')
		$('#org_set_key_result').val(data[0].kr_summary)
		$('#org_set_key_result').attr('data-orgobjectiveid',data[0].strategic_objectives_id)
		$('#org_set_key_result').attr('data-orgkrid',data[0].kr_id)
		$('#kr_set_start_date').val(data[0].kr_start_date)
		$('#kr_set_end_date').val(data[0].kr_end_date)
		start_date=data[0].obj_start_date
		end_date=data[0].obj_end_date
		$("#kr_start_date").DateTimePicker({dateFormat: "dd-MMM-yyyy",minDate:new Date(start_date),maxDate:new Date(end_date)});
		$("#kr_end_date").DateTimePicker({dateFormat: "dd-MMM-yyyy",minDate:new Date(start_date),maxDate:new Date(end_date)});
		$("#kr_set_assign_type").val(data[0].assigned_type).trigger("change");
		$("#kr_set_department").val(data[0].department_id).trigger("change")
		$("#kr_set_employee").val(data[0].employee_id).trigger("change")
		kr_setting_button_display('update')
	})
	return false;
});

function kr_set_clear_cancel()
{
	$('#org_set_key_result').val('')
	$('#org_set_key_result').attr('data-orgkrid','')
//	$("#kr_start_date").DateTimePicker({dateFormat: "dd-MMM-yyyy"});
//	$("#kr_end_date").DateTimePicker({dateFormat: "dd-MMM-yyyy"});
	$('#kr_set_start_date').val('');
	$('#kr_set_end_date').val('')
	$('#kr_set_assign_type').val('').trigger("change");
	kr_setting_button_display("add")
	$('.errormessage').html('')
}

//update the key results
function keyresult_change(el){
	Lobibox.notify.closeAll();
	var csrftoken = getCookie('csrftoken');
	column_value = el.val();
	column_name=el.attr("data-column_name")
	keyresult_id=el.parents(".keyresult_sub_div").attr('data-index')
	objective_id=el.parents(".keyresult_div").attr('data-index')
	team_id=el.parents(".keyresult_div").attr('data-team')
	var validate_result =true
	var validate_required=true
	if(column_name=='key_result'){
		if(!column_value.trim()){
			validate_required=false
		}
		else if(column_value.length>50){
			validate_result=false
		}
	}
	swal({
		title: "Are you sure you want to change the progress ?",
		text: "",
		type: "warning",
		showCancelButton: true,
		confirmButtonClass: "btn-success pull-left btn-eql-wid btn-animate",
		cancelButtonClass: "btn-danger pull-right btn-eql-wid btn-animate",
		confirmButtonText: "Yes",
		cancelButtonText: "No",
		closeOnConfirm: true,
		closeOnCancel: true
	},
	function(isConfirm) {
		if(isConfirm){
			if(validate_result & validate_required){
				$.ajax({
					url:'/pm_update_keyresults/',
					type:'POST',
					data:{'objective_id':objective_id,'team_id':team_id,'keyresult_id':keyresult_id,'column_name':column_name,'column_value':column_value,
						csrfmiddlewaretoken:csrftoken},
						error:(function(error){
							alert_lobibox('error',error.statusText);
						})
				}).done(function(json_data){
					var data=JSON.parse(json_data);
					if(data.status == 'NTE-001'){
						team_view_page_render($('#hidden_objective_filter_id').text(),$('#hidden_objective_filter_type').text())
						common_chart($('#hidden_objective_filter_id').text(),$('#hidden_objective_filter_type').text())
						$("#keyresult_span"+data.keyresult_id).show();
						$("#keyresult_edit"+data.keyresult_id).hide();
						alert_lobibox('success',data.message)
					}if(data.status == 'NTE-002'){
						alert_lobibox('error',data.message)
					}if(data.status == 'NTE-003'){
						alert_lobibox('error',data.message)
					}
				})
			}else if(validate_required==false){
				alert_lobibox('error',"Keyresult name is required")
				$("#keyresult_span"+keyresult_id).show();
				$("#keyresult_edit"+keyresult_id).hide();
			}else{
				alert_lobibox('error',"Enter maximum 50 characters for key result")
				$("#keyresult_span"+keyresult_id).show();
				$("#keyresult_edit"+keyresult_id).hide();
			}
		}
		else
		{team_view_page_render($('#hidden_objective_filter_id').text(),$('#hidden_objective_filter_type').text())
			common_chart($('#hidden_objective_filter_id').text(),$('#hidden_objective_filter_type').text())
		}
	});
}

//add objective 
function objectiveAdd(org_unit_id){

	obj_set_clear_cancel();
	obj_setting_button_display('add')
	$('#org_set_objective_name').attr("data-orgobjectiveid",'')
	$('#bsc_perspective').html("")
	$("#am_start_date").DateTimePicker({
		dateFormat: "dd-MMM-yyyy"
	});
	$("#am_end_date").DateTimePicker({
		dateFormat: "dd-MMM-yyyy"
	});
	orgUnit_id = org_unit_id;
	$.ajax({
		url:'/objective_perspective_view/',
		type:'GET',
		error:(function(error){
			alert_lobibox('error',error.statusText);
		})
	}).done(function(json_data){
//		var data=JSON.parse(json_data);
		if(json_data.status == 'NTE_01'){
			$('#bsc_perspective').append('<option value="">--Select--</option>');
			for(i=0;i<json_data.perspective_details.length;i++){
				$('#bsc_perspective').append($('<option>',{
					value:json_data.perspective_details[i].id,
					text:json_data.perspective_details[i].refitems_name
				}));
			}
		}else if(json_data.status == 'NTE_02'){
			alert_lobibox('error',json_data.message)
		}else if(json_data.status == 'NTE_03'){
			alert_lobibox('error',json_data.message)
		}
	})
	$('#Add_objective_Modal').modal('show')
}

function hierarchical_view(){
	var csrftoken = getCookie('csrftoken');
	filter_type=$('#hidden_objective_filter_type').text()
	filter_id=$('#hidden_objective_filter_id').text()
	$.ajax({
		url:'/pm_teamview_page/',
		type:'POST',
		data:{'filter_type':filter_type,'filter_id':filter_id,
			csrfmiddlewaretoken:csrftoken},
			error:(function(error){
				alert_lobibox('success',data.message);
			})
	}).done(function(json_data){
		var data=JSON.parse(json_data);
		$('.hierarchicalview_emp').html("")
		var Str_Content=''
			if(data.status == 'NTE-001'){
				if(global_filter_name==undefined || data.hierarchy_detail!=undefined)
				{
					Str_Content+='<img src="'+image_path+'no_data.png" class="staff-photo">'
					Str_Content+='<li><p class="main-name">'+data.hierarchy_detail[0].name+'<span class="sub-name">   </span></p>'+
					'<p class="designation">'+data.hierarchy_detail[0].sub_name+'</p>'
				}
				else
				{
					Str_Content+='<img src="'+global_filter_image+'" class="staff-photo">'
					Str_Content+='<li><p class="main-name">'+global_filter_name+'<span class="sub-name">   </span></p>'+
					'<p class="designation">'+ global_filter_subname+'</p>'}
				Str_Content+='<ul class="second-scene hierarchicalview_ul">'

					for(var i=0;i<data.team_details.length;i++){
						var kr_no=0
						Str_Content_Values=''
							Str_Content+='<li data-index='+data.team_details[i].objective_id+'>'+
							'<span class="O-title">'+data.team_details[i].objective+'</span>'+
							'<ul class="third-scene animated fadeInLeft">'
							if(data.team_details[i].keyresult_id.length>0){
								for(var j=0; j<data.team_details[i].keyresult_id.length; j++){
									var kr_no=j+1
									if(data.team_details[i].keyresult_id[j]!='0'){
										Str_Content_Values+='<li data-index='+data.team_details[i].keyresult_id[j]+'>KR:'+kr_no +' ' +data.team_details[i].key_result[j]+'</li>'
									}
								}
							}
						Str_Content+=Str_Content_Values+'</ul></li>'
					}
				Str_Content+='</ul>'
					$('.hierarchicalview_emp').append(Str_Content)
					$(".O-title").click(function(){
						$(this).next("ul").toggle();
					});
			}if(data.status == 'NTE-002'){
				alert_lobibox('error',data.message)	
			}if(data.status == 'NTE-003'){
				alert_lobibox('error',data.message)	
			}
	})
}

$('#hierarchical_view').click(function(){
	hierarchical_view();
})

$("#filter_employee_name").change( function() {
	flag_value=1
	user_id=$("#filter_employee_name").val()
	emp_userid_details(user_id)
	team_view_page_render(user_id,'employee_id');
	common_chart(user_id,'employee_id')
})

function obj_set_clear_cancel(){
	$('#org_set_objective_name').val('')
	$('#org_set_objective_name').attr('data-orgobjectiveid','')
	$('#bsc_perspective').val('').trigger("change");
	$('#obj_plan_type').val('').trigger("change");
	$('#obj_set_assign_type').val('').trigger("change");
	$('#obj_set_employee').val('').trigger("change");
	$('#obj_set_org').val('');
	$('#obj_set_orgunit').val('');
	$('#obj_set_department').val('').trigger("change");
	$("#obj_set_start_date").val('');
	$("#obj_set_end_date").val('');
	$("#am_start_date").DateTimePicker({dateFormat: "dd-MMM-yyyy"});
	$("#am_end_date").DateTimePicker({dateFormat: "dd-MMM-yyyy"});
	obj_setting_button_display('add');
	$('.errormessage').html('');
}

$(document).on("click","#mobilemenu li", function(){
	$('.nav_trigger').removeClass('active')
});

$("#obj_set_monthlist").change( function() {
	year=$( "#obj_set_yearlist option:selected" ).text();
	month=$("#obj_set_monthlist option:selected" ).text();
	if(month!='' && year!='')
	{
		day_month='1'+month+' '+year
		var start = new Date(day_month);
		start_date = moment(start).format("DD-MMM-YYYY");
		var end = new Date(day_month);
		var end_date_format = new Date(end.getFullYear(), end.getMonth() + 1, 0);
		end_date = moment(end_date_format).format("DD-MMM-YYYY");
		$("#am_start_date").DateTimePicker({dateFormat: "dd-MMM-yyyy",minDate:new Date(day_month),maxDate:new Date(end.getFullYear(), end.getMonth() + 1, 0)});
		$("#am_end_date").DateTimePicker({dateFormat: "dd-MMM-yyyy",minDate:new Date(day_month),maxDate:new Date(end.getFullYear(), end.getMonth() + 1, 0)});
		$("#obj_set_start_date").val(start_date)
		$("#obj_set_end_date").val(end_date)
	}
	else
	{
		$("#obj_set_start_date").val('')
		$("#obj_set_end_date").val('')
	}
})

$('#obj_set_quarterlist').change(function(){
	quarterVal = $('#obj_set_quarterlist').val()
	if(quarterVal!='' && $( "#obj_set_yearlist option:selected" ).text()!='' )
	{
		yearVal = $( "#obj_set_yearlist option:selected" ).text();
		var start = new Date(yearVal,quarterVal*3-3,1);
		var end = new Date(yearVal,quarterVal*3,0);
		$("#am_start_date").DateTimePicker({
			dateFormat: "dd-MMM-yyyy",
			minDate:start,
			maxDate:end
		});
		$("#am_end_date").DateTimePicker({
			dateFormat: "dd-MMM-yyyy",
			minDate:start,
			maxDate:end
		});
		$("#obj_set_start_date").val(moment(start).format("DD-MMM-YYYY"))
		$("#obj_set_end_date").val(moment(end).format("DD-MMM-YYYY"))
	}
	else
	{
		$("#obj_set_start_date").val('')
		$("#obj_set_end_date").val('')
	}
})

$('#obj_set_assign_type').change(function(){
	assign_type = $('#obj_set_assign_type').val()
	orgUnit_id=$('#org_unit_button_id').attr('data-filter-id')
	$('#obj_set_employee').html("")
	$('#obj_set_department').html("")
	if(assign_type=='')
	{
		$("#employee_div").css('display','none')
		$("#organization_div").css('display','none')
		$("#organization_unit_div").css('display','none')
		$("#department_div").css('display','none')
		$('#obj_set_org').val('')
		$('#obj_set_org').attr('data-orgid', '')
		$('#obj_set_orgunit').attr('data-orgunitid', '')
		$('#obj_set_orgunit').val('')
		$('#obj_set_department').val('')
		$('#obj_set_employee').val('')
	}
	else
	{
		$.ajax({
			url:'/objective_perspective_retrieve/',
			type:'GET',
			async:false,
			data:{'orgUnit_id':orgUnit_id,'assign_type':assign_type},
			error:(function(error){
				alert_lobibox('error',error.statusText);
			})
		}).done(function(json_data){
			if(json_data.status == 'NTE_01'){
				if(assign_type=="Employee"){
					$("#employee_div").css('display','block')
					$("#organization_div").css('display','none')
					$("#organization_unit_div").css('display','none')
					$("#department_div").css('display','none')
					$('#obj_set_org').val('')
					$('#obj_set_org').attr('data-orgid', '')
					$('#obj_set_orgunit').attr('data-orgunitid', '')
					$('#obj_set_orgunit').val('')
					$('#obj_set_department').val('')
					$('#obj_set_employee').append('<option value="">--Select--</option>');
					for(i=0;i<json_data.assigned_type.length;i++){
						$('#obj_set_employee').append($('<option>',{
							value:json_data.assigned_type[i].employee_id,
							text:json_data.assigned_type[i].employee_name
						}));
					}
				}
				else if(assign_type=="Organization"){
					$("#employee_div").css('display','none')
					$("#organization_div").css('display','block')
					$("#organization_unit_div").css('display','none')
					$("#department_div").css('display','none')
					$('#obj_set_employee').val('')
					$('#obj_set_orgunit').val('')
					$('#obj_set_orgunit').attr('data-orgunitid', '')
					$('#obj_set_department').val('')
					$("#obj_set_org").val(json_data.assigned_type[0].organization_name)
					$('#obj_set_org').attr('data-orgid', json_data.assigned_type[0].organization_id)
				}
				else if(assign_type=="Organization Unit"){
					$("#employee_div").css('display','none')
					$("#organization_div").css('display','none')
					$("#organization_unit_div").css('display','block')
					$("#department_div").css('display','none')
					$('#obj_set_employee').val('')
					$('#obj_set_org').val('')
					$('#obj_set_org').attr('data-orgid', '')
					$('#obj_set_department').val('')
					$("#obj_set_orgunit").val(json_data.assigned_type[0].organization_unit_name)
					$('#obj_set_orgunit').attr('data-orgunitid', json_data.assigned_type[0].organization_unit_id)
				}
				else if(assign_type=="Division"){
					$("#employee_div").css('display','none')
					$("#organization_div").css('display','none')
					$("#organization_unit_div").css('display','none')
					$("#department_div").css('display','block')
					$('#obj_set_employee').val('')
					$('#obj_set_org').val('')
					$('#obj_set_orgunit').val('')
					$('#obj_set_org').attr('data-orgid', '')
					$('#obj_set_orgunit').attr('data-orgunitid', '')
					$('#obj_set_department').append('<option value="">--Select--</option>');
					for(i=0;i<json_data.assigned_type.length;i++){
						$('#obj_set_department').append($('<option>',{
							value:json_data.assigned_type[i].department_id,
							text:json_data.assigned_type[i].department_name
						}));
					}
				}
			}else if(json_data.status == 'NTE_02'){
				alert_lobibox('error',json_data.message)
			}else if(json_data.status == 'NTE_03'){
				alert_lobibox('error',json_data.message)
			}
		})
	}
})

$('#kr_set_assign_type').change(function(){
	assign_type = $('#kr_set_assign_type').val()
	orgUnit_id=$('#org_unit_button_id').attr('data-filter-id')
	$('#kr_set_employee').html("")
	$('#kr_set_department').html("")
	if(assign_type=='')
	{
		$("#key_result_employee_div").css('display','none')
		$("#key_result_organization_div").css('display','none')
		$("#key_result_organization_unit_div").css('display','none')
		$("#key_result_department_div").css('display','none')
		$('#kr_set_employee').val('')
		$('#kr_set_orgunit').val('')
		$('#kr_set_orgunit').attr('data-orgunitid', '')
		$('#kr_set_department').val('')
		$("#kr_set_org").val('')
		$('#kr_set_org').attr('data-orgid','')
	}
	else
	{
		$.ajax({
			url:'/objective_perspective_retrieve/',
			type:'GET',
			async:false,
			data:{'orgUnit_id':orgUnit_id,'assign_type':assign_type},
			error:(function(error){
				alert_lobibox('error',error.statusText);
			})
		}).done(function(json_data){
			if(json_data.status == 'NTE_01'){
				if(assign_type=="Employee"){
					$("#key_result_employee_div").css('display','block')
					$("#key_result_organization_div").css('display','none')
					$("#key_result_organization_unit_div").css('display','none')
					$("#key_result_department_div").css('display','none')
					$('#kr_set_org').val('')
					$('#kr_set_org').attr('data-orgid', '')
					$('#kr_set_orgunit').attr('data-orgunitid', '')
					$('#kr_set_orgunit').val('')
					$('#kr_set_department').val('')
					$('#kr_set_employee').append('<option value="">--Select--</option>');
					for(i=0;i<json_data.assigned_type.length;i++){
						$('#kr_set_employee').append($('<option>',{
							value:json_data.assigned_type[i].employee_id,
							text:json_data.assigned_type[i].employee_name
						}));
					}
				}
				else if(assign_type=="Organization"){
					$("#key_result_employee_div").css('display','none')
					$("#key_result_organization_div").css('display','block')
					$("#key_result_organization_unit_div").css('display','none')
					$("#key_result_department_div").css('display','none')
					$('#kr_set_employee').val('')
					$('#kr_set_orgunit').val('')
					$('#kr_set_orgunit').attr('data-orgunitid', '')
					$('#kr_set_department').val('')
					$("#kr_set_org").val(json_data.assigned_type[0].organization_name)
					$('#kr_set_org').attr('data-orgid', json_data.assigned_type[0].organization_id)
				}
				else if(assign_type=="Organization Unit"){
					$("#key_result_employee_div").css('display','none')
					$("#key_result_organization_div").css('display','none')
					$("#key_result_organization_unit_div").css('display','block')
					$("#key_result_department_div").css('display','none')
					$('#kr_set_employee').val('')
					$('#kr_set_org').val('')
					$('#kr_set_org').attr('data-orgid', '')
					$('#kr_set_department').val('')
					$("#kr_set_orgunit").val(json_data.assigned_type[0].organization_unit_name)
					$('#kr_set_orgunit').attr('data-orgunitid', json_data.assigned_type[0].organization_unit_id)
				}
				else if(assign_type=="Division"){
					$("#key_result_employee_div").css('display','none')
					$("#key_result_organization_div").css('display','none')
					$("#key_result_organization_unit_div").css('display','none')
					$("#key_result_department_div").css('display','block')
					$('#kr_set_employee').val('')
					$('#kr_set_org').val('')
					$('#kr_set_orgunit').val('')
					$('#kr_set_org').attr('data-orgid', '')
					$('#kr_set_orgunit').attr('data-orgunitid', '')
					$('#kr_set_department').append('<option value="">--Select--</option>');
					for(i=0;i<json_data.assigned_type.length;i++){
						$('#kr_set_department').append($('<option>',{
							value:json_data.assigned_type[i].department_id,
							text:json_data.assigned_type[i].department_name
						}));
					}
				}
			}else if(json_data.status == 'NTE_02'){
				alert_lobibox('error',json_data.message)
			}else if(json_data.status == 'NTE_03'){
				alert_lobibox('error',json_data.message)
			}
		})
	}
})

function add_update_objective_setting(){
	objective_id=$('#org_set_objective_name').attr("data-orgobjectiveid")
	month='';
	quarter='';
	var dynamic_addobjective_values='';
	objective_name=$('#org_set_objective_name').val();
	bsc_perspective=$('#bsc_perspective').val();
	start_date=$('#obj_set_start_date').val();
	end_date=$('#obj_set_end_date').val();
	obj_plan_type=$('#obj_plan_type').val();
	assign_type=$('#obj_set_assign_type').val();
	year=$('#obj_set_yearlist').val();
	var status=objective_form_validation();
	if(year=='') {$('#yearly_error_message').html('The field is required') }
	else { $('#yearly_error_message').html('') }
	if($('#obj_plan_type').val()=='monthly')
	{
		month=$('#obj_set_monthlist').val();
		if(month=='') { $('#monthly_error_message').html('The field is required') }
		else {  $('#monthly_error_message').html('') }
	}
	else
	{
		quarter=$('#obj_set_quarterlist').val();
		if(quarter=='') { $('#quarter_error_message').html('The field is required') }
		else {  $('#quarter_error_message').html('') }
	}
	data = {'strategic_objective_description':objective_name,'start_date':start_date,'end_date':end_date,'objective_plan_type':obj_plan_type,'assigned_type':assign_type,'month':month,'year':year,'quarter':quarter,'objective_id':objective_id,csrfmiddlewaretoken:getCookie('csrftoken')}

	if(assign_type=="Employee"){
		var temp=$('#obj_set_employee').val()
		if(temp==null || temp=='')
		{
			$('#employee_error_message').html('The field is required')
			return false;
		}
		else {
			data['employee'] =  $('#obj_set_employee').val();
			data['assign_type']='employee_id'
				data['assign_id']=$('#obj_set_employee').val();
		}
	}
	else if(assign_type=="Organization"){
		var temp=$('#obj_set_org').val()
		if(temp==null || temp=='')
		{
			$('#org_error_message').html('The field is required')
			return false;
		}
		else {
			data['organization'] = $('#obj_set_org').attr('data-orgid');
			data['assign_type']='organization_id'
				data['assign_id'] = $('#obj_set_org').attr('data-orgid');
		}
	}
	else if(assign_type=="Organization Unit"){
		data['organization_unit'] = $('#obj_set_orgunit').attr('data-orgunitid');
		data['assign_type']='organization_unit_id'
			data['assign_id'] = $('#obj_set_orgunit').attr('data-orgunitid');
	}
	else if(assign_type=="Division"){
		var temp=$('#obj_set_department').val()
		if(temp==null || temp=='')
		{
			$('#dprt_error_message').html('The field is required')
			return false;
		}
		else {
			data['department'] =$('#obj_set_department').val();
			data['assign_type']='department_id'
				data['assign_id'] =$('#obj_set_department').val();
		}
	}
	if(start_date>end_date)
	{
		$('#start_end_error_message').html('End Date must not be less than Start Date')
		return false;
	}
	else
	{
		$('#start_end_error_message').html('')
	}
	if (bsc_perspective)
	{
		data['bsc_perspective'] =bsc_perspective
	}
//	data = {'strategic_objective_description':objective_name,'bsc_perspective':bsc_perspective,'start_date':start_date,'end_date':end_date,'objective_plan_type':obj_plan_type,'assigned_type':assign_type,'month':month,'year':year,'quarter':quarter,'employee':employee,'organization':organization,'organization_unit':organization_unit,'department':department,csrfmiddlewaretoken:getCookie('csrftoken')}
	if(status)
	{
		$.ajax({
			url:'/stratergicObjectivesInsert/',
			type:'POST',
			data: data,
			error:(function(error){
				alert_lobibox('error',error.statusText);
			})
		}).done(function(json_data){
			if(json_data.status == 'NTE_01'){
				alert_lobibox("success", sysparam_datas_list[json_data.status]);
				obj_set_clear_cancel()
				$('#Add_objective_Modal').modal('hide')
				team_view_page_render(json_data.assign_id,json_data.assign_type);
				common_chart(json_data.assign_id,json_data.assign_type)
			}else if(json_data.status == 'NTE_02'){
				$('#Add_objective_Modal').modal('toggle')
				alert_lobibox('error',json_data.message)
				obj_set_clear_cancel()
			}else if(json_data.status == 'NTE_03'){
				alert_lobibox("success", sysparam_datas_list[json_data.status]);
				obj_set_clear_cancel()
				$('#Add_objective_Modal').modal('hide')
				team_view_page_render(json_data.assign_id,json_data.assign_type);
				common_chart(json_data.assign_id,json_data.assign_type)
			}
			if(json_data.assign_type=="employee_id")
			{
				emp_userid_details(json_data.assign_id);
			}

		})
		//	return false
	}
	else { alert_lobibox("info","Fill all the fields"); }
}

$('#obj_plan_type').change(function(){
	$('#obj_set_yearlist').val('').trigger('change')
	$('#obj_set_monthlist').val('').trigger('change')
	$('#obj_set_quarterlist').val('').trigger('change')
	plan = $('#obj_plan_type').val()
	if(plan=="monthly"){
		$('#obj_set_yearlist').parent().parent().css('display','block')
		$('#obj_set_quarterlist').parent().parent().css('display','none')
		$('#obj_set_monthlist').parent().parent().css('display','block')
	}
	else if(plan=="quarterly"){
		$('#obj_set_quarterlist').parent().parent().css('display','block')
		$('#obj_set_yearlist').parent().parent().css('display','block')
		$('#obj_set_monthlist').parent().parent().css('display','none')
	}
	else
	{
		$('#obj_set_yearlist').parent().parent().css('display','none')
		$('#obj_set_quarterlist').parent().parent().css('display','none')
		$('#obj_set_monthlist').parent().parent().css('display','none')
	}
})

function obj_setting_button_display(flag)
{
	$("#obj_set_button_div").empty();
	var btnstr=''
	if (flag=='add'){
			btnstr += '<button type="button" class="btn btn-success btn-eql-wid btn-animate margin-right-3" id="obj_set_add_button" onclick="add_update_objective_setting();">Add</button>';
		}
	else
	{
			btnstr += '<button type="button" class="btn btn-primary btn-eql-wid btn-animate margin-right-3" id="obj_set_update_button" onclick="add_update_objective_setting();">Update</button>';
			btnstr += '<button type="button" class=" btn btn-danger btn-eql-wid btn-animate margin-right-3" id="obj_set_remove_button" onclick="remove_objective_setting_confirmation();">Remove</button>';
		}
	btnstr += '<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-3" id="obj_set_clear_cancel_id" onclick="obj_set_clear_cancel();">Cancel / Clear</button>';
	$("#obj_set_button_div").append(btnstr);    
}

function kr_setting_button_display(flag)
{
	$("#kr_set_button_div").empty();
	var btnstr=''
	if (flag=='add')
	{
		 btnstr += '<button type="button" class="btn btn-success btn-eql-wid btn-animate margin-right-3" id="kr_set_add_button" onclick="add_update_key_result();">Add</button>';
	}
	else
	{
		 btnstr += '<button type="button" class="btn btn-primary btn-eql-wid btn-animate margin-right-3" id="kr_set_update_button" onclick="add_update_key_result();">Update</button>';
		btnstr += '<button type="button" class=" btn btn-danger btn-eql-wid btn-animate margin-right-3" id="kr_set_remove_button" onclick="remove_key_result_confirmation();">Remove</button>';
	}
	btnstr += '<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-3" id="kr_set_clear_cancel_id" onclick="kr_set_clear_cancel();">Cancel / Clear</button>';
	$("#kr_set_button_div").append(btnstr);    
}


function add_update_key_result()
{
	objective_id=$('#org_set_key_result').attr("data-orgobjectiveid")
	key_result=$("#org_set_key_result").val()
	kr_id=$('#org_set_key_result').attr("data-orgkrid")
	start_date=$('#kr_set_start_date').val();
	end_date=$('#kr_set_end_date').val();
	assign_type=$('#kr_set_assign_type').val();
	data = {'objective_id':objective_id,'key_result':key_result,'start_date':start_date,'end_date':end_date,'assigned_type':assign_type,'kr_id':kr_id,csrfmiddlewaretoken:getCookie('csrftoken')}
	if(assign_type=="Employee"){
		var temp=$('#kr_set_employee').val()
		if(temp==null || temp=='')
		{
			$('#employee_message').html('The field is required')
		}
		data['employee'] =  $('#kr_set_employee').val();
		data['assign_type']='employee_id';
		data['assign_id']=$('#kr_set_employee').val();

	}
	else if(assign_type=="Organization"){
		var temp=$('#kr_set_org').val()
		if(temp==null || temp=='')
		{
			$('#organization_message').html('The field is required')
		}
		data['organization'] = $('#kr_set_org').attr('data-orgid');
		data['assign_type']='organization_id';
		data['assign_id'] = $('#kr_set_org').attr('data-orgid');
	}
	else if(assign_type=="Organization Unit"){
		var temp=$('#key_result_organization_unit_div').val()
		if(temp==null || temp=='')
		{
			$('#organization_unit_message').html('The field is required')
		}
		data['organization_unit'] = $('#kr_set_orgunit').attr('data-orgunitid');
		data['assign_type']='organization_unit_id';
		data['assign_id'] = $('#kr_set_orgunit').attr('data-orgunitid');
	}
	else if(assign_type=="Division"){

		var temp=$('#kr_set_department').val()
		if(temp==null || temp=='')
		{
			$('#dvision_error_message').html('The field is required')
		}
		data['department'] =$('#kr_set_department').val();
		data['assign_type']='department_id';
		data['assign_id'] =$('#kr_set_department').val();
	}
	if(start_date>end_date)
	{
		$('#kr_start_end_error_message').html('End Date must not be less than Start Date')
		return false;
	}
	else
	{
		$('#kr_start_end_error_message').html('')
	}
	var satus=okr_form_validation()
	if(satus)
	{
//		data = {'strategic_objective_description':objective_name,'bsc_perspective':bsc_perspective,'start_date':start_date,'end_date':end_date,'objective_plan_type':obj_plan_type,'assigned_type':assign_type,'month':month,'year':year,'quarter':quarter,'employee':employee,'organization':organization,'organization_unit':organization_unit,'department':department,csrfmiddlewaretoken:getCookie('csrftoken')}
		$.ajax({
			url:'/pm_key_result_insert_update/',
			type:'POST',
			data: data,
			error:(function(error){
				alert_lobibox('error',error.statusText);
			})
		}).done(function(json_data){
			if(json_data.status == 'NTE_01'){
				alert_lobibox("success", sysparam_datas_list[json_data.status]);
				$('#add_keyresult_modal').modal('hide')
				kr_set_clear_cancel();
				team_view_page_render(json_data.assign_id,json_data.assign_type);
				common_chart(json_data.assign_id,json_data.assign_type)
			}else if(json_data.status == 'NTE_02'){
				$('#add_keyresult_modal').modal('hide')
				kr_set_clear_cancel();
				alert_lobibox('error',json_data.message)
			}else if(json_data.status == 'NTE_03'){
				alert_lobibox("success", sysparam_datas_list[json_data.status]);
				$('#add_keyresult_modal').modal('hide')
				kr_set_clear_cancel();
				team_view_page_render(json_data.assign_id,json_data.assign_type);
				common_chart(json_data.assign_id,json_data.assign_type)
			}
			if(json_data.assign_type=="employee_id")
			{
				emp_userid_details(json_data.assign_id);
			}
		})
	}
	else { alert_lobibox("info","Fill all the fields"); }
}

function edit_objective(objective_id,team_id,user_id,objective){

	objectiveAdd($('#org_unit_button_id').attr('data-filter-id'))
//	$('#Add_objective_Modal').modal("show")
	$('#org_set_objective_name').val(objective)
	$('#org_set_objective_name').attr("data-orgobjectiveid",objective_id)
	$.ajax({
		url:'/pm_objective_data_retrieval/',
		type:'POST',
		data:{'objective_id':objective_id,csrfmiddlewaretoken:getCookie('csrftoken')},

	}).done(function(json_data){
		data=json_data.objective_data
		obj_setting_button_display('update')
		$('#obj_plan_type').val(data[0].objective_plan_type).trigger("change"); 
		$('#obj_set_yearlist').val(data[0].planned_year).trigger("change"); 
		$('#obj_set_monthlist').val(data[0].planned_month).trigger("change"); 
		$('#obj_set_quarterlist').val(data[0].planned_quarter).trigger("change"); 	
		$("#org_set_objective_name").val(data[0].objective_description)
		$("#bsc_perspective").val(data[0].bsc_perspective_id).trigger("change");
		$("#obj_set_start_date").val(data[0].start_date)
		$("#obj_set_end_date").val(data[0].end_date)
		$("#obj_set_assign_type").val(data[0].assigned_type).trigger("change");
		$("#obj_set_department").val(data[0].department_id).trigger("change");
		$("#obj_set_employee").val(data[0].employee_id).trigger("change");

	})
//	$('#update_objective_name').attr("data-teamid",team_id)
//	$('#update_objective_name').attr("data-userid",user_id)
}
//validation

$('#add_objective_form').submit(function(e) {
	e.preventDefault();
}).validate({
	rules: {
		obj_plan_type: { valueNotEquals:true, },
		obj_set_yearlist: { valueNotEquals:true, },
		org_set_objective_name: { required: true, }, 
		obj_set_start_date : { required: true },
		obj_set_end_date : { required: true },
		org_unit: { valueNotEquals:true, },
		obj_set_assign_type: { valueNotEquals:true, },
	},
	//For custom messages
	messages: {
		obj_plan_type: { valueNotEquals: "The field is required", },
		obj_set_yearlist: { valueNotEquals: "The field is required", },
		org_set_objective_name: { required: "The field is required", },
		obj_set_start_date: { required: "The field is required", },
		obj_set_end_date: { required: "The field is required", },
		org_unit: { valueNotEquals: "The field is required", },
		obj_set_assign_type: { valueNotEquals: "The field is required", },

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

function objective_form_validation()
{
	return $('#add_objective_form').valid();
}

$('#add_ork_form').submit(function(e) {
	e.preventDefault();
}).validate({
	rules: {
		org_set_key_result: { required:true, },
		kr_set_assign_type: { valueNotEquals:true, },
		kr_set_start_date: { required: true, }, 
		kr_set_end_date : { required: true },

	},
	//For custom messages
	messages: {
		org_set_key_result: { required: "The field is required", },
		kr_set_assign_type: { valueNotEquals: "The field is required", },
		kr_set_start_date: { required: "The field is required", },
		kr_set_end_date: { required: "The field is required", },
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
function okr_form_validation()
{
	return $('#add_ork_form').valid();
}

//validation for dropdown
$('#obj_set_monthlist').change(function(){
	month=$('#obj_set_monthlist').val();
	if(month=='') { $('#monthly_error_message').html('The field is required') }
	else {  $('#monthly_error_message').html('') }

});
$('#obj_set_quarterlist').change(function(){
	quarter=$('#obj_set_quarterlist').val();
	if(quarter=='') { $('#quarter_error_message').html('The field is required') }
	else {  $('#quarter_error_message').html('') }

});
$('#obj_set_yearlist').change(function(){
	year=$('#obj_set_yearlist').val();
	if(year=='') { $('#yearly_error_message').html('The field is required') }
	else {  $('#yearly_error_message').html('') }
});
$('#obj_set_employee').change(function(){
	var temp=$('#obj_set_employee').val()
	if(temp==null || temp=='')
	{
		$('#employee_error_message').html('The field is required')
	}
	else { $('#employee_error_message').html('') }
});
$('#obj_set_department').change(function(){
	temp=$('#obj_set_department').val();
	if(temp==null || temp=='')
	{
		$('#dprt_error_message').html('The field is required')
	}
	else { $('#dprt_error_message').html('') }
});

//key result validation

$('#kr_set_employee').change(function(){
	var temp=$('#kr_set_employee').val()
	if(temp==null || temp=='')
	{
		$('#employee_message').html('The field is required')
	}
	else { $('#employee_message').html('') }
});
$('#kr_set_department').change(function(){
	temp=$('#kr_set_department').val();
	if(temp==null || temp=='')
	{
		$('#dvision_error_message').html('The field is required')
	}
	else { $('#dvision_error_message').html('') }
});