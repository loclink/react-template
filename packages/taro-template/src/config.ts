import { AddCircle, Agenda, User } from '@nutui/icons-react-taro';

export default {
  tabbarHeight: 140,
  tabbar: [
    {
      text: '账单',
      pagePath: '/pages/tabbar/home/index',
      iconFont: Agenda,
      icon: '',
      activeIcon: '',
      iconSize: 20,
      fontSize: 14,
      textColor: '#8a8a8a',
      activeTextColor: '#1296db'
    },
    {
      iconFont: AddCircle,
      icon: '',
      activeIcon: '',
      iconSize: 60,
      textColor: '#1296db',
      style: {}
    },
    {
      text: '我的',
      pagePath: '/pages/tabbar/profile/index',
      icon: User,
      activeIcon: User,
      iconFont: User,
      iconSize: 20,
      fontSize: 14,
      textColor: '#8a8a8a',
      activeTextColor: '#1296db'
    }
  ]
};
