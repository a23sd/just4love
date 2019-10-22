// pages/admin/vip.js
import Toast from '/vant-weapp/toast/toast'
var util = require('../../utils/util.js')
const regeneratorRuntime = require('../../lib/regenerator-runtime/runtime')
const db = wx.cloud.database(); // 初始化数据库
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    pageSize: 10,
    sexIcon: {
      男: 'https://6a75-just4love-c4szp-1300154995.tcb.qcloud.la/icons/man.png?sign=abff0650f97b1a0b325b29cf6101f01b&t=1567868421',
      女: 'https://6a75-just4love-c4szp-1300154995.tcb.qcloud.la/icons/wuman.png?sign=1d4aef60116cdbce534bf4e60849f0dc&t=1567868586'
    },
    recommends: [],
  },
  async getRecommends() {
    try {
      wx.showLoading({
        title: '加载中...',
        mask: true
      })
      var skip = (this.data.page - 1) * this.data.pageSize;
      var size = this.data.pageSize;
      var condition={"status":"申请"};
      db.collection('vip_apply')
        .orderBy('create_date', 'asc')
        .where(condition)
        .skip(skip)
        .limit(size)
        .get().then(res => {
          console.log(res); 
          
          // 数据格式化
          res.data.map(function (obj) {
            obj.create_date = util.formatTime(obj.create_date);
            return obj;
          });
          this.setData({
            page: this.data.page + 1,
            recommends: this.data.recommends.concat(res.data)
          })
        }).catch(err => {
          console.error(err)
        })
      wx.hideLoading()
    } catch (err) {
      console.log(err)
      wx.hideLoading()
      Toast.fail('获取信息失败，请刷新重试')
    }
  },
  windowRefresh:function(){
    this.setData({
      page:1,
      recommends:[]
    })
    this.getRecommends();
  },
  pass: function (event){
    var openid = event.currentTarget.dataset.openid;
    // db.collection('user').where({_openid:openid}).get().then(res=>{
    //   console.log(res);
    // });
    // return false;
    if (!openid) {
      Toast('数据为空');
    } else {
      wx.showLoading({
        title: '提交中',
      })
      wx.cloud.callFunction({
        name: "databaseExecute",
        data: {
          data: { "collection": "user", "where": { _openid: openid }, "update": { data: { vip: true } } }
        }
      }).then(res => {
        wx.cloud.callFunction({
          name: "databaseExecute",
          data: {
            data: { "collection": "vip_apply", "where": { _openid: openid }, "update": { data: { status: "通过" } } }
          }
        }).then(res => {
          // 刷新页面
          console.log(res);
          wx.hideLoading();
          Toast.success('提交成功');
          this.windowRefresh();
          
        }).catch(err => {
          wx.hideLoading();
          Toast.fail('提交失败');
          console.error(err);
        })
      }).catch(err => {
        wx.hideLoading();
        Toast.fail('提交失败');
        console.error(err);
      })
    }
  },
  unpass: function (event) {
    var openid = event.currentTarget.dataset.openid;
    if (!openid) {
      Toast('数据为空');
    } else {
      wx.showLoading({
        title: '提交中',
      })
      wx.cloud.callFunction({
        name: "databaseExecute",
        data: {
          data: { "collection": "vip_apply", "where": { _openid: openid }, "update": { data: { status: "不通过" } } }
        }
      }).then(res => {
        // 刷新页面
        console.log(res);
        wx.hideLoading();
        Toast.success('提交成功');
        this.windowRefresh();
        
      }).catch(err => {
        wx.hideLoading();
        Toast.fail('提交失败');
        console.error(err);
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRecommends();
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
    this.getRecommends()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})