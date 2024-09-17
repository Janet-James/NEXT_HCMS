define('loadhistory', ['ddp', 'room', 'user'], function(niaaddp, niaaroom, niaauser) {
 var is_prev_msg = false,
  is_next_msg = false,
  strDateFlag = true,
  isFromScroll = false,
  convHistory = [], // Form and store the Loaded messages html format
  setIsFromScroll = function(fromScroll) {
   isFromScroll = fromScroll;
  },
  getIsNextMsg = function() {
   return is_next_msg
  },
  getIsPrevMsg = function() {
   return is_prev_msg
  },
  getConvHistory = function() {
   return convHistory;
  },
  ddpLoadHistory = function(chatID, conv_len, until_ts, userName) {
   niaaddp.ddp_method("loadHistory", [chatID, null, conv_len, {
    '$date': until_ts
   }], function(err, res) {
    if (res) {
     // if (res.messages.length){
     subDeleteMsg(chatID, false);
     niaaroom.roomSubscription();
     res.isFromLoadHistory = true;
     //because we load history based on end of the message so next messages not available
     convHistory.length = 0;
     is_next_msg = false;
     is_prev_msg = true;
     //strDateFlag = true;
     firstRound = true;
     // Each time place date string on first time
     topMsgId = null;
     isFromScroll = false;
     // Reset the action (load message) from scroll to false.
     let image_count = findImagCountFn(res);
     var messages = res.messages.reverse();
     res.messages = messages;
     // Set to the response into room history, and disply timeline
     showTimeLine(res);
     var resp = loadHistoryProcessor(res)
     //send the the resp with received
     addImgToLightBox(image_count);
     // for display the images on light box.
     if (resp) {
      loadConversations(resp);
      setScrollerPosition();
     } //show conversation
     else {
      $('.live-chat-messages .inner-loading').empty();
      $('#roomConvStartLbl').remove();
      $('.live-chat-messages .force-overflow').append("<label id=roomConvStartLbl><strong> Start of conversation </strong></label><br>")
     }
     // }
     // else{$('.live-chat-messages .inner-loading').empty();$('#roomConvStartLbl').remove();$('.live-chat-messages .force-overflow').append("<label id=roomConvStartLbl><strong> Start of conversation </strong></label><br>")}
    } else {
     createDirectMessage(chatID, conv_len, until_ts, userName)
    }
   });
  },
  createDirectMessage = function(chatID, conv_len, until_ts, uname) {
   niaaddp.ddp_method("createDirectMessage", [uname], function(err, res) {
    if (res) {
     subDeleteMsg(chatID, false);
     niaaroom.roomSubscription();
     ddpLoadHistory(chatID, conv_len, until_ts, uname)
    }
   });
  },
  ddpSurroundingMessage = function(msgId, roomId, time_stamp, conv_len) {
   // Load surrounding message retreive the given message id's surrounding messages.
   //niaaddp.ddp_method("loadSurroundingMessages", [roomFirstUnread], function(err, res) {
   niaaddp.ddp_method("loadSurroundingMessages", [{
    "_id": msgId,
    "rid": roomId,
    "ts": {
     "$date": time_stamp
    }
   }, conv_len], function(err, res) {

    try {
     if (err)
      throw err;
     else if (res) {
      if (res.messages.length) {
       (res.messages).sort(function(a, b){return a.ts.$date - b.ts.$date});
       emptyConvHistory();
       resetLightBox();
       // Reset the light box attributes.
       is_next_msg = true;
       is_prev_msg = true;
       // Want to append the messages correct order so no need the top message
       topMsgId = null;
       let image_count = findImagCountFn(res);
       // Set to the response into room history, and disply timeline
       showTimeLine(res);
       let resp = loadHistoryProcessor(res);
       //send the the resp with received
       addImgToLightBox(image_count);
       // for display the images on light box.
       if (resp) {
        loadConversations(resp);
       }
       //show conversation
       //Focus the first message of loaded
       $('.live-chat-messages').find('li[id=' + msgId + ']')[0].scrollIntoView()
      }
     }
    } catch (err) {
     console.log(err);
     showErr(err)
    }
   });
  },
  ddpLoadNextMessage = function(chatID, conv_len, time_stamp, call_back_fn) {
   niaaddp.ddp_method("loadNextMessages", [chatID, time_stamp, conv_len], function(err, res) {
    try {
     ddpLoadFlag = true;
     if (err)
      throw err;
     return call_back_fn(res)
    } catch (err) {
     console.log(err);
     showErr(err)
    }
   });
  },
  loadNextMsgFn = function(res) {
   if (res.messages.length == 0) {
    is_next_msg = false;
    $('.live-chat-messages .inner-loading').empty();
    if (jumpToMessage) {
     // Reset the Jump to recent messages label
     resetJumpToRecentMsgLbl();
    }
   } else if (res.messages.length) {
    emptyConvHistory();
    is_next_msg = true
    // Want to append the messages correct order so no need the top message
    topMsgId = null;
    // Set to the response into room history, and disply timeline
    showTimeLine(res, 'next');
    // Update time-line.
    let firstMsgId = res.messages[0]._id,
     image_count = findImagCountFn(res),
     resp = loadHistoryProcessor(res);
    //send the the resp with received
    addImgToLightBox(image_count);
    // for display the images on light box.
    if (resp) {
     appendChatMessages(resp);
    }
    //show conversation
    //Focus the first message of loaded
    //document.getElementById(firstMsgId).scrollIntoView()
    $('.live-chat-messages .force-overflow li#' + firstMsgId)[0].scrollIntoView();
   } else if (!isFromScroll) {
    // Check the function call from timeline and not from scroll.
    ddpLoadPrevMessages(niaaroom.getCurrentRoom(), niaaconfig.loadConvLength, null);
    is_next_msg = false;
    isFromScroll = false;
   }
  },
  loadTLSearchFn = function(res) {
   // Load the timeline search function
   $('.loading-animation').remove();
   if (res.messages.length) {
    emptyConvHistory();
    is_next_msg = true
    // Want to append the messages correct order so no need the top message
    topMsgId = null;
    let firstMsgId = res.messages[0]._id,
     resp = loadHistoryProcessor(res);
    //send the the resp with received
    if (resp) {
     appendTLSearchMsg(resp);
    }
    //show conversation in timeline search message div.
    //Focus the first message of loaded
    $('.timeline_search_result li#' + firstMsgId)[0].scrollIntoView();
   } else if (!isFromScroll) {
    // Check the function call from timeline and not from scroll.
    //ddpLoadPrevMessages (niaaroom.getCurrentRoom(),niaaconfig.loadConvLength, null);
    is_next_msg = false;
    isFromScroll = false;
   } else if (!res.messages.length) {
    $('.timeline_search_div .inner-loading').css('display', 'none');
    $('.timeline_search_div .inner-loading').empty();
   }
  },
  ddpLoadPrevMessages = function(chatID, conv_len, time_stamp, top_msg_id) {
   //Prepare a load previous message request
   niaaddp.ddp_method("loadHistory", [chatID, time_stamp, conv_len, null], function(err, res) {
    try {
     ddpLoadFlag = true;
     if (err)
      throw err;
     else if (res) {
      if (res.messages.length) {
       emptyConvHistory();
       is_prev_msg = true
       firstRound = true;
       // Each time place date string on first time
       //To identify the matched time stamp before append
       topMsgId = top_msg_id;
       let image_count = findImagCountFn(res);
       // Check the call from scroll event(load previous conv) or some other(load history)
       conversations = {
        messages: []
       };
       // Reverse the conversation to display orderly
       let reversed_conv = (res.messages.reverse());
       // form the conversations as display function accepted format.
       conversations.messages = reversed_conv;
       // Set to the response into room history, and disply timeline
       showTimeLine(conversations, 'previous');
       // Checks the load previous message and the last chat conversation
       resp = loadHistoryProcessor(conversations);
       //send the the resp with received
       if (resp) {
        prependChatMessages(resp);
       }
       //show conversation
       // Focus the loaded first message in room
       $('#' + reversed_conv[res.messages.length - 1]._id)[0].scrollIntoView();
       addImgToLightBox(image_count);
       // 1. Append the images on light box.
       topMsgId = null;
       // 2. reset the top message id variable.
      } else {
       $('.live-chat-messages .inner-loading').empty();
       // check the stat of convesation string already exists or not
       // if does not exist then show start of conversation.
       if ($('#roomConvStartLbl').length == 0) {
        $('.live-chat-messages .force-overflow').prepend("<label id=roomConvStartLbl><strong> Start of conversation </strong></label><br>")
       }
       is_prev_msg = false
      }
     }
    } catch (err) {
     console.log(err);
     showErr(err)
    }
   });
  },
  groupingMessage = function(conversations, currentMsg, isNormalMsg) {
   if (currentMsg == 0)
    addCommonProperty(conversations[currentMsg]);
   else {
    let res = conversations[currentMsg - 1];
    //if(!('t' in res) && !('editedBy' in res) && !('urls' in res && res.urls[0].ignoreParse) && !("urls" in res && !("ignoreParse" in res.urls["0"])) && !(!('urls' in res) && ('attachments'in res))){
    if (res.u._id === conversations[currentMsg].u._id && isNormalMsg && !('t' in res) && !('editedBy' in res) && !('urls' in res && res.urls[0].ignoreParse) && !("urls" in res && !("ignoreParse" in res.urls["0"])) && !(!('urls' in res) && ('attachments' in res)) && isSameDay(conversations[currentMsg].ts.$date, res.ts.$date)) {
     let updatedata = {
      'groupingclass': 'msg-group-sec'
     };
     addCommonProperty(conversations[currentMsg], updatedata);
    } else {
     addCommonProperty(conversations[currentMsg])
    }
   }
   //}

  },
  loadHistoryProcessor = function(conversation) {
   //Display the room history conversations
   let isNormalMsg = false;
   if (conversation.messages.length) {
    for (let currentMsg = 0; currentMsg < conversation.messages.length; currentMsg++) {
     var res = conversation.messages[currentMsg],
      response = isDayFirstMsg(new Date(res.ts.$date));
     if (response) {
      addHistory({
       dayFirstMsg: response
      });
     }
     if ('t' in res) {
      var update_data = hasAddRemoveUser(res);
      addCommonProperty(res, update_data);
      isNormalMsg = false;
     } // t represent it've user add/remove/
     // else if ('editedBy' in res && "urls" in res && !("ignoreParse" in res.urls["0"]) && ("headers" in res.urls["0"]) && ('attachments'in res)){var update_data=hasReplyMsg(res);addCommonProperty(res,update_data);isNormalMsg=false;}
     else if ('editedBy' in res) {
      var update_data = hasMsgEdited(res);
      addCommonProperty(res, update_data);
      isNormalMsg = false;
     } //message is edited by user
     else if ('urls' in res && res.urls[0].ignoreParse) {
      var update_data = hasReplyMsg(res);
      addCommonProperty(res, update_data);
      isNormalMsg = false;
     } //message replied by user
     else if ("urls" in res && !("ignoreParse" in res.urls["0"]) && ("headers" in res.urls["0"])) {
      var update_data = hasMultipleURLs(res);
      addCommonProperty(res, update_data);
      isNormalMsg = false;
     } else if (!('urls' in res) && ('attachments' in res)) {
      let attachment_obj = res.attachments[0];
      attachment_obj.message_id = res._id;
      var update_data = hasAttachement(attachment_obj);
      addCommonProperty(res, update_data);
      isNormalMsg = false;
     } //message with image or video or files
     else {
      groupingMessage(conversation.messages, currentMsg, isNormalMsg = true);
     }
     chkRoomDateFlag(currentMsg, conversation);
    }
    var unread_value = checkUnreadStatus();
    if (conversation.isFromLoadHistory && unread_value) {
     if (unread_value > 10) {
      roomFirstUnread = conversation.messages[conversation.messages.length - unread_value];
     }
     setUnreadTag(conversation, unread_value);
    }
    return convHistory;
   }
  },
  chkRoomDateFlag = function(currentMsg, conversation) {
   // Load previous conversation check the room's string date

   if (currentMsg == conversation.messages.length - 1 && topMsgId) {
    let first_msg_timestamp = $('#' + topMsgId).data("timestamp"),
     res = conversation.messages[currentMsg];
    // Top string date label of room
    resp = strDateLabel(new Date(res.ts.$date), new Date(first_msg_timestamp));
    if (resp) {
     addHistory({
      dayFirstMsg: resp
     });
    }
   }
  },
  urlify = function(text) {
   var urlRegex = /(https?:\/\/[^\s]+)/g;
   return text.replace(urlRegex, function(url) {
    return '<a href="' + url + '"target=_blank>' + url + '</a>';
   })
   // or alternatively
   // return text.replace(urlRegex, '<a href="$1">$1</a>')
  },
  hasMultipleURLs = function(res) {
   let url_str = {};
   url_str['msg'] = '';
   // 0 th index have ignore parse. this is not URL. So this is omited
   for (let url = 0; url < res.urls.length; url++) {
    if (!("ignoreParse" in res.urls[url])) {
     // Check the ignore parse key for this is not reply message.
     let resp = hasURLs(res.urls[url]);
     url_str['msg_type'] = 'url'
     url_str['msg'] += '' + "<br>" + resp['msg'];
    }
   }
   if (res.msg.split(')')[1]) {
    res.msg = res.msg.split(')')[1]
   }
   url_str['msg'] = '<div id="url_text">' + urlify(res.msg) + '</div>' + url_str['msg'];
   return url_str;
  },
  hasURLs = function(res) {
   var obj = {};
   if ('meta' in res) {
    if (res.meta && res.meta.ogUrl && res.meta.ogImage && res.meta.description) {
     // Meta informations about the url.
     obj['msg'] = "<a class='img-des-anchor' href='" + res.meta.ogUrl + "' target='_blank'>" + "<img src='" + res.meta.ogImage + "'></a>" + "<div id='website' class=website_name>" + res.parsedUrl.hostname + "</div>" + "<div class='website-title'><a href='" + res.meta.ogUrl + "'target='_blank'><strong>" + res.meta.ogTitle + "</strong></a></div>" + "<div id='ogdescription'>" + res.meta.description + "</div>";
    } else if (res.meta && res.url && res.meta.ogImage && res.meta.description) {
     // Meta informations about the url.
     obj['msg'] = "<a class='img-des-anchor' href='" + res.url + "' target='_blank'>" + "<img src='" + res.meta.ogImage + "'></a>" + "<div id='website' class=website_name>" + res.parsedUrl.hostname + "</div>" + "<div class='website-title'><a href='" + res.url + "'target='_blank'><strong>" + res.meta.ogTitle + "</strong></a></div>" + "<div id='ogdescription'>" + res.meta.description + "</div>";
    } else if (res.meta && res.meta.ogUrl && res.meta.ogImage && res.meta.ogDescription) {
     // Meta informations about the url.
     obj['msg'] = "<a class='img-des-anchor' href='" + res.meta.ogUrl + "' target='_blank'>" + "<img src='" + res.meta.ogImage + "'></a>" + "<div id='website' class=website_name>" + res.parsedUrl.hostname + "</div>" + "<div class='website-title'><a href='" + res.meta.ogUrl + "'target='_blank'><strong>" + res.meta.ogTitle + "</strong></a></div>" + "<div id='ogdescription'>" + res.meta.ogDescription + "</div>";
    } else if (res.meta && res.meta.ogUrl && res.meta.ogImage && !(res.meta.ogDescription)) {
     // Meta informations about the url.
     obj['msg'] = "<a class='img-des-anchor' href='" + res.meta.ogUrl + "' target='_blank'>" + "<img src='" + res.meta.ogImage + "'></a>" + "<div id='website' class=website_name>" + res.parsedUrl.hostname + "</div>" + "<div class='website-title'><a href='" + res.meta.ogUrl + "'target='_blank'><strong>" + res.meta.ogTitle + "</strong></a></div>";
    } else if (res.meta && res.meta.ogUrl && !(res.meta.ogImage)) {
     obj['msg'] = "<a href='" + res.meta.ogUrl + "' target='_blank'>" + "<div id='website' class=website_name>" + res.parsedUrl.hostname + "</div>" + "<div class='website-title'><a href='" + res.meta.ogUrl + "'target='_blank'><strong>" + res.meta.ogTitle + "</strong></a></div>" + "<div id='ogdescription'>" + res.meta.description + "</div>";
    } else if (res.meta && !(res.meta.ogUrl) && res.meta.url) {
     obj['msg'] = "<div id='website' class=website_name>" + res.parsedUrl.hostname + "</div>" + "<div class='website-title'><a href='" + res.meta.url + "'target='_blank'><strong>" + res.meta.pageTitle + "</strong></a></div>";
    } else if (res.meta && !(res.meta.ogUrl) && !(res.meta.url) && res.meta.pageTitle) {
     obj['msg'] = "<div id='website' class=website_name>" + res.parsedUrl.hostname + "</div>" + "<div class='website-title'><a href='" + res.url + "'target='_blank'><strong>" + res.meta.pageTitle + "</strong></a></div>";
    } else {
     //Meta null for image URL.
     obj['msg'] = "<a href='" + res.url + "' target='_blank'>" + res.url + "</a><a href='" + res.url + "' target='_blank'><img src='" + res.url + "'></a>";
    }
   } else {
    // Reply msg for txt to url
    obj['msg'] = '' + res.url;
   }
   return obj;
  },
  formatUnreadSince = function(since_date) {
   // form the unread messages since date string.
   if ((since_date == null)) {
    return;
   }
   return moment(since_date).calendar(null, {
    sameDay: 'LT'
   });
  },
  setUnreadTag = function(res, unread_value) {
   var tag = {};
   tag['RoomUnreadTag'] = undefined;
   if (unread_value > 20) {
    var new_msg_since;
    if (unread_value > niaaconfig.roomHistoryLength) {
     let msg_since = formatUnreadSince(res.messages[0].ts.$date);
     new_msg_since = (unread_value + ' NEW MESSAGES SINCE ' + msg_since).toUpperCase();
    } else {
     msg_since = formatUnreadSince(res.messages[res.messages.length - (unread_value)].ts.$date);
     new_msg_since = (unread_value + ' NEW MESSAGES SINCE ' + msg_since).toUpperCase();
     //new_msg_since = unread_value+' NEW MESSAGES';
    }
    tag['RoomUnreadTag'] = '<div class="mark-read RoomUnreadTag mark_as_read_btn"><p>' + new_msg_since + '</p><a href="#" class="hvr-icon-wobble-vertical"><span id=bulk_msg_as_read>Mark as Read</span></a></div>'
   } else {
    tag['RoomUnreadTag'] = "<div class='un-read-msg RoomUnreadTag'><span>New Messages</span></div>";
    readMessage();
   }
   convHistory.splice(convHistory.length - unread_value, 0, tag);
  },
  setOpenedRoomUnreadTag = function(res) {
   currentRoomNewMsgCnt += 1;
   if (!($('.RoomUnreadTag').length) || currentRoomNewMsgCnt > 10) {
    var tag = {};
    tag['RoomUnreadTag'] = undefined;
    if (currentRoomNewMsgCnt > 10) {
     $('.RoomUnreadTag').removeClass('un-read-msg');
     $('.RoomUnreadTag').addClass('mark-read mark_as_read_btn');
     if ($('.RoomUnreadTag').find('a').length) {
      $('.RoomUnreadTag').find('a').remove();
     }
     $('.RoomUnreadTag').find('span').remove();
     $('.RoomUnreadTag').append('<a><span id=bulk_msg_as_read>Mark as Read</span></a>')
     // tag['RoomUnreadTag']='<div class="mark-read RoomUnreadTag mark_as_read_btn"><a><span>Mark as Read</span></a></div>'
    } else {
     tag['RoomUnreadTag'] = "<div class='un-read-msg RoomUnreadTag'><span>New Messages</span></div>";
    }
    $('.live-chat-messages .force-overflow').append(tag['RoomUnreadTag']);
   } else if (!($('.RoomUnreadTag').length)) {
    resetNewMsgLbl();
   }
   if ($('.RoomUnreadTag').length) {
    $('.new-messg').html(currentRoomNewMsgCnt + ' New Messages');
   }
  },
  checkUnreadStatus = function() {
   // Here have an one dependency.
   // RoomsInfo variable is accessed from util js. this is not a js module file.
   // So, this is a global variable.
   // this variable is userd for get the rooms unread information.
   var roomsObj = roomsInfo;
   var roomsObj = roomsObj[niaaroom.getCurrentRoomType()];
   var roomid = niaaroom.getCurrentRoom();
   // users id is join with sender and receiver users id.
   // so first check the selected room is user
   // if it is user the join and check the room order
   var res = (niaaroom.getCurrentRoomType() == 'user') ? (roomsObj.filter(obj => [niaauser.getuserid(), obj.id].sort().join("") === roomid)) : (roomsObj.filter(obj => obj.id === roomid))
   if (res && res.length) {
    if ((res[0].order != -1) && (res[0].order != -2) && (res[0].order != -0)) {
     return res[0].order;
    }
   }
  }

 // lbSlideCount = function(res){
 //   // Light box slide's count function
 //   if('message_id' in res){
 //     let image_obj={},slide_count = 1;
 //     if(topMsgId){
 //       if(light_box_image_list.length){
 //         let lb_first_index = (light_box_image_list.length != 0)?light_box_image_list[0]:1;
 //         slide_count= lb_first_index - load_history_img_cnt;
 //         lb_image_list.push(slide_count);
 //       }else{
 //         slide_count = -load_history_img_cnt;
 //         lb_image_list.push(slide_count);
 //       }
 //       load_history_img_cnt -=1;
 //     }
 //     else{
 //       if(light_box_image_list.length){
 //         slide_count=(light_box_image_list[light_box_image_list.length-1])+1;
 //       }
 //       light_box_image_list.push(slide_count);
 //     }
 //     image_obj.msg_id=res.message_id;
 //     image_obj.image_src=niaaconfig.rocketChatIP+res.title_link;
 //     image_obj.lb_image=slide_count;

 //     lb_image_src_list.push(image_obj);
 //     return slide_count;
 //   }
 // }
 hasAttachement = function(res) {
   var obj = [],
    msg_type, attachment_str = undefined,
    attachObj = res;
   if ('image_type' in attachObj) {
    // Light box.
    msg_type = 'image';
    // let slide_count = lbSlideCount(attachObj);
    attachment_str = '<div class=attachment><div class=attachment-title> \
    <a href='+location.protocol+'//' + window.location.hostname + attachObj.title_link + ' target=_blank><i class="fa fa-download"></i> ' + attachObj.title + '</a> </div>\
    <div class=attachment-image><figure><a href='+location.protocol+'//' + window.location.hostname + attachObj.title_link + ' data-fancybox="gallery" data-caption=' + attachObj.description + '> \
    <img src='+location.protocol+'//' + window.location.hostname + attachObj.title_link + ' alt="" /> </a> \
    <figcaption class=attachment-description>' + attachObj.description + '</figcaption></figure></div></div>';
   } else if ('video_type' in attachObj) {
    msg_type = 'video';
    attachment_str = '<div class=attachment><div class=attachment-title> \
    <a href='+location.protocol+'//' + window.location.hostname + attachObj.title_link + ' target=_blank><i class="fa fa-download"></i> ' + attachObj.title + '</a> </div>\
    <div class=attachment-video> <video controls height=150 width=500><source src='+location.protocol+'//' + window.location.hostname + attachObj.title_link + '</video></div> \
    <div class=attachment-description>' + attachObj.description + '</div></div>';
   } else if ('audio_type' in attachObj) {
    msg_type = 'audio';
    attachment_str = '<div class=attachment><div class=attachment-title> \
    <a href='+location.protocol+'//' + window.location.hostname + attachObj.title_link + ' target=_blank><i class="fa fa-download"></i> ' + attachObj.title + '</a> </div>\
    <div class=attachment-audio> <audio controls><source src='+location.protocol+'//' + window.location.hostname + attachObj.title_link + '</audio></div> \
    <div class=attachment-description>' + attachObj.description + '</div></div>';
   } else {
    msg_type = 'file';
    attachment_str = '<div class=attachment> <div class=attachment-title> \
    <a href='+location.protocol+'//' + window.location.hostname + attachObj.title_link + ' target=_blank><i class="fa fa-download"></i> ' + attachObj.title + '</a></div>\
    <div class=attachment-description>' + attachObj.description + '</div></div>'
   }
   obj['msg_type'] = msg_type;
   obj['msg'] = attachment_str;
   return obj;
  },
  setUserRole = function(res) {
   if (res.u._id == niaauser.getuserid()) {
    return true;
   }
   return false;
  },
  replyMsg = function(res) {
   let reply_msg = {};
   // Check the reply message from onchange or load hitory.
   if (res.urls && res.editedAt && res.attachments["0"].attachments.length && res.attachments["0"].attachments["0"].type && !(res.urls["0"].ignoreParse)) {
    let msgobj = hasMultipleURLs(res);
    reply_msg = msgobj;
    reply_msg.msg_type = 'reply_url'
   } else if (res.urls && res.editedAt && !(res.urls["0"].ignoreParse)) {
    let msgobj = hasMultipleURLs(res);
    reply_msg = msgobj;
    reply_msg.msg_type = 'reply_url'
   } else {
    reply_msg.msg_type = 'reply';
    if (res.msg.split(')')[1]) {
     // Onchange replay message.
     reply_msg.msg = res.msg.split(')')[1];
    } else {
     // Load history reply message.
     reply_msg.msg = res.msg;
    }
   }
   return reply_msg
  },
  baseMsg = function(res) {
   let base_msg;
   // Check the reply message from onchange or load hitory.
   if (res.attachments["0"].text.split(")")[1]) {
    // Split from URL to reply message
    base_msg = res.attachments["0"].text.split(")")[1];
   } else {
    // Load history reply message.
    base_msg = res.attachments["0"].text;
   }
   return base_msg
  },
  hasReplyMsg = function(res) {
   var obj = {},
    attachment_obj = undefined,
    base_msg = undefined,
    reply_msg = undefined,
    attach_resp = undefined,
    base_author_name = res.attachments[0].author_name,
    base_msg_time = findAmPmTimeFormat(new Date(res.attachments[0].ts.$date)),
    reply_msg_time = findAmPmTimeFormat(new Date(res.ts.$date));
   // Reply message for attachment
   if (res.attachments["0"].attachments.length && "title_link" in res.attachments["0"].attachments["0"]) {
    attachment_obj = res.attachments[0].attachments[0];
    attachment_obj.message_id = res._id;
    attach_resp = hasAttachement(attachment_obj);
    base_msg = attach_resp.msg;
   } else if ('urls' in res && 'ignoreParse' in res.urls["0"]) {
    base_msg = baseMsg(res);
   } else if ('urls' in res && !('ignoreParse' in res.urls["0"]) && !(res.attachments["0"].attachments.length) && res.editedAt) {
    base_msg = res.attachments["0"].text;
   } else if ('urls' in res && !('ignoreParse' in res.urls["0"]) && (res.attachments["0"].attachments.length) && res.editedAt) {
    base_msg = res.msg;
   }
   if (res.urls.length >= 2) {
    // Reply message is URL MSG => URL
    let urls_resp = hasMultipleURLs(res);
    reply_msg = urls_resp.msg;
    obj['msg_type'] = 'reply_url';
    // Remove the first recived text message
    checkPreviousURL(res);
   } else if (res.urls.length < 2) {
    // Normal text msg TXT => TXT
    let msgobject = replyMsg(res);
    reply_msg = msgobject.msg;
    obj['msg_type'] = msgobject.msg_type;
   }

   var final_reply_str = "<div class=pert-replay><img class=pert-img src="+location.protocol+"//" + window.location.hostname + "/niaa/avatar/" + base_author_name + "?_dc=undefined alt=''>" + "<span>" + base_author_name + "</span><span class=send-date-rlp>" + base_msg_time + "</span>" + "<p>" + base_msg + "</p></div><p class=reply-text>" + reply_msg + "</p>";

   // base_author_name+"<br>"+base_msg+"<br>"+base_msg_time+"<br><div class=attachment-flex>"+reply_msg+"</div>";
   obj['msg'] = final_reply_str;
   obj['ct'] = reply_msg_time;
   return obj;
  },
  hasMsgEdited = function(res) {
   var obj = {},
    editedText;
   if ("urls" in res && !("ignoreParse" in res.urls["0"]) && ("headers" in res.urls["0"]) && 'attachments' in res) {
    // Edited message have reply
    attachRes = hasReplyMsg(res);
    editedText = attachRes.msg;
    obj['msg_type'] = 'edit_' + attachRes['msg_type'];
   } else if ('urls' in res && 'ignoreParse' in res.urls["0"]) {
    // Edited message have reply
    attachRes = hasReplyMsg(res);
    editedText = attachRes.msg;
    obj['msg_type'] = 'edit_' + attachRes['msg_type'];
   } else if ("urls" in res && !("ignoreParse" in res.urls["0"]) && ("headers" in res.urls["0"])) {
    // Edited message have URL
    urlsResp = hasMultipleURLs(res);
    editedText = urlsResp.msg;
    obj['msg_type'] = 'edit_' + urlsResp['msg_type'];
   } else if ('attachments' in res) {
    //Edited message have attachment then
    let attachment_obj = res.attachments[0];
    attachment_obj.message_id = res._id;
    // Want to check
    attachRes = hasAttachement(attachment_obj);
    editedText = attachRes.msg;
    obj['msg_type'] = 'edit_' + attachRes['msg_type'];
   } else {
    editedText = res.msg
    obj['msg_type'] = 'edit_msg';
   }
   obj['isEdited'] = 'edited at ' + moment(res.editedAt.$date).format("lll") + ' by ' + res.editedBy.username;
   obj['msg'] = editedText;
   // "<i class='fa fa-pencil'> </i> <p title='"+new Date(res.editedAt.$date)+"'>"+"</p>"

   return obj
  },

  hasAddRemoveUser = function(res) {
   //user add or remove from the room
   var obj = {};
   if (res.t === 'au') {
    obj['msg'] = res.msg + ' is added by ' + res.u.username;
   } else if (res.t === 'ru') {
    obj['msg'] = res.msg + ' is removed by ' + res.u.username;
   } else if (res.t === 'uj') {
    obj['msg'] = res.msg + ' is joined in this room.';
   } else if (res.t === 'ul') {
    obj['msg'] = res.msg + ' is leaved from this room.';
   } else if (res.t === 'r') {
    obj['msg'] = 'Room name is changed to ' + res.msg;
   } else if (res.t === 'subscription-role-added') {
    obj['msg'] = res.msg + ' was set ' + res.role + ' by ' + res.u.username;
   } else if (res.t === 'subscription-role-removed') {
    obj['msg'] = res.msg + ' is no longer ' + res.role + ' by ' + res.u.username;
   }
   return obj;
  },
  addCommonProperty = function(data, update_data) {
   //ts = timestamp, rid = roomid, id=msg id, msg = text message,ct = convesation time with am / pm
   var res = {
    ts: data.ts.$date,
    rid: data.rid,
    mid: data._id,
    uname: data.u.username,
    uid: data.u._id,
    msg: data.msg,
    ct: findAmPmTimeFormat(new Date(data.ts.$date)),
    isOwner: setUserRole(data),
    avatar: '' + location.protocol+'//' + window.location.hostname + '/niaa/avatar/' + data.u.username + '?_dc=undefined',
    msg_type: 'msg',
    isEdited: undefined,
    groupingclass: undefined,
   };
   if (update_data) {
    res = Object.assign(res, update_data)
   }
   addHistory(res);
  },
  addHistory = function(data) {
   convHistory.push(data)
  },
  emptyConvHistory = function() {
   // Reset the html converations list for load new conversations.
   convHistory.length = 0;
  },
  strDateLabel = function(respTime, firstMsgTime) {
   if (respTime.getFullYear() === firstMsgTime.getFullYear() && respTime.getMonth() === firstMsgTime.getMonth() && respTime.getDate() === firstMsgTime.getDate()) {
    $('#roomTopStrDateLbl').remove();
   } else {
    let dateString = allMonth[firstMsgTime.getMonth()] + ' ' + firstMsgTime.getDate() + ' ' + firstMsgTime.getFullYear();
    return ("<label><strong>" + dateString + "</strong></label>")
   }
  },

  appendToLightBox = function() {
   for (let image_obj of lb_image_src_list) {
    $('.lightBoxImagesDiv').append("<div class=mySlides data-lb_image=" + image_obj.lb_image + " id=lb_img_" + image_obj.msg_id + "> <img src=https://" + image_obj.image_src + "> </div>")
   }
   lb_image_src_list = [];
   // Reset the image source list, after prepend.
  },
  prependToLightBox = function() {
   for (let image_obj of lb_image_src_list) {
    $('.lightBoxImagesDiv').prepend("<div class=mySlides data-lb_image=" + image_obj.lb_image + " id=lb_img_" + image_obj.msg_id + "> <img src=https://" + image_obj.image_src + "> </div>")
   }
   lb_image_src_list = [];
   // Reset the image source object, after prepend.
  },

  addImgToLightBox = function(image_count) {
   if (image_count) {
    if (topMsgId) {
     lb_image_src_list = lb_image_src_list.reverse();
     prependToLightBox();
     light_box_image_list = lb_image_list.concat(light_box_image_list);
     // Reset the Light box variables.
     lb_image_list = [];
     load_history_img_cnt = 0;
    } else {
     appendToLightBox();
    }
   }
  },

  findImagCountFn = function(res) {
   load_history_img_cnt = 0;
   // To count the load previous message history's images count for display in light box.
   if (res.messages.length) {
    //retrieved_imgs_count=0;
    for (let message of res.messages) {
     if ('attachments' in message && 'image_type' in message.attachments['0']) {
      load_history_img_cnt += 1;
     } else if ('attachments' in message && 'attachments' in message.attachments['0'] && message.attachments['0'].attachments.length && 'image_type' in message.attachments['0'].attachments['0']) {
      load_history_img_cnt += 1;
     }
    }
   }
   return load_history_img_cnt;
  },
  callLoadHistoryFn = function(current_room = niaaroom.getCurrentRoom(), conv_length = niaaconfig.roomHistoryLength, timestamp, user_name = niaauser.getusername()) {
   // Jump to recent messages.
   // jumpToMessage=false;
   // // Hide the jump to message notification.
   // $('#jump_to_msg_notify').css('display','none');
   resetJumpToRecentMsgLbl();
   let until_ts = '';
   if (timestamp) {
    until_ts = timestamp;
   } else {
    let current_timestamp = parseInt((new Date().getTime()) / 1000);
    until_ts = current_timestamp;
   }
   ddpLoadHistory(current_room, conv_length, until_ts, user_name);
  },
  resetJumpToRecentMsgLbl = function() {
   unreadJumpMsgCount = 0;
   // reset the new message count for jump to new msg label.
   jumpToMessage = false;
   // Hide the jump to message notification.
   $('.new-messg-recent').html('Jump to recent messages');
   $('#jump_to_msg_notify').css('display', 'none');
  },

  resetNewMsgLbl = function() {
   //Reset the new message label.
   currentRoomNewMsgCnt = 0
   $('.new-messg').html('New Messages');
   $('#focus_msg').css('display', 'none');
  },
  readMessage = function() {
   var $unread_lbl = $('.unread_msg_lbl');
   var current_room_id = niaaroom.getCurrentRoom()
   niaaddp.ddp_method("readMessages", [current_room_id], function() {
    //clear the unread  , mark as un read lables and button
    $unread_lbl.remove();
   });
  },
  subDeleteMsg = function(id, status) {
   // Delete message subscription for room.
   niaaddp.ddp_sub('stream-notify-room', [id + "/deleteMessage", status], function() {});
  };

 return {
  ddpLoadHistory: ddpLoadHistory,
  getIsNextMsg: getIsNextMsg,
  getIsPrevMsg: getIsPrevMsg,
  ddpLoadPrevMessages: ddpLoadPrevMessages,
  ddpLoadNextMessage: ddpLoadNextMessage,
  ddpSurroundingMessage: ddpSurroundingMessage,
  setIsFromScroll: setIsFromScroll,
  getConvHistory: getConvHistory,
  hasMsgEdited: hasMsgEdited,
  addCommonProperty: addCommonProperty,
  hasReplyMsg: hasReplyMsg,
  hasAttachement: hasAttachement,
  loadHistoryProcessor: loadHistoryProcessor,
  hasURLs: hasURLs,
  emptyConvHistory: emptyConvHistory,
  hasMultipleURLs: hasMultipleURLs,
  findImagCountFn: findImagCountFn,
  loadNextMsgFn: loadNextMsgFn,
  replyMsg: replyMsg,
  loadTLSearchFn: loadTLSearchFn,
  setOpenedRoomUnreadTag: setOpenedRoomUnreadTag,
  callLoadHistoryFn: callLoadHistoryFn,
  resetJumpToRecentMsgLbl: resetJumpToRecentMsgLbl,
  resetNewMsgLbl: resetNewMsgLbl,
  checkUnreadStatus: checkUnreadStatus,
  subDeleteMsg: subDeleteMsg,
  readMessage: readMessage,
  groupingMessage: groupingMessage,
 }
})