var event_id = 0;
$(document).ready(function(){
	$('[data-toggle="tooltip"]').tooltip();
    setInterval(function(){ $('a[title="GetOrgChart jquery plugin"]').hide(); }, 10);
    $("#organization_id").val(0).change();
    //select function here
    $('#org_unit_search').click(function(){
    	var org_id = $('#organization_id').val();
    	if(org_id != 0){
    		$('#organization_id_popup').val(org_id).change();
    		$('#organization_id_popup').attr("disabled", true); 
    		$('#orgModal').modal('show');
    	}else{
    		alert_lobibox("info",sysparam_datas_list['NTE_56']);
    	}
	}); 
   
});

//org unit save function here
$("#org_unit_save").click(function() {
		if(org_unit_id != 0){
			$('#organization_unit_id').val(org_unit_id).change();
		}else{
			return true;
		}
});

//org data parsing
function orgDataParse(data){
	getOrgChart.themes.myCustomTheme =
	{
			size: [550, 196],
	        toolbarHeight: 46,
	        textPoints: [{
	        	x: 190,
	            y: 45,
	            width: 290
	        }, {
	            x: 190,
	            y: 75,
	            width: 290
	        }, {
	            x: 190,
	            y: 105,
	            width: 290
	        }, {
	            x: 190,
	            y: 135,
	            width: 290
	        }, {
	            x: 30,
	            y: 185,
	            width: 350
	        }],
	        textPointsNoImage: [{
	            x: 10,
	            y: 180,
	            width: 250
	        }],
	        expandCollapseBtnRadius: 20,
            defs: '<filter id="f1" x="0" y="0" width="100%" height="100%"><feOffset result="offOut" in="SourceAlpha" dx="5" dy="5" /><feGaussianBlur result="blurOut" in="offOut" stdDeviation="5" /><feBlend in="SourceGraphic" in2="blurOut" mode="normal" /></filter>',
	        box: '<rect x="0" y="0" height="175" width="500" rx="10" ry="0" class="get-box" />',
	        text: '<text width="[width]" class="get-text get-text-[index]" x="[x]" y="[y]">[text]</text>',
	        image: '<image xlink:href="[href]" x="30" y="30" height="120" preserveAspectRatio="xMidYMid slice" width="120"/>'
	};
	var orgchart = new getOrgChart(document.getElementById("org_structure"), {
		theme: "myCustomTheme",
		linkType: "B",
		expandToLevel: 2,
		enableEdit: false,
        enableDetailsView: false,
        enableSearch: false,
        enableZoom: true,
        enablePrint: false,
        enableGridView: false, 
        enableExportToImage: false,
        enableZoomOnNodeDoubleClick: true,
        orientation: getOrgChart.RO_TOP,
		clickNodeEvent: clickHandler,
		primaryFields: ["name", "title", "eid", "mail"],
		photoFields: ["image"],
		dataSource: data
	});
	$('.get-oc-tb').show();
	$('.get-text-1').attr('y','70');
	$('.get-text-2').attr('y','125');
	$('.get-text-3').attr('y','145');
//	$('.get-oc-tb').addClass('btn blue');
}

//org click event
function clickHandler(sender, args) {
	var emp_id = args.node.id;
	localStorage.setItem('emp_id', emp_id);
	window.location = '/hrms_employee/';
	/*$('#names').val(args.node.data.name);
	$('#title').val(args.node.data.title);
	$('#phone').val(args.node.data.phone);
	$('#address').val(args.node.data.address);
	$('#mail').val(args.node.data.mail);
	$('#poi_id').val(args.node.pid).change();
	pid = (args.node.pid == 0 || args.node.pid == null) ? alert_lobibox("info","Access permission denied.") : $('#orgSelect').modal('show');;
	event_id = args.node.id*/
}

//org change
$("#organization_id").change(function() {
	if($('#organization_id option:selected').val() != 0) {
		org_data($('#organization_id option:selected').val(),0); 
	}else{
		$('#organization_unit_id').val(0).change();
		$('#org_structure').html('<div class="col-md-12"><h3 style="text-align: center;color:#e73d4a;">No data available.</h3></div>');
		return true;
	}
	$('#organization_id option:selected').val() != 0 ? org_unit($('#organization_id option:selected').val(),0) : '';
});

//org unit
function org_unit(val){
	$.ajax({
		url : "/hrms_org_unit_change_structure_data/",
		type : "GET",
		data : {'id':val},
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		datas = JSON.parse(json_data);
		dropDownList(datas.results,'organization_unit_id','u');
	});
}

//org unit change
$("#organization_unit_id").change(function() {
	if($('#organization_unit_id option:selected').val() != 0){
		org_data($('#organization_unit_id option:selected').val(),1)
	}else{
		return true;
	} 
});

//org data 
function org_data(val,status){
	if(status == 0){
		datas = {'id':val};
		urls = "/hrms_org_structure_data/"
	}else{
		datas = {'o_id':$('#organization_id option:selected').val(),'ou_id':val};
		urls = "/hrms_org_unit_structure_data/"
	}
	$.ajax({
		url : urls,
		type : "GET",
		data : datas,
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		datas = JSON.parse(json_data);
		var org_data = [];
		var res_datas = datas.results;
		if(res_datas.length>0){
			for(var i=0;i<res_datas.length; i++){
				json_data = {}
				json_data['id'] = res_datas[i]['id'];
				json_data['parentId'] = res_datas[i]['parentId'];
				json_data['name'] = res_datas[i]['name'];
				json_data['title'] = res_datas[i]['title'];
				json_data['mail'] = res_datas[i]['email'];
				json_data['eid'] = res_datas[i]['eid'];
				json_data['address'] = res_datas[i]['address'];
				json_data['image'] = image_path+res_datas[i]['image'];
				org_data.push(json_data);
			}
			orgDataParse(org_data);
			//position fixing
			//$('svg').removeAttr('viewBox');
			//$('svg').each(function () { $(this)[0].setAttribute('viewBox', '-1298,-117,4014.9999999999995,1715.727452271231') });
			dropDownList(datas.emp,'poi_id','o');
		}else{
			$('#org_structure').html('<div class="col-md-12"><h3 style="text-align: center;color:#e73d4a;">No data available.</h3></div>');
		}
		
	});
}

//drop down list
function dropDownList(data,id,status){
	if(status == 'o'){
		strAppend = '<option value="0">--Select--</option>'
	}else{
		strAppend = '<option value="0">--Select Organization Unit--</option>'
	}
	if(data.length>0){
		for(var i=0;i<data.length;i++){
			strAppend += '<option value="'+data[i].id+'">'+data[i].name+'</option>'
		}
	}
	$('#'+id).html(strAppend);
}
//update function here
function updateOrgPopupConfirmation(){
	var status = hrms_org_popup_validation()
	if(status){
		dataForm();
	}
}

//data form in object
function dataForm(){
	if(hrms_org_popup_validation()){
		if(event_id !=0 && event_id != undefined){
			project_list = [];
			project_dict = {};
			var project_form_value = getFormValues("#hrms_org_structure_popup");
			project_form_value['event_id'] = event_id;
			project_list.push(project_form_value);
			project_dict['input_data'] = project_list;
			json_response = JSON.stringify(project_dict);
			method = 'POST';
			url = "/hrms_org_update_operation/";
			crud_function(method, json_response, url);	
			p_id = 0;
		}
	}else{
		alert_lobibox("info","Position id is same . so please select other");
	}
	
}

//update function here
function crud_function(methods, datas, urls) {
	$.ajax({
		url : urls,
		type : methods,
		data : { "results":datas },
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		var res_status = data['results']
		if(res_status){
			alert_lobibox("success", sysparam_datas_list[res_status]);
		}
		$('#orgSelect').modal('hide');
		$("#organization_id").val($('#organization_id option:selected').val()).change();
		event_id = 0;
	});
}

//form reset function here
function clearOrgPopupConfirmation(){
	 $('#hrms_org_structure_popup')[0].reset();
	 $('.errorTxts').html('');
}

//jquery org popup validation
//jquery attendance validation
jQuery.validator.addMethod('valueNotEquals', function (value) {
  return (value != '0');
}, "year required");
jQuery.validator.addMethod('valueNotEqualsPosition', function (value) {
	  return (event_id != parseInt($("#poi_id option:selected").val()));
	}, "Reporting officer not same.please select valid");

$('#hrms_org_structure_popup').submit(function(e) {
	e.preventDefault();
}).validate({
	rules: {
		names: {
			required: true,
		},
		title: {
			required: true,
		}, 
		phone: {
			required: true,
		},  
		mail: {
			required: true,
		},  
		address: {
			required: true,
		},  
		poi_id: {
			required: true,
			valueNotEquals:true,
			valueNotEqualsPosition:true
		}, 
	},
//	For custom messages
messages: {
	names: {
		required: "Enter name must",
	},title: {
		required: "Enter title must",
	},mail: {
		required: "Enter mail must",
	},phone: {
		required: "Enter phone must",
	},address: {
		required: "Enter address must",
	},poi_id: {
		required: "Select reporting officer must",
		valueNotEquals:"Select vailid reporting officer",
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

//form is valid or not
function hrms_org_popup_validation()
{
	return $('#hrms_org_structure_popup').valid();
}

