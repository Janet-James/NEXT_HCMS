


AmCharts.makeChart("chartdiv1",


	{
		"type": "serial",
		"fontFamily": "'Poppins', sans-serif",
		"categoryField": "category",
		"colors": ["#00baff", "#547df9"],
		"startDuration": 1,
		"categoryAxis": {
			"gridPosition": "start",
			"startOnAxis": true,
			 "gridAlpha": 0,
			"minPeriod": "ss",
			//"parseDates":true,
			"title": "Category Title",
			//"axisColor": "#0bb9ec",


		},



		"trendLines": [],
		"graphs": [{
			"balloonText": "[[title]] of [[category]]:[[value]]",

			"type": "smoothedLine",
			"id": "AmGraph-1",
			"fillColors": ["#52c7f8", "#2de6c8"],
			"fillAlphas": 1,
			"lineColor": "#fff",
			"lineAlpha": 0,
			"title": "graph 1",
			"valueField": "column-1"
		}, {
			//"balloonText": "[[title]] of [[category]]:[[value]]",

			"type": "smoothedLine",
			"fillColors": ["#eb8ec7", "#fa8e90"],
			"fillAlphas": 1,
			"lineColor": "#fff",
			"id": "AmGraph-2",
			"lineAlpha": 0,
			"title": "graph 2",
			"valueField": "column-2"
		}],
		"guides": [],
		"valueAxes": [{
			"stackType": "regular",
						"axisAlpha": 1,
			"axisColor": "#000",
			"position": "left",
			"title": "Value Title",
			"gridColor": "#FFFFFF",
		 	"gridAlpha": 0,

		}],
		"allLabels": [],
		"balloon": {},
		"legend": {
			"enabled": true,
			"position": "top",
			"align": "right",
			"color": "#000",
		},
		"titles": [{
			"id": "Title-1",
			"size": 15,
			"text": "Chart Title"
		}],
		"dataProvider": [{
				"category": "category 1",
				"column-1": 18,
				"column-2": 5
			}, {
				"category": "category 2",
				"column-1": 10,
				"column-2": 8
			}, {
				"category": "category 3",
				"column-1": 10,
				"column-2": 3
			}, {
				"category": "category 4",
				"column-1": 11,
				"column-2": 3
			}, {
				"category": "category 5",
				"column-1": 2,
				"column-2": 1
			},


			{
				"category": "category 6",
				"column-1": 5,
				"column-2": 8
			},

			{
				"category": "category 7",
				"column-1": 9,
				"column-2": 7
			}, {
				"category": "category 8",
				"column-1": 10,
				"column-2": 5
			}

		]
	});





AmCharts.makeChart("chartdiv2", {
	"type": "pie",
	"fontFamily": "'Poppins', sans-serif",
	"theme": "light",
	"outlineColor": "",
	"color": "#000",
	//"labelRadius": -20,
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

	"dataProvider": [{
		"title": "Data 1",
		"value": 9852,
		"color": "#53c6fa"
	}, {
		"title": "Data 2",
		"value": 9899,
		"color": "#d97df0"
	}, {
		"title": "Data 3",
		"value": 9899,
		"color": "#fcaa7d"
	}],

	"titleField": "title",
	"valueField": "value",
	"radius": "42%",
	"innerRadius": "60%",
	"labelText": "[[title]]",
	"export": {
		"enabled": false
	}
});




AmCharts.makeChart("chartdiv3", {
	"type": "serial",
	"fontFamily": "'Poppins', sans-serif",

	"categoryField": "category",
	"autoMarginOffset": 0,
	"color": "#000",
	"plotAreaBorderAlpha": 10,
	"plotAreaBorderColor": "#fff",
	"outlineColor": "#fff",
	"colors": [
		"#26c7db",
		"#5c6bc0",
		"#f65161"
	],
	"startDuration": 1,
	"categoryAxis": {
		"gridPosition": "start",
		"startOnAxis": true,
		"minPeriod": "ss",
		 "gridAlpha": 0,
		//"parseDates":true,
		"title": "Category Title",
		//"axisColor": "#0bb9ec",


	},
	"trendLines": [],
	"graphs": [{
			"balloonText": "[[title]] of [[category]]:[[value]]",
			"fillAlphas": 1,
			"id": "AmGraph-1",
			"lineAlpha": 0,
			"fillColors": ["#d479fa", "#e98ecd"],
			"title": "graph 1",
			"valueField": "column-1"
		}, {
			"balloonText": "[[title]] of [[category]]:[[value]]",
			"fillAlphas": 1,
			"id": "AmGraph-2",
			"lineAlpha": 0,
			"fillColors": ["#50c9f6", "#2de6c9"],
			"title": "graph 2",
			"valueField": "column-2"
		},


		{
			"balloonText": "[[title]] of [[category]]:[[value]]",
			"fillAlphas": 1,
			"id": "AmGraph-3",
			"lineAlpha": 0,
			"fillColors": ["#f6d167", "#fca980"],
			"title": "graph 3",
			"valueField": "column-3"
		}

	],
	"guides": [],
	"valueAxes": [{
		"id": "ValueAxis-1",
		"axisAlpha": 1,
		"title": "Value Title",
		"axisColor": "#0f102f",
		"gridColor": "#FFFFFF",
		 "gridAlpha": 0,

	}],
	"allLabels": [],
	"balloon": {},

	"legend": {
		"enabled": true,
		"position": "top",
		"align": "right",
		"spacing": -43,
		"color": "#000",
	},


	"titles": [],
	"dataProvider": [{
		"category": "category 1",
		"column-1": 8,
		"column-2": 5,
		"column-3": 4
	}, {
		"category": "category 2",
		"column-1": 6,
		"column-2": 7,
		"column-3": 2
	}, {
		"category": "category 3",
		"column-1": 2,
		"column-2": 3,
		"column-3": 1
	}, {
		"category": "category 4",
		"column-1": 8,
		"column-2": 3,
		"column-3": 2
	}, {
		"category": "category 5",
		"column-1": 2,
		"column-2": 1,
		"column-3": 2
	}, {
		"category": "category 6",
		"column-1": 3,
		"column-2": 2,
		"column-3": 1
	}]
});







AmCharts.makeChart("chartdiv4", {

	"responsive": {
		"enabled": true
	},
	"fontFamily": "'Poppins', sans-serif",
	"type": "serial",
	"marginBottom": 0,
	"marginLeft": 0,
	"marginRight": 0,
	"marginTop": 0,
	"lineAlpha": "1",

	"legend": {
		"enabled": true,
		"position": "top",
		"align": "right",
		"spacing": -43,
		"color": "#000",
	},

	"colors": [
		"#d378fc",
		"#52c7f9",
		"#f6d166",

	],
	"startDuration": 1,
	"accessible": false,
	//"borderColor": "#efefef",
	"color": "#000",
	//"plotAreaBorderAlpha": 1,
	//"plotAreaBorderColor": "#efefef",
	"categoryAxis": {
		"gridPosition": "start",
		"axisColor": "#0f102f",
		"title": "Category Title",
		 "gridAlpha": 0,
	},
	"trendLines": [],
	"graphs": [{
		"balloonText": "[[title]] of [[category]]:[[value]]",
		"bullet": "square",
		"id": "AmGraph-1",
		"title": "G 1",
		"lineThickness": 2,
		"tabIndex": -1,
		"valueField": "column-1"
	}, {
		"balloonText": "[[title]] of [[category]]:[[value]]",
		"bullet": "square",
		"id": "AmGraph-2",
		"title": "G 2",
		"lineThickness": 2,
		"valueField": "column-2"
	}, {
		"balloonText": "[[title]] of [[category]]:[[value]]",
		"bullet": "square",
		"id": "AmGraph-3",
		"title": "G 3",
		"lineThickness": 2,
		"valueField": "column-3"
	}, ],
	"guides": [],
	"valueAxes": [{
		"id": "ValueAxis-1",
		"title": "Value",

		/*"axisColor": "#fff",
		"axisAlpha": 0,*/
		"gridColor": "#FFFFFF",
		 "gridAlpha": 0,
		"gridCount": 0,
		"dashLength": 0,
	}],
	"allLabels": [],
	"balloon": {},

	"titles": [],

	"dataProvider": [{
		"category": "category 1",
		"column-1": 8,
		"column-2": 5,
		"column-3": 4
	}, {
		"category": "category 2",
		"column-1": 6,
		"column-2": 7,
		"column-3": 2
	}, {
		"category": "category 3",
		"column-1": 2,
		"column-2": 3,
		"column-3": 1
	}, {
		"category": "category 4",
		"column-1": 8,
		"column-2": 3,
		"column-3": 2
	}, {
		"category": "category 5",
		"column-1": 2,
		"column-2": 1,
		"column-3": 2
	}, {
		"category": "category 6",
		"column-1": 3,
		"column-2": 2,
		"column-3": 1
	}]





});



var gaugeChart = AmCharts.makeChart("gaugechart", {
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
    "bands": [{
      "color": "#f1f1f1",
      "startValue": 0,
      "endValue": 100,
      "radius": "100%",
      "innerRadius": "85%"
    }, {
      "color": "#d9ccfa",
      "startValue": 0,
      "endValue": 80,
      "radius": "100%",
      "innerRadius": "85%",
      "balloonText": "90%"
    }, {
      "color": "#f1f1f1",
      "startValue": 0,
      "endValue": 100,
      "radius": "80%",
      "innerRadius": "65%"
    }, {
      "color": "#f3d783",
      "startValue": 0,
      "endValue": 35,
      "radius": "80%",
      "innerRadius": "65%",
      "balloonText": "35%"
    }, {
      "color": "#f1f1f1",
      "startValue": 0,
      "endValue": 100,
      "radius": "60%",
      "innerRadius": "45%"
    }, {
      "color": "#f9b39a",
      "startValue": 0,
      "endValue": 92,
      "radius": "60%",
      "innerRadius": "45%",
      "balloonText": "92%"
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
  value = Math.round(value);
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
    balloonFunction: function(item) {
      return AmCharts.formatDate(item.category, "D MMM, YYYY") + "<br />" + formatTime(item.values.open) + " -- " + formatTime(item.values.value);
    }
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
  dataProvider: [
    {
      category: "Today",
      segments: [
        {
          start: 8,
          end: 9.30,
          "task": "Start Up Meeting",
          color: "#81caff"
        },
        {
          start: 11.50,
          end: 14.30,
          "task": "Project plan",
          color: "#38ddd5"
        },
        
      ]
    },
 
  ],
 
  "graph": {
        "fillAlphas": 1,
        "balloonText": "<b>[[task]]</b>: [[open]]  TO  [[value]]"
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
 
