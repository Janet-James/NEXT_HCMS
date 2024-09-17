function tableInit(tableId,tbl_columns){
	var ti_role_def_table=$('#'+tableId).DataTable({
		columns: tbl_columns,
		language: {
			aria: {
				sortAscending: ": activate to sort column ascending",
				sortDescending: ": activate to sort column descending"
			},
			emptyTable: "No data available",
			info: "Showing _START_ to _END_ of _TOTAL_ entries",
			infoEmpty: "No entries found",
			infoFiltered: "(filtered1 from _MAX_ total entries)",
			lengthMenu: "_MENU_ entries",
			search: "",
			zeroRecords: "No matching records found"
		},
		buttons:[],
		dom: "<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-12'><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-6 col-sm-12'i><'col-md-6 col-sm-12'lp>>"

	});
}

$( document ).ready(function() {
	$("#demotion_update").hide();
	columnsDemotion=[{'title':'No'},{'title':'Employee Name'},{'title':'Requested By'},{'title':'Requested Date'},{'title':'Reason'},{'title':'Status'},{'title':'Effective Date'}];
	tableInit("demotion_table",columnsDemotion)
})