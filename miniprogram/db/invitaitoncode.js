const util = require('../utils/util.js')
const db = wx.cloud.database() // 初始化数据库
const _ = db.command

const values = {
  "code": '',
  "expire": util.getDate(),
  "userid": ''
}

function getInvitaitonCode(update) {
  return new Promise((resolve, reject) => {
    console.log("===============get invitaitoncode==============")
    const codes = wx.getStorageSync('invitaitoncode')
    if (codes === '' || codes === undefined || update === true) {
      db.collection('invitaitoncode').where({
        "code": _.neq(''),
        "expire": _.gte(new Date()),
        "userid": _.eq('')
      })
        .field({
          "code": true
        })
        .get().then(res => {
          if (res.data.length >= 1) {
            console.log("===============get invitaitoncode success==============")
            wx.setStorageSync('invitaitoncode', res.data)
            resolve(res.data)
          } else {
            reject('no invitaitoncode')
          }
        }).catch(err => {
          console.log("===============get invitaitoncode failed==============")
          console.error(err)
          reject(err)
        })
    } else {
      console.log("===============get invitaitoncode record==============")
      resolve(codes)
    }
  })
}

function checkInvitaitonCode(code) {
  return new Promise((resolve, reject) => {
    console.log("===============check invitaitoncode==============")
    db.collection('invitaitoncode').where({
      "code": _.eq(code),
      "expire": _.gte(new Date()),
      "userid": _.eq('')
    })
    .field({
      "code": true
    })
    .get().then(res => {
      if (res.data.length >= 1) {
        console.log("===============check invitaitoncode success==============")
        resolve(res.data[0])
      } else {
        reject('no invitaitoncode')
      }
    }).catch(err => {
      console.log("===============check invitaitoncode failed==============")
      console.error(err)
      reject(err)
    })
  })
}

function createInvitaitonCode(num) {
  return new Promise((resolve, reject) => {
    for (var i = 0; i < num; i++) {
      const values = {
        "code": util.uuid(),
        "expire": util.getExpire(),
        "userid": ''
      }
      db.collection('invitaitoncode').add({
        data: values
      }).then(res => {
        console.log("===============add invitaitoncode success==============")
        resolve(res)
      }).catch(err => {
        console.log("===============add invitaitoncode failed==============")
        console.error(err)
        reject(err)
      })
    }
  })
}

module.exports = {
  getInvitaitonCode,
  checkInvitaitonCode,
  createInvitaitonCode
}