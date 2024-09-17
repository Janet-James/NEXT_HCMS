$(document).ready(function(){
	button_create_tax_form(1);
	 var i = 1;
     $("#add_row").click(function(e) {
     	e.preventDefault();
         $('#addr' + i).html("<td><textarea name='textarea_field"+i+"' value='textarea_value"+i+"' class='form-control' style='height: 64px;'></textarea></td> <td> <textarea class='form-control' style='height: 69px;'></textarea></td> <textarea class='form-control'></textarea><td class='addrow'><textarea class='form-control'></textarea></td> <td  width='15%'><textarea id='amount_limit"+i+"' class='form-control amount_limit'></textarea></td><td width='20%'><input type='text' id='amount"+i+"' class='form-control amount' onchange='onChangeamount(this)'/></td>");
         $('#tab_logic').append('<tr id="addr' + (i + 1) + '"></tr>');
         i++;
     });
     $("#add_head").click(function(e) {
     	e.preventDefault();
         $('#addhead' + i).html("<td colspan='5'><textarea class='form-control'></textarea></td> ");
         $('#tab_logic').append('<tr id="addhead' + (i + 1) + '"></tr>');
         i++;
     });
     $("#delete_row").click(function(e) {
     	e.preventDefault();
         if (i > 1) {
             $("#addr" + (i - 1)).html('');
             i--;
         }
     });
     $("#delete_head").click(function(e) {
     	e.preventDefault();
         if (i > 1) {
             $("#addhead" + (i - 1)).html('');
             i--;
         }
     });
     return false;

});

function button_create_tax_form(status){
	var access_for_create = jQuery.inArray( "Tax Declaration Form", JSON.parse(localStorage.Create) );
	var access_for_write = jQuery.inArray( "Tax Declaration Form", JSON.parse(localStorage.Write) );
	var access_for_delete = jQuery.inArray( "Tax Declaration Form", JSON.parse(localStorage.Delete) );
	if(status == 1){
		if (access_for_create != -1){
			strAppend = "<button type='button' onclick='tax_form_create()' class='btn btn-success btn-eql-wid btn-animate'>Add</button>"
		}
		strAppend += " <button type='button' onclick='tax_form_clear()' class='btn btn-warning btn-animate btn-eql-wid btn-animate'>Cancel / Clear</button>"
			$('#tax_declaration_form_btn').html(strAppend);
	}else{
		if(access_for_write != -1){
			strAppend = "<button type='button' onclick='tax_form_update()' class='btn btn-primary btn-eql-wid btn-animate '>Update</button>"
		}if (access_for_delete != -1){
			strAppend += " <button type='button' onclick='tax_form_delete()' class='btn btn-danger btn-eql-wid btn-animate '>Remove</button>"
		}
		strAppend += " <button type='button' onclick='tax_form_clear()' class='btn btn-warning btn-animate btn-eql-wid btn-animate'>Cancel / Clear</button>"
			$('#tax_declaration_form_btn').html(strAppend);
	}
}

function tax_form_create(){
	$('textarea').each(function(){
		$("textarea").attr('readonly', 'true');
		$(this).html($(this).val())
	})
	 var tax_table = $('#tab_logic').html();
     if(tax_table){
    	 $.ajax({
    			type:"POST",
    			url:'/tax_form_create/',
    			timeout : 10000,
    			data:{"tax_table_data":tax_table,csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()},
    			async:false,
    		}).done(function(json_data){
    			data = JSON.parse(json_data)
    			var res_status = data['status'];
				if(res_status == 'Added Successfully') {	
    			alert_lobibox('success',"Added Successfully");
				}
    			
    		});
    	 //location.reload();
     }
} 