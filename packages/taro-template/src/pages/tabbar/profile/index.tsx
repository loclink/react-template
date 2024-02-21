import PageContainer from '@/base-ui/page-container';
import RecordPopup from '@/components/record-popup';
import useGlobalStore from '@/store';
import { ArrowRight, Edit } from '@nutui/icons-react-taro';
import { Avatar, Cell } from '@nutui/nutui-react-taro';
import { View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import React, { memo, useEffect } from 'react';
import Router from 'tarojs-router-next';
import styles from './index.module.scss';

const Component: React.FC = () => {
  const { userInfo } = useGlobalStore();

  useEffect(() => {
    console.log(userInfo);
  }, [userInfo]);

  const handleEditUserInfo = () => {
    Router.profile.toUserInfo();
  };

  return (
    <PageContainer title='我的' extra={<RecordPopup />}>
      <View className={styles.profileWrapper}>
        <View className={styles.userInfoPanel}>
          <Avatar size='large' src={userInfo.headImg} onClick={handleEditUserInfo} />
          <View className={styles.username} onClick={handleEditUserInfo}>
            {userInfo.username || '微信用户'}
            <Edit size={14} style={{ marginLeft: '4px', marginTop: 'auto', marginBottom: '3px' }} />
          </View>
        </View>

        <Cell.Group className={styles.menuWrapper}>
          <Cell
            title='关于作者'
            extra={<ArrowRight />}
            onClick={() => {
              Taro.showToast({
                title: 'by.loclink v0.0.1',
                icon: 'none'
              });
            }}
          />
          {/* <Cell title='版本号' extra='v0.0.1' /> */}
        </Cell.Group>
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
