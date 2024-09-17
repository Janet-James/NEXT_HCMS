var global_service_type='';
var global_mail_thread_show=false;
	$("#hcms_query_document").change(function() {
		img_datas = encodeDoctoBase64(this);
	});
$("#ce_service_query").attr('maxlength','200');
$("#ce_priority").change(function(){
	if ($('#ce_priority').val()>0)  { $('.errorTxt2').html('') }
});

$('#ce_service_call_response').siblings().find('.note-para').attr('onclick','summ_para_click(this);')
function service_type(group)
{   
	$('#ce_service_description').siblings().find('.note-para').attr('onclick','summ_para_click(this);')
	if (group==1){
		service_group='HCM'
	}	
	else if(group==2){
		service_group='PMO'
	}
	else
	{
		service_group='GS'
	}
	return service_group
}

function service_call_type(type)
{
	ce_clear_cancel()
	global_service_type=type
	global_mail_thread_show=true
	$.ajax({
		type:'GET',
		url: '/ce_type_based_query/',
		async:false,
		data  : { 'service_type':global_service_type},
		success: function (json_data){
			service_group=service_type(global_service_type)
			$('#dynamic_service_group_span').text(service_group)
			$('#ce_default_query,#ce_priority,#ct_assign_to_employee').html('')
			$('#ce_default_query').append($('<option>', {
				value :'0',
				text :'-Select Category-'
			}));
			$('#ce_priority').append($('<option>', {
				value :'0',
				text :'-Select Priority-'
			}));
			$('#ct_assign_to_employee').append($('<option>', {
				value :'0',
				text :'-Select Assignee-'
			}));
			if(json_data.default_query.length>0)
			{
				for(i=0;i<json_data.default_query.length;i++)
				{
					$('#ce_default_query').append($('<option>', {
						value : json_data.default_query[i].id,
						text : json_data.default_query[i].query,
					}));
				}
			}
			if(json_data.priority.length>0)
			{
				for(i=0;i<json_data.priority.length;i++)
				{
					$('#ce_priority').append($('<option>', {
						value : json_data.priority[i].id,
						text : json_data.priority[i].refitems_name,
					}));
				}
			}
			if(json_data.group_member_list.length>0)
			{
				for(i=0;i<json_data.group_member_list.length;i++)
				{
					$('#ct_assign_to_employee').append($('<option>', {
						value : json_data.group_member_list[i].id,
						text : json_data.group_member_list[i].employee_name,
					}));
				}
			}
			$('#HCM_popup').modal('show');   
			ce_service_call_button();
			if(json_data.employee_group_check.length!=0)
			{
				communication_ticket_details();$('#communication_ticket_display_div').show();}
			else{$('#communication_ticket_display_div').hide();}
		}
	})
	
}
//$('#ce_service_description').on('summernote.keyup', function(e) {
//		var length = $(".note-editable").text().length
//		var text = $(this).next('.note-editor').find('.note-editable').text();
//		if(length>0)
//		{
//			$('.errorTxt31').html(" ")
//		}
//		else if(length>5000)
//		{   
//			$('#ce_service_description').summernote('code',text.slice(0,5000));;
//		}
//		else
//		{
//			$('.errorTxt31').html("Enter the Description")
//		}
//});

//$('#ce_service_call_response').on('summernote.keyup', function(e) {
//	var length = $(".note-editable").text().length
//	console.log(length)
//	var text = $(this).next('.note-editor').find('.note-editable').text();
//	if(length>0)
//	{   
//		$('.errorTxt32').html(" ")
//	}
////	else if(length>5000)
////	{   
////		$('#ce_service_call_response').summernote('code',text.slice(0,5000));;
////	}
//	else
//	{
//		$('.errorTxt32').html("Enter the Description")
//	}
//});

function ce_add_query()
{  
	default_query_id=$('#ce_default_query').val();
	ce_service_query=$('#ce_service_query').val();
	ce_priority=$('#ce_priority').val();
	ce_description=$('#ce_service_description').summernote('code');
	var status=hcms_query_form_validation()
	attachment_id=saveDocAttachment();
	if($('#ce_service_description').summernote('isEmpty')==true){
		$('.errorTxt31').html("Enter the Description")
    } 
	if (default_query_id=='0')
	{
		ajax_data={ 'ce_service_query':ce_service_query,'ce_priority':ce_priority,'ce_description':ce_description,'priority_text':$('#ce_priority option:selected').text(),'attachment_id':attachment_id,'service_type':global_service_type}
	}
	else
	{
		ajax_data={ 'default_query_id':default_query_id,'ce_service_query':ce_service_query,'ce_priority':ce_priority,'ce_description':ce_description,'priority_text':$('#ce_priority option:selected').text(),'attachment_id':attachment_id,'service_type':global_service_type}
	}
	if(status && $('#ce_service_description').summernote('isEmpty')==false){
		$.ajax({
			type:'POST',
			url: '/ce_service_call_submit/',
			async:false,
			data  : ajax_data,
//			stimeout : 10000,
			success: function (json_data){
				if(json_data.status == 'NTE_01'){
					alert_lobibox("success", sysparam_datas_list[json_data.status]);
					my_query();
					query_count();
				}else if(json_data.status == 'NTE_02'){
					alert_lobibox('error',json_data.message)
				}
				$('#HCM_popup').modal('hide');
			}
		})
	}
	else { alert_lobibox("info", "Fill in All the Mandatory Fields"); }
}

function ce_service_call_button()
{
	$("#service_call_buttons").empty();
	var btnstr = '<button type="button" class="btn btn-primary btn-eql-wid btn-animate margin-right-3"  onclick="ce_add_query();">Submit</button>';
	btnstr += '<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-3" onclick="service_call_cancel_confirmation();">Cancel / Clear</button>';
	$("#service_call_buttons").append(btnstr);    
}

function ce_clear_cancel()
{   
	$('#ce_default_query,#ce_priority').val('0').trigger("change");
	$('#ce_service_description').summernote('reset');
	$('#ce_service_query,#error_message').html('')
	document.forms['hcms_query_form'].reset();
}

function service_call_cancel_confirmation() {  orgClearFuncton('ce_clear_cancel','Cancel','Query request detail'); } //remove confirmation function

$('#hcms_query_form').submit(function(e) {   // form validation
	e.preventDefault();
}).validate({
	rules: {
		ce_service_query: { required: true, }, 
		ce_priority: { valueNotEquals:true, },
		ce_service_description: { required: true, }, 
	},
	//For custom messages
	messages: {
		ce_service_query: { required: "Enter the Query", },
		ce_priority: { valueNotEquals: "Select the Priority", },
		ce_service_description: { required: "Enter the Description", },

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

function hcms_query_form_validation() { return $('#hcms_query_form').valid(); }

function communication_ticket_details(){
	$.ajax({
		type:'GET',
		url: '/communication_ticket_details/',
		async : false,
		data  : {'service_type':global_service_type},
		success: function (json_data){
			var data = json_data
			ticket_table_view('opn_tkt_table',data.opn_tik_fetch);
			ticket_table_view('ans_tkt_table',data.ans_tik_fetch);
			ticket_table_view('res_tkt_table',data.res_tik_fetch);
			ticket_table_view('verf_tkt_table',data.verf_tik_fetch);
			ticket_table_view('cls_tkt_table',data.cls_tik_fetch);
		}
	});
}

function ticket_table_view(tkt_name,tkt_data){
	today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();
	if(dd<10) {  dd = '0'+dd } 
	if(mm<10) { mm = '0'+mm 	} 
	today = dd + '-' + mm + '-' + yyyy;
	var ticket_list =[]
	var ticket_data ='';
	var ticket_status_count_id='';
	if(tkt_name=='opn_tkt_table'){ ticket_data ='Opened Date';ticket_status_count_id='tik_opn_count';status_updated_by='Opened By'}
	if(tkt_name=='ans_tkt_table'){ ticket_data ='Answered Date';ticket_status_count_id='tik_ans_count';status_updated_by='Answered By'}
	if(tkt_name=='res_tkt_table'){ ticket_data ='Resolved Date';ticket_status_count_id='tik_res_count';status_updated_by='Resolved By'}
	if(tkt_name=='verf_tkt_table'){ ticket_data ='Verified Date';ticket_status_count_id='tik_verf_count';status_updated_by='Verified By'}
	if(tkt_name=='cls_tkt_table'){ ticket_data ='Closed Date';ticket_status_count_id='tik_cls_count';status_updated_by='Closed By'}                                                                     
	var columns = [{"title":"form id","visible": false},{"title":"S.No"},{"title":"Raised By"},{"title":"Query Code"},{"title":"Query Subject"},{"title":"Age"},{"title":ticket_data },{"title":status_updated_by },{"title":"Assigned To" },{"title":"Priority"}]
	var len = tkt_data.length
	$('#'+ticket_status_count_id).text(len)
	if (len>0){
		for(var a=0;a<len;a++){
			ticket_date=new Date(tkt_data[a].date)
			
			ticket_list.push([tkt_data[a].id,a+1,tkt_data[a].raised_by,tkt_data[a].ticket_no,tkt_data[a].query,tkt_data[a].age,moment(ticket_date).format('DD MMM YYYY, h:mm A'),tkt_data[a].status_changed_by,tkt_data[a].assigned_to,tkt_data[a].priority])
		}
		plaindatatable_btn(tkt_name, ticket_list, columns,[],'NEXT_TRANSFORM_HCMS_EMPLOYEE_QUERY_DETAILS_'+today,'EMPLOYEE QUERY DETAILS')
	}
	plaindatatable_btn(tkt_name, ticket_list, columns,[],'NEXT_TRANSFORM_HCMS_EMPLOYEE_QUERY_DETAILS_'+today,'EMPLOYEE QUERY DETAILS')
}

$('#opn_tkt_table').on('click', 'tbody tr', function(){
	var arr=$('#opn_tkt_table').dataTable().fnGetData($(this)); 
	query_table_click(arr[0] )
})
$('#ans_tkt_table').on('click', 'tbody tr', function(){
	var arr=$('#ans_tkt_table').dataTable().fnGetData($(this)); 
	query_table_click(arr[0] )
})
$('#res_tkt_table').on('click', 'tbody tr', function(){
	var arr=$('#res_tkt_table').dataTable().fnGetData($(this)); 
	query_table_click(arr[0] )
})
$('#verf_tkt_table').on('click', 'tbody tr', function(){
	var arr=$('#verf_tkt_table').dataTable().fnGetData($(this)); 
	query_table_click(arr[0] )
})
$('#cls_tkt_table').on('click', 'tbody tr', function(){
	var arr=$('#cls_tkt_table').dataTable().fnGetData($(this)); 
	query_table_click(arr[0] )
})


function query_table_click(query_id)
{
	$('#HCM_mailthread').modal('show');
	$('.errorTxt32').html(" ")
	$("#service_call_rate").rateYo({
		starWidth: "20px",
		readOnly: false,
	});
	$("#overall_service_call_rate").rateYo({
		starWidth: "20px",
		readOnly: false,
	});
	communication_thread_formation(query_id);	
}

function communication_thread_formation(id)
{

	var query_id=id;
	$.ajax({
		type:'GET',
		url: '/ce_communication_thread_details_display/',
		async : false,
		data  : {'service_call_id':query_id},
		success: function (json_data){
			$("#overall_service_call_rate,#service_call_rate").rateYo()
			$("#overall_service_call_rate,#service_call_rate").rateYo("destroy")
			$('#ce_service_call_response').summernote('code','');
			var html=''
				service_call=json_data.service_call[0]
			communication = json_data.communication_thread
			opened_date=new Date(service_call.opened_on)
			query_code=service_call.query_code
			if(service_call.assigned_to_id==null || service_call.assigned_to_id=='' || service_call.assigned_to_id==undefined)
			{
				service_call.assigned_to_id=0
			}
//			 $('#ce_service_call_response').summernote('editor.insertImage', data);
			if(service_call.attatch_id)
				{
			var content="<a id='material_link' href='' onclick='doc_view("+service_call.attatch_id+")'><span style=cursor:pointer>"+service_call.name+"</span></a>";
			$('#query_document_span_id').append('<i class="fa fa-paperclip" class="query_document_icon"></i>'+content)}
			else
				{
				$('#query_document_span_id').empty();
				}
			$('#ct_query_title').text(query_code+': '+service_call.query)
			
			$('#ct_call_opened_by').text(service_call.opened_by)
			$('#ct_initiated_query').html(service_call.description)
			$('#ct_query_initiated_time').text(moment(opened_date).format('DD MMM YYYY, h:mm A'))
			$('#ct_assign_to_employee').val(service_call.assigned_to_id).trigger("change");
			$('#ct_call_opened_by_id').attr('src', service_call.image_id_id+'.jpg');
			$('#ct_query_stage').text('Opened')
			opened_by_id=service_call.opened_by_id
			service_call_status=service_call.service_call_status
			$('#ct_reply_id').attr('src', json_data.employee[0].image_id_id+'.jpg');
			$('#communication_panel').empty()
		$("#response_button_div").empty()
			status_div_status=service_call_status_change(service_call_status,opened_by_id,json_data.employee[0].id)
			rating=''
			if(status_div_status[1]==true)
			{if(service_call.rating==null)
			{rating=0}else{rating=service_call.rating}
			$("#service_call_rate").rateYo({
				rating: rating,
				starWidth: "20px",
				readOnly: false,
			});
			$("#overall_service_call_rate").rateYo({
				rating: rating,
				starWidth: "20px",
				readOnly: true,
			});}
			if(communication.length>0){
				for(var i=0;i<communication.length;i++){
					responded_on=new Date(communication[i].responded_on)
					query_stage=communication[i].status_changed_to
					if(query_stage==1)
						{
						stage='Opened'; status_color='txt-color-green'
						}
					else if(query_stage==2)
						{
						stage='Answered'; status_color='txt-color-yellow'
						}
					else if(query_stage==3)
					{
					stage='Resolved'; status_color='txt-color-green'
					}
					else if(query_stage==4)
						{
						stage='Verified'; status_color='txt-color-yellow'
						}
					else if(query_stage==5)
					{
					stage='Closed'; status_color='txt-color-green'
					}
					else
					{
						stage='Re-Opened'; status_color='txt-color-green'
						}

					html+='<div class="mail_panel">'+		
					'<div class="row">'+
					'<div class="col-sm-7 col-lg-9">'+
					'<div class="mail_content">'+
					'<div ><ul><li class="mailmember"><img src="'+communication[i].image_id_id+'.jpg" ></li><li class="mailsender">'+communication[i].responded_by+'</li></ul></div>'+
					'<div class="mailmessage"><p>'+communication[i].response_content+'</p></div>'+
					'</div>'+
					'</div>'+
					'<div class="col-sm-5 col-lg-3">'+
					' <div class="mail_detail">'+
					' <ul>'+
					'<li class="mail_time">'+moment(responded_on).format('DD MMM YYYY, h:mm A')+'</li> '+
					'</ul>'+
					'</div>'+
					'<div class="mail-status">'+
					'<p class='+status_color+' >'+stage+'</p>'+
				    '</div>'+
					' </div>'+
					'</div>'+
					' </div>'
				}
				$('#communication_panel').html(html)
			}

			$("#response_button_div").append('<button type="button" class="btn btn-success btn-eql-wid btn-animate" onclick="response_submit('+query_id+','+service_call_status+','+opened_by_id+','+status_div_status[0]+','+status_div_status[1]+')">Respond</button>')
		}
	})
}

function doc_view(id)
{
	var currurl = window.location.href;
	var actionurl = currurl.replace('/hcms/','/doc_viewer/?id='+id);
	document.getElementById('material_link').href = actionurl;
}
function service_call_status_change(service_call_status,raiser,logged_in_user)
{
	$("#ct_service_call_status_list").html('')
	$('#ct_assign_to_div,#ct_change_status_div').show()
	$('#ct_rating_div').hide()
	$('#status_and_assigned_to_div').show()
	$("#ct_assign_to_div,#ct_change_status_div").removeClass("col-sm-3")
	$("#ct_assign_to_div,#ct_change_status_div").addClass("col-sm-6")
	status_div_status=true
	rating_status=false
	if (raiser==logged_in_user)
	{
		raiser=true
	}
	else
	{
		raiser=false
	}
	if(raiser==false)
	{
		$("#ct_rating_div").hide();
		$('#ct_assign_to_div,#ct_change_status_div,#ct_reply_overall_div').removeClass()
		$('#ct_assign_to_div,#ct_change_status_div').addClass("col-sm-6")
if (service_call_status==1 || service_call_status==6)
		{$("#ct_service_call_status_list").append("<option value='2' selected>Answered</option><option value='3'>Resolved</option>");}
		else if(service_call_status==2)
		{$("#ct_service_call_status_list").append("<option value='2' selected>Answered</option><option value='3'>Resolved</option>");}
		else if(service_call_status==3)
		{status_div_status=false}
		else if(service_call_status==4)
		{$("#ct_service_call_status_list").append("<option value='0' selected>-Select-</option><option value='5' >Closed</option>");}
		else if(service_call_status==5)
		{status_div_status=false;$("#ct_assign_to_div").hide()}}
	else
	{
		$("#ct_assign_to_div").hide();
		$("#ct_rating_div").hide();
		$("#ct_change_status_div").removeClass()
		$("#ct_change_status_div").addClass("col-sm-6")
		if (service_call_status==1 || service_call_status==6)
		{status_div_status=false}
		else if(service_call_status==2)
		{status_div_status=false}
		else if(service_call_status==3)
		{$("#ct_service_call_status_list").append("<option value='4' selected>Verified</option><option value='2' >Answered</option>");}
		else if(service_call_status==4)
		{status_div_status=false}
		else if(service_call_status==5)
		{
			$("#ct_service_call_status_list").append("<option value='7' selected>-Select-</option><option value='6' >Reopen</option>");}}

	if(status_div_status==false)
	{
		$("#ct_change_status_div").hide();
		$("#ct_assign_to_div").removeClass()
		$("#ct_assign_to_div").addClass("col-sm-6")
	
		if (service_call_status==3){ 
			$("#ct_change_status_div").hide();
			$("#ct_assign_to_div").hide()
		}
		
		
	}
	$('#ct_service_call_status_list').trigger('change');
	if(service_call_status==5 && raiser==true)
		{
		$('#ct_assign_to_div').hide()
		$("#ct_rating_div").show()
		$("#ct_change_status_div").show();
		rating_status=true
		}
	
	return [status_div_status,rating_status] 
}

function response_submit(id,current_status,opened_by_id,status_div_status,rating_status)
{
	query_id=id
	response_content= $('#ce_service_call_response').summernote('code');
	if(status_div_status==false)
	{
		status_changed_to='';
	}
	else
	{
		status_changed_to=$('#ct_service_call_status_list').val();
	}
	assigned_to = $('#ct_assign_to_employee').val();
	if(assigned_to=='0'){ assigned_to = null}
	if(rating_status==true){
rating=$("#service_call_rate").rateYo("option", "rating");}
    else{rating=''}
	if($('#ce_service_call_response').summernote('isEmpty')==false)
	{  
		$.ajax({
			type:'POST',
			url: '/ce_communication_response_submit/',
			async : false,
			data  : {'service_call_id':query_id,'response_content':response_content,'current_status':current_status,'status_changed_to':status_changed_to,'assigned_to':assigned_to,'rating':rating,'opened_by_id':opened_by_id},
			success: function (json_data){
				if(json_data.status == 'NTE_01'){
					alert_lobibox("success", sysparam_datas_list[json_data.status]);
					$('#ce_service_call_response').summernote('code','');
					communication_thread_formation(query_id)
					my_query();
					query_count();
				}else if(json_data.status == 'NTE_02'){
					alert_lobibox('error',json_data.message)
				}
			}
		})
	}
	else {  alert_lobibox('info',"The Response Must Not be Empty"); $('.errorTxt32').html("Enter the Description"); }
}

$('#ct_service_call_status_list').change(function(){
	var status_value=$('#ct_service_call_status_list  option:selected').val()
	if(status_value==5 || status_value==3 )
		{
		$('#ct_assign_to_div').hide()	
		}
	else if(status_value==0 || status_value==2)
		{
		$('#ct_assign_to_div').show()
		}
	else if(status_value==6){
		$("#ct_rating_div").hide()
	}
	else if(status_value==7)
		{
		$("#ct_rating_div").show()
		}
})

$('#stage_open').on('click', 'tbody tr', function(){
	var arr=$('#stage_open').dataTable().fnGetData($(this)); 
	global_mail_thread_show=false
	query_table_click(arr[0] )
})
$('#stage_answer').on('click', 'tbody tr', function(){
	var arr=$('#stage_answer').dataTable().fnGetData($(this));
	global_mail_thread_show=false
	query_table_click(arr[0] )
})
$('#stage_resolved').on('click', 'tbody tr', function(){
	var arr=$('#stage_resolved').dataTable().fnGetData($(this));
	global_mail_thread_show=false
	query_table_click(arr[0] )
})
$('#stage_verified').on('click', 'tbody tr', function(){
	var arr=$('#stage_verified').dataTable().fnGetData($(this)); 
	global_mail_thread_show=false
	query_table_click(arr[0] )
})
$('#stage_closed').on('click', 'tbody tr', function(){
	var arr=$('#stage_closed').dataTable().fnGetData($(this)); 
	global_mail_thread_show=false
	query_table_click(arr[0] )
})

$(document).on('show.bs.modal', '#HCM_mailthread', function (e) {
	$('#HCM_popup').modal('hide');
});

$("#HCM_mailthread").on('hide.bs.modal', function(){
	if(global_mail_thread_show==true){
		communication_ticket_details();
	$('#HCM_popup').modal('show');}
  });


function summ_para_click(el){
	if($(el).find('.note-btn-group > .note-dropdown-menu').css("display") == 'flex'){
		$(el).find('.note-btn-group > .note-dropdown-menu').css("display","none");
	} else {
		$(el).find('.note-btn-group > .note-dropdown-menu').css({'display': 'flex',
			'margin-left': '-300px',
			'margin-top': '-38px'});
		$(el).find('.note-btn-group > .note-dropdown-menu > .note-btn-group').css('display', 'flex');
	}
};

$('body').click(function(evt){
	if (!(evt.target.className == "note-btn dropdown-toggle active" || evt.target.className == "note-icon-align-left")){
		$('body').find('.note-btn-group > .note-dropdown-menu').css("display","none");
	}
});

function close_popup()
{  
  if($('#ce_service_call_response').summernote('isEmpty')==false)
  {  
	swal ({
		title: "Are you sure, you want to close the tab?",
		type: "warning",
		showCancelButton: true,
		confirmButtonClass: "btn btn-success btn-eql-wid btn-animate pull-left",
		cancelButtonClass: "btn btn-danger btn-eql-wid btn-animate pull-right",
		confirmButtonText: "Yes",
		cancelButtonText: "No",
		closeOnConfirm: true,
		closeOnCancel: true,
	},
	function(isConfirm) {
		if (isConfirm) {
			$('#HCM_mailthread').modal('hide')
			} 
	});
  }
  else { $('#HCM_mailthread').modal('hide')  }
}
