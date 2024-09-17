var struct_donut_chart_data = []
//12-JUL-2018 || SMI || On Ready Functions
$( document ).ready(function() {
	$("#structure_step1_tab_content").html('<h3 class="no-data">No data available</h3>');
	$("#struct_multi_bar_chart").html('<h3 class="no-data">No data available</h3>');
	$("#struct_multi_grade_chart").html('<h3 class="no-data">No data available</h3>');
	$("#wfp_sel_org").select2({
		placeholder: "-Select Organization-",
		width: '100%',
	});
	$("#wfp_sel_org_unit").select2({
		placeholder: "-Select Org. Unit-",
		width: '100%',
	});
	$("#wfp_bar_sel_role").select2({
		placeholder: "-Select Role-",
		width: '100%',
	});
	$("#wfp_bar_msel_roles").select2({
		placeholder: "-Select Roles-",
		width: '100%',
		maximumSelectionLength: 5,
	});
	$("#wfp_bar_msel_grades").select2({
		placeholder: "-Select Grades-",
		width: '100%',
		maximumSelectionLength: 10,
	});
	setInterval(function(){ $('a[title="GetOrgChart jquery plugin"]').hide(); }, 10);
});

//26-JUL-2018 || SMI || Organization - On select function
function get_org_list(org_id){
	$('#wfp_sel_org_unit').empty();
	$('#wfp_sel_org_unit').empty().append($('<option>',{
		value:'',
		text:'-Select Org. Unit-'
	}));
	$.ajax({
		type: 'POST',
		url: '/wfp_org_unit/',
		timeout : 10000,
		data: {
			'org_id': org_id,
		},
		async: false,
	}).done(function(json_data){
		data = JSON.parse(json_data);
		if (data.sel_org_unit != undefined){
			if (data.sel_org_unit.length > 0){
				$('#wfp_sel_org_unit').prop("disabled",false);
				for(i=0;i<data.sel_org_unit.length;i++)
				{
					$('#wfp_sel_org_unit').append($('<option>',{
						value:data.sel_org_unit[i].id,
						text:data.sel_org_unit[i].orgunit_name
					}))
				}
			} else {
				$('#wfp_sel_org_unit').prop("disabled",true);
			}
		}
	})
}

//27-JUL-2018 || SMI || Org. Unit - On select function
function get_struct_sel(org_unit_id){
	var org_id = $('#wfp_sel_org').val();
	STRC1_click_fn(org_id, org_unit_id);
	STRC2_click_fn(org_id, org_unit_id);
	STRC3_click_fn(org_id, org_unit_id);
	STRC4_click_fn(org_id, org_unit_id);
	STRC5_click_fn(org_id, org_unit_id);
}

//Reporting Structure Chart Draw Function - Step1
function orgDataParse1(data){
    getOrgChart.themes.myCustomTheme = {
            size: [500, 220],
            toolbarHeight: 46,
            textPoints: [{
                x: 10,
                y: 200,
                width: 490
            }, {
                x: 200,
                y: 40,
                width: 300
            }, {
                x: 210,
                y: 65,
                width: 290
            }, {
                x: 210,
                y: 90,
                width: 290
            }, {
                x: 200,
                y: 115,
                width: 300
            }, {
                x: 185,
                y: 140,
                width: 315
            }],
            textPointsNoImage: [{
                x: 10,
                y: 200,
                width: 490
            }, {
                x: 10,
                y: 40,
                width: 490
            }, {
                x: 350,
                y: 200,
                width: 490
            }, {
                x: 10,
                y: 90,
                width: 490
            }, {
                x: 10,
                y: 115,
                width: 490
            }, {
                x: 10,
                y: 140,
                width: 490
            }],
            expandCollapseBtnRadius: 20,
            box: '<rect x="0" y="0" height="220" width="500" rx="10" ry="10" class="get-box" />',
            text: '<text width="[width]" class="get-text get-text-[index]" x="[x]" y="[y]">[text]</text>',
            image: ''
    };
    var orgchart = new getOrgChart(document.getElementById("structure_step1_tab_content"), {
        theme: "myCustomTheme",
        linkType: "B",
        enableEdit: false,
        enableDetailsView: false,
        enableSearch: false,
        enableZoom: true,
        enablePrint: false,
        enableGridView: false,
        enableExportToImage: false,
        enableZoomOnNodeDoubleClick: true,
        orientation: getOrgChart.RO_TOP,
        primaryFields: ["type", "title", "count"],
        dataSource: data
    });
    $('.get-oc-tb').show();
}

//05-JUL-2018 || SMI || Step 1 - Data Load Function
function STRC1_click_fn(org_id, org_unit_id){
	setInterval(function(){ $('a[title="GetOrgChart jquery plugin"]').hide(); }, 10);
	$.ajax({
		url : '/wf_report_role_details/',
		type : 'POST',
		timeout : 10000,
		data: {
			'org_id': org_id,
			'org_unit_id': org_unit_id,
		},
		async: false,
	}).done(function(json_data){
		var data = JSON.parse(json_data);
		if (data == 0){
			$("#structure_step1_tab_content").html('');
			$("#structure_step1_tab_content").css('height','auto');
			$("#structure_step1_tab_content").html('<h3 class="no-data">No data available</h3>');
		} else {
			$("#structure_step1_tab_content").html('');
			var i='';
			var datasource = [];
			var roleElement = document.getElementById("structure_step1_tab_content");
			for(i=0;i<data.length;i++)
			{
				if(i==0){
					datasource.push({ id: i+1, parentId: null, title: data[i].role_title, type: data[i].role_type, count: "Planned Count : "+data[i].res_count, })
				} else {
					datasource.push({ id: i+1, parentId: data[i].role_reports_to_id, title: data[i].role_title, type: data[i].role_type, count: "Planned Count : "+data[i].res_count, })
				}
			}
			orgDataParse1(datasource);
		}
	});
	return false;
};

//Reporting Structure Chart Draw Function - Step2
function orgDataParse2(data){
    getOrgChart.themes.myCustomTheme = {
            size: [500, 220],
            toolbarHeight: 46,
            textPoints: [{
                x: 10,
                y: 200,
                width: 490
            }, {
                x: 200,
                y: 40,
                width: 300
            }, {
                x: 210,
                y: 65,
                width: 290
            }, {
                x: 210,
                y: 90,
                width: 290
            }, {
                x: 200,
                y: 115,
                width: 300
            }, {
                x: 185,
                y: 140,
                width: 315
            }],
            textPointsNoImage: [{
                x: 10,
                y: 200,
                width: 490
            }, {
                x: 10,
                y: 40,
                width: 490
            }, {
                x: 350,
                y: 200,
                width: 490
            }, {
                x: 10,
                y: 90,
                width: 490
            }, {
                x: 10,
                y: 115,
                width: 490
            }, {
                x: 10,
                y: 140,
                width: 490
            }],
            expandCollapseBtnRadius: 20,
            box: '<rect x="0" y="0" height="220" width="500" rx="10" ry="10" class="get-box" />',
            text: '<text width="[width]" class="get-text get-text-[index]" x="[x]" y="[y]">[text]</text>',
            image: ''
    };
    var orgchart = new getOrgChart(document.getElementById("structure_step2_tab_content"), {
        theme: "myCustomTheme",
        linkType: "B",
        enableEdit: false,
        enableDetailsView: false,
        enableSearch: false,
        enableZoom: true,
        enablePrint: false,
        enableGridView: false,
        enableExportToImage: false,
        enableZoomOnNodeDoubleClick: true,
        orientation: getOrgChart.RO_TOP,
        primaryFields: ["type", "title", "planned_count", "existing_count", "required_count", "excess_count"],
        dataSource: data
    });
    $('.get-oc-tb').show();
}

//30-JUL-2018 || SMI || Step 2 - Data Load Function
function STRC2_click_fn(org_id, org_unit_id){
	setInterval(function(){ $('a[title="GetOrgChart jquery plugin"]').hide(); }, 10);
	$.ajax({
		url : '/wfp_struct_step2_details/',
		type : 'POST',
		timeout : 10000,
		data: {
			'org_id': org_id,
			'org_unit_id': org_unit_id,
		},
		async: false,
	}).done(function(json_data){
		var data = JSON.parse(json_data);
		data = data.data;
		if (data == 0){
			$("#structure_step2_tab_content").html('');
			$("#structure_step2_tab_content").css('height','auto');
			$("#structure_step2_tab_content").html('<h3 class="no-data">No data available</h3>');
		} else {
			$("#structure_step2_tab_content").html('');
			var i='';
			var datasource = [];
			setInterval(function(){ $('a[title="GetOrgChart jquery plugin"]').hide(); });
			var roleElement = document.getElementById("structure_step2_tab_content");
			if(data != undefined){
				for(i=0;i<data.length;i++)
				{
					if(i==0){
						datasource.push({ id: i+1, parentId: null, title: data[i].role_title, type: data[i].role_type, planned_count: "Planned Count : "+data[i].planned_count, existing_count: "Existing Count : "+data[i].existing_count, required_count: "Required Count : "+data[i].required_count, excess_count: "Excess Count : "+data[i].excess_count, })
					} else {
						datasource.push({ id: i+1, parentId: data[i].role_reports_to_id, title: data[i].role_title, type: data[i].role_type, planned_count: "Planned Count : "+data[i].planned_count, existing_count: "Existing Count : "+data[i].existing_count, required_count: "Required Count : "+data[i].required_count, excess_count: "Excess Count : "+data[i].excess_count, })
					}
				}
				orgDataParse2(datasource);
				for(i=0;i<data.length;i++)
				{
					if(data[i].required_count > 0 || data[i].excess_count > 0){
						$("#structure_step2_tab_content g").find("g[data-node-id='"+data[i].id+"']").find('rect').css('fill','#fff');
					} 
				}
			}
		}
	});
}

//09-JUL-2018 || SMI || Step 3 - Data Table Column Headers
var wfp_struct_s3_tbl_cols = [{"title":"No."}, {"title":"Role"}, {"title":"Planned Resource Count"},
                              {"title":"Existing Resource Count"},{"title":"Required Resource Count"}, {"title":"Excess Resource Count"}];

//30-JUL-2018 || SMI || Step 3 - Data Load Function
function STRC3_click_fn(org_id,org_unit_id){
	$.ajax({
		url : '/wfp_struct_step3_details/',
		type : 'POST',
		timeout : 10000,
		data: {
			'org_id': org_id,
			'org_unit_id': org_unit_id,
		},
		async: false,
	}).done(function(json_data){
		var json_data = JSON.parse(json_data);
		data_list = [];
		if(json_data.data != undefined){
			if (json_data.data.length > 0){
				for(var i=0;i<json_data.data.length;i++) 
				{
					data_list.push([i+1, json_data.data[i].role_title,
					                json_data.data[i].planned_count, json_data.data[i].existing_count,
					                json_data.data[i].required_count, json_data.data[i].excess_count ]);
				}
				plain_datatable_with_export('wfp_struct_s3_tbl', data_list, wfp_struct_s3_tbl_cols, [2,3,4,5]);
			}
			else{
				wfp_struct_s3_table=$('#wfp_struct_s3_tbl').DataTable();
				wfp_struct_s3_table.clear().draw();
				$("#wfp_struct_s3_tbl").DataTable().destroy();
				empty_datatable('wfp_struct_s3_tbl', [2,3,4,5]);
			}
		}
	});
}

//10-JUL-2018 || SMI || Step 4 - Data Table Column Headers
var wfp_struct_s4_tbl_cols = [{"title":"No."}, {"title":"Role"}, {"title":"Required Resource Count"}, {"title":"Required Resource Cost"}];

//30-JUL-2018 || SMI || Step 4 - Data Load Function
function STRC4_click_fn(org_id,org_unit_id){
	$.ajax({
		url : '/wfp_struct_step4_details/',
		type : 'POST',
		timeout : 10000,
		data: {
			'org_id': org_id,
			'org_unit_id': org_unit_id,
		},
		async: false,
	}).done(function(json_data){
		var json_data = JSON.parse(json_data);
		data_list = [];
		if(json_data.data != undefined){
			if (json_data.data.length > 0){
				for(var i=0;i<json_data.data.length;i++) 
				{
					data_list.push([i+1, json_data.data[i].role_title,
					                json_data.data[i].required_count, json_data.data[i].required_cost ]);
				}
				plain_datatable_with_export('wfp_struct_s4_tbl', data_list, wfp_struct_s4_tbl_cols, [2,3]);
			}
			else{
				wfp_struct_s4_table=$('#wfp_struct_s4_tbl').DataTable();
				wfp_struct_s4_table.clear().draw();
				$("#wfp_struct_s4_tbl").DataTable().destroy();
				empty_datatable('wfp_struct_s4_tbl', [2,3]);
			}
		}
	});
}

//30-JUL-2018 || SMI || Step 5 - Donut Chart Data Load Function
function STRC5_click_fn(org_id,org_unit_id){
	$.ajax({
		url : '/wfp_struct_step5_details/',
		type : 'POST',
		timeout : 10000,
		data: {
			'org_id': org_id,
			'org_unit_id': org_unit_id,
		},
		async: false,
	}).done(function(json_data){
		var json_data = JSON.parse(json_data);
		console.log(json_data);
		if(json_data.data != undefined){
			if (json_data.data[0].minrange != null && json_data.data[0].midrange != null && json_data.data[0].midrange != null){
				struct_donut_chart_data = [{
					"title": "0 to 5k",
					"value": json_data.data[0].minrange,
					"color": "#53c6fa",
					"pullOut": true
				}, {
					"title": "6k to 10k",
					"value": json_data.data[0].midrange,
					"color": "#d97df0"
				}, {
					"title": "Above 10k",
					"value": json_data.data[0].maxrange,
					"color": "#fcaa7d"
				}];
				var struct_donut_chart = AmCharts.makeChart("struct_donut_chart", {
					"type": "pie",
					"fontFamily": "'Poppins', sans-serif",
					"theme": "light",
					"outlineColor": "",
					"color": "#000",
					"colorField": "color",
					"legend": {
						"equalWidths": false,
						"position": "top",
						"valueAlign": "right",
						"align": "right",
						"valueText": "",
						"color": "#000",
						"valueWidth": 100
					},
					"dataProvider": struct_donut_chart_data,
					"titleField": "title",
					"valueField": "value",
					"pulledField": "pullOut",
					"radius": "42%",
					"innerRadius": "60%",
					"labelText": "[[title]]",
					"export": {
						"enabled": false
					}
				});
				struct_donut_chart.addListener("clickSlice", handleClick);
			}
			else{
				$("#struct_donut_chart").html('<h3 class="no-data">No data available</h3>');
				$('#wfp_bar_sel_role').empty();
				$('#wfp_bar_sel_role').prop("disabled",true);
				$("#struct_bar_chart").html('<h3 class="no-data">No data available</h3>');
			}
			$('#wfp_bar_msel_roles').empty().append($('<option>',{
				value:'',
				text:'-Select Roles-'
			}));
			for(i=0;i<json_data.role_data.length;i++)
			{
				$('#wfp_bar_msel_roles').append($('<option>',{
					value:json_data.role_data[i].id,
					text:json_data.role_data[i].role_title
				}))
			}
			$('#wfp_bar_msel_roles').prop("disabled", false);
			var first5_roles = $('#wfp_bar_msel_roles').val($('#wfp_bar_msel_roles option:first').val());
			if (first5_roles["0"].length < 6) {
				var len = first5_roles["0"].length - 1;
			} else {
				var len = 5;
			}
			var first5_roles_list = [];
			for(var i=1; i<=len; i++){
				first5_roles_list.push(first5_roles["0"][i].value);
			}
			$("#wfp_bar_msel_roles").val(first5_roles_list).trigger("change");
			$('#wfp_bar_msel_grades').prop("disabled", false);
			var first5_grades = $('#wfp_bar_msel_grades').val($('#wfp_bar_msel_grades option:first').val());
			var first5_grades_list = [];
			for(var i=0; i<5; i++){
				first5_grades_list.push(first5_grades["0"][i].value);
			}
			$("#wfp_bar_msel_grades").val(first5_grades_list).trigger("change");
		}
	});
	handleClick("0 to 5k");
}

//31-JUL-2018 || SMI || Step 5 - Donut Chart Slice Click Function
function handleClick(event)
{
	var org_id = $('#wfp_sel_org').val();
	var org_unit_id = $('#wfp_sel_org_unit').val();
	if(event != "0 to 5k"){
		var struct_donut_chart_title = event.dataItem.dataContext.title;
	} else {
		var struct_donut_chart_title = event;
	}
	$.ajax({
		url : '/wfp_struct_step5_chart_click/',
		type : 'POST',
		timeout : 10000,
		data: {
			'org_id': org_id,
			'org_unit_id': org_unit_id,
			'struct_donut_chart_title': struct_donut_chart_title,
		},
		async: false,
	}).done(function(json_data){
		var json_data = JSON.parse(json_data);
		$('#wfp_bar_sel_role').empty();
		$('#wfp_bar_sel_role').prop("disabled",false);
		for(i=0;i<json_data.data.length;i++)
		{
			$('#wfp_bar_sel_role').append($('<option>',{
				value:json_data.data[i].id,
				text:json_data.data[i].role_title
			}))
		}
		if(event != "0 to 5k"){
			$('#wfp_bar_sel_role').val(null).trigger("change");
		} else {
			$('#wfp_bar_sel_role').val($('#wfp_bar_sel_role option:first-child').val()).trigger("change");
		}
	});
}

//31-JUL-2018 || SMI || Step 5 - Role Select and Bar Chart Data Load Function
function get_role_val_bar(role_id){
	if(role_id != null){
		var org_id = $('#wfp_sel_org').val();
		var org_unit_id = $('#wfp_sel_org_unit').val();
		$.ajax({
			url : '/wfp_struct_step5_role_sel/',
			type : 'POST',
			timeout : 10000,
			data: {
				'org_id': org_id,
				'org_unit_id': org_unit_id,
				'role_id': role_id,
			},
			async: false,
		}).done(function(json_data){
			var json_data = JSON.parse(json_data);
			var struct_bar_chart_data = [{
				"label": "Planned Resources",
				"count": json_data.data[0].planned_count,
				"color": "#53c6fa"
			}, {
				"label": "Existing Resources",
				"count": json_data.data[0].existing_count,
				"color": "#d97df0"
			}, {
				"label": "Required Resources",
				"count": json_data.data[0].required_count,
				"color": "#fcaa7d"
			}, {
				"label": "Excess Resources",
				"count": json_data.data[0].excess_count,
				"color": "#5c6bc0"
			}];
			AmCharts.makeChart("struct_bar_chart", {
				"type": "serial",
				"fontFamily": "'Poppins', sans-serif",
				"theme": "light",
				"marginRight": 70,
				"dataProvider": struct_bar_chart_data,
				"valueAxes": [{
					"axisAlpha": 0,
					"position": "left",
					"title": "Resources"
				}],
				"startDuration": 1,
				"graphs": [{
					"balloonText": "<b>[[category]]: [[value]]</b>",
					"fillColorsField": "color",
					"fillAlphas": 0.9,
					"lineAlpha": 0.2,
					"type": "column",
					"valueField": "count"
				}],
				"categoryField": "label",
				"categoryAxis": {
					"gridPosition": "start",
					"autoWrap": true
				},
				"export": {
					"enabled": false
				}
			});
		});
	} else{
		$("#struct_bar_chart").html('<h3 class="no-data">No data available</h3>');
	}
}

function wfp_bar_msel_roles_chng(){
	var org_id = $('#wfp_sel_org').val();
	var org_unit_id = $('#wfp_sel_org_unit').val();
	var wfp_bar_msel_roles_val = $("#wfp_bar_msel_roles").val();
	if(wfp_bar_msel_roles_val != null){
		$.ajax({
			url : '/wfp_bar_msel_roles_chng/',
			type : 'POST',
			timeout : 10000,
			data: {
				'org_id': org_id,
				'org_unit_id': org_unit_id,
				'wfp_bar_msel_roles_val': JSON.stringify(wfp_bar_msel_roles_val),
			},
			async: false,
		}).done(function(json_data){
			var json_data = JSON.parse(json_data);
			var chartData = [];
			for(var i=0; i<json_data.data.length; i++){
				var dt = {};
				dt = {
						"role": json_data.data[i].role_title,
						"planned": json_data.data[i].planned_count,
						"existing": json_data.data[i].existing_count,
						"required": json_data.data[i].required_count,
						"excess": json_data.data[i].excess_count
				};
				chartData.push(dt);
			}
			AmCharts.makeChart("struct_multi_bar_chart", {
				"type": "serial",
				"fontFamily": "'Poppins', sans-serif",
				"theme": "light",
				"categoryField": "role",
				"rotate": false,
				"startDuration": 1,
				"categoryAxis": {
					"gridPosition": "start",
					"autoWrap": true
				},
				"trendLines": [],
				"graphs": [{
					"balloonText": "Planned Resources:[[value]]",
					"fillAlphas": 0.8,
					"id": "AmGraph-1",
					"lineAlpha": 0.2,
					"title": "Planned Resources",
					"type": "column",
					"valueField": "planned",
					"fillColors": "#53c6fa"
				},
				{
					"balloonText": "Existing Resources:[[value]]",
					"fillAlphas": 0.8,
					"id": "AmGraph-2",
					"lineAlpha": 0.2,
					"title": "Existing Resources",
					"type": "column",
					"valueField": "existing",
					"fillColors": "#d97df0"
				},
				{
					"balloonText": "Required Resources:[[value]]",
					"fillAlphas": 0.8,
					"id": "AmGraph-3",
					"lineAlpha": 0.2,
					"title": "Required Resources",
					"type": "column",
					"valueField": "required",
					"fillColors": "#fcaa7d"
				},
				{
					"balloonText": "Excess Resources:[[value]]",
					"fillAlphas": 0.8,
					"id": "AmGraph-4",
					"lineAlpha": 0.2,
					"title": "Excess Resources",
					"type": "column",
					"valueField": "excess",
					"fillColors": "#5c6bc0"
				}
				],
				"guides": [],
				"valueAxes": [{
					"axisAlpha": 0,
					"position": "left",
					"title": "Resources"
				}],
				"allLabels": [],
				"balloon": {},
				"titles": [],
				"dataProvider": chartData,
				"export": {
					"enabled": false
				}
			});
		})
	} else {
		$("#struct_multi_bar_chart").html('<h3 class="no-data">No data available</h3>');
	}
}

function wfp_bar_msel_grades_chng(){
	var wfp_bar_msel_grades_val = $("#wfp_bar_msel_grades").val();
	if(wfp_bar_msel_grades_val != null){
		$.ajax({
			url : '/wfp_bar_msel_grades_chng/',
			type : 'POST',
			timeout : 10000,
			data: {
				'wfp_bar_msel_grades_val': JSON.stringify(wfp_bar_msel_grades_val),
			},
			async: false,
		}).done(function(json_data){
			var json_data = JSON.parse(json_data);
			var struct_grade_chart_data = [];
			for(i=0; i<json_data.data.length; i++){
				struct_grade_chart_data.push({
					"label": json_data.data[i].grade,
					"count": json_data.data[i].count,
					"color": "#53c6fa"
				})
			}
			AmCharts.makeChart("struct_multi_grade_chart", {
				"type": "serial",
				"fontFamily": "'Poppins', sans-serif",
				"theme": "light",
				"marginRight": 70,
				"dataProvider": struct_grade_chart_data,
				"valueAxes": [{
					"axisAlpha": 0,
					"position": "left",
					"title": "Resources"
				}],
				"startDuration": 1,
				"graphs": [{
					"balloonText": "<b>[[category]]: [[value]]</b>",
					"fillColorsField": "color",
					"fillAlphas": 0.9,
					"lineAlpha": 0.2,
					"type": "column",
					"valueField": "count"
				}],
				"categoryField": "label",
				"categoryAxis": {
					"gridPosition": "start",
					"autoWrap": true
				},
				"export": {
					"enabled": false
				}
			});
		})
	}else{
		$("#struct_multi_grade_chart").html('<h3 class="no-data">No data available</h3>');
	}
}

//05-JUL-2018 || SMI || Step 1 - Click Function
$("#STRC1").click(function(){
	var org_id = $('#wfp_sel_org').val();
	var org_unit_id = $('#wfp_sel_org_unit').val();
	if(org_id == '' || org_id == null || org_unit_id == '' || org_unit_id == null){
		$("#structure_step1_tab_content").html('');
		$("#structure_step1_tab_content").css('height','auto');
		$("#structure_step1_tab_content").html('<h3 class="no-data">No data available</h3>');
	}else{
		STRC1_click_fn(org_id, org_unit_id);
	}
});

//05-JUL-2018 || SMI || Step 2 - Click Function
$("#STRC2").click(function(){
	var org_id = $('#wfp_sel_org').val();
	var org_unit_id = $('#wfp_sel_org_unit').val();
	if(org_id == '' || org_id == null || org_unit_id == '' || org_unit_id == null){
		$("#structure_step2_tab_content").html('');
		$("#structure_step2_tab_content").css('height','auto');
		$("#structure_step2_tab_content").html('<h3 class="no-data">No data available</h3>');
	}else{
		STRC2_click_fn(org_id,org_unit_id);
	}
});

//09-JUL-2018 || SMI || Step 3 - Click Function
$("#STRC3").click(function(){
	var org_id = $('#wfp_sel_org').val();
	var org_unit_id = $('#wfp_sel_org_unit').val();
	if(org_id == '' || org_id == null || org_unit_id == '' || org_unit_id == null){
		wfp_struct_s3_table=$('#wfp_struct_s3_tbl').DataTable();
		wfp_struct_s3_table.clear().draw();
		$("#wfp_struct_s3_tbl").DataTable().destroy();
		empty_datatable('wfp_struct_s3_tbl', [2,3,4,5]);
	}else{
		STRC3_click_fn(org_id,org_unit_id);
	}
});

//10-JUL-2018 || SMI || Step 4 - Click Function
$("#STRC4").click(function(){
	var org_id = $('#wfp_sel_org').val();
	var org_unit_id = $('#wfp_sel_org_unit').val();
	if(org_id == '' || org_id == null || org_unit_id == '' || org_unit_id == null){
		wfp_struct_s4_table=$('#wfp_struct_s4_tbl').DataTable();
		wfp_struct_s4_table.clear().draw();
		$("#wfp_struct_s4_tbl").DataTable().destroy();
		empty_datatable('wfp_struct_s4_tbl', [2,3]);
	}else{
		STRC4_click_fn(org_id,org_unit_id);
	}
});

//10-JUL-2018 || SMI || Step 5 - Click Function
var map_flag = true;
$("#STRC5").click(function(){
	var org_id = $('#wfp_sel_org').val();
	var org_unit_id = $('#wfp_sel_org_unit').val();
	if(org_id == '' || org_id == null || org_unit_id == '' || org_unit_id == null){
		$("#struct_donut_chart").html('<h3 class="no-data">No data available</h3>');
		$("#struct_bar_chart").html('<h3 class="no-data">No data available</h3>');
	}else{
		STRC5_click_fn(org_id,org_unit_id);
	}
	setTimeout(function(){
		if(map_flag){
			structure_map_dashbaord();
			map_flag = false;
		}
	}, 200);
});