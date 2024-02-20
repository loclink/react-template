import { RecordPopupProps } from '@/components/record-popup/constants';
import useGlobalStore from '@/store';
import { Grid, Image, NumberKeyboard, Popup, Tabs } from '@nutui/nutui-react-taro';
import { Text, View } from '@tarojs/components';
import classNames from 'classnames';
import React, { memo, useState } from 'react';
import styles from './index.module.scss';
import './index.scss';

const Component: React.FC<RecordPopupProps> = (props) => {
  const { setShowAddPopup, showAddPopup } = useGlobalStore();
  const [tabValue, setTabValue] = useState<string | number>(0);
  const [typeActive, setTypeActive] = useState<number>();
  return (
    <Popup
      closeable
      position='bottom'
      title='收支速记'
      style={{ height: '90vh', maxHeight: '90vh', borderRadius: '10px' }}
      visible={showAddPopup}
      onClose={() => {
        setShowAddPopup(false);
      }}
    >
      <View className={styles.recordTypePanel}>
        <Tabs
          className='recordTabs'
          value={tabValue}
          onChange={(value) => {
            setTabValue(value);
          }}
          activeType='smile'
        >
          <Tabs.TabPane title='支出'>
            <Grid gap={10}>
              {new Array(16).fill('').map((item, index) => {
                return (
                  <Grid.Item
                    key={index}
                    text={<Text>购物</Text>}
                    className={classNames({ active: index === typeActive })}
                    onClick={() => setTypeActive(index)}
                  >
                    <Image />
                  </Grid.Item>
                );
              })}
            </Grid>
          </Tabs.TabPane>
          <Tabs.TabPane title='收入' disabled>
            Tab 2
          </Tabs.TabPane>
        </Tabs>
      </View>
      <NumberKeyboard
        overlayClassName={styles.numberKeyboardOverlay}
        visible
        style={{ height: '530rpx' }}
        type='rightColumn'
        title={<View>asdasd</View>}
        custom={['.', '']}
        onChange={() => {}}
        onDelete={() => {}}
      />
    </Popup>
  );
};
const RecordPopup = memo(Component);
export default RecordPopup;
