beforeEach(function() {
  this.addMatchers({
    toBeCachedIn: function(expected) {
      var index = expected.cache.indexOf(this.actual)

      var found = false;
      for (var x = 0; x < expected.cache.length; x++) {
        var element = expected.cache[x];
        if (this.actual.value === element.value) {
          found = true;
        }
      }
      return found;
      // this.message = "Expected " + this.actual + " to be found in autocomplete cache: " + expected.cache;
      // return index !== -1;
    }
  });

  $.mockjaxClear();
  sinon.clock.reset();
});

window.mockTimer = sinon.useFakeTimers();

$.mockjaxSettings = $.extend(true, $.mockjaxSettings, {
  log: function(){},
  type: 'GET',
  status: 200,
  responseTime: 30,
  contentType: 'text/json'
});

window.mockjaxTick = function(optionalMS){
  var ms = (_.isNumber(optionalMS)) ? optionalMS : $.mockjaxSettings.responseTime;

  window.mockTimer.tick(ms);
};

window.tick = function(ms){
  if (!_.isNumber(ms)){
    throw new Error('tick called without ms argument. Please provide a Number in milliseconds.');
  }
  window.mockTimer.tick(ms);
};

// Alias Sinon methods
window.stub = sinon.stub;
window.spy = sinon.spy;
window.mock = sinon.mock;

// QUnit.lastModuleDone = function(){
//   if (window.mockTimer) {
//     window.mockTimer.restore();
//   }
// };
