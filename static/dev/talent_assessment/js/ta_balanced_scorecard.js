//Financial Data Call 
$("#financial_dev p").click(function(){
	var objective_id = $(this)["0"].id
	if(objective_id!=0){
		obj_row_click(objective_id);
//		 $('#cascade_objective_model').modal('show');
		 $('#balance_scorecard_view > .col-md-12').addClass('col-md-6').removeClass('col-md-12');
		 $('#cascade_objective_model').show();
	      $('#cascade_objective_model').addClass('col-md-6').removeClass('col-md-12');
	}
	});

//Custom Data Call 
$("#custom_dev p").click(function(){
	var objective_id = $(this)["0"].id
	if(objective_id!=0){
		obj_row_click(objective_id);
//		 $('#cascade_objective_model').modal('show');
		$('#balance_scorecard_view > .col-md-12').addClass('col-md-6').removeClass('col-md-12');
		 $('#cascade_objective_model').show();
	      $('#cascade_objective_model').addClass('col-md-6').removeClass('col-md-12');
	}
	});
//Knowledge Data Call 
$("#knowledge_dev p").click(function(){
	var objective_id = $(this)["0"].id
	if(objective_id!=0){
		obj_row_click(objective_id);
//		 $('#cascade_objective_model').modal('show');
		$('#balance_scorecard_view > .col-md-12').addClass('col-md-6').removeClass('col-md-12');
		 $('#cascade_objective_model').show();
	      $('#cascade_objective_model').addClass('col-md-6').removeClass('col-md-12');
	}
	});
//Process Data Call
$("#process_dev p").click(function(){
	var objective_id = $(this)["0"].id
	if(objective_id!=0){
		obj_row_click(objective_id);
//		 $('#cascade_objective_model').modal('show');
		$('#balance_scorecard_view > .col-md-12').addClass('col-md-6').removeClass('col-md-12');
		 $('#cascade_objective_model').show();
	      $('#cascade_objective_model').addClass('col-md-6').removeClass('col-md-12');
	}
	});
	
var table_id = 0
var strategic_objectives_id =0
var kpi_datatable_id = []
var res_org_data =[]
var test_org = []
var role_list_data = []
//Editable data table function
function editable_datatable(tbl_name,tbl_plus_id, titles,data) {
    var table = $("#"+tbl_name);
    var oTable = table.dataTable({
        "lengthMenu": [[5, 15, 20, -1], [5, 15, 20, "All"] ],// change per page values here
        "pageLength": 5,
        "language": {
        "lengthMenu": " _MENU_ records"},
        "columns": titles,
        "data": data,
        "columnDefs": [{ // set default column settings
            'orderable': true,
            'targets': [0]},{
        "searchable": true,
        "targets": [0] }],
        "order": [[0, "asc"]], // set first column as a default sort by asc
        "buttons":[]
    });
    var nEditing = null;
    var nNew = false;
    // Table add row click
    $('#'+tbl_plus_id).click(function (e) {
        e.preventDefault();
        if (nNew && nEditing) {
            if (confirm("Previose row not saved. Do you want to save it ?")) {
                saveRow(oTable, nEditing); // save
                $(nEditing).find("td:first").html("Untitled");
                nEditing = null;
                nNew = false;}
            else {
                oTable.fnDeleteRow(nEditing); // cancel
                nEditing = null;
                nNew = false;
                return;
            }}
        var oData = oTable.fnGetData()[0];
        var temp_list = [];
        var aiNew = oTable.fnAddData(['', '', '', '', '', '']);
        var nRow = oTable.fnGetNodes(aiNew[0]);
        editRow(oTable, nRow);
        nEdi0ting = nRow;
        nNew = true;
    });
}
 
function restoreRow(oTable, nRow) {
    var aData = oTable.fnGetData(nRow);
    var jqTds = $('>td', nRow);
    for (var i = 0, iLen = jqTds.length; i < iLen; i++) {
        oTable.fnUpdate(aData[i], nRow, i, false);
    }
    oTable.fnDraw();    
}
 
function editRow(oTable, nRow) {
    var aData = oTable.fnGetData(nRow);
    var jqTds = $('>td', nRow);
    $("#kpi_table_id_tbody tr").find('td:eq(5) .kpi_hidden_s_no').each(function(){
        kpi_datatable_id.push($(this).val())
    });
    var sno=$("#kpi_table_id_tbody tr").find('td:eq(0)').length+1
    if((kpi_datatable_id.includes(sno.toString()))==true){            
        var post_biggest = 0;
        for(i=0; i < kpi_datatable_id.length; i++ ) {
            if( kpi_datatable_id[i] > post_biggest ) {
                post_biggest = kpi_datatable_id[i];
                sno=parseInt(post_biggest)+1
            }
        }
    }else{sno=$("#kpi_table_id_tbody tr").find('td:eq(0)').length+1
    }
    jqTds[0].innerHTML = '<input type="text" class="form-control input-small kpi_data" id="kpi_summary">';
    jqTds[1].innerHTML = '<input type="text" class="form-control input-small kpi_data number" data-toggle="tooltip" title="Specify target level for KPI(Number Only)" id="kpi_target" >';
    jqTds[2].innerHTML = '<input type="text" class="form-control input-small kpi_data" id="target_type" name ="target_type">';
//    jqTds[2].innerHTML = '<select class="form-control kpi_data tgt_type"  id="target_type'+sno+'" name = "target_type"><option value="0">--Select--</option></select><span class="help-block"> </span> </div>';
    jqTds[3].innerHTML = '<select class="form-control kpi_data rating_type" id="rating_schema'+sno+'" name = "rating_schema"><option value="0">--Select--</option></select><span class="help-block"> </span> </div>';
    jqTds[4].innerHTML = '<select class="form-control kpi_data" id="track_type'+sno+'" name = "track_type"><option value="0">--Select--</option></select><span class="help-block">  </span> </div>';
    jqTds[5].innerHTML = '<i class="nf nf-trash-o objectives_row_delete"><input type="hidden" class="form-control input-small"/><input type="hidden" class="form-control input-small kpi_hidden_s_no" value="'+sno+'"/>';
    drop_down_value(sno);    
}

$('.number').keypress(function(eve) {
	  if ((eve.which != 46 || $(this).val().indexOf('.') != -1) && (eve.which < 48 || eve.which > 57) || (eve.which == 46 && $(this).caret().start == 0)) {
	    eve.preventDefault();
	  }
	  // this part is when left part of number is deleted and leaves a . in the leftmost position. For example, 33.25, then 33 is deleted
	  $('.number').keyup(function(eve) {
	    if ($(this).val().indexOf('.') == 0) {
	      $(this).val($(this).val().substring(1));
	    }
	  });
	});
 

function cancelEditRow(oTable, nRow) {
    var jqInputs = $('input', nRow);
    oTable.fnUpdate(jqInputs[0].value, nRow, 0, false);
    oTable.fnUpdate(jqInputs[1].value, nRow, 1, false);
    oTable.fnUpdate(jqInputs[2].value, nRow, 2, false);
    oTable.fnUpdate(jqInputs[3].value, nRow, 3, false);
    oTable.fnUpdate(jqInputs[4].value, nRow, 4, false);
    oTable.fnUpdate(jqInputs[5].value, nRow, 5, false);
    oTable.fnUpdate('<a class="edit" href=""><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>', nRow, 6, false);
    oTable.fnDraw();
}
 
//Document Load Function
$(document).ready(function(){
    $('#organization_unit_select').val(0).trigger("change")
    kpi_datatable();
    role_table_data();
    objective_datatable_list = []
    objective_datatable();
    $('#drop_div').hide()
//    $('#objective_submit').show()
//    $('#objective_update').hide()
//    $('#objective_remove').hide()
//    $('#objective_cancel').show()
    button_show('add')
    multiselect_placeholer();
});
 
 
$('input[type=radio][name=test]').change(function() {
    if (table_id ==0){
    if(this.value=='1'){
        $('#drop_div').hide();
        $('#new_dev').show();
        kpi_table=$('#kpi_table_id').DataTable();
        kpi_table.clear().draw();
        clear_objectives();
    }else if (this.value == '2'){
        kpi_table=$('#kpi_table_id').DataTable();
        kpi_table.clear().draw();
        $('#new_dev').hide();
        $('#drop_div').show()
        clear_objectives();
    }
    }else{
            if(this.value=='1'){
                $('#drop_div').hide();
                $('#new_dev').show();
            }else if (this.value == '2'){
                $('#objective_driver').val('');
                $('#new_dev').hide();
                $('#drop_div').show()
            }
        }
    });
 
function clear_objectives(){
//	    $('input[type=radio][value=1]').prop('checked', true);
    kpi_table=$('#kpi_table_id').DataTable();
    kpi_table.clear().draw();
//    $('#objective_submit').show()
//    $('#objective_update').hide()
//    $('#objective_remove').hide()
//    $('#objective_cancel').show()
    button_show('add')
    $('#objective_type').val(0).trigger("change")
    $('#organization_unit_select').val(0).trigger("change")
    $('#objective_driver_drop').val(0).trigger("change")
    $('#currency_type').val(0).trigger("change")
    $('#objective_driver').val('')
    $('#strategic_objective').val('')
    $('#action_to_achieve').val('')
    $('#start_date').val('')
    $('#end_date').val('')
    $('#set_budget').val('')
    $('#expected_outcome').val('')
    $(".errormessage").html('')
    multiselect_placeholer()
    // function for assessment form
//	    var form_hidden_id=$('#hidden_objective_role').val()
//	    if(form_hidden_id=='0'){$('#objective_role').val(0).trigger("change")}
    }
 
//Linked Clear Function
//$("#linked_cancel").click(function(){
function linked_cancel(){
    $('#strategic_objectives').val('')
    $('#hidden_strategic_objectives_id').val(0)
    linked_submit_id(0)
//                    $('#linked_submit').show()
//                    $('#linked_update').hide()
//                    $('#linked_remove').hide()
//                    $('#linked_cancel').show()
    linked_obj_button_show('add')
}
 
//Objective Setting Clear Function
//$("#objective_cancel").click(function(){
function objective_cancel(){
	$('input[type=radio][value=1]').prop('checked', true);
    $('input[type=radio][value=2]').prop('checked', false);
    $('#new_dev').show();
    $('#drop_div').hide()
    $('#objective_role').val(0).trigger("change")
    $("#role_table_id").dataTable().fnDestroy();
    role_table_data();
    clear_objectives();
}
//});
 
//Drop Down Value
function drop_down_value(id_no){
    $.ajax({
        type:"POST",
        url: "/drop_down_value/",
        data:{csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()},
        async :false,
    }).done(function(json_data){
//        $("#target_type"+id_no).html('');
        $("#rating_schema"+id_no).html('');
        $("#track_type"+id_no).html('');
        var data = JSON.parse(json_data);
        var ra_first_option = new Option('--Select--','')
        document.getElementById("rating_schema"+id_no).insertBefore(ra_first_option,document.getElementById("rating_schema"+id_no).firstChild)
        ra_first_option.setAttribute("hidden","true");
        for(var i=0;i<data.scheme_data.length;i++){
            $('#rating_schema'+id_no).append($('<option>', {
                value : data.scheme_data[i].id,
                text : data.scheme_data[i].custom_rating_scheme_name
            }));
        }
        var tr_first_option = new Option('--Select--','')
        document.getElementById("track_type"+id_no).insertBefore(tr_first_option,document.getElementById("track_type"+id_no).firstChild)
        tr_first_option.setAttribute("hidden","true");
        for(var i=0;i<data.status.length;i++){
            $('#track_type'+id_no).append($('<option>', {
                value : data.status[i].id,
                text : data.status[i].refitems_name
            }));
        }
    });
    }
 
function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}
 
function role_data(){
    role_organization_unit = $("#organization_unit_select").val();
    var role_unique_id = role_organization_unit.filter( onlyUnique );
    $.ajax({
            type:"POST",
            url: "/org_unit_role/",
            async:false,
            data:{'role_unique_id':JSON.stringify(role_unique_id),csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()},
        }).done(function(json_datas){
            var data = JSON.parse(json_datas);
            var res_data =data.status
            $('#objective_role').empty()
            for(var i=0;i<res_data.length;i++){
                $('#objective_role').append($('<option>', {
                    value : res_data[i].id,
                    text : res_data[i].role_title
                }));
            }
        });
    }
var org_unit_id_list = []
var org_unit_name_list = []
$("#orgModal").on("hidden.bs.modal", function () {
    unique_id = []
    unique_name = []
    $('#organization_unit_select').empty()
    if(organization_unit_type){
            for(var i=0;i<org_unit_id.length;i++){
                org_unit_id_list.push(org_unit_id[i])
            }
            for(var i=0;i<org_unit_name.length;i++){
                org_unit_name_list.push(org_unit_name[i])
            }
            var unique_id = org_unit_id.filter( onlyUnique );
            var unique_name = org_unit_name.filter( onlyUnique );
            for(var j=0;j<unique_id.length;j++){
                $('#organization_unit_select').append("<option value="+unique_id[j]+">"+unique_name[j]+"</option>")
            }
            $('#organization_unit_select').val(unique_id)
            role_data();
    }
});
 
//Onchange for Role
$("#objective_role").change(function(){
    objective_role_id = $("#objective_role").val();
    if(objective_role_id !=0){$(".errorTxt6").html('')}
});
$("#objective_type").change(function(){
    objective_type_id = $("#objective_type").val();
    if (objective_type_id !=0){$(".errorTxt2").html('')}
});
 
 
//Objective Setting View Function
//$("#objective_submit").click(function(){
function objective_submit(){
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
//                alert_status(data.status)
                	alert_lobibox("success", sysparam_datas_list[data.status]);
        	    linked_submit_id(data.id)
        	 }
//             objective_datatable_list = []
//            objective_datatable();
//            clear_objectives();
//	            $("#role_table_id").dataTable().fnDestroy();
//            role_table_data();
//            $('#organization_unit_select').empty()
//            $('#objective_submit').hide()
//		    $('#objective_update').show()
//		    $('#objective_remove').show()
//		    $('#objective_cancel').show()
        	 button_show('update')
            table_id= data.id
            obj_row_click(table_id)
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
//$("#objective_update").click(function(){
function objective_update(){
    data = {}
    form_value = getFormValues("#objective_data");
    form_value['id'] = table_id
    var objective_kpi_empty_flag=''
    var kpi_action_item_list = []
    $('#kpi_table_id_tbody tr').each(function(row, tr){
         if($(tr).find('td:eq(0) input').val()=='' ||$(tr).find('td:eq(0) input').val()==undefined){ objective_kpi_empty_flag='empty'
         }else if($(tr).find('td:eq(1) input').val()=='' ||$(tr).find('td:eq(1) input').val()==undefined){objective_kpi_empty_flag='empty'
         }else if($(tr).find('td:eq(2) input').val()=='' ||$(tr).find('td:eq(2) input').val()==undefined){objective_kpi_empty_flag='empty'
//         }else if($(tr).find('td:eq(2) select option:selected').val()=='' ||$(tr).find('td:eq(2) select option:selected').val()==undefined){objective_kpi_empty_flag='empty'
         }else if($(tr).find('td:eq(3) select option:selected').val()=='' ||$(tr).find('td:eq(3) select option:selected').val()==undefined){objective_kpi_empty_flag='empty'
         }else if($(tr).find('td:eq(4) select option:selected').val()=='' ||$(tr).find('td:eq(4) select option:selected').val()==undefined){objective_kpi_empty_flag='empty'
         }
         kpi_action_item_list[row]={
            "summary":$(tr).find('td:eq(0) input').val()
            ,"target":$(tr).find('td:eq(1) input').val()    
            ,"target_type":$(tr).find('td:eq(2) input').val()  
//            ,"target_type":$(tr).find('td:eq(2) select option:selected').val()
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
//                   alert_status(data.status)
//                   org_unit_id =[]
//                    res_org_data =[]
//                   test_org = []
//                   $("#sample_1").dataTable().fnDestroy();
//                       objective_datatable();
//                       $('#organization_unit_select').empty()
//                       clear_objectives();
//	                       $("#role_table_id").dataTable().fnDestroy();
//                       role_table_data();
//                       $('#organization_unit_select').val(0).trigger("change")
//                $('#objective_submit').hide()
//       		    $('#objective_update').show()
//       		    $('#objective_remove').show()
//       		    $('#objective_cancel').show()
        	 button_show('update')
                table_id= data.id
                obj_row_click(table_id)
         }else if (data.status=='Objective Already Exist'){alert_lobibox("error",sysparam_datas_list["NTE_18"])
         }else if (data.status=='Fill all KPI value'){alert_lobibox("error",sysparam_datas_list["ERR0033"])
         }else if (data.status=='Start Date should greater than End Date Format'){alert_lobibox("error",sysparam_datas_list["NTE_21"])
         }else if (data.status=='Cannot able to Update the Past Record'){alert_lobibox("error",sysparam_datas_list["NTE_19"])
         }
     });
    }else{alert_lobibox("error",sysparam_datas_list["ERR0033"])}
    }else{alert_lobibox("error",sysparam_datas_list["NTE_30"])}
    }else{alert_lobibox("error",sysparam_datas_list["NTE_31"])}
    }else{alert_lobibox("error",sysparam_datas_list["ERR0009"])
    }
    return false;
}
 
 
//Objective Setting DataTable
function objective_datatable(){
    var columns = [{"title":"ID"},{"title":"Objective Driver"}, {"title":"Strategic Objective"}, {"title":"Start Date"},{"title":"End Date"}]
    $.ajax({
        type:"GET",
        url: "/strategic_obj_data/",
        data:{csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()},
        }).done(function(json_data){
        var data=JSON.parse(json_data);
        objective_datatable_list =[]
        for (var i=0; i<data.status.length; i++){
        	objective_datatable_list.push([data.status[i].id,data.status[i].strategic_objective_driver,data.status[i].strategic_objective_description,data.status[i].start_date,
                           data.status[i].end_date]);
        }
        plaindatatable_btn('sample_1', objective_datatable_list, columns,0)
        });
    return false;
    }
//Objective Row Click
$("#sample_1 tbody").on("click", "tr", function() {  
    var id = $('#sample_1').dataTable().fnGetData(this)[0];
    if (id){obj_row_click(id);}
});
 
//KPI Row Delete Function
$('#kpi_table_id').on( 'click', '.objectives_row_delete', function () {
	var kpi_delete_id=$(this).parents('tr').find('td:eq(5) input[type=hidden]').val();
	if(kpi_delete_id){
	removeConfirmation('kpi_delete',kpi_delete_id);
//	kpi_delete(kpi_delete_id);
	}
	else{
	data_row = $(this).parents('tr')[0];
    $('#kpi_table_id').dataTable().fnDeleteRow(data_row);}
    });
 
//KPI Row delete
function kpi_delete(kpi_delete_id){
    $.ajax({
        type:"POST",
        url: "/remove_kpi_data/",
        data:{'kpi_delete_id':kpi_delete_id,'table_id':table_id,csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()},
        success: function (json_data) {
        var data=JSON.parse(json_data);
        if(data.status =='NTE_04'){
        	kpi_row_click(data.datas);
        	}
        }
    });
}
 
//Objective Remove call
//$("#objective_remove").click(function(){
function objective_remove(){
    if(table_id !=0){
        removeConfirmation('objective_delete',table_id);
//	        objective_delete(table_id);
        }
    else{alert_lobibox("error",sysparam_datas_list["NTE_22"])}
}


function objective_delete_function(del_id){
	if(del_id!=0){
        var remove_id = removeConfirmation('objective_delete',del_id);
        defult_date();
        objective_delete(event_id);
}else{alert_lobibox("error",sysparam_datas_list["ERR0035"])
defult_date();}
}

function objective_delete(table_id){
    end_date = $("#end_date").val();
    $.ajax({
        type:"GET",
        url: "/objective_delete/",
        data : {'id':table_id,'end_date':end_date,csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()},
        success: function (json_data) {
         var data=JSON.parse(json_data);
         if(data.status=="NTE_04"){
//        	 alert_status(data.status)
        		alert_lobibox("success", sysparam_datas_list[data.status]);
          $('#organization_unit_select').empty()
          table_id= 0
          $('#objective_id').modal('hide');
         $('#cascade_objective_model').modal('hide');
         }else if(data.status="Cannot able to Remove the Past Record"){
        	 alert_lobibox("error",sysparam_datas_list["NTE_20"])
         }else if(data.status="ERR0028"){
        	 alert_lobibox("error",sysparam_datas_list["ERR0028"])
         }
//          objective_datatable_list = []
//          objective_datatable();
//          clear_objectives();
//          $("#role_table_id").dataTable().fnDestroy();
//          role_table_data();
          defult_date_call(select_date);
        }
        });
    }
 
//row click funtions in the table
function obj_row_click(el){
    org_unit_id = []
    org_unit_name = []
    role_list_data =[]
//    $('#objective_submit').hide()
//    $('#objective_update').show()
//    $('#objective_remove').show()
//    $('#objective_cancel').show()
    button_show('update')
    table_id = ''
    $.ajax({
        type:"GET",
        url: "/obj_row_click/",
        data : {'id':el,csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()},
        success: function (json_data) {
            var data=JSON.parse(json_data);
            $('#organization_unit_select').empty()
            if (data.data[0].strategic_objective_driver_exist_id !=null){
                    $('input[type=radio][value=2]').prop('checked', true);
                    $('input[type=radio][value=1]').prop('checked', false);
                    $('#new_dev').hide();
                    $('#drop_div').show()
                    $('#objective_driver_drop').val(data.data[0].strategic_objective_driver_exist_id).trigger("change")
                    $('#objective_driver').val('')
            }else{
                    $('input[type=radio][value=1]').prop('checked', true);
                    $('input[type=radio][value=2]').prop('checked', false);
                    $('#objective_driver').val(data.data[0].strategic_objective_driver)
                    $('#objective_driver_drop').val(0).trigger("change")
                    $('#new_dev').show();
                    $('#drop_div').hide()
            }if(data.data[0].strategic_objective_budget_currency_type_ref_id == null){
                    $('#currency_type').val(0).trigger("change")
            }else{
                    $('#currency_type').val(data.data[0].strategic_objective_budget_currency_type_ref_id).trigger("change")
            }
                    $('#strategic_objective').val(data.data[0].strategic_objective_description)
                    $('#action_to_achieve').val(data.data[0].strategic_objective_action_to_achieve);
                    $('#objective_type').val(data.data[0].strategic_bsc_perspective_type_refitem_id).trigger("change")
                    $('#start_date').val(data.data[0].start_date);
                    $('#end_date').val(data.data[0].end_date);
                    $('#set_budget').val(data.data[0].strategic_objective_budget)
                    $('#expected_outcome').val(data.data[0].strategic_objective_expected_outcome);
                    res_org = data.org_unit_result
//                    $("#role_table_id").dataTable().fnDestroy();
                    role_list_data =[]
                    role_table(res_org)
                    table_id = data.data[0].id
                    kpi_row_click(data.kpi_data)
                    linked_submit_id(table_id)
//                    $('#linked_submit').hide()
//                    $('#linked_update').show()
//                    $('#linked_remove').show()
//                    $('#linked_cancel').show()
                    linked_obj_button_show('update')
                    document.getElementById("objective_driver").style.color = "#555";
 				    document.getElementById("start_date").style.color = "#555";
 				    document.getElementById("end_date").style.color = "#555";
				    document.getElementById("strategic_objective").style.color = "#555";
				    $('.errormessage').html('')
				    $('#objective_datatable_id').hide()
                }
        });
    }//row click
 
 
//Kpi row click function
function kpi_row_click(data){
    kpi_table=$('#kpi_table_id').DataTable();
    kpi_table.clear().draw();
    for (var i=0; i<data.length; i++){
        $('#kpi_table_id').dataTable().fnAddData(['<input type="text" class="form-control input-small kpi_data" id="kpi_summary" value="'+data[i].kpi_description+'">','<input type="text" class="form-control input-small kpi_data number" id="kpi_target" data-toggle="tooltip" title="'+data[i].kpi_target_value+'" value="'+data[i].kpi_target_value+'">','<input type="text" class="form-control input-small kpi_data" id="target_type" name ="target_type" title="'+data[i].target_type+'" value="'+data[i].target_type+'">','<select class="form-control kpi_data rating_type" id="rating_schema'+i+'" name = "rating_schema"></select><span class="help-block"> </span> </div>','<select class="form-control kpi_data trk_type" id="track_type'+i+'" name = "track_type"></select><span class="help-block">  </span> </div>',
            '<i class="nf nf-trash-o objectives_row_delete">'+'<input type="hidden" class="form-control input-small"  value="'+data[i].id+'"/><input type="hidden" class="form-control input-small kpi_hidden_s_no" value="'+i+'"/>'])
        drop_down_value(i);
//        $('#target_type'+i).val(data[i].kpi_target_type_ref_id)
        $('#rating_schema'+i).val(data[i].kpi_custom_rating_scheme_id)
        $('#track_type'+i).val(data[i].kpi_tracking_type_id)
    }
    }
 
//Linked Objective on change
$('#strategic_objectives').on("change",function(){
    strategic_objectives_id = $("#strategic_objectives").val();
    var hidden_id = $("#hidden_strategic_objectives_id").val();
    $.ajax({
        type:"GET",
        url: "/linked_obj_update/",
        data:{'strategic_objectives':strategic_objectives_id,csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()},
    }).done(function(json_data){
//        $('#permission_search').val('').trigger("keyup");
        $('#linked_objective').empty();
        var data=JSON.parse(json_data);
        if(data.linked_obj_result != undefined){
        linked_call(data);
        obj=[]
        for(i=0 ; i<data.linked_obj_result.length;i++){
            $('#linked_objective option[value="'+data.linked_obj_result[i].strategic_objective_child_id+'"]').attr("selected", "selected");
            obj.push(data.linked_obj_result[i].strategic_objective_child_id)}
//        $('#permission_search').val('').trigger("keyup");
            $('#linked_objective').val(obj).trigger("change");
        }
    });
});
 
//Linked Objective create Function
//$("#linked_submit").click(function(event){
//    event.preventDefault();
function linked_submit(){
    strategic_objectives = $("#strategic_objectives").val();
    linked_objective = $("#linked_objective").val();
    if(strategic_objectives !=0){
    $.ajax({
        type:"GET",
        url: "/linked_obj_create/",
        data:{'linked_objective':JSON.stringify(linked_objective),'strategic_objective':JSON.stringify(strategic_objectives),csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()},
    }).done(function (json_data) {data = JSON.parse(json_data);
        if(data.status=='NTE_01'){
        	alert_lobibox("success", sysparam_datas_list[data.status]);
            $('#strategic_objectives').val(0).trigger("change")
        }
        });
        }else{alert_lobibox("error",sysparam_datas_list["NTE_23"])}
        return false;
    }
 
//Linked Drop Down Upload Function
function linked_call(data){
	if(data.result_value !=undefined){
    for(var j=0;j<data.result_value.length;j++){
        $('#linked_objective').append($('<option>', {
            value :data.result_value[j].id,
            text : data.result_value[j].strategic_objective_description
        }));
//        $('#permission_search').val('').trigger("keyup");
    }
    }
}
//Linked remove Function
//$('#linked_remove').click(function(){
function linked_remove(){
    strategic_objectives = $("#strategic_objectives").val();
    var hidden_id = $("#hidden_strategic_objectives_id").val();
    if (strategic_objectives !=0){
        $.ajax({
        type:"GET",
        url: "/linked_obj_delete/",
        data:{'strategic_objectives':hidden_id,csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()},
    }).done(function(json_data){
        var data=JSON.parse(json_data);
        if(data.status=='NTE_04'){
//        	alert_status(data.status)
        		alert_lobibox("success", sysparam_datas_list[data.status]);
            $('#strategic_objectives').val(0).trigger("change")
            $('#cascade_objective_model').modal('hide');
	        $('#strategic_objectives').val('--Select--')
	        $('#hidden_strategic_objectives_id').val(0)
	        linked_submit_id(0)
        }
    });
    }else{alert_lobibox("error",sysparam_datas_list["NTE_23"])}
    }
 
//Linked Update Function
//$('#linked_update').click(function(){
function linked_update(){
    strategic_objectives = $("#strategic_objectives").val();
    var hidden_id = $("#hidden_strategic_objectives_id").val();
    linked_objective = $("#linked_objective").val();
    if (strategic_objectives !=0){
    $.ajax({
        type:"GET",
        url: "/linked_obj_update_id/",
        data:{'strategic_objectives':hidden_id,'linked_objective':JSON.stringify(linked_objective),csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()},
    }).done(function(json_data){
        var data=JSON.parse(json_data);
        if(data.status=='NTE_03'){
//        	alert_status(data.status)
        		alert_lobibox("success", sysparam_datas_list[data.status]);
//                    $('#linked_submit').hide()
//                    $('#linked_update').show()
//                    $('#linked_remove').show()
//                    $('#linked_cancel').show()
        		linked_obj_button_show('update')
        }
        });
        }else{alert_lobibox("error",sysparam_datas_list["NTE_23"]); }
}
 
function linked_submit_id(id){
//    $('#strategic_objectives').val(id).trigger("change")
    strategic_objectives = id
    $.ajax({
        type:"GET",	
        url: "/linked_obj_update/",
        data:{'strategic_objectives':strategic_objectives,csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()},
        async : false,
    }).done(function(json_data){
//        $('#permission_search').val('').trigger("keyup");
        $('#linked_objective').empty();
        var data=JSON.parse(json_data);
        if(data.linked_obj_result){
        linked_call(data);
        obj=[]
        if(data.current_data.length>0)
        {
        $('#strategic_objectives').val(data.current_data[0].strategic_objective_description)
        $('#hidden_strategic_objectives_id').val(data.current_data[0].id)
        }
        for(i=0 ; i<data.linked_obj_result.length;i++){
            $('#linked_objective option[value="'+data.linked_obj_result[i].strategic_objective_child_id+'"]').attr("selected", "selected");
           obj.push(data.linked_obj_result[i].strategic_objective_child_id)    
        }
//        $('#permission_search').val('').trigger("keyup");
        $('#linked_objective').val(obj).trigger("change");
        }
    });
}
    
//Linked Data Call Function
function kpi_datatable(){
    columns = [{"title":"Summary"}, {"title":"Target"}, {"title":"Target Type"},
               {"title":"Rating Scheme"}, {"title":"Tracking Type"},{"title":""}]
    data_list=[]
    editable_datatable('kpi_table_id','kpi_table_plus_id', columns,data_list)
    return false
}

//Role add function
$('#role_submit_id').click(function(){
	var organization_unit = org_unit_id
	var objective_role = $("#objective_role").val();
	var role_list = []
	for(var k=0;k<organization_unit.length;k++){
		role_list.push({'org_data':organization_unit[k],'role_data':objective_role})
	}
	$.ajax({
		type:"POST",
        url: "/role_data_list/",
        data:{'role_list':JSON.stringify(role_list),csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()},
        success: function (json_data) {
    	$("#role_table_id").dataTable().fnDestroy();
    	var data = JSON.parse(json_data);
    	role_table(data.status);
    }
	});
	$('#organization_unit_select').empty()
 	$('#objective_role').empty()
 	$('#organization_unit_select').val(0).trigger("change")
 	$('#objective_role').val(0).trigger("change")
});

//Role  Data Call Function
function role_table_data(){
    columns = [{"title":"Assigned"},{"title":"Role"},{"title":""}]
    var list_data=[]
    plaindatatable_data('role_table_id', list_data, columns)
    return false
}

$('#role_table_id').on( 'click', '.remove', function () {
    data_row = $(this).parents('tr')[0];
    $('#role_table_id').dataTable().fnDeleteRow(data_row);
    role_comparition();
});

//Role Remove function
function role_remove_data_table(){
	var hidden_table_id = $("#hidden_table_id").val();
	if (hidden_table_id == 'undefined'){
	}else{
	$.ajax({
		type:"POST",
        url: "/role_data_list_remove/",
        data:{'hidden_table_id':JSON.stringify(hidden_table_id),'table_id':JSON.stringify(table_id),csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()},
        success: function (json_data) {
    	data = JSON.parse(json_data);
    	if(data.status=="NTE_04"){
//    		$("#role_table_id").dataTable().fnDestroy();
    		role_list_data = []
    		role_table(data.org_unit_result);
    	}
    }
	});
	}
}

//Role  Data Call Function
function role_table(data){
	if(data.length>0){
    var columns = [{"title":"Assigned"},{"title":"Role"},{"title":""}]
    for(var i=0;i<data.length;i++){
    	role_list_data.push([data[i].org_data+'<input type=hidden id="org_id" value='+data[i].org_id+'>',data[i].role_data+'<input type=hidden id="role_id" value='+data[i].role_id+'>',
    	                     '<i class="nf nf-trash-o remove">'+'<input type="button" class="btn btn-default animate_btn margin-right-3 remove" onclick="role_remove_data_table();">'+'<input type=hidden  id="hidden_table_id" value="'+data[i].id+'">']);
    }
    plaindatatable_data('role_table_id', role_list_data, columns)
	}else{role_table_data();}
	role_comparition();
    return false
}

//Role  Data Call Function
function role_table_comparition(data){
	if((data.length>0) && (data[0].org_data!='No data available')){
    columns = [{"title":"Assigned"},{"title":"Role"},{"title":""}]
    for(var i=0;i<data.length;i++){
    	role_list_data.push([data[i].org_data+'<input type=hidden id="org_id" value='+data[i].org_id+'>',data[i].role_data+'<input type=hidden id="role_id" value='+data[i].role_id+'>',
    	                     '<i class="nf nf-trash-o remove">'+'<input type="hidden" class="btn btn-default animate_btn margin-right-3 remove" onclick="role_remove_data_table();">'+'<input type=hidden  id="hidden_table_id" value="'+data[i].id+'">']);
    }
    plaindatatable_data('role_table_id', role_list_data, columns)
	}else{role_table_data();}
    return false
}


//role comparition
function role_comparition(){
	var assign_role_list=[]
	 $('#role_table_id_tbody tr').each(function(row, tr){
		 assign_role_list[row]={
	            "org_id":$(tr).find('td:eq(0) input[type=hidden]').val()
	            ,"org_data":$(tr).find('td:eq(0)').text() 
	            ,"role_id":$(tr).find('td:eq(1) input[type=hidden]').val()
	            ,"role_data":$(tr).find('td:eq(1)').text()
//	            ,"id":$(tr).find('td:eq(2) input[type=hidden]').val()
	    }
	 });
	 $.ajax({
		type:"POST",
		url: "/role_comparition/",
		data:{'assign_role_list':JSON.stringify(assign_role_list),csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()},
		success: function (json_data) {
		$("#role_table_id").dataTable().fnDestroy();
		var data = JSON.parse(json_data);
		role_list_data = []
		role_table_comparition(data.status);
   }
	});

}

//Validation for Drop Data
$.validator.addMethod("valueNotEquals", function(value, element, arg){
    if(value == 0) {return false
    }else {return true
    }
}, "Value must not equal arg.");
 
//Validation For Objective Setting    
$('#objective_data').submit(function(e) {
        e.preventDefault();
    }).validate({
        rules: {
            strategic_objective: {
                required: true,
            },  
            objective_type: {
                valueNotEquals:true,
            },
            start_date: {
                required:true,
            },
            end_date: {
                required:true,
            },
        },
        //For custom messages
        messages: {
            strategic_objective: {
                required: "Select Strategic Objective",
            },
            objective_type: {
                valueNotEquals: "Select Objective Type",
            },
            start_date: {
                required: "Select Start Date",
            },
            end_date: {
                required: "Select End Date",
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
//form is valid or not
function objective_form_validation(){
    return $('#objective_data').valid();
}

function multiselect_placeholer()
{
	   $("#organization_unit_select").attr("data-placeholder","Assigned To");
	   $("#organization_unit_select").select2();	
	   
	   $("#objective_role").attr("data-placeholder","Role");
	   $("#objective_role").select2();
}
$('#balance_scorecard_form_close').click(function()
		{    
	         $('#balance_scorecard_view > .col-md-6').addClass('col-md-12').removeClass('col-md-6');
			 $('#cascade_objective_model').hide();
		     $('#cascade_objective_model').addClass('col-md-6').removeClass('col-md-12');
		});

function button_show(flag)
{   
	$("#balance_obj_btn").empty();
	if (flag=='add')
	{ 
		var btnstr = '<button type="submit" class="btn btn-success btn-eql-wid btn-animate margin-right-3" onclick="objective_submit();">Add</button>';
	}
	else
	{  

		var btnstr= '<button type="button" class="btn btn-primary btn-eql-wid btn-animate margin-right-3" onclick="objective_update();"><i class="fa fa-green"></i> Update</button>';
		btnstr +='<button type="button" class="btn btn-danger btn-eql-wid btn-animate margin-right-3" onclick="objective_remove();">Remove</button>';
	}
	btnstr += '<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-3" onclick="objective_cancel();">Cancel / Clear</button>';
	$("#balance_obj_btn").append(btnstr);	
}

//function button_show(action_name){
//$("#balance_obj_btn").html('');
//var btnstr = '';
//var access_for_create = jQuery.inArray( "assessment form", JSON.parse(localStorage.Create) );
//var access_for_write = jQuery.inArray( "assessment form", JSON.parse(localStorage.Write) );
//var access_for_delete = jQuery.inArray( "assessment form", JSON.parse(localStorage.Delete) );
//if (action_name == 'add') {
//  if (access_for_create != -1){
//      btnstr += '<button type="button" class="btn btn-success btn-eql-wid btn-animate margin-right-3" onclick="objective_submit();">Add</button>';
//  }
//  btnstr +=  '<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-3" onclick="objective_cancel();">Cancel / Clear</button>';
//} else if (action_name == 'update') {
//  if (access_for_write != -1){
//      btnstr += '<button type="button" class="btn btn-primary btn-eql-wid btn-animate margin-right-3"  onclick="objective_update();"><i class="fa fa-green"></i> Update</button>';
//  }
//  if (access_for_delete != -1){
//      btnstr +='<button type="button" class="btn btn-danger btn-eql-wid btn-animate margin-right-3"  onclick="objective_remove();">Remove</button>';
//  }
//  btnstr +=  '<button type="button" class="btn btn-warning btn-eql-wid btn-animate margin-right-3" onclick="objective_cancel();" >Cancel / Clear</button>';
//}
//$("#balance_obj_btn").append(btnstr);
//}

function linked_obj_button_show(flag)
{   
	$("#balance_linked_obj_btn").empty();
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
	$("#balance_linked_obj_btn").append(btnstr);	
}

//function linked_obj_button_show(action_name){
//$("#balance_linked_obj_btn").html('');
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
//$("#balance_linked_obj_btn").append(btnstr);
//}