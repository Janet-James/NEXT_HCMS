$(document).ready(function(){
mode=$('#page_id').children()[0].innerText;
mode=mode.split(' ')[0];
	$('#clone_div').data('old-state', $('#calender_box_main').html());	
	if(mode=='LEAVE'){
		getCartData();
		post_data = {};
		post_data['csrfmiddlewaretoken']=$("input[name=csrfmiddlewaretoken]").val() 
		post_data["type"] = "USER";
		var res=getLeaveData(post_data)
		gatherLeaveData(res);  
		//setLedgent(); 
		getHoliday();
		getLateArival();
	}   
}); 
	let getHoliday=()=>{ //HOLIDAY
		post_data = {}; 
		post_data['csrfmiddlewaretoken']=$("input[name=csrfmiddlewaretoken]").val() 
		post_data["type"] = "HOLYDAY"; 
		let res=getLeaveData(post_data);    
		gatherLeaveData(res);
	} 
	let getLateArival=()=>{ //LATE ARIVAL 
		post_data = {}; 
		post_data['csrfmiddlewaretoken']=$("input[name=csrfmiddlewaretoken]").val() 
		post_data["type"] = "LATE"; 
		let res=getLeaveData(post_data);    
		gatherLeaveData(res);
	} 
	let findDates=(cm)=>{       
		var currentDate = new Date();      
		var cy=currentDate.getYear();     
		var date = new Date(cy,cm,1);    
		var days=0;	 
		while(date.getMonth()==cm){   
		 days++;     
		 var date = new Date(cy, cm,days); 
		}    
	return days-1; 
	}   
	for(let d=11;d>=0;d--){ 
		let noDays=31-findDates(d);  
		if(noDays>0){ 
			day=31;   
			no=noDays;    
			rd=d;    
			while(no){  
				$('#day_'+day--+' td:eq('+rd+')').empty();  
				no--;    
			}}}   
	let addClass=(day,month,cls)=>{
		$('#day_'+day+' td:eq('+month+')').addClass(cls);
	} 
	let getLeaveData=(post_data)=> {   	
		res_data ="";       
		$.ajax({     
			url : '/hrms_leave_calendar_data/',   
			type : 'POST',   
			data : post_data, 
			timeout : 10000,      
			async : false,    
		}).done(function(json_data) {    
			var data = JSON.parse(json_data);  
			if (data.vals) {  
				res_data = data.vals;    
			} 
		}); 
		return res_data;    
	}   
	var setDropdownValues=(res, id, key, value,value1)=> {
	    if(res){ 	
		for (var i = 0; i < res.length; i++) {    
			$('#' + id).append($('<option>', { 
				value : res[i][key], 
				text:(value1? res[i][value]+" "+res[i][value1] :res[i][value]), 
			}));} } }
	
	let setQuaterHead=(q)=>{
	 quater_list=['q1','q2','q3','q4']
	 var q_index=quater_list.indexOf(q)
	 for(let i=quater_list.length-1;i>=0;i--){
		 if (i==q_index){
			 $('#quater_head li:eq('+i+')').html('Current Quater'); 
		 }
		 else if (i<q_index){
			 $('#quater_head li:eq('+i+')').html('Past Quater'); 	
		 }
		 else{
			 $('#quater_head li:eq('+i+')').html('Future Quater');
		 }
		 
	 }
	}
	(function(){  
		 let a = new Date();    
	     let d = a.getDate();
	     let m = a.getMonth();
	     d=(Math.floor(d)==d && d.toString().length<2)?'0'+d:d; 
	     m=(Math.floor(m)==d)?'0'+m:m ; 
	     addClass(d,m,'current-date');  
	     quater={};  	      
	     quater['q1']=[0,1,2];      
	     quater['q2']=[3,4,5];    
	     quater['q3']=[6,7,8];  
	     quater['q4']=[9,10,11]
	     quat= m<3 ? 'q1': m<6 ? 'q2':m<9 ?'q3':m<12 ?'q4':'';
	     
	     if(quat){
	    	 try{ 
	    		 setQuaterHead(quat)	    		 
	    	 }
	    	 catch(e){
	    		 console.log(e) 
	    	 }
	    	 q=quater[quat];   
	    	 for(let j=q.length-1;j>=0;j--){   
	    	 for(let i=31;i>=0;i--){
	    		 i=i.toString().padStart(2, '0');
	    		 addClass(i,q[j],'current-quater')	   
	    	 }
	    	 }
	    	 q_no=Array.from(quat)
	    	 q_no=q_no[1]-1;
	    	 $('#quater_head li:eq('+q_no+')').css('color','#08dab3'); 
	    	 //.addClass('current-quater');  
	     }
	     post_data={}; 
	     post_data['csrfmiddlewaretoken']=$("input[name=csrfmiddlewaretoken]").val()  
	     post_data["type"] = "drop";  
	     var res=getLeaveData(post_data)    
	     setDropdownValues((res?res:null),"employee_list", "id", "emp_name");    
	})();  
	let setDate=(day,month,leave_type,leave_img)=>{
		tooltipDirection = day==1 ?'bottom':'top';
		month=month-1;   
		//<img data-toggle="tooltip" data-placement="'+tooltipDirection+'" title="'+leave_type+'" src="'+static_path+leave_img+'">
		$('#day_'+day+' td:eq('+month+')').append('<div class="list-leave-icon"> <i data-toggle="tooltip" data-placement="'+tooltipDirection+'" title="'+leave_type+'" class="'+leave_img+'"></i> </div>');
	}
	let gatherLeaveData=(res)=>{ 
		if(res.length){ 
			var ledg=""; 
			for(let i=res.length-1;i>=0;i--){ 
				if(res[i][4]== 'MTNTL'){  
					ledg=`<li><div class='ledgent-area'><i class="nf nf-maternity-leave custom-leave-type leave-Maternity"></i></div>&nbsp;Maternity leave</li>`;
				}
				if(res[i][4]== 'PTNTL'){ 
					ledg=`<li><div class='ledgent-area'><i class="nf nf-paternity-leave custom-leave-type leave-paternity"></i></div>&nbsp;Paternity Leave</li>`;
				} 
 				setDate(res[i][0],res[i][1],res[i][2],res[i][3]);
			}
				 var ledgent=`<li><div class='ledgent-area'><i class="nf nf-bed leave-sick"></i></div>&nbsp; Sick Leave</li>
	              <li><div class='ledgent-area'><i class="nf nf-rest custom-leave-type leave-casual"></i></div>&nbsp; Casual Leave</li>
	              <li><div class='ledgent-area'><i class="nf nf-duration-1 custom-leave-type leave-permission"></i></div>&nbsp; Permissions</li> 
	              <li><div class='ledgent-area'><i class="nf nf-alarm custom-leave-type leave-combo"></i></div>&nbsp; Compensatory Off</li>     
	              <li><div class='ledgent-area'><i class="nf nf-attendance-detail custom-leave-type leave-absebce"></i></div>&nbsp; Leave of Absence</li> 
	              <li><div class='ledgent-area'><i class="nf nf-car-1 custom-leave-type leave-public"></i></div>&nbsp;Public Holidays</li>  
	              <li><div class='ledgent-area'><i class="nf nf-challange custom-leave-type leave-earned"></i></div>&nbsp;Earned  Leave</li>
	              <li><div class='ledgent-area'><i class="nf nf-working-time leave-combo-project"></i></div>&nbsp;HR and Project Hours</li>
	        	  `;
	        	  ledgent+=ledg;
	           	  $('#leave_ledgent').html(ledgent)   
		}   
	}       
	//employee_list on change    
	$('#employee_list').on('change',function () {
		emp_id=$('#employee_list').val();   
		if(emp_id){   
			post_data = {}; 
			post_data['csrfmiddlewaretoken']=$("input[name=csrfmiddlewaretoken]").val()   
			post_data["type"] = "ADMIN";  
			post_data["emp_id"] = emp_id; 
			$('#calender_box_main').html(" "); 
			$('#calender_box_main').html($('#clone_div').data('old-state'));   
			var res=getLeaveData(post_data)
			gatherLeaveData(res); 
			getHoliday();
			drawChart('','','');
			post_data = {};
			post_data['csrfmiddlewaretoken']=$("input[name=csrfmiddlewaretoken]").val()  
		    post_data["type"] = "CHART";  
		    post_data["emp"] =emp_id;  
		    let change_res=getLeaveData(post_data) 
		    	setCartData(change_res);	
		}	
		});
	let getLabel=(data)=>{

		var label="No Data Available";
		if(data.length){
		for(i=data.length-1;i>=0;i--){
			if(data[i]['column-1']>0 ||data[i]['column-2']>0 ){
				label="";
				return label
			} 
  		  }  
		}
		return label
	}  
	let drawChart=(chartId,data,text)=>{
		var text="Q"+text ;
		var label = getLabel(data) ;
		  var chart = AmCharts.makeChart(chartId,  
				    {  
					"type": "serial",
					"fontFamily": "'Poppins', sans-serif",  

					"categoryField": "category", 
					"startDuration": 1,  
					"categoryAxis": { 
				        "gridThickness":0, 
						"gridPosition": "start" 
					},
					"trendLines": [],
					"graphs": [
						{
							"balloonText": "Allocated : [[value]]", 
							"fillAlphas": 1,
				       "fillColorsField": "color",
				            "fillAlphas": 0.9,
				            "lineAlpha": 0,   
							"id": "AmGraph-1",
							"title": "graph 1",
							"type": "column",
				            "fixedColumnWidth": 15,
							"valueField": "column-1"
						},
						{  
							"balloonText": "Taken : [[value]]",
							"fillAlphas": 1,	
				           "fillColorsField": "color1",
				            "fillAlphas": 0.9,	  
				            "lineAlpha": 0,  
							"id": "AmGraph-2",
							"title": text, 
							"type": "column",
				            "fixedColumnWidth": 15, 
							"valueField": "column-2" 	
						} 
					],
					"guides": [],
					"valueAxes": [
						{
							"id": "ValueAxis-1",
							"title": "Leaves Allocated vs Taken",
				            "gridColor": "none",
				            "gridAlpha": 0,  
				            "dashLength": 0
						}
					], 
					"allLabels": [],
					"balloon": {}, 
					"legend": { 
						"enabled": false,
						"useGraphSettings": true  
					},
				    "allLabels": [{
				    "x": "50%",
				    "align": "middle",
				    "y": "94%",
				    "bold": true,  
				    "size": 13,  
				    "text": text,  
				  },
				    {    
		      			"text":label, 
		      			"bold": true,
		      			"color":'RED', 
		      			"x": 120, 
		      			"y": 181, 
		      		}],  
					"dataProvider":data, 
				}         
				 );
	}
	let setCartData=(res)=>{
	     post_data={}; 
	     quater={'quater_1':'quater-one','quater_2':'quater-two','quater_3':'quater-three','quater_4':'quater-four'}
	     for(k in quater){
	    	 title=k.split('_') 
	    	 drawChart(quater[k],res[k],title[1]);
	     } 
	}    
	let getCartData=()=>{
  		 post_data['csrfmiddlewaretoken']=$("input[name=csrfmiddlewaretoken]").val()  
	     post_data["type"] = "CHART";   
	     post_data["emp"] = "USER";  
	     let res=getLeaveData(post_data)
	     if(!jQuery.isEmptyObject(res)){    
	    	 setCartData(res);	  
	     }
	}
	  