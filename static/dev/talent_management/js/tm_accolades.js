var tab_name = '';
var tech_data = '';
var func_data = '';
var behav_data = '';
var  accol_click_id = '';
//21-SEP-2018 || KAV || Document Ready function for Accolades
$(document).ready(function(){
	$("#tm_accolades_sel_org").select2({
		placeholder: "-Select Organization-",
		width: '100%',
	});
	$("#tm_accolades_sel_org_unit").select2({
		placeholder: "-Select Org. Unit-",
		width: '100%',
	});
	$("#tm_accolades_sel_dept").select2({
		placeholder: "-Select Division-",
		width: '100%',
	});
	$("#modal_accol_year").select2({
		placeholder: "-Select Year-",
		width: '100%',
	});
	$("#modal_accol_employee").select2({
		placeholder: "-Select Employee-",
		width: '100%',
	});
});

//22-May-2018 || MST || Asset Details ADD and Update form validation
var $validator = $('#add_new_accolades').validate({
	rules: {
		
		modal_accol_employee:{
			required: true,
		},
		modal_accol_year: {
			required: true,
		},
		modal_accol_title: {
			required: true,
		},
		modal_accol_awarded_by:{
			required: true,
		},
	},
	//For custom messages
	messages: {
		
		modal_accol_employee:{
			required:"Select Employee",
		},
		modal_accol_year:{
			required:"Select Year",
		},
		modal_accol_title:{
			required:"Enter Title",
		},
		modal_accol_awarded_by:{
			required:"Enter Awarded By",
		},
	},
	errorElement: 'div',
	errorPlacement: function(error, element) {
		var placement = $(element).data('error');
		if (placement) {
			$(placement).append(error);
		} else {
			error.insertAfter(element);
		}
	}
});

//21-SEP-2018 || KAV || Organization - On select function
function get_org_unit_list(org_id){
	$('#tm_accolades_sel_org_unit').empty().append($('<option>',{
		value:'',
		text:'-Select Org. Unit-',
		hidden:'hidden',
	}));
	$.ajax({
		type: 'POST',
		url: '/tm_org_unit/',
		timeout : 10000,
		data: {
			'org_id': org_id,
		},
		async: false,
	}).done(function(json_data){
		data = JSON.parse(json_data);

		if (data.sel_org_unit != undefined){
			if (data.sel_org_unit.length > 0){
				$('#tm_accolades_sel_org_unit').prop("disabled",false);
				for(i=0;i<data.sel_org_unit.length;i++)
				{
					$('#tm_accolades_sel_org_unit').append($('<option>',{
						value:data.sel_org_unit[i].id,
						text:data.sel_org_unit[i].orgunit_name
					}))
				}
			} else {
				$('#tm_accolades_sel_org_unit').prop("disabled",true);
			}
		}
	})
}

//21-SEP-2018 || KAV || Division - On select function
function get_division_list(org_unit_id){
	var org_id = $('#tm_accolades_sel_org').val();
	if (org_unit_id != null){
		$('#tm_accolades_sel_dept').empty().append($('<option>',{
			value:'',
			text:'-Select Division-',
			hidden:'hidden',
		}));
		$.ajax({
			type: 'POST',
			url: '/tm_division/',
			timeout : 10000,
			data: {
				'org_id': org_id,
				'org_unit_id': org_unit_id,
			},
			async: false,
		}).done(function(json_data){
			data = JSON.parse(json_data);
			if (data.sel_division != undefined){
				if (data.sel_division.length > 0){
					$('#tm_accolades_sel_dept').prop("disabled",false);
					for(i=0;i<data.sel_division.length;i++)
					{
						$('#tm_accolades_sel_dept').append($('<option>',{
							value:data.sel_division[i].id,
							text:data.sel_division[i].name
						}))
					}
				} else {
					$('#tm_accolades_sel_dept').prop("disabled",true);
				}
			}
		});
	} else {
		$('#tm_accolades_sel_dept').prop("disabled",true);
	}
}

//26-SEP-2018 || KAV || Employee List - On select function
function get_emp_list(division_id){
	accol_details_fetch();
	var org_id = $('#tm_accolades_sel_org').val();
	var org_unit_id = $('#tm_accolades_sel_org_unit').val();
	if (division_id != null){
		$('#modal_accol_employee').empty().append($('<option>',{
			value:'',
			text:'-Select Employee-',
			hidden:'hidden',
		}));
		$.ajax({
			type: 'POST',
			url: '/tm_employee_list/',
			timeout : 10000,
			data: {
				'org_id': org_id,
				'org_unit_id': org_unit_id,
				'division_id': division_id,
			},
			async: false,
		}).done(function(json_data){
			data = JSON.parse(json_data);
			if (data.sel_employee != undefined){
				if (data.sel_employee.length > 0){
					$('#modal_accol_employee').prop("disabled",false);
					for(i=0;i<data.sel_employee.length;i++)
					{
						$('#modal_accol_employee').append($('<option>',{
							value:data.sel_employee[i].id,
							text:data.sel_employee[i].full_name
						}))
					}
				} else {
					$('#modal_accol_employee').prop("disabled",true);
				}
			}
		});
	} else {
		$('#modal_accol_employee').prop("disabled",true);
	}
}

//26-SEP-2018 || KAV || Employee Year List - On select function
$("#modal_accol_employee").change(function(){
	accolades_emp_year();
});

//26-SEP-2018 || KAV || Accolades Awarded By - On select function
$("#tm_accolades_sel_org").change(function(){
	 var org_name = $("#tm_accolades_sel_org").text()
	 org_name = $.trim(org_name);
	$("#modal_accol_awarded_by").val(org_name)
});

//27-SEP-2018 || KAV || Accolades Year - On select function
function accolades_emp_year()
{
	var emp_id = $("#modal_accol_employee").val()
	$.ajax({
		type: 'POST',
		url: '/tm_compt_emp_year/',
		timeout : 10000,
		data: {
			'emp_id': emp_id,
		},
		async: false,
	}).done(function(json_data){
		data = JSON.parse(json_data);
		$("#modal_accol_year").empty().append($('<option>',{
			value:'',
			text:'-Select Year-',
			hidden:'hidden',
		}));
		
		for( let i=data.total_years; i>0; i--){
			var joining_year = data.joining_year+i;
			$('#modal_accol_year').append($('<option>',{
                value:joining_year,
                text:joining_year
            }))
		}
	});
}

//21-SEP-2018 || KAV || Add New Button Click Function
function btn_add_click()
{
	var accol_insert_id = null;
	$(".modal-footer").innerHTML="";
	var btn_draw = '';
	btn_draw = '<button class="btn btn-success btn-eql-wid btn-animate save_submit_modal" id="save_submit_modal">Save</button><button class="btn btn-warning btn-eql-wid btn-animate pull-right" onclick="cancel_clear_confirm(\''+"accol_cancel_clear"+'\')">Cancel / Clear</button>';
	$('.modal-footer').html(btn_draw);
	$("#myModal1").modal('show');
	$('.val_message').prop('style','display:none;');
	$("#save_submit_modal").click(function(){
		var title = $("#modal_accol_title").val();
		if(title == '')
		{
			$('.val_message').prop('style','display:block;');
		}
	    accolades_submit_modal(accol_insert_id)
	}); 
	accol_cancel_clear();
}

//26-SEP-2018 || KAV || Accolades Form Submit
function accolades_submit_modal(accol_id)
{
	var $valid = $('#add_new_accolades').valid();
	if ($valid){
		var accolades_form_data = getFormValues('#add_new_accolades');
		$.ajax({
			type : 'POST',
			url : "/tm_accolades_detail_submit/",
			timeout : 1000,
			data : {
				'accol_id':accol_id,
				'accolades_form_data':JSON.stringify(accolades_form_data),
			},
		}).done(function(json_data){
			var json_data = JSON.parse(json_data);
			if(json_data.status == 'NTE_01'){
				alert_lobibox("success", sysparam_datas_list[json_data.status]);    
				$("#myModal1").modal('hide');
				accol_cancel_clear();
				accol_details_fetch();
			} else if(json_data.status == 'NTE_03'){
				alert_lobibox("success", sysparam_datas_list[json_data.status]);   
				$("#myModal1").modal('hide');
				accol_details_fetch();
				accol_cancel_clear();
			} else {
				alert_lobibox("error", sysparam_datas_list[json_data.status]);  
				$("#myModal1").modal('hide');
				accol_cancel_clear();
			}
		});
	}
}

//26-SEP-2018 || KAV || Accolades Detail Fetch Function
function accol_details_fetch()
{
	$("#add_btns").innerHTML = "";
	var add_btn_draw = ''
		add_btn_draw += '<div id="add_btns">';
		add_btn_draw += '<button type="button" onclick="btn_add_click();" data-toggle="tooltip" data-placement="top" data-original-title="Add Asset Details" class="btn blue btn-animate">';
		add_btn_draw += ' <i class="nf nf-plus"></i>';
		add_btn_draw += '</button></div>';
		$('#add_btns').html(add_btn_draw);
		
	var org_id = $("#tm_accolades_sel_org").val();
	var org_unit_id = $("#tm_accolades_sel_org_unit").val();
	var dept_id = $("#tm_accolades_sel_dept").val();
	col_lg = 'col-lg-3';
	$("#accolades_list_div").innerHTML = "";
	$.ajax({
		url : '/accol_details_fetch/',
		type : 'POST',
		timeout : 10000,
		data: {
			'org_id': org_id,
			'org_unit_id': org_unit_id,
			'dept_id': dept_id,
		},
		async: false,
	}).done(function(json_data){
		json_data = JSON.parse(json_data);
		strAppend = '';
		if (json_data.accolades_details != undefined){
			$("#tm_accolt_nodata_div").css("display","none")
			if (json_data.accolades_details.length != 0){
				for(i=0;i<json_data.accolades_details.length;i++)
				{
					strAppend += '<div class="'+col_lg+' col-md-7 col-sm-12 row-eq-height" onClick="accol_id_click(this.id)" id="'+json_data.accolades_details[i].id+'">';
					strAppend += '<div class="profileCard equhight employeeList">';
					strAppend += '<div class="panel-body"> <img class="img-circle img-inline pic_ina" src="'+image_path + json_data.accolades_details[i].img_name+'" width="75px" height="75px">';
					strAppend += '<div class="con_ina des-eql-height">';
					strAppend += '<h4>'+json_data.accolades_details[i].ca_accolades_title+'</h4><p>';
					strAppend +=  json_data.accolades_details[i].ca_accolades_year+'</p>';
					strAppend +=  '<p>'+ json_data.accolades_details[i].org_name  +'</p>';
					strAppend += '</div></div></div></div>';
				}
			} else {
				$("#tm_accolt_nodata_div").css("display","block")
			}
		} else {
			$("#tm_accolt_nodata_div").css("display","block")
		}
		$('#accolades_list_div').html(strAppend);
	});
}

//26-SEP-2018 || KAV || Accolades Card Click Function  
function accol_id_click(id)
{
	var title = $("modal_accol_title").val()
	if(title == undefined)
		{
			$('.val_message').prop('style','display:none;');
		}
	accol_click_id = id;
	$(".modal-footer").innerHTML="";
	var btn_draw = '';
	btn_draw = '<button class="btn btn-success btn-eql-wid btn-animate" id="update_submit_modal">Update</button><button class="btn btn-warning btn-eql-wid btn-animate pull-right" onclick="cancel_clear_confirm(\''+"accol_cancel_clear"+'\')">Cancel / Clear</button><button class="btn btn-danger btn-eql-wid btn-animate pull-right" id="accol_remove" onclick="removeConfirmation(\''+"accol_remove"+'\');">Remove</button>';
	$('.modal-footer').html(btn_draw);
	$("#myModal1").modal('show');
	var org_id = $("#tm_accolades_sel_org").val();
	var org_unit_id = $("#tm_accolades_sel_org_unit").val();
	var dept_id = $("#tm_accolades_sel_dept").val();
	$.ajax({
		url : '/accol_cardclick_fetch/',
		type : 'POST',
		timeout : 10000,
		data: {
			'accol_id': accol_click_id,
		},
		async: false,
	}).done(function(json_data){
		json_data = JSON.parse(json_data);
		if (json_data.cardclick_accol_details != undefined){
			$("#tm_accolt_nodata_div").css("display","none")
			if (json_data.cardclick_accol_details.length != 0){
				$("#modal_accol_awarded_by").val(json_data.cardclick_accol_details[0].ca_accolades_awarded_by_id)
				$("#modal_accol_employee").val(json_data.cardclick_accol_details[0].ca_accolades_employee_id).trigger('change');
				$("#modal_accol_year").val(json_data.cardclick_accol_details[0].ca_accolades_year).trigger('change');
				$("#modal_accol_desc").val(json_data.cardclick_accol_details[0].ca_accolades_desc);
				$("#modal_accol_title").val(json_data.cardclick_accol_details[0].ca_accolades_title);
			} else {
				$("#tm_accolt_nodata_div").css("display","block")
			}
		} else {
			$("#tm_accolt_nodata_div").css("display","block")
		}
	});
	$("#update_submit_modal").click(function(){
		 var title = $("#modal_accol_title").val();
		 if(title == '')
		{
			 $('.val_message').prop('style','display:block;');
		}
		 accolades_submit_modal(accol_click_id)
	});
	
}

//27-SEP-2018 || KAV || Accolades Remove Function  
function accol_remove(accol_id)
{
	$.ajax({
		url : '/tm_accol_remove/',
		type : 'POST',
		timeout : 10000,
		data: {
			'accol_id': accol_click_id,
		},
		async: false,
	}).done(function(json_data){
		var json_data = JSON.parse(json_data);
		if(json_data.status == 'NTE_04'){
			alert_lobibox("success", sysparam_datas_list[json_data.status]);  
			$("#myModal1").modal('hide');
			accol_details_fetch();
			accol_cancel_clear();
		} else {
			alert_lobibox("error", sysparam_datas_list[json_data.status]);   
			$("#myModal1").modal('hide');
		}     
	});
}

//27-SEP-2018 || KAV || Accolades Details cancel clear function
function accol_cancel_clear(){
	$('#modal_accol_employee').val('0').trigger('change');
	$('#modal_accol_year').val('0').trigger('change');
	$('#modal_accol_desc').val('');
	$('#modal_accol_title').val('');
	var employee = $('#modal_accol_employee').val()
	if(employee == null)
	{
		$('.val_message').prop('style','display:none;');
	}
};


//27-SEP-2018 || KAV || Accolades Details Cancel / Clear form confirmation function
function cancel_clear_confirm(func_name,action_name) {
	var modal_accol_employee = $("#modal_accol_employee").val();
	var modal_accol_awarded_by = $("#modal_accol_awarded_by").val();
	var modal_accol_year = $("#modal_accol_year").val();
	var modal_accol_desc = $("#modal_accol_desc").val();
	var modal_accol_title = $("#modal_accol_title").val();
	if (modal_accol_employee != 0 || modal_accol_awarded_by != null || modal_accol_year != 0 || modal_accol_desc != '' || modal_accol_title != "" ){
		swal ({
			title: "Are you sure, you want to cancel?",
			type: "warning",
			showCancelButton: true,
			confirmButtonClass: "btn btn-success btn-eql-wid btn-animate",
			cancelButtonClass: "btn btn-danger btn-eql-wid btn-animate",
			confirmButtonText: "Yes",
			cancelButtonText: "No",
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
	} else {
		accol_cancel_clear();
	}
}

	
	
