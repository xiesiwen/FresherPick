var Bmob = require('../../utils/Bmob-1.6.2.min.js');
Bmob.initialize("789f6711a42cb8e61a5dde589b559e69", "55e875d5e5ef1476762ad60c5baeacc6", "841b8167851edfafc48ec9a7835d33b7");
// pages/order/order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showUserNameInputStatus: false, //输入手机号进行验证模态框开关
    showOrderObjectId: false, //是否显示订单的ObjectId
    orderList: [],
    userInfos: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    //读取本地缓存
    try {
      var value = wx.getStorageSync('userInfos')
      if (value) {
        that.setData({
          userInfos: value,
        });
      }
    } catch (e) {
      console.log("Read Local UserInfos Stroage Error.")
    }

    //如果本地缓存中没有用户信息，那么显示模态框
    if (!that.data.userInfos.mobile) {
      that.setData({
        showUserNameInputStatus: true
      });
    }else{
      this.seeOrders(that.data.userInfos);
    }
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

    wx.showToast({
      title: '正在刷新',
      icon: 'none'
    })

    var that = this;
    //如果本地缓存中没有用户信息，那么显示模态框
    if (!that.data.userInfos.mobile) {
      that.setData({
        showUserNameInputStatus: true
      });
    } else {
      this.seeOrders(that.data.userInfos);
    }

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log("上拉页面距离底部已经 150 px啦！")
    wx.showToast({
      title: '上拉页面距离底部已经 150 px啦！',
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //获取用户提交的号码
  submitUsernameInput: function (e) {
    var that = this;
    //用户输入的值
    var usernameinput = e.detail.value.usernameInput;
    const query = Bmob.Query("_User");
    query.equalTo("username", "==", usernameinput);
    query.find().then(res => {
      //用户不存在
      if (typeof (res.code) == "undefined" && typeof (res[0]) == "undefined") {
        wx.showToast({
          title: "您是第一次登录，当前没有订单信息",
          icon: "none"
        })

        //设置一个初始化变量，用于注册
        let params = {
          username: usernameinput,
          password: '123456' //默认密码
        };

        console.log("用户" + params.username + "不存在,执行注册");
        Bmob.User.register(params).then(res => {
          console.log("注册用户" + params.username + "成功");
          return true;
        }).catch(err => {
          console.log("注册用户失败>>> " + err.code);
          return false;
        });
      }
      //用户存在，查询用户信息和订单信息
      else if (typeof (res[0].username) != "undefined") {
        var userInfos_param = {};
        userInfos_param["mobile"] = res[0].username;
        userInfos_param["university"] = res[0].school;
        userInfos_param["dorm"] = res[0].place;
        userInfos_param["uLevel"] = res[0].uLevel;
        that.setData({
          userInfos: userInfos_param,
          showUserNameInputStatus: false //不显示模态框
        });
        wx.setStorageSync('userInfos', userInfos_param);
        //查询所有的订单信息
        this.seeOrders(userInfos);
      }
    })
  },
  //从数据库读取订单信息，同时刷新data.orderList中的数据
  seeOrders: function (userInfos) {
    var that = this;
    const query = Bmob.Query('Orders')

    //普通用户
    if (userInfos.uLevel == 1) {
      query.equalTo('studentId', "==", userInfos.mobile)
    //配送员
    } else if (userInfos.uLevel == 2) {
      const query1 = query.equalTo('distributorId', "==", userInfos.mobile)
      const query2 = query.doesNotExist("distributorId")
      query.or(query1, query2)
    }//其他情况，是超级用户

    query.order("-createdAt")
    query.find().then(res => {
      console.log("查询到用户 " + userInfos.mobile + " 共有 " + res.length + "个订单")
      //设置订单信息到属性 orderList
      this.processJSONProduct(res);
      that.setData({
        orderList: res
      });
    })
  },
  // 因为从数据库中得到的是原始的JSON字符串，需要做转换JSON.parse
  processJSONProduct: function(res){
    for (var i=0; i< res.length; i++){
        res[i].products = JSON.parse(res[i].products);
    }
  },
  //取消订单
  orderCancle: function(e){
    var that = this;
    var objectId = e.currentTarget.dataset.orderobjectid //data都是小写
    //从数据库中删除
    const query = Bmob.Query("Orders")
    query.destroy(objectId).then(res => {
      console.log("删除订单ObjectId " + objectId)
    }).catch(err => {
      console.log("删除订单ObjectId：" + objectId + "失败")
    })

    //刷新订单列表;可以做成异步的吗？
    wx.showToast({
      title: '正在刷新',
      icon: "none"
    })
    this.seeOrders(that.data.userInfos);
  },
  //提交订单的配送员。
  startDistributed: function(e){
    var orderObjectId = e.detail.value.order_objectId;
    var distributorId = e.detail.value.distributorIdInput;

    //修改订单配送员信息
    const query = Bmob.Query('Orders');
    query.get(orderObjectId).then(res => {
      console.log("修改订单 " + orderObjectId + " 配送员为" + distributorId)
      res.set('distributorId', distributorId)
      res.save()
    }).catch(err => {
      console.log("修改订单 " + orderObjectId + " 失败, 设置的配送员为" + distributorId)
    })

    wx.startPullDownRefresh();
  }
})