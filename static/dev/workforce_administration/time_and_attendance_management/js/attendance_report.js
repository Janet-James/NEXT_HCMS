var columns = [{"title":"No."},{"title":"Date"},{"title":"Attendance Status "},{"title":"Clock In"}, {"title":"Clock Out"}]

$(document).ready(function (){
	plaindatatable_btn('attendance_report_table', [], columns,[])})
	$('#organisation').change(function(){
		var org_id=$('#organisation  option:selected').val()
		if(org_id!='0' && org_id!='')
		{
			$.ajax({
				type:'GET',
				url: '/shift/org_unit_fetch/',
				data  : { 'str_org_id':org_id},
				async : false,
				success: function (json_data){
					var data=json_data
					$('#organization_unit_id').html('')
					$('#organization_unit_id').append($('<option>', {
						value :'0',
						text :'--Select Organization Unit--'
					}));
					if(data)
					{
						var data_len=data.org_unit.length;
						if(data_len>=1)
						{  
							for(var i=0;i<data_len;i++)
							{   
								$('#organization_unit_id').append($('<option>', {
									value : data.org_unit[i].id,
									text : data.org_unit[i].orgunit_name,
								}));
							}
						}
						else{ $('#organization_unit_id').val('0').trigger("change"); }
					}
					else{ $('#organization_unit_id').val('0').trigger("change"); }
				}
			});
		}
	});

$('#organization_unit_id').change(function(){
	var org_unit_id=$('#organization_unit_id  option:selected').val()
	if(org_unit_id!='0' && org_unit_id!='')
	{
		$.ajax({
			type:'POST',
			url: '/org_unit_employee_fetch/',
			data  : { 'org_unit_id':org_unit_id,csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()},
			async : false,
			success: function (json_data){
				var data=json_data
				$('#employee_id').html('')
				$('#employee_id').append($('<option>', {
					value :'0',
					text :'-Select-'
				}));
				if(data)
				{
					var data_len=data.employee_info.length;
					if(data_len>=1)
					{  
						for(var i=0;i<data_len;i++)
						{   
							$('#employee_id').append($('<option>', {
								value : data.employee_info[i].id,
								text : data.employee_info[i].name,
							}));
						}
					}
					else{ $('#employee_id').val('0').trigger("change"); }
				}
				else{ $('#employee_id').val('0').trigger("change"); }
			}
		});
	}
});

function searchAttendanceRecord()
{
	var employee_id=$('#employee_id  option:selected').val()
	var from_date=$('#from_date').val().split("-").reverse().join("-");
	var to_date=$('#to_date').val().split("-").reverse().join("-");
	var status=attendance_report_form_validation()
//	if(employee_id==0||from_date==''||to_date=='')
//		{
//		alert_lobibox("info","Fill all fields"); 
//		}
	if(status){
	$.ajax({
		type:'POST',
		url: '/search_attendance_report/',
		data  : { 'employee_id':employee_id,'from_date':from_date,'to_date':to_date,csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()},
		async : false,
		success: function (json_data){
			var data=json_data.attendance_info;
			var data_list=[]
			for (var i=0; i<data.length; i++){
				data_list.push([i+1,data[i][0].record_date,data[i][0].attendance_status,data[i][0].check_in_date,data[i][0].check_out_date]);
			}
			plaindatatable_btn('attendance_report_table', data_list, columns,[])
		}
	});
}
	else{ alert_lobibox("info","Fill all fields");  }
}

function clearAttendanceRecord()
{
	form_inputs_clear('#attendance_report_form'); $('.errormessage').html('');
	plaindatatable_btn('attendance_report_table', [], columns,[])
}

//validation for Attendance report
$('#attendance_report_form').submit(function(e) {
		e.preventDefault();
	}).validate({
		rules: {
			organisation: { valueNotEquals:true, },
			organization_unit_id: { valueNotEquals:true, },
			employee_id: { valueNotEquals: true, }, 
			from_date: { required: true, }, 
			to_date: { required: true, },
			
		},
		//For custom messages
		messages: {
			organisation: { valueNotEquals: "The field is required", },
			organization_unit_id: { valueNotEquals: "The field is required", },
			employee_id: { valueNotEquals: "The field is required", },
			from_date: { required: "The field is required", },
			to_date: { required: "The field is required", },
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
		ignore: [],
		onkeyup: false,
		onfocusout:false,
	});
function attendance_report_form_validation()
{
	return $('#attendance_report_form').valid();
}