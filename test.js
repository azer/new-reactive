var attrs    = require('attrs'),
    reactive = require('./');

function later(fn){ setTimeout(fn, 100); }

before(function(done){

  $('body').append('<div id="sandbox"></div>');

  done();

});

describe('fragment', function(){

  var context;

  beforeEach(function(done){

    var html = '<article>'
          + '<h1 cat-text="title">title</h1>'
          + 'Title is <a cat-href="foo/bar/{slug}" cat-content="link to foo/bar/{slug}"></a>'
          + '<h2 cat-id="kitten-{slug}-{id}" cat-content="greeting is {greeting}"></h2>'
          + '</article>';

    context = attrs({
      id       : 0,
      slug     : 'this-is-the-title',
      title    : 'This is the title.',
      greeting : 'Welcome yo!'
    });

    $('#sandbox').html(html);

    done();

  });

  it('adds a new extension', function(){

    var cat = reactive.ns('cat');

    cat.extend('text', function(binding){

    });

    expect(cat.extensions.text.update).to.be.a('function');

  });

  it('distributes context updates to extensions', function(done){

    var cat = reactive.ns('cat');

    cat.extend('id', function(element, update){
      element.setAttribute('id', update);
    });

    cat.extend('content', function(element, update){
      element.innerHTML = update;
    });

    cat.extend('text', function(element, update){
      element.innerHTML = update;
    });

    cat.extend('href', function(element, update){
      element.setAttribute('href', update);
    });

    reactive(document.querySelector('article'))
      .context(context)
      .use(cat);

    later(function(){
      context.title('hello kittiz');
      context.greeting('wilkommen yo!');
      context.slug('slugggg');
      context.id('iddddd');
    });

  });

});
