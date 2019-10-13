// pages/user/info.js
import Toast from '/vant-weapp/toast/toast'
const regeneratorRuntime = require('../../lib/regenerator-runtime/runtime')
const user = require('../../db/user.js')
const requirement = require('../../db/requirement.js')
const record = require('../../db/record.js')
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled: false,
    recordid: '',
    openid: '',
    images: [],
    thumbs: [],
    declaration: "",
    username: '',
    wechat: '',
    status: '',
    infoTitle: ["性别", "学历", "生日", "身高", "体重", "工作地", "职业", "收入",  "房车情况", "婚姻情况", "何时结婚", "是否吸烟", "是否喝酒", "是否打牌"],
    info: [],
    requirementTitle: ["年龄", "学历", "身高", "体重", "职业", "收入", "房车情况", "婚姻情况", "何时结婚", "是否吸烟", "是否喝酒", "是否打牌"],
    requirement: [],
    values: {
      "日期": util.getDate(),
      "查看的用户": []
    }
  },

  previewImg: function(event) {
    var index = event.currentTarget.dataset.index
    wx.previewImage({
      current: this.data.images[index],
      urls: this.data.images,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  async getUserInfo(openid) {
    try {
      wx.showLoading({
        title: '加载中...',
        mask: true
      })
      var userInfo = await user.getUserByOpenid(openid)
      const username = userInfo.姓名
      const wechat = userInfo.微信
      const declaration = userInfo.爱情宣言
      var images = ["/images/notfound.jpg"] 
      var thumbs = ["/images/notfound.jpg"] 
      if (userInfo.照片.length > 0 && userInfo.缩略图.length) {
        images = userInfo.照片
        thumbs = userInfo.缩略图
      } 
      delete userInfo._id
      delete userInfo._openid
      delete userInfo.姓名
      delete userInfo.微信
      delete userInfo.爱情宣言
      delete userInfo.照片
      delete userInfo.缩略图
      delete userInfo.enable
      delete userInfo.vip
      this.setData({
        openid: openid,
        info: userInfo,
        username: username,
        wechat: wechat,
        images: images,
        thumbs: thumbs,
        declaration: declaration
      })
      wx.setNavigationBarTitle({
        title: username + "的个人信息"
      })
      var requireInfo = await requirement.getRequirementByOpenid(openid)
      delete requireInfo._id
      delete requireInfo._openid
      this.setData({
        requirement: requireInfo
      })
      wx.hideLoading()
    } catch (err) {
      console.log(err)
      wx.hideLoading()
      this.setData({
        disabled: false
      })
    }
  },


  async getRecord() {
    try {
      await user.getOpenid()
      var recordInfo = await record.getRecord(true)
      const recordid = recordInfo._id
      delete recordInfo._id
      delete recordInfo._openid
      this.setData({
        recordid: recordid,
        values: recordInfo
      })
    } catch (err) {
      console.log(err)
    }
  },

  async updateRecord() {
    try {
      this.setData({
        disabled: true
      })
      await record.updateRecord(this.data.values)
      await record.getRecord(true)
      this.setData({
        disabled: false,
        status: `点击复制微信号：${this.data.wechat}`
      })
    } catch (err) {
      console.log(err)
      this.setData({
        disabled: false
      })
    }
  },

  onClick: function () {
    if (this.data.values.查看的用户.indexOf(this.data.openid) > -1) {
      this.setData({
        status: `点击复制微信号：${this.data.wechat}`
      })
    } 
    else {
      if (this.data.values.查看的用户.length >= 5) {
        Toast('每天最多查看5个微信号')
        return
      }
      this.setData({
        ["values.日期"]: util.getDate(),
        ["values.查看的用户"]: this.data.values.查看的用户.concat(this.data.openid)
      })
      this.updateRecord()
    }
  },

  onClipboard: function () {
    wx.setClipboardData({
      data: this.data.wechat,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      openid: options.openid
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getUserInfo(this.data.openid)
    this.getRecord(true)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.getRecord(true)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    const openid = wx.getStorageSync('openid')
    const path = `pages/user/info?openid=${openid}`
    console.log(path)
    return {
      path: path
    }
  }
})