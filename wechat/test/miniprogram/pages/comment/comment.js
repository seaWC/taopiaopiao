// pages/comment/comment.js

const db = wx.cloud.database(); // 初始化数据库
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    content: '', //评论内容
    score: 5, //评论分数
    images: [], // 上传的图片
    fileIds: [],
    movieId: -1,
    detailTxet: [],
    detailTxetTrue: false
  },
  submit: function (event) {
    wx.showLoading({
      title: '评论中',
    })
    this.setData({
      movieId: event.target.dataset.id
    });
    console.log(event.target.dataset.id)
    console.log(this.data.content, this.data.score);
    // 上传图片到云存储
    let promiseArr = [];
    for (let i = 0; i < this.data.images.length; i++) {
      promiseArr.push(new Promise((reslove, reject) => {
        let item = this.data.images[i];
        let suffix = /\.\w+$/.exec(item)[0]; // 正则表达式，返回文件扩展名
        wx.cloud.uploadFile({
          cloudPath: new Date().getTime() + suffix, // 上传至云端的路径
          filePath: item, // 小程序临时文件路径
          success: res => {
            // 返回文件 ID
            console.log(res.fileID)
            this.setData({
              fileIds: this.data.fileIds.concat(res.fileID)
            });
            reslove();
          },
          fail: console.error
        })
      }));
    }

    Promise.all(promiseArr).then(res => {
      // 插入数据
      db.collection('comment').add({
        data: {
          content: this.data.content,
          score: this.data.score,
          movieid: this.data.movieId,
          fileIds: this.data.fileIds,
          subTime: new Date().getTime()
        }
      }).then(res => {
        wx.hideLoading();
        wx.showToast({
          title: '评价成功',
        })
      }).catch(err => {
        wx.hideLoading();
        wx.showToast({
          title: '评价失败',
        })
      })

    });
  },

  /**
   * 写入评论内容
   */
  onContentChange: function (event) {
    console.log(event)
    this.setData({
      content: event.detail
    });
  },
  /**
   * 评分
   */
  onScoreChange: function (event) {
    console.log(event)
    this.setData({
      score: event.detail
    });
  },
  /**
   * 上传图片
   */
  uploadImg: function (event) {
    // 选择图片
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],//所选的图片的尺寸
      sourceType: ['album', 'camera'],//选择图片的来源
      success: res => {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths);
        this.setData({
          images: this.data.images.concat(tempFilePaths)
        });
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '电影'
    })
    console.log(options)
    //获取  云函数getmovielist  movieid
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'getmovielist',
      data: {
        movieid: options.movieid
      }
    }).then(res => {
      console.log(res)
      this.setData({
        detail: JSON.parse(res.result)
      })
      wx.hideLoading();

    }).catch(err => {
      console.log(err)
    })
    //获取 movieid 评论内容
    db.collection('comment').where({
      movieid: options.movieid
    }).get().then(res => {
      console.log(res)
      if (res.data == []) {
        detailTxetTrue: true
      }
      this.setData({
        detailTxet: res.data
      })
    }).catch(err => {
      console.log(err)
    })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})