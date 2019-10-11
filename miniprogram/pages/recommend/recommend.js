// pages/recommend/recommend.js
import Toast from '/vant-weapp/toast/toast'
const regeneratorRuntime = require('../../lib/regenerator-runtime/runtime')
const user = require('../../db/user.js')
const requirement = require('../../db/requirement.js')
const notice = require('../../db/notice.js')
const util = require('../../utils/util.js')
const fieldList = ['学历', '微信', '身高', '体重', '工作地', '职业', '收入', '房车情况', '爱情宣言']

const orderList = ['asc', 'desc']

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageSize: 10,
    vipIdx: 0,
    vip: '',
    vips: [],
    sexIcon: {
      男: 'https://6a75-just4love-c4szp-1300154995.tcb.qcloud.la/icons/man.png?sign=abff0650f97b1a0b325b29cf6101f01b&t=1567868421',
      女: 'https://6a75-just4love-c4szp-1300154995.tcb.qcloud.la/icons/wuman.png?sign=1d4aef60116cdbce534bf4e60849f0dc&t=1567868586'
    },
    fields: util.getRandomArrayElements(fieldList, 3),
    order: orderList[Math.floor(Math.random() * orderList.length)],
    recommends: [],
    favorite: [],
    ignore: [],
    msg: "希望大家都能通过这个平台尽快找到陪伴自己一生的伴侣",
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

  async checkUser() {
    try {
      await user.getOpenid()
      await user.checkUser()
    } catch (err) {
      console.log(err)
      if (err === 'refuse to use') {
        Toast.fail('已列入黑名单，如有疑问请联系管理员')
      } else if (err === 'no user') {
        Toast('请填写个人基本信息')
        wx.navigateTo({
          url: '/pages/user/register'
        })
      } else if (err === 'Incomplete user information') {
        Toast('请完善个人基本信息')
        wx.navigateTo({
          url: '/pages/user/edit'
        })
      } else {
        Toast.fail('获取用户信息，请刷新重试')
      }
    }
  },

  async getVipsAndRecommends() {
    try {
      wx.showLoading({
        title: '加载中...',
        mask: true
      })
      await user.getOpenid()
      const userInfo = await user.getUser(true)
      delete userInfo._id
      delete userInfo._openid
      this.setData({
        values: userInfo
      })
      await requirement.getRequirement(true)
      const vips = await user.getVip()
      const recommends = await user.getRecommend(this.data.recommends.length, this.data.pageSize, this.data.fields, this.data.order)
      const vipIdx = Math.floor(Math.random() * vips.length)
      this.setData({
        vipIdx: vipIdx,
        vip: vips[vipIdx],
        vips: vips,
        recommends: recommends
      })
      wx.hideLoading()
    } catch (err) {
      console.log(err)
      wx.hideLoading()
      Toast.fail('获取VIP和推荐用户信息失败，请刷新重试')
    }
  },

  async getRecommends() {
    try {
      wx.showLoading({
        title: '加载中...',
        mask: true
      })
      await user.getOpenid()
      await user.getUser(true)
      await requirement.getRequirement(true)
      const recommends = await user.getRecommend(this.data.recommends.length, this.data.pageSize, this.data.fields, this.data.order)
      console.log(recommends)
      this.setData({
        recommends: this.data.recommends.concat(recommends)
      })
      wx.hideLoading()
    } catch (err) {
      console.log(err)
      wx.hideLoading()
      Toast.fail('获取推荐用户信息失败，请刷新重试')
    }
  },

  async getNotice() {
    try {
      const noticeInfo = await notice.getNotice()
      this.setData({
        msg: noticeInfo.msg
      })
    } catch (err) {
      console.log(err)
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


  getIndex: function() {
    if (this.data.vip == undefined) {
      return -1
    }
    for (var index in this.data.recommends) {
      if (this.data.recommends[index]._openid === this.data.vip._openid) {
        return index
      }
    }
    return -1
  },

  onFavorite: function(event) {
    const index = event.currentTarget.dataset.index
    if (index < 0) // vip
    {
      if (this.data.values.心仪.indexOf(this.data.vip._openid) > -1) {
        Toast('已经在心仪列表中，无需重复添加')
      } else {
        this.setData({
          ["values.心仪"]: this.data.values.心仪.concat(this.data.vip._openid),
          ['vip.心仪']: true
        })
        const idx = this.getIndex()
        if (idx > -1) {
          this.setData({
            [`recommends\[${idx}\].心仪`]: true
          })
        }
        this.updateUser()
      }
    } else { // recommend
      if (this.data.values.心仪.indexOf(this.data.recommends[index]._openid) > -1) {
        Toast('已经在心仪列表中，无需重复添加')
      } else {
        this.setData({
          ["values.心仪"]: this.data.values.心仪.concat(this.data.recommends[index]._openid),
          [`recommends\[${index}\].心仪`]: true
        })
        if (this.data.vips.length > 0 && this.data.recommends[index]._openid === this.data.vip._openid) {
          this.setData({
            ['vip.心仪']: true
          })
        }
        this.updateUser()
      }
    }
  },

  onUnFavorite: function(event) {
    const index = event.currentTarget.dataset.index
    if (index < 0) // vip
    {
      if (this.data.values.心仪.indexOf(this.data.vip._openid) < 0) {
        Toast('不在心仪列表中，移除失败')
      } else {
        this.data.values.心仪.splice(this.data.values.心仪.indexOf(this.data.vip._openid), 1)
        this.setData({
          ['vip.心仪']: false
        })
        const idx = this.getIndex()
        if (idx > -1) {
          this.setData({
            [`recommends\[${idx}\].心仪`]: false
          })
        }
        this.updateUser()
      }
    } else { // recommend
      if (this.data.values.心仪.indexOf(this.data.recommends[index]._openid) < 0) {
        Toast('不在心仪列表中，移除失败')
      } else {
        this.data.values.心仪.splice(this.data.values.心仪.indexOf(this.data.recommends[index]._openid), 1)
        this.setData({
          [`recommends\[${index}\].心仪`]: false
        })
        if (this.data.vips.length > 0 && this.data.recommends[index]._openid === this.data.vip._openid) {
          this.setData({
            ['vip.心仪']: false
          })
        }
        this.updateUser()
      }
    }
  },

  onIgore: function(event) {
    const index = event.currentTarget.dataset.index
    if (index < 0) // vip
    {
      if (this.data.values.屏蔽.indexOf(this.data.vip._openid) > -1) {
        Toast('已经在心仪列表中，无需重复添加')
      } else {
        this.data.vips.splice(this.data.vipIdx, 1)
        if (this.data.vips.length > 0) {
          var vipIdx = Math.floor(Math.random() * this.data.vips.length)
          var vip = this.data.vips[vipIdx]
        } else {
          var vipIdx = 0
          var vip = ''
        }
        this.setData({
          vipIdx: vipIdx,
          vip: vip,
          ["values.屏蔽"]: this.data.values.屏蔽.concat(this.data.vip._openid),
        })
        const idx = this.getIndex()
        if (idx > -1) {
          this.setData({
            [`recommends\[${idx}\].屏蔽`]: true
          })
        }
        this.updateUser()
      }
    } else { // recommend
      if (this.data.values.屏蔽.indexOf(this.data.recommends[index]._openid) > -1) {
        Toast('已经在屏蔽列表中，无需重复添加')
      } else {
        this.setData({
          ["values.屏蔽"]: this.data.values.屏蔽.concat(this.data.recommends[index]._openid),
          [`recommends\[${index}\].屏蔽`]: true
        })
        if (this.data.vips.length > 0 && this.data.recommends[index]._openid === this.data.vip._openid) {
          this.data.vips.splice(this.data.vipIdx, 1)
          if (this.data.vips.length > 0) {
            var vipIdx = Math.floor(Math.random() * this.data.vips.length)
            var vip = this.data.vips[vipIdx]
          } else {
            var vipIdx = 0
            var vip = ''
          }
          this.setData({
            vipIdx: vipIdx,
            vip: vip
          })
        }
        this.updateUser()
      }
    }
  },

  onUnIgore: function(event) {
    const index = event.currentTarget.dataset.index
    if (index < 0) // vip
    {
      if (this.data.values.屏蔽.indexOf(this.data.vip._openid) < 0) {
        Toast('不在屏蔽列表中，移除失败')
      } else {
        this.data.values.屏蔽.splice(this.data.values.屏蔽.indexOf(this.data.vip._openid), 1)
        this.setData({
          ['vip.屏蔽']: false
        })
        const idx = this.getIndex()
        if (idx > -1) {
          this.setData({
            [`recommends\[${idx}\].屏蔽`]: false
          })
        }
        this.updateUser()
      }
    } else { // recommend
      if (this.data.values.屏蔽.indexOf(this.data.recommends[index]._openid) < 0) {
        Toast('不在屏蔽列表中，移除失败')
      } else {
        this.data.values.屏蔽.splice(this.data.values.屏蔽.indexOf(this.data.recommends[index]._openid), 1)
        this.setData({
          [`recommends\[${index}\].屏蔽`]: false
        })
        if (this.data.vips.length > 0 && this.data.recommends[index]._openid === this.data.vip._openid) {
          this.setData({
            ['vip.屏蔽']: false
          })
        }
        this.updateUser()
      }
    }
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      vipIdx: 0,
      vip: '',
      vips: [],
      recommends: []
    })
    this.getVipsAndRecommends()
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
    this.getNotice()
    this.checkUser()
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
      vipIdx: 0,
      vip: '',
      vips: [],
      fields: util.getRandomArrayElements(fieldList, 3),
      order: orderList[Math.floor(Math.random() * orderList.length)],
      recommends: []
    })
    this.getVipsAndRecommends()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.getRecommends()
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