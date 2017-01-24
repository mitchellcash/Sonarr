import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { locationShape } from 'react-router';
import classNames from 'classnames';
import { icons } from 'Helpers/Props';
import Scroller from 'Components/Scroller';
import QueueStatusConnector from 'Activity/Queue/Status/QueueStatusConnector';
import HealthStatusConnector from 'System/Status/Health/HealthStatusConnector';
import MessagesConnector from './Messages/MessagesConnector';
import PageSidebarItem from './PageSidebarItem';
import styles from './PageSidebar.css';

const links = [
  {
    iconName: icons.SERIES_CONTINUING,
    title: 'Series',
    to: '/',
    alias: '/series',
    children: [
      {
        title: 'Add New',
        to: '/add/new'
      },
      {
        title: 'Import',
        to: '/add/import'
      },
      {
        title: 'Editor',
        to: '/serieseditor'
      },
      {
        title: 'Season Pass',
        to: '/seasonpass'
      }
    ]
  },

  {
    iconName: icons.CALENDAR,
    title: 'Calendar',
    to: '/calendar'
  },

  {
    iconName: icons.ACTIVITY,
    title: 'Activity',
    to: '/activity/history',
    children: [
      {
        title: 'Queue',
        to: '/activity/queue',
        statusComponent: QueueStatusConnector
      },
      {
        title: 'Blacklist',
        to: '/activity/blacklist'
      }
    ]
  },

  {
    iconName: icons.WARNING,
    title: 'Wanted',
    to: '/wanted/missing',
    children: [
      {
        title: 'Cutoff Unmet',
        to: '/wanted/cutoffunmet'
      }
    ]
  },

  {
    iconName: icons.SETTINGS,
    title: 'Settings',
    to: '/settings/ui',
    children: [
      {
        title: 'Media Management',
        to: '/settings/mediamanagement'
      },
      {
        title: 'Profiles',
        to: '/settings/profiles'
      },
      {
        title: 'Quality',
        to: '/settings/quality'
      },
      {
        title: 'Indexers',
        to: '/settings/indexers'
      },
      {
        title: 'Download Clients',
        to: '/settings/downloadclients'
      },
      {
        title: 'Connect',
        to: '/settings/connect'
      },
      {
        title: 'Metadata',
        to: '/settings/metadata'
      },
      {
        title: 'General',
        to: '/settings/general'
      }
    ]
  },

  {
    iconName: icons.SYSTEM,
    title: 'System',
    to: '/system/status',
    statusComponent: HealthStatusConnector,
    children: [
      {
        title: 'Tasks',
        to: '/system/tasks'
      },
      {
        title: 'Backup',
        to: '/system/backup'
      },
      {
        title: 'Updates',
        to: '/system/updates'
      },
      {
        title: 'Logs',
        to: '/system/logs'
      }
    ]
  }
];

function getActiveParent(location) {
  const urlBase = window.Sonarr.urlBase;
  const pathname = urlBase ? location.pathname.substr(urlBase.length) || '/' : location.pathname;
  let activeParent = null;

  links.forEach((link) => {
    if (link.to && link.to === pathname) {
      activeParent = link.to;

      return false;
    }

    const children = link.children;

    if (children) {
      children.forEach((childLink) => {
        if (pathname.startsWith(childLink.to)) {
          activeParent = link.to;

          return false;
        }
      });
    }

    if ((link.to !== '/' && pathname.startsWith(link.to)) || (link.alias && pathname.startsWith(link.alias))) {
      activeParent = link.to;
    }
  });

  return activeParent;
}

class PageSidebar extends Component {

  //
  // Render

  render() {
    const {
      location,
      isSidebarVisible
    } = this.props;

    const activeParent = getActiveParent(location);

    return (
      <div
        className={classNames(
          styles.sidebarContainer,
          !isSidebarVisible && styles.sidebarHidden
        )}
      >
        <Scroller className={styles.sidebar}>
          <div>
            {
              links.map((link) => {
                const childWithStatusComponent = _.find(link.children, (child) => {
                  return !!child.statusComponent;
                });

                const childStatusComponent = childWithStatusComponent ?
                  childWithStatusComponent.statusComponent :
                  null;

                const isActiveParent = activeParent === link.to;

                return (
                  <PageSidebarItem
                    key={link.to}
                    iconName={link.iconName}
                    title={link.title}
                    to={link.to}
                    statusComponent={isActiveParent || !childStatusComponent ? link.statusComponent : childStatusComponent}
                    isActiveParent={isActiveParent}
                  >
                    {
                      link.children && link.to === activeParent &&
                        link.children.map((child) => {
                          return (
                            <PageSidebarItem
                              key={child.to}
                              title={child.title}
                              to={child.to}
                              isChildItem={true}
                              statusComponent={child.statusComponent}
                            />
                          );
                        })
                    }
                  </PageSidebarItem>
                );
              })
            }
          </div>

          <MessagesConnector />
        </Scroller>
      </div>
    );
  }
}

PageSidebar.propTypes = {
  location: locationShape.isRequired,
  isSidebarVisible: PropTypes.bool.isRequired
};

export default PageSidebar;
