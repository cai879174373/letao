

$(function () {
    //执行查询购物车函数
    queryCart();

    // 执行分页查询
    // queryCartPaging();
    // 执行删除函数
    deleteCart();
    // 执行上拉和下拉函数
    // pullrefresh();
   
    // 执行编辑函数
    compileCart();

    // queryCart();
    var page = 1;
    // 封装一个查下购物车的函数

    function queryCart() {
        $.ajax({
            url: '/cart/queryCart',
            success: function (data) {
                console.log(data);
                if(data.error){
                    location="login.html?returnUrl="+location.href;
                }else{

                         //调用模板
                var html = template('cartTpl',{data:data});
                $('#main .cart-list').html(html);

                mui('.mui-scroll-wrapper').scroll({
                    indicators: false, 
                    deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
                });
                // 刷新以后 结束转窜窜
                // mui('#pullrefresh').pullRefresh().refresh(true);
                // 计算总金额
                totalMoney();
                }
                //调用模板
                // var html = template('cartTpl', {
                //     list: data
                // });
                // $('#main .cart-list').html(html);
            }
        })
    }

    // 封装一个分页查询购物车函数
    // function queryCartPaging() {
    //     $.ajax({
    //         url: '/cart/queryCartPaging',
    //         data: {
    //             page: 1,
    //             pageSize: 4
    //         },
    //         success: function (data) {
    //             console.log(data);
                
    //             if(Array.isArray(data)){
    //                 data={
    //                     data:[]
    //                 }
    //             }
    //                 //调用模板
    //             // var html = template('cartTpl', data);
    //             // $('#main .cart-list').html(html);
    //             // // 刷新以后 结束转窜窜
    //             // mui('#pullrefresh').pullRefresh().refresh(true);
    //             // // 计算总金额
    //             // totalMoney();
                
    //         }
    //     })
    // }
    // 封装一个删除购物车商品函数
    function deleteCart() {
        //   动态添加的用事件委托
        $('.cart-list').on('tap', '.btn-delete', function () {
            var that = this;
            var li = that.parentNode.parentNode;

            // 提示是否删除 用mui查件
            mui.confirm("确定要删除这个商品吗", "温馨提示", ["yes", "no"],
                function (e) {
                    if (e.index == 0) {
                        // 获取当前的id
                        var id = $(that).data('id');
                        console.log(id);
                        // 发送ajax请求
                       
                        $.ajax({
                            url: '/cart/deleteCart',
                            data: { id: id },
                            success: function (data) {
                                console.log(data);
                                if(data.success){

                                    // 重新查询函数
                                    queryCart();
                                    // 重置page为第一页
                                    // page=1;
                                    //删除成功
                                    // $.ajax({
                                    //     url: '/cart/queryCartPaging',
                                    //     data: {
                                    //         page: page,
                                    //         pageSize: 4
                                    //     },
                                    //     success: function (data) {
                                    //         console.log(data);
                                    //         if(Array.isArray(data)){
                                    //             data={
                                    //                 data:[]
                                    //             }
                                    //         }
                                    //         //调用模板
                                    //         var html = template('cartTpl', data);
                                    //         $('#main .cart-list').html(html);
                                    //         // mui('#refreshContainer').pullRefresh().refresh(true);
                                    //         mui('#pullrefresh').pullRefresh().refresh(true);
                                    //     }
                                    // })

                                }
                               
                            }
                        })
                       
                          

                        }else {
                            setTimeout(function() {
								mui.swipeoutClose(li);
							}, 0);
                        }
                    // console.log(data);


                })

        })
    };

    // 封装一个编辑函数
    function compileCart(){
        // 注册点击事件
        $('.cart-list').on('tap','.btn-update',function(){
            var li = this.parentNode.parentNode;
            var data=$(this).data('updata');
            console.log(data);
            // 处理一下鞋码数据
            var productSize=data.productSize.split('-');
            var min=productSize[0]-0;
            var max=productSize[1]-0;
            var productSizeList=[];
            // 遍历productSize数组 添加数码
             for(var i=min;i<=max;i++){
                productSizeList.push(i);
             }
             data.productSize= productSizeList;
            //  调用模板引擎/
            // 去掉里面的回车和换行
            var html=template('compileCartTpl',data);
             html=html.replace(/[\r\n]/g, "");
            // 获取点击的按钮的数据 渲染到页面上
            mui.confirm(html, "温馨提示", ["确定", "取消"],function(e){
                if(e.index==1){
                    // 点了取消 滑回原来状态
                    setTimeout(function() {
                        mui.swipeoutClose(li);
                    }, 0);
                }else{
                    var size=$('.mui-btn.mui-btn-warning').data('size');
                    var num=mui('.mui-numbox').numbox().getValue();
                    // 发送ajax 请求
                    $.ajax({
                        url:'/cart/updateCart',
                        type:'post',
                        data:{id:data.id,size:size,num:num},
                        success:function(data){
                            if(data.success){
                                queryCart();
                            }else{
                                location="login.html?returnUrl="+location.href;
                            }
                        }

                    })
                }



            });
             //初始化数字输入框查件
             mui('.mui-numbox').numbox();
             // 给尺寸设置点击事件
             $('.detail-size .mui-btn').on('tap',function(){
                 // console.log($(this));
                 $(this).addClass('mui-btn-warning').siblings().removeClass('mui-btn-warning');
             })
        })
    }

    // 封装一个计算商品总数金额的函数
    function totalMoney(){
        //给复选框按钮注册一个change事件  获取所有选中的复选框  遍历求总和
      
            // 获取所有选中的复选框
            var checkbox=$('.cart-list .checkbox-product:checked');
            // console.log(checkbox);
            // 遍历数组  获取所有的价格和数量
            var sum=0;
             for(var i=0;i<checkbox.length;i++){
                //  console.log(checkbox[i]);
                 var num=$(checkbox[i]).data('num');
                 var price=$(checkbox[i]).data('price');
                 var count=num*price;
                 sum+=count;
             }
            //  console.log(sum);
            //  保留2位小数
             sum = sum.toFixed(2);
             console.log(sum);
            //  把数组渲染到页面上
            $('#order span').html(sum);
       
    }
    $('.cart-list').on('change','.checkbox-product',function(){
         // 执行计算总金额的函数
        totalMoney();
    })


    
    // 封装一个上拉和下拉函数
    // function pullrefresh() {

    //     mui.init({
    //         pullRefresh: {
    //             container: '#pullrefresh',
    //             down: {
    //                 callback: pulldownRefresh
    //             },
    //             up: {
    //                 // contentrefresh: '正在加载...',
    //                 callback: pullupRefresh
    //             }
    //         }
    //     });


    //     /**
    //      * 下拉刷新具体业务实现
    //      */
    //     function pulldownRefresh() {
    //         setTimeout(function () {


    //             mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
    //         }, 1000);
    //     }
       
    //     /**
    //      * 上拉加载具体业务实现
    //      */
    //     function pullupRefresh() {
    //         setTimeout(function () {
    //             $.ajax({
    //                 url:'/cart/queryCart',
    //                 // data: {
    //                 //     // 定义一个变量page存储了当前页码数 请求下一页让page进行++ 要前自增
    //                 //     page: ++page,
    //                 //     pageSize: 4
    //                 // },
    //                 success: function (res) {
    //                     // console.log(res);
    //                     // if (res.data) {
    //                     //     var html = template('cartTpl', res);
    //                     //     $('#main .cart-list').append(html);
    //                     //     mui('#pullrefresh').pullRefresh().endPullupToRefresh();
    //                     // } else {
    //                         // 9. 没有数据 结束转圈圈 并且提示没有数据了
    //                         mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
    //                     // }

    //                 }
    //             })
    //         }, 1000);
    //     }

    // }
})