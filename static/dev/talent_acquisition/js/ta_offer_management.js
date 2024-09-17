var res_data = '', table_id = 0;
var url = "", row_click = 0, row_id = 0;
var columns = [ {
	title : "ID"
}, {
	title : "No."
}, {
	title : "Name"
}, {
	title : "Status"
} ]
var offer_job_title;
$(document)
		.ready(
				function() {
					$('#candidate_address,#primary_email,#secondary_email,#phone_number,#mobile_number').prop('disabled', true);
					var post_data = {};
					post_data["table_name"] = "ta_candidate_info";
					post_data["fields"] = "c.id, coalesce(c.first_name,'')||' '||coalesce(c.last_name,'') as name";
					post_data["candidate_status"]=666; 
					res=DropdownValues(post_data) 
					setDropdownValues((res?res:null), "candidate", "id", "name");
					var post_data = {};
					post_data["type"] = "reference";   
					post_data["code"] = "COSTE" 
					res=DropdownValues(post_data) 
					setDropdownValues((res?res:null), "cost_to_employee", "id","refitems_name");
					var post_data = {};
					post_data["type"] = "reference";  
					post_data["code"] = "OFFRE"  
					res=DropdownValues(post_data)
					setDropdownValues((res?res:null), "offer_release", "id","refitems_name");
					button_create(1)
					offer_datatable_function();  
					$('#right').trigger('click');  
					$('#job_opening').attr("disabled", true);
				
				})  
				
//offer management dropdown function here
function DropdownValues(post_data) {  
	res_data ="";
	$.ajax({ 
		url : '/ta_job_openings_dropdown/',
		type : 'POST', 
		data : post_data,
		timeout : 10000, 
		async : false,
	}).done(function(json_data) {
		var data = JSON.parse(json_data); 
		if (data.vals) {
			res_data = data.vals;
			//setDropdownValues(res_data, id, key, value)
		}
	});
	return res_data;
}

//offer management set drop down function here
function setDropdownValues(res, id, key, value) {
    if(res){
	for (var i = 0; i < res.length; i++) {
		$('#' + id).append($('<option>', {
			value : res[i][key],
			text : res[i][value]
		})); 
	}
    }
}

//offer create function here
function job_offer_create() {
	var isvalid = job_offer_form_validation();
	if (isvalid) {
		add_update("", "add");
	}
}

//offer update function here
function job_offer_update() {
	if (table_id != 0) {
		var isvalid = job_offer_form_validation();
		if (isvalid) {
			add_update(table_id, "update");
		}
	}
}

//candidate onchange function here
$('#candidate').on('change', function() {
	if (row_click != 1) {
		if (this.value != 0) {
			url = "";
			offer_management_rowclick("candidate", this.value);
		}
	} else { 
		row_click = 0;
	}
});

//offer delete function here
function job_offer_delete() {
	if (table_id != 0) {
		var title = $('#candidate option:selected').text();
		var isvalid = job_offer_form_validation();
		if (isvalid) {
			removeConfirmation('add_update', table_id, title);
		}
	}
}

//set candidate management function here
function setCandidateManagementData(res) {
	row_click = 0;
	$('#candidate').val(res.candidate_id);
	$('#candidate_address').val(res.address).prop('disabled', true);
	$('#primary_email').val(res.primary_email).prop('disabled', true);
	$('#secondary_email').val(res.secondary_email).prop('disabled', true);
	$('#phone_number').val(res.phone_no).prop('disabled', true);
	$('#mobile_number').val(res.mobile_no).prop('disabled', true);
	$('#job_opening').val(res.job_title_id).trigger("change");
}

//set offer management data function here
function setOfferManagementData(res) {
	$('#candidate').val(res.candidate_id).trigger("change");
	$('#candidate_address').val(res.address).prop('disabled', true);
	$('#primary_email').val(res.primary_email).prop('disabled', true);
	$('#secondary_email').val(res.secondary_email).prop('disabled', true);
	$('#phone_number').val(res.phone_no).prop('disabled', true);
	$('#mobile_number').val(res.mobile_no).prop('disabled', true);
	$('#cost_to_employee').val(res.cost_to_employee_id).trigger("change");
	$('#offer_release').val(res.offer_release_id).trigger("change");
	$('#job_opening').val(res.job_title_id).trigger("change");
	$('#emp_cost').val(res.ctc);
	table_id = res.id;
	// button_create();
}

// get offer from id
function offerGenerate(id) {
	if (id != 0) {
		row_id = id;
		$('#generate_offer').trigger('click');
		$("#offerModal").modal('toggle');
	}
}

//offer management row click function here
function offer_management_rowclick1(id) {
	$('.EmployeeCard').removeClass('custom_dev_acitve');
	$('#' + id).addClass('custom_dev_acitve');
	offer_management_rowclick('offer', id)
}

//offer management row click function here
function offer_management_rowclick(table, id) {
	if (table == "offer") {
		post_data = {};
		post_data['type'] = "row"
		post_data['table'] = "offer"
		post_data['table_id'] = id;
		var res = getTableData(post_data);

		if (res.datas != "") {
			button_create();
			job_offer_clear();
			setOfferManagementData(res.datas[0]);
		}
	} else if (table == "candidate") {
		button_create(1);
		job_offer_clear();
		post_data = {};
		post_data['type'] = "row"
		post_data['table'] = "candidate"
		post_data['table_id'] = id;
		var res = getTableData(post_data);

		if (res.datas != "") {
			setCandidateManagementData(res.datas[0]);
		}
	}
}

// clear conformation function here
function job_offer_cancel() {
	if (table_id != 0) {
		var title = $('#candidate option:selected').text();
		orgClearFuncton('job_offer_cancel_call', '', title);
	} else {
		job_offer_cancel_call();
	}
}

//offer clear function here
function job_offer_clear() {
	// button_create();
	row_click = 1;
	$('#job_offer_form')[0].reset();
	// $('#candidate').val(0).trigger("change");
	$('#cost_to_employee').val(0).trigger("change");
	$('#offer_release').val(0).trigger("change");

}

//offer clear function here
function job_offer_cancel_call() {
	button_create(1);
	row_click = 1;
	$('#job_offer_form')[0].reset();
	$('#candidate,#job_opening,#cost_to_employee,#offer_release').val(0)
			.trigger("change");
	$('.EmployeeCard').removeClass('custom_dev_acitve');
}

//offer data get function here
function offer_datatable_function() {
	post_data = {};
	post_data['type'] = "all"
	var res = getTableData(post_data);
	drawDatatable(res);
	plaindatatable_btn("ta_offer_table", res.datas, columns, 0,
			'NEXT_TRANSFORM_HCMS_OFFER_' + currentDate());

}

// Offer management data table function here  
function drawDatatable(data) {
	var res_datas = data.datas;
	var verticalViewData = '';
	if (res_datas.length) {
		for (var i = 0; i < res_datas.length; i++) {
			verticalViewData += '<div class="col-md-12 EmployeeCard equhight employeeList ta_job_opening" id="'
					+ res_datas[i][0]
					+ '" onclick="offer_management_rowclick1('
					+ res_datas[i][0] + ')">'
			verticalViewData += '<div class="col-md-8">' 
			verticalViewData += '<table><tr><td class="tdwidth1">Name</td><td class="tdwidth2">:</td><td class="tdwidth3"> <b>' + res_datas[i][2]
					+ '</b></td></tr> ';
			verticalViewData += '<tr><td class="tdwidth1">Offer Status</td><td class="tdwidth2">:</td><td class="tdwidth3"> <b>'
					+ res_datas[i][3] + '</b></td></tr></table>';
			verticalViewData += '</div>'
			verticalViewData += '<div class="col-md-4 ta_job_status_div">'
			verticalViewData += '<div class="">Offer Viewer</div>';
			verticalViewData += '<div style="color:green;font-size: 16px;" class=""><i class="fa fa-external-link" title="Generate offer" onclick="offerGenerate('
					+ res_datas[i][0] + ')"></i></div>';
			verticalViewData += '</div>'
			verticalViewData += '</div>'
		}
	} else { 
		verticalViewData = "<p class='no_data_found'>No Data Found.</p>" 
	}
	$('#ta_job_interview_details_vertical_view').html(verticalViewData);
}

//get data function here
function getTableData(param) {
	var data = "";
	$.ajax({
		url : "/ta_job_offer_data/",
		type : 'POST',
		timeout : 10000,
		data : param,
		async : false,
	}).done(function(json_data) {
		data = JSON.parse(json_data)
	});
	return data;
}

//offer management operation function here
function add_update(id, operation) {
	var vals = "";
	if (operation == undefined) {
		operation = "remove";
	}
	var candidate = $('#candidate').val();
	var offer_release = $('#offer_release').val();
	var cost_to_employee = $('#cost_to_employee').val();
	var cost_to_company=$('#emp_cost').val();
	var job_title_id = offer_job_title;
	if (id && operation == "update") {
		if ($('#offer_release').val() != 0) {
			offer_update_data = {
				'candidate' : candidate,
				'offer_release' : offer_release,
				'cost_to_employee' : cost_to_employee,
				'job_title_id' : job_title_id,
				'cost_to_company' : cost_to_company,
			}
			var vals = {
				'results' : JSON.stringify(offer_update_data),
				'delete_id' : '',
				'update_id' : id,
				csrfmiddlewaretoken : $("input[name=csrfmiddlewaretoken]")
						.val()
			}
		} else {
			alert_lobibox("error", "Select Offer Release");
		}

	} else if (!id && operation == "add") {
		offer_create_data = {
			'candidate' : candidate,
			'offer_release' : null,
			'cost_to_employee' : cost_to_employee,
			'job_title_id' : job_title_id, 
			'cost_to_company' : cost_to_company,

		}
		var vals = {
			'results' : JSON.stringify(offer_create_data),
			'delete_id' : '',
			'update_id' : '',
			csrfmiddlewaretoken : $("input[name=csrfmiddlewaretoken]").val()
		}
	} else if (id && operation == "remove") {
		if (table_id != 0) {
			var vals = {
				'results' : "", 
				'delete_id' : table_id,
				'update_id' : '',
				'job_title_id' : job_title_id,
				'candidate_id' : candidate,
				csrfmiddlewaretoken : $("input[name=csrfmiddlewaretoken]")
						.val()
			}
		}
	}
	if (vals) {
		$.ajax({
			url : '/ta_job_offer_crud/',
			type : 'POST',
			data : vals,
			timeout : 10000, 
			async : false,
		}).done(
				function(json_data) {
					var data = JSON.parse(json_data);
					// alert_status(data.results)
					if (data.results == "ERR0503") {
						alert_lobibox("error", 
								sysparam_datas_list[data.results]);
					} else if (data.results == 'NTE_03') {
						table_id = 0;
						button_create(1);
						offerHeaderCount();  
						alert_lobibox("success",
								sysparam_datas_list[data.results]);
						offer_datatable_function();
						cache={};
						job_offer_cancel(); 
					} else if (data.results == 'ERR0020') { 
						alert_lobibox("warning", 
								"Offer candidate name already exists");
						// job_offer_clear();
					} else {  
						table_id = 0;
						alert_lobibox("success",
								sysparam_datas_list[data.results]);
						offerHeaderCount(); 
						offer_datatable_function();
						button_create(1);
						cache={};
						job_offer_cancel();   
					}
				});
	}
}

//candidate change function here
$('#candidate').change(function(){
	$('.errorTxt0').html('');
	job_title_drop_down($('#candidate').val())
});

//job title drop down change function here
function job_title_drop_down(candidate_id){
	$.ajax({
		url : "/ta_job_title_drop_down/",
		type : "POST",
		data : {"candidate_id":candidate_id},
		csrfmiddlewaretoken : $("input[name=csrfmiddlewaretoken]").val(),
		timeout : 10000,
		async:false, 
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		if(data.job_opening){				
			 	for (var i=0;i<data.job_opening.length;i++)
				{
			 		offer_job_title = data.job_opening[i].job_opening_id;
					$('#job_opening').val(data.job_opening[i].job_opening_id).trigger('change')
					$('#job_opening').attr("disabled", true);
					$('.errorTxt3').html('')					
				}				
		}
	});
}

// jquery leave validation
jQuery.validator.addMethod('valueNotEquals', function(value) {
	return (value != '0');
}, "country required");

$('.select2').select2().change(function() {
	$('.errorTxts').html('');
});

$('#job_offer_form').submit(function(e) {
	e.preventDefault();
}).validate({

	rules : {
		candidate : {
			required : true,
			valueNotEquals : true,
		},
		job_opening : {
			valueNotEquals : true,
		},

		cost_to_employee : {
			required : true,
			valueNotEquals : true,
		},
		emp_cost:{
			required : true,
			valueNotEquals : true,
		},
	},
	// For custom messages
	messages : {
		candidate : {

			required : "Select Candidate",
			valueNotEquals : "Select Candidate",
		},
		job_opening : {
			valueNotEquals : "Select Job",
		},
		cost_to_employee : {
			required : "Select Cost to Employee",
			valueNotEquals : "Select Cost to Employee",

		},
		emp_cost : {

			required  : "Enter Employee Cost",
		},
	},
	errorElement : 'div',
	errorPlacement : function(error, element) {
		var placement = $(element).data('error');
		if (placement) {
			$(placement).append(error)
		} else {
			error.insertAfter(element);
		}
	},
	ignore : []
});
// Job offer form validations here
function job_offer_form_validation() {
	return $('#job_offer_form').valid();
}

$('.select2').select2().change(function() {
	$('.errormessage').html('');
});

// button create function here
function button_create(status) {
	var access_for_create = jQuery.inArray("Offer Management", JSON
			.parse(localStorage.Create));
	var access_for_write = jQuery.inArray("Offer Management", JSON
			.parse(localStorage.Write));
	var access_for_delete = jQuery.inArray("Offer Management", JSON
			.parse(localStorage.Delete));
	var strAppend = '';
	if (status == 1) {
		$('#offer_status').hide();
		if (access_for_create != -1) {
			strAppend = "<button type='button'id='job_offer_add' onclick='job_offer_create()' class='btn btn-success btn-eql-wid btn-animate'>Add</button>"
		}
		strAppend += " <button type='button'id='job_offer_clear' onclick='job_offer_cancel()' class='btn btn-warning btn-animate btn-eql-wid btn-animate'>Cancel / Clear</button>"
		$('#job_offer_btn').html(strAppend);
	} else {
		$('#offer_status').show();
		if (access_for_write != -1) {

			strAppend = "<button type='button' onclick='job_offer_update()' class='btn  btn-primary btn-eql-wid btn-animate '>Update</button>"
		}
		if (access_for_delete != -1) {
			strAppend += " <button type='button' onclick='job_offer_delete()' class='btn btn-danger btn-eql-wid btn-animate '>Remove</button>"
		}
		strAppend += " <button type='button' onclick='job_offer_cancel()' class='btn btn-warning btn-eql-wid btn-btn-animate'>Cancel / Clear</button>"
		$('#job_offer_btn').html(strAppend);
	}
}

//generate offer function here
function generate_offer() {
	$('#offer_download,#offer_email').show();
	$('#generate_offer').hide();
	var post_data = {};
	post_data["type"] = "GENERATE"
	post_data["id"] = row_id;
	var data = offerProcess(post_data);
	var body_content = data.body_content
			|| "<span class='offer_data_not_found' style='color:red'>No Data Found</span>";
	$('#offer_generate_div').html(body_content)
	var downloaded_file_name = data.results
	if (downloaded_file_name) {
		// alert_lobibox("success","Offer Generated");
		var file_name = '<a  title="Download Offer" class="btn btn-success btn-eql-wid btn-animate" href="'
				+ ta_offer_letter_path
				+ downloaded_file_name
				+ '" download="'
				+ downloaded_file_name
				+ '"><i class="offer_report nf nf-download"></i></a>';
		$('#offer_download').html(file_name);
	}
}

//print offer function here
function print_offer() {
	var post_data = {};
	post_data["type"] = "PRINT"
	post_data["id"] = row_id;
	offerProcess(post_data)
}

//offer email function here
function email_offer() {
	var post_data = {};
	post_data["type"] = "EMAIL";
	post_data["id"] = row_id;
	var data = offerProcess(post_data)
	var res = data.results;
	if (res == "MAILSD") {
		alert_lobibox("success", "Offer Letter has been sent to Candidate");
	}
}

//offer process function here
function offerProcess(post_data) {
	var retun_val = "";
	$.ajax({
		url : '/ta_job_offer_generate/',
		type : 'POST',
		data : post_data,
		timeout : 10000,
		async : false,
	}).done(function(json_data) {
		var data = JSON.parse(json_data);
		if (data.results) {
			if (data.results == "PDFER") {
				alert_lobibox("error", "Offer Generation failed");
			} else if (data.results == "NTE-02") {
				alert_lobibox("error", "Offer Generation failed");
			} else {
				retun_val = data
			}
		}
	});
	return retun_val
}

// 20-July-2018 || TRU || right Details Button Function
$("#right").click(function() {
	$('#left').css('display', 'block');
	$('#right').css('display', 'none');
	$('#ta_open_main_div1').addClass('col-md-12').removeClass('col-md-8');
	$('#ta_open_main_div2').removeClass('divActive');
});

// 20-July-2018 || TRU || left Details Button Function
$("#left").click(function() {
	$('#left').css('display', 'none');
	$('#right').css('display', 'block');
	$('#ta_open_main_div1').addClass('col-md-8').removeClass('col-md-12');
	$('#ta_open_main_div2').addClass('divActive');
});
// search job name based on job list
var elem = document.getElementById('job_offer_search');
elem.addEventListener('keypress', function(e) {
	if (e.keyCode == 13) {
		var offer_name = $('#job_offer_search').val()
		if (!offer_name == '') {
			jobSearchList(offer_name);
		} else {
			jobSearchList('');
			offer_datatable_function();
		}
	}
});

// fetch the job datas
function jobSearchList(name) {
	$.ajax({
		url : "/ta_job_offer_data/",
		type : "POST",
		data : {
			'filter_name' : name,
			'type' : 'filter'
		},
		timeout : 10000,
		async : false,
	}).done(function(json_data) {
		data = JSON.parse(json_data);
		drawDatatable(data);
	});
}