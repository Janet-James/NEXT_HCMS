var clicked_row_id=''; 
var org_list=[]
var division_list=[]
$('#organization_unit').change(function(){
	var selected_org_unit=$('#organization_unit').val();
	if(selected_org_unit!=null)
	{   
		$.ajax({
			type:'GET',
			url: '/shift/division_fetch/',
			async : false,
			data  : { 'str_org_unit_id':JSON.stringify(selected_org_unit)},
			success: function (json_data){
				var data=json_data
				var id_list=[]
				$('#division').html('')
				if(data)
				{
					var data_len=data.division.length;
					if(data_len>=1)
					{  
						for(var i=0;i<data_len;i++)
						{   
							$('#division').append($('<option>', {
			                    value : data.division[i].id,
			                    text : data.division[i].name,
			                }));
							id_list.push(data.division[i].id)
						}
						if(clicked_row_id=='')
						{
						    $('#division').val(id_list)
						}
						else
						{
						    $('#division').val(division_list)
						}
					}
					else{ $('#division').html('') }
				}
				else{ $('#division').html('') }
			},
		})	
	} else {  $('#division').html('') }
	
});
function button_show(action_name){
    $("#shift_master_button").html('');
    var btnstr = '';
    var access_for_create = jQuery.inArray( "Work Time Management", JSON.parse(localStorage.Create) );
    var access_for_write = jQuery.inArray( "Work Time Management", JSON.parse(localStorage.Write) );
    var access_for_delete = jQuery.inArray( "Work Time Management", JSON.parse(localStorage.Delete) );
    if (action_name == 'add') {
        if (access_for_create != -1){
            btnstr += '<button type="button" class="btn btn-success btn-eql-wid btn-animate margin-right-3" id="shift_save" onclick="shift_master_save();">Add</button>';
        }
        btnstr += '<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-3" id="shift_clear" onclick="shift_master_cancel();">Cancel / Clear</button>';
    } else if (action_name == 'update') {
        if (access_for_write != -1){
            btnstr += '<button type="button" class="btn btn-primary btn-eql-wid btn-animate margin-right-3" id="shift_updates" onclick="shift_master_update()"";><i class="fa fa-green"></i> Update</button>';
        }
        if (access_for_delete != -1){
            btnstr +=  '<button type="button" class=" btn btn-danger btn-eql-wid btn-animate margin-right-3" id="shift_delete" onclick="shift_master_remove_confirmation();">Remove</button>';
        }
        btnstr += '<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-3" id="shift_clear" onclick="shift_master_cancel();">Cancel / Clear</button>';
    }
    $("#shift_master_button").append(btnstr);
}

function shift_master_save()
{    
	 var str_organization_unit=$('#organization_unit').val(); var str_organization=$('#organization option:selected').val(); var str_shift_name=$('#shift_name').val();
	 var division=$('#division').val(); 
	 var str_shift_description=$('#shift_description').val();  var str_shift_start=$('#shift_start').val();
	 var str_shift_end=$('#shift_end').val();  var str_work_half_day=$('#work_half_day').val();
	 var str_work_full_day=$('#work_full_day').val();  
	 var status = shift_master_form_validation();
	 var shift_active;
	 if ($('input[name="shift_active"]').is(':checked') ) { shift_active='True'  } 
	 else { shift_active='False' }
	 var schedule_data=schedule_table();
	 if(status && str_organization!='0')
 	 {  
		   var schedule_data=schedule_table();
		   var load_data={"organization_unit":str_organization_unit,'shift_name':str_shift_name,'shift_active':shift_active,
	    			'shift_description':str_shift_description,'shift_start':str_shift_start,'shift_end':str_shift_end,
	    			'work_half_day':str_work_half_day,'work_full_day':str_work_full_day,
	    			'organization':str_organization,'division':division,
	    			'clicked_row_id':clicked_row_id, 'schedule_details':JSON.stringify(schedule_data),'division':JSON.stringify(division),'organization_unit':JSON.stringify(str_organization_unit),csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()}
		   send_data('post',"/shift/shift_master_save/",load_data)
	 }
	 else  {  alert_lobibox("info","Fill all the fields");  }
}

function shift_details()  // shift details table show function
{   
	$.ajax({
				type:'GET',
				url: '/shift/shift_details/',
				data  : { csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()},
				success: function (json_data){
					var columns = [{"title":"hidden Id","visible": false},{"title":"No."},{"title":"Organization Name"},{"title":"WorkTime"}, {"title":"Start Time"}, {"title":"End Time"},{"title":"WorkTime Status"}]
					var data=json_data.shift_data;
					var data_list=[]
					if(data.length>0)
					{   
						var data_len=data.length
						for(var i=0;i<data_len;i++)
						{    
							 if(data[i].shift_active==true)
							 {
								 active_status='Active'
							 }
							 else
							 {
								 active_status='In-Active'
							 }
							 data_list.push([data[i].id,i+1,data[i].org_name,data[i].shift_name,data[i].shift_start_time,data[i].shift_end_time,active_status]);
						}
					     plaindatatable_btn('shift_master_table', data_list, columns,[],'NEXT_TRANSFORM_HCMS_DOW_EMPLOYEE_WORKTIME_DETAILS_'+current_date)
   					}
					else {  plaindatatable_btn('shift_master_table', data_list, columns,[],'NEXT_TRANSFORM_HCMS_DOW_EMPLOYEE_WORKTIME_DETAILS_'+current_date); }
				},
			})	
}
//row clcik in datatable
$('#shift_master_table').on('click', 'tbody tr', function(){
	$('.errormessage').html('');
    var arr=$('#shift_master_table').dataTable().fnGetData($(this)); 
    clicked_row_id=arr[0];
    dataTableAcitveRowAdd('shift_master_table',$(this).index());
    if(clicked_row_id!='')
    {    
    	document.forms['shift_master_form'].reset();
    	 $.ajax({
    					type:'POST',
    					url: '/shift/fetch_shift_details/',
    					data  : { 'shift_id':clicked_row_id,csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()},
    					success: function (json_data){
    						var data=json_data.fetch_data
    						var division_data=json_data.division_details
    				        org_list=[]
    						division_list=[]
    						if(division_data.length>0)
    						{
	    						for (var i=0;i<division_data.length;i++)
	    						{   
	    							division_list.push(division_data[i].division_id)
	    						}
    						}
    						if(data.length>0)
    						{   
    							for (var i=0;i<data[0].shift_orgunit_ids.length;i++)
        						{
        							org_list.push(data[0].shift_orgunit_ids[i])
        						}
    							$('#shift_name').val(data[0].shift_name); $('#shift_description').val(data[0].shift_description);
    							$('#shift_start').val(data[0].shift_start_time); $('#shift_end').val(data[0].shift_end_time);
    							$('#work_half_day').val(data[0].shift_half_day_time); $('#work_full_day').val(data[0].shift_full_day_time);
    							$('#organization').val(data[0].shift_org_id).trigger("change"); 
    							$('#organization_unit').val(org_list).trigger("change"); 
    							$('#division').val(division_list).trigger("change");
    							button_show('update')
    							if(data[0].shift_active==true)
    		 				    {
    		 				    	 document.getElementById("shift_active").checked = true;
    		 				    }
    		 				    else 
    		 				    {
    		 				    	 document.getElementById("shift_active").checked = false;
    						    }
    						
	    						if(data[0].weekend_data)
	    						{   
		    						var csv=data[0].weekend_data;
		    						var result= csv.split(',');
		    						for(var i=0;i<result.length;i++)
		    						{
		    							 $('#schedule_table tbody tr').each(function(row, tr){
		    								 $('tr').find('input[id='+result[i]+']').prop('checked', true)
		    							});
		    						}
	    						}
	    						else
	    						{
	    							 $('#schedule_table tbody tr').each(function(row, tr){
	    								 $('tr').find('.day_check').prop('checked', false);
	    							});
	    						}
    						}
    						else { shift_master_cancel(); clicked_row_id=''; alert_lobibox("info","Data cannot be fetched"); }
    						$(".date_input_class").trigger('change');
    					},
    				})	
    }
});
function shift_master_update() { shift_master_save(); } //update function
function shift_master_remove_confirmation() { removeConfirmation('shift_master_remove',clicked_row_id,$('#shift_name').val()); } //remove confirmation function
function shift_master_remove()
{
	if(clicked_row_id!='')
	{
	   var load_data={"remove_id":clicked_row_id,csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()}	
	   send_data('post',"/shift/shift_master_remove/",load_data);
	}
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
					if(json_data.status=='NTE_01'){ alert_lobibox("success", sysparam_datas_list[json_data.status]); shift_master_cancel(); shift_details(); clicked_row_id=''}
					else if(json_data.status=='NTE_02'){ alert_lobibox("error", sysparam_datas_list[json_data.status]); shift_master_cancel(); }
					else if(json_data.status=='NTE_03'){ alert_lobibox("success", sysparam_datas_list[json_data.status]); shift_master_cancel(); shift_details(); clicked_row_id=''}
					else if(json_data.status=='NTE_04'){ alert_lobibox("success", sysparam_datas_list[json_data.status]); shift_master_cancel(); shift_details(); clicked_row_id=''}
					else if(json_data.status=='001'){ alert_lobibox("info","Session Expired");}
					else if(json_data.status=='NTE-01')
					{   
						var data=json_data.insert_exsist_data
						var exsist_division_list=[]
						var content=''
						if(data.length>0)
						{
							for(var i=0;i<data.length;i++)
							{
								exsist_division_list.push(data[i].rel_id)
								content+=data[i].name+','
							}
						}
						Confirmation('exsist_insert',exsist_division_list ,content);
					}
					else{ alert_lobibox("error", sysparam_datas_list["ERR0034"]); }
				},
			})	
}

function exsist_insert(exsist_division_list)
{   
	 var str_organization_unit=$('#organization_unit').val(); var str_organization=$('#organization option:selected').val(); var str_shift_name=$('#shift_name').val();
	 var division=$('#division').val(); 
	 var str_shift_description=$('#shift_description').val();  var str_shift_start=$('#shift_start').val();
	 var str_shift_end=$('#shift_end').val();  var str_work_half_day=$('#work_half_day').val();
	 var str_work_full_day=$('#work_full_day').val();  
	 var status = shift_master_form_validation();
	 var shift_active;
	 if ($('input[name="shift_active"]').is(':checked') ) { shift_active='True'  } 
	 else { shift_active='False' }
	 var schedule_data=schedule_table();
	 if(status && str_organization!='0' && exsist_division_list!='')
	 {  
		   var schedule_data=schedule_table();
		   var load_data={"organization_unit":str_organization_unit,'shift_name':str_shift_name,'shift_active':shift_active,
	    			'shift_description':str_shift_description,'shift_start':str_shift_start,'shift_end':str_shift_end,
	    			'work_half_day':str_work_half_day,'work_full_day':str_work_full_day,
	    			'organization':str_organization,'division':division,'exsist_division_rel_id':JSON.stringify(exsist_division_list),
	    			'clicked_row_id':clicked_row_id, 'schedule_details':JSON.stringify(schedule_data),'division':JSON.stringify(division),'organization_unit':JSON.stringify(str_organization_unit),csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()}
		   send_data('post',"/shift/exsist_data_insert/",load_data)
	 }
	 else  {  alert_lobibox("info","Fill all the fields");  }
}
function schedule_table()
{    
	var schedule_data=[]
	var schedule_table= document.getElementById('schedule_table');
	 $('input:checkbox:checked', schedule_table).each(function() {
		if($(this).val()!=1)
		{
		 schedule_data.push($(this).val());
		}
		}).get();
	return schedule_data
}

function Confirmation(func_name, action_name, title) {
	var title = title == undefined ? '' :title;
	$('.popup_zindex').css({'z-index':'unset'});//search select btn zindex
	swal ({
		title: "The following division are already have schedule ("+title+") Click process for update or Remove the listed division then insert ?",
		type: "warning",
		showCancelButton: true,
		confirmButtonClass: "btn btn-success btn-eql-wid btn-animate pull-left",
		cancelButtonClass: "btn btn-danger btn-eql-wid btn-animate pull-right",
		confirmButtonText: "Process",
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
