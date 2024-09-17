var non_compliance_columns = [{"title":"ID"}, {"title":"No."}, {"title":"Employee Name"}, {"title":"Check In Date"},{"title":"Check In Time"},{"title":"HR Hours"},{"title":"Project Hours"},{"title":"Non-Compliance Days"}];
$(document).ready(function(){
	non_compliance_details_table("/non_compliance_list/",{'id':0},0);
})

function non_compl_search(){
	if (non_compliance_form_validation() && $("#non_employee_id_report  option:selected").val() != undefined){
		var hr_value = $("input[name='hr_hour']:checked").val();
		if(hr_value == 'Yes'){
			var hr_hour = 1
			hr_data = 'yes'
		}else{
			var hr_hour = 0
		}
		var non_compliance_id_list = [];
		 $.each($("#non_employee_id_report option:selected"), function(){     
			 non_compliance_id_list.push($(this).val());
	    });
		//var employee_id = $('#report_employee_name option:selected').val() != '0' ? $('#report_employee_name option:selected').val() : '';
		var from = ($('#non_report_dtimepicker1').val() != undefined && $('#non_report_dtimepicker1').val() != '')? dateFormatChange($('#non_report_dtimepicker1').val()) : '';
		var to = ($('#non_report_dtimepicker2').val() != undefined && $('#non_report_dtimepicker2').val() != '')? dateFormatChange($('#non_report_dtimepicker2').val()) : '';
		non_compliance_details_table("/non_compliance_list/",{'employee_id':JSON.stringify(non_compliance_id_list),'from':from,'to':to,'hr_hour':hr_hour},1);
		//alert_lobibox("success",sysparam_datas_list['NTE_58']);
	}else{
		plaindatatable_btn("payslip_report_details",[],emp_columns,[0,4]);
	}
}

function non_compliance_details_table(urls,datas,id){
	non_compliance_datatable = []
	$.ajax({
		url : urls,
		type : "GET",
		data : datas,
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		if(data.hr_hour_data){
			
			$.each(data.hr_hour_data, function(a,b){
				$.each(b, function(key,value){
					hr_hour_lists = []
					s_no = key + 1
					hr_hour_lists.push(value['emp_id'],s_no,value['username'],value['check_in'],value['check_in_time'],value['hr_hours'],value['project_hrs'],
							0);
					non_compliance_datatable.push(hr_hour_lists);
				});
				
			});
		}else{
			$.each(data, function(x,y){
				$.each(y['check_in_time'], function(key,value){
					non_compliance_list = []
					s_no = key + 1
					non_compliance_list.push(y['employee_id'],s_no,y['employee_name'],y['check_in_date'][key],y['check_in_time'][key],y['hr_hour'][key],y['project_hr'][key]
							,y['lop_count_data'][key]);
					
					non_compliance_datatable.push(non_compliance_list);
				});
				
			
			});
		}
		
		
		if(id == 0 ){
			plaindatatable_btn("non_complnce_report_details",[],non_compliance_columns,0);
		}else{
			plaindatatable_btn("non_complnce_report_details",non_compliance_datatable,non_compliance_columns,0,'NEXT_TRANSFORM_HCMS_NON-COMPLIANCE_'+currentDate());
		}
	});
}

function non_all_employee(employee_val){

	if (employee_val.checked == true){
		$('#non_employee_id_report').each(function () {
			$('#non_employee_id_report option').attr("selected", true).trigger('change');
		});
		


	}else{
		$('#non_employee_id_report').each(function () {
			$('#non_employee_id_report option').attr("selected", false).trigger('change');
		});
		$("#non_employee_id_report").select2('rebuild')
		$(".select2-search__field").attr('placeholder',"-- Select Employee --");
	}
	//$('#select_employee option').prop('selected', true);
}

//date format change
function dateFormatChange(val){
	return val.split(' ')[0]+'-'+val.split(' ')[1]
}

//form is valid or not
function non_compliance_form_validation()
{
	return $('#non_compliance_form').valid();
}

$('#non_compliance_form').submit(function(e) {
	e.preventDefault();    
}).validate({
	rules: {
		non_employee_id: {
			required: true,
			valueNotEquals:true, 
		},   
		non_report_from_date: {
			required: true,
			//number:true, 
		},	  
		non_report_to_date: {
			required: true,
			//valueNotEquals:true, 
		},
	},
	//For custom messages
	messages: {
		non_employee_id: {
			required: "Select Employee",
			valueNotEquals:"Select Employee", 
		},non_report_from_date: {
			required: "Enter From Date",
			//number: "Enter only a number", 
		},
		non_report_to_date: {
			required: "Enter To Date",
			//number: "Enter only a number", 
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

jQuery.validator.addMethod('valueNotEquals', function (value) {
	return (value != '0');
}, "");

function non_compl_clear(){
	$("#non_report_dtimepicker1").val('');
	$("#non_report_dtimepicker2").val('');
	$("#non_employee_id_report").val(0).trigger("change");
	//$(".select2").val(0).trigger('change');
	non_compliance_details_table("/non_compliance_list/",{'id':0},0);
}

$("#non_employee_id_report").change(function(){
	$(".clear3").html("")
});


