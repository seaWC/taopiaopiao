// pages/movie/movie.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movieList: [],
    value: '',
    arr: [],
    tvList: [],   //电视
    tag: '热门',
    score: 5,
    tagsBtn: ["热门", "国产剧", "美剧", "韩剧", "港剧", "日本动画", "综艺"],
    num: 0
  },
  getMovieList: function () {
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'movielisttpp',
      data: {
        start: this.data.movieList.length,
        count: 10
      }
    }).then(res => {
      console.log(res)
      this.setData({
        movieList: this.data.movieList.concat(JSON.parse(res.result).subjects)
      })
      wx.hideLoading();
    }).catch(err => {
      console.log(err)
    })
  },
  getTvList: function () {
    wx.cloud.callFunction({
      name: 'tvlisttpp',
      data: {
        type: "tv",
        tag: encodeURI(this.data.tag),
        page_limit: 6,
        sort: "recommend",
        page_start: this.data.tvList.length
      }
    }).then(res => {
      console.log(res)
      this.setData({
        tvList: this.data.tvList.concat(JSON.parse(res.result).subjects)
      })
    }).catch(err => {
      console.log(err)
    })
  },
  gotoComment: function (event) {
    wx.navigateTo({
      url: `../comment/comment?movieid=${event.target.dataset.movieid}`
    })
  },
  gotoCommentTv: function (event) {
    wx.navigateTo({
      url: `../commenttv/commenttv?dramaid=${event.target.dataset.dramaid}`
    })
  },
  getSynopsis: function (event) {
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      tag: event.target.dataset.id,
      tvList: [],
      num: event.target.dataset.index
    })
    this.getTvList();
    wx.hideLoading();
    console.log(event);
  },
  onSearch: function (event) {
    console.log(event)  //search 事件在用户点击键盘上的搜索按钮触发
    this.setData({
      value: event.detail
    });
  },
  onCancel: function (event) {
    console.log(event) //cancel 事件在用户点击搜索框右侧取消按钮时触发
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMovieList();
    this.getTvList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getMovieList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})