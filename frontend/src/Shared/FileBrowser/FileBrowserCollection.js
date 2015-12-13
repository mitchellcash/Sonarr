var _ = require('underscore');
var Backbone = require('backbone');
var FileBrowserModel = require('./FileBrowserModel');

module.exports = Backbone.Collection.extend({
  model: FileBrowserModel,
  url: window.Sonarr.ApiRoot + '/filesystem',

  parse: function(response) {
    var contents = [];
    if (response.parent || response.parent === '') {
      var type = 'parent';
      var name = '...';
      if (response.parent === '') {
        type = 'computer';
        name = 'My Computer';
      }
      contents.push({
        type: type,
        name: name,
        path: response.parent
      });
    }

    return _.union(contents, response.directories, response.files);
  }
});
