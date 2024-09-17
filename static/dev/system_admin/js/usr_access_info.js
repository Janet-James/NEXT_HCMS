var seleted_data = [];
var menu_values = {
		'HR Foundation': ["HR Foundation","Manage Organization","Organization","Organization Unit","Division","Organization Hierarchical","Manage Employee","Employee Details","Employee List","Employee Hierarchy","ID Card Generation","Employee Offer Generation","HR Foundation Reports","Employee Report","Exit Employee","Exit Request Employee","Meet Our Expertise","Correspondance Management Document Creation"],
		'Compensation Management': ["Compensation Management","Payroll Setup","Payroll Report","Tax Declaration Configuration","Tax Declaration Form","My Payslip"],
		'Talent Management': ["Talent Management","Talent Inventory","Role Definition","View Reporting Structure","Talent Inventory Reports","Talent Profiling","Competency Assessment","Talent Matrix","Accolades Management","My Talent Profile"],
		'Leave Management': ["Leave Management","Holiday Administration","Holiday Details","Leave Administration","Raise Leave Request","Holiday/Leave Calendar","Process Leave Request",],
		'Workforce Administration': ["Workforce Administration","Work Time Management","Attendance Configuration","Asset Management","Manual Attendance","Attendance Records",],
		'Performance Management': ["Performance Management","Balanced Scorecard","Objectives & Key Results","Cascade Objectives","Assessment Configuration","Assessment Form Setup","Assessment Schedule Setup","Performance Assessment","Performance Dashboard"],
		'Learning & Development': ["Learning & Development","Training Management","Training Creation","Internship Training","Training Request","Raise Training Request","Process Training Request","Training Recommendation","General Recommendation","Management & TL Recommendation","Training Results","Training Cost & Budget","Raise Budget Request","Process Budget Request"],
		'Succession Planning': ["Succession Planning","Identify Key Roles","Successor Hierarchy","Potential Successors","Transfer Request","Reassignment Request","Promotion Request","Demotion Request","Reassignment Process",
		                        "Transfer Process","Promotion Process","Demotion Process","Succession Planning Report"],
		'Workforce Planning': ["Workforce Planning","Strategy Analysis","Structure Analysis","job Requisition Analysis","Workforce Request"],
		'Talent Acquisition': ["Talent Acquisition","Job Openings","Candidate Tracking System","Interview Management","Offer Management","On boarding","Talent Acquisition Report","Job Posting Request","Job Posting Approval"],
		'Exit Management': ["Exit Management","Raise Exit Request","Process Exit Request","Generate Exit Certificate","Exit Employee Report Details"],
		'AppAdmin': ["AppAdmin","User","User Roles","Manage Users","Access Control","Menu & Page Master","Configuration","Alert & Notification","Manage Reference Item","Manage Reference Item Link","Country & Province Master","Upload Data","Tools & Technology","Organization Branding","Linked In","Correspondance Management Template Configuration","Payment File Generation"],
	}
var btn_values = {
		'HR Foundation': ["Organization","Organization Unit","Division","Organization Hierarchical","Manage Employee","Employee Details","Employee List","Employee Hierarchy","ID Card Generation","Employee Offer Generation","HR Foundation Reports","Employee Report","Exit Employee","Exit Request Employee","Meet Our Expertise","Correspondance Management Document Creation"],
		'Compensation Management': ["Payroll Setup","Payroll Report","Tax Declaration Configuration","Tax Declaration Form","My Payslip"],
		'Talent Management': ["Talent Inventory","Role Definition","View Reporting Structure","Talent Inventory Reports","Talent Profiling","Competency Assessment","Talent Matrix","Accolades Management","My Talent Profile"],
		'Leave Management': ["Holiday Administration","Holiday Details","Leave Administration","Raise Leave Request","Holiday/Leave Calendar","Process Leave Request",],
		'Workforce Administration': ["Work Time Management","Attendance Configuration","Asset Management","Manual Attendance","Attendance Records",],
		'Performance Management': ["Balanced Scorecard","Objectives & Key Results","Cascade Objectives","Assessment Configuration","Assessment Form Setup","Assessment Schedule Setup","Performance Assessment","Performance Dashboard"],
		'Learning & Development': ["Training Management","Training Creation","Internship Training","Training Request","Raise Training Request","Process Training Request","Training Recommendation","General Recommendation","Management & TL Recommendation","Training Results","Training Cost & Budget","Raise Budget Request","Process Budget Request"],
		'Succession Planning': ["Identify Key Roles","Successor Hierarchy","Potential Successors","Transfer Request","Promotion Request","Demotion Request","Reassignment Process",
		                        "Transfer Process","Promotion Process","Demotion Process","Succession Planning Report"],
		'Workforce Planning': ["Strategy Analysis","Structure Analysis","job Requisition Analysis","Workforce Request"],
		'Talent Acquisition': ["Job Openings","Candidate Tracking System","Interview Management","Offer Management","On boarding","Talent Acquisition Report","Job Posting Request","Job Posting Approval"],
		'Exit Management': ["Raise Exit Request","Process Exit Request","Generate Exit Certificate","Exit Employee Report Details"],
		'AppAdmin': ["User","User Roles","Manage Users","Access Control","Menu & Page Master","Configuration","Alert & Notification","Manage Reference Item","Manage Reference Item Link","Country & Province Master","Upload Data","Tools & Technology","Organization Branding","Linked In","Correspondance Management Template Configuration","Payment File Generation"],
	}
$(document).ready(function () {
	$('select#org_id').select2({
		placeholder: 'Select Organization',
		minimumInputLength: 0,
	});
	$('select#org_unit_id').select2({
		placeholder: 'Select Organization Unit',
	});
	$('select#usr_grp_id').select2();
}); 

//Organization unit get function
function org_unit_fetch_function(org_id) {
	$('.select2-selection__rendered').removeAttr('title')
	if (org_id != '') { 
		var currurl = window.location.href;
		var actionurl = currurl.replace('usr_access_details/','org_unit_fetch/');
		$.ajax({
			type  : 'GET',
			url   : actionurl,
			async: false,
			data: {
				'org_id': org_id
			},
		}).done( function(jsondata) {
			var data = JSON.parse(jsondata);
			if (data.status == "NTE_01") {
				$('select#org_unit_id').empty().append($('<option>',{
					placeholder: 'Select Organization Unit',
				})); 
				var org_unit_str = '';
				for (var i=0; i<data.org_unit_details.length; i++) { 
					org_unit_str += '<option value="'+data.org_unit_details[i].id+'">'+data.org_unit_details[i].orgunit_name+'</option>';
				}
				$("#org_unit_id").append(org_unit_str); 
			} else {
				alert_lobibox("error", sysparam_datas_list[data.status]);
			}
		});
	}
	return false;
}

//User access details table load function
function usr_access_detail_table_function(org_id, org_unit_id, usr_grp_id){
	var org_id = $("#"+org_id).val();
	var org_unit_id = $("#"+org_unit_id).val();
	var usr_grp_id = $("#"+usr_grp_id).val();
	if (org_unit_id == null || org_unit_id == undefined) {
		org_unit_id = 0;
	} 
	if (usr_grp_id == null || usr_grp_id == undefined) {
		usr_grp_id = 0;
	}
	var menu_names = [],
	page_names = [];
	menu_names.push(menu_values);
	page_names.push(btn_values);
	if (org_id != 0 && org_id != null && org_id != undefined && usr_grp_id != 0 && usr_grp_id != null && usr_grp_id != undefined) {
		var currurl = window.location.href;
		var actionurl = currurl.replace('usr_access_details/','usr_access_record/');
		$.ajax({ 
			type  : 'GET',
			url   : actionurl,
			data: {
				'org_id': org_id,
				'org_unit_id': org_unit_id,
				'usr_grp_id': usr_grp_id
			},
		}).done( function(jsondata) {
			var data = JSON.parse(jsondata);
			console.log(data);
			seleted_data = data;
			if (data.status == "NTE_01") {
				if (data.usr_roles.length != 0){
					$("#usr_access_table tr:gt(1)").remove();
					var menu_name_str = '',
					page_name_str = '';
					$.each(menu_names[0], function(key, value) {
						menu_name_str += '<optgroup label="'+key+'">';
						for (var i=0; i<value.length; i++) { 
							menu_name_str += '<option value="'+value[i]+'">'+value[i]+'</option>';
						}
						menu_name_str += '</optgroup>';
					});
					$.each(page_names[0], function(key, value) {
						page_name_str += '<optgroup label="'+key+'">';
						for (var i=0; i<value.length; i++) { 
							page_name_str += '<option value="'+value[i]+'">'+value[i]+'</option>';
						}
						page_name_str += '</optgroup>';
					});
					var usr_access_str = '';
					for (var i=0; i<data.usr_roles.length; i++) { 
						usr_access_str += '<tr><td id="'+data.usr_roles[i].id+'">'+data.usr_roles[i].name+'</td>';
						usr_access_str += '<td id="1"><select class="mt-multiselect btn btn-default" multiple="multiple" data-label="left" data-clickable-groups="true" data-collapse-groups="true"'; 
						usr_access_str += 'data-select-all="true" data-width="100%" data-filter="true" data-action-onchange="true">'+menu_name_str+'</select></td>';
						usr_access_str += '<td id="2"><select class="mt-multiselect btn btn-default" multiple="multiple" data-label="left" data-clickable-groups="true" data-collapse-groups="true"'; 
						usr_access_str += 'data-select-all="true" data-width="100%" data-filter="true" data-action-onchange="true">'+page_name_str+'</select></td>';
						usr_access_str += '<td id="3"><select class="mt-multiselect btn btn-default" multiple="multiple" data-label="left" data-clickable-groups="true" data-collapse-groups="true"'; 
						usr_access_str += 'data-select-all="true" data-width="100%" data-filter="true" data-action-onchange="true">'+page_name_str+'</select></td>';
						usr_access_str += '<td id="4"><select class="mt-multiselect btn btn-default" multiple="multiple" data-label="left" data-clickable-groups="true" data-collapse-groups="true"';
						usr_access_str += 'data-select-all="true" data-width="100%" data-filter="true" data-action-onchange="true">'+page_name_str+'</select></td>';
					}
					$("#usr_access_table_tbody").append(usr_access_str);
					$('#usr_access_table>tbody>tr:gt(1)').each(function() { 
						var role_id = $(this).find('td:eq(0)').attr('id');
						for (var i=0; i<data.usr_access_datas.length; i++) {
							if (role_id == data.usr_access_datas[i].role_id) {  
								for (var j=0; j<data.usr_pernissions.length; j++) {
									if (data.usr_access_datas[i].permission_id == 1) {
										$(this).find("td:eq(1)").find(".mt-multiselect").multiselect('select',data.usr_access_datas[i].access_datas);
									} else if (data.usr_access_datas[i].permission_id == 2) {
										$(this).find("td:eq(2)").find(".mt-multiselect").multiselect('select',data.usr_access_datas[i].access_datas);
									} else if (data.usr_access_datas[i].permission_id == 3) {
										$(this).find("td:eq(3)").find(".mt-multiselect").multiselect('select',data.usr_access_datas[i].access_datas);
									} else if (data.usr_access_datas[i].permission_id == 4) {
										$(this).find("td:eq(4)").find(".mt-multiselect").multiselect('select',data.usr_access_datas[i].access_datas);
									}
								}
							}
						}
					});
					$(".mt-multiselect").multiselect('destroy');
					ComponentsBootstrapMultiselect.init(); 
					var rowCount = $('#usr_access_table >tbody >tr').length;
					if (rowCount > 4) {
						$('#usr_access_table tr:last').find('.btn-group').addClass('dropup');
					}
				} else {
					alert_lobibox("warning", "Given Organization Doesn't have User Roles");
				}
			} else {
				alert_lobibox("error", sysparam_datas_list[data.status]);
			}
		});
	} else {
		alert_lobibox("error", "Access Menu Data not Fetched Since Organization, Organization Unit and Group Fields are Must");
	}
	return false;
}

function action_for_usr_access(action_name) {
	if (action_name == "add") {
		// User access added function
		usr_access_data_management('add');
		return false
	} else if (action_name == "clear") {
		
		$("#usr_access_table tr:gt(1)").remove();
		$("#org_id").val(null).trigger('change');
		$("#org_unit_id").val(null).trigger('change');
		$('.select2-selection__rendered').removeAttr('title')
	}
}

function usr_access_data_management(func_name) {
	var currurl = window.location.href; 
	var actionurl = currurl.replace('usr_access_details/','usr_access_datainsert/');
	var access_data_list = [];
	$('#usr_access_table>tbody>tr:gt(1)').each(function() {
		var group_id = $(this).find('td:eq(0)').attr('id');
		let usr_grp_id = $('#usr_grp_id').val();
		$(this).find('td:gt(0)').each(function() {
			var temp_access_data = $(this).find('.mt-multiselect').val();
			if (temp_access_data == null){
				temp_access_data = [];
			}
			access_data_list.push({
				role_id: usr_grp_id,
				group_id: group_id,
				permission_id: $(this).attr('id'),
				access_datas: temp_access_data,
			})
		});
	});
	console.log('access_data_list',access_data_list)
	let dataValidation = dataValidationMenu(access_data_list);//data length validation
	var validation = inputDataValidation(access_data_list);
	if(validation){
		if(dataValidation){
			$.ajax({
				type  : 'POST',
				url   : actionurl,
				data: {
					'datas': JSON.stringify(access_data_list),
				},
			}).done( function(jsondata) {
				var data = JSON.parse(jsondata);
				if (data.status == "NTE_01") {
					$("#usr_access_table tr:gt(1)").remove();
					alert_lobibox("success", 'Details Updated Successfully');
					$("#org_unit_id").val(0).trigger('change');
					$("#org_id").val(null).trigger('change');
				} else {
					alert_lobibox("error", sysparam_datas_list[data.status]);
				}
			});
		}else{
			alert_lobibox("error", 'No Changes Found.');
		}
		}else{
		alert_lobibox("error", 'No Data Selected.');
	}
}

//general validation for the menu access
function dataValidationMenu(update_data){
	let get_role = seleted_data['usr_roles'] != undefined ? seleted_data['usr_roles'] : [];
	for(let i=0; i<get_role.length; i++){
		let get_data = seleted_data['usr_access_datas'] != undefined ? seleted_data['usr_access_datas'] : [];
		let get_data_len = get_data.length;
		if(get_data_len > 0){
			for(let j=0; j<get_data_len; j++){
				if(get_role[i]['id'] == get_data[j]['role_id']){
					//console.log(get_data[j]['role_id'],"-------------------------oooooooo---==========",get_data[j]['permission_id'],"------------",get_data[j]['access_datas'])
					for(let k=0; k<update_data.length; k++){
						if(update_data[k]['group_id'] == get_data[j]['role_id'] && update_data[k]['permission_id'] == get_data[j]['permission_id']){
							//console.log(update_data[k]['role_id'],"------------------uuuuuuu----------==========",update_data[k]['access_datas'])
							//console.log(get_data[j]['access_datas'],"---update---",update_data[k]['access_datas']);
							if(get_data[j]['access_datas'].length != update_data[k]['access_datas'].length){
								return true;
							}
						}
					}
				}
			}
		}
		else{
			if(update_data.length>0){
				return true;
			}else{
				return false;
			}
		}
	}
	return false 
}

function inputDataValidation(data){
	for (let i=0; i<data.length; i++){
		if(data[i].access_datas.length > 0){
			return true;
			break;
		}else{
			return false
		}
	}
}

//23-OCT-2018 || SMI || Org. Unit Onchange Function - Load corresponding User Groups 
function user_groups_fetch(org_unit_val){
	$('.select2-selection__rendered').removeAttr('title')
	$('#usr_grp_id').empty().append($('<option>',{ 
		placeholder:'Select User Group',
	}));
	var org_val = $("#org_id").val();
	if(org_unit_val != '' || org_unit_val != null || org_unit_val != 0 || org_unit_val != undefined){
		$.ajax({
			type  : 'POST',
			url   : '/user_group_fetch/',
			data: { 
				'org_id': org_val,
				'org_unit_id': org_unit_val,
			},
		}).done( function(jsondata) {
			var data = JSON.parse(jsondata);
			if(data.usr_role_grps != undefined){
				if(data.usr_role_grps.length > 0){
					for(i=0;i<data.usr_role_grps.length;i++) 
					{
						$('#usr_grp_id').append($('<option>',{
							value:data.usr_role_grps[i].id,  
							text:data.usr_role_grps[i].name
						}))
					}
				}
			}
		});
	}
}
let groupChange=()=>{
	$('.select2-selection__rendered').removeAttr('title');
}
	
