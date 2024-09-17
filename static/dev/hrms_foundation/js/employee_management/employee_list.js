var emp_status = 'active';
//employee active function here
function employeeActive(){
	emp_status = 'active';
	$('#organization_id').val(0).trigger('change');
	$("#emp_name").val('');
	$("#emp_name").prop('disabled', true);
	$('#pagination_content').hide();
	$('#employee_status').html('Active');
	$('#employee_status').css({'color':'#44bd9f'});
	employeeActiveClass();
}

//active class add function here
function employeeActiveClass(){
	let status = emp_status == "active" ? true : false;
	if(status == true){
		$('.emp_list_icons1').addClass('animated fadeIn infinite');
		$('.emp_list_icons2').removeClass('animated fadeIn infinite');
	}else{
		$('.emp_list_icons2').addClass('animated fadeIn infinite');
		$('.emp_list_icons1').removeClass('animated fadeIn infinite');
	}
	$('#employee_status').addClass('animated fadeIn infinite');
}

//employee in active function here
function employeeInActive(){
	emp_status = 'in-active';
	$('#organization_id').val(0).trigger('change');
	$("#emp_name").val('');
	$("#emp_name").prop('disabled', true);
	$('#pagination_content').hide();
	$('#employee_status').html('In-Active');
	$('#employee_status').css({'color':'rgb(247, 168, 168)'});
	employeeActiveClass();
}

//employee list
$(document).ready(function(){
	$("#organization_id").val(0).change();
	$('[data-toggle="tooltip"]').tooltip();   
	$("#emp_name").prop('disabled', true);
	employeeActive();
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
		$("#employee_org_name").html(org_name+' - ');
		org_unit($('#organization_id option:selected').val()); 
		employeeList(0);
		$("#emp_name").prop('disabled', false);
	}else{
		dropDownList([],'organization_unit_id');
		org_unit($('#organization_id option:selected').val()); 
		$('#employee_list').html('<div class="col-md-12"><h3 style="text-align: center;color:#e73d4a;">No data available.</h3></div>');
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
	$("#emp_name").val('');
	if($('#organization_unit_id option:selected').val(	) != 0 ){
		if($('#organization_id option:selected').val() != 0){
			employeeList(1);
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
		  datas = {'id':$('#organization_id option:selected').val(),'status':emp_status}
	}else if(status == 1){
		  datas = {'id':$('#organization_id option:selected').val(),'unit_id':$('#organization_unit_id option:selected').val(),'status':emp_status}
	}else if(status == 2){
		  var emp_name = $('#emp_name').val();
		  if($('#organization_id option:selected').val() != 0 && $('#organization_unit_id option:selected').val() == 0){
			  datas = {'id':$('#organization_id option:selected').val(),'emp_name':emp_name,'status':emp_status}
		  }else if($('#organization_id option:selected').val() != 0 && $('#organization_unit_id option:selected').val() != 0){
			  datas = {'id':$('#organization_id option:selected').val(),'unit_id':$('#organization_unit_id option:selected').val(),'emp_name':emp_name,'status':emp_status}
		  }else if($('#organization_id option:selected').val() == 0 && $('#organization_unit_id option:selected').val() == 0){
				$('#employee_list').html('<div class="col-md-12"><h3 style="text-align: center;color:#e73d4a;">No data available.</h3></div>');
				return false
		  }
	}
	$.ajax({
		url : "/hrms_employee_list_data/",
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
		var count = 0;
		var list_count = 0;
		var pag_count = 0;
		var strAppend = '<ul>';
		var pagination_content = '<div class="col-sm-3" id="emp_pagination">';
		pagination_content += '<div class="col-sm-3 btn prev prevCustom" style="padding: 10px;">Prev</div><div class="col-sm-7"><ul class="pagination pagination-sm">';
		for(var i=0; i<data.length; i++){
			count = count+1;
			list_count = list_count+1;
			if(list_count == 1){
				pag_count = pag_count + 1;
				strAppend += '<li id="pagination_'+pag_count+'" class="pagination_list" style="display: none;">';
				pagination_content += '<li class="pagenationList" id="pag_'+pag_count+'" onclick="paginationClick('+pag_count+')"><a>'+pag_count+'</a>	</li>';
			}
			strAppend += '<div class="col-lg-3 col-md-6 col-sm-12 row-eq-height">';
			if(emp_status == 'active'){
				strAppend += '<div class="EmployeeCard equhight employeeList" style="background-color:#edf1f0;border-left: 1px solid #44bd9f !important">';
			}else{
				strAppend += '<div class="EmployeeCard equhight employeeList" style="background-color:#f1dcdc;border-left: 1px solid #fc9a77 !important">';
			}
				strAppend += '<div style="float: right;color: red;padding: 2px;cursor: pointer;position: absolute;right: 0;z-index:1;" class="dropdown">';
				strAppend += '<div class="dropbtn dropdown_employee_list"><i class="fa fa-ellipsis-v"></i></div>';
				if(count == 4){
					strAppend += '<div class="dropdown-content dropmenu-right " >';
					count = 0;
				}else{
					strAppend += '<div class="dropdown-content " >';
				}
				strAppend += '<a href="#" style="color: red;padding: 2px;cursor: pointer;" onclick=employee_edit('+data[i].id+',"/hrms_employee/")>Employee Details</a>';
				strAppend += ' </div>';
				strAppend += '</div>';
			//strAppend += '<a href="#" style="color: red;padding: 2px;cursor: pointer;" onclick=employee_edit('+data[i].id+',"/em_employees/")>Employee Deactivation</a>';
				
			strAppend += '<div class="panel-body"><div class="row"><div class="col-md-3"> <img style="border-radius: 50% !important;" class="img img-inline pic_ina" src="'+image_path+data[i].profile+'" width="75px" height="75px"></div>';
			strAppend += '<div class="col-md-9" style="margin-top:-5px;"><div class="des-eql-height employee_list">';
			strAppend += '<h3><b>'+data[i].name+'</b></h3>';
			strAppend += '<h6>'+data[i].role+'</h6>';
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
		pagination_content += '</ul></div>';
		if(pag_count > 5 ){
			pagination_content += '<div class="col-sm-2 btn next" style="padding: 10px;">Next</div></div>';
		}
		strAppend += '</div></ul>';
		$('#employee_list').html(strAppend);
		$('#pagination_content').html(pagination_content);
		paginationDiv();
		if(pag_count > 1){
			$('#pagination_content').show();
		}else{
			$('#pagination_content').hide();
		}
		if(pag_count > 5 ){
			$('.prevCustom').show();
		}else{
			$('.prevCustom').hide();
		}
	}
	else{
		$('#employee_list').html('<div class="col-md-12"><h3 style="text-align: center;color:#e73d4a;">No data available.</h3></div>');
		$('#pagination_content').html('');
		$('#pagination_content').hide();
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

//employee page
function employee_edit(emp_id,url){
	let emp_cur_status = emp_status == 'active' ? true : false;
	localStorage.setItem('emp_id', emp_id);
	localStorage.setItem('emp_status', emp_cur_status);
	window.location = url;
}

