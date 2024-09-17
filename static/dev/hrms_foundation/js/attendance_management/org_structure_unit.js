$(document).ready(function(){
	$('[data-toggle="tooltip"]').tooltip();
    setInterval(function(){ $('a[title="GetOrgChart jquery plugin"]').hide(); $('.myCustomTheme-box').attr('rx','0');}, 10);
    //org unit structure 07-03-2018
    $("#organization_id").val(0).change();
    //select function here
    $('#org_unit_search').click(function(){
    	if($('#organization_id').val() != 0){
    		$('#orgModal').modal('show');
    	}else{
    		alert_lobibox("info",sysparam_datas_list['NTE_56']);
    	}
	}); 
});

//org change
$("#organization_id").change(function() {
	if($('#organization_id option:selected').val() != 0) {
		org_unit_structure($('#organization_id option:selected').val(),0); 
	}else{
		$('#organization_unit_id').val(0).change();
		$('#org_unit_structure').html('<div class="col-md-12"><h3 style="text-align: center;color:#e73d4a;">No data available.</h3></div>');
		return true;
	}
});

//org unit structure
function org_unit_structure(org_id,status){
	if(status == 0){
		datas = {'org_id':org_id};
	}
	$.ajax({
		url : '/hrms_unit_structure_list_data/',
		type : "GET",
		data : datas,
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		datas = JSON.parse(json_data);
		let org_unit_team_datas = [];
		let res_datas = datas.results[0];
		let org_unit_details = res_datas['org_unit_details']
		let team_details = res_datas['team_details']
		if(org_unit_details.length>0){
			for(let i=0;i<org_unit_details.length; i++){
				org_unit_data = {}
				org_unit_data['id'] = org_unit_details[i]['id'];
				org_unit_data['parentId'] = org_unit_details[i]['parent'];
				org_unit_data['name'] = org_unit_details[i]['name'];
				org_unit_data['title'] = '( '+org_unit_details[i]['title']+' )';
				org_unit_data['image'] = "images/f-8.jpg"
					org_unit_team_datas.push(org_unit_data);
				let team_len = team_details.length;
				if(team_len > 0){
					for(let j=0; j<team_len; j++){
						if(team_details[j].org_unit_id == org_unit_details[i]['id']){
							let teams = team_details[j]['teams'];
							for(let k=0; k<teams.length;k++){
								team_data = {}
								team_data['id'] = 'team-'+teams[k]['id'];
								team_data['parentId'] = team_details[j].org_unit_id;
								team_data['name'] = teams[k]['name'];
								team_data['title'] = '( Divison )';
								team_data['image'] = "images/f-8.jpg"
									org_unit_team_datas.push(team_data);
							}
						}
					}
				}
			}
			$('svg').removeAttr('viewBox');
			orgUnitDataParse(org_unit_team_datas)
			//getorgchart customized
			$('.myCustomTheme-box').attr('rx','0');
			$('.myCustomTheme-box .get-text').css({'font-size':'20px'});
		}else{
			$('#org_unit_structure').html('<div class="col-md-12"><h3 style="text-align: center;color:#e73d4a;">No data available.</h3></div>');
			return true;
		}
		
	});
}
//org data parsing 
function orgUnitDataParse(data){
	getOrgChart.themes.myCustomTheme =
	{
			size: [270, 115],
			toolbarHeight: 46,
			textPoints: [
			             { x: 130, y: 50, width: 250 },
			             { x: 130, y: 70, width: 250 }
			             ],

			             expandCollapseBtnRadius: 15,
			             defs: '<filter id="f1" x="0" y="0" width="200%" height="200%"><feOffset result="offOut" in="SourceAlpha" dx="0" dy="0" /><feGaussianBlur result="blurOut" in="offOut" stdDeviation="-5" /><feBlend in="SourceGraphic" in2="blurOut" mode="normal" /></filter>',
			             box: '<rect x="0" y="0" height="100" width="270" rx="10" ry="10" class="myCustomTheme-box" filter="url(#f1)"  />',
			             text: '<text text-anchor="middle" width="[width]" class="get-text get-text-[index]" x="[x]" y="[y]">[text]</text>',
	};


	var peopleElement = document.getElementById("org_unit_structure");
	var orgChart = new getOrgChart(peopleElement, {
		theme: "myCustomTheme",
		primaryFields: ["name", "title"],
		photoFields: ["image"], 
		expandToLevel: 2,
		enableEdit: false,
        enableDetailsView: false,
        enableSearch: false,
        enableZoom: true,
        enablePrint: false,
        enableGridView: false, 
        enableExportToImage: false,
        enableZoomOnNodeDoubleClick: true,
		levelSeparation: 100,
		linkType: "B",
		clickNodeEvent: orgUnitClickHandler,
		dataSource:data
	});
	$('.get-oc-tb').show();
	$('.get-text-1').attr('y','75');
	//$('.get-oc-tb').addClass('btn blue');
}

//org unit click handler here
function orgUnitClickHandler(sender, args) {
	var event_id = args.node.id;
	org_unit_structure_changes(event_id);
}

