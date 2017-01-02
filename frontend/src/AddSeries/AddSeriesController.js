var NzbDroneController = require('Shared/NzbDroneController');
var AddNewSeriesLayout = require('./AddNewSeries/AddNewSeriesLayout');
var ImportSeriesSelectFolderLayout = require('./ImportSeries/SelectFolder/ImportSeriesSelectFolderLayout');
var ImportSeriesLayout = require('./ImportSeries/Import/ImportSeriesLayout');

const AddSeriesController = NzbDroneController.extend({
  initialize() {
    this.route('add/new', this.addSeries);
    this.route('add/import', this.importSeries);
    this.route('add/import/:query*', this.importFolder);

    NzbDroneController.prototype.initialize.apply(this, arguments);
  },

  addSeries() {
    this.setTitle('Add New Series');
    this.showMainRegion(new AddNewSeriesLayout());
  },

  importSeries() {
    this.setTitle('Import Series');
    this.showMainRegion(new ImportSeriesSelectFolderLayout());
  },

  importFolder(id) {
    this.setTitle('Import Series');
    this.showMainRegion(new ImportSeriesLayout({ rootFolderId: parseInt(id) }));
  }
});

module.exports = AddSeriesController;
