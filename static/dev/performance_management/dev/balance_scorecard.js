var update_id='';
$('document').ready(function(){
	balanced_scorecard_load();
	objective_form_view(); 
	date_picker();
});	
$('#year_data').change(function (){
	objective_form_view()
});
$('#quarter').change(function (){
	objective_form_view()
});
function balanced_scorecard_load()
{
	$('#year_data').html('')
	$('#quarter').html('')
	var year = (new Date()).getFullYear();               //year data load
	var current = year;
	year -= 3;
	for (var i = 0; i < 8; i++) {
		$('#year_data').append($('<option>', {
			value :year + i,
			text : year + i,
		}));
	}
	$('#year_data option[value='+current+']').attr('selected','selected');
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
			text :quarter_data[i],
			}));
	}
	if(quarter>=0) { $('#quarter option[value='+quarter+']').attr('selected','selected'); }
}
function objective_form_view()    //   objective add function
{   
	var year=$('#year_data').val()
	var quarter=$('#quarter').val()
	if(year!='' && quarter!='')
	{
		$.ajax({
			type:'GET',
			url: '/perspective_data/',
			data:{'year':year,'quarter':quarter},
			async: false,
			success: function (json_data){
				$('#financial_dev').html('');  $('#custom_dev').html('');  $('#knowledge_dev').html('');  $('#process_dev').html('')
				var fin_data=json_data.FINAN
				var cst_data=json_data.CSTMR
				var ipr_data=json_data.IPRCS
				var lrn_data=json_data.LRNGR
				var total_progress=0,avg=0,completed_obj=0
				if(fin_data)
				{   
					var len=fin_data.length;
					if(len>0)
					{   
						for(var i=0;i<len;i++)
						{   
							$('#financial_dev').append('<p id='+fin_data[i].id+' onclick="objective(this.id)" value='+fin_data[i].id+' class="bsc_text"><i class="nf nf nf-customers balnced_icon"></i>'+fin_data[i].strategic_objective_description+'.</p>')
							total_progress+=fin_data[i].progress
							if(fin_data[i].progress==100)
							{
								completed_obj+=1
							}
						}
						avg=total_progress/len
					} else { $('#financial_dev').html("<p class='blink_me nodatas_text'>No Data Available </p>");  }
					progress_chart('fin_chart','#fin_avg','#fin_obj_count','#fin_obj_completed',len,avg,completed_obj,'#53c6fa')
				}
				else { $('#financial_dev').html("<p class='blink_me nodatas_text'>No Data Available </p>") }
				
				if(cst_data)
				{  
					total_progress=0,avg=0,completed_obj=0
					var len=cst_data.length;
					if(len>0)
					{
						for(var i=0;i<len;i++)
						{   
							$('#custom_dev').append('<p id='+cst_data[i].id+' onclick="objective(this.id)" value='+cst_data[i].id+' class="bsc_text"><i class="nf nf nf-customer balnced_icon"></i>'+cst_data[i].strategic_objective_description+'.</p>')
						    total_progress+=cst_data[i].progress
							if(cst_data[i].progress==100)
							{
								completed_obj+=1
							}
						}
						avg=total_progress/len
					} else { $('#custom_dev').html("<p class='blink_me'>No Data Available </p>")  }
					progress_chart('cst_chart','#cst_avg','#cst_obj_count','#cst_obj_completed',len,avg,completed_obj,'#e2a141')
				}
				else { $('#custom_dev').html("<p class='blink_me'>No Data Available </p>")  }
				
				if(ipr_data)
				{   
					total_progress=0,avg=0,completed_obj=0
					var len=ipr_data.length;
					if(len>0)
					{
						for(var i=0;i<len;i++)
						{   
							$('#process_dev').append('<p id='+ipr_data[i].id+' onclick="objective(this.id)"  value='+ipr_data[i].id+' class="bsc_text"><i class="nf nf-pre-processing balnced_icon"></i>'+ipr_data[i].strategic_objective_description+'.</p>')
							total_progress+=ipr_data[i].progress
							if(ipr_data[i].progress==100)
							{
								completed_obj+=1
							}
						}
						avg=total_progress/len
					} else { $('#process_dev').html("<p class='blink_me'>No Data Available </p>") }	
					progress_chart('process_chart','#process_avg','#process_obj_count','#process_obj_completed',len,avg,completed_obj,'#8e66ff')
				}    
				else { $('#process_dev').html("<p class='blink_me'>No Data Available </p>") }	
				
				if(lrn_data)
				{   
					total_progress=0,avg=0,completed_obj=0
					var len=lrn_data.length;
					if(len>0)
					{
						for(var i=0;i<len;i++)
						{   
							$('#knowledge_dev').append('<p id='+lrn_data[i].id+'  onclick="objective(this.id)" value='+lrn_data[i].id+' class="bsc_text"><i class="nf nf-knowledge balnced_icon"></i>'+lrn_data[i].strategic_objective_description+'.</p>')
							total_progress+=lrn_data[i].progress
							if(lrn_data[i].progress==100)
							{
								completed_obj+=1
							}
						}
						avg=total_progress/len
					} else { $('#knowledge_dev').html("<p class='blink_me'>No Data Available </p>") }	
					progress_chart('learn_chart','#learn_avg','#learn_obj_count','#learn_obj_completed',len,avg,completed_obj,'#d97df0')
				}
				else { $('#knowledge_dev').html("<p class='blink_me'>No Data Available </p>") }	
			},
		})
	}
}

function progress_chart(chart_id,avg_id,total_obj_id,total_completed_id,total_obj,progress_value,completed_obj,color)
{  
	$(avg_id).html(Math.round(progress_value)+'%'); $(total_obj_id).html(total_obj); $(total_completed_id).html(completed_obj)
	var chart = AmCharts.makeChart( chart_id, {
	      "type": "pie",
	      "theme": "light",
//	     "colors": [
//	    		"#f6f2ff",
//	    		"#2ce7c8",
//	    		],
	      //"autoMargins":true,
	        
	        "marginBottom": 0,
	    	"marginLeft": 0,
	    	"marginRight": 0,
	    	"marginTop": 0,
	        
	      "dataProvider": [ {
	        "country": "",
	        "litres": 100-progress_value,
	        "fieldColor":"#f6f2ff"
	      }, {
	        "country": "",
	        "litres":progress_value,
	        "fieldColor":color
	      } ],
	      "valueField": "litres",
	      "titleField": "country",
	      "colorField": "fieldColor",
	        "showBalloon": false,
	       "labelsEnabled": false,
	      
	      "export": {
	        "enabled": false
	      }
	    } );	

}

$('#obj_plan_type').change(function(){
	plan = $('#obj_plan_type').val()
	if(plan=="monthly"){
		$('#obj_set_yearlist').parent().parent().css('display','block');$('#obj_set_quarterlist').parent().parent().css('display','none');
		$('#obj_set_monthlist').parent().parent().css('display','block');
	}
	else if(plan=="quarterly"){
		$('#obj_set_quarterlist').parent().parent().css('display','block'); $('#obj_set_yearlist').parent().parent().css('display','block');
		$('#obj_set_monthlist').parent().parent().css('display','none');
	}
	else
	{
		$('#obj_set_quarterlist').parent().parent().css('display','none');$('#obj_set_yearlist').parent().parent().css('display','none');
		$('#obj_set_monthlist').parent().parent().css('display','none');
	}
})

$("#obj_set_monthlist").change( function() {
	year=$( "#obj_set_yearlist option:selected" ).text();
	month=$("#obj_set_monthlist option:selected" ).text();
	if(month!='' && year!='' )
	{  
		day_month='1'+month+' '+year
		var start = new Date(day_month);
		start_date = moment(start).format("DD-MMM-YYYY");
		var end = new Date(day_month);
		var end_date_format = new Date(end.getFullYear(), end.getMonth() + 1, 0);
		end_date = moment(end_date_format).format("DD-MMM-YYYY");
		$("#am_start_date").DateTimePicker({dateFormat: "dd-MMM-yyyy",minDate:new Date(day_month),maxDate:new Date(end.getFullYear(), end.getMonth() + 1, 0)});
		$("#am_end_date").DateTimePicker({dateFormat: "dd-MMM-yyyy",minDate:new Date(day_month),maxDate:new Date(end.getFullYear(), end.getMonth() + 1, 0)});
		$("#obj_set_start_date").val(start_date)
		$("#obj_set_end_date").val(end_date)
	}
})

$('#obj_set_quarterlist').change(function(){
	quarterVal = $('#obj_set_quarterlist').val()
	if(quarterVal!='' && $( "#obj_set_yearlist option:selected" ).text()!='' )
	{
		yearVal = $( "#obj_set_yearlist option:selected" ).text();
		var start = new Date(yearVal,quarterVal*3-3,1);
		var end = new Date(yearVal,quarterVal*3,0);
		$("#am_start_date").DateTimePicker({
			dateFormat: "dd-MMM-yyyy",
			minDate:start,
			maxDate:end
		});
		$("#am_end_date").DateTimePicker({
			dateFormat: "dd-MMM-yyyy",
			minDate:start,
			maxDate:end
		});
		$("#obj_set_start_date").val(moment(start).format("DD-MMM-YYYY"))
		$("#obj_set_end_date").val(moment(end).format("DD-MMM-YYYY"))
	}
})

function objective(id)
{ 
  $('#balance_scorecard_view > .col-md-12').addClass('col-md-6').removeClass('col-md-12');
  $('#Add_bsc_objective_Modal').show();
  $('#Add_bsc_objective_Modal').addClass('col-md-6').removeClass('col-md-12');
  $('.errormessage').html('')
  if(id!='')
  {  
     form_button_show('update');
	 $.ajax({
			type:'GET',
			url: '/selected_objective/',
			data  : { 'selected_id':id},
			success: function (json_data){
				var data=json_data.objective_data
				if(data)
				{   
					update_id=data[0].id
					$('#org_set_objective_name').val(data[0].strategic_objective_description);
					$('#bsc_perspective').val(data[0].bsc_perspective_id).trigger("change");
					$('#obj_plan_type').val(data[0].objective_plan_type).trigger("change");
					$('#obj_set_yearlist').val(data[0].planned_year).trigger("change");
					if(data[0].planned_month!=null)
					{
						$('#obj_set_monthlist').val(data[0].planned_month).trigger("change");
					}
					if(data[0].planned_quarter!=null)
					{
						$('#obj_set_quarterlist').val(data[0].planned_quarter).trigger("change");
					}
					if(data[0].organization_id!=null)
					{
						$('#obj_org_id').val(data[0].organization_id).trigger("change");
					}
					else
						{
						$('#obj_org_id').val('0').trigger("change");
						var slider = $('.objective_progress').data("ionRangeSlider");
						slider.update({
							from: data[0].progress
						});
						}
					$('#obj_set_start_date').val((moment(data[0].start_date).format("DD-MMM-YYYY")));
					$('#obj_set_end_date').val((moment(data[0].end_date).format("DD-MMM-YYYY")));
					
				}
				else { update_id='' }
			},
		})	
  }
}
//     model pop function
function bsc_obj_model()
{    
	 $('#balance_scorecard_view > .col-md-12').addClass('col-md-6').removeClass('col-md-12');
	 $(".tip").tooltip("hide");  $('#Add_bsc_objective_Modal').show();
	 $('#Add_bsc_objective_Modal').addClass('col-md-6').removeClass('col-md-12');
	 form_button_show('add');  update_id=''
	 document.getElementById("bsc_objective_form").reset();
	 $('#obj_plan_type').val('0').trigger("change");  $('#bsc_perspective').val('0').trigger("change");
	 $('#obj_org_id').val('0').trigger("change");  $('.errormessage').html('')
	 $('#progress_div').hide()
	 var slider = $('.objective_progress').data("ionRangeSlider");
		slider.update({
			from: 0
		});
}
//     form save function
function objective_form_submit()
{
	var month='';
	var quarter='';
	var dynamic_addobjective_values=''; var objective_name=$('#org_set_objective_name').val();
	var bsc_perspective=$('#bsc_perspective').val(); var start_date=$('#obj_set_start_date').val();
	var end_date=$('#obj_set_end_date').val(); var obj_plan_type=$('#obj_plan_type').val();
	var year=$('#obj_set_yearlist').val(); var obj_org_id=$('#obj_org_id').val();
	var status=bsc_objective_form_validation()
	if($('#obj_plan_type').val()=='monthly')
	{
		month=$('#obj_set_monthlist').val();
		if(month=='0') { $('#monthly_error_message').html('The field is required') }
		else {  $('#monthly_error_message').html('') }
	}
	else
	{
		quarter=$('#obj_set_quarterlist').val();
		if(quarter=='0') {  $('#quarter_error_message').html('The field is required') }
		else { $('#quarter_error_message').html('') }
	}
	if(obj_org_id=='0')
	{
	    slider = $(".objective_progress").data("ionRangeSlider");
		var slider_data=slider.old_from
	}
	
	if(status)
	{   
		if(objective_name!='' && bsc_perspective!='0' && start_date!='' && end_date!='' && obj_plan_type!='0')
		{
			var load_data={"objective_name":objective_name,'bsc_perspective':bsc_perspective,'start_date':start_date,
	    			'end_date':end_date,'obj_plan_type':obj_plan_type,'obj_org_id':obj_org_id,'year':year,'month':month,'quarter':quarter,
	    			'update_id':update_id,'slider_data':slider_data,csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()}
		   send_data('post',"/bsc_form_save/",load_data)
	    }
	    else  {  alert_lobibox("info","Fill all mandatory fields");  }
	}
	 else  {  alert_lobibox("info","Fill all mandatory fields");  }
}
//   common ajax function
function send_data(url_type,url,data)
{  
	$.ajax(
			{
				type:url_type,
				url: url,
				data  : data,
			    async : false,
				success: function (json_data){
					if(json_data.status=='NTE_01'){ alert_lobibox("success", sysparam_datas_list[json_data.status]); objective_form_cancel(); objective_form_view();}
					else if(json_data.status=='NTE_02'){ alert_lobibox("error", sysparam_datas_list[json_data.status]); objective_form_cancel(); }
					else if(json_data.status=='NTE_03'){ alert_lobibox("success", sysparam_datas_list[json_data.status]); objective_form_cancel(); objective_form_view(); update_id=''}
					else if(json_data.status=='NTE_04'){ alert_lobibox("success", sysparam_datas_list[json_data.status]); objective_form_cancel(); objective_form_view(); update_id=''}
					else if(json_data.status=='001'){ alert_lobibox("info","Session Expired");}
					else{ alert_lobibox("error", sysparam_datas_list["ERR0034"]); }
				},
			})	
}
function objective_form_update() { objective_form_submit(); } //update function 
function objective_remove_confirmation() {  removeConfirmation('bsc_objctive_remove',update_id,'Assessment Form'); } //remove function 

function bsc_objctive_remove()
{
	if(update_id!='')
	{
	   var load_data={"remove_id":update_id,csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()}	
	   send_data('post',"/objective_form_delete/",load_data);
	}
}
//cancell function 
function objective_form_cancel()
{
	document.getElementById("bsc_objective_form").reset();
	form_button_show('add'); date_picker();
	$('.errormessage').html(''); $('#bsc_perspective').val('0').trigger("change"); 	$('#Add_bsc_objective_Modal').hide();
	$('#obj_plan_type').val('0').trigger("change"); $('#obj_org_id').val('0').trigger("change");
	$('#balance_scorecard_view > .col-md-6').addClass('col-md-12').removeClass('col-md-6');
    $('#Add_bsc_objective_Modal').addClass('col-md-6').removeClass('col-md-12');
    $('#progress_div').hide()
    var slider = $('.objective_progress').data("ionRangeSlider");
	slider.update({
		from: 0
	});
    update_id=''
}
     //validation for dropdown
$('#obj_set_monthlist').change(function(){
	month=$('#obj_set_monthlist').val();
	if(month=='0') { $('#monthly_error_message').html('The field is required') } else {  $('#monthly_error_message').html('') }
});
$('#obj_set_quarterlist').change(function(){
	quarter=$('#obj_set_quarterlist').val();
	if(quarter=='0') { $('#quarter_error_message').html('The field is required') } else {  $('#quarter_error_message').html('') }
});
$('#obj_set_yearlist').change(function(){
	year=$('#obj_set_yearlist').val();
	if(year=='0') { $('#yearly_error_message').html('The field is required') } else {  $('#yearly_error_message').html('') }
});

$('#obj_org_id').change(function(){
	org=$('#obj_org_id').val()
	if(org=='0' || org=='') { $('#progress_div').show() }
	else {  $('#progress_div').hide() }
	
});
function date_picker()                      //date picker initialization
{
	$("#am_start_date").DateTimePicker({ dateFormat: "dd-MMM-yyyy" 	});
	$("#am_end_date").DateTimePicker({ dateFormat: "dd-MMM-yyyy"    });	
}
$('#balance_scorecard_form_close').click(function(){ objective_form_cancel() }); // form close function 

$('#bsc_objective_form').submit(function(e) {  //form validation
	e.preventDefault();
}).validate({
	rules: {
		obj_plan_type: { valueNotEquals:true, },
		obj_set_yearlist: { valueNotEquals:true, },
		org_set_objective_name: { required: true, }, 
		obj_set_start_date : { required: true },
		obj_set_end_date : { required: true },
		org_unit: { valueNotEquals:true, },
		bsc_perspective: { valueNotEquals:true, },
	},
	//For custom messages
	messages: {
		obj_plan_type: { valueNotEquals: "The field is required", },
		obj_set_yearlist: { valueNotEquals: "The field is required", },
		org_set_objective_name: { required: "The field is required", },
		obj_set_start_date: { required: "The field is required", },
		obj_set_end_date: { required: "The field is required", },
		org_unit: { valueNotEquals: "The field is required", },
		bsc_perspective: { valueNotEquals: "The field is required", },
	},
	errorElement: 'div',
	errorPlacement: function(error, element) {
		var placement = $(element).data('error');
		if (placement) {
			$(placement).append(error)
		} else {
			error.insertAfter(element);
		}
	},
	ignore: []
});
function bsc_objective_form_validation() {  return $('#bsc_objective_form').valid(); }

function form_button_show(flag)    //button create
{   
	$("#balance_obj_btn").empty();
	if (flag=='add')
	{ 
		var btnstr = '<button type="button" class="btn btn-success btn-eql-wid btn-animate margin-right-3" id="obj_form_save" onclick="objective_form_submit();">Add</button>';
	}
	else
	{  
		var btnstr= '<button type="button" class="btn btn-primary btn-eql-wid btn-animate margin-right-3" id="obj_form_updates" onclick="objective_form_update()"";><i class="fa fa-green"></i> Update</button>';
		btnstr += '<button type="button" class="btn btn-danger btn-eql-wid btn-animate margin-right-3" id="obj_form_delete" onclick="objective_remove_confirmation();">Remove</button>';
	}
	btnstr += '<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-3" id="obj_form_clear" onclick="objective_form_cancel();">Cancel / Clear</button>';
	$("#balance_obj_btn").append(btnstr);	
}

