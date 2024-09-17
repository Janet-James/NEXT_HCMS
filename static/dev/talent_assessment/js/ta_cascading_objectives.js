var datascource = [];
$(document).ready(function(){
    setInterval(function(){ $('a[title="GetOrgChart jquery plugin"]').hide(); }, 10);
    defult_date();
});

function load_date(){
	$.ajax({
	    type:"POST",
	    url: "/load_date/",
	    data:{csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()},
	}).done(function(json_data){
		 $("#select_date").empty()
		var data = JSON.parse(json_data);
	 for(var i=0;i<data.status.length;i++){
         $('#select_date').append($('<option>', {
             value : data.status[i].eff_start_date,
             text : data.status[i].start_date
         }));
     }
	})
}

getOrgChart.buttons.add = '<g onclick="clickHandler(this);">' + getOrgChart.buttons.add + '</g>';
getOrgChart.buttons.edit = '<g onclick="clickHandler_edit(this);">' + getOrgChart.buttons.edit + '</g>';
getOrgChart.buttons.del = '<g onclick="clickHandler_delete(this);">' + getOrgChart.buttons.del + '</g>';
getOrgChart.buttons.details = '<g onclick="clickHandler_edit(this);">' + getOrgChart.buttons.details + '</g>';
 
function defult_date(value){
	if(value !=0){
		 $("#select_date").val(0).trigger("change")
	}
$.ajax({
    type:"POST",
    url: "/ta_cascading/",
    data:{csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()},
}).done(function(json_data){
    data = JSON.parse(json_data);
    var peopleElement = document.getElementById("cascade_dev");
    var result_data = data.status
    var child_data = data.child_data_result
    datascource = [];
    datascource.push({ id:'0', parentId:null, title: "Strategic Objectives", type: "Strategic Objectives",image: "/static/ui/images/goal.png",})
    for(i=0;i<result_data.length;i++){
        if(result_data[i].strategic_objective_driver_exist_id==null){
            datascource.push({ id: result_data[i].id, parentId:'0', title: result_data[i].strategic_objective_description, type:".",})
        }else{
            datascource.push({ id: result_data[i].id, parentId:result_data[i].strategic_objective_driver_exist_id, title: result_data[i].strategic_objective_description, type:".",})
        }}
        var orgChart = new getOrgChart(peopleElement, {
        primaryFields: ["type","title"],
        photoFields:["image"],
        dataSource: datascource,
    });
});
}
 
//Default Date
function defult_date_call(value){
		select_date = value 
		$("#select_date").val(value).trigger("change")
	    if(select_date !=0){
	    datascource = [];
	    $.ajax({
	        type:"POST",
	        url: "/cascade_objective_select/",
	        async:false,
	        data : {'select_date':select_date,csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()},
	        success: function (json_data) {
	            data = JSON.parse(json_data);
	            var peopleElement = document.getElementById("cascade_dev");
	            var result_data = data.status
	            var child_data = data.child_data_result
	            datascource = [];
	            datascource.push({ id:'0', parentId:null, title: "Strategic Objectives", type: "Strategic Objectives",})
	            for(i=0;i<result_data.length;i++){
	                if(result_data[i].strategic_objective_driver_exist_id==null){
	                    datascource.push({ id: result_data[i].id, parentId:'0', title: result_data[i].strategic_objective_description, type:".",})
	                }else{
	                    datascource.push({ id: result_data[i].id, parentId:result_data[i].strategic_objective_driver_exist_id, title: result_data[i].strategic_objective_description, type:".",})
	                }}
	                var orgChart = new getOrgChart(peopleElement, {
	                primaryFields: ["type","title"],
	                dataSource: datascource,
	            });
	        }
	    });
	    }
	    else{
	    	defult_date(0);
	    }
}
function defult_date(value){
	if(value !=0){
		 $("#select_date").val(0).trigger("change")
	}
    $.ajax({
        type:"POST",
        url: "/ta_cascading/",
        data:{csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()},
    }).done(function(json_data){
        data = JSON.parse(json_data);
        var peopleElement = document.getElementById("cascade_dev");
        var result_data = data.status
        var child_data = data.child_data_result
        datascource = [];
        datascource.push({ id:'0', parentId:null, title: "Strategic Objectives", type: "  ",image: "/static/ui/images/goal.png",})
        for(i=0;i<result_data.length;i++){
            if(result_data[i].strategic_objective_driver_exist_id==null){
                datascource.push({ id: result_data[i].id, parentId:'0', title: result_data[i].strategic_objective_description, type:".",})
            }else{
                datascource.push({ id: result_data[i].id, parentId:result_data[i].strategic_objective_driver_exist_id, title: result_data[i].strategic_objective_description, type:".",})
            }}
            var orgChart = new getOrgChart(peopleElement, {
            primaryFields: ["type","title"],
            photoFields:["image"],
            dataSource: datascource,
        });
    });
}
 
//org click event
function clickHandler(args) {
    event_id = $(args)["0"].childNodes["0"].attributes[2].nodeValue
    var select_date = $("#select_date").val();
    if (event_id==0){
        $("#sample_1").dataTable().fnDestroy();
        objective_datatable();
        $('#organization_unit_select').empty()
        clear_objectives();
/*        $('#cascade_objective').hide()
*/        table_id= 0
        role_list_data = []
        role_table_data();
        $('#drop_div').hide()
        $('#new_dev').show()
        $('input[type=radio][value=1]').prop('checked', true);
        $('input[type=radio][value=2]').prop('checked', false);
        $('#strategic_objectives').val('')
//                    $('#linked_submit').show()
//                    $('#linked_update').hide()
//                    $('#linked_remove').hide()
//                    $('#linked_cancel').show()
        linked_obj_button_show('add')
//        $('#objective_id').modal('show');
         $('#test > .col-md-12').addClass('col-md-6').removeClass('col-md-12');
        $('#objective_id').show();
        $('#objective_id').addClass('col-md-6').removeClass('col-md-12');
        $('#select_div').addClass('col-md-6').removeClass('col-md-3');
        localStorage.setItem(event_id,event_id);
        defult_date_call(select_date);
//        defult_date();
    }
    else{
        $("#sample_1").dataTable().fnDestroy();
        objective_datatable();
        $('#organization_unit_select').empty();
        clear_objectives();
/*        $('#cascade_objective').hide()
*/        table_id= 0
        role_list_data = []
        role_table_data();
        $('#drop_div').show()
        $('#new_dev').hide()
        $('input[type=radio][value=1]').prop('checked', false);
        $('input[type=radio][value=2]').prop('checked', true);
        $('#objective_driver_drop').val(event_id).trigger("change")
         $('#strategic_objectives').val('')
//                    $('#linked_submit').show()
//                    $('#linked_update').hide()
//                    $('#linked_remove').hide()
//                    $('#linked_cancel').show()
         linked_obj_button_show('add')
//        $('#objective_id').modal('show');
         $('#test > .col-md-12').addClass('col-md-6').removeClass('col-md-12');
        $('#objective_id').show();
        $('#objective_id').addClass('col-md-6').removeClass('col-md-12');
        $('#select_div').addClass('col-md-6').removeClass('col-md-3');
        localStorage.setItem(event_id,event_id);
        defult_date_call(select_date);
//        defult_date();
    }
}
 

// Selected Date Strategic Result
$("#select_date").change(function(){
	select_date = $("#select_date").val();
    if(select_date !=0){
    datascource = [];
    $.ajax({
        type:"POST",
        url: "/cascade_objective_select/",
        data : {'select_date':select_date,csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()},
        success: function (json_data) {
            data = JSON.parse(json_data);
            var peopleElement = document.getElementById("cascade_dev");
            var result_data = data.status
            var child_data = data.child_data_result
            datascource = [];
            datascource.push({ id:'0', parentId:null, title: "Strategic Objectives", type: " ",image: "/static/ui/images/goal.png",})
            for(i=0;i<result_data.length;i++){
                if(result_data[i].strategic_objective_driver_exist_id==null){
                    datascource.push({ id: result_data[i].id, parentId:'0',type: " ",title:result_data[i].strategic_objective_description,})
                }else{
                    datascource.push({ id: result_data[i].id, parentId:result_data[i].strategic_objective_driver_exist_id,type: ".",title:result_data[i].strategic_objective_description,})
                }}
                var orgChart = new getOrgChart(peopleElement, {
                primaryFields: ["type","title"],
                photoFields:["image"],
//                theme: "annabel",
                dataSource: datascource,
            });
        }
    });
    }
    else{
    	defult_date(0);
    }
    });
 
//Objective Setting edit Function
function clickHandler_edit(args){
    var event_id = $(args)["0"].childNodes["0"].attributes[2].nodeValue
    var select_date = $("#select_date").val();
    if(event_id!=0){
    obj_row_click(event_id);
//    $('#objective_id').modal('show');
    $('#test > .col-md-12').addClass('col-md-6').removeClass('col-md-12');
    $('#objective_id').show();
    $('#objective_id').addClass('col-md-6').removeClass('col-md-12');
    defult_date_call(select_date);
    }else{alert_lobibox("info",sysparam_datas_list["ERR0034"])
        defult_date();}
    }    
 
//Objective Setting Delete Function
function clickHandler_delete(args){
    var table_id = $(args)["0"].childNodes["0"].attributes[2].nodeValue
    var select_date = $("#select_date").val();
    if(table_id!=0){
    removeConfirmation('objective_delete',table_id);
//    objective_delete(event_id);
    defult_date_call(select_date);
//    defult_date();
    }else{alert_lobibox("info",sysparam_datas_list["ERR0035"])
        defult_date();}
    }

$('#form_close').click(function()
{
     $('#test > .col-md-6').addClass('col-md-12').removeClass('col-md-6');
     $('#objective_id').hide();
     $('#objective_id').addClass('col-md-12').removeClass('col-md-6');
     $('#select_div').addClass('col-md-3').removeClass('col-md-6');
});
function button_show(flag)
{   
	$("#setting_btn").empty();
	if (flag=='add')
	{ 
		var btnstr = '<button type="submit" class="btn btn-success btn-eql-wid btn-animate margin-right-3" onclick="objectives_submit()">Add</button>';
	}
	else
	{  
		var btnstr= '<button type="button" class="btn btn-primary btn-eql-wid btn-animate margin-right-3" onclick="objectives_update();"><i class="fa fa-green"></i> Update</button>';
		btnstr +='<button type="button" class="btn btn-danger btn-eql-wid btn-animate margin-right-3" onclick="objectives_remove();">Remove</button>';
	}
	btnstr += '<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-3" onclick="objectives_cancel();">Cancel / Clear</button>';
	$("#setting_btn").append(btnstr);	
}

function objectives_cancel(){
    $('input[type=radio][value=1]').prop('checked', true);
    $('input[type=radio][value=2]').prop('checked', false);
    $('#new_dev').show();
    $('#drop_div').hide()
    $('#objective_role').val(0).trigger("change")
    $("#role_table_id").dataTable().fnDestroy();
    role_table_data();
    clear_objectives();
    defult_date();
    button_show('add')
    $('#test > .col-md-6').addClass('col-md-12').removeClass('col-md-6');
    $('#objective_id').hide();
    $('#objective_id').addClass('col-md-12').removeClass('col-md-6');
    $('#select_div').addClass('col-md-3').removeClass('col-md-6');
}

//Objective Setting View Function
function objectives_submit(){
    data = {}
    form_value = getFormValues("#objective_data");
    if(form_value.set_budget == ''){form_value['set_budget'] = null
    }if(form_value.currency_type == '0'){form_value['currency_type'] = null
    }
    var objective_kpi_empty_flag=''
    var kpi_action_item_list = []
    $('#kpi_table_id_tbody tr').each(function(row, tr){
             if($(tr).find('td:eq(0) input').val()=='' ||$(tr).find('td:eq(0) input').val()==undefined){objective_kpi_empty_flag='empty'
             }else if($(tr).find('td:eq(1) input').val()=='' ||$(tr).find('td:eq(1) input').val()==undefined){objective_kpi_empty_flag='empty'
             }else if($(tr).find('td:eq(2) input').val()=='' ||$(tr).find('td:eq(2) input').val()==undefined){objective_kpi_empty_flag='empty'
             }else if($(tr).find('td:eq(3) select option:selected').val()=='' ||$(tr).find('td:eq(3) select option:selected').val()==undefined){objective_kpi_empty_flag='empty'
             }else if($(tr).find('td:eq(4) select option:selected').val()=='' ||$(tr).find('td:eq(4) select option:selected').val()==undefined){ objective_kpi_empty_flag='empty'
             }
             kpi_action_item_list[row]={
                "summary":$(tr).find('td:eq(0) input').val()
                ,"target":$(tr).find('td:eq(1) input').val()   
                ,"target_type":$(tr).find('td:eq(2) input').val()   
                ,"rating_schema":$(tr).find('td:eq(3) select option:selected').val()
                ,"tracking_type":$(tr).find('td:eq(4) select option:selected').val()
             }
        });        
    var assign_data_list =[]
    $('#role_table_id_tbody tr').each(function(row, tr){
    	assign_data_list[row]={
            "org_id":$(tr).find('td:eq(0) input[type=hidden]').val()
            ,"org_data":$(tr).find('td:eq(0)').text() 
            ,"role_id":$(tr).find('td:eq(1) input[type=hidden]').val()
            ,"role_data":$(tr).find('td:eq(1)').text()
         }
    });
    form_value['strategic_objective'] = form_value.strategic_objective.trim()
    data['role'] = assign_data_list
    data['datas'] = form_value
    data['kpi'] = kpi_action_item_list
    if(data['role'][0].org_data != "No data available"){$(".errorTxt5").html('Select Assign Value')}
    if(form_value.objective_driver == '' && form_value.objective_driver_drop==0){$(".errorTxt0").html('Fill the Objective Driver')}
    var status = objective_form_validation();
    if(status){
    if(form_value.objective_driver != '' && form_value.objective_driver_drop==0 || form_value.objective_driver == '' && form_value.objective_driver_drop !=0){
    if(data['role'][0].org_data != "No data available"){
    if(objective_kpi_empty_flag != 'empty'){
    $.ajax({
        type:"POST",
        url: "/str_obj_create/",
        data:{'data':JSON.stringify(data),csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()},
    }).done(function(json_data){
        var data=JSON.parse(json_data);
         if(data.status=='NTE_01'){
        	 if(data.id)
        	 {  
        		alert_lobibox("success", sysparam_datas_list[data.status]);
//                alert_status(data.status)
        	    linked_submit_id(data.id)
        	 }
//             objective_datatable_list = []
//            objective_datatable();
//            clear_objectives();
//            role_table_data();
//            $('#organization_unit_select').empty()
            $('#objective_submit').hide()
		    $('#objective_update').show()
		    $('#objective_remove').show()
		    $('#objective_cancel').show()
		    $('#test > .col-md-6').addClass('col-md-12').removeClass('col-md-6');
     $('#objective_id').hide();
     $('#objective_id').addClass('col-md-12').removeClass('col-md-6');
     $('#select_div').addClass('col-md-3').removeClass('col-md-6');
            table_id= data.id
            obj_row_click(table_id)
            defult_date_call(select_date);
            load_date();
            }
         else if (data.status=='Objective Already Exist') {alert_lobibox("error",sysparam_datas_list["NTE_18"])}
         else if (data.status=='Fill all KPI value') {alert_lobibox("error",sysparam_datas_list["ERR0033"])}
         else if (data.status=='Start Date should greater than End Date Format') {alert_lobibox("error",sysparam_datas_list["NTE_21"])}
         else if (data.status=='Cannot able to Add the Past Record'){alert_lobibox("error",sysparam_datas_list["NTE_19"])}
        });
    }else{alert_lobibox("error",sysparam_datas_list["ERR0033"])}
    }else{alert_lobibox("error",sysparam_datas_list["NTE_30"])}
    }else{alert_lobibox("error",sysparam_datas_list["NTE_31"])}
    }else{alert_lobibox("error",sysparam_datas_list["ERR0009"])
    }
    return false;
}
 
//Objective Setting Update Function
function objectives_update(){
    data = {}
    form_value = getFormValues("#objective_data");
    form_value['id'] = table_id
    var objective_kpi_empty_flag=''
    var kpi_action_item_list = []
    $('#kpi_table_id_tbody tr').each(function(row, tr){
         if($(tr).find('td:eq(0) input').val()=='' ||$(tr).find('td:eq(0) input').val()==undefined){ objective_kpi_empty_flag='empty'
         }else if($(tr).find('td:eq(1) input').val()=='' ||$(tr).find('td:eq(1) input').val()==undefined){objective_kpi_empty_flag='empty'
         }else if($(tr).find('td:eq(2) input').val()=='' ||$(tr).find('td:eq(2) input').val()==undefined){objective_kpi_empty_flag='empty'
         }else if($(tr).find('td:eq(3) select option:selected').val()=='' ||$(tr).find('td:eq(3) select option:selected').val()==undefined){objective_kpi_empty_flag='empty'
         }else if($(tr).find('td:eq(4) select option:selected').val()=='' ||$(tr).find('td:eq(4) select option:selected').val()==undefined){objective_kpi_empty_flag='empty'
         }
         kpi_action_item_list[row]={
            "summary":$(tr).find('td:eq(0) input').val()
            ,"target":$(tr).find('td:eq(1) input').val()    
            ,"target_type":$(tr).find('td:eq(2) input').val()  
            ,"rating_schema":$(tr).find('td:eq(3) select option:selected').val()
            ,"tracking_type":$(tr).find('td:eq(4) select option:selected').val()
            ,"id":$(tr).find('td:eq(5) input').val()
         }
        });
	    var assign_data_list =[]
	    $('#role_table_id_tbody tr').each(function(row, tr){
	    	assign_data_list[row]={
	            "org_id":$(tr).find('td:eq(0) input[type=hidden]').val()
	            ,"org_data":$(tr).find('td:eq(0)').text() 
	            ,"role_id":$(tr).find('td:eq(1) input[type=hidden]').val()
	            ,"role_data":$(tr).find('td:eq(1)').text()
	            ,"id":$(tr).find('td:eq(2) input[type=hidden]').val()
	         }
	    });
        if(form_value.set_budget == ''){form_value['set_budget'] = null
        }if(form_value.currency_type == undefined || form_value.currency_type == '0'){form_value['currency_type'] = null
        }
    data['role'] = assign_data_list
    data['datas'] = form_value
    data['kpi'] = kpi_action_item_list
    if(data['role'][0].org_data == "No data available"){$(".errorTxt5").html('Select Assign Value')}
    if(form_value.objective_driver == '' && form_value.objective_driver_drop==0){$("'.errorTxt0' <div id='strategic_objective-error' class='error'></div>").html('Fill the Objective Driver')}
    var status = objective_form_validation();
    if(status){
    if(form_value.objective_driver != '' && form_value.objective_driver_drop==0 || form_value.objective_driver == '' && form_value.objective_driver_drop !='0'){
    if(data['role'][0].org_data != "No data available"){
    if (objective_kpi_empty_flag != 'empty'){
    $.ajax({
        type:"POST",
        url: "/str_obj_update/",    
        data:{'data':JSON.stringify(data),csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()},
    }).done(function(json_data){
        var data=JSON.parse(json_data);
        if(data.status=='NTE_03'){
        	alert_lobibox("success", sysparam_datas_list[data.status]);
                   alert_status(data.status)
//                   org_unit_id =[]
//                    res_org_data =[]
//                   test_org = []
//                   $("#sample_1").dataTable().fnDestroy();
//                   var obj_table=$('#sample_1').DataTable();
//                   obj_table.clear().draw();
//                   objective_datatable_list = []
//                       objective_datatable();
//                       $('#organization_unit_select').empty()
//                       clear_objectives();
//                       role_table_data();
//                       $('#organization_unit_select').val(0).trigger("change")
                $('#objective_submit').hide()
       		    $('#objective_update').show()
       		    $('#objective_remove').show()
       		    $('#objective_cancel').show()
                table_id= data.id
                obj_row_click(table_id)
                load_date();
                   $('#test > .col-md-6').addClass('col-md-12').removeClass('col-md-6');
                   $('#objective_id').hide();
                   $('#objective_id').addClass('col-md-12').removeClass('col-md-6');
                   $('#select_div').addClass('col-md-3').removeClass('col-md-6');
         }else if (data.status=='Objective Already Exist'){alert_lobibox("error",sysparam_datas_list["NTE_18"])
         }else if (data.status=='Fill all KPI value'){alert_lobibox("error",sysparam_datas_list["ERR0033"])
         }else if (data.status=='Start Date should greater than End Date Format'){alert_lobibox("error",sysparam_datas_list["NTE_21"])
         }else if (data.status=='Cannot able to Update the Past Record'){alert_lobibox("error",sysparam_datas_list["NTE_19"])
         }
     });
    }else{alert_lobibox("error",sysparam_datas_list["ERR0033"])}
    }else{alert_lobibox("error",sysparam_datas_list["NTE_30"])}
    }else{alert_lobibox("error",sysparam_datas_list["NTE_31"])}
    }else{alert_lobibox("error", sysparam_datas_list["ERR0009"]); 
    }
    return false;
}

function objectives_remove(){
    if(table_id !=0){
        removeConfirmation('objective_delete',table_id);
//        objective_delete(table_id);
        }
    else{alert_lobibox("error",sysparam_datas_list["NTE_22"])}
}
//function button_show(action_name){
//$("#obj_setting_btn").html('');
//var btnstr = '';
//var access_for_create = jQuery.inArray( "assessment form", JSON.parse(localStorage.Create) );
//var access_for_write = jQuery.inArray( "assessment form", JSON.parse(localStorage.Write) );
//var access_for_delete = jQuery.inArray( "assessment form", JSON.parse(localStorage.Delete) );
//if (action_name == 'add') {
//  if (access_for_create != -1){
//      btnstr += '<button type="button" class="btn btn-success btn-eql-wid btn-animate margin-right-3" id="objective_submit">Add</button>';
//  }
//  btnstr +=  '<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-3" id="objective_cancel">Cancel / Clear</button>';
//} else if (action_name == 'update') {
//  if (access_for_write != -1){
//      btnstr += '<button type="button" class="btn btn-primary btn-eql-wid btn-animate margin-right-3" id="objective_update"><i class="fa fa-green"></i> Update</button>';
//  }
//  if (access_for_delete != -1){
//      btnstr +='<button type="button" class="btn btn-danger btn-eql-wid btn-animate margin-right-3" id="objective_remove">Remove</button>';
//  }
//  btnstr +=  '<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-3" id="objective_cancel" >Cancel / Clear</button>';
//}
//$("#obj_setting_btn").append(btnstr);
//}
function linked_obj_button_show(flag)
{   
	$("#linked_obj_btn").empty();
	if (flag=='add')
	{ 
		var btnstr = '<button type="submit" class="btn btn-success btn-eql-wid btn-animate margin-right-3" onclick="linked_submit();">Add</button>';
	}
	else
	{  

		var btnstr= '<button type="button" class="btn btn-primary btn-eql-wid btn-animate margin-right-3" onclick="linked_update();"><i class="fa fa-green"></i> Update</button>';
		btnstr +='<button type="button" class="btn btn-danger btn-eql-wid btn-animate margin-right-3" onclick="linked_remove();">Remove</button>';
	}
	btnstr += '<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-3" onclick="linked_cancel();">Cancel / Clear</button>';
	$("#linked_obj_btn").append(btnstr);	
}

//function linked_obj_button_show(action_name){
//$("#linked_obj_btn").html('');
//var btnstr = '';
//var access_for_create = jQuery.inArray( "assessment form", JSON.parse(localStorage.Create) );
//var access_for_write = jQuery.inArray( "assessment form", JSON.parse(localStorage.Write) );
//var access_for_delete = jQuery.inArray( "assessment form", JSON.parse(localStorage.Delete) );
//if (action_name == 'add') {
//  if (access_for_create != -1){
//      btnstr += '<button type="button" class="btn btn-success btn-eql-wid btn-animate margin-right-3" onclick="linked_submit();">Add</button>';
//  }
//  btnstr +=  '<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-3" onclick="linked_cancel();">Cancel / Clear</button>';
//} else if (action_name == 'update') {
//  if (access_for_write != -1){
//      btnstr += '<button type="button" class="btn btn-primary btn-eql-wid btn-animate margin-right-3"  onclick="linked_update();"><i class="fa fa-green"></i> Update</button>';
//  }
//  if (access_for_delete != -1){
//      btnstr +='<button type="button" class="btn btn-danger btn-eql-wid btn-animate margin-right-3"  onclick="linked_remove();">Remove</button>';
//  }
//  btnstr +=  '<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-3" onclick="linked_cancel();" >Cancel / Clear</button>';
//}
//$("#linked_obj_btn").append(btnstr);
//}