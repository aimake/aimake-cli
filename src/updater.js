import chalk from 'chalk';
import packageJson from 'package-json';
import fs from 'fs';
import path from 'path';
import semver from 'semver';
import os from 'os';

// 版本检查信息记录文件
const configRoot = path.join(os.homedir(), '.aimake');
const versionsPath = path.join(configRoot, 'latest-versions.json');

function showTip(plugin, currentVersion, remoteVersion) {
  if (plugin === 'aimake-cli') {
    console.log(chalk.yellow(`\n  Update available: ${plugin}@${remoteVersion} (Current: ${currentVersion}) 
     \n  Run  \`yarn install aimake-cli -g \`  to update.\n`));
  } else {
    console.log(chalk.yellow(`\n  Update available: ${plugin}@${remoteVersion} (Current: ${currentVersion}) 
     \n  Run  \`aimake install ${plugin} \`  to update.\n`));
  }
}

export default async function (plugin, pluginPackagePath) {
  if (!plugin || !pluginPackagePath[plugin]) {
    Promise.resolve(true);
  } else {
    const pkg = require(pluginPackagePath[plugin]);
    let versions;
    // 获取版本检查信息
    try {
      versions = JSON.parse(fs.readFileSync(versionsPath, 'utf-8'));
    } catch (e) {
      versions = {};
    }

    if (!versions[plugin] || Date.now() - versions[plugin].update > 7 * 3600000 * 24) {
      // 至少7天才检查一次远程版本
      // 检查完缓存到本地
      try {
        const remotePkg = await packageJson(pkg.name);
        if (!versions[plugin]) {
          versions[plugin] = {};
        }
        if (semver.lt(pkg.version, remotePkg.version)) {
          showTip(plugin, pkg.version, remotePkg.version);
        }
        versions[plugin].version = remotePkg.version;
        versions[plugin].update = Date.now();
        fs.writeFileSync(versionsPath, JSON.stringify(versions));
      } catch (e) {
        // 版本检查出现错误 默认版本0.0.0
        versions[plugin] = {};
        versions[plugin].version = '0.0.0';
        versions[plugin].update = Date.now();
        fs.writeFileSync(versionsPath, JSON.stringify(versions));
      }
    } else if (versions[plugin]) {
      // 本地记录检查
      if (semver.lt(pkg.version, versions[plugin].version)) {
        showTip(plugin, pkg.version, versions[plugin].version);
      }
    }
  }
}
