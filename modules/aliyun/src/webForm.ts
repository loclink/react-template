import { merge, autobind } from '@wmeimob/decorator/src/components'
import { guid } from '@wmeimob/utils/src/guid'
import { IUplodaOptions } from './config'

/**
 * web端使用form表单形式上传文件
 */
@autobind
export default class AliYunWebForm {
  private getOssToken: () => Promise<any>

  constructor(config: { getOssToken: () => Promise<any> }) {
    this.getOssToken = config.getOssToken
  }

  /**
   * 上传文件
   * @param {string[]} fileList
   */
  async upload(fileList: File[], options: IUplodaOptions = {}) {
    const {
      data: { accessid, signature, policy, dir, host }
    } = await this.getOssTokenMerge()

    const uploadTasks = fileList.map((file) => {
      const { name } = file

      const suffixIndex = name.lastIndexOf('.')
      const fileName = name.slice(0, suffixIndex)
      const extname = name.slice(suffixIndex + 1)

      const setFileName = options.setFileName || (() => '')
      const nFileName = setFileName(fileName)
      let key = dir
      if (nFileName) {
        key += nFileName
        if (nFileName.lastIndexOf('/') !== nFileName.length - 1) {
          key += '-'
        }
      }
      key += `${guid()}.${extname}`

      const form = new FormData()
      form.append('name', 'file')
      form.append('signature', signature)
      form.append('OSSAccessKeyId', accessid)
      form.append('policy', policy)
      form.append('key', key)
      form.append('success_action_status', '200')
      form.append('file', file)

      return fetch(host, { method: 'post', body: form, mode: 'cors' }).then(({ status }) => {
        if (status === 200) {
          return `${host}/${key}`
        }
        throw new Error('上传失败')
      })
    })
    return Promise.all(uploadTasks)
  }

  @merge()
  private getOssTokenMerge() {
    return this.getOssToken()
  }
}
