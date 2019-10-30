// pages/user/blacklist.js
import Toast from '/vant-weapp/toast/toast'
const regeneratorRuntime = require('../../lib/regenerator-runtime/runtime')
const user = require('../../db/user.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageSize: 10,
    users: []
  },


  getBlackList: function () {
    user.getBlackList(this.data.users.length, this.data.pageSize).then(res => {
      this.setData({
        users: this.data.users.concat(res)
      })
    }).catch(err => {
      console.error(err)
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      users: []
    })
    this.getBlackList()
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
    this.setData({
      users: []
    })
    this.getBlackList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      users: []
    })
    this.getBlackList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})