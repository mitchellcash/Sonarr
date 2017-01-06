import React, { PropTypes } from 'react';
import styles from './PageContent.css';

function PageContent(props) {
  const {
    className,
    children
  } = props;

  return (
    <div className={className}>
      {children}
    </div>
  );
}

PageContent.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired
};

PageContent.defaultProps = {
  className: styles.content
};

export default PageContent;
