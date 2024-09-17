var res_data='',table_id=0,width=0;
var url="",row_click=0,row_id=0;
$('#progress_bar').hide();

//read function here
$(document).ready(function(){
	var post_data={};
	post_data["type"]="choose";
	candidateDropdown(post_data);
	//CULTR,CLRFN,COMPS
	var post_data={};
	post_data["type"]="reference";
	post_data["code"]="CONCN"
	var ref_val=DropdownValues(post_data);
	load_refitems("connection_chcekbox_div",ref_val);
	var post_data={};
	post_data["type"]="reference"; 
	post_data["code"]="CULTR"
	var ref_val=DropdownValues(post_data);
	load_refitems("culture_chcekbox_div",ref_val);
	var post_data={};
	post_data["type"]="reference";
	post_data["code"]="CLRFN" 
	var ref_val=DropdownValues(post_data);
	load_refitems("clarification_chcekbox_div",ref_val);
	var post_data={}; 
	post_data["type"]="reference";
	post_data["code"]="COMPS" 
	var ref_val=DropdownValues(post_data); 
	load_refitems("compliance_chcekbox_div",ref_val);
	button_create(1) 
	on_boarding_datatable_function();
	var assetData = "<p class='no_data_found'>Asset Details Not Found.</p>" ;
	$('#asset_details').html(assetData);  
})

//load function here
function load_refitems(id,res){
	if(res){
	$('#'+id).html(res.map(function(r){
		return '<label class="label-cbx">'+
	    '<input id="cbx" value="'+r.id+'" class="'+id+' invisible" name="test" type="checkbox">'+
	    '<div class="checkbox">'+
	      '<svg width="20px" height="20px" viewBox="0 0 20 20">'+
	        '<path d="M3,1 L17,1 L17,1 C18.1045695,1 19,1.8954305 19,3 L19,17 L19,17 C19,18.1045695 18.1045695,19 17,19 L3,19 L3,19 C1.8954305,19 1,18.1045695 1,17 L1,3 L1,3 C1,1.8954305 1.8954305,1 3,1 Z"></path>'+
	        '<polyline points="4 11 8 15 16 6"></polyline>'+  
	      '</svg>'+ 
	    '</div>'+  
	    '<span>'+r.refitems_name+'</span>'+
	    '</label>'
		}))    
	}  
   }  

//dropdown function here
function DropdownValues(post_data) { 
var res_data=[]; 
	$.ajax({   
		url : '/ta_job_openings_dropdown/',
		type : 'POST',   
		data:post_data, 
		timeout : 10000,   
		async : false,   
	}).done(   
			function(json_data)    
			{   
				var data = JSON.parse(json_data); 
				if(data.vals){     
					res_data=data.vals;
				//	setDropdownValues(res_data,id,key,value)
				} 
			});  
	return res_data;  
}   

//candidate drop down function here
function candidateDropdown(post_data) { 
	var res_data=[]; 
		$.ajax({     
			url : '/ta_on_boarding_data/', 
			type : 'POST',   
			data:post_data, 
			timeout : 10000,   
			async : false,   
		}).done(    
				function(json_data)      
				{  
					var data = JSON.parse(json_data);
					if(data.datas){      
						res_data=data.datas;
						setDropdownValues(res_data,"join_candidate","id","name")
					} 
				});  
	} 

//set drop down function here
function setDropdownValues(res,id,key,value){
	$('#'+id).append(res.map(function(r){return $('<option>',{        	
		value : r[key], 
		text : r[value]   
	})
	}))
} 

//on boarding create function here
function on_boarding_create() {
	var isvalid = on_boarding_form_validation();  
	if (isvalid) {  
		add_update("", "add");  
	}
} 

//on boarding update function here
function on_boarding_update(){  
	if(table_id!=0){
		var isvalid = on_boarding_form_validation();
		if (isvalid) {
			add_update(table_id, "update");
		}
	} 
}

//candidate change function here
$('#join_candidate').on('change', function() {
	if(this.value!=0){
		url="";
		//table_id = (this.value)
		$('#progress_bar').show();
		onBoardrowclick(this.value);		
	}else if(this.value==0){
		clear_check();
		var assetData = "<p class='no_data_found'>Asset Details Not Found.</p>" ;
		$('#asset_details').html(assetData);
		$('#progress_bar').hide();
		$('.nav-pills a[href="#pills-tab1"]').tab('show');
	}
});

//set candidate function here
function setCandidate(id){
	$("#join_candidate").val(id).trigger("change");
}

//set check function here
function setCeck(strarray){
	//alert(JSON.stringify(strarray))
	var elem = document.getElementById("myBar");
	var checked=0,notchecked=0;
	for(var i=0;i<Object.keys(strarray[0]).length;i++){
	if(Object.keys(strarray[0])[i]!="id"){	
	var str=strarray[0][Object.keys(strarray[0])[i]]
	if(str !='[]'){  
	str=str.replace('[',' '); 
	str=str.replace(']',' ');
	str = str .split(',');
	str.map(function(val){
		$("input[value=" + val+ "]").prop('checked', true);
	}) 
	} 
	}
	}
	checked+= $("input.connection_chcekbox_div:checked").length;
	notchecked+= $("input.connection_chcekbox_div:not(:checked)").length;
	checked+= $("input.culture_chcekbox_div:checked").length;
	notchecked+= $("input.culture_chcekbox_div:not(:checked)").length;
	checked+= $("input.clarification_chcekbox_div:checked").length;
	notchecked+= $("input.clarification_chcekbox_div:not(:checked)").length;
	checked+= $("input.compliance_chcekbox_div:checked").length;
	notchecked+= $("input.compliance_chcekbox_div:not(:checked)").length;
	overall=checked+notchecked
	var avg=(checked*100/overall).toFixed(1);
	
	elem.style.width = avg + '%'; 
	elem.innerHTML = avg * 1  + '%';
	var checked=0,notchecked=0;
	if(avg==0.0){
		$('#progress_bar').hide(); 
	}
}

//set asset function here
function setAsset(asset_details){
    $('.nav-pills a[href="#pills-tab2"]').tab('show');
	if(asset_details && asset_details!=""){
		var assetData = "<ul class='list-group'>" ;
		for(var i=0; i<asset_details.length; i++ ){
			assetData += "<li class='list-group-item asset_list_details'>"+'<span>No : '+asset_details[i].rno+'</span><br>'+'<span>Name : '+asset_details[i].asset_name+'</span><br>'+'<span>Serial : '+asset_details[i].asset_serial+'</span><br>'+'<span>Model : '+asset_details[i].asset_model+'</span><br>'+'<span>Givn Date : '+asset_details[i].given_date+'</span> </li>';
		}
		assetData +="</ul>";
		$('#asset_details').html(assetData);  
		}
	else{
		var assetData = "<p class='no_data_found'>Asset Details Not Found.</p>" ;
		$('#asset_details').html(assetData);    
	}
}

//set on boarding data function here
function setOnboardingData(res){
	width=0;
	var status_result = res.datas;
	var asset_result = res.asset_details;
	table_id = status_result[0].id;
	setAsset(asset_result);
	/*setCeck(status_result[0].connection)
	setCeck(status_result[0].culture)
	setCeck(status_result[0].clarification)*/
	setCeck(status_result)
}

//table row click get id
$("#on_boarding_table").on("click", "tr", function() {
	if (!this.rowIndex) return; // skip first row  
	id = $('#on_boarding_table').dataTable().fnGetData(this)[0];
	if (id != 0) {
		dataTableAcitveRowAdd('on_boarding_table',$(this).index());//active class add
		table_id = id;
		setCandidate(id);
	}
}); 

//on boarding row click function here
function onBoardrowclick(id){ 
	if(id){		
		post_data={};  
		post_data['type']="row" 
		post_data['table_id']=id;
		var res =getTableData(post_data);
		if(res.datas!="" && res.datas !=undefined){
			button_create();
			clear_check();
			setOnboardingData(res);	  
		}
		else{
			var assetData = "<p class='no_data_found'>Asset Details Not Found.</p>" ;
			$('#asset_details').html(assetData);
			$('#progress_bar').hide();
			clear_check();
			button_create(1);
		}
	}
} 

//cancel clear function call button
function on_boarding_clear_conform(){
	if(table_id != 0 ){
		var title = $('#join_candidate option:selected').text();
		orgClearFuncton('on_boarding_cancel','',title);
	}else{
		on_boarding_cancel();
	}
}

//clear on_boarding_cancel function here
function on_boarding_cancel(){
	$('#on_boarding_table tbody tr').removeClass('selected');
	$('#asset_details').html("");
	$('input:checkbox').removeAttr('checked');
	//$('#on_boarding_form')[0].reset();
	$('#join_candidate').val(0).trigger("change");
	$('.panel-heading').removeClass('active');
	$('.panel-collapse').collapse('hide');
	button_create(1) 
}

//clear check function here
function clear_check(){
	$('input:checkbox').removeAttr('checked');
}

//on boarding data get function here
function on_boarding_datatable_function(){  
	post_data={};
	post_data['type']="all"
		var res =	getTableData(post_data);
	drawDatatable(res); 
}

//Offer management data table function here
function drawDatatable(data){
	columns = [{title : "ID"},{title : "No."}, {title : "Name"	}, {title : "Email"}]
	if(data.datas.length>0){  
		plaindatatable_btn('on_boarding_table', data.datas, columns,0,'NEXT_TRANSFORM_HCMS_DOW_EMPLOYEE_LEAVE_REQUEST_'+currentDate());
	}else{
		plaindatatable_btn('on_boarding_table', [], columns,0);
	}
}

//get data function here
function getTableData(param){  
	var data="";  
	$.ajax({  
		url : "/ta_on_boarding_data/",  
		type : 'POST',   
		timeout :10000,     
		data:param,  
		async:false,	 
	}).done(function(json_data){ 
		data = JSON.parse(json_data)
	});
	return data;
} 

//on boarding operation function here
function add_update(id, operation) { 
	if (operation == undefined) {
		operation = "remove";
	}
	var connection =[],culture=[],clarification=[],compliance=[];
	var  join_candidate=$('#join_candidate').val();
	 $('.connection_chcekbox_div:checked').each(function(index){
		 connection[index]=$(this).val(); 
	 });
	 $('.culture_chcekbox_div:checked').each(function(index){
		 culture[index]=$(this).val(); 
	 });
	 $('.clarification_chcekbox_div:checked').each(function(index){
		 clarification[index]=$(this).val(); 
	 });
	 $('.compliance_chcekbox_div:checked').each(function(index){
		 compliance[index]=$(this).val();  
	 });
	if (id && operation == "update") {
		on_board_update_data = { 
					'join_candidate':join_candidate,   
					'connection' : connection,
					'culture' : culture,
					'clarification' : clarification, 
					'compliance':compliance 
				}  
		var vals = { 
				'results' : JSON.stringify(on_board_update_data),
				'delete_id' : '',
				'update_id' : id,
				csrfmiddlewaretoken : $("input[name=csrfmiddlewaretoken]").val()
		}
	} else if (!id && operation == "add") {
		on_board_create_data = {
				'join_candidate':join_candidate,   
				'connection' : connection,
				'culture' : culture,   
				'clarification' : clarification, 
				'compliance':compliance 
		}      
		var vals = {
				'results' : JSON.stringify(on_board_create_data),
				'delete_id' : '', 
				'update_id' : '',
				csrfmiddlewaretoken : $("input[name=csrfmiddlewaretoken]").val()
		}
	} else if (id && operation == "remove") {
		if (table_id != 0) {
			var vals = {
					'results' : "",
					'delete_id' : table_id,
					'update_id' : '',
					csrfmiddlewaretoken : $("input[name=csrfmiddlewaretoken]").val()
			}
		}
	}  
	$.ajax({  
		url : '/ta_on_boarding_crud/',
		type : 'POST', 
		data : vals,
		timeout : 10000,
		async : false,
	}).done(function(json_data) { 
		var data = JSON.parse(json_data); 
		// alert_status(data.results)
		if (data.results=="ERR0503"){ 
			alert_lobibox("error", sysparam_datas_list[data.results]);		
		} 
		else if(data.results == 'NTE_03'){

			button_create(1);	
			alert_lobibox("success", sysparam_datas_list[data.results]);
			//offer_datatable_function();
			on_boarding_cancel();
			setCandidate(table_id) 
		}
		else if(data.results == 'ERR0020') {	
			alert_lobibox("warning","Offer candidate name already exists");
			//job_offer_clear();
		}
		else{
			
			table_id = 0;
			alert_lobibox("success", sysparam_datas_list[data.results]);
			//offer_datatable_function(); 
			button_create(1); 
			on_boarding_cancel();
		} 
	});
}

//jquery leave validation
jQuery.validator.addMethod('valueNotEquals', function(value) {
	return (value != '0');
}, "country required");


$('.select2').select2().change(function() {
	$('.errorTxts').html('');
});
$('#on_boarding_form').submit(function(e) {
	e.preventDefault();
}).validate({

	rules : {
		join_candidate: {
			required:true,
			valueNotEquals:true,
		},
	},
	// For custom messages
	messages:{
		join_candidate : {
			required: "Select Candidate",
			valueNotEquals: "Select Candidate", 
		}, 
	},
	errorElement : 'div',
	errorPlacement : function(error, element) {
		var placement = $(element).data('error');
		if (placement) {
			$(placement).append(error)
		} else {
			error.insertAfter(element);  
		}
	},
	ignore : [] 
});
//on_boarding_form validations here   
function on_boarding_form_validation() {
	return $('#on_boarding_form').valid();
}
$('.select2').select2().change(function(){
	$('.errormessage').html('');
});

//button create function here 
function button_create(status) {
	var access_for_create = jQuery.inArray( "On boarding", JSON.parse(localStorage.Create) );
	var access_for_write = jQuery.inArray( "On boarding", JSON.parse(localStorage.Write) );
	var access_for_delete = jQuery.inArray( "On boarding", JSON.parse(localStorage.Delete) );
	var strAppend = ''; 
	if (status == 1) {
		if (access_for_create != -1){
			strAppend = "<button type='button'id='on_boarding_add' onclick='on_boarding_create()' class='btn btn-success btn-eql-wid btn-animate'>Add</button>"
		}
		strAppend += " <button type='button'id='on_boarding_clear' onclick='on_boarding_clear_conform()' class='btn btn-warning btn-animate btn-eql-wid btn-animate'>Cancel / Clear</button>"
			$('.on_boarding_bttn').html(strAppend);
	} else {
		if (access_for_write != -1){
			strAppend = "<button type='button' onclick='on_boarding_update()' class='btn  btn-primary btn-eql-wid btn-animate '>Update</button>"
		}if (access_for_delete != -1){
			//strAppend += " <button type='button' onclick='job_offer_delete()' class='btn btn-danger btn-eql-wid btn-animate '>Remove</button>"
		}
		strAppend += " <button type='button' onclick='on_boarding_clear_conform()' class='btn btn-warning btn-eql-wid btn-btn-animate'>Cancel / Clear</button>"
			$('.on_boarding_bttn').html(strAppend);
	}
}
 



