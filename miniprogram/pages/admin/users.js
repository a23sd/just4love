// pages/admin/users.js
import Toast from '/vant-weapp/toast/toast'
const regeneratorRuntime = require('../../lib/regenerator-runtime/runtime')
const user = require('../../db/user.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageSize: 10,
    fields: ['姓名', '微信', '生日', '学历'],
    order: 'asc',
    users: [],
    type: '',
    keyword: '',
    prompt: '支持：姓名，微信，学历，身高，体重，工作地，职业'
  },

  searchUser: function () {
    user.searchUserByAdmin(this.data.keyword ,this.data.users.length, this.data.pageSize).then(res => {
      this.setData({
        users: this.data.users.concat(res)
      })
    }).catch(err => {
      console.error(err)
    })
  },


  onSearch: function (event) {
    this.setData({
      keyword: event.detail,
      type: 'search',
      users: []
    })
    this.searchUser()
  },

  onVip: function (event) {
    const index = event.currentTarget.dataset.index
    this.setData({
      [`users\[${index}\].vip`]: true
    });
    this.updateUser(this.data.users[index]._id ,{'vip': true})
  },

  onUnVip: function (event) {
    const index = event.currentTarget.dataset.index
    this.setData({
      [`users\[${index}\].vip`]: false
    });
    this.updateUser(this.data.users[index]._id ,{'vip': false})
  },

  onEnable: function (event) {
    const index = event.currentTarget.dataset.index
    this.setData({
      [`users\[${index}\].enable`]: true
    });
    this.updateUser(this.data.users[index]._id ,{'enable': true})
  },

  onDisable: function (event) {
    const index = event.currentTarget.dataset.index
    this.setData({
      [`users\[${index}\].enable`]: false
    });
    this.updateUser(this.data.users[index]._id , {'enable': false})
  },

  getUsers: function() {
    user.getUsers(this.data.users.length, this.data.pageSize).then(res => {
      this.setData({
        users: this.data.users.concat(res)
      })
    }).catch(err => {
      console.error(err)
    })
  },

  async updateUser(id, values) {
    try {
      wx.showLoading({
        title: '保存中...',
        mask: true
      })
      await wx.cloud.callFunction({
        name: 'updateUser',
        data: {
          id: id,
          values: values
        },
        success: res => {
          console.log('更新数据成功')
        }
      })
      wx.hideLoading()
      Toast.success('保存成功')
    } catch (err) {
      console.log(err)
      wx.hideLoading()
      Toast.fail('保存失败')
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      type: '',
      users: []
    })
    this.getUsers()
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
    this.setData({
      keyword: '',
      type: '',
      users: []
    })
    this.getUsers()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.type === 'search'){
      this.searchUser()
    }
    else{
      this.getUsers()
    }
  }
})