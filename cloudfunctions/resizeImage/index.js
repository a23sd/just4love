// 云函数入口文件
const cloud = require('wx-server-sdk')
const tinify = require("tinify")

cloud.init()

const API_KEY_LIST = [
  '6zSQLjG9S0hprNWxH4QHCwQ2b4tHqq1H', 'shwkMtGDH15bpfKl096Pf1YnJppJmSyn', 'zTNkftk044mG1h7qs8ZF86vLWRfDC5x5', 'Dkg5bmNDXBTDCfBvTc5hcwtRZDH5NGlW'
]

tinify.key = API_KEY_LIST[Math.floor(Math.random() * API_KEY_LIST.length)]

// 云函数入口函数
exports.main = async (event, context) => {
  console.log("resizeImage")
  console.log(event.fileName)
  const fileName = event.fileName
  const basePath = "cloud://just4love-2xgjd.6a75-just4love-2xgjd-1300308339/thumbs/"
  const res = await cloud.downloadFile({
    fileID: basePath + fileName
  })

  var source = tinify.fromBuffer(res.fileContent)
  const resized = source.resize({
    method: "scale",
    width: 150
  })

  // resize
  const thumbFileID = await new Promise((reslove, reject) => {
    resized.toBuffer(function (err, resultData) {
      if (err) throw err;
      cloud.uploadFile({
        cloudPath: "thumbs/" + fileName,
        fileContent: resultData,
      }).then(res => {
        console.log(res.fileID)
        reslove(res.fileID)
      }).catch(err => {
        console.log(err)
        reject(err)
      })
    })
  })

  return {
    thumbFileID: thumbFileID
  }
}