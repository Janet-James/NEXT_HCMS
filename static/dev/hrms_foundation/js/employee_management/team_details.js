var team_auto_id = '',org_name = '',org_unit_name = '',team_id='';
var	columns = [{'title':'ID'},{'title':'No.'},{'title':'Organization'},{'title':'Organization Unit'},{'title':'Division Name'},{'title':'Division Code'}]
var organization_id=0;
$(document).ready(function (){
	button_create(1)
	$("#select_org_unit").click(function(){
		organization_id=$("#organization").val();
		if (organization_id!=0){
			$('#organization_id_popup').val(organization_id).trigger('change');
			$('#organization_id_popup').attr("disabled", true); 
			$("#orgModal").modal("show");
		}
		else{
			alert_lobibox("error", sysparam_datas_list['NTE_56']);
		}
	})
	$("#org_unit_save").click(function() {
		org_unit_names =  remove_duplicate_org_unit(org_unit_name);
		org_unit_ids =  remove_duplicate_org_unit(org_unit_id);	
		$('#org_unit_id').val(org_unit_ids).trigger('change');
		generate_emp_id();
	});

	function remove_duplicate_org_unit(list){
		var uniqueNames = [];
		$.each(list, function(i, el){
			if($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
		});
		return uniqueNames;
	}
	teamCodeGenerate();
	team_datatable_function(null)
})

//org change
$("#organization").change(function() {
		org_unit($("#organization  option:selected").val())
});
//org unit
function org_unit(val){
	$.ajax({
		url : "/hrms_org_unit_change_structure_data/",
		type : "GET",
		data : {'id':val},
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		datas = JSON.parse(json_data);
		dropDownList(datas.results,'org_unit_id');
	});
}

//drop down list
function dropDownList(data,id){
		strAppend = '<option value="0">--Select Organization Unit--</option>'
		if(data.length>0){
			for(var i=0;i<data.length;i++){
				strAppend += '<option value="'+data[i].id+'">'+data[i].name+'</option>'
			}
			$('#'+id).html(strAppend).change();
		}else{
			$('#'+id).html(strAppend).change();
		}
}

//team code generation
function teamCodeGenerate(){
	$.ajax({
         type  : 'GET',
         url   : '/hrms_team_details_code/',
         async : false,
     }).done( function(json_data) {    	 
    	 data = JSON.parse(json_data);
    	 team_id = data.results[0].team_id;
     });
}

//team id generate here
function generate_team_id(){
	$('#team_code').val("")
    var team_id_temp = "";
    var emp_code_prefix = ""
    var org_name = $('#organization option:selected').text().toString();
	var org_names = org_name.match(/\b(\w)/g).join('').substring(0,3);   
	var org_unit_name = $('#org_unit_id option:selected').text().toString();
	
	var org_unit_id = $('#org_unit_id').val();
	if(org_unit_id==0){
		team_id_temp = (org_names).toUpperCase();
	}else{
		var org_unit_names = org_unit_name.toString().match(/\b(\w)/g).join('').substring(0,3);   
		team_id_temp = (org_names+"-"+org_unit_names).toUpperCase();	   
	}	
	 var team_auto_create_id = team_id_temp.replace(/[`~!@#$%^&*()_|+\=?;:'",.<>\{\}\[\]\\\/]/gi,'');
	 team_auto_id = team_auto_create_id+'-'+set_team_id(team_id);   
	 $('#team_code').val(team_auto_id)
}
//setting team id
function set_team_id(team_id){  
    if(team_id.length == 1){
    	team_id = "000"+team_id;
    }else if(team_id.length == 2){
    	team_id = "00"+team_id;
    }else if(team_id.length == 3){
    	team_id = "0"+team_id;
    }else{
    	team_id = team_id;
    }
    return team_id;
}

$("#org_unit_id").change(function(){
	generate_team_id();
}); 

function team_create_button(){
	if(team_form_validation())
	{
		team_create_function();
	}
}
//Team edit function here 
function team_edit_button() {
	
	if(team_form_validation())
	{
		team_create_function(team_update_id);
	}
}
//Team delete function here 
function team_delete_button() {
	var title = $('#team_name').val();
	removeConfirmation('teamDeleteFuncton',team_update_id,title);
}


//validation for the empty
function validationFields_org(val){
	return val=='' || val =='0' ?null:val 
}
//Team create update function here
function team_create_function(id){
	
	
	org_id=$("#organization").val()
	team_name=$("#team_name").val()
	team_code=$("#team_code").val()
	team_description=$("#team_description").val()
	
	if($('#organization option:selected').val()=='0')
	{
			$('#org_error').html("Select a Organization")
	}else
	{
	var team_form_value = getFormValues("#team_details_form");
	var    csrf_data = team_form_value.csrfmiddlewaretoken;
  delete team_form_value["csrfmiddlewaretoken"];
  team_form_value['is_active'] = "True";
  team_form_value['organization'] = validationFields_org(team_form_value['organization']);
  team_form_value['org_unit_id'] =validationFields_org(team_form_value['org_unit_id']);
  team_form_value['team_name'] = $('#team_name').val();
  team_form_value['team_code'] = $('#team_code').val();
  team_form_value['team_description'] = $('#team_description').val();
	team_list = [];
	team_dict = {};
	team_list.push(team_form_value);
	team_dict['input_data'] = team_list;
	if(id)
	{
		$.ajax({
	         type  : 'POST',
	         url   : '/hrms_team_details_crud/',
	         async : false,
	         data: {
	             'datas': JSON.stringify(team_list),
	             "table_id":team_update_id,
	             csrfmiddlewaretoken: csrf_data
	         },
	     }).done( function(json_data) {
	    	 data = JSON.parse(json_data);
		 	 var res_status = data['status'];
		 	 //alert_status(res_status)
		 	 if(res_status == 'NTE_03') {	 
		 		alert_lobibox("success", sysparam_datas_list[res_status]);
		 		button_create(1)
		 		team_cancel_button();
		 		team_datatable_function(null)
		 	 }else{
		 		alert_lobibox("info", "Division Name Already Exits");
		 	 } 
		 	 
	     });
	}else
	{
		$.ajax({
	         type  : 'POST',
	         url   : '/hrms_team_details_crud/',
	         async : false,
	         data: {
	             'datas': JSON.stringify(team_list),
	              csrfmiddlewaretoken: csrf_data
	         },
	     }).done( function(json_data) {
	    	data = JSON.parse(json_data);
	 		var res_status = data['status'];
	 		//alert_status(res_status)
	 		if(res_status == 'NTE_01') {	
	 			alert_lobibox("success", sysparam_datas_list[res_status]);
	 			team_cancel_button();
	 			team_datatable_function(null)
	 		}else{
		 		alert_lobibox("info", "Division Name Already Exits");
		 	 } 
	     });	
	}
	}
}
//delete function here
function teamDeleteFuncton(delete_id){
	$.ajax({
        type  : 'POST',
        url   : '/hrms_team_details_crud/',
        async : false,
        data: {
            'delete_id':delete_id,
             csrfmiddlewaretoken : $("input[name=csrfmiddlewaretoken]").val()
        },
    }).done( function(json_data) {
       data = JSON.parse(json_data);
		var res_status = data['status'];
		//alert_status(res_status);
		 alert_lobibox("success", sysparam_datas_list[res_status]);
		if(res_status == 'NTE_04') { 
			button_create(1);
			team_cancel_button();
			team_datatable_function(null)
		} 
    });
}

//Team data table function here
function team_datatable_function(param)
{
	if(!param && param != undefined){
		var data={csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()}	
	}
	else if(param){
		var data={csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val(),"value":param}
	}
	$.ajax(
			{
				url : '/hrms_team_details_data/',
				type : 'POST',
				timeout : 10000,
				data:data,
				async:false,
			}).done(
					function(json_data)
					{
						var data = JSON.parse(json_data)
						data=data.results;
						table_data=data.value;
						team_code=data.code
						if(team_code){
							team_code=team_code[0].code;
						}
						plaindatatable_btn('team_details',table_data, columns,0,'NEXT_TRANSFORM_HCMS_DOW_DEPARTMENT_'+currentDate());
					});
	return false
}
//team form validations here
function team_form_validation()
{
	return $('#team_details_form').valid();
}
var team_update_id="";
$('#team_details').on('click','tr',function(){
	team_table_id = $('#team_details').dataTable().fnGetData(this)[0];
	dataTableAcitveRowAdd('team_details',$(this).index());//active class add
	button_create()
	$.ajax(
			{
				url : '/hrms_team_table_click/',
				type : 'POST',
				timeout : 10000,
				data:{"table_id":team_table_id,csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()},
				async:false,
			}).done(
					function(json_data)
					{
						var data = JSON.parse(json_data)
						team_cancel_button();
						team_update_id = team_table_id;
						$("#org_unit_id").html("");
						
						$('#organization').val(data.results[0][1]).trigger('change');
						$("#org_unit_id").append("<option value='"+data.results[0][2]+"'>"+data.results[0][3]+"</option>");
						$('#org_unit_id').val(data.results[0][2]).trigger('change');
						$('#team_name').val(data.results[0][4]);
						$('#team_code').val(data.results[0][5]);
						$('#team_description').val(data.results[0][6]);
						
					});
});

//jquery Team validation
jQuery.validator.addMethod('valueNotEquals', function (value) {
  return (value != '0');
}, "Organization required");
//Team cancel function here 
function team_cancel_button() {
	$('.errorTxts').html('');
	$('#team_details_form').trigger("reset");
	$('#organization').val('0').trigger('change');
	$("#org_unit_id").empty();
	$("#org_unit_id").html("<option value='0' selected>--Select Organization Unit--</option>");
	$('#org_unit_id').val('0').trigger('change');
	$('#team_code').val('');
	team_update_id = '';
	teamCodeGenerate();
}

//cancel clear function call button
function cancelEvent(){
	if(team_update_id != '' ){
		var title = $('#team_name').val();
		orgClearFuncton('cancelEventCall','',title);
	}else{
		cancelEventCall();
	}
	team_datatable_function(null)
}

//cancel button 
function cancelEventCall(){
	button_create(1);
	team_cancel_button()
}

$('.select2').select2().change(function(){
//  $(this).valid();
	$('.errorTxts').html('');
});

$.validator.addMethod("alpha", function(value, element) {
    return this.optional(element) || value == value.match(/^[a-zA-Z\s]+$/);
});

$('#team_details_form').submit(function(e) {
    e.preventDefault();    
}).validate({
   rules: {
	   organization:
	   {
		   required: true,
           valueNotEquals:true,  
	   },	
	   org_unit_id: {
		   required: true,
		   valueNotEquals: true,
	   },
	   team_name: {
		   required: true,
		   alpha: true,
	   },
	   team_code:
	   {
		   required:true,		 
	   },	 
	   team_description:
	   {
		   alpha:true,  
	   },
   },
   //For custom messages
   messages: {
	   organization:
	   {
		   required: "Select Organization"  ,
           valueNotEquals: "Select Vaild Organization"  
	   },
	   org_unit_id: {
		   required: "Select Organization Unit"  ,
		   valueNotEquals: "Select Vaild Organization Unit"  
       },
       team_name:
	   {
    	   required: "Enter Division Name",
    	   alpha: "Team name cannot have a numbers",
	   },
	   team_code:
	   {
    	   required: "Enter Division Code",
	   },	   
	   team_description:
	   {
		   alpha: "Team description cannot have a numbers",  
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

//button create function here
function button_create(status){
	var access_for_create = jQuery.inArray( "Division", JSON.parse(localStorage.Create) );
	var access_for_write = jQuery.inArray( "Division", JSON.parse(localStorage.Write) );
	var access_for_delete = jQuery.inArray( "Division", JSON.parse(localStorage.Delete) );
	var strAppend = '';
	if(status == 1){
		if (access_for_create != -1){
			strAppend = "<button type='button' onclick='team_create_button()' class='btn btn-success btn-eql-wid btn-animate'>Add</button>"
		}strAppend += " <button type='button' onclick='cancelEvent()' class='btn btn-warning btn-animate btn-eql-wid btn-animate'>Cancel / Clear</button>"
		$('#hrms_team_details_btn').html(strAppend);
	}else{
		if (access_for_write != -1){
			strAppend = "<button type='button' onclick='team_edit_button()' class='btn btn-primary btn-eql-wid btn-animate'>Update</button>"
		}
		if (access_for_delete != -1){
			strAppend += " <button type='button' onclick='team_delete_button()' class='btn btn-danger btn-eql-wid btn-animate'>Remove</button>"
		}strAppend += " <button type='button' onclick='cancelEvent()' class='btn btn-warning btn-eql-wid btn-animate'>Cancel / Clear</button>"
		$('#hrms_team_details_btn').html(strAppend);
	}
}


