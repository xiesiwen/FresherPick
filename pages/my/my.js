// pages/order/order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: [{
        orderId: 10001,
        studentId: "13129946233",
        distributeId: "13129946233",
        school: "上海理工大学",
        place: "南三219",
        products: JSON.parse('[{"classify":"被子","createdAt":"2018-08-04 10:56:37","discount":9.5,"hotLevel":3,"image":{"__type":"File","cdn":"upyun","filename":"QQ截图20180804105540.png","url":"https://bmob-cdn-20057.b0.upaiyun.com/2018/08/04/90320ff84074b959804394589ba73701.png"},"name":"被子2","objectId":"0v4IGGGj","originalPrice":35,"price":70,"updatedAt":"2018-08-05 18:45:33","numb":3},{"classify":"被子","createdAt":"2018-08-04 10:54:56","discount":9,"hotLevel":10,"image":{"__type":"File","cdn":"upyun","filename":"QQ截图20180804105523.png","url":"https://bmob-cdn-20057.b0.upaiyun.com/2018/08/04/3d60ba5840f208e0808b8058716a008e.png"},"name":"被子1","objectId":"wrJOjjjn","originalPrice":25,"price":50,"updatedAt":"2018-08-05 18:41:39","numb":3}]'),
        price: 999.9,
        status: "",
        createdAt: "2018-08-04 10:56:37"
      },
      {
        orderId: 10002,
        studentId: "13129946233",
        distributeId: "",
        school: "上海理工大学",
        place: "南三219",
        products: JSON.parse('[{"classify":"被子","createdAt":"2018-08-04 10:56:37","discount":9.5,"hotLevel":3,"image":{"__type":"File","cdn":"upyun","filename":"QQ截图20180804105540.png","url":"https://bmob-cdn-20057.b0.upaiyun.com/2018/08/04/90320ff84074b959804394589ba73701.png"},"name":"被子2","objectId":"0v4IGGGj","originalPrice":35,"price":70,"updatedAt":"2018-08-05 18:45:33","numb":3},{"classify":"被子","createdAt":"2018-08-04 10:54:56","discount":9,"hotLevel":10,"image":{"__type":"File","cdn":"upyun","filename":"QQ截图20180804105523.png","url":"https://bmob-cdn-20057.b0.upaiyun.com/2018/08/04/3d60ba5840f208e0808b8058716a008e.png"},"name":"被子1","objectId":"wrJOjjjn","originalPrice":25,"price":50,"updatedAt":"2018-08-05 18:41:39","numb":3}]'),
        price: 999.9,
        status: "",
        createdAt: "2018-08-04 10:56:37"
      }
    ],
    userInfo: {
      "moboile": "13129946233",
      "university": "上海理工大学",
      "dorm": "南三219",
      "uLevel": 4
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})