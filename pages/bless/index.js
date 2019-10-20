// pages/chat/index.js
var api = require('../../api/api.js')
const app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    inputValue: '',
    name: '',
    tel: '',
    num:'',
    auth: false,
    msgSta: false,
    signSta: false,
    come:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    let userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.setData({
        auth: true,
        userInfo: userInfo
      })
    }
    wx.showLoading({ //期间为了显示效果可以添加一个过度的弹出框提示“加载中”
      title: '加载中',
      icon: 'loading',
    });
    wx.request({
      url: api.getbless,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        wx.hideLoading();
        console.log(res.data)
        that.setData({
          // mainInfo: res.data.mainInfo,
          chatList: res.data.data,
          chatNum: res.data.data.length,
        });
      }
    })
  },
  leaveMsg: function() {
    this.setData({
      msgSta: true,
      signSta: false
    })
  },
  signIn: function() {
    this.setData({
      signSta: true,
      msgSta: false
    })
  },
  cancelMsg: function() {
    this.setData({
      signSta: false,
      msgSta: false,
      come:false
    })
  },
  comeWedding:function(){
    this.setData({
      come:true
    })
  },

  bindKeyInput: function(e) {
    this.setData({
      inputValue: e.detail.value
    })

  },
  numInput:function(e){
    this.setData({
      num: e.detail.value
    })
  },
  nameInput: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  telInput: function (e) {
    this.setData({
      tel: e.detail.value
    })
  },


  bindgetuserinfo: function(e) {
    console.log(e.detail.userInfo)
    var that = this;
    if (e.detail.userInfo) {
      wx.setStorageSync('userInfo', e.detail.userInfo)
      that.setData({
        userInfo: e.detail.userInfo,
        auth: true
      })
      console.log(1, e.detail.userInfo)
      //that.foo()

    } else {
      wx.showToast({
        title: "为了您更好的体验,请先同意授权",
        icon: 'none',
        duration: 2000
      });
    }
  },
  foo: function() {
    var that = this
    console.log(2, that.data.inputValue)
    if (that.data.come || that.data.inputValue) {
      //留言内容不是空值

      var userInfo = that.data.userInfo;
      var name = userInfo.nickName;
      var face = userInfo.avatarUrl;
      var words = that.data.inputValue;
      var realName = this.data.name;
      var come = this.data.come;
      if (come && realName == '') {
        wx.showToast({
          title: '请填写您的姓名',
          icon: 'none'
        })
        return;
      }
      var tel = this.data.tel;
      if (come && tel == '') {
        wx.showToast({
          title: '请填写您的电话',
          icon: 'none'
        })
        return;
      }
      if(come){
        var reg_tel = new RegExp('^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\\d{8}$');
        if (!reg_tel.test(tel)) {
          wx.showToast({
            title: '请填写正确的手机号码',
            icon: 'none'
          })
          return;
        }
      }
     
      var num = this.data.num;
      if(come){
        var reg_num = new RegExp('^\\d+$');
        if (!reg_num.test(num)) {
          wx.showToast({
            title: '请填写正确的出席人数',
            icon: 'none'
          })
          return;
        }
      }

      wx.request({
        url: api.sendbless,
        data: {
          'nickname': name,
          'face': face,
          'words': words,
          'realName':realName,
          'tel':tel,
          'num':num,
          'isCome':come
        },
        header: {},
        method: "POST",
        dataType: "json",
        success: res => {
          console.log(res.data);
          if (res.data.code == 0) {
            that.setData({
              chatList: res.data.data,
              chatNum: res.data.data.length,
              inputValue: '',
              name: '',
              tel: '',
              num: ''
            });
            this.cancelMsg
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false
            })
            this.cancelMsg()
          } else {
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false
            })
          }
        }
      })
    } else {
      //Catch Error0
      wx.showToast({
        title: '您还没有填写内容',
        icon: 'none'
      })
      return;
    }
    that.setData({
      inputValue: '', //将data的inputValue清空
      name: '',
      tel: '',
      num: ''
    });
    return;
  }
})