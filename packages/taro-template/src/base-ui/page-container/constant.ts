import { NavBarProps } from '@nutui/nutui-react-taro';
import { ViewProps } from '@tarojs/components';
import { ReactNode } from 'react';

export interface PageContainerProps extends ViewProps {
  title?: ReactNode;
  navBarProps?: NavBarProps;
  isSafeArea?: boolean;
  isShowBackIcon?: boolean;
  footer?: ReactNode;
  extra?: ReactNode;
  safeAreaColor?: string;
}
