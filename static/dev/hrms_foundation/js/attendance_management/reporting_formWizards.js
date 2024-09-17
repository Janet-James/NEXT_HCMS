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
	$('.tab1f,.tab2f,.tab3f,.tab4f,.tab5f').hide();
	$('.'+val+'f').show();
	if(val == 'tab2'){
		$("#date1").DateTimePicker({
			dateFormat: "dd-MM-yyyy",
			maxDate: new Date(),
		});		
	}else if(val == 'tab3'){
		$("#date3").DateTimePicker({
			dateFormat: "dd-MM-yyyy",
			maxDate: new Date(),
		});		
	}
}

//tab hide function
$('#formwizard a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
	  stepsChange(e.target.id);
	});

