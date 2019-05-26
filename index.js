const {remote} = require('electron');
const {contextMenu, getModule, getModuleByDisplayName, React} = require('powercord/webpack');
const {remote: {BrowserWindow}} = require('electron');
const {ContextMenu} = require('powercord/components');
const {ipcMain} = require('electron');

const {resolve} = require('path');
const {getOwnerInstance, waitFor} = require('powercord/util');
const {Plugin} = require('powercord/entities');
const {Tooltip} = require('powercord/components');
const {inject, uninject} = require('powercord/injector');
const {constants: {Routes}} = require('powercord/webpack');

const Settings = require('./Settings');

module.exports = class Mu extends Plugin {
    async startPlugin() {
        this.loadCSS(resolve(__dirname, 'style.scss'));
        await this.injectContextMenu();

        this.registerSettings(
            'mu',
            'Mu',
            (props) => React.createElement(Settings, {...props, saveHandler: this.handleSave.bind(this)})
        )

    }

    handleSave() {
    }

    pluginWillUnload() {
        uninject('pc-mu-avatar');
    }

    async injectContextMenu() {
        // TODO fix this, it also targets users in the friend list
        const avatarClasses = (await getModule(['inner', 'animate']));
        const avatar = await waitFor(`.${avatarClasses.inner.replace(/ /g, '.')}`);

        const instance = getOwnerInstance(avatar);

        inject('pc-mu-avatar', instance.__proto__, 'render', (_, res) => {
            res.props.onContextMenu = (e) => {
                const users = this.settings.get('users');

                const {pageX, pageY} = e;
                contextMenu.openContextMenu(e, () =>
                    React.createElement(ContextMenu, {
                        pageX, pageY,
                        itemGroups: [
                            users.map(u => {
                                return {
                                    type: 'button',
                                    name: `Open ${u.nickname || "Untitled"}`,
                                    onClick: () => this.createNewInstance(u.token)
                                };
                            })
                        ]
                    })
                );
            };

            return res;
        });

        instance.forceUpdate();
    }

    createNewInstance(token) {
        const route = `https:${GLOBAL_ENV.WEBAPP_ENDPOINT}/channels/@me`;

        const opts = {
            ...BrowserWindow.getFocusedWindow().webContents.browserWindowOptions,
            token: token
        };
        delete opts.show;
        delete opts.x;
        delete opts.y;

        opts.webPreferences.preload = `${__dirname}/preload.js`;
        console.log(opts);

        const window = new BrowserWindow(opts);

        window.webContents.once('did-finish-load', () => {
            remote.getCurrentWindow().webContents.executeJavaScript(`localStorage.removeItem("token")`);
            window.webContents.executeJavaScript(`localStorage.removeItem("token")`);
        });

        window.on('close', () => window.destroy());
        window.loadURL(route);
    }
};
