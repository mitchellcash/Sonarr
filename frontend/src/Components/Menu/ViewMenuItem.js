import React, { Component, PropTypes } from 'react';
import SelectedMenuItem from './SelectedMenuItem';

class ViewMenuItem extends Component {

  //
  // Listeners

  onPress = () => {
    const {
      name,
      onPress
    } = this.props;

    onPress(name);
  }

  //
  // Render

  render() {
    const {
      name,
      selectedView,
      ...otherProps
    } = this.props;

    const isSelected = name === selectedView;

    return (
      <SelectedMenuItem
        isSelected={isSelected}
        {...otherProps}
        onPress={this.onPress}
      />
    );
  }
}

ViewMenuItem.propTypes = {
  name: PropTypes.string,
  selectedView: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired
};

export default ViewMenuItem;
