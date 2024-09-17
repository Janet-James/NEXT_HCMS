define('user', ['ddp'], function(niaaddp) {
    var userloginid = null
      , auth_token = null
      , username = null
      , // current login user name.
    currentUsername = null
      , // current chat room's name.
    login_success_count = 0
      , login_error_count = 0
      , logged_event_handler_array = [];
    rest_loggedin_event_handler_array = [];
    setUserId = function(id) {
        if (userloginid == null) {
            userloginid = id
        }
    }

    getusername = function() {
        return username;
    }
    ,
    getauthtoken = function() {
        return auth_token;
    }
    ,
    setAuthtoken = function(token) {
        auth_token = token;
    }
    ,
    getuserid = function() {
        return userloginid;
    }
    ,
    getCurrentUserName = function() {
        // Current chat room name.
        return currentUsername
    }
    ,
    setCurrentUserName = function(uname) {
        currentUsername = uname;
    }
    getUserInfo = function(userloginid, auth_token) {
        try {
            $.ajax({
                method: 'GET',
                headers: {
                    'X-Auth-Token': auth_token,
                    'X-User-Id': userloginid
                },
                url: meURL,
                success: function(response, data) {
                    if (data == 'success') {
                        setCurrentUserName(response.username)
                        username = response.username
                    }
                },
                error: function(response, data) {
                    showErr(response.statusText);
                }
            });
        } catch (err) {
            showErr(err)
        }
    }
    ,

    login_rest_func = function(response, data) {
        try {
            if (response.status == 'success') {
                setUserId(response.data.userId);
                auth_token = response.data.authToken;
                triggerRestEventHandler();

                setup();

            } else {
                alert('Server error');
            }
        } catch (err) {
            showErr(err)
        }
    }
    ,
    connected_func = function(userLoginId, userLoginPasswd) {
        niaaddp.ddp_login(userLoginId, userLoginPasswd, login_realtime_func);
    }
    ;
    // {"ldap":true,"username":"anbu@gmail.com","ldapPass":"next","ldapOptions":{}}
    // rest_login = function(userLoginId, userLoginPasswd){
    //   try{
    //   $.ajax({
    //     type: 'POST',
    //     url: loginURL,
    //     data: {
    //       user: userLoginId,// user name/email from user input
    //       password: userLoginPasswd // user password
    //     },
    //     success: function(response, data ) {
    //       login_rest_func(response, data);
    //       setup();
    //     },
    //     error: function(response, data) {
    //      showErr(response.statusText);
    //     }
    //   });
    //   }
    //   catch(err){
    //     showErr(err)
    //   }
    // },

    rest_and_realtime_loggedin = function(count) {
        login_success_count = login_success_count + count
        if (login_success_count == 2) {
            // if the count is 2 means the user is logged in via real time and rest
            niaa_logged_in();
        }
    }
    ,
    // if real time or rest api login failed immediatly login transform
    rest_and_realtime_loggedin_err = function(count) {
        login_error_count = login_error_count + count;
        if (login_error_count == 1) {
            niaa_login_failed();
            niaa_logged_in();
        }
    }
    ,
    niaa_login_failed = function() {
    }
    restLogin = function(email, passwd) {
        $.ajax({
            type: 'POST',
            url: loginURL,
            data: {
                user: email,
                password: passwd
            },
            success: function(response, data) {
                getUserInfo(response.data.userId, response.data.authToken);
                login_rest_func(response, data);
                // 1
                setCookie(response.data.authToken, response.data.userId);
                rest_and_realtime_loggedin(1);
            },
            error: function(response, data) {
                myNextEmailID = email;
                passwd_glb = passwd;
                restLogin2(myNextEmailID, 'welcome@123');

                // rest_and_realtime_loggedin_err(1); this is important call
            }
        });
    }
    ,
    // login the user with welcome@123 passwd
    // this job for update the user passwd with transform password
    restLogin2 = function(myNextEmailID, myNextPasswd) {
        $.ajax({
            type: 'POST',
            url: loginURL,
            data: {
                user: myNextEmailID,
                password: myNextPasswd
            },
            success: function(response, data) {
                updateUser(response.data.userId, response.data.authToken)
                // login_rest_func(response, data);// 1
                // setCookie(response.data.authToken,response.data.userId);
                // rest_and_realtime_loggedin(1);
            },
            error: function(response, data) {
                rest_and_realtime_loggedin_err(1);
            }
        });
    }
    ,
    updateUser = function(id, token) {
        try {
            $.ajax({
                method: 'POST',
                headers: {
                    'X-Auth-Token': token,
                    'X-User-Id': id
                },
                data: {
                    userId: id,
                    data: {
                        password: passwd_glb
                    }
                },
                url: 'https://'+window.location.hostname+'/niaa/api/v1/users.update',
                success: function(response, data) {
                    if (data == 'success') {
                        getUserInfo(response.data.userId, response.data.authToken);
                        login_rest_func(response, data);
                        // 1
                        setCookie(response.data.authToken, response.data.userId);
                        rest_and_realtime_loggedin(1);
                    }
                },
                error: function(response, data) {
                    console.log(response)
                }
            });
        } catch (err) {
            console.log(err)
        }
    }
    ,
    //the socket is connected on the page load
//    connectWebSocket = function() {
//        niaaddp.ddp_socket_init(webSocketURL);
//    }();

    rest_and_realtime_loggin = function(email, passwd) {
        niaaddp.ddpRealTimeLogin(email, passwd, realtimeLoginCallback);
        restLogin(email, passwd);
    }
    ,
    realtimeLoginCallback = function(err, res) {
        if (err) {
            // restLogin(myNextEmailID,'welcome@123')
            console.log('real time login fail')

            // rest_and_realtime_loggedin_err(1); // this is important
        } else {
            rest_and_realtime_loggedin(1);
            setUserId(res.id);
            triggerRealtimeEventHandler();
        }
    }
    ,
    triggerRealtimeEventHandler = function() {

        niaaddp.ddp_on_changed();

        for (i = 0; i < logged_event_handler_array.length; i++) {
            logged_event_handler_array[i].logged_event_handler();
        }
    }
    ,
    triggerRestEventHandler = function() {
        for (var i = 0; i < rest_loggedin_event_handler_array.length; i++) {
            rest_loggedin_event_handler_array[i].rest_logged_event_handler()
        }
    }

    login = function(email, passwd) {
        rest_and_realtime_loggin(email, passwd);
    }
    ,

    // login = function(userLoginId,userLoginPasswd )  {
    //   niaaddp.ddp_socket_init(webSocketURL);
    //   niaaddp.ddp_connected(userLoginId,userLoginPasswd,connected_func);
    //   rest_login(userLoginId,userLoginPasswd);
    // }, R
    setUserStatus = function(status) {
        niaaddp.ddp_method('UserPresence:setDefaultStatus', [status], function() {});
    }
    ,

    logout = function() {
        niaaddp.ddp_method("logout", [], function(err, res) {});
    }
    ,

    user_add_logged_event_handler = function(obj) {
        logged_event_handler_array.push(obj);
    }
    ,

    user_remove_logged_event_handler = function(obj) {
        logged_event_handler_array.push(obj);
    }
    ,

    rest_loggedin_notify = function(obj) {
        rest_loggedin_event_handler_array.push(obj);
    }
    ,

    startUserTyping = function(id, name, status) {
        niaaddp.ddp_method('stream-notify-room', [id + '/typing', name, status], function(e) {});
    }
    ,

    stopUserTyping = function(id, name, status) {
        niaaddp.ddp_method('stream-notify-room', [id + '/typing', name, status], function(e) {});
    }
    var timeoutID;
    var flag = false;
    function setup() {
        this.addEventListener("mousemove", resetTimer, false);
        this.addEventListener("mousedown", resetTimer, false);
        this.addEventListener("keypress", resetTimer, false);
        this.addEventListener("DOMMouseScroll", resetTimer, false);
        this.addEventListener("mousewheel", resetTimer, false);
        this.addEventListener("touchmove", resetTimer, false);
        this.addEventListener("MSPointerMove", resetTimer, false);
        startTimer();
    }

    function startTimer() {
        timeoutID = window.setTimeout(goInactive, user_idel_timeout);
    }
    function resetTimer(e) {
        window.clearTimeout(timeoutID);
        goActive();
    }
    function goInactive() {
        setUserStatus('away');
        flag = false;
    }
    function goActive() {
        if (flag == false) {
            setUserStatus('online');
            flag = true;
        }
        startTimer();
    }
    getUserPresence = function(uid, uname, callback) {
        try {
            $.ajax({
                method: 'GET',
                headers: {
                    'X-Auth-Token': auth_token,
                    'X-User-Id': userloginid,
                },
                url: userPresenceURL + uid,
                success: function(response, data) {
                    if (data == 'success') {
                        callback(uname, response);
                    }
                },
                error: function(response, data) {
                    console.log('user presence err');
                }
            });
        } catch (err) {
            showErr(err)
        }
    }
    $(document).on('click', '#hcms_logout', function() {
        document.cookie = 'niaa_token' + '=; expires=Thu, 01-Jan-70 00:00:01 GMT;';
        document.cookie = 'niaa_uid' + '=; expires=Thu, 01-Jan-70 00:00:01 GMT;';
    });
    return {
        login: login,
        getUserInfo: getUserInfo,
        getusername: getusername,
        getauthtoken: getauthtoken,
        getuserid: getuserid,
        setUserStatus: setUserStatus,
        logout: logout,
        user_add_logged_event_handler: user_add_logged_event_handler,
        user_remove_logged_event_handler: user_remove_logged_event_handler,
        rest_loggedin_notify: rest_loggedin_notify,
        startUserTyping: startUserTyping,
        stopUserTyping: stopUserTyping,
        setCurrentUserName: setCurrentUserName,
        getUserPresence: getUserPresence,
        setAuthtoken: setAuthtoken,
        setUserId: setUserId,
        getCurrentUserName: getCurrentUserName,
    }
})
