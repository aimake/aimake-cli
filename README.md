# aimake

## 介绍

aimake-cli 是前端构建一站式解决方案，它主要解决的问题是

* 初始化项目需要安装一大堆开发依赖，而且这些依赖在每个项目大都是重复的。
* 每个项目都有自己的一套构建配置，无法进行统一管理和维护。
* 需要有更好的数据模拟方案和远程调试方案。
* 希望有一个集中的地方解决开发流程的问题。
* 希望能有流畅便捷的构建体验。
* ...

aimake-cli的出现就是为了集中解决用户开发中遇到的问题，为开发者提供一套便捷的开发方案。
从项目初始化、开发、添加页面、构建、发布，一站式解决开发流程上的问题。

## 环境准备

aimake-cli 依赖 nodejs（>=4.0）和 npm（>=5.0），安装之前需要确保这两项已经安装，
如果已经安装过可以跳过这一小节。

可以通过 node -v 和 npm -v 命令查看是否安装 nodejs 和 tnpm。

### Mac/Linux 用户

Mac 推荐使用 [nvm](https://github.com/creationix/nvm) 管理 node 版本，执行以下命令，将会在 ~/.nvm 目录下并且在你的 bash 或者 zsh 等中加入 nvm 命令链接：

```bash
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.4/install.sh | bash
```

详细 nvm 安装链接，请参考 [官网地址](https://github.com/creationix/nvm)。

* 通过 nvm 安装最新版 Node。

  ```bash
  $ nvm install node
  ```

* 通过 nvm 安装最新版 Node。

  ```bash
  $ nvm install node
  ```
### Windows 用户

通过下载 zip 包，解压缩，并且给环境变量 PATH 加上 ${your-dir}\tnpm\bin 即可同时安装 Node 和 tnpm。

## 安装

```bash
yarn add -g aimake-cli
```
