var Tipped = (function($, window, document) {

  var _this = {
    iframeEl: null,
    iframeHeight: 270,
    iframeWidth: 480,
    tip: null,
  };

  function initialize() {
    var { tip, iframeEl } = createTip();
    _this.tip = tip;
    _this.iframeEl = iframeEl;
    console.log('initialize', performance.now());
  }

  function setStyles(el, props, isImportant) {
    if (el) {
      var isImportant = isImportant ? 'important' : null;
      for (var name in props) {
        el.style.setProperty(name, props[name], isImportant);
      }
    }
  }

  function setVideoId(videoId) {
    if (videoId) {
      var height = _this.iframeHeight;
      var width = _this.iframeWidth;
      _this.iframeEl.src = chrome.extension.getURL(`videoTip.html?width=${width}&height=${height}&videoId=${videoId}`);
    } else {
      _this.iframeEl.style.setProperty('display', 'none', 'important');
    }
  }

  function postMessage(data) {
    _this.iframeEl.contentWindow.postMessage(data, chrome.extension.getURL(''));
  }

  function createTip() {
    var { tip, iframeEl } = _this;

    if (!tip) {
      tip = document.createElement('div');
      iframeEl = document.createElement('iframe');
      tip.className = 'previewer-tip';
      iframeEl.setAttribute('scrolling', 'no');
      iframeEl.setAttribute('frameborder', 0);
      tip.appendChild(iframeEl);
      document.body.appendChild(tip);
    }

    return { tip, iframeEl };
  }

  function getTipDimension(target) {
    if (!target) { return {}; }

    var marginLeft = 20;
    var marginTop = 5;
    var viewport = target.getBoundingClientRect();
    var offsetLeft = viewport.left;
    var offsetTop = viewport.top;
    var onLeftSide = !!(offsetLeft < window.innerWidth / 2);
    var tipTop = offsetTop - parseInt((_this.iframeHeight - target.offsetHeight) / 2) - marginTop;
    var maxTipTop = window.innerHeight - _this.iframeHeight - marginTop * 2;
    var tipLeft;

    if (onLeftSide) {
      tipLeft = offsetLeft + target.offsetWidth + marginLeft;
    } else {
      tipLeft = offsetLeft - _this.iframeWidth - marginLeft;
    }

    return {
      tipTop: Math.min(maxTipTop, tipTop) + window.scrollY,
      tipLeft: tipLeft + window.scrollX
    };
  }

  function removeGHoverCard() {
    document.body.querySelectorAll('.g-hovercard').forEach(function(el) {
      el.classList.remove('g-hovercard');
    });
  }

  function getBackgroundStyle(evt) {
    var target = evt.target;

    console.log('setTimeout:start', performance.now());
    var align = 'center';
    var src = target.src;
    if (src) {
      if (/s\d+-c-k/.test(src)) {
        if (!target.hasAttribute('data-magic')) {
          target.src = src = src.replace(/s\d+-c-k/, 's384-c-k');
        }
        _this.iframeWidth = _this.iframeHeight = 384;
      } else {
        if (/sz=[0-9]+/.test(src)) {
          if (!target.hasAttribute('data-magic')) {
            target.src = src = src.replace(/sz=[0-9]+/, 'sz=384');
          }
          _this.iframeWidth = _this.iframeHeight = 384;
        } else {
          if (/=s[0-9]+/.test(src)) {
            if (!target.hasAttribute('data-magic')) {
              target.src = src = src.replace(/=s[0-9]+/, '=s384');
            }
            _this.iframeWidth = _this.iframeHeight = 384;
          }
        }
      }
      if (/w=\d+/.test(src)) {
        src = src.replace(/w=\d+/, 'w=480').replace(/h=\d+/, '360');
        align = '-45px';
      } else if (/mqdefault|default/.test(src)) {
        src = src.replace(/mqdefault|default/, 'hqdefault');
        align = '-45px';
      }
    }

    return {
      align: align,
      src: src
    }
    console.log('setTimeout:end', performance.now());
  }

  function removeMouseoutEvent() {
    if (_this.tip) {
      _this.tip.style.setProperty('display', 'none', 'important');
    }
  }

  _this.showPanel = function(evt, videoId) {
    var { align, src } = getBackgroundStyle(evt);
    var { tipTop, tipLeft } = getTipDimension(evt.target);
    setVideoId(videoId);

    setStyles(_this.tip, {
      top: tipTop + 'px',
      left: tipLeft + 'px',
      height: _this.iframeHeight + 'px'
    }, true);

    setStyles(_this.iframeEl, {
      width: _this.iframeWidth + 'px',
      height: _this.iframeHeight + 'px',
      background: 'url(' + src + ') center ' + align + '/100% auto no-repeat',
      display: 'block'
    }, true);

    _this.tip.style.setProperty('display', 'block', 'important');

    removeGHoverCard();
  }

  _this.hidePanel = function() {
    removeMouseoutEvent();
    _this.iframeEl.src = '';
    postMessage({ message: 'stopVideo' });
  }

  initialize();

  return _this;

})(jQuery, window, window.document);
