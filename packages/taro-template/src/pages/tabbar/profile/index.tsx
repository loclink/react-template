import PageContainer from '@/base-ui/page-container';
import useGlobalStore from '@/store';
import { Avatar } from '@nutui/nutui-react-taro';
import { View } from '@tarojs/components';
import React, { memo, useEffect } from 'react';
import styles from './index.module.scss';

const Component: React.FC = () => {
  const { userInfo } = useGlobalStore();

  useEffect(() => {
    console.log(userInfo);
  }, [userInfo]);

  return (
    <PageContainer title='我的'>
      <View className={styles.profileWrapper}>
        <Avatar size='large' />
      </View>
    </PageContainer>
  );
};

const Profile = memo(Component);
export default Profile;

/**
 * 定义页面配置，需要注意的是，使用 definePageConfig 定义的页面配置对象不能使用变量。
 * 参考: https://docs.taro.zone/docs/page-config#配置项列表
 */
definePageConfig({
  disableScroll: true
});
