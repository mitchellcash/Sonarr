import React, { Component, PropTypes } from 'react';
import { icons, kinds } from 'Helpers/Props';
import classNames from 'classnames';
import styles from './Icon.css';

class Icon extends Component {

  //
  // Render

  render() {
    const {
      className,
      name,
      kind,
      size,
      title
    } = this.props;

    return (
      <icon
        className={classNames(
          name,
          className,
          styles[kind]
        )}
        title={title}
        style={{
          fontSize: `${size}px`
        }}
      >
      </icon>
    );
  }

}

Icon.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  // name: PropTypes.oneOf(icons.ALL).isRequired,
  kind: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  title: PropTypes.string
};

Icon.defaultProps = {
  kind: kinds.DEFAULT,
  size: 14
};

export default Icon;
