// pages/mymovie/movie.js
const db=wx.cloud.database()
Page({

  data: {
    content: "", //用户留言
    fileID:0,
    image:{}
  },
  onContentChange:function(e){
     //获取用户输入的文字
     this.setData({
       content:e.detail
     })
  },
  upmymovie:function(){
    //选择图片保存到data中
    //显示加载提示框
    wx.showLoading({
      title: '加载中...',
    })
    //选择一张
   wx.chooseImage({
     count:1,
     sizeType:["original","compressed"],
     sourceType:["album","camera"],
     success: (res)=>{
       var image=res.tempFilePaths[0]
         this.setData({
           image
         })
         console.log(this.data.image)
         wx.hideLoading()
     },
   })
    //将选中图片保存到 data image
    //隐藏提示框
  },
  submit:function(){
    //上传一张图片 fileID 评论
    //添加云数据集合中
    //显示加载提示框
    wx.showLoading({
      title: '评论中...',
    })
    //上传t图片 将图片保存到data中
    var item=this.data.image
    var suffix=/\.\w+$/.exec(item)[0]
    var newFid=new Date().getTime()+Math.floor(Math.random()*9999)+suffix
    wx.cloud.uploadFile({
          cloudPath:newFid,
          filePath:item,
          success:(res)=>{
            var fid=res.fileID
            this.setData({
              fileID:fid
            })
            db.collection("mymovie").add({
              data: {
                content: this.data.content,
                fileID: this.data.fileID
              }
            }).then(res => {
              console.log(res)
                wx.hideLoading();
                wx.showToast({
                  title: '评论成功',
                })
            }).catch(err => { })
          }
    })
    //获取用户评论内容
    //将评论 fileID添加到云 数据库中
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