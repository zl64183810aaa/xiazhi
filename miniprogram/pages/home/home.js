// pages/home/home.js
//当组件创建成功后调用云函数
//当用户向上滑动 加载下一页数据
Page({
  data: {
    list:[]
  },
  jumpCommend:function(e){
    var id=e.target.dataset.id
    var url = "/pages/comment/comment?id="+id
    wx.navigateTo({
      url
    })
  },
  
  loadMore:function(){
    //调用云函数 并且传参
    wx.cloud.callFunction({
      name:"movielist1",
        data:{
          start:(this.data.list.length),//起始行
          count:5  //当前页共几行
        }
    }).then(res => {
      console.log(res.result)
      var rows = JSON.parse(res.result);
      var list2 = this.data.list.concat(rows.subjects)
     this.setData({
       list: list2})
    }).catch(err=>{console.log(err)})
  },
  onLoad: function (options) {
     //加载第一页数据
     this.loadMore()
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
    //加载下一页的数据
      this.loadMore()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})