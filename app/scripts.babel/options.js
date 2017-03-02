(function($) {

  var animationTimeInterval = 0;
  var timeout = 0
  var frame = 0;

  $(function() {
    restore_options();
  });

  function restore_options() {
    chrome.storage.sync.get({
      mute: false,
      playbackRate: 1,
      showCaption: false,
      startAt: 0,
    }, function(data) {
      var mute = Boolean(data.mute);
      var playbackRate = Number(data.playbackRate);
      var showCaption = Boolean(data.showCaption);
      var startAt = Number(data.startAt);
      console.log('hello', playbackRate, mute, showCaption, startAt);

      clearInterval(animationTimeInterval);
      animationTimeInterval = setInterval(animate, 50 / playbackRate);
      var captionSwitchElement = document.querySelector('.caption-switch');
      var muteSwitchElement = document.querySelector('.mute-switch');
      var playbackRateSlideElement = document.querySelector('#playback-rate-slide');
      var startAtSlideElement = document.querySelector('#start-at-slide');

      captionSwitchElement.MaterialSwitch[showCaption ? 'on' : 'off']();
      muteSwitchElement.MaterialSwitch[mute ? 'on': 'off']();
      playbackRateSlideElement.MaterialSlider.change(playbackRate);
      startAtSlideElement.MaterialSlider.change(startAt);
    });
  }

  function saveOption(key, value, message) {
    var data = {};

    data[key] = value;

    console.log('hello', data);

    chrome.storage.sync.set(data, function() {
      $('#snackbar').get(0).MaterialSnackbar.showSnackbar({
        message: message || 'Saved!',
        timeout: 1000
      });
    });
  }

  function animate() {
    var topPosition = (frame % 16 / 4 | 0) * 236.5;
    var leftPosition = (frame % 16 % 4) * 322;

    $('.animated-background').css({
      backgroundPosition: '-' + leftPosition + 'px -' + topPosition + 'px',
    });

    frame++;
  }

  $('#start-at-slide')
    .on('input', function(e) {
      clearInterval(timeout);
      var value = this.value;
      timeout = setTimeout(function() {
        saveOption('startAt', Number(value), 'Saved start time at ' + value + ' second(s)');
      }, 500);
    });


  $('#playback-rate-slide')
    .on('input', function(e) {
      clearInterval(animationTimeInterval);
      animationTimeInterval = setInterval(animate, 50 / this.value);
      saveOption('playbackRate', Number(this.value), 'Saved playback rate as ' + this.value);
    });

  $('#caption-switch')
    .on('change', function() {
      let message = this.checked ? 'Show caption in preview video' : 'Hide caption in preview video';
      saveOption('showCaption', this.checked, message);
    });

  $('#mute-switch')
    .on('change', function() {
      let message = this.checked ? 'Mute video panel' : 'Unmute video panel';
      saveOption('mute', this.checked, message);
    });

})(jQuery);