


$(function () {
    // 执行查询商品详情函数
    queryDetail();
    // 执行添加购物车函数
    addCart();

    // 封装一个初始化轮播图的函数
    function initScroll() {
        //获得slider插件对象
        var gallery = mui('.mui-slider');
        gallery.slider({
            interval: 1000 //自动轮播周期，若为0则不自动播放，默认为0；
        });
    }
    

    // 封装一个查询商品的函数
    function queryDetail(){
        var id=getQureyUrl('id');
        $.ajax({
            url:'/product/queryProductDetail',
            data:{id:id},
            success:function(data){
                // console.log(data);

               
                // 处理一下码数的数组
                var arr=data.size.split('-');
                // console.log(arr);
                var size=[];
                 for(var i=+arr[0];i<=+arr[1];i++){
                    size.push(i);
                 }
                 data.size=size;
                //  console.log(data.size);
                  // 调用模板
                var html=template('detailTpl',data);
                $('#main .mui-scroll').html(html);
                initScroll();
                // 初始化区域滚动查件
                mui('.mui-scroll-wrapper').scroll({
                    deceleration: 0.0005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
                    indicators: false
                });
                //初始化数字输入框查件
                mui('.mui-numbox').numbox();
                // 给尺寸设置点击事件
                $('.detail-size .mui-btn').on('tap',function(){
                    // console.log($(this));
                    $(this).addClass('mui-btn-warning').siblings().removeClass('mui-btn-warning');
                })
            }
        })
    };
    // 封装一个加载购物车的函数
    function addCart(){
        // 1.获取商品的id
        // 2获取产品的数量
        // 3获取产品的尺码
    // 注册加入购物车点击事件
    $('.btn-cart').on('tap',function(){
        // 获取产品的id;
        var productId=getQureyUrl('id');
        // console.log(productId);
        //获取产品数量
        var num=mui('.mui-numbox').numbox().getValue();
        //获取产品尺寸
        // 选中的按钮的尺码取出size值 所以是2个类名同时存在的
        var size=$('.mui-btn.mui-btn-warning').data('size');
        console.log(size);
        
        

        // 发送ajax请求获取成功或者失败
        $.ajax({
            type:'post',
            data:{productId:productId,num:num,size:size},
            url:'/cart/addCart',
            success:function(data){
                console.log(data);
                if(data.error){
                    //登陆失败 跳转到登陆页面 并且把当前的url值传过去
                    location="login.html?returnUrl="+location.href;
                }else{
                    // 登陆成功提示用户是否跳转
                    mui.confirm( '加入成功 是否前往购物车', '温馨提示', ['是','否'], function(e){
                        // console.log(e);
                        if(e.index==0){
                            //选择是  跳转到购物车页面 
                            location="cart.html";
                        }
                        if(e.index==1){
                            mui.toast('请亲继续添加',{ duration:'long', type:'div' }) 
                        }
                    } )
                }
            }
        });
    })

    }
    // 获取url的函数
    function getQureyUrl(name) {
        // 获取当前页面的url
        var pagepath = location.search.substr(1).split('&');
        // console.log(pagepath);
        // 遍历数组  去除search的值
        for (var i = 0; i < pagepath.length; i++) {
            if (pagepath[i].split('=')[0] == name) {
                return decodeURI(pagepath[i].split('=')[1]);
            }
        }
    }



});