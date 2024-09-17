//04-JUL-2018 || SMI || Ready Function
$( document ).ready(function() {
	$("#str_analysis_steps").css("display", "none");
    $("#sys_analysis_steps").css("display", "none");
	$("#wf_strgy_analysis_div").hide();
	$("#wf_struc_analysis_div").hide();
	$("#wf_systm_analysis_div").hide();
});

//04-JUL-2018 || KAV || Workforce Planning  - Steps change based on button click function
function step_change(id)
{
	if(id == "wpf_strategy_analysis")
	{
		$("#steps_div_title").text('Strategy Analysis');
		$("#stg_analysis_steps").css("display", "block");
		$("#str_analysis_steps").css("display", "none");
		$("#sys_analysis_steps").css("display", "none");
	}
	else if(id == "wpf_structure_analysis")
	{
		$("#steps_div_title").text('Structure Analysis');
		$("#stg_analysis_steps").css("display", "none");
		$("#str_analysis_steps").css("display", "block");
		$("#sys_analysis_steps").css("display", "none");
	}
	else if(id == "wpf_system_analysis")
	{
		$("#steps_div_title").text('System Analysis');
		$("#sys_analysis_steps").css("display", "block");
		$("#stg_analysis_steps").css("display", "none");
		$("#str_analysis_steps").css("display", "none");
	}
}

//05-JUL-2018 || SMI || Go To Mode Selection Screen Function
function goto_mode_selection(){
	$("#wf_analysis_modes_div").show();
	$("#wf_analysis_div").hide();
}

//04-June-2018 || KAV || Workforce Planning  - Form Display Based On step
function step_click(id){
	$("#wf_analysis_modes_div").hide();
	$("#wf_analysis_div").show();
	if($("#"+id).hasClass("stg_step")){
		$("#wf_strgy_analysis_div").show();
		$("#wf_struc_analysis_div").hide();
		$("#wf_systm_analysis_div").hide();
	} else if($("#"+id).hasClass("str_step")) {
		$("#wf_strgy_analysis_div").hide();
		$("#wf_struc_analysis_div").show();
		$("#wf_systm_analysis_div").hide();
	} else if($("#"+id).hasClass("sys_step")){
		$("#wf_strgy_analysis_div").hide();
		$("#wf_struc_analysis_div").hide();
		$("#wf_systm_analysis_div").show();
	}
}

//05-JUL-2018 || SMI || Steps - On Click Function
$(".stg_step").click(function(){
	var stg_step_no = $('.stg_step').index(this);
	var stg_step_name = $('.stg_step:eq('+stg_step_no+')').text();
	$(".stg_step_div").hide();
	$(".stg_step_div:eq("+stg_step_no+")").show();
	stg_step_no = stg_step_no + 1;
	$("#wf_analysis_step_title").text("Step "+stg_step_no+" - "+stg_step_name);
});
$(".str_step").click(function(){
	var str_step_no = $('.str_step').index(this);
	var str_step_name = $('.str_step:eq('+str_step_no+')').text();
	$(".wf_struc_steps").hide();
	$(".wf_struc_steps:eq("+str_step_no+")").show();
	str_step_no = str_step_no + 1;
	$("#wf_analysis_step_title").text("Step "+str_step_no+" - "+str_step_name);
});
$(".sys_step").click(function(){
	var sys_step_no = $('.sys_step').index(this);
	var sys_step_name = $('.sys_step:eq('+sys_step_no+')').text();
	sys_step_no = sys_step_no + 1;
	$("#wf_analysis_step_title").text("Step "+sys_step_no+" - "+sys_step_name);
});
