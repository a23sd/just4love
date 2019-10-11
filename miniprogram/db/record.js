const util = require('../utils/util.js')
var log = require('../utils/log.js')
const db = wx.cloud.database() // 初始化数据库
const _ = db.command

const values = {
  "日期": util.getDate(),
  "查看的用户": []
}

function getRecord(update) {
  return new Promise((resolve, reject) => {
    console.log("===============get record==============")
    log.info("===============get record==============")
    const record = wx.getStorageSync('record')
    if (record === '' || record === undefined || update === true) {
      const openid = wx.getStorageSync('openid')
      console.log(openid);
      db.collection('record').where({
        _openid: openid,
        日期: util.getDate()
      }).get().then(res => {
        if (res.data.length >= 1) {
          wx.setStorageSync('record', res.data[0])
          console.log("===============get record success==============")
          console.log(res.data[0])
          log.info("===============get record success==============")
          log.info(res.data[0])
          resolve(res.data[0])
        } else{
          reject('no record')
        }
      }).catch(err => {
        console.log("===============get record failed==============")
        console.error(err)
        log.info("===============get record failed==============")
        log.error(err)
        reject(err)
      })
    } else {
      console.log("===============get history record==============")
      console.log(record)
      log.info("===============get history record==============")
      log.info(record)
      resolve(record)
    }
  })
}

function updateRecord(values) {
  return new Promise((resolve, reject) => {
    const record = wx.getStorageSync('record')
    if (record === '' || record === undefined) {
      console.log("===============add record==============")
      log.info("===============add record==============")
      db.collection('record').add({
        data: values
      }).then(res => {
        console.log("===============add record success==============")
        console.log(res)
        log.info("===============add record success==============")
        log.info(res)
        resolve(res)
      }).catch(err => {
        console.log("===============add record failed==============")
        console.error(err)
        log.info("===============add record failed==============")
        log.error(err)
        reject(err)
      })
    }
    else {
      console.log("===============update record==============")
      log.info("===============update record==============")
      db.collection('record').doc(record._id).update({
        data: values
      }).then(res => {
        console.log("===============update record success==============")
        console.log(res)
        log.info("===============update record success==============")
        log.info(res)
        resolve(res)
      }).catch(err => {
        console.log("===============update record failed==============")
        console.error(err)
        log.info("===============update record failed==============")
        log.error(err)
        reject(err)
      })
    }

  })
}

module.exports = {
  getRecord: getRecord,
  updateRecord: updateRecord
}