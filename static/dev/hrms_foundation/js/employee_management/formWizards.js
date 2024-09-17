$('#tab_primary .number').addClass('btn-success');
var currentTarget = '';
$('#formwizard').bootstrapWizard({
	'tabClass': 'nav nav-pills',
	'debug': false,
	onShow: function (tab, navigation, index) {
		return true
	},
	onNext: function (tab, navigation, index) {
		currentTarget = '#pills-tab'+(index+1);
		return tabShowStatus(tab, navigation, index)?true:false
	},
	onPrevious: function (tab, navigation, index) {
		currentTarget = '#pills-tab'+(index+1);
		return tabShowStatus(tab, navigation, index)?true:false
	},
	onLast: function (tab, navigation, index) {
		return true
	},
	onTabClick: function (tab, navigation, index) {
		return tabShowStatus(tab, navigation, index)?true:false
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

$('#formwizard .nav a:not(".external")').click(function (e) {
	  e.preventDefault()
	  currentTarget = $(e.currentTarget).attr("href") // activated tab
	})
	
//tab show condition
function tabShowStatus(tab, navigation, index){	
	var hrms_employee_list_id = $('#hrms_employee_list option:selected').val();
	if(hrms_employee_list_id == '0'){
		$('.lobibox-close').trigger('click');//close previous lobibox
		alert_lobibox("info", sysparam_datas_list['NTE_60']);
		return false
	}else if(status_change==true){
		empNavigationFuncton("employeeNavigation",index);
	}else{
		stepsChange();				
		return true
	}
}

//employee navigation tab 
function employeeNavigation(index){
	status_change = false;
	if(currentTarget != ''){
		$('.nav-pills a[href="'+currentTarget+'"]').tab('show');
	}
}

//steps change in employee 
function stepsChange(val){	
	doc_id = 0;
	if(val != undefined){
		$('#education_details_cancel_button,#experience_details_cancel_button,#certification_details_cancel_button,#skills_cancel_button').trigger('click'); // Nothing
		$('.fileinput-filename').html('');//upload file update here
		$('.number').removeClass('btn-success');
		$('#'+val+' .number').addClass('btn-success');
		if(val == 'tab_primary'){
			$("#dtBox").DateTimePicker({
				dateFormat: "dd-MM-yyyy",
				maxDate: new Date(),
			});
		}else if(val == 'tab_personal'){
			$("#dtBox1").DateTimePicker({
				dateFormat: "dd-MM-yyyy",
			});
		}else if(val == 'tab_hr'){
			$("#dtBox2").DateTimePicker({
				dateFormat: "dd-MM-yyyy"
			});
		}else if(val == 'tab_skills'){
//			$('#title_change_formwizard').html('4');
		}else if(val == 'tab_education'){
//			$('#title_change_formwizard').html('5');
		}else if(val == 'tab_asset'){
			$("#dtBox5").DateTimePicker({
				dateFormat: "dd-MM-yyyy",
				maxDate: new Date(),
			});			
		}else if(val == 'tab_experience'){
			$("#dtBox3").DateTimePicker({
				dateFormat: "dd-MM-yyyy",
				maxDate: new Date(),
			});
		}else if(val == 'tab_certification'){
			$("#dtBox4").DateTimePicker({
				dateFormat: "dd-MM-yyyy",
				maxDate: new Date(),					
			});
		}else if(val == 'tab_asset'){
			$("#dtBox5").DateTimePicker({
				dateFormat: "dd-MM-yyyy",
				maxDate: new Date(),					
			});
		}		
	}

}

//tab hide function
$('#employee_pre').hide();
$('#formwizard a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
	  var target = $(e.target).attr("href") // activated tab	
	  currentTarget = target;
	  if(target == '#pills-tab1'){
		  $('#employee_pre').hide();
		  $('#employee_last').show();
	  }else if(target == '#pills-tab8'){
		  $('#employee_last').hide();
		  $('#employee_pre').show();
	  }else{
		  $('#employee_pre').show();
		  $('#employee_last').show();
	  }	  
	  stepsChange(e.target.id);
	});