var global_assessment_form_id=''
	$(document).ready(function() {
		reviewer_button_display('add')
		assessment_form_id_load('');
		$('a[data-toggle="tab"]').on( 'shown.bs.tab', function (e) {
	        $($.fn.dataTable.tables( true ) ).css('width', '100%');
	        $($.fn.dataTable.tables( true ) ).DataTable().columns.adjust().draw();
	    } );
		$("#manager_review").prop("checked", true);
		reviewer_info('manager_review','')
	})
	var columndefs = [];
var reviewerInputId;
var arrayOfValues = [];
//onclick function for button display
function reviewer_button_display(flag)
{
	$("#reviewer_rating_button_div").empty();
	if (flag=='add')
	{
		var btnstr = '<button type="button" class="btn btn-success btn-eql-wid btn-animate margin-right-3"  onclick="reviewer_add_update();">Save</button>';
	}
	else
	{
		var btnstr = '<button type="button" class="btn btn-primary btn-eql-wid btn-animate margin-right-3" onclick="reviewer_add_update();">Update</button>';
		btnstr += '<button type="button" class="btn btn-danger btn-eql-wid btn-animate margin-right-3" onclick="reviewer_detail_remove();">Remove</button>';
	}
	btnstr += '<button type="button" class="- btn btn-warning btn-eql-wid btn-animate margin-right-3" onclick="reviewer_detail_clear_cancel();">Cancel / Clear</button>';
	$("#reviewer_rating_button_div").append(btnstr);	
}

//function reviewer_button_display(action_name){
//$("#reviewer_rating_button_div").html('');
//var btnstr = '';
//var access_for_create = jQuery.inArray( "assessment reviewer", JSON.parse(localStorage.Create) );
//var access_for_write = jQuery.inArray( "assessment reviewer", JSON.parse(localStorage.Write) );
//var access_for_delete = jQuery.inArray( "assessment reviewer", JSON.parse(localStorage.Delete) );
//if (action_name == 'add') {
//if (access_for_create != -1){
//    btnstr += '<button type="button" class="btn btn-success btn-eql-wid btn-animate margin-right-3"  onclick="reviewer_add_update();">Save</button>';
//}
//btnstr +=   '<button type="button" class="- btn btn-warning btn-eql-wid btn-animate margin-right-3" onclick="reviewer_detail_clear_cancel();">Cancel / Clear</button>';
//} else if (action_name == 'update') {
//if (access_for_write != -1){
//    btnstr += '<button type="button" class="btn btn-primary btn-eql-wid btn-animate margin-right-3" onclick="reviewer_add_update();">Update</button>';
//}
//if (access_for_delete != -1){
//    btnstr +='<button type="button" class="btn btn-danger btn-eql-wid btn-animate margin-right-3" onclick="reviewer_detail_remove();">Remove</button>';
//}
//btnstr +='<button type="button" class="- btn btn-warning btn-eql-wid btn-animate margin-right-3" onclick="reviewer_detail_clear_cancel();">Cancel / Clear</button>';
//}
//$("#reviewer_rating_button_div").append(btnstr);
//}


$('#attendance_popup_table').on('click', 'tbody tr', function(){
	if($(".form_reviewer_tab li.active").attr('id')=="assessment_review_tab")
		{
	 var arr=$('#attendance_popup_table').dataTable().fnGetData($(this)); 
	 sel_reviewer_id=arr[0]
	 sel_reviewer_name=arr[3]+" "+arr[4]
	 arrayOfValues=[]
	 if(sel_reviewer_id)
		 {
		 arrayOfValues.push(sel_reviewer_id)
		 $('#'+reviewerInputId).val(sel_reviewer_name);
			$('#hidden_'+reviewerInputId).val(sel_reviewer_id);
			$('#employeeReviewerModal').modal('hide');
		 }
	 else
		 {
		 $('#'+reviewerInputId).val('');
			$('#hidden_'+reviewerInputId).val('');
			$('#employeeReviewerModal').modal('hide');
		 }
		}
});
//Function for loading form_id from assessment form to pass matrix data 
function assessment_form_id_load(form_id)
{
	reviewer_button_display('update')
	if(form_id=='clear')
	{
		global_assessment_form_id='';
		$('.assessor_type_id').val('')
		$('.assessor_hidden_id').val('')
		$('#assessment_access_matrix_table>tbody>tr>th').siblings().each(function() {
			$('.assessment_permissioncheckbox',this).prop('checked',false);
		});
		$("input[name='assess_type']").attr("checked", false);		
	}
	else
	{
		global_assessment_form_id=form_id
		if (form_id!='')
		{
			if ($.fn.DataTable.isDataTable('#assessment_access_matrix_table')) {
				$('#assessment_access_matrix_table').DataTable().clear();
				$('#assessment_access_matrix_table').DataTable().destroy();
			}
			$.ajax({
				url: "/assessment_form_detail_fetch/",
				type: "POST",
				async:false,
				timeout : 10000,
				data:{'assessment_form_id':form_id,csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()}
			}).done( function(json_data) {
				if (json_data.status == "NTE_01") {
					reviewer_info(json_data.assessment_type,form_id)
					assessment_type=json_data.assessment_type
					if (assessment_type=="manager_review")
					{
						$('input[type=radio][value=manager_review]').prop('checked', true);
					}
					else if (assessment_type=="360_degree")
					{
						$('input[type=radio][value=360_degree]').prop('checked', true);
					}
					else
					{
						$('#manager_review').prop('checked', true);
					}
					if(json_data.employee_id)
					{
						$('.self_assessor_type_id').val(json_data.employee_name)
						$('.self_assessor_hidden_id').val(json_data.employee_id)
					}

				}
			});
		}
	}
}
//Onclick function for assessment type radio button
$("input[name=assess_type]:radio").click( function(){
	review_type=$(this).val()
	if (global_assessment_form_id)
	{
		reviewer_info(review_type,global_assessment_form_id)
	}
	else { reviewer_info(review_type,'') }
});
//Reviewer info div formation and data load
function reviewer_info(review_type,form_id)
{	
	$.ajax({
		type:"POST",
		url: "/reviewer_assessor_type_fetch/",
		data:{'review_type':review_type,'assessment_form_id':form_id,csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()},
		success: function (json_data) {
			if(json_data.status=="Success")
			{
				if ($.fn.DataTable.isDataTable('#assessment_access_matrix_table')) {
					$('#assessment_access_matrix_table').DataTable().clear();
					$('#assessment_access_matrix_table').DataTable().destroy();
				}
				employee_id=json_data.employee_id
				employee_name=json_data.employee_name
				$('#dynamic_reviewer_detail').empty();
				var template=''
					var assessor_type_list = json_data.assessor_type_list
					if (assessor_type_list.length!=0)
					for(var i=0; i<assessor_type_list.length; i++){
						if(assessor_type_list[i].refitems_code=="1SELF")
						{  
							template+='<div class="form-group assessor_detail"><label class="control-label">'+assessor_type_list[i].refitems_name+' <span class="required">*</span></label> <input type="text" id="'+assessor_type_list[i].id+'" class="form-control assessor_type_id self_assessor_type_id" placeholder="'+assessor_type_list[i].refitems_name+'" value="'+employee_name+'" readonly></input><input class="assessor_hidden_id self_assessor_hidden_id" type="hidden" id="hidden_'+assessor_type_list[i].id+'" value="'+employee_id+'"></input></div>'
						}
						else{
							 
						   	template+='<div class="form-group assessor_detail" ><div"><label class="control-label">'+assessor_type_list[i].refitems_name+' <span class="required">*</span></label> <input type="text" id="'+assessor_type_list[i].id+'" class="form-control assessor_type_id" placeholder="'+assessor_type_list[i].refitems_name+'" readonly></input><input class="assessor_hidden_id" type="hidden" id="hidden_'+assessor_type_list[i].id+'"></input><a class="btn btn-icon-only blue btn-animate" onclick="reviewerModalView(\''+assessor_type_list[i].id+'\')" data-toggle="modal"><i class="nf nf-search"></i> </a></div></div>'
						}
					}
				$('#dynamic_reviewer_detail').append(template)
				
				$('#assessment_access_matrix_table> thead').html('<tr><th class="fixed-side" scope="col" id="assessment_access_matrix_thead" style="font-weight:normal;"><span class=""> Roles </span></th></tr>');
				for (var j=0; j<assessor_type_list.length; j++){
					$("#assessment_access_matrix_table>thead>tr").append('<th style="font-weight:normal;"><span class="rotate-th">'+assessor_type_list[j].refitems_name+'</span></th>');
				}
				$("#assessment_access_matrix_tbody tr:gt(0)").remove(); 
				var tbody_append_str = '';
				for (var k=0; k<assessor_type_list.length; k++){
					tbody_append_str += '<tr><th class="txt-center fixed-side" data-index='+assessor_type_list[k].id+'>'+assessor_type_list[k].refitems_name+'</th>';
					for (var l=0; l<assessor_type_list.length; l++) {
						tbody_append_str += '<td><label class="label-cbx"><input type="checkbox" class="invisible assessment_permissioncheckbox" data-index='+assessor_type_list[l].id+' /><div class="checkbox"><svg width="20px" height="20px" viewBox="0 0 20 20"><path d="M3,1 L17,1 L17,1 C18.1045695,1 19,1.8954305 19,3 L19,17 L19,17 C19,18.1045695 18.1045695,19 17,19 L3,19 L3,19 C1.8954305,19 1,18.1045695 1,17 L1,3 L1,3 C1,1.8954305 1.8954305,1 3,1 Z"></path><polyline points="4 11 8 15 16 6"></polyline></svg></div><span></span></label></td>';
					}
					tbody_append_str += '</tr>';
				}
				$("#assessment_access_matrix_table>tbody").append(tbody_append_str);
				assessor_matrix_detail=json_data.assessor_matrix_detail

				if(assessor_matrix_detail.length!=0)
				{
					for(var i=0; i<assessor_matrix_detail.length; i++)
					{
						$('#assessment_access_matrix_table>tbody>tr>th[data-index="'+assessor_matrix_detail[i].assessor_view_role_id+'"]').siblings().each(function() {
							$('input[data-index="'+assessor_matrix_detail[i].assessor_viewer_role_id+'"]',this).prop('checked',assessor_matrix_detail[i].assessor_view_role_id);
						});
					}
				}
				else
				{
					$('#assessment_access_matrix_table>tbody>tr>th').siblings().each(function() {

						$('.assessment_permissioncheckbox',this).prop('checked',false);
					});
				}
				$('#assessment_access_matrix_table').DataTable({
					autoWidth:false,
					scrollY:        "300px",
					scrollX:        true,
					scrollCollapse: true,
					order: [[1, "asc"]],
					lengthMenu: [[5, 10, 15, 20, -1], [5, 10, 15, 20, "All"]],
					pageLength: 10,
					fixedColumns:   {
						leftColumns: 1
					},
					language: {
		            	   "zeroRecords": "No data available",
		            	   "search": ""
		               },
		               dom: "<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-12'><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-6 col-sm-12'i><'col-md-6 col-sm-12'lp>>",
		               buttons: [],
				});				
				assessor_info_detail=json_data.assessor_info_detail
				if(assessor_info_detail!=0)
				{   
					for(var i=0; i<assessor_info_detail.length; i++)
					{   
						{   
							$('#hidden_'+assessor_info_detail[i].assessor_type_id).val(assessor_info_detail[i].assessor_id)
							$('#'+assessor_info_detail[i].assessor_type_id).val(assessor_info_detail[i].assessor_name)
						}
					}
				}
				else
				{
					$('.assessor_type_id').val('')
					$('.assessor_hidden_id').val('')
				}
				if(employee_id)
				{
					$('.self_assessor_type_id').val(employee_name)
					$('.self_assessor_hidden_id').val(employee_id)
				}
			}
		}
	});
}
function reviewerModalView(inputId){
	employee_search("NTE-TS","NTE-SIN");
	reviewerInputId = inputId;
}
$("#attendance_popup_table").on("click", "tr", function() { 
	if (!this.rowIndex) return; // skip first row
	 var arr=$('#attendance_popup_table').dataTable().fnGetData($(this)); 
	 sel_reviewer_id=arr[0]
	 sel_reviewer_name=arr[3]+" "+arr[4]
	 arrayOfValues=[]
	 if(sel_reviewer_id)
		 {
		 arrayOfValues.push(sel_reviewer_id)
		 $('#'+reviewerInputId).val(sel_reviewer_name);
			$('#hidden_'+reviewerInputId).val(sel_reviewer_id);
			$('#employeeReviewerModal').modal('hide');
		 }
	 else
		 {
		 $('#'+reviewerInputId).val('');
			$('#hidden_'+reviewerInputId).val('');
			$('#employeeReviewerModal').modal('hide');
		 }
});
//Function for saving and updating reviewer and matrix data
function reviewer_add_update()
{
	var access_data = {};
	$('#assessment_access_matrix_table>tbody>tr').each(function() {
		var role_id = $("th:first", this).attr('data-index');
		var permission_dic = {};
		$(this).find('td>label>input.assessment_permissioncheckbox').each(function() {
			var permission_id = $(this).attr('data-index');
			var permission_value = $(this).prop('checked');
			permission_dic[permission_id] = permission_value;
		});
		access_data[role_id] = permission_dic;
	})
	var assessment_type=$('input[name=assess_type]:checked').val();
	assessor_info_input_status=''
		assessor_info_list=[]
	$('.assessor_detail ').each(function(i, obj) {
		assessor_info_list[i]={
				"assessor_type_id":$(obj).find('.assessor_type_id').prop('id'), 
				"assessor_id":$(obj).find('.assessor_hidden_id').val()

		}
		if($(obj).find('.assessor_hidden_id').val()=='')
		{
			assessor_info_input_status='empty'
		}
	})
	if(!$("input[name='assess_type']:checked").val())
	{
		alert_lobibox("error", sysparam_datas_list["NTE_41"]);
	}
	else if(assessor_info_input_status=='empty')
	{
		alert_lobibox("error", sysparam_datas_list["NTE_42"]);
	}
	else{
		$.ajax({
			url: "/assessment_access_insert/",
			type: "POST",
			data:{'access_data':JSON.stringify(access_data),'form_id':global_assessment_form_id,'assessor_info_list':JSON.stringify(assessor_info_list),'assessment_type':assessment_type,csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()}
		}).done( function(json_data) {
			if (json_data.status == "NTE_01") {
//				alert_status(json_data.status);
				alert_lobibox("success", sysparam_datas_list[json_data.status]);
			}
		})
	}
}
//Function for clear data in matrix and reviewer detail
function reviewer_detail_clear_cancel()
{   
	reviewer_button_display('add')
	$('.assessor_type_id').val('')
	$('.assessor_hidden_id').val('')
	$('#assessment_access_matrix_table>tbody>tr>th').siblings().each(function() {
		$('.assessment_permissioncheckbox',this).prop('checked',false);
	});
//	$("input[id='manager_review']").attr("checked", true);
	$("#manager_review").prop("checked", true);
	reviewer_info('manager_review','')
}
