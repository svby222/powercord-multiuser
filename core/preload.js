const { remote } = require('electron');
const oldAdd = document.addEventListener;

document.addEventListener = function (type, listener) {
  if (type === 'beforeunload') {
    // do nothing
  } else {
    const args = [];
    args[0] = type;
    args[1] = listener;

    oldAdd.apply(this, args);
  }
};

const { localStorage } = window;
const oldSet = localStorage.setItem;
const blocked = [ 'token', 'test' ];

localStorage.setItem = function (key, value) {
  if (!blocked.includes(key)) {
    console.log(`(allowed) client attempted to set ${key} to ${value}`);
    oldSet.call(localStorage, key, value);
  } else {
    console.log(`(blocked) client attempted to set ${key} to ${value}`);
  }
};

const { token } = remote.BrowserWindow.getFocusedWindow().webContents.browserWindowOptions;
if (!token) {
  alert('Somehow, no token was provided.');
  window.close();
} else {
  oldSet.call(localStorage, 'token', `"${token}"`);
  require('../../../../preload.js');
}
