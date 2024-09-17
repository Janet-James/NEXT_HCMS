define('file', ['ddp','room','user', 'chatbox','meeting'], function(niaaddp,niaaroom,niaauser,chatbox,niaameeting) {
ddpUFSCreate = function(file){
 try{
    niaaddp.ddp_method("ufsCreate", [{'name': file.name ,'size':file.size,'type':file.type,'rid':fileUpload.room_list[0],'description':file.description,'store':'Uploads'}], function(err, res) {
      if (res){
        //No error and have response then call the file split and upload function
        chunkupload(res, file);
      }else {
        if(fileUpload.isFrom == 'forward'){
        let uname = niaameeting.getRoomName(fileUpload.room_list[0]);
        niaaddp.ddp_method("createDirectMessage", [uname], function(err, res){
          if(res) ddpUFSCreate(fileUpload.file);
        });
        }
        else{showErr(err.error);}
      }
    });
  }catch(err){errorNotification(err)}
}
getFile = function (){
// file info from file input.
  try{
      fileUpload.start_time=Date.now();// Set the upload starting time.
      let file= uploadFiles[0];
      var newFile = new File([file], $('#file_name_input').val(), {type: file.type});
      newFile.description = $('#file_description_input').val();
      // display the loading.
      fileUploadLoading();
      ddpUFSCreate(newFile);
    }
    catch(err){showErr(err)}
}
base64encode = function(str) {
  var CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var out = "", i = 0, len = str.length, c1, c2, c3;
  while (i < len) {
    c1 = str.charCodeAt(i++) & 0xff;
    if (i == len) {
      out += CHARS.charAt(c1 >> 2);
      out += CHARS.charAt((c1 & 0x3) << 4);
      out += "==";
      break;
    }
    c2 = str.charCodeAt(i++);
    if (i == len) {
      out += CHARS.charAt(c1 >> 2);
      out += CHARS.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
      out += CHARS.charAt((c2 & 0xF) << 2);
      out += "=";
      break;
    }
    c3 = str.charCodeAt(i++);
    out += CHARS.charAt(c1 >> 2);
    out += CHARS.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
    out += CHARS.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
    out += CHARS.charAt(c3 & 0x3F);
  }
  return out;
}

b64toBlob = function (b64Data, contentType, sliceSize) {
  contentType = contentType || '';
  sliceSize = sliceSize || 1024;

  var byteCharacters = atob(b64Data);
  var byteArrays = [];

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize);

    var byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    var byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  var blob = new Blob(byteArrays, {type: contentType});
  return blob;
}
forwardNotification = function(){
// Fordward message notification for single and multiple.
  let room_length = fileUpload.room_list.length, notification_msg = '';
  if(room_length && room_length==1){
    notification_msg = 'Forwarding to '+niaameeting.getRoomName(fileUpload.room_list[0]);
  }else if(room_length && room_length>1){
    notification_msg = 'Forwarding to '+niaameeting.getRoomName(fileUpload.room_list[0])+' and remaining '+(room_length-1)+' more.';
  }
  else{
    notification_msg = 'Forwarded to selected users';
  }
  successNotification(notification_msg);
//successNotification('Forwarding to '+niaameeting.getRoomInfo(fileUpload.room_list[0])+' and remaining '+'')
}
getFileFromURL= function(file_obj, callback){
  successNotification('Forwarding to selected user');
  $.ajax({
    url: restHeartURL+'rocketchat/rocketchat_uploads.files/'+file_obj._id+'/binary',
    type: "GET",
    headers: {
      "Authorization" : "Basic " +  btoa("a:a")
    },
    mimeType: "text/plain; charset=x-user-defined"
  }).done(function( data, textStatus, jqXHR ) {
    blob_file = b64toBlob(base64encode(data) ,file_obj.type, 1024);
    blob_file.name= file_obj.name;
    blob_file.description = file_obj.description;
    fileUpload.file = blob_file;

    forwardNotification();
    return callback(blob_file);
  });
}
forwardMessageFn=function(file_obj){
  getFileFromURL(file_obj,ddpUFSCreate);
}
fileUploadLoading = function(){
let user_avatar = '<li class="replies message-data" id="file_upload_loading_li">'
      +'<img src='+userAvatarURL+niaauser.getusername()+'?_dc=undefined alt="">'
      +'<div class="date-time ">'
      +'<div class="send-name">'+niaauser.getusername()+'</div>'
      +'<div class="mesg-bg">'
      +'<div id="file_upload_loading">'
      +'<div class="circlechart" data-percentage="0"><svg class="circle-chart" viewBox="0 0 33.83098862 33.83098862" xmlns="http://www.w3.org/2000/svg"><circle class="circle-chart__background" cx="16.9" cy="16.9" r="15.9"></circle><circle class="circle-chart__circle success-stroke" stroke-dasharray="0,100" cx="16.9" cy="16.9" r="15.9"></circle><g class="circle-chart__info">   <text class="circle-chart__percent" x="17.9" y="15.5">0%</text> </g></svg></div><span class="cir-name-loading">Uploading.......</span>'
      +'</div></div></div></li>';

      $('.live-chat-messages #conv_msg_ul').append(user_avatar);
}

chunkupload = function(res, file) {

  try{
    var blobs = [],
    bytes_per_chunk = 1024 * 1024,
    start = 0,
    end = bytes_per_chunk,
    size = file.size;

    //Create an list. for store the list of chunk size
    while (start < size) {
      blobs.push(file.slice(start, end));
      start = end;
      end = start + bytes_per_chunk;
    }

    var fend = 0;
    callUpload = function (){
      blob = blobs.shift()
      fend = fend + blob.size
      uploadChunk(res, blob, file.name, file.type, start, fend, size);
    }
// Most important point is send the next chunk request only after receive previous resp
// Here the above function is call first time only
callUpload();
}
catch(err)
{
  errorNotification(err)
}
}




/****************************** Circle Chart Script *****************************/

function makesvg(percentage, inner_text=""){
  if(percentage){

  var abs_percentage = Math.abs(percentage).toString();
  var percentage_str = percentage.toString();
  var classes = ""

  if(percentage < 0){
    classes = "danger-stroke circle-chart__circle--negative";
  } else if(percentage > 0 && percentage <= 30){
    classes = "warning-stroke";
  } else{
    classes = "success-stroke";
  }

 var svg = '<svg class="circle-chart" viewbox="0 0 33.83098862 33.83098862" xmlns="http://www.w3.org/2000/svg">'
            + '<circle class="circle-chart__background" cx="16.9" cy="16.9" r="15.9" />'
            + '<circle class="circle-chart__circle '+classes+'"'
            + 'stroke-dasharray="'+ abs_percentage+',100"    cx="16.9" cy="16.9" r="15.9" />'
            + '<g class="circle-chart__info">'
            + '<text class="circle-chart__percent" x="17.9" y="15.5">'+percentage_str+'%</text>';

  if(inner_text){
    svg += '<text class="circle-chart__subline" x="16.91549431" y="22">'+inner_text+'</text>'
  }

  svg += ' </g></svg>';

  return svg
}
}


var RADIUS = 15.9;
var CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function progress_func(value) {
  var progress = value / 100;
  var dashoffset = CIRCUMFERENCE * (1 - progress);

  console.log('progress:', value + '%', '|', 'offset:', dashoffset)

  $('.circle-chart .circle-chart__circle').css('strokeDashoffset',dashoffset);
   $('.circle-chart .circle-chart__circle').css('strokeDasharray',100);
   $('.circle-chart .circle-chart__percent').html((progress.toString()*100)+'%');

}


(function( $ ) {

$.fn.circlechart = function(progress) {
    this.each(function() {
        var percentage = $(this).data("percentage");
        var inner_text = $(this).text();
        $(this).html(makesvg(percentage, inner_text));
    });
    return this;
};

}( jQuery ));


/****************************** Circle Chart Script *****************************/
timeDiffrence=function(){
  // Upload time calculations.
  let time_diff = Date.now()-fileUpload.start_time,upload_time=''; // variance in milli seconds.
  if(fileUpload.upload_duration){fileUpload.upload_duration+=time_diff}else{fileUpload.upload_duration=time_diff};
  if(!uploadFiles.length){
    // Last file durations and reset.
    time_diff = fileUpload.upload_duration;
  }
  (time_diff<1000)?upload_time = time_diff+' Milliseconds.' : upload_time=moment.utc(time_diff).format('mm')+' Minutes '+moment.utc(time_diff).format('ss')+' Seconds.';
  return upload_time;
}
progressBar = function(progress){
// var progresed = document.getElementById("progressBar");
//     progresed.style.width = progress +'%';
    //progresed.innerHTML = progress * 1 + '%'; //Progress Percentage.
    progress =  Math.floor(progress)
    // $('.circlechart').circlechart(progress).html(makesvg(progress, ""));
    progress_func(progress);
}

function uploadChunk(res, blob, fileName, fileType, fstart, fend, fsize){
  try{
    var xhr = new XMLHttpRequest();
    var url =  upload_url+res.fileId+'?token='+res.token+'&progress='+(fend/fsize);
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', fileType)
    xhr.send(blob);

    xhr.onload = function () {
    //whenever the resp is arrive the if is true
    if (xhr.status === 204 && (fend/fsize) != 1) {
    // here send the next chunk to the upload function after receiving resp
    // this is working like as a loop
    // until the blobs is empty
    callUpload();
    progressBar((fend/fsize)*100);
    //notificationFunction("File uploading in progress");
    }
    else if (xhr.status === 204 && (fend/fsize) == 1) {
      progressBar((fend/fsize)*100);
      uploadFiles.shift();
      if(fileUpload.isFrom == 'upload')successNotification('File(s) uploaded succssfully. in '+(timeDiffrence()));  // Upload time calculations.
    // Once this is hit, that means the blobs array is empty
    // And call the send message
    sendFileMessageFn(res);
    } else {
      errorNotification("Error in file upload");
    }
    };
    }
    catch(err)
    {
      showErr(err)
    }
}

function sendFileMessageFn(create_res)
{
try{
  niaaddp.ddp_method("ufsComplete", [create_res.fileId, 'Uploads', create_res.token], function(err, res) {

  if(uploadFiles.length){
    $("#exampleModalCenter")[0].style.display = "block";
    chatbox.showFileUploadPreview(uploadFiles[0]);
  }else{
    $("#exampleModalCenter")[0].style.display = "none";
  }
if (res){
niaaddp.ddp_method("sendFileMessage", [res.rid,"Uploads",{"_id":res._id,"type":res.type,"size":res.size,"name":res.name,"description":res.description,"url":res.path}], function(err,res) {
  setTimeout(function(){$('#file_upload_loading_li').remove();}, 100);
  if(res){
    fileUpload.room_list.shift();
    if(fileUpload.room_list.length){
      forwardNotification();
      ddpUFSCreate(fileUpload.file);
    }else{
      if(fileUpload.isFrom=='forward')forwardNotification();// last room's forward message notifi.
      fileUpload={}; // Clear the upload time objects.
    }
    //$('#file_upload_loading').append('<span id=upload_success>File uplaod</span>')
  }

  if (err){
    showErr(err.message)
  }
  // Reset the  elements.
  $('#fileupload_input')[0].value="";
  // $('#progressBar')[0].style.width =0;
})
} else {
showErr(err.message)
}
});
    }
    catch(err)
    {
      showErr(err)
    }
}
$(document).on('click', '#file_upload_close', function() {
  // Close the file upload modal.
    uploadFiles = [];
    $("#exampleModalCenter")[0].style.display = "none";
});


$(document).on('click', '#upload_cancel_btn', function() {
  // Close the file upload modal.
  uploadFiles.shift();
  if(uploadFiles.length){
    $("#exampleModalCenter")[0].style.display = "block";
    chatbox.showFileUploadPreview(uploadFiles[0]);
  }else{
    $("#exampleModalCenter")[0].style.display = "none";
  }
});



return {
  getFile:getFile,
  forwardMessageFn:forwardMessageFn,
  forwardNotification:forwardNotification,
}
});
