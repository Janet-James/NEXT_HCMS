$('document').ready(function(){
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
	assessment_form_cancel();    
	assessment_form_view();
})
var clicked_row_id;
var hidden_role_id;
$('#organizations').change(function(){
	var str_org_id=$('#organizations  option:selected').val()
	if(str_org_id!='0' && str_org_id!='')
	{
		$.ajax({
			type:'GET',
			url: '/shift/org_unit_fetch/',
			async : false,
			data  : { 'str_org_id':str_org_id},
			success: function (json_data){
				var data=json_data
				$('#org_unit').html('')
				$('#org_unit').append($('<option>', {
	                    value :'0',
	                    text :'--Select--'
				 }));
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
					else{ $('#org_unit').val('0').trigger("change"); }
				}
				else{ $('#org_unit').val('0').trigger("change"); }
			},
		})	
	}
	else {
		$('#org_unit').html('')
		$('#org_unit').append($('<option>', {
            value :'0',
            text :'--Select--'
	 }));
	$('#org_unit').val('0').trigger("change"); }
});

$('#org_unit').change(function(){
	
	var str_org_unit_id=$('#org_unit  option:selected').val()
	if(str_org_unit_id!='0' && str_org_unit_id!='')
	{
		$.ajax({
			type:'GET',
			url: '/org_unit_employee/',
			async : false,
			data  : { 'str_org_id':str_org_unit_id},
			success: function (json_data){
				var data=json_data
				$('#employee_name').html('')
				$('#employee_name').append($('<option>', {
	                    value :'0',
	                    text :'--Select--'
				 }));
				if(data)
				{
					var data_len=data.org_employee.length;
					if(data_len>=1)
					{  
						for(var i=0;i<data_len;i++)
						{   
							$('#employee_name').append($('<option>', {
			                    value : data.org_employee[i].id,
			                    text : data.org_employee[i].first_name+' '+data.org_employee[i].last_name,
			                }));
						}
					}
					else{ $('#employee_name').val('0').trigger("change"); }
				}
				else{ $('#employee_name').val('0').trigger("change"); }
			},
		})	
	}
	else {
		$('#employee_name').html('')
		$('#employee_name').append($('<option>', {
            value :'0',
            text :'--Select--'
	 }));
	$('#employee_name').val('0').trigger("change"); }
});

$('#employee_name').change(function(){
	var employee_id=$('#employee_name  option:selected').val()
	var year=$('#year  option:selected').text()
	var year_id=$('#year  option:selected').val()
	var quarter=$('#quarter  option:selected').val()
	if(employee_id!='0' && year_id!='0' && quarter!='0')
	{
		$.ajax({
			type:'GET',
			url: '/employee_role/',
			async : false,
			data  : { 'employee_id':employee_id,'year':year,'quarter':quarter,'year_id':year_id},
			success: function (json_data){
				var data=json_data
				$('#role').val('');
				$('#manage_role_kpi_save').show()
				hidden_role_id=''
				if(data)
				{
					$('#role').val(data.employee_role[0].role_title) 
					hidden_role_id=data.employee_role[0].role_id
					if(data.kr)
					{
					  kr_details(data.kr)
					}
					else if(data.exsist_kr)
				    {
						exsist_kr_details(data.exsist_kr)
						clicked_row_id=data.form_id
				    }
				}
				else{  $('#role').val(); hidden_role_id=''}
			},
	})	
	}
	else {
		$('#role').val(''); hidden_role_id=''
	 }
});

$('#year').change(function(){ $('#employee_name').val('0').trigger("change");  });
$('#quarter').change(function(){ $('#employee_name').val('0').trigger("change");  });
//    form save function
function assessment_form_submit()
{
 var status=assessment_form_validation();
 if(status)
 {   
	 var kr_dict={}
	 var kr_list=[]
	 var year=$('#year  option:selected').val();
	 var quarter=$('#quarter  option:selected').val();
	 var organizations=$('#organizations  option:selected').val();
	 var org_unit=$('#org_unit  option:selected').val();
	 var employee_name=$('#employee_name  option:selected').val();
	 var kr_table = $('#assessment_form_kpi_table').DataTable();
	 var total_weightage= $('#assessment_total_weightage').val()
	 $('#assessment_form_kpi_table tbody tr').each(function(row, tr){
		 kr_list[row]={
					"weightage":$(tr).find('td:eq(2) input').val(),
					"id":$(tr).find('td:eq(0) input[type=hidden]').val(),
					"orgin":$(tr).find('td:eq(1)').text()
			}
		});
	 kr_dict["kpi_data"] = kr_list;
	 if(total_weightage!='100'){ alert_lobibox("info", sysparam_datas_list["NTE_75"]);}
	 else if(year!=0 && quarter!=0 && organizations!=0 && org_unit!=9 && employee_name!=0 )
	 {
		 var load_data={"year":year,'quarter':quarter,'organizations':organizations,
	    			'org_unit':org_unit,'employee_name':employee_name,'clicked_row_id':clicked_row_id,'kpi':JSON.stringify(kr_dict),
	    			csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()}
		   send_data('post',"/assessment_form_save/",load_data)
	 }
	 else  {  alert_lobibox("info","Fill all the fields");  }
 }
 else  {  alert_lobibox("info","Fill all the fields");  }
 
}
//common ajax function
function send_data(url_type,url,data)
{  
	$.ajax(
			{
				type:url_type,
				url: url,
				data  : data,
			    async : false,
				success: function (json_data){
					if(json_data.status=='NTE_01'){ alert_lobibox("success", sysparam_datas_list[json_data.status]); assessment_form_cancel(); assessment_form_view();}
					else if(json_data.status=='NTE_02'){ alert_lobibox("error", sysparam_datas_list[json_data.status]); assessment_form_cancel(); }
					else if(json_data.status=='NTE_03'){ alert_lobibox("success", sysparam_datas_list[json_data.status]); assessment_form_cancel(); assessment_form_view(); clicked_row_id=''}
					else if(json_data.status=='NTE_04'){ alert_lobibox("success", sysparam_datas_list[json_data.status]); assessment_form_cancel(); assessment_form_view(); clicked_row_id=''}
					else if(json_data.status=='001'){ alert_lobibox("info","Session Expired");}
					else{ alert_lobibox("error", sysparam_datas_list["ERR0034"]); }
				},
			})	
}

var columns = [{"title":"hidden Id","visible": false},{"title":"No."}, {"title":"Organization"},{"title":"Organization Unit"},{"title":"Schedule"},{"title":"Employee Name"}, {"title":"Role"}]
function assessment_form_view()
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
					plaindatatable_btn('assessment_form_view', data_list, columns,[],'NEXT_TRANSFORM_HCMS_DOW_EMPLOYEE_ASSESSMENT_FORM_DETAILS_'+current_date)
				},
			})	
}
//row clcik in datatable
$('#assessment_form_view').on('click', 'tbody tr', function(){
	$('.errormessage').html('');
	var form_table = $('#assessment_form_view').DataTable();
	if ( ! form_table.data().count() ) {
		alert_lobibox("info", 'No Data Available in Table');
	}
	else 
	{
		var arr=$('#assessment_form_view').dataTable().fnGetData($(this)); 
		clicked_row_id=arr[0];
		employe_role=arr[5];
		if(clicked_row_id!='')
	    {
			$.ajax(
					{
						type:"POST",
						url: "/assessment_form_fetch/",
						data:{"selected_id":clicked_row_id,
							csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()},
							success: function (json_data) 
							{   
								form_button_show('update');
								var data_value=json_data.assessment_record
								$('#role').val(employe_role);
								$('#year').val(data_value[0].assessment_year).trigger("change");
								$('#quarter').val(data_value[0].assessment_quarter).trigger("change");
								$('#organizations').val(data_value[0].organization_id).trigger("change");
								$('#org_unit').val(data_value[0].organization_unit_id).trigger("change");
								$('#employee_name').val(data_value[0].assessment_form_employee_id).trigger("change");
							},
					})	
	    }
	}
});
var kr_columns = [{"title":"hidden Id","visible": false},{"title":"KR."}, {"title":"Orgin"},{"title":"Weightage"},{"title":" ","bSortable": false}]

function kr_details(kr)
{
  var data=kr;
  data_list = [];
  $('#form_kpi_view').show()
  form_button_show('add')
  if(data)
  {
	  var len=data.length;
	  if(len>0)
	  {   
		  $('#weightage_cal').show();  
		  for(var i=0;i<len;i++)
		  {   
			  cell_datas ="<input type='text' id='"+i+1+" 'class='form-control' placeholder='Weightage' value='' onkeyup=total_weightage(this.value,this.id)>";
			  remove="<i class='nf nf-violations'></li>";
			  hidden_id="<input type='hidden' class='form-control input-small'  value='"+data[i].kpi_id+"'/>";
			  data_list.push([data[i].kpi_id,data[i].kr_summary+hidden_id,data[i].orgin,cell_datas,remove]);
		  }
		  alter_plaindatatable_btn('assessment_form_kpi_table', data_list, kr_columns,[],'NEXT_TRANSFORM_HCMS_DOW_EMPLOYEE_KR_DETAILS_'+current_date)
	  }
	  else 
	  { 
		  alter_plaindatatable_btn('assessment_form_kpi_table', data_list, kr_columns,[],'NEXT_TRANSFORM_HCMS_DOW_EMPLOYEE_KR_DETAILS_'+current_date) 
		  $('#weightage_cal').hide(); 
	  }
  }
  else 
  { 
	  alter_plaindatatable_btn('assessment_form_kpi_table', data_list, kr_columns,[],'NEXT_TRANSFORM_HCMS_DOW_EMPLOYEE_KR_DETAILS_'+current_date) 
	  $('#weightage_cal').hide(); 
  }
}
function exsist_kr_details(exsist_kr)
{
	 var data=exsist_kr;
	 var total_weightage=0;
	  data_list = [];
	  $('#form_kpi_view').show()
	  form_button_show('update')
	  if(data)
	  {
		  var len=data.length;
		  if(len>0)
		  {   
			  $('#weightage_cal').show();  
			  for(var i=0;i<len;i++)
			  {   
				
				  remove_hidden_id = "<input type='hidden' class='form-control input-small'  value='" +data[i].kpi_id+" '/>";
				  cell_datas ="<input type='text' id='"+i+1+" 'class='form-control' placeholder='Weightage'  value='"+data[i].weightage+"' onkeyup=total_weightage(this.value,this.id) />";
				  if(data[i].orgin=='Cascaded') { remove="<i class='nf nf-violations'></li>";  
				  hidden_id="<input type='hidden' class='form-control input-small'  value='"+data[i].kr_id+"'/>";
				  }
				  else if(data[i].orgin=='Role') { remove="<i class='nf nf-trash-o rating_row_delete'></li>"; 
				  hidden_id="<input type='hidden' class='form-control input-small'  value='"+data[i].role_id+"'/>";
				  }
				  else { remove="<i class='nf nf-violations'></li>"; }
				 
				  data_list.push([data[i].kpi_id,data[i].kr_summary+hidden_id,data[i].orgin,cell_datas,remove+remove_hidden_id]);
				  
				  total_weightage+=data[i].weightage
			  }
			  alter_plaindatatable_btn('assessment_form_kpi_table', data_list, kr_columns,[],'NEXT_TRANSFORM_HCMS_DOW_EMPLOYEE_KR_DETAILS_'+current_date)
		      $('#assessment_total_weightage').val(total_weightage)
		  }
		  else 
		  { 
			  alter_plaindatatable_btn('assessment_form_kpi_table', data_list, kr_columns,[],'NEXT_TRANSFORM_HCMS_DOW_EMPLOYEE_KR_DETAILS_'+current_date) 
			  $('#weightage_cal').hide(); 
		  }
	  }
	  else 
	  { 
		  alter_plaindatatable_btn('assessment_form_kpi_table', data_list, kr_columns,[],'NEXT_TRANSFORM_HCMS_DOW_EMPLOYEE_KR_DETAILS_'+current_date) 
		  $('#weightage_cal').hide(); 
	  }
}
function manage_role_kpi()
{   
	 var cascaded_kpi=[];
	 $('#assessment_form_kpi_table tbody tr').each(function(row, tr){
		var orgin=$(tr).find('td:eq(1)').text();
		if(orgin=='Role')
		{  
			
			cascaded_kpi.push($(tr).find('td:eq(0) input[type=hidden]').val());
		}
    });
	var role_kpi_columns = [{"title":"No."},{"title":"Select KRA"},{"title":"KRA description"}]
 	var  data_list = [];
	var selected_role_id=hidden_role_id;
	if(selected_role_id!='')
	{
		$.ajax(
				{
					type:"POST",
					url: "/role_kpi_fetch/",
					data:{"selected_role_id":selected_role_id,
						csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()},
						success: function (json_data) 
						{   
							var role_data=json_data.role_kpi
							var len=role_data.length;
							if (len>0)
							{   
							  for (var i=0; i<len; i++){
								 var aray_status=cascaded_kpi.includes(role_data[i].id.toString());
							     var cell_datas=''
			                     if(aray_status==true)
			                     {     
			                    	cell_datas = "<div class='mt-checkbox-inline'><label class='label-cbx'><input type='checkbox' id='template_active' name='sample' class='invisible' checked  value='"+role_data[i].id+"'><div class='checkbox'><svg width='20px' height='20px' viewBox='0 0 20 20'><path d='M3,1 L17,1 L17,1 C18.1045695,1 19,1.8954305 19,3 L19,17 L19,17 C19,18.1045695 18.1045695,19 17,19 L3,19 L3,19 C1.8954305,19 1,18.1045695 1,17 L1,3 L1,3 C1,1.8954305 1.8954305,1 3,1 Z'></path><polyline points='4 11 8 15 16 6'></polyline></svg></div></label></div>";
			                     }
			                     else
			                     {     
			                        cell_datas = "<div class='mt-checkbox-inline'><label class='label-cbx'><input type='checkbox' id='template_active' name='sample' class='invisible'  value='"+role_data[i].id+"'><div class='checkbox'><svg width='20px' height='20px' viewBox='0 0 20 20'><path d='M3,1 L17,1 L17,1 C18.1045695,1 19,1.8954305 19,3 L19,17 L19,17 C19,18.1045695 18.1045695,19 17,19 L3,19 L3,19 C1.8954305,19 1,18.1045695 1,17 L1,3 L1,3 C1,1.8954305 1.8954305,1 3,1 Z'></path><polyline points='4 11 8 15 16 6'></polyline></svg></div></label></div>";
			                     }
						          data_list.push([i+1,cell_datas,role_data[i].kpi_definition]);
						       }
							    alter_plaindatatable_btn('manage_role_kpi_table', data_list, role_kpi_columns,[],'NEXT_TRANSFORM_HCMS_DOW_EMPLOYEE_ROLE_KPI_DETAILS_'+current_date) 
								$('#manage_role_kpi').modal('show');
							    $('#weightage_cal').show(); 
							}
							else
								{
								$('#manage_role_kpi').modal('hide')
								alert_lobibox("info","No Role KRA is Available")
								}
						},
				})	
	}
	else
		{
		alert_lobibox("info","Role is needed"); 
		$('#manage_role_kpi').modal('hide')
		}
}
//function to add manage role add kpi
var exsist_list=[]
function manage_role_add()
{   
	$('#manage_role_kpi').modal('hide')
	var tableControl= document.getElementById('manage_role_kpi_table');
	var select_kpi_list = [];
	var form_kpi=[]
	var select_kpi_dict={};
	$('input:checkbox:checked', tableControl).each(function() {
		select_kpi_list.push($(this).val());
	}).get();
	 $('#assessment_form_kpi_table tbody tr').each(function(row, tr){
			var orgin=$(tr).find('td:eq(1)').text();
			if(orgin=='Role')
			{
				form_kpi.push($(tr).find('td:eq(0) input[type=hidden]').val());
			}
	    });
	var finalize_array = select_kpi_list.filter(function(obj) { return form_kpi.indexOf(obj) == -1; });
	select_kpi_dict['id']=finalize_array
	$.ajax(
			{
				type:"POST",
				url: "/selected_role_kpi/",
				data:{'arrayOfValues':JSON.stringify(select_kpi_dict),
					 csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()},
			    async : false,
				success: function (json_data) 
				{   
					var data=json_data.kpi
					var len=data.length;
					if(len>0)
					{   
						var t = $('#assessment_form_kpi_table').DataTable();
						for(var i=0;i<len;i++)
						{   
							hidden_id = "<input type='hidden' class='form-control input-small'  value='" +data[i].id+" '/>";
							t.row.add( [ 
							            data[i].id,
                                         data[i].kpi_definition+hidden_id,
							             'Role',
							             "<input type='text' id='"+i+1+" 'class='form-control' placeholder='Weightage' value='' onkeyup=total_weightage(this.value,this.id)>",
							             "<i class='nf nf-trash-o rating_row_delete'></li>"+hidden_id,
							         ] ).draw( false );
						}
					}
				},
			})	
}
function assessment_form_update() {  assessment_form_submit();  }//   update function
//   remove function
function assessment_remove_confirmation() {  removeConfirmation('assessment_remove',clicked_row_id,'Assessment Form'); } //remove confirmation function

function assessment_remove()
{
	if(clicked_row_id!='')
	{
	   var load_data={"remove_id":clicked_row_id,csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()}	
	   send_data('post',"/assessment_form_delete/",load_data);
	}
}
/*remove the table row when click button */
$('#assessment_form_kpi_table').on( 'click', '.rating_row_delete', function () {
    data_row = $(this).parents('tr')[0];;
    removeConfirmation('remove_row',data_row,'KR');
} );

function remove_row(id) {  $('#assessment_form_kpi_table').dataTable().fnDeleteRow(id); }

function assessment_form_cancel() //  form cancel function
{
	document.forms['assessment_form'].reset();
	$('#organizations,#quarter,#org_unit,#employee_name,#year').val(0).trigger("change");
	$('.errormessage').html('');
	$('#weightage_cal,#form_kpi_view').hide(); 
	hidden_role_id=''
	clicked_row_id=''
	form_button_show('add');
	$('#manage_role_kpi_save').hide();
	current_user_details();
}

function current_user_details()    // fetch current user organizations
{  
	$.ajax({
		type:'GET',
		url: '/current_user_details/',
		async : false,
		success: function (json_data){
			var data=json_data.user_detaills
			$('#organizations').val(data[0]['org_id_id']).trigger('change')
			$('#org_unit').val(data[0]['org_unit_id_id']).trigger('change')
			$('#year').val(new Date().getFullYear()).trigger('change')
			$('#quarter').val(Math.floor((new Date().getMonth() + 3) / 3)).trigger('change')
		},
	})	
}


function form_button_show(flag) //   button create
{   
	$("#assessment_form_button").empty();
	if (flag=='add')
	{ 
		var btnstr = '<button type="button" class="btn btn-success btn-eql-wid btn-animate margin-right-3" id="assessment_form_save" onclick="assessment_form_submit();">Add</button>';
	}
	else
	{  
		var btnstr= '<button type="button" class="btn btn-primary btn-eql-wid btn-animate margin-right-3" id="assessment_form_updates" onclick="assessment_form_update()"";><i class="fa fa-green"></i> Update</button>';
		btnstr += '<button type="button" class="btn btn-danger btn-eql-wid btn-animate margin-right-3" id="assessment_form_delete" onclick="assessment_remove_confirmation();">Remove</button>';
	}
	btnstr += '<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-3" id="assessment_form_clear" onclick="assessment_form_cancel();">Cancel / Clear</button>';
	$("#assessment_form_button").append(btnstr);	
}

//function form_button_show(action_name){
//$("#assessment_form_button").html('');
//var btnstr = '';
//var access_for_create = jQuery.inArray( "assessment form", JSON.parse(localStorage.Create) );
//var access_for_write = jQuery.inArray( "assessment form", JSON.parse(localStorage.Write) );
//var access_for_delete = jQuery.inArray( "assessment form", JSON.parse(localStorage.Delete) );
//if (action_name == 'add') {
//  if (access_for_create != -1){
//      btnstr += '<button type="button" class="btn btn-success btn-eql-wid btn-animate margin-right-3" id="assessment_form_save" onclick="assessment_form_submit();">Add</button>';
//  }
//  btnstr +=  '<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-3" id="assessment_form_clear" onclick="assessment_form_cancel();">Cancel / Clear</button>';
//} else if (action_name == 'update') {
//  if (access_for_write != -1){
//      btnstr += '<button type="button" class="btn btn-primary btn-eql-wid btn-animate margin-right-3" id="assessment_form_updates" onclick="assessment_form_update()"";><i class="fa fa-green"></i> Update</button>';
//  }
//  if (access_for_delete != -1){
//      btnstr +='<button type="button" class="btn btn-danger btn-eql-wid btn-animate margin-right-3" id="assessment_form_delete" onclick="assessment_remove_confirmation();">Remove</button>';
//  }
//  btnstr +=  '<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-3" id="assessment_form_clear" onclick="assessment_form_cancel();">Cancel / Clear</button>';
//}
//$("#assessment_form_button").append(btnstr);
//}

$('#assessment_form').submit(function(e) {   // form validation
	e.preventDefault();
}).validate({
	rules: {
		year: { valueNotEquals:true, },
		quarter: { valueNotEquals:true, },
		organizations: { valueNotEquals:true, },
		org_unit: { valueNotEquals:true, },
		employee_name: { valueNotEquals:true, },
		role: { required: true, }, 
	},
	//For custom messages
	messages: {
		year: { valueNotEquals: "The field is required", },
		quarter: { valueNotEquals: "The field is required", },
		organizations: { valueNotEquals: "The field is required", },
		org_unit: { valueNotEquals: "The field is required", },
		employee_name: { valueNotEquals: "The field is required", },
		role: { required: "The field is required", },
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
function assessment_form_validation() { return $('#assessment_form').valid(); }
//calculate total weightage
function total_weightage(weightage,id)
{   
var data; var numbers = /^[0-9]+$/; var total_value=0
	$("#assessment_form_kpi_table  td:nth-child(2)").each(function() {
   		var content=$(this)["0"].nextElementSibling.firstElementChild.value
   		data=parseInt(content)
		 var isnum = /^\d+$/.test(data);   //allow only numeric
		 if (isNaN(data)) {               //check the value is integer else set 0
          data=0
          $(this)["0"].nextElementSibling.firstElementChild.value=''
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
else{  $("#assessment_total_weightage").val(total_value)} }

function alter_plaindatatable_btn(tbl_name, data_list, tbl_columns, hidden_col,filename) {   //data table function alter
	if ($.fn.DataTable.isDataTable('#'+tbl_name)) {
		$('#'+tbl_name).DataTable().destroy();
	} 
	if (hidden_col.length != undefined) {
		hidden_col_colvis = hidden_col.length -1;
	} else {
		hidden_col_colvis = hidden_col
	}
	var table = $("#"+tbl_name);
	table.dataTable({
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
			infoFiltered: "(Filtered 1 from _MAX_ total entries)",
			lengthMenu: "_MENU_ entries",
			search: "",
			zeroRecords: "No matching records found"
		},
		buttons:[],
		columnDefs: [{ "visible": false, "targets": hidden_col }],
		responsive: false,
		order: [[1, "asc"]],
		paging:   false,
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
			columnDefs: [{ "visible": false, "targets": hidden_col }],
		});
	}
	$('.exporticon').attr('title','EXPORT'); $('.printicon').attr('title','Print');
	$('.copyicon').attr('title','Copy to clipboard');$('.colvisicon	').attr('title','Column Visibility');
	$('.dataTables_length').addClass('dateTables_length_custom');$('.dataTables_paginate').addClass('dateTables_pagination_custom');
}