import config from '@/config';
import { atom, useAtom } from 'jotai';

export const tabbarData = atom(config.tabbar);
export const tabbarIndex = atom<number>(0);
export default function useTabbar() {
  const [data, setData] = useAtom(tabbarData);
  const [current, setCurrent] = useAtom(tabbarIndex);

  // function setCount(index: number, count: number) {
  //   setData(
  //     data.map((value, dataIndex) => {
  //       if (index === dataIndex) {
  //         value.count = count;
  //       }
  //       return value;
  //     })
  //   );
  // }

  // function setRedDot(index: number, redHot: boolean) {
  //   setData(
  //     data.map((value, dataIndex) => {
  //       if (index === dataIndex) {
  //         value.redHot = redHot;
  //       }
  //       return value;
  //     })
  //   );
  // }

  return {
    data,
    current,
    setData,
    setCurrentValue: setCurrent
  };
}
