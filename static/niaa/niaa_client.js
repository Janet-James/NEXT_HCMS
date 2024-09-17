define('niaa_client', ['user', 'room', 'message', 'loadhistory', 'ddp', 'chatbox', 'file', 'meeting', 'cookie'], function(niaauser, niaaroom, niaamsg, niaaloadhistory, niaaddp, chatbox, niaafile, meeting) {

    var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        reply_msg_link = "",
        isChatBoxOpened = false,
        chatFlagID = undefined,
        first_users = [];
    // user login click
    $(document).on('click', '#userLoginBtn', function() {
        userLoginId = $('#username').val();
        userLoginPasswd = $('#password').val();
        niaauser.login(userLoginId, userLoginPasswd);
    });

    //user status set
    $(document).on('change', '#userStatus', function() {
        let status = $(this).val();
        niaauser.setUserStatus(status);
    });
    updateMeetingBtn = function() {
        // Update the meeting start stop button when page refresh from localstorage data based.\
        // if(localStorage.getItem('mom_chat_id')){
        if (localStorage.getItem('mom_chat_id') && localStorage.getItem('mom_conv_count')) {
            if (localStorage.getItem('mom_chat_id') == niaaroom.getCurrentRoom()) {
                // Mom Initiator side
                $('#recButton').removeClass();
                $('#recButton').addClass("Rec");
            } else {
                $('#recButton').removeClass();
                $('#recButton').addClass("notRec");
                $('#recButton').addClass("disableCursor");
            }
        } else if (localStorage.getItem('mom_chat_id') && !localStorage.getItem('mom_conv_count') && !localStorage.getItem('status')) {
            if (localStorage.getItem('mom_chat_id') == niaaroom.getCurrentRoom()) {
                // Mom Initiator side
                $('#recButton').removeClass();
                $('#recButton').addClass("Rec");
            } else {
                $('#recButton').removeClass();
                $('#recButton').addClass("notRec");
                $('#recButton').addClass("disableCursor");
            }
        } else if (localStorage.getItem('mom_chat_id') && !localStorage.getItem('mom_conv_count') && localStorage.getItem('status')) {
            if (localStorage.getItem('status')) {
                if (niaaroom.getCurrentRoom() == localStorage.getItem('mom_chat_id')) {
                    // Mom attendar side.
                    $('#recButton').removeClass();
                    $('#recButton').addClass("Rec");
                    $('#recButton').addClass("disableCursor");
                } else {
                    $('#recButton').removeClass();
                    $('#recButton').addClass("notRec");
                    $('#recButton').addClass("disableCursor");
                }
            } else {
                localStorage.removeItem('mom_chat_id');
                localStorage.removeItem('mom_chat_name');
                localStorage.removeItem('status');
                $('#recButton').removeClass();
                $('#recButton').addClass("notRec");
            }
        }
        // }
        // else{
        //   $('#recButton').removeClass();
        //   $('#recButton').addClass("notRec");
        // }
    }
    updateMeetingBtn();
    unreadLoadConvLen = function() {
        let unread_msg_count = niaaloadhistory.checkUnreadStatus();
        if (unread_msg_count && unread_msg_count >= niaaconfig.roomHistoryLength) {
            return unread_msg_count;
        } else {
            return niaaconfig.roomHistoryLength;
        }
    }

    callOpenChatRoom = function(current_room_id, username, user_type) {
        openChatRoom(current_room_id, username, user_type);
        // Update the temp recent chat list .
        niaaroom.updateTmpRecentChatList(current_room_id);
    }
    circMenuAccess = function(user_type) {
        // Disble the group users list for users.
        if (user_type == 'chatUser') {
            $('#sidebarCollapse').addClass("disableCursor");
            $('#sidebarCollapse1').removeClass("disableCursor");
        } else {
            $('#sidebarCollapse1').removeClass("disableCursor");
            $('#sidebarCollapse').removeClass("disableCursor");
        }
    }
    openChatRoom = function(room_id, username, user_type) {
        try {
            $('.owl-carousel.searchnames').trigger('destroy.owl.carousel');
            if ($("#search_box").hasClass('active')) {
                $('#search_box').trigger('click');
            }
            $niaahtml.search.empty();
            hideCarousel();
            $('.chat_close').css('display', 'block');
            if (window.innerWidth < 1100) {
                $('#banner_fullwidth').removeClass("col-md-9");
                $('#banner_fullwidth').addClass("col-md-7");
            } else if (window.innerWidth > 1100 && window.innerWidth < 1400) {
                $('#banner_fullwidth').removeClass("col-md-9");
                $('#banner_fullwidth').addClass("col-md-8");
            } else if (window.innerWidth > 1400 && window.innerWidth < 1500) {
                $('#banner_fullwidth').removeClass("col-md-9");
                $('#banner_fullwidth').addClass("col-md-8");
            }
            // Reset the side bar and circle menu btn attributes.
            resetChatWindow();
            circMenuAccess(user_type);
            // controls the circular menu icon enable & disable.
            if (deactiveUserList.indexOf(room_id) != -1) {
                userDeactivateDiv();
            } else {
                userActivateDiv();
            }
            $('.outer-div-equel').css('display', 'inline-block');
            $('.live-chat-messages .inner-loading').empty();
            $('.live-chat-messages .inner-loading').append(loading_center_animation);
//            $('.welcome-note').hide();
            //     $('.message-input').show();
            niaaroom.setCurrentRoom(room_id);
            //username = $(e).find('span[class=username]').text();
            var current_room_id = niaaroom.getCurrentRoom();
            // check and remove user from hide list.
            chkHidenRoom(current_room_id);
            setCurrentUserName(username);
            // After refresh update meeting button status
            updateMeetingBtn();
            resetLightBox();

            // Chat header title.
            var html = Handlebars.templates.chatheader({
                'chatheader': username
            });
            $niaahtml.header.html(html);

            initSelectorVar();
            setScrollAttribute();

            getHistoryAndRoomSubscribe = function() {
                let unread_msg_count = unreadLoadConvLen();
                niaaloadhistory.ddpLoadHistory(current_room_id, unread_msg_count, current_timestamp, username);
                niaaroom.roomSubscription();
            }
            create_direct_message_callback = function(err, res) {
                if (res) {
                    getHistoryAndRoomSubscribe();
                }
            }
            let current_timestamp = parseInt((new Date().getTime()) / 1000);
            // this check is prevent the again and again get same room data
            if ((chatFlagID == undefined) || (chatFlagID != current_room_id)) {
                $('#live-chat-submit-input').val('');
                // Clear the previous room conversations
                $('.live-chat-messages .force-overflow').empty();
                if (user_type == 'chatUser') {
                    // var chatRoomID = e.id;
                    if (first_users.indexOf(username) == -1) {
                        first_users.push(username);
                        // its just a temporary solution
                        // this function is called an users clicked first time
                        // usage of this function is an new user is need create direct message function call at very first
                        // but, we cannot find who is new user at real time
                        // so, we call this function at each time with first clicks
                        // also this is only for users not for public or private channels

                        // the below code is commented. because this is arise the issue in recent chat
                        // create direct message real time API is create an response via stream-notify-user rooms-changed

                        // create_direct_message(userName, create_direct_message_callback);
                        // getHistoryAndRoomSubscribe();
                        let unread_msg_count = unreadLoadConvLen();
                        niaaloadhistory.ddpLoadHistory(current_room_id, unread_msg_count, current_timestamp, username);
                        //niaaloadhistory.ddpLoadHistory(current_room_id, niaaconfig.roomHistoryLength,current_timestamp,username);
                    } else {
                        getHistoryAndRoomSubscribe();
                    }

                    // niaauser.getUserPresence(chatRoomID,userName,checkUserStatus)
                } else {
                    // $('#user-status-div').empty();
                    getHistoryAndRoomSubscribe();
                }
                chatFlagID = current_room_id;
                //delete subscription
                // niaaloadhistory.subDeleteMsg(current_room_id,false);
            } else {
                $('.live-chat-messages .inner-loading').empty();
            }
            //third
            liveChatBox().submitInput.addEventListener('keydown', niaamsg.submitMsg, false);
        } catch (err) {
            showErr(err)
        }
    };

    replyUrlFormation = function(user_type, user_name) {
        //second
        reply_msg_link = ""
        // $niaahtml.header.empty()
        if (user_type == "chatChannel") {
            // $niaahtml.chatBoxHeader.append($(this).text())
            reply_msg_link = channelURL + user_name + "?msg="
        } else if (user_type == 'chatGroup') {
            // $niaahtml.chatBoxHeader.append($(this).text())
            reply_msg_link = groupURL + user_name + "?msg="
        } else {
            // $niaahtml.chatBoxHeader.append($($(this).contents()[0]).text())
            // this code have hardcode index- change in feature
            reply_msg_link = directURL + user_name + "?msg="
        }
    }
    // click events for users and groups
    $(document).on('click', '.chatGroup, .chatUser, .chatChannel', function() {
        let user_name = $(this).find('span[class=username]').text(),
            room_id = this.id,
            user_type = $(this)["0"].classList["0"];
        replyUrlFormation(user_type, user_name)
        openChatRoom(room_id, user_name, user_type);
        // Display the Opened room as circular menu. and update temp recent chat.
        niaaroom.tempRecentChat(room_id);
    });

    checkUserStatus = function(uname, res) {

        if (res.presence != 'online') {
            niaaddp.ddp_method('subscriptions/get', [], function(err, res) {
                if (res) {
                    var user_ls = res.filter(obj => (obj.t == 'd') && (obj.name == uname))
                    var ls_time = new Date(user_ls[0].ls.$date);
                    var ls_time_resp = findWhichDay(ls_time);
                    showUserStatus('Last Seen: ' + ls_time_resp);
                }
            });
        } else {
            showUserStatus('Status: online');
        }
    };
    findWhichDay = function(resObj) {
        var lsStr = resObj.getDate() + '-' + resObj.getMonth() + '-' + resObj.getFullYear()
        var dateNowObj = new Date();
        var todayStr = dateNowObj.getDate() + '-' + dateNowObj.getMonth() + '-' + dateNowObj.getFullYear();
        var lastdayStr = dateNowObj.getDate() - 1 + '-' + dateNowObj.getMonth() + '-' + dateNowObj.getFullYear();
        if (lsStr == todayStr) {
            return ('Today ' + findAmPmTimeFormat(resObj))
        } else if (lsStr == lastdayStr) {
            return ('Yesterday ' + findAmPmTimeFormat(resObj))
        } else {
            return dateNowObj.getDate() + '/' + dateNowObj.getMonth() + '/' + dateNowObj.getFullYear() + ' ' + findAmPmTimeFormat(resObj);
        }
    }
    showUserStatus = function(res) {
        $('#user-status-div').empty();
        $('#user-status-div').append(res);
    }

    create_direct_message = function(uname, create_direct_message_callback) {
        // first send the create direct meesage for new user
        niaaddp.ddp_method("createDirectMessage", [uname], create_direct_message_callback);
    }

    //read message
    $(document).on("click", "#bulk_msg_as_read", function() {
        niaaloadhistory.readMessage();
        clearUnreadtag();
    });
    clearUnreadtag = function() {
        //this is remove the unread label and button
        // in proper UI the button in pop type. so no need to remove.
        $niaahtml.chatBox.find('.mark_as_read_btn').remove();
        $niaahtml.chatBox.find('.RoomUnreadTag').remove()
    };
    // message search
    $(document).on('keyup', '#msg_search_txt', function() {
        try {
            let searchingWord = $(this).val();
            if (searchingWord.length > 0) {
                // Reset the search mesasge conversation length
                niaamsg.resetSearchConvLength();
                niaamsg.getSearchingMsg(searchingWord);
            } else if (searchingWord.length == 0) {
                $niaahtml.msgSearchBox.empty();
            }
        } catch (err) {
            showErr(err)
        }

    });
    //show hide buttons for edit delete reply button
    $(document).ready(function() {
        $(document).on('mouseenter', '.message-data', function() {
            $(this).find(":button").show();
        }).on('mouseleave', '.message-data', function() {
            $(this).find(":button").hide();
        });
    });

    //hide show button for jump to message button
    $(document).ready(function() {
        $(document).on('mouseenter', '.search_convdiv', function() {
            $(this).find(":button").show();
        }).on('mouseleave', '.search_convdiv', function() {
            $(this).find(":button").hide();
        });
    });

    /**************** Retrieve cursor before word for user mention *************/
    function ReturnWord(text, caretPos) {
        var index = text.indexOf(caretPos);
        var preText = text.substring(0, caretPos);
        if (preText.indexOf(" ") > 0 || preText.indexOf("@") == 0) {
            var words = preText.split(" ");
            return words[words.length - 1].trim();
            //return last word
        } else {
            return text.trim();
        }
    }

    function AlertPrevWord() {
        var text = document.getElementById("live-chat-submit-input");
        var caretPos = GetCaretPosition(text)
        var word = ReturnWord(text.value, caretPos);
        if (word != null && word.indexOf("@") == 0) {
            return word;
        } else {
            return false
        }
    }

    function GetCaretPosition(ctrl) {
        var CaretPos = 0;
        // IE Support
        if (document.selection) {
            ctrl.focus();
            var Sel = document.selection.createRange();
            Sel.moveStart('character', -ctrl.value.length);
            CaretPos = Sel.text.length;
        } // Firefox support
        else if (ctrl.selectionStart || ctrl.selectionStart == '0')
            CaretPos = ctrl.selectionStart;
        return (CaretPos);
    }

    $.fn.setCursorPosition = function(pos) {
        // Set cursor position in text area.
        this.each(function(index, elem) {
            if (elem.setSelectionRange) {
                elem.setSelectionRange(pos, pos);
            } else if (elem.createTextRange) {
                var range = elem.createTextRange();
                range.collapse(true);
                range.moveEnd('character', pos);
                range.moveStart('character', pos);
                range.select();
            }
        });
        return this;
    };

    /**************** Retrieve cursor before word for user mention *************/

    // user Mention
    $(document).on('keyup', '#live-chat-submit-input', function(value, event) {
        try {
            let userInputTxt = $niaahtml.submitBox.val();
            let search_word = AlertPrevWord();
            if (search_word) {
                getPossibleUser(search_word);
            } else if (userInputTxt.length == 0 || !search_word) {
                $('.usermentiondiv').hide();
                $(".usersmention ul").empty();
            }
        } catch (err) {
            showErr(err)
        }
    });

    $(document).on('click', '.send-button .ion-checkmark', function() {
        // Click paper rocket to sent message.
        $('.usermentiondiv').hide();
        if (editMsgFlag)
            niaamsg.editMsgFn();
        else
            niaamsg.submitMsgFn();
    });

    function getPossibleUser(userInputTxt) {
        let userText = userInputTxt.substr(1, userInputTxt.length - 1);
        let current_room_id = niaaroom.getCurrentRoom()
        niaaroom.userMention(userText, true, current_room_id)
    }
    $(document).on('click', '.usersmention li', function() {
        let search_word = AlertPrevWord().trim(),
            userInputTxt = $niaahtml.submitBox.val(),
            pos = GetCaretPosition(document.getElementById("live-chat-submit-input")),
            at_word_len = ReturnWord(userInputTxt, pos).length,
            mention_user = $(this).text().trim(),
            replace_pos = pos - at_word_len, //Insert selected name inside the text-area string.
            user_message = userInputTxt.substring(0, replace_pos) + ('@' + mention_user + ' ') + userInputTxt.substring(pos),
            mention_usr_length = mention_user.length;

        $niaahtml.submitBox.val(user_message);
        // Focus and set the cursor after inserted string.
        $niaahtml.submitBox.focus().setCursorPosition(replace_pos + mention_usr_length + 2);
        $('.usermentiondiv').css('display', 'none');
    });
    // User typing
    let typingTimer = null;
    let doneTypingInterval = 5000;
    $("#live-chat-submit-input").keypress(function() {
        //$(document).on('keydown', '#live-chat-submit-input', function() {
        if (typingTimer == null) {
            niaauser.startUserTyping(niaaroom.getCurrentRoom(), niaauser.getusername(), true)
        }
        clearTimeout(typingTimer);
    });
    //$( "#live-chat-submit-input" ).keypress(function() {
    $(document).on('keyup', '#live-chat-submit-input', function() {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(doneTyping, doneTypingInterval);
    });

    function doneTyping() {
        niaauser.stopUserTyping(niaaroom.getCurrentRoom(), niaauser.getusername(), false)
        typingTimer = null
    }
    //logout
    $(document).on('click', '#niaa_logout', function() {
        niaauser.logout();
        clearNiaaFormData();
    });

    function clearNiaaFormData() {
        let HTMLElements = 'button, label, select, p';
        $('#niaa-chat-form').find(HTMLElements).remove();
        $('#live-chat-box').remove();
    }

    editMsgText = function(msgID, msgContainer, msg_obj) {
        let url_msg = '';
        if ("urls" in msg_obj && !msg_obj.urls["0"].ignoreParse) {
            // for (let url of msg_obj.urls){
            //   url_msg += url.url+' ';
            // }
            url_msg = msgContainer.find('#url_text').text();
        } else if ("urls" in msg_obj && msg_obj.urls["0"].ignoreParse) {
            // for (let urls=1;urls<msg_obj.urls.length;urls++){
            //   url_msg += msg_obj.urls[urls].url+' ';
            // }
            url_msg = msgContainer.find('#url_text').text();
        }
        let userMsgobj = msgContainer.find('.mesg-bg'),
            hrefValue = $("a", userMsgobj).attr('href');
        if (hrefValue) {
            // Check the any url have in the message
            editing_text = url_msg;
        } else {
            // Normal message
            editing_text = userMsgobj.text();
        }
        return editing_text;
    }
    // Update message
    $(document).on('click', '.edit_msg_btn', function() {
        try {
            if ($("#divShowHide").length) {
                $("#divShowHide").empty();
                $(".msg_link").val('');
            }
            $('.file_attachment').addClass('disableCursor');
            // Disable attachment button.
            var msgID = $(this).closest('li.message-data').attr('id');
            let msg_index = roomMsgIndex(msgID),
                msg_obj = roomsHistory.messages[msg_index];
            editMsgFlag = true;
            // Edit message is true.
            niaamsg.setMsgId(msgID);
            $niaahtml.submitBox.empty();
            msgContainer = $(this).parent().parent().parent().parent();
            if (msgContainer.length) {
                let editing_text;
                if (msgContainer.find('[class=pert-replay]').length) {
                    // Reply message
                    if (msgContainer.find('#website').length) {
                        editing_text = msgContainer.find('#url_text').text();
                        // let msgobj = msgContainer.find('.website-title');
                        // editing_text = $("a",msgobj).attr('href');
                        // if(msg_obj.urls.length > 1){
                        //   editing_text = editMsgText(msgID, msgContainer, msg_obj)
                        // }
                    } else {
                        editing_text = msgContainer.find('[class=reply-text]').text();
                    }
                } else if (msgContainer.find('[class=attachment-description]').length) {
                    // Image, Video, File messages
                    editing_text = msgContainer.find('[class=attachment-description]').text();
                } else {
                    editing_text = editMsgText(msgID, msgContainer, msg_obj)
                }
                $niaahtml.submitBox.val(editing_text);
            }
            liveChatBox().submitInput.removeEventListener('keydown', niaamsg.submitMsg, false);
            liveChatBox().submitInput.addEventListener('keydown', niaamsg.updatemsg, false);
        } catch (err) {
            showErr(err);
        }

    });
    //reply message
    $(document).on('click', '.reply_msg_btn', function() {
        try {
            // Disable the file attachement icon.
            // Reset the Edit message elements.
            $('#live-chat-submit-input').val('')
            niaamsg.setMsgId(null);
            niaamsg.removeUpdateEvntListner();
            $('.file_attachment').addClass('disableCursor');
            var msgID = $(this).closest('li.message-data').attr('id'),
                msg = '';
            niaamsg.setMsgId(msgID);
            // $niaahtml.submitBox.focus();
            // $('.msg_link').empty();
            var parent = $(this).parent().parent().parent().parent();
            if ($(this).closest('li.message-data').attr('data-msg_type') == 'reply_url' || $(this).closest('li.message-data').attr('data-msg_type') == 'url' || $(this).closest('li.message-data').attr('data-msg_type') == 'edit_url' || $(this).closest('li.message-data').attr('data-msg_type') == 'edit_reply_url') {
                msg = parent.find('#url_text').text();
                // if(parent.find('#website').length == 1){
                //   msg = parent.find('#website').text();
                // }else if(parent.find('#website').length > 1){
                //   for(let url_div of parent.find('#website')){
                //     msg += url_div.textContent+' ';
                //   }
                // }
            } else if ($(this).closest('li.message-data').attr('data-msg_type') == 'image' || $(this).closest('li.message-data').attr('data-msg_type') == 'file' || $(this).closest('li.message-data').attr('data-msg_type') == 'video' || $(this).closest('li.message-data').attr('data-msg_type') == "edit_image" || $(this).closest('li.message-data').attr('data-msg_type') == "edit_attachment" || $(this).closest('li.message-data').attr('data-msg_type') == "audio") {
                msg = parent.find('.attachment-title').text();
            } else {
                if (parent.find('.pert-replay').length) {
                    msg = parent.find('.reply-text').text();
                } else {
                    msg = parent.find('.mesg-bg').text();
                }
            }

            time = parent.find('.rec-time').text();
            name = parent.find('.send-name').text();
            $('.reply_display').html("<div class=pert-replay><a class='close reply_close' href=#><span aria-hidden=true>×</span></a>" + "<img class=pert-img src=" + userAvatarURL + name + "?_dc=undefined alt=''><span>" + name + "</span>" + "<span class=send-date-rlp>" + time + "</span><p>" + msg + "</p></div>")
            $("#divShowHide").show();
            $('.msg_link').val(reply_msg_link + niaamsg.getMsgId() + ")");
        } catch (err) {
            showErr(err);
        }
    });
    var ddpSendMessage = function(msg) {
            // Send message function.
            try {
                niaaddp.ddp_method('sendMessage', [{
                    "rid": fileUpload.room_list[0],
                    "msg": msg.replace(/\r?\n/g, '<br />')
                }], function(err, res) {
                    if (res) {
                        fileUpload.room_list.shift();
                        if (fileUpload.room_list.length) {
                            niaafile.forwardNotification();
                            ddpSendMessage(msg)
                        } else if (fileUpload.room_list.length == 0) {
                            successNotification('Fowarded to selected users');
                        }
                    } else if (err) {
                        errorNotification(err.reason);
                    }
                });
            } catch (err) {
                errorNotification(err);
            }
        },
        getFileInfo = function(msg_obj) {
            let msg = msg_obj[0].file;
            msg.description = msg_obj["0"].attachments["0"].description;
            return msg
        }
    forwardMsgType = function(msg_obj, msg_type) {
        // Find out the forward message type.
        switch (msg_type) {
            case 'msg':
                //Text message.
                return msg_obj[0].msg;
            case 'edit_reply':
                //Edited reply msg.
                return msg_obj[0].msg
            case 'edit_url':
                //Edited reply msg.
                msg = '';
                for (let url of msg_obj[0].urls) {
                    msg += url.url + ' ';
                }
                return msg;
            case 'reply':
                //Text reply msg.
                return msg_obj[0].msg.split(')')[1];
            case 'url':
                //multiple or single URL msg.
                msg = '';
                for (let url of msg_obj[0].urls) {
                    msg += url.url + ' ';
                }
                return msg;
            case 'reply_url':
                //Multiple or single URL msg's reply.
                if (msg_obj[0].msg.split(')')[1]) {
                    msg = msg_obj[0].msg.split(')')[1];
                } else {
                    msg = '';
                    for (let url of msg_obj[0].urls) {
                        if (!(url.ignoreParse))
                            msg += url.url + ' ';
                    }
                }
                return msg;
            case 'edit_reply_url':
                if (msg_obj[0].msg.split(')')[1]) {
                    msg = msg_obj[0].msg.split(')')[1];
                } else {
                    msg = msg_obj[0].msg;
                }
                return msg;
            case 'image':
                //Image message.
                return getFileInfo(msg_obj);
            case 'video':
                //Video message.
                return getFileInfo(msg_obj);
            case 'audio':
                //Audio message.
                return getFileInfo(msg_obj);
            case 'file':
                //File message.
                return getFileInfo(msg_obj);
        }
    };

    //Forward message
    $(document).on('click', '.fwd_msg_btn', function() {
        // Forward button click to show pop up user list.
        try {
            resetForward();
            fileUpload.room_list = [];

            //let totalcollection = {};
            // $(".forword-msg-box").show();
            //totalcollection = searchRoomUser('');

            $(this).closest('ul').siblings('.forword-msg-box').addClass("forword-user-box");
            var html = Handlebars.templates.forward_msg_user({
                'room': searchRoomUser('', fileUpload.room_list)
            });
            $(this).closest('ul').siblings('.forword-msg-box').find("ul.forward_msg_list").html(html);
        } catch (err) {
            showErr(err);
        }
    });

    $(document).on('click', '.reply_close', function() {
        resetReply();
    });

    //delete message
    $(document).on('click', '.delete_msg_btn', function() {
        try {
            var msgID = $(this).closest('li.message-data').attr('id');
            niaamsg.setMsgId(msgID)
            JSalert();
        } catch (err) {
            showErr(err);
        }
    });

    $(document).on('click', '.upload_submit_btn', function() {
        fileUpload.isFrom = 'upload';
        $("#exampleModalCenter")[0].style.display = "none";
        if ($('#file_upload_preview_div').find('.prev_window').length)
            $('.prev_window')[0].pause();
        //pause the audio/video controls
        //let room_list = [niaaroom.getCurrentRoom()];
        fileUpload.room_list = [niaaroom.getCurrentRoom(), ];
        niaafile.getFile();
    });
    var callLoadNextMessage = function(time_stamp, cb_function) {
            // Common function for time line wise load  next message
            // Call the API and response have data display else return room empty(false)
            niaaloadhistory.ddpLoadNextMessage(niaaroom.getCurrentRoom(), niaaconfig.loadConvLength, {
                "$date": time_stamp
            }, cb_function);
        },
        callLoadPreviousMsg = function(top_msg_timepstamp, topMsgId) {
            // Common function for time line wise load  previous message
            niaaloadhistory.ddpLoadPrevMessages(niaaroom.getCurrentRoom(), niaaconfig.loadConvLength, {
                "$date": parseInt(top_msg_timepstamp)
            }, topMsgId);
        },
        scrollToRemoveLabel = function() {
            // Remove the new messages label when Scroll down.
            if ($('.live-chat-messages').scrollTop() + $('.live-chat-messages').innerHeight() >= $('.RoomUnreadTag')[0].offsetTop) {
                niaaloadhistory.resetNewMsgLbl();
            }
        },
        focusTimelineBtn = function(scroll_pos) {
            // scroll chat window to Timeline focus
            $("button").removeClass("timeline_select_btn");
            $("#timeline_div .timline_btn #aero_direction").removeClass('fa fa-chevron-up');
            $("#timeline_div .timline_btn #aero_direction").removeClass('fa fa-chevron-down');
            var resp = binary_Search($('.live-chat-messages .force-overflow .message-data'), $('.live-chat-messages').scrollTop()),
                id = resp.id,
                current_scroll = $('.live-chat-messages').scrollTop();
            $("#timeline_div #" + id).addClass("timeline_select_btn");
            if (current_scroll >= scroll_pos) {
                $("#timeline_div #" + id + " #aero_direction").addClass('fa fa-chevron-down');
            } else {
                $("#timeline_div #" + id + " #aero_direction").addClass('fa fa-chevron-up');
            }
            return current_scroll;
        },
        setScrollAttribute = function() {
            //Set the scroll attr to the selector
            //Checks the scroll reach end of the conv load next messages based on next message flag
            let scroll_top = 0;
            $('.live-chat-messages').scroll(function() {
                //check the client window is empty or not
                if (!($('.live-chat-messages .force-overflow').is(':empty'))) {
                    scroll_top = focusTimelineBtn(scroll_top)
                    if ($('.RoomUnreadTag').length && $('.new_msg_notify').is(":visible")) {
                        scrollToRemoveLabel();
                    }
                    //Check the scroll position if reach end of the page then load next messages
                    if ($('.live-chat-messages').scrollTop() + $('.live-chat-messages').innerHeight() >= $('.live-chat-messages')[0].scrollHeight) {
                        focusTimelineBtn('next');
                        //Get the last message timestamp
                        //let msg_timestamp = $('#live-chat-messages .message-data:last')[0].dataset.timestamp;
                        let msg_timestamp = $('.live-chat-messages .force-overflow .message-data:last')[0].dataset.timestamp;
                        // Check any next message available or not.
                        if (niaaloadhistory.getIsNextMsg() && ddpLoadFlag) {
                            ddpLoadFlag = false;
                            $niaahtml.scrolling.append(scrolling_bottom_animation);
                            callLoadNextMessage(parseInt(msg_timestamp), niaaloadhistory.loadNextMsgFn);
                            niaaloadhistory.setIsFromScroll(true);
                        }
                    } // if scroll reach the top (0) then call previous messages.
                    else if ($('.live-chat-messages').scrollTop() <= 0) {
                        //Get the current rooms first message timestamp
                        let top_msg_timepstamp = $('.live-chat-messages .force-overflow li.message-data:first')[0].dataset.timestamp
                        // Check if any previous messages available or not
                        if (niaaloadhistory.getIsPrevMsg() && ddpLoadFlag) {
                            ddpLoadFlag = false;
                            $niaahtml.scrolling.append(scrolling_top_animation);
                            let topMsgId = $('.live-chat-messages .force-overflow .message-data:first').attr('id');
                            callLoadPreviousMsg(top_msg_timepstamp, topMsgId);
                        }
                    }
                }
            });
        },
        binary_Search = function(items, value) {
            var firstIndex = 0,
                lastIndex = items.length - 1,
                middleIndex = Math.floor((lastIndex + firstIndex) / 2);

            Total_Iteration = Math.ceil(Math.log(lastIndex, 2));

            count = 0;
            while (count <= Total_Iteration && firstIndex < lastIndex) {
                count += 1
                if (value < items.get(middleIndex).offsetTop) {
                    lastIndex = middleIndex - 1;
                } else if (value > items.get(middleIndex).offsetTop) {
                    firstIndex = middleIndex + 1;
                }
                middleIndex = Math.floor((lastIndex + firstIndex) / 2);

            }
            if (value > items.get(middleIndex - 1).offsetTop && value > items.get(middleIndex).offsetTop) {
                middleIndex = middleIndex + 1
            } else {
                middleIndex = middleIndex
            }

            return items.get(middleIndex);
        }
    isTimeStampInBetween = function(time_stamp) {
            // Get the room first message
            let first_msg_timepstamp = $('#live-chat-messages .message-data:first')[0].dataset.timestamp;
            let last_msg_timepstamp = $('#live-chat-messages .message-data:last')[0].dataset.timestamp;
            // Check the timeline's timestamp and first message time for timeline message already loaded or not
            if (time_stamp >= parseInt(first_msg_timepstamp) && time_stamp <= parseInt(last_msg_timepstamp)) {
                return true
            } else {
                return false
            }
        },
        isChatRoomEmpty = function() {
            // Check the chat room is empty or not
            if ($niaahtml.chatBox[0].childNodes.length > 1) {
                return true
            } else {
                return false
            }
        },
        focusRoomMsg = function(time_stamp) {
            // Focus the timelie's matched room coversation
            $("#live-chat-messages li.message-data").each(function() {
                if (parseInt(this.dataset.timestamp) >= time_stamp) {
                    $('#' + this.id)[0].scrollIntoView();
                    return false
                }
            });
        },
        loadNextReset = function() {
            // Clear the Chat box and reset the date flag
            $niaahtml.chatBox.empty();
            firstRound = true;
        },
        isSearchMsginRoom = function(msgId) {
            // It will return the true or false based on the msg presence
            let roomConv = $('.live-chat-messages').find('li[id=' + msgId + ']').length;
            if (roomConv) {
                return true
            } else {
                return false
            }
        };

    //get first unread message
    $(document).on('click', '#first-unread', function() {
        var res = niaaloadhistory.getFirstUnreadMsgId()
        //this is navigate to first unread msg location
        if (document.getElementById(res)) {
            document.getElementById(res).scrollIntoView();
        }
    });

    $(document).on('click', '.jumpToMsgBtn', function() {

        let searchMsgAttr = $(this).closest(".message-data"),
            msgId = searchMsgAttr.attr('id'),
            searchResp = isSearchMsginRoom(msgId);
        if (searchResp) {
            // Search message in rrom then focus the message.
            $('.live-chat-messages').find('li[id=' + msgId + ']')[0].scrollIntoView();
        } else {
            // Load surrounding message
            $niaahtml.chatBox.empty();
            niaaloadhistory.resetJumpToRecentMsgLbl();
            let roomId = $(this).attr('data-rid'),
                time_stamp = searchMsgAttr.attr('data-timestamp');
            jumpToMessage = true;
            // set the jump to message flag.
            $('#jump_to_msg_notify').css('display', 'block');
            niaaloadhistory.ddpSurroundingMessage(msgId, roomId, time_stamp, niaaconfig.loadConvLength);
        }
    });

    var dispTimeLineStrDate = (function() {
        // Append months in timeline Button  Immediately Invoke Function
        let date = new Date();
        document.getElementById("timeLineLastMonthBtn").innerText = monthNames.slice(date.getMonth() - 1)[0];
        document.getElementById("timeLineLast2MonthBtn").innerText = monthNames.slice(date.getMonth() - 2)[0];
        document.getElementById("timeLineLast3MonthBtn").innerText = monthNames.slice(date.getMonth() - 3)[0];
    });

    $(document).on('keyup', '.searchlist .search_user', function() {
        // $('.owl-carousel.owl-loaded.searchnames').css('display','block');
        userTypingList = [];
        totalcollection = {};
        name_list = niaaroom.getRoom();
        typing_name = $('.searchlist .search_user').val().toLowerCase();
        // $('#user_name_list').empty();
        if (typing_name != '') {
            for (var key in name_list) {
                let roomList = []
                for (var i = 0; i < name_list[key].length; i++) {
                    let isHided = false;
                    matching_name = (name_list[key][i]['name'].toLowerCase()).match(typing_name);
                    if (matching_name != null && matching_name != undefined && matching_name.input != niaauser.getusername() && matching_name.input != 'rocket.cat') {
                        // $('#user_name_list').append(matching_name['input']+'<br>');
                        collectionName = {}
                        if (hideRoomList.findIndex(obj => obj == name_list[key][i]._id) != -1)
                            isHided = true
                        if (key == 'channel') {
                            collectionName['id'] = name_list[key][i]._id;
                            collectionName['name'] = name_list[key][i].name;
                            collectionName['hided'] = isHided;
                            roomList.push(collectionName);
                        } else if (key == 'group') {
                            collectionName['id'] = name_list[key][i]._id;
                            collectionName['name'] = name_list[key][i].name;
                            collectionName['hided'] = isHided;
                            roomList.push(collectionName);
                        } else if (key == 'user') {
                            collectionName['id'] = name_list[key][i]._id;
                            collectionName['username'] = name_list[key][i].username;
                            collectionName['status'] = name_list[key][i].status;
                            collectionName['hided'] = isHided
                            roomList.push(collectionName);
                        }
                    }
                }
                totalcollection[key] = roomList;
                // userTypingList.push(matching_name['input']);
            }
            $('.chat_close').css('display', 'none');
            $('.owl-carousel.searchnames').trigger('destroy.owl.carousel');
            $niaahtml.search.empty();
            var html = Handlebars.templates.roomsearch({
                'room': totalcollection
            });
            $niaahtml.search.append(html);
            carousel('searchnames');
        } else {
            if (niaaroom.getCurrentRoom()) {
                $('.chat_close').css('display', 'block');
            }
            $niaahtml.search.empty();
        }
    });

    ddpGetRoomRoles = function(data_obj) {
            // Get the room owner info.
            //["{"msg":"method","method":"getRoomRoles","params":["AePouPsibpfgY2dou"],"id":"17"}"]
            try {
                niaaddp.ddp_method("getRoomRoles", [data_obj.roomid], function(err, res) {
                    if (res) {
                        data_obj.callback_fn(res);
                    } else if (err) {
                        errorNotification('Error in get room roles : ' + err.error);
                    }
                });
            } catch (err) {
                showErr(err)
            }
        },
        showSBGroupMembers = function(roomobj) {
            // Show the current group members for sidebar.
            niaaroom.showAllGroupUsers($('.group_all_users'), roomobj, true);
            // Show group online users.
            niaaroom.showAllGroupUsers($('.group_online_users'), roomobj, false);
        },
        groupAdminFn = function(role_resp) {
            // Enable group admin functionalites.
            let login_user_id = niaauser.getuserid(),
                is_admin = false,
                current_room_id = niaaroom.getCurrentRoom();

            let roles_index = role_resp.findIndex(obj => obj.u._id == login_user_id)
            if (roles_index != -1) {
                // Current room is private group and current login user and group admin are same then enable delete room.
                $('.sb_for_delete_room').removeClass('disableCursor');
                $('#sb_leave_group_lbl').attr('data-owner', 'true');
                // Add group member input and btns enable
                $('#add_member_search_user_ip').show();
                // $('#group-create-members').show();
                $('#add_group_members_btns').hide();
                is_admin = true;
            } else {
                // Currernt user is not a admin of this group so diable delete room.
                $('.sb_for_delete_room').addClass('disableCursor');
                $('#sb_leave_group_lbl').attr('data-owner', 'false');
                // Add group member input and btns disable
                $('#add_member_search_user_ip').hide();
                $('#group-create-members').hide();
                $('#add_group_members_btns').hide();

            }
            showSBGroupMembers({
                current_room_id: current_room_id,
                is_admin: is_admin
            });
            return is_admin
        }
    /****************************** Side bar Script *****************************/
    $('#sidebarCollapse').on('click', function() {
        try {
            let element = isHidden('#sidebarCollapse')
            if (!element) {
                resetAddGroupmember();
                // Reset the add group member.
                let current_room_id = niaaroom.getCurrentRoom();
                ddpGetRoomRoles({
                    roomid: current_room_id,
                    callback_fn: groupAdminFn
                });
                // Enable the admin control buttons.
                // Timeline search and message search add class.
                $('#tab2-2').closest('div .tab-2').removeClass('ind-ser-msg');
                $('#tab2-1').closest('div .tab-2').removeClass('ind-ser-msg');
                $('.create-group-box .user_search_box').css('display', 'block');

                $('#sidebar').addClass('active');
                $('#sidebarCollapse').closest('li').addClass('active');
                // $('#sidebar').css('display','block');
                // Lists the current room user's in side bar.
                //show all users
                $('.sb_for_grp_usrs').removeClass('hidden');
                $('.sb_for_grp_usrs').addClass('visible');

                $('.sb_for_msg_srch').removeClass('visible');
                $('.sb_for_msg_srch').addClass('hidden');

                $('.sb_for_delete_room').removeClass('hidden');
                $('.sb_for_delete_room').addClass('visible');

            } else {
                hideSideBar('#sidebarCollapse');
            }
        } catch (err) {
            showErr(err)
        }
    });

    $('#sidebarCollapse1').on('click', function() {
        try {
            let element = isHidden('#sidebarCollapse1');
            if (!element) {
                resetAddGroupmember();
                // Reset the add group member.
                resetSideBar();
                // Add class for 50% message search and timeline search CSS
                $('#tab2-2').closest('div .tab-2').addClass('ind-ser-msg');
                $('#tab2-1').closest('div .tab-2').addClass('ind-ser-msg');
                $('.sid-bar-sec .txtShowDiv').css('display', 'none');
                // $('#sidebar').css('display','block');
                $('#sidebar').addClass('active');
                $('#sidebarCollapse1').closest('li').addClass('active');

                $('.sb_for_msg_srch').removeClass('hidden');
                $('.sb_for_msg_srch').addClass('visible');

                $('.sb_for_grp_usrs').removeClass('visible');
                $('.sb_for_grp_usrs').addClass('hidden');

                $('.sb_for_delete_room').removeClass('visible');
                $('.sb_for_delete_room').addClass('hidden');
                msgSearchDatePkr();
                // append the date element into input box.
            } else {
                hideSideBar('#sidebarCollapse1');
            }
        } catch (err) {
            showErr(err)
        }
    });

    /****************      Is hiden         **********************/
    isHidden = function(element) {
        if ($(element).closest('li').hasClass('active')) {
            return true;
        } else {
            return false;
        }
    }

    /***************************       Set scroll attribute for timeline search *************************/
    // setTLSearchScroll = function(){
    //   //Set the scroll attr to the selector
    //   //Checks the scroll reach end of the conv load next messages based on next message flag
    //
    //   $('.timeline_search_div').scroll(function() {
    //     //check the client window is empty or not
    //     if(!($('.timeline_search_div .timeline_search_result').is(':empty'))){
    //       //Check the scroll position if reach end of the page then load next messages
    //       if($('.timeline_search_result').scrollTop() + $('.timeline_search_result').innerHeight() >= $('.timeline_search_result')[0].scrollHeight) {
    //         //Get the last message timestamp
    //         //let msg_timestamp = $('#timeline_search_result .message-data:last')[0].dataset.timestamp;
    //         let msg_timestamp = $('.timeline_search_result .message-data:last')[0].dataset.timestamp;
    //         // Check any next message available or not
    //         if (niaaloadhistory.getIsNextMsg() && ddpLoadFlag){
    //           ddpLoadFlag=false;
    //           $('.timeline_search_result .inner-loading').append(scrolling_bottom_animation);
    //           callLoadNextMessage(parseInt(msg_timestamp), niaaloadhistory.loadTLSearchFn);
    //           niaaloadhistory.setIsFromScroll(true);
    //         }
    //       } // if scroll reach the top (0) then call previous messages.
    //       else if($('.timeline_search_result').scrollTop() <= 0) {
    //        /* //Get the current rooms first message timestamp
    //         let top_msg_timepstamp = $('.timeline_search_result li.message-data:first')[0].dataset.timestamp
    //         // Check if any previous messages available or not
    //         if (niaaloadhistory.getIsPrevMsg()){
    //           $niaahtml.scrolling.append(scrolling_top_animation);
    //           let topMsgId = $('.timeline_search_result .message-data:first').attr('id');
    //           //callLoadPreviousMsg(1523872668075, 'z8Ysbmxf4SZ7nvrzo');
    //           callLoadPreviousMsg(top_msg_timepstamp, topMsgId);
    //         }*/
    //       }
    //     }
    //   });
    // }

    /****************************** Date range picker Script Timeline search fn *****************************/
    msgSearchDatePkr = function() {
        var start = moment().subtract(29, 'days');
        var end = moment();

        function cb(start) {
            $('#reportrange span').html(start.format('MMMM D, YYYY'));
            test = moment(start._d).format(),
                timestamp = moment(test).format("X");
            $('.timeline_search_result').html('');
            setTLSearchScroll();
            //time line search
            let time_stamp = parseInt(timestamp) * 1000,
                current_time = new Date().getTime();
            // Check the selected date is valid or not.
            (current_time > time_stamp) ? callLoadNextMessage(time_stamp, niaaloadhistory.loadTLSearchFn): errorNotification('Select valid date');
        }

        $('#reportrange').daterangepicker({
            singleDatePicker: true,
            opens: "center",
            startDate: start,
            ranges: {
                'Today': [moment(), moment()],
                'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            }
        }, cb);
        $('#reportrange span').html(start.format('MMMM D, YYYY'))
        // cb(start);
    };
    /****************************** Date range picker Script *****************************/

    /****************************** Delete Sweet alaret Script *****************************/
    function JSalert() {
        swal({
            title: "Are You Sure?",
            text: "You will not be able to recover this message?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, Delete It!",
            cancelButtonText: "Cancel",
            closeOnConfirm: false,
            closeOnCancel: false
        }, function(isConfirm) {
            if (isConfirm) {
                niaamsg.deleteMessage();
                swal("Message Removed!", "Your message is removed permanently!", "success");
            } else {
                swal("", "Message is not removed!", "error");
            }
        });
    }

    /****************************** Delete Sweet alaret Script *****************************/

    chkHidenRoom = function(rid) {
        try {
            if (hideRoomList.indexOf(rid.replace(niaauser.getuserid(), '')) != -1) {
                // Remove the room from hiden room list.
                hideRoomList.splice(hideRoomList.indexOf(rid.replace(niaauser.getuserid(), '')), 1);
                niaaroom.ddpOpenRoom(rid);
            }
        } catch (err) {
            showErr(err)
        }
    }

    $(document).on('click', '#sb_close', function() {
        /*$('#sidebar').removeClass();
  $('#sidebarCollapse').closest('li').removeClass();
  $('#sidebarCollapse1').closest('li').removeClass();*/
        resetSideBar();
    });

    hideSideBar = function(element) {
        // sidebarCollapse
        // $('#sidebar').css('display','none');
        $('#sidebar').removeClass();
        $(element).closest('li').removeClass();
    }

    /***************************  Reset the side bar attributes *************************/

    resetSideBar = function() {

        $('#sidebar').removeClass();
        $('#sidebarCollapse').closest('li').removeClass();
        $('#sidebarCollapse1').closest('li').removeClass();

        $('.sb_for_grp_usrs').removeClass('visible');
        $('.sb_for_msg_srch').removeClass('visible');

        $('.sb_for_grp_usrs').addClass('hidden');
        $('.sb_for_msg_srch').addClass('hidden');

        $('#search_msg_disp_div').html('');
        $('.timeline_search_result').html('');
        $('.group_all_users').html('');
        $('.group_online_users').html('');

        $('#msg_search_txt').val('');

        $('#file_upload_loading').css('display', 'none');
    }

    resetChatWindow = function() {
        // Reset the jump to message notification attributes.
        // jumpToMessage=false;
        // $('#jump_to_msg_notify').css('display','none');
        niaaloadhistory.resetJumpToRecentMsgLbl();
        resetSideBar();
        niaaloadhistory.resetNewMsgLbl();
        // Reset to display the file attachemetn icon.
        $('.file_attachment').removeClass('disableCursor');
        // Reset the user mention modal.
        $('.usermentiondiv').css('display', 'none');
        // Todays date flag for new mesage of day's first message.
        roomsHistory=[];
        todaysDateFlag = true;
        resetTextAreaStyle();
        resetReply();
        resetEdit();
    }

    /***************************       Set scroll attribute for timeline search *************************/
    setTLSearchScroll = function() {
        //Set the scroll attr to the selector
        //Checks the scroll reach end of the conv load next messages based on next message flag
        // $(document).on('scroll', '.sid-bar-sec', function(e){

        $('.timeline_search_div').scroll(function() {
            //check the client window is empty or not
            if (!($('.timeline_search_div .timeline_search_result').is(':empty'))) {
                //Check the scroll position if reach end of the page then load next messages
                if ($('.timeline_search_div').scrollTop() + $('.timeline_search_div').innerHeight() >= $('.timeline_search_div')[0].scrollHeight) {
                    //Get the last message timestamp
                    //let msg_timestamp = $('#timeline_search_result .message-data:last')[0].dataset.timestamp;
                    let msg_timestamp = $('.timeline_search_div .message-data:last')[0].dataset.timestamp;
                    // Check any next message available or not
                    if (niaaloadhistory.getIsNextMsg() && ddpLoadFlag) {
                        ddpLoadFlag = false;
                        $('.timeline_search_div .inner-loading').css('display', 'block');
                        $('.timeline_search_div .inner-loading').append(scrolling_bottom_animation);
                        callLoadNextMessage(parseInt(msg_timestamp), niaaloadhistory.loadTLSearchFn);
                        niaaloadhistory.setIsFromScroll(true);
                    }
                } // if scroll reach the top (0) then call previous messages.
                else if ($('.timeline_search_div').scrollTop() <= 0) {
                    /* //Get the current rooms first message timestamp
                            let top_msg_timepstamp = $('.timeline_search_result li.message-data:first')[0].dataset.timestamp
                            // Check if any previous messages available or not
                            if (niaaloadhistory.getIsPrevMsg()){
                              $niaahtml.scrolling.append(scrolling_top_animation);
                              let topMsgId = $('.timeline_search_result .message-data:first').attr('id');
                              //callLoadPreviousMsg(1523872668075, 'z8Ysbmxf4SZ7nvrzo');
                              callLoadPreviousMsg(top_msg_timepstamp, topMsgId);
                            }*/
                }
            }
        });
    }

    // window.addEventListener('scroll', setTLSearchScroll)

    $(document).on("click", "#jump_to_msg_notify", function(e) {
        e.preventDefault();
        // Load history
        niaaloadhistory.callLoadHistoryFn();
    });
    $(document).on("click", "#jump_to_first_unread", function() {
        // Jump to first unread message load surrounding message.
        let msgId = roomFirstUnread._id,
            roomId = roomFirstUnread.rid,
            time_stamp = roomFirstUnread.ts.$date;

        niaaloadhistory.ddpSurroundingMessage(msgId, roomId, time_stamp, niaaconfig.roomHistoryLength);
    });

    $(".full_chat_close").on("click", function(e) {
        niaaroom.hideChat();
        var $content = $(".niaa-wrapper").hide();
        $('.niaa-info-menu .pop-up-show-chat').removeClass("expanded");
        // niaaddp.ddp_unsub(chatFlagID);
        niaaroom.resetChatRoom()
        chatFlagID = undefined;
        resetChatWindow();
        $('.message-input').css('display','none');
    });

    closeChatWindow = function() {
        // Close the chat window function.
    	niaaroom.hideChat();
        // niaaddp.ddp_unsub(chatFlagID);
        chatFlagID = undefined;
        niaaroom.resetChatRoom()
        resetChatWindow();
        $('#sidebarCollapse').addClass('disableCursor');
        $('#sidebarCollapse1').addClass('disableCursor');
    }
    $(".chat_close").on("click", function(e) {
        // Close current chat room.
        closeChatWindow();
        $('.message-input').css('display','none');
    });

    $(document).on("click", '.nf_close', function(e) {
        // Notification close.
        $(this).parents().find('.error_notification').remove();
    });

    searchRoomUser = function(typing_name, selected_room_list, room_list) {
        // Returns the "typing_name" matched all rooms except "selected_list" array rooms.
        let totalcollection = {},
            name_list = room_list ? room_list : niaaroom.getRoom();
        // name_list = niaaroom.getRoom();
        if (typing_name != '') {
            for (var key in name_list) {
                let roomList = []
                for (var i = 0; i < name_list[key].length; i++) {
                    let isSelected = false;
                    matching_name = (name_list[key][i]['name'].toLowerCase()).match(typing_name);
                    if (matching_name != null && matching_name != undefined && matching_name.input != niaauser.getusername() && matching_name.input != 'rocket.cat') {
                        // $('#user_name_list').append(matching_name['input']+'<br>');
                        collectionName = {}
                        roomobj = niaaroom.searchRoom(name_list[key][i]._id)
                        if (roomobj.type == 'user')
                            rid = [niaauser.getuserid(), roomobj.rid].sort().join("");
                        else
                            rid = roomobj.rid;
                        if (selected_room_list.findIndex(obj => obj == rid) != -1)
                            isSelected = true
                        if (key == 'channel' || key == 'group') {
                            collectionName['id'] = name_list[key][i]._id;
                            collectionName['name'] = name_list[key][i].name;
                            collectionName['selected'] = isSelected
                            roomList.push(collectionName);
                        } else if (key == 'user') {
                            collectionName['id'] = name_list[key][i]._id;
                            collectionName['username'] = name_list[key][i].username;
                            collectionName['status'] = name_list[key][i].status;
                            collectionName['selected'] = isSelected
                            roomList.push(collectionName);
                        }
                    }
                }
                totalcollection[key] = roomList;
            }
        } else {
            for (var key in name_list) {
                let roomList = []
                for (var i = 0; i < name_list[key].length; i++) {
                    let isSelected = false;
                    if (name_list[key][i].username != niaauser.getusername() && name_list[key][i].username != 'rocket.cat') {
                        // $('#user_name_list').append(matching_name['input']+'<br>');
                        collectionName = {}
                        roomobj = niaaroom.searchRoom(name_list[key][i]._id)
                        if (roomobj.type == 'user')
                            rid = [niaauser.getuserid(), roomobj.rid].sort().join("");
                        else
                            rid = roomobj.rid;
                        if (selected_room_list.findIndex(obj => obj == rid) != -1)
                            isSelected = true
                        if (key == 'channel' || key == 'group') {
                            collectionName['id'] = name_list[key][i]._id;
                            collectionName['name'] = name_list[key][i].name;
                            collectionName['selected'] = isSelected;
                            roomList.push(collectionName);
                        } else if (key == 'user') {
                            collectionName['id'] = name_list[key][i]._id;
                            collectionName['username'] = name_list[key][i].username;
                            collectionName['status'] = name_list[key][i].status;
                            collectionName['selected'] = isSelected;
                            roomList.push(collectionName);
                        }
                    }
                }
                totalcollection[key] = roomList;
            }
        }
        return totalcollection;
    }
    $(document).on('keyup', '.forword-user-box .user_search_box', function() {
        // Keyup event for message forward list and search user select.
        // $('.owl-carousel.owl-loaded.searchnames').css('display','block');
        let totalcollection = {},
            typing_name = $('.forword-user-box .user_search_box').val().toLowerCase();
        // $('#user_name_list').empty();

        totalcollection = searchRoomUser(typing_name, fileUpload.room_list);

        let html = Handlebars.templates.forward_msg_user({
            'room': totalcollection
        });
        $(this).closest('div.forword-msg-box').find("ul.forward_msg_list").html(html);

    });

    $(document).on('keyup', '.create-group-box .user_search_box', function() {
        // User search in invite to create group.

        let totalcollection = {},
            html_data = "<li>No data found.</li>";
        typing_name = $('#create_grp_search_user_ip').val().toLowerCase();
        // $('#user_name_list').empty();
        $('.create-group-box .room-search-result').css("display", "block");
        if (typing_name.length) {
            totalcollection = searchRoomUser(typing_name, searchRoomName.room_list);
            totalcollection.group = [];
            totalcollection.channel = [];
            html_data = Handlebars.templates.forward_msg_user({
                'room': totalcollection
            });
        }
        /*else{
    $('.create-group-box .room-search-result').css("display","none");
 }*/
        $('.create-group-box  div.room-search-result ul.chat_room_list').html(html_data);
    });

    $(document).on('keyup', '#add_member_search_user_ip ', function() {
        // Keyup event for message add group member search user select.
        let totalcollection = {},
            html_data = "<li>No data found</li>";
        typing_name = $('#add_member_search_user_ip').val().toLowerCase();
        $('.add_group_member .room-search-result').css("display", "block");
        if (typing_name.length) {
            totalcollection = searchRoomUser(typing_name, addGroupMember.room_list);
            totalcollection.group = [];
            totalcollection.channel = [];
            totalcollection.user = (totalcollection.user).filter(o => !groupMemberList.find(o2 => o.id === o2._id));
            html_data = Handlebars.templates.forward_msg_user({
                'room': totalcollection
            });
        }
        $('.add_group_member  div.room-search-result ul.chat_room_list').html(html_data);
    });

    $(document).on('keyup', '#remove-search-member .user_search_box', function() {
        // Set owner user search user select.
        let totalcollection = {},
            html_data = "<li>No data found</li>";
        typing_name = $('#remove-search-member .user_search_box').val().toLowerCase();
        $('#remove-search-member .room-search-result').css("display", "block");
        if (typing_name.length) {
            totalcollection = searchRoomUser(typing_name, groupMemberList, {
                user: groupMemberList
            });
        }

        html_data = Handlebars.templates.forward_msg_user({
            'room': totalcollection
        });

        if (searchRoomName.room_list.length) {}

        $(this).closest('div.forword-msg-box').find("ul.chat_room_list").html(html_data);

    });

    resetGroupCreateMdl = function() {
        // Reset the group create modal when close.
        searchRoomName = {
            room_list: []
        };
        $(".create-group-box #create_grp_name_ip").val('');
        $(".create-group-box").toggle("bounce");
        $('.create-group-box .user_search_box').val('');
        $('.create-group-box #fwd_selected_room').html('');
        $('.create-group-box .chat_room_list').html('');
    }
    resetAddGroupmember = function() {
        // Reset the add group member modal elements.
        addGroupMember.room_list = [];
        $("#add_member_search_user_ip").val('');
        $('.add_group_member .user_search_box').val('');
        $('.add_group_member #fwd_selected_room').html('');
        $('.add_group_member .chat_room_list').html('');
        $('.add_group_member').css('display', 'none');
    }

    selectRoomList = function(e, fn_obj, search_result_elm) {
        // Select room from room list or search room list.
        // e = currently clicked li element,
        // fn_obj = current function global object,
        // search_result_elm = current search element location.
        let user_name = $(e).text().trim(),
            rid, user_avatar, roomobj = niaaroom.searchRoom($(e).attr('id'));
        if (roomobj.type == 'user')
            rid = [niaauser.getuserid(), roomobj.rid].sort().join("");
        else
            rid = roomobj.rid;
        user_avatar = '<div class=img-name id=' + $(e).attr('id') + '><img class="mem-cir-img" src=' + userAvatarURL + user_name + '?_dc=undefined"><i class="fa fa-times" id="selected_user_close"></i></div>';
        if (fn_obj.room_list.length) {
            // Check previous selected room list
            if (fn_obj.room_list.indexOf(rid) == -1) {
                // Selected room is not presented in selected room list then
                fn_obj.room_list.push(rid);
                $(e).addClass('forward-selection');
                $(e).closest(search_result_elm).siblings('div#fwd_selected_room').append(user_avatar);
            } else {
                $(e).removeClass('forward-selection');
                let fwdindex = fn_obj.room_list.indexOf(rid)
                if (fwdindex != -1)
                    fn_obj.room_list.splice(fwdindex, 1)
                $(e).parent().parent().siblings('div#fwd_selected_room').find('div[id=' + $(e).attr('id') + ']').remove()
            }
        } else {
            fn_obj.room_list.push(rid);
            $(e).addClass('forward-selection');
            $(e).closest(search_result_elm).siblings('div#fwd_selected_room').append(user_avatar);
        }
    }

    $(document).on("click", 'li.message-data div.forword-search-result .forward_msg_list li', function() {
        // Forward message room select.
        // Select the room to add room list and mark as selected.
        selectRoomList(this, fileUpload, 'div.forword-search-result')
    });

    $(document).on("click", 'div.create-group-box div.room-search-result ul.chat_room_list li', function() {
        // In Group create select the listed rooms.
        selectRoomList(this, searchRoomName, 'div.create-group-box div.room-search-result');
        $('.create-group-box #create_grp_search_user_ip').val('');
        // Reset the text box
        $('.create-group-box .room-search-result').css("display", "none");
        // Close the user list box.
    });

    $(document).on("click", 'div.add_group_member div.room-search-result ul.chat_room_list li', function() {
        // Add group member select the listed rooms.
        selectRoomList(this, addGroupMember, 'div.add_group_member div.room-search-result');
        $('#add_member_search_user_ip').val('');
        // Reset the text box.
        $('.add_group_member .room-search-result').css("display", "none");
        // Close the user list box.
    });

    $(document).on("click", 'div#remove-search-member div.room-search-result ul.chat_room_list li', function() {
        // Add group member select the listed rooms.
        $('#remove-search-member .searc-result-list').html('');
        searchRoomName = {
            room_list: []
        };

        selectRoomList(this, searchRoomName, 'div#remove-search-member div.room-search-result');
        $('div#remove-search-member .user_search_box').val('');
        // Reset the text box.
        $('div#remove-search-member .room-search-result').css("display", "none");
        // Close the user list box.
    });

    $(document).on("click", ".create-group-box #group_create_btn", function() {
        // Group create from the selected rooms.
        let group_name = $("#create_grp_name_ip").val().toLowerCase();
        if (!group_name.length) {
            // notification for enter group name.
            errorNotification('Enter the group name');
        } else if (!searchRoomName.room_list || searchRoomName.room_list.length <= 1) {
            // notification for select atleast two user in a group.
            errorNotification('Add minumum two user in group');
        } else {
            // Check room list is defined and have room check.
            let room_name_list = [];
            for (let chat_room of searchRoomName.room_list) {
                room_name_list.push(meeting.getRoomName(chat_room));
            }
            niaaddp.ddp_method("createPrivateGroup", [group_name, room_name_list, false, {}, {
                "broadcast": false
            }], function(err, res) {
                if (res) {
                    // Notify the created new group name.
                    resetGroupCreateMdl();
                    successNotification(group_name + " group created successfully.");
                } else {
                    // Error in group creation.
                    errorNotification('Error in group creation : ' + err.error);
                }
            });
        }
    });

    $(document).on("click", "#group_create_cancel_btn", function() {
        // Cancel group create.
        resetGroupCreateMdl();
    });

    $(document).on("click", "#add_group_member_cancel_btn", function() {
        // Cancel add group member.
        resetAddGroupmember();
    });

    $("#create_grp_name_ip").keyup(function(e) {
        // Group name inputbox validation and name check.
        let group_name = $("#create_grp_name_ip").val().toLowerCase(),
            group_name_format = group_name.replace(/[^a-z0-9.\s]/gi, '').replace(/[_\s]/g, '');
        // Filter the special characters in group name
        $("#create_grp_name_ip").val(group_name_format);
        if (group_name_format.length > 0) {
            niaaddp.ddp_method("roomNameExists", [group_name_format], function(err, res) {
                if (res) {
                    // False then the group name is availble.
                    $("#create_grp_name_ip").addClass('alr-group-thr');
                    errorNotification("The group already exists.");
                    //$("#group_create_err_msg").css("display","block");
                } else {
                    $("#create_grp_name_ip").removeClass('alr-group-thr');
                    $('#notification_div').empty();
                }
            });
        }
    });

    removeSelectedRoomId = function(e, fn_obj) {
        $(e).parent().parent().siblings('div.forword-search-result').find('li[id=' + $(e).parent().attr('id') + ']').removeClass('forward-selection');
        $(e).parent().remove();
        roomobj = niaaroom.searchRoom($(e).parent().attr('id'));
        if (roomobj.type == 'user')
            rid = [niaauser.getuserid(), roomobj.rid].sort().join("");
        else
            rid = roomobj.rid;
        let fwdindex = fn_obj.room_list.indexOf(rid)
        if (fwdindex != -1)
            fn_obj.room_list.splice(fwdindex, 1)
    }

    $(document).on('click', '.create-group-box #selected_user_close', function() {
        // Create group remove selected user.
        removeSelectedRoomId(this, searchRoomName);
    });

    $(document).on('click', '.forword-user-box #selected_user_close', function() {
        // Forward message selected user remove.
        removeSelectedRoomId(this, fileUpload);
    });

    $(document).on('click', '.add_group_member #selected_user_close', function() {
        // Add group member selected user remove.
        removeSelectedRoomId(this, addGroupMember);
    });

    $(document).on('click', '#remove-search-member #selected_user_close', function() {
        // Set as owner selected user remove.
        removeSelectedRoomId(this, searchRoomName);
    });

    resetForward = function() {
        // fileUpload = {};
        $('.forword-msg-box .user_search_box').val('');
        $('.forword-msg-box #fwd_selected_room').html('');
        $('.forword-msg-box .forward_msg_list').html('');
        $('.forword-msg-box').removeClass("forword-user-box");
    }
    $(document).on("click", '#fwd_cancel_btn', function() {
        // Close forward user list.
        resetForward();
    });

    $(document).on("click", '#fwd_submit_btn', function() {
        if (fileUpload.room_list.length) {
            // forward message to selected user list.
            let msg_id = $(this).closest('li.message-data').attr('id'),
                msg_type = $(this).closest('li.message-data').attr('data-msg_type');

            let msg_obj = roomsHistory.messages.filter(obj => obj._id == msg_id),
                msg = forwardMsgType(msg_obj, msg_type);
            //fileUpload.room_list = ['QJyjY4khoYGpvPyKSwQfSRcszbkvkjJzqA','GENERAL', 'ecMQz3QkoKABMoYsG'];
            if (typeof(msg) == 'object') {
                fileUpload.isFrom = 'forward';
                niaafile.forwardMessageFn(msg);
            } else {
                niaafile.forwardNotification();
                ddpSendMessage(msg);
            }
            resetForward();
        } else {
            errorNotification("you haven't selected user")
        }
    });

    /*********************** Sweet alert notification **********************/
    var sweetSuccessAlert = function(alert_data) {
            // Success sweet alert.
            //swal("User Removed!", "Selected user is removed!", "success");
    		$('.sweet-alert.showSweetAlert').addClass("cus-swt-alert")
            swal(alert_data.title, alert_data.body, alert_data.type);
        },
        sweetErrorAlert = function(alert_data) {
            // Error sweet alert.
            //swal("User Removed!", "User is not removed!", "error");
        	$('.sweet-alert.showSweetAlert').addClass("cus-swt-alert")
            swal(alert_data.title, alert_data.body, alert_data.type);
        },
        /****************************** Sweet alert Script *****************************/
        JSSweetAlert = function(data_obj) {
            swal({
                title: data_obj.title,
                text: data_obj.text,
                type: data_obj.warning,
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: data_obj.confirm_btn_txt,
                cancelButtonText: "Cancel",
                closeOnConfirm: false,
                closeOnCancel: false
            }, function(isConfirm) {
                if (isConfirm)
                    data_obj.callback_fn(data_obj.room_info);
                else
                    sweetErrorAlert({
                        title: 'Cancel!',
                        body: 'Action cancelled by user',
                        type: 'error'
                    });
            });
        };

    /*-------------------- Delete Group ------------------ */
    ddpDeleteRoom = function(room_info) {
            // Delete the room by admin
            try {
                //["{"msg":"method","method":"eraseRoom","params":["7BQj2BupFeboNdi3j"],"id":"16"}"]
                niaaddp.ddp_method("eraseRoom", [room_info.roomid], function(err, res) {
                    if (res) {
                        sweetSuccessAlert({
                            title: 'Deleted!',
                            body: 'Room has been deleted',
                            type: 'success'
                        });
                        closeChatWindow();
                    } else if (err) {
                        sweetErrorAlert({
                            title: 'Delete!',
                            body: 'Room is not deleted',
                            type: 'error'
                        });
                    }
                });
            } catch (err) {
                showErr(err)
            }
        },
        ddpRemoveGroupMember = function(room_info) {
            // Remove a user from a group.
            try {
                //["{"msg":"method","method":"removeUserFromRoom","params":[{"rid":"qSfLR4aP7fWuaZDQL","username":"rackymuthu.ramasamy"}],"id":"24"}"]
                niaaddp.ddp_method("removeUserFromRoom", [{
                    "rid": room_info.current_room_id,
                    "username": room_info.username
                }], function(err, res) {
                    if (res) {
                        showSBGroupMembers(room_info);
                        sweetSuccessAlert({
                            title: 'User Removed!',
                            body: room_info.username + ' has been removed from ' + room_info.roomname,
                            type: 'success'
                        });
                    } else if (err) {
                        sweetErrorAlert({
                            title: 'User Remove!',
                            body: 'User is not removed!',
                            type: 'error'
                        });
                    }
                });
            } catch (err) {
                showErr(err)
            }
        },
        ddpLeaveRoom = function(room_info) {
            // current login user leave the group.
            try {
                //"{"msg":"method","method":"leaveRoom","params":["kxkfdTwGHRZS3qMXM"],"id":"19"}"]
                niaaddp.ddp_method("leaveRoom", [room_info.roomid], function(err, res) {
                    if (err) {
                        sweetErrorAlert({
                            title: 'Leave room!',
                            body: 'Error in leave group!',
                            type: 'error'
                        });
                    } else {
                        sweetSuccessAlert({
                            title: 'Leave room!',
                            body: 'You are left from ' + room_info.roomname,
                            type: 'success'
                        });
                        closeChatWindow();
                    }
                });
            } catch (err) {
                showErr(err)
            }
        },

        ddpSetAsOwner = function(room_info) {
            // Set selected user as room admin.
            try {
                //["{"msg":"method","method":"addRoomOwner","params":["qSfLR4aP7fWuaZDQL","jMnPkYNQFdweoqjsQ"],"id":"23"}"]
                //resetAddGroupmember();
                niaaddp.ddp_method("addRoomOwner", [room_info.roomid, room_info.ownerid], function(err, res) {
                    if (res) {
                        $('#remove-search-member').css('display', 'none');
                        ddpLeaveRoom(room_info);
                        //sweetSuccessAlert({title:'Set as owner!',body:'User '+room_info.username+' is now a owner of '+room_info.roomname,type:'success'});
                    } else if (err) {
                        sweetErrorAlert({
                            title: 'Set as owner!',
                            body: '',
                            type: 'error'
                        });
                    }
                });
            } catch (err) {
                showErr(err)
            }
        },

        ddpAddGroupMember = function(room_info) {
            // Add Group member API call function.
            try {
                //["{"msg":"method","method":"addUsersToRoom","params":[{"rid":"XfDNSCqDY2G5p3c9i","users":["rackymuthu.ramasamy","kuppuraj.sundaram"]}],"id":"19"}"]
                resetAddGroupmember();
                niaaddp.ddp_method("addUsersToRoom", [{
                    rid: room_info.current_room_id,
                    "users": room_info.user_list
                }], function(err, res) {
                    if (res) {
                        showSBGroupMembers(room_info);
                        sweetSuccessAlert({
                            title: 'Add users!',
                            body: 'The user have been added!',
                            type: 'success'
                        });
                    } else if (err) {
                        sweetErrorAlert({
                            title: 'Add users!',
                            body: 'The user is not added!',
                            type: 'error'
                        });
                    }
                });
            } catch (err) {
                showErr(err)
            }
        },
        // Delete Room Click
        $(document).on('click', '.sb_for_delete_room', function() {
            try {
                let login_user_id = niaauser.getuserid(),
                    roomid = niaaroom.getCurrentRoom();
                //room_obj=meeting.getRoomInfo(current_room_id);
                JSSweetAlert({
                    title: "Are you sure?",
                    text: "Deleting a room will delete all messages posted within the room. This cannot be undone.",
                    type: "warning",
                    confirm_btn_txt: "Yes, delete it!",
                    callback_fn: ddpDeleteRoom,
                    room_info: {
                        roomid: roomid
                    }
                });
            } catch (err) {
                showErr(err);
            }
        });

    // Remove user from group.
    $(document).on('click', '#remove_user_from_group', function(e) {
        // Remove user click function.
        try {
            e.stopPropagation();
            let roomid = niaaroom.getCurrentRoom(), //user_name=$(this).closest('div .chatUser').find('span').text();
                user_name = $(this).closest('div .chatUser').find('span').text(), //room_obj=niaaroom.searchRoom(roomid);
                room_obj = meeting.getRoomInfo(roomid);
            JSSweetAlert({
                title: "Are you sure?",
                text: "The user will be removed from " + room_obj.name + ".",
                type: "warning",
                confirm_btn_txt: "Yes, remove user!",
                callback_fn: ddpRemoveGroupMember,
                room_info: {
                    current_room_id: roomid,
                    username: user_name,
                    roomname: room_obj.name,
                    is_admin: true
                }
            });
        } catch (err) {
            showErr(err);
        }
    });

    $(document).on('click', '#add_group_member_submit_btn', function() {
        // Add group user click function.
        try {
            //addGroupMember.room_list = ['jMnPkYNQFdweoqjsQ']
            let roomid = niaaroom.getCurrentRoom(),
                room_name_list = meeting.getRoomName(addGroupMember.room_list);
            ddpAddGroupMember({
                current_room_id: roomid,
                user_list: room_name_list,
                is_admin: true
            });
        } catch (err) {
            showErr(err);
        }
    });

    $(document).on('click', '#sb_leave_group_lbl', function() {
        // Leave room click.
        try {
            let is_owner = $(this).attr('data-owner');
            if (is_owner === 'true') {
                // Group member as a admin so open set as admin modal.
                searchRoomName = {room_list:[]};
                $('#remove-search-member').css('display', 'block');
            } else {
                // Group member as a user leave group.
                let roomid = niaaroom.getCurrentRoom(),
                    roomname = niaauser.getCurrentUserName();
                JSSweetAlert({
                    title: "Are you sure?",
                    text: 'Are you sure you want to leave the group "' + roomname + '"?',
                    type: "warning",
                    confirm_btn_txt: "Yes, leave it!",
                    callback_fn: ddpLeaveRoom,
                    room_info: {
                        roomid: roomid,
                        roomname: roomname
                    }
                });
            }
        } catch (err) {
            showErr(err);
        }
    });

    $(document).on('click', '#set_owner_submit_btn', function() {
        //Room admin set owner and leave room.
        try {
            let roomid = niaaroom.getCurrentRoom(),
                roomname = niaauser.getCurrentUserName();
            if (searchRoomName.room_list[0]) {
                let username = meeting.getRoomName(searchRoomName.room_list[0]),
                    owner_id = searchRoomName.room_list[0].replace(niaauser.getuserid(), "");
                ddpSetAsOwner({
                    roomid: roomid,
                    roomname: roomname,
                    username: username,
                    ownerid: owner_id
                });
            } else {
                swal("Set as owner", "Select room owner from the list!", "error");
            }
        } catch (err) {
            showErr(err);
        }
    });

resetSetAsOwnerModal=function(){
  // Reset the set as owner modal.
  searchRoomName = {room_list:[]};
  $('#remove-search-member').css('display', 'none');
  $('#remove-search-member #fwd_selected_room').html('');
  $('#remove-search-member .user_search_box').val('');
  $('#remove-search-member .chat_room_list').html('');




}
    $(document).on('click', '#set_owner_cancel_btn  ', function() {
      // Cancel the set owner functionality.
      try{
        resetSetAsOwnerModal();
      } catch (err) {
          showErr(err);
      }
    });
    $(document).on('click', '.close_set_owner  ', function() {
      // Close the set owner functionality.
      try{
        resetSetAsOwnerModal();
      } catch (err) {
          showErr(err);
      }
    });




    /****************************** Remove user Sweet alaret Script ****************************
  swal({   title: "Are You Sure?",
    text: "You will remove this user from room?",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#DD6B55",
    confirmButtonText: "Yes, Remove!",
    cancelButtonText: "Cancel",
    closeOnConfirm: false,
    closeOnCancel: false },
    function(isConfirm){
      if (isConfirm){
        removeUserFrmGroup();
        swal("User Removed!", "Selected user is removed!", "success");
      }else{
        swal("", "User is not removed!", "error");
      } });
};
/****************************** Remove user Sweet alaret Script *****************************/

});
