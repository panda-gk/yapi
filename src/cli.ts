#!/usr/bin/env node
import * as TSNode from 'ts-node'
import cli from 'commander'
import express from 'express'
import consola from 'consola'
import fs from 'fs-extra'
import gitDiff from 'git-diff'
import ora from 'ora'
import path from 'path'
import prompt from 'prompts'
import open from 'open'
import { Config, ServerConfig } from './types'
import { Generator } from './Generator/index'

const pkg = require('./../package.json')

import {resolveApp} from './utils'

import { configTemplate, viewHtmlTemplate } from './template'


const openChangelog = (configFile: string) => {
  // 打开变动视图
  const app = express()
  const config: ServerConfig = require(configFile).default
  let updateJson = fs.readFileSync(resolveApp(`${config.outputFilePath}/update.json`)).toString()
  app.listen(34564, function(err: any) {
    if (err) return
    const uri = 'http://localhost:34564'
    console.log(`变更日志：${uri}`)
    open(uri)
    app.get('/', (req, res) => {
      res.send(viewHtmlTemplate(updateJson))
    })
  })
}

TSNode.register({
  transpileOnly: true,
  compilerOptions: {
    module: 'commonjs',
  },
})

;(async () => {
  const pkg = require('../package.json')
  const configFile = path.join(process.cwd(), 'yfeapi2ts.config.ts')

  cli
    .version(pkg.version)
    .arguments('[cmd]')
    .action(async cmd => {
      switch (cmd) {
        case 'init':
          if (await fs.pathExists(configFile)) {
            consola.info(`检测到配置文件: ${configFile}`)
            const answers = await prompt({
              type: 'confirm',
              name: 'override',
              message: '是否覆盖已有配置文件?',
            })
            if (!answers.override) return
          }

          await fs.outputFile(configFile, configTemplate)
          consola.success('写入配置文件完毕')
          break

        case 'changelog':
          openChangelog(configFile)
          break

        case 'version':
          console.log(`当前 yfeapi2ts版本号 ${pkg.version}`)
          break

        default:
          if (!await fs.pathExists(configFile)) {
            return consola.error(`找不到配置文件: ${configFile}`)
          }
          consola.success(`找到配置文件: ${configFile}`)
          try {
            const config: ServerConfig = require(configFile).default
            const generator = new Generator(config)

            const spinner = ora('正在获取yapi数据样本').start()
            const output = await generator.generate()
            spinner.stop()
            consola.success('yapi数据样本已获取，开始写入')
            generator.write(output, function(isNew) {
              if (isNew && config.changelog) {
                openChangelog(configFile)
              }
            })
          } catch (err) {
            return consola.error(err)
          }
          break
      }
    })
    .parse(process.argv)
})()
