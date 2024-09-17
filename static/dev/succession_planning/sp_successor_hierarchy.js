var event_id = 0;
$(document).ready(function(){
	$('[data-toggle="tooltip"]').tooltip();
    setInterval(function(){ $('a[title="GetOrgChart jquery plugin"]').hide(); }, 10);
    $("#organization_id").val(0).change();
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
//		expandToLevel: 5,
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
	let getEmployeeDetailsResult = getEmployeeDetails({ 'emp_id':emp_id });
	if(getEmployeeDetailsResult){
		let profileDetails = getEmployeeDetailsResult['emp_details'];
		profileGridDiv(profileDetails);
		$("#profile_grid").removeClass("open");
		$("#profile_grid").addClass("open");
		$('#profile_grid').show();
	}else{
		$('#profile_grid').hide();
	}
}

//employee details
function getEmployeeDetails(datas){
	var profile_dev_datas;
	$.ajax({
		url : "/sp_employee_profile_list/",
		type : "GET",
		data : datas,
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		profile_dev_datas = JSON.parse(json_data);
	});
	return profile_dev_datas.datas[0 ];
}

//profile grid show
function profileGridDiv(profileDetails){
	if(profileDetails.length > 0){
		$('#profile').attr("src",image_path+profileDetails[0].image); 
		$('#name').html(profileDetails[0].name);
		$('#position').html(profileDetails[0].role);
		$('#email').html(profileDetails[0].email);
		$('#mobile').html(profileDetails[0].mobile);
		$('#country').html(profileDetails[0].country);
		$('#date').html(profileDetails[0].doj);
		$('#org').html(profileDetails[0].org);
		$('#org_unit').html(profileDetails[0].org_unit);
		$('#divison').html(profileDetails[0].team);
	}
}

//org change
$("#organization_id").change(function() {
	if($('#organization_id option:selected').val() != 0) {
		org_data($('#organization_id option:selected').val(),0); 
	}else{
		$('#org_structure').html('<div class="col-md-12"><h3 style="text-align: center;color:#e73d4a;">No data available.</h3></div>');
		return true;
	}
});

//org data 
function org_data(val,status){
	datas = {'id':val};
	urls = "/sp_successor_hierarchy_list/"
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
		}else{
			$('#org_structure').html('<div class="col-md-12"><h3 style="text-align: center;color:#e73d4a;">No data available.</h3></div>');
		}
		
	});
}


