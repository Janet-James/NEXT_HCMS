$(document).ready(function() {
	
	var gaugeChart = AmCharts.makeChart("chartdiv", {
		"type" : "gauge",
		startDuration : 1,
		"theme" : "light",
		"axes" : [ {
			"axisAlpha" : 0,
			"tickAlpha" : 0,
			"labelsEnabled" : false,
			"startValue" : 0,
			"endValue" : 100,
			"startAngle" : 90,
			"endAngle" : 360,
			"bands" : [ {
				"color" : "#eee",
				"startValue" : 0,
				"endValue" : 100,
				"radius" : "100%",
				"innerRadius" : "85%"
			}, {
				"color" : "#4cda64 ",
				"startValue" : 0,
				"endValue" : 80,
				"radius" : "100%",
				"innerRadius" : "85%",
				"balloonText" : "90%"
			}, {
				"color" : "#5ac8fb",
				"startValue" : 0,
				"endValue" : 100,
				"radius" : "80%",
				"innerRadius" : "65%"
			}, ]
		} ],
		"allLabels" : [ {
			"text" : "20%",
			"x" : "52%",
			"y" : "5%",
			"size" : 12,
			"bold" : true,
			"color" : "#3f4047",
			"align" : "left",
		}, {
			"text" : "50%",
			"x" : "52%",
			"y" : "15%",
			"size" : 12,
			"bold" : true,
			"color" : "#3f4047",
			"align" : "left",
		}, ],
		"export" : {
			"enabled" : true
		}
	});

	var gaugeChart = AmCharts.makeChart("chartdiv1", {
		"type" : "gauge",
		startDuration : 1,
		"theme" : "light",
		"axes" : [ {
			"axisAlpha" : 0,
			"tickAlpha" : 0,
			"labelsEnabled" : false,
			"startValue" : 0,
			"endValue" : 100,
			"startAngle" : 90,
			"endAngle" : 360,
			"bands" : [ {
				"color" : "#eee",
				"startValue" : 0,
				"endValue" : 100,
				"radius" : "100%",
				"innerRadius" : "85%"
			}, {
				"color" : "#4cda64",
				"startValue" : 0,
				"endValue" : 80,
				"radius" : "100%",
				"innerRadius" : "85%",
				"balloonText" : "90%"
			}, {
				"color" : "#5ac8fb",
				"startValue" : 0,
				"endValue" : 100,
				"radius" : "80%",
				"innerRadius" : "65%"
			}, ]
		} ],
		"allLabels" : [ {
			"text" : "50%",
			"x" : "52%",
			"y" : "5%",
			"size" : 12,
			"bold" : true, 
			"color" : "#3f4047",
			"align" : "left"
		}, {
			"text" : "30%",
			"x" : "52%",
			"y" : "15%",
			"size" : 12,
			"bold" : true,
			"color" : "#3f4047",
			"align" : "left"
		}, ],
		"export" : {
			"enabled" : true
		},
		"balloon": {
            "enabled": true
        },
	});

	var gaugeChart = AmCharts.makeChart("chartdiv2", {
		"type" : "gauge",
		startDuration : 1,
		"theme" : "light",
		"axes" : [ {
			"axisAlpha" : 0,
			"tickAlpha" : 0,
			"labelsEnabled" : false,
			"startValue" : 0,
			"endValue" : 100,
			"startAngle" : 90,
			"endAngle" : 360,
			"bands" : [ {
				"color" : "#eee",
				"startValue" : 0,
				"endValue" : 100,
				"radius" : "100%",
				"innerRadius" : "85%"
			}, {
				"color" : "#4cda64",
				"startValue" : 0,
				"endValue" : 80,
				"radius" : "100%",
				"innerRadius" : "85%",
				"balloonText" : "90%"
			}, {
				"color" : "#5ac8fb",
				"startValue" : 0,
				"endValue" : 100,
				"radius" : "80%",
				"innerRadius" : "65%"
			}, ]
		} ],
		"allLabels" : [ {
			"text" : "50%",
			"x" : "52%",
			"y" : "5%",
			"size" : 12,
			"bold" : true,
			"color" : "#3f4047",
			"align" : "left"
		}, {
			"text" : "89%",
			"x" : "52%",
			"y" : "15%",
			"size" : 12,
			"bold" : true,
			"color" : "#3f4047",
			"align" : "left"
		}, ],
		"export" : {
			"enabled" : true
		}
	});

	var gaugeChart = AmCharts.makeChart("chartdiv3", {
		"type" : "gauge",
		startDuration : 1,
		"theme" : "light",
		"axes" : [ {
			"axisAlpha" : 0,
			"tickAlpha" : 0,
			"labelsEnabled" : false,
			"startValue" : 0,
			"endValue" : 100,
			"startAngle" : 90,
			"endAngle" : 360,
			"bands" : [ {
				"color" : "#eee",
				"startValue" : 0,
				"endValue" : 100,
				"radius" : "100%",
				"innerRadius" : "85%"
			}, {
				"color" : "#4cda64",
				"startValue" : 0,
				"endValue" : 80,
				"radius" : "100%",
				"innerRadius" : "85%",
				"balloonText" : "90%"
			}, {
				"color" : "#5ac8fb",
				"startValue" : 0,
				"endValue" : 100,
				"radius" : "80%",
				"innerRadius" : "65%"
			}, ]
		} ],
		"allLabels" : [ {
			"text" : "55%",
			"x" : "52%",
			"y" : "5%",
			"size" : 12,
			"bold" : true,
			"color" : "#3f4047",
			"align" : "left"
		}, {
			"text" : "66%",
			"x" : "52%",
			"y" : "15%",
			"size" : 12,
			"bold" : true,
			"color" : "#3f4047",
			"align" : "left"
		}, ],
		"export" : {
			"enabled" : true
		}
	});

	var gaugeChart = AmCharts.makeChart("chartdiv4", {
		"type" : "gauge",
		startDuration : 1,
		"theme" : "light",
		"axes" : [ {
			"axisAlpha" : 0,
			"tickAlpha" : 0,
			"labelsEnabled" : false,
			"startValue" : 0,
			"endValue" : 100,
			"startAngle" : 90,
			"endAngle" : 360,
			"bands" : [ {
				"color" : "#eee",
				"startValue" : 0,
				"endValue" : 100,
				"radius" : "100%",
				"innerRadius" : "85%"
			}, {
				"color" : "#4cda64",
				"startValue" : 0,
				"endValue" : 80,
				"radius" : "100%",
				"innerRadius" : "85%",
				"balloonText" : "90%"
			}, {
				"color" : "#5ac8fb",
				"startValue" : 0,
				"endValue" : 100,
				"radius" : "80%",
				"innerRadius" : "65%"
			}, ]
		} ],
		"allLabels" : [ {
			"text" : "22%",
			"x" : "52%",
			"y" : "5%",
			"size" : 12,
			"bold" : true,
			"color" : "#3f4047",
			"align" : "left"
		}, {
			"text" : "77%",
			"x" : "52%",
			"y" : "15%",
			"size" : 12,
			"bold" : true,
			"color" : "#3f4047",
			"align" : "left"
		}, ],
		"export" : {
			"enabled" : true
		}
	});

	var $radios = $('input:radio[name=teamSelect]');
    if($radios.is(':checked') === false) {
        $radios.filter('[value=employee]').prop('checked', true);
        $("#employeePage").css({'display':'block'})
        $("#chartPage").css({'display':'block'})
        $("#managementDiv").removeClass('col-lg-12')
        $("#managementDiv").addClass('col-lg-6')
    }
    $radios.click(function(){
        if($('input:radio[name=teamSelect]:checked').val() == "employee"){
        	$("#employeePage").css({'display':'block'})
            $("#chartPage").css({'display':'block'})
            $("#businessObjectivesPage").css({'display':'none'})
            $("#managementDiv").removeClass('col-lg-12');
            $("#managementDiv").addClass('col-lg-6');
        }
        else if($('input:radio[name=teamSelect]:checked').val() == "business_objectives"){
        	$("#businessObjectivesPage").css({'display':'block'})
        	$("#employeePage").css({'display':'none'})
            $("#chartPage").css({'display':'none'})
            $("#managementDiv").removeClass('col-lg-6');
            $("#managementDiv").addClass('col-lg-12');
        }
    });
	$.ajax({
		type:"GET",
		url: "/businessObjectiveFetch/",
		async: false,
	}).done(function(json_data){
				 
	            'use strict';
	            var grid = $("#treegrid");
	            var mydata = json_data['data'];
	            grid.jqGrid({
	                datatype: "jsonstring",
	                datastr: {
	                    total: 1,
	                    page: 1,
	                    records: mydata.length,
	                    rows: mydata
	                },
	            	
	                jsonReader: { repeatitems: false },
	                colNames:["Id","Summary","Actions","Target","Actual"],
	                colModel:[
	{name:'id', index:'id', hidden:true, key:true},
	{name:'name',  index:'name'},
	{name:'actions', index:'actions', align:"center"},
	{name:'target', index:'target',align:"center"},  
	{name:'actual', index:'actual',align:"center"},
	                ],
	                height: 'auto',
	                gridview: true,
	                rowNum: 10000,
	                sortname: 'name',
	                treeGrid: true,
	                treeGridModel: 'adjacency',
	                treedatatype: "local",
	                ExpandColumn: "name",
	            });
	            $("#treegrid tbody tr").not(':first').not(':last').css("height","100px");
	            AmCharts.addInitHandler(
	          		  function(chart) {
	          		    chart.rotate = false;
	          		  },
	          		  ["serial"]
	          		); 

	          
	        });
	
	//click function for the get Values on OrgUnit Search and Select
	$('#org_unit_save').click(function() {
		arrayOfValues = [];
		arrayOfValues = org_unit_id;
		$('#organizationUnitIdList').val(org_unit_name.toString());
		$.ajax({
			type:"GET",
			url: "/team_data_chart/",
			data:{"orgUnitId":JSON.stringify(arrayOfValues)},
			async: false,
		}).done(function(json_data){
			var teamName = json_data["teamInfo"]
			var chart = AmCharts.makeChart("chartdiv-arrow", {
	            "theme": "light",
	            "type": "serial",
	            "columnWidth": 0.5,
	            "dataProvider": teamName,
	            "valueAxes": [{
	                "axisAlpha": 0,
	                "gridAlpha": 0.1,
	                "title": "Overall Performance Score",
	            }],
	            "startDuration": 1,
	            "graphs": [{
	                "colorField": "color",
	                "fillAlphas": 0.8,
	                "lineAlpha": 0.5,
	                "fixedColumnWidth": 35,
	                "type": "column",
	                "valueField": "endTime",
	                "fillColors":"#C1E2F0",
	            }],
	            "chartScrollbar": {
	                "scrollbarHeight": 20
	            },
	            "rotate": true,
	            "columnWidth": 1,
	            "categoryField": "name",
	            "categoryAxis": {
	                "gridPosition": "start",
	                "axisAlpha": 0,
	                "gridAlpha": 0.1,
	                "position": "left",
	                "title": "Project Teams",
	                "labelRotation": 45,
	            },
	            "balloon": {
	                "enabled": false
	          },
	            "export": {
	            	"enabled": true
	             }
	          });
		});
	})
		$('#orgModal').modal('hide');
	});
	
