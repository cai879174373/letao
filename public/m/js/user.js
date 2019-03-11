$(function(){
    // 查询个人信息
// 执行查询信息函数
    queryUserMessage();
    // 封装一个查询信息的函数
// 执行退出登陆函数
    exitLogin();

    function queryUserMessage(){
        // 发送请求把个人信息渲染到页面上
        $.ajax({
            url:'/user/queryUserMessage',
            success:function(data){
                console.log(data);
                if(data.error){//判断是否登陆
                    location="login.html?returnUrl="+location.href;
                }else{
                    $('.username').html(data.username);
                    $('.mobile').html(data.mobile);
                }
               
               
            }
        })

    }

    // 封装一个退出登陆函数
    function exitLogin(){
        $('.exit-login').on('tap',function(){
            $.ajax({
                url:'/user/logout',
                success:function(data){
                    console.log(data);
                    if(data.success){
                        location="login.html?returnUrl="+location.href;
                    }
                }
            })
        })
      
    };
})