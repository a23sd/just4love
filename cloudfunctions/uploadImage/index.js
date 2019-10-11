// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const fileName = event.fileName
  var fileBuffer = new Buffer(event.file, 'base64') 

  const fileID = await new Promise((reslove, reject) => {
    cloud.uploadFile({
      cloudPath: "images/" + fileName,
      fileContent: fileBuffer,
    }).then(res => {
      console.log(res.fileID)
      reslove(res.fileID)
    }).catch(err => {
      console.log(err)
      reject(err)
    })
  })

  const thumbFileID = await new Promise((reslove, reject) => {
    cloud.uploadFile({
      cloudPath: "thumbs/" + fileName,
      fileContent: fileBuffer,
    }).then(res => {
      console.log(res.fileID)
      reslove(res.fileID)
    }).catch(err => {
      console.log(err)
      reject(err)
    })
  })
  return {
    fileID: fileID,
    thumbFileID: thumbFileID
  }
}