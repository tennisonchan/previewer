function getVideoUrls (str) {
  return str && str.split(',')
    .map(item => item
      .split('&')
      .reduce((prev, curr) => (curr = curr.split('='),
        Object.assign(prev, {[curr[0]]: decodeURIComponent(curr[1])})
      ), {})
    )
    .reduce((prev, curr) => Object.assign(prev, {
      [curr.type.split(';')[0] + ':' + curr.quality]: curr
    }), {});
}

var Videoboard = function(target, videoboard, videoUrls) {
  console.log('videoboardSpec', videoboard.storyboard_spec);
  var result = (videoboard.storyboard_spec || '').split('|');
  var baseUrl = result.shift();
  var index = result.length - 1;
  var arr = result[index].split('#');

  this.videoUrls = getVideoUrls(videoboard.url_encoded_fmt_stream_map);
  this.url = this.videoUrls['video/mp4:medium'].url;
  this.init(arr, baseUrl, index);

  return this;
};

Videoboard.prototype.setupTip = function(target) {
  $(target).qtip({
    content: {
      text: function(event, api) {
        // return $.ajax(chrome.extension.getURL('videoboard.html'))
        // .then(function(content) {
        //   // Set the tooltip content upon successful retrieval
        //   return content;
        // }, function(xhr, status, error) {
        //   // Upon failure... set the tooltip content to error
        //   api.set('content.text', status + ': ' + error);
        // });
        return this.appendVideoTo();
      }
    },
    position: {
      viewport: $(window)
    },
    style: 'qtip-bootstrap'
  });
}

Videoboard.prototype.init = function(arr, baseUrl, index) {
  this.baseUrl = baseUrl;
  this.col = Number(arr[4]);
  this.count = 0;
  this.el = null;
  this.frameheight = Number(arr[1]);
  this.frameWidth = Number(arr[0]);
  this.height = Number(arr[1]);
  this.index = index;
  this.ms = Number(arr[5]);
  this.row = Number(arr[3]);
  this.sigh = arr[7];
  this.totalFrames = Number(arr[2]);
  this.unit = arr[6];
  this.width = Number(arr[0]);
  this.target = null;
  this.progressBar = null;
  this.isPlaying = false;

  this.maxPage = Math.ceil(this.totalFrames / (this.row * this.col));
};

Videoboard.prototype.set = function(key, value) {
  if (key !== undefined && value !== undefined) {
    this[key] = value;
  }
  return this;
};


Videoboard.prototype.getVideoUrl = function() {
  let videoUrlObj = this.videoUrls['video/mp4:medium'];

  return videoUrlObj.url;
}

Videoboard.prototype.appendVideoTo = function() {
  let videoUrlObj = this.videoUrls['video/mp4:medium'];

  console.log('videoUrlObj', videoUrlObj);

  if (!this.el &&
      this.target.prevAll('.no-preview, .storyboard').length === 0) {

    // Tipped.create(this.el, $('<video/>', {
    //   class: 'storyboard',
    //   src: videoUrlObj.url
    // }), {
    //   stem: false,
    //   shadow: false,
    // });

    // this.el = $('<video/>', {
    //   class: 'storyboard',
    //   src: videoUrlObj.url,
    //   autoplay: true,
    //   width: this.target.width(),
    //   height: this.target.height()
    // })
    // .insertBefore(this.target);
  }

  return this.el;
};

Videoboard.prototype.play = function() {
  // this.el.get(0).play();
};

Videoboard.prototype.pause = function() {
  // this.el.get(0).pause();
};


Videoboard.prototype.reset = function() {
  this.pause();
};
