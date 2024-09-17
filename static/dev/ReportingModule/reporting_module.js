$(document).ready(function(){
$("#filter_value").prop('disabled', true);
var selection=0;
values_dic={}
$("input[type='radio']").attr('checked', false);

$("input[type='radio']").change(function () {
		values_dic={};
		$('#filter_value').tagsinput('removeAll');
		 //$('#generated_report_tabel').parents('div.dataTables_wrapper').first().hide();
		 selection=$(this).val();
		 
		if(selection==1)
			{
			$('#generated_report_canditate').parents('div.dataTables_wrapper').first().remove();
			$('#generated_report_tabel_leave').parents('div.dataTables_wrapper').first().remove();
			$('#generated_report_tabel_attendance').parents('div.dataTables_wrapper').first().remove();
			$('#generated_report_tabel_attendance').parents('div.dataTables_wrapper').first().remove();
			if($('#generated_report_employee').length==0){ 
			$('#table_div').html("<table id='generated_report_employee'	class='table table-border table-mouseover footable'></table>")
			}
			}
		 if(selection==2)
			{
			 $('#generated_report_employee').parents('div.dataTables_wrapper').first().remove();
				$('#generated_report_tabel_leave').parents('div.dataTables_wrapper').first().remove();
				$('#generated_report_tabel_attendance').parents('div.dataTables_wrapper').first().remove();
				
			if($('#generated_report_canditate').length==0){
				$('#table_div').html("<table id='generated_report_canditate' class='table table-border table-mouseover footable'></table>")
				}
			}
		 if(selection==4)
			{
			$('#generated_report_canditate').parents('div.dataTables_wrapper').first().remove();
			$('#generated_report_employee').parents('div.dataTables_wrapper').first().remove();
			$('#generated_report_tabel_attendance').parents('div.dataTables_wrapper').first().remove();
			
			if($('#generated_report_tabel_leave').length==0){ 
			$('#table_div').html("<table id='generated_report_tabel_leave'	class='table table-border table-mouseover footable'></table>")
			}
			}
		 if(selection==3)
			{
			 
			$('#generated_report_canditate').parents('div.dataTables_wrapper').first().remove();
			$('#generated_report_employee').parents('div.dataTables_wrapper').first().remove();
			$('#generated_report_tabel_leave').parents('div.dataTables_wrapper').first().remove();
			
			if($('#generated_report_tabel_attendance').length==0){ 
			$('#table_div').html("<table id='generated_report_tabel_attendance'	class='table table-border table-mouseover footable'></table>")
			}
			}
		 $.ajax({ //ajax call for filter
			  type : "POST",
			  url : '/report_config_filter/',
			  data : {'report_id':selection},
			  async : false,
			}).done( function(json_data) {
			  data = JSON.parse(json_data);
			  var lable=" ";
			  multi_data_dic={}
			  text_field=[]
			  single_select=[]
			  date_field=[]
			  multi_select=[]
			  text_field.push("text") 
			  single_select.push("single")
			  date_field.push("date")
			  multi_select.push("multi")
			  data=data.value;
			  if(data){
				  for(var i=0;i<data.length;i++)
				  {
					  reference_code=data[i].refitems_code;
					  if(reference_code=="TFELD")
					   {
						  lable+="<label id='filter_items' class='checkboxRadio-title'><B>"+toTitleCase(data[i].filter_name)+":</B></label>"
						  id=reference_code+"_"+data[i].filter_name.replace(/\s/g,'')
						  
						  lable+="<input type='text' id="+id+" name="+data[i].filter_name.split(' ').join('_')+">";
						  text_field.push(id)
						  id="";
					   }
					  if(reference_code=="SNDDL")
					  {
						  filter_data=data[i].filter_data;
						  if(filter_data){
							  id=reference_code+"_"+data[i].filter_name.replace(/\s/g,'')
							  lable+="<label id='filter_items' class='checkboxRadio-title'><B> "+toTitleCase(data[i].filter_name)+":</B></label><select class='nt-forms' id="+id+" name="+data[i].filter_name.split(' ').join('_')+"><option value='0'>--Select--</option>";
								if (filter_data.includes("select")==true)
									{
									content_data=get_data(filter_data,"query");
									  for(var j=0;j<content_data.length;j++)
									   {
										  lable+="<option value="+content_data[j].id+">"+content_data[j].name+"</option>";
									   }
								  	lable+="</select>";
								  	single_select.push(id)
								  	id=""
									}
								if (filter_data.includes("select")==false)
								{
									var type="refitem"
									content_data=get_data(filter_data,type);
									  for(var j=0;j<content_data.length;j++)
									   {
										  lable+="<option value="+content_data[j].refitems_code+">"+content_data[j].refitems_name+"</option>";
									   }
								  	lable+="</select>";
								  	single_select.push(id)
								  	id=""
								}
							  }
					  }
					  if(reference_code=="DTRAN") 
					   {
						  id='dtimepicker1_'+data[i].filter_name.replace(/\s/g,'')
						  lable+="<label id='filter_items' class='checkboxRadio-title'><B>"+toTitleCase(data[i].filter_name)+":</B></label>"
						  lable+="<input type='text' id="+id+" name="+data[i].filter_name.split(' ').join('_')+">";
						  date_field.push(id)
						  id=""
					   }
					  if(reference_code=="MLDDL")
					  	{ 
						/*  
						  for(var k in multi_data_dic)
							 {
							  	multi_data=multi_data_dic[k]
							 }*/
						  lable+="<label id='filter_items' class='checkboxRadio-title'><B>"+toTitleCase(data[i].filter_name)+":</B></label>"
						  //lable+="<select multiple id='report'  name="+reference_code+" class='select_manage multiSelected'></select>";
						 
						  filter_data=data[i].filter_data;
						  //alert(filter_data)
						  if(filter_data){
							if (filter_data.includes("select"))
								{
								var type="query"
									
									  var multi_data=get_data(filter_data,type)
									  multi_data_dic[data[i].filter_name.split(' ').join('_')]=multi_data;
								 	 lable+="<select class='nt-forms vals hidden' id="+data[i].filter_name.split(' ').join('_')+" name="+data[i].filter_name.split(' ').join('_')+" class='required' multiple='multiple'></select>";
								 	 multi_select.push(data[i].filter_name.split(' ').join('_'))
								}
							else
								{   
								  var type="refitem"
								  var multi_data=get_data(filter_data,type)
								  multi_data_dic[filter_data]=multi_data;
								 lable+="<select class='nt-forms vals hidden' id="+data[i].filter_data+" name="+data[i].filter_name.split(' ').join('_')+" class='required' multiple='multiple'></select>";
								 multi_select.push(data[i].filter_data)
							   }
							
						  }
						  
					   }
				  }//for

				  $("#report_filter").empty()
				  $("#report_filter").append(lable);
				  lable="";
				    if(multi_data_dic)
				    {
				    for(var k in multi_data_dic)
						 {
						multi_data=multi_data_dic[k] 
						$('#'+k).fSelect('destroy');	
						var strAppend = '';
						for (var s=0;s<multi_data.length;s++)
							{
							strAppend += '<option value="'+multi_data[s].refitems_code+'" selected>'+multi_data[s].refitems_name+'</option>'
							}
					    $('#'+k).html(strAppend);
				    	$('#'+k).fSelect('create');
				     	}
				    }	
				    //alert(text_field)
				    //alert(single_select)
				    //alert(date_field)
				    //alert(multi_select)
				    
				    selected_data(text_field)
				    selected_data(single_select)
				    selected_data(date_field)
				    selected_data(multi_select)
				    
				  date_field.map(function(id){
				  $('#'+id).datetimepicker({
						prevText: '<i class="nf nf-right-arrow-sq"></i>',
						nextText: '<i class="nf nf-left-arrow-sq"></i>',
						
						  	ampm: true,
						    timeFormat: 'h:mm TT',
						    stepMinute: 15,
						    minTime: '08:00:00', // 08:00:00 AM,
						    //maxTime: '05:00:00', // 05:00:00 AM,
						beforeShow: function(input, inst) {
								var newclass = 'smart-forms'; 
								var smartpikr = inst.dpDiv.parent();
								if (!smartpikr.hasClass('smart-forms')){
									inst.dpDiv.wrap('<div class="'+newclass+'"></div>');
								}
						}					
					});
				  })
			  }//if data
			})//done
			function toTitleCase(str) {
				    return str.replace(/(?:^|\s)\w/g, function(match) {
				        return match.toUpperCase();
				    });
				}
		 	function get_data(filter_data,type){
		 		var query="";
		 		if (type==="refitem")
		 			{
		 			query="select ri.refitems_code,ri.refitems_name from reference_items as ri inner join reference_item_category on refitem_category_id=refitems_category_code_id_id where refitem_category_code='"+filter_data+"'";
		 			}
		 		else{
		 			query=filter_data;
		 		  }
		 		$.ajax({ //ajax call for filter
					  type : "POST",
					  url : '/get_filter_data/',
					  data : {'query':query},
					  async : false,
					}).done( function(json_data) {
					  content_data = JSON.parse(json_data);
					  content_data=content_data.value;
					});
		 		 if(content_data){
		 			return content_data;
				  }
     		 	}
		 	 function selected_data(selected_dat){
		 		 if(selected_dat[0]=="multi" || selected_dat[0]=="single" ||selected_dat[0]=="date"){
		 			selected_dat.map(function(id){
		 				$('#'+id).change(function(){
		 				 if($(this).val())
		 					{
		 					name=$(this).attr("name")
			 				name=name.split('_').join(' ')
			 				set_filter(name,id);
		 					}
		 				 else
		 					 {
		 					 
		 					 delete values_dic[id];
		 					 $('#filter_value').tagsinput('remove',name );	 					
		 					 }	
	 					 if($(this).val() == 0)
 						 {
	 						$('#filter_value').tagsinput('remove',name );
 						 }
					    })
 		 			})
		 		 }
		 		if(selected_dat[0]=="text" ){
		 			selected_dat.map(function(id){
		 				$('#'+id).keyup(function(){
		 					$('#'+id).focus();
		 					name=$(this).attr("name")
			 				name=name.split('_').join(' ')
			 					set_filter(name,id);	
		 				})
		 			})
		 		 }
		 	 }
		 	function set_filter(param,id){
		 		 	$('#filter_value').tagsinput({
                    allowDuplicates: false,
                    itemValue: 'id',  
                    itemText: 'label'
                });
		 		 	if($('#'+id).val()){
		 		 	$('#filter_value').tagsinput('add', param);
		 		 	}	
		 		 	else
		 		 		{
		 		 		$('#filter_value').tagsinput('remove',name );	 	
		 		 		}
                    //$('#filter_value').tagsinput('focus');
            $.each($("#"+id+" option:selected"), function(){
            	if($(this).val())
            		{
            		
            		values_dic[id]=$(this).val();
            		}
            	else
            		{
            			delete values_dic[id]; 
 	        		
            		}
		 	})
		 	if($('#'+id).val())
		 		{
		 		values_dic[id]=$('#'+id).val();	
		 		}
		 	else
		 		{
		 		delete values_dic[id]; 
		 		}
		 	}
 		});//onchange radio
$('#report_serarch').on('click',function(){
	if(selection==1)
	{		
		$('#generated_report_employee').parents('div.dataTables_wrapper').first().remove();
		if($('#generated_report_employee').length==0){ 
		$('#table_div').html("<table id='generated_report_employee'	class='table table-border table-mouseover footable'></table>")
		}
	}
	if(selection==2)
	{
		$('#generated_report_canditate').parents('div.dataTables_wrapper').first().remove();
		if($('#generated_report_canditate').length==0){
			$('#table_div').html("<table id='generated_report_canditate' class='table table-border table-mouseover footable'></table>")
				}
	}	
	if(selection==4)
	{
	$('#generated_report_tabel_leave').parents('div.dataTables_wrapper').first().remove();
	if($('#generated_report_tabel_leave').length==0){ 
		$('#table_div').html("<table id='generated_report_tabel_leave'	class='table table-border table-mouseover footable'></table>")
		}
	}
	if(selection==3)
	{
	$('#generated_report_tabel_attendance').parents('div.dataTables_wrapper').first().remove();
	if($('#generated_report_tabel_attendance').length==0){ 
		$('#table_div').html("<table id='generated_report_tabel_attendance'	class='table table-border table-mouseover footable'></table>")
		}
	}
	  var key=$(this).attr("name")
		  
	  $.ajax({ //ajax call for filter
		  type : "POST",
		  url : '/filter_data_result/',
		  data : {'chosen_fields':JSON.stringify(values_dic),"selection":selection},
		  async : false,
		}).done( function(json_data) {

		  table_data = JSON.parse(json_data);
		  if(table_data.employee)
		  {
			  table_data=table_data.employee;
			  generated_report_tabel_employee(table_data)
		  }
		  if(table_data.canditate)
		  {
			  table_data=table_data.canditate;
			  generated_report_tabel_canditate(table_data)
		  }
		  if(table_data.leave)
		  {
			  table_data=table_data.leave;
			  generated_report_tabel_leave(table_data)
		  }
		  if(table_data.attendance)
		  {
			  table_data=table_data.attendance;
			  generated_report_tabel_attendance(table_data)
		  }
		});
	})
//table generated functions
function generated_report_tabel_employee(data){
	datatable_list = []
		if(data){
					for(var i=0;i<data.length;i++){
						list = []
						list.push(data[i].id,i+1,data[i].title,data[i].first_name,data[i].last_name,data[i].company,data[i].employee_role,data[i].date_of_joining);
						datatable_list.push(list);
					}
				
				var titles = [{
				    title: "ID"
				  },{
				    title: "No."
				  },{
				    title: "Title"
				  },{
				    title: " First Name "
				  }, {
				    title: "Last Name"
				  }, {
				    title: "Company"
				  }, {
				    title: "Role"
				  },{
				    title: "Joining Date"
				  },
				  ];
				AdvancedataTableFunction(datatable_list,'generated_report_employee',titles)
			
		}	
		else
			{
			var titles =[{
			    title: "ID"
			  },{
			    title: "No."
			  },{
			    title: "Title"
			  },{
			    title: " First Name "
			  }, {
			    title: "Last Name"
			  }, {
			    title: "Company"
			  }, {
			    title: "Role"
			  },{
			    title: "Joining Date"
			  },
			  ];
			AdvancedataTableFunction(datatable_list,'generated_report_employee',titles)
			
			}
}

//table generated functions
function generated_report_tabel_canditate(data){
	datatable_list = []
		if(data){
					for(var i=0;i<data.length;i++){
						list = []
						list.push(data[i].id,i+1,data[i].title,data[i].first_name,data[i].last_name,data[i].company,data[i].department,data[i].job_position,data[i].applied_date,data[i].status);
						datatable_list.push(list);
					}
				
				var titles = [{
				    title: "ID"
				  },{
				    title: "No."
				  },{
				    title: "Title"
				  },{
				    title: " First Name "
				  }, {
				    title: "Last Name"
				  }, {
				    title: "Company"
				  }, {
				    title: "Department"
				  },{
				    title: "Jop Position"
				  },{
				    title: "Applied Date"
				  },
				  {
					  title: "Status"
				 },
				  ];
				AdvancedataTableFunction(datatable_list,'generated_report_canditate',titles)
			
		}	
		else
			{
			var titles = [{
			    title: "ID"
			  },{
			    title: "No."
			  },{
			    title: "Title"
			  },{
			    title: " First Name "
			  }, {
			    title: "Last Name"
			  }, {
			    title: "Company"
			  }, {
			    title: "Department"
			  },{
			    title: "Jop Position"
			  },{
			    title: "Applied Date"
			  },
			  {
				  title: "Status"
			 },
			  ];
			AdvancedataTableFunction(datatable_list,'generated_report_canditate',titles)
			
			}
}
function generated_report_tabel_leave(data){
	datatable_list = []
	if(data){
				for(var i=0;i<data.length;i++){
					list = []
					list.push(data[i].id,i+1,data[i].emp_id,data[i].name,data[i].company,data[i].from_date,data[i].to_date,data[i].state);
					datatable_list.push(list);
				}
			var titles = [{
			    title: "ID"
			  },{
			    title: "No."
			  },{
			    title: "Employee Id"
			  },{
			    title: " Employee Name "
			  }, {
			    title: "Company"
			  }, {
			    title: "From Date"
			  },{
			    title: "To Date"
			  },{
			    title: "Status"
			  },
			  ];
			AdvancedataTableFunction(datatable_list,'generated_report_tabel_leave',titles)
	}	
	else
		{
		var titles =  [{
		    title: "ID"
		  },{
		    title: "No."
		  },{
		    title: "Employee Id"
		  },{
		    title: " Employee Name "
		  }, {
		    title: "Company"
		  }, {
		    title: "From Date"
		  },{
		    title: "To Date"
		  },{
		    title: "Status"
		  },
		  
		  ];
		AdvancedataTableFunction(datatable_list,'generated_report_tabel_leave',titles)
		
		}
}
function AdvancedataTableFunction_1(datatable_list,tbl_name,titles) {
	
	function format ( d ) {
		var content='';
		//alert(d[2])
		 content_data='';
		from_date=$('#dtimepicker1_DateFrom').val()
		to_date=$('#dtimepicker1_DateTo').val()
		$.ajax({ //ajax call for check in and check out
					  type : "POST",
					  url : '/attendance_details/',
					  data : {'employee_id':d[3],'from_date':from_date,'to_date':to_date},
					  async : false,
					}).done( function(json_data) {
					  content_data = JSON.parse(json_data);
					  content_data=content_data.value;
					  
					  if(content_data){
						count=0;
					  content+='<div class="table_grid_color"> <table class="table"  width="50%" cellspacing="0"> <thead> <tr><th>S.NO.</th><th>Check In</th><th>Check Out</th> </tr></thead> <tbody>';
						  
					  	for(var c=0;c<content_data.length;c++)
					  		{
					  		count+=1
							 content+='<tr>'+
							    '<th scope="row">'+count+'</th>';
							    if(content_data[c].check_in !=null)
							    {	
							   content+='<td>'+content_data[c].check_in +'</td>';
							    }
							    else
							    	{
							    	content+='<td> null</td>';
							    	}
					  			if(content_data[c].check_out!=null){
					  				content+='<td>'+content_data[c].check_out +'</td>';
					  			}
					  			else
					  				{
					  				content+='<td> null</td>';
					  				}
					  			content+='</tr>';
					  		} 
					  	
					    content+='</tbody></table></div>';
					}
		      });	
		return content
		
		/*return'Full name: '+d.first_name+' '+d.last_name+'<br>'+
	        'Salary: '+d.salary+'<br>'+
	        'The child row can contain any data you wish, including links, images, inner tables etc.';
		*/
		
		
	}
	 
    var dataSet = datatable_list;
    titles.splice(1, 0, {data: null,
        defaultContent: '',
        className: 'control',
        orderable: false});
    var data_length = dataSet.length
    for (var i=0;i<data_length;i++){
  	  dataSet[i].splice(1, 0, 0);
    }
    var columnDefs = titles
    var myTable;
	    myTable = $('#'+tbl_name).DataTable({
		"sPaginationType": "full_numbers",
		destroy: true,
		data: dataSet,
		 
		columns: columnDefs,
		dom : 'lBfrtip',
		initComplete: function() {
			   $('.buttons-csv').html('<i class="nf nf-file-text-o" />')
			   $('.buttons-excel').html('<i class="nf nf-excel" />')
			   $('.buttons-pdf').html('<i class="nf nf-pdf" />')
			   $('.buttons-print').html('<i class="nf nf-print" />')
			  },
        buttons: ['csv', 'excel', 'pdf', 'print'],
		"oLanguage": {"sZeroRecords": "No data available"},
		"language": {
			"zeroRecords": "No matching records found",
			"infoEmpty": "No data available"
		},
		"order": [[ 3, 'asc' ]],
		"aoColumnDefs": [ {"sClass": "dt_col_hide", "aTargets": [0]}],
		 "responsive": {
		      details: {
		          type: 'column',
		          target: 1
		  }
	     },
	});
	    var detailRows = [];
	    $("#generated_report_tabel_attendance").on("click", "tr", function() {    
	    //$('#generated_report_tabel_attendance tbody').on( 'click', 'tr td.details-control', function () {
	    	
	    	//var id = $(this).children(":first").text();
	    	var emp_id=myTable.row( this ).data()[3]
	    	//alert(myTable.row( this ).data()[3])
	    	
	    	  if (emp_id != 'ID'){
	    		 //alert(emp_id)
	    	  	
	    	  }
	    	var tr = $(this).closest('tr');
	        var row = myTable.row( tr );
	        var idx = $.inArray( tr.attr('id'), detailRows );
	  
	        if ( row.child.isShown() ) {
	            tr.removeClass( 'details' );
	            row.child.hide();
	 
	            // Remove from the 'open' array
	            detailRows.splice( idx, 1 );
	        }
	        else {
	            tr.addClass( 'details' );
	            row.child( format( row.data() ) ).show();
	 
	            // Add to the 'open' array
	            if ( idx === -1 ) {
	                detailRows.push( tr.attr('id') );
	            }
	        }
	    } );
	 
	    // On each draw, loop over the `detailRows` array and show any child rows
	    myTable.on( 'draw', function () {
	        $.each( detailRows, function ( i, id ) {
	            $('#'+id+' td.details-control').trigger( 'click' );
	        } );
	    } );
	    
	myTable.on('order.dt search.dt', function () {                                           
		myTable.column(2, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
			cell.innerHTML = i+1;
		});
	}).draw();
	

	//$('#'+tbl_name+' th:nth-child(1)').hide();
	//$('#'+tbl_name+' td:nth-child(1)').hide();
}
function generated_report_tabel_attendance(data){
	datatable_list = []
	if(data){
				for(var i=0;i<data.length;i++){
					list = []
					list.push(data[i].emp_id,i+1,data[i].emp_id,data[i].emp_name,data[i].company,data[i].check_in,data[i].check_out);
					datatable_list.push(list);
				}
			
			var titles = [{
			    title: "ID"
			  },{
			    title: "No."
			  },{
			    title: "Employee Id"
			  },{
			    title: " Employee Name "
			  }, {
			    title: "Company"
			  }, {
			    title: "Check In"
			  },{
			    title: "Check Out"
			  }
			  ];
			AdvancedataTableFunction_1(datatable_list,'generated_report_tabel_attendance',titles)
		
	}	
	else
		{
		var titles = [{
		    title: "ID"
		  },{
		    title: "No."
		  },{
		    title: "Employee Id"
		  },{
		    title: " Employee Name "
		  }, {
		    title: "Company"
		  }, {
		    title: "Check In"
		  },{
		    title: "Check Out"
		  },
		  
		  ];
		AdvancedataTableFunction_1(datatable_list,'generated_report_tabel_attendance',titles)
		}
}//atte
//table row click get id
$("#generated_report_tabel_attendance").on("click", "tr", function() {   
	$('.labels').addClass('active');
  var id = $(this).children(":first").text();
  if (id != 'ID'){
  	
  }
  
});
	
});
