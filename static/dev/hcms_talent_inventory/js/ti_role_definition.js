//12-Feb-2018 || SMI || Main functions related to role definition
var tech_dept_msel_val=[];
var func_dept_msel_val=[];
var behv_dept_msel_val=[];

var role_def_columns = [{"title":"No."}, {"title":"Role Title"}, {"title":"Type"},
                        {"title":"Experience (Years)"},{"title":"Preferred Education"},{"title":"Reports To"}, {"title":"ID"}];

$(document).ready(function(){
	$("#rd_details_org").select2({
		placeholder: "-Select Organization-",
		width: '100%',
	}); 
	$("#rd_details_org_unit").select2({
		placeholder: "-Select Org. Units-",
		width: '100%',
	}); 
	$('#ti_rd_dept').multiselect({ nonSelectedText:'-Select Departments-'});
	$("#rd_details_type").select2({
		placeholder: "-Select Role Type-",
		width: '100%',
	}); 
	$("#rd_details_reps_to").select2({
		placeholder: "-Select Reports To Role-",
		width: '100%',
	});
	$("#rd_details_grade").select2({
		placeholder: "-Select Grades-",
		width: '100%',
	});
	$('.mul_scroll').prop("disabled",true);
	$('#rd_details_org_unit').prop("disabled",true);
	var index;

//	22-Feb-2018 || SMI ||	Add Method to jQuery Validator to check no space
	jQuery.validator.addMethod("noSpace", function(value, element) {
		return value == '' || value.trim().length != 0;
	}, "No space please");
	empty_datatable('ti_role_def_tbl',6);

});

//28-AUG-2018 || SMI || Organization - On select function
function org_onchange(org_id){
	$('#rd_details_org_unit').empty().append($('<option>',{
		value:'',
		text:'-Select Org. Unit-',
		hidden:'hidden',
	}));
	$.ajax({
		type: 'POST',
		url: '/ti_org_unit/',
		timeout : 10000,
		data: {
			'org_id': org_id,
		},
		async: false,
	}).done(function(json_data){
		data = JSON.parse(json_data);

		if (data.sel_org_unit != undefined){
			if (data.sel_org_unit.length > 0){
				$('#rd_details_org_unit').prop("disabled",false);
				for(i=0;i<data.sel_org_unit.length;i++)
				{
					$('#rd_details_org_unit').append($('<option>',{
						value:data.sel_org_unit[i].id,
						text:data.sel_org_unit[i].orgunit_name
					}))
				}
			} else {
				$('#rd_details_org_unit').prop("disabled",true);
			}
		}
	})
}

//06-SEP-2018 || MST || Department - On select function
function dept_onchange(org_unit_ids){
	if (org_unit_ids != null){
		$.ajax({
			type: 'POST',
			url: '/ti_dept/',
			timeout : 10000,
			data: {
				'org_unit_ids': JSON.stringify(org_unit_ids),
			},
			async: false,
		}).done(function(json_data){
			data = JSON.parse(json_data);
			if (data.sel_dept != undefined){
				if (data.sel_dept.length > 0){
					$('.mul_scroll').prop("disabled",false);
					var dropdown2OptionList = [];
					for(i=0;i<data.sel_dept.length;i++){
						dropdown2OptionList.push({
							'value':data.sel_dept[i].id,
							'label':data.sel_dept[i].name
						})
					}
					$('#ti_rd_dept').multiselect('dataprovider', dropdown2OptionList);
					$('#ti_rd_dept').multiselect({
						includeSelectAllOption: true
					});
				} else {
					$('.mul_scroll').prop("disabled",true);
				}
			}
		});
	} else {
		$('.mul_scroll').prop("disabled",true);
	}
}

function ti_role_def_tbl_formation() {
	plaindatatable_btn1('ti_role_def_tbl', [], role_def_columns, 6);
}

var $validator = $('#submit_form').validate({
	rules: {
		rd_details_title: {
			required: true,
			noSpace: true
		},
		rd_details_need: {
			required: true,
			noSpace: true
		},
		rd_details_type:{
			required:true
		},
		rd_details_org:{
			required:true
		},
		rd_details_org_unit:{
			required:true
		},
		ti_rd_dept:{
			required:true
		},
		rd_details_resp:{
			required:true,
			noSpace: true
		},
		rd_details_reps_to:{
			required:true
		},
		rd_details_grade:{
			required:true
		},
		rd_details_req_res:{
			required:true
		},
	},
	//For custom messages
	messages: {
		rd_details_title:{
			required:"Enter Role Title",
		},
		rd_details_need:{
			required:"Enter Role Need",
		},
		rd_details_type:{
			required:"Select Role Type",
		},
		rd_details_org:{
			required:"Select Organization",
		},
		rd_details_org_unit:{
			required:"Select Organization Units",
		},
		ti_rd_dept:{
			required:"Select Departments",
		},
		rd_details_resp:{
			required:"Enter Role Responsibilities",
		},
		rd_details_reps_to:{
			required:"Select Reports To Role",
		},
		rd_details_grade:{
			required:"Select Role Grades",
		},
		rd_details_req_res:{
			required:"Enter Required Number Of Resources",
		},
	},
	errorElement: 'div',
	errorPlacement: function(error, element) {
		var placement = $(element).data('error');
		if (placement) {
			$(placement).append(error);
		} else {
			error.insertAfter(element);
		}
	}
});

function role_def_next(){
	$("#btn_info").html('');
	var curent_li_id = $('.stage_active').attr('id'),
	prev_li = $('#' + curent_li_id).prevAll().length,
	btn_change = $('#' + curent_li_id).nextAll().length;
	if (btn_change == 1 || btn_change == 0) {
		$("#btn_info").html('FINISH').removeAttr('onclick').attr("onclick","stage_complete();");
	} else {
		$("#btn_info").html('NEXT');
	}
	$('.stage_active').removeClass('stage_active');
	if (prev_li == 0) {
		$('#' + curent_li_id).css({
			'display': 'inline-block',
			'width': '20%',
			'vertical-align': 'top',
			'border-right': 'none',
			'float': 'left',
			'height': '' + window_height + 'px',
			'overflow': 'hidden',
		});
		$('#' + curent_li_id).next().addClass('stage_active').css({
			'display': 'inline-block',
			'width': '80%',
			'vertical-align': 'top',
			'border-right': 'none',
			'float': 'left',
			'border-top': '1px solid #fbc460 ',
		});
		$('#tab2_full').css({'display':'block'});
		$('#tab2_primary').css({'display':'none'});
	} else {
		if (prev_li == 1) {
			$('#tab3_full').css({'display':'block'});
			$('#tab3_primary').css({'display':'none'});
		} else if (prev_li == 2) {
			$('#tab4_full').css({'display':'block'});
			$('#tab4_primary').css({'display':'none'});
		}
		var prev_li_ids = parseInt(curent_li_id) + 1;
		var dynamic_height = (window_height / parseInt(curent_li_id)).toFixed();
		$('#' + curent_li_id).closest('ul').css({
			'margin': '0px',
			'padding': '0px',
			'display': 'table',
			'position': 'relative',
		});
		$('#' + prev_li_ids).prevAll().removeAttr("style");
		$('#' + prev_li_ids).prevAll().css({
			'height': '' + dynamic_height + 'px',
			'border-right': 'none',
			'vertical-align': 'top',
			'overflow': 'hidden',
		});
		$('#' + curent_li_id).next().addClass('stage_active').css({
			'display': 'table-cell',
			'width': '80%',
			'border-right': 'none',
			'vertical-align': 'top',
			'border-top': '1px solid #fbc460',
		});
		$('#ti_kpo_edit_table_wrapper > div.table-scrollable').css({'width':'auto'});
	}
}

function ti_nextStepWizard(){
	index = $('.stage_active').attr('id');
	var $valid = $('#submit_form').valid();
	var tech_dept_msel;
	var func_dept_msel;
	var behv_dept_msel;
	var tech_dept_sel_vals=[];
	var func_dept_sel_vals=[];
	var behv_dept_sel_vals=[];

	$('#rd_skill_set_tech_tbl').DataTable().destroy();
	$('#rd_skill_set_func_tbl').DataTable().destroy();
	$('#rd_skill_set_behv_tbl').DataTable().destroy();

	var tech_data_tbl = document.getElementById("rd_skill_set_tech_tbl_tbody");
	tech_data_tbl = $(tech_data_tbl).find('input:checkbox[name^=rd_ss_tech_applicable]');

	for (i = 0; i < tech_data_tbl.length; i++){
		if (tech_data_tbl[i].checked == true){
			var tech_cname = tech_data_tbl[i].name;
			tech_id = tech_cname.split("rd_ss_tech_applicable");
			tech_dept_msel = $('input[name="'+tech_cname+'"]').closest('tr').find('.comp_dept').val();
			$('.rd_ss_tech_dept'+tech_id[1]+'').next("div").find('button').prop("disabled", false);
			tech_dept_sel_vals.push([$('.rd_ss_tech_dept'+tech_id[1]+'').selector, tech_dept_msel]);
		} 
	}

	var func_data_tbl = document.getElementById("tab_skillset_func_tbl_tbody");
	func_data_tbl = $(func_data_tbl).find('input:checkbox[name^=rd_ss_func_applicable]');
	for (i = 0; i < func_data_tbl.length; i++){
		if (func_data_tbl[i].checked == true){
			var func_cname = func_data_tbl[i].name;
			func_id = func_cname.split("rd_ss_func_applicable");
			func_dept_msel = $('input[name="'+func_cname+'"]').closest('tr').find('.comp_dept').val();
			$('.rd_ss_func_dept'+func_id[1]+'').next("div").find('button').prop("disabled", false);
			func_dept_sel_vals.push([$('.rd_ss_func_dept'+func_id[1]+'').selector, func_dept_msel]);
		} 
	}

	var behv_data_tbl = document.getElementById("tab_skillset_behv_tbl_tbody");
	behv_data_tbl = $(behv_data_tbl).find('input:checkbox[name^=rd_ss_behv_applicable]');
	for (i = 0; i < behv_data_tbl.length; i++){
		if (behv_data_tbl[i].checked == true){
			var behv_cname = behv_data_tbl[i].name;
			behv_id = behv_cname.split("rd_ss_behv_applicable");
			behv_dept_msel = $('input[name="'+behv_cname+'"]').closest('tr').find('.comp_dept').val();
			$('.rd_ss_behv_dept'+behv_id[1]+'').next("div").find('button').prop("disabled", false);
			behv_dept_sel_vals.push([$('.rd_ss_behv_dept'+behv_id[1]+'').selector, behv_dept_msel]);
		} 
	}

	var ti_rd_dept_text=$("#ti_rd_dept").find(":selected").map(function(){
		return $(this).text();
	}); 
	var ti_rd_dept_value=$("#ti_rd_dept").find(":selected").map(function(){
		return $(this).val();
	});

	var dept_vals = [];
	for (var i = 0; i < ti_rd_dept_value.length; i++){
		dept_vals.push([ti_rd_dept_value[i], ti_rd_dept_text[i]]);
	}

	$(".comp_dept").multiselect('destroy');
	var dropdown2OptionList = [];
	$('.comp_dept').multiselect({
		includeSelectAllOption: true,
	});
	for(i=0;i<dept_vals.length;i++){
		dropdown2OptionList.push({
			'value':dept_vals[i][0],
			'label':dept_vals[i][1]
		})
	}

	$('.comp_dept').multiselect('dataprovider', dropdown2OptionList);
	$('#rd_skill_set_tech_tbl,#rd_skill_set_func_tbl,#rd_skill_set_behv_tbl').find('button').prop('disabled',true);

	for (i = 0; i < tech_data_tbl.length; i++){
		if (tech_data_tbl[i].checked == true){
			var tech_cname = tech_data_tbl[i].name;
			tech_id = tech_cname.split("rd_ss_tech_applicable");
			tech_dept_msel = $('input[name="'+tech_cname+'"]').closest('tr').find('.comp_dept').val();
			$('.rd_ss_tech_dept'+tech_id[1]+'').next("div").find('button').prop("disabled", false);
		} 
	}

	for (i = 0; i < func_data_tbl.length; i++){
		if (func_data_tbl[i].checked == true){
			var func_cname = func_data_tbl[i].name;
			func_id = func_cname.split("rd_ss_func_applicable");
			func_dept_msel = $('input[name="'+func_cname+'"]').closest('tr').find('.comp_dept').val();
			$('.rd_ss_func_dept'+func_id[1]+'').next("div").find('button').prop("disabled", false);
		} 
	}

	for (i = 0; i < behv_data_tbl.length; i++){
		if (behv_data_tbl[i].checked == true){
			var behv_cname = behv_data_tbl[i].name;
			behv_id = behv_cname.split("rd_ss_behv_applicable");
			behv_dept_msel = $('input[name="'+behv_cname+'"]').closest('tr').find('.comp_dept').val();
			$('.rd_ss_behv_dept'+behv_id[1]+'').next("div").find('button').prop("disabled", false);
		} 
	}
	if (tech_dept_sel_vals.length > 0){
		for(var i=0;i<tech_dept_sel_vals.length;i++){
			vals = tech_dept_sel_vals[i][1];
			for(var j in vals) {
				var tech_optionVal = vals[j];
				$(''+tech_dept_sel_vals[i][0]+'').find("option[value="+tech_optionVal+"]").prop("selected", "selected");
			}
			$(''+tech_dept_sel_vals[i][0]+'').multiselect("refresh");
		}
	}

	if (func_dept_sel_vals.length > 0){
		for(var i=0;i<func_dept_sel_vals.length;i++){
			vals = func_dept_sel_vals[i][1];
			for(var k in vals) {
				var func_optionVal = vals[k];
				$(''+func_dept_sel_vals[i][0]+'').find("option[value="+func_optionVal+"]").prop("selected", "selected");
			}
			$(''+func_dept_sel_vals[i][0]+'').multiselect("refresh");
		}
	}

	if (behv_dept_sel_vals.length > 0){
		for(var i=0;i<behv_dept_sel_vals.length;i++){
			vals = behv_dept_sel_vals[i][1];
			for(var l in vals) {
				var behv_optionVal = vals[l];
				$(''+behv_dept_sel_vals[i][0]+'').find("option[value="+behv_optionVal+"]").prop("selected", "selected");
			}
			$(''+behv_dept_sel_vals[i][0]+'').multiselect("refresh");
		}
	}

	basic_datatable('rd_skill_set_tech_tbl');
	basic_datatable('rd_skill_set_func_tbl');
	basic_datatable('rd_skill_set_behv_tbl');

	if(!$valid) {
		if (index == 1){
			$('.val_message').prop('style', 'display:block;');
			$validator.focusInvalid();
			return false;
		}
		if (index == 2){
			$('.val_message').prop('style', 'display:block;');
			$validator.focusInvalid();
			return false;
		}
		if (index == 3){
			$('.val_message').prop('style', 'display:block;');
			$validator.focusInvalid();
			return false;
		}
	} else {
		if (index == 1){
			var role_exist = "";
			if (ti_role_def_id == ''){
				var role_title_val = document.getElementById("rd_details_title").value;
				$.ajax({
					url : '/ti_role_title_check/',
					type : 'POST', 
					async : false,
					data : {
						'role_title_val': role_title_val
					},   
					timeout : 10000,
				}).done(function(json_data){
					json_data = JSON.parse(json_data);
					if (json_data.role_title_exist.length > 0){
						role_exist = "yes";
					}
					else{
						role_exist = "no";
					}
				});
				if (role_exist == "yes"){
					alert_lobibox("error", sysparam_datas_list["ERR0016"]);
					return false;
				} else {
					role_def_next();
				}
			} else {
				role_def_next();
			}
			var rd_details_title = $("#rd_details_title").val();
			var rd_details_type = $("#rd_details_type option:selected").text();
			$("#rd_details_title_1").val(rd_details_title);
			$("#rd_details_type_1").val(rd_details_type);
			$('#tab1_full').css({'display':'none'});
			$('#tab1_primary').css({'display':'block'});
		}
		if (index == 2){
			rd_skill_set_tech_table.search( '' ).columns().search( '' ).draw(); //23-Mar-2018 || SMI || Clear the search Filter - Technical Comp
			$('#rd_skill_set_tech_tbl').DataTable().destroy();
			var tech_hasvalue = "";
			var tech_data_tbl = document.getElementById("rd_skill_set_tech_tbl_tbody");
			tech_data_tbl = $(tech_data_tbl).find('input:checkbox[name^=rd_ss_tech_applicable]');
			for (i = 0; i < tech_data_tbl.length; i++){
				if (tech_data_tbl[i].checked == true){
					var tech_cname = tech_data_tbl[i].name;
					tech_id = tech_cname.split("rd_ss_tech_applicable");
					tech_dept_msel = $('input[name="'+tech_cname+'"]').closest('tr').find('.comp_dept').val();
					tech_dept = $('.rd_ss_tech_dept'+tech_id[1]+'').selector
					tech_dept = tech_dept.split('.')[1]

					tech_dept_msel_val.push({
						tech_dept: tech_dept,
						tech_value: tech_dept_msel
					});
					if ($("input[name='rd_ss_tech_lvl"+tech_id[1]+"']:checked").val() && tech_dept_msel != null){
						tech_hasvalue = "tech_hasvalue";
					} else {
						tech_hasvalue = "";
						break;
					}
				}
			}
			basic_datatable('rd_skill_set_tech_tbl');
			rd_skill_set_func_table.search( '' ).columns().search( '' ).draw(); //23-Mar-2018 || SMI || Clear the search Filter - Functional Comp
			$('#rd_skill_set_func_tbl').DataTable().destroy();
			var func_hasvalue = "";
			var func_data_tbl = document.getElementById("tab_skillset_func_tbl_tbody");
			func_data_tbl = $(func_data_tbl).find('input:checkbox[name^=rd_ss_func_applicable]');
			for (i = 0; i < func_data_tbl.length; i++){
				if (func_data_tbl[i].checked == true){
					var func_cname = func_data_tbl[i].name;
					func_id = func_cname.split("rd_ss_func_applicable");
					func_dept_msel = $('input[name="'+func_cname+'"]').closest('tr').find('.comp_dept').val();
					func_dept = $('.rd_ss_func_dept'+func_id[1]+'').selector
					func_dept = func_dept.split('.')[1]

					func_dept_msel_val.push({
						func_dept: func_dept,
						func_value: func_dept_msel
					});

					if ($("input[name='rd_ss_func_lvl"+func_id[1]+"']:checked").val() && func_dept_msel != null){
						func_hasvalue = "func_hasvalue";
					} else {
						func_hasvalue = "";
						break;
					}
				}
			}
			basic_datatable('rd_skill_set_func_tbl');
			rd_skill_set_behv_table.search( '' ).columns().search( '' ).draw(); //23-Mar-2018 || SMI || Clear the search Filter - Behavioral Comp
			$('#rd_skill_set_behv_tbl').DataTable().destroy();
			var behv_hasvalue = "";
			var behv_data_tbl = document.getElementById("tab_skillset_behv_tbl_tbody");
			behv_data_tbl = $(behv_data_tbl).find('input:checkbox[name^=rd_ss_behv_applicable]');
			for (i = 0; i < behv_data_tbl.length; i++){
				if (behv_data_tbl[i].checked == true){
					var behv_cname = behv_data_tbl[i].name;
					behv_id = behv_cname.split("rd_ss_behv_applicable");
					behv_dept_msel = $('input[name="'+behv_cname+'"]').closest('tr').find('.comp_dept').val();
					behv_dept = $('.rd_ss_behv_dept'+func_id[1]+'').selector
					behv_dept = behv_dept.split('.')[1]

					behv_dept_msel_val.push({
						behv_dept: behv_dept,
						behv_value: behv_dept_msel
					});

					if ($("input[name='rd_ss_behv_lvl"+behv_id[1]+"']:checked").val() && behv_dept_msel != null){
						behv_hasvalue = "behv_hasvalue";
					} else {
						behv_hasvalue = "";
						break;
					}
				}
			}
			basic_datatable('rd_skill_set_behv_tbl');
			if (tech_hasvalue == ""){
				alert_lobibox("error", sysparam_datas_list["NTE_08"]);
				return false;
			}
			else if (func_hasvalue == ""){
				alert_lobibox("error", sysparam_datas_list["NTE_09"]);
				return false;
			}
			else if (behv_hasvalue == ""){
				alert_lobibox("error", sysparam_datas_list["NTE_10"]);
				return false;
			}
			else if(tech_hasvalue != "" && func_hasvalue != "" && behv_hasvalue != ""){
				role_def_next();
			}
			$('#rd_skill_set_tech_tbl').DataTable().destroy();
			var tech_data_tbl = document.getElementById("rd_skill_set_tech_tbl_tbody");
			var tech_chk_len = $(tech_data_tbl).find('input:checkbox[name^=rd_ss_tech_applicable]:checked').length;
			$('#tech_span').text(tech_chk_len);
			rd_skill_set_tech_table = basic_datatable('rd_skill_set_tech_tbl');
			$('#rd_skill_set_func_tbl').DataTable().destroy();
			var func_data_tbl = document.getElementById("tab_skillset_func_tbl_tbody");
			var func_chk_len = $(func_data_tbl).find('input:checkbox[name^=rd_ss_func_applicable]:checked').length;
			$('#func_span').text(func_chk_len);
			rd_skill_set_func_table = basic_datatable('rd_skill_set_func_tbl');
			$('#rd_skill_set_behv_tbl').DataTable().destroy();
			var behv_data_tbl = document.getElementById("tab_skillset_behv_tbl_tbody");
			var behv_chk_len = $(behv_data_tbl).find('input:checkbox[name^=rd_ss_behv_applicable]:checked').length;
			$('#behv_span').text(behv_chk_len);
			rd_skill_set_behv_table = basic_datatable('rd_skill_set_behv_tbl');
			$('#tab2_full').css({'display':'none'});
			$('#tab2_primary').css({'display':'block'});
		}
		if (index == 3){
			role_def_next();
			var rd_csf_txt = $('.rd_csf_text:eq(0)').val();
			$('#rd_csf_txt').val(rd_csf_txt);
			$('#tab3_full').css({'display':'none'});
			$('#tab3_primary').css({'display':'block'});
		}
		if (index == 4){
			var ti_kpo_edit_table = $('#ti_kpo_edit_table').DataTable();
			if ( ! ti_kpo_edit_table.data().count() ) {
				alert_lobibox("error", sysparam_datas_list["NTE_24"]);
				return false;
			} else {
				var kpo_tbl_rows = $('#ti_kpo_edit_table').find('tbody').find('tr');
				var unsaved_data = false;
				for (var i = 0; i < kpo_tbl_rows.length; i++) {
					var td_edit_data = $(kpo_tbl_rows[i]).find('td:eq(5)').html();
					if (td_edit_data.includes('<i class="fa fa-floppy-o"></i>')){
						unsaved_data = true;
					}
				}
				if(unsaved_data==true){
					alert_lobibox("error", sysparam_datas_list["NTE_28"]);
					return false;
				} else {
					role_def_next();
				}
			}
			var kpo_tbl_rows_len = kpo_tbl_rows.length;
			$('#kpo_span').text(kpo_tbl_rows_len);
			$('#tab4_full').css({'display':'none'});
			$('#tab4_primary').css({'display':'block'});
		}
	}
}

$('.aw-accordion .ti_accordionsub').click(function () {
	$("#btn_info").html('');
	$('#form_wizard_ul').children('li').removeClass('stage_active').removeAttr("style");
	$(this).nextAll().attr("style", "display: none !important");
	var total_li = $('#form_wizard_ul').children('li').length,
	next_li = $(this).nextAll().length,
	prev_li = $(this).prevAll().length,
	curr_pos = $(this).index();

	if (curr_pos == (parseInt(total_li) - 1)) {
		$("#btn_info").html('FINISH').removeAttr('onclick').attr("onclick","stage_complete();");
	} else {
		$("#btn_info").html('NEXT').removeAttr('onclick').attr("onclick","ti_nextStepWizard();");
	}
	if (prev_li == 0) {
		$(this).addClass('stage_active').css({
			'display': 'block',
			'width': '100%'
		});
		$('#tab1_full').css({'display':'block'});
		$('#tab1_primary').css({'display':'none'});
	} else if (prev_li == 1) {
		$(this).prevAll().css({
			'width': '20%',
			'vertical-align': 'top',
			'border-right': 'none',
			'float': 'left',
			'height': '' + window_height + 'px',
			'overflow': 'hidden',
		});
		$(this).addClass('stage_active').css({
			'display': 'inline-block',
			'width': '80%',
			'vertical-align': 'top',
			'border-right': 'none',
			'float': 'left',
		});
		$('#tab2_full').css({'display':'block'});
		$('#tab2_primary').css({'display':'none'});
	} else {
		if (prev_li == 2) { 
			$('#tab3_full').css({'display':'block'});
			$('#tab3_primary').css({'display':'none'});
		}
		if (prev_li == 3) { 
			$('#tab4_full').css({'display':'block'});
			$('#tab4_primary').css({'display':'none'});
		}
		var dynamic_height = (window_height / parseInt(curr_pos)).toFixed();
		$(this).prevAll().css({

			'height': '' + dynamic_height + 'px',
			'border-right': 'none',
			'vertical-align': 'top',
			'overflow': 'hidden',
		});
		$(this).addClass('stage_active').css({
			'display': 'table-cell',
			'width': '80%',
			'border-right': 'none',
			'vertical-align': 'top',

		});
		$('#ti_kpo_edit_table_wrapper > div.table-scrollable').css({'width':'auto'});
	}
});

function stage_complete() {
	$('#rd_skill_set_tech_tbl').DataTable().destroy();
	$('#rd_skill_set_func_tbl').DataTable().destroy();
	$('#rd_skill_set_behv_tbl').DataTable().destroy();
	var ti_kpi_edit_table = $('#ti_kpi_edit_table').DataTable();
	if ( ! ti_kpi_edit_table.data().count() ) {
		alert_lobibox("error", sysparam_datas_list["NTE_27"]);
		return false;
	} else {
		var kpi_tbl_rows = $('#ti_kpi_edit_table').find('tbody').find('tr');
		var unsaved_data = false;
		for (var i = 0; i < kpi_tbl_rows.length; i++) {
			var td_edit_data = $(kpi_tbl_rows[i]).find('td:eq(6)').html();
			if (td_edit_data.includes('<i class="fa fa-floppy-o"></i>')){
				unsaved_data = true;
			}
		}
		if(unsaved_data==true){
			alert_lobibox("error", sysparam_datas_list["NTE_28"]);
			return false;
		} else {
			var $valid = $('#submit_form').valid();
			if(!$valid){
				return false;
			} else {
				var ti_rd_form_data = getFormValues('#submit_form');
				var ti_rd_org_units = $("#rd_details_org_unit").val();
				var ti_rd_role_grades = $("#rd_details_grade").val();
				var ti_rd_org_units = $("#rd_details_org_unit").val();
				var ti_rd_dept = $("#ti_rd_dept").val();

				for(var i in tech_dept_msel_val){ 
					dept_name = tech_dept_msel_val[i].tech_dept;
					dept_val = tech_dept_msel_val[i].tech_value;
					ti_rd_form_data[dept_name] = dept_val;
				}

				for(var j in func_dept_msel_val){ 
					dept_name = func_dept_msel_val[j].func_dept;
					dept_val = func_dept_msel_val[j].func_value;
					ti_rd_form_data[dept_name] = dept_val;
				}

				for(var k in behv_dept_msel_val){ 
					dept_name = behv_dept_msel_val[k].behv_dept;
					dept_val = behv_dept_msel_val[k].behv_value;
					ti_rd_form_data[dept_name] = dept_val;
				}
				//16-Feb-2018 || MST || Submit form and Insert functionality for KPO and KPI

				// KPO table details
				var kpo_table = document.getElementById('ti_kpo_edit_table');
				var kpo_table_row_length = kpo_table.rows.length;
				var kpo_data_list = [];
				for (i = 1; i < kpo_table_row_length; i++){
					var temp_list = [];
					var t_rows = kpo_table.rows.item(i).cells;
					var rows_length = t_rows.length;
					for(var j = 0; j < rows_length-1; j++){
						var td_val = t_rows.item(j).innerHTML;
						temp_list.push(td_val);
					}
					kpo_data_list.push(temp_list);
				}

				// KPI table details
				var kpi_table = document.getElementById('ti_kpi_edit_table');
				var kpi_table_row_length = kpi_table.rows.length;
				var kpi_data_list = [];
				for (i = 1; i < kpi_table_row_length; i++){
					var temp_list = [];
					var t_rows = kpi_table.rows.item(i).cells;
					var rows_length = t_rows.length;
					for(var j = 0; j < rows_length; j++){
						var td_val = t_rows.item(j).innerHTML;
						temp_list.push(td_val);
					}
					kpi_data_list.push(temp_list);
				}
				// AJAX call for data insertion
				$.ajax({
					url : '/ti_role_def_create/',
					type : 'POST',
					timeout : 10000,
					data : {
						'ti_role_def_id' : ti_role_def_id,
						'ti_rd_form_data': JSON.stringify(ti_rd_form_data),
						'ti_rd_role_grades': JSON.stringify(ti_rd_role_grades),
						'kpo_data_list': JSON.stringify(kpo_data_list),
						'kpi_data_list': JSON.stringify(kpi_data_list),
						'ti_rd_org_units': JSON.stringify(ti_rd_org_units),
						'ti_rd_dept': JSON.stringify(ti_rd_dept),
					},
				}).done(function(json_data){
					json_data = JSON.parse(json_data);
					if (json_data.status == "NTE_02") {
						alert_lobibox("error", sysparam_datas_list[json_data.status]);
					} else if (json_data.status == "ERR0016") {
						alert_lobibox("error", sysparam_datas_list[json_data.status]);
					} else if (json_data.status == "NTE_01") {
						alert_lobibox("success", sysparam_datas_list[json_data.status]);
						reports_to_update();
						cancel_clear();
						$("#role_title_search").val('');
						$('#ti_role_def_tbl').DataTable().destroy();
						empty_datatable('ti_role_def_tbl',6);
					} else if (json_data.status == "NTE_03") {
						alert_lobibox("success", sysparam_datas_list[json_data.status]);
						reports_to_update();
						cancel_clear();
						$("#role_title_search").val('');
						$("#ti_role_def_tbl").empty();
						$('#ti_role_def_tbl').DataTable().destroy();
						empty_datatable('ti_role_def_tbl',6);
					} 
					else {
						alert_lobibox("error", sysparam_datas_list[json_data.status]);
					}
				})
				return true;
			}
		}
	}
	rd_skill_set_tech_table = basic_datatable('rd_skill_set_tech_tbl'); // 12-Feb-2018 || SMI || Data Table Formation for Technical Competencies
	rd_skill_set_func_table = basic_datatable('rd_skill_set_func_tbl'); // 12-Feb-2018 || SMI || Data Table Formation for Functional Competencies
	rd_skill_set_behv_table = basic_datatable('rd_skill_set_behv_tbl'); // 12-Feb-2018 || SMI || Data Table Formation for Functional Competencies
};

function rd_remove(){
	$.ajax({
		url : '/ti_role_def_delete/',
		type : 'POST',
		timeout : 10000,
		data : {
			'ti_role_def_id' : ti_role_def_id,
		},
	}).done(function(json_data){
		json_data = JSON.parse(json_data);
		if (json_data.status == "NTE_04"){
			alert_lobibox("success", sysparam_datas_list[json_data.status]);
			ti_role_def_table=$('#ti_role_def_tbl').DataTable();
			ti_role_def_table.clear().draw();
			$('#ti_role_def_tbl').DataTable().destroy();
			ti_role_def_tbl_formation();
			$("#role_title_search").val('');
			cancel_clear();
			reports_to_update();
		} else {
			alert_lobibox("error", sysparam_datas_list[json_data.status]);
			cancel_clear();
		}
	})
}

//23-Feb-2018 || MST || Function to reset the form wizard
//02-Feb-2018 || SMI || Wizard reset to first step
//12-Feb-2018 || SMI || Cancel / Clear Confirmation box added

function cancel_clear_confirm(func_name,action_name) {
	var ti_rd_form_data = getFormValues('#submit_form');
	if (ti_rd_form_data.rd_details_org=="" && ti_rd_form_data.rd_details_title=="" && ti_rd_form_data.rd_details_need=="" && ti_rd_form_data.rd_details_resp==""){
		cancel_clear();
	} else {
		swal ({
			title: "Are you sure, you want to cancel?",
			type: "warning",
			showCancelButton: true,
			confirmButtonClass: "btn btn-success btn-eql-wid btn-animate",
			cancelButtonClass: "btn btn-danger btn-eql-wid btn-animate",
			confirmButtonText: "Yes",
			cancelButtonText: "No",
			closeOnConfirm: true,
			closeOnCancel: true
		},
		function(isConfirm) {
			if (isConfirm) {
				if (action_name) {
					window[func_name](action_name);
				} else {
					window[func_name]();
				}
			} 
		});
	}
}

function cancel_clear(){
	ti_role_def_id = '';
	$('#tab1_full').css({'display':'block'});
	$('#tab1_primary').css({'display':'none'});
	$('#rd_details_title').val('');
	$('#rd_details_type').val(null).trigger('change');
	$('#rd_details_exp').val('');
	$('#rd_details_pref_edu').val('');
	$('#rd_details_need').val('');
	$('#ti_rd_dept').multiselect("clearSelection");
	$('.mul_scroll').prop("disabled",true);
	$('#rd_details_resp').val('');
	$('#rd_details_reps_to').val(null).trigger('change');
	$('#rd_details_org').val(null).trigger('change');
	$('#rd_details_org_unit').val(null).trigger('change');
	$('#rd_details_org_unit').prop('disabled', true);
	$('#rd_details_grade').val(null).trigger('change');
	$('#rd_details_req_res').val('');
	$('.val_message').prop('style','display:none;');
	var rd_rep_to_list = $('#rd_details_reps_to option').length;
	if (rd_rep_to_list > 1){
		$('#rd_details_reps_to').attr("disabled", false);
	} else if(rd_rep_to_list <= 1) {
		$('#rd_details_reps_to').attr("disabled", true);
	}
	$("#rd_skill_set_tech_tbl").dataTable().fnDestroy();
	$("#rd_skill_set_func_tbl").dataTable().fnDestroy();
	$("#rd_skill_set_behv_tbl").dataTable().fnDestroy();
	$(".mt-radio-inline").each(function(){
		if ($('input[type="radio"]').is(':checked') ){
			$('input[type="radio"]').prop('checked',false);
			jQuery('input[type="radio"]').prop("disabled", true);
		}
	});
	$(".mt-checkbox-inline").each(function(){
		if ($('input[type="checkbox"]').is(':checked') ){
			$('input[type="checkbox"]').prop('checked',false);
		}
	});
	basic_datatable('rd_skill_set_tech_tbl');
	basic_datatable('rd_skill_set_func_tbl');
	basic_datatable('rd_skill_set_behv_tbl');

	$("#rd_details_travel1").prop("checked", false);
	$("#rd_details_travel2").prop("checked", true);
	$("#rd_details_travel1").prop("disabled", false);
	$("#rd_details_travel2").prop("disabled", false);

	document.getElementById('rd_csf_text_div').innerHTML= '';
	document.getElementById('rd_csf_text_div').innerHTML= '<div id="rd_csf_text_in" class="col-md-12 margin-bottom-10"> <input type="text" class="form-control rd_csf_text" id="rd_csf_text1" name="rd_csf_text1" required="required" /></div>';

	$("#ti_kpo_edit_table").dataTable().fnDestroy();
	$("#ti_kpo_edit_table").empty();
	var columns = [{"title":"Statement"}, {"title":"Expected Outcome"}, {"title":"Target Duration"},
	               {"title":"Performance Standard"},{"title":"Plan"},{"title":"Action"}]
	editable_datatable1('ti_kpo_edit_table', '', 'ti_kpo_add_new_1', columns)

	$("#ti_kpi_edit_table").dataTable().fnDestroy();
	$("#ti_kpi_edit_table").empty();
	var columns = [{"title":"KPI"}, {"title":"Target"}, {"title":"Target Type"},
	               {"title":"Starting Performance"},{"title":"Measure Frequency"},
	               {"title":"Customer Rating Scheme"},{"title":"Action"}]
	editable_datatable1('ti_kpi_edit_table', '', 'ti_kpi_add_new_1', columns);
	$("#btn_info").html('');
	$('#form_wizard_ul').children('li').removeClass('stage_active').removeAttr("style").attr("style", "display: none !important");
	$('#form_wizard_ul').children('li:eq(0)').addClass('stage_active').css({
		'display': 'block',
		'width': '100%'
	});
	$("#wiz_btn_div").html("");
	var wiz_update_buttons = '<button type="button" onclick="cancel_clear_confirm(\''+"cancel_clear"+'\');" class="ti_custom_wizard_btn btn btn-warning btn-eql-wid btn-animate pull-right">CANCEL / CLEAR</button>';
	wiz_update_buttons += '<button type="button" onclick="ti_nextStepWizard();" id="btn_info" class="ti_custom_wizard_btn btn btn-animate btn-success btn-eql-wid pull-right">NEXT</button>';
	$("#wiz_btn_div").html(wiz_update_buttons);
	jQuery("li", $("#rd_skill_set")).removeClass("active");
	jQuery("li:eq(0)", $("#rd_skill_set")).addClass("active");
	jQuery(".tab-pane", $("#rd_skill_set")).removeClass("active");
	jQuery(".tab-pane:eq(0)", $("#rd_skill_set")).addClass("active");
};


var elem = document.getElementById('role_title_search');
elem.addEventListener('keypress', function(e){
	if (e.keyCode == 13) {
		RoleTitleList();
	}
});

//22-Mar-2018 || MST || Updated for hidding buttons when there is no data

function RoleTitleList(){
	var role_title = $('#role_title_search').val();
	if (role_title.length == 0){
		ti_role_def_table=$('#ti_role_def_tbl').DataTable();
		ti_role_def_table.clear().draw();
		$("#ti_role_def_tbl").DataTable().destroy();
		empty_datatable('ti_role_def_tbl',6);
		alert_lobibox("warning", "Please enter a search string");
	}
	else {
		$.ajax({
			url : '/ti_role_type_fetch/',
			type : 'POST', 
			data : {
				'search_word': role_title
			},   
			timeout : 10000,
		}).done(function(json_data){
			json_data = JSON.parse(json_data);
			data_list = [];
			if (json_data.role_type.length > 0){
				for(var i=0;i<json_data.role_type.length;i++) 
				{
					data_list.push([i+1, json_data.role_type[i].role_title, json_data.role_type[i].type,
					                json_data.role_type[i].role_req_work_exp, json_data.role_type[i].role_pref_edu, 
					                json_data.role_type[i].reports_to, json_data.role_type[i].id ]);
				}
				plaindatatable_btn1('ti_role_def_tbl', data_list, role_def_columns, 6);
			}
			else{
				ti_role_def_table=$('#ti_role_def_tbl').DataTable();
				ti_role_def_table.clear().draw();
				$("#ti_role_def_tbl").DataTable().destroy();
				empty_datatable('ti_role_def_tbl',6);
				alert_lobibox("warning", sysparam_datas_list["ERR0012"]);
			}
		});
	}
}

//15-Feb-2018 || MST || Role Details Table Formation
//20-Feb-2018 || SMI || Role Details Table Formation, Data Fetch and Display -Integration

var ti_role_def_id = '';

$('#ti_role_def_tbl tbody').on('click', 'tr', function () {
	cancel_clear();
	$("#wiz_btn_div").html("");
	var wiz_update_buttons = '<button type="button" onclick="cancel_clear_confirm(\''+"cancel_clear"+'\');" class="ti_custom_wizard_btn btn btn-warning btn-eql-wid btn-animate pull-right">CANCEL / CLEAR</button>';
	wiz_update_buttons += '<button type="button" onclick="removeConfirmation(\''+"rd_remove"+'\')" id="remove_btn" class="ti_custom_wizard_btn btn btn-danger btn-eql-wid btn-animate pull-right">REMOVE</button>';
	wiz_update_buttons += '<button type="button" onclick="ti_nextStepWizard();" id="btn_info" class="ti_custom_wizard_btn btn btn-animate btn-success btn-eql-wid pull-right">NEXT</button>';
	$("#wiz_btn_div").html(wiz_update_buttons);
	var ti_role_def_table = $('#ti_role_def_tbl').DataTable();
	row_no = ti_role_def_table.row(this).index();
	var data = ti_role_def_table.row(this).data();
	console.log(data);
	ti_role_def_id = data[6];
	$.ajax({
		url : "/ti_role_details_view/",
		type : "POST",
		data : {
			'id_val': ti_role_def_id
		},
		timeout : 10000,
	}).done( function(json_data) {
		json_data = JSON.parse(json_data);


		if (json_data.ti_role_details[0]){
			$("#role_title_header").html('');
			$("#role_title_header").append("[ "+json_data.ti_role_details[0].role_title+" ]");
			// Role details - Step 1 - Data fill
			$('#rd_details_title').val(json_data.ti_role_details[0].role_title);
			$('#rd_details_org').val(json_data.ti_role_details[0].role_org_id).trigger("change");
			$('#rd_details_org_unit').val(json_data.ti_role_details[0].role_org_unit).trigger("change");
			$('#rd_details_grade').val(json_data.ti_role_details[0].role_grade).trigger("change");
			$('#rd_details_req_res').val(json_data.ti_role_details[0].role_req_no_of_resource);
			$('#rd_details_type').val(json_data.ti_role_details[0].role_type_refitem_id).trigger("change");
			$('#rd_details_exp').val(json_data.ti_role_details[0].role_req_work_exp);
			$('#rd_details_pref_edu').val(json_data.ti_role_details[0].role_pref_edu);
			$('#rd_details_need').val(json_data.ti_role_details[0].role_need);
			$('#rd_details_resp').val(json_data.ti_role_details[0].role_resp);
			dept_vals = json_data.ti_role_details[0].role_depts.toString();
			var dataarray = dept_vals.split(",");
			$("#ti_rd_dept").val(dataarray);
			$("#ti_rd_dept").multiselect("refresh");
			if (json_data.ti_role_details[0].role_travel == true){
				document.getElementById('rd_details_travel1').checked = true;
			} 
			if (json_data.ti_role_details[0].role_travel == false){
				document.getElementById('rd_details_travel2').checked = true;
			}
			if(json_data.ti_role_details[0].id == json_data.ti_role_details[0].role_reports_to_id){
				$('#rd_details_reps_to').attr('disabled',true);
			}
			else{
				$('#rd_details_reps_to').val(json_data.ti_role_details[0].role_reports_to_id).trigger("change");
				$('#rd_details_reps_to').attr('disabled',false);
			}
			var valid = $('#submit_form').valid();
			if(!valid){
				return false
			}

			// Skill Sets - Step 2 - Data fill
			$("#rd_skill_set_tech_tbl").dataTable().fnDestroy();
			$("#rd_skill_set_func_tbl").dataTable().fnDestroy();
			$("#rd_skill_set_behv_tbl").dataTable().fnDestroy();

			var ti_rd_dept_text=$("#ti_rd_dept").find(":selected").map(function(){
				return $(this).text();
			}); 
			var ti_rd_dept_value=$("#ti_rd_dept").find(":selected").map(function(){
				return $(this).val();
			});

			var dept_vals = [];
			for (var i = 0; i < ti_rd_dept_value.length; i++){
				dept_vals.push([ti_rd_dept_value[i], ti_rd_dept_text[i]]);
			}


			$(".comp_dept").multiselect('destroy');
			var dropdown2OptionList = [];
			$('.comp_dept').multiselect({
				includeSelectAllOption: true,
			});
			for(i=0;i<dept_vals.length;i++){
				dropdown2OptionList.push({
					'value':dept_vals[i][0],
					'label':dept_vals[i][1]
				})
			}

			$('.comp_dept').multiselect('dataprovider', dropdown2OptionList);
			$('#rd_skill_set_tech_tbl,#rd_skill_set_func_tbl,#rd_skill_set_behv_tbl').find('button').prop('disabled',true);

			for(i=0;i<json_data.ti_skill_sets.length;i++)
			{
				var radio_value=json_data.ti_skill_sets[i].skillset_skill_level_refitem_id;
				var checkbox_value=json_data.ti_skill_sets[i].skillset_applicable;

				$('input[name="rd_ss_tech_lvl'+json_data.ti_skill_sets[i].skillset_competency_id_id+'"][value="'+radio_value+'"]').prop('checked', true);
				$('input[name="rd_ss_tech_lvl'+json_data.ti_skill_sets[i].skillset_competency_id_id+'"]').prop('disabled', false);

				vals = json_data.ti_skill_sets[i].skillset_depts;
				$('.rd_ss_tech_dept'+json_data.ti_skill_sets[i].skillset_competency_id_id+'').next("div").find('button').prop("disabled", false);
				for(var j in vals) {
					var tech_optionVal = vals[j];
					$('.rd_ss_tech_dept'+json_data.ti_skill_sets[i].skillset_competency_id_id+'').find("option[value="+tech_optionVal+"]").prop("selected", "selected");
				}
				$('.rd_ss_tech_dept'+json_data.ti_skill_sets[i].skillset_competency_id_id+'').multiselect("refresh");

				if(json_data.ti_skill_sets[i].skillset_applicable==true)
				{
					$('input:checkbox[name="rd_ss_tech_applicable'+json_data.ti_skill_sets[i].skillset_competency_id_id+'"]').prop('checked', true);
				}
				else{
					$('input:checkbox[name="rd_ss_tech_applicable'+json_data.ti_skill_sets[i].skillset_competency_id_id+'"]').prop('checked', false);
				}

				$('input[name="rd_ss_func_lvl'+json_data.ti_skill_sets[i].skillset_competency_id_id+'"][value="'+radio_value+'"]').prop('checked', true);
				$('input[name="rd_ss_func_lvl'+json_data.ti_skill_sets[i].skillset_competency_id_id+'"]').prop('disabled', false);

				vals = json_data.ti_skill_sets[i].skillset_depts;
				$('.rd_ss_func_dept'+json_data.ti_skill_sets[i].skillset_competency_id_id+'').next("div").find('button').prop("disabled", false);
				for(var j in vals) {
					var tech_optionVal = vals[j];
					$('.rd_ss_func_dept'+json_data.ti_skill_sets[i].skillset_competency_id_id+'').find("option[value="+tech_optionVal+"]").prop("selected", "selected");
				}
				$('.rd_ss_func_dept'+json_data.ti_skill_sets[i].skillset_competency_id_id+'').multiselect("refresh");

				if(json_data.ti_skill_sets[i].skillset_applicable==true)
				{
					$('input:checkbox[name="rd_ss_func_applicable'+json_data.ti_skill_sets[i].skillset_competency_id_id+'"]').prop('checked', true);
				}
				else{
					$('input:checkbox[name="rd_ss_func_applicable'+json_data.ti_skill_sets[i].skillset_competency_id_id+'"]').prop('checked', false);
				}


				$('input[name="rd_ss_behv_lvl'+json_data.ti_skill_sets[i].skillset_competency_id_id+'"][value="'+radio_value+'"]').prop('checked', true);
				$('input[name="rd_ss_behv_lvl'+json_data.ti_skill_sets[i].skillset_competency_id_id+'"]').prop('disabled', false);

				vals = json_data.ti_skill_sets[i].skillset_depts;
				$('.rd_ss_behv_dept'+json_data.ti_skill_sets[i].skillset_competency_id_id+'').next("div").find('button').prop("disabled", false);
				for(var j in vals) {
					var tech_optionVal = vals[j];
					$('.rd_ss_behv_dept'+json_data.ti_skill_sets[i].skillset_competency_id_id+'').find("option[value="+tech_optionVal+"]").prop("selected", "selected");
				}
				$('.rd_ss_behv_dept'+json_data.ti_skill_sets[i].skillset_competency_id_id+'').multiselect("refresh");

				if(json_data.ti_skill_sets[i].skillset_applicable==true)
				{
					$('input:checkbox[name="rd_ss_behv_applicable'+json_data.ti_skill_sets[i].skillset_competency_id_id+'"]').prop('checked', true);
				}
				else{
					$('input:checkbox[name="rd_ss_behv_applicable'+json_data.ti_skill_sets[i].skillset_competency_id_id+'"]').prop('checked', false);
				}

			}
			basic_datatable('rd_skill_set_tech_tbl');
			basic_datatable('rd_skill_set_func_tbl');
			basic_datatable('rd_skill_set_behv_tbl');
			// Critical Success Factors - Step 3 - Data fill
			document.getElementById('rd_csf_text_div').innerHTML= '';
			document.getElementById('rd_csf_text_div').innerHTML= '<div id="rd_csf_text_in" class="col-md-12 margin-bottom-10"> <input type="text" class="form-control rd_csf_text" id="rd_csf_text1" name="rd_csf_text1" required="required" /></div>';
			for(i=0;i<json_data.ti_crit_succ_facts.length;i++)
			{
				$('#rd_csf_text_in').remove();
				var newTextBoxDiv = $(document.createElement('div')).attr("id", 'rd_csf_text_in' + json_data.ti_crit_succ_facts[i].id);
				newTextBoxDiv.attr("class", 'col-md-12 margin-bottom-10')
				if (i==0){
					newTextBoxDiv.after().html('<input type="text" noSpace="true" required="required" name="rd_csf_text'+ json_data.ti_crit_succ_facts[i].id +'" class="form-control rd_csf_text" id="rd_csf_text' + json_data.ti_crit_succ_facts[i].id + '"  value=' + String(json_data.ti_crit_succ_facts[i].factors_crit_succ_fact).replace(/ /g, '\u00a0') + '>');
				} else {
					newTextBoxDiv.after().html('<input type="text" noSpace="true" required="required" name="rd_csf_text'+ json_data.ti_crit_succ_facts[i].id +'" class="form-control rd_csf_text" id="rd_csf_text' + json_data.ti_crit_succ_facts[i].id + '"  value=' + String(json_data.ti_crit_succ_facts[i].factors_crit_succ_fact).replace(/ /g, '\u00a0') + '>'+'<a href="javascript:;" class="btn btn-animate btn-icon-only btn-danger rd_csf_remove"><i class="nf nf-trash-o"></i> </a>');
				}
				newTextBoxDiv.appendTo("#rd_csf_text_div");
				$("body").on("click", ".rd_csf_remove", function () {
					$(this).closest("div").remove();
				});
			}
			// KPO - Step 4 - Data fill
			$("#ti_kpo_edit_table").dataTable().fnDestroy();
			$("#ti_kpo_edit_table").empty();
			var columns = [{"title":"Statement"}, {"title":"Expected Outcome"}, {"title":"Target Duration"},
			               {"title":"Performance Standard"},{"title":"Plan"},{"title":"Action"}]
			data_list = [];
			if(json_data.ti_kpo.length>0){  
				for(var i=0;i<json_data.ti_kpo.length;i++)
				{
					data_list.push([json_data.ti_kpo[i].kpo_statement, json_data.ti_kpo[i].kpo_outcome, json_data.ti_kpo[i].kpo_target_date,
					                json_data.ti_kpo[i].kpo_performance_std, json_data.ti_kpo[i].kpo_plan, '<button class="edit btn btn-sm btn-success tooltips" data-toggle="tooltip" data-placement="top" title="Add"> <i class="fa fa-pencil"></i> </button> <button class="delete btn btn-sm btn-danger tooltips" data-toggle="tooltip" data-placement="top" title="Remove"> <i class="fa fa-times"></i> </button>']);
				}
				editable_datatable1('ti_kpo_edit_table', data_list, 'ti_kpo_add_new_1', columns)
			}
			else{
				editable_datatable1('ti_kpo_edit_table', data_list, 'ti_kpo_add_new_1', columns)
			}
			// KPI - Step 5 - Data fill
			$("#ti_kpi_edit_table").dataTable().fnDestroy();
			$("#ti_kpi_edit_table").empty();
			var columns = [{"title":"KPI"}, {"title":"Target"}, {"title":"Target Type"},
			               {"title":"Starting Performance"},{"title":"Measure Frequency"},
			               {"title":"Customer Rating Scheme"},{"title":"Action"}]
			data_list = [];
			if(json_data.ti_kpi.length>0){  
				for(var i=0;i<json_data.ti_kpi.length;i++)
				{   
					data_list.push([json_data.ti_kpi[i].kpi_definition, json_data.ti_kpi[i].kpi_plan, json_data.ti_kpi[i].kpi_units,
					                json_data.ti_kpi[i].kpi_starting_perf, json_data.ti_kpi[i].kpi_measure_frequency_refitem_id, 
					                json_data.ti_kpi[i].kpi_custom_rating_scheme_id_id, '<button class="edit btn btn-sm btn-success tooltips" data-toggle="tooltip" data-placement="top" title="Add"> <i class="fa fa-pencil"></i> </button> <button class="delete btn btn-sm btn-danger tooltips" data-toggle="tooltip" data-placement="top" title="Remove"> <i class="fa fa-times"></i> </button>']);
				}
				editable_datatable1('ti_kpi_edit_table', data_list, 'ti_kpi_add_new_1', columns)
			}
			else{
				editable_datatable1('ti_kpi_edit_table', data_list, 'ti_kpi_add_new_1', columns)
			}
		}
	});
});