/*jshint newcap: false*/
/*global Preview, Profiles */

(function(window, Preview, Profiles, Tipped) {
  'use strict';

  var App,
    list = {
      'www.youtube.com': 'youtube'
    },
    config = {
      delayPreview: 100,
      playbackRate: 1
    };

  chrome.storage.sync.get(config, function(config) {
    config.delayPreview = Number(config.delayPreview);
    config.playbackRate = Number(config.playbackRate);
    var profile = Profiles[list[window.location.host] || 'youtube']();

    App = Previewer(profile, config, Tipped);
    chrome.storage.onChanged.addListener(App.updateConfigs);
  });


})(window, Previewer, Profiles, Tipped);