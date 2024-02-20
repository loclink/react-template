/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface SilentLoginVo {
  token: string;
}

export interface MemberVo {
  id?: number;
  /** 微信小程序openId */
  openId?: string;
  /** 用户名称 */
  username?: string;
  /** 用户头像 */
  headImg?: string;
  /** 手机号 */
  mobile?: string;
}

export interface MemberDto {
  /** 用户名称 */
  username?: string;
  /** 手机号 */
  mobile?: string;
  /** 用户头像 */
  headImg?: string;
}

export interface CommonResponseVo {
  /**
   * 响应状态码
   * @default 0
   */
  code: number;
  /**
   * 响应信息
   * @default "ok"
   */
  msg: string;
}

export interface AuthControllerSilentLoginParams {
  /** 微信小程序 login code */
  code: string;
}

export interface AuthControllerPhoneNumberLoginParams {
  /** 微信小程序 login code */
  code: string;
}

import TaroRequest, { ITaroRequestConfig } from 'taro-request';

type RequestParams = Omit<ITaroRequestConfig, 'url'>;

/**
 * @title 微信小程序nestjs项目模板
 * @version 0.0.1
 * @license MIT
 * @contact loclink <loclink@163.com> (https://loclink.cn)
 *
 * 微信小程序接口文档
 */

export class Api extends TaroRequest {
  weapp = {
    /**
     * @description 小程序静默授权接口, 入参为小程序调login方法返回的code, 返回token, 小程序客户端若token失效或未保存token则提前调用该接口
     *
     * @tags 用户-授权
     * @name AuthControllerSilentLogin
     * @summary 小程序静默授权
     * @request GET:/weapp/auth/silent
     */
    authControllerSilentLogin: (query: AuthControllerSilentLoginParams, params: RequestParams = {}) =>
      this.request<
        CommonResponseVo & {
          data?: SilentLoginVo;
        }
      >({
        url: `/weapp/auth/silent`,
        method: 'GET',
        params: query,
        format: 'json',
        ...params
      }).then((res) => res.data),

    /**
     * @description 微信用户手机号授权登录, 主动调用
     *
     * @tags 用户-授权
     * @name AuthControllerPhoneNumberLogin
     * @summary 微信手机号授权登录
     * @request GET:/weapp/auth
     * @secure
     */
    authControllerPhoneNumberLogin: (query: AuthControllerPhoneNumberLoginParams, params: RequestParams = {}) =>
      this.request<CommonResponseVo>({
        url: `/weapp/auth`,
        method: 'GET',
        params: query,
        secure: true,
        format: 'json',
        ...params
      }).then((res) => res.data),

    /**
     * No description
     *
     * @tags 用户
     * @name MemberControllerGetUserInfo
     * @summary 获取用户信息
     * @request GET:/weapp/user
     * @secure
     */
    memberControllerGetUserInfo: (params: RequestParams = {}) =>
      this.request<
        CommonResponseVo & {
          data?: MemberVo;
        }
      >({
        url: `/weapp/user`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params
      }).then((res) => res.data),

    /**
     * No description
     *
     * @tags 用户
     * @name MemberControllerUpdateUserInfo
     * @summary 更新用户信息
     * @request PATCH:/weapp/user
     * @secure
     */
    memberControllerUpdateUserInfo: (data: MemberDto, params: RequestParams = {}) =>
      this.request<CommonResponseVo>({
        url: `/weapp/user`,
        method: 'PATCH',
        body: data,
        secure: true,
        format: 'json',
        ...params
      }).then((res) => res.data)
  };
}
