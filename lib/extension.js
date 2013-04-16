var newBinding      = require('./binding'),
    later           = require('./later'),
    interpolationRE = /(\{\w+\})/g;

module.exports = newExtension;

function newExtension(name, callback){

  var ext = {
    name     : name,
    isBlock  : undefined,
    initFn   : callback,
    updateFn : callback,
    renderFn : undefined,
    bindings : []
  };

  ext.block = function(){
    ext.isBlock = true;
  };

  ext.createBinding = function(context, element, domAttrName, blockTemplate){
    var binding, domAttrValue, matching, toSubscribe, contextAttrName, template;

    domAttrValue = element.getAttribute(domAttrName);

    if( ext.isBlock ) {
      template    = blockTemplate;
      toSubscribe = context[domAttrValue];
    } else {
      toSubscribe = [];
      template    = domAttrValue;

      if( context.hasOwnProperty( template ) ) {
        toSubscribe.push( context[template] );
        template = '{' + template + '}';
      } else {
        while(matching = interpolationRE.exec(domAttrValue)){
          contextAttrName = matching[1].slice(1, -1);
          context.hasOwnProperty(contextAttrName) && toSubscribe.push( context[contextAttrName] );
        }
      }

      if( ! toSubscribe.length ) return;
    }

    binding = newBinding(ext, element, template, context, toSubscribe);
    ext.bindings.push(binding);
  };

  ext.elements = function(parent, ns){
    var result = Array.prototype.slice.call(elements(parent, name, ns));

    if(parent.hasAttribute(ns + '-' + name))
      result.splice(0, 0, parent);

    return result;
  };

  ext.init = function(fn){
    ext.initFn = fn;
    return ext;
  };

  ext.update = function(fn){
    ext.updateFn = fn;
    return ext;
  };

  ext.render = function(fn){
    ext.renderFn = fn;
    return ext;
  };

  return ext;
}

function elements(dom, ext, ns){
  return dom.querySelectorAll(selector(ns, ext));
}

function selector(ns, ext){
  return '[' + ns + '-' + ext + ']';
}
