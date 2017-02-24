chrome.runtime.onInstalled.addListener(function(details){
  if(details.reason == 'install'){
    var version = chrome.runtime.getManifest().version;
    console.log('version: ', version);
    chrome.tabs.create({ url: 'options.html' });
  }
});