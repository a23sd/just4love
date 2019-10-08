// pages/user/requirement.js
import Toast from '/vant-weapp/toast/toast'
const regeneratorRuntime = require('../../lib/regenerator-runtime/runtime')
const user = require('../../db/user.js')
const requirement = require('../../db/requirement.js')
const db = wx.cloud.database()// 初始化数据库
const infoData = {
  "年龄": [{
    values: ['不限'].concat(Array.from(Array(41), (v, k) => 1970 + k + '年'))
    },
    {
      values: ['不限'].concat(Array.from(Array(41), (v, k) => 1970 + k + '年'))
    }
  ],
  "学历": [{
    values: ['不限', '专科', '本科', '硕士', '博士']
  },
  {
    values: ['不限', '专科', '本科', '硕士', '博士']
  }
  ],
  "身高": [{
      values: ['不限'].concat(Array.from(Array(61), (v, k) => 140 + k + 'cm'))
    },
    {
      values: ['不限'].concat(Array.from(Array(61), (v, k) => 140 + k + 'cm'))
    }
  ],
  "体重": [{
    values: ['不限'].concat(Array.from(Array(61), (v, k) => 40 + k + 'kg'))
  },
  {
    values: ['不限'].concat(Array.from(Array(61), (v, k) => 40 + k + 'kg'))
  }
  ],
  "职业": ['不限', '在校学生', '交通运输', '咨询/顾问', '传媒艺术', '物流/仓库', '销售', '政府机构', '法律', '生物/制药', '商贸/采购', '客户服务', '军人/警察', '财会/审计', '医疗/护理', '人事/行政', '计算机/互联网', '教育/科研', '农林牧业', '金融/银行/保险', '高级管理', '通信/电子', '建筑/房地产', '服务业', '广告/市场', '生产制造', '自由职业', '待业', '其他职业'],
  "收入": ['不限', '3000元以上', '5000元以上', '8000元以上', '12000元以上', '20000元以上', '30000元以上', '40000元以上','50000元以上'],
  "房车情况": ['不限', '有车有房', '有车无房', '有房无车', '无车无房'],
  "婚姻情况": ['不限', '未婚', '离异有孩', '离异无孩', '丧偶有孩', '丧偶无孩'],
  "何时结婚": ['不限', '认同闪婚', '一年内', '二年内', '三年内', '时机成熟就结婚'],
  "是否吸烟": ['不限', '不吸烟', '稍微抽一点烟', '社交场合会抽烟', '烟抽的很多'],
  "是否喝酒": ['不限', '不喝酒', '稍微喝一点酒', '社交场合会喝酒', '酒喝的很多'],
  "是否打牌": ['不限', '不打牌', '稍微打一点牌', '社交场合会打牌', '牌打的很多']

}
const eduList = ['专科', '本科', '硕士', '博士']

Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled: false,
    show: false,
    columns: [],
    item: "年龄",
    titles: ["年龄", "学历", "身高", "体重", "职业", "收入", "房车情况",
      "婚姻情况", "何时结婚", "是否吸烟", "是否喝酒", "是否打牌"
    ],
    id: '',
    openid: '',
    values: {
      "年龄": "不限",
      "学历": "不限",
      "身高": "不限",
      "体重": "不限",
      "职业": "不限",
      "收入": "不限",
      "房车情况": "不限",
      "婚姻情况": "不限",
      "何时结婚": "不限",
      "是否吸烟": "不限",
      "是否喝酒": "不限",
      "是否打牌": "不限"
    }
  },

  onClick: function(event) {
    var item = event.currentTarget.dataset.item;
    console.log(item)
    this.setData({
      show: true,
      item: item,
      columns: infoData[item]
    });
  },

  onConfirm: function(event) {
    console.log(event.detail)
    const item = this.data.item;
    console.log(item)
    var {
      value,
      index
    } = event.detail;
    if (value instanceof Array) {
      if ('不限' === value[0] && '不限' === value[1]) {
        value = '不限'
      } 
      else if ('不限' === value[0]) {
        value = value[1] + '及以下'
      } else if ('不限' === value[1]) {
        value = value[0] + '及以上'
      } else if (value[0] === value[1]) {
        value = value[0]
      } else if ('学历' === item)
      {
        value = value.sort(function (a, b) {
          return eduList.indexOf(a) - eduList.indexOf(b)
        }).join('-')
      } 
      else {
        value = value.sort().join('-')
      }
    }
    this.setData({ 
      show: false,
      ["values." + item]: value
    });
  },

  onCancel: function() {
    this.setData({
      show: false,
    });
  },

  async getRequirement() {
    try {
      this.setData({
        disabled: true
      })
      wx.showLoading({
        title: '加载中...',
        mask: true
      })
      await user.getOpenid()
      var requireInfo = await requirement.getRequirement(true)
      const id = requireInfo._id
      const openid = requireInfo._openid
      delete requireInfo._id
      delete requireInfo._openid
      this.setData({
        id: id,
        openid: openid,
        values: requireInfo
      })
      wx.hideLoading()
      this.setData({
        disabled: false
      })
    } catch (err) {
      console.log(err)
      wx.hideLoading()
      this.setData({
        disabled: false
      })
      Toast.fail('获取数据失败，请刷新重试')
    }
  },

  async updateRequirement() {
    try {
      this.setData({
        disabled: true
      })
      wx.showLoading({
        title: '保存中...',
        mask: true
      })
      await requirement.updateRequirement(this.data.values)
      await requirement.getRequirement(true)
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
  
  onSubmit: function () {
    this.updateRequirement()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    this.getRequirement()
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
    this.getRequirement()
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
    return {
      path: "pages/recommend/recommend"
    }
  }
})