var log = require('../utils/log.js')
const db = wx.cloud.database() // 初始化数据库

function addImage(fileName) {
  return new Promise((resolve, reject) => {
    console.log("===============add image==============")
    log.info("===============add image==============")
    db.collection('image').add({
      data: {
        fileName: fileName
      }
    }).then(res => {
      console.log("===============add image success==============")
      console.log(res)
      log.info("===============add image success==============")
      log.info(res)
      resolve(res)
    }).catch(err => {
      console.log("===============add image failed==============")
      console.error(err)
      log.info("===============add image failed==============")
      log.error(err)
      reject(err)
    })
  })
}

module.exports = {
  addImage
}