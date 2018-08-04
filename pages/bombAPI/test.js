// pages/bombAPI/test.js
var Bmob = require('../../utils/Bmob-1.6.2.min.js');
Bmob.initialize("789f6711a42cb8e61a5dde589b559e69", "55e875d5e5ef1476762ad60c5baeacc6");
var phone;
var level;
var school;
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrl:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    phone = wx.getStorageSync('phone')
    console.log('phone is ' + phone)
    if (phone != null && phone != "") {
      Bmob.User.login(phone, '123456').then(res => {
        console.log(res)
        level = res.uLevel
        school = res.school
      })
    }
  },

  /**
   * 获取所有的商品信息
   */
  getProducts: function (options) {
      const query = Bmob.Query('Products');
      query.find().then(res => {
        console.log(res)
        var imgurl = res[0].image.url
        console.log("url is " + imgurl)
        that.setData({
          imageUrl:imgurl
        })
      }).catch(err => {
        console.log(err)
      });
  },

  /**
   * 获取学校信息，如果有多个下单时要选学校
   */
  getSchools: function(options) {
    const query = Bmob.Query('School');
    query.find().then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    });
  },

  saveOrder: function (options) {
    var jsonArray = '{name:被子1,num:1, name:被子2,num:2}'
    //todo 创建正确的jsonArray
    const query = Bmob.Query('Orders')
    query.set('studentId', phone)
    query.set('school', school)
    query.set('products', jsonArray)
    query.set('price', 123)
    query.set('income', 45)
    query.save().then(res => {
      //提示下单成功
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
  },

  /**
   * 输入手机号和地址选择学校下单
   */
  createOrder: function(options) {
    school = '上海理工大学'
    if (phone == null || phone == "") {
      //需要注册并保存信息
      var p = '15671559245'
      let params = {
        username: p,
        password: '123456',
        uLevel: 1,
        school: school,
        place: '南三123'
      }
      Bmob.User.register(params).then(res=>{
        wx.setStorageSync('phone', p)
        phone = p
        level = 1
        that.saveOrder()
      }).catch(err=>{
        wx.setStorageSync('phone', p)
        phone = p
        level = 1
        that.saveOrder()
      })
    } else{
      that.saveOrder()
    }
  },

  /**
   * 使用手机号查看订单
   */
  checkOrders: function(options) {
    school = '上海理工大学'
    if (phone == null || phone == "") {
      var p = '15671559245'
      //先去登录，登录失败之后提示输入地址或选择学校来注册
      Bmob.User.login(p, '123456').then(res=>{
        wx.setStorageSync('phone', p)
        phone = p
        level = res.uLevel
        that.seeOrders()
      }).catch(err=>{
        //todo提示注册，成功后才看订单
        let params = {
          username: p,
          password: '123456',
          uLevel: 1,
          school: school,
          place: '南三123'
        }
        Bmob.User.register(params).then(res => {
          wx.setStorageSync('phone', p)
          phone = p
          level = 1
          that.seeOrders()
        }).catch(err => {
          wx.setStorageSync('phone', p)
          phone = p
          level = 1
          that.seeOrders()
        })
      })
    } else {
      that.seeOrders()
    }
  },

  seeOrders:function(options){
    const query = Bmob.Query('Orders')
    if (level == 1) {
      query.equalTo('studentId' , "==" , phone)
    } else if(level == 2){
      query.equalTo('distributorId', "==", phone)
    }
    query.find().then(res => {
      console.log(res)
    })
  },

  /**
   * 指定配送员
   */
  distributeOrder: function(options){
    const query = Bmob.Query('Orders');
    query.set('id', '9d77a46420')
    query.set('distributorId', '15671559247')
    query.save().then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
  },

  /**
   * 完成订单
   */
  doneOrder: function(options){
    const query = Bmob.Query('Orders');
    query.set('id', '9d77a46420')
    query.set('done', true)
    query.save().then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
  },

  /**
   * 查看所有商品销售情况
   */
  checkProducts: function(options){
    const query = Bmob.Query('Products');
    query.find().then(res => {
      console.log(res) //商品种类
      const query = Bmob.Query('Orders');
      query.find().then(res1 => {
         console.log(res1) //每个订单
         //todo 解析products字段计算个数
      })
    })
  },

  /**
   * 查看销售额盈利等
   */
  checkAmount: function(options){
    const query = Bmob.Query('Orders');
    query.find().then(res=>{
      console.log(res)
      var lenght = res.length
      console.log(lenght) //订单数量
      var sum1 = 0
      var sum2 = 0
      for(var i = 0; i < lenght ;i++){
        sum1 += res[i].income
        sum2 += res[i].price
      }
      console.log(sum1 + "  " + sum2) //盈利与销量
    })
  },

  /**
   * 打开app网络日志
   */
  openApp: function(options){
    const query = Bmob.Query('Access');
    query.set('phone', phone)
    query.set('action', 'enter')
    query.save().then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
  },

  /**
   * 下单页面网络日志
   */
  pageProducts: function(options) {
    const query = Bmob.Query('Access');
    query.set('phone', phone)
    query.set('action', 'product')
    query.save().then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
  },

  /**
   * 我的页面网络日志
   */
  pageMe:function(options){
    const query = Bmob.Query('Access');
    query.set('phone', phone)
    query.set('action', 'order')
    query.save().then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
  }
})