/* eslint-disable no-console */
/**
 * request实例。此入口基于Taro.request api进行封装。支持Taro端使用
 */
import Taro from '@tarojs/taro';
import TaroRequest from './core/TaroRequest';
import { normalizationUrl } from './core/utils';
import { createInstance } from './helper/createInstance';
import { IRequestOption } from './types';
import { ITaroRequestConfig, ITaroResponse } from './types/taro-type';

export type { ITaroRequestConfig } from './types/taro-type';

export interface ITaroInstance extends Omit<TaroRequest, 'request'> {
  create: (config?: IRequestOption) => ITaroInstance;
  <T>(config: ITaroRequestConfig): Promise<ITaroResponse<T>>;
}

function create(config: IRequestOption = {}) {
  const ins = createInstance(config, TaroRequest, ['getErrorData']) as ITaroInstance;
  ins.create = create;
  return ins;
}

const instance = create();

export default instance;

/** 合并函数 */
function merge(callback: any, delay = 200) {
  let promise: Promise<any> | null;
  let timeout: any;
  let resloveHandle: any;
  let state = 0;

  return (...params: any[]) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    if (state === 0) {
      timeout = setTimeout(async () => {
        state = 1;
        const result = await callback(...params);
        resloveHandle(result);
        promise = null;
        state = 0;
      }, delay);
    }

    if (!promise) {
      promise = new Promise((resolve) => {
        resloveHandle = resolve;
      });
    }

    return promise;
  };
}

const getToken = merge(async (url: string) => {
  const { code } = await Taro.login();
  return instance.get(url, { code }).then((res) => res.data as any);
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
  { silentAuthorization, silentAuthorizationUrl }: { silentAuthorization: boolean; silentAuthorizationUrl: string }
) {
  let token = Taro.getStorageSync('token');
  // 静默授权
  if (!token && silentAuthorization) {
    const fetchUrl = normalizationUrl(silentAuthorizationUrl, config.baseUrl);
    const { data } = await getToken(fetchUrl);
    token = data; // 赋值token
    Taro.setStorageSync('token', token);
  }

  config.headers = { ...config.headers, Authorization: token };
  return config;
}

interface IResOption {
  /** 是否打印接口log */
  log?: boolean;

  silentAuthorization: boolean;

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
      return instance(config);
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

  return res.data;
}
