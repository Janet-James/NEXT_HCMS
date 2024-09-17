//local Variable
var fieldId = [];
var employeeFieldId;
var entity;
var reportIcon="";
var columnsReport = [];
var assessmentFormData={};
var scheduleData={};
var templateData={};
var image_url='/static/photos/';
var columnsDefs = [];
var arrayOfValues = [];
var now_date = moment().format("DD-MMM-YYYY");

function tableInit(tableId,tbl_columns){
	var ti_role_def_table=$('#'+tableId).DataTable({
		columns: tbl_columns,
//		columnDefs: [{
//		"targets": [ tbl_columns.length ],
//		"visible": false,
//		"searchable": false
//		}],
		language: {
			aria: {
				sortAscending: ": activate to sort column ascending",
				sortDescending: ": activate to sort column descending"
			},
			emptyTable: "No data available",
			info: "Showing _START_ to _END_ of _TOTAL_ entries",
			infoEmpty: "No entries found",
			infoFiltered: "(filtered1 from _MAX_ total entries)",
			lengthMenu: "_MENU_ entries",
			search: "",
			zeroRecords: "No matching records found"
		},
		buttons:[],
		dom: "<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-12'><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-6 col-sm-12'i><'col-md-6 col-sm-12'lp>>"

	});
}
$(document).ready(function() {
	reportEntity($("#report_entity a"))
	if($("#report_entity a")["0"]!=undefined){
		$("#report_entity a")["0"].click();
	}
	$('#report_entity .step').click(function(){
		$('.number').removeClass('btn-success')
		$($(this)["0"].children["0"]).addClass('btn-success')
		reportEntity(this);
	});
	//Multiselect color change after disable
	$(".select2-selection__rendered").css('background-color', 'white');
	//entity click Function
	function reportEntity(reportObject){
		if($(reportObject)["0"]!=undefined){
			$('.number').removeClass('btn-success');
			$($(reportObject)["0"].children["0"]).addClass('btn-success')
			entityText = $(reportObject)["0"].innerText.trim()
			columnsReport=[];
			tableData = {};
			$('#report_datatable').html("");
			//Dynamic table adding for Template Entity
			if($(reportObject)[0]['children'][2]['textContent']=="TEENT"){
				$("#report_datatable").append("<table class='table table-striped table-bordered table-hover'"+
						"id='templates_reports_table'>"+
				"</table>");
				// columns for Template Datatable
				columnsReport=[{'title':'No'},{'title':'Template Name'},{'title':'Role'},{'title':'Template Code'},{'title':'Assessment Category'},{'title':'Status'}];
				tableInit("templates_reports_table",columnsReport)
				entity = $(reportObject)[0]['children'][2]['textContent'];
			}

			//Dynamic table adding for Schedule Entity
			else if($(reportObject)[0]['children'][2]['textContent']=="SCENT"){
				$("#report_datatable").append("<table class='table table-striped table-bordered table-hover'"+
						"id='schedules_reports_table'>"+
				"</table>");
				// columns for Schedule Datatable
				columnsReport=[{'title':'No'},{'title':'Schedule Name'},{'title':'Employee Type'},{'title':'Assessment Category'},{'title':'Cycle Starts'},{'title':'Cycle Ends'}];
				tableInit("schedules_reports_table",columnsReport)
				entity = $(reportObject)[0]['children'][2]['textContent'];
			}

			//Dynamic table adding for Assessment Form Entity
			else if($(reportObject)[0]['children'][2]['textContent']=="ASENT"){
				$("#report_datatable").append("<table class='table table-striped table-bordered table-hover'"+
						"id='assessment_forms_reports_table'>"+
				"</table>");
				// columns for Assessment Form Datatable
				columnsReport=[{'title':'No'},{'title':'Employee Name'},{'title':'Role'},{'title':'Template Name'},{'title':'Assessment Category'}];
				tableInit("assessment_forms_reports_table",columnsReport)
				entity = $(reportObject)[0]['children'][2]['textContent'];
			}
			//Dynamic field adding for Assessment Form Entity
			$.ajax({
				type:"GET",
				url: "/report_filter_type_fetch/",
				async: false,
				data:{'filter_type_id':$(reportObject)[0]['id']},
			}).done(function(json_data){
				$("#entity_field_view").html("");
				$("#report_filter_name_multiple").html("");
				data=JSON.parse(json_data);
				for(i=0;i<data['report_filter_type'].length;i++){
					$("#report_filter_name_multiple").select2({placeholder:'Select Filters',width:null});
//					$("#report_filter_name_multiple").append('<option value="filterCriteria_'+data['report_filter_type'][i].id+'">'+data['report_filter_type'][i].report_config_filter_name+'</option>');

					// Dynamic field append for Text Box
					if(data['report_filter_type'][i]['refitems_code']=="TEBFT"){
						$("#entity_field_view").append('<div class="row"><div class="form-group">'+
								'<label>'+data['report_filter_type'][i]['report_config_filter_name']+'</label>'+
								'<div class="input-icon">'+
								'<i class="fa fa-user"></i> <input type="text" id="'+data['report_filter_type'][i]['id']+'" class="form-control" placeholder="'+data['report_filter_type'][i]['report_config_filter_name']+'" onkeyup="fieldChange(this,"")">'+
								'</div>'+
						'</div></div>');
					}

					// Dynamic field append for Single Select
					else if(data['report_filter_type'][i]['refitems_code']=="SISFT"){
						$("#entity_field_view").append('<div class="form-group">'+
								'<label for="'+data['report_filter_type'][i]['report_config_filter_name'].replace(/ /g,'')+'_'+data['report_filter_type'][i]['id']+'" class="control-label black_font">'+data['report_filter_type'][i]['report_config_filter_name']+'</label>'+
								'<select id="'+data['report_filter_type'][i]['report_config_filter_name'].replace(/ /g,'')+'_'+data['report_filter_type'][i]['id']+'" class="form-control select2" onchange="fieldChange(this,\''+data['report_filter_type'][i]['report_config_filter_name']+'\')">'+

						'</select></div>');
						$('#'+data['report_filter_type'][i]['report_config_filter_name'].replace(/ /g,'')+'_'+data['report_filter_type'][i]['id']).select2();
						fetchReportSelect(data['report_filter_type'][i]['report_config_filter_name'],data['report_filter_type'][i]['id']);

					}

					// Dynamic field append for Date Picker
					else if(data['report_filter_type'][i]['refitems_code']=="DAPFT"){
						$('#entity_field_view').append('<label class="control-label black_font">'+data['report_filter_type'][i]['report_config_filter_name']+'</label></div>'+
								'<div class="row"><div class="form-group col-md-6">'+
//								'<div class="col-md-6 input-icon" style="padding-left: 0px;margin-left: -100px;margin-top: 13px;">'+
								'<span class="control-label black_font">From</span>'+
								'<i class="fa fa-calendar cicon" style="padding-left: 10px;"></i>'+
								'<input class="form-control form-control-inline" type="text" id="from_'+data['report_filter_type'][i]['report_config_filter_name'].replace(/ /g,'')+'_'+data['report_filter_type'][i]['id']+'" data-field="date" readonly onchange="getDate(this,\''+"From"+'\')">'+
								'<div id="dtBox1" class="dtpicker-overlay dtpicker-mobile" ></div>'+
								'</div>'+
								'<div class="form-group col-md-6">'+
//								'<div class="col-md-6 input-icon" style="padding: 0px;margin-top: 13px;">'+
								'<span class="control-label black_font">To</span>'+
								'<i class="fa fa-calendar cicon" style="padding-left: 10px;"></i>'+
								'<input class="form-control form-control-inline" type="text" id="to_'+data['report_filter_type'][i]['report_config_filter_name'].replace(/ /g,'')+'_'+data['report_filter_type'][i]['id']+'" data-field="date" readonly onchange="getDate(this,\''+"To"+'\')">'+
								'<div id="dtBox2" class="dtpicker-overlay dtpicker-mobile" ></div>'+
								'</div>'+
						'</div>');
						$("#dtBox1").DateTimePicker({
							dateFormat: "dd-MM-yyyy"
						});
						$("#dtBox2").DateTimePicker({
							dateFormat: "dd-MM-yyyy"
						});
/*						if($(reportObject)[0]['children'][2]['textContent']=="TEENT"){
						/*if($(reportObject)[0]['children'][2]['textContent']=="TEENT"){
							$('.form-group label')[3].nextElementSibling.style.marginLeft = "-50px"
						}*/
					}

					// Dynamic field append for Serach and Select
					else if(data['report_filter_type'][i]['refitems_code']=="SESFT"){
						reportIcon="";
						if(data['report_filter_type'][i]['report_config_filter_name']=="Employee"){
							reportIcon = "fa fa-user";
						}
						$("#entity_field_view").append('<div class="form-group">'+
								'<label>'+data['report_filter_type'][i]['report_config_filter_name']+'</label>'+
								'<div class="input-icon ">'+
								'<i class="'+reportIcon+'" style="padding-left: 0px;"></i>'+
								'<input type="text" id="'+((data['report_filter_type'][i]['report_config_filter_name']+'_'+data['report_filter_type'][i]['id']).replace(' ',''))+'" class="form-control" readonly><div class="btn_assesment"><a class="btn btn-icon-only blue btn-animate" onclick="reportFieldModalView(\'' + ((data['report_filter_type'][i]['report_config_filter_name']+'_'+data['report_filter_type'][i]['id']).replace(' ','')) +'\')" data-toggle="modal"><i class="nf nf-search"></i></a></div>'+
								'</div></div>'+
						'</div>');
					}
				}
			});
		}
	}

});

//onclick function for Search Button
function reportFieldModalView(selectData){
	var selectList = selectData.split('_');
	employeeFieldId = selectData;
	if(selectList[0] == "Employee"){
		employee_search("NTE-TM","NTE-MUL")
	}

	else if(selectList[0] == "Role"){
		columnsDefs=[];
		columnsDefs.push({
			title: "ID",visible:false
		},{
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
		clearRolePopup("hcms_role_info",'role_popup_table');
		$('#roleSelectReport').modal('show');
//		$('.input-icon').removeAttr('style');
	}

	else if(selectList[0].replace(' ','') == "OrgUnit"){
		$('#orgModal').modal('show');
	}
}

//on change function of field
function fieldChange(fieldData,labelName){
	if($(fieldData)[0]['value']=="" || ($(fieldData)[0]['value']=="select" && $(fieldData)[0]['tagName']=="SELECT")){
		fieldId.splice($.inArray("filterCriteria_"+$(fieldData)[0]['id'].split('_')[1], fieldId),1);
		$("#report_filter_name_multiple option[value='filterCriteria_"+$(fieldData)[0]['id'].split('_')[1]+"'").remove()
		if(entity=="TEENT"){
			templateData[labelName]="";
		}
		else if(entity=="SCENT"){
			scheduleData[labelName]="";
		}
		else if(entity=="ASENT"){
			assessmentFormData[labelName]="";
		}
	}
	else if($(fieldData)[0]['value']!=""){
		if($.inArray("filterCriteria_"+$(fieldData)[0]['id'].split('_')[1], fieldId)==-1){
			fieldId.push("filterCriteria_"+$(fieldData)[0]['id'].split('_')[1]);
			$("#report_filter_name_multiple").append('<option value="filterCriteria_'+$(fieldData)[0]['id'].split('_')[1]+'">'+labelName+'</option>');
		}
		if(entity=="TEENT"){
			templateData[labelName]=$("#"+$(fieldData)[0]['id']+" option:selected").val()
		}
		else if(entity=="SCENT"){
			scheduleData[labelName]=$("#"+$(fieldData)[0]['id']+" option:selected").val()
		}
		else if(entity=="ASENT"){
			assessmentFormData[labelName]=$("#"+$(fieldData)[0]['id']+" option:selected").val()
		}
	}

	$("#report_filter_name_multiple").val(fieldId).trigger('change');
}


//click function for the get Values on Employee Search and Select
var tableControl= document.getElementById('attendance_popup_table');
$('#getMultiValues').click(function() {
	arrayOfValues = [];
	strAppend = '';
	var oTable = $("#attendance_popup_table").dataTable();
	$("input:checkbox:checked", oTable.fnGetNodes()).each(function() {
		strAppend += $(this).closest('tr').find('td').eq(3).text()+','
		arrayOfValues.push(this.id);
	}).get();
	if(entity=="SCENT"){
		scheduleData['employee_id'] = JSON.stringify(arrayOfValues);
	}
	else if(entity=="ASENT"){
		assessmentFormData['employee_id'] = JSON.stringify(arrayOfValues);
	}
	$('#'+employeeFieldId).val(strAppend.slice(0,-1));
	$('#employeeSelectReport').modal('hide');
	if($('#'+employeeFieldId).val()==""){
		fieldId.splice($.inArray("filterCriteria_"+employeeFieldId.split('_')[1], fieldId),1);
		fieldId.push("filterCriteria_"+employeeFieldId.split('_')[1]);
	}
	else if($('#'+employeeFieldId).val()!=""){
		if($.inArray("filterCriteria_"+employeeFieldId.split('_')[1], fieldId)==-1){
			fieldId.push("filterCriteria_"+employeeFieldId.split('_')[1]);
			$("#report_filter_name_multiple").append('<option value="filterCriteria_'+employeeFieldId.split('_')[1]+'">'+employeeFieldId.split('_')[0]+'</option>');
		}
	}
	$("#report_filter_name_multiple").val(fieldId).trigger('change');
});
arrayOfRoleValues = [];
roleStrAppend = ''
count = 0
$("#role_popup_table").on("click", "tr", function() { 
	if (!this.rowIndex) return; // skip first row
	if(count==0){
		if($.inArray($('#role_popup_table').dataTable().fnGetData(this)[0], arrayOfRoleValues)==-1){
			arrayOfRoleValues.push($('#role_popup_table').dataTable().fnGetData(this)[0]);
		}
		else if($.inArray($('#role_popup_table').dataTable().fnGetData(this)[0], arrayOfRoleValues)!=-1){
			var index = arrayOfRoleValues.indexOf($('#role_popup_table').dataTable().fnGetData(this)[0]);
			arrayOfRoleValues.splice(index,1);
		}
		count = count+1;
	}
	else if(count!=0){
		count=0;
	}
});
//table row click get id
var role_popup_table= document.getElementById('role_popup_table');

//click function for the get Values on Role Search and Select
$('#getRoleMultiValues').click(function() {
	var oTable = $("#role_popup_table").dataTable();
	$("input:checkbox:checked", oTable.fnGetNodes()).each(function() {
		roleStrAppend += $(this).closest('tr').find('td').eq(2).text()+','
	}).get(); 
	if(entity=="SCENT"){
		scheduleData['role_id'] = JSON.stringify(arrayOfRoleValues);
	}
	else if(entity=="ASENT"){
		assessmentFormData['role_id'] = JSON.stringify(arrayOfRoleValues);

	}
	else if(entity=="TEENT"){
		templateData['role_id'] = JSON.stringify(arrayOfRoleValues);
	}

	$('#'+employeeFieldId).val(roleStrAppend.slice(0,-1).trim());
	$('#roleSelectReport').modal('hide');
	if($('#'+employeeFieldId).val()==""){
		fieldId.splice($.inArray("filterCriteria_"+employeeFieldId.split('_')[1], fieldId),1);
		$("#report_filter_name_multiple option[value='filterCriteria_"+employeeFieldId.split('_')[1]+"'").remove();
	}
	else if($('#'+employeeFieldId).val()!=""){
		if($.inArray("filterCriteria_"+employeeFieldId.split('_')[1], fieldId)==-1){
			fieldId.push("filterCriteria_"+employeeFieldId.split('_')[1]);
			$("#report_filter_name_multiple").append('<option value="filterCriteria_'+employeeFieldId.split('_')[1]+'">'+employeeFieldId.split('_')[0]+'</option>');
		}
	}
	$("#report_filter_name_multiple").val(fieldId).trigger('change');
});

//click function for the get Values on OrgUnit Search and Select
$('#org_unit_save').click(function() {
	arrayOfValues = [];
	arrayOfValues = org_unit_id;
	assessmentFormData['org_unit_id'] = JSON.stringify(arrayOfValues);
	$('#'+employeeFieldId).val(org_unit_name.toString());
	$('#orgModal').modal('hide');
	if($('#'+employeeFieldId).val()==""){
		fieldId.splice($.inArray("filterCriteria_"+employeeFieldId.split('_')[1], fieldId),1);
		$("#report_filter_name_multiple option[value='filterCriteria_"+employeeFieldId.split('_')[1]+"'").remove();
	}
	else if($('#'+employeeFieldId).val()!=""){
		if($.inArray("filterCriteria_"+employeeFieldId.split('_')[1], fieldId)==-1){
			fieldId.push("filterCriteria_"+employeeFieldId.split('_')[1]);
			$("#report_filter_name_multiple").append('<option value="filterCriteria_'+employeeFieldId.split('_')[1]+'">'+employeeFieldId.split('_')[0]+'</option>');
		}
	}

	$("#report_filter_name_multiple").val(fieldId).trigger('change');
});

$("#searchData").click(function(){
	if(entity=="TEENT"){
		fetchtemplateFinalData(templateData);
	}
	else if(entity=="SCENT"){
		fetchscheduleFinalData(scheduleData);
	}
	else if(entity=="ASENT"){
		fetchassessmentFormsFinalData(assessmentFormData);
	}
})

//Fetch data for Single Select
function fetchReportSelect(name,id){
	$('#'+name.replace(/ /g,'')+'_'+id).html('')
	$("#"+name.replace(/ /g,'')+'_'+id).append('<option value="select" selected disabled>--Select--</option>')
	$.ajax({
		type:"GET",
		url: "/report_filter_employee_type/",
		data:{'emp_type':name},
	}).done(function(json_data){
		employeeTypeData=JSON.parse(json_data);
		for(j=0;j<employeeTypeData['employee_type'].length;j++){
			$("#"+name.replace(/ /g,'')+'_'+id).append('<option value="'+employeeTypeData['employee_type'][j].id+'">'+employeeTypeData['employee_type'][j].refitems_name+'</option>');
		}
	})
}

//Data append on Schedule Datatable
function fetchscheduleFinalData(scheduleFinalData){
	$.ajax({
		type:"GET",
		url: "/report_schedule_datatable/",
		async: false,
		data:scheduleFinalData,
	}).done(function(json_data){
		returnScheduleData=JSON.parse(json_data);
		tableDataLoad('schedules_reports_table','Schedule',returnScheduleData.results)
	})
}

//Data append on Template Datatable
function fetchtemplateFinalData(templateFinalData){
	$.ajax({
		type:"GET",
		url: "/report_template_datatable/",
		async: false,
		data:templateFinalData,
	}).done(function(json_data){
		returnTemplateData=JSON.parse(json_data);
		tableDataLoad('templates_reports_table','Template',returnTemplateData.results)
	})
}

//Data append on Assessment Form Datatable
function fetchassessmentFormsFinalData(assessmentFormsFinalData){
	$.ajax({
		type:"GET",
		url: "/report_assessment_forms_datatable/",
		async: false,
		data:assessmentFormsFinalData,
	}).done(function(json_data){
		returnAssessmentForms=JSON.parse(json_data);
		tableDataLoad('assessment_forms_reports_table','Assessment_Form',returnAssessmentForms.results)
	})
}
var dateId;
//get Value of Date Picker Field for the specific Field
function getDate(dateData,labelName){
	dateId = $(dateData)[0]['id'];
	if($("#from_"+dateId.split('_')[1]+'_'+dateId.split('_')[2]).val()=="" && $("#to_"+dateId.split('_')[1]+'_'+dateId.split('_')[2]).val()==""){
		fieldId.splice($.inArray("filterCriteria_"+dateId.split('_')[2], fieldId),1);
		$("#report_filter_name_multiple option[value = 'filterCriteria_"+dateId.split('_')[2]+"']").remove();
	}
	else if($("#"+dateId).val()!=""){
		if($.inArray("filterCriteria_"+dateId.split('_')[2], fieldId)==-1){
			fieldId.push("filterCriteria_"+dateId.split('_')[2]);
			$("#report_filter_name_multiple").append('<option value="filterCriteria_'+dateId.split('_')[2]+'">'+dateId.split('_')[1]+'</option>');
		}
	}

	$("#report_filter_name_multiple").val(fieldId).trigger('change');
	if(entity=="TEENT"){
		templateData[labelName]=$(dateData)[0]['value'];
	}
	else if(entity=="SCENT"){
		scheduleData[labelName]=$(dateData)[0]['value'];
	}
	else if(entity=="ASENT"){
		assessmentFormData[labelName]=$(dateData)[0]['value'];
	}
}

function tableDataLoad(tableId,entity,reportsData){
	ti_role_def_table=$('#'+tableId).DataTable();
	ti_role_def_table.clear().draw();
	$('#'+tableId).DataTable().destroy();
	var ti_role_def_table = $('#'+tableId).DataTable({
		autoWidth: false,
		searching: false,
		lengthChange: false,
		language: {
			aria: {
				sortAscending: ": activate to sort column ascending",
				sortDescending: ": activate to sort column descending"
			},
			emptyTable: "No data available",
			search: "",
			zeroRecords: "No matching records found"
		},
//		columnDefs: [{
//		"targets": [ reportsData.length ],
//		"visible": false,
//		"searchable": false
//		}],
		/*	buttons: [{
			extend: 'collection',
			className: "btn blue ",
			filename:  'NTE_'+now_date+'_TalentAssessment_'+entity+'_Report',
			text: 'Export',
			exportOptions: {
				columns: ':visible'
			},
			buttons: [{
				extend: "pdf",
				filename:  'NTE_'+now_date+'_TalentAssessment_'+entity+'_Report',
				title: 'NTE_'+now_date+'_TalentAssessment_'+entity+'_Report',
				messageTop: '<p><b>'+entity.charAt(0).toUpperCase() + entity.slice(1) +' Details - Report</b></p>',
				exportOptions: {
					columns: ':visible'
				}
			}, {
				extend: "excel",
				filename:  'NTE_'+now_date+'_TalentAssessment_'+entity+'_Report',
				exportOptions: {
					columns: ':visible'
				}
			}, {
				extend: "csv",
				filename:  'NTE_'+now_date+'_TalentAssessment_'+entity+'_Report',
				exportOptions: {
					columns: ':visible'
				}
			}]
		}, {
			extend: "print",
			className: "btn blue",
			filename:  'NTE_'+now_date+'_TalentAssessment_'+entity+'_Report',
			title: '',
			messageTop: '<p><b>NTE_'+now_date+'_TalentAssessment_'+entity+'_Report</b></p>',
			exportOptions: {
				columns: ':visible'
			}
		}, {
			extend: "copy",
			className: "btn blue",
			filename:  'NTE_'+now_date+'_TalentAssessment_'+entity+'_Report',
			title: '',
			messageTop: '<p><b>NTE_'+now_date+'_TalentAssessment_'+entity+'_Report</b></p>',
			exportOptions: {
				columns: ':visible'
			}
		}, {
			extend: "colvis",
			className: "btn blue",
			text: "Columns",
			columns: ':lt(5)'
		}],*/
		buttons:[],
		responsive: !0,
		order: [
		        [0, "asc"]
		        ],
				dom: "<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-12'><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-6 col-sm-12'i><'col-md-6 col-sm-12'lp>>",
	});
	if(entity=="ASENT"){
		for(var i=0;i<reportsData.length;i++) {
			ti_role_def_table.row.add([i+1, reportsData[i][0], reportsData[i][1],reportsData[i][2],reportsData[i][3],reportsData[i][4]]);
		}
	}
	else{
		for(var i=0;i<reportsData.length;i++) {
			ti_role_def_table.row.add([i+1, reportsData[i][0], reportsData[i][1],reportsData[i][2],reportsData[i][3], reportsData[i][4],reportsData[i][5]]);
		}
	}

	ti_role_def_table.draw();
}

$("#clearData").click(function(){
	$("#report_filter_name_multiple option").remove();
	fieldId = []
	$("#report_filter_name_multiple").val(fieldId).trigger('change')
	search_clear();

})

//function to clear the search filters
function search_clear(){
	if(entity=="TEENT"){
		$("#report_entity a")["0"].click()
	}
	else if(entity=="SCENT"){
		$("#report_entity a")["1"].click()
	}
	else if(entity=="ASENT"){
		$("#report_entity a")["2"].click()
	}

}

//popup search function 
function searchRolePopup(searchModalName){
	if(searchModalName=="Role"){
		var role_name = $("#role_name").val();
		datas = {'role_name':role_name};
		$.ajax({
			url : '/report_role_search/',
			type : 'GET',
			data  : datas,
			timeout : 10000,
		}).done(
				function(json_data)
				{
					var data = JSON.parse(json_data);
					console.log("data",data.role_data)
					plaindatatable('role_popup_table',data.role_data,columnsDefs);
				});
		return true;

	}
}


//form reset function here
function clearRolePopup(formId,table_id){
	$('#'+formId)[0].reset();
	plaindatatable(table_id,[],columnsDefs);
}

$('#report_filter_name_multiple').on("select2:unselect", function(e){
	var unselected_value = $('#report_filter_name_multiple').val();
	$.map(fieldId,function(a){
		if(a!=undefined){
			if($.inArray(a,unselected_value)==-1){
				fieldId.splice($.inArray(a, fieldId),1);
				idresult = $('#report_filter_name_multiple option[value="'+a+'"]').text().replace(' ','')+'_'+a.split('_')[1];
				if($("#"+idresult)["0"]!=undefined){
					if($("#"+idresult)["0"].tagName == "SELECT"){
						$("#"+idresult).val('select').trigger('change');
					}
					else if($("#"+idresult)["0"].tagName == "INPUT"){
						$("#"+idresult).val('');
					}
				}
				else{

					dateIdFrom = "from_"+idresult
					dateIdTo = "to_"+idresult
					$("#"+dateIdFrom).val('');
					$("#"+dateIdTo).val('');
				}
				$('#report_filter_name_multiple option[value = "'+a+'"]').remove()
			}
		}


	});


}).trigger('change');

