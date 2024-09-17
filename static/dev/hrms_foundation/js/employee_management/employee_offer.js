var employee_list_values = [];
var datas = getFormValues("#employee_offer_form");
var	csrf_data = datas.csrfmiddlewaretoken;
//offer details load area
$(document).ready(function(){
	let eog_btn_status = button_generate();
	let eog_list = employeeOfferList();
	$('[data-toggle="tooltip"]').tooltip();
});

//button create function here
function button_generate(){
	let access_for_create = jQuery.inArray( "Leave Administration", JSON.parse(localStorage.Create) );
	let strAppend = "<button type='button' onclick='generateOffer()' class='btn-animate btn-eql-wid btn btn-success'>Generate</button>"
	strAppend += " <button type='button' onclick='clearOffer()' class='btn-animate btn-eql-wid  btn btn-warning '>Cancel / Clear</button>"
	$('#employee_offer_btn').html(strAppend);
}

//employee offer list
function employeeOfferList(){
	let res_data = getEmployeeList('all');
	if( res_data.length > 0 ){
		dynamicEmployeeList(res_data,'employee_offer_details');
		$('#emp_name_filter').show();
	}else{
		$('#employee_offer_details').html('<div class="col-md-12"><h3 style="text-align: center;color:#e73d4a;">No data available.</h3></div>');
		$('#emp_name_filter').hide();
	}
}

//search functionality
$('#emp_name').keypress(function(event) {
	    var keycode = event.keyCode || event.which;
	    if(keycode == '13') {
	    	let search_name = $('#emp_name').val();
	    	let search_data = getEmployeeList(search_name); 
	    	dynamicEmployeeList(search_data,'employee_offer_details');
	    }
	});

//Employee List Append in function here
function dynamicEmployeeList(data,id){
	let empList = '';
	let count = 0; 
	for(let i=0; i<data.length; i++){
		empList += '<div class="col-lg-6 col-md-8 col-sm-12 row-eq-height">';
		empList += '<div class="EmployeeCard equhight employeeList" style="height: 155px;overflow: auto;"> ';
		empList += '<div class="col-sm-3 eoi_align_img">';
		empList += '<div class="col-sm-12"><div class="ep_img">';
		empList += '<img alt="not found" class="" src="'+image_path+data[i].profile+'">';
		empList += '</div></div>'
		empList += '</div>'
		empList += '<div class="col-sm-8 eoi_align_txt">';
		empList += '<p class="ep_name" data-toggle="tooltip" data-placement="left" title="Name" >'+data[i].name+'</p>';
		empList += '<p class="ep_email" data-toggle="tooltip" data-placement="left" title="Company Email" >'+data[i].work_email+'</p>';
		empList += '<p class="ep_designation" data-toggle="tooltip" data-placement="left" title="Role" >'+data[i].role_title+'</p>';
		empList += '<p class="ep_team" data-toggle="tooltip" data-placement="left" title="Team Name" >'+data[i].tname+'</p>';
		empList += '<p class="ep_join" data-toggle="tooltip" data-placement="left" title="Joining Date" >'+data[i].jd+'</p>';
		//empList += '<p>Joined Date : <b>'+data[i].jd+'</b>&nbsp&nbsp&nbsp Generated Date : <b>'+data[i].og+'</b></p>';
		empList += '</div>'
		empList += '<div class="col-sm-1">';
		empList += '<div class="col-sm-12 eoi_align_fonts_pointer" style="display:none">';
		let fname = "TRANSFROM HCMS "+data[i].name+" EOL";
		file_name = fname.split(' ').join('_');
		empList += '<span><i id="'+data[i].file_name+'"  onclick="offerView(this)"  data-toggle="tooltip" data-placement="left" title="View" class="nf nf nf-preview eoi_align_fonts_pointer"></i></span>';
		empList += '<span><i id="'+data[i].file_name+'" data-value="'+data[i].id+'" onclick="offerDownload(this)" data-toggle="tooltip" data-placement="left" title="Download" class="nf nf nf-download eoi_align_fonts_pointer"></i></span>';
		empList += '<span><i id="'+data[i].file_name+'" onclick="offerEmail(['+data[i].id+'])"  data-toggle="tooltip" data-placement="left" title="Email" class="nf nf nf-email eoi_align_fonts_pointer"></i></span>';
		empList += '<span style="display:none"><a id="download-link-'+data[i].id+'" href="'+offer_certificate_path+data[i].file_name+'" download="'+file_name+'">click me</a></span>'
		empList += '</div>'
		empList += '</div>'	
		empList += '</div>'
		empList += '</div>'
	}
	$('#'+id).html(empList);
}

//offer download
function offerDownload(path){
	let get_ids = path.getAttribute("data-value");
	$("#download-link-"+get_ids).get(0).click();
}

//offer email
function offerEmail(getId){
	$.ajax({
		url : "/employee_offer_email_list/",
		type : "POST",
		data : { 'employee_id':getId.toString(),csrfmiddlewaretoken:csrf_data },
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		let res = JSON.parse(json_data);
		if(res.results == 'NTE-E01'){
			alert_lobibox("success", "Offer Document Mailed Successfully.");
		}else{
			alert_lobibox("error", "Some Error from Server Side");
		}
	});
}

//offer view
function offerView(path){
	$('#offer_viewer_id').attr('src',offer_certificate_path+path.id);
	let browser_name = myBrowserFunction();
	if(browser_name == 'Chrome'){
		$('#certificate_view').modal('show');
	}else{
		alert_lobibox("info", "This browser version not supported.Go Chrome");
	}
}

//get data function
function getEmployeeList(status){
	let res_data = []
	$.ajax({
		url : "/employee_offer_list/",
		type : "GET",
		data : {'status':status},
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		let res = JSON.parse(json_data);
		res_data = res.results;
		console.log(res_data)
	});
	return res_data
}

//employee on change values get
$('#employee_list').on('change', function(){
    var selected = $(this).find("option:selected");
    employee_list_values = [];
    selected.each(function(){
    	employee_list_values.push(parseInt($(this).val()));
    });
});

//generate function here
function generateOffer(){
	$('.errorTxt0').html('');
	let form_status = employee_offer_form_validation();
	if(form_status){
		$.ajax({
			url : "/employee_offer_generate/",
			type : "POST",
			data : { 'employee_id':employee_list_values.toString(),csrfmiddlewaretoken:csrf_data },
			timeout : 10000,
			async : false,
		}).done( function(json_data) {
			let res = JSON.parse(json_data);
			let res_data = res.results;
			if( res_data == 'NTE-E01'){
				alert_lobibox("success", "Offer Generated Successfully.");
				employeeOfferList();
				clearOffer();
			}else{
				alert_lobibox("error", "Offer Generated Error.");
				clearOffer();
			}
		});
	}else{
		$('.errorTxt0').html('Select Atleast One Employee')
	}
}

//clear function here
function clearOffer(){
	$("#employee_list").multiselect("deselectAll", false);
	$("#employee_list").multiselect('rebuild');
	employee_list_values = [];
	$('.errorTxt0').html('');
}

//jquery attendance validation
jQuery.validator.addMethod('groupvalueNotEquals', function (value) {
	return (employee_list_values.length != 0);
}, "year require");
$('#employee_offer_form').submit(function(e) {
	e.preventDefault();
}).validate({
	rules: {
		employee_list: {
			groupvalueNotEquals:true,
		},
	},
//	For custom messages
	messages: {
		employee_list: {
			groupvalueNotEquals: "Select Atleast Employee",
		},
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

//form is valid or not
function employee_offer_form_validation()
{
	return $('#employee_offer_form').valid();
}