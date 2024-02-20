import Taro from '@tarojs/taro';
import BaseRequest from './BaseRequest';
import { IRequestOption } from './types';
import {
  ITaroRequestConfig,
  ITaroRequestInterceptor,
  ITaroResponse,
  ITaroResponseInterceptor
} from './types/taro-type';
import { jointQuery, merge, normalizationUrl } from './utils';

export type { ITaroRequestConfig } from './types/taro-type';

export default class TaroRequest extends BaseRequest<ITaroRequestInterceptor, ITaroResponseInterceptor<any>> {
  constructor(config: IRequestOption = {}) {
    super(config);
  }

  /**
   * 基于Taro request api的请求实现
   * @param config
   */
  async request<T = any>(config: ITaroRequestConfig) {
    const mergedConfig = this.setConfig(config);
    const responseConfig = await this.handleRequestInterceptor(mergedConfig); // 处理前置请求拦截器
    const requestConfig = this.convertConfig(responseConfig);
    const { params = {}, url = '', ...rest } = requestConfig;

    let fetchUrl = normalizationUrl(url, mergedConfig.baseUrl);
    fetchUrl = jointQuery(fetchUrl, params);

    let response: ITaroResponse<T>;

    try {
      response = (await Taro.request({ ...rest, url: fetchUrl })) as any;
    } catch (error) {
      response = (await this.getErrorData(error)) as any;
    }

    response.config = responseConfig;
    response.href = fetchUrl;

    return this.handleResponseInterceptor(response).catch(() => {
      throw response;
    });
  }

  private async getErrorData(res: any) {
    // 判断是不是h5环境
    if (typeof res.text === 'function') {
      const data = await this.getFetcchResponseData(res); // 获取数据
      return {
        statusCode: (res as Response).status,
        errMsg: (res as Response).statusText,
        header: (res as Response).headers,
        data
      };
    }
    return {
      statusCode: 500,
      errMsg: '网络连接失败！请检查网络！',
      header: {},
      data: {
        error: {
          message: '网络连接失败！请检查网络！'
        }
      },
      ...res
    };
  }

  private convertConfig(config: ITaroRequestConfig) {
    const obj: any = {};
    Object.keys(config).forEach((key) => {
      const value = config[key];
      if (key === 'headers') {
        obj.header = value;
      } else {
        obj[key] = value;
      }
    });
    return obj;
  }
}

const getToken = merge(async (silentAuthorization) => {
  const { code } = await Taro.login();
  return silentAuthorization({ code }, { isSilentAuth: true });
  // return (url, { code }).then((res) => res.data as any);
});

/**
 * 请求统一携带token
 *
 * 给发出的请求头携带token信息。
 * 如果没有token。如果是静默登录 则获取最新的token并存储在storage中
 * @param config
 * @param param1
 * @returns
 */
export async function takeTokenRequestInterceptor(
  config: ITaroRequestConfig,
  { silentAuthorization }: { silentAuthorization: any }
) {
  let token = Taro.getStorageSync('token');

  // 静默授权
  if (!token && silentAuthorization && !config.isSilentAuth) {
    const data = await getToken(silentAuthorization);
    token = data.token;
    Taro.setStorageSync('token', token);
  }

  config.headers = {
    ...config.headers,
    Authorization: token
  };
  return config;
}

interface IResOption {
  /** 是否打印接口log */
  log?: boolean;

  silentAuthorization: any;

  loginUrl: string;

  instance: any;
}

/**
 * 响应拦截器
 *
 * 配置是否打印请求
 * 过期token自动重新发起请求
 * 异常请求统一处理
 * @param res 接口响应
 * @param option 选项
 * @returns
 */
export async function requestInterceptorHanlder(res: any, option: IResOption) {
  const { config, statusCode, data = {} } = res;
  const { log, silentAuthorization, loginUrl, instance } = option;

  let description: string | null = null;
  // 打印请求log
  if (log) {
    const { url, method, baseUrl, params = {} } = config;
    console.log(`--------`);
    console.log(`【${method}】${normalizationUrl(url, baseUrl)}`);
    Object.keys(params).length && console.log('query', params);
    config.data && console.log('data', config.data);
    console.log('response', data);
    console.log(`--------`);
  }

  // token过期或者无权限等 清空token
  if ([403, 40003, 401].indexOf(data.code) !== -1) {
    Taro.removeStorageSync('token');
    // 如果静默登录 则重新发请求获取code
    if (silentAuthorization) {
      return instance.request(config);
    }
    // 如果不是静默登录 则跳转至登录
    loginUrl && Taro.navigateTo({ url: loginUrl });
    throw new Error();
  } else if (data.code !== 0 || statusCode !== 200) {
    description = data.msg || '未知错误，万分抱歉！';
  }

  if (description !== null) {
    const { errorToast = true } = config;
    errorToast && Taro.showToast({ icon: 'none', title: description });
    throw new Error();
  }

  return res;
}
