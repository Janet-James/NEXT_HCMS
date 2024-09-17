var status = 'NTE-TS';
var tbl_status = 'NTE-MUL';
var arrayOfValues = [];
//pop up multi select values show
var columnDefsMulti = [{title: "ID"},{title: "No."},{title: "Select"},{title: "Profile"},{title: "First Name"},{title: "Last Name"},{title: "Gender"},{title: "Organization"}];
var columnDefsSingle = [{title: "ID"},{title: "No."},{title: "Profile"},{title: "First Name"},{title: "Last Name"},{title: "Gender"},{title: "Organization"}];
function employee_search(fun_status,tbl_stat){
	status = fun_status;
	tbl_status = tbl_stat;
	clearPopupConfirmation();
	basicDropdown();
	if(status=='NTE-TS' || status=='NTE-TM')
	{
		$('#getMultiSelectAllValues').hide();
	}
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
			searchDatas();
			$('.employeeAdvancedSearch').hide();
			$('#employeeSelect').modal('show');
		}else{
			alert_lobibox("info",sysparam_datas_list['NTE_55']);
		}
	}
}

//drop down unit
function basicDropdown(){
	$.ajax({
		url : "/hrms_employee_search_list_dropdown/",
		type : "GET",
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		datas = JSON.parse(json_data);
		dropDownListMultiSelect(datas.gender,'gender_name','Gender');
		dropDownListMultiSelect(datas.role,'employee_role','Role');
		dropDownListMultiSelect(datas.org,'organization','Organization');
	});
}

//org change
$("#organization").change(function() {
		org_unit_advanced($("#organization  option:selected").val())
});

//org unit
function org_unit_advanced(val){
	if(val != 0){
		$.ajax({
			url : "/hrms_org_unit_change_structure_data/",
			type : "GET",
			data : {'id':val},
			timeout : 10000,
			async:false,
		}).done( function(json_data) {
			datas = JSON.parse(json_data);
			dropDownListMultiSelect(datas.results,'organization_unit','Organization Unit');
		});
	}else{
		dropDownListMultiSelect([],'organization_unit','Organization Unit');
	}
}

//drop down list
function dropDownListMultiSelect(data,id,title){
	strAppend = '<option value="0">--Select '+title+'--</option>'
	if(data.length>0){
		for(var i=0;i<data.length;i++){
			if(id == 'organization' || id == 'organization_unit'){
				strAppend += '<option value="'+data[i].id+'">'+data[i].name+'</option>'
			}else{
				strAppend += '<option value="'+data[i].id+'">'+data[i].refitems_name+'</option>'
			}
		}
	}
	$('#'+id).html(strAppend);
}

//table row click get id
var tableControl= document.getElementById('attendance_popup_table');
$('#getMultiValues').click(function() {
	if(status == 'NTE-HRMS' || status == 'NTE-TM'){
		arrayOfValues = [];
		strAppend = ''
		var oTable = $("#attendance_popup_table").dataTable();
		$("input:checkbox:checked", oTable.fnGetNodes()).each(function() {
			strAppend += $(this).closest('tr').find('td').eq(3).text()+','
			arrayOfValues.push(this.id);
		}).get();
	$('#employee').val(strAppend.slice(0,-1));
	}else{
		return true;
	}
	$('#employeeSelect').modal('hide');
	console.log("Multiple Select Values : ",arrayOfValues)
});

$('#getMultiSelectAllValues').click(function() {
	if(status == 'NTE-HRMS' || status == 'NTE-TM'){
		arrayOfValues = [];
		strAppend = ''
		var oTable = $("#attendance_popup_table").dataTable();
		$("input:checkbox", oTable.fnGetNodes()).each(function() {
			strAppend += $(this).closest('tr').find('td').eq(3).text()+','
			arrayOfValues.push(this.id);
		}).get();
	$('#employee').val(strAppend.slice(0,-1));
	}else{
		return true;
	}
	$('#employeeSelect').modal('hide');
	console.log("Multiple Select Values : ",arrayOfValues)
});


$(document).ready(function(){
	$("#attendance_popup_table").on("click", "tr", function() { 
		if(status != 'NTE-HRMS'){
		arrayOfValues = [];
		if (!this.rowIndex) return; // skip first row
		id = $('#attendance_popup_table').dataTable().fnGetData(this)[0];
		name = $('#attendance_popup_table').dataTable().fnGetData(this)[3];
		arrayOfValues.push(id);
		$('#employee').val(name);
		$('table tr').css('background','#ffffff'); //active color
	    $(this).css('background','#cce1ff');   //active color
		if(status == 'NTE-EMP'){
		$("#reporting_officer").empty();
		$("#reporting_officer").append("<option value='0' selected>--Select Reporting Officer--</option>");
		$("#reporting_officer").append("<option value='"+id+"' selected>"+name+"</option>");
		}}else{
			return true;
		}
		console.log("Single Select Values : ",arrayOfValues)
		$( "#employee" ).trigger( "click" );
	});
});

//popup search function 
function searchPopupConfirmation(){
	var search_Status = searchDatas();
	/*if(search_Status){
		$('.fade.in').css({'opacity':'.5'});
		var status = swal({
			title: "Searched Successfully !!!",
			type: "success",
			confirmButtonClass: "btn btn-success animate_btn"},
			function(){
				$('.fade.in').css({'opacity':'.8'});
			});
	}*/
}

//employee search function here
function searchDatas(){
	var e_fname = $("#first_name").val();
	var e_fname_status = e_fname != '' ? e_fname : ''; 
	var e_lname = $("#last_name").val();
	var e_lname_status = e_lname != '' ? e_lname : ''; 
	var e_gname = $("#gender_name option:selected").val();
	var e_gname_status = e_gname != 0 ? e_gname : ''; 
	var id_no = $("#employee_role").val();
	var id_no_status = id_no != 0 ? id_no : ''; 
	//org id in attend dropdown table
	if(status == 'NTE-TS' || status == 'NTE-EMP'){
		if(status == 'NTE-EMP'){
			var orgz_id = $('#organization_id option:selected').val();
			var orgz_unit_id = $('#org_unit_id option:selected').val();
		}else{
			var orgz_id = $('#organization option:selected').val();
			var orgz_unit_id = $('#organization_unit option:selected').val();
		}
		orgz_id = orgz_id != '0' ? orgz_id : ''
		orgz_unit_id = orgz_unit_id != '0' ? orgz_unit_id : ''	
		if(orgz_id !='' || orgz_unit_id != '' || e_fname_status !='' || e_lname_status != '' || e_gname_status != '' || id_no_status != ''){
		datas = {'tbl_status':tbl_status,'f_name':e_fname_status,'l_name':e_lname_status,'g_name':e_gname_status,'id_no':id_no_status,"org_ids":orgz_id,"orgz_unit_id":orgz_unit_id}
		datTableFunction(datas);
		}else{
			swal({
				title: "Search Cancelled !!!",
				type: "error",
				confirmButtonClass: "btn btn-danger btn-animate"});
		}
		return true
	}else if(status == 'NTE-HRMS' || status == 'NTE-EDV'  || status == 'NTE-TM'){
		if(status == 'NTE-TM'){
			var orgz_id = $('#organization option:selected').val();
			var orgz_unit_id = $('#organization_unit option:selected').val();
			orgz_id = orgz_id != '0' ? orgz_id : ''
			orgz_unit_id = orgz_unit_id != '0' ? orgz_unit_id : ''	
			if(orgz_id !='' || orgz_unit_id != '' || e_fname_status !='' || e_lname_status != '' || e_gname_status != '' || id_no_status != ''){
				datas = {'tbl_status':tbl_status,'f_name':e_fname_status,'l_name':e_lname_status,'g_name':e_gname_status,'id_no':id_no_status,"org_ids":orgz_id,"orgz_unit_id":orgz_unit_id}
				datTableFunction(datas);
			}else{
				swal({
					title: "Search Cancelled !!!",
					type: "error",
					confirmButtonClass: "btn btn-danger btn-animate"});
			}
			return true
		}else if(status == 'NTE-EDV'){
			var orgz_id = $('#organization option:selected').val();
			var orgz_unit_id = $('#organization_unit option:selected').val();
			if(orgz_id != '0' && orgz_unit_id != '0' && tbl_status != ''){
				if(orgz_id != '0' || orgz_unit_id != '0' || e_fname_status !='' || e_lname_status != '' || e_gname_status != '' || id_no_status != ''){
					datas = {'tbl_status':tbl_status,'f_name':e_fname_status,'l_name':e_lname_status,'g_name':e_gname_status,'id_no':id_no_status,"org_ids":orgz_id,"orgz_unit_id":orgz_unit_id}
					datTableFunction(datas);
				}else{
					swal({
						title: "Search Cancelled !!!",
						type: "error",
						confirmButtonClass: "btn btn-danger btn-animate"});
				}
				return true
			}
			else{
				swal({
					title: "Select Organization & Unit.",
					type: "error",
					confirmButtonClass: "btn btn-danger btn-animate"},
					function(){
						return true
					});
				return false
			}
			
		}else{
			var orgz_id = $('#company option:selected').val();
			var orgz_unit_id = $('#organization_unit_id option:selected').val();
			if(orgz_id != '0' && orgz_unit_id != '0' && tbl_status != ''){
					datas = {'tbl_status':tbl_status,'f_name':e_fname_status,'l_name':e_lname_status,'g_name':e_gname_status,'id_no':id_no_status,"org_ids":orgz_id,"orgz_unit_id":orgz_unit_id}
					datTableFunction(datas);
			}
			else{
				swal({
					title: "Select Organization & Unit in Attendance Page!!!",
					type: "error",
					confirmButtonClass: "btn-animate btn btn-danger "},
					function(){
						$('#employeeSelect').modal('hide');
					});
				return false
			}
		}
		
	}
}

//Data table function 
function datTableFunction(datas){
	$.ajax({
		url : '/hrms_attendance_employee_search/',
		type : 'GET',
		data  : datas,
		timeout : 10000,
		async:false,
	}).done(
			function(json_data)
			{
				var data = JSON.parse(json_data);
				if(tbl_status == 'NTE-MUL'){
					plaindatatable_btn('attendance_popup_table',data.results,columnDefsMulti,0,'NEXT_TRANSFORM_HCMS_DOW_EMPLOYEE_'+currentDate());
				}else{
					plaindatatable_btn('attendance_popup_table',data.results,columnDefsSingle,0,'NEXT_TRANSFORM_HCMS_DOW_EMPLOYEE_'+currentDate());
				}
			});
}

//form reset function here
function clearPopupConfirmation(){
	$('#hrms_attendance_popup')[0].reset();
	if(tbl_status == 'NTE-MUL'){
		plaindatatable_btn('attendance_popup_table',[],columnDefsMulti,0);
	}else{
		plaindatatable_btn('attendance_popup_table',[],columnDefsSingle,0);
	}
	org_id = 0;
}
