var org_unit_name = [],org_unit_id=[],organization_unit_type=[] // Get Selected organization unit  id and name   using this varia
var org_select_type="";
$( document ).ready(function() {
	OrganizationUnit_dorpdown()
	$('input[type=radio][id=org_tree_single]').prop('checked', true).trigger("change");
	org_select_type="single";
	//$.jstree.destroy();
	$('#tree_2').jstree("destroy").empty();
	$('input[type=radio][name=org_tree_type]').change(function() {
		$.jstree.destroy();
		$("#organization_unit_type").val(0).trigger("change");
		if (this.value=="single") {		
			org_select_type=this.value;
		}
		else if (this.value=="multi") {
			org_select_type=this.value;
		}
 $("#organization_unit_type").val("").trigger("change");
	})	
	
	
	$("#organization_unit_type").select2({ minimumResultsForSearch: -1 })
	
	
})//ready


	
	
function OrganizationUnit_dorpdown(){ 
	  	var Options={};
	  	var org_Options={};
		Options['']='0';
		org_Options['']='0';
		$.ajax({	
			url : '/hrms_organization_unit_data',  
			type : 'GET',
			timeout : 10000, 
			async:false,}).done(
					function(json_data)
					{
						var data=JSON.parse(json_data);
						if (data.org_unit){
							var org_unit_data = data.org_unit;
							org_unit_data.map(function(value,index) {
								Options[value.refitems_name]=value.id
							});
						if(data.org){
							var org_data = data.org;
							org_data.map(function(value,index) {
								org_Options[value.name]=value.id
							});
						}
							var $el = $("#organization_unit_type");
							$el.empty(); // remove old options
							$el.append("<option value='0' selected>--Select--</option>");
							$.each(Options, function(key,value) {
								$el.append($("<option></option>")
										.attr("value",value).text(key));
							});
							
							
							
							var $el = $("#organization_id_popup");
							//$el.empty(); // remove old options
							$.each(org_Options, function(key,value) {
								$el.append($("<option></option>")
										.attr("value", value).text(key));
							});
						}
					});
	}
$('#organization_unit_type').on('change', function() {
organization_unit_type=$('#organization_unit_type').val();
var organization_id=$("#organization_id_popup").val();
	if(organization_unit_type && organization_id){
	$.ajax({
		url :'/hrms_organization_unit_choose/',
		type:'POST', 
		data : {'parent_org_unit':organization_unit_type,'org_id':organization_id,csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()},
		timeout : 10000, 
		async:false,
	}).done(
			function(json_data)
			{
				var data=JSON.parse(json_data);
				if(data){
				data=data.vals;
				}
				if(organization_unit_type!="0")
				{	
					if(data){
						data.map(function(value,index) {
							if(value.parent==0)
							{
								value.parent="#"
									value["icon"]="nf nf-country";
									value["id"]="jstree-"+value["id"];
							}
							else{  
								value["icon"]="nf nf-location";	
								value["id"]="jstree-"+value["id"];
								value["parent"]="jstree-"+value["parent"];
							}
						});
						if(org_select_type != "" && org_select_type=="multi")
						{
							sm(data);
						}
						else if(org_select_type != "" && org_select_type=="single"){
							sm1(data)
						} 
					}//data
					else
					{
						alert_lobibox("info", sysparam_datas_list['ERR0042']);
					}
				}	
			});
	}
})
function sm(data)
{
	//$.jstree.destroy();
	$('#tree_2').jstree("destroy").empty();
	var $treeview = $("#tree_2");
	$('#tree_2').jstree({
		'core':
		{
			'data':data
		},
		themes: {
			responsive: !1
		},  
		"checkbox" : {
			"keep_selected_style" : false
		},
		"plugins" : [ "checkbox" ] 
	}).on('loaded.jstree', function() {	
		$treeview.jstree('open_all'); 
	})   
	set_data()  
}    
function sm1(data) 
{
	//$.jstree.destroy();   
	$('#tree_2').jstree("destroy").empty();
	var $treeview = $("#tree_2");
	$('#tree_2').jstree({
		'core': {
			'data':data
		},
	}).on('loaded.jstree', function() {
		$treeview.jstree('open_all');
	})
	//$("#tree_1").jstree("open_node",);
	$('#tree_2').jstree(true).redraw(true);
	//$('#parent_organization').val(a)

	set_data()
}
function set_data()
{
	$('#tree_2').on('changed.jstree', function (e, data) {
		org_unit_name=[]
		org_unit_id=[]
		var i, j;
		for(i = 0, j = data.selected.length; i < j; i++) {
			org_unit_name.push(data.instance.get_node(data.selected[i]).text);
			var id = (data.instance.get_node(data.selected[i]).id).split('-')[1];
			org_unit_id.push(id);
		}		
	})  
}
