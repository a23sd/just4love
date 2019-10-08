// Pages/user/ignore.js
import Toast from '/vant-weapp/toast/toast'
const regeneratorRuntime = require('../../lib/regenerator-runtime/runtime')
const user = require('../../db/user.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ignores:[],
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
      "爱情宣言": "",
      "心仪": [],
      "屏蔽": [],
      "show": true,
      "enable": true,
      "vip": false,
      "admin": false
    }
  },

  async getIgnores() {
    try {
      wx.showLoading({
        title: '加载中...',
        mask: true
      })
      await user.getOpenid()
      const userInfo = await user.getUser(true)
      const ignores = await user.getIgnore()
      delete userInfo._id
      delete userInfo._openid
      this.setData({
        values: userInfo,
        ignores: ignores
      })
      wx.hideLoading()
    } catch (err) {
      console.log(err)
      wx.hideLoading()
      Toast.fail('获取我的屏蔽失败，请刷新重试')
    }
  },

  async updateUser() {
    try {
      wx.showLoading({
        title: '保存中...',
        mask: true
      })
      await user.getOpenid()
      await user.updateUser(this.data.values)
      await user.getUser(true)
      wx.hideLoading()
      Toast.success('保存成功')
    } catch (err) {
      console.log(err)
      wx.hideLoading()
      Toast.fail('保存失败')
      
    }
  },

  onFavorite: function (event) {
    const index = event.currentTarget.dataset.index
    if (this.data.values.心仪.indexOf(this.data.ignores[index]._openid) > -1) {
      Toast('已经在心仪列表中，无需重复添加')
    } else {
      this.setData({
        ["values.心仪"]: this.data.values.心仪.concat(this.data.ignores[index]._openid),
        [`ignores\[${index}\].心仪`]: true
      });
      this.updateUser()
    }
  },

  onUnFavorite: function (event) {
    const index = event.currentTarget.dataset.index
    if (this.data.values.心仪.indexOf(this.data.ignores[index]._openid) < 0) {
      Toast('不在心仪列表中，移除失败')
    } else {
      this.data.values.心仪.splice(this.data.values.心仪.indexOf(this.data.ignores[index]._openid), 1)
      this.setData({
        [`ignores\[${index}\].心仪`]: false
      });
      this.updateUser()
    }
  },

  onIgore: function (event) {
    const index = event.currentTarget.dataset.index
    if (this.data.values.屏蔽.indexOf(this.data.ignores[index]._openid) > -1) {
      Toast('已经在屏蔽列表中，无需重复添加')
    } else {
      this.setData({
        ["values.屏蔽"]: this.data.values.屏蔽.concat(this.data.ignores[index]._openid),
        [`ignores\[${index}\].屏蔽`]: true
      });
      this.updateUser()
    }
  },

  onUnIgore: function (event) {
    const index = event.currentTarget.dataset.index
    if (this.data.values.屏蔽.indexOf(this.data.ignores[index]._openid) < 0) {
      Toast('不在屏蔽列表中，移除失败')
    } else {
      this.data.values.屏蔽.splice(this.data.values.屏蔽.indexOf(this.data.ignores[index]._openid), 1)
      this.setData({
        [`ignores\[${index}\].屏蔽`]: false
      });
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
    this.setData({
      ignores: []
    })
    this.getIgnores()
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
      ignores: []
    })
    this.getIgnores()
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