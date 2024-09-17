(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['timeline_search'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.HISTORY : depth0)) != null ? stack1.length : stack1),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"2":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.HISTORY : depth0),{"name":"each","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.dayFirstMsg : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.mid : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n";
},"4":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return "        "
    + ((stack1 = ((helper = (helper = helpers.dayFirstMsg || (depth0 != null ? depth0.dayFirstMsg : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"dayFirstMsg","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n";
},"6":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "   <li class='message-data' id="
    + alias4(((helper = (helper = helpers.mid || (depth0 != null ? depth0.mid : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"mid","hash":{},"data":data}) : helper)))
    + " data-timestamp="
    + alias4(((helper = (helper = helpers.ts || (depth0 != null ? depth0.ts : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"ts","hash":{},"data":data}) : helper)))
    + ">\n      <img src="
    + alias4(((helper = (helper = helpers.avatar || (depth0 != null ? depth0.avatar : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"avatar","hash":{},"data":data}) : helper)))
    + " alt=\"\">\n      <div class=\"date-time "
    + alias4((helpers.type || (depth0 && depth0.type) || alias2).call(alias1,(depth0 != null ? depth0.msg_type : depth0),{"name":"type","hash":{},"data":data}))
    + "\">\n         <div class=\"send-name\">"
    + alias4(((helper = (helper = helpers.uname || (depth0 != null ? depth0.uname : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"uname","hash":{},"data":data}) : helper)))
    + "</div>\n         <div class=\"mesg-bg\">"
    + ((stack1 = ((helper = (helper = helpers.msg || (depth0 != null ? depth0.msg : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"msg","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</div>\n         <div class=\"sent-editor-sec\">\n            <a href=\"#\"><i class=\"fa fa-ellipsis-v\"></i></a>\n            <ul>\n              <li> <a class=\"jumpToMsgBtn\" href=\"#\" data-rid="
    + alias4(((helper = (helper = helpers.rid || (depth0 != null ? depth0.rid : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"rid","hash":{},"data":data}) : helper)))
    + " data-timestamp="
    + alias4(((helper = (helper = helpers.ts || (depth0 != null ? depth0.ts : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"ts","hash":{},"data":data}) : helper)))
    + ">Jump to Message</a> </li>\n            </ul>\n         </div>\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.isEdited : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "         <div class=\"rec-time\">"
    + alias4(((helper = (helper = helpers.ct || (depth0 != null ? depth0.ct : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"ct","hash":{},"data":data}) : helper)))
    + "</div>\n      </div>\n   </li>\n";
},"7":function(container,depth0,helpers,partials,data) {
    var helper;

  return "         <div class=edit-time><i class='fa fa-edit'></i><p class=user-message>"
    + container.escapeExpression(((helper = (helper = helpers.isEdited || (depth0 != null ? depth0.isEdited : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"isEdited","hash":{},"data":data}) : helper)))
    + "</p></div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.HISTORY : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"useData":true});
})();