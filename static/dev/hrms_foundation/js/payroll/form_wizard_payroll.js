$('#tab_primary .number').addClass('btn-success');
var currentTarget = '';
var get_tab_id = 'tab_contribution';
$('#formwizard').bootstrapWizard({
	'tabClass': 'nav nav-pills',
	'debug': false,
	onShow: function (tab, navigation, index) {
		return true
	},
	onNext: function (tab, navigation, index) {
		currentTarget = '#pills-tab'+(index+1);
		return true//tabShowStatus(tab, navigation, index)?true:false
	},
	onPrevious: function (tab, navigation, index) {
		currentTarget = '#pills-tab'+(index+1);
		return true//tabShowStatus(tab, navigation, index)?true:false
	},
	onLast: function (tab, navigation, index) {
		return true
	},
	onTabClick: function (tab, navigation, index) {
		return true//tabShowStatus(tab, navigation, index)?true:false
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
/*function tabShowStatus(tab, navigation, index){	
	var hrms_employee_list_id = $('#hrms_employee_list option:selected').val();
	if(hrms_employee_list_id == '0'){
		$('.lobibox-close').trigger('click');//close previous lobibox
		alert_lobibox("info", sysparam_datas_list['NTE_60']);
		return false
	}else if(status_change==true){
		empNavigationFuncton("employeeNavigation",index);
	}else{
		//stepsChange();				
		return true
	}
}*/

//employee navigation tab 
function employeeNavigation(index){
	status_change = false;
	if(currentTarget != ''){
		$('.nav-pills a[href="'+currentTarget+'"]').tab('show');
	}
}

//onload get values local storage
if((localStorage.getItem('id') != null) && (localStorage.getItem('id') != '')){
	var activeTabId = localStorage.getItem('id');
	
	var activeTabHeaderID = localStorage.getItem('data');
	get_tab_id = activeTabHeaderID
	$('.dtBox').removeClass('active');
	var parentClass = $('#'+activeTabHeaderID).parent().addClass("active");
	localStorage.setItem('id', '');
	$('.payroll').removeClass('active');
	$('#'+activeTabId).addClass('active');
	if(activeTabHeaderID == 'tab_report'){
		$(".report_tab").DateTimePicker({
			dateFormat: "MMM yyyy",
			//minDate: new Date(),
		});
	}
	else if(activeTabHeaderID == 'tab_bankformat'){
	$(".bank_tab").DateTimePicker({
			dateFormat: "MMM yyyy",
		});
	}
	else if(activeTabHeaderID != 'tab_payslip' && activeTabHeaderID != 'tab_report'){
		$("."+activeTabHeaderID).DateTimePicker({
			dateFormat: "dd-MM-yyyy",
			//minDate: new Date(),
		});
	}
	else{
		$("."+activeTabHeaderID).DateTimePicker({
			dateFormat: "MMM yyyy",
		});
	}
	
	
}else{
	$('.payroll').removeClass('active');
	$('.dtBox').addClass('active');
	$('#pills-tab1').addClass('active');
}

//tab click event
$('.payRollTabs li a').click(function(){
	localStorage.setItem('id', $(this).attr('data'));
	localStorage.setItem('data', $(this).attr('id'));
	window.location.reload();
	});

//steps change in employee 
function stepsChange(val){	
	doc_id = 0;
	if(val != undefined){
		//$('#education_details_cancel_button,#experience_details_cancel_button,#certification_details_cancel_button,#skills_cancel_button').trigger('click'); // Nothing
		$('.fileinput-filename').html('');//upload file update here
		$('.number').removeClass('btn-success');
		$('#'+val+' .number').addClass('btn-success');
		if(val == 'tab_contribution'){
			document.getElementById("payment_advice_form").reset();
			document.getElementById("salary_rule_form").reset();
			document.getElementById("salary_structure_form").reset();
			document.getElementById("salary_contract_form").reset();
			document.getElementById("payslip_form").reset();
			$(".select2").val('').trigger('change');
		}else if(val == 'tab_payment_advice'){
			document.getElementById("contribution_register_form").reset();
			document.getElementById("salary_rule_form").reset();
			document.getElementById("salary_structure_form").reset();
			document.getElementById("salary_contract_form").reset();
			document.getElementById("payslip_form").reset();
			$(".select2").val('').trigger('change');
		}else if(val == 'salary_rule_tab'){
			document.getElementById("contribution_register_form").reset();
			document.getElementById("payment_advice_form").reset();
			document.getElementById("salary_structure_form").reset();
			document.getElementById("salary_contract_form").reset();
			document.getElementById("payslip_form").reset();
			$(".select2").val('').trigger('change');
		}else if(val == 'tab_salary_structure'){
			document.getElementById("contribution_register_form").reset();
			document.getElementById("payment_advice_form").reset();
			document.getElementById("salary_rule_form").reset();
			document.getElementById("salary_contract_form").reset();
			document.getElementById("payslip_form").reset();
			$(".select2").val('').trigger('change');
			
//			$('#title_change_formwizard').html('4');
		}else if(val == 'tab_salary_contract'){
			document.getElementById("contribution_register_form").reset();
			document.getElementById("payment_advice_form").reset();
			document.getElementById("salary_structure_form").reset();
			document.getElementById("salary_rule_form").reset();
			document.getElementById("payslip_form").reset();
			$(".select2").val('').trigger('change');
		}else if(val == 'tab_payslip'){	
			document.getElementById("contribution_register_form").reset();
			document.getElementById("payment_advice_form").reset();
			document.getElementById("salary_structure_form").reset();
			document.getElementById("salary_rule_form").reset();
			document.getElementById("salary_contract_form").reset();
			$("#dtBox1").val('').trigger('change');
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
	  }else if(target == '#pills-tab6'){
		  $('#employee_last').hide();
		  $('#employee_pre').show();
	  }else{
		  $('#employee_pre').show();
		  $('#employee_last').show();
	  }	  
	  stepsChange(e.target.id,e);
	});