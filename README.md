## bind

Bind is a minimalist is a UI binding library that lets you build your own UI binding libraries.

It's based on [Ada properties](http://github.com/adaio/ada).

### Install

```bash
$ npm install ada-bind
```

### How does it look?

Let's create a new binding library lies on "cat" namespace, with attributes like "text", "href" and "class":

```html
<h1 cat-text="title"></h1>

<a cat-href="url"></h1>

<div class="content" cat-class="hidden:!isVisible, new:isRecentlyCreated">
  The title says <span cat-text="title"></span>. How does it sound?
</div>
```

Curious how could you implement it? Keep reading, it's damn simple.

### WTF is the Ada?

Ada is a kind of observable object composes [properties](http://github.com/adaio/prop) and [pubsub](http://github.com/azer/pubsub)

Here is an example usage of it;

```js
title = ada('Hello World')

title()
//=> Hello World

title.subscribe(function(update, old){
  update
  // => Hello Kitty
  old
  // => Hello World
})

title('Hello Kitty')
```


### Usage

**First step:** create the new namespace.

```js
var cat = bind('cat');
```

**Second step:** start creating the extensions.

```js
cat.extend('text', function(update, elements){

  elements.forEach(function(element){
    element.innerHTML = update;
  });

});
```

This code above implements `cat-text`. Now let's look at how do we use it;

```html
<h1 cat-text="title"></h1>
The title says <span cat-text="title"></span>. How does it sound?

<script type="text/javascript">

var title = ada('Hello World');

cat('title', title, document.body); // this is how a new UI binding is created!

oneSecondLater(function(){
  title('Hello Kitties!')
})

</script>
```

As you expect, `h1` and `span` elements will have "Hello World" as content at first. After one second, their content will be replaced by "Hello Kitties!" since
we change the value of the `title` property.

Here how it works:

* Once you run `cat('title', title, document.body)`, all the matching elements with `cat-text="title"` are passed to the extension callbacks.
* Extension callback operates the elements with the recent value of the binded property.
* A wrapper that fires the extension callback subscribes to the binded property.


Let's move this example code forward and create a new attribute: `cat-href`

```js
cat.extend('href', function(update, elements){

  elements.forEach(function(element){
    element.setAttribute('href', update)
  })

})
```

`cat-href` is as simple as `cat-text`. Both expect plain values, and set value on the DOM.

Let's solve a harder problem, implement a new attribute called `cat-class`. This will allow us to
bind class names with properties. The syntax we want is;

```html
<div class="content" cat-class="new:isRecentlyCreated, hidden:!isVisible" />
```

The binding name comes after the class, and multiple classes are separated with comma.
How do we implement `cat-class`? Not as hard as it sounds.

```js

cat.onDefining('class', function(value){

  var bindingName, className;

  return value.split(/,\s?/).map(function(cut){

    cut         = cut.split(':')
    className   = cut[0]
    bindingName = cut[1]
    not         = false

    if( bindingName[0] == '!' ){
      not = true
      bindingName = bindingName.slice(1)
    }

    return { binding : bindingName,
             params  : [className, not] }

  })

})

cat.extend('class', function(update, element, bindingName, className, not) {

   elements.forEach(function(el){

     if(update || not){
       el.classList.add(className)
     } else {
       el.classList.remove(className)
     }

   })

})
```

The way we bind this kind of complexer attributes doesn't differ:

```js
cat('isRecentlyCreated', isRecentlyCreated, document.body)
```

Let's complete the example:

```html
<h1 cat-text="title"></h1>

<a cat-href="url"></h1>

<div class="content" cat-class="hidden:!isVisible, new:isRecentlyCreated">
  The title says <span cat-text="title"></span>. How does it sound?
</div>

<script type="text/javascript">

title             = ada('Hello World')
url               = ada('http://helloworld.com')
isRecentlyCreated = ada(true)
isVisible         = ada(false)

cat('title', title, document.body)
cat('isRecentlyCreated', isRecentlyCreated, document.body)
cat('isVisible', isVisible, document.body)

oneSecondLater(function(){
  title('Hello Kitties!')
  url('http://hellokitties.com')
  isVisible(true)
})

tenMinutesLater(function(){
  isRecentlyCreated(false)
})

</script>
```

### Destroying Objects

```js
binding = cat('title', title, document.body)

tenMinutesLater(binding.destroy)
```
