// pages/admin/invitationcode.js
import Toast from '/vant-weapp/toast/toast'
const util = require('../../utils/util.js')
const invitaitoncode = require('../../db/invitaitoncode.js')
const regeneratorRuntime = require('../../lib/regenerator-runtime/runtime')
// 生成uuid
console.log(util.uuid());
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled: false,
    num: '',
    list: [],
    result: []
  },

  onChange: function(event) {
    this.setData({
      result: event.detail
    })
  },

  onNumChange: function(event) {
    this.setData({
      num: event.detail
    })
  },

  onGenCodes: function() {
    if (this.data.num === '') {
      Toast('输入不能为空，请重新输入')
      return
    }
    if (this.data.num > 50) {
      Toast('一次最多生成100个邀请码失败，请分批生成')
      return
    }
    this.createInvitaitonCode()
  },

  async getInvitaitonCode() {
    try {
      wx.showLoading({
        title: '加载中...',
        mask: true
      })
      const codes = await invitaitoncode.getInvitaitonCode(true)
      console.log(codes)
      this.setData({
        list: codes
      })
      wx.hideLoading()
    } catch (err) {
      console.log(err)
      wx.hideLoading()
      Toast.fail('获取邀请码失败，请刷新重试')
    }
  },

  async createInvitaitonCode() {
    try {
      this.setData({
        disabled: true
      })
      wx.showLoading({
        title: '生成中...',
        mask: true
      })
      await invitaitoncode.createInvitaitonCode(this.data.num)
      const codes = await invitaitoncode.getInvitaitonCode(true)
      this.setData({
        disabled: false,
        list: codes
      })
      wx.hideLoading()
    } catch (err) {
      console.log(err)
      wx.hideLoading()
      this.setData({
        disabled: false
      })
      Toast.fail('生成邀请码失败')
    }
  },

  onShare: function() {
    if (this.data.result.length > 0) {
      wx.setClipboardData({
        data: "下面的邀请码有效期3小时，请尽快使用：\n\n"+ this.data.result.join('\n\n'),
        success: function(res) {
          wx.getClipboardData({
            success: function(res) {
              wx.showToast({
                title: '复制成功'
              })
            }
          })
        }
      })
    } else {
      Toast('请先选择邀请码')
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
    this.getInvitaitonCode()
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
    this.getInvitaitonCode()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  }
})