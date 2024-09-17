var chartData2 = [];
jQuery(document).ready(function () {
	$('#loading').css('display', 'none');
	role_design_chart_load();
	var chart = AmCharts.makeChart("competency_def", {
		"type": "serial",
		"theme": "light",
		"legend": {
			"useGraphSettings": true
		},
		"dataProvider": chartData2,
		"synchronizeGrid":true,
		"valueAxes": [{
			"id":"v1",
			"axisColor": "#d378fc",
			"axisThickness": 2,
			"axisAlpha": 1,
			"position": "left",
			"gridColor": "#FFFFFF",
			"gridAlpha": 0.2,
		}, {
			"id":"v2",
			"axisColor": "#52c7f9",
			"axisThickness": 2,
			"axisAlpha": 1,
			"position": "right",
			"gridColor": "#FFFFFF",
			"gridAlpha": 0.2,
		}, {
			"id":"v3",
			"axisColor": "#f6d166",
			"axisThickness": 2,
			"gridAlpha": 0,
			"offset": 50,
			"axisAlpha": 1,
			"position": "left",
			"gridColor": "#FFFFFF",
			"gridAlpha": 0.2,
		}],
		"graphs": [{
			"id": "g2",
			"valueAxis": "v1",
			"lineColor": "#d378fc",
			"bullet": "round",
			"bulletBorderThickness": 1,
			"hideBulletsCount": 30,
			"title": "Technical",
			"valueField": "tech",
			"fillAlphas": 0
		}, {
			"valueAxis": "v2",
			"lineColor": "#52c7f9",
			"bullet": "square",
			"bulletBorderThickness": 1,
			"hideBulletsCount": 30,
			"title": "Functional",
			"valueField": "func",
			"fillAlphas": 0
		}, {
			"valueAxis": "v3",
			"lineColor": "#f6d166",
			"bullet": "triangleUp",
			"bulletBorderThickness": 1,
			"hideBulletsCount": 30,
			"title": "Behavioral",
			"valueField": "behv",
			"fillAlphas": 0
		}],
		"chartScrollbar": {
			"enabled": true,
			"autoGridCount": true,
			"graph": "g2",
			"scrollbarHeight": 40,
			"selectedBackgroundColor":"#e4e2e2",
            "selectedGraphFillColor":"#d97df0",
            "backgroundColor":"#fff"
		},
		"chartCursor": {
			"cursorPosition": "mouse"
		},
		"categoryField": "year",
		"categoryAxis": {
			"parseDates": false,
			"axisColor": "#DADADA",
			"minorGridEnabled": true
		},
		"export": {
			"enabled": true,
			"position": "bottom-right"
		}
	});
});

$( "#rd_chart_select" ).change(function() {
	role_design_chart_load();
});

function role_design_chart_load(){
	var rd_chart_select = $("#rd_chart_select").val();
	$('#loading').css('display', 'block');
	$.ajax({
		url : '/ti_dashboard_charts/',
		type : 'POST',
		timeout : 10000,
		async : false,
		data : {
			'rd_chart_select' : rd_chart_select,
		},
	}).done(function(json_data){
		$('#loading').css('display', 'none');
		json_data = JSON.parse(json_data);
		var chart_data1 = [];
		for (i=0; i<json_data.rd_chart1_data.length; i++){
			chart_data1.push({ "x-value": json_data.rd_chart1_data[i].role_year, "y-value": json_data.rd_chart1_data[i].role_count });
		}
		Nchart_simplebar('role_design', chart_data1, true);
		tcc_chart2_json_data = jQuery.parseJSON(json_data.rd_chart2_data);
		$.each(tcc_chart2_json_data, function(key, value) {
			chartData2.push({
				year: key,
				tech: value[0],
				func: value[1],
				behv: value[2]
			});
		});
	})
}