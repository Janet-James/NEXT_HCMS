var sysparam_datas_list = [];

$(document).ready(function () { 
	$.ajax({
		type  : 'GET',
		url   : '/sysparam_load/',
		async : false,
	}).done( function(jsondata) {
		var data = JSON.parse(jsondata);
		if (data.status == "NTE_01") {
			sysparam_datas_list = data.sysparam_datas;
		} else {
			alert_lobibox("error", data.status);
		}
	});
});