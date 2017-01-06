import React, { Component, PropTypes } from 'react';
import { icons } from 'Helpers/Props';
import Menu from 'Components/Menu/Menu';
import ToolbarMenuButton from 'Components/Menu/ToolbarMenuButton';

class FilterMenu extends Component {

  //
  // Render

  render() {
    const {
      className,
      children
    } = this.props;

    return (
      <Menu className={className}>
        <ToolbarMenuButton
          iconName={icons.FILTER}
          text="Filter"
        />
          {children}
      </Menu>
    );
  }
}

FilterMenu.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired
};

export default FilterMenu;
