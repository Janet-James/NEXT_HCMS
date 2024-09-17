//tab click id
$(".nav-pills li>a").click(function() {
	tabShowStatus(this.id)
});

//tab show condition
function tabShowStatus(tabId){	
	if(tabId == 'tab2'){
		$("#relieving").DateTimePicker({
			dateFormat: "dd-MM-yyyy",
			minDate: new Date(),
		});
	}else{
		$("#hrrelieving").DateTimePicker({
			dateFormat: "dd-MM-yyyy",
			minDate: new Date(),
		});
	}
	$('.tab-pane,.tab_item_menu,.tab_item').removeClass('active activetab');
	$('#ex-'+tabId).addClass('active');
	$('#'+tabId).addClass('active');
	$('#'+tabId).find('.tab_item').addClass('activetab');
}

//default trigger function
$('#tab1').trigger('click');

//layout body onclick
//open button click
$("#tablist").click(function(){
    $('#job-requisitions').addClass('col-md-8').removeClass('col-md-12');
    $('#job_requisitions_form').show();
});
//close button click
$("#job_requisitions_close").click(function(){
  $('#job-requisitions').addClass('col-md-12').removeClass('col-md-4');
  $('#job_requisitions_form').hide();

});