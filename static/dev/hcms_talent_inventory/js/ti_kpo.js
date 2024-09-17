

var ti_kpo_editable_table = function () {
	var e = function () {
		function t(e, t) {
			var n = e.fnGetData(t),
			a = $(">td", t);
			a[0].innerHTML = '<input type="text" class="form-control input-small" value="' + n[0] + '">', 
			a[1].innerHTML = '<input type="text" class="form-control input-small" value="' + n[1] + '">', 
			a[2].innerHTML = '<input type="text" class="form-control input-small" value="' + n[2] + '">', 
			a[3].innerHTML = '<input type="text" class="form-control input-small" value="' + n[3] + '">',
			a[4].innerHTML = '<input type="text" class="form-control input-small" value="' + n[4] + '">',  
			a[5].innerHTML = '<button class="edit btn btn-sm btn-success tooltips" data-toggle="tooltip" data-placement="top" title="Add"> <i class="fa fa-floppy-o"></i> </button> <button class="cancel btn btn-sm btn-danger tooltips" data-toggle="tooltip" data-placement="top" title="Remove"> <i class="fa fa-times"></i> </button>'
		}

		function e(e, t) {
			for (var n = e.fnGetData(t), a = $(">td", t), l = 0, r = a.length; l < r; l++) e.fnUpdate(n[l], t, l, !1);
		}

		function n(e, t) {
			var n = $("input", t);
			if ((n[0].value.trim()=='') || (n[1].value.trim()=='') ||  (n[2].value.trim()=='') || (n[3].value.trim()=='') || (n[4].value.trim()==''))
			{
				alert_lobibox("error", sysparam_datas_list["NTE_25"]);
			}
			else{
				e.fnUpdate(n[0].value, t, 0, !1),
				e.fnUpdate(n[1].value, t, 1, !1),
				e.fnUpdate(n[2].value, t, 2, !1),
				e.fnUpdate(n[3].value, t, 3, !1),
				e.fnUpdate(n[4].value, t, 4, !1),
				e.fnUpdate('<button class="edit btn btn-sm btn-success tooltips" data-toggle="tooltip" data-placement="top" title="Add"> <i class="fa fa-pencil"></i> </button> <button class="delete btn btn-sm btn-danger tooltips" data-toggle="tooltip" data-placement="top" title="Remove"> <i class="fa fa-times"></i> </button>', t, 5, !1),
				e.fnDraw()
			}
		}
		var a = $("#ti_kpo_edit_table"),
		l = a.dataTable({
			lengthMenu: [
			             [5, 15, 20, -1],
			             [5, 15, 20, "All"]
			             ],
			             pageLength: 5,
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
			             buttons: [],
			             columnDefs: [{
			            	 orderable: !0,
			            	 targets: [0]
			             }, {
			            	 searchable: !0,
			            	 targets: [0]
			             }],
			             order: [[0, "asc"]],
			             dom: "<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-12'><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-9 col-sm-12'i><'col-md-3 col-sm-12'lp>>"
		}),
		r = ($("#ti_kpo_edit_table_wrapper"), null),
		o = !1;
		$("#ti_kpo_add_new").click(function (e) {
			var ti_kpo_edit_table = $('#ti_kpo_edit_table').DataTable();
			var kpo_tbl_rows = $('#ti_kpo_edit_table').find('tbody').find('tr');
			var unsaved_data = false;
			if (kpo_tbl_rows[0].innerText != 'No data available'){
				for (var i = 0; i < kpo_tbl_rows.length; i++) {
					var td_edit_data = $(kpo_tbl_rows[i]).find('td:eq(5)').html();
					if (td_edit_data.includes('<i class="fa fa-floppy-o"></i>')){
						unsaved_data = true;
					}
				}
			}
			if(unsaved_data==true){
				alert_lobibox("error", sysparam_datas_list["NTE_28"]);
				return false;
			} else {
				var a = l.fnAddData(["", "", "", "", "", ""]),
				i = l.fnGetNodes(a[0]);
				t(l, i), r = i, o = !0
			}
		}), 
		a.on("click", ".delete", function (e) {
			var t = $(this).parents("tr")[0]; 
			if ($(t).find('td:eq(5)')[0].innerHTML == '<button class="edit btn btn-sm btn-success tooltips" data-toggle="tooltip" data-placement="top" title="Add"> <i class="fa fa-floppy-o"></i> </button> <button class="cancel btn btn-sm btn-danger tooltips" data-toggle="tooltip" data-placement="top" title="Remove"> <i class="fa fa-times"></i> </button>') {
				var t0 = $(r).find('td:eq(0)').find('input').hasClass( "valid" );
				var t1 = $(r).find('td:eq(1)').find('input').hasClass( "valid" );
				var t2 = $(r).find('td:eq(2)').find('input').hasClass( "valid" );
				var t3 = $(r).find('td:eq(3)').find('input').hasClass( "valid" );
				var t4 = $(r).find('td:eq(4)').find('input').hasClass( "valid" );
				if (t0 || t1 || t2 || t3 || t4){
					if (e.preventDefault(), 0 != swal ({
						title: "Are you sure, you want to remove this item?",
						type: "warning",
						showCancelButton: true,
						confirmButtonClass: "btn-danger",
						confirmButtonText: "Yes",
						cancelButtonText: "No",
						closeOnConfirm: true,
						closeOnCancel: true
					},
					function(isConfirm) {
						if (isConfirm) {
							l.fnDeleteRow(t)
						}
					}
					)){}
				} else {
					var t0 = $(r).find('td:eq(0)').find('input').val();
					var t1 = $(r).find('td:eq(1)').find('input').val();
					var t2 = $(r).find('td:eq(2)').find('input').val();
					var t3 = $(r).find('td:eq(3)').find('input').val();
					var t4 = $(r).find('td:eq(4)').find('input').val();
					if (t0 || t1 || t2 || t3 || t4){
						if (e.preventDefault(), 0 != swal ({
							title: "Are you sure, you want to remove this item?",
							type: "warning",
							showCancelButton: true,
							confirmButtonClass: "btn-danger",
							confirmButtonText: "Yes",
							cancelButtonText: "No",
							closeOnConfirm: true,
							closeOnCancel: true
						},
						function(isConfirm) {
							if (isConfirm) {
								l.fnDeleteRow(t)
							}
						}
						)){}
					} else {
						l.fnDeleteRow(t);
						return false;
					}
				}
			} else {
				if (e.preventDefault(), 0 != swal ({
					title: "Are you sure, you want to remove this item?",
					type: "warning",
					showCancelButton: true,
					confirmButtonClass: "btn-danger",
					confirmButtonText: "Yes",
					cancelButtonText: "No",
					closeOnConfirm: true,
					closeOnCancel: true
				},
				function(isConfirm) {
					if (isConfirm) {
						l.fnDeleteRow(t)
					}
				}
				)){}
			}
		}),
		a.on("click", ".cancel", function (t) {
			t.preventDefault(), o ? (l.fnDeleteRow(r), r = null, o = !1) : (e(l, r), r = null)
		}), 
		a.on('click', '.edit', function (a) {
			a.preventDefault();
			nNew = false;
			var i = $(this).parents('tr')[0];
			if (r !== null && r != i) {
				e(l, r);
				t(l, i);
				r = i;
			} else if (r == i && this.innerHTML == ' <i class="fa fa-floppy-o"></i> ') {
				n(l, r);
				r = null;
			}
			else if (this.innerHTML == ' <i class="fa fa-pencil"></i> ') {
				t(l, i);
				r = null;
			}
			else {
				n(l, i);
				r = i;
			}
		})
	};
	return {
		init: function () {
			e()
		}
	}
}();

jQuery(document).ready(function () {
	ti_kpo_editable_table.init()
});

