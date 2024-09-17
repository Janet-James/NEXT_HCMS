$(document).ready(function(){
	//view_button_create();
	$(".select2-search__field").attr('placeholder',"-- Select An Employee --");
//	$("#employee_id_report").select2({
//	    placeholder: "--Select An Employee--",
//	   // allowClear: true
//	});
}); 

function report_button(){
	var employee_id_list = [];
	$.each($("#employee_id_report option:selected"), function(){     
		employee_id_list.push($(this).val());
	});
	var from_date = dateFormatReport($("#report_dtimepicker1").val())
	var to_date = dateFormatReport($("#report_dtimepicker2").val())
	if(employee_id_list.length>0){
		$.ajax({
			url : "/report_emploee_id/",
			type : "POST",
			data : {'id':JSON.stringify(employee_id_list),'from_date':from_date,'to_date':to_date},
			async:false,
		}).done( function(json_data) {
			data = JSON.parse(json_data);
			console.log(json_data)
			if(data.success_data == 'Success'){
				alert_lobibox("success", "Report Generated Successfully")
				let path = '/media/payroll/'+data.file_data[0].file_name + '.xls'
				var file_name = '<a  title="Download Offer" id="payroll_report_download" class="btn btn-success btn-eql-wid btn-animate" href="'
					+ path
					+ '" download="'
					+ data.file_data[0].file_name + '.xls'
					+ '"><i class="offer_report nf nf-download"></i></a>';
				$('#pdf_download').html(file_name);
				//alert_lobibox("success", "Payroll Report Generated Successfully. Please wait few seconds.");
				//setTimeout(function(){$('#payroll_report_download')[0].click(); }, 1000);
				$('#payroll_report_download')[0].click();
				report_clear()
			}else{
				alert_lobibox("error", "Report Generated Failure");
			}
			//pdf_employee_data(data.employee_data)
		});
	}else{
		alert_lobibox("error", "Please Select An Employee");
	}

}

function all_employee(employee_val){

	if (employee_val.checked == true){
		/*	$("#card_employee_id").select2({
	        dropdownParent: $("#select_employee")
	});*/
		//console.log("gtest",$('#employee_id_report').length)
		$('#employee_id_report').each(function () {
			 $("#employee_id_report > option").prop("selected","selected");// Select All Options
		        $("#employee_id_report").trigger("change");// Trigger change to select 2
			//$('#employee_id_report option').attr("selected", true).trigger('change');
		});
		/*alert(0)
		$.ajax({	
			type  : 'POST',
			url   : '/select_all_employee/',
			async : false,
		}).done( function(json_data) {
			data = JSON.parse(json_data);
			console.log("NNNNNNNNNNNNN",data.employee_val)
			if(data){
				$('#employee_id_report').val(data.employee_val).trigger('change')
			}else{
				alert_lobibox("error", "No Data Found");
			}
			
		});*/


	}else{
		$('#employee_id_report').each(function () {
			//$("#employee_id_report > option").prop("selected","selected");// Select All Options
	        //$("#employee_id_report").trigger("change");// Trigger change to select 2
			$('#employee_id_report option').attr("selected", false).trigger('change');
		});
		//$("#employee_id_report").select2("refresh")
		//$("#employee_id_report").select2('rebuild')
		$(".select2-search__field").attr('placeholder',"-- Select An Employee --");
		//	 $('#card_employee_id option').attr("selected", false).trigger('change');
//		$('#card_employee_id').val(0).trigger('change');
//		$("#employee_id_report").select2({
//		    placeholder: "--Select An Employee--",
//		   // allowClear: true
//		});
	}
	//$('#select_employee option').prop('selected', true);
}

function dateFormatReport(val){
	return val.split(' ')[0]+'-'+val.split(' ')[1]
}

function report_clear(){
	$("#report_dtimepicker1").val('');
	$("#report_dtimepicker2").val('');
	//$("employee_id_report").val(0).trigger("change");
	//$(".select2").val(0).trigger('change');
	$('#employee_id_report').val('').trigger('change');
	$("#select_employee").prop("checked", false);
}