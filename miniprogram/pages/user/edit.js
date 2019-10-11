// pages/user/edit.js
import Toast from '/vant-weapp/toast/toast'
const regeneratorRuntime = require('../../lib/regenerator-runtime/runtime')
const area = require('./area.js')
const user = require('../../db/user.js')
const db = wx.cloud.database(); // 初始化数据库
const infoData = {
  "性别": ['请选择', '男', '女'],
  "生日": [],
  "学历": ['请选择', '专科', '本科', '硕士', '博士'],
  "身高": ['请选择'].concat(Array.from(Array(61), (v, k) => 140 + k + 'cm')),
  "体重": ['请选择'].concat(Array.from(Array(61), (v, k) => 40 + k + 'kg')),
  "工作地": [],
  "职业": ['请选择', '在校学生', '交通运输', '咨询/顾问', '传媒艺术', '物流/仓库', '销售', '政府机构', '法律', '生物/制药', '商贸/采购', '客户服务', '军人/警察', '财会/审计', '医疗/护理', '人事/行政', '计算机/互联网', '教育/科研', '农林牧业', '金融/银行/保险', '高级管理', '通信/电子', '建筑/房地产', '服务业', '广告/市场', '生产制造', '自由职业', '待业', '其他职业'],
  "收入": ['请选择', '3000-5000元', '5000-8000元', '8000-12000元', '12000-20000元', '20000-30000元', '30000-40000元', '40000-50000元', '50000元以上'],
  "房车情况": ['请选择', '有车有房', '有车无房', '有房无车', '无车无房'],
  "婚姻情况": ['请选择', '未婚', '离异有孩', '离异无孩', '丧偶有孩', '丧偶无孩'],
  "何时结婚": ['请选择', '认同闪婚', '一年内', '二年内', '三年内', '时机成熟就结婚'],
  "是否吸烟": ['请选择', '不吸烟', '稍微抽一点烟', '社交场合会抽烟', '烟抽的很多'],
  "是否喝酒": ['请选择', '不喝酒', '稍微喝一点酒', '社交场合会喝酒', '酒喝的很多'],
  "是否打牌": ['请选择', '不打牌', '稍微打一点牌', '社交场合会打牌', '牌打的很多']
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled: false,
    showNormal: false,
    showDate: false,
    showArea: false,
    currentDate: new Date(1990, 0, 1).getTime(),
    birthday: "请选择",
    height: "请选择",
    weight: "请选择",
    areaList: area.areas,
    columns: [],
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      } else if (type === 'day') {
        return `${value}日`;
      }
      return value;
    },
    item: "姓名",
    heightIcon: 'https://6a75-just4love-c4szp-1300154995.tcb.qcloud.la/icons/height.png?sign=452e1afd80d7df857f23851ec6c18f88&t=1567918156',
    weightIcon: 'https://6a75-just4love-c4szp-1300154995.tcb.qcloud.la/icons/weight.png?sign=084e2f061dab66f7568c8150a1ee87d3&t=1567918002',
    userInfo: {
      "性别": "https://6a75-just4love-c4szp-1300154995.tcb.qcloud.la/icons/sex.png?sign=eafe5043b85a0d634fe3dde85912ce8c&t=1567917933",
      "学历": "https://6a75-just4love-c4szp-1300154995.tcb.qcloud.la/icons/education.png?sign=3597ae3f73a8f0e24810a0f5b2f8328f&t=1567917948",
      "婚姻情况": "https://6a75-just4love-c4szp-1300154995.tcb.qcloud.la/icons/marriage.png?sign=49de1aa4a0e6692aca14d056fd0a5fdb&t=1567918683",
      "工作地": "location-o",
      "职业": "notes-o",
      "收入": "gold-coin-o",
      "房车情况": "wap-home",
      "何时结婚": "clock-o",
      "是否吸烟": "https://6a75-just4love-c4szp-1300154995.tcb.qcloud.la/icons/smoking.png?sign=2705208d525d06d41f0ea6aba845b26f&t=1567918352",
      "是否喝酒": "https://6a75-just4love-c4szp-1300154995.tcb.qcloud.la/icons/drink.png?sign=6ee9d8f0d144db3a70e7eb5608b299f3&t=1567918396",
      "是否打牌": "https://6a75-just4love-c4szp-1300154995.tcb.qcloud.la/icons/poker.png?sign=47e3e1785046cd35a2b96733d2d10d00&t=1567918241"
    },
    values: {
      "姓名": "",
      "微信": "",
      "性别": "请选择",
      "生日": "请选择",
      "学历": "请选择",
      "身高": "请选择",
      "体重": "请选择",
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

  onUserNameChange: function(event) {
    this.setData({
      ["values.姓名"]: event.detail
    })
  },

  onWxChange: function(event) {
    this.setData({
      ["values.微信"]: event.detail
    })
  },

  onClick: function(event) {
    var item = event.currentTarget.dataset.item;
    if (item === "生日") {
      this.setData({
        showNormal: false,
        showDate: true,
        showArea: false,
        item: item,
        columns: infoData[item]
      });
    } else if (item === "工作地") {
      this.setData({
        showNormal: false,
        showDate: false,
        showArea: true,
        item: item,
        columns: infoData[item]
      });
    } else {
      this.setData({
        showNormal: true,
        showDate: false,
        showArea: false,
        item: item,
        columns: infoData[item]
      });
    }
  },

  onConfirm: function(event) {
    console.log(event.detail)
    const item = this.data.item;
    console.log(item)
    if (item === "生日") {
      var date = new Date(event.detail);
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      this.setData({
        showNormal: false,
        showDate: false,
        showArea: false,
        birthday: [year, month, day].join('-'),
        ["values." + item]: date
      });
    } else if (item === "工作地") {
      const {
        values
      } = event.detail;
      this.setData({
        showNormal: false,
        showDate: false,
        showArea: false,
        ["values." + item]: values.map(item => item.name).join('-')
      });
    } else {
      var {
        value,
        index
      } = event.detail;
      if (item === "身高") {
        var height = value
        if (height.indexOf("cm") > -1) {
          height = parseInt(height.substring(0, height.indexOf("cm")))
        }
        this.setData({
          showNormal: false,
          showDate: false,
          showArea: false,
          height: value,
          ["values." + item]: height
        })
      } else if (item === "体重") {
        var weight = value
        if (weight.indexOf("kg") > -1) {
          weight = parseInt(weight.substring(0, weight.indexOf("kg")))
        }
        this.setData({
          showNormal: false,
          showDate: false,
          showArea: false,
          weight: value,
          ["values." + item]: weight
        })
      } else {
        this.setData({
          showNormal: false,
          showDate: false,
          showArea: false,
          ["values." + item]: value
        })
      }
    }
  },

  onCancel: function() {
    this.setData({
      showNormal: false,
      showDate: false,
      showArea: false,
    });
  },

  onSubmit: function() {
    if (this.data.values.姓名.trim().length === 0 || this.data.values.微信.trim().length === 0 || this.data.values.性别 == '请选择' || this.data.values.生日 == '请选择' ||
      this.data.values.身高 == '请选择' || this.data.values.体重 == '请选择' || this.data.values.婚姻情况 == '请选择' || this.data.values.工作地 == '请选择' || this.data.values.职业 == '请选择' || this.data.values.收入 == '请选择' || this.data.values.房车情况 == '请选择' || this.data.values.何时结婚 == '请选择' || this.data.values.是否吸烟 == '请选择' || this.data.values.是否喝酒 == '请选择' || this.data.values.是否打牌 == '请选择') {
      Toast('为了更好的为您服务请完整填写相关信息')
    } else {
      console.log("===============submit user info==============");
      console.log(this.data.values)
      this.updateUser()
    }
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
      userInfo.生日 = new Date(userInfo.生日)
      var birthday = userInfo.生日
      if (birthday !== '请选择') {
        birthday = [birthday.getFullYear(), birthday.getMonth() + 1, birthday.getDate()].join('-')
      }
      this.setData({
        birthday: birthday,
        height: userInfo.身高 + 'cm',
        weight: userInfo.体重 + 'kg',
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
    this.getUser()
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
    this.getUser()
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