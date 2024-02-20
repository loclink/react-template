import { tabbarData, tabbarIndex } from '@/custom-tab-bar/store';
import { api } from '@/request';
import useGlobalStore from '@/store';
import { getCurrentInstance } from '@tarojs/runtime';
import Taro, { useDidShow, useLaunch } from '@tarojs/taro';
import { useAtom } from 'jotai';
import { PropsWithChildren, useLayoutEffect, useRef } from 'react';
import './app.scss';

function App({ children }: PropsWithChildren<any>) {
  const { setUserInfo } = useGlobalStore();
  useApp();
  useLaunch(() => {
    api.memberControllerGetUserInfo().then((res) => {
      setUserInfo(res.data || {});
    });
  });

  // children 是将要会渲染的页面
  return children;
}

/**
 * 小程序启动时主体逻辑
 */
function useApp() {
  const [data] = useAtom(tabbarData);
  const [current, setCurrent] = useAtom(tabbarIndex);
  const oldSwitch = useRef(Taro.switchTab);
  // 修复开发环境固定路径编译模式下活跃tabbar显示异常的问题
  useDidShow(() => {
    data.map((item, index) => {
      if (getCurrentInstance().router && item?.pagePath?.includes(getCurrentInstance().router!.path)) {
        setCurrent(index);
      }
      return item;
    });
  });

  /** 复写switchTabbar */
  useLayoutEffect(() => {
    function getExtendSwitchFuntion() {
      return function extendFunction(parameter) {
        const index = data.findIndex((it) => it.pagePath === parameter.url);
        if (index !== -1 && current !== index) {
          setCurrent(index);
        }
        return oldSwitch.current.bind(this)(parameter);
      };
    }

    Taro.switchTab = getExtendSwitchFuntion();
  }, [current, data, setCurrent]);
}
export default App;
