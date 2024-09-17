var resreq_details_table_id ='';
//04-JUL-2018 || KAV || Resource Request - On Ready Functions
$(document).ready(function(){
    $("#resource_deployment_date_div").DateTimePicker({
        dateFormat: "dd-MMM-yyyy"
    });
    $("#requested_on_div").DateTimePicker({
        dateFormat: "dd-MMM-yyyy"
    });
    $("#resreq_org").select2({
        placeholder: "-Select Organization-",
        width: '100%',
    });
    $("#resreq_org_unit").select2({
        placeholder: "-Select Org. Unit-",
        width: '100%',
    });
    $("#resreq_dept").select2({
        placeholder: "-Select Department-",
        width: '100%',
    });    
    $("#resreq_role").select2({
        placeholder: "-Select Role-",
        width: '100%',
    });    
    $("#resreq_grade").select2({
        placeholder: "-Select Grade-",
        width: '100%',
    });    
    $("#resreq_reason").select2({
        placeholder: "-Select Reason-",
        width: '100%',
    });    
    $("#resreq_job_type").select2({
        placeholder: "-Select Job Type-",
        width: '100%',
    });    
    $("#resreq_shift").select2({
        placeholder: "-Select Shift-",
        width: '100%',
    });    
    $("#requirement_type").select2({
        placeholder: "-Select Requirement Type-",
        width: '100%',
    });    
    // Resource Request detail data table load function
    resreq_detail_table_function();
    $("#resreq_dept").prop('disabled', true);
    $("#resreq_role").prop('disabled', true);
    $("#resreq_grade").prop('disabled', true);
    if(role_name == 'HCM' || role_name == 'CEO'){
    } else if (role_name == 'Manager'){
    	var details = JSON.parse(user_details);
    	$('#resreq_org').val(details[0].org_id_id).trigger("change");
    	$('#resreq_org_unit').val(details[0].org_unit_id_id).trigger("change");
    	$('#resreq_org').prop('disabled', true);
    	$('#resreq_org_unit').prop('disabled', true);
    } else {
    	var details = JSON.parse(user_details);
    	$('#resreq_org').val(details[0].org_id_id).trigger("change");
    	$('#resreq_org_unit').val(details[0].org_unit_id_id).trigger("change");
    	$('#resreq_dept').val(details[0].team_name_id).trigger("change");
    	$('#resreq_org').prop('disabled', true);
    	$('#resreq_org_unit').prop('disabled', true);
    	$('#resreq_dept').prop('disabled', true);
    }
});
 
//04-JUL-2018 || KAV || Resource Request - Form Details Inert and Update Function
function resreq_form_submit(el)
{
    $('.val_message').prop('style','display:block;');
    var text = $(el).text();
    if (resreq_form_validation()){
        var resreq_form_data = getFormValues('#resreq_details_form');
        text = $.trim(text);
        $.ajax({
            url:"/resreq_details_submit/",
            type:"POST",
            data:{
                'resreq_org':resreq_form_data.resreq_org,
                'resreq_org_unit':resreq_form_data.resreq_org_unit,
                'resreq_dept': resreq_form_data.resreq_dept,
                'resreq_role':resreq_form_data.resreq_role,
                'resreq_grade':resreq_form_data.resreq_grade,
                'request_reason':resreq_form_data.resreq_reason,
                'requested_on':resreq_form_data.requested_on,
                'resource_deployment_date':resreq_form_data.resource_deployment_date,
                'resource_count':resreq_form_data.resource_count,
                'resreq_job_type':resreq_form_data.resreq_job_type,
                'resreq_eduqua':resreq_form_data.resreq_eduqua,
                'resreq_jobdesc':resreq_form_data.resreq_jobdesc,
                'resreq_certif':resreq_form_data.resreq_certif,
                'resreq_lang':resreq_form_data.resreq_lang,
                'resreq_shift':resreq_form_data.resreq_shift,
                'requirement_type':resreq_form_data.requirement_type,
                'resreq_skills':resreq_form_data.resreq_skills,
                'text':text,
                'id':resreq_details_table_id,
            },
            timeout:10000
        }).done(function(json_data){
            json_data = JSON.parse(json_data);
            if(json_data.status == 'NTE_01'){
                alert_lobibox("success", sysparam_datas_list[json_data.status]);  
                resreq_detail_table_function();
                wfp_rr_cancel_clear();
            }
            else if(json_data.status == 'NTE_03'){
                alert_lobibox("success", sysparam_datas_list[json_data.status]);  
                resreq_detail_table_function();
                wfp_rr_cancel_clear();
            }
            else if(json_data.status == 'ERR0016'){
                alert_lobibox("error", "Team and Role already Exists");  
            }
            else {
                alert_lobibox("error", sysparam_datas_list[json_data.status]);    
            }
        });
    }
}
//07-AUG-2018 || KAV || Org.Unit Change Function - Click Function
$("#resreq_org_unit").change(function(){
    $("#resreq_dept").prop('disabled', false);
});
 
//07-AUG-2018 || KAV || Department Change Function - Click Function
$("#resreq_dept").change(function(){
    $("#resreq_role").prop('disabled', false);
});
 
//07-AUG-2018 || KAV || Role Change Function - Click Function
$("#resreq_role").change(function(){
//    $("#resreq_grade").prop('disabled', false);
    var resreq_role_id = $("#resreq_role").val();
    resreq_grade_change_view(resreq_role_id)
});
 
//04-JUL-2018 || KAV || Resource Request Details form validation
function resreq_form_validation(){
    return $('#resreq_details_form').valid();
}
$("#resreq_details_form").validate({
    rules: {
        resreq_org:{
            required:true,
        },
        resreq_org_unit:{
            required:true,
        },
        resreq_dept:{
            required:true,
        },
        resreq_role:{
            required:true,
        },
        resreq_grade:{
            required:true,
        },
        resreq_reason:{
            required:true,
        },
        requested_on:{
            required:true,
        },
        resource_deployment_date:{
            required:true,
            greaterThan: "#requested_on"
        },
        resource_count:{
            required:true,
        },
        resreq_job_type:{
            required:true,
        },
        resreq_jobdesc:{
            required:true,
        },
        requirement_type:{
            required:true,
        },
    },
    //For custom messages
    messages: {
        resreq_org:{
            required:"Select Valid Organization",
        },
        resreq_org_unit:{
            required:"Select Valid Organization Unit",
        },
        resreq_dept:{
            required:"Select Valid Department/Team",
        },
        resreq_grade:{
            required:"Select Valid Grade",
        },
        resreq_role:{
            required:"Select Valid Role",
        },
        resreq_reason:{
            required:"Select Valid Reason for Requisition",
        },
        requested_on:{
            required:"Select Valid Requested On Date",
        },
        resource_deployment_date:{
            required:"Select Valid Target Hire Date",
            greaterThan:"Should be greater than Request On date"
        },
        resource_count:{
            required:"Enter Resource Count",
        },
        resreq_job_type:{
            required:"Enter Job Type",
        },
        resreq_jobdesc:{
            required:"Enter Job Description",
        },
        requirement_type:{
            required:"Select Recruiting Instruction",
        },
    },
    errorElement: 'div',
    errorPlacement: function(error, element) {
        var placement = $(element).data('error');
        if (placement) {
            $(placement).append(error);
        } else {
            error.insertAfter(element);
        }
    }
});
//05-Jul-2018 || KAV ||Resource Request details data table load function
function resreq_detail_table_function(){
    columns = [{'title':'ID','name':'id'}, {'title':'No.','name':'row_number'},
               {'title':'Role','name':'role_id'}, {'title':'Team','name':'team_name'},{'title':'Request Count','name':'request_count'}];
    $.ajax({
        url : '/resreq_details_fetch/',
        type : 'GET',
    }).done(function(json_data)    {
        var data = JSON.parse(json_data);
        var resreq_details_list = [];
        if (data.status == "NTE_01"){
            $("#resreq_details_table_tbody tr:gt(0)").remove();
            for (var i=0; i<data.resreq_details.length; i++){
                resreq_details_list.push([data.resreq_details[i].id, i+1, data.resreq_details[i].role_title, data.resreq_details[i].team_name,data.resreq_details[i].resource_request_count]);
            }
            plain_datatable_with_export('resreq_details_table', resreq_details_list, columns, [], 0);
        } else {
            alert_lobibox("error", sysparam_datas_list[data.status]);
        }
    });
    return false
}
 
//06-Jul-2018 || KAV || Resource Request Details  table row click get id
$("#resreq_details_table tbody").on("click", "tr", function() {
    wfp_rr_cancel_clear();
    $('#form_btns').html('');
    btns_draw('update');
    var currurl = window.location.href;
    resreq_details_table_id = $('#resreq_details_table').dataTable().fnGetData(this)[0];
    $.ajax({
        url:"/resreq_details_fetch_id/",
        type:"POST",
        data:{
            'table_id': resreq_details_table_id,
        },
        timeout:10000
    }).done(function(json_data){
        json_data = JSON.parse(json_data)
        $("#resreq_org").val(json_data.resreq_row_details[0].resource_request_org_id).trigger("change");
        $("#resreq_org_unit").val(json_data.resreq_row_details[0].resource_request_org_unit_id).trigger("change");
        $("#resreq_dept").val(json_data.resreq_row_details[0].resource_request_team_id).trigger("change");
        $("#resreq_role").val(json_data.resreq_row_details[0].resource_request_role_id).trigger("change");
        $("#resreq_reason").val(json_data.resreq_row_details[0].resource_request_request_reason_id).trigger("change");
        $("#resreq_grade").val(json_data.resreq_row_details[0].resource_request_grade_id).trigger("change");
        $("#requested_on").val(json_data.resreq_row_details[0].requested_on);
        $("#resource_deployment_date").val(json_data.resreq_row_details[0].deployment_date);
        $('#resource_count').val(json_data.resreq_row_details[0].resource_request_count)
        $("#resreq_job_type").val(json_data.resreq_row_details[0].resource_request_job_type_id).trigger("change");
        $('#resreq_eduqua').val(json_data.resreq_row_details[0].resource_request_edu_qual)
        $('#resreq_jobdesc').val(json_data.resreq_row_details[0].resource_request_job_desc)
        $('#resreq_certif').val(json_data.resreq_row_details[0].resource_request_certification)
        $('#resreq_lang').val(json_data.resreq_row_details[0].resource_request_language)
        $("#resreq_shift").val(json_data.resreq_row_details[0].resource_request_shift_id).trigger("change");
        $("#requirement_type").val(json_data.resreq_row_details[0].resource_request_requirement_type_id).trigger("change");
        $('#resreq_skills').val(json_data.resreq_row_details[0].resource_request_skills)
        resreq_org_change_view(json_data.resreq_row_details[0].resource_request_org_id)
        $(".date_input_class").trigger('change');
    });
});
 
//06-Jul-2018 || KAV || Resource Request Dynamic button draw function
function btns_draw(action_name){
    $("#form_btns").html('');
    var btnstr = '';
    if (action_name == 'update') {
        btnstr += '<button type="button" class="btn btn-warning btn-eql-wid btn-animate pull-right" onclick="cancel_clear_confirm(\''+"wfp_rr_cancel_clear"+'\')">Cancel/ Clear </button>';            
        btnstr += '<button type="button" class="btn-animate btn btn-danger btn-eql-wid pull-right" onclick="btn_delete_form(\''+"wfp_delete_form"+'\');">Cancel Request</button>';
        btnstr += '<button type="button" class="btn-animate btn btn-success btn-eql-wid pull-right" onclick="resreq_form_submit(this)">Update</button>';
    }
    else if (action_name == 'add') {
        btnstr += '<button type="button" class="btn btn-warning btn-eql-wid btn-animate pull-right" onclick="cancel_clear_confirm(\''+"wfp_rr_cancel_clear"+'\')">Cancel/ Clear </button>';            
        btnstr += '<button type="button" class="btn-animate btn btn-success btn-eql-wid pull-right" onclick="resreq_form_submit(this)">Add</button>';
    }
    $("#form_btns").append(btnstr);
}
 
//20-Jul-2018 || KAV  || Resource Request Details cancel clear function
function wfp_rr_cancel_clear(){
    $("#resreq_org").val(0).trigger("change");
    $("#resreq_org_unit").val(0).trigger("change");
    $("#resreq_dept").val(0).trigger("change");
    $("#resreq_role").val(0).trigger("change");
    $("#resreq_reason").val(0).trigger("change");
    $("#resreq_grade").val(0).trigger("change");
    $("#requested_on").val('');
    $("#resource_deployment_date").val('');
    $(".date_input_class").trigger('change');
    $('#resource_count').val('');
    $("#resreq_job_type").val(0).trigger("change");
    $('#resreq_eduqua').val('');
    $('#resreq_jobdesc').val('');
    $('#resreq_certif').val('');
    $('#resreq_lang').val('');
    $('#resreq_jobloc').val('');
    $("#resreq_shift").val(0).trigger("change");
    $("#requirement_type").val(0).trigger("change");
    $('#resreq_skills').val('');
    $('.val_message').prop('style','display:none;');
    btns_draw('add');
};
 
//20-Jul-2018 || KAV || Resource Request Details Cancel / Clear form confirmation function
function cancel_clear_confirm(func_name,action_name) {
    var resreq_org = $("#resreq_org").val();
    var resreq_org_unit = $("#resreq_org_unit").val();
    var resreq_dept = $("#resreq_dept").val();
    var resreq_role = $("#resreq_role").val();
    var resreq_reason = $("#resreq_reason").val();
    var resreq_grade = $("#resreq_grade").val();
    var requested_on = $("#requested_on").val();
    var resource_deployment_date = $("#resource_deployment_date").val();
    var resource_count = $('#resource_count').val()
    var resreq_job_type = $("#resreq_job_type").val();
    var resreq_eduqua = $('#resreq_eduqua').val()
    var resreq_jobdesc = $('#resreq_jobdesc').val()
    var resreq_jobloc = $('#resreq_jobloc').val()
    var resreq_certif = $('#resreq_certif').val()
    var resreq_lang = $('#resreq_lang').val()
    var resreq_shift = $("#resreq_shift").val();
    var requirement_type = $("#requirement_type").val();
    var resreq_skills = $('#resreq_skills').val()
    if (resreq_org != null || resreq_org_unit != null || resreq_dept != null || resreq_role != null || resreq_grade != null ||
            resreq_reason != null || resreq_role != null || requested_on != 0 || resource_deployment_date != 0 ||
            resource_count != 0 || resreq_job_type != null || resreq_eduqua != 0 || resreq_jobdesc != 0 ||
            resreq_certif != 0 || resreq_lang != 0 || resreq_shift != null || resreq_skills != 0 ){
        swal ({
            title: "Are you sure, you want to cancel?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonClass: "btn btn-success btn-eql-wid btn-animate",
                    cancelButtonClass: "btn btn-danger btn-eql-wid btn-animate",
                    confirmButtonText: "Yes",
                    cancelButtonText: "No",
                    closeOnConfirm: true,
                    closeOnCancel: true
        },
        function(isConfirm) {
            if (isConfirm) {
                if (action_name) {
                    window[func_name](action_name);
                } else {
                    window[func_name]();
                }
            }
        });
    } else {
        wfp_rr_cancel_clear();
    }
}
//26-JUL-2018 || KAV || View Resource Request Organization - On select function
function resreq_org_change_view(org_id)
{
	$.ajax({
        type: 'POST',
        url: '/resreq_get_org_unit_list/',
        timeout : 10000,
        data: {
            'org_id': org_id,
        },
        async: false,
    }).done(function(json_data){
        data = JSON.parse(json_data);
        if (data.resreq_org_unit != undefined){
            if (data.resreq_org_unit.length > 0){
                for(i=0;i<data.resreq_org_unit.length;i++)
                {
                    $('#resreq_org_unit').append($('<option>',{
                        value:data.resreq_org_unit[i].id,
                        text:data.resreq_org_unit[i].orgunit_name
                    }))
                }
            } else {
                alert_lobibox("warning","Please select an organization with at least one Org. Unit");
            }
        }
        $('#resreq_jobloc').empty();
        if (data.org_location != undefined){
            if (data.org_location.length > 0){
                $('#resreq_jobloc').prop("disabled",false);
                for(i=0;i<data.org_location.length;i++)
                {
                    $('#resreq_jobloc').val(data.org_location[0].location)
                }
            } else {
                alert_lobibox("warning","Please select an organization with at least one Org. Unit");
            }
        }
        return false;
    });
}
 
//07-AUG-2018 || KAV || Grade Option Append - On select function
function resreq_grade_change_view(role_id)
{
    $.ajax({
    type: 'POST',
    url: '/fetch_grade_details/',
    timeout : 10000,
    data: {
        'role_id': role_id,
    },
    async: false,
}).done(function(json_data){
    var json_data = JSON.parse(json_data);
    $('#resreq_grade').prop("disabled",false);
    $('#resreq_grade').empty();
    if (json_data.grade_details_headers != undefined){
        if(json_data.grade_details_headers.length > 0)
        {
            for(var i=0;i<json_data.grade_details_headers.length;i++)
            {
                $('#resreq_grade').append($('<option>',{
                    value:json_data.grade_details_headers[i].id,
                    text:json_data.grade_details_headers[i].refitems_name
                }))
            }
        }
    }
    $('#resreq_grade').val(null).trigger("change");
});
}
//20-Jul-2018 || KAV || Resource Request Details Delete form validation
function btn_delete_form(wfp_delete_form){
    resreq_removeConfirmation(wfp_delete_form);
}
//20-Jul-2018 || KAV || Remove Confirmation function
function resreq_removeConfirmation(func_name, action_name) {
    var title = title == undefined ? '' :title;
    $('.popup_zindex').css({'z-index':'unset'});
    swal ({
        title: "Are you sure, you want to remove this record?",
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn btn-success btn-eql-wid btn-animate pull-left",
        cancelButtonClass: "btn btn-danger btn-eql-wid btn-animate pull-right",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        showConfirmButton : true,
        closeOnConfirm: true,
        closeOnCancel: true
    },
    function(isConfirm) {
        if (isConfirm) {
            if (action_name) {
                window[func_name](action_name);
            } else {
                window[func_name]();
            }
        }
    });
}
//20-Jul-2018 || KAV || Resource Request Details Delete form function
function wfp_delete_form(){
    $.ajax({
        type: 'POST',
        url: '/resreq_details_remove/',
        timeout : 10000,
        data: {
            'id':resreq_details_table_id,
        },
        async: false,
    }).done(function(view_data) {
        var json_data = JSON.parse(view_data);
        if(json_data.status == 'NTE_04'){
            alert_lobibox("success", sysparam_datas_list[json_data.status]);
            wfp_rr_cancel_clear();            resreq_detail_table_function();
        } else {
            alert_lobibox("error", sysparam_datas_list[json_data.status]);    
        }           
    });
}

//20-Jul-2018 || KAV || Resource Request Count Field type check to Number
function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        alert_lobibox("error","Please use only Numbers");  
        return false;
    }
    return true;
}

