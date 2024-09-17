//single search and select 

$("#attendance_popup_table").on("click", "tr", function() { 
	if (!this.rowIndex) return; // skip first row
	id = $('#attendance_popup_table').dataTable().fnGetData(this)[0];
	name = $('#attendance_popup_table').dataTable().fnGetData(this)[3];
	strAppend = ''
	var resource_id=id;
	var resource_name=name
	if(global_button_name=='reported_by')
	{    
		 if(resource_id>0)
	     {   
			 $('#reported_by').html('')
			  $('#reported_by').val(0).trigger("change")
			 $('#reported_by').append($('<option>', {
	         value :resource_id,
	         text :name
	     }));
			$('#reported_by').val(resource_id).trigger("change")
	     }
	     else
	    	 {
	    	 $('#reported_by').val(0).trigger("change")
	    	 }
	}
	else if(global_button_name=='update_reported_by')
	{   
		if(resource_id>0)
	     {   
			 $('#update_reported_by').html('')
			  $('#update_reported_by').val(0).trigger("change")
			 $('#update_reported_by').append($('<option>', {
	         value :resource_id,
	         text :name
	     }));
			$('#update_reported_by').val(resource_id).trigger("change")
	     }
	     else
	    	 {
	    	 $('#update_reported_by').val(0).trigger("change")
	    	 }
	}
	else if(global_button_name=='owner')
	{   
		if(resource_id>0)
	     {   
			 $('#owner_id').html('')
			  $('#owner_id').val(0).trigger("change")
			 $('#owner_id').append($('<option>', {
	         value :resource_id,
	         text :name
	     }));
			$('#owner_id').val(resource_id).trigger("change")
	     }
	     else
	    	 {
	    	 $('#owner_id').val(0).trigger("change")
	    	 }
	}
	else
		{
		  return true;
		}
});

//Multiple search and select 
function incident_employee_search(fun_status,tbl_stat,name){
	status = fun_status;
	tbl_status = tbl_stat;
	clearPopupConfirmation();
	basicDropdown();
	global_button_name=name;
	if(status != 'NTE-HRMS'){
		if(status == 'NTE-EMP'){
			var org_id = $('#organization_id option:selected').val();
			var org_unit_id = $('#org_unit_id option:selected').val();
			if(org_id != 0 && org_unit_id != 0 ){
				$('.employeeAdvancedSearch').hide();
				$('#employeeSelect').modal('show');
			}else{
				alert_lobibox("info",sysparam_datas_list['NTE_55']);
			}
		}else{
			$('.employeeAdvancedSearch').show();
			$('#employeeSelect').modal('show');
		}
	}else{
		var org_id = $('#company option:selected').val();
		var org_unit_id = $('#organization_unit_id option:selected').val();
		if(org_id != 0 && org_unit_id != 0 ){
			$('.employeeAdvancedSearch').hide();
			$('#employeeSelect').modal('show');
		}else{
			alert_lobibox("info",sysparam_datas_list['NTE_55']);
		}
	}
}

//employee_id=$("#victrim_id").val();
var tableControl= document.getElementById('attendance_popup_table');
$('#getMultiValues').click(function() {
	if(global_button_name =='victim'){
		arrayOfValues = [];
		strAppend = ''
		var oTable = $("#attendance_popup_table").dataTable();
		$("input:checkbox:checked", oTable.fnGetNodes()).each(function() {
			var status=victim_employee_id.includes($(this).closest('tr').find('td').eq(0).text())
			if(status==false)
			{  
			   $('#victrim_id').append("<option value='"+$(this).closest('tr').find('td').eq(0).text()+"'>"+$(this).closest('tr').find('td').eq(3).text()+"</option")
			   strAppend += $(this).closest('tr').find('td').eq(3).text()+','
			   victim_employee_id.push(this.id);
			}
		}).get();
	$('#employee').val(strAppend.slice(0,-1));
	var victrm_employee_unique_id = victim_employee_id.filter( onlyUnique );
	$('#victrim_id').val(victrm_employee_unique_id).trigger('change');
	$('#employeeSelect').modal('hide');
	}
	else if(global_button_name =='witness')
	{
		arrayOfValues = [];
		strAppend = ''
		var oTable = $("#attendance_popup_table").dataTable();
		$("input:checkbox:checked", oTable.fnGetNodes()).each(function() {
			var status=witness_employee_id.includes($(this).closest('tr').find('td').eq(0).text())
			if(status==false)
			{  
			   $('#witness_id').append("<option value='"+$(this).closest('tr').find('td').eq(0).text()+"'>"+$(this).closest('tr').find('td').eq(3).text()+"</option")
			   strAppend += $(this).closest('tr').find('td').eq(3).text()+','
			   witness_employee_id.push(this.id);
			}
		}).get();
	$('#employee').val(strAppend.slice(0,-1));
	var witness_employee_unique_id = witness_employee_id.filter( onlyUnique );
	$('#witness_id').val(witness_employee_unique_id).trigger('change');
	$('#employeeSelect').modal('hide');
	}
	else if(global_button_name =='prepetrator')
	{
		arrayOfValues = [];
		strAppend = ''
		var oTable = $("#attendance_popup_table").dataTable();
		$("input:checkbox:checked", oTable.fnGetNodes()).each(function() {
			var status=prepetrator_employee_id.includes($(this).closest('tr').find('td').eq(0).text())
			if(status==false)
			{  
			   $('#prepetrator_id').append("<option value='"+$(this).closest('tr').find('td').eq(0).text()+"'>"+$(this).closest('tr').find('td').eq(3).text()+"</option")
			   strAppend += $(this).closest('tr').find('td').eq(3).text()+','
			   prepetrator_employee_id.push(this.id);
			}
		}).get();
	$('#employee').val(strAppend.slice(0,-1));
	var prepetrator_employee_unique_id = prepetrator_employee_id.filter( onlyUnique );
	$('#prepetrator_id').val(prepetrator_employee_unique_id).trigger('change');
	$('#employeeSelect').modal('hide');
	}
	else if(global_button_name =='update_victim')
	{   
		var update_victim_employee_id=$('#update_victrim_id').val();
		var oTable = $("#attendance_popup_table").dataTable();
		if(update_victim_employee_id==null)
		{	
			update_victim_employee_id=[]
		}
		  $("input:checkbox:checked", oTable.fnGetNodes()).each(function() {
			update_victim_employee_id.push(this.id);
		  }).get();
		  var selected_victim_employee_id = update_victim_employee_id.filter( onlyUnique );
		  $.ajax(
					{
						type:'post',
						url: "/incident/employee_name/",
						data: {'id':JSON.stringify(selected_victim_employee_id),csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()},
						success: function (json_data){
							var emp_data=json_data.data
							$('#update_victrim_id').html('')
							if(emp_data)
							{   
								var len=emp_data[0].length;
								for(var i=0;i<len;i++)
								{   
									$('#update_victrim_id').append($('<option>', {
					                    value : emp_data[0][i].id,
					                    text : emp_data[0][i].name
					                }));
								}
								$('#update_victrim_id').val(selected_victim_employee_id).trigger("change")

							}
							
						},
					})	
	}
	else if(global_button_name =='update_prepetrator')
	{
		var update_prepetrator_employee_id=$('#update_prepetrator_id').val();
		var oTable = $("#attendance_popup_table").dataTable();
		if(update_prepetrator_employee_id==null)
		{	
			update_prepetrator_employee_id=[]
		}
		  $("input:checkbox:checked", oTable.fnGetNodes()).each(function() {
			  update_prepetrator_employee_id.push(this.id);
		  }).get();
		  var selected_victim_employee_id = update_prepetrator_employee_id.filter( onlyUnique );
		  $.ajax(
					{
						type:'post',
						url: "/incident/employee_name/",
						data: {'id':JSON.stringify(selected_victim_employee_id),csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()},
						success: function (json_data){
							var emp_data=json_data.data
							$('#update_prepetrator_id').html('')
							if(emp_data)
							{ 
								var len=emp_data[0].length;
								for(var i=0;i<len;i++)
								{   
									$('#update_prepetrator_id').append($('<option>', {
					                    value : emp_data[0][i].id,
					                    text : emp_data[0][i].name
					                }));
								}
								$('#update_prepetrator_id').val(selected_victim_employee_id).trigger("change")

							}
							
						},
					})	
	}
	else if(global_button_name =='update_witness')
	{
		var update_witness_employee_id=$('#update_witness_id').val();
		var oTable = $("#attendance_popup_table").dataTable();
		if(update_witness_employee_id==null)
		{	
			update_witness_employee_id=[]
		}
		  $("input:checkbox:checked", oTable.fnGetNodes()).each(function() {
			  update_witness_employee_id.push(this.id);
		  }).get();
		  var selected_victim_employee_id = update_witness_employee_id.filter( onlyUnique );
		  $.ajax(
					{
						type:'post',
						url: "/incident/employee_name/",
						data: {'id':JSON.stringify(selected_victim_employee_id),csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()},
						success: function (json_data){
							var emp_data=json_data.data
							$('#update_witness_id').html('')
							if(emp_data)
							{ 
								var len=emp_data[0].length;
								for(var i=0;i<len;i++)
								{   
									$('#update_witness_id').append($('<option>', {
					                    value : emp_data[0][i].id,
					                    text : emp_data[0][i].name
					                }));
								}
								$('#update_witness_id').val(selected_victim_employee_id).trigger("change")

							}
							
						},
					})	
	}
	else if(global_button_name =='team')
	{
		var investigation_team=$('#team_id').val();
		var oTable = $("#attendance_popup_table").dataTable();
		if(investigation_team==null)
		{	
			investigation_team=[]
		}
		  $("input:checkbox:checked", oTable.fnGetNodes()).each(function() {
			  investigation_team.push(this.id);
		  }).get();
		  var selected_team_employee_id = investigation_team.filter( onlyUnique );
		  $.ajax(
					{
						type:'post',
						url: "/incident/employee_name/",
						data: {'id':JSON.stringify(selected_team_employee_id),csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()},
						success: function (json_data){
							var emp_data=json_data.data
							$('#team_id').html('')
							if(emp_data)
							{ 
								var len=emp_data[0].length;
								for(var i=0;i<len;i++)
								{   
									$('#team_id').append($('<option>', {
					                    value : emp_data[0][i].id,
					                    text : emp_data[0][i].name
					                }));
								}
								$('#team_id').val(selected_team_employee_id).trigger("change")

							}
							
						},
					})	
	}
	else{
		return true;
	}
});
