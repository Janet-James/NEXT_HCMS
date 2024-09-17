var from_refitemcat_id ='';
var to_refitemcat_id ='';
var from_refitem_id = '';

$(document).ready(function () {
	// Load the multiple select for to 	
	$('select#to_ref_id').multi({  
		search_placeholder: 'Search To Refence Items...',
	});
 
	// Reference Item link detail data table load function
	refitemlink_detail_table_function();

	$("#from_cat_id").on('change',function(){ 
		var from_category = $(this).val();
		from_category_fetch(from_category);
	});
 
	$("#to_cat_id").on('change',function(){  
		var to_category = $(this).val();
		to_category_fetch(to_category); 
	});
}); 
 
//From category fetching function     
function from_category_fetch(from_category) {
	var currurl = window.location.href;
	var actionurl = currurl.replace('refitemlink_details/','refitemlink_list/');
	if (from_category !=0 && from_category != null) {  
		$.ajax({
			url : actionurl,
			type : 'GET', 
			timeout : 10000,
			async:false,
			data: { 
				'category_data':from_category
			}
		}).done(function(json_data)	{
			var data = JSON.parse(json_data);
			from_ref_data = data.refitemlist;
			if (data.status == "NTE_01") {
				if (from_ref_data.length > 0) {
					$('#from_ref_id').prop('disabled', false);
					$('#from_ref_id')[0].options.length = 0;
					var from_ref_str = '<option value="0">-Select Reference Item-</option>';
					for (var i=0; i<from_ref_data.length; i++) {
						from_ref_str += '<option value="'+from_ref_data[i].id+'">'+from_ref_data[i].refitems_name+'</option>';
					}
					$('#from_ref_id').append(from_ref_str);
				} else {
					alert_lobibox("error", sysparam_datas_list["ERR0029"]);
				}
			} else {
				alert_lobibox("error", sysparam_datas_list[data.status]); 
			}
		});
	} else {
		$('#from_ref_id')[0].options.length = 0;
		var from_ref_str = '<option value="0">-Select Reference Item-</option>';
		$('#from_ref_id').append(from_ref_str); 
	} 
	return false 
}

//To category fetching function
function to_category_fetch(to_category) {
	var currurl = window.location.href;
	var actionurl = currurl.replace('refitemlink_details/','refitemlink_list/');
	if (to_category !=0 && to_category != null) {
		$.ajax({
			url : actionurl,
			type : 'GET',
			timeout : 10000,
			async:false,
			data: {
				'category_data':to_category
			}
		}).done(function(json_data)	{
			var data = JSON.parse(json_data);
			to_ref_data = data.refitemlist;
			if (data.status == "NTE_01") {
				if (to_ref_data.length > 0) {
					var to_ref_str = '';
					for (var i=0; i<to_ref_data.length; i++) {
						to_ref_str += '<option value="'+to_ref_data[i].id+'">'+to_ref_data[i].refitems_name+'</option>';
					}
					$('#to_ref_id').append(to_ref_str);
					$('#to_ref_id').trigger("change");
				} else {
					alert_lobibox("error", sysparam_datas_list["ERR0029"]);
				}
			} else {
				alert_lobibox("error", sysparam_datas_list[data.status]);
			}
		});
	} else {
		$('#to_ref_id').val('').trigger("change");
	}
	return false
}

function action_for_refitemlink(action_name){
	if (action_name == "add") {
		// Reference Item link added function
		refitemlink_data_management('add');
		return false
	} else if (action_name == "update") {
		//Reference Item link updated function
		refitemlink_data_management('update');
		return false
	} else if (action_name == "remove") {  
		// Reference Item link deleted function
		removeConfirmation('refitemlink_data_management', 'remove');
		return false
	} else if (action_name == "clear") {			// Reference Item link form clear function  
		$('.span-error').html(" ");
		/*	 
		form_inputs_clear('#refitemlink_form');
		$('#from_ref_id').prop('disabled', true);
		$('#to_ref_id').html('').trigger("change");
		*/ 
		$('#from_cat_id').val(0).trigger('change');
		$('#to_cat_id').val(0).trigger('change');
		
	} else if (action_name == "cancel") {
		// Reference Item link form cancel function
		form_inputs_clear('#refitemlink_form');
		$('#from_ref_id').prop('disabled', true);
		$('#to_ref_id').html('').trigger("change");
		btns_draw('add');
	}
}

//Buttons draw function
function btns_draw(action_name){
	$("#bottom_btns").html('');
	var btnstr = '';
	var access_for_create = jQuery.inArray( "Manage Reference Item Link", JSON.parse(localStorage.Create) );
	var access_for_write = jQuery.inArray( "Manage Reference Item Link", JSON.parse(localStorage.Write) );
	var access_for_delete = jQuery.inArray( "Manage Reference Item Link", JSON.parse(localStorage.Delete) );
	if (action_name == 'add') {
		if (access_for_create != -1){
			btnstr += '<button type="button" class="btn btn-success btn-eql-wid btn-animate margin-right-3" onclick="action_for_refitemlink(\''+"add"+'\')">Add</button>';
		}
		btnstr += '<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-3" onclick="action_for_refitemlink(\''+"clear"+'\')">Cancel / Clear</button>';
	} else if (action_name == 'update') {
		if (access_for_write != -1){
			btnstr += '<button type="button" class="btn btn-primary btn-eql-wid btn-animate margin-right-3" onclick="action_for_refitemlink(\''+"update"+'\')">Update</button>';
		}
		if (access_for_delete != -1){
			btnstr += '<button type="button" class="btn btn-danger btn-eql-wid btn-animate margin-right-3" onclick="action_for_refitemlink(\''+"remove"+'\')">Remove</button>';
		}
		btnstr += '<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-3" onclick="update_clear_func(\''+"cancel"+'\')">Cancel / Clear</button>';
	}
	$("#bottom_btns").append(btnstr); 
}

//Update form clear function
function update_clear_func(action_name) {
	var title=$('#from_cat_id option:selected').text();
	orgClearFuncton('action_for_refitemlink', action_name,title);
}

//Reference Item details datatable load function
function refitemlink_detail_table_function(){
	var currurl = window.location.href;
	var actionurl = currurl.replace('refitemlink_details/','refitemlink_record/');
	columns = [{'title':'From Reference Item Category','name':'from_refitemcat_id'}, {'title':'To Reference Item Category','name':'to_refitemcat_id'}, {'title':'From Reference Item ID','name':'from_refitem_id'}, 
	           {'title':'No.','name':'row_number'}, {'title':'From Reference Item','name':'from_refitem'}, {'title':'To Reference Item','name':'to_refitem'}];
	$.ajax({
		url : actionurl,
		type : 'GET',
	}).done(function(json_data)	{
		var data = JSON.parse(json_data);
		var refitemlink_list = []; 
		if (data.status == "NTE_01"){
			data = data.table_datas;
			$("#refitemlink_table_tbody tr:gt(0)").remove(); 
			for (var i=0; i<data.length; i++){
				refitemlink_list.push([data[i].from_refitemcat_id, data[i].to_refitemcat_id, data[i].from_refitem_id, data[i].row_number, data[i].from_refitem, data[i].to_refitem]);
			}
			plaindatatable_btn('refitemlink_table', refitemlink_list, columns, [0, 1, 2], 'NEXT_TRANSFORM_NEXT-HCMS_Reference_Items_Link'+currentDate());
		} else {
			alert_lobibox("error", sysparam_datas_list[data.status]);
		}
	});
	return false
}

//Reference Item link details table row click get id
$("#refitemlink_table tbody").on("click", "tr", function() {    
	var currurl = window.location.href;
	var actionurl = currurl.replace('refitemlink_details/','refitemlink_record/');
	from_refitemcat_id = $('#refitemlink_table').dataTable().fnGetData(this)[0];
	to_refitemcat_id = $('#refitemlink_table').dataTable().fnGetData(this)[1];
	$("#from_cat_id").val(from_refitemcat_id).trigger("change");
	$("#to_cat_id").val(to_refitemcat_id).trigger("change");
	from_refitem_id = $('#refitemlink_table').dataTable().fnGetData(this)[2];
	$("#from_ref_id").val(from_refitem_id).trigger("change");
	$("#to_refcat_id").val(to_refitemcat_id);
	$.ajax({
		url : actionurl,
		type : 'GET',
		data: {
			'from_refitem_id':from_refitem_id
		}
	}).done(function(json_data)	{
		var temp = '';
		var data = JSON.parse(json_data);
		temp = data.table_datas;
		if (data.status == "NTE_01") {
			btns_draw('update');
			$("#to_ref_id").val(temp[0].to_ref_id).trigger("change");
		} else {
			alert_lobibox("error", sysparam_datas_list[data.status]);
		}
	});
});

//Reference Item link details data management function
function refitemlink_data_management(func_name, event){
	var currurl = window.location.href;
	var actionurl = currurl.replace('refitemlink_details/','refitemlink_datainsert/');
	if (func_name == "remove") {
		if (from_refitem_id){
			var datas = getFormValues("#refitemlink_form");
			var	csrf_data = datas.csrfmiddlewaretoken;
			$.ajax({
				type  : 'POST',
				url   : actionurl,
				data: {
					'delete_id': to_refitemcat_id,
					csrfmiddlewaretoken: csrf_data
				},
			}).done( function(jsondata) {
				var data = JSON.parse(jsondata);
				if (data.status == "NTE_04"){
					btns_draw('add');
					action_for_refitemlink('clear');
					refitemlink_detail_table_function();
					alert_lobibox("success", sysparam_datas_list[data.status]);
				} else {
					alert_lobibox("error", sysparam_datas_list[data.status]);
				}
			});
		}
	} else {
		if(refitemlink_form_validation()) {
			var datas = getFormValues("#refitemlink_form");
			var	csrf_data = datas.csrfmiddlewaretoken;
			var to_ref_ids = [];
			$.each($("#to_ref_id option:selected"), function(){            
				to_ref_ids.push($(this).val());
			});
			datas['to_ref_id'] = to_ref_ids;
			if (to_ref_ids.length > 0) {
				$.ajax({
					type  : 'POST',
					url   : actionurl,
					data: {
						'datas': JSON.stringify(datas),
						csrfmiddlewaretoken: csrf_data
					},
				}).done( function(jsondata) {
					var data = JSON.parse(jsondata);
					if (data.status == "NTE_01"){
						refitemlink_detail_table_function();
						action_for_refitemlink('clear');
						alert_lobibox("success", sysparam_datas_list[data.status]);
					} else if (data.status == "NTE_03") {
						btns_draw('add');
						refitemlink_detail_table_function();
						action_for_refitemlink('clear');
						alert_lobibox("success", sysparam_datas_list[data.status]);
					} else {
						alert_lobibox("error", sysparam_datas_list[data.status]);
					}
				});
			} else {
				alert_lobibox("error", "Please Select To Reference Item");
			}
		}
	}
}

//Reference Item creation form validation
function refitemlink_form_validation(){
	return $('#refitemlink_form').valid();
}

$.validator.addMethod("valueNotEquals", function(value, element, arg){
	if(value == 0) {
		return false 
	} else {
		return true
	}
}, "Value must not equal arg.");

$("#refitemlink_form").validate({
	rules: {
		from_ref_id:{
			valueNotEquals:true
		},
		from_cat_id:{
			required:true,
			valueNotEquals:true
		},
		to_cat_id:{
			required:true,
			valueNotEquals:true
		},
		"to_ref_id":{
			required:true,
			valueNotEquals:true
		},
		
	},
	//For custom messages
	messages: {
		from_ref_id:{
			valueNotEquals:"Please Select From Reference Item",
		},
		from_cat_id:{
			valueNotEquals:"Please Select From Category"   
		},
		to_cat_id:{
			valueNotEquals:"Please Select To Category"   
		},
		to_ref_id:{
			valueNotEquals:"Please Select To Reference Item"
		}
		
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