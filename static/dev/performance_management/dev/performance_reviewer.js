var global_assessment_form_id=''
var clicked_form_id=''
var assessor_info_detail=''
var employee_array=[]
//load data only tab click
function reviewer_tab() {
	var month_names = ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	var today = new Date();
	var day = today.getDate();
	var month_index = today.getMonth();
	var year = today.getFullYear();
	current_date=day + "-" + month_names[month_index] + "-" + year
	if(current_date=='' || current_date==undefined )
	{
		current_date=''
	}
	assessment_revierer_form_view();
	reviewer_detail_clear_cancel();
	$('a[data-toggle="tab"]').on( 'shown.bs.tab', function (e) {
        $($.fn.dataTable.tables( true ) ).css('width', '100%');
        $($.fn.dataTable.tables( true ) ).DataTable().columns.adjust().draw();
    } );
	}
var columndefs = [];
var reviewerInputId;
var arrayOfValues = [];
function reviewer_info(review_type,form_id)   // dynamic load reviewer data from html formation
{	
	$.ajax({
		type:"POST",
		url: "/reviewer_assessor_fetch/",
		data:{'review_type':review_type,'assessment_form_id':form_id,csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()},
		success: function (json_data) {
			if(json_data.status=="Success")
			{
				if ($.fn.DataTable.isDataTable('#assessment_access_matrix_table')) {
					$('#assessment_access_matrix_table').DataTable().clear();
					$('#assessment_access_matrix_table').DataTable().destroy();
				}
				if(json_data.employee_data.length>0)
				{
					employee_id=json_data.employee_data[0]['employee_id']
					employee_name=json_data.employee_data[0]['first_name']+' '+json_data.employee_data[0]['last_name']
				}
				else{employee_id=''; employee_name='' }
				$('#dynamic_reviewer_detail').empty();
				var template=''
					var assessor_type_list = json_data.assessor_type_list
					if (assessor_type_list.length!=0)
					for(var i=0; i<assessor_type_list.length; i++){
						if(assessor_type_list[i].refitems_code=="1SELF")
						{  
							template+='<div class="form-group assessor_detail"><label class="control-label">'+assessor_type_list[i].refitems_name+' <span class="required">*</span></label> <input type="text" id="'+assessor_type_list[i].id+'" class="form-control assessor_type_id self_assessor_type_id" placeholder="'+assessor_type_list[i].refitems_name+'" value="'+employee_name+'" readonly></input><input class="assessor_hidden_id self_assessor_hidden_id" type="hidden" id="'+employee_id+'" value="'+employee_id+'"></input></div>'
						}
						else{
							 
						   	template+='<div class="form-group assessor_detail" ><div"><label class="control-label">'+assessor_type_list[i].refitems_name+' <span class="required">*</span></label><select id="'+assessor_type_list[i].id+'" name="employeee_name" class="form-control select2-multiple alter" multiple ></select><input class="assessor_hidden_id" type="hidden" value="'+assessor_type_list[i].id+'"></input></div></div>'
						}
					}
				$('#dynamic_reviewer_detail').append(template)
				$(".alter").select2();	
				if(form_id){ employee_data(1,1,1) }
				
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
				var assesser_id_array=[]
				var select_assesser_type_id=[]
				var select_assesser_id=[]
				
				if(assessor_info_detail!=0)
				{
					for(var i=0; i<assessor_info_detail.length; i++)
					{  
						$('#'+assessor_info_detail[i].assessor_type_id).val(assessor_info_detail[i].array_agg).trigger('change');
					}
				}
				else
				{
					$('.assessor_type_id').val('')
					$('.assessor_hidden_id').val('')
//					$('.alter').html('')
				}
				if(employee_id)
				{
					$('.self_assessor_type_id').val(employee_name)
					$('.self_assessor_hidden_id').val(employee_id)
				}
			}
		},
	});
}
//   reviewer form view
var reviewer_form_columns = [{"title":"hidden Id","visible": false},{"title":"No."}, {"title":"Organization"},{"title":"Organization Unit"},{"title":"Schedule"},{"title":"Employee Name"}, {"title":"Role"}]
function assessment_revierer_form_view()
{   
	$.ajax(
			{
				type:"GET",
				url: "/assessment_form_view/",
				data:{ csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val() },
				success: function (json_data) 
				{   
					var data_value=json_data.assessment_form_data
					data_list = [];
					for (var i=0; i<data_value.length; i++){
						data_list.push([data_value[i].form_id,i+1,data_value[i].org_name,data_value[i].orgunit_name,data_value[i].quarter,data_value[i].firstname +" "+data_value[i].last_name, data_value[i].role,
						                ]);
					}
					plaindatatable_btn('assessment_reviewer_form_view', data_list, reviewer_form_columns,[],'NEXT_TRANSFORM_HCMS_DOW_EMPLOYEE_ASSESSMENT_FORM_REVIEWER_DETAILS_'+current_date)
				},
			})	
}
$('#assessment_reviewer_form_view').on('click', 'tbody tr', function(){   //     table row click function
	$('.errormessage').html('');
	var form_table = $('#assessment_reviewer_form_view').DataTable();
	if ( ! form_table.data().count() ) {
		alert_lobibox("info", 'No Data Available in Table');
	}
	else 
	{
		var arr=$('#assessment_reviewer_form_view').dataTable().fnGetData($(this)); 
		clicked_form_id=arr[0];
		assessment_form_id_load(clicked_form_id);
		reviewer_button_display('update')
		$('#viewer_org_unit').val('0').trigger("change");
		$('#viewer_organizations').val('0').trigger("change");
	}
});
function assessment_form_id_load(form_id)
{
		global_assessment_form_id=form_id
		
		if (global_assessment_form_id!='')
		{   
			if ($.fn.DataTable.isDataTable('#assessment_access_matrix_table')) {
				$('#assessment_access_matrix_table').DataTable().clear();
				$('#assessment_access_matrix_table').DataTable().destroy();
			}
			$.ajax({
				url: "/assessment_form_detail/",
				type: "POST",
				data:{'assessment_form_id':global_assessment_form_id,csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()}
			}).done( function(json_data) {
				if (json_data.status == "NTE_01") {
					
					reviewer_info('360',global_assessment_form_id)
					if(json_data.employee_data.length>0)
					{
						$('.self_assessor_type_id').val(json_data.employee_data[0]['first_name']+' '+json_data.employee_data[0]['last_name'])
						$('.self_assessor_hidden_id').val(json_data.employee_data[0]['employee_id'])
					}
				}
			});
	}
} 
//    load employee data
function employee_data(org_id,org_unit_id,dep)
{  
	if(org_id!='0' || org_unit_id!='0' || dep!='0')
	{
		$.ajax({
			url: "/employee_reviewer_fetch/",
			type: "GET",
			async:false,
			data:{'org_id':org_id,'org_unit_id':org_unit_id,'dep':dep,csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()},
			success: function (json_data){
				var data=json_data
				if(data)
				{  
					var len=data.employee.length;
					for(var i=0;i<len;i++)
					{  
							$('.alter').append($('<option>', {
		                        value :data.employee[i].id,
		                        text : data.employee[i].name+' '+ data.employee[i].last_name
		                    }));
							$('.alter').push(data.employee[i].id)
					}
				}
			},
		})
	}
	else { $('.alter').empty();}
} 
function reviewer_add_update()    //form data save function
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
	assessor_info_input_status=''
	selected_assessor_id=''
	selected_assessor_type_id=''
	assessor_info_list=[]
	array_selected_aemployee_id=[]
	$('.assessor_detail ').each(function(i, obj) {
     	if($(obj).find('.self_assessor_hidden_id').val())
     	{
     		selected_assessor_id=[$(obj).find('.self_assessor_hidden_id').val()]
     	}
     	else
     	{
     		selected_assessor_id=$(obj).find('select').val()
     	}

     	if($(obj).find('.assessor_type_id').prop('id'))
     	{
     		selected_assessor_type_id=$(obj).find('.assessor_type_id').prop('id')
     	}
     	else
     	{
     		selected_assessor_type_id=$(obj).find('select').attr('id')
     	}
		assessor_info_list[i]={
				"assessor_id":selected_assessor_id,
				"assessor_type_id":selected_assessor_type_id
		}
		if(selected_assessor_id==null)
		{
			assessor_info_input_status='empty'
		}
		array_selected_aemployee_id.push(selected_assessor_id.join(', '))
		result=array_selected_aemployee_id.join();
	})
	if(assessor_info_input_status=='empty')
	{   
		alert_lobibox("error", sysparam_datas_list["NTE_42"]);
	}
	var a=result.split(',')
	var array = []
	var temp = [];
	var duplicate_array=[];
	for(var i=0;i<a.length;i++)
	{
		array.push(parseInt(a[i]))
	}
	$.each(array, function (array, value) {
	   if($.inArray(value, temp) === -1) {
	      
		   temp.push(value);
	    }else{
	       duplicate_array.push(value)
	    }
	});
	if(duplicate_array!='')
	{
		alert_lobibox("error","Assessors should not be repeated ");
	}
	else{
		$.ajax({
			url: "/assessment_reviewer_access_insert/",
			type: "POST",
			data:{'access_data':JSON.stringify(access_data),'form_id':global_assessment_form_id,'assessor_info_list':JSON.stringify(assessor_info_list),csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()}
		}).done( function(json_data) {
			if (json_data.status == "NTE_01") {
				alert_lobibox("success", sysparam_datas_list[json_data.status]);
				reviewer_detail_clear_cancel();
			}
		})
	}
}
//Function for clear data in matrix and reviewer detail
function reviewer_detail_clear_cancel()
{   
	$('.assessor_type_id').val(''); $('.assessor_hidden_id').val(''); $('.alter').html('');
	$('#viewer_org_unit').val('0').trigger("change");$('#viewer_organizations').val('0').trigger("change");
	assessor_info_detail=''
	global_assessment_form_id=''
	$('#assessment_access_matrix_table>tbody>tr>th').siblings().each(function() {
		$('.assessment_permissioncheckbox',this).prop('checked',false);
	});
	reviewer_info('360',''); $("#reviewer_rating_button_div").empty();
}
// function for button display
function reviewer_button_display(flag)
{   
	$("#reviewer_rating_button_div").empty();
	if (flag=='add')
	{
		var btnstr = '<button type="button" class="btn btn-success btn-eql-wid btn-animate margin-right-3"  onclick="reviewer_add_update();">Save</button>';
	}
	else
	{
		var btnstr = '<button type="button" class="btn btn-success btn-eql-wid btn-animate margin-right-3" onclick="reviewer_add_update();">Save</button>';
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