export default defineAppConfig({
  pages: ["pages/tabbar/home/index", "pages/tabbar/profile/index"],
  window: {
    navigationStyle: 'custom',
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: { "custom": true, "list": [{ "text": "home", "pagePath": "pages/tabbar/home/index" }, { "text": "profile", "pagePath": "pages/tabbar/profile/index" }] },
  subPackages: [{ "root": "pages-sub/profile", "pages": ["userInfo/index"] }]
});
