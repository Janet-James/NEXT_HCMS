var selectedEmployee=0,update_id=0,employeeName="";
//employee list
$(document).ready(function(){
	$("#organization_id").val(0).change();
	$('[data-toggle="tooltip"]').tooltip();   
	$("#emp_name").prop('disabled', true);
	
});
//search employee name based on employee list
var elem = document.getElementById('emp_name');
elem.addEventListener('keypress', function(e){ 
  if (e.keyCode == 13) {
	  employeeList(2);
  }
});

//org change
$("#organization_id").change(function() {
	$("#emp_name").val(''); 
	if($('#organization_id option:selected').val() != 0) {
		var org_name = $("#organization_id option:selected").text() != '' ? $("#organization_id option:selected").text() : ''
		$("#employee_org_name").html('( '+org_name+' )');
		org_unit($('#organization_id option:selected').val()); 
		employeeList(0);
		$("#emp_name").prop('disabled', false);
	}else{
		dropDownList([],'organization_unit_id');
		org_unit($('#organization_id option:selected').val());  
		$('#employee_list').html('<div class="col-md-12"><h3 style="text-align: center;color:#e73d4a;">No data available.</h3></div>');
		$('#pagination_content').html('');
		$("#emp_name").prop('disabled', true);
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
		dropDownList(datas.role_values,'critical_role_id');
	});
}
//drop down list
function dropDownList(data,id){
	strAppend = '<option value="0">--Select Critical Role--</option>'
	if(data.length>0 && data.length != undefined){
		for(var i=0;i<data.length;i++){
			strAppend += '<option value="'+data[i].id+'">'+data[i].name+'</option>'
		}
	}
	$('#'+id).html(strAppend);
}

//org unit change 
$("#organization_unit_id").change(function() {
	$("#emp_name").val('');
	if($('#organization_unit_id option:selected').val() != 0 ){
		if($('#organization_id option:selected').val() != 0){
			$('#critical_role_id').val('0').trigger('change');
			employeeList(1);
		}
	}else{
		if($('#organization_id option:selected').val() != 0){
			employeeList(0);
		}
	}
});

//org role change
$("#critical_role_id").change(function() {  
	$("#emp_name").val('');
	if($('#critical_role_id option:selected').val() != 0 ){
		if($('#organization_id option:selected').val() != 0){
			$('#organization_unit_id').val('0').trigger('change');
			employeeList(3);
		}
	}else{
		if($('#organization_id option:selected').val() != 0){
			employeeList(0);
		}
	}
});
//fetch the Employee datas
function employeeList(status){
	if(status == 0){
		  datas = {'id':$('#organization_id option:selected').val()}
	}else if(status == 1){
		  datas = {'id':$('#organization_id option:selected').val(),'unit_id':$('#organization_unit_id option:selected').val()}
	}else if(status == 3){
		 datas = {'id':$('#organization_id option:selected').val(),'role_status' : $('#critical_role_id option:selected').val()}
	}else if(status == 2){
		  var emp_name = $('#emp_name').val();
		  if($('#organization_id option:selected').val() != 0 && $('#organization_unit_id option:selected').val() == 0){
			  datas = {'id':$('#organization_id option:selected').val(),'emp_name':emp_name}
		  }else if($('#organization_id option:selected').val() != 0 && $('#organization_unit_id option:selected').val() != 0){
			  datas = {'id':$('#organization_id option:selected').val(),'unit_id':$('#organization_unit_id option:selected').val(),'emp_name':emp_name}
		  }else if($('#organization_id option:selected').val() == 0 && $('#organization_unit_id option:selected').val() == 0){
				$('#employee_list').html('<div class="col-md-12"><h3 style="text-align: center;color:#e73d4a;">No data available.</h3></div>');
				$('#pagination_content').html('');
				return false
		  }
	} 
	$.ajax({
		url : "/sp_potential_successors_list/",
		type : "GET",
		data : datas,
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		dynamicDivform(data.results);
	});
}
//Employee form in function here 
function dynamicDivform(data){
	if(data.length>0){
		var strAppend = '<ul>';
		var pagination_content = '<div class="col-sm-3" id="emp_pagination"><div class="col-sm-3 btn prev" style="padding: 10px;">Prev</div><div class="col-sm-7"><ul class="pagination pagination-sm">';
		var count = 0;
		var list_count = 0;
		var pag_count = 0;
		for(var i=0; i<data.length; i++){
			count = count+1;
			list_count = list_count+1;
			if(list_count == 1){
				pag_count = pag_count + 1;
				strAppend += '<li id="pagination_'+pag_count+'" class="pagination_list" style="display: none;">';
				pagination_content += '<li class="pagenationList" id="pag_'+pag_count+'" onclick="paginationClick('+pag_count+')"><a>'+pag_count+'</a>	</li>';
			}
			strAppend += '<div class="col-lg-3 col-md-6 col-sm-12 row-eq-height">';
			strAppend += '<div class="EmployeeCard equhight employeeList">';
			strAppend += '<div class="icon_droupdown dropdown">';
				strAppend += '<div class="dropbtn dropdown_employee_list"><i class="fa fa-ellipsis-v"></i></div>';
				if(count == 4){
					strAppend += '<div class="dropdown-content dropmenu-right " >';
					count = 0;
				}else{
					strAppend += '<div class="dropdown-content " >';
				}
				strAppend += '<a href="#" style="color: red;padding: 2px;cursor: pointer;" onclick=identifingModal('+data[i].id+')>Identifing Competencies</a>';
				strAppend += '<a href="#" style="color: red;padding: 2px;cursor: pointer;" onclick=talentModal('+data[i].id+')>Talent Profiling</a>';
				strAppend += '<a href="#" style="color: red;padding: 2px;cursor: pointer;" onclick=learningDevelopmentModal('+data[i].id+')>Learning & Dev Plan</a>';
				strAppend += ' </div>';
				strAppend += '</div>';
			strAppend += '<div class="panel-body"><div class="row"><div class="col-md-3"> <img style="border-radius: 50% !important;" class="img img-inline pic_ina" src="'+image_path+data[i].profile+'" width="75px" height="75px"></div>';
			strAppend += '<div class="col-md-9" style="margin-top:-5px;"><div class="des-eql-height employee_list">';
			strAppend += '<h3><i class="award_icon nf nf-contribution"></i> <b>'+data[i].name+'</b></h3>';
			strAppend += '<div class="clearfix"></div>';
			strAppend += '<div class="successorchart" id="'+(i+1)+'chartDiv'+data[i].rk_id+'"></div><span class="ps-list-txt" id="'+(i+1)+'chartDivVal'+data[i].rk_id+'"><b>0%</b></span>';
			strAppend += '</div></div></div>';
			strAppend += '</div>';
			strAppend += '</div>';
			strAppend += '</div>';
            strAppend += '</div>';  
            if(list_count == 20){   
            	strAppend += '</li>';
            	list_count = 0 
            }
		}
		pagination_content += '</ul></div><div class="col-sm-2 btn next" style="padding: 10px;">Next</div></div>';
		strAppend += '</ul>';
		
		$('#employee_list').html(strAppend); 
		chartDataGeneratePS(data);//chart creation function call
		if(data.length > 20){
			$('#pagination_content').html(pagination_content);
		}
		paginationDiv();
	}
	else{
		$('#employee_list').html('<div class="col-md-12"><h3 style="text-align: center;color:#e73d4a;">No data available.</h3></div>');
		$('#pagination_content').html('');
	}
}

//pagination event function here
function paginationClick(id){
	$('.pagination_list').removeClass('activeEmployeeList');
	$('#pagination_'+id).addClass('activeEmployeeList');
	$('.pagenationList').removeClass('active');
	$('#pag_'+id).addClass('active');
}

//pagination div
function paginationDiv(){ 
	paginationClick(1);
	$('#emp_pagination').each(function () { 
		var foo = $(this);
		$(this).find('ul li:gt(4)').hide();
		$(this).find('.next').click(function () {
			var last = $('ul',foo).children('li:visible:last');
			last.nextAll(':lt(5)').show();
			last.next().prevAll().hide();
		});
		$(this).find('.prev').click(function () {
			var first = $('ul',foo).children('li:visible:first');
			first.prevAll(':lt(5)').show();
			first.prev().nextAll().hide()
		});
	});
}

//Identify Dynamic Page
function identifingModal(emp_id){
	let indentify_dev_status = indentifyDevelopment({ 'emp_id':emp_id });
	if(indentify_dev_status){
		let indentify_dev_skill_datas = indentify_dev_status['skill_details'];
		let emp_datas =  indentify_dev_status['emp_details'];
		let skill_type_details = indentify_dev_status['skill_type_details'];
		$('#sp_potential_successors_title').html('Identifing competencies');
		identifyContent = '<div class="learing_profile" id="identify_details">';
		identifyContent += '<img id="profile" src="'+image_path+emp_datas[0].image+'"/><div class="learing_profile_text">';
		identifyContent += '<span class="name" id="identify-name">'+emp_datas[0].name+'</span><span class="position" id="identify-position">'+emp_datas[0].role+'</span></div></div>';
		//bullet chart generation
		if(skill_type_details.length > 0){
			let competenciesContent = '<div class="col-sm-12"><h3>Identifing competencies</h3>';
			for(let i=0; i<skill_type_details.length; i++){
				let divSize = (skill_type_details.length == 1) ? 12 : (skill_type_details.length == 2) ? 6 : 4 ; 
				if((i+1)==skill_type_details.length){
					competenciesContent += '<div class="col-sm-'+divSize+' divBullet bullterChart-'+(skill_type_details[i].skill_type_id)+'"><div class="bulletChart" id="chartdiv-'+(skill_type_details[i].skill_type_id)+'"></div><h3 style="text-align: center;">'+skill_type_details[i].sname+' Skills</h3><hr class="identify-skills"><div class="bulletChart" id="chartdiv-sub-'+(skill_type_details[i].skill_type_id)+'"></div></div>';
				}else{
					competenciesContent += '<div class="col-sm-'+divSize+' divBulletBorder bullterChart-'+(skill_type_details[i].skill_type_id)+'"><div class="bulletChart " id="chartdiv-'+(skill_type_details[i].skill_type_id)+'"></div><h3 style="text-align: center;">'+skill_type_details[i].sname+' Skills</h3><hr class="identify-skills"><div class="bulletChart" id="chartdiv-sub-'+(skill_type_details[i].skill_type_id)+'"></div></div>';
				}
			}
			competenciesContent += '</div>';
			$('#sp_potential_successors_body').html(identifyContent+competenciesContent);
			if(skill_type_details.length > 0){
				for(let i=0; i<skill_type_details.length; i++){
					let skill_type_name = skill_type_details[i].sname || '';
					let skill_type_avg = skill_type_details[i].skill_type_avg || 0;
					let skill_type_data = [ {
						"category": skill_type_name,
						"excelent": 20,
						"good": 20,
						"average": 20,
						"poor": 20,
						"bad": 20,
						"limit": 50,
						"full": 100,
						"bullet": skill_type_avg 
					} ]
					'#86d6fb'
					let getColor = (skill_type_avg>0 && skill_type_avg<=20) ? ['#d5fcde','#86d6fb']  : (skill_type_avg>20 && skill_type_avg<=50) ? ['#fef4ce','#88f3a0'] : (skill_type_avg>50 && skill_type_avg<=80) ? ['#ffe1b6','#c6c5ff'] : ['#d7f2ff','#ffa4a2'] 
					bulletChart('chartdiv-'+(skill_type_details[i].skill_type_id),skill_type_data,getColor);//bullet chart generate
				}
				for(let i=0; i<indentify_dev_skill_datas.length; i++){
					let skill_key = indentify_dev_skill_datas[i].stid;
					let skill_values = indentify_dev_skill_datas[i].skills_list;
					$('#chartdiv-sub-'+skill_key).html('');
					for(let j=0; j<skill_values.length; j++){
						let skill_avg = skill_values[j].savg || 0 ;
						let skill_name = skill_values[j].sname || '';
						let skill_dev = '<div class="bulletChart" id="chartdiv-sub-skill-'+skill_key+'-'+j+'"></div>' 
						$('#chartdiv-sub-'+skill_key).append(skill_dev);
						let skill_datas = [ {
							"category": skill_name,
							"excelent": 20,
							"good": 20,
							"average": 20,
							"poor": 20,
							"bad": 20,
							"limit": 50,
							"full": 100,
							"bullet": skill_avg
						} ]
						let getColor = (skill_avg>0 && skill_avg<=20) ? ['#fa8e8e','#ffe5e6']  : (skill_avg>20 && skill_avg<=50) ? ['#58bbff','#d6f2ff'] : (skill_avg>50 && skill_avg<=80) ? ['#f6d065','#fff1cc'] : ['#2de6c6','#c2fef4'] 
						bulletChart('chartdiv-sub-skill-'+skill_key+'-'+j,skill_datas,getColor);//bullet chart generate			
					}
				}
			}
		}else{
			$('#sp_potential_successors_body').html(identifyContent+'<div class="col-md-12"><h3>Identifing competencies<h3><br><h3 style="text-align: center;color:#e73d4a;">No data available.</h3></div>');
		}
		}else{
			$('#sp_potential_successors_body').html('<div class="col-md-12"><h3 style="text-align: center;color:#e73d4a;">No data available.</h3></div>');
		}
	$('#spPotentialSuccessorsModal').modal('show');
}
//Identify development function here
function indentifyDevelopment(datas){
	let identify_dev_datas;
	$.ajax({
		url : "/sp_identify_development_list/",  
		type : "GET",
		data : datas,
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		identify_dev_datas = JSON.parse(json_data);
	});
	return identify_dev_datas.datas[0];
}  
//learning & development plan page 
function learningDevelopmentModal(emp_id){ 
	$('#sp_potential_successors_title').html('Learning & Development');
	let learning_dev_status = learningDevelopment({ 'emp_id':emp_id });
	let learning_dev_datas = learning_dev_status['training_details'];
	let emp_datas =  learning_dev_status['emp_details'];
	let emp_dev = '';
	if(emp_datas.length > 0){
		emp_dev = '<div class="col-sm-12"><h3>Employee Profile Details</h3><div class="col-sm-5"><ul class="profile-ul">';
		emp_dev += '<li><span class="profile-li"><i class="fa nf nf-manager"></i></span><span>'+emp_datas[0].name+'</span></li>';
		emp_dev += '<li><span class="profile-li"><i class="fa fa-envelope-o"></i></span><span>'+emp_datas[0].email+'</span></li>';
		emp_dev += '<li><span class="profile-li"><i class="nf nf-manage-role"></i></span><span>'+emp_datas[0].role+'</span></li>';
		emp_dev += '<li><span class="profile-li"><i class="nf nf-mobile"></i></span><span>'+emp_datas[0].mobile+'</span></li>';
		emp_dev += '<li><span class="profile-li"><i class="nf nf-team"></i></span><span>'+emp_datas[0].team+'</span></li>';
		emp_dev += '<li><span class="profile-li"><i class="fa fa-map-marker"></i></span><span>'+emp_datas[0].county+'</span></li>';
		emp_dev += '</ul></div><div class="col-sm-4"><div class="profile_item"><img class="sp_learn_img" id="profile" src="'+image_path+emp_datas[0].image+'" alt="No Image Found"/><br><a class="sp_learn_dev_link btn" onclick="ldAddTraning('+emp_id+')">Add Training</a></div></div></div>';
	}else{
		emp_dev = '<div class="col-sm-12"><h3>Employee Profile Details</h3><p class="no_data_found">No Data Found!</p></div>';
	}
	let learning_dev = '';
	if(learning_dev_datas.length > 0){
		learning_dev = '<hr class="divide_line"><div class="col-sm-12" ><h3>Training Details</h3>';
		learning_dev += '<table class="table table-striped table-bordered table-hover no-footer dataTable" id="sp_learning_dev"><thead><th>No.</th><th>Name</th><th>Type</th><th>Start Date</th><th>End Date</th><th>Recommend By</th><th>Division</th><thead><tbody>';
		for(let i=0; i<learning_dev_datas.length; i++){
			learning_dev += '<tr><td>'+(i+1)+'</td><td>'+learning_dev_datas[i].name+'</td><td>'+learning_dev_datas[i].training_type+'</td><td>'+learning_dev_datas[i].sdate+'</td><td>'+learning_dev_datas[i].edate+'</td><td>'+learning_dev_datas[i].emp_name+'</td><td>'+learning_dev_datas[i].division+'</td></tr>';
		}
		learning_dev += '</tbody></table>';
		learning_dev += '</div>';
	}else{
		learning_dev = '<hr class="divide_line"><div class="col-sm-12"><h3>Learning & Development Details</h3><div class="col-md-12"><h3 style="text-align: center;color:#e73d4a;">No data available.</h3></div></div>';
	}
	let dynamic = emp_dev+learning_dev;
	$('#sp_potential_successors_body').html(dynamic);
	$('#spPotentialSuccessorsModal').modal('show');
}  

//add training details
function ldAddTraning(emp_id){
	localStorage.setItem('emp_id', emp_id);
	window.location = '/ld_management_training_recommendation/';
}

//learning development function here
function learningDevelopment(datas){
	var learning_dev_datas;
	$.ajax({
		url : "/sp_learning_development_list/",
		type : "GET",
		data : datas,
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		learning_dev_datas = JSON.parse(json_data); 
	});    
	return learning_dev_datas.datas[0];
}
//chart function here
function chartDataGeneratePS(data){ 
	let dataLen = data.length;
	for(var i=0; i<dataLen; i++){
		let chartDataGenerate = chartDataParse(data[i].tot_avg);
		if(chartDataGenerate['data']){
			chartGenerate((i+1),data[i].rk_id,chartDataGenerate['data'],chartDataGenerate['tot']);
		}else{
			$('#'+(i+1)+'chartDiv').html('0');
			$('#'+(i+1)+'chartDivVal').html('0');
		}
	}
}
//chart data parse 
function chartDataParse(getValues){ 
	let getVal = getValues || 0;
	let getClr = (getVal>0 && getVal<=20) ? ['#d5fcde','#86d6fb']  : (getVal>20 && getVal<=50) ? ['#fef4ce','#88f3a0'] : (getVal>50 && getVal<=80) ? ['#ffe1b6','#c6c5ff'] : ['#d7f2ff','#ffa4a2'] 
	let getRemVal = 100 - getVal;
	let chartData = [{
	    "name": "Lithuania",
	    "psPer": getVal,
	    "color": getClr[0]
	}, {
	    "name": "Czech Republic",
	    "psPer": getRemVal,
	    "color": getClr[1]
	}];
	chartData.push({
	  "psPer": getVal+getRemVal,
	  "alpha": 0
	});
	return {'data':chartData,'tot':getVal};
}


//chart generation here
function chartGenerate(key,id,chartData,chartVal){
	$('#'+key+'chartDivVal'+id).html('<b>'+chartVal+'%</b>');
	var chart = AmCharts.makeChart(key+"chartDiv"+id, {
	  "type": "pie",
	  "startAngle": 0,
	  "radius": "75%",
	  "innerRadius": "70%",
	  "dataProvider": chartData,
	  "valueField": "psPer",
	  "titleField": "name",
	  "colorField":"color",
	  "alphaField": "alpha",
	  "labelsEnabled": false,
	  "pullOutRadius": 0,
	  "showBalloon": false,
	  "pieY": "95%"
	});
}

//bullet chart for competencies
function bulletChart(id,chartData,color){
	var chart = AmCharts.makeChart( id, {
		  "type": "serial",
			"fontFamily": "'Poppins', sans-serif",

		  "theme": "light",
		  "autoMargins": true,
		  //"marginTop": 30,
		  "marginLeft": 100,
		  //"marginBottom": 30,
		  //"marginRight": 50,
		  "dataProvider": chartData,
		  "valueAxes": [ {
		    "maximum": 100,
		    "stackType": "regular",
		    "gridAlpha": 0
		  } ],
		  "startDuration": 1,
		  "graphs": [ {
		    "fillAlphas": 1,
		    "fillColors":color[1],
		    "lineColor": color[1],
		    "showBalloon": false,
		    "type": "column",
		    "valueField": "excelent"
		  }, {
		    "fillAlphas": 1,
		    "lineColor": color[1],
		    "showBalloon": false,
		    "type": "column",
		    "valueField": "good"
		  }, {
		    "fillAlphas": 1,
		    "lineColor": color[1],
		    "showBalloon": false,
		    "type": "column",
		    "valueField": "average"
		  }, {
		    "fillAlphas": 1,
		    "lineColor": color[1],
		    "showBalloon": false,
		    "type": "column",
		    "valueField": "poor"
		  }, {
		    "fillAlphas":1,
		    "lineColor": color[1],
		    "showBalloon": false,
		    "type": "column",
		    "valueField": "bad"
		  }, {
		    "clustered": false,
		    "columnWidth": 0.3,
		    "fillAlphas": 1,
		    "lineColor": color[0],
		    "stackable": false,
		    "type": "column",
		    "valueField": "bullet"
		  }],
		  "rotate": true,
		  "columnWidth": 1,
		  "categoryField": "category",
		  "categoryAxis": {
		    "gridAlpha": 0,
		    "position": "left",
		    "ignoreAxisWidth": true,
		    "autoWrap": true
		  }
		} );

}
 