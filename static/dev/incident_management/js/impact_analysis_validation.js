$('.filterme').keypress(function(eve) {
	$('.errormessage').html("")
	  if ((eve.which != 46 || $(this).val().indexOf('.') != -1) && (eve.which < 48 || eve.which > 57) || (eve.which == 46 && $(this).caret().start == 0)) {
		  $($(this)["0"].nextSibling.nextSibling).append("<div class='error'>This Field Should be in float</div>")
	    eve.preventDefault();
	  }
	  // this part is when left part of number is deleted and leaves a . in the leftmost position. For example, 33.25, then 33 is deleted
	  $('.filterme').keyup(function(eve) {
	    if ($(this).val().indexOf('.') == 0) {
	      $(this).val($(this).val().substring(1));
	    }
	  });
});

$('.filterinteger').keypress(function(eve) {
	$('.errormessage').html("")
	  if ((eve.which < 48 || eve.which > 57) && eve.which >31) {
		  $($(this)["0"].nextSibling.nextSibling).append("<div class='error'>This Field Should be in Integer</div>")
	    eve.preventDefault();
	  }
});