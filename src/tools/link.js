import path from 'path';
import childProcess from 'child_process';
import chalk from 'chalk';

const execSync = childProcess.execSync;
const rootDir = process.cwd();

export default function (pluginsDir) {
  try {
    const pkg = require(path.join(rootDir, './package.json'));
    const pluginName = pkg.name;
    const match = /plugin-(\w*)/.exec(pluginName);
    execSync('npm link');
    execSync(`npm link ${pluginName}`, {
      cwd: path.join(pluginsDir),
    });
    console.log(chalk.green.bold(`Soft link success, now you can execute ${chalk.yellow.bold(`\`aimake ${match[1]}\``)} to test command.`));
  } catch (e) {
    console.log(chalk.red.bold('Soft link failure.'));
    console.log(e);
  }
}
