var counter = 2;

//Add row functionality
$( document ).ready(function() {
	jQuery('#rd_csf_add_new').click(rd_csf_add_new);
});

function rd_csf_add_new(){
	if(counter>10) {
		alert_lobibox("warning", sysparam_datas_list["NTE_07"]);
		return false;
	}
	var newTextBoxDiv = $(document.createElement('div')).attr("id", 'rd_csf_text_in' + counter);
	newTextBoxDiv.attr("class", 'col-md-12 margin-bottom-10')
	newTextBoxDiv.after().html('<input type="text" noSpace="true" required="required" name="rd_csf_text'+ counter +'" class="form-control rd_csf_text"' + counter + '" id="rd_csf_text' + counter + '" >'+'<a href="javascript:;" class="btn btn-animate btn-icon-only btn-danger rd_csf_remove"><i class="nf nf-trash-o"></i> </a>');
	newTextBoxDiv.appendTo("#rd_csf_text_div");
	counter++;
	$("body").on("click", ".rd_csf_remove", function () {
		$(this).closest("div").remove();
	});
}