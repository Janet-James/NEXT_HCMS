$(document).ready(function(){
	//view_button_create();
	$(".select2-search__field").attr('placeholder',"-- Select An Employee --");
//	$("#employee_id_bank").select2({
//	    placeholder: "--Select An Employee--",
//	   // allowClear: true
//	});
}); 

$("#banking_format_type").on("change", function(e) {
console.log($('#banking_format_type').select2("val"));
banking_type=$('#banking_format_type').select2("val")
		$.ajax({
			url : "/bank_format_bank_based_emploee/",
			type : "POST",
			data : {'banking_type':banking_type},
			async:false,
		}).done( function(json_data) {
			data = JSON.parse(json_data);
			console.log(data)
			if (data){
				$('#employee_id_bank').val(data.employee_ids).trigger('change')
			}
			else{
				$('#employee_id_bank').val('').trigger('change')
			}
			$("#employee_id_bank").attr('placeholder',"-- Select An Employee --");
		});

});

function bank_button(){
	var employee_id_list = [];
	$.each($("#employee_id_bank option:selected"), function(){     
		employee_id_list.push($(this).val());
	});
	var from_date = dateFormatBank($("#bank_dtimepicker1").val())
	var to_date = dateFormatBank($("#bank_dtimepicker2").val())
        var banking_type = $('#banking_format_type').select2("val")
        var banking_payer = $('#banking_payer').select2("val")
	console.log(banking_payer,banking_type)
	if(employee_id_list.length>0){
		$.ajax({
			url : "/bank_format_employee_id/",
			type : "POST",
			data : {'id':JSON.stringify(employee_id_list),'from_date':from_date,'to_date':to_date,'banking_type':banking_type,'banking_payer':banking_payer},
			async:false,
		}).done( function(json_data) {
			data = JSON.parse(json_data);
			console.log(json_data)
			if(data.success_data == 'Success'){
				alert_lobibox("success", "Bank Format Generated Successfully")
				let path = '/media/payroll_bank_format/'+data.file_data[0].file_name + '.csv'
				var file_name = '<a  title="Download Offer" id="payroll_bank_download" class="btn btn-success btn-eql-wid btn-animate" href="'
					+ path
					+ '" download="'
					+ data.file_data[0].file_name + '.csv'
					+ '"><i class="offer_bank nf nf-download"></i></a>';
				$('#pdf_download').html(file_name);
				//alert_lobibox("success", "Payroll Bank Format Generated Successfully. Please wait few seconds.");
				//setTimeout(function(){$('#payroll_bank_download')[0].click(); }, 1000);
				$('#payroll_bank_download')[0].click();
				bank_clear()
			}else{
				alert_lobibox("error", "Bank Formated Generated Failure");
			}
			//pdf_employee_data(data.employee_data)
		});
	}else{
		alert_lobibox("error", "Please Select An Employee");
	}

}

function bank_all_employee(employee_val){

	if (employee_val.checked == true){
		/*	$("#card_employee_id").select2({
	        dropdownParent: $("#select_employee")
	});*/
		//console.log("gtest",$('#employee_id_bank').length)
		$('#employee_id_bank').each(function () {
			 $("#employee_id_bank > option").prop("selected","selected");// Select All Options
		        $("#employee_id_bank").trigger("change");// Trigger change to select 2
			//$('#employee_id_bank option').attr("selected", true).trigger('change');
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
				$('#employee_id_bank').val(data.employee_val).trigger('change')
			}else{
				alert_lobibox("error", "No Data Found");
			}
			
		});*/


	}else{
		$('#employee_id_bank').each(function () {
			//$("#employee_id_bank > option").prop("selected","selected");// Select All Options
	        //$("#employee_id_bank").trigger("change");// Trigger change to select 2
			$('#employee_id_bank option').attr("selected", false).trigger('change');
		});
		//$("#employee_id_bank").select2("refresh")
		//$("#employee_id_bank").select2('rebuild')
		$(".select2-search__field").attr('placeholder',"-- Select An Employee --");
		//	 $('#card_employee_id option').attr("selected", false).trigger('change');
//		$('#card_employee_id').val(0).trigger('change');
//		$("#employee_id_bank").select2({
//		    placeholder: "--Select An Employee--",
//		   // allowClear: true
//		});
	}
	//$('#select_employee option').prop('selected', true);
}

function dateFormatBank(val){
	return val.split(' ')[0]+'-'+val.split(' ')[1]
}

function bank_clear(){
	$("#bank_dtimepicker1").val('');
	$("#bank_dtimepicker2").val('');
	//$("employee_id_bank").val(0).trigger("change");
	//$(".select2").val(0).trigger('change');
	$('#employee_id_bank').val('').trigger('change');
	$("#select_employee").prop("checked", false);
}