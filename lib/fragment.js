var newBinding = require('./binding');

module.exports = newFragment;

function newFragment(parent){

  var fragment, ns;

  fragment = {
    context  : init,
    bindings : [],
    destroy  : selfDestroy,
    use      : use
  };

  return fragment;

  function loopElements(callback){
    var attrName, ext, extName, elements, templates, i;

    for(extName in ns.extensions){
      ext      = ns.extensions[extName];
      elements = ext.elements(parent, ns.name);
      attrName = ns.name + '-' + extName;

      if(ext.isBlock){
        templates = {};
        i = elements.length;

        while( i -- ){
          templates[i] = elements[i].innerHTML;
          elements[i].innerHTML = '';
        }
      }

      i = -1;
      while( ++i < elements.length ) {
        callback(ext, elements[i], attrName, templates && templates[i]);
      }

    }
  }

  function bind(context){
    loopElements(function(ext, element, attrName, template){
      ext.createBinding(context, element, attrName, template);
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
