var Tipped = (function($, window, document) {

  var _this = {},
      tip = null;

function setAttributes(target, attrs) {
  for (var name in attrs) {
    target.setAttribute(name, attrs[name]);
  }
}

function setStyles(target, props, isImportant) {
  if (target) {
    var isImportant = isImportant ? 'important' : null;
    for (var name in props) {
      target.style.setProperty(name, props[name], isImportant);
    }
  }
}

function setVideoId(videoId) {
  if (videoId) {
    var { tip, iframeEl } = getTip();
    iframeEl.src = chrome.extension.getURL('videoTip.html?width=480&height=270&videoId=' + videoId);
  }
}

_this.postMessage = function(data) {
  var { tip, iframeEl } = getTip();
  iframeEl.contentWindow.postMessage(data, chrome.extension.getURL(''));
}

function initialize() {
  console.log('initialize', performance.now());
}

function getTip() {
  var iframeEl;
  if (tip) {
    iframeEl = tip.firstElementChild;
  } else {
    tip = document.createElement('div');
    iframeEl = document.createElement('iframe');
    tip.className = 'magic-tip';
    setAttributes(iframeEl, { scrolling: 'no', frameborder: 0 });
    tip.appendChild(iframeEl);
    document.body.appendChild(tip);
  }

  return {
    tip: tip,
    iframeEl: iframeEl
  };
}

_this.showPanel = function(evt, videoId) {
  popupPanel(evt);
  setVideoId(videoId);
}

_this.hidePanel = function(evt) {
  removeMouseoutEvent(evt);

  _this.postMessage({ message: 'stopVideo' });
}

function popupPanel(evt) {
  var target = evt.target;
  var gHoverCardElements = document.body.querySelectorAll('.g-hovercard');
  for (var i = 0, len = gHoverCardElements.length; i < len; ++i) {
    gHoverCardElements[i].classList.remove('g-hovercard');
  }

  console.log('setTimeout:start', performance.now());

  var align = 'center';
  if (target) {
    var _offsetLeft = 0;
    var _offsetTop = 0;
    var d = target;
    if (d.offsetParent) {
      do {
        _offsetLeft += d.offsetLeft;
        _offsetTop += d.offsetTop;
        d = d.offsetParent;
      } while (d);
    }
  }
  var targetOffsetWidth = target.offsetWidth;
  var targetOffsetHeight = target.offsetHeight;
  var iframeWidth = 0;
  var iframeHeight = 0;
  var left = window.scrollY;
  if (target.src) {
    var src = target.src;
    // target.setAttribute('data-magic', true);
    if (/s\d+-c-k/.test(src)) {
      if (!target.hasAttribute('data-magic')) {
        target.src = src = src.replace(/s\d+-c-k/, 's384-c-k');
      }
      iframeWidth = iframeHeight = 384;
      align = 'center';
    } else {
      if (/sz=[0-9]+/.test(src)) {
        if (!target.hasAttribute('data-magic')) {
          target.src = src = src.replace(/sz=[0-9]+/, 'sz=384');
        }
        iframeWidth = iframeHeight = 384;
        align = 'center';
      } else {
        if (/=s[0-9]+/.test(src)) {
          if (!target.hasAttribute('data-magic')) {
            target.src = src = src.replace(/=s[0-9]+/, '=s384');
          }
          iframeWidth = iframeHeight = 384;
          align = 'center';
        }
      }
    }
    console.log('iframeWidth', iframeWidth);
    if (0 == iframeWidth) {
      if (/w=\d+/.test(src)) {
        src = src.replace(/w=\d+/, 'w=480').replace(/h=\d+/, '360');
        iframeWidth = 480;
        iframeHeight = 270;
        align = '-45px';
      } else {
        if (/mqdefault|default/.test(src)) {
          src = src.replace(/mqdefault|default/, 'hqdefault');
          iframeWidth = 480;
          iframeHeight = 270;
          align = '-45px';
        }
      }
    }
    if (0 != iframeWidth) {
      if (_offsetLeft < window.innerWidth / 2) {
        var tipLeft = _offsetLeft + targetOffsetWidth + 20;
      } else {
        var tipLeft = _offsetLeft - iframeWidth - 20;
      }
      var tipTop = _offsetTop - parseInt((iframeHeight - targetOffsetHeight) / 2) - 5;
      if (tipTop < left) {
        tipTop = left;
      }
      var { tip, iframeEl } = getTip();
      setStyles(tip, {
        top: tipTop + 'px',
        left: tipLeft + 'px',
        height: iframeHeight + 'px'
      }, true);
      setStyles(iframeEl, {
        width: iframeWidth + 'px',
        height: iframeHeight + 'px',
        background: 'url(' + src + ') center ' + align + '/100% auto no-repeat',
        display: 'block'
      }, true);
      tip.style.setProperty('display', 'block', 'important');
    }
  }
  console.log('setTimeout:end', performance.now());
}

function removeMouseoutEvent(evt) {
  evt.target.removeEventListener('mouseout', removeMouseoutEvent, !1);
  if (tip) {
    tip.style.setProperty('display', 'none', 'important');
  }
}

  initialize();

  return _this;

})(jQuery, window, window.document);
