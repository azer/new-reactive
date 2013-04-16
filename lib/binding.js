var on     = require('ada-on'),
    format = require("new-format");

module.exports = newBinding;

function newBinding(ext, element, template, context, toSubscribe){

  var binding = {
    ext          : ext,
    callback     : onUpdate,
    subscription : undefined
  };

  init();

  return binding;

  function init(){
    ext.updateFn && ( binding.subscription = subscribeToContext(toSubscribe, onUpdate) );
    ext.initFn && ext.initFn(element, ext.isBlock ? toSubscribe : formatted(), template);
  }

  function formatted(){
    return ( ext.renderFn || format ) ( template, context );
  }

  function onUpdate(update){
    if( ! ext.updateFn ) return;

    if( ext.isBlock ) {
      ext.updateFn(element, update, context, template);
      return;
    }

    ext.updateFn( element,  formatted() );
  };

}

function subscribeToContext(context, callback){
  if( ! Array.isArray(context) ) {
    context.subscribe(callback);
    return;
  }

  var params = [];
  params = context.slice();
  params.push(callback);

  on.apply(undefined, params);
}
