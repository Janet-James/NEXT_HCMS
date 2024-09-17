var count=0,teamname_list=[]
var team_tree_list=[]
var update_id_list=[]

$(document).ready(function(){
/*	$("#loading").css("display","block");
*/	default_treeview_teamupdate();
	//Update the team model box values
	 $(document).on('show.bs.modal','#Update-Team', function (event) {
		 var validator = $("#addupdate_form").validate()
		 validator.resetForm();
		 updateteam_modal_triggered_element = $(event.relatedTarget);
		 prev_team_id=updateteam_modal_triggered_element.parents("li").find( ".teamname" ).attr("data-index")
		 prev_imagename=updateteam_modal_triggered_element.parents("li").find( ".teamimage" ).attr("data-imagename")
		 $('#info_updateteamname').val(prev_team_id).trigger('change')
		 $("#Update-Team input[name=updateteam_cloudimage][value='"+prev_imagename+"']").prop('checked', true);
	 })
	 $(document).on('show.bs.modal','#Create-Team', function (event) {
			var validator = $("#createteam_form").validate()
			validator.resetForm();
		});
	 $(document).on('show.bs.modal','#Add-Team', function (event) {
			var validator = $("#addteam_form").validate()
			validator.resetForm();
	  });
	
})



//Default Tree view functionality
function default_treeview_teamupdate(){
	org_unit_id=$('#ntree_org_unit_id').val()
	$.ajax({
		url:'/pm_department_treeview/',
		type:'GET',
		data: {'org_unit_id':org_unit_id},
		async:false,
		error:(function(error){
				alert_lobibox('error',error.statusText);
			})
	}).done(function(json_data){
	var data=JSON.parse(json_data);
	var Default_TreeContent=''
	var Default_MobileContent=''
	if(data.status == 'NTE-001'){
		for(i=0;i<data.tree_details.length;i++){
			if(data.tree_details[i].name=="TRANSFORM" & data.tree_details[i].position_left =='' & data.tree_details[i].position_top =='' & data.tree_details[i].visual_type=='' & data.tree_details[i].height==''& data.tree_details[i].width==''  ){
				Default_TreeContent+=
					 '<li class="draggable-cloud" data-index='+data.tree_details[i].order_id+'>'+
					 '<img class="teamimage" src="/static/dev/NTree/ui/images/cloud-pink.png" data-imagename="cloud-pink.png" >'+
					 '<span class="teamname" data-index="'+data.tree_details[i].id+'">'
					 if(data.user_group == 'PMNGR' && data.team_name == ''){
						 Default_TreeContent+= '<a href="/pm_objective_view/'+data.tree_details[i].id+'" >'+data.tree_details[i].name+'</a>'+
						'<label class="animated fadeIn">'+
						 '<i class="fa fa-edit" data-dismiss="modal" aria-hidden="true" href="#Update-Team" data-toggle="modal"></i>'+
						 '<span class="remove_team"><i class="fa fa-trash"></i></label></span>'
						 Default_MobileContent+='<li><a class="sa_arrow" href="/pm_objective_view/'+data.tree_details[i].id+'" >'+data.tree_details[i].name+'</a> </li>'	
					 }else if(data.tree_details[i].name == data.team_name && (data.user_group == 'USSER' || data.user_group == 'MNGER' || data.user_group == 'TMLDS')){
						 Default_TreeContent+= '<a href="/pm_objective_view/'+data.tree_details[i].id+'" >'+data.tree_details[i].name+'</a>'
						 Default_MobileContent+='<li><a class="sa_arrow" href="/pm_objective_view/'+data.tree_details[i].id+'" >'+data.tree_details[i].name+'</a> </li>'	
					 }else{
						Default_TreeContent+= '<a href="/Not_authorized/" >'+data.tree_details[i].name+'</a>'
						Default_MobileContent+='<li><a class="sa_arrow" href="/Not_authorized/" >'+data.tree_details[i].name+'</a> </li>'	
					 }
					Default_TreeContent+= '</span></li>'
						
			}else if(data.tree_details[i].name=="GML" & data.tree_details[i].position_left =='' & data.tree_details[i].position_top =='' & data.tree_details[i].visual_type=='' & data.tree_details[i].height==''& data.tree_details[i].width=='' ){
				Default_TreeContent+='<li class="draggable-cloud" data-index='+data.tree_details[i].order_id+'>'+
					 '<img class="teamimage" src="/static/dev/NTree/ui/images/cloud-green.png" data-imagename="cloud-green.png" >'+
					 '<span class="teamname" data-index="'+data.tree_details[i].id+'">'
					 if(data.user_group == 'PMNGR' && data.team_name == ''){
						 Default_TreeContent+= '<a href="/pm_objective_view/'+data.tree_details[i].id+'" >'+data.tree_details[i].name+'</a>'+
						'<label class="animated fadeIn">'+
						 '<i class="fa fa-edit" data-dismiss="modal" aria-hidden="true" href="#Update-Team" data-toggle="modal"></i>'+
						 '<span class="remove_team"><i class="fa fa-trash"></i></label></span>'
						 Default_MobileContent+='<li><a class="sa_arrow" href="/pm_objective_view/'+data.tree_details[i].id+'" >'+data.tree_details[i].name+'</a> </li>'	

					 }else if(data.tree_details[i].name == data.team_name && (data.user_group == 'USSER' || data.user_group == 'MNGER' || data.user_group == 'TMLDS')){
						 Default_TreeContent+= '<a href="/pm_objective_view/'+data.tree_details[i].id+'" >'+data.tree_details[i].name+'</a>'
						 Default_MobileContent+='<li><a class="sa_arrow" href="/pm_objective_view/'+data.tree_details[i].id+'" >'+data.tree_details[i].name+'</a> </li>'	

					 }else{
						Default_TreeContent+= '<a href="/Not_authorized/" >'+data.tree_details[i].name+'</a>'
						Default_MobileContent+='<li><a class="sa_arrow" href="/Not_authorized/" >'+data.tree_details[i].name+'</a> </li>'	
					 }
					Default_TreeContent+= '</span></li>'
		
			}else if(data.tree_details[i].name=="GEO" & data.tree_details[i].position_left =='' & data.tree_details[i].position_top =='' & data.tree_details[i].visual_type=='' & data.tree_details[i].height==''& data.tree_details[i].width=='' ){
				Default_TreeContent+=
					 '<li class="draggable-cloud" data-index='+data.tree_details[i].order_id+'>'+
					 '<img class="teamimage" src="/static/dev/NTree/ui/images/cloud-purple.png" data-imagename="cloud-green.png">'+
					 '<span class="teamname" data-index="'+data.tree_details[i].id+'">'
					 if(data.user_group == 'PMNGR' && data.team_name == ''){
						 Default_TreeContent+= '<a href="/pm_objective_view/'+data.tree_details[i].id+'" >'+data.tree_details[i].name+'</a>'+
						'<label class="animated fadeIn">'+
						 '<i class="fa fa-edit" data-dismiss="modal" aria-hidden="true" href="#Update-Team" data-toggle="modal"></i>'+
						 '<span class="remove_team"><i class="fa fa-trash"></i></label></span>'
						 Default_MobileContent+='<li><a class="sa_arrow" href="/pm_objective_view/'+data.tree_details[i].id+'" >'+data.tree_details[i].name+'</a> </li>'	

					 }else if(data.tree_details[i].name == data.team_name && (data.user_group == 'USSER' || data.user_group == 'MNGER' || data.user_group == 'TMLDS')){
						 Default_TreeContent+= '<a href="/pm_objective_view/'+data.tree_details[i].id+'" >'+data.tree_details[i].name+'</a>'
						 Default_MobileContent+='<li><a class="sa_arrow" href="/pm_objective_view/'+data.tree_details[i].id+'" >'+data.tree_details[i].name+'</a> </li>'	

					 }else{
						Default_TreeContent+= '<a href="/Not_authorized/" >'+data.tree_details[i].name+'</a>'
						Default_MobileContent+='<li><a class="sa_arrow" href="/Not_authorized/" >'+data.tree_details[i].name+'</a> </li>'	

					 }
					Default_TreeContent+= '</span></li>'
					 
			}else if(data.tree_details[i].name=="SecureON" & data.tree_details[i].position_left =='' & data.tree_details[i].position_top =='' & data.tree_details[i].visual_type=='' & data.tree_details[i].height==''& data.tree_details[i].width==''){
				Default_TreeContent+=
					 '<li class="draggable-cloud" data-index='+data.tree_details[i].order_id+'>'+
					 '<img class="teamimage" src="/static/dev/NTree/ui/images/cloud-yellow.png" data-imagename="cloud-yellow.png">'+
					 '<span class="teamname" data-index="'+data.tree_details[i].id+'">'
					 if(data.user_group == 'PMNGR' && data.team_name == ''){
						 Default_TreeContent+= '<a href="/pm_objective_view/'+data.tree_details[i].id+'" >'+data.tree_details[i].name+'</a>'+
						'<label class="animated fadeIn">'+
						 '<i class="fa fa-edit" data-dismiss="modal" aria-hidden="true" href="#Update-Team" data-toggle="modal"></i>'+
						 '<span class="remove_team"><i class="fa fa-trash"></i></label></span>'
						 Default_MobileContent+='<li><a class="sa_arrow" href="/pm_objective_view/'+data.tree_details[i].id+'" >'+data.tree_details[i].name+'</a> </li>'	

					 }else if(data.tree_details[i].name == data.team_name && (data.user_group == 'USSER' || data.user_group == 'MNGER' || data.user_group == 'TMLDS')){
						 Default_TreeContent+= '<a href="/pm_objective_view/'+data.tree_details[i].id+'" >'+data.tree_details[i].name+'</a>'
						 Default_MobileContent+='<li><a class="sa_arrow" href="/pm_objective_view/'+data.tree_details[i].id+'" >'+data.tree_details[i].name+'</a> </li>'	

					 }else{
						Default_TreeContent+= '<a href="/Not_authorized/" >'+data.tree_details[i].name+'</a>'
						Default_MobileContent+='<li><a class="sa_arrow" href="/Not_authorized/" >'+data.tree_details[i].name+'</a> </li>'	

					 }
					Default_TreeContent+= '</span></li>'
		
			}else if(data.tree_details[i].name=="HCM" & data.tree_details[i].position_left =='' & data.tree_details[i].position_top =='' & data.tree_details[i].visual_type=='' & data.tree_details[i].height==''& data.tree_details[i].width==''){
				Default_TreeContent+=
					 '<li class="draggable-cloud" data-index="5">'+
					 '<img class="teamimage" src="/static/dev/NTree/ui/images/cloud-red.png" data-imagename="cloud-red.png">'+
					 '<span class="teamname" data-index="'+data.tree_details[i].id+'">'
					 if(data.user_group == 'PMNGR' && data.team_name == ''){
						 Default_TreeContent+= '<a href="/pm_objective_view/'+data.tree_details[i].id+'" >'+data.tree_details[i].name+'</a>'+
						'<label class="animated fadeIn">'+
						 '<i class="fa fa-edit" data-dismiss="modal" aria-hidden="true" href="#Update-Team" data-toggle="modal"></i>'+
						 '<span class="remove_team"><i class="fa fa-trash"></i></label></span>'
						 Default_MobileContent+='<li><a class="sa_arrow" href="/pm_objective_view/'+data.tree_details[i].id+'" >'+data.tree_details[i].name+'</a> </li>'	

					 }else if(data.tree_details[i].name == data.team_name && (data.user_group == 'USSER' || data.user_group == 'MNGER' || data.user_group == 'TMLDS')){
						 Default_TreeContent+= '<a href="/pm_objective_view/'+data.tree_details[i].id+'" >'+data.tree_details[i].name+'</a>'
						 Default_MobileContent+='<li><a class="sa_arrow" href="/pm_objective_view/'+data.tree_details[i].id+'" >'+data.tree_details[i].name+'</a> </li>'	

					 }else{
						Default_TreeContent+= '<a href="/Not_authorized/" >'+data.tree_details[i].name+'</a>'
						Default_MobileContent+='<li><a class="sa_arrow" href="/Not_authorized/" >'+data.tree_details[i].name+'</a> </li>'	

					 }
					Default_TreeContent+= '</span></li>'
			}else if(data.tree_details[i].name=="UI/UX" & data.tree_details[i].position_left =='' & data.tree_details[i].position_top =='' & data.tree_details[i].visual_type=='' & data.tree_details[i].height==''& data.tree_details[i].width==''){
				Default_TreeContent+=
					 '<li class="draggable-cloud" data-index='+data.tree_details[i].order_id+'>'+
					 '<img class="teamimage" src="/static/dev/NTree/ui/images/cloud-rose.png" data-imagename="cloud-rose.png">'+
					 '<span class="teamname" data-index="'+data.tree_details[i].id+'">'
					 if(data.user_group == 'PMNGR' && data.team_name == ''){
						 Default_TreeContent+= '<a href="/pm_objective_view/'+data.tree_details[i].id+'" >'+data.tree_details[i].name+'</a>'+
						'<label class="animated fadeIn">'+
						 '<i class="fa fa-edit" data-dismiss="modal" aria-hidden="true" href="#Update-Team" data-toggle="modal"></i>'+
						 '<span class="remove_team"><i class="fa fa-trash"></i></label></span>'
						 Default_MobileContent+='<li><a class="sa_arrow" href="/pm_objective_view/'+data.tree_details[i].id+'" >'+data.tree_details[i].name+'</a> </li>'	

					 }else if(data.tree_details[i].name == data.team_name && (data.user_group == 'USSER' || data.user_group == 'MNGER' || data.user_group == 'TMLDS')){
						 Default_TreeContent+= '<a href="/pm_objective_view/'+data.tree_details[i].id+'" >'+data.tree_details[i].name+'</a>'
						 Default_MobileContent+='<li><a class="sa_arrow" href="/pm_objective_view/'+data.tree_details[i].id+'" >'+data.tree_details[i].name+'</a> </li>'	

					 }else{
						Default_TreeContent+= '<a href="/Not_authorized/" >'+data.tree_details[i].name+'</a>'
						Default_MobileContent+='<li><a class="sa_arrow" href="/Not_authorized/" >'+data.tree_details[i].name+'</a> </li>'	

					 }
					Default_TreeContent+= '</span></li>'
		
			}else if(data.tree_details[i].name=="EXOS" & data.tree_details[i].position_left =='' & data.tree_details[i].position_top =='' & data.tree_details[i].visual_type=='' & data.tree_details[i].height==''& data.tree_details[i].width==''){
				Default_TreeContent+=
					 '<li class="draggable-cloud" data-index='+data.tree_details[i].order_id+'>'+
					 '<img class="teamimage" src="/static/dev/NTree/ui/images/cloud-darkgreen.png" data-imagename="cloud-darkgreen.png">'+
					 '<span class="teamname" data-index="'+data.tree_details[i].id+'">'
					 if(data.user_group == 'PMNGR' && data.team_name == ''){
						 Default_TreeContent+= '<a href="/pm_objective_view/'+data.tree_details[i].id+'" >'+data.tree_details[i].name+'</a>'+
						'<label class="animated fadeIn">'+
						 '<i class="fa fa-edit" data-dismiss="modal" aria-hidden="true" href="#Update-Team" data-toggle="modal"></i>'+
						 '<span class="remove_team"><i class="fa fa-trash"></i></label></span>'
						 Default_MobileContent+='<li><a class="sa_arrow" href="/pm_objective_view/'+data.tree_details[i].id+'" >'+data.tree_details[i].name+'</a> </li>'	

					 }else if(data.tree_details[i].name == data.team_name && (data.user_group == 'USSER' || data.user_group == 'MNGER' || data.user_group == 'TMLDS')){
						 Default_TreeContent+= '<a href="/pm_objective_view/'+data.tree_details[i].id+'" >'+data.tree_details[i].name+'</a>'
						 Default_MobileContent+='<li><a class="sa_arrow" href="/pm_objective_view/'+data.tree_details[i].id+'" >'+data.tree_details[i].name+'</a> </li>'	

					 }else{
						Default_TreeContent+= '<a href="/Not_authorized/" >'+data.tree_details[i].name+'</a>'
						Default_MobileContent+='<li><a class="sa_arrow" href="/Not_authorized/" >'+data.tree_details[i].name+'</a> </li>'	

					 }
					Default_TreeContent+= '</span></li>'
		
			}else if(data.tree_details[i].name=="MOVEO" & data.tree_details[i].position_left =='' & data.tree_details[i].position_top =='' & data.tree_details[i].visual_type=='' & data.tree_details[i].height==''& data.tree_details[i].width=='' ){
				Default_TreeContent+=
					 '<li class="draggable-cloud" data-index='+data.tree_details[i].order_id+'>'+
					 '<img class="teamimage" src="/static/dev/NTree/ui/images/cloud-orange.png" data-imagename="cloud-orange.png">'+
					 '<span class="teamname" data-index="'+data.tree_details[i].id+'">'
					 if(data.user_group == 'PMNGR' && data.team_name == ''){
						 Default_TreeContent+= '<a href="/pm_objective_view/'+data.tree_details[i].id+'" >'+data.tree_details[i].name+'</a>'+
						'<label class="animated fadeIn">'+
						 '<i class="fa fa-edit" data-dismiss="modal" aria-hidden="true" href="#Update-Team" data-toggle="modal"></i>'+
						 '<span class="remove_team"><i class="fa fa-trash"></i></label></span>'
						 Default_MobileContent+='<li><a class="sa_arrow" href="/pm_objective_view/'+data.tree_details[i].id+'" >'+data.tree_details[i].name+'</a> </li>'	

					 }else if(data.tree_details[i].name == data.team_name && (data.user_group == 'USSER' || data.user_group == 'MNGER' || data.user_group == 'TMLDS')){
						 Default_TreeContent+= '<a href="/pm_objective_view/'+data.tree_details[i].id+'" >'+data.tree_details[i].name+'</a>'
						 Default_MobileContent+='<li><a class="sa_arrow" href="/pm_objective_view/'+data.tree_details[i].id+'" >'+data.tree_details[i].name+'</a> </li>'	

					 }else{
						Default_TreeContent+= '<a href="/Not_authorized/" >'+data.tree_details[i].name+'</a>'
						Default_MobileContent+='<li><a class="sa_arrow" href="/Not_authorized/" >'+data.tree_details[i].name+'</a> </li>'	

					 }
					Default_TreeContent+= '</span></li>'
		
			}else if(data.tree_details[i].name=="BigData" & data.tree_details[i].position_left =='' & data.tree_details[i].position_top =='' & data.tree_details[i].visual_type=='' & data.tree_details[i].height==''& data.tree_details[i].width=='' ){
				Default_TreeContent+=
					 '<li class="draggable-cloud" data-index='+data.tree_details[i].order_id+'>'+
					 '<img class="teamimage" src="/static/dev/NTree/ui/images/cloud-blue.png" data-imagename="cloud-blue.png">'+
					 '<span class="teamname" data-index="'+data.tree_details[i].id+'">'
					 if(data.user_group == 'PMNGR' && data.team_name == ''){
						 Default_TreeContent+= '<a href="/pm_objective_view/'+data.tree_details[i].id+'" >'+data.tree_details[i].name+'</a>'+
						'<label class="animated fadeIn">'+
						 '<i class="fa fa-edit" data-dismiss="modal" aria-hidden="true" href="#Update-Team" data-toggle="modal"></i>'+
						 '<span class="remove_team"><i class="fa fa-trash"></i></label></span>'
						 Default_MobileContent+='<li><a class="sa_arrow" href="/pm_objective_view/'+data.tree_details[i].id+'" >'+data.tree_details[i].name+'</a> </li>'	

					 }else if(data.tree_details[i].name == data.team_name && (data.user_group == 'USSER' || data.user_group == 'MNGER' || data.user_group == 'TMLDS')){
						 Default_TreeContent+= '<a href="/pm_objective_view/'+data.tree_details[i].id+'" >'+data.tree_details[i].name+'</a>'
						 Default_MobileContent+='<li><a class="sa_arrow" href="/pm_objective_view/'+data.tree_details[i].id+'" >'+data.tree_details[i].name+'</a> </li>'	

					 }else{
						Default_TreeContent+= '<a href="/Not_authorized/" >'+data.tree_details[i].name+'</a>'
						Default_MobileContent+='<li><a class="sa_arrow" href="/Not_authorized/" >'+data.tree_details[i].name+'</a> </li>'	

					 }
					Default_TreeContent+= '</span></li>'
			}else{
				image_name=data.tree_details[i].visual_type
				var image_path="/static/dev/NTree/ui/images/"+image_name
				Default_TreeContent+=
					'<li class="draggable-cloud" data-index='+data.tree_details[i].order_id+' style="left: '+data.tree_details[i].position_left+'px; top: '+data.tree_details[i].position_top+'px;" ">'+
					'<img class="teamimage" src="'+image_path+'" data-imagename="'+image_name+'" style="height: '+data.tree_details[i].height+'px; width: '+data.tree_details[i].width+'px;">'+
					'<span class="teamname" data-index="'+data.tree_details[i].id+'">'
					if(data.user_group == 'PMNGR' && data.team_name == ''){
						 Default_TreeContent+= '<a href="/pm_objective_view/'+data.tree_details[i].id+'" >'+data.tree_details[i].name+'</a>'+
						'<label class="animated fadeIn">'+
						 '<i class="fa fa-edit" data-dismiss="modal" aria-hidden="true" href="#Update-Team" data-toggle="modal"></i>'+
						 '<span class="remove_team"><i class="fa fa-trash"></i></label></span>'
						 Default_MobileContent+='<li><a class="sa_arrow" href="/pm_objective_view/'+data.tree_details[i].id+'" >'+data.tree_details[i].name+'</a> </li>'	

					 }else if(data.tree_details[i].name == data.team_name && (data.user_group == 'USSER' || data.user_group == 'MNGER' || data.user_group == 'TMLDS')){
						 Default_TreeContent+= '<a href="/pm_objective_view/'+data.tree_details[i].id+'" >'+data.tree_details[i].name+'</a>'
						 Default_MobileContent+='<li><a class="sa_arrow" href="/pm_objective_view/'+data.tree_details[i].id+'" >'+data.tree_details[i].name+'</a> </li>'	

					 }else{
						Default_TreeContent+= '<a href="/Not_authorized/" >'+data.tree_details[i].name+'</a>'
						Default_MobileContent+='<li><a class="sa_arrow" href="/Not_authorized/" >'+data.tree_details[i].name+'</a> </li>'	

					 }
					Default_TreeContent+= '</span></li>'
			}
		}
		
		 $('#tree_addcloud_ul').append(Default_TreeContent)
		 $('#mobilemenu').append(Default_MobileContent)
		 
		 $( ".draggable-cloud" ).draggable();
		 $( ".draggable-cloud img" ).resizable();
		 
	}
	//getting the li values 
	$('#tree_addcloud_ul li').each(function () {
		var position=$(this).position();
		position_top=position.top
		position_left=position.left
		height=$(this).find('.teamimage').height()
		width=$(this).find('.teamimage').width()
		order_id=$(this).attr("data-index")
		team_id=$(this).find('.teamname').attr("data-index")
		visual_type=$(this).find('.teamimage').attr("data-imagename")
		team_tree_list.push({
			'position_top':position_top,'position_left':position_left,'order_id':order_id,'height':height,'width':width,'team_id':team_id,
			'visual_type':visual_type
		})
	});
	update_team(team_tree_list,0)
	information_treeview();
 
	})
		

}

//Tree-view functionality in information view
function information_treeview(){
	org_unit_id=$('#ntree_org_unit_id').val()
	$.ajax({
		url:'/pm_department_treeview/',
		type:'GET',
		data:{'org_unit_id':org_unit_id},
		error:(function(error){
			alert_lobibox('error',error.statusText);
			})
	}).done(function(json_data){
		var data=JSON.parse(json_data);
		StrContent_Team=''
		$('#tree_addcloud_ul').empty();
		if(data.status == 'NTE-001'){
			for(i=0;i<data.tree_details.length;i++){
				image_name=data.tree_details[i].visual_type
				var image_path="/static/dev/NTree/ui/images/"+image_name
				StrContent_Team+='<li class="draggable-cloud" data-index='+data.tree_details[i].order_id+' style="left: '+data.tree_details[i].position_left+'px; top: '+data.tree_details[i].position_top+'px;" ">'+
				'<img class="teamimage" src="'+image_path+'" data-imagename="'+image_name+'" style="height: '+data.tree_details[i].height+'px; width: '+data.tree_details[i].width+'px;">'+
				'<span class="teamname" data-index="'+data.tree_details[i].id+'">'
//				if(data.user_group == 'PMNGR' && data.team_name == ''){
					StrContent_Team+= '<a href="/pm_objective_view/'+data.tree_details[i].id+'" >'+data.tree_details[i].name+'</a>'+
					'<label class="animated fadeIn">'+
					 '<i class="fa fa-edit" data-dismiss="modal" aria-hidden="true" href="#Update-Team" data-toggle="modal"></i>'+
					 '<span class="remove_team"><i class="fa fa-trash"></i></label></span>'
//				 }else if(data.tree_details[i].name == data.team_name && (data.user_group == 'USSER' || data.user_group == 'MNGER' || data.user_group == 'TMLDS' || data.user_group == 'HRMGR')){
//					 StrContent_Team+= '<a href="/pm_objective_view/'+data.tree_details[i].id+'" >'+data.tree_details[i].name+'</a>'
//				 }else{
//					 StrContent_Team+= '<a href="/Not_authorized/" >'+data.tree_details[i].name+'</a>'
//				 }
			}
			$('#tree_addcloud_ul').append(StrContent_Team)
//			if(data.user_group == 'PMNGR' && data.team_name == ''){
				 $(".draggable-cloud").draggable({
				     stop: function( event, ui ) {
				    	 save_changes()
				    	 
				     }
				 });
			$( ".draggable-cloud img" ).resizable({
			    stop: function( event, ui ) {
			    	save_changes()
			    }
			});
//			}
			//For already exist team id push into the array
			$('#tree_addcloud_ul li').each(function () {
				var team_id=$(this).find('.teamname').attr("data-index")
				teamname_list.push(team_id)
			});
		}if(data.status == 'NTE-002'){
			alert_lobibox('error',data.message)	
		}if(data.status == 'NTE-003'){
			alert_lobibox('error',data.message)	
		}
	})
}

function save_changes(){
	$.when( 
			$('#tree_addcloud_ul li').each(function () {
				var position=$(this).position();
				position_top=position.top
				position_left=position.left
				height=$(this).find('.teamimage').height()
				width=$(this).find('.teamimage').width()
				order_id=$(this).attr("data-index")
				team_id=$(this).find('.teamname').attr("data-index")
				visual_type=$(this).find('.teamimage').attr("data-imagename")
				team_tree_list.push({
					'position_top':position_top,'position_left':position_left,'order_id':order_id,'height':height,'width':width,'team_id':team_id,
					'visual_type':visual_type
				})
			})
	).done(function () {
		update_team(team_tree_list,0)
	});
}
/*//Save image button functionality
$('#save_image').click(function(){
	save_changes();
})*/

//Common functionality for update team 
function update_team(team_tree_list,flag){
	//Function to update the Team details
	$.ajax({
		url:'/pm_update_department/',
		type:'POST',
		data:{'team_tree_list':JSON.stringify(team_tree_list),'update_teamid_list':JSON.stringify(update_id_list),
			csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()},
			error:(function(error){
				alert_lobibox('error',error.statusText);
			})
	}).done(function(json_data){
		var data=JSON.parse(json_data);
		if(flag==1){
			if(data.status == 'NTE-001'){
				alert_lobibox('success',data.message)
			}
		}
		
	});
}
//Getting max order id from team 
function maxorderid_fun(){
	var order_id=0
	$.ajax({
		url:'/pm_info_maxorderid/',
		type:'GET',
		async:false,
		data:{},
			error:(function(error){
				alert_lobibox('error',error.statusText);;
			})
	}).done(function(json_data){
		var data=JSON.parse(json_data);
		if(data.status == 'NTE-001'){
			order_id=data.max_order[0]['order_id']
		}else{
			order_id=0
		}
	});
	return order_id
}


//add team button functionality
$('#btn_add_team').click(function(){
	var validation_result=$('#addteam_form').valid()
	count =maxorderid_fun()
	count=+count+1;
	team_id=$('#info_teamname').val()
	team_name=$('#info_teamname option:selected').text()
	image_name=$('input[name=addteam_cloudimage]:checked').attr("data-imagename")
	cloud_name=$('input[name=addteam_cloudimage]:checked').val();
	
	var StrContent_Team=''
	if(validation_result){
		exist_value=jQuery.inArray(team_id,teamname_list)
		if(exist_value<0){
			if(team_name!='' && cloud_name!=''){
				teamname_list.push(team_id)
				var image_path="/static/dev/NTree/ui/images/"+image_name
				StrContent_Team+='<li class="draggable-cloud" data-index='+count+'>'+
				'<img class="teamimage" src="'+image_path+'" data-imagename="'+image_name+'">'+
				'<span class="teamname" data-index="'+team_id+'">'+
				'<a href="/pm_objective_view/'+team_id+'">'+team_name+'</a>'+
				'<label class="animated fadeIn">'+
				'<i class="fa fa-edit" data-dismiss="modal" aria-hidden="true" href="#Update-Team" data-toggle="modal"></i>'+
				'<span class="remove_team"><i class="fa fa-trash"></i></span></label>'+
				'</span></li>'
				$('#tree_addcloud_ul').append(StrContent_Team)
				$( ".draggable-cloud" ).draggable();
				$( ".draggable-cloud img" ).resizable();
				$('#Add-Team').modal('toggle')
				$('#info_teamname').val(0).trigger('change')
				alert_lobibox('success',"Department added successfully")
				save_changes()
			}
		}else{
			$('#Add-Team').modal('toggle')
			$('#info_teamname').val(0).trigger('change')
			alert_lobibox('error',"Department Already Exists")	
		}
	}
	return false
})

//Update team button functionality
$('#btn_update_team').click(function(){
	var validation_result=$('#addupdate_form').valid()
	if(validation_result){
	prev_team_id=updateteam_modal_triggered_element.parents("li").find( ".teamname" ).attr("data-index")
	updateteam_id=$('#info_updateteamname').val()
	updateteam_name=$('#info_updateteamname option:selected').text()
	update_cloud_name=$('input[name=updateteam_cloudimage]:checked').val();
	update_image_name=$('input[name=updateteam_cloudimage]:checked').attr("data-imagename")
	order_id=updateteam_modal_triggered_element.parents('li').attr("data-index")
	var image_path="/static/dev/NTree/ui/images/"+update_image_name
	updateteam_modal_triggered_element.parents("li").find( ".teamimage" ).attr("src",image_path)
	updateteam_modal_triggered_element.parents("li").find( ".teamimage" ).attr("data-imagename",update_image_name)
	updateteam_modal_triggered_element.parents("li").find( ".teamname" ).attr("data-index",updateteam_id)
	updateteam_modal_triggered_element.parents("li").find( ".teamname" ).html(
			'<a href="/pm_objective_view/'+updateteam_id+'">'+updateteam_name+'</a>'+
			'<label class="animated fadeIn">'+
			'<i class="fa fa-edit" data-dismiss="modal" aria-hidden="true" href="#Update-Team" data-toggle="modal"></i>'+
			'<span class="remove_team"><i class="fa fa-trash"></i></span></label>')
	if(prev_team_id!='' & prev_team_id!=null){
		update_id_list.push(prev_team_id)
		teamname_list.splice( $.inArray(prev_team_id, teamname_list), 1 );
	}
	$('#Update-Team').modal('toggle')		
	var updateteam_tree_list=[]
	teamname_list=[]
	//getting the li values 
	$('#tree_addcloud_ul li').each(function () {
		var position=$(this).position();
		position_top=position.top
		position_left=position.left
		height=$(this).find('.teamimage').height()
		width=$(this).find('.teamimage').width()
		order_id=$(this).attr("data-index")
		team_id=$(this).find('.teamname').attr("data-index")
		visual_type=$(this).find('.teamimage').attr("data-imagename")
		updateteam_tree_list.push({
			'position_top':position_top,'position_left':position_left,'order_id':order_id,'height':height,'width':width,'team_id':team_id,
			'visual_type':visual_type
		})
		teamname_list.push(team_id)
	});
	update_team(updateteam_tree_list,1)
	}
})


/*
//Create team Functionality
$('#create_team').click(function(){
	team_name=$('#newteam_name').val()
	validation_result=$('#createteam_form').valid()
	//Function to add Team details
	if(validation_result){
	$.ajax({
		url:'/pm_create_department/',
		type:'POST',
		data:{'team_name':team_name,
			csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()},
			error:(function(error){
				alert_lobibox('error',error.statusText);
			})
	}).done(function(json_data){
		var data=JSON.parse(json_data);
		if(data.status == 'NTE-001'){
			$('#Create-Team').modal('toggle')
			$('#newteam_name').val('')
			$('#Add-Team').modal('show')
			team_details();
			alert_lobibox('success',data.message)
		}else if(data.status == 'NTE-002'){
			$('#Create-Team').modal('toggle')
			$('#newteam_name').val('')
			alert_lobibox('error',data.message)	
		}
	});
	}
	return false
})*/
//For Create Team Close Button 
function create_team_close(){
	$('#Create-Team').modal('toggle')
	$('#Add-Team').modal('show')
	$('#newteam_name').val('')
}
//Cancel button functionality in Create Team
$('#cancel_team').click(function(){
	create_team_close()
});

//Close button functionality in Create Team
$('#close_team').click(function(){
	create_team_close()
})


//delete functionality of team from information view tree
$(document).on("click",".remove_team", function(){
	team_id=$(this).parents(".teamname").attr('data-index')
	var team_name=$(this).parent().siblings('a').text()
	if(team_name.length>10){
		var team_name=team_name.substring(0,8)+'...'
	}else{
		var team_name=team_name
	}
	if(team_id){
		delete_dynamic_element_confirm(team_id,team_name);
	}
})

//Delete Functionality Model Box
function delete_dynamic_element_confirm(team_id,team_name) {
	swal({
		  title: "Are you sure you want to delete this "+ team_name  + "  team?",
		  text: "",
		  type: "warning",
		  showCancelButton: true,
		  confirmButtonClass: "btn-success pull-left btn-eql-wid btn-animate",
		  cancelButtonClass: "btn-danger pull-right  btn-eql-wid btn-animate",
		  confirmButtonText: "Yes",
		  cancelButtonText: "No",
		  closeOnConfirm: true,
		  closeOnCancel: true
		},
		function(isConfirm) {
		  if(isConfirm){
			  confirm_delete(team_id)
		  }
		});
}

function confirm_delete(team_id){
	$.ajax({
			url:'/pm_delete_department/',
			type:'POST',
			data:{'team_id':team_id,
				csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()},
				error:(function(error){
					alert_lobibox('error',error.statusText);
				})
		}).done(function(json_data){
			var data=JSON.parse(json_data);
			if(data.status == 'NTE-001'){
				teamname_list.splice( $.inArray(team_id, teamname_list), 1 );
				information_treeview();
				alert_lobibox('success',data.message)
			}else{
				alert_lobibox('error',data.message)	
			}
		})
}
$('#add_team').click(function(){
	$('#info_teamname').val(0).trigger('change')
});

/*//For To view the all team details
function team_details(){
	$('#info_teamname').empty()
	$.ajax({
		url:'/pm_department_details/',
		type:'GET',
		async:false,
		error:(function(error){
				alert_lobibox('error',error.statusText);
			})
	}).done(function(json_data){
	var data=JSON.parse(json_data);
	if(data.status == 'NTE-001'){
		$('#info_teamname').append('<option value="0" >--Select--</option>');
		if(data.team_info.length>0){
			for(i=0;i<data.team_info.length;i++){
				$('#info_teamname').append($('<option>',{
					value:data.team_info[i].id,
					text:data.team_info[i].name
				}));
			}
		}
		   $('#info_teamname').trigger("change")
	}if(data.status == 'NTE-002'){
		alert_lobibox('error',data.message)	
	}if(data.status == 'NTE-003'){
		alert_lobibox('error',data.message)	
	}
	})
}*/

