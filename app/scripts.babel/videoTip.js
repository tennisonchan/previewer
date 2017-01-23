function onYouTubeIframeAPIReady() {
  PreviewPlayer.onYouTubeIframeAPIReady();
}

var PreviewPlayer = (function(window) {
  var _this = {};
  var player;
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

  function initialize () {
    window.addEventListener('message', function receiveMessage(evt) {
      var { message, data = null } = evt.data;

      if (message && typeof _messageHandler[message] === 'function') {
        _messageHandler[message](data);
      }
    }, false);
  }

  _this.onYouTubeIframeAPIReady = function() {
    console.log('youtubeIframeAPIReady', performance.now());
    var params = new URLSearchParams(window.location.search);

    player = new YT.Player('player', {
      height: params.get('height'),
      width: params.get('width'),
      videoId: params.get('videoId'),
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

    player.seekTo(15, true);
    // setInterval(function() {
    //   console.log('hello', player.getCurrentTime());
    // }, 1000);
    player.setPlaybackQuality('small');
    player.setPlaybackRate(2);
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
