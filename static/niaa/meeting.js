define('meeting', ['user','room','loadhistory','message'], function(niaauser,niaaroom,niaaloadhistory,niaamessage) {

	var location_protocol = location.protocol,ws_protocol;
    if(location_protocol == "http:"){
         ws_protocol = 'ws:';
    }else if(location_protocol == "https:"){
         ws_protocol = 'wss:';
    }

//   var socket = new WebSocket(ws_protocol+'//'+ window.location.hostname +'/niaa/users/');

//    socket.onopen = function open() {
//      console.log('WebSockets connection created.');
//    };

    if (socket.readyState == WebSocket.OPEN) {
      socket.onopen();
    }

    var momScheduler = setInterval(function(){
      let mom_chat_name=localStorage.getItem('mom_chat_name');
      if(mom_chat_name){
        let message="Meeting is going with "+mom_chat_name+" and transcripts are recording";
        if( $('.info-menu .pop-up-show-chat').hasClass("expanded") && rocket_chat_tab != 'hidden'){
          //Chat room is opend and current window tab is chat then show success msg.
          successNotification(message);
        }else{
          // Current window is not a chat then push notify.
          let obj = {};
              obj['uname'] = 'Meeting Alert';
              obj['msg'] = message;
          niaamessage.push_notify(obj,'alert');
        }
      }else{clearInterval(momScheduler);}
    },300000);

    resetLocalStorage=function () {
      // Reset the local storage MOM attributes.
      localStorage.removeItem('mom_chat_id');
      localStorage.removeItem('mom_chat_name');
      clearInterval(momScheduler);
      $('#recButton').removeClass();
      $('#recButton').addClass("notRec");
    },

  listenerAcceptMeeting  = function(roomid){
    // Listner meeting acceptance function.
    localStorage.setItem('mom_chat_id',roomid);
    mom_chat_name=getRoomName(roomid);
    localStorage.setItem('mom_chat_name',mom_chat_name);
    localStorage.setItem('status','started');
    successNotification("Meeting is started with "+mom_chat_name+" and transcripts are recording");
    setInterval(momScheduler);
    if(niaaroom.getCurrentRoom() == roomid){
      $('#recButton').removeClass();
      $('#recButton').addClass("Rec");
      $('#recButton').addClass("disableCursor");
    }
    else{
      $('#recButton').removeClass();
      $('#recButton').addClass("notRec");
      $('#recButton').addClass("disableCursor");
    }
  },

  senderAcceptMeeting = function(roomid){
    // Sender  Acceptance function.
    localStorage.setItem('mom_chat_id',roomid);
    mom_chat_name=getRoomName(roomid);
    localStorage.setItem('mom_chat_name',mom_chat_name);
    successNotification("Meeting is started with "+mom_chat_name+" and transcripts are recording");
    setInterval(momScheduler);
    if(niaaroom.getCurrentRoom() == roomid){
      $('#recButton').removeClass();
      $('#recButton').addClass("Rec");
    }
    else{
      $('#recButton').removeClass();
      $('#recButton').addClass("notRec");
      $('#recButton').addClass("disableCursor");
    }
  },
  listnerStopMeeting=function () {
    // Stop meeting for listner.
    successNotification("Meeting is stopped with "+localStorage.getItem('mom_chat_name')+" and transcripts are recording");
    resetLocalStorage();
    localStorage.removeItem('status');
  }

  socket.onmessage = function(event) {
    // Socket Connection response.
    if(event && "message" in $.parseJSON(event.data)){
      // Check the data in socket response.
      var data = $.parseJSON($.parseJSON(event.data)['message']);
      let roomid = data['roomid'];
      roomobj = getRoomInfo(roomid);
      if(data['sender'] != niaauser.getusername()){
        // Check for Listner side response.
        if(data['room_type'] == 'user'){
          // Meeting functionality for user.
          if(roomobj && data['status'] == 'Meeting Request' ){
            // Listner process the meeting request.
            if(!localStorage.getItem('mom_chat_id')){
              // Listner have no meeting then start new meeting.
              socket.send(JSON.stringify({'status':'OK','sender': niaauser.getusername(),'roomid':roomid,'room_type':data['room_type']}));
              listenerAcceptMeeting(roomid);
            }
            else if(localStorage.getItem('mom_chat_id')){
              // Listner have already in meeting then reject the request.
              mom_chat_name=getRoomName(roomid);
              socket.send(JSON.stringify({'status':'Rejected','sender': niaauser.getusername(),'roomid':roomid, 'room_type':data['room_type']}));
              errorNotification(mom_chat_name+" is trying to connect through meeting");
            }
          }
          else if(roomobj && data['status'] == 'OK' ){
            // Listner acceptance for sender.
            senderAcceptMeeting(roomid);
          }
          else if(roomobj && data['status'] == 'Rejected' ){
            //  Listner reject the request.
            let mom_chat_name=getRoomName(roomid);
            errorNotification(mom_chat_name+" already in meeting");
          }
          else if(localStorage.getItem('mom_chat_id') == roomid && roomobj  && data['status'] == 'Meeting Stopped'){
            // Sender meeting stop.
            listnerStopMeeting()
          }
        }
        else{
          // Group meeting.
          if(!localStorage.getItem('mom_chat_id') && roomobj && data['status'] == 'Meeting initaition' ){
            //  Listner meeting start acceptance.
            socket.send(JSON.stringify({'status':'Meeting Started','sender': niaauser.getusername(),'roomid':roomid, 'room_type':data['room_type']}));
            listenerAcceptMeeting(roomid);
          }
          if(!localStorage.getItem('mom_chat_id') && roomobj && data['status'] == 'Meeting Started' ){
            // Meeting acceptance of listner.
            senderAcceptMeeting(roomid);
          }
          else if(localStorage.getItem('mom_chat_id') == roomid && roomobj && data['status'] == 'Meeting Stopped'){
            // Group Meeting stop.
            listnerStopMeeting();
          }
        }
      }
    }
  }

    var messageTemplate,room_users_mail_id = [],
    timeDiffrence = function(start_time, end_time){
      if(start_time < end_time){
        // Get the HH and MM from time stamp
        let diff_seconds = end_time - start_time,
        hh = new Date(diff_seconds).getUTCHours(),
        mm = new Date(diff_seconds).getUTCMinutes();

        // If you were building a timestamp instead of a duration, you would uncomment the following line to get 12-hour (not 24) time
        // if (hh > 12) {hh = hh % 12;}
        // These lines ensure you have two-digits
        if (hh < 10) {hh = "0"+hh;}
        if (mm < 10) {mm = "0"+mm;}
        //if (ss < 10) {ss = "0"+ss;}
        // This formats your string to HH:MM
        return  hh+" Hour : "+mm+" Mins";
      }else{
        return '00 Hour : 01 Mins';
      }
    },
    momMsgProcessor = function(conversation){
      var momConversations = [],
      momMsgEdited=function(res){
        var obj={}, editedText;
        if ("urls" in res && !("ignoreParse" in res.urls["0"]) && ("headers" in res.urls["0"]) && "attachments" in res && res.attachments["0"].attachments.length){
          urlsResp = niaaloadhistory.hasReplyMsg(res);
          editedText = urlsResp;
          obj['isReply'] = true;
        }
        else if ("urls" in res && !("ignoreParse" in res.urls["0"]) && ("headers" in res.urls["0"]) && "attachments" in res && !(res.attachments["0"].attachments.length)){
          urlsResp = niaaloadhistory.hasReplyMsg(res);
          editedText = urlsResp;
          obj['isReply'] = true;
        }
        else if('urls' in res && 'ignoreParse' in res.urls["0"]){
        // Edited message have reply
          attachRes = momReplyMsg(res);
          editedText = attachRes;
        }else if ("urls" in res && !("ignoreParse" in res.urls["0"]) && ("headers" in res.urls["0"])){
          // Edited message have URL
          urlsResp = niaaloadhistory.hasMultipleURLs(res);
          editedText = urlsResp.msg;
        }else if('attachments'in res){
          //Edited message have attachment then
          attachRes = hasAttachement(res.attachments["0"]);
          editedText = attachRes.msg;
        }
        else{
          editedText = res.msg;
        }
        let date_str = moment(res.editedAt.$date).format("lll");
        // obj['isEdited'] = 'edited at '+date_str+' by '+res.editedBy.username;
        obj = editedText;
        return obj
      },
  momReplyMsg=function(res){
    var obj={}, fileObj=undefined, base_msg=undefined, reply_msg=undefined, attach_resp=undefined,
    base_author_name=res.attachments[0].author_name,
    base_msg_time = findAmPmTimeFormat(new Date(res.attachments[0].ts.$date)),
    reply_msg_time=findAmPmTimeFormat(new Date(res.ts.$date));
  // Reply message for attachment
  if(res.attachments["0"].attachments.length && "title_link" in res.attachments["0"].attachments["0"]){
    fileObj = res.attachments[0].attachments[0];
    attach_resp = momAttachement(fileObj);
    base_msg = attach_resp.msg;
  }else if('urls' in res && 'ignoreParse' in res.urls["0"]){
    base_msg = baseMsg(res);
  }
  if(res.urls.length>=2){
    // Reply message is URL MSG => URL
    let urls_resp = momMultipleURLs(res.urls);
    reply_msg = urls_resp.msg;
    // Remove the first recived text message
    checkPreviousURL(res);
  }else if(res.urls.length<2){
    // Normal text msg TXT => TXT
    let msgobj = niaaloadhistory.replyMsg(res);
    reply_msg = msgobj.msg;
  }
  // let base_msg_element = '<div class=pert-replay><img class=pert-img src='+userAvatarURL+base_author_name+'?_dc=undefined alt="">'
  // +'<span>'+base_author_name+'</span><span class=send-date-rlp>'+base_msg_time+'</span><p>'+base_msg+'</p></div>';
  // //var final_reply_str= "<br>"+base_author_name+"<br>"+base_msg+"<br>"+base_msg_time+"<br><div class=attachment-flex>"+reply_msg+"</div>";
  // let final_reply_str= base_msg_element+"<div class=attachment-flex>"+reply_msg+"</div>";
  obj['base_msg'] = base_msg;
  obj['base_author'] = base_author_name;
  obj['base_time'] = base_msg_time;
  obj['reply_msg'] = reply_msg;
  // obj['msg']=final_reply_str;
  obj['ct']=reply_msg_time;
  obj['isReply'] = true;
  return obj;
  },
  momAttachement=function(attachObj){
    try{
      var obj=[],
    attachment_str=undefined;
    //attachObj=res;
    if ('image_type' in attachObj){
      var msg_type = 'image';
      attachment_str = '<div class=attachment><div class=attachment-title> \
      <a href='+location.protocol+'//'+window.location.hostname+attachObj.title_link+' target=_blank><i class="fa fa-download"></i> '+ attachObj.title +'</a> </div></br> \
      <div><figure><img src='+location.protocol+'//'+window.location.hostname+attachObj.title_link+' alt=File Thumbnail> \
      <figcaption>'+attachObj.description+'</figcaption></figure></div></div> </br>';
    }
    else {
      var msg_type = 'File';
      attachment_str = '<div class=attachment> <div class=attachment-title> \
      <a href='+location.protocol+'//'+window.location.hostname+attachObj.title_link+' target=_blank><i class="fa fa-download"></i> '+ attachObj.title +'</a> </br> </div>\
      <div class=attachment-description>'+attachObj.description+'</div> </div>'
    }
    obj['msg_type'] =  msg_type
    obj['msg']=attachment_str;
    return obj;
    }catch(err){showErr(err)}
  },
  momMessageFormat=function(data, update_data){
    //ts = timestamp, rid = roomid, id=msg id, msg = text message,ct = convesation time with am / pm
    var res = {
      username:data.u.username,
      msg:data.msg,
      time_str:findAmPmTimeFormat(new Date(data.ts.$date)),
      uid:data.u._id,
      // isEdited:undefined,
      isReply:undefined,
      msg_type:'msg',
      base_msg:undefined,
      base_author:undefined,
      reply_msg:undefined,
      base_time:undefined,
    };
    if (update_data){res = Object.assign(res, update_data)}
      addConversation(res);
  },
  addConversation = function(data){
    momConversations.push(data)
  },
  momMultipleURLs=function(res){
    let url_str = {};
    url_str['msg']='';
    // 0 th index have ignore parse. this is not URL. So this is omited
    for (let url=0;url< res.length;url++){
      if(!("ignoreParse" in res[url])){
        // Check the ignore parse key for this is not reply message.
        let resp = momURLs(res[url]);
        url_str['msg'] += ''+resp['msg']+"<br>";
      }
    }
    return url_str;
  },
  momURLs=function(res){
    var obj={};
    if('meta' in res){
      if(res.meta && res.meta.ogUrl && res.meta.ogImage && res.meta.description){
        // Meta informations about the url.
        obj['msg']="<a href='"+res.meta.ogUrl+"' target='_blank'>"+res.meta.ogUrl+"</a>";
      }
      else if(res.meta && res.meta.ogUrl && res.meta.ogImage && res.meta.ogDescription){
        obj['msg']= "<a href='"+res.meta.ogUrl+"'target='_blank'>"+res.meta.ogUrl+"</a>";
      }
      else if(res.meta && res.meta.ogUrl && !(res.meta.ogImage)){
        //Meta null for image URL.
        obj['msg']="<a href='"+res.meta.ogUrl+"' target='_blank'>"+res.meta.ogUrl+"</a>";
      }
      else{
        obj['msg']="<a href='"+res.url+"' target='_blank'>"+res.url+"</a>";
      }
    } else{
      // Reply msg for txt to url
      obj['msg']= ''+res.url;
    }
    return obj;
  };
  for (let currentMsg=0;currentMsg<conversation.messages.length;currentMsg++){
    var res=conversation.messages[currentMsg];
    if ('editedBy' in res){ var update_data=momMsgEdited(res);momMessageFormat(res,update_data);}//message is edited by user
    else if ('urls' in res && res.urls[0].ignoreParse){ var update_data=momReplyMsg(res);momMessageFormat(res,update_data);}//message replied by user
    else if ("urls" in res && !("ignoreParse" in res.urls["0"]) && ("headers" in res.urls["0"])){var update_data=momMultipleURLs(res.urls);momMessageFormat(res,update_data);}
    else if (!('urls' in res) && ('attachments'in res)){ var update_data=momAttachement(res.attachments[0]);momMessageFormat(res,update_data);}//message with image or video or files
    else{momMessageFormat(res);}
  }
  return momConversations;
  },
  loadMOMMsgFn = function(res){
    if(res.messages.length) {
      res.users_list = momUserMailList;
      let header = {},message_selected,
      start_time = res.messages[0].ts.$date,
      end_time = res.messages[res.messages.length-1].ts.$date;

      // date = new Date(start_time),
      // time = date.toLocaleTimeString('en-US');
      // date.setDate(date.getDate() - 1);
      //header.date_string = date.getDate()+"/"+shortMonthNames[date.getMonth()]+"/"+date.getFullYear()+', '+time;
      header.date_string = moment(start_time).format("L")+' '+moment(start_time).format("LT");
      header.room_name=$('.chatheader .team-name').text().trim();
      header.chaired_by = niaauser.getusername();
      // Calculate the meeting time.
      if(res.messages.length >= 2){
        header.charge_time = timeDiffrence(start_time, end_time);
      }else{
        header.charge_time = '00 Hour : 01 Mins';
      }

      res.header = header;
      //res['title']=; // Add the meeting or project name.
      res.messages = momMsgProcessor(res);

      momTemplate = Handlebars.templates.mom({'res':res});
      messageTemplate = Handlebars.templates.mom_message({'res':res});
      momformatTemplate = Handlebars.templates.mom_format({'res':res});
      //$('#users_list').html(momTemplate);
      room_users_mail_id = [];
      for(let user_obj of momUserMailList){
        room_users_mail_id.push(user_obj.email_id);
      }
      $("#mail_preview_div").html(momTemplate);
      $('#subjectname').val('Transcript on '+header.room_name+' at '+header.date_string+' Duration -'+res.header.charge_time)
      $("#mailPreviewModal").css('display',"block");
    }
  }
  $(document).on('click', '.mail_submit_btn', function() {
    let toAddressList = [],subject;
    toMailList = $('.to-list-sec p').length;
    subject = $('#subjectname').val();
    for ( var i = 0; i < toMailList; i++ ) {
      toAddressList.push( $('.to-list-sec p')[ i ].textContent );
    }
    var momButton = $("#mailPreviewModal");
    if($("input[name=optionsRadios]:checked").val() == 'MOM'){
      message_selected = momformatTemplate
    }
    else if($("input[name=optionsRadios]:checked").val() == 'Chat'){
      message_selected = messageTemplate
    }
    sendMomMail(toAddressList,message_selected, subject);
  });

  sendMomMail=function(room_users_mail_id,message_selected,subject){
    $("#mailPreviewModal").css('display',"none");
    $.ajax({
      method: 'POST',
      url: location.protocol+"//"+window.location.hostname+"/niaa/mail/send_mail/", // Hard-coded for the Mailing URL
      data:{mail_id_list:room_users_mail_id,
        html_content: message_selected,
        subject: subject,
      },
      crossDomain:true,
      success: function(result){momUserMailList = [];successNotification('Chat Transcript has been sent '+msg_animation)},
      error: function(data, error){momUserMailList = [];console.log(data)}
    });
  },
  meetingStopFn = function(){
      // Meeting stop supporting function.
      if(localStorage.getItem('mom_conv_count') >= 1){
        // Check for conversations available.
        let momObj = {};
        momObj.start_time=parseInt(localStorage.getItem('mom_start_time'));
        momObj.chat_id=localStorage.getItem('mom_chat_id');
        momObj.conv_count=parseInt(localStorage.getItem('mom_conv_count'));
        momObj.end_time=new Date().getTime();
        momDataList.push(momObj);
        // Prepare the MOM preview.
        niaaroom.ddpGetUsersOfRoom ({current_room_id:niaaroom.getCurrentRoom()},true,retreiveEmailId);
        niaaloadhistory.ddpLoadNextMessage(momObj.chat_id, momObj.conv_count, {"$date": momObj.start_time},loadMOMMsgFn);
      }else{
        // No records found then show error message.
        errorNotification("You haven't recoreded any conversastions");
      }
      // Reset the local storage MOM attributes.
      localStorage.removeItem('mom_start_time');
      localStorage.removeItem('mom_conv_count');
      resetLocalStorage();

  },
  retreiveEmailId = function(res){
    try{
      let result = (usersList.users).filter(o1 => (res.records).some(o2 => o1._id === o2._id));
      for (let user of result){
        let users= {};
        users['user_name'] = user.username;
        users['email_id']  = user.emails["0"].address;
        momUserMailList.push(users);
      }
    }catch(err){showErr(err)}
  },
  recordMeeting = function(res){
    // Get the first conversation time
    try{
      if(!localStorage.getItem('status')){
      if(!localStorage.getItem('mom_conv_count')){
        localStorage.setItem('mom_start_time',(res.ts.$date-10));
        localStorage.setItem('mom_conv_count',0);
      }
      localStorage.setItem('mom_conv_count',parseInt(localStorage.getItem('mom_conv_count'))+1);
    }
    }catch(err){showErr(err)}
  },
  getRoomInfo=function(rid){
    try{
      // Get the room infor from room id from the all room information.
      let chat_user_id= rid.replace(niaauser.getuserid(),'');
      if(!chat_user_id){chat_user_id=rid};// Channel or Group then no need to replace.
      let rooms_info = niaaroom.getRoom();
      let room_obj;
      for(let chat_type in rooms_info){
        let chat_rooms=rooms_info[chat_type];
        room_obj = chat_rooms.find(room=> room._id===chat_user_id);
        if(room_obj) return room_obj;
      }
      return;
    }catch(err){showErr(err)}
  },
  getRoomName = function(rid){
    // Get the room name from room id.
    try{
      if(typeof(rid)==='string'){
        let room_obj=getRoomInfo(rid);
        if(room_obj.name){return room_obj.name;}
        else if(room_obj.username){return room_obj.username;}
        else{return};
      }else if(Array.isArray(rid)){
        let room_list=[];
        for(let room of rid){
          let room_obj=getRoomInfo(room);
          if(room_obj.name){room_list.push(room_obj.name);}
          else if(room_obj.username){room_list.push(room_obj.username);}
        }
        return room_list
      }else{return}
    }catch(err){showErr(err)}
  }

  /************************************************* MOM Record ***********************************/
  $('#recButton').addClass("notRec");

  $('#recButton').click(function(){
    // Meeting start stop button functionality.
    if($('#recButton').hasClass('notRec')){
      // Start meeting and record mom.
      let mom_room_id=niaaroom.getCurrentRoom();
      if(niaaroom.getCurrentRoomType() == 'user'){
        // Meeting  request for user.
        socket.send(JSON.stringify({'status':'Meeting Request', 'sender': niaauser.getusername(),'roomid':mom_room_id, 'room_type':niaaroom.getCurrentRoomType()}));
      } else{
        // Meeting request for channels and groups.
        socket.send(JSON.stringify({'status':'Meeting initaition', 'sender': niaauser.getusername(),'roomid':mom_room_id, 'room_type':niaaroom.getCurrentRoomType()}));
      }
      socket.onmessage();
    }
    else{
      // Stop meeting.

      let mom_room_id=localStorage.getItem('mom_chat_id');
      socket.send(JSON.stringify({'status':'Meeting Stopped', 'sender': niaauser.getusername(), 'roomid':mom_room_id})); // Brodcast the meeting stop.
      socket.onmessage();
      meetingStopFn('Stop');
    }
  });

  $(document).on('click', '#mailtoclose', function() {
    $(this).parent().remove();
  });

  $(document).on("click", "#mail_preview_close", function() {
    //Focus the selected conversation.
    momUserMailList = [];
    $('#mail_preview_div').empty();
    $('#mailPreviewModal').css('display','none');
  });

  $(document).on("click", "#format_radio", function() {
    if($("input[name=optionsRadios]:checked").val() == 'MOM'){
      $('#transcript_format').removeClass();
      $('#transcript_format').html(momformatTemplate);
    }
    else if($("input[name=optionsRadios]:checked").val() == 'Chat'){
      $('#transcript_format').addClass('sub-point');
      $('#transcript_format').html(messageTemplate);
    }
  })

  return {
    loadMOMMsgFn:loadMOMMsgFn,
    getRoomName:getRoomName,
    getRoomInfo:getRoomInfo,
  }

})
