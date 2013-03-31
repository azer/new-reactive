## new-reactive

Lets you build your own UI binding abstractions.

It's based on [observable attributes](http://github.com/attrio/attr).

### Install

```bash
$ npm install new-reactive
```

### Usage

```html
<article class="fruit">
    <h1 cat-text="title"></h1>
    <a cat-href="fruits/{slug}/{id}">Apple #<span cat-text="id"></span></h1>
</article>

<script type="text/javascript">

    var attrs    = require('attrs'),
        reactive = require('new-reactive'),
        cat      = bindings.ns('cat'),

        fruit = attrs({
            id    : 314,
            slug  : 'finike-oranges',
            title : 'Finike Oranges'
        })

    fruit.title()
    // => 'Finike Oranges'

    reactive(document.querySelector('.fruit'))
        .context(fruit)
        .use(cat) // cat is implemented on the next section

    tenSecondsLater(function(){
        context.id(156)
        context.slug('delicious-finike-oranges')
        context.title('Delicious Finike Oranges!!')
    })

</script>
```

### Implementation

```js
var cat = reactive.ns('cat')

cat.extend('href', function(element, update){
  text.setAttribute('href', update)
})

cat.extend('text', function(element, update){
  text.innerHTML = update
})
```

### TODO

* Impl destroy methods
* Test iterating
