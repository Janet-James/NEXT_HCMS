(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['chat_window'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.HISTORY : depth0)) != null ? stack1.length : stack1),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"2":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.HISTORY : depth0),{"name":"each","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.dayFirstMsg : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.RoomUnreadTag : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.mid : depth0),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n";
},"4":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return "        "
    + ((stack1 = ((helper = (helper = helpers.dayFirstMsg || (depth0 != null ? depth0.dayFirstMsg : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"dayFirstMsg","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n";
},"6":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return "        "
    + ((stack1 = ((helper = (helper = helpers.RoomUnreadTag || (depth0 != null ? depth0.RoomUnreadTag : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"RoomUnreadTag","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n";
},"8":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.groupingclass : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.program(11, data, 0),"data":data})) != null ? stack1 : "")
    + "      <img src="
    + alias4(((helper = (helper = helpers.avatar || (depth0 != null ? depth0.avatar : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"avatar","hash":{},"data":data}) : helper)))
    + " alt=\"\">\n      <div class=\"date-time "
    + alias4((helpers.type || (depth0 && depth0.type) || alias2).call(alias1,(depth0 != null ? depth0.msg_type : depth0),{"name":"type","hash":{},"data":data}))
    + "\">\n         <div class=\"send-name\">"
    + alias4(((helper = (helper = helpers.uname || (depth0 != null ? depth0.uname : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"uname","hash":{},"data":data}) : helper)))
    + "</div>\n         <div class=\"mesg-bg\">"
    + ((stack1 = ((helper = (helper = helpers.msg || (depth0 != null ? depth0.msg : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"msg","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</div>\n         <div class=\"sent-editor-sec\">\n            <a href=\"#\"><i class=\"fa fa-ellipsis-v\"></i></a>\n            <ul>\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.isOwner : depth0),{"name":"if","hash":{},"fn":container.program(13, data, 0),"inverse":container.program(15, data, 0),"data":data})) != null ? stack1 : "")
    + "            </ul>\n            <div class=\"forword-msg-box\">\n                <div class=\"forword-msg-box-inner\">\n                   <div class=\"input-group stylish-input-group\">\n                    <input type=\"text\" class=\"form-control user_search_box\" placeholder=\"Search\">\n                    <span class=\"input-group-addon\">\n                            <i class=\"fa fa-search\"></i>\n                    </span>\n                </div>\n                    <div class=\"searc-result-list\" id=\"fwd_selected_room\"></div>\n                    <div class=\"forword-search-result\">\n                            <ul id=\"style-3\" class=\"force-overflow forward_msg_list\">\n                            </ul>\n\n                    </div>\n                    <div class=\"buttons-btm\">\n                            <span id=\"fwd_cancel_btn\" class=\"cancle-btnm\"><i class=\"fa fa-times\"></i></span>\n                            <span id=\"fwd_submit_btn\" class=\"save-btnm\"><i class=\"fa fa-paper-plane\" aria-hidden=\"true\"></i></span>\n                        </div>\n\n                </div>\n             </div>\n         </div>\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.isEdited : depth0),{"name":"if","hash":{},"fn":container.program(17, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "         <div class=\"rec-time\">"
    + alias4(((helper = (helper = helpers.ct || (depth0 != null ? depth0.ct : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"ct","hash":{},"data":data}) : helper)))
    + "</div>\n      </div>\n   </li>\n";
},"9":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression, alias4="function";

  return "    <li class='"
    + alias3((helpers["msg-align"] || (depth0 && depth0["msg-align"]) || alias2).call(alias1,(depth0 != null ? depth0.uid : depth0),{"name":"msg-align","hash":{},"data":data}))
    + " message-data "
    + alias3(((helper = (helper = helpers.groupingclass || (depth0 != null ? depth0.groupingclass : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"groupingclass","hash":{},"data":data}) : helper)))
    + "' id="
    + alias3(((helper = (helper = helpers.mid || (depth0 != null ? depth0.mid : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"mid","hash":{},"data":data}) : helper)))
    + " data-timestamp="
    + alias3(((helper = (helper = helpers.ts || (depth0 != null ? depth0.ts : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"ts","hash":{},"data":data}) : helper)))
    + " data-msg_type="
    + alias3(((helper = (helper = helpers.msg_type || (depth0 != null ? depth0.msg_type : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"msg_type","hash":{},"data":data}) : helper)))
    + ">\n";
},"11":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression, alias4="function";

  return "   <li class='"
    + alias3((helpers["msg-align"] || (depth0 && depth0["msg-align"]) || alias2).call(alias1,(depth0 != null ? depth0.uid : depth0),{"name":"msg-align","hash":{},"data":data}))
    + " message-data' id="
    + alias3(((helper = (helper = helpers.mid || (depth0 != null ? depth0.mid : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"mid","hash":{},"data":data}) : helper)))
    + " data-timestamp="
    + alias3(((helper = (helper = helpers.ts || (depth0 != null ? depth0.ts : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"ts","hash":{},"data":data}) : helper)))
    + " data-msg_type="
    + alias3(((helper = (helper = helpers.msg_type || (depth0 != null ? depth0.msg_type : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"msg_type","hash":{},"data":data}) : helper)))
    + ">\n";
},"13":function(container,depth0,helpers,partials,data) {
    return "                 <li> <a href=\"#\" class=\"edit_msg_btn\" data-toggle=\"tooltip\" title=\"Edit Message\"><i class=\"fa fa-edit\"></i></a> </li>\n                 <li> <a href=\"#\" id=\"btnShowHide\" class=\"reply_msg_btn\" data-toggle=\"tooltip\" title=\"Reply\" ><i class=\"fa fa-reply\"></i></a> </li>\n                 <li> <a href=\"#\" id=\"btnShowHide1\" class=\"fwd_msg_btn\" data-toggle=\"tooltip\" title=\"Forward\"><i class=\"fa fa-share\"></i></a> </li>\n                 <li> <a onclick=\"JSalert()\" href=\"#\" class=\"delete_msg_btn\" data-toggle=\"tooltip\" title=\"Delete\"><i class=\"fa fa-trash\"></i></a> </li>\n";
},"15":function(container,depth0,helpers,partials,data) {
    return "                  <li> <a href=\"#\" id=\"btnShowHide\" class=\"reply_msg_btn\" data-toggle=\"tooltip\" title=\"Reply\"><i class=\"fa fa-reply\"></i></a> </li>\n                  <li> <a href=\"#\" id=\"btnShowHide1\" class=\"fwd_msg_btn\" data-toggle=\"tooltip\" title=\"Forward\"><i class=\"fa fa-share\"></i></a> </li>\n";
},"17":function(container,depth0,helpers,partials,data) {
    var helper;

  return "         <div class=edit-time><i class='fa fa-edit'></i><p class=user-message>"
    + container.escapeExpression(((helper = (helper = helpers.isEdited || (depth0 != null ? depth0.isEdited : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"isEdited","hash":{},"data":data}) : helper)))
    + "</p></div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "\n"
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.HISTORY : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"useData":true});
})();