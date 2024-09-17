function for hide inspect element
$(document).keydown(function(event){
    if(event.keyCode==123){
        return false;
    }
    else if (event.ctrlKey && event.shiftKey && event.keyCode==73){        
             return false;
    }
});

//$(document).on("contextmenu",function(e){        
//   e.preventDefault();
//});

//common function for ajax call
function send_data(url_type,url,data)
{  
	$.ajax(
			{
				type:url_type,
				url: url,
				data  : data,
			    async : false,
				success: function (json_data){
					if(json_data.delete_status=='NTE_04'){  alert_lobibox("success", sysparam_datas_list[json_data.delete_status]);/*alert_status(json_data.delete_status);*/   assessment_table_view();   assessment_template_cancel();}	
					else if(json_data.success_status=='NTE_01'){ alert_lobibox("success", sysparam_datas_list[json_data.success_status]);/*alert_status(json_data.success_status); */exist_id=json_data.inserted_id; assessment_table_view(); assessment_template_cancel();  $('.errormessage').html('');}
					else if(json_data.delete_status=='NTE_02'){ alert_lobibox("error", sysparam_datas_list[json_data.delete_status]);/*alert_status(json_data.delete_status);*/}
					else if(json_data.success_status=='NTE_02'){ alert_lobibox("error", sysparam_datas_list[json_data.success_status]); /*alert_status(json_data.success_status); */  $('.errormessage').html('');}
					else if(json_data.update_status=='NTE_03'){ alert_lobibox("success", sysparam_datas_list[json_data.update_status]);/*alert_status(json_data.update_status);*/assessment_table_view(); assessment_template_cancel();  $('.errormessage').html(''); update_id=''}
					else if(json_data.update_status=='NTE_02'){  alert_lobibox("error", sysparam_datas_list[json_data.update_status]); /*alert_status(json_data.update_status);*/   assessment_template_cancel();}
					else if(json_data.form_delete_status=='NTE_04'){ assessment_form_id_load('');alert_lobibox("success", sysparam_datas_list[json_data.form_delete_status]);/*alert_status(json_data.form_delete_status);*/ assessment_form_view(); assessment_form_cancel();}
					else if(json_data.form_delete_status=='NTE_02'){assessment_form_id_load(''); alert_lobibox("error", sysparam_datas_list[json_data.form_delete_status]);/*alert_status(json_data.form_delete_status);*/}
					else if(json_data.form_insert_status=='NTE_02'){alert_lobibox("error", sysparam_datas_list[json_data.form_insert_status]); /*alert_status(json_data.form_insert_status);*/ assessment_form_view();assessment_form_cancel();}
					else if(json_data.form_insert_status=='NTE_01'){ alert_lobibox("success", sysparam_datas_list[json_data.form_insert_status]);/*alert_status(json_data.form_insert_status);*/ assessment_form_view();  assessment_form_cancel();  $('.errormessage').html(''); ;assessment_form_id_load(json_data.inserted_id);}
					else if(json_data.form_update_status=='NTE_03'){ alert_lobibox("success", sysparam_datas_list[json_data.form_update_status]);/*alert_status(json_data.form_update_status);*/ assessment_form_view();  assessment_form_cancel()}
					else if(json_data.form_update_status=='NTE_04'){ alert_lobibox("success", sysparam_datas_list[json_data.form_update_status]);/*alert_status(json_data.form_update_status);*/ assessment_form_view(); assessment_form_cancel()}
					else if(json_data.status=='NTE_00'){ alert_lobibox("error",sysparam_datas_list["ERR0035"]) }
					else if(json_data.status=='NTE_UNIQUE'){ alert_lobibox("error",sysparam_datas_list["ERR0016"]) }
					else if(json_data.delete_status=='ERR0028'){ alert_lobibox("error", sysparam_datas_list[json_data.delete_status]);/*alert_status(json_data.delete_status);*/}
					else if(json_data.form_delete_status=='ERR0028'){assessment_form_id_load(''); alert_lobibox("error", sysparam_datas_list[json_data.form_delete_status]);/*alert_status(json_data.form_delete_status);*/} 
					else{alert_lobibox("error", sysparam_datas_list["ERR0034"]); }
				},
				error: function () {
					alert_lobibox("error", sysparam_datas_list['NTE_02']);
	                Success = false;//doesnt goes here
	            }
			})	
}
//validation for accept only letters
function validation(content,id)
{            
		      var letters = /^[A-Za-z]+$/;
		      if(content.match(letters))
		      {
		        return true;
		      }
		      else
		      {
		         document.getElementById(id).value = ''
		      return false;
		      }
}
//remove white space
function trim (el) {
    el.value = el.value.
       replace (/(^\s*)|(\s*$)/gi, ""). // removes leading and trailing spaces
       replace (/[ ]{2,}/gi," ").       // replaces multiple spaces with one space 
       replace (/\n +/,"\n");           // Removes spaces after newlines
    return;
}
//calculate total weightage
function total_weightage(event)
{
var total_value=0
var data
	$("#assessment_form_kpi_table  tr td:last-child").each(function() {
		var numbers = /^[0-9]+$/;
		 var content=$(this).find("input").val()
		 if(!content.match(numbers))
         {   
			 var text_value=content.replace(/[^0-9\-]/g, '');
			 $(this).find("input").val(text_value)
         }
		 data=parseInt($(this).find("input").val())
		 var isnum = /^\d+$/.test(data);   //allow only numeric
		 if (isNaN(data)) {               //check the value is integer else set 0
           data=0
           $(this).find("input").val('')
        }
		 else{
			  data=data
		}
		 total_value += data
		});
if(total_value>100)
	{
	$("#assessment_total_weightage").val(total_value)
	alert_lobibox("info", sysparam_datas_list["NTE_75"]);
	}
else{
 $("#assessment_total_weightage").val(total_value)}
}
//text transformation
 function text_transformation(id)
 {   
	 var x = document.getElementById(id);
	    x.value = x.value.toUpperCase();
 }
 // allow only integer
 var specialKeys = new Array();
 specialKeys.push(8);
 function IsNumeric(e) {
     var keyCode = e.which ? e.which : e.keyCode
     var ret = ((keyCode >= 48 && keyCode <= 57) || specialKeys.indexOf(keyCode) != -1);
     return ret;
 }
//DataTable without button function
function plaindatatable1(tbl_name, data_list, tbl_columns, hidden_col) {
	if ($.fn.DataTable.isDataTable('#'+tbl_name)) {
		$('#'+tbl_name).DataTable().destroy();
	} 
	var table = $("#"+tbl_name);
	table.dataTable({ 
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
        buttons:[],
		scrollY: 300,
		responsive: !0,
		order: [[0, "asc"]],
		paging:   false,
//		columnDefs: [ { orderable: false, targets: [2] } ],
//		lengthMenu: [[5, 10, 15, 20, -1], [5, 10, 15, 20, "All"]],
//		pageLength: 10,
		dom: "<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-12'><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-6 col-sm-12'i><'col-md-6 col-sm-12'lp>>"
	});
}
//datatable for manage role kpi table
function plaindatatable2(tbl_name, data_list, tbl_columns, hidden_col) {
	if ($.fn.DataTable.isDataTable('#'+tbl_name)) {
		$('#'+tbl_name).DataTable().destroy();
	} 
	var table = $("#"+tbl_name);
	table.dataTable({ 
		autoWidth: false,
		columns: tbl_columns,
		data: data_list,
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
			search: "Search:",
			zeroRecords: "No matching records found"
		},
		columnDefs: [{ "visible": false,  "targets": hidden_col }],
//		scrollY: 120,
		responsive: !0,
		order: [[1, "asc"]],
		lengthMenu: [[5, 10, 15, 20, -1], [5, 10, 15, 20, "All"]],
		pageLength: 10,
	});
}

//Validation for Drop Data
$.validator.addMethod("valueNotEquals", function(value, element, arg){
	if(value == 0) {
		return false
	} else {
		return true
	}
}, "Value must not equal arg.");

//Validation For assessment template 
$('#assessment_template_form').submit(function(e) {
		e.preventDefault();
	}).validate({
		rules: {
			assessment_template_name: { required: true, },  
			assessment_template_code: {
				required: true,
				maxlength: 20,
				minlength:5,
			}, 
			assessment_template_category:{ valueNotEquals:true,},
			assessment_template_role:{ valueNotEquals:true 	},
		},
		//For custom messages
		messages: {
			assessment_template_name: { required: "Enter the Template name", },
			assessment_template_code: { required: "Enter the Template code", },
			assessment_template_category: { valueNotEquals: "Select the category", },
			assessment_template_role: { valueNotEquals: "Select the role",},
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
function assessment_template_form_validation()
{
	return $('#assessment_template_form').valid();
}
//Validation For assessment form 
$('#assessment_form').submit(function(e) {
		e.preventDefault();
	}).validate({
		rules: {
			assessment_employee_name:{ valueNotEquals:true, },
			employee_assessment_category:{	valueNotEquals:true, },
			template_name: { required: true, }, 
			assessment_employee_role: { required: true, }, 
		},
		//For custom messages
		messages: {
			assessment_employee_name: { valueNotEquals: "Select the employee name", },
			employee_assessment_category: { valueNotEquals: "Select Category", },
			template_name: { required: "Template name",},
			assessment_employee_role: { required: "Role",},
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
function assessment_form_validation()
{
	return $('#assessment_form').valid();
}
