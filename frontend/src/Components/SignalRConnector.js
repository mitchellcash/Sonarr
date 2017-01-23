import $ from 'jquery';
import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { updateCommand, finishCommand } from 'Store/Actions/commandActions';
import { setAppValue, setVersion } from 'Store/Actions/appActions';
require('signalR');

function getState(status) {
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
    (state) => state.app.isReconnecting,
    (isReconnecting) => {
      return {
        isReconnecting
      };
    }
  );
}

const mapDispatchToProps = {
  updateCommand,
  finishCommand,
  setAppValue,
  setVersion
};

class SignalRConnector extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this.signalRconnectionOptions = { transport: ['longPolling'] };
    this.signalRconnection = null;
    this.retryInterval = 5;
    this.retryTimeoutId = null;
  }

  componentDidMount() {
    console.log('starting signalR');

    this.signalRconnection = $.connection('/signalr');

    this.signalRconnection.stateChanged(this.onStateChanged);
    this.signalRconnection.received(this.onReceived);
    this.signalRconnection.reconnecting(this.onReconnecting);
    this.signalRconnection.disconnected(this.onDisconnected);

    this.signalRconnection.start(this.signalRconnectionOptions);
  }

  componentWillUnmount() {
    this.signalRconnection.stop();
    this.signalRconnection = null;
  }

  //
  // Control

  retryConnection = () => {
    this.retryTimeoutId = setTimeout(() => {
      this.signalRconnection.start(this.signalRconnectionOptions);
      this.retryInterval = Math.min(this.retryInterval + 5, 30);
    }, this.retryInterval * 1000);
  }

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
    const state = getState(change.newState);
    console.log(`SignalR: [${state}]`);

    if (state === 'connected') {
      this.props.setAppValue({
        isConnected: true,
        isReconnecting: false,
        isDisconnected: false
      });

      this.retryInterval = 5;

      if (this.retryTimeoutId) {
        clearTimeout(this.retryTimeoutId);
      }
    }
  }

  onReceived = (message) => {
    console.debug('SignalR: received', message.name, message.body);

    this.handleMessage(message);
  }

  onReconnecting = () => {
    if (window.Sonarr.unloading) {
      return;
    }

    this.props.setAppValue({
      isReconnecting: true
    });
  }

  onDisconnected = () => {
    if (this.props.isReconnecting) {
      this.props.setAppValue({
        isConnected: false,
        isReconnecting: true,
        isDisconnected: true
      });

      this.retryConnection();
    }
  }

  //
  // Render

  render() {
    return null;
  }
}

SignalRConnector.propTypes = {
  isReconnecting: PropTypes.bool.isRequired,
  updateCommand: PropTypes.func.isRequired,
  finishCommand: PropTypes.func.isRequired,
  setAppValue: PropTypes.func.isRequired,
  setVersion: PropTypes.func.isRequired
};

export default connect(createMapStateToProps, mapDispatchToProps)(SignalRConnector);
