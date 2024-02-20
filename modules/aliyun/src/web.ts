import OSS from "ali-oss";
import { autobind, merge } from "./decorator";
import { guid } from "./utils";

interface IOptions {
  /**
   * 增加进度条功能
   *
   * @memberof IOptions
   */
  progress?: (num: number) => void;
  /**
   * 获取阿里云上传对象实体
   *
   * @memberof IOptions
   */
  getClient?: (ossClient: OSS) => void;
}

@autobind
export default class AliYunWeb {
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
  async upload(fileList: File[], options?: IOptions): Promise<string[]> {
    if (fileList.length === 0) {
      return [];
    }

    const { client, content } = await this.getOss();
    options?.getClient?.(client);
    const nums = fileList.map((_value) => 0);
    const countSize = fileList.reduce((prev, value) => prev.size + value.size, {
      size: 0,
    } as any);

    function runProgress() {
      if (options?.progress) {
        options.progress(
          nums.reduce((prev, value, currentIndex) => {
            const prevSize = fileList[currentIndex - 1]
              ? fileList[currentIndex - 1].size
              : 0;
            return prev * prevSize + value * fileList[currentIndex].size;
          }, 0) / countSize
        );
      }
    }

    async function uploadFile({ file, index }: { file: File; index: number }) {
      if (!file.name) {
        return (file as any).url;
      }

      const fileName = `${content.dir}/${guid()}.${file.name.substr(
        file.name.lastIndexOf(".") + 1
      )}`;

      await client.multipartUpload(fileName, file, {
        progress(num: number) {
          nums[index] = num;
          runProgress();
        },
      });
      return content.host + "/" + fileName;
    }

    return Promise.all<string>(
      fileList.map((file, index) => uploadFile({ file, index }))
    );
  }

  @merge()
  private async getOss() {
    const { content } = await this.getOssTokenMerge();

    const client = new OSS({
      // region以杭州为例（oss-cn-hangzhou），其他region按实际情况填写。
      // region: content.region,
      endpoint: content.endpoint,
      // 阿里云主账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM账号进行API访问或日常运维，请登录RAM控制台创建RAM账号。
      accessKeyId: content.accessKeyId,
      accessKeySecret: content.accessKeySecret,
      bucket: content.bucket,
    });

    return {
      client,
      content,
    };
  }

  @merge()
  private getOssTokenMerge() {
    return this.getOssToken();
  }
}

/**
 * 获取图片信息
 *
 * @export
 * @param {string} value
 * @returns
 */
export async function getImageInfo(value: string): Promise<{
  FileSize: { value: string };
  Format: { value: string };
  ImageHeight: { value: string };
  ImageWidth: { value: string };
}> {
  const req = await fetch((value as any) + "?x-oss-process=image/info", {
    method: "GET",
  });
  const data = await req.text();
  return JSON.parse(data);
}
