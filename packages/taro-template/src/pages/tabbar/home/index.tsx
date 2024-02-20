import PageContainer from '@/base-ui/page-container';
import RecordPopup from '@/components/record-popup';
import useGlobalStore from '@/store';
import React, { memo, useEffect } from 'react';
import styles from './index.module.scss';

const Component: React.FC = () => {
  // api['/auth/silent_GET']({code: 'asd'}).then(res => res.data?.token)
  const { setShowAddPopup, showAddPopup } = useGlobalStore();
  useEffect(() => {}, []);

  return <PageContainer className={styles.homeWrapper} title='账单' extra={<RecordPopup />}></PageContainer>;
};

const HomePage = memo(Component);
export default HomePage;

/**
 * 定义页面配置，需要注意的是，使用 definePageConfig 定义的页面配置对象不能使用变量。
 * 参考: https://docs.taro.zone/docs/page-config#配置项列表
 */
definePageConfig({
  disableScroll: true
});
