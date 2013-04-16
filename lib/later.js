module.exports = later;

function later(fn){
  setTimeout(fn, 0);
}
