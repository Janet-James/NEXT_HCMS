$('document').ready(function(){
	internship_form_cancel(); internship_detail_view();
});
var update_id=''
$('#organization').change(function(){
	var str_org_id=$('#organization  option:selected').val()
	$('#org_unit').html('')
	$('#org_unit').append($('<option>', {  value :'0',  text :'--Select--'  }));
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
	$('#division,#training_authority').html('')
	$('#division,#training_authority').append($('<option>', {   value :'0', text :'--Select--' })); 
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
					
					if(emp_data_len>0)
					{   
						for(var i=0;i<emp_data_len;i++)
						{ 
							$('#training_authority').append($('<option>', {
			                    value : data.employee_data[i].id,
			                    text : data.employee_data[i].name,
			                }));
						}
					}
					else{ $('#training_authority option[value='+0+']').attr('selected','selected'); }
				}
				else{ $('#division option[value='+0+']').attr('selected','selected'); $('#training_authority option[value='+0+']').attr('selected','selected');}
			},
		})	
	}
		else{ $('#division option[value='+0+']').attr('selected','selected'); }
});

$('#division').change(function(){
	var division_id=$('#division  option:selected').val()
	$('#training_name').html('')
	$('#training_name').append($('<option>', {  value :'0', text :'--Select--'  }));
	if(division_id!='0' && division_id!='')
	{
		$.ajax({
			type:'GET',
			url: '/division_training_view/',
			async : false,
			data  : { 'division_id':division_id},
			success: function (json_data){
				var data=json_data
				if(data)
				{
					var data_len=data.training_details.length;
					if(data_len>=1)
					{  
						for(var i=0;i<data_len;i++)
						{   
							$('#training_name').append($('<option>', {
			                    value : data.training_details[i].training_id,
			                    text : data.training_details[i].training_name,
			                }));
						}
					}
					else{ $('#training_name option[value='+0+']').attr('selected','selected'); }
				}
				else{ $('#training_name option[value='+0+']').attr('selected','selected'); }
			},
		})	
	}
	else { $('#training_name option[value='+0+']').attr('selected','selected'); }
});

$('#country').change(function(){
	var country_id=$('#country  option:selected').val()
	$('#state').html('')
	$('#state').append($('<option>', {  value :'0',text :'--Select--'  }));
	if(country_id!='0' && country_id!='')
	{
		$.ajax({
			type:'GET',
			url: '/division_training_view/',
			async : false,
			data  : { 'country_id':country_id},
			success: function (json_data){
				var data=json_data
				if(data)
				{
					var data_len=data.state_details.length;
					if(data_len>=1)
					{  
						for(var i=0;i<data_len;i++)
						{   
							$('#state').append($('<option>', {
			                    value : data.state_details[i].id,
			                    text : data.state_details[i].state_name,
			                }));
						}
					}
					else{ $('#state option[value='+0+']').attr('selected','selected'); }
				}
				else{ $('#state option[value='+0+']').attr('selected','selected'); }
			},
		})	
	} 
	else { $('#state option[value='+0+']').attr('selected','selected'); }
});

$('#training_name').change(function(){
	var training_id=$('#training_name  option:selected').val()
	$('#training_type,#training_start_date,#training_end_date').val('')
	if(training_id!='0' && training_id!='')
	{
		$.ajax({
			type:'GET',
			url: '/division_training_view/',
			async : false,
			data  : { 'training_id':training_id},
			success: function (json_data){
				var data=json_data
				if(data)
				{
					$('#training_type').val(data.training_data[0]['refitems_name'])
					$('#training_start_date').val(data.training_data[0]['start_date'])
					$('#training_end_date').val(data.training_data[0]['end_date'])
				}
			},
		})	
	}
});

function internship_form_submit()
{
	var candidate_name=$('#candidate_name').val();
	var institute_name=$('#institute_name').val();
	var degree=$('#degree').val();
	var year_of_passing=$('#year_of_passing').val();
	var address=$('#address').val();
	var zip=$('#zip').val();
	var training_name=$('#training_name option:selected').val();
	var country=$('#country option:selected').val();
	var state=$('#state option:selected').val();
	var division=$('#division option:selected').val();
	var training_authority=$('#training_authority option:selected').val();
	var status=internship_training_form_validation()
    if (status)
    {
		if (candidate_name!='' && institute_name!='' && degree!='' && year_of_passing!='' && address!='' && zip!='' && training_name!='' && country!='' && state!='' && division!='' && training_authority!='')
	    {
			var load_data={"candidate_name":candidate_name,'institute_name':institute_name,'degree':degree,
	    			'year_of_passing':year_of_passing,'address':address,'zip':zip,'training_name':training_name,'update_id':update_id,
	    			'country':country,'state':state,'division':division,'training_authority':training_authority,csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()}
	        send_data('post',"/internship_form_save/",load_data) 
	    }
		else { Lobibox.notify.closeAll(); alert_lobibox("info","Fill all required fields");  }
    }
    else { Lobibox.notify.closeAll(); alert_lobibox("info","Fill all required fields") }
}

function send_data(url_type,url,data)
{  
	$.ajax(
			{
				type:url_type,
				url: url,
				data  : data,
			    async : false,
				success: function (json_data){
					if(json_data.status=='NTE_01'){ Lobibox.notify.closeAll(); alert_lobibox("success", sysparam_datas_list[json_data.status]); internship_form_cancel(); internship_detail_view();}
					else if(json_data.status=='NTE_02'){ alert_lobibox("error", sysparam_datas_list[json_data.status]); internship_form_cancel(); }
					else if(json_data.status=='NTE_03'){ alert_lobibox("success", sysparam_datas_list[json_data.status]); internship_form_cancel(); internship_detail_view(); update_id=''}
					else if(json_data.status=='NTE_04'){ alert_lobibox("success", sysparam_datas_list[json_data.status]); internship_form_cancel(); internship_detail_view(); update_id=''}
					else if(json_data.status=='NTE_001'){ alert_lobibox("success", "Successfully convert Candidate to employee"); internship_form_cancel(); internship_detail_view(); update_id=''}
					else if(json_data.status=='001'){ alert_lobibox("info","Session Expired");}
					else{ alert_lobibox("error", sysparam_datas_list["ERR0034"]); }
				},
			})	
}

function internship_detail_view()
{
	$.ajax(
			{
				type:'GET',
				url: '/internship_details_view/',
				success: function (json_data){
					var data=json_data
					var verticalViewData = '';
					$('#inernship_data').html('');
					$('#inernship_data').append($('<option>', {
	                    value : '0',
	                    text : 'Search by Candidate',
	                }));
					if(data)
					{
						var len=data.internship_details.length;
						if(len>0)
						{
							for(var i=0;i<len;i++)
							{
								$('#inernship_data').append($('<option>', {
				                    value : data.internship_details[i].id,
				                    text : data.internship_details[i].candidate_name,
				                }));
								employe_status=''
								if(data.internship_details[i].employee_status==true)
								{
									employe_status='Yes'
								}
								else { employe_status='No' }
								 verticalViewData += '<div class="col-md-12 EmployeeCard equhight employeeList ta_job_opening search_'+data.internship_details[i].id+'" id="'+data.internship_details[i].id+'" onclick="internship_details('+data.internship_details[i].id+')">'
							        verticalViewData += '<div class="col-md-12">'
							        verticalViewData += '<table><tr><td class="tdwidth1">Candidate Name</td><td class="tdwidth2">:</td><td class="tdwidth3"><b>'+data.internship_details[i].candidate_name+'</b></td></tr>';
							        verticalViewData += '<tr><td class="tdwidth1">Training Name</td><td class="tdwidth2">:</td><td class="tdwidth3"><b> <b>'+data.internship_details[i].training_name+'</b></td></tr>';
							        verticalViewData += '<tr><td class="tdwidth1">Reporting Authority </td><td class="tdwidth2">:</td><td class="tdwidth3"><b> <b>'+data.internship_details[i].name+'</b></td></tr>';
							        verticalViewData += '<tr><td class="tdwidth1">Convert As Employee</td><td class="tdwidth2">:</td><td class="tdwidth3"><b> <b>'+employe_status+'</b></td></tr></table>';
							        verticalViewData += '</div>'
							        verticalViewData += '</div>'
							}
						}
						else { $('#inernship_data option[value='+0+']').attr('selected','selected'); verticalViewData="<p class='nodata_text'>No Data Available </p>"}
					}
					else { $('#inernship_data option[value='+0+']').attr('selected','selected'); verticalViewData="<p class=' nodata_text'>No Data Available </p>"}
					
					 $('#internship_details_view').html(verticalViewData);
				},
			})	
}

$('#inernship_data').change(function(){                         //search functio
	var search_id=$('#inernship_data option:selected').val()
	$('.EmployeeCard').hide()
	if(search_id>0)
	{
	    $('.search_'+search_id).show()
	    $('#'+search_id).addClass('custom_dev_acitve');
	}
	else { $('.EmployeeCard').show(); $('.EmployeeCard').removeClass('custom_dev_acitve'); }
		
});

function internship_details(id)           // row click function
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
					url: '/internship_details_view/',
					data : {'selected_id':update_id,csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()},
					success: function (json_data){
						var internship_data=json_data.selected_internship_details;
						if(internship_data.length>0)
						{  
							$('#organization').val(internship_data[0]['org_id']).trigger('change'); $('#org_unit').val(internship_data[0]['org_unit_id']).trigger('change');
							$('#division').val(internship_data[0]['division_id']).trigger('change'); $('#candidate_name').val(internship_data[0]['cadidate_name']);
							$('#institute_name').val(internship_data[0]['institute_name']); $('#degree').val(internship_data[0]['degree']);
							$('#year_of_passing').val(internship_data[0]['passed_out_year']); $('#country').val(internship_data[0]['country_id']).trigger('change')
						    $('#state').val(internship_data[0]['state_id']).trigger('change');  $('#zip').val(internship_data[0]['zip_code']);
							$('#address').val(internship_data[0]['address']);$('#training_end_date').val(internship_data[0]['end_date']);
							$('#training_type').val(internship_data[0]['training_type']); $('#training_start_date').val(internship_data[0]['start_date']);
							$('#training_name').val(internship_data[0]['training_id']).trigger('change'); $('#training_authority').val(internship_data[0]['reporting_authority_id']).trigger('change');
							if(internship_data[0]['employee_status']==true)
							{
								form_button_show('update')
							}
							else { form_button_show('con_to_emp')    }
						}
					},
				})
	}
}

function internship_form_update() { internship_form_submit()  }   //update function
function internship_remove_confirmation() {  removeConfirmation('internship_remove',update_id,'Training'); } //remove confirmation function
function internship_remove()
{
	if(update_id!='')
	{
	   var load_data={"remove_id":update_id,csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()}	
	   send_data('GET',"/internship_form_delete/",load_data);
	}
}

function convert_employee_confirmation() { Confirmation('convert_to_employee',update_id,$('#candidate_name').val());}
function convert_to_employee()                 //convert candidate to employee
{
	if(update_id!='')
	{
	   var load_data={"selected_id":update_id,csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()}	
	   send_data('GET',"/internship_form_delete/",load_data);
	   var current_url=window.location.href
	   url_split=current_url.split('/internship/')
	   redirect_url=url_split[0]
	   employee_page=redirect_url+"/hrms_employee/"
	   location.href=employee_page
	}
}

function internship_form_cancel()
{
	document.forms['internship_training_form'].reset();
	$("#training_name,#organization,#org_unit,#country,#division,#state,#training_authority").attr("data-placeholder","Select");
	$("#training_name,#organization,#org_unit,#country,#division,#state,#training_authority").select2();	
	$("#training_name,#organization,#org_unit,#country,#division,#state,#training_authority").val('0').trigger('change')
	$('.errormessage').html('')
	form_button_show('add');
	$('.EmployeeCard').removeClass('custom_dev_acitve');
	update_id=''
}

function internship_cancel_confirmation() {  orgClearFuncton('internship_form_cancel','Cancel','Internship Detail'); } //remove confirmation function


function form_button_show(flag) //   button create
{   
	$("#internship_btn_div").empty();
	if (flag=='add')
	{ 
		var btnstr = '<button type="button" class="btn btn-success btn-eql-wid btn-animate margin-right-3" id="internship_form_save" onclick="internship_form_submit();">Add</button>';
	}
	else
	{  
		var btnstr= '<button type="button" class="btn btn-primary btn-eql-wid btn-animate margin-right-3" id="internship_form_updates" onclick="internship_form_update()";><i class="fa fa-green"></i> Update</button>';
		if(flag=='con_to_emp')
		{
		btnstr += '<button type="button" class="btn btn-success btn-eql-wid btn-animate margin-right-3" id="convert_to_employee" onclick="convert_employee_confirmation();">Convert As Employee</button>';
		}
		btnstr += '<button type="button" class="btn btn-danger btn-eql-wid btn-animate margin-right-3" id="internship_form_delete" onclick="internship_remove_confirmation();">Remove</button>';
	}
	btnstr += '<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-3" id="internship_form_clear" onclick="internship_cancel_confirmation();">Cancel / Clear</button>';
	$("#internship_btn_div").append(btnstr);	
}

function Confirmation(func_name, action_name, title) {
	var title = title == undefined ? '' :title;
	$('.popup_zindex').css({'z-index':'unset'});//search select btn zindex
	swal ({
		title: "Are you sure, you want to convert candidate ("+title+") to employee ?",
		type: "warning",
		showCancelButton: true,
		confirmButtonClass: "btn btn-success btn-eql-wid btn-animate pull-left",
		cancelButtonClass: "btn btn-danger btn-eql-wid btn-animate pull-right",
		confirmButtonText: "Yes",
		cancelButtonText: "No",
		showConfirmButton : true,
		closeOnConfirm: true,
		closeOnCancel: true
	},
	function(isConfirm) {
		if (isConfirm) {
			if (action_name) {
				window[func_name](action_name);
			} else {
				window[func_name]();
			}
		} 
	});
}

$('#internship_training_form').submit(function(e) {  //form validation
	e.preventDefault();
}).validate({
	rules: {
		candidate_name: { required: true, }, institute_name : { required: true },zip: { required: true, },state: { valueNotEquals:true, },
		degree : { required: true },year_of_passing : { required: true },	address : { required: true },
		organization: { valueNotEquals:true, },country: { valueNotEquals:true, },
		org_unit: { valueNotEquals:true, },division: { valueNotEquals:true, },training_name: { valueNotEquals:true, },
		training_authority: { valueNotEquals:true, },
	},
	//For custom messages
	messages: {
		candidate_name: { required: "Candidate name is required", },institute_name: { required: "Institute name is required", },
		degree: { required: "Degree is required", },year_of_passing: { required: "Year of passing is required", },
		zip: { required: "zip code is required", },address : { required: "Address is required", },
		country: { valueNotEquals: "Country is required", },		
		state: { valueNotEquals: "State is required", },organization: { valueNotEquals: "Organization is required", },
		org_unit: { valueNotEquals: "Organization unit is required", },training_name: { valueNotEquals: "Training name is required", },
		division: { valueNotEquals: "Division is required", },training_authority: { valueNotEquals: "Training authority is required", },
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
function internship_training_form_validation() {  return $('#internship_training_form').valid(); }
//text-validation

function allow_numeric(val,id)
{   
	var isnum = /^\d+$/.test(val);   //allow only numeric
	 if (isNaN(val)) {   $('#'+id).val('')     }  
}