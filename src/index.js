import path from 'path';
import os from 'os';
import fs from 'fs';
import fse from 'fs-extra';
import program from 'commander';
import semver from 'semver';
import chalk from 'chalk';
import resolve from 'resolve';
import npminstall from 'npminstall';
import updater from './updater';
import pkg from '../package.json';
import link from './tools/link';
import commandDefine from './command';

program
  .version(pkg.version)
  .usage('<command> [options]');

const argvs = process.argv;

// 核心命令
const coreCommand = ['init', 'dev', 'build', 'install', 'plugin', 'sync'];

// 插件存放目录
const pluginsDir = path.join(__dirname, '..');

const moduleDirs = [
  path.join(pluginsDir, 'node_modules'),
];
// 插件 package.json 路径
const pluginPackagePath = {
  'aimake-cli': path.resolve(__dirname, '../package.json'),
};

function ensureAIMakeFile() {
  const rootDir = path.join(os.homedir(), '.aimake');
  fse.ensureDirSync(rootDir);
  fse.ensureDirSync(path.join(rootDir, 'plugins'));
  fse.ensureDirSync(path.join(rootDir, 'plugins/node_modules'));
  fse.ensureFileSync(path.join(rootDir, 'latest-versions.json'));
  fse.ensureDirSync(moduleDirs[0]);
}

function registerCoreCommand() {
  for (let i = 0, len = commandDefine.length; i < len; i += 1) {
    program
      .command(commandDefine[i].name)
      .description(commandDefine[i].description);
  }
}

function ifCoreCommand(command) {
  for (let i = 0, len = coreCommand.length; i < len; i += 1) {
    if (command === coreCommand[i]) {
      return true;
    }
  }
  return false;
}

function registerPlugin() {
  let plugins;
  const pluginPool = {};
  moduleDirs.forEach((modulesDir) => {
    // 扫描插件
    plugins = fs.readdirSync(modulesDir).filter(name => /^aimake-plugin-\w+$/.test(name));
    // 注册插件
    plugins.forEach((name) => {
      if (!pluginPool[name]) {
        pluginPool[name] = true;

        // 注册插件到help信息里面
        try {
          const packageJson = path.join(modulesDir, name, 'package.json');
          const pluginPkg = require(packageJson);
          // 核心命令不需要重新注册
          if (!ifCoreCommand(name.substring(13))) {
            program
              .command(name.substring(13))
              .description(pluginPkg.description);
          }
          // 保存 package 文件信息，检查版本更新需要
          pluginPackagePath[name.substring(13)] = packageJson;
        } catch (e) {
          console.log(chalk.red('Exception occurred when reading plugin information.'));
          process.exit(0);
        }
      }
    });
  });
}

function error(e) {
  const err = 'Unknown error';
  console.error(chalk.red(`ERROR: ${err}`));
  console.error(e.stack);
  process.exit(1);
}

async function installCorePlugin(command) {
  const config = {
    root: process.cwd(),
    pkgs: [
      { name: `aimake-plugin-${command}`, version: 'latest' },
    ],
    targetDir: pluginsDir,
    registry: 'http://registry.npmjs.org',
  };
  console.log(chalk.green(`Start installing module ${chalk.yellow.bold(command)} ...`));
  try {
    await npminstall(config);
  } catch (e) {
    console.log(chalk.red(`Failure of installation module ${chalk.yellow.bold(command)}`));
    process.exit();
  }
}

async function prepare(command) {
  try {
    return resolve.sync(`aimake-plugin-${command}`, {
      paths: moduleDirs,
    });
  } catch (e) {
    if (ifCoreCommand(command)) {
      // 自动安装核心插件
      await installCorePlugin(command);
      return resolve.sync(`aimake-plugin-${command}`, {
        paths: moduleDirs,
      });
    }
    // 提示安装插件
    console.log('');
    console.log(`  ${chalk.green.bold(command)} command is not installed.`);
    console.log(`  You can try to install it by ${chalk.blue.bold(`aimake install ${command}`)}.`);
    console.log('');
  }
  return null;
}

async function run(command, pluginPath) {
  if (!pluginPath) {
    return;
  }
  // 检查插件版本更新
  await updater(command, pluginPackagePath);

  const pluginDef = require(pluginPath);
  const plugin = program.command(pluginDef.command || command);
  if (pluginDef.options) {
    // 添加命令的选项参数并进行解释
    pluginDef.options.forEach((option) => {
      plugin.option(option[0], option[1]);
    });
  }
  // 命令执行后的回调
  plugin.action((_cmd, _opts) => {
    // 获取命令参数和选项
    // 有参数命令 aimake install [name]
    // 无参数命令 aimake dev
    let cmd = _cmd;
    let opts = _opts;
    if (cmd instanceof program.Command) {
      opts = cmd;
      cmd = undefined;
    }
    opts = opts || {};
    // 执行命令
    pluginDef.run(cmd, opts);
  });
  program.parse(argvs);
}

async function main() {
  // 检查Node版本
  if (!semver.satisfies(process.version, pkg.engines.node)) {
    console.log(chalk.red.bold(`Require nodejs version ${pkg.engines.node}, current ${process.version}`));
    console.log(`Download the latest nodejs here ${chalk.green('https://nodejs.org/en/download/')}`);
    process.exit();
  }

  // 保证目录、文件存在
  ensureAIMakeFile();

  // 检查 aimake-cli 版本更新
  await updater('aimake-cli', pluginPackagePath);

  const command = argvs[2];

  // 软连接插件
  if (command === 'link') {
    try {
      await link(pluginsDir);
      process.exit(0);
    } catch (e) {
      error(e);
    }
  }

  // 注册核心命令
  registerCoreCommand();
  // 注册插件
  registerPlugin();
  // 解析命令行参数
  program.parse(process.argv);

  // 输出帮助信息
  if (!command) {
    program.outputHelp();
    process.exit(0);
  }

  // 其他命令
  try {
    const pluginPath = await prepare(command);
    await run(command, pluginPath);
  } catch (e) {
    error(e);
  }
}

main();
