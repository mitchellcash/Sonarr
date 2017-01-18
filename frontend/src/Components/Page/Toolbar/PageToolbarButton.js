import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { icons } from 'Helpers/Props';
import Link from 'Components/Link';
import Icon from 'Components/Icon';
import styles from './PageToolbarButton.css';

class PageToolbarButton extends Component {

  //
  // Render

  render() {
    const {
      iconName,
      animateIconName,
      animate,
      isDisabled,
      onPress,
      ...otherProps
    } = this.props;

    const icon = animate && !!animateIconName ? animateIconName : iconName;

    return (
      <Link
        className={classNames(
          styles.toolbarButton,
          isDisabled && styles.isDisabled
        )}
        isDisabled={isDisabled}
        onPress={onPress}
        {...otherProps}
      >
        <Icon
          className={styles.icon}
          name={classNames(
            icon,
            animate && 'fa-spin'
          )}
          size={22}
        />
      </Link>
    );
  }

}

PageToolbarButton.propTypes = {
  iconName: PropTypes.string.isRequired,
  animateIconName: PropTypes.string,
  animate: PropTypes.bool,
  isDisabled: PropTypes.bool,
  onPress: PropTypes.func.isRequired
};

PageToolbarButton.defaultProps = {
  animateIconName: icons.SPINNER,
  animate: false
};

export default PageToolbarButton;
