const db = wx.cloud.database() // 初始化数据库
const _ = db.command
const eduList = ['专科', '本科', '硕士', '博士']
const marryList = ['认同闪婚', '一年内', '二年内', '三年内', '时机成熟就结婚']
const smokingList = ['不吸烟', '稍微抽一点烟', '社交场合会抽烟', '烟抽的很多']
const drinkList = ['不喝酒', '稍微喝一点酒', '社交场合会喝酒', '酒喝的很多']
const cardList = ['不打牌', '稍微打一点牌', '社交场合会打牌', '牌抽的很多']
const incomeList = ['3000-5000元', '5000-8000元', '8000-12000元', '12000-20000元', '20000-30000元', '30000-40000元', '40000-50000元', '50000元以上']

const values = {
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
  "爱情宣言": "",
  "心仪": [],
  "屏蔽": [],
  "show": true,
  "enable": true,
  "vip": false,
  "admin": false
}

function getOpenid() {
  return new Promise(function(resolve, reject) {
    console.log("===============get openid==============")
    const openid = wx.getStorageSync('openid')
    if (openid === '' || openid === undefined) {
      wx.cloud.callFunction({
        name: 'login',
      }).then(res => {
        console.log("===============get openid success==============")
        wx.setStorageSync('openid', res.result.openid); //存储openid 
        console.log(res.result.openid)
        resolve(res.result.openid)
      }).catch(err => {
        console.log("===============get openid failed==============")
        console.error(err)
        reject('请求失败')
      })
    } else {
      console.log("===============get history openid==============")
      console.log(openid)
      resolve(openid)
    }
  })
}

function getUser(update) {
  return new Promise((resolve, reject) => {
    console.log("===============get user==============")
    const user = wx.getStorageSync('user')
    if (user === '' || user === undefined || update === true) {
      const openid = wx.getStorageSync('openid')
      db.collection('user').where({
        _openid: openid,
      }).get().then(res => {
        if (res.data.length >= 1) {
          console.log("===============get user success==============")
          var userInfo = res.data[0]
          if (userInfo.enable === false) {
            reject('refuse to use')
          } else {
            wx.setStorageSync('user', userInfo)
            console.log(userInfo)
            resolve(userInfo)
          }
        } else {
          console.log("===============user not exist==============")
          reject('no user')
        }
      }).catch(err => {
        console.log("===============get user failed==============")
        console.error(err)
        reject(err)
      })
    } else {
      console.log("===============get history user==============")
      console.log(user)
      resolve(user)
    }
  })
}

function getUserByOpenid(openid) {
  return new Promise((resolve, reject) => {
    console.log("===============get user==============")
    db.collection('user').where({
      _openid: openid,
    }).get().then(res => {
      if (res.data.length >= 1) {
        console.log("===============get user success==============")
        var userInfo = res.data[0]
        if (userInfo.enable === false) {
          reject('refuse to use')
        } else {
          userInfo.生日 = new Date(userInfo.生日)
          if (userInfo.生日 !== '请选择') {
            userInfo.生日 = [userInfo.生日.getFullYear(), userInfo.生日.getMonth() + 1, userInfo.生日.getDate()].join('-')
          }
          userInfo.身高 = userInfo.身高 + 'cm'
          userInfo.体重 = userInfo.体重 + 'kg'
          resolve(userInfo)
        }
      } else {
        console.log("===============user not exist==============")
        reject('no user')
      }
    }).catch(err => {
      console.log("===============get user failed==============")
      console.error(err)
      reject(err)
    })
  })
}

function updateUser(values) {
  return new Promise((resolve, reject) => {
    console.log("===============update user==============")
    const openid = wx.getStorageSync('openid')
    db.collection('user').doc(openid).set({
      data: values
    }).then(res => {
      console.log("===============update user success==============")
      resolve(res)
    }).catch(err => {
      console.log("===============update user failed==============")
      console.error(err)
      reject(err)
    })
  })
}

function updateUserStatus(id, values) {
  return new Promise((resolve, reject) => {
    console.log("===============update user status==============")
    console.log(id)
    console.log(values)
    db.collection('user').doc(id).update({
      data: {
        vip: false
      }
    }).then(res => {
      console.log("===============update user status success==============")
      resolve(res)
      console.log(res)
    }).catch(err => {
      console.log("===============update user status failed==============")
      console.error(err)
      reject(err)
    })
  })
}

function getVip() {
  return new Promise((resolve, reject) => {
    var condition = {}
    const user = wx.getStorageSync('user')
    if (user.性别 === '男') {
      condition['性别'] = '女'
    } else if (user.性别 === '女') {
      condition['性别'] = '男'
    }
    condition['vip'] = true
    condition['show'] = true
    condition['enable'] = true
    console.log('===========get vip===========')
    console.log(condition)
    db.collection('user')
      .where(condition)
      .field({
        _openid: true,
        姓名: true,
        性别: true,
        生日: true,
        学历: true,
        身高: true,
        体重: true,
        职业: true,
        工作地: true,
        照片: true,
        缩略图: true,
        心仪: true
      })
      .get().then(res => {
        res.data.map(function(obj) {
          if (obj.照片.length == 0 || obj.缩略图.length == 0) {
            obj.照片 = "/images/notfound.jpg"
            obj.缩略图 = "/images/notfound.jpg"
          } else {
            obj.照片 = obj.照片[0]
            obj.缩略图 = obj.缩略图[0]
          }
          obj.生日 = new Date(obj.生日)
          obj.生日 = [obj.生日.getFullYear(), obj.生日.getMonth() + 1, obj.生日.getDate()].join('-')
          obj.身高 = obj.身高 + 'cm'
          obj.体重 = obj.体重 + 'kg'
          console.log(obj.心仪)
          if (obj.心仪.indexOf(user._openid) > -1) {
            obj.被心仪 = '心仪你'
          } else {
            obj.被心仪 = '推荐'
          }
          if (user.心仪.indexOf(obj._openid) > -1) {
            obj.心仪 = true
          } else {
            obj.心仪 = false
          }
          if (user.屏蔽.indexOf(obj._openid) > -1) {
            obj.屏蔽 = true
          } else {
            obj.屏蔽 = false
          }
          return obj;
        })
        var data = res.data.filter(function(obj) {
          return obj.屏蔽 == false
        })
        console.log("===============get vip success==============")
        resolve(data)
      }).catch(err => {
        console.log("===============get vip failed==============")
        console.error(err)
        reject(err)
      })
  })
}

function getRecommend(skip, size, fields, order) {
  return new Promise((resolve, reject) => {
    var condition = {}
    const user = wx.getStorageSync('user')
    const requireInfo = wx.getStorageSync('requirement')
    if (user.性别 === '男') {
      condition['性别'] = '女'
    } else if (user.性别 === '女') {
      condition['性别'] = '男'
    }
    condition['show'] = true
    condition['enable'] = true
    console.log(requireInfo)
    for (var key in requireInfo) {
      if (key === '_id' || key === '_openid' || requireInfo[key] === '不限') {
        continue;
      } else if (key === '年龄') {
        var age = requireInfo[key]
        console.log("=======================")
        console.log(age)
        if (age.indexOf("年及以上") > -1) {
          age = age.substring(0, age.indexOf("年及以上") - 1)
          var fromDate = new Date(parseInt(age), 0, 1)
          condition['生日'] = _.gte(fromDate)
        } else if (age.indexOf("年及以下") > -1) {
          age = age.substring(0, age.indexOf("年及以下") - 1)
          var toDate = new Date(parseInt(age), 11, 31)
          condition['生日'] = _.lte(toDate)
        } else if (age.indexOf("-") > -1) {
          var ageArr = age.split('-')
          var ageFrom = ageArr[0].substring(0, ageArr[0].indexOf("年"))
          var ageTo = ageArr[1].substring(0, ageArr[1].indexOf("年"))
          var fromDate = new Date(parseInt(ageFrom), 0, 1)
          var toDate = new Date(parseInt(ageTo), 11, 31)
          condition['生日'] = _.gte(fromDate).and(_.lte(toDate))
        } else {
          age = age.substring(0, age.indexOf("年"))
          var fromDate = new Date(parseInt(age), 0, 1)
          var toDate = new Date(parseInt(age), 11, 31)
          condition['生日'] = _.gte(fromDate).and(_.lte(toDate))
        }
      } else if (key == '身高') {
        var height = requireInfo[key]
        if (height.indexOf("cm及以上") > -1) {
          height = height.substring(0, height.indexOf("cm及以上"))
          condition[key] = _.gte(parseInt(height) + 1).and(_.lte(parseInt(250)))
        } else if (height.indexOf("cm及以下") > -1) {
          height = height.substring(0, height.indexOf("cm及以下"))
          condition[key] = _.gte(parseInt(0)).and(_.lte(parseInt(height) - 1))
        } else if (height.indexOf("-") > -1) {
          var heightArr = height.split('-')
          var heightFrom = heightArr[0].substring(0, heightArr[0].indexOf("cm"))
          var heightTo = heightArr[1].substring(0, heightArr[1].indexOf("cm"))
          condition[key] = _.gte(parseInt(heightFrom)).and(_.lte(parseInt(heightTo)))
        } else {
          height = height.substring(0, height.indexOf("cm"))
          condition[key] = _.eq(parseInt(height))
        }
      } else if (key == '体重') {
        var weight = requireInfo[key]
        if (weight.indexOf("kg及以上") > -1) {
          weight = weight.substring(0, weight.indexOf("kg及以上"))
          condition[key] = _.gte(parseInt(weight) + 1).and(_.lte(parseInt(150)))
        } else if (weight.indexOf("kg及以下") > -1) {
          weight = weight.substring(0, weight.indexOf("kg及以下"))
          condition[key] = _.gte(parseInt(0)).and(_.lte(parseInt(weight) - 1))
        } else if (weight.indexOf("-") > -1) {
          var weightArr = weight.split('-')
          var weightFrom = weightArr[0].substring(0, weightArr[0].indexOf("kg"))
          var weightTo = weightArr[1].substring(0, weightArr[1].indexOf("kg"))
          condition[key] = _.gte(parseInt(weightFrom)).and(_.lte(parseInt(weightTo)))
        } else {
          weight = weight.substring(0, weight.indexOf("kg"))
          condition[key] = _.eq(parseInt(weight))
        }
      } else if (key == '学历') {
        var edu = requireInfo[key]
        if (edu.indexOf("及以上") > -1) {
          edu = edu.substring(0, edu.indexOf("及以上"))
          const edus = eduList.slice(eduList.indexOf(edu))
          condition[key] = _.in(edus)
        } else if (edu.indexOf("及以下") > -1) {
          edu = edu.substring(0, edu.indexOf("及以下"))
          const edus = eduList.slice(0, eduList.indexOf(edu) + 1)
          condition[key] = _.in(edus)
        } else if (edu.indexOf("-") > -1) {
          var eduArr = edu.split('-')
          var eduFrom = eduArr[0]
          var eduTo = eduArr[1]
          const edus = eduList.slice(eduList.indexOf(eduFrom), eduList.indexOf(eduTo) + 1)
          condition[key] = _.in(edus)
        } else {
          condition[key] = requireInfo[key]
        }
      } else if (key == '何时结婚') {
        condition[key] = _.in(marryList.slice(0, marryList.indexOf(requireInfo[key]) + 1))
      } else if (key == '是否吸烟') {
        condition[key] = _.in(smokingList.slice(0, smokingList.indexOf(requireInfo[key]) + 1))
      } else if (key == '是否喝酒') {
        condition[key] = _.in(drinkList.slice(0, drinkList.indexOf(requireInfo[key]) + 1))
      } else if (key == '是否打牌') {
        condition[key] = _.in(cardList.slice(0, cardList.indexOf(requireInfo[key]) + 1))
      } else if (key == '收入') {
        var income = requireInfo[key]
        var idx = 0
        income = income.substring(0, income.indexOf("元以上")) + '-'
        for (var i = 0; i < incomeList.length; i++) {
          if (incomeList[i].startsWith(income)) {
            idx = i
            break
          }
        }
        condition[key] = _.in(incomeList.slice(idx, incomeList.length))
      } else {
        condition[key] = requireInfo[key]
      }
    }
    console.log('===========get recommend===========')
    console.log(condition)
    console.log(fields)
    console.log(order)
    db.collection('user')
      .orderBy(fields[0], order)
      .orderBy(fields[1], order)
      .orderBy(fields[2], order)
      .where(condition)
      .skip(skip)
      .limit(size)
      .field({
        _openid: true,
        姓名: true,
        性别: true,
        生日: true,
        学历: true,
        身高: true,
        体重: true,
        职业: true,
        工作地: true,
        照片: true,
        缩略图: true,
        心仪: true
      })
      .get().then(res => {
        res.data.map(function(obj) {
          if (obj.照片.length == 0 || obj.缩略图.length == 0) {
            obj.照片 = "/images/notfound.jpg"
            obj.缩略图 = "/images/notfound.jpg"
          } else {
            obj.照片 = obj.照片[0]
            obj.缩略图 = obj.缩略图[0]
          }
          obj.生日 = new Date(obj.生日)
          obj.生日 = [obj.生日.getFullYear(), obj.生日.getMonth() + 1, obj.生日.getDate()].join('-')
          obj.身高 = obj.身高 + 'cm'
          obj.体重 = obj.体重 + 'kg'
          if (obj.心仪.indexOf(user._openid) > -1) {
            obj.被心仪 = '心仪你'
          } else {
            obj.被心仪 = ''
          }
          if (user.心仪.indexOf(obj._openid) > -1) {
            obj.心仪 = true
          } else {
            obj.心仪 = false
          }
          if (user.屏蔽.indexOf(obj._openid) > -1) {
            obj.屏蔽 = true
          } else {
            obj.屏蔽 = false
          }
          return obj;
        });
        console.log("===============get recommend success==============")
        resolve(res.data)
      }).catch(err => {
        console.log("===============get recommend failed==============")
        console.error(err)
        reject(err)
      })
  })
}

function searchUser(keyword, skip, size, fields, order) {
  return new Promise((resolve, reject) => {
    if (keyword === '') {
      reject('no keyword')
    }
    const user = wx.getStorageSync('user')
    if (user.性别 === '男') {
      var sex = '女'
    } else if (user.性别 === '女') {
      var sex = '男'
    }
    var condition = _.or([{
        姓名: db.RegExp({
          regexp: `.*${keyword}.*`,
          options: 'i',
        }),
        性别: sex,
        show: true,
        enable: true
      },
      {
        学历: keyword,
        性别: sex,
        show: true,
        enable: true
      },
      {
        身高: parseInt(keyword),
        性别: sex,
        show: true,
        enable: true
      },
      {
        体重: parseInt(keyword),
        性别: sex,
        show: true,
        enable: true
      },
      {
        工作地: db.RegExp({
          regexp: `.*${keyword}.*`,
          options: 'i',
        }),
        性别: sex,
        show: true,
        enable: true
      },
      {
        职业: db.RegExp({
          regexp: `.*${keyword}.*`,
          options: 'i',
        }),
        性别: sex,
        show: true,
        enable: true
      }
    ])
    console.log('===========search user===========')
    console.log(condition)
    db.collection('user')
      .orderBy(fields[0], order)
      .orderBy(fields[1], order)
      .orderBy(fields[2], order)
      .where(condition)
      .skip(skip)
      .limit(size)
      .field({
        _openid: true,
        姓名: true,
        性别: true,
        生日: true,
        学历: true,
        身高: true,
        体重: true,
        职业: true,
        工作地: true,
        照片: true,
        缩略图: true,
        心仪: true
      }).get().then(res => {
        res.data.map(function(obj) {
          if (obj.照片.length == 0 || obj.缩略图.length == 0) {
            obj.照片 = "/images/notfound.jpg"
            obj.缩略图 = "/images/notfound.jpg"
          } else {
            obj.照片 = obj.照片[0]
            obj.缩略图 = obj.缩略图[0]
          }
          obj.生日 = new Date(obj.生日)
          obj.生日 = [obj.生日.getFullYear(), obj.生日.getMonth() + 1, obj.生日.getDate()].join('-')
          obj.身高 = obj.身高 + 'cm'
          obj.体重 = obj.体重 + 'kg'
          if (obj.心仪.indexOf(user._openid) > -1) {
            obj.被心仪 = '心仪你'
          } else {
            obj.被心仪 = ''
          }
          if (user.心仪.indexOf(obj._openid) > -1) {
            obj.心仪 = true
          } else {
            obj.心仪 = false
          }
          if (user.屏蔽.indexOf(obj._openid) > -1) {
            obj.屏蔽 = true
          } else {
            obj.屏蔽 = false
          }
          return obj;
        });
        console.log("===============search success==============")
        console.log(res.data)
        resolve(res.data)
      }).catch(err => {
        console.log("===============search failed==============")
        console.error(err)
        reject(err)
      })
  })
}

function filterUser(selectItem, skip, size, fields, order) {
  return new Promise((resolve, reject) => {
    console.log(selectItem)
    var condition = {};
    const user = wx.getStorageSync('user')
    if (user.性别 === '男') {
      condition['性别'] = '女'
    } else if (user.性别 === '女') {
      condition['性别'] = '男'
    }
    for (var obj of selectItem) {
      if (obj.values.length === 0 || obj.values[0] === '不限') {
        continue;
      } else if (obj.text == '年龄') {
        if (obj.values.length === 1) {
          var fromDate = new Date(obj.values[0], 0, 1)
          var toDate = new Date(obj.values[0], 11, 31)
          condition[obj.text] = _.gte(fromDate).and(_.lte(toDate))
        } else {
          obj.values.sort()
          console.log(obj.values)
          var fromDate = new Date(obj.values[0], 0, 1)
          var toDate = new Date(obj.values[1], 11, 31)
          condition['生日'] = _.gte(fromDate).and(_.lte(toDate))
        }
      } else if (obj.text == '身高') {
        if (obj.values.length === 1) {
          condition[obj.text] = obj.values[0]
        } else {
          obj.values.sort()
          condition[obj.text] = _.gte(obj.values[0]).and(_.lte(obj.values[1]))
        }
      } else if (obj.text == '学历') {
        if (obj.values.length === 1) {
          condition[obj.text] = obj.values[0]
        } else {
          obj.values.sort(function(a, b) {
            return eduList.indexOf(a) - eduList.indexOf(b)
          })
          const idx0 = eduList.indexOf(obj.values[0])
          const idx1 = eduList.indexOf(obj.values[1]) + 1
          const edus = eduList.slice(idx0, idx1)
          condition[obj.text] = _.in(edus)
        }
      } else if (obj.text == '何时结婚') {
        condition[obj.text] = _.in(marryList.slice(0, marryList.indexOf(obj.values[0]) + 1))
      } else if (obj.text == '是否吸烟') {
        condition[obj.text] = _.in(smokingList.slice(0, smokingList.indexOf(obj.values[0]) + 1))
      } else if (obj.text == '是否喝酒') {
        condition[obj.text] = _.in(drinkList.slice(0, drinkList.indexOf(obj.values[0]) + 1))
      } else if (obj.text == '是否打牌') {
        condition[obj.text] = _.in(cardList.slice(0, cardList.indexOf(obj.values[0]) + 1))
      } else if (obj.text == '收入') {
        var income = obj.values[0]
        var idx = 0
        income = income.substring(0, income.indexOf("元以上")) + '-'
        for (var i = 0; i < incomeList.length; i++) {
          if (incomeList[i].startsWith(income)) {
            idx = i
            break
          }
        }
        condition[obj.text] = _.in(incomeList.slice(idx, incomeList.length))
      } else {
        condition[obj.text] = obj.values[0]
      }
    }
    condition['show'] = true
    condition['enable'] = true
    console.log('===========filter user===========')
    console.log(condition)
    db.collection('user')
      .orderBy(fields[0], order)
      .orderBy(fields[1], order)
      .orderBy(fields[2], order)
      .where(condition)
      .skip(skip)
      .limit(size)
      .field({
        _openid: true,
        姓名: true,
        性别: true,
        生日: true,
        学历: true,
        身高: true,
        体重: true,
        职业: true,
        工作地: true,
        照片: true,
        缩略图: true,
        心仪: true
      }).get().then(res => {
        res.data.map(function(obj) {
          if (obj.照片.length == 0 || obj.缩略图.length == 0) {
            obj.照片 = "/images/notfound.jpg"
            obj.缩略图 = "/images/notfound.jpg"
          } else {
            obj.照片 = obj.照片[0]
            obj.缩略图 = obj.缩略图[0]
          }
          obj.生日 = new Date(obj.生日)
          obj.生日 = [obj.生日.getFullYear(), obj.生日.getMonth() + 1, obj.生日.getDate()].join('-')
          obj.身高 = obj.身高 + 'cm'
          obj.体重 = obj.体重 + 'kg'
          if (obj.心仪.indexOf(user._openid) > -1) {
            obj.被心仪 = '心仪你'
          } else {
            obj.被心仪 = ''
          }
          if (user.心仪.indexOf(obj._openid) > -1) {
            obj.心仪 = true
          } else {
            obj.心仪 = false
          }
          if (user.屏蔽.indexOf(obj._openid) > -1) {
            obj.屏蔽 = true
          } else {
            obj.屏蔽 = false
          }
          return obj;
        });
        console.log("===============filter success==============")
        console.log(res.data)
        resolve(res.data)
      }).catch(err => {
        console.log("===============filter failed==============")
        console.error(err)
        reject(err)
      })
  })
}

function getFavorite(skip, size) {
  return new Promise((resolve, reject) => {
    console.log('===========get favorite===========')
    const user = wx.getStorageSync('user')
    var condition = {}
    condition['show'] = true
    condition['enable'] = true
    condition['_openid'] = _.in(user.心仪)
    console.log(condition)
    db.collection('user')
      .where(condition)
      .skip(skip)
      .limit(size)
      .field({
        _openid: true,
        姓名: true,
        性别: true,
        生日: true,
        学历: true,
        身高: true,
        体重: true,
        职业: true,
        工作地: true,
        照片: true,
        缩略图: true,
        心仪: true
      })
      .get().then(res => {
        res.data.map(function(obj) {
          if (obj.照片.length == 0 || obj.缩略图.length == 0) {
            obj.照片 = "/images/notfound.jpg"
            obj.缩略图 = "/images/notfound.jpg"
          } else {
            obj.照片 = obj.照片[0]
            obj.缩略图 = obj.缩略图[0]
          }
          obj.生日 = new Date(obj.生日)
          obj.生日 = [obj.生日.getFullYear(), obj.生日.getMonth() + 1, obj.生日.getDate()].join('-')
          obj.身高 = obj.身高 + 'cm'
          obj.体重 = obj.体重 + 'kg'
          if (obj.心仪.indexOf(user._openid) > -1) {
            obj.被心仪 = '心仪你'
          } else {
            obj.被心仪 = ''
          }
          if (user.心仪.indexOf(obj._openid) > -1) {
            obj.心仪 = true
          } else {
            obj.心仪 = false
          }
          if (user.屏蔽.indexOf(obj._openid) > -1) {
            obj.屏蔽 = true
          } else {
            obj.屏蔽 = false
          }
          return obj;
        })
        console.log("===============get favorite success==============")
        resolve(res.data)
      }).catch(err => {
        console.log("===============update favorite failed==============")
        console.error(err)
        reject(err)
      })
  })
}

function getIgnore(skip, size) {
  return new Promise((resolve, reject) => {
    console.log('===========get ignore===========')
    const user = wx.getStorageSync('user')
    var condition = {}
    condition['show'] = true
    condition['enable'] = true
    condition['_openid'] = _.in(user.屏蔽)
    console.log(condition)
    db.collection('user')
      .where(condition)
      .skip(skip)
      .limit(size)
      .field({
        _openid: true,
        姓名: true,
        性别: true,
        生日: true,
        学历: true,
        身高: true,
        体重: true,
        职业: true,
        工作地: true,
        照片: true,
        缩略图: true,
        心仪: true
      })
      .get().then(res => {
        res.data.map(function(obj) {
          if (obj.照片.length == 0 || obj.缩略图.length == 0) {
            obj.照片 = "/images/notfound.jpg"
            obj.缩略图 = "/images/notfound.jpg"
          } else {
            obj.照片 = obj.照片[0]
            obj.缩略图 = obj.缩略图[0]
          }
          obj.生日 = new Date(obj.生日)
          obj.生日 = [obj.生日.getFullYear(), obj.生日.getMonth() + 1, obj.生日.getDate()].join('-')
          obj.身高 = obj.身高 + 'cm'
          obj.体重 = obj.体重 + 'kg'
          if (obj.心仪.indexOf(user._openid) > -1) {
            obj.被心仪 = '心仪你'
          } else {
            obj.被心仪 = ''
          }
          if (user.心仪.indexOf(obj._openid) > -1) {
            obj.心仪 = true
          } else {
            obj.心仪 = false
          }
          if (user.屏蔽.indexOf(obj._openid) > -1) {
            obj.屏蔽 = true
          } else {
            obj.屏蔽 = false
          }
          return obj;
        })
        console.log("===============get ignore success==============")
        resolve(res.data)
      }).catch(err => {
        console.log("===============update ignore failed==============")
        console.error(err)
        reject(err)
      })
  })
}

function getUsers(skip, size) {
  return new Promise((resolve, reject) => {
    db.collection('user')
      .skip(skip)
      .limit(size)
      .field({
        _openid: true,
        姓名: true,
        性别: true,
        生日: true,
        学历: true,
        身高: true,
        体重: true,
        职业: true,
        工作地: true,
        照片: true,
        缩略图: true,
        心仪: true,
        "enable": true,
        "vip": true,
      })
      .get().then(res => {
        res.data.map(function(obj) {
          if (obj.照片.length == 0 || obj.缩略图.length == 0) {
            obj.照片 = "/images/notfound.jpg"
            obj.缩略图 = "/images/notfound.jpg"
          } else {
            obj.照片 = obj.照片[0]
            obj.缩略图 = obj.缩略图[0]
          }
          obj.生日 = new Date(obj.生日)
          obj.生日 = [obj.生日.getFullYear(), obj.生日.getMonth() + 1, obj.生日.getDate()].join('-')
          obj.身高 = obj.身高 + 'cm'
          obj.体重 = obj.体重 + 'kg'
          return obj;
        })
        console.log("===============get users success==============")
        resolve(res.data)
      }).catch(err => {
        console.log("===============get users failed==============")
        console.error(err)
        reject(err)
      })
  })
}

function searchUserByAdmin(keyword, skip, size) {
  return new Promise((resolve, reject) => {
    if (keyword === '') {
      reject('no keyword')
    }
    var condition = _.or([{
        姓名: db.RegExp({
          regexp: `.*${keyword}.*`,
          options: 'i',
        })
      },
      {
        微信: db.RegExp({
          regexp: `.*${keyword}.*`,
          options: 'i',
        })
      },
      {
        学历: keyword,
      },
      {
        身高: parseInt(keyword),
      },
      {
        体重: parseInt(keyword),
      },
      {
        工作地: db.RegExp({
          regexp: `.*${keyword}.*`,
          options: 'i',
        })
      },
      {
        职业: db.RegExp({
          regexp: `.*${keyword}.*`,
          options: 'i',
        })
      }
    ])
    console.log('===========search user by admin===========')
    console.log(condition)
    db.collection('user')
      .where(condition)
      .skip(skip)
      .limit(size)
      .field({
        _openid: true,
        姓名: true,
        性别: true,
        生日: true,
        学历: true,
        身高: true,
        体重: true,
        职业: true,
        工作地: true,
        照片: true,
        缩略图: true,
        心仪: true
      }).get().then(res => {
        res.data.map(function(obj) {
          if (obj.照片.length == 0 || obj.缩略图.length == 0) {
            obj.照片 = "/images/notfound.jpg"
            obj.缩略图 = "/images/notfound.jpg"
          } else {
            obj.照片 = obj.照片[0]
            obj.缩略图 = obj.缩略图[0]
          }
          obj.生日 = new Date(obj.生日)
          obj.生日 = [obj.生日.getFullYear(), obj.生日.getMonth() + 1, obj.生日.getDate()].join('-')
          obj.身高 = obj.身高 + 'cm'
          obj.体重 = obj.体重 + 'kg'
          return obj;
        });
        console.log("===============search by admin success==============")
        console.log(res.data)
        resolve(res.data)
      }).catch(err => {
        console.log("===============search by admin failed==============")
        console.error(err)
        reject(err)
      })
  })
}

function getLikeMe(skip, size) {
  console.log('===========get like me===========')
  const openid = wx.getStorageSync('openid')
  const user = wx.getStorageSync('user')
  return new Promise((resolve, reject) => {
    db.collection('user')
      .where({
        心仪: openid
      })
      .skip(skip)
      .limit(size)
      .field({
        _openid: true,
        姓名: true,
        性别: true,
        生日: true,
        学历: true,
        身高: true,
        体重: true,
        职业: true,
        工作地: true,
        照片: true,
        缩略图: true,
        心仪: true,
        "enable": true,
        "vip": true,
      })
      .get().then(res => {
        console.log(res)
        res.data.map(function(obj) {
          if (obj.照片.length == 0 || obj.缩略图.length == 0) {
            obj.照片 = "/images/notfound.jpg"
            obj.缩略图 = "/images/notfound.jpg"
          } else {
            obj.照片 = obj.照片[0]
            obj.缩略图 = obj.缩略图[0]
          }
          obj.生日 = new Date(obj.生日)
          obj.生日 = [obj.生日.getFullYear(), obj.生日.getMonth() + 1, obj.生日.getDate()].join('-')
          obj.身高 = obj.身高 + 'cm'
          obj.体重 = obj.体重 + 'kg'
          if (obj.心仪.indexOf(user._openid) > -1) {
            obj.被心仪 = '心仪你'
          } else {
            obj.被心仪 = ''
          }
          if (user.心仪.indexOf(obj._openid) > -1) {
            obj.心仪 = true
          } else {
            obj.心仪 = false
          }
          if (user.屏蔽.indexOf(obj._openid) > -1) {
            obj.屏蔽 = true
          } else {
            obj.屏蔽 = false
          }
          return obj;
        })
        console.log("===============get like me success==============")
        resolve(res.data)
      }).catch(err => {
        console.log("===============get like me failed==============")
        console.error(err)
        reject(err)
      })
  })

}

module.exports = {
  getOpenid: getOpenid,
  getUser: getUser,
  getUserByOpenid: getUserByOpenid,
  updateUser: updateUser,
  updateUserStatus: updateUserStatus,
  getVip: getVip,
  getRecommend: getRecommend,
  searchUser: searchUser,
  filterUser: filterUser,
  getFavorite: getFavorite,
  getIgnore: getIgnore,
  getUsers: getUsers,
  searchUserByAdmin: searchUserByAdmin,
  getLikeMe: getLikeMe
}