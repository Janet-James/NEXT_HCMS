define('room', ['ddp', 'user'], function(niaaddp, niaauser) {
 var publicroom = new Array(),
  privateroom = new Array(),
  chat_room_id = null, // this is current speeching room id
  typingUsers = [],
  roomDetail = [],
  room = {
   'user': [],
   'group': [],
   'channel': []
  },
  chat_room_type = null,
  convRoomsInfo = new Array(), // All rooms info from rooms/get
  tempRecentList = [], // Temp recent chat list.
  roomSuccessCount = 0,
  subscription_array = [],
  recentChatSpliceLength = 5,
  resetChatRoom = function() {
   chat_room_id = null;
  }
 getRoom = function() {
   return room
  },
  getCurrentRoomType = function() {
   return chat_room_type;
  },

  setCurrentRoom = function(room_id) {
   try {
    for (let chat_type in room) {
     let room_index = room[chat_type].findIndex(obj => obj._id == room_id);
     if (room_index != -1 && chat_type === 'user') {
      chat_room_id = [niaauser.getuserid(), room_id].sort().join("");
      chat_room_type = chat_type;
      break;
     } else if (room_index != -1) {
      chat_room_id = room_id;
      chat_room_type = chat_type;
      break;
     }
    }
//     let isRoomUpdated=false;

//     for (id in publicroom){
//     	if (publicroom[id]._id == room_id){
//     		chat_room_id = publicroom[id]._id;
//     		chat_room_type = 'channel';
//     		isRoomUpdated = true;
//     		break;
//     	}
//     }
//     for (id in privateroom){
//     	if (privateroom[id]._id == room_id){
//     		chat_room_id = privateroom[id]._id;
//     		chat_room_type = 'group';
//     		isRoomUpdated = true;
//     		break;
//     	}
//     }

//     if (isRoomUpdated == false){
//     	chat_room_id = [niaauser.getuserid(), room_id].sort().join("");
//     	chat_room_type = 'user';
//     	isRoomUpdated = true;
//     }
   } catch (err) {
    showErr(err)
   }
  },
  roomSubscription = function() {
   try {
    let current_room_id = getCurrentRoom()
    if (subscription_array.length == 0) {
     subscription_array.push(current_room_id);
     // niaaroom.setCurrentRoom(current_room_id);
     subStreamNotifyRoom(current_room_id);
     subStreamRoomMessage(current_room_id);
    } else if ((subscription_array.indexOf(current_room_id) == -1)) {
     subscription_array.push(current_room_id);
     // niaaroom.setCurrentRoom(current_room_id);
     subStreamNotifyRoom(current_room_id);
     subStreamRoomMessage(current_room_id);
    }
   } catch (err) {
    showErr(err)
   }
  },
  searchRoom = function(room_id) {
   // search the room. the given id is user/group/channel
   // if the id is founded then return room name and room type
   try {
    let rooms_info = getRoom(),
     uid = room_id.replace(niaauser.getuserid(), "")
    for (let chat_type in rooms_info) {
     let chat_rooms = rooms_info[chat_type],
      room_obj = chat_rooms.find(room => room._id === uid);
     if (room_obj) {
      return (chat_type == 'user') ? {
       type: chat_type,
       name: room_obj.username,
       rid: uid,
       status: room_obj.status
      } : {
       type: chat_type,
       name: room_obj.name,
       rid: room_obj._id
      };
     }

    }
    console.log('')

    // 		for (id in publicroom){
    // 			if (publicroom[id]._id == room_id){
    // 				return {type:'channel',name:publicroom[id].name,rid:room_id};
    // 			}
    // 		}
    // 		for (id in privateroom){
    // 			if (privateroom[id]._id == room_id){
    // 				return {type:'group',name:privateroom[id].name,rid:room_id};
    // 			}
    // 		}

    // 		// remove the another user from merged user id
    // 		let uid = room_id.replace(niaauser.getuserid(), ""),
    // 		// find the user name in getRoom().user object
    // 		resp = getRoom().user.filter(obj=> obj._id == uid);
    // 		return {type:'user',name:resp[0].username, rid:uid,status:resp[0].status};

   } catch (err) {
    showErr(err)
   }
  },
  getCurrentRoom = function() {
   return chat_room_id;
  },
  showRoomInfo = function(response) {
   try {
    //Empty the div before append the user and group lists
    $niaahtml.channels.empty();
    $niaahtml.groups.empty();
    for (let current_room of response) {
     if (current_room.t == 'c') {
      publicroom.push(current_room);
      addRoom(current_room, 'channel');
     } else if (current_room.t == 'p') {
      privateroom.push(current_room);
      addRoom(current_room, 'group')
     }
    }
    loadRoomInfo(1);
    callRecentChatCounter(1);
   } catch (err) {
    showErr(err)
   }
  },
  getRoomsInfo = function() {
   try {
    niaaddp.ddp_method("rooms/get", [, {
     "$date": (new Date().getTime()) / 1000
    }], function(err, res) {
     if (res) {
      showRoomInfo(res);
      //Remove the empty objects in the room info array
      convRoomsInfo = res.filter(value => Object.keys(value).length !== 0);
     } else {
      showErr(err.message)
     }
    });
   } catch (err) {
    showErr(err)
   }
  },

  getDirectRooms = function() {
   try {
    $.ajax({
     method: 'GET',
     headers: {
      'X-Auth-Token': niaauser.getauthtoken(),
      'X-User-Id': niaauser.getuserid()
     },
     url: userListURL,
     success: function(response, data) {
      if (data == 'success') {
       //Initialize the global varialbe
       usersList = response;
       // $niaahtml.users.empty();
       //list_users(response);
       for (let current_room of response.users) {
        // room['user'].push(current_room);
        addRoom(current_room, 'user');
       }
      }
      loadRoomInfo(1);
      callRecentChatCounter(1);
     },
     error: function(response, data) {
      showErr(response.responseJSON.message)
     }
    });
   } catch (err) {
    showErr(err)
   }
  },
  subStreamRoomMessage = function(id) {
   niaaddp.ddp_sub('stream-room-messages', [id, false], function(err, res) {});
  },
  subStreamNotifyRoom = function(id) {
   niaaddp.ddp_sub('stream-notify-room', [id + '/typing', false], function() {});
  },
  showUsersList = function(res, $div) {
   try {
    // retrive the user status from room Object.
    let group_users_html = " <p class='no-online'>No online users</p>";
    res.records = ignoreUserMention(res.records);
    // Ignore current login user.
    if (res && res.records && res.records.length) {
     let room_type = getCurrentRoomType(),
      room_info = getRoom(),
      current_room = getCurrentRoom(),
      room_obj;

     if (room_type === "group") {
      room_obj = room_info.group.filter(obj => obj._id == current_room);
     }
     /*else if(room_type==="channel"&&!room_obj){
					// if already room obeject is defined then no need to check the channel.
					room_obj=room_info.channel.filter(obj => obj._id==current_room);
				}if(room_obj&&room_obj[0].u._id===niaauser.getuserid()){
					// If room object is defined get the admin details.
					res.admin=true;
				}*/
     for (let user of res.records) {
      let room_obj = room_info.user.filter(obj => obj._id == user._id)
      user.status = room_obj[0].status;
     }
     if (res.all_room)
      groupMemberList = res.records;
     group_users_html = Handlebars.templates.group_users(res);
    }
    $div.html(group_users_html);
   } catch (err) {
    showErr(err)
   }
  },
  ddpGetUsersOfRoom = function(roomobj, status, call_back_fn, $div) {
   niaaddp.ddp_method("getUsersOfRoom", [roomobj.current_room_id, status], function(err, res) {
    try {
     if (err)
      throw err;
     res.admin = roomobj.is_admin;
     res.all_room = status;
     return call_back_fn(res, $div)
    } catch (err) {
     console.log(err);
     showErr(err)
    }
   });
  },
  showAllGroupUsers = function($div, roomobj, status) {
   try {
    ddpGetUsersOfRoom(roomobj, status, showUsersList, $div);
   } catch (err) {
    showErr(err)
   }
  },
  /*	// Want to check after remove
	showOnlineGruopUsers = function ($div, id, status){
		niaaddp.ddp_method("getUsersOfRoom", [id, status], function(err, res){
			if (res){
				var html = Handlebars.templates.group_members(res);
				$div.html(html);
			}
			else{
				showErr(err.message)
			}
		});
	},*/
  removeChatBoxMsg = function(msg_id) {
   let $deleted_msg = $('.message-data').filter("li[id=" + msg_id + "]");
   if ($deleted_msg.length) {
    if (!($('.live-chat-messages li#' + msg_id).hasClass('msg-group-sec')) && $('.live-chat-messages li#' + msg_id).next('li').hasClass('msg-group-sec')) {
     $('.live-chat-messages li#' + msg_id).next('li').find('.send-name').css('display', 'block');
     $('.live-chat-messages li#' + msg_id).next('li').find('img').css('display', 'block');
     $('.live-chat-messages li#' + msg_id).next('li').removeClass('msg-group-sec');
    }
    //while($deleted_msg.prev("div").length && $deleted_msg.after("div").length){
    // Date string or unread flags removing.
    if ($deleted_msg.prev("div").length && $deleted_msg.next("div").length) {
     $deleted_msg.prev("div").remove();
    } // single message after date string.
    else if ($deleted_msg.prev("div").length && $deleted_msg.next("li").length) {} // Day's first message.
    else {
     $deleted_msg.prev("div").remove();
     todaysDateFlag = true;
    }
    // room's last message.
    // Delete the message from chat box li.
    $deleted_msg.remove();
   }
  },
  usertyping = function(typingUsers) {
   if (typingUsers.length == 1) {
    $('.user_typing_name').append(typingUsers);
    $('.user_typing_context').append(" is typing...");
   } else if (typingUsers.length > 1) {
    let user_join = '';
    if (typingUsers.length <= 2) {
     user_join = typingUsers.join(", ");
    }
    if (typingUsers.length > 2) {
     user_join = typingUsers.slice(0, 2).join(",") + ' and ' + (typingUsers.length - 2).toString() + ' more ';
    }
    $('.user_typing_name').append(user_join);
    $('.user_typing_context').append(" are also typing...");
   }
  },
  usertypingremoving = function() {
   let current_room_type = getCurrentRoomType();
   if (current_room_type == 'user') {
    $('.user_typing_context').empty();
   } else if (current_room_type == 'channel' || current_room_type == 'group') {
    $('.user_typing_name').empty();
    $('.user_typing_context').empty();
   }
  },
  onChangeRoom = function(res) {
   try {
    if (res.collection == "stream-notify-room" && res.fields.eventName == getCurrentRoom() + "/deleteMessage") {
     // delete message notification.
     let msg_id = res.fields.args[0]._id;
     removeChatBoxMsg(msg_id);
     // Remove the deleted message from chat box.
     // Update the timeline when delete a message.
     let msg_index = roomMsgIndex(msg_id);
     roomsHistory.messages.splice(msg_index, 1);
     displayTimeLine(roomsHistory);
     deleteLBImage(msg_id);
     // Delete image from light box div.
    } else if (res.collection == "stream-notify-room") {
     //if the user is type now
     if (res.fields.eventName.split('/')[0].includes(getCurrentRoom())) {
      if (res.fields.args[1] == true) {
       if (typingUsers.length == 0) {
        typingUsers.push(res.fields.args[0])
        //push the users name into lists when the list is empty
       } else {
        if ((typingUsers.indexOf(res.fields.args[0]) > -1) != true) {
         typingUsers.push(res.fields.args[0])
         //push the users name into lists
        }
       }

       usertypingremoving()
       if (getCurrentRoomType() == 'user') {
        // $('.live-chat-messages').append('<div class="user_typing_div"></div>');
        $('.user_typing_context').append(" is typing...");
       } else if (getCurrentRoomType() == 'channel' || getCurrentRoomType() == 'group') {
        usertyping(typingUsers);
       }
      } //this is called when the user is STOP typing.
      else if (res.fields.args[1] == false) {
       // Typing false then remove the user from list.
       if (jQuery.inArray(res.fields.args[0], typingUsers) !== -1) {
        typingUsers.splice(typingUsers.indexOf(res.fields.args[0]), 1);
       }
       if (typingUsers.length != 0) {
        // Empty the typing div for append updated users.
        if (getCurrentRoomType() == 'channel' || getCurrentRoomType() == 'group') {
         // $('.user_typing_div').html('');
         // $('.user_typing_div').append(typingUsers + " is typing...</br>");
         usertypingremoving();
         usertyping(typingUsers);
        }
       } else if (typingUsers.length == 0) {
        // Typing user list is empty then remove the typing div.
        usertypingremoving();
       }
      }
     }

    }
   } catch (err) {
    showErr(err)
   }

  },
  onchange = function(res) {
   try {
    if (res.collection == "stream-room-messages") {
     // this is called when the user receive a message with room subscriptions
     if (res.fields.args.length && res.fields.args[0].t) {
      //userAddedinRoom(res);
      roomsChangedMsgs(res);
      // User Add, remove, set owner events.
     } else {
      setRecentChat(res.fields.args[0]);
      // if No room opened then update temp list.
      if (!chat_room_id)
       setTempRecentList(recentChatList);
     }
    }
    if (res.collection == "stream-notify-user" && res.fields.args.length && res.fields.args[0] == 'inserted') {
     // Add room to the room object.

     if (res.fields.args[1].t == 'c') {
      addRoom(res.fields.args[1], 'channel');
     } else if (res.fields.args[1].t == 'p') {
      addRoom(res.fields.args[1], 'group');
     }
    }
    if (res.collection == "stream-notify-user") {
     // this is called when the user receive a message without room subscriptions
     if ('lastMessage' in res.fields.args[1]) {
      let rid = res.fields.args[1]._id;
      if (subscription_array.indexOf(rid) == -1) {
       // search the room name and type based on the rid
       let room_obj = searchRoom(rid), // update the recent chat with the new entry
        recent_chat_list = updateRecentChat(room_obj);
       callShowRecentChat();
       //setRecentChat(res.fields.args[1].lastMessage);
      }
     } // Update the recent chat when hide room.
     else if (res.fields.args["0"] == "updated" && 'open' in res.fields.args[1]) {
      let rid = res.fields.args[1].rid;
      rid = (rid).replace(niaauser.getuserid(), '');
      if (!res.fields.args[1].open && hideRoomList.indexOf(rid) == -1) {
       hideRoomList.push(rid);
       callShowRecentChat();
      } else if (res.fields.args[1].open && hideRoomList.indexOf(rid) != -1) {
       // Remove the room from hiden room list.
       hideRoomList.splice(hideRoomList.indexOf(rid), 1);
      }
      //showRecentChat(recentChatList,"cm_menu-0");
     }
    }
    /*else if (res.collection == "stream-room-messages" && res.fields.args.length && res.fields.args[0].t == 'ru'){
	        	userRemovedinRoom(res);
	     	}*/
    else if (res.collection == "stream-notify-room") {
     onChangeRoom(res);
    } else if (res.collection == 'users') {
     onchangeUserStatus(res);
    }
   } catch (err) {
    showErr(err)
   }
  },
  callShowRecentChat = function() {
   try {
    if (getCurrentRoom()) { // If room opened then display the temp recent list, with selected item.
     // enable this to display recent chat cuncurrently.
     // showRecentChat(tempRecentList,"cm_menu-0");
    } else {
     showRecentChat(recentChatList);
    }
   } catch (err) {
    showErr(err)
   }
  },
  setInitRecentChat = function(res) {
   // set the recent chat while user login.
   // this function is called after rest and real time user login
   niaaddp.ddp_method("rooms/get", [, {
    "$date": (new Date().getTime()) / 1000
   }], function(err, res) {
    if (res) {
     // collect the rooms detail
     // this is contain name,id,type and last message timestamp
     recentChatList = collectRoomsLastMessage(res);
     // sort the room based on last message receive time in descending order
     sortRecentChat(recentChatList);
     // And finally display the recent chat
     showRecentChat(recentChatList);
     // update the temp recent chat list.
     setTempRecentList(recentChatList);
    }
   });
  },
  sortRecentChat = function(res) {
   res.sort(function(x, y) {
    return y.lmt - x.lmt;
   })
  },
  collectRoomsLastMessage = function(res) {
   for (i of res) {
    // check the lastMessage is the given resp
    if (('lastMessage' in i) && (i.lastMessage != null)) {
     // push the room object in co
     if (i.t == 'c') {
      recentChatList.push({
       name: i.name,
       type: 'channel',
       rid: i._id,
       lmt: i.lastMessage.ts.$date,
      })
     } else if (i.t == 'p') {
      recentChatList.push({
       name: i.name,
       type: 'group',
       rid: i._id,
       lmt: i.lastMessage.ts.$date
      })
     } else {
      for (j of room['user']) {
       var user_resp = searchRoom(i._id)
       if (user_resp && j._id == user_resp.rid) {
        recentChatList.push({
         name: user_resp.name,
         type: 'user',
         rid: user_resp.rid,
         lmt: i.lastMessage.ts.$date,
         status: j.status
        })
       }
      }
     }
    }
   }
   return recentChatList;
  },
  setRecentChat = function(res) {
   try {
    var obj = {},
     rid = res.rid;
    // search the room name and type based on the rid
    var roomResp = searchRoom(rid);
    // for the room object
    // this is contain the name, type and rid
    var obj = {
     rid: roomResp.rid,
     name: roomResp.name,
     type: roomResp.type
    };
    // update the recent chat with the new entry
    var data = updateRecentChat(obj);
    // If check for remove room from hiden room list.
    if (hideRoomList.indexOf(roomResp.rid) != -1) {
     // Remove the room from hiden room list.
     hideRoomList.splice(hideRoomList.indexOf(roomResp.rid), 1);
     //removeArrayElem(, msgObj.fields.args["0"].rid);
    }
    // and show the recent chat
    // showRecentChat(data)
    callShowRecentChat();
   } catch (err) {
    showErr(err)
   }
  },
  updateRecentChat = function(res) {
   try {
    // check the list is empty or not
    // list is empty means no recent chat avail
    if (recentChatList.length == 0) {
     // if its empty the insert element only first time
     recentChatList.push(res);
    } else {
     // if list does not empty then find room is alredy exist in list
     var chatIndex = recentChatList.findIndex(obj => (obj.rid == res.rid))
     // chatIndex is -1, the room is does not exist
     // then insert the new room at first
     if (chatIndex == -1) {
      recentChatList.unshift(res);
     } else {
      // if room is already exisit then remove the room
      // and insert that room at first
      recentChatList.splice(chatIndex, 1);
      recentChatList.unshift(res);
     }
    }
    return recentChatList;
   } catch (err) {
    showErr(err)
   }
  },
  /************************* Update temp recent chat list  ****************************/
  setTempRecentList = function(recent_chat_list) {
   // Assign the recent chat list value into temproray recent chat list.
   // Reset the temp list value.
   tempRecentList.length = 0;
   // Assign the recent list value into temp list.
   tempRecentList = Array.from(recent_chat_list);
  },

  updateTmpRecentChatList = function(current_room_id) {
   try {
    // check the current room in temp recent chat list index.
    let temp_index = tempRecentList.findIndex(obj => (obj.rid == current_room_id));
    if (temp_index != -1) {
     if (temp_index != 0) {
      // Ensure the current room not in first element of array.
      let room_obj = tempRecentList.splice(temp_index, 1)[0];
      tempRecentList.unshift(room_obj);
     }
    } else {
     // search the room name and type based on the rid
     let roomResp = searchRoom(current_room_id);
     // set opened room as first of temp array.
     tempRecentList.unshift(roomResp);
    }
    return tempRecentList;
    //showRecentChat(tempRecentList, 'cm_menu-0');
   } catch (err) {
    showErr(err)
   }
  },

  tempRecentChat = function(room_id) {
   try {
    // Form the temprary recent list when open room.
    // ensure the opened room in recent list or not.
    let recent_list = updateTmpRecentChatList(room_id);
    // Show the temp recent chat list.
    showRecentChat(recent_list, 'cm_menu-0');
   } catch (err) {
    showErr(err)
   }
  },
  recentChatData = function(res) {
   // Form the recent chat recent data.
   var count = 1,
    DATA = [];

   for (let roomObj of res) {
    // if check for avoid the hiden rooms in recent list.
    if ((hideRoomList.indexOf(roomObj.rid) == -1) && (count <= recentChatSpliceLength)) {
     let room_type, status = '';
     if (roomObj.type === 'channel')
      room_type = 'chatChannel';
     if (roomObj.type === 'group')
      room_type = 'chatGroup';
     if (roomObj.type === 'user') {
      room_type = 'chatUser';
      status = roomObj.status;
     }
     DATA.push({
      label: roomObj.name,
      url: 'cm_menu-' + (count - 1),
      status: status,
      class: room_type,
      rid: roomObj.rid,
     });
     count += 1;
    }
   }
   return DATA;
  },
  showRecentChat = function(res, selectOpt) {
   try {
    // Show the  recent chat room
    $niaahtml.recentChat.empty();
    let DATA = recentChatData(res);
    if (selectOpt)
     CircleMenu($('#my-circle-menu'), DATA, selectOpt);
    else
     CircleMenu($('#my-circle-menu'), DATA);

    // want to remove.
    //$('#item-0').click();
    //$('#sidebarCollapse1').click();
    //$('#msg_search_txt').val('as');

   } catch (err) {
    showErr(err)
   }
  },
  spliceRecentList = function(res) {
   return res.splice(recentChatSpliceLength, res.length, 1);
  },
  onchangeUserStatus = function(res) {
   // inform user status when changed
   try {
    if (res.collection == 'users') {
     // online away busy
     if (niaauser.getuserid() != res.id) {
      var user_id = res.id;
      var userIndex = room.user.findIndex(obj => obj._id == res.id)
      room.user[userIndex].status = res.fields.status;
     }
     carouselUserStatus(res)
     cmenuOnChangeStatus(res)
     recentChatStatus(res, recentChatList);
     recentChatStatus(res, tempRecentList);
    }
   } catch (err) {
    showErr(err)
   }
  },
  logged_event_handler = function() {
   getRoomsInfo();
   niaaddp.ddp_sub('stream-notify-user', [niaauser.getuserid() + '/message', false]);
   niaaddp.ddp_sub('userData', []);
   niaaddp.ddp_sub('activeUsers', []);
   niaaddp.ddp_sub('stream-notify-user', [niaauser.getuserid() + '/subscriptions-changed', false]);
   niaaddp.ddp_sub("stream-notify-user", [niaauser.getuserid() + '/rooms-changed', {
    useCollection: false,
    args: []
   }])
   niaaddp.ddp_method('getUserRoles', [], function() {});
   niaaddp.ddp_on_added();
   niaaddp.ddp_on_removed();
   niaaddp.socket_close();
  },

  logged_event_obj = {
   logged_event_handler: logged_event_handler
  }

 niaauser.user_add_logged_event_handler(logged_event_obj);

 room_ddp_event_interface = {
  onchange: onchange
 }

 niaaddp.ddp_add_interface(room_ddp_event_interface);

 rest_logged_event_handler = function() {
  getDirectRooms();
 }
 rest_logged_event_handler_obj = {
  rest_logged_event_handler: rest_logged_event_handler
 }
 niaauser.rest_loggedin_notify(rest_logged_event_handler_obj)

 roomsChangedMsgs = function(res) {
   // Like add user, remove user set admin room change events.
   let event_list = [],
    rooms_change_event = {
     au: ' added by ',
     ru: ' removed by ',
    },
    msgObj = res.fields.args[0],
    event_msg = msgObj.msg,
    done_by = msgObj.u.username,
    msg = '';
   if (msgObj.t === 'subscription-role-added' || msgObj.t === 'subscription-role-removed') {
    // User role change event.
    msg = event_msg + ((msgObj.t === 'subscription-role-added') ? ' was set  ' + msgObj.role + ' by ' : ' is no longer ' + msgObj.role + ' by ') + done_by;
   } else {
    msg = event_msg + rooms_change_event[res.fields.args[0].t] + done_by;
   }
   res = {
    ts: msgObj.ts.$date,
    rid: msgObj.rid,
    mid: msgObj._id,
    uname: msgObj.u.username,
    uid: msgObj.u._id,
    msg: msg,
    ct: findAmPmTimeFormat(new Date(msgObj.ts.$date)),
    isOwner: 0,
    avatar: '' + location.protocol+'//' + window.location.hostname + '/niaa/avatar/' + msgObj.u.username + '?_dc=undefined',
   };

   event_list.push(res);
   appendChatMessages(event_list);
  },
  /*userAddedinRoom = function(res){
		var add_user =[],
		msgObj = res.fields.args[0],
		addedUser = msgObj.msg,
		addedBy = msgObj.u.username,
		msg = addedUser+' added by '+addedBy,
		res = { ts:msgObj.ts.$date,
				rid:msgObj.rid,
				mid:msgObj._id,
				uname:msgObj.u.username,
				uid:msgObj.u._id,
				msg:msg,
				ct:findAmPmTimeFormat(new Date(msgObj.ts.$date)),
				isOwner:0,
				avatar:''+'https://'+niaaconfig.rocketChatIP+'/avatar/'+msgObj.u.username+'?_dc=undefined',
		};
		add_user.push(res);
		appendChatMessages(add_user);
	},
	userRemovedinRoom = function(res){
		var remove_user =[],
        msgObj = res.fields.args[0],
        removedUser = msgObj.msg,
        removedBy = msgObj.u.username,
        msg = removedUser+' removed by '+removedBy,
        res = {   ts:msgObj.ts.$date,
                      rid:msgObj.rid,
                      mid:msgObj._id,
                      uname:msgObj.u.username,
                      uid:msgObj.u._id,
                      msg:msg,
                      ct:findAmPmTimeFormat(new Date(msgObj.ts.$date)),
                      isOwner:0,
                      avatar:''+'https://'+niaaconfig.rocketChatIP+'/avatar/'+msgObj.u.username+'?_dc=undefined',
                  };
        remove_user.push(res);
        appendChatMessages(remove_user);
	},*/
  userMention = function(text, status, id) {
   try {
    niaaddp.ddp_method("spotlight", [text, [], {
     "users": status
    }, id], function(err, res) {
     if (res) {
      $('.usermentiondiv').show();
      if (ignoreUserMention(res.users).length) {
       $niaahtml.usermention.empty();
       var html = Handlebars.templates.usersmention({
        'usermention': ignoreUserMention(res.users)
       });
       $niaahtml.usermention.append(html);
      } else {
       $niaahtml.usermention.empty();
       $niaahtml.usermention.append("<div class=no-result-sec><img src=/static/niaa/assets/images/noresult.png></div>");
      }
     } else {
      showErr(err.message)
     }
    });
   } catch (err) {
    showErr(err)
   }
  },

  userAdded = function(resp) {
   // user added function called at two case
   // 1.i am login 2. new user is create
   try {
    // if the user is new user the add to room obj, and call create direct message and write in HTML.
    if (hasRoom(room['user'], resp.fields.username)) {
     var user = {};
     user['name'] = resp.fields.name;
     user['status'] = resp.fields.status;
     user['username'] = resp.fields.username;
     user['utcOffset'] = resp.fields.utcOffset;
     user['_id'] = resp.id;
     addRoom(user, 'user');
     // the below code is commented. because this is arsie the issue in recent chat
     // create direct message real time api is create an response via stream-notify-user rooms-changed

     // createDirectMessage(user['name']);
     // $niaahtml.users.append('<button type="button" class = "chatUser" id='+user['_id']+'>'+user['username']+'<span id = user-status-lbl > '+user['status']+'</span></button> <br>' )
    } // else if he is exisiting one then check he in html
    // if he is HTML the update the status
    // Note: the reason of else check is while i am login in niaa, this function is hitted multiple times until the number of online users in rocket chat
    else if (resp.id) {
     var userIndex = room.user.findIndex(obj => obj._id == resp.id)
     room.user[userIndex].status = resp.fields.status;
     carouselUserStatus(resp)
     cmenuOnChangeStatus(resp)
     recentChatStatus(resp, recentChatList);
     recentChatStatus(resp, tempRecentList);
    }
   } catch (err) {
    showErr(err)
   }
  },
  userRemoved = function(resp) {
   // When user goes offline it will called by ddp and update the user
   try {
    if (resp.collection == 'users') {
     var userIndex = room.user.findIndex(obj => obj._id == resp.id)
     room.user[userIndex].status = 'offline';
     carouselUserStatus(resp)
     cmenuOnChangeStatus(resp)
     recentChatStatus(resp, recentChatList);
     recentChatStatus(resp, tempRecentList);
    }
   } catch (err) {
    showErr(err)
   }
  },

  addRoom = function(resp, key) {
   if (key == 'user') {
    // find the usename from array of objects
    // this is check the user is aleady exist or not
    if (room[key].findIndex(obj => obj.username == resp.username) === -1) {
     room[key].push(resp);
    }
   } else {
    //find the username from array of objects
    if (room[key].findIndex(obj => obj.name == resp.name) === -1) {
     room[key].push(resp);
     subscriptions_get2();
    }
   }
  }
 removeRoomFromList = function(rid) {
  //Remove the user from the recent, Temp-recent, hiden list when user removed from group or deleted from
  let recent_list = [];
  chat_room_id ? recent_list = tempRecentList : recent_list = recentChatList;
  // Check the removed chat in room Object.
  let recent_index = recentChatList.findIndex(obj => obj.rid == rid),
   temp_index = tempRecentList.findIndex(obj => obj.rid == rid),
   hide_index = hideRoomList.findIndex(obj => obj.rid == rid);
  // Remove the chat from Room Object.
  if (recent_index != -1)
   recentChatList.splice(recent_index, 1);
  if (temp_index != -1)
   tempRecentList.splice(temp_index, 1);
  if (hide_index != -1)
   hideRoomList.splice(hide_index, 1);

  let recent_data = recentChatData(recent_list);
  if (hide_index == -1) {
   // Removed room in hiden list then no need to update circular menu.
   if (!chat_room_id) {
    // No room opened.
    CircleMenu($('#my-circle-menu'), recent_data);
   } else {
    if (chat_room_id.includes(rid)) {
     // Opened room is removed then update the circle menu.
     CircleMenu($('#my-circle-menu'), recent_data);
     $('#cm_selected_item').css('display', 'none');
    } else {
     showRecentChat(tempRecentList, "cm_menu-0");
    }
   }
  }
 }
 removeRoom = function(resp, key) {
  // Update the removed room info to Global variables.

  if (key == 'user') {
   // find the usename from array of objects
   // this is check the user is aleady exist or not
   let room_index = room[key].findIndex(obj => obj._id == resp);
   if (room_index != -1) {
    room[key].splice(room_index, 1);
    removeRoomFromList(resp);
   }
  } else {
   //find the username from array of objects
   let room_index = room[key].findIndex(obj => obj._id == resp);
   if (room_index != -1) {
    room[key].splice(room_index, 1);
    removeRoomFromList(resp);
   }
  }
 }

 hasRoom = function(ary, uname) {
  if (ary.findIndex(cobj => cobj.username == uname) === -1) {
   return true;
  }
  return false;
 }
 //send the create direct message with username
 //for newly created users only send the message or load the histry after pass create direct message

 // this function repeated. another function in loadHistory modue
 createDirectMessage = function(username) {
  // first send the create direct meesage for new user
  niaaddp.ddp_method("createDirectMessage", [username], function(err, res) {
   if (res) {}
  });
 }
 ddpHideRoom = function(room_id) {
  try {
   niaaddp.ddp_method('hideRoom', [room_id], function(err, res) {
    if (res) {
     if (chat_room_id) {
      showRecentChat(tempRecentList, "cm_menu-0");
     } else {
      showRecentChat(recentChatList);
     }
     console.log('HideRoom : ' + room_id + res);
    } else if (err)
     throw err
   });
  } catch (err) {
   showErr(err)
  }
 }
 ddpOpenRoom = function(room_id) {
  try {
   niaaddp.ddp_method('openRoom', [room_id], function(err, res) {
    if (res) { //showErr('Room :'+room_id +' '+res);
    } else if (err)
     throw err
   });
  } catch (err) {
   showErr(err)
  }
 }
 $(document).on("contextmenu", '.cm-items li', function(event) {
  // Right click for the circular menu.
  event.preventDefault();
  $('.custom-menu').hide();
  // Show contextmenu
  $(this).find('.custom-menu:hidden').show().find('.hideRoomBtn').off().on('click', function(event) {
   //Hide the room in user list.
   try {
    event.preventDefault();
    event.stopPropagation();
    let room_id = $(this).parents('.cm-item').data('room_id');
    //$(this).parent().attr('id');
    if ($(this).parents('.cm-item').find('.chatUser').length) {
     room_id = [niaauser.getuserid(), room_id].sort().join("");
    }
    ddpHideRoom(room_id);
   } catch (err) {
    showErr(err)
   }
  });
 });

 deleteLBImage = function(msg_id) {
  // Delete image tag from light box div.
  let $lb_image_div = $("#lb_img_" + msg_id);
  lb_image = $lb_image_div.data("lb_image");
  if (lb_image) {
   $lb_image_div.remove();
   light_box_image_list.splice(light_box_image_list.indexOf(lb_image), 1);
   // Remove the deleted lightbox image's value in light_box_image_list
  }
 }

 $(document).on('click', '.usermention_close', function() {
  $(".usermentiondiv").hide();
 });

 cmenuOnChangeStatus = function(res) {
  // user status on change for recent chat.
  if (res.id != 'rocket.cat' && $('#my-circle-menu').find('li[data-room_id=' + res.id + ']').length) {
   if (res.msg == "changed") {
    if (res.fields.status == 'away') {
     $('#my-circle-menu').find('li[data-room_id=' + res.id + ']')["0"].children["0"].children[1].className = 'away-clr mem-cir-img';
     if (getCurrentRoom() && getCurrentRoom().includes(res.id))
      $('#my-circle-menu').find('.cm-selected-label').children()["0"].className = 'away-clr mem-cir-img';
    } else if (res.fields.status == 'online') {
     $('#my-circle-menu').find('li[data-room_id=' + res.id + ']')["0"].children["0"].children[1].className = 'active-clr mem-cir-img';
     if (getCurrentRoom() && getCurrentRoom().includes(res.id))
      $('#my-circle-menu').find('.cm-selected-label').children()["0"].className = 'active-clr mem-cir-img';
    } else if (res.fields.status == 'busy') {
     $('#my-circle-menu').find('li[data-room_id=' + res.id + ']')["0"].children["0"].children[1].className = 'offline-clr mem-cir-img';
     if (getCurrentRoom() && getCurrentRoom().includes(res.id))
      $('#my-circle-menu').find('.cm-selected-label').children()["0"].className = 'offline-clr mem-cir-img';
    }
   } else if (res.msg == 'added') {
    $('#my-circle-menu').find('li[data-room_id=' + res.id + ']')["0"].children["0"].children[1].className = 'active-clr mem-cir-img';
    if (getCurrentRoom() && getCurrentRoom().includes(res.id))
     $('#my-circle-menu').find('.cm-selected-label').children()["0"].className = 'active-clr mem-cir-img';
   } else if (res.msg == 'removed') {
    $('#my-circle-menu').find('li[data-room_id=' + res.id + ']')["0"].children["0"].children[1].className = '';
    if (getCurrentRoom() && getCurrentRoom().includes(res.id))
     $('#my-circle-menu').find('.cm-selected-label').children()["0"].className = '';
   }
  }
 }

 recentChatStatus = function(res, chatlist) {
  for (i of chatlist) {
   if (i.type == 'user' && res.id == i.rid) {
    if (res.msg == "changed") {
     i.status = res.fields.status;
    } else if (res.msg == 'added') {
     i.status = res.fields.status;
    } else if (res.msg == 'removed') {
     i.status = 'offline'
    }
   }
  }
 }

 hideChat = function() {
  $('.live-chat-messages .force-overflow').empty();
//  $('.message-section .welcome-note').css('display', 'block');
  $('.message-section .chat_close').css('display', 'none');
  $('.outer-div-equel').css('display', 'none');
  $('.message-input').css('display', 'none');
  $('.usermentiondiv').css('display', 'none');
  $('.chatheader').empty();
  // $('#timeline_div').empty();
  // Reset the Room objects.
  showRecentChat(recentChatList);
  $('#cm_selected_item').css('display', 'none');
 }

 $('#sidebarCollapse3').on('click', function() {
  try {
   $("#groupCreateModal").css('display', 'block');
  } catch (err) {
   showErr(err)
  }
 });

 $(document).on('click', '#file_upload_close', function() {
  // Close the file upload modal.
  //uploadFiles = [];
  $("#groupCreateModal").css('display', 'none');
 });

// // Want to remove.
// $('.pop-up-show-chat').click();
// $('#closeicon3').click();
// $('div #my-circle-menu li #item-0').click();

 /****************************** End Side bar Script *****************************/

 ddpdeactivate = function(roomid) {
  try {
   niaaddp.ddp_method("setUserActiveStatus", [roomid, false], function(err, res) {
    if (res) {

    } else {
     errorNotification(err.message)
    }
   });
  } catch (err) {
   errorNotification(err)
  }
 }

//NIAA CODE START
 findroomid = function(usermailid){
  let room = getRoom().user.filter(obj=> obj.name == usermailid.split('@')[0]);
  return room[0]
 }
 //NIAA CODE END

 return {
  getDirectRooms: getDirectRooms,
  setCurrentRoom: setCurrentRoom,
  getCurrentRoom: getCurrentRoom,
  getRoomsInfo: getRoomsInfo,
  showAllGroupUsers: showAllGroupUsers,
  //		showOnlineGruopUsers:showOnlineGruopUsers,
  onChangeRoom: onChangeRoom,
  getRoom: getRoom,
  getCurrentRoomType: getCurrentRoomType,
  userMention: userMention,
  setInitRecentChat: setInitRecentChat,
  roomSubscription: roomSubscription,
  ddpHideRoom: ddpHideRoom,
  ddpOpenRoom: ddpOpenRoom,
  ddpGetUsersOfRoom: ddpGetUsersOfRoom,
  tempRecentChat: tempRecentChat,
  updateTmpRecentChatList,
  updateTmpRecentChatList,
  addRoom: addRoom,
  removeRoom: removeRoom,
  hideChat: hideChat,
  searchRoom: searchRoom,
  resetChatRoom: resetChatRoom,
 }
})