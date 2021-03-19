// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: '', // 输入框内容
    err: '输入诗人"李白"试试', // 搜索错误返回值
    newslists: [] // 请求的诗集数据
  },

  /**
   * 输入框发生变化时
   */
  inputChange: function (e) {
    let value = e.detail.value;
    this.setData({
      value: e.detail.value
    })
  },
  /**
   * 
   * 点击搜索按钮
   */
  bindSearch: function () {
    var _that = this;

    wx.request({
      url: 'https://api.tianapi.com/txapi/poetry/index?key=70bdadb0bfc340d7c7a106e4cb8e8c41',
      data: {
        num: 10,
        page: 1,
        word: this.data.value
      },
      success (res) {
        wx.showLoading({
          title: '请稍后...',
          mask: true
        })
        if (res.data.code == 200) {
          _that.setData({
            newslists: res.data.newslist
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
   * 
   * 点击进入详情页
   */
  gotoDetail (e) {
    var title = e.currentTarget.dataset.title
    wx.navigateTo({
      url: '../detail/index?title='+ title,

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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