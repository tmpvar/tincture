# Tincture

bind to the inputs/outputs of a dom branch

## Install

`npm install tincture`

## Use

```html

<div id="calculator">
  <p>
    X: <input type="text" name="x" data-type="float" />
  </p>
  <p>
    X: <input type="text" name="y" data-type="float" />
  </p>
  <p>
    Area: <span data-output="area"></span>
  </p>
</div>

```

```javascript

var tincture = require('tincture');

var component = tincture(document.getElementById('calculator'));

component.compute(['x', 'y'], function(x, y) {
  this.area(x * y);
});

component.x.change(function(val, prev) {
  console.log('x just changed from', prev, 'to', val);
});

```

To see this example in action visit the [examples directory](http://github.com/tmpvar/)

### data-types

  `float`, `integer`

## License

MIT
