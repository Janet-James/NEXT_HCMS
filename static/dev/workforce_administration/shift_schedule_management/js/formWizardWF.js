$('#tab_shift_detail .number').addClass('btn-success');
$('#formwizardShift').bootstrapWizard({
	'tabClass': 'nav nav-pills',
	'debug': false,
	onShow: function (tab, navigation, index) {
		return true
	},
	onNext: function (tab, navigation, index) {
		return tabShowStatus(tab, navigation, index,move=1)?true:false
	},
	onPrevious: function (tab, navigation, index) {
		return tabShowStatus(tab, navigation, index,move=-1)?true:false
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
		$('#formwizardShift .progress-bar').css({
			width: $percent + '%'
		});
	}
});

//tab show condition
function tabShowStatus(tab, navigation, index,move){
	$(tab["0"]).removeClass('btn-success');
	if(move==1){
		$(tab["0"].nextElementSibling.children["0"]).click()
	}
	else if(move==-1){
		$(tab["0"].previousElementSibling.children["0"]).click()
	}
}

//tab hide function
//$('#shift_pre').hide();
$('#formwizardShift a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
	  var target = $(e.target).attr("href") // activated tab	
	  if(target == '#shift_detail'){
			$("#start_time,end_time,allow_shift_start,half_day,full_day").DateTimePicker({  dateFormat: "dd-MMM-yyyy" 	});
//		  $('#shift_pre').hide();
//		  $('#shift_last').show();
	  }
//	  else if(target == '#shift_roster'){
//		  $('#shift_last').hide();
//		  $('#shift_pre').show();
//	  }
//	  else{
//		  $('#shift_pre').show();
//		  $('#shift_last').show();
//	  }
//	  stepsChange(e.target.id);
	});