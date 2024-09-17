//27-SEP-2018 || MST || Employee Details Fetch - On load function
var colorcodes = ['#55bbff','#d2c3fc','#2ce7c7','#ea8ecc','#d277fe','#f6d166','#fda284','#ea8ecc','#fa8e8f'];
var comp_chart;
$(document).ready(function(){
	$(".profile_grid").click(function() {
		$("#profile_grid").toggleClass("open");
	});

	$(".switcher-close").click(function() {
		$("#profile_grid").removeClass("open");
	});
	$("#tm_sel_quarter, #my_skills_year, #my_perf_year, #my_perf_quarter, #my_fdbk_year, #my_fdbk_quarter").select2({
		width: '100%',
	});
	$('.profile-ul-li li:eq(0) a').addClass('li_focused');

	$.ajax({
		type: 'POST',
		url: '/tm_emp_profile/',
		timeout : 10000,
		async: false,
	}).done(function(json_data){
		data = JSON.parse(json_data);
		if (data.emp_profile != undefined){
			if (data.emp_profile.length > 0){
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
		$('#tm_sel_quarter, #my_skills_year, #my_perf_year, #my_fdbk_year').empty();
		$("#tm_year_slider").html('');
		if (data.total_years != undefined){
			$('#tm_perform_potential').show();
			$('#performance_table_full').show();
			$('#tm_my_perf').show();
			$('#my_perf_pot_nodata_div').prop('style','display:none;');
			$('.sel_quarter').show();
			var year_slider_data = '';
			year_slider_data += '<section class="year_slider slider">';
			for( let i=data.total_years; i>0; i--){
				var joining_year = data.joining_year+i;
				$('#tm_sel_quarter, #my_skills_year, #my_perf_year, #my_fdbk_year').append($('<option>',{
					value:joining_year,
					text:joining_year
				}))
			}
			$('#tm_sel_quarter, #my_skills_year, #my_perf_year, #my_fdbk_year').append($('<option>',{
				value:data.joining_year,
				text:data.joining_year
			}))
			for(i=0;i<data.total_years+1;i++){
				var joining_year = data.joining_year+i;
				year_slider_data += '<div class="item">';
				year_slider_data += '<div class="profile_item">';
				year_slider_data += '<span class="title">'+data.emp_profile[0].role_title+'</span> <a href="#" class="tag"></a> <span class="item_number">'+joining_year+'</span>';
				year_slider_data += '</div>';
				year_slider_data += '</div>';
			}
			year_slider_data += '</section>';
			$("#tm_year_slider").append(year_slider_data);
			year_slider_fun();
			$('.hide_my_feedback').show();
			$("#dept_feedback_no_data, #senior_feedback_no_data, #repo_feedback_no_data, #peer_feedback_no_data, #subordinate_feedback_no_data, #self_feedback_no_data").css("display","none");
			var prfl_year = $('#tm_sel_quarter').val();
			get_per_pot_values(prfl_year);
			get_fdbk_quarter(prfl_year);
		} else {
			$('#tm_my_perf').hide();
			$('#performance_table_full').hide();
			$('#my_perf_pot_nodata_div').prop('style','display:block;');
			$('.sel_quarter').hide();
			$('.hide_my_feedback').hide();
			$("#dept_feedback_no_data, #senior_feedback_no_data, #repo_feedback_no_data, #peer_feedback_no_data, #subordinate_feedback_no_data, #self_feedback_no_data").css("display","block");
		}
		
	});
	$('#my_skills_year').change();
	var perf_year = $('#my_perf_year').val();
	my_perf_year_chng(perf_year);
	var fdbk_year = $('#my_fdbk_year').val();
	my_fdbk_year_chng(fdbk_year);
});

//20-SEP-2018 || MST || My Talent Profile Right Side Links Click Function
$('.profile-ul-li li a').click(function(){
	var index = $(this).parent('li').index();
	$('.profile-ul-li li a').removeClass('li_focused');
	$('.profile-ul-li li:eq('+index+') a').addClass('li_focused');
	var text = $('.profile-ul-li li:eq('+index+')').text();
	text = $.trim(text.replace(/[\t\n]+/g, ' '));
	if (text == 'My Talent Profile'){
		$('#top_title').text(text);
		$('#tm_year_slider').prop('style','display:block;');
		$('#tm_perform_potential').prop('style','display:block;');
		$('#my_accolades').prop('style','display:none;');
		$('#tm_profile_skills').prop('style','display:none;');
		$('#tm_my_performance').prop('style','display:none;');
		$('#tm_my_feedback').prop('style','display:none;');
	} else if (text == 'My Accolades'){
		$('#top_title').text(text);
		$('#tm_year_slider').prop('style','display:none;');
		$('#tm_perform_potential').prop('style','display:none;');
		$('#my_accolades').prop('style','display:block;');
		$('#tm_profile_skills').prop('style','display:none;');
		$('#tm_my_performance').prop('style','display:none;');
		$('#tm_my_feedback').prop('style','display:none;');
		accolades_display();
	} else if (text == 'My Skills'){
		$('#top_title').text(text);
		$('#tm_year_slider').prop('style','display:none;');
		$('#tm_perform_potential').prop('style','display:none;');
		$('#my_accolades').prop('style','display:none;');
		$('#tm_profile_skills').prop('style','display:block;');
		$('#tm_my_performance').prop('style','display:none;');
		$('#tm_my_feedback').prop('style','display:none;');
	} else if (text == 'My Performance'){
		$('#top_title').text(text);
		$('#tm_year_slider').prop('style','display:none;');
		$('#tm_perform_potential').prop('style','display:none;');
		$('#my_accolades').prop('style','display:none;');
		$('#tm_profile_skills').prop('style','display:none;');
		$('#tm_my_performance').prop('style','display:block;');
		$('#tm_my_feedback').prop('style','display:none;');
	} else if (text == 'My Feedback'){
		$('#top_title').text(text);
		$('#tm_year_slider').prop('style','display:none;');
		$('#tm_perform_potential').prop('style','display:none;');
		$('#my_accolades').prop('style','display:none;');
		$('#tm_profile_skills').prop('style','display:none;');
		$('#tm_my_performance').prop('style','display:none;');
		$('#tm_my_feedback').prop('style','display:block;');
	}
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
		if (data.matrix_values != undefined){
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

//01-OCT-2018 || KAV || Fetching Accolades Details - Login User
function accolades_display()
{
	col_lg = 'col-lg-3';
	$("#accolades_list_div").innerHTML = "";
	$.ajax({
		url : '/my_accol_details_fetch/',
		type : 'POST',
		timeout : 10000,
		async: false,
	}).done(function(json_data){
		json_data = JSON.parse(json_data);
		strAppend = '';
		if (json_data.accolades_details != undefined){
			if (json_data.accolades_details.length != 0){
				for(i=0;i<json_data.accolades_details.length;i++)
				{
					if (json_data.accolades_details[i].img_name == null){
						image_name = 'no_data.png';
					} else{
						image_name = json_data.accolades_details[i].img_name;
					}
					strAppend += '<div class="'+col_lg+' col-md-3 col-sm-6 row-eq-height" onClick="accol_id_click(this.id)" id="'+json_data.accolades_details[i].id+'">';
					strAppend += '<div class="profileCard equhight employeeList">';
					strAppend += '<div class="panel-body"> <img class="img-circle img-inline pic_ina" src="'+image_path+image_name+'" width="75px" height="75px">';
					strAppend += '<div class="con_ina des-eql-height">';
					strAppend += '<h4>'+json_data.accolades_details[i].ca_accolades_title+'</h4><p>';
					strAppend += json_data.accolades_details[i].ca_accolades_year+'</p>';
					strAppend += '<p>'+ json_data.accolades_details[i].org_name  +'</p>';
					strAppend += '</div></div></div></div>';
				}
			} else {
				$("#my_accolt_nodata_div").css("display","block")
			}
		} else {
			$("#my_accolt_nodata_div").css("display","block")
		}
		$('#accolades_list_div').html(strAppend);
	});
}

//03-OCT-2018 || MST || My Skills - On Change function
$('#my_skills_year').change(function(){
	var skills_year_val = $('#my_skills_year').val();
	if (skills_year_val == null){
		$('.hide_skills_year').hide();
		$('#Total_skills_data').hide();
		$('#Total_skills_no_data').show();
		$("#tech_nodata_div").css('display','block');
		$("#func_nodata_div").css('display','block');
		$("#behav_nodata_div").css('display','block');
	} else {
		$('.hide_skills_year').show();
		var tech_str = ''; var func_str = ''; var behv_str = '';
		$('#tech_skill').html(tech_str);
		$('#func_skill').html(func_str);
		$('#behv_skill').html(behv_str);
		$.ajax({
			type: 'POST',
			url: '/tm_skills_values/',
			data: {
				'skills_year_val': skills_year_val,
			},
			timeout : 10000,
			async: false,
		}).done(function(json_data){
			var data = JSON.parse(json_data);
			if (data.skill_vals != undefined){
				if (data.skill_vals.length > 0){
					$('#Total_skills_data').show();
					$('#Total_skills_no_data').hide();
					for(i=0;i<data.skill_vals.length;i++){
						AmCharts.makeChart( data.skill_vals[i].comp_code, {
							"type": "serial",
							"rotate": true,
							"theme": "light",
							"autoMargins": false,
							"marginTop": 30,
							"marginLeft": 110,
							"marginBottom": 30,
							"marginRight": 30,
							"dataProvider": [ {
								"category": data.skill_vals[i].comp_name,
								"excelent": 20,
								"good": 20,
								"average": 20,
								"poor": 20,
								"bad": 20,
								"limit": data.skill_vals[i].req_score,
								"full": 100,
								"bullet": data.skill_vals[i].comp_assess_score
							} ],
							"valueAxes": [ {
								"maximum": 100,
								"stackType": "regular",
								"gridAlpha": 0
							} ],
							"startDuration": 1,
							"graphs": [ {
								"valueField": "full",
								"showBalloon": false,
								"type": "column",
								"lineAlpha": 0,
								"fillAlphas": 0.8,
								"fillColors": [ "#d5fcde" ],
							}, {
								"clustered": false,
								"columnWidth": 0.3,
								"fillAlphas": 1,
								"lineColor": "#86d6fb",
								"stackable": false,
								"type": "column",
								"valueField": "bullet"
							}, {
								"columnWidth": 0.5,
								"lineColor": "#000000",
								"lineThickness": 3,
								"noStepRisers": true,
								"stackable": false,
								"type": "step",
								"valueField": "limit"
							} ],
							"columnWidth": 1,
							"categoryField": "category",
							"categoryAxis": {
								"gridAlpha": 0,
								"position": "left",
								"ignoreAxisWidth": true,
								"autoWrap": true
							}
						} );
					}
				} else {
					$('#Total_skills_data').hide();
					$('#Total_skills_no_data').show();
				}
			}

			if (data.comp_skill_vals != undefined){
				if (data.comp_skill_vals.length > 0){
					$("#tech_nodata_div").css('display','none')
					$("#func_nodata_div").css('display','none')
					$("#behav_nodata_div").css('display','none')
					for(i=0;i<data.comp_skill_vals.length;i++){
						if (data.comp_skill_vals[i].comp_type == 'TECMP'){
							tech_str += '<div class="col-md-6 col-sm-12">';
							tech_str += '<div id="'+data.comp_skill_vals[i].comp_name+'" class="bullet-chart"></div></div>';
						} else if (data.comp_skill_vals[i].comp_type == 'FNCMP'){
							func_str += '<div class="col-md-6 col-sm-12">';
							func_str += '<div id="'+data.comp_skill_vals[i].comp_name+'" class="bullet-chart"></div></div>';
						} else if (data.comp_skill_vals[i].comp_type == 'BHCMP'){
							behv_str += '<div class="col-md-6 col-sm-12">';
							behv_str += '<div id="'+data.comp_skill_vals[i].comp_name+'" class="bullet-chart"></div></div>';
						}
					}
					$('#tech_skill').html(tech_str);
					$('#func_skill').html(func_str);
					$('#behv_skill').html(behv_str);
					for(i=0;i<data.comp_skill_vals.length;i++){
						if (data.comp_skill_vals[i].comp_type == 'TECMP'){
							var fill_color = "#fef4ce";
							var line_color = "#88f3a0";
						} else if (data.comp_skill_vals[i].comp_type == 'FNCMP'){
							var fill_color = "#ffe1b6";
							var line_color = "#c6c5ff";
						} else if (data.comp_skill_vals[i].comp_type == 'BHCMP'){
							var fill_color = "#d7f2ff";
							var line_color = "#ffa4a2";
						}
						AmCharts.makeChart( data.comp_skill_vals[i].comp_name, {
							"type": "serial",
							"rotate": true,
							"theme": "light",
							"autoMargins": false,
							"marginTop": 30,
							"marginLeft": 110,
							"marginBottom": 30,
							"marginRight": 30,
							"dataProvider": [ {
								"category": data.comp_skill_vals[i].comp_name,
								"excelent": 20,
								"good": 20,
								"average": 20,
								"poor": 20,
								"bad": 20,
								"limit": data.comp_skill_vals[i].req_score,
								"full": 100,
								"bullet": data.comp_skill_vals[i].comp_assess_score
							} ],
							"valueAxes": [ {
								"maximum": 100,
								"stackType": "regular",
								"gridAlpha": 0
							} ],
							"startDuration": 1,
							"graphs": [ {
								"valueField": "full",
								"showBalloon": false,
								"type": "column",
								"lineAlpha": 0,
								"fillAlphas": 0.8,
								"fillColors": fill_color,
							}, {
								"clustered": false,
								"columnWidth": 0.3,
								"fillAlphas": 1,
								"lineColor": line_color,
								"stackable": false,
								"type": "column",
								"valueField": "bullet"
							}, {
								"columnWidth": 0.5,
								"lineColor": "#000000",
								"lineThickness": 3,
								"noStepRisers": true,
								"stackable": false,
								"type": "step",
								"valueField": "limit"
							} ],
							"columnWidth": 1,
							"categoryField": "category",
							"categoryAxis": {
								"gridAlpha": 0,
								"position": "left",
								"ignoreAxisWidth": true,
								"autoWrap": true
							}
						} );
					}
				} else {
					if(tech_str == '')
					{
						$("#tech_nodata_div").css('display','block');
					}
					if(func_str == '')
					{
						$("#func_nodata_div").css('display','block');
					}
					if(behv_str == '')
					{
						$("#behav_nodata_div").css('display','block');
					}

				}
			}
		});
	}
});

//08-OCT-2018 || SMI || My Performance - Year On Change function
function my_perf_year_chng(perf_year){
	$('#my_perf_quarter').empty();
	var current_year = (new Date).getFullYear();
	if (perf_year == current_year){
		var current_month = (new Date).getMonth() + 1;
		var quarter;
		if (current_month.isBetween(1,3)){
			quarter = 1;
		} else if (current_month.isBetween(4,6)){
			quarter = 2;
			$('#my_perf_quarter').append($('<option>',{value:1,text:'Quarter 1'}));
		} else if (current_month.isBetween(7,9)){
			quarter = 3;
			$('#my_perf_quarter').append($('<option>',{value:2,text:'Quarter 2'}));
			$('#my_perf_quarter').append($('<option>',{value:1,text:'Quarter 1'}));
		} else if (current_month.isBetween(10,12)){
			quarter = 4;
			$('#my_perf_quarter').append($('<option>',{value:3,text:'Quarter 3'}));
			$('#my_perf_quarter').append($('<option>',{value:2,text:'Quarter 2'}));
			$('#my_perf_quarter').append($('<option>',{value:1,text:'Quarter 1'}));
		}
	} else {
		$('#my_perf_quarter').append($('<option>',{value:4,text:'Quarter 4'}));
		$('#my_perf_quarter').append($('<option>',{value:3,text:'Quarter 3'}));
		$('#my_perf_quarter').append($('<option>',{value:2,text:'Quarter 2'}));
		$('#my_perf_quarter').append($('<option>',{value:1,text:'Quarter 1'}));
	}
	var perf_quarter = $("#my_perf_quarter").val();
	my_perf_quarter_chng(perf_quarter);
}

//12-OCT-2018 || SMI || My Performance - Quarter On Change function
function my_perf_quarter_chng(perf_quarter){
	var perf_year = $('#my_perf_year').val();
	//15-OCT-2018 || SMI || My Performance - Overall Chart Formation
	$.ajax({
		type: 'POST',
		url: '/tm_my_perf_data/',
		data: {
			'perf_year': perf_year,
			'perf_quarter': perf_quarter,
		},
		timeout : 10000,
		async: false,
	}).done(function(json_data){
		var data = JSON.parse(json_data);
		if (data.my_perf_data != undefined){
			if (data.my_perf_data.length != 0){
				$('#my_perf_data').show();
				$('#my_perf_no_data').hide();
				var chartData = data.my_perf_data;
				var graphData = [];
				var i = 1;
				for(key in data.my_perf_data[0]){
					if(key != 'kra'){
						var graph_dict = {};
						graph_dict["balloonText"] = key+":[[value]]";
						graph_dict["fillAlphas"] = 0.7;
						graph_dict["id"] = "AmGraph-"+(i);
						graph_dict["lineAlpha"] = 0.2;
						graph_dict["title"] = key;
						graph_dict["type"] = "column";
						graph_dict["valueField"] = key;
						graph_dict["fillColors"] = colorcodes[i-1];
						graphData.push(graph_dict);
						i = i+1;
					}
				}
				AmCharts.makeChart("tm_my_perf_overall_chart", {
					"type": "serial",
					"fontFamily": "'Poppins', sans-serif",
					"theme": "light",
					"categoryField": "kra",
					"rotate": true,
					"startDuration": 1,
					"categoryAxis": {
						"gridPosition": "start",
						"autoWrap": true
					},
					"trendLines": [],
					"graphs": graphData,
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

				//16-OCT-2018 || SMI || My Performance - Comparison Chart Formation
				var comp_chartData = data.my_perf_comp_data;
				var comp_graphData = [];
				var j = 1;
				for(key in data.my_perf_comp_data[0]){
					if(key != 'kra' && key != 'kra_id'){
						var graph_dict = {};
						graph_dict["balloonText"] = key+":[[value]]";
						graph_dict["fillAlphas"] = 0.7;
						graph_dict["id"] = "AmGraph-"+(j);
						graph_dict["lineAlpha"] = 0.2;
						graph_dict["title"] = key;
						graph_dict["type"] = "column";
						graph_dict["valueField"] = key;
						graph_dict["fillColors"] = colorcodes[j-1];
						comp_graphData.push(graph_dict);
						j = j+1;
					}
				}
				comp_chart = AmCharts.makeChart("tm_my_perf_comp_chart", {
					"type": "serial",
					"fontFamily": "'Poppins', sans-serif",
					"theme": "light",
					"categoryField": "kra",
					"rotate": false,
					"startDuration": 1,
					"categoryAxis": {
						"gridPosition": "start",
						"autoWrap": true
					},
					"trendLines": [],
					"graphs": comp_graphData,
					"guides": [],
					"valueAxes": [{
						"axisAlpha": 0,
						"position": "left",
						"title": "Resources"
					}],
					"allLabels": [],
					"balloon": {},
					"titles": [],
					"dataProvider": comp_chartData,
					"export": {
						"enabled": false
					}
				});
				comp_chart.addListener("rendered", addListeners);
				setTimeout(addListeners, 1000);
				
				$('#selected_kra').text('Selected KRA Scores');
				$('#selected_kra_comp').text('Selected KRA Scores with Comparison');
				$('#tm_my_perf_selected_chart').html('<h3 class="no-data">No data available</h3>');
				$('#tm_my_perf_selected_scores').html('<h3 class="no-data">No data available</h3>');

			} else{
				$('#my_perf_data').hide();
				$('#my_perf_no_data').show();
			}
		} else {
			$('#my_perf_data').hide();
			$('#my_perf_no_data').show();
		}
	});
}

function addListeners() {
	var categoryAxis = comp_chart.categoryAxis;
	categoryAxis.addListener("clickItem", handleClick);
	categoryAxis.addListener("rollOverItem", handleOver);
	categoryAxis.addListener("rollOutItem", handleOut);
}

function handleOut(event) {
	event.target.setAttr("cursor", "default");
	event.target.setAttr("fill", "#000000");
}

function handleOver(event) {
	event.target.setAttr("cursor", "pointer");
	event.target.setAttr("fill", "#CC0000");
}

//01-NOV-2018 || SMI || My Performance - Selected KRA - handle click function
function handleClick(event) {
	$('#selected_kra').text('Selected KRA Scores - '+event.serialDataItem.dataContext.kra);
	$('#selected_kra_comp').text('Selected KRA Scores with Comparison - '+event.serialDataItem.dataContext.kra);
	var perf_year = $('#my_perf_year').val();
	var perf_quarter = $("#my_perf_quarter").val();
	$.ajax({
		type: 'POST',
		url: '/tm_my_perf_sel_kra_data/',
		data: {
			'perf_year': perf_year,
			'perf_quarter': perf_quarter,
			'sel_kra': event.serialDataItem.dataContext.kra,
			'sel_kra_id': event.serialDataItem.dataContext.kra_id,
		},
		timeout : 10000,
		async: false,
	}).done(function(json_data){
		var data = JSON.parse(json_data);
		if (data.my_perf_data != undefined){
			if (data.my_perf_data.length != 0){
				$('#my_perf_data').show();
				$('#my_perf_no_data').hide();
				var chartData = data.my_perf_data;
				var graphData = [];
				var labelData = [];
				var j = 115; var k = 105; var z = -3;
				var i = 1;
				for(key in data.my_perf_data[0]){
					if(key != 'kra'){
						var graph_dict = {}; var band_dict = {}; var label_dict = {};
						var f = j-15; var j = f;
						var l = k-15; var k = l;
						var h = z+7; var z = h;
						graph_dict['color'] = '#eee';
						graph_dict['startValue'] = 0;
						graph_dict['endValue'] = 100;
						graph_dict['radius'] = String(f)+'%';
						graph_dict['innerRadius'] = String(l)+'%';
						graphData.push(graph_dict);

						band_dict["color"] = colorcodes[i-1];
						band_dict['startValue'] = 0;
						band_dict['endValue'] = data.my_perf_data[0][key];
						band_dict['radius'] = String(f)+'%';
						band_dict['innerRadius'] = String(l)+'%';
						band_dict['balloonText'] = String(data.my_perf_data[0][key])+'%';
						graphData.push(band_dict);

						label_dict['text'] = key;
						label_dict['x'] = '49%';
						label_dict['y'] = String(h)+'%';
						label_dict['size'] = 15;
						label_dict['bold'] = true;
						label_dict['color'] = colorcodes[i-1];
						label_dict['align'] = "right";
						labelData.push(label_dict)
						i = i+1;
					}
				}
				AmCharts.makeChart("tm_my_perf_selected_chart", {
					"type": "gauge",
					"fontFamily": "'Poppins', sans-serif",
					"theme": "light",
					"axes": [{
						"axisAlpha": 0,
						"tickAlpha": 0,
						"labelsEnabled": false,
						"startValue": 0,
						"endValue": 100,
						"startAngle": 0,
						"endAngle": 270,
						"bands": graphData
					}],
					"allLabels": labelData,
					"export": {
						"enabled": false
					}
				});
			}
		}
		if (data.my_perf_comp_data != undefined){
			if (data.my_perf_comp_data.length != 0){
				var chartData = data.my_perf_comp_data;
				AmCharts.makeChart("tm_my_perf_selected_scores", {
					"fontFamily": "'Poppins', sans-serif",
					"type": "serial",
					"dataProvider": chartData,
					"valueAxes": [{
						"unit": "%",
						"position": "left",
						"title": "Resources",
					}],
					"startDuration": 1,
					"graphs": [{
						"balloonText": "[[category]] (current_rating): <b>[[value]]</b>",
						"fillAlphas": 0.9,
						"lineAlpha": 0.2,
						"title": "current_rating",
						"type": "column",
						"valueField": "current_rating",
						"fillColors": "#55bbff"
					}, {
						"balloonText": "[[category]] (prev_rating): <b>[[value]]</b>",
						"fillAlphas": 0.9,
						"lineAlpha": 0.2,
						"title": "prev_rating",
						"type": "column",
						"clustered":false,
						"columnWidth":0.5,
						"valueField": "prev_rating",
						"fillColors": "#d2c3fc"
					},{
						"valueAxis": "v2",
						"balloonText": "<b>[[title]]</b><br><span style='font-size:14px'>[[category]]: <b>[[value]]%</b></span>",
						"lineAlpha": 0,
						"bullet": "round",
						"bulletSize": 20,
						"title": "Gap Calculation",
						"type": "line",
						"valueField": "gap",
						"bulletColor": "#fa8e8f"
					}],
					"plotAreaFillAlphas": 0.1,
					"categoryField": "assessor_type",
					"categoryAxis": {
						"gridPosition": "start"
					},
					"export": {
						"enabled": false
					}
				});
			}
		}
	});	
}

//08-OCT-2018 || SMI || My Feedback - Year On Change function
function my_fdbk_year_chng(fdbk_year){
	$('#my_fdbk_data').show();
	$('#my_fdbk_no_data').hide();
}

//26-SEP-2018 || SMI || Year - On select function 
function get_fdbk_quarter(sel_year){
	$("#my_fdbk_quarter").html("");
	var current_year = (new Date).getFullYear();
	if (sel_year == current_year){
		var current_month = (new Date).getMonth() + 1;
		var quarter;
		if (current_month.isBetween(1,3)){
			quarter = 1;
		} else if (current_month.isBetween(4,6)){
			quarter = 2;
			$('#my_fdbk_quarter').append($('<option>',{value:1,text:'Quarter 1'}));
		} else if (current_month.isBetween(7,9)){
			quarter = 3;
			$('#my_fdbk_quarter').append($('<option>',{value:2,text:'Quarter 2'}));
			$('#my_fdbk_quarter').append($('<option>',{value:1,text:'Quarter 1'}));
		} else if (current_month.isBetween(10,12)){
			quarter = 4;
			$('#my_fdbk_quarter').append($('<option>',{value:3,text:'Quarter 3'}));
			$('#my_fdbk_quarter').append($('<option>',{value:2,text:'Quarter 2'}));
			$('#my_fdbk_quarter').append($('<option>',{value:1,text:'Quarter 1'}));
		}
	} else {
		$('#my_fdbk_quarter').append($('<option>',{value:4,text:'Quarter 4'}));
		$('#my_fdbk_quarter').append($('<option>',{value:3,text:'Quarter 3'}));
		$('#my_fdbk_quarter').append($('<option>',{value:2,text:'Quarter 2'}));
		$('#my_fdbk_quarter').append($('<option>',{value:1,text:'Quarter 1'}));
	}
	$("#my_fdbk_quarter").change();
}

//01-OCT-2018 || KAV || Fetching Accolades Details - Login User
function feedback_display(quarter_val)
{
	var feedback_year = $("#my_fdbk_year").val();
	col_lg = 'col-lg-3';
	$("#dept_feedback_list").innerHTML = "";
	$("#senior_feedback_list").innerHTML = "";
	$("#repo_feedback_list").innerHTML = "";
	$("#peer_feedback_list").innerHTML = "";
	$("#subordinate_feedback_list").innerHTML = "";
	$("#self_feedback_list").innerHTML = "";
	$.ajax({
		url : '/my_feedback_details_fetch/',
		type : 'POST',
		timeout : 10000,
		async: false,
		data : {
			'my_feedback_quarter':quarter_val,
			'my_feedback_year':feedback_year,
		}
	}).done(function(json_data){
		var json_data = JSON.parse(json_data);
		if (json_data != undefined &&  json_data['status'] != 'NTE_02'){
			if (json_data.length > 0){
				$('#my_fdbk_data').show();
				$('#my_fdbk_no_data').hide();
				$.each( json_data[0], function( key, value ) {  
					if (json_data[0][key].length > 0){
						var strAppend = '';
						$("#"+key+"_feedback_no_data").css("display","none");
						$("#"+key+"_feedback_list").css("display","block");
						for(i=0;i<json_data[0][key].length;i++){
							strAppend += '<div class="'+col_lg+' col-md-3 col-sm-6 row-eq-height">';
							strAppend += '<div class="profileCard equhight employeeList">';
							strAppend += '<div class="panel-body">';
							if (json_data[0][key][i].image == null){
								strAppend += '<img class="img-circle img-inline pic_ina" src="'+image_path+'no_data.png" width="75px" height="75px">';
							} else {
								strAppend += '<img class="img-circle img-inline pic_ina" src="'+image_path+json_data[0][key][i].image+'" width="75px" height="75px">';
							}
							strAppend += '<div class="con_ina des-eql-height">';
							strAppend += '<h4>'+json_data[0][key][i].assessor_name+'</h4><p>';
							strAppend += json_data[0][key][i].assessor_feedback+'<p>';
							strAppend += '</div></div></div></div>';
						}
						$("#"+key+"_feedback_list").html(strAppend); 
					} else {
						$("#"+key+"_feedback_no_data").css("display","block");
						$("#"+key+"_feedback_list").css("display","none");
					}
				});
			} 
		} else{
			$('#my_fdbk_data').hide();
			$('#my_fdbk_no_data').show();
		}
	});
}