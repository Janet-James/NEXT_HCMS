var hr_project_columns = [{"title":"ID"}, {"title":"No."}, {"title":"Employee Name"}, {"title":"Check In Date"},{"title":"Check In Time"},{"title":"HR Hours"},{"title":"Project Hours"}];
$(document).ready(function(){
	hr_project_details_table("/hr_project_list/",{'id':0},0);
})

function hr_project_search(){
	if (hr_project_form_validation() && $("#project_hr_employee_id_report  option:selected").val() != undefined){
		
		var hr_project_id_list = [];
		 $.each($("#project_hr_employee_id_report option:selected"), function(){     
			 hr_project_id_list.push($(this).val());
	    });
		//var employee_id = $('#report_employee_name option:selected').val() != '0' ? $('#report_employee_name option:selected').val() : '';
		var from = ($('#project_hr_dtimepicker1').val() != undefined && $('#project_hr_dtimepicker1').val() != '')? dateFormatChange($('#project_hr_dtimepicker1').val()) : '';
		var to = ($('#project_hr_dtimepicker2').val() != undefined && $('#project_hr_dtimepicker2').val() != '')? dateFormatChange($('#project_hr_dtimepicker2').val()) : '';
		hr_project_details_table("/hr_project_list/",{'employee_id':JSON.stringify(hr_project_id_list),'from':from,'to':to},1);
		//alert_lobibox("success",sysparam_datas_list['NTE_58']);
	}else{
		plaindatatable_btn("payslip_report_details",[],emp_columns,[0,4]);
	}
}

function hr_project_details_table(urls,datas,id){
	hr_project_datatable = []
	$.ajax({
		url : urls,
		type : "GET",
		data : datas,
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		//console.log("data",data)
		if(data.hr_project_data){
			datatable_list = []
			$.each(data.hr_project_data, function(a,b){
				$.each(b, function(key,value){
					hr_hour_lists = []
					s_no = key + 1
					hr_hour_lists.push(value['id'],s_no,value['username'],value['check_in'],value['check_in_time'],value['hr_hours'],value['project_hrs'],
							0);
					hr_project_datatable.push(hr_hour_lists);
				});
				
			});
		}
		if(id == 0 ){
			plaindatatable_btn("project_hr_report_details",[],hr_project_columns,0);
		}else{
			plaindatatable_btn("project_hr_report_details",hr_project_datatable,hr_project_columns,0,'NEXT_TRANSFORM_HCMS_HR_PROJECT_'+currentDate());
		}
		
	});
}

function project_hr_all_employee(employee_val){

	if (employee_val.checked == true){
		$('#project_hr_employee_id_report').each(function () {
			$('#project_hr_employee_id_report option').attr("selected", true).trigger('change');
		});
		


	}else{
		$('#project_hr_employee_id_report').each(function () {
			$('#project_hr_employee_id_report option').attr("selected", false).trigger('change');
		});
		$("#project_hr_employee_id_report").select2('rebuild')
		$(".select2-search__field").attr('placeholder',"-- Select Employee --");
	}
	//$('#select_employee option').prop('selected', true);
}

//date format change
function dateFormatChange(val){
	return val.split(' ')[0]+'-'+val.split(' ')[1]
}

//form is valid or not
function hr_project_form_validation()
{
	return $('#hr_project_form').valid();
}

$('#hr_project_form').submit(function(e) {
	e.preventDefault();    
}).validate({
	rules: {
		project_hr_employee_id: {
			required: true,
			valueNotEquals:true, 
		},   
		project_hr_from_date: {
			required: true,
			//number:true, 
		},	  
		project_hr_to_date: {
			required: true,
			//valueNotEquals:true, 
		},
	},
	//For custom messages
	messages: {
		project_hr_employee_id: {
			required: "Select Employee",
			valueNotEquals:"Select Employee", 
		},project_hr_from_date: {
			required: "Enter From Date",
			//number: "Enter only a number", 
		},
		project_hr_to_date: {
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

function project_hr_clear(){
	$("#project_hr_from_date").val('');
	$("#project_hr_to_date").val('');
	$("#project_hr_employee_id_report").val(0).trigger("change");
	//$(".select2").val(0).trigger('change');
	hr_project_details_table("/hr_project_list/",{'id':0},0);
}

$("#project_hr_employee_id_report").change(function(){
	$(".clear3").html("")
});


