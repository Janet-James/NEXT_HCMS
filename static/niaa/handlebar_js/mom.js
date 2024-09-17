(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['mom'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "<div class=\"inner-mail-preview\">\n <div class=\"row\">\n    <div class=\"col-md-12\">\n       <div class=\"to-point\">\n         <span>To: </span>\n         <div class=\"to-list-sec\">\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.res : depth0)) != null ? stack1.users_list : stack1),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "         </div>\n        </div>\n        <div class=\"main-sub\">\n           <label>Subject:</label> <input type=\"text\" name=\"Subject\" id=\"subjectname\" class=\"form-control sub-input\">\n        </div>\n        <h3>Transcript</h3>\n\n        <div class=\"form-group\">\n                  <div class=\"mt-radio-inline\" id=\"format_radio\">\n                    <div class=\"radio\">\n                      <label>\n                        <input type=\"radio\" name=\"optionsRadios\" id=\"optionsRadios4\" value=\"MOM\">\n                        <span style=\"float:none;\" class=\"cr\"><i class=\"cr-icon fa fa-circle\"></i></span> MOM Format </label>\n                    </div>\n                    <div class=\"radio\">\n                      <label>\n                        <input type=\"radio\" name=\"optionsRadios\" id=\"optionsRadios5\" value=\"Chat\">\n                        <span class=\"cr\" style=\"float:none;\"><i class=\"cr-icon fa fa-circle\"></i></span> Chat Transcript Format </label>\n                    </div>\n\n                  </div>\n        </div>\n\n       <div id=\"transcript_format\">\n           <!-- <ul>\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.res : depth0)) != null ? stack1.messages : stack1),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "           </ul> -->\n        </div>\n    </div>\n    </div>\n</div>\n";
},"2":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.res : depth0)) != null ? stack1.users_list : stack1)) != null ? stack1.length : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"3":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.res : depth0)) != null ? stack1.users_list : stack1),{"name":"each","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"4":function(container,depth0,helpers,partials,data) {
    var helper;

  return "           <p>"
    + container.escapeExpression(((helper = (helper = helpers.email_id || (depth0 != null ? depth0.email_id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"email_id","hash":{},"data":data}) : helper)))
    + "<i class=\"nf-niaa-close\" id=\"mailtoclose\"></i></p>\n";
},"6":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? depth0.res : depth0)) != null ? stack1.messages : stack1)) != null ? stack1.length : stack1),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"7":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.res : depth0)) != null ? stack1.messages : stack1),{"name":"each","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"8":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression, alias4="function";

  return "              <li class=\""
    + alias3((helpers["msg-align"] || (depth0 && depth0["msg-align"]) || alias2).call(alias1,(depth0 != null ? depth0.uid : depth0),{"name":"msg-align","hash":{},"data":data}))
    + " message-data\">\n                 <img class=\"sub-point-img\" src="
    + alias3((helpers.ip || (depth0 && depth0.ip) || alias2).call(alias1,(depth0 != null ? depth0.username : depth0),{"name":"ip","hash":{},"data":data}))
    + " alt=\"\">\n                 <div class=\"date-time\">\n                    <div class=\"send-name\">"
    + alias3(((helper = (helper = helpers.username || (depth0 != null ? depth0.username : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"username","hash":{},"data":data}) : helper)))
    + "</div>\n                    <div class=\"mesg-bg\">"
    + ((stack1 = ((helper = (helper = helpers.msg || (depth0 != null ? depth0.msg : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"msg","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</div>\n                    <div class=\"rec-time\">"
    + alias3(((helper = (helper = helpers.time_str || (depth0 != null ? depth0.time_str : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"time_str","hash":{},"data":data}) : helper)))
    + "</div>\n                 </div>\n              </li>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.res : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"useData":true});
})();