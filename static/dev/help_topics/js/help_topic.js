var selected_module_text = [], selected_module_id = [];

$(document).ready(function() { 
	var currurl = window.location.href;
	var module_name = currurl.split('/');
	tree_form(module_name[module_name.length - 2]);
});

function tree_form(module_name) {
	if (module_name == "SysAdmin") {
		var data = [{
			text: "AppAdmin",
			children: [{
				text: "Introduction",
			}, {
				text: "Data Management",
				icon: "fa fa-file icon-state-danger"
			}, {
				text: "Manage Application Data",
				icon: "fa fa-file icon-state-success",
				children: [{
					text: "Manage Reference Item Category",
					icon: "fa fa-file icon-state-warning"
				},{
					text: "Manage Reference Items",
					icon: "fa fa-file icon-state-success",
				},]
			},  {
				text: "User Management",
				icon: "fa fa-file icon-state-danger",
				children: [{
					text: "Manage Users",
					icon: "fa fa-file icon-state-warning"
				}, {
					text: "Manage User Groups",
					icon: "fa fa-file icon-state-success"
				},]
			},
			{
				text: "Access Management",
				icon: "fa fa-file icon-state-danger",
				children: [{
					text: "Manage System User Roles",
					icon: "fa fa-file icon-state-warning"
				}, {
					text: "Manage Permissions",
					icon: "fa fa-file icon-state-success"
				},{
					text: "Associate Permissions",
					icon: "fa fa-file icon-state-success"
				}]
			},
			{
				text: "Manage Help Content",
				icon: "fa fa-file icon-state-danger",

			},]
		}];
	} else if (module_name == "HRMS") {
		var data = [{
			text: "HRMS",
			children: [{
				text: "Introduction",
			}, {
				text: "Organization Chart",
				icon: "fa fa-file icon-state-danger"
			}, {
				text: "Organization",
				icon: "fa fa-file icon-state-success",
				children: [{
					text: "Organization unit",
					icon: "fa fa-file icon-state-warning"
				},]
			}, {
				text: "Manage Employee",
				icon: "fa fa-file icon-state-warning"
			}, {
				text: "Manage Leave",
				icon: "fa fa-file icon-state-danger",
				children: [{
					text: "Request Leave",
					icon: "fa fa-file icon-state-warning"
				}, {
					text: "Process Leave Request",
					icon: "fa fa-file icon-state-success"
				}, {
					text: "Manage Leave balance",
					icon: "fa fa-file icon-state-default"
				}, {
					text: "Manage Holiday list",
					icon: "fa fa-file icon-state-danger"
				},]
			},
			{
				text: "Manage Attendance",
				icon: "fa fa-file icon-state-danger",
				children: [{
					text: "Attendance",
					icon: "fa fa-file icon-state-warning"
				}, {
					text: "KIOSK",
					icon: "fa fa-file icon-state-success"
				},]
			},
			{
				text: "Generate Reports",
				icon: "fa fa-file icon-state-danger",

			},]
		}];
	} else if (module_name == "TalentAssessment") {
		var data = [{
			text: "TalentAssessment	",
			children: [{
				text: "Introduction",
			}, {
				text: "Balance Scorecard",
				icon: "fa fa-file icon-state-danger"
			}, {
				text: "Cascade Objectives",
				icon: "fa fa-file icon-state-danger"
			}, {
				text: "Manage Assessment Templates",
				icon: "fa fa-file icon-state-danger"
			}, {
				text: "Manage Assessment Form",
				icon: "fa fa-file icon-state-danger"
			}, {
				text: "Schedule Assessment",
				icon: "fa fa-file icon-state-danger"
			}, {
				text: "Perform Talent Assessment",
				icon: "fa fa-file icon-state-danger"
			}, {
				text: "Reports",
				icon: "fa fa-file icon-state-danger"
			}, 
			{
				text: "Manage Rating Schema",
				icon: "fa fa-file icon-state-danger",
			},]
		}];
	} else if (module_name == "TalentDefinition") {
		var data = [{
			text: "Talent Definition",
			children: [{
				text: "Introduction",
			}, {
				text: "Manage Roles",
				icon: "fa fa-file icon-state-danger"
			}, {
				text: "View Reporting Structure",
				icon: "fa fa-file icon-state-danger"
			}, {
				text: "Reports",
				icon: "fa fa-file icon-state-danger"
			}, 
			]
		}];
	} else if (module_name == "WorkforcePlanning") {
		var data = [{
			text: "WorkforcePlanning",
			children: [{
				text: "Introduction",
			}, {
				text: "Strategy Analysis",
				icon: "fa fa-file icon-state-danger",
				children: [{
					text: "Strategy Analysis Step 1",
					icon: "fa fa-file icon-state-warning"
				}, {
					text: "Strategy Analysis Step 2",
					icon: "fa fa-file icon-state-success"
				}, {
					text: "Strategy Analysis Step 3",
					icon: "fa fa-file icon-state-default"
				}, {
					text: "Strategy Analysis Step 4",
					icon: "fa fa-file icon-state-danger"
				},{
					text: "Strategy Analysis Step 5",
					icon: "fa fa-file icon-state-default"
				}, ]
			}, {
				text: "Structure Analysis",
				icon: "fa fa-file icon-state-danger",
				children: [{
					text: "Structure Analysis Step 1",
					icon: "fa fa-file icon-state-warning"
				}, {
					text: "Structure Analysis Step 2",
					icon: "fa fa-file icon-state-success"
				}, {
					text: "Structure Analysis Step 3",
					icon: "fa fa-file icon-state-default"
				}, {
					text: "Structure Analysis Step 4",
					icon: "fa fa-file icon-state-danger"
				},{
					text: "Structure Analysis Step 5",
					icon: "fa fa-file icon-state-default"
				}, ]
				}, {
				text: "System Analysis",
				icon: "fa fa-file icon-state-danger",
				children: [{
					text: "System Analysis Step 1",
					icon: "fa fa-file icon-state-warning"
				}, {
					text: "System Analysis Step 2",
					icon: "fa fa-file icon-state-success"
				}, {
					text: "System Analysis Step 3",
					icon: "fa fa-file icon-state-default"
				}, {
					text: "System Analysis Step 4",
					icon: "fa fa-file icon-state-danger"
				},{
					text: "System Analysis Step 5",
					icon: "fa fa-file icon-state-default"
				}, ]
			}, 
			]
		}];
	} 
	$("#help_topic_tree").jstree({
		core: {
			themes: {
				responsive: !1
			},
			check_callback: !0,
			data: data
		},
		types: {
			"default": {
				icon: "fa fa-file icon-state-warning icon-lg"
			},
			file: {
				icon: "fa fa-file icon-state-warning icon-lg"
			}
		},
		state: {
			key: "demo2"
		},
		plugins: ["contextmenu", "dnd", "state", "types"]
	})
}

$('#help_topic_tree').on('changed.jstree', function (e, data) {
	var currurl = window.location.href;
	var module_name = currurl.split('/');
	module_name = module_name[module_name.length - 2];

	selected_module_text = [];
	selected_module_id = [];
	var i, j;
	for(i = 0, j = data.selected.length; i < j; i++) {
		selected_module_text.push(data.instance.get_node(data.selected[i]).text.replace(/\s/g,''));
		selected_module_id.push(data.instance.get_node(data.selected[i]).id);
	}		
	var actionurl = currurl + selected_module_text[0] + '/';
	var tempactionurl_data = actionurl.split('/');
	tempactionurl_data = tempactionurl_data[tempactionurl_data.length - 2];
	if (tempactionurl_data != "undefined") {
		$.ajax({
			type  : 'GET',
			url   : actionurl,
		}).done( function(jsondata) {
			var data = JSON.parse(jsondata);
			if (data.status == "NTE_01") {
				$('.content_replace').html('');
				$('.content_replace').html(data['posts']);
			} else {
				alert_lobibox('warning', 'Data/Resource not found.');
			}
		});
	}
});