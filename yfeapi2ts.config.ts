
// import { ServerConfig } from 'ywapi2ts'

const config = {
  target: 'js',
  serverUrl: 'http://yapi.mockuai.com',
  outputFilePath: 'api',
  projectId: '1434',
  _yapi_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjcxNiwiaWF0IjoxNTg3MzQ0Mjg0LCJleHAiOjE1ODc5NDkwODR9.mXDIFHQbX3SAM73Szc_FrSvYCZUlXCQrZH5qt8iKZHk',
  _yapi_uid: '716',
  // catid: {
  //   exclude: ['37']
  // },
  generateApiName: (path, _id) => {
    return `api${_id}`
  },
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
        ${(() => {
          if (api.method.toLocaleLowerCase() === 'get') {
            return 'params: data'
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
