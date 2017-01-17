require('messenger');
var messenger = require('messenger');

module.exports = {
  show(options) {
    if (!options.type) {
      options.type = 'info';
    }

    if (options.hideAfter === undefined) {
      switch (options.type) {
        case 'info':
          options.hideAfter = 5;
          break;

        case 'success':
          options.hideAfter = 5;
          break;

        default:
          options.hideAfter = 5;
      }
    }

    options.hideOnNavigate = options.hideOnNavigate || false;

    return messenger().post({
      message: options.message,
      type: options.type,
      showCloseButton: true,
      hideAfter: options.hideAfter,
      id: options.id,
      actions: options.actions,
      hideOnNavigate: options.hideOnNavigate
    });
  },

  monitor(options) {
    if (!options.promise) {
      throw Error('promise is required');
    }

    if (!options.successMessage) {
      throw Error('success message is required');
    }

    if (!options.errorMessage) {
      throw Error('error message is required');
    }

    options.promise.done(() => {
      this.show({ message: options.successMessage });
    });

    options.promise.fail(() => {
      this.show({
        message: options.errorMessage,
        type: 'error'
      });
    });

    return options.promise;
  }
};
