// helper function - creates DOM elem with class and id name
define('chatbox', ['room', 'message', 'user'], function(niaaroom, niaamsg, niaauser) {

    var rooms = {
        'user': [],
        'group': [],
        'channel': []
    }
      , roomsType = {
        'c': 'channel',
        'p': 'group',
        'd': 'user'
    }
      , is_new_room = true,
      count = 0;
    count1 = 0;
    var setRoomOrder = function() {
        var msg = niaamsg.getUnreadAndMentions();
        var room = niaaroom.getRoom();
        set_user_order(room.user, msg.user);
        set_group_order(room.group, msg.group);
        set_channel_order(room.channel, msg.channel);
        roomsInfo = rooms;
        roomcount();
    }
      , roomUpdateHandler = function() {
        var res = niaamsg.getLastMsgReceivedRoom()
        updateChangesReceivedRoom(res);
        roomsInfo = rooms;
    }
      , //  this is called when new message received in any user or group or channel

    updateChangesReceivedRoom = function(res) {
        //the order of channel or group is based on unread and mention
        //update the channel or group when new msg receive
        // rooms = {
        //     'user': [],
        //     'group': [],
        //     'channel': []
        // }
        // setRoomOrder();
        if ((res.type == 'c') || (res.type == 'p')) {
            // Check the room type channel or private
            let room_type=roomsType[res.type];
            let room_index = rooms[room_type].findIndex(obj => (obj.id == res.id)); // Find the rooms object index
            if(room_index!=-1){
                // If user index found then update the values.
                rooms[room_type][room_index]['unread'] = res.unread;
                rooms[room_type][room_index]['mention'] = res.mention;
                rooms[room_type][room_index]['order'] = Math.max(res.unread, res.mention);
            }else{
                let new_room_obj = {id:res.id,mention:res.mention,type:res.type,name:res.name,unread:res.unread,order:Math.max(res.unread, res.mention)}
                rooms[room_type].push(new_room_obj);
            }
        }

       /* 

       if ((res.type == 'c') || (res.type == 'p')) {
            //find the room type
            for (let i of rooms[roomsType[res.type]]) {
                if (i.id == res.id) {
                    i['unread'] = res.unread;
                    i['mention'] = res.mention;
                    i['order'] = Math.max(res.unread, res.mention);
                    is_new_room = false;
                    break;
                }
            }
        }
*/
        //if room is user
        //the order of user is based on the unread and user status
        else {
            // room type may have Direct
            let room_type = roomsType[res.type],
            room_index = rooms[room_type].findIndex(obj => (obj.uname == res.name)); // Find the rooms object index
            if(room_index!=-1){
                // If user index found then update the values.
                let room_obj = rooms[room_type][room_index];
                if (room_obj['unread'] != 0) {
                    room_obj['order'] = res.unread;
                } else if (room_obj['status'] == 'online') {
                    room_obj['order'] = -1;
                } else if (room_obj['status'] == 'offline') {
                    room_obj['order'] = -2;
                }
            }else{
                let new_room_obj = {id:(res.id).replace(niaauser.getuserid(),''),uname:res.name,unread:res.unread,order:Math.max(res.unread, res.mention)}
                rooms[room_type].push(new_room_obj);
            }


           /* for (let roomresp of rooms[room_type]) {
                if (roomresp.uname == res.name) {
                    if (roomresp.unread != 0) {
                        roomresp['order'] = res.unread;
                        break;
                    } else if (roomresp.status == 'online') {
                        i['order'] = -1;
                        break;
                    } else if (roomresp.status == 'offline') {
                        i['order'] = -2;
                        break;
                    }
                }
            }*/
        }
        //after set the room order sort room list
        room_sorting(rooms[roomsType[res.type]])
        //after sorting show the particular room list
        if (res.type == 'c') {
            show_channel();
        } else if (res.type == 'p') {
            show_group()
        } else if (res.type == 'd') {
            show_user();
        }
        roomcount();
    }
      , msg_change_handler_obj = {
        roomUpdateHandler: roomUpdateHandler
    }
    niaamsg.msgChangeHandler(msg_change_handler_obj);

    loadRoomInfo = function(current_func_count) {
        count = count + current_func_count
        if (count == 3) {
            //this function only call, after three dependancy function is done
            setRoomOrder();
        }
    }
    ,
    callRecentChatCounter = function(current_func_count) {
        //Recent chat list if the Direct and Get Room  Info API executed
        count1 = count1 + current_func_count
        if (count1 == 2) {
            //Direct users and room/get functions are executed then only the recent room list executed
            niaaroom.setInitRecentChat();
        }
    }
    ,
    room_sorting = function(key) {
        key.sort(function(first, second) {
            return second.order - first.order
        });
    }
    ,
    set_channel_order = function(roomObj, roomMsgObj) {
        for (let currentRoomObj of roomObj) {
            for (let currentRoomMsgObj of roomMsgObj) {
                if (currentRoomObj._id == currentRoomMsgObj.rid) {
                    setCurrentRoomOrder(currentRoomMsgObj)
                    break;
                }
            }
        }
        room_sorting(rooms.channel);
        show_channel();
    }
    ,
    set_group_order = function(roomObj, roomMsgObj) {
        for (let currentRoomObj of roomObj) {
            for (let currentRoomMsgObj of roomMsgObj) {
                if (currentRoomObj._id == currentRoomMsgObj.rid) {
                    setCurrentRoomOrder(currentRoomMsgObj)
                    break;
                }
            }
        }
        room_sorting(rooms.group);
        show_group();
    }
    ,
    // if user have mention message thats also count in unread
    setCurrentRoomOrder = function(currentRoomMsgObj) {
        var current_channel_order = {
            'id': currentRoomMsgObj.rid,
            'name': currentRoomMsgObj.name,
            'unread': currentRoomMsgObj.unread,
            'mention': currentRoomMsgObj.userMentions,
            'order': Math.max(currentRoomMsgObj.unread, currentRoomMsgObj.userMentions)
        }
        // roomsMsgHandler(roomsType[currentRoomMsgObj.t], current_channel_order)
        var room_type = roomsType[currentRoomMsgObj.t];
        rooms[room_type].push(current_channel_order)
    }
    ,
    show_channel = function() {
        $('.owl-carousel.channels').trigger('destroy.owl.carousel');
        $niaahtml.channels.empty()
        var html = Handlebars.templates.channels({
            'CHANNEL': rooms.channel
        });
        $niaahtml.channels.append(html);
        carousel('channels');
    }
    ,
    set_user_order = function(room, msg) {
        for (let current_room of room) {
            var user_flag = false;
            for (let current_msg of msg) {
                if (current_room.name === current_msg.fname) {
                    user_flag = true;
                    current_user_order(current_room, current_msg)
                    break;
                }
            }
            if (user_flag == false) {
                var status = {
                    'online': -1,
                    'offline': -2,
                    'away': -2,
                    'busy': -2
                }
                dict = {
                    'id': current_room._id,
                    'uname': current_room.username,
                    'status': current_room.status,
                    'order': status[current_room.status]
                }
                rooms.user.push(dict)
            }
        }
        room_sorting(rooms.user);
        show_user();
    }
    ,
    current_user_order = function(current_room, current_msg) {
        if (current_msg.unread != 0) {
            var current_room_dict = {
                'id': current_room._id,
                'uname': current_room.username,
                'status': current_room.status,
                'order': current_msg.unread
            }
        } else if (current_room.status == 'online') {
            var current_room_dict = {
                'id': current_room._id,
                'uname': current_room.username,
                'status': current_room.status,
                'order': -1
            }
        } else {
            var current_room_dict = {
                'id': current_room._id,
                'uname': current_room.username,
                'status': current_room.status,
                'order': -2
            }
        }
        rooms.user.push(current_room_dict)
    }
    ,
    show_user = function() {
        $('.owl-carousel.users').trigger('destroy.owl.carousel');
        ignoreUser(rooms.user);
        $niaahtml.users.empty();
        var html = Handlebars.templates.users({
            'USER': rooms.user
        });
        $niaahtml.users.append(html);
        carousel('users');
    }
    ,
    show_group = function() {
        $('.owl-carousel.groups').trigger('destroy.owl.carousel');
        $niaahtml.groups.empty();
        var html = Handlebars.templates.groups({
            'GROUP': rooms.group
        });
        $niaahtml.groups.append(html);
        carousel('groups');
    }
    ,
    createDOMElem = function(tag, name) {
        var elem = document.createElement(tag);
        elem.id = name;
        elem.classList.add(name);
        return elem;
    }
    ,
    // create main chat box container
    // var liveChatBoxCreate = function() {
    //   var box = createDOMElem('div', 'live-chat-box');
    //   var boxHeader = createDOMElem('div', 'live-chat-box-header');
    //   var messagesList = createDOMElem('div', 'live-chat-messages');
    //   var fileUplodaDiv = createDOMElem('div', 'file-upload-div');
    //   var msgSearchDiv = createDOMElem('div', 'msg-search-div');
    //
    //   var submitInput = createDOMElem('textarea', 'live-chat-submit-input');
    //   submitInput.rows = '1';
    //   submitInput.cols = "45";
    //   submitInput.placeholder = 'Send message...';
    //   boxHeader.innerHTML = '<div class="live-chat-header-title"> NIAA Chat </div>';
    //
    //   fileUplodaDiv.innerHTML = "<input id=fileupload_input type=file multiple=multiple></input>";
    //
    //   msgSearchDiv.innerHTML = "<input id=msg_search_txt type=text  placeholder='Search Messages' autocomplete=off></input><div id=search_msg_disp_div></div>";
    //   box.appendChild(msgSearchDiv);
    //   box.appendChild(boxHeader);
    //   box.appendChild(messagesList);
    //   box.appendChild(submitInput);
    //   box.appendChild(fileUplodaDiv);
    //   document.body.appendChild(box);
    // };
    // create chat box message item
    liveChatBoxMessage = function(fields) {
        var node = document.createElement('div');
        var messageNode = document.createElement('div');
        var avatar;
        node.classList.add('live-chat-message-item');

        messageNode.classList.add('message');
        messageNode.appendChild(document.createTextNode(fields.msg));
        node.appendChild(messageNode);

        return node;
    }
    ;

    // Get the modal
    var modal = document.getElementById('exampleModalCenter');

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    $(document).on('click', '.file_attachment', function() {
        $('#fileupload_input').click();
    });

    // When the user clicks on the button, open the modal
    $(document).on('change', '#fileupload_input', function(event) {
        modal.style.display = "block";
        let upload_files = event.target.files;
        uploadFiles = Array.from(upload_files);
        showFileUploadPreview(uploadFiles[0]);

        // When the user clicks on <span> (x), close the modal
        span.onclick = function() {
            modal.style.display = "none";
        }

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    });
    var showFileUploadPreview = function(file) {
        // Upload file preview form the audio , video, image and documents.
        $("#file_upload_preview_div").html('');

        let file_type = (file.type).split('/')[0]
          , // Get the file type

        file_name = document.createElement('input')
          , file_desc = document.createElement('textarea')
          , div = document.createElement('div');

        file_name.classList.add('form-control');
        file_name.value = file.name;
        file_name.id = 'file_name_input';

        file_desc.classList.add('form-control');
        file_desc.placeholder = 'File description';
        file_desc.id = 'file_description_input';

        if (file_type === 'audio') {
            let audio = document.createElement('audio');
            audio.classList.add('prev_window');
            audio.controls = true;
            audio.src = URL.createObjectURL(file);

            appendPreview(audio, file_name, file_desc);
        } else if (file_type === 'image') {
            var img = document.createElement('img');
            img.classList.add('md-img-name');
            img.src = URL.createObjectURL(file);

            appendPreview(img, file_name, file_desc);
        } else if (file_type === 'video') {
            var video = document.createElement('video');
            video.classList.add('prev_window');
            video.controls = true;
            video.src = URL.createObjectURL(file);

            appendPreview(video, file_name, file_desc);
        } else {
            div.append(file.name + ' - ' + formatBytes(file.size));

            appendPreview(div, file_name, file_desc);
        }

    }
      , appendPreview = function(resource, file_name, file_desc) {
        $("#file_upload_preview_div").append(resource, file_name, file_desc);
    }
      , formatBytes = function(bytes, decimals) {
        // Convert bytes to user readable format.
        if (bytes === 0) {
            return '0 Bytes';
        }
        const k = 1000;
        const dm = (decimals + 1) || 3;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    }

    roomcount = function() {
       roomCountinfo = rooms;
        for (var key in roomCountinfo) {
            var count = 0;
            var mention = 0;
            for (var i = 0; i < roomCountinfo[key].length; i++) {
                if (key == 'channel') {
                    count += roomCountinfo[key][i].order
                    mention += roomCountinfo[key][i].mention
                } else if (key == 'group') {
                    count += roomCountinfo[key][i].order
                    mention += roomCountinfo[key][i].mention
                } else if (key == 'user' && roomCountinfo[key][i].order > 0) {
                    count += roomCountinfo[key][i].order
                }
            }
            if (count >= 0 && key == 'user') {
                if (count == 0) {
                    $('.circle-1.users .group-top-msg').remove();
                }
                if (count > 0) {
                    $('.circle-1.users .group-top-msg').remove();
                    $('.circle-1.users').append("<span class='group-top-msg'>" + count + "</span>");
                }
            } else if ((count >= 0 || mention >= 0) && key == 'group') {
                if (count == 0 || mention == 0) {
                    $('.circle-1.groups .group-top-msg').remove();
                    if (mention == 0) {
                        $('.circle-1.groups .group-member-list').remove();
                    }
                }
                if (count > 0 || mention > 0) {
                    $('.circle-1.groups .group-top-msg').remove();
                    $('.circle-1.groups').append("<span class='group-top-msg'>" + count + "</span>");
                    if (mention > 0) {
                        $('.circle-1.groups .group-member-list').remove();
                        $('.circle-1.groups').append("<span class='group-member-list'>" + mention + "</span>");
                    }
                }
            } else if ((count >= 0 || mention >= 0) && key == 'channel') {
                if (count == 0 || mention == 0) {
                    $('.circle-1.channels .group-top-msg').remove();
                    if (mention == 0) {
                        $('.circle-1.channels .group-member-list').remove();
                    }
                }
                if (count > 0 || mention > 0) {
                    $('.circle-1.channels .group-top-msg').remove();
                    $('.circle-1.channels').append("<span class='group-top-msg'>" + count + "</span>");
                    if (mention > 0) {
                        $('.circle-1.channels .group-member-list').remove();
                        $('.circle-1.channels').append("<span class='group-member-list'>" + mention + "</span>");
                    }
                }
            }
        }
    }

    return {
        loadRoomInfo: loadRoomInfo,
        showFileUploadPreview: showFileUploadPreview,
        // liveChatBoxCreate:liveChatBoxCreate,
        // callRecentRoomList:callRecentRoomList,
    }
});