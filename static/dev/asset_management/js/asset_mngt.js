var json_id='';
var ast_id='';
var col_lg='col-lg-3';
var pagination_cls='col-md-3 col-sm-6';
//17-May-2018 || MST || Asset Management - On Ready Functions
$(document).ready(function(){
	data = 'col-lg-3';
	str = '<h3 class="data-error align-center">No data available</h3>'
	$('#am_list_div').html(str);
	$("#am_purchase_date").DateTimePicker({
		dateFormat: "dd-MMM-yyyy"
	});
});

//17-May-2018 || MST || Asset Management - Asset List View Function
function asset_display_func(data, pagination_cls){
	var asset_name = document.getElementById("sel_asset_type");
	var ast_val = asset_name.options[asset_name.selectedIndex].value;  
	col_lg = data;
	document.getElementById("am_list_div").innerHTML = "";
	var sel_asset_org_val = $('#sel_asset_org').val();
	var sel_asset_org_unit_val = $('#sel_asset_org_unit').val();
	$.ajax({
		url : '/am_asset_list_fetch/',
		type : 'POST',
		timeout : 10000,
		data: {
			'ast_val': ast_val,
			'sel_asset_org_val': sel_asset_org_val,
			'sel_asset_org_unit_val': sel_asset_org_unit_val,
		},
		async: false,
	}).done(function(json_data){
		json_data = JSON.parse(json_data);
		strAppend = '';
		if (json_data.list_asset != undefined){
			if (json_data.list_asset.length != 0){
				
				var strAppend = '<ul>';
				var pagination_content = '<div class="'+pagination_cls+' float-right" id="asset_pagination"><div class="col-sm-3 btn prev" style="padding: 10px;">Prev</div><div class="col-sm-7"><ul class="pagination pagination-sm">';
				var count = 0;
				var list_count = 0;
				var pag_count = 0;
			    for(i=0;i<json_data.list_asset.length;i++)
				{
			    	count = count+1;
					list_count = list_count+1;
					if(list_count == 1){
						pag_count = pag_count + 1;
						strAppend += '<li id="pagination_'+pag_count+'" class="asset_pagination_list" style="display: none;">';
						pagination_content += '<li class="pagenationList" id="pag_'+pag_count+'" onclick="paginationClick('+pag_count+')"><a>'+pag_count+'</a>	</li>';
					}
					strAppend += '<div class="all_assets '+col_lg+' col-md-6 col-sm-12 row-eq-height" onClick="id_click(this)" id="asset_list_'+json_data.list_asset[i].id+'">';
					strAppend += '<div class="profileCard equhight employeeList">';
					strAppend += '<div class="panel-body"> <img class="img-circle img-inline pic_ina" src="'+asset_path+json_data.list_asset[i].type_name+'.jpg" width="75px" height="75px">';
					strAppend += '<div class="con_ina des-eql-height">';
					strAppend += '<h4>'+json_data.list_asset[i].type_name+' - '+json_data.list_asset[i].asset_model_code+'</h4><p>';
					if(json_data.list_asset[i].asset_model != null)
					{
						strAppend += json_data.list_asset[i].asset_model+'<br>';
					}
					strAppend += json_data.list_asset[i].asset_status+'</p>';
					strAppend += '</div></div></div></div>';
					
					if(list_count == 10){
		            	strAppend += '</li>';
		            	list_count = 0
		            }
				}
			    pagination_content += '</ul></div><div class="col-sm-2 btn next" style="padding: 10px;">Next</div></div>';
				strAppend += '</ul>';
				$('#am_list_div').html(strAppend);
				$('#pagination_content').html(pagination_content);
				paginationDiv();
			} else {
				strAppend += '<h3 class="data-error align-center">No data available</h3>';
				$('#am_list_div').html(strAppend);
				$('#pagination_content').html('');
			}
		} else {
			strAppend += '<h3 class="data-error align-center">No data available</h3>';
			$('#am_list_div').html(strAppend);
			$('#pagination_content').html('');
		}
	});
}

//pagination event function here
function paginationClick(id){
	$('.asset_pagination_list').removeClass('activeEmployeeList');
	$('#pagination_'+id).addClass('activeEmployeeList');
	$('.pagenationList').removeClass('active');
	$('#pag_'+id).addClass('active');
}

//pagination div
function paginationDiv(){
	paginationClick(1);
	$('#asset_pagination').each(function () {
		var foo = $(this);
		$(this).find('ul li:gt(4)').hide();
		$(this).find('.next').click(function () {
			var last = $('ul',foo).children('li:visible:last');
			last.nextAll(':lt(5)').show();
			last.next().prevAll().hide();
		});
		$(this).find('.prev').click(function () {
			var first = $('ul',foo).children('li:visible:first');
			first.prevAll(':lt(5)').show();
			first.prev().nextAll().hide()
		});
	});
}

//17-May-2018 || MST || Asset Management - Asset List View Function
function asset_list_view_func(){
	if ($('#asset_form').css('display') == 'none'){
		col_lg = 'col-lg-3';
		pagination_cls = 'col-md-3 col-sm-6';
	} else if ($('#asset_form').css('display') == 'flex'){
		col_lg = 'col-lg-dummy';
		pagination_cls = 'col-md-6 col-sm-12';
	}
	data = col_lg;
	asset_display_func(data, pagination_cls);
}

//15-OCT-2018 || MST || Department dropdown - On Org Unit select function
function dept_onchange(org_unit_id){
	$('#asset_division').empty().append($('<option>',{
		value:'0',
		disabled:'disabled',
		text:'-Select Division-',
		hidden:'hidden',
		selected:'selected',
	}));
	$.ajax({
		type: 'POST',
		url: '/am_dept/',
		timeout : 10000,
		data: {
			'org_unit_id': org_unit_id,
		},
		async: false,
	}).done(function(json_data){
		data = JSON.parse(json_data);
		if (data.sel_dept != undefined){
			if (data.sel_dept.length > 0){
				for(i=0;i<data.sel_dept.length;i++)
				{
					$('#asset_division').append($('<option>',{
						value:data.sel_dept[i].id,
						text:data.sel_dept[i].name
					}))
				}
			}
		}
	});
}

//22-May-2018 || MST || Asset Details ADD and Update form validation
var $validator = $('#submit_form').validate({
	rules: {
		asset_org:{
			required: true,
		},
		asset_org_unit:{
			required: true,
		},
		asset_id: {
			required: true,
		},
		asset_type: {
			required: true,
		},
		asset_expiry_date: {
			greaterThan: "#asset_purchase_date"
		},
		asset_status: {
			required: true,
		},
		asset_adrs: {
			required: true,
		},
		asset_address:{
			required:true,
		},
	},
	//For custom messages
	messages: {
		asset_org:{
			required:"Select Organization",
		},
		asset_org_unit:{
			required:"Select Organization Unit",
		},
		asset_id:{
			required:"Enter Asset ID",
		},
		asset_type:{
			required:"Select Asset Type",
		},
		asset_expiry_date:{
			greaterThan:"Should be greater than purchase date"
		},
		asset_status: {
			required:"Select Asset Status"
		},
		asset_adrs: {
			required:"Enter Asset Address",
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

//17-May-2018 || KAV || Add Asset Details Button Function
function add_form(action_name){
	if (action_name == 'add'){
		$("#asset_type").prop('disabled', false);
		$('#access_btns').html('');
		$('#form_title').text('Add Form');
		$('#am_main_div > .col-md-12').addClass('col-md-6').removeClass('col-md-12');
		$('#am_list_div .col-lg-3').addClass('col-lg-dummy').removeClass('col-lg-3');
		$('#view_all_div').addClass('col-md-11').removeClass('col-md-10');
		$('#add_all_div').addClass('col-md-1').removeClass('col-md-2');
		$('#asset_form').show();
		$('#asset_id').prop('readonly', true);
		$("#asset_status option[value=ASST3]").prop('disabled',true);
		$('#submit_form').show();
		$('.val_message').prop('style','display:none;');
		btns_draw('add');
		am_cancel_clear();
	}
}

//22-May-2018 || MST || Asset Details Dynamic button draw function
function btns_draw(action_name){
	$("#am_btns").html('');
	var btnstr = '';
	var access_for_create_1 = jQuery.inArray( "Asset Management", JSON.parse(localStorage.Create) );
	var access_for_write = jQuery.inArray( "Asset Management", JSON.parse(localStorage.Write) );
	var access_for_delete = jQuery.inArray( "Asset Management", JSON.parse(localStorage.Delete) );
	if (action_name == 'add') {
		if (access_for_create_1 != -1){
			btnstr += '<button type="button" class="btn btn-warning btn-eql-wid btn-animate pull-right" onclick="cancel_clear_confirm(\''+"am_cancel_clear"+'\')">Cancel / Clear</button>';
			btnstr += '<button type="button" class="btn-animate btn btn-success btn-eql-wid pull-right" onclick="save_form(this);">Add</button>';
		}
	} else if (action_name == 'update') {
		if (access_for_write != -1){
			btnstr += '<button type="button" class="btn-animate btn btn-success btn-eql-wid " onclick="save_form(this);">Update</button>';            
		}
		if (access_for_delete != -1){
			btnstr += '<button type="button" class="btn-animate btn btn-danger btn-eql-wid " onclick="btn_delete_form(\''+"am_delete_form"+'\');">Remove</button>';
		}
		btnstr += '<button type="button" class="btn btn-warning btn-eql-wid btn-animate " onclick="cancel_clear_confirm(\''+"am_cancel_clear"+'\')">Cancel / Clear</button>';        
	} else if (action_name == 'update_only') {
		if (access_for_write != -1){
			btnstr += '<button type="button" class="btn-animate btn btn-success btn-eql-wid " onclick="save_form(this);">Update</button>';
			btnstr += '<button type="button" class="btn btn-warning btn-eql-wid btn-animate " onclick="cancel_clear_confirm(\''+"am_cancel_clear"+'\')">Cancel / Clear</button>';
		}
	}
	$("#am_btns").append(btnstr);
}

//22-May-2018 || MST || Asset Details Save and Update Form function
function save_form(el){
	var text = $(el).text();
	var $valid = $('#submit_form').valid();
	if ($valid){
		var asset_org = $("#asset_org").val();
		var asset_org_unit = $("#asset_org_unit").val();
		var asset_div = $("#asset_division").val();
		asset_id_val = $("#asset_id").val();
		asset_config = $("#asset_config").val();
		asset_serial = $("#asset_serial").val();
		asset_purchase_date = $("#asset_purchase_date").val();
		asset_expiry_date = $("#asset_expiry_date").val();
		asset_warranty = $("#asset_warranty").val();
		asset_remarks = $("#asset_remarks").val();
		asset_bgoods = $("#asset_bgoods").val();
		asset_wgoods = $("#asset_wgoods").val();
		var e = document.getElementById("asset_type");
		ast_type_val = e.options[e.selectedIndex].value;
		var j = document.getElementById("asset_make");
		ast_make_val = j.options[j.selectedIndex].value;
		var k = document.getElementById("asset_model");
		ast_model_val = k.options[k.selectedIndex].value;
		var o = document.getElementById("asset_status");
		ast_status_code = o.options[o.selectedIndex].value;
		asset_bgoods = $("#asset_bgoods").val();
		asset_wgoods = $("#asset_wgoods").val();
		asset_adrs = $("#asset_adrs").val();
		$.ajax({
			type: 'POST',
			url: '/asset_details_insert/',
			timeout : 10000,
			data: {
				'asset_org':asset_org,
				'asset_org_unit':asset_org_unit,
				'asset_div':asset_div,
				'ast_id':ast_id,
				'asset_id_val': asset_id_val,
				'asset_make': ast_make_val,
				'asset_model': ast_model_val,
				'asset_config': asset_config,
				'asset_serial': asset_serial,
				'asset_purchase_date': asset_purchase_date,
				'asset_expiry_date': asset_expiry_date,
				'asset_warranty': asset_warranty,
				'asset_remarks': asset_remarks,
				'asset_bgoods': asset_bgoods,
				'asset_wgoods': asset_wgoods,
				'asset_type_val': ast_type_val,
				'text': text,
				'asset_status_code':ast_status_code,
				'asset_bgoods':asset_bgoods,
				'asset_wgoods':asset_wgoods,
				'asset_adrs':asset_adrs,
			},
			async: false,
		}).done(function(view_data) {
			var json_data = JSON.parse(view_data);
			if(json_data.status == 'NTE_01'){
				am_cancel_clear();
				alert_lobibox("success", sysparam_datas_list[json_data.status]);    
			} else if(json_data.status == 'NTE_03'){
				$('#asset_type').prop('disabled', false);
				am_cancel_clear();
				add_form('add');
				alert_lobibox("success", sysparam_datas_list[json_data.status]);    
			} else {
				alert_lobibox("error", sysparam_datas_list[json_data.status]);    
			}
		});
		asset_list_view_func();
	} else {
		$('.val_message').prop('style', 'display:block;')
	}
}

//22-May-2018 || MST || Asset Details asset click function
function id_click(id){
	// $('#form_title').text('Update Form');
	$('.val_message').prop('style','display:none;');
	$("#access_btns").html('');  
	btns_draw('update');
	ast_id = id.id.split('_')[2]
	$('#am_add_btn').hide();
	$('#am_main_div > .col-md-12').addClass('col-md-6').removeClass('col-md-12');
	$('#am_list_div .col-lg-3').addClass('col-lg-dummy').removeClass('col-lg-3');
	$('#asset_pagination').addClass('col-md-6 col-sm-12').removeClass('col-md-3 col-sm-6');
	$('#view_all_div').addClass('col-md-11').removeClass('col-md-10');
	$('#add_all_div').addClass('col-md-1').removeClass('col-md-2');
	$('#asset_form').show();
	$("#asset_type").prop('disabled', true);
	$("select option:contains('Allocated')").attr("disabled","disabled");
	$(".profileCard").removeClass('highlight-border');
	$("#"+id.id+" > div").addClass('highlight-border');
	$.ajax({
		url : '/am_asset_data_fetch/',
		type : 'POST',
		timeout : 10000,
		data:{
			"ast_id":ast_id,
		},
		async: false,
	}).done(function(json_data){
		json_data = JSON.parse(json_data);
		if (json_data) {
			json_id = json_data.list_asset[0].id;
			$("#asset_org").val(json_data.list_asset[0].asset_org_id).trigger("change");
			$("#asset_org_unit").val(json_data.list_asset[0].asset_org_unit_id).trigger("change");
			$("#asset_division").val(json_data.list_asset[0].asset_division_id).trigger("change");
			$("#asset_type").val(json_data.list_asset[0].asset_model_type_refitem_id).trigger("change");
			$("#asset_id").val(json_data.list_asset[0].asset_model_code);
			var asset_type_code = $("#asset_type").find(':selected').attr('code');
			if (asset_type_code != 'AST10'){
				$("#asset_make").val(json_data.list_asset[0].asset_make_refitem_id).trigger("change");
				$("#asset_model").val(json_data.list_asset[0].asset_model_refitem_id).trigger("change");
			}
			$("#asset_bgoods").val(json_data.list_asset[0].asset_brown_goods);
			$("#asset_wgoods").val(json_data.list_asset[0].asset_white_goods);
			$("#asset_adrs").val(json_data.list_asset[0].asset_address);
			$("#asset_config").val(json_data.list_asset[0].asset_configuration);
			$("#asset_serial").val(json_data.list_asset[0].asset_serial);
			$("#asset_purchase_date").val(json_data.list_asset[0].purchase_date);
			$(".date_input_class").trigger('change');
			$("#asset_expiry_date").val(json_data.list_asset[0].expiry_date);
			$("#asset_warranty").val(json_data.list_asset[0].asset_warranty);
			$("#asset_remarks").val(json_data.list_asset[0].asset_remarks);
			asset_status_allocated = json_data.list_asset[0].asset_status;
			$("#asset_allocated_div").html('');
			if(asset_status_allocated == "Allocated"){
				$("#asset_status").val("ASST3").trigger("change");
				$("#asset_status option[value=ASST3]").prop('disabled',false);
				var textboxstr = '';
				textboxstr += '<div class="col-md-6 col-sm-6 ">';
				textboxstr += '<div class="form-group">';
				textboxstr += '<label>Asset Allocated</label>';
				textboxstr += '<div class="input-icon">';
				textboxstr += '<i class="nf nf-remark"></i>';
				textboxstr += '<input type="text" maxlength="50" id="asset_allocated" name="asset_allocated" class="form-control" placeholder="Asset Allocated" disabled/>';
				textboxstr += '</div></div></div>';
				$("#asset_allocated_div").html(textboxstr);
				$('#asset_allocated').val(json_data.emp_name[0].name);
				btns_draw('update_only');
				
			} else {
				$.ajax({
					url : '/am_asset_data_fetch/',
					type : 'POST',
					timeout : 10000,
					data:{
						"ast_id":ast_id,
						"asset_status":asset_status_allocated,
					},
					async: false,
				}).done(function(json_data){
					json_data = JSON.parse(json_data)
					ref_item_code = json_data.refitems_code[0].refitems_code
					$("#asset_status").val(ref_item_code).trigger("change");
				});
				$("#asset_allocated_div").html('');
			}    
		} else {
			alert_lobibox("error", sysparam_datas_list[json_data.status]);    
		}
	});
}

//22-May-2018 || KAV || Asset Details Delete form validation
function btn_delete_form(am_delete_form){
	removeConfirmation(am_delete_form);
}

//22-May-2018 || MST || Asset Details Delete form function
function am_delete_form(){
	$.ajax({
		type: 'POST',
		url: '/asset_details_remove/',
		timeout : 10000,
		data: {
			'ast_id': ast_id,
		},
		async: false,
	}).done(function(view_data) {
		var json_data = JSON.parse(view_data);
		if(json_data.status == 'NTE_04'){
			$("#asset_type").prop('disabled', false);
			am_cancel_clear();
			
			$('#form_title').text('Add Form');
			add_form('add');
			alert_lobibox("success", sysparam_datas_list[json_data.status]);    
		} else {
			alert_lobibox("error", sysparam_datas_list[json_data.status]);    
		}           
	});
	asset_list_view_func();
}

//22-May-2018 || MST || Asset Details Cancel / Clear form confirmation function
function cancel_clear_confirm(func_name,action_name) {
	var am_id_emp = $("#asset_id").val();
	var am_asset_model = $("#asset_model").val();
	var e = document.getElementById("asset_type");
	var am_ast_type_val = e.options[e.selectedIndex].value;
	var am_asset_serial = $("#asset_serial").val();
	var am_asset_expiry_date = $("#asset_expiry_date").val();
	var am_asset_warranty = $("#asset_warranty").val();
	if (am_id_emp != '' || am_asset_model != null || am_ast_type_val != 0 || am_asset_serial != '' || am_asset_expiry_date != "" || am_asset_warranty != '' ){
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
				$("#asset_type").prop('disabled', false);
				$('#form_title').text('Add Form');
				add_form('add');
			} 
		});
	} else {
		am_cancel_clear();
	}
}

//22-May-2018 || MST || Asset Details Close button function
$("#am_btn_close").click(function(){
	am_cancel_clear();
	$(".profileCard").removeClass('highlight-border');
	$('#am_add_btn').show();
	$('#am_main_div > .col-md-6').addClass('col-md-12').removeClass('col-md-6');
	$('#am_list_div .col-lg-dummy').addClass('col-lg-3').removeClass('col-lg-dummy');
	$('#asset_pagination').addClass('col-md-3 col-sm-6').removeClass('col-md-6 col-sm-12');
	$('#view_all_div').addClass('col-md-10').removeClass('col-md-11');
	$('#add_all_div').addClass('col-md-2').removeClass('col-md-1');
	$('#asset_form').hide();
	$('#access_btns').html('');
	var access_for_create = jQuery.inArray( "Asset Management", JSON.parse(localStorage.Create) );
	var addbtnstr = '';
	if (access_for_create != -1){
		addbtnstr += '<button type="button" onclick="add_form(\''+"add"+'\')" class="btn blue btn-animate"><i class="nf nf-plus"></i></button>'    
		$('#access_btns').append(addbtnstr)
	}
});

//22-May-2018 || MST || Asset Details cancel clear function
function am_cancel_clear(){
	$(".profileCard").removeClass('highlight-border');
	$('#access_btns').html('');
	var access_for_create = jQuery.inArray( "Asset Management", JSON.parse(localStorage.Create) );
	var addbtnstr = '';
	if (! $('#am_list_div div').hasClass('col-lg-dummy')){
		if (access_for_create != -1){
			addbtnstr += '<button type="button" onclick="add_form(\''+"add"+'\')" class="btn blue btn-animate"><i class="nf nf-plus"></i></button>'    
			$('#access_btns').append(addbtnstr);
		}
	}
	$('#asset_org').val('0').trigger('change');
	$('#asset_org_unit').val('0').trigger('change');
	$('#asset_org_unit').prop("disabled",true);
	$('#asset_make').val('0').trigger('change');
	$('#asset_model').val('0').trigger('change');
	$('#asset_id').prop('readonly', true);
	$('#asset_id').val('');
	$('#asset_type').val('0').trigger('change');
	$('#asset_config').val('');
	$('#asset_serial').val('');
	$('#asset_purchase_date').val('');
	$(".date_input_class").trigger('change');
	$('#asset_expiry_date').val('');
	$('#asset_warranty').val('');
	$('#asset_remarks').val('');
	$('#asset_allocated').val('');
	$('#asset_status').val('0').trigger('change');
	$('#asset_allocated_div').html('');
	$('#asset_bgoods').val('');
	$('#asset_wgoods').val('');
	$('#asset_adrs').val('');
//	$('.val_message').css('display', 'none');
	clear_form_grp_divs();
	$('.val_message').prop('style','display:none;');
};

//15-JUN-2018 || SMI || Sub divs in form clear function
function clear_form_grp_divs(){
	$('#asset_make_div').css("display","none");
	$('#asset_model_div').css("display","none");
	$('#asset_adrs_div').css("display","none");
	$('#asset_brown_goods_div').css("display","none");
	$('#asset_white_goods_div').css("display","none");
	$('#asset_config_div').css("display","none");
	$('#asset_serial_div').css("display","none");
	$('#asset_purchase_date_div').css("display","none");
	$('#asset_warranty_div').css("display","none");
	$('#asset_expiry_date_div').css("display","none");
	$('#asset_remarks_div').css("display","none");
	$('#asset_status_div').css("display","none");
}

//22-May-2018 || MST || Asset Details Generate Asset ID function
function gen_asset_id(asset_id) {
	var e = document.getElementById("asset_type");
	var ast_typ = e.options[e.selectedIndex].value;
	var ast_type_text = e.options[e.selectedIndex].text;
	var ast_typ_code = e.options[e.selectedIndex].label;
	if (ast_type_text == 'Vehicle'){
		data = 'Vehicle Number'
		$("#sl_no").html(data);
		$("#asset_serial").prop('placeholder', 'Vehicle Number');
	} else if (ast_type_text == 'Phone'){
		data = 'IMEI Number'
		$("#sl_no").html(data);
		$("#asset_serial").prop('placeholder', data);
	} else if (ast_type_text == 'House'){
		data = 'Address'
		$("#sl_no").html(data);
		$("#asset_serial").prop('placeholder', data);
		$("#div_main_config").css("display", "none");
		$("#div_main_purchase").css("display", "none");
		$("#div_main_warranty").css("display", "none");
		$("#div_main_expiry").css("display", "none");
		$("#div_main_model").css("display", "none");
		$("#div_main_make").css("display", "none");
		$("#div_main_bgoods").css("display", "block");
		$("#div_main_wgoods").css("display", "block");
	}
	$.ajax({
		type: 'POST',
		url: '/gen_asset_id/',
		timeout : 10000,
		data: {
			'ast_typ': ast_typ,
			'ast_typ_code': ast_typ_code,
			'ast_type_text': ast_type_text,
		},
		async: false,
	}).done(function(view_data) {
		var data = JSON.parse(view_data);
		if (data.val == ""){
			$('#asset_id').prop('readonly', false);
		}else{
			$('#asset_id').val(data.val);    
		}
		if (data.make_values != []){
			$('#asset_make').empty().append($('<option>',{
				value:'0',
				text:'-Select-',
				hidden:'hidden',
				selected:'selected',
				disabled:'disabled'
			}));
			if (data.make_values != undefined){
				if (data.make_values.length > 0){
					for(i=0;i<data.make_values.length;i++)
					{
						$('#asset_make').append($('<option>',{
							value:data.make_values[i].id,
							text:data.make_values[i].refitems_name
						}))
					}
				}	
			}
			
		}
	});
}

//22-May-2018 || MST || Asset Details Generate Asset Model function
function gen_asset_model(asset_id) {
	var e = document.getElementById("asset_make");
	var ast_make = e.options[e.selectedIndex].value;
	$.ajax({
		type: 'POST',
		url: '/gen_asset_id/',
		timeout : 10000,
		data: {
			'ast_make': ast_make,
		},
		async: false,
	}).done(function(view_data) {
		var data = JSON.parse(view_data);
		if (data.model_values){
			$('#asset_model').empty().append($('<option>',{
				value:'0',
				text:'-Select-',
				hidden:'hidden',
				selected:'selected',
				disabled:'disabled'
			}));
			for(i=0;i<data.model_values.length;i++)
			{
				$('#asset_model').append($('<option>',{
					value:data.model_values[i].id,
					text:data.model_values[i].refitems_name
				}))
			}
		}
	});
}

function disp_expiry_date(id){
	asset_purchase_date = $("#asset_purchase_date").val();
	if (asset_purchase_date == ''){
		alert_lobibox("warning", "Select Purchase Date Before Entering Warranty");
	} else{
		$.ajax({
			type: 'POST',
			url: '/gen_expiry_date/',
			timeout : 10000,
			data: {
				'purchase_date': asset_purchase_date,
				'warranty_in_months':id,
			},
			async: false,
		}).done(function(view_data) {
			json_data = JSON.parse(view_data);
			$("#asset_expiry_date").val(json_data.final_expiry_date);
		});	
	}
}

//15-JUN-2018 || SMI || Asset Type Onchange Function
$('#asset_type').change(function(){
	onchange_custom_clear();
	var asset_type_code = $("#asset_type").find(':selected').attr('code');
	var sno_lbl_data = '';
	if (asset_type_code != undefined || asset_type_code == ''){
		$('#asset_status').val('ASST1').trigger('change');
		if(asset_type_code == 'AST10') {
			clear_form_grp_divs();
			$('#asset_adrs_div').css("display","block");
			$('#asset_brown_goods_div').css("display","block");
			$('#asset_white_goods_div').css("display","block");
			$('#asset_remarks_div').css("display","block");
			$('#asset_status_div').css("display","block");
		} else{
			clear_form_grp_divs();
			$('#asset_make_div').css("display","block");
			$('#asset_model_div').css("display","block");
			$('#asset_config_div').css("display","block");
			$('#asset_serial_div').css("display","block");
			$('#asset_purchase_date_div').css("display","block");
			$('#asset_warranty_div').css("display","block");
			$('#asset_expiry_date_div').css("display","block");
			$('#asset_remarks_div').css("display","block");
			$('#asset_status_div').css("display","block");
			if(asset_type_code == 'ASTP8'){
				sno_lbl_data = 'IMEI Number';
			} else if(asset_type_code == 'ASTP9') {
				sno_lbl_data = 'Vehicle Number';
			} else {
				sno_lbl_data = 'Serial Number';
			}
		}
		$("#sl_no").html(sno_lbl_data);
		$("#asset_serial").prop('placeholder', sno_lbl_data);
	}
})

//15-JUN-2018 || SMI || Clear all fields except Asset Type and ID
function onchange_custom_clear(){
	$('#asset_make').val('0').trigger('change');
	$('#asset_model').val('0').trigger('change');
	$('#asset_bgoods').val('');
	$('#asset_wgoods').val('');
	$('#asset_adrs').val('');
	$('#asset_config').val('');
	$('#asset_serial').val('');
	$('#asset_purchase_date').val('');
	$('#asset_expiry_date').val('');
	$('#asset_warranty').val('');
	$('#asset_remarks').val('');
}

//28-JUN-2018 || SMI || Asset Organization - On select function
function am_org_change(am_org_id){
	$('#asset_org_unit').empty().append($('<option>',{
		value:'0',
		text:'-Select Org. Unit-',
		hidden:'hidden',
		selected:'selected',
		disabled:'disabled'
	}));
	$.ajax({
		type: 'POST',
		url: '/am_get_org_unit_list/',
		timeout : 10000,
		data: {
			'am_org_id': am_org_id,
		},
		async: false,
	}).done(function(json_data){
		data = JSON.parse(json_data);
		if (data.asset_org_unit != undefined){
			if (data.asset_org_unit.length > 0){
				$('#asset_org_unit').prop("disabled",false);
				for(i=0;i<data.asset_org_unit.length;i++)
				{
					$('#asset_org_unit').append($('<option>',{
						value:data.asset_org_unit[i].id,
						text:data.asset_org_unit[i].orgunit_name
					}))
				}
			} else {
				$('#asset_org_unit').prop("disabled",true);
				alert_lobibox("warning","Please select an organization with at least one Org. Unit");
			}
		}
	})
}

//04-JUL-2018 || MST || View Asset Organization - On select function
function am_org_change_view(am_org_id){
	str = '<h3 class="data-error align-center">No data available</h3>'
	$('#am_list_div').html(str);
	if ($('#sel_asset_type').val() == 'all'){
		$('#sel_asset_type').prop("disabled",true);
	} else {
		$('#sel_asset_type').val('all').trigger('change');
		$('#sel_asset_type').prop("disabled",true);
	}
	$('#sel_asset_org_unit').empty().append($('<option>',{
		value:'0',
		text:'-Select Org. Unit-',
		hidden:'hidden',
		selected:'selected',
		disabled:'disabled'
	}));
	$.ajax({
		type: 'POST',
		url: '/am_get_org_unit_list/',
		timeout : 10000,
		data: {
			'am_org_id': am_org_id,
		},
		async: false,
	}).done(function(json_data){
		data = JSON.parse(json_data);
		if (data.asset_org_unit != undefined){
			if (data.asset_org_unit.length > 0){
				$('#sel_asset_org_unit').prop("disabled",false);
				for(i=0;i<data.asset_org_unit.length;i++)
				{
					$('#sel_asset_org_unit').append($('<option>',{
						value:data.asset_org_unit[i].id,
						text:data.asset_org_unit[i].orgunit_name
					}))
				}
			} else {
				$('#sel_asset_org_unit').prop("disabled",true);
				alert_lobibox("warning","Please select an organization with at least one Org. Unit");
			}
		}
	})
}

//04-JUL-2018 || MST || Select Asset Organization Unit - On select function
function asset_org_unit_change(){
	$('#sel_asset_type').prop("disabled",false);
	asset_list_view_func();
}
