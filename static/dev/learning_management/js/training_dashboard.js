var cal_datas=[]
$('document').ready(function(){
	$("#organization,#org_unit,#division").attr("data-placeholder","Select");
	$("#organization,#org_unit,#division").select2();	
	$("#organization,#org_unit,#division").val(0).trigger('change')
	$('#cost_budget,#training_recommendation1,#training_recommendation2,#opening_training,#ongoing_training,#closed_training,#training_calender').html("<span class='blink_me nodata_text'>No Data Available </span>");
	$.ajax({
		type:'GET',
		url: '/current_user_details/',
		async : false,
		success: function (json_data){
			var user_data=json_data.user_detaills;

			if(user_data.length>0)
			{   
				$('#organization').val(user_data[0].org_id_id).trigger('change')
				$('#org_unit').val(user_data[0].org_unit_id_id).trigger('change')
				$('#division').val(user_data[0].team_name_id).trigger('change')
			}
		},
	})
})
$('#organization').change(function(){
	$('#cost_budget,#training_recommendation1,#training_recommendation2,#opening_training,#ongoing_training,#closed_training,#training_calender').html("<span class='blink_me nodata_text'>No Data Available </span>");
	var str_org_id=$('#organization  option:selected').val()
	$('#org_unit,#division').html('')
	$('#org_unit,#division').append($('<option>', {  value :'0',  text :'--Select--'  }));
	if(str_org_id!='0' && str_org_id!='')
	{
		$.ajax({
			type:'GET',
			url: '/shift/org_unit_fetch/',
			async : false,
			data  : { 'str_org_id':str_org_id},
			success: function (json_data){
				var data=json_data
				if(data)
				{
					var data_len=data.org_unit.length;
					if(data_len>=1)
					{  
						for(var i=0;i<data_len;i++)
						{   
							$('#org_unit').append($('<option>', {
			                    value : data.org_unit[i].id,
			                    text : data.org_unit[i].orgunit_name,
			                }));
						}
					}
					else{ $('#org_unit option[value='+0+']').attr('selected','selected'); }
				}
				else{ $('#org_unit option[value='+0+']').attr('selected','selected'); }
			},
		})	
	}
	else { $('#org_unit option[value='+0+']').attr('selected','selected');  $('#division').val('0').trigger('change'); 
	$('#self_request_ul,#cost_budget,#training_recommendation1,#training_recommendation2,#opening_training,#ongoing_training,#closed_training,#training_calender').html("<span class='blink_me nodata_text'>No Data Available </span>");
	    }
});

$('#org_unit').change(function(){
	var str_org_unit_id=$('#org_unit  option:selected').val()
	var str_org_id=$('#organization  option:selected').val()
	$('#cost_budget,#training_recommendation1,#training_recommendation2,#opening_training,#ongoing_training,#closed_training,#training_calender').html("<span class='blink_me nodata_text'>No Data Available </span>");
	$('#division').html('')
	$('#division').append($('<option>', {   value :'0', text :'--Select--' })); 
	if(str_org_unit_id!='0' && str_org_id!='0')
	{
		$.ajax({
			type:'GET',
			url: '/division_training_view/',
			async : false,
			data  : { 'str_org_unit_id':str_org_unit_id,'str_org_id':str_org_id},
			success: function (json_data){
				var data=json_data
				if(data)
				{  
					var data_len=data.org_unit_division.length;
					var emp_data_len=data.employee_data.length;
					if(data_len>0)
					{  
						for(var i=0;i<data_len;i++)
						{   
							$('#division').append($('<option>', {
			                    value : data.org_unit_division[i].id,
			                    text : data.org_unit_division[i].name,
			                }));
						}
					}
					else{ $('#division option[value='+0+']').attr('selected','selected'); }
					
				}
				else{ $('#division option[value='+0+']').attr('selected','selected');  }
			},
		})	
	}
		else{ 
			$('#division option[value='+0+']').attr('selected','selected');  $('#division').val('0').trigger('change');
		$('#self_request_ul,#cost_budget,#training_recommendation1,#training_recommendation2,#opening_training,#ongoing_training,#closed_training,#training_calender').html("<span class='blink_me nodata_text'>No Data Available </span>");
		}
});

$('#division').change(function(){
	var division_id=$('#division  option:selected').val()
	var str_org_unit_id=$('#org_unit  option:selected').val()
	var str_org_id=$('#organization  option:selected').val()
	$('#cost_budget,#training_recommendation1,#training_recommendation2,#opening_training,#ongoing_training,#closed_training,#training_calender').html("<span class='blink_me nodata_text'>No Data Available </span>");
	if(division_id!='0'  && str_org_unit_id!='0'  && str_org_id!='0')
	{  
		$.ajax({
			type:'GET',
			url: '/training_dashboard_view/',
			async : false,
			data  : { 'division_id':division_id},
			success: function (json_data){
				var data=json_data.training_details;
				var cost_data=json_data.cost_details;
				var rec_emp_data=json_data.rec_emp_details;
				var top_rec_emp_data=json_data.top_rec_person;
				var self_request_data=json_data.self_request;
				var gant_chart_data=json_data.gant_chart;
				calendarView(data)
				cost_budget(cost_data)
				training_recommendation(rec_emp_data)
				top_emp_rec(top_rec_emp_data)
				sef_request(self_request_data)
				gant_chart(gant_chart_data)
			},
		})	
	}
	else {  
		$('#training_calender').html("<span class='blink_me nodata_text'>No Data Available </span>");
		$('#self_request_ul,#cost_budget,#training_recommendation1,#training_recommendation2,#opening_training,#ongoing_training,#closed_training,#training_calender').html("<span class='blink_me nodata_text'>No Data Available </span>");

	}
});

function calendarView(data){
	if(data.length>0){
		 for(var i=0;i<data.length;i++)
		 {
			cal_datas.push({
				start: data[i].start_date,
				end:  data[i].end_date,
				key1: data[i].training_name,
				key2: data[i].view_start_date,
				key3: data[i].view_end_date,
				url: '#',
				class: 'events',
				color: '#000',
				getid: data[i].id
			});
		 }
		$('.event-calendar').equinox({
			events: cal_datas,
			});
	}else{
		$('#training_calender').html("<span class='blink_me nodata_text'>No Data Available </span>");
	}	
}
function isFloat(x) { return !!(x % 1); }

function cost_budget(cost_data)
{ 
 var data = []
 if(cost_data.length>0)
 {   
	 for(var i=0;i<cost_data.length;i++)
	 {   
		var data_cost = isFloat(cost_data[i].training_hour)
		if(data_cost==true)
			{
		var no_of_hour = cost_data[i].training_hour.toString().split(".")[0]
		var no_hour =  cost_data[i].training_hour.toFixed(2).toString().split(".")[1]
		var total_cost = (no_of_hour*cost_data[i].cost_per_hour + no_hour*cost_data[i].cost_per_hour/60)
	 }else{
		total_cost = (cost_data[i].training_hour*cost_data[i].cost_per_hour)
	 }
		var cost_total=Math.round(total_cost);
		data.push({'country':cost_data[i].training_name,
	        'visits':cost_total,
	        'fieldColor':'#f65161'
	    });
	}
	 var chart = AmCharts.makeChart( "cost_budget", {
		 "type": "serial",
		 "fontFamily": "'Poppins', sans-serif",
		  "theme": "light",
		  "rotate": true,
		  "dataProvider":  data,
		  "valueAxes": [ {
		    "gridAlpha": 0.2,
		    "dashLength": 0
		  } ],
		  "startDuration": 1,
		  "columnWidth": 0.4,
		  "graphs": [ {
		    "balloonText": "[[category]]: <b>[[value]]</b>",
		    "fillAlphas": 0.8,
		    "lineAlpha": 0.2,
		    "type": "column",
		    "valueField": "visits",
		    "colorField": "fieldColor",
		  } ],
		  "categoryField": "country",
		  "categoryAxis": {
		    "inside": true,
		    "gridPosition": "start",
		    "gridAlpha": 0,
		    "tickPosition": "start",
		    "tickLength": 0
		  }
		} );
 }
 else{
	 $('#cost_budget').html("<span class='blink_me nodata_text'>No Data Available </span>");
}	
}
function top_emp_rec(top_rec_emp_data)
{   
	var data = []
	if(top_rec_emp_data.length>0)
	{
		for(var i=0;i<top_rec_emp_data.length;i++)
		{
			data.push({'employee':top_rec_emp_data[i].name,
		        'income':top_rec_emp_data[i].count,
		        'color':'#d378fc'
		    });
		}
	AmCharts.makeChart( "training_recommendation1", {
		 "type": "serial",
		 "fontFamily": "'Poppins', sans-serif",
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
		  },

		  "dataProvider": data,
		  "valueAxes": [ {
			  "maximum": 10,
		         "minimum": 0,
		    "axisAlpha": 0,
		    "position": "left"
		  } ],
		  "startDuration": 1,
		  "graphs": [ {
		    "alphaField": "alpha",
		    "balloonText": "[[category]]  : <b>[[value]]</b>",
		    "fillAlphas": 0.8,
		    "lineAlpha": 0.2,
		    "type": "column",
//		    "fillAlphas": 1,
//		    "title": "Score",
//		    "type": "column",
		    "colorField": "color",
		    "valueField": "income",
//		    "dashLengthField": "dashLengthColumn"
		  }, {
		    "id": "graph2",
		    "balloonText": "[[category]]: <b>[[value]]</b>",
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
		    "dashLengthField": "dashLengthLine"
		  } ],
		  "categoryField": "employee",
		  "categoryAxis": {
		    "gridPosition": "start",
		    "axisAlpha": 0,
		    "tickLength": 0
		  },
		} );
	}
	else{
		 $('#training_recommendation1').html("<span class='blink_me nodata_text'>No Data Available </span>");
	}
}


function training_recommendation(rec_emp_data)
{   
	var data = []
	if(rec_emp_data.length>0)
	{
		for(var i=0;i<rec_emp_data.length;i++)
		{
			data.push({'country':rec_emp_data[i].training_name,
		        'visits':rec_emp_data[i].emp_count,
		        'fieldColor':'#fcaa7d'
		    });
		}
		var chart = AmCharts.makeChart( "training_recommendation2", {
			 "type": "serial",
			 "fontFamily": "'Poppins', sans-serif",
			  "theme": "light",
			  "dataProvider":data,
			  "valueAxes": [ {
				  "gridColor": "#FFFFFF",
			    "gridAlpha": 0.2,
			    "dashLength": 0
			  } ],
			  "gridAboveGraphs": true,
			  "startDuration": 1,
			  "graphs": [ {
			    "balloonText": "[[category]]: <b>[[value]]</b>",
			    "fillAlphas": 0.8,
			    "lineAlpha": 0.2,
			    "type": "column",
			    "valueField": "visits",
			    "colorField": "fieldColor",
			  } ],
			  "chartCursor": {
			    "categoryBalloonEnabled": false,
			    "cursorAlpha": 0,
			    "zoomable": false
			  },
			  "categoryField": "country",
			  "categoryAxis": {
			    "gridPosition": "start",
			    "gridAlpha": 0,
			    "tickPosition": "start",
			    "tickLength": 20
			  },
			  "export": {
			    "enabled": false
			  }

			} );
	}
	else{
		 $('#training_recommendation2').html("<span class='blink_me nodata_text'>No Data Available </span>");
	}	
	
	AmCharts.makeChart( "opening_training", {
		 "type": "serial",
		 "fontFamily": "'Poppins', sans-serif",
		  "theme": "light",
		  "rotate": true,
		  "marginBottom":-10,
		  "dataProvider": [ {
		    "age": "PIP",
		    "male": -15,
		    "female": 17
		  }, {
		    "age": "CMMI",
		    "male": -10,
		    "female": 11
		  }, {
		    "age": "ISO Process",
		    "male": -8,
		    "female":7
		  }, {
		    "age": "UX",
		    "male": -17,
		    "female": 17
		  }, {
		    "age": "UX 3.X",
		    "male": -10,
		    "female": 11
		  }],
		  "startDuration": 1,
		  "graphs": [{
		    "fillAlphas": 0.8,
		    "lineAlpha": 0.2,
		    "type": "column",
		    "valueField": "male",
		    "title": "Male",
		    "labelText": "[[value]]",
		    "clustered": false,
		    "labelFunction": function(item) {
		      return Math.abs(item.values.value);
		    },
		    "balloonFunction": function(item) {
		      return item.category + ": " + Math.abs(item.values.value) ;
		    }
		  }, {
		    "fillAlphas": 0.8,
		    "lineAlpha": 0.2,
		    "type": "column",
		    "valueField": "female",
		    "title": "Female",
		    "labelText": "[[value]]",
		    "clustered": false,
		    "labelFunction": function(item) {
		      return Math.abs(item.values.value);
		    },
		    "balloonFunction": function(item) {
		      return item.category + ": " + Math.abs(item.values.value) ;
		    }
		  }],
		  "categoryField": "age",
		  "categoryAxis": {
		    "gridPosition": "start",
		    "gridAlpha": 0.2,
		    "axisAlpha": 0
		  },
		  "valueAxes": [{
		    "gridAlpha": 0,
		    "ignoreAxisWidth": true,
		    "labelFunction": function(value) {
		      return Math.abs(value);
		    },
		    "guides": [{
		      "value": 0,
		      "lineAlpha": 0.2
		    }]
		  }],
		  "balloon": {
		    "fixedPosition": true
		  },
		  "chartCursor": {
		    "valueBalloonsEnabled": false,
		    "cursorAlpha": 0.05,
		    "fullWidth": true
		  },
		  "allLabels": [{
		    "text": "Planned Days",
		    "x": "28%",
		    "y": "0%",
		    "bold": true,
		    "align": "middle"
		  }, {
		    "text": "Actual Days",
		    "x": "75%",
		    "y": "0%",
		    "bold": true,
		    "align": "middle"
		  }],
		 "export": {
		    "enabled": false
		  }
	});
	AmCharts.makeChart( "ongoing_completed_training", {
		"type": "pie",
		"fontFamily": "'Poppins', sans-serif",
		"theme": "light",
		"dataProvider": [ {
			"title": "Ongoing",
			"value": 4,
		}, {
			"title": "Completed",
			"value": 2,	  
		} ],
		"titleField": "title",
		"valueField": 'value',
		 "labelRadius": 5,
		 "colors": ["#53c6fa","#fcaa7d"],
		  "radius": "35%",
		  "innerRadius": "55%",
		  "labelText": "[[title]]",
		"export": {
			"enabled": false
		}
	} );


}
function gant_chart(data)
{  
	if(data.length>0)
	{
		AmCharts.makeChart( "closed_training", {
			  "type": "gantt",
			  "fontFamily": "'Poppins', sans-serif",
			  "theme": "light",
			  "marginRight": 70,
			  "period": "DD",
			  "dataDateFormat": "YYYY-MM-DD",
			  "columnWidth": 0.5,
			  "valueAxis": {
			    "type": "date"
			  },
			  "brightnessStep": 7,
			  "graph": {
			    "fillAlphas": 1,
			    "lineAlpha": 1,
			    "lineColor": "#fff",
			    "fillAlphas": 0.85,
			    "balloonText": "<b>[[task]]</b>:<br />[[open]] -- [[value]]"
			  },
			  "rotate": true,
			  "categoryField": "category",
			  "segmentsField": "segments",
			  "colorField": "color",
			  "startDateField": "start",
			  "endDateField": "end",
			  "dataProvider":data,
	//		  "dataProvider": [ {
	//		    "category": "",
	//		    "segments": [ {
	//		      "start": "2018-09-01",
	//		      "end": "2018-09-14",
	//		      "task": "PAP"
	//		    }, {
	//		      "start": "2018-09-16",
	//		      "end": "2018-09-27",
	//		      "task": "UX"
	//		    }, ]
	//		  }, {
	//		    "category": "",
	//		    "segments": [ {
	//		      "start": "2018-10-08",
	//		      "end": "2018-10-10",
	//		      "task": "UX 3.X"
	//		    }, {
	//		      "start": "2018-10-12",
	//		      "end": "2018-10-15",
	//		      "task": "Core Python"
	//		    }, {
	//		      "start": "2018-10-16",
	//		      "end": "2018-10-05",
	//		      "task": "Development"
	//		    }]
	//		  }, {
	//		    "category": "",
	//		    "segments": [ {
	//		      "start": "2018-11-02",
	//		      "end": "2018-11-08",
	//		      "task": "UX 3.0"
	//		    }, {
	//		      "start": "2018-11-08",
	//		      "end": "2018-11-16",
	//		      "task": "PIP"
	//		    }]
	//		  }, {
	//		    "category": "",
	//		    "segments": [ {
	//		      "start": "2018-12-01",
	//		      "end": "2018-12-10",
	//		      "task": "CMMI"
	//		    }, {
	//		      "start": "2018-12-13",
	//		      "end": "2018-12-18",
	//		      "task": "ISO Awareness"
	//		    }, {
	//		      "start": "2018-12-20",
	//		      "end": "2018-12-25",
	//		      "task": "Django Training"
	//		    }]
	//		  }],
			  "valueScrollbar": {
			    "autoGridCount": true
			  },
			"colors": ["#53c6fa","#fcaa7d","#d97df0","#eb8ec7","#f6d167"],
			  "chartCursor": {
			    "cursorColor": "#55bb76",
			    "valueBalloonsEnabled": false,
			    "cursorAlpha": 0,
			    "valueLineAlpha": 0.5,
			    "valueLineBalloonEnabled": true,
			    "valueLineEnabled": true,
			    "zoomable": false,
			    "valueZoomable": true
			  },
			  "export": {
			    "enabled": false
			  }
		} );
	}
	else { $('#closed_training').html("<span class='blink_me nodata_text'>No Data Available </span>"); }
}	
function sef_request(self_request_data)
{ 
	$('#self_request_ul').html('')
  if(self_request_data.length>0)
  {
	  for(var i=0;i< self_request_data.length ;i++)
	  {
		  $('#self_request_ul').append("<li><span class='text'>"+self_request_data[i].training_name+"</span> is requested by  <span class='text'>"+self_request_data[i].requested_by+"</span> on <span class='text'>"+self_request_data[i].requested_on+"</span></li>")
	  }
  }
  else { $('#self_request_ul').html("<span class='blink_me nodata_text'>No Data Available </span>")   }
	  
}