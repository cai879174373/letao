

$(function () {

    // 执行分页查询
    queryCartPaging();
    // 执行删除函数
    deleteCart();
    // 执行上拉和下拉函数
    pullrefresh();
    // 执行计算总金额的函数
    totalMoney();

    // queryCart();
    var page = 1;
    // 封装一个查下购物车的函数

    function queryCart() {
        $.ajax({
            url: '/cart/queryCart',
            success: function (data) {
                console.log(data);
                //调用模板
                var html = template('cartTpl', {
                    list: data
                });
                $('#main .cart-list').html(html);
            }
        })
    }

    // 封装一个分页查询购物车函数
    function queryCartPaging() {
        $.ajax({
            url: '/cart/queryCartPaging',
            data: {
                page: 1,
                pageSize: 4
            },
            success: function (data) {
                console.log(data);
                if(data.error){
                    location="login.html?returnUrl="+location.href;
                }
                if(Array.isArray(data)){
                    data={
                        data:[]
                    }
                }
                    //调用模板
                var html = template('cartTpl', data);
                $('#main .cart-list').html(html);
                mui('#pullrefresh').pullRefresh().refresh(true);
            
                
            }
        })
    }
    // 封装一个删除购物车商品函数
    function deleteCart() {
        //   动态添加的用事件委托
        $('.cart-list').on('tap', '.btn-delete', function () {
            var that = this;

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
                                    // 重置page为第一页
                                    page=1;
                                    //删除成功
                                    $.ajax({
                                        url: '/cart/queryCartPaging',
                                        data: {
                                            page: page,
                                            pageSize: 4
                                        },
                                        success: function (data) {
                                            console.log(data);
                                            if(Array.isArray(data)){
                                                data={
                                                    data:[]
                                                }
                                            }
                                            //调用模板
                                            var html = template('cartTpl', data);
                                            $('#main .cart-list').html(html);
                                            // mui('#refreshContainer').pullRefresh().refresh(true);
                                            mui('#pullrefresh').pullRefresh().refresh(true);
                                        }
                                    })

                                }
                               
                            }
                        })
                       
                          

                        }else {
                            mui.toast('亲请继续选择', {
                                duration: 'long',
                                type: 'div'
                            })
                        }
                    // console.log(data);


                })

        })
    };

    // 封装一个计算商品总数金额的函数
    function totalMoney(){
        //给复选框按钮注册一个change事件  获取所有选中的复选框  遍历求总和
        $('.cart-list').on('change','.checkbox-product',function(){
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
        })
    }


    
    // 封装一个上拉和下拉函数
    function pullrefresh() {

        mui.init({
            pullRefresh: {
                container: '#pullrefresh',
                down: {
                    callback: pulldownRefresh
                },
                up: {
                    // contentrefresh: '正在加载...',
                    callback: pullupRefresh
                }
            }
        });


        /**
         * 下拉刷新具体业务实现
         */
        function pulldownRefresh() {
            setTimeout(function () {


                mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
            }, 1000);
        }
       
        /**
         * 上拉加载具体业务实现
         */
        function pullupRefresh() {
            setTimeout(function () {
                $.ajax({
                    url: '/cart/queryCartPaging',
                    data: {
                        // 定义一个变量page存储了当前页码数 请求下一页让page进行++ 要前自增
                        page: ++page,
                        pageSize: 4
                    },
                    success: function (res) {
                        console.log(res);
                        if (res.data) {
                            var html = template('cartTpl', res);
                            $('#main .cart-list').append(html);
                            mui('#pullrefresh').pullRefresh().endPullupToRefresh();
                        } else {
                            // 9. 没有数据 结束转圈圈 并且提示没有数据了
                            mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
                        }

                    }
                })
            }, 1000);
        }

    }
})