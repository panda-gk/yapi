# yfeapi2ts

##### 一个根据yapi文档自动生成前端api接口代码的工具，提升效率

### 解决痛点
  * 后端基于yapi写出的mock 前端几乎人肉copy，加大工作量，特别在ts这种强类型项目中，需要手写所有接口的入参出参类型，耗时长
  * 对接口规范要求高，因为代码是自动生成的，所以更要注意接口文档的严谨性


## 安装遥望内网npm源

以下提供2个途径安装
1. 使用nrm(nrm使用方式 自行百度)
```
npm i nrm -g
nrm add yw http://registry.npm.ywwl.org/

nrm use yw

npm i @yowant/yfeapi2ts -g

```

2. 使用ynpm

```
npm i ynpm -g

ynpm i @yowant/yfeapi2ts -g
```


安装完成后可以检查下环境中是否有 `yfeapi2ts`


## 使用方法

 - 2、 生成 yfeapi2ts.config.ts 文件配置到项目

  `yfeapi2ts init`
  到当前开发的项目根目录（与package.json平级）运行该命令，如果当前目录已存在`yfeapi2ts.config.ts` 则会提示是否覆盖，没有则会创建，具体配置说明:
  ```
  export interface ServerConfig {
   /**
   * 构建ts 、js版本
   *
   * @example 'ts'
   */
  target: 'ts' | 'js',
  /**
   * YApi 服务地址。
   *
   * @example 'http://yapi.foo.bar'
   */
  serverUrl: string,
  /**
   * 项目id
   *
   * @example 'http://yapi.ywwl.org/project/24/interface/api' projectId 对应 24
   */
  projectId: string,
  /** cookie _yapi_token */
  _yapi_token: string,
  /** cookie _yapi_uid */
  _yapi_uid: string,
  /**是否自动开启changelog视图, 默认false */
  changelog?: boolean,
  /**
   * 输出文件路径。
   *
   * 可以是 `相对路径` 或 `绝对路径`。
   *
   * @example 'src/ywapi/'
   */
  outputFilePath: string,
  /**
   * 菜单配置
   * include 只包含的 catid
   * exclude 忽略的 catid
   * include exclude 是互斥的 只配置其中之一 也可以都不配置（*）
   */
  catid?: {
    exclude?: string[],
    include?: string[],
  },
  /**
   * @param  {string} path url
   * @param  {string} id 接口唯一id
   */
  generateApiName: (path: string, id: string) => string,
  /**
   * 自定义代码片段函数
   * 不配置的话会有默认代码片段
   */
  generateApiFileCode?: (api: IOutPut) => string,
}
// generateApiFileCode 方法中 api字段说明
export interface IOutPut {
  /** 生成api 文件名称 */
  name: string,
  /** 接口url */
  path: string,
  method: Method,
  /** 接口名 */
  title: string,
  /** 接口备注 */
  markdown: string,
  /** 分类菜单id */
  catid: number,
  /** 接口ID */
  id: number,
  /** request interface 名称 */
  reqInterfaceName: string,
  /** response interface 名称 */
  resInterfaceName: string,
  requestInterface: string,
  responseInterface: string,
}

  ```

  1.示例
   * ts版本
  ```

const config = {
  target: 'ts',
  serverUrl: 'http://yapi.ywwl.org',
  outputFilePath: 'src/api',
  projectId: '48',
  _yapi_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjE4LCJpYXQiOjE1NTc5MDExNjksImV4cCI6MTU1ODUwNTk2OX0.LiVK-Et-Q_KdwbRxCn22M5FzRzlD7I6wsDvBnerDaFY',
  _yapi_uid: '18',
  generateApiFileCode: (api) => {
    const arr = [
      `
      /**
      * ${api.title}
      * ${api.markdown || ''}
      **/
      `,
      "import request from '../utils/request'",
      'type Serve<T, G> = (data?: T) => Promise<G>',
      api.requestInterface,
      api.responseInterface,
      `const http: Serve<${api.reqInterfaceName}, ${api.resInterfaceName}['data'] > = (data?) =>  request({
        method: '${api.method}',
        url: '${api.path}',
        data: ${(() => {
          if (api.method.toLocaleLowerCase() === 'get') {
            return 'params: data'
          } else {
            return 'data'
          }
        })()}
      }) `,
      `export default http`,
    ]
    return arr.join(`
    `)
  }
}

export default config

  ```

  * js版本
```
const config = {
  target: 'js',
  serverUrl: 'http://yapi.ywwl.org',
  outputFilePath: 'src/api',
  projectId: '48',
  _yapi_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjE4LCJpYXQiOjE1NTc5MDExNjksImV4cCI6MTU1ODUwNTk2OX0.LiVK-Et-Q_KdwbRxCn22M5FzRzlD7I6wsDvBnerDaFY',
  _yapi_uid: '18',
  catid: {
    exclude: ['37']
  },
  generateApiFileCode: (api) => {
    const arr = [
      `
      /**
      * ${api.title}
      * ${api.markdown || ''}
      **/
      `,
      "import request from '@/utils/request.js'",

      `export default (data = {}) => request({
        method: '${api.method}',
        url: '${api.path}',
        ${(() => {
          if (api.method.toLocaleLowerCase() === 'get') {
            return 'params: data,'
          } else {
            return 'data'
          }
        })()}
      })`,
    ]
    return arr.join(`
    `)
  }
}

export default config
```

  一般来说 generateApiFileCode 方法需要自己实现一下，组装拼接出符合自己期望的 接口代码格式

 - 3、生成代码
  `yfeapi2ts`
  运行该命令 会根据步骤2的配置文件，生产出api（outputFilePath）文件夹，该文件夹下`index.ts`作为所有接口的导出口，供项目中导入使用

 - 4、查看接口变动日志`yfeapi2ts changelog`

 - 5、查看版本号 `yfeapi2ts version`

### feature
