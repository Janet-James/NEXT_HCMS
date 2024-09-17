define('cookie', ['ddp', 'user', 'room'], function(niaaddp, niaauser, niaaroom) {
    setCookie = function(token, uid) {
        var d = new Date();
        d.setDate(d.getDate() + 50)
        document.cookie = 'niaa_token' + "=" + token + ";expires" + "=" + d + ";path=/"
        document.cookie = 'niaa_uid' + "=" + uid + ";expires" + "=" + d + ";path=/"
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
    // this function call is duplicated
    // see real call in user module
    //connectWebSocket=function(){
    //	niaaddp.ddp_socket_init(webSocketURL);
    // }();

    checkCookie = function() {
        var data = getCookie();
        if (data != null) {

            niaaddp.ddp_method('login', [{
                'resume': data.niaa_token
            }], function(err, res) {
                niaauser.setAuthtoken(data.niaa_token)
                niaauser.setUserId(data.niaa_uid)
                getUserInfo(data.niaa_uid, data.niaa_token)
                triggerRealtimeEventHandler();
                triggerRestEventHandler();
                //test();
            });

        }
        //else goes here
    }();
})

function test() {
    name_list = getRoom();
    //for(var key in name_list){
    //for(var i=0; i<name_list[key].length;i++){
    try {
        alert('tes')
        $.ajax({
            type: 'GET',
            url: "http://192.168.10.94:3000/avatar/ranjith?_dc=undefined",
            success: function(response, data) {
                $('#user_photo').append(data);
            },
            error: function(response, data) {
                //Show error for invalid credential
                console.log(response)
                //showErr(response.responseJSON.message)
            }
        });
    } catch (err) {
        showErr(err)
    }
    // }
    //}
}
