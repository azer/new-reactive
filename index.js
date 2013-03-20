var registry = {};

module.exports = bind;
module.exports.extend = extend;

function bind(name, prop, fragment){

  var subscriptions = [];

  refresh();

  return {
    destroy       : destroy,
    refresh       : refresh,
    subscriptions : subscriptions
  };

  function refresh(){
    destroy();

    var ext, cb, els;
    for(ext in registry){

      els = elements(fragment, ext, name);

      registry[ext](prop(), els);

      cb = function(update){
        registry[ext](update, els);
      };

      prop.subscribe(cb);

      subscriptions.push({ prop: prop, cb: cb });
    }
  }

  function destroy(){
    var i = subscriptions.length;
    while(i--){
      subscriptions[i].prop.unsubscribe(subscriptions[i].cb);
    }
  }

}

function elements(parent, ext, value){
  return parent.querySelectorAll(selector(ext, value));
}

function extend(attr, callback){
  registry[attr] = callback;
}

function selector(ext, value){
  return '[data-'+ext+'='+value+']';
}

extend('text', function(update, elements){

  Array.prototype.forEach.call(elements, function(el){
    el.innerHTML = el.value = update;
  });

});
