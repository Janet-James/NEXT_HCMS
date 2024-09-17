var all_status = 5;
//kiosk employee list
$(document).ready(function(){
	$("#organization_id").val(28).change();
});

//search employee name based on employee list
var elem = document.getElementById('emp_name');
elem.addEventListener('keypress', function(e){
  if (e.keyCode == 13) {
	  employeeKIOSKList(2);
  }
});

//org change
$("#organization_id").change(function() {
	if($('#organization_id option:selected').val() != 0) {
		org_unit($('#organization_id option:selected').val()); 
		employeeKIOSKList(0);
	}else{
		dropDownList([],'organization_unit_id');
		$('#employee_kiosk_list').html('<div class="col-md-12"><h3 style="text-align: center;color:#00afff;">Please select organization</h3></div>');
	}
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
		dropDownList(datas.results,'organization_unit_id');
	});
}

//drop down list
function dropDownList(data,id){
	strAppend = '<option value="0">--Select Organization Unit--</option>'
	if(data.length>0){
		for(var i=0;i<data.length;i++){
			strAppend += '<option value="'+data[i].id+'">'+data[i].name+'</option>'
		}
	}
	$('#'+id).html(strAppend);
}
//org unit change
$("#organization_unit_id").change(function() {
	if($('#organization_unit_id option:selected').val(	) != 0 ){
		if($('#organization_id option:selected').val() != 0){
			 employeeKIOSKList(1);
		}
	}else{
		if($('#organization_id option:selected').val() != 0){
			employeeKIOSKList(0);
		}
	}
});
//fetch the Employee KIOSK datas
function employeeKIOSKList(status){
	all_status = status
	if(status == 0){
		  datas = {'id':$('#organization_id option:selected').val()}
	}else if(status == 1){
		  datas = {'id':$('#organization_id option:selected').val(),'unit_id':$('#organization_unit_id option:selected').val()}
	}else if(status == 2){
		  var emp_name = $('#emp_name').val();
		  if($('#organization_id option:selected').val() != 0 && $('#organization_unit_id option:selected').val() == 0){
			  datas = {'id':$('#organization_id option:selected').val(),'emp_name':emp_name}
		  }else if($('#organization_id option:selected').val() != 0 && $('#organization_unit_id option:selected').val() != 0){
			  datas = {'id':$('#organization_id option:selected').val(),'unit_id':$('#organization_unit_id option:selected').val(),'emp_name':emp_name}
		  }else if($('#organization_id option:selected').val() == 0 && $('#organization_unit_id option:selected').val() == 0){
				$('#employee_kiosk_list').html('<div class="col-md-12"><h3 style="text-align: center;color:#00afff;">Please select organization</h3></div>');
				return false
		  }
	}
	$.ajax({
		url : "/hrms_kiosk_employee_list/",
		type : "GET",
		data : datas,
		timeout : 10000,
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		dynamicDivform(data.results);
	});
}
//KIOSK Div form in function here
function dynamicDivform(data){
	if(data.length>0){
		strAppend = '';
		//var count = 0;
		for(var i=0; i<data.length; i++){
			//count = count +1;
//			if(count == 1){
//				strAppend += '<div class=" row-eq-height ">';
//			}
			strAppend += '<div class="col-lg-3 col-md-6 col-sm-12 row-eq-height">';
			strAppend += '<div class="profileCard equhight employeeList">';
			strAppend += '<div class="panel-body"> <img class="img-circle img-inline pic_ina" src="'+image_path+data[i].profile+'" width="75px" height="75px">';
			strAppend += '<div class="con_ina des-eql-height">';
			strAppend += '<h4>'+data[i].ename+'</h4>';
			strAppend += '<p>'+data[i].position+'';
			strAppend += '<br>('+data[i].unit+')</p>';
			if(data[i].status == 1){
				strAppend += '<div class="profileStatus"> <button type="button" onclick="statusUpdate('+data[i].eid+','+data[i].aid+',1)" class="btn-animate inoutbtn btn-success ">IN</button></div>';
			}else{
				strAppend += '<div class="profileStatus"> <button type="button" onclick="statusUpdate('+data[i].eid+','+data[i].aid+',2)" class="btn-animate inoutbtn btn-danger ">OUT</button></div>';
			}
			strAppend += '</div>';
			strAppend += '</div>';
			strAppend += '</div>';
			strAppend += '</div>';
//			if(count == 4){
//				strAppend += '</div>';
//				count = 0;
//			}
		}
		$('#employee_kiosk_list').html(strAppend);
	}
	else{
		$('#employee_kiosk_list').html('<div class="col-md-12"><h3 style="text-align: center;color:#00afff;">No data available.</h3></div>');
	}
}
//status update function here
function statusUpdate(eid,aid,check_status){
	var org_id = $('#organization_id option:selected').val();
	if(org_id != 0){
		if(check_status == 1 ){
			datas = {'id':eid,'org_ids':org_id}//insert IN
		}else{
			datas = {'id':eid,'aid':aid,'org_ids':org_id}//update OUT
		}
		$.ajax({
			url : "/hrms_kiosk_employee_events_list/",
			type : "POST",
			data : datas,
			timeout : 10000,
			async:false,
		}).done( function(json_data) {
			data = JSON.parse(json_data);
			if(data.results == 'NTE_11'){
				alert_lobibox("success", sysparam_datas_list[data.results]);
			}else if(data.results == 'NTE_12'){
				alert_lobibox("success", sysparam_datas_list[data.results]);
			}else if(data.results == 'NTE_13'){
				alert_lobibox("error", sysparam_datas_list[data.results]);
			}
			employeeKIOSKList(all_status);
		});
	}else{
		alert_lobibox("error", 'Select Organization.');
	}
}