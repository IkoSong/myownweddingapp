var api = require('../../api/api.js')
//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    picList:[],
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  onLoad: function() {
    var that = this

    wx.showLoading({ //期间为了显示效果可以添加一个过度的弹出框提示“加载中”
      title: '加载中',
      icon: 'loading',
    });
    wx.request({
      url: api.photo,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {

        wx.hideLoading();
        that.setData({
          picList: res.data.data
        });
      }
    })
  },

  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  previewImage: function(e) {
    var imgsurl = []
    var imgObj = this.data.picList
    for (var i = 0; i < imgObj.length; i++) {
      imgsurl[i] = imgObj[i]['url']
    }
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: imgsurl // 需要预览的图片http链接列表
    })
  },
})
