function Model(el) {
  this.el = el;
}

Model.prototype.toJSON = function() {
  var ret = {};

  Object.keys(this).forEach(function(key) {
    if (typeof this[key] !== 'undefined' && key!=='el') {
      if (typeof this[key].cachedValue !== 'undefined') {
        ret[key] = this[key].cachedValue;
      } else {
        ret[key] = this[key];
      }
    }
  }.bind(this));
  return ret;
};

Model.prototype.compute = function(keys, fn) {
  var map = {},
      values = new Array(keys.length),
      that = this;

  keys.forEach(function(key, i) {

    var hinge;
    if (typeof key === 'function') {
      values[i] = key();
      hinge = key;
    } else {
      values[i] = that[key]();
      hinge = that[key];
    }

    hinge.change(function(val, prev) {
      values[i] = val;
      fn.apply(that, values);
    });
  })
};

function calculateValue(datatype, el) {

  if (el && el.tagName) {
    if (el.type === 'checkbox') {
      val = el.checked;
    } else {
      val = el.value;
    }
  } else {
    val = el;
  }
  if (datatype === 'float') {
    return parseFloat(val);
  } else if (datatype === 'integer') {
    return parseInt(val, 10);
  } else if (datatype === 'bool') {
    return !!val;
  } else {
    return val;
  }
}

function tincture(el) {
  var ret = new Model(el);

  var inputs = el.querySelectorAll('input,textarea');
  var count = inputs.length;
  while(count--) {
    (function(el) {
      var datatype = el.attributes.getNamedItem('data-type').value;
      var name = el.name;

      var getset = ret[name] = function(val) {
        if (val) {
          previousValue = getset.cachedValue;
          getset.cachedValue = calculateValue(datatype, val);
          el.value = getset.cachedValue;
          getset.change();
        }

        return getset.cachedValue;
      };

      var handlers = [];
      getset.change = function(fn) {
        if (fn) {
          handlers.push(fn);
        } else {
           handlers.forEach(function(handler) {
            handler(getset.cachedValue, getset.previousValue);
          });
        }
      };

      var errorHandlers = [];
      getset.error = function(fn) {
        if (fn) {
          errorHandlers.push(fn);
        } else {
           errorHandlers.forEach(function(handler) {
            handler(getset.cachedValue, getset.previousValue);
          });
        }
      };

      getset.cachedValue = calculateValue(datatype, el);
      getset.previousValue = null;

      // allow first tick setup before firing change
      setTimeout(getset.change, 16);

      var changeHandler = function() {
        var newValue = calculateValue(datatype, el);

        if (isNaN(newValue)) {
          getset.error(newValue, getset.cachedValue);
          return;
        }

        getset.previousValue = getset.cachedValue;
        getset.cachedValue = newValue;
        getset.change();
      };

      ['change', 'keyup'].forEach(function(e) {
        el.addEventListener(e, changeHandler, false);
      });

      getset.el = el;

    })(inputs[count]);
  }

  var outputs = el.querySelectorAll('[data-output]');
  var outputCount = outputs.length;
  while(outputCount--) {
    (function(output) {
      ret[output.getAttribute('data-output')] = function(text) {
        if (output.tagName === 'input') {
          output.value = text;
        } else {
          output.innerHTML = text;
        }
      }.bind(ret);
    })(outputs[outputCount]);
  }

  var outputs = el.querySelectorAll('[data-error]');
  var outputCount = outputs.length;
  while(outputCount--) {
    (function(output) {
      ret[output.getAttribute('data-error')].error(function(text) {
        output.style.display = "block";
      }.bind(ret));

      ret[output.getAttribute('data-error')].change(function(text) {
        output.style.display = "none";
      }.bind(ret));

    })(outputs[outputCount]);
  }

  return ret;
};

if (typeof module !== 'undefined') {
  module.exports = tincture;
} else {
  window.tincture = tincture;
}
