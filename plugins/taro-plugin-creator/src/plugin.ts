import { IPluginContext } from '@tarojs/service'
import { CreatorOptions } from './types'
import { LogTypeEnum } from './constant'
import {
  generatorMainPackagePage,
  generatorSubPackagePage,
  generatorTabBarPage,
  validPath,
} from './utils'

export class Plugin {
  constructor(
    public readonly ctx: IPluginContext,
    public readonly options: CreatorOptions
  ) {}

  log(type: LogTypeEnum, message: string) {
    this.ctx.helper.printLog(type as any, message)
  }

  async handleCreater(ctx: IPluginContext, options: CreatorOptions, { _ }) {
    if (_?.length < 2) {
      this.log(LogTypeEnum.ERROR, '请输入页面路径')
      process.exit(0)
    } else {
      const cmd = _[0]
      const path = _[1]
      if (!validPath(path)) {
        this.log(LogTypeEnum.ERROR, '路径不合法')
        process.exit(0)
      }
      switch (cmd) {
        case 'gp':
          generatorMainPackagePage(ctx, path, options)
          break
        case 'gs':
          generatorSubPackagePage(ctx, path, options)
          break
        case 'gt':
          generatorTabBarPage(ctx, path, options)
          break
      }
    }
    process.exit(0)
  }
  registerCommand() {
    this.ctx.registerCommand({
      name: 'gs',
      synopsisList: [
        'taro gs home/goods-list     (在分包目录中生成home/goods-list, 例如: pages-sub/home/goods-list)',
      ],
      fn: async (opt) => await this.handleCreater(this.ctx, this.options, opt),
    })

    this.ctx.registerCommand({
      name: 'gp',
      synopsisList: [
        'taro gp auth     (在主包目录中生成auth, 例如: pages/auth)',
      ],
      fn: async (opt) => await this.handleCreater(this.ctx, this.options, opt),
    })

    this.ctx.registerCommand({
      name: 'gt',
      synopsisList: [
        'taro gt profile     (在tabbar中生成profile, 例如: pages/tabbar/profile)',
      ],
      fn: async (opt) => await this.handleCreater(this.ctx, this.options, opt),
    })
  }
}
