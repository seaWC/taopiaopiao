// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
var rp = require('request-promise');

// 云函数入口函数
exports.main = async (event, context) => {
  return rp(`https://movie.douban.com/j/search_subjects?type=${event.type}&tag=${event.tag}&sort=${event.sort}&page_limit=${event.page_limit}&page_start=${event.page_start}`)
    .then(function (res) {
      console.log(res)
      return res;
    })
    .catch(function (err) {
      // Crawling failed...
      console.log(err)
    });
}