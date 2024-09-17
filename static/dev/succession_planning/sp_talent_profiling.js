
$(document).ready(function(){
	// setRefData('CARDR','carrer_direction');
	setRefData(['SALEL','AGEWR','CARDR','TIMCR','WRKLD','WRKLD','WRKLD','PAYRE','PAYRE','PAYRE','PAYRE','PAYRE','PAYRE','PAYRE','PAYRE','PAYRE','PAYRE','RDYPO','RDYPO'])
	setTableData("role","proposed_role");
	// $('#filght_risk_persent').html('(12%)')
});
   let setProfessionalExperience=(res)=>{
	   $("#professional_experience").html(res.map(function(r){
		return '<table><tbody><tr><td class="etdwidth1">Position</td><td class="etdwidth2">:</td><td class="etdwidth3"> <b>'+r.position+'</b></td></tr> <tr><td class="etdwidth1">Employer</td><td class="etdwidth2">:</td><td class="etdwidth3"> <b>'+r.employer+'</b></td></tr><tr><td class="etdwidth1">Start Date</td><td class="etdwidth2">:</td><td class="etdwidth3"> <b>'+r.start_date+'</b></td></tr><tr><td class="etdwidth1">End Date</td><td class="etdwidth2">:</td><td class="etdwidth3"> <b>'+r.end_date+'</b></td></tr></tbody></table><hr>';   
	   }))
   }
   let setCertificateDetails=(res)=>{
	   $("#certificate_details").html(res.map(function(r){
			return '<table><tbody><tr><td class="etdwidth1">Certification No</td><td class="etdwidth2">:</td><td class="etdwidth3"> <b>'+r.certification_no+'</b></td></tr> <tr><td class="etdwidth1">Issued By</td><td class="etdwidth2">:</td><td class="etdwidth3"> <b>'+r.issued_by+'</b></td></tr><tr><td class="etdwidth1">Start Date</td><td class="etdwidth2">:</td><td class="etdwidth3"> <b>'+r.start_date+'</b></td></tr><tr><td class="etdwidth1">End Date</td><td class="etdwidth2">:</td><td class="etdwidth3"> <b>'+r.end_date+'</b></td></tr></tbody></table><hr>';   
		   }))
   } 
   let setAccoladesDetails=(res)=>{
	   $("#accolades_details").html(res.map(function(r){
			return '<table><tbody><tr><td class="etdwidth1">Accolades Title</td><td class="etdwidth2">:</td><td class="etdwidth3"> <b>'+r.ca_accolades_title+'</b></td></tr> <tr><td class="etdwidth1">Accolades Year</td><td class="etdwidth2">:</td><td class="etdwidth3"> <b>'+r.ca_accolades_year+'</b></td></tr><tr><td class="etdwidth1">Accolades Quarter</td><td class="etdwidth2">:</td><td class="etdwidth3"> <b>'+r.ca_accolades_quarter+'</b></td></tr><tr><td class="etdwidth1">End Date</td><td class="etdwidth2">:</td><td class="etdwidth3"> <b>'+r.end_date+'</b></td></tr><tr><td class="etdwidth1">Accolades Description</td><td class="etdwidth2">:</td><td class="etdwidth3"> <b>'+r.ca_accolades_desc+'</b></td></tr><tr><td class="etdwidth1">Awared By</td><td class="etdwidth2">:</td><td class="etdwidth3"> <b>'+r.awarded_by+'</b></td></tr></tbody></table><hr>';
		   }))
   } 
   let getDetails=(emp)=>{
	   var res_data={};   
		$.ajax({              
			url : '/sp_talent_profiling_data/',      
			type : 'POST',         
			data : post_data,   
			timeout : 10000,              
			async : false,      
		}).done(function(json_data) {
			var data = JSON.parse(json_data); 
			if (data.datas.length) {     
				res_data=data.datas;    
			}     
			}); 
		return res_data;
   } 
   var no_data='<p class="ta_no_data_found">No Data Available!</p>';  
   $("#employee_engagement").html(no_data);     
   let getProfessionalExperience=(emp)=>{
   post_data={};
   post_data['csrfmiddlewaretoken']=$("input[name=csrfmiddlewaretoken]").val(); 
   post_data['type']='EXP'; 
   post_data['emp_id']=emp;
   var res=getDetails(emp) 
   if(res.length){ 
	   setProfessionalExperience(res); 
   }else{
	  
		$("#professional_experience").html(no_data);
   }   
   }      
   let getCertificate=(emp)=>{ 
   post_data={};
   post_data['csrfmiddlewaretoken']=$("input[name=csrfmiddlewaretoken]").val();
   post_data['type']='CERTIFICATE';  																				 																																
   post_data['emp_id']=emp;  
   res=getDetails(emp);   
   if(res.length){
	   setCertificateDetails(res);        
   }else{ 
		  
		$("#certificate_details").html(no_data); 
  }   
   } 
   let getAccolades=(emp)=>{
	   post_data={};
	   post_data['csrfmiddlewaretoken']=$("input[name=csrfmiddlewaretoken]").val();
	   post_data['type']='ACCOLADES';  
	   post_data['emp_id']=emp;
	   res=getDetails(emp);     
	   if(res.length){    
		   setAccoladesDetails(res);       
	   } else{
			$("#accolades_details").html(no_data);  
	   }     
   } 
	// Talent page
	var key=['carrer_direction','proposed_role','age_of_worker','current_role','salary_level','workload','prospects','pay_rise','displinary_actions','too_sick_leave','late_early_leaveing','recevied_promotions','decreasing_perfomance','disengagement','poor_attitude','problems_managers','cummuting_problems','activity','activity_desc','completion_date','role_criticality','next_role','ready_promotion','employes_succeed','successor_readiness','mobility','completion_status','filght_risk_persent']
	let setData=(key,data)=>{ 
		 update_id=data.id;
		 for(let i=key.length;i>=0;i--){
			 if(key[i]=="mobility" ){  
				 $("#mobility_"+data[key[i]]).prop('checked', true); 
				 continue;   
			 }    
			 else if(key[i]=="completion_status"){       
				 $("#completion_"+data[key[i]]).prop('checked', true);	   
				 continue;
			 } 
			 else if(key[i]=="filght_risk_persent"){
				 $("#filght_risk_persent").html('('+data[key[i]]+'%)');
				 continue;
			 }    
			 $('#'+key[i]).val(data[key[i]]).trigger('change');  
		 }        
	 }  
	let setProfie=(data)=>{
		employeeName=data.name ?data.name :" Employee";
		img=data.img ? data.img:no_data.png 
		$('#talent_profiling').html('<img id="profile" src="'+image_path+img+'">'+
		'<div class="learing_profile_text">'+
		'<span class="name" id="name">'+data.name+'</span>'+  
		'<span class="position" id="position">'+data.role+'</span>'+ 
		'</div>')
	}
	function  talentCancelCall(){ 
		let clr_data={"age_of_worker":0,"mobility":false,"too_sick_leave":0,"next_role":0,"completion_date":"","proposed_role":0,"recevied_promotions":0,"disengagement":0,"problems_managers":0,"carrer_direction":0,"poor_attitude":0,"employes_succeed":0,"current_role":0,"ready_promotion":0,"activity":"","role_criticality":0,"pay_rise":0,"activity_desc":"","salary_level":0,"prospects":0,"workload":0,"late_early_leaveing":0,"successor_readiness":0,"decreasing_perfomance":0,"cummuting_problems":0,"displinary_actions":0,'filght_risk_persent':0}
		setData(key,clr_data);
		$("#employes_succeed").val(null).trigger("change");
		$("#employes_succeed").select2({
			placeholder: "--- Select ---",
			width: '100%'
		});
		no_data='<p class="ta_no_data_found">No Data Available !</p>';
		$("#professional_experience").html(no_data);   
		$("#certificate_details").html(no_data); 
		$("#accolades_details").html(no_data);  
		$("#employee_engagement").html(no_data);
		payload={}
		// button_create(1);
	}	 
	const taletCancel=(event)=>{  
			orgClearFuncton('talentCancelCall', '',employeeName); 
			$('#completion_date').val('');
			$(".date_input_class").trigger('change');
		}
	// button create function here
	let button_create=(status)=>{
		let access_for_create = jQuery.inArray( "Talent Profiling", JSON.parse(localStorage.Create) );
		let  access_for_write = jQuery.inArray( "Talent Profiling", JSON.parse(localStorage.Write) );   
		let  access_for_delete = jQuery.inArray( "Talent Profiling", JSON.parse(localStorage.Delete) );
		let  strAppend = '';
		if(status == 1){
			if (access_for_create != -1){  
				strAppend = "<button type='button' onclick='taletAdd(this)' class='btn btn-success btn-eql-wid btn-animate'>Add</button>"
			}
			strAppend += " <button type='button' onclick='taletCancel(event)' class='btn btn-warning btn-animate btn-eql-wid btn-animate'>Cancel / Clear</button>"
			$('#talent_from_btn_div').html(strAppend); 
		}else{ 
			if (access_for_write != -1){
				strAppend = "<button type='button' onclick='talentUpdate()' class='btn btn-primary btn-eql-wid btn-animate '>Update</button>"
				/*
				 * if(transfer_status == false){ strAppend += "<button
				 * type='button' onclick='transfer_request_revoke_button()'
				 * class='btn btn-primary btn-eql-wid btn-animate '>Revoke</button>" } 
				 */
			}		
			strAppend += " <button type='button' onclick='taletCancel(event)' class='btn btn-warning btn-animate btn-eql-wid btn-animate'>Cancel / Clear</button>"
			$('#talent_from_btn_div').html(strAppend); 
		}
	}
	let  talentModal=(emp_id)=>{   
		selectedEmployee=emp_id;
		getProfessionalExperience(selectedEmployee);
		getCertificate(selectedEmployee);
		getAccolades(selectedEmployee); 
	$('#talent_profiling').html('');
	// $('#spPotentialSuccessorsModalTalent').html('');
	$('#spPotentialSuccessorsModalTalent').modal('show');  
	   let getEmployee=(emp_id)=> {
		    post_data={};
		   	post_data['csrfmiddlewaretoken']=$("input[name=csrfmiddlewaretoken]").val();
		    post_data['type']='EMP';
		    post_data['emp_id']=emp_id;
		    res_data ="";  
			$.ajax({     
				url : '/sp_talent_profiling_data/',
				type : 'POST',    
				data : post_data,
				timeout : 10000,  
				async : false, 
			}).done(function(json_data) {   
				var data = JSON.parse(json_data);
				if (data.talent.length) {
					button_create()
					setData(key,data.talent[0])  
				} 
				else{ 
					 button_create(1)
					 talentCancelCall();  
			 	} 
				if(data.emp) {     
					res_data = data.emp;
					try{
						setProfie(res_data[0])
					}
					catch(er){
						console.log(er)  
					}
					age=res_data[0].age.split('-')[0]
					if(age){  	
					 age_cat= age>21 && age<30 ? 1:age>30 && age<40 ?2 :age>40 && age<50 ?3:4 // Reference
																								// item
																								// id
					}
				}  
			});  
	   }
	   getEmployee(emp_id); 
	}  
	(function(){
		$("#completion_date_div").DateTimePicker({
			dateFormat: "dd-MM-yyyy", 
		}); 
	})();   
	let DropdownValuesSet=(post_data)=> {
		res_data ="";    
		$.ajax({  
			url : '/sp_talent_profiling_data/',    	  
			type : 'POST', 
			data : post_data,       
			timeout : 10000,  
			async : false,   
		}).done(function(json_data) {      
			var data = JSON.parse(json_data); 
			if (data.datas) {        
				res_data = data.datas;      
			}});   
		return res_data;         
	}   
	idDict={}
	idDict['SALEL']=['salary_level'];
	idDict['AGEWR']=['age_of_worker'];     
	idDict['CARDR']=['carrer_direction']; 
	idDict['TIMCR']=['current_role'];
	idDict['WRKLD']=['workload','prospects','role_criticality',]   
	idDict['PAYRE']=['pay_rise','displinary_actions','too_sick_leave','late_early_leaveing','recevied_promotions','decreasing_perfomance','disengagement','poor_attitude','problems_managers','cummuting_problems'];  
	idDict['RDYPO']=['ready_promotion','successor_readiness'];
// Data feeding for dropdown
	var setRefData=(code)=>{   
		post_data = {};
		res="";
		post_data['csrfmiddlewaretoken']=$("input[name=csrfmiddlewaretoken]").val();
		post_data["type"] = "reference";  
		post_data["code"] =JSON.stringify(code);   
		res=DropdownValuesSet(post_data)
		for(let i=code.length-1;i>=0;i--){ 
		setDropdownValues(res.filter(function(f){return code[i]==f.refitem_category_code ? f :"";}),
				idDict[code[i]][idDict[code[i]].length-1],"id","refitems_name");
			idDict[code[i]].pop(); 	
		} 
	} 
	let setDropdownValues=(res,id,key,value,)=> { 
	    if(res){  
		for (let i =res.length-1; i >=0; i--) {    
			$('#'+ id).append($('<option>', {  
				value : res[i][key],  
				text:res[i][value],   
			}));} } }   
	let setTableData=(table_key,id)=>{   
		post_data = {};     
		post_data['csrfmiddlewaretoken']=$("input[name=csrfmiddlewaretoken]").val();
		post_data["type"] = "dropdown";     
		post_data["table"] =table_key;  
		res=DropdownValuesSet(post_data)   
		setDropdownValues((res?res:null),id, "id","name");      
	} 
	setTableData("role","next_role");  
	setTableData("EMP","employes_succeed");  
	const changeFormat=(first_date)=>{   
		let dateArray = first_date.split('-');  
		var first_date =(dateArray[2]+ '-' + dateArray[1] + '-' +dateArray[0] );
		return  first_date;
	} 
	var payload={};   
	let getData=(key)=>{ 	  
			var data={};      
			 for(let i=key.length-1;i>=0;i--){     
				 data[key[i]]=$('#'+key[i]).val();   
			 }   
			 return data; 
	 } 
	let calculateFlightRisk=()=>{ 
			let risk_key=['workload','prospects','pay_rise','displinary_actions','too_sick_leave','late_early_leaveing','recevied_promotions','decreasing_perfomance','disengagement','poor_attitude','problems_managers','cummuting_problems']
			let value=getData(risk_key)
			dict={};
			dict['951']=0.33; //low
			dict['954']=0.33;  //disagree 
			dict['952']=0.66;   //medium
			dict['955']=0.66; //neither agree or disagree
			dict['953']=1; //high  
			dict['956']=1;  // agree
			var  totalRisk=0;    
			risk_key.map(function(k){     
				totalRisk+=dict[value[k]];  
			}) 
			if(totalRisk !=0){
				var avgRisk=totalRisk/risk_key.length*100;	
			}
			return avgRisk;
	 }
	 $('#carrer_aspirations').click(function(){ 
		 if(formValidation('career_aspirations_form')){
			 var career_aspirations={}; 
			 key=['carrer_direction','proposed_role']
			 career_aspirations=getData(key); 
			 var mobility= $("input[name='mobility']:checked").val();
			 career_aspirations['mobility']=mobility; 
			 career_aspirations['emp']=selectedEmployee;	 
			 payload['career_aspirations']=career_aspirations; 
			 alert_lobibox("success","Career Aspirations Details Gathered");
		 }
		 else{
			 if($('#career_aspirations_form').find('.errorTxts').children()){
				 $('#'+$('#career_aspirations_form').find('.errorTxts :first-child')[0].id).parent().parent().find('select').focus();
			 }
		 }
		 return false
	 });  
   	 $('#flight_risk').click(function(){  
		 if(formValidation('sp_flight_risk_form')){  
			 key=['age_of_worker','current_role','salary_level','workload','prospects','pay_rise','displinary_actions','too_sick_leave','late_early_leaveing','recevied_promotions','decreasing_perfomance','disengagement','poor_attitude','problems_managers','cummuting_problems']
			 let flight_risk=getData(key);
			 flight_risk['avg_risk']=calculateFlightRisk();
			 payload['flight_risk']=flight_risk; 
			 alert_lobibox("success","Flight Risk Details Gathered");     
		 } 
		 else{
			 if($('#sp_flight_risk_form').find('.errorTxts').children()){
				 $('#'+$('#sp_flight_risk_form').find('.errorTxts :first-child')[0].id).parent().parent().find('select').focus();
			 }
			 
		 }
		 return false;    
	 });  
	$('#retention_plan').click(function(){
		if(formValidation('sp_retention_form')){
			key=['activity','activity_desc','completion_date'] 
			let retention_plan=getData(key);  
			var completion_status= $("input[name='completion_status']:checked").val();
			retention_plan['completion_date']=changeFormat(retention_plan.completion_date);
			retention_plan['completion_status']=completion_status;
			payload['retention_plan']=retention_plan; 
			alert_lobibox("success","Retention Plan Details Gathered");
		}
		else{
			 if($('#sp_retention_form').find('.errorTxts').children()){ 
				 $('#'+$('#sp_retention_form').find('.errorTxts :first-child')[0].id).parent().parent().find('select').focus();
			 } 
		}  
		return false; 
	})
	$('#sp_succession_planning_btn').click(function(){ 
		if(formValidation('sp_succession_planning')){  
			key=['role_criticality','next_role','ready_promotion','employes_succeed','successor_readiness']
			let succession_planning=getData(key); 
			payload['succession_planning']=succession_planning;
			alert_lobibox("success","Succession Planning Details Gathered");	
			} 
		else{  
			 if($('#sp_succession_planning').find('.errorTxts').children()){
				 $('#'+$('#sp_succession_planning').find('.errorTxts :first-child')[0].id).parent().parent().find('select').focus();
			 }
		}
		return false;
	})
	// class for CRUD operations
class CRUD {
    constructor(...args) { 
    	Object.assign(this, ...args);  
    }  
    add(){   
    	var vals = {    
    			'results' : JSON.stringify(this),
    			'delete_id' : '',  
    			'update_id' : '', 
    			csrfmiddlewaretoken : $("input[name=csrfmiddlewaretoken]").val(),
    		  } 
    	crudOperation(vals)  
    } 
    update(id){    
    	var vals = {
    			'results' : JSON.stringify(this),  
    			'delete_id' : '',
    			'update_id' : id,
    			csrfmiddlewaretoken : $("input[name=csrfmiddlewaretoken]").val()
    		  }
    	crudOperation(vals)
    }
}
	let crudOperation=(vals,id=0)=>{ 
		if (vals) {  
			$.ajax({
				url : '/sp_talent_profiling_crud/',        
				type : 'POST',  
				data : vals,
				timeout : 10000, 
				async : false,      
			}).done(function(json_data) {
						var data = JSON.parse(json_data);
						if (data.results == "ERR0503") {
							alert_lobibox("error", 
									sysparam_datas_list[data.results]);
						} else if (data.results == 'NTE_01' ||data.results == 'NTE_03' ) {
							table_id = 0;   
							alert_lobibox("success",  
									sysparam_datas_list[data.results]); 
							getAllDetails();  
							 exitCancelCall()
						} else{
							alert_lobibox("error","Details Not Add/Updated ");
						}
					});
	}
	}
	let taletAdd=()=>{
		if (!jQuery.isEmptyObject(payload)){
			let crudObject=  new CRUD(payload) 
			crudObject.add()  
		}
		else{
			alert_lobibox("error",sysparam_datas_list["NTE_02"]);
		}
		}
	let talentUpdate=()=>{
		if(!jQuery.isEmptyObject(payload)){
			let crudObject=  new CRUD(payload) 
			crudObject.update(update_id)
		}
		else{
			alert_lobibox("error",sysparam_datas_list["NTE_02"]);
		}
	}
// Validations
	// Career Aspirations Form
	 $('#career_aspirations_form').submit(function(e) { 
			e.preventDefault();
		}).validate({ 
			rules : { 
				carrer_direction : {
					required : true,
					valueNotEquals : true,
				},
				proposed_role: {
					required:true,
					valueNotEquals : true,
				}, 
			}, 
			// For custom messages
			messages : {
				carrer_direction : {
					required: "Select Career Direction",
					valueNotEquals : "Select Career Direction",
				},
				proposed_role : {
					required : "Enter Proposed Role",
					valueNotEquals : "Enter Proposed Role",
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
		let formValidation=(id)=> {
			return $('#'+id).valid(); 
		}
		
	// Flight Risk Form
		$('#sp_flight_risk_form').submit(function(e) {
			e.preventDefault();
		}).validate({
			rules : {
				age_of_worker : { 	
					required : true, 
					valueNotEquals : true,
				},
				current_role: {
					required:true,
					valueNotEquals : true,
				},
				salary_level: {
					required:true,
					valueNotEquals : true,
				},
				workload: {
					required:true,
					valueNotEquals : true,
				},
				prospects: {
					required:true,
					valueNotEquals : true,
				},
				pay_rise: {
					required:true,
					valueNotEquals : true,
				},
				displinary_actions: {
					required:true,
					valueNotEquals : true,
				},
				too_sick_leave: {
					required:true,
					valueNotEquals : true,
				},
				late_early_leaveing: {
					required:true,
					valueNotEquals : true,
				},
				recevied_promotions: {
					required:true,
					valueNotEquals : true,
				},
				decreasing_perfomance: {
					required:true,
					valueNotEquals : true,
				},
				disengagement: {
					required:true,
					valueNotEquals : true,
				},
				poor_attitude: {
					required:true,
					valueNotEquals : true,
				},
				problems_managers: {
					required:true,
					valueNotEquals : true,
				},
				
				cummuting_problems: {
					required:true,
					valueNotEquals : true,
				},
			},
			// For custom messages
			messages : {
				age_of_worker : {
					required : 'This field is Required',
					valueNotEquals :"Select Age of Worker  ",
				},
				current_role: {
					required:"Select  Current Role",
					valueNotEquals : "Select  Current Role",
				},
				salary_level: {
					required:"Select Salary Level",
					valueNotEquals : "Select Salary Level",
				},
				workload: {
					required:"Select Workload",
					valueNotEquals : "Select Workload",
				},
				prospects: {
					required:'',
					valueNotEquals : 'This field is Required',
				},
				pay_rise: {
					required:'This field is Required',
					valueNotEquals : 'This field is Required',
				},
				displinary_actions: {
					required:'This field is Required',
					valueNotEquals : 'This field is Required',
				},
				too_sick_leave: {
					required:'This field is Required',
					valueNotEquals : 'This field is Required',
				},
				late_early_leaveing: {
					required:'This field is Required',
					valueNotEquals : 'This field is Required',
				},
				recevied_promotions: {
					required:'This field is Required',
					valueNotEquals : 'This field is Required',
				},
				decreasing_perfomance: {
					required:'This field is Required',
					valueNotEquals : 'This field is Required',
				},
				disengagement: {
					required:'This field is Required',
					valueNotEquals : 'This field is Required',
				},
				poor_attitude: {
					required:'This field is Required',
					valueNotEquals : 'This field is Required',
				},
				problems_managers: {
					required:'This field is Required',
					valueNotEquals : 'This field is Required',
				},
				
				cummuting_problems: {
					required:'This field is Required',
					valueNotEquals : 'This field is Required',
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
		// Retention plan Form
		 $('#sp_retention_form').submit(function(e) {
				e.preventDefault();
			}).validate({
				rules : {
					activity : {
						required : true,
						valueNotEquals : true,
					},
					activity_desc: {
						required:true,
						valueNotEquals : true,
					},
					completion_date: {
						required:true,
						valueNotEquals : true,
					},
				},
				// For custom messages
				messages : {
					activity : {
						required: "Enter Activity",
					}, 
					activity_desc : {
						required : "Enter Activity Description",
					},
					completion_date : {
						required : "Enter Completion Date",
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
			// Succession Planning plan Form
		 $('#sp_succession_planning').submit(function(e) {
				e.preventDefault();
			}).validate({
				rules : {
					role_criticality : {
						required : true,
						valueNotEquals : true,
					},
					next_role: {
						required:true,
						valueNotEquals : true,
					}, 
					ready_promotion: {
						required:true,
						valueNotEquals : true,
					},
					employes_succeed: {
						required:true,
						valueNotEquals : true,
					},
					successor_readiness: {
						required:true,
						valueNotEquals : true,
					},
				},
				// For custom messages
				messages : {
					role_criticality : {
						required: "Select Role Criticality",
						valueNotEquals:"Select Role Criticality",
					}, 
					next_role : {
						required : "Select Next Promotion Role",
						valueNotEquals:"Select Next Promotion Role",    
					}, 
					ready_promotion : {
						required : "Select Readines for Promotion",
						valueNotEquals:"Select Readines for Promotion",
					}, 
					employes_succeed: {
						required:'Select Employees to Succeed',
						valueNotEquals :'Select Employees to Succeed',
					},
					successor_readiness: {
						required:'Select Successor Readiness',
						valueNotEquals :'Select Successor Readiness',
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
				
	 