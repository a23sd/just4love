var log = require('../utils/log.js')
const db = wx.cloud.database() // 初始化数据库
const _ = db.command

function getNotice() {
  return new Promise((resolve, reject) => {
    console.log("===============get notice==============")
    log.info("===============get notice==============")
    db.collection('notice')
      .orderBy('时间', 'desc')
      .get()
      .then(res => {
        if (res.data.length >= 1) {
          wx.setStorageSync('notice', res.data[0])
          console.log("===============get notice success==============")
          console.log(res.data[0])
          log.info("===============get notice success==============")
          log.info(res.data[0])
          resolve(res.data[0])
        } else {
          console.log("===============notice not exist==============")
          log.info("===============notice not exist==============")
          reject('no notice')
        }
      }).catch(err => {
        console.log("===============get notice failed==============")
        console.error(err)
        log.info("===============get notice failed==============")
        log.error(err)
      reject(err)
    })
  })
}

function addNotice(msg) {
  return new Promise((resolve, reject) => {
    console.log("===============add notice==============")
    log.info("===============add notice==============")
    db.collection('notice').add({
      data: {
        "msg": msg,
        "时间": new Date()
      }
    }).then(res => {
      console.log("===============add notice success==============")
      console.log(res)
      log.info("===============add notice success==============")
      log.info(res)
      resolve(res)
    }).catch(err => {
      console.log("===============add notice failed==============")
      console.error(err)
      log.info("===============add notice failed==============")
      log.error(err)
      reject(err)
    })
  })
}

module.exports = {
  getNotice,
  addNotice
}