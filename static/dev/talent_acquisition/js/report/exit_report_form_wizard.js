$('.tab2f,.tab3f,.tab4f,.tab5f').hide();
$('#tab1 .number').addClass('btn-success');
$('#formwizard').bootstrapWizard({
	'tabClass': 'nav nav-pills',
	'debug': false,
	onShow: function (tab, navigation, index) {
		return true
	},
	onNext: function (tab, navigation, index) {
		return true
	},
	onPrevious: function (tab, navigation, index) {
		return true
	},
	onLast: function (tab, navigation, index) {
		return true
	},
	onTabClick: function (tab, navigation, index) {
		return true
	},
	onTabShow: function (tab, navigation, index) {
		var $total = navigation.find('li').length;
		var $current = index + 1;
		var $percent = ($current / $total) * 100;
		$('#formwizard .progress-bar').css({
			width: $percent + '%'
		});
	}
});

//tab show condition
function tabShowStatus(){
	var hrms_employee_list_id = $('#hrms_employee_list option:selected').val();
	if(hrms_employee_list_id == '0'){
		alert_lobibox("error", sysparam_datas_list['NTE_60']);
		return false
	}else{
		return true
	}
}

//steps change in employee 
function stepsChange(val){
	$('.number').removeClass('btn-success');
	$('#'+val+' .number').addClass('btn-success');
	$('.tab1f,.tab2f,.tab3f,.tab4f,.tab5f').hide();
	if(val == 'tab1'){
		$(".date_request").DateTimePicker({
			dateTimeFormat : "dd-MM-yyyy"
		});
		$('.tab1f').show();	
	}else if(val == 'tab2'){
		$(".date_approved").DateTimePicker({
			dateTimeFormat : "dd-MM-yyyy"
		});
		$('.tab2f').show();
	}else if(val == 'tab3'){
		$(".date_rejected").DateTimePicker({
			dateTimeFormat : "dd-MM-yyyy"
		});
		$('.tab3f').show();
	}else if(val == 'tab4'){
		$(".date_exit").DateTimePicker({
			dateTimeFormat : "dd-MM-yyyy"
		});
		$('.tab4f').show();
	}else{
		$('.tab5f').show();
	}
}

//tab hide function
$('#formwizard a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
	  stepsChange(e.target.id);
	});