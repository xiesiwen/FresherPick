// var bombAPI = require('../bombAPI/test.js');
var Bmob = require('../../utils/Bmob-1.6.2.min.js');
Bmob.initialize("789f6711a42cb8e61a5dde589b559e69", "55e875d5e5ef1476762ad60c5baeacc6", "841b8167851edfafc48ec9a7835d33b7");
// pages/test/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 因为这是用 menu 来做的测试，所以最后肯定需要修改关于menu的所有js代码。在这里注明。
    showModalStatus: false, //详情模态框的开关
    showModalStatus_clear: false, //结算页面模态框开关
    showBottomModalStatus: false, //购物车页面模态框开关
    indexSize: 0, //这是当前选择的分组的index，命名有问题
    indicatorDots: false,
    autoplay: false,
    duration: 0, //可以控制动画
    menu: [], //菜单
    animationData: '',
    list: '',
    modalItem: {}, //模态框显示的内容
    currentPage: 0,
    selected: 0,
    cost: 0, //购物车本次花费的钱;
    income: 0, //购物车所有物品的收益（售价-成本）
    freightCharge: 5, //运费;是不是有数据库送
    // discounts: 9, //折扣价; 已经写入到数据库
    shoppingCart: [], //加入购物车的物品;需要记录物品的Id
    userInfos: {}, //用户的信息，包括：电话，学校 地址
    sumbitMsg: "", //订单提交的msg
    schoolArray: [],
  },
  // shoppingCart: [], //购物车 name/num/price

  addToTrolley: function(e) {
    var info = this.data.menu;
    //这里是菜单的处理方法，在生产环境应该要考虑
    info[this.data.indexSize].menuContent[e.currentTarget.dataset.index].numb++;
    var product = info[this.data.indexSize].menuContent[e.currentTarget.dataset.index];
    //点击+的同时，添加购物车
    this.addShoppingCart(1, product);
    this.setData({
      cost: this.data.cost + ((product.price * product.discount) /10),
      income: this.data.income + (((product.price * product.discount) / 10) - product.originalPrice),
      menu: info,
    })
    console.log("总价:" + this.data.cost + " 总收益:" + this.data.income);
  },
  removeFromTrolley: function(e) {
    var info = this.data.menu;
    if (info[this.data.indexSize].menuContent[e.currentTarget.dataset.index].numb != 0) {
      info[this.data.indexSize].menuContent[e.currentTarget.dataset.index].numb--;
      var product = info[this.data.indexSize].menuContent[e.currentTarget.dataset.index];
      //点击-的同时，删除添加购物车
      this.addShoppingCart(0, product);
      this.setData({
        cost: this.data.cost - (product.price * product.discount) / 10,
        income: this.data.income - (((product.price * product.discount) / 10) - product.originalPrice),
        menu: info,
      })
      console.log("总价:" + this.data.cost + " 总收益:" + this.data.income);
    }
  },
  //加入或者删除购物车; flag=1 添加 flag=0 删除
  addShoppingCart: function(flag, item) {
    var shoppingCartInfo = this.data.shoppingCart;
    //判断是不是存在
    var itemId = item.id; //得到物品的Id,如果有的话，为后面做打算
    var index = -1;
    //购物车不为空
    if (shoppingCartInfo.length > 0) {
      for (var j = 0; j < shoppingCartInfo.length; j++) {
        if (shoppingCartInfo[j].name == item.name) { //这里用名字进行比较
          index = j;
        }
      }
    }
    if (index == -1) { //如果在shoppingCartInfo不存在，只会有添加的情况
      if (flag == 1) {
        shoppingCartInfo.push(item);
      }
    } else { //如果存在
      if (flag == 1) {
        shoppingCartInfo[index].numb++;
      }
      if (flag == 0) {
        shoppingCartInfo[index].numb--;
        if (shoppingCartInfo[index].numb == 0) {
          shoppingCartInfo.splice(index, 1); //删除index位置的1个元素
        }
      }
    }

    this.setData({
      shoppingCart: shoppingCartInfo
    });
  },
  //用户提交订单
  submitOrder: function(e) {
    //手机号
    var mobile = e.detail.value.mobile;
    //大学
    var schoolIndex = e.detail.value.schoolIndex;
    //宿舍
    var dorm = e.detail.value.dorm;
    //备注
    var comment = e.detail.value.comment;
    var userInfos = {};
    userInfos["mobile"] = mobile;
    userInfos["university"] = this.data.schoolArray[schoolIndex];
    userInfos["dorm"] = dorm;
    //用户等级，注册用户只能是1
    userInfos["uLevel"] = 1;
    var result = this.checkSumbitOrder(userInfos);
    //用户输入失败
    if (result.flag == false) {
      wx.showToast({
        title: result.msg,
        icon: "none"
      })
    } 
    //用户输入成功，本地缓存信息；
    //1.如果是新用户，先注册新用户信息，然后本地缓存;重新打开小程序，先读取本都缓存。
    //2.确保用户信息在订单信息前提交
    else {
      //要更新到数据库的值
      var result = this.SubmitUserAndSubmitOrder(userInfos, comment);
      setTimeout(function () {
        //要延时执行的代码
      }, 1000) //延迟时间 这里是1秒
      if (result) {
        wx.showToast({
          title: "订单提交成功！",
          icon: "none"
        })
        const that = this;
        that.setData({
          userInfos: userInfos,
        });
        wx.setStorageSync('userInfos', userInfos);
        that.setData({
          showModalStatus_clear: false
        });
      } else {
        wx.showToast({
          title: "信息提交异常，请稍后再试！",
          icon: "none"
        })
      }
    }
  },
  SubmitUserAndSubmitOrder: function(userInfo, orderComment) {
    var that = this;
    let params = {
      username: userInfo.mobile,
      uLevel: userInfo.uLevel,
      school: userInfo.university,
      place: userInfo.dorm,
      password: '123456' //默认密码
    };

    const query = Bmob.Query("_User");
    query.equalTo("username", "==", params.username);
    query.find().then(res => {
      //用户不存在
      if (typeof (res.code) == "undefined" && typeof (res[0]) == "undefined"){
        console.log("用户" + params.username + "不存在>>>");
        Bmob.User.register(params).then(res => {
          console.log("注册用户" + params.username + "成功");
          return true;
        }).catch(err => {
          console.log("注册用户失败>>> " + err.code);
          return false;
        });
      }
      //用户存在；这里会抛出异常
      else if (typeof(res[0].username) != "undefined"){
        var objectId = res[0].objectId;
        const query2 = Bmob.Query('_User');
        query2.get(objectId).then(res => {
          res.set('school', params.school);
          res.set('place', params.place);
          res.save();
          return ture;
        }).catch(err => {
          console.log("更新User表没有权限>>>" + err.error)
        })
      }

      //提交订单到数据库；需要和用户信息同步执行，所以放在这里
      //username，Products（String{'{name:被子1,num:1, name:被子2,num:2}'}），cost, school, place
      console.log("总价:" + that.data.cost + " 总收益:" + that.data.income);
      console.log("购物车详情:" + that.data.shoppingCart);
      const query_orders = Bmob.Query('Orders');
      query_orders.set("studentId", userInfo.mobile);
      query_orders.set("school", userInfo.university);
      query_orders.set("place", userInfo.dorm);
      query_orders.set("comment", orderComment);
      //把Products转换为JSON字符串
      var products = {};
      var shoppingCart_tmp = that.data.shoppingCart;
      for (var i = 0; i < shoppingCart_tmp.length; i++) {
        console.log("Shopping cart : " + shoppingCart_tmp[i].name);
        products[shoppingCart_tmp[i].name] = shoppingCart_tmp[i].numb;
      }
      query_orders.set("products", JSON.stringify(shoppingCart_tmp));

      query_orders.set("price", that.data.cost);
      query_orders.set("income", that.data.income);
      query_orders.set("done", false);
      query_orders.set("distributorId", "");
      query_orders.save().then(res => {
        console.log("提交订单成功" + res)
      }).catch(err => {
        console.log("提交订单失败" + err)
      })
    }).catch(err => {
      console.log("更新用户信息时>>>" + err);
      return false;
    })
    return true;
  },
  /**
   * 检查用户的输入
   */
  checkSumbitOrder: function(userInfos) {
    var result = {
      "flag": true,
      "msg": ""
    };
    //手机号
    var mobile = userInfos["mobile"];
    //大学
    var university = userInfos["university"];
    //宿舍
    var dorm = userInfos["dorm"];

    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!myreg.test(mobile)) {
      result.flag = false;
      result.msg = "电话号码不正确";
      return result;
    }

    if (university.match(/^\s*$/)) {
      result.flag = false;
      result.msg = "学校不能为空";
      return result;
    }

    if (dorm.match(/^\s*$/)) {
      result.flag = false;
      result.msg = "宿舍不能为空";
      return result;
    }
    return result;
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
    //读取School信息
    const schoolQuery = Bmob.Query("School")
    schoolQuery.find().then(res => {
      console.log("读取到" + res.length + "所学校")
      var schoolArrayTmp = []
      for (var i in res){
        schoolArrayTmp.push(res[i].name)
      }
      that.setData({
        schoolArray: schoolArrayTmp,
      })
    }).catch(err => {
      console.log("读取表School错误")
    });
    //读取“Products"表
    const query = Bmob.Query('Products');
    query.find().then(res => {
      console.log("Get Res>>>" + res);
      var data = this.processProduct(res);
      that.setData({
        menu: data
      })
    }).catch(err => {
      console.log("读取表Products错误")
    });
    console.log("Load Products>>>" + this.data.menu);
  },
  // 分类Products
  processProduct: function(products) {
    var data = [];
    for (var i = 0; i < products.length; i++) {
      if (!data[products[i].classify]) {
        var arr = {
          "menuContent": [],
          "typeName": ""
        };
        products[i].numb = 0;
        //因为小程序只支持HTTPS连接，所以替换
        var img = products[i].image.url;
        products[i].image.url = img.replace("http://", "https://");
        arr.menuContent.push(products[i]);
        arr.typeName = products[i].classify;
        data[products[i].classify] = arr;
      } else {
        products[i].numb = 0;
        var img = products[i].image.url;
        products[i].image.url = img.replace("http://", "https://");
        data[products[i].classify].menuContent.push(products[i]);
      }
    }
    data = this.getObjectValues(data);
    console.log("Process Products[0]:>>" + data[0]);
    return data;
  },
  // 得到数组的value，从Key中
  getObjectValues: function(object) {
    var values = [];
    for (var property in object)
      values.push(object[property]);
    return values;
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

  },
  // 菜单联动的方法
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
   * 模态框的js代码
   */
  powerDrawer: function(e) {
    var currentStatu = e.currentTarget.dataset.statu;
    var category = e.currentTarget.dataset.category;
    //当点击确定的时候，会调用powerDrawer方法，所以这里需要做判断，不为空
    var currentIndex = e.currentTarget.dataset.index;
    if (category != null && currentIndex != null) {
      var info = this.data.menu;
      this.setData({
        modalItem: info[category].menuContent[currentIndex]
      });
    }
    this.util(currentStatu)
  },
  powerDrawer_clear: function(e) {
    this.setData({
      //关闭购物车模态框，无论是不是开启
      showBottomModalStatus: false,
    });
    var info = this.data;
    if (info.cost <= 0) {
      return;
    } else {
      var currentStatu = e.currentTarget.dataset.statu;
      this.util_clear(currentStatu);
    }
  },
  //购物车模态框页面的动画
  util: function(currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例 
    var animation = wx.createAnimation({
      duration: 200, //动画时长
      timingFunction: "linear", //线性
      delay: 0 //0则不延迟
    });

    // 第2步：这个动画实例赋给当前的动画实例
    this.animation = animation;

    // 第3步：执行第一组动画
    animation.opacity(0).rotateX(-100).step();

    // 第4步：导出动画对象赋给数据对象储存
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画
    setTimeout(function() {
      // 执行第二组动画
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象
      this.setData({
        animationData: animation
      })

      //关闭
      if (currentStatu == "close") {
        this.setData({
          showModalStatus: false,
        });
      }
    }.bind(this), 200)

    // 显示
    if (currentStatu == "open") {
      this.setData({
        showModalStatus: true,
      });
    }
  },
  //结算页面的模态框动画
  util_clear: function(currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例 
    var animation = wx.createAnimation({
      duration: 200, //动画时长
      timingFunction: "linear", //线性
      delay: 0 //0则不延迟
    });

    // 第2步：这个动画实例赋给当前的动画实例
    this.animation = animation;

    // 第3步：执行第一组动画
    animation.opacity(0).rotateX(-100).step();

    // 第4步：导出动画对象赋给数据对象储存
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画
    setTimeout(function() {
      // 执行第二组动画
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象
      this.setData({
        animationData: animation
      })

      //关闭
      if (currentStatu == "close") {
        this.setData({
          showModalStatus_clear: false
        });
      }
    }.bind(this), 200)

    // 显示
    if (currentStatu == "open") {
      this.setData({
        showModalStatus_clear: true
      });
    }
  },
  showModal: function() {
    if (this.data.showBottomModalStatus == true) {
      this.setData({
        showBottomModalStatus: false
      });
      return;
    }

    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 0,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showBottomModalStatus: true
    })
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  hideModal: function() {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 0,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showBottomModalStatus: false
      })
    }.bind(this), 200)
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      schoolIndex: e.detail.value
    })
  },
})