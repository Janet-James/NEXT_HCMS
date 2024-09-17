function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}
var clicked_row_id; var table_employee_id; var kpi_id; var kpi_type; var exsist_cascaded_data; var exsist_cas_len; var assessment_form_primary_key_id;
$(document).ready(function(){
	assessment_performnce_cancel(); performance_multiselect_placeholer();
});
//row clcik in datatable
$('#performance_assessment_table').on('click', 'tbody tr', function(){
    var arr=$('#performance_assessment_table').dataTable().fnGetData($(this)); 
     clicked_row_id=arr[4];
     table_employee_id=arr[5];
     $('#per_employee').html(arr[1])
     $('#per_role').html(arr[2])     
     $('#pre_category').html(arr[6])
     $.ajax({
 		type:"POST",
 		data:{'clicked_row_id':clicked_row_id,'employee_id':table_employee_id,csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()},
 		url: "/performance/kpi_view/",
 	}).done(function(json_data){
 		$('#assessment_view').show()
 		$('#assessor_data').html('')
 		   var cascaded_kpi=json_data.cascaded_data
 		   var cascaded_len=cascaded_kpi.length;
 		   var role_kpi=json_data.role_kpi_data
		   var role_len=role_kpi.length;
 		   $('#kpi_list').html('')
 		   if(cascaded_len>0)
 		   {    
 			   kpi_type="0"
 			   for(var i=0;i<cascaded_len;i++)
 			   { 
 				 kpi_id=cascaded_kpi[i].kpi_id
 				 assessment_form_primary_key_id=cascaded_kpi[i].id
 				 $('#kpi_list').append('<li class="" onclick=assessor_data('+clicked_row_id+','+kpi_id+','+kpi_type+','+assessment_form_primary_key_id+')> <a data-toggle="tab" href="#tab_1">'+cascaded_kpi[i].kpi_desc+'</a> <span class="after"> </span> </li>')
 			   }
 		   }
 		   if(role_len>0)
 		   {  
 			   kpi_type='1'
 			  for(var i=0;i<role_len;i++)
			   { 
 				 kpi_id=role_kpi[i].kpi_id
 				 assessment_form_primary_key_id=role_kpi[i].id
 				 $('#kpi_list').append('<li class="" onclick=assessor_data('+clicked_row_id+','+kpi_id+','+kpi_type+','+assessment_form_primary_key_id+')> <a data-toggle="tab" href="#tab_1">'+role_kpi[i].kpi_desc+'</a> <span class="after"> </span> </li>')
			   }
 	     }
 	});
     $('#assessment_details_popup').modal('show');
});
var new_form_id;
function assessor_data(form_id,kpi_id,type,b)
{    
	new_form_id=b
	 $.ajax({
	 		type:"POST",
	 		data:{'form_id':form_id,'kpi_id':kpi_id,'type_value':type,'new_form_id':new_form_id,csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()},
	 		url: "/performance/assessor_view/",
	 	}).done(function(json_data){
	 		 var assessor_data=json_data.assessor_details
	 		 var assessor_data_len=assessor_data.length;
	 		 var cascaded_rating_data=json_data.cascaded_assessor_details
	 		 var cascaded_rating_data_len=cascaded_rating_data.length;
	 		 exsist_cascaded_data=json_data.cascaded_exsiste_data;
	 		 exsist_cas_len=exsist_cascaded_data.length;
	 		 $('#rating_data').html('')
	 		 $('#assessor_data').html('')
	 		 $('#performance_table_div').show()
	 		 $('#assessment_view').show()
	 		  if(json_data.status=='NTE_00')
	 		 { 
	 			 alert_lobibox("error",sysparam_datas_list["ERR0035"])
	 		 }
	 		 if(assessor_data_len>0)
	 		 {
	 			 for(var i=0;i<assessor_data_len;i++)
	 			 {   
	 				 var template=''
	 				 var value=''
	 				 var button=''
	 				 var hidden_div=''
	 				 $('.dropdown1').html('')
	 				 if(cascaded_rating_data_len==2)
                        	{
	 					value='<div class="mt-radio-inline col-md-6 col-sm-12">'
                        	}
	 				 for(var j=0;j<cascaded_rating_data_len;j++)
	 				 {  
	 					var rating_id=[]
                        template='<div class="col-md-6 col-sm-12"><input type="text" class="form-control" placeholder="Feedback"  id="feedback'+assessor_data[i].refe_id+'" name="assessment_template_code"></div>'
                        if(cascaded_rating_data_len==2)
                        {
                        value+='<div class="radio"><label><input type="radio" value='+cascaded_rating_data[j].schema_rel_id+' name="test" id="'+assessor_data[i].refe_id+'_'+cascaded_rating_data[j].schema_rel_id+'"><span class="cr"><i class="cr-icon fa fa-circle"></i></span>'+cascaded_rating_data[j].custom_rating_name+'</label></div>'
                        }
                        if(cascaded_rating_data_len>2)
                        {   
                         value='<div class="input-icon"><div class="col-md-4"><select id="dropdown'+assessor_data[i].refe_id+'" name="rating_schema" class="form-control select2-multiple dropdown1"> <option value="0">--Select--</option></select></div></div>'
                        }
                        if(json_data.user==assessor_data[i].employee_id)
                        { 
                          button='<button type="button" class="btn btn-success btn-eql-wid btn-animate"  id="rating_save_button"  onclick=rating_save(this,'+cascaded_rating_data_len+','+type+','+kpi_id+','+new_form_id+')>save</button>'
                        }
                        else
                        {  
                        	button='';
                        }

                          hidden_div='<input type="hidden" class="" placeholder="Role" name="assessment_template_code" value='+cascaded_rating_data[j].schema_id+'>'
	 				 }
                     if(cascaded_rating_data_len==2)
                 	{
                 	value+='</div>'
                 	}
	 				 $('#assessor_data').append('<div class="portlet-body"> <div id="'+i+'" class="panel-group accordion"><div class="panel panel-default"> <div class="panel-heading" onclick=raitng_schema_details('+kpi_id+','+assessor_data[i].employee_id+','+assessor_data[i].refe_id+','+cascaded_rating_data_len+','+new_form_id+')> <h4 class="panel-title"> <a class="accordion-toggle accordion-toggle-styled collapsed" data-toggle="collapse" data-parent="#'+i+'" href="#a'+i+'"> '+assessor_data[i].ref_name+'  <span class="tab_text">'+assessor_data[i].name+'</span></a> </h4></div> <div id="a'+i+'" class="panel-collapse collapse"> <div class="panel-body" id="rating_data">'+value+template+button+hidden_div+'</div></div</div></div></div>')
	 			 }
	 			 for(var k=0;k<cascaded_rating_data_len;k++)
	 			 {
	 				$('.dropdown1').append("<option value="+cascaded_rating_data[k].schema_rel_id+">"+cascaded_rating_data[k].custom_rating_name+"</option>")
	 				rating_id.push(cascaded_rating_data[k].schema_rel_id)
          			$('.dropdown1').val(rating_id)
	 			}
	 		 }
	 		 else{
	 			 $('#assessor_data').html('No Data Available.')
	 		 }
	 	});
}
var assesser_id; var assessment_type_id; var assessment_form_primary_id;
function raitng_schema_details(kpi_id,assesser_name_id,assessment_type,cascaded_rating_data_len,a)
{   
	assesser_id=assesser_name_id
	assessment_type_id=assessment_type
	if(exsist_cas_len>0)
	{
	  for(var l=0;l<exsist_cas_len;l++)
	  {
		  if(exsist_cascaded_data[l].assessment_type_id==assessment_type_id)
		  {
		    $('#feedback'+assessment_type_id).val(exsist_cascaded_data[l].feed_back)
		    if(cascaded_rating_data_len==2)
            {
		     document.getElementById(assessment_type_id+'_'+exsist_cascaded_data[l].scheme_rel_id).checked = true;
		    }
		    if(cascaded_rating_data_len>2)
            { 
		     $('#dropdown'+assessment_type_id).val(exsist_cascaded_data[l].scheme_rel_id).trigger("change")
		    }
		  }
	  }
	}
}
var selected_primary_id
function rating_save(el,len,goal_id,kpi_id_id,primary_form_id)
{   
	selected_primary_id=primary_form_id
	var scheme_rel_id;
	if(len>2)
	{
		scheme_rel_id=$(el).siblings('div').find('select').val();
	}
	else
	{   
		scheme_rel_id=$(el).siblings('label').find('input[type=radio]:checked').val(); 
	}
	 var feedback=$(el).siblings('div').find('input').val();
	 var schema_id=$(el).siblings('input[type=hidden]').val();
	if (scheme_rel_id!='' && feedback!='' && schema_id!='' && clicked_row_id!='' && kpi_id!='' && kpi_type!='' && assesser_id!='' && table_employee_id!='' && schema_id!='' && selected_primary_id!='')
	{   
		$.ajax({
			type:"POST",
			data:{'form_id':clicked_row_id,'kpi_id':kpi_id_id,'type':goal_id,'assesser_id':assesser_id,'table_employee_id':table_employee_id,'scheme_rel_id':scheme_rel_id,'feedback':feedback,'schema_id':schema_id,'assessment_type_id':assessment_type_id,'selected_primary_id':selected_primary_id,csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()},
			url: "/performance/rating_save/",
		}).done(function(json_data){
			
			if(json_data.success_status=='NTE_01'){alert_lobibox("success", sysparam_datas_list[json_data.success_status]);assessor_data(clicked_row_id,kpi_id_id,goal_id,selected_primary_id) }
			else if(json_data.success_status=='NTE_03'){alert_lobibox("success", sysparam_datas_list[json_data.success_status]); assessor_data(clicked_row_id,kpi_id_id,goal_id,selected_primary_id)}
		});
	}
	else
	{
		alert_lobibox("info",sysparam_datas_list["NTE_46"])
	}
}
//        filter function
var org_unit_id_list = []
var org_unit_name_list = []
var employee_id=[]
var role_id=[]
$("#orgModal").on("hidden.bs.modal", function () {
    unique_id = []
    unique_name = []
    $('#organization_unit_select').empty()
    if(organization_unit_type>0){
            for(var i=0;i<org_unit_id.length;i++){
                org_unit_id_list.push(org_unit_id[i])
            }
            for(var i=0;i<org_unit_name.length;i++){
                org_unit_name_list.push(org_unit_name[i])
            }
            var unique_id = org_unit_id_list.filter( onlyUnique );
            var unique_name = org_unit_name_list.filter( onlyUnique );
            for(var j=0;j<unique_id.length;j++){
                $('#organization_unit_select').append("<option value="+unique_id[j]+">"+unique_name[j]+"</option>")
            }
            $('#organization_unit_select').val(unique_id)
            $('#role_div').show()
	        $('#employeee_name_div').show()
	        $('#performance_table_div').show()
            role_data();
        	$('#error').html('')
    }
});

function role_data(){
    role_organization_unit = $("#organization_unit_select").val();
    var role_unique_id = role_organization_unit.filter( onlyUnique );
    $.ajax({
            type:"POST",
            url: "/performance/org_unit_role/",
            data:{'role_unique_id':JSON.stringify(role_unique_id),csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()},
        }).done(function(json_datas){
            var data = JSON.parse(json_datas);
            var res_data =data.status
            $('#org_role').empty()
            for(var i=0;i<res_data.length;i++){
                $('#org_role').append($('<option>', {
                    value : res_data[i].id,
                    text : res_data[i].role_title
                }));
                role_id.push(res_data[i].id)
            }
            $('#org_role').val(role_id)
            employee_data()
        });
    }

function employee_data()
{
	 org_unit_role = $("#org_role").val();
	 var role_id = org_unit_role.filter( onlyUnique );
	 if(role_id)
	 {
		 $.ajax({
	            type:"POST",
	            url: "/performance/filter_employee/",
	            data:{'role_id':JSON.stringify(role_id),csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()},
	        }).done(function(json_data){
	        	 var employee_data=json_data.employee_data
	        	 var len=employee_data.length;
	        	
	        	 if(len>0)
	        	 {    
	        		 $('#employeee_name').empty()
	                 for(var i=0;i<len;i++){
	                     $('#employeee_name').append($('<option>', {
	                         value : employee_data[i].employee_id,
	                         text : employee_data[i].employee_name +" "+ employee_data[i].employee_last_name
	                     }));
	                     employee_id.push(employee_data[i].employee_id)
	                 }
	                 $('#employeee_name').val(employee_id)
	                 form_table_view()
	        	 }
	        	 else
	        		 {
	        		 alert_lobibox("info",sysparam_datas_list["NTE_47"])
	        		 }
	        })
	 }
}

function form_table_view()
{   
	 employee_id = $("#employeee_name").val();
	 if(employee_id==null){var selected_employee_id=employee_id}
	 else {var selected_employee_id = employee_id.filter( onlyUnique ); }
	 if(selected_employee_id)
	 {
		$.ajax({
			type:"POST",
			url: "/performance/data_table_view/",
			data:{'selected_employee_id':JSON.stringify(selected_employee_id),csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()},
		}).done(function(json_data){
			 var data = json_data;
			 var columns = [{"title":"No."},{"title":"Employee Name"},{"title":"Role"},{"title":"Template Name"},{"title":"form id","visible": false},{"title":"employee Id","visible": false},{"title":"Assessment Category"}]
			 var data_list=[]
			 if(data.employee_form_data.length>0)
			 {   
				 var data_len=data.employee_form_data.length;
				 alert(data_len)
				 if(data_len>0)
				 {  
					for(var i=0;i<data_len;i++)
					{   
						data_list.push([i+1,data.employee_form_data[i][0]['employee_name']+" "+data.employee_form_data[i][0]['last_name'], data.employee_form_data[i][0]['employee_role'],data.employee_form_data[i][0]['template_name'],
						               data.employee_form_data[i][0]['form_id'],data.employee_form_data[i][0]['employee_id'], data.employee_form_data[i][0]['category_name']]);
					}
					plaindatatable_btn('performance_assessment_table', data_list, columns,[])
				 }
			 }
			 else{
				 plaindatatable_btn('performance_assessment_table', data_list, columns,[])
			 }
		});
	 }
	 else
	{
		 alert_lobibox("info",sysparam_datas_list["NTE_40"])
	}
}
//onclick function for Search Button
function reportFieldModalView(selectList,searchId){
	employeeFieldId = searchId;
	if(selectList == "Role"){
		columnsDefs=[];
		columnsDefs.push(
		{
			title: "No."
		},{
			title: "Select"
		},{
			title: "Role"
		},{
			title: "Experience"
		},{
			title: "Preferred Education"
		},{
			title: "Role Need"
		},{
			title: "Responsibility"
		});
		role_clearPopupConfirmation("hcms_role_info",'role_popup_table');
		$('#roleSelectReport').modal('show');
	}
}
//form reset function here
function role_clearPopupConfirmation(formId,table_id){
	$('#'+formId)[0].reset();
	plaindatatable(table_id,[],columnsDefs);
}
//popup search function 
function role_searchPopupConfirmation(searchModalName){
	var search_Status = role_searchDatas(searchModalName);
}
function role_searchDatas(searchModalName){
	//Role search function
	 if(searchModalName=="Role"){

		var role_name = $("#role_name").val();
		datas = {'role_name':role_name};
		if(role_name!=""){
			$.ajax({
				url : '/report_role_search/',
				type : 'GET',
				data  : datas,
				timeout : 10000,
			}).done(
					function(json_data)
					{
						var data = JSON.parse(json_data);
						data_list = [];
						if(data)
						{ 
						  if(data.role_data.length>0)
						  {
						   for (var i=0; i<data.role_data.length; i++)
						   {
						    var cell_datas=''
						    cell_datas =  cell_datas = "<div class='mt-checkbox-inline'><label class='label-cbx'><input type='checkbox' id='template_active' name='sample' class='invisible' value='"+data.role_data[i][0]+" '><div class='checkbox'><svg width='20px' height='20px' viewBox='0 0 20 20'><path d='M3,1 L17,1 L17,1 C18.1045695,1 19,1.8954305 19,3 L19,17 L19,17 C19,18.1045695 18.1045695,19 17,19 L3,19 L3,19 C1.8954305,19 1,18.1045695 1,17 L1,3 L1,3 C1,1.8954305 1.8954305,1 3,1 Z'></path><polyline points='4 11 8 15 16 6'></polyline></svg></div></label></div>";
						    data_list.push([i+1,cell_datas,data.role_data[i][3],data.role_data[i][4],data.role_data[i][5],data.role_data[i][6],data.role_data[i][7]]);
							}
						  }
						}
						plaindatatable('role_popup_table',data_list,columnsDefs);
					});
		}
		else{
			swal({
				title: "Search Cancelled !!!",
				type: "error",
				confirmButtonClass: "btn btn-danger animate_btn"});
		}
		return true;
	}
}
var tableControl= document.getElementById('attendance_popup_table');
$('#getMultiValues').click(function() {
	if(status == 'NTE-HRMS' || status == 'NTE-TM'){
		arrayOfValues = [];
		strAppend = ''
		var oTable = $("#attendance_popup_table").dataTable();
		$("input:checkbox:checked", oTable.fnGetNodes()).each(function() {
			var status=employee_id.includes($(this).closest('tr').find('td').eq(0).text())
			if(status==false)
			{  
			   $('#employeee_name').append("<option value='"+$(this).closest('tr').find('td').eq(0).text()+"'>"+$(this).closest('tr').find('td').eq(3).text()+"</option")
			   strAppend += $(this).closest('tr').find('td').eq(3).text()+','
			   employee_id.push(this.id);
			}
		}).get();
	$('#employee').val(strAppend.slice(0,-1));
	}else{
		return true;
	}
	var employee_unique_id = employee_id.filter( onlyUnique );
	$('#employeee_name').val(employee_unique_id).trigger('change');
	form_table_view();
	$('#employeeSelect').modal('hide');
});
//table row click get id
var role_popup_table= document.getElementById('role_popup_table');
//click function for the get Values on Role Search and Select
$('#role_getRoleMultiValues').click(function() {
	arrayOfValues = [];
	strAppend = ''
		$('input:checkbox:checked', role_popup_table).each(function() {
			var status=role_id.includes($(this).val())
			if(status==false)
			{   
				$('#org_role').append($('<option>', {
	                value :$(this).val(),
	                text : $(this).closest('tr').find('td').eq(2).text()
	            }));
				strAppend += $(this).closest('tr').find('td').eq(2).text()+','
				role_id.push($(this).val());
			}
		}).get();
	$('#org_role').val(role_id.filter( onlyUnique )).trigger('change');
	$("#role_name").val('')
	plaindatatable('role_popup_table',[],columnsDefs);
	$('#roleSelectReport').modal('hide');
	employee_data();
});
var columns = [{"title":"No."},{"title":"Employee Name"},{"title":"Role"},{"title":"Template Name"},{"title":"form id","visible": false},{"title":"employee Id","visible": false},{"title":"Assessment Category"}]
function performance_assessment_search()
{
  var org_unit_id= $("#organization_unit_select").val();
  var org_role_id=$("#org_role").val();
  var org_employee_id=$("#employeee_name").val();
  if(org_unit_id!='' && org_unit_id!=null)
  {
	  if(org_unit_id!='' && org_unit_id!=null)
	  {   
		  var unique_org_unit = org_unit_id.filter( onlyUnique );
	  }
	  if(org_role_id!=null)
	  {
		  var unique_role_id = org_role_id.filter( onlyUnique );
	//	  employee_data();
	  }
	  if(org_employee_id!=null)
	  {
		  var unique_employee_id = org_employee_id.filter( onlyUnique );
	  }
	  var status = performance_assessment_form_validation();
	  if(status){ 
	  if (unique_org_unit || unique_role_id || unique_employee_id)
	  {  
		  $.ajax({
				url : '/performance/search/',
				type : 'POST',
				data  : {'unique_org_unit':JSON.stringify(unique_org_unit),'unique_role_id':JSON.stringify(unique_role_id),'unique_employee_id':JSON.stringify(unique_employee_id),csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()}
			}).done(
					function(json_data)
					{
						$('#error').html('')
					  var table_data=json_data.data
				      var data_list=[]
					  var length=table_data.length;
				      if(length>0)
				      { 
						for(var i=0;i<length;i++)
						{   
							data_list.push([i+1,table_data[i]['employee_name'],table_data[i]['employee_role'],table_data[i]['template_name'],
							               table_data[i]['form_id'],table_data[i]['employee_id'],table_data[i]['category_name']]);
						}
						plaindatatable_btn('performance_assessment_table', data_list, columns,[])
				   }
				 else{
					 plaindatatable_btn('performance_assessment_table', data_list, columns,[])
				 }
					});
	  }
	  }
  }
  else{ alert_lobibox("info","select Organization")  }
}
function assessment_performnce_cancel()
{   
	plaindatatable_btn('performance_assessment_table', [], columns,[])
	$('#organization_unit_select').val(0).trigger("change")
	$('#org_role').val(0).trigger("change")
	$('#employeee_name').val(0).trigger("change")
	$('#assessment_view').hide()
	$('#role_div').hide()
	$('#employeee_name_div').hide()
	$('#error').html('')
}
//validation
//Validation for Drop Data
$.validator.addMethod("valueNotEquals", function(value, element, arg){
	if(value == 0) {
		return false
	} else {
		return true
	}
}, "Value must not equal arg.");

//Validation For assessment form 
$('#performance_assessment_form').submit(function(e) {
		e.preventDefault();
	}).validate({
		rules: {
			
			organization_unit_select:{
				valueNotEquals:true,
			},
		},
		//For custom messages
		messages: {
			organization_unit_select: {
				valueNotEquals: "Select the org unit",
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
function performance_assessment_form_validation()
{
	return $('#performance_assessment_form').valid();
}
function performance_multiselect_placeholer()
{
	 $("#organization_unit_select").attr("data-placeholder","Organization unit");
	 $("#organization_unit_select").select2();	
}
