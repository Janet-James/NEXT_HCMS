$('document').ready(function(){
	 $("#rating_div").hide()
	 $('#performance_table_view').show();
     performance_assessment_table();
});

var  columns = [{"title":"ID"},{"title":"Employee"}, {"title":"Organization"}, {"title":"Organization Unit"},{"title":"Year"}]

function performance_assessment_table(data){
if(data){
		var len=data.status.length;
		var data_list = []
		if(len>0){   
			for(var i=0;i<len;i++){   
				data_list.push([data.status[i].id,data.status[i].first_name +" "+data.status[i].last_name,data.status[i].name,data.status[i].orgunit_name,data.status[i].assessment_year]);
								  }
			plaindatatable_btn('performance_assessment_table', data_list, columns,0)}
	    else{plaindatatable_btn('performance_assessment_table', data_list, columns,0)}
  	 }
else{plaindatatable_btn('performance_assessment_table', data_list, columns,0)}
}

//Back click function
$('#performance_assessment_back').click(function(){
	$("#filter_role").html("");
	$('#performance_table_view').show();
    $("#rating_div").hide()
	})
var kpi_list = []
var form_id = ''
var rating = '';
var listData = [];
var listId = [];
var ratingName = [];
var id = ''

//performance Row Click
$('#performance_assessment_table').on('click', 'tbody tr', function(){
	kpi_list = []
	form_id = ''
	rating = '';
	$('#kpi_data').empty()
	$('#filter_role').empty()
	$('#kpi_heading').html('')
    id = $('#performance_assessment_table').dataTable().fnGetData(this)[0];
    $('#performance_table_view').hide();
    $("#rating_div").show()
    $.ajax({
		type:'GET',
		url: '/performance_kpi_kr_data/',
		async : false,
		data  : { 'id':id},
		success: function (json_data){
		var data=json_data
		if(data.user[0]=='Success'){
		if(data.assessor_data.length>0){
			$('#kpi_heading').append("Assessor - "+data.fetch_info_viwer_role[0].refitems_name+" - "+data.feedback[0].name+" "+data.feedback[0].last_name)
			if(data.status.length<=0 && data.status_kr.length<=0){
				button_create(1)
				var kpi_len = data.kpi_data.length
				if(kpi_len>0){
					for(var i=0;i<kpi_len;i++){
						$('#kpi_data').append('<div><p class="rating_content">'+data.kpi_data[i].kpi_definition+'</p><div id='+data.kpi_data[i].id+' class=rateYo></div><div class="test rating_text"><input type=hidden value="KR" id="0"></input></div><div class="clearfix"></div></div>')
						 kpi_list.push({'summary':data.kpi_data[i].kpi_definition,'ref_id':data.assessor_type_refitem_id,'employee_id':data.employee_data,'form_id':id,
						 })
					}
					$(".rateYo").rateYo({starWidth: "20px"});
					$('.rateYo').on("rateyo.set", function(e, data) {
						$(this).next().innerText= " "
			            ratingVal = $(this).next().text("(" + data.rating + ")");
			            valRate = data.rating
			            form_id =  $(this).attr("id");
			            listData.splice($(this).parent().index(),1,valRate)
			        	});
					$('.rateYo').each(function(index,value){
						rating = $(this).next().find('input').val()
						var ratingid = $(this).attr("id")
						listId.push(ratingid)
						ratingName.push(rating)
			        })
					}
				var kr_len = data.kr_data.length
				if(kr_len>0){
					for(var i=0;i<kr_len;i++){
						$('#kpi_data').append('<div><p class="rating_content">'+data.kr_data[i].kr_summary+'</p><div id='+data.kr_data[i].id+' class="rateYoo"></div><div class="test_kr rating_text"><input type=hidden value="KPI"></input></div><div class="clearfix"></div></div>')
						kpi_list.push({'summary':data.kr_data[i].kpi_definition,'ref_id':data.assessor_type_refitem_id,'employee_id':data.employee_data,'form_id':id,
						})  
					}
					$(".rateYoo").rateYo({starWidth: "20px"});
					$('.rateYoo').on("rateyo.set", function(e, data) {
						$(this).next().innerText= " "
			            ratingVal = $(this).next().text("(" + data.rating + ")");
			            valRate = data.rating
			            form_id =  $(this).attr("id");
			            listData.splice($(this).parent().index(),1,valRate)
					});
					$('.rateYoo').each(function(index,value){
						  rating = $(this).next().find('input').val()
						  var ratingid = $(this).attr("id")
						  listId.push(ratingid)
						  ratingName.push(rating)
			        })
				}
				}
				else{
					$('#feed_back').val(data.feedback[0].assessor_feedback)
					$('#learning_pointers').val(data.feedback[0].learning_pointers)
					button_create(2)
					var kpi_len = data.kpi_data.length
					if(kpi_len>0 && data.status_kr.length>0){
						for(var i=0;i<kpi_len;i++){
							$('#kpi_data').append('<div><p class="rating_content">'+data.kpi_data[i].kpi_definition+'</p><div id='+data.kpi_data[i].id+' class="rateYo" ></div><div class="test rating_text"><input type=hidden value="KR"></input></div><div class="clearfix"></div></div>')
						    kpi_list.push({'summary':data.kpi_data[i].kpi_definition,'ref_id':data.assessor_type_refitem_id,'employee_id':data.employee_data,'form_id':id,'rating_id':data.status_kr[i].rating_id})
						}
						$(".rateYo").rateYo({ starWidth: "20px"});
						$('.rateYo').on("rateyo.set", function(e, data) {
							$(this).next()[0].innerHTML= ''
				            ratingVal = $(this).next().append("<input type=hidden value='KR'></input>(" + data.rating + ")");
				            valRate = data.rating
				            form_id =  $(this).attr("id");
				            listData.splice($(this).parent().index(),1,valRate)
					    });
						$('.rateYo').each(function(index,value){
						$(this).rateYo("option", "rating",data.status_kr[index].assessment_rating.toString());
							rating = $(this).next().find('input').val()
							var ratingid = $(this).attr("id")
							listId.push(ratingid)
							ratingName.push(rating)
			            })
						}
					var kr_len = data.kr_data.length
					if(kr_len>0 && data.status.length>0){
						for(var i=0;i<kr_len;i++){
							$('#kpi_data').append('<div><p class="rating_content">'+data.kr_data[i].kr_summary+'</p><div id='+data.kr_data[i].id+' class="rateYoo" ></div><div class="test rating_text"></div><div class="clearfix"></div>')
						    kpi_list.push({'summary':data.kr_data[i].kpi_definition,'ref_id':data.assessor_type_refitem_id,'employee_id':data.employee_data,'form_id':id,'rating_id':data.status[i].rating_id
							})  
						}
						$(".rateYoo").rateYo({ starWidth: "20px"});
						$('.rateYoo').on("rateyo.set", function(e, data) {
							$(this).next()[0].innerHTML= ''
				            ratingVal = $(this).next().append("<input type=hidden value='KPI'></input>("+data.rating+")");
				            valRate = data.rating
				            form_id =  $(this).attr("id");
				            listData.splice($(this).parent().index(),1,valRate)
					    });
						$('.rateYoo').each(function(index,value){
							  $(this).rateYo("option", "rating",data.status[index].assessment_rating.toString());
							  rating = $(this).next().find('input').val()
							  var ratingid = $(this).attr("id")
							  listId.push(ratingid)
							  ratingName.push(rating)
			            })
					    }
				    }
					for(var q=0;q<data.fetch_matrix_viwer_role.length;q++){
						$('#filter_role').append('<li class="dropdown-submenu" role="menu"  id="'+data.fetch_matrix_viwer_role[q].ref_id+'"><a href="#" class="li_role" data-role="'+data.fetch_matrix_viwer_role[q].refitems_name+'" id="'+data.fetch_matrix_viwer_role[q].ref_id+'">'+data.fetch_matrix_viwer_role[q].refitems_name+'</a> \
						<ul class="dropdown-menu dropdown-menu pull-left emp" id="ul_'+data.fetch_matrix_viwer_role[q].ref_id+'">\
						</ul>\
						</li>')
					}
				}
			else{$("#filter_role").html(""),$('#performance_table_view').show(),$("#rating_div").hide(),alert_lobibox("info", "No Data Available")}
		}else{$("#filter_role").html(""),$('#performance_table_view').show(),$("#rating_div").hide(),alert_lobibox("info", "The Form cannot be accessed")}
		},
	})
});


$(document).on('mouseover','.li_role',function(){
	$('.emp').html('')
	var over_id = this.id
	var role = $(this).attr('data-role')
	$.ajax({
		type:'GET',
		url: '/pm_ass_employee_details/',
		async : false,
		data  : {'id':id,'over_id':over_id},
		success: function (json_data){
			var data = json_data
			for(var t=0;t<data.fetch_pm_info_employee.length;t++){
				$('#ul_'+over_id).append('<li class="teamwise_filter test_emp" data-index="'+role+'" data-empname="'+data.fetch_pm_info_employee[t].name+' '+data.fetch_pm_info_employee[t].last_name+'" value="'+id+'" id="'+data.fetch_pm_info_employee[t].emp_id+'"><a href="#">'+data.fetch_pm_info_employee[t].name+' '+data.fetch_pm_info_employee[t].last_name+'</a></li>')
			}
			over_id = ''
			$('#role_sub_id').val('')
		}
	})
})
function button_create(status){
	var strAppend = '';
	if(status == 1){
			strAppend = "<button type='button' class='btn btn-success btn-eql-wid btn-animate margin-right-3' onclick='performance_assessment_kpi_save()'>Save</button>"
			strAppend += "<button type='button' class='btn btn-warning btn-eql-wid btn-animate margin-right-3' onclick='assessment_assessment_kpi_clear()'>Cancel / Clear</button>"
		$('#rating_request_button').html(strAppend);
	}else if(status == 2){
			strAppend = "<button type='button' class='btn btn-success btn-eql-wid btn-animate margin-right-3' onclick='performance_assessment_kpi_update()'>Update</button>"
			strAppend += "<button type='button' class='btn btn-warning btn-eql-wid btn-animate margin-right-3' onclick='assessment_assessment_kpi_clear()'>Cancel / Clear</button>"
		$('#rating_request_button').html(strAppend);
	}else {strAppend +="",$('#rating_request_button').html(strAppend);}
}

$(document).on("click", ".emp li", function(event) {
	$('#kpi_heading').html('')
	$('#kpi_heading').append("Assessor - "+$(this).attr('data-index')+" - "+$(this).attr('data-empname'))
	$('#performance_table_view').hide();
	$("#rating_div").show()
	$.ajax({
		type:'GET',
		url: '/pm_ass_employee_rating/',
		async : false,
		data  : {'id':this.value,'emp_id':this.id},
		success: function (json_data){
			var data = json_data
			kpi_list = []
			form_id = ''
			rating = '';
			$('#kpi_data').empty()
			if(data.key=="Assessor" && (data.status.length<=0 && data.status_kr.length<=0)){
				button_create(1)
			}
			else if(data.key=="Assessor" && (data.status.length>0 || data.status_kr.length>0)){
				button_create(2)
			}
			else{
				$('#feed_back').val('')
				$('#learning_pointers').val('')
				button_create(3)
			}
			if(data.status.length<=0 && data.status_kr.length<=0){
				var kpi_len = data.kpi_data.length
				if(kpi_len>0){
					for(var i=0;i<kpi_len;i++){
						$('#kpi_data').append('<div><p  class="rating_content">'+data.kpi_data[i].kpi_definition+'</p><div id='+data.kpi_data[i].id+' class=rateYo></div><div class="test rating_text"><input type=hidden value="KR" id="0"></input></div><div class="clearfix"></div></div>')
					    kpi_list.push({'summary':data.kpi_data[i].kpi_definition,'ref_id':data.assessor_type_refitem_id,'employee_id':data.employee_data,'form_id':id,
					    })
					}
					$(".rateYo").rateYo({starWidth: "20px"});
					$('.rateYo').on("rateyo.set", function(e, data) {
						$(this).next().innerText= " "
			            ratingVal = $(this).next().text("(" + data.rating + ")");
			            valRate = data.rating
			            form_id =  $(this).attr("id");
			            listData.splice(1,1,valRate)
				     });
					$('.rateYo').each(function(index,value){
						 rating = $(this).next().find('input').val()
						 var ratingid = $(this).attr("id")
						 valRate = 0
						 listData.push(valRate)
						 listId.push(ratingid)
						 ratingName.push(rating)
		            })
				}
				var kr_len = data.kr_data.length
				if(kr_len>0){
					for(var i=0;i<kr_len;i++){
						$('#kpi_data').append('<div><p  class="rating_content">'+data.kr_data[i].kr_summary+'</p><div id='+data.kr_data[i].id+' class="rateYoo"></div><div class="test_kr rating_text"><input type=hidden value="KPI"></input></div><div class="clearfix"></div></div>')
						kpi_list.push({'summary':data.kr_data[i].kpi_definition,'ref_id':data.assessor_type_refitem_id,'employee_id':data.employee_data,'form_id':id,
						})  
					}
					$(".rateYoo").rateYo({starWidth: "20px"});
					$('.rateYoo').on("rateyo.set", function(e, data) {
						$(this).next().innerText= " "
			            ratingVal = $(this).next().text("(" + data.rating + ")");
			            valRate = data.rating
			            form_id =  $(this).attr("id");
			            listData.splice(1,1,valRate)
				     });
					$('.rateYoo').each(function(index,value){
						rating = $(this).next().find('input').val()
						var ratingid = $(this).attr("id")
						valRate = 0
						listData.push(valRate)
						listId.push(ratingid)
						ratingName.push(rating)
		            })
				}
				alert_lobibox("info", "Rating is not available")}
			else{
				$('#feed_back').val(data.feedback[0].assessor_feedback)
				$('#learning_pointers').val(data.feedback[0].learning_pointers)
				var kpi_len = data.kpi_data.length
				if(kpi_len>0 && data.status_kr.length>0){
					for(var i=0;i<kpi_len;i++){
						$('#kpi_data').append('<div><p  class="rating_content">'+data.kpi_data[i].kpi_definition+'</p><div id='+data.kpi_data[i].id+' class="rateYo"></div><div class="test rating_text"><input type=hidden value="KR"></input></div><div class="clearfix"></div></div>')
					    kpi_list.push({'summary':data.kpi_data[i].kpi_definition,'ref_id':data.assessor_type_refitem_id,'employee_id':data.employee_data,'form_id':id,'rating_id':data.status_kr[i].rating_id})
					}
					$(".rateYo").rateYo({starWidth: "20px"});
					$('.rateYo').on("rateyo.set", function(e, data) {
						$(this).next()[0].innerHTML= ''
			            ratingVal = $(this).next().append("<input type=hidden value='KR'></input>(" + data.rating + ")");
			            valRate = data.rating
			            form_id =  $(this).attr("id");
			            listData.splice($(this).parent().index(),1,valRate)
				    });
					$('.rateYo').each(function(index,value){
					$(this).rateYo("option", "rating",data.status_kr[index].assessment_rating.toString());
					  rating = $(this).next().find('input').val()
					  var ratingid = $(this).attr("id")
					  listId.push(ratingid)
					  ratingName.push(rating)
		            })
				}
				var kr_len = data.kr_data.length
				if(kr_len>0 && data.status.length>0){
					for(var i=0;i<kr_len;i++){
						$('#kpi_data').append('<div><p  class="rating_content">'+data.kr_data[i].kr_summary+'</p><div id='+data.kr_data[i].id+' class="rateYoo"></div><div class="test rating_text"></div><div class="clearfix"></div>')
						kpi_list.push({'summary':data.kr_data[i].kpi_definition,'ref_id':data.assessor_type_refitem_id,'employee_id':data.employee_data,'form_id':id,'rating_id':data.status[i].rating_id
						})  
					}
					$(".rateYoo").rateYo({starWidth: "20px"});
					$('.rateYoo').on("rateyo.set", function(e, data) {
						$(this).next()[0].innerHTML= ''
			            ratingVal = $(this).next().append("<input type=hidden value='KPI'></input>("+data.rating+")");
			            valRate = data.rating
			            form_id =  $(this).attr("id");
			            listData.splice($(this).parent().index(),1,valRate)
				     });
					$('.rateYoo').each(function(index,value){
						$(this).rateYo("option", "rating",data.status[index].assessment_rating.toString());
						rating = $(this).next().find('input').val()
						var ratingid = $(this).attr("id")
						listId.push(ratingid)
						ratingName.push(rating)
		            })
				}
			}
		}
	});
});

//Rating Clear function
function assessment_assessment_kpi_clear(){
	$('.rateYo').each(function(index,value){
		$(this).rateYo("option", "rating","0");
		  rating = $(this).next().find('input').val()
		  var ratingid = $(this).attr("id")
		  listId.push(ratingid)
		  ratingName.push(rating)
        })
	$('.rateYoo').each(function(index,value){
		$(this).rateYo("option", "rating","0");
		rating = $(this).next().find('input').val()
		var ratingid = $(this).attr("id")
		listId.push(ratingid)
		ratingName.push(rating)
    })
    $('#feed_back').val('')
    $('#learning_pointers').val('')
}


//Performance Rating Update click
function performance_assessment_kpi_update(){
	var status = "Ok"
	for(var m=0;m<kpi_list.length;m++){
		if(listData[m]=='0') {
			status = "NOT"
			break;
		}
		kpi_list[m]['rating'] = listData[m]
		kpi_list[m]['id'] = listId[m]
    	kpi_list[m]['ratingName'] = ratingName[m]
	} 
	if (status=="Ok"){
	if ($('#feed_back').val()!=''){
	$.ajax({
			type:'GET',
			url: '/assessment_rating_update/',
			async : false,
			data  : {'kpi_data':JSON.stringify(kpi_list),'feed_back':JSON.stringify($('#feed_back').val()),'learning_pointers':JSON.stringify($('#learning_pointers').val())},
			success: function (json_data){
			var data = json_data
			if(data.key=="Updated successfully"){
				 alert_lobibox("success", "Rating is Updated")
				 clear_data();
			}
			else{alert_lobibox("error", "Rating is not Updated")}
			}
	});
	}
	else{alert_lobibox("error", "Fill the Feedback")}
	}else{alert_lobibox("error", "Provide Rating")}
}

//Performance assessment save function
function performance_assessment_kpi_save(){
	var status = "Ok"
	for(var l=0;l<kpi_list.length;l++){
		if(listData[l]=='0') {
			status = "NOT"
			break;
		}
		kpi_list[l]['rating'] = listData[l]
		kpi_list[l]['id'] = listId[l]
		kpi_list[l]['ratingName'] = ratingName[l]
	}
	if (status=="Ok"){
	if ($('#feed_back').val()!=''){
	$.ajax({
		type:'GET',
		url: '/assessment_rating_save/',
		async : false,
		data  : {'kpi_data':JSON.stringify(kpi_list),'feed_back':JSON.stringify($('#feed_back').val()),'learning_pointers':JSON.stringify($('#learning_pointers').val())},
		success: function (json_data){
		var data = json_data
		if(data.status=="Added successfully"){
			alert_lobibox("success", "Rating is saved")
			clear_data();
			}
		else{alert_lobibox("error", "Rating is not saved")}
		}
	});
	}
	else{alert_lobibox("error", "Fill the Feedback")}
	}else{alert_lobibox("error", "Provide Rating")}
}

function clear_data(){
	$('#viewer_organizations').val(0).trigger("change")
	$('#org_unit').val(0).trigger("change")
	$('#viewer_division').val(0).trigger("change")
	$('#employeee_name').val(0).trigger("change")
	$('#feed_back').val('')
	$('#learning_pointers').val('')
	$('#performance_table_view').show();
    $("#rating_div").hide()
    kpi_list=[]
	form_id = ''
	rating = '';
    listData = [];
	listId = [];
	ratingName = [];
    performance_assessment_table();
    $('.errormessage').html('')
//  $('.emp').html('')
	$('#kpi_heading').html('')
//	$('#kpi_data').empty()
}

//clear Data
$('#assessment_performnce_clear').click(function(){
	clear_data();
})

//Search Data
$('#performance_assessment_find').click(function(){
	$('#performance_table_view').show();
    $("#rating_div").hide()
	var str_org_id=$('#viewer_organizations  option:selected').val()
	var str_org_unit_id=$('#org_unit  option:selected').val()
	var str_div_id=$('#viewer_division  option:selected').val()
	var employee_name=$('#employeee_name').val();
    var year = $('#year  option:selected').val()
    var quarter = $('#quarter  option:selected').val()
    var status=assessment_form_validation();
    if(status){
    	if(str_org_id!='0' && str_org_id!=''){
		$.ajax({
			type:'GET',
			url: '/performance_assessment_table/',
			async : false,
			data  : { 'str_org_id':str_org_id,'str_org_unit_id':str_org_unit_id,'str_div_id':str_div_id,'employee_name':JSON.stringify(employee_name),
				'year':year,'quarter':quarter},
			success: function (json_data){
			var data=json_data
			if(data.status.length !=0){
				if(data.status=="year"){alert_lobibox("error", "Select Year")}
				else{performance_assessment_table(data);}
				}
			else{
			alert_lobibox("error", "Assessment Form is not Created for Selected Employee")}
			}	,
		})
		}
    }else{}
});

//Organization onchange
$('#viewer_organizations').change(function(){
	var str_org_id=$('#viewer_organizations  option:selected').val()
	if(str_org_id!='0' && str_org_id!=''){
	$.ajax({
		type:'GET',
		url: '/organization_unit/',
		async : false,
		data  : { 'str_org_id':str_org_id},
		success: function (json_data){
		var data=json_data
		$('#org_unit').html('')
		$('#org_unit').append($('<option>', {
            value :'0',
            text :'--Select--'
		}));
		if(data){
			var data_len=data.status.length;
			if(data_len>=1){  
				for(var i=0;i<data_len;i++){   
					$('#org_unit').append($('<option>', {
                    value : data.status[i].id,
                    text : data.status[i].orgunit_name,
			        }));
				}
			}
			else{ $('#org_unit').val('0').trigger("change"); }
				var emp_len=data.employee_data.length;
				if(emp_len>=1){  
					for(var i=0;i<emp_len;i++){   
						$('#employeee_name').append($('<option>', {
	                    value : data.employee_data[i].id,
	                    text : data.employee_data[i].name+' '+data.employee_data[i].last_name,
			            }));
					}
				}
				else{ $('#employeee_name').val('0').trigger("change"); }
				}
				else{ $('#org_unit').val('0').trigger("change"); }
			},
		})	
	}
	else {
		$('#org_unit').html('')
		$('#org_unit').append($('<option>', {
            value :'0',
            text :'--Select--'
		}));
		$('#org_unit').val('0').trigger("change"); }
});

//Organization unit onchange
$('#org_unit').change(function(){
	var str_org_unit_id=$('#org_unit  option:selected').val()
	var str_org_id=$('#viewer_organizations  option:selected').val()
	if(str_org_unit_id!='0' && str_org_unit_id!='' ){
	$.ajax({
		type:'GET',
		url: '/organization_unit_view/',
		async : false,
		data  : { 'str_org_unit_id':str_org_unit_id,'str_org_id':str_org_id},
		success: function (json_data){
		var data=json_data
		$('#viewer_division').html('')
		$('#viewer_division').append($('<option>', {
            value :'0',
            text :'--Select--'
		}));
		if(data){
			var data_len=data.status.length;
			if(data_len>=1){  
				for(var i=0;i<data_len;i++){   
					$('#viewer_division').append($('<option>', {
	                    value : data.status[i].id,
	                    text : data.status[i].name,
			         }));
				}
			}
			else{ $('#viewer_division').val('0').trigger("change"); }
			var emp_len=data.employee_data.length;
			if(emp_len>=1){  
				for(var i=0;i<emp_len;i++){   
					$('#employeee_name').append($('<option>', {
	                    value : data.employee_data[i].id,
	                    text : data.employee_data[i].name+' '+data.employee_data[i].last_name,
	                }));
				}
			}
			else{ $('#employeee_name').val('0').trigger("change"); }
			}
			else{ $('#viewer_division').val('0').trigger("change"); }
			},
		})	
	}
	else {
		$('#viewer_division').html('')
		$('#viewer_division').append($('<option>', {
            value :'0',
            text :'--Select--'
		}));
		$('#viewer_division').val('0').trigger("change"); }
});

//Viewer Division
$('#viewer_division').change(function(){
	var str_org_unit_id=$('#org_unit  option:selected').val()
	var str_org_id=$('#viewer_organizations  option:selected').val()
	var str_div_id=$('#viewer_division  option:selected').val()
	if(str_div_id!='0' && str_div_id!=''){
	$.ajax({
		type:'GET',
		url: '/organization_division_view/',
		async : false,
		data  : { 'str_org_id':str_org_id,'str_org_unit_id':str_org_unit_id,'str_div_id':str_div_id},
		success: function (json_data){
			var data=json_data
			$('#employeee_name').html('')
			if(data){
				var data_len=data.employee_data.length;
				if(data_len>=1){  
					for(var i=0;i<data_len;i++){   
						$('#employeee_name').append($('<option>', {
			                   value : data.employee_data[i].id,
			                   text : data.employee_data[i].name+' '+data.employee_data[i].last_name,
			             }));
						}
				}
				else{ $('#employeee_name').val('0').trigger("change"); }
				}
				else{ $('#employeee_name').val('0').trigger("change"); }
			},
		})	
	}
	else {
		$('#employeee_name').html('')
		$('#employeee_name').val('0').trigger("change"); }
});


//Rating Form validation
$('#performance_assessment_form').submit(function(e) {
	e.preventDefault();
}).validate({
	rules: {
		organizations: { valueNotEquals:true, },
		employeee_name: { valueNotEquals:true, },
	},
	//For custom messages
	messages: {
		organizations: { valueNotEquals: "The field is required", },
		employeee_name: { valueNotEquals: "The field is required", },
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
function assessment_form_validation()
{return $('#performance_assessment_form').valid();}