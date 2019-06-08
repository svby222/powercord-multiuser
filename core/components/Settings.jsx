const { getModuleByDisplayName, React } = require('powercord/webpack');
const { AsyncComponent, Button } = require('powercord/components');

const Input = AsyncComponent.from(getModuleByDisplayName('TextInput'));
const FormTitle = AsyncComponent.from(getModuleByDisplayName('FormTitle'));
const FormText = AsyncComponent.from(getModuleByDisplayName('FormText'));
const FormSection = AsyncComponent.from(getModuleByDisplayName('FormSection'));
const Flex = AsyncComponent.from(getModuleByDisplayName('Flex'));
const HoverRoll = AsyncComponent.from(getModuleByDisplayName('HoverRoll'));

module.exports = class Settings extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      users: this.props.getSetting('users', []),
      currentToken: null
    };
  }

  renderUserList () {
    return this.state.users.map((user) => (
      <div
        className="flexCenter-3_1bcw flex-1O1GKY justifyCenter-3D2jYp alignCenter-1dQNNs pc-flexCenter pc-flex pc-justifyCenter pc-alignCenter game-1ipmAa pc-game card-FDVird pc-card">
        <div
          className="gameNameLastPlayed-3LJo8n pc-gameNameLastPlayed vertical-V37hAW flex-1O1GKY directionColumn-35P_nr pc-vertical pc-flex pc-directionColumn">
          <input className="gameName-1RiWHm pc-gameName gameNameInput-385LoS pc-gameNameInput"
            type="text" maxLength="128"
            defaultValue={user.nickname || 'Untitled'}
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
    ));
  }

  render () {
    return (
      <div>
        <FormSection>
          <FormTitle>Users</FormTitle>

          {this.renderUserList()}
        </FormSection>

        <FormSection className="marginTop40-i-78cZ pc-marginTop40">
          <FormTitle>Add user</FormTitle>
          <Flex id="mu-settings-flex" style={{ justifyContent: 'space-between' }}>
            <Input id="mu-add-user-token" defaultValue={this.state.currentToken}
              onChange={this.updateCurrentToken.bind(this)}/>
            <Button onClick={this.addUser.bind(this)}>Add user</Button>
          </Flex>
          <FormText className="note-1V3kyJ pc-note description-3_Ncsb pc-description">
              The user's token.
          </FormText>
        </FormSection>

      </div>
    );
  }

  _set (key, value) {
    this.props.updateSetting(key, value);
    this.setState({ [key]: value });
  }

  addUser () {
    const token = this.state.currentToken;
    if (token) {
      this._set('users', this.state.users.concat([ {
        nickname: null,
        token
      } ]));
    }
  }

  removeUser (user) {
    const index = this.state.users.indexOf(user);
    if (index > 0) {
      this._set('users', this.state.users.filter(u => u !== user));
    }
  }

  modifyUser (user, adapter) {
    adapter(user);

    if (this.state.users.includes(user)) {
      this._set('users', this.state.users);
    }
  }

  updateCurrentToken (value) {
    this.state.currentToken = value;
  }
};
