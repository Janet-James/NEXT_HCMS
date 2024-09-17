$( document ).ready(function() {
	$('[data-toggle="tooltip"]').tooltip();   
	$("#template").prop("disabled", true);
	jobPostDetails({},'all');
	$('#left').trigger('click');
});

//job change function here
$('#job').change(function() {	
	let job_id = $('#job').val();
	if(job_id != 0){
		let datas = { "status":'job','id':job_id}
		dynamicDataFetch('job',datas);
		$("#template").prop("disabled", false);
	}else{
		$('#template').val('0').trigger('change');
	}
})	

//search employee name based on employee list
var elem = document.getElementById('job_post_search');
if(elem){
	elem.addEventListener('keypress', function(e){
		  if (e.keyCode == 13) {
			  var name =  $('#job_post_search').val()
			  if(!name=='')
			  {
				  jobPostDetails({'name': name},'all');
			  }else{
				  jobPostDetails({},'all'); 
			  }		 
		  }
		});	
}

//template change function here
$('#template').change(function() {	
	let temp_id = $('#template').val();
	let job_id = $('#job').val();
	if(temp_id != 0){
		let job_name = $('#job_name').val() || '';
		let jsd = $('#jsd').val() || '';
		let nop = $('#nop').val() || '';
		let job_location = $('#job_location').val() || '';
		let datas = { "status":'template','id':temp_id,'job_id':job_id,'job_name':job_name,'jsd':jsd,'nop':nop,'job_location':job_location }
		dynamicDataFetch('template',datas);
	}else{
		$('#template_file').html('');
	}
})	

//job post details
function jobPostDetails(job_data,status){
	$.ajax({
		url : "/ta_jp_apost_details/",
		type : "GET",
		data : job_data,
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
			let get_data = JSON.parse(json_data);
			let job_data = get_data.data
			if(status == 'all'){
				console.log(job_data)
				jobDetailsDiv(job_data);
			}else{
				if(job_data.length > 0){
					$('#job').val(job_data[0]['job_id']).trigger('change');
					$('#job_name').val(job_data[0]['name']);
					$('#jsd').val(job_data[0]['jsd']);
					$('#nop').val(job_data[0]['nop']);
					$('#job_location').val(job_data[0]['location']);
					$('#template').val(job_data[0]['template_id']).trigger('change');
				}else{
					alert_lobibox("error","This Job Already Approved. So Not Editable.");
				}
			}
	});
}

//job post list view
function jobDetailsDiv(res_datas){
	let verticalViewData = ''
	if (res_datas.length) {  
		for (var i = 0; i < res_datas.length; i++) {
			verticalViewData += '<div class="col-md-12 EmployeeCard equhight employeeList ta_job_opening" id="'
					+ res_datas[i].id
					+ '" onclick="jobRowClick('
					+ res_datas[i].id + ')">' 
			verticalViewData += '<div class="col-md-8">'
			verticalViewData += '<table><tr><td class="etdwidth1">Job Name</td><td class="etdwidth2">:</td><td class="etdwidth3"> <b>' + res_datas[i].name
					+ '</b></td></tr> '; 
			verticalViewData += '<tr><td class="etdwidth1">Job Location</td><td class="etdwidth2">:</td><td class="etdwidth3"> <b>'
					+ res_datas[i].location + '</b></td></tr>';
			
			verticalViewData += '<tr><td class="etdwidth1">Number of Position</td><td class="etdwidth2">:</td><td class="etdwidth3"> <b>'
				+  res_datas[i].nop + '</b></td></tr></table>';
			verticalViewData += '</div>';
			let job_posting_status = ''
			if(res_datas[i].status == '1'){
				job_posting_status = '<span style="color:#da5b5b">Waiting for Your Approval</span>';
			}else if(res_datas[i].status == '2'){
				job_posting_status = '<span style="color:#389641">Approved</span>';
			}else if(res_datas[i].status == '3'){
				job_posting_status = '<span style="color:#4fc9f3">Job Posted</span>';
			}
			verticalViewData += '<div class="col-md-4 ta_job_status_div">'
				verticalViewData += '<div class="">Status</div>';
				verticalViewData += ' <b>'+ job_posting_status  + '</b></div>';
			verticalViewData += '</div>'  
		}
	} else { 
		verticalViewData = "<p class='no_data_found'>No Data Found.</p>" 
	}
	$('#ta_job_posting_details').html(verticalViewData);
}

//job posting row click 
function jobRowClick(id){
	jobPostDetails({'job_id':id},'row')
}

//load function here
function dynamicDataFetch(status,job_data){
	$.ajax({
		url : "/ta_jp_ajob_details/",
		type : "GET",
		data : job_data,
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		let get_data = JSON.parse(json_data);
		if(status == 'template'){
			let template = get_data.template;
			$("#template_file").html($("<iframe />").attr({"srcdoc":template, "id":"iframe","height":"100%" ,"width":"100%" })); 
		}else{
			let job_data = get_data.data
			$('#job_name').val(job_data[0]['job_title']);
			$('#jsd').val(job_data[0]['job_short_description']);
			$('#nop').val(job_data[0]['number_of_positions']);
			$('#job_location').val(job_data[0]['job_location']);
		}
	});
}

//job pre post function here 
function jobPost(){
	let status = job_post_form_form_validation();
	if(status){
		let temp_id = $('#template').val();
		let job_id = $('#job').val();
		let job_name = $('#job_name').val() || '';
		let jsd = $('#jsd').val() || '';
		let nop = $('#nop').val() || '';
		let job_location = $('#job_location').val() || '';
		let job_data = { 'id':temp_id,'job_id':job_id,'job_name':job_name,'jsd':jsd,'nop':nop,'job_location':job_location }
		$.ajax({
			url : "/ta_jp_ajob_post/",
			type : "POST",
			data : job_data,
			timeout : 10000,
			async:false,
		}).done( function(json_data) {
			let result = JSON.parse(json_data);
			console.log(result)
			if(result['data'] == 'NTE-01'){
				alert_lobibox("success","This Job Posting Added and Request Sent to Management.");
			}else if(result['data'] == 'NTE-02'){
				alert_lobibox("success","This Job Approved. Request Sent to Job Posting.");
				function doStuff() {
					location.reload();
					}
				var myTimer = setTimeout(doStuff, 200);
			}else{
				alert_lobibox("error","This Job Posting Failed.");
			}
			jobPostDetails({},'all');
		});
	}
}

//clear conformation
function jobPostClear(){
	$('#job,#template').val('0').trigger('change');
	$("#template").prop("disabled", true);
	$('#job_post_form')[0].reset();
	$('.errormessage').html("");
	$('#left').trigger('click');
}

$('.select2').select2().change(function(){
	$('.errorTxts').html('');
});

//job post form details form validation function here
$('#job_post_form').submit(function(e) {
    e.preventDefault();    
}).validate({
   rules: {
	   job:
	   {
		   required: true,
		   valueNotEquals: true,		     
	   },
	   job_name:
	   {
		   required: true,
	   },
	   jsd:
	   {
		   required: true,
	   },
	   nop:
	   {
		   required: true,
	   },
	   job_location:
	   {
		   required: true,
	   },
	   template:
	   {
		   required: true,
		   valueNotEquals: true,		     
	   },
   },
   //For custom messages
   messages: {
	   job:
	   {
		   required: "Select Job",
		   valueNotEquals: "Select Valid Job",		     
	   },
	   job_name:
	   {
		   required: "Enter Job Name",
	   },
	   jsd:
	   {
		   required: "Enter Job Short Description",
	   },
	   nop:
	   {
		   required: "Enter Number of Position",
	   },
	   job_location:
	   {
		   required: "Enter Job Location",
	   },
	   template:
	   {
		   required: "Select Template",
		   valueNotEquals: "Select Valid Template",		     
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

//job post form validations here
function job_post_form_form_validation(){	
	return $('#job_post_form').valid();
}

//get form values function here
function getFormValues(formId){
	var formData= $(formId).serializeArray()
	var form_result_data ={} 
	formData.map(data => {form_result_data[data['name']] =data['value'] })
	return form_result_data
}

//jquery validation
jQuery.validator.addMethod('valueNotEquals', function (value) {
    return (value != '0');
}, "country required");

//job posting preview
function jobPostPreView(){
	let status = job_post_form_form_validation();
	if(status){
		let temp_id = $('#template').val();
		let job_id = $('#job').val();
		let job_name = $('#job_name').val() || '';
		let jsd = $('#jsd').val() || '';
		let nop = $('#nop').val() || '';
		let job_location = $('#job_location').val() || '';
		let job_data = { 'id':temp_id,'job_id':job_id,'job_name':job_name,'jsd':jsd,'nop':nop,'job_location':job_location }
		$.ajax({
			url : "/ta_jp_rajob_post/",
			type : "POST",
			data : job_data,
			timeout : 10000,
			async:false,
		}).done( function(json_data) {
			let result = JSON.parse(json_data);
			if(result['data'] == 'NTE-02'){
				if(myBrowserFunction() == 'Chrome'){
					let pdf = template_path+result['pdf_name'];
					let img = template_path+result['img_name'];
					$('#job_posting_pdf_div').attr('src', pdf);
					$('#ta_job_posting_pdf').attr('href', pdf);
					$('#job_posting_img_div').attr('src', img);
					$('#ta_job_posting_img').attr('href', img);
					$('#job_posting_preview').modal('show');
				}else{
					alert_lobibox("error","This Browser Not Supported.");
				}
				
			}else{
				alert_lobibox("error","This Job Posting Preview Failed.");
			}
			jobPostDetails({},'all');
		});
	}
}

//jpg download
$('#jpg_download').click(function(){
		$('#ta_job_posting_img')[0].click();
});

//pdf download
$('#pdf_download').click(function(){
		$('#ta_job_posting_pdf')[0].click();
});