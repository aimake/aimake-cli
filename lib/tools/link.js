'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (pluginsDir) {
  try {
    var pkg = require(_path2.default.join(rootDir, './package.json'));
    var pluginName = pkg.name;
    var match = /plugin-(\w*)/.exec(pluginName);
    execSync('npm link');
    execSync('npm link ' + pluginName, {
      cwd: _path2.default.join(pluginsDir)
    });
    console.log(_chalk2.default.green.bold('Soft link success, now you can execute ' + _chalk2.default.yellow.bold('`aimake ' + match[1] + '`') + ' to test command.'));
  } catch (e) {
    console.log(_chalk2.default.red.bold('Soft link failure.'));
    console.log(e);
  }
};

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var execSync = _child_process2.default.execSync;
var rootDir = process.cwd();