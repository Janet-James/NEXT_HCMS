//Global variable declaration
salary_structure_id = 0
var salary_rule_data = [];
var salary_rule_condition_data=[];
var selected_array=[];
var structure_role_code=''
var structure_company_id = ''
var myTable;
var table;
var salary_rule_title = 'Structure Salary Rule'
	
$(document).ready(function(){
	salary_structure_table_dispaly();
	button_create_structure(1);
	select_salary_structure_table();
	code_auto_generate();
});

function select_salary_structure_table(){
	columns = [{'title':'ID'},{'title':'No.'},{'title':'Category'},{'title':'Rule Code'},{'title':'Rule Name'},{'title':'Validate'},{'title':'Value'},{'title':'Delete'},{'title':'Condition Id'}]
	plaindatatable_in('salary_structure_table', [], columns,[],'NEXT_TRANSFORM_HCMS_SALARY_STRUCTURE_RULE_'+currentDate(),salary_rule_title);
}

function salary_structure_table_dispaly(){
	$.ajax({	
		type  : 'POST',
		url   : '/salary_structure_table_display/',
		async : false,
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		if(data){
			salary_structure_datatable_function(data)
		}else{
			salary_structure_datatable_function(data)
		}
		
	});
}

//salary_structure data table function here
function salary_structure_datatable_function(data)
{
	var title_name = 'Salary Structure'
	datatable_list = []
	if(data.length > 0){
		datatable_list = []
		for(var i=0;i<data.length;i++){
			list = []
			var sno = i+1
			list.push(data[i].id,sno,data[i].company_name,data[i].structure_code,data[i].structure_name);
			datatable_list.push(list);
		}
		columns = [{'title':'ID'},{'title':'No.'},{'title':'Organization'},{'title':'Structure Code'},{'title':'Structure Name'}]
		plaindatatable_btn('salary_structure_details', datatable_list, columns,[0],'NEXT_TRANSFORM_HCMS_SALARY_STRUCTURE_'+currentDate(),title_name);
	}else{
		columns = [{'title':'ID'},{'title':'No.'},{'title':'Organization'},{'title':'Structure Code'},{'title':'Structure Name'}]
		plaindatatable_btn('salary_structure_details', datatable_list, columns,[0],'NEXT_TRANSFORM_HCMS_SALARY_STRUCTURE_'+currentDate(),title_name);
	}
	return false
}

//table row click get id
$("#salary_structure_details").on("click", "tr", function() {
	$(this).parents('table').find('tr').removeClass('active');
	$(this).addClass('active');
	/*var stable = $("#salary_structure_details");
	if ( $(this).hasClass('selected') ) {
            $(this).removeClass('selected');
            console.log($(this).addClass("selected"))
        }
        else {
        	console.log("===============")
        	stable.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
	*/
	
	var id = $('#salary_structure_details').dataTable().fnGetData(this)[0];
	//reg_table_id = id
	if (id != 'No data available'){
		salary_structure_table_row_click(id);
	}
});

//row click function in the table
function salary_structure_table_row_click(el){
	$('#move_salary_structure').trigger('click');
	$("#rule_remove").removeClass("active");
	$("#demo").addClass("active");
	$('#sal_struc_table_id').css('display', 'block');
	datatable_list = []
	button_create_structure(0);
	$.ajax(
			{
				type:"GET",
				url: "/salary_structure_table_row_click/",
				async: false,
				data : {'id':el},
				success: function (json_data) {
					data=JSON.parse(json_data);
					for(var i=0;i<data.length;i++){
						salary_structure_id = data[i].id;
						$('#salary_structure_name').val(data[i].structure_name); 
						$('#salary_structure_code').val(data[i].structure_code); 
						$('#salary_structure_company').val(data[i].company_id_id).trigger('change');
						$("#salary_structure_description").val(data[i].description);
						//get form value for field wise log list function
						payroll_activity_log_attribute_value('#salary_structure_form')
						list = []

						salary_rule_data.push(""+(data[i].salary_rule_id_id)+"")
						salary_rule_condition_data.push(""+(data[i].salary_rule_conditions_id_id)+"")
						if(data[i].salary_rule_id_id){
							list.push(data[i].salary_rule_id_id,i+1,data[i].refitems_name,data[i].salary_rule_code,data[i].salary_rule_name,data[i].salary_rule_validation,data[i].salary_rule_value_assignment,"<input type='button' id='salary_details' class='salary_deleterow btn btn-danger btn-eql-wid btn-animate' name='salary_delete' value='Delete' onclick='DeleteData1(this)'/>",data[i].salary_rule_conditions_id_id);
							datatable_list.push(list);
						}
						
					}
					columns = [{'title':'ID'},{'title':'No.'},{'title':'Category'},{'title':'Rule Code'},{'title':'Rule Name'},{'title':'Validate'},{'title':'Value'},{'title':'Delete'},{'title':'Condition Id'}]
					plaindatatable_in('salary_structure_table', datatable_list, columns,[],'NEXT_TRANSFORM_HCMS_SALARY_STRUCTURE_RULE_'+currentDate(),salary_rule_title);
				}
			});
	return false;
}

//button create function here
function button_create_structure(status){
	var access_for_create = jQuery.inArray( "Payroll Setup", JSON.parse(localStorage.Create) );
	var access_for_write = jQuery.inArray( "Payroll Setup", JSON.parse(localStorage.Write) );
	var access_for_delete = jQuery.inArray( "Payroll Setup", JSON.parse(localStorage.Delete) );
	if(status == 1){
		if (access_for_create != -1){
		strAppend = "<button type='button' onclick='salary_structure_create_button()' class='btn btn-success btn-eql-wid btn-animate'>Add</button>"
		}strAppend += " <button type='button' onclick='salary_structure_clear_btn_refresh()' class='btn btn-warning btn-animate btn-eql-wid btn-animate'>Cancel / Clear</button>"
				$('#hrms_salary_structure_btn').html(strAppend);
	}else{
		if (access_for_write != -1){
		strAppend = "<button type='button' onclick='salary_structure_edit_button()' class='btn btn-primary btn-eql-wid btn-animate '>Update</button>"
		}if (access_for_delete != -1){
			strAppend += " <button type='button' onclick='salary_structure_delete_button()' class='btn btn-danger btn-eql-wid btn-animate '>Remove</button>"
		}
				strAppend += " <button type='button' onclick='salary_structure_clear_btn_refresh()' class='btn btn-warning btn-animate btn-eql-wid btn-animate'>Cancel / Clear</button>"
					$('#hrms_salary_structure_btn').html(strAppend);
	}
}

//fetch Table data ajax function salary rule table data 
function salary_rule_table_view_pop(){
	$.ajax(
			{
				type:"GET",
				url: "/salary_rule_popup_table/",
				async: false,
				success: function (json_data) {
					data=JSON.parse(json_data);
					salary_popup_table_creation(data);
				}
			});
}

//table creation function for salary rule
function salary_popup_table_creation(data){
	var values = []
	var oTable = $("#salary_structure_table").dataTable();
	$(oTable.fnGetNodes()).each(function() {
		var strAppend = ''
			strAppend = $(this).closest('tr').find('td').eq(8).text()+','
			values.push(strAppend.slice(0,-1));
	}).get();
	if(data.length > 0){
		datatable_list = []
		if(data.length){
			for(var i=0;i<data.length;i++){
				list = []
				var sno = i+1
				list.push(data[i].id,sno,'<input type="checkbox" class="label-cbx checkbox" name="salary_rule_chkbox"/>',data[i].refitems_name,data[i].salary_rule_code,data[i].salary_rule_name,data[i].salary_rule_validation,data[i].salary_rule_value_assignment,data[i].salary_rule_condition_id);
				var count = 0
				for(var j=0;j<values.length;j++){
					if(data[i].salary_rule_condition_id == values[j]){
						count = 1
					}
				}
				if(!count){datatable_list.push(list);}
			}
		}
		columns = [{'title':'ID'},{'title':'No.'},{'title':'Select'},{'title':'Category'},{'title':'Rule Code'},{'title':'Rule Name'},{'title':'Validate'},{'title':'Value'},{'title':'Condition Id'}]
		plaindatatable_in('salary_rules_add_tbl', datatable_list, columns,[0,8],'NEXT_TRANSFORM_HCMS_SALARY_STRUCTURE_RULE_'+currentDate(),salary_rule_title);
	}
	else{
		columns = [{'title':'ID'},{'title':'No.'},{'title':'Select'},{'title':'Category'},{'title':'Rule Code'},{'title':'Rule Name'},{'title':'Validate'},{'title':'Value'},{'title':'Validate'},{'title':'Condition Id'}]
		plaindatatable_in('salary_rules_add_tbl', '', columns,[0,8],'NEXT_TRANSFORM_HCMS_SALARY_STRUCTURE_RULE_'+currentDate(),salary_rule_title);
	}
	return false
}

//salary Rule add pop up
$('#salary_rule_add').click(function () {
	$('#salary_rule_add_modal').modal('show');
	salary_rule_table_view_pop();
	return false
});



//On click Create Button For Select salary rule data
$(document).on('click','#select_salary_rule',function(){
	$('#move_salary_structure').trigger('change');
	$('#sal_struc_table_id').css('display', 'block');
	var values = [];
	//var val = []
	var values_condition=[];
	salary_rule_condition_data = []
	//For Salary Rule Id Global Storage
	var oTable = $("#salary_rules_add_tbl").dataTable();
	$("input:checkbox:checked", oTable.fnGetNodes()).each(function() {
		var strAppend = ''
			strAppend = $(this).closest('tr').find('td').eq(0).text()+','
			values.push(strAppend.slice(0,-1));
	}).get();
	/*$.each($("input[name='salary_rule_chkbox']:checked").closest("tr"),
			function () {
		val.push($('#salary_rules_add_tbl').dataTable().fnGetData(this)[0]);
	});*/
	values.forEach(function(value,index)
			{
		salary_rule_data.push(values[index])
			})
			selected_array = Array.from(new Set(salary_rule_data))
			//For Salary Rule Conditions Global Storage
			$("input:checkbox:checked", oTable.fnGetNodes()).each(function() {
				var strAppend = ''
					strAppend = $(this).closest('tr').find('td').eq(8).text()+','
					values_condition.push(strAppend.slice(0,-1));
			}).get();
	/*$.each($("input[name='salary_rule_chkbox']:checked").closest("tr").find('td:eq(8)'),
			function () {
		values_condition.push($(this).text());
	});*/
	values_condition.forEach(function(value,index){
		salary_rule_condition_data.push(values_condition[index])
	})
	$.ajax(
			{
				type:"GET",
				url: "/salary_rule_main_table/",
				data:{'id':JSON.stringify(Array.from(new Set(salary_rule_data))),'condition_id':JSON.stringify(Array.from(new Set(salary_rule_condition_data)))},
				async: false,
				success: function (json_data) {
					data=JSON.parse(json_data);
					myTable = $("#salary_structure_table").dataTable();
					salary_table_creation(data);
				}
			});
});

//table creation function for Selected salary rule
function salary_table_creation(data){
	if(data.length > 0){
		datatable_list = []
		if(data.length){
			for(var i=0;i<data.length;i++){
				list = []
				var sno = i+1
				list.push(data[i].id,sno,data[i].refitems_name,data[i].salary_rule_code,data[i].salary_rule_name,data[i].salary_rule_validation,data[i].salary_rule_value_assignment,"<input type='button' id='salary_details' class='salary_deleterow btn btn-danger btn-eql-wid btn-animate' name='salary_delete' value='Delete' onclick='DeleteData1(this)'/>",data[i].salary_rule_condition_id);
				datatable_list.push(list);
			}
		}
		//columns = [{'title':'ID'},{'title':'No.'},{'title':'Category'},{'title':'Rule Code'},{'title':'Rule Name'},{'title':'Validate'},{'title':'Value'},{'title':'Delete'},{'title':'Condition Id'}]
		//plaindatatable_in('salary_structure_table', datatable_list, columns,[]);
		myTable.fnAddData(datatable_list)
	}
	else{
		columns = [{'title':'ID'},{'title':'No.'},{'title':'Category'},{'title':'Rule Code'},{'title':'Rule Name'},{'title':'Validate'},{'title':'Value'},{'title':'Delete'},{'title':'Condition Id'}]
		plaindatatable_in('salary_structure_table', '', columns,[0,8]);
	}
	return false
}

//Delete button Functionality of row 
function DeleteData1(row_click_data) {

	/*var row = row_click_data.parentNode.parentNode;
	row.parentNode.removeChild(row);
	var table_name = document.getElementById('salary_rules_add_tbl');

	salary_rule_data = []
	salary_rule_condition_data=[]
	var row_length = table_name.rows.length
	for (var r = 1 ; r < row_length; r++) {
		for (var c = 0; c < 1 ; c++) {
			salary_rule_data.push(table_name.rows[r].cells[c].innerHTML)
		}
	}
	for (var r = 1 ; r < row_length; r++) {
		for (var c = 9; c < 10 ; c++) {
			salary_rule_condition_data.push(table_name.rows[r].cells[c].innerHTML)
		}
	}*/
	
	var table_name = document.getElementById('salary_rules_add_tbl');
	var delete_data = $(row_click_data).parents('tr').find('td:eq(0)').text();
	salary_rule_condition_data.push(delete_data)
	$(row_click_data).parents('tr').addClass('del_sample')
	myTable.fnDeleteRow( $(row_click_data).parents('tr'), null, true ); 
}

//Contribution Register details create function here 
function salary_structure_create_button() {
	if(salary_structure_form_validation())
	{
		var tableName = $("#salary_structure_table").dataTable();
		$('#sal_struc_table_id').css('display', 'block');
		var table_id = new Array();
		  $(tableName.fnGetNodes()).each(function () {
			var firstCell = $(this).find('td').first();
			var lastCell  = $(this).find('td').last();
			table_id.push({'salary_rule_id':$(firstCell).text(),'salary_condition_id':$(lastCell).text()});
		});
		salary_structure_create_function(table_id);
	}
}

//Contribution Register form validation here
function salary_structure_form_validation()
{
	return $('#salary_structure_form').valid();
}

//Contribution Register create function here
function salary_structure_create_function(table_id)
{
	var salary_structure_form_value = getFormValues("#salary_structure_form");
	var csrf_data = salary_structure_form_value.csrfmiddlewaretoken;
	delete salary_structure_form_value["csrfmiddlewaretoken"];
	salary_structure_form_value['is_active'] = "True";

	salary_structure_form_value['structure_name'] = validationFields(salary_structure_form_value['structure_name']);
	salary_structure_form_value['structure_code'] = validationFields(salary_structure_form_value['structure_code']);
	salary_structure_form_value['company_id'] = validationFields(salary_structure_form_value['company_id']);
	salary_structure_form_value['description'] = validationFields(salary_structure_form_value['description']);

	salary_structure_list = [];
	salary_structure_dict = {};
	salary_structure_list.push(salary_structure_form_value);
	salary_structure_dict['input_data'] = salary_structure_list;
	var salary_structure_activity_list = []
	//get form value for field wise log list function
	salary_structure_activity_list = payroll_activity_log('#salary_structure_form')
	$.ajax({	
		type  : 'POST',
		url   : '/salary_structure_create/',
		async : false,
		data: {
			'datas': JSON.stringify(salary_structure_dict),
			'log_data':JSON.stringify(salary_structure_activity_list),
			"table_id": salary_structure_id,
			"salary_table_id": JSON.stringify(table_id),
			csrfmiddlewaretoken: csrf_data,
		},
		 error:(function(error){
	 			if(~error.responseText.indexOf("already exists")){
	 				alert_lobibox("error","Salary Structure Code Already Exist")
	 			}
	 		})
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		var res_status = data['status'];
		if(res_status == 'NTE_01') {	
			alert_lobibox("success", sysparam_datas_list[res_status]);
			button_create_structure(1)
			salary_structure_clear_btn_refresh();
			salary_structure_table_dispaly();	
			select_salary_structure_table();
			$('#salary_structure_code').val('');
			code_auto_generate();
			salary_structure_activity_list = []
			payroll_log_activity();
		}else if(res_status == 'NTE_03') {	
			alert_lobibox("success", sysparam_datas_list[res_status]);
			button_create_structure(1)
			salary_structure_clear_btn_refresh();
			salary_structure_table_dispaly();	
			salary_structure_activity_list = []
			select_salary_structure_table();
			payroll_log_activity()
		}
		else {
			alert_lobibox("error",sysparam_datas_list['ERR0040'])
		}
	});
}

//update function
function salary_structure_edit_button(){
	if(salary_structure_form_validation())
	{
		var tableName = $("#salary_structure_table").dataTable();
		$('#sal_struc_table_id').css('display', 'block');
		var table_id = new Array();
		$(tableName.fnGetNodes()).each(function () {
			var LastCell = $(this).find('td').last();
			table_id.push($(LastCell).text());
		});
		salary_structure_create_function(table_id);
	}
}

//delete function
function salary_structure_delete_button(){
	$('#sal_struc_table_id').css('display', 'block');
	var structure_title = $('#salary_structure_name').val();
	removeConfirmation('salary_structure_details_delete_function','',structure_title);
}

//delete function
function salary_structure_details_delete_function(){
	$.ajax({	
		type  : 'POST',
		url   : '/salary_structure_create/',
		async : false,
		data: {
			"delete_id": salary_structure_id,
			csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val(),
		},
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		var res_status = data['status'];
		if(res_status == 'NTE_04') {	
			alert_lobibox("success", sysparam_datas_list[res_status]);
			button_create_structure(1)
			salary_structure_clear_btn_refresh();
			salary_structure_table_dispaly();	
			$('#salary_structure_code').val('');
			code_auto_generate();
			salary_structure_activity_list = []
			payroll_log_activity();
		}
		else {
			alert_lobibox("error",sysparam_datas_list['ERR0028'])
		}
	});
}

//validation for the empty
function validationFields(val){
	return val=='' || val =='0' ?null:val 
}

$.validator.addMethod("alpha", function(value, element) {
    return this.optional(element) || value == value.match(/^[a-zA-Z\s]+$/);
});

//contribution register form validation
$('#salary_structure_form').submit(function(e) {
	e.preventDefault();    
}).validate({
	rules: {
		salary_structure_name: {
			required: true,
			maxlength: 50,	
		    alpha: true,
		},
		salary_structure_code: {
			alpha:true,
			required:true,
			maxlength:5,
			minlength:5,
		},	  	   
		salary_structure_company: {
			required: true,
			valueNotEquals:true, 
		},
	},
	//For custom messages
	messages: {
		salary_structure_name: {
			required: "Enter Salay Structure name",
			maxlength: "Name cannot exceed 50 characters",
			alpha: "Name cannot have numbers",
		},       
		salary_structure_code: {
			required: "Enter Salay Structure code", 
			alpha: "Code cannot have numbers",
			maxlength: "Salay Structure code cannot exceed 5 digits",
			minlength: "Salay Structure cannot lesser than 5 digits",    	  
		},	   
		salary_structure_company: {
			required: "Select Company",
			valueNotEquals: "Select Company", 
		},	 

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

jQuery.validator.addMethod('valueNotEquals', function (value) {
	return (value != '0');
}, "");

// salary structure clear function
function salary_structure_clear_btn_refresh(){
	button_create_structure(1);
	salary_structure_id = 0
	$('.thumbnail').html("")
	$('.errormessage').html("");	
	$('#salary_structure_name').val(''); 
	//$('#salary_structure_code').val(''); 
	$('#salary_structure_description').val('');
	$("#salary_structure_code").val('')
	$("#salary_structure_company").val(0).trigger('change');	
	code_auto_generate()
	//$('#sal_struc_table_id').css('display', 'none');
	//mytable.fnDeleteRow( $('#salary_structure_table>tbody>tr'), null, true ); 
}

$("#salary_structure_company").change(function(){
	$("#salary_structure_company_clear").html('')
});

var now = new Date();
var jsDate = now.getDate()+'-'+(now.getMonth()+1)+'-'+now.getFullYear();
//Datatable with button function
function plaindatatable_in(tbl_name, data_list, tbl_columns, hidden_col,filename,salary_rule_title) {
	if ($.fn.DataTable.isDataTable('#'+tbl_name)) {
		$('#'+tbl_name).DataTable().destroy();
	} 
	if (hidden_col.length != undefined) {
		hidden_col_colvis = hidden_col.length -1;
	} else {
		hidden_col_colvis = hidden_col
	}
	 table = $("#"+tbl_name);
	 myTable = table.dataTable({
		autoWidth: false,
		columns: tbl_columns,
		data: data_list,
		"bDestroy": true,
		language: {
			aria: {
				sortAscending: ": activate to sort column ascending",
				sortDescending: ": activate to sort column descending"
			},
			emptyTable: "No data available",
			info: "Showing _START_ to _END_ of _TOTAL_ entries",
			infoEmpty: "No entries found",
			infoFiltered: "(filtered1 from _MAX_ total entries)",
			lengthMenu: "_MENU_ entries",
			search: "",
			zeroRecords: "No matching records found"
		},
		buttons: [{
			extend: 'collection',
			className: "exporticon",
			text: 'Export',
			buttons: [{
				extend: "pdf",
				className: "pdficon",
				title: filename,
				exportOptions: {
					columns: ':visible'
				},
				customize: function (doc) { pageNumberPDF(doc,tbl_columns,salary_rule_title) }
			}, {
				extend: "excel",
				className: "excelicon",
				title: filename,
				exportOptions: {
					columns: ':visible'
				},
				customize: function(xlsx) { pageHeaderExcel(xlsx,table.fnGetData().length) }
			}, {
				extend: "csv",
				className: "csvicon",
				title: filename,
				exportOptions: {
					columns: ':visible'
				},
				customize: function (csv) {
					return "My header NEXT Inc.\n\n NEXT Inc.\n"+  csv;
				}
			}],
		},{
			extend: "print",
			className: "printicon",
			exportOptions: {
				columns: ':visible'
			},
			message: '<p style="text-align:center;"><img src="data:image/png;base64,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/GMzLdsAAERIaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/Pgo8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzA2NyA3OS4xNTc3NDcsIDIwMTUvMDMvMzAtMjM6NDA6NDIgICAgICAgICI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgICAgICAgICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICAgICAgICAgICB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIKICAgICAgICAgICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgICAgICAgICAgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiCiAgICAgICAgICAgIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIj4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNSAoV2luZG93cyk8L3htcDpDcmVhdG9yVG9vbD4KICAgICAgICAgPHhtcDpDcmVhdGVEYXRlPjIwMTUtMTAtMTVUMTQ6NTQ6MDIrMDU6MzA8L3htcDpDcmVhdGVEYXRlPgogICAgICAgICA8eG1wOk1ldGFkYXRhRGF0ZT4yMDE4LTAxLTA1VDEyOjE0OjEzKzA1OjMwPC94bXA6TWV0YWRhdGFEYXRlPgogICAgICAgICA8eG1wOk1vZGlmeURhdGU+MjAxOC0wMS0wNVQxMjoxNDoxMyswNTozMDwveG1wOk1vZGlmeURhdGU+CiAgICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2UvcG5nPC9kYzpmb3JtYXQ+CiAgICAgICAgIDx4bXBNTTpJbnN0YW5jZUlEPnhtcC5paWQ6MGRiNTUxYjgtMzBkMC02YTQyLTllMDAtZTQwODQzYTNhNTcxPC94bXBNTTpJbnN0YW5jZUlEPgogICAgICAgICA8eG1wTU06RG9jdW1lbnRJRD5hZG9iZTpkb2NpZDpwaG90b3Nob3A6YzFiZTU2N2ItZTU4NC0xMWU3LWJkYWMtZjZhNTBlMjg1MTg5PC94bXBNTTpEb2N1bWVudElEPgogICAgICAgICA8eG1wTU06T3JpZ2luYWxEb2N1bWVudElEPnhtcC5kaWQ6YzQ2ZjQyMWEtYWZhYi1lYjQ5LWE3NmItNmU2MmUxMzg3ZGI3PC94bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpIaXN0b3J5PgogICAgICAgICAgICA8cmRmOlNlcT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+Y3JlYXRlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOmM0NmY0MjFhLWFmYWItZWI0OS1hNzZiLTZlNjJlMTM4N2RiNzwvc3RFdnQ6aW5zdGFuY2VJRD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OndoZW4+MjAxNS0xMC0xNVQxNDo1NDowMiswNTozMDwvc3RFdnQ6d2hlbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnNvZnR3YXJlQWdlbnQ+QWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKTwvc3RFdnQ6c29mdHdhcmVBZ2VudD4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6YWN0aW9uPnNhdmVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDppbnN0YW5jZUlEPnhtcC5paWQ6ODA3NjRjMGMtZGMxNi05YTRjLTljOWItODI5NjE5NTk5ZGY5PC9zdEV2dDppbnN0YW5jZUlEPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6d2hlbj4yMDE1LTEwLTE1VDE1OjAwOjM4KzA1OjMwPC9zdEV2dDp3aGVuPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6c29mdHdhcmVBZ2VudD5BZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpPC9zdEV2dDpzb2Z0d2FyZUFnZW50PgogICAgICAgICAgICAgICAgICA8c3RFdnQ6Y2hhbmdlZD4vPC9zdEV2dDpjaGFuZ2VkPgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+c2F2ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0Omluc3RhbmNlSUQ+eG1wLmlpZDplMmQxMzE5Mi1mOTQ0LWI1NGMtYTAwNy1kZGE1OGE1ZGMzMTY8L3N0RXZ0Omluc3RhbmNlSUQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDp3aGVuPjIwMTYtMDUtMjVUMTk6NDk6MjgrMDU6MzA8L3N0RXZ0OndoZW4+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpzb2Z0d2FyZUFnZW50PkFkb2JlIFBob3Rvc2hvcCBDQyAoV2luZG93cyk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpjaGFuZ2VkPi88L3N0RXZ0OmNoYW5nZWQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5jb252ZXJ0ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnBhcmFtZXRlcnM+ZnJvbSBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIHRvIGltYWdlL3BuZzwvc3RFdnQ6cGFyYW1ldGVycz4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6YWN0aW9uPmRlcml2ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnBhcmFtZXRlcnM+Y29udmVydGVkIGZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9wbmc8L3N0RXZ0OnBhcmFtZXRlcnM+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5zYXZlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOjM5OWQ1NWI1LTZlMTctMTg0ZC04YTI1LTNmMGJjZDE4ZTk2YTwvc3RFdnQ6aW5zdGFuY2VJRD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OndoZW4+MjAxNi0wNS0yNVQxOTo0OToyOCswNTozMDwvc3RFdnQ6d2hlbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnNvZnR3YXJlQWdlbnQ+QWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKTwvc3RFdnQ6c29mdHdhcmVBZ2VudD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmNoYW5nZWQ+Lzwvc3RFdnQ6Y2hhbmdlZD4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6YWN0aW9uPnNhdmVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDppbnN0YW5jZUlEPnhtcC5paWQ6MGRiNTUxYjgtMzBkMC02YTQyLTllMDAtZTQwODQzYTNhNTcxPC9zdEV2dDppbnN0YW5jZUlEPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6d2hlbj4yMDE4LTAxLTA1VDEyOjE0OjEzKzA1OjMwPC9zdEV2dDp3aGVuPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6c29mdHdhcmVBZ2VudD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNSAoV2luZG93cyk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpjaGFuZ2VkPi88L3N0RXZ0OmNoYW5nZWQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICA8L3JkZjpTZXE+CiAgICAgICAgIDwveG1wTU06SGlzdG9yeT4KICAgICAgICAgPHhtcE1NOkRlcml2ZWRGcm9tIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgPHN0UmVmOmluc3RhbmNlSUQ+eG1wLmlpZDplMmQxMzE5Mi1mOTQ0LWI1NGMtYTAwNy1kZGE1OGE1ZGMzMTY8L3N0UmVmOmluc3RhbmNlSUQ+CiAgICAgICAgICAgIDxzdFJlZjpkb2N1bWVudElEPnhtcC5kaWQ6YzQ2ZjQyMWEtYWZhYi1lYjQ5LWE3NmItNmU2MmUxMzg3ZGI3PC9zdFJlZjpkb2N1bWVudElEPgogICAgICAgICAgICA8c3RSZWY6b3JpZ2luYWxEb2N1bWVudElEPnhtcC5kaWQ6YzQ2ZjQyMWEtYWZhYi1lYjQ5LWE3NmItNmU2MmUxMzg3ZGI3PC9zdFJlZjpvcmlnaW5hbERvY3VtZW50SUQ+CiAgICAgICAgIDwveG1wTU06RGVyaXZlZEZyb20+CiAgICAgICAgIDxwaG90b3Nob3A6Q29sb3JNb2RlPjM8L3Bob3Rvc2hvcDpDb2xvck1vZGU+CiAgICAgICAgIDxwaG90b3Nob3A6SUNDUHJvZmlsZT5zUkdCIElFQzYxOTY2LTIuMTwvcGhvdG9zaG9wOklDQ1Byb2ZpbGU+CiAgICAgICAgIDxwaG90b3Nob3A6RG9jdW1lbnRBbmNlc3RvcnM+CiAgICAgICAgICAgIDxyZGY6QmFnPgogICAgICAgICAgICAgICA8cmRmOmxpPjI3OTVCQ0Y1MjZBMEQ1ODI0MkVDRkI4MUM5QTEzMjA0PC9yZGY6bGk+CiAgICAgICAgICAgICAgIDxyZGY6bGk+eG1wLmRpZDo5MTI1N2VkYy00OTdjLTk0NDEtYWZhMS03NTVhODQxM2I2NzM8L3JkZjpsaT4KICAgICAgICAgICAgICAgPHJkZjpsaT54bXAuZGlkOmM0NmY0MjFhLWFmYWItZWI0OS1hNzZiLTZlNjJlMTM4N2RiNzwvcmRmOmxpPgogICAgICAgICAgICA8L3JkZjpCYWc+CiAgICAgICAgIDwvcGhvdG9zaG9wOkRvY3VtZW50QW5jZXN0b3JzPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpYUmVzb2x1dGlvbj43MjAwMDAvMTAwMDA8L3RpZmY6WFJlc29sdXRpb24+CiAgICAgICAgIDx0aWZmOllSZXNvbHV0aW9uPjcyMDAwMC8xMDAwMDwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6UmVzb2x1dGlvblVuaXQ+MjwvdGlmZjpSZXNvbHV0aW9uVW5pdD4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT4xPC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDxleGlmOlBpeGVsWERpbWVuc2lvbj42OTwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj42MDwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgIAo8P3hwYWNrZXQgZW5kPSJ3Ij8+V0IgzQAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAARu0lEQVR42uSbfaykVX3HP+ecZ95n7vsuLOCuhcKiWAEj2Koh9sVUTEwES2ippLFW/9CyuGBVRKJVY0w1sW1MaEzaGmMaggK7S3mzCIIUq5SXvQvsK8uy7y935869M3fuzDwvp3+c88yceeaZ+6Jla+okJ8/cyZ25z/nO7/f9fn+/37lCa83t9z/LUo8cIS0U/xi+lQUyQ38vIyEjICchKyGnoKSgYFcxXp55Pb7GzyselLze7xUUFKS55mTvc7P272QkKEAKEM59hJEm1Bo/Aj/StENNy652CG3nNT+CZhAxkZOXqdHCjze/wITHb+BD26sUEGk9eVYpc2e1FV73ibsOcKQW1eVvIijSALLWD7lzLJ+Zqbai6z75o2McqQYwnuM3JlJEnGaCqyLNpxq+vqaY85hphWx65AiHZwOYLADi/zcoAhACT8C7NVwXRFzTCvS6Wjsin/WotUNufuQwB6s+TBZBC5BnABTtXPWQn4etYZ+1xGME+G0JF4dwmYa3hxFXdCLKC4Gm4Wtm2xEjhQzVVsCmhw/x2owPUzEg0qC4ko1FCHJEVPBZ0BkQVIBrbXoGaQAstRm9zLebAoYAlAAPyAIFoCSg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"></p><p style="text-align:center;">Date : '+jsDate.toString()+' </p>',
			customize: function (win) {
				$body = $(win.document.body);
				$body.find('h1').css('text-align', 'center');
			}
		}, {
			extend: "copy",
			className: "copyicon",
			exportOptions: {
				columns: ':visible'
			}
		},  {
			extend: "colvis",
			className: "colvisicon",
			text: "Columns",
			columns: ':gt('+2+')'
		}],
		"aoColumnDefs": [ {"sClass": "dt_col_hide", "aTargets": [0,8]}],//Hiding the Column
		responsive: !0,
		order: [[0, "asc"]],
		lengthMenu: [[5, 10, 15, 20, -1], [5, 10, 15, 20, "All"]],
		pageLength: 5,
		//dom: "<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>"
		dom: "<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-12'><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-6 col-sm-12'i><'col-md-6 col-sm-12'lp>>",
	});

	if (!table.fnGetData().length) {
		$("#"+tbl_name).dataTable().fnDestroy();
		$("#"+tbl_name).DataTable( {
			autoWidth: false,
			columns: tbl_columns,
			searching: false,
			lengthChange: false,
			language: {
				emptyTable: "No data available"
			},
			//columnDefs: [{ "visible": false, "targets": hidden_col }],
			"aoColumnDefs": [ {"sClass": "dt_col_hide", "aTargets": [0,8]}],//Hiding the Column
		});
	}
}

$('#salary_structure_code').keyup(function(){
    $(this).val($(this).val().toUpperCase());
});
$('#salary_structure_name').keyup(function(){
    $(this).val($(this).val().charAt(0).toUpperCase() + $(this).val().slice(1));
});

function code_auto_generate() {
	$.ajax(
			{
				type:"GET",
				url: "/salary_structure_code_generate/",
				async: false,
			}).done(function(json_data) {
				var structure_code = JSON.parse(json_data);
				if (structure_code){
					$("#salary_structure_code").val(structure_code.code)
				}
			});
}

