$(document).ready(function () {
	var starClicked = false;
	$.ajax({
		type:"POST",
		url: "/objectives_fetch/",
		success: function (json_data) {
			var data = json_data
			if(json_data.status=='Success'){
				var financial_list = data.Financial
				for(var i =0;i<financial_list.length;i++){
					var statergic_objectives = Object.keys(financial_list[i])
					for(var j =0;j<statergic_objectives.length;j++){
						var obj_list = statergic_objectives[j]
						var obj_value_list = Object.values(financial_list[i])
						obj_value_list[j].map(a=>{
							finance_kpi_target_value = a.kpi_target_value
						})
					}
				}
				var customer_list = data.Customer
				for(var i =0;i<customer_list.length;i++){
					var cust_statergic_objectives = Object.keys(customer_list[i])
					for(var j =0;j<cust_statergic_objectives.length;j++){
						var cust_obj_list = cust_statergic_objectives[j]
						var cust_obj_value_list = Object.values(customer_list[i])
						cust_obj_value_list[j].map(b=>{
							cust_kpi_target_value = b.kpi_target_value
						})
					}
				}
			}
		}
	});


	$("#teamChange").change(function(){
		$.ajax({
			type:"GET",
			url: "/talent_matrix_view/",
			data:{'team_id':$(this).val()},
			success: function (json_data) {
				$("#hhDiv ul").html("");
				$("#hmDiv ul").html("");
				$("#hlDiv ul").html("");
				$("#mhDiv ul").html("");
				$("#mmDiv ul").html("");
				$("#mlDiv ul").html("");
				$("#llDiv ul").html("");
				$("#lmDiv ul").html("");
				$("#lhDiv ul").html("");
				$('#hhLen').text(0);
				$('#hmLen').text(0);
				$('#hlLen').text(0);
				$('#mhLen').text(0);
				$('#mmLen').text(0);
				$('#mlLen').text(0);
				$('#lhLen').text(0);
				$('#lmLen').text(0);
				$('#llLen').text(0);
				if(json_data['status']=="Success"){
					$('#hhLen').text(json_data['talentMatrix']['HH'].length);
					$('#hmLen').text(json_data['talentMatrix']['HM'].length);
					$('#hlLen').text(json_data['talentMatrix']['HL'].length);
					$('#mhLen').text(json_data['talentMatrix']['MH'].length);
					$('#mmLen').text(json_data['talentMatrix']['MM'].length);
					$('#mlLen').text(json_data['talentMatrix']['ML'].length);
					$('#lhLen').text(json_data['talentMatrix']['LH'].length);
					$('#lmLen').text(json_data['talentMatrix']['LM'].length);
					$('#llLen').text(json_data['talentMatrix']['LL'].length);
					if(json_data['talentMatrix']['HH'].length!=0){
						for(i=0;i<json_data['talentMatrix']['HH'].length;i++){
							$("#hhDiv ul").append('<li class="tooltip-hvr tooltip-effect">'+
									'<span class="tooltip-item img-overlay">'+
									'<img src="http://tst-hcms.nexttechnosolutions.int/media/user_profile/'+json_data['talentMatrix']['HH'][i].image+'"></span>'+
									'<span class="tooltip-content clearfix">'+
									'<span class="tooltip-text">'+json_data['talentMatrix']['HH'][i].name+'</span></span></li>')
						}
					}
					if(json_data['talentMatrix']['HM'].length!=0){
						for(i=0;i<json_data['talentMatrix']['HM'].length;i++){
							$("#hmDiv ul").append('<li class="tooltip-hvr tooltip-effect">'+
									'<span class="tooltip-item img-overlay">'+
									'<img src="http://tst-hcms.nexttechnosolutions.int/media/user_profile/'+json_data['talentMatrix']['HM'][i].image+'"></span>'+
									'<span class="tooltip-content clearfix">'+
									'<span class="tooltip-text">'+json_data['talentMatrix']['HM'][i].name+'</span></span></li>')
						}

					}
					if(json_data['talentMatrix']['HL'].length!=0){
						for(i=0;i<json_data['talentMatrix']['HL'].length;i++){
							$("#hlDiv ul").append('<li class="tooltip-hvr tooltip-effect">'+
									'<span class="tooltip-item img-overlay">'+
									'<img src="http://tst-hcms.nexttechnosolutions.int/media/user_profile/'+json_data['talentMatrix']['HL'][i].image+'"></span>'+
									'<span class="tooltip-content clearfix">'+
									'<span class="tooltip-text">'+json_data['talentMatrix']['HL'][i].name+'</span></span></li>')
						}
					}
					if(json_data['talentMatrix']['MH'].length!=0){
						for(i=0;i<json_data['talentMatrix']['MH'].length;i++){
							$("#mhDiv ul").append('<li class="tooltip-hvr tooltip-effect">'+
									'<span class="tooltip-item img-overlay">'+
									'<img src="http://tst-hcms.nexttechnosolutions.int/media/user_profile/'+json_data['talentMatrix']['MH'][i].image+'"></span>'+
									'<span class="tooltip-content clearfix">'+
									'<span class="tooltip-text">'+json_data['talentMatrix']['MH'][i].name+'</span></span></li>')
						}
					}
					if(json_data['talentMatrix']['MM'].length!=0){
						for(i=0;i<json_data['talentMatrix']['MM'].length;i++){
							$("#mmDiv ul").append('<li class="tooltip-hvr tooltip-effect">'+
									'<span class="tooltip-item img-overlay">'+
									'<img src="http://tst-hcms.nexttechnosolutions.int/media/user_profile/'+json_data['talentMatrix']['MM'][i].image+'"></span>'+
									'<span class="tooltip-content clearfix">'+
									'<span class="tooltip-text">'+json_data['talentMatrix']['MM'][i].name+'</span></span></li>')
						}
					}
					if(json_data['talentMatrix']['ML'].length!=0){
						for(i=0;i<json_data['talentMatrix']['ML'].length;i++){
							$("#mlDiv ul").append('<li class="tooltip-hvr tooltip-effect">'+
									'<span class="tooltip-item img-overlay">'+
									'<img src="http://tst-hcms.nexttechnosolutions.int/media/user_profile/'+json_data['talentMatrix']['ML'][i].image+'"></span>'+
									'<span class="tooltip-content clearfix">'+
									'<span class="tooltip-text">'+json_data['talentMatrix']['ML'][i].name+'</span></span></li>')
						}
					}
					if(json_data['talentMatrix']['LH'].length!=0){
						for(i=0;i<json_data['talentMatrix']['LH'].length;i++){
							$("#lhDiv ul").append('<li class="tooltip-hvr tooltip-effect">'+
									'<span class="tooltip-item img-overlay">'+
									'<img src="http://tst-hcms.nexttechnosolutions.int/media/user_profile/'+json_data['talentMatrix']['LH'][i].image+'"></span>'+
									'<span class="tooltip-content clearfix">'+
									'<span class="tooltip-text">'+json_data['talentMatrix']['LH'][i].name+'</span></span></li>')
						}
					}
					if(json_data['talentMatrix']['LM'].length!=0){
						for(i=0;i<json_data['talentMatrix']['LM'].length;i++){
							$("#lmDiv ul").append('<li class="tooltip-hvr tooltip-effect">'+
									'<span class="tooltip-item img-overlay">'+
									'<img src="http://tst-hcms.nexttechnosolutions.int/media/user_profile/'+json_data['talentMatrix']['LM'][i].image+'"></span>'+
									'<span class="tooltip-content clearfix">'+
									'<span class="tooltip-text">'+json_data['talentMatrix']['LM'][i].name+'</span></span></li>')
						}
					}
					if(json_data['talentMatrix']['LL'].length!=0){
						for(i=0;i<json_data['talentMatrix']['LL'].length;i++){
							$("#llDiv ul").append('<li class="tooltip-hvr tooltip-effect">'+
									'<span class="tooltip-item img-overlay">'+
									'<img src="http://tst-hcms.nexttechnosolutions.int/media/user_profile/'+json_data['talentMatrix']['LL'][i].image+'"></span>'+
									'<span class="tooltip-content clearfix">'+
									'<span class="tooltip-text">'+json_data['talentMatrix']['LL'][i].name+'</span></span></li>')
						}
					}
				}
				$("#performance_table tbody").html("");
				if(json_data['performanceRating']!=undefined){
				for(i=0;i<json_data['performanceRating'].length;i++){
					
					$("#performance_table tbody").append("<tr id='performanceRating"+i+"'>"+
							"<td>"+json_data['performanceRating'][i].name+"</td>"+
							"<td>"+
							"<div class='rating' data-vote='0'>"+
							"<div class='star hidden'>"+
							"<span class='full' data-value='0'></span>"+
							"<span class='half' data-value='0'></span>"+
							"</div>"+
							"<div class='star'>"+
							"<span class='full' data-value='1'></span>"+
							"<span class='half' data-value='0.5'></span> <span"+
							"<span class='selected'></span>"+
							"</div>"+
							"<div class='star'>"+
							"<span class='full' data-value='2'></span> "+
							"<span class='half' data-value='1.5'></span> "+
							"<span class='selected'></span>"+
							"</div>"+
							"<div class='star'>"+
							"<span class='full' data-value='3'></span> "+
							"<span class='half' data-value='2.5'></span> "+
							"<span class='selected'></span>"+

							"</div>"+
							"<div class='star'>"+
							"<span class='full' data-value='4'></span> " +
							"<span class='half' data-value='3.5'></span> " +
							"<span class='selected'></span>"+
							"</div>"+
							"<div class='star'>"+
							"<span class='full' data-value='5'></span> " +
							"<span class='half' data-value='4.5'></span> " +
							"<span class='selected'></span>"+
							"</div>"+

							"</div>"+
							"</td>"+
					"</tr>")
					$('#performanceRating'+i+' .rating .star').each(function() {
						$(this).addClass("animate")
						if($(this).find('.full').data('value')<=json_data['performanceRating'][i].score){
							$(this).find('.full').addClass("star-colour")
						}
						if($(this).find('.half').data('value')<=json_data['performanceRating'][i].score){
							$(this).find('.half').addClass("star-colour")
						}
					})
					}
				}
			}
		})
	})
});

//Particular dashboard load function
function dashboard_changes(logged_user_role) {
	var currurl = window.location.href;
	var data = currurl.split('/');
	if (logged_user_role == "Manager") {
		var actionurl = currurl.replace(data[3]+'/','ta_mgmd/');
		window.location.href = actionurl;
	} else if (logged_user_role == "HR") {
		var actionurl = currurl.replace(data[3]+'/','ta_userd/');
		window.location.href = actionurl;
	} /*else if (logged_user_role == "Customer") {
		var actionurl = currurl.replace(data[3]+'/','ta_td/');
		window.location.href = actionurl;
	}*/
}



