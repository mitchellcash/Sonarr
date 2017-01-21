import React, { PropTypes } from 'react';
import * as icons from 'Helpers/Props/icons';
import { kinds } from 'Helpers/Props';
import classNames from 'classnames';
import styles from './Icon.css';

function Icon(props) {
  const {
    className,
    name,
    kind,
    size,
    title
  } = props;

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

Icon.propTypes = {
  className: PropTypes.string,
  name: PropTypes.oneOf(Object.values(icons)).isRequired,
  kind: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  title: PropTypes.string
};

Icon.defaultProps = {
  kind: kinds.DEFAULT,
  size: 14
};

export default Icon;
