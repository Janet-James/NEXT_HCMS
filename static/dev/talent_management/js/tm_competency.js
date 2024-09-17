var tech_data = '';
var func_data = '';
var behav_data = '';
var action = 'add';
//19-SEP-2018 || SMI || Document Ready function for Talent Competency Assessment
$(document).ready(function(){
	$("#tm_competency_sel_org").select2({
		placeholder: "-Select Organization-",
		width: '100%',
	});
	$("#tm_competency_sel_org_unit").select2({
		placeholder: "-Select Org. Unit-",
		width: '100%',
	});
	$("#tm_competency_sel_dept").select2({
		placeholder: "-Select Division-",
		width: '100%',
	});
	$("#tm_competency_sel_emp").select2({
		placeholder: "-Select Employee-",
		width: '100%',
	});
	$("#tm_compt_emp_year").select2({
		placeholder: "-Select Year-",
		width: '100%',
	});
	$("#tm_compt_emp_quarter").select2({
		placeholder: "-Select Quarter-",
		width: '100%',
	});
	$('.summernote').summernote({
		placeholder : '',
		tabsize : 2,
		height : 210
	});
	$('#workareas').summernote({
		placeholder : '',
		tabsize : 2,
		height : 210
	});
	var usr_details = JSON.parse(user_details);
	var emp_details = JSON.parse(empl_details);
	if (usr_details[0] != undefined){
		$('#tm_competency_sel_org').val(usr_details[0].org_id_id).trigger("change");
		$('#tm_competency_sel_org_unit').val(usr_details[0].org_unit_id_id).trigger("change");
		$('#tm_competency_sel_dept').val(usr_details[0].team_name_id).trigger("change");
		$('#tm_competency_sel_emp').prop("disabled",false);
		for(i=0;i<emp_details.length;i++)
		{
			$('#tm_competency_sel_emp').append($('<option>',{
				value:emp_details[i].id,
				text:emp_details[i].name
			}))
		}
	} else{
		alert_lobibox("warning", "You cannot do assessment. Please contact your Higher Officer/Admin");
	}
	$('#tm_competency_sel_org').prop("disabled",true);
	$('#tm_competency_sel_org_unit').prop("disabled",true);
	$('#tm_competency_sel_dept').prop("disabled",true);
});

//19-SEP-2018 || MST || Organization - On select function
function get_org_unit_list(org_id){
	$('#tm_competency_sel_org_unit').empty().append($('<option>',{
		value:'',
		text:'-Select Org. Unit-',
		hidden:'hidden',
	}));
	$.ajax({
		type: 'POST',
		url: '/tm_org_unit/',
		timeout : 10000,
		data: {
			'org_id': org_id,
		},
		async: false,
	}).done(function(json_data){
		var data = JSON.parse(json_data);
		if (data.sel_org_unit != undefined){
			if (data.sel_org_unit.length > 0){
				$('#tm_competency_sel_org_unit').prop("disabled",false);
				for(i=0;i<data.sel_org_unit.length;i++)
				{
					$('#tm_competency_sel_org_unit').append($('<option>',{
						value:data.sel_org_unit[i].id,
						text:data.sel_org_unit[i].orgunit_name
					}))
				}
			} else {
				$("#tab_div").css("display","none");
				$("#tm_compt_nodata_div").css("display","block");
				$('#tm_competency_sel_org_unit').prop("disabled",true);
			}
		}
	})
}

//19-SEP-2018 || MST || Division - On select function
function get_division_list(org_unit_id){
	var org_id = $('#tm_competency_sel_org').val();
	if (org_unit_id != null){
		$('#tm_competency_sel_dept').empty().append($('<option>',{
			value:'',
			text:'-Select Division-',
			hidden:'hidden',
		}));
		$.ajax({
			type: 'POST',
			url: '/tm_division/',
			timeout : 10000,
			data: {
				'org_id': org_id,
				'org_unit_id': org_unit_id,
			},
			async: false,
		}).done(function(json_data){
			var data = JSON.parse(json_data);
			if (data.sel_division != undefined){
				if (data.sel_division.length > 0){
					$('#tm_competency_sel_dept').prop("disabled",false);
					for(i=0;i<data.sel_division.length;i++)
					{
						$('#tm_competency_sel_dept').append($('<option>',{
							value:data.sel_division[i].id,
							text:data.sel_division[i].name
						}))
					}
				} else {
					$("#tab_div").css("display","none");
					$("#tm_compt_nodata_div").css("display","block");
					$('#tm_competency_sel_dept').prop("disabled",true);
				}
			}
		});
	} else {
		$("#tab_div").css("display","none");
		$("#tm_compt_nodata_div").css("display","block");
		$('#tm_competency_sel_dept').prop("disabled",true);
	}
}

//19-SEP-2018 || MST || Employee List - On select function
function get_emp_list(division_id){
	var org_id = $('#tm_competency_sel_org').val();
	var org_unit_id = $('#tm_competency_sel_org_unit').val();
	if (division_id != null){
		$('#tm_competency_sel_emp').empty().append($('<option>',{
			value:'',
			text:'-Select Employee-',
			hidden:'hidden',
		}));
		$.ajax({
			type: 'POST',
			url: '/tm_comp_employee_list/',
			timeout : 10000,
			data: {
				'org_id': org_id,
				'org_unit_id': org_unit_id,
				'division_id': division_id,
			},
			async: false,
		}).done(function(json_data){
			var data = JSON.parse(json_data);
			if (data.sel_comp_employee != undefined){
				if (data.sel_comp_employee.length > 0){
					$('#tm_competency_sel_emp').prop("disabled",false);
					for(i=0;i<data.sel_comp_employee.length;i++)
					{
						$('#tm_competency_sel_emp').append($('<option>',{
							value:data.sel_comp_employee[i].id,
							text:data.sel_comp_employee[i].full_name
						}))
					}
				} else {
					$("#tab_div").css("display","none");
					$("#tm_compt_nodata_div").css("display","block");
					$('#tm_competency_sel_emp').prop("disabled",true);
					$("#year_qtr_sel_div").hide();
				}
			}
		});
	} else {
		$("#tab_div").css("display","none");
		$("#tm_compt_nodata_div").css("display","block");
		$('#tm_competency_sel_emp').prop("disabled",true);
		$("#year_qtr_sel_div").hide();
	}
}

//20-SEP-2018 || KAV || Get Role Id of Employee - AND Range Selector Function
function get_compt_emp_role_id(emp_id)
{
	tm_compt_emp_year(emp_id);
	$("#tm_compt_emp_year").prop("disabled",false);
	$("#tm_compt_emp_quarter").prop("disabled",false);
	$.ajax({
		type : 'POST',
		url : "/tm_compt_emp_detail/",
		timeout : 1000,
		data : {
			'emp_id':emp_id,
		},
	}).done(function(json_data){
		var data = JSON.parse(json_data);
		tech_data = data.tech_competency_summary;
		func_data = data.func_competency_summary;
		behav_data = data.behav_competency_summary;
		if(tech_data != 0)
		{
			if(tech_data.length>0)
			{
				$("#div_tech_slider").html('');
				var tech_rangeslider = '';
				for(i=0;i<tech_data.length;i++)
				{
					tech_cmpt_id = tech_data[i].compt_id;
					var id = i+1;
					tech_rangeslider += '<div class="col-lg-12 col-md-12">';
					tech_rangeslider += '<div class="col-lg-3">';
					tech_rangeslider += '<div class="">';
					tech_rangeslider += "<label class='rating-title'><span>"+id+"</span>"+tech_data[i].tech_summary+"</label>";
					tech_rangeslider += "</label></div></div>";
					tech_rangeslider += '<div class="col-lg-9">';
					tech_rangeslider += '<input id="'+tech_data[i].compt_id+'" name="'+tech_data[i].compt_id+'" class="ca_rangeSlider" type="text" value="" /></div></div>'
				}
				$("#div_tech_slider").append(tech_rangeslider);
				Tech_ComponentsIonSliders.init();
			}
		}
		if(func_data != 0)
		{
			if(func_data.length>0)
			{
				$("#div_func_slider").html('');
				var func_rangeslider = '';
				for(i=0;i<func_data.length;i++)
				{
					func_cmpt_id = func_data[i].compt_id;
					var id = i+1;
					func_rangeslider += '<div class="col-lg-12 col-md-12">';
					func_rangeslider += '<div class="col-lg-3">';
					func_rangeslider += '<div class="">';
					func_rangeslider += "<label class='rating-title'><span>"+id+"</span>"+func_data[i].func_summary+"</label>";
					func_rangeslider += "</label></div></div>";
					func_rangeslider += '<div class="col-lg-9">';
					func_rangeslider += '<input id="'+func_data[i].compt_id+'" name="'+func_data[i].compt_id+'" class="ca_rangeSlider" type="text" value="" /></div></div>';
				}
				$("#div_func_slider").append(func_rangeslider);
				Func_ComponentsIonSliders.init();
			}
		}
		if(behav_data != 0)
		{
			if(behav_data.length>0)
			{
				$("#div_behav_slider").html('');
				var behav_rangeslider = '';
				for(i=0;i<behav_data.length;i++)
				{
					behav_cmpt_id = behav_data[i].compt_id;
					var id = i+1;
					behav_rangeslider += '<div class="col-lg-12 col-md-12">';
					behav_rangeslider += '<div class="col-lg-3">';
					behav_rangeslider += '<div class="">';
					behav_rangeslider += "<label class='rating-title'><span>"+id+"</span>"+behav_data[i].behav_summary+"</label>";
					behav_rangeslider += "</label></div></div>";
					behav_rangeslider += '<div class="col-lg-9">';
					behav_rangeslider += '<input id="'+behav_data[i].compt_id+'" name="'+behav_data[i].compt_id+'" class="ca_rangeSlider" type="text" value="" /></div></div>';
				}
				$("#div_behav_slider").append(behav_rangeslider);
				Behav_ComponentsIonSliders.init();
			}
		}
	});
}

//21-SEP-2018 || KAV || Employee Year - On select function
function tm_compt_emp_year(emp_id){
	$.ajax({
		type: 'POST',
		url: '/tm_compt_emp_year/',
		timeout : 10000,
		data: {
			'emp_id': emp_id,
		},
		async: false,
	}).done(function(json_data){
		var data = JSON.parse(json_data);
		var current_year = (new Date).getFullYear();
		var from_year = data.joining_year;
		$("#tm_compt_emp_year").empty().append($('<option>',{
			value:'',
			text:'-Select Year-',
			hidden:'hidden',
		}));
		if (from_year != undefined || from_year != null){
			var year_diff = current_year - from_year;
			for(let i=year_diff; i>=0; i--){
				if ((from_year+i) == current_year){
					var current_month = (new Date).getMonth() + 1;
					if (!current_month.isBetween(1,3)){
						$('#tm_compt_emp_year').append($('<option>',{
							value:from_year+i,
							text:from_year+i
						}));
					}
				} else {
					$('#tm_compt_emp_year').append($('<option>',{
						value:from_year+i,
						text:from_year+i
					}));
				}
			}
			get_ca_emp_quarter();
			$("#year_qtr_sel_div").show();
		} else {
			$("#year_qtr_sel_div").hide();
		}
	});
}

//26-SEP-2018 || SMI || Year - On select function 
function get_ca_emp_quarter(sel_year){
	$("#tm_compt_emp_quarter").empty().append($('<option>',{
		value:'',
		text:'-Select Quarter-',
		hidden:'hidden',
	}));
	var current_year = (new Date).getFullYear();
	if (sel_year == current_year){
		var current_month = (new Date).getMonth() + 1;
		var quarter;
		if (current_month.isBetween(1,3)){
			quarter = 1;
		} else if (current_month.isBetween(4,6)){
			quarter = 2;
			$('#tm_compt_emp_quarter').append($('<option>',{value:1,text:'Quarter 1'}));
		} else if (current_month.isBetween(7,9)){
			quarter = 3;
			$('#tm_compt_emp_quarter').append($('<option>',{value:2,text:'Quarter 2'}));
			$('#tm_compt_emp_quarter').append($('<option>',{value:1,text:'Quarter 1'}));
		} else if (current_month.isBetween(10,12)){
			quarter = 4;
			$('#tm_compt_emp_quarter').append($('<option>',{value:3,text:'Quarter 3'}));
			$('#tm_compt_emp_quarter').append($('<option>',{value:2,text:'Quarter 2'}));
			$('#tm_compt_emp_quarter').append($('<option>',{value:1,text:'Quarter 1'}));
		}
	} else {
		$('#tm_compt_emp_quarter').append($('<option>',{value:4,text:'Quarter 4'}));
		$('#tm_compt_emp_quarter').append($('<option>',{value:3,text:'Quarter 3'}));
		$('#tm_compt_emp_quarter').append($('<option>',{value:2,text:'Quarter 2'}));
		$('#tm_compt_emp_quarter').append($('<option>',{value:1,text:'Quarter 1'}));
	}
	$("#tm_compt_emp_quarter").change();
}

//24-SEP-2018 || KAV || Competencies Data Fetching and Displaying
$("#tm_compt_emp_quarter").change(function(e){
	var emp_id = $('#tm_competency_sel_emp').val();
	var emp_year_val = $('#tm_compt_emp_year').val();
	var emp_quarter_val = $('#tm_compt_emp_quarter').val();
	$.ajax({
		type : 'POST',
		url : "/tm_compt_detail_fetch/",
		timeout : 1000,
		data : {
			'emp_id':emp_id,
			'emp_year_val':emp_year_val,
			'emp_quarter_val':emp_quarter_val,
		},
	}).done(function(json_data){
		$('.tab-pane').removeClass('active');
		$('.tab-pane:eq(0)').addClass('active');
		$('.tab-pane_steps li').removeClass('active');
		$('.tab-pane_steps li:eq(0)').addClass('active');
		var json_data = JSON.parse(json_data);
		if(json_data.comp_assess_details != undefined)
		{
			if(json_data.comp_assess_details.length != 0)
			{
				for(var i=0;i<json_data.comp_assess_details.length;i++)
				{
					if(json_data.comp_assess_details[i].refitem_category_code == "TECMP"){
						var work_area = json_data.comp_assess_details[i].comp_assess_work_areas;
						$('#tm_tech_work_areas').summernote('code', work_area);
						var pref_history = json_data.comp_assess_details[i].comp_assess_perf_history;
						$('#tm_tech_perf_history').summernote('code', pref_history);
						var arr = json_data.comp_assess_details[i].comp_assess_competency;
						var data = json_data.comp_assess_details[i].comp_assess_score;
						for(var j=0;j<arr.length;j++)
						{
							var update_range1_vals = $("#"+arr[j]+"").data('ionRangeSlider');
							update_range1_vals.update({
								from: data[j],
							});
						}
					} else if(json_data.comp_assess_details[i].refitem_category_code == "FNCMP"){
						var work_area = json_data.comp_assess_details[i].comp_assess_work_areas;
						$('#tm_func_work_areas').summernote('code', work_area);
						var pref_history = json_data.comp_assess_details[i].comp_assess_perf_history;
						$('#tm_func_perf_history').summernote('code', pref_history);
						var arr = json_data.comp_assess_details[i].comp_assess_competency;
						var data = json_data.comp_assess_details[i].comp_assess_score;
						for(var k=0;k<arr.length;k++)
						{
							var update_range1_vals = $("#"+arr[k]+"").data('ionRangeSlider');
							update_range1_vals.update({
								from: data[k],
							});
						}
					} else if(json_data.comp_assess_details[i].refitem_category_code == "BHCMP"){
						var work_area = json_data.comp_assess_details[i].comp_assess_work_areas;
						$('#tm_behav_work_areas').summernote('code', work_area);
						var pref_history = json_data.comp_assess_details[i].comp_assess_perf_history;
						$('#tm_behav_perf_history').summernote('code', pref_history);
						var arr = json_data.comp_assess_details[i].comp_assess_competency;
						var data = json_data.comp_assess_details[i].comp_assess_score;
						for(var l=0;l<arr.length;l++)
						{
							var update_range1_vals = $("#"+arr[l]+"").data('ionRangeSlider');
							update_range1_vals.update({
								from: data[l],
							});
						}
					}
				}
				action = 'update';
				btns_draw('update');
				$("#tab_div").css("display","block");
				$("#tm_compt_nodata_div").css("display","none");
			} else {
				action = 'add';
				btns_draw('add');
				tm_cancel_clear();
				$("#tab_div").css("display","block");
				$("#tm_compt_nodata_div").css("display","none");
			}
		} else {
			$("#tab_div").css("display","none");
			$("#tm_compt_nodata_div").css("display","block");
		}
	});
});

//19-SEP-2018 || KAV || Step 1 Technical Skill- Range Slider Initialization
var Tech_ComponentsIonSliders = {
		init:function() {
			var values = [1, 2, 3, 4, 5, 6];
			if(tech_data.length>0){
				for(i=0;i<tech_data.length;i++)
				{
					tech_cmpt_id = tech_data[i].compt_id
					$("#"+tech_cmpt_id+"").ionRangeSlider({
						type: "single",
						min: 1,
						max: 6,
						from: 1,
					});
				}
			}
		}
};

//19-SEP-2018 || KAV || Step 2 Function Skill - Range Slider Initialization
var Func_ComponentsIonSliders = {
		init:function() {
			var values = [1, 2, 3, 4, 5, 6];
			if(func_data.length>0){
				for(i=0;i<func_data.length;i++)
				{
					func_cmpt_id = func_data[i].compt_id
					$("#"+func_cmpt_id+"").ionRangeSlider({
						type: "single",
						min: 1,
						max: 6,
						from: 1,
					});
				}
			}
		}
};

//19-SEP-2018 || KAV || Step 3 Behaviour Skill - Range Slider Initialization
var Behav_ComponentsIonSliders = {
		init: function() {
			var values = [1, 2, 3, 4, 5, 6];
			if(behav_data.length>0)
			{
				for(i=0;i<behav_data.length;i++)
				{
					behav_cmpt_id = behav_data[i].compt_id;
					$("#"+behav_cmpt_id+"").ionRangeSlider({
						type: "single",
						min: 1,
						max: 6,
						from: 1,
					});
				}
			}
		}
};

//24-SEP-2018 || KAV || Competency Data Submit
function compt_assess_form_submit()
{
	$(".loader-wrapper").show();
	var emp_year_val = $('#tm_compt_emp_year').val();
	var emp_quarter_val = $('#tm_compt_emp_quarter').val();
	var emp_id = $('#tm_competency_sel_emp').val();
	$('.tab-pane').removeClass('active');
	$('.tab-pane').addClass('active');
	setTimeout(function(){
		// Getting Technical Assessment Data
		var tech_code = "TECMP";
		var tm_tech_form_data = getFormValues('#tm_tech_form');
		var tech_perf_history_data = $('#tm_tech_perf_history').summernote('code');
		var tech_work_areas= $('#tm_tech_work_areas').summernote('code');
		// Getting Functional Assessment Data
		var func_code = "FNCMP";
		var tm_func_form_data = getFormValues('#tm_func_form');
		var func_perf_history_data = $('#tm_func_perf_history').summernote('code');
		var func_work_areas= $('#tm_func_work_areas').summernote('code');
		// Getting Behavioural Assessment Data
		var behv_code = "BHCMP";
		var tm_behav_form_data = getFormValues('#tm_behav_form');
		var behav_perf_history_data = $('#tm_behav_perf_history').summernote('code');
		var behav_work_areas= $('#tm_behav_work_areas').summernote('code');
		var tm_main_form_data = getFormValues('#tm_main_form');
		$('.tab-pane').removeClass('active');
		$('.tab-pane:eq(0)').addClass('active');
		$('.tab-pane_steps li').removeClass('active');
		$('.tab-pane_steps li:eq(0)').addClass('active');
		$.ajax({
			type : 'POST',
			url : "/tm_comp_assess_detail_submit/",
			timeout : 10000,
			data : {
				'action':action,
				'emp_id':emp_id,
				'emp_year_val':emp_year_val,
				'emp_quarter_val':emp_quarter_val,
				'tech_code':tech_code,
				'tech_form_data':JSON.stringify(tm_tech_form_data),
				'tech_perf_history_data':tech_perf_history_data,
				'tech_work_areas':tech_work_areas,
				'func_code':func_code,
				'func_form_data':JSON.stringify(tm_func_form_data),
				'func_perf_history_data':func_perf_history_data,
				'func_work_areas':func_work_areas,
				'behv_code':behv_code,
				'behv_form_data':JSON.stringify(tm_behav_form_data),
				'behv_perf_history_data':behav_perf_history_data,
				'behv_work_areas':behav_work_areas,
			},
		}).done(function(json_data){
			var json_data = JSON.parse(json_data);
			if(json_data.status == 'NTE_01'){
				btns_draw('update');
				action = 'update';
				alert_lobibox("success", sysparam_datas_list[json_data.status]);    
			} else if(json_data.status == 'NTE_03'){
				alert_lobibox("success", sysparam_datas_list[json_data.status]);    
			} else {
				alert_lobibox("error", sysparam_datas_list[json_data.status]);    
			}
		});
	}, 1000);
}

//28-SEP-2018 || SMI || Competency Assessment Delete Function
function tm_delete_form(){
	var emp_year_val = $('#tm_compt_emp_year').val();
	var emp_quarter_val = $('#tm_compt_emp_quarter').val();
	var emp_id = $('#tm_competency_sel_emp').val();
	$.ajax({
		type : 'POST',
		url : "/tm_comp_assess_detail_remove/",
		timeout : 10000,
		data : {
			'emp_id':emp_id,
			'emp_year_val':emp_year_val,
			'emp_quarter_val':emp_quarter_val,
		},
	}).done(function(json_data){
		var json_data = JSON.parse(json_data);
		if(json_data.status == 'NTE_04'){
			alert_lobibox("success", sysparam_datas_list[json_data.status]); 
			btns_draw('add');
			action = 'add';
			tm_cancel_clear();
		}
	});
}

//28-SEP-2018 || SMI || Competency Assessment Details Cancel / Clear form confirmation function
function cancel_clear_confirm(func_name,action_name) {
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

//28-SEP-2018 || SMI || Cancel / Clear Function
function tm_cancel_clear(){
	var rangeslider_len = $(".ca_rangeSlider").length; 
	for(var i=0; i<rangeslider_len; i++){
		$('.ca_rangeSlider:eq('+i+')').data("ionRangeSlider").update({from:1});
	}
	var summernote_len = $(".summernote").length; 
	for(var i=0; i<summernote_len; i++){
		$('.summernote:eq('+i+')').summernote('code', '');
	}
	$('.tab-pane').removeClass('active');
	$('.tab-pane:eq(0)').addClass('active');
	$('.tab-pane_steps li').removeClass('active');
	$('.tab-pane_steps li:eq(0)').addClass('active');
}

//24-Sep-2018 || SMI || Common - Is Between function
if (typeof(Number.prototype.isBetween) === "undefined") {
	Number.prototype.isBetween = function(min, max, notBoundaries) {
		var between = false;
		if (notBoundaries) {
			if ((this < max) && (this > min)) between = true;
		} else {
			if ((this <= max) && (this >= min)) between = true;
		}
		return between;
	}
}

//28-Sep-2018 || SMI || Buttons Draw Function
function btns_draw(action_name){
	$("#tm_comp_btns_div").html('');
	var btnstr = '';
	if (action_name == 'add') {
		btnstr += '<button type="button" class="btn btn-warning btn-eql-wid btn-animate pull-right" onclick="cancel_clear_confirm(\''+"tm_cancel_clear"+'\')">Cancel / Clear</button>';
		btnstr += '<button type="button" id="tm_compt_form_submit" onclick="compt_assess_form_submit()" class="btn btn-success btn-eql-wid btn-animate">Add</button>';
	} else if (action_name == 'update') {
		btnstr += '<button type="button" class="btn btn-warning btn-eql-wid btn-animate pull-right" onclick="cancel_clear_confirm(\''+"tm_cancel_clear"+'\')">Cancel / Clear</button>';
		btnstr += '<button type="button" class="btn-animate btn btn-danger btn-eql-wid pull-right" onclick="removeConfirmation(\''+"tm_delete_form"+'\');">Remove</button>';
		btnstr += '<button type="button" id="tm_compt_form_update" onclick="compt_assess_form_submit()" class="btn btn-success btn-eql-wid btn-animate">Update</button>';            
	} 
	$("#tm_comp_btns_div").append(btnstr);
}