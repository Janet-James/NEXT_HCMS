//$(document).ready(function () {
//	alert(0);
//});

// Particular dashboard load function
function dashboard_changes(logged_user_role) {
	var currurl = window.location.href;
	var data = currurl.split('/');
	if (logged_user_role == "Manager") {
		var actionurl = currurl.replace(data[3]+'/','hrms_mgmd/');
		window.location.href = actionurl;
	} else if (logged_user_role == "HR") {
		var actionurl = currurl.replace(data[3]+'/','hrms_hrd/');
		window.location.href = actionurl;
	} else if (logged_user_role == "Customer") {
		alert_lobibox("warning", "Design in progress.")
	}
}