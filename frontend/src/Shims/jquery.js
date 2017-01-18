var jquery = require('JsLibraries/jquery');
require('../Instrumentation/StringFormat');
var ajax = require('jQuery/jquery.ajax');

ajax(jquery);

window.$ = jquery;
window.jQuery = jquery;
module.exports = jquery;
