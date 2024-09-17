/*
*	======== CIRCLE MENU ==========
*	version : 1.0
*	Author : Mochamad Arif Septian Putera | arif.fufu@gmail.com
*	Using 3rd party code : Please install latest Lodash and JQuery to make this code works.
*/
function CircleMenu(target, data, selectedByKey) {
	this.data = null;
	this.items = [];
	this.steps = null;
	this.lastPos = [];
	this.currentSelected=null;
	this.animate = false;

	this.lastItemInTop = null;
	this.lastItemInBottom = null;

/***************************** Init ***************************/
	this.init = function() {

		var that = this;
		target.find('.cm-items').empty();

		if(data && data.length > 0) {
			that.createSteps();
			that.createItems();

			_.forEach(that.items, function(d, i){
				d.on('click', function(){
					d.siblings().removeClass('selected')
					let uname=$(this).data('user_name'),
					rid = $(this).data('room_id'),
					type = $(this).find('div')[0].classList["1"];

					var url=$(this).find('a').attr('href');
					d.addClass('selected')
					that.goto(url);

					callOpenChatRoom(rid,uname,type);
					replyUrlFormation(type,uname);
					return false;
				});
			});

			$('.cm-button-prev').off().on('click', function(){

				that.prev();
			});
			$('.cm-button-next').off().on('click', function(){
				that.next();
			});
		}else {
			console.log('%c CircleMenu ', 'background: #4bd187; color: #333', 'No data');
			target.hide();
		}
	}

	function colorstatus(status){
		if (status == 'online'){
	    return 'active-clr mem-cir-img'
	  }
	  else if(status == 'busy'){
	    return 'offline-clr mem-cir-img'
	  }
	  else if(status == 'away'){
	    return 'away-clr mem-cir-img'
	  }
		else if(status == 'offline'){
	    return ''
	  }
		else if(status == ''){
			return ''
		}
	}
/***************************** create Items ***************************/
	this.createItems = function() {
		var that = this;
		var cm_items = target.find('.cm-items');

		_.forEach(data, function(d, i){
			let user_status=colorstatus(d.status)
			cm_items.append('<li id="item-'+i+'" data-room_id='+d.rid+' data-user_name='+d.label+' class="cm-item zoom"><div class="cm-li-div '+d.class+' img-name""><a href="'+d.url+'" class="menu_text" title="'+d.label+'">'+d.label+'</a><img src="'+userAvatarURL+d.label+'?_dc=undefined" class="'+user_status+'" style="width:50px;height:50px;border-radius:100% !important;margin: 0px;" /></div><ul class=custom-menu><li class=hideRoomBtn>Hide</li></ul></li>' );
			cm_items.append('');
			that.items.push($('#item-'+i));
		});

		if (selectedByKey){
			//
			var offset = _.findIndex(data, ['url', selectedByKey]);
			that.select(offset, {init: true});
		}else{
			that.select(null, {init: true});
		}

	}
/***************************** create steps ***************************/
	this.createSteps = function() {
		var that = this;
		var theta = [], steps = [], positiveSteps = [];
		var widePerItem = 50;

		var max_dat = data.length;

		_.forEach(data, function(d, i){
			var posX = 0, posY = 0;

			if(i <= Math.round((max_dat - 1) / 2)) {
				theta.push((widePerItem / 360) * i * Math.PI);

				posX = Math.round((550 / 2) * (Math.cos(theta[i])));
				posY = -Math.round((550 / 2) * (Math.sin(theta[i])));

				steps.push({ right: posX, top: posY });
			}else {
				var x = i - Math.round((max_dat - 1) / 2);
				positiveSteps.push({ right: steps[x].right, top: steps[x].top * -1 });
			}
			that.steps = steps;
		});

		if(positiveSteps.length > 0) {
			that.lastItemInTop = steps.length - 1;
			that.lastItemInBottom = steps.length;

			that.steps = _.concat(steps, _.reverse(positiveSteps));
		}
	}
/***************************** Next btn fn ***************************/
	this.next = function() {
		var that = this, offset = that.currentSelected;
		var min_offset = 0, max_offset = data.length - 1;

		offset = offset < max_offset ? offset + 1: min_offset;

		this.select(offset, {next: true});
		that.open_chat_room(offset);
	}
/***************************** Prev btn fn ***************************/
	this.prev = function() {
		var that = this, offset = that.currentSelected;
		var min_offset = 0, max_offset = data.length - 1;

		offset = offset > min_offset ? offset - 1 : max_offset;

		this.select(offset, {prev: true});
		that.open_chat_room(offset);
	}
/***************************** custom ***************************/
	this.open_chat_room = function(offset){
		// Retrive the selected element's info for load history
		let $cm_element = $('#item-'+offset),
		uname=$cm_element.attr('data-user_name'),
		rid=$cm_element.attr('data-room_id'),
		type=$cm_element.find('div')[0].classList['1'];
		callOpenChatRoom(rid,uname,type);
	}
/***************************** Move to ***************************/
	this.goto = function(targetSelected) {
		var that = this;
		// Update the user status for selected user.
		let select_index = data.findIndex(obj=> (obj.url == targetSelected));
		if(data[select_index].class==='chatUser'){
			let recent_obj=recentChatList.filter(obj=> obj.rid == data[select_index].rid);
			data[select_index].status=recent_obj[0].status;
		}
		var offset = _.findIndex(data, ['url', targetSelected]);

		that.select(offset, {goto: true});
		that.open_chat_room(offset);
	}
/***************************** Select items ***************************/
	this.select = function(offset, selectOpt) {
		var that = this, max_dat = data.length;
		var cm_label = $('#cm_selected_item');
		if(offset >= 0) {
			if(!that.animate) {
				that.animate = true;

				var newPos = [];
				var lastItem = null, lastItem_bot = null;

				/***************************** Call back fn ***************************/
				var completeAnimation = function(i) {


					cm_label.find('img').fadeIn(100);

					that.lastPos[i] = {
						right: newPos[i].css.right,
						top: newPos[i].css.top,
					}
					that.items[i].find('.menu_text').fadeIn(100);
					if(i == offset) {
						that.items[i].fadeOut(100, function(){});
					cm_label.fadeIn(0);
					cm_label.find('img').removeClass();
					cm_label.find('img').attr('src',userAvatarURL+data[i].label+"?_dc=undefined");
					if(data[i].status){
					cm_label.find('img').attr('class',colorstatus(data[i].status));
					}
					}
					that.animate = false;
				}

				cm_label.find('img').fadeOut(0);

				/***************************** fix the item position ***************************/
				_.forEach(that.items, function(d, i){
					d.find('.menu_text').fadeOut(0);
					d.fadeIn(0, function(){
						// d.removeClass('selected');
						// d.children('div').removeClass('cm-selected-container');
					});

					var pos_id = (i - offset + max_dat) % max_dat;

					if(pos_id == that.lastItemInTop) {
						lastItem = i;
					}

					if(pos_id == that.lastItemInBottom) {
						lastItem_bot = i;
					}
					/***************************** when initial true ***************************/
					if(selectOpt && selectOpt.init) {
						that.lastPos.push({
							right: that.steps[pos_id].right,
							top: that.steps[pos_id].top,
						});
					}

					newPos.push({
						right: that.steps[pos_id].right,
						top: that.steps[pos_id].top,
						onComplete: completeAnimation,
						onCompleteParams:[i]
					});

					// if(offset == i) {
					// 	d.fadeOut(100, function(){
					//
					// 	});
					// }
				});
				/***************************** when goto true ***************************/
				if(selectOpt && selectOpt.goto) {
					// _.forEach(that.items, function(d, i){
					// 	d.hide();
					// });

					that.animateList(newPos);

					setTimeout(function() {
						_.forEach(that.items, function(d, i){
							!d.hasClass('selected') ? d.fadeIn() : null;
						});
					}, 1000);
				}else {
					if(selectOpt && selectOpt.init) {
						that.animateList(newPos);
					}else {
						that.animateList(newPos, selectOpt, lastItem, lastItem_bot);
					}
				}

				that.currentSelected = offset;
			}
		}else {
			console.log('%c CircleMenu ', 'background: #4bd187; color: #333', 'Can\'t find selected item "'+selectedByKey+'" with offset "'+offset+'"');
		}
	}
/***************************** Animate list ***************************/
	this.animateList = function(newPos, selectOpt, lastItem, lastItem_bot) {
		var that = this;

		_.forEach(that.items, function(d, i){
			if(i == lastItem && selectOpt && selectOpt.prev == true) { //perform next animation only for last in top section
				TweenMax.fromTo(d, 1, that.lastPos[i], newPos[i],{ease:Elastic.easeOut,yoyo:true});
				// d.fadeOut(function(){
				// 	TweenMax.fromTo(d, 1, that.lastPos[i], newPos[i],{ease:Elastic.easeOut,yoyo:true});
				//
				// 	setTimeout(function() {
				// 		d.fadeIn();
				// 	}, 800 );
				// });
			}else if(i == lastItem_bot && selectOpt && selectOpt.next == true) { //perform previous animation only for last in bottom section
				TweenMax.fromTo(d, 1, that.lastPos[i], newPos[i],{ease:Elastic.easeOut,yoyo:true});
				// d.fadeOut(function(){
				// 	TweenMax.fromTo(d, 1, that.lastPos[i], newPos[i],{ease:Elastic.easeOut,yoyo:true});
				//
				// 	setTimeout(function() {
				// 		d.fadeIn();
				// 	}, 800 );
				// });
			}else {
				TweenMax.fromTo(d, 1, that.lastPos[i], newPos[i],{ease:Elastic.easeOut,yoyo:true}); //perform next-previous animation for all items
			}
		});
	}

	this.init();
}

 // Hide the right click menu when click out side of window.
$(document).click(function(){
 	$('.custom-menu').css("display","none");
});
