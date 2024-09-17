$(document).ready(function(){
	dala_load();
	CostRequestDataTable();
	button_create(1)
});
var budget_id=''

$('.select2').change(function(){
	 var elements = $('.select2').val()
	 if(elements>0) { $('.errormessage').html('') }
})
	
function dala_load(){
	$.ajax({
		url : "/ld_data_load/", 
		type : "GET",
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		var data = json_data
		if(data.status=='NTE_01'){
			if(data.result.length>0){
				$('#organization').val(data.result['0'].org_id_id).trigger('change')
				$('#organization_unit').val(data.result['0'].org_unit_id_id).trigger('change')
				$('#organization_division').val(data.result['0'].team_name_id).trigger('change')
			}
			else{
				$('#organization').val(0).trigger('change')
				$('#organization_unit').val(0).trigger('change')
				$('#organization_division').val(0).trigger('change')
			}
		}
	});
}

//Coat request data table function here
function CostRequestDataTable(){
	$.ajax({
		url : "/ld_cost_request_data_table/", 
		type : "GET",
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		var data = json_data
		training_datas =data.status
		drawListView(data.status)
		search_training(data.training_drop)
	});
}

//Clear Function 
function budget_clear(){
	$('#organization').val(0).trigger('change')
	$('#organization_unit').val(0).trigger('change')
	$('#organization_division').val(0).trigger('change')
	$('#cost_per_hour').val(0).trigger('change')
	$('#no_of_hour').val(0).trigger('change')
	$('#total_cost').val(0).trigger('change')
	$('#start_date').val('')
	$('#end_date').val('')
	$('#training_methodology').val('')
	$('#training_description').val('')
	budget_id=''
	$('.errormessage').html('')
	$('#training_name').html('')
	$('#training_name').append($('<option>', {
        value :'0',
        text :'--Select--'
	}));
	$('#training_name').val('0').trigger("change");
	$('#request_to').html('')
	$('#request_to').append($('<option>', {
        value :'0',
        text :'--Select--'
	}));
	$('#request_to').val('0').trigger("change");
	$('.errormessage').html('')
}
function cost_budget_request_clear(){
	budget_clear();
	button_create(1)
}
var training_datas=''

function search_training(data){
var result = data
$('#cost_request_search').html('');
$('#cost_request_search').append($('<option>', {
    value : '0',
    text : 'Search by Training Name',
}));
if(result.length>0){
for (var j=0; j<result.length; j++){
	$('#cost_request_search').append($('<option>', {
        value : result[j].id,
        text : result[j].training_name,
    }));
}	}else{ $('#cost_request_search option[value='+0+']').attr('selected','selected'); verticalViewData="<p class='blink_me nodatas_text'>No Data Available </p>"	}
}
	
//Buget Table view
function drawListView(data){
	var res_datas =data
	var verticalViewData = '';
	if(res_datas.length){
	for(var i=0; i<res_datas.length; i++){
		verticalViewData += '<div class="col-md-12 EmployeeCard equhight employeeList ta_job_opening search_'+res_datas[i].id+'" id="'+res_datas[i].id+'" onclick="budgetrequesttableClick('+res_datas[i].id+')">'
		verticalViewData += '<div class="col-md-12">'
		verticalViewData += '<table><tr><td class="tdwidth1">Training Name </td><td class="tdwidth2">:</td><td class="tdwidth3"><b>'+res_datas[i].training_name+'</b></td></tr>';
		verticalViewData += '<tr><td class="tdwidth1">Start Date </td><td class="tdwidth2">:</td><td class="tdwidth3"><b> <b>'+res_datas[i].start_date+'</b></td></tr>';
		verticalViewData += '<tr><td class="tdwidth1">End Date </td><td class="tdwidth2">:</td><td class="tdwidth3"><b> <b>'+res_datas[i].end_date+'</b></td></tr>';
		verticalViewData += '<tr><td class="tdwidth1">Request To </td><td class="tdwidth2">:</td><td class="tdwidth3"><b> <b>'+res_datas[i].role_title+'</b></td></tr>';
		verticalViewData += '<tr><td class="tdwidth1">Requested By </td><td class="tdwidth2">:</td><td class="tdwidth3"><b> <b>'+res_datas[i].user+' '+res_datas[i].last_name+'</b></td></tr>';
		verticalViewData += '<tr><td class="tdwidth1">Requested On </td><td class="tdwidth2">:</td><td class="tdwidth3"><b> <b>'+res_datas[i].created_on+'</b></td></tr></table>';
		verticalViewData += '</div>'
		verticalViewData += '</div>'
	}}else{$('#cost_request_search option[value='+0+']').attr('selected','selected'); verticalViewData="<p class='nodata_text'>No Data Available </p>"	}
	$('#budget_request_details_vertical_view').html(verticalViewData);
}

                        //search function
$('#cost_request_search').change(function(){ var search_id=$('#cost_request_search  option:selected').text()
	result = dbSearchList(search_id)
	if(result.length>0){
	drawListView(result)}
	else{$('#budget_request_details_vertical_view').html('<p class="nodata_text">No Data Available </p>');}
	})

function dbSearchList(data){
	var getData = training_datas;
	var searchDatas = []
	if(data=="Search by Training Name"){ return training_datas;}
	else{
	for(var i=0; i<getData.length; i++){
		var getNames = (getData[i].training_name).toString().toLowerCase();
		var searchValue = (data).toString().toLowerCase();
		if (getNames.indexOf(searchValue) > -1) {
			  console.log(getData[i]);
			  searchDatas.push(getData[i]);
			} 
	}}return searchDatas;
}

//Promotion request click 
function budgetrequesttableClick(id)
{
	$('.errormessage').html('')
	button_create(2)
	$('.EmployeeCard').removeClass('custom_dev_acitve');
	$('#'+id).addClass('custom_dev_acitve');
	$.ajax({
				url : '/ld_budget_table_click/',
				type : 'POST',
				timeout : 10000,
				data:{"table_id":id,csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()},
				async:false,
			}).done(function(json_data)	{
						budget_id = id;
						var data = json_data
						// Setting Values
						$('#organization').val(data.status[0].org_id).trigger('change')
						$('#organization_unit').val(data.status[0].org_unit_id).trigger('change')
						$('#organization_division').val(data.status[0].team_id).trigger('change')
						$('#training_name').val(data.status[0].training_id).trigger('change')
						$('#request_to').val(data.status[0].request_to_role_id).trigger('change')
						var decimaltime= data.status[0].training_hours;
						var hrs = parseInt(Number(decimaltime));
						var min = Math.round((Number(decimaltime)-hrs) * 60);
						var clocktime = hrs+'.'+min;
						$('#no_of_hour').val(clocktime).trigger('change')
						$('#cost_per_hour').val(data.status[0].cost_per_hour).trigger('change')
					});
}
//Budget Save Function
function cost_budget_request_save (){
	var training_id = $('#training_name').val()
	var request_to_role = $('#request_to').val()
	var training_hours = $('#no_of_hour').val()
	var training_hours = timeStringToFloat($('#no_of_hour').val())
	var cost_per_hour = $('#cost_per_hour').val()
	var division = $('#organization_division').val()
	var result=LD_request_form_validation();
    if(result){
    	if(training_hours!='0' && training_hours !='' && cost_per_hour!='0' && cost_per_hour!=''){
	$.ajax({
		type:'GET',
		url: '/cost_request_save/',
		async : false,
		data  : { 'training_id':training_id,'request_to_role':request_to_role,'training_hours':training_hours,'cost_per_hour':cost_per_hour,'division':division},
	}).done(function (json_data){
			var data = json_data
			if(data.status== 'NTE_01'){
				alert_lobibox("success", sysparam_datas_list[json_data.status]),CostRequestDataTable(),budget_clear()}
			else if(data.status=="exists"){alert_lobibox("info", "Budget Request Already Exists")}
			else{alert_lobibox("error", "Cost Request is Failed")}
		})
    	}else{alert_lobibox("error", "Enter Training Hours & Cost")}
    }
}
function timeStringToFloat(time) {
  var hoursMinutes = time.split(/[.:]/);
  var hours = parseInt(hoursMinutes[0], 10);
  var minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
  return hours + minutes / 60;
}

//Budget Update Function
function cost_budget_request_update(){
	var training_id = $('#training_name').val()
	var request_to_role = $('#request_to').val()
	var training_hours = timeStringToFloat($('#no_of_hour').val())
	var cost_per_hour = $('#cost_per_hour').val()
	var division = $('#organization_division').val()
	var status=LD_request_form_validation();
	if(status){
    	if(training_hours!='0' && training_hours !='' && cost_per_hour!='0' && cost_per_hour!=''){
	$.ajax({
		type:'GET',
		url: '/cost_request_update/',
		async : false,
		data  : {'budget_id':budget_id,'training_id':training_id,'request_to_role':request_to_role,'training_hours':training_hours,'cost_per_hour':cost_per_hour,'division':division},
		success: function (json_data){
			var data = json_data
			if(data.status== 'NTE_03'){
				alert_lobibox("success", sysparam_datas_list[json_data.status]);CostRequestDataTable(),budget_clear()}
			else{alert_lobibox("error", "Cost Request is Failed")}
		}
})
}else{alert_lobibox("error", "Enter Training Hours & Cost")}
	}
}
// onchange of No.Of.Hours and Cost per Houre
$('#no_of_hour').change(function(){ total_cost() })
$('#cost_per_hour').change(function(){ total_cost() })
function isFloat(x) { return !!(x % 1); }

function total_cost (){
	var cost_valid = ($('#cost_per_hour').val()).match(/^-?\d*(\.\d+)?$/);
	var hour_valid = $('#no_of_hour').val().match(/^-?\d*(\.\d+)?$/)
	if(cost_valid !=null && $('#no_of_hour').val()!='0' && hour_valid!=null)
		{
		var data = isFloat($('#no_of_hour').val())
		if(data==true)
			{
			var no_of_hour = $('#no_of_hour').val().split(".")[0]
			var no_hour =  $('#no_of_hour').val().split(".")[1];
			$('#total_cost').val((no_of_hour*$('#cost_per_hour').val() + no_hour*$('#cost_per_hour').val()/60).toFixed(2))}
		else{ $('#total_cost').val(($('#no_of_hour').val()*$('#cost_per_hour').val()).toFixed(2)) }
	}else if(cost_valid !=null && $('#no_of_hour').val()=='0' && hour_valid!=null){
		$('#total_cost').val(($('#no_of_hour').val()*$('#cost_per_hour').val() + $('#no_of_hour').val()*$('#cost_per_hour').val()/60).toFixed(2))
	}else{ alert_lobibox("error", "Cost Per Hour is a Number & Time") }
}


//Budget Cost Delete Function
function cost_budget_request_delete(){removeConfirmation('budget_remove',budget_id,'Budget Request'); }

function cost_budget_request_cancel_confirmation() {  orgClearFuncton('cost_budget_request_clear','Cancel','Cost Request'); } //remove confirmation function


function budget_remove(){
	if(budget_id >='0' && budget_id!= ''){
	$.ajax({
		type:'GET',
		url: '/cost_request_remove/',
		async : false,
		data  : {'budget_id':budget_id,},
		success: function (json_data){
			var data = json_data
			if(data.status=="Removed successfully"){alert_lobibox("success", "Cost Request is Removed"),CostRequestDataTable(),budget_clear()}
			else{alert_lobibox("error", "Cost Request is Failed")}
		}
})
	}else{alert_lobibox("info", "Select Cost Request")}
}

//Organization onchange
$('#organization').change(function(){
	var str_org_id=$('#organization  option:selected').val()
	if(str_org_id!='0' && str_org_id!=''){
	$.ajax({
		type:'GET',
		url: '/ldorganization_unit/',
		async : false,
		data  : { 'str_org_id':str_org_id},
		success: function (json_data){
		var data=json_data
		$('#organization_unit').html('')
		$('#organization_unit').append($('<option>', {
            value :'0',
            text :'--Select--'
		}));
		if(data){
			var data_len=data.status.length;
			if(data_len>=1){  
				for(var i=0;i<data_len;i++){   
					$('#organization_unit').append($('<option>', {
                    value : data.status[i].id,
                    text : data.status[i].orgunit_name,
			        }));
				}
			}else{ $('#organization_unit').val('0').trigger("change"); }
				}else{ $('#organization_unit').val('0').trigger("change"); }
			},
		})	
	}else {
		$('#organization_unit').html('')
		$('#organization_unit').append($('<option>', {
            value :'0',
            text :'--Select--'
		}));
		$('#organization_unit').val('0').trigger("change"); }
});

//Organization unit onchange
$('#organization_unit').change(function(){
	var str_org_unit_id=$('#organization_unit  option:selected').val()
	var str_org_id=$('#organization  option:selected').val()
	if(str_org_unit_id!='0' && str_org_unit_id!='' ){
	$.ajax({
		type:'GET',
		url: '/ldorganization_unit_view/',
		async : false,
		data  : { 'str_org_unit_id':str_org_unit_id,'str_org_id':str_org_id},
		success: function (json_data){
		var data=json_data
		$('#organization_division').html('')
		$('#organization_division').append($('<option>', {
            value :'0',
            text :'--Select--'
		}));
		if(data){
			var data_len=data.status.length;
			if(data_len>=1){  
				for(var i=0;i<data_len;i++){   
					$('#organization_division').append($('<option>', {
	                    value : data.status[i].id,
	                    text : data.status[i].name,
			         }));
				}
			}else{ $('#organization_division').val('0').trigger("change"); }
			}else{ $('#organization_division').val('0').trigger("change"); }
			},
		})	
	}else {
		$('#organization_division').html('')
		$('#organization_division').append($('<option>', {
            value :'0',
            text :'--Select--'
		}));
		$('#organization_division').val('0').trigger("change"); }
});

//Viewer Division
$('#organization_division').change(function(){
	var str_org_unit_id=$('#organization_unit  option:selected').val()
	var str_org_id=$('#organization  option:selected').val()
	var str_div_id=$('#organization_division  option:selected').val()
	if(str_div_id!='0' && str_div_id!=''){
	$.ajax({
		type:'GET',
		url: '/ldorganization_division_view/',
		async : false,
		data  : { 'str_org_id':str_org_id,'str_org_unit_id':str_org_unit_id,'str_div_id':str_div_id},
		success: function (json_data){
			var data=json_data
			$('#request_to').html('')
			$('#training_name').html('')
			$('#training_name').append($('<option>', {
	            value :'0',
	            text :'--Select--'
			}));
			$('#request_to').append($('<option>', {
	            value :'0',
	            text :'--Select--'
			}));
			var data_role = data.role_details.length
			if(data_role>0){  
				for(var i=0;i<data_role;i++){  
					$('#request_to').append($('<option>', {
		                   value : data.role_details[i].id,
		                   text : data.role_details[i].role_title,
		             }));
					}
			}else{ $('#request_to').val('0').trigger("change"); }
			if(data){
				var data_len=data.training_data.length;
				if(data_len>=1){  
					for(var i=0;i<data_len;i++){   
						$('#training_name').append($('<option>', {
			                   value : data.training_data[i].id,
			                   text : data.training_data[i].training_name,
			             }));
						}
				}else{ $('#training_name').val('0').trigger("change"); }
				}else{ $('#training_name').val('0').trigger("change"); }
			},
		})	
	}else {
		$('#training_name').html('')
		$('#training_name').val('0').trigger("change"); }
//		$('#request_to').html('')
		$('#request_to').val('0').trigger("change");
});

//Training Name
$('#training_name').change(function(){
	var training_name=$('#training_name').val()
	if(training_name!='0' && training_name!='' && training_name !=null){
	$.ajax({
		type:'GET',
		url: '/ldtraining_view/',
		async : false,
		data  : { 'training_name':training_name},
		success: function (json_data){
			var data=json_data
			if(data){
				if(data.status.length>0){
				$('#training_description').val(data.status[0].description)
				$('#training_methodology').val(data.status[0].refitems_name)
				$('#start_date').val(moment(data.status[0].start_date).format("DD-MMM-YYYY"))
				$('#end_date').val(moment(data.status[0].end_date).format("DD-MMM-YYYY"))
				}}else{}
			},
		})	
	}else {
		$('#training_description').val('')
		$('#training_methodology').val('')
		$('#start_date').val('')
		$('#end_date').val('')
		}
});
function button_create(status){
	var strAppend = '';
	if(status == 1){
			strAppend = "<button type='button' onclick='cost_budget_request_save()' class='btn btn-success btn-eql-wid btn-animate'>Add</button>"
			strAppend += " <button type='button' onclick='cost_budget_request_cancel_confirmation()' class='btn btn-warning btn-animate btn-eql-wid btn-animate'>Cancel / Clear</button>"
		$('#cost_request_button').html(strAppend);
	}else{
			strAppend = "<button type='button' onclick='cost_budget_request_update()' class='btn btn-primary btn-eql-wid btn-animate '>Update</button>"
			strAppend += " <button type='button' onclick='cost_budget_request_delete()' class='btn btn-danger btn-animate btn-eql-wid btn-animate'>Remove</button>"
			strAppend += " <button type='button' onclick='cost_budget_request_cancel_confirmation()' class='btn btn-warning btn-animate btn-eql-wid btn-animate'>Cancel / Clear</button>"
		$('#cost_request_button').html(strAppend);
	}
}


//Rating Form validation
$('#ld_request_details_form').submit(function(e) {
	e.preventDefault();
}).validate({
	rules: {
		organization: { valueNotEquals:true, },
		organization_unit: { valueNotEquals:true, },
		organization_division: { valueNotEquals:true, },
		training_name: { valueNotEquals:true, },
		request_to: { valueNotEquals:true, },
		no_of_hour :{ valueNotEquals:true, },
		cost_per_hour :{ valueNotEquals:true, },
		total_cost :{ valueNotEquals:true, },
	},
	//For custom messages
	messages: {
		organization: { valueNotEquals: "The Organization is required", },
		organization_unit: { valueNotEquals: "The Organization Unit is required", },
		organization_division: { valueNotEquals: "The Division is required", },
		training_name: { valueNotEquals: "The Training Name is required", },
		request_to: { valueNotEquals: "The Request To is required", },
		no_of_hour :{ valueNotEquals:"The Number Of Hours is required", },
		cost_per_hour :{ valueNotEquals:"The Cost per Hour is required", },
		total_cost :{ valueNotEquals:"The Total Cost is required", },
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
function LD_request_form_validation()
{return $('#ld_request_details_form').valid();}

