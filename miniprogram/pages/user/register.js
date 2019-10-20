// pages/user/register.js
import Toast from '/vant-weapp/toast/toast'
const regeneratorRuntime = require('../../lib/regenerator-runtime/runtime')
const invitaitoncode = require('../../db/invitaitoncode.js')
const requirement = require('../../db/requirement.js')
const area = require('./area.js')
const user = require('../../db/user.js')
const image = require('../../db/image.js')
const util = require('../../utils/util.js')
const db = wx.cloud.database(); // 初始化数据库
const userData = {
  "性别": ['请选择', '男', '女'],
  "生日": [],
  "学历": ['请选择', '专科', '本科', '硕士', '博士'],
  "身高": ['请选择'].concat(Array.from(Array(61), (v, k) => 140 + k + 'cm')),
  "体重": ['请选择'].concat(Array.from(Array(61), (v, k) => 40 + k + 'kg')),
  "工作地": [],
  "职业": ['请选择', '在校学生', '交通运输', '咨询/顾问', '传媒艺术', '物流/仓库', '销售', '政府机构', '法律', '生物/制药', '商贸/采购', '客户服务', '军人/警察', '财会/审计', '医疗/护理', '人事/行政', '计算机/互联网', '教育/科研', '农林牧业', '金融/银行/保险', '高级管理', '通信/电子', '建筑/房地产', '服务业', '广告/市场', '生产制造', '自由职业', '待业', '其他职业'],
  "收入": ['请选择', '3000元以下', '3001-5000元', '5001-8000元', '8001-12000元', '12001-20000元', '20001-50000元', '50000元以上'],
  "房车情况": ['请选择', '有车有房', '有车无房', '有房无车', '无车无房'],
  "婚姻情况": ['请选择', '未婚', '离异有孩', '离异无孩', '丧偶有孩', '丧偶无孩'],
  "何时结婚": ['请选择', '认同闪婚', '一年内', '二年内', '三年内', '时机成熟就结婚'],
  "是否吸烟": ['请选择', '不吸烟', '稍微抽一点烟', '社交场合会抽烟', '烟抽的很多'],
  "是否喝酒": ['请选择', '不喝酒', '稍微喝一点酒', '社交场合会喝酒', '酒喝的很多'],
  "是否打牌": ['请选择', '不打牌', '稍微打一点牌', '社交场合会打牌', '牌打的很多']
}

const requireData = {
  "年龄": [{
    values: ['不限'].concat(Array.from(Array(41), (v, k) => 1970 + k))
  },
  {
    values: ['不限'].concat(Array.from(Array(41), (v, k) => 1970 + k))
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
  "收入": ['不限', '3000元以下', '3001-5000元', '5001-8000元', '8001-12000元', '12001-20000元', '20001-50000元', '50000元以上'],
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
    active: 0,
    code: '',
    steps: [
      {
        text: '激活码'
      },
      {
        text: '基本信息'
      },
      {
        text: '爱情宣言'
      },
      {
        text: '我的相册'
      },
      {
        text: '希望你'
      }
    ],
    disabled: false,
    show: false,
    showNormal: false,
    showDate: false,
    showArea: false,
    showRequire: false,
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
    userItems: {
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
    userValues: {
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
    },
    images: [],
    thumbs: [],
    cWidth: 0,
    cHeight: 0,
    delImgIdx: 0,
    delImg: '',
    columns: [],
    item: "年龄",
    titles: ["年龄", "学历", "身高", "体重", "职业", "收入", "房车情况",
      "婚姻情况", "何时结婚", "是否吸烟", "是否喝酒", "是否打牌"
    ],
    requireValues: {
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

  nextStep: function() {
    this.setData({
      disabled: true
    })
    if (this.data.steps[this.data.active].text === '激活码') {
      invitaitoncode.checkInvitaitonCode(this.data.code).then(res => {
        console.log(res)
        if (this.data.active < this.data.steps.length - 1) {
          this.setData({
            active: this.data.active + 1
          })
        }
      }).catch(err => {
        console.log(err)
        Toast.fail('激活码验证失败，请重新输入')
      })
      this.setData({
        disabled: false
      })
    } else if (this.data.steps[this.data.active].text === '基本信息') {
      if (this.data.userValues.姓名.trim().length === 0 || this.data.userValues.微信.trim().length === 0 || this.data.userValues.性别 == '请选择' || this.data.userValues.生日 == '请选择' ||
        this.data.userValues.身高 == '请选择' || this.data.userValues.体重 == '请选择' || this.data.userValues.婚姻情况 == '请选择' || this.data.userValues.工作地 == '请选择' || this.data.userValues.职业 == '请选择' || this.data.userValues.收入 == '请选择' || this.data.userValues.房车情况 == '请选择' || this.data.userValues.何时结婚 == '请选择' || this.data.userValues.是否吸烟 == '请选择' || this.data.userValues.是否喝酒 == '请选择' || this.data.userValues.是否打牌 == '请选择') {
        Toast('为了更好的为您服务请完整填写相关信息')
      } else {
        if (this.data.active < this.data.steps.length - 1) {
          this.setData({
            active: this.data.active + 1
          })
        }
      }
      this.setData({
        disabled: false
      })
    } else if (this.data.steps[this.data.active].text === '爱情宣言') {
      this.updateUser()
      if (this.data.active < this.data.steps.length - 1) {
        this.setData({
          active: this.data.active + 1
        })
      }
      this.setData({
        disabled: false
      })
    } else if (this.data.steps[this.data.active].text === '我的相册') {
      console.log(this.data.userValues)
      if (this.data.active < this.data.steps.length - 1) {
        this.setData({
          active: this.data.active + 1
        })
      }
      this.setData({
        disabled: false
      })
    } else if (this.data.steps[this.data.active].text === '希望你') {
      console.log(this.data.requireValues)
      this.updateRequirement()    
    }
  },

  prevStep: function() {
    if (this.data.active > 0) {
      this.setData({
        active: this.data.active - 1
      })
    }
  },

  //  激活码
  onCodeChange: function(event) {
    this.setData({
      code: event.detail
    })
  },

  onUserNameChange: function(event) {
    this.setData({
      ["userValues.姓名"]: event.detail
    })
  },

  onWxChange: function(event) {
    this.setData({
      ["userValues.微信"]: event.detail
    })
  },

  onUserClick: function(event) {
    var item = event.currentTarget.dataset.item;
    if (item === "生日") {
      this.setData({
        showNormal: false,
        showDate: true,
        showArea: false,
        item: item,
        columns: userData[item]
      });
    } else if (item === "工作地") {
      this.setData({
        showNormal: false,
        showDate: false,
        showArea: true,
        item: item,
        columns: userData[item]
      });
    } else {
      this.setData({
        showNormal: true,
        showDate: false,
        showArea: false,
        item: item,
        columns: userData[item]
      });
    }
  },

  onUserConfirm: function(event) {
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
        ["userValues." + item]: date
      });
    } else if (item === "工作地") {
      const {
        values
      } = event.detail;
      this.setData({
        showNormal: false,
        showDate: false,
        showArea: false,
        ["userValues." + item]: values.map(item => item.name).join('-')
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
          ["userValues." + item]: height
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
          ["userValues." + item]: weight
        })
      } else {
        this.setData({
          showNormal: false,
          showDate: false,
          showArea: false,
          ["userValues." + item]: value
        })
      }
    }
  },

  onUserCancel: function() {
    this.setData({
      showNormal: false,
      showDate: false,
      showArea: false,
    });
  },

  onChange: function (event) {
    this.setData({
      ["userValues.爱情宣言"]: event.detail
    })
  },

  uploadImg: function () {
    if (this.data.images.length >= 5 || this.data.thumbs.length >= 5) {
      Toast('最多上传5张照片')
      return
    }
    var that = this
    // 选择图片
    wx.chooseImage({
      count: 5,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        if (this.data.images.length + tempFilePaths.length > 5 || this.data.thumbs.length + tempFilePaths.length > 5) {
          Toast('最多上传5张照片');
          return;
        }
        // 上传图片到云存储
        let promiseArr = [];
        for (let i = 0; i < tempFilePaths.length; i++) {
          let item = tempFilePaths[i];
          let suffix = /\.\w+$/.exec(item)[0]; // 正则表达式，返回文件扩展名
          let fileName = util.uuid() + suffix; // 上传至云端的路径
          promiseArr.push(new Promise((reslove, reject) => {
            wx.getFileSystemManager().readFile({
              filePath: item, //选择图片返回的相对路径
              encoding: 'base64', //编码格式
              success: res => { //成功的回调
                wx.cloud.callFunction({
                  name: 'uploadImage',
                  data: {
                    fileName: fileName,
                    file: res.data
                  },
                  success(response) {
                    that.setData({
                      images: that.data.images.concat(response.result.fileID),
                      thumbs: that.data.thumbs.concat(response.result.thumbFileID)
                    })
                    wx.cloud.callFunction({
                      // 要调用的云函数名称
                      name: 'compressImage',
                      // 传递给云函数的参数
                      data: {
                        fileName: fileName
                      }
                    }).catch(err => {
                      console.log(err)
                      wx.cloud.callFunction({
                        // 要调用的云函数名称
                        name: 'compressImage',
                        // 传递给云函数的参数
                        data: {
                          fileName: fileName
                        }
                      }).catch(err => {
                        console.log(err)
                        wx.cloud.callFunction({
                          // 要调用的云函数名称
                          name: 'compressImage',
                          // 传递给云函数的参数
                          data: {
                            fileName: fileName
                          }
                        }).catch(err => {
                          console.log(err)
                          image.addImage("images/" + fileName)
                        })
                      })
                    })
                    wx.cloud.callFunction({
                      // 要调用的云函数名称
                      name: 'resizeImage',
                      // 传递给云函数的参数
                      data: {
                        fileName: fileName
                      }
                    }).catch(err => {
                      console.log(err)
                      wx.cloud.callFunction({
                        // 要调用的云函数名称
                        name: 'resizeImage',
                        // 传递给云函数的参数
                        data: {
                          fileName: fileName
                        }
                      }).catch(err => {
                        console.log(err)
                        wx.cloud.callFunction({
                          // 要调用的云函数名称
                          name: 'resizeImage',
                          // 传递给云函数的参数
                          data: {
                            fileName: fileName
                          }
                        }).catch(err => {
                          console.log(err)
                          image.addImage("thumbs/" + fileName)
                        })
                      })
                    })
                    console.log(response)
                    reslove()
                  },
                  fail(error) {
                    console.log(error)
                    reject(error)
                  }
                })
              },
              fail(err) {
                console.log(err)
                reject(error)
              }
            })
          }))
        }
        Promise.all(promiseArr).then(res => {
          wx.showLoading({
            title: '上传中...',
            mask: true
          })
          that.setData({
            ["userValues.照片"]: that.data.images,
            ["userValues.缩略图"]: that.data.thumbs,
            ["userValues.照片数量"]: that.data.images.length
          })
          wx.hideLoading()
          this.updateUser()
        }).catch(err => {
          wx.hideLoading()
          Toast.fail('上传照片失败')
          console.log(err)
        })
      }
    })
  },

  previewImg: function(event) {
    if (this.endTime - this.startTime < 350) {
      var index = event.currentTarget.dataset.index;
      wx.previewImage({
        current: this.data.images[index],
        urls: this.data.images,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    }
  },

  deleteImg: function(event) {
    var index = event.currentTarget.dataset.index
    this.setData({
      show: true,
      delImgIdx: index,
      delImg: this.data.thumbs[index]
    });
  },

  // 手指按下
  onTouchStart: function(e) {
    this.startTime = e.timeStamp;
  },

  //手指离开
  onTouchEnd: function(e) {
    this.endTime = e.timeStamp;
  },

  onClose() {
    this.setData({
      show: false
    });
  },

  onConfirmDel() {
    wx.cloud.deleteFile({
      fileList: [this.data.images[this.data.delImgIdx], this.data.thumbs[this.data.delImgIdx]]
    }).then(res => {
      this.data.images.splice(this.data.delImgIdx, 1)
      this.data.thumbs.splice(this.data.delImgIdx, 1)
      this.setData({
        images: this.data.images,
        thumbs: this.data.thumbs,
        ["userValues.照片"]: this.data.images,
        ["userValues.缩略图"]: this.data.thumbs,
        ["userValues.照片数量"]: this.data.images.length
      })
      this.updateUser()
    }).catch(err => {
      Toast.fail('删除照片失败')
      console.error(err)
    })
    this.setData({
      show: false
    })
  },

  onRequireClick: function(event) {
    var item = event.currentTarget.dataset.item;
    console.log(item)
    this.setData({
      showRequire: true,
      item: item,
      columns: requireData[item]
    });
  },

  onRequireConfirm: function(event) {
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
      } else if ('不限' === value[0]) {
        value = value[1] + '及以下'
      } else if ('不限' === value[1]) {
        value = value[0] + '及以上'
      } else if (value[0] === value[1]) {
        value = value[0]
      } else if ('学历' === item) {
        value = value.sort(function(a, b) {
          return eduList.indexOf(a) - eduList.indexOf(b)
        }).join('-')
      } else {
        value = value.sort().join('-')
      }
    }
    this.setData({
      showRequire: false,
      ["requireValues." + item]: value
    });
  },

  onRequireCancel: function() {
    this.setData({
      showRequire: false,
    });
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
        userValues: userInfo,
        images: userInfo.照片,
        thumbs: userInfo.缩略图
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
      await user.updateUser(this.data.userValues)
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
      delete requireInfo._id
      delete requireInfo._openid
      this.setData({
        requireValues: requireInfo
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
      await requirement.updateRequirement(this.data.requireValues)
      await requirement.getRequirement(true)
      wx.hideLoading()
      this.setData({
        disabled: false
      })
      Toast.success('保存成功')
      await wx.reLaunch({
        url: '/pages/recommend/recommend'
      })
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
    this.getUser()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    
  }
})