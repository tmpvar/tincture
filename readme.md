# Tincture

bind to the inputs/outputs of a dom branch

## Install

`npm install tincture`

## Use

```html

<div id="calculator">
  <p>
    width: <input type="text" name="width" data-type="float" />
  </p>
  <p>
    height: <input type="text" name="height" data-type="float" />
  </p>
  <p>
    Area: <span data-output="area"></span>
  </p>
</div>

```

```javascript

var tincture = require('tincture');

var component = tincture(document.getElementById('calculator'));

component.compute(['width', 'height'], function(width, height) {
  this.area(width * height);
});

component.width.change(function(val, prev) {
  console.log('width just changed from', prev, 'to', val);
});

```

To see this example in action visit the [examples directory](http://github.com/tmpvar/)

### data-types

  `float`, `integer`

## License

MIT
