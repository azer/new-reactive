var newBinding   = require("./binding"),
    newExtension = require("./extension");

module.exports = newNS;

function newNS(name){

  var ns = {
    destroy    : destroy,
    extend     : extend,
    extensions : {},
    name       : name
  };

  return ns;

  function destroy(){
    ns.extensions = undefined;
    delete ns.extensions;

    ns = undefined;
    delete ns;
  }

  function extend(name, callback){
    var ext = newExtension(name, callback);
    ns.extensions[name] = ext;
    return ext;
  }

}
