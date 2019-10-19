//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  markertap(e) {
    var lng = "121.291900"
    var lat = "29.693090"
    wx.openLocation({
      latitude: parseFloat(lat),
      longitude: parseFloat(lng),
      scale: 18,
      name: "溪口龙飞大酒店",
      address: "浙江省宁波市奉化区溪口镇中兴东路563号 "
    })
  },
  onLoad: function () {
    var that = this
    //地图信息
    var lng = "121.291900"
    var lat = "29.693090"

    // var lng = res.data.mainInfo.lng
    // var lat = res.data.mainInfo.lat
    that.setData({
      lng: lng, // 全局属性，用来取定位坐标
      lat: lat,
      markers: [{
        iconPath: "/images/map/location.png",
        id: 0,
        latitude: lat, // 页面初始化 options为页面跳转所带来的参数 
        longitude: lng,
        width: 22,
        height: 31
      }],
    });
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
