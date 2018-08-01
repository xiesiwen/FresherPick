// pages/test/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 因为这是用 menu 来做的测试，所以最后肯定需要修改关于menu的所有js代码。在这里注明。
    showModalStatus: false, //模态框的开关
    showBottomModalStatus: false,
    indexSize: 0, //这是当前选择的分组的index，命名有问题
    indicatorDots: false,
    autoplay: false,
    duration: 0, //可以控制动画
    menu: [],
    animationData: '',    
    list: '',
    modalItem: {}, //模态框显示的内容
    currentPage: 0,
    selected: 0,
    howMuch: 12, //没有用到
    cost: 0, //购物车本次花费的钱
    shoppingCart: [] //加入购物车的物品;需要记录物品的Id
  },
  shoppingCart: [], //购物车 name/num/price
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
  addToTrolley: function(e) {
    var info = this.data.menu;
    //这里是菜单的处理方法，在生产环境应该要考虑
    info[this.data.indexSize].menuContent[e.currentTarget.dataset.index].numb++;
    //点击+的同时，添加购物车
    this.addShoppingCart(1, info[this.data.indexSize].menuContent[e.currentTarget.dataset.index]);
    this.setData({
      cost: this.data.cost + this.data.menu[this.data.indexSize].menuContent[e.currentTarget.dataset.index].price,
      menu: info,
    })
  },
  removeFromTrolley: function(e) {
    var info = this.data.menu;
    if (info[this.data.indexSize].menuContent[e.currentTarget.dataset.index].numb != 0) {
      info[this.data.indexSize].menuContent[e.currentTarget.dataset.index].numb--;
      //点击-的同时，删除添加购物车
      this.addShoppingCart(0, info[this.data.indexSize].menuContent[e.currentTarget.dataset.index]);
      this.setData({
        cost: this.data.cost - this.data.menu[this.data.indexSize].menuContent[e.currentTarget.dataset.index].price,
        menu: info,
      })
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
        if (shoppingCartInfo[index].numb == 0){
          shoppingCartInfo.splice(index, 1); //删除index位置的1个元素
        }
      }
    }

    this.setData({
      shoppingCart: shoppingCartInfo
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.request({
      url: "https://www.easy-mock.com/mock/596257bc9adc231f357c4664/restaurant/menu",
      method: "GET",
      success: function(res) {
        that.setData({
          menu: res.data,
        })
      }
    });
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

  /**
   * 模态框的js代码
   */
  powerDrawer: function(e) {
    var currentStatu = e.currentTarget.dataset.statu;
    var category = e.currentTarget.dataset.category;
    var currentIndex = e.currentTarget.dataset.index; //当点击确定的时候，会调用powerDrawer方法，所以这里需要做判断，不为空
    if (category != null && currentIndex != null) {
      var info = this.data.menu;
      this.setData({
        modalItem: info[category].menuContent[currentIndex]
      });
    }
    this.util(currentStatu)
  },
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
          showModalStatus: false
        });
      }
    }.bind(this), 200)

    // 显示
    if (currentStatu == "open") {
      this.setData({
        showModalStatus: true
      });
    }
  },
  showModal: function () {
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
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  hideModal: function () {
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
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showBottomModalStatus: false
      })
    }.bind(this), 200)
  }
})