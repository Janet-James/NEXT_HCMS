// global variables declaration
var validation_value='';
var flag = 0;
var salary_rule_uid = 0;
var range_value='';
var salary_rule_condition_list=[]
var salary_rule_table_id = 0

//on ready function
$(document).ready(function(){
	$("#contribution_id").attr('placeholder',"--Select Contribution Register--");
	salary_code_auto_generate();
	salary_rule_table_dispaly();
	$('#hr_range_criteria_add').show();
	button_create_rule(1);
	document.getElementById('salary_rule_expressions_div').style.display = "none";
	document.getElementById('salary_component_div').style.display = "none";
	document.getElementById('salary_rule_value_div').style.display = "none";
	document.getElementById('contribution_register_div').style.display = "none";
	document.getElementById('vaidation_criteria_view').style.display = "none";
	document.getElementById('cal_salary_rule_expressions_div').style.display = "none";
	document.getElementById('value_ass_criteria_view').style.display = "none";
	document.getElementById('percentage_div').style.display = "none";
	document.getElementById('salary_rule_range_criteria_div').style.display = "none";
	$('#hr_salary_rule_contribution_reg').change(function() {
        if(this.checked) {
        	document.getElementById('contribution_register_div').style.display = "block";
        	$(".select2-search__field").attr('placeholder',"--Select Contribution Register--");
        }else{
        	$('#contribution_id').val('').trigger('change');
        	$(".select2-search__field").attr('placeholder',"--Select Contribution Register--");
        	document.getElementById('contribution_register_div').style.display = "none";       
        	}
    });
});

//button create function here
function button_create_rule(status){
	var access_for_create = jQuery.inArray( "Payroll Setup", JSON.parse(localStorage.Create) );
	var access_for_write = jQuery.inArray( "Payroll Setup", JSON.parse(localStorage.Write) );
	var access_for_delete = jQuery.inArray( "Payroll Setup", JSON.parse(localStorage.Delete) );
	/*if(status == 1){
			strAppend = " <button type='button' onclick='salary_rule_clear()' class='btn btn-warning btn-animate btn-eql-wid btn-animate'>Cancel / Clear</button>"
				$('#hrms_salary_rule_btn').html(strAppend);
	}*/ if(status == 1){
		if(access_for_create != -1){
		strAppend = "<button type='button' id='salary_rule_create' onclick='salary_rule_insert()' class='btn btn-success btn-eql-wid btn-animate'>Add</button>"
		}strAppend += " <button type='button' onclick='salary_rule_clear()' class='btn btn-warning btn-animate btn-eql-wid btn-animate'>Cancel / Clear</button>"
				$('#hrms_salary_rule_btn').html(strAppend);
	}else{
		//strAppend = "<button type='button' onclick='salary_rule_update()' class='btn btn-primary btn-eql-wid btn-animate '>Update</button>"
		//if(access_for_delete != -1){
		strAppend = " <button type='button' onclick='salary_rule_delete()' class='btn btn-danger btn-eql-wid btn-animate '>Remove</button>"
		//}
		strAppend += " <button type='button' onclick='salary_rule_clear()' class='btn btn-warning btn-animate btn-eql-wid btn-animate'>Cancel / Clear</button>"
					$('#hrms_salary_rule_btn').html(strAppend);
	}
}


//salary rule table display function
function salary_rule_table_dispaly(){
	$.ajax({	
		type  : 'POST',
		url   : '/salary_rule_table_display/',
		async : false,
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		if(data){
			salary_rule_datatable_function(data)
		}else{
			salary_rule_datatable_function(data)
		}
		
	});

}

//Salary Rule data table function here
function salary_rule_datatable_function()
{
	datatable_list = []
	var title_name = 'Salary Rule'
	if(data){
		datatable_list = []
		for(var i=0;i<data.length;i++){
			list = []
			var sno = i+1
			list.push(data[i].id,sno,data[i].salary_rule_name,data[i].salary_rule_code,data[i].refitems_name);
			datatable_list.push(list);
		}
		columns = [{'title':'ID'},{'title':'No.'},{'title':'Name'},{'title':'Code'},{'title':'Rule Category'}]
		plaindatatable_btn('salary_rule_details', datatable_list, columns,0,'NEXT_TRANSFORM_HCMS_SALARY_RULE_'+currentDate(),title_name);
	}else{
		columns = [{'title':'ID'},{'title':'No.'},{'title':'Name'},{'title':'Code'},{'title':'Rule Category'}]
		plaindatatable_btn('salary_rule_details', datatable_list, columns,0,'NEXT_TRANSFORM_HCMS_SALARY_RULE_'+currentDate(),title_name);
	}
	
	return false
}

//table row click get id
$("#salary_rule_details").on("click", "tr", function() {   
	var id = $('#salary_rule_details').dataTable().fnGetData(this)[0];
	$(this).parents('table').find('tr').removeClass('active');
	$(this).addClass('active');
	//reg_table_id = id
	if (id != 'No data available'){
		salary_rule_table_row_click(id);
	}
});

//salary rule table row click function
function salary_rule_table_row_click(el){
	button_create_rule(0);
	$('#hr_range_criteria_add').hide();
	document.getElementById('salary_rule_range_criteria_div').style.display = "block";
	$.ajax(
			{
				type:"GET",
				url: "/salary_rule_table_row_click/",
				async: false,
				data : {'id':el},
				success: function (json_data) {
					data=JSON.parse(json_data);
						salary_rule_table_id = data[0].id;
						$('#salary_rule_name').val(data[0].salary_rule_name); 
						$('#salary_rule_code').val(data[0].salary_rule_code); 
						$('#salary_rule_category').val(data[0].salary_rule_category_id_id).trigger('change');
						var val_range_criteria = ''
							for (i=0;i<data.length;i++){
								if(data[i].salary_rule_value_assignment){
									if(data[i].contributor == 1){
										contributor_value = " (Employee) "
									}else if(data[i].contributor == 2){
										contributor_value = " (Employer) "
									}else{
										contributor_value = ''
									}
									assignment_value = data[i].salary_rule_name + " = "+data[i].salary_rule_value_assignment + contributor_value + "\n"
								}else{
									assignment_value = ''
								}
								val_range_criteria = val_range_criteria + "IF "+data[i].salary_rule_validation + "\n" + assignment_value
							}
							$('#salary_rule_range_criteria').val(val_range_criteria)
				}
			});
	return false;
}


//salary rule validation criteria model show function
$('input[type=radio][name=hr_salary_rule_valid]').change(function() {
	if (this.value == 'Yes') {
		$("#validation_criteria_model").modal('show');
		$('#salary_rule_component').val(0).trigger('change');
	}
	else if (this.value == 'No') {
		$("#validation_criteria_model").modal('hide')
		document.getElementById('salary_rule_expressions_div').style.display = "none";
		document.getElementById('hr_vaidation_criteria_view').style.display = "none";
	}
});


$("#computation_amount_type").change(function (){
	//var salary_rule_calc_type = $("#computation_amount_type option:selected").text();
	var salary_rule_calc_type = $("#computation_amount_type option:selected").attr("data-code");
	if(salary_rule_calc_type == "NUMBR"){
		document.getElementById('salary_component_div').style.display = "none";
		document.getElementById('salary_rule_value_div').style.display = "block";
		$("#percentage_div").hide()
		$("#value_criteria_model").modal('hide')
		document.getElementById('cal_salary_rule_expressions_div').style.display = "none";
		document.getElementById('value_ass_criteria_view').style.display = "none";
	}else if(salary_rule_calc_type == "PERCT"){
		document.getElementById('salary_component_div').style.display = "block";
		document.getElementById('salary_rule_value_div').style.display = "block";
		document.getElementById('percentage_div').style.display = "block";
	}else if(salary_rule_calc_type == "CALVA"){
		document.getElementById('salary_component_div').style.display = "none";
		document.getElementById('salary_rule_value_div').style.display = "none";
		$("#percentage_div").hide()
		$("#value_criteria_model").modal('show')
		//$("#comparator_div").hide()
	}else{
		document.getElementById('salary_rule_value_div').style.display = "none";
		document.getElementById('percentage_div').style.display = "none";
		document.getElementById('salary_component_div').style.display = "none";
		$("#value_criteria_model").modal('hide')
	}
});


//Validation function start

$(".validation_btn").click(function(e) {
	e.preventDefault()
	btn_value = $(this).val()
	btn_value = ' ' + btn_value
	validation_value = validation_value + btn_value
	validation_criteria()
});
function validation_criteria(){
document.getElementById('salary_rule_validation_exp').value = validation_value
return false
}

//On click Validation Cancel Button
$('#validation_criteria_create').click(function(){
	salary_compontent = $('#salary_rule_component').find(":selected").text()
	if(salary_compontent != 0 && salary_compontent != '--Select Salary Component--'){
		salary_compontent = $('#salary_rule_component').find(":selected").text()
		salary_compontent = ' ' + salary_compontent
		validation_value = validation_value + salary_compontent
	}else{
		salary_compontent = ''
	}
	val_num = document.getElementById('salary_rule_number').value
	if(val_num != ''){
		val_num = ' ' + val_num
		validation_value = validation_value + val_num
	}else{
		val_num = ''
	}
	validation_criteria()
	validation_criteria_clear();
	return false
});

//For One by One  Clear Functionality Button  Click For Validation

$('#validation_criteria_clear').click(function(e){
	e.preventDefault()
	validation_criteria_clear();
	validation_clearfunct();
	validation_value = document.getElementById('salary_rule_validation_exp').value;
	return false
});

function validation_criteria_clear(){
	$("#salary_rule_component").val(0).trigger('change');
	$("#salary_rule_number").val('');
	return false;
}

//For Clear the TextBox Value By One by one Validation
function validation_clearfunct(){
	var exp_val = document.getElementById('salary_rule_validation_exp').value;
	document.getElementById('salary_rule_validation_exp').value = exp_val.substring(0,exp_val.length - 1);
}

$('#salary_rule_component').on("change",function() {
	$("#salary_rule_number").val('');
});

$('#hr_validation_criteria_select').click(function(){
	validation_criteria_clear();
	Validation_criteria = document.getElementById('salary_rule_validation_exp').value
	if(Validation_criteria != ''){
		document.getElementById('vaidation_criteria_view').style.display = "block";
		document.getElementById('salary_rule_expressions_div').style.display = "block";
		document.getElementById('salary_rule_expressions').value = Validation_criteria
		$("#validation_criteria_model").modal('hide')
	}else{
		document.getElementById('salary_rule_expressions_div').style.display = "none";
		document.getElementById('vaidation_criteria_view').style.display = "none";
	}

})



//Salary rule form validation here
function salary_rule_form_validation()
{
	return $('#salary_rule_form').valid();
}

//Range Criteria Add Functionality
	
$('#hr_range_criteria_add').click(function(){
	res = salary_rule_form_validation(); //form validation function call
	if(res){
		button_create_rule(1);
			//For Replacing the Code Assignment,Validation
		//salary_rule_condition_list = []
			var mapObj = {
					"Fixed Basic":"BASIC",
					"Fixed Gross":"GROSS",
					"Net Salary":"NETTT",
					"Monthly CTC":"MNCTC",
					"Earned CTC":"ENCTC",
					"LOP":"LOSOP",
					"Earned Basic":"ENBSC"
				};
				
				var salary_rule_value_assignment = ''
				var salary_rule_value_assignment_code = ''
				var salary_rule_calculation_type_id_id = ''
				var salary_rule_validation = ''
				var salary_rule_validation_code = ''
				var contribution_id_id = null	
				
			var exp_codevalue = document.getElementById('salary_rule_expressions').value
			exp_codevalue_result = exp_codevalue.replace(/Fixed Basic|Fixed Gross|Net Salary|Monthly CTC|Earned CTC|LOP|Earned Basic/gi, function(matched){
				return mapObj[matched];
			});
			
			var exp_codevalue_ass = document.getElementById('cal_salary_rule_expressions').value
			exp_codevalue_ass_result = exp_codevalue_ass.replace(/Fixed Basic|Gross|Net Salary|Monthly CTC|Earned CTC|LOP|Earned Basic/gi, function(matched){
				return mapObj[matched];
			});
			salary_rule_validation = document.getElementById('salary_rule_expressions').value
			salary_rule_validation_code = exp_codevalue_result
			console.log("salary_rule_validation",salary_rule_validation)
			console.log("salary_rule_validation_code",salary_rule_validation_code)
			
			//For Checking the Assignment Value and assign the values
			//calculation_type_val = $("#computation_amount_type option:selected").text()
			var calculation_type_val = $("#computation_amount_type option:selected").attr("data-code");
			calculation_type_id_id = $("#computation_amount_type option:selected").val()
			if(calculation_type_val != "--Select Calculation Type--" &&  calculation_type_id_id != 0 &&  calculation_type_id_id != undefined){
				//if(calculation_type_id_id && calculation_type_id_id != '0'){
			contribution_id_id = null
			var contribute_val = document.getElementById('hr_salary_rule_contribution_reg').checked
			console.log("contribute_val",calculation_type_val)
				if (calculation_type_val == 'NUMBR'){//Value
					salary_rule_calculation_type_id_id = calculation_type_id_id
					salary_rule_value_assignment_code = $('#computation_quantity').val()
					salary_rule_value_assignment = $('#computation_quantity').val()
				}else if(calculation_type_val == 'CALVA')//Calculated Value
				{
					salary_rule_calculation_type_id_id = calculation_type_id_id
					salary_rule_value_assignment_code = exp_codevalue_ass_result
					salary_rule_value_assignment = document.getElementById('cal_salary_rule_expressions').value
				}
				else{//Percentage
					cal_salary_rule_id = $('#cal_salary_rule_component option:selected').attr("data-code");
					var percentage_code = $('#computation_quantity').val()+" % "+cal_salary_rule_id
					cal_salary_rule_value = $("#cal_salary_rule_component option:selected").text();
					var percentage_value = $('#computation_quantity').val()+" % "+cal_salary_rule_value
					salary_rule_calculation_type_id_id = calculation_type_id_id
					salary_rule_value_assignment_code = percentage_code
					salary_rule_value_assignment = percentage_value
				}
			if(contribute_val == false){
				salary_rule_condition_list.push({'salary_rule_validation':salary_rule_validation,'salary_rule_validation_code':salary_rule_validation_code,
					'salary_rule_calculation_type_id_id':salary_rule_calculation_type_id_id,'salary_rule_value_assignment_code':salary_rule_value_assignment_code,
					'salary_rule_value_assignment':salary_rule_value_assignment,'contribution_id_id':contribution_id_id,'is_active':true})
			}
			}
			
			else if(document.getElementById('hr_salary_rule_contribution_reg').checked == false &&  calculation_type_id_id == '0'){
				salary_rule_calculation_type_id_id = null
				salary_rule_value_assignment_code = ''
				salary_rule_value_assignment = ''
					contribution_id_id = null	
				salary_rule_condition_list.push({'salary_rule_validation':salary_rule_validation,'salary_rule_validation_code':salary_rule_validation_code,
					'salary_rule_calculation_type_id_id':salary_rule_calculation_type_id_id,'salary_rule_value_assignment_code':salary_rule_value_assignment_code,
					'salary_rule_value_assignment':salary_rule_value_assignment,'contribution_id_id':contribution_id_id,'is_active':true})	
			}
			 //Contribution register List
			 var contribution_register_id_list = [];
			 $.each($("#contribution_id option:selected"), function(){     
				 contribution_register_id_list.push($(this).val());
		     });
			if(contribution_register_id_list){
				//salary_rule_condition_list = []
			$.ajax({
				type:"POST",
				url:'/salary_rule_contribution_reg/',
				data:{"contribute_id":JSON.stringify(contribution_register_id_list),csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()},
				async:false,	
			}).done(function(json_data){
				var data=JSON.parse(json_data);
				salary_rule_calculation_type_id_id = null
				for(i=0;i<data.length;i++){
					for(j=0;j<data[i].length;j++){
						if (calculation_type_val != 'NUMBR'){
						salary_rule_value_assignment = data[i][j].contribution+" % "+data[i][j].refitems_name
						salary_rule_value_assignment_code = salary_rule_value_assignment.replace(/Fixed Basic|Fixed Gross|Net Salary|Monthly CTC|Earned CTC|LOP|Earned Basic/gi, function(matched){
							return mapObj[matched];
						});
						}
						contribution_id_id = data[i][j].id
						salary_rule_condition_list.push({'salary_rule_validation':salary_rule_validation,'salary_rule_validation_code':salary_rule_validation_code,
							'salary_rule_calculation_type_id_id':salary_rule_calculation_type_id_id,'salary_rule_value_assignment_code':salary_rule_value_assignment_code,
							'salary_rule_value_assignment':salary_rule_value_assignment,'contribution_id_id':contribution_id_id,'is_active':true})
					}
				}
			});
			}
			 
			if(range_value != ''){
				range_value = range_value + "\nIF "
			}
			else{
				range_value = "IF "
			}
		validation_value = $('#salary_rule_expressions').val()
		range_value = range_value + validation_value + "\n"
		var calculate_component = $('#cal_salary_rule_component option:selected').val()
		if($('#cal_salary_rule_expressions').val()!=0 || $('#computation_quantity').val()!=0 || $('#cal_salary_rule_component option:selected').val()!= calculate_component){
			salry_rule_name=$('#salary_rule_name').val()
			range_value = range_value + salry_rule_name + " = "
		if($('#cal_salary_rule_expressions').val()!=0){
		assignment_value=$('#cal_salary_rule_expressions').val()
		}else if ($('#computation_quantity').val()!=0 && $('#cal_salary_rule_component').val()!=0){
			salary_compontent=$("#cal_salary_rule_component option:selected").text();
			assignment_value=$('#computation_quantity').val()+" % "+salary_compontent
		}else{
			assignment_value=$('#computation_quantity').val()
		}
		}else if(contribution_register_id_list){
			salry_rule_name=$('#salary_rule_name').val()
			range_value = range_value + salry_rule_name +" = "
			$.ajax({
				type:"POST",
				url:'/salary_rule_contribution_reg/',
				data:{"contribute_id":JSON.stringify(contribution_register_id_list),csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()},
				async:false,	
			}).done(function(json_data){
				var data=JSON.parse(json_data);
				assignment_value = ''
				for(i=0;i<data.length;i++){
					for(j=0;j<data[i].length;j++){
						if(data[i][j].contributor == "1"){
							contributor_name = 'Employee'
						}else if(data[i][j].contributor == "2"){
							contributor_name='Employer'
						}
						assignment_value += data[i][j].contribution+" % "+data[i][j].refitems_name+ "(" + contributor_name + ")"
					}
					if(i!=(data.length-1) && assignment_value!=''){
						assignment_value += " + "
					}
				}
			});
		}else{
			assignment_value = ''
		}
		range_value = range_value + assignment_value
		document.getElementById('salary_rule_range_criteria').value = range_value
		range_value = document.getElementById('salary_rule_range_criteria').value;
		document.getElementById('salary_rule_range_criteria_div').style.display = "block";
		range_clear();
		
		
}
	return false
});

$('#hr_vaidation_criteria_view').click(function(){
	$("#validation_criteria_model").modal('show');
	exp_value=document.getElementById('salary_rule_expressions').value
	validation_value=exp_value;
	document.getElementById('salary_rule_validation_exp').value=exp_value
	return false
})

function range_clear(){
	$('#salary_rule_expressions').val('');
	$('#cal_salary_rule_expressions').val('');
	$('#computation_quantity').val('');
	$('#cal_salary_rule_component').val(0).trigger('change');
	document.getElementById("hr_salary_rule_yes").checked = false
	document.getElementById("hr_salary_rule_no").checked = false
	document.getElementById('salary_rule_expressions_div').style.display = "none";
	document.getElementById('hr_vaidation_criteria_view').style.display = "none";
	document.getElementById('cal_salary_rule_expressions_div').style.display = "none";
	document.getElementById('value_ass_criteria_view').style.display = "none";
	document.getElementById('salary_rule_value_div').style.display = "none";
	document.getElementById('percentage_div').style.display = "none";
	document.getElementById('salary_component_div').style.display = "none";
	$('#computation_amount_type').val(0).trigger('change');
	$("#salary_rule_validation_exp").val('')
	$("#value_ass_salary_rule_exp").val('')
	validation_value=''
	value_ass_value=''
}

//Value Assignment Functionality Start

//Click View Button Functionality

$('#value_ass_criteria_view').click(function(){
	$("#value_criteria_model").modal('show');
	ass_exp_value=document.getElementById('cal_salary_rule_expressions').value
	document.getElementById('value_ass_salary_rule_exp').value=ass_exp_value
	return false
})

var value_ass_value=''
	$(".value_ass_btn").click(function(e) {
		e.preventDefault()
		ass_btn_value=$(this).val()
		ass_btn_value=' '+ass_btn_value
		value_ass_value=value_ass_value+ass_btn_value
		value_ass_criteria()
	});

function value_ass_criteria(){
	document.getElementById('value_ass_salary_rule_exp').value=value_ass_value
}
$('#value_ass_salary_rule_component').on("change",function() {
	$("#value_ass_salary_rule_validation_value").val('');
});

//On click Value Assignment Add Button

$('#value_ass_criteria_create').click(function(){
	value_salary_compontent=$('#value_ass_salary_rule_component').find(":selected").text()
	if(value_salary_compontent!=0 && value_salary_compontent!='--Select Salary Component--'){
		value_salary_compontent=$('#value_ass_salary_rule_component').find(":selected").text()
		value_salary_compontent=' '+value_salary_compontent
		value_ass_value=value_ass_value+value_salary_compontent
	}else{
		value_salary_compontent=''
	}
	val_ass_num=document.getElementById('value_ass_salary_rule_validation_value').value
	if(val_ass_num!=''){
		val_ass_num=' '+val_ass_num
		value_ass_value=value_ass_value+val_ass_num
	}else{
		val_ass_num=''
	}
	value_ass_criteria()
	value_ass_criteria_clear();
	return false
});

//For One by One  Clear Functionality Button  Click
$('#value_ass_criteria_clear').click(function(e){
	e.preventDefault()
	value_ass_criteria_clear();
	value_ass_clearfunct();
	value_ass_value=document.getElementById('value_ass_salary_rule_exp').value;
	return false
});

//For Clear the TextBox Value By One by one Value Assignment
function value_ass_clearfunct ()
{
	var ass_exp_val = document.getElementById('value_ass_salary_rule_exp').value;
	document.getElementById('value_ass_salary_rule_exp').value = ass_exp_val.substring(0,ass_exp_val.length - 1);
}

function value_ass_criteria_clear(){
	$("#value_ass_salary_rule_component").val(0).trigger('change');
	$("#value_ass_salary_rule_validation_value").val('');
	return false;
}

//For Click the Selection Button  Value Assignment

$('#hr_value_criteria_select').click(function(){
	value_ass_criteria_clear();
	Value_ass_criteria=document.getElementById('value_ass_salary_rule_exp').value
	if(Value_ass_criteria!=''){
		document.getElementById('cal_salary_rule_expressions_div').style.display = "block";
		document.getElementById('value_ass_criteria_view').style.display = "block";
		document.getElementById('cal_salary_rule_expressions').value=Value_ass_criteria
		$("#value_criteria_model").modal('hide')
	}else{
		document.getElementById('cal_salary_rule_expressions_div').style.display = "none";
		document.getElementById('value_ass_criteria_view').style.display = "none";
	}

})

$.validator.addMethod("alpha", function(value, element) {
    return this.optional(element) || value == value.match(/^[a-zA-Z\s]+$/);
});

$('#salary_rule_form').submit(function(e) {
    e.preventDefault();    
}).validate({
   rules: {
	   salary_rule_name: {
		   required: true,
		   maxlength: 50,	
		   alpha: true,
	   },
	   salary_rule_code: {
		 //  alpha:true,
		   required:true,
		   maxlength:5,
		   minlength:5,
	   },	  	   
	   salary_rule_category: {
		   required: true,
		   valueNotEquals:true, 
	   },	  
	   /*computation_amount_type: {
		   required: true,
		   valueNotEquals:true, 
	   },*/
   },
   //For custom messages
   messages: {
	   salary_rule_name: {
           required: "Enter salary rule name",
           maxlength: "Name cannot exceed 50 characters",
           alpha: "Name cannot have numbers",
       },       
       salary_rule_code: {
    	   required: "Enter salary rule code", 
    	 //  alpha: "Code cannot have numbers",
    	   maxlength: "Salary rule code cannot exceed 5 digits",
    	   minlength: "Salary rule code cannot lesser than 5 digits",    	  
	   },	   
	   salary_rule_category: {
		   required: "Select Salary Rule Category",
		   valueNotEquals: "Select Salary Rule Category", 
	   },
	   /*computation_amount_type: {
		   required: "Select Calculation Type",
		   valueNotEquals: "Select Calculation Type", 
	   },*/	
	   
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


jQuery.validator.addMethod('valueNotEquals', function (value) {
	return (value != '0');
}, "");

function salary_rule_insert(){
	code=$('#salary_rule_code').val()
	if(code){
		$.ajax({
			type:"POST",
			url:'/salary_rule_code_selection/',
			data:{"code":code},
			async:false,	
		}).done(function(json_data){
			data=JSON.parse(json_data);
			if(data['status']==1){
				alert_lobibox("error","Salary Rule Code Already Exist")
			}else{
				salary_rule_creation();//For salary rule Create button Functioanlity
			}
		});
	}else{
		return false
	}
}

		


//salary rule create function
function salary_rule_creation(){
	var salary_rule_form_value = getFormValues("#salary_rule_form");
	var csrf_data = salary_rule_form_value.csrfmiddlewaretoken;
    delete salary_rule_form_value["csrfmiddlewaretoken"];
    salary_rule_form_value['is_active'] = "True";
    
    salary_rule_form_value['salary_rule_name'] = salary_rule_form_value['salary_rule_name'];
    salary_rule_form_value['salary_rule_code'] = salary_rule_form_value['salary_rule_code'];
    salary_rule_form_value['salary_rule_category'] = validationFields(salary_rule_form_value['salary_rule_category']);
    salary_rule_list = [];
    salary_rule_dict = {};
    salary_rule_list.push(salary_rule_form_value);
    salary_rule_dict['salary_rule_data'] = salary_rule_list;
    if(salary_rule_condition_list!=''){
		salary_rule_condition_list=salary_rule_condition_list
	}else{
		salary_rule_condition=salary_rule_create();
		salary_rule_condition_list=salary_rule_condition
	}
    salary_rule_dict["hr_salary_rule_conditions"] = salary_rule_condition_list
			$.ajax({	
		         type  : 'POST',
		         url   : '/hrms_salary_rule_create/',
		         async : false,
		         data: {
		              'datas': JSON.stringify(salary_rule_dict),
		              "table_id": salary_rule_table_id,
		              csrfmiddlewaretoken: csrf_data,
		         },/*,
		         error:(function(error){
		 			if(~error.responseText.indexOf("already exists")){
		 				alert_lobibox("error","Salary Rule Code Already Exist")
		 			}*/
		 	
		     }).done( function(json_data) {
		    	 data = JSON.parse(json_data);
			 	 var res_status = data['status'];
			 	 if(res_status == 'NTE_01') {	
			 		alert_lobibox("success", sysparam_datas_list[res_status]);
			 		salary_rule_condition_list = []
			 		button_create_rule(1)
			 		salary_code_auto_generate();
			 		salary_rule_table_dispaly()
			 		salary_rule_clear()
			 		range_value = ''
					range_clear();//For Range Criteria Clear Functionality
					$('#salary_rule_range_criteria').val('')
					document.getElementById('salary_rule_range_criteria_div').style.display = "none";
					payroll_log_activity();
			 	 } else {
			 		alert_lobibox("error",sysparam_datas_list['ERR0040'])
			 	 }
		     });
}

//delete function
function salary_rule_delete(){
	//var salary_rule_title = $('#salary_rule_name').val();
	//removeConfirmation('salary_rule_details_delete_function','',salary_rule_title);
	$.ajax({	
		type  : 'POST',
		url   : '/hrms_salary_rule_delete_check/',
		async : false,
		data: {
			"delete_id": salary_rule_table_id,
			csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val(),
		},
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		var res_status = data['exist'];
		if(res_status == 'exist') {	
			var salary_rule_title = $('#salary_rule_name').val();
			//removeConfirmation('salary_rule_details_delete_function','','Record already referred');
			alert_lobibox("success","Record already mapped in Salary Structure,delete it in salary structure,before deleting in Salary Rule");
			button_create_rule(1)
			payroll_log_activity();
			//salary_code_auto_generate();
			//salary_rule_clear();
			//salary_rule_table_dispaly();	
		}
		else {
			var salary_rule_title = $('#salary_rule_name').val();
			removeConfirmation('salary_rule_details_delete_function','',salary_rule_title);
		}
	});
}

//delete function
function salary_rule_details_delete_function(){
	$.ajax({	
		type  : 'POST',
		url   : '/hrms_salary_rule_create/',
		async : false,
		data: {
			"delete_id": salary_rule_table_id,
			csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val(),
		},
	}).done( function(json_data) {
		data = JSON.parse(json_data);
		var res_status = data['status'];
		if(res_status == 'NTE_04') {	
			alert_lobibox("success", sysparam_datas_list[res_status]);
			button_create_rule(1)
			//salary_code_auto_generate();
			salary_rule_clear();
			salary_rule_table_dispaly();	
		}
		else {
			alert_lobibox("error",sysparam_datas_list['ERR0028'])
		}
	});
}

//validation for the empty
function validationFields(val){
	return val=='' || val =='0' ?null:val 
}

function salary_rule_create(){
	//For Checking the Assignment Value and assign the values
		salary_rule_condition_list=[]
		var mapObj_rule = {
				"Fixed Basic":"BASIC",
				"Fixed Gross":"GROSS",
				"Net Salary":"NETTT",
				"Monthly CTC":"MNCTC",
				"Earned CTC":"ENCTC",
				"LOP":"LOSOP",
				"Earned Basic":"ENBSC"
			};
		
		
		var salary_rule_value_assignment=''
		var salary_rule_value_assignment_code=''
		var salary_rule_calculation_type_id_id=''
		var salary_rule_validation=''
		var salary_rule_validation_code=''
		var contribution_id_id=null	
		
		var exp_codevalue_ass=document.getElementById('cal_salary_rule_expressions').value
		exp_codevalue_ass_result = exp_codevalue_ass.replace(/Fixed Basic|Fixed Gross|Net Salary|Monthly CTC|Earned CTC|LOP|Earned Basic/gi, function(matched){
			return mapObj_rule[matched];
		});
		var exp_codevalue=document.getElementById('salary_rule_expressions').value
		exp_codevalue_result = exp_codevalue.replace(/Fixed Basic|Fixed Gross|Net Salary|Monthly CTC|Earned CTC|LOP|Earned Basic/gi, function(matched){
			return mapObj_rule[matched];
		});
			
		//calculation_type_val = $("#computation_amount_type option:selected").text()
		var calculation_type_val = $("#computation_amount_type option:selected").attr("data-code");
		calculation_type_id_id = $("#computation_amount_type option:selected").val()
		
		if(calculation_type_id_id != '0'){
			contribution_id_id=''
			if (calculation_type_val == 'NUMBR'){//Value
				salary_rule_calculation_type_id_id=calculation_type_id_id
				salary_rule_value_assignment_code=$('#computation_quantity').val()
				salary_rule_value_assignment=$('#computation_quantity').val()
			}else if(calculation_type_val == 'CALVA')//Calculated Value
			{
				salary_rule_calculation_type_id_id=calculation_type_id_id
				salary_rule_value_assignment_code=exp_codevalue_ass_result
				salary_rule_value_assignment=document.getElementById('cal_salary_rule_expressions').value
			}
			else{//Percentage
				cal_salary_rule_id=$('#cal_salary_rule_component option:selected').attr("data-code");
				var percentage_code=$('#computation_quantity').val()+" % "+cal_salary_rule_id
				cal_salary_rule_value=$("#cal_salary_rule_component option:selected").text();
				var percentage_value=$('#computation_quantity').val()+" % "+cal_salary_rule_value
				salary_rule_calculation_type_id_id=calculation_type_id_id
				salary_rule_value_assignment_code=percentage_code
				salary_rule_value_assignment=percentage_value
			}
			
		}
		
		//Contribution register List
		 var contribution_register_id_list = [];
		 $.each($("#contribution_id option:selected"), function(){     
			 contribution_register_id_list.push($(this).val());
	    });
		//For Replacing the Code Assignment,Validation
		if(document.getElementById('salary_rule_expressions').value!='' && salary_rule_value_assignment==''&&salary_rule_value_assignment_code=='' && contribution_register_id_list==''){
			salary_rule_validation=''
		salary_rule_validation_code=''
		salary_rule_calculation_type_id_id=null
		salary_rule_value_assignment=document.getElementById('salary_rule_expressions').value
		salary_rule_value_assignment_code = exp_codevalue_result
		contribution_id_id=null
		salary_rule_condition_list.push({'salary_rule_validation':salary_rule_validation,'salary_rule_validation_code':salary_rule_validation_code,
			'salary_rule_calculation_type_id_id':salary_rule_calculation_type_id_id,'salary_rule_value_assignment_code':salary_rule_value_assignment_code,
			'salary_rule_value_assignment':salary_rule_value_assignment,'contribution_id_id':contribution_id_id,'is_active':true})	
		}else if(document.getElementById('salary_rule_expressions').value !='' && salary_rule_value_assignment!='' && salary_rule_value_assignment_code!=''&& contribution_register_id_list=='' ){
				salary_rule_validation=document.getElementById('salary_rule_expressions').value
				salary_rule_validation_code=exp_codevalue_result
				salary_rule_calculation_type_id_id=salary_rule_calculation_type_id_id
				salary_rule_value_assignment=salary_rule_value_assignment
				salary_rule_value_assignment_code = salary_rule_value_assignment_code
				contribution_id_id=null
				salary_rule_condition_list.push({'salary_rule_validation':salary_rule_validation,'salary_rule_validation_code':salary_rule_validation_code,
					'salary_rule_calculation_type_id_id':salary_rule_calculation_type_id_id,'salary_rule_value_assignment_code':salary_rule_value_assignment_code,
					'salary_rule_value_assignment':salary_rule_value_assignment,'contribution_id_id':contribution_id_id,'is_active':true})	
		}else if(document.getElementById('salary_rule_expressions').value =='' && salary_rule_value_assignment!='' && salary_rule_value_assignment_code!='' && contribution_register_id_list==''){
			salary_rule_validation=''
			salary_rule_validation_code=''
			salary_rule_calculation_type_id_id=salary_rule_calculation_type_id_id
			salary_rule_value_assignment=salary_rule_value_assignment
			salary_rule_value_assignment_code = salary_rule_value_assignment_code
			contribution_id_id=null
			salary_rule_condition_list.push({'salary_rule_validation':salary_rule_validation,'salary_rule_validation_code':salary_rule_validation_code,
				'salary_rule_calculation_type_id_id':salary_rule_calculation_type_id_id,'salary_rule_value_assignment_code':salary_rule_value_assignment_code,
				'salary_rule_value_assignment':salary_rule_value_assignment,'contribution_id_id':contribution_id_id,'is_active':true})	
			
		}else if(document.getElementById('salary_rule_expressions').value !='' && salary_rule_value_assignment=='' && salary_rule_value_assignment_code=='' && contribution_register_id_list!=''){
			if(contribution_register_id_list){
				salary_rule_validation=document.getElementById('salary_rule_expressions').value
				salary_rule_validation_code = exp_codevalue_result
				$.ajax({
					type:"POST",
					url:'/salary_rule_contribution_reg/',
					data:{"contribute_id":JSON.stringify(contribution_register_id_list),csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()},
					async:false,	
				}).done(function(json_data){
					var data=JSON.parse(json_data);
					salary_rule_calculation_type_id_id=null
					for(i=0;i<data.length;i++){
						for(j=0;j<data[i].length;j++){
							salary_rule_value_assignment=data[i][j].contribution+" % "+data[i][j].refitems_name
							salary_rule_value_assignment_code = salary_rule_value_assignment.replace(/Fixed Basic|Fixed Gross|Net Salary|Monthly CTC|Earned CTC|LOP|Earned Basic/gi, function(matched){
								return mapObj_rule[matched];
							});
							contribution_id_id=data[i][j].id
							salary_rule_condition_list.push({'salary_rule_validation':salary_rule_validation,'salary_rule_validation_code':salary_rule_validation_code,
								'salary_rule_calculation_type_id_id':salary_rule_calculation_type_id_id,'salary_rule_value_assignment_code':salary_rule_value_assignment_code,
								'salary_rule_value_assignment':salary_rule_value_assignment,'contribution_id_id':contribution_id_id,'is_active':true})
						}
					}
				});
				}	
		}else if(document.getElementById('salary_rule_expressions').value =='' && salary_rule_value_assignment=='' && salary_rule_value_assignment_code=='' && contribution_register_id_list!=''){
			if(contribution_register_id_list){
				$.ajax({
					type:"POST",
					url:'/salary_rule_contribution_reg/',
					data:{"contribute_id":JSON.stringify(contribution_register_id_list),csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()},
					async:false,	
				}).done(function(json_data){
					var data=JSON.parse(json_data);
					salary_rule_calculation_type_id_id=null
					for(i=0;i<data.length;i++){
						for(j=0;j<data[i].length;j++){
							salary_rule_value_assignment=data[i][j].contribution+" % "+data[i][j].refitems_name
							salary_rule_value_assignment_code = salary_rule_value_assignment.replace(/Fixed Basic|Fixed Gross|Net Salary|Monthly CTC|Earned CTC|LOP|Earned Basic/gi, function(matched){
								return mapObj_rule[matched];
							});
							contribution_id_id=data[i][j].id
							salary_rule_condition_list.push({'salary_rule_validation':salary_rule_validation,'salary_rule_validation_code':salary_rule_validation_code,
								'salary_rule_calculation_type_id_id':salary_rule_calculation_type_id_id,'salary_rule_value_assignment_code':salary_rule_value_assignment_code,
								'salary_rule_value_assignment':salary_rule_value_assignment,'contribution_id_id':contribution_id_id,'is_active':true})
						}
					}
				});
				}	
		}else{
			salary_rule_calculation_type_id_id=null
			salary_rule_value_assignment_code=''
			salary_rule_value_assignment=''
			contribution_id_id=null	
			salary_rule_validation=''
			salary_rule_validation_code=''
			salary_rule_condition_list.push({'salary_rule_validation':salary_rule_validation,'salary_rule_validation_code':salary_rule_validation_code,
				'salary_rule_calculation_type_id_id':salary_rule_calculation_type_id_id,'salary_rule_value_assignment_code':salary_rule_value_assignment_code,
				'salary_rule_value_assignment':salary_rule_value_assignment,'contribution_id_id':contribution_id_id,'is_active':true})	
		}
		 return salary_rule_condition_list
	}

$("#salary_rule_category").change(function(){
	$("#salary_category_clear").html('')
});

$("#computation_amount_type").change(function(){
	$(".errormessage").html('')
});

//form clear function
function salary_rule_clear(){
	salary_rule_condition_list=[]
	range_clear();
	salary_field_clear();
	$('#hr_range_criteria_add').show();
	$('#salary_rule_range_criteria_div').hide();
}

function salary_field_clear(){
	button_create_rule(1)
	salary_rule_table_id = 0
	//$('.salarys').val(0);
	$('.salary').val('');
	$('.errormessage').html('');
	$('#salary_rule_category').val(0).trigger('change');
	$('#computation_amount_type').val(0).trigger('change');
	$('#hr_salary_rule_yes').attr('checked',false);
	$('#hr_salary_rule_no').attr('checked',false);
	$("#hr_salary_rule_contribution_reg").prop("checked", false);
	document.getElementById('contribution_register_div').style.display = "none";
	$("#contribution_id").val([]).trigger('change');
	range_value = ''
}

$('#salary_rule_code').keyup(function(){
    $(this).val($(this).val().toUpperCase());
});

$('#salary_rule_name').keyup(function(){
    $(this).val($(this).val().charAt(0).toUpperCase() + $(this).val().slice(1));
});

function salary_code_auto_generate() {
	$.ajax(
			{
				type:"GET",
				url: "/salary_rule_code_generate/",
				async: false,
			}).done(function(json_data) {
				var salary_rule_code = JSON.parse(json_data);
				if (salary_rule_code){
					$("#salary_rule_code").val(salary_rule_code.reg_code)
				}
			});
}

