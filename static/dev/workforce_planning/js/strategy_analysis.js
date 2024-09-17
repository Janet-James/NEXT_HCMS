var stg_id='';
var steeple_data='';
var role_headers='';
var role_selected_val='';
var grade_selected_val='';
var unsaved_data='';
var stg_2_columns = [{"title":"Task Summary"}, {"title":"WorkForce Required"}, {"title":"Position"}, {"title":"Grade"}, {"title":"Action"}]
var wfp_strategy_s4_tbl_cols = [{"title":"No."}, {"title":"Position"}, {"title":"Resource Need"}, {"title":"Cost"}]
var wfp_strategy_s3_tbl_cols = [{"title":"No."}, {"title":"Position"}, {"title":"Grade"}, {"title":"Existing Resource Count"}, {"title":"Required Resource Count"}, {"title":"Resource Gap"}]
var grade_headers='';
//04-JUL-2018 || MST || Strategy Analysis - On Ready Function
$(document).ready(function(){
	$("#period_from_date").DateTimePicker({
		dateFormat: "dd-MMM-yyyy"
	});
	$("#period_to_date").DateTimePicker({
		dateFormat: "dd-MMM-yyyy"
	});
	$("#Defined_date").DateTimePicker({
		dateFormat: "dd-MMM-yyyy"
	});
	$("#stg_approval_board").select2({
		placeholder: "-Select-",
		width: '100%'
	});
	$("#wfp_strategy_sel").select2({
		placeholder: "-Select a Strategy-",
		width: '100%',
	});
	$("#sel_stg_org").select2({
		placeholder: "-Select Organization-",
		width: '100%',
	});
	$("#stg_org").select2({
		placeholder: "-Select Organization-",
		width: '100%',
	});
	$("#sel_stg_org_unit").select2({
		placeholder: "-Select Org. Unit-",
		width: '100%',
	}); 
	$("#stg_org_unit").select2({
		placeholder: "-Select Org. Unit-",
		width: '100%',
	});
	$("#wfp_stg_bar_sel_role").select2({
		placeholder: "-Select Role-",
		width: '100%',
	});
	$("#wfp_stg_bar_msel_roles").select2({
		placeholder: "-Select Roles-",
		width: '100%',
		maximumSelectionLength: 5,
	});
	$("#stg_bar_msel_grades").select2({
		placeholder: "-Select Grades-",
		width: '100%',
		maximumSelectionLength: 10,
	});
	// Step 1 - Button Draws
	step_1_btns_draw('add');
	// Step 2 - Button Draws
	step_2_btns_draw('add');
	// Step 1 - Range Slider initialization
	ComponentsIonSliders.init();
	// Step 2 - Editable Datatable initialization
	TableDatatablesEditable_step2.init();
	step_3();
	step_4();
	
	$("#strategy_donut_chart").html('<h3 class="no-data">No data available</h3>');
	$("#strategy_bar_chart").html('<h3 class="no-data">No data available</h3>');
	$("#strategy_multi_bar_chart").html('<h3 class="no-data">No data available</h3>');
	$("#strategy_multi_grade_chart").html('<h3 class="no-data">No data available</h3>');
});

//13-JUL-2018 || MST || Step 1 Validator
var $validator = $('#strategy_analysis_step1').validate({
	rules: {
		stg_summary:{
			required: true,
		},
		stg_details:{
			required: true,
		},
		stg_period_from_date: {
			required: true,
		},
		stg_period_to_date: {
			required: true,
			greaterThan: "#stg_period_from_date"
		},
		stg_defined_on: {
			required: true,
		},
		stg_approval_board: {
			required: true,
		},
		steeple_strategy: {
			required: true,  
		},
		steeple_exec: {
			required: true,  
		},
		steeple_workforce: {
			required: true,  
		},
		stp_social: {
			required: true,    
		},
		stp_tech: {
			required: true,    
		},
		stp_economy: {
			required: true,    
		},
		stp_env: {
			required: true,    
		},
		stp_political: {
			required: true,    
		},
		stp_legal: {
			required: true,    
		},
		stp_ethic: {
			required: true,
		},
		stg_org: {
			required: true,
		},
		stg_org_unit: {
			required: true,
		},
	},
	//For custom messages
	messages: {
		stg_summary:{
			required:"Enter Strategy Summary",
		},
		stg_details:{
			required:"Enter Strategy Details",
		},
		stg_period_from_date:{
			required:"Enter Period From Date",
		},
		stg_period_to_date:{
			required:"Enter Period From Date",
			greaterThan:"Should be greater than period from date"
		},
		stg_defined_on:{
			required:"Enter Defined On Date",
		},
		stg_approval_board:{
			required:"Select Approval Board",
		},
		steeple_strategy: {
			required: 'Enter Strategy',  
		},
		steeple_exec: {
			required: 'Enter STEEPLE Execution',  
		},
		steeple_workforce: {
			required: 'Enter STEEPLE Workforce',  
		},
		stp_social: {
			required: 'Enter Social Description',
		},
		stp_tech: {
			required: 'Enter Technical Description',
		},
		stp_economy: {
			required: 'Enter Economical Description',
		},
		stp_env: {
			required: 'Enter Environmental Description',
		},
		stp_political: {
			required: 'Enter Political Description',
		},
		stp_legal: {
			required: 'Enter Legal Description',
		},
		stp_ethic: {
			required: 'Enter Ethical Description',
		},
		stg_org: {
			required: 'Select Organization',
		},
		stg_org_unit: {
			required: 'Select Organization Unit',
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
//09-JUL-2018 || MST || Step 1 - Range Slider Initialization
var ComponentsIonSliders = {
	init: function() {
		var values = [-3, -2, -1, 0, 1, 2, 3];
		var values_p = ["High", "Medium", "Low", "None", "Low", "Medium", "High"];
		$("#range_1, #range_2, #range_3, #range_4, #range_5, #range_6, #range_7").ionRangeSlider({
			type: "double",
			grid: !0,
			min: -3,
			max: 3,
			from: -3,
			to: 3,
			from_min: -3,
		    from_max: 0,
		    to_min: 0,
		    to_max: 3,
		    prettify: function (n) {
		    	var ind = values.indexOf(n);
		    	return values_p[ind];
		    },
		})
	}
};

//06-JUL-2018 || MST || Step 1 - Strategy Analysis buttons draw 
function step_1_btns_draw(action_name){
	$("#step1_stg_btns").html('');
	var btnstr = '';
	var access_for_create_1 = jQuery.inArray( "Strategy Analysis", JSON.parse(localStorage.Create) );
	var access_for_write = jQuery.inArray( "Strategy Analysis", JSON.parse(localStorage.Write) );
	var access_for_delete = jQuery.inArray( "Strategy Analysis", JSON.parse(localStorage.Delete) );
	if (action_name == 'add') {
		if (access_for_create_1 != -1){
			btnstr += '<button type="button" class="btn btn-warning btn-eql-wid btn-animate pull-right" onclick="stg_cancel_clear_confirm(\''+"stg_cancel_clear"+'\');">Cancel / Clear</button>';
			btnstr += '<button type="button" class="btn-animate btn btn-success btn-eql-wid pull-right" onclick="save_form_show_modal(this);">Add</button>';
		}
	} 
	else if (action_name == 'update') {
		if (access_for_write != -1){
			btnstr += '<button type="button" class="btn-animate btn btn-success btn-eql-wid " onclick="save_form_show_modal(this);">Update</button>';
		}
		if (access_for_delete != -1){
			btnstr += '<button type="button" class="btn-animate btn btn-danger btn-eql-wid " onclick="stg_btn_delete_form(\''+"stg_delete_form"+'\');">Remove</button>';
		}
		btnstr += '<button type="button" id="stg_s1_cancel_clear" class="btn btn-warning btn-eql-wid btn-animate " onclick="stg_cancel_clear_confirm(\''+"stg_cancel_clear"+'\');">Cancel / Clear</button>';        
	} 
	$("#step1_stg_btns").append(btnstr);
}

//28-JUN-2018 || SMI || Asset Organization - On select function
function get_strategy_org(org_id){
	$('#sel_stg_org_unit').empty().append($('<option>',{
		value:'',
		text:'-Select Org. Unit-'
	}));
	$.ajax({
		type: 'POST',
		url: '/wfp_org_unit/',
		timeout : 10000,
		data: {
			'org_id': org_id,
		},
		async: false,
	}).done(function(json_data){
		data = JSON.parse(json_data);
		if (data.sel_org_unit != undefined){
			if (data.sel_org_unit.length > 0){
				$('#sel_stg_org_unit').prop("disabled",false);
				for(i=0;i<data.sel_org_unit.length;i++)
				{
					$('#sel_stg_org_unit').append($('<option>',{
						value:data.sel_org_unit[i].id,
						text:data.sel_org_unit[i].orgunit_name
					}))
				}
			} else {
				$('#sel_stg_org_unit').prop("disabled",true);
			}
		}
	})
}

function get_strategy_sel(org_unit_id){
	var sel_stg_org = $('#sel_stg_org').val();
	$('#wfp_strategy_sel').empty().append($('<option>',{
		value:'',
		text:'-Select a Strategy-'
	}));
	$.ajax({
		type: 'POST',
		url: '/wfp_org_unit/',
		timeout : 10000,
		data: {
			'org_unit_id': org_unit_id,
			'org_id': sel_stg_org,
		},
		async: false,
	}).done(function(json_data){
		data = JSON.parse(json_data);
		if (data.wfp_strategy_sel != undefined){
			if (data.wfp_strategy_sel.length > 0){
				$('#wfp_strategy_sel').prop("disabled",false);
				for(i=0;i<data.wfp_strategy_sel.length;i++)
				{
					$('#wfp_strategy_sel').append($('<option>',{
						value:data.wfp_strategy_sel[i].id,
						text:data.wfp_strategy_sel[i].strategy_analysis_summary
					}))
				}
			} else {
				stg_1_clear();
				$('#wfp_strategy_sel').prop("disabled",true);
				$('#stg_add_new_task').prop('disabled', true);
				$("#stg_step2_table").dataTable().fnDestroy();
				$("#stg_step2_table").empty();
				wfp_editable_datatable('stg_step2_table', [], 'stg_add_new_task', stg_2_columns)
				step_2_btns_draw('add');
				step_3();
				step_4();
			}
		}
	})
}

function strategy_org_change(org_id){
	$('#stg_org_unit').empty().append($('<option>',{
		value:'',
		text:'-Select Org. Unit-'
	}));
	$.ajax({
		type: 'POST',
		url: '/wfp_org_unit/',
		timeout : 10000,
		data: {
			'org_id': org_id,
		},
		async: false,
	}).done(function(json_data){
		data = JSON.parse(json_data);
		if (data.sel_org_unit != undefined){
			if (data.sel_org_unit.length > 0){
				$('#stg_org_unit').prop("disabled",false);
				for(i=0;i<data.sel_org_unit.length;i++)
				{
					$('#stg_org_unit').append($('<option>',{
						value:data.sel_org_unit[i].id,
						text:data.sel_org_unit[i].orgunit_name
					}))
				}
			} else {
				$('#stg_org_unit').prop("disabled",true);
			}
		}
	})
}

//25-JUL-2018 || MST || Step 1 - Add Strategy
function add_strategy(){
	stg_cancel_clear();
	$("#strategy_analysis_wiz li").removeClass("active");
	$("#strategy_analysis_wiz li:first").addClass("active");
	$('.tab-pane').removeClass("active");
	$('.tab-pane:eq(0)').addClass("active");
	$('#sel_stg_org, #sel_stg_org_unit, #wfp_strategy_sel').val(null).trigger('change');
	$('#wfp_strategy_sel, #sel_stg_org_unit').prop('disabled', true);
	$("#strategy_donut_chart").html('<h3 class="no-data">No data available</h3>');
	$('#wfp_stg_bar_sel_role').empty();
	$('#wfp_stg_bar_sel_role').prop("disabled",true);
	$("#strategy_bar_chart").html('<h3 class="no-data">No data available</h3>');
	$("#strategy_multi_bar_chart").html('<h3 class="no-data">No data available</h3>');
	$("#strategy_multi_grade_chart").html('<h3 class="no-data">No data available</h3>');
	$("#wfp_stg_bar_msel_roles").val(null).trigger("change");
	$('#wfp_stg_bar_msel_roles').prop("disabled", true);
	$("#stg_bar_msel_grades").val(null).trigger("change");
	$('#stg_bar_msel_grades').prop("disabled", true);
	$("#stg_bar_msel_grades").val(null).trigger("change");
}

//09-JUL-2018 || MST || Step 1 - STEEPLE
function add_steeple(){
	var stg_summary = $('#stg_summary').val();
	if (stg_summary == ''){
		alert_lobibox("error", 'Please Enter Strategy Summary to Add STEEPLE Details');
	} else {
		$('#Steeple_Modal').modal('show');
		$('#steeple_strategy').val(stg_summary);
	}
}

//04-JUL-2018 || MST || Step 1 - Save Form
function save_form_show_modal(el){
	var steeple_data = getFormValues('#stg_steeple_form');  
	if (typeof(el) == 'object'){
	} else {
		var remove = el
	}
	var text = $(el).text();
	var $valid = $('#strategy_analysis_step1').valid();
	if ($valid){
		var strategy_analysis_step1_form_data = getFormValues('#strategy_analysis_step1');
		var stg_approval_board = $("#stg_approval_board").val();

		if (steeple_data['steeple_strategy'] == '' || steeple_data['steeple_exec'] == '' || steeple_data['steeple_workforce'] == '' || steeple_data['stp_social'] == ''){
			alert_lobibox("error", 'Please Enter STEEPLE details to submit form'); 
		} else {
			$.ajax({
				type: 'POST',
				url: '/stg_analysis_step1/',
				timeout : 10000,
				data: {
					'text': text,
					'remove': remove,
					'stg_id': stg_id,
					'strategy_analysis_step1_form_data': JSON.stringify(strategy_analysis_step1_form_data),
					'stg_approval_board':JSON.stringify(stg_approval_board),
				},
				async: false,
			}).done(function(view_data) {
				var json_data = JSON.parse(view_data);
				if(json_data.status == 'NTE_01'){
					stg_cancel_clear();
					stg_select_fetch_submit();
					alert_lobibox("success", sysparam_datas_list[json_data.status]);    
				} else if(json_data.status == 'NTE_03'){
					stg_cancel_clear();
					step_1_btns_draw('add');
					step_2_btns_draw('add');
					alert_lobibox("success", sysparam_datas_list[json_data.status]);    
				} else if(json_data.status == 'NTE_04'){
					$("#asset_type").prop('disabled', false);
					stg_cancel_clear();
					step_1_btns_draw('add');
					step_2_btns_draw('add');
					alert_lobibox("success", sysparam_datas_list[json_data.status]);    
				} else {
					alert_lobibox("error", sysparam_datas_list[json_data.status]);    
				}
			});
		}
	} else {
		$('.val_message').prop('style', 'display:block;');
	}
}

function stg_select_fetch_submit(){
	$.ajax({
		type: 'POST',
		url: '/fetch_strategy_select/',
		timeout: 10000,
		data:{
			'action': 'add_click',
		},
		async: false,
	}).done(function(json_data){
		var json_data = JSON.parse(json_data);
		$('#wfp_strategy_sel').html('');
		select_tag = '';
		if(json_data['strategy_select_vals'].length>0){ 
			select_tag += '<option value="">-Select a Strategy-</option>';    
			for(var i=0;i<json_data['strategy_select_vals'].length;i++)            
			{
				select_tag += '<option value="'+json_data['strategy_select_vals'][i].id+'">'+json_data['strategy_select_vals'][i].strategy_analysis_summary+'</option>';    
			}
			$('#wfp_strategy_sel').append(select_tag);
		}
	});
}

//06-JUL-2018 || MST || Step 1 - Delete form validation
function stg_btn_delete_form(stg_delete_form){
	removeConfirmation(stg_delete_form);
}

//06-JUL-2018 || MST || Step 1 - Delete form text
function stg_delete_form(){
	var remove = 'remove';
	save_form_show_modal(remove);
}

function stg_1_clear(){
	$("#stg_period_from_date,#stg_period_to_date,#stg_defined_on").val('');
	$(".date_input_class").trigger('change');
	$('#stg_org').val(0).trigger('change');
	$('#stg_org_unit').val(null).trigger('change');
	$("#stg_org_unit").select2({
		placeholder: "-Select Org. Unit-",
		width: '100%',
	});
	$('#stg_org_unit').prop('disabled', true); 
	$('#strategy_analysis_step1 :input').val('');
	$("#stg_approval_board").val(null).trigger("change");
	$('.val_message').prop('style','display:none;');
	update_range1_vals = $("#range_1").data('ionRangeSlider');
	update_range1_vals.update({
		from: -3,
		to: 3,
	});
	update_range2_vals = $("#range_2").data('ionRangeSlider');
	update_range2_vals.update({
		from: -3,
		to: 3,
	});
	update_range3_vals = $("#range_3").data('ionRangeSlider');
	update_range3_vals.update({
		from: -3,
		to: 3,
	});
	update_range4_vals = $("#range_4").data('ionRangeSlider');
	update_range4_vals.update({
		from: -3,
		to: 3,
	});
	update_range5_vals = $("#range_5").data('ionRangeSlider');
	update_range5_vals.update({
		from: -3,
		to: 3,
	});
	update_range6_vals = $("#range_6").data('ionRangeSlider');
	update_range6_vals.update({
		from: -3,
		to: 3,
	});
	update_range7_vals = $("#range_7").data('ionRangeSlider');
	update_range7_vals.update({
		from: -3,
		to: 3,
	})
	step_1_btns_draw('add');
	step_2_btns_draw('add');
}

//06-JUL-2018 || MST || Step 1 - Cancel Clear form
function stg_cancel_clear(){
	$('#wfp_strategy_sel').val(null).trigger('change');
	$("#stg_period_from_date,#stg_period_to_date,#stg_defined_on").val('');
	$(".date_input_class").trigger('change');
	stg_1_clear();
}

//06-JUL-2018 || MST || Step 1 - Strategy Analysis Cancel / Clear form confirmation function
function stg_cancel_clear_confirm(func_name,action_name) {
	var stg_summary = $("#stg_summary").val();
	var stg_details = $("#stg_details").val();
	var stg_period_from_date = $("#stg_period_from_date").val();
	var stg_period_to_date = $("#stg_period_to_date").val();
	var stg_defined_on = $("#stg_defined_on").val();

	if (stg_summary != '' || stg_details != '' || stg_period_from_date != '' || stg_period_to_date != '' || stg_defined_on != ""){
		swal ({
			title: "Are you sure, you want to cancel?",
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
					window[func_name](action_name);
				} else {
					window[func_name]();
				}
			} 
		});
	} else {
		stg_cancel_clear();
	}
}

//13-JUL-2018 || MST || Step 1 - 2 - Strategy Select and View Function
$('#wfp_strategy_sel').change(function(){
	$('.val_message').prop('style','display:none;');
	wfp_strategy_sel_id = $('#wfp_strategy_sel').val();
	stg_id = wfp_strategy_sel_id;
	if (wfp_strategy_sel_id == 0 || wfp_strategy_sel_id == null){
		stg_1_clear();
		stg_2_cancel_clear();
		step_3();
		step_4();
		$('#stg_add_new_task').prop('disabled', true); 
	} else {
		$('#stg_add_new_task').prop('disabled', false); 
		$.ajax({
			url:"/stg_analysis_step1_table/",
			type:"POST",
			timeout:10000,
			data:{
				'table_id': wfp_strategy_sel_id,
			},
			async: false,
		}).done(function(view_data){
			var json_data = JSON.parse(view_data);
			// Current WorkForce Analysis - Step 1 - Data fill
			approval_board_ids = json_data.step1_form_data[0]['strategy_analysis_approval_board_ids']
			stg_sum = json_data.step1_form_data[0]['strategy_analysis_summary']
			stg_details = json_data.step1_form_data[0]['strategy_analysis_details']
			period_from = json_data.step1_form_data[0]['period_from']
			period_to = json_data.step1_form_data[0]['period_to']
			defined_on = json_data.step1_form_data[0]['defined_on']
			stg_org = json_data.step1_form_data[0]['strategy_analysis_org_id']
			stg_org_unit = json_data.step1_form_data[0]['strategy_analysis_org_unit_id']
			$("#stg_approval_board").val(approval_board_ids).trigger("change");
			$('#stg_org').val(stg_org).trigger("change");
			$('#stg_org_unit').val(stg_org_unit).trigger("change");
			$("#stg_summary").val(stg_sum);
			$("#stg_details").val(stg_details);
			$("#stg_period_from_date").val(period_from);
			$("#stg_period_to_date").val(period_to);
			$("#stg_defined_on").val(defined_on);
			$(".date_input_class").trigger('change');
			$("#steeple_exec").val(json_data.steeple_form_data[0]['steeple_execution_details']);
			$("#steeple_workforce").val(json_data.steeple_form_data[0]['steeple_workforce_details']);
			$("#stp_social").val(json_data.steeple_form_data[0]['steeple_social_desc']);
			$("#stp_tech").val(json_data.steeple_form_data[0]['steeple_technological_desc']);
			$("#stp_economy").val(json_data.steeple_form_data[0]['steeple_economical_desc']);
			$("#stp_env").val(json_data.steeple_form_data[0]['steeple_environmental_desc']);
			$("#stp_political").val(json_data.steeple_form_data[0]['steeple_political_desc']);
			$("#stp_legal").val(json_data.steeple_form_data[0]['steeple_legal_desc']);
			$("#stp_ethic").val(json_data.steeple_form_data[0]['steeple_ethical_desc']);
			update_range1_vals = $("#range_1").data('ionRangeSlider');
			update_range1_vals.update({
				from: json_data.steeple_form_data[0]['steeple_social_neg_impact'],
				to: json_data.steeple_form_data[0]['steeple_social_pos_impact'],
			});
			update_range2_vals = $("#range_2").data('ionRangeSlider');
			update_range2_vals.update({
				from: json_data.steeple_form_data[0]['steeple_technological_neg_impact'],
				to: json_data.steeple_form_data[0]['steeple_technological_pos_impact'],
			});
			update_range3_vals = $("#range_3").data('ionRangeSlider');
			update_range3_vals.update({
				from: json_data.steeple_form_data[0]['steeple_economical_neg_impact'],
				to: json_data.steeple_form_data[0]['steeple_economical_pos_impact'],
			});
			update_range4_vals = $("#range_4").data('ionRangeSlider');
			update_range4_vals.update({
				from: json_data.steeple_form_data[0]['steeple_environmental_neg_impact'],
				to: json_data.steeple_form_data[0]['steeple_environmental_pos_impact'],
			});
			update_range5_vals = $("#range_5").data('ionRangeSlider');
			update_range5_vals.update({
				from: json_data.steeple_form_data[0]['steeple_political_neg_impact'],
				to: json_data.steeple_form_data[0]['steeple_political_pos_impact'],
			});
			update_range6_vals = $("#range_6").data('ionRangeSlider');
			update_range6_vals.update({
				from: json_data.steeple_form_data[0]['steeple_legal_neg_impact'],
				to: json_data.steeple_form_data[0]['steeple_legal_pos_impact'],
			});
			update_range7_vals = $("#range_7").data('ionRangeSlider');
			update_range7_vals.update({
				from: json_data.steeple_form_data[0]['steeple_ethical_neg_impact'],
				to: json_data.steeple_form_data[0]['steeple_ethical_pos_impact'],
			});

			// Current WorkForce Analysis - Step 2 - Data fill
			$("#stg_step2_table").dataTable().fnDestroy();
			$("#stg_step2_table").empty();
			var data_list = [];
			if(json_data.cur_wf_analysis_data.length>0){
				$('#stg_step2_table_filter').prop('style', 'display:none;');
				for(var i=0;i<json_data.cur_wf_analysis_data.length;i++)
				{   
					data_list.push([json_data.cur_wf_analysis_data[i].wf_profile_task_summary, json_data.cur_wf_analysis_data[i].wf_profile_required, json_data.cur_wf_analysis_data[i].role_title, json_data.cur_wf_analysis_data[i].refitems_name,
					                '<button class="edit btn btn-sm btn-success tooltips" data-toggle="tooltip" data-placement="top" title="Add"> <i class="fa fa-pencil"></i> </button> <button class="delete btn btn-sm btn-danger tooltips" data-toggle="tooltip" data-placement="top" title="Remove"> <i class="fa fa-times"></i> </button>']);
				}
				wfp_editable_datatable('stg_step2_table', data_list, 'stg_add_new_task', stg_2_columns)
				step_2_btns_draw('update');
			}
			else{
				wfp_editable_datatable('stg_step2_table', data_list, 'stg_add_new_task', stg_2_columns)
				step_2_btns_draw('add');
			}

			// Current WorkForce Analysis - Step 3 - Gap Analysis - Data fill
			var data_list = [];
			if(json_data.gap_data.length>0){
				for(var i=0;i<json_data.gap_data.length;i++)
				{   
					data_list.push([i+1,json_data.gap_data[i].role_title, json_data.gap_data[i].grade, json_data.gap_data[i].existing_res, json_data.gap_data[i].wf_profile_required, json_data.gap_data[i].gap]);
				}
				plain_datatable_with_export('wfp_strategy_s3_tbl', data_list, wfp_strategy_s3_tbl_cols, [3,4,5]);
			}
			else{
				step_3();
			}

			// Current WorkForce Analysis - Step 4 - Cost View - Data fill
			var data_list = [];
			if(json_data.cost_view_data.length>0){
				for(var i=0;i<json_data.cost_view_data.length;i++)
				{   
					data_list.push([i+1,json_data.cost_view_data[i].role_title, json_data.cost_view_data[i].wf_profile_required, json_data.cost_view_data[i].wf_profile_required]);
				}
				plain_datatable_with_export('wfp_strategy_s4_tbl', data_list, wfp_strategy_s4_tbl_cols, [2,3]);
			}
			else{
				step_4();
			}
			
			step_5(wfp_strategy_sel_id);

			step_1_btns_draw('update');
		});
	}
});

//13-JUL-2018 || MST || Step 2 - Strategy Analysis buttons draw 
function step_2_btns_draw(action_name){
	$("#step2_stg_btns").html('');
	var step2_btnstr=''
		var access_for_create_1 = jQuery.inArray( "Strategy Analysis", JSON.parse(localStorage.Create) );
	var access_for_write = jQuery.inArray( "Strategy Analysis", JSON.parse(localStorage.Write) );
	var access_for_delete = jQuery.inArray( "Strategy Analysis", JSON.parse(localStorage.Delete) );
	if (action_name == 'add') {
		if (access_for_create_1 != -1){
			step2_btnstr += '<button type="button" class="btn btn-warning btn-eql-wid btn-animate pull-right" onclick="stg_2_cancel_clear_confirm(\''+"stg_2_cancel_clear"+'\');">Cancel / Clear</button>';
			step2_btnstr += '<button type="button" class="btn-animate btn btn-success btn-eql-wid pull-right" onclick="stg_2_save_form(this);">Add</button>';
		}
	} 
	else if (action_name == 'update') {
		if (access_for_write != -1){
			step2_btnstr += '<button type="button" class="btn-animate btn btn-success btn-eql-wid " onclick="stg_2_save_form(this);">Update</button>';
		}
		if (access_for_delete != -1){
			step2_btnstr += '<button type="button" class="btn-animate btn btn-danger btn-eql-wid " onclick="stg_btn_2_delete_form(\''+"stg_2_delete_form"+'\');">Remove</button>';
		}
		step2_btnstr += '<button type="button" class="btn btn-warning btn-eql-wid btn-animate " onclick="stg_2_cancel_clear_confirm(\''+"stg_2_cancel_clear"+'\');">Cancel / Clear</button>';        
	} 
	$("#step2_stg_btns").append(step2_btnstr);
}

//12-JUL-2018 || MST || Step 2 - Current Workforce Analysis CURD Operation form
function stg_2_save_form(el){
	var text = $(el).text();
	if (text == ''){;
		var text = 'remove';
	}
	strategy_select_val = $('#wfp_strategy_sel').val();
	var stg_step2_table = document.getElementById('stg_step2_table');
	var stg_step2_table_row_length = stg_step2_table.rows.length;
	var workforce_form_data = [];
	for (i = 1; i < stg_step2_table_row_length; i++){
		var temp_list = [];
		var t_rows = stg_step2_table.rows.item(i).cells;
		var rows_length = t_rows.length;
		for(var j = 0; j < rows_length-1; j++){
			var td_val = t_rows.item(j).innerHTML;
			temp_list.push(td_val);
		}
		workforce_form_data.push(temp_list);
	}
	$.ajax({
		url: '/step2_save_form/',
		type: 'POST',
		timeout: 10000,
		data: {
			'text': text,
			'strategy_select_id': strategy_select_val,
			'workforce_form_data': JSON.stringify(workforce_form_data),
		},
		async: false,
	}).done(function(json_data){
		var json_data = JSON.parse(json_data);
		if(json_data.status == 'NTE_01'){
			alert_lobibox("success", sysparam_datas_list[json_data.status]);    
		} else if (json_data.status == 'NTE_03'){
			step_2_btns_draw('update')
			alert_lobibox("success", sysparam_datas_list[json_data.status]);    
		} else if (json_data.status == 'NTE_04'){
			step_1_btns_draw('add');
			step_2_btns_draw('add');
			alert_lobibox("success", sysparam_datas_list[json_data.status]);    
		} else {
			alert_lobibox("error", sysparam_datas_list[json_data.status]);    
		}
	});
}

$('#STGY1').click(function(){
	wfp_strategy_sel_id = $('#wfp_strategy_sel').val();
	if (wfp_strategy_sel_id == 0 || wfp_strategy_sel_id == null){
		stg_1_clear();
	} else {
		step_1_btns_draw('update');
	}
});

//13-JUL-2018 || MST || Step 2 Click and Fetch drop down of Select Strategy
$('#STGY2').click(function(){
	wfp_strategy_sel_id = $('#wfp_strategy_sel').val();
	if (wfp_strategy_sel_id == 0 || wfp_strategy_sel_id == null){
		$('#stg_add_new_task').prop('disabled', true);
		$.ajax({
			type: 'POST',
			url: '/fetch_strategy_select/',
			timeout: 10000,
			data:{
				'action': 'step_2_select_fetch',
			},
			async: false,
		}).done(function(json_data){
			var json_data = JSON.parse(json_data);
			$('#wfp_strategy_sel').html('');
			select_tag = '';
			if(json_data['strategy_select_vals'].length>0){ 
				select_tag += '<option value="">-Select a Strategy-</option>';    
				for(var i=0;i<json_data['strategy_select_vals'].length;i++)            
				{
					select_tag += '<option value="'+json_data['strategy_select_vals'][i].id+'">'+json_data['strategy_select_vals'][i].strategy_analysis_summary+'</option>';    
				}
				$('#wfp_strategy_sel').append(select_tag);
			}
		});
		step_2_btns_draw('add');
	} else {
		$('#stg_add_new_task').prop('disabled', false);
	}
});

//17-AUG-2018 || MST || Step 3 - Click function
$('#STGY3').click(function(){
	var org_id = $('#sel_stg_org').val();
	var org_unit_id = $('#sel_stg_org_unit').val();
	var stg_sel_id = $('#wfp_strategy_sel').val();
	if (org_id != '' && org_unit_id != null && stg_sel_id != ''){
		$.ajax({
			url:"/stg_analysis_gap_table/",
			type:"POST",
			timeout:10000,
			data:{
				'table_id': stg_sel_id,
			},
			async: false,
		}).done(function(view_data){
			var json_data = JSON.parse(view_data);
			// Current WorkForce Analysis - Step 3 - Gap Analysis - Data fill
			var data_list = [];
			if(json_data.gap_data.length>0){
				for(var i=0;i<json_data.gap_data.length;i++)
				{   
					data_list.push([i+1,json_data.gap_data[i].role_title, json_data.gap_data[i].grade, json_data.gap_data[i].existing_res, json_data.gap_data[i].wf_profile_required, json_data.gap_data[i].gap]);
				}
				plain_datatable_with_export('wfp_strategy_s3_tbl', data_list, wfp_strategy_s3_tbl_cols, [3,4,5]);
			}
			else{
				step_3();
			}

			// Current WorkForce Analysis - Step 4 - Cost View - Data fill
			var data_list = [];
			if(json_data.cost_view_data.length>0){
				for(var i=0;i<json_data.cost_view_data.length;i++)
				{   
					data_list.push([i+1,json_data.cost_view_data[i].role_title, json_data.cost_view_data[i].wf_profile_required, json_data.cost_view_data[i].wf_profile_required]);
				}
				plain_datatable_with_export('wfp_strategy_s4_tbl', data_list, wfp_strategy_s4_tbl_cols, [2,3]);
			}
			else{
				step_4();
			}
		});
	}
});

//13-JUL-2018 || MST || Step 2 - Delete form validation
function stg_btn_2_delete_form(stg_2_delete_form){
	removeConfirmation(stg_2_delete_form);
}

//13-JUL-2018 || MST || Step 2 - Delete form text
function stg_2_delete_form(){
	var remove = 'remove';
	stg_2_save_form(remove);
}

//13-JUL-2018 || MST || Step 2 - Cancel Clear
function stg_2_cancel_clear(){
	$("#stg_step2_table").dataTable().fnDestroy();
	$("#stg_step2_table").empty();
	wfp_editable_datatable('stg_step2_table', '', 'stg_add_new_task', stg_2_columns);    
}

//13-JUL-2018 || MST || Step  - Cancel / Clear form confirmation function
function stg_2_cancel_clear_confirm(func_name,action_name) {
	var step2_table = document.getElementById('stg_step2_table');
	var step2_table_row_length = step2_table.rows.length;

	if (stg_summary != 2){
		swal ({
			title: "Are you sure, you want to cancel?",
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
					window[func_name](action_name);
				} else {
					window[func_name]();
				}
			} 
		});
	} else {
		stg_2_cancel_clear();
	}
}

function grade_select(role_id, idx){
	$.ajax({
		url : '/fetch_grade_details/',
		type : 'POST',    
		timeout : 10000,
		data:{
			'role_id': role_id,
		},
		async:false,
	}).done(function(json_data){
		var json_data=JSON.parse(json_data);
		if(json_data['grade_details_headers'].length>0){
			grade_headers = '<select id="grade_sel_id" disabled="disabled" class="grade_sel form-control select2"><option disabled="disabled" selected="selected">-Select-</option>';
			for(var i=0;i<json_data['grade_details_headers'].length;i++)
			{
				grade_headers += '<option value="'+json_data['grade_details_headers'][i].id+'">'+json_data['grade_details_headers'][i].refitems_name+'</option>';    
			}
			grade_headers += '</select>';
			$('.grade_sel:eq('+idx+')').prop('disabled', false);
			$('.grade_sel:eq('+idx+')').html(grade_headers);
		} else {
			alert_lobibox("error", sysparam_datas_list[json_data['status']]);
			grade_headers = ''
		}
	});
}

//13-JUL-2018 || MST || Step 2 - Current Workforce Profile Analysis Datatable
var TableDatatablesEditable_step2 = function () {
	var e = function () {
		function t(e, t) {
			var n = e.fnGetData(t),
			a = $(">td", t);
			var sel_stg_org = $('#sel_stg_org').val();
			var org_unit_id = $('#sel_stg_org_unit').val();
			$.ajax({
				url : '/fetch_role_details/',
				type : 'POST',    
				timeout : 10000,
				data: {
					'org_unit_id': org_unit_id,
					'org_id': sel_stg_org,
				},
				async:false,
			}).done(function(json_data){
				var json_data=JSON.parse(json_data);
				if(json_data['role_details_headers'].length>0){  
					role_headers = '<select id="role_sel_id" onchange="grade_select($(this).val(), $(this).parent().closest(\''+"tr"+'\').index());" class="role_sel_class form-control select2"><option disabled="disabled" selected="selected">-Select-</option>';
					for(var i=0;i<json_data['role_details_headers'].length;i++)
					{
						if (json_data['role_details_headers'][i].role_title == role_selected_val) {
							role_headers += '<option value="'+json_data['role_details_headers'][i].id+'" selected>'+json_data['role_details_headers'][i].role_title+'</option>';    
						} else {
							role_headers += '<option value="'+json_data['role_details_headers'][i].id+'">'+json_data['role_details_headers'][i].role_title+'</option>';    
						}
					}
					role_headers += '</select>';
				} else {
					role_headers = '';
				}
			});

			if (grade_selected_val != ''){
				$.ajax({
					url : '/fetch_selected_grade_details/',
					type : 'POST',    
					timeout : 10000,
					data:{
						'role_selected_val':role_selected_val,
					},
					async:false,
				}).done(function(json_data){
					var json_data=JSON.parse(json_data);
					if(json_data['grade_selected_headers'].length>0){  
						grade_headers = '<select id="grade_sel_id" class="grade_sel form-control select2"><option disabled="disabled" selected="selected">-Select-</option>';
						for(var i=0;i<json_data['grade_selected_headers'].length;i++)
						{
							if (json_data['grade_selected_headers'][i].refitems_name == grade_selected_val) {
								grade_headers += '<option value="'+json_data['grade_selected_headers'][i].id+'" selected>'+json_data['grade_selected_headers'][i].refitems_name+'</option>';    
							} else {
								grade_headers += '<option value="'+json_data['grade_selected_headers'][i].id+'">'+json_data['grade_selected_headers'][i].refitems_name+'</option>';    
							}
						}
						grade_headers += '</select>';
					} else {
						grade_headers = '<select id="grade_sel_id" disabled="disabled" class="grade_sel form-control select2"><option disabled="disabled" selected="selected">-Select-</option></select>';
					}
				});
			} else {
				grade_headers = '<select id="grade_sel_id" disabled="disabled" class="grade_sel form-control select2"><option disabled="disabled" selected="selected">-Select-</option></select>';
			}
			a[0].innerHTML = '<input type="text" class="form-control input-small" value="' + n[0] + '">', 
			a[1].innerHTML = '<input type="number" class="form-control input-small" value="' + n[1] + '">', 
			a[2].innerHTML = role_headers,
			a[3].innerHTML = grade_headers,
			a[4].innerHTML = '<button class="edit btn btn-sm btn-success tooltips" data-toggle="tooltip" data-placement="top" title="Add"> <i class="fa fa-floppy-o"></i> </button> <button class="cancel btn btn-sm btn-danger tooltips" data-toggle="tooltip" data-placement="top" title="Remove"> <i class="fa fa-times"></i> </button>' 
		}
		function e(e, t) {
			for (var n = e.fnGetData(t), a = $(">td", t), l = 0, r = a.length; l < r; l++) e.fnUpdate(n[l], t, l, !1);
			e.fnDraw()
		}

		function n(e, t) {
			var n = $("input", t);
			var role_sel_id = $('#role_sel_id option:selected').text();
			var grade_sel_id = $('#grade_sel_id option:selected').text();
			e.fnUpdate(n[0].value, t, 0, !1),
			e.fnUpdate(n[1].value, t, 1, !1),
			e.fnUpdate(role_sel_id, t, 2, !1),
			e.fnUpdate(grade_sel_id, t, 3, !1),
			e.fnUpdate('<button class="edit btn btn-sm btn-success tooltips" data-toggle="tooltip" data-placement="top" title="Add"> <i class="fa fa-pencil"></i> </button> <button class="delete btn btn-sm btn-danger tooltips" data-toggle="tooltip" data-placement="top" title="Remove"> <i class="fa fa-times"></i> </button>', t, 4, !1), e.fnDraw()
		}
		var a = $("#stg_step2_table"),
		l = a.dataTable({
			searching: false,
			lengthMenu: [
			             [5, 15, 20, -1],
			             [5, 15, 20, "All"]
			             ],
			             pageLength: 5,
			             language: {
			            	 aria: {
			            		 sortAscending: ": activate to sort column ascending",
			            		 sortDescending: ": activate to sort column descending"
			            	 },
			            	 emptyTable: "No data available",
			            	 info: "Showing _START_ to _END_ of _TOTAL_ entries",
			            	 infoEmpty: "No entries found",
			            	 infoFiltered: "(filtered1 from _MAX_ total entries)",
			            	 lengthMenu: "_MENU_ entries",
			            	 zeroRecords: "No matching records found"
			             },
			             buttons: [],
			             columnDefs: [{
			            	 orderable: !0,
			            	 targets: [0]
			             }, {
			            	 searchable: !0,
			            	 targets: [0]
			             }],
			             order: [[0, "asc"]],
			             dom: "<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-12'><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-9 col-sm-12'i><'col-md-3 col-sm-12'lp>>"
		}),
		r = ($("#stg_step2_table_wrapper"), null),
		o = !1;
		grade_selected_val = '';
		$("#stg_add_new_task").click(function (e) {
			grade_selected_val = '';
			var stg_step2_table = $('#stg_step2_table').DataTable();
			var stg_step2_table_rows = $('#stg_step2_table').find('tbody').find('tr');
			var unsaved_data = false;
			if (stg_step2_table_rows[0].innerText != 'No data available'){
				for (var i = 0; i < stg_step2_table_rows.length; i++) {
					var stg_step2_td_data = $(stg_step2_table_rows[i]).find('td:eq(4)').html();
					if (stg_step2_td_data.includes('<i class="fa fa-floppy-o"></i>')){
						unsaved_data = true;
					}
				}
			}
			if(unsaved_data==true){
				return false;
			} else {
				var a = l.fnAddData(["", "", "", "", ""]),
				i = l.fnGetNodes(a[0]);
				t(l, i), r = i, o = !0
			}

		}), a.on("click", ".delete", function (e) {
			var t = $(this).parents("tr")[0];
			vals = $(t).find('td:eq(3)')[0].innerHTML
			if ($(t).find('td:eq(3)')[0].innerHTML == '<button class="edit btn btn-sm btn-success tooltips" data-toggle="tooltip" data-placement="top" title="Add"> <i class="fa fa-floppy-o"></i> </button> <button class="cancel btn btn-sm btn-danger tooltips" data-toggle="tooltip" data-placement="top" title="Remove"> <i class="fa fa-times"></i> </button>') {
				var t0 = $(r).find('td:eq(0)').find('input').hasClass( "valid" );
				var t1 = $(r).find('td:eq(1)').find('input').hasClass( "valid" );
				var t2 = $("#role_sel_id option:selected").text();
				var t3 = $("#grade_sel_id option:selected").text();
				if (t0 || t1 || t2 != '-Select-' || t3 != '-Select-'){
					if (e.preventDefault(), 0 != swal ({
						title: "Are you sure, you want to remove this item?",
						type: "warning",
						showCancelButton: true,
						confirmButtonClass: "btn-danger",
						confirmButtonText: "Yes",
						cancelButtonText: "No",
						closeOnConfirm: true,
						closeOnCancel: true
					},
					function(isConfirm) {
						if (isConfirm) {
							l.fnDeleteRow(t)
						}
					}
					)){}
				} else {
					var t0 = $(r).find('td:eq(0)').find('input').val();
					var t1 = $(r).find('td:eq(1)').find('input').val();
					var t2 = $("#role_sel_id option:selected").text();
					var t3 = $("#grade_sel_id option:selected").text();
					if (t0 || t1 || t2 != '-Select-' || t3 != '-Select-'){
						if (e.preventDefault(), 0 != swal ({
							title: "Are you sure, you want to remove this item?",
							type: "warning",
							showCancelButton: true,
							confirmButtonClass: "btn-danger",
							confirmButtonText: "Yes",
							cancelButtonText: "No",
							closeOnConfirm: true,
							closeOnCancel: true
						},
						function(isConfirm) {
							if (isConfirm) {
								l.fnDeleteRow(t)
							}
						}
						)){}
					} else {
						l.fnDeleteRow(t);
						return false;
					}
				}
			} else {
				if (e.preventDefault(), 0 != swal ({
					title: "Are you sure, you want to remove this item?",
					type: "warning",
					showCancelButton: true,
					confirmButtonClass: "btn-danger",
					confirmButtonText: "Yes",
					cancelButtonText: "No",
					closeOnConfirm: true,
					closeOnCancel: true
				},
				function(isConfirm) {
					if (isConfirm) {
						l.fnDeleteRow(t)
					}
				}
				)){}
			}
		}), 
		a.on("click", ".cancel", function (t) {
			t.preventDefault(), o ? (l.fnDeleteRow(r), r = null, o = !1) : (e(l, r), r = null)
		}), 
		a.on('click', '.edit', function (a) {
			a.preventDefault();
			nNew = false;
			var i = $(this).parents('tr')[0];
			role_selected_val = $(this).closest('tr').children('td:eq(2)').text();
			grade_selected_val = $(this).closest('tr').children('td:eq(3)').text();
			if (r !== null && r != i) {
				e(l, r);
				t(l, i);
				r = i;
			} else if (r == i && this.innerHTML == ' <i class="fa fa-floppy-o"></i> ') {
				n(l, r);
				r = null;
			}
			else if (this.innerHTML == ' <i class="fa fa-pencil"></i> ') {
				t(l, i);
				r = null;
			}
			else {
				n(l, i);
				r = i;
			}
		})
	};
	return {
		init: function () {
			e()
		}
	}
}();

function step_3(){
	wfp_struct_s3_table=$('#wfp_strategy_s3_tbl').DataTable();
	wfp_struct_s3_table.clear().draw();
	$("#wfp_strategy_s3_tbl").DataTable().destroy();
	empty_datatable('wfp_strategy_s3_tbl', [3,4,5]);
}

function step_4(){
	wfp_struct_s4_table=$('#wfp_strategy_s4_tbl').DataTable();
	wfp_struct_s4_table.clear().draw();
	$("#wfp_strategy_s4_tbl").DataTable().destroy();
	empty_datatable('wfp_strategy_s4_tbl', [2,3]);
}

//30-JUL-2018 || SMI || Step 5 - Donut Chart Data Load Function
function step_5(wfp_strategy_sel_id){
	var org_id = $('#sel_stg_org').val();
	var org_unit_id = $('#sel_stg_org_unit').val();
	$.ajax({
		url : '/wfp_stgy_step5_details/',
		type : 'POST',
		timeout : 10000,
		data: {
			'org_id': org_id,
			'org_unit_id': org_unit_id,
			'wfp_strategy_sel_id':wfp_strategy_sel_id
		},
		async: false,
	}).done(function(json_data){
		var json_data = JSON.parse(json_data);
		if(json_data.data != undefined){
			if (json_data.data[0].minrange != null && json_data.data[0].midrange != null && json_data.data[0].midrange != null){
				struct_donut_chart_data = [{
					"title": "0 to 5k",
					"value": json_data.data[0].minrange,
					"color": "#53c6fa",
					"pullOut": true
				}, {
					"title": "6k to 10k",
					"value": json_data.data[0].midrange,
					"color": "#d97df0"
				}, {
					"title": "Above 10k",
					"value": json_data.data[0].maxrange,
					"color": "#fcaa7d"
				}];
				var strategy_donut_chart = AmCharts.makeChart("strategy_donut_chart", {
					"type": "pie",
					"fontFamily": "'Poppins', sans-serif",
					"theme": "light",
					"outlineColor": "",
					"color": "#000",
					"colorField": "color",
					"legend": {
						"equalWidths": false,
						"position": "top",
						"valueAlign": "right",
						"align": "right",
						"valueText": "",
						"color": "#000",
						"valueWidth": 100
					},
					"dataProvider": struct_donut_chart_data,
					"titleField": "title",
					"valueField": "value",
					"pulledField": "pullOut",
					"radius": "42%",
					"innerRadius": "60%",
					"labelText": "[[title]]",
					"export": {
						"enabled": false
					}
				});
				strategy_donut_chart.addListener("clickSlice", handleClick);
			}
			else{
				$("#strategy_donut_chart").html('<h3 class="no-data">No data available</h3>');
				$('#wfp_stg_bar_sel_role').empty();
				$('#wfp_stg_bar_sel_role').prop("disabled",true);
				$("#strategy_bar_chart").html('<h3 class="no-data">No data available</h3>');
			}
			$('#wfp_stg_bar_msel_roles').empty().append($('<option>',{
				value:'',
				text:'-Select Roles-'
			}));
			for(i=0;i<json_data.role_data.length;i++)
			{
				$('#wfp_stg_bar_msel_roles').append($('<option>',{
					value:json_data.role_data[i].id,
					text:json_data.role_data[i].role_title
				}))
			}
			$('#wfp_stg_bar_msel_roles').prop("disabled", false);
			var first5_roles = $('#wfp_stg_bar_msel_roles').val($('#wfp_stg_bar_msel_roles option:first').val());
			if (first5_roles["0"].length < 6) {
				var len = first5_roles["0"].length - 1;
			} else {
				var len = 5;
			}
			var first5_roles_list = [];
			for(var i=1; i<=len; i++){
				first5_roles_list.push(first5_roles["0"][i].value);
			}
			$("#wfp_stg_bar_msel_roles").val(first5_roles_list).trigger("change");
			$('#stg_bar_msel_grades').prop("disabled", false);
			var first5_grades = $('#stg_bar_msel_grades').val($('#stg_bar_msel_grades option:first').val());
			var first5_grades_list = [];
			for(var i=0; i<5; i++){
				first5_grades_list.push(first5_grades["0"][i].value);
			}
			$("#stg_bar_msel_grades").val(first5_grades_list).trigger("change");
		}
	});
	handleClick("0 to 5k");
}

//31-JUL-2018 || SMI || Step 5 - Donut Chart Slice Click Function
function handleClick(event)
{
	var wfp_strategy_sel_id = $('#wfp_strategy_sel').val();
	if(event != "0 to 5k"){
		var strgy_donut_chart_title = event.dataItem.dataContext.title;
	} else {
		var strgy_donut_chart_title = event;
	}
	$.ajax({
		url : '/wfp_stgy_step5_chart_click/',
		type : 'POST',
		timeout : 10000,
		data: {
			'wfp_strategy_sel_id':wfp_strategy_sel_id,
			'strgy_donut_chart_title': strgy_donut_chart_title,
		},
		async: false,
	}).done(function(json_data){
		var json_data = JSON.parse(json_data);
		$('#wfp_stg_bar_sel_role').empty();
		$('#wfp_stg_bar_sel_role').prop("disabled",false);
		for(i=0;i<json_data.data.length;i++)
		{
			$('#wfp_stg_bar_sel_role').append($('<option>',{
				value:json_data.data[i].id,
				text:json_data.data[i].role_title
			}))
		}
		if(event != "0 to 5k"){
			$('#wfp_stg_bar_sel_role').val(null).trigger("change");
		} else {
			$('#wfp_stg_bar_sel_role').val($('#wfp_stg_bar_sel_role option:first-child').val()).trigger("change");
		}
	});
}

//31-JUL-2018 || SMI || Step 5 - Role Select and Bar Chart Data Load Function
function stg_get_role_val_bar(role_id){
	if(role_id != null){
		var wfp_strategy_sel_id = $('#wfp_strategy_sel').val();
		$.ajax({
			url : '/wfp_strgy_step5_role_sel/',
			type : 'POST',
			timeout : 10000,
			data: {
				'wfp_strategy_sel_id': wfp_strategy_sel_id,
				'role_id': role_id,
			},
			async: false,
		}).done(function(json_data){
			var json_data = JSON.parse(json_data);
			var strgy_bar_chart_data = [{
				"label": "Existing Resources",
				"count": json_data.data[0].existing_count,
				"color": "#53c6fa"
			}, {
				"label": "Required Resources",
				"count": json_data.data[0].required_count,
				"color": "#d97df0"
			}];
			AmCharts.makeChart("strategy_bar_chart", {
				"type": "serial",
				"fontFamily": "'Poppins', sans-serif",
				"theme": "light",
				"marginRight": 70,
				"dataProvider": strgy_bar_chart_data,
				"valueAxes": [{
					"axisAlpha": 0,
					"position": "left",
					"title": "Resources"
				}],
				"startDuration": 1,
				"graphs": [{
					"balloonText": "<b>[[category]]: [[value]]</b>",
					"fillColorsField": "color",
					"fillAlphas": 0.9,
					"lineAlpha": 0.2,
					"type": "column",
					"valueField": "count"
				}],
				"categoryField": "label",
				"categoryAxis": {
					"gridPosition": "start",
					"autoWrap": true
				},
				"export": {
					"enabled": false
				}
			});
		});
	} else{
		$("#strategy_bar_chart").html('<h3 class="no-data">No data available</h3>');
	}
}

function wfp_stg_bar_msel_roles_chng(){
	var wfp_strategy_sel_id = $('#wfp_strategy_sel').val();
	var wfp_stg_bar_msel_roles_val = $("#wfp_stg_bar_msel_roles").val();
	if(wfp_stg_bar_msel_roles_val != null && wfp_strategy_sel_id != ''){
		$.ajax({
			url : '/wfp_stgy_bar_msel_roles_chng/',
			type : 'POST',
			timeout : 10000,
			data: {
				'wfp_strategy_sel_id': wfp_strategy_sel_id,
				'wfp_stg_bar_msel_roles_val': JSON.stringify(wfp_stg_bar_msel_roles_val),
			},
			async: false,
		}).done(function(json_data){
			var json_data = JSON.parse(json_data);
			var chartData = [];
			for(var i=0; i<json_data.data.length; i++){
				var dt = {};
				dt = {
						"role": json_data.data[i].role_title,
						"existing": json_data.data[i].existing_count,
						"required": json_data.data[i].required_count,
				};
				chartData.push(dt);
			}
			AmCharts.makeChart("strategy_multi_bar_chart", {
				"type": "serial",
				"fontFamily": "'Poppins', sans-serif",
				"theme": "light",
				"categoryField": "role",
				"rotate": false,
				"startDuration": 1,
				"categoryAxis": {
					"gridPosition": "start",
					"autoWrap": true
				},
				"trendLines": [],
				"graphs": [{
					"balloonText": "Existing Resources:[[value]]",
					"fillAlphas": 0.8,
					"id": "AmGraph-1",
					"lineAlpha": 0.2,
					"title": "Planned Resources",
					"type": "column",
					"valueField": "existing",
					"fillColors": "#53c6fa"
				},
				{
					"balloonText": "Required Resources:[[value]]",
					"fillAlphas": 0.8,
					"id": "AmGraph-2",
					"lineAlpha": 0.2,
					"title": "Existing Resources",
					"type": "column",
					"valueField": "required",
					"fillColors": "#d97df0"
				}
				],
				"guides": [],
				"valueAxes": [{
					"axisAlpha": 0,
					"position": "left",
					"title": "Resources"
				}],
				"allLabels": [],
				"balloon": {},
				"titles": [],
				"dataProvider": chartData,
				"export": {
					"enabled": false
				}
			});
		})
	} else {
		$("#strategy_multi_bar_chart").html('<h3 class="no-data">No data available</h3>');
	}
}

function stg_bar_msel_grades_chng(){
	var wfp_stg_bar_msel_grades_val = $("#stg_bar_msel_grades").val();
	if(wfp_stg_bar_msel_grades_val != null){
		$.ajax({
			url : '/wfp_stgy_bar_msel_grades_chng/',
			type : 'POST',
			timeout : 10000,
			data: {
				'wfp_stg_bar_msel_grades_val': JSON.stringify(wfp_stg_bar_msel_grades_val),
			},
			async: false,
		}).done(function(json_data){
			var json_data = JSON.parse(json_data);
			var struct_grade_chart_data = [];
			for(i=0; i<json_data.data.length; i++){
				struct_grade_chart_data.push({
					"label": json_data.data[i].grade,
					"count": json_data.data[i].count,
					"color": "#53c6fa"
				})
			}
			AmCharts.makeChart("strategy_multi_grade_chart", {
				"type": "serial",
				"fontFamily": "'Poppins', sans-serif",
				"theme": "light",
				"marginRight": 70,
				"dataProvider": struct_grade_chart_data,
				"valueAxes": [{
					"axisAlpha": 0,
					"position": "left",
					"title": "Resources"
				}],
				"startDuration": 1,
				"graphs": [{
					"balloonText": "<b>[[category]]: [[value]]</b>",
					"fillColorsField": "color",
					"fillAlphas": 0.9,
					"lineAlpha": 0.2,
					"type": "column",
					"valueField": "count"
				}],
				"categoryField": "label",
				"categoryAxis": {
					"gridPosition": "start",
					"autoWrap": true
				},
				"export": {
					"enabled": false
				}
			});
		})
	}else{
		$("#strategy_multi_grade_chart").html('<h3 class="no-data">No data available</h3>');
	}
}

//22-AUG-2018 || KAV || View Strategy Analysis  - Tab5 On select function And Map Function
var map_flag = true;
$("#STGY5").click(function(){
     setTimeout(function(){
    if(map_flag){
        map_dashbaord();
        map_flag = false;
    }
     }, 200);
});