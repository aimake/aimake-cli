'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var installCorePlugin = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(command) {
    var config;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            config = {
              root: process.cwd(),
              pkgs: [{ name: 'aimake-plugin-' + command, version: 'latest' }],
              targetDir: pluginsDir,
              registry: 'http://registry.npmjs.com'
            };

            console.log(_chalk2.default.green('\u5F00\u59CB\u9996\u6B21\u5B89\u88C5 ' + _chalk2.default.yellow.bold(command) + ' \u6A21\u5757'));
            _context.prev = 2;
            _context.next = 5;
            return (0, _npminstall2.default)(config);

          case 5:
            _context.next = 11;
            break;

          case 7:
            _context.prev = 7;
            _context.t0 = _context['catch'](2);

            console.log(_chalk2.default.red('安装模块失败，请联系@心伦'));
            process.exit();

          case 11:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[2, 7]]);
  }));

  return function installCorePlugin(_x) {
    return _ref.apply(this, arguments);
  };
}();

var prepare = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(command) {
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            return _context2.abrupt('return', _resolve2.default.sync('aimake-plugin-' + command, {
              paths: moduleDirs
            }));

          case 4:
            _context2.prev = 4;
            _context2.t0 = _context2['catch'](0);

            if (!ifCoreCommand(command)) {
              _context2.next = 10;
              break;
            }

            _context2.next = 9;
            return installCorePlugin(command);

          case 9:
            return _context2.abrupt('return', _resolve2.default.sync('aimake-plugin-' + command, {
              paths: moduleDirs
            }));

          case 10:
            // 提示安装插件
            console.log('');
            console.log('  ' + _chalk2.default.green.bold(command) + ' command is not installed.');
            console.log('  You can try to install it by ' + _chalk2.default.blue.bold('aimake install ' + command) + '.');
            console.log('');

          case 14:
            return _context2.abrupt('return', null);

          case 15:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[0, 4]]);
  }));

  return function prepare(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

var run = function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(command, pluginPath) {
    var pluginDef, plugin;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if (pluginPath) {
              _context3.next = 2;
              break;
            }

            return _context3.abrupt('return');

          case 2:
            _context3.next = 4;
            return (0, _updater2.default)(command, pluginPackagePath);

          case 4:
            pluginDef = require(pluginPath);
            plugin = _commander2.default.command(pluginDef.command || command);

            if (pluginDef.options) {
              // 添加命令的选项参数并进行解释
              pluginDef.options.forEach(function (option) {
                plugin.option(option[0], option[1]);
              });
            }
            // 命令执行后的回调
            plugin.action(function (_cmd, _opts) {
              // 获取命令参数和选项
              // 有参数命令 aimake install [name]
              // 无参数命令 aimake dev
              var cmd = _cmd;
              var opts = _opts;
              if (cmd instanceof _commander2.default.Command) {
                opts = cmd;
                cmd = undefined;
              }
              opts = opts || {};
              // 执行命令
              pluginDef.run(cmd, opts);
            });
            _commander2.default.parse(argvs);

          case 9:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function run(_x3, _x4) {
    return _ref3.apply(this, arguments);
  };
}();

var main = function () {
  var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
    var command, pluginPath;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            // 检查Node版本
            if (!_semver2.default.satisfies(process.version, _package2.default.engines.node)) {
              console.log(_chalk2.default.red.bold('Require nodejs version ' + _package2.default.engines.node + ', current ' + process.version));
              console.log('Download the latest nodejs here ' + _chalk2.default.green('https://nodejs.org/en/download/'));
              process.exit();
            }

            // 保证目录、文件存在
            ensureAiMakeFile();

            // 检查 aimake-cli 版本更新
            _context4.next = 4;
            return (0, _updater2.default)('aimake-cli', pluginPackagePath);

          case 4:
            command = argvs[2];

            // 软连接插件

            if (!(command === 'link')) {
              _context4.next = 15;
              break;
            }

            _context4.prev = 6;
            _context4.next = 9;
            return (0, _link2.default)(pluginsDir);

          case 9:
            process.exit(0);
            _context4.next = 15;
            break;

          case 12:
            _context4.prev = 12;
            _context4.t0 = _context4['catch'](6);

            error(_context4.t0);

          case 15:

            // 注册核心命令
            registerCoreCommand();
            // 注册插件
            registerPlugin();
            // 解析命令行参数
            _commander2.default.parse(process.argv);

            // 输出帮助信息
            if (!command) {
              _commander2.default.outputHelp();
              process.exit(0);
            }

            // 其他命令
            _context4.prev = 19;
            _context4.next = 22;
            return prepare(command);

          case 22:
            pluginPath = _context4.sent;
            _context4.next = 25;
            return run(command, pluginPath);

          case 25:
            _context4.next = 30;
            break;

          case 27:
            _context4.prev = 27;
            _context4.t1 = _context4['catch'](19);

            error(_context4.t1);

          case 30:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this, [[6, 12], [19, 27]]);
  }));

  return function main() {
    return _ref4.apply(this, arguments);
  };
}();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _semver = require('semver');

var _semver2 = _interopRequireDefault(_semver);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _resolve = require('resolve');

var _resolve2 = _interopRequireDefault(_resolve);

var _npminstall = require('npminstall');

var _npminstall2 = _interopRequireDefault(_npminstall);

var _updater = require('./updater');

var _updater2 = _interopRequireDefault(_updater);

var _link = require('./link');

var _link2 = _interopRequireDefault(_link);

var _command = require('./command');

var _command2 = _interopRequireDefault(_command);

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_commander2.default.version(_package2.default.version).usage('<command> [options]');

var argvs = process.argv;

// 核心命令
var coreCommand = ['init', 'dev', 'add', 'build', 'push', 'publish', 'install', 'plugin', 'sync'];

// 插件存放目录
var pluginsDir = _path2.default.join(__dirname, '..');

var moduleDirs = [_path2.default.join(pluginsDir, 'node_modules')];
// 插件 package.json 路径
var pluginPackagePath = {
  'aimake-cli': _path2.default.resolve(__dirname, '../package.json')
};

function ensureAiMakeFile() {
  var rootDir = _path2.default.join(_os2.default.homedir(), '.aimake');
  _fsExtra2.default.ensureDirSync(rootDir);
  _fsExtra2.default.ensureDirSync(_path2.default.join(rootDir, 'plugins'));
  _fsExtra2.default.ensureDirSync(_path2.default.join(rootDir, 'plugins/node_modules'));
  _fsExtra2.default.ensureFileSync(_path2.default.join(rootDir, 'latest-versions.json'));
  _fsExtra2.default.ensureDirSync(moduleDirs[0]);
}

function registerCoreCommand() {
  for (var i = 0, len = _command2.default.length; i < len; i += 1) {
    _commander2.default.command(_command2.default[i].name).description(_command2.default[i].description);
  }
}

function ifCoreCommand(command) {
  for (var i = 0, len = coreCommand.length; i < len; i += 1) {
    if (command === coreCommand[i]) {
      return true;
    }
  }
  return false;
}

function registerPlugin() {
  var plugins = void 0;
  var pluginPool = {};
  moduleDirs.forEach(function (modulesDir) {
    // 扫描插件
    plugins = _fs2.default.readdirSync(modulesDir).filter(function (name) {
      return (/aimake-plugin-\w+$/.test(name)
      );
    });
    // 注册插件
    plugins.forEach(function (name) {
      if (!pluginPool[name]) {
        pluginPool[name] = true;

        // 注册插件到help信息里面
        try {
          var packageJson = _path2.default.join(modulesDir, name, 'package.json');
          var pluginPkg = require(packageJson);
          // 核心命令不需要重新注册
          if (!ifCoreCommand(name.substring(13))) {
            _commander2.default.command(name.substring(13)).description(pluginPkg.description);
          }
          // 保存 package 文件信息，检查版本更新需要
          pluginPackagePath[name.substring(13)] = packageJson;
        } catch (e) {
          console.log(_chalk2.default.red('读取插件信息出现异常，请联系@心伦'));
          process.exit(0);
        }
      }
    });
  });
}

function error(e) {
  var err = '未知错误，请联系@心伦';
  console.error(_chalk2.default.red('ERROR: ' + err));
  console.error(e.stack);
  process.exit(1);
}

main();