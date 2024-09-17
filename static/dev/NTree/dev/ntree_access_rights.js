$(document).ready(function(){
	access_rights_level_view();
})
///Add Employee Mapping confirmation function 
function AddConfirmationRoleLevel(func_name, action_name,action_id,levelName) {
	title = ''
		for(var i=0;i<action_name.length;i++){
			if(i<action_name.length-1){
				title = title + action_name[i] + ', '
			}
			else if(i==action_name.length-1){
				title = title + action_name[i]
			}

		}
	title = title + " are allocated to level.\n Do you want to update the level?"
	$('.popup_zindex').css({'z-index':'unset'});//search select btn zindex
	swal ({
		title: title,
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
		if (action_id) {
			window[func_name](levelName,isConfirm,action_id);
		} else {
			window[func_name](levelName,isConfirm);
		}
	});
}

var roledata;
function roleChange(roleinfo){
	roledata = $(roleinfo).val()
}

function access_rights_level_view(){
	$.ajax({
		url:'/okr_access_rights_view/',
		type:'GET',
	}).done(function(json_data){
		var roleDataLevel1 = []
		var roleDataLevel2 = []
		var roleDataLevel3 = []
		var roleDataLevel4 = []
		if(json_data.status=='NTE_01' && json_data.access_rights_data!=undefined){ 
			if(json_data.access_rights_data.length!=0){
				for(var i=0;i<json_data.access_rights_data.length;i++){
					if(json_data.access_rights_data[i].levels=="level1"){
						roleDataLevel1.push(json_data.access_rights_data[i].role_id)
					}
					else if(json_data.access_rights_data[i].levels=="level2"){
						roleDataLevel2.push(json_data.access_rights_data[i].role_id)
					}
					else if(json_data.access_rights_data[i].levels=="level3"){
						roleDataLevel3.push(json_data.access_rights_data[i].role_id)
					}
					else if(json_data.access_rights_data[i].levels=="level4"){
						roleDataLevel4.push(json_data.access_rights_data[i].role_id)
					}
				}
			}
			$("#roleLevel1").val(roleDataLevel1).trigger('change')
			$("#roleLevel2").val(roleDataLevel2).trigger('change')
			$("#roleLevel3").val(roleDataLevel3).trigger('change')
			$("#roleLevel4").val(roleDataLevel4).trigger('change')
			if($("#roleLevel1").val() != null){
				if($("#roleLevel1").val().length!=0){
					$("#create_level1_role")["0"].textContent = "Update"
					$("#create_level1_role").removeClass( "btn-success")
					$("#create_level1_role").addClass( "btn-primary")
				}
			}
			else{
				$("#create_level1_role")["0"].textContent = "Add"
				$("#create_level1_role").removeClass( "btn-primary")
				$("#create_level1_role").addClass( "btn-success")
			}
			if($("#roleLevel2").val() != null){
				if($("#roleLevel2").val().length!=0){
					$("#create_level2_role")["0"].textContent = "Update"
					$("#create_level2_role").removeClass( "btn-success")
					$("#create_level2_role").addClass( "btn-primary")
				}
			}
			else{
				$("#create_level2_role")["0"].textContent = "Add"
				$("#create_level2_role").removeClass( "btn-primary")
				$("#create_level2_role").addClass( "btn-success")
			}
			if($("#roleLevel3").val() != null){
				if($("#roleLevel3").val().length!=0){
					$("#create_level3_role")["0"].textContent = "Update"
					$("#create_level3_role").removeClass( "btn-success")
					$("#create_level3_role").addClass( "btn-primary")
				}
			}
			else{
				$("#create_level3_role")["0"].textContent = "Add"
				$("#create_level3_role").removeClass( "btn-primary")
				$("#create_level3_role").addClass( "btn-success")
			}
			if($("#roleLevel4").val() != null){
				if($("#roleLevel4").val().length!=0){
					$("#create_level4_role")["0"].textContent = "Update"
					$("#create_level4_role").removeClass( "btn-success")
					$("#create_level4_role").addClass( "btn-primary")
				}
			}
			else{
				$("#create_level4_role")["0"].textContent = "Add"
				$("#create_level4_role").removeClass( "btn-primary")
				$("#create_level4_role").addClass( "btn-success")
			}
		}
	})
}


function createLevelRole(levelName,confirm,role_common_data){
	var role_common_list = []
		if(confirm){
				data = {'levelname':levelName,'role':JSON.stringify(roledata),'role_common_data':JSON.stringify(role_common_data),csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()}
		}
		else{
			if(role_common_data!=undefined){
				$.each(roledata, function(index, value){
					if(!(jQuery.inArray(value, role_common_data)>-1)){
						role_common_list.push(value) 
					}
				});
			}
			else{
				role_common_list = roledata
			}
			data = {'levelname':levelName,'role':JSON.stringify(role_common_list),csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()}
		}
	if(data){
		$.ajax({
			url:'/okr_access_rights_create/',
			type:'POST',
			data:data,
		}).done(function(json_data){
			if(json_data.status=='NTE_01'){  alert_lobibox("success", sysparam_datas_list[json_data.status]); access_rights_level_view();}
			else if(json_data.status=='NTE_00'){ alert_lobibox("info",sysparam_datas_list["ERR0033"]); }
			else if(json_data.status=='NTE_02'){ alert_lobibox("failed", sysparam_datas_list[json_data.status]); }
			else if(json_data.status=='NTE_03'){ alert_lobibox("success", sysparam_datas_list[json_data.status]); access_rights_level_view();}
			else if(json_data.status=='NTE_04'){ alert_lobibox("success", sysparam_datas_list[json_data.status]); }
			else { alert_lobibox("No Data Found", sysparam_datas_list["ERR0034"]); }
		})
	}
}

function createLevelRoleConfirmation(event,levelName){
	event.preventDefault();
		$.ajax({
			type:'get',
			url: '/okr_access_rights_check/',
			async : false,
			data  : {'levelname':levelName,'role':JSON.stringify(roledata)},
			success: function (json_data){
				if(json_data.status=='NTE_01' && json_data.role_detail.length!=0){
					employee_data_name = json_data['role_detail'].map(a=>a.role_title) 
					employee_data_id = json_data['role_detail'].map(a=>(a.id).toString())
					AddConfirmationRoleLevel('createLevelRole',employee_data_name,employee_data_id,levelName) }
				else { createLevelRole(levelName); }
			},
		})
}

function clearLevelRole(level){
	
	if(level=="level1"){
		$("#roleLevel1").val([]).trigger('change')
	}
	else if(level=="level2"){
		$("#roleLevel2").val([]).trigger('change')
	}
	else if(level=="level3"){
		$("#roleLevel3").val([]).trigger('change')
	}
	else if(level=="level4"){
		$("#roleLevel4").val([]).trigger('change')
	}
	
}
