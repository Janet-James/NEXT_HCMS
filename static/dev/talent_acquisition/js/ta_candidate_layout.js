//tab click id
$("#navForwizard li>a").click(function() {
	tabShowStatusCandidate(this.id)
});

//tab show condition
function tabShowStatusCandidate(tabId){	
	$('.lo-tab-pane,.tab_item_menu,.tab_item').removeClass('lo-active activetab');
	$('#ex-'+tabId).addClass('lo-active');
	$('#'+tabId).addClass('active');
	$('#'+tabId).find('.tab_item').addClass('activetab');
}

//default trigger function
$('#tab2').trigger('click');
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