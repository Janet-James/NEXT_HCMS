$('document').ready(function(){
	data_load();
	line_chart();
});

function line_chart()
{   
	  var chartData = [];
	  var firstDate = new Date();
	  firstDate.setDate( firstDate.getDate() - 150 );
	  var visits = -40;
	  var b = 0.6;
	  for ( var i = 0; i < 150; i++ ) {
	    var newDate = new Date( firstDate );
	    newDate.setDate( newDate.getDate() + i );
	    if(i > 80){
	        b = 0.4;
	    }
	    visits += Math.round((Math.random()<b?1:-1)*Math.random()*10);

	    chartData.push( {
	      date: newDate,
	      visits: visits
	    } );
	  }
	AmCharts.makeChart("chartdiv5", {
		"theme": "light",
		  "type": "serial",
		  "dataProvider": chartData,
		  "valueAxes": [ {
		    "inside": true,
		    "axisAlpha": 0
		  } ],
		  "graphs": [ {
		    "id": "g1",
		    "balloonText": "<div style='margin:5px; font-size:19px;'><span style='font-size:13px;'>[[category]]</span><br>[[value]]</div>",
		    "bullet": "round",
		    "bulletBorderAlpha": 1,
		    "bulletBorderColor": "#FFFFFF",
		    "hideBulletsCount": 50,
		    "lineThickness": 2,
		    "lineColor": "#52c7f9",
		    "negativeLineColor": "#f6d166",
		    "valueField": "visits"
		  } ],
		  "chartScrollbar": {
		  },
		  "chartCursor": {},
		  "categoryField": "date",
		  "categoryAxis": {
		    "parseDates": true,
		    "axisAlpha": 0,
		    "minHorizontalGap": 55
		  }
	});


	AmCharts.makeChart("chartdiv4", {

		"fontFamily": "'Poppins', sans-serif",

		"theme": "light",
	    "type": "serial",
	    "dataProvider": [{
	        "country": "DOW(2016)",
	        "year2004": 2.6,
	        "year2005": 4.9,
	        "color" :"#52c7f9",
	        "color1" :"#f6d166"
	    }, {
	        "country": "DOW(2017)",
	        "year2004": 6.4,
	        "year2005": 7.2,
	        "color" :"#52c7f9",
	        "color1" :"#f6d166"
	    }, {
	        "country": "DOW(2018)",
	        "year2004": 8,
	        "year2005": 7.1,
	        "color" :"#52c7f9",
	        "color1" :"#f6d166"
	    }],
	    "valueAxes": [{
	       // "stackType": "3d",
	        "unit": "%",
	        "position": "left",
	        "title": "Consumption Rate",
	    }],
	    "startDuration": 1,
	    "graphs": [{
	        "balloonText": "Power Consumption in [[category]]: <b>[[value]]</b>",
	        "fillAlphas": 0.9,
	        "lineAlpha": 0.2,
	        "title": "2004",
	        "type": "column",
	        "colorField" :"color",
	        "valueField": "year2004"
	    }, {
	        "balloonText": "Power Consumption in [[category]]: <b>[[value]]</b>",
	        "fillAlphas": 0.9,
	        "lineAlpha": 0.2,
	        "title": "2005",
	        "type": "column",
	        "colorField" :"color1",
	        "valueField": "year2005"
	    }],
	    "plotAreaFillAlphas": 0.1,
	    "depth3D": 0,
	    "angle": 30,
	    "categoryField": "country",
//	    "colorField": "color",
	    "categoryAxis": {
	        "gridPosition": "start"
	    },
	    "export": {
	    	"enabled": true
	     }
	});
}

function data_load()
{
	$('#year_data').html('')
	$('#organization').html('')
	$('#quarter').html('')
	var year = (new Date()).getFullYear();               //year data load
	var current = year;
	year -= 3;
	for (var i = 0; i < 8; i++) {
		$('#year_data').append($('<option>', {
			value :year + i,
			text : year + i,
		}));
		$('#year_data option[value='+current+']').attr('selected','selected');
	}
	var today = new Date();                //quarter data load
	var quarter = Math.floor((today.getMonth() + 3) / 3);
	var quarter_data=[]
	quarter_data['1']='Quarter 1'
		quarter_data['2']='Quarter 2'
			quarter_data['3']='Quarter 3'
				quarter_data['4']='Quarter 4'
					for(var i=1;i<quarter_data.length;i++)
					{
						$('#quarter').append($('<option>', {
							value :i,
							text : quarter_data[i],
						}));
					}
	if(quarter>=0) { $('#quarter option[value='+quarter+']').attr('selected','selected'); }
	$.ajax({
		type:'GET',                        //organization data load
		url: '/pm_dashboard_employee_org',               
		success: function (json_data){
			var data=json_data.emp_org
			var org_data=json_data.org
			if(org_data)
			{  
				for (var i = 0; i < org_data.length; i++) {
					$('#organization').append($('<option>', {
						value :org_data[i].id,
						text : org_data[i].name,
					}));
				}
			}
			if(data.length>0)
			{
				$('#organization option[value='+data[0].org_id+']').attr('selected','selected');
				perspective_chart()
				bsc_perspective()
				$('#organization  option:selected').val($('#organization').val()).trigger('change')
				var org_unit = $('#org_unit option:selected').val()
				$('#org_unit').val(data[0].unit_id).trigger('change')
//				$('#division').val(data[0].team_id).trigger('change')
//				org_chart(org_unit);
//				people_rating()
			}
			perspective_chart()
			bsc_perspective()
		}
	})
}

$('#year_data').change(function (){
	perspective_chart()
	bsc_perspective()
	org_chart("division")
	people_rating("division")
});

$('#organization').change(function (){
	perspective_chart()
	bsc_perspective()
	org_chart("division")
	people_rating("division")
});

$('#quarter').change(function (){
	perspective_chart()
	bsc_perspective()
	org_chart("division")
	people_rating("division")
});

$('#division').change(function(){
	org_chart("division");
	people_rating("division")
})
$('#org_unit').change(function(){
	$('#division').val(0).trigger('change')
	org_chart("division");
	people_rating("division")
})
function bsc_perspective_datatable(bsc_perspective){
	var year=$('#year_data').val()
	var quarter=$('#quarter').val()
	var org=$('#organization').val()
	columns = [{"title":"hidden Id","visible": false},{"title":"No."},{"title":"Objectives"},{"title":"Target"},{"title":"Progress"}]
	$.ajax({
		type:"GET",
		url: "/objectives_perspective_click/",
		data:{'year':year,'quarter':quarter,'organization':org,'bsc_perspective':bsc_perspective },
		async: false,
		success: function (json_data) {
			if(json_data.status=="NTE_01")
			{
				data_list = [];
				for (var i=0; i<json_data['bsc_perspective_data'].length; i++){
					data_list.push([json_data['bsc_perspective_data'][i].id,i+1,json_data['bsc_perspective_data'][i].objectives,json_data['bsc_perspective_data'][i].target_date,json_data['bsc_perspective_data'][i].progress]);
				}
				plaindatatable_btn('perspectiveModalTable', data_list, columns,[])
			}
		}
	});      
}
function bsc_perspective_click(perspective,tbodyId){
	if($('#'+tbodyId).data('id')=='1'){
		$("#perspectiveModal").modal('show')
		$("#perspectiveTitle").text(perspective+" Perspective")
		bsc_perspective_datatable(perspective)
	}
}
function bsc_perspective(){
	var year=$('#year_data').val()
	var quarter=$('#quarter').val()
	var org=$('#organization').val()
	var html = ''
		if(year!='' && quarter!='' && org!=''){
			$.ajax({
				type:'GET',
				url: '/objectives_perspective/',
				data:{'year':year,'quarter':quarter,'organization':org },
				success: function (json_data){
					if(json_data.status == "NTE_01"){
						$('#financialtbody,#learninggrowthtbody,#customertbody,#internalprocesstbody').html("");
						var listVal = []
						dict = {}
						var perspectiveArr = Array.from(new Set(json_data['perspective_data'].map(function(item){ return item.perspective })));
						perspectiveArr.some(function(item, idx){
							listVal = []
							json_data['perspective_data'].map(data=>{
								if(data.perspective == perspectiveArr[idx]){
									delete data.perspective
									listVal.push(data)
								}
							})
							dict[perspectiveArr[idx]] = listVal
						});
						for(var j in dict){
							html = ''
								if(dict[j].length>0){
									for(var i=0;(i<dict[j].length)&&(i<3);i++){
										html = html + '<tr>\
										<td class="textlimit">'+dict[j][i].objectives+'</td>\
										<td>'+dict[j][i].target_date+'</td>\
										<td>'+dict[j][i].progress+'</td>\
										</tr>'
									}
									$('#'+j.replace(/\s/g,'').replace('&','').toLowerCase()+'tbody').data('id','1')
									$('#'+j.replace(/\s/g,'').replace('&','').toLowerCase()+'tbody').append(html)
								}
								else{
									$('#'+j.replace(/\s/g,'').replace('&','').toLowerCase()+'tbody').data('id','0')
									$('#'+j.replace(/\s/g,'').replace('&','').toLowerCase()+'tbody').append("<span class='blink_me nodata_text'>No Data Available </span>")
								}
						}
						
						jQuery.each( $(".balance_scorecard tbody"), function( i, val ) {
							  if(this.innerHTML==""){
								  $(this).attr('data-id','0')
								  $(this).append("<span class='blink_me nodata_text'>No Data Available </span>")
							  }
							});
					}
					else {  
						$('#financialtbody,#learninggrowthtbody,#customertbody,#internalprocesstbody').data('id','0')
						$('#financialtbody,#learninggrowthtbody,#customertbody,#internalprocesstbody').html("<span class='blink_me nodata_text'>No Data Available </span>");  }
				}
			})
		}
}

function perspective_chart()
{ 
	var year=$('#year_data').val()
	var quarter=$('#quarter').val()
	var org=$('#organization').val()
	if(year!='' && quarter!='' && org!='')
	{
		$.ajax({
			type:'GET',
			url: '/pm_dashboard_organization_perspective',
			data:{'year':year,'quarter':quarter,'org':org },
			success: function (json_data){
				var data=json_data.perspctive_info
				$('#CSTMR_count,#FINAN_count,#IPRCS_count,#LRNGR_count').html("");
				$('#CSTMR,#FINAN,#IPRCS,#LRNGR').html("<span class='blink_me nodata_text'>No Data Available </span>"); 
				if(data.length>0)
				{   
					for(var i=0;i<data.length;i++)
					{   
						if(data[i]['refitems_code']=='CSTMR')
						{      
							if(data[i]['progress']!=null)
							{
								perspective_chart_formation(data[i]['progress'],'CSTMR','CSTMR_count', '#e2a141')
							}
						}
						if(data[i]['refitems_code']=='FINAN')
						{  
							if(data[i]['progress']!=null)
							{
								perspective_chart_formation(data[i]['progress'],'FINAN','FINAN_count', '#53c6fa')
							}
						}
						if(data[i]['refitems_code']=='IPRCS')
						{   
							if(data[i]['progress']!=null)
							{
								perspective_chart_formation(data[i]['progress'],'IPRCS','IPRCS_count', '#8e66ff')
							}
						}
						if(data[i]['refitems_code']=='LRNGR')
						{  
							if(data[i]['progress']!=null)
							{
								perspective_chart_formation(data[i]['progress'],'LRNGR','LRNGR_count', '#d97df0')
							}
						}
					}
				}
				else {  $('#CSTMR,#FINAN,#IPRCS,#LRNGR').html("<span class='block blink_me nodata_text'>No Data Available </span>"); 
				$('#CSTMR_count,#FINAN_count,#IPRCS_count,#LRNGR_count').html(""); }
			}
		})
	}
	else {   $('#CSTMR,#FINAN,#IPRCS,#LRNGR').html("<span class='blink_me nodata_text'>No Data Available </span>");$('#CSTMR_count,#FINAN_count,#IPRCS_count,#LRNGR_count').html(""); alert_lobibox("info","Select Fields"); }
}
function perspective_chart_formation(progress,chart_id,lable_id,color)
{  
	if((progress!='' && progress>0) &&  chart_id!=''){
		var chart = AmCharts.makeChart( chart_id, {
			"type": "pie",
			"theme": "light",
			"dataProvider": [ {
				"title": "Completion",
				"value": progress,
				"fieldColor":color
			}, {
				"title": "Expectation",
				"value": 100-progress,	  
				"fieldColor":  "#efefef"
			} ],
			"titleField": "title",
			"valueField": 'value',
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
		$('#'+lable_id).html(progress)
	}
	else {  $('#CSTMR_count,#FINAN_count,#IPRCS_count,#LRNGR_count').html("");  $('#CSTMR,#FINAN,#IPRCS,#LRNGR').html("<span class='blink_me nodata_text'>No Data Available </span>"); }
}

function org_chart(data){
	var year=$('#year_data').val()
	var quarter=$('#quarter').val()
	var org=$('#organization').val()
	var division_id=$('#division').val()
	if (data=="division" && $('#org_unit').val()!='0'){ var url = '/pmd_division_change/' }
	else{ url = '/performance_division_data/' }
	if(year!='' && quarter!='' && org!=''){
	$.ajax({
		type:'GET',
		url: url,
		async : false,
		data  : {'year':year,'quarter':quarter,'org':org,'division_id':division_id,'org_unit':$('#org_unit').val()},
		success: function (json_data){
			var orgunit_div_count=''
				$("#carousel_div_slide").empty();
			$("#carousel_div_view").empty();
			var slide_data='';
				var slide_div_data='';
				var data = json_data
				if(data.length!=0)
				{
					orgunit_div_count=Math.ceil(data.length/3)
					if (orgunit_div_count!=0)
					{
								for(var i=0;i<orgunit_div_count;i++)
								{  
									if(i==0){
										slide_data+='<li data-target="#Carousel" data-slide-to="'+i+'" class="active"></li>'
										slide_div_data+='<div class="item active"><div class="row"><div class="col-md-12 col-sm-12"> <span id="chart_span'+i+'0"></span> <div class="bulletchartdiv" id="chartdiv'+i+'0"></div><span id="chart_span'+i+'1"></span><div class="bulletchartdiv" id="chartdiv'+i+'1"></div><span id="chart_span'+i+'2"></span><div class="bulletchartdiv" id="chartdiv'+i+'2"></div></div></div></div>'
									}else{slide_data+='<li data-target="#Carousel" data-slide-to="'+i+'"></li>'
										slide_div_data+='<div class="item "><div class="row"><div class="col-md-12 col-sm-12"> <span id="chart_span'+i+'0"></span> <div class="bulletchartdiv" id="chartdiv'+i+'0"></div><span id="chart_span'+i+'1"></span><div class="bulletchartdiv" id="chartdiv'+i+'1"></div><span id="chart_span'+i+'2"></span><div class="bulletchartdiv" id="chartdiv'+i+'2"></div></div></div></div>'
									}
								}
						$("#carousel_div_slide").append(slide_data);
						$("#carousel_div_view").append(slide_div_data);
							count=0
							div_count=0
							for(var k=0;k<data.length;k++)
							{
								if (count>2)
								{
									count=0;
									div_count=div_count+1
								}
								chart_div='chartdiv'+div_count+count
								$('#chart_span'+div_count+count).text((k+1)+') '+data[k].orgunit_name)
								bullet_chart(chart_div,data[k].orgunit_name,data[k].expect,data[k].competition)
								count=count+1
							}
					}
				}else{$("#carousel_div_slide").html("<span class='blink_me nodata_text'>No Data Available </span>")}
		}
	});
	}else{alert_lobibox("info","Select Fields")}
}

function bullet_chart(div_name,name,expected,completion)
{
	var chart = AmCharts.makeChart( div_name, {
		"type": "serial",
		"rotate": true,
		"theme": "light",
		"autoMargins": false,
		"marginTop": 30,
		//"marginLeft": 80,
		"marginBottom": 30,
		"marginRight": 50,
		"dataProvider": [ {
			"category": '',
			"excelent": 20,
			"good": 20,
			"average": 20,
			"poor": 20,
			"bad": 20,
			"limit": expected,
			"full": 100,
			"bullet": completion
		} ],
		"valueAxes": [ {
			"maximum": 100,
			"stackType": "regular",
			"gridAlpha": 0
		} ],
		"startDuration": 1,
		"graphs": [ {
			"valueField": "full",
			"showBalloon": false,
			"type": "column",
			"lineAlpha": 0,
			"fillAlphas": 0.8,
			"fillColors": [ "#c4ffce", "#c4ffce", "#c4ffce" ],
			"gradientOrientation": "horizontal",
		}, {
			"clustered": false,
			"columnWidth": 0.3,
			"fillAlphas": 1,
			"lineColor": "#ffa4a2",
			"stackable": false,
			"type": "column",
			"valueField": "bullet"
		}, {
			"columnWidth": 0.5,
			"lineColor": "#020202 ",
			"lineThickness": 3,
			"noStepRisers": true,
			"stackable": false,
			"type": "step",
			"valueField": "limit"
		} ],
		"columnWidth": 1,
		"categoryField": "category",
		"categoryAxis": {
			"gridAlpha": 0,
			"position": "left"
		}
	} );
	}

function people_rating(rate){
	var url=''
	var division_id=$('#division').val()
	if(rate == 'division' && $('#org_unit').val()!='0'){	url = "/performance_rating_data_division/"}
	else { url = "/performance_rating_data/"}
	$('#sec_name').html(''),$('#sec_per').html(''),$('#thir_per').html(''),$('#first_per').html(''),$('#thir_name').html(''),$('#first_name').html('')
	var year=$('#year_data').val()
	var quarter=$('#quarter').val()
	var org=$('#organization').val()
	if(year!='' && quarter!='' && org!='')
	{
	$.ajax({
		type:'GET',
		url: url,
		async : false,
		data  : {'year':year,'quarter':quarter,'org':org,'division_id':division_id,'org_unit':$('#org_unit').val()},
		success: function (json_data){
			var data = json_data
			if(data){if(data.length!=0){if(data.status){
			if (data.status.length >= '1' && data.status[0].avg_rating !=''){$('#sec_name').text(data.status[0].first_name+' '+data.status[0].last_name),$('#sec_per').text(data.status[0].avg_rating+"%")}
			else{$('#sec_name').text("No Data")}
			if (data.status.length >= '2' && data.status[1].avg_rating !=''){$('#thir_name').text(data.status[1].first_name+' '+data.status[1].last_name),$('#thir_per').text(data.status[1].avg_rating+"%")}
			else{$('#thir_name').text("No Data")}
			if (data.status.length >= '3' && data.status[2].avg_rating !=''){$('#first_name').text(data.status[2].first_name+' '+data.status[2].last_name),$('#first_per').text(data.status[2].avg_rating+"%")}
			else{$('#first_name').text("No Data")}
			}else{$('#first_name').text("No Data"),$('#thir_name').text("No Data"),$('#sec_name').text("No Data")}
		}else{}
			}
		}
	});
	}else{alert_lobibox("info","Select Fields")}
}

//Organization onchange
$('#organization').change(function(){
	var str_org_id=$('#organization  option:selected').val()
	if(str_org_id!='0' && str_org_id!=''){
	$.ajax({
		type:'GET',
		url: '/pmd_organization_unit/',
		async : false,
		data  : { 'str_org_id':str_org_id},
		success: function (json_data){
		var data=json_data
		$('#org_unit').html('')
		$('#org_unit').append($('<option>', {
            value :'0',
            text :'--Select--'
		}));
		if(data){
			var data_len=data.status.length;
			if(data_len>=1){  
				for(var i=0;i<data_len;i++){   
					$('#org_unit').append($('<option>', {
                    value : data.status[i].id,
                    text : data.status[i].orgunit_name,
			        }));
				}
			}else{ $('#org_unit').val('0').trigger("change"); }
				}else{ $('#org_unit').val('0').trigger("change"); }
			},
		})	
	}else {
		$('#org_unit').html('')
		$('#org_unit').append($('<option>', {
            value :'0',
            text :'--Select--'
		}));
		$('#org_unit').val('0').trigger("change"); }
});
//Organization unit onchange
$('#org_unit').change(function(){
	var str_org_unit_id=$('#org_unit  option:selected').val()
	var str_org_id=$('#organization  option:selected').val()
	if(str_org_unit_id!='0' && str_org_unit_id!='' ){
	$.ajax({
		type:'GET',
		url: '/pmd_division_view/',
		async : false,
		data  : { 'str_org_unit_id':str_org_unit_id,'str_org_id':str_org_id},
		success: function (json_data){
		var data=json_data
		$('#division').html('')
		$('#division').append($('<option>', {
            value :'0',
            text :'--Select--'
		}));
		if(data){
			var data_len=data.status.length;
			if(data_len>=1){  
				for(var i=0;i<data_len;i++){   
					$('#division').append($('<option>', {
	                    value : data.status[i].id,
	                    text : data.status[i].name,
			         }));
				}
			}else{ $('#division').val('0').trigger("change"); }
			}else{ $('#division').val('0').trigger("change"); }
			},
		})	
	}else {
		$('#division').html('')
		$('#division').append($('<option>', {
            value :'0',
            text :'--Select--'
		}));
		$('#division').val('0').trigger("change"); }
});