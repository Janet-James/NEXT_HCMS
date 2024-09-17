var user_id=''
var flag_value=0
$(document).ready(function(){
/*	$("#loading").css("display","block");
 * 
*/	
	team_treeview();
	team_view_page_render(team_id,'team');
	$( document ).on( "click",'ul.userprofile li',function(e) 
			   { 
		flag_value=1
		user_id= $(this).attr("data-index")
		emp_userid_details(user_id)
		team_view_page_render(team_id,'user');
		common_chart(user_id,flag_value)
		
	});

 //teamwise filter search
 $('ul.teamwise_filter li').click(function(e){ 
	team_id= $(this).attr("data-index")
	var csrftoken = getCookie('csrftoken');
	$('#filter_employee_name').empty()
	$('#vcarousel').remove(); 
	$.ajax({
			url:'/teamwise_filter/',
			type:'POST',
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
							StrContent_profile+='<img src="'+image_path+image_path+data.team_emp_details[i].employee_image+'no_data.png" class="img-circle">'
							
							}
						else
							{
							StrContent_profile+='<img src="'+image_path+'no_data.png" class="img-circle">'
						}
						
						StrContent_profile+='<span data-toggle="tooltip" data-placement="bottom" title='+data.team_emp_details[i].employee_name+' >'+data.team_emp_details[i].employee_name+'</span></div></a></li>'
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
			}if(data.status == 'NTE-002'){
				alert_lobibox('error',data.message)	
			}if(data.status == 'NTE-003'){
				alert_lobibox('error',data.message)	
			}

		})
});
	$(document).on('show.bs.modal','#Add_objective_Modal', function (event) {
		var validator = $("#add_objective_form").validate()
		validator.resetForm();
	});
	

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
//				 if(data.user_group == 'PMNGR' && data.team_name == ''){
					 StrContent_Team+='<a onclick="tree_click(\''+data.tree_details[i].id+'\',\''+data.tree_details[i].name+'\');">'+
					 '<img src="'+image_tree_path+'" data-imagename="'+image_name+'" style="height: '+data.tree_details[i].height+'px; width: '+data.tree_details[i].width+'px;">'+
					 '<span class="teamname" data-index="'+data.tree_details[i].id+'">'+data.tree_details[i].name+'</span></a></li>'
					 MobileContent_Team+='<li><a onclick="tree_click(\''+data.tree_details[i].id+'\',\''+data.tree_details[i].name+'\');">'+data.tree_details[i].name+'</a> </li>'
					 
//				 }else if(data.tree_details[i].name == data.team_name && (data.user_group == 'USSER' || data.user_group == 'MNGER' || data.user_group == 'TMLDS')){
//					 if(data.user_group == 'USSER'){
//						 StrContent_Team+='<a href="">'+
//						 '<img src="'+image_path+'" data-imagename="'+image_name+'" style="height: '+data.tree_details[i].height+'px; width: '+data.tree_details[i].width+'px;">'+
//						'<span class="teamname" data-index="'+data.tree_details[i].id+'">'+data.tree_details[i].name+'</span></a></li>'
//						 MobileContent_Team+='<li><a>'+data.tree_details[i].name+'</a> </li>'
//
//					 }else if(data.user_group == 'MNGER' || data.user_group == 'TMLDS'){
//						 StrContent_Team+='<a onclick="tree_click(\''+data.tree_details[i].id+'\',\''+data.tree_details[i].name+'\');">'+
//						 '<img src="'+image_path+'" data-imagename="'+image_name+'" style="height: '+data.tree_details[i].height+'px; width: '+data.tree_details[i].width+'px;">'+
//						 '<span class="teamname" data-index="'+data.tree_details[i].id+'">'+data.tree_details[i].name+'</span></a></li>'
//						 MobileContent_Team+='<li><a onclick="tree_click(\''+data.tree_details[i].id+'\',\''+data.tree_details[i].name+'\');">'+data.tree_details[i].name+'</a> </li>'
//					 }
//					
//				 }else{
//					 	 StrContent_Team+='<a href="/Not_authorized/">'+
//						'<img src="'+image_path+'" data-imagename="'+image_name+'" style="height: '+data.tree_details[i].height+'px; width: '+data.tree_details[i].width+'px;">'+
//						'<span class="teamname" data-index="'+data.tree_details[i].id+'">'+data.tree_details[i].name+'</span></a></li>'
//						 MobileContent_Team+='<li><a href="/Not_authorized/">'+data.tree_details[i].name+'</a> </li>'
//				 }
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
//add objective 
$('#add_objective').click(function(){
	$('#Add_objective_Modal').modal('show')
	
})

function tree_click(team_id,team_name){
	team_id=team_id
	var csrftoken = getCookie('csrftoken');
	$('#filter_employee_name').empty()
	$('#vcarousel').remove(); 
	$.ajax({
			url:'/teamwise_filter/',
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
			designation='Department'
			team_name=team_name
			 $('.user_details').append('<li><img src="'+image_name+'" class="staff-photo"></li>'+
			'<li><p class="main-name">'+team_name+'<span class="sub-name">   '+designation+'</span></p>'+
			'<p class="designation">'+team_name+'</p>'+
			'<p class="update-date">( Last updated on '+'06/11/2018'+')</p>'
			)
				 
			}if(data.status == 'NTE-002'){
				alert_lobibox('error',data.message)	
			}if(data.status == 'NTE-003'){
				alert_lobibox('error',data.message)	
			}
			$('.nav_trigger').removeClass('active')
			return false;
		})
		
		 
}
//add objective submit functionality

$('#add_objective_submit').click(function(){
	var dynamic_addobjective_values=''
	objective_name=$('#Add_objective_Modal').find('.objective_name').val()
	var validation_result=$('#add_objective_form').valid()
	var csrftoken = getCookie('csrftoken');
	if(validation_result){
			$.ajax({
				url:'/create_objective/',
				type:'POST',
				data:{'objective_name':objective_name,'team_id':team_id,'user_id':user_id,csrfmiddlewaretoken:csrftoken
					},
				error:(function(error){
						alert_lobibox('error',error.statusText);
					})
			}).done(function(json_data){
				var data=JSON.parse(json_data);
				if(data.status == 'NTE-001'){
					team_view_page_render(data.team_id,'team');
					$('#Add_objective_Modal').modal('toggle')
					alert_lobibox('success',data.message)
				}if(data.status == 'NTE-002'){
					$('#Add_objective_Modal').modal('toggle')
					alert_lobibox('error',data.message)
					$('#add_objective_form')[0].reset()
				}if(data.status == 'NTE-003'){
					alert_lobibox('error',data.message)
				}

			})
	}
	return false
})


function edit_objective(objective_id,team_id,user_id,objective){
	$('#Update_objective_Modal').modal("show")
	$('#update_objective_name').val(objective)
	$('#update_objective_name').attr("data-objectiveid",objective_id)
	$('#update_objective_name').attr("data-teamid",team_id)
	$('#update_objective_name').attr("data-userid",user_id)
}

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

//Delete Functionality Model Box for Objective
function delete_objective(objective_id,team_id,objective_text){
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
			  confirm_delete_objective(objective_id,team_id)
		  }
		});
}

function confirm_delete_objective(objective_id,team_id){
	var csrftoken = getCookie('csrftoken');
	$.ajax({
			url:'/delete_objective/',
			type:'POST',
			data:{'objective_id':objective_id,'team_id':team_id,
				csrfmiddlewaretoken:csrftoken},
				error:(function(error){
					alert_lobibox('error',error.statusText);
				})
		}).done(function(json_data){
			var data=JSON.parse(json_data);
			if(data.status == 'NTE-001'){
				team_view_page_render(data.team_id,'team')
				flag_value=1
				common_chart(user_id,flag_value)
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
			url:'/member_list/',
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

function add_keyresults(objective_id,team_id){
	var csrftoken = getCookie('csrftoken');
	$.ajax({
		url:'/create_keyresults/',
		type:'POST',
		data:{'objective_id':objective_id,'team_id':team_id,'user_id':user_id,
			csrfmiddlewaretoken:csrftoken},
			error:(function(error){
				alert_lobibox('error',error.statusText);
			})
	}).done(function(json_data){
		var data=JSON.parse(json_data);
		$(".kr_date").DateTimePicker({
      dateFormat: "dd-MMM-yyyy"
  });
		if(data.status == 'NTE-001'){
			flag_value=1
			team_view_page_render(data.team_id,'team');
			common_chart(user_id,flag_value)
			alert_lobibox('success',data.message)
		}if(data.status == 'NTE-002'){
			alert_lobibox('error',data.message)
		}if(data.status == 'NTE-003'){
			alert_lobibox('error',data.message)
		}
	})
}

//edit key result name

function edit_keyresult_name(edit_keyresult_id,keyresult_name) {
	$("#keyresult_span"+edit_keyresult_id).hide();
	$("#keyresult_edit"+edit_keyresult_id).show();
	$("#keyresult_edit"+edit_keyresult_id).val(keyresult_name)
	return false
	if(keyresult_name==''){
		$("#keyresult_span"+edit_keyresult_id).show();
		$("#keyresult_edit"+edit_keyresult_id).hide();
	}
	
}


//$(document).on('click', '.objective_startdate', function () {
//	$("#dtBox").DateTimePicker({
//          dateFormat: "dd-MMM-yyyy"
//      });
//	});

//common function for view the objective and key results
function team_view_page_render(team_id,filter_type){
	var csrftoken = getCookie('csrftoken');
	$.ajax({
		url:'/Ntree_teamview_page/',
		type:'POST',
		data:{'team_id':team_id,'user_id':user_id,'filter_type':filter_type,
			csrfmiddlewaretoken:csrftoken},
			error:(function(error){
				alert_lobibox('error',error.statusText);
			})
	}).done(function(json_data){
		var data=JSON.parse(json_data);
		var strContent = '';
		var selectData1 =	assign_member();
		$("#dynamic_addobjective_div").empty();
		if(data.status == 'NTE-001'){
//			if(data.user_group == 'PMNGR' || data.user_group == 'MNGER' || data.user_group == 'TMLDS' || data.user_group == 'HRMGR' ){
			for(i=0;i<data.team_details.length;i++){
				if(data.team_details[i].objective.length>10){
					var objective_text=data.team_details[i].objective.substring(0,8)+'...'
				}else{
					var objective_text=data.team_details[i].objective
				}
				strContent+='<div class="panel panel-default objective_heading" data-index='+data.team_details[i].objective_id+'><div class="panel-heading">'+
				'<h4 class="panel-title"> <a class="accordion-toggle accordion-toggle-styled" data-toggle="collapse" data-parent="#dynamic_addobjective_div" href="#'+data.team_details[i].objective_id+'">'+data.team_details[i].objective+'</a> </h4>'+
				'<div class="objective-options">'+
				'<span class="total-KR">KR<span>'+data.team_details[i].keyresult_count+'</span></span>'+
				'<label class="padding-right-30"><span class="actual-value">'+data.team_details[i].completion+'%</span> / <span class="planned-value"> '+data.team_details[i].expectation+'%</span></label>'+
				'<div class="btn-group btn-hide-arrow">'+
				'<button class="dropdown-toggle transparent-btn" type="button" data-toggle="dropdown" aria-expanded="false"> <i class="fa fa-ellipsis-v" aria-hidden="true"></i></button>'+
				'<ul class="dropdown-menu objective-dropdown" role="menu">'	+
				'<li onclick="edit_objective(\''+data.team_details[i].objective_id+'\',\''+data.team_details[i].team_id+'\',\'' + user_id + '\',\'' + data.team_details[i].objective + '\')"><a>Edit Objective</a></li>'+
				'<li onclick="delete_objective(\''+data.team_details[i].objective_id+'\',\''+data.team_details[i].team_id+'\',\''+objective_text+ '\')"><a>Delete Objective</a></li>'+
				'<li onclick=add_keyresults("'+data.team_details[i].objective_id+'","'+data.team_details[i].team_id+'")><a>Add KR</a></li>'+
				'</ul>'+
				'</div>'+
				'</div>'+
				'</div>';
				strContent+='<div id="'+data.team_details[i].objective_id+'" class="panel-collapse in keyresult_div" data-index="'+data.team_details[i].objective_id+'" data-team="'+data.team_details[i].team_id+'">'
					for(var j=0; j<data.team_details[i].keyresult_id.length; j++){
						var count=j+1
						if(data.team_details[i].key_result[j]){
							keyresult_name= data.team_details[i].key_result[j]
						}else{
							keyresult_name='Enter KeyResult'
						}
						if(data.team_details[i].keyresult_id[j]!='0'){
						var class_name=''
						var image_Content=''
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
						strContent+='<div data-index="'+data.team_details[i].keyresult_id[j]+'" class="keyresult_sub_div '+class_name+'">'+
						'<div class="row OKR-Title">'+
						'<div class="col-sm-12">'+
						'<label>'+image_Content+' <label>KR:'+count+'</label><span class="change_keyresult" data-column_name="key_result" id="keyresult_span'+data.team_details[i].keyresult_id[j]+'" onclick="edit_keyresult_name(\''+data.team_details[i].keyresult_id[j]+'\',\''+data.team_details[i].key_result[j]+'\')"> '+keyresult_name+'</span>'+
						'<input placeholder="Enter Keyresult" class="form-control edit_kr change_keyresult_details" data-column_name="key_result" type="text" id="keyresult_edit'+data.team_details[i].keyresult_id[j]+'" value="'+data.team_details[i].key_result[j]+'" style="display:none" data-index="'+data.team_details[i].keyresult_id[j]+'" maxlength="50"/>' +
						'</label>'+
						'</div></div>'+
						'<div class="row OKR-fields">'+
						'<div class="col-sm-12">'+
						'<form class="form-horizontal form-bordered" method="post">'+
						'<div class="form-body">'+
						'<div class="row">'+
						'<div class="col-sm-6 col-lg-4">'+
						'<div class="form-group">'+
						'<input type="text" value="" class="objective_progress" data-column_name="progress"data-value="'+data.team_details[i].progress[j]+'"/>'+
						'</div></div>'+
						'<div class="col-sm-6 col-lg-3">'+
						'<div class="form-group">'+
						'<label for="single" class="control-label black_font">Assign the member</label> <select data-placeholder="Select a member" id="single" class="form-control select2 objective_memeber_list change_keyresult" data-column_name="assigned_id" data-value="'+data.team_details[i].assigned_id[j]+'">'+
						'<option value=""  disabled="disabled">-Select-</option><option value="'+data.team_details[i].assigned_id[j]+'">'+data.team_details[i].assigned_name[j]+'</option>'+

						'</select>'+
						'</div></div>'+
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
						'<div class="col-sm-6 col-lg-1 comments-icon">'+
						'<span class="remove_keyresult" title="Delete">'+
						'<i class="fa fa-trash objective-delete"></i><span>'+
						'</div></div></div>'+
						'</form></div></div></div>';
						}
						
				}
				strContent+='</div></div>'
			}
//		}
//		else if(data.user_group == 'USSER'){
//			for(i=0;i<data.team_details.length;i++){
//				if(data.team_details[i].objective.length>10){
//					var objective_text=data.team_details[i].objective.substring(0,8)+'...'
//				}else{
//					var objective_text=data.team_details[i].objective
//				}
//				strContent+='<div class="panel panel-default objective_heading" data-index='+data.team_details[i].objective_id+'><div class="panel-heading">'+
//				'<h4 class="panel-title"> <a class="accordion-toggle accordion-toggle-styled" data-toggle="collapse" data-parent="#dynamic_addobjective_div" href="#'+data.team_details[i].objective_id+'">'+data.team_details[i].objective+'</a> </h4>'+
//				'<div class="objective-options">'+
//				'<span class="total-KR">KR<span>'+data.team_details[i].keyresult_count+'</span></span>'+
//				'<label class="padding-right-30"><span class="actual-value">'+data.team_details[i].completion+'%</span> / <span class="planned-value"> '+data.team_details[i].expectation+'%</span></label>'+
//				'</div>'+
//				'</div>';
//				strContent+='<div id="'+data.team_details[i].objective_id+'" class="panel-collapse in keyresult_div" data-index="'+data.team_details[i].objective_id+'" data-team="'+data.team_details[i].team_id+'">'
//					for(var j=0; j<data.team_details[i].keyresult_id.length; j++){
//						var count=j+1
//						if(data.team_details[i].key_result[j]){
//							keyresult_name= data.team_details[i].key_result[j]
//						}else{
//							keyresult_name='Enter KeyResult'
//						}
//						if(data.team_details[i].keyresult_id[j]!='0'){
//						var class_name=''
//						var image_Content=''
//						//Calculation For Key result On Track,Off track,Completed,At Risk
//					    var today = new Date();
//					    var day = today.getDate();
//					    var month = today.getMonth()+1;
//					    var year = today.getFullYear();
//					    var current_date=year + '-' +((''+month).length<2 ? '0' : '') + month + '-' +((''+day).length<2 ? '0' : '') + day;
//					    var current_date= new Date(current_date)
//					    var due_date =  new Date(data.team_details[i].due_date_format[j])
//					    var timeDiff = Math.abs(current_date.getTime() - due_date.getTime());
//					    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
//						if(data.team_details[i].progress[j] == 100){
//							class_name='kr_completed'
//						}else if(current_date>=due_date){
//							if(diffDays >= 3 & data.team_details[i].progress[j] < 100){
//								class_name='kr_risk'
//							}else if((diffDays >= 1  & diffDays < 3) && data.team_details[i].progress[j] < 100){
//								class_name='kr_exceeded'
//							}else if(diffDays==0 && data.team_details[i].progress[j] < 100){
//								class_name='kr_ontrack'
//							}
//						}else if(current_date<=due_date & data.team_details[i].progress[j] < 100){
//							class_name='kr_ontrack'
//						}
//						strContent+='<div data-index="'+data.team_details[i].keyresult_id[j]+'" class="keyresult_sub_div '+class_name+'">'+
//						'<div class="row OKR-Title">'+
//						'<div class="col-sm-12">'+
//						'<label>'+image_Content+' <label>KR:'+count+'</label><span data-column_name="key_result" id="keyresult_span'+data.team_details[i].keyresult_id[j]+'"> '+keyresult_name+'</span>'+
//						'</label>'+
//						'</div></div>'+
//						'<div class="row OKR-fields">'+
//						'<div class="col-sm-12">'+
//						'<form class="form-horizontal form-bordered" method="post">'+
//						'<div class="form-body">'+
//						'<div class="row">'+
//						'<div class="col-sm-6 col-lg-4">'+
//						'<div class="form-group">'+
//						'<input type="text" value="" class="objective_progress" data-column_name="progress" data-value="'+data.team_details[i].progress[j]+'" data-disable="true"/>'+
//						'</div></div>'+
//						'<div class="col-sm-6 col-lg-3">'+
//						'<div class="form-group">'+
//						'<label for="single" class="control-label black_font">Assign the member</label> <select data-placeholder="Select a member" id="single" class="form-control select2 objective_memeber_list" data-column_name="assigned_id" data-value="'+data.team_details[i].assigned_id[j]+'" disabled>'+
//						'<option value=""  disabled="disabled">-Select-</option>'+selectData1+
//						'</select>'+
//						'</div></div>'+
//						'<div class="col-sm-6 col-lg-2">'+
//						'<div class="form-group">'+
//						'<label class="control-label">Start date</label>'+
//						'<div class="input-icon">'+
//						'<i class="fa fa-calendar"></i>'+
//						'<input class="form-control date-picker objective_startdate" size="16" type="text" placeholder="Start date"  data-column_name="start_date" data-value="'+data.team_details[i].start_date[j]+'" disabled>'+
//						'</div></div></div>'+		
//						'<div class="col-sm-6 col-lg-2">'+
//						'<div class="form-group">'+
//						'<label class="control-label">Due date</label>'+
//						'<div class="input-icon">'+
//						'<i class="fa fa-calendar"></i>'+
//						'<input class="form-control date-picker objective_duedate" size="16" type="text" placeholder="Due date" data data-column_name="due_date" data-date-start-date="'+data.team_details[i].start_date[j]+'" data-value="'+data.team_details[i].due_date[j]+'" disabled>'+
//						'</div></div></div>'+
//						'</div></div>'+
//						'</form></div></div></div>';
//						}
//						
//				}
//				strContent+='</div></div>'
//			}
//		}
		}
		$('#dynamic_addobjective_div').append(strContent);
		$(".kr_date").DateTimePicker({
		      dateFormat: "dd-MMM-yyyy"
		  });

		var script = document.createElement("script");
	    script.type = "text/javascript";
	    script.src = "/static/dev/NTree/ui/plugins/select2/js/components-select2.min.js"; 
	    document.getElementsByTagName("head")[0].appendChild(script);
		$(".objective_progress").ionRangeSlider({type:"single",grid:!0,min:0,max:100,from:0,to:0,
			onFinish: function (data) {
		        keyresult_change(data.input)
		    }});
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
$(document).on("blur",".edit_kr", function () {
	keyresult_change($(this));
});
$(document).on("keypress",".edit_kr", function (event) {
    if(event.keyCode=='13'){
    	this.blur();
    	return false;
}
});

//Delete Functionality Model Box for Key result 
function delete_keyresult_function(keyresult_id,objective_id,team_id,keyresult_text){
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
			  confirm_delete_keyresult(keyresult_id,objective_id,team_id)
		  }
		});
}

function confirm_delete_keyresult(keyresult_id,objective_id,team_id){
	var csrftoken = getCookie('csrftoken');
	$.ajax({
			url:'/delete_keyresults/',
			type:'POST',
			data:{'objective_id':objective_id,'team_id':team_id,'keyresult_id':keyresult_id,
				csrfmiddlewaretoken:csrftoken},
				error:(function(error){
					alert_lobibox('error',error.statusText);
				})
		}).done(function(json_data){
			var data=JSON.parse(json_data);
			if(data.status == 'NTE-001'){
				team_view_page_render(data.team_id,'team')
				flag_value=1
				common_chart(user_id,flag_value)
				alert_lobibox('success',data.message)
			}if(data.status == 'NTE-002'){
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
	delete_keyresult_function(keyresult_id,objective_id,team_id,keyresult_text)
})

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
	if(validate_result & validate_required){
		$.ajax({
			url:'/update_keyresults/',
			type:'POST',
			data:{'objective_id':objective_id,'team_id':team_id,'keyresult_id':keyresult_id,'column_name':column_name,'column_value':column_value,
				csrfmiddlewaretoken:csrftoken},
				error:(function(error){
					alert_lobibox('error',error.statusText);
				})
		}).done(function(json_data){
			var data=JSON.parse(json_data);
			if(data.status == 'NTE-001'){
				if(column_name=='key_result' || column_name=='progress' || column_name=='start_date'){
					team_view_page_render(data.team_id,'team')
					flag_value=1
					common_chart(user_id,flag_value)
				}
				if(column_name=='due_date'){
					flag_value=1
					team_view_page_render(data.team_id,'team')
					common_chart(user_id,flag_value)
				}
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

function hierarchical_view(){
	var csrftoken = getCookie('csrftoken');
	$.ajax({
		url:'/Ntree_teamview_page/',
		type:'POST',
		data:{'team_id':team_id,'user_id':user_id,
			csrfmiddlewaretoken:csrftoken},
			error:(function(error){
				alert_lobibox('success',data.message);
			})
	}).done(function(json_data){
		var data=JSON.parse(json_data);
		$('.hierarchicalview_emp').html("")
		var Str_Content=''
		if(data.status == 'NTE-001'){
			if(data.employee_info[0].employee_image)
				{
				Str_Content+='<img src="'+image_path+data.employee_info[0].employee_image+'" class="staff-photo">'}
			else
				{
				Str_Content+='<img src="'+image_path+'no_data.png" class="staff-photo">'
				}
			
			if(data.employee_info[0].designation){
				var designation=data.employee_info[0].designation
			}else{
				var designation=''
			}
			if(data.employee_info[0].team_name){
				Str_Content+='<li><p class="main-name">'+data.employee_info[0].employee_name+
				'<span class="sub-name">    ' +designation+'</span></p>'+
				'<p class="designation">'+ data.employee_info[0].team_name+'</p>'
			}else{
				Str_Content+='<li><p class="main-name">'+data.employee_info[0].employee_name+
				'<span class="sub-name"> '+designation+'</span></p>'+
				'<p class="designation"></p>'
			}
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
	team_view_page_render(team_id,'user');
	common_chart(user_id,flag_value)
	
})

function add_objective_cancel(){
	$('#Add_objective_Modal').find('.objective_name').val('')
}

$(document).on("click","#mobilemenu li", function(){
	$('.nav_trigger').removeClass('active')
});


