Handlebars.registerHelper('userOrder', function(order,options) {
  if ((order != -1) && (order != -2)  && (order != 0)){
    return options.fn(this);
  }
  else{
    return options.inverse(this);
  }
});

Handlebars.registerHelper('ifMention', function(res,options) {
  if (res.mention != 0){
       return options.fn(this);
  }
  else{
    return options.inverse(this);
  }
});
Handlebars.registerHelper('ifUnread', function(res,options) {
  if (res.unread !=0 ){
       return options.fn(this);
  }
  else{
    return options.inverse(this);
  }
});
Handlebars.registerHelper('incCount', function(value) {
  // Serial number for the room user count.
  return parseInt(value)+1;
});


Handlebars.registerHelper('color', function(status,options) {
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
	    return 'mem-cir-img'
   }
  else{
    return 'mem-cir-img'
  }
});

Handlebars.registerHelper('msg-align', function(align,options) {
  if (align == getuserid()){
    return 'replies'
  }
  else{
    return 'sent'
  }
});

Handlebars.registerHelper('type', function(msg_type,options) {
  if (msg_type == 'image'){
    return 'img-attachment'
  }
  else if (msg_type == 'video'){
    return 'video-attachment'
  }
  else if (msg_type == 'url'){
    return 'img-wit-des'
  }
  else if (msg_type == 'msg'){
    return ''
  }else{
    return ''
  }
});


Handlebars.registerHelper('ip', function(uname,options) {
  if (uname){
    return location.protocol+'//'+window.location.hostname+'/niaa/avatar/'+uname+'?_dc=undefined'
  }
});



Handlebars.registerHelper('mailalign', function(uid,options) {
  if (uid == getuserid()){
    return options.fn(this);
  }
  else{
    return options.inverse(this);
  }
});


Handlebars.registerHelper('fwdselection', function(value,options) {
  if (value == true){
    return 'forward-selection'
  }
  else{
    return ''
  }
});
