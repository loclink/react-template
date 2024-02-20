import { merge, autobind } from "@wmeimob/decorator/src/components";
import { guid } from "@wmeimob/utils/src/guid";

@autobind
export default class AliYunTaro {
  private getOssToken: () => Promise<any>;

  constructor(config: { getOssToken: () => Promise<any> }) {
    this.getOssToken = config.getOssToken;
  }

  /**
   * 上传文件
   *
   * @param {string[]} fileList
   * @returns
   * @memberof AliYun
   */
  async upload(fileList: string[]) {
    if (fileList.length === 0) {
      return [];
    }

    const {
      content: { accessKeyId, signature, policy, dir, host }
    } = await this.getOssTokenMerge();

    return Promise.all(
      fileList.map(
        file =>
          new Promise<string>(resolve => {
            if (new RegExp("^" + host).test(file)) {
              resolve(file);
              return;
            }

            const formKey = `${dir}${guid()}${file.slice(
              file.lastIndexOf(".")
            )}`;

            const formData = new FormData();
            formData.append("signature", signature);
            formData.append("OSSAccessKeyId", accessKeyId);
            formData.append("policy", policy);
            formData.append("key", formKey);
            formData.append("success_action_status", "200");
            formData.append("file", {
              uri: file,
              type: "multipart/form-data",
              name: file
            } as any);

            fetch(host, {
              method: "POST",
              headers: { "Content-Type": "multipart/form-data" },
              body: formData
            }).then(() => resolve(`${host}/${formKey}`));
          })
      )
    );
  }

  @merge()
  private getOssTokenMerge() {
    return this.getOssToken();
  }
}
