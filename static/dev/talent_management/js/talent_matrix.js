//19-SEP-2018 || SMI || Document Ready function for Talent Matrix
$(document).ready(function(){
	$("#tm_matrix_sel_org").select2({
		placeholder: "-Select Organization-",
		width: '100%',
	});
	$("#tm_matrix_sel_org_unit").select2({
		placeholder: "-Select Org. Unit-",
		width: '100%',
	});
	$("#tm_matrix_sel_dept").select2({
		placeholder: "-Select Division-",
		width: '100%',
	});
	$("#tm_matrix_sel_emp").select2({
		placeholder: "-Select Employee-",
		width: '100%',
	});
	$("#tm_matrix_year").select2({
		width: '100%',
	});
	$("#tm_matrix_quarter").select2({
		width: '100%',
	});
});

//19-SEP-2018 || MST || Organization - On select function
function get_org_unit_list(org_id){
	$('#tm_matrix_sel_org_unit').empty().append($('<option>',{
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
				$('#tm_matrix_sel_org_unit').prop("disabled",false);
				for(i=0;i<data.sel_org_unit.length;i++)
				{
					$('#tm_matrix_sel_org_unit').append($('<option>',{
						value:data.sel_org_unit[i].id,
						text:data.sel_org_unit[i].orgunit_name
					}))
				}
			} else {
				$('#tm_matrix_sel_org_unit').prop("disabled",true);
			}
		}
	})
}

//19-SEP-2018 || MST || Organization Unit - On select function
function get_division_list(org_unit_id){
	var org_id = $('#tm_matrix_sel_org').val();
	if (org_unit_id != null){
		$('#tm_matrix_sel_dept').empty().append($('<option>',{
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
					$('#tm_matrix_sel_dept').prop("disabled",false);
					for(i=0;i<data.sel_division.length;i++)
					{
						$('#tm_matrix_sel_dept').append($('<option>',{
							value:data.sel_division[i].id,
							text:data.sel_division[i].name
						}))
					}
				} else {
					$("#tm_matrix_year_qtr").hide();
					$('#tm_matrix_sel_dept').prop("disabled",true);
				}
			}
		});
	} else {
		$("#tm_matrix_year_qtr").hide();
		$('#tm_matrix_sel_dept').prop("disabled",true);
	}
}

//26-SEP-2018 || SMI || Division - On select function
function get_emp_matrix_year(division_id){
	if (division_id != null){
		$("#tm_matrix_year_qtr").show();
		$.ajax({
			type: 'POST',
			url: '/tm_get_year/',
			timeout : 10000,
			data: {
				'division_id': division_id,
			},
			async: false,
		}).done(function(json_data){
			var data = JSON.parse(json_data);
			var current_year = (new Date).getFullYear();
			var from_year = data.tm_matrix_year[0].year;
			$('#tm_matrix_year').empty();
			if (from_year != undefined || from_year != null){
				var year_diff = current_year - from_year;
				for(let i=year_diff; i>=0; i--){
					if ((from_year+i) == current_year){
						var current_month = (new Date).getMonth() + 1;
						if (!current_month.isBetween(1,3)){
							$('#tm_matrix_year').append($('<option>',{
								value:from_year+i,
								text:from_year+i
							}));
						}
					} else {
						$('#tm_matrix_year').append($('<option>',{
							value:from_year+i,
							text:from_year+i
						}));
					}
				}
			} else {
				$("#tm_matrix_year_qtr").hide();
			}
			get_emp_matrix_month($('#tm_matrix_year').val());
		});
	} else {
		$("#tm_matrix_year_qtr").hide();
	}
}

//26-SEP-2018 || SMI || Year - On select function 
function get_emp_matrix_month(sel_year){
	$('#tm_matrix_quarter').empty();
	var current_year = (new Date).getFullYear();
	if (sel_year == current_year){
		var current_month = (new Date).getMonth() + 1;
		var quarter;
		if (current_month.isBetween(1,3)){
			quarter = 1;
		} else if (current_month.isBetween(4,6)){
			quarter = 2;
			$('#tm_matrix_quarter').append($('<option>',{value:1,text:'Quarter 1'}));
		} else if (current_month.isBetween(7,9)){
			quarter = 3;
			$('#tm_matrix_quarter').append($('<option>',{value:2,text:'Quarter 2'}));
			$('#tm_matrix_quarter').append($('<option>',{value:1,text:'Quarter 1'}));
		} else if (current_month.isBetween(10,12)){
			quarter = 4;
			$('#tm_matrix_quarter').append($('<option>',{value:3,text:'Quarter 3'}));
			$('#tm_matrix_quarter').append($('<option>',{value:2,text:'Quarter 2'}));
			$('#tm_matrix_quarter').append($('<option>',{value:1,text:'Quarter 1'}));
		}
	} else {
		$('#tm_matrix_quarter').append($('<option>',{value:4,text:'Quarter 4'}));
		$('#tm_matrix_quarter').append($('<option>',{value:3,text:'Quarter 3'}));
		$('#tm_matrix_quarter').append($('<option>',{value:2,text:'Quarter 2'}));
		$('#tm_matrix_quarter').append($('<option>',{value:1,text:'Quarter 1'}));
	}
	get_emp_matrix_info();
}

//20-SEP-2018 || SMI || Division - On select function
function get_emp_matrix_info(){
	var division_id = $("#tm_matrix_sel_dept").val();
	var assess_year = $("#tm_matrix_year").val();
	var assess_qtr = $("#tm_matrix_quarter").val();
	if (division_id != null && assess_year != null  && assess_qtr != null){
		$.ajax({
			type: 'POST',
			url: '/tm_get_matrix_data/',
			timeout : 10000,
			data: {
				'division_id': division_id,
				'assess_year': assess_year,
				'assess_qtr': assess_qtr
			},
			async: false,
		}).done(function(json_data){
			var data = JSON.parse(json_data);
			if (data.tm_matrix_data != undefined){
				if (data.tm_matrix_data.length == 0){
					$('#tm_matrix_main_div').hide();
					$('#tm_matrix_nodata_div').show();
				} else {
					var pe1_po1_span = 0; var pe2_po1_span = 0; var pe3_po1_span = 0; 
					var pe1_po2_span = 0; var pe2_po2_span = 0; var pe3_po2_span = 0; 
					var pe1_po3_span = 0; var pe2_po3_span = 0; var pe3_po3_span = 0;
					var pe1_po1 = ''; var pe2_po1 = ''; var pe3_po1 = ''; 
					var pe1_po2 = ''; var pe2_po2 = ''; var pe3_po2 = ''; 
					var pe1_po3 = ''; var pe2_po3 = ''; var pe3_po3 = '';
					$('.pe_po_span').text('0');
					$('.pe_po_ul').html('');
					for (var i = 0; i<data.tm_matrix_data.length; i++){
						if (data.tm_matrix_data[i].img_name == null){
							var image_name = 'no_data.png';
						} else {
							var image_name = data.tm_matrix_data[i].img_name;
						}
						var strAppend = '';
						strAppend += '<li class="tooltip-hvr tooltip-effect" id="'+data.tm_matrix_data[i].employee_id+'">';
						strAppend += '<span class="tooltip-item img-overlay">';
						strAppend += '<img alt="" src="'+image_path+image_name+'"></span>';
						strAppend += '<span class="tooltip-content clearfix">';
						strAppend += '<span class="tooltip-text">'+data.tm_matrix_data[i].emp_name+'</span></span></li>';
						if (data.tm_matrix_data[i].perf_score.isBetween(data.Perf_matrix_ranges[0].tp_range_3_from,data.Perf_matrix_ranges[0].tp_range_3_to) && data.tm_matrix_data[i].comp_assess_score.isBetween(data.Pot_matrix_ranges[0].tp_range_1_from,data.Pot_matrix_ranges[0].tp_range_1_to)){
							pe1_po1_span += 1;
							pe1_po1 += strAppend;
							$('#pe1_po1_span').text(pe1_po1_span);
							$("#pe1_po1").html(pe1_po1);
						} else if (data.tm_matrix_data[i].perf_score.isBetween(data.Perf_matrix_ranges[0].tp_range_2_from,data.Perf_matrix_ranges[0].tp_range_2_to) && data.tm_matrix_data[i].comp_assess_score.isBetween(data.Pot_matrix_ranges[0].tp_range_1_from,data.Pot_matrix_ranges[0].tp_range_1_to)){
							pe2_po1_span += 1;
							pe2_po1 += strAppend;
							$('#pe2_po1_span').text(pe2_po1_span);
							$("#pe2_po1").html(pe2_po1);
						} else if (data.tm_matrix_data[i].perf_score.isBetween(data.Perf_matrix_ranges[0].tp_range_1_from,data.Perf_matrix_ranges[0].tp_range_1_to) && data.tm_matrix_data[i].comp_assess_score.isBetween(data.Pot_matrix_ranges[0].tp_range_1_from,data.Pot_matrix_ranges[0].tp_range_1_to)){
							pe3_po1_span += 1;
							pe3_po1 += strAppend;
							$('#pe3_po1_span').text(pe3_po1_span);
							$("#pe3_po1").html(pe3_po1);
						} else if (data.tm_matrix_data[i].perf_score.isBetween(data.Perf_matrix_ranges[0].tp_range_3_from,data.Perf_matrix_ranges[0].tp_range_3_to) && data.tm_matrix_data[i].comp_assess_score.isBetween(data.Pot_matrix_ranges[0].tp_range_2_from,data.Pot_matrix_ranges[0].tp_range_2_to)){
							pe1_po2_span += 1;
							pe1_po2 += strAppend;
							$('#pe1_po2_span').text(pe1_po2_span);
							$("#pe1_po2").html(pe1_po2);
						} else if (data.tm_matrix_data[i].perf_score.isBetween(data.Perf_matrix_ranges[0].tp_range_2_from,data.Perf_matrix_ranges[0].tp_range_2_to) && data.tm_matrix_data[i].comp_assess_score.isBetween(data.Pot_matrix_ranges[0].tp_range_2_from,data.Pot_matrix_ranges[0].tp_range_2_to)){
							pe2_po2_span += 1;
							pe2_po2 += strAppend;
							$('#pe2_po2_span').text(pe2_po2_span);
							$("#pe2_po2").html(pe2_po2);
						} else if (data.tm_matrix_data[i].perf_score.isBetween(data.Perf_matrix_ranges[0].tp_range_1_from,data.Perf_matrix_ranges[0].tp_range_1_to) && data.tm_matrix_data[i].comp_assess_score.isBetween(data.Pot_matrix_ranges[0].tp_range_2_from,data.Pot_matrix_ranges[0].tp_range_2_to)){
							pe3_po2_span += 1;
							pe3_po2 += strAppend;
							$('#pe3_po2_span').text(pe3_po2_span);
							$("#pe3_po2").html(pe3_po2);
						} else if (data.tm_matrix_data[i].perf_score.isBetween(data.Perf_matrix_ranges[0].tp_range_3_from,data.Perf_matrix_ranges[0].tp_range_3_to) && data.tm_matrix_data[i].comp_assess_score.isBetween(data.Pot_matrix_ranges[0].tp_range_3_from,data.Pot_matrix_ranges[0].tp_range_3_to)){
							pe1_po3_span += 1;
							pe1_po3 += strAppend;
							$('#pe1_po3_span').text(pe1_po3_span);
							$("#pe1_po3").html(pe1_po3);
						} else if (data.tm_matrix_data[i].perf_score.isBetween(data.Perf_matrix_ranges[0].tp_range_2_from,data.Perf_matrix_ranges[0].tp_range_2_to) && data.tm_matrix_data[i].comp_assess_score.isBetween(data.Pot_matrix_ranges[0].tp_range_3_from,data.Pot_matrix_ranges[0].tp_range_3_to)){
							pe2_po3_span += 1;
							pe2_po3 += strAppend;
							$('#pe2_po3_span').text(pe2_po3_span);
							$("#pe2_po3").html(pe2_po3);
						} else if (data.tm_matrix_data[i].perf_score.isBetween(data.Perf_matrix_ranges[0].tp_range_1_from,data.Perf_matrix_ranges[0].tp_range_1_to) && data.tm_matrix_data[i].comp_assess_score.isBetween(data.Pot_matrix_ranges[0].tp_range_3_from,data.Pot_matrix_ranges[0].tp_range_3_to)){
							pe3_po3_span += 1;
							pe3_po3 += strAppend;
							$('#pe3_po3_span').text(pe3_po3_span);
							$("#pe3_po3").html(pe3_po3);
						}
					}
					$('#tm_matrix_main_div').show();
					$('#tm_matrix_nodata_div').hide();
				}
			} else {
				$('#tm_matrix_main_div').hide();
				$('#tm_matrix_nodata_div').show();
			}
		});
	} else {
		$('#tm_matrix_main_div').hide();
		$('#tm_matrix_nodata_div').show();
	}
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