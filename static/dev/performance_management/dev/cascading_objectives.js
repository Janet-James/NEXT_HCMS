var dataret = [];
var treeData = []
var cascading_quarter;
var cascading_year;
$(document).ready(function(){
	var yearData = new Date()
	yearVal = $("#cascading_year option:contains(" + yearData.getFullYear() + ")").val();
	$('#cascading_year').val(yearVal).trigger('change')
	$('#cascading_quarter').val(Math.ceil((yearData.getMonth() + 1) / 3)).trigger('change');
	$('#cascading_org').val($('#cascading_org').val()).trigger('change');
	/**	Validation for Drop Data Start **/
	$.validator.addMethod("valueNotEquals", function(value, element, arg){
		if(value == 0) {
			return false
		} else {
			return true
		}
	}, "Value must not equal arg.");
/**	Validation for Drop Data End **/
	
/** Validation For Employee Self Request Training Exist Form Start **/ 
	$('#cascading_objectives_tree_form').submit(function(e) {
		e.preventDefault();
	}).validate({

		rules: {
			cascading_org: {
				valueNotEquals:true,
			},
			cascading_year:{
				valueNotEquals:true,
			},
			cascading_quarter: {
				valueNotEquals: true,
			},  
		
		},
		//For custom messages
		messages: {
			cascading_org:{
				valueNotEquals: "Select the Organization",
			},
			cascading_year:{
				valueNotEquals:"Select the Year",
			},
			cascading_quarter: {
				valueNotEquals:"Select the Quarter",
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
})

function cascading_objective_tree_form_validation(){
	return $('#cascading_objectives_tree_form').valid();
}

$("#cascading_year").change(function(){
	cascadingObjectivesView();
})

$("#cascading_quarter").change(function(){
	cascadingObjectivesView();
})

$("#cascading_org").change(function(){
	cascading_org = $('#cascading_org').val();
	$.ajax({
		url : '/cascading_orgunit_fetch/',
		type : 'GET',
		data : {'cascading_org':cascading_org},
		async : false,
	}).done(function(json_data) {
		console.log("json_data",json_data)
		var data=json_data
		$('#cascading_org_unit').html('')
		$('#cascading_org_unit').append($('<option>', {
            value :'0',
            text :'--Select--'
		}));
		if(data){
			var data_len=data.org_unit_data.length;
			if(data_len>=1){  
				for(var i=0;i<data_len;i++){   
					$('#cascading_org_unit').append($('<option>', {
                    value : data.org_unit_data[i].id,
                    text : data.org_unit_data[i].name,
			        }));
				}
			}
		}
	})
	cascadingObjectivesView();
})

$("#cascading_org_unit").change(function(){
	cascading_org_unit = $('#cascading_org_unit').val();
	$.ajax({
		url : '/cascading_division_fetch/',
		type : 'GET',
		data : {'cascading_org_unit':cascading_org_unit,},
		async : false,
	}).done(function(json_data) {
		var data=json_data
		$('#cascading_division').html('')
		$('#cascading_division').append($('<option>', {
            value :'0',
            text :'--Select--'
		}));
		if(data){
			var data_len=data.division_data.length;
			if(data_len>=1){  
				for(var i=0;i<data_len;i++){   
					$('#cascading_division').append($('<option>', {
                    value : data.division_data[i].id,
                    text : data.division_data[i].name,
			        }));
				}
			}
		}
	})
	cascadingObjectivesView()
})

$("#cascading_division").change(function(){
	cascadingObjectivesView()
})

function cascadingObjectivesView(){
		dataret = [];
		treeData = []
		cascading_year = $('#cascading_year :selected').text();
		cascading_quarter = (($('#cascading_quarter :selected').text()).split(" "))[1];
		cascading_org = $('#cascading_org').val();
		cascading_org_unit = $('#cascading_org_unit').val();
		cascading_division = $('#cascading_division').val();
		cascading_status = cascading_objective_tree_form_validation();
		if(cascading_status){
			$.ajax({
				url : '/cascading_objective_view_quarter/',
				type : 'GET',
				data : {'cascading_year':cascading_year,'cascading_quarter':cascading_quarter,'cascading_org':cascading_org,'cascading_org_unit':cascading_org_unit,'cascading_division':cascading_division},
				async : false,
			}).done(function(json_data) {
				if(json_data.status=="NTE-01"){
					$.jstree.destroy();
					json_data['common_data'].map(data=>{
						json_data['objective_data'].map(cdata=> {
							if(cdata.parent == data.id){
								dataret.push(data)
							}
						})
					})
					treeData = json_data['objective_data'].concat(Array.from(new Set(dataret)))
					if (treeData.length!=0) {
						treeData.map(function(value, index) {
							if (value.parent == "#") {
								value["icon"] = "nf nf-country";
							} else {
								value["icon"] = "nf nf-location";
							}
						});
						$("#objTree").jstree({
							'core' : {
								themes : {
									"variant" : "large",
									responsive : !1
								},
								'data' : treeData
							},
						})
					} else {
						$.jstree.destroy();
						$("#objTree").html("")
						$("#objTree").append('<p class="no_data_found">No Data Avaliable</p>')
					}
				}
				else{
					$.jstree.destroy();
					$("#objTree").html("")
					$("#objTree").append('<p class="no_data_found">No Data Avaliable</p>')
				}
			});
		}
	}

