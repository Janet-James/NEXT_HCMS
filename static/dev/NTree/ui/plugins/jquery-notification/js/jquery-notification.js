$.fn.serializeObject = function () {
	var o = {};
	var a = this.serializeArray();
	$.each(a, function () {
		if (o[this.name] !== undefined) {
			if (!o[this.name].push) {
				o[this.name] = [o[this.name]];
			}
			o[this.name].push(this.value || '');
		} else {
			o[this.name] = this.value || '';
		}
	});
	return o;
};

$(function () {
	var IMG_PREFIX = 'demo/img/';
	(function () {
		Lobibox.base.DEFAULTS = $.extend({}, Lobibox.base.DEFAULTS, {
			iconSource: 'fontAwesome'
		});
		Lobibox.notify.DEFAULTS = $.extend({}, Lobibox.notify.DEFAULTS, {
			iconSource: 'fontAwesome'
		});

		(function () {
			$('#popupYesNoBasic').click(function () {
				Lobibox.confirm({
					msg: "Are you sure you want to delete this user?"
				});
			});
			$('#popupErrorBasic').click(function () {
				Lobibox.alert('error', {
					msg: "Lorem ipsum dolor sit amet byron frown tumult minstrel wicked clouded bows columbine full"
				});
			});
			$('#popupSuccessBasic').click(function () {
				Lobibox.alert('success', {
					msg: "Lorem ipsum dolor sit amet byron frown tumult minstrel wicked clouded bows columbine full"
				});
			});
			$('#popupInfoBasic').click(function () {
				Lobibox.alert('info', {
					msg: "Lorem ipsum dolor sit amet byron frown tumult minstrel wicked clouded bows columbine full"
				});
			});
			$('#popupWarningBasic').click(function () {
				Lobibox.alert('warning', {
					msg: "Lorem ipsum dolor sit amet byron frown tumult minstrel wicked clouded bows columbine full"
				});
			});
			$('#popupPromptBasic').click(function () {
				Lobibox.prompt('text', {
					title: 'Please enter username',
					shown: function (box) {
						console.log(box.$input[0]);
					},
					attrs: {
						placeholder: "Username"
					}
				});
			});
			$('#popupProgressBasic').click(function () {
				var inter;
				Lobibox.progress({
					title: 'Please wait',
					label: 'Uploading files...',
					onShow: function ($this) {
						var i = 0;
						inter = setInterval(function () {
							window.console.log(i);
							if (i > 100) {
								inter = clearInterval(inter);
							}
							i = i + 0.1;
							$this.setProgress(i);
						}, 10);
					},
					closed: function () {
						inter = clearInterval(inter);
					}
				});
			});
			$('#popupProgressBootstrap').click(function () {
				var inter;
				Lobibox.progress({
					title: 'Please wait',
					label: 'Uploading files...',
					progressTpl: '<div class="progress lobibox-progress-outer">\n\
                    <div class="progress-bar progress-bar-danger progress-bar-striped lobibox-progress-element" data-role="progress-text" role="progressbar"></div>\n\
                    </div>',
					progressCompleted: function () {
						Lobibox.notify('success', {
							msg: 'Files were successfully uploaded'
						});
					},
					onShow: function ($this) {
						var i = 0;
						inter = setInterval(function () {
							window.console.log(i);
							if (i > 100) {
								clearInterval(inter);
							}
							i = i + 0.2;
							$this.setProgress(i);
						}, 1000 / 30);
					},
					closed: function () {
						inter = clearInterval(inter);
					}
				});
			});
			$('#popupWindowBasic').click(function () {
				Lobibox.window({
					title: 'Window title',
					content: [
						'<p>Lorem ipsum dolor sit amet byron frown tumult minstrel wicked clouded bows columbine full. Panther nascetur estimation, croaked translations brood sharply federal basket. Yet virtues replies pans croaked org feelest, redden chicadeedee wipe, columbine humanity flood mood. Stayed frown ponderous shares bubbles skilled mood federal, shamed robe roll feathered life. Notifies life bows joys bubbles, clouded frown. Skilled wished sportive moved, shamed, year frown sank, universe, wove within. Infirm dames croaked sharply estimation wipe ponderous climb, shamed once basket oracle, smite frown stayed. Sharply bows basket minstrel skilled virtues, panther life. Dames notifies laid, willow listened frankincense croaked potenti. Minstrel since rowed frown, wipe shares, dames wished heaving potenti estimation panther columbine mighty flood.</p>',
						'<p>Lorem ipsum dolor sit amet byron frown tumult minstrel wicked clouded bows columbine full. Panther nascetur estimation, croaked translations brood sharply federal basket. Yet virtues replies pans croaked org feelest, redden chicadeedee wipe, columbine humanity flood mood. Stayed frown ponderous shares bubbles skilled mood federal, shamed robe roll feathered life. Notifies life bows joys bubbles, clouded frown. Skilled wished sportive moved, shamed, year frown sank, universe, wove within. Infirm dames croaked sharply estimation wipe ponderous climb, shamed once basket oracle, smite frown stayed. Sharply bows basket minstrel skilled virtues, panther life. Dames notifies laid, willow listened frankincense croaked potenti. Minstrel since rowed frown, wipe shares, dames wished heaving potenti estimation panther columbine mighty flood.</p>',
						'<p>Lorem ipsum dolor sit amet byron frown tumult minstrel wicked clouded bows columbine full. Panther nascetur estimation, croaked translations brood sharply federal basket. Yet virtues replies pans croaked org feelest, redden chicadeedee wipe, columbine humanity flood mood. Stayed frown ponderous shares bubbles skilled mood federal, shamed robe roll feathered life. Notifies life bows joys bubbles, clouded frown. Skilled wished sportive moved, shamed, year frown sank, universe, wove within. Infirm dames croaked sharply estimation wipe ponderous climb, shamed once basket oracle, smite frown stayed. Sharply bows basket minstrel skilled virtues, panther life. Dames notifies laid, willow listened frankincense croaked potenti. Minstrel since rowed frown, wipe shares, dames wished heaving potenti estimation panther columbine mighty flood.</p>'
					].join("")
				});
			});
		})();
		(function () {
			$('#popupYesNoCallback').click(function () {
				Lobibox.confirm({
					msg: "Are you sure you want to delete this user?",
					callback: function ($this, type) {
						if (type === 'yes') {
							Lobibox.notify('success', {
								msg: 'You have clicked "Yes" button.'
							});
						} else if (type === 'no') {
							Lobibox.notify('info', {
								msg: 'You have clicked "No" button.'
							});
						}
					}
				});
			});
		})();
		(function () {
			function processData(params) {
				if (params.width === "") {
					delete params.width;
				}
				if (params.title === "") {
					delete params.title;
				}
				if (params.iconClass === "") {
					delete params.iconClass;
				}
				var checks = ['closeButton', 'draggable', 'modal', 'closeOnEsc', 'showProgressLabel'];
				for (var i in checks) {
					params[checks[i]] = !!params[checks[i]];
				}
				if (params.placeholder) {
					params.attrs = {
						placeholder: params.placeholder
					};
				}
				return params;
			}

			var $form = $('#lobibox-popup-demo-form');

			var $popupType = $form.find('[name="popupType"]');
			$popupType.change(function () {
				var $this = $(this);
				$form.find('.alert-fieldset').attr('disabled', true);
				$form.find('.prompt-fieldset').attr('disabled', true);
				$form.find('.confirm-fieldset').attr('disabled', true);
				$form.find('.progress-fieldset').attr('disabled', true);

				if ($this.val() === 'alert') {
					$form.find('.alert-fieldset').removeAttr('disabled');
					$form.find('[href="#alert-options"]').trigger('click');
				} else if ($this.val() === 'prompt') {
					$form.find('.prompt-fieldset').removeAttr('disabled');
					$form.find('[href="#prompt-options"]').trigger('click');
				} else if ($this.val() === 'confirm') {
					$form.find('.confirm-fieldset').removeAttr('disabled');
					$form.find('[href="#confirm-options"]').trigger('click');
				} else if ($this.val() === 'progress') {
					$form.find('.progress-fieldset').removeAttr('disabled');
					$form.find('[href="#progress-options"]').trigger('click');
				}
			});
			$form.submit(function (ev) {
				ev.preventDefault();
				var inter;
				var params = $form.serializeObject();
				params = processData(params);
				if (params.popupType === 'confirm') {
					Lobibox.confirm(params);
				} else if (params.popupType === 'progress') {
					params.onShow = function ($this) {
						var i = 0;
						inter = setInterval(function () {
							if (i > 100) {
								inter = clearInterval(inter);
							}
							i = i + 0.1;
							$this.setProgress(i);
						}, 10);
					};
					params.closed = function () {
						inter = clearInterval(inter);
					};
					Lobibox.progress(params);
				} else {
					Lobibox[params.popupType](params.type, params);
				}
			});
		})();
		
	
	
		//            Notification basic example
		(function () {
			$('#basicDefault').click(function () {
				Lobibox.notify('primary', {
					  position: 'top right',
					msg: 'Lorem ipsum dolor sit amet against apennine any created, spend loveliest, building stripes.'
				});
			});
			$('#basicSuccess').click(function () {
				Lobibox.notify('success', {
					  position: 'top right',
					msg: 'Lorem ipsum dolor sit amet against apennine any created, spend loveliest, building stripes.'
				});
			});
			$('#basicInfo').click(function () {
				Lobibox.notify('btn-info', {
					  position: 'top right',
					msg: 'Lorem ipsum dolor sit amet against apennine any created, spend loveliest, building stripes.'
				});
			});
			$('#basicWarning').click(function () {
				Lobibox.notify('warning', {
					  position: 'top right',
					msg: 'Lorem ipsum dolor sit amet against apennine any created, spend loveliest, building stripes.'
				});
			});
			$('#basicError').click(function () {
				Lobibox.notify('error', {
					  position: 'top right',
					msg: 'Lorem ipsum dolor sit amet against apennine any created, spend loveliest, building stripes.'
				});
			});
		})();
	//})();