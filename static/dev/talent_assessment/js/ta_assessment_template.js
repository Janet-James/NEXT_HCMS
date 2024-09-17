$(document).ready(function(){
	 assessment_template_cancel();  assessment_table_view();   $('#kpi_details_div').hide(); 
});
var exist_id='' 
var update_id=''
var remove_id=''
//function for assessment button save
function assessment_template_submit()
{   
//	function for fetch the selected rows in table
	var template_kpi = []
	var template_kpi_dict = {}
	var measurement_status;
	measurement_status=''
	var template_table = $('#assessment_template_table').DataTable();
	$('#assessment_template_table tbody tr').each(function(row, tr){
		  if($(tr).find('td:eq(3) input').val()=='')
	        {
			  measurement_status="empty"
	        }
		template_kpi[row]={
                "measurement":$(tr).find('td:eq(3) input').val(),
                "orgin":$(tr).find('td:eq(4)').text(),
                "id":$(tr).find('td:eq(5) input[type=hidden]').val(),
                "expected":$(tr).find('td:eq(1)').text()     
        }
    });
	//remove the empty values from array end
	template_kpi_dict["kpi_data"] = template_kpi;
	
    var assessment_template_name=$('#assessment_template_name').val();
    var assessment_template_code=$('#assessment_template_code').val();
    var kpi_type = $("input[type='radio']:checked").val();
    var assessment_category=$('#assessment_template_category  option:selected').val()
    var assessment_role=$('#assessment_template_role  option:selected').val()
    var assessment_template_active_status
    if ($('input[name="template_active"]').is(':checked') ) {
    	assessment_template_active_status='True'
    } 
    else {
    	assessment_template_active_status='False'
    }
    var status = assessment_template_form_validation();
    if(status){
    if(assessment_template_name!='' && assessment_template_code!='' && kpi_type!='' && assessment_role!='0' && assessment_category!='0')
    {   
    	if(assessment_template_code.length>=5)
    	{   
    		if ( ! template_table.data().count() ) {
        		alert_lobibox("info",sysparam_datas_list["ERR0033"]);
        	}
    		else if(measurement_status!="empty") 
    	    {   
		    	var load_data={"assessment_template_name":assessment_template_name,"assessment_template_code":assessment_template_code,'kpi_type':kpi_type,
		    			'assessment_template_active_status':assessment_template_active_status,'assessment_category':assessment_category,'kpi':JSON.stringify(template_kpi_dict),
		    			'assessment_role':assessment_role, csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()}
		//    	AJAX function call
		    	send_data('post',"/assessment/save/",load_data)
    	    }
    		else
    			{
    			alert_lobibox("info",sysparam_datas_list["ERR0033"]);
    			}
    	}else{
    		alert_lobibox("info", sysparam_datas_list["NTE_32"]);
  		}
    }
    else
    	{
    	alert_lobibox("info",sysparam_datas_list["ERR0033"]);
    	}
    }
}
$('#assessment_template_role').change(function(){
	var assesset_category=$('#assessment_template_category  option:selected').val()
	var columns = [{"title":"KPI Description"}, {"title":"Expected"},{"title":"Units"},{"title":"Measurement Criteria"},{"title":"Orgin KPI"},{"title":" ","bSortable": false}]
	var data_list = [];
	var cascad_assessment_role=$('#assessment_template_role  option:selected').val()
	if (clicked_row_id=='')
	{   
		if(cascad_assessment_role!='0')
		{    
		    if(assesset_category=='0' && clicked_row_id=='')
		    {   
		    	alert_lobibox("info",sysparam_datas_list["NTE_33"]);
		    	$('#assessment_template_role').val(0).trigger("change");
		    	return
		    }
			 $('#kpi_details_div').show();
		    $('#manage_role_kpi_save').show();
			$.ajax({
						type:"POST",
						url: "/assessment/Kpi_fetch/",
						data:{'cascad_assessment_role':cascad_assessment_role,'template_id':clicked_row_id,'assesset_category':assesset_category,
							 csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()},
					    async : false,
						success: function (json_data) 
						{   
							data_list = [];
							var data=json_data.kpi
							if(json_data.status=='NTE')
								{
								alert_lobibox("info",sysparam_datas_list["NTE_34"])
								$('#manage_role_kpi_save').hide()
								plaindatatable1('assessment_template_table',[], columns)
								}
							else if (json_data.status=='NTE_exist_cat')
							{   
								alert_lobibox("info",sysparam_datas_list["NTE_35"])
								$('#manage_role_kpi_save').hide()
								plaindatatable1('assessment_template_table',[], columns)
							}
							else if (json_data.status=='NTE_01')
							  {
								$.ajax(
							 			{
							 				type:"POST",
							 				url: "/assessment/template_fetch/",
							 				data:{"remove_id":clicked_row_id,
							 					 csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()},
							 			    async : false,
							 				success: function (json_data) 
							 				{   
							 					$('#manage_role_kpi_save').show()
							 					var kpi_data=json_data.cascade_kpi
							 					var role_data=json_data.role_kpi
							 					assessment_table(kpi_data,role_data);
							 				},
							 			})	
							  }
							else if (data){
								$('#manage_role_kpi_save').show()
								var len=data.length;
								var data_list=[]
								if(len>0)
							    { 
								  for(var i=0;i<len;i++)
								  {   
									if(data[i].target_type==null || data[i].target_type==' ')
									{
										target_value=''
									}
									else
									{
										target_value=data[i].target_type
									}
									cell_datas ="<input type='text' id='"+i+1+" 'class='form-control' onchange='return trim(this)' placeholder='Measurement Criteria' value='' >";
									hidden_id="<input type='hidden' class='form-control input-small'  value='" +data[i].id+" '/>";
									data_list.push([data[i].kpi_description, data[i].kpi_target_value,target_value,
									                cell_datas,'Cascaded',"<i class='nf nf-violations'></li>" +hidden_id]);
								}
								  plaindatatable1('assessment_template_table', data_list, columns)
							}
								else{
								   plaindatatable1('assessment_template_table', data_list, columns) }
							}
							else
								{
								 plaindatatable1('assessment_template_table', [], columns)
								}
						},
					})	
	}  
    }
});

$('#assessment_template_category').change(function(){
	
	var assesset_category=$('#assessment_template_category  option:selected').val()
	var columns = [{"title":"KPI Description"}, {"title":"Expected"},{"title":"Units"},{"title":"Measurement Criteria"},{"title":"Orgin KPI"},{"title":" ","bSortable": false}]
	var data_list = [];
	var cascad_assessment_role=$('#assessment_template_role  option:selected').val()
	if (clicked_row_id=='')
	{   
		if(assesset_category!='0')
		{    
		    if(assesset_category=='0' && clicked_row_id=='')
		    {   
		    	alert_lobibox("info",sysparam_datas_list["NTE_33"])
		    	$('#assessment_template_role').val(0).trigger("change");
		    	return
		    }
			 $('#kpi_details_div').show();
		    $('#manage_role_kpi_save').show();
			$.ajax({
						type:"POST",
						url: "/assessment/Kpi_fetch/",
						data:{'cascad_assessment_role':cascad_assessment_role,'template_id':clicked_row_id,'assesset_category':assesset_category,
							 csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()},
					    async : false,
						success: function (json_data) 
						{   
							data_list = [];
							var data=json_data.kpi
							if(json_data.status=='NTE')
								{
								alert_lobibox("info",sysparam_datas_list["NTE_34"])
								$('#manage_role_kpi_save').hide()
								plaindatatable1('assessment_template_table',[], columns)
								}
							else if (json_data.status=='NTE_exist_cat')
							{
								alert_lobibox("info",sysparam_datas_list["NTE_35"])
								$('#manage_role_kpi_save').hide()
								plaindatatable1('assessment_template_table',[], columns)
							}
							else if (json_data.status=='NTE_01')
							  {
								$.ajax(
							 			{
							 				type:"POST",
							 				url: "/assessment/template_fetch/",
							 				data:{"remove_id":clicked_row_id,
							 					 csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()},
							 			    async : false,
							 				success: function (json_data) 
							 				{   
							 					$('#manage_role_kpi_save').show()
							 					var kpi_data=json_data.cascade_kpi
							 					var role_data=json_data.role_kpi
							 					assessment_table(kpi_data,role_data);
							 				},
							 			})	
							  }
							else if (data){
								$('#manage_role_kpi_save').show()
								var len=data.length;
								var data_list=[]
								if(len>0)
							    { 
								  for(var i=0;i<len;i++)
								  {   
									if(data[i].target_type==null || data[i].target_type==' ')
									{
										target_value=''
									}
									else
									{
										target_value=data[i].target_type
									}
									cell_datas ="<input type='text' id='"+i+1+" 'class='form-control' onchange='return trim(this)' placeholder='Measurement Criteria' value='' >";
									hidden_id="<input type='hidden' class='form-control input-small'  value='" +data[i].id+" '/>";
									data_list.push([data[i].kpi_description, data[i].kpi_target_value,target_value,
									                cell_datas,'Cascaded',"<i class='nf nf-violations'></li>" +hidden_id]);
								}
								  plaindatatable1('assessment_template_table', data_list, columns)
							}
								else{
								   plaindatatable1('assessment_template_table', data_list, columns) }
							}
							else
								{
								 plaindatatable1('assessment_template_table', [], columns)
								}
						},
					})	
	}  
    }
});


function assessment_table_view()
{   
	var columns = [{"title":"No."},{"title":"Template Name"}, {"title":"Role"}, {"title":"Template Code"},{"title":"Assessment Category"},{"title":"Status"},{"title":"hidden Id","visible": false}]
	$.ajax(
			{
				type:"POST",
				url: "/assessment/assessment_table_view/",
			    async : false,
			    data:{ csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val() },
				success: function (json_data) 
				{   
				     var data_value=json_data.data
			         data_list = [];
				     var template_status
				     for (var i=0; i<data_value.length; i++){
				    	    template_status='';
				    	    if(data_value[i].template_status==true) {
				    	    	template_status='Active'
				    	    }
				    	    else{
				    	    	template_status='In-Active'
				    	    	}
			                data_list.push([i+1,data_value[i].template_name, data_value[i].role_details,
			                                data_value[i].assessment_code,data_value[i].category_name,template_status,data_value[i].id]);
			            }
				     plaindatatable_btn('assessment_template_view', data_list, columns,[])
				},
			})	
}
//row click in Datatable
var clicked_row_id=''
$('#assessment_template_view').on('click', 'tbody tr', function(){
	$('#assessment_template_role').val(0).trigger("change")
    $('#assessment_template_category').val(0).trigger("change")
    var arr=$('#assessment_template_view').dataTable().fnGetData($(this)); 
     clicked_row_id=arr[6];
     $.ajax(
 			{
 				type:"POST",
 				url: "/assessment/template_fetch/",
 				data:{"remove_id":clicked_row_id,
 					 csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()},
 			    async : false,
 				success: function (json_data) 
 				{   
 					var data_value=json_data.data
 					var kpi_data=json_data.cascade_kpi
 					var role_data=json_data.role_kpi
 					button_show('update');
 					$('#assessment_template_name').val(data_value[0].template_name);
 				    $('#assessment_template_code').val(data_value[0].assessment_code);
 				    $('#assessment_template_role').val(data_value[0].role_id).trigger("change")
 				    $('#assessment_template_category').val(data_value[0].category_id).trigger("change")
 				    if(data_value[0].template_status==true)
 				    {
 				    	 document.getElementById("template_active_id").checked = true;
 				    }
 				    else 
 				    {
 				    	 document.getElementById("template_active_id").checked = false;
				    }
 				    assessment_table(kpi_data,role_data);
 				    var valid=$('#assessment_template_form').valid();
 				    if(valid)
 				    {   
 				    	return false;
 				    }
 				},
 			})	
});
//table view function
function assessment_table(kpi_data,role_data)
{  
	 $('#kpi_details_div').show();
	 $('#manage_role_kpi_save').show()
	var column = [{"title":"KPI Description"}, {"title":"Expected"},{"title":"Units"},{"title":"Measurement Criteria"},{"title":"Orgin KPI"},{"title":"","bSortable": false}]
	var data=kpi_data
	var role_kpi=role_data
	var role_len=role_kpi.length;
	var len=data.length;
	var data_list = [];
	if(len>0)
	{   
		data_list = []
		for(var i=0;i<len;i++)
			{   
				if(data[i].target_type==null || data[i].target_type==' ')
				{
					target_value=''
				}
				else
				{
					target_value=data[i].target_type
				}
				cell_datas = "<input type='text' id='"+i+1+" 'class='form-control' placeholder='Measurement Criteria' onchange='return trim(this)'  value='"+data[i].assessment_template_kpi_measurement_criteria+"'>",
				hidden_id="<input type='hidden' class='form-control input-small'  value='" +data[i].assessment_template_cascaded_kpi_id+" '/>";
				data_list.push([data[i].kpi_description, data[i].assessment_template_kpi_expected,target_value,
							                cell_datas,data[i].assessment_template_kpi_type,"<i class='nf nf-violations'></li>"+hidden_id]);
			}
			plaindatatable1('assessment_template_table', data_list, column)
	}
	if(role_len>0){
			for(var i=0;i<role_len;i++)
			{  
				if(role_kpi[i].target_type==null || role_kpi[i].target_type==' ')
				{
					target_value=''
				}
				else
				{
					target_value=role_kpi[i].target_type
				}
				hidden_id="<input type='hidden' class='form-control input-small'  value="+role_kpi[i].assessment_template_role_kpi_id+"></input>";
				measure =  "<input type='text' id='"+i+1+" 'class='form-control' placeholder='Measurement Criteria' value='"+role_kpi[i].assessment_template_kpi_measurement_criteria+"'>",
				data_list.push([role_kpi[i].kpi_definition,role_kpi[i].assessment_template_kpi_expected,target_value,measure,role_kpi[i].assessment_template_kpi_type,'<i class="nf nf-trash-o rating_row_delete"></li>'+hidden_id])
			}
			plaindatatable1('assessment_template_table', data_list, column)
	}     
	if(role_len==0 && len==0)
		{
		plaindatatable1('assessment_template_table', data_list, column)
		}
}

/*remove the table row when click button */
$('#assessment_template_table').on( 'click', '.rating_row_delete', function () {
	
    data_row = $(this).parents('tr')[0];
    removeConfirmation('remove_row',data_row);
} );

function remove_row(id)
{
	 $('#assessment_template_table').dataTable().fnDeleteRow(id);
}
//function for delete

function assessment_template_remove_confirmation()
{
	 removeConfirmation('assessment_template_remove',clicked_row_id,$('#assessment_template_name').val());
}

function assessment_template_remove()
{   
	var remove_template_table = $('#assessment_template_table').DataTable();
	remove_id=clicked_row_id;
	if(remove_id)
	{
	  exist_id='';
	}
	var load_data={"remove_id":remove_id,"exist_id":exist_id, csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()}
	if ( ! remove_template_table.data().count() ) {
		alert_lobibox("info", sysparam_datas_list["ERR0033"]);
	}
	else{
//	AJAX function call
	   send_data('post',"/assessment/delete/",load_data)
	}
}
//function for update

$('#assessment_template_role').change(function(){
	
	if(clicked_row_id!='')
	{    
		var assesset_category=$('#assessment_template_category  option:selected').val()
		var assesst_role=$('#assessment_template_role  option:selected').val()
		if(assesset_category!='0' && assesst_role!='0')
		{   
			var load_data={"clicked_row_id":clicked_row_id,"assesset_category":assesset_category,"assesst_role":assesst_role, csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()}
		   
			check_data('post',"/assessment/role_check/",load_data)
		}
	}
});

$('#assessment_template_category').change(function(){
	
	if(clicked_row_id!='')
	{   
		var assesset_category=$('#assessment_template_category  option:selected').val()
		var assesst_role=$('#assessment_template_role  option:selected').val()
		if(assesset_category!='0' && assesst_role!='0')
		{   
			var load_data={"clicked_row_id":clicked_row_id,"assesset_category":assesset_category,"assesst_role":assesst_role, csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()}
		   
			check_data('post',"/assessment/role_check/",load_data)
		}
	}
});

function check_data(url_type,url,data)
{   
	var columns = [{"title":"KPI Description"}, {"title":"Expected"},{"title":"Units"},{"title":"Measurement Criteria"},{"title":"Orgin KPI"},{"title":" ","bSortable": false}]
	$.ajax({
 		type:url_type,
 		url:url,
 		data:data,
 	    async : false,
 		success: function (json_data) 
 		{   
 			if(json_data.status=='NTE_exist_data')
 			{   
 				alert_lobibox("info",sysparam_datas_list["NTE_35"])
 				$('#manage_role_kpi_save').hide()
				plaindatatable1('assessment_template_table',[], columns)
				return
 			}
 			else if(json_data.status=='NTE_001')
 			{
 				$('#manage_role_kpi_save').show()
					var kpi_data=json_data.cascade_kpi
					var role_data=json_data.role_kpi
					assessment_table(kpi_data,role_data);
 			}
 			else if(json_data.status=='NTE_002')
 				{
 				var data_list = [];
				var data=json_data.kpi
				if (data){
					$('#manage_role_kpi_save').show()
					var len=data.length;
					var data_list=[]
					if(len>0)
				    { 
					  for(var i=0;i<len;i++)
					  {   
						if(data[i].target_type==null || data[i].target_type==' ')
						{
							target_value=''
						}
						else
						{
							target_value=data[i].target_type
						}
						cell_datas ="<input type='text' id='"+i+1+" 'class='form-control' onchange='return trim(this)' placeholder='Measurement Criteria' value='' >";
						hidden_id="<input type='hidden' class='form-control input-small'  value='" +data[i].id+" '/>";
						data_list.push([data[i].kpi_description, data[i].kpi_target_value,target_value,
						                cell_datas,'Cascaded',"<i class='nf nf-violations'></li>" +hidden_id]);
					}
					  plaindatatable1('assessment_template_table', data_list, columns)
				}
					else{
					   plaindatatable1('assessment_template_table', data_list, columns) }
 				}
				else{
					   plaindatatable1('assessment_template_table', data_list, columns) }
 			}
 		},
	});
}
function assessment_template_update()
{
	update_id=clicked_row_id;
//	function for fetch the selected rows in table
	var template_kpi = []
	var template_kpi_dict = {}
	var measurement_status;
	measurement_status=""
	var update_template_table = $('#assessment_template_table').DataTable();
	if(update_id)
	{
	  exist_id='';
	}
	$('#assessment_template_table tbody tr').each(function(row, tr){
	    if($(tr).find('td:eq(3) input').val()==''){
	    	measurement_status="empty"
		}
		template_kpi[row]={
                "measurement":$(tr).find('td:eq(3) input').val(),
                "orgin":$(tr).find('td:eq(4)').text(),
                "id":$(tr).find('td:eq(5) input[type=hidden]').val(),
                "expected":$(tr).find('td:eq(1)').text()     
                
        }
    });
	//remove the empty values from array end
	template_kpi_dict["kpi_data"] = template_kpi;
    var assessment_template_name=$('#assessment_template_name').val();
    var assessment_template_code=$('#assessment_template_code').val();
    var kpi_type = $("input[type='radio']:checked").val();
    var assessment_category=$('#assessment_template_category  option:selected').val()
    var assessment_role=$('#assessment_template_role  option:selected').val()
    var assessment_template_active_status
    if ($('input[name="template_active"]').is(':checked') ) {
    	assessment_template_active_status='True'
    } 
    else {
    	assessment_template_active_status='False'
    }
    var status = assessment_template_form_validation();
    if(status){
    if(assessment_template_name!='' && assessment_template_code!='' && kpi_type!='')
    {   	
    	if(assessment_template_code.length>=5)
    	{   
    		if ( ! update_template_table.data().count() ) {
        		alert_lobibox("info",sysparam_datas_list["ERR0033"]);
        	}
    		else if(measurement_status!="empty") 
    	    {  
    			var load_data={"assessment_template_name":assessment_template_name,"assessment_template_code":assessment_template_code,'kpi_type':kpi_type,
	    		'assessment_template_active_status':assessment_template_active_status,'assessment_category':assessment_category,'kpi':JSON.stringify(template_kpi_dict),
	    		'assessment_role':assessment_role,'update_id':update_id,'exist_id':exist_id, csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()}
	    	
    			//    	AJAX function call
	    	    send_data('post',"/assessment/update/",load_data)
    	    }
    		else{ alert_lobibox("info", sysparam_datas_list["ERR0033"]); }
    	}
    	else{ alert_lobibox("info", sysparam_datas_list["NTE_32"]); }
    }
    else{ alert_lobibox("info",sysparam_datas_list["ERR0033"]) }
    }
}

function manage_role_kpi()
{   
	 var template_kpi=[];
	 var assessment_role=$('#assessment_template_role  option:selected').val()
	 $('#assessment_template_table tbody tr').each(function(row, tr){
		var orgin=$(tr).find('td:eq(3)').text();
		if(orgin=='Role')
		{
		   template_kpi.push($(tr).find('td:eq(4) input[type=hidden]').val());
		}
    });
	 var columns = [{"title":"No."},{"title":"Select KPI"},{"title":"KPI description"}, {"title":"KPI Target Value"},{"title":"hidden Id","visible": false}]
 	 var  data_list = [];
	 if(assessment_role>0)
	 {   
		 $.ajax(
				{
					type:"POST",
					url: "/assessment/Kpi_fetch/",
					data:{'assessment_role':assessment_role,
						 csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()},
				    async : false,
					success: function (json_data) 
					{   
						 var data_value=json_data.kpi
				         data_list = [];
						 if(data_value)
						 {
							 if(data_value.length>0)
							 {
							     for (var i=0; i<data_value.length; i++){
							    	 var aray_status=template_kpi.includes(data_value[i].id.toString());
							    	 var cell_datas=''
			                         if(aray_status==true)
			                         {   
			                        	 cell_datas = "<div class='mt-checkbox-inline'><input <label class='label-cbx'> type='checkbox' id='template_active' name='sample' class='invisible' checked value='"+data_value[i].id+" '><div class='checkbox'><svg width='20px' height='20px' viewBox='0 0 20 20'><path d='M3,1 L17,1 L17,1 C18.1045695,1 19,1.8954305 19,3 L19,17 L19,17 C19,18.1045695 18.1045695,19 17,19 L3,19 L3,19 C1.8954305,19 1,18.1045695 1,17 L1,3 L1,3 C1,1.8954305 1.8954305,1 3,1 Z'></path><polyline points='4 11 8 15 16 6'></polyline></svg></div></label></div>";
			                         }
			                         else
			                         {  
			                        	 cell_datas = "<div class='mt-checkbox-inline'><label class='label-cbx'><input type='checkbox' id='template_active' name='sample' class='invisible' value='"+data_value[i].id+" '><div class='checkbox'><svg width='20px' height='20px' viewBox='0 0 20 20'><path d='M3,1 L17,1 L17,1 C18.1045695,1 19,1.8954305 19,3 L19,17 L19,17 C19,18.1045695 18.1045695,19 17,19 L3,19 L3,19 C1.8954305,19 1,18.1045695 1,17 L1,3 L1,3 C1,1.8954305 1.8954305,1 3,1 Z'></path><polyline points='4 11 8 15 16 6'></polyline></svg></div></label></div>";
			                         }
							    	 
						                data_list.push([i+1,cell_datas,data_value[i].kpi_description, data_value[i].target_type,
						                               data_value[i].id]);
						       }
								  plaindatatable2('manage_role_kpi_table', data_list, columns)
								  jQuery('#manage_role_kpi_table').wrap('<div class="dataTables_scroll" />');
								  $('#manage_role_kpi').modal('show');
							 }
						 else{ alert_lobibox("info",sysparam_datas_list["NTE_36"]);  $('#manage_role_kpi').modal('hide');}
						 }
						 else{ alert_lobibox("info",sysparam_datas_list["NTE_36"]);  $('#manage_role_kpi').modal('hide');}

					},
				})	
	 }
	  else{ 
		  Lobibox.notify.closeAll();
		  alert_lobibox("info",sysparam_datas_list["NTE_37"]) 
		  }
}
//function to add manage role add kpi
var exsist_list=[]
function manage_role_add()
{   
	var tableControl= document.getElementById('manage_role_kpi_table');
	var select_kpi_list = [];
	var template_kpi=[]
	var select_kpi_dict={};
	$('input:checkbox:checked', tableControl).each(function() {
		select_kpi_list.push($(this).val());
	}).get();
	 $('#assessment_template_table tbody tr').each(function(row, tr){
			var orgin=$(tr).find('td:eq(4)').text();
			if(orgin=='Role')
			{
			   template_kpi.push($(tr).find('td:eq(5) input[type=hidden]').val());
			}
	    });
	 var finalize_array = select_kpi_list.filter(function(obj) { return template_kpi.indexOf(obj) == -1; });
	select_kpi_dict['id']=finalize_array
	$.ajax(
					{
						type:"POST",
						url: "/assessment/selected_role_kpi/",
						data:{'arrayOfValues':JSON.stringify(select_kpi_dict),
							 csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()},
					    async : false,
						success: function (json_data) 
						{   
							var data=json_data.kpi
							var len=data.length;
							if(len>0)
							{   
								var t = $('#assessment_template_table').DataTable();
								for(var i=0;i<len;i++)
								{   
									 if(data[i].target_type==null || data[i].target_type==' ')
									 {
											target_value=''
									 }
									 else
									 {
										   target_value=data[i].target_type
									  }
									hidden_id = "<input type='hidden' class='form-control input-small'  value='" +data[i].id+" '/>";
									t.row.add( [
	                                             data[i].kpi_description,
	                                             data[i].kpi_target_value,
	                                             target_value,
	                                             "<input type='text' id='"+i+1+" 'class='form-control' onchange='return trim(this)'  placeholder='Measurement Criteria'>",
									             'Role',
									             "<i class='nf nf-trash-o rating_row_delete'></li>"+hidden_id,
									         ] ).draw( false );
								}
							}
						},
					})	
					  $('#manage_role_kpi').modal('hide');
}

//function for Cancel/clear
function assessment_template_cancel()
{
   $('#assessment_template_name').val(''); $('#assessment_template_code').val('');
   $('#assessment_template_role').val(0).trigger("change");   $('#assessment_template_category').val(0).trigger("change")
   document.getElementById("template_active_id").checked = true;
   $('#kpi_details_div').hide(); clicked_row_id=''; exist_id='';
   $('.errormessage').html('');
   button_show('add');
}

function  button_show(flag)
{   
	$("#assessment_template_button_div").empty();
	if (flag=='add')
	{
	  var btnstr = '<button type="button" class="btn btn-success btn-eql-wid btn-animate margin-right-3" id="assessment_template_save" onclick="assessment_template_submit();">Add</button>';
	}
	else
	{
	 var btnstr = '<button type="button" class="btn btn-primary btn-eql-wid btn-animate margin-right-3" id="assessment_template_updates" onclick="assessment_template_update()"";><i class="fa fa-green"></i> Update</button>';
		 btnstr += '<button type="button" class=" btn btn-danger btn-eql-wid btn-animate margin-right-3" id="assessment_template_delete" onclick="assessment_template_remove_confirmation();">Remove</button>';
	}
	btnstr += '<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-3" id="assessment_template_clear" onclick="assessment_template_cancel();">Cancel / Clear</button>';
	$("#assessment_template_button_div").append(btnstr);	
}

//function button_show(action_name){
//	$("#assessment_template_button_div").html('');
//	var btnstr = '';
//	var access_for_create = jQuery.inArray( "assessment template", JSON.parse(localStorage.Create) );
//	var access_for_write = jQuery.inArray( "assessment template", JSON.parse(localStorage.Write) );
//	var access_for_delete = jQuery.inArray( "assessment template", JSON.parse(localStorage.Delete) );
//	if (action_name == 'add') {
//	  if (access_for_create != -1){
//	      btnstr += '<button type="button" class="btn btn-success btn-eql-wid btn-animate margin-right-3" id="assessment_template_save" onclick="assessment_template_submit();">Add</button>';
//	  }
//	  btnstr += '<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-3" id="assessment_template_clear" onclick="assessment_template_cancel();">Cancel / Clear</button>';
//	} else if (action_name == 'update') {
//	  if (access_for_write != -1){
//	      btnstr += '<button type="button" class="btn btn-primary btn-eql-wid btn-animate margin-right-3" id="assessment_template_updates" onclick="assessment_template_update()"";><i class="fa fa-green"></i> Update</button>';
//	  }
//	  if (access_for_delete != -1){
//	      btnstr +='<button type="button" class=" btn btn-danger btn-eql-wid btn-animate margin-right-3" id="assessment_template_delete" onclick="assessment_template_remove_confirmation();">Remove</button>';
//	  }
//	  btnstr += '<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-3" id="assessment_template_clear" onclick="assessment_template_cancel();">Cancel / Clear</button>';
//	}
//	$("#assessment_template_button_div").append(btnstr);
//	}