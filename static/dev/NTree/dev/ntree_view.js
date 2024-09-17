$('#ntree_organization').change(function(){
	
	var str_org_id=$('#ntree_organization  option:selected').val()
//	if(str_org_id!='0')
//	{
//	   $('#ntree_div').hide(); $('#vision_mission').hide(); $('#total_objective_div').show(); 
//	   $('#org_chart_view').show(); 
//	   
//	   $.ajax({
//			type:'GET',
//			url: '/ntree_dashboard/',
//			data  : { 'str_org_id':str_org_id},
//			success: function (json_data){
//				
//				var data=JSON.parse(json_data);
//				if(data.result!='NTE03')
//				{
//				   $('#total_objective_div').html("Total Objectives :"+" "+data.total_org_obj)
//				   expected_completion_chart(data.completed_expected)
//				   objective_stages_chart(data.objectives_levels)
//				   completed_objective_stages_chart(data.completed_objective_stages)
//				   total_org_obj_chart(data.total_organization_objective)
//				}
//				if(data.result=='NTE03')
//				{   
//					$('#total_objective_div').html("Total Objectives :"+" "+0)
//					document.getElementById("chart_div").innerHTML ="<img class='center-block' src='/static/ui/images/no_data.jpg'/>";
//					document.getElementById("chart_div1").innerHTML ="<img class='center-block' src='/static/ui/images/no_data.jpg'/>";
//					document.getElementById("completed_objectives").innerHTML ="<img class='center-block' src='/static/ui/images/no_data.jpg'/>";
//					document.getElementById("total_org_objectives").innerHTML ="<img class='center-block' src='/static/ui/images/no_data.jpg'/>";
//				}
//			},
//	   })
//	   
//	}
//	else{  $('#ntree_div').show(); $('#org_chart_view').hide(); $('#total_objective_div').hide(); }
//	
	if(str_org_id!='0' && str_org_id!='')
	{
		$.ajax({
			type:'GET',
			url: '/shit/org_unit_fetch/',
			async : false,
			data  : { 'str_org_id':str_org_id},
			success: function (json_data){
				var data=json_data
				$('#ntree_organization_unit').html('')
				$('#ntree_organization_unit').append($('<option>', {
	                    value :'0',
	                    text :'--Select--'
				 }));
				if(data)
				{
					var data_len=data.org_unit.length;
					if(data_len>=1)
					{  
						for(var i=0;i<data_len;i++)
						{   
							$('#ntree_organization_unit').append($('<option>', {
			                    value : data.org_unit[i].id,
			                    text : data.org_unit[i].orgunit_name,
			                }));
						}
					}
					else{ $('#ntree_organization_unit').val('0').trigger("change"); }
				}
				else{ $('#ntree_organization_unit').val('0').trigger("change"); }
			},
		})	
	}
	else {
		$('#ntree_organization_unit').html('')
		$('#ntree_organization_unit').append($('<option>', {
            value :'0',
            text :'--Select--'
	 }));
	$('#ntree_organization_unit').val('0').trigger("change"); }
});

$('#ntree_organization_unit').change(function(){
	var org_unit_id=$('#ntree_organization_unit  option:selected').val()
	if(org_unit_id!='0' && org_unit_id!='')
	{
		$.ajax({
			type:'POST',
			url: '/OKR/process_view/',
			async : false,
			data  : { 'org_unit_id':org_unit_id,csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()},
			success: function (json_data){
				if(json_data.team_detail.length!=0)
					{
					window.location.href = '/OKR/information-view/'+org_unit_id+'/';
					}
			}
			})
	}
})

function expected_completion_chart(chart_data)
{  
   var data=chart_data.length;
   if(data>0)
   {   
	   if(chart_data[0]['expectation']!=0 || chart_data[0]['completion']!=0)
	   {
		  AmCharts.makeChart("chart_div", {
				"type": "pie",
				"fontFamily": "'Poppins', sans-serif",
				"theme": "light",
				"outlineColor": "",
				"color": "#000",
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
					"title": "Expected"+"  "+chart_data[0]['expectation']+'%',
					"value": chart_data[0]['expectation'],
					"color": "#d97df0"
				}, {
					"title": "Completed"+"  "+chart_data[0]['completion']+'%',
					"value": chart_data[0]['completion'],
					"color": "#53c6fa"       
					
				}],
				"titleField": "title",
				"valueField": "value",
				"radius": "42%",
				"innerRadius": "60%",
				"labelText": "[[title]]",
				"export": {
					"enabled": false
				},
				"showBalloon": false
				
			});
	   } else { document.getElementById("chart_div").innerHTML ="<img class='center-block'  src='/static/ui/images/no_data.jpg'/>"; }
   }
   else { document.getElementById("chart_div").innerHTML ="<img class='center-block' src='/static/ui/images/no_data.jpg'/>"; }
}
function objective_stages_chart(chart_data)
{
	var data=chart_data.length;
	   if(data>0)
	   {   
		 if(chart_data[0]['risk']!=0 || chart_data[0]['exceeded']!=0 || chart_data[0]['completed']!=0 || chart_data[0]['on_track']!=0)
	     {
			 AmCharts.makeChart( "chart_div1", {
				 "type": "pie",
				 "fontFamily": "'Poppins', sans-serif",
				    "theme": "light",
				    "innerRadius": "40%",
				    "color": "#000",
					"colorField": "color",
	//			    "gradientRatio": [-0.4, -0.4, -0.4, -0.4, -0.4, -0.4, 0, 0.1, 0.2, 0.1, 0, -0.2, -0.5],
				    "dataProvider": [{
				        "country": "Risk",
				        "litres": chart_data[0]['risk'],
				         "color": "#fcaa7d"
				    }, {
				        "country": "Exceeded",
				        "litres": chart_data[0]['exceeded'],
				        "color":'#00baff'
				    }, {
				        "country": "Completed",
				        "litres": chart_data[0]['completed'],
				        "color":'#fa8e90'
				    }, {
				        "country": "On track",
				        "litres": chart_data[0]['on_track'],
				        "color":'#2de6c9'
				    }],
				    "balloonText": "[[value]]",
				    "valueField": "litres",
				    "titleField": "country",
				    "balloon": {
				        "drop": true,
				        "adjustBorderColor": false,
				        "color": "#FFFFFF",
				        "fontSize": 16
				    },
				    "export": {
				        "enabled": false
				    },
				    "showBalloon": false
				});
	     }else { document.getElementById("chart_div1").innerHTML ="<img class='center-block' src='/static/ui/images/no_data.jpg'/>"; }
	   } else { document.getElementById("chart_div1").innerHTML ="<img class='center-block' src='/static/ui/images/no_data.jpg'/>"; }
}

function completed_objective_stages_chart(chart_data)
{
	var data=chart_data.length;
	   if(data>0)
	   {   
		 if(chart_data[0]['exceeded']!=0 || chart_data[0]['on_track']!=0)
		 {
			 AmCharts.makeChart( "completed_objectives", {
				 "type": "pie",
				 "fontFamily": "'Poppins', sans-serif",
				  "theme": "light",
				  "color": "#000",
					"colorField": "color",
				  "dataProvider": [ {
				    "country": "Overdue Completion",
				    "litres": chart_data[0]['exceeded'],
				    "color":'#f6d167'
				  }, {
				    "country": "On Time Completion",
				    "litres": chart_data[0]['on_track'],
				    "color":'#fca980'
				  } ],
				  "valueField": "litres",
				  "titleField": "country",
				   "balloon":{
				   "fixedPosition":true
				  },
				  "export": {
				    "enabled": false
				  },
				  "showBalloon": false
				} );
		 } else { document.getElementById("completed_objectives").innerHTML ="<img  class='center-block' src='/static/ui/images/no_data.jpg'/>"; }
	   }  else { document.getElementById("completed_objectives").innerHTML ="<img class='center-block' src='/static/ui/images/no_data.jpg'/>"; }
}

function total_org_obj_chart(chart_data)
{
	var data=chart_data.length;
	   if(data>0)
	   {  
		 AmCharts.makeChart( "total_org_objectives", {
			 "type": "serial",
			 "fontFamily": "'Poppins', sans-serif",
			  "theme": "light",
			  "color": "#000",
			  "colorField": "color",
			  "align":"right",
			  "dataProvider": chart_data,
			  "valueAxes": [ {
			    "gridColor": "#d97df0",
			    "minimum": 0,
			  } ],
			  "gridAboveGraphs": true,
			  "startDuration": 1,
			  "graphs": [ {
			    "balloonText": "[[category]]: <b>[[value]]</b>",
			    "fillAlphas": 0.8,
			    "lineAlpha": 0.2,
			    "type": "column",
			    "valueField": "visits",
			    	  "fillColorsField": "color",
			    	
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
			    "tickLength": 20,
			  },
			  "export": {
			    "enabled": false
			  }

			} );
	   }   else { document.getElementById("total_org_objectives").innerHTML ="<img class='center-block'  src='/static/ui/images/no_data.jpg'/>"; }
}	
$("#ntree_organization").attr("data-placeholder","Organization");
$("#ntree_organization").select2();	
$("#ntree_organization_unit").attr("data-placeholder","Organization unit");
$("#ntree_organization_unit").select2();	