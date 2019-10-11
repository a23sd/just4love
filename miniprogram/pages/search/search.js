// pages/search/search.js
import Toast from '/vant-weapp/toast/toast'
const regeneratorRuntime = require('../../lib/regenerator-runtime/runtime')
const user = require('../../db/user.js')
const util = require('../../utils/util.js')
const db = wx.cloud.database() // 初始化数据库
const _ = db.command

const fieldList = ['姓名', '微信', '生日', '学历', '身高', '体重', '工作地', '职业', '收入', '房车情况', '爱情宣言']
const orderList = ['asc', 'desc']

const initSelectItem = [{
    text: '年龄',
    items: [],
    values: []
  },
  {
    text: '身高',
    items: [],
    values: []
  },
  {
    text: '体重',
    items: [],
    values: []
  },
  {
    text: '学历',
    items: [],
    values: []
  },
  {
    text: '职业',
    items: [],
    values: []
  },
  {
    text: '收入',
    items: [],
    values: []
  },
  {
    text: '房车情况',
    items: [],
    values: []
  },
  {
    text: '婚姻情况',
    items: [],
    values: []
  },
  {
    text: '何时结婚',
    items: [],
    values: []
  },
  {
    text: '是否吸烟',
    items: [],
    values: []
  },
  {
    text: '是否喝酒',
    items: [],
    values: []
  },
  {
    text: '是否打牌',
    items: [],
    values: []
  },
]
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageSize: 10,
    fields: util.getRandomArrayElements(fieldList, 3),
    order: orderList[Math.floor(Math.random() * orderList.length)],
    type: 'search',
    results: [],
    show: false,
    keyword: '',
    prompt: '支持：姓名，学历，身高，体重，工作地，职业',
    mainActiveIndex: 0,
    items: [{
        text: '年龄',
        children: [{
            id: 10000,
          text: '可以选择两项确定范围',
            disabled: true
          },
          {
            id: 0,
            text: '不限'
          }
        ].concat(Array.from(Array(41), (v, k) => ({
          id: 1 + k,
          text: 1970 + k
        })))
      },
      {
        text: '身高',
        children: [{
          id: 10001,
          text: '可以选择两项确定范围',
          disabled: true
        }, {
          id: 100,
          text: '不限'
        }].concat(Array.from(Array(61), (v, k) => ({
          id: 101 + k,
          text: 140 + k
        })))
      },
      {
        text: '体重',
        children: [{
          id: 10002,
          text: '可以选择两项确定范围',
          disabled: true
        }, {
          id: 200,
          text: '不限'
        }].concat(Array.from(Array(61), (v, k) => ({
          id: 201 + k,
          text: 40 + k
        })))
      },
      {
        text: '学历',
        children: [{
          id: 10003,
          text: '可以选择两项确定范围',
          disabled: true
        }].concat(Array.from(['不限', '专科', '本科', '硕士', '博士'], (v, k) => ({
          id: 300 + k,
          text: v
        })))
      },
      {
        text: '职业',
        children: [{
          id: 10004,
          text: '单选',
          disabled: true
        }].concat(Array.from(['不限', '在校学生', '交通运输', '咨询/顾问', '传媒艺术', '物流/仓库', '销售', '政府机构', '法律', '生物/制药', '商贸/采购', '客户服务', '军人/警察', '财会/审计', '医疗/护理', '人事/行政', '计算机/互联网', '教育/科研', '农林牧业', '金融/银行/保险', '高级管理', '通信/电子', '建筑/房地产', '服务业', '广告/市场', '生产制造', '自由职业', '待业', '其他职业'], (v, k) => ({
          id: 400 + k,
          text: v
        })))
      },
      {
        text: '收入',
        children: [{
          id: 10005,
          text: '单选',
          disabled: true
        }].concat(Array.from(['不限', '3000元以上', '5000元以上', '8000元以上', '12000元以上', '20000元以上', '30000元以上', '40000元以上', '50000元以上'], (v, k) => ({
          id: 500 + k,
          text: v
        })))
      },
      {
        text: '房车情况',
        children: [{
          id: 10006,
          text: '单选',
          disabled: true
        }].concat(Array.from(['不限', '有车有房', '有车无房', '有房无车', '无车无房'], (v, k) => ({
          id: 600 + k,
          text: v
        })))
      },
      {
        text: '婚姻情况',
        children: [{
          id: 10007,
          text: '单选',
          disabled: true
        }].concat(Array.from(['不限', '未婚', '离异有孩', '离异无孩', '丧偶有孩', '丧偶无孩'], (v, k) => ({
          id: 700 + k,
          text: v
        })))
      },
      {
        text: '何时结婚',
        children: [{
          id: 10008,
          text: '单选',
          disabled: true
        }].concat(Array.from(['不限', '认同闪婚', '一年内', '二年内', '三年内', '时机成熟就结婚'], (v, k) => ({
          id: 800 + k,
          text: v
        })))
      },
      {
        text: '是否吸烟',
        children: [{
          id: 10009,
          text: '单选',
          disabled: true
        }].concat(Array.from(['不限', '不吸烟', '稍微抽一点烟', '社交场合会抽烟', '烟抽的很多'], (v, k) => ({
          id: 900 + k,
          text: v
        })))
      },
      {
        text: '是否喝酒',
        children: [{
          id: 10010,
          text: '单选',
          disabled: true
        }].concat(Array.from(['请选择', '不喝酒', '稍微喝一点酒', '社交场合会喝酒', '酒喝的很多'], (v, k) => ({
          id: 1000 + k,
          text: v
        })))
      },
      {
        text: '是否打牌',
        children: [{
          id: 10011,
          text: '单选',
          disabled: true
        }].concat(Array.from(['不限', '不打牌', '稍微抽一点牌', '社交场合会打牌', '牌打的很多'], (v, k) => ({
          id: 1100 + k,
          text: v
        })))
      }
    ],
    selectItem: initSelectItem.slice(),
    sexIcon: {
      男: 'https://6a75-just4love-c4szp-1300154995.tcb.qcloud.la/icons/man.png?sign=abff0650f97b1a0b325b29cf6101f01b&t=1567868421',
      女: 'https://6a75-just4love-c4szp-1300154995.tcb.qcloud.la/icons/wuman.png?sign=1d4aef60116cdbce534bf4e60849f0dc&t=1567868586'
    },
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

  onClick: function() {
    this.data.selectItem.map(function(obj) {
      obj.items = []
      obj.values = []
      return obj
    });
    this.setData({
      show: true,
      fields: util.getRandomArrayElements(fieldList, 3),
      order: orderList[Math.floor(Math.random() * orderList.length)],
      activeId: []
    });
  },

  onClickNav: function({
    detail = {}
  }) {
    this.setData({
      mainActiveIndex: detail.index || 0,
    });
  },

  onClickItem: function({
    detail = {}
  }) {
    if (!this.data.activeId) this.data.activeId = [];
    const idx = this.data.activeId.indexOf(detail.id);
    var selectId = Math.floor(detail.id / 100);
    if (idx > -1) { // 已存在，取消选择
      var selectidx = this.data.selectItem[selectId].items.indexOf(detail.id)
      this.data.selectItem[selectId].items.splice(selectidx, 1)
      this.data.selectItem[selectId].values.splice(selectidx, 1)
      this.data.activeId.splice(idx, 1)
    } else {
      if (this.data.activeId.indexOf(selectId * 100) > -1) { // 删除不限
        var selectidx = this.data.selectItem[selectId].items.indexOf(selectId * 100)
        this.data.selectItem[selectId].items.splice(selectidx, 1)
        this.data.selectItem[selectId].values.splice(selectidx, 1)
        this.data.activeId.splice(this.data.activeId.indexOf(selectId * 100), 1)
      }
      if ((detail.id < 400 && this.data.selectItem[selectId].items.length > 1) // 年龄，身高可以选择两项选择
        ||
        (detail.id >= 400 && this.data.selectItem[selectId].items.length > 0)) { // 其他只能单选
        var id = this.data.selectItem[selectId].items[0]
        this.data.selectItem[selectId].items.splice(0, 1)
        this.data.selectItem[selectId].values.splice(0, 1)
        this.data.activeId.splice(this.data.activeId.indexOf(id), 1)
      }
      if (detail.id % 100 === 0) { // 不限
        for (let index in this.data.selectItem[selectId].items) {
          let id = this.data.selectItem[selectId].items[index]
          this.data.selectItem[selectId].items.splice(index, 1)
          this.data.activeId.splice(this.data.activeId.indexOf(id), 1)
        }
      }
      this.data.selectItem[selectId].items.push(detail.id);
      this.data.selectItem[selectId].values.push(detail.text);
      this.data.activeId.push(detail.id);
      this.setData({
        selectItem: this.data.selectItem,
        activeId: this.data.activeId
      })
    }
  },

  async filterUser() {
    try {
      wx.showLoading({
        title: '过滤中...',
        mask: true
      })
      await user.getOpenid()
      const userInfo = await user.getUser(false)
      delete userInfo._id
      delete userInfo._openid
      this.setData({
        values: userInfo
      })
      console.log(this.data.selectItem)
      const results = await user.filterUser(this.data.selectItem, this.data.results.length, this.data.pageSize, this.data.fields, this.data.order)
      // console.log(results)
      this.setData({
        results: this.data.results.concat(results)
      })
      wx.hideLoading()
      Toast.success('过滤成功')
    } catch (err) {
      console.log(err)
      wx.hideLoading()
      Toast.fail('过滤失败')
    }
  },

  async searchUser() {
    try {
      if (this.data.keyword == '') {
        Toast('搜索条件不能为空！！！');
        return;
      }
      wx.showLoading({
        title: '搜索中...',
        mask: true
      })
      await user.getOpenid()
      const userInfo = await user.getUser(false)
      delete userInfo._id
      delete userInfo._openid
      this.setData({
        values: userInfo
      })
      const results = await user.searchUser(this.data.keyword, this.data.results.length, this.data.pageSize, this.data.fields, this.data.order)
      console.log(results)
      this.setData({
        results: this.data.results.concat(results)
      })
      wx.hideLoading()
      Toast.success('搜索成功')
    } catch (err) {
      console.log(err)
      wx.hideLoading()
      Toast.fail('搜索失败')
    }
  },


  getResult: function() {
    if (this.data.type === 'search') {
      this.searchUser()
    } else {
      this.filterUser()
    }
  },

  onSearch: function(event) {
    this.setData({
      fields: util.getRandomArrayElements(fieldList, 3),
      order: orderList[Math.floor(Math.random() * orderList.length)],
      type: 'search',
      keyword: event.detail,
      results: []
    });
    this.getResult()
  },


  onFilter: function() {
    this.setData({
      show: false,
      type: 'filter',
      results: []
    });
    this.getResult()

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
    if (this.data.values.心仪.indexOf(this.data.results[index]._openid) > -1) {
      Toast('已经在心仪列表中，无需重复添加')
    } else {
      this.setData({
        ["values.心仪"]: this.data.values.心仪.concat(this.data.results[index]._openid),
        [`results\[${index}\].心仪`]: true
      });
      this.updateUser()
    }
  },

  onUnFavorite: function (event) {
    const index = event.currentTarget.dataset.index
    if (this.data.values.心仪.indexOf(this.data.results[index]._openid) < 0) {
      Toast('不在心仪列表中，移除失败')
    } else {
      this.data.values.心仪.splice(this.data.values.心仪.indexOf(this.data.results[index]._openid), 1)
      this.setData({
        [`results\[${index}\].心仪`]: false
      });
      this.updateUser()
    }
  },

  onIgore: function (event) {
    const index = event.currentTarget.dataset.index
    if (this.data.values.屏蔽.indexOf(this.data.results[index]._openid) > -1) {
      Toast('已经在屏蔽列表中，无需重复添加')
    } else {
      this.setData({
        ["values.屏蔽"]: this.data.values.屏蔽.concat(this.data.results[index]._openid),
        [`results\[${index}\].屏蔽`]: true
      });
      this.updateUser()
    }
  },

  onUnIgore: function (event) {
    const index = event.currentTarget.dataset.index
    if (this.data.values.屏蔽.indexOf(this.data.results[index]._openid) < 0) {
      Toast('不在屏蔽列表中，移除失败')
    } else {
      this.data.values.屏蔽.splice(this.data.values.屏蔽.indexOf(this.data.results[index]._openid), 1)
      this.setData({
        [`results\[${index}\].屏蔽`]: false
      });
      this.updateUser()
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
      results: []
    });
    this.getResult();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.getResult();
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