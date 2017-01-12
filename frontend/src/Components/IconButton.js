import React, { PropTypes } from 'react';
import Link from './Link';
import Icon from './Icon';
import styles from './IconButton.css';

function IconButton(props) {
  const {
    className,
    name,
    size,
    ...otherProps
  } = props;

  return (
    <Link
      className={className}
      {...otherProps}
    >
      <Icon
        name={name}
        size={size}
      />
    </Link>
  );
}

IconButton.propTypes = {
  className: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  size: PropTypes.number
};

IconButton.defaultProps = {
  className: styles.button
};

export default IconButton;
