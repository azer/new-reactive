module.exports = newExtension;

function newExtension(name, callback){

  var ext = {
    name   : name,
    update : callback
  };

  ext.elements = function(dom, ns){
    return Array.prototype.slice.call(elements(dom, name, ns));
  };

  return ext;
}

function elements(dom, ext, ns){
  return dom.querySelectorAll(selector(ns, ext));
}


function selector(ns, ext){
  return '[' + ns + '-' + ext + ']';
}
