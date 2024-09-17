$( document ).ready(function() {
    console.log( "HRMS-HR Dashboard ready!" );
    $('#organization_id').val(28).trigger('change');
});

//org change
$("#organization_id").change(function() {
	if($('#organization_id option:selected').val() != 0) {
		org($('#organization_id option:selected').val()); 
	}else{
		alert_lobibox("error", 'Please select organization.');	}
});

//org unit
function org(val){
	$.ajax({
		url : "/hrms_hr_dashboard/",
		type : "GET",
		data : {'id':val},
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		datas = JSON.parse(json_data);
		powerBar(datas.powerbar1);
		containerTwo(datas.container2);
		containerOne(datas.container2);
	});
}

//powerbar data update function here
function powerBar(data){
	if(data.length>0){
		var present = data[0].present;
		var absent = data[0].absent;
		var ontime = data[0].ontime;
		var late = data[0].late;
		$('#hrd_attendance').html(present);
		$('#hrd_leave').html(absent);
		$('#hrd_new_joinee').html(data[0].joining);
		$('#hrd_exits').html(data[0].releaving);
		employeePresentTurnAround(present,absent);
		employeeAbsentTurnAround(present,absent);
		employeeLateTurnAround(ontime,late);
		employeeOntimeTurnAround(ontime,late);
		employeeCountChart('employeeCountChart',present+absent)//employee count chart
	}else{
		alert('No Data Found.')
	}
}

//container one
function containerOne(data){
	if(data.length>0){
	//employee performance
	performance_datas = [
				{
					"year": '',
					"scheduled": 15,
					"completed": 9,
				}
			]
	containerColThree(performance_datas,"performance12","line",true);
	containerColTwo('performance3',data[0].avg_per_exit_emp,'#002451','','progress-bar-info')
	containerColTwo('performance4',data[0].avg_per_new_emp,'#1aaeff','','progress-bar-warning')
	//training
	datas = [
				{
					"year": '',
					"scheduled": 5,
					"completed": 3,
				}
			]
	containerColThree(datas,"training12","column",true);
	workTenureChart('4/5','training3',1600,'#5856d6')//work tenure chart
	workTenureChart('3/5','training4',1400,'#ff9501')//work tenure chart
	//competencies
	containerColFour([6,8,12,5],['#4cda64','#ff8982','#5856d6','#5ac8fb']);
	}
}

//container col 2
function containerColTwo(id,val,clr,content,cls){
	strAppend = '<div id="" class="skillBar '+cls+'" skill-percentage="'+val+'%" skill-color="'+clr+'"><span class="codeconSkillArea">'+content+'</span> <span class="PercentText ">'+val+'%</span></div>' 
	$('#'+id).html(strAppend);
	$(".habilidades").skill();
}

//container1 col 3
function containerColThree(datas,id,ctype,condition){
	var chart = AmCharts.makeChart(id, {
		"type": "serial",
		"categoryField": "year",
		"rotate": condition,
		"startDuration": 1,
		 "categoryAxis": {
			"gridPosition": "start",
			"position": "right"
		},
		"trendLines": [],
		"graphs": [
			{
				"balloonText": "Scheduled:[[value]]",
				"fillAlphas": 0.68,
				"id": "AmGraph-1",
				"lineAlpha": 0.1,
				"title": "Income",
				"lineColor": '#ef5350',
				"fillColors": '#ef5350',
				"type": ctype,
				"valueField": "scheduled"
			},
			{
				"balloonText": "Completed:[[value]]",
				"fillAlphas": 1,
				"id": "AmGraph-2",
				"lineAlpha": 0.1,
			    "lineColor": '#388e3c',
				"title": "Expenses",
				"fillColors": '#4cda64',
				"type": ctype,
				"valueField": "completed"
			}
		],
		"guides": [],
		"valueAxes": [
			{
				"id": "ValueAxis-1",
				"position": "top",
				"axisAlpha": 0
			}
		],
		"allLabels": [],
		"balloon": {},
		"titles": [],
		"dataProvider": datas,
	    "export": {
	    	"enabled": false
	     }

	});
}

//container1 col 4
function containerColFour(datas,colors){
	var config = {
		data: {
			datasets: [{
				data:datas,
				backgroundColor: colors,
				label: 'My dataset' // for legend
			}],
			labels: [
				'Required Roles',
				'Available Roles',
				'Competency Required',
				'Competency Available'
			]
		},
		options: {
			responsive: true,
			legend: {
				display: false,
				position: 'top',
			},
			title: {
				display: false,
				text: 'Chart.js Polar Area Chart'
			},
			scale: {
				ticks: {
					beginAtZero: true
				},
				reverse: true
			},
			animation: {
				animateRotate: false,
				animateScale: true
			}
		}
	};
	var ctx = document.getElementById('chart-area');
	window.myPolarArea = Chart.PolarArea(ctx, config);
}

//container function call
function containerTwo(data){
	if(data.length>0){
		$('.no_data').empty();
		// strategic
		workTenureChart(data[0].avg_per_rate.toString()+'/5','performance_rate_id',4600,'#4cda64')//work tenure chart
		workTenureChart(data[0].satis_rate.toString()+'/10','statisfication_rate_id',5600,'#ff8982')//work tenure chart
		workTenureChart(data[0].avg_tenure_yr.toString()+'yrs','work_tenure_id',3400,'#e28696')//work tenure chart
		attritionRate('attrition_rate_id','pie_attrition_cls','#5856d6',data[0].attr_rate)
		//business
		businessBarChart('revenue_per_id',data[0].rev_per_emp);//business bar chart
		businessBarChart('avg_salary_id',data[0].avg_salary);//business bar chart
		businessBarChart('training_cost_id',data[0].trai_cost_per_emp);//business bar chart
		businessBarChart('profit_cost_id',data[0].profit_per_emp);//business bar chart
	}else{
		$('.no_data').html('<b>0</b>');
		$('.pie_attrition_clss').css({'margin-top':'10px'})
	}
}

//barchart for business
function businessBarChart(id,value){
	$('#'+id).goalProgress({
		goalAmount: value+100,
		currentAmount: value,
		textBefore: '',
		textAfter: ' INR'
	});
}
//employee present turnaround
function employeePresentTurnAround(present_count,leave_count){
	var chart_array = []
    chart_array.push({
    	'value':present_count,
    	'color':'#4cda64'
    }) 
    chart_array.push({
    	'value': leave_count,
    	'color':  '#dddddd'
    }) 
    donut_chart('hrd_chart_present',chart_array,present_count)
}

//employee absent turnaround
function employeeAbsentTurnAround(present_count,leave_count){
	var chart_array = []
    chart_array.push({
    	'value':present_count,
    	'color':'#dddddd'
    }) 
    chart_array.push({
    	'value': leave_count,
    	'color':  '#e28696'
    }) 
    donut_chart('hrd_chart_absent',chart_array,leave_count)
}

//employee present turnaround
function employeeLateTurnAround(ontime,late){
	var chart_array = []
    chart_array.push({
    	'value':ontime,
    	'color':'#5ac8fb'
    }) 
    chart_array.push({
    	'value': late,
    	'color':  '#dddddd'
    }) 
    donut_chart('hrd_chart_ontime',chart_array,ontime)
}

//employee absent turnaround
function employeeOntimeTurnAround(ontime,late){
	var chart_array = []
    chart_array.push({
    	'value':ontime,
    	'color':'#dddddd'
    }) 
    chart_array.push({
    	'value': late,
    	'color':  '#ff9501'
    }) 
    donut_chart('hrd_chart_late',chart_array,late)
}

//strategic charts
function strategicChart(id,cls,color,value){
	$('#'+id).html(value)
	$("."+cls).setupProgressPie({
        color: color,
        size: 75,
        strokeWidth: 0,
        ringWidth: 8,
        rotation: true,
        valueAdapter: function(percent) { return 80; }
    });
	$("."+cls).progressPie();
}

//strategic charts attrition chart
function strategicChartAttrition(id,cls,color,value){
	$("#test-circle1").circliful({
		animationStep: 5,
		foregroundBorderWidth: 10,
		backgroundBorderWidth: 10,
		percent: 75,
		textSize: 28,
		textStyle: 'font-size: 12px;',
		textColor: '#666',
	});
}

//attrition rate chart
function attritionRate(id,cls,color,value){
		$('#'+id).html('');
		$("#"+id).circliful({
			animationStep: 5,
			foregroundBorderWidth: 10,
			backgroundBorderWidth: 10,
			size: 55,
			percent: value,
			textSize: 8,
			textStyle: 'font-size: 12px;',
			textColor: '#666',
			//halfCircle: 1,
		});
		$('#attrition_rate_id .number').css({'font-size':'15px','color':'red'});
		$('#attrition_rate_id .percent').css({'font-size':'15px','color':'red'});
		$('.pie_attrition_clss').css({'margin-top':'-15px'})
}

//work tenure
function workTenureChart(val,id,delay,clr){
	$('#'+id).html('');
	var bar = new ProgressBar.Circle('#'+id, {
		  color: clr,
		  // This has to be the same size as the maximum width to
		  // prevent clipping
		  strokeWidth: 10,
		  trailWidth: 1,
		  size: 55,
		  easing: 'easeInOut',
		  duration: delay,
		  text: {
		    autoStyleContainer: false
		  },
		  from: { color: '#002451', width: 10 },
		  to: { color: '#333', width: 10 },
		  // Set default step function for all animate calls
		  step: function(state, circle) {
		    circle.path.setAttribute('stroke', clr);
		    circle.path.setAttribute('stroke-width', 8);
		    var value = val
		    if (value === 0) {
		      circle.setText('');
		    } else {
		      circle.setText(value);
		    }

		  }
		});
		$('.progressbar-text').css({'margin-top':'10px'})
//		bar.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
//		bar.text.style.fontSize = '2rem';
		bar.animate(1.0);  // Number from 0.0 to 1.0
}

//employee count chart
function employeeCountChart(id,value){
	$('#employee_counts').html(value)
	/**
	 * Bullet Chart #1
	 */
	AmCharts.makeChart( id, {
	  "type": "serial",
	  "dataProvider": [ {
	    "x": 1,
	    "y": value
	  } ],
	  "categoryField": "x",
	  "rotate": true,
	  "autoMargins": false,
	  "marginLeft": 0,
	  "marginRight": 0,
	  "marginTop": 0,
	  "marginBottom": 0,
	  "graphs": [ {
	    "valueField": "y",
	    "type": "column",
	    "fillAlphas": 1,
	    "fillColors": [ "#49cbec", "#f73838" ],
	    "gradientOrientation": "horizontal",
	    "lineColor": "#FFFFFF",
	    "showBalloon": true
	  } ],
	  "valueAxes": [ {
	    "gridAlpha": 0,
	    "axisAlpha": 0,
	    "stackType": "100%",
	    "guides": [ {
	      "value": value,
	      "lineAlpha": 5,
	      "above": true
	    } ]
	  } ],
	  "categoryAxis": {
	    "gridAlpha": 0,
	    "axisAlpha": 0
	  }
	} );
}

//donut charts
function donut_chart(chart_div,chart_array,present_count){
		var chart = AmCharts.makeChart(chart_div, {
			  "type": "pie",
			  "theme": "light",
			    "allLabels": [{
			    "text": present_count,
			    "align": "center",
			    "bold": true,
			    "y": 40
			  }],
			  "dataProvider": chart_array,
			  "titleField": "title",
			  "valueField": "value",
			  "colorField": "color",
			  "labelRadius": 5,
			  "radius": "42%",
			  "innerRadius": "60%",
			  "labelText": "",
			  "showBalloon": false,
			  "export": {
			    "enabled": true
			  }
			});
};