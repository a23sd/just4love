// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    var data = event.data;
    console.log(data);
    var db_object;
    if (data.collection) {
      db_object = db.collection(data.collection);
    }
    for (var i in data){
      console.log(9999);
      eval("console.log(777)");
      switch(i){
        case "where":
          db_object = db_object.where(data[i]);
          break;
        
        default:
      } 
    }

    if (data.update){
      var update = data.update;
      const wxContext = cloud.getWXContext();
      update.data.write_openid = wxContext.OPENID;
      update.data.write_date=db.serverDate();
      console.log(update);
      db_object = db_object.update(update);
    } else if(data.add){
      const wxContext = cloud.getWXContext();
      var add = data.add;
      add.data._openid = wxContext.OPENID;
      add.data.create_openid=wxContext.OPENID;
      add.data.create_date = db.serverDate();
      add.data.write_openid = wxContext.OPENID;
      add.data.write_date = db.serverDate();
      console.log(add);
      db_object = db_object.add(add);
    } else if (data.remove) {
      db_object = db_object.remove(data.remove);
    }
    
    return await db_object
  } catch (e) {
    console.error(e)
  }
}