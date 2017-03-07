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
      mute: false,
      playbackRate: 1,
      startAt: 0,
    };

  chrome.storage.sync.get(config, function(config) {
    config.delayPreview = Number(config.delayPreview);
    config.mute = Boolean(config.mute);
    config.playbackRate = Number(config.playbackRate);
    config.startAt = Number(config.startAt);

    var profile = Profiles[list[window.location.host] || 'youtube']();

    App = Previewer(profile, config, Tipped);
    chrome.storage.onChanged.addListener(App.updateConfigs);
  });


})(window, Previewer, Profiles, Tipped);