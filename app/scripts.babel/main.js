/*jshint newcap: false*/
/*global Previewer, Profiles, Tipped */

(function(window, Previewer, Profiles, Tipped) {
  'use strict';

  var App,
    list = {
      'www.youtube.com': 'youtube'
    },
    config = {
      delayPreview: 500,
      playbackRate: 1,
      mute: false,
      showCaption: false
    };

  chrome.storage.sync.get(config, function(config) {
    config.delayPreview = Number(config.delayPreview);
    config.playbackRate = Number(config.playbackRate);
    config.mute = Boolean(config.mute);
    config.showCaption = Boolean(config.showCaption);

    var profile = Profiles[list[window.location.host] || 'youtube']();

    App = Previewer(profile, config, Tipped);
    chrome.storage.onChanged.addListener(App.updateConfigs);
  });


})(window, Previewer, Profiles, Tipped);