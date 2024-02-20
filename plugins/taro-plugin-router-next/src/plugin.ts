import { processTypeEnum } from '@tarojs/helper';
import { IPluginContext } from '@tarojs/service';
import { IPaths } from '@tarojs/service/src/utils/types';
import * as path from 'path';
import { IConfig, IConfigPackage } from './config';
import { Page } from './entitys';
import { Generator } from './generator';
import { Loader } from './loader';
import * as fs from 'fs-extra';
import { FSWatcher } from 'fs';

export class Plugin {
  loader: Loader;
  generator: Generator;
  isWatch: boolean;
  paths: IPaths;
  helper: typeof import('@tarojs/helper');
  watcher: FSWatcher;
  routerWatcher: FSWatcher;
  pages: Page[] = [];

  constructor(public readonly ctx: IPluginContext, public config: IConfig) {
    this.helper = this.ctx.helper as any;
    this.paths = this.ctx.paths;

    this.config.packages = this.config.packages ?? [];

    this.getSubConfig();

    this.config.ignore = ['.DS_Store', 'tabbar'];

    this.isWatch = !!(this.ctx.runOpts.options.isWatch || this.ctx.runOpts.options.watch);
    this.loader = new Loader(this);
    this.generator = new Generator(this);
  }

  generateSubPageConfig(pagesSubPath, isTabbar?) {
    const handlePages = (subName) => {
      const pages = fs
        .readdirSync(path.join(pagesSubPath, subName))
        .map((item) => {
          const pageSubCpnPath = path.join(pagesSubPath, subName, item, 'index.tsx');
          if (fs.pathExistsSync(pageSubCpnPath)) {
            return `${item}/index`;
          }
        })
        .filter((item) => item);

      if (pages.length) {
        return {
          name: subName,
          pagePath: path.join(pagesSubPath, subName)
        };
      }
    };

    if (!fs.pathExistsSync(pagesSubPath)) return [];

    const pathArr = fs
      .readdirSync(pagesSubPath)
      .map((subName) => {
        if (isTabbar) {
          if (subName === 'tabbar') {
            return handlePages(subName);
          }
        } else {
          return handlePages(subName);
        }
      })
      .filter((item) => item);

    return pathArr;
  }

  getSubConfig() {
    this.config.packages = [];
    if (this.config.packages.findIndex((pkg) => pkg.name === 'main') === -1) {
      this.config.packages.push({
        name: 'main',
        pagePath: path.resolve(this.paths.sourcePath, 'pages')
      });
    }

    const pagesSubPath = path.join(this.ctx.paths.sourcePath, './pages-sub');
    const mainPath = path.join(this.ctx.paths.sourcePath, './pages');
    const pagesSubPathArr = this.generateSubPageConfig(pagesSubPath);
    const tabbarPathArr = this.generateSubPageConfig(mainPath, true);
    this.config.packages = [...this.config.packages, ...(tabbarPathArr as any), ...(pagesSubPathArr as any)];
  }

  onBuildStart() {
    this.ctx.onBuildStart(() => this.start());
    return this;
  }

  registerCommand() {
    const { ctx } = this;
    ctx.registerCommand({
      name: 'router',
      optionsMap: {
        '--watch': '监听页面信息变化自动生成 Router'
      },
      synopsisList: ['taro router-gen 生成 Router', 'taro router-gen --watch 监听页面信息变化自动生成 Router'],
      fn: () => {
        this.start();
        process.exit(0);
      }
    });
    return this;
  }

  watch() {
    const { ctx } = this;
    this.log(processTypeEnum.REMIND, '正在监听页面变化自动生成 Router.to...');
    const loadPge = (pageDirPath: string, pkg: IConfigPackage) => {
      if (this.loader.loadPage(pageDirPath, pkg)) this.generator.emit();
    };

    for (const pkg of this.config.packages) {
      const onChange = (value: string) => {
        // 兼容windows
        value = path.normalize(value).replace(/\\/g, '/');
        if (value.endsWith('route.config.ts')) {
          value = value.replace('/route.config.ts', '');
        }
        loadPge(value, pkg);
      };

      this.watcher = ctx.helper.chokidar
        .watch(pkg.pagePath, { ignoreInitial: true, depth: 0 })
        .on('addDir', onChange)
        .on('unlinkDir', onChange);

      this.routerWatcher = ctx.helper.chokidar
        .watch(path.resolve(pkg.pagePath, '**/route.config.ts'), {
          ignoreInitial: true,
          depth: 1
        })
        .on('add', onChange)
        .on('change', onChange)
        .on('unlink', onChange);
    }
  }

  // 监听到page-sub、tabbar发生变化时执行此函数
  async handleGenerator(val: string) {
    const name = val.split('/')[val.split('/').length - 3];
    const isPkg = this.config.packages.find((item) => item.name === name);
    if (!isPkg) {
      this.getSubConfig();
      if (val.endsWith('route.config.ts')) {
        val = val.replace('/route.config.ts', '');
      } else if (val.endsWith('index.tsx')) {
        val = val.replace('/index.tsx', '');
      }
      const pkg = this.config.packages.find((item) => item.name === name);
      pkg && this.loader.loadPage(val, pkg);
      this.generator.emit();
      await this.watcher.close();
      await this.routerWatcher.close();
      this.watch();
    }
  }

  start() {
    try {
      this.log(processTypeEnum.START, '正在生成路由方法...');
      this.loader.loadPages();
      this.generator.emit(true);
      if (this.isWatch) this.watch();

      const pagesSubPath = path.join(this.ctx.paths.sourcePath, './pages-sub', '**/index.tsx');

      const tabbarPath = path.join(this.ctx.paths.sourcePath, './pages', 'tabbar', '/*/index.tsx');
      this.ctx.helper.chokidar
        .watch([pagesSubPath, tabbarPath], { ignoreInitial: true, depth: 2 })
        .on('add', this.handleGenerator.bind(this));
    } catch (err) {
      this.log(processTypeEnum.ERROR, '路由方法生成失败');
      console.log(err);
    }
  }

  log(type: processTypeEnum, text: string) {
    this.ctx.helper.printLog(type as any, text);
  }
}
