const db = wx.cloud.database() // 初始化数据库
const _ = db.command

function getNotice() {
  return new Promise((resolve, reject) => {
    console.log("===============get notice==============")
    db.collection('notice')
      .orderBy('时间', 'desc')
      .get()
      .then(res => {
        if (res.data.length >= 1) {
          console.log("===============get notice success==============")
          wx.setStorageSync('notice', res.data[0])
          resolve(res.data[0])
        } else {
          reject('no notice')
        }
      }).catch(err => {
        console.log("===============get notice failed==============")
        console.error(err)
      reject(err)
    })
  })
}

function addNotice(msg) {
  return new Promise((resolve, reject) => {
    db.collection('notice').add({
      data: {
        "msg": msg,
        "时间": new Date()
      }
    }).then(res => {
      console.log("===============add notice success==============")
      resolve(res)
    }).catch(err => {
      console.log("===============add notice failed==============")
      console.error(err)
      reject(err)
    })
  })
}

module.exports = {
  getNotice,
  addNotice
}