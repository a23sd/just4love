// pages/photo/add.js
import Toast from '/vant-weapp/toast/toast'
const regeneratorRuntime = require('../../lib/regenerator-runtime/runtime')
const user = require('../../db/user.js')
const image = require('../../db/image.js')
const util = require('../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    images: [],
    thumbs: [],
    delImgIdx: 0,
    delImg: "",
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

  uploadImg: function() {
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
            ["values.照片"]: that.data.images,
            ["values.缩略图"]: that.data.thumbs,
            ["values.照片数量"]: that.data.images.length
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
      var index = event.currentTarget.dataset.index
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

  onConfirm() {
    wx.cloud.deleteFile({
      fileList: [this.data.images[this.data.delImgIdx], this.data.thumbs[this.data.delImgIdx]]
    }).then(res => {
      this.data.images.splice(this.data.delImgIdx, 1)
      this.data.thumbs.splice(this.data.delImgIdx, 1)
      this.setData({
        images: this.data.images,
        thumbs: this.data.thumbs,
        ["values.照片"]: this.data.images,
        ["values.缩略图"]: this.data.thumbs,
        ["values.照片数量"]: this.data.images.length
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

  async getUser() {
    try {
      wx.showLoading({
        title: '加载中...',
        mask: true
      })
      await user.getOpenid()
      var userInfo = await user.getUser(true)
      delete userInfo._id
      delete userInfo._openid
      this.setData({
        images: userInfo.照片,
        thumbs: userInfo.缩略图,
        values: userInfo
      })
      wx.hideLoading()
    } catch (err) {
      console.log(err)
      wx.hideLoading()
      Toast.fail('获取用户信息失败，请刷新重试')
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
    return {
      path: "pages/recommend/recommend"
    }
  }
})