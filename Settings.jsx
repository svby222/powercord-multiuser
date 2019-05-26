const {getModuleByDisplayName, React} = require('powercord/webpack');
const {Category, SwitchItem} = require('powercord/components/settings');
const {Button, AsyncComponent} = require('powercord/components');
const Input = AsyncComponent.from(getModuleByDisplayName('TextInput'));
const FormTitle = AsyncComponent.from(getModuleByDisplayName('FormTitle'));
const FormText = AsyncComponent.from(getModuleByDisplayName('FormText'));
const FormSection = AsyncComponent.from(getModuleByDisplayName('FormSection'));
const Flex = AsyncComponent.from(getModuleByDisplayName('Flex'));

const Game = AsyncComponent.from(getModuleByDisplayName('Game'));
const HoverRoll = AsyncComponent.from(getModuleByDisplayName('HoverRoll'));

module.exports = class Settings extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            users: this.props.getSetting('users', []),
            currentToken: null
        };
    }

    renderUserList() {
        /*
        <div
                    className="flexCenter-3_1bcw flex-1O1GKY justifyCenter-3D2jYp alignCenter-1dQNNs pc-flexCenter pc-flex pc-justifyCenter pc-alignCenter noWrap-3jynv6 pc-noWrap justifyBetween-2tTqYu pc-justifyBetween">
                    <div tabIndex="0" aria-label="Toggle overlay"
                         className="overlayToggleIcon-2liB3r pc-overlayToggleIcon" role="button">
                        <svg name="OverlayOff" className="overlayToggleIconOff-1kT42w pc-overlayToggleIconOff"
                             width="24" height="24" viewBox="0 0 24 24">
                            <g fill="none" fill-rule="evenodd">
                                <path d="M0 0h24v24H0"></path>
                                <path className="fill-1ugeBG pc-fill" fill="currentColor"
                                      d="M18.27 18l3.43 3.43-1.27 1.27-4.7-4.7H14v2h2v2H8v-2h2v-2H4c-1.1 0-2-.9-2-2V6c0-.48163917.17254435-.92493514.45887255-1.27112745L1 3.27 2.27 2l2 2h.46l2 2h-.46l10 10h.46l2 2h-.46zM4 6.27V16h9.73L4 6.27zm17.5411274 11.0011274L20 15.73V6h-9.73l-2-2H20c1.1 0 2 .9 2 2v10c0 .4816392-.1725443.9249351-.4588726 1.2711274z"></path>
                            </g>
                        </svg>
                    </div>

                    <div tabIndex="0" aria-label="Toggle overlay"
                         className="overlayToggleIcon-2liB3r pc-overlayToggleIcon" role="button">
                        <svg name="OverlayOff" className="overlayToggleIconOff-1kT42w pc-overlayToggleIconOff"
                             width="24" height="24" viewBox="0 0 24 24">
                            <g fill="none" fill-rule="evenodd">
                                <path d="M0 0h24v24H0"></path>
                                <path className="fill-1ugeBG pc-fill" fill="currentColor"
                                      d="M18.27 18l3.43 3.43-1.27 1.27-4.7-4.7H14v2h2v2H8v-2h2v-2H4c-1.1 0-2-.9-2-2V6c0-.48163917.17254435-.92493514.45887255-1.27112745L1 3.27 2.27 2l2 2h.46l2 2h-.46l10 10h.46l2 2h-.46zM4 6.27V16h9.73L4 6.27zm17.5411274 11.0011274L20 15.73V6h-9.73l-2-2H20c1.1 0 2 .9 2 2v10c0 .4816392-.1725443.9249351-.4588726 1.2711274z"></path>
                            </g>
                        </svg>
                    </div>
                </div>
         */

        return this.state.users.map((user) => {
            return <div
                className="flexCenter-3_1bcw flex-1O1GKY justifyCenter-3D2jYp alignCenter-1dQNNs pc-flexCenter pc-flex pc-justifyCenter pc-alignCenter game-1ipmAa pc-game card-FDVird pc-card">
                <div
                    className="gameNameLastPlayed-3LJo8n pc-gameNameLastPlayed vertical-V37hAW flex-1O1GKY directionColumn-35P_nr pc-vertical pc-flex pc-directionColumn">
                    <input className="gameName-1RiWHm pc-gameName gameNameInput-385LoS pc-gameNameInput"
                           type="text" maxLength="128"
                           defaultValue={user.nickname || "Untitled"}
                           onChange={(e) => this.modifyUser(user, (user) => user.nickname = e.target.value)}/>
                    <div className="lastPlayed-3bQ7Bo pc-lastPlayed">
                        <HoverRoll hoverText={user.token}>Hover to reveal token</HoverRoll>
                    </div>
                </div>
                <div tabIndex="0"
                     className="button-mM-y8i pc-button removeGame-2JFGPn pc-removeGame"
                     role="button"
                     onClick={() => this.removeUser(user)}>
                    Remove user
                </div>
            </div>
        });
    }

    render() {
        return (
            <div>
                <FormSection>
                    <FormTitle>Users</FormTitle>

                    {this.renderUserList()}
                </FormSection>

                <FormSection className="marginTop40-i-78cZ pc-marginTop40">
                    <FormTitle>Add user</FormTitle>
                    <Flex id="mu-settings-flex" style={{justifyContent: "space-between"}}>
                        <Input id="mu-add-user-token"
                               value={this.state.currentToken}
                               onChange={this.updateCurrentToken.bind(this)}/>
                        <Button onClick={this.addUser.bind(this)}>Add user</Button>
                    </Flex>
                    <FormText className="note-1V3kyJ pc-note description-3_Ncsb pc-description">
                        The user's token.
                    </FormText>
                </FormSection>

            </div>
        )
    }

    _set(key, value) {
        this.props.updateSetting(key, value);
        this.setState({[key]: value});
    }

    addUser() {
        const token = this.state.currentToken;
        if (!token) return;

        console.log(this.state.users);
        this._set('users', this.state.users.concat([{
            nickname: null,
            token: token
        }]));
    }

    removeUser(user) {
        const index = this.state.users.indexOf(user);
        if (index < 0) return;

        console.log(`removing ${user}`);
        this._set('users', this.state.users.filter(u => u !== user));
    }

    modifyUser(user, adapter) {
        adapter(user);

        console.log(this.state.users);
        if (this.state.users.includes(user)) this._set('users', this.state.users);
    }

    updateCurrentToken(value) {
        this.state.currentToken = value;
    }

};
