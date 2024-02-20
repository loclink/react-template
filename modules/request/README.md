# Request 请求接口约束和通用函数

## 概述

request 为 Web、Taro、React Native 提供了统一的接口请求封装。

### 特性

- 统一的 API
- 支持同步和异步的请求前置与后置拦截器.可以在拦截器中对请求或者响应做响应的处理
- 没有 magic。 Taro 是基于官方 api 的封装。其他端使用的是 Fetch Api。支持 api 的所有属性。
- 我们尽可能帮助你去抹平平台差异。但是又最大限度的保留原始 API 的参数设定。思考再三。我们只对极少数的参数 key 进行了兼容统一。包括有:

  **headers**: 默认响应头。在 TaroRequest 中。参数 key 为 header。在请求前会被转化为 header 参数

  **data**:在 fetch API 中。post 数据是放在 body 属性上。我们统一处理为 data 属性。你不必担心。在 fetch 请求之前。我们会将 data 转换为 body。

  **在请求前我们会做对应的转化**

### API

通过传递 config 来发起请求

#### request(config)

```js
import request from '~/request';

request.defaults.baseUrl = 'https://test.com';

request({
  url: '/user/12345',
  params: {
    foo: 'bar'
  }
});
// => https://test.com/user/12345?foo=bar
```

### Config Defaults

你可以指定默认的配置。默认配置会在所有的请求上生效。目前支持的有

`baseUrl`: 默认路径。

`headers`: 全局响应头。为了使用简便性。只支持原生对象

```js
request.defaults.baseUrl = apiUrl;
```

### 函数参数和响应类型

#### 相同的 config

```js
`url`: 请求路径。

`urlMatch`: 请求动态参数。你可以这样写 request({url: '/path/to/:id/:name', urlMatch: { id:1 ,name: 'hello' }}) => '/path/to/1/hellow'

`skipInterceptor`: 是否跳过拦截器函数。默认为false。
  true-跳过请求和响应拦截器
  request-跳过请求拦截器
  response-跳过响应拦截器

`params`: 请求 query 参数。会拼接在路径后面

`method`: 请求使用的方法，如 GET、POST。

`headers`: 请求的头信息，全局响应头。为了使用简便性。只支持原生对象

`data`: 请求的 body 信息：在FetchApi中可能是一个 Blob、BufferSource、FormData、URLSearchParams 或者 USVString 对象。注意 GET 或 HEAD 方法的请求不能包含 body 信息。在TaroRequest中为一个对象
```

#### function request\<T\>(config: IRequestConfig): Promise\<IResponse\<T\>\>

**IRequestConfig (Fecth Api 请求下参数属性)**

此 config 配置是 Fetch Api 下的请求参数。只有`url`参数是必传的。`method`默认是`GET`。

```js

`mode`: 请求的模式，如 cors、 no-cors 或者 same-origin。

`credentials`: 请求的 credentials，如 omit、same-origin 或者 include。为了在当前域名内自动发送 cookie ， 必须提供这个选项， 从 Chrome 50 开始， 这个属性也可以接受 FederatedCredential 实例或是一个 PasswordCredential 实例。

`cache`: 请求的 cache 模式: default、 no-store、 reload 、 no-cache 、 force-cache 或者 only-if-cached 。

`redirect`: 可用的 redirect 模式: follow (自动重定向), error (如果产生重定向将自动终止并且抛出一个错误）, 或者 manual (手动处理重定向). 在 Chrome 中默认使用 follow（Chrome 47 之前的默认值是 manual）。

`referrer`: 一个 USVString 可以是 no-referrer、client 或一个 URL。默认是 client。

`referrerPolicy`: 指定了 HTTP 头部 referer 字段的值。可能为以下值之一： no-referrer、 no-referrer-when-downgrade、 origin、 origin-when-cross-origin、 unsafe-url 。

`integrity`: 包括请求的 subresource integrity 值 （ 例如： sha256-BpfBw7ivV8q2jLiT13fxDYAe2tJllusRSZ273h2nFSE=）。
```

**IResponse\<T\>**

此相应扩展了[Response](https://developer.mozilla.org/zh-CN/docs/Web/API/Response)对象。

```js
`config`: 请求时的config信息

`data`: 接口返回的数据。

其余属性请点击链接查看
```

#### function request\<T\>(config: ITaroRequestConfig): Promise\<ITaroResponse\<T\>\>. Taro 请求函数

此方法是 Taro 的请求封装。具体参数和响应见下面

**ITaroRequestConfig**

```js
/** 返回的数据格式 */
dataType?: keyof dataType | string
/** 响应的数据类型 */
responseType?: keyof responseType
/** 设置 H5 端是否使用jsonp方式获取数据
 * @default false
 */
jsonp?: boolean
/** 设置 H5 端 jsonp 请求 url 是否需要被缓存
 * @default false
 */
jsonpCache?: boolean
/** 设置 H5 端是否允许跨域请求
 * @default same-origin
 */
mode?: keyof cors_mode
/** 设置 H5 端是否携带 Cookie
 * @default omit
 */
credentials?: keyof credentials
/** 设置 H5 端缓存模式
 * @default default
 */
cache?: keyof cache
/** 设置 H5 端请求响应超时时间
 * @default 2000
 */
timeout?: number
/** 设置 H5 端请求重试次数
 * @default 2
 */
retryTimes?: number
/** 设置 H5 端请求的兜底接口 */
backup?: string | string[]
/** 设置 H5 端请求响应的数据校验函数，若返回 false，则请求兜底接口，若无兜底接口，则报请求失败 */
dataCheck?(): boolean
/** 设置 H5 端请求是否使用缓存
 * @default false
 */
useStore?: boolean
/** 设置 H5 端请求缓存校验的 key */
storeCheckKey?: string
/** 设置 H5 端请求缓存签名 */
storeSign?: string
/** 设置 H5 端请求校验函数，一般不需要设置 */
storeCheck?(): boolean
```

**ITaroResponse**

```js
/** 请求config */
config: ITaroRequestConfig,
/** 开发者服务器返回的数据 */
data: T
/** 开发者服务器返回的 HTTP Response Header */
header: General.IAnyObject
/** 开发者服务器返回的 HTTP 状态码 */
statusCode: number
/** 调用结果 */
errMsg: string
```

### 拦截器

你可以在请求开始和数据响应后进行拦截处理。

```js
request.requestInterceptors.use(config => {
  // 在请求开始前做一些操作。例如修改请求、添加header。打印log等
  // 此处必须返回config
  return config;
});

request.responseInterceptors.use(respones => {
  // 在请求响应之后进行一些操作。需要注意的是。无论接口返回数据成功或是网络是否发生异常。
  // 此回调函数都会被调用。您可以通过判断status或是statusCode来判断请求结果
  // 此处必须返回respones
  return respones;
});
```
