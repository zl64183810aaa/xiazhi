// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

//引入request-promise
const rp = require("request-promise");
//添加入口函数
exports.main = async (event, context) => {
  //返回函数 发送请求
  var url = `http://api.douban.com/v2/movie/in_theaters?apikey=0df993c66c0c636e29ecbb5344252a4a&start=${event.start}&count=${event.count}`
  //返回函数结果
  return rp(url).then(res => {
    return res;
  }).catch(err => { console.log(err) })
}
// 云函数入口函数
/*
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}*/