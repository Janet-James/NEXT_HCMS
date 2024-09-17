var project_id =''
var divid;
var worksummary_len =''
var count = 0
var query_active_tab
var global_timer=''

$(".query_li").click(function() 
{
	 query_active_tab=this.id
});

$('#task_timer').change(function(){

     timer_count=global_timer
     time_datetime=$('#task_timer').val();
     time_datetime=moment(time_datetime, 'YYYY-MM-DD HH:mm:ss');
     timer_time=moment(time_datetime).format("HH:mm:ss")
     added_time=moment.duration(timer_count).asMinutes() + moment.duration(timer_time).asMinutes()
     total_time=timeConvert1(added_time)
     $('#timer_count_id').text(total_time)

     
});

function timeConvert1(mins) {
  var hours =  Math.floor(mins / 60);
  var minutes = Math.floor(mins % 60); 
  decimal_part =Math.abs(mins)
  decimal_part=decimal_part - Math.floor(decimal_part)
  var seconds = Math.ceil(parseFloat(decimal_part) * 60);
  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;  
  time=hours +":"+ minutes+":"+ seconds
  return (time);
}

$('document').ready(function(){
	$('select:not(.normal)').each(function () {
	    $(this).select2({
	        dropdownParent: $(this).parent()
	    });
	});
		
	user_task_details()
	timer_icon_click("first")
	buttonshow()
	news_data_api();
	process_matrix_project()
	initial_attendance_chart()
	dev_talk_process()
	nmail_data()
	today_schedule_chart()
	survey_guidelines();
	plan_count();
	query_count();
	today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();
	if(dd<10) {  dd = '0'+dd } 
	if(mm<10) { mm = '0'+mm 	} 
	today = dd + '-' + mm + '-' + yyyy;
	 $("#task_timer_dtbox").DateTimePicker({
		dateFormat: "dd-MM-yyyy",
		maxDate: new Date(),
	});
})
// **************************************      || BAV || My NEXT Dashboard DATA    **************************************

												// Dev Talk Function
function dev_talk_process(){
	$.ajax({
		type:'GET',
		url: '/dev_talk_process/',
		async : false,
		data  : {},
		success: function (json_data){
		var data = json_data
		if(data){
			if(data.url_status=='200'){
				var str_dev_talk =''
					if(data.data.forum_listed_data){
				if(data.data.forum_listed_data.length>0){
				for(var a=0;a<data.data.forum_listed_data.length;a++){
					str_dev_talk+=' <div class="media"> <div class="media-left media-top"> <img src="http://npower.nexttechnosolutions.int/static/mobile_new/'+data.data.forum_listed_data[a].employee_image+'" class="media-object" onerror=this.src="http://npower.nexttechnosolutions.int/static/mobile_new/74.jpg">\
									</div> <div class="media-body"> <h4 class="media-heading">'+data.data.forum_listed_data[a].forum_type+'</h4><h3 class="media-heading">'+data.data.forum_listed_data[a].forum_title+'</h3> <p>'+data.data.forum_listed_data[a].forum_content+'</p>\
									</div> </div>'
						}
						$('#dev_talk').append(str_dev_talk)
					}else{ $('#dev_talk').append("<p class='no_data_found'>No Data Found</p>")}
					} else { $('#dev_talk').append("<p class='no_data_found'>No Data Found</p>")}
			} else { $('#dev_talk').append("<p class='no_data_found'>Data cannot be fetched.</p>")}
		}}
	})
}

													// NMail Function
function nmail_data(){
	$.ajax({
		type:'GET',
		url: '/mail_list/',
		async : false,
		data  : {},
		success: function (json_data){
		var data = json_data
		var mail_list = ''
//		if(data){
//			data.length ='3'
//			if(data.length>0){
//			for(var a=0;a<data.length;a++){
			for(var a=0;a<3;a++){
			/*	if(a==0){
					mail_list += '<div class="item active">   <div class="media-left media-top"> <img src="http://tst-hcms.nexttechnosolutions.com/media/user_profile/no_data.png" class="media-object"> </div> \
		                   <div class="media-body">\
		                       <h4 class="media-heading">'+data[a].from.split(':')[1]+'</h4>\
	                       <p>'+data[a].subject.split(':')[1].substring(0,20)+'......</p>\
		                       <span class="date"><i class="fa fa-star"></i>'+data[a].Date.substring(11,22)+'</span>\
		                       <span class="message">'+data[a].Condent+'..</span>\
		                   </div> \
		               </div>'
				}
				else{
					mail_list += '<div class="item">   <div class="media-left media-top"> <img src="http://tst-hcms.nexttechnosolutions.com/media/user_profile/no_data.png" class="media-object"> </div> \
		                   <div class="media-body">\
		                       <h4 class="media-heading">'+data[a].from.split(':')[1]+'</h4>\
	                       <p>'+data[a].subject.split(':')[1].substring(0,20)+'......</p>\
		                       <span class="date"><i class="fa fa-star"></i>'+data[a].Date.substring(11,22)+'</span>\
		                       <span class="message">'+data[a].Condent+'..</span>\
		                   </div> \
		               </div>'
				}*/
			/*	if(a==0){
				mail_list += '<div class="item active">   <div class="media-left media-top"> <img src="http://tst-hcms.nexttechnosolutions.com/media/user_profile/no_data.png" class="media-object"> </div> \
			                   <div class="media-body">\
			                       <h4 class="media-heading">Bavya Dharmaraj</h4>\
			                       <p>Code Review TFG Report......</p>\
			                       <span class="date"><i class="fa fa-star"></i> 01 Nov 2018</span>\
			                       <span class="message">Hereby, I have enclosed the MyNEXT Dashboard code review document..</span>\
			                   </div> \
			               </div>'
				}else {
					mail_list += '<div class="item">   <div class="media-left media-top"> <img src="http://tst-hcms.nexttechnosolutions.com/media/user_profile/no_data.png" class="media-object"> </div> \
		                   <div class="media-body">\
		                       <h4 class="media-heading">Esakkiprem Subramaniam</h4>\
		                       <p>Daily Task Report.......</p>\
		                       <span class="date"><i class="fa fa-star"></i> 01 Nov 2018</span>\
		                       <span class="message"> Hi Team, I have attached daily task report..</span>\
		                   </div> \
		               </div>'
				}*/
				}
//			}else{	mail_list += "<p class='no_data_found'>No Data Found.</p>"	}
		mail_list += "<p class='no_data_found'>No Data Found.</p>"
			$('#mail_list').append(mail_list)	
//		}
}
	})
}
//Function for generate the time format in timer
function pad(d) {
	return (d.toString().length < 2) ? '0' + d.toString() : d.toString();
}

												// Performance Matrix Project Load Function
function process_matrix_project(){
	$.ajax({
		type:'GET',
		url: '/process_matrix_project/',
		async : false,
		data  : {},
		success: function (json_data){
		var data = json_data
		$('#project_data').html('')
		$('#project_data').append($('<option>', {
	            value :'0',
	            text :''
			}));
		if(data.url_status == '1'){
			if(data.data.project_info!=undefined)
{
		var data_role = data.data.project_info.length
		if(data_role>0){  
			for(var i=0;i<data_role;i++){  
				project_id = data.data.project_info[0][0]
				$('#project_data').append($('<option>', {
	                   value : data.data.project_info[i][0],
	                   text : data.data.project_info[i][1],
	             }));
				}
			process_matrix_task(project_id)
		}
			else{
				$('#project_data').append($('<option>', {
		            value :'0',
		            text :'Project Not Found'
				}));
				$('#perfor_matrix_count').html('00') 
            	$('#perfor_matrix_count1').html('00') 
                $('#ontimedelivery').html("<p class='no_data_found'>No Data Found.</p>")
                $('#schedulevariance').html("<p class='no_data_found'>No Data Found.</p>")
                $('#effortvariance').html("<p class='no_data_found'>No Data Found.</p>")
			}
		}else{ 
			$('#project_data').append($('<option>', {
	            value :'0',
	            text :'Project Not Found'
			}));
			$('#perfor_matrix_count').html('00') 
        	$('#perfor_matrix_count1').html('00') 
            $('#ontimedelivery').html("<p class='no_data_found'>No Data Found.</p>")
            $('#schedulevariance').html("<p class='no_data_found'>No Data Found.</p>")
            $('#effortvariance').html("<p class='no_data_found'>No Data Found.</p>")}
}
		}
	})
}

														// Attendance User Details
function initial_attendance_chart(){
	$.ajax({
		type:'GET',
		url: '/process_matrix_attendance/',
		async : false,
		data  : {},
		success: function (json_data){
			var datas = json_data
			data = datas
		data_list=[]	
		var violation_count = 0;
		var ontime_count = 0;
		if(datas.url_status !="Unable to create database connection"){
		if (data.status==1){
			if (data.hasOwnProperty('attendance_data')){
				$.each(data['attendance_data'],function(i,field){
					inner_dict={}
					inner_dict.date = field['date']
					if (field['check_in'] !=null){
						var check_in = field['check_in'].split('.')
						inner_dict.value = parseInt(check_in[0])*60 + parseInt(check_in[1])
					}else{
						inner_dict.value = field['check_in']
					}
					if (parseFloat(field['check_in']) > 8.00){
						violation_count += 1
						inner_dict.customBullet = "https://www.amcharts.com/lib/3/images/redstar.png"
							inner_dict.customDescription = violation_count
					}
					else{
						ontime_count+=1
					}
					$('#ontime_count').html(ontime_count+' days <img\
					src="/static/development/Dashboards/images/up-arrow-3.png" />')
					if (field['check_out'] != null){
						var check_out = field['check_out'].split('.')
						inner_dict.value2 = parseInt(check_out[0])*60 + parseInt(check_out[1])
					}else{
						inner_dict.value2 = field['check_out']
					}
					data_list.push(inner_dict);
				});
				attendance_chart(data_list,'attendance_trend');
			}
		}
		else{
			$('#proc_matrix_count').html('00')
			$('#proc_matrix_count1').html('00')
			$('#attendance_trend').html('<p>'+data['message']+'</p>')
		}
		}
		$('#proc_matrix_count').html('00')
		$('#proc_matrix_count1').html('00')
		$('#attendance_trend').html("<p class='no_data_found'>No Data Found.</p>")
		if(violation_count>0){ 
			if(violation_count>=10){ $('#proc_matrix_count').html(violation_count),$('#proc_matrix_count1').html(violation_count) }
			else { $('#proc_matrix_count').html("0"+violation_count),$('#proc_matrix_count1').html("0"+violation_count) }}
		else{ $('#proc_matrix_count').html('00'),$('#proc_matrix_count1').html('00') }
}
	})
}

$('#project_data').change(function(){
	var project_data=$('#project_data  option:selected').val()
	process_matrix_task(project_data)
})
						//Loading the task details of the employee for generate the chart in performance metrics based on poject drop down selection
function process_matrix_task(id){
	var process_matrix_task = []
	if(id !='' && id !=undefined){
	$('#project_data  option:selected').val(id)
	process_matrix_task.push({"project_id":id})}
	else{
		process_matrix_task.push({"project_id":project_id})
		$('#project_data  option:selected').val(project_id)}
    $.ajax({
        url : '/process_matrix_task/',
        type : 'POST',
        timeout : 10000,
        data  : {"process_matrix_task":JSON.stringify(process_matrix_task),csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()},
        async:true,
        success: function(json_data) {
            var task_data = json_data
            if(task_data.url_status!="Service Unavailable"){
            if (task_data.url_status == 1){
            	
                var task_info = task_data.data['task_info']
                if(task_info!=undefined){
                var task_info_length = task_info.length
                var effect_variance_task_array = []
                var schedule_variance_task_array = []
                for(var i=0;i<task_info_length;i++){
                    var effort_variance = (((task_info[i]['actual_hours']-task_info[i]['planned_hours'])/task_info[i]['planned_hours'])*100).toFixed(2)
                    var obj = {
                        ["task_name"]: task_info[i]['task_description'],
                        ["variance"]: (effort_variance<0 ? -1*effort_variance : 0)
                    }
                    effect_variance_task_array.push(obj)
                    var planned_calendar_days = task_info[i]['planned_days']
                    var actual_calendar_days = task_info[i]['actual_days']
                    var start_variance = task_info[i]['start_variance']
                    var schedule_variance = (((actual_calendar_days - planned_calendar_days+start_variance)/planned_calendar_days)*100).toFixed(2)
                    var variance_obj = {
                        ["variance"] : (schedule_variance > 0 ? schedule_variance : 0),
                        ["task_name"] : task_info[i]['task_description'],
                    }
                    schedule_variance_task_array.push(variance_obj)
                }
                }
                else
            {
                	$('#schedulevariance').html("<p class='no_data_found'>No Data Found.</p>")	
            }
                var overdue_array = []
                var overdue_info = task_data.data['overdue_info']
                if (overdue_info!=1 || overdue_info!=undefined){
                    var overdue_length = overdue_info.length;
                    var overdue_array = []
                    for(var i=0;i<overdue_length;i++){
                        var total_task = parseFloat(overdue_info[i]['total_task'])
                        var over_due_count = overdue_info[i]['over_due_count']
                        var on_time_count = total_task - over_due_count
                        var obj = {
                            ["week_day"]: overdue_info[i]['month_day'],
                            ["on_time_count"]: ((on_time_count/total_task)*100).toFixed(2),
                            ["over_due_count"]: -((over_due_count/total_task)*100).toFixed(2)
                        }
                        overdue_array.push(obj)
                    }
                    ontime_delivery(overdue_array)
                    if(overdue_length>0){ 
            			if(overdue_length>=10){ $('#perfor_matrix_count').html(overdue_length),$('#perfor_matrix_count1').html(overdue_length)  }
            			else { $('#perfor_matrix_count').html("0"+overdue_length),$('#perfor_matrix_count1').html("0"+overdue_length) }}
            		else{ $('#perfor_matrix_count').html('00'),$('#perfor_matrix_count1').html('00') }
                }
                else{
                    $('#ontimedelivery').html("<p class='no_data_found'>No Data Found.</p>")
                }
                effort_variance_chart(effect_variance_task_array)
                scheduled_variance_chart(schedule_variance_task_array)
            }
            else{
            	$('#perfor_matrix_count').html('00') 
            	$('#perfor_matrix_count1').html('00') 
                $('#ontimedelivery').html("<p class='no_data_found'>No Data Found.</p>")
                $('#schedulevariance').html("<p class='no_data_found'>No Data Found.</p>")
                $('#effortvariance').html("<p class='no_data_found'>No Data Found.</p>")
            }
            }else{
            	$('#perfor_matrix_count').html('00') 
            	$('#perfor_matrix_count1').html('00')
            	 $('#ontimedelivery').html("<p class='no_data_found'>Data cannot be fetched.</p>")
                $('#schedulevariance').html("<p class='no_data_found'>Data cannot be fetched.</p>")
                $('#effortvariance').html("<p class='no_data_found'>Data cannot be fetched.</p>")
            }
        }
});
}

function zoomChart(chart){
	chart.zoomToIndexes(chart.dataProvider.length-7, chart.dataProvider.length);
	// get chart and value axis
	var chart1 = event.chart;
	var axis = chart.valueAxes[0];

	// create max guide
	var guide = new AmCharts.Guide();
	guide.value  = 1020;
	guide.lineAlpha = 0.3;
	guide.lineThickness = 2;
	guide.lineColor = guide.color = "#00cc00";
//	axis.addGuide( guide );

	var guide = new AmCharts.Guide();
	guide.value = 480;
	guide.lineAlpha = 0.3;
	guide.lineThickness = 2;
	guide.lineColor = guide.color = "#00cc00";
//	axis.addGuide( guide );
	}

function attendance_chart(data_list,divid){
	chart = AmCharts.makeChart(divid, {
		"type": "serial",
		"theme": "none",
		"pathToImages": "http://www.amcharts.com/lib/3/images/",
		"dataDateFormat": "YYYY-MM-DD",
		"valueAxes": [{
			"id": "durationAxis",
			"duration": "ss",
//			"durationUnits": {
//			"hh": "h ",
//			"mm": "min"
//			},
			"axisAlpha": 0,
			"gridAlpha": 0,
			"title": "value"
		}],
		"graphs": [{
			"id": "g1",
			"bullet": "round",
			"bulletBorderAlpha": 1,
			"bulletColor": "#FFFFFF",
			"bulletSize": 5,
			"hideBulletsCount": 50,
			"labelText": "[[customDescription]]",
			"lineThickness": 2,
			"title": "red line",
			"useLineColorForBulletBorder": true,
			"valueField": "value",
			"balloonFunction": function(graphDataItem, graph) {
				var value = graphDataItem.values.value;
				if (value){
					var convert_float_time = (value/60).toFixed(2).toString().split('.')
					return "Sign in Time:"+(convert_float_time[0]+':'+pad(Math.round(parseFloat(convert_float_time[1])/100*60)))
				}
			}
		},
		{
			"id": "g2",
			"bullet": "round",
			"bulletBorderAlpha": 1,
			"bulletColor": "#FFFFFF",
			"bulletSize": 5,
			"hideBulletsCount": 50,
			"lineThickness": 2,
			"title": "green line",
			"useLineColorForBulletBorder": true,
			"valueField": "value2",
			"balloonFunction": function(graphDataItem, graph) {
				var value = graphDataItem.values.value;
				if (value){
					var convert_float_time = (value/60).toFixed(2).toString().split('.')
					return "Sign Out Time:"+(convert_float_time[0]+':'+pad(Math.round(parseFloat(convert_float_time[1])/100*60)))
				}
			}
		}],
		"chartScrollbar": {
			"graph": "g1",
			"scrollbarHeight": 30
		},
		"chartCursor": {
			"cursorPosition": "mouse",
			"pan": true,
//			"valueLineEnabled":true,
//			"valueLineBalloonEnabled":true
		},
		"categoryField": "date",
		"categoryAxis": {
			"parseDates": true,
			"dashLength": 1,
		},
		"dataProvider": data_list
	});
//	chart.addListener("rendered", zoomChart(chart));
	//zoomChart(chart);
}


function effort_variance_chart(chart_data){
	var chart = AmCharts.makeChart("effortvariance", {
		"theme": "light",
		"type": "serial",
		"marginRight": 10,
		"autoMarginOffset": 20,
		"dataProvider": chart_data,
		"valueAxes": [{
			"id": "v1",
			"axisAlpha": 0.1
		}],
		"graphs": [{
			"useNegativeColorIfDown": true,
			"balloonText": "[[category]]<br><b>Variance: [[value]] %</b>",
			"bullet": "round",
			"bulletBorderAlpha": 1,
			"bulletBorderColor": "#FFFFFF",
			"hideBulletsCount": 50,
			"lineThickness": 3,
			"lineColor": "#46be8a",
			"negativeLineColor": "#ef5350",
			"valueField": "variance"
		}],
		"chartScrollbar": {
			"scrollbarHeight": 5,
			"backgroundAlpha": 0.1,
			"backgroundColor": "#2de7c8",
			"selectedBackgroundColor": "#f88c8c",
			"selectedBackgroundAlpha": 1
		},
//		"chartCursor": {
//		"valueLineEnabled": true,
//		"valueLineBalloonEnabled": true
//		},
		"categoryField": "task_name",
		"categoryAxis": {
			"gridPosition": "start",
			"position": "left",
			"labelColorField": "#FF0000",
			 "labelsEnabled": false,
			"labelFunction": function(label, item, axis) {
				var chart = axis.chart;
				if ( (chart.realWidth <= 300 ) && ( label.length > 5 ) )
					return label.substr(0, 5) + '...';
				if ( (chart.realWidth <= 500 ) && ( label.length > 10 ) )
					return label.substr(0, 5) + '...';
				return label;
			}
		},
		"valueAxes": [{
			
			"labelFunction": function(value) {
				return value + '%';
			}
		}],
		"export": {
			"enabled": false
		}
	});
}

function ontime_delivery(chart_data){
	var chart = AmCharts.makeChart("ontimedelivery", {
		"type": "serial",
		"fontFamily": "'Poppins', sans-serif",
		"theme": "light",
		"rotate": true,
		"marginBottom": 40,
		"dataProvider":chart_data,
		"startDuration": 1,
		"graphs": [{
			"fillAlphas": 1,
			"lineAlpha": 0.2,
			"type": "column",
			"valueField": "over_due_count",
			"title": "OverDue Percentage",
			"labelText": "[[value]]",
			"lineColor": "#2be6c7",
			"clustered": false,
			"unit": "%",
			"labelFunction": function(item) {
				return Math.abs(item.values.value);
			},
			"balloonFunction": function(item) {
				return "OverDue Delivery : " + Math.abs(item.values.value) + "%";
			}
		}, {
			"fillAlphas": 0.8,
			"lineAlpha": 0.2,
			"type": "column",
			"valueField": "on_time_count",
			"title": "OnTime Percentage",
			"labelText": "[[value]]",      
			"lineColor": "#76c8fe",
			"clustered": false,
			"labelFunction": function(item) {
				return Math.abs(item.values.value);
			},
			"balloonFunction": function(item) {
				return "Ontime Delivery : " + Math.abs(item.values.value) + "%";
			}
		}],
		"categoryField": "week_day",
		"categoryAxis": {
			"gridPosition": "start",
			"gridAlpha": 0.2,
			"axisAlpha": 0,

		},
		"valueAxes": [{
			"gridAlpha": 0,
			"ignoreAxisWidth": true,
			"position": "left",
			"labelFunction": function(value) {
				return Math.abs(value) + '%';
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
			"text": "",
			"x": "28%",
			"y": "97%",
			"bold": true,
			"align": "middle"
		}, {
			"text": "",
			"x": "75%",
			"y": "97%",
			"bold": true,
			"align": "middle"
		}],
		"export": {
			"enabled": false
		}

	});

}
 
function scheduled_variance_chart(chart_data){
	var chart = AmCharts.makeChart("schedulevariance", {
		"type": "serial",
		"theme": "light",
		"dataProvider": chart_data,
		"startDuration": 0.5,
		"graphs": [{
			"balloonText": "[[category]]: [[value]]%",
			"bullet": "round",
			"title": "Planned",
			"valueField": "variance",
			"fillAlphas": 0
		}],
		"chartCursor": {
			"cursorAlpha": 0,
			"zoomable": false
		},
		"chartScrollbar": {
			"scrollbarHeight": 5,
			"backgroundAlpha": 0.1,
			"backgroundColor": "#f88c8c",
			"selectedBackgroundColor": "#f88c8c",
			"selectedBackgroundAlpha": 1
		},
		"categoryField": "task_name",
		"categoryAxis": {
			"gridPosition": "start",
			"labelRotation": 0,
			"axisAlpha": 0,
			"fillAlpha": 0.05,
			"fillColor": "#000000",
			"gridAlpha": 0,
			"position": "bottom",
			"labelFunction": function(label, item, axis) {
				var chart = axis.chart;
				if ( (chart.realWidth <= 300 ) && ( label.length > 5 ) )
					return label.substr(0, 5) + '...';
				if ( (chart.realWidth <= 500 ) && ( label.length > 10 ) )
					return label.substr(0, 5) + '...';
				return label;
			}
		},
		"valueAxes": [{
			"labelFunction": function(value) {
				return Math.abs(value) + '%';
			}
		}],
		"export": {
			"enabled": false,
			"position": "bottom-right"
		}
	});
}

														// CMS  - News Data 
function news_data_api(){
	$.ajax({
		type:'GET',
		url: '/news_data_api/',
		async : false,
		data  : {},
		success: function (json_data){
			var data_value = JSON.parse(json_data)
			var str_value =''
			var in_house =''
			if(data_value){
				if(data_value['status']=='200'){
			var data = data_value.newsnow
				in_house_data = data_value.in_house
				if(data.length>0){
				for(var i=0;i<data.length;i++ ){
					str_value +='<li>'+data[i].content_value.substring(0,35)+'</li>'
//					http://tst-newsnow.nexttechnosolutions.com:8000/subpage/88/
					str_value +='<a target="_blank" href="http://192.168.10.66:8000/subpage/'+data[i].id+'/" class="readmore'+data[i].id+' readMoreClass">Read more</a>'	
					}
				$("#IT_News").append(str_value);
				}else { $("#IT_News").append("<p class='no_data_found'>No Data Found.</p>");}
				if(in_house_data.length>0){
				for(var j=0;j<in_house_data.length;j++ ){
					in_house +='<li>'+in_house_data[j].content_value.substring(0,35)+'</li>'
					in_house +='<a target="_blank" href="http://192.168.10.66:8000/subpage/'+in_house_data[j].id+'/" class="readmore'+in_house_data[j].id+' readMoreClass">Read more</a>'	
					}
				$("#In-House").append(in_house);
				}else { $("#In-House").append("<p class='no_data_found'>No Data Found.</p>");}
				}
				else{ $("#IT_News").append("<p class='no_data_found'>Data cannot be fetched.</p>")
					  $("#In-House").append("<p class='no_data_found'>Data cannot be fetched.</p>")}
			}
		}
})
}

														// User Task List Details
function user_task_list(task,tsk_cate){
	count = 0
	task_data = ''
	var str_data_high =''
	if(tsk_cate=='high_priority') { task_data = task.high_priority }
	else if(tsk_cate=='medium_priority') { task_data = task.medium_priority }
	else if(tsk_cate=='low_priority') { task_data = task.low_priority }
	else if(tsk_cate=='least_priority') { task_data = task.least_priority }
//	var str_data_high =''
		if(task_data.length>0){
		if(task_data.length>0){ 
			count = count + task_data.length
			if(task_data.length>=10){ $('#task_count').html(count),$('#task_count1').html(count) }
			else { $('#task_count').html("0"+count),$('#task_count1').html("0"+count) }}
		else{ $('#task_count').html('00'),$('#task_count1').html('00') }
		var class_icon =''
		for(var b=0;b<task_data.length;b++){
			if(task_data[b].active_task==null){class_icon = 'nf-start'}
			else {class_icon = 'nf-pause'}
			if(class_icon=='nf-pause'){
				$('#timer_count_id').html(task_data[b].time_difference);
				 var ele = document.getElementById('html_timer');
				   ele.setAttribute('data-value', task_data[b].id);
				   var element = document.getElementById('icon_data_id');
				    element.className = " " +class_icon;
			}
			if(b=='0'){
				var c =b+1
				str_data_high += '<div class="list_item  list_item_first" id="'+task_data[b].id+'">\
					<span class="sno first">'+c+'</span>\
        			<span class="taskname js_taskname'+task_data[b].id+'">'+task_data[b].task_description+' </span>\
        			<span class="timercount" id="timer_count'+task_data[b].id+'">'+task_data[b].time_difference+'</span>\
        			<div class="buttonshowd buttonshow'+task_data[b].id+'">\
        			<a onclick="timer_icon_click(this);" class="timericon task_play_pause"  data-value="'+task_data[b].id+'" id="js_timer"> <i id="icon_data'+task_data[b].id+'"  " class="nf '+class_icon+' "></i> </a>\
        			<a onclick="btn_showdiv('+task_data[b].id+');" id="'+task_data[b].id+'" class="fa fa-pencil">  </a>\
        			</div>\
        			</div>'
			}else{
				var c =b+1
				str_data_high += '<div class="list_item  list_item_first" id="'+task_data[b].id+'">\
					<span class="sno">'+c+'</span>\
					<span class="taskname js_taskname'+task_data[b].id+'">'+task_data[b].task_description+' </span>\
					<span class="timercount" id="timer_count'+task_data[b].id+'">'+task_data[b].time_difference+'</span>\
        			<div class="buttonshowd buttonshow'+task_data[b].id+'">\
        			<a onclick="timer_icon_click(this);" class="timericon task_play_pause"  data-value="'+task_data[b].id+'" id="js_timer"> <i id="icon_data'+task_data[b].id+'"  " class="nf '+class_icon+'"></i> </a>\
        			<a onclick="btn_showdiv('+task_data[b].id+');" id="'+task_data[b].id+'" class="fa fa-pencil">  </a>\
        			</div>\
        			</div>'
			}
		}
		$("#"+tsk_cate).append(str_data_high);
}
		else { $("#"+tsk_cate).append("<p class='no_data_found'>No Data Found.</p>") }
		$('.task_play_pause').hide();
}
function error_msg(error_data,error_count){
	var check= ["high_priority","medium_priority", "low_priority","least_priority"]
	var res = check.filter( function(n) { return !this.has(n) }, new Set(error_data) )
	for(var s=0;s<res.length;s++){
		$("#"+res[s]).html('')
		$("#"+res[s]).append("<p class='no_data_found'> No Data Found</p>")
	}
}
function user_task_details(){
	var task =[]
	$("#highest_value").empty();
	$("#medium_value").empty();
	$("#low_priority").empty();
	$("#least_priority").empty();
	$.ajax({
		type:'GET',
		url: '/user_task_details/',
		async : false,
		data  : {},
		success: function (json_data){
		var data = json_data
		if(data.url_status=='1'){
		if(data.data.status=="NTE-01"){
			task =[]
			task.push(data.data.task_info)
			if(task.length>0){
				var test = Object.keys(task[0])
			for(var a=0;a<test.length;a++){
				error_msg(test,test.length)
				if(test[a] =='high_priority'){
					$("#high_priority").html('');
					user_task_list(task[0],"high_priority")
				} 
				if(test[a] =='medium_priority'){
					$("#medium_priority").html('');
					user_task_list(task[0],"medium_priority")
				} 
				if(test[a] =='low_priority'){
					$("#low_priority").html('');
					user_task_list(task[a],"low_priority")
				}
				if(test[a] =='least_priority'){
					$("#least_priority").html('');
					user_task_list(task[a],"least_priority")
				}
			}
		}else{ $('#task_count').html('00'),$('#task_count1').html('00')  }
		}
		}else if (data.url_status=='0'){
			$('#task_count').html('00') 
			$('#task_count1').html('00')
			$("#high_priority").append("<p class='no_data_found'>Task Not Listed</p>")
			$("#medium_priority").append("<p class='no_data_found'> Task Not Listed</p>")
			$("#low_priority").append("<p class='no_data_found'> Task Not Listed</p>")
			$("#least_priority").append("<p class='no_data_found'> Task Not Listed</p>")
			
		}else {
			$('#task_count').html('00') 
			$('#task_count1').html('00')
			$("#high_priority").append("<p class='no_data_found'>Service Unavailable</p>")
			$("#medium_priority").append("<p class='no_data_found'>Service Unavailable</p>")
			$("#low_priority").append("<p class='no_data_found'>Service Unavailable</p>")
			$("#least_priority").append("<p class='no_data_found'>Service Unavailable</p>")
		}
		}
	});
}
												// User Task Timer Details													
var  i;
var hour ;
var minute ;
var seconds;
var totalSeconds;
var total
var intervalId = null;

function startTimer() {
	++totalSeconds;
    hour = Math.floor(totalSeconds /3600);
    minute = Math.floor((totalSeconds - hour*3600)/60);
    seconds = totalSeconds - (hour*3600 + minute*60);
    if(seconds<'10'){seconds='0'+seconds}
    if(minute<'10'){minute='0'+minute}
    if(timer_click_data=='first'){
    	if($(timer_click_data).attr("data-value")==undefined && divid==undefined){
    	$('#timer_count_id').html(hour+":"+minute+":"+seconds);
    	 $('#timer_count'+ $('#html_timer').attr("data-value")).html(hour+":"+minute+":"+seconds);
    }
    	else if( $('#html_timer').attr("data-value")==divid && divid !=undefined){
    		if(document.getElementById('icon_data_id').className==" nf nf-pause"){
    			$('#timer_count_id').html(hour+":"+minute+":"+seconds);
    	       	 $('#timer_count'+ $('#html_timer').attr("data-value")).html(hour+":"+minute+":"+seconds);
    		}
    		$('#timer_count_id').html(document.getElementById("timer_count_id").innerText);
       	 $('#timer_count'+ $('#html_timer').attr("data-value")).html(document.getElementById("timer_count_id").innerText);
    	}
    	else{
    		$('#timer_count_id').html(document.getElementById('timer_count'+divid).innerHTML);
    		var first_class = document.getElementById('icon_data_id');
    		first_class.className = " " + document.getElementById('icon_data'+divid).className;
    	}
    }else{
    	 if($(timer_click_data).attr("data-value") == divid){
    		 if(document.getElementById('icon_data_id').className==" nf nf-pause" || document.getElementById('icon_data_id').className==" nf-pause"){
    	    	$('#timer_count_id').html(hour+":"+minute+":"+seconds);
    			 $('#timer_count'+divid).html(hour+":"+minute+":"+seconds);
    		 }else{
    		 $('#timer_count_id').html(document.getElementById("timer_count"+divid).innerText);
    		 $('#timer_count'+divid).html(document.getElementById("timer_count"+divid).innerText);}
    	    }
    	 else{
    	  $('#timer_count'+$(timer_click_data).attr("data-value")).html(hour+":"+minute+":"+seconds);}}
  }

var task_id_list = []
var task_time =''
var timer_click_data =''
function timer_icon_click(data) {
	$('#error_summary').html('')
	timer_click_data =''
	timer_click_data = data
	var task_id =''
		if(data!=undefined){
	if(data.id=='html_timer'){
		task_id = $(timer_click_data).attr("data-value")
		var element = document.getElementById('icon_data'+task_id);
		var class_data = document.getElementById($(timer_click_data).children("i")['0'].id).className
	    element.className = " " +class_data
	    i = document.getElementById('timer_count_id').innerText;
	}
	if(data.id=='js_timer'){
		var element = document.getElementById('icon_data_id');
		var class_data = document.getElementById($(timer_click_data).children("i")['0'].id).className
	    element.className = " " +class_data
	    task_id = $(timer_click_data).attr("data-value")
	    i = document.getElementById('timer_count'+$(timer_click_data).attr("data-value")).innerHTML;
	}
		}
	var url =''
	var status_data=''
	var status_time = ''
	var timer_data=[]
	var task_work_summary = []
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();

	if(dd<10) {dd = '0'+dd} 
	if(mm<10) {mm = '0'+mm} 
	today = mm + '/' + dd + '/' + yyyy;
	 if(data=='first'){
		 var first_data = document.getElementById('icon_data_id').className 
		 if(first_data == " nf-pause"){
		    i = document.getElementById('timer_count_id').innerHTML;
			hour = i.split(":")[0];
			minute = i.split(":")[1];
			seconds = i.split(":")[2];
			totalSeconds = (parseInt(hour)*3600) + parseInt(parseInt(minute)*60) + parseInt(seconds);
			intervalId = setInterval(startTimer, 1000);
			task_id_list.push({"task_id":$('#html_timer').attr("data-value"),"status":"update"})
	 }
	 }
	 else{ if (intervalId) { clearInterval(intervalId); }
	if($(timer_click_data).children("i").hasClass("nf-pause")){
//		$(timer_click_data).children("i").removeClass('nf-pause')
		$(timer_click_data).children("i").addClass('nf-start')
		var element = document.getElementById($(timer_click_data).children("i")['0'].id);
	    element.className = " nf-start"
	    
		if (intervalId) { clearInterval(intervalId); }
		status_data = "update"
		status_time = today+" "+hour+":"+minute+":"+seconds
		var data_lists =[]
		timer_data.push({"task_id":task_id,"status":status_data,"update_data":data_lists})
		task_time = hour+":"+minute+":"+seconds
	}
	else if($(timer_click_data).children("i").hasClass("nf-start")){
//		$(timer_click_data).children("i").removeClass('nf-start')
		$(timer_click_data).children("i").addClass('nf-pause')
		hour = i.split(":")[0];
		minute = i.split(":")[1];
		seconds = i.split(":")[2];
		totalSeconds = (parseInt(hour)*3600) + parseInt(parseInt(minute)*60) + parseInt(seconds);
		if (intervalId) { clearInterval(intervalId); }
		intervalId = setInterval(startTimer, 1000);
		status_data = "insert"
		status_time = today+" "+hour+":"+minute+":"+seconds
		task_time = hour+":"+minute+":"+seconds
		task_id_list.push({"task_id":task_id,"status":"update"})
		var obj = {};
		for ( var i=0, len=task_id_list.length; i < len; i++ )
		    obj[task_id_list[i]['task_id']] = task_id_list[i];

			task_id_list = new Array();
			for ( var key in obj )
				task_id_list.push(obj[key]);
		timer_data.push({"task_id":task_id,"task_time":status_time,"status":status_data,"update_data":task_id_list})
	}
	 }
	if(data=='summary'){
		timer_data=[]
		time_datetime=$('#task_timer').val();
		time_datetime=moment(time_datetime, 'DD-MM-YYYY HH:mm:ss');
		work_summary_date=moment(time_datetime).format("YYYY-MM-DD");
		var timer_update = []
		var summary_content = $('#summary_content').val()
		if(summary_content!=''){
		task_id =divid
		task_time =$('#timer_count_id').text()
		timer_update.push({'status':"update",'task_id':task_id})
		timer_data.push({'work_summary_content':summary_content,'task_time': task_time,'work_summary_date':work_summary_date,'task_id': task_id,'timer_update':timer_update})
		url ='/task_summary_insert/'
		}
		else{  alert_lobibox("error","Enter Work Summary");}
	}
	else{ url ='/timer_data_update/'; }
	task_timer_update(url,timer_data)
//	$.ajax({
//		type:'POST',
//		url: url,
//		async : false,
//		data  :{"timer_data":JSON.stringify(timer_data),csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()},
//		success: function (json_data){
//		var data = json_data
//		if(data.status.status=='NTE-01'){
//			if(url=='/task_summary_insert/'){
//				alert_lobibox("success","Work Summary Added")
//				$('#summary_content').val('')
//			}
//		user_task_details();
//		work_summary_list(task_id)
//		}
//		else if(data.status.status=='NTE-02'){
//			if(data.status.message=="You've Entered the Work Summary before a while Please try it out after Two Minutes "){
//			  $('#error_summary').html("You've Entered the Work Summary before a while Please try it out after Two Minutes")
//			}
//			}
//}
//    })
}

function task_timer_update(url,timer_data){	
	$.ajax({
		type:'POST',
		url: url,
		async : false,
		data  :{"timer_data":JSON.stringify(timer_data),csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()},
		success: function (json_data){
		var data = json_data
		if(data.status.status=='NTE-01'){
			if(url=='/task_summary_insert/'){
				alert_lobibox("success","Work Summary Added")
				$('#summary_content').val('');
				$('#task_timer').val('');
				global_timer=$('#timer_count_id').text()
			}
		user_task_details();
		work_summary_list(divid)
		}
		else if(data.status.status=='NTE-02'){
			if(data.status.message=="You've Entered the Work Summary before a while Please try it out after Two Minutes "){
			  $('#error_summary').html("You've Entered the Work Summary before a while Please try it out after Two Minutes")
			}
			}
}
    })
}

											// Task Summary Function
function btn_showdiv(id) {
	global_timer=''
	$('#task_timer').val('');
	$('#error_summary').html('')
	$('#summary_content').val('')
	divid =''
    $('#timer_count_id').html('');
	$('#task_name').html('')
    $('#showdiv').slideDown('slow');
    $('#showdiv1').hide();
    divid = id;
    $('#timer_count_id').html(document.getElementById("timer_count"+id).innerText);
	global_timer=document.getElementById("timer_count"+id).innerText
    var data_status = document.getElementById('icon_data'+id).className
    var element = document.getElementById('icon_data_id');
    element.className = " " +data_status;
    var ele = document.getElementById('html_timer');
    ele.setAttribute('data-value', id);
    
    $('#task_name').html(document.querySelector('.js_taskname'+id).innerHTML)
    work_summary_list(id)
	$('#icon_data_id').hide()
}
function work_summary_list(task_id){
	if(task_id){
	 $.ajax({
			type:'POST',
			url: '/user_task_summary_details/',
			async : false,
			data  : {'task_id':task_id,csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()},
			success: function (json_data){
			var data = json_data
			task_summary_list(data)
			if(data.url_status=='1'){
			if(data.data.progress_data) { gaugechart(data.data.progress_data.project_progress,data.data.progress_data.timebox_progress,data.data.progress_data.task_progress) }
			}
			else { gaugechart('0','0','0') }
			
	}
	    })
	}
}
function task_summary_list(data){
	var columns = [{"title":"No."},{"title":"Task Summary"},{"title":"Date"},{"title":"Duration"}]
	var str_data =''
		$("#task_summary_data").empty()
		str_data +=' <thead> <tr> <th>No.</th> <th>Task Summary</th> <th>Date</th> <th>Duration</th></tr> </thead> <tbody>'
			if(data.url_status=='1'){
			if(data.data.status=='NTE-01'){
				 var data_len=data.data.work_summary_info.length;
				 worksummary_len=''
				 worksummary_len = data_len
				 if(data_len>0) { 
					$('#project_name').html(data.data.work_summary_info[0].project_name)
					for(var i=0;i<data_len;i++)	{   
						var no = i+1
						str_data +=' <tr> <td>'+no+'</td> <td>'+data.data.work_summary_info[i].work_summary+'</td> \
							<td>'+data.data.work_summary_info[i].work_summary_date+'</td> <td>'+data.data.work_summary_info[i].task_duration+'</td> </tr> '
					} }
				 else { str_data += "<tr> <td></td><td> <p class='no_data_found'>No Data Found.</p> </td></tr><td></td>"}
			}
			}else if(data.url_status=='0'){
				 str_data += "<tr><td></td> <td> <p class='no_data_found'>No Data Found.</p> </td><td></td></tr>"
			 }
			 else { str_data += "<tr> <td></td><td> <p class='no_data_found'>No Data Found.</p> </td><td></td></tr>" }
		str_data +='</tbody>'
	$("#task_summary_data").append(str_data);
}
$("#work_summary").click(function(){
        timer_icon_click("summary")
//	 $('#error_summary').html('')
	var js_timer = document.getElementById("icon_data"+divid);
	 js_timer.className = " nf-start"
	var html_timer = document.getElementById("icon_data_id");
	 html_timer.className = " nf-start"
	 if (intervalId) { clearInterval(intervalId)
		 var sum_timer_data = []
		 var summary_lists =[]
	 	 sum_timer_data.push({"task_id":divid,"status":"update","update_data":summary_lists})
	 	 task_timer_update('/timer_data_update/',sum_timer_data)}
})
$("#close_summary").click(function(){
	$('#error_summary').html('')
//	user_task_details();
})

$("#completed_task").click(function(){
var comp_timer_data = []
	var js_timer = document.getElementById("icon_data"+divid);
	 js_timer.className = " nf-start"
	var html_timer = document.getElementById("icon_data_id");
	 html_timer.className = " nf-start"
	 if (intervalId) { clearInterval(intervalId)
		 var comp_lists =[]
	 	 comp_timer_data.push({"task_id":divid,"status":"update","update_data":comp_lists})
	 	 task_timer_update('/timer_data_update/',comp_timer_data)
	 	}
	if (worksummary_len >"0"){
		stage_complete('0','Task Stage Request')
		}
	else { alert_lobibox("error", "Add Work Summary"); }
})

function stage_complete(objective_id,objective_text){
	swal({
		title: "Are you sure you want to move this task to completed stage",
		text: "",
		type: "warning",
		showCancelButton: true,
		confirmButtonClass: "btn-success pull-left btn-eql-wid btn-animate",
		cancelButtonClass: "btn-danger pull-right btn-eql-wid btn-animate",
		confirmButtonText: "Proceed",
		cancelButtonText: "Cancel",
		closeOnConfirm: true,
		closeOnCancel: true
	},
	function(isConfirm) {
		if(isConfirm){
			task_stage_change(objective_id)
		}
	});
}

function task_stage_change(){
	t = document.getElementById("timer_count_id").innerText
	$.ajax({
			type:'POST',
			url: '/task_stage_update/',
			async : false,
			data  : {'task_id':divid,'time':t,csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()},
			success: function (json_data){
			var data = json_data
			if(data.ststus=='1'){
				if(data.result.status=="NTE-01"){ alert_lobibox("success", "Task Completed"),user_task_details() }
				else { alert_lobibox("error", "Task can't moved"); }
			}
	}
	    })
}

function buttonshow(){
	$('.buttonshowd').hide();
    $('.list_item_first').mouseover(function() {
        $('.buttonshow'+this.id).show();
    });
    $('.list_item_first').mouseout(function() {
        $('.buttonshow'+this.id).hide();
    })
}


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
	$("#gaugechart").css("height", "100px");


	}

	//**************************************      || BAV || My NEXT Dashboard DATA  || END ||   **************************************				

function today_schedule_chart(){
	$("#todayschedule").html("")
	var date = new Date();
	$.ajax({
		type:'GET',
		url: '/today_scheduled_meeting/',
		data:{'to_zone':Intl.DateTimeFormat().resolvedOptions().timeZone},
//		async:false,
		success: function (json_data){
			if(json_data.status=="NTE_01"){
				if(json_data.today_schedule.length!=0 || json_data.complete_schedule!=0 ){
					schedule_data=[{category:"Productive Worktime Plan",segments:[{ color:"#55bbff",end: "12.00",start: "09.00", task: "Deep Work Session" },{ color:"#2ce7c8",end: "13.00",start: "12.15", task: "Lunch Time" },{ color:"#f6d166",end: "17.00",start: "13.00", task: "Normal Work Time and Next Deep Work Plan" }]},{category: "Up-Coming Meeting",segments:json_data.today_schedule},{category: "Completed Meeting",segments:json_data.complete_schedule}]}
				else{
					schedule_data=[{category:"Productive Worktime Plan",segments:[{ color:"#55bbff",end: "12.00",start: "09.00", task: "Deep Work Session" },{ color:"#2ce7c8",end: "13.00",start: "12.15", task: "Lunch Time" },{ color:"#f6d166",end: "17.00",start: "13.00", task: "Normal Work Time and Next Deep Work Plan" }]},{category: "Up-Coming Meeting",segments:[]},{category: "Completed Meeting",segments:[]}]
				}
					var chart = AmCharts.makeChart("todayschedule", {
						type: "gantt",
						theme: "light",
						marginRight:10,
						"plotAreaFillAlphas": 1,
						"plotAreaFillColors": "#f8f7ff",
						dataDateFormat: "YYYY-MM-DD",
						columnWidth: 0.2,
						valueAxis: {
							position:'top',
							"gridThickness": 0,
							maximum: 20,
							gridCount: 20,
							autoGridCount: false,
							title: "",
							axisColor: "#fff",
							labelFunction: formatTime,
							fontSize:9
						},
						graph: {
							fillAlphas: 1,
							lineAlpha: 1,
							lineColor: "#fff"
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
						dataProvider: schedule_data,
						
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
//				else{ 
//					$("#todayschedule").html('<p class="no_data_found">No Data Found.</p>')
//				}
			
//			else{ 
//				$("#todayschedule").html('<p class="no_data_found">No Data Found.</p>')
//				
//			}
		}
	})
}

function survey_guidelines()
{
	$.ajax({
		type:'GET',
		url: '/survey_guideline_data/',
		async:false,
		success: function (json_data){
			var data=json_data
			$('#employee_guideline_div').empty()
			$('#survey_div').empty()
			if(data.guideline_data.length!=0)
				{
				if(data.guideline_data.status_code !="NTE-002" && data.guideline_data.status_code !="NTE-003"){
				if(data.guideline_data.guideline_details.length<=10){
				$("#guidelines_count").text('0'+data.guideline_data.guideline_details.length)
				$("#guidelines_count1").text('0'+data.guideline_data.guideline_details.length)}
				else
					{
					$("#guidelines_count").text(data.guideline_data.guideline_details.length)
					$("#guidelines_count1").text(data.guideline_data.guideline_details.length)
					}
				$('#employee_guideline_div').empty()
				if(data.guideline_data.guideline_details.length!=0)
					{
					guideline=''
						 for(var i=0;i<data.guideline_data.guideline_details.length;i++)
						 {  
							 guideline+='<li><img src="http://192.168.10.52:9001/static/mobile_new/'+data.guideline_data.guideline_details[i].reported_by_id+'.jpg" >'+data.guideline_data.guideline_details[i].points+' <span>'+data.guideline_data.guideline_details[i].reported_by+'</span></li>'
						 }
					$('#employee_guideline_div').html(guideline)

					}
				}else{ $("#guidelines_count").text('00');$("#guidelines_count1").text('00');
				$('#employee_guideline_div').html("<span class='blink_me nodata_text'>No Data Available </span>")}
				}
			else { $("#guidelines_count").text('00');
			$("#guidelines_count1").text('00');
			$('#employee_guideline_div').html("<span class='blink_me nodata_text'>No Data Available </span>")}
				$('#survey_div').empty()
				if(data.survey_data.length!=0)
				{
					survey=''
					for(var i=0;i<data.survey_data.length;i++)
					 {   
						if (data.survey_data[i].rating==1)
							{
							smiley_class='<div id="survey_id_'+data.survey_data[i].survey_id+'" class="survey_smiley_div"><a class="sicon" href="#"><i class="fa fa-smile-o smiley smiley_color" data_id="1"></i></a><a class="sicon" href="#"><i class="fa fa-meh-o smiley" data_id="2"></i></a><a class="sicon" href="#"><i class="fa fa-frown-o smiley" data_id="3"></i></a></div>'
							}
						else if(data.survey_data[i].rating==2)
							{
							smiley_class='<div id="survey_id_'+data.survey_data[i].survey_id+'" class="survey_smiley_div"><a class="sicon" href="#"><i class="fa fa-smile-o smiley" data_id="1"></i></a><a class="sicon" href="#"><i class="fa fa-meh-o smiley smiley_color" data_id="2"></i></a><a class="sicon" href="#"><i class="fa fa-frown-o smiley " data_id="3"></i></a></div>'
							}
						else if(data.survey_data[i].rating==3)
							{
							smiley_class='<div id="survey_id_'+data.survey_data[i].survey_id+'" class="survey_smiley_div"><a class="sicon" href="#"><i class="fa fa-smile-o smiley" data_id="1"></i></a><a class="sicon" href="#"><i class="fa fa-meh-o smiley" data_id="2"></i></a><a class="sicon" href="#"><i class="fa fa-frown-o smiley smiley_color" data_id="3"></i></a></div>'
							}
						else
					 {
							smiley_class='<div id="survey_id_'+data.survey_data[i].survey_id+'" class="survey_smiley_div"><a class="sicon" href="#"><i class="fa fa-smile-o smiley" data_id="1"></i></a><a class="sicon" href="#"><i class="fa fa-meh-o smiley" data_id="2"></i></a><a class="sicon" href="#"><i class="fa fa-frown-o smiley" data_id="3"></i></a></div>'

					 }
						if(data.survey_data[i].comments)
							{
							comments=data.survey_data[i].comments
							}
						else{
							comments=''
						}
						 survey+='<p>'+data.survey_data[i].survey_question+'</p><div class="servey_content">'+
                         '<div class="smily_icon">'+smiley_class+'</div>'+
                         '<div class="servey_txt">'+
                         '<div class="row"><div class="col-sm-10"><textarea class="form-control" id="survey_text_'+data.survey_data[i].survey_id+'" placeholder="Add your comments">'+comments+'</textarea></div>' +
                         '<div class="col-sm-2"><button class="btn btn-sm btn-success tooltips" data-toggle="tooltip" data-placement="top" title="" data-original-title="Submit" onclick="survey_add_update('+data.survey_data[i].survey_id+')"> <i class="fa fa-check"></i> </button></div></div>'+
                         '</div></div>'
					 }
					$('#survey_div').html(survey)
				}
				else
					{
					$('#survey_div').html("<span class='blink_me nodata_text'>No Data Available</span>")
					}
				$('.smiley').click(function() {
					survey_smiley_id=$(this).parent().parent().attr('id')
					  $('#'+survey_smiley_id).find('.smiley').removeClass( "smiley_color" )
					  $(this).addClass("smiley_color")
					});
				}
	});	
}


function survey_add_update(survey_id)
{
rating=$('#survey_id_'+survey_id).find('.smiley_color').attr('data_id')
comment=$('#survey_text_'+survey_id).val()
if(!comment){
	alert_lobibox("error", "Add Your Comments for Survey");
}
else
	{
	$.ajax({
		type:'GET',
		url: '/survey_add_update/',
		async:false,
		data  : {'survey_id':survey_id, 'rating':rating,'comment':comment},
		success: function (json_data){
			if(json_data.status ){
				alert_lobibox("success", sysparam_datas_list[json_data.status]);
				survey_guidelines();
			}
			
		}
	});}
}

function plan_count()
{   
	 var today = new Date();
	 var quarter = Math.floor((today.getMonth() + 3) / 3);
	 var qfirstDate
	 var qendDate
	 var quarter_date = Math.floor((today.getMonth() / 3));
	 qfirstDate = new Date(today.getFullYear(), quarter_date * 3, 1);
	 qendDate= new Date(qfirstDate.getFullYear(), qfirstDate.getMonth() + 3, 0);
	 startdate=date_conversion(qfirstDate)
	 enddate=date_conversion(qendDate)
	 $('#duration_month1,#duration_month').html('Quarter 0'+quarter)
	 if(startdate!='' && enddate !='' )
     {
	  $.ajax({
			type:'GET',
			url: '/total_count/',
			async:false,
			data  : { 'start_date':startdate,'end_date':enddate},
			success: function (json_data){
				var url_status=json_data.url_status
				var data=json_data.project_task
				if(url_status!='')
				{
					$('#current_quarter_count1,#current_quarter_count').html(0);
				}
				else
				{   
					$('#current_quarter_count1,#current_quarter_count').html(data.length) 
				}
			},
		})
  }
}

function my_query(){
	$.ajax({
		type:'GET',
		url: '/service_call_view/',
		async : false,
		success: function (json_data){
			var data = json_data
			query_table_view('stage_open',data.opn_tick_data);
			query_table_view('stage_answer',data.ans_tick_data);
			query_table_view('stage_resolved',data.resolve_tick_data);
			query_table_view('stage_verified',data.verify_tick_data);
			query_table_view('stage_closed',data.close_tick_data);
		}
	});
}

function query_table_view(tkt_name,tkt_data){
	var ticket_list =[]
	var ticket_data ='';
	var ticket_status_count_id='';
	if(tkt_name=='stage_open'){ ticket_data ='Opened Date';ticket_status_count_id='tick_opn_count';}
	if(tkt_name=='stage_answer'){ ticket_data ='Answered Date';ticket_status_count_id='tick_ans_count';}
	if(tkt_name=='stage_resolved'){ ticket_data ='Resolved Date';ticket_status_count_id='tick_res_count';}
	if(tkt_name=='stage_verified'){ ticket_data ='Verified Date';ticket_status_count_id='tick_verf_count';}
	if(tkt_name=='stage_closed'){ ticket_data ='Closed Date';ticket_status_count_id='tick_cls_count';}                                                                     
	var columns = [{"title":"form id","visible": false},{"title":"S.No"},{"title":"Query Subject"},{"title":"Age"},{"title":ticket_data },{"title":"Priority"}]
	var len = tkt_data.length
	$('#'+ticket_status_count_id).text(len)
	if (len>0){
		
		for(var a=0;a<len;a++){
			ticket_date=new Date(tkt_data[a].date)
			ticket_list.push([tkt_data[a].ticket_no,a+1,tkt_data[a].query,tkt_data[a].age,moment(ticket_date).format('DD MMM YYYY, h:mm A'),tkt_data[a].priority])
		}
		plaindatatable_btn(tkt_name, ticket_list,columns,[],'NEXT_TRANSFORM_HCMS_EMPLOYEE_QUERY_DETAILS_'+today,'EMPLOYEE QUERY DETAILS')
	}
	plaindatatable_btn(tkt_name, ticket_list,columns,[],'NEXT_TRANSFORM_HCMS_EMPLOYEE_QUERY_DETAILS_'+today,'EMPLOYEE QUERY DETAILS')
}

function query_count()
{  
	$.ajax({
		type:'GET',
		async:false,
		url: '/service_call_count/',
		success: function (json_data){
			var data=json_data.ticket_count
			if (data.length!=0){
			$('#my_query_count,#my_query_count1').html(data[0]['count'])}
			else{
				$('#my_query_count,#my_query_count1').html('00')}
			}
			
		})
}

