// pages/apply/vip.js
import Toast from '/vant-weapp/toast/toast';
const db = wx.cloud.database(); // 初始化数据库
const _ = db.command;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:"",
    notes:"",
    status:"申请"
  },
  onChange:function(event){
    this.setData({
      notes: event.detail
    })
  },
  onSubmit: function (event) {
    // 插入数据
    console.log(this.data.notes)
    if (!this.data.notes) {
      Toast('内容不能为空');
    } else {
      wx.showLoading({
        title: '提交中',
      })
      if (this.data.id){
        wx.cloud.callFunction({
          name:"databaseExecute",
          data:{
            data: { "collection": "vip_apply", "where": { _id: this.data.id }, "update": { data:{notes: this.data.notes, write_date: db.serverDate() }}}
          }
        }).then(res => {
          wx.hideLoading();
          Toast.success('提交成功');
          console.log(res);
        }).catch(err => {
          wx.hideLoading();
          Toast.fail('提交失败');
          console.error(err);
        })
      }else{
        //db.collection('vip_apply').add({
        //  data: { notes: this.data.notes, status: this.data.status, create_date: db.serverDate(), write_date: db.serverDate() }
        //})
        // 获得用户的_openid
        var user = wx.getStorageSync('userInfo');
        console.log(user);
        console.log(user['姓名']); console.log(2);
        wx.cloud.callFunction({
          name: "databaseExecute",
          data: {
            data: { "collection": "vip_apply", "add": { data: { true_name: user['姓名'], sex: user['性别'], notes: this.data.notes, status: this.data.status } } }
          }
        }).then(res => {
          wx.hideLoading();console.log(6677);
          Toast.success('提交成功');
          console.log(res);
          this.setData({ id: res.result._id})
        }).catch(err => {
          wx.hideLoading();
          Toast.fail('提交失败');
          console.error(err);
        })
      }
      
    }
  },
  againApply:function(){
    // wx.showLoading({
    //   title: '提交中',
    // })
    if (this.data.id) {
      wx.cloud.callFunction({
        name: "databaseExecute",
        data: {
          data: { "collection": "vip_apply", "where": { _id: this.data.id }, "update": { data: { status: "注销"} } }
        }
      }).then(res => {
        this.setData({ id: "",status:"申请" })
        // wx.hideLoading();
        // Toast.success('提交成功');
        console.log(res);
      }).catch(err => {
        // wx.hideLoading();
        Toast.fail('提交失败');
        console.error(err);
      })
  }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    db.collection('vip_apply').where({
      status: _.in(["申请", "通过", "不通过"])
    }).orderBy('create_date', 'desc').limit(1).get().then(res => {
      this.setData({
        id: res.data[0]._id,
        notes: res.data[0].notes,
        status: res.data[0].status,
      })
      console.log(res.data);
    }).catch(err => {
      console.log(err);
    });
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

  }
})