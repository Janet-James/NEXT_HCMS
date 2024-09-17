//Organization, Unit, Division and Employee filter library start || TRU || 14Sep18 
//org change
$("#organization").change(function() {
	let org_id = this.value !=0 && dropdownChange('organization_unit',this.value,'organization_unit','Unit');
});

//org unit change
$('#organization_unit').change(function() {
	let org_unit_id = this.value !=0 && dropdownChange('organization_division',this.value,'organization_division',' Division');
});

//org division change
$('#organization_division').change(function() {
	let org_unit_id = this.value !=0 && dropdownChange('organization_employee',this.value,'organization_employee','Division Employee');
});

//org unit values
function dropdownChange(status,value,id,content){
	$.ajax({
		url : "/hcms_dropdown_change/",
		type : "GET",
		data : { 'status':status, 'value':value },
		timeout : 10000,
		async:false,
	}).done( function(json_data) {
		datas = JSON.parse(json_data);
		dropDownList(datas.results,id,content);
	});
}

//drop down list
function dropDownList(data,id,content){
		strAppend = '<option value="0">--Select Organization '+content+'--</option>'
		if(data.length>0){
			for(var i=0;i<data.length;i++){
				strAppend += '<option value="'+data[i].id+'">'+data[i].name+'</option>'
			}
			$('#'+id).html(strAppend).change();
		}else{
			$('#'+id).html(strAppend).change();
		}
}
//Organization, Unit, Division and Employee filter library end || TRU || 14Sep18 