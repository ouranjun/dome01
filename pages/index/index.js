// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: ''
  },

  /**
   * 输入框发生变化时
   */
  inputChange: function (e) {
    console.log(e.detail.value);
    let value = e.detail.value;
    wx.request({
      url: 'https://api.tianapi.com/txapi/poetry/index?key=70bdadb0bfc340d7c7a106e4cb8e8c41',
      data: {
        num: 5,
        page: 1,
        word: value
      },
      success: function (res) {
        console.log(res);
      }
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