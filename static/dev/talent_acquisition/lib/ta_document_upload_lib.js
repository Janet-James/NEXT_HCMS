//-------------------Attachment upload 23-02-2018 function start-----------------------//
var doc_id = 0;
//image validation
function docValidate(id) {
		var ext = $('input[type=file][id$="'+id+'"]').val().replace(/C:\\fakepath\\/i, '').split('.')[1].toString().toLowerCase();
		var file_name = $('input[type=file][id$="'+id+'"]').val().replace(/C:\\fakepath\\/i, '').split('.')[0].toString().toLowerCase();
	    if($.inArray(ext, ['doc','docx','pdf']) == -1) {
	    	alert_lobibox("error", "Invalid document extension. Please upload a document in .doc, .docx or .pdf");
	    	$('#'+id).val(''); //file clearing
	        return false
	    }else{
	    	var file_status = 0;
	    	if((file_name.length >= 1) && (file_name.length <= 25)){
	    		file_status = 1;
	    	}else{
	    		alert_lobibox("error", "Document name should be Maximum 25 Characters. eg:example.pdf");
	    		$('#'+id).val(''); //file clearing
	    		file_status = 0;
	    	}
	    	return file_status == 1 ? true : false; 
	    }
}

var doc_data = {}
//image encode function here
function encodeDoctoBase64(element) {
	if(element){
	        var FileSize = element.files[0].size / 1024 / 1024; // in MB
	        if (FileSize > 2) {
	            alert_lobibox("error", "File size exceeds 2 MB. Please upload a valid document.");
	            $("#"+element.id).val(''); //file clearing
	        } else {
	        	if(docValidate(element.id)){
	        		if($('input[type=file][id$="'+element.id+'"]').val().replace(/C:\\fakepath\\/i, '')){
	        			doc_data = {}
	        			doc_data['img_name'] = $('input[type=file][id$="'+element.id+'"]').val().replace(/C:\\fakepath\\/i, '')
	        			doc_data['folder_name'] = document_names;
	        			var file = element.files[0];
	        			var reader = new FileReader();
	        			reader.onloadend = function() {
	        				var img_str = reader.result
	        				doc_data['img_str'] = img_str.split(',')[1]
	        				doc_data['format'] = $('input[type=file][id$="'+element.id+'"]').val().replace(/C:\\fakepath\\/i, '').split('.')[1];
	        			}
	        			reader.readAsDataURL(file);
	        		}
	        	}else{
	        		doc_data = {};
//	        		$('.fileinput-exists').trigger('click'); 
	        	}
	        }
	}else{
		alert_lobibox("info", "File upload error.");
	}
}

//attachment save in server
function saveDocAttachment(){
	val = 0;
	if(doc_data['img_str']){
		$.ajax({
			url : "/hrms_attachment/",
			type : "POST",
			data : doc_data,
			timeout : 10000,
			async:false,
		}).done( function(json_data) {
			data = JSON.parse(json_data);
			if(data['id'] != 0){
				val = data['id'];
				val_status = 1;
				doc_data = {}
			}else{
				alert_lobibox("error",sysparam_datas_list['ERR0041']);
				val = 0;
			}
		});
	}else{
		val = 0;
	}
	return val

}
//attachment update in server
function updateDocAttachment(){
	val = doc_id;
	if(doc_data['img_str'] && doc_id != 0){
		doc_data['attachment_id'] = doc_id;
		$.ajax({
			url : "/hrms_attachment/",
			type : "POST",
			data : doc_data,
			timeout : 10000,
			async:false,
		}).done( function(json_data) {
			data = JSON.parse(json_data);
			if(data['id'] != 0){
				doc_data = {}
				val = data['id'];
//			    $('.fileinput-preview').html("<img src='/static/ui/images/avatar.png' alt='Imgae' />").trigger('click');
			}else{
				alert_lobibox("error", sysparam_datas_list['ERR0041']);
				val = doc_id;
			}
		});
	}else{
		val = doc_id;
	}
	return val
}

//-------------------Attachment upload function end-----------------------//
