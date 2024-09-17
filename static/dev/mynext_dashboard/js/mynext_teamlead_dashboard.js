var today
var format_today
var active_id
var mfirstDay
var mlastDay
var qfirstDate
var qendDate
var start_date
var end_date
var firstday
var lastday
var selected_member_id=''
global_url_path = 'https://mynext.nexttechnosolutions.com/media/';
var image_path = global_url_path+'user_profile/';
$('document').ready(function(){
	$('#birthday_wish').hide();
	$('#selected_member_div,#selected_goal_member').hide();
	today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();
	if(dd<10) {  dd = '0'+dd } 
	if(mm<10) { mm = '0'+mm 	} 
	today = dd + '-' + mm + '-' + yyyy;
	format_today = dd + '-' + mm + '-' + yyyy;
	project_track();
	plans_tab();
	your_goals();
	general_rating();
	festivels()
	birthday_wish()
	 $('[data-toggle="tooltip"]').tooltip()

});

introJs().onchange(function(targetElement) {
	  alert("new step");
	});



$("div" ).mouseover(function(){ $('#diwali_wish').hide(); });
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
				else {
					$('#rating_vale').html(0)
					$("#rateYo").rateYo({
					    rating: 0,
					    starWidth: "20px",
					    readOnly: true,
					    
					  });
				}
				if(genreal_rating.length!=0){  
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
				}
				else { $("#performance_standings").html("<span class='blink_me nodata_text'>No Data Available </span>")}
			}
		},
	})
}

var months    = ['January','February','March','April','May','June','July','August','September','October','November','December'];
function plans_tab()
{   
	selected_member_id=''
	$('#pre_week,#pre_indv_week,#pre_month,#pre_indv_month').html('')
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
	    $('#week_number,#individual_week_number').html('Week'+' '+weekno)
	    $('#month_number,#individual_month_number').html(curren_month)
	    $('#quarter_number,#individual_quarter_number').html('Quarter'+' '+quarter)
	    if(weekno==1)
	    {
	    	$('#pre_indv_week,#pre_week').append('<li >No previous week current week '+today.getFullYear()+'</li>')
	    }
	    if(weekno==2)
	    {
		    for(var i=0;i<weekno;i++)
	        {   
		    	if(i>0){
			    	$('#pre_week').append('<li onclick="prev_week('+i+');"> Week '+i+'</li>')
				    $('#pre_indv_week').append('<li onclick="indv_prev_week('+i+');"> Week '+i+'</li>')
				   }
	        }
	    }
	    if(weekno==3)
	    {
		    for(var i=0;i<weekno;i++)
	        {   
		    	if(i>0){
		    		$('#pre_week').append('<li onclick="prev_week('+i+');"> Week '+i+'</li>')
			    	$('#pre_indv_week').append('<li onclick="indv_prev_week('+i+');"> Week '+i+'</li>')
			    	}
	        }
	    }
	    if(weekno>=4)
	    {
		    for(var i=weekno-4;i<weekno;i++)
	        {   
		    	if(i>0){
		    		$('#pre_week').append('<li onclick="prev_week('+i+');"> Week '+i+'</li>')
			    	$('#pre_indv_week').append('<li onclick="indv_prev_week('+i+');"> Week '+i+'</li>')
			    	}
	        }
	    }
//	                      calculation for month
	    if(current_mont_no==0)
	    {   
	    	$('#pre_indv_month,#pre_month').append('<li >No previous month for '+curren_month+' '+today.getFullYear()+'</li>')
	    }
	    if(current_mont_no==1)
	    {   
		    for(var i=0;i<current_mont_no;i++)
	        {   
		    	$('#pre_month').append('<li onclick="prev_month('+i+');">'+months[i]+'</li>')
		    	$('#pre_indv_month').append('<li onclick="indv_prev_month('+i+');">'+months[i]+'</li>')
	        }
	    }
	    if(current_mont_no==2)
	    {
		    for(var i=0;i<current_mont_no;i++)
	        {   
		    	$('#pre_month').append('<li onclick="prev_month('+i+');">'+months[i]+'</li>')
		    	$('#pre_indv_month').append('<li onclick="indv_prev_month('+i+');">'+months[i]+'</li>')
	        }
	    }
	    if(current_mont_no==3)
	    {
		    for(var i=0;i<current_mont_no;i++)
	        {   
		    	$('#pre_month').append('<li onclick="prev_month('+i+');">'+months[i]+'</li>')
		    	$('#pre_indv_month').append('<li onclick="indv_prev_month('+i+');">'+months[i]+'</li>') 
	        }
	    }
	    if(current_mont_no>=4)
	    {
	    	for(var i=current_mont_no-4;i<current_mont_no;i++)
	        {   
	    		$('#pre_month').append('<li onclick="prev_month('+i+');">'+months[i]+'</li>')
		    	$('#pre_indv_month').append('<li onclick="indv_prev_month('+i+');">'+months[i]+'</li>')
	        }
	    }
//	    for(var i=weekno-4;i<weekno;i++)
//        {
//	    	$('#pre_week').append('<li onclick="prev_week('+i+');"> Week '+i+'</li>')
//	    	$('#pre_indv_week').append('<li onclick="indv_prev_week('+i+');"> Week '+i+'</li>')
//        }
//	    for(var i=current_mont_no-4;i<current_mont_no;i++)
//        {
//	    	$('#pre_month').append('<li onclick="prev_month('+i+');">'+months[i]+'</li>')
//	    	$('#pre_indv_month').append('<li onclick="indv_prev_month('+i+');">'+months[i]+'</li>')
//        }
	    $.ajax({
		   type:'GET',
			url: '/team_lead_dashboard_mem_plans/',
			async:false,
			success: function (json_data){
		    $('#plan_members_list').html('')
			var members_data=json_data.members
			if(members_data.length>0)
			{
				for(var i=0;i<members_data.length;i++)
				{   
					$('#plan_members_list').append("<div class='member'><img  onclick=\"team_member_plan("+members_data[i].related_user_id_id+","+members_data[i].img_id+",'"+members_data[i].name+"');\" src='"+image_path+members_data[i].img_id+".jpg'  onerror=this.src='http://ntoday.nexttechnosolutions.com/static/mobile_new/74.jpg'><span class='name'>"+members_data[i].name+"</span>");
				}
			}
		},
	})
}

function prev_month(month_no)
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
function prev_week(weekNumber) {
	  var beginningOfWeek = moment().week(weekNumber).startOf('week');
	  var endOfWeek = moment().week(weekNumber).startOf('week').add(6, 'days');
	  startdate=beginningOfWeek.format("YYYY-MM-DD");
	  enddate=endOfWeek.format("YYYY-MM-DD");
	  display_start=date_format_conversion(startdate)
	  display_end=date_format_conversion(enddate)
	  your_plan(startdate,enddate,display_start,display_end,'week')
}

function prev_quarter(quarter_no)
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
function indv_prev_month(month_no)
{  
	if(selected_member_id!='')
	{
		var today = new Date();
		mfirstDay = new Date(today.getFullYear(), month_no, 1);
	    mlastDay = new Date(today.getFullYear(), month_no + 1, 0);
	    startdate=date_conversion(mfirstDay)
		enddate=date_conversion(mlastDay)
		display_start=date_format_conversion(mfirstDay)
		display_end=date_format_conversion(mlastDay)
		members_plan(startdate,enddate,display_start,display_end,'month',selected_member_id)
	}
	else { alert_lobibox("info","Select Member First");  }
}
function indv_prev_week(weekNumber) {
	if(selected_member_id!='')
	{
	  var beginningOfWeek = moment().week(weekNumber).startOf('week');
	  var endOfWeek = moment().week(weekNumber).startOf('week').add(6, 'days');
	  startdate=beginningOfWeek.format("YYYY-MM-DD");
	  enddate=endOfWeek.format("YYYY-MM-DD");
	  display_start=date_format_conversion(startdate)
	  display_end=date_format_conversion(enddate)
	  members_plan(startdate,enddate,display_start,display_end,'week',selected_member_id)
	}
	else { alert_lobibox("info","Select Member First");  }
}

function indv_prev_quarter(quarter_no)
{ 
  if(selected_member_id!='')
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
	members_plan(startdate,enddate,display_start,display_end,'quarter',selected_member_id)
  }
	else { alert_lobibox("info","Select Member First");  }
}

function project_track()
{
	$.ajax({
		type:'GET',
		url: '/project_track/',
		async:false,
		success: function (json_data){
			var url_status=json_data.url_status
			$('#projecttab,#Riskstab').html('')
			if(url_status!='')
		    {
				$('#projecttab').html("<span class='blink_me nodata_text'>Data cannot be fetched </span>")
				$('#Riskstab').html("<span class='blink_me nodata_text'>Data cannot be fetched </span>")
				$('#risk_total_project,#total_project,#risk_total_project1,#total_project1').html(0);
		    }
			else
			{  
			   var data=json_data.project_track
			   if(data.length>0)
				{  
				   var html=''
				   var project_list=[]
				   var attendee_list=[]
				   var project_dict={}
				   var employee_dict={}
				   for(var i=0;i<data.length;i++)
                   {   
					    span_content=''
					    div_content=''
					    div2_content=''
					   if(process(format_today) <= process(data[i].end_date))
					   {   
						   span_content='<span class="pro-status style2 pull-right tooltips" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="">'+data[i].description+' <i data-toggle="tooltip" data-placement="bottom" data-original-title="OnTrack" class="fa fa-check-circle-o tooltips"></i></span>'
					   }
					   else
					   {   
						   span_content='<span class="pro-status style1 pull-right tooltips" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="">'+data[i].description+' <i data-toggle="tooltip" data-placement="bottom" data-original-title="Overdue" class="fa fa-exclamation-triangle tooltips"></i></span>'
					   }
					   if(i==0)
					   {
						   div_content='<div class="panel-title"><a class="accordion-toggle accordion-toggle-styled" data-toggle="collapse" data-parent="#projecttab" href="#collapse_1_'+i+'"> '+data[i].project_name+' ('+data[i].completed+'%)'
						   div2_content='<div id="collapse_1_'+i+'" class="panel-collapse in"><div class="panel-body">'
					   }
					   else
					   {
						   div_content='<div class="panel-title"><a class="accordion-toggle accordion-toggle-styled collapsed" data-toggle="collapse" data-parent="#projecttab" href="#collapse_1_'+i+'"> '+data[i].project_name+' ('+data[i].completed+'%)'
						   div2_content='<div id="collapse_1_'+i+'" class="panel-collapse collapse"><div class="panel-body">'
					   }
                       html+='<div class="panel panel-default"><div class="panel-heading"><span class="sno">'+parseInt(i+1)+'</span>'+
                       div_content+
                       span_content+    
                       '<div class="progress"><div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width:'+data[i].completed+'%;"></div></div> '+
                       '</a></div></div>'
                       html+=div2_content+
                       '<div class="row project_status"><div class="col-sm-4 calendar"><span> <i class="fa fa-calendar tooltips" data-toggle="tooltip" data-placement="right" title="" data-original-title="End Date of Latest Task"></i>'+data[i].enddate+'</span></div>'+
                       '<div class="col-sm-6 pull-right marginright"><i class="nf nf-user-circle usericon"></i><section class="user_slider slider"> '
                       attendee_list=[]
                       emp_test_list=[]
                       project_dict={}
                       project_dict['ratio']=data[i].completed
                	   project_dict['project']=data[i].project_name
                	   project_dict['end_date']=data[i].end_date
                	   project_dict['description']=data[i].description
                       for(var j=0;j<data[i].resource_allocate.length;j++)
                       {   
                    	   if(data[i].resource_allocate[j].attendance=='absent')
                    	   {   
                    		   employee_dict={}
	                    	   employee_dict['id']=data[i].resource_allocate[j].id
	                    	   employee_dict['name']=data[i].resource_allocate[j].employee_name
	                    	   attendee_list.push(employee_dict)
	                    	   project_dict['attendee']=attendee_list
                    	   }
                           html+='<div class="user_img style1"><img data-toggle="tooltip" data-placement="left" data-original-title="'+data[i].resource_allocate[j].employee_name+'"  src="http://npower.nexttechnosolutions.com/static/mobile_new/'+data[i].resource_allocate[j].id+'.jpg"  onerror=this.src="http://npower.nexttechnosolutions.com/static/mobile_new/74.jpg"></div>'
                       }
                       emp_test_list.push(project_dict)
                       html+='</section></div></div></div></div></div>'
                       project_dict['total_members'] =  data[i].resource_allocate.length
                       project_list.push(project_dict)
                   }
                   $('#projecttab').append(html)
//                   project_list_destroyCarousel();  project_list_slickCarousel;
                   var count=data.length.toString().length
	   			   if(count==1)
	   			   {
	   					total_count='0'+data.length
	   			   }
	   			   else { total_count=data.length }
                   $('#total_project,#total_project1').html(total_count)
                   if(attendee_list.length>0){ risk_data(project_list) }
                   else { risk_data([])  }
				}
			   else { $('#total_project,#total_project1,#risk_total_project,#risk_total_project1').html(0); $('#projecttab,#Riskstab').html("<span class='blink_me nodata_text'>No Data Available </span>") }
			}
		},
	})
}

function risk_data(project_list)
{ 
  var html=''
  var data=project_list
  if(data.length>0)
  {   
	  for(var i=0;i<data.length;i++)
      {   
		  if(data[i].attendee){
		  span_content=''
		  div_content=''
		  div2_content=''
			  
		   if(new Date(data[i].end_date) > new Date(today))
		   {
			   span_content='<span class="pro-status style2 pull-right "> <i data-toggle="tooltip" data-placement="left"  data-original-title="'+data[i].description+'" class="fa fa-check-circle-o"></i></span>'
		   }
		   else
		   {
			   span_content='<span class="pro-status style1 pull-right "> <i data-toggle="tooltip" data-placement="bottom"  data-original-title="'+data[i].description+'" class="fa fa-exclamation-triangle "></i></span>'
		   }
		  if(i==0)
		   {
			   div_content='<div class="panel-title"><a class="accordion-toggle accordion-toggle-styled" data-toggle="collapse" data-parent="#Riskstab" href="#collapse_2_'+i+'"> '+data[i].project+' ('+data[i].ratio+'%)'
			   div2_content='<div id="collapse_2_'+i+'" class="panel-collapse in"><div class="panel-body">'
		   }
		   else
		   {
			   div_content='<div class="panel-title"><a class="accordion-toggle accordion-toggle-styled collapsed" data-toggle="collapse" data-parent="#Riskstab" href="#collapse_2_'+i+'"> '+data[i].project+' ('+data[i].ratio+'%)'
			   div2_content='<div id="collapse_2_'+i+'" class="panel-collapse collapse"><div class="panel-body">'
		   }
          html+='<div class="panel panel-default"><div class="panel-heading"><span class="sno">'+parseInt(i+1)+'</span>'+
          div_content+
          span_content+    
          '<div class="progress"><div class="progress-bar progress-bar-danger" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width:'+data[i].ratio+'%;"></div></div> '+
          '</a></div></div>'
          html+=div2_content+
          '<div class="">'+
          '<div class="absentees_head"> Absentees<span class="pull-right"> <i class="count">'+data[i].attendee.length+'</i> /'+data[i].total_members+'</span></div>'+
          '<div class="col-sm-12"><section class="user_slider slider"> '
          for(var j=0;j<data[i].attendee.length;j++)
          {   
              html+='<div class="user_img style2"><img data-toggle="tooltip" data-placement="bottom" data-original-title="'+data[i].attendee[j].name+'" src="http://npower.nexttechnosolutions.com/static/mobile_new/'+data[i].attendee[j].id+'.jpg"  onerror=this.src="http://npower.nexttechnosolutions.com/static/mobile_new/74.jpg"></div>'
          }
          html+='</section></div></div></div></div></div>'
		  }
		  }
      $('#Riskstab').append(html)
      var count=data.length.toString().length
	  if(count==1)
	  {
	   	total_count='0'+data.length
	  }
	  else { total_count=data.length }
      $('#risk_total_project,#risk_total_project1').html(total_count)
  }
  else { $('#risk_total_project,#risk_total_project1').html(0); $('#Riskstab').html("<span class='blink_me nodata_text'>No Data Available </span>") }
}

function your_goals()      // team leads goals
{    
	 var progress
	 var color
	 var html=''
	 var tab_id='team_lead'
	 $('#lead_goals').html("")
	 $('#member_goal').html("<span class='blink_me nodata_text'>Select memebers to view goals</span>")
	 $('#members_list').html("")
	 if(tab_id!='')
	 {   
		 $.ajax({
		   type:'GET',
			url: '/team_lead_dashboard_goals/',
			data  : { 'tab_id':tab_id},
			async:false,
			success: function (json_data){
			  var data=json_data.lead_goal_data
			  var members_data=json_data.members
			  if(data.length>0)
			  {
				for(var i=0;i<data.length;i++)
				{   
				  progress=''
				  if(data[i].progress==null || data[i].progress=='') { progress=0 }
				  else 
				  { 
					  progress= data[i].progress 
					  if(progress<=25) { color='#f9b39a' }
					  if(progress>25 && progress<=50) {  color='#57c3ff'  }
					  if(progress>50 && progress<=75) {  color='#FFA500'  }
					  if(progress>75 && progress<=100) {  color='#2ce7c8'  }
				  }
				html+='<div class="goallist"><div class="media">'+
				       '<div class="media-left media-middle">'+
				       '<div id="demopie1" class=" pie-title-center demopie1" data-percent="'+progress+'" > </div>'+
				       '<span class="color1">'+progress+'%</span>'+
				       '</div>'+
				       '<div class="media-body">'+
				       '<p>'+data[i].strategic_objective_description+'</p>'+
				       '<div class="media-heading"><i class="fa fa-calendar"></i>'+data[i].start_date+' To '+data[i].end_date+'</div>'+
				       '</div></div></div>'
				}
				var count=data.length.toString().length
				if(count==1)
				{
					total_count='0'+data.length
				}
				 else { total_count=data.length }
				$('#total_goals,#total_goals1').html(total_count)
				$('#lead_goals').html(html);
			}
			else{ 
				   $('#total_goals,#total_goals1').html(0);  $('#lead_goals').html("<span class='blink_me nodata_text'>No Data Availabe </span>")  
				}
			if(members_data.length>0)
			{   
				for(var i=0;i<members_data.length;i++)
				{   
//					$('#members_list').append('<div class="member"><img  onclick=team_member_goal('+members_data[i].related_user_id_id+');  src="'+image_path+members_data[i].img_id+'.jpg"  onerror=this.src="http://npower.nexttechnosolutions.com/static/mobile_new/74.jpg"><span class="name">'+members_data[i].name+'</span>');
					$('#members_list').append("<div class='member'><img  onclick=\"team_member_goal("+members_data[i].related_user_id_id+","+members_data[i].img_id+",'"+members_data[i].name+"');\" src='"+image_path+members_data[i].img_id+".jpg'  onerror=this.src='http://npower.nexttechnosolutions.com/static/mobile_new/74.jpg'><span class='name'>"+members_data[i].name+"</span>");
				}
				
			}
		},
	})
  }
	 else { $('#total_goals,#total_goals1').html(0);  $('#lead_goals').html("<span class='blink_me nodata_text'>No Data Availabe </span>") }
}



function team_member_goal(emp_id,img_id,name)
{   
	
	$('#selected_goal_member').html("")
	$('#selected_goal_member').append("<span class='team_memb_img'><img src='"+image_path+img_id+".jpg'  onerror=this.src='http://npower.nexttechnosolutions.com/static/mobile_new/74.jpg'></span><label>"+name+"</label>");
    $('#selected_goal_member').show();
	var progress
	var color
	var html=''
	$('#member_goal').html("")
	goal_member_id=emp_id
	if(goal_member_id!='')
	 {
		 $.ajax({
		   type:'GET',
			url: '/team_lead_dashboard_goals/',
			data  : { 'tab_id':'team_member','member_id':goal_member_id},
			async:false,
			success: function (json_data){
			  var data=json_data.lead_goal_data
			  if(data.length>0)
			  {
				for(var i=0;i<data.length;i++)
				{   
				  progress=''
				  if(data[i].progress==null || data[i].progress=='') { progress=0 }
				  else 
				  { 
					  progress= data[i].progress 
					  if(progress<=25) { color='#f9b39a'  }
					  if(progress>25 && progress<=50) {  color='#57c3ff'   }
					  if(progress>50 && progress<=75) { color='#FFA500'  }
					  if(progress>75 && progress<=100) {  color='#2ce7c8'  }
				  }
				  html+='<div class="goallist"><div class="media">'+
			       '<div class="media-left media-middle">'+
			       '<div id="demopie1" class=" pie-title-center demopie1" data-percent="'+progress+'" > </div>'+
			       '<span class="color1">'+progress+'%</span>'+
			       '</div>'+
			       '<div class="media-body">'+
			       '<p>'+data[i].strategic_objective_description+'</p>'+
			       '<div class="media-heading"><i class="fa fa-calendar"></i>'+data[i].start_date+' To '+data[i].end_date+'</div>'+
			       '</div></div></div>'
				}
				$('#member_goal').html(html);
				
				jQuery('.demopie1').pieChart({
					 barColor: '#2be7c4',
		                trackColor: '#edeaff',
		                lineCap: 'round',
		                lineWidth: 3,
	                onStep: function (from, to, percent) {
	                    $(this.element).find('.pie-value').text(Math.round(percent) + '%');
	                }
	            });



			}
			else {  $('#member_goal').html("<span class='blink_me nodata_text'>No Data Availabe </span>")   } 
		},
	})
 }
	 else {  $('#member_goal').html("<span class='blink_me nodata_text'>No Data Availabe </span>") }
}


function month_wise_data()
{   
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
						plaindatatable_btn('user_plans', data_list, columns,[],'NEXT_TRANSFORM_HCMS_EMPLOYEE_TASK_DETAILS_'+today,'Employee Task Plans')
						$('#plans_popups').modal('show')
						
					}
					else { alert_lobibox("info","No Data Available"); plaindatatable_btn('user_plans', data_list, columns,[],'NEXT_TRANSFORM_HCMS_EMPLOYEE_TASK_DETAILS_'+today,'Employee Task Plans') }
					
				}
			},
		})
  }
}
function team_member_plan(emp_id,img_id,name)
{      
        
	    $('#selected_member_div').html("")
		$('#selected_member_div').append("<span class='team_memb_img'><img src='"+image_path+img_id+".jpg'  onerror=this.src='http://npower.nexttechnosolutions.com/static/mobile_new/74.jpg'></span><label>"+name+"</label>");
	    $('#selected_member_div').show();
	    selected_member_id=emp_id
		
}
function individual_month_wise_data()
{   
	if(selected_member_id!='')
	{   
		startdate=date_conversion(mfirstDay)
		enddate=date_conversion(mlastDay)
		display_start=date_format_conversion(mfirstDay)
		display_end=date_format_conversion(mlastDay)
		members_plan(startdate,enddate,display_start,display_end,'month',selected_member_id)
	}
	else { alert_lobibox("info","Select Member First");  }
	}
function individual_week_wise_data()
{   
	if(selected_member_id!='')
	{
	  startdate=date_conversion(firstday)
	  enddate=date_conversion(lastday)
	  display_start=date_format_conversion(firstday)
	  display_end=date_format_conversion(lastday)
	  members_plan(startdate,enddate,display_start,display_end,'week',selected_member_id)
	}
	else { alert_lobibox("info","Select Member First");  }
}
function individual_quarter_wise_data()
{   
  if(selected_member_id!='')
  {
			 startdate=date_conversion(qfirstDate)
			 enddate=date_conversion(qendDate)
			 display_start=date_format_conversion(qfirstDate)
			 display_end=date_format_conversion(qendDate)
			 members_plan(startdate,enddate,display_start,display_end,'quarter',selected_member_id)
	}
	else { alert_lobibox("info","Select Member First");  }
}

function members_plan(start,end,display_start,display_end,type,id)
{ 
  if(start!='' && end !='' && type!='')
  {   
	  $.ajax({
			type:'GET',
			url: '/team_member_plans/',
			async:false,
			data  : { 'start_date':start,'end_date':end,'member_id':id},
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
						plaindatatable_btn('user_plans', data_list, columns,[],'NEXT_TRANSFORM_HCMS_EMPLOYEE_TASK_DETAILS_'+today,'Employee Task Plans')
						$('#plans_popups').modal('show')
					}
					else { alert_lobibox("info","No Data Available"); plaindatatable_btn('user_plans', data_list, columns,[],'NEXT_TRANSFORM_HCMS_EMPLOYEE_TASK_DETAILS_'+today,'Employee Task Plans') }
					
				}
			},
		})
  }
}
//                          slider initialize function

function member_list_slickCarousel() {        //slider initialization for team members list
	$(".members_slider").slick({
        dots: false,
        infinite: false,
        slidesToShow: 4,
        vertical: true,
        centerMode: false,
        verticalSwiping: true,
        slidesToScroll: 1,
    }); 
	}

function member_list_destroyCarousel() {
	  if ($('.members_slider').hasClass('slick-initialized')) {
	    $('.members_slider').slick('destroy');
	  }      
	}

function project_list_slickCarousel() {        //slider initialization for project list members list
	$(".user_slider").slick({
		 infinite: false,
         prevArrow: true,
         nextArrow: true,
         draggable: true,
         slidesToShow: 4,
         slidesToScroll: 1
    }); 
	}

function project_list_destroyCarousel() {
	  if ($('.user_slider').hasClass('slick-initialized')) {
	    $('.user_slider').slick('destroy');
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
    $(".diwali-wrapper").hide()
    setTimeout(birthday, 5000)
}

