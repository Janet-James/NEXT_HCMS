var tab_name="";
var c_data={};
cols={};
cols['transfer'] = [{"title":"ID"}, {"title":"No."}, {"title":"Name"}, {"title":"Status"}];
cols['promotion'] = [{"title":"ID"}, {"title":"No."}, {"title":"Name"}, {"title":"Status"}];
cols['demotion'] = [{"title":"ID"}, {"title":"No."}, {"title":"Name"}, {"title":"Status"}];
$(document).ready(function(){
$('#tab1').trigger("click");
removeTags();
})
   let removeTags=()=>{$('#searchtags').tagsinput('destroy');	
   			$('#searchtags').tagsinput({
		    allowDuplicates: false,
		    itemValue: 'id',  // this will be used to set id of tag
		    itemText: 'label', // this will be used to set text of tag
		    freeInput: false,
		});
   } 
//tab click id
	$(".nav-pills li").click(function() {
		tab_name=this.id;
		$('.tab1f .bootstrap-tagsinput input').val(''); 
		fillContent(tabId,tab_name)  
		if(c_data[tab_name]){
			setData(c_data)  
		}   
	});  
	$(".nav-pills li>a").click(function() { 
		tabId=this.id;
		removeTags();   
		$("#report_form_area").empty();  
		$("#report_list_area").empty();
	});	 
let getDropDown=(post_data)=>{res_data ="";
		$.ajax({       
			url : '/sp_report_data/',
			type : 'POST',
			data : post_data,   
			timeout : 10000, 		 
			async : false,
		}).done(function(json_data) { 
			let data = JSON.parse(json_data); 
			if (data.datas) { 
				res_data = data.datas; 
			}
		});  
		return res_data; 
	}
let toTitleCase=(str)=> {return str.replace(/(?:^|\s)\w/g, function(match) { return match.toUpperCase(); });
}
let fillContent=(tabId,tab_name)=>{
	$("#report_form_area").html(
			'<div class="portlet light bordered" id="form_wizard_1"	style="overflow: hidden">'+
				'<div class="portlet-title">'+ 
					'<div class="caption">'+
						'<span class="caption-subject  bold uppercase">'+
							'<span class="step-title"> Filters </span></span>'+
						'</div>'+ 
					'<div class="iconbtn" style="float: right; font-size: 25px;">'+
						'<a onclick="reportSearch('+tab_name+')" href="#" class="btn btn-success btn-animate">'+
						  '<i class="nf nf-search rep_font" title="Search Job Name" style="color:; cursor: pointer;" id="role_search_btn"></i></a>'+ 
						    '<a onclick="clearPage('+tab_name+')" href="#" class="btn btn-warning btn-animate">'+
							'<i class="fa fa-eraser rep_font" title="Cancel / Clear" style="color:; cursor: pointer;" id="search_clear_role"></i></a>'+ 
					'</div>'+
				'</div>'+
				'<form role="form" id="'+tab_name+'_form">'+   
					'<div class="form-body row">'+ 
						'<div class="col-md-12" >'+  
						 '<div class="form-group">'+
							'	<label>Organization <span class="asterisk">*</span>	</label>'+
								'<div class="input-icon">'+ 
									'<select id="'+tab_name+'_organization_id" name="job_organization_id" class="form-control select2" required data-error=".errorTxt0">'+
									  '<option value="0">--Select Organization--</option> '+
									 '</select> <span class="errorTxt0 errormessage errorTxts"></span>'+
								'</div>'+  
							'</div>'+  
							'<div class="form-group">'+ 
	 							'<label>Organization Unit </label>'+   
								'<select id="'+tab_name+'_organization_unit_id" name="'+tab_name+'_organization_unit_id"  class="form-control select2">'+
									'<option value="0">--Select Organization Unit--</option>'+
								'</select>'+ 
							'</div>'+
							'<div class="form-group">'+ 
 							'<label>Division </label>'+  
							'<select id="'+tab_name+'_division" name="'+tab_name+'_division"  class="form-control select2">'+
								'<option value="0">--Select Division --</option>'+
							'</select>'+ 
						'</div>'+
					  	'<div class="form-group">'+ 
							'	<label>First Name </label>'+
							'	<div class="input-icon">'+ 
							'		<i class="nf nf-customer"></i> <input class="form-control"	placeholder="First Name" id="'+tab_name+'_fname" name="'+tab_name+'_fname" onchange="addTag(this);" type="text">'+
							'	</div>'+
							'</div>'+ 
							'<div class="form-group">'+ 
							'	<label>Last Name </label>'+
							'	<div class="input-icon">'+
							'		<i class="nf nf-customer"></i> <input class="form-control"	placeholder="Last Name" id="'+tab_name+'_lname" name="'+tab_name+'_lname" onchange="addTag(this);" type="text">'+
							'	</div>'+  
							'</div>'+
							'<div class="form-group">'+
							'	<label>'+toTitleCase(tab_name)+' Status </label>'+
								'<div class="input-icon">'+  
									'<select id="'+tab_name+'_status_id" name="'+tab_name+'_status_id" class="form-control select2" ">'+
									  '<option value="0">--Select '+toTitleCase(tab_name)+' Status--</option> '+
									 '</select> <span class="errorTxt2"></span>'+
								'</div>'+ 
							'</div>'+
						'</div>'+ 
					'</div>'+
				'</form>'+  
			'</div>')
		$(".select2").select2();
		$("#report_list_area").html('<div class="form-group">'+ 
									'<table class="table table-striped table-bordered table-hover"id="'+tab_name+'_report_details">'+
									'</table>'+
									'</div>	')
		plaindatatable_btn(tab_name+'_report_details',[],cols[tab_name],0);
	// Data feed for dropdown			  
	let post_data={};   
	post_data['table']='organization_info';   
	post_data['type']='dropdown';  
	post_data['condition']='';
	post_data['csrfmiddlewaretoken']=$("input[name=csrfmiddlewaretoken]").val()
	var res=getDropDown(post_data);  
	setDropdownValues(res,tab_name+"_organization_id",'id','name')
	res=[];
	res.push({'id':'REQD','name':'Requested'},{'id':'DAPD','name':'Department Approved'},{'id':'DRJD','name':'Department Rejected'},{'id':'HAPD','name':'HR Approved'},{'id':'HRJD','name':'HR Rejected'},)
	setDropdownValues(res,tab_name+"_status_id",'id','name')
	
$('#'+tab_name+'_organization_id').on('change', function() {
	try { 
		tag_org= this.value !=0 ?$("#searchtags").tagsinput('add', { id:tab_name+'_organization_id', label: 'Organization' }):$("#searchtags").tagsinput('remove', { id: tab_name+'_organization_id', label: 'Organization' });
	}
	catch(err) {  
	    console.log(err)   
	}    
	if (this.value != 0) {$(".errorTxt0").text("");	var post_data={};     
			post_data['table']='organization_unit_info';  
			post_data['type']='dropdown';  
			post_data['org_id']=this.value;      
			post_data['csrfmiddlewaretoken']=$("input[name=csrfmiddlewaretoken]").val()
			var res=getDropDown(post_data);   
			setDropdownValues(res,tab_name+"_organization_unit_id",'id','orgunit_name') 
	} 
});    		 
// for Tags Input        
	$('#'+tab_name+'_organization_unit_id').on('change', function() {
		try { 
			tag_org_unit= this.value !=0 ?$("#searchtags").tagsinput('add', { id: tab_name+'_organization_unit_id', label: 'Organization Unit' }):$("#searchtags").tagsinput('remove', { id: tab_name+'_organization_unit_id', label: 'Organization Unit' });
		}
		catch(err) {  
		    console.log(err)   
		}    
		if (this.value != 0) {$(".errorTxt1").text("");	var post_data={};     
				post_data['table']='team_details_info';  
				post_data['type']='dropdown';  
				post_data['org_id']=$('#'+tab_name+'_organization_id').val();      
				post_data['org_unit_id']=this.value;      
				post_data['csrfmiddlewaretoken']=$("input[name=csrfmiddlewaretoken]").val()
				var res=getDropDown(post_data);     
				setDropdownValues(res,tab_name+"_division",'id','name') 
		} 
	})   
	$('#'+tab_name+'_division').on('change', function() { 
		tag_org_unit= this.value !=0 ?$("#searchtags").tagsinput('add', { id: tab_name+'_division', label: 'Division' }):$("#searchtags").tagsinput('remove', { id: tab_name+'_division', label: 'Division' });	
	})
	
	$('#'+tab_name+'_status_id').on('change', function() {
		tag_status= this.value !=0 ?$("#searchtags").tagsinput('add', { id: tab_name+'_status_id', label: toTitleCase(tab_name)+' Status' }):$("#searchtags").tagsinput('remove', { id: tab_name+'_status_id', label: toTitleCase(tab_name)+' Status' });
	})
	$('#searchtags').on('itemRemoved', function(event) { 
		  if(event.item!= undefined){
		  $('.tab1f .bootstrap-tagsinput input').val('');
		  var status = tab_name+'_organization_id'== event.item.id ? $('#'+tab_name+'_organization_id').val('0').trigger("change"): tab_name+'_organization_unit_id'== event.item.id ? $('#'+tab_name+'_organization_unit_id').val('0').trigger("change"): tab_name+'_division'== event.item.id ? $('#'+tab_name+'_division').val('0').trigger("change") :tab_name+'_status_id'== event.item.id ? $('#'+tab_name+'_status_id').val('0').trigger("change"):$('#'+event.item.id.slice(tab_name.length+1)).val('');
		  } 
		});                                               
 }        
	let addTag=(event) => { 
		tag_data= event.value ?$("#searchtags").tagsinput('add', { id: tab_name+'_'+event.id, label: event.placeholder }):$("#searchtags").tagsinput('remove', { id: tab_name+'_'+event.id, label: event.placeholder });
	}	 
	let setDropdownValues=(res, id, key, value) => { if(res && $('#' + id +' option:last-child').val()==0){ 
		for (let i = 0; i < res.length; i++) {    
			$('#' + id).append($('<option>', {        
				value :res[i][key],         
				text : res[i][value] 	 
			}));    
		}        
	    }        
	}
	$('#searchtags').on('change',function(){ 
		let search_metrics=getData(); 
	})
	let reportSearch=() => {   
		if($('#'+tab_name+'_organization_id option:selected').val()== 0){
	    $(".errorTxt0").text("Select Organization")
	    return false;  
		}               
		let search_metrics=getData();     
		if(search_metrics){ 
			let post_data={};   
				post_data['type']='filter'; 
				post_data['search_metrics']=JSON.stringify(search_metrics);
				post_data['csrfmiddlewaretoken']=$("input[name=csrfmiddlewaretoken]").val()
			filterData(post_data);	
		} 
	} 
//For Getting  a Form data      
	let getData=()=>{   
			var catc={};
			let org=$("#"+tab_name+"_organization_id").val() ?$("#"+tab_name+"_organization_id").val():0;
			let org_unit=$("#"+tab_name+"_organization_unit_id").val()?$("#"+tab_name+"_organization_unit_id").val():0;
			let division=$("#"+tab_name+"_division").val()?$("#"+tab_name+"_division").val():0;
			let fname=$("#"+tab_name+"_fname").val()?$("#"+tab_name+"_fname").val():"";
			let lname=$("#"+tab_name+"_lname").val()?$("#"+tab_name+"_lname").val():"";
			let status=$("#"+tab_name+"_status_id").val()!=0?$("#"+tab_name+"_status_id").val():"";
			catc['org']=org;  
			catc['org_unit']=org_unit;
			catc['division']=division;
			catc['fname']=fname; 
			catc['lname']=lname;     
			catc['status']=status;  
			catc['tab']=tab_name;    
		c_data[tab_name]=catc;  	  
	 return catc;    
	}       
	let filterData=(post_data)=>{   
		$.ajax({     
			url : '/sp_report_data/',       
			type : 'POST',      
			data : post_data,     
			timeout : 10000,     
			async : false,   	    
		}).done(function(json_data) {
			var data = JSON.parse(json_data);   
			if (data.datas){ 	
				c_data[tab_name+"_list"]=data.datas;
				alert_lobibox("success",sysparam_datas_list['NTE_58']);
				plaindatatable_btn(tab_name+"_report_details",data.datas,cols[tab_name],0,'NEXT_TRANSFORM_HCMS_DOW_SUCCESSION_PLANNING_REPORT_'+currentDate());
			}  
		}); 
	}
	let setData=(result)=>{
		if(result){
			list=tab_name+"_list"  
			res_list=result[list];   
			res=result[tab_name]; 
			org=res.org !=0 ?$("#"+tab_name+"_organization_id").val(res.org).trigger("change"):$("#"+tab_name+"_organization_id").val(0).trigger("change");
		    org_unit=res.org_unit !=0?$("#"+tab_name+"_organization_unit_id").val(res.org_unit).trigger("change"):$("#"+tab_name+"_organization_unit_id").val(0).trigger("change");
		    division=res.division !=0?$("#"+tab_name+"_division").val(res.division).trigger("change"):$("#"+tab_name+"_division").val(0).trigger("change");
		    $("#"+tab_name+"_fname").val(res.fname).trigger("change");
		    $("#"+tab_name+"_lname").val(res.lname).trigger("change");
		    status=res.status?$("#"+tab_name+"_status_id").val(res.status).trigger("change"):$("#"+tab_name+"_status_id").val(0).trigger("change");
		    plaindatatable_btn(tab_name+"_report_details",res_list,cols[tab_name],0,'NEXT_TRANSFORM_HCMS_DOW_SUCCESSION_PLANNING_REPORT_'+currentDate());
		}
	}
	let clearPage=()=>{let clrData={};
	    	clrData[tab_name]={"org":"0","org_unit":"0","fname":"","lname":"","status":""};
	    clrData[tab_name+"list"]=[];
		setData(clrData);
		}
	
	