$('document').ready(function(){
	training1_data();

});

function training1_data()
{
	
	 AmCharts.makeChart( "training_div1", {
		  "type": "serial",
		  "addClassNames": true,
		  "theme": "light",
		  "autoMargins": false,
		  "marginLeft": 30,
		  "marginRight": 8,
		  "marginTop": 10,
		  "marginBottom": 26,
		  "balloon": {
		    "adjustBorderColor": false,
		    "horizontalPadding": 10,
		    "verticalPadding": 8,
		    "color": "#ffffff"
		  },

		  "dataProvider": [ {
		    "employee": "STEVEN" ,
		    "color": "#53c6fa",
		    "income": 80.5,
		  }, {
		    "employee": "JOSHUA",
		    "color": "#d97df0",
		    "income": 78.2,
		  }, {
		    "employee": "GRACE",
		    "color": "#fa8e90",
		    "income": 75.1,
		  }, {
		    "employee": "CATHERINE",
		    "color": "#fcaa7d",
		    "income": 60.5,
		  }, {
		    "employee": "BARBARA",
		    "color": "#2ee4c9",
		    "income": 55.6,
		  }, ],
		  "valueAxes": [ {
			"maximum": 100,
		    "minimum": 0,
		    "axisAlpha": 1,
		    "position": "left"
		  } ],
		  "startDuration": 1,
		  "graphs": [ {
		    "alphaField": "alpha",
		    "balloonText": "<span style='font-size:12px;'>[[title]] of [[category]]:<br><span style='font-size:20px;'>[[value]]</span> [[additional]]</span>",
		    "fillAlphas": 1,
		    "lineAlpha": 0,
		    "title": "Score",
		    "type": "column",
		    "colorField": "color",
		    "valueField": "income",
		    "dashLengthField": "dashLengthColumn"
		  }, {
		    "id": "graph2",
		    "balloonText": "<span style='font-size:12px;'>[[title]] in [[category]]:<br><span style='font-size:20px;'>[[value]]</span> [[additional]]</span>",
		    "bullet": "round",
		    "lineThickness": 0,
		    "lineAlpha": 0,
		    "bulletSize": 7,
		    "bulletBorderAlpha": 0,
		    "bulletColor": "#FFFFFF",
		    "useLineColorForBulletBorder": true,
		    "bulletBorderThickness": 0,
		    "fillAlphas": 0,
		    "lineAlpha": 1,
		    "title": "Expenses",
		    /* "valueField": "expenses", */
		    "dashLengthField": "dashLengthLine"
		  } ],
		  "categoryField": "employee",
		  "categoryAxis": {
		    "gridPosition": "start",
		    "axisAlpha": 0,
		    "gridAlpha": 0,
		    "tickLength": 0
		  },
		} );
	 
	 AmCharts.makeChart( "training_div2", {
		  "type": "serial",
		  "addClassNames": true,
		  "theme": "light",
		  "autoMargins": false,
		  "marginLeft": 30,
		  "marginRight": 8,
		  "marginTop": 10,
		  "marginBottom": 26,
		  "balloon": {
		    "adjustBorderColor": false,
		    "horizontalPadding": 10,
		    "verticalPadding": 8,
		    "color": "#ffffff"
		  },

		  "dataProvider": [ {
		    "employee": "GRACE" ,
		    "color": "#2ee4c9",
		    "income": 78.5,
		  }, {
		    "employee": "JOSHUA",
		    "color": "#d97df0",
		    "income": 75.2,
		  }, {
		    "employee": "STEVEN",
		    "color": "#f6d166",
		    "income": 70.1,
		  }, {
		    "employee": "CATHERINE",
		    "color": "#49ceee",
		    "income": 65.5,
		  }, {
		    "employee": "BARBARA",
		    "color": "#50c9f6",
		    "income": 60.6,
		  }, ],
		  "valueAxes": [ {
			  "maximum": 100,
		         "minimum": 0, 
		    "axisAlpha": 0,
		    "position": "left"
		  } ],
		  "startDuration": 1,
		  "graphs": [ {
		    "alphaField": "alpha",
		    "balloonText": "<span style='font-size:12px;'>[[title]] of [[category]]:<br><span style='font-size:20px;'>[[value]]</span> [[additional]]</span>",
		    "fillAlphas": 1,
		    "title": "Score",
		    "type": "column",
		    "colorField": "color",
		    "valueField": "income",
		    "dashLengthField": "dashLengthColumn"
		  }, {
		    "id": "graph2",
		    "balloonText": "<span style='font-size:12px;'>[[title]] in [[category]]:<br><span style='font-size:20px;'>[[value]]</span> [[additional]]</span>",
		    "bullet": "round",
		    "lineThickness": 3,
		    "bulletSize": 7,
		    "bulletBorderAlpha": 1,
		    "bulletColor": "#FFFFFF",
		    "useLineColorForBulletBorder": true,
		    "bulletBorderThickness": 3,
		    "fillAlphas": 0,
		    "lineAlpha": 1,
		    "title": "Expenses",
		    /* "valueField": "expenses", */
		    "dashLengthField": "dashLengthLine"
		  } ],
		  "categoryField": "employee",
		  "categoryAxis": {
		    "gridPosition": "start",
		    "axisAlpha": 0,
		    "tickLength": 0
		  },
		} );
	 image="http://tst-hcms.nexttechnosolutions.com/media/user_profile/no_data.png"
	 AmCharts.makeChart("training_div3",
			 {
			     "type": "serial",
			     "theme": "light",
			     "dataProvider": [{
			         "name": "John",
			         "points": 80,
			         "color": "#eb8ec7",
			         "bullet": image
			     }, {
			         "name": "Damon",
			         "points": 76,
			         "color": "#fcaa7d",
			         "bullet": image
			     }, {
			         "name": "Patrick",
			         "points": 67,
			         "color": "#d97df0",
			         "bullet": image
			     }, {
			         "name": "Mark",
			         "points": 58,
			         "color": "#50c9f6",
			         "bullet": image
			     },
			      {
			         "name": "David",
			         "points": 58,
			         "color": "#f6d167",
			         "bullet": image
			     }],
			     "valueAxes": [{
			         "maximum": 100,
			         "minimum": 0,
			         "axisAlpha": 0,
			         "dashLength": 4,
			         "position": "left"
			     }],
			     "startDuration": 1,
			     "graphs": [{
			         "balloonText": "<span style='font-size:13px;'>[[category]]: <b>[[value]]</b></span>",
			         "bulletOffset": 10,
			         "bulletSize": 52,
			         "colorField": "color",
			         "cornerRadiusTop": 8,
			         "customBulletField": "bullet",
			         "fillAlphas": 0.8,
			         "lineAlpha": 0,
			         "type": "column",
			         "valueField": "points"
			     }],
			     "marginTop": 0,
			     "marginRight": 0,
			     "marginLeft": 0,
			     "marginBottom": 0,
			     "autoMargins": false,
			     "categoryField": "name",
			     "categoryAxis": {
			         "axisAlpha": 0,
			         "gridAlpha": 0,
			         "inside": true,
			         "tickLength": 0
			     },

			 });
}