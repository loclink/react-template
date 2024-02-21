import PageContainer from '@/base-ui/page-container';
import useGlobalStore from '@/store';
import { Avatar, Button, Cell, Input } from '@nutui/nutui-react-taro';
import { View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import React, { memo } from 'react';
import styles from './index.module.scss';

const Component: React.FC = () => {
  const { userInfo } = useGlobalStore();
  const handleUsernameEdit = (detail) => {
    console.log(detail);
  };
  const onChooseAvatar = (event) => {
    const token = Taro.getStorageSync('token');
    Taro.uploadFile({
      url: 'http://localhost:3000/weapp/upload',
      filePath: event.detail.avatarUrl,
      name: 'file',
      header: {
        Authorization: token
      }
    });
  };
  return (
    <PageContainer
      title='用户信息'
      safeAreaColor='#fff'
      footer={
        <View
          style={{
            height: '100rpx',
            backgroundColor: '#fff',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Button type='info' size='large' style={{ width: '80%' }}>
            保存
          </Button>
        </View>
      }
    >
      <View className={styles.userInfoWrapper}>
        <Cell.Group>
          <Cell
            title='头像'
            extra={
              <View style={{ position: 'relative' }}>
                <Avatar />
                <Button
                  openType='chooseAvatar'
                  style={{ opacity: 0, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                  onChooseAvatar={onChooseAvatar}
                />
              </View>
            }
            align='center'
          />
          <Cell
            title='用户名'
            extra={
              <Input
                style={{ padding: 0 }}
                align='right'
                placeholder='请输入用户名'
                value={userInfo.username}
                type='nickname'
                onBlur={handleUsernameEdit}
              />
            }
            align='center'
          />
          <Cell
            title='手机号'
            extra={<Input style={{ padding: 0 }} align='right' value={userInfo.mobile} />}
            align='center'
          />
        </Cell.Group>
      </View>
    </PageContainer>
  );
};

const UserInfo = memo(Component);
export default UserInfo;

/**
 * 定义页面配置，需要注意的是，使用 definePageConfig 定义的页面配置对象不能使用变量。
 * 参考: https://docs.taro.zone/docs/page-config#配置项列表
 */
definePageConfig({
  disableScroll: true
});
