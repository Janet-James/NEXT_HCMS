function employee_mapping(){
	employee_mapping_button_show('add')
	$("#employee_name").attr("data-placeholder","Employee Name");
	 $("#employee_name").select2();
	 $(".select2-search__field").css({'width':"100%"});
	 shiftDetailView('')
}

//validation for group employee mapping form
$('#employee_mapping_form').submit(function(e) {
		e.preventDefault();
	}).validate({
		rules: {
			employee_name: { valueNotEquals: true, },
			shift_name_list: { valueNotEquals: true, },
			orgList: { valueNotEquals: true, },
			orgUnitList: { valueNotEquals: true, },
		},
		//For custom messages
		messages: {
			employee_name: { valueNotEquals: "The employee name is required", },
			shift_name_list: { valueNotEquals: "The shift name is required", },
			orgList: { valueNotEquals: "The organization is required", },
			orgUnitList: { valueNotEquals: "The organization unit is required", },
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
function employee_mapping_form_validation()
{
	return $('#employee_mapping_form').valid();
}

//Add Employee Mapping confirmation function 
function AddConfirmationEmployeeMapping(func_name, action_name,action_id) {
	title = ''
	for(var i=0;i<action_name.length;i++){
		if(i<action_name.length-1){
			title = title + action_name[i] + ', '
		}
		else if(i==action_name.length-1){
			title = title + action_name[i]
		}
		
	}
	title = title + " are allocated to another worktime.\n Do you want to update worktime?"
	$('.popup_zindex').css({'z-index':'unset'});//search select btn zindex
	swal ({
		title: title,
//		text: "Go ahead the removed",
		type: "warning",
		showCancelButton: true,
		confirmButtonClass: "btn btn-success btn-eql-wid btn-animate pull-left",
		cancelButtonClass: "btn btn-danger btn-eql-wid btn-animate pull-right",
		confirmButtonText: "Yes",
		cancelButtonText: "No",
		showConfirmButton : true,
		closeOnConfirm: true,
		closeOnCancel: true
	},
	function(isConfirm) {
		if (action_id) {
			window[func_name](isConfirm,action_id);
		} else {
			window[func_name]();
		}
	});
	$('.swal_close').attr('onclick','swal_modal_close(this)')
}

function swal_modal_close(thisData){
	$(thisData).parent().hide();
	$(thisData).parent().css('opacity','-0.01')
	$(thisData).parent().prev().css('opacity','-0.04')
	$(thisData).parent().prev().hide();
}
