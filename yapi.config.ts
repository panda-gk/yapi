

const config = {
  target: 'ts',
  serverUrl: 'http://yapi.ywwl.org',
  outputFilePath: 'api',
  projectId: '24',
  UM_distinctid: "171637f0112366-06894cf3e07803-15396555-fa000-171637f0113813",
  _yapi_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjE4LCJpYXQiOjE1NTY1MDYyMTUsImV4cCI6MTU1NzExMTAxNX0.ADmz2HEE6hKoe1DP_U2QtyKSSEURLf5soGKRNyJkX_o',
  _yapi_uid: '18',
  generateApiFileCode: (api) => {
    const arr = [
      `
      /**
      * ${api.title}
      * ${api.markdown || ''}
      **/
      `,
      "import request from './../request'",
      'type Serve<T, G> = (data?: T) => Promise<G>',
      api.requestInterface,
      api.responseInterface,
      `
      export default (data?): Serve<
        ${api.reqInterfaceName},
        ${api.resInterfaceName}['data']
      > => request({
        method: '${api.method}',
        url: '${api.path}',
        data: ${(() => {
          if (api.method.toLocaleLowerCase() === 'get') {
            return '{params: data}'
          } else {
            return 'data'
          }
        })()}
      })
      `,
    ]
    return arr.join(`
    `)
  }
}

export default config
