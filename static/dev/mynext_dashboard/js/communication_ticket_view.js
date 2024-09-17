$(document).ready(function(){
	today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();
	if(dd<10) {  dd = '0'+dd } 
	if(mm<10) { mm = '0'+mm 	} 
	today = dd + '-' + mm + '-' + yyyy;
});

$('#othr_ser_call').click(function(){ communication_ticket_details(); })
$('#acc_ctl').click(function(){ hcms_employee_view(); form_button_show('add'); def_cat_form_view(); $('.errormessage').html('') })
//$('#sla_cnf_cancel').click(function(){ sla_group_clear(); })

$('#acc_ctl_save').click(function(){
	var role = $("#acc_ctl_role").val()
	var group = $("#acc_ctl_group").val()
	var status=as_setup_form_validation()
	if(role!='' && group!=null && status){
	$.ajax({
		type:'POST',
		url: '/access_control_save/',
		async : false,
		data  : {'role':JSON.stringify(role),'group':JSON.stringify(group),csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()},
		success: function (json_data){
			var data = json_data
			if(data.status=='1'){alert_lobibox("success", "Details Added Successfully")
				$("#acc_ctl_role").val(0).trigger('change')
				$("#acc_ctl_group").val(0).trigger('change')
			}
			else{alert_lobibox("info", "Details Not Created/Updated")}
		}
})
	}
	else{ alert_lobibox("info", "Fill in All the Mandatory Fields")	}
})

//Access setup Form validation
$('#as_setup_form').submit(function(e) {
	e.preventDefault();
}).validate({
	rules: {
		acc_ctl_role: { valueNotEquals:true, },
		acc_ctl_group: { valueNotEquals:true, },
	},
	//For custom messages
	messages: {
		acc_ctl_role: { valueNotEquals: "The Group is required", },
		acc_ctl_group: { valueNotEquals: "The Employee is required", },
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
function as_setup_form_validation() { return $('#as_setup_form').valid(); }

function asc_ctrl_cancel_confirmation() 
{  
	if($("#acc_ctl_role option:selected").val()==0 || $("#acc_ctl_role option:selected").val()=='')
	{
		orgClearFuncton('asc_ctrl_cancel','Cancel','Access Setup Configuraion');
	}
	else
	{
		orgClearFuncton('asc_ctrl_cancel','Cancel',$("#acc_ctl_role option:selected").text()+' Group Access Setup Configuraion');
	}
} 

function sla_cancel_confirmation() 
{   
	if($("#sla_conf_grp option:selected").val()==0 || $("#sla_conf_grp option:selected").val()=='')
	{
		orgClearFuncton('sla_group_clear','Cancel','SLA Configuraion');
	}
	else
	{
		orgClearFuncton('sla_group_clear','Cancel',$("#sla_conf_grp option:selected").text()+' Group SLA Configuraion');
	}
} 


function asc_ctrl_cancel(){
	
	$("#acc_ctl_role").val(0).trigger('change')
	$("#acc_ctl_group").val(0).trigger('change')
	$('.errormessage').html('')
}

$("#acc_ctl_role").on('change', function(){
	var role = $("#acc_ctl_role").val()
	if(role>0){
		$('.errorTxts1').html('')
		$.ajax({
			type:'POST',
			url: '/access_control_view/',
			async : false,
			data  : {'role':role,csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()},
			success: function (json_data){
				var data = json_data
				if(data.data.length>0){
					$("#acc_ctl_group").val(data.data[0].role).trigger('change')
				}
				else{$("#acc_ctl_group").val(0).trigger('change') }
			}
		})
	}
})

$("#acc_ctl_group").on('change', function(){
	var employee = $("#acc_ctl_group").val()
	if(employee>0){
		$('.errorTxts2').html('')
	}
})

function hcms_employee_view(){
	$.ajax({
		type:'GET',
		url: '/hcms_role_view/',
		async : false,
		data  : {},
		success: function (json_data){
			var data = json_data
			$('#acc_ctl_group').html('')
			$('#acc_ctl_group').append($('<option>', {
				value :'',
				text :''
			}));
			if(data.status=='1'){
				len = data.data.length
				if(len>0){  
					for(var i=0;i<len;i++){  
						$('#acc_ctl_group').append($('<option>', {
							value : data.data[i].id,
							text : data.data[i].employee_name,
						}));
					}
					//process_matrix_task(project_id)
				}
				else{
					$('#acc_ctl_group').append($('<option>', {
						value :'0',
						text :'Role Not Found'
					}));
				}
			}
		}
	})
}



$('#sla_cnf_save').click(function(){
	var result = sla_cong_form_validation()
	var group = $("#sla_conf_grp").val()
	var timetap1 = $("#timetap1").val()
	var timetap2 = $("#timetap2").val()
	var timetap3 = $("#timetap3").val()
	if(result==true){
	$.ajax({
		type:'POST',
		url: '/sla_config_save/',
		async : false,
		data  : {'group':JSON.stringify(group),'timetap1':JSON.stringify(timetap1),'timetap2':JSON.stringify(timetap2),'timetap3':JSON.stringify(timetap3),csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()},
		success: function (json_data){
		var data = json_data
		if(data.status=='1'){alert_lobibox("success", "Details Added Successfully")
			sla_group_clear()
			}
		else{alert_lobibox("info", "Details Not Created/Updated")}
		}
})
	}
})

$("#sla_conf_grp").on('change', function(){
   var group = $("#sla_conf_grp").val()
   if(group>0){
	   $(".errorTxt0").html('')
	   $.ajax({
			type:'POST',
			url: '/sla_config_view/',
			async : false,
			data  : {'group':group,csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()},
			success: function (json_data){
			var data = json_data
			if(data.data.length>0){
			$("#timetap1").val(data.data[0].timelap1)
			$("#timetap2").val(data.data[0].timelap2)
			$("#timetap3").val(data.data[0].timelap3)
			$(".errorTxt1,.errorTxt2,.errorTxt3").html('')
			}
			else{
				$("#timetap1").val('')
				$("#timetap2").val('')
				$("#timetap3").val('')}
			}
	   })
//	    $('.errormessage').html('')
   }else{alert_lobibox("error", "Select Group")
	   $("#timetap1").val('')
		$("#timetap2").val('')
		$("#timetap3").val('')}
 })

 function sla_group_clear(){
	$('.errormessage').html('')
	$("#sla_conf_grp").val(0)
	$("#timetap1").val('')
	$("#timetap2").val('')
	$("#timetap3").val('')
}

//SLA Form validation
$('#sla_cong_form').submit(function(e) {
	e.preventDefault();
}).validate({
	rules: {
		sla_conf_grp: { valueNotEquals:true, },
		timetap1: { valueNotEquals:true, },
		timetap2: { valueNotEquals:true, },
		timetap3: { valueNotEquals:true, },
	},
	//For custom messages
	messages: {
		sla_conf_grp: { valueNotEquals: "The Group is required", },
		timetap1: { valueNotEquals: "The Timelap -1 is required", },
		timetap2: { valueNotEquals: "The Timelap -2 is required", },
		timetap3: { valueNotEquals: "The Timelap -3 is required", },
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
function sla_cong_form_validation() { return $('#sla_cong_form').valid(); }
                      
                   // default configuration
var clicked_row_id=''
function def_cat_save()
{
	var group_id = $("#ce_group option:selected").val()	
	var category=  $("#category").val()
	var status=def_cat_form_validation()
	if(group_id!=0 && category!='' && status)
	{
	   var load_data={"group_id":group_id,'category':category,'update_id':clicked_row_id,csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val() }
	   send_data('post',"/def_cat_save/",load_data)
	}
	else{  alert_lobibox("info", "Fill in All the Mandatory Fields");  }
}

$('#ce_group').on('change', function(){
	   var group = $("#ce_group").val()
	   if(group>0){
		   $('.errorTxtc1').html('')
	   }
});
//default cat Form validation
$('#def_cat').submit(function(e) {
	e.preventDefault();
}).validate({
	rules: {
		ce_group: { valueNotEquals:true, },
		category: { required:true, },
	},
	//For custom messages
	messages: {
		ce_group: { valueNotEquals: "The Group is required", },
		category: { required: "The Category is required", },
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
function def_cat_form_validation() { return $('#def_cat').valid(); }

function def_cat_update() { def_cat_save(); } //update function 


function def_cat_remove_confirmation() 
{  
	if($("#ce_group option:selected").val()==0 || $("#ce_group option:selected").val()=='')
	{
		removeConfirmation('category_remove',clicked_row_id,'Category Configuraion'); 
	}
	else
	{   
		removeConfirmation('category_remove',clicked_row_id,$("#ce_group option:selected").text()+' Group Category Configuraion');
	}
	
} 
function category_remove()
{
	if(clicked_row_id!='')
	{
	   var load_data={"remove_id":clicked_row_id,csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()}	
	   send_data('post',"/def_cat_delete/",load_data);
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
					if(json_data.status=='NTE_01'){ alert_lobibox("success", sysparam_datas_list[json_data.status]); def_cat_cancel(); def_cat_form_view();}
					else if(json_data.status=='NTE_02'){ alert_lobibox("error", sysparam_datas_list[json_data.status]); def_cat_cancel(); }
					else if(json_data.status=='NTE_03'){ alert_lobibox("success", sysparam_datas_list[json_data.status]); def_cat_cancel(); def_cat_form_view(); }
					else if(json_data.status=='NTE_04'){ alert_lobibox("success", sysparam_datas_list[json_data.status]); def_cat_cancel(); def_cat_form_view();}
					else if(json_data.status== 1 ){ alert_lobibox("info",json_data.data[0]['query']+'  Category is Already Allocated To Group  '+json_data.data[0]['service_group']);}
					else if(json_data.status=='001'){ alert_lobibox("info","Session Expired");}
					else{ alert_lobibox("error", sysparam_datas_list["ERR0034"]); }
				},
			})
}
var columns = [{"title":"hidden Id","visible": false},{"title":"hidden Id","visible": false},{"title":"No."}, {"title":"Group"},{"title":"Category"}]

function def_cat_form_view()
{  
	$.ajax(
	{
	 type:"GET",
	 url: "/def_cat_view/",
	 data:{ csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val() },
	 success: function (json_data) 
	 {   
		var data_value=json_data.def_cat_data
	    data_list = [];
		var group=''
	    for (var i=0; i<data_value.length; i++){
	       if(data_value[i].service_call_group=='1')
	       {
	    	   group='HCM'
	       }
	       else if(data_value[i].service_call_group=='2')
	       {
	    	   group='PMO'
	       }
	       else if(data_value[i].service_call_group=='3')
	       {
	    	   group='General Service'
	       }
	       else { group='No Group'  }
		   data_list.push([data_value[i].id,data_value[i].service_call_group,i+1,group,data_value[i].query ]);
	    }
	plaindatatable_btn('default_category_table', data_list, columns,[],'NEXT_TRANSFORM_HCMS_DEFAULT_CATEGORY_'+today)	
	 },
	})	
}
//row clcik in datatable
$('#default_category_table').on('click', 'tbody tr', function(){
	$('.errormessage').html('');
	var form_table = $('#default_category_table').DataTable();
	if ( ! form_table.data().count() ) {
		alert_lobibox("info", 'No Data Available in Table');
	}
	else 
	{
		var arr=$('#default_category_table').dataTable().fnGetData($(this)); 
		clicked_row_id=arr[0];
		$("#ce_group").val(arr[1]).trigger('change')	
		$("#category").val(arr[4])	
		form_button_show('update')
	}
});

function cancel_confirmation() 
{  
	if($("#ce_group option:selected").val()==0 || $("#ce_group option:selected").val()=='')
	{
		orgClearFuncton('def_cat_cancel','Cancel','Category Configuraion');
	}
	else
	{
		orgClearFuncton('def_cat_cancel','Cancel',$("#ce_group option:selected").text()+' Group Category Configuraion');
	}
} //remove confirmation function

function def_cat_cancel()
{
	form_button_show('add')
	$("#ce_group").val(0).trigger('change')		
	$("#category").val('')
	$(".errormessage").html('')
	clicked_row_id=''
}
function form_button_show(flag) //   button create
{   
	$("#def_cat_btn").empty();
	if (flag=='add')
	{ 
		var btnstr = '<button type="button" class="btn btn-success btn-eql-wid btn-animate margin-right-3" id="training_form_save" onclick="def_cat_save();">Add</button>';
	}
	else
	{  
		var btnstr= '<button type="button" class="btn btn-primary btn-eql-wid btn-animate margin-right-3" id="training_form_updates" onclick="def_cat_update()"";><i class="fa fa-green"></i> Update</button>';
		btnstr += '<button type="button" class="btn btn-danger btn-eql-wid btn-animate margin-right-3" id="training_form_delete" onclick="def_cat_remove_confirmation();">Remove</button>';
	}
	btnstr += '<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-3" id="training_form_clear" onclick="cancel_confirmation();">Cancel / Clear</button>';
	$("#def_cat_btn").append(btnstr);	
}