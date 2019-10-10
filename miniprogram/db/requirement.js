var log = require('../utils/log.js')
const db = wx.cloud.database() // 初始化数据库
const _ = db.command

const values = {
  "年龄": "不限",
  "学历": "不限",
  "身高": "不限",
  "职业": "不限",
  "收入": "不限",
  "房车情况": "不限",
  "婚姻情况": "不限",
  "何时结婚": "不限",
  "是否吸烟": "不限",
  "是否喝酒": "不限",
  "是否打牌": "不限"
}

function getRequirement(update) {
  return new Promise((resolve, reject) => {
    console.log("===============get requirement==============")
    console.log('===========get requirement===========')
    const requirement = wx.getStorageSync('requirement')
    if (requirement === '' || requirement === undefined || update === true) {
      const openid = wx.getStorageSync('openid')
      db.collection('requirement').where({
        _openid: openid,
      }).get().then(res => {
        if (res.data.length >= 1) {
          wx.setStorageSync('requirement', res.data[0])
          console.log("===============get requirement success==============")
          console.log(res.data[0])
          log.info("===============get requirement success==============")
          log.info(res.data[0])
          resolve(res.data[0])
        } else {
          console.log("===============requirement not exist==============")
          log.info("===============requirement not exist==============")
          reject('no requirement')
        }
      }).catch(err => {
        console.log("===============get requirement failed==============")
        console.error(err)
        log.info("===============get requirement failed==============")
        log.error(err)
        reject(err)
      })
    } else {
      console.log("===============get history requirement==============")
      console.log(requirement)
      log.info("===============get history requirement==============")
      log.info(requirement)
      resolve(requirement)
    }
  })
}

function getRequirementByOpenid(openid) {
  return new Promise((resolve, reject) => {
    console.log("===============get requirement==============")
    log.info("===============get requirement==============")
    db.collection('requirement').where({
      _openid: openid,
    }).get().then(res => {
      if (res.data.length >= 1) {
        console.log("===============get requirement success==============")
        console.log(res.data[0])
        log.info("===============get requirement success==============")
        log.info(res.data[0])
        resolve(res.data[0])
      } else {
        console.log("===============requirement not exist==============")
        log.info("===============requirement not exist==============")
        reject('no requirement')
      }
    }).catch(err => {
      console.log("===============get requirement failed==============")
      console.error(err)
      log.info("===============get requirement failed==============")
      log.error(err)
      reject(err)
    })
  })
}

function updateRequirement(values) {
  return new Promise((resolve, reject) => {
    console.log("===============update requirement==============")
    log.info("===============update requirement==============")
    const openid = wx.getStorageSync('openid')
    db.collection('requirement').doc(openid).set({
      data: values
    }).then(res => {
      console.log("===============update requirement success==============")
      console.log(res)
      log.info("===============update requirement success==============")
      log.info(res)
      resolve(res)
    }).catch(err => {
      console.log("===============update requirement failed==============")
      console.error(err)
      log.info("===============update requirement failed==============")
      log.error(err)
      reject(err)
    })
  })
}

module.exports = {
  getRequirement: getRequirement,
  getRequirementByOpenid: getRequirementByOpenid,
  updateRequirement: updateRequirement
}