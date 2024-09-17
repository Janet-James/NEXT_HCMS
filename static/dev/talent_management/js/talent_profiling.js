//19-SEP-2018 || MST || Document Ready function for Talent Profiling
$(document).ready(function(){
	$(".profile_grid").click(function() {
		$("#profile_grid").toggleClass("open");
	});

	$(".switcher-close").click(function() {
		$("#profile_grid").removeClass("open");
	});
	$("#tm_tp_sel_org").select2({
		placeholder: "-Select Organization-",
		width: '100%',
	});
	$("#tm_tp_sel_org_unit").select2({
		placeholder: "-Select Org. Unit-",
		width: '100%',
	});
	$("#tm_tp_division").select2({
		placeholder: "-Select Division-",
		width: '100%',
	});
	$("#tm_tp_sel_emp").select2({
		placeholder: "-Select Employee-",
		width: '100%',
	});
	$("#tm_sel_quarter").select2({
		width: '100%',
	});
	year_slider_fun();
	$('#employeeSelect').modal('hide');

	$.validator.addMethod("greaterThans", function (value, element, param) {
		var $min = $(param);
		if (this.settings.onfocusout) {
			$min.off(".validate-greaterThan").on("blur.validate-greaterThan", function () {
				$(element).valid();
			});
		}
		return parseInt(value) > parseInt($min.val());
	}, "Max must be greater than min");
});

//20-SEP-2018 || MST || Document Ready function for Talent Profiling - Year Slider
function year_slider_fun(){
	$(".year_slider").slick({
		dots: false,
		infinite: false,
		slidesToShow: 6,
		slidesToScroll: 1,
		responsive: [{
			breakpoint: 1024,
			settings: {
				slidesToShow: 3,
				slidesToScroll: 3,
				infinite: true,
				dots: true
			}
		}, {
			breakpoint: 600,
			settings: {
				slidesToShow: 2,
				slidesToScroll: 2
			}
		}, {
			breakpoint: 480,
			settings: {
				slidesToShow: 1,
				slidesToScroll: 1
			}
		}
		]
	});
}

//19-SEP-2018 || MST || Organization Unit- On select function
function get_org_list(org_id){
	$('#tm_tp_sel_org_unit').empty().append($('<option>',{
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
		data = JSON.parse(json_data);

		if (data.sel_org_unit != undefined){
			if (data.sel_org_unit.length > 0){
				$('#tm_tp_sel_org_unit').prop("disabled",false);
				for(i=0;i<data.sel_org_unit.length;i++)
				{
					$('#tm_tp_sel_org_unit').append($('<option>',{
						value:data.sel_org_unit[i].id,
						text:data.sel_org_unit[i].orgunit_name
					}))
				}
			} else {
				$('#tm_tp_sel_org_unit').prop("disabled",true);
			}
		}
	})
}

//19-SEP-2018 || MST || Division - On select function
function get_division_list(org_unit_id){
	var org_id = $('#tm_tp_sel_org').val();
	if (org_unit_id != null){
		$('#tm_tp_division').empty().append($('<option>',{
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
			data = JSON.parse(json_data);
			if (data.sel_division != undefined){
				if (data.sel_division.length > 0){
					$('#tm_tp_division').prop("disabled",false);
					for(i=0;i<data.sel_division.length;i++)
					{
						$('#tm_tp_division').append($('<option>',{
							value:data.sel_division[i].id,
							text:data.sel_division[i].name
						}))
					}
				} else {
					$('#tm_tp_division').prop("disabled",true);
				}
			}
		});
	} else {
		$('#tm_tp_division').prop("disabled",true);
	}
}

//19-SEP-2018 || MST || Employee List - On select function
function get_emp_list(division_id){
	var org_id = $('#tm_tp_sel_org').val();
	var org_unit_id = $('#tm_tp_sel_org_unit').val();
	if (division_id != null){
		$('#tm_tp_sel_emp').empty().append($('<option>',{
			value:'',
			text:'-Select Employee-',
			hidden:'hidden',
		}));
		$.ajax({
			type: 'POST',
			url: '/tm_employee_list/',
			timeout : 10000,
			data: {
				'org_id': org_id,
				'org_unit_id': org_unit_id,
				'division_id': division_id,
			},
			async: false,
		}).done(function(json_data){
			data = JSON.parse(json_data);
			if (data.sel_employee != undefined){
				if (data.sel_employee.length > 0){
					$('#tm_tp_sel_emp').prop("disabled",false);
					for(i=0;i<data.sel_employee.length;i++)
					{
						$('#tm_tp_sel_emp').append($('<option>',{
							value:data.sel_employee[i].id,
							text:data.sel_employee[i].full_name
						}))
					}
				} else {
					$('#tm_tp_sel_emp').prop("disabled",true);
					$("#profile_grid").css("display", "none");
					$("#tm_perform_potential").css("display", "none");
					$("#tm_year_slider").html('');
					$('#tm_profile_nodata_div').show();
				}
			}
		});
	} else {
		$('#tm_tp_sel_emp').prop("disabled",true);
	}
}

//19-SEP-2018 || MST || Employee List - On select function
function tm_disp_profile(emp_id){
	$("#profile_grid").css("display", "block");
	$.ajax({
		type: 'POST',
		url: '/tm_emp_profile/',
		timeout : 10000,
		data: {
			'emp_id': emp_id,
		},
		async: false,
	}).done(function(json_data){
		data = JSON.parse(json_data);
		if (data.emp_profile != undefined){
			if (data.emp_profile.length > 0){
				$('#tm_profile_nodata_div').hide();
				if (data.emp_profile[0].img_name == null){
					$('#profile_img').attr('src', image_path + 'no_data.png');
				} else {
					$('#profile_img').attr('src', image_path + data.emp_profile[0].img_name);
				}
				$(".name").text(data.emp_profile[0].name);
				$(".position").text(data.emp_profile[0].role_title);
				if(data.emp_profile[0].work_email == null){
					$("#profile_email").text('-');
				} else{
					$("#profile_email").text(data.emp_profile[0].work_email);
				}
				if(data.emp_profile[0].work_mobile == null){
					$("#profile_mobile").text('-');
				} else{
					$("#profile_mobile").text(data.emp_profile[0].work_mobile);
				}
				$("#profile_location").text(data.emp_profile[0].country_name);
			}
		}
		$('#tm_sel_quarter').empty();
		$("#tm_year_slider").html('');
		var year_slider_data = '';
		year_slider_data += '<section class="year_slider slider">';
		if(data.total_years != undefined){
			$("#tm_perform_potential").css("display", "block");
			$('#tm_profile_nodata_div').hide();
			for( let i=data.total_years; i>=0; i--){
				var joining_year = data.joining_year+i;
				$('#tm_sel_quarter').append($('<option>',{
					value:joining_year,
					text:joining_year
				}));
			}
			for(i=0;i<data.total_years+1;i++){
				var joining_year = data.joining_year+i;
				year_slider_data += '<div class="item">';
				year_slider_data += '<div class="profile_item">';
				year_slider_data += '<span class="title">'+data.emp_profile[0].role_title+'</span> <a href="#" class="tag"></a> <span class="item_number">'+joining_year+'</span>';
				year_slider_data += '</div>';
				year_slider_data += '</div>';
			}
		} else {
			$("#tm_perform_potential").css("display", "none");
			$('#tm_profile_nodata_div').show();
		}
		year_slider_data += '</section>';
		$("#tm_year_slider").append(year_slider_data);
		year_slider_fun();
	});
}

function tp_add_edit_matrix(){
	$("#myModal1").modal('show');
	$("#sel_category").select2({
		placeholder: "-Select Category-",
		width: '100%',
	});
	$("#range_1_from").val('0');
	$("#range_3_to").val('100');
}

$("#range_1_to").on("keypress", function (evt) {
	var charCode = (evt.which) ? evt.which : event.keyCode;
	if (charCode > 31 && (charCode < 48 || charCode > 57)){
		return false;
	}
	return true;
});

$("#range_1_to").on("change", function () {
	var o = $(this).val();
	var range_1_val = parseInt(o)
	range_1_val = range_1_val + 1;
	$("#range_2_from").val(range_1_val);
});

$("#range_2_to").on("keypress", function (evt) {
	var charCode = (evt.which) ? evt.which : event.keyCode;
	if (charCode > 31 && (charCode < 48 || charCode > 57)) {
		return false;
	}
	return true;
});

$("#range_2_to").on("change", function () {
	var o = $(this).val();
	var range_1_val = parseInt(o)
	range_1_val = range_1_val + 1;
	$("#range_3_from").val(range_1_val);
});

var $validator = $('#add_edit_matrix').validate({
	rules: {
		sel_category: {
			required: true,
		},
		range_1_to:{
			required:true,
		},
		range_2_to:{
			required:true,
			greaterThans: "#range_2_from",
		},
	},
	//For custom messages
	messages: {
		sel_category:{
			required:"Select Category",
		},
		range_1_to:{
			required:"Enter Range 1 to details",
		},
		range_2_to:{
			required:"Enter Range 2 to details",
			greaterThans:"Should be greater than range 2 from value",
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

$('#sel_category').change(function(){
	var sel_category = document.getElementById("sel_category");
	var sel_category_text = sel_category.options[sel_category.selectedIndex].text;
	$.ajax({
		type: 'POST',
		url: '/tm_tp_matrix_fetch/',
		timeout : 10000,
		data: {
			'sel_category_text': sel_category_text,
		},
		async: false,
	}).done(function(json_data){
		var data = JSON.parse(json_data);
		if (data.status == "NTE_01") {
			if (data.matrix_fetched_values != undefined){
				if (data.matrix_fetched_values.length > 0){
					$('#range_1_to').val(data.matrix_fetched_values[0].tp_range_1_to);
					$('#range_2_from').val(data.matrix_fetched_values[0].tp_range_2_from);
					$('#range_2_to').val(data.matrix_fetched_values[0].tp_range_2_to);
					$('#range_3_from').val(data.matrix_fetched_values[0].tp_range_3_from);
				}
			}
		}
	});
});

$('#submit_modal').click(function () {
	var $valid = $('#add_edit_matrix').valid();
	if(!$valid){
		$('.val_message').prop('style', 'display:block;')
		return false;
	} else {
		var tm_tp_modal_data = getFormValues('#add_edit_matrix');
		var range_2_from = $('#range_2_from').val();
		var range_3_from = $('#range_3_from').val();
		var sel_category = document.getElementById("sel_category");
		var sel_category_text = sel_category.options[sel_category.selectedIndex].text;

		$.ajax({
			type: 'POST',
			url: '/tm_tp_matrix_create/',
			timeout : 10000,
			data: {
				'tm_tp_modal_data': JSON.stringify(tm_tp_modal_data),
				'range_2_from': range_2_from,
				'range_3_from': range_3_from,
				'sel_category_text': sel_category_text,
			},
			async: false,
		}).done(function(json_data){
			var data = JSON.parse(json_data);
			if (data.status == "NTE_02") {
				alert_lobibox("error", sysparam_datas_list[data.status]);
			} else if (data.status == "NTE_01") {
				alert_lobibox("success", sysparam_datas_list[data.status]);
				$("#cancel_clear").click();
			} else {
				alert_lobibox("error", sysparam_datas_list[data.status]);
			}
		});
	}
});

$('#cancel_clear').click(function () {
	$('#add_edit_matrix :input').val('');
	$('#sel_category').val('').trigger('change');
	$("#range_1_from").val('0');
	$("#range_3_to").val('100');
	$('.val_message').prop('style','display:none;');
});

function get_per_pot_values(year){
	var division_val = $('#tm_tp_division').val();
	var emp_id = $('#tm_tp_sel_emp').val();
	$.ajax({
		type: 'POST',
		url: '/tm_perf_pot_view/',
		timeout : 10000,
		data: {
			'division_val': division_val,
			'emp_id': emp_id,
			'selected_year': year
		},
		async: false,
	}).done(function(json_data){
		var data = JSON.parse(json_data);
		$('.rating_active').removeClass('rating_active');
		$(".rating_item").remove();
		for (var i = 0; i<data.matrix_values.length; i++){
			if (data.matrix_values[i].perf_score.isBetween(data.Perf_matrix_ranges[0].tp_range_1_from,data.Perf_matrix_ranges[0].tp_range_1_to) && data.matrix_values[i].comp_assess_score.isBetween(data.Pot_matrix_ranges[0].tp_range_3_from,data.Pot_matrix_ranges[0].tp_range_3_to)){
				$("#pt_td_1_1").addClass("rating_active");
				var str = '<div class="rating_item">Q'+data.matrix_values[i].assessment_quarter+'</div>'
				$("#pt_td_1_1").append(str);
			} else if (data.matrix_values[i].perf_score.isBetween(data.Perf_matrix_ranges[0].tp_range_2_from,data.Perf_matrix_ranges[0].tp_range_2_to) && data.matrix_values[i].comp_assess_score.isBetween(data.Pot_matrix_ranges[0].tp_range_3_from,data.Pot_matrix_ranges[0].tp_range_3_to)){
				$("#pt_td_1_2").addClass("rating_active");
				var str = '<div class="rating_item">Q'+data.matrix_values[i].assessment_quarter+'</div>'
				$("#pt_td_1_2").append(str);
			} else if (data.matrix_values[i].perf_score.isBetween(data.Perf_matrix_ranges[0].tp_range_3_from,data.Perf_matrix_ranges[0].tp_range_3_to) && data.matrix_values[i].comp_assess_score.isBetween(data.Pot_matrix_ranges[0].tp_range_3_from,data.Pot_matrix_ranges[0].tp_range_3_to)){
				$("#pt_td_1_3").addClass("rating_active");
				var str = '<div class="rating_item">Q'+data.matrix_values[i].assessment_quarter+'</div>'
				$("#pt_td_1_3").append(str);
			} else if (data.matrix_values[i].perf_score.isBetween(data.Perf_matrix_ranges[0].tp_range_1_from,data.Perf_matrix_ranges[0].tp_range_1_to) && data.matrix_values[i].comp_assess_score.isBetween(data.Pot_matrix_ranges[0].tp_range_2_from,data.Pot_matrix_ranges[0].tp_range_2_to)){
				$("#pt_td_2_1").addClass("rating_active");
				var str = '<div class="rating_item">Q'+data.matrix_values[i].assessment_quarter+'</div>'
				$("#pt_td_2_1").append(str);
			} else if (data.matrix_values[i].perf_score.isBetween(data.Perf_matrix_ranges[0].tp_range_2_from,data.Perf_matrix_ranges[0].tp_range_2_to) && data.matrix_values[i].comp_assess_score.isBetween(data.Pot_matrix_ranges[0].tp_range_2_from,data.Pot_matrix_ranges[0].tp_range_2_to)){
				$("#pt_td_2_2").append('');
				$("#pt_td_2_2").addClass("rating_active");
				str = '<div class="rating_item">Q'+data.matrix_values[i].assessment_quarter+'</div>'
				$("#pt_td_2_2").append(str);
			} else if (data.matrix_values[i].perf_score.isBetween(data.Perf_matrix_ranges[0].tp_range_3_from,data.Perf_matrix_ranges[0].tp_range_3_to) && data.matrix_values[i].comp_assess_score.isBetween(data.Pot_matrix_ranges[0].tp_range_2_from,data.Pot_matrix_ranges[0].tp_range_2_to)){
				$("#pt_td_2_3").addClass("rating_active");
				var str = '<div class="rating_item">Q'+data.matrix_values[i].assessment_quarter+'</div>'
				$("#pt_td_2_3").append(str);
			} else if (data.matrix_values[i].perf_score.isBetween(data.Perf_matrix_ranges[0].tp_range_1_from,data.Perf_matrix_ranges[0].tp_range_1_to) && data.matrix_values[i].comp_assess_score.isBetween(data.Pot_matrix_ranges[0].tp_range_1_from,data.Pot_matrix_ranges[0].tp_range_1_to)){
				$("#pt_td_3_1").addClass("rating_active");
				var str = '<div class="rating_item">Q'+data.matrix_values[i].assessment_quarter+'</div>'
				$("#pt_td_3_1").append(str);
			} else if (data.matrix_values[i].perf_score.isBetween(data.Perf_matrix_ranges[0].tp_range_2_from,data.Perf_matrix_ranges[0].tp_range_2_to) && data.matrix_values[i].comp_assess_score.isBetween(data.Pot_matrix_ranges[0].tp_range_1_from,data.Pot_matrix_ranges[0].tp_range_1_to)){
				$("#pt_td_3_2").addClass("rating_active");
				var str = '<div class="rating_item">Q'+data.matrix_values[i].assessment_quarter+'</div>'
				$("#pt_td_3_2").append(str);
			} else if (data.matrix_values[i].perf_score.isBetween(data.Perf_matrix_ranges[0].tp_range_3_from,data.Perf_matrix_ranges[0].tp_range_3_to) && data.matrix_values[i].comp_assess_score.isBetween(data.Pot_matrix_ranges[0].tp_range_1_from,data.Pot_matrix_ranges[0].tp_range_1_to)){
				$("#pt_td_3_3").addClass("rating_active");
				var str = '<div class="rating_item">Q'+data.matrix_values[i].assessment_quarter+'</div>'
				$("#pt_td_3_3").append(str);
			}
		}
	});
}

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