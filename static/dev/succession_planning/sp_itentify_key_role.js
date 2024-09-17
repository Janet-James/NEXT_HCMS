var res_emp_datas;
var getStageID = 0;
//sp key and role ready function here
$(document).ready(function(){
	$("#rangeQuestion").ionRangeSlider({
	    type: 'single',
	    min: 0,
	    max: 100,
	    hide_min_max: true,
	    from: 0,
	    interval: 10,
	    min_interval: 10,
	});
	//pluginCall();
	$("#sp_key_roles").select2({
		placeholder: "--- Select Role---",
		width: '100%'
	});
	$(".select2-search__field").attr('placeholder',"-- Select Role--");
	spKeyRoleSuccess();//dashboard check
});

var datas = getFormValues("#sp_key_role_test_form");
var	csrf_data = datas.csrfmiddlewaretoken;

//add role
function getRoleData(){
	if(sp_key_role_test_form_validation()){
			data = { csrfmiddlewaretoken:csrf_data }
			data['org_id'] = $('#organization').val();
			data['org_unit_id'] = $('#organization_unit').val();
			data['org_emp_id'] = $('#organization_employee').val();
			data['role_id'] = $('#sp_key_roles').val().toString();
			return data
	}
}

//role add in server
function spKeyRoleAdd(){
	var role_datas = getRoleData();  
	console.log("---role_datas----",role_datas)
	$.ajax({ 
		url : '/sp_key_role_add/', 
		type : 'POST',  
		data : role_datas, 
		timeout : 10000, 
		async : false, 
	}).done(function(json_data) {    
		var data = JSON.parse(json_data);
		if (data['status_id'] != 'NTE05') { 
			alert_lobibox("success", "Role Mapped To This Employee Now You Can Start Test");
			spKeyRoleCancel();
		}else{
			alert_lobibox("error", "Already Role Mapped To This Employee");
		}
	});
}

//employee get role details
function roleQuestionGetDetails(emp_id){
	var res_datas;
	$.ajax({ 
		url : '/sp_key_role_details/', 
		type : 'POST',  
		data : { 'emp_id':emp_id, csrfmiddlewaretoken:csrf_data  }, 
		timeout : 10000, 
		async : false, 
	}).done(function(json_data) {    
		data = JSON.parse(json_data);
		if(emp_id != 0){
			res_emp_datas = data.datas[0];
			res_datas = res_emp_datas;
		}else{
			res_datas = data.datas
		}
	});
	return res_datas;
}

//org emp change
$('#organization_employee').on('change', function() {
	  var emp_id = this.value;
	  if( emp_id != 0 ){
		  var data = roleQuestionGetDetails(emp_id)
		  var role_datas = data.role_stage || [];
		  var role_ids = [];
		  for(let i=0; i<role_datas.length; i++){
			  role_ids.push(role_datas[i].role_id);
		  }
		  if(role_ids.length > 0){
			  $('#sp_key_roles').val(role_ids).trigger("change");
		  }else{
			  $('#sp_key_roles').val(role_ids).trigger("change");
			  $("#sp_key_roles").select2({
			  	placeholder: "--- Select Role---",
			  	width: '100%'
			  });
		  }
		  console.log(role_datas,"------dropdown data-------",role_ids)
		  profileGridDiv();//profile div Show 
	  }
	});

//profile grid show
function profileGridDiv(){
	let profileDetails = res_emp_datas['emp_details'];
	if(profileDetails.length > 0){
		$('#profile').attr("src",image_path+profileDetails[0].image); 
		$('#name').html(profileDetails[0].name);
		$('#position').html(profileDetails[0].role);
		$('#email').html(profileDetails[0].email);
		$('#mobile').html(profileDetails[0].mobile);
		$('#country').html(profileDetails[0].country);
		$('#date').html(profileDetails[0].doj);
		$('#org').html(profileDetails[0].org);
		$('#org_unit').html(profileDetails[0].org_unit);
		$('#divison').html(profileDetails[0].team);
		$('#profile_grid').addClass('spActive');
	}
}

//function role add
function spKeyRoleTestStart(){
	if(sp_key_role_test_form_validation()){
		keyQuestionBtn();
		//keyRoleQuestions();
		$('#sp_key_role_title').html('Identify Key Roles Test');
		$('#sp_key_role_bodys').html('Learning & Development Body');
		$('#spKeyRoleModal').modal('show');
		$('#sp_key_role_result,#profile_grid').removeClass('spActive');
	}else{
		return false;
	}
}

//function question stage list
function keyQuestionBtn(){
	let  questionBtn = res_emp_datas['role_stage'];
	let questionStageBtn = '';
	if(questionBtn != null){
		for(let i=0; i<questionBtn.length; i++){
			questionStageBtn += '<span id='+questionBtn[i].role_id+' onclick="stageBtn('+questionBtn[i].role_id+')" class="spanQuestionStage">'+questionBtn[i].role_title+'</span>  <span class="stageSplit">/<span>';
		}
		$('#question_btn_generate').html(questionStageBtn);
		let stageFirstID = questionBtn[0].role_id
		stageBtn(stageFirstID);//test start first stage active
		$('#sp_key_role_body').show();
		$('#sp_key_role_body1').hide();
	}else{
		$('#sp_key_role_body').hide();
		$('#sp_key_role_body1').show();
	}
}

//test completed click function here
function roleTestCompleted(){
	$('#spKeyRoleModal').modal('hide');
	spKeyRoleSuccess();//dashboard check
	spKeyRoleCancel();//clear function call
	checkBxAll = [];
	checkBx = {};
	totNum = 0;
	getStageID = 0;
}

//btn question generate
function stageBtn(getRoleId){
	$('.spanQuestionStage').removeClass('stageActive');
	$('#'+getRoleId).addClass('stageActive');
	getStageID = getRoleId;
	keyRoleQuestions(getRoleId);
}

//show success key roles
function spKeyRoleSuccess(){
	$('#sp_key_role_result').addClass('spActive');
	let chartGenerateData = roleQuestionGetDetails(0);
	let chartLen = chartGenerateData.length;
	if(chartLen > 0){
		//chart div creation
		$('#role_count').html('Top - '+chartLen+' (Critical Roles)');
		let chartDiv = '';
		for(let i=0; i<chartLen; i++ ){
			chartDiv += '<div class="col-md-4"><h3>'+chartGenerateData[i].role_title + '<span class="tot_avg"> (Maximum - '+chartGenerateData[i].tot_avg+')<span></h3><div class="total-score" id="chart-'+chartGenerateData[i].key_role_id+'"></div></div>'
		}
		$('#chartDivGenerate').html(chartDiv);
		//chart generation
		for(let j=0; j<chartLen; j++ ){
			let chartDataName = chartGenerateData[j].emp_name;
			let chartDataAvg = chartGenerateData[j].avg;
			let chart_result_data = [];
			let nameLenth = chartDataName.length;
			let chartDivId = 'chart-'+chartGenerateData[j].key_role_id;
			let colors = [
			              ['#d5fcde','#86d6fb'],
			              ['#d97df0','#00baff'],
			              ['#2de6c8','#fa8e90'],
			              ['#53c6fa','#d97df0'],
			              ['#f6d167','#36ddd5'],
			              ['#53c6fa','#fcaa7d'],
			              ['#52c7f8','#eb8ec7'],
			              ['#d5fcde','#86d6fb'],
			              ['#d97df0','#00baff'],
			              ['#2de6c8','#fa8e90']	
			              ]
			if(nameLenth > 0){
				for(let k=0; k<nameLenth; k++ )
				{
					let setDatas = {};
					setDatas['country'] = chartDataName[k];
					setDatas['avg_mark'] = chartDataAvg[k];
					setDatas['color'] = 'red';
					setDatas['max_mark'] = 100;
					chart_result_data.push(setDatas);
			    }
				chartGenerate(chartDivId,chart_result_data,colors[j])//chart generations function call
			}else{
				$('#'+chartDivId).html('<p class="record_not_found"><b>Record Not Found...</b></p>');
			}
		}
		
	}else{
		$('#chartDivGenerate').html('<div class="col-sm-12 col-lg-offset-4 col-md-4" ><p class="record_not_found"><b>Record Not Found...</b></p></div>');
	}
}

//clear function 
function spKeyRoleCancel(){
	$('#organization,#organization_unit,#organization_division,#organization_employee').val('0').trigger("change");
	$('#sp_key_roles').val(null).trigger("change");
	$("#sp_key_roles").select2({
		placeholder: "--- Select Role---",
		width: '100%'
	});
	spKeyRoleSuccess();//dashboard check
	$('#profile_grid').removeClass('spActive');
}

//key role question and answer
function keyRoleQuestions(getRoleId){
	$('#questionTitle').html("Project Manager");
	let activeNumId = 1;
	let questionList = res_emp_datas['role_question'];
	let questionLength = questionList.length;
	totNum = questionLength;
	$('#totalquestion').html("/ "+questionLength);
	for(let i=1; i<=questionLength; i++){
		question_num += '<div class="que_no que_no'+i+'" id="'+questionList[i-1].id+'" data-number="'+(i)+'" data-question="'+questionList[i-1].name+'">'+(i)+'</div>';
	}
	$('#question_num').html(question_num);
	pluginCall();//plug in call function here
	$('#question_num div.que_no').click(function(e) {
		questionSelect(e.target);
	});
	$('.que_no'+activeNumId).trigger('click');
}

//check box pre active select
function chkBoxPreActvie(data){
	var qId = $(data).attr('id');
	if(checkBxAll.length){
		checkBxAll.forEach(function(item) {
			if (item['key'] === qId) {
				$('#'+item['check_key']).prop('checked', true);
				var summernoteTxt = $('.summernote').summernote('code');
				console.log(item['check_content']+"--------------------"+summernoteTxt)
				$('.summernote').summernote('code', item['check_content']);
			}
		});
	}else{
		return true;
	}
}

var content ;
//selected question number
function questionSelect(e){
	console.log(e);
	content = $(e);
	var activeQuestionTxt = $(e).attr('data-question');
	var activeQuestionNo = $(e).attr('data-number');
	var activeQusetonId = $(e).attr('id');
	if(activeQuestionNo >= 1 && activeQuestionNo <= 5){
		 $('#questionTitle').html('<b>Organizational Impact of vacancy - (Provide Rating on Scale of 3 : 1 - Low Impact; 2 - Medium Impact; 3 - High Impact)</b>');
		 $('#checkbox1').html('Low Impact');
		 $('#checkbox2').html('Medium Impact');
		 $('#checkbox3').html('High Impact');
	}else{
		 $('#questionTitle').html('<b>Difficulty of filling vacancy (Provide Rating on Scale of 3 : 1 - Easy; 2 - Medium ; 3 - Hard)</b>');
		 $('#checkbox1').html('Easy');
		 $('#checkbox2').html('Medium');
		 $('#checkbox3').html('Hard');
	}
	$('.slick-slide').removeClass('slick-current');
	$(e).parent().parent().addClass('slick-current');
	$('#qeustionNo').html(activeQuestionNo);
	$('#question_name').html(activeQuestionTxt);
	chackBoxValue();
	//check box value assigned
	if(checkBx['key']){
		var status = 0;
	    var summernoteTxt = $('.summernote').summernote('code');
		checkBxAll.forEach(function(item) {
			  if (checkBx['key'] === item.key) {
				  item['check_key'] = checkBx['check_key'];
				  item['check_value'] = checkBx['check_value'];
				  item['check_content'] = summernoteTxt;
				  status = 1;
			  }
			});
		if(status == 0){
			checkBx['check_content'] = summernoteTxt
			checkBxAll.push(checkBx);
		}
		checkBx = {};
		console.log("-------------",checkBxAll);
	}
	$('.summernote').summernote('code','');
	chkBoxPreActvie(e);//check box pre active checked
	rangeSlider();//rangeslider function call
	if(checkBxAll.length == (totNum-1) || checkBxAll.length == totNum){
		$('#testeSubmit').show();
	}else{
		$('#testeSubmit').hide();
	}
}

//get mark details
function getMarkDetails(totNum){
	var check_value = 0;
	checkBxAll.forEach(function(item) {
		check_value += parseFloat(item['check_value']);
	});
	console.log(check_value)
	return ((check_value/totNum)*100);
}

//test submit
function testSubmit(){
	$('.que_no'+(totNum-1)).trigger('click');
	if(checkBxAll.length == totNum){
		let avg = parseInt(getMarkDetails(totNum));
		let stage_id = getStageID;
		let emp_id = $('#organization_employee').val();
		let ques_answer = JSON.stringify({ 'ques_ans':checkBxAll });
		let data = { 'ques_answer':ques_answer,'stage_id':stage_id,'org_emp_id':emp_id,'avg':avg,'result_id':'result',csrfmiddlewaretoken:csrf_data  }
		let res_status = stageQuestionResult(data);
		if (data['status_id'] != 'NTE04') { 
			alert_lobibox("success", "This Role Test Completed");
			roleQuestionGetDetails(emp_id);//submit after call function here
			chackBoxValue();//clear check box values
			checkBxAll = [];//empty the all checkbox values
			spKeyRoleTestStart();//Another Stage Test Start
		}else{
			alert_lobibox("error", "Test Error");
		}
	}else{
		var attenQuest = checkBxAll.length;
		alert_lobibox("error", "Some Question is Missing ..You Attend Question Number was "+attenQuest);
	}
}

//stage result add 
function stageQuestionResult(data){
	console.log("--------result data---------",data)
	var update_staus;
	$.ajax({ 
		url : '/sp_key_role_add/', 
		type : 'POST',  
		data : data, 
		timeout : 10000, 
		async : false, 
	}).done(function(json_data) {    
		update_staus = JSON.parse(json_data);
	});
	return update_staus
}

//range slider
function rangeSlider(){
	// Save slider instance to var
	var slider = $("#rangeQuestion").data("ionRangeSlider");
	// Call sliders update method with any params
	var val = parseInt(((checkBxAll.length)/totNum)*100) || 0;
	slider.update({
		  	type: 'single',
		    min: 0,
		    max: 100,
		    hide_min_max: true,
		    from: val,
		    interval: 10,
		    min_interval: 10,
	});
}

//check box values change
function chackBoxValue(){
	$(".checkBoxClass").prop('checked', false);
}

var checkBxAll = [];
var checkBx = {};
var totNum = 0;
$("input[type='checkbox']").change(function (e) { 
	checkBx = {};
	var cbx = e.target;
	$(".checkBoxClass").prop('checked', false);
    $(cbx).prop('checked', true);
    checkId = $(cbx).attr('id');
    checkVal = $(cbx).attr('value');
    var qId = content.attr('id');
    checkBx['key'] = qId;
    checkBx['check_key'] = checkId;
    checkBx['check_value'] = checkVal;
   
});

//plugin call function here
function pluginCall(){
	//slick renitilized
	if ($('#question_num').hasClass('slick-initialized')) {
	        $('#question_num').slick('unslick');
	    }
	$('.summernote').summernote({
		placeholder : '',
		tabsize : 2,
		height : 200
	});
	$("#question_num").slick({
		dots : false,
		infinite : false,
		slidesToShow : 5,
		vertical : true,
		centerMode : false,
		verticalSwiping : true,
		slidesToScroll : 1,
	});
	$('.slick-prev').trigger('click');
	$('.slick-slide ').removeClass('slick-current');
	$('.slick-next').on('click', function (e) {
		$('.slick-slide').removeClass('slick-current');
		$(content).parent().parent().addClass('slick-current');
	});
	$('.slick-prev').on('click', function (e) {
		$('.slick-slide').removeClass('slick-current');
		$(content).parent().parent().addClass('slick-current');
	});
}

//chart code here
function chartGenerate(id,datas,color){
	var chart = AmCharts.makeChart(id, {
	    "theme": "light",
	    "type": "serial",
	    "dataProvider": datas,
	    "valueAxes": [{
	        "unit": "%",
	        "position": "left",
	    }],
	    "startDuration": 1,
	    "graphs": [{
	        "balloonText": "Test Taken Result: <b>[[value]]</b> %",
	        "fillAlphas": 0.9,
	        "lineAlpha": 0.2,
			"fillColors": color[0],
	        "title": "2004",
	        "type": "column",
	        "valueField": "avg_mark"
	    }, {
	        "balloonText": "Test Maximum Mark : <b>[[value]]</b> %",
	        "fillAlphas": 0.9,
	        "lineAlpha": 0.2,
	        "title": "2005",
			"fillColors": color[1],
	        "type": "column",
	        "clustered":false,
	        "columnWidth":0.5,
	        "valueField": "max_mark"
	    }],
	    "plotAreaFillAlphas": 0.1,
	    "categoryField": "country",
	    "categoryAxis": {
	        "gridPosition": "start"
	    },
	    "export": {
	    	"enabled": false
	     }

	});
} 

//jquery attendance validation
jQuery.validator.addMethod('valueNotEquals', function (value) {
  return (value != '0');
}, "year required");

$('.select2').select2().change(function(){
	$('.errormessage').html('');
});

// Promotion Request validations here
$('#sp_key_role_test_form').submit(function(e) {
  e.preventDefault();
}).validate({
	rules: {
		organization:{
			valueNotEquals: true, 
		},
		organization_unit:{
			valueNotEquals: true, 
		},
		organization_division:{
			valueNotEquals: true,
		},
		organization_employee:{
			valueNotEquals: true,
		},
		sp_key_roles: {
			required : true,
			valueNotEquals: true,
		}
	},
 //For custom messages
 messages: {
	 organization:{
		 valueNotEquals: "Select Organization", 
	 },
	 organization_unit:{
		 valueNotEquals: "Select Organization Unit", 
	 },
	 organization_division:{
		 valueNotEquals: "Select Organization Division", 
	 },
	 organization_employee:{
		 valueNotEquals: "Select Division Employee", 
	 },
	 sp_key_roles: {
		 required: "Select Atleast One Role",
		 valueNotEquals: "Select Atleast One Role",
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
function sp_key_role_test_form_validation()
{
	return $('#sp_key_role_test_form').valid();
}
