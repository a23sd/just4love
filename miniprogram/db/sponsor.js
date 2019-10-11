var log = require('../utils/log.js')
const db = wx.cloud.database() // 初始化数据库
const _ = db.command

function getSponsor() {
  return new Promise((resolve, reject) => {
    console.log("===============get sponsor==============")
    db.collection('sponsor')
      .get()
      .then(res => {
        if (res.data.length >= 1) {
          console.log("===============get sponsor success==============")
          resolve(res.data)
        } else {
          reject('no sponsor')
        }
      }).catch(err => {
        console.log("===============get sponsor failed==============")
        console.error(err)
        reject(err)
      })
  })
}

function addSponsor(name, content) {
  return new Promise((resolve, reject) => {
    db.collection('sponsor').add({
      data: {
        "赞助商": name,
        "赞助内容": content
      }
    }).then(res => {
      console.log("===============add sponsor success==============")
      resolve(res)
    }).catch(err => {
      console.log("===============add sponsor failed==============")
      console.error(err)
      reject(err)
    })
  })
}

module.exports = {
  getSponsor,
  addSponsor
}