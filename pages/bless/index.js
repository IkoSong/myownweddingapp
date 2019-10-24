// pages/chat/index.js
var api = require('../../api/api.js')
const app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    openId:'',
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
    let openId = wx.getStorageSync('openId')
    if (userInfo && openId) {
      this.setData({
        auth: true,
        userInfo: userInfo,
        openId:openId
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
  onPullDownRefresh: function () {
    wx.showToast({
      title: '正在刷新数据...',
      icon: 'loading',
      duration: 2000
    });
    this.onLoad();//再重新加载数据
    wx: wx.stopPullDownRefresh();//停止刷新操作
  },

  bindgetuserinfo: function(e) {
    console.log(e.detail.userInfo)
    var that = this;
    let openId = wx.getStorageSync('openId')
    let userInfo = e.detail.userInfo
    if (userInfo) {
      if (!openId){
        wx.login({
          success: function (res) {
            var code = res.code;//登录凭证
            if (code) {
              //2、调用获取用户信息接口
              console.log({ encryptedData: e.detail.encryptedData, iv: e.detail.iv, code: code })
                  //3.请求自己的服务器，解密用户信息 获取unionId等加密信息
                  wx.request({
                    url: api.loginWX,//自己的服务接口地址
                    method: 'get',
                    header: {
                      "Content-Type": "applciation/json"
                    },
                    data: { encryptedData: e.detail.encryptedData, iv: e.detail.iv, code: code },
                    success: function (data) {
                      //4.解密成功后 获取自己服务器返回的结果
                      if (data.data.status == 1) {
                        openId = data.data.userInfo.openId
                        that.setData({
                          openId: openId,
                          auth: true
                        })
                        wx.setStorageSync('openId', openId)
                      } else {
                        console.log('解密失败')
                      }
                    },
                    fail: function () {
                      console.log('系统错误')
                    }
                  })
             
            } else {
              console.log('获取用户登录态失败！' + r.errMsg)
            }
          },
          fail: function () {
            console.log('登陆失败')
          }
        })
      }
      wx.setStorageSync('userInfo', userInfo)
      that.setData({
        userInfo: userInfo
       
      })
      console.log(1, userInfo)
      //that.foo()

    } else {
      wx.showToast({
        title: "为了您更好的体验,请先同意授权",
        icon: 'none',
        duration: 2000
      });
    }
  },
  foo: function(e) {
    var that = this
    var formId = e.detail.formId

    console.log(2, that.data.inputValue)
    if (that.data.come || that.data.inputValue) {
      //留言内容不是空值
      var userInfo = that.data.userInfo;
      var name = userInfo.nickName;
      var face = userInfo.avatarUrl;
      var words = that.data.inputValue;
      var realName = that.data.name;

      var openId = that.data.openId;
      var come = that.data.come;
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
      wx.showLoading({ //期间为了显示效果可以添加一个过度的弹出框提示“加载中”
        title: '加载中',
        icon: 'loading',
      });
      wx.request({
        url: api.sendbless,
        data: {
          'nickname': name,
          'face': face,
          'words': words,
          'realName':realName,
          'tel':tel,
          'num':num,
          'isCome':come,
          'openId':openId,
          'formId':formId
        },
        header: {},
        method: "POST",
        dataType: "json",
        success: res => {
          console.log(res.data);
          wx.hideLoading();
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