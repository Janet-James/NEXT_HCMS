var parent_org_unit_id, parent_org_unit_name, update_parent_org_unit_id,update_new_id;
var org_select_type = "";
var parent_org = 0;
var code = "";
var org_code = "";
var select_org_id = 0;
$(document).ready(
		function() {
			$('[data-toggle="tooltip"]').tooltip();
			button_create(1)
			$.jstree.destroy();
			$('input[type=radio][name=org_tree_type]').prop('checked', false);

			$('input[type=radio][name=org_tree_type]').change(function() {
				if (this.value == "single") {
					org_select_type = this.value;
				} else if (this.value == "multi") {
					org_select_type = this.value;
				}
			})
			$('#organization').change(function() {
				var org = $(this).find(":selected").text()
				if (org) {
					code = org[0]
					for (var i = 0; i < org.length; i++) {
						if (code.length < 3){tree3_organization_id
							if (org[i] == " ") {
								code += org[i + 1].toUpperCase(); 
							}
						}
					}
					code = code.replace(/[^a-zA-Z ]/g, "")
					$('#organization_unit_code').val(code + "-" + org_code)
					org_unit_drop_down_function($('#organization').val());	 
				}
			})
			OrganizationUnit()
			function OrganizationUnit() {
				var Options = {};
				Options[''] = '0';
				$.ajax({
					url : '/hrms_organization_unit_data/',
					type : 'GET',
					timeout : 10000,
					async : false,
				}).done(  
						function(json_data) {
							var data = JSON.parse(json_data);
							if (data.org_unit) {
								var data = data.org_unit;

								data.map(function(value, index) {
									Options[value.refitems_name] = value.id
								});
								var $el = $("#org_organization_unit_type"); 
								$el.empty(); // remove old options
								$el.append($("<option></option>").attr("value",
										0).text("--Select Org Unit Type--"));
								$.each(Options, function(key, value) {
									$el.append($("<option></option>").attr(
											"value", value).text(key));
								});
								var $el = $("#parent_org_unit_type");
								// $el.empty(); // remove old options
								$.each(Options, function(key, value) {
									$el.append($("<option></option>").attr(
											"value", value).text(key));
								});
							}

						});
			}
			var status = 0;
			//org change function here
			$("#tree3_organization_id").change(function() {
				if(this.value != 0) {
					if(status == 0){
						status = 1;
						$("#organization").val(this.value).trigger('change');
						status = 0;
					}
					select_org_id = this.value;
					$("#org_unit_main_tree_empty").hide();
					$("#org_unit_main_tree").show();
					search_tree("tree_3", "all",this.value);
				}else{
					$("#org_unit_main_tree_empty").show();
					$("#org_unit_main_tree").hide();
					$('#org_unit_main_tree_empty').html('<div class="col-md-12"><h3 style="text-align: center;color:#e73d4a;">No data available.</h3></div>');
				}
				$('#organization_unit_name').val("");
				$('#org_unit_address').val("");
				$('#org_organization_unit_type').val("0").trigger("change");
			});
			$("#organization").change(function() {
				if(status == 0){
					select_org_id = this.value;
					$("#tree3_organization_id").val(this.value).trigger('change');
				}
				search_tree("tree_3", "all",0);
			});
			
			$('#org_unit_main_tree_empty').html('<div class="col-md-12"><h3 style="text-align: center;color:#e73d4a;">No data available.</h3></div>');
			$("#org_unit_main_tree_empty").show();
			$("#org_unit_main_tree").hide();
		})// ready
		
function view_form() {
	$('#org_unit_main_div > .col-md-12').addClass('col-md-5').removeClass(
			'col-md-12');
	$('#org_unit_add_form_div').addClass('col-md-7').removeClass('col-md-3');
	$('#org_unit_list_div .col-lg-3').addClass('col-lg-3_re').removeClass(
			'col-lg-3');
	$('#org_unit_list_div .col-lg-3_re').addClass('col-md-12').removeClass(
			'col-md-6');
	$('#search_btn').addClass('col-md-12').removeClass('col-md-2');
	$('.dynamic_div_form').addClass('col-md-12').removeClass('col-md-3');
	$('.profileCard').addClass('employeeList-height')

	$('#left_main_tree').attr('class', 'col-md-0')
	$('#right_main_tree').attr('class', 'col-md-0')
	$('#animation_div').find('.col-md-9').css({'display':'none'});
	$('#org_unit_add_form_div').show();
	$('#org_unit_add_btn').hide();
	//org unit resize change
	$('#org_select_drp').attr('class', 'col-md-8').css({'float':'left','margin-left':'-15px'});
	$('#tree_3').css('width', '550px');
	form_status = 0;
}
$("#org_unit_add_btn").click(function() {
	$("#organization").val(select_org_id).trigger('change');
	org_btn_status = 1;
	button_create(1);
	view_form();
	search_tree("tree_3", "all",0);
//	clear_org_unit();
});

// 18-May-2018 || SAR || Add Exit Details Close Button Function
$("#org_unit_form_close").click(function() {
	if(form_status == 1){
		orgCloseFuncton('closeOrgUnit');
	}else{
		closeOrgUnit()
	}
});
//close button conform
function closeOrgUnit(){
	form_status = 0;
	org_btn_status = 0; 
	$('#org_unit_main_div > .col-md-3').addClass('col-md-12')
	.removeClass('col-md-3');
	$('#org_unit_list_div .col-lg-3_re').addClass('col-md-3')
	.removeClass('col-md-12');
	$('#search_btn').addClass('col-md-2').removeClass('col-md-12');
	$('.dynamic_div_form').addClass('col-md-12')
	.removeClass('col-md-12');
	$('#animation_div').attr('class', 'col-md-12')
	$('.profileCard').removeClass('employeeList-height')
	$('#left_main_tree').attr('class', 'col-md-4')
	$('#right_main_tree').attr('class', 'col-md-8')
	$('#org_unit_add_form_div').hide();
	$('#org_unit_add_btn').show();
	$('#org_select_drp').attr('class', 'col-md-3').removeAttr("style");
	$('#animation_div').find('.col-md-9').css({'display':'block'});
	$('#tree_3').css('width', '100%')
	org_unit_cancel();
}

 function org_unit_drop_down_function(org_id) 
{
	$.ajax({
		url : "/hrms_fetch_org_unit_parent_drop_down/", 
		type : "POST", 
		data : {"org_id":org_id},
		csrfmiddlewaretoken : $("input[name=csrfmiddlewaretoken]").val(),
		timeout : 10000, 
		async:false,
 	}).done( function(json_data) {
		data = JSON.parse(json_data);
		if(data.org_unit_info){
				$("#organization_unit_id").empty(); 
				$("#organization_unit_id").append("<option value='0' selected>--Select Org Unit--</option>");				
				for (var i=0;i<data.org_unit_info.length;i++)
				{
					$("#organization_unit_id").append("<option value='"+data.org_unit_info[i].id+"'>"+data.org_unit_info[i].orgunit_name+"</option>");
										
				}
		}
	});
}

$("#select_org_unit").on('click', function() {
	var org_val = $('#organization option:selected').val();
	if(org_val == '0'){
		alert_lobibox("info","Organization not selected");
		$('#org_unit_main_tree_empty').html('<div class="col-md-12"><h3 style="text-align: center;color:#e73d4a;">No data available.</h3></div>');
	}else{
		show_org_unit_popup(org_val);
	}	
});
function show_org_unit_popup(org_val){
	$('#organization_id_popup').val(org_val).trigger('change');
	$('#organization_id_popup').prop("disabled", true); 
	$('#org_tree_single').parent().hide();
	$('#org_tree_multi').parent().hide();
	$('#orgModal').modal('show');
	$("#organization_unit_type").val(0).trigger("change");
	$("#org_unit_save").click(function() {
		if(org_unit_name.length){
		org_unit_names =  org_unit_name;
		org_unit_ids =  org_unit_id;
		$("#organization_unit_id").empty();
		$("#organization_unit_id").html("<option value='0' selected>--Select Org Unit--</option>");
		$("#organization_unit_id").append("<option value='"+org_unit_ids[0]+"' selected>"+org_unit_names[0]+"</option>");
		//$('.errorTxt4').html('');
		} 
		
	});
}
function org_unit_create() {
	var isvalid = org_unit_form_validation();

	if (isvalid) {
		add_update("", "add");
	}
}
function org_unit_cancel() {
	button_create(1)
//	search_tree("tree_3", "all",0);
	$('.errorTxts').html('');
	$("#tree3_organization_id").val(select_org_id).trigger('change');
	clear_org_unit();
}
function org_unit_update() {
	var isvalid = org_unit_form_validation();
	if (isvalid) {
		add_update(parent_org_unit_id, "update");
	}
}
function org_unit_delete() {
	// var isvalid=org_unit_form_validation();
	if (parent_org_unit_id != 0) {
		var title = $('#organization_unit_name').val();
		removeConfirmation('add_update', parent_org_unit_id,title);
		// add_update(parent_org_unit_id,"remove");
	}
}

//cancel and clear
function cancelClearOrgUnit(){
	if(parent_org_unit_id != 0 ){
		var title = $('#organization_unit_name').val();
		orgClearFuncton('clear_org_unit_before','',title);
	}else{
		clear_org_unit();
	}
}

//form reset function here
function clear_org_unit() {
	// $('#organization_unit')[0].reset();
	$('#organization_unit_name').val("");
	$('#org_unit_address').val("");
	$('#org_organization_unit_type').val("0").trigger("change");
	$('#organization').val(select_org_id).trigger("change");
	$('#parent_org_unit_type').val("0").trigger("change");
	form_status = 0;
}


// form reset function here
function clear_org_unit_before() {
	button_create(1);
	clear_org_unit();
}

$('#parent_org_unit_type').on('change', function() {
	$('#parent_org_unit').val("");
	// $('#organization_unit_name').val("");
	// parent_org_unit_id=0;
	if ($('#organization').val() != 0) {
		search_tree("tree_2", "chose",0);
	}
})
function search_tree(tree_id, type,org_id) {
	if(org_id == 0){
		var organization = $('#organization').val();
	}else{
		var organization = org_id;
	}
	var parent_org_unit_type = $('#parent_org_unit_type').val();
	{
		$.ajax(
				{
					url : '/hrms_organization_unit_search/',
					type : 'POST',
					data : {
						'parent_org_unit_type' : parent_org_unit_type,
						'organization' : organization,
						'type' : type,
						csrfmiddlewaretoken : $(
								"input[name=csrfmiddlewaretoken]").val()
					},
					timeout : 10000,
					async : false,
				}).done(function(json_data) {
			var data = JSON.parse(json_data);
			org_code = data.code[0].code +1;
			data = data.vals;
			if (data) {
				data.map(function(value, index) {
					if (value.parent == 0) {
						value.parent = "#"
						value["icon"] = "nf nf-country";
					} else {
						value["icon"] = "nf nf-location";
					}
				});
				select_tree(data, tree_id)
			} else {
				$.jstree.destroy();
				// alert_status("ERR0009");
				$("#org_unit_main_tree_empty").show();
				$("#org_unit_main_tree").hide();
				//alert_lobibox("info", sysparam_datas_list['ERR0042']); 
			}
		});
	}
	function select_tree(data, tree_id) { 
		$('#tree_2').jstree("destroy").empty();
        if(tree_id=="tree_3"){
        	$.jstree.destroy();	
        }		
		//$.jstree.destroy();  
		var $treeview = $("#" + tree_id)
		$("#" + tree_id).jstree({
			'core' : {
				themes : {
					"variant" : "large",
					responsive : !1
				},
				'data' : data
			},
		}).on('loaded.jstree', function() {
			$treeview.jstree('open_all'); 
		})
		$("#"+tree_id).jstree(true).redraw(true);
		set_unit_data(tree_id)
	}
}
function set_unit_data(tree_id){
	       $("#"+tree_id).on('changed.jstree',function(e, data) {
				var i, j;
				for (i = 0, j = data.selected.length; i < j; i++) { 
					parent_org_unit_name = data.instance 
							.get_node(data.selected[i]).text;
					parent_org_unit_id = data.instance
							.get_node(data.selected[i]).id;
				} 
				if (tree_id == "tree_2") { 
					$('#parent_org_unit').val(parent_org_unit_name)
				} else if (tree_id == "tree_3") {
					org_unit_structure_changes(parent_org_unit_id)
				}// tree_3
				update_new_id=parent_org_unit_id;
			})
}
// org unit structure
function org_unit_structure_changes(parent_org_unit_id) {
	/* $('#org_unit_add_btn').trigger('click'); */ 
	button_create(0)
	view_form();
	$.ajax({
		url : '/hrms_organization_unit_crud/',
		type : 'POST',
		data : {
			'results' : '',
			'delete_id' : '',
			'org_unit_id' : parent_org_unit_id,
			csrfmiddlewaretoken : $("input[name=csrfmiddlewaretoken]").val()
		},
		timeout : 10000,
		async : false,
	}).done(function(json_data) {
		var data = JSON.parse(json_data);
		set_update_data(data.results)
	})
}
function set_update_data(data) { 
	if (data) {
		$('#organization').val(data[0].organization_id).trigger("change");
		if(data[0].parent_orgunit_id != 0){
			$('#organization_unit_name').val(data[0].orgunit_name);
			$('#org_unit_address').val(data[0].address);
			$('#organization_unit_code').val(data[0].orgunit_code);
			$('#org_organization_unit_type').val(data[0].orgunit_type_id).trigger("change");
			$('#organization_unit_id').val(data[0].parent_orgunit_id).trigger("change");
			//
			$('#parent_org_unit').val(data[0].parent_orgunit_name);
			
			update_parent_org_unit_id = data[0].parent_orgunit_id;
			button_create(0);
		}else{
			button_create(1);
		}
	}
}

function add_update(id, operation) {
	if (operation == undefined) {
		operation = "remove";
	}
	parent_org_unit_id=$('#organization_unit_id').val()
	var organization = $('#organization').val();
	var org_code = $('#organization_unit_code').val();
	var org_unit_name = $('#organization_unit_name').val();
	var org_unit_address = $('#org_unit_address').val();
	var org_organization_unit_type = $('#org_organization_unit_type').val();
	var parent_org_unit_type = $('#organization_unit_type').val();
	if (!parent_org_unit_type) {
		parent_org_unit_type = 0;
	}
	update_parent_org_unit_id=$('#organization_unit_id').val();
	if (!parent_org_unit_id) {
		parent_org_unit_id = 0;
	}
	if (id && operation == "update") {
		if (organization != 0 && org_unit_name != ''
				&& org_organization_unit_type != 0 && org_code != "") {
			org_create_data = {
				'organization' : organization,
				'org_unit_name' : org_unit_name,
				'org_unit_address' : org_unit_address,
				'org_organization_unit_type' : org_organization_unit_type,
				'parent_org_unit_type' : parent_org_unit_type,
				'parent_orgunit_id' : update_parent_org_unit_id,
				'org_code' : org_code
			}
		}
		var vals = {
			'results' : JSON.stringify(org_create_data),
			'delete_id' : '',
			'update_id' : update_new_id,
			'org_unit_id' : '',
			csrfmiddlewaretoken : $("input[name=csrfmiddlewaretoken]").val()
		}
		
	} else if (!id && operation == "add") {
		if (organization != 0 && org_unit_name != ''
				&& org_organization_unit_type != 0 && org_code != "") {
			org_create_data = {
				'organization' : organization,
				'org_unit_name' : org_unit_name,
				'org_unit_address' : org_unit_address,
				'org_organization_unit_type' : org_organization_unit_type,
				'parent_org_unit_type' : parent_org_unit_type,
				'parent_orgunit_id' : parent_org_unit_id,
				'org_code' : org_code
			}
		} else {
			// alert_status("ERR0009");
			alert_lobibox("error", sysparam_datas_list["ERR0009"]);
		}
		var vals = {
			'results' : JSON.stringify(org_create_data),
			'delete_id' : '',
			'update_id' : '',
			'org_unit_id' : '',
			csrfmiddlewaretoken : $("input[name=csrfmiddlewaretoken]").val()
		}
	} else if (id && operation == "remove") {
		if (update_new_id != 0) {
			var vals = {
				'results' : "",
				'delete_id' : update_new_id,
				'update_id' : '',
				'org_unit_id' : '',
				csrfmiddlewaretoken : $("input[name=csrfmiddlewaretoken]").val()
			}
		}
	}
	$.ajax({
		url : '/hrms_organization_unit_crud/',
		type : 'POST', 
		data : vals,
		timeout : 10000,
		async : false,
	}).done(function(json_data) {
		var data = JSON.parse(json_data);
		// alert_status(data.results)
		if (data.results=="ERR0503"){ 
			alert_lobibox("error", sysparam_datas_list[data.results]);		
		} 
		else{
			if(data.results == 'NTE_03'){
				button_create(1);
			}
			alert_lobibox("success", sysparam_datas_list[data.results]);	
		}
		//search_tree("tree_3", "all");
		org_unit_cancel();
	});
}
// jquery leave validation
jQuery.validator.addMethod('valueNotEquals', function(value) {
	return (value != '0');
}, "country required");


$('.select2').select2().change(function() {
	$('.errorTxts').html('');
});
$('#organization_unit').submit(function(e) {
	e.preventDefault();
}).validate({
	rules : {
		organization : {
			required : true,
			valueNotEquals : true,
		},
		title: {
			required:true,
			valueNotEquals:true,
		},
		organization_unit_code : {
			required : true,
		},
		org_unit_name : {
			required : true,
		},
		org_organization_unit_type : {
			required : true,
			valueNotEquals : true,
		},
		org_unit_address : {
			required : true,
		},
		organization_unit_id : {
			required : true,
			valueNotEquals : true,
		},
	},
	// For custom messages
	messages : {
		organization : {
			valueNotEquals : "Select Valid Organization",
			required: "Select Organization",
		},
		organization_unit_code : {
			required : "Enter Organization Unit Code",
		},
		org_unit_name : {
			required : "Enter Organization Unit Name",
		},
		org_organization_unit_type : {
			required: "Select Organization Unit Type",
			valueNotEquals : "Select Valid Organization Unit Type",
		},
		title: {
			required: "Select Title",
			valueNotEquals: "Select Valid Title", 
		},
		org_unit_address: {
			required: "Enter Organization Unit Address ",

		},
		organization_unit_id: {
			required: "Select Parent Organization",
			valueNotEquals: "Select Valid Parent Organization", 
		},

	},
	errorElement : 'div',
	errorPlacement : function(error, element) {
		var placement = $(element).data('error');
		if (placement) {
			$(placement).append(error)
		} else {
			error.insertAfter(element);
		}
	},
	ignore : []
});
// organization_unit form validations here
function org_unit_form_validation() {
	return $('#organization_unit').valid();
}

// button create function here
function button_create(status) {
	var access_for_create = jQuery.inArray( "Organization Unit", JSON.parse(localStorage.Create) );
	var access_for_write = jQuery.inArray( "Organization Unit", JSON.parse(localStorage.Write) );
	var access_for_delete = jQuery.inArray( "Organization Unit", JSON.parse(localStorage.Delete) );
	var strAppend = '';
	if (status == 1) {
		if (access_for_create != -1){
			strAppend = "<button type='button'id='organization_create' onclick='org_unit_create()' class='btn btn-success btn-eql-wid btn-animate'>Add</button>"
		}
		strAppend += " <button type='button'id='org_unit_clear' onclick='cancelClearOrgUnit()' class='btn btn-warning btn-animate btn-eql-wid btn-animate'>Cancel / Clear</button>"
			$('#org_unit_btn').html(strAppend);
	} else {
		if (access_for_write != -1){
			strAppend = "<button type='button' onclick='org_unit_update()' class='btn  btn-primary btn-eql-wid btn-animate '>Update</button>"
		}if (access_for_delete != -1){
			strAppend += " <button type='button' onclick='org_unit_delete()' class='btn btn-danger btn-eql-wid btn-animate '>Remove</button>"
		}
		strAppend += " <button type='button' onclick='cancelClearOrgUnit()' class='btn btn-warning btn-eql-wid btn-btn-animate'>Cancel / Clear</button>"
			$('#org_unit_btn').html(strAppend);
	}
}
