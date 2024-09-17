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
