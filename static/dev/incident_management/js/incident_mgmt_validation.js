//Validation for Drop Data
$.validator.addMethod("valueNotEquals", function(value, element, arg){
	if(value == 0) {
		return false
	} else {
		return true
	}
}, "Value must not equal arg.");
//Validation For incident details 
$('#incident_details_recording').submit(function(e) {
		e.preventDefault();
	}).validate({
		rules: {
			details_subject: { required: true, },  
			incident_date: { required: true,	}, 
			details_description: { required: true,}, 
			incident_type:{ valueNotEquals:true,},
			incident_severity_type:{ valueNotEquals:true, },
			details_location: { required: true, },
			category:{ valueNotEquals:true,	},
			reported_by:{ valueNotEquals:true, },
			victrim_id:{ valueNotEquals:true,	},
			prepetrator_id:{ valueNotEquals:true,},
		},
		//For custom messages
		messages: {
			details_subject: { required: "Enter the Subject", },
			incident_date: { required: "Enter the Incident Date",},
			details_description: { required: "Select the Description",},
			incident_type: { valueNotEquals: "The field is required",	},
			incident_severity_type: { valueNotEquals: "The field is required",},
			details_location: { required: "Enter the Incident Location",},
			category: { valueNotEquals: "Select the Category",},
			reported_by: { valueNotEquals: "The field is required", },
			victrim_id: { valueNotEquals: "The field is required", },
			prepetrator_id: { valueNotEquals: "The field is required", },
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

$('#update_incident_details_recording').submit(function(e) {
	e.preventDefault();
}).validate({
	rules: {
		update_details_subject: { required: true, 	}, 
		update_incident_date: { required: true,}, 
		update_details_description: { required: true,	}, 
		update_incident_type:{ valueNotEquals:true, },
		update_incident_severity_type:{ valueNotEquals:true,},
		update_details_location: { required: true,},
		update_category:{ valueNotEquals:true,},
		update_reported_by:{ valueNotEquals:true,},
		update_victrim_id:{ valueNotEquals:true,},
		update_prepetrator_id:{ valueNotEquals:true, },
	},
	//For custom messages
	messages: {
		update_details_subject: { required: "Enter the Subject",},
		update_incident_date: { required: "Enter the Incident Date", },
		update_details_description: { required: "Select the Description",},
		update_incident_type: { valueNotEquals: "The field is required",},
		update_incident_severity_type: { valueNotEquals: "The field is required", },
		update_details_location: { required: "Enter the Incident Location",},
		update_category: { valueNotEquals: "Select the Category",	},
		update_reported_by: { valueNotEquals: "The field is required",},
		update_victrim_id: { valueNotEquals: "The field is required",},
		update_prepetrator_id: { valueNotEquals: "The field is required",},
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
$('#solution_proposal_form').submit(function(e) {
	e.preventDefault();
}).validate({
	rules: {
		corrective_measure: { required: true,}, 
		preventive_masure: { required: true,}, 
	},
	messages: {
		corrective_measure: { required: "Fill The field", },
		preventive_masure: { required: "Fill The field",},
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

$('#corrective_action_form').submit(function(e) {
	e.preventDefault();
}).validate({
	rules: {
		action_item_summary: { required: true,}, 
		owner: { valueNotEquals:true, },
		action_status: { valueNotEquals:true,}, 
	},
	messages: {
		action_item_summary: { required: "Fill The field",},
		owner: { valueNotEquals: "The field is required",},
		action_status: { valueNotEquals: "The field is required",  },
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
$('#investigation_details_form_validation').submit(function(e) {
	e.preventDefault();
}).validate({
	rules: {
		team: { valueNotEquals:true, },  
	},
	messages: {
		team: { valueNotEquals: "The field is required",},
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
function investigation_details_form_validation(){ return $('#investigation_details_form').valid(); }
function corrective_action_form_validation(){   return $('#corrective_action_form').valid(); }
function solution_proposal_form_validation(){  return $('#solution_proposal_form').valid(); }
function incident_details_form_validation() { return $('#incident_details_recording').valid(); }
function update_incident_details_form_validation()  { return $('#update_incident_details_recording').valid();  }
