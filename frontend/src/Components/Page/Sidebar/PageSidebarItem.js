import React, { PropTypes } from 'react';
import classNames from 'classNames';
import { map } from 'Helpers/elementChildren';
import Icon from 'Components/Icon';
import Link from 'Components/Link';
import styles from './PageSidebarItem.css';

function PageSidebarItem(props) {
  const {
    iconName,
    title,
    to,
    activeParent,
    isChildItem,
    children
  } = props;

  return (
    <div
      className={classNames(
        styles.item,
        activeParent === to && styles.isActiveItem
      )}
    >
      <Link
        className={classNames(
          isChildItem ? styles.childLink : styles.link,
          activeParent === to && styles.isActiveParentLink
        )}
        activeClassName={styles.isActiveLink}
        onlyActiveOnIndex={!isChildItem}
        to={to}
      >
        {
          !!iconName &&
            <span className={styles.iconContainer}>
              <Icon
                name={iconName}
              />
            </span>
        }

        <span className={isChildItem && styles.noIcon}>
          {title}
        </span>
      </Link>

      {
        children &&
          map(children, (child) => {
            return React.cloneElement(child, { isChildItem: true });
          })
      }
    </div>
  );
}

PageSidebarItem.propTypes = {
  iconName: PropTypes.string,
  title: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  activeParent: PropTypes.string,
  isChildItem: PropTypes.bool.isRequired,
  children: PropTypes.node
};

PageSidebarItem.defaultProps = {
  isChildItem: false
};

export default PageSidebarItem;
