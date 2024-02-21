import config from '@/config';
import { tabbarIndex } from '@/custom-tab-bar/store';
import useGlobalStore from '@/store';
import { Tabbar } from '@nutui/nutui-react-taro';
import { Image, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useAtom } from 'jotai';
import React, { memo } from 'react';
import './index.scss';

const Component: React.FC = () => {
  const [currentIndex] = useAtom(tabbarIndex);
  const { setShowAddPopup } = useGlobalStore();
  return (
    <>
      <Tabbar
        className='customTabbarWrapper'
        safeArea
        style={
          {
            '--nutui-tabbar-height': `${config.tabbarHeight}rpx`
          } as any
        }
        defaultValue={0}
        value={currentIndex}
        onSwitch={(value) => {
          if (value === 1) setShowAddPopup(true);
          // -------------------------
          if (config.tabbar[value]?.pagePath) Taro.switchTab({ url: config.tabbar[value]!.pagePath! });
        }}
      >
        {config.tabbar.map((item, index) => {
          return (
            <Tabbar.Item
              className='tabbarItem'
              key={index}
              title={
                <View
                  style={{
                    fontSize: item.fontSize || '14px',
                    color: index === currentIndex ? item.activeTextColor : item.textColor,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%'
                  }}
                >
                  {item.iconFont ? (
                    <item.iconFont size={item.iconSize} style={{ ...item.style }} />
                  ) : (
                    <>
                      <Image
                        src={item.icon}
                        style={{
                          width: item.iconSize,
                          height: item.iconSize,
                          visibility: currentIndex === index ? 'hidden' : 'initial',
                          position: currentIndex === index ? 'absolute' : 'relative',
                          ...item.style
                        }}
                      />
                      <Image
                        src={item.activeIcon}
                        style={{
                          width: item.iconSize,
                          height: item.iconSize,
                          visibility: currentIndex !== index ? 'hidden' : 'initial',
                          position: currentIndex !== index ? 'absolute' : 'relative',
                          ...item.style
                        }}
                      />
                    </>
                  )}

                  {item.text}
                </View>
              }
            />
          );
        })}
      </Tabbar>
    </>
  );
};
const CustomTabbar = memo(Component);
export default CustomTabbar;
