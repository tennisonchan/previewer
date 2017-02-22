var Profiles = {};

Profiles.youtube = function() {
  var _this = {};

  _this.getVideoId = function(videoThumbEl) {
    return $(videoThumbEl).closest('[data-video-id]').attr('data-video-id') || // playlist
      $(videoThumbEl).closest('[data-context-item-id]').attr('data-context-item-id') || // home page
      $(videoThumbEl).closest('[itemprop=videoId]').attr('content') ||
      $(videoThumbEl).closest('[data-vid]').attr('data-vid');
  };

  return _this;
};