const { remote } = require('electron');
const { remote: { BrowserWindow } } = require('electron');
const { resolve } = require('path');

const { Plugin } = require('powercord/entities');
const { contextMenu, getModule, getModuleByDisplayName, React } = require('powercord/webpack');
const { forceUpdateElement, getOwnerInstance, waitFor } = require('powercord/util');
const { inject, uninject } = require('powercord/injector');
const { ContextMenu } = require('powercord/components');

const Settings = require('./core/components/Settings');

module.exports = class Mu extends Plugin {
  startPlugin () {
    this.loadCSS(resolve(__dirname, 'core/styles/style.scss'));
    this.injectContextMenu();
    this.registerSettings('mu', 'Mu', (props) => React.createElement(Settings, {
      ...props,
      saveHandler: this.handleSave.bind(this)
    }));
  }

  pluginWillUnload () {
    uninject('pc-mu-avatar');
    forceUpdateElement('.inner-1W0Bkn');
  }

  handleSave () {
    // this is left empty on purpose
  }

  async injectContextMenu () {
    const currentUserId = (await getModule([ 'getId' ])).getId();
    const Avatar = (await getModuleByDisplayName('FluxContainer(Avatar)'));

    inject('pc-mu-avatar', Avatar.prototype, 'render', (_, res) => {
      if (res.props.user.id === currentUserId && res.props.size === 'small') {
        res.props.onContextMenu = (e) => {
          const { pageX, pageY } = e;
          const users = this.settings.get('users', []);

          contextMenu.openContextMenu(e, () =>
            React.createElement(ContextMenu, {
              pageX,
              pageY,
              itemGroups: [
                users.map(u => ({
                  type: 'button',
                  name: `Open ${u.nickname || 'Untitled'}`,
                  onClick: () => this.createNewInstance(u.token)
                }))
              ]
            })
          );
        };
      }

      return res;
    });

    getOwnerInstance(await waitFor('.inner-1W0Bkn')).forceUpdate();
  }

  createNewInstance (token) {
    const route = `https:${GLOBAL_ENV.WEBAPP_ENDPOINT}/channels/@me`;
    const opts = {
      ...BrowserWindow.getFocusedWindow().webContents.browserWindowOptions,
      token
    };

    delete opts.show;
    delete opts.x;
    delete opts.y;

    opts.webPreferences.preload = `${__dirname}/core/preload.js`;

    const window = new BrowserWindow(opts);
    window.webContents.once('did-finish-load', () => {
      remote.getCurrentWindow().webContents.executeJavaScript('localStorage.removeItem("token")');
      window.webContents.executeJavaScript('localStorage.removeItem("token")');
    });

    window.on('close', () => window.destroy());
    window.loadURL(route);
  }
};
