var ada  = require('ada'),
    bind = require('./');

function later(fn){ setTimeout(fn, 100); }

before(function(done){
  $('body').append('<div id="sandbox"></div>');
  done();
});

describe('bind', function(){

  var sandbox;

  beforeEach(function(){
    sandbox = document.getElementById('sandbox');

    sandbox.innerHTML =
      '<h1 data-text="title"></h1>'
      + '<input data-text="title"></input>'
      + '<a data-href="title"></a>';
  });

  it('is an abstracted, extendible basic binding impl', function(done){

    var title = window.tits = ada('Hello Kitty.');

    window.b = bind('title', title, sandbox);

  });

});





/*

describe('data-text', function(){

  var sandbox = document.getElementById('sandbox');

  beforeEach(function(){
    $("#sandbox").html('<div class="foo" data-text="foo"></div> <div class="bar" data-text="bar"></div>');
  });

  it('updates the content on setup', function(done){

    var content = {
      foo: ada('3.14'),
      bar: ada('156')
    };

    bind(sandbox, content)

    later(function(){
      var f = $('.foo').text(),
          b = $('.bar').text();

      expect(f).to.equal('3.14');
      expect(b).to.equal('156');

      done();

    });

  });

});
*/
