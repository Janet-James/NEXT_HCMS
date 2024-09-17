(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['chatheader'] = template({"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"team-name\">\n        <h2>"
    + container.escapeExpression(((helper = (helper = helpers.chatheader || (depth0 != null ? depth0.chatheader : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"chatheader","hash":{},"data":data}) : helper)))
    + "</h2>\n     </div>\n     <div class=\"group-chat-name\">\n        <span class=\"ct-name-list user_typing_name\"></span>\n        <p class=\"user_typing_context\"></p>\n     </div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.chatheader : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"useData":true});
})();