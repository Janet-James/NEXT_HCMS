define('message', ['ddp', 'user', 'room', 'loadhistory'], function(niaaddp, niaauser, niaaroom, loadhistory) {
    var msg_id, roomLastSearchMsgID = undefined, isNextSearchMsg = true, resetSearchConvLength = function() {
        // Reset the search conv functional attributes
        niaaconfig.searchConvLength = 50;
        roomLastSearchMsgID = undefined;
        isNextSearchMsg = true;
    }, setMsgId = function(id) {
        msg_id = id
    }, getMsgId = function() {
        return msg_id
    }, msg_change_subscription_array = [], lastMsgReceivedRoom = {}, msg_unread_mention = {
        'user': [],
        'group': [],
        'channel': []
    }, unread_and_mention_count = {
        'user_unread': 0,
        'group_unread': 0,
        'channel_unread': 0,
        'group_mention': 0,
        'channel_mention': 0
    }, getLastMsgReceivedRoom = function() {
        return lastMsgReceivedRoom;
    }, getUnreadAndMentions = function() {
        return msg_unread_mention
    }, set_or_update_msg_data = function(key, val) {
        unread_and_mention_count[key] = unread_and_mention_count[key] + val;
    }, submitMsgFn = function() {
        // Press enter or click aero to to sent message.
        try {
            let $submitInput = $('#live-chat-submit-input');
            if ($submitInput.val().trim() !== '') {
                if ($(".msg_link").val() != "" && $(".msg_link").val() != undefined) {
                    var res = $(".msg_link").val() + $submitInput.val();
                    $submitInput.val(res);
                }
                resetTextAreaStyle();
                niaaddp.ddp_method('sendMessage', [{
                    "rid": niaaroom.getCurrentRoom(),
                    "msg": $submitInput.val().replace(/\r?\n/g, '<br />')
                }], function(err, res) {
                    if (res) {
                        resetReply();
                        // niaaroom.updateRecentChat();
                        if ($('.RoomUnreadTag').length) {
                            // Remove unerad message flag.
                            $('.RoomUnreadTag').remove();
                            loadhistory.readMessage();
                        }
                    } else if (err) {
                        errorNotification(err.reason);
                    }
                });
            }
        } catch (err) {
            showErr(err)
        }
    }, textAreaAutoGrow = function() {
        $('.message-input').css('position', 'absolute');
        $('.message-input').css('max-height', '185px');
        // Reset field height
        var height = parseInt($('.message-input').css('height'), 10);
        $('.message-input').css('height', height + 15 + 'px');
    }, submitMsg = function(e) {
        try {
            var key = e.keyCode || e.which;
            if (key === 13 && !e.shiftKey) {
                e.preventDefault();
                $('.send-button').trigger('click');
                // Rocket animation
                submitMsgFn();
            }
            // else if ( key === 13 && e.shiftKey) {
            //   textAreaAutoGrow();
            // }
            return false;
        } catch (err) {
            showErr(err)
        }
    }, removeUpdateEvntListner = function() {
        // Remove the update event listner and add sent message event listner.
        liveChatBox().submitInput.removeEventListener('keydown', updatemsg, false);
        liveChatBox().submitInput.addEventListener('keydown', submitMsg, false);
        editMsgFlag = false;
        // change edit message flag as false.
    }, editMsgFn = function() {
        try {
            let $submitInput = $('#live-chat-submit-input');
            if ($submitInput.val().trim() !== '') {
                niaaddp.ddp_method('updateMessage', [{
                    "_id": getMsgId(),
                    "rid": niaaroom.getCurrentRoom(),
                    "msg": $submitInput.val()
                }]);
                $submitInput.val('')
            }
            removeUpdateEvntListner();
        } catch (err) {
            showErr(err)
        }
    }, updatemsg = function(e) {
        var key = e.keyCode || e.which;
        if (key === 13 && !e.shiftKey) {
            // Enter key to sent message.
            e.preventDefault();
            editMsgFn();
            resetEdit();
            $('.send-button').trigger('click');
            // Rocket animation
        } else if (key == 27) {
            // Esc key to cancel the update.
            $('#live-chat-submit-input').val('')
            resetEdit();
        }
        return false;
    }, newMsgNotification = function(msgObj) {
        if ($('.live-chat-messages').scrollTop() + $('.live-chat-messages').innerHeight() >= $('.live-chat-messages')[0].scrollHeight) {
            $('.new_msg_notify').css('display', 'none');
        } else {
            if (!('editedBy'in msgObj.fields.args[0])) {
                $('.new_msg_notify').css('display', 'block');
                var res = msgObj.fields.args[0];
                if ((res.rid == niaaroom.getCurrentRoom()) && (res.u._id != niaauser.getuserid())) {
                    loadhistory.setOpenedRoomUnreadTag(msgObj.fields.args.length);
                }
            }
        }
    }, showNewMsgCount = function() {
        unreadJumpMsgCount += 1;
        $('.new-messg-recent').html('Jump to recent messages ' + unreadJumpMsgCount);
    }, msgNotifyRemove = function(msgObj) {
        if (msgObj.fields.args["0"].u._id == niaauser.getuserid()) {
            loadhistory.resetNewMsgLbl();
            updateScrollPosition();
        } else {
            newMsgNotification(msgObj);
        }
    }, decideDateStr = function(msgObj) {
        // New message received then check the requir to place date string.
        if (todaysDateFlag) {
            let date_ts = msgObj.fields.args["0"].ts.$date
              , $date_str = "<div class='un-read-msg date_str_label'><span>" + moment(date_ts).format('LL') + "</span></div>";
            if (roomsHistory.messages && roomsHistory.messages.length) {
                // Rooms last message and new message are diffrent then put date str.
                if (isSameDay(roomsHistory.messages[roomsHistory.messages.length - 1].ts.$date, date_ts)) {} else {
                    $niaahtml.chatBox.append($date_str);
                    todaysDateFlag = false;
                }
            } else {
                //RoomsHistory is empty then put date str
                $niaahtml.chatBox.append($date_str);
                todaysDateFlag = false;
            }
        }
    }, onchangeMessage = function(msgObj) {
        try {
            if (msgObj.collection == "stream-room-messages" && msgObj.fields.args.length) {
                if (!jumpToMessage) {
                    unreadJumpMsgCount = 0;
                    // Reset the unread message count.
                    var res = msgObj.fields.args[0];
                    msgNotifyRemove(msgObj);
                    //remove the new message label and update scroll position
                    loadhistory.emptyConvHistory();
                    decideDateStr(msgObj);
                    // Check to wnat new date string.
                    if ('t'in res) {
                        showTimeLine({
                            messages: msgObj.fields.args
                        }, "next");
                    }// t represent it've user add/remove/
                    // if ('editedBy' in res && "urls" in res && !("ignoreParse" in res.urls["0"]) && ("headers" in res.urls["0"])){var update_data=loadhistory.hasReplyMsg(res);loadhistory.addCommonProperty(res,update_data);}
                    else if ('editedBy'in res) {
                        editExistinMsg(res);
                    }//message is edited by user
                    else if ('urls'in res && res.urls[0].ignoreParse) {
                        var update_data = loadhistory.hasReplyMsg(res);
                        loadhistory.addCommonProperty(res, update_data);
                        showTimeLine({
                            messages: msgObj.fields.args
                        }, "next");
                        if ($('.file_attachment').hasClass('disableCursor'))
                            $('.file_attachment').removeClass('disableCursor');
                    }//message replied by user
                    else if (!('urls'in res) && ('attachments'in res)) {
                        let attachment_obj = res.attachments[0];
                        attachment_obj.message_id = res._id;
                        var update_data = hasAttachement(attachment_obj);
                        loadhistory.addCommonProperty(res, update_data);
                        showTimeLine({
                            messages: msgObj.fields.args
                        }, "next");
                    } else if ("urls"in res && !("ignoreParse"in res.urls["0"]) && ("headers"in res.urls["0"])) {
                        var update_data = loadhistory.hasMultipleURLs(res);
                        checkPreviousURL(res);
                        loadhistory.addCommonProperty(res, update_data);
                        showTimeLine({
                            messages: msgObj.fields.args
                        }, "next");
                    } else {
                        let conversations = roomsHistory.messages;
                        conversations.push(res);
                        loadhistory.groupingMessage(conversations, conversations.length - 1, true);
                        //loadhistory.addCommonProperty(res);
                        showTimeLine({
                            messages: msgObj.fields.args
                        }, "next");
                    }
                    var resp = loadhistory.getConvHistory();
                    appendChatMessages(resp);
                    if ($('.new_msg_notify').is(":hidden") && !('editedBy'in res)) {
                        updateScrollPosition();
                    }
                    // readMessage only call for message sent by another user not mine
                    if ((res.rid == niaaroom.getCurrentRoom()) && (res.u._id != niaauser.getuserid())) {
                        loadhistory.readMessage();
                    }
                    if (localStorage.getItem('mom_chat_id') && res.rid === localStorage.getItem('mom_chat_id')) {
                        recordMeeting(res);
                    }
                    let img_obj = {};
                    img_obj.messages = msgObj.fields.args;
                    // if(loadhistory.findImagCountFn(img_obj))appendToLightBox(); //  Append the images to light box div.
                } else if (jumpToMessage) {
                    if (msgObj.fields.args["0"].u._id == niaauser.getuserid()) {
                        //Check the Login user can sent message.
                        unreadJumpMsgCount = 0;
                        // Reset the unread message count.
                        loadhistory.callLoadHistoryFn();
                    } else {
                        showNewMsgCount();
                    }
                }
            }
        } catch (err) {
            showErr(err)
        }
    }, editExistinMsg = function(res) {
        let msg_index = roomMsgIndex(res._id);
        // Update the room's conv in timeline data.
        roomsHistory.messages[msg_index] = res;
        let date_str = moment(res.editedAt.$date).format("lll")
          , $edit_label = '<div class="edit-time"><i class="fa fa-edit"></i><p class="user-message">edited at ' + date_str + ' by ' + res.editedBy.username + '</p></div>';
        if ("urls"in res && !("ignoreParse"in res.urls["0"]) && ("headers"in res.urls["0"]) && "attachments"in res && res.attachments["0"].attachments.length) {
            // Edited for Reply message.
            // $('#'+res._id+' .pert-replay').find('p').html()
            msgobj = loadhistory.replyMsg(res);
            $('#' + res._id).attr('data-msg_type', msgobj.msg_type);
            $('#' + res._id).find('#url_text').remove();
            $('#' + res._id).find('.website_name').remove();
            $('#' + res._id).find('.website-title').remove();
            $('#' + res._id + ' .reply-text').html(msgobj.msg);
            $('#' + res._id + ' .date-time').append($edit_label);
        } else if ("urls"in res && !("ignoreParse"in res.urls["0"]) && ("headers"in res.urls["0"]) && "attachments"in res && !(res.attachments["0"].attachments.length) && res.editedAt) {
            // Edited for Reply message.
            // $('#'+res._id+' .pert-replay').find('p').html()
            msgobj = loadhistory.replyMsg(res);
            $('#' + res._id).attr('data-msg_type', msgobj.msg_type);
            $('#' + res._id).find('#url_text').remove();
            $('#' + res._id).find('.website_name').remove();
            $('#' + res._id).find('.website-title').remove();
            $('#' + res._id + ' .reply-text').html(msgobj.msg);
            $('#' + res._id + ' .date-time').append($edit_label);
        } else if ("urls"in res && !("ignoreParse"in res.urls["0"]) && ("headers"in res.urls["0"])) {
            $('#' + res._id).attr('data-msg_type', 'edit_url');
            var update_data = loadhistory.hasMultipleURLs(res);
            // checkPreviousURL(res);
            // res.isEdited = 'edited at '+moment(res.editedAt.$date).format("lll")+' by '+res.editedBy.username
            $('#' + res._id + ' .mesg-bg').html(update_data.msg);
            // loadhistory.addCommonProperty(res,update_data);
            $('#' + res._id + ' .date-time').append($edit_label);
        } else if ('urls'in res && 'ignoreParse'in res.urls["0"]) {
            // Edited for Reply message.
            // $('#'+res._id+' .pert-replay').find('p').html()
            $('#' + res._id).attr('data-msg_type', 'edit_reply');
            let msgobj = loadhistory.replyMsg(res);
            $('#' + res._id + ' .reply-text').html(msgobj.msg);
            $('#' + res._id + ' .date-time').append($edit_label);
        } else if ("attachments"in res) {
            // edited for image and video description
            $('#' + res._id).attr('data-msg_type', 'edit_attachment');
            $('#' + res._id + ' .attachment-description').html(res.attachments["0"].description);
            $('#' + res._id + ' .attachment-image a').attr('data-caption', res.attachments["0"].description);
            $('#' + res._id + ' .date-time').append($edit_label);
        } else {
            // Edited message for normal conversation
            $('#' + res._id).attr('data-msg_type', 'edit_msg');
            $('#' + res._id + ' .mesg-bg').html(res.msg);
            $('#' + res._id + ' .date-time').append($edit_label);
        }
        if (niaauser.getusername() == res.u.username) {
            $('.live-chat-messages li#' + res._id)[0].scrollIntoView();
        }
    }, deleteMessage = function() {
        if (!($('.live-chat-messages li#' + getMsgId()).hasClass('msg-group-sec')) && $('.live-chat-messages li#' + getMsgId()).next('li').hasClass('msg-group-sec')) {
            $('.live-chat-messages li#' + getMsgId()).next('li').find('.send-name').css('display', 'block');
            $('.live-chat-messages li#' + getMsgId()).next('li').find('img').css('display', 'block');
            $('.live-chat-messages li#' + getMsgId()).next('li').removeClass('msg-group-sec');
        }
        niaaddp.ddp_method("deleteMessage", [{
            "_id": getMsgId()
        }], function(err, res) {});
    }, userMsgReceived = function(res) {
        try {
            if (res.collection == "stream-notify-user" && res.fields.args.length && "lastMessage"in res.fields.args[1] && 'sandstormSessionId'in res.fields.args[1].lastMessage) {
                if (!$('.niaa-info-menu .pop-up-show-chat').hasClass("expanded") || rocket_chat_tab == 'hidden') {
                    let msg_user_name = res.fields.args[1]['lastMessage'].u.username;
                    if (niaauser.getusername() != msg_user_name) {
                        // To avoid login user send message's notification.
                        let user_obj = {};
                        user_obj['uname'] = msg_user_name;
                        user_obj['msg'] = res.fields.args[1]['lastMessage'].msg;
                        push_notify(user_obj);
                    }
                }
            }
            if (res.collection == "stream-notify-user" && res.fields.args.length) {
                if (res.fields.args[0] == "updated") {
                    if ("archived"in res.fields.args[1]) {
                        if (res.fields.args[1].archived) {
                            // User is deactivated.
                            deactiveUserList.push((res.fields.args[1].rid).replace(niaauser.getuserid(), ''));
                            if (niaaroom.getCurrentRoom() == res.fields.args[1].rid) {
                                userDeactivateDiv();
                            }
                        } else if (!res.fields.args[1].archived) {
                            // User is activated.
                            user_index = deactiveUserList.indexOf((res.fields.args[1].rid).replace(niaauser.getuserid(), ''));
                            deactiveUserList.splice(user_index, 1);
                            if (niaaroom.getCurrentRoom() == res.fields.args[1].rid) {
                                userActivateDiv();
                            }
                        }
                    } else if ("unread"in res.fields.args[1]) {
                        // when login user added to new group, then its notiy to user
                        findAndUpdateMsgReceivedRoom(res);
                    }
                }/*if (res.fields.args[0] == "updated" && "unread"in res.fields.args[1]) {
        // when login user added to new group, then its notiy to user
        findAndUpdateMsgReceivedRoom(res);
      }*/
                else if (res.fields.args[0] == 'inserted') {
                    // Add room to the room object.

                    if (res.fields.args[1].t == 'c') {
                        niaaroom.addRoom(res.fields.args[1], 'channel');
                    } else if (res.fields.args[1].t == 'p') {
                        niaaroom.addRoom(res.fields.args[1], 'group');
                    }
                }// when i am removed from existing group, then its notiy to user
                else if (res.fields.args[0] == 'removed') {
                    // Remove the login user from room Object.
                    // remove the user from public channel
                    closeChatWindow();
                    if (res.fields.args[1].t == 'c') {
                        niaaroom.removeRoom(res.fields.args[1]._id, 'channel');

                    } else if (res.fields.args[1].t == 'p') {
                        niaaroom.removeRoom(res.fields.args[1]._id, 'group');
                        //remvoe the user from private group
                    } else if (res.fields.args[1].t == 'd') {
                        //remvoe the user from niaa
                        var joinId = res.fields.args[1]._id
                          , roomId = joinId.replace(niaauser.getuserid(), "");
                        niaaroom.removeRoom(roomId, 'user');
                    }
                }
            }// else if (res.collection == "stream-notify-user" && res.fields.args.length) {
            else if (res.collection == "stream-notify-user" && res.fields.args.length && res.fields.args[0] != 'changed' && res.fields.args[0] != "updated" && res.fields.args[0] != 'inserted' && res.fields.args[0] != 'removed') {
                if (res.fields.args["0"].payload.type == "c" || res.fields.args["0"].payload.type == "p") {
                    notificationMessage = res.fields.args["0"].payload.name + "<br>" + res.fields.args["0"].payload.sender.name + " : " + res.fields.args["0"].text;
                    notificationFunction(notificationMessage);
                } else {
                    notificationMessage = res.fields.args["0"].payload.sender.name + " : " + res.fields.args["0"].text;
                    notificationFunction(notificationMessage);
                }
            }
        } catch (err) {
            showErr(err)
        }

    }, notificationFunction = function(notificationMessage) {
        $('<div class="alert alert-success alert-dismissible validation_error animated fadeIn"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button><h4><i class="icon fa fa-check">\
      </i></h4>' + notificationMessage + '</div>').insertBefore('#alert_notify_div');
        $(".validation_error").show().delay(15000).queue(function(n) {
            $(this).fadeOut();
            n();
        });
    }, // this is function is called when the other user send an message to me
    // data contain other end user sending message content
    // here we need give higher priority to that user.
    // So need to find and change the position of that user
    findAndUpdateMsgReceivedRoom = function(receivedMsg) {
        try {
            if (receivedMsg.fields.args.length) {
                lastMsgReceivedRoom['type'] = receivedMsg.fields.args[1].t
                lastMsgReceivedRoom['id'] = receivedMsg.fields.args[1].rid
                lastMsgReceivedRoom['name'] = receivedMsg.fields.args[1].name
                lastMsgReceivedRoom['unread'] = receivedMsg.fields.args[1].unread
                lastMsgReceivedRoom['mention'] = receivedMsg.fields.args[1].userMentions
            }
            //inform the msg changes to the user
            for (let i = 0; i < msg_change_subscription_array.length; i++) {
                msg_change_subscription_array[i].roomUpdateHandler()
            }
        } catch (err) {
            showErr(err)
        }
    }
    msgChangeHandler = function(obj) {
        msg_change_subscription_array.push(obj)
    }
    onchange = function(res) {
        try {
            if (res.collection == "stream-notify-user" && res.fields.args.length) {
                userMsgReceived(res);
            } else if (res.collection == "stream-room-messages") {

                if (rocket_chat_tab == 'hidden') {
                    var obj = {}
                    obj['uname'] = res.fields.args[0].u.username;
                    obj['msg'] = res.fields.args[0].msg;
                    push_notify(obj);
                }
                // check the current working room and messsage receive room are same
                if (res.fields.args[0].rid == niaaroom.getCurrentRoom()) {
                    // Edit message
                    onchangeMessage(res);
                    // $('.live-chat-messages li#'+res.fields.args["0"]._id)[0].scrollIntoView();
                }
            }
        } catch (err) {
            showErr(err)
        }
    }
    ,
    update_unread_mention = function(room) {
        // Update the type of room based...
        if (room.t == 'p') {
            msg_unread_mention['group'].push(room)
        } else if (room.t == 'c') {
            msg_unread_mention['channel'].push(room)
        } else if (room.t == 'd') {
            msg_unread_mention['user'].push(room)
        }
    }
    subscriptions_get = function() {
        try {
            niaaddp.ddp_method('subscriptions/get', [], function(err, res) {
                if (res) {
                    msg_unread_mention = {
                        'user': [],
                        'group': [],
                        'channel': []
                    }
                    for (let room of res) {
                        update_unread_mention(room);
                        // Retreive the hiden rooms list.
                        if (room.archived) {
                            deactiveUserList.push((room.rid).replace(niaauser.getuserid(), ''));
                        }
                        if (!room.open) {
                            let rid = (room.rid).replace(niaauser.getuserid(), '');
                            hideRoomList.push(rid)
                        }
                    }
                    loadRoomInfo(1);
                } else {
                    showErr(err.message)
                }
            });
        } catch (err) {
            showErr(err)
        }
    }
    ,
    subscriptions_get2 = function() {
        try {
            niaaddp.ddp_method('subscriptions/get', [], function(err, res) {
                if (res) {
                    msg_unread_mention = {
                        'user': [],
                        'group': [],
                        'channel': []
                    }
                    for (let room of res) {
                        update_unread_mention(room);
                    }
                } else {
                    showErr(err.message)
                }
            });
        } catch (err) {
            showErr(err)
        }
    }
    ,
    setScrollForSearch = function() {
        //Set the scroll attr to the selector
        //Checks the scroll reach end of the conv load next messages based on next message flag
        $('#search_msg_disp_div').scroll(function() {
            // Check next message available or not
            if (isNextSearchMsg) {
                //check the client window is empty or not
                if (!($('#search_msg_disp_div').is(':empty'))) {
                    //Check the scroll position if reach end of the page then load next set of messages
                    if ($('#search_msg_disp_div').scrollTop() + $('#lsearch_msg_disp_div').innerHeight() + 290 >= $('#search_msg_disp_div')[0].scrollHeight) {
                        //Get the last message timestamp
                        //let msg_timestamp = $('#live-chat-messages .message-data:last')[0].dataset.timestamp;
                        roomLastSearchMsgID = $('#search_msg_disp_div .message-data:last')[0].id;
                        niaaconfig.searchConvLength += 20;
                        // Load next 100 search messages hard coded
                        let searchingWord = $('#msg_search_txt').val()
                        $niaahtml.msgSearchBox.append('<label id=msgLoadingLbl class = room-msg-loading>Loading . . .</label>');
                        getSearchingMsg(searchingWord);
                    }
                }
            }
        });
    }
    ,
    getSearchingMsg = function(searchingWord) {
        ddp.method("messageSearch", [searchingWord, niaaroom.getCurrentRoom(), niaaconfig.searchConvLength], searchMessageFn)
    }
    ,
    searchMessageFn = function(err, conversation) {
        try {
            $('label#msgLoadingLbl').remove();
            if (err) {
                throw err
            } else {
                if (conversation.message.docs.length) {
                    $('#search_msg_disp_div').empty();
                    // Set scroll attributes for scroll down and scroll up

                    //setScrollForSearch(); want to modify

                    // Reset the conversation history list
                    loadhistory.emptyConvHistory();
                    firstRound = true;
                    resp = loadhistory.loadHistoryProcessor({
                        messages: conversation.message.docs
                    });
                    //send the the resp with received
                    if (resp) {
                        appendSearchMessages(resp);
                    }
                    //show conversation
                    if (roomLastSearchMsgID) {
                        $('#search_msg_disp_div li#' + roomLastSearchMsgID)[0].scrollIntoView();
                    }
                    // Focus the previous loaded last search message
                    if (roomLastSearchMsgID === conversation.message.docs[conversation.message.docs.length - 1]._id) {
                        isNextSearchMsg = false;
                    }
                } else {
                    $('#search_msg_disp_div').html("<div class=no-result-sec><img src=/static/niaa/assets/images/noresult.png></div>");
                }
            }
        } catch (err) {
            showErr(err)
        }
    }
    ,
    logged_event_handler = function() {
        subscriptions_get()
    }
    ,
    logged_event_obj = {
        logged_event_handler: logged_event_handler
    }
    niaauser.user_add_logged_event_handler(logged_event_obj);
    msg_ddp_event_interface = {
        onchange: onchange
    }
    // room_uread_mention_detail;
    niaaddp.ddp_add_interface(msg_ddp_event_interface);
    push_notify = function(res, icon) {
        // Browser push notification.
        if ('Notification'in window) {
            let ask = Notification.requestPermission(), icon_path;
            if (icon) {
                icon_path = '/static/niaa/bell.png';
            } else {
                icon_path = userAvatarURL + res.uname + '?_dc=undefined'
            }
            ask.then(permission=>{
                if (permission === 'granted') {
                    let notify = new Notification(res.uname,{
                        body: res.msg,
                        icon: icon_path,
                    });
                    // notify.addEventListener('click', event=>{
                    //   // window.open("http://127.0.0.1:8085");
                    // });
                    setTimeout(function() {
                        notify.close()
                    }, 2000);
                }
            }
            );
        }
    }

    $(document).on("click", "#focus_msg", function(e) {
        $('.new_msg_notify').css('display', 'none');
        e.preventDefault();
        if (($('.RoomUnreadTag').length) && !($('.mark_as_read_btn').length)) {
            messageId = $('div.RoomUnreadTag+li')[0].id;
        } else if (($('.RoomUnreadTag').length) && ($('.mark_as_read_btn').length)) {
            messageId = $('div.mark_as_read_btn+li')[0].id;
        }
        $('.live-chat-messages li#' + messageId)[0].scrollIntoView();
    });

    $(document).on('input', '.message-input', function() {
        var outerHeight = parseInt($(this).css('height'), 10);
        $('.message-input').css('position', 'absolute');
        var diff = outerHeight - $(this)[0].clientHeight;

        // set the height to 0 in case of it has to be shrinked
        $(this).css('height', '80px');

        // set the correct height
        // el.scrollHeight is the full height of the content, not just the visible part
        $(this).css('height', Math.min(185, parseInt($('.live-chat-submit-input')[0].scrollHeight, 10) + diff) + 'px');

    });

    resetEdit = function() {
        // Reset the Edit message elements.
        setMsgId(null);
        removeUpdateEvntListner();
        $('.file_attachment').removeClass('disableCursor');
    }

    return {
        submitMsg: submitMsg,
        submitMsgFn: submitMsgFn,
        editMsgFn: editMsgFn,
        onchangeMessage: onchangeMessage,
        updatemsg: updatemsg,
        setMsgId: setMsgId,
        getMsgId: getMsgId,
        deleteMessage: deleteMessage,
        getSearchingMsg: getSearchingMsg,
        getUnreadAndMentions: getUnreadAndMentions,
        msgChangeHandler: msgChangeHandler,
        getLastMsgReceivedRoom: getLastMsgReceivedRoom,
        resetSearchConvLength: resetSearchConvLength,
        removeUpdateEvntListner: removeUpdateEvntListner,
        push_notify: push_notify,
        subscriptions_get2: subscriptions_get2,
    }
});
