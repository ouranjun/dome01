// pages/detail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '', // 索引值
    content: [],
    newslist: {}, // 诗词数据
    intro: [] // 注释
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.title);
    this.setData({
      title: options.title
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
    var _that = this
    wx.request({
      url: 'https://api.tianapi.com/txapi/poetry/index?key=70bdadb0bfc340d7c7a106e4cb8e8c41',
      data: {
        num: 1,
        page: 1,
        word: this.data.title
      },
      success (res) {
        wx.showLoading({
          title: '请稍后...',
          mask: true
        })
        if (res.data.code == 200) {
          _that.setData({
            newslist: res.data.newslist[0],
            content: res.data.newslist[0].content.split('。'),
            intro: res.data.newslist[0].intro
          })
          var intro = _that.data.newslist.intro
          var yunyiIndex = _that.data.newslist.intro.search(/【韵译】/)
          var pinxiIndex = _that.data.newslist.intro.search(/【评析】/)
          let intorlist = []
          intorlist.push(intro.substring(0,yunyiIndex), intro.substring(yunyiIndex,pinxiIndex), intro.substring(pinxiIndex))
          _that.setData({
            intro: intorlist
          })
        } else {
          _that.setData({
            err: '无搜索内容，请重新输入正确的诗词名称/作者'
          })
        }
        setTimeout(function () {
          wx.hideLoading();
        }, 1000)  
      }
    })
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