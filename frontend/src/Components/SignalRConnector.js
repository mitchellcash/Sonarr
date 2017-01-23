import $ from 'jquery';
import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { updateCommand, finishCommand } from 'Store/Actions/commandActions';
import { setVersion } from 'Store/Actions/appActions';
require('signalR');

function getStatus(status) {
  switch (status) {
    case 0:
      return 'connecting';
    case 1:
      return 'connected';
    case 2:
      return 'reconnecting';
    case 4:
      return 'disconnected';
    default:
      throw new Error(`invalid status ${status}`);
  }
}

function createMapStateToProps() {
  return createSelector(
    () => {
      return {
      };
    }
  );
}

const mapDispatchToProps = {
  updateCommand,
  finishCommand,
  setVersion
};

class SignalRConnector extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this.tryingToReconnect = false;
    this.signalRconnection = null;
  }

  componentDidMount() {
    console.log('starting signalR');

    this.signalRconnection = $.connection('/signalr');

    this.signalRconnection.stateChanged(this.onStateChanged);
    this.signalRconnection.received(this.onReceived);
    this.signalRconnection.reconnecting(this.onReconnecting);
    this.signalRconnection.reconnected(this.onReconnected);
    this.signalRconnection.disconnected(this.onDisconnected);

    this.signalRconnection.start({ transport: ['longPolling'] });
  }

  componentWillUnmount() {
    this.signalRconnection.stop();
    this.signalRconnection = null;
  }

  //
  // Control

  handleMessage = (message) => {
    const {
      name,
      body
    } = message;

    if (name === 'command') {
      this.handleCommand(body);
      return;
    }

    if (name === 'version') {
      this.handleVersion(body);
      return;
    }
  }

  handleCommand = (body) => {
    const resource = body.resource;
    const state = resource.state;

    if (state === 'completed') {
      this.props.finishCommand(resource);
    } else {
      this.props.updateCommand(resource);
    }
  }

  handleVersion = (body) => {
    const version = body.version;

    this.props.setVersion({ version });
  }

  //
  // Listeners

  onStateChanged = (change) => {
    console.log(`SignalR: [${getStatus(change.newState)}]`);
  }

  onReceived = (message) => {
    console.debug('SignalR: received', message.name, message.body);

    this.handleMessage(message);
  }

  onReconnecting = () => {
    if (window.Sonarr.unloading) {
      return;
    }

    this.tryingToReconnect = true;
  }

  onReconnected = () => {
    this.tryingToReconnect = false;
  }

  onDisconnected = () => {
    if (this.tryingToReconnect) {
      console.log('signalR disconnected');

      // TODO: update store and set isDisconnected or (isConnected)
    }
  }

  //
  // Render

  render() {
    return null;
  }
}

SignalRConnector.propTypes = {
  updateCommand: PropTypes.func.isRequired,
  finishCommand: PropTypes.func.isRequired,
  setVersion: PropTypes.func.isRequired
};

export default connect(createMapStateToProps, mapDispatchToProps)(SignalRConnector);
