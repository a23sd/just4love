// pages/admin/notice.js
import Toast from '/vant-weapp/toast/toast'
const regeneratorRuntime = require('../../lib/regenerator-runtime/runtime')
const notice = require('../../db/notice.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled: false,
    notice: ''
  },

  onChange: function (event) {
    console.log(event.detail);
    this.setData({
      notice: event.detail
    })
  },

  onSubmit: function (event) {
    if (this.data.notice.trim().length === 0) {
      Toast('请填写后再提交')
    }
    else {
      
      console.log("===============submit notice==============");
      console.log(this.data.notice)
      this.submitNotice()
    }
  },

  async submitNotice() {
    try {
      this.setData({
        disabled: true
      })
      wx.showLoading({
        title: '发布中...',
        mask: true
      })
      await notice.addNotice(this.data.notice)
      wx.hideLoading()
      this.setData({
        disabled: false
      })
      Toast.success('发布成功')
    } catch (err) {
      console.log(err)
      wx.hideLoading()
      this.setData({
        disabled: false
      })
      Toast.fail('发布失败')
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})