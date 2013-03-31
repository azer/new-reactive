var newBinding = require('./binding');

module.exports = newFragment;

function newFragment(element){

  var fragment, ns;

  fragment = {
    context  : init,
    bindings : [],
    destroy  : selfDestroy,
    use      : use
  };

  return fragment;

  function elements(callback){
    var attrName, extName, children;

    for(extName in ns.extensions){

      children = ns.extensions[extName].elements(element, ns.name);
      attrName = ns.name + '-' + extName;

      children.forEach(callback(ns.extensions[extName], attrName));

    }
  }

  function bind(context){
    elements(function(ext, attrName){

      return function(child){

        var attrValue, matching, propName, props, interpolationRE;

        attrValue       = child.getAttribute(attrName);
        interpolationRE = /(\{\w+\})/g;
        props           = [];

        if(context.hasOwnProperty(attrValue)){

          props.push(context[attrValue]);
          attrValue = '{' + attrValue + '}';

        } else {

          while(matching = interpolationRE.exec(attrValue)){
            propName = matching[1].slice(1, -1);
            props.push(context[propName]);
          }

        }

        props.length && newBinding(ext, child, attrValue, context, props);

      };

    });
  }


  function init(context){
    setTimeout(bind, 0, context);
    return fragment;

  }

  function selfDestroy(nil){
    delete fragment;
  }

  function use(newNS){
    ns = newNS;
    return fragment;
  }

}
