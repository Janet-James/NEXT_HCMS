// var Niaaddp = function(){

define('ddp', [], function() {
  // DDP Library
  var liveChatDDPClient = function() {
      var t = function() {
          var t = 0;
          return function() {
              return (t++).toString()
          }
      }()
        , e = '{"server_id":"0"}'
        , n = 10
        , o = 300
        , s = 1e4
        , i = ["added", "changed", "connected", "error", "failed", "nosub", "ready", "removed", "result", "updated", "ping", "pong"]
        , r = "1"
        , c = function(t) {
          this._endpoint = t.endpoint,
          this._SocketConstructor = t.SocketConstructor,
          this._autoreconnect = !t.do_not_autoreconnect,
          this._ping_interval = t._ping_interval || s,
          this._socketInterceptFunction = t.socketInterceptFunction,
          this._onReadyCallbacks = {},
          this._onStopCallbacks = {},
          this._onErrorCallbacks = {},
          this._onResultCallbacks = {},
          this._onUpdatedCallbacks = {},
          this._events = {},
          this._queue = [],
          this.readyState = -1,
          this._reconnect_count = 0,
          this._reconnect_incremental_timer = 0,
          t.do_not_autoconnect || this.connect()
      };
      return c.prototype.constructor = c,
      c.prototype.connect = function() {
          this.readyState = 0,
          this._socket = new this._SocketConstructor(this._endpoint),
          this._socket.onopen = this._on_socket_open.bind(this),
          this._socket.onmessage = this._on_socket_message.bind(this),
          this._socket.onerror = this._on_socket_error.bind(this),
          this._socket.onclose = this._on_socket_close.bind(this)
      }
      ,
      c.prototype.method = function(e, n, o, s) {
          var i = t();
          return this._onResultCallbacks[i] = o,
          this._onUpdatedCallbacks[i] = s,
          this._send({
              msg: "method",
              id: i,
              method: e,
              params: n
          }),
          i
      }
      ,
      c.prototype.sub = function(e, n, o, s, i) {
          var r = t();
          return this._onReadyCallbacks[r] = o,
          this._onStopCallbacks[r] = s,
          this._onErrorCallbacks[r] = i,
          this._send({
              msg: "sub",
              id: r,
              name: e,
              params: n
          }),
          r
      }
      ,
      c.prototype.unsub = function(t) {
          return this._send({
              msg: "unsub",
              id: t
          }),
          t
      }
      ,
      c.prototype.on = function(t, e) {
          this._events[t] = this._events[t] || [],
          this._events[t].push(e)
      }
      ,
      c.prototype.off = function(t, e) {
          if (this._events[t]) {
              var n = this._events[t].indexOf(e);
              -1 !== n && this._events[t].splice(n, 1)
          }
      }
      ,
      c.prototype._emit = function(t) {
          if (this._events[t]) {
              var e = arguments
                , n = this;
              this._events[t].forEach(function(t) {
                  t.apply(n, Array.prototype.slice.call(e, 1))
              })
          }
      }
      ,
      c.prototype._send = function(t) {
          if (1 !== this.readyState && "connect" !== t.msg)
              return void this._queue.push(t);
          var e;
          e = "undefined" == typeof EJSON ? JSON.stringify(t) : EJSON.stringify(t),
          this._socketInterceptFunction && this._socketInterceptFunction({
              type: "socket_message_sent",
              message: e,
              timestamp: Date.now()
          }),
          this._socket.send(e)
      }
      ,
      c.prototype._try_reconnect = function() {
          this._reconnect_count < n ? (setTimeout(this.connect.bind(this), this._reconnect_incremental_timer),
          this._reconnect_count += 1,
          this._reconnect_incremental_timer += o * this._reconnect_count) : setTimeout(this.connect.bind(this), this._reconnect_incremental_timer)
      }
      ,
      c.prototype._on_result = function(t) {
          if (this._onResultCallbacks[t.id])
              this._onResultCallbacks[t.id](t.error, t.result),
              delete this._onResultCallbacks[t.id],
              t.error && delete this._onUpdatedCallbacks[t.id];
          else if (t.error)
              throw delete this._onUpdatedCallbacks[t.id],
              t.error.message
      }
      ,
      c.prototype._on_updated = function(t) {
          var e = this;
          t.methods.forEach(function(t) {
              e._onUpdatedCallbacks[t] && (e._onUpdatedCallbacks[t](),
              delete e._onUpdatedCallbacks[t])
          })
      }
      ,
      c.prototype._on_nosub = function(t) {
          if (t.error) {
              if (!this._onErrorCallbacks[t.id])
                  throw delete this._onReadyCallbacks[t.id],
                  delete this._onStopCallbacks[t.id],
                  new Error(t.error);
              return this._onErrorCallbacks[t.id](t.error),
              delete this._onReadyCallbacks[t.id],
              delete this._onStopCallbacks[t.id],
              void delete this._onErrorCallbacks[t.id]
          }
          this._onStopCallbacks[t.id] && this._onStopCallbacks[t.id](),
          delete this._onReadyCallbacks[t.id],
          delete this._onStopCallbacks[t.id],
          delete this._onErrorCallbacks[t.id]
      }
      ,
      c.prototype._on_ready = function(t) {
          var e = this;
          t.subs.forEach(function(t) {
              e._onReadyCallbacks[t] && (e._onReadyCallbacks[t](),
              delete e._onReadyCallbacks[t])
          })
      }
      ,
      c.prototype._on_error = function(t) {
          this._emit("error", t)
      }
      ,
      c.prototype._on_connected = function(e) {
          var n = this
            , o = 0 === n._reconnect_count
            , s = o ? "connected" : "reconnected";
          n.readyState = 1,
          n._reconnect_count = 0,
          n._reconnect_incremental_timer = 0;
          for (var i = n._queue.length, r = 0; i > r; r++)
              n._send(n._queue.shift());
          n._emit(s, e),
          n._ping_interval_handle = setInterval(function() {
              var e = t();
              n._send({
                  msg: "ping",
                  id: e
              })
          }, n._ping_interval)
      }
      ,
      c.prototype._on_failed = function(t) {
          this.readyState = 4,
          this._emit("failed", t)
      }
      ,
      c.prototype._on_added = function(t) {
          this._emit("added", t)
      }
      ,
      c.prototype._on_removed = function(t) {
          this._emit("removed", t)
      }
      ,
      c.prototype._on_changed = function(t) {
          this._emit("changed", t)
      }
      ,
      c.prototype._on_ping = function(t) {
          this._send({
              msg: "pong",
              id: t.id
          })
      }
      ,
      c.prototype._on_pong = function(t) {}
      ,
      c.prototype._on_socket_close = function() {
          this._socketInterceptFunction && this._socketInterceptFunction({
              type: "socket_close",
              timestamp: Date.now()
          }),
          clearInterval(this._ping_interval_handle),
          this.readyState = 4,
          this._emit("socket_close"),
          this._autoreconnect && this._try_reconnect()
      }
      ,
      c.prototype._on_socket_error = function(t) {
          this._socketInterceptFunction && this._socketInterceptFunction({
              type: "socket_error",
              error: JSON.stringify(t),
              timestamp: Date.now()
          }),
          clearInterval(this._ping_interval_handle),
          this.readyState = 4,
          this._emit("socket_error", t)
      }
      ,
      c.prototype._on_socket_open = function() {
          this._socketInterceptFunction && this._socketInterceptFunction({
              type: "socket_open",
              timestamp: Date.now()
          }),
          this._send({
              msg: "connect",
              version: r,
              support: [r]
          })
      }
      ,
      c.prototype._on_socket_message = function(t) {
          this._socketInterceptFunction && this._socketInterceptFunction({
              type: "socket_message_received",
              message: t.data,
              timestamp: Date.now()
          });
          var n;
          if (t.data !== e) {
              try {
                  if (n = "undefined" == typeof EJSON ? JSON.parse(t.data) : EJSON.parse(t.data),
                  -1 === i.indexOf(n.msg))
                      throw new Error
              } catch (o) {
                  return console.warn("Non DDP message received:"),
                  void console.warn(t.data)
              }
              this["_on_" + n.msg](n)
          }
      }
      ,
      c
  }();


var ddp_interface_list=[];

var ddp_socket_init = function(endpoint){
ddp = new liveChatDDPClient({
  endpoint: endpoint,
  SocketConstructor: WebSocket
});
if(ddp._socket.readyState == 3){
  disconnectNotification();
}
},

ddp_add_interface = function(obj){
  ddp_interface_list.push(obj);
},

ddp_remove_interface = function(obj){
  ddp_interface_list.push(obj);
},

ddp_connected = function(userLoginId,userLoginPasswd,connected_function){
ddp.on('connected', connected_function);
},

ddp_method = function(method,params,handler_func ){
  ddp.method(method, params, handler_func);
},

ddp_sub = function(method,params,handler_func ){
  ddp.sub(method, params, handler_func);
},
ddpRealTimeLogin=function(email,passwd,realtime_login_callback){
  const loginData = {user: {email: email},password: passwd};
  ddp.method("login", [loginData], realtime_login_callback)
  // ddp.on('changed', function(msg){
  //     for (var i =0; i < ddp_interface_list.length;i++)
  //       ddp_interface_list[i].onchange(msg);
  // });
},
onChanged = function(msg){
        for (var i =0; i < ddp_interface_list.length;i++){
          ddp_interface_list[i].onchange(msg);
        }
  },
socket_close = function(){
  ddp.on('socket_close', function() {
  disconnectNotification();
  });
}
ddp_on_changed = function(){
ddp.on('changed', onChanged);
},
ddp_on_added = function(){
ddp.on('added', userAdded);
},
ddp_on_removed = function(){
ddp.on('removed', userRemoved);
}

ddp_unsub = function(userGroupChatID){
  ddp.unsub('stream-room-messages', [userGroupChatID, true], function() {
            // Display the stream on console so we can see its working
          });
  ddp.unsub('stream-notify-room', [userGroupChatID + "/deleteMessage", true], function() {
            // Display the stream on console so we can see its working
          });
  ddp.unsub('stream-notify-room', [userGroupChatID+'/typing', true], function() {
  });
}


return {
  'ddp_socket_init':ddp_socket_init,
  'ddp_connected': ddp_connected,
  // 'ddp_login':ddp_login,
  'ddp_method': ddp_method,
  'ddp_sub':ddp_sub,
  'ddp_add_interface':ddp_add_interface,
  ddpRealTimeLogin:ddpRealTimeLogin,
  ddp_on_changed:ddp_on_changed,
  ddp_on_added:ddp_on_added,
  ddp_on_removed:ddp_on_removed,
  'socket_close':socket_close,
  ddp_unsub:ddp_unsub,
}
});
