var attrs    = require('attrs'),
    List     = require('new-list'),
    reactive = require('../'),
    template = require('./template'),
    context;

function later(fn){ setTimeout(fn, 100); }

describe('initializing', function(){

  it('defines simple extensions', function(done){
    var cat = reactive.ns('cat');

    cat.extend('content', function(element, update){
      element.innerHTML = update;
    });

    reactive(document.querySelector('article'))
      .context(context)
      .use(cat);

    later(function(){
      expect(document.querySelector('a').innerHTML).to.equal('a link to foo/bar/this-is-the-title');
      expect(document.querySelector('h2').innerHTML).to.equal('The greeting is "Welcome yo!"');
      done();
    });

  });

  it('defines a block extension', function(done){

    var cat = reactive.ns('cat');

    cat.extend('content', function(element, update){
      element.innerHTML = update;
    });

    cat.extend('iter')
      .init(function(element, context, template){

        context.forEach(function(item){
          addRow(element, -1, template, item);
        });

        context.subscribe(function(update){

          if(update.remove){
            i = update.remove.length;
            while(i--)
              element.removeChild( element.children[update.remove[i]] );
          }

          var i;
          if(update.add){
            for(i in update.add) addRow(element, i, template, update.add[i]);
          }

        });

      })
      .block();

    reactive(document.querySelector('article'))
      .context(context)
      .use(cat);

    later(function(){

      var banana = attrs({ name: banana, price: '$1' });
      context.fruits.push(banana);
      context.animals.push('Kortis');

      later(function(){
        banana.name('MUZ');
        banana.price('$3.33');

        later(function(){
          expect($('.fruits li')[0].innerHTML).to.equal('$3 - Apple');
          expect($('.fruits li')[1].innerHTML).to.equal('$2 - Orange');
          expect($('.fruits li')[2].innerHTML).to.equal('$3.33 - MUZ');
          done();
        });

      });

    });

    function addRow(parent, index, template, context){
      var frag, el;

      frag = document.createElement('div');
      frag.innerHTML = template;

      el = frag.children[0];

      parent.insertBefore(el, parent.children[index]);

      if(typeof context != 'object'){
        context = attrs({ '.' : context });
      }

      reactive(el)
        .context(context)
        .use(cat);
    }

  });


});

describe('updating later', function(){

  it('defines simple extensions', function(done){

    var cat = reactive.ns('cat');

    cat.extend('iter').block();

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

      context.title('new-title');
      context.greeting('new-greeting');
      context.slug('new-slug');
      context.id('new-id');

      later(function(){
        expect(document.querySelector('h2').getAttribute('id')).to.equal('kitten-new-slug-new-id');
        expect(document.querySelector('h2').innerHTML).to.equal('The greeting is "new-greeting"');
        expect(document.querySelector('a').innerHTML).to.equal('a link to foo/bar/new-slug');
        expect(document.querySelector('a').getAttribute('href')).to.equal('foo/bar/new-slug');
        expect(document.querySelector('h1').innerHTML).to.equal('new-title');

        done();
      });

    });

  });

});

before(function(done){
  $('body').append('<div id="sandbox"></div>');
  done();
});

beforeEach(function (done){
  var apple   = attrs({ name: 'Apple', price: '$3' }),
      orange  = attrs({ name: 'Orange', price: '$2' }),
      fruits  = List(apple, orange),
      animals = List('Nala', 'dongdong');

  context = window.context = attrs({
    id       : 0,
    slug     : 'this-is-the-title',
    title    : 'This is the title.',
    greeting : 'Welcome yo!',
    fruits   : fruits,
    animals  : animals
  });

  $('#sandbox').html(template);

  done();

});
