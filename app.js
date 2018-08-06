//app.js
var Bmob = require('utils/Bmob-1.6.2.min.js');
Bmob.initialize("789f6711a42cb8e61a5dde589b559e69", "55e875d5e5ef1476762ad60c5baeacc6");
App({
  onLaunch: function () {
    // 展示本地存储能力
    this.phone = wx.getStorageSync('phone')
    if (this.phone != null && this.phone != '') {
      Bmob.User.login(phone, '123456').then(res => {
        this.level = res.uLevel
        this.school = res.school
        this.address = res.place
      })
    }
    // 登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //   }
    // })
    // // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
  },
  globalData: {
    phone: null,
    level:null,
    school:null,
    address:null
  }
})