 /*global Profile, Tipped */

var Previewer = function(Profile, config, Tipped) {
  var _this = {};
  var timeout = null;
  var _thumbLinkEventHandler = {};

  function initialize() {
    Tipped.updateConfigs(config);
    document.body.addEventListener('mouseover', _thumbLinkEventHandler.mouseover, !1);
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

    Tipped.updateConfigs(config);
  }

  _thumbLinkEventHandler.mouseover = function(evt) {
    var { target } = evt;
    var videoId = Profile.getVideoId(target);
    clearTimeout(timeout);

    if ('img' == target.localName && target.width > 50 && videoId) {
      console.log('mouseover');
      evt.preventDefault();
      target.addEventListener('click', _thumbLinkEventHandler.mouseout, !1);
      timeout = setTimeout(function() {
        target.addEventListener('mouseout', _thumbLinkEventHandler.mouseout, !1);
        Tipped.showPanel(evt, videoId);
      }, config.delayPreview);
    }
  };

  _thumbLinkEventHandler.mouseout = function(evt) {
    console.log('mouseout', evt.type);
    clearTimeout(timeout);
    Tipped.hidePanel(evt);
  };

  initialize();

  return _this;
};