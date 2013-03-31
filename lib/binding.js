var on     = require('ada-on'),
    format = require("new-format");

module.exports = newBinding;

function newBinding(ext, element, template, context, props){

  var params = props.slice();

  params.push(function(){
    ext.update(element, format(template, context));
  });

  on.apply(undefined, params);

}
