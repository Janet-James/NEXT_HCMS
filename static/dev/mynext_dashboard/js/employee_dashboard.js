var project_id =''
var divid;
var global_url_path = 'http://mygreen.green.com.pg/media/';
var image_path = global_url_path+'user_profile/' ;


$('document').ready(function(){
	today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();
	if(dd<10) {  dd = '0'+dd } 
	if(mm<10) { mm = '0'+mm 	} 
	today = dd + '-' + mm + '-' + yyyy;
	format_today = dd + '-' + mm + '-' + yyyy;
	general_rating()
	project_task()
	your_goals()
	festivels ()
	plans_tab()
	birthday_wish()
//	 $('[data-toggle="tooltip"]').tooltip()
})


$("div" ).mouseover(function(){ $('#diwali_wish').hide(); });
//                                project list details  --ESAKKIPREM

function birthday_wish()
{
	$.ajax({
		   type:'GET',
			url: '/birthday_wish/',
			async:false,
			success: function (json_data){
			var birthday=json_data.birthday_data
			$('#birthday_wish').html("")
			if(birthday.length>0)
			{
				for(var i=0;i<birthday.length;i++)
				{
					$('#birthday_wish').append('<div class="birthday-wrapper">'+
  '<bokeh></bokeh><bokeh></bokeh> <bokeh></bokeh> <bokeh></bokeh> <bokeh></bokeh><bokeh></bokeh><bokeh></bokeh><bokeh></bokeh>'+
 '<bokeh></bokeh><bokeh></bokeh><bokeh></bokeh> <bokeh></bokeh> <bokeh></bokeh><bokeh></bokeh> <bokeh></bokeh><bokeh></bokeh> <bokeh></bokeh> <bokeh></bokeh>'+
 '<bokeh></bokeh><bokeh></bokeh><bokeh></bokeh><bokeh></bokeh><bokeh></bokeh><bokeh></bokeh> <bokeh></bokeh> <bokeh></bokeh>'+
 '<bokeh></bokeh><bokeh></bokeh><bokeh></bokeh><bokeh></bokeh><bokeh></bokeh><bokeh></bokeh><bokeh></bokeh><bokeh></bokeh>'+
 '<bokeh></bokeh> <bokeh></bokeh> <bokeh></bokeh><bokeh></bokeh><bokeh></bokeh><bokeh></bokeh><bokeh></bokeh> <bokeh></bokeh>'+
 '<bokeh></bokeh><bokeh></bokeh><bokeh></bokeh>'+
 '<div class="mobile">Open in desktop</div>'+
 '<div class="pyro">'+
  '<div class="before"></div>'+
   '<div class="after"></div>'+
 '</div>'+
 '<h2>Happy Birthday  '+birthday[i].name+'</h2>'+
      '<div class="birthdayimg"><img src="'+image_path+birthday[i].image_id_id+'.jpg" ></div>'+
 '<div class="cakepanel">'+
     '<div class="candle">'+
    '<div id="flame" class="lit"></div>'+
 '</div>'+

 '<div class="cake"></div>'+
 '<div class="plate"></div> '+
     ' </div> </div>')
				}
			}
		},
	})	
}

function process(date)
{
	   var parts = date.split("-");
	   return new Date(parts[2], parts[1] - 1, parts[0]);
}
function date_conversion(date)
{   
	 var ds = date.toString()
	 var split_date = moment(new Date(ds.substr(0, 16)));
	 converted_date=split_date.format("YYYY-MM-DD");
	 return converted_date
}
function date_format_conversion(date)
{
	var ds = date.toString()
	 var split_date = moment(new Date(ds.substr(0, 16)));
	 converted_date=split_date.format("DD-MMM-YYYY");
	 return converted_date
}

function project_task()
{   
	 var today = new Date();
	 var quarter_date = Math.floor((today.getMonth() / 3));
	 var qfirstDate = new Date(today.getFullYear(), quarter_date * 3, 1);
	 var qendDate= new Date(qfirstDate.getFullYear(), qfirstDate.getMonth() + 3, 0);
	 var startdate=date_conversion(qfirstDate)
	 var enddate=date_conversion(qendDate)
	$.ajax({
		type:'GET',
		url: '/team_lead_dashboard_plans/',
		async:false,
		data  : { 'start_date':startdate,'end_date':enddate},
		success: function (json_data){
			var url_status=json_data.url_status
			var data=json_data.project_task
			if(url_status!='')
		    {
				$('#project_task').html("<span class='blink_me nodata_text'>Data cannot be fetched </span>")
				$('#total_project,#total_project1').html(0);
		    }
			else
			{  
			   if(data.length>0)
				{  
				   var html=''
				   for(var i=0;i<data.length;i++)
                   {   
					   span_content=''
					   div_content=''
					   div2_content='' 
					   end_date=''
					   if(data[i].task_end_date==null || data[i].task_end_date=='')
					   {
						   end_date='Date Not Mention'
					   }
					   else
					   {
						   end_date=data[i].task_end_date
					   }
					   if(data[i].task_stage=='Completed')
					   {
						   span_content='<span class="pro-status style2 pull-right ">'+data[i].task_stage+' <i data-toggle="tooltip" data-placement="bottom" data-original-title="OnTrack" class="fa fa-check-circle-o "></i></span>'
					   }
					   else
					   {
						   span_content='<span class="pro-status style1 pull-right ">'+data[i].task_stage+' <i data-toggle="tooltip" data-placement="bottom" data-original-title="Overdue" class="fa fa-exclamation-triangle "></i></span>'
					   }
					   if(i==0)
					   {
						   div_content='<div class="panel-title"><a class="accordion-toggle accordion-toggle-styled" data-toggle="collapse" data-parent="#project_task" href="#collapse_1_'+i+'"> '+data[i].task_description+' ('+data[i].task_progress+'%)'
						   div2_content='<div id="collapse_1_'+i+'" class="panel-collapse in"><div class="panel-body">'
					   }
					   else
					   {
						   div_content='<div class="panel-title"><a class="accordion-toggle accordion-toggle-styled collapsed" data-toggle="collapse" data-parent="#project_task" href="#collapse_1_'+i+'"> '+data[i].task_description+' ('+data[i].task_progress+'%)'
						   div2_content='<div id="collapse_1_'+i+'" class="panel-collapse collapse"><div class="panel-body">'
					   }
                       html+='<div class="panel panel-default"><div class="panel-heading"><span class="sno">'+parseInt(i+1)+'</span>'+
                       div_content+
                       span_content+    
                       '<div class="progress"><div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width:'+data[i].task_progress+'%;"></div></div> '+
                       '</a></div></div>'
                       html+=div2_content+
                       '<div class="row project_status"><div class="col-sm-4 calendar"><span> <i class="fa fa-calendar tooltips" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Task End Date"></i>'+end_date+'</span></div>'
                       html+='</div></div></div></div>'
                   }
                   $('#project_task').append(html)
                   var count=data.length.toString().length
	   			   if(count==1)
	   			   {
	   					total_count='0'+data.length
	   			   }
	   			   else { total_count=data.length }
                   $('#total_project,#total_project1').html(total_count)
                   
				}
			   else { $('#total_project,#total_project1').html(0);  $('#project_task').html("<span class='blink_me nodata_text'>No Data Available </span>") }
			}
		},
	})
}

function general_rating(){
	$.ajax({
		type:'GET',
		url: '/team_lead_dashboard/',
		async:false,
		success: function (json_data){
			var url_status=json_data.url_status
			if(url_status!='')
		    {   
				$('#rateYo,#performance_standings').html("<span class='blink_me nodata_text'>Data cannot be fetched </span>")
		    }
			else
			{   
				var rating=json_data.overall_rating
				var genreal_rating=json_data.general_rating
				if(rating!=0){  
					var data= rating.toFixed(1);
					$('#rating_vale').html(data)
					$("#rateYo").rateYo({
					    rating: data,
					    starWidth: "20px",
					    readOnly: true,
					    
					  });
				}
				else
					{
					$('#rating_vale').html(0)
					$("#rateYo").rateYo({
					    rating: 0,
					    starWidth: "20px",
					    readOnly: true,
					    
					  });
					}
				if(genreal_rating.length>0){  
				var html = '';
				$("#performance_standings").html("");
				for(var i=0;i<genreal_rating.length;i++)
				{  
					if(i==1)
					{
						html+='<div class="item active"><div class="innvovation_item">'
					}
					else
					{
						html+='<div class="item "><div class="innvovation_item">'
					}
					html+= '<div class="progress_content"> <h4>'+genreal_rating[i].employee_name+'</h4><h5><span>'+Math.round(genreal_rating[i].actual_percent*10)/10+'</span> / 100</h5> </div>'+
                    '<div class="delivery_item"><div id="demo-pie-'+i+'" class="pie-title-center demo-pie"  data-percent = "'+Math.round(genreal_rating[i].actual_percent*10)/10+'"\> <span class="pie-value"></span> </div>'+
                    ' </div> </div></div>'
                    
				}
				$("#performance_standings").append(html);
//				$(".progress-round").loading();
			}
			else { $("#performance_standings").html("<span class='blink_me nodata_text'>No Data Available </span>")}
			}
		},
	})
}

function your_goals()      // team leads goals
{    
	 var progress
	 var color
	 var html=''
	 $('#individual_goal').html("")
	 $.ajax({
	 type:'GET',
	 url: '/team_lead_dashboard_goals/',
	 data  : { 'tab_id':'team_lead'},
	 async:false,
	 success: function (json_data){
	 var data=json_data.lead_goal_data
	 if(data.length>0)
	 {
		 for(var i=0;i<data.length;i++)
		 {   
			progress=''
			if(data[i].progress==null || data[i].progress=='') { progress=0 }
			else { 
				progress= data[i].progress 
				if(progress<=25) {  color='#f9b39a' }
				if(progress>25 && progress<=50) { color='#57c3ff'  }
				if(progress>50 && progress<=75) {  color='#FFA500'  }
				if(progress>75 && progress<=100) {  color='#2ce7c8'   }
			}
			html+='<div class="goallist"><div class="media">'+
		       '<div class="media-left media-middle">'+
		       '<div id="demopie1" class=" pie-title-center demopie1" data-percent="'+progress+'" > </div>'+
		       '<span class="color1">'+progress+'%</span>'+
		       '</div>'+
		       '<div class="media-body">'+
		       '<p>'+data[i].strategic_objective_description+'</p>'+
		       '<div class="media-heading text-left"><i class="fa fa-calendar"></i>'+data[i].start_date+' To '+data[i].end_date+'</div>'+
		       '</div></div></div>'
		}
		var count=data.length.toString().length
		if(count==1)
		{
			total_count='0'+data.length
		}
		else { total_count = data.length}
		$('#total_goals,#total_goals1').html(total_count)
		$('#individual_goal').html(html); 
		}
		else { $('#total_goals,#total_goals1').html(0);  $('#individual_goal').html("<span class='blink_me nodata_text'>No Data Availabe </span>")   }
		},
	})
}
var months    = ['January','February','March','April','May','June','July','August','September','October','November','December'];
function plans_tab()
{   
	selected_member_id=''
    $('#pre_indv_week,#pre_indv_month').html("")
//	var months    = ['January','February','March','April','May','June','July','August','September','October','November','December'];
	var curr = new Date; // get current date
	var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
	var last = first + 6; // last day is the first day + 6
	 
	 firstday = new Date(curr.setDate(first))
	 lastday = new Date(curr.setDate(last))
	
	
	Date.prototype.getWeek = function() {
	    var onejan = new Date(this.getFullYear(),0,1);
	    var today = new Date(this.getFullYear(),this.getMonth(),this.getDate());
	    var dayOfYear = ((today - onejan +1)/86400000);
	    return Math.ceil(dayOfYear/7)
	};
	    var today = new Date();
	    var weekno = today.getWeek();
	    var curren_month=months[today.getMonth()]
	    var current_mont_no = today.getMonth();
	    var quarter = Math.floor((today.getMonth() + 3) / 3);
	    mfirstDay = new Date(today.getFullYear(), today.getMonth(), 1);
	    mlastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
	    var quarter_date = Math.floor((today.getMonth() / 3));
	    qfirstDate = new Date(today.getFullYear(), quarter_date * 3, 1);
	    qendDate= new Date(qfirstDate.getFullYear(), qfirstDate.getMonth() + 3, 0);
	    $('#week_number').html('Week'+' '+weekno)
	    $('#month_number').html(curren_month)
	    $('#quarter_number').html('Quarter'+' '+quarter)
	    if(weekno==1)
	    {
	    	$('#pre_indv_week').append('<li >No previous week for current week '+today.getFullYear()+'</li>')
	    }
	    if(weekno==2)
	    {
		    for(var i=0;i<weekno;i++)
	        {   
		    	if(i>0){
		    	$('#pre_indv_week').append('<li onclick="indv_prev_week('+i+');"> Week '+i+'</li>')}
	        }
	    }
	    if(weekno==3)
	    {
		    for(var i=0;i<weekno;i++)
	        {   
		    	if(i>0){
		    	$('#pre_indv_week').append('<li onclick="indv_prev_week('+i+');"> Week '+i+'</li>')}
	        }
	    }
	    if(weekno>=4)
	    {
		    for(var i=weekno-4;i<weekno;i++)
	        {   
		    	if(i>0){
		    	$('#pre_indv_week').append('<li onclick="indv_prev_week('+i+');"> Week '+i+'</li>')}
	        }
	    }
//	                         calculation for month
	    if(current_mont_no==0)
	    {   
	    	$('#pre_indv_month').append('<li >No previous month for '+curren_month+' '+today.getFullYear()+'</li>')
	    }
	    if(current_mont_no==1)
	    {   
		    for(var i=0;i<current_mont_no;i++)
	        {   
		    	 $('#pre_indv_month').append('<li onclick="indv_prev_month('+i+');">'+months[i]+'</li>') 
	        }
	    }
	    if(current_mont_no==2)
	    {
		    for(var i=0;i<current_mont_no;i++)
	        {   
		      $('#pre_indv_month').append('<li onclick="indv_prev_month('+i+');">'+months[i]+'</li>') 
	        }
	    }
	    if(current_mont_no==3)
	    {
		    for(var i=0;i<current_mont_no;i++)
	        {   
		      $('#pre_indv_month').append('<li onclick="indv_prev_month('+i+');">'+months[i]+'</li>') 
	        }
	    }
	    if(current_mont_no>=4)
	    {
	    	for(var i=current_mont_no-4;i<current_mont_no;i++)
	        {   
		    	$('#pre_indv_month').append('<li onclick="indv_prev_month('+i+');">'+months[i]+'</li>') 
	        }
	    }
	    
}

function indv_prev_month(month_no)
{  
		var today = new Date();
		mfirstDay = new Date(today.getFullYear(), month_no, 1);
	    mlastDay = new Date(today.getFullYear(), month_no + 1, 0);
	    startdate=date_conversion(mfirstDay)
		enddate=date_conversion(mlastDay)
		display_start=date_format_conversion(mfirstDay)
		display_end=date_format_conversion(mlastDay)
		your_plan(startdate,enddate,display_start,display_end,'month')
}
function indv_prev_week(weekNumber) {
	  var beginningOfWeek = moment().week(weekNumber).startOf('week');
	  var endOfWeek = moment().week(weekNumber).startOf('week').add(6, 'days');
	  startdate=beginningOfWeek.format("YYYY-MM-DD");
	  enddate=endOfWeek.format("YYYY-MM-DD");
	  display_start=date_format_conversion(startdate)
	  display_end=date_format_conversion(enddate)
	  your_plan(startdate,enddate,display_start,display_end,'week')
}

function indv_prev_quarter(quarter_no)
{
	var today = new Date();
	var startdate
	var enddate
	if (quarter_no=='1')
	{
		startdate=today.getFullYear()+'-'+'01'+'-'+'01'
		enddate=today.getFullYear()+'-'+'03'+'-'+'31'
	}
	if (quarter_no=='2')
	{
    	 startdate=today.getFullYear()+'-'+'04'+'-'+'01'
         enddate=today.getFullYear()+'-'+'06'+'-'+'30'
	}
    if (quarter_no=='3')
    {
    	 startdate=today.getFullYear()+'-'+'07'+'-'+'01'
         enddate=today.getFullYear()+'-'+'09'+'-'+'30'
    }
    if (quarter_no=='4')
    {
    	 startdate=today.getFullYear()+'-'+'10'+'-'+'01'
         enddate=today.getFullYear()+'-'+'12'+'-'+'31'
    }
    display_start=date_format_conversion(startdate)
	display_end=date_format_conversion(enddate)
	your_plan(startdate,enddate,display_start,display_end,'quarter')
}

function month_wise_data()
{    
	var today = new Date();
	mfirstDay = new Date(today.getFullYear(), today.getMonth(), 1);
	mlastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
	startdate=date_conversion(mfirstDay)
	enddate=date_conversion(mlastDay)
	display_start=date_format_conversion(mfirstDay)
	display_end=date_format_conversion(mlastDay)
	your_plan(startdate,enddate,display_start,display_end,'month')
}
function week_wise_data()
{   
	 $('#week_active').addClass('active');
	 $('#month_active').removeClass('active');
	 $('#quarter_active').removeClass('active');
	 startdate=date_conversion(firstday)
	 enddate=date_conversion(lastday)
	 display_start=date_format_conversion(firstday)
	 display_end=date_format_conversion(lastday)
	 your_plan(startdate,enddate,display_start,display_end,'week')
}
function quarter_wise_data()
{   
	 $('#quarter_active').addClass('active');
	 $('#month_active').removeClass('active');
	 $('#week_active').removeClass('active');
	 startdate=date_conversion(qfirstDate)
	 enddate=date_conversion(qendDate)
	 display_start=date_format_conversion(qfirstDate)
	 display_end=date_format_conversion(qendDate)
	 your_plan(startdate,enddate,display_start,display_end,'quarter')
}


function your_plan(start,end,display_start,display_end,type)
{
	
  if(start!='' && end !='' && type!='')
  {
	  $.ajax({
			type:'GET',
			url: '/team_lead_dashboard_plans/',
			async:false,
			data  : { 'start_date':start,'end_date':end},
			success: function (json_data){
				var url_status=json_data.url_status
				var data=json_data.project_task
				if(url_status!='')
				{
					alert_lobibox("info","Data cannot be fetched");
				}
				else
				{   
					var columns = [{"title":"No.","visible":false},{"title":"No.","visible":false},{"title":"No."},{"title":"Project Name"},{"title":"Task Name"},{"title":"Start Date"}, {"title":"End Date"},{"title":"Task Status"}]
					var data_list=[]
					if(data.length>0)
					{   
						for(var i=0;i<data.length;i++)
						{   
							data_list.push([1,1,i+1,data[i].project_name,data[i].task_description,data[i].task_start_date,data[i].task_end_date,data[i].task_stage])
						}
						$('#task_date').html('-'+display_start+' to '+display_end)
						plaindatatable_btn('user_plans', data_list, columns,[],'NEXT_TRANSFORM_HCMS_EMPLOYEE_TASK_DETAILS_'+today)
						$('#plans_popups').modal('show')
						
					}
					else { alert_lobibox("info","No Data Available"); plaindatatable_btn('user_plans', data_list, columns,[],'NEXT_TRANSFORM_HCMS_EMPLOYEE_TASK_DETAILS_'+today) }
					
				}
			},
		})
  }
}
function formatTime(value) {
	value = Math.round(value,2);
	if (value > 12) {
		return value - 12 + " PM";
	} else if (value == 12) {
		return value + " PM";
	} else if (value == 0) {
		return "0 AM";
	}
	return value + "AM";
}

function today_schedule_chart(){
	$("#todayschedule").html("")
	var date = new Date();
	$.ajax({
		type:'GET',
		url: '/today_scheduled_meeting/',
		data:{'to_zone':Intl.DateTimeFormat().resolvedOptions().timeZone},
		async:false,
		success: function (json_data){
			if(json_data.status=="NTE_01"){
				if(json_data.today_schedule.length!=0){
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
						dataProvider: [{category: "Today",segments:json_data.today_schedule}],
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
				else{   
					$("#todayschedule").html('<p class="no_data_found">No Data Found.</p>')
				}
			}
			else{ 
				$("#todayschedule").html('<p class="no_data_found">No Data Found.</p>')
			}
		}
	})
}


function birthday () {
	$(".diwali-wrapper").hide()
    $("#birthday_wish").show()
    setTimeout(function(){
    	$("#birthday_wish").hide()
    	setTimeout(festivels, 15000)
    }, 5000)
}
function festivels () {
	var w_h, w_w;
	w_h = $(window).height();
	w_w = $(window).width()-200;
	$(".diwali-wrapper").css("height", w_h);
	$(".diwali-wrapper").css("width", w_w);
    $(".diwali-wrapper").show()
    setTimeout(birthday, 5000)
}

