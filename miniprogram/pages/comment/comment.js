// pages/comment/comment.js
const db=wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    score: 0,
    content: "",
    movieid:0,  //当前电影id
    detail:{},          //当前电影详细信息
    images:[],          //保存用户选中图片
    fileIds:[]          //保存上传图片fileID
  },
  submit:function(){
    //选中图片上传云存储
    //显示数据加载中提示框
    wx.showLoading({
      title: '评论中...',
    })
    //创建数据（添加Promise对象）
    var rows=[];
    //创建循环遍历图片数组内容
    for(var i=0;i<this.data.images.length;i++){
    //为每张图片创建promise对象
     rows.push(new Promise((resolve,reject)=>{
    //获取数组中当前图片的，名称
    var item=this.data.images[i]
    //创建正则表达式来解析图片名称后缀
    var suffix=/\.\w+$/.exec(item)[0]
      
      //创建新文件名称
     // var newFile=new Date().getTime()+suffix
      //特殊情况 网络非常好
       var newFile = new Date().getTime() + Math.floor(Math.random() * 9999)  + suffix
       //console.log(newFile)
    //上传图片
    wx.cloud.uploadFile({ //上传函数
      cloudPath:newFile,  //新文件名
      filePath:item,      //原先文件
      success:(res)=>{    //上传成功
      //上传成功获取当前图片fileIID
      var fid=res.fileID;
      //上传成功获取当前图片fileID
        //保存当前fileID在data中
        console.log(fid)
      this.data.fileIds.push(fid)
       //this.setData({fileIds:ids});
        //执行成功 解析
        resolve();
      }
    })
    }))
    }
    //评论 打分 fileID添加到云数据库中
     //等待所有promise对象执行完成
     Promise.all(rows).then(res=>{
     //在云数据库创建集合
     //程序开始位置创建数据库示例
     //向comment集合添加一条记录  
     //content留言 score分数 movieid哪个电影评论 fileIds  上传图片id列表
     db.collection("comment").add({
       data:{
         content:this.data.content,
         score: this.data.score,
         movieid: this.data.movieid,
         fileIds: this.data.fileIds
       }
     }).then(res=>{
       //成功的回调函数  隐藏加载提示框 提示文字
       wx.hideLoading();
       wx.showToast({
         title:"评论成功"
       })
     }).catch(err=>{
       //失败的回调函数 隐藏加载提示框 提示文字
       wx.hideLoading();
       wx.showToast({
         title: "评论失败"
       })
     })
     
     
     })
  },
  //选中多张图片
  uploadImg:function(){
   //选中多张
   wx.chooseImage({
     count: 9,//数量9
     sizeType: ["original", "compressed"],//图片类型
     sourceType: ["album", "camera"], //图片来源
     success: (res) => {//选中成功
       let images = res.tempFilePaths //res.tempFilePaths[] 选中图片列表
       this.setData({ images: images })//保存 data.inages
     },
   })
  },
  //评论输入框
  oncontentChange:function(event) {
    // event.detail 为当前输入的值
    //模拟双向绑定
   this.setData({
     content:event.detail
   })
   
  },
  //用户评分
   onScoreChange:function(event) {
     this.setData({
       score: event.detail
     });
  },
  loadMore:function(){
    //获取当前电影
    //显示数据加载提示框
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name:"findDetail1",
      data: {//调用函数  参数id
        id: this.data.movieid
      }
    }).then(res => {//接收云函数返回结果
      let rows=JSON.parse(res.result)
      this.setData({ detail: rows })//将返回结果保存
      wx.hideLoading();
    }).catch(err=>{console.log(err)})
    //隐藏加载提示框
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
        //调用云函数
        //获取home组件id 保存
    this.setData({ movieid: options.id })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})