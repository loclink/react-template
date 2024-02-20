import { PageContainerProps } from '@/base-ui/page-container/constant';
import config from '@/config';
import { ArrowLeft } from '@nutui/icons-react-taro';
import { NavBar } from '@nutui/nutui-react-taro';
import { View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classNames from 'classnames';
import React, { PropsWithChildren } from 'react';
import styles from './index.module.scss';
import { getMenuButtonBoundingClientRect, getSystemInfoSync } from './utils';

export const PageContainer = (props: PropsWithChildren<PageContainerProps>) => {
  const { title, navBarProps, className, isSafeArea = true, isShowBackIcon = true, footer, extra } = props;
  const isTab = !!config.tabbar.find((item) => item.pagePath?.includes(Taro.getCurrentPages()[0].route || ''));

  const handleRenderIcon = () => {
    if (isShowBackIcon && !isTab) {
      return <ArrowLeft />;
    } else {
      return null;
    }
  };

  return (
    <View className={classNames([styles.pageContainerWrapper, className])}>
      <View style={{ height: statusBarHeight, flexShrink: 0 }} />
      <NavBar
        className={styles.pageContainerNavbar}
        style={{
          backgroundColor: '#fff',
          height: (menuButtonInfo.top - statusBarHeight) * 2 + menuButtonInfo.height,
          flexShrink: 0,
          marginBottom: 0
        }}
        left={handleRenderIcon()}
        {...navBarProps}
      >
        {title}
      </NavBar>
      <View className={styles.contentWrapper}>
        {/* <ScrollView className='content' {...scrollViewProps} scrollY={isScroll}>
        </ScrollView> */}
        {props.children}
      </View>

      {/* <EasyScroll className="content">{props.children}</EasyScroll> */}
      <View className={styles.pageContentFooter}>{footer}</View>
      {isTab && <View className={styles.tabbarSpace} />}
      {isSafeArea && <View className={styles.safeArea} />}
      <View style={{ flexShrink: 0 }}>{extra}</View>
    </View>
  );
};

const { statusBarHeight: _statusBarHeight } = getSystemInfoSync();
const menuButtonInfo = getMenuButtonBoundingClientRect();
const statusBarHeight = Number.isNaN(_statusBarHeight) ? 22 : _statusBarHeight;
const navBarHeight = (menuButtonInfo.top - statusBarHeight) * 2 + menuButtonInfo.height + statusBarHeight;

PageContainer.NavBarHeight = navBarHeight;
PageContainer.Context = React.createContext<any>({});

export default PageContainer;
