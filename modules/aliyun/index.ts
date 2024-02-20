interface ISize {
  /** 宽度 */
  width?: number
  /** 高度 */
  height?: number
}

// 几倍图
const multiple = 2

/**
 * 计算整数
 */
function trunc(nu: number) {
  return Math.trunc(nu) * multiple
}

/**
 * 组装图片链接
 *
 * @export
 * @param {string} url
 * @param {ISize} [size]
 * @return {*}
 */
export function assembleResizeUrl(url?: string, size?: ISize) {
  return url ? url + getResizeUrl(size) : ''
}

/**
 * 获取剪接图片后缀
 *
 * @export
 * @param {ISize} [{ width, height }={}]
 * @return {*}
 */
export function getResizeUrl({ width, height }: ISize = {}) {
  let url = `?x-oss-process=image/resize,m_fill`
  if (width) {
    url += `,w_${trunc(width)}`
  }
  if (height) {
    url += `,h_${trunc(height)}`
  }
  return url
}

/**
 * 获取视频第一帧图片
 *
 * @static
 * @param {{ width: number, height: number }} { width, height }
 * @returns
 * @memberof AliYun
 */
export function getVideoSnapshotUrl({ width, height }: ISize) {
  let url = `?x-oss-process=video/snapshot,t_7000,f_jpg`

  if (width) {
    url += `,w_${trunc(width)}`
  }
  if (height) {
    url += `,h_${trunc(height)}`
  }
  return url
}
