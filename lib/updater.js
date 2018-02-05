'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _packageJson = require('package-json');

var _packageJson2 = _interopRequireDefault(_packageJson);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _semver = require('semver');

var _semver2 = _interopRequireDefault(_semver);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 版本检查信息记录文件
var configRoot = _path2.default.join(_os2.default.homedir(), '.aimake');
var versionsPath = _path2.default.join(configRoot, 'latest-versions.json');

function showTip(plugin, currentVersion, remoteVersion) {
  if (plugin === 'aimake-cli') {
    console.log(_chalk2.default.yellow('\n  Update available: ' + plugin + '@' + remoteVersion + ' (Current: ' + currentVersion + ') \n     \n  Run  `npm install aimake-cli -g `  to update.\n'));
  } else {
    console.log(_chalk2.default.yellow('\n  Update available: ' + plugin + '@' + remoteVersion + ' (Current: ' + currentVersion + ') \n     \n  Run  `aimake install ' + plugin + ' `  to update.\n'));
  }
}

exports.default = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(plugin, pluginPackagePath) {
    var pkg, versions, remotePkg;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(!plugin || !pluginPackagePath[plugin])) {
              _context.next = 4;
              break;
            }

            _promise2.default.resolve(true);
            _context.next = 28;
            break;

          case 4:
            pkg = require(pluginPackagePath[plugin]);
            versions = void 0;
            // 获取版本检查信息

            try {
              versions = JSON.parse(_fs2.default.readFileSync(versionsPath, 'utf-8'));
            } catch (e) {
              versions = {};
            }

            if (!(!versions[plugin] || Date.now() - versions[plugin].update > 7 * 3600000 * 24)) {
              _context.next = 27;
              break;
            }

            _context.prev = 8;
            _context.next = 11;
            return (0, _packageJson2.default)(pkg.name);

          case 11:
            remotePkg = _context.sent;

            if (!versions[plugin]) {
              versions[plugin] = {};
            }
            if (_semver2.default.lt(pkg.version, remotePkg.version)) {
              showTip(plugin, pkg.version, remotePkg.version);
            }
            versions[plugin].version = remotePkg.version;
            versions[plugin].update = Date.now();
            _fs2.default.writeFileSync(versionsPath, (0, _stringify2.default)(versions));
            _context.next = 25;
            break;

          case 19:
            _context.prev = 19;
            _context.t0 = _context['catch'](8);

            // 版本检查出现错误 默认版本0.0.0
            versions[plugin] = {};
            versions[plugin].version = '0.0.0';
            versions[plugin].update = Date.now();
            _fs2.default.writeFileSync(versionsPath, (0, _stringify2.default)(versions));

          case 25:
            _context.next = 28;
            break;

          case 27:
            if (versions[plugin]) {
              // 本地记录检查
              if (_semver2.default.lt(pkg.version, versions[plugin].version)) {
                showTip(plugin, pkg.version, versions[plugin].version);
              }
            }

          case 28:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[8, 19]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();