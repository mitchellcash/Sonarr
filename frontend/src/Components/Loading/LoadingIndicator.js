import React, { Component, PropTypes } from 'react';
import styles from './LoadingIndicator.css';

class LoadingIndicator extends Component {

  //
  // Render

  render() {
    const {
      className,
      size
    } = this.props;

    const sizeInPx = `${size}px`;
    const width = sizeInPx;
    const height = sizeInPx;

    return (
      <div
        className={className}
        style={{ height }}
      >
        <div
          className={styles.rippleContainer}
          style={{ width, height }}
        >
          <div
            className={styles.ripple}
            style={{ width, height }}
          ></div>

          <div
            className={styles.ripple}
            style={{ width, height }}
          ></div>

          <div
            className={styles.ripple}
            style={{ width, height }}
          ></div>
        </div>
      </div>
    );
  }

}

LoadingIndicator.propTypes = {
  className: PropTypes.string,
  size: PropTypes.number
};

LoadingIndicator.defaultProps = {
  className: styles.loading,
  size: 50
};

export default LoadingIndicator;
