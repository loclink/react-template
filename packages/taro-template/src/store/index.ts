import { MemberVo } from '@/request/api/http';
import { atom, useAtom } from 'jotai';

export const showAddPopupAtom = atom(false);
export const userInfoAtom = atom<MemberVo>({});

export default function useGlobalStore() {
  const [showAddPopup, setShowAddPopup] = useAtom(showAddPopupAtom);
  const [userInfo, setUserInfo] = useAtom(userInfoAtom);

  return {
    userInfo,
    setUserInfo,
    setShowAddPopup,
    showAddPopup
  };
}
