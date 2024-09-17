// niaaconfig object contains default configuration variables
var niaaconfig = {
  roomHistoryLength: 50,
  // Load history count when first time load.
  loadConvLength: 50,
  // Load previous and next conv count in room.
  searchConvLength: 50,
  // Search message load conv count.
  // rocketChatIP: 'tst-niaa.nexttechnosolutions.com',
//  rocketChatIP: 'niaa.nexttechnosolutions.com',
  // Rocket chat server IP
 },
 location_protocol = location.protocol,ws_protocol;
 if(location_protocol == "http:"){
      ws_protocol = 'ws:';
 }else if(location_protocol == "https:"){
      ws_protocol = 'wss:';
 }
// var webSocketURL = ws_protocol+'//'+ window.location.hostname + '/niaa/websocket',
// loginURL = location_protocol+"//"+window.location.hostname + '/niaa/api/v1/login',
// userPresenceURL = location_protocol+"//"+window.location.hostname +'/niaa/api/v1/users.getPresence?userId=',
// meURL = location_protocol+"//"+window.location.hostname+'/niaa/api/v1/me',
// userListURL = location_protocol+"//"+window.location.hostname+'/niaa/api/v1/users.list',
// upload_url = location_protocol+"//"+ window.location.hostname + '/ufs/GridFS:Uploads/', //URLs for the reply message link
// channelURL = "[ ]("+location_protocol+"//"+ niaaconfig.rocketChatIP + "/channel/",
// groupURL = "[ ]("+location_protocol+"//"+ niaaconfig.rocketChatIP + "/group/",
//directURL = "[ ]("+location_protocol+"//"+ niaaconfig.rocketChatIP + "/direct/",
// userAvatarURL = location_protocol+"//"+ window.location.hostname + '/niaa/avatar/',
 loading_center_animation = '<div class="mul14 mul14-center"><div class="mul14s mul14s1"></div><div class="mul14s mul14s2"></div><div class="mul14s mul14s3"></div>' + '<div class="mul14s mul14s4"></div><div class="mul14s mul14s5"></div></div>',
 scrolling_top_animation = '<div class="mul14 mul14-top"><div class="mul14s mul14s1"></div><div class="mul14s mul14s2"></div><div class="mul14s mul14s3"></div>' + '<div class="mul14s mul14s4"></div><div class="mul14s mul14s5"></div></div>',
 scrolling_bottom_animation = '<div class="mul14 mul14-bottom"><div class="mul14s mul14s1"></div><div class="mul14s mul14s2"></div><div class="mul14s mul14s3"></div>' + '<div class="mul14s mul14s4"></div><div class="mul14s mul14s5"></div></div>',
 msg_animation = "<i class='fa fa-envelope faa-shake animated'></i>",
 firstRound = true,
 allMonth = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
 shortMonthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"],
 topMsgId = null,
 space = "&nbsp;&nbsp;&nbsp;&nbsp;",
 strDateFlag = true,
 todaysDateFlag = true, // Room's today date flag for onchange message.
 roomsInfo = undefined,
 $niaahtml = {},
 rocket_chat_tab = 'visible',
 user_idel_timeout = 10000,
 hideRoomList = [],
 momDataList = [],
 usersList, momUserMailList = [], // Light Box => lb
 light_box_image_list = [], // light box image slide's values.
 lb_image_src_list = [], // For image source and message id for light box.
 load_history_img_cnt, // Retrieved history's image count.
 lb_image_list = [], // Retrieved images light box index values.
 //this is contain the html dom element varialbes
 roomsHistory = [], // Timeline conversation history.
 timelineSplitCnt = 10,
 jumpToMessage = false, //Jump to recent messages flag for serach messages.
 unreadJumpMsgCount = 0, // new message count when the jump to new msg flag.
 ddpLoadFlag = true, // ddp loading flag for disable multiple ddp call.
 roomFirstUnread = {}
// Room's first unread message info.
currentRoomNewMsgCnt = 0,
 // current room's nre message count.
 editMsgFlag = false,
 // click edit btn to update flag true and call update message.
 fileUpload = {},
 // File uploading objects like timer, upload time.
 searchRoomName = {
  room_list: []
 },
 // search room name objects for selected room list.
 //groupCreate.room_list=[], // Group members list.
 addGroupMember = {
  room_list: []
 },
 // Add group member list.
 groupMemberList = [],
 // Current group  members list.
 uploadFiles = [],
 // File upload input box upload file elements.
 deactiveUserList = [],
 // Deactivated user list.
 restHeartURL = location.protocol+"//"+window.location.hostname+"/niaa/forward/"
// RestHeart URl and path.
recentChatList = [],
 initSelectorVar = function() {
  var $niaaChatBox = {};
  $niaaChatBox = {
   scrolling: $('.live-chat-messages .inner-loading'),
   chatBox: $('.live-chat-messages .force-overflow'),
   submitBox: $('#live-chat-submit-input'),
   msgSearchBox: $('#search_msg_disp_div'),
   tlSearchBox: $('.timeline_search_result'),
   // Timeline search message div.
   // chatBoxHeader:$('.live-chat-header-title'),
  }
  Object.assign($niaahtml, $niaaChatBox);
 },
 $niaahtml = {
  groups: $('.owl-carousel.groups'),
  users: $('.owl-carousel.users'),
  channels: $('.owl-carousel.channels'),
  recentChat: $('#recent_chat'),
  // circle menu items // recent chat
  search: $('.owl-carousel.searchnames'),
  header: $('.inner-container .row .chatheader'),
  usermention: $('.usersmention'),
  forward: $('.forword-search-result .forward_msg_list'),
 },
 showErr = function(res) {
  errorNotification(res.message);
  console.log(res.message, res.stack);
  //this is shows the err location.
 },
 findAmPmTimeFormat = function(userConvTime) {
  return userConvTime.toLocaleString('en-US', {
   hour: 'numeric',
   minute: 'numeric',
   second: 'numeric',
   hour12: true
  })
 },
 isDayFirstMsg = function(timeObj) {
  //find day wise conversation
  if (firstRound == true) {
   dayStarting = timeObj.setHours(0, 0, 0, 0);
   dayEnding = timeObj.setHours(23, 59, 59, 999);
   today = allMonth[timeObj.getMonth()] + ' ' + timeObj.getDate() + ' ' + timeObj.getFullYear();
   firstRound = false;
   return ("<div id=roomTopStrDateLbl class=un-read-msg><span>" + today + "</span></div>")
  }
  if (dayStarting < timeObj && timeObj < dayEnding) {} else {
   dayStarting = timeObj.setHours(0, 0, 0, 0);
   dayEnding = timeObj.setHours(23, 59, 59, 999);
   today = allMonth[timeObj.getMonth()] + ' ' + timeObj.getDate() + ' ' + timeObj.getFullYear();
   return ("<div class=un-read-msg><span>" + today + "</span></div>");
  }
  //end
 },
 showDayWiseReversely = function(userConvTimeFlag) {
  // It will displays the date flag when reverse append
  actualDate = userConvTimeFlag;
  if (strDateFlag) {
   // First time on the current room check the Top message time stamp
   first_msg = $('#' + topMsgId).data("timestamp");
   dateToCheck = new Date(first_msg);
   strDateFlag = false;
  }
  // Checks the curerent conversation and previous conversation date are same
  if (dateToCheck.getFullYear() === actualDate.getFullYear() && dateToCheck.getMonth() === actualDate.getMonth() && dateToCheck.getDate() === actualDate.getDate()) {
   $('#roomTopStrDateLbl').remove();
  } else {
   let dateString = allMonth[dateToCheck.getMonth()] + ' ' + dateToCheck.getDate() + ' ' + dateToCheck.getFullYear();
   $('.live-chat-messages .force-overflow').prepend("<div class=un-read-msg><span>" + dateString + "</span></div>");
  }
  dateToCheck = actualDate;
 },
 showChatMsg = function(userName, userMsg, userConvTimeResult, userConvTimeFlag) {
  /* Checks the currently loading previous message or next message using
   * topMsgId. It have any value then that's a load previous message so 'prepend' the room,
   * and null then it load next set of messages
   * so message was 'append' the room
   */
  if (topMsgId && userConvTimeFlag) {
   showDayWiseReversely(userConvTimeFlag);
   $('.live-chat-messages').prepend("<div class='convdiv'><div><div class='username'><strong>" + userName + "</div></strong></br>" + userMsg + space + "<span class=convTimeDiv>" + userConvTimeResult + "</span> </div><br></div>");

  } else {
   let dateFlag = isDayFirstMsg(userConvTimeFlag);
   if (dateFlag)
    $('#live-chat-messages').append(dateFlag);
   $('.live-chat-messages').append("<div class='convdiv'><div><div class='username'><strong>" + userName + "</div></strong></br>" + userMsg + space + "<span class=convTimeDiv>" + userConvTimeResult + "</span> </div><br></div>");
  }
 },
 // group chat box elements
 liveChatBox = function() {
  var msgContainer = document.getElementsByClassName('force-overflow');
  var submitInput = document.getElementById('live-chat-submit-input');
  // var boxHeader = document.getElementById('live-chat-box-header');
  return {
   container: msgContainer,
   submitInput: submitInput // boxHeader: boxHeader
  }
 },
 //update the scoll position when new message receive
 updateScrollPosition = function() {
  var d = $('.live-chat-messages');
  d.scrollTop(d.prop("scrollHeight"));
 },
 //this is for show the list of message via handlebars
 appendChatMessages = function(res) {
  var html = Handlebars.templates.chat_window({
   'HISTORY': res
  });
  $('.live-chat-messages .inner-loading').empty();
  $niaahtml.chatBox.append(html);
  // updateScrollPosition();
 },

 appendSearchMessages = function(res) {
  // $('#search_msg_disp_div .inner-loading').css('display','none');
  // $('#search_msg_disp_div .inner-loading').empty();
  var html = Handlebars.templates.search_message({
   'HISTORY': res
  });
  $('#search_msg_disp_div').html(html);
  // updateScrollPosition();
 },
 appendTLSearchMsg = function(res) {
  // Timeline search message appending.
  $('.timeline_search_div .inner-loading').css('display', 'none');
  $('.timeline_search_div .inner-loading').empty();
  var html = Handlebars.templates.timeline_search({
   'HISTORY': res
  });
  $niaahtml.tlSearchBox.append(html);
 },
 loadConversations = function(res) {
  // load history and surrounding message appending.
  $('.live-chat-messages .inner-loading').empty();
  var html = Handlebars.templates.chat_window({
   'HISTORY': res
  });
  $niaahtml.chatBox.html(html);
 },

 //this is show the message with prepend format
 prependChatMessages = function(res) {
  var html = Handlebars.templates.chat_window({
   'HISTORY': res
  });
  $('.live-chat-messages .inner-loading').empty();
  $niaahtml.chatBox.prepend(html);
 },
 checkPreviousURL = function(res) {
  if ($('.message-data').filter("li[id=" + res._id + "]").length) {
   $("li[id=" + res._id + "]").remove();
  }
 }
$(document).on('click', '#err-msg-cls', function() {
 $('#err-msg').empty();
});
setScrollerPosition = function() {
 //if the room have unread message then start with first unread message position
 //else start with bottom
 var $unread_tag = $('.RoomUnreadTag', $niaahtml.chatBox);
 if ($unread_tag.length && $unread_tag.hasClass('mark_as_read_btn')) {
  // focus the next conv of creen top new message's label.
  $unread_tag.next()[0].scrollIntoView()
 } else if ($unread_tag.length) {
  // New message count less then 10
  $unread_tag[0].scrollIntoView();
 } else {
  updateScrollPosition();
 }
}

document.addEventListener('visibilitychange', function(e) {
 rocket_chat_tab = document.visibilityState;
});
ignoreUser = function(res) {
 //this is remove the who is logged in and rocket cat users
 //for avoid showm that users
 var userstoRemove = [getuserid(), 'rocket.cat'];
 //this array contain the remove users id
 for (let removeUser = 0; removeUser < userstoRemove.length; removeUser++) {
  for (let i = 0; i < res.length; i++) {
   if (userstoRemove[removeUser] == res[i].id) {
    res.splice(i, 1);
   }
  }
 }
 return res
}

ignoreUserMention = function(res) {
 //this is remove the who is logged in and rocket cat users
 //for avoid showm that users
 var userstoRemove = [getuserid(), 'rocket.cat'];
 //this array contain the remove users id
 for (let removeUser = 0; removeUser < userstoRemove.length; removeUser++) {
  for (let i = 0; i < res.length; i++) {
   if (userstoRemove[removeUser] == res[i]._id) {
    res.splice(i, 1);
   }
  }
 }
 return res
}
resetLightBox = function() {
 light_box_image_list = [];
 lb_image_src_list = [];
 lb_image_list = [];
 load_history_img_cnt = 0;
 $('.lightBoxImagesDiv').html('');
};
//  show images inner side image script
openModal = function() {
 if ($(event.target).parents('.force-overflow').length) {
  $('#myModal').css('display', 'block');
 }
}
// closeModal = function() {
//   $("#myModal").css('display','none');
// }
$(document).on('click', '.lb_close', function() {
 $("#myModal").css('display', 'none');
});

var slideIndex = 1;
showSlides = function(n) {
 // next , prev button handling.
 let i, slides = document.getElementsByClassName("mySlides");
 if (n >= slides.length) {
  slideIndex = 0
 }
 if (n < 0) {
  slideIndex = slides.length - 1
 }

 for (i = 0; i < slides.length; i++) {
  slides[i].style.display = "none";
 }
 slides[slideIndex].style.display = "block";
 showImgDesc(slides[slideIndex]);
}
// Next Previous Slides.
plusSlides = function(n) {
 showSlides(slideIndex += n);
}
currentSlide = function(n) {
 let i, slides = document.getElementsByClassName("mySlides");
 slideIndex = light_box_image_list.indexOf(n)
 for (i = 0; i < slides.length; i++) {
  slides[i].style.display = "none";
 }
 slides[slideIndex].style.display = "block";
 showImgDesc(slides[slideIndex]);
}
showImgDesc = function($slide) {
 // Image description read from message description.for light box.
 let live_chat_li_id = $slide.id.replace('lb_img_', ''),
  msgContainer = $('li#' + live_chat_li_id).closest('li'),
  editing_text = msgContainer.find('[class=attachment-description]').text();
 $('.caption-container #caption').html(editing_text);
}

chatBoxDynamicResize = function(e) {
 // Chat window resize.
 /****************************Dynamic Equel height script ******************************/
 $('.messages').css('height', $(window).innerHeight() - $('.inner-container .row').height() - $('.message-input').height() + 'px');
 /****************************Dynamic Equel height script ******************************/
 $('#timeline_div').css('height', $(window).innerHeight() - $('.inner-container .row').height() - $('.message-input').height() + 'px');
}
$(document).ready(function() {
 var $content = $(".niaa-wrapper").hide();
 $(".niaa-info-menu .pop-up-show-chat").on("click", function(e) {
  e.preventDefault();
  $(this).toggleClass("expanded");
  $content.slideToggle();
  chatBoxDynamicResize(e);
 });
});

$(window).on('resize', function(e) {
 // resize the chat box when window resize.
 chatBoxDynamicResize();
});

carousel = function(name) {
 var owl = $('.owl-carousel.' + name);
 owl.owlCarousel({
  loop: false,
  nav: true,
  margin: 10,
  responsive: {
   0: {
    items: 1
   },
   600: {
    items: 3
   },
   960: {
    items: 4
   },
   1200: {
    items: 5
   }
  }
 });
 owl.on('mousewheel', '.owl-stage', function(e) {
  if (e.deltaY > 0) {
   owl.trigger('next.owl');
  } else {
   owl.trigger('prev.owl');
  }
  e.preventDefault();
 });
}

$(".circle-1.channels").click(function() {
 hidden_carousel("channels");
 $(".owl-carousel.owl-loaded.channels").fadeToggle("slow");
});
$(".circle-1.users").click(function() {
 hidden_carousel("users");
 $(".owl-carousel.owl-loaded.users").fadeToggle("slow");
});

$(".circle-1.groups").click(function() {
 hidden_carousel("groups");
 $(".owl-carousel.owl-loaded.groups").fadeToggle("slow");
});

hideCarousel = function() {
 if ($('.srh-circle .circle-1.channels').hasClass('active')) {
  $('.owl-carousel.owl-loaded.channels').css('display', 'none');
  $('.srh-circle .circle-1.channels').removeClass('active');
 } else if ($('.srh-circle .circle-1.groups').hasClass('active')) {
  $('.owl-carousel.owl-loaded.groups').css('display', 'none');
  $('.srh-circle .circle-1.groups').removeClass('active');
 } else if ($('.srh-circle .circle-1.users').hasClass('active')) {
  $('.owl-carousel.owl-loaded.users').css('display', 'none');
  $('.srh-circle .circle-1.users').removeClass('active');
 }
}

$("#search_box").click(function() {
 hidden_carousel("search");
 if (!$(this).hasClass('active')) {
  $(this).addClass('active');
  $('.owl-carousel.searchnames').css('display', 'inline-block');
  $('.search_user').focus();
 } else {
  $('.search_user').val('');
  $niaahtml.search.empty();
  $('.owl-carousel.owl-loaded.searchnames').css('display', 'none');
  $(this).removeClass('active');
 }
 // $(".owl-carousel.owl-loaded.searchnames").fadeToggle("slow");
});

hidden_carousel = function(hiddenvalue) {
 if ($("#search_box").hasClass('active')) {
  $('#search_box').trigger('click');
 }
 if (hiddenvalue == 'channels') {
  $('.chat_close').css('display', 'none');
  $('.owl-carousel.searchnames').css('display', 'none');
  $('.owl-carousel.owl-loaded.users').css('display', 'none');
  $('.owl-carousel.owl-loaded.groups').css('display', 'none');
  $('.search_user').val('');
 } else if (hiddenvalue == 'groups') {
  $('.chat_close').css('display', 'none');
  $('.owl-carousel.searchnames').css('display', 'none');
  $('.owl-carousel.owl-loaded.users').css('display', 'none');
  $('.owl-carousel.owl-loaded.channels').css('display', 'none');
  $('.search_user').val('');
 } else if (hiddenvalue == 'users') {
  $('.chat_close').css('display', 'none');
  $('.owl-carousel.searchnames').css('display', 'none');
  $('.owl-carousel.owl-loaded.groups').css('display', 'none');
  $('.owl-carousel.owl-loaded.channels').css('display', 'none');
  $('.search_user').val('');
 } else if (hiddenvalue == 'search') {
  hideCarousel();
  $('.owl-carousel.searchnames').trigger('destroy.owl.carousel');
  $('.owl-carousel.owl-loaded.channels').css('display', 'none');
  $('.owl-carousel.owl-loaded.groups').css('display', 'none');
  $('.owl-carousel.owl-loaded.users').css('display', 'none');
 }
}

carouselUserStatus = function(res) {

 if (res.id != 'rocket.cat' && $('.owl-carousel.users').find('div[id=' + res.id + ']').length) {
  //to avoid the rocket.cat status.
  if (res.msg == "changed") {
   if (res.fields.status == 'away') {
    $('.owl-carousel.users').find('div[id=' + res.id + ']').find('img')["0"].className = 'away-clr mem-cir-img';
   } else if (res.fields.status == 'online') {
    $('.owl-carousel.users').find('div[id=' + res.id + ']').find('img')["0"].className = 'active-clr mem-cir-img';
   } else if (res.fields.status == 'busy') {
    $('.owl-carousel.users').find('div[id=' + res.id + ']').find('img')["0"].className = 'offline-clr mem-cir-img';
   }
  } else if (res.msg == 'added') {
   $('.owl-carousel.users').find('div[id=' + res.id + ']').find('img')["0"].className = 'active-clr mem-cir-img';
  } else if (res.msg == 'removed') {
   $('.owl-carousel.users').find('div[id=' + res.id + ']').find('img')["0"].className = '';
  }
 }
}

showTimeLine = function(res, dataFrom) {
 let msg_index;
 if (dataFrom) {
  msg_index = roomMsgIndex(res.messages[0]._id);
 }
 if (dataFrom == 'previous') {
  // Set the previous conversations to room history.
  msg_index == -1 ? roomsHistory.messages = res.messages.concat(roomsHistory.messages) : roomsHistory.messages[msg_index] = res.messages[0];
 } else if (dataFrom == 'next') {
  // Set the next conversations to room history.
  msg_index == -1 ? roomsHistory.messages = roomsHistory.messages.concat(res.messages) : roomsHistory.messages[msg_index] = res.messages[0];
 } else {
  // Assign the value for timeline conversaton history.
  if (roomsHistory.length) {
   roomsHistory.length = 0;
  }
  roomsHistory = res;
 }
 displayTimeLine(roomsHistory);
}
displayTimeLine = function(res) {
 // Display the timeline bassed split count.
 let time_line = [],
  convLength = res.messages.length,
  displayStr;
 $("#timeline_div").html('');
 if (res.messages.length <= timelineSplitCnt) {

  for (var message = 0; message < convLength; message++) {
   let conversation = res.messages[message],
    date_ts = conversation.ts.$date,
    date_string = moment(date_ts).format('DD MMM YYYY').toUpperCase(),
    time_str = moment(date_ts).format('LT'),
    $timeLineValue = "<div class='large-circle-btn'><button type=button class='timline_btn'  id=" + conversation._id + "></button><span style='position: static;margin: -15px 0px 0px 20px;' class=large>" + date_string + "</span><span style='position: static;' class=small>" + time_str + "</span><span style='position: static;' class=medium>" + (message + 1) + "/" + convLength + "</span></div>";
   //displayStr = ''+(message+1)+'/'+convLength+' '+date_string+' '+time
   $("#timeline_div").append($timeLineValue);
  }
 } else {
  let tlBetweenCnt = Math.floor(convLength / (timelineSplitCnt - 2)),
   $timeLineValue = '';
  for (var message = 0; message < convLength; message++) {
   let conversation = res.messages[message],
    date_ts = conversation.ts.$date,
    date_string = moment(date_ts).format('DD MMM YYYY').toUpperCase(),
    time_str = moment(date_ts).format('LT'),
    timeLineValue = '';
   // Date and time string for timeline split and last conversation.
   if (message % tlBetweenCnt == 0 || message == convLength - 1) {
    // with date and time string for first and last value.
    // Last message's div is closed
    $("#timeline_div").append($timeLineValue);
    $timeLineValue = $("<div class='large-circle-btn'><button type=button class='timline_btn' id=" + conversation._id + "><i id='aero_direction' ></i></button><span class=large>" + date_string + "</span><span class=small>" + time_str + "</span><span class=medium>" + (message + 1) + "/" + convLength + "</span></div>");
    if (message == convLength - 1) {
     $("#timeline_div").append($timeLineValue);
    }
   } else {
    $("<div class='small-circle-btn'><button type=button class='timline_btn'  id=" + conversation._id + "><i id='aero_direction'></i></button></div>").appendTo($timeLineValue);
   }
  }
 }
}

// $('#live-chat-messages').on('scroll', function() {
//         if($('.RoomUnreadTag').length){
//         }
//         if($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
//             updateScrollPosition();
//         }
//     });

// Timeline to room focus
$(document).on("click", ".timline_btn", function() {
 //Focus the selected conversation.
 $('.live-chat-messages li#' + this.id)[0].scrollIntoView();
});

$('.outer-div-equel').css('display', 'none');

var isSameDay = function(date1, date2) {
  // check two timestamps are same or not.

  return moment(date1).isSame(date2, 'd');
 },
 resetTextAreaStyle = function() {
  // Reset the message input text area.
  $('.message-input').css('height', 80 + 'px');
  $('.message-input').removeAttr("style");
 },
 resetReply = function() {
  // Reset the reply message elements.
  $('#live-chat-submit-input').val('');
  if ($("#divShowHide").length) {
   $("#divShowHide").empty();
   $(".msg_link").val('');
  }
  $('.file_attachment').removeClass('disableCursor');
 },
 successNotification = function(notification_msg) {
  //test = "Chat Transcript has been recorded";
  let success_msg = "<div class='niaa-success-box animated top-to-btm error_notification'>" + "<span>" + notification_msg + "</span><a class=closen href=#><i class='nf-niaa-close nf_close'></i></a></div>";
  $('#notification_div').html(success_msg);

  setTimeout(function() {
   $('#notification_div').html('');
  }, 3000);
 },
 errorNotification = function(notification_msg) {
  let error_msg = "<div class='niaa-error-box animated top-to-btm error_notification'>" + "<p>" + notification_msg + "</p><a class=closen href=#>" + "<i class='nf-niaa-close nf_close'></i></a></div>"
  $('#notification_div').html(error_msg);

  /* setTimeout(function(){
    $('#notification_div').html('');
  }, 125000);*/
 },
 disconnectNotification = function() {
  let error_msg = "<div class='niaa-error-box animated top-to-btm error_notification'>" + "<span>Websocket disconnected. Please refresh the page to reconnect. </span><a class=closen href=#>" + "<i class='nf-niaa-close nf_close'></i></a></div>"

  $('#notification_div').html(error_msg);
 },
 roomMsgIndex = function(msg_id) {
  // Find the room's message index in roomsHistory.
  return roomsHistory.messages.findIndex(obj => (obj._id == msg_id));
 };

getCookie = function() {
 var decodedCookie = decodeURIComponent(document.cookie);
 var ca = decodedCookie.split('; ');
 var user_obj = {}
 for (var i = 0; i < ca.length; i++) {
  var split_content = ca[i].split('=')
  //if (split_content[0].charAt(0) == ' ') {
  //key = split_content[0].substring(1);
  key = split_content[0];
  if ((key == 'niaa_token') || (key == 'niaa_uid')) {
   user_obj[key] = split_content[1]
  }
  //}
 }
 if (Object.keys(user_obj).length) {
  return user_obj
 } else {
  return null;
 }
}

imageuploadinfo = function(userobj) {
 $.ajax({
  method: 'POST',
  url: location_protocol+'//'+ window.location.hostname +'/mail/userinfo/',
  data: userobj,
  success: function(response, data) {

  },
  error: function(response, data) {
	  alert_lobibox("error", "niaa "+response.statusText);
  }
 });
}

create_user = function(user_obj) {
 // Create user API.
 let data = getCookie();
 $.ajax({
  method: 'POST',
  headers: {
   'X-Auth-Token': data.niaa_token,
   'X-User-Id': data.niaa_uid,
  },
  contentType: "application/json",
  dataType: "json",
  url: location_protocol+'//'+ window.location.hostname +'/api/v1/users.create',
  data: JSON.stringify({
   email: user_obj.email,
   name: user_obj.name,
   username: user_obj.username,
   password: user_obj.password,
   verified: true,
   roles: user_obj.roles,
  }),
  success: function(response, data) {
   imageuploadinfo({
    userid: response.user._id,
    imageid: 'http://' + window.location.hostname + '/media/user_profile/' + user_obj.imageid + '.jpg',
    emailid: user_obj.email[0],
   })
  },
  error: function(response, data) {
   errorNotification(response.statusText);
  }
 });
}

userDeactivateDiv = function() {
 // current user is deactivated then show the read only room msg.
 $('.read-only-chat-room').css('display', 'block');
 $('.message-input').css('display', 'none');
}
userActivateDiv = function() {
 // current user is activated then show the message write box.
 $('.read-only-chat-room').css('display', 'none');
 $('.message-input').css('display', 'block');
}



getCookie = function() {
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split('; ');
    var user_obj = {}
    for (var i = 0; i < ca.length; i++) {
        var split_content = ca[i].split('=')
        //if (split_content[0].charAt(0) == ' ') {
        //key = split_content[0].substring(1);
        key = split_content[0];
        if ((key == 'niaa_token') || (key == 'niaa_uid')) {
            user_obj[key] = split_content[1]
        }
        //}
    }
    if (Object.keys(user_obj).length) {
        return user_obj
    } else {
        return null;
    }
}


function imageupdateinfo(email){
  //let email=$("#employee_primary_details_form #email").val()
  $.ajax({
      method: 'POST',
      url: location_protocol+'//'+ window.location.hostname +'/mail/updateimageinfo/',
      data:{'email':email},
      success: function(response, data) {
        console.log("Update NIIA user image Pass \n"+ data)
      },
      error: function(response, data) {
        console.log("Update NIIA user image Pass \n"+ response.statusText)
        errorNotification(response.statusText);
      }
  });
}

function createOrUpdateUserImage(){
  // Current HCMS user is not present in NIAA this function is help to create user image URL or update image.
  let email= $("#user_email").val();
  let image_url = $("#user_photo").attr('src');
  let niaa_info=getCookie();
  $.ajax({
      method: 'POST',
      url: location_protocol+'//'+ window.location.hostname +'/mail/checkuserinfo/',
      data:{'userid':niaa_info.niaa_uid,'auth_token':niaa_info.niaa_token,'email':email,'image_url':image_url},
      success: function(response, data) {
        console.log("Create or Update NIIA user Info Pass \n"+ data)

      },
      error: function(response, data) {
          errorNotification(response.statusText);
      }
  });
};
//createOrUpdateUserImage();
