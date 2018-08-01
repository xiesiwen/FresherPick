// pages/menu/menu.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indexSize: 0,
    indicatorDots: false,
    autoplay: false,
    duration: 0, //可以控制动画
    menu:[],
    menu3:['t1', 't2', 't3'],
    menu2:[],
    menu4:[{
      "typeName": "快餐类",
      "menuContent":[
        {
        "name": "炸鸡",
        "price": 15,
         "rating": 3,
          "sales": 22,
          "src": "http://i2.kiimg.com/601998/a955867016875a41.jpg" },
        {
        "name": "炸薯条",
        "price": 15,
        "rating": 3,
        "sales": 22,
        "src": "http://i2.kiimg.com/601998/a955867016875a41.jpg" }]
    }],
    pullBar: false
  },
  pullBar: function () {
    this.setData({
      pullBar: !this.data.pullBar
    })
  }
  ,
  addToTrolley: function (e) {
    var info = this.data.menu;
    info[this.data.selected].menuContent[e.currentTarget.dataset.index].numb++;
    this.setData({
      cost: this.data.cost+this.data.menu[this.data.selected].menuContent[e.currentTarget.dataset.index].price,
      menu: info,
    })
  },
  removeFromTrolley: function (e) {
    var info = this.data.menu;
    if (info[this.data.selected].menuContent[e.currentTarget.dataset.index].numb!=0){
      info[this.data.selected].menuContent[e.currentTarget.dataset.index].numb--;
      this.setData({
        cost: this.data.cost - this.data.menu[this.data.selected].menuContent[e.currentTarget.dataset.index].price,
        menu: info,
      })
    }
  },
  turnPage: function (e) {
    this.setData({
      currentPage: e.currentTarget.dataset.index
    })
  },
  turnTitle: function (e) {
    if(e.detail.source=="touch"){
      this.setData({
        currentPage: e.detail.current
      })
    }
  },
  turnMenu: function (e) {
    this.setData({
      selected: e.currentTarget.dataset.index
    })
    console.log("tap menu: " + e.currentTarget.dataset.index);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: "https://www.easy-mock.com/mock/596257bc9adc231f357c4664/restaurant/menu",
      method: "GET",
      success: function (res) {
        console.log("res2 >>>>:" + res.data[0].typeName)
        that.setData({
          menu: res.data,
          menu2: res.data,
          message: "message Test",
        })
        console.log("menu 1>>>: " + that.data.menu2[0].typeName);
        console.log("menu 2>>>: " + that.data.menu[0].typeName);
        console.log("message 1>>>: " + that.data.message);
      }
    });
  },
  change(e) {
    this.setData({
      indexSize: e.detail.current
    })
  },
  scrollTo(e) {
    this.setData({
      indexSize: e.target.dataset.index
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