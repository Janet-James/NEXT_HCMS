//exit certificate function here 
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
		$("#employee_org_name").html(org_name+' - ');
		org_unit($('#organization_id option:selected').val()); 
		employeeList(0);
		$("#emp_name").prop('disabled', false);
	}else{
		dropDownList([],'organization_unit_id');
		org_unit($('#organization_id option:selected').val()); 
		$('#employee_list').html('<div class="col-md-12"><h3 style="text-align: center;color:#e73d4a;">No data available.</h3></div>');
		$("#emp_name").prop('disabled', true);
	}});

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
				$('#employee_list').html('<div class="col-md-12"><h3 style="text-align: center;color:#e73d4a;">No data available.</h3></div>');
				return false
		  }
	}
	$.ajax({
		url : "/em_certificate_list/",
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
			strAppend += '<div class="col-lg-4 col-md-6 col-sm-12 row-eq-height">';
			strAppend += '<div class="EmployeeCard equhight employeeList">';
			strAppend += '<div style="float: right;color: red;padding: 2px;cursor: pointer;position: absolute;right: 0;z-index:1;" class="dropdown">';
				strAppend += '<div class="dropbtn dropdown_employee_list"><i class="fa fa-ellipsis-v"></i></div>';
				if(count == 3){
					strAppend += '<div class="dropdown-content dropmenu-right " >';
					count = 0;
				}else{
					strAppend += '<div class="dropdown-content " >';
				}
				strAppend += '<a href="#" style="color: red;padding: 2px;cursor: pointer;" onclick=employee_certificate_list('+data[i].id+','+data[i].emp_id+')>Certificate Generate</a>';
				strAppend += ' </div>';
				strAppend += '</div>';
			strAppend += '<div class="panel-body"><div class="row"><div class="col-md-3"> <img style="border-radius: 50% !important;" class="img img-inline pic_ina" src="'+image_path+data[i].image+'" width="75px" height="75px"></div>';
			strAppend += '<div class="col-md-9" style="margin-top:-5px;"><div class="des-eql-height employee_list">';
			strAppend += '<h3><b>'+data[i].name+'</b></h3>';
			strAppend += '<h6>'+data[i].title+'</h6>';
			strAppend += '</div></div></div>';
			strAppend += '</div>';
			strAppend += '</div>';
			strAppend += '</div>';
            strAppend += '</div>';
            if(list_count == 15){
            	strAppend += '</li>';
            	list_count = 0
            }
		}
		pagination_content += '</ul></div><div class="col-sm-2 btn next" style="padding: 10px;">Next</div></div>';
		strAppend += '</ul>';
		$('#employee_list').html(strAppend);
		if(data.length > 15){
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

//exit employee certificate
function employee_certificate_list(exit_id,emp_id){
	var datas = { 'exit_id':exit_id,'emp_id':emp_id };
	var response_data = exitReport(datas);
	if(response_data.length > 0){
		console.log(response_data);
		let pdf_url = (exit_certificate_path+response_data[0].file_name).toString();
		var reportContent = '<div class="col-md-12 table-responsive"><table class="table">';
		reportContent += '<tr><td class="tdwidth1">Name </td><td class="tdwidth1"> : </td><td class="tdwidth1">'+response_data[0].name+'</td></tr>';
		reportContent += '<tr><td class="tdwidth1">Role </td><td class="tdwidth1"> : </td><td class="tdwidth1">'+response_data[0].title+'</td></tr>';
		reportContent += '<tr><td class="tdwidth1">Resignation Date </td><td class="tdwidth1"> : </td><td class="tdwidth1">'+response_data[0].resign_date+'</td></tr>';
		reportContent += '<tr><td class="tdwidth1">Relieved Date </td><td class="tdwidth1"> : </td><td class="tdwidth1">'+response_data[0].relieved_date+'</td></tr>';
		reportContent += '</table></div>';
		reportContent += '<div class="col-md-12 table-responsive" id="emPdfViwer">';
		reportContent += '<iframe src="'+pdf_url+'" id="pdf_url" width="800px" height="250px" >';
		reportContent += '</div>';
		certificate_content = '<div class="col-md-12" id="btn-certificate-view">';
		certificate_content += '<a data-toggle="tooltip" data-placement="bottom" title="Exit Document Download"  class="btn btn-primary btn-animate menu-toggle-btn margin-right-30 pull-left" href="'+exit_certificate_path+response_data[0].file_name+'" download="'+response_data[0].file_name+'"><i class="nf nf-download" ></i></a>';
		certificate_content += '<a onclick="SendToEmail('+emp_id+')" data-toggle="tooltip" data-placement="bottom" title="Exit Document Send in Mail"  class="btn btn-primary btn-animate menu-toggle-btn margin-right-30 pull-left" ><i class="nf nf-email" ></i></a>';
		certificate_content += '</div>';
		$('#em_exit_report').html(reportContent);
		$('#em_certficate_footer').html(certificate_content)
		$('[data-toggle="tooltip"]').tooltip(); 
		let view_status = myBrowserFunction() == 'Chrome' ? $('#emPdfViwer').show() : $('#emPdfViwer').hide();
		$('#emExitReportModal').modal('show');
	}else{
		alert_lobibox("error", "Exit Employe Certificate Error.");
	}
}

//report generate
function exitReport(datas){
	var data = []
	$.ajax({
		url : "/em_certificate_generate/",
		type : "GET",
		data : datas,
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		var res_data = JSON.parse(json_data);
		data = res_data.results
	});
	return data
}

//send email
function SendToEmail(emp_id){
	$.ajax({
		url : "/em_send_mail/",
		type : "GET",
		data : { 'emp_id':emp_id },
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		var res_data = JSON.parse(json_data);
		if(res_data.results == 'send'){
			alert_lobibox("success", "Employe Exit Letter Send.");
		}else{
			alert_lobibox("error", "Employe Exit Letter Send Error.");
		}
	});
}