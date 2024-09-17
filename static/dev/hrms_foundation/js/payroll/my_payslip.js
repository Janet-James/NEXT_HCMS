$(document).ready(function(){
	//alert(1)
	view_button_create();
});

function view_button_create(){
		strAppend = " <button type='button' onclick='my_payslip_print_button()' class='btn btn-primary btn-eql-wid btn-animate'>Print</button>"
			$('#my_payslip_view_btn').html(strAppend);
}

function my_payslip_create_function(){
	var employee_id = $("#employe_name").val();
	var paylsip_from_date = dateFormatReport($("#dtimepicker1").val());
	var payslip_to_date = dateFormatReport($("#dtimepicker2").val());
	if(employee_id){
		$.ajax({	
			type  : 'POST',
			url   : '/my_payslip_print/',
			async : false,
			data:{"period_from":paylsip_from_date,"period_to":paylsip_from_date,'employee_id':employee_id,csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()},
		}).done( function(json_data) {
			data = JSON.parse(json_data);
			if(data){
				for(i=0;i<data.length;i++)
					{
				alert_lobibox("success", "Payslip Generation Successfully")
				let path = payslip_path+data[i]
				console.log("=========================path",path)
				var file_name = '<a  title="Download Offer" id="my_payslip_report_download" class="btn btn-success btn-eql-wid btn-animate" href="'
					+ path
					+ '" download="'
					+ data[i]
					+ '"><i class="offer_report nf nf-download"></i></a>';
				$('#my_payslip_download').html(file_name);
				//alert_lobibox("success", "Payroll Report Generated Successfully. Please wait few seconds.");
				//setTimeout(function(){$('#payroll_report_download')[0].click(); }, 1000);
				$('#my_payslip_report_download')[0].click();
				//report_clear()
					}
			}else{
				alert_lobibox("error", "Report Generation Failure");
			}
			
		});
	}else{
		alert_lobibox("error","No Record Found")
	}
	
}

function my_payslip_print_button() {
	if(my_payslip_form_validation())
	{
		my_payslip_create_function();
	}
}

function my_payslip_form_validation()
{
	return $('#my_payslip_form').valid();
}

//contribution register form validation
$('#my_payslip_form').submit(function(e) {
	e.preventDefault();    
}).validate({
	rules: {
		employee_id: {
			required: true,
			valueNotEquals:true, 
		},   
		from_date: {
			required: true,
			//number:true, 
		},	  
		to_date: {
			required: true,
			//valueNotEquals:true, 
		},
	},
	//For custom messages
	messages: {
		  
		employee_id: {
			required: "Select an Employee",
			valueNotEquals:"Select an Employee", 
		},
		from_date: {
			required: "Enter From Date",
			//number: "Enter only a number", 
		},
		to_date: {
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

function dateFormatReport(val){
	return val.split(' ')[0]+'-'+val.split(' ')[1]
}