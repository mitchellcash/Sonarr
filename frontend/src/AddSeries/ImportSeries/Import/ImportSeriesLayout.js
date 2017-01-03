const Marionette = require('marionette');
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import appStore from 'Store/appStore';
import ImportSeriesConnector from './ImportSeriesConnector';
import tpl from './ImportSeriesLayout.hbs';

module.exports = Marionette.LayoutView.extend({
  template: tpl,

  initialize({ rootFolderId }) {
    this.rootFolderId = rootFolderId;
  },

  mountReact() {
    ReactDOM.render(
      <Provider store={appStore}>
        <ImportSeriesConnector
          rootFolderId={this.rootFolderId}
        />
      </Provider>,
      this.el
    );
  },

  unmountReact() {
    if (this.isRendered) {
      ReactDOM.unmountComponentAtNode(this.el);
    }
  },

  onBeforeRender() {
    this.unmountReact();
  },

  onRender() {
    this.mountReact();
  },

  onDestroy() {
    this.unmountReact();
  }
});
