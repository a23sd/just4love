// pages/user/declaration.js
import Toast from '/vant-weapp/toast/toast'
const regeneratorRuntime = require('../../lib/regenerator-runtime/runtime')
const user = require('../../db/user.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled: false,
    values: {
      "姓名": "",
      "微信": "",
      "性别": "请选择",
      "生日": "请选择",
      "学历": "请选择",
      "身高": "请选择",
      "体重": "请选择",
      "籍贯": "请选择",
      "工作地": "请选择",
      "职业": "请选择",
      "收入": "请选择",
      "房车情况": "请选择",
      "婚姻情况": "请选择",
      "何时结婚": "请选择",
      "是否吸烟": "请选择",
      "是否喝酒": "请选择",
      "是否打牌": "请选择",
      "照片": [],
      "缩略图": [],
      "照片数量": 0,
      "爱情宣言": "",
      "心仪": [],
      "屏蔽": [],
      "show": true,
      "enable": true,
      "vip": false,
      "admin": false
    }
  },

  onChange: function (event) {
    console.log(event.detail);
    this.setData({
      ["values.爱情宣言"]: event.detail
    });
  },

  async getUser() {
    try {
      this.setData({
        disabled: true
      })
      wx.showLoading({
        title: '加载中...',
        mask: true
      })
      await user.getOpenid()
      var userInfo = await user.getUser(true)
      delete userInfo._id
      delete userInfo._openid
      this.setData({
        values: userInfo
      })
      wx.hideLoading()
      this.setData({
        disabled: false
      })
      if (this.data.values.照片.length < 1) {
        Toast('请尽快上传照片')
      }
    } catch (err) {
      console.log(err)
      wx.hideLoading()
      this.setData({
        disabled: false
      })
      Toast.fail('获取用户信息失败，请刷新重试')
    }
  },

  async updateUser() {
    try {
      this.setData({
        disabled: true
      })
      wx.showLoading({
        title: '保存中...',
        mask: true
      })
      await user.getOpenid()
      await user.updateUser(this.data.values)
      await user.getUser(true)
      wx.hideLoading()
      this.setData({
        disabled: false
      })
      Toast.success('保存成功')
    } catch (err) {
      console.log(err)
      wx.hideLoading()
      this.setData({
        disabled: false
      })
      Toast.fail('保存失败')
    }
  },

  onSubmit: function (event) {
    if (this.data.values.爱情宣言 === '') {
      Toast('请填写后再提交')
    }
    else {
      console.log("===============submit declaration==============");
      console.log(this.data.values)
      this.updateUser()
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getUser()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getUser()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      path: "pages/recommend/recommend"
    }
  }
})