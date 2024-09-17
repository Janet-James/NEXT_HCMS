//post function here
$("#submit_button").click(function organizeinput(){
	if($('#post_content')[0].checkValidity() === false){
		alert_lobibox("info","All fields are required");
		return null;
	}
	if (typeof IN.User === "undefined"){
		alert_lobibox("error","You have to login first. If you don't see a login button, check the developer console for an error message.");
		return null;
	}
	if (IN.User.isAuthorized() != true){
		alert_lobibox("error","You have to login to linkedin before you can post content.");
		return null;
	}

	var values = new Array();
	//comment, title, description, image-content, image-url
	// Get the parameters as an array
	values = $(":input").serializeArray();
	var postcontent = new Array();
	postcontent = {"comment": values[1].value, "content": {"title": values[2].value,"description": values[3].value,"submitted-url": values[4].value,"submitted-image_url": values[5].value},"visibility": {"code": "anyone"} };
	postcontent = JSON.stringify(postcontent);
	shareContent(postcontent);
});

//on linked load function here
function onLinkedInLoad() {
	IN.Event.on(IN, "auth", organizeinput);
}

//Handle the successful return from the API call
function onSuccess(data) {
	console.log(data);
	alert_lobibox("success", "Job Post Successful.");
}

//Handle an error response from the API call
function onError(error) {
	console.log(error);
	alert_lobibox("error","Oh no, something went wrong. Check the console for an error log.(Today Linked IN API Call Limit Over.Try Tomorrow)");
}

//Use the API call wrapper to share content on LinkedIn
function shareContent(pcontent) {
	IN.API.Raw("/people/~/shares?format=json")
	.method("POST")
	.body(pcontent)
	.result(onSuccess)
	.error(onError);
}

//logout function here
function onLogout() {
	IN.User.logout();
	$('#signout').hide();
	$('#signin').show();
}

//on linked load function here
function onLinkedInLoad() {
	IN.UI.Authorize().place();      
	IN.Event.on(IN, "auth", function () { onLogin(); });
}

//on login function here
function onLogin(){
	$('#signout').show();
	$('#signin').hide();
}

//job posting list start 
var job_data = []
//get data function
function getJobList(status,val){
	$.ajax({
		url : "/api/v1/ta/job_openings/",
		type : "GET",
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		let res = JSON.parse(json_data);
		data = res.data;
		job_data = data
		console.log(data)
		if(data.length > 0){
			let jobList = '';
			let count = 0; 
			for(let i=0; i<data.length; i++){
				jobList += '<div class="col-lg-6 col-md-8 col-sm-12 div_padding" data-toggle="tooltip" data-placement="bottom" title="This Job Posting to Linked In" onclick="jobSelect('+i+')">';
				jobList += '<div class="ep_name1" >Title : '+data[i].title+'</div>';
				jobList += '<div class="ep_name2" >Work Experience : <span>'+data[i].work_experience+'</span></div>';
				jobList += '<div class="ep_name3" >Location : <span>'+data[i].job_location+'</span></div>';
				jobList += '<div class="ep_name3" >Date Opened : <span>'+data[i].date_opened+'</span></div>';
				jobList += '<div class="ep_name3" >Target Date : <span>'+data[i].target_date+'</span></div>';
				jobList += '</div>';
			}
			$('#job_posting_details').html(jobList);
		}else{
			$('#job_posting_details').html('<div class="col-md-12"><h3 style="text-align: center;color:#e73d4a;">No data available.</h3></div>');
		}
	});
}

//select job details 
function jobSelect(index){
	console.log(job_data[index]);
	$('#comment,#title,#description,#image_content,#image_url').val('');
	$('.posting_title').html('');
	$('#comment').val(job_data[index].job_location);
	$('#title').val(job_data[index].title);
	$('#description').val(job_data[index].job_description);
	$('#image_content').val('http://ui.nexttechnosolutions.com/next_website/joinus.html');
	$('#image_url').val('http://ui.nexttechnosolutions.com/next_website/joinus.html');
	$('.posting_title').html('Job ');
	$('#job_post').modal('show');
}

//post to linked in
function linkedInPost(){
	$('#comment,#title,#description,#image_content,#image_url').val('');
	$('.posting_title').html('');
	$('#job_post').modal('show');
}

//get job detail function here
getJobList();
//job posting list end

