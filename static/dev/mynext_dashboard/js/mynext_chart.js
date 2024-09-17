//$('document').ready(function(){
//	today_schedule_chart();
//})

function gaugechart(project_status,timebox,task_status){
var gaugeChart = AmCharts.makeChart("gaugechart", {
	"type": "gauge",
	"fontFamily": "'Poppins', sans-serif",
	 "fontsize":10,
	"theme": "light",
	"axes": [{
		"axisAlpha": 0,
		"tickAlpha": 0,
		"labelsEnabled": false,
		"startValue": 0,
		"endValue": 100,
		"startAngle": 0,
		"endAngle": 270,
		"bands": [{
			"color": "#f1f1f1",
			"startValue": 0,
			"endValue": 100,
			"radius": "100%",
			"innerRadius": "85%"
		}, {
			"color": "#d9ccfa",
			"startValue": 0,
			"endValue": parseInt(project_status),
			"radius": "100%",
			"innerRadius": "85%",
			"balloonText": parseInt(project_status)+"%"
		}, {
			"color": "#f1f1f1",
			"startValue": 0,
			"endValue": 100,
			"radius": "80%",
			"innerRadius": "65%"
		}, {
			"color": "#f3d783",
			"startValue": 0,
			"endValue": parseInt(timebox),
			"radius": "80%",
			"innerRadius": "65%",
			"balloonText": parseInt(timebox)+"%"
		}, {
			"color": "#f1f1f1",
			"startValue": 0,
			"endValue": 100,
			"radius": "60%",
			"innerRadius": "45%"
		}, {
			"color": "#f9b39a",
			"startValue": 0,
			"endValue": parseInt(task_status),
			"radius": "60%",
			"innerRadius": "45%",
			"balloonText": parseInt(task_status)+"%"
		}]
	}],
	"allLabels": [{
		"text": "Project Status",
		"x": "49%",
		"y": "5%",
		"size": 11,
		"bold": true,
		"color": "#000",
		"align": "right"
	}, {
		"text": "Timebox",
		"x": "49%",
		"y": "15%",
		"size": 11,
		"bold": true,
		"color": "#000",
		"align": "right"
	}, {
		"text": "Task Status",
		"x": "49%",
		"y": "24%",
		"size": 11,
		"bold": true,
		"color": "#000",
		"align": "right"
	}],
	"export": {
		"enabled": false
	}
});
}


var chart = AmCharts.makeChart( "customer_satisfaction", {
	"type": "pie",
	"theme": "light",
	"colors": [
	           "#f6f2ff",
	           "#fa8e8e",
	           ],
	           //"autoMargins":true,

	           "marginBottom": 0,
	           "marginLeft": 0,
	           "marginRight": 0,
	           "marginTop": 0,

	           "dataProvider": [ {
	        	   "country": "",
	        	   "litres": 60
	           }, {
	        	   "country": "",
	        	   "litres": 90
	           } ],
	           "valueField": "litres",
	           "titleField": "country",
	           "showBalloon": false,
	           "labelsEnabled": false,

	           "export": {
	        	   "enabled": false
	           }
} );




var chart = AmCharts.makeChart( "secuiry_review", {
	"type": "pie",
	"theme": "light",
	"colors": [
	           "#f6f2ff",
	           "#2ce7c8",
	           ],
	           //"autoMargins":true,

	           "marginBottom": 0,
	           "marginLeft": 0,
	           "marginRight": 0,
	           "marginTop": 0,

	           "dataProvider": [ {
	        	   "country": "",
	        	   "litres": 20
	           }, {
	        	   "country": "",
	        	   "litres": 80
	           } ],
	           "valueField": "litres",
	           "titleField": "country",
	           "showBalloon": false,
	           "labelsEnabled": false,

	           "export": {
	        	   "enabled": false
	           }
} );




function formatTime(value) {
	value = Math.round(value,2);
	if (value > 12) {
		return value - 12 + " PM";
	} else if (value == 12) {
		return value + " PM";
	} else if (value == 0) {
		return "0 AM";
	}
	return value + "AM";
}

/**
 * Create the chart
 */

function today_schedule_chart(){
	$("#todayschedule").html("")
	var date = new Date();
	$.ajax({
		type:'GET',
		url: '/today_scheduled_meeting/',
		data:{'to_zone':Intl.DateTimeFormat().resolvedOptions().timeZone},
		async:false,
		success: function (json_data){
			if(json_data.status=="NTE_01"){
				if(json_data.today_schedule.length!=0){
					var chart = AmCharts.makeChart("todayschedule", {
						type: "gantt",
						theme: "light",
						marginRight:120,
						"plotAreaFillAlphas": 1,
						"plotAreaFillColors": "#f8f7ff",
						dataDateFormat: "YYYY-MM-DD",
						columnWidth: 0.2,
						valueAxis: {
							position:'top',
							"gridThickness": 0,
							maximum: 24,
							gridCount: 24,
							autoGridCount: false,
							title: "",
							axisColor: "#fff",
							labelFunction: formatTime
						},
						graph: {
							fillAlphas: 1,
							lineAlpha: 1,
							lineColor: "#fff",
						},
						rotate: true,
						categoryAxis: {
							parseDates: false,
							axisColor: "#ccc",
							lineColor: "#fff",
							lineAlpha: 1,
							//"gridThickness": 0,
							title: ""
						},
						categoryField: "category",
						segmentsField: "segments",
						colorField: "color",
						startField: "start",
						endField: "end",
						durationField: "duration",
						dataProvider: [{category: "Today",segments:json_data.today_schedule}],
						"graph": {
							"fillAlphas": 1,
							"balloonText": "<b>[[task]]</b>: [[open]]  TO  [[value]]",
							balloonFunction: function(item,graph) {
								open = item.values.open.toFixed(2).toString().split('.')
								value = item.values.value.toFixed(2).toString().split('.')
								return graph.segmentData.task+': '+ open[0]+':'+open[1] + " TO " + value[0]+':'+value[1];
							}
						},

						valueScrollbar: {
							autoGridCount: false
						},

						"chartScrollbar": false,
						"valueScrollbar":false,
						chartCursor: {
							cursorColor: "#55bb76",
							valueBalloonsEnabled: false,
							cursorAlpha: 0,
							valueLineAlpha: 0.5,
							valueLineBalloonEnabled: false,
							valueLineEnabled: false,
							zoomable: false,
							valueZoomable: false
						},

						export: {
							enabled: false
						}
					});
				}
				else{   
					$("#todayschedule").append('<p class="no_data_found">No Data Found.</p>')
				}
			}
			else{ 
				$("#todayschedule").append('<p class="no_data_found">No Data Found.</p>')
				
			}
		}
	})
}


