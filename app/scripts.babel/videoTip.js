function onYouTubeIframeAPIReady() {
  PreviewPlayer.onYouTubeIframeAPIReady();
}

var PreviewPlayer = (function(window) {
  var _this = {};
  var player;
  var _config = {
    height: 270,
    width: 480,
    videoId: '',
    playbackRate: 1,
    playbackQuality: 'small'
  };
  var _messageHandler = {
    stopVideo: function() {
      player.stopVideo();
    },
    pauseVideo: function() {
      player.pauseVideo();
    },
    playVideo: function() {
      player.playVideo();
    },
    seekTo: function({ seconds, allowSeekAhead }) {
      player.seekTo(seconds, allowSeekAhead);
    }
  };

  function getParams(searcParams) {
    var params = {};
    searcParams.replace(/([^=&]+)=([^&]*)/g, function(m, key, value) {
      if (value) params[decodeURIComponent(key)] = decodeURIComponent(value);
    });

    Object.assign(_config, params);
  }

  function initialize () {
    var params = getParams(window.location.search);
    Object.assign(_config, params);

    window.addEventListener('message', function receiveMessage(evt) {
      var { message, data = null } = evt.data;

      if (message && typeof _messageHandler[message] === 'function') {
        _messageHandler[message](data);
      }
    }, false);
  }

  _this.onYouTubeIframeAPIReady = function() {
    console.log('youtubeIframeAPIReady', performance.now());
    var { width, height, videoId } = _config;

    player = new YT.Player('player', {
      height: height,
      width: width,
      videoId: videoId,
      playerVars: {
        autoplay: 0,
        controls: 0,
        showinfo: 0,
        rel: 0,
        modestbranding: 1
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
        onError: onPlayerError
      }
    });
  }

// function jumpTo() {
//   var currentTime = player.getCurrentTime();
//   player.seekTo(currentTime + 10, true);
// }

  function onPlayerReady(event) {
    console.log('onPlayerReady', performance.now());

    var { playbackRate, playbackQuality } = _config;
    // setInterval(function() {
    //   console.log('hello', player.getCurrentTime());
    // }, 1000);
    player.seekTo(15, true);
    player.setPlaybackQuality(playbackQuality);
    player.setPlaybackRate(playbackRate);
  }

  function onPlayerStateChange(event) {
    switch (event.data) {
      case YT.PlayerState.PLAYING:
        console.log('onPlayerStateChange:PLAYING', performance.now(), player);
      break;
      case YT.PlayerState.PAUSED:
      break;
      case YT.PlayerState.ENDED:
      break;
    }
  }

  function onPlayerError(evt) {
    console.log('evt', evt);
  }

  initialize();

  return _this;

})(window);
