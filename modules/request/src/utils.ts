/**
 * 解析并替换url中的动态参数
 *
 * @param {string} [path='']
 * @param {*} params
 * @returns
 */
export function paserDynamicPath(path = '', params: any = {}) {
  // 如果参数不是对象。直接返回
  if (typeof params !== 'object' || params instanceof Array) {
    return { url: path, data: params }
  }
  const data: any = {};
  let url = path;
  Object.keys(params).forEach(key => {
    const dyReg = new RegExp(`:${key}`, 'g');
    if (dyReg.test(url)) {
      url = url.replace(dyReg, params[key]);
    } else {
      data[key] = params[key];
    }
  })

  return { url, data }
}

/**
 * 根据状态码判断是否报错。
 *
 * @export
 * @param {number} statusCode
 * @param {*} data
 * @returns
 */
export function validateStatus(statusCode: number) {
  return statusCode >= 200 && statusCode < 300;
}

/**
 * TODO: fetch支持timeout设置
 * 超时函数
 *
 * @param {Promise<any>} promise
 * @param {number} [ms=60000] 超时时间。默认一分钟
 * @returns
 */
function promiseTimeout(promise: Promise<any>, ms = 60000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('FETCH REQUEST TIMEOUT'))
    }, ms)

    promise
      .then(value => {
        clearTimeout(timer)
        resolve(value)
      })
      .catch(reason => {
        clearTimeout(timer)
        reject(reason)
      })
  })
}
