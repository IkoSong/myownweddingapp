var api = require('../../api/api.js')
//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    animationData: "",
    music_url: '',
    isPlayingMusic: true,
    hetel:"15158388218",
    shetel:"15715808308"
  },
  onLoad: function () {
//创建动画
    var animation = wx.createAnimation({

      duration: 3600,
      timingFunction: "ease",
      delay: 600,
      transformOrigin: "50% 50%",

    })


    animation.scale(0.9).translate(10, 10).step(); //边旋转边放大


    //导出动画数据传递给组件的animation属性。
    this.setData({
      animationData: animation.export(),
    })

    var that = this
    // wx.showLoading({ //期间为了显示效果可以添加一个过度的弹出框提示“加载中”
    //   title: '加载中',
    //   icon: 'loading',
    // });
    // wx.request({
    //   url: api.host,
    //   method: 'GET',
    //   data: {
    //   },
    //   header: {
    //     'Accept': 'application/json'
    //   },
    //   success: function(res) {
    //     // console.log(res.data)
    //     wx.hideLoading();
    //     wx.playBackgroundAudio({
    //       dataUrl: res.data.music,
    //       title: '',
    //       coverImgUrl: ''
    //     })
    //     wx.setStorage({
    //       key: 'main',
    //       data: res.data,
    //     })
    //
    //     that.setData({
    //       mainInfo: res.data,
    //       music_url: res.data.music
    //     });
    //   }
    // })
    //

    //
    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse){
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   })
    // }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  callhe: function(event) {
    wx.makePhoneCall({
      //TODO
      phoneNumber: this.data.hetel
    })
  },
  callshe: function(event) {
    wx.makePhoneCall({
      phoneNumber: this.data.shetel
    })
  },
})
