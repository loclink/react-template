import Taro, { getSystemInfoSync as TaroGetSystemInfoSync } from '@tarojs/taro';

let systemInfo: any;
export function getSystemInfoSync() {
  if (systemInfo == null) {
    systemInfo = TaroGetSystemInfoSync();
  }
  return systemInfo;
}
export function getMenuButtonBoundingClientRect() {
  if (process.env.TARO_ENV === 'weapp') {
    return Taro.getMenuButtonBoundingClientRect();
  }
  return {
    bottom: 56,
    height: 32,
    left: 278,
    right: 365,
    top: 24,
    width: 87
  };
}
