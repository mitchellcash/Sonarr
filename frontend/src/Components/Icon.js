import React, { Component, PropTypes } from 'react';
import { icons, kinds } from 'Helpers/Props';
import classNames from 'classNames';
import styles from './Icon.css';

class Icon extends Component {

  //
  // Render

  render() {
    const {
      className,
      name,
      kind,
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
  title: PropTypes.string
};

Icon.defaultProps = {
  kind: kinds.DEFAULT
};

export default Icon;
