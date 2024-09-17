$(document).ready(function(){
	common_chart(user_id,flag_value);
});
function common_chart(user_id){
	var csrftoken = getCookie('csrftoken');
	$.ajax({
		url:'/exp_cmp_chart/',
		type:'POST',
		data:{'user_id':user_id,'flag_value':flag_value,
			csrfmiddlewaretoken:csrftoken},
			error:(function(error){
				alert_lobibox('error',error.statusText);;
			})
	}).done(function(json_data){
		var data=JSON.parse(json_data);
		chart_detaills(data)
	})
}

function chart_detaills(data){

	var StrContent_EXP='',StrContent_risk='',StrContent_exceeded='',StrContent_completed='',StrContent_ontrack='',StrContent_alltrack=''
	$('#exp_cmp_div').empty();
	$('#risk_div').empty();
	$('#exceeded_div').empty();
	$('#offtrack_div').empty();
	$('#ontrack_div').empty();
	//Completion and Expectation 
	for(i=0;i<data.chart_values.length;i++){
		if(data.chart_values[i].expectation!=0 || data.chart_values[i].completion!=0){
		StrContent_EXP+='<p class="chart-title">Completion % / Expectation %</p>'+
		'<label class="text-center">'+
		'<span class="actual-value">'+data.chart_values[i].completion+' %</span> / '+
		'<span class="planned-value">'+data.chart_values[i].expectation+' %</span>'+
		'</label><div class="OKR-completed-chart-container">'+
		'<div id="OKR-completed-chart"></div>'+
		'<label class="actual-chart-data">'+data.chart_values[i].completion+'</label>'+
		'</div>'
		$('#exp_cmp_div').append(StrContent_EXP)
		var chart = AmCharts.makeChart( "OKR-completed-chart", {
			"type": "pie",
			"theme": "light",
			"dataProvider": [ {
				"title": "Completion",
				"value": data.chart_values[i].completion,
				"fieldColor": "#52c7f8"
			}, {
				"title": "Expectation",
				"value": data.chart_values[i].expectation,	  
				"fieldColor": "#e6f6fc"
			} ],
			"titleField": "title",
			"valueField": "value",
			"labelRadius": 5,
			"colorField": "fieldColor",
			"radius": "42%",
			"innerRadius": "80%",
			"labelText": "[[value]]",
			"labelsEnabled": false,
			"export": {
				"enabled": true
			},
			"balloonText": "[[title]]:[[value]]%",
		} );
		}else{
			StrContent_EXP+='<p class="chart-title">Completion % / Expectation %</p>'+
			'<p class="no-data-text">No data found</p>'+
			'<div class="OKR-completed-chart-container">'+
			'<div id="OKR-completed-chart"></div>'+
			'</div>'
			$('#exp_cmp_div').append(StrContent_EXP)
		}
	}
	//Risk,Exceeded,On Track,Completed 
	for(i=0;i<data.alltrack_details.length;i++){
		var chart = AmCharts.makeChart("OKR-status-chart", {
			"type": "serial",
			"theme": "light",
			"marginRight": 0,
			"dataProvider": [{
				"country": "At Risk",
				"visits": data.alltrack_details[i].risk,
				"color": "#fcaa7d"
			}, {
				"country": "Exceeded",
				"visits": data.alltrack_details[i].exceeded,
				"color": "#d97df0"
			}, {
				"country": "On Track ",
				"visits": data.alltrack_details[i].on_track,
				"color": "#2ee6ca"
			}, {
				"country": "Completed",
				"visits": data.alltrack_details[i].completed,
				"color": "#52c7f8"
			}],
			"valueAxes": [{
				"axisAlpha": 0,
				"position": "left",
				"title": ""
			}],
			"startDuration": 1,
			"graphs": [{
				"balloonText": "<b>[[category]]: [[value]]</b>",
				"fillColorsField": "color",
				"fillAlphas": 0.9,
				"lineAlpha": 0.2,
				"type": "column",
				"valueField": "visits"
			}],
			"chartCursor": {
				"categoryBalloonEnabled": false,
				"cursorAlpha": 0,
				"zoomable": false
			},
			"categoryField": "country",
			"categoryAxis": {
				"gridPosition": "start",
				"labelRotation": 45,
				"labelsEnabled": false,
				"gridThickness": 0
			},
			"export": {
				"enabled": true
			}

		});
	}
	//At Risk 
	for(i=0;i<data.risk_details.length;i++){
		if(data.risk_details[i].total_risk!=0 || data.risk_details[i].risk!=0 ){
			StrContent_risk+='<p class="chart-title">At Risk </p>'+
			'<label class="text-center">'+
			'<span class="actual-value">'+data.risk_details[i].risk+'</span> / '+
			'<span class="planned-value">'+data.risk_details[i].total_risk+'</span>'+
			'</label>'+
			'<div class="OKR-risk-chart-container"><div id="OKR-risk-chart"></div></div>'
			$('#risk_div').append(StrContent_risk)
			var chart = AmCharts.makeChart( "OKR-risk-chart", {
				"type": "pie",
				"margin": 0,
				"theme": "light",
				"outlineColor": "",
				"dataProvider": [ {
					"country": "Objective",
					"litres": data.risk_details[i].risk,
					"fieldColor": "#fcaa7d"
				}, {
					"country": "Objective",
					"litres": data.risk_details[i].total_risk,
					"fieldColor": "#fde1d2"
				} ],
				"valueField": "litres",
				"titleField": "Risk",
				"colorField": "fieldColor",
				"labelRadius": -15,
				"labelText": "[[litres]]",
				"balloon":{
					"fixedPosition":true
				},
				"balloonText": "[[country]]:[[litres]] [[[percents]]%]",
				"export": {
					"enabled": true
				}
			} );
		}else{
			StrContent_risk+='<p class="chart-title">At Risk </p>'+
			'<p class="no-data-text">No data found</p>'+
			'<div class="OKR-risk-chart-container"><div id="OKR-risk-chart"></div></div>'
			$('#risk_div').append(StrContent_risk)
			}
	}
	//At Exceeded 
	for(i=0;i<data.exceeded_details.length;i++){
		if(data.exceeded_details[i].exceeded_total!=0){
			StrContent_exceeded+='<p class="chart-title">Exceeded</p>'+
			'<label class="text-center">'+
			'<span class="actual-value">'+data.exceeded_details[i].exceeded+'</span> / <span class="planned-value"> '+data.exceeded_details[i].exceeded_total+'</span>'+
			'</label>'+
			'<div class="OKR-exceeded-chart-container">'+
			'<div id="OKR-exceeded-chart"></div>'+
			'<label class="actual-chart-data">'+data.exceeded_details[i].exceeded+'</label>'+
			'</div>'
			$('#exceeded_div').append(StrContent_exceeded)
			var chartData = [{
				"country": "Exceeded",
				"litres": data.exceeded_details[i].exceeded,
				"fieldColor" : "#d97df0"
			}, {
				"country": "Exceeded",
				"litres": data.exceeded_details[i].exceeded_total,
				"fieldColor" : "#f9e2fe"
			}];

			var sum = 0;
			for ( var x in chartData ) {
				sum += chartData[x].litres;
			}
			chartData.push({
				"litres": sum,
				"alpha": 0
			});

			var chart = AmCharts.makeChart("OKR-exceeded-chart", {
				"type": "pie",
				"startAngle": 0,
				"radius": "90%",
				"innerRadius": "60%",
				"dataProvider": chartData,
				"valueField": "litres",
				"titleField": "Exceeded",
				"alphaField": "alpha",
				"labelsEnabled": false,
				"pullOutRadius": 0,
				"pieY": "95%",
				"colorField": "fieldColor",
				"balloonText": "[[litres]]-[[country]][[[percents]]%]"
			});
		}else{
			StrContent_exceeded+='<p class="chart-title">Exceeded</p>'+
			'<p class="no-data-text">No data found</p>'+
			'<div class="OKR-exceeded-chart-container">'+
			'<div id="OKR-exceeded-chart"></div>'+
			'</div>'
			$('#exceeded_div').append(StrContent_exceeded)
			}

	}
	//On Track 
	for(i=0;i<data.ontrack_details.length;i++){
		if(data.ontrack_details[i].ontrack_total!=0){
		StrContent_ontrack+='<p class="chart-title">On Track</p>'+
		'<label class="text-center">'+
		'<span class="actual-value">'+data.ontrack_details[i].on_track+'</span> / <span class="planned-value"> '+data.ontrack_details[i].ontrack_total+'</span>'+
		'</label>'+
		'<div class="OKR-ontrack-chart-container">'+
		'<div id="OKR-ontrack-chart">'+
		'<div><div id="rateYo1" style="float: left"></div>'+
		'<div class="counter actual-chart-data"></div>'+
		'</div></div>'+
		'</div>'
		$('#ontrack_div').append(StrContent_ontrack)
		var rating = data.ontrack_details[i].on_track;
		$(".counter").text(rating);

		var changeRating = function(rating) {

			$(this).next().text(rating);
		};

		$("#rateYo1").rateYo({
			rating : rating,
			numStars : 1,
			precision : 2,
			minValue : data.ontrack_details[i].on_track,
			maxValue : data.ontrack_details[i].ontrack_total
		}).on("rateyo.change", function(e, data) {

			changeRating.apply(this, [ data.rating ]);
		}).on("rateyo.set", function(e, data) {

			changeRating.apply(this, [ data.rating ]);
		});
	}else{
		StrContent_ontrack+='<p class="chart-title">On Track</p>'+
		'<p class="no-data-text">No data found</p>'+
		'<div class="OKR-ontrack-chart-container">'+
		'<div id="OKR-ontrack-chart">'+
		'<div><div id="rateYo1" style="float: left"></div>'+
		'<div class="counter actual-chart-data"></div>'+
		'</div></div>'+
		'</div>'
		$('#ontrack_div').append(StrContent_ontrack)
		}	
}
	//Off Track
	for(i=0;i<data.completed_details.length;i++){
	if(data.completed_details[i].completed_total!=0){
		var now_value=0
		now_value=data.completed_details[i].completed/data.completed_details[i].completed_total*100
		StrContent_completed+='<p class="chart-title">Completed</p>'+
		'<label class="text-center">'+
		'<span class="actual-value">'+data.completed_details[i].completed+'</span> / <span class="planned-value"> '+data.completed_details[i].completed_total+'</span>'+
		'</label>'+
		'<div class="OKR-offtrack-chart-container">'+
		'<div class="OKR-offtrack-chart">'+
		'<div class="progress">'+
		'<div class="progress-bar progress-bar-info" role="progressbar" style="width: '+now_value+'%; aria-valuenow="'+now_value+'" aria-valuemin="0" aria-valuemax="100">'+
		'<span class="sr-only"> "'+now_value+'%" Complete </span>'+
		'</div>'+
		'</div>'
		$('#offtrack_div').append(StrContent_completed)
	}else{
		StrContent_completed+='<p class="chart-title">Completed</p>'+
		'<p class="no-data-text">No data found</p>'+
		'<div class="OKR-offtrack-chart-container">'+
		'<div class="OKR-offtrack-chart">'+
		'</div>'+
		'</div>'
		$('#offtrack_div').append(StrContent_completed)
		}	
		
	}
	$("#loading").css("display","none");
}
