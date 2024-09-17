$(function(){
/*want to remove this js 
this for create circle menu data forming.
*/
	var DATA = [];

	for(var i=0;i<=4;i++) {
		DATA.push({
			label: 'UI/UX Team '+i,
			img: '<img src="/static/niaa/assets/images/menu.png" width="80px" height="80px" alt="Image" class="selected_img"/>',
			url: 'menu-'+i
		});
	}

	var SELECTED = 'menu-0';

	var OPTIONS = {
		key: 'url',
		pageLoader: {
			target: null,
			key: 'url'
		}
	}

	var FUNC = {
		onInit: function() {
			console.log('INIT');
		},
		onChangeBegin: function() {
			console.log('CHANGE');
		},
		onChangeComplete: function(d) {
			console.log('CHANGE_COMPLETE')
			console.log(d)
		}
	};

	//var circleMenu = new CircleMenu($('#my-circle-menu'), DATA, SELECTED, OPTIONS, FUNC);
});
