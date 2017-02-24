(function($) {

  var timeInterval;
  var frame = 0;

  $(function() {
    restore_options();
  });

  function restore_options() {
    chrome.storage.sync.get({
      playbackRate: 1,
      mute: false,
      showCaption: false,
    }, function(data) {
      var playbackRate = Number(data.playbackRate);
      var mute = Boolean(data.mute);
      var showCaption = Boolean(data.showCaption);
      console.log('hello', playbackRate, mute, showCaption);

      clearInterval(timeInterval);
      timeInterval = setInterval(animate, 50 / playbackRate);
      var muteSwitchElement = document.querySelector('.mute-switch');
      var captionSwitchElement = document.querySelector('.caption-switch');
      var playbackRateSlideElement = document.querySelector('#playback-rate-slide');

      playbackRateSlideElement.MaterialSlider.change(playbackRate);
      muteSwitchElement.MaterialSwitch[mute ? 'on': 'off']();
      captionSwitchElement.MaterialSwitch[showCaption ? 'on' : 'off']();
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

  $('#playback-rate-slide')
    .on('input', function(e) {
      clearInterval(timeInterval);
      timeInterval = setInterval(animate, 50 / this.value);
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