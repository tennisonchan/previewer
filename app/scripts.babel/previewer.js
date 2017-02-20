 /*global Profile, Tipped */

var Previewer = function(Profile, config, Tipped) {
  var _this = {};
  var timeout = null;

  function initialize() {
    document.body.addEventListener('mouseover', _thumbLinkEventHandler.mouseenter, !1);
  }

  function debounce(fn, delay) {
    return function() {
      var context = this,
        args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function() {
        timeout = null;
        fn.apply(context, args);
      }, delay);
    };
  }

  _this.updateConfigs = function(changes) {
    for (var key in changes) {
      config[key] = changes[key].newValue;
    }
  }

  var _thumbLinkEventHandler = {
    mouseenter: debounce(function(evt) {
      console.log('mouseenter');
      var { target } = evt;

      if('img' == target.localName && 50 < target.width) {
        evt.preventDefault();
        var videoId = Profile.getVideoId(target);
        target.addEventListener('mouseleave', _thumbLinkEventHandler.mouseleave, !1);
        Tipped.showPanel(evt, videoId);
      }
    }, config.delayPreview),
    mouseleave: function(evt) {
      console.log('mouseleave');
      clearTimeout(timeout);
      Tipped.hidePanel(evt);
    }
  };

  initialize();

  return _this;
};