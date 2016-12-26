import React, { Component, PropTypes } from 'react';
import SpinnerIconButton from 'Components/SpinnerIconButton';
import styles from './MonitorToggleButton.css';

class MonitorToggleButton extends Component {

  //
  // Listeners

  onPress = () => {
    this.props.onPress(!this.props.monitored);
  }

  //
  // Render

  render() {
    const {
      className,
      monitored,
      isSaving
    } = this.props;

    const monitoredMessage = 'Monitored, click to unmonitor';
    const unmonitoredMessage = 'Unmonitored, click to monitor';
    const iconName = monitored ? 'icon-sonarr-monitored' : 'icon-sonarr-unmonitored';

    return (
      <SpinnerIconButton
        className={className}
        name={iconName}
        title={monitored ? monitoredMessage : unmonitoredMessage}
        isSpinning={isSaving}
        onPress={this.onPress}
      />
    );
  }
}

MonitorToggleButton.propTypes = {
  className: PropTypes.string.isRequired,
  monitored: PropTypes.bool.isRequired,
  isSaving: PropTypes.bool.isRequired,
  onPress: PropTypes.func.isRequired
};

MonitorToggleButton.defaultProps = {
  className: styles.toggleButton,
  isSaving: false
};

export default MonitorToggleButton;
