// Pages/suggest/suggest.js
import Toast from '/vant-weapp/toast/toast';
const db = wx.cloud.database(); // 初始化数据库
Page({

  /**
   * 页面的初始数据
   */
  data: {
    message: ""
  },

  onChange: function (event) {
    this.setData({
      message: event.detail
    });
  },

  onSubmit: function (event) {
    wx.showLoading({
      title: '提交中',
    })
    // 插入数据
    console.log(this.data.message)
    if (this.data.message){
      db.collection('suggest').add({
        data: { 建议: this.data.message }
      }).then(res => {
        wx.hideLoading();
        Toast.success('提交成功');
        console.log(res.data);
      }).catch(err => {
        wx.hideLoading();
        Toast.fail('提交失败');
        console.error(err);
      })
    } else{
      wx.hideLoading();
      Toast('内容不能为空');
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    const openid = wx.getStorageSync('openid')
    const path = `pages/user/info?openid=${openid}`
    console.log(path)
    return {
      path: path
    }
  }
})