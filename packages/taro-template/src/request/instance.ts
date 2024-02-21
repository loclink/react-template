import { requestInterceptorHanlder, takeTokenRequestInterceptor } from 'taro-request';
import { Api } from './api/http';

const instance = new Api({
  baseUrl: 'http://localhost:3000'
});

// 请求拦截器
instance.requestInterceptors.use((requestConfig) => {
  return takeTokenRequestInterceptor(requestConfig, {
    silentAuthorization: instance.weapp.authControllerSilentLogin
  });
});

// 响应拦截器
instance.responseInterceptors.use((res) => {
  return requestInterceptorHanlder(res, {
    log: true,
    silentAuthorization: instance.weapp.authControllerSilentLogin,
    loginUrl: '/auth/index',
    instance
  });
});

export default instance;
