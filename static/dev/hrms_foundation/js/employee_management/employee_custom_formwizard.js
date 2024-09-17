/*********************** Form Vizard Script************************/
function nextStepWizardEmployee() {
	if(employee_table_id !=0){
		$("#btn_info").html('');
		var curent_li_id = $('.stage_active').attr('id'),
			prev_li = $('#' + curent_li_id).prevAll().length,
			btn_change = $('#' + curent_li_id).nextAll().length;
		if (btn_change == 1 || btn_change == 0) {
			$("#btn_info").html('Finish');
			$("#btn_info").hide();
		} else {
			$("#btn_info").html('Next');
			$("#btn_info").show();
		}

		$('.stage_active').removeClass('stage_active');
		if (prev_li == 0) {
			$('#' + curent_li_id).css({
				'display': 'inline-block',
				'width': '20%',
				'vertical-align': 'top',
				'border-right': 'none',
				'float': 'left',
				'height': '' + window_height + 'px',
				'overflow': 'hidden',
			});
			$('#' + curent_li_id).next().addClass('stage_active').css({
				'display': 'inline-block',
				'width': '80%',
				'vertical-align': 'top',
				'border-right': 'none',
				'float': 'left',
				'border-top': '1px solid #fbc460 ',
				//			'min-height': '654px',
			});
		} else {
			var prev_li_ids = parseInt(curent_li_id) + 1;
			var dynamic_height = (window_height / parseInt(curent_li_id)).toFixed();
			$('#' + curent_li_id).closest('ul').css({
				//'margin': '0px auto',
				'margin': '0px',
				'padding': '0px',
				'display': 'table',
				//'width': '100%',
				'position': 'relative',
			});
			$('#' + prev_li_ids).prevAll().removeAttr("style");
			$('#' + prev_li_ids).prevAll().css({

				'height': '' + dynamic_height + 'px',
				'border-right': 'none',
				'vertical-align': 'top',

				'overflow': 'hidden',
			});
			$('#' + curent_li_id).next().addClass('stage_active').css({
				'display': 'table-cell',
				'width': '80%',
				'border-right': 'none',
				'vertical-align': 'top',

				'border-top': '1px solid #fbc460',
			});
		}
	}else{
		alert_lobibox("info", sysparam_datas_list['NTE_60']);
	}
	
}
$('.aw-accordion .accordionsub').click(function () {
	$("#btn_info").show();
	$("#btn_info").html('');
	$('#form_wizard_ul').children('li').removeClass('stage_active').removeAttr("style");
	$(this).nextAll().attr("style", "display: none !important");
	var total_li = $('#form_wizard_ul').children('li').length,
		next_li = $(this).nextAll().length,
		prev_li = $(this).prevAll().length,
		curr_pos = $(this).index();

	if (curr_pos == (parseInt(total_li) - 1)) {
		$("#btn_info").html('Finish');
	} else {
		$("#btn_info").html('Next');
	}
	if (prev_li == 0) {
		$(this).addClass('stage_active').css({
			'display': 'block',
			'width': '100%'
		});
	} else if (prev_li == 1) {
		$(this).prevAll().css({

			'width': '20%',
			'vertical-align': 'top',
			'border-right': 'none',
			'float': 'left',
			'height': '' + window_height + 'px',
			'overflow': 'hidden',
		});
		$(this).addClass('stage_active').css({
			'display': 'inline-block',
			'width': '80%',
			'vertical-align': 'top',
			'border-right': 'none',
			'float': 'left',
		});
	} else {
		//		alert();
		var dynamic_height = (window_height / parseInt(curr_pos)).toFixed();
		$(this).prevAll().css({

			'height': '' + dynamic_height + 'px',
			'border-right': 'none',
			'vertical-align': 'top',
			'overflow': 'hidden',
		});
		$(this).addClass('stage_active').css({
			'display': 'table-cell',
			'width': '80%',
			'border-right': 'none',
			'vertical-align': 'top',

		});
	}
});

/***************** End Form Vizard Script ***********************/



