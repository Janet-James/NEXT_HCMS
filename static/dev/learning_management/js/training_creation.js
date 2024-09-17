$('document').ready(function(){
	training_detail_view();
	training_form_cancel();
});

$("#training_document").change(function() {
    img_datas = encodeDoctoBase64(this);
});

$('#organization').change(function(){
	var str_org_id=$('#organization  option:selected').val()
	$('#org_unit').html('')
	$('#org_unit').append($('<option>', {   value :'0',  text :'--Select--' 	 }));
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
	else { $('#org_unit option[value='+0+']').attr('selected','selected'); }
		
});

$('#org_unit').change(function(){
	var str_org_unit_id=$('#org_unit  option:selected').val()
	var str_org_id=$('#organization  option:selected').val()
	if(str_org_unit_id!='0' && str_org_id!='0')
	{
		$.ajax({
			type:'GET',
			url: '/org_unit_division/',
			async : false,
			data  : { 'str_org_unit_id':str_org_unit_id,'str_org_id':str_org_id},
			success: function (json_data){
				var data=json_data
				$('#division').empty();
				if(data)
				{  
					var data_len=data.org_unit_division.length;
					if(data_len>0)
					{  
						for(var i=0;i<data_len;i++)
						{   
							$('#division').append($('<option>', {
			                    value : data.org_unit_division[i].id,
			                    text : data.org_unit_division[i].name,
			                }));
							$('#division').push(data.org_unit_division[i].id)
						}
					}
					else{ $('#division').empty(); }
				}
				else{ $('#division').empty()};
			},
		})	
	}
	else {
		$('#division').empty();
	}
});

function ConvertDateFormat(selector) {
    if(selector!='')
    {
        var from = moment(selector, 'DD-MM-YYYY').format("MM/DD/YYYY");
        return new Date(from);
    }
    else {  return selector; }
}

var update_id=''
var exsist_attach_id=''
function training_form_submit()   //add and update function
{   
	doc_id=exsist_attach_id
	var training_name=$('#training_name').val();
	var description=$('#description').val();
	var training_type=$('#training_type option:selected').val();
	var training_method=$('#training_method option:selected').val();
	var training_category=$('#training_category option:selected').val();
	var training_start_date=ConvertDateFormat($('#training_start_date').val());
	var training_end_date=ConvertDateFormat($('#training_end_date').val());
	var division=$('#division').val();
	var status=training_creation_form_validation()
	if(status)
	{
		if (training_name!='' && training_start_date!='' && training_end_date!='' && training_type>'0' && training_method>'0' && division!=null && training_category>'0')
		{   
			if(Date.parse(training_start_date)> Date.parse(training_end_date))
			{
				alert_lobibox("info","To date should not be less then from date")
			}
			else
			{   
				if(doc_id=='0' || doc_id=='')
				{   
					attachment_id=saveDocAttachment()
				}
				else
				{
					   attachment_id=updateDocAttachment()
				}
				var load_data={"training_name":training_name,'description':description,'training_type':training_type,'training_category':training_category,
		    			'training_method':training_method,'training_start_date':$('#training_start_date').val(),'training_end_date':$('#training_end_date').val(),'division':JSON.stringify(division),
		    			'update_id':update_id,'file_id':attachment_id,csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()}
	            send_data('post',"/training_form_save/",load_data) 
			}
		}
		else { alert_lobibox("info","Fill all required fields")  }
	}
	else{ alert_lobibox("info","Fill all required fields")  }
}
//common ajax function
function send_data(url_type,url,data)
{  
	$.ajax(
			{
				type:url_type,
				url: url,
				data  : data,
			    async : false,
				success: function (json_data){
					if(json_data.status=='NTE_01'){ alert_lobibox("success", sysparam_datas_list[json_data.status]); training_form_cancel(); training_detail_view();}
					else if(json_data.status=='NTE_02'){ alert_lobibox("error", sysparam_datas_list[json_data.status]); training_form_cancel(); }
					else if(json_data.status=='NTE_03'){ alert_lobibox("success", sysparam_datas_list[json_data.status]); training_form_cancel(); training_detail_view(); update_id=''}
					else if(json_data.status=='NTE_04'){ alert_lobibox("success", sysparam_datas_list[json_data.status]); training_form_cancel(); training_detail_view(); update_id=''}
					else if(json_data.status=='ERR0028'){ alert_lobibox("info","The selected data is in use and cannot be removed.");}
					else if(json_data.status=='001'){ alert_lobibox("info","Session Expired");}
					else{ alert_lobibox("error", sysparam_datas_list["ERR0034"]); }
				},
			})	
}

function training_detail_view()
{   
	$.ajax(
			{
				type:'GET',
				url: '/training_details_view/',
				success: function (json_data){
					var data=json_data
					var verticalViewData = '';
					$('#training_data').html('');
					$('#training_data').append($('<option>', {
	                    value : '0',
	                    text : 'Search by Training ',
	                }));
					if(data)
					{
						var len=data.training_details.length;
						if(len>0)
						{
							for(var i=0;i<len;i++)
							{
								$('#training_data').append($('<option>', {
				                    value : data.training_details[i].id,
				                    text : data.training_details[i].training_name,
				                }));
								 verticalViewData += '<div class="col-md-12 EmployeeCard equhight employeeList ta_job_opening search_'+data.training_details[i].id+'" id="'+data.training_details[i].id+'" onclick="trainng_details('+data.training_details[i].id+')">'
							        verticalViewData += '<div class="col-md-12">'
							        verticalViewData += '<table><tr><td class="tdwidth1">Training Name </td><td class="tdwidth2">:</td><td class="tdwidth3"><b>'+data.training_details[i].training_name+'</b></td></tr>';
							        verticalViewData += '<tr><td class="tdwidth1">Training Type</td><td class="tdwidth2">:</td><td class="tdwidth3"><b> <b>'+data.training_details[i].refitems_name+'</b></td></tr>';
							        verticalViewData += '<tr><td class="tdwidth1">Start Date </td><td class="tdwidth2">:</td><td class="tdwidth3"><b> <b>'+data.training_details[i].start_date+'</b></td></tr>';
							        verticalViewData += '<tr><td class="tdwidth1">End Date </td><td class="tdwidth2">:</td><td class="tdwidth3"><b> <b>'+data.training_details[i].end_date+'</b></td></tr></table>';
							        verticalViewData += '</div>'
							        verticalViewData += '</div>'
							}
						}
						else { $('#training_data option[value='+0+']').attr('selected','selected'); verticalViewData="<p class='nodata_text'>No Data Available </p>"}
					}
					else { $('#training_data option[value='+0+']').attr('selected','selected'); verticalViewData="<p class='nodata_text'>No Data Available </p>"}
					
					 $('#training_details_view').html(verticalViewData);
				},
			})	
}

function trainng_details(id)           // row click function
{
	$('.EmployeeCard').removeClass('custom_dev_acitve');
	$('#'+id).addClass('custom_dev_acitve');
	$('.errormessage').html('')
	if(id)
	{
		form_button_show('update')
		update_id=id;
		$.ajax(
				{
					type:'GET',
					url: '/selected_training_details/',
					data : {'selected_id':update_id,csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()},
					success: function (json_data){
						var training_data=json_data.selected_training_details;
						var org_data=json_data.org_details;
						$('#file_list').show()
						var attach=json_data.attachment_info;
						if(training_data.length>0)
						{  
							$('#training_name').val(training_data[0]['training_name']);
							$('#description').val(training_data[0]['description']);
							$('#training_type').val(training_data[0]['training_type_id']).trigger('change')
						    $('#training_method').val(training_data[0]['training_methodology_id']).trigger('change')
						    $('#training_category').val(training_data[0]['training_category_id']).trigger('change')
							$('#training_start_date').val(training_data[0]['start_date']);
							$('#training_end_date').val(training_data[0]['end_date']);
						}
						if(org_data.length>0)
						{ 
							$('#organization').val(org_data[0]['org_id']).trigger('change')
							$('#org_unit').val(org_data[0]['org_unit_id']).trigger('change')
							$('#division').val(training_data[0].division_id).trigger('change');
						}
						if(attach.length>0)
						{
							exsist_attach_id=attach[0]['id'];
							$('#file_list').html('<div id="file" onclick="file_remove('+attach[0]['id'] +')">'+ attach[0]['name']+'</div>')
						}
						else { exsist_attach_id='';   $('#file_list').html('')    }
						$(".date_input_class").trigger('change');
					},
				})
	}
}

var file_remove_id=''
function file_remove(file_id)
{   
	file_remove_id=file_id
	 removeConfirmation('file_remove_fun',file_remove_id,'File');
}
function file_remove_fun()
{
	var load_data={"file_remove_id":file_remove_id,csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()}	
	$.ajax(
			{
				type:"post",
				url: "/training_file_delete/",
				data  : load_data,
			    async : false,
				success: function (json_data){
					if(json_data.status=='NTE_04'){ alert_lobibox("success", sysparam_datas_list[json_data.status]); $('#file_list').hide();  exsist_attach_id='';}
					else if(json_data.status=='001'){ alert_lobibox("info","Session Expired");}
					else{ alert_lobibox("error", sysparam_datas_list["ERR0034"]); }
				},
			})	
}

function training_remove_confirmation() {  removeConfirmation('training_remove',update_id,$('#training_name').val()); } //remove confirmation function

function training_remove()
{
	if(update_id!='')
	{
	   var load_data={"remove_id":update_id,'exsist_attach_id':exsist_attach_id,csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()}	
	   send_data('post',"/training_form_delete/",load_data);
	}
}

$('#training_data').change(function(){                         //search functio
	var search_id=$('#training_data option:selected').val()
	$('.EmployeeCard').hide()
	if(search_id>0)
	{
	    $('.search_'+search_id).show()
	    $('#'+search_id).addClass('custom_dev_acitve');
	}
	else { $('.EmployeeCard').show(); $('.EmployeeCard').removeClass('custom_dev_acitve'); }
		
});

function training_form_cancel()
{   
	document.forms['training_creation_form'].reset();
	$("#training_type,#training_method,#organization,#org_unit,#training_category").attr("data-placeholder","Select");
	$("#training_type,#training_method,#organization,#org_unit,#training_category").select2();	
	$("#training_type,#training_method,#organization,#org_unit,#training_category").val(0).trigger('change')
	$('#division').empty();
	$('.errormessage').html('')
	$('#file_list').html('') 
	update_id=''
	exsist_attach_id=''
	$('.EmployeeCard').removeClass('custom_dev_acitve');
	form_button_show('add');
	$('#training_end_date,#training_start_date').val('');
	$(".date_input_class").trigger('change');
	current_user_details()
}

function current_user_details()    // fetch current user organizations
{  
	$.ajax({
		type:'GET',
		url: '/current_user_details/',
		async : false,
		success: function (json_data){
			var data=json_data.user_detaills
			$('#organization').val(data[0]['org_id_id']).trigger('change')
			$('#org_unit').val(data[0]['org_unit_id_id']).trigger('change')
			$('#division').val(data[0]['team_name_id']).trigger('change');
		},
	})	
}

function training_cancel_confirmation() {  orgClearFuncton('training_form_cancel','Cancel','Training Detail'); } //remove confirmation function


function form_button_show(flag) //   button create
{   
	$("#training_btn_div").empty();
	if (flag=='add')
	{ 
		var btnstr = '<button type="button" class="btn btn-success btn-eql-wid btn-animate margin-right-3" id="training_form_save" onclick="training_form_submit();">Add</button>';
	}
	else
	{  
		var btnstr= '<button type="button" class="btn btn-primary btn-eql-wid btn-animate margin-right-3" id="training_form_updates" onclick="training_form_submit()"";><i class="fa fa-green"></i> Update</button>';
		btnstr += '<button type="button" class="btn btn-danger btn-eql-wid btn-animate margin-right-3" id="training_form_delete" onclick="training_remove_confirmation();">Remove</button>';
	}
	btnstr += '<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-3" id="training_form_clear" onclick="training_cancel_confirmation();">Cancel / Clear</button>';
	$("#training_btn_div").append(btnstr);	
}


$('#training_creation_form').submit(function(e) {  //form validation
	e.preventDefault();
}).validate({
	rules: {
		training_name: { required: true, }, training_type: { valueNotEquals:true, },org_unit: { valueNotEquals:true, },
		training_method: { valueNotEquals:true, },training_start_date : { required: true },organization: { valueNotEquals:true, },
		training_end_date : { required: true },division: { valueNotEquals:true, },training_category: { valueNotEquals:true, },
	},
	//For custom messages
	messages: {
		training_name: { required: "Training name is required", },training_type: { valueNotEquals: "Type is required", },training_method: { valueNotEquals: "Method is required", },
		training_start_date: { required: "Start date is required", },organization: { valueNotEquals: "Organization is required", },training_end_date: { required: "End date is required", },
		org_unit: { valueNotEquals: "Organization unit is required", },division: { valueNotEquals: "Division is required", },training_category: { valueNotEquals: "Category is required", },
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
function training_creation_form_validation() {  return $('#training_creation_form').valid(); }
